import { createServerFn } from "@tanstack/react-start";
import {
  HIJRI_MONTHS,
  mapWeek,
  type DateZone,
  type WeekPayload,
} from "@/lib/koreksi";

const API_URL = "https://api-taklimda.abdul-hannan-210421.workers.dev";

type SaveInput = {
  id: number;
  idPps: string;
  sakit: number[];
  izin: number[];
  alpha: number[];
  keterangan: string;
};

function datesOf(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const nums = value
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item >= 1 && item <= 31);
  return [...new Set(nums)].sort((a, b) => a - b);
}

async function readJson(res: Response): Promise<Record<string, unknown>> {
  const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok || !json || json.status === "error") {
    const message = typeof json?.message === "string" ? json.message : "Server menolak permintaan.";
    throw new Error(message);
  }
  return json;
}

export const getWeek = createServerFn({ method: "GET" }).handler(async (): Promise<WeekPayload> => {
  const res = await fetch(`${API_URL}?action=getAllInitData`, {
    signal: AbortSignal.timeout(60_000),
    headers: { Accept: "application/json" },
  });
  const json = (await res.json().catch(() => null)) as Parameters<typeof mapWeek>[0] | null;
  if (!res.ok || !json) throw new Error("Server koreksi tidak menjawab.");
  return mapWeek(json);
});

export const saveKoreksi = createServerFn({ method: "POST" })
  .validator((data: SaveInput) => {
    const id = Number(data?.id);
    if (!Number.isFinite(id)) throw new Error("Baris santri tidak dikenal.");
    const keterangan = String(data?.keterangan || "").trim().slice(0, 500);
    const alpha = datesOf(data?.alpha);
    if (alpha.length > 0 && !keterangan) {
      throw new Error("Keterangan wajib diisi karena ada tanggal alpha.");
    }
    return {
      id,
      idPps: String(data?.idPps || "").trim(),
      sakit: datesOf(data?.sakit),
      izin: datesOf(data?.izin),
      alpha,
      keterangan,
    };
  })
  .handler(async ({ data }) => {
    const join = (zone: DateZone) => (data[zone].length > 0 ? data[zone].join(", ") : "");
    await readJson(
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(60_000),
        body: JSON.stringify({
          action: "updateKoreksi",
          data: {
            _rowIndex: data.id,
            _idPps: data.idPps,
            tglSakit: join("sakit"),
            tglIzin: join("izin"),
            tglAlpha: join("alpha"),
            keterangan: data.keterangan || "-",
            status: "Sudah Dikoreksi",
          },
        }),
      }),
    );
    return { ok: true as const };
  });

export const archiveWeek = createServerFn({ method: "POST" })
  .validator((data: { bulan: string; tahun: string }) => {
    const bulan = String(data?.bulan || "").trim();
    const tahun = String(data?.tahun || "").trim();
    if (!HIJRI_MONTHS.includes(bulan as (typeof HIJRI_MONTHS)[number])) {
      throw new Error("Pilih bulan hijriah.");
    }
    if (!/^\d{4}$/.test(tahun)) throw new Error("Tahun hijriah harus 4 digit.");
    return { bulan, tahun };
  })
  .handler(async ({ data }) => {
    const json = await readJson(
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(180_000),
        body: JSON.stringify({
          action: "archiveAndResetWeek",
          bulanHijri: data.bulan,
          tahunHijri: data.tahun,
        }),
      }),
    );
    return {
      message:
        typeof json.message === "string"
          ? json.message
          : "Data pekan ini sudah dipindah ke database rekap.",
    };
  });
