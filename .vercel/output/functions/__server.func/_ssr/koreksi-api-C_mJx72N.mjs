import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as mapWeek, t as HIJRI_MONTHS } from "./koreksi-B_i_Djc0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/koreksi-api-C_mJx72N.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var API_URL = "https://api-taklimda.abdul-hannan-210421.workers.dev";
function datesOf(value) {
	if (!Array.isArray(value)) return [];
	const nums = value.map((item) => Number(item)).filter((item) => Number.isInteger(item) && item >= 1 && item <= 31);
	return [...new Set(nums)].sort((a, b) => a - b);
}
async function readJson(res) {
	const json = await res.json().catch(() => null);
	if (!res.ok || !json || json.status === "error") {
		const message = typeof json?.message === "string" ? json.message : "Server menolak permintaan.";
		throw new Error(message);
	}
	return json;
}
var getWeek_createServerFn_handler = createServerRpc({
	id: "ea72181676d1a14612f9e3b7a154c48f25c4f91dd6aaa688ded553cf22a6b67f",
	name: "getWeek",
	filename: "src/lib/koreksi-api.ts"
}, (opts) => getWeek.__executeServer(opts));
var getWeek = createServerFn({ method: "GET" }).handler(getWeek_createServerFn_handler, async () => {
	const res = await fetch(`${API_URL}?action=getAllInitData`, {
		signal: AbortSignal.timeout(6e4),
		headers: { Accept: "application/json" }
	});
	const json = await res.json().catch(() => null);
	if (!res.ok || !json) throw new Error("Server koreksi tidak menjawab.");
	return mapWeek(json);
});
var saveKoreksi_createServerFn_handler = createServerRpc({
	id: "d9d0fbdd7694547ae8842b180efeb7c12e1b1e7ce4a62f1c736d13137122c9a0",
	name: "saveKoreksi",
	filename: "src/lib/koreksi-api.ts"
}, (opts) => saveKoreksi.__executeServer(opts));
var saveKoreksi = createServerFn({ method: "POST" }).validator((data) => {
	const id = Number(data?.id);
	if (!Number.isFinite(id)) throw new Error("Baris santri tidak dikenal.");
	const keterangan = String(data?.keterangan || "").trim().slice(0, 500);
	const alpha = datesOf(data?.alpha);
	if (alpha.length > 0 && !keterangan) throw new Error("Keterangan wajib diisi karena ada tanggal alpha.");
	return {
		id,
		idPps: String(data?.idPps || "").trim(),
		sakit: datesOf(data?.sakit),
		izin: datesOf(data?.izin),
		alpha,
		keterangan
	};
}).handler(saveKoreksi_createServerFn_handler, async ({ data }) => {
	const join = (zone) => data[zone].length > 0 ? data[zone].join(", ") : "";
	await readJson(await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		signal: AbortSignal.timeout(6e4),
		body: JSON.stringify({
			action: "updateKoreksi",
			data: {
				_rowIndex: data.id,
				_idPps: data.idPps,
				tglSakit: join("sakit"),
				tglIzin: join("izin"),
				tglAlpha: join("alpha"),
				keterangan: data.keterangan || "-",
				status: "Sudah Dikoreksi"
			}
		})
	}));
	return { ok: true };
});
var archiveWeek_createServerFn_handler = createServerRpc({
	id: "90ded6914406d8032932d8f400388f3bbb8b837511e77e682a9510367054a317",
	name: "archiveWeek",
	filename: "src/lib/koreksi-api.ts"
}, (opts) => archiveWeek.__executeServer(opts));
var archiveWeek = createServerFn({ method: "POST" }).validator((data) => {
	const bulan = String(data?.bulan || "").trim();
	const tahun = String(data?.tahun || "").trim();
	if (!HIJRI_MONTHS.includes(bulan)) throw new Error("Pilih bulan hijriah.");
	if (!/^\d{4}$/.test(tahun)) throw new Error("Tahun hijriah harus 4 digit.");
	return {
		bulan,
		tahun
	};
}).handler(archiveWeek_createServerFn_handler, async ({ data }) => {
	const json = await readJson(await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		signal: AbortSignal.timeout(18e4),
		body: JSON.stringify({
			action: "archiveAndResetWeek",
			bulanHijri: data.bulan,
			tahunHijri: data.tahun
		})
	}));
	return { message: typeof json.message === "string" ? json.message : "Data pekan ini sudah dipindah ke database rekap." };
});
//#endregion
export { archiveWeek_createServerFn_handler, getWeek_createServerFn_handler, saveKoreksi_createServerFn_handler };
