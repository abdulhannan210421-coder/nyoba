import { useState } from "react";
import { X } from "lucide-react";
import { HIJRI_MONTHS, archiveSplit, formatCount, nextHijri, type Santri } from "@/lib/koreksi";

export function ArchiveDialog({
  santri,
  onClose,
  onArchive,
}: {
  santri: Santri[];
  onClose: () => void;
  onArchive: (bulan: string, tahun: string) => Promise<void>;
}) {
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("1448");
  const [ack, setAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const unfinished = santri.filter((s) => !s.done).length;
  const split = bulan ? archiveSplit(santri) : null;
  const next = bulan ? nextHijri(bulan, tahun || "1448") : null;
  const blocked = !bulan || !/^\d{4}$/.test(tahun) || (unfinished > 0 && !ack) || busy;

  async function submit() {
    setBusy(true);
    setError("");
    try {
      await onArchive(bulan, tahun);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memindahkan data.");
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-fg/70 sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="archive-title" className="w-full max-w-lg rounded-t-3xl bg-surface p-4 shadow-2xl sm:rounded-3xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Database rekap</p>
            <h2 id="archive-title" className="text-lg font-extrabold">Pindahkan pekan ini</h2>
          </div>
          <button type="button" onClick={onClose} disabled={busy} className="grid size-11 place-items-center rounded-full bg-bg" aria-label="Tutup">
            <X className="size-5" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-muted">
          Seluruh {formatCount(santri.length)} santri di koreksi pekan ini ikut pindah, bukan hanya daerah atau jenis yang sedang ditampilkan. Setelah itu daftar koreksi dikosongkan supaya tim unggah bisa mengisi data baru.
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Bulan hijriah
            <select value={bulan} onChange={(e) => setBulan(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm font-semibold">
              <option value="">Pilih bulan</option>
              {HIJRI_MONTHS.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Tahun hijriah
            <input value={tahun} inputMode="numeric" onChange={(e) => setTahun(e.target.value.replace(/\D/g, "").slice(0, 4))} className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm font-semibold outline-none focus:border-primary" />
          </label>
        </div>

        {split && next ? (
          <div className="mt-3 rounded-2xl bg-bg p-3 text-sm leading-relaxed">
            <p>Tanggal 16–31, dan santri tanpa tanggal, masuk <b>{bulan} {tahun}</b> ({formatCount(split.stay)} baris).</p>
            <p>Tanggal 1–15 masuk <b>{next.bulan} {next.tahun}</b> ({formatCount(split.next)} baris).</p>
          </div>
        ) : null}

        {unfinished > 0 ? (
          <label className="mt-3 flex items-start gap-3 rounded-2xl bg-izin-bg p-3 text-sm font-semibold text-izin">
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-1 size-5 accent-primary" />
            <span>Masih {formatCount(unfinished)} santri belum dikoreksi. Saya paham mereka tetap ikut dipindah dan koreksi pekan ini dikosongkan.</span>
          </label>
        ) : (
          <p className="mt-3 rounded-2xl bg-primary-soft p-3 text-sm font-semibold text-primary">Semua santri pekan ini sudah dikoreksi.</p>
        )}

        {error ? <p className="mt-3 text-sm font-semibold text-alpha">{error}</p> : null}

        <button type="button" disabled={blocked} onClick={submit} className="mt-4 h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-fg disabled:opacity-50">
          {busy ? "Memindahkan… jangan ditutup" : "Pindahkan ke database rekap"}
        </button>
      </div>
    </div>
  );
}
