import { useEffect, useMemo, useRef, useState } from "react";
import { Archive, Check, ChevronLeft, Loader2, PenLine, RefreshCw, Search } from "lucide-react";
import { ArchiveDialog } from "@/components/archive-dialog";
import { DateEditor } from "@/components/date-editor";
import { archiveWeek, getWeek, saveKoreksi } from "@/lib/koreksi-api";
import {
  formatCount,
  matchesFocus,
  type Broadcast,
  type FocusMode,
  type Santri,
  type StatusTab,
} from "@/lib/koreksi";

const FOCUS: { id: FocusMode; label: string }[] = [
  { id: "alpha", label: "Alpha" },
  { id: "izin", label: "Izin" },
  { id: "sakit", label: "Sakit" },
  { id: "all", label: "Semua" },
];

function focusClass(id: FocusMode, active: boolean): string {
  if (!active) return "border-line bg-surface text-fg";
  if (id === "alpha") return "border-alpha bg-alpha text-alpha-fg";
  if (id === "izin") return "border-izin bg-izin text-izin-fg";
  if (id === "sakit") return "border-sakit bg-sakit text-sakit-fg";
  return "border-fg bg-fg text-surface";
}

export function KoreksiApp() {
  const [santri, setSantri] = useState<Santri[]>([]);
  const [focus, setFocus] = useState<FocusMode>("alpha");
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);
  const [hideBroadcast, setHideBroadcast] = useState(false);
  const [daerah, setDaerah] = useState("ALL");
  const [tab, setTab] = useState<StatusTab>("belum");
  const [query, setQuery] = useState("");
  const [room, setRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [editing, setEditing] = useState<Santri | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const firstLoad = useRef(true);
  const toastTimer = useRef<number | null>(null);

  function notify(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
  }

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setError("");
    getWeek()
      .then((week) => {
        if (cancel) return;
        setSantri(week.santri);
        setBroadcast(week.broadcast);
        if (firstLoad.current) {
          setFocus(week.focus);
          const pending = new Map<string, number>();
          for (const row of week.santri) {
            if (row.done || !matchesFocus(row, week.focus)) continue;
            pending.set(row.daerah, (pending.get(row.daerah) ?? 0) + 1);
          }
          const first = [...pending.keys()].sort()[0];
          if (first) setDaerah(first);
          firstLoad.current = false;
        }
      })
      .catch((err: unknown) => {
        if (cancel) return;
        setError(err instanceof Error ? err.message : "Gagal memuat data.");
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    setRoom(null);
  }, [daerah, focus, tab]);

  const scoped = useMemo(
    () => santri.filter((s) => (daerah === "ALL" || s.daerah === daerah) && matchesFocus(s, focus)),
    [santri, daerah, focus],
  );

  const letters = useMemo(() => {
    const map = new Map<string, { total: number; belum: number }>();
    for (const s of santri) {
      if (!matchesFocus(s, focus)) continue;
      const cur = map.get(s.daerah) ?? { total: 0, belum: 0 };
      cur.total += 1;
      if (!s.done) cur.belum += 1;
      map.set(s.daerah, cur);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [santri, focus]);

  const visible = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (q) {
      return santri.filter((s) => {
        if (daerah !== "ALL" && s.daerah !== daerah) return false;
        const hay = `${s.nama} ${s.idPps} ${s.domisili} ${s.kelas} ${s.kategori} ${s.jalsah}`.toUpperCase();
        return hay.includes(q);
      });
    }
    return scoped.filter((s) => (tab === "belum" ? !s.done : s.done));
  }, [santri, scoped, daerah, query, tab]);

  const rooms = useMemo(() => {
    const map = new Map<string, Santri[]>();
    for (const s of visible) {
      const list = map.get(s.domisili) ?? [];
      list.push(s);
      map.set(s.domisili, list);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "id", { numeric: true }));
  }, [visible]);

  const roomSantri = room ? visible.filter((s) => s.domisili === room) : [];
  const scopedDone = scoped.filter((s) => s.done).length;
  const weekDone = santri.filter((s) => s.done).length;
  const percent = scoped.length > 0 ? Math.round((scopedDone / scoped.length) * 100) : 0;
  const searching = query.trim().length > 0;
  const focusLabel = FOCUS.find((item) => item.id === focus)?.label ?? "Semua";

  async function persist(next: Santri) {
    await saveKoreksi({
      data: {
        id: next.id,
        idPps: next.idPps,
        sakit: next.sakit,
        izin: next.izin,
        alpha: next.alpha,
        keterangan: next.keterangan,
      },
    });
    const saved = { ...next, done: true, status: "Sudah Dikoreksi" };
    setSantri((list) => list.map((s) => (s.id === saved.id ? saved : s)));
    setEditing((current) => (current?.id === saved.id ? saved : current));
    notify(`${saved.nama} tersimpan.`);
  }

  async function markSesuai(s: Santri) {
    if (s.alpha.length > 0 && !s.keterangan.trim()) {
      setEditing(s);
      notify("Alpha wajib ada keterangan. Isi dulu, lalu simpan.");
      return;
    }
    setSavingId(s.id);
    try {
      await persist(s);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSavingId(null);
    }
  }

  const progressText = loading
    ? "Memuat pekan ini…"
    : scoped.length === 0
      ? "Tidak ada santri pada saringan ini"
      : `${formatCount(scopedDone)} / ${formatCount(scoped.length)} selesai · ${focusLabel}${daerah === "ALL" ? "" : ` · Daerah ${daerah}`}`;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-primary-deep bg-primary text-primary-fg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-extrabold leading-tight">Koreksi Absen Pusat</h1>
            <p className="truncate text-xs font-semibold text-primary-muted">{progressText}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={() => setReloadKey((n) => n + 1)} className="grid size-11 place-items-center rounded-xl bg-primary-deep text-primary-fg" aria-label="Muat ulang">
              <RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button type="button" onClick={() => setArchiveOpen(true)} disabled={santri.length === 0} className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary-fg px-3 text-sm font-bold text-primary disabled:opacity-50">
              <Archive className="size-4" />
              Ke rekap
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-3">
          <div className="h-2 overflow-hidden rounded-full bg-primary-deep">
            <div className="h-full bg-primary-fg transition-[width] duration-300" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-1 text-xs font-medium text-primary-muted">
            Pekan ini {formatCount(santri.length)} santri · {formatCount(weekDone)} sudah dikoreksi
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4">
        {broadcast && !hideBroadcast ? (
          <div className={`flex items-start justify-between gap-3 rounded-2xl px-4 py-3 text-sm ${broadcast.type === "warning" ? "bg-izin-bg text-izin" : "bg-primary-soft text-primary"}`}>
            <p>
              <span className="font-extrabold">{broadcast.title || "Pengumuman"}. </span>
              {broadcast.message}
            </p>
            <button type="button" className="shrink-0 text-xs font-bold underline" onClick={() => setHideBroadcast(true)}>Tutup</button>
          </div>
        ) : null}

        <section className="rounded-3xl border border-line bg-surface p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-extrabold">Daerah</h2>
            <span className="text-xs font-semibold text-muted">Angka = belum selesai</span>
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <LetterChip
              label="Semua"
              count={letters.reduce((sum, [, info]) => sum + info.belum, 0)}
              active={daerah === "ALL"}
              onClick={() => setDaerah("ALL")}
            />
            {letters.map(([letter, info]) => (
              <LetterChip
                key={letter}
                label={letter}
                count={info.belum}
                active={daerah === letter}
                onClick={() => setDaerah(letter)}
              />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {FOCUS.map((item) => {
              const count = santri.filter((s) => (daerah === "ALL" || s.daerah === daerah) && matchesFocus(s, item.id) && !s.done).length;
              const active = focus === item.id;
              return (
                <button key={item.id} type="button" aria-pressed={active} onClick={() => setFocus(item.id)} className={`min-h-12 rounded-xl border px-1 py-1.5 text-xs font-extrabold leading-tight ${focusClass(item.id, active)}`}>
                  {item.label}
                  <span className="mt-0.5 block text-xs font-semibold opacity-80">{formatCount(count)}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" aria-pressed={tab === "belum"} onClick={() => setTab("belum")} className={`h-11 rounded-xl text-sm font-bold ${tab === "belum" ? "bg-fg text-surface" : "bg-bg text-muted"}`}>
              Belum ({formatCount(scoped.filter((s) => !s.done).length)})
            </button>
            <button type="button" aria-pressed={tab === "sudah"} onClick={() => setTab("sudah")} className={`h-11 rounded-xl text-sm font-bold ${tab === "sudah" ? "bg-fg text-surface" : "bg-bg text-muted"}`}>
              Selesai ({formatCount(scoped.filter((s) => s.done).length)})
            </button>
          </div>

          <label className="relative mt-3 block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setRoom(null);
              }}
              placeholder="Cari nama, ID, atau kamar"
              className="h-11 w-full rounded-xl border border-line bg-bg pr-3 pl-10 text-sm font-semibold outline-none focus:border-primary"
            />
          </label>
        </section>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-3xl bg-line/70" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-line bg-surface p-6 text-center">
            <p className="font-extrabold">Data pekan ini belum terbaca</p>
            <p className="mt-1 text-sm text-muted">{error}</p>
            <button type="button" onClick={() => setReloadKey((n) => n + 1)} className="mt-4 h-11 rounded-xl bg-primary px-4 text-sm font-bold text-primary-fg">Coba lagi</button>
          </div>
        ) : santri.length === 0 ? (
          <div className="rounded-3xl border border-line bg-surface p-6 text-center">
            <p className="text-lg font-extrabold">Koreksi pekan ini kosong</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">Tidak ada data yang menunggu koreksi. Tim unggah bisa mengunggah pekan baru.</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-3xl border border-line bg-surface p-6 text-center text-sm font-semibold text-muted">
            Tidak ada santri pada saringan ini.
          </div>
        ) : searching || room ? (
          <section className="flex flex-col gap-3">
            {room && !searching ? (
              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={() => setRoom(null)} className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-bold">
                  <ChevronLeft className="size-4" />
                  Semua kamar
                </button>
                <p className="text-sm font-extrabold">Kamar {room}</p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-muted">
                {formatCount(visible.length)} santri ditemukan. Pencarian tidak terikat filter jenis.
              </p>
            )}
            {(searching ? visible.slice(0, 40) : roomSantri).map((s) => (
              <StudentCard key={s.id} santri={s} saving={savingId === s.id} onEdit={() => setEditing(s)} onSesuai={() => markSesuai(s)} />
            ))}
            {searching && visible.length > 40 ? (
              <p className="text-center text-sm font-semibold text-muted">Menampilkan 40 dari {formatCount(visible.length)}. Perjelas pencarian.</p>
            ) : null}
          </section>
        ) : (
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {rooms.map(([name, list]) => (
              <button key={name} type="button" onClick={() => setRoom(name)} className="flex flex-col justify-between gap-4 rounded-3xl border border-line bg-surface p-4 text-left shadow-sm active:scale-[0.99]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-muted">Kamar</p>
                    <p className="text-xl font-extrabold leading-tight">{name}</p>
                  </div>
                  <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-fg">{list.length}</span>
                </div>
                <p className="text-xs font-bold text-primary">{tab === "belum" ? "Perlu dikoreksi" : "Sudah selesai"}</p>
              </button>
            ))}
          </section>
        )}

        {santri.length > 0 ? (
          <section className="rounded-3xl border border-line bg-surface p-4">
            <h2 className="font-extrabold">Selesai mengkoreksi?</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Pindahkan seluruh pekan ke database rekap. Tanggal 16–31 tinggal di bulan yang dipilih, tanggal 1–15 masuk bulan berikutnya. Daftar koreksi lalu kosong, dan tim unggah bisa mengisi data baru.
            </p>
            <button type="button" onClick={() => setArchiveOpen(true)} className="mt-3 inline-flex h-11 items-center gap-2 rounded-xl bg-fg px-4 text-sm font-bold text-surface">
              <Archive className="size-4" />
              Pindahkan ke database rekap
            </button>
          </section>
        ) : null}
      </main>

      {editing ? (
        <DateEditor
          santri={editing}
          onClose={() => setEditing(null)}
          onSave={async (next) => {
            await persist(next);
          }}
        />
      ) : null}

      {archiveOpen ? (
        <ArchiveDialog
          santri={santri}
          onClose={() => setArchiveOpen(false)}
          onArchive={async (bulan, tahun) => {
            const result = await archiveWeek({ data: { bulan, tahun } });
            setSantri([]);
            setArchiveOpen(false);
            setRoom(null);
            notify(result.message);
          }}
        />
      ) : null}

      {toast ? (
        <div role="status" className="fixed bottom-4 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-full bg-fg px-4 py-3 text-center text-sm font-semibold text-surface shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function LetterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-12 min-w-12 shrink-0 flex-col items-center justify-center rounded-xl border px-3 text-xs font-bold ${active ? "border-primary bg-primary text-primary-fg" : count === 0 ? "border-line bg-bg text-muted" : "border-line bg-surface text-fg"}`}
    >
      <span className="text-sm leading-none">{label}</span>
      <span className="mt-1 leading-none">{formatCount(count)}</span>
    </button>
  );
}

function StudentCard({
  santri,
  saving,
  onEdit,
  onSesuai,
}: {
  santri: Santri;
  saving: boolean;
  onEdit: () => void;
  onSesuai: () => void;
}) {
  const meta = [santri.kelas, santri.tingkat, santri.kategori].filter(Boolean).join(" · ");
  return (
    <article className="rounded-3xl border border-line bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-extrabold leading-snug">{santri.nama}</h3>
          <p className="mt-1 text-sm text-muted">
            ID {santri.idPps || "-"} · Kamar {santri.domisili} · Daerah {santri.daerah}
          </p>
          {meta ? <p className="text-sm text-muted">{meta}</p> : null}
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${santri.done ? "bg-primary-soft text-primary" : "bg-bg text-muted"}`}>
          {santri.done ? "Selesai" : "Belum"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
        <span className="rounded-full bg-sakit-bg px-2.5 py-1 text-sakit">Sakit {santri.sakit.length}</span>
        <span className="rounded-full bg-izin-bg px-2.5 py-1 text-izin">Izin {santri.izin.length}</span>
        <span className="rounded-full bg-alpha-bg px-2.5 py-1 text-alpha">Alpha {santri.alpha.length}</span>
      </div>
      {santri.keterangan ? <p className="mt-2 line-clamp-2 text-sm text-muted">Ket: {santri.keterangan}</p> : null}
      {santri.alpha.length > 0 && !santri.keterangan ? (
        <p className="mt-2 text-sm font-semibold text-alpha">Alpha belum ada keterangan.</p>
      ) : null}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" disabled={saving} onClick={onSesuai} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-soft text-sm font-bold text-primary disabled:opacity-60">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Sesuai
        </button>
        <button type="button" onClick={onEdit} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line text-sm font-bold">
          <PenLine className="size-4" />
          Ubah tanggal
        </button>
      </div>
    </article>
  );
}
