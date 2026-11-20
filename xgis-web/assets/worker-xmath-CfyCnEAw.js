var e = Object.defineProperty, r = (r, t) => {
	let n = {};
	for (var a in r) e(n, a, {
		get: r[a],
		enumerable: !0
	});
	return t || e(n, Symbol.toStringTag, { value: "Module" }), n;
};
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/
const t = Symbol("Comlink.proxy"), n = Symbol("Comlink.endpoint"), a = Symbol("Comlink.releaseProxy"), o = Symbol("Comlink.finalizer"), i = Symbol("Comlink.thrown"), s = (e) => "object" == typeof e && null !== e || "function" == typeof e, c = /* @__PURE__ */ new Map([["proxy", {
	canHandle: (e) => s(e) && e[t],
	serialize(e) {
		const { port1: r, port2: t } = new MessageChannel();
		return u(e, r), [t, [t]];
	},
	deserialize: (e) => (e.start(), function(e, r) {
		const t = /* @__PURE__ */ new Map();
		return e.addEventListener("message", function(e) {
			const { data: r } = e;
			if (!r || !r.id) return;
			const n = t.get(r.id);
			if (n) try {
				n(r);
			} finally {
				t.delete(r.id);
			}
		}), d(e, t, [], r);
	}(e))
}], ["throw", {
	canHandle: (e) => s(e) && i in e,
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
function u(e, r = globalThis, n = ["*"]) {
	r.addEventListener("message", function a(s) {
		if (!s || !s.data) return;
		if (!function(e, r) {
			for (const t of e) {
				if (r === t || "*" === t) return !0;
				if (t instanceof RegExp && t.test(r)) return !0;
			}
			return !1;
		}(n, s.origin)) return void console.warn(`Invalid origin '${s.origin}' for comlink proxy`);
		const { id: c, type: l, path: h } = Object.assign({ path: [] }, s.data), g = (s.data.argumentList || []).map(m);
		let p;
		try {
			const r = h.slice(0, -1).reduce((e, r) => e[r], e), n = h.reduce((e, r) => e[r], e);
			switch (l) {
				case "GET":
					p = n;
					break;
				case "SET":
					r[h.slice(-1)[0]] = m(s.data.value), p = !0;
					break;
				case "APPLY":
					p = n.apply(r, g);
					break;
				case "CONSTRUCT":
					p = function(e) {
						return Object.assign(e, { [t]: !0 });
					}(new n(...g));
					break;
				case "ENDPOINT":
					{
						const { port1: r, port2: t } = new MessageChannel();
						u(e, t), p = function(e, r) {
							return y.set(e, r), e;
						}(r, [r]);
					}
					break;
				case "RELEASE":
					p = void 0;
					break;
				default: return;
			}
		} catch (d) {
			p = {
				value: d,
				[i]: 0
			};
		}
		Promise.resolve(p).catch((e) => ({
			value: e,
			[i]: 0
		})).then((t) => {
			const [n, i] = v(t);
			r.postMessage(Object.assign(Object.assign({}, n), { id: c }), i), "RELEASE" === l && (r.removeEventListener("message", a), f(r), o in e && "function" == typeof e[o] && e[o]());
		}).catch((e) => {
			const [t, n] = v({
				value: /* @__PURE__ */ new TypeError("Unserializable return value"),
				[i]: 0
			});
			r.postMessage(Object.assign(Object.assign({}, t), { id: c }), n);
		});
	}), r.start && r.start();
}
function f(e) {
	(function(e) {
		return "MessagePort" === e.constructor.name;
	})(e) && e.close();
}
function l(e) {
	if (e) throw new Error("Proxy has been released and is not useable");
}
function h(e) {
	return b(e, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then(() => {
		f(e);
	});
}
const g = /* @__PURE__ */ new WeakMap(), p = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
	const r = (g.get(e) || 0) - 1;
	g.set(e, r), 0 === r && h(e);
});
function d(e, r, t = [], o = function() {}) {
	let i = !1;
	const s = new Proxy(o, {
		get(n, o) {
			if (l(i), o === a) return () => {
				(function(e) {
					p && p.unregister(e);
				})(s), h(e), r.clear(), i = !0;
			};
			if ("then" === o) {
				if (0 === t.length) return { then: () => s };
				const n = b(e, r, {
					type: "GET",
					path: t.map((e) => e.toString())
				}).then(m);
				return n.then.bind(n);
			}
			return d(e, r, [...t, o]);
		},
		set(n, a, o) {
			l(i);
			const [s, c] = v(o);
			return b(e, r, {
				type: "SET",
				path: [...t, a].map((e) => e.toString()),
				value: s
			}, c).then(m);
		},
		apply(a, o, s) {
			l(i);
			const c = t[t.length - 1];
			if (c === n) return b(e, r, { type: "ENDPOINT" }).then(m);
			if ("bind" === c) return d(e, r, t.slice(0, -1));
			const [u, f] = w(s);
			return b(e, r, {
				type: "APPLY",
				path: t.map((e) => e.toString()),
				argumentList: u
			}, f).then(m);
		},
		construct(n, a) {
			l(i);
			const [o, s] = w(a);
			return b(e, r, {
				type: "CONSTRUCT",
				path: t.map((e) => e.toString()),
				argumentList: o
			}, s).then(m);
		}
	});
	return function(e, r) {
		const t = (g.get(r) || 0) + 1;
		g.set(r, t), p && p.register(e, r, e);
	}(s, e), s;
}
function w(e) {
	const r = e.map(v);
	return [r.map((e) => e[0]), (t = r.map((e) => e[1]), Array.prototype.concat.apply([], t))];
	var t;
}
const y = /* @__PURE__ */ new WeakMap();
function v(e) {
	for (const [r, t] of c) if (t.canHandle(e)) {
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
	}, y.get(e) || []];
}
function m(e) {
	switch (e.type) {
		case "HANDLER": return c.get(e.name).deserialize(e.value);
		case "RAW": return e.value;
	}
}
function b(e, r, t, n) {
	return new Promise((a) => {
		const o = new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
		r.set(o, a), e.start && e.start(), e.postMessage(Object.assign({ id: o }, t), n);
	});
}
let E = !0;
try {
	String.fromCharCode.apply(String, [1, 2]);
} catch (B) {
	E = !1, Object.defineProperty(Array.prototype, "subarray", { value: Array.prototype.slice });
}
var S = 2654435769;
function C(e, r) {
	var t = e.length, n = t << 2;
	if (r) {
		var a = e[t - 1];
		if (a < (n -= 4) - 3 || a > n) return null;
		n = a;
	}
	for (var o = new Uint8Array(n), i = 0; i < n; ++i) o[i] = e[i >> 2] >> ((3 & i) << 3);
	return o;
}
function U(e, r) {
	var t, n = e.length, a = n >> 2;
	3 & n && ++a, r ? (t = new Uint32Array(a + 1))[a] = n : t = new Uint32Array(a);
	for (var o = 0; o < n; ++o) t[o >> 2] |= e[o] << ((3 & o) << 3);
	return t;
}
function A(e) {
	return 4294967295 & e;
}
function T(e, r, t, n, a, o) {
	return (t >>> 5 ^ r << 2) + (r >>> 3 ^ t << 4) ^ (e ^ r) + (o[3 & n ^ a] ^ t);
}
function k(e) {
	if (e.length < 16) {
		var r = /* @__PURE__ */ new Uint8Array(16);
		r.set(e), e = r;
	}
	return e;
}
function M(e) {
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
function O(e) {
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
function x(e) {
	var r = e.length;
	if (0 === r) return "";
	var t = E ? e : function(e) {
		for (var r = e.length, t = new Array(e.length), n = 0; n < r; ++n) t[n] = e[n];
		return t;
	}(e);
	if (r < 65535) return String.fromCharCode.apply(String, t);
	for (var n = 32767 & r, a = r >> 15, o = new Array(n ? a + 1 : a), i = 0; i < a; ++i) o[i] = String.fromCharCode.apply(String, t.subarray(i << 15, i + 1 << 15));
	return n && (o[a] = String.fromCharCode.apply(String, t.subarray(a << 15, r))), o.join("");
}
function R(e, r) {
	return "string" == typeof e && (e = M(e)), "string" == typeof r && (r = M(r)), null == e || 0 === e.length ? e : C(function(e, r) {
		for (var t, n, a, o = e.length, i = o - 1, s = e[i], c = 0, u = 0 | Math.floor(6 + 52 / o); u > 0; --u) {
			for (n = (c = A(c + S)) >>> 2 & 3, a = 0; a < i; ++a) t = e[a + 1], s = e[a] = A(e[a] + T(c, t, s, a, n, r));
			t = e[0], s = e[i] = A(e[i] + T(c, t, s, i, n, r));
		}
		return e;
	}(U(e, !0), U(k(r), !1)), !1);
}
function L(e, r) {
	return globalThis.btoa(x(R(e, r)));
}
function j(e, r) {
	return "string" == typeof e && (e = function(e) {
		for (var r = globalThis.atob(e), t = r.length, n = new Uint8Array(t), a = 0; a < t; a++) n[a] = r.charCodeAt(a);
		return n;
	}(e)), "string" == typeof r && (r = M(r)), null == e || 0 === e.length ? e : C(function(e, r) {
		for (var t, n, a, o = e.length, i = o - 1, s = e[0], c = A(Math.floor(6 + 52 / o) * S); 0 !== c; c = A(c - S)) {
			for (n = c >>> 2 & 3, a = i; a > 0; --a) t = e[a - 1], s = e[a] = A(e[a] - T(c, s, t, a, n, r));
			t = e[i], s = e[0] = A(e[0] - T(c, s, t, 0, n, r));
		}
		return e;
	}(U(e, !1), U(k(r), !1)), !0);
}
function P(e, r) {
	return O(j(e, r));
}
function N(e, r) {
	return e.filter(function(e) {
		return -1 == r.indexOf(e);
	});
}
function z(e, r) {
	return e.filter(function(e) {
		return r.indexOf(e) > -1;
	});
}
function F(e, r = 0, t = 0, n = 2) {
	if (!e || 4 != e.length) return;
	const a = (e[2] - e[0]) / n, o = (e[3] - e[1]) / n, i = e[0] + r * a, s = e[3] - t * o, c = i + a, u = s - o;
	return [
		[i, s],
		[c, s],
		[c, u],
		[i, u]
	];
}
async function I(e, r, t, n = 1024) {
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
			coords: F(t, r, v, u),
			imgURL: a
		};
		w.push(o);
	}
	return y;
}
u(/* @__PURE__ */ r({
	decrypt: () => j,
	decryptToString: () => P,
	encrypt: () => R,
	encryptToString: () => L,
	getIntersect: () => z,
	getMinus: () => N,
	loadBigImage: () => I,
	toBytes: () => M,
	toString: () => O
}));
