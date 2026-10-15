import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as matchesFocus, n as archiveSplit, o as nextHijri, r as formatCount, t as HIJRI_MONTHS } from "./koreksi-B_i_Djc0.mjs";
import { a as RefreshCw, c as ChevronLeft, i as Search, l as Check, n as Undo2, o as PenLine, s as LoaderCircle, t as X, u as Archive } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CMJ6zzHL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ArchiveDialog({ santri, onClose, onArchive }) {
	const [bulan, setBulan] = (0, import_react.useState)("");
	const [tahun, setTahun] = (0, import_react.useState)("1448");
	const [ack, setAck] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const unfinished = santri.filter((s) => !s.done).length;
	const split = bulan ? archiveSplit(santri) : null;
	const next = bulan ? nextHijri(bulan, tahun || "1448") : null;
	const blocked = !bulan || !/^\d{4}$/.test(tahun) || unfinished > 0 && !ack || busy;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center bg-fg/70 sm:items-center sm:p-4",
		onMouseDown: (e) => {
			if (e.target === e.currentTarget && !busy) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "archive-title",
			className: "w-full max-w-lg rounded-t-3xl bg-surface p-4 shadow-2xl sm:rounded-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted",
						children: "Database rekap"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "archive-title",
						className: "text-lg font-extrabold",
						children: "Pindahkan pekan ini"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						disabled: busy,
						className: "grid size-11 place-items-center rounded-full bg-bg",
						"aria-label": "Tutup",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: [
						"Seluruh ",
						formatCount(santri.length),
						" santri di koreksi pekan ini ikut pindah, bukan hanya daerah atau jenis yang sedang ditampilkan. Setelah itu daftar koreksi dikosongkan supaya tim unggah bisa mengisi data baru."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-2 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold",
						children: ["Bulan hijriah", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: bulan,
							onChange: (e) => setBulan(e.target.value),
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Pilih bulan"
							}), HIJRI_MONTHS.map((month) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: month,
								children: month
							}, month))]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold",
						children: ["Tahun hijriah", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: tahun,
							inputMode: "numeric",
							onChange: (e) => setTahun(e.target.value.replace(/\D/g, "").slice(0, 4)),
							className: "mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm font-semibold outline-none focus:border-primary"
						})]
					})]
				}),
				split && next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 rounded-2xl bg-bg p-3 text-sm leading-relaxed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Tanggal 16–31, dan santri tanpa tanggal, masuk ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
							bulan,
							" ",
							tahun
						] }),
						" (",
						formatCount(split.stay),
						" baris)."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Tanggal 1–15 masuk ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
							next.bulan,
							" ",
							next.tahun
						] }),
						" (",
						formatCount(split.next),
						" baris)."
					] })]
				}) : null,
				unfinished > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex items-start gap-3 rounded-2xl bg-izin-bg p-3 text-sm font-semibold text-izin",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: ack,
						onChange: (e) => setAck(e.target.checked),
						className: "mt-1 size-5 accent-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Masih ",
						formatCount(unfinished),
						" santri belum dikoreksi. Saya paham mereka tetap ikut dipindah dan koreksi pekan ini dikosongkan."
					] })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-2xl bg-primary-soft p-3 text-sm font-semibold text-primary",
					children: "Semua santri pekan ini sudah dikoreksi."
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm font-semibold text-alpha",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: blocked,
					onClick: submit,
					className: "mt-4 h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-fg disabled:opacity-50",
					children: busy ? "Memindahkan… jangan ditutup" : "Pindahkan ke database rekap"
				})
			]
		})
	});
}
var ZONES = [
	{
		id: "alpha",
		label: "Alpha"
	},
	{
		id: "izin",
		label: "Izin"
	},
	{
		id: "sakit",
		label: "Sakit"
	}
];
var zoneTone = {
	alpha: "border-alpha/30 bg-alpha-bg text-alpha",
	izin: "border-izin/30 bg-izin-bg text-izin",
	sakit: "border-sakit/30 bg-sakit-bg text-sakit"
};
function snap(b) {
	return {
		sakit: [...b.sakit],
		izin: [...b.izin],
		alpha: [...b.alpha]
	};
}
function DateEditor({ santri, onClose, onSave }) {
	const [draft, setDraft] = (0, import_react.useState)({
		sakit: [...santri.sakit],
		izin: [...santri.izin],
		alpha: [...santri.alpha],
		keterangan: santri.keterangan,
		past: []
	});
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [dateInput, setDateInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [fotoOk, setFotoOk] = (0, import_react.useState)(Boolean(santri.foto));
	const ketRef = (0, import_react.useRef)(null);
	const today = (/* @__PURE__ */ new Date()).getDate();
	const needsNote = draft.alpha.length > 0 && !draft.keterangan.trim();
	(0, import_react.useEffect)(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
			document.body.classList.remove("is-dragging");
		};
	}, []);
	function commit(to, tgl) {
		setDraft((current) => {
			if (to !== "trash" && current[to].includes(tgl) && current.sakit.filter((n) => n === tgl).length + current.izin.filter((n) => n === tgl).length + current.alpha.filter((n) => n === tgl).length === 1) return current;
			const next = {
				...current,
				sakit: current.sakit.filter((n) => n !== tgl),
				izin: current.izin.filter((n) => n !== tgl),
				alpha: current.alpha.filter((n) => n !== tgl),
				past: [...current.past, snap(current)].slice(-30)
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
			return {
				...current,
				...snap(prev),
				past: current.past.slice(0, -1)
			};
		});
		setPicked(null);
	}
	function addRaw(raw, to) {
		const n = Number.parseInt(raw, 10);
		if (!Number.isInteger(n) || n < 1 || n > 31) {
			setError("Tanggal harus angka 1 sampai 31.");
			return;
		}
		commit(to, n);
		setDateInput("");
	}
	function onChipDown(event, tgl, from) {
		if (event.button !== 0) return;
		const origin = event.currentTarget;
		const startX = event.clientX;
		const startY = event.clientY;
		let moved = false;
		let ghost = null;
		const clearHot = () => {
			document.querySelectorAll("[data-zone].zone-hot").forEach((el) => el.classList.remove("zone-hot"));
		};
		const onMove = (ev) => {
			if (!moved && Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) < 8) return;
			moved = true;
			document.body.classList.add("is-dragging");
			if (!ghost) {
				ghost = origin.cloneNode(true);
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
			(document.elementFromPoint(ev.clientX, ev.clientY)?.closest("[data-zone]"))?.classList.add("zone-hot");
		};
		const onUp = (ev) => {
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
			if (!moved) setPicked((cur) => cur?.tgl === tgl && cur.from === from ? null : {
				tgl,
				from
			});
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
				status: "Sudah Dikoreksi"
			});
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Gagal menyimpan.");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center bg-fg/70 p-0 sm:items-center sm:p-4",
		role: "presentation",
		onMouseDown: (e) => {
			if (e.target === e.currentTarget && !busy) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "editor-title",
			className: "flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 border-b border-line px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wide text-muted",
								children: "Ubah tanggal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "editor-title",
								className: "truncate text-lg font-extrabold",
								children: santri.nama
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									"ID ",
									santri.idPps || "-",
									" · Kamar ",
									santri.domisili,
									" · Daerah ",
									santri.daerah
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						disabled: busy,
						className: "grid size-11 shrink-0 place-items-center rounded-full bg-bg text-fg",
						"aria-label": "Tutup",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 overflow-y-auto px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 rounded-2xl border border-line bg-bg p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-20 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary-soft text-primary",
								children: fotoOk && santri.foto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: santri.foto,
									alt: "",
									referrerPolicy: "no-referrer",
									className: "h-full w-full object-cover",
									onError: () => setFotoOk(false)
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold",
									children: santri.daerah
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 text-sm leading-relaxed text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-fg",
										children: [santri.tingkat, santri.kelas].filter(Boolean).join(" · ") || "Kelas belum terisi"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: [santri.kategori, santri.marhalah].filter(Boolean).join(" · ") || "Kategori belum terisi" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: santri.jalsah || "Jalsah belum terisi" })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Tahan lalu geser tanggal, atau ketuk lalu pindahkan dengan tombol."
						}),
						ZONES.map((zone) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"data-zone": zone.id,
							className: `rounded-2xl border p-3 ${zoneTone[zone.id]}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-extrabold",
									children: zone.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold",
									children: [draft[zone.id].length, " tanggal"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex min-h-12 flex-wrap gap-2",
								children: draft[zone.id].length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm opacity-70",
									children: "Kosong"
								}) : draft[zone.id].map((tgl) => {
									const active = picked?.tgl === tgl && picked.from === zone.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onPointerDown: (event) => onChipDown(event, tgl, zone.id),
										className: `inline-flex h-11 touch-none items-center gap-1 rounded-xl border bg-surface px-3 text-sm font-bold ${active ? "border-primary ring-2 ring-primary" : "border-line"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Tgl ", tgl] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "grid size-7 place-items-center rounded-full text-muted",
											"aria-label": `Hapus tanggal ${tgl}`,
											onPointerDown: (event) => event.stopPropagation(),
											onClick: () => commit("trash", tgl),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
										})]
									}, `${zone.id}-${tgl}`);
								})
							})]
						}, zone.id)),
						picked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-line bg-bg p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-2 text-sm font-semibold",
								children: ["Pindahkan tanggal ", picked.tgl]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [ZONES.filter((zone) => zone.id !== picked.from).map((zone) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "h-11 rounded-xl bg-surface px-3 text-sm font-bold text-fg ring-1 ring-line",
									onClick: () => commit(zone.id, picked.tgl),
									children: ["Ke ", zone.label]
								}, zone.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-11 rounded-xl bg-alpha px-3 text-sm font-bold text-alpha-fg",
									onClick: () => commit("trash", picked.tgl),
									children: "Hapus"
								})]
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-line p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 text-sm font-semibold",
									children: "Tambah tanggal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										inputMode: "numeric",
										value: dateInput,
										onChange: (event) => setDateInput(event.target.value.replace(/\D/g, "").slice(0, 2)),
										placeholder: "1-31",
										"aria-label": "Tanggal baru",
										className: "h-11 w-24 rounded-xl border border-line bg-surface px-3 text-sm font-semibold outline-none focus:border-primary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-11 flex-1 rounded-xl bg-bg px-2 text-xs font-bold text-fg",
										onClick: () => addRaw(String(today), "alpha"),
										children: "Hari ini ke Alpha"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 grid grid-cols-3 gap-2",
									children: ZONES.map((zone) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "h-11 rounded-xl bg-fg px-2 text-xs font-bold text-surface",
										onClick: () => addRaw(dateInput, zone.id),
										children: ["+ ", zone.label]
									}, zone.id))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mb-1 flex items-center justify-between text-sm font-semibold",
								children: ["Keterangan", draft.alpha.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-alpha",
									children: "Wajib, ada alpha"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted",
									children: "Opsional"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: ketRef,
								value: draft.keterangan,
								onChange: (event) => {
									setDraft((current) => ({
										...current,
										keterangan: event.target.value
									}));
									setError("");
								},
								rows: 3,
								className: `w-full resize-none rounded-xl border bg-surface px-3 py-2 text-sm outline-none focus:border-primary ${needsNote ? "border-alpha" : "border-line"}`,
								placeholder: "Contoh: haddam, pulang, atau alasan alpha"
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-alpha",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-zone": "trash",
							className: "rounded-2xl border border-dashed border-alpha/40 bg-alpha-bg px-3 py-3 text-center text-sm font-semibold text-alpha",
							children: "Geser tanggal ke sini untuk menghapus"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[auto_1fr_1fr] gap-2 border-t border-line px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: undo,
							disabled: draft.past.length === 0 || busy,
							className: "grid size-11 place-items-center rounded-xl border border-line text-fg disabled:opacity-40",
							"aria-label": "Urungkan",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							disabled: busy,
							className: "h-11 rounded-xl border border-line text-sm font-bold",
							children: "Batal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: save,
							disabled: busy,
							className: "h-11 rounded-xl bg-primary text-sm font-bold text-primary-fg disabled:opacity-60",
							children: busy ? "Menyimpan…" : "Simpan koreksi"
						})
					]
				})
			]
		})
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function datesOf(value) {
	if (!Array.isArray(value)) return [];
	const nums = value.map((item) => Number(item)).filter((item) => Number.isInteger(item) && item >= 1 && item <= 31);
	return [...new Set(nums)].sort((a, b) => a - b);
}
var getWeek = createServerFn({ method: "GET" }).handler(createSsrRpc("ea72181676d1a14612f9e3b7a154c48f25c4f91dd6aaa688ded553cf22a6b67f"));
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
}).handler(createSsrRpc("d9d0fbdd7694547ae8842b180efeb7c12e1b1e7ce4a62f1c736d13137122c9a0"));
var archiveWeek = createServerFn({ method: "POST" }).validator((data) => {
	const bulan = String(data?.bulan || "").trim();
	const tahun = String(data?.tahun || "").trim();
	if (!HIJRI_MONTHS.includes(bulan)) throw new Error("Pilih bulan hijriah.");
	if (!/^\d{4}$/.test(tahun)) throw new Error("Tahun hijriah harus 4 digit.");
	return {
		bulan,
		tahun
	};
}).handler(createSsrRpc("90ded6914406d8032932d8f400388f3bbb8b837511e77e682a9510367054a317"));
var FOCUS = [
	{
		id: "alpha",
		label: "Alpha"
	},
	{
		id: "izin",
		label: "Izin"
	},
	{
		id: "sakit",
		label: "Sakit"
	},
	{
		id: "all",
		label: "Semua"
	}
];
function focusClass(id, active) {
	if (!active) return "border-line bg-surface text-fg";
	if (id === "alpha") return "border-alpha bg-alpha text-alpha-fg";
	if (id === "izin") return "border-izin bg-izin text-izin-fg";
	if (id === "sakit") return "border-sakit bg-sakit text-sakit-fg";
	return "border-fg bg-fg text-surface";
}
function KoreksiApp() {
	const [santri, setSantri] = (0, import_react.useState)([]);
	const [focus, setFocus] = (0, import_react.useState)("alpha");
	const [broadcast, setBroadcast] = (0, import_react.useState)(null);
	const [hideBroadcast, setHideBroadcast] = (0, import_react.useState)(false);
	const [daerah, setDaerah] = (0, import_react.useState)("ALL");
	const [tab, setTab] = (0, import_react.useState)("belum");
	const [query, setQuery] = (0, import_react.useState)("");
	const [room, setRoom] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [reloadKey, setReloadKey] = (0, import_react.useState)(0);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [archiveOpen, setArchiveOpen] = (0, import_react.useState)(false);
	const [savingId, setSavingId] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)("");
	const firstLoad = (0, import_react.useRef)(true);
	const toastTimer = (0, import_react.useRef)(null);
	function notify(message) {
		setToast(message);
		if (toastTimer.current) window.clearTimeout(toastTimer.current);
		toastTimer.current = window.setTimeout(() => setToast(""), 2800);
	}
	(0, import_react.useEffect)(() => {
		let cancel = false;
		setLoading(true);
		setError("");
		getWeek().then((week) => {
			if (cancel) return;
			setSantri(week.santri);
			setBroadcast(week.broadcast);
			if (firstLoad.current) {
				setFocus(week.focus);
				const pending = /* @__PURE__ */ new Map();
				for (const row of week.santri) {
					if (row.done || !matchesFocus(row, week.focus)) continue;
					pending.set(row.daerah, (pending.get(row.daerah) ?? 0) + 1);
				}
				const first = [...pending.keys()].sort()[0];
				if (first) setDaerah(first);
				firstLoad.current = false;
			}
		}).catch((err) => {
			if (cancel) return;
			setError(err instanceof Error ? err.message : "Gagal memuat data.");
		}).finally(() => {
			if (!cancel) setLoading(false);
		});
		return () => {
			cancel = true;
		};
	}, [reloadKey]);
	(0, import_react.useEffect)(() => {
		setRoom(null);
	}, [
		daerah,
		focus,
		tab
	]);
	const scoped = (0, import_react.useMemo)(() => santri.filter((s) => (daerah === "ALL" || s.daerah === daerah) && matchesFocus(s, focus)), [
		santri,
		daerah,
		focus
	]);
	const letters = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const s of santri) {
			if (!matchesFocus(s, focus)) continue;
			const cur = map.get(s.daerah) ?? {
				total: 0,
				belum: 0
			};
			cur.total += 1;
			if (!s.done) cur.belum += 1;
			map.set(s.daerah, cur);
		}
		return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
	}, [santri, focus]);
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toUpperCase();
		if (q) return santri.filter((s) => {
			if (daerah !== "ALL" && s.daerah !== daerah) return false;
			return `${s.nama} ${s.idPps} ${s.domisili} ${s.kelas} ${s.kategori} ${s.jalsah}`.toUpperCase().includes(q);
		});
		return scoped.filter((s) => tab === "belum" ? !s.done : s.done);
	}, [
		santri,
		scoped,
		daerah,
		query,
		tab
	]);
	const rooms = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
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
	const percent = scoped.length > 0 ? Math.round(scopedDone / scoped.length * 100) : 0;
	const searching = query.trim().length > 0;
	const focusLabel = FOCUS.find((item) => item.id === focus)?.label ?? "Semua";
	async function persist(next) {
		await saveKoreksi({ data: {
			id: next.id,
			idPps: next.idPps,
			sakit: next.sakit,
			izin: next.izin,
			alpha: next.alpha,
			keterangan: next.keterangan
		} });
		const saved = {
			...next,
			done: true,
			status: "Sudah Dikoreksi"
		};
		setSantri((list) => list.map((s) => s.id === saved.id ? saved : s));
		setEditing((current) => current?.id === saved.id ? saved : current);
		notify(`${saved.nama} tersimpan.`);
	}
	async function markSesuai(s) {
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
	const progressText = loading ? "Memuat pekan ini…" : scoped.length === 0 ? "Tidak ada santri pada saringan ini" : `${formatCount(scopedDone)} / ${formatCount(scoped.length)} selesai · ${focusLabel}${daerah === "ALL" ? "" : ` · Daerah ${daerah}`}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 border-b border-primary-deep bg-primary text-primary-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate text-lg font-extrabold leading-tight",
							children: "Koreksi Absen Pusat"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs font-semibold text-primary-muted",
							children: progressText
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setReloadKey((n) => n + 1),
							className: "grid size-11 place-items-center rounded-xl bg-primary-deep text-primary-fg",
							"aria-label": "Muat ulang",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-5 ${loading ? "animate-spin" : ""}` })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setArchiveOpen(true),
							disabled: santri.length === 0,
							className: "inline-flex h-11 items-center gap-2 rounded-xl bg-primary-fg px-3 text-sm font-bold text-primary disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-4" }), "Ke rekap"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 overflow-hidden rounded-full bg-primary-deep",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary-fg transition-[width] duration-300",
							style: { width: `${percent}%` }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs font-medium text-primary-muted",
						children: [
							"Pekan ini ",
							formatCount(santri.length),
							" santri · ",
							formatCount(weekDone),
							" sudah dikoreksi"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4",
				children: [
					broadcast && !hideBroadcast ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-start justify-between gap-3 rounded-2xl px-4 py-3 text-sm ${broadcast.type === "warning" ? "bg-izin-bg text-izin" : "bg-primary-soft text-primary"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-extrabold",
							children: [broadcast.title || "Pengumuman", ". "]
						}), broadcast.message] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "shrink-0 text-xs font-bold underline",
							onClick: () => setHideBroadcast(true),
							children: "Tutup"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl border border-line bg-surface p-3 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-extrabold",
									children: "Daerah"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted",
									children: "Angka = belum selesai"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "-mx-1 flex gap-2 overflow-x-auto px-1 pb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterChip, {
									label: "Semua",
									count: letters.reduce((sum, [, info]) => sum + info.belum, 0),
									active: daerah === "ALL",
									onClick: () => setDaerah("ALL")
								}), letters.map(([letter, info]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterChip, {
									label: letter,
									count: info.belum,
									active: daerah === letter,
									onClick: () => setDaerah(letter)
								}, letter))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-4 gap-2",
								children: FOCUS.map((item) => {
									const count = santri.filter((s) => (daerah === "ALL" || s.daerah === daerah) && matchesFocus(s, item.id) && !s.done).length;
									const active = focus === item.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": active,
										onClick: () => setFocus(item.id),
										className: `min-h-12 rounded-xl border px-1 py-1.5 text-xs font-extrabold leading-tight ${focusClass(item.id, active)}`,
										children: [item.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block text-xs font-semibold opacity-80",
											children: formatCount(count)
										})]
									}, item.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": tab === "belum",
									onClick: () => setTab("belum"),
									className: `h-11 rounded-xl text-sm font-bold ${tab === "belum" ? "bg-fg text-surface" : "bg-bg text-muted"}`,
									children: [
										"Belum (",
										formatCount(scoped.filter((s) => !s.done).length),
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": tab === "sudah",
									onClick: () => setTab("sudah"),
									className: `h-11 rounded-xl text-sm font-bold ${tab === "sudah" ? "bg-fg text-surface" : "bg-bg text-muted"}`,
									children: [
										"Selesai (",
										formatCount(scoped.filter((s) => s.done).length),
										")"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "relative mt-3 block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: query,
									onChange: (event) => {
										setQuery(event.target.value);
										setRoom(null);
									},
									placeholder: "Cari nama, ID, atau kamar",
									className: "h-11 w-full rounded-xl border border-line bg-bg pr-3 pl-10 text-sm font-semibold outline-none focus:border-primary"
								})]
							})
						]
					}),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-3xl bg-line/70" }, i))
					}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-line bg-surface p-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-extrabold",
								children: "Data pekan ini belum terbaca"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setReloadKey((n) => n + 1),
								className: "mt-4 h-11 rounded-xl bg-primary px-4 text-sm font-bold text-primary-fg",
								children: "Coba lagi"
							})
						]
					}) : santri.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-line bg-surface p-6 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-extrabold",
							children: "Koreksi pekan ini kosong"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted",
							children: "Tidak ada data yang menunggu koreksi. Tim unggah bisa mengunggah pekan baru."
						})]
					}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-3xl border border-line bg-surface p-6 text-center text-sm font-semibold text-muted",
						children: "Tidak ada santri pada saringan ini."
					}) : searching || room ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-3",
						children: [
							room && !searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setRoom(null),
									className: "inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Semua kamar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-extrabold",
									children: ["Kamar ", room]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-semibold text-muted",
								children: [formatCount(visible.length), " santri ditemukan. Pencarian tidak terikat filter jenis."]
							}),
							(searching ? visible.slice(0, 40) : roomSantri).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentCard, {
								santri: s,
								saving: savingId === s.id,
								onEdit: () => setEditing(s),
								onSesuai: () => markSesuai(s)
							}, s.id)),
							searching && visible.length > 40 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-center text-sm font-semibold text-muted",
								children: [
									"Menampilkan 40 dari ",
									formatCount(visible.length),
									". Perjelas pencarian."
								]
							}) : null
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
						children: rooms.map(([name, list]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setRoom(name),
							className: "flex flex-col justify-between gap-4 rounded-3xl border border-line bg-surface p-4 text-left shadow-sm active:scale-[0.99]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-muted",
									children: "Kamar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xl font-extrabold leading-tight",
									children: name
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-fg",
									children: list.length
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-primary",
								children: tab === "belum" ? "Perlu dikoreksi" : "Sudah selesai"
							})]
						}, name))
					}),
					santri.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl border border-line bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-extrabold",
								children: "Selesai mengkoreksi?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: "Pindahkan seluruh pekan ke database rekap. Tanggal 16–31 tinggal di bulan yang dipilih, tanggal 1–15 masuk bulan berikutnya. Daftar koreksi lalu kosong, dan tim unggah bisa mengisi data baru."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setArchiveOpen(true),
								className: "mt-3 inline-flex h-11 items-center gap-2 rounded-xl bg-fg px-4 text-sm font-bold text-surface",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-4" }), "Pindahkan ke database rekap"]
							})
						]
					}) : null
				]
			}),
			editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateEditor, {
				santri: editing,
				onClose: () => setEditing(null),
				onSave: async (next) => {
					await persist(next);
				}
			}) : null,
			archiveOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchiveDialog, {
				santri,
				onClose: () => setArchiveOpen(false),
				onArchive: async (bulan, tahun) => {
					const result = await archiveWeek({ data: {
						bulan,
						tahun
					} });
					setSantri([]);
					setArchiveOpen(false);
					setRoom(null);
					notify(result.message);
				}
			}) : null,
			toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "status",
				className: "fixed bottom-4 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-full bg-fg px-4 py-3 text-center text-sm font-semibold text-surface shadow-lg",
				children: toast
			}) : null
		]
	});
}
function LetterChip({ label, count, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-pressed": active,
		onClick,
		className: `flex h-12 min-w-12 shrink-0 flex-col items-center justify-center rounded-xl border px-3 text-xs font-bold ${active ? "border-primary bg-primary text-primary-fg" : count === 0 ? "border-line bg-bg text-muted" : "border-line bg-surface text-fg"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm leading-none",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 leading-none",
			children: formatCount(count)
		})]
	});
}
function StudentCard({ santri, saving, onEdit, onSesuai }) {
	const meta = [
		santri.kelas,
		santri.tingkat,
		santri.kategori
	].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-3xl border border-line bg-surface p-4 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-extrabold leading-snug",
							children: santri.nama
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								"ID ",
								santri.idPps || "-",
								" · Kamar ",
								santri.domisili,
								" · Daerah ",
								santri.daerah
							]
						}),
						meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: meta
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${santri.done ? "bg-primary-soft text-primary" : "bg-bg text-muted"}`,
					children: santri.done ? "Selesai" : "Belum"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2 text-xs font-bold",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-sakit-bg px-2.5 py-1 text-sakit",
						children: ["Sakit ", santri.sakit.length]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-izin-bg px-2.5 py-1 text-izin",
						children: ["Izin ", santri.izin.length]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-alpha-bg px-2.5 py-1 text-alpha",
						children: ["Alpha ", santri.alpha.length]
					})
				]
			}),
			santri.keterangan ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 line-clamp-2 text-sm text-muted",
				children: ["Ket: ", santri.keterangan]
			}) : null,
			santri.alpha.length > 0 && !santri.keterangan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm font-semibold text-alpha",
				children: "Alpha belum ada keterangan."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: saving,
					onClick: onSesuai,
					className: "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-soft text-sm font-bold text-primary disabled:opacity-60",
					children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Sesuai"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onEdit,
					className: "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line text-sm font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-4" }), "Ubah tanggal"]
				})]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KoreksiApp, {});
}
//#endregion
export { Home as component };
