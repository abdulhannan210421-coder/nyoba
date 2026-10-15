import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Undo2, X } from "lucide-react";
import type { DateZone, Santri } from "@/lib/koreksi";

type Buckets = Record<DateZone, number[]>;
type Draft = Buckets & { keterangan: string; past: Buckets[] };
type Pick = { tgl: number; from: DateZone };

const ZONES: { id: DateZone; label: string }[] = [
  { id: "alpha", label: "Alpha" },
  { id: "izin", label: "Izin" },
  { id: "sakit", label: "Sakit" },
];

const zoneTone: Record<DateZone, string> = {
  alpha: "border-alpha/30 bg-alpha-bg text-alpha",
  izin: "border-izin/30 bg-izin-bg text-izin",
  sakit: "border-sakit/30 bg-sakit-bg text-sakit",
};

function snap(b: Buckets): Buckets {
  return { sakit: [...b.sakit], izin: [...b.izin], alpha: [...b.alpha] };
}

export function DateEditor({
  santri,
  onClose,
  onSave,
}: {
  santri: Santri;
  onClose: () => void;
  onSave: (next: Santri) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Draft>({
    sakit: [...santri.sakit],
    izin: [...santri.izin],
    alpha: [...santri.alpha],
    keterangan: santri.keterangan,
    past: [],
  });
  const [picked, setPicked] = useState<Pick | null>(null);
  const [dateInput, setDateInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fotoOk, setFotoOk] = useState(Boolean(santri.foto));
  const ketRef = useRef<HTMLTextAreaElement>(null);
  const today = new Date().getDate();
  const needsNote = draft.alpha.length > 0 && !draft.keterangan.trim();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove("is-dragging");
    };
  }, []);

  function commit(to: DateZone | "trash", tgl: number) {
    setDraft((current) => {
      const already =
        to !== "trash" &&
        current[to].includes(tgl) &&
        current.sakit.filter((n) => n === tgl).length +
          current.izin.filter((n) => n === tgl).length +
          current.alpha.filter((n) => n === tgl).length ===
          1;
      if (already) return current;
      const next: Draft = {
        ...current,
        sakit: current.sakit.filter((n) => n !== tgl),
        izin: current.izin.filter((n) => n !== tgl),
        alpha: current.alpha.filter((n) => n !== tgl),
        past: [...current.past, snap(current)].slice(-30),
      };
      if (to !== "trash") next[to] = [...next[to], tgl].sort((a, b) => a - b);
      return next;
    });
    setPicked(null);
    setError("");
  }

  function undo() {
    setDraft((current) => {
      const prev = current.past[current.past.length - 1];
      if (!prev) return current;
      return { ...current, ...snap(prev), past: current.past.slice(0, -1) };
    });
    setPicked(null);
  }

  function addRaw(raw: string, to: DateZone) {
    const n = Number.parseInt(raw, 10);
    if (!Number.isInteger(n) || n < 1 || n > 31) {
      setError("Tanggal harus angka 1 sampai 31.");
      return;
    }
    commit(to, n);
    setDateInput("");
  }

  function onChipDown(event: ReactPointerEvent<HTMLDivElement>, tgl: number, from: DateZone) {
    if (event.button !== 0) return;
    const origin = event.currentTarget;
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;
    let ghost: HTMLDivElement | null = null;

    const clearHot = () => {
      document.querySelectorAll("[data-zone].zone-hot").forEach((el) => el.classList.remove("zone-hot"));
    };

    const onMove = (ev: globalThis.PointerEvent) => {
      if (!moved && Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) < 8) return;
      moved = true;
      document.body.classList.add("is-dragging");
      if (!ghost) {
        ghost = origin.cloneNode(true) as HTMLDivElement;
        ghost.style.position = "fixed";
        ghost.style.zIndex = "80";
        ghost.style.pointerEvents = "none";
        ghost.style.margin = "0";
        ghost.style.width = `${origin.offsetWidth}px`;
        document.body.appendChild(ghost);
        origin.style.opacity = "0.35";
      }
      ghost.style.left = `${ev.clientX - origin.offsetWidth / 2}px`;
      ghost.style.top = `${ev.clientY - 18}px`;
      clearHot();
      const zone = document.elementFromPoint(ev.clientX, ev.clientY)?.closest("[data-zone]");
      zone?.classList.add("zone-hot");
    };

    const onUp = (ev: globalThis.PointerEvent) => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.body.classList.remove("is-dragging");
      ghost?.remove();
      origin.style.opacity = "";
      const zone = document.elementFromPoint(ev.clientX, ev.clientY)?.closest("[data-zone]");
      clearHot();
      const target = zone?.getAttribute("data-zone");
      if (moved && (target === "sakit" || target === "izin" || target === "alpha" || target === "trash")) {
        if (target !== from) commit(target, tgl);
        return;
      }
      if (!moved) {
        setPicked((cur) => (cur?.tgl === tgl && cur.from === from ? null : { tgl, from }));
      }
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }

  async function save() {
    if (needsNote) {
      setError("Isi keterangan dulu. Alpha tidak boleh kosong keterangannya.");
      ketRef.current?.focus();
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSave({
        ...santri,
        sakit: draft.sakit,
        izin: draft.izin,
        alpha: draft.alpha,
        keterangan: draft.keterangan.trim(),
        done: true,
        status: "Sudah Dikoreksi",
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-fg/70 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="editor-title" className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Ubah tanggal</p>
            <h2 id="editor-title" className="truncate text-lg font-extrabold">{santri.nama}</h2>
            <p className="text-sm text-muted">
              ID {santri.idPps || "-"} · Kamar {santri.domisili} · Daerah {santri.daerah}
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={busy} className="grid size-11 shrink-0 place-items-center rounded-full bg-bg text-fg" aria-label="Tutup">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto px-4 py-3">
          <div className="flex gap-3 rounded-2xl border border-line bg-bg p-3">
            <div className="grid h-20 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary-soft text-primary">
              {fotoOk && santri.foto ? (
                <img src={santri.foto} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" onError={() => setFotoOk(false)} />
              ) : (
                <span className="text-xs font-bold">{santri.daerah}</span>
              )}
            </div>
            <div className="min-w-0 text-sm leading-relaxed text-muted">
              <p className="font-semibold text-fg">{[santri.tingkat, santri.kelas].filter(Boolean).join(" · ") || "Kelas belum terisi"}</p>
              <p>{[santri.kategori, santri.marhalah].filter(Boolean).join(" · ") || "Kategori belum terisi"}</p>
              <p>{santri.jalsah || "Jalsah belum terisi"}</p>
            </div>
          </div>

          <p className="text-sm text-muted">Tahan lalu geser tanggal, atau ketuk lalu pindahkan dengan tombol.</p>

          {ZONES.map((zone) => (
            <section key={zone.id} data-zone={zone.id} className={`rounded-2xl border p-3 ${zoneTone[zone.id]}`}>
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-extrabold">{zone.label}</h3>
                <span className="text-xs font-semibold">{draft[zone.id].length} tanggal</span>
              </div>
              <div className="flex min-h-12 flex-wrap gap-2">
                {draft[zone.id].length === 0 ? (
                  <span className="text-sm opacity-70">Kosong</span>
                ) : (
                  draft[zone.id].map((tgl) => {
                    const active = picked?.tgl === tgl && picked.from === zone.id;
                    return (
                      <div
                        key={`${zone.id}-${tgl}`}
                        onPointerDown={(event) => onChipDown(event, tgl, zone.id)}
                        className={`inline-flex h-11 touch-none items-center gap-1 rounded-xl border bg-surface px-3 text-sm font-bold ${active ? "border-primary ring-2 ring-primary" : "border-line"}`}
                      >
                        <span>Tgl {tgl}</span>
                        <button
                          type="button"
                          className="grid size-7 place-items-center rounded-full text-muted"
                          aria-label={`Hapus tanggal ${tgl}`}
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={() => commit("trash", tgl)}
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          ))}

          {picked ? (
            <div className="rounded-2xl border border-line bg-bg p-3">
              <p className="mb-2 text-sm font-semibold">Pindahkan tanggal {picked.tgl}</p>
              <div className="grid grid-cols-2 gap-2">
                {ZONES.filter((zone) => zone.id !== picked.from).map((zone) => (
                  <button key={zone.id} type="button" className="h-11 rounded-xl bg-surface px-3 text-sm font-bold text-fg ring-1 ring-line" onClick={() => commit(zone.id, picked.tgl)}>
                    Ke {zone.label}
                  </button>
                ))}
                <button type="button" className="h-11 rounded-xl bg-alpha px-3 text-sm font-bold text-alpha-fg" onClick={() => commit("trash", picked.tgl)}>
                  Hapus
                </button>
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-line p-3">
            <p className="mb-2 text-sm font-semibold">Tambah tanggal</p>
            <div className="flex gap-2">
              <input
                inputMode="numeric"
                value={dateInput}
                onChange={(event) => setDateInput(event.target.value.replace(/\D/g, "").slice(0, 2))}
                placeholder="1-31"
                aria-label="Tanggal baru"
                className="h-11 w-24 rounded-xl border border-line bg-surface px-3 text-sm font-semibold outline-none focus:border-primary"
              />
              <button type="button" className="h-11 flex-1 rounded-xl bg-bg px-2 text-xs font-bold text-fg" onClick={() => addRaw(String(today), "alpha")}>
                Hari ini ke Alpha
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {ZONES.map((zone) => (
                <button key={zone.id} type="button" className="h-11 rounded-xl bg-fg px-2 text-xs font-bold text-surface" onClick={() => addRaw(dateInput, zone.id)}>
                  + {zone.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-1 flex items-center justify-between text-sm font-semibold">
              Keterangan
              {draft.alpha.length > 0 ? <span className="text-xs font-bold text-alpha">Wajib, ada alpha</span> : <span className="text-xs font-medium text-muted">Opsional</span>}
            </span>
            <textarea
              ref={ketRef}
              value={draft.keterangan}
              onChange={(event) => {
                setDraft((current) => ({ ...current, keterangan: event.target.value }));
                setError("");
              }}
              rows={3}
              className={`w-full resize-none rounded-xl border bg-surface px-3 py-2 text-sm outline-none focus:border-primary ${needsNote ? "border-alpha" : "border-line"}`}
              placeholder="Contoh: haddam, pulang, atau alasan alpha"
            />
          </label>
          {error ? <p className="text-sm font-semibold text-alpha">{error}</p> : null}
          <div data-zone="trash" className="rounded-2xl border border-dashed border-alpha/40 bg-alpha-bg px-3 py-3 text-center text-sm font-semibold text-alpha">
            Geser tanggal ke sini untuk menghapus
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr_1fr] gap-2 border-t border-line px-4 py-3">
          <button type="button" onClick={undo} disabled={draft.past.length === 0 || busy} className="grid size-11 place-items-center rounded-xl border border-line text-fg disabled:opacity-40" aria-label="Urungkan">
            <Undo2 className="size-5" />
          </button>
          <button type="button" onClick={onClose} disabled={busy} className="h-11 rounded-xl border border-line text-sm font-bold">
            Batal
          </button>
          <button type="button" onClick={save} disabled={busy} className="h-11 rounded-xl bg-primary text-sm font-bold text-primary-fg disabled:opacity-60">
            {busy ? "Menyimpan…" : "Simpan koreksi"}
          </button>
        </div>
      </div>
    </div>
  );
}
