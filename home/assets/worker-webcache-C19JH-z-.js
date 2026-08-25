var t = Object.defineProperty;
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/ const e = Symbol("Comlink.proxy"), i = Symbol("Comlink.endpoint"), s = Symbol("Comlink.releaseProxy"), h = Symbol("Comlink.finalizer"), n = Symbol("Comlink.thrown"), r = (t) => "object" == typeof t && null !== t || "function" == typeof t, o = /* @__PURE__ */ new Map([["proxy", {
	canHandle: (t) => r(t) && t[e],
	serialize(t) {
		const { port1: e, port2: i } = new MessageChannel();
		return a(t, e), [i, [i]];
	},
	deserialize: (t) => (t.start(), function(t) {
		const e = /* @__PURE__ */ new Map();
		return t.addEventListener("message", function(t) {
			const { data: i } = t;
			if (!i || !i.id) return;
			const s = e.get(i.id);
			if (s) try {
				s(i);
			} finally {
				e.delete(i.id);
			}
		}), p(t, e, [], void 0);
	}(t))
}], ["throw", {
	canHandle: (t) => r(t) && n in t,
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
function a(t, i = globalThis, s = ["*"]) {
	i.addEventListener("message", function r(o) {
		if (!o || !o.data) return;
		if (!function(t, e) {
			for (const i of t) {
				if (e === i || "*" === i) return !0;
				if (i instanceof RegExp && i.test(e)) return !0;
			}
			return !1;
		}(s, o.origin)) return void console.warn(`Invalid origin '${o.origin}' for comlink proxy`);
		const { id: c, type: u, path: f } = Object.assign({ path: [] }, o.data), d = (o.data.argumentList || []).map(w);
		let p;
		try {
			const i = f.slice(0, -1).reduce((t, e) => t[e], t), s = f.reduce((t, e) => t[e], t);
			switch (u) {
				case "GET":
					p = s;
					break;
				case "SET":
					i[f.slice(-1)[0]] = w(o.data.value), p = !0;
					break;
				case "APPLY":
					p = s.apply(i, d);
					break;
				case "CONSTRUCT":
					p = function(t) {
						return Object.assign(t, { [e]: !0 });
					}(new s(...d));
					break;
				case "ENDPOINT":
					{
						const { port1: e, port2: i } = new MessageChannel();
						a(t, i), p = function(t, e) {
							return v.set(t, e), t;
						}(e, [e]);
					}
					break;
				case "RELEASE":
					p = void 0;
					break;
				default: return;
			}
		} catch (t) {
			p = {
				value: t,
				[n]: 0
			};
		}
		Promise.resolve(p).catch((t) => ({
			value: t,
			[n]: 0
		})).then((e) => {
			const [s, n] = m(e);
			i.postMessage(Object.assign(Object.assign({}, s), { id: c }), n), "RELEASE" === u && (i.removeEventListener("message", r), l(i), h in t && "function" == typeof t[h] && t[h]());
		}).catch((t) => {
			const [e, s] = m({
				value: /* @__PURE__ */ new TypeError("Unserializable return value"),
				[n]: 0
			});
			i.postMessage(Object.assign(Object.assign({}, e), { id: c }), s);
		});
	}), i.start && i.start();
}
function l(t) {
	(function(t) {
		return "MessagePort" === t.constructor.name;
	})(t) && t.close();
}
function c(t) {
	if (t) throw new Error("Proxy has been released and is not useable");
}
function u(t) {
	return S(t, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then(() => {
		l(t);
	});
}
const f = /* @__PURE__ */ new WeakMap(), d = "FinalizationRegistry" in globalThis && new FinalizationRegistry((t) => {
	const e = (f.get(t) || 0) - 1;
	f.set(t, e), 0 === e && u(t);
});
function p(t, e, h = [], n = function() {}) {
	let r = !1;
	const o = new Proxy(n, {
		get(i, n) {
			if (c(r), n === s) return () => {
				(function(t) {
					d && d.unregister(t);
				})(o), u(t), e.clear(), r = !0;
			};
			if ("then" === n) {
				if (0 === h.length) return { then: () => o };
				const i = S(t, e, {
					type: "GET",
					path: h.map((t) => t.toString())
				}).then(w);
				return i.then.bind(i);
			}
			return p(t, e, [...h, n]);
		},
		set(i, s, n) {
			c(r);
			const [o, a] = m(n);
			return S(t, e, {
				type: "SET",
				path: [...h, s].map((t) => t.toString()),
				value: o
			}, a).then(w);
		},
		apply(s, n, o) {
			c(r);
			const a = h[h.length - 1];
			if (a === i) return S(t, e, { type: "ENDPOINT" }).then(w);
			if ("bind" === a) return p(t, e, h.slice(0, -1));
			const [l, u] = g(o);
			return S(t, e, {
				type: "APPLY",
				path: h.map((t) => t.toString()),
				argumentList: l
			}, u).then(w);
		},
		construct(i, s) {
			c(r);
			const [n, o] = g(s);
			return S(t, e, {
				type: "CONSTRUCT",
				path: h.map((t) => t.toString()),
				argumentList: n
			}, o).then(w);
		}
	});
	return function(t, e) {
		const i = (f.get(e) || 0) + 1;
		f.set(e, i), d && d.register(t, e, t);
	}(o, t), o;
}
function g(t) {
	const e = t.map(m);
	return [e.map((t) => t[0]), (i = e.map((t) => t[1]), Array.prototype.concat.apply([], i))];
	var i;
}
const v = /* @__PURE__ */ new WeakMap();
function m(t) {
	for (const [e, i] of o) if (i.canHandle(t)) {
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
	}, v.get(t) || []];
}
function w(t) {
	switch (t.type) {
		case "HANDLER": return o.get(t.name).deserialize(t.value);
		case "RAW": return t.value;
	}
}
function S(t, e, i, s) {
	return new Promise((h) => {
		const n = new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
		e.set(n, h), t.start && t.start(), t.postMessage(Object.assign({ id: n }, i), s);
	});
}
var b = { hasSubscribers: !1 }, y = b, z = b, _ = "object" == typeof performance && performance && "function" == typeof performance.now ? performance : Date, E = () => y.hasSubscribers || z.hasSubscribers, O = /* @__PURE__ */ new Set(), A = "object" == typeof process && process ? process : {}, F = (t) => !!t && t === Math.floor(t) && t > 0 && isFinite(t), T = (t) => F(t) ? t <= Math.pow(2, 8) ? Uint8Array : t <= Math.pow(2, 16) ? Uint16Array : t <= Math.pow(2, 32) ? Uint32Array : t <= Number.MAX_SAFE_INTEGER ? x : null : null, x = class extends Array {
	constructor(t) {
		super(t), this.fill(0);
	}
}, k = class t {
	heap;
	length;
	static #t = !1;
	static create(e) {
		let i = T(e);
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
	#m;
	#w;
	#S;
	#b;
	#y;
	#z;
	#_;
	#E;
	#O;
	#A;
	static unsafeExposeInternals(t) {
		return {
			starts: t.#b,
			ttls: t.#y,
			autopurgeTimers: t.#z,
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
			free: t.#m,
			isBackgroundFetch: (e) => t.#F(e),
			backgroundFetch: (e, i, s, h) => t.#T(e, i, s, h),
			moveToTail: (e) => t.#x(e),
			indexes: (e) => t.#k(e),
			rindexes: (e) => t.#R(e),
			isStale: (e) => t.#C(e)
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
		let { max: i = 0, ttl: s, ttlResolution: h = 1, ttlAutopurge: n, updateAgeOnGet: r, updateAgeOnHas: o, allowStale: a, dispose: l, onInsert: c, disposeAfter: u, noDisposeOnSet: f, noUpdateTTL: d, maxSize: p = 0, maxEntrySize: g = 0, sizeCalculation: v, fetchMethod: m, memoMethod: w, noDeleteOnFetchRejection: S, noDeleteOnStaleGet: b, allowStaleOnFetchRejection: y, allowStaleOnFetchAbort: z, ignoreFetchAbort: E, backgroundFetchSize: x = 1, perf: R } = e;
		if (this.backgroundFetchSize = x, void 0 !== R && "function" != typeof R?.now) throw new TypeError("perf option must have a now() method if specified");
		if (this.#o = R ?? _, 0 !== i && !F(i)) throw new TypeError("max option must be a nonnegative integer");
		let C = i ? T(i) : Array;
		if (!C) throw new Error("invalid max value: " + i);
		if (this.#t = i, this.#e = p, this.maxEntrySize = g || this.#e, this.sizeCalculation = v, this.sizeCalculation) {
			if (!this.#e && !this.maxEntrySize) throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
			if ("function" != typeof this.sizeCalculation) throw new TypeError("sizeCalculation set to non-function");
		}
		if (void 0 !== w && "function" != typeof w) throw new TypeError("memoMethod must be a function if defined");
		if (this.#r = w, void 0 !== m && "function" != typeof m) throw new TypeError("fetchMethod must be a function if specified");
		if (this.#n = m, this.#E = !!m, this.#c = /* @__PURE__ */ new Map(), this.#u = Array.from({ length: i }).fill(void 0), this.#f = Array.from({ length: i }).fill(void 0), this.#d = new C(i), this.#p = new C(i), this.#g = 0, this.#v = 0, this.#m = k.create(i), this.#a = 0, this.#l = 0, "function" == typeof l && (this.#i = l), "function" == typeof c && (this.#s = c), "function" == typeof u ? (this.#h = u, this.#w = []) : (this.#h = void 0, this.#w = void 0), this.#_ = !!this.#i, this.#A = !!this.#s, this.#O = !!this.#h, this.noDisposeOnSet = !!f, this.noUpdateTTL = !!d, this.noDeleteOnFetchRejection = !!S, this.allowStaleOnFetchRejection = !!y, this.allowStaleOnFetchAbort = !!z, this.ignoreFetchAbort = !!E, 0 !== this.maxEntrySize) {
			if (0 !== this.#e && !F(this.#e)) throw new TypeError("maxSize must be a positive integer if specified");
			if (!F(this.maxEntrySize)) throw new TypeError("maxEntrySize must be a positive integer if specified");
			this.#j();
		}
		if (this.allowStale = !!a, this.noDeleteOnStaleGet = !!b, this.updateAgeOnGet = !!r, this.updateAgeOnHas = !!o, this.ttlResolution = F(h) || 0 === h ? h : 1, this.ttlAutopurge = !!n, this.ttl = s || 0, this.ttl) {
			if (!F(this.ttl)) throw new TypeError("ttl must be a positive integer if specified");
			this.#D();
		}
		if (0 === this.#t && 0 === this.ttl && 0 === this.#e) throw new TypeError("At least one of max, maxSize, or ttl is required");
		if (!this.ttlAutopurge && !this.#t && !this.#e) {
			let e = "LRU_CACHE_UNBOUNDED";
			((t) => !O.has(t))(e) && (O.add(e), ((t, e, i, s) => {
				"function" == typeof A.emitWarning ? A.emitWarning(t, e, i, s) : console.error(`[${i}] ${e}: ${t}`);
			})("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", e, t));
		}
	}
	getRemainingTTL(t) {
		return this.#c.has(t) ? 1 / 0 : 0;
	}
	#D() {
		let t = new x(this.#t), e = new x(this.#t);
		this.#y = t, this.#b = e;
		let i = this.ttlAutopurge ? Array.from({ length: this.#t }) : void 0;
		this.#z = i, this.#W = (i, h, n = this.#o.now()) => {
			e[i] = 0 !== h ? n : 0, t[i] = h, s(i, h);
		}, this.#M = (i) => {
			e[i] = 0 !== t[i] ? this.#o.now() : 0, s(i, t[i]);
		};
		let s = this.ttlAutopurge ? (t, e) => {
			if (i?.[t] && (clearTimeout(i[t]), i[t] = void 0), e && 0 !== e && i) {
				let h = setTimeout(() => {
					this.#C(t) ? (this.#L(this.#u[t], "expire"), i[t] = void 0) : s(t, r(t));
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
		this.#C = (i) => {
			let s = e[i], r = t[i];
			return !!r && !!s && (h || n()) - s > r;
		};
	}
	#M = () => {};
	#G = () => {};
	#W = () => {};
	#C = () => !1;
	#j() {
		let t = new x(this.#t);
		this.#l = 0, this.#S = t, this.#U = (e) => {
			this.#l -= t[e], t[e] = 0;
		}, this.#P = (t, e, i, s) => {
			if (!F(i)) {
				if (this.#F(e)) return this.backgroundFetchSize;
				if (!s) throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
				if ("function" != typeof s) throw new TypeError("sizeCalculation must be a function");
				if (i = s(e, t), !F(i)) throw new TypeError("sizeCalculation return invalid (expect positive integer)");
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
		if (this.#a) for (let e = this.#v; this.#H(e) && ((t || !this.#C(e)) && (yield e), e !== this.#g);) e = this.#p[e];
	}
	*#R({ allowStale: t = this.allowStale } = {}) {
		if (this.#a) for (let e = this.#g; this.#H(e) && ((t || !this.#C(e)) && (yield e), e !== this.#v);) e = this.#d[e];
	}
	#H(t) {
		return void 0 !== t && this.#c.get(this.#u[t]) === t;
	}
	*entries() {
		for (let t of this.#k()) void 0 !== this.#f[t] && void 0 !== this.#u[t] && !this.#F(this.#f[t]) && (yield [this.#u[t], this.#f[t]]);
	}
	*rentries() {
		for (let t of this.#R()) void 0 !== this.#f[t] && void 0 !== this.#u[t] && !this.#F(this.#f[t]) && (yield [this.#u[t], this.#f[t]]);
	}
	*keys() {
		for (let t of this.#k()) {
			let e = this.#u[t];
			void 0 !== e && !this.#F(this.#f[t]) && (yield e);
		}
	}
	*rkeys() {
		for (let t of this.#R()) {
			let e = this.#u[t];
			void 0 !== e && !this.#F(this.#f[t]) && (yield e);
		}
	}
	*values() {
		for (let t of this.#k()) void 0 !== this.#f[t] && !this.#F(this.#f[t]) && (yield this.#f[t]);
	}
	*rvalues() {
		for (let t of this.#R()) void 0 !== this.#f[t] && !this.#F(this.#f[t]) && (yield this.#f[t]);
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	[Symbol.toStringTag] = "LRUCache";
	find(t, e = {}) {
		for (let i of this.#k()) {
			let s = this.#f[i], h = this.#F(s) ? s.__staleWhileFetching : s;
			if (void 0 !== h && t(h, this.#u[i], this)) return this.#$(this.#u[i], e);
		}
	}
	forEach(t, e = this) {
		for (let i of this.#k()) {
			let s = this.#f[i], h = this.#F(s) ? s.__staleWhileFetching : s;
			void 0 !== h && t.call(e, h, this.#u[i], this);
		}
	}
	rforEach(t, e = this) {
		for (let i of this.#R()) {
			let s = this.#f[i], h = this.#F(s) ? s.__staleWhileFetching : s;
			void 0 !== h && t.call(e, h, this.#u[i], this);
		}
	}
	purgeStale() {
		let t = !1;
		for (let e of this.#R({ allowStale: !0 })) this.#C(e) && (this.#L(this.#u[e], "expire"), t = !0);
		return t;
	}
	info(t) {
		let e = this.#c.get(t);
		if (void 0 === e) return;
		let i = this.#f[e], s = this.#F(i) ? i.__staleWhileFetching : i;
		if (void 0 === s) return;
		let h = { value: s };
		if (this.#y && this.#b) {
			let t = this.#y[e], i = this.#b[e];
			t && i && (h.ttl = t - (this.#o.now() - i), h.start = Date.now());
		}
		return this.#S && (h.size = this.#S[e]), h;
	}
	dump() {
		let t = [];
		for (let e of this.#k({ allowStale: !0 })) {
			let i = this.#u[e], s = this.#f[e], h = this.#F(s) ? s.__staleWhileFetching : s;
			if (void 0 === h || void 0 === i) continue;
			let n = { value: h };
			if (this.#y && this.#b) {
				n.ttl = this.#y[e];
				let t = this.#o.now() - this.#b[e];
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
		let { status: s = y.hasSubscribers ? {} : void 0 } = i;
		i.status = s, s && (s.op = "set", s.key = t, void 0 !== e && (s.value = e), s.cache = this);
		let h = this.#B(t, e, i);
		return s && y.hasSubscribers && y.publish(s), h;
	}
	#B(t, e, i, s) {
		let { ttl: h = this.ttl, start: n, noDisposeOnSet: r = this.noDisposeOnSet, sizeCalculation: o = this.sizeCalculation, status: a } = i, l = this.#F(e);
		if (void 0 === e) return a && (a.set = "deleted"), this.delete(t), this;
		let { noUpdateTTL: c = this.noUpdateTTL } = i;
		a && !l && (a.value = e);
		let u = this.#P(t, e, i.size || 0, o, a);
		if (this.maxEntrySize && u > this.maxEntrySize) return this.#L(t, "set"), a && (a.set = "miss", a.maxEntrySizeExceeded = !0), this;
		let f = 0 === this.#a ? void 0 : this.#c.get(t);
		if (void 0 === f) f = 0 === this.#a ? this.#v : 0 !== this.#m.length ? this.#m.pop() : this.#a === this.#t ? this.#I(!1) : this.#a, this.#u[f] = t, this.#f[f] = e, this.#c.set(t, f), this.#d[this.#v] = f, this.#p[f] = this.#v, this.#v = f, this.#a++, this.#N(f, u, a), a && (a.set = "add"), c = !1, this.#A && !l && this.#s?.(e, t, "add");
		else {
			this.#x(f);
			let i = this.#f[f];
			if (e !== i) {
				if (!r) if (this.#F(i)) {
					i !== s && i.__abortController.abort(/* @__PURE__ */ new Error("replaced"));
					let { __staleWhileFetching: h } = i;
					void 0 !== h && h !== e && (this.#_ && this.#i?.(h, t, "set"), this.#O && this.#w?.push([
						h,
						t,
						"set"
					]));
				} else this.#_ && this.#i?.(i, t, "set"), this.#O && this.#w?.push([
					i,
					t,
					"set"
				]);
				if (this.#U(f), this.#N(f, u, a), this.#f[f] = e, !l) {
					let s = i && this.#F(i) ? i.__staleWhileFetching : i, h = void 0 === s ? "add" : e !== s ? "replace" : "update";
					a && (a.set = h, void 0 !== s && (a.oldValue = s)), this.#A && this.onInsert?.(e, t, h);
				}
			} else l || (a && (a.set = "update"), this.#A && this.onInsert?.(e, t, "update"));
		}
		if (0 !== h && !this.#y && this.#D(), this.#y && (c || this.#W(f, h, n), a && this.#G(a, f)), !r && this.#O && this.#w) {
			let t, e = this.#w;
			for (; t = e?.shift();) this.#h?.(...t);
		}
		return this;
	}
	pop() {
		try {
			for (; this.#a;) {
				let t = this.#f[this.#g];
				if (this.#I(!0), this.#F(t)) {
					if (t.__staleWhileFetching) return t.__staleWhileFetching;
				} else if (void 0 !== t) return t;
			}
		} finally {
			if (this.#O && this.#w) {
				let t, e = this.#w;
				for (; t = e?.shift();) this.#h?.(...t);
			}
		}
	}
	#I(t) {
		let e = this.#g, i = this.#u[e], s = this.#f[e], h = this.#F(s);
		h && s.__abortController.abort(/* @__PURE__ */ new Error("evicted"));
		let n = h ? s.__staleWhileFetching : s;
		return (this.#_ || this.#O) && void 0 !== n && (this.#_ && this.#i?.(n, i, "evict"), this.#O && this.#w?.push([
			n,
			i,
			"evict"
		])), this.#U(e), this.#z?.[e] && (clearTimeout(this.#z[e]), this.#z[e] = void 0), t && (this.#u[e] = void 0, this.#f[e] = void 0, this.#m.push(e)), 1 === this.#a ? (this.#g = this.#v = 0, this.#m.length = 0) : this.#g = this.#d[e], this.#c.delete(i), this.#a--, e;
	}
	has(t, e = {}) {
		let { status: i = y.hasSubscribers ? {} : void 0 } = e;
		e.status = i, i && (i.op = "has", i.key = t, i.cache = this);
		let s = this.#X(t, e);
		return y.hasSubscribers && y.publish(i), s;
	}
	#X(t, e = {}) {
		let { updateAgeOnHas: i = this.updateAgeOnHas, status: s } = e, h = this.#c.get(t);
		if (void 0 !== h) {
			let t = this.#f[h];
			if (this.#F(t) && void 0 === t.__staleWhileFetching) return !1;
			if (!this.#C(h)) return i && this.#M(h), s && (s.has = "hit", this.#G(s, h)), !0;
			s && (s.has = "stale", this.#G(s, h));
		} else s && (s.has = "miss");
		return !1;
	}
	peek(t, e = {}) {
		let { status: i = E() ? {} : void 0 } = e;
		i && (i.op = "peek", i.key = t, i.cache = this), e.status = i;
		let s = this.#Y(t, e);
		return y.hasSubscribers && y.publish(i), s;
	}
	#Y(t, e) {
		let { status: i, allowStale: s = this.allowStale } = e, h = this.#c.get(t);
		if (void 0 === h || !s && this.#C(h)) return void (i && (i.peek = void 0 === h ? "miss" : "stale"));
		let n = this.#f[h], r = this.#F(n) ? n.__staleWhileFetching : n;
		return i && (void 0 !== r ? (i.peek = "hit", i.value = r) : i.peek = "miss"), r;
	}
	#T(t, e, i, s) {
		let h = void 0 === e ? void 0 : this.#f[e];
		if (this.#F(h)) return h;
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
			return (d === c || void 0 === d && a && h) && (void 0 === s ? void 0 !== f.__staleWhileFetching ? this.#f[e] = f.__staleWhileFetching : this.#L(t, "fetch") : (i.status && (i.status.fetchUpdated = !0), this.#B(t, s, o.options, f))), s;
		}, l = (s, h) => {
			let { aborted: r } = n.signal, o = r && i.allowStaleOnFetchAbort, a = o || i.allowStaleOnFetchRejection, l = a || i.noDeleteOnFetchRejection, u = c;
			if (this.#f[e] === c && (!l || !h && void 0 === u.__staleWhileFetching ? this.#L(t, "fetch") : o || (this.#f[e] = u.__staleWhileFetching)), a) return i.status && void 0 !== u.__staleWhileFetching && (i.status.returnedStale = !0), u.__staleWhileFetching;
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
	#F(t) {
		if (!this.#E) return !1;
		let e = t;
		return !!e && e instanceof Promise && e.hasOwnProperty("__staleWhileFetching") && e.__abortController instanceof AbortController;
	}
	fetch(t, e = {}) {
		let i = z.hasSubscribers, { status: s = E() ? {} : void 0 } = e;
		e.status = s, s && e.context && (s.context = e.context);
		let h = this.#q(t, e);
		return s && i && (s.trace = !0, z.tracePromise(() => h, s).catch(() => {})), h;
	}
	async #q(t, e = {}) {
		let { allowStale: i = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: h = this.noDeleteOnStaleGet, ttl: n = this.ttl, noDisposeOnSet: r = this.noDisposeOnSet, size: o = 0, sizeCalculation: a = this.sizeCalculation, noUpdateTTL: l = this.noUpdateTTL, noDeleteOnFetchRejection: c = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection: u = this.allowStaleOnFetchRejection, ignoreFetchAbort: f = this.ignoreFetchAbort, allowStaleOnFetchAbort: d = this.allowStaleOnFetchAbort, context: p, forceRefresh: g = !1, status: v, signal: m } = e;
		if (v && (v.op = "fetch", v.key = t, g && (v.forceRefresh = !0), v.cache = this), !this.#E) return v && (v.fetch = "get"), this.#$(t, {
			allowStale: i,
			updateAgeOnGet: s,
			noDeleteOnStaleGet: h,
			status: v
		});
		let w = {
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
			signal: m
		}, S = this.#c.get(t);
		if (void 0 === S) {
			v && (v.fetch = "miss");
			let e = this.#T(t, S, w, p);
			return e.__returned = e;
		}
		{
			let e = this.#f[S];
			if (this.#F(e)) {
				let t = i && void 0 !== e.__staleWhileFetching;
				return v && (v.fetch = "inflight", t && (v.returnedStale = !0)), t ? e.__staleWhileFetching : e.__returned = e;
			}
			let h = this.#C(S);
			if (!g && !h) return v && (v.fetch = "hit"), this.#x(S), s && this.#M(S), v && this.#G(v, S), e;
			let n = this.#T(t, S, w, p), r = void 0 !== n.__staleWhileFetching && i;
			return v && (v.fetch = h ? "stale" : "refresh", r && h && (v.returnedStale = !0)), r ? n.__staleWhileFetching : n.__returned = n;
		}
	}
	forceFetch(t, e = {}) {
		let i = z.hasSubscribers, { status: s = E() ? {} : void 0 } = e;
		e.status = s, s && e.context && (s.context = e.context);
		let h = this.#K(t, e);
		return s && i && (s.trace = !0, z.tracePromise(() => h, s).catch(() => {})), h;
	}
	async #K(t, e = {}) {
		let i = await this.#q(t, e);
		if (void 0 === i) throw new Error("fetch() returned undefined");
		return i;
	}
	memo(t, e = {}) {
		let { status: i = y.hasSubscribers ? {} : void 0 } = e;
		e.status = i, i && (i.op = "memo", i.key = t, e.context && (i.context = e.context), i.cache = this);
		let s = this.#Q(t, e);
		return i && (i.value = s), y.hasSubscribers && y.publish(i), s;
	}
	#Q(t, e = {}) {
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
		let { status: i = y.hasSubscribers ? {} : void 0 } = e;
		e.status = i, i && (i.op = "get", i.key = t, i.cache = this);
		let s = this.#$(t, e);
		return i && (void 0 !== s && (i.value = s), y.hasSubscribers && y.publish(i)), s;
	}
	#$(t, e = {}) {
		let { allowStale: i = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: h = this.noDeleteOnStaleGet, status: n } = e, r = this.#c.get(t);
		if (void 0 === r) return void (n && (n.get = "miss"));
		let o = this.#f[r], a = this.#F(o);
		return n && this.#G(n, r), this.#C(r) ? a ? (n && (n.get = "stale-fetching"), i && void 0 !== o.__staleWhileFetching ? (n && (n.returnedStale = !0), o.__staleWhileFetching) : void 0) : (h || this.#L(t, "expire"), n && (n.get = "stale"), i ? (n && (n.returnedStale = !0), o) : void 0) : (n && (n.get = a ? "fetching" : "hit"), this.#x(r), s && this.#M(r), a ? o.__staleWhileFetching : o);
	}
	#V(t, e) {
		this.#p[e] = t, this.#d[t] = e;
	}
	#x(t) {
		t !== this.#v && (t === this.#g ? this.#g = this.#d[t] : this.#V(this.#p[t], this.#d[t]), this.#V(this.#v, t), this.#v = t);
	}
	delete(t) {
		return this.#L(t, "delete");
	}
	#L(t, e) {
		y.hasSubscribers && y.publish({
			op: "delete",
			delete: e,
			key: t,
			cache: this
		});
		let i = !1;
		if (0 !== this.#a) {
			let s = this.#c.get(t);
			if (void 0 !== s) if (this.#z?.[s] && (clearTimeout(this.#z[s]), this.#z[s] = void 0), i = !0, 1 === this.#a) this.#J(e);
			else {
				this.#U(s);
				let i = this.#f[s];
				if (this.#F(i) ? i.__abortController.abort(/* @__PURE__ */ new Error("deleted")) : (this.#_ || this.#O) && (this.#_ && this.#i?.(i, t, e), this.#O && this.#w?.push([
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
				this.#a--, this.#m.push(s);
			}
		}
		if (this.#O && this.#w?.length) {
			let t, e = this.#w;
			for (; t = e?.shift();) this.#h?.(...t);
		}
		return i;
	}
	clear() {
		return this.#J("delete");
	}
	#J(t) {
		for (let e of this.#R({ allowStale: !0 })) {
			let i = this.#f[e];
			if (this.#F(i)) i.__abortController.abort(/* @__PURE__ */ new Error("deleted"));
			else {
				let s = this.#u[e];
				this.#_ && this.#i?.(i, s, t), this.#O && this.#w?.push([
					i,
					s,
					t
				]);
			}
		}
		if (this.#c.clear(), this.#f.fill(void 0), this.#u.fill(void 0), this.#y && this.#b) {
			this.#y.fill(0), this.#b.fill(0);
			for (let t of this.#z ?? []) void 0 !== t && clearTimeout(t);
			this.#z?.fill(void 0);
		}
		if (this.#S && this.#S.fill(0), this.#g = 0, this.#v = 0, this.#m.length = 0, this.#l = 0, this.#a = 0, this.#O && this.#w) {
			let t, e = this.#w;
			for (; t = e?.shift();) this.#h?.(...t);
		}
	}
}, C = class {
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
}, j = ((e, i) => {
	let s = {};
	for (var h in e) t(s, h, {
		get: e[h],
		enumerable: !0
	});
	return i || t(s, Symbol.toStringTag, { value: "Module" }), s;
})({
	clear: () => $,
	count: () => N,
	createCache: () => W,
	get: () => G,
	getCacheObject: () => M,
	has: () => P,
	keys: () => B,
	maxSize: () => I,
	peek: () => H,
	remove: () => U,
	set: () => L
});
const D = /* @__PURE__ */ new Map();
async function W(t, e = void 0) {
	const i = {
		max: 1e3,
		ttl: 18e5
	};
	let s = i;
	e && (s = {
		...i,
		...e
	});
	const h = C.createCache(s);
	return D.set(t, h), h;
}
async function M(t = "") {
	let e;
	return e = D.has(t) ? D.get(t) : await W(t), e;
}
async function L(t, e, i = "") {
	const s = await M(i);
	return !!s && (C.set(t, e, s), !0);
}
async function G(t, e = "") {
	const i = await M(e);
	if (i) return C.get(t, i);
}
async function U(t, e = "") {
	const i = await M(e);
	if (i) return C.remove(t, i);
}
async function P(t, e = "") {
	const i = await M(e);
	return !!i && C.has(t, i);
}
async function N(t = "") {
	const e = await M(t);
	return e ? C.count(e) : 0;
}
async function I(t = "") {
	const e = await M(t);
	return e ? C.maxSize(e) : 0;
}
async function H(t, e = "") {
	const i = await M(e);
	return !!i && C.peek(t, i);
}
async function $(t = "") {
	const e = await M(t);
	return e && C.clear(e), !1;
}
async function B(t = "") {
	const e = await M(t);
	if (e) return C.keys(e);
}
a(j);
