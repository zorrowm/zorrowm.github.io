var e = Object.create, t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, o = Object.getPrototypeOf, i = Object.prototype.hasOwnProperty, s = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), a = (s, a, u) => (u = null != s ? e(o(s)) : {}, ((e, o, s, a) => {
	if (o && "object" == typeof o || "function" == typeof o) for (var u, c = n(o), l = 0, f = c.length; l < f; l++) u = c[l], i.call(e, u) || void 0 === u || t(e, u, {
		get: ((e) => o[e]).bind(null, u),
		enumerable: !(a = r(o, u)) || a.enumerable
	});
	return e;
})(!a && s && s.__esModule ? u : t(u, "default", {
	value: s,
	enumerable: !0
}), s)), u = ((e) => "undefined" != typeof require ? require : "undefined" != typeof Proxy ? new Proxy(e, { get: (e, t) => ("undefined" != typeof require ? require : e)[t] }) : e)(function(e) {
	if ("undefined" != typeof require) return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/ const c = Symbol("Comlink.proxy"), l = Symbol("Comlink.endpoint"), f = Symbol("Comlink.releaseProxy"), h = Symbol("Comlink.finalizer"), p = Symbol("Comlink.thrown"), d = (e) => "object" == typeof e && null !== e || "function" == typeof e, m = /* @__PURE__ */ new Map([["proxy", {
	canHandle: (e) => d(e) && e[c],
	serialize(e) {
		const { port1: t, port2: r } = new MessageChannel();
		return y(e, t), [r, [r]];
	},
	deserialize: (e) => (e.start(), function(e) {
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
		}), x(e, t, [], void 0);
	}(e))
}], ["throw", {
	canHandle: (e) => d(e) && p in e,
	serialize({ value: e }) {
		let t;
		return t = e instanceof Error ? {
			isError: !0,
			value: {
				message: e.message,
				name: e.name,
				stack: e.stack
			}
		} : {
			isError: !1,
			value: e
		}, [t, []];
	},
	deserialize(e) {
		if (e.isError) throw Object.assign(new Error(e.value.message), e.value);
		throw e.value;
	}
}]]);
function y(e, t = globalThis, r = ["*"]) {
	t.addEventListener("message", function n(o) {
		if (!o || !o.data) return;
		if (!function(e, t) {
			for (const r of e) {
				if (t === r || "*" === r) return !0;
				if (r instanceof RegExp && r.test(t)) return !0;
			}
			return !1;
		}(r, o.origin)) return void console.warn(`Invalid origin '${o.origin}' for comlink proxy`);
		const { id: i, type: s, path: a } = Object.assign({ path: [] }, o.data), u = (o.data.argumentList || []).map(C);
		let l;
		try {
			const t = a.slice(0, -1).reduce((e, t) => e[t], e), r = a.reduce((e, t) => e[t], e);
			switch (s) {
				case "GET":
					l = r;
					break;
				case "SET":
					t[a.slice(-1)[0]] = C(o.data.value), l = !0;
					break;
				case "APPLY":
					l = r.apply(t, u);
					break;
				case "CONSTRUCT":
					l = function(e) {
						return Object.assign(e, { [c]: !0 });
					}(new r(...u));
					break;
				case "ENDPOINT":
					{
						const { port1: t, port2: r } = new MessageChannel();
						y(e, r), l = function(e, t) {
							return S.set(e, t), e;
						}(t, [t]);
					}
					break;
				case "RELEASE":
					l = void 0;
					break;
				default: return;
			}
		} catch (e) {
			l = {
				value: e,
				[p]: 0
			};
		}
		Promise.resolve(l).catch((e) => ({
			value: e,
			[p]: 0
		})).then((r) => {
			const [o, a] = v(r);
			t.postMessage(Object.assign(Object.assign({}, o), { id: i }), a), "RELEASE" === s && (t.removeEventListener("message", n), g(t), h in e && "function" == typeof e[h] && e[h]());
		}).catch((e) => {
			const [r, n] = v({
				value: /* @__PURE__ */ new TypeError("Unserializable return value"),
				[p]: 0
			});
			t.postMessage(Object.assign(Object.assign({}, r), { id: i }), n);
		});
	}), t.start && t.start();
}
function g(e) {
	(function(e) {
		return "MessagePort" === e.constructor.name;
	})(e) && e.close();
}
function b(e) {
	if (e) throw new Error("Proxy has been released and is not useable");
}
function w(e) {
	return j(e, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then(() => {
		g(e);
	});
}
const O = /* @__PURE__ */ new WeakMap(), E = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
	const t = (O.get(e) || 0) - 1;
	O.set(e, t), 0 === t && w(e);
});
function x(e, t, r = [], n = function() {}) {
	let o = !1;
	const i = new Proxy(n, {
		get(n, s) {
			if (b(o), s === f) return () => {
				(function(e) {
					E && E.unregister(e);
				})(i), w(e), t.clear(), o = !0;
			};
			if ("then" === s) {
				if (0 === r.length) return { then: () => i };
				const n = j(e, t, {
					type: "GET",
					path: r.map((e) => e.toString())
				}).then(C);
				return n.then.bind(n);
			}
			return x(e, t, [...r, s]);
		},
		set(n, i, s) {
			b(o);
			const [a, u] = v(s);
			return j(e, t, {
				type: "SET",
				path: [...r, i].map((e) => e.toString()),
				value: a
			}, u).then(C);
		},
		apply(n, i, s) {
			b(o);
			const a = r[r.length - 1];
			if (a === l) return j(e, t, { type: "ENDPOINT" }).then(C);
			if ("bind" === a) return x(e, t, r.slice(0, -1));
			const [u, c] = _(s);
			return j(e, t, {
				type: "APPLY",
				path: r.map((e) => e.toString()),
				argumentList: u
			}, c).then(C);
		},
		construct(n, i) {
			b(o);
			const [s, a] = _(i);
			return j(e, t, {
				type: "CONSTRUCT",
				path: r.map((e) => e.toString()),
				argumentList: s
			}, a).then(C);
		}
	});
	return function(e, t) {
		const r = (O.get(t) || 0) + 1;
		O.set(t, r), E && E.register(e, t, e);
	}(i, e), i;
}
function _(e) {
	const t = e.map(v);
	return [t.map((e) => e[0]), (r = t.map((e) => e[1]), Array.prototype.concat.apply([], r))];
	var r;
}
const S = /* @__PURE__ */ new WeakMap();
function v(e) {
	for (const [t, r] of m) if (r.canHandle(e)) {
		const [n, o] = r.serialize(e);
		return [{
			type: "HANDLER",
			name: t,
			value: n
		}, o];
	}
	return [{
		type: "RAW",
		value: e
	}, S.get(e) || []];
}
function C(e) {
	switch (e.type) {
		case "HANDLER": return m.get(e.name).deserialize(e.value);
		case "RAW": return e.value;
	}
}
function j(e, t, r, n) {
	return new Promise((o) => {
		const i = new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
		t.set(i, o), e.start && e.start(), e.postMessage(Object.assign({ id: i }, r), n);
	});
}
const A = {};
function T(e) {
	return null != e;
}
function R(e) {
	let t;
	this.name = "DeveloperError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
A.EMPTY_OBJECT = Object.freeze({}), A.EMPTY_ARRAY = Object.freeze([]), T(Object.create) && (R.prototype = Object.create(Error.prototype), R.prototype.constructor = R), R.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return T(this.stack) && (e += `\n${this.stack.toString()}`), e;
}, R.throwInstantiationError = function() {
	throw new R("This function defines an interface and should not be called directly.");
};
const z = {};
function I(e, t, r) {
	return `Expected ${r} to be typeof ${t}, actual typeof was ${e}`;
}
function M() {
	this._listeners = /* @__PURE__ */ new Map(), this._toRemove = /* @__PURE__ */ new Map(), this._toAdd = /* @__PURE__ */ new Map(), this._invokingListeners = !1, this._listenerCount = 0;
}
function q(e, t, r, n) {
	t.has(r) || t.set(r, /* @__PURE__ */ new Set());
	const o = t.get(r);
	return !o.has(n) && (o.add(n), !0);
}
function P(e, t, r, n) {
	const o = t.get(r);
	if (!o || !o.has(n)) return !1;
	if (e._invokingListeners) {
		if (!q(0, e._toRemove, r, n)) return !1;
	} else o.delete(n), 0 === o.size && t.delete(r);
	return !0;
}
z.typeOf = {}, z.defined = function(e, t) {
	if (!T(t)) throw new R(function(e) {
		return `${e} is required, actual value was undefined`;
	}(e));
}, z.typeOf.func = function(e, t) {
	if ("function" != typeof t) throw new R(I(typeof t, "function", e));
}, z.typeOf.string = function(e, t) {
	if ("string" != typeof t) throw new R(I(typeof t, "string", e));
}, z.typeOf.number = function(e, t) {
	if ("number" != typeof t) throw new R(I(typeof t, "number", e));
}, z.typeOf.number.lessThan = function(e, t, r) {
	if (z.typeOf.number(e, t), t >= r) throw new R(`Expected ${e} to be less than ${r}, actual value was ${t}`);
}, z.typeOf.number.lessThanOrEquals = function(e, t, r) {
	if (z.typeOf.number(e, t), t > r) throw new R(`Expected ${e} to be less than or equal to ${r}, actual value was ${t}`);
}, z.typeOf.number.greaterThan = function(e, t, r) {
	if (z.typeOf.number(e, t), t <= r) throw new R(`Expected ${e} to be greater than ${r}, actual value was ${t}`);
}, z.typeOf.number.greaterThanOrEquals = function(e, t, r) {
	if (z.typeOf.number(e, t), t < r) throw new R(`Expected ${e} to be greater than or equal to ${r}, actual value was ${t}`);
}, z.typeOf.object = function(e, t) {
	if ("object" != typeof t) throw new R(I(typeof t, "object", e));
}, z.typeOf.bool = function(e, t) {
	if ("boolean" != typeof t) throw new R(I(typeof t, "boolean", e));
}, z.typeOf.bigint = function(e, t) {
	if ("bigint" != typeof t) throw new R(I(typeof t, "bigint", e));
}, z.typeOf.number.equals = function(e, t, r, n) {
	if (z.typeOf.number(e, r), z.typeOf.number(t, n), r !== n) throw new R(`${e} must be equal to ${t}, the actual values are ${r} and ${n}`);
}, Object.defineProperties(M.prototype, { numberOfListeners: { get: function() {
	return this._listenerCount;
} } }), M.prototype.addEventListener = function(e, t) {
	z.typeOf.func("listener", e);
	const r = this;
	return q(0, r._invokingListeners ? r._toAdd : r._listeners, e, t) && r._listenerCount++, function() {
		r.removeEventListener(e, t);
	};
}, M.prototype.removeEventListener = function(e, t) {
	z.typeOf.func("listener", e);
	const r = P(this, this._listeners, e, t), n = P(this, this._toAdd, e, t), o = r || n;
	return o && this._listenerCount--, o;
}, M.prototype.raiseEvent = function() {
	this._invokingListeners = !0;
	for (const [e, t] of this._listeners.entries()) if (T(e)) for (const r of t) e.apply(r, arguments);
	this._invokingListeners = !1;
	for (const [e, t] of this._toAdd.entries()) for (const r of t) q(0, this._listeners, e, r);
	this._toAdd.clear();
	for (const [e, t] of this._toRemove.entries()) for (const r of t) P(this, this._listeners, e, r);
	this._toRemove.clear();
};
var N = a(s((e, t) => {
	var r = function(e) {
		null == e && (e = (/* @__PURE__ */ new Date()).getTime()), this.N = 624, this.M = 397, this.MATRIX_A = 2567483615, this.UPPER_MASK = 2147483648, this.LOWER_MASK = 2147483647, this.mt = new Array(this.N), this.mti = this.N + 1, e.constructor == Array ? this.init_by_array(e, e.length) : this.init_seed(e);
	};
	r.prototype.init_seed = function(e) {
		for (this.mt[0] = e >>> 0, this.mti = 1; this.mti < this.N; this.mti++) e = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30, this.mt[this.mti] = (1812433253 * ((4294901760 & e) >>> 16) << 16) + 1812433253 * (65535 & e) + this.mti, this.mt[this.mti] >>>= 0;
	}, r.prototype.init_by_array = function(e, t) {
		var r, n, o;
		for (this.init_seed(19650218), r = 1, n = 0, o = this.N > t ? this.N : t; o; o--) {
			var i = this.mt[r - 1] ^ this.mt[r - 1] >>> 30;
			this.mt[r] = (this.mt[r] ^ (1664525 * ((4294901760 & i) >>> 16) << 16) + 1664525 * (65535 & i)) + e[n] + n, this.mt[r] >>>= 0, n++, ++r >= this.N && (this.mt[0] = this.mt[this.N - 1], r = 1), n >= t && (n = 0);
		}
		for (o = this.N - 1; o; o--) i = this.mt[r - 1] ^ this.mt[r - 1] >>> 30, this.mt[r] = (this.mt[r] ^ (1566083941 * ((4294901760 & i) >>> 16) << 16) + 1566083941 * (65535 & i)) - r, this.mt[r] >>>= 0, ++r >= this.N && (this.mt[0] = this.mt[this.N - 1], r = 1);
		this.mt[0] = 2147483648;
	}, r.prototype.random_int = function() {
		var e, t = new Array(0, this.MATRIX_A);
		if (this.mti >= this.N) {
			var r;
			for (this.mti == this.N + 1 && this.init_seed(5489), r = 0; r < this.N - this.M; r++) e = this.mt[r] & this.UPPER_MASK | this.mt[r + 1] & this.LOWER_MASK, this.mt[r] = this.mt[r + this.M] ^ e >>> 1 ^ t[1 & e];
			for (; r < this.N - 1; r++) e = this.mt[r] & this.UPPER_MASK | this.mt[r + 1] & this.LOWER_MASK, this.mt[r] = this.mt[r + (this.M - this.N)] ^ e >>> 1 ^ t[1 & e];
			e = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK, this.mt[this.N - 1] = this.mt[this.M - 1] ^ e >>> 1 ^ t[1 & e], this.mti = 0;
		}
		return e = this.mt[this.mti++], e ^= e >>> 11, e ^= e << 7 & 2636928640, e ^= e << 15 & 4022730752, (e ^= e >>> 18) >>> 0;
	}, r.prototype.random_int31 = function() {
		return this.random_int() >>> 1;
	}, r.prototype.random_incl = function() {
		return this.random_int() * (1 / 4294967295);
	}, r.prototype.random = function() {
		return this.random_int() * (1 / 4294967296);
	}, r.prototype.random_excl = function() {
		return (this.random_int() + .5) * (1 / 4294967296);
	}, r.prototype.random_long = function() {
		return (67108864 * (this.random_int() >>> 5) + (this.random_int() >>> 6)) * (1 / 9007199254740992);
	}, t.exports = r;
})(), 1);
const D = {
	EPSILON1: .1,
	EPSILON2: .01,
	EPSILON3: .001,
	EPSILON4: 1e-4,
	EPSILON5: 1e-5,
	EPSILON6: 1e-6,
	EPSILON7: 1e-7,
	EPSILON8: 1e-8,
	EPSILON9: 1e-9,
	EPSILON10: 1e-10,
	EPSILON11: 1e-11,
	EPSILON12: 1e-12,
	EPSILON13: 1e-13,
	EPSILON14: 1e-14,
	EPSILON15: 1e-15,
	EPSILON16: 1e-16,
	EPSILON17: 1e-17,
	EPSILON18: 1e-18,
	EPSILON19: 1e-19,
	EPSILON20: 1e-20,
	EPSILON21: 1e-21,
	GRAVITATIONALPARAMETER: 3986004418e5,
	SOLAR_RADIUS: 6955e5,
	LUNAR_RADIUS: 1737400,
	SIXTY_FOUR_KILOBYTES: 65536,
	FOUR_GIGABYTES: 4294967296
};
D.sign = Math.sign ?? function(e) {
	return 0 === (e = +e) || e != e ? e : e > 0 ? 1 : -1;
}, D.signNotZero = function(e) {
	return e < 0 ? -1 : 1;
}, D.toSNorm = function(e, t) {
	return t = t ?? 255, Math.round((.5 * D.clamp(e, -1, 1) + .5) * t);
}, D.fromSNorm = function(e, t) {
	return t = t ?? 255, D.clamp(e, 0, t) / t * 2 - 1;
}, D.normalize = function(e, t, r) {
	return 0 === (r = Math.max(r - t, 0)) ? 0 : D.clamp((e - t) / r, 0, 1);
}, D.sinh = Math.sinh ?? function(e) {
	return (Math.exp(e) - Math.exp(-e)) / 2;
}, D.cosh = Math.cosh ?? function(e) {
	return (Math.exp(e) + Math.exp(-e)) / 2;
}, D.lerp = function(e, t, r) {
	return (1 - r) * e + r * t;
}, D.PI = Math.PI, D.ONE_OVER_PI = 1 / Math.PI, D.PI_OVER_TWO = Math.PI / 2, D.PI_OVER_THREE = Math.PI / 3, D.PI_OVER_FOUR = Math.PI / 4, D.PI_OVER_SIX = Math.PI / 6, D.THREE_PI_OVER_TWO = 3 * Math.PI / 2, D.TWO_PI = 2 * Math.PI, D.ONE_OVER_TWO_PI = 1 / (2 * Math.PI), D.RADIANS_PER_DEGREE = Math.PI / 180, D.DEGREES_PER_RADIAN = 180 / Math.PI, D.RADIANS_PER_ARCSECOND = D.RADIANS_PER_DEGREE / 3600, D.toRadians = function(e) {
	if (!T(e)) throw new R("degrees is required.");
	return e * D.RADIANS_PER_DEGREE;
}, D.toDegrees = function(e) {
	if (!T(e)) throw new R("radians is required.");
	return e * D.DEGREES_PER_RADIAN;
}, D.convertLongitudeRange = function(e) {
	if (!T(e)) throw new R("angle is required.");
	const t = D.TWO_PI, r = e - Math.floor(e / t) * t;
	return r < -Math.PI ? r + t : r >= Math.PI ? r - t : r;
}, D.clampToLatitudeRange = function(e) {
	if (!T(e)) throw new R("angle is required.");
	return D.clamp(e, -1 * D.PI_OVER_TWO, D.PI_OVER_TWO);
}, D.negativePiToPi = function(e) {
	if (!T(e)) throw new R("angle is required.");
	return e >= -D.PI && e <= D.PI ? e : D.zeroToTwoPi(e + D.PI) - D.PI;
}, D.zeroToTwoPi = function(e) {
	if (!T(e)) throw new R("angle is required.");
	if (e >= 0 && e <= D.TWO_PI) return e;
	const t = D.mod(e, D.TWO_PI);
	return Math.abs(t) < D.EPSILON14 && Math.abs(e) > D.EPSILON14 ? D.TWO_PI : t;
}, D.mod = function(e, t) {
	if (!T(e)) throw new R("m is required.");
	if (!T(t)) throw new R("n is required.");
	if (0 === t) throw new R("divisor cannot be 0.");
	return D.sign(e) === D.sign(t) && Math.abs(e) < Math.abs(t) ? e : (e % t + t) % t;
}, D.equalsEpsilon = function(e, t, r, n) {
	if (!T(e)) throw new R("left is required.");
	if (!T(t)) throw new R("right is required.");
	r = r ?? 0, n = n ?? r;
	const o = Math.abs(e - t);
	return o <= n || o <= r * Math.max(Math.abs(e), Math.abs(t));
}, D.lessThan = function(e, t, r) {
	if (!T(e)) throw new R("first is required.");
	if (!T(t)) throw new R("second is required.");
	if (!T(r)) throw new R("absoluteEpsilon is required.");
	return e - t < -r;
}, D.lessThanOrEquals = function(e, t, r) {
	if (!T(e)) throw new R("first is required.");
	if (!T(t)) throw new R("second is required.");
	if (!T(r)) throw new R("absoluteEpsilon is required.");
	return e - t < r;
}, D.greaterThan = function(e, t, r) {
	if (!T(e)) throw new R("first is required.");
	if (!T(t)) throw new R("second is required.");
	if (!T(r)) throw new R("absoluteEpsilon is required.");
	return e - t > r;
}, D.greaterThanOrEquals = function(e, t, r) {
	if (!T(e)) throw new R("first is required.");
	if (!T(t)) throw new R("second is required.");
	if (!T(r)) throw new R("absoluteEpsilon is required.");
	return e - t > -r;
};
const F = [1];
D.factorial = function(e) {
	if ("number" != typeof e || e < 0) throw new R("A number greater than or equal to 0 is required.");
	const t = F.length;
	if (e >= t) {
		let r = F[t - 1];
		for (let n = t; n <= e; n++) {
			const e = r * n;
			F.push(e), r = e;
		}
	}
	return F[e];
}, D.incrementWrap = function(e, t, r) {
	if (r = r ?? 0, !T(e)) throw new R("n is required.");
	if (t <= r) throw new R("maximumValue must be greater than minimumValue.");
	return ++e > t && (e = r), e;
}, D.isPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new R("A number between 0 and (2^32)-1 is required.");
	return 0 !== e && !(e & e - 1);
}, D.nextPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 2147483648) throw new R("A number between 0 and 2^31 is required.");
	return --e, e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ++e;
}, D.previousPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new R("A number between 0 and (2^32)-1 is required.");
	return e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ((e |= e >> 32) >>> 0) - (e >>> 1);
}, D.clamp = function(e, t, r) {
	return z.typeOf.number("value", e), z.typeOf.number("min", t), z.typeOf.number("max", r), e < t ? t : e > r ? r : e;
};
let L = new N.default();
D.setRandomNumberSeed = function(e) {
	if (!T(e)) throw new R("seed is required.");
	L = new N.default(e);
}, D.nextRandomNumber = function() {
	return L.random();
}, D.randomBetween = function(e, t) {
	return D.nextRandomNumber() * (t - e) + e;
}, D.acosClamped = function(e) {
	if (!T(e)) throw new R("value is required.");
	return Math.acos(D.clamp(e, -1, 1));
}, D.asinClamped = function(e) {
	if (!T(e)) throw new R("value is required.");
	return Math.asin(D.clamp(e, -1, 1));
}, D.chordLength = function(e, t) {
	if (!T(e)) throw new R("angle is required.");
	if (!T(t)) throw new R("radius is required.");
	return 2 * t * Math.sin(.5 * e);
}, D.logBase = function(e, t) {
	if (!T(e)) throw new R("number is required.");
	if (!T(t)) throw new R("base is required.");
	return Math.log(e) / Math.log(t);
}, D.cbrt = Math.cbrt ?? function(e) {
	const t = Math.pow(Math.abs(e), 1 / 3);
	return e < 0 ? -t : t;
}, D.log2 = Math.log2 ?? function(e) {
	return Math.log(e) * Math.LOG2E;
}, D.fog = function(e, t) {
	const r = e * t;
	return 1 - Math.exp(-r * r);
}, D.fastApproximateAtan = function(e) {
	return z.typeOf.number("x", e), e * (-.1784 * Math.abs(e) - .0663 * e * e + 1.0301);
}, D.fastApproximateAtan2 = function(e, t) {
	let r;
	z.typeOf.number("x", e), z.typeOf.number("y", t);
	let n = Math.abs(e);
	r = Math.abs(t);
	const o = Math.max(n, r);
	r = Math.min(n, r);
	const i = r / o;
	if (isNaN(i)) throw new R("either x or y must be nonzero");
	return n = D.fastApproximateAtan(i), n = Math.abs(t) > Math.abs(e) ? D.PI_OVER_TWO - n : n, n = e < 0 ? D.PI - n : n, n = t < 0 ? -n : n, n;
};
var U = class e {
	constructor(e, t) {
		this.x = e ?? 0, this.y = t ?? 0;
	}
	static fromElements(t, r, n) {
		return T(n) ? (n.x = t, n.y = r, n) : new e(t, r);
	}
	static clone(t, r) {
		if (T(t)) return T(r) ? (r.x = t.x, r.y = t.y, r) : new e(t.x, t.y);
	}
	static pack(e, t, r) {
		return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r] = e.y, t;
	}
	static unpack(t, r, n) {
		return z.defined("array", t), r = r ?? 0, T(n) || (n = new e()), n.x = t[r++], n.y = t[r], n;
	}
	static packArray(t, r) {
		z.defined("array", t);
		const n = t.length, o = 2 * n;
		if (T(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new R("If result is a typed array, it must have exactly array.length * 2 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 2 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (z.defined("array", t), z.typeOf.number.greaterThanOrEquals("array.length", t.length, 2), t.length % 2 != 0) throw new R("array length must be a multiple of 2.");
		const n = t.length;
		T(r) ? r.length = n / 2 : r = new Array(n / 2);
		for (let o = 0; o < n; o += 2) {
			const n = o / 2;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return z.typeOf.object("cartesian", e), Math.max(e.x, e.y);
	}
	static minimumComponent(e) {
		return z.typeOf.object("cartesian", e), Math.min(e.x, e.y);
	}
	static minimumByComponent(e, t, r) {
		return z.typeOf.object("first", e), z.typeOf.object("second", t), z.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r;
	}
	static maximumByComponent(e, t, r) {
		return z.typeOf.object("first", e), z.typeOf.object("second", t), z.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r;
	}
	static clamp(e, t, r, n) {
		z.typeOf.object("value", e), z.typeOf.object("min", t), z.typeOf.object("max", r), z.typeOf.object("result", n);
		const o = D.clamp(e.x, t.x, r.x), i = D.clamp(e.y, t.y, r.y);
		return n.x = o, n.y = i, n;
	}
	static magnitudeSquared(e) {
		return z.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return z.typeOf.object("left", t), z.typeOf.object("right", r), e.subtract(t, r, k), e.magnitude(k);
	}
	static distanceSquared(t, r) {
		return z.typeOf.object("left", t), z.typeOf.object("right", r), e.subtract(t, r, k), e.magnitudeSquared(k);
	}
	static normalize(t, r) {
		z.typeOf.object("cartesian", t), z.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, isNaN(r.x) || isNaN(r.y)) throw new R("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), e.x * t.x + e.y * t.y;
	}
	static cross(e, t) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), e.x * t.y - e.y * t.x;
	}
	static multiplyComponents(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r;
	}
	static divideComponents(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r;
	}
	static add(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r;
	}
	static subtract(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r;
	}
	static multiplyByScalar(e, t, r) {
		return z.typeOf.object("cartesian", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r;
	}
	static divideByScalar(e, t, r) {
		return z.typeOf.object("cartesian", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r;
	}
	static negate(e, t) {
		return z.typeOf.object("cartesian", e), z.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t;
	}
	static abs(e, t) {
		return z.typeOf.object("cartesian", e), z.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t;
	}
	static lerp(t, r, n, o) {
		return z.typeOf.object("start", t), z.typeOf.object("end", r), z.typeOf.number("t", n), z.typeOf.object("result", o), e.multiplyByScalar(r, n, B), o = e.multiplyByScalar(t, 1 - n, o), e.add(B, o, o);
	}
	static angleBetween(t, r) {
		return z.typeOf.object("left", t), z.typeOf.object("right", r), e.normalize(t, W), e.normalize(r, $), D.acosClamped(e.dot(W, $));
	}
	static mostOrthogonalAxis(t, r) {
		z.typeOf.object("cartesian", t), z.typeOf.object("result", r);
		const n = e.normalize(t, G);
		return e.abs(n, n), n.x <= n.y ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Y, r);
	}
	static equals(e, t) {
		return e === t || T(e) && T(t) && e.x === t.x && e.y === t.y;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || T(e) && T(t) && D.equalsEpsilon(e.x, t.x, r, n) && D.equalsEpsilon(e.y, t.y, r, n);
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	equalsEpsilon(t, r, n) {
		return e.equalsEpsilon(this, t, r, n);
	}
	toString() {
		return `(${this.x}, ${this.y})`;
	}
};
U.fromCartesian3 = U.clone, U.fromCartesian4 = U.clone, U.packedLength = 2, U.fromArray = U.unpack;
const k = new U(), B = new U(), W = new U(), $ = new U(), G = new U();
U.ZERO = Object.freeze(new U(0, 0)), U.ONE = Object.freeze(new U(1, 1)), U.UNIT_X = Object.freeze(new U(1, 0)), U.UNIT_Y = Object.freeze(new U(0, 1));
var H = class e {
	constructor(e, t, r) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0;
	}
	static fromSpherical(t, r) {
		z.typeOf.object("spherical", t), T(r) || (r = new e());
		const n = t.clock, o = t.cone, i = t.magnitude ?? 1, s = i * Math.sin(o);
		return r.x = s * Math.cos(n), r.y = s * Math.sin(n), r.z = i * Math.cos(o), r;
	}
	static fromElements(t, r, n, o) {
		return T(o) ? (o.x = t, o.y = r, o.z = n, o) : new e(t, r, n);
	}
	static clone(t, r) {
		if (T(t)) return T(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r) : new e(t.x, t.y, t.z);
	}
	static pack(e, t, r) {
		return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r] = e.z, t;
	}
	static unpack(t, r, n) {
		return z.defined("array", t), r = r ?? 0, T(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r], n;
	}
	static packArray(t, r) {
		z.defined("array", t);
		const n = t.length, o = 3 * n;
		if (T(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new R("If result is a typed array, it must have exactly array.length * 3 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 3 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (z.defined("array", t), z.typeOf.number.greaterThanOrEquals("array.length", t.length, 3), t.length % 3 != 0) throw new R("array length must be a multiple of 3.");
		const n = t.length;
		T(r) ? r.length = n / 3 : r = new Array(n / 3);
		for (let o = 0; o < n; o += 3) {
			const n = o / 3;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return z.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z);
	}
	static minimumComponent(e) {
		return z.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z);
	}
	static minimumByComponent(e, t, r) {
		return z.typeOf.object("first", e), z.typeOf.object("second", t), z.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r;
	}
	static maximumByComponent(e, t, r) {
		return z.typeOf.object("first", e), z.typeOf.object("second", t), z.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r;
	}
	static clamp(e, t, r, n) {
		z.typeOf.object("value", e), z.typeOf.object("min", t), z.typeOf.object("max", r), z.typeOf.object("result", n);
		const o = D.clamp(e.x, t.x, r.x), i = D.clamp(e.y, t.y, r.y), s = D.clamp(e.z, t.z, r.z);
		return n.x = o, n.y = i, n.z = s, n;
	}
	static magnitudeSquared(e) {
		return z.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return z.typeOf.object("left", t), z.typeOf.object("right", r), e.subtract(t, r, V), e.magnitude(V);
	}
	static distanceSquared(t, r) {
		return z.typeOf.object("left", t), z.typeOf.object("right", r), e.subtract(t, r, V), e.magnitudeSquared(V);
	}
	static normalize(t, r) {
		z.typeOf.object("cartesian", t), z.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z)) throw new R("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z;
	}
	static multiplyComponents(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r;
	}
	static divideComponents(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r;
	}
	static add(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r;
	}
	static subtract(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r;
	}
	static multiplyByScalar(e, t, r) {
		return z.typeOf.object("cartesian", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r;
	}
	static divideByScalar(e, t, r) {
		return z.typeOf.object("cartesian", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r;
	}
	static negate(e, t) {
		return z.typeOf.object("cartesian", e), z.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t;
	}
	static abs(e, t) {
		return z.typeOf.object("cartesian", e), z.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t;
	}
	static lerp(t, r, n, o) {
		return z.typeOf.object("start", t), z.typeOf.object("end", r), z.typeOf.number("t", n), z.typeOf.object("result", o), e.multiplyByScalar(r, n, Y), o = e.multiplyByScalar(t, 1 - n, o), e.add(Y, o, o);
	}
	static angleBetween(t, r) {
		z.typeOf.object("left", t), z.typeOf.object("right", r), e.normalize(t, Q), e.normalize(r, Z);
		const n = e.dot(Q, Z), o = e.magnitude(e.cross(Q, Z, Q));
		return Math.atan2(o, n);
	}
	static mostOrthogonalAxis(t, r) {
		z.typeOf.object("cartesian", t), z.typeOf.object("result", r);
		const n = e.normalize(t, X);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Z, r) : n.y <= n.z ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_Z, r);
	}
	static projectVector(t, r, n) {
		z.defined("a", t), z.defined("b", r), z.defined("result", n);
		const o = e.dot(t, r) / e.dot(r, r);
		return e.multiplyByScalar(r, o, n);
	}
	static equals(e, t) {
		return e === t || T(e) && T(t) && e.x === t.x && e.y === t.y && e.z === t.z;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || T(e) && T(t) && D.equalsEpsilon(e.x, t.x, r, n) && D.equalsEpsilon(e.y, t.y, r, n) && D.equalsEpsilon(e.z, t.z, r, n);
	}
	static cross(e, t, r) {
		z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r);
		const n = e.x, o = e.y, i = e.z, s = t.x, a = t.y, u = t.z, c = o * u - i * a, l = i * s - n * u, f = n * a - o * s;
		return r.x = c, r.y = l, r.z = f, r;
	}
	static midpoint(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = .5 * (e.x + t.x), r.y = .5 * (e.y + t.y), r.z = .5 * (e.z + t.z), r;
	}
	static fromDegrees(t, r, n, o, i) {
		return z.typeOf.number("longitude", t), z.typeOf.number("latitude", r), t = D.toRadians(t), r = D.toRadians(r), e.fromRadians(t, r, n, o, i);
	}
	static fromRadians(t, r, n, o, i) {
		z.typeOf.number("longitude", t), z.typeOf.number("latitude", r), n = n ?? 0;
		const s = T(o) ? o.radiiSquared : e._ellipsoidRadiiSquared, a = Math.cos(r);
		K.x = a * Math.cos(t), K.y = a * Math.sin(t), K.z = Math.sin(r), K = e.normalize(K, K), e.multiplyComponents(s, K, J);
		const u = Math.sqrt(e.dot(K, J));
		return J = e.divideByScalar(J, u, J), K = e.multiplyByScalar(K, n, K), T(i) || (i = new e()), e.add(J, K, i);
	}
	static fromDegreesArray(t, r, n) {
		if (z.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new R("the number of coordinates must be a multiple of 2 and at least 2");
		const o = t.length;
		T(n) ? n.length = o / 2 : n = new Array(o / 2);
		for (let i = 0; i < o; i += 2) {
			const o = t[i], s = t[i + 1], a = i / 2;
			n[a] = e.fromDegrees(o, s, 0, r, n[a]);
		}
		return n;
	}
	static fromRadiansArray(t, r, n) {
		if (z.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new R("the number of coordinates must be a multiple of 2 and at least 2");
		const o = t.length;
		T(n) ? n.length = o / 2 : n = new Array(o / 2);
		for (let i = 0; i < o; i += 2) {
			const o = t[i], s = t[i + 1], a = i / 2;
			n[a] = e.fromRadians(o, s, 0, r, n[a]);
		}
		return n;
	}
	static fromDegreesArrayHeights(t, r, n) {
		if (z.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new R("the number of coordinates must be a multiple of 3 and at least 3");
		const o = t.length;
		T(n) ? n.length = o / 3 : n = new Array(o / 3);
		for (let i = 0; i < o; i += 3) {
			const o = t[i], s = t[i + 1], a = t[i + 2], u = i / 3;
			n[u] = e.fromDegrees(o, s, a, r, n[u]);
		}
		return n;
	}
	static fromRadiansArrayHeights(t, r, n) {
		if (z.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new R("the number of coordinates must be a multiple of 3 and at least 3");
		const o = t.length;
		T(n) ? n.length = o / 3 : n = new Array(o / 3);
		for (let i = 0; i < o; i += 3) {
			const o = t[i], s = t[i + 1], a = t[i + 2], u = i / 3;
			n[u] = e.fromRadians(o, s, a, r, n[u]);
		}
		return n;
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	equalsEpsilon(t, r, n) {
		return e.equalsEpsilon(this, t, r, n);
	}
	toString() {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}
};
H.fromCartesian4 = H.clone, H.packedLength = 3, H.fromArray = H.unpack;
const V = new H(), Y = new H(), Q = new H(), Z = new H(), X = new H();
let K = new H(), J = new H();
H._ellipsoidRadiiSquared = new H(40680631590769, 40680631590769, 40408299984661.445), H.ZERO = Object.freeze(new H(0, 0, 0)), H.ONE = Object.freeze(new H(1, 1, 1)), H.UNIT_X = Object.freeze(new H(1, 0, 0)), H.UNIT_Y = Object.freeze(new H(0, 1, 0)), H.UNIT_Z = Object.freeze(new H(0, 0, 1));
const ee = new H(), te = new H();
function re(e, t, r, n, o) {
	if (!T(e)) throw new R("cartesian is required.");
	if (!T(t)) throw new R("oneOverRadii is required.");
	if (!T(r)) throw new R("oneOverRadiiSquared is required.");
	if (!T(n)) throw new R("centerToleranceSquared is required.");
	const i = e.x, s = e.y, a = e.z, u = t.x, c = t.y, l = t.z, f = i * i * u * u, h = s * s * c * c, p = a * a * l * l, d = f + h + p, m = Math.sqrt(1 / d), y = H.multiplyByScalar(e, m, ee);
	if (d < n) return isFinite(m) ? H.clone(y, o) : void 0;
	const g = r.x, b = r.y, w = r.z, O = te;
	O.x = y.x * g * 2, O.y = y.y * b * 2, O.z = y.z * w * 2;
	let E, x, _, S, v, C, j, A, z, I, M, q = (1 - m) * H.magnitude(e) / (.5 * H.magnitude(O)), P = 0;
	do
		q -= P, _ = 1 / (1 + q * g), S = 1 / (1 + q * b), v = 1 / (1 + q * w), C = _ * _, j = S * S, A = v * v, z = C * _, I = j * S, M = A * v, E = f * C + h * j + p * A - 1, x = f * z * g + h * I * b + p * M * w, P = E / (-2 * x);
	while (Math.abs(E) > D.EPSILON12);
	return T(o) ? (o.x = i * _, o.y = s * S, o.z = a * v, o) : new H(i * _, s * S, a * v);
}
var ne = class e {
	constructor(e, t, r) {
		this.longitude = e ?? 0, this.latitude = t ?? 0, this.height = r ?? 0;
	}
	static fromRadians(t, r, n, o) {
		return z.typeOf.number("longitude", t), z.typeOf.number("latitude", r), n = n ?? 0, T(o) ? (o.longitude = t, o.latitude = r, o.height = n, o) : new e(t, r, n);
	}
	static fromDegrees(t, r, n, o) {
		return z.typeOf.number("longitude", t), z.typeOf.number("latitude", r), t = D.toRadians(t), r = D.toRadians(r), e.fromRadians(t, r, n, o);
	}
	static fromCartesian(t, r, n) {
		const o = T(r) ? r.oneOverRadii : e._ellipsoidOneOverRadii, i = T(r) ? r.oneOverRadiiSquared : e._ellipsoidOneOverRadiiSquared, s = re(t, o, i, T(r) ? r._centerToleranceSquared : e._ellipsoidCenterToleranceSquared, ie);
		if (!T(s)) return;
		let a = H.multiplyComponents(s, i, oe);
		a = H.normalize(a, a);
		const u = H.subtract(t, s, se), c = Math.atan2(a.y, a.x), l = Math.asin(a.z), f = D.sign(H.dot(u, t)) * H.magnitude(u);
		return T(n) ? (n.longitude = c, n.latitude = l, n.height = f, n) : new e(c, l, f);
	}
	static toCartesian(e, t, r) {
		return z.defined("cartographic", e), H.fromRadians(e.longitude, e.latitude, e.height, t, r);
	}
	static clone(t, r) {
		if (T(t)) return T(r) ? (r.longitude = t.longitude, r.latitude = t.latitude, r.height = t.height, r) : new e(t.longitude, t.latitude, t.height);
	}
	static equals(e, t) {
		return e === t || T(e) && T(t) && e.longitude === t.longitude && e.latitude === t.latitude && e.height === t.height;
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || T(e) && T(t) && Math.abs(e.longitude - t.longitude) <= r && Math.abs(e.latitude - t.latitude) <= r && Math.abs(e.height - t.height) <= r;
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	equalsEpsilon(t, r) {
		return e.equalsEpsilon(this, t, r);
	}
	toString() {
		return `(${this.longitude}, ${this.latitude}, ${this.height})`;
	}
	static _ellipsoidOneOverRadii = new H(1 / 6378137, 1 / 6378137, 1 / 6356752.314245179);
	static _ellipsoidOneOverRadiiSquared = new H(1 / 40680631590769, 1 / 40680631590769, 1 / 40408299984661.445);
	static _ellipsoidCenterToleranceSquared = D.EPSILON1;
};
ne.ZERO = Object.freeze(new ne(0, 0, 0));
const oe = new H(), ie = new H(), se = new H();
function ae(e, t, r, n) {
	t = t ?? 0, r = r ?? 0, n = n ?? 0, z.typeOf.number.greaterThanOrEquals("x", t, 0), z.typeOf.number.greaterThanOrEquals("y", r, 0), z.typeOf.number.greaterThanOrEquals("z", n, 0), e._radii = new H(t, r, n), e._radiiSquared = new H(t * t, r * r, n * n), e._radiiToTheFourth = new H(t * t * t * t, r * r * r * r, n * n * n * n), e._oneOverRadii = new H(0 === t ? 0 : 1 / t, 0 === r ? 0 : 1 / r, 0 === n ? 0 : 1 / n), e._oneOverRadiiSquared = new H(0 === t ? 0 : 1 / (t * t), 0 === r ? 0 : 1 / (r * r), 0 === n ? 0 : 1 / (n * n)), e._minimumRadius = Math.min(t, r, n), e._maximumRadius = Math.max(t, r, n), e._centerToleranceSquared = D.EPSILON1, 0 !== e._radiiSquared.z && (e._squaredXOverSquaredZ = e._radiiSquared.x / e._radiiSquared.z);
}
var ue = class e {
	constructor(e, t, r) {
		this._radii = void 0, this._radiiSquared = void 0, this._radiiToTheFourth = void 0, this._oneOverRadii = void 0, this._oneOverRadiiSquared = void 0, this._minimumRadius = void 0, this._maximumRadius = void 0, this._centerToleranceSquared = void 0, this._squaredXOverSquaredZ = void 0, ae(this, e, t, r);
	}
	get radii() {
		return this._radii;
	}
	get radiiSquared() {
		return this._radiiSquared;
	}
	get radiiToTheFourth() {
		return this._radiiToTheFourth;
	}
	get oneOverRadii() {
		return this._oneOverRadii;
	}
	get oneOverRadiiSquared() {
		return this._oneOverRadiiSquared;
	}
	get minimumRadius() {
		return this._minimumRadius;
	}
	get maximumRadius() {
		return this._maximumRadius;
	}
	static clone(t, r) {
		if (!T(t)) return;
		const n = t._radii;
		return T(r) ? (H.clone(n, r._radii), H.clone(t._radiiSquared, r._radiiSquared), H.clone(t._radiiToTheFourth, r._radiiToTheFourth), H.clone(t._oneOverRadii, r._oneOverRadii), H.clone(t._oneOverRadiiSquared, r._oneOverRadiiSquared), r._minimumRadius = t._minimumRadius, r._maximumRadius = t._maximumRadius, r._centerToleranceSquared = t._centerToleranceSquared, r) : new e(n.x, n.y, n.z);
	}
	static fromCartesian3(t, r) {
		return T(r) || (r = new e()), T(t) ? (ae(r, t.x, t.y, t.z), r) : r;
	}
	static get default() {
		return e._default;
	}
	static set default(t) {
		z.typeOf.object("value", t), e._default = t, H._ellipsoidRadiiSquared = t.radiiSquared, ne._ellipsoidOneOverRadii = t.oneOverRadii, ne._ellipsoidOneOverRadiiSquared = t.oneOverRadiiSquared, ne._ellipsoidCenterToleranceSquared = t._centerToleranceSquared;
	}
	clone(t) {
		return e.clone(this, t);
	}
	static pack(e, t, r) {
		return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, H.pack(e._radii, t, r), t;
	}
	static unpack(t, r, n) {
		z.defined("array", t), r = r ?? 0;
		const o = H.unpack(t, r);
		return e.fromCartesian3(o, n);
	}
	geodeticSurfaceNormalCartographic(e, t) {
		z.typeOf.object("cartographic", e);
		const r = e.longitude, n = e.latitude, o = Math.cos(n), i = o * Math.cos(r), s = o * Math.sin(r), a = Math.sin(n);
		return T(t) || (t = new H()), t.x = i, t.y = s, t.z = a, H.normalize(t, t);
	}
	geodeticSurfaceNormal(e, t) {
		if (z.typeOf.object("cartesian", e), isNaN(e.x) || isNaN(e.y) || isNaN(e.z)) throw new R("cartesian has a NaN component");
		if (!H.equalsEpsilon(e, H.ZERO, D.EPSILON14)) return T(t) || (t = new H()), t = H.multiplyComponents(e, this._oneOverRadiiSquared, t), H.normalize(t, t);
	}
	cartographicToCartesian(e, t) {
		const r = ce, n = le;
		this.geodeticSurfaceNormalCartographic(e, r), H.multiplyComponents(this._radiiSquared, r, n);
		const o = Math.sqrt(H.dot(r, n));
		return H.divideByScalar(n, o, n), H.multiplyByScalar(r, e.height, r), T(t) || (t = new H()), H.add(n, r, t);
	}
	cartographicArrayToCartesianArray(e, t) {
		z.defined("cartographics", e);
		const r = e.length;
		T(t) ? t.length = r : t = new Array(r);
		for (let n = 0; n < r; n++) t[n] = this.cartographicToCartesian(e[n], t[n]);
		return t;
	}
	cartesianToCartographic(e, t) {
		const r = this.scaleToGeodeticSurface(e, he);
		if (!T(r)) return;
		const n = this.geodeticSurfaceNormal(r, fe), o = H.subtract(e, r, pe), i = Math.atan2(n.y, n.x), s = Math.asin(n.z), a = D.sign(H.dot(o, e)) * H.magnitude(o);
		return T(t) ? (t.longitude = i, t.latitude = s, t.height = a, t) : new ne(i, s, a);
	}
	cartesianArrayToCartographicArray(e, t) {
		z.defined("cartesians", e);
		const r = e.length;
		T(t) ? t.length = r : t = new Array(r);
		for (let n = 0; n < r; ++n) t[n] = this.cartesianToCartographic(e[n], t[n]);
		return t;
	}
	scaleToGeodeticSurface(e, t) {
		return re(e, this._oneOverRadii, this._oneOverRadiiSquared, this._centerToleranceSquared, t);
	}
	scaleToGeocentricSurface(e, t) {
		z.typeOf.object("cartesian", e), T(t) || (t = new H());
		const r = e.x, n = e.y, o = e.z, i = this._oneOverRadiiSquared, s = 1 / Math.sqrt(r * r * i.x + n * n * i.y + o * o * i.z);
		return H.multiplyByScalar(e, s, t);
	}
	transformPositionToScaledSpace(e, t) {
		return T(t) || (t = new H()), H.multiplyComponents(e, this._oneOverRadii, t);
	}
	transformPositionFromScaledSpace(e, t) {
		return T(t) || (t = new H()), H.multiplyComponents(e, this._radii, t);
	}
	equals(e) {
		return this === e || T(e) && H.equals(this._radii, e._radii);
	}
	toString() {
		return this._radii.toString();
	}
	getSurfaceNormalIntersectionWithZAxis(e, t, r) {
		if (z.typeOf.object("position", e), !D.equalsEpsilon(this._radii.x, this._radii.y, D.EPSILON15)) throw new R("Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)");
		z.typeOf.number.greaterThan("Ellipsoid.radii.z", this._radii.z, 0), t = t ?? 0;
		const n = this._squaredXOverSquaredZ;
		if (T(r) || (r = new H()), r.x = 0, r.y = 0, r.z = e.z * (1 - n), !(Math.abs(r.z) >= this._radii.z - t)) return r;
	}
	getLocalCurvature(e, t) {
		z.typeOf.object("surfacePosition", e), T(t) || (t = new U());
		const r = this.getSurfaceNormalIntersectionWithZAxis(e, 0, de), n = H.distance(e, r), o = n * (this.minimumRadius * n / this.maximumRadius ** 2) ** 2;
		return U.fromElements(1 / n, 1 / o, t);
	}
	surfaceArea(e) {
		z.typeOf.object("rectangle", e);
		const t = e.west;
		let r = e.east;
		const n = e.south, o = e.north;
		for (; r < t;) r += D.TWO_PI;
		const i = this._radiiSquared, s = i.x, a = i.y, u = i.z, c = s * a;
		return ge(n, o, function(e) {
			const n = Math.cos(e), o = Math.sin(e);
			return Math.cos(e) * ge(t, r, function(e) {
				const t = Math.cos(e), r = Math.sin(e);
				return Math.sqrt(c * o * o + u * (a * t * t + s * r * r) * n * n);
			});
		});
	}
};
ue.WGS84 = Object.freeze(new ue(6378137, 6378137, 6356752.314245179)), ue.UNIT_SPHERE = Object.freeze(new ue(1, 1, 1)), ue.MOON = Object.freeze(new ue(D.LUNAR_RADIUS, D.LUNAR_RADIUS, D.LUNAR_RADIUS)), ue.MARS = Object.freeze(new ue(3396190, 3396190, 3376200)), ue._default = ue.WGS84, ue.packedLength = H.packedLength, ue.prototype.geocentricSurfaceNormal = H.normalize;
const ce = new H(), le = new H(), fe = new H(), he = new H(), pe = new H(), de = new H(), me = [
	.14887433898163,
	.43339539412925,
	.67940956829902,
	.86506336668898,
	.97390652851717,
	0
], ye = [
	.29552422471475,
	.26926671930999,
	.21908636251598,
	.14945134915058,
	.066671344308684,
	0
];
function ge(e, t, r) {
	z.typeOf.number("a", e), z.typeOf.number("b", t), z.typeOf.func("func", r);
	const n = .5 * (t + e), o = .5 * (t - e);
	let i = 0;
	for (let s = 0; s < 5; s++) {
		const e = o * me[s];
		i += ye[s] * (r(n + e) + r(n - e));
	}
	return i *= o, i;
}
const be = {
	OUTSIDE: -1,
	INTERSECTING: 0,
	INSIDE: 1
};
Object.freeze(be);
var we = class e {
	constructor(e, t, r, n) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0, this.w = n ?? 0;
	}
	static fromElements(t, r, n, o, i) {
		return T(i) ? (i.x = t, i.y = r, i.z = n, i.w = o, i) : new e(t, r, n, o);
	}
	static fromColor(t, r) {
		return z.typeOf.object("color", t), T(r) ? (r.x = t.red, r.y = t.green, r.z = t.blue, r.w = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static clone(t, r) {
		if (T(t)) return T(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r.w = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static pack(e, t, r) {
		return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.z, t[r] = e.w, t;
	}
	static unpack(t, r, n) {
		return z.defined("array", t), r = r ?? 0, T(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r++], n.w = t[r], n;
	}
	static packArray(t, r) {
		z.defined("array", t);
		const n = t.length, o = 4 * n;
		if (T(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new R("If result is a typed array, it must have exactly array.length * 4 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 4 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (z.defined("array", t), z.typeOf.number.greaterThanOrEquals("array.length", t.length, 4), t.length % 4 != 0) throw new R("array length must be a multiple of 4.");
		const n = t.length;
		T(r) ? r.length = n / 4 : r = new Array(n / 4);
		for (let o = 0; o < n; o += 4) {
			const n = o / 4;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return z.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z, e.w);
	}
	static minimumComponent(e) {
		return z.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z, e.w);
	}
	static minimumByComponent(e, t, r) {
		return z.typeOf.object("first", e), z.typeOf.object("second", t), z.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r.w = Math.min(e.w, t.w), r;
	}
	static maximumByComponent(e, t, r) {
		return z.typeOf.object("first", e), z.typeOf.object("second", t), z.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r.w = Math.max(e.w, t.w), r;
	}
	static clamp(e, t, r, n) {
		z.typeOf.object("value", e), z.typeOf.object("min", t), z.typeOf.object("max", r), z.typeOf.object("result", n);
		const o = D.clamp(e.x, t.x, r.x), i = D.clamp(e.y, t.y, r.y), s = D.clamp(e.z, t.z, r.z), a = D.clamp(e.w, t.w, r.w);
		return n.x = o, n.y = i, n.z = s, n.w = a, n;
	}
	static magnitudeSquared(e) {
		return z.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return z.typeOf.object("left", t), z.typeOf.object("right", r), e.subtract(t, r, Oe), e.magnitude(Oe);
	}
	static distanceSquared(t, r) {
		return z.typeOf.object("left", t), z.typeOf.object("right", r), e.subtract(t, r, Oe), e.magnitudeSquared(Oe);
	}
	static normalize(t, r) {
		z.typeOf.object("cartesian", t), z.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, r.w = t.w / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z) || isNaN(r.w)) throw new R("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z + e.w * t.w;
	}
	static multiplyComponents(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r.w = e.w * t.w, r;
	}
	static divideComponents(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r.w = e.w / t.w, r;
	}
	static add(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r.w = e.w + t.w, r;
	}
	static subtract(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r.w = e.w - t.w, r;
	}
	static multiplyByScalar(e, t, r) {
		return z.typeOf.object("cartesian", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r.w = e.w * t, r;
	}
	static divideByScalar(e, t, r) {
		return z.typeOf.object("cartesian", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r.w = e.w / t, r;
	}
	static negate(e, t) {
		return z.typeOf.object("cartesian", e), z.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
	}
	static abs(e, t) {
		return z.typeOf.object("cartesian", e), z.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t.w = Math.abs(e.w), t;
	}
	static lerp(t, r, n, o) {
		return z.typeOf.object("start", t), z.typeOf.object("end", r), z.typeOf.number("t", n), z.typeOf.object("result", o), e.multiplyByScalar(r, n, Ee), o = e.multiplyByScalar(t, 1 - n, o), e.add(Ee, o, o);
	}
	static mostOrthogonalAxis(t, r) {
		z.typeOf.object("cartesian", t), z.typeOf.object("result", r);
		const n = e.normalize(t, xe);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? n.x <= n.w ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_W, r) : n.z <= n.w ? e.clone(e.UNIT_Z, r) : e.clone(e.UNIT_W, r) : n.y <= n.z ? n.y <= n.w ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_W, r) : n.z <= n.w ? e.clone(e.UNIT_Z, r) : e.clone(e.UNIT_W, r);
	}
	static equals(e, t) {
		return e === t || T(e) && T(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2] && e.w === t[r + 3];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || T(e) && T(t) && D.equalsEpsilon(e.x, t.x, r, n) && D.equalsEpsilon(e.y, t.y, r, n) && D.equalsEpsilon(e.z, t.z, r, n) && D.equalsEpsilon(e.w, t.w, r, n);
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	equalsEpsilon(t, r, n) {
		return e.equalsEpsilon(this, t, r, n);
	}
	toString() {
		return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
	}
	static packFloat(t, r) {
		return z.typeOf.number("value", t), T(r) || (r = new e()), _e[0] = t, Ce ? (r.x = Se[0], r.y = Se[1], r.z = Se[2], r.w = Se[3]) : (r.x = Se[3], r.y = Se[2], r.z = Se[1], r.w = Se[0]), r;
	}
	static unpackFloat(e) {
		return z.typeOf.object("packedFloat", e), Ce ? (Se[0] = e.x, Se[1] = e.y, Se[2] = e.z, Se[3] = e.w) : (Se[0] = e.w, Se[1] = e.z, Se[2] = e.y, Se[3] = e.x), _e[0];
	}
};
we.packedLength = 4, we.fromArray = we.unpack;
const Oe = new we(), Ee = new we(), xe = new we();
we.ZERO = Object.freeze(new we(0, 0, 0, 0)), we.ONE = Object.freeze(new we(1, 1, 1, 1)), we.UNIT_X = Object.freeze(new we(1, 0, 0, 0)), we.UNIT_Y = Object.freeze(new we(0, 1, 0, 0)), we.UNIT_Z = Object.freeze(new we(0, 0, 1, 0)), we.UNIT_W = Object.freeze(new we(0, 0, 0, 1));
const _e = /* @__PURE__ */ new Float32Array(1), Se = new Uint8Array(_e.buffer), ve = new Uint32Array([287454020]), Ce = 68 === new Uint8Array(ve.buffer)[0];
function je(e, t, r) {
	z.defined("array", e), z.defined("itemToFind", t), z.defined("comparator", r);
	let n, o, i = 0, s = e.length - 1;
	for (; i <= s;) if (n = ~~((i + s) / 2), o = r(e[n], t), o < 0) i = n + 1;
	else {
		if (!(o > 0)) return n;
		s = n - 1;
	}
	return ~(s + 1);
}
function Ae(e, t, r, n, o) {
	this.xPoleWander = e, this.yPoleWander = t, this.xPoleOffset = r, this.yPoleOffset = n, this.ut1MinusUtc = o;
}
function Te(e) {
	if (null === e || isNaN(e)) throw new R("year is required and must be a number.");
	return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}
const Re = [
	31,
	28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
function ze(e, t, r, n, o, i, s, a) {
	e = e ?? 1, t = t ?? 1, r = r ?? 1, n = n ?? 0, o = o ?? 0, i = i ?? 0, s = s ?? 0, a = a ?? !1, z.typeOf.number.greaterThanOrEquals("Year", e, 1), z.typeOf.number.lessThanOrEquals("Year", e, 9999), z.typeOf.number.greaterThanOrEquals("Month", t, 1), z.typeOf.number.lessThanOrEquals("Month", t, 12), z.typeOf.number.greaterThanOrEquals("Day", r, 1), z.typeOf.number.lessThanOrEquals("Day", r, 31), z.typeOf.number.greaterThanOrEquals("Hour", n, 0), z.typeOf.number.lessThanOrEquals("Hour", n, 23), z.typeOf.number.greaterThanOrEquals("Minute", o, 0), z.typeOf.number.lessThanOrEquals("Minute", o, 59), z.typeOf.bool("IsLeapSecond", a), z.typeOf.number.greaterThanOrEquals("Second", i, 0), z.typeOf.number.lessThanOrEquals("Second", i, a ? 60 : 59), z.typeOf.number.greaterThanOrEquals("Millisecond", s, 0), z.typeOf.number.lessThan("Millisecond", s, 1e3), function() {
		const n = 2 === t && Te(e) ? Re[t - 1] + 1 : Re[t - 1];
		if (r > n) throw new R("Month and Day represents invalid date");
	}(), this.year = e, this.month = t, this.day = r, this.hour = n, this.minute = o, this.second = i, this.millisecond = s, this.isLeapSecond = a;
}
function Ie(e, t) {
	this.julianDate = e, this.offset = t;
}
const Me = {
	SECONDS_PER_MILLISECOND: .001,
	SECONDS_PER_MINUTE: 60,
	MINUTES_PER_HOUR: 60,
	HOURS_PER_DAY: 24,
	SECONDS_PER_HOUR: 3600,
	MINUTES_PER_DAY: 1440,
	SECONDS_PER_DAY: 86400,
	DAYS_PER_JULIAN_CENTURY: 36525,
	PICOSECOND: 1e-9,
	MODIFIED_JULIAN_DATE_DIFFERENCE: 2400000.5
};
Object.freeze(Me);
const qe = {
	UTC: 0,
	TAI: 1
};
Object.freeze(qe);
const Pe = new ze(), Ne = [
	31,
	28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
function De(e, t) {
	return Je.compare(e.julianDate, t.julianDate);
}
const Fe = new Ie();
function Le(e) {
	Fe.julianDate = e;
	const t = Je.leapSeconds;
	let r = je(t, Fe, De);
	r < 0 && (r = ~r), r >= t.length && (r = t.length - 1);
	let n = t[r].offset;
	r > 0 && Je.secondsDifference(t[r].julianDate, e) > n && (r--, n = t[r].offset), Je.addSeconds(e, n, e);
}
function Ue(e, t) {
	Fe.julianDate = e;
	const r = Je.leapSeconds;
	let n = je(r, Fe, De);
	if (n < 0 && (n = ~n), 0 === n) return Je.addSeconds(e, -r[0].offset, t);
	if (n >= r.length) return Je.addSeconds(e, -r[n - 1].offset, t);
	const o = Je.secondsDifference(r[n].julianDate, e);
	return 0 === o ? Je.addSeconds(e, -r[n].offset, t) : o <= 1 ? void 0 : Je.addSeconds(e, -r[--n].offset, t);
}
function ke(e, t, r) {
	const n = t / Me.SECONDS_PER_DAY | 0;
	return e += n, (t -= Me.SECONDS_PER_DAY * n) < 0 && (e--, t += Me.SECONDS_PER_DAY), r.dayNumber = e, r.secondsOfDay = t, r;
}
function Be(e, t, r, n, o, i, s) {
	const a = (t - 14) / 12 | 0, u = e + 4800 + a;
	let c = (1461 * u / 4 | 0) + (367 * (t - 2 - 12 * a) / 12 | 0) - (3 * ((u + 100) / 100 | 0) / 4 | 0) + r - 32075;
	(n -= 12) < 0 && (n += 24);
	const l = i + (n * Me.SECONDS_PER_HOUR + o * Me.SECONDS_PER_MINUTE + s * Me.SECONDS_PER_MILLISECOND);
	return l >= 43200 && (c -= 1), [c, l];
}
const We = /^(\d{4})$/, $e = /^(\d{4})-(\d{2})$/, Ge = /^(\d{4})-?(\d{3})$/, He = /^(\d{4})-?W(\d{2})-?(\d{1})?$/, Ve = /^(\d{4})-?(\d{2})-?(\d{2})$/, Ye = /([Z+\-])?(\d{2})?:?(\d{2})?$/, Qe = /^(\d{2})(\.\d+)?/.source + Ye.source, Ze = /^(\d{2}):?(\d{2})(\.\d+)?/.source + Ye.source, Xe = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + Ye.source, Ke = "Invalid ISO 8601 date.";
var Je = class e {
	constructor(e, t, r) {
		this.dayNumber = void 0, this.secondsOfDay = void 0, t = t ?? 0, r = r ?? qe.UTC;
		const n = 0 | (e = e ?? 0);
		ke(n, t += (e - n) * Me.SECONDS_PER_DAY, this), r === qe.UTC && Le(this);
	}
	static fromGregorianDate(t, r) {
		if (!(t instanceof ze)) throw new R("date must be a valid GregorianDate.");
		const n = Be(t.year, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
		return T(r) ? (ke(n[0], n[1], r), Le(r), r) : new e(n[0], n[1], qe.UTC);
	}
	static fromDate(t, r) {
		if (!(t instanceof Date) || isNaN(t.getTime())) throw new R("date must be a valid JavaScript Date.");
		const n = Be(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.getUTCMilliseconds());
		return T(r) ? (ke(n[0], n[1], r), Le(r), r) : new e(n[0], n[1], qe.UTC);
	}
	static fromIso8601(t, r) {
		if ("string" != typeof t) throw new R(Ke);
		let n, o = (t = t.replace(",", ".")).split("T"), i = 1, s = 1, a = 0, u = 0, c = 0, l = 0;
		const f = o[0], h = o[1];
		let p, d, m, y;
		if (!T(f)) throw new R(Ke);
		if (o = f.match(Ve), null !== o) {
			if (m = f.split("-").length - 1, m > 0 && 2 !== m) throw new R(Ke);
			n = +o[1], i = +o[2], s = +o[3];
		} else if (o = f.match($e), null !== o) n = +o[1], i = +o[2];
		else if (o = f.match(We), null !== o) n = +o[1];
		else {
			let e;
			if (o = f.match(Ge), null !== o) {
				if (n = +o[1], e = +o[2], d = Te(n), e < 1 || d && e > 366 || !d && e > 365) throw new R(Ke);
			} else {
				if (o = f.match(He), null === o) throw new R(Ke);
				{
					n = +o[1];
					const t = +o[2], r = +o[3] || 0;
					if (m = f.split("-").length - 1, m > 0 && (!T(o[3]) && 1 !== m || T(o[3]) && 2 !== m)) throw new R(Ke);
					e = 7 * t + r - new Date(Date.UTC(n, 0, 4)).getUTCDay() - 3;
				}
			}
			p = new Date(Date.UTC(n, 0, 1)), p.setUTCDate(e), i = p.getUTCMonth() + 1, s = p.getUTCDate();
		}
		if (d = Te(n), i < 1 || i > 12 || s < 1 || (2 !== i || !d) && s > Ne[i - 1] || d && 2 === i && s > 29) throw new R(Ke);
		if (T(h)) {
			if (o = h.match(Xe), null !== o) {
				if (m = h.split(":").length - 1, m > 0 && 2 !== m && 3 !== m) throw new R(Ke);
				a = +o[1], u = +o[2], c = +o[3], l = 1e3 * +(o[4] || 0), y = 5;
			} else if (o = h.match(Ze), null !== o) {
				if (m = h.split(":").length - 1, m > 2) throw new R(Ke);
				a = +o[1], u = +o[2], c = 60 * +(o[3] || 0), y = 4;
			} else {
				if (o = h.match(Qe), null === o) throw new R(Ke);
				a = +o[1], u = 60 * +(o[2] || 0), y = 3;
			}
			if (u >= 60 || c >= 61 || a > 24 || 24 === a && (u > 0 || c > 0 || l > 0)) throw new R(Ke);
			const e = o[y], t = +o[y + 1], r = +(o[y + 2] || 0);
			switch (e) {
				case "+":
					a -= t, u -= r;
					break;
				case "-":
					a += t, u += r;
					break;
				case "Z": break;
				default: u += new Date(Date.UTC(n, i - 1, s, a, u)).getTimezoneOffset();
			}
		}
		const g = 60 === c;
		for (g && c--; u >= 60;) u -= 60, a++;
		for (; a >= 24;) a -= 24, s++;
		for (p = d && 2 === i ? 29 : Ne[i - 1]; s > p;) s -= p, i++, i > 12 && (i -= 12, n++), p = d && 2 === i ? 29 : Ne[i - 1];
		for (; u < 0;) u += 60, a--;
		for (; a < 0;) a += 24, s--;
		for (; s < 1;) i--, i < 1 && (i += 12, n--), p = d && 2 === i ? 29 : Ne[i - 1], s += p;
		const b = Be(n, i, s, a, u, c, l);
		return T(r) ? (ke(b[0], b[1], r), Le(r)) : r = new e(b[0], b[1], qe.UTC), g && e.addSeconds(r, 1, r), r;
	}
	static now(t) {
		return e.fromDate(/* @__PURE__ */ new Date(), t);
	}
	static toGregorianDate(t, r) {
		if (!T(t)) throw new R("julianDate is required.");
		let n = !1, o = Ue(t, et);
		T(o) || (e.addSeconds(t, -1, et), o = Ue(et, et), n = !0);
		let i = o.dayNumber;
		const s = o.secondsOfDay;
		s >= 43200 && (i += 1);
		let a = i + 68569 | 0;
		const u = 4 * a / 146097 | 0;
		a = a - ((146097 * u + 3) / 4 | 0) | 0;
		const c = 4e3 * (a + 1) / 1461001 | 0;
		a = a - (1461 * c / 4 | 0) + 31 | 0;
		const l = 80 * a / 2447 | 0, f = a - (2447 * l / 80 | 0) | 0;
		a = l / 11 | 0;
		const h = l + 2 - 12 * a | 0, p = 100 * (u - 49) + c + a | 0;
		let d = s / Me.SECONDS_PER_HOUR | 0, m = s - d * Me.SECONDS_PER_HOUR;
		const y = m / Me.SECONDS_PER_MINUTE | 0;
		m -= y * Me.SECONDS_PER_MINUTE;
		let g = 0 | m;
		const b = (m - g) / Me.SECONDS_PER_MILLISECOND;
		return d += 12, d > 23 && (d -= 24), n && (g += 1), T(r) ? (r.year = p, r.month = h, r.day = f, r.hour = d, r.minute = y, r.second = g, r.millisecond = b, r.isLeapSecond = n, r) : new ze(p, h, f, d, y, g, b, n);
	}
	static toDate(t) {
		if (!T(t)) throw new R("julianDate is required.");
		const r = e.toGregorianDate(t, Pe);
		let n = r.second;
		return r.isLeapSecond && (n -= 1), new Date(Date.UTC(r.year, r.month - 1, r.day, r.hour, r.minute, n, r.millisecond));
	}
	static toIso8601(t, r) {
		if (!T(t)) throw new R("julianDate is required.");
		const n = e.toGregorianDate(t, Pe);
		let o = n.year, i = n.month, s = n.day, a = n.hour;
		const u = n.minute, c = n.second, l = n.millisecond;
		let f;
		if (1e4 === o && 1 === i && 1 === s && 0 === a && 0 === u && 0 === c && 0 === l && (o = 9999, i = 12, s = 31, a = 24), !T(r) && 0 !== l) {
			const e = .01 * l;
			return f = e < 1e-6 ? e.toFixed(20).replace(".", "").replace(/0+$/, "") : e.toString().replace(".", ""), `${o.toString().padStart(4, "0")}-${i.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${f}Z`;
		}
		return T(r) && 0 !== r ? (f = (.01 * l).toFixed(r).replace(".", "").slice(0, r), `${o.toString().padStart(4, "0")}-${i.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${f}Z`) : `${o.toString().padStart(4, "0")}-${i.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}Z`;
	}
	static clone(t, r) {
		if (T(t)) return T(r) ? (r.dayNumber = t.dayNumber, r.secondsOfDay = t.secondsOfDay, r) : new e(t.dayNumber, t.secondsOfDay, qe.TAI);
	}
	static compare(e, t) {
		if (!T(e)) throw new R("left is required.");
		if (!T(t)) throw new R("right is required.");
		const r = e.dayNumber - t.dayNumber;
		return 0 !== r ? r : e.secondsOfDay - t.secondsOfDay;
	}
	static equals(e, t) {
		return e === t || T(e) && T(t) && e.dayNumber === t.dayNumber && e.secondsOfDay === t.secondsOfDay;
	}
	static equalsEpsilon(t, r, n) {
		return n = n ?? 0, t === r || T(t) && T(r) && Math.abs(e.secondsDifference(t, r)) <= n;
	}
	static totalDays(e) {
		if (!T(e)) throw new R("julianDate is required.");
		return e.dayNumber + e.secondsOfDay / Me.SECONDS_PER_DAY;
	}
	static secondsDifference(e, t) {
		if (!T(e)) throw new R("left is required.");
		if (!T(t)) throw new R("right is required.");
		return (e.dayNumber - t.dayNumber) * Me.SECONDS_PER_DAY + (e.secondsOfDay - t.secondsOfDay);
	}
	static daysDifference(e, t) {
		if (!T(e)) throw new R("left is required.");
		if (!T(t)) throw new R("right is required.");
		return e.dayNumber - t.dayNumber + (e.secondsOfDay - t.secondsOfDay) / Me.SECONDS_PER_DAY;
	}
	static computeTaiMinusUtc(t) {
		Fe.julianDate = t;
		const r = e.leapSeconds;
		let n = je(r, Fe, De);
		return n < 0 && (n = ~n, --n, n < 0 && (n = 0)), r[n].offset;
	}
	static addSeconds(e, t, r) {
		if (!T(e)) throw new R("julianDate is required.");
		if (!T(t)) throw new R("seconds is required.");
		if (!T(r)) throw new R("result is required.");
		return ke(e.dayNumber, e.secondsOfDay + t, r);
	}
	static addMinutes(e, t, r) {
		if (!T(e)) throw new R("julianDate is required.");
		if (!T(t)) throw new R("minutes is required.");
		if (!T(r)) throw new R("result is required.");
		const n = e.secondsOfDay + t * Me.SECONDS_PER_MINUTE;
		return ke(e.dayNumber, n, r);
	}
	static addHours(e, t, r) {
		if (!T(e)) throw new R("julianDate is required.");
		if (!T(t)) throw new R("hours is required.");
		if (!T(r)) throw new R("result is required.");
		const n = e.secondsOfDay + t * Me.SECONDS_PER_HOUR;
		return ke(e.dayNumber, n, r);
	}
	static addDays(e, t, r) {
		if (!T(e)) throw new R("julianDate is required.");
		if (!T(t)) throw new R("days is required.");
		if (!T(r)) throw new R("result is required.");
		return ke(e.dayNumber + t, e.secondsOfDay, r);
	}
	static lessThan(t, r) {
		return e.compare(t, r) < 0;
	}
	static lessThanOrEquals(t, r) {
		return e.compare(t, r) <= 0;
	}
	static greaterThan(t, r) {
		return e.compare(t, r) > 0;
	}
	static greaterThanOrEquals(t, r) {
		return e.compare(t, r) >= 0;
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	equalsEpsilon(t, r) {
		return e.equalsEpsilon(this, t, r);
	}
	toString() {
		return e.toIso8601(this);
	}
};
const et = new Je(0, 0, qe.TAI);
Je.leapSeconds = [
	new Ie(new Je(2441317, 43210, qe.TAI), 10),
	new Ie(new Je(2441499, 43211, qe.TAI), 11),
	new Ie(new Je(2441683, 43212, qe.TAI), 12),
	new Ie(new Je(2442048, 43213, qe.TAI), 13),
	new Ie(new Je(2442413, 43214, qe.TAI), 14),
	new Ie(new Je(2442778, 43215, qe.TAI), 15),
	new Ie(new Je(2443144, 43216, qe.TAI), 16),
	new Ie(new Je(2443509, 43217, qe.TAI), 17),
	new Ie(new Je(2443874, 43218, qe.TAI), 18),
	new Ie(new Je(2444239, 43219, qe.TAI), 19),
	new Ie(new Je(2444786, 43220, qe.TAI), 20),
	new Ie(new Je(2445151, 43221, qe.TAI), 21),
	new Ie(new Je(2445516, 43222, qe.TAI), 22),
	new Ie(new Je(2446247, 43223, qe.TAI), 23),
	new Ie(new Je(2447161, 43224, qe.TAI), 24),
	new Ie(new Je(2447892, 43225, qe.TAI), 25),
	new Ie(new Je(2448257, 43226, qe.TAI), 26),
	new Ie(new Je(2448804, 43227, qe.TAI), 27),
	new Ie(new Je(2449169, 43228, qe.TAI), 28),
	new Ie(new Je(2449534, 43229, qe.TAI), 29),
	new Ie(new Je(2450083, 43230, qe.TAI), 30),
	new Ie(new Je(2450630, 43231, qe.TAI), 31),
	new Ie(new Je(2451179, 43232, qe.TAI), 32),
	new Ie(new Je(2453736, 43233, qe.TAI), 33),
	new Ie(new Je(2454832, 43234, qe.TAI), 34),
	new Ie(new Je(2456109, 43235, qe.TAI), 35),
	new Ie(new Je(2457204, 43236, qe.TAI), 36),
	new Ie(new Je(2457754, 43237, qe.TAI), 37)
];
var tt = s((e, t) => {
	/*! https://mths.be/punycode v1.4.0 by @mathias */
	(function(r) {
		var n = "object" == typeof e && e && !e.nodeType && e, o = "object" == typeof t && t && !t.nodeType && t, i = "object" == typeof global && global;
		i.global !== i && i.window !== i && i.self !== i || (r = i);
		var s, a, u = 2147483647, c = 36, l = /^xn--/, f = /[^\x20-\x7E]/, h = /[\x2E\u3002\uFF0E\uFF61]/g, p = {
			overflow: "Overflow: input needs wider integers to process",
			"not-basic": "Illegal input >= 0x80 (not a basic code point)",
			"invalid-input": "Invalid input"
		}, d = Math.floor, m = String.fromCharCode;
		function y(e) {
			throw new RangeError(p[e]);
		}
		function g(e, t) {
			for (var r = e.length, n = []; r--;) n[r] = t(e[r]);
			return n;
		}
		function b(e, t) {
			var r = e.split("@"), n = "";
			return r.length > 1 && (n = r[0] + "@", e = r[1]), n + g((e = e.replace(h, ".")).split("."), t).join(".");
		}
		function w(e) {
			for (var t, r, n = [], o = 0, i = e.length; o < i;) (t = e.charCodeAt(o++)) >= 55296 && t <= 56319 && o < i ? 56320 == (64512 & (r = e.charCodeAt(o++))) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), o--) : n.push(t);
			return n;
		}
		function O(e) {
			return g(e, function(e) {
				var t = "";
				return e > 65535 && (t += m((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t + m(e);
			}).join("");
		}
		function E(e) {
			return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : c;
		}
		function x(e, t) {
			return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
		}
		function _(e, t, r) {
			var n = 0;
			for (e = r ? d(e / 700) : e >> 1, e += d(e / t); e > 455; n += c) e = d(e / 35);
			return d(n + 36 * e / (e + 38));
		}
		function S(e) {
			var t, r, n, o, i, s, a, l, f, h = [], p = e.length, m = 0, g = 128, b = 72, w = e.lastIndexOf("-");
			for (w < 0 && (w = 0), r = 0; r < w; ++r) e.charCodeAt(r) >= 128 && y("not-basic"), h.push(e.charCodeAt(r));
			for (n = w > 0 ? w + 1 : 0; n < p;) {
				for (o = m, i = 1, s = c; n >= p && y("invalid-input"), ((a = E(e.charCodeAt(n++))) >= c || a > d((u - m) / i)) && y("overflow"), m += a * i, !(a < (l = s <= b ? 1 : s >= b + 26 ? 26 : s - b)); s += c) i > d(u / (f = c - l)) && y("overflow"), i *= f;
				b = _(m - o, t = h.length + 1, 0 == o), d(m / t) > u - g && y("overflow"), g += d(m / t), m %= t, h.splice(m++, 0, g);
			}
			return O(h);
		}
		function v(e) {
			var t, r, n, o, i, s, a, l, f, h, p, g, b, O, E, S = [];
			for (g = (e = w(e)).length, t = 128, r = 0, i = 72, s = 0; s < g; ++s) (p = e[s]) < 128 && S.push(m(p));
			for (n = o = S.length, o && S.push("-"); n < g;) {
				for (a = u, s = 0; s < g; ++s) (p = e[s]) >= t && p < a && (a = p);
				for (a - t > d((u - r) / (b = n + 1)) && y("overflow"), r += (a - t) * b, t = a, s = 0; s < g; ++s) if ((p = e[s]) < t && ++r > u && y("overflow"), p == t) {
					for (l = r, f = c; !(l < (h = f <= i ? 1 : f >= i + 26 ? 26 : f - i)); f += c) E = l - h, O = c - h, S.push(m(x(h + E % O, 0))), l = d(E / O);
					S.push(m(x(l, 0))), i = _(r, b, n == o), r = 0, ++n;
				}
				++r, ++t;
			}
			return S.join("");
		}
		if (s = {
			version: "1.3.2",
			ucs2: {
				decode: w,
				encode: O
			},
			decode: S,
			encode: v,
			toASCII: function(e) {
				return b(e, function(e) {
					return f.test(e) ? "xn--" + v(e) : e;
				});
			},
			toUnicode: function(e) {
				return b(e, function(e) {
					return l.test(e) ? S(e.slice(4).toLowerCase()) : e;
				});
			}
		}, "function" == typeof define && "object" == typeof define.amd && define.amd) define("punycode", function() {
			return s;
		});
		else if (n && o) if (t.exports == n) o.exports = s;
		else for (a in s) s.hasOwnProperty(a) && (n[a] = s[a]);
		else r.punycode = s;
	})(e);
}), rt = s((e, t) => {
	/*!
	* URI.js - Mutating URLs
	* IPv6 Support
	*
	* Version: 1.19.11
	*
	* Author: Rodney Rehm
	* Web: http://medialize.github.io/URI.js/
	*
	* Licensed under
	*   MIT License http://www.opensource.org/licenses/mit-license
	*
	*/
	var r = e, n = function(e) {
		var t = e && e.IPv6;
		return {
			best: function(e) {
				var t, r, n = e.toLowerCase().split(":"), o = n.length, i = 8;
				for ("" === n[0] && "" === n[1] && "" === n[2] ? (n.shift(), n.shift()) : "" === n[0] && "" === n[1] ? n.shift() : "" === n[o - 1] && "" === n[o - 2] && n.pop(), -1 !== n[(o = n.length) - 1].indexOf(".") && (i = 7), t = 0; t < o && "" !== n[t]; t++);
				if (t < i) for (n.splice(t, 1, "0000"); n.length < i;) n.splice(t, 0, "0000");
				for (var s = 0; s < i; s++) {
					r = n[s].split("");
					for (var a = 0; a < 3 && "0" === r[0] && r.length > 1; a++) r.splice(0, 1);
					n[s] = r.join("");
				}
				var u = -1, c = 0, l = 0, f = -1, h = !1;
				for (s = 0; s < i; s++) h ? "0" === n[s] ? l += 1 : (h = !1, l > c && (u = f, c = l)) : "0" === n[s] && (h = !0, f = s, l = 1);
				l > c && (u = f, c = l), c > 1 && n.splice(u, c, ""), o = n.length;
				var p = "";
				for ("" === n[0] && (p = ":"), s = 0; s < o && (p += n[s], s !== o - 1); s++) p += ":";
				return "" === n[o - 1] && (p += ":"), p;
			},
			noConflict: function() {
				return e.IPv6 === this && (e.IPv6 = t), this;
			}
		};
	};
	"object" == typeof t && t.exports ? t.exports = n() : "function" == typeof define && define.amd ? define(n) : r.IPv6 = n(r);
}), nt = s((e, t) => {
	/*!
	* URI.js - Mutating URLs
	* Second Level Domain (SLD) Support
	*
	* Version: 1.19.11
	*
	* Author: Rodney Rehm
	* Web: http://medialize.github.io/URI.js/
	*
	* Licensed under
	*   MIT License http://www.opensource.org/licenses/mit-license
	*
	*/
	var r = e, n = function(e) {
		var t = e && e.SecondLevelDomains, r = {
			list: {
				ac: " com gov mil net org ",
				ae: " ac co gov mil name net org pro sch ",
				af: " com edu gov net org ",
				al: " com edu gov mil net org ",
				ao: " co ed gv it og pb ",
				ar: " com edu gob gov int mil net org tur ",
				at: " ac co gv or ",
				au: " asn com csiro edu gov id net org ",
				ba: " co com edu gov mil net org rs unbi unmo unsa untz unze ",
				bb: " biz co com edu gov info net org store tv ",
				bh: " biz cc com edu gov info net org ",
				bn: " com edu gov net org ",
				bo: " com edu gob gov int mil net org tv ",
				br: " adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ",
				bs: " com edu gov net org ",
				bz: " du et om ov rg ",
				ca: " ab bc mb nb nf nl ns nt nu on pe qc sk yk ",
				ck: " biz co edu gen gov info net org ",
				cn: " ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ",
				co: " com edu gov mil net nom org ",
				cr: " ac c co ed fi go or sa ",
				cy: " ac biz com ekloges gov ltd name net org parliament press pro tm ",
				do: " art com edu gob gov mil net org sld web ",
				dz: " art asso com edu gov net org pol ",
				ec: " com edu fin gov info med mil net org pro ",
				eg: " com edu eun gov mil name net org sci ",
				er: " com edu gov ind mil net org rochest w ",
				es: " com edu gob nom org ",
				et: " biz com edu gov info name net org ",
				fj: " ac biz com info mil name net org pro ",
				fk: " ac co gov net nom org ",
				fr: " asso com f gouv nom prd presse tm ",
				gg: " co net org ",
				gh: " com edu gov mil org ",
				gn: " ac com gov net org ",
				gr: " com edu gov mil net org ",
				gt: " com edu gob ind mil net org ",
				gu: " com edu gov net org ",
				hk: " com edu gov idv net org ",
				hu: " 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ",
				id: " ac co go mil net or sch web ",
				il: " ac co gov idf k12 muni net org ",
				in: " ac co edu ernet firm gen gov i ind mil net nic org res ",
				iq: " com edu gov i mil net org ",
				ir: " ac co dnssec gov i id net org sch ",
				it: " edu gov ",
				je: " co net org ",
				jo: " com edu gov mil name net org sch ",
				jp: " ac ad co ed go gr lg ne or ",
				ke: " ac co go info me mobi ne or sc ",
				kh: " com edu gov mil net org per ",
				ki: " biz com de edu gov info mob net org tel ",
				km: " asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ",
				kn: " edu gov net org ",
				kr: " ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ",
				kw: " com edu gov net org ",
				ky: " com edu gov net org ",
				kz: " com edu gov mil net org ",
				lb: " com edu gov net org ",
				lk: " assn com edu gov grp hotel int ltd net ngo org sch soc web ",
				lr: " com edu gov net org ",
				lv: " asn com conf edu gov id mil net org ",
				ly: " com edu gov id med net org plc sch ",
				ma: " ac co gov m net org press ",
				mc: " asso tm ",
				me: " ac co edu gov its net org priv ",
				mg: " com edu gov mil nom org prd tm ",
				mk: " com edu gov inf name net org pro ",
				ml: " com edu gov net org presse ",
				mn: " edu gov org ",
				mo: " com edu gov net org ",
				mt: " com edu gov net org ",
				mv: " aero biz com coop edu gov info int mil museum name net org pro ",
				mw: " ac co com coop edu gov int museum net org ",
				mx: " com edu gob net org ",
				my: " com edu gov mil name net org sch ",
				nf: " arts com firm info net other per rec store web ",
				ng: " biz com edu gov mil mobi name net org sch ",
				ni: " ac co com edu gob mil net nom org ",
				np: " com edu gov mil net org ",
				nr: " biz com edu gov info net org ",
				om: " ac biz co com edu gov med mil museum net org pro sch ",
				pe: " com edu gob mil net nom org sld ",
				ph: " com edu gov i mil net ngo org ",
				pk: " biz com edu fam gob gok gon gop gos gov net org web ",
				pl: " art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ",
				pr: " ac biz com edu est gov info isla name net org pro prof ",
				ps: " com edu gov net org plo sec ",
				pw: " belau co ed go ne or ",
				ro: " arts com firm info nom nt org rec store tm www ",
				rs: " ac co edu gov in org ",
				sb: " com edu gov net org ",
				sc: " com edu gov net org ",
				sh: " co com edu gov net nom org ",
				sl: " com edu gov net org ",
				st: " co com consulado edu embaixada gov mil net org principe saotome store ",
				sv: " com edu gob org red ",
				sz: " ac co org ",
				tr: " av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ",
				tt: " aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ",
				tw: " club com ebiz edu game gov idv mil net org ",
				mu: " ac co com gov net or org ",
				mz: " ac co edu gov org ",
				na: " co com ",
				nz: " ac co cri geek gen govt health iwi maori mil net org parliament school ",
				pa: " abo ac com edu gob ing med net nom org sld ",
				pt: " com edu gov int net nome org publ ",
				py: " com edu gov mil net org ",
				qa: " com edu gov mil net org ",
				re: " asso com nom ",
				ru: " ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ",
				rw: " ac co com edu gouv gov int mil net ",
				sa: " com edu gov med net org pub sch ",
				sd: " com edu gov info med net org tv ",
				se: " a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ",
				sg: " com edu gov idn net org per ",
				sn: " art com edu gouv org perso univ ",
				sy: " com edu gov mil net news org ",
				th: " ac co go in mi net or ",
				tj: " ac biz co com edu go gov info int mil name net nic org test web ",
				tn: " agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ",
				tz: " ac co go ne or ",
				ua: " biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ",
				ug: " ac co go ne or org sc ",
				uk: " ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ",
				us: " dni fed isa kids nsn ",
				uy: " com edu gub mil net org ",
				ve: " co com edu gob info mil net org web ",
				vi: " co com k12 net org ",
				vn: " ac biz com edu gov health info int name net org pro ",
				ye: " co com gov ltd me net org plc ",
				yu: " ac co edu gov org ",
				za: " ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ",
				zm: " ac co com edu gov net org sch ",
				com: "ar br cn de eu gb gr hu jpn kr no qc ru sa se uk us uy za ",
				net: "gb jp se uk ",
				org: "ae",
				de: "com "
			},
			has: function(e) {
				var t = e.lastIndexOf(".");
				if (t <= 0 || t >= e.length - 1) return !1;
				var n = e.lastIndexOf(".", t - 1);
				if (n <= 0 || n >= t - 1) return !1;
				var o = r.list[e.slice(t + 1)];
				return !!o && o.indexOf(" " + e.slice(n + 1, t) + " ") >= 0;
			},
			is: function(e) {
				var t = e.lastIndexOf(".");
				if (t <= 0 || t >= e.length - 1) return !1;
				if (e.lastIndexOf(".", t - 1) >= 0) return !1;
				var n = r.list[e.slice(t + 1)];
				return !!n && n.indexOf(" " + e.slice(0, t) + " ") >= 0;
			},
			get: function(e) {
				var t = e.lastIndexOf(".");
				if (t <= 0 || t >= e.length - 1) return null;
				var n = e.lastIndexOf(".", t - 1);
				if (n <= 0 || n >= t - 1) return null;
				var o = r.list[e.slice(t + 1)];
				return o ? o.indexOf(" " + e.slice(n + 1, t) + " ") < 0 ? null : e.slice(n + 1) : null;
			},
			noConflict: function() {
				return e.SecondLevelDomains === this && (e.SecondLevelDomains = t), this;
			}
		};
		return r;
	};
	"object" == typeof t && t.exports ? t.exports = n() : "function" == typeof define && define.amd ? define(n) : r.SecondLevelDomains = n(r);
}), ot = s((e, t) => {
	/*!
	* URI.js - Mutating URLs
	*
	* Version: 1.19.11
	*
	* Author: Rodney Rehm
	* Web: http://medialize.github.io/URI.js/
	*
	* Licensed under
	*   MIT License http://www.opensource.org/licenses/mit-license
	*
	*/
	var r = e, n = function(e, t, r, n) {
		var o = n && n.URI;
		function i(e, t) {
			var r = arguments.length >= 1;
			if (!(this instanceof i)) return r ? arguments.length >= 2 ? new i(e, t) : new i(e) : new i();
			if (void 0 === e) {
				if (r) throw new TypeError("undefined is not a valid argument for URI");
				e = "undefined" != typeof location ? location.href + "" : "";
			}
			if (null === e && r) throw new TypeError("null is not a valid argument for URI");
			return this.href(e), void 0 !== t ? this.absoluteTo(t) : this;
		}
		i.version = "1.19.11";
		var s = i.prototype, a = Object.prototype.hasOwnProperty;
		function u(e) {
			return e.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
		}
		function c(e) {
			return void 0 === e ? "Undefined" : String(Object.prototype.toString.call(e)).slice(8, -1);
		}
		function l(e) {
			return "Array" === c(e);
		}
		function f(e, t) {
			var r, n, o = {};
			if ("RegExp" === c(t)) o = null;
			else if (l(t)) for (r = 0, n = t.length; r < n; r++) o[t[r]] = !0;
			else o[t] = !0;
			for (r = 0, n = e.length; r < n; r++) (o && void 0 !== o[e[r]] || !o && t.test(e[r])) && (e.splice(r, 1), n--, r--);
			return e;
		}
		function h(e, t) {
			var r, n;
			if (l(t)) {
				for (r = 0, n = t.length; r < n; r++) if (!h(e, t[r])) return !1;
				return !0;
			}
			var o = c(t);
			for (r = 0, n = e.length; r < n; r++) if ("RegExp" === o) {
				if ("string" == typeof e[r] && e[r].match(t)) return !0;
			} else if (e[r] === t) return !0;
			return !1;
		}
		function p(e, t) {
			if (!l(e) || !l(t)) return !1;
			if (e.length !== t.length) return !1;
			e.sort(), t.sort();
			for (var r = 0, n = e.length; r < n; r++) if (e[r] !== t[r]) return !1;
			return !0;
		}
		function d(e) {
			return e.replace(/^\/+|\/+$/g, "");
		}
		function m(e) {
			return escape(e);
		}
		function y(e) {
			return encodeURIComponent(e).replace(/[!'()*]/g, m).replace(/\*/g, "%2A");
		}
		i._parts = function() {
			return {
				protocol: null,
				username: null,
				password: null,
				hostname: null,
				urn: null,
				port: null,
				path: null,
				query: null,
				fragment: null,
				preventInvalidHostname: i.preventInvalidHostname,
				duplicateQueryParameters: i.duplicateQueryParameters,
				escapeQuerySpace: i.escapeQuerySpace
			};
		}, i.preventInvalidHostname = !1, i.duplicateQueryParameters = !1, i.escapeQuerySpace = !0, i.protocol_expression = /^[a-z][a-z0-9.+-]*$/i, i.idn_expression = /[^a-z0-9\._-]/i, i.punycode_expression = /(xn--)/i, i.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, i.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/, i.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi, i.findUri = {
			start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
			end: /[\s\r\n]|$/,
			trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/,
			parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g
		}, i.leading_whitespace_expression = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/, i.ascii_tab_whitespace = /[\u0009\u000A\u000D]+/g, i.defaultPorts = {
			http: "80",
			https: "443",
			ftp: "21",
			gopher: "70",
			ws: "80",
			wss: "443"
		}, i.hostProtocols = ["http", "https"], i.invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/, i.domAttributes = {
			a: "href",
			blockquote: "cite",
			link: "href",
			base: "href",
			script: "src",
			form: "action",
			img: "src",
			area: "href",
			iframe: "src",
			embed: "src",
			source: "src",
			track: "src",
			input: "src",
			audio: "src",
			video: "src"
		}, i.getDomAttribute = function(e) {
			if (e && e.nodeName) {
				var t = e.nodeName.toLowerCase();
				if ("input" !== t || "image" === e.type) return i.domAttributes[t];
			}
		}, i.encode = y, i.decode = decodeURIComponent, i.iso8859 = function() {
			i.encode = escape, i.decode = unescape;
		}, i.unicode = function() {
			i.encode = y, i.decode = decodeURIComponent;
		}, i.characters = {
			pathname: {
				encode: {
					expression: /%(24|26|2B|2C|3B|3D|3A|40)/gi,
					map: {
						"%24": "$",
						"%26": "&",
						"%2B": "+",
						"%2C": ",",
						"%3B": ";",
						"%3D": "=",
						"%3A": ":",
						"%40": "@"
					}
				},
				decode: {
					expression: /[\/\?#]/g,
					map: {
						"/": "%2F",
						"?": "%3F",
						"#": "%23"
					}
				}
			},
			reserved: { encode: {
				expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/gi,
				map: {
					"%3A": ":",
					"%2F": "/",
					"%3F": "?",
					"%23": "#",
					"%5B": "[",
					"%5D": "]",
					"%40": "@",
					"%21": "!",
					"%24": "$",
					"%26": "&",
					"%27": "'",
					"%28": "(",
					"%29": ")",
					"%2A": "*",
					"%2B": "+",
					"%2C": ",",
					"%3B": ";",
					"%3D": "="
				}
			} },
			urnpath: {
				encode: {
					expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/gi,
					map: {
						"%21": "!",
						"%24": "$",
						"%27": "'",
						"%28": "(",
						"%29": ")",
						"%2A": "*",
						"%2B": "+",
						"%2C": ",",
						"%3B": ";",
						"%3D": "=",
						"%40": "@"
					}
				},
				decode: {
					expression: /[\/\?#:]/g,
					map: {
						"/": "%2F",
						"?": "%3F",
						"#": "%23",
						":": "%3A"
					}
				}
			}
		}, i.encodeQuery = function(e, t) {
			var r = i.encode(e + "");
			return void 0 === t && (t = i.escapeQuerySpace), t ? r.replace(/%20/g, "+") : r;
		}, i.decodeQuery = function(e, t) {
			e += "", void 0 === t && (t = i.escapeQuerySpace);
			try {
				return i.decode(t ? e.replace(/\+/g, "%20") : e);
			} catch (t) {
				return e;
			}
		};
		var g, b = {
			encode: "encode",
			decode: "decode"
		}, w = function(e, t) {
			return function(r) {
				try {
					return i[t](r + "").replace(i.characters[e][t].expression, function(r) {
						return i.characters[e][t].map[r];
					});
				} catch (e) {
					return r;
				}
			};
		};
		for (g in b) i[g + "PathSegment"] = w("pathname", b[g]), i[g + "UrnPathSegment"] = w("urnpath", b[g]);
		var O = function(e, t, r) {
			return function(n) {
				var o = r ? function(e) {
					return i[t](i[r](e));
				} : i[t];
				for (var s = (n + "").split(e), a = 0, u = s.length; a < u; a++) s[a] = o(s[a]);
				return s.join(e);
			};
		};
		function E(e) {
			return function(t, r) {
				return void 0 === t ? this._parts[e] || "" : (this._parts[e] = t || null, this.build(!r), this);
			};
		}
		function x(e, t) {
			return function(r, n) {
				return void 0 === r ? this._parts[e] || "" : (null !== r && (r += "").charAt(0) === t && (r = r.substring(1)), this._parts[e] = r, this.build(!n), this);
			};
		}
		i.decodePath = O("/", "decodePathSegment"), i.decodeUrnPath = O(":", "decodeUrnPathSegment"), i.recodePath = O("/", "encodePathSegment", "decode"), i.recodeUrnPath = O(":", "encodeUrnPathSegment", "decode"), i.encodeReserved = w("reserved", "encode"), i.parse = function(e, t) {
			var r;
			return t || (t = { preventInvalidHostname: i.preventInvalidHostname }), (r = (e = (e = e.replace(i.leading_whitespace_expression, "")).replace(i.ascii_tab_whitespace, "")).indexOf("#")) > -1 && (t.fragment = e.substring(r + 1) || null, e = e.substring(0, r)), (r = e.indexOf("?")) > -1 && (t.query = e.substring(r + 1) || null, e = e.substring(0, r)), "//" === (e = (e = e.replace(/^(https?|ftp|wss?)?:+[/\\]*/i, "$1://")).replace(/^[/\\]{2,}/i, "//")).substring(0, 2) ? (t.protocol = null, e = e.substring(2), e = i.parseAuthority(e, t)) : (r = e.indexOf(":")) > -1 && (t.protocol = e.substring(0, r) || null, t.protocol && !t.protocol.match(i.protocol_expression) ? t.protocol = void 0 : "//" === e.substring(r + 1, r + 3).replace(/\\/g, "/") ? (e = e.substring(r + 3), e = i.parseAuthority(e, t)) : (e = e.substring(r + 1), t.urn = !0)), t.path = e, t;
		}, i.parseHost = function(e, t) {
			e || (e = "");
			var r, n, o = (e = e.replace(/\\/g, "/")).indexOf("/");
			if (-1 === o && (o = e.length), "[" === e.charAt(0)) r = e.indexOf("]"), t.hostname = e.substring(1, r) || null, t.port = e.substring(r + 2, o) || null, "/" === t.port && (t.port = null);
			else {
				var s = e.indexOf(":"), a = e.indexOf("/"), u = e.indexOf(":", s + 1);
				-1 !== u && (-1 === a || u < a) ? (t.hostname = e.substring(0, o) || null, t.port = null) : (n = e.substring(0, o).split(":"), t.hostname = n[0] || null, t.port = n[1] || null);
			}
			return t.hostname && "/" !== e.substring(o).charAt(0) && (o++, e = "/" + e), t.preventInvalidHostname && i.ensureValidHostname(t.hostname, t.protocol), t.port && i.ensureValidPort(t.port), e.substring(o) || "/";
		}, i.parseAuthority = function(e, t) {
			return e = i.parseUserinfo(e, t), i.parseHost(e, t);
		}, i.parseUserinfo = function(e, t) {
			var r = e;
			-1 !== e.indexOf("\\") && (e = e.replace(/\\/g, "/"));
			var n, o = e.indexOf("/"), s = e.lastIndexOf("@", o > -1 ? o : e.length - 1);
			return s > -1 && (-1 === o || s < o) ? (n = e.substring(0, s).split(":"), t.username = n[0] ? i.decode(n[0]) : null, n.shift(), t.password = n[0] ? i.decode(n.join(":")) : null, e = r.substring(s + 1)) : (t.username = null, t.password = null), e;
		}, i.parseQuery = function(e, t) {
			if (!e) return {};
			if (!(e = e.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, ""))) return {};
			for (var r, n, o, s = {}, u = e.split("&"), c = u.length, l = 0; l < c; l++) r = u[l].split("="), n = i.decodeQuery(r.shift(), t), o = r.length ? i.decodeQuery(r.join("="), t) : null, "__proto__" !== n && (a.call(s, n) ? ("string" != typeof s[n] && null !== s[n] || (s[n] = [s[n]]), s[n].push(o)) : s[n] = o);
			return s;
		}, i.build = function(e) {
			var t = "", r = !1;
			return e.protocol && (t += e.protocol + ":"), e.urn || !t && !e.hostname || (t += "//", r = !0), t += i.buildAuthority(e) || "", "string" == typeof e.path && ("/" !== e.path.charAt(0) && r && (t += "/"), t += e.path), "string" == typeof e.query && e.query && (t += "?" + e.query), "string" == typeof e.fragment && e.fragment && (t += "#" + e.fragment), t;
		}, i.buildHost = function(e) {
			var t = "";
			return e.hostname ? (i.ip6_expression.test(e.hostname) ? t += "[" + e.hostname + "]" : t += e.hostname, e.port && (t += ":" + e.port), t) : "";
		}, i.buildAuthority = function(e) {
			return i.buildUserinfo(e) + i.buildHost(e);
		}, i.buildUserinfo = function(e) {
			var t = "";
			return e.username && (t += i.encode(e.username)), e.password && (t += ":" + i.encode(e.password)), t && (t += "@"), t;
		}, i.buildQuery = function(e, t, r) {
			var n, o, s, u, c = "";
			for (o in e) if ("__proto__" !== o && a.call(e, o)) if (l(e[o])) for (n = {}, s = 0, u = e[o].length; s < u; s++) void 0 !== e[o][s] && void 0 === n[e[o][s] + ""] && (c += "&" + i.buildQueryParameter(o, e[o][s], r), !0 !== t && (n[e[o][s] + ""] = !0));
			else void 0 !== e[o] && (c += "&" + i.buildQueryParameter(o, e[o], r));
			return c.substring(1);
		}, i.buildQueryParameter = function(e, t, r) {
			return i.encodeQuery(e, r) + (null !== t ? "=" + i.encodeQuery(t, r) : "");
		}, i.addQuery = function(e, t, r) {
			if ("object" == typeof t) for (var n in t) a.call(t, n) && i.addQuery(e, n, t[n]);
			else {
				if ("string" != typeof t) throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
				if (void 0 === e[t]) return void (e[t] = r);
				"string" == typeof e[t] && (e[t] = [e[t]]), l(r) || (r = [r]), e[t] = (e[t] || []).concat(r);
			}
		}, i.setQuery = function(e, t, r) {
			if ("object" == typeof t) for (var n in t) a.call(t, n) && i.setQuery(e, n, t[n]);
			else {
				if ("string" != typeof t) throw new TypeError("URI.setQuery() accepts an object, string as the name parameter");
				e[t] = void 0 === r ? null : r;
			}
		}, i.removeQuery = function(e, t, r) {
			var n, o, s;
			if (l(t)) for (n = 0, o = t.length; n < o; n++) e[t[n]] = void 0;
			else if ("RegExp" === c(t)) for (s in e) t.test(s) && (e[s] = void 0);
			else if ("object" == typeof t) for (s in t) a.call(t, s) && i.removeQuery(e, s, t[s]);
			else {
				if ("string" != typeof t) throw new TypeError("URI.removeQuery() accepts an object, string, RegExp as the first parameter");
				void 0 !== r ? "RegExp" === c(r) ? !l(e[t]) && r.test(e[t]) ? e[t] = void 0 : e[t] = f(e[t], r) : e[t] !== String(r) || l(r) && 1 !== r.length ? l(e[t]) && (e[t] = f(e[t], r)) : e[t] = void 0 : e[t] = void 0;
			}
		}, i.hasQuery = function(e, t, r, n) {
			switch (c(t)) {
				case "String": break;
				case "RegExp":
					for (var o in e) if (a.call(e, o) && t.test(o) && (void 0 === r || i.hasQuery(e, o, r))) return !0;
					return !1;
				case "Object":
					for (var s in t) if (a.call(t, s) && !i.hasQuery(e, s, t[s])) return !1;
					return !0;
				default: throw new TypeError("URI.hasQuery() accepts a string, regular expression or object as the name parameter");
			}
			switch (c(r)) {
				case "Undefined": return t in e;
				case "Boolean": return r === Boolean(l(e[t]) ? e[t].length : e[t]);
				case "Function": return !!r(e[t], t, e);
				case "Array": return !!l(e[t]) && (n ? h : p)(e[t], r);
				case "RegExp": return l(e[t]) ? !!n && h(e[t], r) : Boolean(e[t] && e[t].match(r));
				case "Number": r = String(r);
				case "String": return l(e[t]) ? !!n && h(e[t], r) : e[t] === r;
				default: throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");
			}
		}, i.joinPaths = function() {
			for (var e = [], t = [], r = 0, n = 0; n < arguments.length; n++) {
				var o = new i(arguments[n]);
				e.push(o);
				for (var s = o.segment(), a = 0; a < s.length; a++) "string" == typeof s[a] && t.push(s[a]), s[a] && r++;
			}
			if (!t.length || !r) return new i("");
			var u = new i("").segment(t);
			return "" !== e[0].path() && "/" !== e[0].path().slice(0, 1) || u.path("/" + u.path()), u.normalize();
		}, i.commonPath = function(e, t) {
			var r, n = Math.min(e.length, t.length);
			for (r = 0; r < n; r++) if (e.charAt(r) !== t.charAt(r)) {
				r--;
				break;
			}
			return r < 1 ? e.charAt(0) === t.charAt(0) && "/" === e.charAt(0) ? "/" : "" : ("/" === e.charAt(r) && "/" === t.charAt(r) || (r = e.substring(0, r).lastIndexOf("/")), e.substring(0, r + 1));
		}, i.withinString = function(e, t, r) {
			r || (r = {});
			var n = r.start || i.findUri.start, o = r.end || i.findUri.end, s = r.trim || i.findUri.trim, a = r.parens || i.findUri.parens, u = /[a-z0-9-]=["']?$/i;
			for (n.lastIndex = 0;;) {
				var c = n.exec(e);
				if (!c) break;
				var l = c.index;
				if (r.ignoreHtml) {
					var f = e.slice(Math.max(l - 3, 0), l);
					if (f && u.test(f)) continue;
				}
				for (var h = l + e.slice(l).search(o), p = e.slice(l, h), d = -1;;) {
					var m = a.exec(p);
					if (!m) break;
					var y = m.index + m[0].length;
					d = Math.max(d, y);
				}
				if (!((p = d > -1 ? p.slice(0, d) + p.slice(d).replace(s, "") : p.replace(s, "")).length <= c[0].length || r.ignore && r.ignore.test(p))) {
					var g = t(p, l, h = l + p.length, e);
					void 0 !== g ? (g = String(g), e = e.slice(0, l) + g + e.slice(h), n.lastIndex = l + g.length) : n.lastIndex = h;
				}
			}
			return n.lastIndex = 0, e;
		}, i.ensureValidHostname = function(t, r) {
			var n = !!t, o = !1;
			if (r && (o = h(i.hostProtocols, r)), o && !n) throw new TypeError("Hostname cannot be empty, if protocol is " + r);
			if (t && t.match(i.invalid_hostname_characters)) {
				if (!e) throw new TypeError("Hostname \"" + t + "\" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available");
				if (e.toASCII(t).match(i.invalid_hostname_characters)) throw new TypeError("Hostname \"" + t + "\" contains characters other than [A-Z0-9.-:_]");
			}
		}, i.ensureValidPort = function(e) {
			if (e) {
				var t = Number(e);
				if (!(/^[0-9]+$/.test(t) && t > 0 && t < 65536)) throw new TypeError("Port \"" + e + "\" is not a valid port");
			}
		}, i.noConflict = function(e) {
			if (e) {
				var t = { URI: this.noConflict() };
				return n.URITemplate && "function" == typeof n.URITemplate.noConflict && (t.URITemplate = n.URITemplate.noConflict()), n.IPv6 && "function" == typeof n.IPv6.noConflict && (t.IPv6 = n.IPv6.noConflict()), n.SecondLevelDomains && "function" == typeof n.SecondLevelDomains.noConflict && (t.SecondLevelDomains = n.SecondLevelDomains.noConflict()), t;
			}
			return n.URI === this && (n.URI = o), this;
		}, s.build = function(e) {
			return !0 === e ? this._deferred_build = !0 : (void 0 === e || this._deferred_build) && (this._string = i.build(this._parts), this._deferred_build = !1), this;
		}, s.clone = function() {
			return new i(this);
		}, s.valueOf = s.toString = function() {
			return this.build(!1)._string;
		}, s.protocol = E("protocol"), s.username = E("username"), s.password = E("password"), s.hostname = E("hostname"), s.port = E("port"), s.query = x("query", "?"), s.fragment = x("fragment", "#"), s.search = function(e, t) {
			var r = this.query(e, t);
			return "string" == typeof r && r.length ? "?" + r : r;
		}, s.hash = function(e, t) {
			var r = this.fragment(e, t);
			return "string" == typeof r && r.length ? "#" + r : r;
		}, s.pathname = function(e, t) {
			if (void 0 === e || !0 === e) {
				var r = this._parts.path || (this._parts.hostname ? "/" : "");
				return e ? (this._parts.urn ? i.decodeUrnPath : i.decodePath)(r) : r;
			}
			return this._parts.urn ? this._parts.path = e ? i.recodeUrnPath(e) : "" : this._parts.path = e ? i.recodePath(e) : "/", this.build(!t), this;
		}, s.path = s.pathname, s.href = function(e, t) {
			var r;
			if (void 0 === e) return this.toString();
			this._string = "", this._parts = i._parts();
			var n = e instanceof i, o = "object" == typeof e && (e.hostname || e.path || e.pathname);
			if (e.nodeName && (e = e[i.getDomAttribute(e)] || "", o = !1), !n && o && void 0 !== e.pathname && (e = e.toString()), "string" == typeof e || e instanceof String) this._parts = i.parse(String(e), this._parts);
			else {
				if (!n && !o) throw new TypeError("invalid input");
				var s = n ? e._parts : e;
				for (r in s) "query" !== r && a.call(this._parts, r) && (this._parts[r] = s[r]);
				s.query && this.query(s.query, !1);
			}
			return this.build(!t), this;
		}, s.is = function(e) {
			var t = !1, n = !1, o = !1, s = !1, a = !1, u = !1, c = !1, l = !this._parts.urn;
			switch (this._parts.hostname && (l = !1, n = i.ip4_expression.test(this._parts.hostname), o = i.ip6_expression.test(this._parts.hostname), a = (s = !(t = n || o)) && r && r.has(this._parts.hostname), u = s && i.idn_expression.test(this._parts.hostname), c = s && i.punycode_expression.test(this._parts.hostname)), e.toLowerCase()) {
				case "relative": return l;
				case "absolute": return !l;
				case "domain":
				case "name": return s;
				case "sld": return a;
				case "ip": return t;
				case "ip4":
				case "ipv4":
				case "inet4": return n;
				case "ip6":
				case "ipv6":
				case "inet6": return o;
				case "idn": return u;
				case "url": return !this._parts.urn;
				case "urn": return !!this._parts.urn;
				case "punycode": return c;
			}
			return null;
		};
		var _ = s.protocol, S = s.port, v = s.hostname;
		s.protocol = function(e, t) {
			if (e && !(e = e.replace(/:(\/\/)?$/, "")).match(i.protocol_expression)) throw new TypeError("Protocol \"" + e + "\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");
			return _.call(this, e, t);
		}, s.scheme = s.protocol, s.port = function(e, t) {
			return this._parts.urn ? void 0 === e ? "" : this : (void 0 !== e && (0 === e && (e = null), e && (":" === (e += "").charAt(0) && (e = e.substring(1)), i.ensureValidPort(e))), S.call(this, e, t));
		}, s.hostname = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 !== e) {
				var r = { preventInvalidHostname: this._parts.preventInvalidHostname };
				if ("/" !== i.parseHost(e, r)) throw new TypeError("Hostname \"" + e + "\" contains characters other than [A-Z0-9.-]");
				e = r.hostname, this._parts.preventInvalidHostname && i.ensureValidHostname(e, this._parts.protocol);
			}
			return v.call(this, e, t);
		}, s.origin = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e) {
				var r = this.protocol();
				return this.authority() ? (r ? r + "://" : "") + this.authority() : "";
			}
			var n = i(e);
			return this.protocol(n.protocol()).authority(n.authority()).build(!t), this;
		}, s.host = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e) return this._parts.hostname ? i.buildHost(this._parts) : "";
			if ("/" !== i.parseHost(e, this._parts)) throw new TypeError("Hostname \"" + e + "\" contains characters other than [A-Z0-9.-]");
			return this.build(!t), this;
		}, s.authority = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e) return this._parts.hostname ? i.buildAuthority(this._parts) : "";
			if ("/" !== i.parseAuthority(e, this._parts)) throw new TypeError("Hostname \"" + e + "\" contains characters other than [A-Z0-9.-]");
			return this.build(!t), this;
		}, s.userinfo = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e) {
				var r = i.buildUserinfo(this._parts);
				return r ? r.substring(0, r.length - 1) : r;
			}
			return "@" !== e[e.length - 1] && (e += "@"), i.parseUserinfo(e, this._parts), this.build(!t), this;
		}, s.resource = function(e, t) {
			var r;
			return void 0 === e ? this.path() + this.search() + this.hash() : (r = i.parse(e), this._parts.path = r.path, this._parts.query = r.query, this._parts.fragment = r.fragment, this.build(!t), this);
		}, s.subdomain = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e) {
				if (!this._parts.hostname || this.is("IP")) return "";
				var r = this._parts.hostname.length - this.domain().length - 1;
				return this._parts.hostname.substring(0, r) || "";
			}
			var n = this._parts.hostname.length - this.domain().length, o = this._parts.hostname.substring(0, n), s = new RegExp("^" + u(o));
			if (e && "." !== e.charAt(e.length - 1) && (e += "."), -1 !== e.indexOf(":")) throw new TypeError("Domains cannot contain colons");
			return e && i.ensureValidHostname(e, this._parts.protocol), this._parts.hostname = this._parts.hostname.replace(s, e), this.build(!t), this;
		}, s.domain = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if ("boolean" == typeof e && (t = e, e = void 0), void 0 === e) {
				if (!this._parts.hostname || this.is("IP")) return "";
				var r = this._parts.hostname.match(/\./g);
				if (r && r.length < 2) return this._parts.hostname;
				var n = this._parts.hostname.length - this.tld(t).length - 1;
				return n = this._parts.hostname.lastIndexOf(".", n - 1) + 1, this._parts.hostname.substring(n) || "";
			}
			if (!e) throw new TypeError("cannot set domain empty");
			if (-1 !== e.indexOf(":")) throw new TypeError("Domains cannot contain colons");
			if (i.ensureValidHostname(e, this._parts.protocol), !this._parts.hostname || this.is("IP")) this._parts.hostname = e;
			else {
				var o = new RegExp(u(this.domain()) + "$");
				this._parts.hostname = this._parts.hostname.replace(o, e);
			}
			return this.build(!t), this;
		}, s.tld = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if ("boolean" == typeof e && (t = e, e = void 0), void 0 === e) {
				if (!this._parts.hostname || this.is("IP")) return "";
				var n = this._parts.hostname.lastIndexOf("."), o = this._parts.hostname.substring(n + 1);
				return !0 !== t && r && r.list[o.toLowerCase()] && r.get(this._parts.hostname) || o;
			}
			var i;
			if (!e) throw new TypeError("cannot set TLD empty");
			if (e.match(/[^a-zA-Z0-9-]/)) {
				if (!r || !r.is(e)) throw new TypeError("TLD \"" + e + "\" contains characters other than [A-Z0-9]");
				i = new RegExp(u(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(i, e);
			} else {
				if (!this._parts.hostname || this.is("IP")) throw new ReferenceError("cannot set TLD on non-domain host");
				i = new RegExp(u(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(i, e);
			}
			return this.build(!t), this;
		}, s.directory = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e || !0 === e) {
				if (!this._parts.path && !this._parts.hostname) return "";
				if ("/" === this._parts.path) return "/";
				var r = this._parts.path.length - this.filename().length - 1, n = this._parts.path.substring(0, r) || (this._parts.hostname ? "/" : "");
				return e ? i.decodePath(n) : n;
			}
			var o = this._parts.path.length - this.filename().length, s = this._parts.path.substring(0, o), a = new RegExp("^" + u(s));
			return this.is("relative") || (e || (e = "/"), "/" !== e.charAt(0) && (e = "/" + e)), e && "/" !== e.charAt(e.length - 1) && (e += "/"), e = i.recodePath(e), this._parts.path = this._parts.path.replace(a, e), this.build(!t), this;
		}, s.filename = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if ("string" != typeof e) {
				if (!this._parts.path || "/" === this._parts.path) return "";
				var r = this._parts.path.lastIndexOf("/"), n = this._parts.path.substring(r + 1);
				return e ? i.decodePathSegment(n) : n;
			}
			var o = !1;
			"/" === e.charAt(0) && (e = e.substring(1)), e.match(/\.?\//) && (o = !0);
			var s = new RegExp(u(this.filename()) + "$");
			return e = i.recodePath(e), this._parts.path = this._parts.path.replace(s, e), o ? this.normalizePath(t) : this.build(!t), this;
		}, s.suffix = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e || !0 === e) {
				if (!this._parts.path || "/" === this._parts.path) return "";
				var r, n, o = this.filename(), s = o.lastIndexOf(".");
				return -1 === s ? "" : (r = o.substring(s + 1), n = /^[a-z0-9%]+$/i.test(r) ? r : "", e ? i.decodePathSegment(n) : n);
			}
			"." === e.charAt(0) && (e = e.substring(1));
			var a, c = this.suffix();
			if (c) a = e ? new RegExp(u(c) + "$") : new RegExp(u("." + c) + "$");
			else {
				if (!e) return this;
				this._parts.path += "." + i.recodePath(e);
			}
			return a && (e = i.recodePath(e), this._parts.path = this._parts.path.replace(a, e)), this.build(!t), this;
		}, s.segment = function(e, t, r) {
			var n = this._parts.urn ? ":" : "/", o = this.path(), i = "/" === o.substring(0, 1), s = o.split(n);
			if (void 0 !== e && "number" != typeof e && (r = t, t = e, e = void 0), void 0 !== e && "number" != typeof e) throw new Error("Bad segment \"" + e + "\", must be 0-based integer");
			if (i && s.shift(), e < 0 && (e = Math.max(s.length + e, 0)), void 0 === t) return void 0 === e ? s : s[e];
			if (null === e || void 0 === s[e]) if (l(t)) {
				s = [];
				for (var a = 0, u = t.length; a < u; a++) (t[a].length || s.length && s[s.length - 1].length) && (s.length && !s[s.length - 1].length && s.pop(), s.push(d(t[a])));
			} else (t || "string" == typeof t) && (t = d(t), "" === s[s.length - 1] ? s[s.length - 1] = t : s.push(t));
			else t ? s[e] = d(t) : s.splice(e, 1);
			return i && s.unshift(""), this.path(s.join(n), r);
		}, s.segmentCoded = function(e, t, r) {
			var n, o, s;
			if ("number" != typeof e && (r = t, t = e, e = void 0), void 0 === t) {
				if (l(n = this.segment(e, t, r))) for (o = 0, s = n.length; o < s; o++) n[o] = i.decode(n[o]);
				else n = void 0 !== n ? i.decode(n) : void 0;
				return n;
			}
			if (l(t)) for (o = 0, s = t.length; o < s; o++) t[o] = i.encode(t[o]);
			else t = "string" == typeof t || t instanceof String ? i.encode(t) : t;
			return this.segment(e, t, r);
		};
		var C = s.query;
		return s.query = function(e, t) {
			if (!0 === e) return i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			if ("function" == typeof e) {
				var r = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace), n = e.call(this, r);
				return this._parts.query = i.buildQuery(n || r, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), this.build(!t), this;
			}
			return void 0 !== e && "string" != typeof e ? (this._parts.query = i.buildQuery(e, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), this.build(!t), this) : C.call(this, e, t);
		}, s.setQuery = function(e, t, r) {
			var n = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			if ("string" == typeof e || e instanceof String) n[e] = void 0 !== t ? t : null;
			else {
				if ("object" != typeof e) throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
				for (var o in e) a.call(e, o) && (n[o] = e[o]);
			}
			return this._parts.query = i.buildQuery(n, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), "string" != typeof e && (r = t), this.build(!r), this;
		}, s.addQuery = function(e, t, r) {
			var n = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			return i.addQuery(n, e, void 0 === t ? null : t), this._parts.query = i.buildQuery(n, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), "string" != typeof e && (r = t), this.build(!r), this;
		}, s.removeQuery = function(e, t, r) {
			var n = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			return i.removeQuery(n, e, t), this._parts.query = i.buildQuery(n, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), "string" != typeof e && (r = t), this.build(!r), this;
		}, s.hasQuery = function(e, t, r) {
			var n = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			return i.hasQuery(n, e, t, r);
		}, s.setSearch = s.setQuery, s.addSearch = s.addQuery, s.removeSearch = s.removeQuery, s.hasSearch = s.hasQuery, s.normalize = function() {
			return this._parts.urn ? this.normalizeProtocol(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build() : this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build();
		}, s.normalizeProtocol = function(e) {
			return "string" == typeof this._parts.protocol && (this._parts.protocol = this._parts.protocol.toLowerCase(), this.build(!e)), this;
		}, s.normalizeHostname = function(r) {
			return this._parts.hostname && (this.is("IDN") && e ? this._parts.hostname = e.toASCII(this._parts.hostname) : this.is("IPv6") && t && (this._parts.hostname = t.best(this._parts.hostname)), this._parts.hostname = this._parts.hostname.toLowerCase(), this.build(!r)), this;
		}, s.normalizePort = function(e) {
			return "string" == typeof this._parts.protocol && this._parts.port === i.defaultPorts[this._parts.protocol] && (this._parts.port = null, this.build(!e)), this;
		}, s.normalizePath = function(e) {
			var t, r = this._parts.path;
			if (!r) return this;
			if (this._parts.urn) return this._parts.path = i.recodeUrnPath(this._parts.path), this.build(!e), this;
			if ("/" === this._parts.path) return this;
			var n, o, s = "";
			for ("/" !== (r = i.recodePath(r)).charAt(0) && (t = !0, r = "/" + r), "/.." !== r.slice(-3) && "/." !== r.slice(-2) || (r += "/"), r = r.replace(/(\/(\.\/)+)|(\/\.$)/g, "/").replace(/\/{2,}/g, "/"), t && (s = r.substring(1).match(/^(\.\.\/)+/) || "") && (s = s[0]); -1 !== (n = r.search(/\/\.\.(\/|$)/));) 0 !== n ? (-1 === (o = r.substring(0, n).lastIndexOf("/")) && (o = n), r = r.substring(0, o) + r.substring(n + 3)) : r = r.substring(3);
			return t && this.is("relative") && (r = s + r.substring(1)), this._parts.path = r, this.build(!e), this;
		}, s.normalizePathname = s.normalizePath, s.normalizeQuery = function(e) {
			return "string" == typeof this._parts.query && (this._parts.query.length ? this.query(i.parseQuery(this._parts.query, this._parts.escapeQuerySpace)) : this._parts.query = null, this.build(!e)), this;
		}, s.normalizeFragment = function(e) {
			return this._parts.fragment || (this._parts.fragment = null, this.build(!e)), this;
		}, s.normalizeSearch = s.normalizeQuery, s.normalizeHash = s.normalizeFragment, s.iso8859 = function() {
			var e = i.encode, t = i.decode;
			i.encode = escape, i.decode = decodeURIComponent;
			try {
				this.normalize();
			} finally {
				i.encode = e, i.decode = t;
			}
			return this;
		}, s.unicode = function() {
			var e = i.encode, t = i.decode;
			i.encode = y, i.decode = unescape;
			try {
				this.normalize();
			} finally {
				i.encode = e, i.decode = t;
			}
			return this;
		}, s.readable = function() {
			var t = this.clone();
			t.username("").password("").normalize();
			var r = "";
			if (t._parts.protocol && (r += t._parts.protocol + "://"), t._parts.hostname && (t.is("punycode") && e ? (r += e.toUnicode(t._parts.hostname), t._parts.port && (r += ":" + t._parts.port)) : r += t.host()), t._parts.hostname && t._parts.path && "/" !== t._parts.path.charAt(0) && (r += "/"), r += t.path(!0), t._parts.query) {
				for (var n = "", o = 0, s = t._parts.query.split("&"), a = s.length; o < a; o++) {
					var u = (s[o] || "").split("=");
					n += "&" + i.decodeQuery(u[0], this._parts.escapeQuerySpace).replace(/&/g, "%26"), void 0 !== u[1] && (n += "=" + i.decodeQuery(u[1], this._parts.escapeQuerySpace).replace(/&/g, "%26"));
				}
				r += "?" + n.substring(1);
			}
			return r + i.decodeQuery(t.hash(), !0);
		}, s.absoluteTo = function(e) {
			var t, r, n, o = this.clone(), s = [
				"protocol",
				"username",
				"password",
				"hostname",
				"port"
			];
			if (this._parts.urn) throw new Error("URNs do not have any generally defined hierarchical components");
			if (e instanceof i || (e = new i(e)), o._parts.protocol) return o;
			if (o._parts.protocol = e._parts.protocol, this._parts.hostname) return o;
			for (r = 0; n = s[r]; r++) o._parts[n] = e._parts[n];
			return o._parts.path ? (".." === o._parts.path.substring(-2) && (o._parts.path += "/"), "/" !== o.path().charAt(0) && (t = (t = e.directory()) || (0 === e.path().indexOf("/") ? "/" : ""), o._parts.path = (t ? t + "/" : "") + o._parts.path, o.normalizePath())) : (o._parts.path = e._parts.path, o._parts.query || (o._parts.query = e._parts.query)), o.build(), o;
		}, s.relativeTo = function(e) {
			var t, r, n, o, s, a = this.clone().normalize();
			if (a._parts.urn) throw new Error("URNs do not have any generally defined hierarchical components");
			if (e = new i(e).normalize(), t = a._parts, r = e._parts, o = a.path(), s = e.path(), "/" !== o.charAt(0)) throw new Error("URI is already relative");
			if ("/" !== s.charAt(0)) throw new Error("Cannot calculate a URI relative to another relative URI");
			if (t.protocol === r.protocol && (t.protocol = null), t.username !== r.username || t.password !== r.password) return a.build();
			if (null !== t.protocol || null !== t.username || null !== t.password) return a.build();
			if (t.hostname !== r.hostname || t.port !== r.port) return a.build();
			if (t.hostname = null, t.port = null, o === s) return t.path = "", a.build();
			if (!(n = i.commonPath(o, s))) return a.build();
			var u = r.path.substring(n.length).replace(/[^\/]*$/, "").replace(/.*?\//g, "../");
			return t.path = u + t.path.substring(n.length) || "./", a.build();
		}, s.equals = function(e) {
			var t, r, n, o, s, u = this.clone(), c = new i(e), f = {};
			if (u.normalize(), c.normalize(), u.toString() === c.toString()) return !0;
			if (n = u.query(), o = c.query(), u.query(""), c.query(""), u.toString() !== c.toString()) return !1;
			if (n.length !== o.length) return !1;
			for (s in t = i.parseQuery(n, this._parts.escapeQuerySpace), r = i.parseQuery(o, this._parts.escapeQuerySpace), t) if (a.call(t, s)) {
				if (l(t[s])) {
					if (!p(t[s], r[s])) return !1;
				} else if (t[s] !== r[s]) return !1;
				f[s] = !0;
			}
			for (s in r) if (a.call(r, s) && !f[s]) return !1;
			return !0;
		}, s.preventInvalidHostname = function(e) {
			return this._parts.preventInvalidHostname = !!e, this;
		}, s.duplicateQueryParameters = function(e) {
			return this._parts.duplicateQueryParameters = !!e, this;
		}, s.escapeQuerySpace = function(e) {
			return this._parts.escapeQuerySpace = !!e, this;
		}, i;
	};
	"object" == typeof t && t.exports ? t.exports = n(tt(), rt(), nt()) : "function" == typeof define && define.amd ? define([
		"./punycode",
		"./IPv6",
		"./SecondLevelDomains"
	], n) : r.URI = n(r.punycode, r.IPv6, r.SecondLevelDomains, r);
});
function it(e, t) {
	if (null === e || "object" != typeof e) return e;
	t = t ?? !1;
	const r = new e.constructor();
	for (const n in e) if (e.hasOwnProperty(n)) {
		let o = e[n];
		t && (o = it(o, t)), r[n] = o;
	}
	return r;
}
function st(e, t, r) {
	r = r ?? !1;
	const n = {}, o = T(e), i = T(t);
	let s, a, u;
	if (o) for (s in e) e.hasOwnProperty(s) && (a = e[s], i && r && "object" == typeof a && t.hasOwnProperty(s) ? (u = t[s], n[s] = "object" == typeof u ? st(a, u, r) : a) : n[s] = a);
	if (i) for (s in t) t.hasOwnProperty(s) && !n.hasOwnProperty(s) && (u = t[s], n[s] = u);
	return n;
}
function at() {
	let e, t;
	const r = new Promise(function(r, n) {
		e = r, t = n;
	});
	return {
		resolve: e,
		reject: t,
		promise: r
	};
}
var ut = a(ot(), 1);
function ct(e, t) {
	let r;
	return "undefined" != typeof document && (r = document), ct._implementation(e, t, r);
}
ct._implementation = function(e, t, r) {
	if (!T(e)) throw new R("relative uri is required.");
	if (!T(t)) {
		if (void 0 === r) return e;
		t = r.baseURI ?? r.location.href;
	}
	const n = new ut.default(e);
	return "" !== n.scheme() ? n.toString() : n.absoluteTo(t).toString();
};
const lt = {};
function ft(e, t, r) {
	T(t) || (t = e.width), T(r) || (r = e.height);
	let n = lt[t];
	T(n) || (n = {}, lt[t] = n);
	let o = n[r];
	if (!T(o)) {
		const e = document.createElement("canvas");
		e.width = t, e.height = r, o = e.getContext("2d", { willReadFrequently: !0 }), o.globalCompositeOperation = "copy", n[r] = o;
	}
	return o.drawImage(e, 0, 0, t, r), o.getImageData(0, 0, t, r).data;
}
const ht = /^blob:/i;
function pt(e) {
	return z.typeOf.string("uri", e), ht.test(e);
}
let dt;
const mt = /^data:/i;
function yt(e) {
	return z.typeOf.string("uri", e), mt.test(e);
}
const gt = {
	UNISSUED: 0,
	ISSUED: 1,
	ACTIVE: 2,
	RECEIVED: 3,
	CANCELLED: 4,
	FAILED: 5
};
Object.freeze(gt);
const bt = {
	TERRAIN: 0,
	IMAGERY: 1,
	TILES3D: 2,
	OTHER: 3
};
function wt(e) {
	const t = (e = e ?? A.EMPTY_OBJECT).throttleByServer ?? !1, r = e.throttle ?? !1;
	this.url = e.url, this.requestFunction = e.requestFunction, this.cancelFunction = e.cancelFunction, this.priorityFunction = e.priorityFunction, this.priority = e.priority ?? 0, this.throttle = r, this.throttleByServer = t, this.type = e.type ?? bt.OTHER, this.serverKey = e.serverKey, this.state = gt.UNISSUED, this.deferred = void 0, this.cancelled = !1;
}
function Ot(e, t, r) {
	this.statusCode = e, this.response = t, this.responseHeaders = r, "string" == typeof this.responseHeaders && (this.responseHeaders = function(e) {
		const t = {};
		if (!e) return t;
		const r = e.split("\r\n");
		for (let n = 0; n < r.length; ++n) {
			const e = r[n], o = e.indexOf(": ");
			o > 0 && (t[e.substring(0, o)] = e.substring(o + 2));
		}
		return t;
	}(this.responseHeaders));
}
function Et(e) {
	z.typeOf.object("options", e), z.defined("options.comparator", e.comparator), this._comparator = e.comparator, this._array = [], this._length = 0, this._maximumLength = void 0;
}
function xt(e, t, r) {
	const n = e[t];
	e[t] = e[r], e[r] = n;
}
function _t(e) {
	let t;
	this.name = "RuntimeError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
Object.freeze(bt), wt.prototype.cancel = function() {
	this.cancelled = !0;
}, wt.prototype.clone = function(e) {
	return T(e) ? (e.url = this.url, e.requestFunction = this.requestFunction, e.cancelFunction = this.cancelFunction, e.priorityFunction = this.priorityFunction, e.priority = this.priority, e.throttle = this.throttle, e.throttleByServer = this.throttleByServer, e.type = this.type, e.serverKey = this.serverKey, e.state = gt.UNISSUED, e.deferred = void 0, e.cancelled = !1, e) : new wt(this);
}, Ot.prototype.toString = function() {
	let e = "Request has failed.";
	return T(this.statusCode) && (e += ` Status Code: ${this.statusCode}`), e;
}, Object.defineProperties(Et.prototype, {
	length: { get: function() {
		return this._length;
	} },
	internalArray: { get: function() {
		return this._array;
	} },
	maximumLength: {
		get: function() {
			return this._maximumLength;
		},
		set: function(e) {
			z.typeOf.number.greaterThanOrEquals("maximumLength", e, 0);
			const t = this._length;
			if (e < t) {
				const r = this._array;
				for (let n = e; n < t; ++n) r[n] = void 0;
				this._length = e, r.length = e;
			}
			this._maximumLength = e;
		}
	},
	comparator: { get: function() {
		return this._comparator;
	} }
}), Et.prototype.reserve = function(e) {
	e = e ?? this._length, this._array.length = e;
}, Et.prototype.heapify = function(e) {
	e = e ?? 0;
	const t = this._length, r = this._comparator, n = this._array;
	let o = -1, i = !0;
	for (; i;) {
		const s = 2 * (e + 1), a = s - 1;
		o = a < t && r(n[a], n[e]) < 0 ? a : e, s < t && r(n[s], n[o]) < 0 && (o = s), o !== e ? (xt(n, o, e), e = o) : i = !1;
	}
}, Et.prototype.resort = function() {
	const e = this._length;
	for (let t = Math.ceil(e / 2); t >= 0; --t) this.heapify(t);
}, Et.prototype.insert = function(e) {
	z.defined("element", e);
	const t = this._array, r = this._comparator, n = this._maximumLength;
	let o, i = this._length++;
	for (i < t.length ? t[i] = e : t.push(e); 0 !== i;) {
		const e = Math.floor((i - 1) / 2);
		if (!(r(t[i], t[e]) < 0)) break;
		xt(t, i, e), i = e;
	}
	return T(n) && this._length > n && (o = t[n], this._length = n), o;
}, Et.prototype.pop = function(e) {
	if (e = e ?? 0, 0 === this._length) return;
	z.typeOf.number.lessThan("index", e, this._length);
	const t = this._array, r = t[e];
	return xt(t, e, --this._length), this.heapify(e), t[this._length] = void 0, r;
}, T(Object.create) && (_t.prototype = Object.create(Error.prototype), _t.prototype.constructor = _t), _t.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return T(this.stack) && (e += `\n${this.stack.toString()}`), e;
};
const St = {
	numberOfAttemptedRequests: 0,
	numberOfActiveRequests: 0,
	numberOfCancelledRequests: 0,
	numberOfCancelledActiveRequests: 0,
	numberOfFailedRequests: 0,
	numberOfActiveRequestsEver: 0,
	lastNumberOfActiveRequests: 0
};
let vt = 20;
const Ct = new Et({ comparator: function(e, t) {
	return e.priority - t.priority;
} });
Ct.maximumLength = vt, Ct.reserve(vt);
const jt = [];
let At = {};
const Tt = "undefined" != typeof document ? new ut.default(document.location.href) : new ut.default(), Rt = new M();
function zt() {}
function It(e) {
	T(e.priorityFunction) && (e.priority = e.priorityFunction());
}
function Mt(e) {
	return e.state === gt.UNISSUED && (e.state = gt.ISSUED, e.deferred = at()), e.deferred.promise;
}
function qt(e) {
	const t = Mt(e);
	return e.state = gt.ACTIVE, jt.push(e), ++St.numberOfActiveRequests, ++St.numberOfActiveRequestsEver, ++At[e.serverKey], e.requestFunction().then(function(e) {
		return function(t) {
			if (e.state === gt.CANCELLED) return;
			const r = e.deferred;
			--St.numberOfActiveRequests, --At[e.serverKey], Rt.raiseEvent(), e.state = gt.RECEIVED, e.deferred = void 0, r.resolve(t);
		};
	}(e)).catch(function(e) {
		return function(t) {
			e.state !== gt.CANCELLED && (++St.numberOfFailedRequests, --St.numberOfActiveRequests, --At[e.serverKey], Rt.raiseEvent(t), e.state = gt.FAILED, e.deferred.reject(t));
		};
	}(e)), t;
}
function Pt(e) {
	const t = e.state === gt.ACTIVE;
	if (e.state = gt.CANCELLED, ++St.numberOfCancelledRequests, T(e.deferred)) {
		const t = e.deferred;
		t.promise.catch(() => {}), e.deferred = void 0, t.reject(new _t(`Request cancelled: "${e.url}"`));
	}
	t && (--St.numberOfActiveRequests, --At[e.serverKey], ++St.numberOfCancelledActiveRequests), T(e.cancelFunction) && e.cancelFunction();
}
zt.maximumRequests = 50, zt.maximumRequestsPerServer = 18, zt.requestsByServer = {}, zt.throttleRequests = !0, zt.debugShowStatistics = !1, zt.requestCompletedEvent = Rt, Object.defineProperties(zt, {
	statistics: { get: function() {
		return St;
	} },
	priorityHeapLength: {
		get: function() {
			return vt;
		},
		set: function(e) {
			if (e < vt) for (; Ct.length > e;) Pt(Ct.pop());
			vt = e, Ct.maximumLength = e, Ct.reserve(e);
		}
	}
}), zt.serverHasOpenSlots = function(e, t) {
	t = t ?? 1;
	const r = zt.requestsByServer[e] ?? zt.maximumRequestsPerServer;
	return At[e] + t <= r;
}, zt.heapHasOpenSlots = function(e) {
	return Ct.length + e <= vt;
}, zt.update = function() {
	let e, t, r = 0;
	const n = jt.length;
	for (e = 0; e < n; ++e) t = jt[e], t.cancelled && Pt(t), t.state === gt.ACTIVE ? r > 0 && (jt[e - r] = t) : ++r;
	jt.length -= r;
	const o = Ct.internalArray, i = Ct.length;
	for (e = 0; e < i; ++e) It(o[e]);
	Ct.resort();
	const s = Math.max(zt.maximumRequests - jt.length, 0);
	let a = 0;
	for (; a < s && Ct.length > 0;) t = Ct.pop(), t.cancelled ? Pt(t) : !t.throttleByServer || zt.serverHasOpenSlots(t.serverKey) ? (qt(t), ++a) : Pt(t);
	zt.debugShowStatistics && (0 === St.numberOfActiveRequests && St.lastNumberOfActiveRequests > 0 && (St.numberOfAttemptedRequests > 0 && (console.log(`Number of attempted requests: ${St.numberOfAttemptedRequests}`), St.numberOfAttemptedRequests = 0), St.numberOfCancelledRequests > 0 && (console.log(`Number of cancelled requests: ${St.numberOfCancelledRequests}`), St.numberOfCancelledRequests = 0), St.numberOfCancelledActiveRequests > 0 && (console.log(`Number of cancelled active requests: ${St.numberOfCancelledActiveRequests}`), St.numberOfCancelledActiveRequests = 0), St.numberOfFailedRequests > 0 && (console.log(`Number of failed requests: ${St.numberOfFailedRequests}`), St.numberOfFailedRequests = 0)), St.lastNumberOfActiveRequests = St.numberOfActiveRequests);
}, zt.getServerKey = function(e) {
	z.typeOf.string("url", e);
	let t = new ut.default(e);
	"" === t.scheme() && (t = t.absoluteTo(Tt), t.normalize());
	let r = t.authority();
	return /:/.test(r) || (r = `${r}:${"https" === t.scheme() ? "443" : "80"}`), T(At[r]) || (At[r] = 0), r;
}, zt.request = function(e) {
	if (z.typeOf.object("request", e), z.typeOf.string("request.url", e.url), z.typeOf.func("request.requestFunction", e.requestFunction), yt(e.url) || pt(e.url)) return Rt.raiseEvent(), e.state = gt.RECEIVED, e.requestFunction();
	if (++St.numberOfAttemptedRequests, T(e.serverKey) || (e.serverKey = zt.getServerKey(e.url)), zt.throttleRequests && e.throttleByServer && !zt.serverHasOpenSlots(e.serverKey)) return;
	if (!zt.throttleRequests || !e.throttle) return qt(e);
	if (jt.length >= zt.maximumRequests) return;
	It(e);
	const t = Ct.insert(e);
	if (T(t)) {
		if (t === e) return;
		Pt(t);
	}
	return Mt(e);
}, zt.clearForSpecs = function() {
	for (; Ct.length > 0;) Pt(Ct.pop());
	const e = jt.length;
	for (let t = 0; t < e; ++t) Pt(jt[t]);
	jt.length = 0, At = {}, St.numberOfAttemptedRequests = 0, St.numberOfActiveRequests = 0, St.numberOfCancelledRequests = 0, St.numberOfCancelledActiveRequests = 0, St.numberOfFailedRequests = 0, St.numberOfActiveRequestsEver = 0, St.lastNumberOfActiveRequests = 0;
}, zt.numberOfActiveRequestsByServer = function(e) {
	return At[e];
}, zt.requestHeap = Ct;
const Nt = {};
let Dt = {};
Nt.add = function(e, t) {
	if (!T(e)) throw new R("host is required.");
	if (!T(t) || t <= 0) throw new R("port is required to be greater than 0.");
	const r = `${e.toLowerCase()}:${t}`;
	T(Dt[r]) || (Dt[r] = !0);
}, Nt.remove = function(e, t) {
	if (!T(e)) throw new R("host is required.");
	if (!T(t) || t <= 0) throw new R("port is required to be greater than 0.");
	const r = `${e.toLowerCase()}:${t}`;
	T(Dt[r]) && delete Dt[r];
}, Nt.contains = function(e) {
	if (!T(e)) throw new R("url is required.");
	const t = function(e) {
		const t = new ut.default(e);
		t.normalize();
		let r = t.authority();
		if (0 !== r.length) {
			if (t.authority(r), -1 !== r.indexOf("@") && (r = r.split("@")[1]), -1 === r.indexOf(":")) {
				let e = t.scheme();
				if (0 === e.length && (e = window.location.protocol, e = e.substring(0, e.length - 1)), "http" === e) r += ":80";
				else {
					if ("https" !== e) return;
					r += ":443";
				}
			}
			return r;
		}
	}(e);
	return !(!T(t) || !T(Dt[t]));
}, Nt.clear = function() {
	Dt = {};
};
const Ft = function() {
	try {
		const e = new XMLHttpRequest();
		return e.open("GET", "#", !0), e.responseType = "blob", "blob" === e.responseType;
	} catch (e) {
		return !1;
	}
}();
function Lt(e) {
	"string" == typeof (e = e ?? A.EMPTY_OBJECT) && (e = { url: e }), z.typeOf.string("options.url", e.url), this._url = void 0, this._templateValues = Ut(e.templateValues, {}), this._queryParameters = Ut(e.queryParameters, {}), this.headers = Ut(e.headers, {}), this.request = e.request ?? new wt(), this.proxy = e.proxy, this.retryCallback = e.retryCallback, this.retryAttempts = e.retryAttempts ?? 0, this._retryCount = 0, e.parseUrl ?? 1 ? this.parseUrl(e.url, !0, !0) : this._url = e.url, this._credits = e.credits;
}
function Ut(e, t) {
	return T(e) ? it(e) : t;
}
let kt;
function Bt(e, t, r) {
	if (!r) return st(e, t);
	const n = it(e, !0);
	for (const o in t) if (t.hasOwnProperty(o)) {
		let e = n[o];
		const r = t[o];
		T(e) ? (Array.isArray(e) || (e = n[o] = [e]), n[o] = e.concat(r)) : n[o] = Array.isArray(r) ? r.slice() : r;
	}
	return n;
}
function Wt(e, t, r) {
	const n = {};
	n[t] = r, e.setQueryParameters(n);
	const o = e.request, i = e.url;
	o.url = i, o.requestFunction = function() {
		const e = at();
		return window[r] = function(t) {
			e.resolve(t);
			try {
				delete window[r];
			} catch (e) {
				window[r] = void 0;
			}
		}, Lt._Implementations.loadAndExecuteScript(i, r, e), e.promise;
	};
	const s = zt.request(o);
	if (T(s)) return s.catch(function(n) {
		return o.state !== gt.FAILED ? Promise.reject(n) : e.retryOnError(n).then(function(i) {
			return i ? (o.state = gt.UNISSUED, o.deferred = void 0, Wt(e, t, r)) : Promise.reject(n);
		});
	});
}
function $t(e) {
	if (e.state === gt.ISSUED || e.state === gt.ACTIVE) throw new _t("The Resource is already being fetched.");
	e.state = gt.UNISSUED, e.deferred = void 0;
}
Lt.createIfNeeded = function(e) {
	return e instanceof Lt ? e.getDerivedResource({ request: e.request }) : "string" != typeof e ? e : new Lt({ url: e });
}, Lt.supportsImageBitmapOptions = function() {
	return T(kt) ? kt : "function" != typeof createImageBitmap ? (kt = Promise.resolve(!1), kt) : (kt = Lt.fetchBlob({ url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABGdBTUEAAE4g3rEiDgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAADElEQVQI12Ng6GAAAAEUAIngE3ZiAAAAAElFTkSuQmCC" }).then(function(e) {
		return Promise.all([createImageBitmap(e, {
			imageOrientation: "flipY",
			premultiplyAlpha: "none",
			colorSpaceConversion: "none"
		}), createImageBitmap(e)]);
	}).then(function(e) {
		const t = ft(e[0]), r = ft(e[1]);
		return t[1] !== r[1];
	}).catch(function() {
		return !1;
	}), kt);
}, Object.defineProperties(Lt, { isBlobSupported: { get: function() {
	return Ft;
} } }), Object.defineProperties(Lt.prototype, {
	queryParameters: { get: function() {
		return this._queryParameters;
	} },
	templateValues: { get: function() {
		return this._templateValues;
	} },
	url: {
		get: function() {
			return this.getUrlComponent(!0, !0);
		},
		set: function(e) {
			this.parseUrl(e, !1, !1);
		}
	},
	extension: { get: function() {
		return function(e) {
			if (!T(e)) throw new R("uri is required.");
			const t = new ut.default(e);
			t.normalize();
			let r = t.path(), n = r.lastIndexOf("/");
			return -1 !== n && (r = r.substr(n + 1)), n = r.lastIndexOf("."), r = -1 === n ? "" : r.substr(n + 1), r;
		}(this._url);
	} },
	isDataUri: { get: function() {
		return yt(this._url);
	} },
	isBlobUri: { get: function() {
		return pt(this._url);
	} },
	isCrossOriginUrl: { get: function() {
		return function(e) {
			T(dt) || (dt = document.createElement("a")), dt.href = window.location.href;
			const t = dt.host, r = dt.protocol;
			return dt.href = e, dt.href = dt.href, r !== dt.protocol || t !== dt.host;
		}(this._url);
	} },
	hasHeaders: { get: function() {
		return Object.keys(this.headers).length > 0;
	} },
	credits: { get: function() {
		return this._credits;
	} }
}), Lt.prototype.toString = function() {
	return this.getUrlComponent(!0, !0);
}, Lt.prototype.parseUrl = function(e, t, r, n) {
	let o = new ut.default(e);
	const i = 0 === (s = o.query()).length ? {} : -1 === s.indexOf("=") ? { [s]: void 0 } : function(e) {
		if (!T(e)) throw new R("queryString is required.");
		const t = {};
		if ("" === e) return t;
		const r = e.replace(/\+/g, "%20").split(/[&;]/);
		for (let n = 0, o = r.length; n < o; ++n) {
			const e = r[n].split("="), o = decodeURIComponent(e[0]);
			let i = e[1];
			i = T(i) ? decodeURIComponent(i) : "";
			const s = t[o];
			"string" == typeof s ? t[o] = [s, i] : Array.isArray(s) ? s.push(i) : t[o] = i;
		}
		return t;
	}(s);
	var s;
	this._queryParameters = t ? Bt(i, this.queryParameters, r) : i, o.search(""), o.fragment(""), T(n) && "" === o.scheme() && (o = o.absoluteTo(ct(n))), this._url = o.toString();
}, Lt.prototype.getUrlComponent = function(e, t) {
	if (this.isDataUri) return this._url;
	let r = this._url;
	e && (r = `${r}${function(e) {
		const t = Object.keys(e);
		return 0 === t.length ? "" : 1 !== t.length || T(e[t[0]]) ? `?${function(e) {
			if (!T(e)) throw new R("obj is required.");
			let t = "";
			for (const r in e) if (e.hasOwnProperty(r)) {
				const n = e[r], o = `${encodeURIComponent(r)}=`;
				if (Array.isArray(n)) for (let e = 0, r = n.length; e < r; ++e) t += `${o + encodeURIComponent(n[e])}&`;
				else t += `${o + encodeURIComponent(n)}&`;
			}
			return t = t.slice(0, -1), t;
		}(e)}` : `?${t[0]}`;
	}(this.queryParameters)}`), r = r.replace(/%7B/g, "{").replace(/%7D/g, "}");
	const n = this._templateValues;
	return Object.keys(n).length > 0 && (r = r.replace(/{(.*?)}/g, function(e, t) {
		const r = n[t];
		return T(r) ? encodeURIComponent(r) : e;
	})), t && T(this.proxy) && (r = this.proxy.getURL(r)), r;
}, Lt.prototype.setQueryParameters = function(e, t) {
	this._queryParameters = t ? Bt(this._queryParameters, e, !1) : Bt(e, this._queryParameters, !1);
}, Lt.prototype.appendQueryParameters = function(e) {
	this._queryParameters = Bt(e, this._queryParameters, !0);
}, Lt.prototype.setTemplateValues = function(e, t) {
	this._templateValues = t ? st(this._templateValues, e) : st(e, this._templateValues);
}, Lt.prototype.getDerivedResource = function(e) {
	const t = this.clone();
	if (t._retryCount = 0, T(e.url)) {
		const r = e.preserveQueryParameters ?? !1;
		t.parseUrl(e.url, !0, r, this._url);
	}
	return T(e.queryParameters) && (t._queryParameters = st(e.queryParameters, t.queryParameters)), T(e.templateValues) && (t._templateValues = st(e.templateValues, t.templateValues)), T(e.headers) && (t.headers = st(e.headers, t.headers)), T(e.proxy) && (t.proxy = e.proxy), T(e.request) && (t.request = e.request), T(e.retryCallback) && (t.retryCallback = e.retryCallback), T(e.retryAttempts) && (t.retryAttempts = e.retryAttempts), t;
}, Lt.prototype.retryOnError = function(e) {
	const t = this.retryCallback;
	if ("function" != typeof t || this._retryCount >= this.retryAttempts) return Promise.resolve(!1);
	const r = this;
	return Promise.resolve(t(this, e)).then(function(e) {
		return ++r._retryCount, e;
	});
}, Lt.prototype.clone = function(e) {
	return T(e) ? (e._url = this._url, e._queryParameters = it(this._queryParameters), e._templateValues = it(this._templateValues), e.headers = it(this.headers), e.proxy = this.proxy, e.retryCallback = this.retryCallback, e.retryAttempts = this.retryAttempts, e._retryCount = 0, e.request = this.request.clone(), e) : new Lt({
		url: this._url,
		queryParameters: this.queryParameters,
		templateValues: this.templateValues,
		headers: this.headers,
		proxy: this.proxy,
		retryCallback: this.retryCallback,
		retryAttempts: this.retryAttempts,
		request: this.request.clone(),
		parseUrl: !1,
		credits: T(this.credits) ? this.credits.slice() : void 0
	});
}, Lt.prototype.getBaseUri = function(e) {
	return function(e, t) {
		if (!T(e)) throw new R("uri is required.");
		let r = "";
		const n = e.lastIndexOf("/");
		return -1 !== n && (r = e.substring(0, n + 1)), t ? (0 !== (e = new ut.default(e)).query().length && (r += `?${e.query()}`), 0 !== e.fragment().length && (r += `#${e.fragment()}`), r) : r;
	}(this.getUrlComponent(e), e);
}, Lt.prototype.appendForwardSlash = function() {
	var e;
	this._url = (0 !== (e = this._url).length && "/" === e[e.length - 1] || (e = `${e}/`), e);
}, Lt.prototype.fetchArrayBuffer = function() {
	return this.fetch({ responseType: "arraybuffer" });
}, Lt.fetchArrayBuffer = function(e) {
	return new Lt(e).fetchArrayBuffer();
}, Lt.prototype.fetchBlob = function() {
	return this.fetch({ responseType: "blob" });
}, Lt.fetchBlob = function(e) {
	return new Lt(e).fetchBlob();
}, Lt.prototype.fetchImage = function(e) {
	const t = (e = e ?? A.EMPTY_OBJECT).preferImageBitmap ?? !1, r = e.preferBlob ?? !1, n = e.flipY ?? !1, o = e.skipColorSpaceConversion ?? !1;
	if ($t(this.request), !Ft || this.isDataUri || this.isBlobUri || !this.hasHeaders && !r) return this._fetchImage({
		resource: this,
		flipY: n,
		skipColorSpaceConversion: o,
		preferImageBitmap: t
	});
	const i = this.fetchBlob();
	if (!T(i)) return;
	let s, a, u, c;
	return Lt.supportsImageBitmapOptions().then(function(e) {
		return s = e, a = s && t, i;
	}).then(function(e) {
		if (T(e)) return c = e, a ? Lt.createImageBitmapFromBlob(e, {
			flipY: n,
			premultiplyAlpha: !1,
			skipColorSpaceConversion: o
		}) : (u = new Lt({ url: window.URL.createObjectURL(e) }), u._fetchImage({
			flipY: n,
			skipColorSpaceConversion: o,
			preferImageBitmap: !1
		}));
	}).then(function(e) {
		if (T(e)) return e.blob = c, a || window.URL.revokeObjectURL(u.url), e;
	}).catch(function(e) {
		return T(u) && window.URL.revokeObjectURL(u.url), e.blob = c, Promise.reject(e);
	});
}, Lt.prototype._fetchImage = function(e) {
	const t = this, r = e.flipY, n = e.skipColorSpaceConversion, o = e.preferImageBitmap, i = t.request;
	i.url = t.url, i.requestFunction = function() {
		let e = !1;
		t.isDataUri || t.isBlobUri || (e = t.isCrossOriginUrl);
		const s = at();
		return Lt._Implementations.createImage(i, e, s, r, n, o), s.promise;
	};
	const s = zt.request(i);
	if (T(s)) return s.catch(function(e) {
		return i.state !== gt.FAILED ? Promise.reject(e) : t.retryOnError(e).then(function(s) {
			return s ? (i.state = gt.UNISSUED, i.deferred = void 0, t._fetchImage({
				flipY: r,
				skipColorSpaceConversion: n,
				preferImageBitmap: o
			})) : Promise.reject(e);
		});
	});
}, Lt.fetchImage = function(e) {
	return new Lt(e).fetchImage({
		flipY: e.flipY,
		skipColorSpaceConversion: e.skipColorSpaceConversion,
		preferBlob: e.preferBlob,
		preferImageBitmap: e.preferImageBitmap
	});
}, Lt.prototype.fetchText = function() {
	return this.fetch({ responseType: "text" });
}, Lt.fetchText = function(e) {
	return new Lt(e).fetchText();
}, Lt.prototype.fetchJson = function() {
	const e = this.fetch({
		responseType: "text",
		headers: { Accept: "application/json,*/*;q=0.01" }
	});
	if (T(e)) return e.then(function(e) {
		if (T(e)) return JSON.parse(e);
	});
}, Lt.fetchJson = function(e) {
	return new Lt(e).fetchJson();
}, Lt.prototype.fetchXML = function() {
	return this.fetch({
		responseType: "document",
		overrideMimeType: "text/xml"
	});
}, Lt.fetchXML = function(e) {
	return new Lt(e).fetchXML();
}, Lt.prototype.fetchJsonp = function(e) {
	let t;
	e = e ?? "callback", $t(this.request);
	do
		t = `loadJsonp${D.nextRandomNumber().toString().substring(2, 8)}`;
	while (T(window[t]));
	return Wt(this, e, t);
}, Lt.fetchJsonp = function(e) {
	return new Lt(e).fetchJsonp(e.callbackParameterName);
}, Lt.prototype._makeRequest = function(e) {
	const t = this;
	$t(t.request);
	const r = t.request, n = t.url;
	r.url = n, r.requestFunction = function() {
		const o = e.responseType, i = st(e.headers, t.headers), s = e.overrideMimeType, a = e.method, u = e.data, c = at(), l = Lt._Implementations.loadWithXhr(n, o, a, u, i, c, s);
		return T(l) && T(l.abort) && (r.cancelFunction = function() {
			l.abort();
		}), c.promise;
	};
	const o = zt.request(r);
	if (T(o)) return o.then(function(e) {
		return r.cancelFunction = void 0, e;
	}).catch(function(n) {
		return r.cancelFunction = void 0, r.state !== gt.FAILED ? Promise.reject(n) : t.retryOnError(n).then(function(o) {
			return o ? (r.state = gt.UNISSUED, r.deferred = void 0, t.fetch(e)) : Promise.reject(n);
		});
	});
};
const Gt = /^data:(.*?)(;base64)?,(.*)$/;
function Ht(e, t) {
	const r = decodeURIComponent(t);
	return e ? atob(r) : r;
}
function Vt(e, t) {
	const r = Ht(e, t), n = new ArrayBuffer(r.length), o = new Uint8Array(n);
	for (let i = 0; i < r.length; i++) o[i] = r.charCodeAt(i);
	return n;
}
Lt.prototype.fetch = function(e) {
	return (e = Ut(e, {})).method = "GET", this._makeRequest(e);
}, Lt.fetch = function(e) {
	return new Lt(e).fetch({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Lt.prototype.delete = function(e) {
	return (e = Ut(e, {})).method = "DELETE", this._makeRequest(e);
}, Lt.delete = function(e) {
	return new Lt(e).delete({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType,
		data: e.data
	});
}, Lt.prototype.head = function(e) {
	return (e = Ut(e, {})).method = "HEAD", this._makeRequest(e);
}, Lt.head = function(e) {
	return new Lt(e).head({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Lt.prototype.options = function(e) {
	return (e = Ut(e, {})).method = "OPTIONS", this._makeRequest(e);
}, Lt.options = function(e) {
	return new Lt(e).options({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Lt.prototype.post = function(e, t) {
	return z.defined("data", e), (t = Ut(t, {})).method = "POST", t.data = e, this._makeRequest(t);
}, Lt.post = function(e) {
	return new Lt(e).post(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Lt.prototype.put = function(e, t) {
	return z.defined("data", e), (t = Ut(t, {})).method = "PUT", t.data = e, this._makeRequest(t);
}, Lt.put = function(e) {
	return new Lt(e).put(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Lt.prototype.patch = function(e, t) {
	return z.defined("data", e), (t = Ut(t, {})).method = "PATCH", t.data = e, this._makeRequest(t);
}, Lt.patch = function(e) {
	return new Lt(e).patch(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Lt._Implementations = {}, Lt._Implementations.loadImageElement = function(e, t, r) {
	const n = new Image();
	n.onload = function() {
		0 === n.naturalWidth && 0 === n.naturalHeight && 0 === n.width && 0 === n.height && (n.width = 300, n.height = 150), r.resolve(n);
	}, n.onerror = function(e) {
		r.reject(e);
	}, t && (Nt.contains(e) ? n.crossOrigin = "use-credentials" : n.crossOrigin = ""), n.src = e;
}, Lt._Implementations.createImage = function(e, t, r, n, o, i, s) {
	const a = e.url;
	Lt.supportsImageBitmapOptions().then(function(u) {
		if (!u || !i) return void Lt._Implementations.loadImageElement(a, t, r);
		const c = at(), l = Lt._Implementations.loadWithXhr(a, "blob", "GET", void 0, s, c, void 0, void 0, void 0);
		return T(l) && T(l.abort) && (e.cancelFunction = function() {
			l.abort();
		}), c.promise.then(function(e) {
			if (T(e)) return Lt.createImageBitmapFromBlob(e, {
				flipY: n,
				premultiplyAlpha: !1,
				skipColorSpaceConversion: o
			});
			r.reject(new _t(`Successfully retrieved ${a} but it contained no content.`));
		}).then(function(e) {
			r.resolve(e);
		});
	}).catch(function(e) {
		r.reject(e);
	});
}, Lt.createImageBitmapFromBlob = function(e, t) {
	return z.defined("options", t), z.typeOf.bool("options.flipY", t.flipY), z.typeOf.bool("options.premultiplyAlpha", t.premultiplyAlpha), z.typeOf.bool("options.skipColorSpaceConversion", t.skipColorSpaceConversion), createImageBitmap(e, {
		imageOrientation: t.flipY ? "flipY" : "none",
		premultiplyAlpha: t.premultiplyAlpha ? "premultiply" : "none",
		colorSpaceConversion: t.skipColorSpaceConversion ? "none" : "default"
	});
};
const Yt = "undefined" == typeof XMLHttpRequest;
function Qt(e) {
	e = e ?? A.EMPTY_OBJECT, this._dates = void 0, this._samples = void 0, this._dateColumn = -1, this._xPoleWanderRadiansColumn = -1, this._yPoleWanderRadiansColumn = -1, this._ut1MinusUtcSecondsColumn = -1, this._xCelestialPoleOffsetRadiansColumn = -1, this._yCelestialPoleOffsetRadiansColumn = -1, this._taiMinusUtcSecondsColumn = -1, this._columnCount = 0, this._lastIndex = -1, this._addNewLeapSeconds = e.addNewLeapSeconds ?? !0, T(e.data) ? Xt(this, e.data) : Xt(this, {
		columnNames: [
			"dateIso8601",
			"modifiedJulianDateUtc",
			"xPoleWanderRadians",
			"yPoleWanderRadians",
			"ut1MinusUtcSeconds",
			"lengthOfDayCorrectionSeconds",
			"xCelestialPoleOffsetRadians",
			"yCelestialPoleOffsetRadians",
			"taiMinusUtcSeconds"
		],
		samples: []
	});
}
function Zt(e, t) {
	return Je.compare(e.julianDate, t);
}
function Xt(e, t) {
	if (!T(t.columnNames)) throw new _t("Error in loaded EOP data: The columnNames property is required.");
	if (!T(t.samples)) throw new _t("Error in loaded EOP data: The samples property is required.");
	const r = t.columnNames.indexOf("modifiedJulianDateUtc"), n = t.columnNames.indexOf("xPoleWanderRadians"), o = t.columnNames.indexOf("yPoleWanderRadians"), i = t.columnNames.indexOf("ut1MinusUtcSeconds"), s = t.columnNames.indexOf("xCelestialPoleOffsetRadians"), a = t.columnNames.indexOf("yCelestialPoleOffsetRadians"), u = t.columnNames.indexOf("taiMinusUtcSeconds");
	if (r < 0 || n < 0 || o < 0 || i < 0 || s < 0 || a < 0 || u < 0) throw new _t("Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns");
	const c = e._samples = t.samples, l = e._dates = [];
	let f;
	e._dateColumn = r, e._xPoleWanderRadiansColumn = n, e._yPoleWanderRadiansColumn = o, e._ut1MinusUtcSecondsColumn = i, e._xCelestialPoleOffsetRadiansColumn = s, e._yCelestialPoleOffsetRadiansColumn = a, e._taiMinusUtcSecondsColumn = u, e._columnCount = t.columnNames.length, e._lastIndex = void 0;
	const h = e._addNewLeapSeconds;
	for (let p = 0, d = c.length; p < d; p += e._columnCount) {
		const e = c[p + r], t = c[p + u], n = new Je(e + Me.MODIFIED_JULIAN_DATE_DIFFERENCE, t, qe.TAI);
		if (l.push(n), h) {
			if (t !== f && T(f)) {
				const e = Je.leapSeconds, r = je(e, n, Zt);
				if (r < 0) {
					const o = new Ie(n, t);
					e.splice(~r, 0, o);
				}
			}
			f = t;
		}
	}
}
function Kt(e, t, r, n, o) {
	const i = r * n;
	o.xPoleWander = t[i + e._xPoleWanderRadiansColumn], o.yPoleWander = t[i + e._yPoleWanderRadiansColumn], o.xPoleOffset = t[i + e._xCelestialPoleOffsetRadiansColumn], o.yPoleOffset = t[i + e._yCelestialPoleOffsetRadiansColumn], o.ut1MinusUtc = t[i + e._ut1MinusUtcSecondsColumn];
}
function Jt(e, t, r) {
	return t + e * (r - t);
}
function er(e, t, r, n, o, i, s) {
	const a = e._columnCount;
	if (i > t.length - 1) return s.xPoleWander = 0, s.yPoleWander = 0, s.xPoleOffset = 0, s.yPoleOffset = 0, s.ut1MinusUtc = 0, s;
	const u = t[o], c = t[i];
	if (u.equals(c) || n.equals(u)) return Kt(e, r, o, a, s), s;
	if (n.equals(c)) return Kt(e, r, i, a, s), s;
	const l = Je.secondsDifference(n, u) / Je.secondsDifference(c, u), f = o * a, h = i * a;
	let p = r[f + e._ut1MinusUtcSecondsColumn], d = r[h + e._ut1MinusUtcSecondsColumn];
	const m = d - p;
	if (m > .5 || m < -.5) {
		const t = r[f + e._taiMinusUtcSecondsColumn], o = r[h + e._taiMinusUtcSecondsColumn];
		t !== o && (c.equals(n) ? p = d : d -= o - t);
	}
	return s.xPoleWander = Jt(l, r[f + e._xPoleWanderRadiansColumn], r[h + e._xPoleWanderRadiansColumn]), s.yPoleWander = Jt(l, r[f + e._yPoleWanderRadiansColumn], r[h + e._yPoleWanderRadiansColumn]), s.xPoleOffset = Jt(l, r[f + e._xCelestialPoleOffsetRadiansColumn], r[h + e._xCelestialPoleOffsetRadiansColumn]), s.yPoleOffset = Jt(l, r[f + e._yCelestialPoleOffsetRadiansColumn], r[h + e._yCelestialPoleOffsetRadiansColumn]), s.ut1MinusUtc = Jt(l, p, d), s;
}
function tr(e, t, r) {
	this.heading = e ?? 0, this.pitch = t ?? 0, this.roll = r ?? 0;
}
Lt._Implementations.loadWithXhr = function(e, t, r, n, o, i, s) {
	const a = Gt.exec(e);
	if (null !== a) return void i.resolve(function(e, t) {
		t = t ?? "";
		const r = e[1], n = !!e[2], o = e[3];
		let i, s;
		switch (t) {
			case "":
			case "text": return Ht(n, o);
			case "arraybuffer": return Vt(n, o);
			case "blob": return i = Vt(n, o), new Blob([i], { type: r });
			case "document": return s = new DOMParser(), s.parseFromString(Ht(n, o), r);
			case "json": return JSON.parse(Ht(n, o));
			default: throw new R(`Unhandled responseType: ${t}`);
		}
	}(a, t));
	if (Yt) return void function(e, t, r, n, o, i) {
		fetch(e, {
			method: r,
			headers: o
		}).then(async (e) => {
			if (!e.ok) {
				const t = {};
				e.headers.forEach((e, r) => {
					t[r] = e;
				}), i.reject(new Ot(e.status, e, t));
				return;
			}
			switch (t) {
				case "text":
					i.resolve(e.text());
					break;
				case "json":
					i.resolve(e.json());
					break;
				default: i.resolve(new Uint8Array(await e.arrayBuffer()).buffer);
			}
		}).catch(() => {
			i.reject(new Ot());
		});
	}(e, t, r, 0, o, i);
	const u = new XMLHttpRequest();
	if (Nt.contains(e) && (u.withCredentials = !0), u.open(r, e, !0), T(s) && T(u.overrideMimeType) && u.overrideMimeType(s), T(o)) for (const l in o) o.hasOwnProperty(l) && u.setRequestHeader(l, o[l]);
	T(t) && (u.responseType = t);
	let c = !1;
	return "string" == typeof e && (c = 0 === e.indexOf("file://") || "undefined" != typeof window && "file://" === window.location.origin), u.onload = function() {
		if ((u.status < 200 || u.status >= 300) && (!c || 0 !== u.status)) return void i.reject(new Ot(u.status, u.response, u.getAllResponseHeaders()));
		const e = u.response, n = u.responseType;
		if ("HEAD" === r || "OPTIONS" === r) {
			const e = u.getAllResponseHeaders().trim().split(/[\r\n]+/), t = {};
			e.forEach(function(e) {
				const r = e.split(": "), n = r.shift();
				t[n] = r.join(": ");
			}), i.resolve(t);
			return;
		}
		if (204 === u.status) i.resolve(void 0);
		else if (!T(e) || T(t) && n !== t) if ("json" === t && "string" == typeof e) try {
			i.resolve(JSON.parse(e));
		} catch (e) {
			i.reject(e);
		}
		else ("" === n || "document" === n) && T(u.responseXML) && u.responseXML.hasChildNodes() ? i.resolve(u.responseXML) : "" !== n && "text" !== n || !T(u.responseText) ? i.reject(new _t("Invalid XMLHttpRequest response type.")) : i.resolve(u.responseText);
		else i.resolve(e);
	}, u.onerror = function(e) {
		i.reject(new Ot());
	}, u.send(n), u;
}, Lt._Implementations.loadAndExecuteScript = function(e, t, r) {
	return function(e) {
		const t = document.createElement("script");
		return t.async = !0, t.src = e, new Promise((e, r) => {
			window.crossOriginIsolated && t.setAttribute("crossorigin", "anonymous");
			const n = document.getElementsByTagName("head")[0];
			t.onload = function() {
				t.onload = void 0, n.removeChild(t), e();
			}, t.onerror = function(e) {
				r(e);
			}, n.appendChild(t);
		});
	}(e).catch(function(e) {
		r.reject(e);
	});
}, Lt._DefaultImplementations = {}, Lt._DefaultImplementations.createImage = Lt._Implementations.createImage, Lt._DefaultImplementations.loadWithXhr = Lt._Implementations.loadWithXhr, Lt._DefaultImplementations.loadAndExecuteScript = Lt._Implementations.loadAndExecuteScript, Lt.DEFAULT = Object.freeze(new Lt({ url: "undefined" == typeof document ? "" : document.location.href.split("?")[0] })), Qt.fromUrl = async function(e, t) {
	z.defined("url", e), t = t ?? A.EMPTY_OBJECT;
	const r = Lt.createIfNeeded(e);
	let n;
	try {
		n = await r.fetchJson();
	} catch (e) {
		throw new _t(`An error occurred while retrieving the EOP data from the URL ${r.url}.`);
	}
	return new Qt({
		addNewLeapSeconds: t.addNewLeapSeconds,
		data: n
	});
}, Qt.NONE = Object.freeze({ compute: function(e, t) {
	return T(t) ? (t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0) : t = new Ae(0, 0, 0, 0, 0), t;
} }), Qt.prototype.compute = function(e, t) {
	if (!T(this._samples)) return;
	if (T(t) || (t = new Ae(0, 0, 0, 0, 0)), 0 === this._samples.length) return t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0, t;
	const r = this._dates, n = this._lastIndex;
	let o = 0, i = 0;
	if (T(n)) {
		const s = r[n], a = r[n + 1], u = Je.lessThanOrEquals(s, e), c = !T(a), l = c || Je.greaterThanOrEquals(a, e);
		if (u && l) return o = n, !c && a.equals(e) && ++o, i = o + 1, er(this, r, this._samples, e, o, i, t), t;
	}
	let s = je(r, e, Je.compare, this._dateColumn);
	return s >= 0 ? (s < r.length - 1 && r[s + 1].equals(e) && ++s, o = s, i = s) : (i = ~s, o = i - 1, o < 0 && (o = 0)), this._lastIndex = o, er(this, r, this._samples, e, o, i, t), t;
}, tr.fromQuaternion = function(e, t) {
	if (!T(e)) throw new R("quaternion is required");
	T(t) || (t = new tr());
	const r = 2 * (e.w * e.y - e.z * e.x), n = 1 - 2 * (e.x * e.x + e.y * e.y), o = 2 * (e.w * e.x + e.y * e.z), i = 1 - 2 * (e.y * e.y + e.z * e.z), s = 2 * (e.w * e.z + e.x * e.y);
	return t.heading = -Math.atan2(s, i), t.roll = Math.atan2(o, n), t.pitch = -D.asinClamped(r), t;
}, tr.fromDegrees = function(e, t, r, n) {
	if (!T(e)) throw new R("heading is required");
	if (!T(t)) throw new R("pitch is required");
	if (!T(r)) throw new R("roll is required");
	return T(n) || (n = new tr()), n.heading = e * D.RADIANS_PER_DEGREE, n.pitch = t * D.RADIANS_PER_DEGREE, n.roll = r * D.RADIANS_PER_DEGREE, n;
}, tr.clone = function(e, t) {
	if (T(e)) return T(t) ? (t.heading = e.heading, t.pitch = e.pitch, t.roll = e.roll, t) : new tr(e.heading, e.pitch, e.roll);
}, tr.equals = function(e, t) {
	return e === t || T(e) && T(t) && e.heading === t.heading && e.pitch === t.pitch && e.roll === t.roll;
}, tr.equalsEpsilon = function(e, t, r, n) {
	return e === t || T(e) && T(t) && D.equalsEpsilon(e.heading, t.heading, r, n) && D.equalsEpsilon(e.pitch, t.pitch, r, n) && D.equalsEpsilon(e.roll, t.roll, r, n);
}, tr.prototype.clone = function(e) {
	return tr.clone(this, e);
}, tr.prototype.equals = function(e) {
	return tr.equals(this, e);
}, tr.prototype.equalsEpsilon = function(e, t, r) {
	return tr.equalsEpsilon(this, e, t, r);
}, tr.prototype.toString = function() {
	return `(${this.heading}, ${this.pitch}, ${this.roll})`;
};
const rr = /((?:.*\/)|^)Cesium\.js(?:\?|\#|$)/;
let nr, or, ir;
function sr(e) {
	return "undefined" == typeof document ? e : (T(nr) || (nr = document.createElement("a")), nr.href = e, nr.href);
}
function ar() {
	if (T(or)) return or;
	let e;
	if (e = "undefined" != typeof CESIUM_BASE_URL ? CESIUM_BASE_URL : T(import.meta.url) ? ct(".", import.meta.url) : "object" == typeof define && T(define.amd) && !define.amd.toUrlUndefined && T(u.toUrl) ? ct("..", lr("Core/buildModuleUrl.js")) : function() {
		const e = document.getElementsByTagName("script");
		for (let t = 0, r = e.length; t < r; ++t) {
			const r = e[t].getAttribute("src"), n = rr.exec(r);
			if (null !== n) return n[1];
		}
	}(), !T(e)) throw new R("Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.");
	return or = new Lt({ url: sr(e) }), or.appendForwardSlash(), or;
}
function ur(e) {
	return sr(u.toUrl(`../${e}`));
}
function cr(e) {
	return ar().getDerivedResource({ url: e }).url;
}
function lr(e) {
	return T(ir) || (ir = "object" == typeof define && T(define.amd) && !define.amd.toUrlUndefined && T(u.toUrl) ? ur : cr), ir(e);
}
function fr(e, t, r) {
	this.x = e, this.y = t, this.s = r;
}
function hr(e) {
	e = e ?? A.EMPTY_OBJECT, this._xysFileUrlTemplate = Lt.createIfNeeded(e.xysFileUrlTemplate), this._interpolationOrder = e.interpolationOrder ?? 9, this._sampleZeroJulianEphemerisDate = e.sampleZeroJulianEphemerisDate ?? 2442396.5, this._sampleZeroDateTT = new Je(this._sampleZeroJulianEphemerisDate, 0, qe.TAI), this._stepSizeDays = e.stepSizeDays ?? 1, this._samplesPerXysFile = e.samplesPerXysFile ?? 1e3, this._totalSamples = e.totalSamples ?? 27426, this._samples = new Array(3 * this._totalSamples), this._chunkDownloadsInProgress = [];
	const t = this._interpolationOrder, r = this._denominators = new Array(t + 1), n = this._xTable = new Array(t + 1), o = Math.pow(this._stepSizeDays, t);
	for (let i = 0; i <= t; ++i) {
		r[i] = o, n[i] = i * this._stepSizeDays;
		for (let e = 0; e <= t; ++e) e !== i && (r[i] *= i - e);
		r[i] = 1 / r[i];
	}
	this._work = new Array(t + 1), this._coef = new Array(t + 1);
}
lr._cesiumScriptRegex = rr, lr._buildModuleUrlFromBaseUrl = cr, lr._clearBaseResource = function() {
	or = void 0;
}, lr.setBaseUrl = function(e) {
	or = Lt.DEFAULT.getDerivedResource({ url: e });
}, lr.getCesiumBaseUrl = ar;
const pr = new Je(0, 0, qe.TAI);
function dr(e, t, r) {
	const n = pr;
	return n.dayNumber = t, n.secondsOfDay = r, Je.daysDifference(n, e._sampleZeroDateTT);
}
function mr(e, t) {
	if (T(e._chunkDownloadsInProgress[t])) return e._chunkDownloadsInProgress[t];
	let r;
	const n = e._xysFileUrlTemplate;
	r = T(n) ? n.getDerivedResource({ templateValues: { 0: t } }) : new Lt({ url: lr(`Assets/IAU2006_XYS/IAU2006_XYS_${t}.json`) });
	const o = async function(e, t, r) {
		try {
			const n = await e.fetchJson();
			r._updateChunkData(t, n);
		} catch (e) {}
	}(r, t, e);
	return e._chunkDownloadsInProgress[t] = o, o;
}
hr.prototype.preload = function(e, t, r, n) {
	const o = dr(this, e, t), i = dr(this, r, n);
	let s = o / this._stepSizeDays - this._interpolationOrder / 2 | 0;
	s < 0 && (s = 0);
	let a = i / this._stepSizeDays - this._interpolationOrder / 2 | 0 + this._interpolationOrder;
	a >= this._totalSamples && (a = this._totalSamples - 1);
	const u = s / this._samplesPerXysFile | 0, c = a / this._samplesPerXysFile | 0, l = [];
	for (let f = u; f <= c; ++f) l.push(mr(this, f));
	return Promise.all(l);
}, hr.prototype.computeXysRadians = function(e, t, r) {
	const n = dr(this, e, t);
	if (n < 0) return;
	const o = n / this._stepSizeDays | 0;
	if (o >= this._totalSamples) return;
	const i = this._interpolationOrder;
	let s = o - (i / 2 | 0);
	s < 0 && (s = 0);
	let a = s + i;
	a >= this._totalSamples && (a = this._totalSamples - 1, s = a - i, s < 0 && (s = 0));
	let u = !1;
	const c = this._samples;
	if (T(c[3 * s]) || (mr(this, s / this._samplesPerXysFile | 0), u = !0), T(c[3 * a]) || (mr(this, a / this._samplesPerXysFile | 0), u = !0), u) return;
	T(r) ? (r.x = 0, r.y = 0, r.s = 0) : r = new fr(0, 0, 0);
	const l = n - s * this._stepSizeDays, f = this._work, h = this._denominators, p = this._coef, d = this._xTable;
	let m, y;
	for (m = 0; m <= i; ++m) f[m] = l - d[m];
	for (m = 0; m <= i; ++m) {
		for (p[m] = 1, y = 0; y <= i; ++y) y !== m && (p[m] *= f[y]);
		p[m] *= h[m];
		let e = 3 * (s + m);
		r.x += p[m] * c[e++], r.y += p[m] * c[e++], r.s += p[m] * c[e];
	}
	return r;
}, hr.prototype._updateChunkData = function(e, { samples: t }) {
	this._chunkDownloadsInProgress[e] = void 0;
	const r = e * this._samplesPerXysFile * 3;
	for (let n = 0; n < t.length; ++n) this._samples[r + n] = t[n];
};
var yr = class e {
	constructor(e, t, r, n, o, i, s, a, u) {
		this[0] = e ?? 0, this[1] = n ?? 0, this[2] = s ?? 0, this[3] = t ?? 0, this[4] = o ?? 0, this[5] = a ?? 0, this[6] = r ?? 0, this[7] = i ?? 0, this[8] = u ?? 0;
	}
	static pack(e, t, r) {
		return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t;
	}
	static unpack(t, r, n) {
		return z.defined("array", t), r = r ?? 0, T(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n[4] = t[r++], n[5] = t[r++], n[6] = t[r++], n[7] = t[r++], n[8] = t[r++], n;
	}
	static packArray(t, r) {
		z.defined("array", t);
		const n = t.length, o = 9 * n;
		if (T(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new R("If result is a typed array, it must have exactly array.length * 9 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 9 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (z.defined("array", t), z.typeOf.number.greaterThanOrEquals("array.length", t.length, 9), t.length % 9 != 0) throw new R("array length must be a multiple of 9.");
		const n = t.length;
		T(r) ? r.length = n / 9 : r = new Array(n / 9);
		for (let o = 0; o < n; o += 9) {
			const n = o / 9;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (T(t)) return T(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r[6] = t[6], r[7] = t[7], r[8] = t[8], r) : new e(t[0], t[3], t[6], t[1], t[4], t[7], t[2], t[5], t[8]);
	}
	static fromColumnMajorArray(t, r) {
		return z.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return z.defined("values", t), T(r) ? (r[0] = t[0], r[1] = t[3], r[2] = t[6], r[3] = t[1], r[4] = t[4], r[5] = t[7], r[6] = t[2], r[7] = t[5], r[8] = t[8], r) : new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
	}
	static fromQuaternion(t, r) {
		z.typeOf.object("quaternion", t);
		const n = t.x * t.x, o = t.x * t.y, i = t.x * t.z, s = t.x * t.w, a = t.y * t.y, u = t.y * t.z, c = t.y * t.w, l = t.z * t.z, f = t.z * t.w, h = t.w * t.w, p = n - a - l + h, d = 2 * (o - f), m = 2 * (i + c), y = 2 * (o + f), g = -n + a - l + h, b = 2 * (u - s), w = 2 * (i - c), O = 2 * (u + s), E = -n - a + l + h;
		return T(r) ? (r[0] = p, r[1] = y, r[2] = w, r[3] = d, r[4] = g, r[5] = O, r[6] = m, r[7] = b, r[8] = E, r) : new e(p, d, m, y, g, b, w, O, E);
	}
	static fromHeadingPitchRoll(t, r) {
		z.typeOf.object("headingPitchRoll", t);
		const n = Math.cos(-t.pitch), o = Math.cos(-t.heading), i = Math.cos(t.roll), s = Math.sin(-t.pitch), a = Math.sin(-t.heading), u = Math.sin(t.roll), c = n * o, l = -i * a + u * s * o, f = u * a + i * s * o, h = n * a, p = i * o + u * s * a, d = -u * o + i * s * a, m = -s, y = u * n, g = i * n;
		return T(r) ? (r[0] = c, r[1] = h, r[2] = m, r[3] = l, r[4] = p, r[5] = y, r[6] = f, r[7] = d, r[8] = g, r) : new e(c, l, f, h, p, d, m, y, g);
	}
	static fromScale(t, r) {
		return z.typeOf.object("scale", t), T(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = t.y, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = t.z, r) : new e(t.x, 0, 0, 0, t.y, 0, 0, 0, t.z);
	}
	static fromUniformScale(t, r) {
		return z.typeOf.number("scale", t), T(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = t, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = t, r) : new e(t, 0, 0, 0, t, 0, 0, 0, t);
	}
	static fromCrossProduct(t, r) {
		return z.typeOf.object("vector", t), T(r) ? (r[0] = 0, r[1] = t.z, r[2] = -t.y, r[3] = -t.z, r[4] = 0, r[5] = t.x, r[6] = t.y, r[7] = -t.x, r[8] = 0, r) : new e(0, -t.z, t.y, t.z, 0, -t.x, -t.y, t.x, 0);
	}
	static fromRotationX(t, r) {
		z.typeOf.number("angle", t);
		const n = Math.cos(t), o = Math.sin(t);
		return T(r) ? (r[0] = 1, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = n, r[5] = o, r[6] = 0, r[7] = -o, r[8] = n, r) : new e(1, 0, 0, 0, n, -o, 0, o, n);
	}
	static fromRotationY(t, r) {
		z.typeOf.number("angle", t);
		const n = Math.cos(t), o = Math.sin(t);
		return T(r) ? (r[0] = n, r[1] = 0, r[2] = -o, r[3] = 0, r[4] = 1, r[5] = 0, r[6] = o, r[7] = 0, r[8] = n, r) : new e(n, 0, o, 0, 1, 0, -o, 0, n);
	}
	static fromRotationZ(t, r) {
		z.typeOf.number("angle", t);
		const n = Math.cos(t), o = Math.sin(t);
		return T(r) ? (r[0] = n, r[1] = o, r[2] = 0, r[3] = -o, r[4] = n, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = 1, r) : new e(n, -o, 0, o, n, 0, 0, 0, 1);
	}
	static toArray(e, t) {
		return z.typeOf.object("matrix", e), T(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t) : [
			e[0],
			e[1],
			e[2],
			e[3],
			e[4],
			e[5],
			e[6],
			e[7],
			e[8]
		];
	}
	static getElementIndex(e, t) {
		return z.typeOf.number.greaterThanOrEquals("row", t, 0), z.typeOf.number.lessThanOrEquals("row", t, 2), z.typeOf.number.greaterThanOrEquals("column", e, 0), z.typeOf.number.lessThanOrEquals("column", e, 2), 3 * e + t;
	}
	static getColumn(e, t, r) {
		z.typeOf.object("matrix", e), z.typeOf.number.greaterThanOrEquals("index", t, 0), z.typeOf.number.lessThanOrEquals("index", t, 2), z.typeOf.object("result", r);
		const n = 3 * t, o = e[n], i = e[n + 1], s = e[n + 2];
		return r.x = o, r.y = i, r.z = s, r;
	}
	static setColumn(t, r, n, o) {
		z.typeOf.object("matrix", t), z.typeOf.number.greaterThanOrEquals("index", r, 0), z.typeOf.number.lessThanOrEquals("index", r, 2), z.typeOf.object("cartesian", n), z.typeOf.object("result", o);
		const i = 3 * r;
		return (o = e.clone(t, o))[i] = n.x, o[i + 1] = n.y, o[i + 2] = n.z, o;
	}
	static getRow(e, t, r) {
		z.typeOf.object("matrix", e), z.typeOf.number.greaterThanOrEquals("index", t, 0), z.typeOf.number.lessThanOrEquals("index", t, 2), z.typeOf.object("result", r);
		const n = e[t], o = e[t + 3], i = e[t + 6];
		return r.x = n, r.y = o, r.z = i, r;
	}
	static setRow(t, r, n, o) {
		return z.typeOf.object("matrix", t), z.typeOf.number.greaterThanOrEquals("index", r, 0), z.typeOf.number.lessThanOrEquals("index", r, 2), z.typeOf.object("cartesian", n), z.typeOf.object("result", o), (o = e.clone(t, o))[r] = n.x, o[r + 3] = n.y, o[r + 6] = n.z, o;
	}
	static setScale(t, r, n) {
		z.typeOf.object("matrix", t), z.typeOf.object("scale", r), z.typeOf.object("result", n);
		const o = e.getScale(t, gr), i = r.x / o.x, s = r.y / o.y, a = r.z / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3] * s, n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * a, n[7] = t[7] * a, n[8] = t[8] * a, n;
	}
	static setUniformScale(t, r, n) {
		z.typeOf.object("matrix", t), z.typeOf.number("scale", r), z.typeOf.object("result", n);
		const o = e.getScale(t, br), i = r / o.x, s = r / o.y, a = r / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3] * s, n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * a, n[7] = t[7] * a, n[8] = t[8] * a, n;
	}
	static getScale(e, t) {
		return z.typeOf.object("matrix", e), z.typeOf.object("result", t), t.x = H.magnitude(H.fromElements(e[0], e[1], e[2], wr)), t.y = H.magnitude(H.fromElements(e[3], e[4], e[5], wr)), t.z = H.magnitude(H.fromElements(e[6], e[7], e[8], wr)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, Or), H.maximumComponent(Or);
	}
	static setRotation(t, r, n) {
		z.typeOf.object("matrix", t), z.typeOf.object("result", n);
		const o = e.getScale(t, Er);
		return n[0] = r[0] * o.x, n[1] = r[1] * o.x, n[2] = r[2] * o.x, n[3] = r[3] * o.y, n[4] = r[4] * o.y, n[5] = r[5] * o.y, n[6] = r[6] * o.z, n[7] = r[7] * o.z, n[8] = r[8] * o.z, n;
	}
	static getRotation(t, r) {
		z.typeOf.object("matrix", t), z.typeOf.object("result", r);
		const n = e.getScale(t, xr);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.x, r[3] = t[3] / n.y, r[4] = t[4] / n.y, r[5] = t[5] / n.y, r[6] = t[6] / n.z, r[7] = t[7] / n.z, r[8] = t[8] / n.z, r;
	}
	static multiply(e, t, r) {
		z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r);
		const n = e[0] * t[0] + e[3] * t[1] + e[6] * t[2], o = e[1] * t[0] + e[4] * t[1] + e[7] * t[2], i = e[2] * t[0] + e[5] * t[1] + e[8] * t[2], s = e[0] * t[3] + e[3] * t[4] + e[6] * t[5], a = e[1] * t[3] + e[4] * t[4] + e[7] * t[5], u = e[2] * t[3] + e[5] * t[4] + e[8] * t[5], c = e[0] * t[6] + e[3] * t[7] + e[6] * t[8], l = e[1] * t[6] + e[4] * t[7] + e[7] * t[8], f = e[2] * t[6] + e[5] * t[7] + e[8] * t[8];
		return r[0] = n, r[1] = o, r[2] = i, r[3] = s, r[4] = a, r[5] = u, r[6] = c, r[7] = l, r[8] = f, r;
	}
	static add(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r[4] = e[4] + t[4], r[5] = e[5] + t[5], r[6] = e[6] + t[6], r[7] = e[7] + t[7], r[8] = e[8] + t[8], r;
	}
	static subtract(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r[4] = e[4] - t[4], r[5] = e[5] - t[5], r[6] = e[6] - t[6], r[7] = e[7] - t[7], r[8] = e[8] - t[8], r;
	}
	static multiplyByVector(e, t, r) {
		z.typeOf.object("matrix", e), z.typeOf.object("cartesian", t), z.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = e[0] * n + e[3] * o + e[6] * i, a = e[1] * n + e[4] * o + e[7] * i, u = e[2] * n + e[5] * o + e[8] * i;
		return r.x = s, r.y = a, r.z = u, r;
	}
	static multiplyByScalar(e, t, r) {
		return z.typeOf.object("matrix", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r;
	}
	static multiplyByScale(e, t, r) {
		return z.typeOf.object("matrix", e), z.typeOf.object("scale", t), z.typeOf.object("result", r), r[0] = e[0] * t.x, r[1] = e[1] * t.x, r[2] = e[2] * t.x, r[3] = e[3] * t.y, r[4] = e[4] * t.y, r[5] = e[5] * t.y, r[6] = e[6] * t.z, r[7] = e[7] * t.z, r[8] = e[8] * t.z, r;
	}
	static multiplyByUniformScale(e, t, r) {
		return z.typeOf.object("matrix", e), z.typeOf.number("scale", t), z.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r;
	}
	static negate(e, t) {
		return z.typeOf.object("matrix", e), z.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t;
	}
	static transpose(e, t) {
		z.typeOf.object("matrix", e), z.typeOf.object("result", t);
		const r = e[0], n = e[3], o = e[6], i = e[1], s = e[4], a = e[7], u = e[2], c = e[5], l = e[8];
		return t[0] = r, t[1] = n, t[2] = o, t[3] = i, t[4] = s, t[5] = a, t[6] = u, t[7] = c, t[8] = l, t;
	}
	static computeEigenDecomposition(t, r) {
		z.typeOf.object("matrix", t);
		const n = D.EPSILON20;
		let o = 0, i = 0;
		T(r) || (r = {});
		const s = r.unitary = e.clone(e.IDENTITY, r.unitary), a = r.diagonal = e.clone(t, r.diagonal), u = n * function(e) {
			let t = 0;
			for (let r = 0; r < 9; ++r) {
				const n = e[r];
				t += n * n;
			}
			return Math.sqrt(t);
		}(a);
		for (; i < 10 && Ar(a) > u;) Tr(a, _r), e.transpose(_r, Sr), e.multiply(a, _r, a), e.multiply(Sr, a, a), e.multiply(s, _r, s), ++o > 2 && (++i, o = 0);
		return r;
	}
	static abs(e, t) {
		return z.typeOf.object("matrix", e), z.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t;
	}
	static determinant(e) {
		z.typeOf.object("matrix", e);
		const t = e[0], r = e[3], n = e[6], o = e[1], i = e[4], s = e[7], a = e[2], u = e[5], c = e[8];
		return t * (i * c - u * s) + o * (u * n - r * c) + a * (r * s - i * n);
	}
	static inverse(t, r) {
		z.typeOf.object("matrix", t), z.typeOf.object("result", r);
		const n = t[0], o = t[1], i = t[2], s = t[3], a = t[4], u = t[5], c = t[6], l = t[7], f = t[8], h = e.determinant(t);
		if (Math.abs(h) <= D.EPSILON15) throw new R("matrix is not invertible");
		r[0] = a * f - l * u, r[1] = l * i - o * f, r[2] = o * u - a * i, r[3] = c * u - s * f, r[4] = n * f - c * i, r[5] = s * i - n * u, r[6] = s * l - c * a, r[7] = c * o - n * l, r[8] = n * a - s * o;
		const p = 1 / h;
		return e.multiplyByScalar(r, p, r);
	}
	static inverseTranspose(t, r) {
		return z.typeOf.object("matrix", t), z.typeOf.object("result", r), e.inverse(e.transpose(t, vr), r);
	}
	static equals(e, t) {
		return e === t || T(e) && T(t) && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7] && e[8] === t[8];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || T(e) && T(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r && Math.abs(e[4] - t[4]) <= r && Math.abs(e[5] - t[5]) <= r && Math.abs(e[6] - t[6]) <= r && Math.abs(e[7] - t[7]) <= r && Math.abs(e[8] - t[8]) <= r;
	}
	get length() {
		return e.packedLength;
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	static equalsArray(e, t, r) {
		return e[0] === t[r] && e[1] === t[r + 1] && e[2] === t[r + 2] && e[3] === t[r + 3] && e[4] === t[r + 4] && e[5] === t[r + 5] && e[6] === t[r + 6] && e[7] === t[r + 7] && e[8] === t[r + 8];
	}
	equalsEpsilon(t, r) {
		return e.equalsEpsilon(this, t, r);
	}
	toString() {
		return `(${this[0]}, ${this[3]}, ${this[6]})\n(${this[1]}, ${this[4]}, ${this[7]})\n(${this[2]}, ${this[5]}, ${this[8]})`;
	}
};
yr.packedLength = 9, yr.fromArray = yr.unpack, yr.IDENTITY = Object.freeze(new yr(1, 0, 0, 0, 1, 0, 0, 0, 1)), yr.ZERO = Object.freeze(new yr(0, 0, 0, 0, 0, 0, 0, 0, 0)), yr.COLUMN0ROW0 = 0, yr.COLUMN0ROW1 = 1, yr.COLUMN0ROW2 = 2, yr.COLUMN1ROW0 = 3, yr.COLUMN1ROW1 = 4, yr.COLUMN1ROW2 = 5, yr.COLUMN2ROW0 = 6, yr.COLUMN2ROW1 = 7, yr.COLUMN2ROW2 = 8;
const gr = new H(), br = new H(), wr = new H(), Or = new H(), Er = new H(), xr = new H(), _r = new yr(), Sr = new yr(), vr = new yr(), Cr = [
	1,
	0,
	0
], jr = [
	2,
	2,
	1
];
function Ar(e) {
	let t = 0;
	for (let r = 0; r < 3; ++r) {
		const n = e[yr.getElementIndex(jr[r], Cr[r])];
		t += 2 * n * n;
	}
	return Math.sqrt(t);
}
function Tr(e, t) {
	const r = D.EPSILON15;
	let n = 0, o = 1;
	for (let c = 0; c < 3; ++c) {
		const t = Math.abs(e[yr.getElementIndex(jr[c], Cr[c])]);
		t > n && (o = c, n = t);
	}
	let i = 1, s = 0;
	const a = Cr[o], u = jr[o];
	if (Math.abs(e[yr.getElementIndex(u, a)]) > r) {
		const t = (e[yr.getElementIndex(u, u)] - e[yr.getElementIndex(a, a)]) / 2 / e[yr.getElementIndex(u, a)];
		let r;
		r = t < 0 ? -1 / (-t + Math.sqrt(1 + t * t)) : 1 / (t + Math.sqrt(1 + t * t)), i = 1 / Math.sqrt(1 + r * r), s = r * i;
	}
	return (t = yr.clone(yr.IDENTITY, t))[yr.getElementIndex(a, a)] = t[yr.getElementIndex(u, u)] = i, t[yr.getElementIndex(u, a)] = s, t[yr.getElementIndex(a, u)] = -s, t;
}
var Rr = class e {
	constructor(e, t, r, n, o, i, s, a, u, c, l, f, h, p, d, m) {
		this[0] = e ?? 0, this[1] = o ?? 0, this[2] = u ?? 0, this[3] = h ?? 0, this[4] = t ?? 0, this[5] = i ?? 0, this[6] = c ?? 0, this[7] = p ?? 0, this[8] = r ?? 0, this[9] = s ?? 0, this[10] = l ?? 0, this[11] = d ?? 0, this[12] = n ?? 0, this[13] = a ?? 0, this[14] = f ?? 0, this[15] = m ?? 0;
	}
	static pack(e, t, r) {
		return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t[r++] = e[9], t[r++] = e[10], t[r++] = e[11], t[r++] = e[12], t[r++] = e[13], t[r++] = e[14], t[r] = e[15], t;
	}
	static unpack(t, r, n) {
		return z.defined("array", t), r = r ?? 0, T(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n[4] = t[r++], n[5] = t[r++], n[6] = t[r++], n[7] = t[r++], n[8] = t[r++], n[9] = t[r++], n[10] = t[r++], n[11] = t[r++], n[12] = t[r++], n[13] = t[r++], n[14] = t[r++], n[15] = t[r], n;
	}
	static packArray(t, r) {
		z.defined("array", t);
		const n = t.length, o = 16 * n;
		if (T(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new R("If result is a typed array, it must have exactly array.length * 16 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 16 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (z.defined("array", t), z.typeOf.number.greaterThanOrEquals("array.length", t.length, 16), t.length % 16 != 0) throw new R("array length must be a multiple of 16.");
		const n = t.length;
		T(r) ? r.length = n / 16 : r = new Array(n / 16);
		for (let o = 0; o < n; o += 16) {
			const n = o / 16;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (T(t)) return T(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r[6] = t[6], r[7] = t[7], r[8] = t[8], r[9] = t[9], r[10] = t[10], r[11] = t[11], r[12] = t[12], r[13] = t[13], r[14] = t[14], r[15] = t[15], r) : new e(t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15]);
	}
	static fromColumnMajorArray(t, r) {
		return z.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return z.defined("values", t), T(r) ? (r[0] = t[0], r[1] = t[4], r[2] = t[8], r[3] = t[12], r[4] = t[1], r[5] = t[5], r[6] = t[9], r[7] = t[13], r[8] = t[2], r[9] = t[6], r[10] = t[10], r[11] = t[14], r[12] = t[3], r[13] = t[7], r[14] = t[11], r[15] = t[15], r) : new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]);
	}
	static fromRotationTranslation(t, r, n) {
		return z.typeOf.object("rotation", t), r = r ?? H.ZERO, T(n) ? (n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = 0, n[4] = t[3], n[5] = t[4], n[6] = t[5], n[7] = 0, n[8] = t[6], n[9] = t[7], n[10] = t[8], n[11] = 0, n[12] = r.x, n[13] = r.y, n[14] = r.z, n[15] = 1, n) : new e(t[0], t[3], t[6], r.x, t[1], t[4], t[7], r.y, t[2], t[5], t[8], r.z, 0, 0, 0, 1);
	}
	static fromTranslationQuaternionRotationScale(t, r, n, o) {
		z.typeOf.object("translation", t), z.typeOf.object("rotation", r), z.typeOf.object("scale", n), T(o) || (o = new e());
		const i = n.x, s = n.y, a = n.z, u = r.x * r.x, c = r.x * r.y, l = r.x * r.z, f = r.x * r.w, h = r.y * r.y, p = r.y * r.z, d = r.y * r.w, m = r.z * r.z, y = r.z * r.w, g = r.w * r.w, b = u - h - m + g, w = 2 * (c - y), O = 2 * (l + d), E = 2 * (c + y), x = -u + h - m + g, _ = 2 * (p - f), S = 2 * (l - d), v = 2 * (p + f), C = -u - h + m + g;
		return o[0] = b * i, o[1] = E * i, o[2] = S * i, o[3] = 0, o[4] = w * s, o[5] = x * s, o[6] = v * s, o[7] = 0, o[8] = O * a, o[9] = _ * a, o[10] = C * a, o[11] = 0, o[12] = t.x, o[13] = t.y, o[14] = t.z, o[15] = 1, o;
	}
	static fromTranslationRotationScale(t, r) {
		return z.typeOf.object("translationRotationScale", t), e.fromTranslationQuaternionRotationScale(t.translation, t.rotation, t.scale, r);
	}
	static fromTranslation(t, r) {
		return z.typeOf.object("translation", t), e.fromRotationTranslation(yr.IDENTITY, t, r);
	}
	static fromScale(t, r) {
		return z.typeOf.object("scale", t), T(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = t.y, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = t.z, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r) : new e(t.x, 0, 0, 0, 0, t.y, 0, 0, 0, 0, t.z, 0, 0, 0, 0, 1);
	}
	static fromUniformScale(t, r) {
		return z.typeOf.number("scale", t), T(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = t, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = t, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r) : new e(t, 0, 0, 0, 0, t, 0, 0, 0, 0, t, 0, 0, 0, 0, 1);
	}
	static fromRotation(t, r) {
		return z.typeOf.object("rotation", t), T(r) || (r = new e()), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 0, r[4] = t[3], r[5] = t[4], r[6] = t[5], r[7] = 0, r[8] = t[6], r[9] = t[7], r[10] = t[8], r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r;
	}
	static fromCamera(t, r) {
		z.typeOf.object("camera", t);
		const n = t.position, o = t.direction, i = t.up;
		z.typeOf.object("camera.position", n), z.typeOf.object("camera.direction", o), z.typeOf.object("camera.up", i), H.normalize(o, zr), H.normalize(H.cross(zr, i, Ir), Ir), H.normalize(H.cross(Ir, zr, Mr), Mr);
		const s = Ir.x, a = Ir.y, u = Ir.z, c = zr.x, l = zr.y, f = zr.z, h = Mr.x, p = Mr.y, d = Mr.z, m = n.x, y = n.y, g = n.z, b = s * -m + a * -y + u * -g, w = h * -m + p * -y + d * -g, O = c * m + l * y + f * g;
		return T(r) ? (r[0] = s, r[1] = h, r[2] = -c, r[3] = 0, r[4] = a, r[5] = p, r[6] = -l, r[7] = 0, r[8] = u, r[9] = d, r[10] = -f, r[11] = 0, r[12] = b, r[13] = w, r[14] = O, r[15] = 1, r) : new e(s, a, u, b, h, p, d, w, -c, -l, -f, O, 0, 0, 0, 1);
	}
	static computePerspectiveFieldOfView(e, t, r, n, o) {
		z.typeOf.number.greaterThan("fovY", e, 0), z.typeOf.number.lessThan("fovY", e, Math.PI), z.typeOf.number.greaterThan("near", r, 0), z.typeOf.number.greaterThan("far", n, 0), z.typeOf.object("result", o);
		const i = 1 / Math.tan(.5 * e), s = i / t, a = (n + r) / (r - n), u = 2 * n * r / (r - n);
		return o[0] = s, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = i, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = a, o[11] = -1, o[12] = 0, o[13] = 0, o[14] = u, o[15] = 0, o;
	}
	static computeOrthographicOffCenter(e, t, r, n, o, i, s) {
		z.typeOf.number("left", e), z.typeOf.number("right", t), z.typeOf.number("bottom", r), z.typeOf.number("top", n), z.typeOf.number("near", o), z.typeOf.number("far", i), z.typeOf.object("result", s);
		let a = 1 / (t - e), u = 1 / (n - r), c = 1 / (i - o);
		const l = -(t + e) * a, f = -(n + r) * u, h = -(i + o) * c;
		return a *= 2, u *= 2, c *= -2, s[0] = a, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = u, s[6] = 0, s[7] = 0, s[8] = 0, s[9] = 0, s[10] = c, s[11] = 0, s[12] = l, s[13] = f, s[14] = h, s[15] = 1, s;
	}
	static computePerspectiveOffCenter(e, t, r, n, o, i, s) {
		z.typeOf.number("left", e), z.typeOf.number("right", t), z.typeOf.number("bottom", r), z.typeOf.number("top", n), z.typeOf.number("near", o), z.typeOf.number("far", i), z.typeOf.object("result", s);
		const a = 2 * o / (t - e), u = 2 * o / (n - r), c = (t + e) / (t - e), l = (n + r) / (n - r), f = -(i + o) / (i - o), h = -2 * i * o / (i - o);
		return s[0] = a, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = u, s[6] = 0, s[7] = 0, s[8] = c, s[9] = l, s[10] = f, s[11] = -1, s[12] = 0, s[13] = 0, s[14] = h, s[15] = 0, s;
	}
	static computeInfinitePerspectiveOffCenter(e, t, r, n, o, i) {
		z.typeOf.number("left", e), z.typeOf.number("right", t), z.typeOf.number("bottom", r), z.typeOf.number("top", n), z.typeOf.number("near", o), z.typeOf.object("result", i);
		const s = 2 * o / (t - e), a = 2 * o / (n - r), u = (t + e) / (t - e), c = (n + r) / (n - r), l = -2 * o;
		return i[0] = s, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = a, i[6] = 0, i[7] = 0, i[8] = u, i[9] = c, i[10] = -1, i[11] = -1, i[12] = 0, i[13] = 0, i[14] = l, i[15] = 0, i;
	}
	static computeViewportTransformation(t, r, n, o) {
		T(o) || (o = new e());
		const i = (t = t ?? A.EMPTY_OBJECT).x ?? 0, s = t.y ?? 0;
		r = r ?? 0;
		const a = .5 * (t.width ?? 0), u = .5 * (t.height ?? 0), c = .5 * ((n = n ?? 1) - r), l = a, f = u, h = c, p = i + a, d = s + u, m = r + c;
		return o[0] = l, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = f, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = h, o[11] = 0, o[12] = p, o[13] = d, o[14] = m, o[15] = 1, o;
	}
	static computeView(e, t, r, n, o) {
		return z.typeOf.object("position", e), z.typeOf.object("direction", t), z.typeOf.object("up", r), z.typeOf.object("right", n), z.typeOf.object("result", o), o[0] = n.x, o[1] = r.x, o[2] = -t.x, o[3] = 0, o[4] = n.y, o[5] = r.y, o[6] = -t.y, o[7] = 0, o[8] = n.z, o[9] = r.z, o[10] = -t.z, o[11] = 0, o[12] = -H.dot(n, e), o[13] = -H.dot(r, e), o[14] = H.dot(t, e), o[15] = 1, o;
	}
	static toArray(e, t) {
		return z.typeOf.object("matrix", e), T(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t) : [
			e[0],
			e[1],
			e[2],
			e[3],
			e[4],
			e[5],
			e[6],
			e[7],
			e[8],
			e[9],
			e[10],
			e[11],
			e[12],
			e[13],
			e[14],
			e[15]
		];
	}
	static getElementIndex(e, t) {
		return z.typeOf.number.greaterThanOrEquals("row", t, 0), z.typeOf.number.lessThanOrEquals("row", t, 3), z.typeOf.number.greaterThanOrEquals("column", e, 0), z.typeOf.number.lessThanOrEquals("column", e, 3), 4 * e + t;
	}
	static getColumn(e, t, r) {
		z.typeOf.object("matrix", e), z.typeOf.number.greaterThanOrEquals("index", t, 0), z.typeOf.number.lessThanOrEquals("index", t, 3), z.typeOf.object("result", r);
		const n = 4 * t, o = e[n], i = e[n + 1], s = e[n + 2], a = e[n + 3];
		return r.x = o, r.y = i, r.z = s, r.w = a, r;
	}
	static setColumn(t, r, n, o) {
		z.typeOf.object("matrix", t), z.typeOf.number.greaterThanOrEquals("index", r, 0), z.typeOf.number.lessThanOrEquals("index", r, 3), z.typeOf.object("cartesian", n), z.typeOf.object("result", o);
		const i = 4 * r;
		return (o = e.clone(t, o))[i] = n.x, o[i + 1] = n.y, o[i + 2] = n.z, o[i + 3] = n.w, o;
	}
	static getRow(e, t, r) {
		z.typeOf.object("matrix", e), z.typeOf.number.greaterThanOrEquals("index", t, 0), z.typeOf.number.lessThanOrEquals("index", t, 3), z.typeOf.object("result", r);
		const n = e[t], o = e[t + 4], i = e[t + 8], s = e[t + 12];
		return r.x = n, r.y = o, r.z = i, r.w = s, r;
	}
	static setRow(t, r, n, o) {
		return z.typeOf.object("matrix", t), z.typeOf.number.greaterThanOrEquals("index", r, 0), z.typeOf.number.lessThanOrEquals("index", r, 3), z.typeOf.object("cartesian", n), z.typeOf.object("result", o), (o = e.clone(t, o))[r] = n.x, o[r + 4] = n.y, o[r + 8] = n.z, o[r + 12] = n.w, o;
	}
	static setTranslation(e, t, r) {
		return z.typeOf.object("matrix", e), z.typeOf.object("translation", t), z.typeOf.object("result", r), r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = t.x, r[13] = t.y, r[14] = t.z, r[15] = e[15], r;
	}
	static setScale(t, r, n) {
		z.typeOf.object("matrix", t), z.typeOf.object("scale", r), z.typeOf.object("result", n);
		const o = e.getScale(t, qr), i = r.x / o.x, s = r.y / o.y, a = r.z / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3], n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * s, n[7] = t[7], n[8] = t[8] * a, n[9] = t[9] * a, n[10] = t[10] * a, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static setUniformScale(t, r, n) {
		z.typeOf.object("matrix", t), z.typeOf.number("scale", r), z.typeOf.object("result", n);
		const o = e.getScale(t, Pr), i = r / o.x, s = r / o.y, a = r / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3], n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * s, n[7] = t[7], n[8] = t[8] * a, n[9] = t[9] * a, n[10] = t[10] * a, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static getScale(e, t) {
		return z.typeOf.object("matrix", e), z.typeOf.object("result", t), t.x = H.magnitude(H.fromElements(e[0], e[1], e[2], Nr)), t.y = H.magnitude(H.fromElements(e[4], e[5], e[6], Nr)), t.z = H.magnitude(H.fromElements(e[8], e[9], e[10], Nr)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, Dr), H.maximumComponent(Dr);
	}
	static setRotation(t, r, n) {
		z.typeOf.object("matrix", t), z.typeOf.object("result", n);
		const o = e.getScale(t, Fr);
		return n[0] = r[0] * o.x, n[1] = r[1] * o.x, n[2] = r[2] * o.x, n[3] = t[3], n[4] = r[3] * o.y, n[5] = r[4] * o.y, n[6] = r[5] * o.y, n[7] = t[7], n[8] = r[6] * o.z, n[9] = r[7] * o.z, n[10] = r[8] * o.z, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static getRotation(t, r) {
		z.typeOf.object("matrix", t), z.typeOf.object("result", r);
		const n = e.getScale(t, Lr);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.x, r[3] = t[4] / n.y, r[4] = t[5] / n.y, r[5] = t[6] / n.y, r[6] = t[8] / n.z, r[7] = t[9] / n.z, r[8] = t[10] / n.z, r;
	}
	static multiply(e, t, r) {
		z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r);
		const n = e[0], o = e[1], i = e[2], s = e[3], a = e[4], u = e[5], c = e[6], l = e[7], f = e[8], h = e[9], p = e[10], d = e[11], m = e[12], y = e[13], g = e[14], b = e[15], w = t[0], O = t[1], E = t[2], x = t[3], _ = t[4], S = t[5], v = t[6], C = t[7], j = t[8], A = t[9], T = t[10], R = t[11], I = t[12], M = t[13], q = t[14], P = t[15], N = n * w + a * O + f * E + m * x, D = o * w + u * O + h * E + y * x, F = i * w + c * O + p * E + g * x, L = s * w + l * O + d * E + b * x, U = n * _ + a * S + f * v + m * C, k = o * _ + u * S + h * v + y * C, B = i * _ + c * S + p * v + g * C, W = s * _ + l * S + d * v + b * C, $ = n * j + a * A + f * T + m * R, G = o * j + u * A + h * T + y * R, H = i * j + c * A + p * T + g * R, V = s * j + l * A + d * T + b * R, Y = n * I + a * M + f * q + m * P, Q = o * I + u * M + h * q + y * P, Z = i * I + c * M + p * q + g * P, X = s * I + l * M + d * q + b * P;
		return r[0] = N, r[1] = D, r[2] = F, r[3] = L, r[4] = U, r[5] = k, r[6] = B, r[7] = W, r[8] = $, r[9] = G, r[10] = H, r[11] = V, r[12] = Y, r[13] = Q, r[14] = Z, r[15] = X, r;
	}
	static add(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r[4] = e[4] + t[4], r[5] = e[5] + t[5], r[6] = e[6] + t[6], r[7] = e[7] + t[7], r[8] = e[8] + t[8], r[9] = e[9] + t[9], r[10] = e[10] + t[10], r[11] = e[11] + t[11], r[12] = e[12] + t[12], r[13] = e[13] + t[13], r[14] = e[14] + t[14], r[15] = e[15] + t[15], r;
	}
	static subtract(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r[4] = e[4] - t[4], r[5] = e[5] - t[5], r[6] = e[6] - t[6], r[7] = e[7] - t[7], r[8] = e[8] - t[8], r[9] = e[9] - t[9], r[10] = e[10] - t[10], r[11] = e[11] - t[11], r[12] = e[12] - t[12], r[13] = e[13] - t[13], r[14] = e[14] - t[14], r[15] = e[15] - t[15], r;
	}
	static multiplyTransformation(e, t, r) {
		z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r);
		const n = e[0], o = e[1], i = e[2], s = e[4], a = e[5], u = e[6], c = e[8], l = e[9], f = e[10], h = e[12], p = e[13], d = e[14], m = t[0], y = t[1], g = t[2], b = t[4], w = t[5], O = t[6], E = t[8], x = t[9], _ = t[10], S = t[12], v = t[13], C = t[14], j = n * m + s * y + c * g, A = o * m + a * y + l * g, T = i * m + u * y + f * g, R = n * b + s * w + c * O, I = o * b + a * w + l * O, M = i * b + u * w + f * O, q = n * E + s * x + c * _, P = o * E + a * x + l * _, N = i * E + u * x + f * _, D = n * S + s * v + c * C + h, F = o * S + a * v + l * C + p, L = i * S + u * v + f * C + d;
		return r[0] = j, r[1] = A, r[2] = T, r[3] = 0, r[4] = R, r[5] = I, r[6] = M, r[7] = 0, r[8] = q, r[9] = P, r[10] = N, r[11] = 0, r[12] = D, r[13] = F, r[14] = L, r[15] = 1, r;
	}
	static multiplyByMatrix3(e, t, r) {
		z.typeOf.object("matrix", e), z.typeOf.object("rotation", t), z.typeOf.object("result", r);
		const n = e[0], o = e[1], i = e[2], s = e[4], a = e[5], u = e[6], c = e[8], l = e[9], f = e[10], h = t[0], p = t[1], d = t[2], m = t[3], y = t[4], g = t[5], b = t[6], w = t[7], O = t[8], E = n * h + s * p + c * d, x = o * h + a * p + l * d, _ = i * h + u * p + f * d, S = n * m + s * y + c * g, v = o * m + a * y + l * g, C = i * m + u * y + f * g, j = n * b + s * w + c * O, A = o * b + a * w + l * O, T = i * b + u * w + f * O;
		return r[0] = E, r[1] = x, r[2] = _, r[3] = 0, r[4] = S, r[5] = v, r[6] = C, r[7] = 0, r[8] = j, r[9] = A, r[10] = T, r[11] = 0, r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static multiplyByTranslation(e, t, r) {
		z.typeOf.object("matrix", e), z.typeOf.object("translation", t), z.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = n * e[0] + o * e[4] + i * e[8] + e[12], a = n * e[1] + o * e[5] + i * e[9] + e[13], u = n * e[2] + o * e[6] + i * e[10] + e[14];
		return r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = s, r[13] = a, r[14] = u, r[15] = e[15], r;
	}
	static multiplyByScale(t, r, n) {
		z.typeOf.object("matrix", t), z.typeOf.object("scale", r), z.typeOf.object("result", n);
		const o = r.x, i = r.y, s = r.z;
		return 1 === o && 1 === i && 1 === s ? e.clone(t, n) : (n[0] = o * t[0], n[1] = o * t[1], n[2] = o * t[2], n[3] = t[3], n[4] = i * t[4], n[5] = i * t[5], n[6] = i * t[6], n[7] = t[7], n[8] = s * t[8], n[9] = s * t[9], n[10] = s * t[10], n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n);
	}
	static multiplyByUniformScale(e, t, r) {
		return z.typeOf.object("matrix", e), z.typeOf.number("scale", t), z.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3], r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7], r[8] = e[8] * t, r[9] = e[9] * t, r[10] = e[10] * t, r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static multiplyByVector(e, t, r) {
		z.typeOf.object("matrix", e), z.typeOf.object("cartesian", t), z.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = t.w, a = e[0] * n + e[4] * o + e[8] * i + e[12] * s, u = e[1] * n + e[5] * o + e[9] * i + e[13] * s, c = e[2] * n + e[6] * o + e[10] * i + e[14] * s, l = e[3] * n + e[7] * o + e[11] * i + e[15] * s;
		return r.x = a, r.y = u, r.z = c, r.w = l, r;
	}
	static multiplyByPointAsVector(e, t, r) {
		z.typeOf.object("matrix", e), z.typeOf.object("cartesian", t), z.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = e[0] * n + e[4] * o + e[8] * i, a = e[1] * n + e[5] * o + e[9] * i, u = e[2] * n + e[6] * o + e[10] * i;
		return r.x = s, r.y = a, r.z = u, r;
	}
	static multiplyByPoint(e, t, r) {
		z.typeOf.object("matrix", e), z.typeOf.object("cartesian", t), z.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = e[0] * n + e[4] * o + e[8] * i + e[12], a = e[1] * n + e[5] * o + e[9] * i + e[13], u = e[2] * n + e[6] * o + e[10] * i + e[14];
		return r.x = s, r.y = a, r.z = u, r;
	}
	static multiplyByScalar(e, t, r) {
		return z.typeOf.object("matrix", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r[9] = e[9] * t, r[10] = e[10] * t, r[11] = e[11] * t, r[12] = e[12] * t, r[13] = e[13] * t, r[14] = e[14] * t, r[15] = e[15] * t, r;
	}
	static negate(e, t) {
		return z.typeOf.object("matrix", e), z.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t[9] = -e[9], t[10] = -e[10], t[11] = -e[11], t[12] = -e[12], t[13] = -e[13], t[14] = -e[14], t[15] = -e[15], t;
	}
	static transpose(e, t) {
		z.typeOf.object("matrix", e), z.typeOf.object("result", t);
		const r = e[1], n = e[2], o = e[3], i = e[6], s = e[7], a = e[11];
		return t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = r, t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = n, t[9] = i, t[10] = e[10], t[11] = e[14], t[12] = o, t[13] = s, t[14] = a, t[15] = e[15], t;
	}
	static abs(e, t) {
		return z.typeOf.object("matrix", e), z.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t[9] = Math.abs(e[9]), t[10] = Math.abs(e[10]), t[11] = Math.abs(e[11]), t[12] = Math.abs(e[12]), t[13] = Math.abs(e[13]), t[14] = Math.abs(e[14]), t[15] = Math.abs(e[15]), t;
	}
	static equals(e, t) {
		return e === t || T(e) && T(t) && e[12] === t[12] && e[13] === t[13] && e[14] === t[14] && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[8] === t[8] && e[9] === t[9] && e[10] === t[10] && e[3] === t[3] && e[7] === t[7] && e[11] === t[11] && e[15] === t[15];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || T(e) && T(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r && Math.abs(e[4] - t[4]) <= r && Math.abs(e[5] - t[5]) <= r && Math.abs(e[6] - t[6]) <= r && Math.abs(e[7] - t[7]) <= r && Math.abs(e[8] - t[8]) <= r && Math.abs(e[9] - t[9]) <= r && Math.abs(e[10] - t[10]) <= r && Math.abs(e[11] - t[11]) <= r && Math.abs(e[12] - t[12]) <= r && Math.abs(e[13] - t[13]) <= r && Math.abs(e[14] - t[14]) <= r && Math.abs(e[15] - t[15]) <= r;
	}
	static getTranslation(e, t) {
		return z.typeOf.object("matrix", e), z.typeOf.object("result", t), t.x = e[12], t.y = e[13], t.z = e[14], t;
	}
	static getMatrix3(e, t) {
		return z.typeOf.object("matrix", e), z.typeOf.object("result", t), t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t;
	}
	static inverse(t, r) {
		z.typeOf.object("matrix", t), z.typeOf.object("result", r);
		const n = t[0], o = t[4], i = t[8], s = t[12], a = t[1], u = t[5], c = t[9], l = t[13], f = t[2], h = t[6], p = t[10], d = t[14], m = t[3], y = t[7], g = t[11], b = t[15];
		let w = p * b, O = d * g, E = h * b, x = d * y, _ = h * g, S = p * y, v = f * b, C = d * m, j = f * g, A = p * m, T = f * y, R = h * m;
		const I = w * u + x * c + _ * l - (O * u + E * c + S * l), M = O * a + v * c + A * l - (w * a + C * c + j * l), q = E * a + C * u + T * l - (x * a + v * u + R * l), P = S * a + j * u + R * c - (_ * a + A * u + T * c), N = O * o + E * i + S * s - (w * o + x * i + _ * s), F = w * n + C * i + j * s - (O * n + v * i + A * s), L = x * n + v * o + R * s - (E * n + C * o + T * s), U = _ * n + A * o + T * i - (S * n + j * o + R * i);
		w = i * l, O = s * c, E = o * l, x = s * u, _ = o * c, S = i * u, v = n * l, C = s * a, j = n * c, A = i * a, T = n * u, R = o * a;
		const k = w * y + x * g + _ * b - (O * y + E * g + S * b), B = O * m + v * g + A * b - (w * m + C * g + j * b), W = E * m + C * y + T * b - (x * m + v * y + R * b), $ = S * m + j * y + R * g - (_ * m + A * y + T * g), G = E * p + S * d + O * h - (_ * d + w * h + x * p), H = j * d + w * f + C * p - (v * p + A * d + O * f), V = v * h + R * d + x * f - (T * d + E * f + C * h), Y = T * p + _ * f + A * h - (j * h + R * p + S * f);
		let Q = n * I + o * M + i * q + s * P;
		if (Math.abs(Q) < D.EPSILON21) {
			if (yr.equalsEpsilon(e.getMatrix3(t, Ur), kr, D.EPSILON7) && we.equals(e.getRow(t, 3, Br), Wr)) return r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = 0, r[11] = 0, r[12] = -t[12], r[13] = -t[13], r[14] = -t[14], r[15] = 1, r;
			throw new _t("matrix is not invertible because its determinate is zero.");
		}
		return Q = 1 / Q, r[0] = I * Q, r[1] = M * Q, r[2] = q * Q, r[3] = P * Q, r[4] = N * Q, r[5] = F * Q, r[6] = L * Q, r[7] = U * Q, r[8] = k * Q, r[9] = B * Q, r[10] = W * Q, r[11] = $ * Q, r[12] = G * Q, r[13] = H * Q, r[14] = V * Q, r[15] = Y * Q, r;
	}
	static inverseTransformation(e, t) {
		z.typeOf.object("matrix", e), z.typeOf.object("result", t);
		const r = e[0], n = e[1], o = e[2], i = e[4], s = e[5], a = e[6], u = e[8], c = e[9], l = e[10], f = e[12], h = e[13], p = e[14], d = -r * f - n * h - o * p, m = -i * f - s * h - a * p, y = -u * f - c * h - l * p;
		return t[0] = r, t[1] = i, t[2] = u, t[3] = 0, t[4] = n, t[5] = s, t[6] = c, t[7] = 0, t[8] = o, t[9] = a, t[10] = l, t[11] = 0, t[12] = d, t[13] = m, t[14] = y, t[15] = 1, t;
	}
	static inverseTranspose(t, r) {
		return z.typeOf.object("matrix", t), z.typeOf.object("result", r), e.inverse(e.transpose(t, $r), r);
	}
	get length() {
		return e.packedLength;
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	static equalsArray(e, t, r) {
		return e[0] === t[r] && e[1] === t[r + 1] && e[2] === t[r + 2] && e[3] === t[r + 3] && e[4] === t[r + 4] && e[5] === t[r + 5] && e[6] === t[r + 6] && e[7] === t[r + 7] && e[8] === t[r + 8] && e[9] === t[r + 9] && e[10] === t[r + 10] && e[11] === t[r + 11] && e[12] === t[r + 12] && e[13] === t[r + 13] && e[14] === t[r + 14] && e[15] === t[r + 15];
	}
	equalsEpsilon(t, r) {
		return e.equalsEpsilon(this, t, r);
	}
	toString() {
		return `(${this[0]}, ${this[4]}, ${this[8]}, ${this[12]})\n(${this[1]}, ${this[5]}, ${this[9]}, ${this[13]})\n(${this[2]}, ${this[6]}, ${this[10]}, ${this[14]})\n(${this[3]}, ${this[7]}, ${this[11]}, ${this[15]})`;
	}
};
Rr.packedLength = 16, Rr.fromArray = Rr.unpack, Rr.IDENTITY = Object.freeze(new Rr(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)), Rr.ZERO = Object.freeze(new Rr(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)), Rr.COLUMN0ROW0 = 0, Rr.COLUMN0ROW1 = 1, Rr.COLUMN0ROW2 = 2, Rr.COLUMN0ROW3 = 3, Rr.COLUMN1ROW0 = 4, Rr.COLUMN1ROW1 = 5, Rr.COLUMN1ROW2 = 6, Rr.COLUMN1ROW3 = 7, Rr.COLUMN2ROW0 = 8, Rr.COLUMN2ROW1 = 9, Rr.COLUMN2ROW2 = 10, Rr.COLUMN2ROW3 = 11, Rr.COLUMN3ROW0 = 12, Rr.COLUMN3ROW1 = 13, Rr.COLUMN3ROW2 = 14, Rr.COLUMN3ROW3 = 15;
const zr = new H(), Ir = new H(), Mr = new H(), qr = new H(), Pr = new H(), Nr = new H(), Dr = new H(), Fr = new H(), Lr = new H(), Ur = new yr(), kr = new yr(), Br = new we(), Wr = new we(0, 0, 0, 1), $r = new Rr();
let Gr;
const Hr = {
	requestFullscreen: void 0,
	exitFullscreen: void 0,
	fullscreenEnabled: void 0,
	fullscreenElement: void 0,
	fullscreenchange: void 0,
	fullscreenerror: void 0
}, Vr = {};
let Yr, Qr, Zr, Xr, Kr, Jr, en, tn, rn, nn, on, sn, an, un, cn, ln;
function fn(e) {
	const t = e.split(".");
	for (let r = 0, n = t.length; r < n; ++r) t[r] = parseInt(t[r], 10);
	return t;
}
function hn() {
	if (!T(Qr) && (Qr = !1, !mn())) {
		const e = / Chrome\/([\.0-9]+)/.exec(Yr.userAgent);
		null !== e && (Qr = !0, Zr = fn(e[1]));
	}
	return Qr;
}
function pn() {
	if (!T(Xr) && (Xr = !1, !hn() && !mn() && / Safari\/[\.0-9]+/.test(Yr.userAgent))) {
		const e = / Version\/([\.0-9]+)/.exec(Yr.userAgent);
		null !== e && (Xr = !0, Kr = fn(e[1]));
	}
	return Xr;
}
function dn() {
	if (!T(Jr)) {
		Jr = !1;
		const e = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(Yr.userAgent);
		null !== e && (Jr = !0, en = fn(e[1]), en.isNightly = !!e[2]);
	}
	return Jr;
}
function mn() {
	if (!T(tn)) {
		tn = !1;
		const e = / Edg\/([\.0-9]+)/.exec(Yr.userAgent);
		null !== e && (tn = !0, rn = fn(e[1]));
	}
	return tn;
}
function yn() {
	if (!T(nn)) {
		nn = !1;
		const e = /Firefox\/([\.0-9]+)/.exec(Yr.userAgent);
		null !== e && (nn = !0, on = fn(e[1]));
	}
	return nn;
}
function gn() {
	if (!T(ln)) {
		const e = document.createElement("canvas");
		e.setAttribute("style", "image-rendering: -moz-crisp-edges;image-rendering: pixelated;");
		const t = e.style.imageRendering;
		ln = T(t) && "" !== t, ln && (cn = t);
	}
	return ln;
}
function bn() {
	if (!bn.initialized) throw new R("You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP");
	return bn._result;
}
Object.defineProperties(Vr, {
	element: { get: function() {
		if (Vr.supportsFullscreen()) return document[Hr.fullscreenElement];
	} },
	changeEventName: { get: function() {
		if (Vr.supportsFullscreen()) return Hr.fullscreenchange;
	} },
	errorEventName: { get: function() {
		if (Vr.supportsFullscreen()) return Hr.fullscreenerror;
	} },
	enabled: { get: function() {
		if (Vr.supportsFullscreen()) return document[Hr.fullscreenEnabled];
	} },
	fullscreen: { get: function() {
		if (Vr.supportsFullscreen()) return null !== Vr.element;
	} }
}), Vr.supportsFullscreen = function() {
	if (T(Gr)) return Gr;
	Gr = !1;
	const e = document.body;
	if ("function" == typeof e.requestFullscreen) return Hr.requestFullscreen = "requestFullscreen", Hr.exitFullscreen = "exitFullscreen", Hr.fullscreenEnabled = "fullscreenEnabled", Hr.fullscreenElement = "fullscreenElement", Hr.fullscreenchange = "fullscreenchange", Hr.fullscreenerror = "fullscreenerror", Gr = !0, Gr;
	const t = [
		"webkit",
		"moz",
		"o",
		"ms",
		"khtml"
	];
	let r;
	for (let n = 0, o = t.length; n < o; ++n) {
		const o = t[n];
		r = `${o}RequestFullscreen`, "function" == typeof e[r] ? (Hr.requestFullscreen = r, Gr = !0) : (r = `${o}RequestFullScreen`, "function" == typeof e[r] && (Hr.requestFullscreen = r, Gr = !0)), r = `${o}ExitFullscreen`, "function" == typeof document[r] ? Hr.exitFullscreen = r : (r = `${o}CancelFullScreen`, "function" == typeof document[r] && (Hr.exitFullscreen = r)), r = `${o}FullscreenEnabled`, void 0 !== document[r] ? Hr.fullscreenEnabled = r : (r = `${o}FullScreenEnabled`, void 0 !== document[r] && (Hr.fullscreenEnabled = r)), r = `${o}FullscreenElement`, void 0 !== document[r] ? Hr.fullscreenElement = r : (r = `${o}FullScreenElement`, void 0 !== document[r] && (Hr.fullscreenElement = r)), r = `${o}fullscreenchange`, void 0 !== document[`on${r}`] && ("ms" === o && (r = "MSFullscreenChange"), Hr.fullscreenchange = r), r = `${o}fullscreenerror`, void 0 !== document[`on${r}`] && ("ms" === o && (r = "MSFullscreenError"), Hr.fullscreenerror = r);
	}
	return Gr;
}, Vr.requestFullscreen = function(e, t) {
	Vr.supportsFullscreen() && e[Hr.requestFullscreen]({ vrDisplay: t });
}, Vr.exitFullscreen = function() {
	Vr.supportsFullscreen() && document[Hr.exitFullscreen]();
}, Vr._names = Hr, Yr = "undefined" != typeof navigator ? navigator : {}, bn._promise = void 0, bn._result = void 0, bn.initialize = function() {
	return T(bn._promise) || (bn._promise = new Promise((e) => {
		const t = new Image();
		t.onload = function() {
			bn._result = t.width > 0 && t.height > 0, e(bn._result);
		}, t.onerror = function() {
			bn._result = !1, e(bn._result);
		}, t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
	})), bn._promise;
}, Object.defineProperties(bn, { initialized: { get: function() {
	return T(bn._result);
} } });
const wn = [];
"undefined" != typeof ArrayBuffer && (wn.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), "undefined" != typeof Uint8ClampedArray && wn.push(Uint8ClampedArray), "undefined" != typeof Uint8ClampedArray && wn.push(Uint8ClampedArray), "undefined" != typeof BigInt64Array && wn.push(BigInt64Array), "undefined" != typeof BigUint64Array && wn.push(BigUint64Array));
const On = {
	isChrome: hn,
	chromeVersion: function() {
		return hn() && Zr;
	},
	isSafari: pn,
	safariVersion: function() {
		return pn() && Kr;
	},
	isWebkit: dn,
	webkitVersion: function() {
		return dn() && en;
	},
	isEdge: mn,
	edgeVersion: function() {
		return mn() && rn;
	},
	isFirefox: yn,
	firefoxVersion: function() {
		return yn() && on;
	},
	isWindows: function() {
		return T(sn) || (sn = /Windows/i.test(Yr.appVersion)), sn;
	},
	isIPadOrIOS: function() {
		return T(an) || (an = "iPhone" === navigator.platform || "iPod" === navigator.platform || "iPad" === navigator.platform), an;
	},
	hardwareConcurrency: Yr.hardwareConcurrency ?? 3,
	supportsPointerEvents: function() {
		return T(un) || (un = !yn() && "undefined" != typeof PointerEvent && (!T(Yr.pointerEnabled) || Yr.pointerEnabled)), un;
	},
	supportsImageRenderingPixelated: gn,
	supportsWebP: bn,
	imageRenderingValue: function() {
		return gn() ? cn : void 0;
	},
	typedArrayTypes: wn
};
function En(e, t, r, n) {
	this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0, this.w = n ?? 0;
}
On.supportsBasis = function(e) {
	return On.supportsWebAssembly() && e.context.supportsBasis;
}, On.supportsFullscreen = function() {
	return Vr.supportsFullscreen();
}, On.supportsTypedArrays = function() {
	return "undefined" != typeof ArrayBuffer;
}, On.supportsBigInt64Array = function() {
	return "undefined" != typeof BigInt64Array;
}, On.supportsBigUint64Array = function() {
	return "undefined" != typeof BigUint64Array;
}, On.supportsBigInt = function() {
	return "undefined" != typeof BigInt;
}, On.supportsWebWorkers = function() {
	return "undefined" != typeof Worker;
}, On.supportsWebAssembly = function() {
	return "undefined" != typeof WebAssembly;
}, On.supportsWebgl2 = function(e) {
	return z.defined("scene", e), e.context.webgl2;
}, On.supportsEsmWebWorkers = function() {
	return !yn() || parseInt(on) >= 114;
};
let xn = new H();
En.fromAxisAngle = function(e, t, r) {
	z.typeOf.object("axis", e), z.typeOf.number("angle", t);
	const n = t / 2, o = Math.sin(n);
	xn = H.normalize(e, xn);
	const i = xn.x * o, s = xn.y * o, a = xn.z * o, u = Math.cos(n);
	return T(r) ? (r.x = i, r.y = s, r.z = a, r.w = u, r) : new En(i, s, a, u);
};
const _n = [
	1,
	2,
	0
], Sn = new Array(3);
En.fromRotationMatrix = function(e, t) {
	let r, n, o, i, s;
	z.typeOf.object("matrix", e);
	const a = e[yr.COLUMN0ROW0], u = e[yr.COLUMN1ROW1], c = e[yr.COLUMN2ROW2], l = a + u + c;
	if (l > 0) r = Math.sqrt(l + 1), s = .5 * r, r = .5 / r, n = (e[yr.COLUMN1ROW2] - e[yr.COLUMN2ROW1]) * r, o = (e[yr.COLUMN2ROW0] - e[yr.COLUMN0ROW2]) * r, i = (e[yr.COLUMN0ROW1] - e[yr.COLUMN1ROW0]) * r;
	else {
		const t = _n;
		let l = 0;
		u > a && (l = 1), c > a && c > u && (l = 2);
		const f = t[l], h = t[f];
		r = Math.sqrt(e[yr.getElementIndex(l, l)] - e[yr.getElementIndex(f, f)] - e[yr.getElementIndex(h, h)] + 1);
		const p = Sn;
		p[l] = .5 * r, r = .5 / r, s = (e[yr.getElementIndex(h, f)] - e[yr.getElementIndex(f, h)]) * r, p[f] = (e[yr.getElementIndex(f, l)] + e[yr.getElementIndex(l, f)]) * r, p[h] = (e[yr.getElementIndex(h, l)] + e[yr.getElementIndex(l, h)]) * r, n = -p[0], o = -p[1], i = -p[2];
	}
	return T(t) ? (t.x = n, t.y = o, t.z = i, t.w = s, t) : new En(n, o, i, s);
};
const vn = new En();
let Cn = new En(), jn = new En(), An = new En();
En.fromHeadingPitchRoll = function(e, t) {
	return z.typeOf.object("headingPitchRoll", e), An = En.fromAxisAngle(H.UNIT_X, e.roll, vn), jn = En.fromAxisAngle(H.UNIT_Y, -e.pitch, t), t = En.multiply(jn, An, jn), Cn = En.fromAxisAngle(H.UNIT_Z, -e.heading, vn), En.multiply(Cn, t, t);
};
const Tn = new H(), Rn = new H(), zn = new En(), In = new En(), Mn = new En();
En.packedLength = 4, En.pack = function(e, t, r) {
	return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.z, t[r] = e.w, t;
}, En.unpack = function(e, t, r) {
	return z.defined("array", e), t = t ?? 0, T(r) || (r = new En()), r.x = e[t], r.y = e[t + 1], r.z = e[t + 2], r.w = e[t + 3], r;
}, En.packedInterpolationLength = 3, En.convertPackedArrayForInterpolation = function(e, t, r, n) {
	En.unpack(e, 4 * r, Mn), En.conjugate(Mn, Mn);
	for (let o = 0, i = r - t + 1; o < i; o++) {
		const r = 3 * o;
		En.unpack(e, 4 * (t + o), zn), En.multiply(zn, Mn, zn), zn.w < 0 && En.negate(zn, zn), En.computeAxis(zn, Tn);
		const i = En.computeAngle(zn);
		T(n) || (n = []), n[r] = Tn.x * i, n[r + 1] = Tn.y * i, n[r + 2] = Tn.z * i;
	}
}, En.unpackInterpolationResult = function(e, t, r, n, o) {
	T(o) || (o = new En()), H.fromArray(e, 0, Rn);
	const i = H.magnitude(Rn);
	return En.unpack(t, 4 * n, In), 0 === i ? En.clone(En.IDENTITY, zn) : En.fromAxisAngle(Rn, i, zn), En.multiply(zn, In, o);
}, En.clone = function(e, t) {
	if (T(e)) return T(t) ? (t.x = e.x, t.y = e.y, t.z = e.z, t.w = e.w, t) : new En(e.x, e.y, e.z, e.w);
}, En.conjugate = function(e, t) {
	return z.typeOf.object("quaternion", e), z.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = e.w, t;
}, En.magnitudeSquared = function(e) {
	return z.typeOf.object("quaternion", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w;
}, En.magnitude = function(e) {
	return Math.sqrt(En.magnitudeSquared(e));
}, En.normalize = function(e, t) {
	z.typeOf.object("result", t);
	const r = 1 / En.magnitude(e), n = e.x * r, o = e.y * r, i = e.z * r, s = e.w * r;
	return t.x = n, t.y = o, t.z = i, t.w = s, t;
}, En.inverse = function(e, t) {
	z.typeOf.object("result", t);
	const r = En.magnitudeSquared(e);
	return t = En.conjugate(e, t), En.multiplyByScalar(t, 1 / r, t);
}, En.add = function(e, t, r) {
	return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r.w = e.w + t.w, r;
}, En.subtract = function(e, t, r) {
	return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r.w = e.w - t.w, r;
}, En.negate = function(e, t) {
	return z.typeOf.object("quaternion", e), z.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
}, En.dot = function(e, t) {
	return z.typeOf.object("left", e), z.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z + e.w * t.w;
}, En.multiply = function(e, t, r) {
	z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r);
	const n = e.x, o = e.y, i = e.z, s = e.w, a = t.x, u = t.y, c = t.z, l = t.w, f = s * a + n * l + o * c - i * u, h = s * u - n * c + o * l + i * a, p = s * c + n * u - o * a + i * l, d = s * l - n * a - o * u - i * c;
	return r.x = f, r.y = h, r.z = p, r.w = d, r;
}, En.multiplyByScalar = function(e, t, r) {
	return z.typeOf.object("quaternion", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r.w = e.w * t, r;
}, En.divideByScalar = function(e, t, r) {
	return z.typeOf.object("quaternion", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r.w = e.w / t, r;
}, En.computeAxis = function(e, t) {
	z.typeOf.object("quaternion", e), z.typeOf.object("result", t);
	const r = e.w;
	if (Math.abs(r - 1) < D.EPSILON6 || Math.abs(r + 1) < D.EPSILON6) return t.x = 1, t.y = t.z = 0, t;
	const n = 1 / Math.sqrt(1 - r * r);
	return t.x = e.x * n, t.y = e.y * n, t.z = e.z * n, t;
}, En.computeAngle = function(e) {
	return z.typeOf.object("quaternion", e), Math.abs(e.w - 1) < D.EPSILON6 ? 0 : 2 * Math.acos(e.w);
};
let qn = new En();
En.lerp = function(e, t, r, n) {
	return z.typeOf.object("start", e), z.typeOf.object("end", t), z.typeOf.number("t", r), z.typeOf.object("result", n), qn = En.multiplyByScalar(t, r, qn), n = En.multiplyByScalar(e, 1 - r, n), En.add(qn, n, n);
};
let Pn = new En(), Nn = new En(), Dn = new En();
En.slerp = function(e, t, r, n) {
	z.typeOf.object("start", e), z.typeOf.object("end", t), z.typeOf.number("t", r), z.typeOf.object("result", n);
	let o = En.dot(e, t), i = t;
	if (o < 0 && (o = -o, i = Pn = En.negate(t, Pn)), 1 - o < D.EPSILON6) return En.lerp(e, i, r, n);
	const s = Math.acos(o);
	return Nn = En.multiplyByScalar(e, Math.sin((1 - r) * s), Nn), Dn = En.multiplyByScalar(i, Math.sin(r * s), Dn), n = En.add(Nn, Dn, n), En.multiplyByScalar(n, 1 / Math.sin(s), n);
}, En.log = function(e, t) {
	z.typeOf.object("quaternion", e), z.typeOf.object("result", t);
	const r = D.acosClamped(e.w);
	let n = 0;
	return 0 !== r && (n = r / Math.sin(r)), H.multiplyByScalar(e, n, t);
}, En.exp = function(e, t) {
	z.typeOf.object("cartesian", e), z.typeOf.object("result", t);
	const r = H.magnitude(e);
	let n = 0;
	return 0 !== r && (n = Math.sin(r) / r), t.x = e.x * n, t.y = e.y * n, t.z = e.z * n, t.w = Math.cos(r), t;
};
const Fn = new H(), Ln = new H(), Un = new En(), kn = new En();
En.computeInnerQuadrangle = function(e, t, r, n) {
	z.typeOf.object("q0", e), z.typeOf.object("q1", t), z.typeOf.object("q2", r), z.typeOf.object("result", n);
	const o = En.conjugate(t, Un);
	En.multiply(o, r, kn);
	const i = En.log(kn, Fn);
	En.multiply(o, e, kn);
	const s = En.log(kn, Ln);
	return H.add(i, s, i), H.multiplyByScalar(i, .25, i), H.negate(i, i), En.exp(i, Un), En.multiply(t, Un, n);
}, En.squad = function(e, t, r, n, o, i) {
	z.typeOf.object("q0", e), z.typeOf.object("q1", t), z.typeOf.object("s0", r), z.typeOf.object("s1", n), z.typeOf.number("t", o), z.typeOf.object("result", i);
	const s = En.slerp(e, t, o, Un), a = En.slerp(r, n, o, kn);
	return En.slerp(s, a, 2 * o * (1 - o), i);
};
const Bn = new En(), Wn = 1.9011074535173003, $n = On.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Gn = On.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Hn = On.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Vn = On.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [];
for (let Fs = 0; Fs < 7; ++Fs) {
	const e = Fs + 1, t = 2 * e + 1;
	$n[Fs] = 1 / (e * t), Gn[Fs] = e / t;
}
$n[7] = Wn / 136, Gn[7] = 8 * Wn / 17, En.fastSlerp = function(e, t, r, n) {
	z.typeOf.object("start", e), z.typeOf.object("end", t), z.typeOf.number("t", r), z.typeOf.object("result", n);
	let o, i = En.dot(e, t);
	i >= 0 ? o = 1 : (o = -1, i = -i);
	const s = i - 1, a = 1 - r, u = r * r, c = a * a;
	for (let p = 7; p >= 0; --p) Hn[p] = ($n[p] * u - Gn[p]) * s, Vn[p] = ($n[p] * c - Gn[p]) * s;
	const l = o * r * (1 + Hn[0] * (1 + Hn[1] * (1 + Hn[2] * (1 + Hn[3] * (1 + Hn[4] * (1 + Hn[5] * (1 + Hn[6] * (1 + Hn[7])))))))), f = a * (1 + Vn[0] * (1 + Vn[1] * (1 + Vn[2] * (1 + Vn[3] * (1 + Vn[4] * (1 + Vn[5] * (1 + Vn[6] * (1 + Vn[7])))))))), h = En.multiplyByScalar(e, f, Bn);
	return En.multiplyByScalar(t, l, n), En.add(h, n, n);
}, En.fastSquad = function(e, t, r, n, o, i) {
	z.typeOf.object("q0", e), z.typeOf.object("q1", t), z.typeOf.object("s0", r), z.typeOf.object("s1", n), z.typeOf.number("t", o), z.typeOf.object("result", i);
	const s = En.fastSlerp(e, t, o, Un), a = En.fastSlerp(r, n, o, kn);
	return En.fastSlerp(s, a, 2 * o * (1 - o), i);
}, En.equals = function(e, t) {
	return e === t || T(e) && T(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
}, En.equalsEpsilon = function(e, t, r) {
	return r = r ?? 0, e === t || T(e) && T(t) && Math.abs(e.x - t.x) <= r && Math.abs(e.y - t.y) <= r && Math.abs(e.z - t.z) <= r && Math.abs(e.w - t.w) <= r;
}, En.ZERO = Object.freeze(new En(0, 0, 0, 0)), En.IDENTITY = Object.freeze(new En(0, 0, 0, 1)), En.prototype.clone = function(e) {
	return En.clone(this, e);
}, En.prototype.equals = function(e) {
	return En.equals(this, e);
}, En.prototype.equalsEpsilon = function(e, t) {
	return En.equalsEpsilon(this, e, t);
}, En.prototype.toString = function() {
	return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
};
const Yn = {}, Qn = {
	up: {
		south: "east",
		north: "west",
		west: "south",
		east: "north"
	},
	down: {
		south: "west",
		north: "east",
		west: "north",
		east: "south"
	},
	south: {
		up: "west",
		down: "east",
		west: "down",
		east: "up"
	},
	north: {
		up: "east",
		down: "west",
		west: "up",
		east: "down"
	},
	west: {
		up: "north",
		down: "south",
		north: "down",
		south: "up"
	},
	east: {
		up: "south",
		down: "north",
		north: "up",
		south: "down"
	}
}, Zn = {
	north: [
		-1,
		0,
		0
	],
	east: [
		0,
		1,
		0
	],
	up: [
		0,
		0,
		1
	],
	south: [
		1,
		0,
		0
	],
	west: [
		0,
		-1,
		0
	],
	down: [
		0,
		0,
		-1
	]
}, Xn = {}, Kn = {
	east: new H(),
	north: new H(),
	up: new H(),
	west: new H(),
	south: new H(),
	down: new H()
};
let Jn = new H(), eo = new H(), to = new H();
Yn.localFrameToFixedFrameGenerator = function(e, t) {
	if (!Qn.hasOwnProperty(e) || !Qn[e].hasOwnProperty(t)) throw new R("firstAxis and secondAxis must be east, north, up, west, south or down.");
	const r = Qn[e][t];
	let n;
	const o = e + t;
	return T(Xn[o]) ? n = Xn[o] : (n = function(n, o, i) {
		if (!T(n)) throw new R("origin is required.");
		if (isNaN(n.x) || isNaN(n.y) || isNaN(n.z)) throw new R("origin has a NaN component");
		if (T(i) || (i = new Rr()), H.equalsEpsilon(n, H.ZERO, D.EPSILON14)) H.unpack(Zn[e], 0, Jn), H.unpack(Zn[t], 0, eo), H.unpack(Zn[r], 0, to);
		else if (D.equalsEpsilon(n.x, 0, D.EPSILON14) && D.equalsEpsilon(n.y, 0, D.EPSILON14)) {
			const o = D.sign(n.z);
			H.unpack(Zn[e], 0, Jn), "east" !== e && "west" !== e && H.multiplyByScalar(Jn, o, Jn), H.unpack(Zn[t], 0, eo), "east" !== t && "west" !== t && H.multiplyByScalar(eo, o, eo), H.unpack(Zn[r], 0, to), "east" !== r && "west" !== r && H.multiplyByScalar(to, o, to);
		} else {
			(o = o ?? ue.default).geodeticSurfaceNormal(n, Kn.up);
			const i = Kn.up, s = Kn.east;
			s.x = -n.y, s.y = n.x, s.z = 0, H.normalize(s, Kn.east), H.cross(i, s, Kn.north), H.multiplyByScalar(Kn.up, -1, Kn.down), H.multiplyByScalar(Kn.east, -1, Kn.west), H.multiplyByScalar(Kn.north, -1, Kn.south), Jn = Kn[e], eo = Kn[t], to = Kn[r];
		}
		return i[0] = Jn.x, i[1] = Jn.y, i[2] = Jn.z, i[3] = 0, i[4] = eo.x, i[5] = eo.y, i[6] = eo.z, i[7] = 0, i[8] = to.x, i[9] = to.y, i[10] = to.z, i[11] = 0, i[12] = n.x, i[13] = n.y, i[14] = n.z, i[15] = 1, i;
	}, Xn[o] = n), n;
}, Yn.eastNorthUpToFixedFrame = Yn.localFrameToFixedFrameGenerator("east", "north"), Yn.northEastDownToFixedFrame = Yn.localFrameToFixedFrameGenerator("north", "east"), Yn.northUpEastToFixedFrame = Yn.localFrameToFixedFrameGenerator("north", "up"), Yn.northWestUpToFixedFrame = Yn.localFrameToFixedFrameGenerator("north", "west");
const ro = new En(), no = new H(1, 1, 1), oo = new Rr();
Yn.headingPitchRollToFixedFrame = function(e, t, r, n, o) {
	z.typeOf.object("HeadingPitchRoll", t), n = n ?? Yn.eastNorthUpToFixedFrame;
	const i = En.fromHeadingPitchRoll(t, ro), s = Rr.fromTranslationQuaternionRotationScale(H.ZERO, i, no, oo);
	return o = n(e, r, o), Rr.multiply(o, s, o);
};
const io = new Rr(), so = new yr();
Yn.headingPitchRollQuaternion = function(e, t, r, n, o) {
	z.typeOf.object("HeadingPitchRoll", t);
	const i = Yn.headingPitchRollToFixedFrame(e, t, r, n, io), s = Rr.getMatrix3(i, so);
	return En.fromRotationMatrix(s, o);
};
const ao = new H(1, 1, 1), uo = new H(), co = new Rr(), lo = new Rr(), fo = new yr(), ho = new En();
Yn.fixedFrameToHeadingPitchRoll = function(e, t, r, n) {
	z.defined("transform", e), t = t ?? ue.default, r = r ?? Yn.eastNorthUpToFixedFrame, T(n) || (n = new tr());
	const o = Rr.getTranslation(e, uo);
	if (H.equals(o, H.ZERO)) return n.heading = 0, n.pitch = 0, n.roll = 0, n;
	let i = Rr.inverseTransformation(r(o, t, co), co), s = Rr.setScale(e, ao, lo);
	s = Rr.setTranslation(s, H.ZERO, s), i = Rr.multiply(i, s, i);
	let a = En.fromRotationMatrix(Rr.getMatrix3(i, fo), ho);
	return a = En.normalize(a, a), tr.fromQuaternion(a, n);
};
const po = D.TWO_PI / 86400;
let mo = new Je();
Yn.computeIcrfToCentralBodyFixedMatrix = function(e, t) {
	let r = Yn.computeIcrfToFixedMatrix(e, t);
	return T(r) || (r = Yn.computeTemeToPseudoFixedMatrix(e, t)), r;
}, Yn.computeTemeToPseudoFixedMatrix = function(e, t) {
	if (!T(e)) throw new R("date is required.");
	mo = Je.addSeconds(e, -Je.computeTaiMinusUtc(e), mo);
	const r = mo.dayNumber, n = mo.secondsOfDay;
	let o;
	const i = r - 2451545;
	o = n >= 43200 ? (i + .5) / Me.DAYS_PER_JULIAN_CENTURY : (i - .5) / Me.DAYS_PER_JULIAN_CENTURY;
	const s = (24110.54841 + o * (8640184.812866 + o * (.093104 + -62e-7 * o))) * po % D.TWO_PI + (n + .5 * Me.SECONDS_PER_DAY) % Me.SECONDS_PER_DAY * (72921158553e-15 + 11772758384668e-32 * (r - 2451545.5)), a = Math.cos(s), u = Math.sin(s);
	return T(t) ? (t[0] = a, t[1] = -u, t[2] = 0, t[3] = u, t[4] = a, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t) : new yr(a, u, 0, -u, a, 0, 0, 0, 1);
}, Yn.iau2006XysData = new hr(), Yn.earthOrientationParameters = Qt.NONE;
const yo = 32.184;
Yn.preloadIcrfFixed = function(e) {
	const t = e.start.dayNumber, r = e.start.secondsOfDay + yo, n = e.stop.dayNumber, o = e.stop.secondsOfDay + yo;
	return Yn.iau2006XysData.preload(t, r, n, o);
}, Yn.computeIcrfToFixedMatrix = function(e, t) {
	if (!T(e)) throw new R("date is required.");
	T(t) || (t = new yr());
	const r = Yn.computeFixedToIcrfMatrix(e, t);
	if (T(r)) return yr.transpose(r, t);
};
const go = new tr(), bo = new yr(), wo = new Je();
Yn.computeMoonFixedToIcrfMatrix = function(e, t) {
	if (!T(e)) throw new R("date is required.");
	T(t) || (t = new yr());
	const r = Je.addSeconds(e, 32.184, wo), n = Je.totalDays(r) - 2451545, o = D.toRadians(12.112) - D.toRadians(.052992) * n, i = D.toRadians(24.224) - D.toRadians(.105984) * n, s = D.toRadians(227.645) + D.toRadians(13.012) * n, a = D.toRadians(261.105) + D.toRadians(13.340716) * n, u = D.toRadians(358) + D.toRadians(.9856) * n;
	return go.pitch = D.toRadians(180) - D.toRadians(3.878) * Math.sin(o) - D.toRadians(.12) * Math.sin(i) + D.toRadians(.07) * Math.sin(s) - D.toRadians(.017) * Math.sin(a), go.roll = D.toRadians(-23.47) + D.toRadians(1.543) * Math.cos(o) + D.toRadians(.24) * Math.cos(i) - D.toRadians(.028) * Math.cos(s) + D.toRadians(.007) * Math.cos(a), go.heading = D.toRadians(154.375) + D.toRadians(13.17635831) * n + D.toRadians(3.558) * Math.sin(o) + D.toRadians(.121) * Math.sin(i) - D.toRadians(.064) * Math.sin(s) + D.toRadians(.016) * Math.sin(a) + D.toRadians(.025) * Math.sin(u), yr.fromHeadingPitchRoll(go, bo);
}, Yn.computeIcrfToMoonFixedMatrix = function(e, t) {
	if (!T(e)) throw new R("date is required.");
	T(t) || (t = new yr());
	const r = Yn.computeMoonFixedToIcrfMatrix(e, t);
	if (T(r)) return yr.transpose(r, t);
};
const Oo = new fr(0, 0, 0), Eo = new Ae(0, 0, 0, 0, 0, 0), xo = new yr(), _o = new yr();
Yn.computeFixedToIcrfMatrix = function(e, t) {
	if (!T(e)) throw new R("date is required.");
	T(t) || (t = new yr());
	const r = Yn.earthOrientationParameters.compute(e, Eo);
	if (!T(r)) return;
	const n = e.dayNumber, o = e.secondsOfDay + yo, i = Yn.iau2006XysData.computeXysRadians(n, o, Oo);
	if (!T(i)) return;
	const s = i.x + r.xPoleOffset, a = i.y + r.yPoleOffset, u = 1 / (1 + Math.sqrt(1 - s * s - a * a)), c = xo;
	c[0] = 1 - u * s * s, c[3] = -u * s * a, c[6] = s, c[1] = -u * s * a, c[4] = 1 - u * a * a, c[7] = a, c[2] = -s, c[5] = -a, c[8] = 1 - u * (s * s + a * a);
	const l = yr.fromRotationZ(-i.s, _o), f = yr.multiply(c, l, xo), h = e.dayNumber, p = (e.secondsOfDay - Je.computeTaiMinusUtc(e) + r.ut1MinusUtc) / Me.SECONDS_PER_DAY;
	let d = .779057273264 + p + .00273781191135448 * (h - 2451545 + p);
	d = d % 1 * D.TWO_PI;
	const m = yr.fromRotationZ(d, _o), y = yr.multiply(f, m, xo), g = Math.cos(r.xPoleWander), b = Math.cos(r.yPoleWander), w = Math.sin(r.xPoleWander), O = Math.sin(r.yPoleWander);
	let E = n - 2451545 + o / Me.SECONDS_PER_DAY;
	E /= 36525;
	const x = -47e-6 * E * D.RADIANS_PER_DEGREE / 3600, _ = Math.cos(x), S = Math.sin(x), v = _o;
	return v[0] = g * _, v[1] = g * S, v[2] = w, v[3] = -b * S + O * w * _, v[4] = b * _ + O * w * S, v[5] = -O * g, v[6] = -O * S - b * w * _, v[7] = O * _ - b * w * S, v[8] = b * g, yr.multiply(y, v, t);
};
const So = new we();
Yn.pointToWindowCoordinates = function(e, t, r, n) {
	return (n = Yn.pointToGLWindowCoordinates(e, t, r, n)).y = 2 * t[5] - n.y, n;
}, Yn.pointToGLWindowCoordinates = function(e, t, r, n) {
	if (!T(e)) throw new R("modelViewProjectionMatrix is required.");
	if (!T(t)) throw new R("viewportTransformation is required.");
	if (!T(r)) throw new R("point is required.");
	T(n) || (n = new U());
	const o = So;
	return Rr.multiplyByVector(e, we.fromElements(r.x, r.y, r.z, 1, o), o), we.multiplyByScalar(o, 1 / o.w, o), Rr.multiplyByVector(t, o, o), U.fromCartesian4(o, n);
};
const vo = new H(), Co = new H(), jo = new H();
Yn.rotationMatrixFromPositionVelocity = function(e, t, r, n) {
	if (!T(e)) throw new R("position is required.");
	if (!T(t)) throw new R("velocity is required.");
	const o = (r ?? ue.default).geodeticSurfaceNormal(e, vo);
	let i = H.cross(t, o, Co);
	H.equalsEpsilon(i, H.ZERO, D.EPSILON6) && (i = H.clone(H.UNIT_X, i));
	const s = H.cross(i, t, jo);
	return H.normalize(s, s), H.cross(t, s, i), H.negate(i, i), H.normalize(i, i), T(n) || (n = new yr()), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = i.x, n[4] = i.y, n[5] = i.z, n[6] = s.x, n[7] = s.y, n[8] = s.z, n;
}, Yn.SWIZZLE_3D_TO_2D_MATRIX = Object.freeze(new Rr(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
const Ao = new ne(), To = new H(), Ro = new H(), zo = new yr(), Io = new Rr(), Mo = new Rr();
Yn.basisTo2D = function(e, t, r) {
	if (!T(e)) throw new R("projection is required.");
	if (!T(t)) throw new R("matrix is required.");
	if (!T(r)) throw new R("result is required.");
	const n = Rr.getTranslation(t, Ro), o = e.ellipsoid;
	let i;
	if (H.equals(n, H.ZERO)) i = H.clone(H.ZERO, To);
	else {
		const t = o.cartesianToCartographic(n, Ao);
		i = e.project(t, To), H.fromElements(i.z, i.x, i.y, i);
	}
	const s = Yn.eastNorthUpToFixedFrame(n, o, Io), a = Rr.inverseTransformation(s, Mo), u = Rr.getMatrix3(t, zo), c = Rr.multiplyByMatrix3(a, u, r);
	return Rr.multiply(Yn.SWIZZLE_3D_TO_2D_MATRIX, c, r), Rr.setTranslation(r, i, r), r;
}, Yn.ellipsoidTo2DModelMatrix = function(e, t, r) {
	if (!T(e)) throw new R("projection is required.");
	if (!T(t)) throw new R("center is required.");
	if (!T(r)) throw new R("result is required.");
	const n = e.ellipsoid, o = Yn.eastNorthUpToFixedFrame(t, n, Io), i = Rr.inverseTransformation(o, Mo), s = n.cartesianToCartographic(t, Ao), a = e.project(s, To);
	H.fromElements(a.z, a.x, a.y, a);
	const u = Rr.fromTranslation(a, Io);
	return Rr.multiply(Yn.SWIZZLE_3D_TO_2D_MATRIX, i, r), Rr.multiply(u, r, r), r;
};
var qo = class e {
	constructor(e, t, r, n) {
		this.west = e ?? 0, this.south = t ?? 0, this.east = r ?? 0, this.north = n ?? 0;
	}
	get width() {
		return e.computeWidth(this);
	}
	get height() {
		return e.computeHeight(this);
	}
	static pack(e, t, r) {
		return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, t[r++] = e.west, t[r++] = e.south, t[r++] = e.east, t[r] = e.north, t;
	}
	static unpack(t, r, n) {
		return z.defined("array", t), r = r ?? 0, T(n) || (n = new e()), n.west = t[r++], n.south = t[r++], n.east = t[r++], n.north = t[r], n;
	}
	static computeWidth(e) {
		z.typeOf.object("rectangle", e);
		let t = e.east;
		const r = e.west;
		return t < r && (t += D.TWO_PI), t - r;
	}
	static computeHeight(e) {
		return z.typeOf.object("rectangle", e), e.north - e.south;
	}
	static fromDegrees(t, r, n, o, i) {
		return t = D.toRadians(t ?? 0), r = D.toRadians(r ?? 0), n = D.toRadians(n ?? 0), o = D.toRadians(o ?? 0), T(i) ? (i.west = t, i.south = r, i.east = n, i.north = o, i) : new e(t, r, n, o);
	}
	static fromRadians(t, r, n, o, i) {
		return T(i) ? (i.west = t ?? 0, i.south = r ?? 0, i.east = n ?? 0, i.north = o ?? 0, i) : new e(t, r, n, o);
	}
	static fromCartographicArray(t, r) {
		z.defined("cartographics", t);
		let n = Number.MAX_VALUE, o = -Number.MAX_VALUE, i = Number.MAX_VALUE, s = -Number.MAX_VALUE, a = Number.MAX_VALUE, u = -Number.MAX_VALUE;
		for (let e = 0, c = t.length; e < c; e++) {
			const r = t[e];
			n = Math.min(n, r.longitude), o = Math.max(o, r.longitude), a = Math.min(a, r.latitude), u = Math.max(u, r.latitude);
			const c = r.longitude >= 0 ? r.longitude : r.longitude + D.TWO_PI;
			i = Math.min(i, c), s = Math.max(s, c);
		}
		return o - n > s - i && (n = i, o = s, o > D.PI && (o -= D.TWO_PI), n > D.PI && (n -= D.TWO_PI)), T(r) ? (r.west = n, r.south = a, r.east = o, r.north = u, r) : new e(n, a, o, u);
	}
	static fromCartesianArray(t, r, n) {
		z.defined("cartesians", t), r = r ?? ue.default;
		let o = Number.MAX_VALUE, i = -Number.MAX_VALUE, s = Number.MAX_VALUE, a = -Number.MAX_VALUE, u = Number.MAX_VALUE, c = -Number.MAX_VALUE;
		for (let e = 0, l = t.length; e < l; e++) {
			const n = r.cartesianToCartographic(t[e]);
			o = Math.min(o, n.longitude), i = Math.max(i, n.longitude), u = Math.min(u, n.latitude), c = Math.max(c, n.latitude);
			const l = n.longitude >= 0 ? n.longitude : n.longitude + D.TWO_PI;
			s = Math.min(s, l), a = Math.max(a, l);
		}
		return i - o > a - s && (o = s, i = a, i > D.PI && (i -= D.TWO_PI), o > D.PI && (o -= D.TWO_PI)), T(n) ? (n.west = o, n.south = u, n.east = i, n.north = c, n) : new e(o, u, i, c);
	}
	static fromBoundingSphere(t, r, n) {
		z.typeOf.object("boundingSphere", t);
		const o = t.center, i = t.radius;
		if (T(r) || (r = ue.default), T(n) || (n = new e()), H.equals(o, H.ZERO)) return e.clone(e.MAX_VALUE, n), n;
		const s = Yn.eastNorthUpToFixedFrame(o, r, Po), a = Rr.multiplyByPointAsVector(s, H.UNIT_X, No);
		H.normalize(a, a);
		const u = Rr.multiplyByPointAsVector(s, H.UNIT_Y, Do);
		H.normalize(u, u), H.multiplyByScalar(u, i, u), H.multiplyByScalar(a, i, a);
		const c = H.negate(u, Lo), l = H.negate(a, Fo), f = Uo;
		let h = f[0];
		return H.add(o, u, h), h = f[1], H.add(o, l, h), h = f[2], H.add(o, c, h), h = f[3], H.add(o, a, h), f[4] = o, e.fromCartesianArray(f, r, n);
	}
	static clone(t, r) {
		if (T(t)) return T(r) ? (r.west = t.west, r.south = t.south, r.east = t.east, r.north = t.north, r) : new e(t.west, t.south, t.east, t.north);
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || T(e) && T(t) && Math.abs(e.west - t.west) <= r && Math.abs(e.south - t.south) <= r && Math.abs(e.east - t.east) <= r && Math.abs(e.north - t.north) <= r;
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	static equals(e, t) {
		return e === t || T(e) && T(t) && e.west === t.west && e.south === t.south && e.east === t.east && e.north === t.north;
	}
	equalsEpsilon(t, r) {
		return e.equalsEpsilon(this, t, r);
	}
	static _validate(e) {
		z.typeOf.object("rectangle", e);
		const t = e.north;
		z.typeOf.number.greaterThanOrEquals("north", t, -D.PI_OVER_TWO), z.typeOf.number.lessThanOrEquals("north", t, D.PI_OVER_TWO);
		const r = e.south;
		z.typeOf.number.greaterThanOrEquals("south", r, -D.PI_OVER_TWO), z.typeOf.number.lessThanOrEquals("south", r, D.PI_OVER_TWO);
		const n = e.west;
		z.typeOf.number.greaterThanOrEquals("west", n, -Math.PI), z.typeOf.number.lessThanOrEquals("west", n, Math.PI);
		const o = e.east;
		z.typeOf.number.greaterThanOrEquals("east", o, -Math.PI), z.typeOf.number.lessThanOrEquals("east", o, Math.PI);
	}
	static southwest(e, t) {
		return z.typeOf.object("rectangle", e), T(t) ? (t.longitude = e.west, t.latitude = e.south, t.height = 0, t) : new ne(e.west, e.south);
	}
	static northwest(e, t) {
		return z.typeOf.object("rectangle", e), T(t) ? (t.longitude = e.west, t.latitude = e.north, t.height = 0, t) : new ne(e.west, e.north);
	}
	static northeast(e, t) {
		return z.typeOf.object("rectangle", e), T(t) ? (t.longitude = e.east, t.latitude = e.north, t.height = 0, t) : new ne(e.east, e.north);
	}
	static southeast(e, t) {
		return z.typeOf.object("rectangle", e), T(t) ? (t.longitude = e.east, t.latitude = e.south, t.height = 0, t) : new ne(e.east, e.south);
	}
	static center(e, t) {
		z.typeOf.object("rectangle", e);
		let r = e.east;
		const n = e.west;
		r < n && (r += D.TWO_PI);
		const o = D.negativePiToPi(.5 * (n + r)), i = .5 * (e.south + e.north);
		return T(t) ? (t.longitude = o, t.latitude = i, t.height = 0, t) : new ne(o, i);
	}
	static intersection(t, r, n) {
		z.typeOf.object("rectangle", t), z.typeOf.object("otherRectangle", r);
		let o = t.east, i = t.west, s = r.east, a = r.west;
		o < i && s > 0 ? o += D.TWO_PI : s < a && o > 0 && (s += D.TWO_PI), o < i && a < 0 ? a += D.TWO_PI : s < a && i < 0 && (i += D.TWO_PI);
		const u = D.negativePiToPi(Math.max(i, a)), c = D.negativePiToPi(Math.min(o, s));
		if ((t.west < t.east || r.west < r.east) && c <= u) return;
		const l = Math.max(t.south, r.south), f = Math.min(t.north, r.north);
		return l >= f ? void 0 : T(n) ? (n.west = u, n.south = l, n.east = c, n.north = f, n) : new e(u, l, c, f);
	}
	static simpleIntersection(t, r, n) {
		z.typeOf.object("rectangle", t), z.typeOf.object("otherRectangle", r);
		const o = Math.max(t.west, r.west), i = Math.max(t.south, r.south), s = Math.min(t.east, r.east), a = Math.min(t.north, r.north);
		if (!(i >= a || o >= s)) return T(n) ? (n.west = o, n.south = i, n.east = s, n.north = a, n) : new e(o, i, s, a);
	}
	static union(t, r, n) {
		z.typeOf.object("rectangle", t), z.typeOf.object("otherRectangle", r), T(n) || (n = new e());
		let o = t.east, i = t.west, s = r.east, a = r.west;
		o < i && s > 0 ? o += D.TWO_PI : s < a && o > 0 && (s += D.TWO_PI), o < i && a < 0 ? a += D.TWO_PI : s < a && i < 0 && (i += D.TWO_PI);
		const u = D.negativePiToPi(Math.min(i, a)), c = D.negativePiToPi(Math.max(o, s));
		return n.west = u, n.south = Math.min(t.south, r.south), n.east = c, n.north = Math.max(t.north, r.north), n;
	}
	static expand(t, r, n) {
		return z.typeOf.object("rectangle", t), z.typeOf.object("cartographic", r), T(n) || (n = new e()), n.west = Math.min(t.west, r.longitude), n.south = Math.min(t.south, r.latitude), n.east = Math.max(t.east, r.longitude), n.north = Math.max(t.north, r.latitude), n;
	}
	static contains(e, t) {
		z.typeOf.object("rectangle", e), z.typeOf.object("cartographic", t);
		let r = t.longitude;
		const n = t.latitude, o = e.west;
		let i = e.east;
		return i < o && (i += D.TWO_PI, r < 0 && (r += D.TWO_PI)), (r > o || D.equalsEpsilon(r, o, D.EPSILON14)) && (r < i || D.equalsEpsilon(r, i, D.EPSILON14)) && n >= e.south && n <= e.north;
	}
	static subsample(t, r, n, o) {
		z.typeOf.object("rectangle", t), r = r ?? ue.default, n = n ?? 0, T(o) || (o = []);
		let i = 0;
		const s = t.north, a = t.south, u = t.east, c = t.west, l = ko;
		l.height = n, l.longitude = c, l.latitude = s, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.longitude = u, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.latitude = a, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.longitude = c, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.latitude = s < 0 ? s : a > 0 ? a : 0;
		for (let f = 1; f < 8; ++f) l.longitude = -Math.PI + f * D.PI_OVER_TWO, e.contains(t, l) && (o[i] = r.cartographicToCartesian(l, o[i]), i++);
		return 0 === l.latitude && (l.longitude = c, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.longitude = u, o[i] = r.cartographicToCartesian(l, o[i]), i++), o.length = i, o;
	}
	static subsection(t, r, n, o, i, s) {
		if (z.typeOf.object("rectangle", t), z.typeOf.number.greaterThanOrEquals("westLerp", r, 0), z.typeOf.number.lessThanOrEquals("westLerp", r, 1), z.typeOf.number.greaterThanOrEquals("southLerp", n, 0), z.typeOf.number.lessThanOrEquals("southLerp", n, 1), z.typeOf.number.greaterThanOrEquals("eastLerp", o, 0), z.typeOf.number.lessThanOrEquals("eastLerp", o, 1), z.typeOf.number.greaterThanOrEquals("northLerp", i, 0), z.typeOf.number.lessThanOrEquals("northLerp", i, 1), z.typeOf.number.lessThanOrEquals("westLerp", r, o), z.typeOf.number.lessThanOrEquals("southLerp", n, i), T(s) || (s = new e()), t.west <= t.east) {
			const e = t.east - t.west;
			s.west = t.west + r * e, s.east = t.west + o * e;
		} else {
			const e = D.TWO_PI + t.east - t.west;
			s.west = D.negativePiToPi(t.west + r * e), s.east = D.negativePiToPi(t.west + o * e);
		}
		const a = t.north - t.south;
		return s.south = t.south + n * a, s.north = t.south + i * a, 1 === r && (s.west = t.east), 1 === o && (s.east = t.east), 1 === n && (s.south = t.north), 1 === i && (s.north = t.north), s;
	}
};
qo.packedLength = 4;
const Po = new Rr(), No = new H(), Do = new H(), Fo = new H(), Lo = new H(), Uo = new Array(5);
for (let Fs = 0; Fs < Uo.length; ++Fs) Uo[Fs] = new H();
const ko = new ne();
function Bo(e, t, r, n) {
	this.x = e ?? 0, this.y = t ?? 0, this.width = r ?? 0, this.height = n ?? 0;
}
qo.MAX_VALUE = Object.freeze(new qo(-Math.PI, -D.PI_OVER_TWO, Math.PI, D.PI_OVER_TWO)), Bo.packedLength = 4, Bo.pack = function(e, t, r) {
	return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.width, t[r] = e.height, t;
}, Bo.unpack = function(e, t, r) {
	return z.defined("array", e), t = t ?? 0, T(r) || (r = new Bo()), r.x = e[t++], r.y = e[t++], r.width = e[t++], r.height = e[t], r;
}, Bo.fromPoints = function(e, t) {
	if (T(t) || (t = new Bo()), !T(e) || 0 === e.length) return t.x = 0, t.y = 0, t.width = 0, t.height = 0, t;
	const r = e.length;
	let n = e[0].x, o = e[0].y, i = e[0].x, s = e[0].y;
	for (let a = 1; a < r; a++) {
		const t = e[a], r = t.x, u = t.y;
		n = Math.min(r, n), i = Math.max(r, i), o = Math.min(u, o), s = Math.max(u, s);
	}
	return t.x = n, t.y = o, t.width = i - n, t.height = s - o, t;
};
const Wo = new class {
	constructor(e) {
		this._ellipsoid = e ?? ue.default, this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
	}
	get ellipsoid() {
		return this._ellipsoid;
	}
	project(e, t) {
		const r = this._semimajorAxis, n = e.longitude * r, o = e.latitude * r, i = e.height;
		return T(t) ? (t.x = n, t.y = o, t.z = i, t) : new H(n, o, i);
	}
	unproject(e, t) {
		if (!T(e)) throw new R("cartesian is required");
		const r = this._oneOverSemimajorAxis, n = e.x * r, o = e.y * r, i = e.z;
		return T(t) ? (t.longitude = n, t.latitude = o, t.height = i, t) : new ne(n, o, i);
	}
}(), $o = new ne(), Go = new ne();
function Ho(e, t, r) {
	return r < 0 && (r += 1), r > 1 && (r -= 1), 6 * r < 1 ? e + 6 * (t - e) * r : 2 * r < 1 ? t : 3 * r < 2 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
Bo.fromRectangle = function(e, t, r) {
	if (T(r) || (r = new Bo()), !T(e)) return r.x = 0, r.y = 0, r.width = 0, r.height = 0, r;
	Wo._ellipsoid = ue.default;
	const n = (t = t ?? Wo).project(qo.southwest(e, $o)), o = t.project(qo.northeast(e, Go));
	return U.subtract(o, n, o), r.x = n.x, r.y = n.y, r.width = o.x, r.height = o.y, r;
}, Bo.clone = function(e, t) {
	if (T(e)) return T(t) ? (t.x = e.x, t.y = e.y, t.width = e.width, t.height = e.height, t) : new Bo(e.x, e.y, e.width, e.height);
}, Bo.union = function(e, t, r) {
	z.typeOf.object("left", e), z.typeOf.object("right", t), T(r) || (r = new Bo());
	const n = Math.min(e.x, t.x), o = Math.min(e.y, t.y), i = Math.max(e.x + e.width, t.x + t.width), s = Math.max(e.y + e.height, t.y + t.height);
	return r.x = n, r.y = o, r.width = i - n, r.height = s - o, r;
}, Bo.expand = function(e, t, r) {
	z.typeOf.object("rectangle", e), z.typeOf.object("point", t), r = Bo.clone(e, r);
	const n = t.x - r.x, o = t.y - r.y;
	return n > r.width ? r.width = n : n < 0 && (r.width -= n, r.x = t.x), o > r.height ? r.height = o : o < 0 && (r.height -= o, r.y = t.y), r;
}, Bo.intersect = function(e, t) {
	z.typeOf.object("left", e), z.typeOf.object("right", t);
	const r = e.x, n = e.y, o = t.x, i = t.y;
	return r > o + t.width || r + e.width < o || n + e.height < i || n > i + t.height ? be.OUTSIDE : be.INTERSECTING;
}, Bo.equals = function(e, t) {
	return e === t || T(e) && T(t) && e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}, Bo.prototype.clone = function(e) {
	return Bo.clone(this, e);
}, Bo.prototype.intersect = function(e) {
	return Bo.intersect(this, e);
}, Bo.prototype.equals = function(e) {
	return Bo.equals(this, e);
};
var Vo = class e {
	constructor(e, t, r, n) {
		this.red = e ?? 1, this.green = t ?? 1, this.blue = r ?? 1, this.alpha = n ?? 1;
	}
	static fromCartesian4(t, r) {
		return z.typeOf.object("cartesian", t), T(r) ? (r.red = t.x, r.green = t.y, r.blue = t.z, r.alpha = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static fromBytes(t, r, n, o, i) {
		return t = e.byteToFloat(t ?? 255), r = e.byteToFloat(r ?? 255), n = e.byteToFloat(n ?? 255), o = e.byteToFloat(o ?? 255), T(i) ? (i.red = t, i.green = r, i.blue = n, i.alpha = o, i) : new e(t, r, n, o);
	}
	static fromAlpha(t, r, n) {
		return z.typeOf.object("color", t), z.typeOf.number("alpha", r), T(n) ? (n.red = t.red, n.green = t.green, n.blue = t.blue, n.alpha = r, n) : new e(t.red, t.green, t.blue, r);
	}
	static fromRgba(t, r) {
		return Qo[0] = t, e.fromBytes(Zo[0], Zo[1], Zo[2], Zo[3], r);
	}
	static fromHsl(t, r, n, o, i) {
		t = (t ?? 0) % 1, o = o ?? 1;
		let s = n = n ?? 0, a = n, u = n;
		if (0 !== (r = r ?? 0)) {
			let e;
			e = n < .5 ? n * (1 + r) : n + r - n * r;
			const o = 2 * n - e;
			s = Ho(o, e, t + 1 / 3), a = Ho(o, e, t), u = Ho(o, e, t - 1 / 3);
		}
		return T(i) ? (i.red = s, i.green = a, i.blue = u, i.alpha = o, i) : new e(s, a, u, o);
	}
	static fromRandom(t, r) {
		let n = (t = t ?? A.EMPTY_OBJECT).red;
		if (!T(n)) {
			const e = t.minimumRed ?? 0, r = t.maximumRed ?? 1;
			z.typeOf.number.lessThanOrEquals("minimumRed", e, r), n = e + D.nextRandomNumber() * (r - e);
		}
		let o = t.green;
		if (!T(o)) {
			const e = t.minimumGreen ?? 0, r = t.maximumGreen ?? 1;
			z.typeOf.number.lessThanOrEquals("minimumGreen", e, r), o = e + D.nextRandomNumber() * (r - e);
		}
		let i = t.blue;
		if (!T(i)) {
			const e = t.minimumBlue ?? 0, r = t.maximumBlue ?? 1;
			z.typeOf.number.lessThanOrEquals("minimumBlue", e, r), i = e + D.nextRandomNumber() * (r - e);
		}
		let s = t.alpha;
		if (!T(s)) {
			const e = t.minimumAlpha ?? 0, r = t.maximumAlpha ?? 1;
			z.typeOf.number.lessThanOrEquals("minimumAlpha", e, r), s = e + D.nextRandomNumber() * (r - e);
		}
		return T(r) ? (r.red = n, r.green = o, r.blue = i, r.alpha = s, r) : new e(n, o, i, s);
	}
	static fromCssColorString(t, r) {
		z.typeOf.string("color", t), T(r) || (r = new e()), t = t.trim();
		const n = e[t.toUpperCase()];
		if (T(n)) return e.clone(n, r), r;
		let o = Xo.exec(t);
		return null !== o ? (r.red = parseInt(o[1], 16) / 15, r.green = parseInt(o[2], 16) / 15, r.blue = parseInt(o[3], 16) / 15, r.alpha = parseInt(o[4] ?? "f", 16) / 15, r) : (o = Ko.exec(t), null !== o ? (r.red = parseInt(o[1], 16) / 255, r.green = parseInt(o[2], 16) / 255, r.blue = parseInt(o[3], 16) / 255, r.alpha = parseInt(o[4] ?? "ff", 16) / 255, r) : (o = Jo.exec(t), null !== o ? (r.red = parseFloat(o[1]) / ("%" === o[1].substr(-1) ? 100 : 255), r.green = parseFloat(o[2]) / ("%" === o[2].substr(-1) ? 100 : 255), r.blue = parseFloat(o[3]) / ("%" === o[3].substr(-1) ? 100 : 255), r.alpha = parseFloat(o[4] ?? "1.0"), r) : (o = ei.exec(t), null !== o ? e.fromHsl(parseFloat(o[1]) / 360, parseFloat(o[2]) / 100, parseFloat(o[3]) / 100, parseFloat(o[4] ?? "1.0"), r) : r = void 0)));
	}
	static pack(e, t, r) {
		return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, t[r++] = e.red, t[r++] = e.green, t[r++] = e.blue, t[r] = e.alpha, t;
	}
	static unpack(t, r, n) {
		return z.defined("array", t), r = r ?? 0, T(n) || (n = new e()), n.red = t[r++], n.green = t[r++], n.blue = t[r++], n.alpha = t[r], n;
	}
	static byteToFloat(e) {
		return e / 255;
	}
	static floatToByte(e) {
		return 1 === e ? 255 : 256 * e | 0;
	}
	static clone(t, r) {
		if (T(t)) return T(r) ? (r.red = t.red, r.green = t.green, r.blue = t.blue, r.alpha = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static equals(e, t) {
		return e === t || T(e) && T(t) && e.red === t.red && e.green === t.green && e.blue === t.blue && e.alpha === t.alpha;
	}
	static equalsArray(e, t, r) {
		return e.red === t[r] && e.green === t[r + 1] && e.blue === t[r + 2] && e.alpha === t[r + 3];
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	equalsEpsilon(e, t) {
		return this === e || T(e) && Math.abs(this.red - e.red) <= t && Math.abs(this.green - e.green) <= t && Math.abs(this.blue - e.blue) <= t && Math.abs(this.alpha - e.alpha) <= t;
	}
	toString() {
		return `(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
	}
	toCssColorString() {
		const t = e.floatToByte(this.red), r = e.floatToByte(this.green), n = e.floatToByte(this.blue);
		return 1 === this.alpha ? `rgb(${t},${r},${n})` : `rgba(${t},${r},${n},${this.alpha})`;
	}
	toCssHexString() {
		let t = e.floatToByte(this.red).toString(16);
		t.length < 2 && (t = `0${t}`);
		let r = e.floatToByte(this.green).toString(16);
		r.length < 2 && (r = `0${r}`);
		let n = e.floatToByte(this.blue).toString(16);
		if (n.length < 2 && (n = `0${n}`), this.alpha < 1) {
			let o = e.floatToByte(this.alpha).toString(16);
			return o.length < 2 && (o = `0${o}`), `#${t}${r}${n}${o}`;
		}
		return `#${t}${r}${n}`;
	}
	toBytes(t) {
		const r = e.floatToByte(this.red), n = e.floatToByte(this.green), o = e.floatToByte(this.blue), i = e.floatToByte(this.alpha);
		return T(t) ? (t[0] = r, t[1] = n, t[2] = o, t[3] = i, t) : [
			r,
			n,
			o,
			i
		];
	}
	static bytesToRgba(e, t, r, n) {
		return Zo[0] = e, Zo[1] = t, Zo[2] = r, Zo[3] = n, Qo[0];
	}
	toRgba() {
		return e.bytesToRgba(e.floatToByte(this.red), e.floatToByte(this.green), e.floatToByte(this.blue), e.floatToByte(this.alpha));
	}
	brighten(e, t) {
		return z.typeOf.number("magnitude", e), z.typeOf.number.greaterThanOrEquals("magnitude", e, 0), z.typeOf.object("result", t), e = 1 - e, t.red = 1 - (1 - this.red) * e, t.green = 1 - (1 - this.green) * e, t.blue = 1 - (1 - this.blue) * e, t.alpha = this.alpha, t;
	}
	darken(e, t) {
		return z.typeOf.number("magnitude", e), z.typeOf.number.greaterThanOrEquals("magnitude", e, 0), z.typeOf.object("result", t), e = 1 - e, t.red = this.red * e, t.green = this.green * e, t.blue = this.blue * e, t.alpha = this.alpha, t;
	}
	withAlpha(t, r) {
		return e.fromAlpha(this, t, r);
	}
	static add(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.red = e.red + t.red, r.green = e.green + t.green, r.blue = e.blue + t.blue, r.alpha = e.alpha + t.alpha, r;
	}
	static subtract(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.red = e.red - t.red, r.green = e.green - t.green, r.blue = e.blue - t.blue, r.alpha = e.alpha - t.alpha, r;
	}
	static multiply(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.red = e.red * t.red, r.green = e.green * t.green, r.blue = e.blue * t.blue, r.alpha = e.alpha * t.alpha, r;
	}
	static divide(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.red = e.red / t.red, r.green = e.green / t.green, r.blue = e.blue / t.blue, r.alpha = e.alpha / t.alpha, r;
	}
	static mod(e, t, r) {
		return z.typeOf.object("left", e), z.typeOf.object("right", t), z.typeOf.object("result", r), r.red = e.red % t.red, r.green = e.green % t.green, r.blue = e.blue % t.blue, r.alpha = e.alpha % t.alpha, r;
	}
	static lerp(e, t, r, n) {
		return z.typeOf.object("start", e), z.typeOf.object("end", t), z.typeOf.number("t", r), z.typeOf.object("result", n), n.red = D.lerp(e.red, t.red, r), n.green = D.lerp(e.green, t.green, r), n.blue = D.lerp(e.blue, t.blue, r), n.alpha = D.lerp(e.alpha, t.alpha, r), n;
	}
	static multiplyByScalar(e, t, r) {
		return z.typeOf.object("color", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r.red = e.red * t, r.green = e.green * t, r.blue = e.blue * t, r.alpha = e.alpha * t, r;
	}
	static divideByScalar(e, t, r) {
		return z.typeOf.object("color", e), z.typeOf.number("scalar", t), z.typeOf.object("result", r), r.red = e.red / t, r.green = e.green / t, r.blue = e.blue / t, r.alpha = e.alpha / t, r;
	}
};
let Yo, Qo, Zo;
On.supportsTypedArrays() && (Yo = /* @__PURE__ */ new ArrayBuffer(4), Qo = new Uint32Array(Yo), Zo = new Uint8Array(Yo));
const Xo = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i, Ko = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i, Jo = /^rgba?\s*\(\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i, ei = /^hsla?\s*\(\s*([0-9.]+)\s*[,\s]+\s*([0-9.]+%)\s*[,\s]+\s*([0-9.]+%)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
function ti(e, t) {
	if (z.typeOf.object("normal", e), !D.equalsEpsilon(H.magnitude(e), 1, D.EPSILON6)) throw new R("normal must be normalized.");
	z.typeOf.number("distance", t), this.normal = H.clone(e), this.distance = t;
}
Vo.packedLength = 4, Vo.ALICEBLUE = Object.freeze(Vo.fromCssColorString("#F0F8FF")), Vo.ANTIQUEWHITE = Object.freeze(Vo.fromCssColorString("#FAEBD7")), Vo.AQUA = Object.freeze(Vo.fromCssColorString("#00FFFF")), Vo.AQUAMARINE = Object.freeze(Vo.fromCssColorString("#7FFFD4")), Vo.AZURE = Object.freeze(Vo.fromCssColorString("#F0FFFF")), Vo.BEIGE = Object.freeze(Vo.fromCssColorString("#F5F5DC")), Vo.BISQUE = Object.freeze(Vo.fromCssColorString("#FFE4C4")), Vo.BLACK = Object.freeze(Vo.fromCssColorString("#000000")), Vo.BLANCHEDALMOND = Object.freeze(Vo.fromCssColorString("#FFEBCD")), Vo.BLUE = Object.freeze(Vo.fromCssColorString("#0000FF")), Vo.BLUEVIOLET = Object.freeze(Vo.fromCssColorString("#8A2BE2")), Vo.BROWN = Object.freeze(Vo.fromCssColorString("#A52A2A")), Vo.BURLYWOOD = Object.freeze(Vo.fromCssColorString("#DEB887")), Vo.CADETBLUE = Object.freeze(Vo.fromCssColorString("#5F9EA0")), Vo.CHARTREUSE = Object.freeze(Vo.fromCssColorString("#7FFF00")), Vo.CHOCOLATE = Object.freeze(Vo.fromCssColorString("#D2691E")), Vo.CORAL = Object.freeze(Vo.fromCssColorString("#FF7F50")), Vo.CORNFLOWERBLUE = Object.freeze(Vo.fromCssColorString("#6495ED")), Vo.CORNSILK = Object.freeze(Vo.fromCssColorString("#FFF8DC")), Vo.CRIMSON = Object.freeze(Vo.fromCssColorString("#DC143C")), Vo.CYAN = Object.freeze(Vo.fromCssColorString("#00FFFF")), Vo.DARKBLUE = Object.freeze(Vo.fromCssColorString("#00008B")), Vo.DARKCYAN = Object.freeze(Vo.fromCssColorString("#008B8B")), Vo.DARKGOLDENROD = Object.freeze(Vo.fromCssColorString("#B8860B")), Vo.DARKGRAY = Object.freeze(Vo.fromCssColorString("#A9A9A9")), Vo.DARKGREEN = Object.freeze(Vo.fromCssColorString("#006400")), Vo.DARKGREY = Vo.DARKGRAY, Vo.DARKKHAKI = Object.freeze(Vo.fromCssColorString("#BDB76B")), Vo.DARKMAGENTA = Object.freeze(Vo.fromCssColorString("#8B008B")), Vo.DARKOLIVEGREEN = Object.freeze(Vo.fromCssColorString("#556B2F")), Vo.DARKORANGE = Object.freeze(Vo.fromCssColorString("#FF8C00")), Vo.DARKORCHID = Object.freeze(Vo.fromCssColorString("#9932CC")), Vo.DARKRED = Object.freeze(Vo.fromCssColorString("#8B0000")), Vo.DARKSALMON = Object.freeze(Vo.fromCssColorString("#E9967A")), Vo.DARKSEAGREEN = Object.freeze(Vo.fromCssColorString("#8FBC8F")), Vo.DARKSLATEBLUE = Object.freeze(Vo.fromCssColorString("#483D8B")), Vo.DARKSLATEGRAY = Object.freeze(Vo.fromCssColorString("#2F4F4F")), Vo.DARKSLATEGREY = Vo.DARKSLATEGRAY, Vo.DARKTURQUOISE = Object.freeze(Vo.fromCssColorString("#00CED1")), Vo.DARKVIOLET = Object.freeze(Vo.fromCssColorString("#9400D3")), Vo.DEEPPINK = Object.freeze(Vo.fromCssColorString("#FF1493")), Vo.DEEPSKYBLUE = Object.freeze(Vo.fromCssColorString("#00BFFF")), Vo.DIMGRAY = Object.freeze(Vo.fromCssColorString("#696969")), Vo.DIMGREY = Vo.DIMGRAY, Vo.DODGERBLUE = Object.freeze(Vo.fromCssColorString("#1E90FF")), Vo.FIREBRICK = Object.freeze(Vo.fromCssColorString("#B22222")), Vo.FLORALWHITE = Object.freeze(Vo.fromCssColorString("#FFFAF0")), Vo.FORESTGREEN = Object.freeze(Vo.fromCssColorString("#228B22")), Vo.FUCHSIA = Object.freeze(Vo.fromCssColorString("#FF00FF")), Vo.GAINSBORO = Object.freeze(Vo.fromCssColorString("#DCDCDC")), Vo.GHOSTWHITE = Object.freeze(Vo.fromCssColorString("#F8F8FF")), Vo.GOLD = Object.freeze(Vo.fromCssColorString("#FFD700")), Vo.GOLDENROD = Object.freeze(Vo.fromCssColorString("#DAA520")), Vo.GRAY = Object.freeze(Vo.fromCssColorString("#808080")), Vo.GREEN = Object.freeze(Vo.fromCssColorString("#008000")), Vo.GREENYELLOW = Object.freeze(Vo.fromCssColorString("#ADFF2F")), Vo.GREY = Vo.GRAY, Vo.HONEYDEW = Object.freeze(Vo.fromCssColorString("#F0FFF0")), Vo.HOTPINK = Object.freeze(Vo.fromCssColorString("#FF69B4")), Vo.INDIANRED = Object.freeze(Vo.fromCssColorString("#CD5C5C")), Vo.INDIGO = Object.freeze(Vo.fromCssColorString("#4B0082")), Vo.IVORY = Object.freeze(Vo.fromCssColorString("#FFFFF0")), Vo.KHAKI = Object.freeze(Vo.fromCssColorString("#F0E68C")), Vo.LAVENDER = Object.freeze(Vo.fromCssColorString("#E6E6FA")), Vo.LAVENDAR_BLUSH = Object.freeze(Vo.fromCssColorString("#FFF0F5")), Vo.LAWNGREEN = Object.freeze(Vo.fromCssColorString("#7CFC00")), Vo.LEMONCHIFFON = Object.freeze(Vo.fromCssColorString("#FFFACD")), Vo.LIGHTBLUE = Object.freeze(Vo.fromCssColorString("#ADD8E6")), Vo.LIGHTCORAL = Object.freeze(Vo.fromCssColorString("#F08080")), Vo.LIGHTCYAN = Object.freeze(Vo.fromCssColorString("#E0FFFF")), Vo.LIGHTGOLDENRODYELLOW = Object.freeze(Vo.fromCssColorString("#FAFAD2")), Vo.LIGHTGRAY = Object.freeze(Vo.fromCssColorString("#D3D3D3")), Vo.LIGHTGREEN = Object.freeze(Vo.fromCssColorString("#90EE90")), Vo.LIGHTGREY = Vo.LIGHTGRAY, Vo.LIGHTPINK = Object.freeze(Vo.fromCssColorString("#FFB6C1")), Vo.LIGHTSEAGREEN = Object.freeze(Vo.fromCssColorString("#20B2AA")), Vo.LIGHTSKYBLUE = Object.freeze(Vo.fromCssColorString("#87CEFA")), Vo.LIGHTSLATEGRAY = Object.freeze(Vo.fromCssColorString("#778899")), Vo.LIGHTSLATEGREY = Vo.LIGHTSLATEGRAY, Vo.LIGHTSTEELBLUE = Object.freeze(Vo.fromCssColorString("#B0C4DE")), Vo.LIGHTYELLOW = Object.freeze(Vo.fromCssColorString("#FFFFE0")), Vo.LIME = Object.freeze(Vo.fromCssColorString("#00FF00")), Vo.LIMEGREEN = Object.freeze(Vo.fromCssColorString("#32CD32")), Vo.LINEN = Object.freeze(Vo.fromCssColorString("#FAF0E6")), Vo.MAGENTA = Object.freeze(Vo.fromCssColorString("#FF00FF")), Vo.MAROON = Object.freeze(Vo.fromCssColorString("#800000")), Vo.MEDIUMAQUAMARINE = Object.freeze(Vo.fromCssColorString("#66CDAA")), Vo.MEDIUMBLUE = Object.freeze(Vo.fromCssColorString("#0000CD")), Vo.MEDIUMORCHID = Object.freeze(Vo.fromCssColorString("#BA55D3")), Vo.MEDIUMPURPLE = Object.freeze(Vo.fromCssColorString("#9370DB")), Vo.MEDIUMSEAGREEN = Object.freeze(Vo.fromCssColorString("#3CB371")), Vo.MEDIUMSLATEBLUE = Object.freeze(Vo.fromCssColorString("#7B68EE")), Vo.MEDIUMSPRINGGREEN = Object.freeze(Vo.fromCssColorString("#00FA9A")), Vo.MEDIUMTURQUOISE = Object.freeze(Vo.fromCssColorString("#48D1CC")), Vo.MEDIUMVIOLETRED = Object.freeze(Vo.fromCssColorString("#C71585")), Vo.MIDNIGHTBLUE = Object.freeze(Vo.fromCssColorString("#191970")), Vo.MINTCREAM = Object.freeze(Vo.fromCssColorString("#F5FFFA")), Vo.MISTYROSE = Object.freeze(Vo.fromCssColorString("#FFE4E1")), Vo.MOCCASIN = Object.freeze(Vo.fromCssColorString("#FFE4B5")), Vo.NAVAJOWHITE = Object.freeze(Vo.fromCssColorString("#FFDEAD")), Vo.NAVY = Object.freeze(Vo.fromCssColorString("#000080")), Vo.OLDLACE = Object.freeze(Vo.fromCssColorString("#FDF5E6")), Vo.OLIVE = Object.freeze(Vo.fromCssColorString("#808000")), Vo.OLIVEDRAB = Object.freeze(Vo.fromCssColorString("#6B8E23")), Vo.ORANGE = Object.freeze(Vo.fromCssColorString("#FFA500")), Vo.ORANGERED = Object.freeze(Vo.fromCssColorString("#FF4500")), Vo.ORCHID = Object.freeze(Vo.fromCssColorString("#DA70D6")), Vo.PALEGOLDENROD = Object.freeze(Vo.fromCssColorString("#EEE8AA")), Vo.PALEGREEN = Object.freeze(Vo.fromCssColorString("#98FB98")), Vo.PALETURQUOISE = Object.freeze(Vo.fromCssColorString("#AFEEEE")), Vo.PALEVIOLETRED = Object.freeze(Vo.fromCssColorString("#DB7093")), Vo.PAPAYAWHIP = Object.freeze(Vo.fromCssColorString("#FFEFD5")), Vo.PEACHPUFF = Object.freeze(Vo.fromCssColorString("#FFDAB9")), Vo.PERU = Object.freeze(Vo.fromCssColorString("#CD853F")), Vo.PINK = Object.freeze(Vo.fromCssColorString("#FFC0CB")), Vo.PLUM = Object.freeze(Vo.fromCssColorString("#DDA0DD")), Vo.POWDERBLUE = Object.freeze(Vo.fromCssColorString("#B0E0E6")), Vo.PURPLE = Object.freeze(Vo.fromCssColorString("#800080")), Vo.RED = Object.freeze(Vo.fromCssColorString("#FF0000")), Vo.ROSYBROWN = Object.freeze(Vo.fromCssColorString("#BC8F8F")), Vo.ROYALBLUE = Object.freeze(Vo.fromCssColorString("#4169E1")), Vo.SADDLEBROWN = Object.freeze(Vo.fromCssColorString("#8B4513")), Vo.SALMON = Object.freeze(Vo.fromCssColorString("#FA8072")), Vo.SANDYBROWN = Object.freeze(Vo.fromCssColorString("#F4A460")), Vo.SEAGREEN = Object.freeze(Vo.fromCssColorString("#2E8B57")), Vo.SEASHELL = Object.freeze(Vo.fromCssColorString("#FFF5EE")), Vo.SIENNA = Object.freeze(Vo.fromCssColorString("#A0522D")), Vo.SILVER = Object.freeze(Vo.fromCssColorString("#C0C0C0")), Vo.SKYBLUE = Object.freeze(Vo.fromCssColorString("#87CEEB")), Vo.SLATEBLUE = Object.freeze(Vo.fromCssColorString("#6A5ACD")), Vo.SLATEGRAY = Object.freeze(Vo.fromCssColorString("#708090")), Vo.SLATEGREY = Vo.SLATEGRAY, Vo.SNOW = Object.freeze(Vo.fromCssColorString("#FFFAFA")), Vo.SPRINGGREEN = Object.freeze(Vo.fromCssColorString("#00FF7F")), Vo.STEELBLUE = Object.freeze(Vo.fromCssColorString("#4682B4")), Vo.TAN = Object.freeze(Vo.fromCssColorString("#D2B48C")), Vo.TEAL = Object.freeze(Vo.fromCssColorString("#008080")), Vo.THISTLE = Object.freeze(Vo.fromCssColorString("#D8BFD8")), Vo.TOMATO = Object.freeze(Vo.fromCssColorString("#FF6347")), Vo.TURQUOISE = Object.freeze(Vo.fromCssColorString("#40E0D0")), Vo.VIOLET = Object.freeze(Vo.fromCssColorString("#EE82EE")), Vo.WHEAT = Object.freeze(Vo.fromCssColorString("#F5DEB3")), Vo.WHITE = Object.freeze(Vo.fromCssColorString("#FFFFFF")), Vo.WHITESMOKE = Object.freeze(Vo.fromCssColorString("#F5F5F5")), Vo.YELLOW = Object.freeze(Vo.fromCssColorString("#FFFF00")), Vo.YELLOWGREEN = Object.freeze(Vo.fromCssColorString("#9ACD32")), Vo.TRANSPARENT = Object.freeze(new Vo(0, 0, 0, 0)), ti.fromPointNormal = function(e, t, r) {
	if (z.typeOf.object("point", e), z.typeOf.object("normal", t), !D.equalsEpsilon(H.magnitude(t), 1, D.EPSILON6)) throw new R("normal must be normalized.");
	const n = -H.dot(t, e);
	return T(r) ? (H.clone(t, r.normal), r.distance = n, r) : new ti(t, n);
};
const ri = new H();
ti.fromCartesian4 = function(e, t) {
	z.typeOf.object("coefficients", e);
	const r = H.fromCartesian4(e, ri), n = e.w;
	if (!D.equalsEpsilon(H.magnitude(r), 1, D.EPSILON6)) throw new R("normal must be normalized.");
	return T(t) ? (H.clone(r, t.normal), t.distance = n, t) : new ti(r, n);
}, ti.getPointDistance = function(e, t) {
	return z.typeOf.object("plane", e), z.typeOf.object("point", t), H.dot(e.normal, t) + e.distance;
};
const ni = new H();
ti.projectPointOntoPlane = function(e, t, r) {
	z.typeOf.object("plane", e), z.typeOf.object("point", t), T(r) || (r = new H());
	const n = ti.getPointDistance(e, t), o = H.multiplyByScalar(e.normal, n, ni);
	return H.subtract(t, o, r);
};
const oi = new Rr(), ii = new we(), si = new H();
ti.transform = function(e, t, r) {
	z.typeOf.object("plane", e), z.typeOf.object("transform", t);
	const n = e.normal, o = e.distance, i = Rr.inverseTranspose(t, oi);
	let s = we.fromElements(n.x, n.y, n.z, o, ii);
	s = Rr.multiplyByVector(i, s, s);
	const a = H.fromCartesian4(s, si);
	return s = we.divideByScalar(s, H.magnitude(a), s), ti.fromCartesian4(s, r);
}, ti.clone = function(e, t) {
	return z.typeOf.object("plane", e), T(t) ? (H.clone(e.normal, t.normal), t.distance = e.distance, t) : new ti(e.normal, e.distance);
}, ti.equals = function(e, t) {
	return z.typeOf.object("left", e), z.typeOf.object("right", t), e.distance === t.distance && H.equals(e.normal, t.normal);
}, ti.ORIGIN_XY_PLANE = Object.freeze(new ti(H.UNIT_Z, 0)), ti.ORIGIN_YZ_PLANE = Object.freeze(new ti(H.UNIT_X, 0)), ti.ORIGIN_ZX_PLANE = Object.freeze(new ti(H.UNIT_Y, 0));
var ai = class e {
	constructor(e) {
		this._ellipsoid = e ?? ue.WGS84, this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
	}
	get ellipsoid() {
		return this._ellipsoid;
	}
	static mercatorAngleToGeodeticLatitude(e) {
		return D.PI_OVER_TWO - 2 * Math.atan(Math.exp(-e));
	}
	static geodeticLatitudeToMercatorAngle(t) {
		t > e.MaximumLatitude ? t = e.MaximumLatitude : t < -e.MaximumLatitude && (t = -e.MaximumLatitude);
		const r = Math.sin(t);
		return .5 * Math.log((1 + r) / (1 - r));
	}
	project(t, r) {
		const n = this._semimajorAxis, o = t.longitude * n, i = e.geodeticLatitudeToMercatorAngle(t.latitude) * n, s = t.height;
		return T(r) ? (r.x = o, r.y = i, r.z = s, r) : new H(o, i, s);
	}
	unproject(t, r) {
		if (!T(t)) throw new R("cartesian is required");
		const n = this._oneOverSemimajorAxis, o = t.x * n, i = e.mercatorAngleToGeodeticLatitude(t.y * n), s = t.z;
		return T(r) ? (r.longitude = o, r.latitude = i, r.height = s, r) : new ne(o, i, s);
	}
};
ai.MaximumLatitude = ai.mercatorAngleToGeodeticLatitude(Math.PI);
const ui = {
	MORPHING: 0,
	COLUMBUS_VIEW: 1,
	SCENE2D: 2,
	SCENE3D: 3
};
function ci(e) {
	this.planes = e ?? [];
}
ui.getMorphTime = function(e) {
	return e === ui.SCENE3D ? 1 : e !== ui.MORPHING ? 0 : void 0;
}, Object.freeze(ui);
const li = [
	new H(),
	new H(),
	new H()
];
H.clone(H.UNIT_X, li[0]), H.clone(H.UNIT_Y, li[1]), H.clone(H.UNIT_Z, li[2]);
const fi = new H(), hi = new H(), pi = new ti(new H(1, 0, 0), 0);
function di(e) {
	e = e ?? A.EMPTY_OBJECT, this.left = e.left, this._left = void 0, this.right = e.right, this._right = void 0, this.top = e.top, this._top = void 0, this.bottom = e.bottom, this._bottom = void 0, this.near = e.near ?? 1, this._near = this.near, this.far = e.far ?? 5e8, this._far = this.far, this._cullingVolume = new ci(), this._orthographicMatrix = new Rr();
}
function mi(e) {
	if (!(T(e.right) && T(e.left) && T(e.top) && T(e.bottom) && T(e.near) && T(e.far))) throw new R("right, left, top, bottom, near, or far parameters are not set.");
	if (e.top !== e._top || e.bottom !== e._bottom || e.left !== e._left || e.right !== e._right || e.near !== e._near || e.far !== e._far) {
		if (e.left > e.right) throw new R("right must be greater than left.");
		if (e.bottom > e.top) throw new R("top must be greater than bottom.");
		if (e.near <= 0 || e.near > e.far) throw new R("near must be greater than zero and less than far.");
		e._left = e.left, e._right = e.right, e._top = e.top, e._bottom = e.bottom, e._near = e.near, e._far = e.far, e._orthographicMatrix = Rr.computeOrthographicOffCenter(e.left, e.right, e.bottom, e.top, e.near, e.far, e._orthographicMatrix);
	}
}
ci.fromBoundingSphere = function(e, t) {
	if (!T(e)) throw new R("boundingSphere is required.");
	T(t) || (t = new ci());
	const r = li.length, n = t.planes;
	n.length = 2 * r;
	const o = e.center, i = e.radius;
	let s = 0;
	for (let a = 0; a < r; ++a) {
		const e = li[a];
		let t = n[s], r = n[s + 1];
		T(t) || (t = n[s] = new we()), T(r) || (r = n[s + 1] = new we()), H.multiplyByScalar(e, -i, fi), H.add(o, fi, fi), t.x = e.x, t.y = e.y, t.z = e.z, t.w = -H.dot(e, fi), H.multiplyByScalar(e, i, fi), H.add(o, fi, fi), r.x = -e.x, r.y = -e.y, r.z = -e.z, r.w = -H.dot(H.negate(e, hi), fi), s += 2;
	}
	return t;
}, ci.prototype.computeVisibility = function(e) {
	if (!T(e)) throw new R("boundingVolume is required.");
	const t = this.planes;
	let r = !1;
	for (let n = 0, o = t.length; n < o; ++n) {
		const o = e.intersectPlane(ti.fromCartesian4(t[n], pi));
		if (o === be.OUTSIDE) return be.OUTSIDE;
		o === be.INTERSECTING && (r = !0);
	}
	return r ? be.INTERSECTING : be.INSIDE;
}, ci.prototype.computeVisibilityWithPlaneMask = function(e, t) {
	if (!T(e)) throw new R("boundingVolume is required.");
	if (!T(t)) throw new R("parentPlaneMask is required.");
	if (t === ci.MASK_OUTSIDE || t === ci.MASK_INSIDE) return t;
	let r = ci.MASK_INSIDE;
	const n = this.planes;
	for (let o = 0, i = n.length; o < i; ++o) {
		const i = o < 31 ? 1 << o : 0;
		if (o < 31 && 0 === (t & i)) continue;
		const s = e.intersectPlane(ti.fromCartesian4(n[o], pi));
		if (s === be.OUTSIDE) return ci.MASK_OUTSIDE;
		s === be.INTERSECTING && (r |= i);
	}
	return r;
}, ci.MASK_OUTSIDE = 4294967295, ci.MASK_INSIDE = 0, ci.MASK_INDETERMINATE = 2147483647, Object.defineProperties(di.prototype, { projectionMatrix: { get: function() {
	return mi(this), this._orthographicMatrix;
} } });
const yi = new H(), gi = new H(), bi = new H(), wi = new H();
function Oi(e) {
	e = e ?? A.EMPTY_OBJECT, this._offCenterFrustum = new di(), this.width = e.width, this._width = void 0, this.aspectRatio = e.aspectRatio, this._aspectRatio = void 0, this.near = e.near ?? 1, this._near = this.near, this.far = e.far ?? 5e8, this._far = this.far;
}
function Ei(e) {
	if (!(T(e.width) && T(e.aspectRatio) && T(e.near) && T(e.far))) throw new R("width, aspectRatio, near, or far parameters are not set.");
	const t = e._offCenterFrustum;
	if (e.width !== e._width || e.aspectRatio !== e._aspectRatio || e.near !== e._near || e.far !== e._far) {
		if (e.aspectRatio < 0) throw new R("aspectRatio must be positive.");
		if (e.near < 0 || e.near > e.far) throw new R("near must be greater than zero and less than far.");
		e._aspectRatio = e.aspectRatio, e._width = e.width, e._near = e.near, e._far = e.far;
		const r = 1 / e.aspectRatio;
		t.right = .5 * e.width, t.left = -t.right, t.top = r * t.right, t.bottom = -t.top, t.near = e.near, t.far = e.far;
	}
}
di.prototype.computeCullingVolume = function(e, t, r) {
	if (!T(e)) throw new R("position is required.");
	if (!T(t)) throw new R("direction is required.");
	if (!T(r)) throw new R("up is required.");
	const n = this._cullingVolume.planes, o = this.top, i = this.bottom, s = this.right, a = this.left, u = this.near, c = this.far, l = H.cross(t, r, yi);
	H.normalize(l, l);
	const f = gi;
	H.multiplyByScalar(t, u, f), H.add(e, f, f);
	const h = bi;
	H.multiplyByScalar(l, a, h), H.add(f, h, h);
	let p = n[0];
	return T(p) || (p = n[0] = new we()), p.x = l.x, p.y = l.y, p.z = l.z, p.w = -H.dot(l, h), H.multiplyByScalar(l, s, h), H.add(f, h, h), p = n[1], T(p) || (p = n[1] = new we()), p.x = -l.x, p.y = -l.y, p.z = -l.z, p.w = -H.dot(H.negate(l, wi), h), H.multiplyByScalar(r, i, h), H.add(f, h, h), p = n[2], T(p) || (p = n[2] = new we()), p.x = r.x, p.y = r.y, p.z = r.z, p.w = -H.dot(r, h), H.multiplyByScalar(r, o, h), H.add(f, h, h), p = n[3], T(p) || (p = n[3] = new we()), p.x = -r.x, p.y = -r.y, p.z = -r.z, p.w = -H.dot(H.negate(r, wi), h), p = n[4], T(p) || (p = n[4] = new we()), p.x = t.x, p.y = t.y, p.z = t.z, p.w = -H.dot(t, f), H.multiplyByScalar(t, c, h), H.add(e, h, h), p = n[5], T(p) || (p = n[5] = new we()), p.x = -t.x, p.y = -t.y, p.z = -t.z, p.w = -H.dot(H.negate(t, wi), h), this._cullingVolume;
}, di.prototype.getPixelDimensions = function(e, t, r, n, o) {
	if (mi(this), !T(e) || !T(t)) throw new R("Both drawingBufferWidth and drawingBufferHeight are required.");
	if (e <= 0) throw new R("drawingBufferWidth must be greater than zero.");
	if (t <= 0) throw new R("drawingBufferHeight must be greater than zero.");
	if (!T(r)) throw new R("distance is required.");
	if (!T(n)) throw new R("pixelRatio is required.");
	if (n <= 0) throw new R("pixelRatio must be greater than zero.");
	if (!T(o)) throw new R("A result object is required.");
	const i = n * (this.right - this.left) / e, s = n * (this.top - this.bottom) / t;
	return o.x = i, o.y = s, o;
}, di.prototype.clone = function(e) {
	return T(e) || (e = new di()), e.left = this.left, e.right = this.right, e.top = this.top, e.bottom = this.bottom, e.near = this.near, e.far = this.far, e._left = void 0, e._right = void 0, e._top = void 0, e._bottom = void 0, e._near = void 0, e._far = void 0, e;
}, di.prototype.equals = function(e) {
	return T(e) && e instanceof di && this.right === e.right && this.left === e.left && this.top === e.top && this.bottom === e.bottom && this.near === e.near && this.far === e.far;
}, di.prototype.equalsEpsilon = function(e, t, r) {
	return e === this || T(e) && e instanceof di && D.equalsEpsilon(this.right, e.right, t, r) && D.equalsEpsilon(this.left, e.left, t, r) && D.equalsEpsilon(this.top, e.top, t, r) && D.equalsEpsilon(this.bottom, e.bottom, t, r) && D.equalsEpsilon(this.near, e.near, t, r) && D.equalsEpsilon(this.far, e.far, t, r);
}, Oi.packedLength = 4, Oi.pack = function(e, t, r) {
	return z.typeOf.object("value", e), z.defined("array", t), r = r ?? 0, t[r++] = e.width, t[r++] = e.aspectRatio, t[r++] = e.near, t[r] = e.far, t;
}, Oi.unpack = function(e, t, r) {
	return z.defined("array", e), t = t ?? 0, T(r) || (r = new Oi()), r.width = e[t++], r.aspectRatio = e[t++], r.near = e[t++], r.far = e[t], r;
}, Object.defineProperties(Oi.prototype, {
	projectionMatrix: { get: function() {
		return Ei(this), this._offCenterFrustum.projectionMatrix;
	} },
	offCenterFrustum: { get: function() {
		return Ei(this), this._offCenterFrustum;
	} }
}), Oi.prototype.computeCullingVolume = function(e, t, r) {
	return Ei(this), this._offCenterFrustum.computeCullingVolume(e, t, r);
}, Oi.prototype.getPixelDimensions = function(e, t, r, n, o) {
	return Ei(this), this._offCenterFrustum.getPixelDimensions(e, t, r, n, o);
}, Oi.prototype.clone = function(e) {
	return T(e) || (e = new Oi()), e.aspectRatio = this.aspectRatio, e.width = this.width, e.near = this.near, e.far = this.far, e._aspectRatio = void 0, e._width = void 0, e._near = void 0, e._far = void 0, this._offCenterFrustum.clone(e._offCenterFrustum), e;
}, Oi.prototype.equals = function(e) {
	return !!(T(e) && e instanceof Oi) && (Ei(this), Ei(e), this.width === e.width && this.aspectRatio === e.aspectRatio && this._offCenterFrustum.equals(e._offCenterFrustum));
}, Oi.prototype.equalsEpsilon = function(e, t, r) {
	return !!(T(e) && e instanceof Oi) && (Ei(this), Ei(e), D.equalsEpsilon(this.width, e.width, t, r) && D.equalsEpsilon(this.aspectRatio, e.aspectRatio, t, r) && this._offCenterFrustum.equalsEpsilon(e._offCenterFrustum, t, r));
};
const xi = {}, _i = new we(0, 0, 0, 1);
let Si = new we();
const vi = new Bo(), Ci = new U(), ji = new U();
xi.worldToWindowCoordinates = function(e, t, r) {
	return xi.worldWithEyeOffsetToWindowCoordinates(e, t, H.ZERO, r);
};
const Ai = new we(), Ti = new H();
function Ri(e, t, r, n) {
	const o = r.viewMatrix, i = Rr.multiplyByVector(o, we.fromElements(e.x, e.y, e.z, 1, Ai), Ai), s = H.multiplyComponents(t, H.normalize(i, Ti), Ti);
	return i.x += t.x + s.x, i.y += t.y + s.y, i.z += s.z, Rr.multiplyByVector(r.frustum.projectionMatrix, i, n);
}
const zi = new ne(Math.PI, D.PI_OVER_TWO), Ii = new H(), Mi = new H();
xi.worldWithEyeOffsetToWindowCoordinates = function(e, t, r, n) {
	if (!T(e)) throw new R("scene is required.");
	if (!T(t)) throw new R("position is required.");
	const o = e.frameState, i = xi.computeActualEllipsoidPosition(o, t, _i);
	if (!T(i)) return;
	const s = e.canvas, a = vi;
	a.x = 0, a.y = 0, a.width = s.clientWidth, a.height = s.clientHeight;
	const u = e.camera;
	let c = !1;
	if (o.mode === ui.SCENE2D) {
		const t = e.mapProjection, o = zi, l = t.project(o, Ii), f = H.clone(u.position, Mi), h = u.frustum.clone(), p = Rr.computeViewportTransformation(a, 0, 1, new Rr()), d = u.frustum.projectionMatrix, m = u.positionWC.y, y = H.fromElements(D.sign(m) * l.x - m, 0, -u.positionWC.x), g = Yn.pointToGLWindowCoordinates(d, p, y);
		if (0 === m || g.x <= 0 || g.x >= s.clientWidth) c = !0;
		else {
			if (g.x > .5 * s.clientWidth) {
				a.width = g.x, u.frustum.right = l.x - m, Si = Ri(i, r, u, Si), xi.clipToGLWindowCoordinates(a, Si, Ci), a.x += g.x, u.position.x = -u.position.x;
				const e = u.frustum.right;
				u.frustum.right = -u.frustum.left, u.frustum.left = -e, Si = Ri(i, r, u, Si), xi.clipToGLWindowCoordinates(a, Si, ji);
			} else {
				a.x += g.x, a.width -= g.x, u.frustum.left = -l.x - m, Si = Ri(i, r, u, Si), xi.clipToGLWindowCoordinates(a, Si, Ci), a.x = a.x - a.width, u.position.x = -u.position.x;
				const e = u.frustum.left;
				u.frustum.left = -u.frustum.right, u.frustum.right = -e, Si = Ri(i, r, u, Si), xi.clipToGLWindowCoordinates(a, Si, ji);
			}
			H.clone(f, u.position), u.frustum = h.clone(), ((n = U.clone(Ci, n)).x < 0 || n.x > s.clientWidth) && (n.x = ji.x);
		}
	}
	if (o.mode !== ui.SCENE2D || c) {
		if (Si = Ri(i, r, u, Si), Si.z < 0 && !(u.frustum instanceof Oi) && !(u.frustum instanceof di)) return;
		n = xi.clipToGLWindowCoordinates(a, Si, n);
	}
	return n.y = s.clientHeight - n.y, n;
}, xi.worldToDrawingBufferCoordinates = function(e, t, r) {
	if (T(r = xi.worldToWindowCoordinates(e, t, r))) return xi.transformWindowToDrawingBuffer(e, r, r);
};
const qi = new H(), Pi = new ne();
xi.computeActualEllipsoidPosition = function(e, t, r) {
	const n = e.mode;
	if (n === ui.SCENE3D) return H.clone(t, r);
	const o = e.mapProjection, i = o.ellipsoid.cartesianToCartographic(t, Pi);
	if (!T(i)) return;
	if (o.project(i, qi), n === ui.COLUMBUS_VIEW) return H.fromElements(qi.z, qi.x, qi.y, r);
	if (n === ui.SCENE2D) return H.fromElements(0, qi.x, qi.y, r);
	const s = e.morphTime;
	return H.fromElements(D.lerp(qi.z, t.x, s), D.lerp(qi.x, t.y, s), D.lerp(qi.y, t.z, s), r);
};
const Ni = new H(), Di = new H(), Fi = new Rr();
xi.clipToGLWindowCoordinates = function(e, t, r) {
	return H.divideByScalar(t, t.w, Ni), Rr.computeViewportTransformation(e, 0, 1, Fi), Rr.multiplyByPoint(Fi, Ni, Di), U.fromCartesian3(Di, r);
}, xi.transformWindowToDrawingBuffer = function(e, t, r) {
	const n = e.canvas, o = e.drawingBufferWidth / n.clientWidth, i = e.drawingBufferHeight / n.clientHeight;
	return U.fromElements(t.x * o, t.y * i, r);
};
const Li = new we(), Ui = new we();
xi.drawingBufferToWorldCoordinates = function(e, t, r, n) {
	const o = e.context.uniformState, i = o.currentFrustum, s = i.x, a = i.y;
	if (e.frameState.useLogDepth) {
		const e = r * o.log2FarDepthFromNearPlusOne;
		r = a * (1 - s / (Math.pow(2, e) - 1 + s)) / (a - s);
	}
	const u = e.view.passState.viewport, c = we.clone(we.UNIT_W, Li);
	let l;
	c.x = (t.x - u.x) / u.width * 2 - 1, c.y = (t.y - u.y) / u.height * 2 - 1, c.z = 2 * r - 1, c.w = 1;
	let f = e.camera.frustum;
	if (T(f.fovy)) {
		l = Rr.multiplyByVector(o.inverseViewProjection, c, Ui);
		const e = 1 / l.w;
		H.multiplyByScalar(l, e, l);
	} else {
		const e = f.offCenterFrustum;
		T(e) && (f = e), l = Ui, l.x = .5 * (c.x * (f.right - f.left) + f.left + f.right), l.y = .5 * (c.y * (f.top - f.bottom) + f.bottom + f.top), l.z = .5 * (c.z * (s - a) - s - a), l.w = 1, l = Rr.multiplyByVector(o.inverseView, l, l);
	}
	return H.fromCartesian4(l, n);
};
var ki = class e {
	_lng = 0;
	_lat = 0;
	_alt = 0;
	_heading = 0;
	_pitch = 0;
	_roll = 0;
	_zoom = -1;
	constructor(e, t, r, n, o, i, s) {
		this._lng = e || 0, this._lat = t || 0, this._alt = r || 0, this._heading = n || 0, this._pitch = o || 0, this._roll = i || 0, this._zoom = s || -1;
	}
	set lng(e) {
		this._lng = +e;
	}
	get lng() {
		return this._lng;
	}
	set lat(e) {
		this._lat = +e;
	}
	get lat() {
		return this._lat;
	}
	set alt(e) {
		this._alt = +e;
	}
	get alt() {
		return this._alt;
	}
	set heading(e) {
		this._heading = +e;
	}
	get heading() {
		return this._heading;
	}
	set pitch(e) {
		this._pitch = +e;
	}
	get pitch() {
		return this._pitch;
	}
	set roll(e) {
		this._roll = +e;
	}
	get roll() {
		return this._roll;
	}
	set zoom(e) {
		this._zoom = +e;
	}
	get zoom() {
		return this._zoom;
	}
	serialize() {
		let t = new e(this._lng, this._lat, this._alt, this._heading, this._pitch, this._roll, this._zoom);
		return JSON.stringify(t);
	}
	transformWGS84ToCartesian(e) {
		return e ? H.fromDegrees(e.lng, e.lat, e.alt, ue.WGS84) : H.ZERO;
	}
	distance(t) {
		return t && t instanceof e ? H.distance(this.transformWGS84ToCartesian(this), this.transformWGS84ToCartesian(t)) : 0;
	}
	clone() {
		let t = new e();
		return t.lng = this.lng || 0, t.lat = this.lat || 0, t.alt = this.alt || 0, t.heading = this.heading || 0, t.pitch = this.pitch || 0, t.roll = this.roll || 0, t;
	}
	copy() {
		return this.clone();
	}
	toArray() {
		return [
			this.lng,
			this.lat,
			this.alt,
			this.heading,
			this.pitch,
			this.roll
		];
	}
	getZoomString() {
		return this.zoom > 0 ? `级别:${this.zoom} ` : "";
	}
	toString() {
		const e = this.heading?.toFixed(1), t = this.pitch?.toFixed(1), r = this.roll?.toFixed(1);
		return `${this.getZoomString()}经度:${this.lng.toFixed(3)}° 纬度:${this.lat.toFixed(3)}° 高度:${this.alt.toFixed(2)}米 航向角:${e}° 视角:${t}° 翻转角:${r}°`;
	}
	toObject() {
		return {
			lng: this.lng,
			lat: this.lat,
			alt: this.alt,
			heading: this.heading,
			pitch: this.pitch,
			roll: this.roll,
			zoom: this.zoom
		};
	}
	static fromArray(t) {
		let r = new e();
		return Array.isArray(t) && (r.lng = t[0] || 0, r.lat = t[1] || 0, r.alt = t[2] || 0, r.heading = t[3] || 0, r.pitch = t[4] || 0, r.roll = t[5] || 0, r.zoom = t[6] || -1), r;
	}
	static fromString(t) {
		let r = new e();
		if (t) {
			const e = t.split(",").map((e, t, r) => Number(e));
			r = this.fromArray(e);
		}
		return r;
	}
	static fromObject(t) {
		return new e(t.lng, t.lat, t.alt, t.heading, t.pitch, t.roll, t.zoom);
	}
	static fromObject2(t) {
		return new e(t._lng, t._lat, t._alt, t._heading, t._pitch, t._roll, t._zoom);
	}
	static deserialize(t) {
		let r = new e(), n = JSON.parse(t);
		return n && (r.lng = n.lng || 0, r.lat = n.lat || 0, r.alt = n.alt || 0, r.heading = n.heading || 0, r.pitch = n.pitch || 0, r.roll = n.roll || 0, r.zoom = n.zoom || -1), r;
	}
};
const Bi = new ai();
var Wi = class {
	static transformCartesianToCartographic(e) {
		return ue.WGS84.cartesianToCartographic(e);
	}
	static transformCartesianToWGS84(e) {
		if (e) {
			let t = ue.WGS84.cartesianToCartographic(e);
			return new ki(D.toDegrees(t?.longitude || 0), D.toDegrees(t?.latitude || 0), t?.height || 0);
		}
		return new ki(0, 0);
	}
	static transformCartographicToWGS84(e) {
		return e ? new ki(D.toDegrees(e?.longitude || 0), D.toDegrees(e?.latitude || 0), e.height || 0) : new ki(0, 0);
	}
	static transformWGS84ToCartesian(e) {
		return e ? H.fromDegrees(e.lng, e.lat, e.alt, ue.WGS84) : H.ZERO;
	}
	static transformWGS84ToCartographic(e) {
		return e ? ne.fromDegrees(e.lng, e.lat, e.alt) : ne.ZERO;
	}
	static transformCartesianArrayToWGS84Array(e) {
		return e ? e.map((e) => this.transformCartesianToWGS84(e)) : [];
	}
	static transformWGS84ArrayToCartesianArray(e) {
		return e ? e.map((e) => this.transformWGS84ToCartesian(e)) : [];
	}
	static transformWGS84ToMercator(e) {
		let t = Bi.project(ne.fromDegrees(e.lng, e.lat, e.alt));
		return new ki(t.x, t.y, t.z);
	}
	static transformMercatorToWGS84(e) {
		let t = Bi.unproject(new H(e.lng, e.lat, e.alt));
		return new ki(D.toDegrees(t.longitude), D.toDegrees(t.latitude), t.height);
	}
	static transformWindowToWGS84(e, t) {
		let r, n = t.scene;
		if (n.mode === ui.SCENE3D) {
			let t = n.camera.getPickRay(e);
			r = n.globe.pick(t, n);
		} else r = n.camera.pickEllipsoid(e, ue.WGS84);
		return this.transformCartesianToWGS84(r);
	}
	static transformWGS84ToWindow(e, t) {
		let r = t.scene;
		return xi.worldToWindowCoordinates(r, this.transformWGS84ToCartesian(e));
	}
}, $i = class {
	static parsePosition(e) {
		let t = new ki();
		if (!e) return t;
		if ("string" == typeof e) t = ki.fromString(e);
		else if (Array.isArray(e)) t = ki.fromArray(e);
		else if (Object(e) instanceof ki) Object(e) instanceof ki ? t = e : Object(e) instanceof H ? t = Wi.transformCartesianToWGS84(e) : Object(e) instanceof ne && (t = Wi.transformCartographicToWGS84(e));
		else {
			const r = Object(e);
			r.hasOwnProperty("lng") && r.hasOwnProperty("lat") ? t = ki.fromObject(e) : r.hasOwnProperty("_lng") && r.hasOwnProperty("_lat") && (t = ki.fromObject2(e));
		}
		return t;
	}
	static parsePositions(e) {
		let t;
		if ("string" == typeof e) {
			if (e.indexOf("#") >= 0) throw new Error("the positions invalid");
			t = e.split(";").filter((e) => !!e);
		} else t = e;
		return t.map((e) => this.parsePosition(e));
	}
	static parsePointCoordToArray(e) {
		return [(e = this.parsePosition(e)).lng, e.lat];
	}
	static parsePolylineCoordToArray(e) {
		let t = [];
		return (e = this.parsePositions(e)).forEach((e) => {
			t.push([e.lng, e.lat]);
		}), t;
	}
	static parsePolygonCoordToArray(e, t = !1) {
		let r = [];
		return (e = this.parsePositions(e)).forEach((e) => {
			r.push([e.lng, e.lat]);
		}), t && r.length > 0 && r.push(r[0]), [r];
	}
}, Gi = 6371008.8, Hi = {
	centimeters: 637100880,
	centimetres: 637100880,
	degrees: 360 / (2 * Math.PI),
	feet: 20902260.511392,
	inches: 39.37 * Gi,
	kilometers: 6371.0088,
	kilometres: 6371.0088,
	meters: Gi,
	metres: Gi,
	miles: 3958.761333810546,
	millimeters: 6371008800,
	millimetres: 6371008800,
	nauticalmiles: Gi / 1852,
	radians: 1,
	yards: 6967335.223679999
};
function Vi(e, t, r = {}) {
	const n = { type: "Feature" };
	return (0 === r.id || r.id) && (n.id = r.id), r.bbox && (n.bbox = r.bbox), n.properties = t || {}, n.geometry = e, n;
}
function Yi(e, t, r = {}) {
	if (!e) throw new Error("coordinates is required");
	if (!Array.isArray(e)) throw new Error("coordinates must be an Array");
	if (e.length < 2) throw new Error("coordinates must be at least 2 numbers long");
	if (!Ki(e[0]) || !Ki(e[1])) throw new Error("coordinates must contain numbers");
	return Vi({
		type: "Point",
		coordinates: e
	}, t, r);
}
function Qi(e, t, r = {}) {
	for (const n of e) {
		if (n.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
		if (n[n.length - 1].length !== n[0].length) throw new Error("First and last Position are not equivalent.");
		for (let e = 0; e < n[n.length - 1].length; e++) if (n[n.length - 1][e] !== n[0][e]) throw new Error("First and last Position are not equivalent.");
	}
	return Vi({
		type: "Polygon",
		coordinates: e
	}, t, r);
}
function Zi(e, t = {}) {
	const r = { type: "FeatureCollection" };
	return t.id && (r.id = t.id), t.bbox && (r.bbox = t.bbox), r.features = e, r;
}
function Xi(e, t = "kilometers", r = "kilometers") {
	if (!(e >= 0)) throw new Error("length must be a positive number");
	return function(e, t = "kilometers") {
		const r = Hi[t];
		if (!r) throw new Error(t + " units is invalid");
		return e * r;
	}(function(e, t = "kilometers") {
		const r = Hi[t];
		if (!r) throw new Error(t + " units is invalid");
		return e / r;
	}(e, t), r);
}
function Ki(e) {
	return !isNaN(e) && null !== e && !Array.isArray(e);
}
function Ji(e) {
	if (!e) throw new Error("coord is required");
	if (!Array.isArray(e)) {
		if ("Feature" === e.type && null !== e.geometry && "Point" === e.geometry.type) return [...e.geometry.coordinates];
		if ("Point" === e.type) return [...e.coordinates];
	}
	if (Array.isArray(e) && e.length >= 2 && !Array.isArray(e[0]) && !Array.isArray(e[1])) return [...e];
	throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function es(e) {
	if (Array.isArray(e)) return e;
	if ("Feature" === e.type) {
		if (null !== e.geometry) return e.geometry.coordinates;
	} else if (e.coordinates) return e.coordinates;
	throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
}
function ts(e) {
	return "Feature" === e.type ? e.geometry : e;
}
function rs(e, t, r) {
	if (null !== e) for (var n, o, i, s, a, u, c, l, f = 0, h = 0, p = e.type, d = "FeatureCollection" === p, m = "Feature" === p, y = d ? e.features.length : 1, g = 0; g < y; g++) {
		a = (l = !!(c = d ? e.features[g].geometry : m ? e.geometry : e) && "GeometryCollection" === c.type) ? c.geometries.length : 1;
		for (var b = 0; b < a; b++) {
			var w = 0, O = 0;
			if (null !== (s = l ? c.geometries[b] : c)) {
				u = s.coordinates;
				var E = s.type;
				switch (f = !r || "Polygon" !== E && "MultiPolygon" !== E ? 0 : 1, E) {
					case null: break;
					case "Point":
						if (!1 === t(u, h, g, w, O)) return !1;
						h++, w++;
						break;
					case "LineString":
					case "MultiPoint":
						for (n = 0; n < u.length; n++) {
							if (!1 === t(u[n], h, g, w, O)) return !1;
							h++, "MultiPoint" === E && w++;
						}
						"LineString" === E && w++;
						break;
					case "Polygon":
					case "MultiLineString":
						for (n = 0; n < u.length; n++) {
							for (o = 0; o < u[n].length - f; o++) {
								if (!1 === t(u[n][o], h, g, w, O)) return !1;
								h++;
							}
							"MultiLineString" === E && w++, "Polygon" === E && O++;
						}
						"Polygon" === E && w++;
						break;
					case "MultiPolygon":
						for (n = 0; n < u.length; n++) {
							for (O = 0, o = 0; o < u[n].length; o++) {
								for (i = 0; i < u[n][o].length - f; i++) {
									if (!1 === t(u[n][o][i], h, g, w, O)) return !1;
									h++;
								}
								O++;
							}
							w++;
						}
						break;
					case "GeometryCollection":
						for (n = 0; n < s.geometries.length; n++) if (!1 === rs(s.geometries[n], t, r)) return !1;
						break;
					default: throw new Error("Unknown Geometry Type");
				}
			}
		}
	}
}
function ns(e, t) {
	(function(e, t) {
		var r, n, o, i, s, a, u, c, l, f, h = 0, p = "FeatureCollection" === e.type, d = "Feature" === e.type, m = p ? e.features.length : 1;
		for (r = 0; r < m; r++) {
			for (a = p ? e.features[r].geometry : d ? e.geometry : e, c = p ? e.features[r].properties : d ? e.properties : {}, l = p ? e.features[r].bbox : d ? e.bbox : void 0, f = p ? e.features[r].id : d ? e.id : void 0, s = (u = !!a && "GeometryCollection" === a.type) ? a.geometries.length : 1, o = 0; o < s; o++) if (null !== (i = u ? a.geometries[o] : a)) switch (i.type) {
				case "Point":
				case "LineString":
				case "MultiPoint":
				case "Polygon":
				case "MultiLineString":
				case "MultiPolygon":
					if (!1 === t(i, h, c, l, f)) return !1;
					break;
				case "GeometryCollection":
					for (n = 0; n < i.geometries.length; n++) if (!1 === t(i.geometries[n], h, c, l, f)) return !1;
					break;
				default: throw new Error("Unknown Geometry Type");
			}
			else if (!1 === t(null, h, c, l, f)) return !1;
			h++;
		}
	})(e, function(e, r, n, o, i) {
		var s, a = null === e ? null : e.type;
		switch (a) {
			case null:
			case "Point":
			case "LineString":
			case "Polygon": return !1 !== t(Vi(e, n, {
				bbox: o,
				id: i
			}), r, 0) && void 0;
		}
		switch (a) {
			case "MultiPoint":
				s = "Point";
				break;
			case "MultiLineString":
				s = "LineString";
				break;
			case "MultiPolygon": s = "Polygon";
		}
		for (var u = 0; u < e.coordinates.length; u++) {
			var c = e.coordinates[u];
			if (!1 === t(Vi({
				type: s,
				coordinates: c
			}, n), r, u)) return !1;
		}
	});
}
function os(e, t = {}) {
	if (null != e.bbox && !0 !== t.recompute) return e.bbox;
	const r = [
		Infinity,
		Infinity,
		-Infinity,
		-Infinity
	];
	return rs(e, (e) => {
		r[0] > e[0] && (r[0] = e[0]), r[1] > e[1] && (r[1] = e[1]), r[2] < e[0] && (r[2] = e[0]), r[3] < e[1] && (r[3] = e[1]);
	}), r;
}
const is = 134217729;
function ss(e, t, r, n, o) {
	let i, s, a, u, c = t[0], l = n[0], f = 0, h = 0;
	l > c == l > -c ? (i = c, c = t[++f]) : (i = l, l = n[++h]);
	let p = 0;
	if (f < e && h < r) for (l > c == l > -c ? (s = c + i, a = i - (s - c), c = t[++f]) : (s = l + i, a = i - (s - l), l = n[++h]), i = s, 0 !== a && (o[p++] = a); f < e && h < r;) l > c == l > -c ? (s = i + c, u = s - i, a = i - (s - u) + (c - u), c = t[++f]) : (s = i + l, u = s - i, a = i - (s - u) + (l - u), l = n[++h]), i = s, 0 !== a && (o[p++] = a);
	for (; f < e;) s = i + c, u = s - i, a = i - (s - u) + (c - u), c = t[++f], i = s, 0 !== a && (o[p++] = a);
	for (; h < r;) s = i + l, u = s - i, a = i - (s - u) + (l - u), l = n[++h], i = s, 0 !== a && (o[p++] = a);
	return 0 === i && 0 !== p || (o[p++] = i), p;
}
function as(e) {
	return new Float64Array(e);
}
const us = as(4), cs = as(8), ls = as(12), fs = as(16), hs = as(4);
function ps(e, t, r, n, o, i) {
	const s = (t - i) * (r - o), a = (e - o) * (n - i), u = s - a, c = Math.abs(s + a);
	return Math.abs(u) >= 33306690738754716e-32 * c ? u : -function(e, t, r, n, o, i, s) {
		let a, u, c, l, f, h, p, d, m, y, g, b, w, O, E, x, _, S;
		const v = e - o, C = r - o, j = t - i, A = n - i;
		O = v * A, h = is * v, p = h - (h - v), d = v - p, h = is * A, m = h - (h - A), y = A - m, E = d * y - (O - p * m - d * m - p * y), x = j * C, h = is * j, p = h - (h - j), d = j - p, h = is * C, m = h - (h - C), y = C - m, _ = d * y - (x - p * m - d * m - p * y), g = E - _, f = E - g, us[0] = E - (g + f) + (f - _), b = O + g, f = b - O, w = O - (b - f) + (g - f), g = w - x, f = w - g, us[1] = w - (g + f) + (f - x), S = b + g, f = S - b, us[2] = b - (S - f) + (g - f), us[3] = S;
		let T = function(e, t) {
			let r = t[0];
			for (let n = 1; n < 4; n++) r += t[n];
			return r;
		}(0, us), R = 22204460492503146e-32 * s;
		if (T >= R || -T >= R) return T;
		if (f = e - v, a = e - (v + f) + (f - o), f = r - C, c = r - (C + f) + (f - o), f = t - j, u = t - (j + f) + (f - i), f = n - A, l = n - (A + f) + (f - i), 0 === a && 0 === u && 0 === c && 0 === l) return T;
		if (R = 11093356479670487e-47 * s + 33306690738754706e-32 * Math.abs(T), T += v * l + A * a - (j * c + C * u), T >= R || -T >= R) return T;
		O = a * A, h = is * a, p = h - (h - a), d = a - p, h = is * A, m = h - (h - A), y = A - m, E = d * y - (O - p * m - d * m - p * y), x = u * C, h = is * u, p = h - (h - u), d = u - p, h = is * C, m = h - (h - C), y = C - m, _ = d * y - (x - p * m - d * m - p * y), g = E - _, f = E - g, hs[0] = E - (g + f) + (f - _), b = O + g, f = b - O, w = O - (b - f) + (g - f), g = w - x, f = w - g, hs[1] = w - (g + f) + (f - x), S = b + g, f = S - b, hs[2] = b - (S - f) + (g - f), hs[3] = S;
		const z = ss(4, us, 4, hs, cs);
		O = v * l, h = is * v, p = h - (h - v), d = v - p, h = is * l, m = h - (h - l), y = l - m, E = d * y - (O - p * m - d * m - p * y), x = j * c, h = is * j, p = h - (h - j), d = j - p, h = is * c, m = h - (h - c), y = c - m, _ = d * y - (x - p * m - d * m - p * y), g = E - _, f = E - g, hs[0] = E - (g + f) + (f - _), b = O + g, f = b - O, w = O - (b - f) + (g - f), g = w - x, f = w - g, hs[1] = w - (g + f) + (f - x), S = b + g, f = S - b, hs[2] = b - (S - f) + (g - f), hs[3] = S;
		const I = ss(z, cs, 4, hs, ls);
		O = a * l, h = is * a, p = h - (h - a), d = a - p, h = is * l, m = h - (h - l), y = l - m, E = d * y - (O - p * m - d * m - p * y), x = u * c, h = is * u, p = h - (h - u), d = u - p, h = is * c, m = h - (h - c), y = c - m, _ = d * y - (x - p * m - d * m - p * y), g = E - _, f = E - g, hs[0] = E - (g + f) + (f - _), b = O + g, f = b - O, w = O - (b - f) + (g - f), g = w - x, f = w - g, hs[1] = w - (g + f) + (f - x), S = b + g, f = S - b, hs[2] = b - (S - f) + (g - f), hs[3] = S;
		const M = ss(I, ls, 4, hs, fs);
		return fs[M - 1];
	}(e, t, r, n, o, i, c);
}
function ds(e, t) {
	var r, n, o, i, s, a, u, c, l, f = 0, h = e[0], p = e[1], d = t.length;
	for (r = 0; r < d; r++) {
		n = 0;
		var m = t[r], y = m.length - 1;
		if ((c = m[0])[0] !== m[y][0] && c[1] !== m[y][1]) throw new Error("First and last coordinates in a ring must be the same");
		for (i = c[0] - h, s = c[1] - p; n < y; n++) {
			if (a = (l = m[n + 1])[0] - h, u = l[1] - p, 0 === s && 0 === u) {
				if (a <= 0 && i >= 0 || i <= 0 && a >= 0) return 0;
			} else if (u >= 0 && s <= 0 || u <= 0 && s >= 0) {
				if (0 === (o = ps(i, a, s, u, 0, 0))) return 0;
				(o > 0 && u > 0 && s <= 0 || o < 0 && u <= 0 && s > 0) && f++;
			}
			c = l, s = u, i = a;
		}
	}
	return f % 2 != 0;
}
function ms(e, t, r = {}) {
	if (!e) throw new Error("point is required");
	if (!t) throw new Error("polygon is required");
	const n = Ji(e), o = ts(t), i = o.type, s = t.bbox;
	let a = o.coordinates;
	if (s && !1 === function(e, t) {
		return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
	}(n, s)) return !1;
	"Polygon" === i && (a = [a]);
	let u = !1;
	for (var c = 0; c < a.length; ++c) {
		const e = ds(n, a[c]);
		if (0 === e) return !r.ignoreBoundary;
		e && (u = !0);
	}
	return u;
}
as(4), as(4), as(4), as(4), as(4), as(4), as(4), as(4), as(4), as(8), as(8), as(8), as(4), as(8), as(8), as(16), as(12), as(192), as(192), as(4), as(4), as(4), as(4), as(4), as(4), as(4), as(4), as(8), as(8), as(8), as(8), as(8), as(8), as(8), as(8), as(8), as(4), as(4), as(4), as(8), as(16), as(16), as(16), as(32), as(32), as(48), as(64), as(1152), as(1152), as(4), as(4), as(4), as(4), as(4), as(4), as(4), as(4), as(4), as(4), as(24), as(24), as(24), as(24), as(24), as(24), as(24), as(24), as(24), as(24), as(1152), as(1152), as(1152), as(1152), as(1152), as(2304), as(2304), as(3456), as(5760), as(8), as(8), as(8), as(16), as(24), as(48), as(48), as(96), as(192), as(384), as(384), as(384), as(768), as(96), as(96), as(96), as(1152);
var ys = class {
	constructor(e = [], t = gs) {
		if (this.data = e, this.length = this.data.length, this.compare = t, this.length > 0) for (let r = (this.length >> 1) - 1; r >= 0; r--) this._down(r);
	}
	push(e) {
		this.data.push(e), this.length++, this._up(this.length - 1);
	}
	pop() {
		if (0 === this.length) return;
		const e = this.data[0], t = this.data.pop();
		return this.length--, this.length > 0 && (this.data[0] = t, this._down(0)), e;
	}
	peek() {
		return this.data[0];
	}
	_up(e) {
		const { data: t, compare: r } = this, n = t[e];
		for (; e > 0;) {
			const o = e - 1 >> 1, i = t[o];
			if (r(n, i) >= 0) break;
			t[e] = i, e = o;
		}
		t[e] = n;
	}
	_down(e) {
		const { data: t, compare: r } = this, n = this.length >> 1, o = t[e];
		for (; e < n;) {
			let n = 1 + (e << 1), i = t[n];
			const s = n + 1;
			if (s < this.length && r(t[s], i) < 0 && (n = s, i = t[s]), r(i, o) >= 0) break;
			t[e] = i, e = n;
		}
		t[e] = o;
	}
};
function gs(e, t) {
	return e < t ? -1 : e > t ? 1 : 0;
}
function bs(e, t) {
	return e.p.x > t.p.x ? 1 : e.p.x < t.p.x ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function ws(e, t) {
	return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
var Os = class {
	constructor(e, t, r, n) {
		this.p = {
			x: e[0],
			y: e[1]
		}, this.featureId = t, this.ringId = r, this.eventId = n, this.otherEvent = null, this.isLeftEndpoint = null;
	}
	isSamePoint(e) {
		return this.p.x === e.p.x && this.p.y === e.p.y;
	}
};
let Es = 0, xs = 0, _s = 0;
function Ss(e, t) {
	const r = "Feature" === e.type ? e.geometry : e;
	let n = r.coordinates;
	"Polygon" !== r.type && "MultiLineString" !== r.type || (n = [n]), "LineString" === r.type && (n = [[n]]);
	for (let o = 0; o < n.length; o++) for (let e = 0; e < n[o].length; e++) {
		let r = n[o][e][0], i = null;
		xs += 1;
		for (let s = 0; s < n[o][e].length - 1; s++) {
			i = n[o][e][s + 1];
			const a = new Os(r, Es, xs, _s), u = new Os(i, Es, xs, _s + 1);
			a.otherEvent = u, u.otherEvent = a, bs(a, u) > 0 ? (u.isLeftEndpoint = !0, a.isLeftEndpoint = !1) : (a.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(a), t.push(u), r = i, _s += 1;
		}
	}
	Es += 1;
}
var vs = class {
	constructor(e) {
		this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
	}
};
function Cs(e, t) {
	if (null === e || null === t) return !1;
	if (e.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (e.rightSweepEvent.isSamePoint(t.leftSweepEvent) || e.rightSweepEvent.isSamePoint(t.leftSweepEvent) || e.rightSweepEvent.isSamePoint(t.rightSweepEvent) || e.leftSweepEvent.isSamePoint(t.leftSweepEvent) || e.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
	const r = e.leftSweepEvent.p.x, n = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, i = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, u = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, l = (c - a) * (o - r) - (u - s) * (i - n);
	if (0 === l) return !1;
	const f = ((u - s) * (n - a) - (c - a) * (r - s)) / l, h = ((o - r) * (n - a) - (i - n) * (r - s)) / l;
	return f >= 0 && f <= 1 && h >= 0 && h <= 1 && [r + f * (o - r), n + f * (i - n)];
}
function js(e, t, r = {}) {
	const { removeDuplicates: n = !0, ignoreSelfIntersections: o = !0 } = r;
	let i = [];
	"FeatureCollection" === e.type ? i = i.concat(e.features) : "Feature" === e.type ? i.push(e) : "LineString" !== e.type && "Polygon" !== e.type && "MultiLineString" !== e.type && "MultiPolygon" !== e.type || i.push(Vi(e)), "FeatureCollection" === t.type ? i = i.concat(t.features) : "Feature" === t.type ? i.push(t) : "LineString" !== t.type && "Polygon" !== t.type && "MultiLineString" !== t.type && "MultiPolygon" !== t.type || i.push(Vi(t));
	const s = function(e, t) {
		const r = new ys([], bs);
		return function(e, t) {
			if ("FeatureCollection" === e.type) {
				const r = e.features;
				for (let e = 0; e < r.length; e++) Ss(r[e], t);
			} else Ss(e, t);
		}(e, r), function(e, t) {
			t = t || !1;
			const r = [], n = new ys([], ws);
			for (; e.length;) {
				const o = e.pop();
				if (o.isLeftEndpoint) {
					const e = new vs(o);
					for (let i = 0; i < n.data.length; i++) {
						const s = n.data[i];
						if (t && s.leftSweepEvent.featureId === o.featureId) continue;
						const a = Cs(e, s);
						!1 !== a && r.push(a);
					}
					n.push(e);
				} else !1 === o.isLeftEndpoint && n.pop();
			}
			return r;
		}(r, t);
	}(Zi(i), o);
	let a = [];
	if (n) {
		const e = {};
		s.forEach((t) => {
			const r = t.join(",");
			e[r] || (e[r] = !0, a.push(t));
		});
	} else a = s;
	return Zi(a.map((e) => Yi(e)));
}
function As(e, t = {}) {
	const r = ts(e);
	switch (t.properties || "Feature" !== e.type || (t.properties = e.properties), r.type) {
		case "Polygon": return function(e, t = {}) {
			return Ts(ts(e).coordinates, t.properties ? t.properties : "Feature" === e.type ? e.properties : {});
		}(r, t);
		case "MultiPolygon": return function(e, t = {}) {
			const r = ts(e).coordinates, n = t.properties ? t.properties : "Feature" === e.type ? e.properties : {}, o = [];
			return r.forEach((e) => {
				o.push(Ts(e, n));
			}), Zi(o);
		}(r, t);
		default: throw new Error("invalid poly");
	}
}
function Ts(e, t) {
	return e.length > 1 ? function(e, t, r = {}) {
		return Vi({
			type: "MultiLineString",
			coordinates: e
		}, t, r);
	}(e, t) : function(e, t, r = {}) {
		if (e.length < 2) throw new Error("coordinates must be an array of two or more positions");
		return Vi({
			type: "LineString",
			coordinates: e
		}, t, r);
	}(e[0], t);
}
function Rs(e, t) {
	for (let r = 0; r < e.coordinates.length - 1; r++) if (Is(e.coordinates[r], e.coordinates[r + 1], t.coordinates)) return !0;
	return !1;
}
function zs(e, t, r) {
	for (const n of t.coordinates) if (ms(n, e)) return !0;
	return js(t, As(e), { ignoreSelfIntersections: r }).features.length > 0;
}
function Is(e, t, r) {
	const n = r[0] - e[0], o = r[1] - e[1], i = t[0] - e[0], s = t[1] - e[1];
	return n * s - o * i === 0 && (Math.abs(i) >= Math.abs(s) ? i > 0 ? e[0] <= r[0] && r[0] <= t[0] : t[0] <= r[0] && r[0] <= e[0] : s > 0 ? e[1] <= r[1] && r[1] <= t[1] : t[1] <= r[1] && r[1] <= e[1]);
}
function Ms(e, t, { ignoreSelfIntersections: r = !0 } = {}) {
	let n = !1;
	return ns(e, (e) => {
		ns(t, (t) => {
			if (!0 === n) return !0;
			n = !function(e, t, { ignoreSelfIntersections: r = !0 } = { ignoreSelfIntersections: !0 }) {
				let n = !0;
				return ns(e, (e) => {
					ns(t, (t) => {
						if (!1 === n) return !1;
						n = function(e, t, r) {
							switch (e.type) {
								case "Point":
									switch (t.type) {
										case "Point": return n = e.coordinates, o = t.coordinates, !(n[0] === o[0] && n[1] === o[1]);
										case "LineString": return !Rs(t, e);
										case "Polygon": return !ms(e, t);
									}
									break;
								case "LineString":
									switch (t.type) {
										case "Point": return !Rs(e, t);
										case "LineString": return !function(e, t, r) {
											return js(e, t, { ignoreSelfIntersections: r }).features.length > 0;
										}(e, t, r);
										case "Polygon": return !zs(t, e, r);
									}
									break;
								case "Polygon": switch (t.type) {
									case "Point": return !ms(t, e);
									case "LineString": return !zs(e, t, r);
									case "Polygon": return !function(e, t, r) {
										for (const n of e.coordinates[0]) if (ms(n, t)) return !0;
										for (const n of t.coordinates[0]) if (ms(n, e)) return !0;
										return js(As(e), As(t), { ignoreSelfIntersections: r }).features.length > 0;
									}(t, e, r);
								}
							}
							var n, o;
							return !1;
						}(e.geometry, t.geometry, r);
					});
				}), n;
			}(e.geometry, t.geometry, { ignoreSelfIntersections: r });
		});
	}), n;
}
function qs(e, t = {}) {
	const r = os(e);
	return Yi([(r[0] + r[2]) / 2, (r[1] + r[3]) / 2], t.properties, t);
}
function Ps(e, t = 100) {
	const r = function(e, t, r = {}) {
		return function(e, t, r, n = {}) {
			const o = [], i = e[0], s = e[1], a = e[2], u = e[3], c = a - i, l = Xi(t, n.units, "degrees"), f = u - s, h = Xi(r, n.units, "degrees"), p = Math.floor(Math.abs(c) / l), d = Math.floor(Math.abs(f) / h), m = (f - d * h) / 2;
			let y = i + (c - p * l) / 2;
			for (let g = 0; g < p; g++) {
				let e = s + m;
				for (let t = 0; t < d; t++) {
					const t = Qi([[
						[y, e],
						[y, e + h],
						[y + l, e + h],
						[y + l, e],
						[y, e]
					]], n.properties);
					n.mask ? Ms(n.mask, t) && o.push(t) : o.push(t), e += h;
				}
				y += l;
			}
			return Zi(o);
		}(e, t, t, r);
	}(os(Qi($i.parsePolygonCoordToArray(e, !0))), t, { units: "meters" }), n = [], o = [], i = [], s = r.features.length;
	if (s > 0) for (let a = 0; a < s; a++) {
		const e = r.features[a], t = Ji(qs(e));
		i.push(t), o.push(ne.fromDegrees(t[0], t[1]));
		const s = es(e)[0], u = s.length, c = new Array();
		for (let r = 0; r < u - 1; r++) {
			const e = s[r], t = s[r + 1], n = [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2];
			c.push(new ki(e[0], e[1])), i.push(e), o.push(ne.fromDegrees(e[0], e[1])), i.push(n), o.push(ne.fromDegrees(n[0], n[1]));
		}
		const l = s[u - 1];
		c.push(new ki(l[0], l[1])), n.push(c);
	}
	return {
		cartoArray: o,
		PositionsList: n
	};
}
function Ns(e) {
	const t = e.length / 9, r = [];
	for (let n = 0; n < t; n++) {
		const t = 9 * n, o = [];
		for (let r = 0; r < 9; r++) {
			const n = e[t + r];
			o.push(n);
		}
		r.push(o);
	}
	return r;
}
function Ds(e) {
	const t = e;
	let r = [];
	const n = [];
	for (let o = 0; o < t.length; o++) {
		const e = t[o], i = e[0];
		let s = 0, a = 0;
		for (let t = 1; t < e.length - 1; t++) {
			let r = e[t].height - i.height;
			Math.abs(r) > s && (s = r, a = t);
		}
		const u = i, c = e[a], l = H.distance(ne.toCartesian(u), ne.toCartesian(c)), f = Math.abs(s / l), h = D.toDegrees(Math.atan(f)), p = Vo.fromHsl(.6 - h / 90 * .6, 1, .5);
		n.push(p);
		const d = c.longitude - u.longitude, m = c.latitude - u.latitude, y = D.toDegrees(Math.atan2(d, m));
		let g = a > 4 ? e[a - 4] : e[a + 4];
		const b = {
			targetPoint: e[a],
			center: i,
			diagonalPoint: g,
			heightDifference: s,
			aspect: y
		};
		r.push(b);
	}
	return {
		instances: r,
		colorList: n
	};
}
y(((e, r) => {
	let n = {};
	for (var o in e) t(n, o, {
		get: e[o],
		enumerable: !0
	});
	return r || t(n, Symbol.toStringTag, { value: "Module" }), n;
})({
	slopeAndAspect1_createGrid: () => Ps,
	slopeAndAspect3_GetSquareGroups: () => Ns,
	slopeAndAspect3_calculateSlope: () => Ds
}));
