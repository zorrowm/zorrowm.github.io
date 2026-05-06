var e = Object.defineProperty;
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/ const r = Symbol("Comlink.proxy"), t = Symbol("Comlink.endpoint"), n = Symbol("Comlink.releaseProxy"), a = Symbol("Comlink.finalizer"), o = Symbol("Comlink.thrown"), i = (e) => "object" == typeof e && null !== e || "function" == typeof e, s = new Map([["proxy", {
	canHandle: (e) => i(e) && e[r],
	serialize(e) {
		const { port1: r, port2: t } = new MessageChannel();
		return c(e, r), [t, [t]];
	},
	deserialize: (e) => (e.start(), function(e) {
		const r = /* @__PURE__ */ new Map();
		return e.addEventListener("message", (function(e) {
			const { data: t } = e;
			if (!t || !t.id) return;
			const n = r.get(t.id);
			if (n) try {
				n(t);
			} finally {
				r.delete(t.id);
			}
		})), p(e, r, [], void 0);
	}(e))
}], ["throw", {
	canHandle: (e) => i(e) && o in e,
	serialize({ value: e }) {
		let r;
		return r = e instanceof Error ? {
			isError: !0,
			value: {
				message: e.message,
				name: e.name,
				stack: e.stack
			}
		} : {
			isError: !1,
			value: e
		}, [r, []];
	},
	deserialize(e) {
		if (e.isError) throw Object.assign(new Error(e.value.message), e.value);
		throw e.value;
	}
}]]);
function c(e, t = globalThis, n = ["*"]) {
	t.addEventListener("message", (function i(s) {
		if (!s || !s.data) return;
		if (!function(e, r) {
			for (const t of e) {
				if (r === t || "*" === t) return !0;
				if (t instanceof RegExp && t.test(r)) return !0;
			}
			return !1;
		}(n, s.origin)) return void console.warn(`Invalid origin '${s.origin}' for comlink proxy`);
		const { id: f, type: l, path: h } = Object.assign({ path: [] }, s.data), g = (s.data.argumentList || []).map(v);
		let p;
		try {
			const t = h.slice(0, -1).reduce(((e, r) => e[r]), e), n = h.reduce(((e, r) => e[r]), e);
			switch (l) {
				case "GET":
					p = n;
					break;
				case "SET":
					t[h.slice(-1)[0]] = v(s.data.value), p = !0;
					break;
				case "APPLY":
					p = n.apply(t, g);
					break;
				case "CONSTRUCT":
					p = function(e) {
						return Object.assign(e, { [r]: !0 });
					}(new n(...g));
					break;
				case "ENDPOINT":
					{
						const { port1: r, port2: t } = new MessageChannel();
						c(e, t), p = function(e, r) {
							return w.set(e, r), e;
						}(r, [r]);
					}
					break;
				case "RELEASE":
					p = void 0;
					break;
				default: return;
			}
		} catch (e) {
			p = {
				value: e,
				[o]: 0
			};
		}
		Promise.resolve(p).catch(((e) => ({
			value: e,
			[o]: 0
		}))).then(((r) => {
			const [n, o] = y(r);
			t.postMessage(Object.assign(Object.assign({}, n), { id: f }), o), "RELEASE" === l && (t.removeEventListener("message", i), u(t), a in e && "function" == typeof e[a] && e[a]());
		})).catch(((e) => {
			const [r, n] = y({
				value: /* @__PURE__ */ new TypeError("Unserializable return value"),
				[o]: 0
			});
			t.postMessage(Object.assign(Object.assign({}, r), { id: f }), n);
		}));
	})), t.start && t.start();
}
function u(e) {
	(function(e) {
		return "MessagePort" === e.constructor.name;
	})(e) && e.close();
}
function f(e) {
	if (e) throw new Error("Proxy has been released and is not useable");
}
function l(e) {
	return m(e, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then((() => {
		u(e);
	}));
}
const h = /* @__PURE__ */ new WeakMap(), g = "FinalizationRegistry" in globalThis && new FinalizationRegistry(((e) => {
	const r = (h.get(e) || 0) - 1;
	h.set(e, r), 0 === r && l(e);
}));
function p(e, r, a = [], o = function() {}) {
	let i = !1;
	const s = new Proxy(o, {
		get(t, o) {
			if (f(i), o === n) return () => {
				(function(e) {
					g && g.unregister(e);
				})(s), l(e), r.clear(), i = !0;
			};
			if ("then" === o) {
				if (0 === a.length) return { then: () => s };
				const t = m(e, r, {
					type: "GET",
					path: a.map(((e) => e.toString()))
				}).then(v);
				return t.then.bind(t);
			}
			return p(e, r, [...a, o]);
		},
		set(t, n, o) {
			f(i);
			const [s, c] = y(o);
			return m(e, r, {
				type: "SET",
				path: [...a, n].map(((e) => e.toString())),
				value: s
			}, c).then(v);
		},
		apply(n, o, s) {
			f(i);
			const c = a[a.length - 1];
			if (c === t) return m(e, r, { type: "ENDPOINT" }).then(v);
			if ("bind" === c) return p(e, r, a.slice(0, -1));
			const [u, l] = d(s);
			return m(e, r, {
				type: "APPLY",
				path: a.map(((e) => e.toString())),
				argumentList: u
			}, l).then(v);
		},
		construct(t, n) {
			f(i);
			const [o, s] = d(n);
			return m(e, r, {
				type: "CONSTRUCT",
				path: a.map(((e) => e.toString())),
				argumentList: o
			}, s).then(v);
		}
	});
	return function(e, r) {
		const t = (h.get(r) || 0) + 1;
		h.set(r, t), g && g.register(e, r, e);
	}(s, e), s;
}
function d(e) {
	const r = e.map(y);
	return [r.map(((e) => e[0])), (t = r.map(((e) => e[1])), Array.prototype.concat.apply([], t))];
	var t;
}
const w = /* @__PURE__ */ new WeakMap();
function y(e) {
	for (const [r, t] of s) if (t.canHandle(e)) {
		const [n, a] = t.serialize(e);
		return [{
			type: "HANDLER",
			name: r,
			value: n
		}, a];
	}
	return [{
		type: "RAW",
		value: e
	}, w.get(e) || []];
}
function v(e) {
	switch (e.type) {
		case "HANDLER": return s.get(e.name).deserialize(e.value);
		case "RAW": return e.value;
	}
}
function m(e, r, t, n) {
	return new Promise(((a) => {
		const o = new Array(4).fill(0).map((() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))).join("-");
		r.set(o, a), e.start && e.start(), e.postMessage(Object.assign({ id: o }, t), n);
	}));
}
let b = !0;
try {
	String.fromCharCode.apply(String, [1, 2]);
} catch (e) {
	b = !1, Object.defineProperty(Array.prototype, "subarray", { value: Array.prototype.slice });
}
var E = 2654435769;
function S(e, r) {
	var t = e.length, n = t << 2;
	if (r) {
		var a = e[t - 1];
		if (a < (n -= 4) - 3 || a > n) return null;
		n = a;
	}
	for (var o = new Uint8Array(n), i = 0; i < n; ++i) o[i] = e[i >> 2] >> ((3 & i) << 3);
	return o;
}
function C(e, r) {
	var t, n = e.length, a = n >> 2;
	3 & n && ++a, r ? (t = new Uint32Array(a + 1))[a] = n : t = new Uint32Array(a);
	for (var o = 0; o < n; ++o) t[o >> 2] |= e[o] << ((3 & o) << 3);
	return t;
}
function U(e) {
	return 4294967295 & e;
}
function A(e, r, t, n, a, o) {
	return (t >>> 5 ^ r << 2) + (r >>> 3 ^ t << 4) ^ (e ^ r) + (o[3 & n ^ a] ^ t);
}
function T(e) {
	if (e.length < 16) {
		var r = new Uint8Array(16);
		r.set(e), e = r;
	}
	return e;
}
function k(e) {
	for (var r = e.length, t = new Uint8Array(3 * r), n = 0, a = 0; a < r; a++) {
		var o = e.charCodeAt(a);
		if (o < 128) t[n++] = o;
		else if (o < 2048) t[n++] = 192 | o >> 6, t[n++] = 128 | 63 & o;
		else {
			if (!(o < 55296 || o > 57343)) {
				if (a + 1 < r) {
					var i = e.charCodeAt(a + 1);
					if (o < 56320 && 56320 <= i && i <= 57343) {
						var s = 65536 + ((1023 & o) << 10 | 1023 & i);
						t[n++] = 240 | s >> 18, t[n++] = 128 | s >> 12 & 63, t[n++] = 128 | s >> 6 & 63, t[n++] = 128 | 63 & s, a++;
						continue;
					}
				}
				throw new Error("Malformed string");
			}
			t[n++] = 224 | o >> 12, t[n++] = 128 | o >> 6 & 63, t[n++] = 128 | 63 & o;
		}
	}
	return t.subarray(0, n);
}
function M(e) {
	var r = e.length;
	return 0 === r ? "" : r < 32767 ? function(e, r) {
		for (var t = new Array(r), n = 0, a = 0, o = e.length; n < r && a < o; n++) {
			var i = e[a++];
			switch (i >> 4) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
					t[n] = i;
					break;
				case 12:
				case 13:
					if (!(a < o)) throw new Error("Unfinished UTF-8 octet sequence");
					t[n] = (31 & i) << 6 | 63 & e[a++];
					break;
				case 14:
					if (!(a + 1 < o)) throw new Error("Unfinished UTF-8 octet sequence");
					t[n] = (15 & i) << 12 | (63 & e[a++]) << 6 | 63 & e[a++];
					break;
				case 15:
					if (!(a + 2 < o)) throw new Error("Unfinished UTF-8 octet sequence");
					var s = ((7 & i) << 18 | (63 & e[a++]) << 12 | (63 & e[a++]) << 6 | 63 & e[a++]) - 65536;
					if (!(0 <= s && s <= 1048575)) throw new Error("Character outside valid Unicode range: 0x" + s.toString(16));
					t[n++] = s >> 10 & 1023 | 55296, t[n] = 1023 & s | 56320;
					break;
				default: throw new Error("Bad UTF-8 encoding 0x" + i.toString(16));
			}
		}
		return n < r && (t.length = n), String.fromCharCode.apply(String, t);
	}(e, r) : function(e, r) {
		for (var t = [], n = new Array(32768), a = 0, o = 0, i = e.length; a < r && o < i; a++) {
			var s = e[o++];
			switch (s >> 4) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
					n[a] = s;
					break;
				case 12:
				case 13:
					if (!(o < i)) throw new Error("Unfinished UTF-8 octet sequence");
					n[a] = (31 & s) << 6 | 63 & e[o++];
					break;
				case 14:
					if (!(o + 1 < i)) throw new Error("Unfinished UTF-8 octet sequence");
					n[a] = (15 & s) << 12 | (63 & e[o++]) << 6 | 63 & e[o++];
					break;
				case 15:
					if (!(o + 2 < i)) throw new Error("Unfinished UTF-8 octet sequence");
					var c = ((7 & s) << 18 | (63 & e[o++]) << 12 | (63 & e[o++]) << 6 | 63 & e[o++]) - 65536;
					if (!(0 <= c && c <= 1048575)) throw new Error("Character outside valid Unicode range: 0x" + c.toString(16));
					n[a++] = c >> 10 & 1023 | 55296, n[a] = 1023 & c | 56320;
					break;
				default: throw new Error("Bad UTF-8 encoding 0x" + s.toString(16));
			}
			if (a >= 32766) {
				var u = a + 1;
				n.length = u, t.push(String.fromCharCode.apply(String, n)), r -= u, a = -1;
			}
		}
		return a > 0 && (n.length = a, t.push(String.fromCharCode.apply(String, n))), t.join("");
	}(e, r);
}
function O(e, r) {
	return "string" == typeof e && (e = k(e)), "string" == typeof r && (r = k(r)), null == e || 0 === e.length ? e : S(function(e, r) {
		var t, n, a, o, i = e.length, s = i - 1, c = e[s], u = 0;
		for (o = 0 | Math.floor(6 + 52 / i); o > 0; --o) {
			for (n = (u = U(u + E)) >>> 2 & 3, a = 0; a < s; ++a) t = e[a + 1], c = e[a] = U(e[a] + A(u, t, c, a, n, r));
			t = e[0], c = e[s] = U(e[s] + A(u, t, c, s, n, r));
		}
		return e;
	}(C(e, !0), C(T(r), !1)), !1);
}
function x(e, r) {
	return globalThis.btoa(function(e) {
		var r = e.length;
		if (0 === r) return "";
		var t = b ? e : function(e) {
			for (var r = e.length, t = new Array(e.length), n = 0; n < r; ++n) t[n] = e[n];
			return t;
		}(e);
		if (r < 65535) return String.fromCharCode.apply(String, t);
		for (var n = 32767 & r, a = r >> 15, o = new Array(n ? a + 1 : a), i = 0; i < a; ++i) o[i] = String.fromCharCode.apply(String, t.subarray(i << 15, i + 1 << 15));
		return n && (o[a] = String.fromCharCode.apply(String, t.subarray(a << 15, r))), o.join("");
	}(O(e, r)));
}
function R(e, r) {
	return "string" == typeof e && (e = function(e) {
		for (var r = globalThis.atob(e), t = r.length, n = new Uint8Array(t), a = 0; a < t; a++) n[a] = r.charCodeAt(a);
		return n;
	}(e)), "string" == typeof r && (r = k(r)), null == e || 0 === e.length ? e : S(function(e, r) {
		var t, n, a, o, i = e.length, s = i - 1, c = e[0];
		for (n = U(Math.floor(6 + 52 / i) * E); 0 !== n; n = U(n - E)) {
			for (a = n >>> 2 & 3, o = s; o > 0; --o) t = e[o - 1], c = e[o] = U(e[o] - A(n, c, t, o, a, r));
			t = e[s], c = e[0] = U(e[0] - A(n, c, t, 0, a, r));
		}
		return e;
	}(C(e, !1), C(T(r), !1)), !0);
}
function L(e, r) {
	return M(R(e, r));
}
function j(e, r) {
	return e.filter((function(e) {
		return -1 == r.indexOf(e);
	}));
}
function P(e, r) {
	return e.filter((function(e) {
		return r.indexOf(e) > -1;
	}));
}
function N(e, r = 0, t = 0, n = 2) {
	if (!e || 4 != e.length) return;
	const a = (e[2] - e[0]) / n, o = (e[3] - e[1]) / n, i = e[0] + r * a, s = e[3] - t * o, c = i + a, u = s - o;
	return [
		[i, s],
		[c, s],
		[c, u],
		[i, u]
	];
}
async function z(e, r, t, n = 1024) {
	const a = await fetch(r);
	if (!a) throw new Error("加载失败：" + r);
	let o = await a.blob();
	if (!o) throw new Error("Blob数据对象为空！");
	const i = await createImageBitmap(o);
	o = null;
	const s = Math.ceil(i.width / n), c = Math.ceil(i.height / n), u = Math.max(s, c), f = u, l = u, h = i.width / f, g = i.height / l, p = new OffscreenCanvas(h, g), d = p.getContext("2d");
	if (!d) throw new Error("获取canvas的Context对象为空！");
	const w = [], y = {
		id: e,
		width: i.width,
		height: i.height,
		maxUnitSize: n,
		colNum: f,
		rowNum: l,
		items: w
	};
	for (let v = 0; v < l; v++) for (let r = 0; r < f; r++) {
		d.clearRect(0, 0, p.width, p.height), d.drawImage(i, r * h, v * g, h, g, 0, 0, h, g);
		const n = await p.convertToBlob(), a = URL.createObjectURL(n), o = {
			id: `${e}_${v}_${r}`,
			coords: N(t, r, v, u),
			imgURL: a
		};
		w.push(o);
	}
	return y;
}
c(((r, t) => {
	let n = {};
	for (var a in r) e(n, a, {
		get: r[a],
		enumerable: !0
	});
	return t || e(n, Symbol.toStringTag, { value: "Module" }), n;
})({
	decrypt: () => R,
	decryptToString: () => L,
	encrypt: () => O,
	encryptToString: () => x,
	getIntersect: () => P,
	getMinus: () => j,
	loadBigImage: () => z,
	toBytes: () => k,
	toString: () => M
}));
