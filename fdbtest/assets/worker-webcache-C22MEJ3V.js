var t = Object.defineProperty;
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/ const e = Symbol("Comlink.proxy"), i = Symbol("Comlink.endpoint"), s = Symbol("Comlink.releaseProxy"), n = Symbol("Comlink.finalizer"), h = Symbol("Comlink.thrown"), r = (t) => "object" == typeof t && null !== t || "function" == typeof t, o = new Map([["proxy", {
	canHandle: (t) => r(t) && t[e],
	serialize(t) {
		const { port1: e, port2: i } = new MessageChannel();
		return a(t, e), [i, [i]];
	},
	deserialize: (t) => (t.start(), function(t) {
		const e = /* @__PURE__ */ new Map();
		return t.addEventListener("message", (function(t) {
			const { data: i } = t;
			if (!i || !i.id) return;
			const s = e.get(i.id);
			if (s) try {
				s(i);
			} finally {
				e.delete(i.id);
			}
		})), p(t, e, [], void 0);
	}(t))
}], ["throw", {
	canHandle: (t) => r(t) && h in t,
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
	i.addEventListener("message", (function r(o) {
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
			const i = f.slice(0, -1).reduce(((t, e) => t[e]), t), s = f.reduce(((t, e) => t[e]), t);
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
				[h]: 0
			};
		}
		Promise.resolve(p).catch(((t) => ({
			value: t,
			[h]: 0
		}))).then(((e) => {
			const [s, h] = m(e);
			i.postMessage(Object.assign(Object.assign({}, s), { id: c }), h), "RELEASE" === u && (i.removeEventListener("message", r), l(i), n in t && "function" == typeof t[n] && t[n]());
		})).catch(((t) => {
			const [e, s] = m({
				value: /* @__PURE__ */ new TypeError("Unserializable return value"),
				[h]: 0
			});
			i.postMessage(Object.assign(Object.assign({}, e), { id: c }), s);
		}));
	})), i.start && i.start();
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
	return y(t, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then((() => {
		l(t);
	}));
}
const f = /* @__PURE__ */ new WeakMap(), d = "FinalizationRegistry" in globalThis && new FinalizationRegistry(((t) => {
	const e = (f.get(t) || 0) - 1;
	f.set(t, e), 0 === e && u(t);
}));
function p(t, e, n = [], h = function() {}) {
	let r = !1;
	const o = new Proxy(h, {
		get(i, h) {
			if (c(r), h === s) return () => {
				(function(t) {
					d && d.unregister(t);
				})(o), u(t), e.clear(), r = !0;
			};
			if ("then" === h) {
				if (0 === n.length) return { then: () => o };
				const i = y(t, e, {
					type: "GET",
					path: n.map(((t) => t.toString()))
				}).then(w);
				return i.then.bind(i);
			}
			return p(t, e, [...n, h]);
		},
		set(i, s, h) {
			c(r);
			const [o, a] = m(h);
			return y(t, e, {
				type: "SET",
				path: [...n, s].map(((t) => t.toString())),
				value: o
			}, a).then(w);
		},
		apply(s, h, o) {
			c(r);
			const a = n[n.length - 1];
			if (a === i) return y(t, e, { type: "ENDPOINT" }).then(w);
			if ("bind" === a) return p(t, e, n.slice(0, -1));
			const [l, u] = g(o);
			return y(t, e, {
				type: "APPLY",
				path: n.map(((t) => t.toString())),
				argumentList: l
			}, u).then(w);
		},
		construct(i, s) {
			c(r);
			const [h, o] = g(s);
			return y(t, e, {
				type: "CONSTRUCT",
				path: n.map(((t) => t.toString())),
				argumentList: h
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
	return [e.map(((t) => t[0])), (i = e.map(((t) => t[1])), Array.prototype.concat.apply([], i))];
	var i;
}
const v = /* @__PURE__ */ new WeakMap();
function m(t) {
	for (const [e, i] of o) if (i.canHandle(t)) {
		const [s, n] = i.serialize(t);
		return [{
			type: "HANDLER",
			name: e,
			value: s
		}, n];
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
function y(t, e, i, s) {
	return new Promise(((n) => {
		const h = new Array(4).fill(0).map((() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))).join("-");
		e.set(h, n), t.start && t.start(), t.postMessage(Object.assign({ id: h }, i), s);
	}));
}
var S = { hasSubscribers: !1 }, b = S, T = S, _ = "object" == typeof performance && performance && "function" == typeof performance.now ? performance : Date, E = () => b.hasSubscribers || T.hasSubscribers, A = /* @__PURE__ */ new Set(), O = "object" == typeof process && process ? process : {}, F = (t) => !!t && t === Math.floor(t) && t > 0 && isFinite(t), x = (t) => F(t) ? t <= Math.pow(2, 8) ? Uint8Array : t <= Math.pow(2, 16) ? Uint16Array : t <= Math.pow(2, 32) ? Uint32Array : t <= Number.MAX_SAFE_INTEGER ? z : null : null, z = class extends Array {
	constructor(t) {
		super(t), this.fill(0);
	}
}, k = class t {
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
}, C = class t {
	#t;
	#e;
	#i;
	#s;
	#n;
	#h;
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
	#y;
	#S;
	#b;
	#T;
	#_;
	#E;
	#A;
	#O;
	static unsafeExposeInternals(t) {
		return {
			starts: t.#S,
			ttls: t.#b,
			autopurgeTimers: t.#T,
			sizes: t.#y,
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
			backgroundFetch: (e, i, s, n) => t.#x(e, i, s, n),
			moveToTail: (e) => t.#z(e),
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
		return this.#h;
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
		return this.#n;
	}
	constructor(e) {
		let { max: i = 0, ttl: s, ttlResolution: n = 1, ttlAutopurge: h, updateAgeOnGet: r, updateAgeOnHas: o, allowStale: a, dispose: l, onInsert: c, disposeAfter: u, noDisposeOnSet: f, noUpdateTTL: d, maxSize: p = 0, maxEntrySize: g = 0, sizeCalculation: v, fetchMethod: m, memoMethod: w, noDeleteOnFetchRejection: y, noDeleteOnStaleGet: S, allowStaleOnFetchRejection: b, allowStaleOnFetchAbort: T, ignoreFetchAbort: E, perf: z } = e;
		if (void 0 !== z && "function" != typeof z?.now) throw new TypeError("perf option must have a now() method if specified");
		if (this.#o = z ?? _, 0 !== i && !F(i)) throw new TypeError("max option must be a nonnegative integer");
		let C = i ? x(i) : Array;
		if (!C) throw new Error("invalid max value: " + i);
		if (this.#t = i, this.#e = p, this.maxEntrySize = g || this.#e, this.sizeCalculation = v, this.sizeCalculation) {
			if (!this.#e && !this.maxEntrySize) throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
			if ("function" != typeof this.sizeCalculation) throw new TypeError("sizeCalculation set to non-function");
		}
		if (void 0 !== w && "function" != typeof w) throw new TypeError("memoMethod must be a function if defined");
		if (this.#r = w, void 0 !== m && "function" != typeof m) throw new TypeError("fetchMethod must be a function if specified");
		if (this.#h = m, this.#E = !!m, this.#c = /* @__PURE__ */ new Map(), this.#u = Array.from({ length: i }).fill(void 0), this.#f = Array.from({ length: i }).fill(void 0), this.#d = new C(i), this.#p = new C(i), this.#g = 0, this.#v = 0, this.#m = k.create(i), this.#a = 0, this.#l = 0, "function" == typeof l && (this.#i = l), "function" == typeof c && (this.#s = c), "function" == typeof u ? (this.#n = u, this.#w = []) : (this.#n = void 0, this.#w = void 0), this.#_ = !!this.#i, this.#O = !!this.#s, this.#A = !!this.#n, this.noDisposeOnSet = !!f, this.noUpdateTTL = !!d, this.noDeleteOnFetchRejection = !!y, this.allowStaleOnFetchRejection = !!b, this.allowStaleOnFetchAbort = !!T, this.ignoreFetchAbort = !!E, 0 !== this.maxEntrySize) {
			if (0 !== this.#e && !F(this.#e)) throw new TypeError("maxSize must be a positive integer if specified");
			if (!F(this.maxEntrySize)) throw new TypeError("maxEntrySize must be a positive integer if specified");
			this.#j();
		}
		if (this.allowStale = !!a, this.noDeleteOnStaleGet = !!S, this.updateAgeOnGet = !!r, this.updateAgeOnHas = !!o, this.ttlResolution = F(n) || 0 === n ? n : 1, this.ttlAutopurge = !!h, this.ttl = s || 0, this.ttl) {
			if (!F(this.ttl)) throw new TypeError("ttl must be a positive integer if specified");
			this.#D();
		}
		if (0 === this.#t && 0 === this.ttl && 0 === this.#e) throw new TypeError("At least one of max, maxSize, or ttl is required");
		if (!this.ttlAutopurge && !this.#t && !this.#e) {
			let e = "LRU_CACHE_UNBOUNDED";
			((t) => !A.has(t))(e) && (A.add(e), ((t, e, i, s) => {
				"function" == typeof O.emitWarning ? O.emitWarning(t, e, i, s) : console.error(`[${i}] ${e}: ${t}`);
			})("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", e, t));
		}
	}
	getRemainingTTL(t) {
		return this.#c.has(t) ? Infinity : 0;
	}
	#D() {
		let t = new z(this.#t), e = new z(this.#t);
		this.#b = t, this.#S = e;
		let i = this.ttlAutopurge ? Array.from({ length: this.#t }) : void 0;
		this.#T = i, this.#W = (i, n, h = this.#o.now()) => {
			e[i] = 0 !== n ? h : 0, t[i] = n, s(i, n);
		}, this.#M = (i) => {
			e[i] = 0 !== t[i] ? this.#o.now() : 0, s(i, t[i]);
		};
		let s = this.ttlAutopurge ? (t, e) => {
			if (i?.[t] && (clearTimeout(i[t]), i[t] = void 0), e && 0 !== e && i) {
				let s = setTimeout((() => {
					this.#R(t) && this.#L(this.#u[t], "expire");
				}), e + 1);
				s.unref && s.unref(), i[t] = s;
			}
		} : () => {};
		this.#G = (i, s) => {
			if (t[s]) {
				let r = t[s], o = e[s];
				if (!r || !o) return;
				i.ttl = r, i.start = o, i.now = n || h(), i.remainingTTL = r - (i.now - o);
			}
		};
		let n = 0, h = () => {
			let t = this.#o.now();
			if (this.ttlResolution > 0) {
				n = t;
				let e = setTimeout((() => n = 0), this.ttlResolution);
				e.unref && e.unref();
			}
			return t;
		};
		this.getRemainingTTL = (i) => {
			let s = this.#c.get(i);
			if (void 0 === s) return 0;
			let r = t[s], o = e[s];
			return r && o ? r - ((n || h()) - o) : Infinity;
		}, this.#R = (i) => {
			let s = e[i], r = t[i];
			return !!r && !!s && (n || h()) - s > r;
		};
	}
	#M = () => {};
	#G = () => {};
	#W = () => {};
	#R = () => !1;
	#j() {
		let t = new z(this.#t);
		this.#l = 0, this.#y = t, this.#U = (e) => {
			this.#l -= t[e], t[e] = 0;
		}, this.#P = (t, e, i, s) => {
			if (this.#F(e)) return 0;
			if (!F(i)) {
				if (!s) throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
				if ("function" != typeof s) throw new TypeError("sizeCalculation must be a function");
				if (i = s(e, t), !F(i)) throw new TypeError("sizeCalculation return invalid (expect positive integer)");
			}
			return i;
		}, this.#N = (e, i, s) => {
			if (t[e] = i, this.#e) {
				let i = this.#e - t[e];
				for (; this.#l > i;) this.#H(!0);
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
		if (this.#a) for (let e = this.#v; this.#I(e) && ((t || !this.#R(e)) && (yield e), e !== this.#g);) e = this.#p[e];
	}
	*#C({ allowStale: t = this.allowStale } = {}) {
		if (this.#a) for (let e = this.#g; this.#I(e) && ((t || !this.#R(e)) && (yield e), e !== this.#v);) e = this.#d[e];
	}
	#I(t) {
		return void 0 !== t && this.#c.get(this.#u[t]) === t;
	}
	*entries() {
		for (let t of this.#k()) void 0 !== this.#f[t] && void 0 !== this.#u[t] && !this.#F(this.#f[t]) && (yield [this.#u[t], this.#f[t]]);
	}
	*rentries() {
		for (let t of this.#C()) void 0 !== this.#f[t] && void 0 !== this.#u[t] && !this.#F(this.#f[t]) && (yield [this.#u[t], this.#f[t]]);
	}
	*keys() {
		for (let t of this.#k()) {
			let e = this.#u[t];
			void 0 !== e && !this.#F(this.#f[t]) && (yield e);
		}
	}
	*rkeys() {
		for (let t of this.#C()) {
			let e = this.#u[t];
			void 0 !== e && !this.#F(this.#f[t]) && (yield e);
		}
	}
	*values() {
		for (let t of this.#k()) void 0 !== this.#f[t] && !this.#F(this.#f[t]) && (yield this.#f[t]);
	}
	*rvalues() {
		for (let t of this.#C()) void 0 !== this.#f[t] && !this.#F(this.#f[t]) && (yield this.#f[t]);
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	[Symbol.toStringTag] = "LRUCache";
	find(t, e = {}) {
		for (let i of this.#k()) {
			let s = this.#f[i], n = this.#F(s) ? s.__staleWhileFetching : s;
			if (void 0 !== n && t(n, this.#u[i], this)) return this.#$(this.#u[i], e);
		}
	}
	forEach(t, e = this) {
		for (let i of this.#k()) {
			let s = this.#f[i], n = this.#F(s) ? s.__staleWhileFetching : s;
			void 0 !== n && t.call(e, n, this.#u[i], this);
		}
	}
	rforEach(t, e = this) {
		for (let i of this.#C()) {
			let s = this.#f[i], n = this.#F(s) ? s.__staleWhileFetching : s;
			void 0 !== n && t.call(e, n, this.#u[i], this);
		}
	}
	purgeStale() {
		let t = !1;
		for (let e of this.#C({ allowStale: !0 })) this.#R(e) && (this.#L(this.#u[e], "expire"), t = !0);
		return t;
	}
	info(t) {
		let e = this.#c.get(t);
		if (void 0 === e) return;
		let i = this.#f[e], s = this.#F(i) ? i.__staleWhileFetching : i;
		if (void 0 === s) return;
		let n = { value: s };
		if (this.#b && this.#S) {
			let t = this.#b[e], i = this.#S[e];
			t && i && (n.ttl = t - (this.#o.now() - i), n.start = Date.now());
		}
		return this.#y && (n.size = this.#y[e]), n;
	}
	dump() {
		let t = [];
		for (let e of this.#k({ allowStale: !0 })) {
			let i = this.#u[e], s = this.#f[e], n = this.#F(s) ? s.__staleWhileFetching : s;
			if (void 0 === n || void 0 === i) continue;
			let h = { value: n };
			if (this.#b && this.#S) {
				h.ttl = this.#b[e];
				let t = this.#o.now() - this.#S[e];
				h.start = Math.floor(Date.now() - t);
			}
			this.#y && (h.size = this.#y[e]), t.unshift([i, h]);
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
		let { status: s = b.hasSubscribers ? {} : void 0 } = i;
		i.status = s, s && (s.op = "set", s.key = t, void 0 !== e && (s.value = e));
		let n = this.#B(t, e, i);
		return s && b.hasSubscribers && b.publish(s), n;
	}
	#B(t, e, i = {}) {
		let { ttl: s = this.ttl, start: n, noDisposeOnSet: h = this.noDisposeOnSet, sizeCalculation: r = this.sizeCalculation, status: o } = i;
		if (void 0 === e) return o && (o.set = "deleted"), this.delete(t), this;
		let { noUpdateTTL: a = this.noUpdateTTL } = i;
		o && !this.#F(e) && (o.value = e);
		let l = this.#P(t, e, i.size || 0, r, o);
		if (this.maxEntrySize && l > this.maxEntrySize) return this.#L(t, "set"), o && (o.set = "miss", o.maxEntrySizeExceeded = !0), this;
		let c = 0 === this.#a ? void 0 : this.#c.get(t);
		if (void 0 === c) c = 0 === this.#a ? this.#v : 0 !== this.#m.length ? this.#m.pop() : this.#a === this.#t ? this.#H(!1) : this.#a, this.#u[c] = t, this.#f[c] = e, this.#c.set(t, c), this.#d[this.#v] = c, this.#p[c] = this.#v, this.#v = c, this.#a++, this.#N(c, l, o), o && (o.set = "add"), a = !1, this.#O && this.#s?.(e, t, "add");
		else {
			this.#z(c);
			let i = this.#f[c];
			if (e !== i) {
				if (this.#E && this.#F(i)) {
					i.__abortController.abort(/* @__PURE__ */ new Error("replaced"));
					let { __staleWhileFetching: e } = i;
					void 0 !== e && !h && (this.#_ && this.#i?.(e, t, "set"), this.#A && this.#w?.push([
						e,
						t,
						"set"
					]));
				} else h || (this.#_ && this.#i?.(i, t, "set"), this.#A && this.#w?.push([
					i,
					t,
					"set"
				]));
				if (this.#U(c), this.#N(c, l, o), this.#f[c] = e, o) {
					o.set = "replace";
					let t = i && this.#F(i) ? i.__staleWhileFetching : i;
					void 0 !== t && (o.oldValue = t);
				}
			} else o && (o.set = "update");
			this.#O && this.onInsert?.(e, t, e === i ? "update" : "replace");
		}
		if (0 !== s && !this.#b && this.#D(), this.#b && (a || this.#W(c, s, n), o && this.#G(o, c)), !h && this.#A && this.#w) {
			let t, e = this.#w;
			for (; t = e?.shift();) this.#n?.(...t);
		}
		return this;
	}
	pop() {
		try {
			for (; this.#a;) {
				let t = this.#f[this.#g];
				if (this.#H(!0), this.#F(t)) {
					if (t.__staleWhileFetching) return t.__staleWhileFetching;
				} else if (void 0 !== t) return t;
			}
		} finally {
			if (this.#A && this.#w) {
				let t, e = this.#w;
				for (; t = e?.shift();) this.#n?.(...t);
			}
		}
	}
	#H(t) {
		let e = this.#g, i = this.#u[e], s = this.#f[e];
		return this.#E && this.#F(s) ? s.__abortController.abort(/* @__PURE__ */ new Error("evicted")) : (this.#_ || this.#A) && (this.#_ && this.#i?.(s, i, "evict"), this.#A && this.#w?.push([
			s,
			i,
			"evict"
		])), this.#U(e), this.#T?.[e] && (clearTimeout(this.#T[e]), this.#T[e] = void 0), t && (this.#u[e] = void 0, this.#f[e] = void 0, this.#m.push(e)), 1 === this.#a ? (this.#g = this.#v = 0, this.#m.length = 0) : this.#g = this.#d[e], this.#c.delete(i), this.#a--, e;
	}
	has(t, e = {}) {
		let { status: i = b.hasSubscribers ? {} : void 0 } = e;
		e.status = i, i && (i.op = "has", i.key = t);
		let s = this.#X(t, e);
		return b.hasSubscribers && b.publish(i), s;
	}
	#X(t, e = {}) {
		let { updateAgeOnHas: i = this.updateAgeOnHas, status: s } = e, n = this.#c.get(t);
		if (void 0 !== n) {
			let t = this.#f[n];
			if (this.#F(t) && void 0 === t.__staleWhileFetching) return !1;
			if (!this.#R(n)) return i && this.#M(n), s && (s.has = "hit", this.#G(s, n)), !0;
			s && (s.has = "stale", this.#G(s, n));
		} else s && (s.has = "miss");
		return !1;
	}
	peek(t, e = {}) {
		let { status: i = E() ? {} : void 0 } = e;
		i && (i.op = "peek", i.key = t), e.status = i;
		let s = this.#Y(t, e);
		return b.hasSubscribers && b.publish(i), s;
	}
	#Y(t, e) {
		let { status: i, allowStale: s = this.allowStale } = e, n = this.#c.get(t);
		if (void 0 === n || !s && this.#R(n)) return void (i && (i.peek = void 0 === n ? "miss" : "stale"));
		let h = this.#f[n], r = this.#F(h) ? h.__staleWhileFetching : h;
		return i && (void 0 !== r ? (i.peek = "hit", i.value = r) : i.peek = "miss"), r;
	}
	#x(t, e, i, s) {
		let n = void 0 === e ? void 0 : this.#f[e];
		if (this.#F(n)) return n;
		let h = new AbortController(), { signal: r } = i;
		r?.addEventListener("abort", (() => h.abort(r.reason)), { signal: h.signal });
		let o = {
			signal: h.signal,
			options: i,
			context: s
		}, a = (s, n = !1) => {
			let { aborted: r } = h.signal, a = i.ignoreFetchAbort && void 0 !== s, u = i.ignoreFetchAbort || !(!i.allowStaleOnFetchAbort || void 0 === s);
			if (i.status && (r && !n ? (i.status.fetchAborted = !0, i.status.fetchError = h.signal.reason, a && (i.status.fetchAbortIgnored = !0)) : i.status.fetchResolved = !0), r && !a && !n) return l(h.signal.reason, u);
			let f = c, d = this.#f[e];
			return (d === c || void 0 === d && a && n) && (void 0 === s ? void 0 !== f.__staleWhileFetching ? this.#f[e] = f.__staleWhileFetching : this.#L(t, "fetch") : (i.status && (i.status.fetchUpdated = !0), this.#B(t, s, o.options))), s;
		}, l = (s, n) => {
			let { aborted: r } = h.signal, o = r && i.allowStaleOnFetchAbort, a = o || i.allowStaleOnFetchRejection, l = a || i.noDeleteOnFetchRejection, u = c;
			if (this.#f[e] === c && (!l || !n && void 0 === u.__staleWhileFetching ? this.#L(t, "fetch") : o || (this.#f[e] = u.__staleWhileFetching)), a) return i.status && void 0 !== u.__staleWhileFetching && (i.status.returnedStale = !0), u.__staleWhileFetching;
			if (u.__returned === u) throw s;
		};
		i.status && (i.status.fetchDispatched = !0);
		let c = new Promise(((e, s) => {
			let r = this.#h?.(t, n, o);
			r && r instanceof Promise && r.then(((t) => e(void 0 === t ? void 0 : t)), s), h.signal.addEventListener("abort", (() => {
				(!i.ignoreFetchAbort || i.allowStaleOnFetchAbort) && (e(void 0), i.allowStaleOnFetchAbort && (e = (t) => a(t, !0)));
			}));
		})).then(a, ((t) => (i.status && (i.status.fetchRejected = !0, i.status.fetchError = t), l(t, !1)))), u = Object.assign(c, {
			__abortController: h,
			__staleWhileFetching: n,
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
		let i = T.hasSubscribers, { status: s = E() ? {} : void 0 } = e;
		e.status = s, s && e.context && (s.context = e.context);
		let n = this.#q(t, e);
		return s && i && (s.trace = !0, T.tracePromise((() => n), s).catch((() => {}))), n;
	}
	async #q(t, e = {}) {
		let { allowStale: i = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: n = this.noDeleteOnStaleGet, ttl: h = this.ttl, noDisposeOnSet: r = this.noDisposeOnSet, size: o = 0, sizeCalculation: a = this.sizeCalculation, noUpdateTTL: l = this.noUpdateTTL, noDeleteOnFetchRejection: c = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection: u = this.allowStaleOnFetchRejection, ignoreFetchAbort: f = this.ignoreFetchAbort, allowStaleOnFetchAbort: d = this.allowStaleOnFetchAbort, context: p, forceRefresh: g = !1, status: v, signal: m } = e;
		if (v && (v.op = "fetch", v.key = t, g && (v.forceRefresh = !0)), !this.#E) return v && (v.fetch = "get"), this.#$(t, {
			allowStale: i,
			updateAgeOnGet: s,
			noDeleteOnStaleGet: n,
			status: v
		});
		let w = {
			allowStale: i,
			updateAgeOnGet: s,
			noDeleteOnStaleGet: n,
			ttl: h,
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
		}, y = this.#c.get(t);
		if (void 0 === y) {
			v && (v.fetch = "miss");
			let e = this.#x(t, y, w, p);
			return e.__returned = e;
		}
		{
			let e = this.#f[y];
			if (this.#F(e)) {
				let t = i && void 0 !== e.__staleWhileFetching;
				return v && (v.fetch = "inflight", t && (v.returnedStale = !0)), t ? e.__staleWhileFetching : e.__returned = e;
			}
			let n = this.#R(y);
			if (!g && !n) return v && (v.fetch = "hit"), this.#z(y), s && this.#M(y), v && this.#G(v, y), e;
			let h = this.#x(t, y, w, p), r = void 0 !== h.__staleWhileFetching && i;
			return v && (v.fetch = n ? "stale" : "refresh", r && n && (v.returnedStale = !0)), r ? h.__staleWhileFetching : h.__returned = h;
		}
	}
	forceFetch(t, e = {}) {
		let i = T.hasSubscribers, { status: s = E() ? {} : void 0 } = e;
		e.status = s, s && e.context && (s.context = e.context);
		let n = this.#K(t, e);
		return s && i && (s.trace = !0, T.tracePromise((() => n), s).catch((() => {}))), n;
	}
	async #K(t, e = {}) {
		let i = await this.#q(t, e);
		if (void 0 === i) throw new Error("fetch() returned undefined");
		return i;
	}
	memo(t, e = {}) {
		let { status: i = b.hasSubscribers ? {} : void 0 } = e;
		e.status = i, i && (i.op = "memo", i.key = t, e.context && (i.context = e.context));
		let s = this.#Q(t, e);
		return i && (i.value = s), b.hasSubscribers && b.publish(i), s;
	}
	#Q(t, e = {}) {
		let i = this.#r;
		if (!i) throw new Error("no memoMethod provided to constructor");
		let { context: s, status: n, forceRefresh: h, ...r } = e;
		n && h && (n.forceRefresh = !0);
		let o = this.#$(t, r), a = h || void 0 === o;
		if (n && (n.memo = a ? "miss" : "hit", a || (n.value = o)), !a) return o;
		let l = i(t, o, {
			options: r,
			context: s
		});
		return n && (n.value = l), this.#B(t, l, r), l;
	}
	get(t, e = {}) {
		let { status: i = b.hasSubscribers ? {} : void 0 } = e;
		e.status = i, i && (i.op = "get", i.key = t);
		let s = this.#$(t, e);
		return i && (void 0 !== s && (i.value = s), b.hasSubscribers && b.publish(i)), s;
	}
	#$(t, e = {}) {
		let { allowStale: i = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: n = this.noDeleteOnStaleGet, status: h } = e, r = this.#c.get(t);
		if (void 0 === r) return void (h && (h.get = "miss"));
		let o = this.#f[r], a = this.#F(o);
		return h && this.#G(h, r), this.#R(r) ? a ? (h && (h.get = "stale-fetching"), i && void 0 !== o.__staleWhileFetching ? (h && (h.returnedStale = !0), o.__staleWhileFetching) : void 0) : (n || this.#L(t, "expire"), h && (h.get = "stale"), i ? (h && (h.returnedStale = !0), o) : void 0) : (h && (h.get = a ? "fetching" : "hit"), this.#z(r), s && this.#M(r), a ? o.__staleWhileFetching : o);
	}
	#V(t, e) {
		this.#p[e] = t, this.#d[t] = e;
	}
	#z(t) {
		t !== this.#v && (t === this.#g ? this.#g = this.#d[t] : this.#V(this.#p[t], this.#d[t]), this.#V(this.#v, t), this.#v = t);
	}
	delete(t) {
		return this.#L(t, "delete");
	}
	#L(t, e) {
		b.hasSubscribers && b.publish({
			op: "delete",
			delete: e,
			key: t
		});
		let i = !1;
		if (0 !== this.#a) {
			let s = this.#c.get(t);
			if (void 0 !== s) if (this.#T?.[s] && (clearTimeout(this.#T?.[s]), this.#T[s] = void 0), i = !0, 1 === this.#a) this.#J(e);
			else {
				this.#U(s);
				let i = this.#f[s];
				if (this.#F(i) ? i.__abortController.abort(/* @__PURE__ */ new Error("deleted")) : (this.#_ || this.#A) && (this.#_ && this.#i?.(i, t, e), this.#A && this.#w?.push([
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
		if (this.#A && this.#w?.length) {
			let t, e = this.#w;
			for (; t = e?.shift();) this.#n?.(...t);
		}
		return i;
	}
	clear() {
		return this.#J("delete");
	}
	#J(t) {
		for (let e of this.#C({ allowStale: !0 })) {
			let i = this.#f[e];
			if (this.#F(i)) i.__abortController.abort(/* @__PURE__ */ new Error("deleted"));
			else {
				let s = this.#u[e];
				this.#_ && this.#i?.(i, s, t), this.#A && this.#w?.push([
					i,
					s,
					t
				]);
			}
		}
		if (this.#c.clear(), this.#f.fill(void 0), this.#u.fill(void 0), this.#b && this.#S) {
			this.#b.fill(0), this.#S.fill(0);
			for (let t of this.#T ?? []) void 0 !== t && clearTimeout(t);
			this.#T?.fill(void 0);
		}
		if (this.#y && this.#y.fill(0), this.#g = 0, this.#v = 0, this.#m.length = 0, this.#l = 0, this.#a = 0, this.#A && this.#w) {
			let t, e = this.#w;
			for (; t = e?.shift();) this.#n?.(...t);
		}
	}
}, R = class {
	static defaultOptions = {
		max: 1e3,
		ttl: 18e5
	};
	static cache = new C(this.defaultOptions);
	static createCache(t = this.defaultOptions) {
		return new C(t);
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
	for (var n in e) t(s, n, {
		get: e[n],
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
	maxSize: () => H,
	peek: () => I,
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
	const n = R.createCache(s);
	return D.set(t, n), n;
}
async function M(t = "") {
	let e;
	return e = D.has(t) ? D.get(t) : await W(t), e;
}
async function L(t, e, i = "") {
	const s = await M(i);
	return !!s && (R.set(t, e, s), !0);
}
async function G(t, e = "") {
	const i = await M(e);
	if (i) {
		const e = R.get(t, i);
		return console.log("666000", t, e), e;
	}
}
async function U(t, e = "") {
	const i = await M(e);
	if (i) return R.remove(t, i);
}
async function P(t, e = "") {
	const i = await M(e);
	return !!i && R.has(t, i);
}
async function N(t = "") {
	const e = await M(t);
	return e ? R.count(e) : 0;
}
async function H(t = "") {
	const e = await M(t);
	return e ? R.maxSize(e) : 0;
}
async function I(t, e = "") {
	const i = await M(e);
	return !!i && R.peek(t, i);
}
async function $(t = "") {
	const e = await M(t);
	return e && R.clear(e), !1;
}
async function B(t = "") {
	const e = await M(t);
	if (e) return R.keys(e);
}
a(j);
