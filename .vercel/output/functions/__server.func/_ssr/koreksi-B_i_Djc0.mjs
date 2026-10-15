//#region node_modules/.nitro/vite/services/ssr/assets/koreksi-B_i_Djc0.js
var HIJRI_MONTHS = [
	"Muharram",
	"Safar",
	"Rabi'ul Awal",
	"Rabi'ul Akhir",
	"Jumadil Ula",
	"Jumadil Akhirah",
	"Rajab",
	"Sya'ban",
	"Ramadhan",
	"Syawal",
	"Dzulqa'dah",
	"Dzulhijjah"
];
function parseDates(val) {
	if (val == null) return [];
	let str = String(val).trim();
	if (!str || str === "-" || str === "0") return [];
	str = str.replace(/200(\d)/g, "$1");
	const parts = str.split(/[\s,;/\\-]+/).filter(Boolean);
	const result = [];
	for (const part of parts) {
		const digits = part.replace(/\D/g, "");
		if (!digits) continue;
		if (digits.length > 2) for (let i = 0; i < digits.length; i += 2) {
			const num = Number.parseInt(digits.substring(i, i + 2), 10);
			if (num >= 1 && num <= 31) result.push(num);
		}
		else {
			const num = Number.parseInt(digits, 10);
			if (num >= 1 && num <= 31) result.push(num);
		}
	}
	return [...new Set(result)].sort((a, b) => a - b);
}
function daerahOf(domisili, daerahField) {
	const field = daerahField.trim().toUpperCase();
	if (/^[A-Z]$/.test(field)) return field;
	const ch = domisili.trim().toUpperCase().charAt(0);
	return /[A-Z]/.test(ch) ? ch : "?";
}
function matchesFocus(s, focus) {
	if (focus === "alpha") return s.alpha.length > 0;
	if (focus === "izin") return s.izin.length > 0;
	if (focus === "sakit") return s.sakit.length > 0;
	return true;
}
function nextHijri(bulan, tahun) {
	const idx = HIJRI_MONTHS.findIndex((m) => m.toLowerCase() === bulan.trim().toLowerCase());
	let y = Number.parseInt(tahun, 10);
	if (!Number.isFinite(y)) y = 1448;
	if (idx < 0) return {
		bulan: bulan || HIJRI_MONTHS[0],
		tahun: String(y)
	};
	const next = (idx + 1) % 12;
	return {
		bulan: HIJRI_MONTHS[next],
		tahun: String(next === 0 ? y + 1 : y)
	};
}
function archiveSplit(list) {
	let stay = 0;
	let next = 0;
	for (const s of list) {
		const late = [
			...s.sakit,
			...s.izin,
			...s.alpha
		].some((d) => d > 15);
		const early = [
			...s.sakit,
			...s.izin,
			...s.alpha
		].some((d) => d <= 15);
		if (late || !late && !early) stay += 1;
		if (early) next += 1;
	}
	return {
		stay,
		next
	};
}
function cleanText(val) {
	const text = String(val ?? "").trim();
	if (!text || text === "-" || text.toUpperCase() === "NULL") return "";
	return text;
}
function mapRow(row) {
	const id = Number(row._rowIndex);
	if (!Number.isFinite(id)) return null;
	const domisili = cleanText(row.domisili).toUpperCase();
	const status = cleanText(row.status) || "Belum Dikoreksi";
	const doneByStatus = /sudah|sesuai|benar/i.test(status) && !/belum/i.test(status);
	return {
		id,
		idPps: cleanText(row.idpps),
		nama: cleanText(row.namasantri) || "Tanpa nama",
		domisili: domisili || "LAIN-LAIN",
		daerah: daerahOf(domisili, cleanText(row._daerah)),
		kelas: cleanText(row.kelas),
		tingkat: cleanText(row.tingkat),
		kategori: cleanText(row.kategori),
		marhalah: cleanText(row.marhalah_jilid),
		jalsah: cleanText(row.jalsah),
		kelasKitab: cleanText(row.kelas_kitab),
		majlisKitab: cleanText(row.majlis_kitab),
		sakit: parseDates(row.tglsakit),
		izin: parseDates(row.tglizin),
		alpha: parseDates(row.tglalpha),
		keterangan: cleanText(row.keterangan),
		done: row._isDone === true || doneByStatus,
		foto: cleanText(row._foto),
		status
	};
}
function mapWeek(json) {
	if (json.status === "error") throw new Error(json.message || "Gagal memuat data koreksi.");
	const focusRaw = String(json.config?.filterAbsen || "all").toLowerCase();
	const focus = focusRaw === "alpha" || focusRaw === "izin" || focusRaw === "sakit" || focusRaw === "all" ? focusRaw : "all";
	return {
		santri: (json.rekap || []).filter((row) => !row._source || row._source === "koreksi").map(mapRow).filter((row) => row !== null).sort((a, b) => a.nama.localeCompare(b.nama, "id")),
		focus,
		broadcast: json.broadcast && json.broadcast.active && json.broadcast.message ? json.broadcast : null
	};
}
function formatCount(n) {
	return new Intl.NumberFormat("id-ID").format(n);
}
//#endregion
export { matchesFocus as a, mapWeek as i, archiveSplit as n, nextHijri as o, formatCount as r, HIJRI_MONTHS as t };
