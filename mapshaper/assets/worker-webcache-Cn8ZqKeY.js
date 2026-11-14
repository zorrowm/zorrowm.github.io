var t = Object.defineProperty, e = (e, i) => {
	let s = {};
	for (var h in e) t(s, h, {
		get: e[h],
		enumerable: !0
	});
	return i || t(s, Symbol.toStringTag, { value: "Module" }), s;
};
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/
const i = Symbol("Comlink.proxy"), s = Symbol("Comlink.endpoint"), h = Symbol("Comlink.releaseProxy"), n = Symbol("Comlink.finalizer"), r = Symbol("Comlink.thrown"), o = (t) => "object" == typeof t && null !== t || "function" == typeof t, a = /* @__PURE__ */ new Map([["proxy", {
	canHandle: (t) => o(t) && t[i],
	serialize(t) {
		const { port1: e, port2: i } = new MessageChannel();
		return l(t, e), [i, [i]];
	},
	deserialize: (t) => (t.start(), function(t, e) {
		const i = /* @__PURE__ */ new Map();
		return t.addEventListener("message", function(t) {
			const { data: e } = t;
			if (!e || !e.id) return;
			const s = i.get(e.id);
			if (s) try {
				s(e);
			} finally {
				i.delete(e.id);
			}
		}), g(t, i, [], e);
	}(t))
}], ["throw", {
	canHandle: (t) => o(t) && r in t,
	serialize({ value: t }) {
		let e;
		return e = t instanceof Error ? {
			isError: !0,
			value: {
				message: t.message,
				name: t.name,
				stack: t.stack
			}
		} : {
			isError: !1,
			value: t
		}, [e, []];
	},
	deserialize(t) {
		if (t.isError) throw Object.assign(new Error(t.value.message), t.value);
		throw t.value;
	}
}]]);
function l(t, e = globalThis, s = ["*"]) {
	e.addEventListener("message", function h(o) {
		if (!o || !o.data) return;
		if (!function(t, e) {
			for (const i of t) {
				if (e === i || "*" === i) return !0;
				if (i instanceof RegExp && i.test(e)) return !0;
			}
			return !1;
		}(s, o.origin)) return void console.warn(`Invalid origin '${o.origin}' for comlink proxy`);
		const { id: a, type: u, path: f } = Object.assign({ path: [] }, o.data), d = (o.data.argumentList || []).map(S);
		let p;
		try {
			const e = f.slice(0, -1).reduce((t, e) => t[e], t), s = f.reduce((t, e) => t[e], t);
			switch (u) {
				case "GET":
					p = s;
					break;
				case "SET":
					e[f.slice(-1)[0]] = S(o.data.value), p = !0;
					break;
				case "APPLY":
					p = s.apply(e, d);
					break;
				case "CONSTRUCT":
					p = function(t) {
						return Object.assign(t, { [i]: !0 });
					}(new s(...d));
					break;
				case "ENDPOINT":
					{
						const { port1: e, port2: i } = new MessageChannel();
						l(t, i), p = function(t, e) {
							return w.set(t, e), t;
						}(e, [e]);
					}
					break;
				case "RELEASE":
					p = void 0;
					break;
				default: return;
			}
		} catch (g) {
			p = {
				value: g,
				[r]: 0
			};
		}
		Promise.resolve(p).catch((t) => ({
			value: t,
			[r]: 0
		})).then((i) => {
			const [s, r] = m(i);
			e.postMessage(Object.assign(Object.assign({}, s), { id: a }), r), "RELEASE" === u && (e.removeEventListener("message", h), c(e), n in t && "function" == typeof t[n] && t[n]());
		}).catch((t) => {
			const [i, s] = m({
				value: /* @__PURE__ */ new TypeError("Unserializable return value"),
				[r]: 0
			});
			e.postMessage(Object.assign(Object.assign({}, i), { id: a }), s);
		});
	}), e.start && e.start();
}
function c(t) {
	(function(t) {
		return "MessagePort" === t.constructor.name;
	})(t) && t.close();
}
function u(t) {
	if (t) throw new Error("Proxy has been released and is not useable");
}
function f(t) {
	return y(t, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then(() => {
		c(t);
	});
}
const d = /* @__PURE__ */ new WeakMap(), p = "FinalizationRegistry" in globalThis && new FinalizationRegistry((t) => {
	const e = (d.get(t) || 0) - 1;
	d.set(t, e), 0 === e && f(t);
});
function g(t, e, i = [], n = function() {}) {
	let r = !1;
	const o = new Proxy(n, {
		get(s, n) {
			if (u(r), n === h) return () => {
				(function(t) {
					p && p.unregister(t);
				})(o), f(t), e.clear(), r = !0;
			};
			if ("then" === n) {
				if (0 === i.length) return { then: () => o };
				const s = y(t, e, {
					type: "GET",
					path: i.map((t) => t.toString())
				}).then(S);
				return s.then.bind(s);
			}
			return g(t, e, [...i, n]);
		},
		set(s, h, n) {
			u(r);
			const [o, a] = m(n);
			return y(t, e, {
				type: "SET",
				path: [...i, h].map((t) => t.toString()),
				value: o
			}, a).then(S);
		},
		apply(h, n, o) {
			u(r);
			const a = i[i.length - 1];
			if (a === s) return y(t, e, { type: "ENDPOINT" }).then(S);
			if ("bind" === a) return g(t, e, i.slice(0, -1));
			const [l, c] = v(o);
			return y(t, e, {
				type: "APPLY",
				path: i.map((t) => t.toString()),
				argumentList: l
			}, c).then(S);
		},
		construct(s, h) {
			u(r);
			const [n, o] = v(h);
			return y(t, e, {
				type: "CONSTRUCT",
				path: i.map((t) => t.toString()),
				argumentList: n
			}, o).then(S);
		}
	});
	return function(t, e) {
		const i = (d.get(e) || 0) + 1;
		d.set(e, i), p && p.register(t, e, t);
	}(o, t), o;
}
function v(t) {
	const e = t.map(m);
	return [e.map((t) => t[0]), (i = e.map((t) => t[1]), Array.prototype.concat.apply([], i))];
	var i;
}
const w = /* @__PURE__ */ new WeakMap();
function m(t) {
	for (const [e, i] of a) if (i.canHandle(t)) {
		const [s, h] = i.serialize(t);
		return [{
			type: "HANDLER",
			name: e,
			value: s
		}, h];
	}
	return [{
		type: "RAW",
		value: t
	}, w.get(t) || []];
}
function S(t) {
	switch (t.type) {
		case "HANDLER": return a.get(t.name).deserialize(t.value);
		case "RAW": return t.value;
	}
}
function y(t, e, i, s) {
	return new Promise((h) => {
		const n = new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
		e.set(n, h), t.start && t.start(), t.postMessage(Object.assign({ id: n }, i), s);
	});
}
var b = { hasSubscribers: !1 }, _ = b, E = b, F = "object" == typeof performance && performance && "function" == typeof performance.now ? performance : Date, O = () => _.hasSubscribers || E.hasSubscribers, A = /* @__PURE__ */ new Set(), z = "object" == typeof process && process ? process : {}, T = (t) => !!t && t === Math.floor(t) && t > 0 && isFinite(t), x = (t) => T(t) ? t <= Math.pow(2, 8) ? Uint8Array : t <= Math.pow(2, 16) ? Uint16Array : t <= Math.pow(2, 32) ? Uint32Array : t <= Number.MAX_SAFE_INTEGER ? k : null : null, k = class extends Array {
	constructor(t) {
		super(t), this.fill(0);
	}
}, C = class t {
	heap;
	length;
	static #t = !1;
	static create(e) {
		let i = x(e);
		if (!i) return [];
		t.#t = !0;
		let s = new t(e, i);
		return t.#t = !1, s;
	}
	constructor(e, i) {
		if (!t.#t) throw new TypeError("instantiate Stack using Stack.create(n)");
		this.heap = new i(e), this.length = 0;
	}
	push(t) {
		this.heap[this.length++] = t;
	}
	pop() {
		return this.heap[--this.length];
	}
}, R = class t {
	#t;
	#e;
	#i;
	#s;
	#h;
	#n;
	#r;
	#o;
	get perf() {
		return this.#o;
	}
	ttl;
	ttlResolution;
	ttlAutopurge;
	updateAgeOnGet;
	updateAgeOnHas;
	allowStale;
	noDisposeOnSet;
	noUpdateTTL;
	maxEntrySize;
	sizeCalculation;
	noDeleteOnFetchRejection;
	noDeleteOnStaleGet;
	allowStaleOnFetchAbort;
	allowStaleOnFetchRejection;
	ignoreFetchAbort;
	backgroundFetchSize;
	#a;
	#l;
	#c;
	#u;
	#f;
	#d;
	#p;
	#g;
	#v;
	#w;
	#m;
	#S;
	#y;
	#b;
	#_;
	#E;
	#F;
	#O;
	#A;
	static unsafeExposeInternals(t) {
		return {
			starts: t.#y,
			ttls: t.#b,
			autopurgeTimers: t.#_,
			sizes: t.#S,
			keyMap: t.#c,
			keyList: t.#u,
			valList: t.#f,
			next: t.#d,
			prev: t.#p,
			get head() {
				return t.#g;
			},
			get tail() {
				return t.#v;
			},
			free: t.#w,
			isBackgroundFetch: (e) => t.#z(e),
			backgroundFetch: (e, i, s, h) => t.#T(e, i, s, h),
			moveToTail: (e) => t.#x(e),
			indexes: (e) => t.#k(e),
			rindexes: (e) => t.#C(e),
			isStale: (e) => t.#R(e)
		};
	}
	get max() {
		return this.#t;
	}
	get maxSize() {
		return this.#e;
	}
	get calculatedSize() {
		return this.#l;
	}
	get size() {
		return this.#a;
	}
	get fetchMethod() {
		return this.#n;
	}
	get memoMethod() {
		return this.#r;
	}
	get dispose() {
		return this.#i;
	}
	get onInsert() {
		return this.#s;
	}
	get disposeAfter() {
		return this.#h;
	}
	constructor(e) {
		let { max: i = 0, ttl: s, ttlResolution: h = 1, ttlAutopurge: n, updateAgeOnGet: r, updateAgeOnHas: o, allowStale: a, dispose: l, onInsert: c, disposeAfter: u, noDisposeOnSet: f, noUpdateTTL: d, maxSize: p = 0, maxEntrySize: g = 0, sizeCalculation: v, fetchMethod: w, memoMethod: m, noDeleteOnFetchRejection: S, noDeleteOnStaleGet: y, allowStaleOnFetchRejection: b, allowStaleOnFetchAbort: _, ignoreFetchAbort: E, backgroundFetchSize: O = 1, perf: k } = e;
		if (this.backgroundFetchSize = O, void 0 !== k && "function" != typeof k?.now) throw new TypeError("perf option must have a now() method if specified");
		if (this.#o = k ?? F, 0 !== i && !T(i)) throw new TypeError("max option must be a nonnegative integer");
		let R = i ? x(i) : Array;
		if (!R) throw new Error("invalid max value: " + i);
		if (this.#t = i, this.#e = p, this.maxEntrySize = g || this.#e, this.sizeCalculation = v, this.sizeCalculation) {
			if (!this.#e && !this.maxEntrySize) throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
			if ("function" != typeof this.sizeCalculation) throw new TypeError("sizeCalculation set to non-function");
		}
		if (void 0 !== m && "function" != typeof m) throw new TypeError("memoMethod must be a function if defined");
		if (this.#r = m, void 0 !== w && "function" != typeof w) throw new TypeError("fetchMethod must be a function if specified");
		if (this.#n = w, this.#F = !!w, this.#c = /* @__PURE__ */ new Map(), this.#u = Array.from({ length: i }).fill(void 0), this.#f = Array.from({ length: i }).fill(void 0), this.#d = new R(i), this.#p = new R(i), this.#g = 0, this.#v = 0, this.#w = C.create(i), this.#a = 0, this.#l = 0, "function" == typeof l && (this.#i = l), "function" == typeof c && (this.#s = c), "function" == typeof u ? (this.#h = u, this.#m = []) : (this.#h = void 0, this.#m = void 0), this.#E = !!this.#i, this.#A = !!this.#s, this.#O = !!this.#h, this.noDisposeOnSet = !!f, this.noUpdateTTL = !!d, this.noDeleteOnFetchRejection = !!S, this.allowStaleOnFetchRejection = !!b, this.allowStaleOnFetchAbort = !!_, this.ignoreFetchAbort = !!E, 0 !== this.maxEntrySize) {
			if (0 !== this.#e && !T(this.#e)) throw new TypeError("maxSize must be a positive integer if specified");
			if (!T(this.maxEntrySize)) throw new TypeError("maxEntrySize must be a positive integer if specified");
			this.#W();
		}
		if (this.allowStale = !!a, this.noDeleteOnStaleGet = !!y, this.updateAgeOnGet = !!r, this.updateAgeOnHas = !!o, this.ttlResolution = T(h) || 0 === h ? h : 1, this.ttlAutopurge = !!n, this.ttl = s || 0, this.ttl) {
			if (!T(this.ttl)) throw new TypeError("ttl must be a positive integer if specified");
			this.#D();
		}
		if (0 === this.#t && 0 === this.ttl && 0 === this.#e) throw new TypeError("At least one of max, maxSize, or ttl is required");
		if (!this.ttlAutopurge && !this.#t && !this.#e) {
			let e = "LRU_CACHE_UNBOUNDED";
			((t) => !A.has(t))(e) && (A.add(e), ((t, e, i, s) => {
				"function" == typeof z.emitWarning ? z.emitWarning(t, e, i, s) : console.error(`[${i}] ${e}: ${t}`);
			})("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", e, t));
		}
	}
	getRemainingTTL(t) {
		return this.#c.has(t) ? 1 / 0 : 0;
	}
	#D() {
		let t = new k(this.#t), e = new k(this.#t);
		this.#b = t, this.#y = e;
		let i = this.ttlAutopurge ? Array.from({ length: this.#t }) : void 0;
		this.#_ = i, this.#L = (i, h, n = this.#o.now()) => {
			e[i] = 0 !== h ? n : 0, t[i] = h, s(i, h);
		}, this.#M = (i) => {
			e[i] = 0 !== t[i] ? this.#o.now() : 0, s(i, t[i]);
		};
		let s = this.ttlAutopurge ? (t, e) => {
			if (i?.[t] && (clearTimeout(i[t]), i[t] = void 0), e && 0 !== e && i) {
				let h = setTimeout(() => {
					this.#R(t) ? (this.#j(this.#u[t], "expire"), i[t] = void 0) : s(t, r(t));
				}, e + 1);
				h.unref && h.unref(), i[t] = h;
			}
		} : () => {};
		this.#G = (i, s) => {
			if (t[s]) {
				let r = t[s], o = e[s];
				if (!r || !o) return;
				i.ttl = r, i.start = o, i.now = h || n(), i.remainingTTL = r - (i.now - o);
			}
		};
		let h = 0, n = () => {
			let t = this.#o.now();
			if (this.ttlResolution > 0) {
				h = t;
				let e = setTimeout(() => h = 0, this.ttlResolution);
				e.unref && e.unref();
			}
			return t;
		};
		this.getRemainingTTL = (t) => {
			let e = this.#c.get(t);
			return void 0 === e ? 0 : r(e);
		};
		let r = (i) => {
			let s = t[i], r = e[i];
			return s && r ? s - ((h || n()) - r) : 1 / 0;
		};
		this.#R = (i) => {
			let s = e[i], r = t[i];
			return !!r && !!s && (h || n()) - s > r;
		};
	}
	#M = () => {};
	#G = () => {};
	#L = () => {};
	#R = () => !1;
	#W() {
		let t = new k(this.#t);
		this.#l = 0, this.#S = t, this.#U = (e) => {
			this.#l -= t[e], t[e] = 0;
		}, this.#P = (t, e, i, s) => {
			if (!T(i)) {
				if (this.#z(e)) return this.backgroundFetchSize;
				if (!s) throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
				if ("function" != typeof s) throw new TypeError("sizeCalculation must be a function");
				if (i = s(e, t), !T(i)) throw new TypeError("sizeCalculation return invalid (expect positive integer)");
			}
			return i;
		}, this.#N = (e, i, s) => {
			if (t[e] = i, this.#e) {
				let i = this.#e - t[e];
				for (; this.#l > i;) this.#I(!0);
			}
			this.#l += t[e], s && (s.entrySize = i, s.totalCalculatedSize = this.#l);
		};
	}
	#U = (t) => {};
	#N = (t, e, i) => {};
	#P = (t, e, i, s) => {
		if (i || s) throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
		return 0;
	};
	*#k({ allowStale: t = this.allowStale } = {}) {
		if (this.#a) for (let e = this.#v; this.#H(e) && ((t || !this.#R(e)) && (yield e), e !== this.#g);) e = this.#p[e];
	}
	*#C({ allowStale: t = this.allowStale } = {}) {
		if (this.#a) for (let e = this.#g; this.#H(e) && ((t || !this.#R(e)) && (yield e), e !== this.#v);) e = this.#d[e];
	}
	#H(t) {
		return void 0 !== t && this.#c.get(this.#u[t]) === t;
	}
	*entries() {
		for (let t of this.#k()) void 0 !== this.#f[t] && void 0 !== this.#u[t] && !this.#z(this.#f[t]) && (yield [this.#u[t], this.#f[t]]);
	}
	*rentries() {
		for (let t of this.#C()) void 0 !== this.#f[t] && void 0 !== this.#u[t] && !this.#z(this.#f[t]) && (yield [this.#u[t], this.#f[t]]);
	}
	*keys() {
		for (let t of this.#k()) {
			let e = this.#u[t];
			void 0 !== e && !this.#z(this.#f[t]) && (yield e);
		}
	}
	*rkeys() {
		for (let t of this.#C()) {
			let e = this.#u[t];
			void 0 !== e && !this.#z(this.#f[t]) && (yield e);
		}
	}
	*values() {
		for (let t of this.#k()) void 0 !== this.#f[t] && !this.#z(this.#f[t]) && (yield this.#f[t]);
	}
	*rvalues() {
		for (let t of this.#C()) void 0 !== this.#f[t] && !this.#z(this.#f[t]) && (yield this.#f[t]);
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	[Symbol.toStringTag] = "LRUCache";
	find(t, e = {}) {
		for (let i of this.#k()) {
			let s = this.#f[i], h = this.#z(s) ? s.__staleWhileFetching : s;
			if (void 0 !== h && t(h, this.#u[i], this)) return this.#$(this.#u[i], e);
		}
	}
	forEach(t, e = this) {
		for (let i of this.#k()) {
			let s = this.#f[i], h = this.#z(s) ? s.__staleWhileFetching : s;
			void 0 !== h && t.call(e, h, this.#u[i], this);
		}
	}
	rforEach(t, e = this) {
		for (let i of this.#C()) {
			let s = this.#f[i], h = this.#z(s) ? s.__staleWhileFetching : s;
			void 0 !== h && t.call(e, h, this.#u[i], this);
		}
	}
	purgeStale() {
		let t = !1;
		for (let e of this.#C({ allowStale: !0 })) this.#R(e) && (this.#j(this.#u[e], "expire"), t = !0);
		return t;
	}
	info(t) {
		let e = this.#c.get(t);
		if (void 0 === e) return;
		let i = this.#f[e], s = this.#z(i) ? i.__staleWhileFetching : i;
		if (void 0 === s) return;
		let h = { value: s };
		if (this.#b && this.#y) {
			let t = this.#b[e], i = this.#y[e];
			t && i && (h.ttl = t - (this.#o.now() - i), h.start = Date.now());
		}
		return this.#S && (h.size = this.#S[e]), h;
	}
	dump() {
		let t = [];
		for (let e of this.#k({ allowStale: !0 })) {
			let i = this.#u[e], s = this.#f[e], h = this.#z(s) ? s.__staleWhileFetching : s;
			if (void 0 === h || void 0 === i) continue;
			let n = { value: h };
			if (this.#b && this.#y) {
				n.ttl = this.#b[e];
				let t = this.#o.now() - this.#y[e];
				n.start = Math.floor(Date.now() - t);
			}
			this.#S && (n.size = this.#S[e]), t.unshift([i, n]);
		}
		return t;
	}
	load(t) {
		this.clear();
		for (let [e, i] of t) {
			if (i.start) {
				let t = Date.now() - i.start;
				i.start = this.#o.now() - t;
			}
			this.#B(e, i.value, i);
		}
	}
	set(t, e, i = {}) {
		let { status: s = _.hasSubscribers ? {} : void 0 } = i;
		i.status = s, s && (s.op = "set", s.key = t, void 0 !== e && (s.value = e), s.cache = this);
		let h = this.#B(t, e, i);
		return s && _.hasSubscribers && _.publish(s), h;
	}
	#B(t, e, i, s) {
		let { ttl: h = this.ttl, start: n, noDisposeOnSet: r = this.noDisposeOnSet, sizeCalculation: o = this.sizeCalculation, status: a } = i, l = this.#z(e);
		if (void 0 === e) return a && (a.set = "deleted"), this.delete(t), this;
		let { noUpdateTTL: c = this.noUpdateTTL } = i;
		a && !l && (a.value = e);
		let u = this.#P(t, e, i.size || 0, o, a);
		if (this.maxEntrySize && u > this.maxEntrySize) return this.#j(t, "set"), a && (a.set = "miss", a.maxEntrySizeExceeded = !0), this;
		let f = 0 === this.#a ? void 0 : this.#c.get(t);
		if (void 0 === f) f = 0 === this.#a ? this.#v : 0 !== this.#w.length ? this.#w.pop() : this.#a === this.#t ? this.#I(!1) : this.#a, this.#u[f] = t, this.#f[f] = e, this.#c.set(t, f), this.#d[this.#v] = f, this.#p[f] = this.#v, this.#v = f, this.#a++, this.#N(f, u, a), a && (a.set = "add"), c = !1, this.#A && !l && this.#s?.(e, t, "add");
		else {
			this.#x(f);
			let i = this.#f[f];
			if (e !== i) {
				if (!r) if (this.#z(i)) {
					i !== s && i.__abortController.abort(/* @__PURE__ */ new Error("replaced"));
					let { __staleWhileFetching: h } = i;
					void 0 !== h && h !== e && (this.#E && this.#i?.(h, t, "set"), this.#O && this.#m?.push([
						h,
						t,
						"set"
					]));
				} else this.#E && this.#i?.(i, t, "set"), this.#O && this.#m?.push([
					i,
					t,
					"set"
				]);
				if (this.#U(f), this.#N(f, u, a), this.#f[f] = e, !l) {
					let s = i && this.#z(i) ? i.__staleWhileFetching : i, h = void 0 === s ? "add" : e !== s ? "replace" : "update";
					a && (a.set = h, void 0 !== s && (a.oldValue = s)), this.#A && this.onInsert?.(e, t, h);
				}
			} else l || (a && (a.set = "update"), this.#A && this.onInsert?.(e, t, "update"));
		}
		if (0 !== h && !this.#b && this.#D(), this.#b && (c || this.#L(f, h, n), a && this.#G(a, f)), !r && this.#O && this.#m) {
			let t, e = this.#m;
			for (; t = e?.shift();) this.#h?.(...t);
		}
		return this;
	}
	pop() {
		try {
			for (; this.#a;) {
				let t = this.#f[this.#g];
				if (this.#I(!0), this.#z(t)) {
					if (t.__staleWhileFetching) return t.__staleWhileFetching;
				} else if (void 0 !== t) return t;
			}
		} finally {
			if (this.#O && this.#m) {
				let t, e = this.#m;
				for (; t = e?.shift();) this.#h?.(...t);
			}
		}
	}
	#I(t) {
		let e = this.#g, i = this.#u[e], s = this.#f[e], h = this.#z(s);
		h && s.__abortController.abort(/* @__PURE__ */ new Error("evicted"));
		let n = h ? s.__staleWhileFetching : s;
		return (this.#E || this.#O) && void 0 !== n && (this.#E && this.#i?.(n, i, "evict"), this.#O && this.#m?.push([
			n,
			i,
			"evict"
		])), this.#U(e), this.#_?.[e] && (clearTimeout(this.#_[e]), this.#_[e] = void 0), t && (this.#u[e] = void 0, this.#f[e] = void 0, this.#w.push(e)), 1 === this.#a ? (this.#g = this.#v = 0, this.#w.length = 0) : this.#g = this.#d[e], this.#c.delete(i), this.#a--, e;
	}
	has(t, e = {}) {
		let { status: i = _.hasSubscribers ? {} : void 0 } = e;
		e.status = i, i && (i.op = "has", i.key = t, i.cache = this);
		let s = this.#q(t, e);
		return _.hasSubscribers && _.publish(i), s;
	}
	#q(t, e = {}) {
		let { updateAgeOnHas: i = this.updateAgeOnHas, status: s } = e, h = this.#c.get(t);
		if (void 0 !== h) {
			let t = this.#f[h];
			if (this.#z(t) && void 0 === t.__staleWhileFetching) return !1;
			if (!this.#R(h)) return i && this.#M(h), s && (s.has = "hit", this.#G(s, h)), !0;
			s && (s.has = "stale", this.#G(s, h));
		} else s && (s.has = "miss");
		return !1;
	}
	peek(t, e = {}) {
		let { status: i = O() ? {} : void 0 } = e;
		i && (i.op = "peek", i.key = t, i.cache = this), e.status = i;
		let s = this.#V(t, e);
		return _.hasSubscribers && _.publish(i), s;
	}
	#V(t, e) {
		let { status: i, allowStale: s = this.allowStale } = e, h = this.#c.get(t);
		if (void 0 === h || !s && this.#R(h)) return void (i && (i.peek = void 0 === h ? "miss" : "stale"));
		let n = this.#f[h], r = this.#z(n) ? n.__staleWhileFetching : n;
		return i && (void 0 !== r ? (i.peek = "hit", i.value = r) : i.peek = "miss"), r;
	}
	#T(t, e, i, s) {
		let h = void 0 === e ? void 0 : this.#f[e];
		if (this.#z(h)) return h;
		let n = new AbortController(), { signal: r } = i;
		r?.addEventListener("abort", () => n.abort(r.reason), { signal: n.signal });
		let o = {
			signal: n.signal,
			options: i,
			context: s
		}, a = (s, h = !1) => {
			let { aborted: r } = n.signal, a = i.ignoreFetchAbort && void 0 !== s, u = i.ignoreFetchAbort || !(!i.allowStaleOnFetchAbort || void 0 === s);
			if (i.status && (r && !h ? (i.status.fetchAborted = !0, i.status.fetchError = n.signal.reason, a && (i.status.fetchAbortIgnored = !0)) : i.status.fetchResolved = !0), r && !a && !h) return l(n.signal.reason, u);
			let f = c, d = this.#f[e];
			return (d === c || void 0 === d && a && h) && (void 0 === s ? void 0 !== f.__staleWhileFetching ? this.#f[e] = f.__staleWhileFetching : this.#j(t, "fetch") : (i.status && (i.status.fetchUpdated = !0), this.#B(t, s, o.options, f))), s;
		}, l = (s, h) => {
			let { aborted: r } = n.signal, o = r && i.allowStaleOnFetchAbort, a = o || i.allowStaleOnFetchRejection, l = a || i.noDeleteOnFetchRejection, u = c;
			if (this.#f[e] === c && (!l || !h && void 0 === u.__staleWhileFetching ? this.#j(t, "fetch") : o || (this.#f[e] = u.__staleWhileFetching)), a) return i.status && void 0 !== u.__staleWhileFetching && (i.status.returnedStale = !0), u.__staleWhileFetching;
			if (u.__returned === u) throw s;
		};
		i.status && (i.status.fetchDispatched = !0);
		let c = new Promise((e, s) => {
			let r = this.#n?.(t, h, o);
			n.signal.addEventListener("abort", () => {
				(!i.ignoreFetchAbort || i.allowStaleOnFetchAbort) && (e(void 0), i.allowStaleOnFetchAbort && (e = (t) => a(t, !0)));
			}), r && r instanceof Promise ? r.then((t) => e(void 0 === t ? void 0 : t), s) : void 0 !== r && e(r);
		}).then(a, (t) => (i.status && (i.status.fetchRejected = !0, i.status.fetchError = t), l(t, !1))), u = Object.assign(c, {
			__abortController: n,
			__staleWhileFetching: h,
			__returned: void 0
		});
		return void 0 === e ? (this.#B(t, u, {
			...o.options,
			status: void 0
		}), e = this.#c.get(t)) : this.#f[e] = u, u;
	}
	#z(t) {
		if (!this.#F) return !1;
		let e = t;
		return !!e && e instanceof Promise && e.hasOwnProperty("__staleWhileFetching") && e.__abortController instanceof AbortController;
	}
	fetch(t, e = {}) {
		let i = E.hasSubscribers, { status: s = O() ? {} : void 0 } = e;
		e.status = s, s && e.context && (s.context = e.context);
		let h = this.#X(t, e);
		return s && i && (s.trace = !0, E.tracePromise(() => h, s).catch(() => {})), h;
	}
	async #X(t, e = {}) {
		let { allowStale: i = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: h = this.noDeleteOnStaleGet, ttl: n = this.ttl, noDisposeOnSet: r = this.noDisposeOnSet, size: o = 0, sizeCalculation: a = this.sizeCalculation, noUpdateTTL: l = this.noUpdateTTL, noDeleteOnFetchRejection: c = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection: u = this.allowStaleOnFetchRejection, ignoreFetchAbort: f = this.ignoreFetchAbort, allowStaleOnFetchAbort: d = this.allowStaleOnFetchAbort, context: p, forceRefresh: g = !1, status: v, signal: w } = e;
		if (v && (v.op = "fetch", v.key = t, g && (v.forceRefresh = !0), v.cache = this), !this.#F) return v && (v.fetch = "get"), this.#$(t, {
			allowStale: i,
			updateAgeOnGet: s,
			noDeleteOnStaleGet: h,
			status: v
		});
		let m = {
			allowStale: i,
			updateAgeOnGet: s,
			noDeleteOnStaleGet: h,
			ttl: n,
			noDisposeOnSet: r,
			size: o,
			sizeCalculation: a,
			noUpdateTTL: l,
			noDeleteOnFetchRejection: c,
			allowStaleOnFetchRejection: u,
			allowStaleOnFetchAbort: d,
			ignoreFetchAbort: f,
			status: v,
			signal: w
		}, S = this.#c.get(t);
		if (void 0 === S) {
			v && (v.fetch = "miss");
			let e = this.#T(t, S, m, p);
			return e.__returned = e;
		}
		{
			let e = this.#f[S];
			if (this.#z(e)) {
				let t = i && void 0 !== e.__staleWhileFetching;
				return v && (v.fetch = "inflight", t && (v.returnedStale = !0)), t ? e.__staleWhileFetching : e.__returned = e;
			}
			let h = this.#R(S);
			if (!g && !h) return v && (v.fetch = "hit"), this.#x(S), s && this.#M(S), v && this.#G(v, S), e;
			let n = this.#T(t, S, m, p), r = void 0 !== n.__staleWhileFetching && i;
			return v && (v.fetch = h ? "stale" : "refresh", r && h && (v.returnedStale = !0)), r ? n.__staleWhileFetching : n.__returned = n;
		}
	}
	forceFetch(t, e = {}) {
		let i = E.hasSubscribers, { status: s = O() ? {} : void 0 } = e;
		e.status = s, s && e.context && (s.context = e.context);
		let h = this.#Y(t, e);
		return s && i && (s.trace = !0, E.tracePromise(() => h, s).catch(() => {})), h;
	}
	async #Y(t, e = {}) {
		let i = await this.#X(t, e);
		if (void 0 === i) throw new Error("fetch() returned undefined");
		return i;
	}
	memo(t, e = {}) {
		let { status: i = _.hasSubscribers ? {} : void 0 } = e;
		e.status = i, i && (i.op = "memo", i.key = t, e.context && (i.context = e.context), i.cache = this);
		let s = this.#J(t, e);
		return i && (i.value = s), _.hasSubscribers && _.publish(i), s;
	}
	#J(t, e = {}) {
		let i = this.#r;
		if (!i) throw new Error("no memoMethod provided to constructor");
		let { context: s, status: h, forceRefresh: n, ...r } = e;
		h && n && (h.forceRefresh = !0);
		let o = this.#$(t, r), a = n || void 0 === o;
		if (h && (h.memo = a ? "miss" : "hit", a || (h.value = o)), !a) return o;
		let l = i(t, o, {
			options: r,
			context: s
		});
		return h && (h.value = l), this.#B(t, l, r), l;
	}
	get(t, e = {}) {
		let { status: i = _.hasSubscribers ? {} : void 0 } = e;
		e.status = i, i && (i.op = "get", i.key = t, i.cache = this);
		let s = this.#$(t, e);
		return i && (void 0 !== s && (i.value = s), _.hasSubscribers && _.publish(i)), s;
	}
	#$(t, e = {}) {
		let { allowStale: i = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: h = this.noDeleteOnStaleGet, status: n } = e, r = this.#c.get(t);
		if (void 0 === r) return void (n && (n.get = "miss"));
		let o = this.#f[r], a = this.#z(o);
		return n && this.#G(n, r), this.#R(r) ? a ? (n && (n.get = "stale-fetching"), i && void 0 !== o.__staleWhileFetching ? (n && (n.returnedStale = !0), o.__staleWhileFetching) : void 0) : (h || this.#j(t, "expire"), n && (n.get = "stale"), i ? (n && (n.returnedStale = !0), o) : void 0) : (n && (n.get = a ? "fetching" : "hit"), this.#x(r), s && this.#M(r), a ? o.__staleWhileFetching : o);
	}
	#K(t, e) {
		this.#p[e] = t, this.#d[t] = e;
	}
	#x(t) {
		t !== this.#v && (t === this.#g ? this.#g = this.#d[t] : this.#K(this.#p[t], this.#d[t]), this.#K(this.#v, t), this.#v = t);
	}
	delete(t) {
		return this.#j(t, "delete");
	}
	#j(t, e) {
		_.hasSubscribers && _.publish({
			op: "delete",
			delete: e,
			key: t,
			cache: this
		});
		let i = !1;
		if (0 !== this.#a) {
			let s = this.#c.get(t);
			if (void 0 !== s) if (this.#_?.[s] && (clearTimeout(this.#_[s]), this.#_[s] = void 0), i = !0, 1 === this.#a) this.#Q(e);
			else {
				this.#U(s);
				let i = this.#f[s];
				if (this.#z(i) ? i.__abortController.abort(/* @__PURE__ */ new Error("deleted")) : (this.#E || this.#O) && (this.#E && this.#i?.(i, t, e), this.#O && this.#m?.push([
					i,
					t,
					e
				])), this.#c.delete(t), this.#u[s] = void 0, this.#f[s] = void 0, s === this.#v) this.#v = this.#p[s];
				else if (s === this.#g) this.#g = this.#d[s];
				else {
					let t = this.#p[s];
					this.#d[t] = this.#d[s];
					let e = this.#d[s];
					this.#p[e] = this.#p[s];
				}
				this.#a--, this.#w.push(s);
			}
		}
		if (this.#O && this.#m?.length) {
			let t, e = this.#m;
			for (; t = e?.shift();) this.#h?.(...t);
		}
		return i;
	}
	clear() {
		return this.#Q("delete");
	}
	#Q(t) {
		for (let e of this.#C({ allowStale: !0 })) {
			let i = this.#f[e];
			if (this.#z(i)) i.__abortController.abort(/* @__PURE__ */ new Error("deleted"));
			else {
				let s = this.#u[e];
				this.#E && this.#i?.(i, s, t), this.#O && this.#m?.push([
					i,
					s,
					t
				]);
			}
		}
		if (this.#c.clear(), this.#f.fill(void 0), this.#u.fill(void 0), this.#b && this.#y) {
			this.#b.fill(0), this.#y.fill(0);
			for (let t of this.#_ ?? []) void 0 !== t && clearTimeout(t);
			this.#_?.fill(void 0);
		}
		if (this.#S && this.#S.fill(0), this.#g = 0, this.#v = 0, this.#w.length = 0, this.#l = 0, this.#a = 0, this.#O && this.#m) {
			let t, e = this.#m;
			for (; t = e?.shift();) this.#h?.(...t);
		}
	}
}, W = class {
	static defaultOptions = {
		max: 1e3,
		ttl: 18e5
	};
	static cache = new R(this.defaultOptions);
	static createCache(t = this.defaultOptions) {
		return new R(t);
	}
	static set(t, e, i = this.cache) {
		let s = i;
		s || (s = this.cache), s.set(t, e);
	}
	static get(t, e = this.cache) {
		let i = e;
		return i || (i = this.cache), i.get(t);
	}
	static remove(t, e = this.cache) {
		let i = e;
		return i || (i = this.cache), i.del(t);
	}
	static has(t, e = this.cache) {
		let i = e;
		return i || (i = this.cache), i.has(t);
	}
	static count(t = this.cache) {
		let e = t;
		return e || (e = this.cache), e.size;
	}
	static maxSize(t = this.cache) {
		let e = t;
		return e || (e = this.cache), e.max;
	}
	static peek(t, e = this.cache) {
		let i = e;
		return i || (i = this.cache), i.peek(t);
	}
	static keys(t = this.cache) {
		let e = t;
		return e || (e = this.cache), e.keys();
	}
	static clear(t = this.cache) {
		let e = t;
		e || (e = this.cache), e.clear();
	}
}, D = /* @__PURE__ */ e({
	clear: () => B,
	count: () => I,
	createCache: () => M,
	get: () => U,
	getCacheObject: () => j,
	has: () => N,
	keys: () => q,
	maxSize: () => H,
	peek: () => $,
	remove: () => P,
	set: () => G
});
const L = /* @__PURE__ */ new Map();
async function M(t, e = void 0) {
	const i = {
		max: 1e3,
		ttl: 18e5
	};
	let s = i;
	e && (s = {
		...i,
		...e
	});
	const h = W.createCache(s);
	return L.set(t, h), h;
}
async function j(t = "") {
	let e;
	return e = L.has(t) ? L.get(t) : await M(t), e;
}
async function G(t, e, i = "") {
	const s = await j(i);
	return !!s && (W.set(t, e, s), !0);
}
async function U(t, e = "") {
	const i = await j(e);
	if (i) return W.get(t, i);
}
async function P(t, e = "") {
	const i = await j(e);
	if (i) return W.remove(t, i);
}
async function N(t, e = "") {
	const i = await j(e);
	return !!i && W.has(t, i);
}
async function I(t = "") {
	const e = await j(t);
	return e ? W.count(e) : 0;
}
async function H(t = "") {
	const e = await j(t);
	return e ? W.maxSize(e) : 0;
}
async function $(t, e = "") {
	const i = await j(e);
	return !!i && W.peek(t, i);
}
async function B(t = "") {
	const e = await j(t);
	return e && W.clear(e), !1;
}
async function q(t = "") {
	const e = await j(t);
	if (e) return W.keys(e);
}
l(D);
