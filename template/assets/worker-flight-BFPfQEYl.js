var t = Object.create, e = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, o = Object.prototype.hasOwnProperty, s = (t, e) => () => (e || (t((e = { exports: {} }).exports, e), t = null), e.exports), a = (s, a, u) => (u = null != s ? t(i(s)) : {}, ((t, i, s, a) => {
	if (i && "object" == typeof i || "function" == typeof i) for (var u, c = r(i), l = 0, h = c.length; l < h; l++) u = c[l], o.call(t, u) || void 0 === u || e(t, u, {
		get: ((t) => i[t]).bind(null, u),
		enumerable: !(a = n(i, u)) || a.enumerable
	});
	return t;
})(!a && s && s.__esModule ? u : e(u, "default", {
	value: s,
	enumerable: !0
}), s)), u = ((t) => "undefined" != typeof require ? require : "undefined" != typeof Proxy ? new Proxy(t, { get: (t, e) => ("undefined" != typeof require ? require : t)[e] }) : t)(function(t) {
	if ("undefined" != typeof require) return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + t + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/ const c = Symbol("Comlink.proxy"), l = Symbol("Comlink.endpoint"), h = Symbol("Comlink.releaseProxy"), f = Symbol("Comlink.finalizer"), p = Symbol("Comlink.thrown"), d = (t) => "object" == typeof t && null !== t || "function" == typeof t, m = /* @__PURE__ */ new Map([["proxy", {
	canHandle: (t) => d(t) && t[c],
	serialize(t) {
		const { port1: e, port2: n } = new MessageChannel();
		return y(t, e), [n, [n]];
	},
	deserialize: (t) => (t.start(), function(t) {
		const e = /* @__PURE__ */ new Map();
		return t.addEventListener("message", function(t) {
			const { data: n } = t;
			if (!n || !n.id) return;
			const r = e.get(n.id);
			if (r) try {
				r(n);
			} finally {
				e.delete(n.id);
			}
		}), b(t, e, [], void 0);
	}(t))
}], ["throw", {
	canHandle: (t) => d(t) && p in t,
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
function y(t, e = globalThis, n = ["*"]) {
	e.addEventListener("message", function r(i) {
		if (!i || !i.data) return;
		if (!function(t, e) {
			for (const n of t) {
				if (e === n || "*" === n) return !0;
				if (n instanceof RegExp && n.test(e)) return !0;
			}
			return !1;
		}(n, i.origin)) return void console.warn(`Invalid origin '${i.origin}' for comlink proxy`);
		const { id: o, type: s, path: a } = Object.assign({ path: [] }, i.data), u = (i.data.argumentList || []).map(R);
		let l;
		try {
			const e = a.slice(0, -1).reduce((t, e) => t[e], t), n = a.reduce((t, e) => t[e], t);
			switch (s) {
				case "GET":
					l = n;
					break;
				case "SET":
					e[a.slice(-1)[0]] = R(i.data.value), l = !0;
					break;
				case "APPLY":
					l = n.apply(e, u);
					break;
				case "CONSTRUCT":
					l = function(t) {
						return Object.assign(t, { [c]: !0 });
					}(new n(...u));
					break;
				case "ENDPOINT":
					{
						const { port1: e, port2: n } = new MessageChannel();
						y(t, n), l = function(t, e) {
							return A.set(t, e), t;
						}(e, [e]);
					}
					break;
				case "RELEASE":
					l = void 0;
					break;
				default: return;
			}
		} catch (t) {
			l = {
				value: t,
				[p]: 0
			};
		}
		Promise.resolve(l).catch((t) => ({
			value: t,
			[p]: 0
		})).then((n) => {
			const [i, a] = x(n);
			e.postMessage(Object.assign(Object.assign({}, i), { id: o }), a), "RELEASE" === s && (e.removeEventListener("message", r), g(e), f in t && "function" == typeof t[f] && t[f]());
		}).catch((t) => {
			const [n, r] = x({
				value: /* @__PURE__ */ new TypeError("Unserializable return value"),
				[p]: 0
			});
			e.postMessage(Object.assign(Object.assign({}, n), { id: o }), r);
		});
	}), e.start && e.start();
}
function g(t) {
	(function(t) {
		return "MessagePort" === t.constructor.name;
	})(t) && t.close();
}
function w(t) {
	if (t) throw new Error("Proxy has been released and is not useable");
}
function E(t) {
	return S(t, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then(() => {
		g(t);
	});
}
const _ = /* @__PURE__ */ new WeakMap(), O = "FinalizationRegistry" in globalThis && new FinalizationRegistry((t) => {
	const e = (_.get(t) || 0) - 1;
	_.set(t, e), 0 === e && E(t);
});
function b(t, e, n = [], r = function() {}) {
	let i = !1;
	const o = new Proxy(r, {
		get(r, s) {
			if (w(i), s === h) return () => {
				(function(t) {
					O && O.unregister(t);
				})(o), E(t), e.clear(), i = !0;
			};
			if ("then" === s) {
				if (0 === n.length) return { then: () => o };
				const r = S(t, e, {
					type: "GET",
					path: n.map((t) => t.toString())
				}).then(R);
				return r.then.bind(r);
			}
			return b(t, e, [...n, s]);
		},
		set(r, o, s) {
			w(i);
			const [a, u] = x(s);
			return S(t, e, {
				type: "SET",
				path: [...n, o].map((t) => t.toString()),
				value: a
			}, u).then(R);
		},
		apply(r, o, s) {
			w(i);
			const a = n[n.length - 1];
			if (a === l) return S(t, e, { type: "ENDPOINT" }).then(R);
			if ("bind" === a) return b(t, e, n.slice(0, -1));
			const [u, c] = T(s);
			return S(t, e, {
				type: "APPLY",
				path: n.map((t) => t.toString()),
				argumentList: u
			}, c).then(R);
		},
		construct(r, o) {
			w(i);
			const [s, a] = T(o);
			return S(t, e, {
				type: "CONSTRUCT",
				path: n.map((t) => t.toString()),
				argumentList: s
			}, a).then(R);
		}
	});
	return function(t, e) {
		const n = (_.get(e) || 0) + 1;
		_.set(e, n), O && O.register(t, e, t);
	}(o, t), o;
}
function T(t) {
	const e = t.map(x);
	return [e.map((t) => t[0]), (n = e.map((t) => t[1]), Array.prototype.concat.apply([], n))];
	var n;
}
const A = /* @__PURE__ */ new WeakMap();
function x(t) {
	for (const [e, n] of m) if (n.canHandle(t)) {
		const [r, i] = n.serialize(t);
		return [{
			type: "HANDLER",
			name: e,
			value: r
		}, i];
	}
	return [{
		type: "RAW",
		value: t
	}, A.get(t) || []];
}
function R(t) {
	switch (t.type) {
		case "HANDLER": return m.get(t.name).deserialize(t.value);
		case "RAW": return t.value;
	}
}
function S(t, e, n, r) {
	return new Promise((i) => {
		const o = new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
		e.set(o, i), t.start && t.start(), t.postMessage(Object.assign({ id: o }, n), r);
	});
}
const I = {};
function N(t) {
	return null != t;
}
function v(t) {
	let e;
	this.name = "DeveloperError", this.message = t;
	try {
		throw new Error();
	} catch (t) {
		e = t.stack;
	}
	this.stack = e;
}
I.EMPTY_OBJECT = Object.freeze({}), I.EMPTY_ARRAY = Object.freeze([]), N(Object.create) && (v.prototype = Object.create(Error.prototype), v.prototype.constructor = v), v.prototype.toString = function() {
	let t = `${this.name}: ${this.message}`;
	return N(this.stack) && (t += `\n${this.stack.toString()}`), t;
}, v.throwInstantiationError = function() {
	throw new v("This function defines an interface and should not be called directly.");
};
const M = {};
function P(t, e, n) {
	return `Expected ${n} to be typeof ${e}, actual typeof was ${t}`;
}
function C() {
	this._listeners = /* @__PURE__ */ new Map(), this._toRemove = /* @__PURE__ */ new Map(), this._toAdd = /* @__PURE__ */ new Map(), this._invokingListeners = !1, this._listenerCount = 0;
}
function q(t, e, n, r) {
	e.has(n) || e.set(n, /* @__PURE__ */ new Set());
	const i = e.get(n);
	return !i.has(r) && (i.add(r), !0);
}
function U(t, e, n, r) {
	const i = e.get(n);
	if (!i || !i.has(r)) return !1;
	if (t._invokingListeners) {
		if (!q(0, t._toRemove, n, r)) return !1;
	} else i.delete(r), 0 === i.size && e.delete(n);
	return !0;
}
M.typeOf = {}, M.defined = function(t, e) {
	if (!N(e)) throw new v(function(t) {
		return `${t} is required, actual value was undefined`;
	}(t));
}, M.typeOf.func = function(t, e) {
	if ("function" != typeof e) throw new v(P(typeof e, "function", t));
}, M.typeOf.string = function(t, e) {
	if ("string" != typeof e) throw new v(P(typeof e, "string", t));
}, M.typeOf.number = function(t, e) {
	if ("number" != typeof e) throw new v(P(typeof e, "number", t));
}, M.typeOf.number.lessThan = function(t, e, n) {
	if (M.typeOf.number(t, e), e >= n) throw new v(`Expected ${t} to be less than ${n}, actual value was ${e}`);
}, M.typeOf.number.lessThanOrEquals = function(t, e, n) {
	if (M.typeOf.number(t, e), e > n) throw new v(`Expected ${t} to be less than or equal to ${n}, actual value was ${e}`);
}, M.typeOf.number.greaterThan = function(t, e, n) {
	if (M.typeOf.number(t, e), e <= n) throw new v(`Expected ${t} to be greater than ${n}, actual value was ${e}`);
}, M.typeOf.number.greaterThanOrEquals = function(t, e, n) {
	if (M.typeOf.number(t, e), e < n) throw new v(`Expected ${t} to be greater than or equal to ${n}, actual value was ${e}`);
}, M.typeOf.object = function(t, e) {
	if ("object" != typeof e) throw new v(P(typeof e, "object", t));
}, M.typeOf.bool = function(t, e) {
	if ("boolean" != typeof e) throw new v(P(typeof e, "boolean", t));
}, M.typeOf.bigint = function(t, e) {
	if ("bigint" != typeof e) throw new v(P(typeof e, "bigint", t));
}, M.typeOf.number.equals = function(t, e, n, r) {
	if (M.typeOf.number(t, n), M.typeOf.number(e, r), n !== r) throw new v(`${t} must be equal to ${e}, the actual values are ${n} and ${r}`);
}, Object.defineProperties(C.prototype, { numberOfListeners: { get: function() {
	return this._listenerCount;
} } }), C.prototype.addEventListener = function(t, e) {
	M.typeOf.func("listener", t);
	const n = this;
	return q(0, n._invokingListeners ? n._toAdd : n._listeners, t, e) && n._listenerCount++, function() {
		n.removeEventListener(t, e);
	};
}, C.prototype.removeEventListener = function(t, e) {
	M.typeOf.func("listener", t);
	const n = U(this, this._listeners, t, e), r = U(this, this._toAdd, t, e), i = n || r;
	return i && this._listenerCount--, i;
}, C.prototype.raiseEvent = function() {
	this._invokingListeners = !0;
	for (const [t, e] of this._listeners.entries()) if (N(t)) for (const n of e) t.apply(n, arguments);
	this._invokingListeners = !1;
	for (const [t, e] of this._toAdd.entries()) for (const n of e) q(0, this._listeners, t, n);
	this._toAdd.clear();
	for (const [t, e] of this._toRemove.entries()) for (const n of e) U(this, this._listeners, t, n);
	this._toRemove.clear();
};
var L = a(s((t, e) => {
	var n = function(t) {
		null == t && (t = (/* @__PURE__ */ new Date()).getTime()), this.N = 624, this.M = 397, this.MATRIX_A = 2567483615, this.UPPER_MASK = 2147483648, this.LOWER_MASK = 2147483647, this.mt = new Array(this.N), this.mti = this.N + 1, t.constructor == Array ? this.init_by_array(t, t.length) : this.init_seed(t);
	};
	n.prototype.init_seed = function(t) {
		for (this.mt[0] = t >>> 0, this.mti = 1; this.mti < this.N; this.mti++) t = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30, this.mt[this.mti] = (1812433253 * ((4294901760 & t) >>> 16) << 16) + 1812433253 * (65535 & t) + this.mti, this.mt[this.mti] >>>= 0;
	}, n.prototype.init_by_array = function(t, e) {
		var n, r, i;
		for (this.init_seed(19650218), n = 1, r = 0, i = this.N > e ? this.N : e; i; i--) {
			var o = this.mt[n - 1] ^ this.mt[n - 1] >>> 30;
			this.mt[n] = (this.mt[n] ^ (1664525 * ((4294901760 & o) >>> 16) << 16) + 1664525 * (65535 & o)) + t[r] + r, this.mt[n] >>>= 0, r++, ++n >= this.N && (this.mt[0] = this.mt[this.N - 1], n = 1), r >= e && (r = 0);
		}
		for (i = this.N - 1; i; i--) o = this.mt[n - 1] ^ this.mt[n - 1] >>> 30, this.mt[n] = (this.mt[n] ^ (1566083941 * ((4294901760 & o) >>> 16) << 16) + 1566083941 * (65535 & o)) - n, this.mt[n] >>>= 0, ++n >= this.N && (this.mt[0] = this.mt[this.N - 1], n = 1);
		this.mt[0] = 2147483648;
	}, n.prototype.random_int = function() {
		var t, e = new Array(0, this.MATRIX_A);
		if (this.mti >= this.N) {
			var n;
			for (this.mti == this.N + 1 && this.init_seed(5489), n = 0; n < this.N - this.M; n++) t = this.mt[n] & this.UPPER_MASK | this.mt[n + 1] & this.LOWER_MASK, this.mt[n] = this.mt[n + this.M] ^ t >>> 1 ^ e[1 & t];
			for (; n < this.N - 1; n++) t = this.mt[n] & this.UPPER_MASK | this.mt[n + 1] & this.LOWER_MASK, this.mt[n] = this.mt[n + (this.M - this.N)] ^ t >>> 1 ^ e[1 & t];
			t = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK, this.mt[this.N - 1] = this.mt[this.M - 1] ^ t >>> 1 ^ e[1 & t], this.mti = 0;
		}
		return t = this.mt[this.mti++], t ^= t >>> 11, t ^= t << 7 & 2636928640, t ^= t << 15 & 4022730752, (t ^= t >>> 18) >>> 0;
	}, n.prototype.random_int31 = function() {
		return this.random_int() >>> 1;
	}, n.prototype.random_incl = function() {
		return this.random_int() * (1 / 4294967295);
	}, n.prototype.random = function() {
		return this.random_int() * (1 / 4294967296);
	}, n.prototype.random_excl = function() {
		return (this.random_int() + .5) * (1 / 4294967296);
	}, n.prototype.random_long = function() {
		return (67108864 * (this.random_int() >>> 5) + (this.random_int() >>> 6)) * (1 / 9007199254740992);
	}, e.exports = n;
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
D.sign = Math.sign ?? function(t) {
	return 0 === (t = +t) || t != t ? t : t > 0 ? 1 : -1;
}, D.signNotZero = function(t) {
	return t < 0 ? -1 : 1;
}, D.toSNorm = function(t, e) {
	return e = e ?? 255, Math.round((.5 * D.clamp(t, -1, 1) + .5) * e);
}, D.fromSNorm = function(t, e) {
	return e = e ?? 255, D.clamp(t, 0, e) / e * 2 - 1;
}, D.normalize = function(t, e, n) {
	return 0 === (n = Math.max(n - e, 0)) ? 0 : D.clamp((t - e) / n, 0, 1);
}, D.sinh = Math.sinh ?? function(t) {
	return (Math.exp(t) - Math.exp(-t)) / 2;
}, D.cosh = Math.cosh ?? function(t) {
	return (Math.exp(t) + Math.exp(-t)) / 2;
}, D.lerp = function(t, e, n) {
	return (1 - n) * t + n * e;
}, D.PI = Math.PI, D.ONE_OVER_PI = 1 / Math.PI, D.PI_OVER_TWO = Math.PI / 2, D.PI_OVER_THREE = Math.PI / 3, D.PI_OVER_FOUR = Math.PI / 4, D.PI_OVER_SIX = Math.PI / 6, D.THREE_PI_OVER_TWO = 3 * Math.PI / 2, D.TWO_PI = 2 * Math.PI, D.ONE_OVER_TWO_PI = 1 / (2 * Math.PI), D.RADIANS_PER_DEGREE = Math.PI / 180, D.DEGREES_PER_RADIAN = 180 / Math.PI, D.RADIANS_PER_ARCSECOND = D.RADIANS_PER_DEGREE / 3600, D.toRadians = function(t) {
	if (!N(t)) throw new v("degrees is required.");
	return t * D.RADIANS_PER_DEGREE;
}, D.toDegrees = function(t) {
	if (!N(t)) throw new v("radians is required.");
	return t * D.DEGREES_PER_RADIAN;
}, D.convertLongitudeRange = function(t) {
	if (!N(t)) throw new v("angle is required.");
	const e = D.TWO_PI, n = t - Math.floor(t / e) * e;
	return n < -Math.PI ? n + e : n >= Math.PI ? n - e : n;
}, D.clampToLatitudeRange = function(t) {
	if (!N(t)) throw new v("angle is required.");
	return D.clamp(t, -1 * D.PI_OVER_TWO, D.PI_OVER_TWO);
}, D.negativePiToPi = function(t) {
	if (!N(t)) throw new v("angle is required.");
	return t >= -D.PI && t <= D.PI ? t : D.zeroToTwoPi(t + D.PI) - D.PI;
}, D.zeroToTwoPi = function(t) {
	if (!N(t)) throw new v("angle is required.");
	if (t >= 0 && t <= D.TWO_PI) return t;
	const e = D.mod(t, D.TWO_PI);
	return Math.abs(e) < D.EPSILON14 && Math.abs(t) > D.EPSILON14 ? D.TWO_PI : e;
}, D.mod = function(t, e) {
	if (!N(t)) throw new v("m is required.");
	if (!N(e)) throw new v("n is required.");
	if (0 === e) throw new v("divisor cannot be 0.");
	return D.sign(t) === D.sign(e) && Math.abs(t) < Math.abs(e) ? t : (t % e + e) % e;
}, D.equalsEpsilon = function(t, e, n, r) {
	if (!N(t)) throw new v("left is required.");
	if (!N(e)) throw new v("right is required.");
	n = n ?? 0, r = r ?? n;
	const i = Math.abs(t - e);
	return i <= r || i <= n * Math.max(Math.abs(t), Math.abs(e));
}, D.lessThan = function(t, e, n) {
	if (!N(t)) throw new v("first is required.");
	if (!N(e)) throw new v("second is required.");
	if (!N(n)) throw new v("absoluteEpsilon is required.");
	return t - e < -n;
}, D.lessThanOrEquals = function(t, e, n) {
	if (!N(t)) throw new v("first is required.");
	if (!N(e)) throw new v("second is required.");
	if (!N(n)) throw new v("absoluteEpsilon is required.");
	return t - e < n;
}, D.greaterThan = function(t, e, n) {
	if (!N(t)) throw new v("first is required.");
	if (!N(e)) throw new v("second is required.");
	if (!N(n)) throw new v("absoluteEpsilon is required.");
	return t - e > n;
}, D.greaterThanOrEquals = function(t, e, n) {
	if (!N(t)) throw new v("first is required.");
	if (!N(e)) throw new v("second is required.");
	if (!N(n)) throw new v("absoluteEpsilon is required.");
	return t - e > -n;
};
const z = [1];
D.factorial = function(t) {
	if ("number" != typeof t || t < 0) throw new v("A number greater than or equal to 0 is required.");
	const e = z.length;
	if (t >= e) {
		let n = z[e - 1];
		for (let r = e; r <= t; r++) {
			const t = n * r;
			z.push(t), n = t;
		}
	}
	return z[t];
}, D.incrementWrap = function(t, e, n) {
	if (n = n ?? 0, !N(t)) throw new v("n is required.");
	if (e <= n) throw new v("maximumValue must be greater than minimumValue.");
	return ++t > e && (t = n), t;
}, D.isPowerOfTwo = function(t) {
	if ("number" != typeof t || t < 0 || t > 4294967295) throw new v("A number between 0 and (2^32)-1 is required.");
	return 0 !== t && !(t & t - 1);
}, D.nextPowerOfTwo = function(t) {
	if ("number" != typeof t || t < 0 || t > 2147483648) throw new v("A number between 0 and 2^31 is required.");
	return --t, t |= t >> 1, t |= t >> 2, t |= t >> 4, t |= t >> 8, t |= t >> 16, ++t;
}, D.previousPowerOfTwo = function(t) {
	if ("number" != typeof t || t < 0 || t > 4294967295) throw new v("A number between 0 and (2^32)-1 is required.");
	return t |= t >> 1, t |= t >> 2, t |= t >> 4, t |= t >> 8, t |= t >> 16, ((t |= t >> 32) >>> 0) - (t >>> 1);
}, D.clamp = function(t, e, n) {
	return M.typeOf.number("value", t), M.typeOf.number("min", e), M.typeOf.number("max", n), t < e ? e : t > n ? n : t;
};
let j = new L.default();
D.setRandomNumberSeed = function(t) {
	if (!N(t)) throw new v("seed is required.");
	j = new L.default(t);
}, D.nextRandomNumber = function() {
	return j.random();
}, D.randomBetween = function(t, e) {
	return D.nextRandomNumber() * (e - t) + t;
}, D.acosClamped = function(t) {
	if (!N(t)) throw new v("value is required.");
	return Math.acos(D.clamp(t, -1, 1));
}, D.asinClamped = function(t) {
	if (!N(t)) throw new v("value is required.");
	return Math.asin(D.clamp(t, -1, 1));
}, D.chordLength = function(t, e) {
	if (!N(t)) throw new v("angle is required.");
	if (!N(e)) throw new v("radius is required.");
	return 2 * e * Math.sin(.5 * t);
}, D.logBase = function(t, e) {
	if (!N(t)) throw new v("number is required.");
	if (!N(e)) throw new v("base is required.");
	return Math.log(t) / Math.log(e);
}, D.cbrt = Math.cbrt ?? function(t) {
	const e = Math.pow(Math.abs(t), 1 / 3);
	return t < 0 ? -e : e;
}, D.log2 = Math.log2 ?? function(t) {
	return Math.log(t) * Math.LOG2E;
}, D.fog = function(t, e) {
	const n = t * e;
	return 1 - Math.exp(-n * n);
}, D.fastApproximateAtan = function(t) {
	return M.typeOf.number("x", t), t * (-.1784 * Math.abs(t) - .0663 * t * t + 1.0301);
}, D.fastApproximateAtan2 = function(t, e) {
	let n;
	M.typeOf.number("x", t), M.typeOf.number("y", e);
	let r = Math.abs(t);
	n = Math.abs(e);
	const i = Math.max(r, n);
	n = Math.min(r, n);
	const o = n / i;
	if (isNaN(o)) throw new v("either x or y must be nonzero");
	return r = D.fastApproximateAtan(o), r = Math.abs(e) > Math.abs(t) ? D.PI_OVER_TWO - r : r, r = t < 0 ? D.PI - r : r, r = e < 0 ? -r : r, r;
};
var F = class t {
	constructor(t, e) {
		this.x = t ?? 0, this.y = e ?? 0;
	}
	static fromElements(e, n, r) {
		return N(r) ? (r.x = e, r.y = n, r) : new t(e, n);
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n.x = e.x, n.y = e.y, n) : new t(e.x, e.y);
	}
	static pack(t, e, n) {
		return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, e[n++] = t.x, e[n] = t.y, e;
	}
	static unpack(e, n, r) {
		return M.defined("array", e), n = n ?? 0, N(r) || (r = new t()), r.x = e[n++], r.y = e[n], r;
	}
	static packArray(e, n) {
		M.defined("array", e);
		const r = e.length, i = 2 * r;
		if (N(n)) {
			if (!Array.isArray(n) && n.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 2 elements");
			n.length !== i && (n.length = i);
		} else n = new Array(i);
		for (let o = 0; o < r; ++o) t.pack(e[o], n, 2 * o);
		return n;
	}
	static unpackArray(e, n) {
		if (M.defined("array", e), M.typeOf.number.greaterThanOrEquals("array.length", e.length, 2), e.length % 2 != 0) throw new v("array length must be a multiple of 2.");
		const r = e.length;
		N(n) ? n.length = r / 2 : n = new Array(r / 2);
		for (let i = 0; i < r; i += 2) {
			const r = i / 2;
			n[r] = t.unpack(e, i, n[r]);
		}
		return n;
	}
	static maximumComponent(t) {
		return M.typeOf.object("cartesian", t), Math.max(t.x, t.y);
	}
	static minimumComponent(t) {
		return M.typeOf.object("cartesian", t), Math.min(t.x, t.y);
	}
	static minimumByComponent(t, e, n) {
		return M.typeOf.object("first", t), M.typeOf.object("second", e), M.typeOf.object("result", n), n.x = Math.min(t.x, e.x), n.y = Math.min(t.y, e.y), n;
	}
	static maximumByComponent(t, e, n) {
		return M.typeOf.object("first", t), M.typeOf.object("second", e), M.typeOf.object("result", n), n.x = Math.max(t.x, e.x), n.y = Math.max(t.y, e.y), n;
	}
	static clamp(t, e, n, r) {
		M.typeOf.object("value", t), M.typeOf.object("min", e), M.typeOf.object("max", n), M.typeOf.object("result", r);
		const i = D.clamp(t.x, e.x, n.x), o = D.clamp(t.y, e.y, n.y);
		return r.x = i, r.y = o, r;
	}
	static magnitudeSquared(t) {
		return M.typeOf.object("cartesian", t), t.x * t.x + t.y * t.y;
	}
	static magnitude(e) {
		return Math.sqrt(t.magnitudeSquared(e));
	}
	static distance(e, n) {
		return M.typeOf.object("left", e), M.typeOf.object("right", n), t.subtract(e, n, B), t.magnitude(B);
	}
	static distanceSquared(e, n) {
		return M.typeOf.object("left", e), M.typeOf.object("right", n), t.subtract(e, n, B), t.magnitudeSquared(B);
	}
	static normalize(e, n) {
		M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = t.magnitude(e);
		if (n.x = e.x / r, n.y = e.y / r, isNaN(n.x) || isNaN(n.y)) throw new v("normalized result is not a number");
		return n;
	}
	static dot(t, e) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), t.x * e.x + t.y * e.y;
	}
	static cross(t, e) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), t.x * e.y - t.y * e.x;
	}
	static multiplyComponents(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x * e.x, n.y = t.y * e.y, n;
	}
	static divideComponents(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x / e.x, n.y = t.y / e.y, n;
	}
	static add(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x + e.x, n.y = t.y + e.y, n;
	}
	static subtract(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x - e.x, n.y = t.y - e.y, n;
	}
	static multiplyByScalar(t, e, n) {
		return M.typeOf.object("cartesian", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n.x = t.x * e, n.y = t.y * e, n;
	}
	static divideByScalar(t, e, n) {
		return M.typeOf.object("cartesian", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n.x = t.x / e, n.y = t.y / e, n;
	}
	static negate(t, e) {
		return M.typeOf.object("cartesian", t), M.typeOf.object("result", e), e.x = -t.x, e.y = -t.y, e;
	}
	static abs(t, e) {
		return M.typeOf.object("cartesian", t), M.typeOf.object("result", e), e.x = Math.abs(t.x), e.y = Math.abs(t.y), e;
	}
	static lerp(e, n, r, i) {
		return M.typeOf.object("start", e), M.typeOf.object("end", n), M.typeOf.number("t", r), M.typeOf.object("result", i), t.multiplyByScalar(n, r, G), i = t.multiplyByScalar(e, 1 - r, i), t.add(G, i, i);
	}
	static angleBetween(e, n) {
		return M.typeOf.object("left", e), M.typeOf.object("right", n), t.normalize(e, k), t.normalize(n, W), D.acosClamped(t.dot(k, W));
	}
	static mostOrthogonalAxis(e, n) {
		M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = t.normalize(e, V);
		return t.abs(r, r), r.x <= r.y ? t.clone(t.UNIT_X, n) : t.clone(t.UNIT_Y, n);
	}
	static equals(t, e) {
		return t === e || N(t) && N(e) && t.x === e.x && t.y === e.y;
	}
	static equalsArray(t, e, n) {
		return t.x === e[n] && t.y === e[n + 1];
	}
	static equalsEpsilon(t, e, n, r) {
		return t === e || N(t) && N(e) && D.equalsEpsilon(t.x, e.x, n, r) && D.equalsEpsilon(t.y, e.y, n, r);
	}
	clone(e) {
		return t.clone(this, e);
	}
	equals(e) {
		return t.equals(this, e);
	}
	equalsEpsilon(e, n, r) {
		return t.equalsEpsilon(this, e, n, r);
	}
	toString() {
		return `(${this.x}, ${this.y})`;
	}
};
F.fromCartesian3 = F.clone, F.fromCartesian4 = F.clone, F.packedLength = 2, F.fromArray = F.unpack;
const B = new F(), G = new F(), k = new F(), W = new F(), V = new F();
F.ZERO = Object.freeze(new F(0, 0)), F.ONE = Object.freeze(new F(1, 1)), F.UNIT_X = Object.freeze(new F(1, 0)), F.UNIT_Y = Object.freeze(new F(0, 1));
var H = class t {
	constructor(t, e, n) {
		this.x = t ?? 0, this.y = e ?? 0, this.z = n ?? 0;
	}
	static fromSpherical(e, n) {
		M.typeOf.object("spherical", e), N(n) || (n = new t());
		const r = e.clock, i = e.cone, o = e.magnitude ?? 1, s = o * Math.sin(i);
		return n.x = s * Math.cos(r), n.y = s * Math.sin(r), n.z = o * Math.cos(i), n;
	}
	static fromElements(e, n, r, i) {
		return N(i) ? (i.x = e, i.y = n, i.z = r, i) : new t(e, n, r);
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n.x = e.x, n.y = e.y, n.z = e.z, n) : new t(e.x, e.y, e.z);
	}
	static pack(t, e, n) {
		return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, e[n++] = t.x, e[n++] = t.y, e[n] = t.z, e;
	}
	static unpack(e, n, r) {
		return M.defined("array", e), n = n ?? 0, N(r) || (r = new t()), r.x = e[n++], r.y = e[n++], r.z = e[n], r;
	}
	static packArray(e, n) {
		M.defined("array", e);
		const r = e.length, i = 3 * r;
		if (N(n)) {
			if (!Array.isArray(n) && n.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 3 elements");
			n.length !== i && (n.length = i);
		} else n = new Array(i);
		for (let o = 0; o < r; ++o) t.pack(e[o], n, 3 * o);
		return n;
	}
	static unpackArray(e, n) {
		if (M.defined("array", e), M.typeOf.number.greaterThanOrEquals("array.length", e.length, 3), e.length % 3 != 0) throw new v("array length must be a multiple of 3.");
		const r = e.length;
		N(n) ? n.length = r / 3 : n = new Array(r / 3);
		for (let i = 0; i < r; i += 3) {
			const r = i / 3;
			n[r] = t.unpack(e, i, n[r]);
		}
		return n;
	}
	static maximumComponent(t) {
		return M.typeOf.object("cartesian", t), Math.max(t.x, t.y, t.z);
	}
	static minimumComponent(t) {
		return M.typeOf.object("cartesian", t), Math.min(t.x, t.y, t.z);
	}
	static minimumByComponent(t, e, n) {
		return M.typeOf.object("first", t), M.typeOf.object("second", e), M.typeOf.object("result", n), n.x = Math.min(t.x, e.x), n.y = Math.min(t.y, e.y), n.z = Math.min(t.z, e.z), n;
	}
	static maximumByComponent(t, e, n) {
		return M.typeOf.object("first", t), M.typeOf.object("second", e), M.typeOf.object("result", n), n.x = Math.max(t.x, e.x), n.y = Math.max(t.y, e.y), n.z = Math.max(t.z, e.z), n;
	}
	static clamp(t, e, n, r) {
		M.typeOf.object("value", t), M.typeOf.object("min", e), M.typeOf.object("max", n), M.typeOf.object("result", r);
		const i = D.clamp(t.x, e.x, n.x), o = D.clamp(t.y, e.y, n.y), s = D.clamp(t.z, e.z, n.z);
		return r.x = i, r.y = o, r.z = s, r;
	}
	static magnitudeSquared(t) {
		return M.typeOf.object("cartesian", t), t.x * t.x + t.y * t.y + t.z * t.z;
	}
	static magnitude(e) {
		return Math.sqrt(t.magnitudeSquared(e));
	}
	static distance(e, n) {
		return M.typeOf.object("left", e), M.typeOf.object("right", n), t.subtract(e, n, X), t.magnitude(X);
	}
	static distanceSquared(e, n) {
		return M.typeOf.object("left", e), M.typeOf.object("right", n), t.subtract(e, n, X), t.magnitudeSquared(X);
	}
	static normalize(e, n) {
		M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = t.magnitude(e);
		if (n.x = e.x / r, n.y = e.y / r, n.z = e.z / r, isNaN(n.x) || isNaN(n.y) || isNaN(n.z)) throw new v("normalized result is not a number");
		return n;
	}
	static dot(t, e) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), t.x * e.x + t.y * e.y + t.z * e.z;
	}
	static multiplyComponents(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x * e.x, n.y = t.y * e.y, n.z = t.z * e.z, n;
	}
	static divideComponents(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x / e.x, n.y = t.y / e.y, n.z = t.z / e.z, n;
	}
	static add(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x + e.x, n.y = t.y + e.y, n.z = t.z + e.z, n;
	}
	static subtract(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x - e.x, n.y = t.y - e.y, n.z = t.z - e.z, n;
	}
	static multiplyByScalar(t, e, n) {
		return M.typeOf.object("cartesian", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n.x = t.x * e, n.y = t.y * e, n.z = t.z * e, n;
	}
	static divideByScalar(t, e, n) {
		return M.typeOf.object("cartesian", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n.x = t.x / e, n.y = t.y / e, n.z = t.z / e, n;
	}
	static negate(t, e) {
		return M.typeOf.object("cartesian", t), M.typeOf.object("result", e), e.x = -t.x, e.y = -t.y, e.z = -t.z, e;
	}
	static abs(t, e) {
		return M.typeOf.object("cartesian", t), M.typeOf.object("result", e), e.x = Math.abs(t.x), e.y = Math.abs(t.y), e.z = Math.abs(t.z), e;
	}
	static lerp(e, n, r, i) {
		return M.typeOf.object("start", e), M.typeOf.object("end", n), M.typeOf.number("t", r), M.typeOf.object("result", i), t.multiplyByScalar(n, r, Y), i = t.multiplyByScalar(e, 1 - r, i), t.add(Y, i, i);
	}
	static angleBetween(e, n) {
		M.typeOf.object("left", e), M.typeOf.object("right", n), t.normalize(e, $), t.normalize(n, Z);
		const r = t.dot($, Z), i = t.magnitude(t.cross($, Z, $));
		return Math.atan2(i, r);
	}
	static mostOrthogonalAxis(e, n) {
		M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = t.normalize(e, Q);
		return t.abs(r, r), r.x <= r.y ? r.x <= r.z ? t.clone(t.UNIT_X, n) : t.clone(t.UNIT_Z, n) : r.y <= r.z ? t.clone(t.UNIT_Y, n) : t.clone(t.UNIT_Z, n);
	}
	static projectVector(e, n, r) {
		M.defined("a", e), M.defined("b", n), M.defined("result", r);
		const i = t.dot(e, n) / t.dot(n, n);
		return t.multiplyByScalar(n, i, r);
	}
	static equals(t, e) {
		return t === e || N(t) && N(e) && t.x === e.x && t.y === e.y && t.z === e.z;
	}
	static equalsArray(t, e, n) {
		return t.x === e[n] && t.y === e[n + 1] && t.z === e[n + 2];
	}
	static equalsEpsilon(t, e, n, r) {
		return t === e || N(t) && N(e) && D.equalsEpsilon(t.x, e.x, n, r) && D.equalsEpsilon(t.y, e.y, n, r) && D.equalsEpsilon(t.z, e.z, n, r);
	}
	static cross(t, e, n) {
		M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n);
		const r = t.x, i = t.y, o = t.z, s = e.x, a = e.y, u = e.z, c = i * u - o * a, l = o * s - r * u, h = r * a - i * s;
		return n.x = c, n.y = l, n.z = h, n;
	}
	static midpoint(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = .5 * (t.x + e.x), n.y = .5 * (t.y + e.y), n.z = .5 * (t.z + e.z), n;
	}
	static fromDegrees(e, n, r, i, o) {
		return M.typeOf.number("longitude", e), M.typeOf.number("latitude", n), e = D.toRadians(e), n = D.toRadians(n), t.fromRadians(e, n, r, i, o);
	}
	static fromRadians(e, n, r, i, o) {
		M.typeOf.number("longitude", e), M.typeOf.number("latitude", n), r = r ?? 0;
		const s = N(i) ? i.radiiSquared : t._ellipsoidRadiiSquared, a = Math.cos(n);
		K.x = a * Math.cos(e), K.y = a * Math.sin(e), K.z = Math.sin(n), K = t.normalize(K, K), t.multiplyComponents(s, K, J);
		const u = Math.sqrt(t.dot(K, J));
		return J = t.divideByScalar(J, u, J), K = t.multiplyByScalar(K, r, K), N(o) || (o = new t()), t.add(J, K, o);
	}
	static fromDegreesArray(e, n, r) {
		if (M.defined("coordinates", e), e.length < 2 || e.length % 2 != 0) throw new v("the number of coordinates must be a multiple of 2 and at least 2");
		const i = e.length;
		N(r) ? r.length = i / 2 : r = new Array(i / 2);
		for (let o = 0; o < i; o += 2) {
			const i = e[o], s = e[o + 1], a = o / 2;
			r[a] = t.fromDegrees(i, s, 0, n, r[a]);
		}
		return r;
	}
	static fromRadiansArray(e, n, r) {
		if (M.defined("coordinates", e), e.length < 2 || e.length % 2 != 0) throw new v("the number of coordinates must be a multiple of 2 and at least 2");
		const i = e.length;
		N(r) ? r.length = i / 2 : r = new Array(i / 2);
		for (let o = 0; o < i; o += 2) {
			const i = e[o], s = e[o + 1], a = o / 2;
			r[a] = t.fromRadians(i, s, 0, n, r[a]);
		}
		return r;
	}
	static fromDegreesArrayHeights(e, n, r) {
		if (M.defined("coordinates", e), e.length < 3 || e.length % 3 != 0) throw new v("the number of coordinates must be a multiple of 3 and at least 3");
		const i = e.length;
		N(r) ? r.length = i / 3 : r = new Array(i / 3);
		for (let o = 0; o < i; o += 3) {
			const i = e[o], s = e[o + 1], a = e[o + 2], u = o / 3;
			r[u] = t.fromDegrees(i, s, a, n, r[u]);
		}
		return r;
	}
	static fromRadiansArrayHeights(e, n, r) {
		if (M.defined("coordinates", e), e.length < 3 || e.length % 3 != 0) throw new v("the number of coordinates must be a multiple of 3 and at least 3");
		const i = e.length;
		N(r) ? r.length = i / 3 : r = new Array(i / 3);
		for (let o = 0; o < i; o += 3) {
			const i = e[o], s = e[o + 1], a = e[o + 2], u = o / 3;
			r[u] = t.fromRadians(i, s, a, n, r[u]);
		}
		return r;
	}
	clone(e) {
		return t.clone(this, e);
	}
	equals(e) {
		return t.equals(this, e);
	}
	equalsEpsilon(e, n, r) {
		return t.equalsEpsilon(this, e, n, r);
	}
	toString() {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}
};
H.fromCartesian4 = H.clone, H.packedLength = 3, H.fromArray = H.unpack;
const X = new H(), Y = new H(), $ = new H(), Z = new H(), Q = new H();
let K = new H(), J = new H();
H._ellipsoidRadiiSquared = new H(40680631590769, 40680631590769, 40408299984661.445), H.ZERO = Object.freeze(new H(0, 0, 0)), H.ONE = Object.freeze(new H(1, 1, 1)), H.UNIT_X = Object.freeze(new H(1, 0, 0)), H.UNIT_Y = Object.freeze(new H(0, 1, 0)), H.UNIT_Z = Object.freeze(new H(0, 0, 1));
const tt = new H(), et = new H();
function nt(t, e, n, r, i) {
	if (!N(t)) throw new v("cartesian is required.");
	if (!N(e)) throw new v("oneOverRadii is required.");
	if (!N(n)) throw new v("oneOverRadiiSquared is required.");
	if (!N(r)) throw new v("centerToleranceSquared is required.");
	const o = t.x, s = t.y, a = t.z, u = e.x, c = e.y, l = e.z, h = o * o * u * u, f = s * s * c * c, p = a * a * l * l, d = h + f + p, m = Math.sqrt(1 / d), y = H.multiplyByScalar(t, m, tt);
	if (d < r) return isFinite(m) ? H.clone(y, i) : void 0;
	const g = n.x, w = n.y, E = n.z, _ = et;
	_.x = y.x * g * 2, _.y = y.y * w * 2, _.z = y.z * E * 2;
	let O, b, T, A, x, R, S, I, M, P, C, q = (1 - m) * H.magnitude(t) / (.5 * H.magnitude(_)), U = 0;
	do
		q -= U, T = 1 / (1 + q * g), A = 1 / (1 + q * w), x = 1 / (1 + q * E), R = T * T, S = A * A, I = x * x, M = R * T, P = S * A, C = I * x, O = h * R + f * S + p * I - 1, b = h * M * g + f * P * w + p * C * E, U = O / (-2 * b);
	while (Math.abs(O) > D.EPSILON12);
	return N(i) ? (i.x = o * T, i.y = s * A, i.z = a * x, i) : new H(o * T, s * A, a * x);
}
var rt = class t {
	constructor(t, e, n) {
		this.longitude = t ?? 0, this.latitude = e ?? 0, this.height = n ?? 0;
	}
	static fromRadians(e, n, r, i) {
		return M.typeOf.number("longitude", e), M.typeOf.number("latitude", n), r = r ?? 0, N(i) ? (i.longitude = e, i.latitude = n, i.height = r, i) : new t(e, n, r);
	}
	static fromDegrees(e, n, r, i) {
		return M.typeOf.number("longitude", e), M.typeOf.number("latitude", n), e = D.toRadians(e), n = D.toRadians(n), t.fromRadians(e, n, r, i);
	}
	static fromCartesian(e, n, r) {
		const i = N(n) ? n.oneOverRadii : t._ellipsoidOneOverRadii, o = N(n) ? n.oneOverRadiiSquared : t._ellipsoidOneOverRadiiSquared, s = nt(e, i, o, N(n) ? n._centerToleranceSquared : t._ellipsoidCenterToleranceSquared, ot);
		if (!N(s)) return;
		let a = H.multiplyComponents(s, o, it);
		a = H.normalize(a, a);
		const u = H.subtract(e, s, st), c = Math.atan2(a.y, a.x), l = Math.asin(a.z), h = D.sign(H.dot(u, e)) * H.magnitude(u);
		return N(r) ? (r.longitude = c, r.latitude = l, r.height = h, r) : new t(c, l, h);
	}
	static toCartesian(t, e, n) {
		return M.defined("cartographic", t), H.fromRadians(t.longitude, t.latitude, t.height, e, n);
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n.longitude = e.longitude, n.latitude = e.latitude, n.height = e.height, n) : new t(e.longitude, e.latitude, e.height);
	}
	static equals(t, e) {
		return t === e || N(t) && N(e) && t.longitude === e.longitude && t.latitude === e.latitude && t.height === e.height;
	}
	static equalsEpsilon(t, e, n) {
		return n = n ?? 0, t === e || N(t) && N(e) && Math.abs(t.longitude - e.longitude) <= n && Math.abs(t.latitude - e.latitude) <= n && Math.abs(t.height - e.height) <= n;
	}
	clone(e) {
		return t.clone(this, e);
	}
	equals(e) {
		return t.equals(this, e);
	}
	equalsEpsilon(e, n) {
		return t.equalsEpsilon(this, e, n);
	}
	toString() {
		return `(${this.longitude}, ${this.latitude}, ${this.height})`;
	}
	static _ellipsoidOneOverRadii = new H(1 / 6378137, 1 / 6378137, 1 / 6356752.314245179);
	static _ellipsoidOneOverRadiiSquared = new H(1 / 40680631590769, 1 / 40680631590769, 1 / 40408299984661.445);
	static _ellipsoidCenterToleranceSquared = D.EPSILON1;
};
rt.ZERO = Object.freeze(new rt(0, 0, 0));
const it = new H(), ot = new H(), st = new H();
function at(t, e, n, r) {
	e = e ?? 0, n = n ?? 0, r = r ?? 0, M.typeOf.number.greaterThanOrEquals("x", e, 0), M.typeOf.number.greaterThanOrEquals("y", n, 0), M.typeOf.number.greaterThanOrEquals("z", r, 0), t._radii = new H(e, n, r), t._radiiSquared = new H(e * e, n * n, r * r), t._radiiToTheFourth = new H(e * e * e * e, n * n * n * n, r * r * r * r), t._oneOverRadii = new H(0 === e ? 0 : 1 / e, 0 === n ? 0 : 1 / n, 0 === r ? 0 : 1 / r), t._oneOverRadiiSquared = new H(0 === e ? 0 : 1 / (e * e), 0 === n ? 0 : 1 / (n * n), 0 === r ? 0 : 1 / (r * r)), t._minimumRadius = Math.min(e, n, r), t._maximumRadius = Math.max(e, n, r), t._centerToleranceSquared = D.EPSILON1, 0 !== t._radiiSquared.z && (t._squaredXOverSquaredZ = t._radiiSquared.x / t._radiiSquared.z);
}
var ut = class t {
	constructor(t, e, n) {
		this._radii = void 0, this._radiiSquared = void 0, this._radiiToTheFourth = void 0, this._oneOverRadii = void 0, this._oneOverRadiiSquared = void 0, this._minimumRadius = void 0, this._maximumRadius = void 0, this._centerToleranceSquared = void 0, this._squaredXOverSquaredZ = void 0, at(this, t, e, n);
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
	static clone(e, n) {
		if (!N(e)) return;
		const r = e._radii;
		return N(n) ? (H.clone(r, n._radii), H.clone(e._radiiSquared, n._radiiSquared), H.clone(e._radiiToTheFourth, n._radiiToTheFourth), H.clone(e._oneOverRadii, n._oneOverRadii), H.clone(e._oneOverRadiiSquared, n._oneOverRadiiSquared), n._minimumRadius = e._minimumRadius, n._maximumRadius = e._maximumRadius, n._centerToleranceSquared = e._centerToleranceSquared, n) : new t(r.x, r.y, r.z);
	}
	static fromCartesian3(e, n) {
		return N(n) || (n = new t()), N(e) ? (at(n, e.x, e.y, e.z), n) : n;
	}
	static get default() {
		return t._default;
	}
	static set default(e) {
		M.typeOf.object("value", e), t._default = e, H._ellipsoidRadiiSquared = e.radiiSquared, rt._ellipsoidOneOverRadii = e.oneOverRadii, rt._ellipsoidOneOverRadiiSquared = e.oneOverRadiiSquared, rt._ellipsoidCenterToleranceSquared = e._centerToleranceSquared;
	}
	clone(e) {
		return t.clone(this, e);
	}
	static pack(t, e, n) {
		return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, H.pack(t._radii, e, n), e;
	}
	static unpack(e, n, r) {
		M.defined("array", e), n = n ?? 0;
		const i = H.unpack(e, n);
		return t.fromCartesian3(i, r);
	}
	geodeticSurfaceNormalCartographic(t, e) {
		M.typeOf.object("cartographic", t);
		const n = t.longitude, r = t.latitude, i = Math.cos(r), o = i * Math.cos(n), s = i * Math.sin(n), a = Math.sin(r);
		return N(e) || (e = new H()), e.x = o, e.y = s, e.z = a, H.normalize(e, e);
	}
	geodeticSurfaceNormal(t, e) {
		if (M.typeOf.object("cartesian", t), isNaN(t.x) || isNaN(t.y) || isNaN(t.z)) throw new v("cartesian has a NaN component");
		if (!H.equalsEpsilon(t, H.ZERO, D.EPSILON14)) return N(e) || (e = new H()), e = H.multiplyComponents(t, this._oneOverRadiiSquared, e), H.normalize(e, e);
	}
	cartographicToCartesian(t, e) {
		const n = ct, r = lt;
		this.geodeticSurfaceNormalCartographic(t, n), H.multiplyComponents(this._radiiSquared, n, r);
		const i = Math.sqrt(H.dot(n, r));
		return H.divideByScalar(r, i, r), H.multiplyByScalar(n, t.height, n), N(e) || (e = new H()), H.add(r, n, e);
	}
	cartographicArrayToCartesianArray(t, e) {
		M.defined("cartographics", t);
		const n = t.length;
		N(e) ? e.length = n : e = new Array(n);
		for (let r = 0; r < n; r++) e[r] = this.cartographicToCartesian(t[r], e[r]);
		return e;
	}
	cartesianToCartographic(t, e) {
		const n = this.scaleToGeodeticSurface(t, ft);
		if (!N(n)) return;
		const r = this.geodeticSurfaceNormal(n, ht), i = H.subtract(t, n, pt), o = Math.atan2(r.y, r.x), s = Math.asin(r.z), a = D.sign(H.dot(i, t)) * H.magnitude(i);
		return N(e) ? (e.longitude = o, e.latitude = s, e.height = a, e) : new rt(o, s, a);
	}
	cartesianArrayToCartographicArray(t, e) {
		M.defined("cartesians", t);
		const n = t.length;
		N(e) ? e.length = n : e = new Array(n);
		for (let r = 0; r < n; ++r) e[r] = this.cartesianToCartographic(t[r], e[r]);
		return e;
	}
	scaleToGeodeticSurface(t, e) {
		return nt(t, this._oneOverRadii, this._oneOverRadiiSquared, this._centerToleranceSquared, e);
	}
	scaleToGeocentricSurface(t, e) {
		M.typeOf.object("cartesian", t), N(e) || (e = new H());
		const n = t.x, r = t.y, i = t.z, o = this._oneOverRadiiSquared, s = 1 / Math.sqrt(n * n * o.x + r * r * o.y + i * i * o.z);
		return H.multiplyByScalar(t, s, e);
	}
	transformPositionToScaledSpace(t, e) {
		return N(e) || (e = new H()), H.multiplyComponents(t, this._oneOverRadii, e);
	}
	transformPositionFromScaledSpace(t, e) {
		return N(e) || (e = new H()), H.multiplyComponents(t, this._radii, e);
	}
	equals(t) {
		return this === t || N(t) && H.equals(this._radii, t._radii);
	}
	toString() {
		return this._radii.toString();
	}
	getSurfaceNormalIntersectionWithZAxis(t, e, n) {
		if (M.typeOf.object("position", t), !D.equalsEpsilon(this._radii.x, this._radii.y, D.EPSILON15)) throw new v("Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)");
		M.typeOf.number.greaterThan("Ellipsoid.radii.z", this._radii.z, 0), e = e ?? 0;
		const r = this._squaredXOverSquaredZ;
		if (N(n) || (n = new H()), n.x = 0, n.y = 0, n.z = t.z * (1 - r), !(Math.abs(n.z) >= this._radii.z - e)) return n;
	}
	getLocalCurvature(t, e) {
		M.typeOf.object("surfacePosition", t), N(e) || (e = new F());
		const n = this.getSurfaceNormalIntersectionWithZAxis(t, 0, dt), r = H.distance(t, n), i = r * (this.minimumRadius * r / this.maximumRadius ** 2) ** 2;
		return F.fromElements(1 / r, 1 / i, e);
	}
	surfaceArea(t) {
		M.typeOf.object("rectangle", t);
		const e = t.west;
		let n = t.east;
		const r = t.south, i = t.north;
		for (; n < e;) n += D.TWO_PI;
		const o = this._radiiSquared, s = o.x, a = o.y, u = o.z, c = s * a;
		return gt(r, i, function(t) {
			const r = Math.cos(t), i = Math.sin(t);
			return Math.cos(t) * gt(e, n, function(t) {
				const e = Math.cos(t), n = Math.sin(t);
				return Math.sqrt(c * i * i + u * (a * e * e + s * n * n) * r * r);
			});
		});
	}
};
ut.WGS84 = Object.freeze(new ut(6378137, 6378137, 6356752.314245179)), ut.UNIT_SPHERE = Object.freeze(new ut(1, 1, 1)), ut.MOON = Object.freeze(new ut(D.LUNAR_RADIUS, D.LUNAR_RADIUS, D.LUNAR_RADIUS)), ut.MARS = Object.freeze(new ut(3396190, 3396190, 3376200)), ut._default = ut.WGS84, ut.packedLength = H.packedLength, ut.prototype.geocentricSurfaceNormal = H.normalize;
const ct = new H(), lt = new H(), ht = new H(), ft = new H(), pt = new H(), dt = new H(), mt = [
	.14887433898163,
	.43339539412925,
	.67940956829902,
	.86506336668898,
	.97390652851717,
	0
], yt = [
	.29552422471475,
	.26926671930999,
	.21908636251598,
	.14945134915058,
	.066671344308684,
	0
];
function gt(t, e, n) {
	M.typeOf.number("a", t), M.typeOf.number("b", e), M.typeOf.func("func", n);
	const r = .5 * (e + t), i = .5 * (e - t);
	let o = 0;
	for (let s = 0; s < 5; s++) {
		const t = i * mt[s];
		o += yt[s] * (n(r + t) + n(r - t));
	}
	return o *= i, o;
}
var wt = class {
	constructor(t) {
		this._ellipsoid = t ?? ut.default, this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
	}
	get ellipsoid() {
		return this._ellipsoid;
	}
	project(t, e) {
		const n = this._semimajorAxis, r = t.longitude * n, i = t.latitude * n, o = t.height;
		return N(e) ? (e.x = r, e.y = i, e.z = o, e) : new H(r, i, o);
	}
	unproject(t, e) {
		if (!N(t)) throw new v("cartesian is required");
		const n = this._oneOverSemimajorAxis, r = t.x * n, i = t.y * n, o = t.z;
		return N(e) ? (e.longitude = r, e.latitude = i, e.height = o, e) : new rt(r, i, o);
	}
};
const Et = {
	OUTSIDE: -1,
	INTERSECTING: 0,
	INSIDE: 1
};
Object.freeze(Et);
var _t = class t {
	constructor(t, e, n, r) {
		this.x = t ?? 0, this.y = e ?? 0, this.z = n ?? 0, this.w = r ?? 0;
	}
	static fromElements(e, n, r, i, o) {
		return N(o) ? (o.x = e, o.y = n, o.z = r, o.w = i, o) : new t(e, n, r, i);
	}
	static fromColor(e, n) {
		return M.typeOf.object("color", e), N(n) ? (n.x = e.red, n.y = e.green, n.z = e.blue, n.w = e.alpha, n) : new t(e.red, e.green, e.blue, e.alpha);
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n.x = e.x, n.y = e.y, n.z = e.z, n.w = e.w, n) : new t(e.x, e.y, e.z, e.w);
	}
	static pack(t, e, n) {
		return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, e[n++] = t.x, e[n++] = t.y, e[n++] = t.z, e[n] = t.w, e;
	}
	static unpack(e, n, r) {
		return M.defined("array", e), n = n ?? 0, N(r) || (r = new t()), r.x = e[n++], r.y = e[n++], r.z = e[n++], r.w = e[n], r;
	}
	static packArray(e, n) {
		M.defined("array", e);
		const r = e.length, i = 4 * r;
		if (N(n)) {
			if (!Array.isArray(n) && n.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 4 elements");
			n.length !== i && (n.length = i);
		} else n = new Array(i);
		for (let o = 0; o < r; ++o) t.pack(e[o], n, 4 * o);
		return n;
	}
	static unpackArray(e, n) {
		if (M.defined("array", e), M.typeOf.number.greaterThanOrEquals("array.length", e.length, 4), e.length % 4 != 0) throw new v("array length must be a multiple of 4.");
		const r = e.length;
		N(n) ? n.length = r / 4 : n = new Array(r / 4);
		for (let i = 0; i < r; i += 4) {
			const r = i / 4;
			n[r] = t.unpack(e, i, n[r]);
		}
		return n;
	}
	static maximumComponent(t) {
		return M.typeOf.object("cartesian", t), Math.max(t.x, t.y, t.z, t.w);
	}
	static minimumComponent(t) {
		return M.typeOf.object("cartesian", t), Math.min(t.x, t.y, t.z, t.w);
	}
	static minimumByComponent(t, e, n) {
		return M.typeOf.object("first", t), M.typeOf.object("second", e), M.typeOf.object("result", n), n.x = Math.min(t.x, e.x), n.y = Math.min(t.y, e.y), n.z = Math.min(t.z, e.z), n.w = Math.min(t.w, e.w), n;
	}
	static maximumByComponent(t, e, n) {
		return M.typeOf.object("first", t), M.typeOf.object("second", e), M.typeOf.object("result", n), n.x = Math.max(t.x, e.x), n.y = Math.max(t.y, e.y), n.z = Math.max(t.z, e.z), n.w = Math.max(t.w, e.w), n;
	}
	static clamp(t, e, n, r) {
		M.typeOf.object("value", t), M.typeOf.object("min", e), M.typeOf.object("max", n), M.typeOf.object("result", r);
		const i = D.clamp(t.x, e.x, n.x), o = D.clamp(t.y, e.y, n.y), s = D.clamp(t.z, e.z, n.z), a = D.clamp(t.w, e.w, n.w);
		return r.x = i, r.y = o, r.z = s, r.w = a, r;
	}
	static magnitudeSquared(t) {
		return M.typeOf.object("cartesian", t), t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
	}
	static magnitude(e) {
		return Math.sqrt(t.magnitudeSquared(e));
	}
	static distance(e, n) {
		return M.typeOf.object("left", e), M.typeOf.object("right", n), t.subtract(e, n, Ot), t.magnitude(Ot);
	}
	static distanceSquared(e, n) {
		return M.typeOf.object("left", e), M.typeOf.object("right", n), t.subtract(e, n, Ot), t.magnitudeSquared(Ot);
	}
	static normalize(e, n) {
		M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = t.magnitude(e);
		if (n.x = e.x / r, n.y = e.y / r, n.z = e.z / r, n.w = e.w / r, isNaN(n.x) || isNaN(n.y) || isNaN(n.z) || isNaN(n.w)) throw new v("normalized result is not a number");
		return n;
	}
	static dot(t, e) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
	}
	static multiplyComponents(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x * e.x, n.y = t.y * e.y, n.z = t.z * e.z, n.w = t.w * e.w, n;
	}
	static divideComponents(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x / e.x, n.y = t.y / e.y, n.z = t.z / e.z, n.w = t.w / e.w, n;
	}
	static add(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x + e.x, n.y = t.y + e.y, n.z = t.z + e.z, n.w = t.w + e.w, n;
	}
	static subtract(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x - e.x, n.y = t.y - e.y, n.z = t.z - e.z, n.w = t.w - e.w, n;
	}
	static multiplyByScalar(t, e, n) {
		return M.typeOf.object("cartesian", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n.x = t.x * e, n.y = t.y * e, n.z = t.z * e, n.w = t.w * e, n;
	}
	static divideByScalar(t, e, n) {
		return M.typeOf.object("cartesian", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n.x = t.x / e, n.y = t.y / e, n.z = t.z / e, n.w = t.w / e, n;
	}
	static negate(t, e) {
		return M.typeOf.object("cartesian", t), M.typeOf.object("result", e), e.x = -t.x, e.y = -t.y, e.z = -t.z, e.w = -t.w, e;
	}
	static abs(t, e) {
		return M.typeOf.object("cartesian", t), M.typeOf.object("result", e), e.x = Math.abs(t.x), e.y = Math.abs(t.y), e.z = Math.abs(t.z), e.w = Math.abs(t.w), e;
	}
	static lerp(e, n, r, i) {
		return M.typeOf.object("start", e), M.typeOf.object("end", n), M.typeOf.number("t", r), M.typeOf.object("result", i), t.multiplyByScalar(n, r, bt), i = t.multiplyByScalar(e, 1 - r, i), t.add(bt, i, i);
	}
	static mostOrthogonalAxis(e, n) {
		M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = t.normalize(e, Tt);
		return t.abs(r, r), r.x <= r.y ? r.x <= r.z ? r.x <= r.w ? t.clone(t.UNIT_X, n) : t.clone(t.UNIT_W, n) : r.z <= r.w ? t.clone(t.UNIT_Z, n) : t.clone(t.UNIT_W, n) : r.y <= r.z ? r.y <= r.w ? t.clone(t.UNIT_Y, n) : t.clone(t.UNIT_W, n) : r.z <= r.w ? t.clone(t.UNIT_Z, n) : t.clone(t.UNIT_W, n);
	}
	static equals(t, e) {
		return t === e || N(t) && N(e) && t.x === e.x && t.y === e.y && t.z === e.z && t.w === e.w;
	}
	static equalsArray(t, e, n) {
		return t.x === e[n] && t.y === e[n + 1] && t.z === e[n + 2] && t.w === e[n + 3];
	}
	static equalsEpsilon(t, e, n, r) {
		return t === e || N(t) && N(e) && D.equalsEpsilon(t.x, e.x, n, r) && D.equalsEpsilon(t.y, e.y, n, r) && D.equalsEpsilon(t.z, e.z, n, r) && D.equalsEpsilon(t.w, e.w, n, r);
	}
	clone(e) {
		return t.clone(this, e);
	}
	equals(e) {
		return t.equals(this, e);
	}
	equalsEpsilon(e, n, r) {
		return t.equalsEpsilon(this, e, n, r);
	}
	toString() {
		return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
	}
	static packFloat(e, n) {
		return M.typeOf.number("value", e), N(n) || (n = new t()), At[0] = e, St ? (n.x = xt[0], n.y = xt[1], n.z = xt[2], n.w = xt[3]) : (n.x = xt[3], n.y = xt[2], n.z = xt[1], n.w = xt[0]), n;
	}
	static unpackFloat(t) {
		return M.typeOf.object("packedFloat", t), St ? (xt[0] = t.x, xt[1] = t.y, xt[2] = t.z, xt[3] = t.w) : (xt[0] = t.w, xt[1] = t.z, xt[2] = t.y, xt[3] = t.x), At[0];
	}
};
_t.packedLength = 4, _t.fromArray = _t.unpack;
const Ot = new _t(), bt = new _t(), Tt = new _t();
_t.ZERO = Object.freeze(new _t(0, 0, 0, 0)), _t.ONE = Object.freeze(new _t(1, 1, 1, 1)), _t.UNIT_X = Object.freeze(new _t(1, 0, 0, 0)), _t.UNIT_Y = Object.freeze(new _t(0, 1, 0, 0)), _t.UNIT_Z = Object.freeze(new _t(0, 0, 1, 0)), _t.UNIT_W = Object.freeze(new _t(0, 0, 0, 1));
const At = /* @__PURE__ */ new Float32Array(1), xt = new Uint8Array(At.buffer), Rt = new Uint32Array([287454020]), St = 68 === new Uint8Array(Rt.buffer)[0];
function It(t, e, n) {
	M.defined("array", t), M.defined("itemToFind", e), M.defined("comparator", n);
	let r, i, o = 0, s = t.length - 1;
	for (; o <= s;) if (r = ~~((o + s) / 2), i = n(t[r], e), i < 0) o = r + 1;
	else {
		if (!(i > 0)) return r;
		s = r - 1;
	}
	return ~(s + 1);
}
function Nt(t, e, n, r, i) {
	this.xPoleWander = t, this.yPoleWander = e, this.xPoleOffset = n, this.yPoleOffset = r, this.ut1MinusUtc = i;
}
function vt(t) {
	if (null === t || isNaN(t)) throw new v("year is required and must be a number.");
	return t % 4 == 0 && t % 100 != 0 || t % 400 == 0;
}
const Mt = [
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
function Pt(t, e, n, r, i, o, s, a) {
	t = t ?? 1, e = e ?? 1, n = n ?? 1, r = r ?? 0, i = i ?? 0, o = o ?? 0, s = s ?? 0, a = a ?? !1, M.typeOf.number.greaterThanOrEquals("Year", t, 1), M.typeOf.number.lessThanOrEquals("Year", t, 9999), M.typeOf.number.greaterThanOrEquals("Month", e, 1), M.typeOf.number.lessThanOrEquals("Month", e, 12), M.typeOf.number.greaterThanOrEquals("Day", n, 1), M.typeOf.number.lessThanOrEquals("Day", n, 31), M.typeOf.number.greaterThanOrEquals("Hour", r, 0), M.typeOf.number.lessThanOrEquals("Hour", r, 23), M.typeOf.number.greaterThanOrEquals("Minute", i, 0), M.typeOf.number.lessThanOrEquals("Minute", i, 59), M.typeOf.bool("IsLeapSecond", a), M.typeOf.number.greaterThanOrEquals("Second", o, 0), M.typeOf.number.lessThanOrEquals("Second", o, a ? 60 : 59), M.typeOf.number.greaterThanOrEquals("Millisecond", s, 0), M.typeOf.number.lessThan("Millisecond", s, 1e3), function() {
		const r = 2 === e && vt(t) ? Mt[e - 1] + 1 : Mt[e - 1];
		if (n > r) throw new v("Month and Day represents invalid date");
	}(), this.year = t, this.month = e, this.day = n, this.hour = r, this.minute = i, this.second = o, this.millisecond = s, this.isLeapSecond = a;
}
function Ct(t, e) {
	this.julianDate = t, this.offset = e;
}
const qt = {
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
Object.freeze(qt);
const Ut = {
	UTC: 0,
	TAI: 1
};
Object.freeze(Ut);
const Lt = new Pt(), Dt = [
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
function zt(t, e) {
	return te.compare(t.julianDate, e.julianDate);
}
const jt = new Ct();
function Ft(t) {
	jt.julianDate = t;
	const e = te.leapSeconds;
	let n = It(e, jt, zt);
	n < 0 && (n = ~n), n >= e.length && (n = e.length - 1);
	let r = e[n].offset;
	n > 0 && te.secondsDifference(e[n].julianDate, t) > r && (n--, r = e[n].offset), te.addSeconds(t, r, t);
}
function Bt(t, e) {
	jt.julianDate = t;
	const n = te.leapSeconds;
	let r = It(n, jt, zt);
	if (r < 0 && (r = ~r), 0 === r) return te.addSeconds(t, -n[0].offset, e);
	if (r >= n.length) return te.addSeconds(t, -n[r - 1].offset, e);
	const i = te.secondsDifference(n[r].julianDate, t);
	return 0 === i ? te.addSeconds(t, -n[r].offset, e) : i <= 1 ? void 0 : te.addSeconds(t, -n[--r].offset, e);
}
function Gt(t, e, n) {
	const r = e / qt.SECONDS_PER_DAY | 0;
	return t += r, (e -= qt.SECONDS_PER_DAY * r) < 0 && (t--, e += qt.SECONDS_PER_DAY), n.dayNumber = t, n.secondsOfDay = e, n;
}
function kt(t, e, n, r, i, o, s) {
	const a = (e - 14) / 12 | 0, u = t + 4800 + a;
	let c = (1461 * u / 4 | 0) + (367 * (e - 2 - 12 * a) / 12 | 0) - (3 * ((u + 100) / 100 | 0) / 4 | 0) + n - 32075;
	(r -= 12) < 0 && (r += 24);
	const l = o + (r * qt.SECONDS_PER_HOUR + i * qt.SECONDS_PER_MINUTE + s * qt.SECONDS_PER_MILLISECOND);
	return l >= 43200 && (c -= 1), [c, l];
}
const Wt = /^(\d{4})$/, Vt = /^(\d{4})-(\d{2})$/, Ht = /^(\d{4})-?(\d{3})$/, Xt = /^(\d{4})-?W(\d{2})-?(\d{1})?$/, Yt = /^(\d{4})-?(\d{2})-?(\d{2})$/, $t = /([Z+\-])?(\d{2})?:?(\d{2})?$/, Zt = /^(\d{2})(\.\d+)?/.source + $t.source, Qt = /^(\d{2}):?(\d{2})(\.\d+)?/.source + $t.source, Kt = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + $t.source, Jt = "Invalid ISO 8601 date.";
var te = class t {
	constructor(t, e, n) {
		this.dayNumber = void 0, this.secondsOfDay = void 0, e = e ?? 0, n = n ?? Ut.UTC;
		const r = 0 | (t = t ?? 0);
		Gt(r, e += (t - r) * qt.SECONDS_PER_DAY, this), n === Ut.UTC && Ft(this);
	}
	static fromGregorianDate(e, n) {
		if (!(e instanceof Pt)) throw new v("date must be a valid GregorianDate.");
		const r = kt(e.year, e.month, e.day, e.hour, e.minute, e.second, e.millisecond);
		return N(n) ? (Gt(r[0], r[1], n), Ft(n), n) : new t(r[0], r[1], Ut.UTC);
	}
	static fromDate(e, n) {
		if (!(e instanceof Date) || isNaN(e.getTime())) throw new v("date must be a valid JavaScript Date.");
		const r = kt(e.getUTCFullYear(), e.getUTCMonth() + 1, e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes(), e.getUTCSeconds(), e.getUTCMilliseconds());
		return N(n) ? (Gt(r[0], r[1], n), Ft(n), n) : new t(r[0], r[1], Ut.UTC);
	}
	static fromIso8601(e, n) {
		if ("string" != typeof e) throw new v(Jt);
		let r, i = (e = e.replace(",", ".")).split("T"), o = 1, s = 1, a = 0, u = 0, c = 0, l = 0;
		const h = i[0], f = i[1];
		let p, d, m, y;
		if (!N(h)) throw new v(Jt);
		if (i = h.match(Yt), null !== i) {
			if (m = h.split("-").length - 1, m > 0 && 2 !== m) throw new v(Jt);
			r = +i[1], o = +i[2], s = +i[3];
		} else if (i = h.match(Vt), null !== i) r = +i[1], o = +i[2];
		else if (i = h.match(Wt), null !== i) r = +i[1];
		else {
			let t;
			if (i = h.match(Ht), null !== i) {
				if (r = +i[1], t = +i[2], d = vt(r), t < 1 || d && t > 366 || !d && t > 365) throw new v(Jt);
			} else {
				if (i = h.match(Xt), null === i) throw new v(Jt);
				{
					r = +i[1];
					const e = +i[2], n = +i[3] || 0;
					if (m = h.split("-").length - 1, m > 0 && (!N(i[3]) && 1 !== m || N(i[3]) && 2 !== m)) throw new v(Jt);
					t = 7 * e + n - new Date(Date.UTC(r, 0, 4)).getUTCDay() - 3;
				}
			}
			p = new Date(Date.UTC(r, 0, 1)), p.setUTCDate(t), o = p.getUTCMonth() + 1, s = p.getUTCDate();
		}
		if (d = vt(r), o < 1 || o > 12 || s < 1 || (2 !== o || !d) && s > Dt[o - 1] || d && 2 === o && s > 29) throw new v(Jt);
		if (N(f)) {
			if (i = f.match(Kt), null !== i) {
				if (m = f.split(":").length - 1, m > 0 && 2 !== m && 3 !== m) throw new v(Jt);
				a = +i[1], u = +i[2], c = +i[3], l = 1e3 * +(i[4] || 0), y = 5;
			} else if (i = f.match(Qt), null !== i) {
				if (m = f.split(":").length - 1, m > 2) throw new v(Jt);
				a = +i[1], u = +i[2], c = 60 * +(i[3] || 0), y = 4;
			} else {
				if (i = f.match(Zt), null === i) throw new v(Jt);
				a = +i[1], u = 60 * +(i[2] || 0), y = 3;
			}
			if (u >= 60 || c >= 61 || a > 24 || 24 === a && (u > 0 || c > 0 || l > 0)) throw new v(Jt);
			const t = i[y], e = +i[y + 1], n = +(i[y + 2] || 0);
			switch (t) {
				case "+":
					a -= e, u -= n;
					break;
				case "-":
					a += e, u += n;
					break;
				case "Z": break;
				default: u += new Date(Date.UTC(r, o - 1, s, a, u)).getTimezoneOffset();
			}
		}
		const g = 60 === c;
		for (g && c--; u >= 60;) u -= 60, a++;
		for (; a >= 24;) a -= 24, s++;
		for (p = d && 2 === o ? 29 : Dt[o - 1]; s > p;) s -= p, o++, o > 12 && (o -= 12, r++), p = d && 2 === o ? 29 : Dt[o - 1];
		for (; u < 0;) u += 60, a--;
		for (; a < 0;) a += 24, s--;
		for (; s < 1;) o--, o < 1 && (o += 12, r--), p = d && 2 === o ? 29 : Dt[o - 1], s += p;
		const w = kt(r, o, s, a, u, c, l);
		return N(n) ? (Gt(w[0], w[1], n), Ft(n)) : n = new t(w[0], w[1], Ut.UTC), g && t.addSeconds(n, 1, n), n;
	}
	static now(e) {
		return t.fromDate(/* @__PURE__ */ new Date(), e);
	}
	static toGregorianDate(e, n) {
		if (!N(e)) throw new v("julianDate is required.");
		let r = !1, i = Bt(e, ee);
		N(i) || (t.addSeconds(e, -1, ee), i = Bt(ee, ee), r = !0);
		let o = i.dayNumber;
		const s = i.secondsOfDay;
		s >= 43200 && (o += 1);
		let a = o + 68569 | 0;
		const u = 4 * a / 146097 | 0;
		a = a - ((146097 * u + 3) / 4 | 0) | 0;
		const c = 4e3 * (a + 1) / 1461001 | 0;
		a = a - (1461 * c / 4 | 0) + 31 | 0;
		const l = 80 * a / 2447 | 0, h = a - (2447 * l / 80 | 0) | 0;
		a = l / 11 | 0;
		const f = l + 2 - 12 * a | 0, p = 100 * (u - 49) + c + a | 0;
		let d = s / qt.SECONDS_PER_HOUR | 0, m = s - d * qt.SECONDS_PER_HOUR;
		const y = m / qt.SECONDS_PER_MINUTE | 0;
		m -= y * qt.SECONDS_PER_MINUTE;
		let g = 0 | m;
		const w = (m - g) / qt.SECONDS_PER_MILLISECOND;
		return d += 12, d > 23 && (d -= 24), r && (g += 1), N(n) ? (n.year = p, n.month = f, n.day = h, n.hour = d, n.minute = y, n.second = g, n.millisecond = w, n.isLeapSecond = r, n) : new Pt(p, f, h, d, y, g, w, r);
	}
	static toDate(e) {
		if (!N(e)) throw new v("julianDate is required.");
		const n = t.toGregorianDate(e, Lt);
		let r = n.second;
		return n.isLeapSecond && (r -= 1), new Date(Date.UTC(n.year, n.month - 1, n.day, n.hour, n.minute, r, n.millisecond));
	}
	static toIso8601(e, n) {
		if (!N(e)) throw new v("julianDate is required.");
		const r = t.toGregorianDate(e, Lt);
		let i = r.year, o = r.month, s = r.day, a = r.hour;
		const u = r.minute, c = r.second, l = r.millisecond;
		let h;
		if (1e4 === i && 1 === o && 1 === s && 0 === a && 0 === u && 0 === c && 0 === l && (i = 9999, o = 12, s = 31, a = 24), !N(n) && 0 !== l) {
			const t = .01 * l;
			return h = t < 1e-6 ? t.toFixed(20).replace(".", "").replace(/0+$/, "") : t.toString().replace(".", ""), `${i.toString().padStart(4, "0")}-${o.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${h}Z`;
		}
		return N(n) && 0 !== n ? (h = (.01 * l).toFixed(n).replace(".", "").slice(0, n), `${i.toString().padStart(4, "0")}-${o.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${h}Z`) : `${i.toString().padStart(4, "0")}-${o.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}Z`;
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n.dayNumber = e.dayNumber, n.secondsOfDay = e.secondsOfDay, n) : new t(e.dayNumber, e.secondsOfDay, Ut.TAI);
	}
	static compare(t, e) {
		if (!N(t)) throw new v("left is required.");
		if (!N(e)) throw new v("right is required.");
		const n = t.dayNumber - e.dayNumber;
		return 0 !== n ? n : t.secondsOfDay - e.secondsOfDay;
	}
	static equals(t, e) {
		return t === e || N(t) && N(e) && t.dayNumber === e.dayNumber && t.secondsOfDay === e.secondsOfDay;
	}
	static equalsEpsilon(e, n, r) {
		return r = r ?? 0, e === n || N(e) && N(n) && Math.abs(t.secondsDifference(e, n)) <= r;
	}
	static totalDays(t) {
		if (!N(t)) throw new v("julianDate is required.");
		return t.dayNumber + t.secondsOfDay / qt.SECONDS_PER_DAY;
	}
	static secondsDifference(t, e) {
		if (!N(t)) throw new v("left is required.");
		if (!N(e)) throw new v("right is required.");
		return (t.dayNumber - e.dayNumber) * qt.SECONDS_PER_DAY + (t.secondsOfDay - e.secondsOfDay);
	}
	static daysDifference(t, e) {
		if (!N(t)) throw new v("left is required.");
		if (!N(e)) throw new v("right is required.");
		return t.dayNumber - e.dayNumber + (t.secondsOfDay - e.secondsOfDay) / qt.SECONDS_PER_DAY;
	}
	static computeTaiMinusUtc(e) {
		jt.julianDate = e;
		const n = t.leapSeconds;
		let r = It(n, jt, zt);
		return r < 0 && (r = ~r, --r, r < 0 && (r = 0)), n[r].offset;
	}
	static addSeconds(t, e, n) {
		if (!N(t)) throw new v("julianDate is required.");
		if (!N(e)) throw new v("seconds is required.");
		if (!N(n)) throw new v("result is required.");
		return Gt(t.dayNumber, t.secondsOfDay + e, n);
	}
	static addMinutes(t, e, n) {
		if (!N(t)) throw new v("julianDate is required.");
		if (!N(e)) throw new v("minutes is required.");
		if (!N(n)) throw new v("result is required.");
		const r = t.secondsOfDay + e * qt.SECONDS_PER_MINUTE;
		return Gt(t.dayNumber, r, n);
	}
	static addHours(t, e, n) {
		if (!N(t)) throw new v("julianDate is required.");
		if (!N(e)) throw new v("hours is required.");
		if (!N(n)) throw new v("result is required.");
		const r = t.secondsOfDay + e * qt.SECONDS_PER_HOUR;
		return Gt(t.dayNumber, r, n);
	}
	static addDays(t, e, n) {
		if (!N(t)) throw new v("julianDate is required.");
		if (!N(e)) throw new v("days is required.");
		if (!N(n)) throw new v("result is required.");
		return Gt(t.dayNumber + e, t.secondsOfDay, n);
	}
	static lessThan(e, n) {
		return t.compare(e, n) < 0;
	}
	static lessThanOrEquals(e, n) {
		return t.compare(e, n) <= 0;
	}
	static greaterThan(e, n) {
		return t.compare(e, n) > 0;
	}
	static greaterThanOrEquals(e, n) {
		return t.compare(e, n) >= 0;
	}
	clone(e) {
		return t.clone(this, e);
	}
	equals(e) {
		return t.equals(this, e);
	}
	equalsEpsilon(e, n) {
		return t.equalsEpsilon(this, e, n);
	}
	toString() {
		return t.toIso8601(this);
	}
};
const ee = new te(0, 0, Ut.TAI);
te.leapSeconds = [
	new Ct(new te(2441317, 43210, Ut.TAI), 10),
	new Ct(new te(2441499, 43211, Ut.TAI), 11),
	new Ct(new te(2441683, 43212, Ut.TAI), 12),
	new Ct(new te(2442048, 43213, Ut.TAI), 13),
	new Ct(new te(2442413, 43214, Ut.TAI), 14),
	new Ct(new te(2442778, 43215, Ut.TAI), 15),
	new Ct(new te(2443144, 43216, Ut.TAI), 16),
	new Ct(new te(2443509, 43217, Ut.TAI), 17),
	new Ct(new te(2443874, 43218, Ut.TAI), 18),
	new Ct(new te(2444239, 43219, Ut.TAI), 19),
	new Ct(new te(2444786, 43220, Ut.TAI), 20),
	new Ct(new te(2445151, 43221, Ut.TAI), 21),
	new Ct(new te(2445516, 43222, Ut.TAI), 22),
	new Ct(new te(2446247, 43223, Ut.TAI), 23),
	new Ct(new te(2447161, 43224, Ut.TAI), 24),
	new Ct(new te(2447892, 43225, Ut.TAI), 25),
	new Ct(new te(2448257, 43226, Ut.TAI), 26),
	new Ct(new te(2448804, 43227, Ut.TAI), 27),
	new Ct(new te(2449169, 43228, Ut.TAI), 28),
	new Ct(new te(2449534, 43229, Ut.TAI), 29),
	new Ct(new te(2450083, 43230, Ut.TAI), 30),
	new Ct(new te(2450630, 43231, Ut.TAI), 31),
	new Ct(new te(2451179, 43232, Ut.TAI), 32),
	new Ct(new te(2453736, 43233, Ut.TAI), 33),
	new Ct(new te(2454832, 43234, Ut.TAI), 34),
	new Ct(new te(2456109, 43235, Ut.TAI), 35),
	new Ct(new te(2457204, 43236, Ut.TAI), 36),
	new Ct(new te(2457754, 43237, Ut.TAI), 37)
];
var ne = s((t, e) => {
	/*! https://mths.be/punycode v1.4.0 by @mathias */
	(function(n) {
		var r = "object" == typeof t && t && !t.nodeType && t, i = "object" == typeof e && e && !e.nodeType && e, o = "object" == typeof global && global;
		o.global !== o && o.window !== o && o.self !== o || (n = o);
		var s, a, u = 2147483647, c = 36, l = /^xn--/, h = /[^\x20-\x7E]/, f = /[\x2E\u3002\uFF0E\uFF61]/g, p = {
			overflow: "Overflow: input needs wider integers to process",
			"not-basic": "Illegal input >= 0x80 (not a basic code point)",
			"invalid-input": "Invalid input"
		}, d = Math.floor, m = String.fromCharCode;
		function y(t) {
			throw new RangeError(p[t]);
		}
		function g(t, e) {
			for (var n = t.length, r = []; n--;) r[n] = e(t[n]);
			return r;
		}
		function w(t, e) {
			var n = t.split("@"), r = "";
			return n.length > 1 && (r = n[0] + "@", t = n[1]), r + g((t = t.replace(f, ".")).split("."), e).join(".");
		}
		function E(t) {
			for (var e, n, r = [], i = 0, o = t.length; i < o;) (e = t.charCodeAt(i++)) >= 55296 && e <= 56319 && i < o ? 56320 == (64512 & (n = t.charCodeAt(i++))) ? r.push(((1023 & e) << 10) + (1023 & n) + 65536) : (r.push(e), i--) : r.push(e);
			return r;
		}
		function _(t) {
			return g(t, function(t) {
				var e = "";
				return t > 65535 && (e += m((t -= 65536) >>> 10 & 1023 | 55296), t = 56320 | 1023 & t), e + m(t);
			}).join("");
		}
		function O(t) {
			return t - 48 < 10 ? t - 22 : t - 65 < 26 ? t - 65 : t - 97 < 26 ? t - 97 : c;
		}
		function b(t, e) {
			return t + 22 + 75 * (t < 26) - ((0 != e) << 5);
		}
		function T(t, e, n) {
			var r = 0;
			for (t = n ? d(t / 700) : t >> 1, t += d(t / e); t > 455; r += c) t = d(t / 35);
			return d(r + 36 * t / (t + 38));
		}
		function A(t) {
			var e, n, r, i, o, s, a, l, h, f = [], p = t.length, m = 0, g = 128, w = 72, E = t.lastIndexOf("-");
			for (E < 0 && (E = 0), n = 0; n < E; ++n) t.charCodeAt(n) >= 128 && y("not-basic"), f.push(t.charCodeAt(n));
			for (r = E > 0 ? E + 1 : 0; r < p;) {
				for (i = m, o = 1, s = c; r >= p && y("invalid-input"), ((a = O(t.charCodeAt(r++))) >= c || a > d((u - m) / o)) && y("overflow"), m += a * o, !(a < (l = s <= w ? 1 : s >= w + 26 ? 26 : s - w)); s += c) o > d(u / (h = c - l)) && y("overflow"), o *= h;
				w = T(m - i, e = f.length + 1, 0 == i), d(m / e) > u - g && y("overflow"), g += d(m / e), m %= e, f.splice(m++, 0, g);
			}
			return _(f);
		}
		function x(t) {
			var e, n, r, i, o, s, a, l, h, f, p, g, w, _, O, A = [];
			for (g = (t = E(t)).length, e = 128, n = 0, o = 72, s = 0; s < g; ++s) (p = t[s]) < 128 && A.push(m(p));
			for (r = i = A.length, i && A.push("-"); r < g;) {
				for (a = u, s = 0; s < g; ++s) (p = t[s]) >= e && p < a && (a = p);
				for (a - e > d((u - n) / (w = r + 1)) && y("overflow"), n += (a - e) * w, e = a, s = 0; s < g; ++s) if ((p = t[s]) < e && ++n > u && y("overflow"), p == e) {
					for (l = n, h = c; !(l < (f = h <= o ? 1 : h >= o + 26 ? 26 : h - o)); h += c) O = l - f, _ = c - f, A.push(m(b(f + O % _, 0))), l = d(O / _);
					A.push(m(b(l, 0))), o = T(n, w, r == i), n = 0, ++r;
				}
				++n, ++e;
			}
			return A.join("");
		}
		if (s = {
			version: "1.3.2",
			ucs2: {
				decode: E,
				encode: _
			},
			decode: A,
			encode: x,
			toASCII: function(t) {
				return w(t, function(t) {
					return h.test(t) ? "xn--" + x(t) : t;
				});
			},
			toUnicode: function(t) {
				return w(t, function(t) {
					return l.test(t) ? A(t.slice(4).toLowerCase()) : t;
				});
			}
		}, "function" == typeof define && "object" == typeof define.amd && define.amd) define("punycode", function() {
			return s;
		});
		else if (r && i) if (e.exports == r) i.exports = s;
		else for (a in s) s.hasOwnProperty(a) && (r[a] = s[a]);
		else n.punycode = s;
	})(t);
}), re = s((t, e) => {
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
	var n = t, r = function(t) {
		var e = t && t.IPv6;
		return {
			best: function(t) {
				var e, n, r = t.toLowerCase().split(":"), i = r.length, o = 8;
				for ("" === r[0] && "" === r[1] && "" === r[2] ? (r.shift(), r.shift()) : "" === r[0] && "" === r[1] ? r.shift() : "" === r[i - 1] && "" === r[i - 2] && r.pop(), -1 !== r[(i = r.length) - 1].indexOf(".") && (o = 7), e = 0; e < i && "" !== r[e]; e++);
				if (e < o) for (r.splice(e, 1, "0000"); r.length < o;) r.splice(e, 0, "0000");
				for (var s = 0; s < o; s++) {
					n = r[s].split("");
					for (var a = 0; a < 3 && "0" === n[0] && n.length > 1; a++) n.splice(0, 1);
					r[s] = n.join("");
				}
				var u = -1, c = 0, l = 0, h = -1, f = !1;
				for (s = 0; s < o; s++) f ? "0" === r[s] ? l += 1 : (f = !1, l > c && (u = h, c = l)) : "0" === r[s] && (f = !0, h = s, l = 1);
				l > c && (u = h, c = l), c > 1 && r.splice(u, c, ""), i = r.length;
				var p = "";
				for ("" === r[0] && (p = ":"), s = 0; s < i && (p += r[s], s !== i - 1); s++) p += ":";
				return "" === r[i - 1] && (p += ":"), p;
			},
			noConflict: function() {
				return t.IPv6 === this && (t.IPv6 = e), this;
			}
		};
	};
	"object" == typeof e && e.exports ? e.exports = r() : "function" == typeof define && define.amd ? define(r) : n.IPv6 = r(n);
}), ie = s((t, e) => {
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
	var n = t, r = function(t) {
		var e = t && t.SecondLevelDomains, n = {
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
			has: function(t) {
				var e = t.lastIndexOf(".");
				if (e <= 0 || e >= t.length - 1) return !1;
				var r = t.lastIndexOf(".", e - 1);
				if (r <= 0 || r >= e - 1) return !1;
				var i = n.list[t.slice(e + 1)];
				return !!i && i.indexOf(" " + t.slice(r + 1, e) + " ") >= 0;
			},
			is: function(t) {
				var e = t.lastIndexOf(".");
				if (e <= 0 || e >= t.length - 1) return !1;
				if (t.lastIndexOf(".", e - 1) >= 0) return !1;
				var r = n.list[t.slice(e + 1)];
				return !!r && r.indexOf(" " + t.slice(0, e) + " ") >= 0;
			},
			get: function(t) {
				var e = t.lastIndexOf(".");
				if (e <= 0 || e >= t.length - 1) return null;
				var r = t.lastIndexOf(".", e - 1);
				if (r <= 0 || r >= e - 1) return null;
				var i = n.list[t.slice(e + 1)];
				return i ? i.indexOf(" " + t.slice(r + 1, e) + " ") < 0 ? null : t.slice(r + 1) : null;
			},
			noConflict: function() {
				return t.SecondLevelDomains === this && (t.SecondLevelDomains = e), this;
			}
		};
		return n;
	};
	"object" == typeof e && e.exports ? e.exports = r() : "function" == typeof define && define.amd ? define(r) : n.SecondLevelDomains = r(n);
}), oe = s((t, e) => {
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
	var n = t, r = function(t, e, n, r) {
		var i = r && r.URI;
		function o(t, e) {
			var n = arguments.length >= 1;
			if (!(this instanceof o)) return n ? arguments.length >= 2 ? new o(t, e) : new o(t) : new o();
			if (void 0 === t) {
				if (n) throw new TypeError("undefined is not a valid argument for URI");
				t = "undefined" != typeof location ? location.href + "" : "";
			}
			if (null === t && n) throw new TypeError("null is not a valid argument for URI");
			return this.href(t), void 0 !== e ? this.absoluteTo(e) : this;
		}
		o.version = "1.19.11";
		var s = o.prototype, a = Object.prototype.hasOwnProperty;
		function u(t) {
			return t.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
		}
		function c(t) {
			return void 0 === t ? "Undefined" : String(Object.prototype.toString.call(t)).slice(8, -1);
		}
		function l(t) {
			return "Array" === c(t);
		}
		function h(t, e) {
			var n, r, i = {};
			if ("RegExp" === c(e)) i = null;
			else if (l(e)) for (n = 0, r = e.length; n < r; n++) i[e[n]] = !0;
			else i[e] = !0;
			for (n = 0, r = t.length; n < r; n++) (i && void 0 !== i[t[n]] || !i && e.test(t[n])) && (t.splice(n, 1), r--, n--);
			return t;
		}
		function f(t, e) {
			var n, r;
			if (l(e)) {
				for (n = 0, r = e.length; n < r; n++) if (!f(t, e[n])) return !1;
				return !0;
			}
			var i = c(e);
			for (n = 0, r = t.length; n < r; n++) if ("RegExp" === i) {
				if ("string" == typeof t[n] && t[n].match(e)) return !0;
			} else if (t[n] === e) return !0;
			return !1;
		}
		function p(t, e) {
			if (!l(t) || !l(e)) return !1;
			if (t.length !== e.length) return !1;
			t.sort(), e.sort();
			for (var n = 0, r = t.length; n < r; n++) if (t[n] !== e[n]) return !1;
			return !0;
		}
		function d(t) {
			return t.replace(/^\/+|\/+$/g, "");
		}
		function m(t) {
			return escape(t);
		}
		function y(t) {
			return encodeURIComponent(t).replace(/[!'()*]/g, m).replace(/\*/g, "%2A");
		}
		o._parts = function() {
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
				preventInvalidHostname: o.preventInvalidHostname,
				duplicateQueryParameters: o.duplicateQueryParameters,
				escapeQuerySpace: o.escapeQuerySpace
			};
		}, o.preventInvalidHostname = !1, o.duplicateQueryParameters = !1, o.escapeQuerySpace = !0, o.protocol_expression = /^[a-z][a-z0-9.+-]*$/i, o.idn_expression = /[^a-z0-9\._-]/i, o.punycode_expression = /(xn--)/i, o.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, o.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/, o.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi, o.findUri = {
			start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
			end: /[\s\r\n]|$/,
			trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/,
			parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g
		}, o.leading_whitespace_expression = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/, o.ascii_tab_whitespace = /[\u0009\u000A\u000D]+/g, o.defaultPorts = {
			http: "80",
			https: "443",
			ftp: "21",
			gopher: "70",
			ws: "80",
			wss: "443"
		}, o.hostProtocols = ["http", "https"], o.invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/, o.domAttributes = {
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
		}, o.getDomAttribute = function(t) {
			if (t && t.nodeName) {
				var e = t.nodeName.toLowerCase();
				if ("input" !== e || "image" === t.type) return o.domAttributes[e];
			}
		}, o.encode = y, o.decode = decodeURIComponent, o.iso8859 = function() {
			o.encode = escape, o.decode = unescape;
		}, o.unicode = function() {
			o.encode = y, o.decode = decodeURIComponent;
		}, o.characters = {
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
		}, o.encodeQuery = function(t, e) {
			var n = o.encode(t + "");
			return void 0 === e && (e = o.escapeQuerySpace), e ? n.replace(/%20/g, "+") : n;
		}, o.decodeQuery = function(t, e) {
			t += "", void 0 === e && (e = o.escapeQuerySpace);
			try {
				return o.decode(e ? t.replace(/\+/g, "%20") : t);
			} catch (e) {
				return t;
			}
		};
		var g, w = {
			encode: "encode",
			decode: "decode"
		}, E = function(t, e) {
			return function(n) {
				try {
					return o[e](n + "").replace(o.characters[t][e].expression, function(n) {
						return o.characters[t][e].map[n];
					});
				} catch (t) {
					return n;
				}
			};
		};
		for (g in w) o[g + "PathSegment"] = E("pathname", w[g]), o[g + "UrnPathSegment"] = E("urnpath", w[g]);
		var _ = function(t, e, n) {
			return function(r) {
				var i = n ? function(t) {
					return o[e](o[n](t));
				} : o[e];
				for (var s = (r + "").split(t), a = 0, u = s.length; a < u; a++) s[a] = i(s[a]);
				return s.join(t);
			};
		};
		function O(t) {
			return function(e, n) {
				return void 0 === e ? this._parts[t] || "" : (this._parts[t] = e || null, this.build(!n), this);
			};
		}
		function b(t, e) {
			return function(n, r) {
				return void 0 === n ? this._parts[t] || "" : (null !== n && (n += "").charAt(0) === e && (n = n.substring(1)), this._parts[t] = n, this.build(!r), this);
			};
		}
		o.decodePath = _("/", "decodePathSegment"), o.decodeUrnPath = _(":", "decodeUrnPathSegment"), o.recodePath = _("/", "encodePathSegment", "decode"), o.recodeUrnPath = _(":", "encodeUrnPathSegment", "decode"), o.encodeReserved = E("reserved", "encode"), o.parse = function(t, e) {
			var n;
			return e || (e = { preventInvalidHostname: o.preventInvalidHostname }), (n = (t = (t = t.replace(o.leading_whitespace_expression, "")).replace(o.ascii_tab_whitespace, "")).indexOf("#")) > -1 && (e.fragment = t.substring(n + 1) || null, t = t.substring(0, n)), (n = t.indexOf("?")) > -1 && (e.query = t.substring(n + 1) || null, t = t.substring(0, n)), "//" === (t = (t = t.replace(/^(https?|ftp|wss?)?:+[/\\]*/i, "$1://")).replace(/^[/\\]{2,}/i, "//")).substring(0, 2) ? (e.protocol = null, t = t.substring(2), t = o.parseAuthority(t, e)) : (n = t.indexOf(":")) > -1 && (e.protocol = t.substring(0, n) || null, e.protocol && !e.protocol.match(o.protocol_expression) ? e.protocol = void 0 : "//" === t.substring(n + 1, n + 3).replace(/\\/g, "/") ? (t = t.substring(n + 3), t = o.parseAuthority(t, e)) : (t = t.substring(n + 1), e.urn = !0)), e.path = t, e;
		}, o.parseHost = function(t, e) {
			t || (t = "");
			var n, r, i = (t = t.replace(/\\/g, "/")).indexOf("/");
			if (-1 === i && (i = t.length), "[" === t.charAt(0)) n = t.indexOf("]"), e.hostname = t.substring(1, n) || null, e.port = t.substring(n + 2, i) || null, "/" === e.port && (e.port = null);
			else {
				var s = t.indexOf(":"), a = t.indexOf("/"), u = t.indexOf(":", s + 1);
				-1 !== u && (-1 === a || u < a) ? (e.hostname = t.substring(0, i) || null, e.port = null) : (r = t.substring(0, i).split(":"), e.hostname = r[0] || null, e.port = r[1] || null);
			}
			return e.hostname && "/" !== t.substring(i).charAt(0) && (i++, t = "/" + t), e.preventInvalidHostname && o.ensureValidHostname(e.hostname, e.protocol), e.port && o.ensureValidPort(e.port), t.substring(i) || "/";
		}, o.parseAuthority = function(t, e) {
			return t = o.parseUserinfo(t, e), o.parseHost(t, e);
		}, o.parseUserinfo = function(t, e) {
			var n = t;
			-1 !== t.indexOf("\\") && (t = t.replace(/\\/g, "/"));
			var r, i = t.indexOf("/"), s = t.lastIndexOf("@", i > -1 ? i : t.length - 1);
			return s > -1 && (-1 === i || s < i) ? (r = t.substring(0, s).split(":"), e.username = r[0] ? o.decode(r[0]) : null, r.shift(), e.password = r[0] ? o.decode(r.join(":")) : null, t = n.substring(s + 1)) : (e.username = null, e.password = null), t;
		}, o.parseQuery = function(t, e) {
			if (!t) return {};
			if (!(t = t.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, ""))) return {};
			for (var n, r, i, s = {}, u = t.split("&"), c = u.length, l = 0; l < c; l++) n = u[l].split("="), r = o.decodeQuery(n.shift(), e), i = n.length ? o.decodeQuery(n.join("="), e) : null, "__proto__" !== r && (a.call(s, r) ? ("string" != typeof s[r] && null !== s[r] || (s[r] = [s[r]]), s[r].push(i)) : s[r] = i);
			return s;
		}, o.build = function(t) {
			var e = "", n = !1;
			return t.protocol && (e += t.protocol + ":"), t.urn || !e && !t.hostname || (e += "//", n = !0), e += o.buildAuthority(t) || "", "string" == typeof t.path && ("/" !== t.path.charAt(0) && n && (e += "/"), e += t.path), "string" == typeof t.query && t.query && (e += "?" + t.query), "string" == typeof t.fragment && t.fragment && (e += "#" + t.fragment), e;
		}, o.buildHost = function(t) {
			var e = "";
			return t.hostname ? (o.ip6_expression.test(t.hostname) ? e += "[" + t.hostname + "]" : e += t.hostname, t.port && (e += ":" + t.port), e) : "";
		}, o.buildAuthority = function(t) {
			return o.buildUserinfo(t) + o.buildHost(t);
		}, o.buildUserinfo = function(t) {
			var e = "";
			return t.username && (e += o.encode(t.username)), t.password && (e += ":" + o.encode(t.password)), e && (e += "@"), e;
		}, o.buildQuery = function(t, e, n) {
			var r, i, s, u, c = "";
			for (i in t) if ("__proto__" !== i && a.call(t, i)) if (l(t[i])) for (r = {}, s = 0, u = t[i].length; s < u; s++) void 0 !== t[i][s] && void 0 === r[t[i][s] + ""] && (c += "&" + o.buildQueryParameter(i, t[i][s], n), !0 !== e && (r[t[i][s] + ""] = !0));
			else void 0 !== t[i] && (c += "&" + o.buildQueryParameter(i, t[i], n));
			return c.substring(1);
		}, o.buildQueryParameter = function(t, e, n) {
			return o.encodeQuery(t, n) + (null !== e ? "=" + o.encodeQuery(e, n) : "");
		}, o.addQuery = function(t, e, n) {
			if ("object" == typeof e) for (var r in e) a.call(e, r) && o.addQuery(t, r, e[r]);
			else {
				if ("string" != typeof e) throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
				if (void 0 === t[e]) return void (t[e] = n);
				"string" == typeof t[e] && (t[e] = [t[e]]), l(n) || (n = [n]), t[e] = (t[e] || []).concat(n);
			}
		}, o.setQuery = function(t, e, n) {
			if ("object" == typeof e) for (var r in e) a.call(e, r) && o.setQuery(t, r, e[r]);
			else {
				if ("string" != typeof e) throw new TypeError("URI.setQuery() accepts an object, string as the name parameter");
				t[e] = void 0 === n ? null : n;
			}
		}, o.removeQuery = function(t, e, n) {
			var r, i, s;
			if (l(e)) for (r = 0, i = e.length; r < i; r++) t[e[r]] = void 0;
			else if ("RegExp" === c(e)) for (s in t) e.test(s) && (t[s] = void 0);
			else if ("object" == typeof e) for (s in e) a.call(e, s) && o.removeQuery(t, s, e[s]);
			else {
				if ("string" != typeof e) throw new TypeError("URI.removeQuery() accepts an object, string, RegExp as the first parameter");
				void 0 !== n ? "RegExp" === c(n) ? !l(t[e]) && n.test(t[e]) ? t[e] = void 0 : t[e] = h(t[e], n) : t[e] !== String(n) || l(n) && 1 !== n.length ? l(t[e]) && (t[e] = h(t[e], n)) : t[e] = void 0 : t[e] = void 0;
			}
		}, o.hasQuery = function(t, e, n, r) {
			switch (c(e)) {
				case "String": break;
				case "RegExp":
					for (var i in t) if (a.call(t, i) && e.test(i) && (void 0 === n || o.hasQuery(t, i, n))) return !0;
					return !1;
				case "Object":
					for (var s in e) if (a.call(e, s) && !o.hasQuery(t, s, e[s])) return !1;
					return !0;
				default: throw new TypeError("URI.hasQuery() accepts a string, regular expression or object as the name parameter");
			}
			switch (c(n)) {
				case "Undefined": return e in t;
				case "Boolean": return n === Boolean(l(t[e]) ? t[e].length : t[e]);
				case "Function": return !!n(t[e], e, t);
				case "Array": return !!l(t[e]) && (r ? f : p)(t[e], n);
				case "RegExp": return l(t[e]) ? !!r && f(t[e], n) : Boolean(t[e] && t[e].match(n));
				case "Number": n = String(n);
				case "String": return l(t[e]) ? !!r && f(t[e], n) : t[e] === n;
				default: throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");
			}
		}, o.joinPaths = function() {
			for (var t = [], e = [], n = 0, r = 0; r < arguments.length; r++) {
				var i = new o(arguments[r]);
				t.push(i);
				for (var s = i.segment(), a = 0; a < s.length; a++) "string" == typeof s[a] && e.push(s[a]), s[a] && n++;
			}
			if (!e.length || !n) return new o("");
			var u = new o("").segment(e);
			return "" !== t[0].path() && "/" !== t[0].path().slice(0, 1) || u.path("/" + u.path()), u.normalize();
		}, o.commonPath = function(t, e) {
			var n, r = Math.min(t.length, e.length);
			for (n = 0; n < r; n++) if (t.charAt(n) !== e.charAt(n)) {
				n--;
				break;
			}
			return n < 1 ? t.charAt(0) === e.charAt(0) && "/" === t.charAt(0) ? "/" : "" : ("/" === t.charAt(n) && "/" === e.charAt(n) || (n = t.substring(0, n).lastIndexOf("/")), t.substring(0, n + 1));
		}, o.withinString = function(t, e, n) {
			n || (n = {});
			var r = n.start || o.findUri.start, i = n.end || o.findUri.end, s = n.trim || o.findUri.trim, a = n.parens || o.findUri.parens, u = /[a-z0-9-]=["']?$/i;
			for (r.lastIndex = 0;;) {
				var c = r.exec(t);
				if (!c) break;
				var l = c.index;
				if (n.ignoreHtml) {
					var h = t.slice(Math.max(l - 3, 0), l);
					if (h && u.test(h)) continue;
				}
				for (var f = l + t.slice(l).search(i), p = t.slice(l, f), d = -1;;) {
					var m = a.exec(p);
					if (!m) break;
					var y = m.index + m[0].length;
					d = Math.max(d, y);
				}
				if (!((p = d > -1 ? p.slice(0, d) + p.slice(d).replace(s, "") : p.replace(s, "")).length <= c[0].length || n.ignore && n.ignore.test(p))) {
					var g = e(p, l, f = l + p.length, t);
					void 0 !== g ? (g = String(g), t = t.slice(0, l) + g + t.slice(f), r.lastIndex = l + g.length) : r.lastIndex = f;
				}
			}
			return r.lastIndex = 0, t;
		}, o.ensureValidHostname = function(e, n) {
			var r = !!e, i = !1;
			if (n && (i = f(o.hostProtocols, n)), i && !r) throw new TypeError("Hostname cannot be empty, if protocol is " + n);
			if (e && e.match(o.invalid_hostname_characters)) {
				if (!t) throw new TypeError("Hostname \"" + e + "\" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available");
				if (t.toASCII(e).match(o.invalid_hostname_characters)) throw new TypeError("Hostname \"" + e + "\" contains characters other than [A-Z0-9.-:_]");
			}
		}, o.ensureValidPort = function(t) {
			if (t) {
				var e = Number(t);
				if (!(/^[0-9]+$/.test(e) && e > 0 && e < 65536)) throw new TypeError("Port \"" + t + "\" is not a valid port");
			}
		}, o.noConflict = function(t) {
			if (t) {
				var e = { URI: this.noConflict() };
				return r.URITemplate && "function" == typeof r.URITemplate.noConflict && (e.URITemplate = r.URITemplate.noConflict()), r.IPv6 && "function" == typeof r.IPv6.noConflict && (e.IPv6 = r.IPv6.noConflict()), r.SecondLevelDomains && "function" == typeof r.SecondLevelDomains.noConflict && (e.SecondLevelDomains = r.SecondLevelDomains.noConflict()), e;
			}
			return r.URI === this && (r.URI = i), this;
		}, s.build = function(t) {
			return !0 === t ? this._deferred_build = !0 : (void 0 === t || this._deferred_build) && (this._string = o.build(this._parts), this._deferred_build = !1), this;
		}, s.clone = function() {
			return new o(this);
		}, s.valueOf = s.toString = function() {
			return this.build(!1)._string;
		}, s.protocol = O("protocol"), s.username = O("username"), s.password = O("password"), s.hostname = O("hostname"), s.port = O("port"), s.query = b("query", "?"), s.fragment = b("fragment", "#"), s.search = function(t, e) {
			var n = this.query(t, e);
			return "string" == typeof n && n.length ? "?" + n : n;
		}, s.hash = function(t, e) {
			var n = this.fragment(t, e);
			return "string" == typeof n && n.length ? "#" + n : n;
		}, s.pathname = function(t, e) {
			if (void 0 === t || !0 === t) {
				var n = this._parts.path || (this._parts.hostname ? "/" : "");
				return t ? (this._parts.urn ? o.decodeUrnPath : o.decodePath)(n) : n;
			}
			return this._parts.urn ? this._parts.path = t ? o.recodeUrnPath(t) : "" : this._parts.path = t ? o.recodePath(t) : "/", this.build(!e), this;
		}, s.path = s.pathname, s.href = function(t, e) {
			var n;
			if (void 0 === t) return this.toString();
			this._string = "", this._parts = o._parts();
			var r = t instanceof o, i = "object" == typeof t && (t.hostname || t.path || t.pathname);
			if (t.nodeName && (t = t[o.getDomAttribute(t)] || "", i = !1), !r && i && void 0 !== t.pathname && (t = t.toString()), "string" == typeof t || t instanceof String) this._parts = o.parse(String(t), this._parts);
			else {
				if (!r && !i) throw new TypeError("invalid input");
				var s = r ? t._parts : t;
				for (n in s) "query" !== n && a.call(this._parts, n) && (this._parts[n] = s[n]);
				s.query && this.query(s.query, !1);
			}
			return this.build(!e), this;
		}, s.is = function(t) {
			var e = !1, r = !1, i = !1, s = !1, a = !1, u = !1, c = !1, l = !this._parts.urn;
			switch (this._parts.hostname && (l = !1, r = o.ip4_expression.test(this._parts.hostname), i = o.ip6_expression.test(this._parts.hostname), a = (s = !(e = r || i)) && n && n.has(this._parts.hostname), u = s && o.idn_expression.test(this._parts.hostname), c = s && o.punycode_expression.test(this._parts.hostname)), t.toLowerCase()) {
				case "relative": return l;
				case "absolute": return !l;
				case "domain":
				case "name": return s;
				case "sld": return a;
				case "ip": return e;
				case "ip4":
				case "ipv4":
				case "inet4": return r;
				case "ip6":
				case "ipv6":
				case "inet6": return i;
				case "idn": return u;
				case "url": return !this._parts.urn;
				case "urn": return !!this._parts.urn;
				case "punycode": return c;
			}
			return null;
		};
		var T = s.protocol, A = s.port, x = s.hostname;
		s.protocol = function(t, e) {
			if (t && !(t = t.replace(/:(\/\/)?$/, "")).match(o.protocol_expression)) throw new TypeError("Protocol \"" + t + "\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");
			return T.call(this, t, e);
		}, s.scheme = s.protocol, s.port = function(t, e) {
			return this._parts.urn ? void 0 === t ? "" : this : (void 0 !== t && (0 === t && (t = null), t && (":" === (t += "").charAt(0) && (t = t.substring(1)), o.ensureValidPort(t))), A.call(this, t, e));
		}, s.hostname = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if (void 0 !== t) {
				var n = { preventInvalidHostname: this._parts.preventInvalidHostname };
				if ("/" !== o.parseHost(t, n)) throw new TypeError("Hostname \"" + t + "\" contains characters other than [A-Z0-9.-]");
				t = n.hostname, this._parts.preventInvalidHostname && o.ensureValidHostname(t, this._parts.protocol);
			}
			return x.call(this, t, e);
		}, s.origin = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if (void 0 === t) {
				var n = this.protocol();
				return this.authority() ? (n ? n + "://" : "") + this.authority() : "";
			}
			var r = o(t);
			return this.protocol(r.protocol()).authority(r.authority()).build(!e), this;
		}, s.host = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if (void 0 === t) return this._parts.hostname ? o.buildHost(this._parts) : "";
			if ("/" !== o.parseHost(t, this._parts)) throw new TypeError("Hostname \"" + t + "\" contains characters other than [A-Z0-9.-]");
			return this.build(!e), this;
		}, s.authority = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if (void 0 === t) return this._parts.hostname ? o.buildAuthority(this._parts) : "";
			if ("/" !== o.parseAuthority(t, this._parts)) throw new TypeError("Hostname \"" + t + "\" contains characters other than [A-Z0-9.-]");
			return this.build(!e), this;
		}, s.userinfo = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if (void 0 === t) {
				var n = o.buildUserinfo(this._parts);
				return n ? n.substring(0, n.length - 1) : n;
			}
			return "@" !== t[t.length - 1] && (t += "@"), o.parseUserinfo(t, this._parts), this.build(!e), this;
		}, s.resource = function(t, e) {
			var n;
			return void 0 === t ? this.path() + this.search() + this.hash() : (n = o.parse(t), this._parts.path = n.path, this._parts.query = n.query, this._parts.fragment = n.fragment, this.build(!e), this);
		}, s.subdomain = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if (void 0 === t) {
				if (!this._parts.hostname || this.is("IP")) return "";
				var n = this._parts.hostname.length - this.domain().length - 1;
				return this._parts.hostname.substring(0, n) || "";
			}
			var r = this._parts.hostname.length - this.domain().length, i = this._parts.hostname.substring(0, r), s = new RegExp("^" + u(i));
			if (t && "." !== t.charAt(t.length - 1) && (t += "."), -1 !== t.indexOf(":")) throw new TypeError("Domains cannot contain colons");
			return t && o.ensureValidHostname(t, this._parts.protocol), this._parts.hostname = this._parts.hostname.replace(s, t), this.build(!e), this;
		}, s.domain = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if ("boolean" == typeof t && (e = t, t = void 0), void 0 === t) {
				if (!this._parts.hostname || this.is("IP")) return "";
				var n = this._parts.hostname.match(/\./g);
				if (n && n.length < 2) return this._parts.hostname;
				var r = this._parts.hostname.length - this.tld(e).length - 1;
				return r = this._parts.hostname.lastIndexOf(".", r - 1) + 1, this._parts.hostname.substring(r) || "";
			}
			if (!t) throw new TypeError("cannot set domain empty");
			if (-1 !== t.indexOf(":")) throw new TypeError("Domains cannot contain colons");
			if (o.ensureValidHostname(t, this._parts.protocol), !this._parts.hostname || this.is("IP")) this._parts.hostname = t;
			else {
				var i = new RegExp(u(this.domain()) + "$");
				this._parts.hostname = this._parts.hostname.replace(i, t);
			}
			return this.build(!e), this;
		}, s.tld = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if ("boolean" == typeof t && (e = t, t = void 0), void 0 === t) {
				if (!this._parts.hostname || this.is("IP")) return "";
				var r = this._parts.hostname.lastIndexOf("."), i = this._parts.hostname.substring(r + 1);
				return !0 !== e && n && n.list[i.toLowerCase()] && n.get(this._parts.hostname) || i;
			}
			var o;
			if (!t) throw new TypeError("cannot set TLD empty");
			if (t.match(/[^a-zA-Z0-9-]/)) {
				if (!n || !n.is(t)) throw new TypeError("TLD \"" + t + "\" contains characters other than [A-Z0-9]");
				o = new RegExp(u(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(o, t);
			} else {
				if (!this._parts.hostname || this.is("IP")) throw new ReferenceError("cannot set TLD on non-domain host");
				o = new RegExp(u(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(o, t);
			}
			return this.build(!e), this;
		}, s.directory = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if (void 0 === t || !0 === t) {
				if (!this._parts.path && !this._parts.hostname) return "";
				if ("/" === this._parts.path) return "/";
				var n = this._parts.path.length - this.filename().length - 1, r = this._parts.path.substring(0, n) || (this._parts.hostname ? "/" : "");
				return t ? o.decodePath(r) : r;
			}
			var i = this._parts.path.length - this.filename().length, s = this._parts.path.substring(0, i), a = new RegExp("^" + u(s));
			return this.is("relative") || (t || (t = "/"), "/" !== t.charAt(0) && (t = "/" + t)), t && "/" !== t.charAt(t.length - 1) && (t += "/"), t = o.recodePath(t), this._parts.path = this._parts.path.replace(a, t), this.build(!e), this;
		}, s.filename = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if ("string" != typeof t) {
				if (!this._parts.path || "/" === this._parts.path) return "";
				var n = this._parts.path.lastIndexOf("/"), r = this._parts.path.substring(n + 1);
				return t ? o.decodePathSegment(r) : r;
			}
			var i = !1;
			"/" === t.charAt(0) && (t = t.substring(1)), t.match(/\.?\//) && (i = !0);
			var s = new RegExp(u(this.filename()) + "$");
			return t = o.recodePath(t), this._parts.path = this._parts.path.replace(s, t), i ? this.normalizePath(e) : this.build(!e), this;
		}, s.suffix = function(t, e) {
			if (this._parts.urn) return void 0 === t ? "" : this;
			if (void 0 === t || !0 === t) {
				if (!this._parts.path || "/" === this._parts.path) return "";
				var n, r, i = this.filename(), s = i.lastIndexOf(".");
				return -1 === s ? "" : (n = i.substring(s + 1), r = /^[a-z0-9%]+$/i.test(n) ? n : "", t ? o.decodePathSegment(r) : r);
			}
			"." === t.charAt(0) && (t = t.substring(1));
			var a, c = this.suffix();
			if (c) a = t ? new RegExp(u(c) + "$") : new RegExp(u("." + c) + "$");
			else {
				if (!t) return this;
				this._parts.path += "." + o.recodePath(t);
			}
			return a && (t = o.recodePath(t), this._parts.path = this._parts.path.replace(a, t)), this.build(!e), this;
		}, s.segment = function(t, e, n) {
			var r = this._parts.urn ? ":" : "/", i = this.path(), o = "/" === i.substring(0, 1), s = i.split(r);
			if (void 0 !== t && "number" != typeof t && (n = e, e = t, t = void 0), void 0 !== t && "number" != typeof t) throw new Error("Bad segment \"" + t + "\", must be 0-based integer");
			if (o && s.shift(), t < 0 && (t = Math.max(s.length + t, 0)), void 0 === e) return void 0 === t ? s : s[t];
			if (null === t || void 0 === s[t]) if (l(e)) {
				s = [];
				for (var a = 0, u = e.length; a < u; a++) (e[a].length || s.length && s[s.length - 1].length) && (s.length && !s[s.length - 1].length && s.pop(), s.push(d(e[a])));
			} else (e || "string" == typeof e) && (e = d(e), "" === s[s.length - 1] ? s[s.length - 1] = e : s.push(e));
			else e ? s[t] = d(e) : s.splice(t, 1);
			return o && s.unshift(""), this.path(s.join(r), n);
		}, s.segmentCoded = function(t, e, n) {
			var r, i, s;
			if ("number" != typeof t && (n = e, e = t, t = void 0), void 0 === e) {
				if (l(r = this.segment(t, e, n))) for (i = 0, s = r.length; i < s; i++) r[i] = o.decode(r[i]);
				else r = void 0 !== r ? o.decode(r) : void 0;
				return r;
			}
			if (l(e)) for (i = 0, s = e.length; i < s; i++) e[i] = o.encode(e[i]);
			else e = "string" == typeof e || e instanceof String ? o.encode(e) : e;
			return this.segment(t, e, n);
		};
		var R = s.query;
		return s.query = function(t, e) {
			if (!0 === t) return o.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			if ("function" == typeof t) {
				var n = o.parseQuery(this._parts.query, this._parts.escapeQuerySpace), r = t.call(this, n);
				return this._parts.query = o.buildQuery(r || n, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), this.build(!e), this;
			}
			return void 0 !== t && "string" != typeof t ? (this._parts.query = o.buildQuery(t, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), this.build(!e), this) : R.call(this, t, e);
		}, s.setQuery = function(t, e, n) {
			var r = o.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			if ("string" == typeof t || t instanceof String) r[t] = void 0 !== e ? e : null;
			else {
				if ("object" != typeof t) throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
				for (var i in t) a.call(t, i) && (r[i] = t[i]);
			}
			return this._parts.query = o.buildQuery(r, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), "string" != typeof t && (n = e), this.build(!n), this;
		}, s.addQuery = function(t, e, n) {
			var r = o.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			return o.addQuery(r, t, void 0 === e ? null : e), this._parts.query = o.buildQuery(r, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), "string" != typeof t && (n = e), this.build(!n), this;
		}, s.removeQuery = function(t, e, n) {
			var r = o.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			return o.removeQuery(r, t, e), this._parts.query = o.buildQuery(r, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), "string" != typeof t && (n = e), this.build(!n), this;
		}, s.hasQuery = function(t, e, n) {
			var r = o.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			return o.hasQuery(r, t, e, n);
		}, s.setSearch = s.setQuery, s.addSearch = s.addQuery, s.removeSearch = s.removeQuery, s.hasSearch = s.hasQuery, s.normalize = function() {
			return this._parts.urn ? this.normalizeProtocol(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build() : this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build();
		}, s.normalizeProtocol = function(t) {
			return "string" == typeof this._parts.protocol && (this._parts.protocol = this._parts.protocol.toLowerCase(), this.build(!t)), this;
		}, s.normalizeHostname = function(n) {
			return this._parts.hostname && (this.is("IDN") && t ? this._parts.hostname = t.toASCII(this._parts.hostname) : this.is("IPv6") && e && (this._parts.hostname = e.best(this._parts.hostname)), this._parts.hostname = this._parts.hostname.toLowerCase(), this.build(!n)), this;
		}, s.normalizePort = function(t) {
			return "string" == typeof this._parts.protocol && this._parts.port === o.defaultPorts[this._parts.protocol] && (this._parts.port = null, this.build(!t)), this;
		}, s.normalizePath = function(t) {
			var e, n = this._parts.path;
			if (!n) return this;
			if (this._parts.urn) return this._parts.path = o.recodeUrnPath(this._parts.path), this.build(!t), this;
			if ("/" === this._parts.path) return this;
			var r, i, s = "";
			for ("/" !== (n = o.recodePath(n)).charAt(0) && (e = !0, n = "/" + n), "/.." !== n.slice(-3) && "/." !== n.slice(-2) || (n += "/"), n = n.replace(/(\/(\.\/)+)|(\/\.$)/g, "/").replace(/\/{2,}/g, "/"), e && (s = n.substring(1).match(/^(\.\.\/)+/) || "") && (s = s[0]); -1 !== (r = n.search(/\/\.\.(\/|$)/));) 0 !== r ? (-1 === (i = n.substring(0, r).lastIndexOf("/")) && (i = r), n = n.substring(0, i) + n.substring(r + 3)) : n = n.substring(3);
			return e && this.is("relative") && (n = s + n.substring(1)), this._parts.path = n, this.build(!t), this;
		}, s.normalizePathname = s.normalizePath, s.normalizeQuery = function(t) {
			return "string" == typeof this._parts.query && (this._parts.query.length ? this.query(o.parseQuery(this._parts.query, this._parts.escapeQuerySpace)) : this._parts.query = null, this.build(!t)), this;
		}, s.normalizeFragment = function(t) {
			return this._parts.fragment || (this._parts.fragment = null, this.build(!t)), this;
		}, s.normalizeSearch = s.normalizeQuery, s.normalizeHash = s.normalizeFragment, s.iso8859 = function() {
			var t = o.encode, e = o.decode;
			o.encode = escape, o.decode = decodeURIComponent;
			try {
				this.normalize();
			} finally {
				o.encode = t, o.decode = e;
			}
			return this;
		}, s.unicode = function() {
			var t = o.encode, e = o.decode;
			o.encode = y, o.decode = unescape;
			try {
				this.normalize();
			} finally {
				o.encode = t, o.decode = e;
			}
			return this;
		}, s.readable = function() {
			var e = this.clone();
			e.username("").password("").normalize();
			var n = "";
			if (e._parts.protocol && (n += e._parts.protocol + "://"), e._parts.hostname && (e.is("punycode") && t ? (n += t.toUnicode(e._parts.hostname), e._parts.port && (n += ":" + e._parts.port)) : n += e.host()), e._parts.hostname && e._parts.path && "/" !== e._parts.path.charAt(0) && (n += "/"), n += e.path(!0), e._parts.query) {
				for (var r = "", i = 0, s = e._parts.query.split("&"), a = s.length; i < a; i++) {
					var u = (s[i] || "").split("=");
					r += "&" + o.decodeQuery(u[0], this._parts.escapeQuerySpace).replace(/&/g, "%26"), void 0 !== u[1] && (r += "=" + o.decodeQuery(u[1], this._parts.escapeQuerySpace).replace(/&/g, "%26"));
				}
				n += "?" + r.substring(1);
			}
			return n + o.decodeQuery(e.hash(), !0);
		}, s.absoluteTo = function(t) {
			var e, n, r, i = this.clone(), s = [
				"protocol",
				"username",
				"password",
				"hostname",
				"port"
			];
			if (this._parts.urn) throw new Error("URNs do not have any generally defined hierarchical components");
			if (t instanceof o || (t = new o(t)), i._parts.protocol) return i;
			if (i._parts.protocol = t._parts.protocol, this._parts.hostname) return i;
			for (n = 0; r = s[n]; n++) i._parts[r] = t._parts[r];
			return i._parts.path ? (".." === i._parts.path.substring(-2) && (i._parts.path += "/"), "/" !== i.path().charAt(0) && (e = (e = t.directory()) || (0 === t.path().indexOf("/") ? "/" : ""), i._parts.path = (e ? e + "/" : "") + i._parts.path, i.normalizePath())) : (i._parts.path = t._parts.path, i._parts.query || (i._parts.query = t._parts.query)), i.build(), i;
		}, s.relativeTo = function(t) {
			var e, n, r, i, s, a = this.clone().normalize();
			if (a._parts.urn) throw new Error("URNs do not have any generally defined hierarchical components");
			if (t = new o(t).normalize(), e = a._parts, n = t._parts, i = a.path(), s = t.path(), "/" !== i.charAt(0)) throw new Error("URI is already relative");
			if ("/" !== s.charAt(0)) throw new Error("Cannot calculate a URI relative to another relative URI");
			if (e.protocol === n.protocol && (e.protocol = null), e.username !== n.username || e.password !== n.password) return a.build();
			if (null !== e.protocol || null !== e.username || null !== e.password) return a.build();
			if (e.hostname !== n.hostname || e.port !== n.port) return a.build();
			if (e.hostname = null, e.port = null, i === s) return e.path = "", a.build();
			if (!(r = o.commonPath(i, s))) return a.build();
			var u = n.path.substring(r.length).replace(/[^\/]*$/, "").replace(/.*?\//g, "../");
			return e.path = u + e.path.substring(r.length) || "./", a.build();
		}, s.equals = function(t) {
			var e, n, r, i, s, u = this.clone(), c = new o(t), h = {};
			if (u.normalize(), c.normalize(), u.toString() === c.toString()) return !0;
			if (r = u.query(), i = c.query(), u.query(""), c.query(""), u.toString() !== c.toString()) return !1;
			if (r.length !== i.length) return !1;
			for (s in e = o.parseQuery(r, this._parts.escapeQuerySpace), n = o.parseQuery(i, this._parts.escapeQuerySpace), e) if (a.call(e, s)) {
				if (l(e[s])) {
					if (!p(e[s], n[s])) return !1;
				} else if (e[s] !== n[s]) return !1;
				h[s] = !0;
			}
			for (s in n) if (a.call(n, s) && !h[s]) return !1;
			return !0;
		}, s.preventInvalidHostname = function(t) {
			return this._parts.preventInvalidHostname = !!t, this;
		}, s.duplicateQueryParameters = function(t) {
			return this._parts.duplicateQueryParameters = !!t, this;
		}, s.escapeQuerySpace = function(t) {
			return this._parts.escapeQuerySpace = !!t, this;
		}, o;
	};
	"object" == typeof e && e.exports ? e.exports = r(ne(), re(), ie()) : "function" == typeof define && define.amd ? define([
		"./punycode",
		"./IPv6",
		"./SecondLevelDomains"
	], r) : n.URI = r(n.punycode, n.IPv6, n.SecondLevelDomains, n);
});
function se(t, e) {
	if (null === t || "object" != typeof t) return t;
	e = e ?? !1;
	const n = new t.constructor();
	for (const r in t) if (t.hasOwnProperty(r)) {
		let i = t[r];
		e && (i = se(i, e)), n[r] = i;
	}
	return n;
}
function ae(t, e, n) {
	n = n ?? !1;
	const r = {}, i = N(t), o = N(e);
	let s, a, u;
	if (i) for (s in t) t.hasOwnProperty(s) && (a = t[s], o && n && "object" == typeof a && e.hasOwnProperty(s) ? (u = e[s], r[s] = "object" == typeof u ? ae(a, u, n) : a) : r[s] = a);
	if (o) for (s in e) e.hasOwnProperty(s) && !r.hasOwnProperty(s) && (u = e[s], r[s] = u);
	return r;
}
function ue() {
	let t, e;
	const n = new Promise(function(n, r) {
		t = n, e = r;
	});
	return {
		resolve: t,
		reject: e,
		promise: n
	};
}
var ce = a(oe(), 1);
function le(t, e) {
	let n;
	return "undefined" != typeof document && (n = document), le._implementation(t, e, n);
}
le._implementation = function(t, e, n) {
	if (!N(t)) throw new v("relative uri is required.");
	if (!N(e)) {
		if (void 0 === n) return t;
		e = n.baseURI ?? n.location.href;
	}
	const r = new ce.default(t);
	return "" !== r.scheme() ? r.toString() : r.absoluteTo(e).toString();
};
const he = {};
function fe(t, e, n) {
	N(e) || (e = t.width), N(n) || (n = t.height);
	let r = he[e];
	N(r) || (r = {}, he[e] = r);
	let i = r[n];
	if (!N(i)) {
		const t = document.createElement("canvas");
		t.width = e, t.height = n, i = t.getContext("2d", { willReadFrequently: !0 }), i.globalCompositeOperation = "copy", r[n] = i;
	}
	return i.drawImage(t, 0, 0, e, n), i.getImageData(0, 0, e, n).data;
}
const pe = /^blob:/i;
function de(t) {
	return M.typeOf.string("uri", t), pe.test(t);
}
let me;
const ye = /^data:/i;
function ge(t) {
	return M.typeOf.string("uri", t), ye.test(t);
}
const we = {
	UNISSUED: 0,
	ISSUED: 1,
	ACTIVE: 2,
	RECEIVED: 3,
	CANCELLED: 4,
	FAILED: 5
};
Object.freeze(we);
const Ee = {
	TERRAIN: 0,
	IMAGERY: 1,
	TILES3D: 2,
	OTHER: 3
};
function _e(t) {
	const e = (t = t ?? I.EMPTY_OBJECT).throttleByServer ?? !1, n = t.throttle ?? !1;
	this.url = t.url, this.requestFunction = t.requestFunction, this.cancelFunction = t.cancelFunction, this.priorityFunction = t.priorityFunction, this.priority = t.priority ?? 0, this.throttle = n, this.throttleByServer = e, this.type = t.type ?? Ee.OTHER, this.serverKey = t.serverKey, this.state = we.UNISSUED, this.deferred = void 0, this.cancelled = !1;
}
function Oe(t, e, n) {
	this.statusCode = t, this.response = e, this.responseHeaders = n, "string" == typeof this.responseHeaders && (this.responseHeaders = function(t) {
		const e = {};
		if (!t) return e;
		const n = t.split("\r\n");
		for (let r = 0; r < n.length; ++r) {
			const t = n[r], i = t.indexOf(": ");
			i > 0 && (e[t.substring(0, i)] = t.substring(i + 2));
		}
		return e;
	}(this.responseHeaders));
}
function be(t) {
	M.typeOf.object("options", t), M.defined("options.comparator", t.comparator), this._comparator = t.comparator, this._array = [], this._length = 0, this._maximumLength = void 0;
}
function Te(t, e, n) {
	const r = t[e];
	t[e] = t[n], t[n] = r;
}
function Ae(t) {
	let e;
	this.name = "RuntimeError", this.message = t;
	try {
		throw new Error();
	} catch (t) {
		e = t.stack;
	}
	this.stack = e;
}
Object.freeze(Ee), _e.prototype.cancel = function() {
	this.cancelled = !0;
}, _e.prototype.clone = function(t) {
	return N(t) ? (t.url = this.url, t.requestFunction = this.requestFunction, t.cancelFunction = this.cancelFunction, t.priorityFunction = this.priorityFunction, t.priority = this.priority, t.throttle = this.throttle, t.throttleByServer = this.throttleByServer, t.type = this.type, t.serverKey = this.serverKey, t.state = we.UNISSUED, t.deferred = void 0, t.cancelled = !1, t) : new _e(this);
}, Oe.prototype.toString = function() {
	let t = "Request has failed.";
	return N(this.statusCode) && (t += ` Status Code: ${this.statusCode}`), t;
}, Object.defineProperties(be.prototype, {
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
		set: function(t) {
			M.typeOf.number.greaterThanOrEquals("maximumLength", t, 0);
			const e = this._length;
			if (t < e) {
				const n = this._array;
				for (let r = t; r < e; ++r) n[r] = void 0;
				this._length = t, n.length = t;
			}
			this._maximumLength = t;
		}
	},
	comparator: { get: function() {
		return this._comparator;
	} }
}), be.prototype.reserve = function(t) {
	t = t ?? this._length, this._array.length = t;
}, be.prototype.heapify = function(t) {
	t = t ?? 0;
	const e = this._length, n = this._comparator, r = this._array;
	let i = -1, o = !0;
	for (; o;) {
		const s = 2 * (t + 1), a = s - 1;
		i = a < e && n(r[a], r[t]) < 0 ? a : t, s < e && n(r[s], r[i]) < 0 && (i = s), i !== t ? (Te(r, i, t), t = i) : o = !1;
	}
}, be.prototype.resort = function() {
	const t = this._length;
	for (let e = Math.ceil(t / 2); e >= 0; --e) this.heapify(e);
}, be.prototype.insert = function(t) {
	M.defined("element", t);
	const e = this._array, n = this._comparator, r = this._maximumLength;
	let i, o = this._length++;
	for (o < e.length ? e[o] = t : e.push(t); 0 !== o;) {
		const t = Math.floor((o - 1) / 2);
		if (!(n(e[o], e[t]) < 0)) break;
		Te(e, o, t), o = t;
	}
	return N(r) && this._length > r && (i = e[r], this._length = r), i;
}, be.prototype.pop = function(t) {
	if (t = t ?? 0, 0 === this._length) return;
	M.typeOf.number.lessThan("index", t, this._length);
	const e = this._array, n = e[t];
	return Te(e, t, --this._length), this.heapify(t), e[this._length] = void 0, n;
}, N(Object.create) && (Ae.prototype = Object.create(Error.prototype), Ae.prototype.constructor = Ae), Ae.prototype.toString = function() {
	let t = `${this.name}: ${this.message}`;
	return N(this.stack) && (t += `\n${this.stack.toString()}`), t;
};
const xe = {
	numberOfAttemptedRequests: 0,
	numberOfActiveRequests: 0,
	numberOfCancelledRequests: 0,
	numberOfCancelledActiveRequests: 0,
	numberOfFailedRequests: 0,
	numberOfActiveRequestsEver: 0,
	lastNumberOfActiveRequests: 0
};
let Re = 20;
const Se = new be({ comparator: function(t, e) {
	return t.priority - e.priority;
} });
Se.maximumLength = Re, Se.reserve(Re);
const Ie = [];
let Ne = {};
const ve = "undefined" != typeof document ? new ce.default(document.location.href) : new ce.default(), Me = new C();
function Pe() {}
function Ce(t) {
	N(t.priorityFunction) && (t.priority = t.priorityFunction());
}
function qe(t) {
	return t.state === we.UNISSUED && (t.state = we.ISSUED, t.deferred = ue()), t.deferred.promise;
}
function Ue(t) {
	const e = qe(t);
	return t.state = we.ACTIVE, Ie.push(t), ++xe.numberOfActiveRequests, ++xe.numberOfActiveRequestsEver, ++Ne[t.serverKey], t.requestFunction().then(function(t) {
		return function(e) {
			if (t.state === we.CANCELLED) return;
			const n = t.deferred;
			--xe.numberOfActiveRequests, --Ne[t.serverKey], Me.raiseEvent(), t.state = we.RECEIVED, t.deferred = void 0, n.resolve(e);
		};
	}(t)).catch(function(t) {
		return function(e) {
			t.state !== we.CANCELLED && (++xe.numberOfFailedRequests, --xe.numberOfActiveRequests, --Ne[t.serverKey], Me.raiseEvent(e), t.state = we.FAILED, t.deferred.reject(e));
		};
	}(t)), e;
}
function Le(t) {
	const e = t.state === we.ACTIVE;
	if (t.state = we.CANCELLED, ++xe.numberOfCancelledRequests, N(t.deferred)) {
		const e = t.deferred;
		e.promise.catch(() => {}), t.deferred = void 0, e.reject(new Ae(`Request cancelled: "${t.url}"`));
	}
	e && (--xe.numberOfActiveRequests, --Ne[t.serverKey], ++xe.numberOfCancelledActiveRequests), N(t.cancelFunction) && t.cancelFunction();
}
Pe.maximumRequests = 50, Pe.maximumRequestsPerServer = 18, Pe.requestsByServer = {}, Pe.throttleRequests = !0, Pe.debugShowStatistics = !1, Pe.requestCompletedEvent = Me, Object.defineProperties(Pe, {
	statistics: { get: function() {
		return xe;
	} },
	priorityHeapLength: {
		get: function() {
			return Re;
		},
		set: function(t) {
			if (t < Re) for (; Se.length > t;) Le(Se.pop());
			Re = t, Se.maximumLength = t, Se.reserve(t);
		}
	}
}), Pe.serverHasOpenSlots = function(t, e) {
	e = e ?? 1;
	const n = Pe.requestsByServer[t] ?? Pe.maximumRequestsPerServer;
	return Ne[t] + e <= n;
}, Pe.heapHasOpenSlots = function(t) {
	return Se.length + t <= Re;
}, Pe.update = function() {
	let t, e, n = 0;
	const r = Ie.length;
	for (t = 0; t < r; ++t) e = Ie[t], e.cancelled && Le(e), e.state === we.ACTIVE ? n > 0 && (Ie[t - n] = e) : ++n;
	Ie.length -= n;
	const i = Se.internalArray, o = Se.length;
	for (t = 0; t < o; ++t) Ce(i[t]);
	Se.resort();
	const s = Math.max(Pe.maximumRequests - Ie.length, 0);
	let a = 0;
	for (; a < s && Se.length > 0;) e = Se.pop(), e.cancelled ? Le(e) : !e.throttleByServer || Pe.serverHasOpenSlots(e.serverKey) ? (Ue(e), ++a) : Le(e);
	Pe.debugShowStatistics && (0 === xe.numberOfActiveRequests && xe.lastNumberOfActiveRequests > 0 && (xe.numberOfAttemptedRequests > 0 && (console.log(`Number of attempted requests: ${xe.numberOfAttemptedRequests}`), xe.numberOfAttemptedRequests = 0), xe.numberOfCancelledRequests > 0 && (console.log(`Number of cancelled requests: ${xe.numberOfCancelledRequests}`), xe.numberOfCancelledRequests = 0), xe.numberOfCancelledActiveRequests > 0 && (console.log(`Number of cancelled active requests: ${xe.numberOfCancelledActiveRequests}`), xe.numberOfCancelledActiveRequests = 0), xe.numberOfFailedRequests > 0 && (console.log(`Number of failed requests: ${xe.numberOfFailedRequests}`), xe.numberOfFailedRequests = 0)), xe.lastNumberOfActiveRequests = xe.numberOfActiveRequests);
}, Pe.getServerKey = function(t) {
	M.typeOf.string("url", t);
	let e = new ce.default(t);
	"" === e.scheme() && (e = e.absoluteTo(ve), e.normalize());
	let n = e.authority();
	return /:/.test(n) || (n = `${n}:${"https" === e.scheme() ? "443" : "80"}`), N(Ne[n]) || (Ne[n] = 0), n;
}, Pe.request = function(t) {
	if (M.typeOf.object("request", t), M.typeOf.string("request.url", t.url), M.typeOf.func("request.requestFunction", t.requestFunction), ge(t.url) || de(t.url)) return Me.raiseEvent(), t.state = we.RECEIVED, t.requestFunction();
	if (++xe.numberOfAttemptedRequests, N(t.serverKey) || (t.serverKey = Pe.getServerKey(t.url)), Pe.throttleRequests && t.throttleByServer && !Pe.serverHasOpenSlots(t.serverKey)) return;
	if (!Pe.throttleRequests || !t.throttle) return Ue(t);
	if (Ie.length >= Pe.maximumRequests) return;
	Ce(t);
	const e = Se.insert(t);
	if (N(e)) {
		if (e === t) return;
		Le(e);
	}
	return qe(t);
}, Pe.clearForSpecs = function() {
	for (; Se.length > 0;) Le(Se.pop());
	const t = Ie.length;
	for (let e = 0; e < t; ++e) Le(Ie[e]);
	Ie.length = 0, Ne = {}, xe.numberOfAttemptedRequests = 0, xe.numberOfActiveRequests = 0, xe.numberOfCancelledRequests = 0, xe.numberOfCancelledActiveRequests = 0, xe.numberOfFailedRequests = 0, xe.numberOfActiveRequestsEver = 0, xe.lastNumberOfActiveRequests = 0;
}, Pe.numberOfActiveRequestsByServer = function(t) {
	return Ne[t];
}, Pe.requestHeap = Se;
const De = {};
let ze = {};
De.add = function(t, e) {
	if (!N(t)) throw new v("host is required.");
	if (!N(e) || e <= 0) throw new v("port is required to be greater than 0.");
	const n = `${t.toLowerCase()}:${e}`;
	N(ze[n]) || (ze[n] = !0);
}, De.remove = function(t, e) {
	if (!N(t)) throw new v("host is required.");
	if (!N(e) || e <= 0) throw new v("port is required to be greater than 0.");
	const n = `${t.toLowerCase()}:${e}`;
	N(ze[n]) && delete ze[n];
}, De.contains = function(t) {
	if (!N(t)) throw new v("url is required.");
	const e = function(t) {
		const e = new ce.default(t);
		e.normalize();
		let n = e.authority();
		if (0 !== n.length) {
			if (e.authority(n), -1 !== n.indexOf("@") && (n = n.split("@")[1]), -1 === n.indexOf(":")) {
				let t = e.scheme();
				if (0 === t.length && (t = window.location.protocol, t = t.substring(0, t.length - 1)), "http" === t) n += ":80";
				else {
					if ("https" !== t) return;
					n += ":443";
				}
			}
			return n;
		}
	}(t);
	return !(!N(e) || !N(ze[e]));
}, De.clear = function() {
	ze = {};
};
const je = function() {
	try {
		const t = new XMLHttpRequest();
		return t.open("GET", "#", !0), t.responseType = "blob", "blob" === t.responseType;
	} catch (t) {
		return !1;
	}
}();
function Fe(t) {
	"string" == typeof (t = t ?? I.EMPTY_OBJECT) && (t = { url: t }), M.typeOf.string("options.url", t.url), this._url = void 0, this._templateValues = Be(t.templateValues, {}), this._queryParameters = Be(t.queryParameters, {}), this.headers = Be(t.headers, {}), this.request = t.request ?? new _e(), this.proxy = t.proxy, this.retryCallback = t.retryCallback, this.retryAttempts = t.retryAttempts ?? 0, this._retryCount = 0, t.parseUrl ?? 1 ? this.parseUrl(t.url, !0, !0) : this._url = t.url, this._credits = t.credits;
}
function Be(t, e) {
	return N(t) ? se(t) : e;
}
let Ge;
function ke(t, e, n) {
	if (!n) return ae(t, e);
	const r = se(t, !0);
	for (const i in e) if (e.hasOwnProperty(i)) {
		let t = r[i];
		const n = e[i];
		N(t) ? (Array.isArray(t) || (t = r[i] = [t]), r[i] = t.concat(n)) : r[i] = Array.isArray(n) ? n.slice() : n;
	}
	return r;
}
function We(t, e, n) {
	const r = {};
	r[e] = n, t.setQueryParameters(r);
	const i = t.request, o = t.url;
	i.url = o, i.requestFunction = function() {
		const t = ue();
		return window[n] = function(e) {
			t.resolve(e);
			try {
				delete window[n];
			} catch (t) {
				window[n] = void 0;
			}
		}, Fe._Implementations.loadAndExecuteScript(o, n, t), t.promise;
	};
	const s = Pe.request(i);
	if (N(s)) return s.catch(function(r) {
		return i.state !== we.FAILED ? Promise.reject(r) : t.retryOnError(r).then(function(o) {
			return o ? (i.state = we.UNISSUED, i.deferred = void 0, We(t, e, n)) : Promise.reject(r);
		});
	});
}
function Ve(t) {
	if (t.state === we.ISSUED || t.state === we.ACTIVE) throw new Ae("The Resource is already being fetched.");
	t.state = we.UNISSUED, t.deferred = void 0;
}
Fe.createIfNeeded = function(t) {
	return t instanceof Fe ? t.getDerivedResource({ request: t.request }) : "string" != typeof t ? t : new Fe({ url: t });
}, Fe.supportsImageBitmapOptions = function() {
	return N(Ge) ? Ge : "function" != typeof createImageBitmap ? (Ge = Promise.resolve(!1), Ge) : (Ge = Fe.fetchBlob({ url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABGdBTUEAAE4g3rEiDgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAADElEQVQI12Ng6GAAAAEUAIngE3ZiAAAAAElFTkSuQmCC" }).then(function(t) {
		return Promise.all([createImageBitmap(t, {
			imageOrientation: "flipY",
			premultiplyAlpha: "none",
			colorSpaceConversion: "none"
		}), createImageBitmap(t)]);
	}).then(function(t) {
		const e = fe(t[0]), n = fe(t[1]);
		return e[1] !== n[1];
	}).catch(function() {
		return !1;
	}), Ge);
}, Object.defineProperties(Fe, { isBlobSupported: { get: function() {
	return je;
} } }), Object.defineProperties(Fe.prototype, {
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
		set: function(t) {
			this.parseUrl(t, !1, !1);
		}
	},
	extension: { get: function() {
		return function(t) {
			if (!N(t)) throw new v("uri is required.");
			const e = new ce.default(t);
			e.normalize();
			let n = e.path(), r = n.lastIndexOf("/");
			return -1 !== r && (n = n.substr(r + 1)), r = n.lastIndexOf("."), n = -1 === r ? "" : n.substr(r + 1), n;
		}(this._url);
	} },
	isDataUri: { get: function() {
		return ge(this._url);
	} },
	isBlobUri: { get: function() {
		return de(this._url);
	} },
	isCrossOriginUrl: { get: function() {
		return function(t) {
			N(me) || (me = document.createElement("a")), me.href = window.location.href;
			const e = me.host, n = me.protocol;
			return me.href = t, me.href = me.href, n !== me.protocol || e !== me.host;
		}(this._url);
	} },
	hasHeaders: { get: function() {
		return Object.keys(this.headers).length > 0;
	} },
	credits: { get: function() {
		return this._credits;
	} }
}), Fe.prototype.toString = function() {
	return this.getUrlComponent(!0, !0);
}, Fe.prototype.parseUrl = function(t, e, n, r) {
	let i = new ce.default(t);
	const o = 0 === (s = i.query()).length ? {} : -1 === s.indexOf("=") ? { [s]: void 0 } : function(t) {
		if (!N(t)) throw new v("queryString is required.");
		const e = {};
		if ("" === t) return e;
		const n = t.replace(/\+/g, "%20").split(/[&;]/);
		for (let r = 0, i = n.length; r < i; ++r) {
			const t = n[r].split("="), i = decodeURIComponent(t[0]);
			let o = t[1];
			o = N(o) ? decodeURIComponent(o) : "";
			const s = e[i];
			"string" == typeof s ? e[i] = [s, o] : Array.isArray(s) ? s.push(o) : e[i] = o;
		}
		return e;
	}(s);
	var s;
	this._queryParameters = e ? ke(o, this.queryParameters, n) : o, i.search(""), i.fragment(""), N(r) && "" === i.scheme() && (i = i.absoluteTo(le(r))), this._url = i.toString();
}, Fe.prototype.getUrlComponent = function(t, e) {
	if (this.isDataUri) return this._url;
	let n = this._url;
	t && (n = `${n}${function(t) {
		const e = Object.keys(t);
		return 0 === e.length ? "" : 1 !== e.length || N(t[e[0]]) ? `?${function(t) {
			if (!N(t)) throw new v("obj is required.");
			let e = "";
			for (const n in t) if (t.hasOwnProperty(n)) {
				const r = t[n], i = `${encodeURIComponent(n)}=`;
				if (Array.isArray(r)) for (let t = 0, n = r.length; t < n; ++t) e += `${i + encodeURIComponent(r[t])}&`;
				else e += `${i + encodeURIComponent(r)}&`;
			}
			return e = e.slice(0, -1), e;
		}(t)}` : `?${e[0]}`;
	}(this.queryParameters)}`), n = n.replace(/%7B/g, "{").replace(/%7D/g, "}");
	const r = this._templateValues;
	return Object.keys(r).length > 0 && (n = n.replace(/{(.*?)}/g, function(t, e) {
		const n = r[e];
		return N(n) ? encodeURIComponent(n) : t;
	})), e && N(this.proxy) && (n = this.proxy.getURL(n)), n;
}, Fe.prototype.setQueryParameters = function(t, e) {
	this._queryParameters = e ? ke(this._queryParameters, t, !1) : ke(t, this._queryParameters, !1);
}, Fe.prototype.appendQueryParameters = function(t) {
	this._queryParameters = ke(t, this._queryParameters, !0);
}, Fe.prototype.setTemplateValues = function(t, e) {
	this._templateValues = e ? ae(this._templateValues, t) : ae(t, this._templateValues);
}, Fe.prototype.getDerivedResource = function(t) {
	const e = this.clone();
	if (e._retryCount = 0, N(t.url)) {
		const n = t.preserveQueryParameters ?? !1;
		e.parseUrl(t.url, !0, n, this._url);
	}
	return N(t.queryParameters) && (e._queryParameters = ae(t.queryParameters, e.queryParameters)), N(t.templateValues) && (e._templateValues = ae(t.templateValues, e.templateValues)), N(t.headers) && (e.headers = ae(t.headers, e.headers)), N(t.proxy) && (e.proxy = t.proxy), N(t.request) && (e.request = t.request), N(t.retryCallback) && (e.retryCallback = t.retryCallback), N(t.retryAttempts) && (e.retryAttempts = t.retryAttempts), e;
}, Fe.prototype.retryOnError = function(t) {
	const e = this.retryCallback;
	if ("function" != typeof e || this._retryCount >= this.retryAttempts) return Promise.resolve(!1);
	const n = this;
	return Promise.resolve(e(this, t)).then(function(t) {
		return ++n._retryCount, t;
	});
}, Fe.prototype.clone = function(t) {
	return N(t) ? (t._url = this._url, t._queryParameters = se(this._queryParameters), t._templateValues = se(this._templateValues), t.headers = se(this.headers), t.proxy = this.proxy, t.retryCallback = this.retryCallback, t.retryAttempts = this.retryAttempts, t._retryCount = 0, t.request = this.request.clone(), t) : new Fe({
		url: this._url,
		queryParameters: this.queryParameters,
		templateValues: this.templateValues,
		headers: this.headers,
		proxy: this.proxy,
		retryCallback: this.retryCallback,
		retryAttempts: this.retryAttempts,
		request: this.request.clone(),
		parseUrl: !1,
		credits: N(this.credits) ? this.credits.slice() : void 0
	});
}, Fe.prototype.getBaseUri = function(t) {
	return function(t, e) {
		if (!N(t)) throw new v("uri is required.");
		let n = "";
		const r = t.lastIndexOf("/");
		return -1 !== r && (n = t.substring(0, r + 1)), e ? (0 !== (t = new ce.default(t)).query().length && (n += `?${t.query()}`), 0 !== t.fragment().length && (n += `#${t.fragment()}`), n) : n;
	}(this.getUrlComponent(t), t);
}, Fe.prototype.appendForwardSlash = function() {
	var t;
	this._url = (0 !== (t = this._url).length && "/" === t[t.length - 1] || (t = `${t}/`), t);
}, Fe.prototype.fetchArrayBuffer = function() {
	return this.fetch({ responseType: "arraybuffer" });
}, Fe.fetchArrayBuffer = function(t) {
	return new Fe(t).fetchArrayBuffer();
}, Fe.prototype.fetchBlob = function() {
	return this.fetch({ responseType: "blob" });
}, Fe.fetchBlob = function(t) {
	return new Fe(t).fetchBlob();
}, Fe.prototype.fetchImage = function(t) {
	const e = (t = t ?? I.EMPTY_OBJECT).preferImageBitmap ?? !1, n = t.preferBlob ?? !1, r = t.flipY ?? !1, i = t.skipColorSpaceConversion ?? !1;
	if (Ve(this.request), !je || this.isDataUri || this.isBlobUri || !this.hasHeaders && !n) return this._fetchImage({
		resource: this,
		flipY: r,
		skipColorSpaceConversion: i,
		preferImageBitmap: e
	});
	const o = this.fetchBlob();
	if (!N(o)) return;
	let s, a, u, c;
	return Fe.supportsImageBitmapOptions().then(function(t) {
		return s = t, a = s && e, o;
	}).then(function(t) {
		if (N(t)) return c = t, a ? Fe.createImageBitmapFromBlob(t, {
			flipY: r,
			premultiplyAlpha: !1,
			skipColorSpaceConversion: i
		}) : (u = new Fe({ url: window.URL.createObjectURL(t) }), u._fetchImage({
			flipY: r,
			skipColorSpaceConversion: i,
			preferImageBitmap: !1
		}));
	}).then(function(t) {
		if (N(t)) return t.blob = c, a || window.URL.revokeObjectURL(u.url), t;
	}).catch(function(t) {
		return N(u) && window.URL.revokeObjectURL(u.url), t.blob = c, Promise.reject(t);
	});
}, Fe.prototype._fetchImage = function(t) {
	const e = this, n = t.flipY, r = t.skipColorSpaceConversion, i = t.preferImageBitmap, o = e.request;
	o.url = e.url, o.requestFunction = function() {
		let t = !1;
		e.isDataUri || e.isBlobUri || (t = e.isCrossOriginUrl);
		const s = ue();
		return Fe._Implementations.createImage(o, t, s, n, r, i), s.promise;
	};
	const s = Pe.request(o);
	if (N(s)) return s.catch(function(t) {
		return o.state !== we.FAILED ? Promise.reject(t) : e.retryOnError(t).then(function(s) {
			return s ? (o.state = we.UNISSUED, o.deferred = void 0, e._fetchImage({
				flipY: n,
				skipColorSpaceConversion: r,
				preferImageBitmap: i
			})) : Promise.reject(t);
		});
	});
}, Fe.fetchImage = function(t) {
	return new Fe(t).fetchImage({
		flipY: t.flipY,
		skipColorSpaceConversion: t.skipColorSpaceConversion,
		preferBlob: t.preferBlob,
		preferImageBitmap: t.preferImageBitmap
	});
}, Fe.prototype.fetchText = function() {
	return this.fetch({ responseType: "text" });
}, Fe.fetchText = function(t) {
	return new Fe(t).fetchText();
}, Fe.prototype.fetchJson = function() {
	const t = this.fetch({
		responseType: "text",
		headers: { Accept: "application/json,*/*;q=0.01" }
	});
	if (N(t)) return t.then(function(t) {
		if (N(t)) return JSON.parse(t);
	});
}, Fe.fetchJson = function(t) {
	return new Fe(t).fetchJson();
}, Fe.prototype.fetchXML = function() {
	return this.fetch({
		responseType: "document",
		overrideMimeType: "text/xml"
	});
}, Fe.fetchXML = function(t) {
	return new Fe(t).fetchXML();
}, Fe.prototype.fetchJsonp = function(t) {
	let e;
	t = t ?? "callback", Ve(this.request);
	do
		e = `loadJsonp${D.nextRandomNumber().toString().substring(2, 8)}`;
	while (N(window[e]));
	return We(this, t, e);
}, Fe.fetchJsonp = function(t) {
	return new Fe(t).fetchJsonp(t.callbackParameterName);
}, Fe.prototype._makeRequest = function(t) {
	const e = this;
	Ve(e.request);
	const n = e.request, r = e.url;
	n.url = r, n.requestFunction = function() {
		const i = t.responseType, o = ae(t.headers, e.headers), s = t.overrideMimeType, a = t.method, u = t.data, c = ue(), l = Fe._Implementations.loadWithXhr(r, i, a, u, o, c, s);
		return N(l) && N(l.abort) && (n.cancelFunction = function() {
			l.abort();
		}), c.promise;
	};
	const i = Pe.request(n);
	if (N(i)) return i.then(function(t) {
		return n.cancelFunction = void 0, t;
	}).catch(function(r) {
		return n.cancelFunction = void 0, n.state !== we.FAILED ? Promise.reject(r) : e.retryOnError(r).then(function(i) {
			return i ? (n.state = we.UNISSUED, n.deferred = void 0, e.fetch(t)) : Promise.reject(r);
		});
	});
};
const He = /^data:(.*?)(;base64)?,(.*)$/;
function Xe(t, e) {
	const n = decodeURIComponent(e);
	return t ? atob(n) : n;
}
function Ye(t, e) {
	const n = Xe(t, e), r = new ArrayBuffer(n.length), i = new Uint8Array(r);
	for (let o = 0; o < n.length; o++) i[o] = n.charCodeAt(o);
	return r;
}
Fe.prototype.fetch = function(t) {
	return (t = Be(t, {})).method = "GET", this._makeRequest(t);
}, Fe.fetch = function(t) {
	return new Fe(t).fetch({
		responseType: t.responseType,
		overrideMimeType: t.overrideMimeType
	});
}, Fe.prototype.delete = function(t) {
	return (t = Be(t, {})).method = "DELETE", this._makeRequest(t);
}, Fe.delete = function(t) {
	return new Fe(t).delete({
		responseType: t.responseType,
		overrideMimeType: t.overrideMimeType,
		data: t.data
	});
}, Fe.prototype.head = function(t) {
	return (t = Be(t, {})).method = "HEAD", this._makeRequest(t);
}, Fe.head = function(t) {
	return new Fe(t).head({
		responseType: t.responseType,
		overrideMimeType: t.overrideMimeType
	});
}, Fe.prototype.options = function(t) {
	return (t = Be(t, {})).method = "OPTIONS", this._makeRequest(t);
}, Fe.options = function(t) {
	return new Fe(t).options({
		responseType: t.responseType,
		overrideMimeType: t.overrideMimeType
	});
}, Fe.prototype.post = function(t, e) {
	return M.defined("data", t), (e = Be(e, {})).method = "POST", e.data = t, this._makeRequest(e);
}, Fe.post = function(t) {
	return new Fe(t).post(t.data, {
		responseType: t.responseType,
		overrideMimeType: t.overrideMimeType
	});
}, Fe.prototype.put = function(t, e) {
	return M.defined("data", t), (e = Be(e, {})).method = "PUT", e.data = t, this._makeRequest(e);
}, Fe.put = function(t) {
	return new Fe(t).put(t.data, {
		responseType: t.responseType,
		overrideMimeType: t.overrideMimeType
	});
}, Fe.prototype.patch = function(t, e) {
	return M.defined("data", t), (e = Be(e, {})).method = "PATCH", e.data = t, this._makeRequest(e);
}, Fe.patch = function(t) {
	return new Fe(t).patch(t.data, {
		responseType: t.responseType,
		overrideMimeType: t.overrideMimeType
	});
}, Fe._Implementations = {}, Fe._Implementations.loadImageElement = function(t, e, n) {
	const r = new Image();
	r.onload = function() {
		0 === r.naturalWidth && 0 === r.naturalHeight && 0 === r.width && 0 === r.height && (r.width = 300, r.height = 150), n.resolve(r);
	}, r.onerror = function(t) {
		n.reject(t);
	}, e && (De.contains(t) ? r.crossOrigin = "use-credentials" : r.crossOrigin = ""), r.src = t;
}, Fe._Implementations.createImage = function(t, e, n, r, i, o, s) {
	const a = t.url;
	Fe.supportsImageBitmapOptions().then(function(u) {
		if (!u || !o) return void Fe._Implementations.loadImageElement(a, e, n);
		const c = ue(), l = Fe._Implementations.loadWithXhr(a, "blob", "GET", void 0, s, c, void 0, void 0, void 0);
		return N(l) && N(l.abort) && (t.cancelFunction = function() {
			l.abort();
		}), c.promise.then(function(t) {
			if (N(t)) return Fe.createImageBitmapFromBlob(t, {
				flipY: r,
				premultiplyAlpha: !1,
				skipColorSpaceConversion: i
			});
			n.reject(new Ae(`Successfully retrieved ${a} but it contained no content.`));
		}).then(function(t) {
			n.resolve(t);
		});
	}).catch(function(t) {
		n.reject(t);
	});
}, Fe.createImageBitmapFromBlob = function(t, e) {
	return M.defined("options", e), M.typeOf.bool("options.flipY", e.flipY), M.typeOf.bool("options.premultiplyAlpha", e.premultiplyAlpha), M.typeOf.bool("options.skipColorSpaceConversion", e.skipColorSpaceConversion), createImageBitmap(t, {
		imageOrientation: e.flipY ? "flipY" : "none",
		premultiplyAlpha: e.premultiplyAlpha ? "premultiply" : "none",
		colorSpaceConversion: e.skipColorSpaceConversion ? "none" : "default"
	});
};
const $e = "undefined" == typeof XMLHttpRequest;
function Ze(t) {
	t = t ?? I.EMPTY_OBJECT, this._dates = void 0, this._samples = void 0, this._dateColumn = -1, this._xPoleWanderRadiansColumn = -1, this._yPoleWanderRadiansColumn = -1, this._ut1MinusUtcSecondsColumn = -1, this._xCelestialPoleOffsetRadiansColumn = -1, this._yCelestialPoleOffsetRadiansColumn = -1, this._taiMinusUtcSecondsColumn = -1, this._columnCount = 0, this._lastIndex = -1, this._addNewLeapSeconds = t.addNewLeapSeconds ?? !0, N(t.data) ? Ke(this, t.data) : Ke(this, {
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
function Qe(t, e) {
	return te.compare(t.julianDate, e);
}
function Ke(t, e) {
	if (!N(e.columnNames)) throw new Ae("Error in loaded EOP data: The columnNames property is required.");
	if (!N(e.samples)) throw new Ae("Error in loaded EOP data: The samples property is required.");
	const n = e.columnNames.indexOf("modifiedJulianDateUtc"), r = e.columnNames.indexOf("xPoleWanderRadians"), i = e.columnNames.indexOf("yPoleWanderRadians"), o = e.columnNames.indexOf("ut1MinusUtcSeconds"), s = e.columnNames.indexOf("xCelestialPoleOffsetRadians"), a = e.columnNames.indexOf("yCelestialPoleOffsetRadians"), u = e.columnNames.indexOf("taiMinusUtcSeconds");
	if (n < 0 || r < 0 || i < 0 || o < 0 || s < 0 || a < 0 || u < 0) throw new Ae("Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns");
	const c = t._samples = e.samples, l = t._dates = [];
	let h;
	t._dateColumn = n, t._xPoleWanderRadiansColumn = r, t._yPoleWanderRadiansColumn = i, t._ut1MinusUtcSecondsColumn = o, t._xCelestialPoleOffsetRadiansColumn = s, t._yCelestialPoleOffsetRadiansColumn = a, t._taiMinusUtcSecondsColumn = u, t._columnCount = e.columnNames.length, t._lastIndex = void 0;
	const f = t._addNewLeapSeconds;
	for (let p = 0, d = c.length; p < d; p += t._columnCount) {
		const t = c[p + n], e = c[p + u], r = new te(t + qt.MODIFIED_JULIAN_DATE_DIFFERENCE, e, Ut.TAI);
		if (l.push(r), f) {
			if (e !== h && N(h)) {
				const t = te.leapSeconds, n = It(t, r, Qe);
				if (n < 0) {
					const i = new Ct(r, e);
					t.splice(~n, 0, i);
				}
			}
			h = e;
		}
	}
}
function Je(t, e, n, r, i) {
	const o = n * r;
	i.xPoleWander = e[o + t._xPoleWanderRadiansColumn], i.yPoleWander = e[o + t._yPoleWanderRadiansColumn], i.xPoleOffset = e[o + t._xCelestialPoleOffsetRadiansColumn], i.yPoleOffset = e[o + t._yCelestialPoleOffsetRadiansColumn], i.ut1MinusUtc = e[o + t._ut1MinusUtcSecondsColumn];
}
function tn(t, e, n) {
	return e + t * (n - e);
}
function en(t, e, n, r, i, o, s) {
	const a = t._columnCount;
	if (o > e.length - 1) return s.xPoleWander = 0, s.yPoleWander = 0, s.xPoleOffset = 0, s.yPoleOffset = 0, s.ut1MinusUtc = 0, s;
	const u = e[i], c = e[o];
	if (u.equals(c) || r.equals(u)) return Je(t, n, i, a, s), s;
	if (r.equals(c)) return Je(t, n, o, a, s), s;
	const l = te.secondsDifference(r, u) / te.secondsDifference(c, u), h = i * a, f = o * a;
	let p = n[h + t._ut1MinusUtcSecondsColumn], d = n[f + t._ut1MinusUtcSecondsColumn];
	const m = d - p;
	if (m > .5 || m < -.5) {
		const e = n[h + t._taiMinusUtcSecondsColumn], i = n[f + t._taiMinusUtcSecondsColumn];
		e !== i && (c.equals(r) ? p = d : d -= i - e);
	}
	return s.xPoleWander = tn(l, n[h + t._xPoleWanderRadiansColumn], n[f + t._xPoleWanderRadiansColumn]), s.yPoleWander = tn(l, n[h + t._yPoleWanderRadiansColumn], n[f + t._yPoleWanderRadiansColumn]), s.xPoleOffset = tn(l, n[h + t._xCelestialPoleOffsetRadiansColumn], n[f + t._xCelestialPoleOffsetRadiansColumn]), s.yPoleOffset = tn(l, n[h + t._yCelestialPoleOffsetRadiansColumn], n[f + t._yCelestialPoleOffsetRadiansColumn]), s.ut1MinusUtc = tn(l, p, d), s;
}
function nn(t, e, n) {
	this.heading = t ?? 0, this.pitch = e ?? 0, this.roll = n ?? 0;
}
Fe._Implementations.loadWithXhr = function(t, e, n, r, i, o, s) {
	const a = He.exec(t);
	if (null !== a) return void o.resolve(function(t, e) {
		e = e ?? "";
		const n = t[1], r = !!t[2], i = t[3];
		let o, s;
		switch (e) {
			case "":
			case "text": return Xe(r, i);
			case "arraybuffer": return Ye(r, i);
			case "blob": return o = Ye(r, i), new Blob([o], { type: n });
			case "document": return s = new DOMParser(), s.parseFromString(Xe(r, i), n);
			case "json": return JSON.parse(Xe(r, i));
			default: throw new v(`Unhandled responseType: ${e}`);
		}
	}(a, e));
	if ($e) return void function(t, e, n, r, i, o) {
		fetch(t, {
			method: n,
			headers: i
		}).then(async (t) => {
			if (!t.ok) {
				const e = {};
				t.headers.forEach((t, n) => {
					e[n] = t;
				}), o.reject(new Oe(t.status, t, e));
				return;
			}
			switch (e) {
				case "text":
					o.resolve(t.text());
					break;
				case "json":
					o.resolve(t.json());
					break;
				default: o.resolve(new Uint8Array(await t.arrayBuffer()).buffer);
			}
		}).catch(() => {
			o.reject(new Oe());
		});
	}(t, e, n, 0, i, o);
	const u = new XMLHttpRequest();
	if (De.contains(t) && (u.withCredentials = !0), u.open(n, t, !0), N(s) && N(u.overrideMimeType) && u.overrideMimeType(s), N(i)) for (const l in i) i.hasOwnProperty(l) && u.setRequestHeader(l, i[l]);
	N(e) && (u.responseType = e);
	let c = !1;
	return "string" == typeof t && (c = 0 === t.indexOf("file://") || "undefined" != typeof window && "file://" === window.location.origin), u.onload = function() {
		if ((u.status < 200 || u.status >= 300) && (!c || 0 !== u.status)) return void o.reject(new Oe(u.status, u.response, u.getAllResponseHeaders()));
		const t = u.response, r = u.responseType;
		if ("HEAD" === n || "OPTIONS" === n) {
			const t = u.getAllResponseHeaders().trim().split(/[\r\n]+/), e = {};
			t.forEach(function(t) {
				const n = t.split(": "), r = n.shift();
				e[r] = n.join(": ");
			}), o.resolve(e);
			return;
		}
		if (204 === u.status) o.resolve(void 0);
		else if (!N(t) || N(e) && r !== e) if ("json" === e && "string" == typeof t) try {
			o.resolve(JSON.parse(t));
		} catch (t) {
			o.reject(t);
		}
		else ("" === r || "document" === r) && N(u.responseXML) && u.responseXML.hasChildNodes() ? o.resolve(u.responseXML) : "" !== r && "text" !== r || !N(u.responseText) ? o.reject(new Ae("Invalid XMLHttpRequest response type.")) : o.resolve(u.responseText);
		else o.resolve(t);
	}, u.onerror = function(t) {
		o.reject(new Oe());
	}, u.send(r), u;
}, Fe._Implementations.loadAndExecuteScript = function(t, e, n) {
	return function(t) {
		const e = document.createElement("script");
		return e.async = !0, e.src = t, new Promise((t, n) => {
			window.crossOriginIsolated && e.setAttribute("crossorigin", "anonymous");
			const r = document.getElementsByTagName("head")[0];
			e.onload = function() {
				e.onload = void 0, r.removeChild(e), t();
			}, e.onerror = function(t) {
				n(t);
			}, r.appendChild(e);
		});
	}(t).catch(function(t) {
		n.reject(t);
	});
}, Fe._DefaultImplementations = {}, Fe._DefaultImplementations.createImage = Fe._Implementations.createImage, Fe._DefaultImplementations.loadWithXhr = Fe._Implementations.loadWithXhr, Fe._DefaultImplementations.loadAndExecuteScript = Fe._Implementations.loadAndExecuteScript, Fe.DEFAULT = Object.freeze(new Fe({ url: "undefined" == typeof document ? "" : document.location.href.split("?")[0] })), Ze.fromUrl = async function(t, e) {
	M.defined("url", t), e = e ?? I.EMPTY_OBJECT;
	const n = Fe.createIfNeeded(t);
	let r;
	try {
		r = await n.fetchJson();
	} catch (t) {
		throw new Ae(`An error occurred while retrieving the EOP data from the URL ${n.url}.`);
	}
	return new Ze({
		addNewLeapSeconds: e.addNewLeapSeconds,
		data: r
	});
}, Ze.NONE = Object.freeze({ compute: function(t, e) {
	return N(e) ? (e.xPoleWander = 0, e.yPoleWander = 0, e.xPoleOffset = 0, e.yPoleOffset = 0, e.ut1MinusUtc = 0) : e = new Nt(0, 0, 0, 0, 0), e;
} }), Ze.prototype.compute = function(t, e) {
	if (!N(this._samples)) return;
	if (N(e) || (e = new Nt(0, 0, 0, 0, 0)), 0 === this._samples.length) return e.xPoleWander = 0, e.yPoleWander = 0, e.xPoleOffset = 0, e.yPoleOffset = 0, e.ut1MinusUtc = 0, e;
	const n = this._dates, r = this._lastIndex;
	let i = 0, o = 0;
	if (N(r)) {
		const s = n[r], a = n[r + 1], u = te.lessThanOrEquals(s, t), c = !N(a), l = c || te.greaterThanOrEquals(a, t);
		if (u && l) return i = r, !c && a.equals(t) && ++i, o = i + 1, en(this, n, this._samples, t, i, o, e), e;
	}
	let s = It(n, t, te.compare, this._dateColumn);
	return s >= 0 ? (s < n.length - 1 && n[s + 1].equals(t) && ++s, i = s, o = s) : (o = ~s, i = o - 1, i < 0 && (i = 0)), this._lastIndex = i, en(this, n, this._samples, t, i, o, e), e;
}, nn.fromQuaternion = function(t, e) {
	if (!N(t)) throw new v("quaternion is required");
	N(e) || (e = new nn());
	const n = 2 * (t.w * t.y - t.z * t.x), r = 1 - 2 * (t.x * t.x + t.y * t.y), i = 2 * (t.w * t.x + t.y * t.z), o = 1 - 2 * (t.y * t.y + t.z * t.z), s = 2 * (t.w * t.z + t.x * t.y);
	return e.heading = -Math.atan2(s, o), e.roll = Math.atan2(i, r), e.pitch = -D.asinClamped(n), e;
}, nn.fromDegrees = function(t, e, n, r) {
	if (!N(t)) throw new v("heading is required");
	if (!N(e)) throw new v("pitch is required");
	if (!N(n)) throw new v("roll is required");
	return N(r) || (r = new nn()), r.heading = t * D.RADIANS_PER_DEGREE, r.pitch = e * D.RADIANS_PER_DEGREE, r.roll = n * D.RADIANS_PER_DEGREE, r;
}, nn.clone = function(t, e) {
	if (N(t)) return N(e) ? (e.heading = t.heading, e.pitch = t.pitch, e.roll = t.roll, e) : new nn(t.heading, t.pitch, t.roll);
}, nn.equals = function(t, e) {
	return t === e || N(t) && N(e) && t.heading === e.heading && t.pitch === e.pitch && t.roll === e.roll;
}, nn.equalsEpsilon = function(t, e, n, r) {
	return t === e || N(t) && N(e) && D.equalsEpsilon(t.heading, e.heading, n, r) && D.equalsEpsilon(t.pitch, e.pitch, n, r) && D.equalsEpsilon(t.roll, e.roll, n, r);
}, nn.prototype.clone = function(t) {
	return nn.clone(this, t);
}, nn.prototype.equals = function(t) {
	return nn.equals(this, t);
}, nn.prototype.equalsEpsilon = function(t, e, n) {
	return nn.equalsEpsilon(this, t, e, n);
}, nn.prototype.toString = function() {
	return `(${this.heading}, ${this.pitch}, ${this.roll})`;
};
const rn = /((?:.*\/)|^)Cesium\.js(?:\?|\#|$)/;
let on, sn, an;
function un(t) {
	return "undefined" == typeof document ? t : (N(on) || (on = document.createElement("a")), on.href = t, on.href);
}
function cn() {
	if (N(sn)) return sn;
	let t;
	if (t = "undefined" != typeof CESIUM_BASE_URL ? CESIUM_BASE_URL : N(import.meta.url) ? le(".", import.meta.url) : "object" == typeof define && N(define.amd) && !define.amd.toUrlUndefined && N(u.toUrl) ? le("..", fn("Core/buildModuleUrl.js")) : function() {
		const t = document.getElementsByTagName("script");
		for (let e = 0, n = t.length; e < n; ++e) {
			const n = t[e].getAttribute("src"), r = rn.exec(n);
			if (null !== r) return r[1];
		}
	}(), !N(t)) throw new v("Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.");
	return sn = new Fe({ url: un(t) }), sn.appendForwardSlash(), sn;
}
function ln(t) {
	return un(u.toUrl(`../${t}`));
}
function hn(t) {
	return cn().getDerivedResource({ url: t }).url;
}
function fn(t) {
	return N(an) || (an = "object" == typeof define && N(define.amd) && !define.amd.toUrlUndefined && N(u.toUrl) ? ln : hn), an(t);
}
function pn(t, e, n) {
	this.x = t, this.y = e, this.s = n;
}
function dn(t) {
	t = t ?? I.EMPTY_OBJECT, this._xysFileUrlTemplate = Fe.createIfNeeded(t.xysFileUrlTemplate), this._interpolationOrder = t.interpolationOrder ?? 9, this._sampleZeroJulianEphemerisDate = t.sampleZeroJulianEphemerisDate ?? 2442396.5, this._sampleZeroDateTT = new te(this._sampleZeroJulianEphemerisDate, 0, Ut.TAI), this._stepSizeDays = t.stepSizeDays ?? 1, this._samplesPerXysFile = t.samplesPerXysFile ?? 1e3, this._totalSamples = t.totalSamples ?? 27426, this._samples = new Array(3 * this._totalSamples), this._chunkDownloadsInProgress = [];
	const e = this._interpolationOrder, n = this._denominators = new Array(e + 1), r = this._xTable = new Array(e + 1), i = Math.pow(this._stepSizeDays, e);
	for (let o = 0; o <= e; ++o) {
		n[o] = i, r[o] = o * this._stepSizeDays;
		for (let t = 0; t <= e; ++t) t !== o && (n[o] *= o - t);
		n[o] = 1 / n[o];
	}
	this._work = new Array(e + 1), this._coef = new Array(e + 1);
}
fn._cesiumScriptRegex = rn, fn._buildModuleUrlFromBaseUrl = hn, fn._clearBaseResource = function() {
	sn = void 0;
}, fn.setBaseUrl = function(t) {
	sn = Fe.DEFAULT.getDerivedResource({ url: t });
}, fn.getCesiumBaseUrl = cn;
const mn = new te(0, 0, Ut.TAI);
function yn(t, e, n) {
	const r = mn;
	return r.dayNumber = e, r.secondsOfDay = n, te.daysDifference(r, t._sampleZeroDateTT);
}
function gn(t, e) {
	if (N(t._chunkDownloadsInProgress[e])) return t._chunkDownloadsInProgress[e];
	let n;
	const r = t._xysFileUrlTemplate;
	n = N(r) ? r.getDerivedResource({ templateValues: { 0: e } }) : new Fe({ url: fn(`Assets/IAU2006_XYS/IAU2006_XYS_${e}.json`) });
	const i = async function(t, e, n) {
		try {
			const r = await t.fetchJson();
			n._updateChunkData(e, r);
		} catch (t) {}
	}(n, e, t);
	return t._chunkDownloadsInProgress[e] = i, i;
}
dn.prototype.preload = function(t, e, n, r) {
	const i = yn(this, t, e), o = yn(this, n, r);
	let s = i / this._stepSizeDays - this._interpolationOrder / 2 | 0;
	s < 0 && (s = 0);
	let a = o / this._stepSizeDays - this._interpolationOrder / 2 | 0 + this._interpolationOrder;
	a >= this._totalSamples && (a = this._totalSamples - 1);
	const u = s / this._samplesPerXysFile | 0, c = a / this._samplesPerXysFile | 0, l = [];
	for (let h = u; h <= c; ++h) l.push(gn(this, h));
	return Promise.all(l);
}, dn.prototype.computeXysRadians = function(t, e, n) {
	const r = yn(this, t, e);
	if (r < 0) return;
	const i = r / this._stepSizeDays | 0;
	if (i >= this._totalSamples) return;
	const o = this._interpolationOrder;
	let s = i - (o / 2 | 0);
	s < 0 && (s = 0);
	let a = s + o;
	a >= this._totalSamples && (a = this._totalSamples - 1, s = a - o, s < 0 && (s = 0));
	let u = !1;
	const c = this._samples;
	if (N(c[3 * s]) || (gn(this, s / this._samplesPerXysFile | 0), u = !0), N(c[3 * a]) || (gn(this, a / this._samplesPerXysFile | 0), u = !0), u) return;
	N(n) ? (n.x = 0, n.y = 0, n.s = 0) : n = new pn(0, 0, 0);
	const l = r - s * this._stepSizeDays, h = this._work, f = this._denominators, p = this._coef, d = this._xTable;
	let m, y;
	for (m = 0; m <= o; ++m) h[m] = l - d[m];
	for (m = 0; m <= o; ++m) {
		for (p[m] = 1, y = 0; y <= o; ++y) y !== m && (p[m] *= h[y]);
		p[m] *= f[m];
		let t = 3 * (s + m);
		n.x += p[m] * c[t++], n.y += p[m] * c[t++], n.s += p[m] * c[t];
	}
	return n;
}, dn.prototype._updateChunkData = function(t, { samples: e }) {
	this._chunkDownloadsInProgress[t] = void 0;
	const n = t * this._samplesPerXysFile * 3;
	for (let r = 0; r < e.length; ++r) this._samples[n + r] = e[r];
};
var wn = class t {
	constructor(t, e, n, r, i, o, s, a, u) {
		this[0] = t ?? 0, this[1] = r ?? 0, this[2] = s ?? 0, this[3] = e ?? 0, this[4] = i ?? 0, this[5] = a ?? 0, this[6] = n ?? 0, this[7] = o ?? 0, this[8] = u ?? 0;
	}
	static pack(t, e, n) {
		return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, e[n++] = t[0], e[n++] = t[1], e[n++] = t[2], e[n++] = t[3], e[n++] = t[4], e[n++] = t[5], e[n++] = t[6], e[n++] = t[7], e[n++] = t[8], e;
	}
	static unpack(e, n, r) {
		return M.defined("array", e), n = n ?? 0, N(r) || (r = new t()), r[0] = e[n++], r[1] = e[n++], r[2] = e[n++], r[3] = e[n++], r[4] = e[n++], r[5] = e[n++], r[6] = e[n++], r[7] = e[n++], r[8] = e[n++], r;
	}
	static packArray(e, n) {
		M.defined("array", e);
		const r = e.length, i = 9 * r;
		if (N(n)) {
			if (!Array.isArray(n) && n.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 9 elements");
			n.length !== i && (n.length = i);
		} else n = new Array(i);
		for (let o = 0; o < r; ++o) t.pack(e[o], n, 9 * o);
		return n;
	}
	static unpackArray(e, n) {
		if (M.defined("array", e), M.typeOf.number.greaterThanOrEquals("array.length", e.length, 9), e.length % 9 != 0) throw new v("array length must be a multiple of 9.");
		const r = e.length;
		N(n) ? n.length = r / 9 : n = new Array(r / 9);
		for (let i = 0; i < r; i += 9) {
			const r = i / 9;
			n[r] = t.unpack(e, i, n[r]);
		}
		return n;
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = e[7], n[8] = e[8], n) : new t(e[0], e[3], e[6], e[1], e[4], e[7], e[2], e[5], e[8]);
	}
	static fromColumnMajorArray(e, n) {
		return M.defined("values", e), t.clone(e, n);
	}
	static fromRowMajorArray(e, n) {
		return M.defined("values", e), N(n) ? (n[0] = e[0], n[1] = e[3], n[2] = e[6], n[3] = e[1], n[4] = e[4], n[5] = e[7], n[6] = e[2], n[7] = e[5], n[8] = e[8], n) : new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8]);
	}
	static fromQuaternion(e, n) {
		M.typeOf.object("quaternion", e);
		const r = e.x * e.x, i = e.x * e.y, o = e.x * e.z, s = e.x * e.w, a = e.y * e.y, u = e.y * e.z, c = e.y * e.w, l = e.z * e.z, h = e.z * e.w, f = e.w * e.w, p = r - a - l + f, d = 2 * (i - h), m = 2 * (o + c), y = 2 * (i + h), g = -r + a - l + f, w = 2 * (u - s), E = 2 * (o - c), _ = 2 * (u + s), O = -r - a + l + f;
		return N(n) ? (n[0] = p, n[1] = y, n[2] = E, n[3] = d, n[4] = g, n[5] = _, n[6] = m, n[7] = w, n[8] = O, n) : new t(p, d, m, y, g, w, E, _, O);
	}
	static fromHeadingPitchRoll(e, n) {
		M.typeOf.object("headingPitchRoll", e);
		const r = Math.cos(-e.pitch), i = Math.cos(-e.heading), o = Math.cos(e.roll), s = Math.sin(-e.pitch), a = Math.sin(-e.heading), u = Math.sin(e.roll), c = r * i, l = -o * a + u * s * i, h = u * a + o * s * i, f = r * a, p = o * i + u * s * a, d = -u * i + o * s * a, m = -s, y = u * r, g = o * r;
		return N(n) ? (n[0] = c, n[1] = f, n[2] = m, n[3] = l, n[4] = p, n[5] = y, n[6] = h, n[7] = d, n[8] = g, n) : new t(c, l, h, f, p, d, m, y, g);
	}
	static fromScale(e, n) {
		return M.typeOf.object("scale", e), N(n) ? (n[0] = e.x, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = e.y, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = e.z, n) : new t(e.x, 0, 0, 0, e.y, 0, 0, 0, e.z);
	}
	static fromUniformScale(e, n) {
		return M.typeOf.number("scale", e), N(n) ? (n[0] = e, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = e, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = e, n) : new t(e, 0, 0, 0, e, 0, 0, 0, e);
	}
	static fromCrossProduct(e, n) {
		return M.typeOf.object("vector", e), N(n) ? (n[0] = 0, n[1] = e.z, n[2] = -e.y, n[3] = -e.z, n[4] = 0, n[5] = e.x, n[6] = e.y, n[7] = -e.x, n[8] = 0, n) : new t(0, -e.z, e.y, e.z, 0, -e.x, -e.y, e.x, 0);
	}
	static fromRotationX(e, n) {
		M.typeOf.number("angle", e);
		const r = Math.cos(e), i = Math.sin(e);
		return N(n) ? (n[0] = 1, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = r, n[5] = i, n[6] = 0, n[7] = -i, n[8] = r, n) : new t(1, 0, 0, 0, r, -i, 0, i, r);
	}
	static fromRotationY(e, n) {
		M.typeOf.number("angle", e);
		const r = Math.cos(e), i = Math.sin(e);
		return N(n) ? (n[0] = r, n[1] = 0, n[2] = -i, n[3] = 0, n[4] = 1, n[5] = 0, n[6] = i, n[7] = 0, n[8] = r, n) : new t(r, 0, i, 0, 1, 0, -i, 0, r);
	}
	static fromRotationZ(e, n) {
		M.typeOf.number("angle", e);
		const r = Math.cos(e), i = Math.sin(e);
		return N(n) ? (n[0] = r, n[1] = i, n[2] = 0, n[3] = -i, n[4] = r, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = 1, n) : new t(r, -i, 0, i, r, 0, 0, 0, 1);
	}
	static toArray(t, e) {
		return M.typeOf.object("matrix", t), N(e) ? (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e) : [
			t[0],
			t[1],
			t[2],
			t[3],
			t[4],
			t[5],
			t[6],
			t[7],
			t[8]
		];
	}
	static getElementIndex(t, e) {
		return M.typeOf.number.greaterThanOrEquals("row", e, 0), M.typeOf.number.lessThanOrEquals("row", e, 2), M.typeOf.number.greaterThanOrEquals("column", t, 0), M.typeOf.number.lessThanOrEquals("column", t, 2), 3 * t + e;
	}
	static getColumn(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.number.greaterThanOrEquals("index", e, 0), M.typeOf.number.lessThanOrEquals("index", e, 2), M.typeOf.object("result", n);
		const r = 3 * e, i = t[r], o = t[r + 1], s = t[r + 2];
		return n.x = i, n.y = o, n.z = s, n;
	}
	static setColumn(e, n, r, i) {
		M.typeOf.object("matrix", e), M.typeOf.number.greaterThanOrEquals("index", n, 0), M.typeOf.number.lessThanOrEquals("index", n, 2), M.typeOf.object("cartesian", r), M.typeOf.object("result", i);
		const o = 3 * n;
		return (i = t.clone(e, i))[o] = r.x, i[o + 1] = r.y, i[o + 2] = r.z, i;
	}
	static getRow(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.number.greaterThanOrEquals("index", e, 0), M.typeOf.number.lessThanOrEquals("index", e, 2), M.typeOf.object("result", n);
		const r = t[e], i = t[e + 3], o = t[e + 6];
		return n.x = r, n.y = i, n.z = o, n;
	}
	static setRow(e, n, r, i) {
		return M.typeOf.object("matrix", e), M.typeOf.number.greaterThanOrEquals("index", n, 0), M.typeOf.number.lessThanOrEquals("index", n, 2), M.typeOf.object("cartesian", r), M.typeOf.object("result", i), (i = t.clone(e, i))[n] = r.x, i[n + 3] = r.y, i[n + 6] = r.z, i;
	}
	static setScale(e, n, r) {
		M.typeOf.object("matrix", e), M.typeOf.object("scale", n), M.typeOf.object("result", r);
		const i = t.getScale(e, En), o = n.x / i.x, s = n.y / i.y, a = n.z / i.z;
		return r[0] = e[0] * o, r[1] = e[1] * o, r[2] = e[2] * o, r[3] = e[3] * s, r[4] = e[4] * s, r[5] = e[5] * s, r[6] = e[6] * a, r[7] = e[7] * a, r[8] = e[8] * a, r;
	}
	static setUniformScale(e, n, r) {
		M.typeOf.object("matrix", e), M.typeOf.number("scale", n), M.typeOf.object("result", r);
		const i = t.getScale(e, _n), o = n / i.x, s = n / i.y, a = n / i.z;
		return r[0] = e[0] * o, r[1] = e[1] * o, r[2] = e[2] * o, r[3] = e[3] * s, r[4] = e[4] * s, r[5] = e[5] * s, r[6] = e[6] * a, r[7] = e[7] * a, r[8] = e[8] * a, r;
	}
	static getScale(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e.x = H.magnitude(H.fromElements(t[0], t[1], t[2], On)), e.y = H.magnitude(H.fromElements(t[3], t[4], t[5], On)), e.z = H.magnitude(H.fromElements(t[6], t[7], t[8], On)), e;
	}
	static getMaximumScale(e) {
		return t.getScale(e, bn), H.maximumComponent(bn);
	}
	static setRotation(e, n, r) {
		M.typeOf.object("matrix", e), M.typeOf.object("result", r);
		const i = t.getScale(e, Tn);
		return r[0] = n[0] * i.x, r[1] = n[1] * i.x, r[2] = n[2] * i.x, r[3] = n[3] * i.y, r[4] = n[4] * i.y, r[5] = n[5] * i.y, r[6] = n[6] * i.z, r[7] = n[7] * i.z, r[8] = n[8] * i.z, r;
	}
	static getRotation(e, n) {
		M.typeOf.object("matrix", e), M.typeOf.object("result", n);
		const r = t.getScale(e, An);
		return n[0] = e[0] / r.x, n[1] = e[1] / r.x, n[2] = e[2] / r.x, n[3] = e[3] / r.y, n[4] = e[4] / r.y, n[5] = e[5] / r.y, n[6] = e[6] / r.z, n[7] = e[7] / r.z, n[8] = e[8] / r.z, n;
	}
	static multiply(t, e, n) {
		M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n);
		const r = t[0] * e[0] + t[3] * e[1] + t[6] * e[2], i = t[1] * e[0] + t[4] * e[1] + t[7] * e[2], o = t[2] * e[0] + t[5] * e[1] + t[8] * e[2], s = t[0] * e[3] + t[3] * e[4] + t[6] * e[5], a = t[1] * e[3] + t[4] * e[4] + t[7] * e[5], u = t[2] * e[3] + t[5] * e[4] + t[8] * e[5], c = t[0] * e[6] + t[3] * e[7] + t[6] * e[8], l = t[1] * e[6] + t[4] * e[7] + t[7] * e[8], h = t[2] * e[6] + t[5] * e[7] + t[8] * e[8];
		return n[0] = r, n[1] = i, n[2] = o, n[3] = s, n[4] = a, n[5] = u, n[6] = c, n[7] = l, n[8] = h, n;
	}
	static add(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n[0] = t[0] + e[0], n[1] = t[1] + e[1], n[2] = t[2] + e[2], n[3] = t[3] + e[3], n[4] = t[4] + e[4], n[5] = t[5] + e[5], n[6] = t[6] + e[6], n[7] = t[7] + e[7], n[8] = t[8] + e[8], n;
	}
	static subtract(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n[0] = t[0] - e[0], n[1] = t[1] - e[1], n[2] = t[2] - e[2], n[3] = t[3] - e[3], n[4] = t[4] - e[4], n[5] = t[5] - e[5], n[6] = t[6] - e[6], n[7] = t[7] - e[7], n[8] = t[8] - e[8], n;
	}
	static multiplyByVector(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = e.x, i = e.y, o = e.z, s = t[0] * r + t[3] * i + t[6] * o, a = t[1] * r + t[4] * i + t[7] * o, u = t[2] * r + t[5] * i + t[8] * o;
		return n.x = s, n.y = a, n.z = u, n;
	}
	static multiplyByScalar(t, e, n) {
		return M.typeOf.object("matrix", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n[0] = t[0] * e, n[1] = t[1] * e, n[2] = t[2] * e, n[3] = t[3] * e, n[4] = t[4] * e, n[5] = t[5] * e, n[6] = t[6] * e, n[7] = t[7] * e, n[8] = t[8] * e, n;
	}
	static multiplyByScale(t, e, n) {
		return M.typeOf.object("matrix", t), M.typeOf.object("scale", e), M.typeOf.object("result", n), n[0] = t[0] * e.x, n[1] = t[1] * e.x, n[2] = t[2] * e.x, n[3] = t[3] * e.y, n[4] = t[4] * e.y, n[5] = t[5] * e.y, n[6] = t[6] * e.z, n[7] = t[7] * e.z, n[8] = t[8] * e.z, n;
	}
	static multiplyByUniformScale(t, e, n) {
		return M.typeOf.object("matrix", t), M.typeOf.number("scale", e), M.typeOf.object("result", n), n[0] = t[0] * e, n[1] = t[1] * e, n[2] = t[2] * e, n[3] = t[3] * e, n[4] = t[4] * e, n[5] = t[5] * e, n[6] = t[6] * e, n[7] = t[7] * e, n[8] = t[8] * e, n;
	}
	static negate(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = -t[3], e[4] = -t[4], e[5] = -t[5], e[6] = -t[6], e[7] = -t[7], e[8] = -t[8], e;
	}
	static transpose(t, e) {
		M.typeOf.object("matrix", t), M.typeOf.object("result", e);
		const n = t[0], r = t[3], i = t[6], o = t[1], s = t[4], a = t[7], u = t[2], c = t[5], l = t[8];
		return e[0] = n, e[1] = r, e[2] = i, e[3] = o, e[4] = s, e[5] = a, e[6] = u, e[7] = c, e[8] = l, e;
	}
	static computeEigenDecomposition(e, n) {
		M.typeOf.object("matrix", e);
		const r = D.EPSILON20;
		let i = 0, o = 0;
		N(n) || (n = {});
		const s = n.unitary = t.clone(t.IDENTITY, n.unitary), a = n.diagonal = t.clone(e, n.diagonal), u = r * function(t) {
			let e = 0;
			for (let n = 0; n < 9; ++n) {
				const r = t[n];
				e += r * r;
			}
			return Math.sqrt(e);
		}(a);
		for (; o < 10 && vn(a) > u;) Mn(a, xn), t.transpose(xn, Rn), t.multiply(a, xn, a), t.multiply(Rn, a, a), t.multiply(s, xn, s), ++i > 2 && (++o, i = 0);
		return n;
	}
	static abs(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e[0] = Math.abs(t[0]), e[1] = Math.abs(t[1]), e[2] = Math.abs(t[2]), e[3] = Math.abs(t[3]), e[4] = Math.abs(t[4]), e[5] = Math.abs(t[5]), e[6] = Math.abs(t[6]), e[7] = Math.abs(t[7]), e[8] = Math.abs(t[8]), e;
	}
	static determinant(t) {
		M.typeOf.object("matrix", t);
		const e = t[0], n = t[3], r = t[6], i = t[1], o = t[4], s = t[7], a = t[2], u = t[5], c = t[8];
		return e * (o * c - u * s) + i * (u * r - n * c) + a * (n * s - o * r);
	}
	static inverse(e, n) {
		M.typeOf.object("matrix", e), M.typeOf.object("result", n);
		const r = e[0], i = e[1], o = e[2], s = e[3], a = e[4], u = e[5], c = e[6], l = e[7], h = e[8], f = t.determinant(e);
		if (Math.abs(f) <= D.EPSILON15) throw new v("matrix is not invertible");
		n[0] = a * h - l * u, n[1] = l * o - i * h, n[2] = i * u - a * o, n[3] = c * u - s * h, n[4] = r * h - c * o, n[5] = s * o - r * u, n[6] = s * l - c * a, n[7] = c * i - r * l, n[8] = r * a - s * i;
		const p = 1 / f;
		return t.multiplyByScalar(n, p, n);
	}
	static inverseTranspose(e, n) {
		return M.typeOf.object("matrix", e), M.typeOf.object("result", n), t.inverse(t.transpose(e, Sn), n);
	}
	static equals(t, e) {
		return t === e || N(t) && N(e) && t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8];
	}
	static equalsEpsilon(t, e, n) {
		return n = n ?? 0, t === e || N(t) && N(e) && Math.abs(t[0] - e[0]) <= n && Math.abs(t[1] - e[1]) <= n && Math.abs(t[2] - e[2]) <= n && Math.abs(t[3] - e[3]) <= n && Math.abs(t[4] - e[4]) <= n && Math.abs(t[5] - e[5]) <= n && Math.abs(t[6] - e[6]) <= n && Math.abs(t[7] - e[7]) <= n && Math.abs(t[8] - e[8]) <= n;
	}
	get length() {
		return t.packedLength;
	}
	clone(e) {
		return t.clone(this, e);
	}
	equals(e) {
		return t.equals(this, e);
	}
	static equalsArray(t, e, n) {
		return t[0] === e[n] && t[1] === e[n + 1] && t[2] === e[n + 2] && t[3] === e[n + 3] && t[4] === e[n + 4] && t[5] === e[n + 5] && t[6] === e[n + 6] && t[7] === e[n + 7] && t[8] === e[n + 8];
	}
	equalsEpsilon(e, n) {
		return t.equalsEpsilon(this, e, n);
	}
	toString() {
		return `(${this[0]}, ${this[3]}, ${this[6]})\n(${this[1]}, ${this[4]}, ${this[7]})\n(${this[2]}, ${this[5]}, ${this[8]})`;
	}
};
wn.packedLength = 9, wn.fromArray = wn.unpack, wn.IDENTITY = Object.freeze(new wn(1, 0, 0, 0, 1, 0, 0, 0, 1)), wn.ZERO = Object.freeze(new wn(0, 0, 0, 0, 0, 0, 0, 0, 0)), wn.COLUMN0ROW0 = 0, wn.COLUMN0ROW1 = 1, wn.COLUMN0ROW2 = 2, wn.COLUMN1ROW0 = 3, wn.COLUMN1ROW1 = 4, wn.COLUMN1ROW2 = 5, wn.COLUMN2ROW0 = 6, wn.COLUMN2ROW1 = 7, wn.COLUMN2ROW2 = 8;
const En = new H(), _n = new H(), On = new H(), bn = new H(), Tn = new H(), An = new H(), xn = new wn(), Rn = new wn(), Sn = new wn(), In = [
	1,
	0,
	0
], Nn = [
	2,
	2,
	1
];
function vn(t) {
	let e = 0;
	for (let n = 0; n < 3; ++n) {
		const r = t[wn.getElementIndex(Nn[n], In[n])];
		e += 2 * r * r;
	}
	return Math.sqrt(e);
}
function Mn(t, e) {
	const n = D.EPSILON15;
	let r = 0, i = 1;
	for (let c = 0; c < 3; ++c) {
		const e = Math.abs(t[wn.getElementIndex(Nn[c], In[c])]);
		e > r && (i = c, r = e);
	}
	let o = 1, s = 0;
	const a = In[i], u = Nn[i];
	if (Math.abs(t[wn.getElementIndex(u, a)]) > n) {
		const e = (t[wn.getElementIndex(u, u)] - t[wn.getElementIndex(a, a)]) / 2 / t[wn.getElementIndex(u, a)];
		let n;
		n = e < 0 ? -1 / (-e + Math.sqrt(1 + e * e)) : 1 / (e + Math.sqrt(1 + e * e)), o = 1 / Math.sqrt(1 + n * n), s = n * o;
	}
	return (e = wn.clone(wn.IDENTITY, e))[wn.getElementIndex(a, a)] = e[wn.getElementIndex(u, u)] = o, e[wn.getElementIndex(u, a)] = s, e[wn.getElementIndex(a, u)] = -s, e;
}
var Pn = class t {
	constructor(t, e, n, r, i, o, s, a, u, c, l, h, f, p, d, m) {
		this[0] = t ?? 0, this[1] = i ?? 0, this[2] = u ?? 0, this[3] = f ?? 0, this[4] = e ?? 0, this[5] = o ?? 0, this[6] = c ?? 0, this[7] = p ?? 0, this[8] = n ?? 0, this[9] = s ?? 0, this[10] = l ?? 0, this[11] = d ?? 0, this[12] = r ?? 0, this[13] = a ?? 0, this[14] = h ?? 0, this[15] = m ?? 0;
	}
	static pack(t, e, n) {
		return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, e[n++] = t[0], e[n++] = t[1], e[n++] = t[2], e[n++] = t[3], e[n++] = t[4], e[n++] = t[5], e[n++] = t[6], e[n++] = t[7], e[n++] = t[8], e[n++] = t[9], e[n++] = t[10], e[n++] = t[11], e[n++] = t[12], e[n++] = t[13], e[n++] = t[14], e[n] = t[15], e;
	}
	static unpack(e, n, r) {
		return M.defined("array", e), n = n ?? 0, N(r) || (r = new t()), r[0] = e[n++], r[1] = e[n++], r[2] = e[n++], r[3] = e[n++], r[4] = e[n++], r[5] = e[n++], r[6] = e[n++], r[7] = e[n++], r[8] = e[n++], r[9] = e[n++], r[10] = e[n++], r[11] = e[n++], r[12] = e[n++], r[13] = e[n++], r[14] = e[n++], r[15] = e[n], r;
	}
	static packArray(e, n) {
		M.defined("array", e);
		const r = e.length, i = 16 * r;
		if (N(n)) {
			if (!Array.isArray(n) && n.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 16 elements");
			n.length !== i && (n.length = i);
		} else n = new Array(i);
		for (let o = 0; o < r; ++o) t.pack(e[o], n, 16 * o);
		return n;
	}
	static unpackArray(e, n) {
		if (M.defined("array", e), M.typeOf.number.greaterThanOrEquals("array.length", e.length, 16), e.length % 16 != 0) throw new v("array length must be a multiple of 16.");
		const r = e.length;
		N(n) ? n.length = r / 16 : n = new Array(r / 16);
		for (let i = 0; i < r; i += 16) {
			const r = i / 16;
			n[r] = t.unpack(e, i, n[r]);
		}
		return n;
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n[4] = e[4], n[5] = e[5], n[6] = e[6], n[7] = e[7], n[8] = e[8], n[9] = e[9], n[10] = e[10], n[11] = e[11], n[12] = e[12], n[13] = e[13], n[14] = e[14], n[15] = e[15], n) : new t(e[0], e[4], e[8], e[12], e[1], e[5], e[9], e[13], e[2], e[6], e[10], e[14], e[3], e[7], e[11], e[15]);
	}
	static fromColumnMajorArray(e, n) {
		return M.defined("values", e), t.clone(e, n);
	}
	static fromRowMajorArray(e, n) {
		return M.defined("values", e), N(n) ? (n[0] = e[0], n[1] = e[4], n[2] = e[8], n[3] = e[12], n[4] = e[1], n[5] = e[5], n[6] = e[9], n[7] = e[13], n[8] = e[2], n[9] = e[6], n[10] = e[10], n[11] = e[14], n[12] = e[3], n[13] = e[7], n[14] = e[11], n[15] = e[15], n) : new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15]);
	}
	static fromRotationTranslation(e, n, r) {
		return M.typeOf.object("rotation", e), n = n ?? H.ZERO, N(r) ? (r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = 0, r[4] = e[3], r[5] = e[4], r[6] = e[5], r[7] = 0, r[8] = e[6], r[9] = e[7], r[10] = e[8], r[11] = 0, r[12] = n.x, r[13] = n.y, r[14] = n.z, r[15] = 1, r) : new t(e[0], e[3], e[6], n.x, e[1], e[4], e[7], n.y, e[2], e[5], e[8], n.z, 0, 0, 0, 1);
	}
	static fromTranslationQuaternionRotationScale(e, n, r, i) {
		M.typeOf.object("translation", e), M.typeOf.object("rotation", n), M.typeOf.object("scale", r), N(i) || (i = new t());
		const o = r.x, s = r.y, a = r.z, u = n.x * n.x, c = n.x * n.y, l = n.x * n.z, h = n.x * n.w, f = n.y * n.y, p = n.y * n.z, d = n.y * n.w, m = n.z * n.z, y = n.z * n.w, g = n.w * n.w, w = u - f - m + g, E = 2 * (c - y), _ = 2 * (l + d), O = 2 * (c + y), b = -u + f - m + g, T = 2 * (p - h), A = 2 * (l - d), x = 2 * (p + h), R = -u - f + m + g;
		return i[0] = w * o, i[1] = O * o, i[2] = A * o, i[3] = 0, i[4] = E * s, i[5] = b * s, i[6] = x * s, i[7] = 0, i[8] = _ * a, i[9] = T * a, i[10] = R * a, i[11] = 0, i[12] = e.x, i[13] = e.y, i[14] = e.z, i[15] = 1, i;
	}
	static fromTranslationRotationScale(e, n) {
		return M.typeOf.object("translationRotationScale", e), t.fromTranslationQuaternionRotationScale(e.translation, e.rotation, e.scale, n);
	}
	static fromTranslation(e, n) {
		return M.typeOf.object("translation", e), t.fromRotationTranslation(wn.IDENTITY, e, n);
	}
	static fromScale(e, n) {
		return M.typeOf.object("scale", e), N(n) ? (n[0] = e.x, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = e.y, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = e.z, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n) : new t(e.x, 0, 0, 0, 0, e.y, 0, 0, 0, 0, e.z, 0, 0, 0, 0, 1);
	}
	static fromUniformScale(e, n) {
		return M.typeOf.number("scale", e), N(n) ? (n[0] = e, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = e, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = e, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n) : new t(e, 0, 0, 0, 0, e, 0, 0, 0, 0, e, 0, 0, 0, 0, 1);
	}
	static fromRotation(e, n) {
		return M.typeOf.object("rotation", e), N(n) || (n = new t()), n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = 0, n[4] = e[3], n[5] = e[4], n[6] = e[5], n[7] = 0, n[8] = e[6], n[9] = e[7], n[10] = e[8], n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, n;
	}
	static fromCamera(e, n) {
		M.typeOf.object("camera", e);
		const r = e.position, i = e.direction, o = e.up;
		M.typeOf.object("camera.position", r), M.typeOf.object("camera.direction", i), M.typeOf.object("camera.up", o), H.normalize(i, Cn), H.normalize(H.cross(Cn, o, qn), qn), H.normalize(H.cross(qn, Cn, Un), Un);
		const s = qn.x, a = qn.y, u = qn.z, c = Cn.x, l = Cn.y, h = Cn.z, f = Un.x, p = Un.y, d = Un.z, m = r.x, y = r.y, g = r.z, w = s * -m + a * -y + u * -g, E = f * -m + p * -y + d * -g, _ = c * m + l * y + h * g;
		return N(n) ? (n[0] = s, n[1] = f, n[2] = -c, n[3] = 0, n[4] = a, n[5] = p, n[6] = -l, n[7] = 0, n[8] = u, n[9] = d, n[10] = -h, n[11] = 0, n[12] = w, n[13] = E, n[14] = _, n[15] = 1, n) : new t(s, a, u, w, f, p, d, E, -c, -l, -h, _, 0, 0, 0, 1);
	}
	static computePerspectiveFieldOfView(t, e, n, r, i) {
		M.typeOf.number.greaterThan("fovY", t, 0), M.typeOf.number.lessThan("fovY", t, Math.PI), M.typeOf.number.greaterThan("near", n, 0), M.typeOf.number.greaterThan("far", r, 0), M.typeOf.object("result", i);
		const o = 1 / Math.tan(.5 * t), s = o / e, a = (r + n) / (n - r), u = 2 * r * n / (n - r);
		return i[0] = s, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = o, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = a, i[11] = -1, i[12] = 0, i[13] = 0, i[14] = u, i[15] = 0, i;
	}
	static computeOrthographicOffCenter(t, e, n, r, i, o, s) {
		M.typeOf.number("left", t), M.typeOf.number("right", e), M.typeOf.number("bottom", n), M.typeOf.number("top", r), M.typeOf.number("near", i), M.typeOf.number("far", o), M.typeOf.object("result", s);
		let a = 1 / (e - t), u = 1 / (r - n), c = 1 / (o - i);
		const l = -(e + t) * a, h = -(r + n) * u, f = -(o + i) * c;
		return a *= 2, u *= 2, c *= -2, s[0] = a, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = u, s[6] = 0, s[7] = 0, s[8] = 0, s[9] = 0, s[10] = c, s[11] = 0, s[12] = l, s[13] = h, s[14] = f, s[15] = 1, s;
	}
	static computePerspectiveOffCenter(t, e, n, r, i, o, s) {
		M.typeOf.number("left", t), M.typeOf.number("right", e), M.typeOf.number("bottom", n), M.typeOf.number("top", r), M.typeOf.number("near", i), M.typeOf.number("far", o), M.typeOf.object("result", s);
		const a = 2 * i / (e - t), u = 2 * i / (r - n), c = (e + t) / (e - t), l = (r + n) / (r - n), h = -(o + i) / (o - i), f = -2 * o * i / (o - i);
		return s[0] = a, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = u, s[6] = 0, s[7] = 0, s[8] = c, s[9] = l, s[10] = h, s[11] = -1, s[12] = 0, s[13] = 0, s[14] = f, s[15] = 0, s;
	}
	static computeInfinitePerspectiveOffCenter(t, e, n, r, i, o) {
		M.typeOf.number("left", t), M.typeOf.number("right", e), M.typeOf.number("bottom", n), M.typeOf.number("top", r), M.typeOf.number("near", i), M.typeOf.object("result", o);
		const s = 2 * i / (e - t), a = 2 * i / (r - n), u = (e + t) / (e - t), c = (r + n) / (r - n), l = -2 * i;
		return o[0] = s, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = a, o[6] = 0, o[7] = 0, o[8] = u, o[9] = c, o[10] = -1, o[11] = -1, o[12] = 0, o[13] = 0, o[14] = l, o[15] = 0, o;
	}
	static computeViewportTransformation(e, n, r, i) {
		N(i) || (i = new t());
		const o = (e = e ?? I.EMPTY_OBJECT).x ?? 0, s = e.y ?? 0;
		n = n ?? 0;
		const a = .5 * (e.width ?? 0), u = .5 * (e.height ?? 0), c = .5 * ((r = r ?? 1) - n), l = a, h = u, f = c, p = o + a, d = s + u, m = n + c;
		return i[0] = l, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = h, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = f, i[11] = 0, i[12] = p, i[13] = d, i[14] = m, i[15] = 1, i;
	}
	static computeView(t, e, n, r, i) {
		return M.typeOf.object("position", t), M.typeOf.object("direction", e), M.typeOf.object("up", n), M.typeOf.object("right", r), M.typeOf.object("result", i), i[0] = r.x, i[1] = n.x, i[2] = -e.x, i[3] = 0, i[4] = r.y, i[5] = n.y, i[6] = -e.y, i[7] = 0, i[8] = r.z, i[9] = n.z, i[10] = -e.z, i[11] = 0, i[12] = -H.dot(r, t), i[13] = -H.dot(n, t), i[14] = H.dot(e, t), i[15] = 1, i;
	}
	static toArray(t, e) {
		return M.typeOf.object("matrix", t), N(e) ? (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e) : [
			t[0],
			t[1],
			t[2],
			t[3],
			t[4],
			t[5],
			t[6],
			t[7],
			t[8],
			t[9],
			t[10],
			t[11],
			t[12],
			t[13],
			t[14],
			t[15]
		];
	}
	static getElementIndex(t, e) {
		return M.typeOf.number.greaterThanOrEquals("row", e, 0), M.typeOf.number.lessThanOrEquals("row", e, 3), M.typeOf.number.greaterThanOrEquals("column", t, 0), M.typeOf.number.lessThanOrEquals("column", t, 3), 4 * t + e;
	}
	static getColumn(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.number.greaterThanOrEquals("index", e, 0), M.typeOf.number.lessThanOrEquals("index", e, 3), M.typeOf.object("result", n);
		const r = 4 * e, i = t[r], o = t[r + 1], s = t[r + 2], a = t[r + 3];
		return n.x = i, n.y = o, n.z = s, n.w = a, n;
	}
	static setColumn(e, n, r, i) {
		M.typeOf.object("matrix", e), M.typeOf.number.greaterThanOrEquals("index", n, 0), M.typeOf.number.lessThanOrEquals("index", n, 3), M.typeOf.object("cartesian", r), M.typeOf.object("result", i);
		const o = 4 * n;
		return (i = t.clone(e, i))[o] = r.x, i[o + 1] = r.y, i[o + 2] = r.z, i[o + 3] = r.w, i;
	}
	static getRow(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.number.greaterThanOrEquals("index", e, 0), M.typeOf.number.lessThanOrEquals("index", e, 3), M.typeOf.object("result", n);
		const r = t[e], i = t[e + 4], o = t[e + 8], s = t[e + 12];
		return n.x = r, n.y = i, n.z = o, n.w = s, n;
	}
	static setRow(e, n, r, i) {
		return M.typeOf.object("matrix", e), M.typeOf.number.greaterThanOrEquals("index", n, 0), M.typeOf.number.lessThanOrEquals("index", n, 3), M.typeOf.object("cartesian", r), M.typeOf.object("result", i), (i = t.clone(e, i))[n] = r.x, i[n + 4] = r.y, i[n + 8] = r.z, i[n + 12] = r.w, i;
	}
	static setTranslation(t, e, n) {
		return M.typeOf.object("matrix", t), M.typeOf.object("translation", e), M.typeOf.object("result", n), n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n[9] = t[9], n[10] = t[10], n[11] = t[11], n[12] = e.x, n[13] = e.y, n[14] = e.z, n[15] = t[15], n;
	}
	static setScale(e, n, r) {
		M.typeOf.object("matrix", e), M.typeOf.object("scale", n), M.typeOf.object("result", r);
		const i = t.getScale(e, Ln), o = n.x / i.x, s = n.y / i.y, a = n.z / i.z;
		return r[0] = e[0] * o, r[1] = e[1] * o, r[2] = e[2] * o, r[3] = e[3], r[4] = e[4] * s, r[5] = e[5] * s, r[6] = e[6] * s, r[7] = e[7], r[8] = e[8] * a, r[9] = e[9] * a, r[10] = e[10] * a, r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static setUniformScale(e, n, r) {
		M.typeOf.object("matrix", e), M.typeOf.number("scale", n), M.typeOf.object("result", r);
		const i = t.getScale(e, Dn), o = n / i.x, s = n / i.y, a = n / i.z;
		return r[0] = e[0] * o, r[1] = e[1] * o, r[2] = e[2] * o, r[3] = e[3], r[4] = e[4] * s, r[5] = e[5] * s, r[6] = e[6] * s, r[7] = e[7], r[8] = e[8] * a, r[9] = e[9] * a, r[10] = e[10] * a, r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static getScale(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e.x = H.magnitude(H.fromElements(t[0], t[1], t[2], zn)), e.y = H.magnitude(H.fromElements(t[4], t[5], t[6], zn)), e.z = H.magnitude(H.fromElements(t[8], t[9], t[10], zn)), e;
	}
	static getMaximumScale(e) {
		return t.getScale(e, jn), H.maximumComponent(jn);
	}
	static setRotation(e, n, r) {
		M.typeOf.object("matrix", e), M.typeOf.object("result", r);
		const i = t.getScale(e, Fn);
		return r[0] = n[0] * i.x, r[1] = n[1] * i.x, r[2] = n[2] * i.x, r[3] = e[3], r[4] = n[3] * i.y, r[5] = n[4] * i.y, r[6] = n[5] * i.y, r[7] = e[7], r[8] = n[6] * i.z, r[9] = n[7] * i.z, r[10] = n[8] * i.z, r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static getRotation(e, n) {
		M.typeOf.object("matrix", e), M.typeOf.object("result", n);
		const r = t.getScale(e, Bn);
		return n[0] = e[0] / r.x, n[1] = e[1] / r.x, n[2] = e[2] / r.x, n[3] = e[4] / r.y, n[4] = e[5] / r.y, n[5] = e[6] / r.y, n[6] = e[8] / r.z, n[7] = e[9] / r.z, n[8] = e[10] / r.z, n;
	}
	static multiply(t, e, n) {
		M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n);
		const r = t[0], i = t[1], o = t[2], s = t[3], a = t[4], u = t[5], c = t[6], l = t[7], h = t[8], f = t[9], p = t[10], d = t[11], m = t[12], y = t[13], g = t[14], w = t[15], E = e[0], _ = e[1], O = e[2], b = e[3], T = e[4], A = e[5], x = e[6], R = e[7], S = e[8], I = e[9], N = e[10], v = e[11], P = e[12], C = e[13], q = e[14], U = e[15], L = r * E + a * _ + h * O + m * b, D = i * E + u * _ + f * O + y * b, z = o * E + c * _ + p * O + g * b, j = s * E + l * _ + d * O + w * b, F = r * T + a * A + h * x + m * R, B = i * T + u * A + f * x + y * R, G = o * T + c * A + p * x + g * R, k = s * T + l * A + d * x + w * R, W = r * S + a * I + h * N + m * v, V = i * S + u * I + f * N + y * v, H = o * S + c * I + p * N + g * v, X = s * S + l * I + d * N + w * v, Y = r * P + a * C + h * q + m * U, $ = i * P + u * C + f * q + y * U, Z = o * P + c * C + p * q + g * U, Q = s * P + l * C + d * q + w * U;
		return n[0] = L, n[1] = D, n[2] = z, n[3] = j, n[4] = F, n[5] = B, n[6] = G, n[7] = k, n[8] = W, n[9] = V, n[10] = H, n[11] = X, n[12] = Y, n[13] = $, n[14] = Z, n[15] = Q, n;
	}
	static add(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n[0] = t[0] + e[0], n[1] = t[1] + e[1], n[2] = t[2] + e[2], n[3] = t[3] + e[3], n[4] = t[4] + e[4], n[5] = t[5] + e[5], n[6] = t[6] + e[6], n[7] = t[7] + e[7], n[8] = t[8] + e[8], n[9] = t[9] + e[9], n[10] = t[10] + e[10], n[11] = t[11] + e[11], n[12] = t[12] + e[12], n[13] = t[13] + e[13], n[14] = t[14] + e[14], n[15] = t[15] + e[15], n;
	}
	static subtract(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n[0] = t[0] - e[0], n[1] = t[1] - e[1], n[2] = t[2] - e[2], n[3] = t[3] - e[3], n[4] = t[4] - e[4], n[5] = t[5] - e[5], n[6] = t[6] - e[6], n[7] = t[7] - e[7], n[8] = t[8] - e[8], n[9] = t[9] - e[9], n[10] = t[10] - e[10], n[11] = t[11] - e[11], n[12] = t[12] - e[12], n[13] = t[13] - e[13], n[14] = t[14] - e[14], n[15] = t[15] - e[15], n;
	}
	static multiplyTransformation(t, e, n) {
		M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n);
		const r = t[0], i = t[1], o = t[2], s = t[4], a = t[5], u = t[6], c = t[8], l = t[9], h = t[10], f = t[12], p = t[13], d = t[14], m = e[0], y = e[1], g = e[2], w = e[4], E = e[5], _ = e[6], O = e[8], b = e[9], T = e[10], A = e[12], x = e[13], R = e[14], S = r * m + s * y + c * g, I = i * m + a * y + l * g, N = o * m + u * y + h * g, v = r * w + s * E + c * _, P = i * w + a * E + l * _, C = o * w + u * E + h * _, q = r * O + s * b + c * T, U = i * O + a * b + l * T, L = o * O + u * b + h * T, D = r * A + s * x + c * R + f, z = i * A + a * x + l * R + p, j = o * A + u * x + h * R + d;
		return n[0] = S, n[1] = I, n[2] = N, n[3] = 0, n[4] = v, n[5] = P, n[6] = C, n[7] = 0, n[8] = q, n[9] = U, n[10] = L, n[11] = 0, n[12] = D, n[13] = z, n[14] = j, n[15] = 1, n;
	}
	static multiplyByMatrix3(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.object("rotation", e), M.typeOf.object("result", n);
		const r = t[0], i = t[1], o = t[2], s = t[4], a = t[5], u = t[6], c = t[8], l = t[9], h = t[10], f = e[0], p = e[1], d = e[2], m = e[3], y = e[4], g = e[5], w = e[6], E = e[7], _ = e[8], O = r * f + s * p + c * d, b = i * f + a * p + l * d, T = o * f + u * p + h * d, A = r * m + s * y + c * g, x = i * m + a * y + l * g, R = o * m + u * y + h * g, S = r * w + s * E + c * _, I = i * w + a * E + l * _, N = o * w + u * E + h * _;
		return n[0] = O, n[1] = b, n[2] = T, n[3] = 0, n[4] = A, n[5] = x, n[6] = R, n[7] = 0, n[8] = S, n[9] = I, n[10] = N, n[11] = 0, n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static multiplyByTranslation(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.object("translation", e), M.typeOf.object("result", n);
		const r = e.x, i = e.y, o = e.z, s = r * t[0] + i * t[4] + o * t[8] + t[12], a = r * t[1] + i * t[5] + o * t[9] + t[13], u = r * t[2] + i * t[6] + o * t[10] + t[14];
		return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n[9] = t[9], n[10] = t[10], n[11] = t[11], n[12] = s, n[13] = a, n[14] = u, n[15] = t[15], n;
	}
	static multiplyByScale(e, n, r) {
		M.typeOf.object("matrix", e), M.typeOf.object("scale", n), M.typeOf.object("result", r);
		const i = n.x, o = n.y, s = n.z;
		return 1 === i && 1 === o && 1 === s ? t.clone(e, r) : (r[0] = i * e[0], r[1] = i * e[1], r[2] = i * e[2], r[3] = e[3], r[4] = o * e[4], r[5] = o * e[5], r[6] = o * e[6], r[7] = e[7], r[8] = s * e[8], r[9] = s * e[9], r[10] = s * e[10], r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r);
	}
	static multiplyByUniformScale(t, e, n) {
		return M.typeOf.object("matrix", t), M.typeOf.number("scale", e), M.typeOf.object("result", n), n[0] = t[0] * e, n[1] = t[1] * e, n[2] = t[2] * e, n[3] = t[3], n[4] = t[4] * e, n[5] = t[5] * e, n[6] = t[6] * e, n[7] = t[7], n[8] = t[8] * e, n[9] = t[9] * e, n[10] = t[10] * e, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static multiplyByVector(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = e.x, i = e.y, o = e.z, s = e.w, a = t[0] * r + t[4] * i + t[8] * o + t[12] * s, u = t[1] * r + t[5] * i + t[9] * o + t[13] * s, c = t[2] * r + t[6] * i + t[10] * o + t[14] * s, l = t[3] * r + t[7] * i + t[11] * o + t[15] * s;
		return n.x = a, n.y = u, n.z = c, n.w = l, n;
	}
	static multiplyByPointAsVector(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = e.x, i = e.y, o = e.z, s = t[0] * r + t[4] * i + t[8] * o, a = t[1] * r + t[5] * i + t[9] * o, u = t[2] * r + t[6] * i + t[10] * o;
		return n.x = s, n.y = a, n.z = u, n;
	}
	static multiplyByPoint(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = e.x, i = e.y, o = e.z, s = t[0] * r + t[4] * i + t[8] * o + t[12], a = t[1] * r + t[5] * i + t[9] * o + t[13], u = t[2] * r + t[6] * i + t[10] * o + t[14];
		return n.x = s, n.y = a, n.z = u, n;
	}
	static multiplyByScalar(t, e, n) {
		return M.typeOf.object("matrix", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n[0] = t[0] * e, n[1] = t[1] * e, n[2] = t[2] * e, n[3] = t[3] * e, n[4] = t[4] * e, n[5] = t[5] * e, n[6] = t[6] * e, n[7] = t[7] * e, n[8] = t[8] * e, n[9] = t[9] * e, n[10] = t[10] * e, n[11] = t[11] * e, n[12] = t[12] * e, n[13] = t[13] * e, n[14] = t[14] * e, n[15] = t[15] * e, n;
	}
	static negate(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = -t[3], e[4] = -t[4], e[5] = -t[5], e[6] = -t[6], e[7] = -t[7], e[8] = -t[8], e[9] = -t[9], e[10] = -t[10], e[11] = -t[11], e[12] = -t[12], e[13] = -t[13], e[14] = -t[14], e[15] = -t[15], e;
	}
	static transpose(t, e) {
		M.typeOf.object("matrix", t), M.typeOf.object("result", e);
		const n = t[1], r = t[2], i = t[3], o = t[6], s = t[7], a = t[11];
		return e[0] = t[0], e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = n, e[5] = t[5], e[6] = t[9], e[7] = t[13], e[8] = r, e[9] = o, e[10] = t[10], e[11] = t[14], e[12] = i, e[13] = s, e[14] = a, e[15] = t[15], e;
	}
	static abs(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e[0] = Math.abs(t[0]), e[1] = Math.abs(t[1]), e[2] = Math.abs(t[2]), e[3] = Math.abs(t[3]), e[4] = Math.abs(t[4]), e[5] = Math.abs(t[5]), e[6] = Math.abs(t[6]), e[7] = Math.abs(t[7]), e[8] = Math.abs(t[8]), e[9] = Math.abs(t[9]), e[10] = Math.abs(t[10]), e[11] = Math.abs(t[11]), e[12] = Math.abs(t[12]), e[13] = Math.abs(t[13]), e[14] = Math.abs(t[14]), e[15] = Math.abs(t[15]), e;
	}
	static equals(t, e) {
		return t === e || N(t) && N(e) && t[12] === e[12] && t[13] === e[13] && t[14] === e[14] && t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[8] === e[8] && t[9] === e[9] && t[10] === e[10] && t[3] === e[3] && t[7] === e[7] && t[11] === e[11] && t[15] === e[15];
	}
	static equalsEpsilon(t, e, n) {
		return n = n ?? 0, t === e || N(t) && N(e) && Math.abs(t[0] - e[0]) <= n && Math.abs(t[1] - e[1]) <= n && Math.abs(t[2] - e[2]) <= n && Math.abs(t[3] - e[3]) <= n && Math.abs(t[4] - e[4]) <= n && Math.abs(t[5] - e[5]) <= n && Math.abs(t[6] - e[6]) <= n && Math.abs(t[7] - e[7]) <= n && Math.abs(t[8] - e[8]) <= n && Math.abs(t[9] - e[9]) <= n && Math.abs(t[10] - e[10]) <= n && Math.abs(t[11] - e[11]) <= n && Math.abs(t[12] - e[12]) <= n && Math.abs(t[13] - e[13]) <= n && Math.abs(t[14] - e[14]) <= n && Math.abs(t[15] - e[15]) <= n;
	}
	static getTranslation(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e.x = t[12], e.y = t[13], e.z = t[14], e;
	}
	static getMatrix3(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[4], e[4] = t[5], e[5] = t[6], e[6] = t[8], e[7] = t[9], e[8] = t[10], e;
	}
	static inverse(e, n) {
		M.typeOf.object("matrix", e), M.typeOf.object("result", n);
		const r = e[0], i = e[4], o = e[8], s = e[12], a = e[1], u = e[5], c = e[9], l = e[13], h = e[2], f = e[6], p = e[10], d = e[14], m = e[3], y = e[7], g = e[11], w = e[15];
		let E = p * w, _ = d * g, O = f * w, b = d * y, T = f * g, A = p * y, x = h * w, R = d * m, S = h * g, I = p * m, N = h * y, v = f * m;
		const P = E * u + b * c + T * l - (_ * u + O * c + A * l), C = _ * a + x * c + I * l - (E * a + R * c + S * l), q = O * a + R * u + N * l - (b * a + x * u + v * l), U = A * a + S * u + v * c - (T * a + I * u + N * c), L = _ * i + O * o + A * s - (E * i + b * o + T * s), z = E * r + R * o + S * s - (_ * r + x * o + I * s), j = b * r + x * i + v * s - (O * r + R * i + N * s), F = T * r + I * i + N * o - (A * r + S * i + v * o);
		E = o * l, _ = s * c, O = i * l, b = s * u, T = i * c, A = o * u, x = r * l, R = s * a, S = r * c, I = o * a, N = r * u, v = i * a;
		const B = E * y + b * g + T * w - (_ * y + O * g + A * w), G = _ * m + x * g + I * w - (E * m + R * g + S * w), k = O * m + R * y + N * w - (b * m + x * y + v * w), W = A * m + S * y + v * g - (T * m + I * y + N * g), V = O * p + A * d + _ * f - (T * d + E * f + b * p), H = S * d + E * h + R * p - (x * p + I * d + _ * h), X = x * f + v * d + b * h - (N * d + O * h + R * f), Y = N * p + T * h + I * f - (S * f + v * p + A * h);
		let $ = r * P + i * C + o * q + s * U;
		if (Math.abs($) < D.EPSILON21) {
			if (wn.equalsEpsilon(t.getMatrix3(e, Gn), kn, D.EPSILON7) && _t.equals(t.getRow(e, 3, Wn), Vn)) return n[0] = 0, n[1] = 0, n[2] = 0, n[3] = 0, n[4] = 0, n[5] = 0, n[6] = 0, n[7] = 0, n[8] = 0, n[9] = 0, n[10] = 0, n[11] = 0, n[12] = -e[12], n[13] = -e[13], n[14] = -e[14], n[15] = 1, n;
			throw new Ae("matrix is not invertible because its determinate is zero.");
		}
		return $ = 1 / $, n[0] = P * $, n[1] = C * $, n[2] = q * $, n[3] = U * $, n[4] = L * $, n[5] = z * $, n[6] = j * $, n[7] = F * $, n[8] = B * $, n[9] = G * $, n[10] = k * $, n[11] = W * $, n[12] = V * $, n[13] = H * $, n[14] = X * $, n[15] = Y * $, n;
	}
	static inverseTransformation(t, e) {
		M.typeOf.object("matrix", t), M.typeOf.object("result", e);
		const n = t[0], r = t[1], i = t[2], o = t[4], s = t[5], a = t[6], u = t[8], c = t[9], l = t[10], h = t[12], f = t[13], p = t[14], d = -n * h - r * f - i * p, m = -o * h - s * f - a * p, y = -u * h - c * f - l * p;
		return e[0] = n, e[1] = o, e[2] = u, e[3] = 0, e[4] = r, e[5] = s, e[6] = c, e[7] = 0, e[8] = i, e[9] = a, e[10] = l, e[11] = 0, e[12] = d, e[13] = m, e[14] = y, e[15] = 1, e;
	}
	static inverseTranspose(e, n) {
		return M.typeOf.object("matrix", e), M.typeOf.object("result", n), t.inverse(t.transpose(e, Hn), n);
	}
	get length() {
		return t.packedLength;
	}
	clone(e) {
		return t.clone(this, e);
	}
	equals(e) {
		return t.equals(this, e);
	}
	static equalsArray(t, e, n) {
		return t[0] === e[n] && t[1] === e[n + 1] && t[2] === e[n + 2] && t[3] === e[n + 3] && t[4] === e[n + 4] && t[5] === e[n + 5] && t[6] === e[n + 6] && t[7] === e[n + 7] && t[8] === e[n + 8] && t[9] === e[n + 9] && t[10] === e[n + 10] && t[11] === e[n + 11] && t[12] === e[n + 12] && t[13] === e[n + 13] && t[14] === e[n + 14] && t[15] === e[n + 15];
	}
	equalsEpsilon(e, n) {
		return t.equalsEpsilon(this, e, n);
	}
	toString() {
		return `(${this[0]}, ${this[4]}, ${this[8]}, ${this[12]})\n(${this[1]}, ${this[5]}, ${this[9]}, ${this[13]})\n(${this[2]}, ${this[6]}, ${this[10]}, ${this[14]})\n(${this[3]}, ${this[7]}, ${this[11]}, ${this[15]})`;
	}
};
Pn.packedLength = 16, Pn.fromArray = Pn.unpack, Pn.IDENTITY = Object.freeze(new Pn(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)), Pn.ZERO = Object.freeze(new Pn(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)), Pn.COLUMN0ROW0 = 0, Pn.COLUMN0ROW1 = 1, Pn.COLUMN0ROW2 = 2, Pn.COLUMN0ROW3 = 3, Pn.COLUMN1ROW0 = 4, Pn.COLUMN1ROW1 = 5, Pn.COLUMN1ROW2 = 6, Pn.COLUMN1ROW3 = 7, Pn.COLUMN2ROW0 = 8, Pn.COLUMN2ROW1 = 9, Pn.COLUMN2ROW2 = 10, Pn.COLUMN2ROW3 = 11, Pn.COLUMN3ROW0 = 12, Pn.COLUMN3ROW1 = 13, Pn.COLUMN3ROW2 = 14, Pn.COLUMN3ROW3 = 15;
const Cn = new H(), qn = new H(), Un = new H(), Ln = new H(), Dn = new H(), zn = new H(), jn = new H(), Fn = new H(), Bn = new H(), Gn = new wn(), kn = new wn(), Wn = new _t(), Vn = new _t(0, 0, 0, 1), Hn = new Pn();
let Xn;
const Yn = {
	requestFullscreen: void 0,
	exitFullscreen: void 0,
	fullscreenEnabled: void 0,
	fullscreenElement: void 0,
	fullscreenchange: void 0,
	fullscreenerror: void 0
}, $n = {};
let Zn, Qn, Kn, Jn, tr, er, nr, rr, ir, or, sr, ar, ur, cr, lr, hr;
function fr(t) {
	const e = t.split(".");
	for (let n = 0, r = e.length; n < r; ++n) e[n] = parseInt(e[n], 10);
	return e;
}
function pr() {
	if (!N(Qn) && (Qn = !1, !yr())) {
		const t = / Chrome\/([\.0-9]+)/.exec(Zn.userAgent);
		null !== t && (Qn = !0, Kn = fr(t[1]));
	}
	return Qn;
}
function dr() {
	if (!N(Jn) && (Jn = !1, !pr() && !yr() && / Safari\/[\.0-9]+/.test(Zn.userAgent))) {
		const t = / Version\/([\.0-9]+)/.exec(Zn.userAgent);
		null !== t && (Jn = !0, tr = fr(t[1]));
	}
	return Jn;
}
function mr() {
	if (!N(er)) {
		er = !1;
		const t = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(Zn.userAgent);
		null !== t && (er = !0, nr = fr(t[1]), nr.isNightly = !!t[2]);
	}
	return er;
}
function yr() {
	if (!N(rr)) {
		rr = !1;
		const t = / Edg\/([\.0-9]+)/.exec(Zn.userAgent);
		null !== t && (rr = !0, ir = fr(t[1]));
	}
	return rr;
}
function gr() {
	if (!N(or)) {
		or = !1;
		const t = /Firefox\/([\.0-9]+)/.exec(Zn.userAgent);
		null !== t && (or = !0, sr = fr(t[1]));
	}
	return or;
}
function wr() {
	if (!N(hr)) {
		const t = document.createElement("canvas");
		t.setAttribute("style", "image-rendering: -moz-crisp-edges;image-rendering: pixelated;");
		const e = t.style.imageRendering;
		hr = N(e) && "" !== e, hr && (lr = e);
	}
	return hr;
}
function Er() {
	if (!Er.initialized) throw new v("You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP");
	return Er._result;
}
Object.defineProperties($n, {
	element: { get: function() {
		if ($n.supportsFullscreen()) return document[Yn.fullscreenElement];
	} },
	changeEventName: { get: function() {
		if ($n.supportsFullscreen()) return Yn.fullscreenchange;
	} },
	errorEventName: { get: function() {
		if ($n.supportsFullscreen()) return Yn.fullscreenerror;
	} },
	enabled: { get: function() {
		if ($n.supportsFullscreen()) return document[Yn.fullscreenEnabled];
	} },
	fullscreen: { get: function() {
		if ($n.supportsFullscreen()) return null !== $n.element;
	} }
}), $n.supportsFullscreen = function() {
	if (N(Xn)) return Xn;
	Xn = !1;
	const t = document.body;
	if ("function" == typeof t.requestFullscreen) return Yn.requestFullscreen = "requestFullscreen", Yn.exitFullscreen = "exitFullscreen", Yn.fullscreenEnabled = "fullscreenEnabled", Yn.fullscreenElement = "fullscreenElement", Yn.fullscreenchange = "fullscreenchange", Yn.fullscreenerror = "fullscreenerror", Xn = !0, Xn;
	const e = [
		"webkit",
		"moz",
		"o",
		"ms",
		"khtml"
	];
	let n;
	for (let r = 0, i = e.length; r < i; ++r) {
		const i = e[r];
		n = `${i}RequestFullscreen`, "function" == typeof t[n] ? (Yn.requestFullscreen = n, Xn = !0) : (n = `${i}RequestFullScreen`, "function" == typeof t[n] && (Yn.requestFullscreen = n, Xn = !0)), n = `${i}ExitFullscreen`, "function" == typeof document[n] ? Yn.exitFullscreen = n : (n = `${i}CancelFullScreen`, "function" == typeof document[n] && (Yn.exitFullscreen = n)), n = `${i}FullscreenEnabled`, void 0 !== document[n] ? Yn.fullscreenEnabled = n : (n = `${i}FullScreenEnabled`, void 0 !== document[n] && (Yn.fullscreenEnabled = n)), n = `${i}FullscreenElement`, void 0 !== document[n] ? Yn.fullscreenElement = n : (n = `${i}FullScreenElement`, void 0 !== document[n] && (Yn.fullscreenElement = n)), n = `${i}fullscreenchange`, void 0 !== document[`on${n}`] && ("ms" === i && (n = "MSFullscreenChange"), Yn.fullscreenchange = n), n = `${i}fullscreenerror`, void 0 !== document[`on${n}`] && ("ms" === i && (n = "MSFullscreenError"), Yn.fullscreenerror = n);
	}
	return Xn;
}, $n.requestFullscreen = function(t, e) {
	$n.supportsFullscreen() && t[Yn.requestFullscreen]({ vrDisplay: e });
}, $n.exitFullscreen = function() {
	$n.supportsFullscreen() && document[Yn.exitFullscreen]();
}, $n._names = Yn, Zn = "undefined" != typeof navigator ? navigator : {}, Er._promise = void 0, Er._result = void 0, Er.initialize = function() {
	return N(Er._promise) || (Er._promise = new Promise((t) => {
		const e = new Image();
		e.onload = function() {
			Er._result = e.width > 0 && e.height > 0, t(Er._result);
		}, e.onerror = function() {
			Er._result = !1, t(Er._result);
		}, e.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
	})), Er._promise;
}, Object.defineProperties(Er, { initialized: { get: function() {
	return N(Er._result);
} } });
const _r = [];
"undefined" != typeof ArrayBuffer && (_r.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), "undefined" != typeof Uint8ClampedArray && _r.push(Uint8ClampedArray), "undefined" != typeof Uint8ClampedArray && _r.push(Uint8ClampedArray), "undefined" != typeof BigInt64Array && _r.push(BigInt64Array), "undefined" != typeof BigUint64Array && _r.push(BigUint64Array));
const Or = {
	isChrome: pr,
	chromeVersion: function() {
		return pr() && Kn;
	},
	isSafari: dr,
	safariVersion: function() {
		return dr() && tr;
	},
	isWebkit: mr,
	webkitVersion: function() {
		return mr() && nr;
	},
	isEdge: yr,
	edgeVersion: function() {
		return yr() && ir;
	},
	isFirefox: gr,
	firefoxVersion: function() {
		return gr() && sr;
	},
	isWindows: function() {
		return N(ar) || (ar = /Windows/i.test(Zn.appVersion)), ar;
	},
	isIPadOrIOS: function() {
		return N(ur) || (ur = "iPhone" === navigator.platform || "iPod" === navigator.platform || "iPad" === navigator.platform), ur;
	},
	hardwareConcurrency: Zn.hardwareConcurrency ?? 3,
	supportsPointerEvents: function() {
		return N(cr) || (cr = !gr() && "undefined" != typeof PointerEvent && (!N(Zn.pointerEnabled) || Zn.pointerEnabled)), cr;
	},
	supportsImageRenderingPixelated: wr,
	supportsWebP: Er,
	imageRenderingValue: function() {
		return wr() ? lr : void 0;
	},
	typedArrayTypes: _r
};
function br(t, e, n, r) {
	this.x = t ?? 0, this.y = e ?? 0, this.z = n ?? 0, this.w = r ?? 0;
}
Or.supportsBasis = function(t) {
	return Or.supportsWebAssembly() && t.context.supportsBasis;
}, Or.supportsFullscreen = function() {
	return $n.supportsFullscreen();
}, Or.supportsTypedArrays = function() {
	return "undefined" != typeof ArrayBuffer;
}, Or.supportsBigInt64Array = function() {
	return "undefined" != typeof BigInt64Array;
}, Or.supportsBigUint64Array = function() {
	return "undefined" != typeof BigUint64Array;
}, Or.supportsBigInt = function() {
	return "undefined" != typeof BigInt;
}, Or.supportsWebWorkers = function() {
	return "undefined" != typeof Worker;
}, Or.supportsWebAssembly = function() {
	return "undefined" != typeof WebAssembly;
}, Or.supportsWebgl2 = function(t) {
	return M.defined("scene", t), t.context.webgl2;
}, Or.supportsEsmWebWorkers = function() {
	return !gr() || parseInt(sr) >= 114;
};
let Tr = new H();
br.fromAxisAngle = function(t, e, n) {
	M.typeOf.object("axis", t), M.typeOf.number("angle", e);
	const r = e / 2, i = Math.sin(r);
	Tr = H.normalize(t, Tr);
	const o = Tr.x * i, s = Tr.y * i, a = Tr.z * i, u = Math.cos(r);
	return N(n) ? (n.x = o, n.y = s, n.z = a, n.w = u, n) : new br(o, s, a, u);
};
const Ar = [
	1,
	2,
	0
], xr = new Array(3);
br.fromRotationMatrix = function(t, e) {
	let n, r, i, o, s;
	M.typeOf.object("matrix", t);
	const a = t[wn.COLUMN0ROW0], u = t[wn.COLUMN1ROW1], c = t[wn.COLUMN2ROW2], l = a + u + c;
	if (l > 0) n = Math.sqrt(l + 1), s = .5 * n, n = .5 / n, r = (t[wn.COLUMN1ROW2] - t[wn.COLUMN2ROW1]) * n, i = (t[wn.COLUMN2ROW0] - t[wn.COLUMN0ROW2]) * n, o = (t[wn.COLUMN0ROW1] - t[wn.COLUMN1ROW0]) * n;
	else {
		const e = Ar;
		let l = 0;
		u > a && (l = 1), c > a && c > u && (l = 2);
		const h = e[l], f = e[h];
		n = Math.sqrt(t[wn.getElementIndex(l, l)] - t[wn.getElementIndex(h, h)] - t[wn.getElementIndex(f, f)] + 1);
		const p = xr;
		p[l] = .5 * n, n = .5 / n, s = (t[wn.getElementIndex(f, h)] - t[wn.getElementIndex(h, f)]) * n, p[h] = (t[wn.getElementIndex(h, l)] + t[wn.getElementIndex(l, h)]) * n, p[f] = (t[wn.getElementIndex(f, l)] + t[wn.getElementIndex(l, f)]) * n, r = -p[0], i = -p[1], o = -p[2];
	}
	return N(e) ? (e.x = r, e.y = i, e.z = o, e.w = s, e) : new br(r, i, o, s);
};
const Rr = new br();
let Sr = new br(), Ir = new br(), Nr = new br();
br.fromHeadingPitchRoll = function(t, e) {
	return M.typeOf.object("headingPitchRoll", t), Nr = br.fromAxisAngle(H.UNIT_X, t.roll, Rr), Ir = br.fromAxisAngle(H.UNIT_Y, -t.pitch, e), e = br.multiply(Ir, Nr, Ir), Sr = br.fromAxisAngle(H.UNIT_Z, -t.heading, Rr), br.multiply(Sr, e, e);
};
const vr = new H(), Mr = new H(), Pr = new br(), Cr = new br(), qr = new br();
br.packedLength = 4, br.pack = function(t, e, n) {
	return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, e[n++] = t.x, e[n++] = t.y, e[n++] = t.z, e[n] = t.w, e;
}, br.unpack = function(t, e, n) {
	return M.defined("array", t), e = e ?? 0, N(n) || (n = new br()), n.x = t[e], n.y = t[e + 1], n.z = t[e + 2], n.w = t[e + 3], n;
}, br.packedInterpolationLength = 3, br.convertPackedArrayForInterpolation = function(t, e, n, r) {
	br.unpack(t, 4 * n, qr), br.conjugate(qr, qr);
	for (let i = 0, o = n - e + 1; i < o; i++) {
		const n = 3 * i;
		br.unpack(t, 4 * (e + i), Pr), br.multiply(Pr, qr, Pr), Pr.w < 0 && br.negate(Pr, Pr), br.computeAxis(Pr, vr);
		const o = br.computeAngle(Pr);
		N(r) || (r = []), r[n] = vr.x * o, r[n + 1] = vr.y * o, r[n + 2] = vr.z * o;
	}
}, br.unpackInterpolationResult = function(t, e, n, r, i) {
	N(i) || (i = new br()), H.fromArray(t, 0, Mr);
	const o = H.magnitude(Mr);
	return br.unpack(e, 4 * r, Cr), 0 === o ? br.clone(br.IDENTITY, Pr) : br.fromAxisAngle(Mr, o, Pr), br.multiply(Pr, Cr, i);
}, br.clone = function(t, e) {
	if (N(t)) return N(e) ? (e.x = t.x, e.y = t.y, e.z = t.z, e.w = t.w, e) : new br(t.x, t.y, t.z, t.w);
}, br.conjugate = function(t, e) {
	return M.typeOf.object("quaternion", t), M.typeOf.object("result", e), e.x = -t.x, e.y = -t.y, e.z = -t.z, e.w = t.w, e;
}, br.magnitudeSquared = function(t) {
	return M.typeOf.object("quaternion", t), t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
}, br.magnitude = function(t) {
	return Math.sqrt(br.magnitudeSquared(t));
}, br.normalize = function(t, e) {
	M.typeOf.object("result", e);
	const n = 1 / br.magnitude(t), r = t.x * n, i = t.y * n, o = t.z * n, s = t.w * n;
	return e.x = r, e.y = i, e.z = o, e.w = s, e;
}, br.inverse = function(t, e) {
	M.typeOf.object("result", e);
	const n = br.magnitudeSquared(t);
	return e = br.conjugate(t, e), br.multiplyByScalar(e, 1 / n, e);
}, br.add = function(t, e, n) {
	return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x + e.x, n.y = t.y + e.y, n.z = t.z + e.z, n.w = t.w + e.w, n;
}, br.subtract = function(t, e, n) {
	return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n.x = t.x - e.x, n.y = t.y - e.y, n.z = t.z - e.z, n.w = t.w - e.w, n;
}, br.negate = function(t, e) {
	return M.typeOf.object("quaternion", t), M.typeOf.object("result", e), e.x = -t.x, e.y = -t.y, e.z = -t.z, e.w = -t.w, e;
}, br.dot = function(t, e) {
	return M.typeOf.object("left", t), M.typeOf.object("right", e), t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
}, br.multiply = function(t, e, n) {
	M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n);
	const r = t.x, i = t.y, o = t.z, s = t.w, a = e.x, u = e.y, c = e.z, l = e.w, h = s * a + r * l + i * c - o * u, f = s * u - r * c + i * l + o * a, p = s * c + r * u - i * a + o * l, d = s * l - r * a - i * u - o * c;
	return n.x = h, n.y = f, n.z = p, n.w = d, n;
}, br.multiplyByScalar = function(t, e, n) {
	return M.typeOf.object("quaternion", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n.x = t.x * e, n.y = t.y * e, n.z = t.z * e, n.w = t.w * e, n;
}, br.divideByScalar = function(t, e, n) {
	return M.typeOf.object("quaternion", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n.x = t.x / e, n.y = t.y / e, n.z = t.z / e, n.w = t.w / e, n;
}, br.computeAxis = function(t, e) {
	M.typeOf.object("quaternion", t), M.typeOf.object("result", e);
	const n = t.w;
	if (Math.abs(n - 1) < D.EPSILON6 || Math.abs(n + 1) < D.EPSILON6) return e.x = 1, e.y = e.z = 0, e;
	const r = 1 / Math.sqrt(1 - n * n);
	return e.x = t.x * r, e.y = t.y * r, e.z = t.z * r, e;
}, br.computeAngle = function(t) {
	return M.typeOf.object("quaternion", t), Math.abs(t.w - 1) < D.EPSILON6 ? 0 : 2 * Math.acos(t.w);
};
let Ur = new br();
br.lerp = function(t, e, n, r) {
	return M.typeOf.object("start", t), M.typeOf.object("end", e), M.typeOf.number("t", n), M.typeOf.object("result", r), Ur = br.multiplyByScalar(e, n, Ur), r = br.multiplyByScalar(t, 1 - n, r), br.add(Ur, r, r);
};
let Lr = new br(), Dr = new br(), zr = new br();
br.slerp = function(t, e, n, r) {
	M.typeOf.object("start", t), M.typeOf.object("end", e), M.typeOf.number("t", n), M.typeOf.object("result", r);
	let i = br.dot(t, e), o = e;
	if (i < 0 && (i = -i, o = Lr = br.negate(e, Lr)), 1 - i < D.EPSILON6) return br.lerp(t, o, n, r);
	const s = Math.acos(i);
	return Dr = br.multiplyByScalar(t, Math.sin((1 - n) * s), Dr), zr = br.multiplyByScalar(o, Math.sin(n * s), zr), r = br.add(Dr, zr, r), br.multiplyByScalar(r, 1 / Math.sin(s), r);
}, br.log = function(t, e) {
	M.typeOf.object("quaternion", t), M.typeOf.object("result", e);
	const n = D.acosClamped(t.w);
	let r = 0;
	return 0 !== n && (r = n / Math.sin(n)), H.multiplyByScalar(t, r, e);
}, br.exp = function(t, e) {
	M.typeOf.object("cartesian", t), M.typeOf.object("result", e);
	const n = H.magnitude(t);
	let r = 0;
	return 0 !== n && (r = Math.sin(n) / n), e.x = t.x * r, e.y = t.y * r, e.z = t.z * r, e.w = Math.cos(n), e;
};
const jr = new H(), Fr = new H(), Br = new br(), Gr = new br();
br.computeInnerQuadrangle = function(t, e, n, r) {
	M.typeOf.object("q0", t), M.typeOf.object("q1", e), M.typeOf.object("q2", n), M.typeOf.object("result", r);
	const i = br.conjugate(e, Br);
	br.multiply(i, n, Gr);
	const o = br.log(Gr, jr);
	br.multiply(i, t, Gr);
	const s = br.log(Gr, Fr);
	return H.add(o, s, o), H.multiplyByScalar(o, .25, o), H.negate(o, o), br.exp(o, Br), br.multiply(e, Br, r);
}, br.squad = function(t, e, n, r, i, o) {
	M.typeOf.object("q0", t), M.typeOf.object("q1", e), M.typeOf.object("s0", n), M.typeOf.object("s1", r), M.typeOf.number("t", i), M.typeOf.object("result", o);
	const s = br.slerp(t, e, i, Br), a = br.slerp(n, r, i, Gr);
	return br.slerp(s, a, 2 * i * (1 - i), o);
};
const kr = new br(), Wr = 1.9011074535173003, Vr = Or.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Hr = Or.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Xr = Or.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Yr = Or.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [];
for (let Cf = 0; Cf < 7; ++Cf) {
	const t = Cf + 1, e = 2 * t + 1;
	Vr[Cf] = 1 / (t * e), Hr[Cf] = t / e;
}
Vr[7] = Wr / 136, Hr[7] = 8 * Wr / 17, br.fastSlerp = function(t, e, n, r) {
	M.typeOf.object("start", t), M.typeOf.object("end", e), M.typeOf.number("t", n), M.typeOf.object("result", r);
	let i, o = br.dot(t, e);
	o >= 0 ? i = 1 : (i = -1, o = -o);
	const s = o - 1, a = 1 - n, u = n * n, c = a * a;
	for (let p = 7; p >= 0; --p) Xr[p] = (Vr[p] * u - Hr[p]) * s, Yr[p] = (Vr[p] * c - Hr[p]) * s;
	const l = i * n * (1 + Xr[0] * (1 + Xr[1] * (1 + Xr[2] * (1 + Xr[3] * (1 + Xr[4] * (1 + Xr[5] * (1 + Xr[6] * (1 + Xr[7])))))))), h = a * (1 + Yr[0] * (1 + Yr[1] * (1 + Yr[2] * (1 + Yr[3] * (1 + Yr[4] * (1 + Yr[5] * (1 + Yr[6] * (1 + Yr[7])))))))), f = br.multiplyByScalar(t, h, kr);
	return br.multiplyByScalar(e, l, r), br.add(f, r, r);
}, br.fastSquad = function(t, e, n, r, i, o) {
	M.typeOf.object("q0", t), M.typeOf.object("q1", e), M.typeOf.object("s0", n), M.typeOf.object("s1", r), M.typeOf.number("t", i), M.typeOf.object("result", o);
	const s = br.fastSlerp(t, e, i, Br), a = br.fastSlerp(n, r, i, Gr);
	return br.fastSlerp(s, a, 2 * i * (1 - i), o);
}, br.equals = function(t, e) {
	return t === e || N(t) && N(e) && t.x === e.x && t.y === e.y && t.z === e.z && t.w === e.w;
}, br.equalsEpsilon = function(t, e, n) {
	return n = n ?? 0, t === e || N(t) && N(e) && Math.abs(t.x - e.x) <= n && Math.abs(t.y - e.y) <= n && Math.abs(t.z - e.z) <= n && Math.abs(t.w - e.w) <= n;
}, br.ZERO = Object.freeze(new br(0, 0, 0, 0)), br.IDENTITY = Object.freeze(new br(0, 0, 0, 1)), br.prototype.clone = function(t) {
	return br.clone(this, t);
}, br.prototype.equals = function(t) {
	return br.equals(this, t);
}, br.prototype.equalsEpsilon = function(t, e) {
	return br.equalsEpsilon(this, t, e);
}, br.prototype.toString = function() {
	return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
};
const $r = {}, Zr = {
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
}, Qr = {
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
}, Kr = {}, Jr = {
	east: new H(),
	north: new H(),
	up: new H(),
	west: new H(),
	south: new H(),
	down: new H()
};
let ti = new H(), ei = new H(), ni = new H();
$r.localFrameToFixedFrameGenerator = function(t, e) {
	if (!Zr.hasOwnProperty(t) || !Zr[t].hasOwnProperty(e)) throw new v("firstAxis and secondAxis must be east, north, up, west, south or down.");
	const n = Zr[t][e];
	let r;
	const i = t + e;
	return N(Kr[i]) ? r = Kr[i] : (r = function(r, i, o) {
		if (!N(r)) throw new v("origin is required.");
		if (isNaN(r.x) || isNaN(r.y) || isNaN(r.z)) throw new v("origin has a NaN component");
		if (N(o) || (o = new Pn()), H.equalsEpsilon(r, H.ZERO, D.EPSILON14)) H.unpack(Qr[t], 0, ti), H.unpack(Qr[e], 0, ei), H.unpack(Qr[n], 0, ni);
		else if (D.equalsEpsilon(r.x, 0, D.EPSILON14) && D.equalsEpsilon(r.y, 0, D.EPSILON14)) {
			const i = D.sign(r.z);
			H.unpack(Qr[t], 0, ti), "east" !== t && "west" !== t && H.multiplyByScalar(ti, i, ti), H.unpack(Qr[e], 0, ei), "east" !== e && "west" !== e && H.multiplyByScalar(ei, i, ei), H.unpack(Qr[n], 0, ni), "east" !== n && "west" !== n && H.multiplyByScalar(ni, i, ni);
		} else {
			(i = i ?? ut.default).geodeticSurfaceNormal(r, Jr.up);
			const o = Jr.up, s = Jr.east;
			s.x = -r.y, s.y = r.x, s.z = 0, H.normalize(s, Jr.east), H.cross(o, s, Jr.north), H.multiplyByScalar(Jr.up, -1, Jr.down), H.multiplyByScalar(Jr.east, -1, Jr.west), H.multiplyByScalar(Jr.north, -1, Jr.south), ti = Jr[t], ei = Jr[e], ni = Jr[n];
		}
		return o[0] = ti.x, o[1] = ti.y, o[2] = ti.z, o[3] = 0, o[4] = ei.x, o[5] = ei.y, o[6] = ei.z, o[7] = 0, o[8] = ni.x, o[9] = ni.y, o[10] = ni.z, o[11] = 0, o[12] = r.x, o[13] = r.y, o[14] = r.z, o[15] = 1, o;
	}, Kr[i] = r), r;
}, $r.eastNorthUpToFixedFrame = $r.localFrameToFixedFrameGenerator("east", "north"), $r.northEastDownToFixedFrame = $r.localFrameToFixedFrameGenerator("north", "east"), $r.northUpEastToFixedFrame = $r.localFrameToFixedFrameGenerator("north", "up"), $r.northWestUpToFixedFrame = $r.localFrameToFixedFrameGenerator("north", "west");
const ri = new br(), ii = new H(1, 1, 1), oi = new Pn();
$r.headingPitchRollToFixedFrame = function(t, e, n, r, i) {
	M.typeOf.object("HeadingPitchRoll", e), r = r ?? $r.eastNorthUpToFixedFrame;
	const o = br.fromHeadingPitchRoll(e, ri), s = Pn.fromTranslationQuaternionRotationScale(H.ZERO, o, ii, oi);
	return i = r(t, n, i), Pn.multiply(i, s, i);
};
const si = new Pn(), ai = new wn();
$r.headingPitchRollQuaternion = function(t, e, n, r, i) {
	M.typeOf.object("HeadingPitchRoll", e);
	const o = $r.headingPitchRollToFixedFrame(t, e, n, r, si), s = Pn.getMatrix3(o, ai);
	return br.fromRotationMatrix(s, i);
};
const ui = new H(1, 1, 1), ci = new H(), li = new Pn(), hi = new Pn(), fi = new wn(), pi = new br();
$r.fixedFrameToHeadingPitchRoll = function(t, e, n, r) {
	M.defined("transform", t), e = e ?? ut.default, n = n ?? $r.eastNorthUpToFixedFrame, N(r) || (r = new nn());
	const i = Pn.getTranslation(t, ci);
	if (H.equals(i, H.ZERO)) return r.heading = 0, r.pitch = 0, r.roll = 0, r;
	let o = Pn.inverseTransformation(n(i, e, li), li), s = Pn.setScale(t, ui, hi);
	s = Pn.setTranslation(s, H.ZERO, s), o = Pn.multiply(o, s, o);
	let a = br.fromRotationMatrix(Pn.getMatrix3(o, fi), pi);
	return a = br.normalize(a, a), nn.fromQuaternion(a, r);
};
const di = D.TWO_PI / 86400;
let mi = new te();
$r.computeIcrfToCentralBodyFixedMatrix = function(t, e) {
	let n = $r.computeIcrfToFixedMatrix(t, e);
	return N(n) || (n = $r.computeTemeToPseudoFixedMatrix(t, e)), n;
}, $r.computeTemeToPseudoFixedMatrix = function(t, e) {
	if (!N(t)) throw new v("date is required.");
	mi = te.addSeconds(t, -te.computeTaiMinusUtc(t), mi);
	const n = mi.dayNumber, r = mi.secondsOfDay;
	let i;
	const o = n - 2451545;
	i = r >= 43200 ? (o + .5) / qt.DAYS_PER_JULIAN_CENTURY : (o - .5) / qt.DAYS_PER_JULIAN_CENTURY;
	const s = (24110.54841 + i * (8640184.812866 + i * (.093104 + -62e-7 * i))) * di % D.TWO_PI + (r + .5 * qt.SECONDS_PER_DAY) % qt.SECONDS_PER_DAY * (72921158553e-15 + 11772758384668e-32 * (n - 2451545.5)), a = Math.cos(s), u = Math.sin(s);
	return N(e) ? (e[0] = a, e[1] = -u, e[2] = 0, e[3] = u, e[4] = a, e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, e) : new wn(a, u, 0, -u, a, 0, 0, 0, 1);
}, $r.iau2006XysData = new dn(), $r.earthOrientationParameters = Ze.NONE;
const yi = 32.184;
$r.preloadIcrfFixed = function(t) {
	const e = t.start.dayNumber, n = t.start.secondsOfDay + yi, r = t.stop.dayNumber, i = t.stop.secondsOfDay + yi;
	return $r.iau2006XysData.preload(e, n, r, i);
}, $r.computeIcrfToFixedMatrix = function(t, e) {
	if (!N(t)) throw new v("date is required.");
	N(e) || (e = new wn());
	const n = $r.computeFixedToIcrfMatrix(t, e);
	if (N(n)) return wn.transpose(n, e);
};
const gi = new nn(), wi = new wn(), Ei = new te();
$r.computeMoonFixedToIcrfMatrix = function(t, e) {
	if (!N(t)) throw new v("date is required.");
	N(e) || (e = new wn());
	const n = te.addSeconds(t, 32.184, Ei), r = te.totalDays(n) - 2451545, i = D.toRadians(12.112) - D.toRadians(.052992) * r, o = D.toRadians(24.224) - D.toRadians(.105984) * r, s = D.toRadians(227.645) + D.toRadians(13.012) * r, a = D.toRadians(261.105) + D.toRadians(13.340716) * r, u = D.toRadians(358) + D.toRadians(.9856) * r;
	return gi.pitch = D.toRadians(180) - D.toRadians(3.878) * Math.sin(i) - D.toRadians(.12) * Math.sin(o) + D.toRadians(.07) * Math.sin(s) - D.toRadians(.017) * Math.sin(a), gi.roll = D.toRadians(-23.47) + D.toRadians(1.543) * Math.cos(i) + D.toRadians(.24) * Math.cos(o) - D.toRadians(.028) * Math.cos(s) + D.toRadians(.007) * Math.cos(a), gi.heading = D.toRadians(154.375) + D.toRadians(13.17635831) * r + D.toRadians(3.558) * Math.sin(i) + D.toRadians(.121) * Math.sin(o) - D.toRadians(.064) * Math.sin(s) + D.toRadians(.016) * Math.sin(a) + D.toRadians(.025) * Math.sin(u), wn.fromHeadingPitchRoll(gi, wi);
}, $r.computeIcrfToMoonFixedMatrix = function(t, e) {
	if (!N(t)) throw new v("date is required.");
	N(e) || (e = new wn());
	const n = $r.computeMoonFixedToIcrfMatrix(t, e);
	if (N(n)) return wn.transpose(n, e);
};
const _i = new pn(0, 0, 0), Oi = new Nt(0, 0, 0, 0, 0, 0), bi = new wn(), Ti = new wn();
$r.computeFixedToIcrfMatrix = function(t, e) {
	if (!N(t)) throw new v("date is required.");
	N(e) || (e = new wn());
	const n = $r.earthOrientationParameters.compute(t, Oi);
	if (!N(n)) return;
	const r = t.dayNumber, i = t.secondsOfDay + yi, o = $r.iau2006XysData.computeXysRadians(r, i, _i);
	if (!N(o)) return;
	const s = o.x + n.xPoleOffset, a = o.y + n.yPoleOffset, u = 1 / (1 + Math.sqrt(1 - s * s - a * a)), c = bi;
	c[0] = 1 - u * s * s, c[3] = -u * s * a, c[6] = s, c[1] = -u * s * a, c[4] = 1 - u * a * a, c[7] = a, c[2] = -s, c[5] = -a, c[8] = 1 - u * (s * s + a * a);
	const l = wn.fromRotationZ(-o.s, Ti), h = wn.multiply(c, l, bi), f = t.dayNumber, p = (t.secondsOfDay - te.computeTaiMinusUtc(t) + n.ut1MinusUtc) / qt.SECONDS_PER_DAY;
	let d = .779057273264 + p + .00273781191135448 * (f - 2451545 + p);
	d = d % 1 * D.TWO_PI;
	const m = wn.fromRotationZ(d, Ti), y = wn.multiply(h, m, bi), g = Math.cos(n.xPoleWander), w = Math.cos(n.yPoleWander), E = Math.sin(n.xPoleWander), _ = Math.sin(n.yPoleWander);
	let O = r - 2451545 + i / qt.SECONDS_PER_DAY;
	O /= 36525;
	const b = -47e-6 * O * D.RADIANS_PER_DEGREE / 3600, T = Math.cos(b), A = Math.sin(b), x = Ti;
	return x[0] = g * T, x[1] = g * A, x[2] = E, x[3] = -w * A + _ * E * T, x[4] = w * T + _ * E * A, x[5] = -_ * g, x[6] = -_ * A - w * E * T, x[7] = _ * T - w * E * A, x[8] = w * g, wn.multiply(y, x, e);
};
const Ai = new _t();
$r.pointToWindowCoordinates = function(t, e, n, r) {
	return (r = $r.pointToGLWindowCoordinates(t, e, n, r)).y = 2 * e[5] - r.y, r;
}, $r.pointToGLWindowCoordinates = function(t, e, n, r) {
	if (!N(t)) throw new v("modelViewProjectionMatrix is required.");
	if (!N(e)) throw new v("viewportTransformation is required.");
	if (!N(n)) throw new v("point is required.");
	N(r) || (r = new F());
	const i = Ai;
	return Pn.multiplyByVector(t, _t.fromElements(n.x, n.y, n.z, 1, i), i), _t.multiplyByScalar(i, 1 / i.w, i), Pn.multiplyByVector(e, i, i), F.fromCartesian4(i, r);
};
const xi = new H(), Ri = new H(), Si = new H();
$r.rotationMatrixFromPositionVelocity = function(t, e, n, r) {
	if (!N(t)) throw new v("position is required.");
	if (!N(e)) throw new v("velocity is required.");
	const i = (n ?? ut.default).geodeticSurfaceNormal(t, xi);
	let o = H.cross(e, i, Ri);
	H.equalsEpsilon(o, H.ZERO, D.EPSILON6) && (o = H.clone(H.UNIT_X, o));
	const s = H.cross(o, e, Si);
	return H.normalize(s, s), H.cross(e, s, o), H.negate(o, o), H.normalize(o, o), N(r) || (r = new wn()), r[0] = e.x, r[1] = e.y, r[2] = e.z, r[3] = o.x, r[4] = o.y, r[5] = o.z, r[6] = s.x, r[7] = s.y, r[8] = s.z, r;
}, $r.SWIZZLE_3D_TO_2D_MATRIX = Object.freeze(new Pn(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
const Ii = new rt(), Ni = new H(), vi = new H(), Mi = new wn(), Pi = new Pn(), Ci = new Pn();
$r.basisTo2D = function(t, e, n) {
	if (!N(t)) throw new v("projection is required.");
	if (!N(e)) throw new v("matrix is required.");
	if (!N(n)) throw new v("result is required.");
	const r = Pn.getTranslation(e, vi), i = t.ellipsoid;
	let o;
	if (H.equals(r, H.ZERO)) o = H.clone(H.ZERO, Ni);
	else {
		const e = i.cartesianToCartographic(r, Ii);
		o = t.project(e, Ni), H.fromElements(o.z, o.x, o.y, o);
	}
	const s = $r.eastNorthUpToFixedFrame(r, i, Pi), a = Pn.inverseTransformation(s, Ci), u = Pn.getMatrix3(e, Mi), c = Pn.multiplyByMatrix3(a, u, n);
	return Pn.multiply($r.SWIZZLE_3D_TO_2D_MATRIX, c, n), Pn.setTranslation(n, o, n), n;
}, $r.ellipsoidTo2DModelMatrix = function(t, e, n) {
	if (!N(t)) throw new v("projection is required.");
	if (!N(e)) throw new v("center is required.");
	if (!N(n)) throw new v("result is required.");
	const r = t.ellipsoid, i = $r.eastNorthUpToFixedFrame(e, r, Pi), o = Pn.inverseTransformation(i, Ci), s = r.cartesianToCartographic(e, Ii), a = t.project(s, Ni);
	H.fromElements(a.z, a.x, a.y, a);
	const u = Pn.fromTranslation(a, Pi);
	return Pn.multiply($r.SWIZZLE_3D_TO_2D_MATRIX, o, n), Pn.multiply(u, n, n), n;
};
var qi = class t {
	constructor(t, e, n, r) {
		this.west = t ?? 0, this.south = e ?? 0, this.east = n ?? 0, this.north = r ?? 0;
	}
	get width() {
		return t.computeWidth(this);
	}
	get height() {
		return t.computeHeight(this);
	}
	static pack(t, e, n) {
		return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, e[n++] = t.west, e[n++] = t.south, e[n++] = t.east, e[n] = t.north, e;
	}
	static unpack(e, n, r) {
		return M.defined("array", e), n = n ?? 0, N(r) || (r = new t()), r.west = e[n++], r.south = e[n++], r.east = e[n++], r.north = e[n], r;
	}
	static computeWidth(t) {
		M.typeOf.object("rectangle", t);
		let e = t.east;
		const n = t.west;
		return e < n && (e += D.TWO_PI), e - n;
	}
	static computeHeight(t) {
		return M.typeOf.object("rectangle", t), t.north - t.south;
	}
	static fromDegrees(e, n, r, i, o) {
		return e = D.toRadians(e ?? 0), n = D.toRadians(n ?? 0), r = D.toRadians(r ?? 0), i = D.toRadians(i ?? 0), N(o) ? (o.west = e, o.south = n, o.east = r, o.north = i, o) : new t(e, n, r, i);
	}
	static fromRadians(e, n, r, i, o) {
		return N(o) ? (o.west = e ?? 0, o.south = n ?? 0, o.east = r ?? 0, o.north = i ?? 0, o) : new t(e, n, r, i);
	}
	static fromCartographicArray(e, n) {
		M.defined("cartographics", e);
		let r = Number.MAX_VALUE, i = -Number.MAX_VALUE, o = Number.MAX_VALUE, s = -Number.MAX_VALUE, a = Number.MAX_VALUE, u = -Number.MAX_VALUE;
		for (let t = 0, c = e.length; t < c; t++) {
			const n = e[t];
			r = Math.min(r, n.longitude), i = Math.max(i, n.longitude), a = Math.min(a, n.latitude), u = Math.max(u, n.latitude);
			const c = n.longitude >= 0 ? n.longitude : n.longitude + D.TWO_PI;
			o = Math.min(o, c), s = Math.max(s, c);
		}
		return i - r > s - o && (r = o, i = s, i > D.PI && (i -= D.TWO_PI), r > D.PI && (r -= D.TWO_PI)), N(n) ? (n.west = r, n.south = a, n.east = i, n.north = u, n) : new t(r, a, i, u);
	}
	static fromCartesianArray(e, n, r) {
		M.defined("cartesians", e), n = n ?? ut.default;
		let i = Number.MAX_VALUE, o = -Number.MAX_VALUE, s = Number.MAX_VALUE, a = -Number.MAX_VALUE, u = Number.MAX_VALUE, c = -Number.MAX_VALUE;
		for (let t = 0, l = e.length; t < l; t++) {
			const r = n.cartesianToCartographic(e[t]);
			i = Math.min(i, r.longitude), o = Math.max(o, r.longitude), u = Math.min(u, r.latitude), c = Math.max(c, r.latitude);
			const l = r.longitude >= 0 ? r.longitude : r.longitude + D.TWO_PI;
			s = Math.min(s, l), a = Math.max(a, l);
		}
		return o - i > a - s && (i = s, o = a, o > D.PI && (o -= D.TWO_PI), i > D.PI && (i -= D.TWO_PI)), N(r) ? (r.west = i, r.south = u, r.east = o, r.north = c, r) : new t(i, u, o, c);
	}
	static fromBoundingSphere(e, n, r) {
		M.typeOf.object("boundingSphere", e);
		const i = e.center, o = e.radius;
		if (N(n) || (n = ut.default), N(r) || (r = new t()), H.equals(i, H.ZERO)) return t.clone(t.MAX_VALUE, r), r;
		const s = $r.eastNorthUpToFixedFrame(i, n, Ui), a = Pn.multiplyByPointAsVector(s, H.UNIT_X, Li);
		H.normalize(a, a);
		const u = Pn.multiplyByPointAsVector(s, H.UNIT_Y, Di);
		H.normalize(u, u), H.multiplyByScalar(u, o, u), H.multiplyByScalar(a, o, a);
		const c = H.negate(u, ji), l = H.negate(a, zi), h = Fi;
		let f = h[0];
		return H.add(i, u, f), f = h[1], H.add(i, l, f), f = h[2], H.add(i, c, f), f = h[3], H.add(i, a, f), h[4] = i, t.fromCartesianArray(h, n, r);
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n.west = e.west, n.south = e.south, n.east = e.east, n.north = e.north, n) : new t(e.west, e.south, e.east, e.north);
	}
	static equalsEpsilon(t, e, n) {
		return n = n ?? 0, t === e || N(t) && N(e) && Math.abs(t.west - e.west) <= n && Math.abs(t.south - e.south) <= n && Math.abs(t.east - e.east) <= n && Math.abs(t.north - e.north) <= n;
	}
	clone(e) {
		return t.clone(this, e);
	}
	equals(e) {
		return t.equals(this, e);
	}
	static equals(t, e) {
		return t === e || N(t) && N(e) && t.west === e.west && t.south === e.south && t.east === e.east && t.north === e.north;
	}
	equalsEpsilon(e, n) {
		return t.equalsEpsilon(this, e, n);
	}
	static _validate(t) {
		M.typeOf.object("rectangle", t);
		const e = t.north;
		M.typeOf.number.greaterThanOrEquals("north", e, -D.PI_OVER_TWO), M.typeOf.number.lessThanOrEquals("north", e, D.PI_OVER_TWO);
		const n = t.south;
		M.typeOf.number.greaterThanOrEquals("south", n, -D.PI_OVER_TWO), M.typeOf.number.lessThanOrEquals("south", n, D.PI_OVER_TWO);
		const r = t.west;
		M.typeOf.number.greaterThanOrEquals("west", r, -Math.PI), M.typeOf.number.lessThanOrEquals("west", r, Math.PI);
		const i = t.east;
		M.typeOf.number.greaterThanOrEquals("east", i, -Math.PI), M.typeOf.number.lessThanOrEquals("east", i, Math.PI);
	}
	static southwest(t, e) {
		return M.typeOf.object("rectangle", t), N(e) ? (e.longitude = t.west, e.latitude = t.south, e.height = 0, e) : new rt(t.west, t.south);
	}
	static northwest(t, e) {
		return M.typeOf.object("rectangle", t), N(e) ? (e.longitude = t.west, e.latitude = t.north, e.height = 0, e) : new rt(t.west, t.north);
	}
	static northeast(t, e) {
		return M.typeOf.object("rectangle", t), N(e) ? (e.longitude = t.east, e.latitude = t.north, e.height = 0, e) : new rt(t.east, t.north);
	}
	static southeast(t, e) {
		return M.typeOf.object("rectangle", t), N(e) ? (e.longitude = t.east, e.latitude = t.south, e.height = 0, e) : new rt(t.east, t.south);
	}
	static center(t, e) {
		M.typeOf.object("rectangle", t);
		let n = t.east;
		const r = t.west;
		n < r && (n += D.TWO_PI);
		const i = D.negativePiToPi(.5 * (r + n)), o = .5 * (t.south + t.north);
		return N(e) ? (e.longitude = i, e.latitude = o, e.height = 0, e) : new rt(i, o);
	}
	static intersection(e, n, r) {
		M.typeOf.object("rectangle", e), M.typeOf.object("otherRectangle", n);
		let i = e.east, o = e.west, s = n.east, a = n.west;
		i < o && s > 0 ? i += D.TWO_PI : s < a && i > 0 && (s += D.TWO_PI), i < o && a < 0 ? a += D.TWO_PI : s < a && o < 0 && (o += D.TWO_PI);
		const u = D.negativePiToPi(Math.max(o, a)), c = D.negativePiToPi(Math.min(i, s));
		if ((e.west < e.east || n.west < n.east) && c <= u) return;
		const l = Math.max(e.south, n.south), h = Math.min(e.north, n.north);
		return l >= h ? void 0 : N(r) ? (r.west = u, r.south = l, r.east = c, r.north = h, r) : new t(u, l, c, h);
	}
	static simpleIntersection(e, n, r) {
		M.typeOf.object("rectangle", e), M.typeOf.object("otherRectangle", n);
		const i = Math.max(e.west, n.west), o = Math.max(e.south, n.south), s = Math.min(e.east, n.east), a = Math.min(e.north, n.north);
		if (!(o >= a || i >= s)) return N(r) ? (r.west = i, r.south = o, r.east = s, r.north = a, r) : new t(i, o, s, a);
	}
	static union(e, n, r) {
		M.typeOf.object("rectangle", e), M.typeOf.object("otherRectangle", n), N(r) || (r = new t());
		let i = e.east, o = e.west, s = n.east, a = n.west;
		i < o && s > 0 ? i += D.TWO_PI : s < a && i > 0 && (s += D.TWO_PI), i < o && a < 0 ? a += D.TWO_PI : s < a && o < 0 && (o += D.TWO_PI);
		const u = D.negativePiToPi(Math.min(o, a)), c = D.negativePiToPi(Math.max(i, s));
		return r.west = u, r.south = Math.min(e.south, n.south), r.east = c, r.north = Math.max(e.north, n.north), r;
	}
	static expand(e, n, r) {
		return M.typeOf.object("rectangle", e), M.typeOf.object("cartographic", n), N(r) || (r = new t()), r.west = Math.min(e.west, n.longitude), r.south = Math.min(e.south, n.latitude), r.east = Math.max(e.east, n.longitude), r.north = Math.max(e.north, n.latitude), r;
	}
	static contains(t, e) {
		M.typeOf.object("rectangle", t), M.typeOf.object("cartographic", e);
		let n = e.longitude;
		const r = e.latitude, i = t.west;
		let o = t.east;
		return o < i && (o += D.TWO_PI, n < 0 && (n += D.TWO_PI)), (n > i || D.equalsEpsilon(n, i, D.EPSILON14)) && (n < o || D.equalsEpsilon(n, o, D.EPSILON14)) && r >= t.south && r <= t.north;
	}
	static subsample(e, n, r, i) {
		M.typeOf.object("rectangle", e), n = n ?? ut.default, r = r ?? 0, N(i) || (i = []);
		let o = 0;
		const s = e.north, a = e.south, u = e.east, c = e.west, l = Bi;
		l.height = r, l.longitude = c, l.latitude = s, i[o] = n.cartographicToCartesian(l, i[o]), o++, l.longitude = u, i[o] = n.cartographicToCartesian(l, i[o]), o++, l.latitude = a, i[o] = n.cartographicToCartesian(l, i[o]), o++, l.longitude = c, i[o] = n.cartographicToCartesian(l, i[o]), o++, l.latitude = s < 0 ? s : a > 0 ? a : 0;
		for (let h = 1; h < 8; ++h) l.longitude = -Math.PI + h * D.PI_OVER_TWO, t.contains(e, l) && (i[o] = n.cartographicToCartesian(l, i[o]), o++);
		return 0 === l.latitude && (l.longitude = c, i[o] = n.cartographicToCartesian(l, i[o]), o++, l.longitude = u, i[o] = n.cartographicToCartesian(l, i[o]), o++), i.length = o, i;
	}
	static subsection(e, n, r, i, o, s) {
		if (M.typeOf.object("rectangle", e), M.typeOf.number.greaterThanOrEquals("westLerp", n, 0), M.typeOf.number.lessThanOrEquals("westLerp", n, 1), M.typeOf.number.greaterThanOrEquals("southLerp", r, 0), M.typeOf.number.lessThanOrEquals("southLerp", r, 1), M.typeOf.number.greaterThanOrEquals("eastLerp", i, 0), M.typeOf.number.lessThanOrEquals("eastLerp", i, 1), M.typeOf.number.greaterThanOrEquals("northLerp", o, 0), M.typeOf.number.lessThanOrEquals("northLerp", o, 1), M.typeOf.number.lessThanOrEquals("westLerp", n, i), M.typeOf.number.lessThanOrEquals("southLerp", r, o), N(s) || (s = new t()), e.west <= e.east) {
			const t = e.east - e.west;
			s.west = e.west + n * t, s.east = e.west + i * t;
		} else {
			const t = D.TWO_PI + e.east - e.west;
			s.west = D.negativePiToPi(e.west + n * t), s.east = D.negativePiToPi(e.west + i * t);
		}
		const a = e.north - e.south;
		return s.south = e.south + r * a, s.north = e.south + o * a, 1 === n && (s.west = e.east), 1 === i && (s.east = e.east), 1 === r && (s.south = e.north), 1 === o && (s.north = e.north), s;
	}
};
qi.packedLength = 4;
const Ui = new Pn(), Li = new H(), Di = new H(), zi = new H(), ji = new H(), Fi = new Array(5);
for (let Cf = 0; Cf < Fi.length; ++Cf) Fi[Cf] = new H();
const Bi = new rt();
function Gi(t, e, n, r) {
	this.x = t ?? 0, this.y = e ?? 0, this.width = n ?? 0, this.height = r ?? 0;
}
qi.MAX_VALUE = Object.freeze(new qi(-Math.PI, -D.PI_OVER_TWO, Math.PI, D.PI_OVER_TWO)), Gi.packedLength = 4, Gi.pack = function(t, e, n) {
	return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, e[n++] = t.x, e[n++] = t.y, e[n++] = t.width, e[n] = t.height, e;
}, Gi.unpack = function(t, e, n) {
	return M.defined("array", t), e = e ?? 0, N(n) || (n = new Gi()), n.x = t[e++], n.y = t[e++], n.width = t[e++], n.height = t[e], n;
}, Gi.fromPoints = function(t, e) {
	if (N(e) || (e = new Gi()), !N(t) || 0 === t.length) return e.x = 0, e.y = 0, e.width = 0, e.height = 0, e;
	const n = t.length;
	let r = t[0].x, i = t[0].y, o = t[0].x, s = t[0].y;
	for (let a = 1; a < n; a++) {
		const e = t[a], n = e.x, u = e.y;
		r = Math.min(n, r), o = Math.max(n, o), i = Math.min(u, i), s = Math.max(u, s);
	}
	return e.x = r, e.y = i, e.width = o - r, e.height = s - i, e;
};
const ki = new wt(), Wi = new rt(), Vi = new rt();
function Hi(t, e) {
	this.start = t ?? 0, this.stop = e ?? 0;
}
Gi.fromRectangle = function(t, e, n) {
	if (N(n) || (n = new Gi()), !N(t)) return n.x = 0, n.y = 0, n.width = 0, n.height = 0, n;
	ki._ellipsoid = ut.default;
	const r = (e = e ?? ki).project(qi.southwest(t, Wi)), i = e.project(qi.northeast(t, Vi));
	return F.subtract(i, r, i), n.x = r.x, n.y = r.y, n.width = i.x, n.height = i.y, n;
}, Gi.clone = function(t, e) {
	if (N(t)) return N(e) ? (e.x = t.x, e.y = t.y, e.width = t.width, e.height = t.height, e) : new Gi(t.x, t.y, t.width, t.height);
}, Gi.union = function(t, e, n) {
	M.typeOf.object("left", t), M.typeOf.object("right", e), N(n) || (n = new Gi());
	const r = Math.min(t.x, e.x), i = Math.min(t.y, e.y), o = Math.max(t.x + t.width, e.x + e.width), s = Math.max(t.y + t.height, e.y + e.height);
	return n.x = r, n.y = i, n.width = o - r, n.height = s - i, n;
}, Gi.expand = function(t, e, n) {
	M.typeOf.object("rectangle", t), M.typeOf.object("point", e), n = Gi.clone(t, n);
	const r = e.x - n.x, i = e.y - n.y;
	return r > n.width ? n.width = r : r < 0 && (n.width -= r, n.x = e.x), i > n.height ? n.height = i : i < 0 && (n.height -= i, n.y = e.y), n;
}, Gi.intersect = function(t, e) {
	M.typeOf.object("left", t), M.typeOf.object("right", e);
	const n = t.x, r = t.y, i = e.x, o = e.y;
	return n > i + e.width || n + t.width < i || r + t.height < o || r > o + e.height ? Et.OUTSIDE : Et.INTERSECTING;
}, Gi.equals = function(t, e) {
	return t === e || N(t) && N(e) && t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height;
}, Gi.prototype.clone = function(t) {
	return Gi.clone(this, t);
}, Gi.prototype.intersect = function(t) {
	return Gi.intersect(this, t);
}, Gi.prototype.equals = function(t) {
	return Gi.equals(this, t);
};
var Xi = class t {
	constructor(t, e) {
		this.center = H.clone(t ?? H.ZERO), this.radius = e ?? 0;
	}
	static fromPoints(e, n) {
		if (N(n) || (n = new t()), !N(e) || 0 === e.length) return n.center = H.clone(H.ZERO, n.center), n.radius = 0, n;
		const r = H.clone(e[0], to), i = H.clone(r, Yi), o = H.clone(r, $i), s = H.clone(r, Zi), a = H.clone(r, Qi), u = H.clone(r, Ki), c = H.clone(r, Ji), l = e.length;
		let h;
		for (h = 1; h < l; h++) {
			H.clone(e[h], r);
			const t = r.x, n = r.y, l = r.z;
			t < i.x && H.clone(r, i), t > a.x && H.clone(r, a), n < o.y && H.clone(r, o), n > u.y && H.clone(r, u), l < s.z && H.clone(r, s), l > c.z && H.clone(r, c);
		}
		const f = H.magnitudeSquared(H.subtract(a, i, eo)), p = H.magnitudeSquared(H.subtract(u, o, eo)), d = H.magnitudeSquared(H.subtract(c, s, eo));
		let m = i, y = a, g = f;
		p > g && (g = p, m = o, y = u), d > g && (g = d, m = s, y = c);
		const w = no;
		w.x = .5 * (m.x + y.x), w.y = .5 * (m.y + y.y), w.z = .5 * (m.z + y.z);
		let E = H.magnitudeSquared(H.subtract(y, w, eo)), _ = Math.sqrt(E);
		const O = ro;
		O.x = i.x, O.y = o.y, O.z = s.z;
		const b = io;
		b.x = a.x, b.y = u.y, b.z = c.z;
		const T = H.midpoint(O, b, oo);
		let A = 0;
		for (h = 0; h < l; h++) {
			H.clone(e[h], r);
			const t = H.magnitude(H.subtract(r, T, eo));
			t > A && (A = t);
			const n = H.magnitudeSquared(H.subtract(r, w, eo));
			if (n > E) {
				const t = Math.sqrt(n);
				_ = .5 * (_ + t), E = _ * _;
				const e = t - _;
				w.x = (_ * w.x + e * r.x) / t, w.y = (_ * w.y + e * r.y) / t, w.z = (_ * w.z + e * r.z) / t;
			}
		}
		return _ < A ? (H.clone(w, n.center), n.radius = _) : (H.clone(T, n.center), n.radius = A), n;
	}
	static fromRectangle2D(e, n, r) {
		return t.fromRectangleWithHeights2D(e, n, 0, 0, r);
	}
	static fromRectangleWithHeights2D(e, n, r, i, o) {
		if (N(o) || (o = new t()), !N(e)) return o.center = H.clone(H.ZERO, o.center), o.radius = 0, o;
		ao._ellipsoid = ut.default, n = n ?? ao, qi.southwest(e, lo), lo.height = r, qi.northeast(e, ho), ho.height = i;
		const s = n.project(lo, uo), a = n.project(ho, co), u = a.x - s.x, c = a.y - s.y, l = a.z - s.z;
		o.radius = .5 * Math.sqrt(u * u + c * c + l * l);
		const h = o.center;
		return h.x = s.x + .5 * u, h.y = s.y + .5 * c, h.z = s.z + .5 * l, o;
	}
	static fromRectangle3D(e, n, r, i) {
		if (n = n ?? ut.default, r = r ?? 0, N(i) || (i = new t()), !N(e)) return i.center = H.clone(H.ZERO, i.center), i.radius = 0, i;
		const o = qi.subsample(e, n, r, fo);
		return t.fromPoints(o, i);
	}
	static fromVertices(e, n, r, i) {
		if (N(i) || (i = new t()), !N(e) || 0 === e.length) return i.center = H.clone(H.ZERO, i.center), i.radius = 0, i;
		n = n ?? H.ZERO, r = r ?? 3, M.typeOf.number.greaterThanOrEquals("stride", r, 3);
		const o = to;
		o.x = e[0] + n.x, o.y = e[1] + n.y, o.z = e[2] + n.z;
		const s = H.clone(o, Yi), a = H.clone(o, $i), u = H.clone(o, Zi), c = H.clone(o, Qi), l = H.clone(o, Ki), h = H.clone(o, Ji), f = e.length;
		let p;
		for (p = 0; p < f; p += r) {
			const t = e[p] + n.x, r = e[p + 1] + n.y, i = e[p + 2] + n.z;
			o.x = t, o.y = r, o.z = i, t < s.x && H.clone(o, s), t > c.x && H.clone(o, c), r < a.y && H.clone(o, a), r > l.y && H.clone(o, l), i < u.z && H.clone(o, u), i > h.z && H.clone(o, h);
		}
		const d = H.magnitudeSquared(H.subtract(c, s, eo)), m = H.magnitudeSquared(H.subtract(l, a, eo)), y = H.magnitudeSquared(H.subtract(h, u, eo));
		let g = s, w = c, E = d;
		m > E && (E = m, g = a, w = l), y > E && (E = y, g = u, w = h);
		const _ = no;
		_.x = .5 * (g.x + w.x), _.y = .5 * (g.y + w.y), _.z = .5 * (g.z + w.z);
		let O = H.magnitudeSquared(H.subtract(w, _, eo)), b = Math.sqrt(O);
		const T = ro;
		T.x = s.x, T.y = a.y, T.z = u.z;
		const A = io;
		A.x = c.x, A.y = l.y, A.z = h.z;
		const x = H.midpoint(T, A, oo);
		let R = 0;
		for (p = 0; p < f; p += r) {
			o.x = e[p] + n.x, o.y = e[p + 1] + n.y, o.z = e[p + 2] + n.z;
			const t = H.magnitude(H.subtract(o, x, eo));
			t > R && (R = t);
			const r = H.magnitudeSquared(H.subtract(o, _, eo));
			if (r > O) {
				const t = Math.sqrt(r);
				b = .5 * (b + t), O = b * b;
				const e = t - b;
				_.x = (b * _.x + e * o.x) / t, _.y = (b * _.y + e * o.y) / t, _.z = (b * _.z + e * o.z) / t;
			}
		}
		return b < R ? (H.clone(_, i.center), i.radius = b) : (H.clone(x, i.center), i.radius = R), i;
	}
	static fromEncodedCartesianVertices(e, n, r) {
		if (N(r) || (r = new t()), !N(e) || !N(n) || e.length !== n.length || 0 === e.length) return r.center = H.clone(H.ZERO, r.center), r.radius = 0, r;
		const i = to;
		i.x = e[0] + n[0], i.y = e[1] + n[1], i.z = e[2] + n[2];
		const o = H.clone(i, Yi), s = H.clone(i, $i), a = H.clone(i, Zi), u = H.clone(i, Qi), c = H.clone(i, Ki), l = H.clone(i, Ji), h = e.length;
		let f;
		for (f = 0; f < h; f += 3) {
			const t = e[f] + n[f], r = e[f + 1] + n[f + 1], h = e[f + 2] + n[f + 2];
			i.x = t, i.y = r, i.z = h, t < o.x && H.clone(i, o), t > u.x && H.clone(i, u), r < s.y && H.clone(i, s), r > c.y && H.clone(i, c), h < a.z && H.clone(i, a), h > l.z && H.clone(i, l);
		}
		const p = H.magnitudeSquared(H.subtract(u, o, eo)), d = H.magnitudeSquared(H.subtract(c, s, eo)), m = H.magnitudeSquared(H.subtract(l, a, eo));
		let y = o, g = u, w = p;
		d > w && (w = d, y = s, g = c), m > w && (w = m, y = a, g = l);
		const E = no;
		E.x = .5 * (y.x + g.x), E.y = .5 * (y.y + g.y), E.z = .5 * (y.z + g.z);
		let _ = H.magnitudeSquared(H.subtract(g, E, eo)), O = Math.sqrt(_);
		const b = ro;
		b.x = o.x, b.y = s.y, b.z = a.z;
		const T = io;
		T.x = u.x, T.y = c.y, T.z = l.z;
		const A = H.midpoint(b, T, oo);
		let x = 0;
		for (f = 0; f < h; f += 3) {
			i.x = e[f] + n[f], i.y = e[f + 1] + n[f + 1], i.z = e[f + 2] + n[f + 2];
			const t = H.magnitude(H.subtract(i, A, eo));
			t > x && (x = t);
			const r = H.magnitudeSquared(H.subtract(i, E, eo));
			if (r > _) {
				const t = Math.sqrt(r);
				O = .5 * (O + t), _ = O * O;
				const e = t - O;
				E.x = (O * E.x + e * i.x) / t, E.y = (O * E.y + e * i.y) / t, E.z = (O * E.z + e * i.z) / t;
			}
		}
		return O < x ? (H.clone(E, r.center), r.radius = O) : (H.clone(A, r.center), r.radius = x), r;
	}
	static fromCornerPoints(e, n, r) {
		M.typeOf.object("corner", e), M.typeOf.object("oppositeCorner", n), N(r) || (r = new t());
		const i = H.midpoint(e, n, r.center);
		return r.radius = H.distance(i, n), r;
	}
	static fromEllipsoid(e, n) {
		return M.typeOf.object("ellipsoid", e), N(n) || (n = new t()), H.clone(H.ZERO, n.center), n.radius = e.maximumRadius, n;
	}
	static fromBoundingSpheres(e, n) {
		if (N(n) || (n = new t()), !N(e) || 0 === e.length) return n.center = H.clone(H.ZERO, n.center), n.radius = 0, n;
		const r = e.length;
		if (1 === r) return t.clone(e[0], n);
		if (2 === r) return t.union(e[0], e[1], n);
		const i = [];
		let o;
		for (o = 0; o < r; o++) i.push(e[o].center);
		const s = (n = t.fromPoints(i, n)).center;
		let a = n.radius;
		for (o = 0; o < r; o++) {
			const t = e[o];
			a = Math.max(a, H.distance(s, t.center) + t.radius);
		}
		return n.radius = a, n;
	}
	static fromOrientedBoundingBox(e, n) {
		M.defined("orientedBoundingBox", e), N(n) || (n = new t());
		const r = e.halfAxes, i = wn.getColumn(r, 0, po), o = wn.getColumn(r, 1, mo), s = wn.getColumn(r, 2, yo);
		return H.add(i, o, i), H.add(i, s, i), n.center = H.clone(e.center, n.center), n.radius = H.magnitude(i), n;
	}
	static fromTransformation(e, n) {
		M.typeOf.object("transformation", e), N(n) || (n = new t());
		const r = Pn.getTranslation(e, go), i = Pn.getScale(e, wo), o = .5 * H.magnitude(i);
		return n.center = H.clone(r, n.center), n.radius = o, n;
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n.center = H.clone(e.center, n.center), n.radius = e.radius, n) : new t(e.center, e.radius);
	}
	static pack(t, e, n) {
		M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0;
		const r = t.center;
		return e[n++] = r.x, e[n++] = r.y, e[n++] = r.z, e[n] = t.radius, e;
	}
	static unpack(e, n, r) {
		M.defined("array", e), n = n ?? 0, N(r) || (r = new t());
		const i = r.center;
		return i.x = e[n++], i.y = e[n++], i.z = e[n++], r.radius = e[n], r;
	}
	static union(e, n, r) {
		M.typeOf.object("left", e), M.typeOf.object("right", n), N(r) || (r = new t());
		const i = e.center, o = e.radius, s = n.center, a = n.radius, u = H.subtract(s, i, Eo), c = H.magnitude(u);
		if (o >= c + a) return e.clone(r), r;
		if (a >= c + o) return n.clone(r), r;
		const l = .5 * (o + c + a), h = H.multiplyByScalar(u, (-o + l) / c, _o);
		return H.add(h, i, h), H.clone(h, r.center), r.radius = l, r;
	}
	static expand(e, n, r) {
		M.typeOf.object("sphere", e), M.typeOf.object("point", n), r = t.clone(e, r);
		const i = H.magnitude(H.subtract(n, r.center, Oo));
		return i > r.radius && (r.radius = i), r;
	}
	static intersectPlane(t, e) {
		M.typeOf.object("sphere", t), M.typeOf.object("plane", e);
		const n = t.center, r = t.radius, i = e.normal, o = H.dot(i, n) + e.distance;
		return o < -r ? Et.OUTSIDE : o < r ? Et.INTERSECTING : Et.INSIDE;
	}
	static transform(e, n, r) {
		return M.typeOf.object("sphere", e), M.typeOf.object("transform", n), N(r) || (r = new t()), r.center = Pn.multiplyByPoint(n, e.center, r.center), r.radius = Pn.getMaximumScale(n) * e.radius, r;
	}
	static distanceSquaredTo(t, e) {
		M.typeOf.object("sphere", t), M.typeOf.object("cartesian", e);
		const n = H.subtract(t.center, e, bo), r = H.magnitude(n) - t.radius;
		return r <= 0 ? 0 : r * r;
	}
	static transformWithoutScale(e, n, r) {
		return M.typeOf.object("sphere", e), M.typeOf.object("transform", n), N(r) || (r = new t()), r.center = Pn.multiplyByPoint(n, e.center, r.center), r.radius = e.radius, r;
	}
	static computePlaneDistances(t, e, n, r) {
		M.typeOf.object("sphere", t), M.typeOf.object("position", e), M.typeOf.object("direction", n), N(r) || (r = new Hi());
		const i = H.subtract(t.center, e, To), o = H.dot(n, i);
		return r.start = o - t.radius, r.stop = o + t.radius, r;
	}
	static projectTo2D(e, n, r) {
		M.typeOf.object("sphere", e), Mo._ellipsoid = ut.default;
		const i = (n = n ?? Mo).ellipsoid;
		let o = e.center;
		const s = e.radius;
		let a;
		a = H.equals(o, H.ZERO) ? H.clone(H.UNIT_X, Ao) : i.geodeticSurfaceNormal(o, Ao);
		const u = H.cross(H.UNIT_Z, a, xo);
		H.normalize(u, u);
		const c = H.cross(a, u, Ro);
		H.normalize(c, c), H.multiplyByScalar(a, s, a), H.multiplyByScalar(c, s, c), H.multiplyByScalar(u, s, u);
		const l = H.negate(c, Io), h = H.negate(u, So), f = vo;
		let p = f[0];
		H.add(a, c, p), H.add(p, u, p), p = f[1], H.add(a, c, p), H.add(p, h, p), p = f[2], H.add(a, l, p), H.add(p, h, p), p = f[3], H.add(a, l, p), H.add(p, u, p), H.negate(a, a), p = f[4], H.add(a, c, p), H.add(p, u, p), p = f[5], H.add(a, c, p), H.add(p, h, p), p = f[6], H.add(a, l, p), H.add(p, h, p), p = f[7], H.add(a, l, p), H.add(p, u, p);
		const d = f.length;
		for (let t = 0; t < d; ++t) {
			const e = f[t];
			H.add(o, e, e);
			const r = i.cartesianToCartographic(e, No);
			n.project(r, e);
		}
		o = (r = t.fromPoints(f, r)).center;
		const m = o.x, y = o.y, g = o.z;
		return o.x = g, o.y = m, o.z = y, r;
	}
	static isOccluded(t, e) {
		return M.typeOf.object("sphere", t), M.typeOf.object("occluder", e), !e.isBoundingSphereVisible(t);
	}
	static equals(t, e) {
		return t === e || N(t) && N(e) && H.equals(t.center, e.center) && t.radius === e.radius;
	}
	intersectPlane(e) {
		return t.intersectPlane(this, e);
	}
	distanceSquaredTo(e) {
		return t.distanceSquaredTo(this, e);
	}
	computePlaneDistances(e, n, r) {
		return t.computePlaneDistances(this, e, n, r);
	}
	isOccluded(e) {
		return t.isOccluded(this, e);
	}
	equals(e) {
		return t.equals(this, e);
	}
	clone(e) {
		return t.clone(this, e);
	}
	volume() {
		const t = this.radius;
		return so * t * t * t;
	}
};
Xi.packedLength = 4;
const Yi = new H(), $i = new H(), Zi = new H(), Qi = new H(), Ki = new H(), Ji = new H(), to = new H(), eo = new H(), no = new H(), ro = new H(), io = new H(), oo = new H(), so = 4 / 3 * D.PI, ao = new wt(), uo = new H(), co = new H(), lo = new rt(), ho = new rt(), fo = [], po = new H(), mo = new H(), yo = new H(), go = new H(), wo = new H(), Eo = new H(), _o = new H(), Oo = new H(), bo = new H(), To = new H(), Ao = new H(), xo = new H(), Ro = new H(), So = new H(), Io = new H(), No = new rt(), vo = new Array(8);
for (let Cf = 0; Cf < 8; ++Cf) vo[Cf] = new H();
const Mo = new wt(), Po = {
	DEPTH_BUFFER_BIT: 256,
	STENCIL_BUFFER_BIT: 1024,
	COLOR_BUFFER_BIT: 16384,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	ZERO: 0,
	ONE: 1,
	SRC_COLOR: 768,
	ONE_MINUS_SRC_COLOR: 769,
	SRC_ALPHA: 770,
	ONE_MINUS_SRC_ALPHA: 771,
	DST_ALPHA: 772,
	ONE_MINUS_DST_ALPHA: 773,
	DST_COLOR: 774,
	ONE_MINUS_DST_COLOR: 775,
	SRC_ALPHA_SATURATE: 776,
	FUNC_ADD: 32774,
	BLEND_EQUATION: 32777,
	BLEND_EQUATION_RGB: 32777,
	BLEND_EQUATION_ALPHA: 34877,
	FUNC_SUBTRACT: 32778,
	FUNC_REVERSE_SUBTRACT: 32779,
	BLEND_DST_RGB: 32968,
	BLEND_SRC_RGB: 32969,
	BLEND_DST_ALPHA: 32970,
	BLEND_SRC_ALPHA: 32971,
	CONSTANT_COLOR: 32769,
	ONE_MINUS_CONSTANT_COLOR: 32770,
	CONSTANT_ALPHA: 32771,
	ONE_MINUS_CONSTANT_ALPHA: 32772,
	BLEND_COLOR: 32773,
	ARRAY_BUFFER: 34962,
	ELEMENT_ARRAY_BUFFER: 34963,
	ARRAY_BUFFER_BINDING: 34964,
	ELEMENT_ARRAY_BUFFER_BINDING: 34965,
	STREAM_DRAW: 35040,
	STATIC_DRAW: 35044,
	DYNAMIC_DRAW: 35048,
	BUFFER_SIZE: 34660,
	BUFFER_USAGE: 34661,
	CURRENT_VERTEX_ATTRIB: 34342,
	FRONT: 1028,
	BACK: 1029,
	FRONT_AND_BACK: 1032,
	CULL_FACE: 2884,
	BLEND: 3042,
	DITHER: 3024,
	STENCIL_TEST: 2960,
	DEPTH_TEST: 2929,
	SCISSOR_TEST: 3089,
	POLYGON_OFFSET_FILL: 32823,
	SAMPLE_ALPHA_TO_COVERAGE: 32926,
	SAMPLE_COVERAGE: 32928,
	NO_ERROR: 0,
	INVALID_ENUM: 1280,
	INVALID_VALUE: 1281,
	INVALID_OPERATION: 1282,
	OUT_OF_MEMORY: 1285,
	CW: 2304,
	CCW: 2305,
	LINE_WIDTH: 2849,
	ALIASED_POINT_SIZE_RANGE: 33901,
	ALIASED_LINE_WIDTH_RANGE: 33902,
	CULL_FACE_MODE: 2885,
	FRONT_FACE: 2886,
	DEPTH_RANGE: 2928,
	DEPTH_WRITEMASK: 2930,
	DEPTH_CLEAR_VALUE: 2931,
	DEPTH_FUNC: 2932,
	STENCIL_CLEAR_VALUE: 2961,
	STENCIL_FUNC: 2962,
	STENCIL_FAIL: 2964,
	STENCIL_PASS_DEPTH_FAIL: 2965,
	STENCIL_PASS_DEPTH_PASS: 2966,
	STENCIL_REF: 2967,
	STENCIL_VALUE_MASK: 2963,
	STENCIL_WRITEMASK: 2968,
	STENCIL_BACK_FUNC: 34816,
	STENCIL_BACK_FAIL: 34817,
	STENCIL_BACK_PASS_DEPTH_FAIL: 34818,
	STENCIL_BACK_PASS_DEPTH_PASS: 34819,
	STENCIL_BACK_REF: 36003,
	STENCIL_BACK_VALUE_MASK: 36004,
	STENCIL_BACK_WRITEMASK: 36005,
	VIEWPORT: 2978,
	SCISSOR_BOX: 3088,
	COLOR_CLEAR_VALUE: 3106,
	COLOR_WRITEMASK: 3107,
	UNPACK_ALIGNMENT: 3317,
	PACK_ALIGNMENT: 3333,
	MAX_TEXTURE_SIZE: 3379,
	MAX_VIEWPORT_DIMS: 3386,
	SUBPIXEL_BITS: 3408,
	RED_BITS: 3410,
	GREEN_BITS: 3411,
	BLUE_BITS: 3412,
	ALPHA_BITS: 3413,
	DEPTH_BITS: 3414,
	STENCIL_BITS: 3415,
	POLYGON_OFFSET_UNITS: 10752,
	POLYGON_OFFSET_FACTOR: 32824,
	TEXTURE_BINDING_2D: 32873,
	SAMPLE_BUFFERS: 32936,
	SAMPLES: 32937,
	SAMPLE_COVERAGE_VALUE: 32938,
	SAMPLE_COVERAGE_INVERT: 32939,
	COMPRESSED_TEXTURE_FORMATS: 34467,
	DONT_CARE: 4352,
	FASTEST: 4353,
	NICEST: 4354,
	GENERATE_MIPMAP_HINT: 33170,
	BYTE: 5120,
	UNSIGNED_BYTE: 5121,
	SHORT: 5122,
	UNSIGNED_SHORT: 5123,
	INT: 5124,
	UNSIGNED_INT: 5125,
	FLOAT: 5126,
	DEPTH_COMPONENT: 6402,
	ALPHA: 6406,
	RGB: 6407,
	RGBA: 6408,
	LUMINANCE: 6409,
	LUMINANCE_ALPHA: 6410,
	UNSIGNED_SHORT_4_4_4_4: 32819,
	UNSIGNED_SHORT_5_5_5_1: 32820,
	UNSIGNED_SHORT_5_6_5: 33635,
	FRAGMENT_SHADER: 35632,
	VERTEX_SHADER: 35633,
	MAX_VERTEX_ATTRIBS: 34921,
	MAX_VERTEX_UNIFORM_VECTORS: 36347,
	MAX_VARYING_VECTORS: 36348,
	MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
	MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
	MAX_TEXTURE_IMAGE_UNITS: 34930,
	MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
	SHADER_TYPE: 35663,
	DELETE_STATUS: 35712,
	LINK_STATUS: 35714,
	VALIDATE_STATUS: 35715,
	ATTACHED_SHADERS: 35717,
	ACTIVE_UNIFORMS: 35718,
	ACTIVE_ATTRIBUTES: 35721,
	SHADING_LANGUAGE_VERSION: 35724,
	CURRENT_PROGRAM: 35725,
	NEVER: 512,
	LESS: 513,
	EQUAL: 514,
	LEQUAL: 515,
	GREATER: 516,
	NOTEQUAL: 517,
	GEQUAL: 518,
	ALWAYS: 519,
	KEEP: 7680,
	REPLACE: 7681,
	INCR: 7682,
	DECR: 7683,
	INVERT: 5386,
	INCR_WRAP: 34055,
	DECR_WRAP: 34056,
	VENDOR: 7936,
	RENDERER: 7937,
	VERSION: 7938,
	NEAREST: 9728,
	LINEAR: 9729,
	NEAREST_MIPMAP_NEAREST: 9984,
	LINEAR_MIPMAP_NEAREST: 9985,
	NEAREST_MIPMAP_LINEAR: 9986,
	LINEAR_MIPMAP_LINEAR: 9987,
	TEXTURE_MAG_FILTER: 10240,
	TEXTURE_MIN_FILTER: 10241,
	TEXTURE_WRAP_S: 10242,
	TEXTURE_WRAP_T: 10243,
	TEXTURE_2D: 3553,
	TEXTURE: 5890,
	TEXTURE_CUBE_MAP: 34067,
	TEXTURE_BINDING_CUBE_MAP: 34068,
	TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
	TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
	TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
	TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
	TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
	TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
	MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
	TEXTURE0: 33984,
	TEXTURE1: 33985,
	TEXTURE2: 33986,
	TEXTURE3: 33987,
	TEXTURE4: 33988,
	TEXTURE5: 33989,
	TEXTURE6: 33990,
	TEXTURE7: 33991,
	TEXTURE8: 33992,
	TEXTURE9: 33993,
	TEXTURE10: 33994,
	TEXTURE11: 33995,
	TEXTURE12: 33996,
	TEXTURE13: 33997,
	TEXTURE14: 33998,
	TEXTURE15: 33999,
	TEXTURE16: 34e3,
	TEXTURE17: 34001,
	TEXTURE18: 34002,
	TEXTURE19: 34003,
	TEXTURE20: 34004,
	TEXTURE21: 34005,
	TEXTURE22: 34006,
	TEXTURE23: 34007,
	TEXTURE24: 34008,
	TEXTURE25: 34009,
	TEXTURE26: 34010,
	TEXTURE27: 34011,
	TEXTURE28: 34012,
	TEXTURE29: 34013,
	TEXTURE30: 34014,
	TEXTURE31: 34015,
	ACTIVE_TEXTURE: 34016,
	REPEAT: 10497,
	CLAMP_TO_EDGE: 33071,
	MIRRORED_REPEAT: 33648,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	INT_VEC2: 35667,
	INT_VEC3: 35668,
	INT_VEC4: 35669,
	BOOL: 35670,
	BOOL_VEC2: 35671,
	BOOL_VEC3: 35672,
	BOOL_VEC4: 35673,
	FLOAT_MAT2: 35674,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	SAMPLER_2D: 35678,
	SAMPLER_CUBE: 35680,
	VERTEX_ATTRIB_ARRAY_ENABLED: 34338,
	VERTEX_ATTRIB_ARRAY_SIZE: 34339,
	VERTEX_ATTRIB_ARRAY_STRIDE: 34340,
	VERTEX_ATTRIB_ARRAY_TYPE: 34341,
	VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922,
	VERTEX_ATTRIB_ARRAY_POINTER: 34373,
	VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975,
	IMPLEMENTATION_COLOR_READ_TYPE: 35738,
	IMPLEMENTATION_COLOR_READ_FORMAT: 35739,
	COMPILE_STATUS: 35713,
	LOW_FLOAT: 36336,
	MEDIUM_FLOAT: 36337,
	HIGH_FLOAT: 36338,
	LOW_INT: 36339,
	MEDIUM_INT: 36340,
	HIGH_INT: 36341,
	FRAMEBUFFER: 36160,
	RENDERBUFFER: 36161,
	RGBA4: 32854,
	RGB5_A1: 32855,
	RGB565: 36194,
	DEPTH_COMPONENT16: 33189,
	STENCIL_INDEX: 6401,
	STENCIL_INDEX8: 36168,
	DEPTH_STENCIL: 34041,
	RENDERBUFFER_WIDTH: 36162,
	RENDERBUFFER_HEIGHT: 36163,
	RENDERBUFFER_INTERNAL_FORMAT: 36164,
	RENDERBUFFER_RED_SIZE: 36176,
	RENDERBUFFER_GREEN_SIZE: 36177,
	RENDERBUFFER_BLUE_SIZE: 36178,
	RENDERBUFFER_ALPHA_SIZE: 36179,
	RENDERBUFFER_DEPTH_SIZE: 36180,
	RENDERBUFFER_STENCIL_SIZE: 36181,
	FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048,
	FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049,
	FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050,
	FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051,
	COLOR_ATTACHMENT0: 36064,
	DEPTH_ATTACHMENT: 36096,
	STENCIL_ATTACHMENT: 36128,
	DEPTH_STENCIL_ATTACHMENT: 33306,
	NONE: 0,
	FRAMEBUFFER_COMPLETE: 36053,
	FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054,
	FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055,
	FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057,
	FRAMEBUFFER_UNSUPPORTED: 36061,
	FRAMEBUFFER_BINDING: 36006,
	RENDERBUFFER_BINDING: 36007,
	MAX_RENDERBUFFER_SIZE: 34024,
	INVALID_FRAMEBUFFER_OPERATION: 1286,
	UNPACK_FLIP_Y_WEBGL: 37440,
	UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
	CONTEXT_LOST_WEBGL: 37442,
	UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443,
	BROWSER_DEFAULT_WEBGL: 37444,
	COMPRESSED_RGB_S3TC_DXT1_EXT: 33776,
	COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777,
	COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778,
	COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779,
	COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 35840,
	COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 35841,
	COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 35842,
	COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 35843,
	COMPRESSED_RGBA_ASTC_4x4_WEBGL: 37808,
	COMPRESSED_RGB_ETC1_WEBGL: 36196,
	COMPRESSED_RGBA_BPTC_UNORM: 36492,
	HALF_FLOAT_OES: 36193,
	DOUBLE: 5130,
	READ_BUFFER: 3074,
	UNPACK_ROW_LENGTH: 3314,
	UNPACK_SKIP_ROWS: 3315,
	UNPACK_SKIP_PIXELS: 3316,
	PACK_ROW_LENGTH: 3330,
	PACK_SKIP_ROWS: 3331,
	PACK_SKIP_PIXELS: 3332,
	COLOR: 6144,
	DEPTH: 6145,
	STENCIL: 6146,
	RED: 6403,
	RGB8: 32849,
	RGBA8: 32856,
	RGB10_A2: 32857,
	TEXTURE_BINDING_3D: 32874,
	UNPACK_SKIP_IMAGES: 32877,
	UNPACK_IMAGE_HEIGHT: 32878,
	TEXTURE_3D: 32879,
	TEXTURE_WRAP_R: 32882,
	MAX_3D_TEXTURE_SIZE: 32883,
	UNSIGNED_INT_2_10_10_10_REV: 33640,
	MAX_ELEMENTS_VERTICES: 33e3,
	MAX_ELEMENTS_INDICES: 33001,
	TEXTURE_MIN_LOD: 33082,
	TEXTURE_MAX_LOD: 33083,
	TEXTURE_BASE_LEVEL: 33084,
	TEXTURE_MAX_LEVEL: 33085,
	MIN: 32775,
	MAX: 32776,
	DEPTH_COMPONENT24: 33190,
	MAX_TEXTURE_LOD_BIAS: 34045,
	TEXTURE_COMPARE_MODE: 34892,
	TEXTURE_COMPARE_FUNC: 34893,
	CURRENT_QUERY: 34917,
	QUERY_RESULT: 34918,
	QUERY_RESULT_AVAILABLE: 34919,
	STREAM_READ: 35041,
	STREAM_COPY: 35042,
	STATIC_READ: 35045,
	STATIC_COPY: 35046,
	DYNAMIC_READ: 35049,
	DYNAMIC_COPY: 35050,
	MAX_DRAW_BUFFERS: 34852,
	DRAW_BUFFER0: 34853,
	DRAW_BUFFER1: 34854,
	DRAW_BUFFER2: 34855,
	DRAW_BUFFER3: 34856,
	DRAW_BUFFER4: 34857,
	DRAW_BUFFER5: 34858,
	DRAW_BUFFER6: 34859,
	DRAW_BUFFER7: 34860,
	DRAW_BUFFER8: 34861,
	DRAW_BUFFER9: 34862,
	DRAW_BUFFER10: 34863,
	DRAW_BUFFER11: 34864,
	DRAW_BUFFER12: 34865,
	DRAW_BUFFER13: 34866,
	DRAW_BUFFER14: 34867,
	DRAW_BUFFER15: 34868,
	MAX_FRAGMENT_UNIFORM_COMPONENTS: 35657,
	MAX_VERTEX_UNIFORM_COMPONENTS: 35658,
	SAMPLER_3D: 35679,
	SAMPLER_2D_SHADOW: 35682,
	FRAGMENT_SHADER_DERIVATIVE_HINT: 35723,
	PIXEL_PACK_BUFFER: 35051,
	PIXEL_UNPACK_BUFFER: 35052,
	PIXEL_PACK_BUFFER_BINDING: 35053,
	PIXEL_UNPACK_BUFFER_BINDING: 35055,
	FLOAT_MAT2x3: 35685,
	FLOAT_MAT2x4: 35686,
	FLOAT_MAT3x2: 35687,
	FLOAT_MAT3x4: 35688,
	FLOAT_MAT4x2: 35689,
	FLOAT_MAT4x3: 35690,
	SRGB: 35904,
	SRGB8: 35905,
	SRGB8_ALPHA8: 35907,
	COMPARE_REF_TO_TEXTURE: 34894,
	RGBA32F: 34836,
	RGB32F: 34837,
	RGBA16F: 34842,
	RGB16F: 34843,
	VERTEX_ATTRIB_ARRAY_INTEGER: 35069,
	MAX_ARRAY_TEXTURE_LAYERS: 35071,
	MIN_PROGRAM_TEXEL_OFFSET: 35076,
	MAX_PROGRAM_TEXEL_OFFSET: 35077,
	MAX_VARYING_COMPONENTS: 35659,
	TEXTURE_2D_ARRAY: 35866,
	TEXTURE_BINDING_2D_ARRAY: 35869,
	R11F_G11F_B10F: 35898,
	UNSIGNED_INT_10F_11F_11F_REV: 35899,
	RGB9_E5: 35901,
	UNSIGNED_INT_5_9_9_9_REV: 35902,
	TRANSFORM_FEEDBACK_BUFFER_MODE: 35967,
	MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 35968,
	TRANSFORM_FEEDBACK_VARYINGS: 35971,
	TRANSFORM_FEEDBACK_BUFFER_START: 35972,
	TRANSFORM_FEEDBACK_BUFFER_SIZE: 35973,
	TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 35976,
	RASTERIZER_DISCARD: 35977,
	MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 35978,
	MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 35979,
	INTERLEAVED_ATTRIBS: 35980,
	SEPARATE_ATTRIBS: 35981,
	TRANSFORM_FEEDBACK_BUFFER: 35982,
	TRANSFORM_FEEDBACK_BUFFER_BINDING: 35983,
	RGBA32UI: 36208,
	RGB32UI: 36209,
	RGBA16UI: 36214,
	RGB16UI: 36215,
	RGBA8UI: 36220,
	RGB8UI: 36221,
	RGBA32I: 36226,
	RGB32I: 36227,
	RGBA16I: 36232,
	RGB16I: 36233,
	RGBA8I: 36238,
	RGB8I: 36239,
	RED_INTEGER: 36244,
	RGB_INTEGER: 36248,
	RGBA_INTEGER: 36249,
	SAMPLER_2D_ARRAY: 36289,
	SAMPLER_2D_ARRAY_SHADOW: 36292,
	SAMPLER_CUBE_SHADOW: 36293,
	UNSIGNED_INT_VEC2: 36294,
	UNSIGNED_INT_VEC3: 36295,
	UNSIGNED_INT_VEC4: 36296,
	INT_SAMPLER_2D: 36298,
	INT_SAMPLER_3D: 36299,
	INT_SAMPLER_CUBE: 36300,
	INT_SAMPLER_2D_ARRAY: 36303,
	UNSIGNED_INT_SAMPLER_2D: 36306,
	UNSIGNED_INT_SAMPLER_3D: 36307,
	UNSIGNED_INT_SAMPLER_CUBE: 36308,
	UNSIGNED_INT_SAMPLER_2D_ARRAY: 36311,
	DEPTH_COMPONENT32F: 36012,
	DEPTH32F_STENCIL8: 36013,
	FLOAT_32_UNSIGNED_INT_24_8_REV: 36269,
	FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 33296,
	FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 33297,
	FRAMEBUFFER_ATTACHMENT_RED_SIZE: 33298,
	FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 33299,
	FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 33300,
	FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 33301,
	FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 33302,
	FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 33303,
	FRAMEBUFFER_DEFAULT: 33304,
	UNSIGNED_INT_24_8: 34042,
	DEPTH24_STENCIL8: 35056,
	UNSIGNED_NORMALIZED: 35863,
	DRAW_FRAMEBUFFER_BINDING: 36006,
	READ_FRAMEBUFFER: 36008,
	DRAW_FRAMEBUFFER: 36009,
	READ_FRAMEBUFFER_BINDING: 36010,
	RENDERBUFFER_SAMPLES: 36011,
	FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 36052,
	MAX_COLOR_ATTACHMENTS: 36063,
	COLOR_ATTACHMENT1: 36065,
	COLOR_ATTACHMENT2: 36066,
	COLOR_ATTACHMENT3: 36067,
	COLOR_ATTACHMENT4: 36068,
	COLOR_ATTACHMENT5: 36069,
	COLOR_ATTACHMENT6: 36070,
	COLOR_ATTACHMENT7: 36071,
	COLOR_ATTACHMENT8: 36072,
	COLOR_ATTACHMENT9: 36073,
	COLOR_ATTACHMENT10: 36074,
	COLOR_ATTACHMENT11: 36075,
	COLOR_ATTACHMENT12: 36076,
	COLOR_ATTACHMENT13: 36077,
	COLOR_ATTACHMENT14: 36078,
	COLOR_ATTACHMENT15: 36079,
	FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 36182,
	MAX_SAMPLES: 36183,
	HALF_FLOAT: 5131,
	RG: 33319,
	RG_INTEGER: 33320,
	R8: 33321,
	RG8: 33323,
	R16F: 33325,
	R32F: 33326,
	RG16F: 33327,
	RG32F: 33328,
	R8I: 33329,
	R8UI: 33330,
	R16I: 33331,
	R16UI: 33332,
	R32I: 33333,
	R32UI: 33334,
	RG8I: 33335,
	RG8UI: 33336,
	RG16I: 33337,
	RG16UI: 33338,
	RG32I: 33339,
	RG32UI: 33340,
	VERTEX_ARRAY_BINDING: 34229,
	R8_SNORM: 36756,
	RG8_SNORM: 36757,
	RGB8_SNORM: 36758,
	RGBA8_SNORM: 36759,
	SIGNED_NORMALIZED: 36764,
	COPY_READ_BUFFER: 36662,
	COPY_WRITE_BUFFER: 36663,
	COPY_READ_BUFFER_BINDING: 36662,
	COPY_WRITE_BUFFER_BINDING: 36663,
	UNIFORM_BUFFER: 35345,
	UNIFORM_BUFFER_BINDING: 35368,
	UNIFORM_BUFFER_START: 35369,
	UNIFORM_BUFFER_SIZE: 35370,
	MAX_VERTEX_UNIFORM_BLOCKS: 35371,
	MAX_FRAGMENT_UNIFORM_BLOCKS: 35373,
	MAX_COMBINED_UNIFORM_BLOCKS: 35374,
	MAX_UNIFORM_BUFFER_BINDINGS: 35375,
	MAX_UNIFORM_BLOCK_SIZE: 35376,
	MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 35377,
	MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 35379,
	UNIFORM_BUFFER_OFFSET_ALIGNMENT: 35380,
	ACTIVE_UNIFORM_BLOCKS: 35382,
	UNIFORM_TYPE: 35383,
	UNIFORM_SIZE: 35384,
	UNIFORM_BLOCK_INDEX: 35386,
	UNIFORM_OFFSET: 35387,
	UNIFORM_ARRAY_STRIDE: 35388,
	UNIFORM_MATRIX_STRIDE: 35389,
	UNIFORM_IS_ROW_MAJOR: 35390,
	UNIFORM_BLOCK_BINDING: 35391,
	UNIFORM_BLOCK_DATA_SIZE: 35392,
	UNIFORM_BLOCK_ACTIVE_UNIFORMS: 35394,
	UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 35395,
	UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 35396,
	UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 35398,
	INVALID_INDEX: 4294967295,
	MAX_VERTEX_OUTPUT_COMPONENTS: 37154,
	MAX_FRAGMENT_INPUT_COMPONENTS: 37157,
	MAX_SERVER_WAIT_TIMEOUT: 37137,
	OBJECT_TYPE: 37138,
	SYNC_CONDITION: 37139,
	SYNC_STATUS: 37140,
	SYNC_FLAGS: 37141,
	SYNC_FENCE: 37142,
	SYNC_GPU_COMMANDS_COMPLETE: 37143,
	UNSIGNALED: 37144,
	SIGNALED: 37145,
	ALREADY_SIGNALED: 37146,
	TIMEOUT_EXPIRED: 37147,
	CONDITION_SATISFIED: 37148,
	WAIT_FAILED: 37149,
	SYNC_FLUSH_COMMANDS_BIT: 1,
	VERTEX_ATTRIB_ARRAY_DIVISOR: 35070,
	ANY_SAMPLES_PASSED: 35887,
	ANY_SAMPLES_PASSED_CONSERVATIVE: 36202,
	SAMPLER_BINDING: 35097,
	RGB10_A2UI: 36975,
	INT_2_10_10_10_REV: 36255,
	TRANSFORM_FEEDBACK: 36386,
	TRANSFORM_FEEDBACK_PAUSED: 36387,
	TRANSFORM_FEEDBACK_ACTIVE: 36388,
	TRANSFORM_FEEDBACK_BINDING: 36389,
	COMPRESSED_R11_EAC: 37488,
	COMPRESSED_SIGNED_R11_EAC: 37489,
	COMPRESSED_RG11_EAC: 37490,
	COMPRESSED_SIGNED_RG11_EAC: 37491,
	COMPRESSED_RGB8_ETC2: 37492,
	COMPRESSED_SRGB8_ETC2: 37493,
	COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37494,
	COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37495,
	COMPRESSED_RGBA8_ETC2_EAC: 37496,
	COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 37497,
	TEXTURE_IMMUTABLE_FORMAT: 37167,
	MAX_ELEMENT_INDEX: 36203,
	TEXTURE_IMMUTABLE_LEVELS: 33503,
	MAX_TEXTURE_MAX_ANISOTROPY_EXT: 34047
};
Object.freeze(Po);
const Co = {
	BYTE: Po.BYTE,
	UNSIGNED_BYTE: Po.UNSIGNED_BYTE,
	SHORT: Po.SHORT,
	UNSIGNED_SHORT: Po.UNSIGNED_SHORT,
	INT: Po.INT,
	UNSIGNED_INT: Po.UNSIGNED_INT,
	FLOAT: Po.FLOAT,
	DOUBLE: Po.DOUBLE,
	getSizeInBytes: function(t) {
		if (!N(t)) throw new v("value is required.");
		switch (t) {
			case Co.BYTE: return Int8Array.BYTES_PER_ELEMENT;
			case Co.UNSIGNED_BYTE: return Uint8Array.BYTES_PER_ELEMENT;
			case Co.SHORT: return Int16Array.BYTES_PER_ELEMENT;
			case Co.UNSIGNED_SHORT: return Uint16Array.BYTES_PER_ELEMENT;
			case Co.INT: return Int32Array.BYTES_PER_ELEMENT;
			case Co.UNSIGNED_INT: return Uint32Array.BYTES_PER_ELEMENT;
			case Co.FLOAT: return Float32Array.BYTES_PER_ELEMENT;
			case Co.DOUBLE: return Float64Array.BYTES_PER_ELEMENT;
			default: throw new v("componentDatatype is not a valid value.");
		}
	},
	fromTypedArray: function(t) {
		if (t instanceof Int8Array) return Co.BYTE;
		if (t instanceof Uint8Array) return Co.UNSIGNED_BYTE;
		if (t instanceof Int16Array) return Co.SHORT;
		if (t instanceof Uint16Array) return Co.UNSIGNED_SHORT;
		if (t instanceof Int32Array) return Co.INT;
		if (t instanceof Uint32Array) return Co.UNSIGNED_INT;
		if (t instanceof Float32Array) return Co.FLOAT;
		if (t instanceof Float64Array) return Co.DOUBLE;
		throw new v("array must be an Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, or Float64Array.");
	},
	validate: function(t) {
		return N(t) && (t === Co.BYTE || t === Co.UNSIGNED_BYTE || t === Co.SHORT || t === Co.UNSIGNED_SHORT || t === Co.INT || t === Co.UNSIGNED_INT || t === Co.FLOAT || t === Co.DOUBLE);
	},
	createTypedArray: function(t, e) {
		if (!N(t)) throw new v("componentDatatype is required.");
		if (!N(e)) throw new v("valuesOrLength is required.");
		switch (t) {
			case Co.BYTE: return new Int8Array(e);
			case Co.UNSIGNED_BYTE: return new Uint8Array(e);
			case Co.SHORT: return new Int16Array(e);
			case Co.UNSIGNED_SHORT: return new Uint16Array(e);
			case Co.INT: return new Int32Array(e);
			case Co.UNSIGNED_INT: return new Uint32Array(e);
			case Co.FLOAT: return new Float32Array(e);
			case Co.DOUBLE: return new Float64Array(e);
			default: throw new v("componentDatatype is not a valid value.");
		}
	},
	createArrayBufferView: function(t, e, n, r) {
		if (!N(t)) throw new v("componentDatatype is required.");
		if (!N(e)) throw new v("buffer is required.");
		switch (n = n ?? 0, r = r ?? (e.byteLength - n) / Co.getSizeInBytes(t), t) {
			case Co.BYTE: return new Int8Array(e, n, r);
			case Co.UNSIGNED_BYTE: return new Uint8Array(e, n, r);
			case Co.SHORT: return new Int16Array(e, n, r);
			case Co.UNSIGNED_SHORT: return new Uint16Array(e, n, r);
			case Co.INT: return new Int32Array(e, n, r);
			case Co.UNSIGNED_INT: return new Uint32Array(e, n, r);
			case Co.FLOAT: return new Float32Array(e, n, r);
			case Co.DOUBLE: return new Float64Array(e, n, r);
			default: throw new v("componentDatatype is not a valid value.");
		}
	},
	fromName: function(t) {
		switch (t) {
			case "BYTE": return Co.BYTE;
			case "UNSIGNED_BYTE": return Co.UNSIGNED_BYTE;
			case "SHORT": return Co.SHORT;
			case "UNSIGNED_SHORT": return Co.UNSIGNED_SHORT;
			case "INT": return Co.INT;
			case "UNSIGNED_INT": return Co.UNSIGNED_INT;
			case "FLOAT": return Co.FLOAT;
			case "DOUBLE": return Co.DOUBLE;
			default: throw new v("name is not a valid value.");
		}
	},
	dequantize: function(t, e) {
		switch (e) {
			case Co.BYTE: return Math.max(t / 127, -1);
			case Co.UNSIGNED_BYTE: return t / 255;
			case Co.SHORT: return Math.max(t / 32767, -1);
			case Co.UNSIGNED_SHORT: return t / 65535;
			case Co.INT: return Math.max(t / 2147483647, -1);
			case Co.UNSIGNED_INT: return t / 4294967295;
			default: throw new v("componentDatatype is not a valid integer type for dequantization.");
		}
	}
};
Object.freeze(Co);
const qo = {
	NONE: 0,
	TRIANGLES: 1,
	LINES: 2,
	POLYLINES: 3
};
Object.freeze(qo);
var Uo = class t {
	constructor(t, e, n, r) {
		this[0] = t ?? 0, this[1] = n ?? 0, this[2] = e ?? 0, this[3] = r ?? 0;
	}
	static pack(t, e, n) {
		return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, e[n++] = t[0], e[n++] = t[1], e[n++] = t[2], e[n++] = t[3], e;
	}
	static unpack(e, n, r) {
		return M.defined("array", e), n = n ?? 0, N(r) || (r = new t()), r[0] = e[n++], r[1] = e[n++], r[2] = e[n++], r[3] = e[n++], r;
	}
	static packArray(e, n) {
		M.defined("array", e);
		const r = e.length, i = 4 * r;
		if (N(n)) {
			if (!Array.isArray(n) && n.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 4 elements");
			n.length !== i && (n.length = i);
		} else n = new Array(i);
		for (let o = 0; o < r; ++o) t.pack(e[o], n, 4 * o);
		return n;
	}
	static unpackArray(e, n) {
		if (M.defined("array", e), M.typeOf.number.greaterThanOrEquals("array.length", e.length, 4), e.length % 4 != 0) throw new v("array length must be a multiple of 4.");
		const r = e.length;
		N(n) ? n.length = r / 4 : n = new Array(r / 4);
		for (let i = 0; i < r; i += 4) {
			const r = i / 4;
			n[r] = t.unpack(e, i, n[r]);
		}
		return n;
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n) : new t(e[0], e[2], e[1], e[3]);
	}
	static fromColumnMajorArray(e, n) {
		return M.defined("values", e), t.clone(e, n);
	}
	static fromRowMajorArray(e, n) {
		return M.defined("values", e), N(n) ? (n[0] = e[0], n[1] = e[2], n[2] = e[1], n[3] = e[3], n) : new t(e[0], e[1], e[2], e[3]);
	}
	static fromScale(e, n) {
		return M.typeOf.object("scale", e), N(n) ? (n[0] = e.x, n[1] = 0, n[2] = 0, n[3] = e.y, n) : new t(e.x, 0, 0, e.y);
	}
	static fromUniformScale(e, n) {
		return M.typeOf.number("scale", e), N(n) ? (n[0] = e, n[1] = 0, n[2] = 0, n[3] = e, n) : new t(e, 0, 0, e);
	}
	static fromRotation(e, n) {
		M.typeOf.number("angle", e);
		const r = Math.cos(e), i = Math.sin(e);
		return N(n) ? (n[0] = r, n[1] = i, n[2] = -i, n[3] = r, n) : new t(r, -i, i, r);
	}
	static toArray(t, e) {
		return M.typeOf.object("matrix", t), N(e) ? (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e) : [
			t[0],
			t[1],
			t[2],
			t[3]
		];
	}
	static getElementIndex(t, e) {
		return M.typeOf.number.greaterThanOrEquals("row", e, 0), M.typeOf.number.lessThanOrEquals("row", e, 1), M.typeOf.number.greaterThanOrEquals("column", t, 0), M.typeOf.number.lessThanOrEquals("column", t, 1), 2 * t + e;
	}
	static getColumn(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.number.greaterThanOrEquals("index", e, 0), M.typeOf.number.lessThanOrEquals("index", e, 1), M.typeOf.object("result", n);
		const r = 2 * e, i = t[r], o = t[r + 1];
		return n.x = i, n.y = o, n;
	}
	static setColumn(e, n, r, i) {
		M.typeOf.object("matrix", e), M.typeOf.number.greaterThanOrEquals("index", n, 0), M.typeOf.number.lessThanOrEquals("index", n, 1), M.typeOf.object("cartesian", r), M.typeOf.object("result", i);
		const o = 2 * n;
		return (i = t.clone(e, i))[o] = r.x, i[o + 1] = r.y, i;
	}
	static getRow(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.number.greaterThanOrEquals("index", e, 0), M.typeOf.number.lessThanOrEquals("index", e, 1), M.typeOf.object("result", n);
		const r = t[e], i = t[e + 2];
		return n.x = r, n.y = i, n;
	}
	static setRow(e, n, r, i) {
		return M.typeOf.object("matrix", e), M.typeOf.number.greaterThanOrEquals("index", n, 0), M.typeOf.number.lessThanOrEquals("index", n, 1), M.typeOf.object("cartesian", r), M.typeOf.object("result", i), (i = t.clone(e, i))[n] = r.x, i[n + 2] = r.y, i;
	}
	static setScale(e, n, r) {
		M.typeOf.object("matrix", e), M.typeOf.object("scale", n), M.typeOf.object("result", r);
		const i = t.getScale(e, Lo), o = n.x / i.x, s = n.y / i.y;
		return r[0] = e[0] * o, r[1] = e[1] * o, r[2] = e[2] * s, r[3] = e[3] * s, r;
	}
	static setUniformScale(e, n, r) {
		M.typeOf.object("matrix", e), M.typeOf.number("scale", n), M.typeOf.object("result", r);
		const i = t.getScale(e, Do), o = n / i.x, s = n / i.y;
		return r[0] = e[0] * o, r[1] = e[1] * o, r[2] = e[2] * s, r[3] = e[3] * s, r;
	}
	static getScale(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e.x = F.magnitude(F.fromElements(t[0], t[1], zo)), e.y = F.magnitude(F.fromElements(t[2], t[3], zo)), e;
	}
	static getMaximumScale(e) {
		return t.getScale(e, jo), F.maximumComponent(jo);
	}
	static setRotation(e, n, r) {
		M.typeOf.object("matrix", e), M.typeOf.object("result", r);
		const i = t.getScale(e, Fo);
		return r[0] = n[0] * i.x, r[1] = n[1] * i.x, r[2] = n[2] * i.y, r[3] = n[3] * i.y, r;
	}
	static getRotation(e, n) {
		M.typeOf.object("matrix", e), M.typeOf.object("result", n);
		const r = t.getScale(e, Bo);
		return n[0] = e[0] / r.x, n[1] = e[1] / r.x, n[2] = e[2] / r.y, n[3] = e[3] / r.y, n;
	}
	static multiply(t, e, n) {
		M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n);
		const r = t[0] * e[0] + t[2] * e[1], i = t[0] * e[2] + t[2] * e[3], o = t[1] * e[0] + t[3] * e[1], s = t[1] * e[2] + t[3] * e[3];
		return n[0] = r, n[1] = o, n[2] = i, n[3] = s, n;
	}
	static add(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n[0] = t[0] + e[0], n[1] = t[1] + e[1], n[2] = t[2] + e[2], n[3] = t[3] + e[3], n;
	}
	static subtract(t, e, n) {
		return M.typeOf.object("left", t), M.typeOf.object("right", e), M.typeOf.object("result", n), n[0] = t[0] - e[0], n[1] = t[1] - e[1], n[2] = t[2] - e[2], n[3] = t[3] - e[3], n;
	}
	static multiplyByVector(t, e, n) {
		M.typeOf.object("matrix", t), M.typeOf.object("cartesian", e), M.typeOf.object("result", n);
		const r = t[0] * e.x + t[2] * e.y, i = t[1] * e.x + t[3] * e.y;
		return n.x = r, n.y = i, n;
	}
	static multiplyByScalar(t, e, n) {
		return M.typeOf.object("matrix", t), M.typeOf.number("scalar", e), M.typeOf.object("result", n), n[0] = t[0] * e, n[1] = t[1] * e, n[2] = t[2] * e, n[3] = t[3] * e, n;
	}
	static multiplyByScale(t, e, n) {
		return M.typeOf.object("matrix", t), M.typeOf.object("scale", e), M.typeOf.object("result", n), n[0] = t[0] * e.x, n[1] = t[1] * e.x, n[2] = t[2] * e.y, n[3] = t[3] * e.y, n;
	}
	static multiplyByUniformScale(t, e, n) {
		return M.typeOf.object("matrix", t), M.typeOf.number("scale", e), M.typeOf.object("result", n), n[0] = t[0] * e, n[1] = t[1] * e, n[2] = t[2] * e, n[3] = t[3] * e, n;
	}
	static negate(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = -t[3], e;
	}
	static transpose(t, e) {
		M.typeOf.object("matrix", t), M.typeOf.object("result", e);
		const n = t[0], r = t[2], i = t[1], o = t[3];
		return e[0] = n, e[1] = r, e[2] = i, e[3] = o, e;
	}
	static abs(t, e) {
		return M.typeOf.object("matrix", t), M.typeOf.object("result", e), e[0] = Math.abs(t[0]), e[1] = Math.abs(t[1]), e[2] = Math.abs(t[2]), e[3] = Math.abs(t[3]), e;
	}
	static equals(t, e) {
		return t === e || N(t) && N(e) && t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3];
	}
	static equalsArray(t, e, n) {
		return t[0] === e[n] && t[1] === e[n + 1] && t[2] === e[n + 2] && t[3] === e[n + 3];
	}
	static equalsEpsilon(t, e, n) {
		return n = n ?? 0, t === e || N(t) && N(e) && Math.abs(t[0] - e[0]) <= n && Math.abs(t[1] - e[1]) <= n && Math.abs(t[2] - e[2]) <= n && Math.abs(t[3] - e[3]) <= n;
	}
	get length() {
		return t.packedLength;
	}
	clone(e) {
		return t.clone(this, e);
	}
	equals(e) {
		return t.equals(this, e);
	}
	equalsEpsilon(e, n) {
		return t.equalsEpsilon(this, e, n);
	}
	toString() {
		return `(${this[0]}, ${this[2]})\n(${this[1]}, ${this[3]})`;
	}
};
Uo.packedLength = 4, Uo.fromArray = Uo.unpack, Uo.IDENTITY = Object.freeze(new Uo(1, 0, 0, 1)), Uo.ZERO = Object.freeze(new Uo(0, 0, 0, 0)), Uo.COLUMN0ROW0 = 0, Uo.COLUMN0ROW1 = 1, Uo.COLUMN1ROW0 = 2, Uo.COLUMN1ROW1 = 3;
const Lo = new F(), Do = new F(), zo = new F(), jo = new F(), Fo = new F(), Bo = new F(), Go = {
	POINTS: Po.POINTS,
	LINES: Po.LINES,
	LINE_LOOP: Po.LINE_LOOP,
	LINE_STRIP: Po.LINE_STRIP,
	TRIANGLES: Po.TRIANGLES,
	TRIANGLE_STRIP: Po.TRIANGLE_STRIP,
	TRIANGLE_FAN: Po.TRIANGLE_FAN
};
function ko(t) {
	t = t ?? I.EMPTY_OBJECT, M.typeOf.object("options.attributes", t.attributes), this.attributes = t.attributes, this.indices = t.indices, this.primitiveType = t.primitiveType ?? Go.TRIANGLES, this.boundingSphere = t.boundingSphere, this.geometryType = t.geometryType ?? qo.NONE, this.boundingSphereCV = t.boundingSphereCV, this.offsetAttribute = t.offsetAttribute;
}
Go.isLines = function(t) {
	return t === Go.LINES || t === Go.LINE_LOOP || t === Go.LINE_STRIP;
}, Go.isTriangles = function(t) {
	return t === Go.TRIANGLES || t === Go.TRIANGLE_STRIP || t === Go.TRIANGLE_FAN;
}, Go.validate = function(t) {
	return t === Go.POINTS || t === Go.LINES || t === Go.LINE_LOOP || t === Go.LINE_STRIP || t === Go.TRIANGLES || t === Go.TRIANGLE_STRIP || t === Go.TRIANGLE_FAN;
}, Object.freeze(Go), ko.computeNumberOfVertices = function(t) {
	M.typeOf.object("geometry", t);
	let e = -1;
	for (const n in t.attributes) if (t.attributes.hasOwnProperty(n) && N(t.attributes[n]) && N(t.attributes[n].values)) {
		const r = t.attributes[n], i = r.values.length / r.componentsPerAttribute;
		if (e !== i && -1 !== e) throw new v("All attribute lists must have the same number of attributes.");
		e = i;
	}
	return e;
};
const Wo = new rt(), Vo = new H(), Ho = new Pn(), Xo = [
	new rt(),
	new rt(),
	new rt()
], Yo = [
	new F(),
	new F(),
	new F()
], $o = [
	new F(),
	new F(),
	new F()
], Zo = new H(), Qo = new br(), Ko = new Pn(), Jo = new Uo();
function ts(t) {
	if (!N((t = t ?? I.EMPTY_OBJECT).componentDatatype)) throw new v("options.componentDatatype is required.");
	if (!N(t.componentsPerAttribute)) throw new v("options.componentsPerAttribute is required.");
	if (t.componentsPerAttribute < 1 || t.componentsPerAttribute > 4) throw new v("options.componentsPerAttribute must be between 1 and 4.");
	if (!N(t.values)) throw new v("options.values is required.");
	this.componentDatatype = t.componentDatatype, this.componentsPerAttribute = t.componentsPerAttribute, this.normalize = t.normalize ?? !1, this.values = t.values;
}
function es(t) {
	t = t ?? I.EMPTY_OBJECT, this.position = t.position, this.normal = t.normal, this.st = t.st, this.bitangent = t.bitangent, this.tangent = t.tangent, this.color = t.color;
}
function ns(t) {
	t = t ?? I.EMPTY_OBJECT, this.position = t.position ?? !1, this.normal = t.normal ?? !1, this.st = t.st ?? !1, this.bitangent = t.bitangent ?? !1, this.tangent = t.tangent ?? !1, this.color = t.color ?? !1;
}
function rs(t) {
	if (!N((t = t ?? I.EMPTY_OBJECT).geometry)) throw new v("options.geometry is required.");
	this.geometry = t.geometry, this.modelMatrix = Pn.clone(t.modelMatrix ?? Pn.IDENTITY), this.id = t.id, this.pickPrimitive = t.pickPrimitive, this.attributes = t.attributes ?? {}, this.westHemisphereGeometry = void 0, this.eastHemisphereGeometry = void 0;
}
ko._textureCoordinateRotationPoints = function(t, e, n, r) {
	let i;
	const o = qi.center(r, Wo), s = rt.toCartesian(o, n, Vo), a = $r.eastNorthUpToFixedFrame(s, n, Ho), u = Pn.inverse(a, Ho), c = Yo, l = Xo;
	l[0].longitude = r.west, l[0].latitude = r.south, l[1].longitude = r.west, l[1].latitude = r.north, l[2].longitude = r.east, l[2].latitude = r.south;
	let h = Zo;
	for (i = 0; i < 3; i++) rt.toCartesian(l[i], n, h), h = Pn.multiplyByPointAsVector(u, h, h), c[i].x = h.x, c[i].y = h.y;
	const f = br.fromAxisAngle(H.UNIT_Z, -e, Qo), p = wn.fromQuaternion(f, Ko), d = t.length;
	let m = Number.POSITIVE_INFINITY, y = Number.POSITIVE_INFINITY, g = Number.NEGATIVE_INFINITY, w = Number.NEGATIVE_INFINITY;
	for (i = 0; i < d; i++) h = Pn.multiplyByPointAsVector(u, t[i], h), h = wn.multiplyByVector(p, h, h), m = Math.min(m, h.x), y = Math.min(y, h.y), g = Math.max(g, h.x), w = Math.max(w, h.y);
	const E = Uo.fromRotation(e, Jo), _ = $o;
	_[0].x = m, _[0].y = y, _[1].x = m, _[1].y = w, _[2].x = g, _[2].y = y;
	const O = c[0], b = c[2].x - O.x, T = c[1].y - O.y;
	for (i = 0; i < 3; i++) {
		const t = _[i];
		Uo.multiplyByVector(E, t, t), t.x = (t.x - O.x) / b, t.y = (t.y - O.y) / T;
	}
	const A = _[0], x = _[1], R = _[2], S = new Array(6);
	return F.pack(A, S), F.pack(x, S, 2), F.pack(R, S, 4), S;
}, ns.POSITION_ONLY = Object.freeze(new ns({ position: !0 })), ns.POSITION_AND_NORMAL = Object.freeze(new ns({
	position: !0,
	normal: !0
})), ns.POSITION_NORMAL_AND_ST = Object.freeze(new ns({
	position: !0,
	normal: !0,
	st: !0
})), ns.POSITION_AND_ST = Object.freeze(new ns({
	position: !0,
	st: !0
})), ns.POSITION_AND_COLOR = Object.freeze(new ns({
	position: !0,
	color: !0
})), ns.ALL = Object.freeze(new ns({
	position: !0,
	normal: !0,
	st: !0,
	tangent: !0,
	bitangent: !0
})), ns.DEFAULT = ns.POSITION_NORMAL_AND_ST, ns.packedLength = 6, ns.pack = function(t, e, n) {
	if (!N(t)) throw new v("value is required");
	if (!N(e)) throw new v("array is required");
	return n = n ?? 0, e[n++] = t.position ? 1 : 0, e[n++] = t.normal ? 1 : 0, e[n++] = t.st ? 1 : 0, e[n++] = t.tangent ? 1 : 0, e[n++] = t.bitangent ? 1 : 0, e[n] = t.color ? 1 : 0, e;
}, ns.unpack = function(t, e, n) {
	if (!N(t)) throw new v("array is required");
	return e = e ?? 0, N(n) || (n = new ns()), n.position = 1 === t[e++], n.normal = 1 === t[e++], n.st = 1 === t[e++], n.tangent = 1 === t[e++], n.bitangent = 1 === t[e++], n.color = 1 === t[e], n;
}, ns.clone = function(t, e) {
	if (N(t)) return N(e) || (e = new ns()), e.position = t.position, e.normal = t.normal, e.st = t.st, e.tangent = t.tangent, e.bitangent = t.bitangent, e.color = t.color, e;
};
const is = {
	SCALAR: "SCALAR",
	VEC2: "VEC2",
	VEC3: "VEC3",
	VEC4: "VEC4",
	MAT2: "MAT2",
	MAT3: "MAT3",
	MAT4: "MAT4",
	getMathType: function(t) {
		switch (t) {
			case is.SCALAR: return Number;
			case is.VEC2: return F;
			case is.VEC3: return H;
			case is.VEC4: return _t;
			case is.MAT2: return Uo;
			case is.MAT3: return wn;
			case is.MAT4: return Pn;
			default: throw new v("attributeType is not a valid value.");
		}
	},
	getNumberOfComponents: function(t) {
		switch (t) {
			case is.SCALAR: return 1;
			case is.VEC2: return 2;
			case is.VEC3: return 3;
			case is.VEC4:
			case is.MAT2: return 4;
			case is.MAT3: return 9;
			case is.MAT4: return 16;
			default: throw new v("attributeType is not a valid value.");
		}
	},
	getAttributeLocationCount: function(t) {
		switch (t) {
			case is.SCALAR:
			case is.VEC2:
			case is.VEC3:
			case is.VEC4: return 1;
			case is.MAT2: return 2;
			case is.MAT3: return 3;
			case is.MAT4: return 4;
			default: throw new v("attributeType is not a valid value.");
		}
	},
	getGlslType: function(t) {
		switch (M.typeOf.string("attributeType", t), t) {
			case is.SCALAR: return "float";
			case is.VEC2: return "vec2";
			case is.VEC3: return "vec3";
			case is.VEC4: return "vec4";
			case is.MAT2: return "mat2";
			case is.MAT3: return "mat3";
			case is.MAT4: return "mat4";
			default: throw new v("attributeType is not a valid value.");
		}
	}
};
Object.freeze(is);
const os = 1 / 256, ss = {
	octEncodeInRange: function(t, e, n) {
		M.defined("vector", t), M.defined("result", n);
		const r = H.magnitudeSquared(t);
		if (Math.abs(r - 1) > D.EPSILON6) throw new v("vector must be normalized.");
		if (n.x = t.x / (Math.abs(t.x) + Math.abs(t.y) + Math.abs(t.z)), n.y = t.y / (Math.abs(t.x) + Math.abs(t.y) + Math.abs(t.z)), t.z < 0) {
			const t = n.x, e = n.y;
			n.x = (1 - Math.abs(e)) * D.signNotZero(t), n.y = (1 - Math.abs(t)) * D.signNotZero(e);
		}
		return n.x = D.toSNorm(n.x, e), n.y = D.toSNorm(n.y, e), n;
	},
	octEncode: function(t, e) {
		return ss.octEncodeInRange(t, 255, e);
	}
}, as = new F(), us = /* @__PURE__ */ new Uint8Array(1);
function cs(t) {
	return us[0] = t, us[0];
}
ss.octEncodeToCartesian4 = function(t, e) {
	return ss.octEncodeInRange(t, 65535, as), e.x = cs(as.x * os), e.y = cs(as.x), e.z = cs(as.y * os), e.w = cs(as.y), e;
}, ss.octDecodeInRange = function(t, e, n, r) {
	if (M.defined("result", r), t < 0 || t > n || e < 0 || e > n) throw new v(`x and y must be unsigned normalized integers between 0 and ${n}`);
	if (r.x = D.fromSNorm(t, n), r.y = D.fromSNorm(e, n), r.z = 1 - (Math.abs(r.x) + Math.abs(r.y)), r.z < 0) {
		const t = r.x;
		r.x = (1 - Math.abs(r.y)) * D.signNotZero(t), r.y = (1 - Math.abs(t)) * D.signNotZero(r.y);
	}
	return H.normalize(r, r);
}, ss.octDecode = function(t, e, n) {
	return ss.octDecodeInRange(t, e, 255, n);
}, ss.octDecodeFromCartesian4 = function(t, e) {
	M.typeOf.object("encoded", t), M.typeOf.object("result", e);
	const n = t.x, r = t.y, i = t.z, o = t.w;
	if (n < 0 || n > 255 || r < 0 || r > 255 || i < 0 || i > 255 || o < 0 || o > 255) throw new v("x, y, z, and w must be unsigned normalized integers between 0 and 255");
	const s = 256 * n + r, a = 256 * i + o;
	return ss.octDecodeInRange(s, a, 65535, e);
}, ss.octPackFloat = function(t) {
	return M.defined("encoded", t), 256 * t.x + t.y;
};
const ls = new F();
function hs(t) {
	return t >> 1 ^ -(1 & t);
}
ss.octEncodeFloat = function(t) {
	return ss.octEncode(t, ls), ss.octPackFloat(ls);
}, ss.octDecodeFloat = function(t, e) {
	M.defined("value", t);
	const n = t / 256, r = Math.floor(n), i = 256 * (n - r);
	return ss.octDecode(r, i, e);
}, ss.octPack = function(t, e, n, r) {
	M.defined("v1", t), M.defined("v2", e), M.defined("v3", n), M.defined("result", r);
	const i = ss.octEncodeFloat(t), o = ss.octEncodeFloat(e), s = ss.octEncode(n, ls);
	return r.x = 65536 * s.x + i, r.y = 65536 * s.y + o, r;
}, ss.octUnpack = function(t, e, n, r) {
	M.defined("packed", t), M.defined("v1", e), M.defined("v2", n), M.defined("v3", r);
	let i = t.x / 65536;
	const o = Math.floor(i), s = 65536 * (i - o);
	i = t.y / 65536;
	const a = Math.floor(i), u = 65536 * (i - a);
	ss.octDecodeFloat(s, e), ss.octDecodeFloat(u, n), ss.octDecode(o, a, r);
}, ss.compressTextureCoordinates = function(t) {
	return M.defined("textureCoordinates", t), 4096 * (4095 * t.x | 0) + (4095 * t.y | 0);
}, ss.decompressTextureCoordinates = function(t, e) {
	M.defined("compressed", t), M.defined("result", e);
	const n = t / 4096, r = Math.floor(n);
	return e.x = r / 4095, e.y = (t - 4096 * r) / 4095, e;
}, ss.zigZagDeltaDecode = function(t, e, n) {
	M.defined("uBuffer", t), M.defined("vBuffer", e), M.typeOf.number.equals("uBuffer.length", "vBuffer.length", t.length, e.length), N(n) && M.typeOf.number.equals("uBuffer.length", "heightBuffer.length", t.length, n.length);
	const r = t.length;
	let i = 0, o = 0, s = 0;
	for (let a = 0; a < r; ++a) i += hs(t[a]), o += hs(e[a]), t[a] = i, e[a] = o, N(n) && (s += hs(n[a]), n[a] = s);
}, ss.dequantize = function(t, e, n, r) {
	M.defined("typedArray", t), M.defined("componentDatatype", e), M.defined("type", n), M.defined("count", r);
	const i = is.getNumberOfComponents(n);
	let o;
	switch (e) {
		case Co.BYTE:
			o = 127;
			break;
		case Co.UNSIGNED_BYTE:
			o = 255;
			break;
		case Co.SHORT:
			o = 32767;
			break;
		case Co.UNSIGNED_SHORT:
			o = 65535;
			break;
		case Co.INT:
			o = 2147483647;
			break;
		case Co.UNSIGNED_INT:
			o = 4294967295;
			break;
		default: throw new v(`Cannot dequantize component datatype: ${e}`);
	}
	const s = new Float32Array(r * i);
	for (let a = 0; a < r; a++) for (let e = 0; e < i; e++) {
		const n = a * i + e;
		s[n] = Math.max(t[n] / o, -1);
	}
	return s;
}, ss.encodeRGB8 = function(t) {
	return M.typeOf.object("color", t), 65536 * Math.round(D.clamp(255 * t.red, 0, 255)) + 256 * Math.round(D.clamp(255 * t.green, 0, 255)) + Math.round(D.clamp(255 * t.blue, 0, 255));
}, ss.decodeRGB8 = function(t, e) {
	return M.typeOf.number("encoded", t), M.typeOf.object("result", e), t = Math.floor(t), e.red = (t >> 16 & 255) / 255, e.green = (t >> 8 & 255) / 255, e.blue = (255 & t) / 255, e;
}, ss.decodeRGB565 = function(t, e) {
	M.defined("typedArray", t);
	const n = 3 * t.length;
	N(e) && M.typeOf.number.equals("result.length", "typedArray.length * 3", e.length, n);
	const r = t.length;
	N(e) || (e = new Float32Array(3 * r));
	const i = 1 / 31, o = 1 / 63;
	for (let s = 0; s < r; s++) {
		const n = t[s], r = n >> 11, a = n >> 5 & 63, u = 31 & n, c = 3 * s;
		e[c] = r * i, e[c + 1] = a * o, e[c + 2] = u * i;
	}
	return e;
};
const fs = new H(), ps = new H(), ds = new H();
function ms() {
	this.high = H.clone(H.ZERO), this.low = H.clone(H.ZERO);
}
ms.encode = function(t, e) {
	let n;
	return M.typeOf.number("value", t), N(e) || (e = {
		high: 0,
		low: 0
	}), t >= 0 ? (n = 65536 * Math.floor(t / 65536), e.high = n, e.low = t - n) : (n = 65536 * Math.floor(-t / 65536), e.high = -n, e.low = t + n), e;
};
const ys = {
	high: 0,
	low: 0
};
ms.fromCartesian = function(t, e) {
	M.typeOf.object("cartesian", t), N(e) || (e = new ms());
	const n = e.high, r = e.low;
	return ms.encode(t.x, ys), n.x = ys.high, r.x = ys.low, ms.encode(t.y, ys), n.y = ys.high, r.y = ys.low, ms.encode(t.z, ys), n.z = ys.high, r.z = ys.low, e;
};
const gs = new ms();
ms.writeElements = function(t, e, n) {
	M.defined("cartesianArray", e), M.typeOf.number("index", n), M.typeOf.number.greaterThanOrEquals("index", n, 0), ms.fromCartesian(t, gs);
	const r = gs.high, i = gs.low;
	e[n] = r.x, e[n + 1] = r.y, e[n + 2] = r.z, e[n + 3] = i.x, e[n + 4] = i.y, e[n + 5] = i.z;
};
const ws = {
	UNSIGNED_BYTE: Po.UNSIGNED_BYTE,
	UNSIGNED_SHORT: Po.UNSIGNED_SHORT,
	UNSIGNED_INT: Po.UNSIGNED_INT,
	getSizeInBytes: function(t) {
		switch (t) {
			case ws.UNSIGNED_BYTE: return Uint8Array.BYTES_PER_ELEMENT;
			case ws.UNSIGNED_SHORT: return Uint16Array.BYTES_PER_ELEMENT;
			case ws.UNSIGNED_INT: return Uint32Array.BYTES_PER_ELEMENT;
		}
		throw new v("indexDatatype is required and must be a valid IndexDatatype constant.");
	},
	fromSizeInBytes: function(t) {
		switch (t) {
			case 2: return ws.UNSIGNED_SHORT;
			case 4: return ws.UNSIGNED_INT;
			case 1: return ws.UNSIGNED_BYTE;
			default: throw new v("Size in bytes cannot be mapped to an IndexDatatype");
		}
	},
	validate: function(t) {
		return N(t) && (t === ws.UNSIGNED_BYTE || t === ws.UNSIGNED_SHORT || t === ws.UNSIGNED_INT);
	},
	createTypedArray: function(t, e) {
		if (!N(t)) throw new v("numberOfVertices is required.");
		return t >= D.SIXTY_FOUR_KILOBYTES ? new Uint32Array(e) : new Uint16Array(e);
	},
	createTypedArrayFromArrayBuffer: function(t, e, n, r) {
		if (!N(t)) throw new v("numberOfVertices is required.");
		if (!N(e)) throw new v("sourceArray is required.");
		if (!N(n)) throw new v("byteOffset is required.");
		return t >= D.SIXTY_FOUR_KILOBYTES ? new Uint32Array(e, n, r) : new Uint16Array(e, n, r);
	},
	fromTypedArray: function(t) {
		if (t instanceof Uint8Array) return ws.UNSIGNED_BYTE;
		if (t instanceof Uint16Array) return ws.UNSIGNED_SHORT;
		if (t instanceof Uint32Array) return ws.UNSIGNED_INT;
		throw new v("array must be a Uint8Array, Uint16Array, or Uint32Array.");
	}
};
Object.freeze(ws);
const Es = {};
function _s(t, e, n) {
	const r = t + e;
	return D.sign(t) !== D.sign(e) && Math.abs(r / Math.max(Math.abs(t), Math.abs(e))) < n ? 0 : r;
}
Es.computeDiscriminant = function(t, e, n) {
	if ("number" != typeof t) throw new v("a is a required number.");
	if ("number" != typeof e) throw new v("b is a required number.");
	if ("number" != typeof n) throw new v("c is a required number.");
	return e * e - 4 * t * n;
}, Es.computeRealRoots = function(t, e, n) {
	if ("number" != typeof t) throw new v("a is a required number.");
	if ("number" != typeof e) throw new v("b is a required number.");
	if ("number" != typeof n) throw new v("c is a required number.");
	let r;
	if (0 === t) return 0 === e ? [] : [-n / e];
	if (0 === e) {
		if (0 === n) return [0, 0];
		const e = Math.abs(n), i = Math.abs(t);
		if (e < i && e / i < D.EPSILON14) return [0, 0];
		if (e > i && i / e < D.EPSILON14) return [];
		if (r = -n / t, r < 0) return [];
		const o = Math.sqrt(r);
		return [-o, o];
	}
	if (0 === n) return r = -e / t, r < 0 ? [r, 0] : [0, r];
	const i = _s(e * e, -4 * t * n, D.EPSILON14);
	if (i < 0) return [];
	const o = -.5 * _s(e, D.sign(e) * Math.sqrt(i), D.EPSILON14);
	return e > 0 ? [o / t, n / o] : [n / o, o / t];
};
const Os = {};
function bs(t, e, n, r) {
	const i = t, o = e / 3, s = n / 3, a = r, u = i * s, c = o * a, l = o * o, h = s * s, f = i * s - l, p = i * a - o * s, d = o * a - h, m = 4 * f * d - p * p;
	let y, g;
	if (m < 0) {
		let t, e, n;
		l * c >= u * h ? (t = i, e = f, n = -2 * o * f + i * p) : (t = a, e = d, n = -a * p + 2 * s * d);
		const r = -(n < 0 ? -1 : 1) * Math.abs(t) * Math.sqrt(-m);
		g = -n + r;
		const w = g / 2, E = w < 0 ? -Math.pow(-w, 1 / 3) : Math.pow(w, 1 / 3), _ = g === r ? -E : -e / E;
		return y = e <= 0 ? E + _ : -n / (E * E + _ * _ + e), l * c >= u * h ? [(y - o) / i] : [-a / (y + s)];
	}
	const w = f, E = -2 * o * f + i * p, _ = d, O = -a * p + 2 * s * d, b = Math.sqrt(m), T = Math.sqrt(3) / 2;
	let A = Math.abs(Math.atan2(i * b, -E) / 3);
	y = 2 * Math.sqrt(-w);
	let x = Math.cos(A);
	g = y * x;
	let R = y * (-x / 2 - T * Math.sin(A));
	const S = g + R > 2 * o ? g - o : R - o, I = i, N = S / I;
	A = Math.abs(Math.atan2(a * b, -O) / 3), y = 2 * Math.sqrt(-_), x = Math.cos(A), g = y * x, R = y * (-x / 2 - T * Math.sin(A));
	const v = -a, M = g + R < 2 * s ? g + s : R + s, P = v / M, C = -S * M - I * v, q = (s * C - o * (S * v)) / (-o * C + s * (I * M));
	return N <= q ? N <= P ? q <= P ? [
		N,
		q,
		P
	] : [
		N,
		P,
		q
	] : [
		P,
		N,
		q
	] : N <= P ? [
		q,
		N,
		P
	] : q <= P ? [
		q,
		P,
		N
	] : [
		P,
		q,
		N
	];
}
Os.computeDiscriminant = function(t, e, n, r) {
	if ("number" != typeof t) throw new v("a is a required number.");
	if ("number" != typeof e) throw new v("b is a required number.");
	if ("number" != typeof n) throw new v("c is a required number.");
	if ("number" != typeof r) throw new v("d is a required number.");
	const i = e * e, o = n * n;
	return 18 * t * e * n * r + i * o - t * t * 27 * (r * r) - 4 * (t * o * n + i * e * r);
}, Os.computeRealRoots = function(t, e, n, r) {
	if ("number" != typeof t) throw new v("a is a required number.");
	if ("number" != typeof e) throw new v("b is a required number.");
	if ("number" != typeof n) throw new v("c is a required number.");
	if ("number" != typeof r) throw new v("d is a required number.");
	let i, o;
	if (0 === t) return Es.computeRealRoots(e, n, r);
	if (0 === e) {
		if (0 === n) {
			if (0 === r) return [
				0,
				0,
				0
			];
			o = -r / t;
			const e = o < 0 ? -Math.pow(-o, 1 / 3) : Math.pow(o, 1 / 3);
			return [
				e,
				e,
				e
			];
		}
		return 0 === r ? (i = Es.computeRealRoots(t, 0, n), 0 === i.Length ? [0] : [
			i[0],
			0,
			i[1]
		]) : bs(t, 0, n, r);
	}
	return 0 === n ? 0 === r ? (o = -e / t, o < 0 ? [
		o,
		0,
		0
	] : [
		0,
		0,
		o
	]) : bs(t, e, 0, r) : 0 === r ? (i = Es.computeRealRoots(t, e, n), 0 === i.length ? [0] : i[1] <= 0 ? [
		i[0],
		i[1],
		0
	] : i[0] >= 0 ? [
		0,
		i[0],
		i[1]
	] : [
		i[0],
		0,
		i[1]
	]) : bs(t, e, n, r);
};
const Ts = {};
Ts.computeDiscriminant = function(t, e, n, r, i) {
	if ("number" != typeof t) throw new v("a is a required number.");
	if ("number" != typeof e) throw new v("b is a required number.");
	if ("number" != typeof n) throw new v("c is a required number.");
	if ("number" != typeof r) throw new v("d is a required number.");
	if ("number" != typeof i) throw new v("e is a required number.");
	const o = t * t, s = e * e, a = s * e, u = n * n, c = u * n, l = r * r, h = l * r, f = i * i;
	return s * u * l - 4 * a * h - 4 * t * c * l + 18 * t * e * n * h - 27 * o * l * l + o * t * 256 * (f * i) + i * (18 * a * n * r - 4 * s * c + 16 * t * u * u - 80 * t * e * u * r - 6 * t * s * l + 144 * o * n * l) + f * (144 * t * s * n - 27 * s * s - 128 * o * u - 192 * o * e * r);
}, Ts.computeRealRoots = function(t, e, n, r, i) {
	if ("number" != typeof t) throw new v("a is a required number.");
	if ("number" != typeof e) throw new v("b is a required number.");
	if ("number" != typeof n) throw new v("c is a required number.");
	if ("number" != typeof r) throw new v("d is a required number.");
	if ("number" != typeof i) throw new v("e is a required number.");
	if (Math.abs(t) < D.EPSILON15) return Os.computeRealRoots(e, n, r, i);
	const o = e / t, s = n / t, a = r / t, u = i / t;
	let c = o < 0 ? 1 : 0;
	switch (c += s < 0 ? c + 1 : c, c += a < 0 ? c + 1 : c, c += u < 0 ? c + 1 : c, c) {
		case 0:
		case 3:
		case 4:
		case 6:
		case 7:
		case 9:
		case 10:
		case 12:
		case 13:
		case 14:
		case 15: return function(t, e, n, r) {
			const i = t * t, o = e - 3 * i / 8, s = n - e * t / 2 + i * t / 8, a = r - n * t / 4 + e * i / 16 - 3 * i * i / 256, u = Os.computeRealRoots(1, 2 * o, o * o - 4 * a, -s * s);
			if (u.length > 0) {
				const e = -t / 4, n = u[u.length - 1];
				if (Math.abs(n) < D.EPSILON14) {
					const t = Es.computeRealRoots(1, o, a);
					if (2 === t.length) {
						const n = t[0], r = t[1];
						let i;
						if (n >= 0 && r >= 0) {
							const t = Math.sqrt(n), i = Math.sqrt(r);
							return [
								e - i,
								e - t,
								e + t,
								e + i
							];
						}
						if (n >= 0 && r < 0) return i = Math.sqrt(n), [e - i, e + i];
						if (n < 0 && r >= 0) return i = Math.sqrt(r), [e - i, e + i];
					}
					return [];
				}
				if (n > 0) {
					const t = Math.sqrt(n), r = (o + n - s / t) / 2, i = (o + n + s / t) / 2, a = Es.computeRealRoots(1, t, r), u = Es.computeRealRoots(1, -t, i);
					return 0 !== a.length ? (a[0] += e, a[1] += e, 0 !== u.length ? (u[0] += e, u[1] += e, a[1] <= u[0] ? [
						a[0],
						a[1],
						u[0],
						u[1]
					] : u[1] <= a[0] ? [
						u[0],
						u[1],
						a[0],
						a[1]
					] : a[0] >= u[0] && a[1] <= u[1] ? [
						u[0],
						a[0],
						a[1],
						u[1]
					] : u[0] >= a[0] && u[1] <= a[1] ? [
						a[0],
						u[0],
						u[1],
						a[1]
					] : a[0] > u[0] && a[0] < u[1] ? [
						u[0],
						a[0],
						u[1],
						a[1]
					] : [
						a[0],
						u[0],
						a[1],
						u[1]
					]) : a) : 0 !== u.length ? (u[0] += e, u[1] += e, u) : [];
				}
			}
			return [];
		}(o, s, a, u);
		case 1:
		case 2:
		case 5:
		case 8:
		case 11: return function(t, e, n, r) {
			const i = t * t, o = -2 * e, s = n * t + e * e - 4 * r, a = i * r - n * e * t + n * n, u = Os.computeRealRoots(1, o, s, a);
			if (u.length > 0) {
				const o = u[0], s = e - o, a = s * s, c = t / 2, l = s / 2, h = a - 4 * r, f = a + 4 * Math.abs(r), p = i - 4 * o, d = i + 4 * Math.abs(o);
				let m, y, g, w, E, _;
				if (o < 0 || h * d < p * f) {
					const e = Math.sqrt(p);
					m = e / 2, y = 0 === e ? 0 : (t * l - n) / e;
				} else {
					const e = Math.sqrt(h);
					m = 0 === e ? 0 : (t * l - n) / e, y = e / 2;
				}
				0 === c && 0 === m ? (g = 0, w = 0) : D.sign(c) === D.sign(m) ? (g = c + m, w = o / g) : (w = c - m, g = o / w), 0 === l && 0 === y ? (E = 0, _ = 0) : D.sign(l) === D.sign(y) ? (E = l + y, _ = r / E) : (_ = l - y, E = r / _);
				const O = Es.computeRealRoots(1, g, E), b = Es.computeRealRoots(1, w, _);
				if (0 !== O.length) return 0 !== b.length ? O[1] <= b[0] ? [
					O[0],
					O[1],
					b[0],
					b[1]
				] : b[1] <= O[0] ? [
					b[0],
					b[1],
					O[0],
					O[1]
				] : O[0] >= b[0] && O[1] <= b[1] ? [
					b[0],
					O[0],
					O[1],
					b[1]
				] : b[0] >= O[0] && b[1] <= O[1] ? [
					O[0],
					b[0],
					b[1],
					O[1]
				] : O[0] > b[0] && O[0] < b[1] ? [
					b[0],
					O[0],
					b[1],
					O[1]
				] : [
					O[0],
					b[0],
					O[1],
					b[1]
				] : O;
				if (0 !== b.length) return b;
			}
			return [];
		}(o, s, a, u);
		default: return;
	}
};
var As = class t {
	constructor(t, e) {
		e = H.clone(e ?? H.ZERO), H.equals(e, H.ZERO) || H.normalize(e, e), this.origin = H.clone(t ?? H.ZERO), this.direction = e;
	}
	static clone(e, n) {
		if (N(e)) return N(n) ? (n.origin = H.clone(e.origin), n.direction = H.clone(e.direction), n) : new t(e.origin, e.direction);
	}
	static getPoint(t, e, n) {
		return M.typeOf.object("ray", t), M.typeOf.number("t", e), N(n) || (n = new H()), n = H.multiplyByScalar(t.direction, e, n), H.add(t.origin, n, n);
	}
};
const xs = { rayPlane: function(t, e, n) {
	if (!N(t)) throw new v("ray is required.");
	if (!N(e)) throw new v("plane is required.");
	N(n) || (n = new H());
	const r = t.origin, i = t.direction, o = e.normal, s = H.dot(o, i);
	if (Math.abs(s) < D.EPSILON15) return;
	const a = (-e.distance - H.dot(o, r)) / s;
	return a < 0 ? void 0 : (n = H.multiplyByScalar(i, a, n), H.add(r, n, n));
} }, Rs = new H(), Ss = new H(), Is = new H(), Ns = new H(), vs = new H();
xs.rayTriangleParametric = function(t, e, n, r, i) {
	if (!N(t)) throw new v("ray is required.");
	if (!N(e)) throw new v("p0 is required.");
	if (!N(n)) throw new v("p1 is required.");
	if (!N(r)) throw new v("p2 is required.");
	i = i ?? !1;
	const o = t.origin, s = t.direction, a = H.subtract(n, e, Rs), u = H.subtract(r, e, Ss), c = H.cross(s, u, Is), l = H.dot(a, c);
	let h, f, p, d, m;
	if (i) {
		if (l < D.EPSILON6) return;
		if (h = H.subtract(o, e, Ns), p = H.dot(h, c), p < 0 || p > l) return;
		if (f = H.cross(h, a, vs), d = H.dot(s, f), d < 0 || p + d > l) return;
		m = H.dot(u, f) / l;
	} else {
		if (Math.abs(l) < D.EPSILON6) return;
		const t = 1 / l;
		if (h = H.subtract(o, e, Ns), p = H.dot(h, c) * t, p < 0 || p > 1) return;
		if (f = H.cross(h, a, vs), d = H.dot(s, f) * t, d < 0 || p + d > 1) return;
		m = H.dot(u, f) * t;
	}
	return m;
}, xs.rayTriangle = function(t, e, n, r, i, o) {
	const s = xs.rayTriangleParametric(t, e, n, r, i);
	if (N(s) && !(s < 0)) return N(o) || (o = new H()), H.multiplyByScalar(t.direction, s, o), H.add(t.origin, o, o);
};
const Ms = new As();
xs.lineSegmentTriangle = function(t, e, n, r, i, o, s) {
	if (!N(t)) throw new v("v0 is required.");
	if (!N(e)) throw new v("v1 is required.");
	if (!N(n)) throw new v("p0 is required.");
	if (!N(r)) throw new v("p1 is required.");
	if (!N(i)) throw new v("p2 is required.");
	const a = Ms;
	H.clone(t, a.origin), H.subtract(e, t, a.direction), H.normalize(a.direction, a.direction);
	const u = xs.rayTriangleParametric(a, n, r, i, o);
	if (!(!N(u) || u < 0 || u > H.distance(t, e))) return N(s) || (s = new H()), H.multiplyByScalar(a.direction, u, s), H.add(a.origin, s, s);
};
const Ps = {
	root0: 0,
	root1: 0
};
function Cs(t, e, n) {
	N(n) || (n = new Hi());
	const r = t.origin, i = t.direction, o = e.center, s = e.radius * e.radius, a = H.subtract(r, o, Is), u = function(t, e, n, r) {
		const i = e * e - 4 * t * n;
		if (i < 0) return;
		if (i > 0) {
			const n = 1 / (2 * t), o = Math.sqrt(i), s = (-e + o) * n, a = (-e - o) * n;
			return s < a ? (r.root0 = s, r.root1 = a) : (r.root0 = a, r.root1 = s), r;
		}
		const o = -e / (2 * t);
		return 0 !== o ? (r.root0 = r.root1 = o, r) : void 0;
	}(H.dot(i, i), 2 * H.dot(i, a), H.magnitudeSquared(a) - s, Ps);
	if (N(u)) return n.start = u.root0, n.stop = u.root1, n;
}
xs.raySphere = function(t, e, n) {
	if (!N(t)) throw new v("ray is required.");
	if (!N(e)) throw new v("sphere is required.");
	if (N(n = Cs(t, e, n)) && !(n.stop < 0)) return n.start = Math.max(n.start, 0), n;
};
const qs = new As();
xs.lineSegmentSphere = function(t, e, n, r) {
	if (!N(t)) throw new v("p0 is required.");
	if (!N(e)) throw new v("p1 is required.");
	if (!N(n)) throw new v("sphere is required.");
	const i = qs;
	H.clone(t, i.origin);
	const o = H.subtract(e, t, i.direction), s = H.magnitude(o);
	if (H.normalize(o, o), !(!N(r = Cs(i, n, r)) || r.stop < 0 || r.start > s)) return r.start = Math.max(r.start, 0), r.stop = Math.min(r.stop, s), r;
};
const Us = new H(), Ls = new H();
xs.rayEllipsoid = function(t, e) {
	if (!N(t)) throw new v("ray is required.");
	if (!N(e)) throw new v("ellipsoid is required.");
	const n = e.oneOverRadii, r = H.multiplyComponents(n, t.origin, Us), i = H.multiplyComponents(n, t.direction, Ls), o = H.magnitudeSquared(r), s = H.dot(r, i);
	let a, u, c, l, h;
	if (o > 1) {
		if (s >= 0) return;
		const t = s * s;
		if (a = o - 1, u = H.magnitudeSquared(i), c = u * a, t < c) return;
		if (t > c) {
			l = s * s - c, h = -s + Math.sqrt(l);
			const t = h / u, e = a / h;
			return t < e ? new Hi(t, e) : {
				start: e,
				stop: t
			};
		}
		const e = Math.sqrt(a / u);
		return new Hi(e, e);
	}
	return o < 1 ? (a = o - 1, u = H.magnitudeSquared(i), c = u * a, l = s * s - c, h = -s + Math.sqrt(l), new Hi(0, h / u)) : s < 0 ? (u = H.magnitudeSquared(i), new Hi(0, -s / u)) : void 0;
};
const Ds = new Hi(), zs = new Hi(), js = new Hi();
function Fs(t, e, n, r, i) {
	if (i.start = (n - t) / e, i.stop = (r - t) / e, i.stop < i.start) {
		const t = i.stop;
		i.stop = i.start, i.start = t;
	}
	return i;
}
function Bs(t, e, n) {
	const r = t + e;
	return D.sign(t) !== D.sign(e) && Math.abs(r / Math.max(Math.abs(t), Math.abs(e))) < n ? 0 : r;
}
xs.rayAxisAlignedBoundingBox = function(t, e, n) {
	if (!N(t)) throw new v("ray is required.");
	if (!N(e)) throw new v("box is required.");
	N(n) || (n = new Hi());
	const r = Fs(t.origin.x, t.direction.x, e.minimum.x, e.maximum.x, Ds), i = Fs(t.origin.y, t.direction.y, e.minimum.y, e.maximum.y, zs), o = Fs(t.origin.z, t.direction.z, e.minimum.z, e.maximum.z, js);
	if (n.start = r.start > i.start ? r.start : i.start, n.stop = r.stop < i.stop ? r.stop : i.stop, !(r.start > i.stop || i.start > r.stop || n.start > o.stop || o.start > n.stop)) return o.start > n.start && (n.start = o.start), o.stop < n.stop && (n.stop = o.stop), n;
}, xs.quadraticVectorExpression = function(t, e, n, r, i) {
	const o = r * r, s = i * i, a = (t[wn.COLUMN1ROW1] - t[wn.COLUMN2ROW2]) * s, u = i * (r * Bs(t[wn.COLUMN1ROW0], t[wn.COLUMN0ROW1], D.EPSILON15) + e.y), c = t[wn.COLUMN0ROW0] * o + t[wn.COLUMN2ROW2] * s + r * e.x + n, l = s * Bs(t[wn.COLUMN2ROW1], t[wn.COLUMN1ROW2], D.EPSILON15), h = i * (r * Bs(t[wn.COLUMN2ROW0], t[wn.COLUMN0ROW2]) + e.z);
	let f;
	const p = [];
	if (0 === h && 0 === l) {
		if (f = Es.computeRealRoots(a, u, c), 0 === f.length) return p;
		const t = f[0], e = Math.sqrt(Math.max(1 - t * t, 0));
		if (p.push(new H(r, i * t, i * -e)), p.push(new H(r, i * t, i * e)), 2 === f.length) {
			const t = f[1], e = Math.sqrt(Math.max(1 - t * t, 0));
			p.push(new H(r, i * t, i * -e)), p.push(new H(r, i * t, i * e));
		}
		return p;
	}
	const d = h * h, m = l * l, y = h * l, g = a * a + m, w = 2 * (u * a + y), E = 2 * c * a + u * u - m + d, _ = 2 * (c * u - y), O = c * c - d;
	if (0 === g && 0 === w && 0 === E && 0 === _) return p;
	f = Ts.computeRealRoots(g, w, E, _, O);
	const b = f.length;
	if (0 === b) return p;
	for (let T = 0; T < b; ++T) {
		const t = f[T], e = t * t, n = Math.max(1 - e, 0), o = Math.sqrt(n);
		let s;
		s = D.sign(a) === D.sign(c) ? Bs(a * e + c, u * t, D.EPSILON12) : D.sign(c) === D.sign(u * t) ? Bs(a * e, u * t + c, D.EPSILON12) : Bs(a * e + u * t, c, D.EPSILON12);
		const d = s * Bs(l * t, h, D.EPSILON15);
		d < 0 ? p.push(new H(r, i * t, i * o)) : d > 0 ? p.push(new H(r, i * t, i * -o)) : 0 !== o ? (p.push(new H(r, i * t, i * -o)), p.push(new H(r, i * t, i * o)), ++T) : p.push(new H(r, i * t, i * o));
	}
	return p;
};
const Gs = new H(), ks = new H(), Ws = new H(), Vs = new H(), Hs = new H(), Xs = new wn(), Ys = new wn(), $s = new wn(), Zs = new wn(), Qs = new wn(), Ks = new wn(), Js = new wn(), ta = new H(), ea = new H(), na = new rt();
xs.grazingAltitudeLocation = function(t, e) {
	if (!N(t)) throw new v("ray is required.");
	if (!N(e)) throw new v("ellipsoid is required.");
	const n = t.origin, r = t.direction;
	if (!H.equals(n, H.ZERO)) {
		const t = e.geodeticSurfaceNormal(n, Gs);
		if (H.dot(r, t) >= 0) return n;
	}
	const i = N(this.rayEllipsoid(t, e)), o = e.transformPositionToScaledSpace(r, Gs), s = H.normalize(o, o), a = H.mostOrthogonalAxis(o, Vs), u = H.normalize(H.cross(a, s, ks), ks), c = H.normalize(H.cross(s, u, Ws), Ws), l = Xs;
	l[0] = s.x, l[1] = s.y, l[2] = s.z, l[3] = u.x, l[4] = u.y, l[5] = u.z, l[6] = c.x, l[7] = c.y, l[8] = c.z;
	const h = wn.transpose(l, Ys), f = wn.fromScale(e.radii, $s), p = wn.fromScale(e.oneOverRadii, Zs), d = Qs;
	d[0] = 0, d[1] = -r.z, d[2] = r.y, d[3] = r.z, d[4] = 0, d[5] = -r.x, d[6] = -r.y, d[7] = r.x, d[8] = 0;
	const m = wn.multiply(wn.multiply(h, p, Ks), d, Ks), y = wn.multiply(wn.multiply(m, f, Js), l, Js), g = wn.multiplyByVector(m, n, Hs), w = xs.quadraticVectorExpression(y, H.negate(g, Gs), 0, 0, 1);
	let E, _;
	const O = w.length;
	if (O > 0) {
		let t = H.clone(H.ZERO, ea), o = Number.NEGATIVE_INFINITY;
		for (let e = 0; e < O; ++e) {
			E = wn.multiplyByVector(f, wn.multiplyByVector(l, w[e], ta), ta);
			const i = H.normalize(H.subtract(E, n, Vs), Vs), s = H.dot(i, r);
			s > o && (o = s, t = H.clone(E, t));
		}
		const s = e.cartesianToCartographic(t, na);
		return o = D.clamp(o, 0, 1), _ = H.magnitude(H.subtract(t, n, Vs)) * Math.sqrt(1 - o * o), _ = i ? -_ : _, s.height = _, e.cartographicToCartesian(s, new H());
	}
};
const ra = new H();
function ia(t, e) {
	if (M.typeOf.object("normal", t), !D.equalsEpsilon(H.magnitude(t), 1, D.EPSILON6)) throw new v("normal must be normalized.");
	M.typeOf.number("distance", e), this.normal = H.clone(t), this.distance = e;
}
xs.lineSegmentPlane = function(t, e, n, r) {
	if (!N(t)) throw new v("endPoint0 is required.");
	if (!N(e)) throw new v("endPoint1 is required.");
	if (!N(n)) throw new v("plane is required.");
	N(r) || (r = new H());
	const i = H.subtract(e, t, ra), o = n.normal, s = H.dot(o, i);
	if (Math.abs(s) < D.EPSILON6) return;
	const a = H.dot(o, t), u = -(n.distance + a) / s;
	return u < 0 || u > 1 ? void 0 : (H.multiplyByScalar(i, u, r), H.add(t, r, r), r);
}, xs.trianglePlaneIntersection = function(t, e, n, r) {
	if (!(N(t) && N(e) && N(n) && N(r))) throw new v("p0, p1, p2, and plane are required.");
	const i = r.normal, o = r.distance, s = H.dot(i, t) + o < 0, a = H.dot(i, e) + o < 0, u = H.dot(i, n) + o < 0;
	let c, l, h = 0;
	if (h += s ? 1 : 0, h += a ? 1 : 0, h += u ? 1 : 0, 1 !== h && 2 !== h || (c = new H(), l = new H()), 1 === h) {
		if (s) return xs.lineSegmentPlane(t, e, r, c), xs.lineSegmentPlane(t, n, r, l), {
			positions: [
				t,
				e,
				n,
				c,
				l
			],
			indices: [
				0,
				3,
				4,
				1,
				2,
				4,
				1,
				4,
				3
			]
		};
		if (a) return xs.lineSegmentPlane(e, n, r, c), xs.lineSegmentPlane(e, t, r, l), {
			positions: [
				t,
				e,
				n,
				c,
				l
			],
			indices: [
				1,
				3,
				4,
				2,
				0,
				4,
				2,
				4,
				3
			]
		};
		if (u) return xs.lineSegmentPlane(n, t, r, c), xs.lineSegmentPlane(n, e, r, l), {
			positions: [
				t,
				e,
				n,
				c,
				l
			],
			indices: [
				2,
				3,
				4,
				0,
				1,
				4,
				0,
				4,
				3
			]
		};
	} else if (2 === h) {
		if (!s) return xs.lineSegmentPlane(e, t, r, c), xs.lineSegmentPlane(n, t, r, l), {
			positions: [
				t,
				e,
				n,
				c,
				l
			],
			indices: [
				1,
				2,
				4,
				1,
				4,
				3,
				0,
				3,
				4
			]
		};
		if (!a) return xs.lineSegmentPlane(n, e, r, c), xs.lineSegmentPlane(t, e, r, l), {
			positions: [
				t,
				e,
				n,
				c,
				l
			],
			indices: [
				2,
				0,
				4,
				2,
				4,
				3,
				1,
				3,
				4
			]
		};
		if (!u) return xs.lineSegmentPlane(t, n, r, c), xs.lineSegmentPlane(e, n, r, l), {
			positions: [
				t,
				e,
				n,
				c,
				l
			],
			indices: [
				0,
				1,
				4,
				0,
				4,
				3,
				2,
				3,
				4
			]
		};
	}
}, ia.fromPointNormal = function(t, e, n) {
	if (M.typeOf.object("point", t), M.typeOf.object("normal", e), !D.equalsEpsilon(H.magnitude(e), 1, D.EPSILON6)) throw new v("normal must be normalized.");
	const r = -H.dot(e, t);
	return N(n) ? (H.clone(e, n.normal), n.distance = r, n) : new ia(e, r);
};
const oa = new H();
ia.fromCartesian4 = function(t, e) {
	M.typeOf.object("coefficients", t);
	const n = H.fromCartesian4(t, oa), r = t.w;
	if (!D.equalsEpsilon(H.magnitude(n), 1, D.EPSILON6)) throw new v("normal must be normalized.");
	return N(e) ? (H.clone(n, e.normal), e.distance = r, e) : new ia(n, r);
}, ia.getPointDistance = function(t, e) {
	return M.typeOf.object("plane", t), M.typeOf.object("point", e), H.dot(t.normal, e) + t.distance;
};
const sa = new H();
ia.projectPointOntoPlane = function(t, e, n) {
	M.typeOf.object("plane", t), M.typeOf.object("point", e), N(n) || (n = new H());
	const r = ia.getPointDistance(t, e), i = H.multiplyByScalar(t.normal, r, sa);
	return H.subtract(e, i, n);
};
const aa = new Pn(), ua = new _t(), ca = new H();
ia.transform = function(t, e, n) {
	M.typeOf.object("plane", t), M.typeOf.object("transform", e);
	const r = t.normal, i = t.distance, o = Pn.inverseTranspose(e, aa);
	let s = _t.fromElements(r.x, r.y, r.z, i, ua);
	s = Pn.multiplyByVector(o, s, s);
	const a = H.fromCartesian4(s, ca);
	return s = _t.divideByScalar(s, H.magnitude(a), s), ia.fromCartesian4(s, n);
}, ia.clone = function(t, e) {
	return M.typeOf.object("plane", t), N(e) ? (H.clone(t.normal, e.normal), e.distance = t.distance, e) : new ia(t.normal, t.distance);
}, ia.equals = function(t, e) {
	return M.typeOf.object("left", t), M.typeOf.object("right", e), t.distance === e.distance && H.equals(t.normal, e.normal);
}, ia.ORIGIN_XY_PLANE = Object.freeze(new ia(H.UNIT_Z, 0)), ia.ORIGIN_YZ_PLANE = Object.freeze(new ia(H.UNIT_X, 0)), ia.ORIGIN_ZX_PLANE = Object.freeze(new ia(H.UNIT_Y, 0));
const la = {
	calculateACMR: function(t) {
		const e = (t = t ?? I.EMPTY_OBJECT).indices;
		let n = t.maximumIndex;
		const r = t.cacheSize ?? 24;
		if (!N(e)) throw new v("indices is required.");
		const i = e.length;
		if (i < 3 || i % 3 != 0) throw new v("indices length must be a multiple of three.");
		if (n <= 0) throw new v("maximumIndex must be greater than zero.");
		if (r < 3) throw new v("cacheSize must be greater than two.");
		if (!N(n)) {
			n = 0;
			let t = 0, r = e[t];
			for (; t < i;) r > n && (n = r), ++t, r = e[t];
		}
		const o = [];
		for (let a = 0; a < n + 1; a++) o[a] = 0;
		let s = r + 1;
		for (let a = 0; a < i; ++a) s - o[e[a]] > r && (o[e[a]] = s, ++s);
		return (s - r + 1) / (i / 3);
	},
	tipsify: function(t) {
		const e = (t = t ?? I.EMPTY_OBJECT).indices, n = t.maximumIndex, r = t.cacheSize ?? 24;
		let i;
		function o(t, e, n, r, o, s, a) {
			let u, c = -1, l = -1, h = 0;
			for (; h < n.length;) {
				const t = n[h];
				r[t].numLiveTriangles && (u = 0, o - r[t].timeStamp + 2 * r[t].numLiveTriangles <= e && (u = o - r[t].timeStamp), (u > l || -1 === l) && (l = u, c = t)), ++h;
			}
			return -1 === c ? function(t, e, n, r) {
				for (; e.length >= 1;) {
					const n = e[e.length - 1];
					if (e.splice(e.length - 1, 1), t[n].numLiveTriangles > 0) return n;
				}
				for (; i < r;) {
					if (t[i].numLiveTriangles > 0) return ++i, i - 1;
					++i;
				}
				return -1;
			}(r, s, 0, a) : c;
		}
		if (!N(e)) throw new v("indices is required.");
		const s = e.length;
		if (s < 3 || s % 3 != 0) throw new v("indices length must be a multiple of three.");
		if (n <= 0) throw new v("maximumIndex must be greater than zero.");
		if (r < 3) throw new v("cacheSize must be greater than two.");
		let a = 0, u = 0, c = e[u];
		const l = s;
		if (N(n)) a = n + 1;
		else {
			for (; u < l;) c > a && (a = c), ++u, c = e[u];
			if (-1 === a) return 0;
			++a;
		}
		const h = [];
		let f;
		for (f = 0; f < a; f++) h[f] = {
			numLiveTriangles: 0,
			timeStamp: 0,
			vertexTriangles: []
		};
		u = 0;
		let p = 0;
		for (; u < l;) h[e[u]].vertexTriangles.push(p), ++h[e[u]].numLiveTriangles, h[e[u + 1]].vertexTriangles.push(p), ++h[e[u + 1]].numLiveTriangles, h[e[u + 2]].vertexTriangles.push(p), ++h[e[u + 2]].numLiveTriangles, ++p, u += 3;
		let d = 0, m = r + 1;
		i = 1;
		let y = [];
		const g = [];
		let w, E, _ = 0;
		const O = [], b = s / 3, T = [];
		for (f = 0; f < b; f++) T[f] = !1;
		let A, x;
		for (; -1 !== d;) {
			y = [], E = h[d], x = E.vertexTriangles.length;
			for (let t = 0; t < x; ++t) if (p = E.vertexTriangles[t], !T[p]) {
				T[p] = !0, u = p + p + p;
				for (let t = 0; t < 3; ++t) A = e[u], y.push(A), g.push(A), O[_] = A, ++_, w = h[A], --w.numLiveTriangles, m - w.timeStamp > r && (w.timeStamp = m, ++m), ++u;
			}
			d = o(0, r, y, h, m, g, a);
		}
		return O;
	}
}, ha = {};
function fa(t, e, n, r, i) {
	t[e++] = n, t[e++] = r, t[e++] = r, t[e++] = i, t[e++] = i, t[e] = n;
}
function pa(t) {
	const e = {};
	for (const n in t) if (t.hasOwnProperty(n) && N(t[n]) && N(t[n].values)) {
		const r = t[n];
		e[n] = new ts({
			componentDatatype: r.componentDatatype,
			componentsPerAttribute: r.componentsPerAttribute,
			normalize: r.normalize,
			values: []
		});
	}
	return e;
}
function da(t, e, n) {
	for (const r in e) if (e.hasOwnProperty(r) && N(e[r]) && N(e[r].values)) {
		const i = e[r];
		for (let e = 0; e < i.componentsPerAttribute; ++e) t[r].values.push(i.values[n * i.componentsPerAttribute + e]);
	}
}
ha.toWireframe = function(t) {
	if (!N(t)) throw new v("geometry is required.");
	const e = t.indices;
	if (N(e)) {
		switch (t.primitiveType) {
			case Go.TRIANGLES:
				t.indices = function(t) {
					const e = t.length, n = e / 3 * 6, r = ws.createTypedArray(e, n);
					let i = 0;
					for (let o = 0; o < e; o += 3, i += 6) fa(r, i, t[o], t[o + 1], t[o + 2]);
					return r;
				}(e);
				break;
			case Go.TRIANGLE_STRIP:
				t.indices = function(t) {
					const e = t.length;
					if (e >= 3) {
						const n = 6 * (e - 2), r = ws.createTypedArray(e, n);
						fa(r, 0, t[0], t[1], t[2]);
						let i = 6;
						for (let o = 3; o < e; ++o, i += 6) fa(r, i, t[o - 1], t[o], t[o - 2]);
						return r;
					}
					return /* @__PURE__ */ new Uint16Array();
				}(e);
				break;
			case Go.TRIANGLE_FAN:
				t.indices = function(t) {
					if (t.length > 0) {
						const e = t.length - 1, n = 6 * (e - 1), r = ws.createTypedArray(e, n), i = t[0];
						let o = 0;
						for (let s = 1; s < e; ++s, o += 6) fa(r, o, i, t[s], t[s + 1]);
						return r;
					}
					return /* @__PURE__ */ new Uint16Array();
				}(e);
				break;
			default: throw new v("geometry.primitiveType must be TRIANGLES, TRIANGLE_STRIP, or TRIANGLE_FAN.");
		}
		t.primitiveType = Go.LINES;
	}
	return t;
}, ha.createLineSegmentsForVectors = function(t, e, n) {
	if (e = e ?? "normal", !N(t)) throw new v("geometry is required.");
	if (!N(t.attributes.position)) throw new v("geometry.attributes.position is required.");
	if (!N(t.attributes[e])) throw new v(`geometry.attributes must have an attribute with the same name as the attributeName parameter, ${e}.`);
	n = n ?? 1e4;
	const r = t.attributes.position.values, i = t.attributes[e].values, o = r.length, s = new Float64Array(2 * o);
	let a, u = 0;
	for (let l = 0; l < o; l += 3) s[u++] = r[l], s[u++] = r[l + 1], s[u++] = r[l + 2], s[u++] = r[l] + i[l] * n, s[u++] = r[l + 1] + i[l + 1] * n, s[u++] = r[l + 2] + i[l + 2] * n;
	const c = t.boundingSphere;
	return N(c) && (a = new Xi(c.center, c.radius + n)), new ko({
		attributes: { position: new ts({
			componentDatatype: Co.DOUBLE,
			componentsPerAttribute: 3,
			values: s
		}) },
		primitiveType: Go.LINES,
		boundingSphere: a
	});
}, ha.createAttributeLocations = function(t) {
	if (!N(t)) throw new v("geometry is required.");
	const e = [
		"position",
		"positionHigh",
		"positionLow",
		"position3DHigh",
		"position3DLow",
		"position2DHigh",
		"position2DLow",
		"pickColor",
		"normal",
		"st",
		"tangent",
		"bitangent",
		"extrudeDirection",
		"compressedAttributes"
	], n = t.attributes, r = {};
	let i, o = 0;
	const s = e.length;
	for (i = 0; i < s; ++i) {
		const t = e[i];
		N(n[t]) && (r[t] = o++);
	}
	for (const a in n) n.hasOwnProperty(a) && !N(r[a]) && (r[a] = o++);
	return r;
}, ha.reorderForPreVertexCache = function(t) {
	if (!N(t)) throw new v("geometry is required.");
	const e = ko.computeNumberOfVertices(t), n = t.indices;
	if (N(n)) {
		const r = new Int32Array(e);
		for (let t = 0; t < e; t++) r[t] = -1;
		const i = n, o = i.length, s = ws.createTypedArray(e, o);
		let a, u = 0, c = 0, l = 0;
		for (; u < o;) a = r[i[u]], -1 !== a ? s[c] = a : (a = i[u], r[a] = l, s[c] = l, ++l), ++u, ++c;
		t.indices = s;
		const h = t.attributes;
		for (const t in h) if (h.hasOwnProperty(t) && N(h[t]) && N(h[t].values)) {
			const n = h[t], i = n.values;
			let o = 0;
			const s = n.componentsPerAttribute, a = Co.createTypedArray(n.componentDatatype, l * s);
			for (; o < e;) {
				const t = r[o];
				if (-1 !== t) for (let e = 0; e < s; e++) a[s * t + e] = i[s * o + e];
				++o;
			}
			n.values = a;
		}
	}
	return t;
}, ha.reorderForPostVertexCache = function(t, e) {
	if (!N(t)) throw new v("geometry is required.");
	const n = t.indices;
	if (t.primitiveType === Go.TRIANGLES && N(n)) {
		const r = n.length;
		let i = 0;
		for (let t = 0; t < r; t++) n[t] > i && (i = n[t]);
		t.indices = la.tipsify({
			indices: n,
			maximumIndex: i,
			cacheSize: e
		});
	}
	return t;
}, ha.fitToUnsignedShortIndices = function(t) {
	if (!N(t)) throw new v("geometry is required.");
	if (N(t.indices) && t.primitiveType !== Go.TRIANGLES && t.primitiveType !== Go.LINES && t.primitiveType !== Go.POINTS) throw new v("geometry.primitiveType must equal to PrimitiveType.TRIANGLES, PrimitiveType.LINES, or PrimitiveType.POINTS.");
	const e = [], n = ko.computeNumberOfVertices(t);
	if (N(t.indices) && n >= D.SIXTY_FOUR_KILOBYTES) {
		let n = [], r = [], i = 0, o = pa(t.attributes);
		const s = t.indices, a = s.length;
		let u;
		t.primitiveType === Go.TRIANGLES ? u = 3 : t.primitiveType === Go.LINES ? u = 2 : t.primitiveType === Go.POINTS && (u = 1);
		for (let c = 0; c < a; c += u) {
			for (let e = 0; e < u; ++e) {
				const a = s[c + e];
				let u = n[a];
				N(u) || (u = i++, n[a] = u, da(o, t.attributes, a)), r.push(u);
			}
			i + u >= D.SIXTY_FOUR_KILOBYTES && (e.push(new ko({
				attributes: o,
				indices: r,
				primitiveType: t.primitiveType,
				boundingSphere: t.boundingSphere,
				boundingSphereCV: t.boundingSphereCV
			})), n = [], r = [], i = 0, o = pa(t.attributes));
		}
		0 !== r.length && e.push(new ko({
			attributes: o,
			indices: r,
			primitiveType: t.primitiveType,
			boundingSphere: t.boundingSphere,
			boundingSphereCV: t.boundingSphereCV
		}));
	} else e.push(t);
	return e;
};
const ma = new H(), ya = new rt();
ha.projectTo2D = function(t, e, n, r, i) {
	if (!N(t)) throw new v("geometry is required.");
	if (!N(e)) throw new v("attributeName is required.");
	if (!N(n)) throw new v("attributeName3D is required.");
	if (!N(r)) throw new v("attributeName2D is required.");
	if (!N(t.attributes[e])) throw new v(`geometry must have attribute matching the attributeName argument: ${e}.`);
	if (t.attributes[e].componentDatatype !== Co.DOUBLE) throw new v("The attribute componentDatatype must be ComponentDatatype.DOUBLE.");
	const o = t.attributes[e], s = (i = N(i) ? i : new wt()).ellipsoid, a = o.values, u = new Float64Array(a.length);
	let c = 0;
	for (let l = 0; l < a.length; l += 3) {
		const t = H.fromArray(a, l, ma), e = s.cartesianToCartographic(t, ya);
		if (!N(e)) throw new v(`Could not project point (${t.x}, ${t.y}, ${t.z}) to 2D.`);
		const n = i.project(e, ma);
		u[c++] = n.x, u[c++] = n.y, u[c++] = n.z;
	}
	return t.attributes[n] = o, t.attributes[r] = new ts({
		componentDatatype: Co.DOUBLE,
		componentsPerAttribute: 3,
		values: u
	}), delete t.attributes[e], t;
};
const ga = {
	high: 0,
	low: 0
};
ha.encodeAttribute = function(t, e, n, r) {
	if (!N(t)) throw new v("geometry is required.");
	if (!N(e)) throw new v("attributeName is required.");
	if (!N(n)) throw new v("attributeHighName is required.");
	if (!N(r)) throw new v("attributeLowName is required.");
	if (!N(t.attributes[e])) throw new v(`geometry must have attribute matching the attributeName argument: ${e}.`);
	if (t.attributes[e].componentDatatype !== Co.DOUBLE) throw new v("The attribute componentDatatype must be ComponentDatatype.DOUBLE.");
	const i = t.attributes[e], o = i.values, s = o.length, a = new Float32Array(s), u = new Float32Array(s);
	for (let l = 0; l < s; ++l) ms.encode(o[l], ga), a[l] = ga.high, u[l] = ga.low;
	const c = i.componentsPerAttribute;
	return t.attributes[n] = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: c,
		values: a
	}), t.attributes[r] = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: c,
		values: u
	}), delete t.attributes[e], t;
};
let wa = new H();
function Ea(t, e) {
	if (N(e)) {
		const n = e.values, r = n.length;
		for (let e = 0; e < r; e += 3) H.unpack(n, e, wa), Pn.multiplyByPoint(t, wa, wa), H.pack(wa, n, e);
	}
}
function _a(t, e) {
	if (N(e)) {
		const n = e.values, r = n.length;
		for (let e = 0; e < r; e += 3) H.unpack(n, e, wa), wn.multiplyByVector(t, wa, wa), wa = H.normalize(wa, wa), H.pack(wa, n, e);
	}
}
const Oa = new Pn(), ba = new wn();
ha.transformToWorldCoordinates = function(t) {
	if (!N(t)) throw new v("instance is required.");
	const e = t.modelMatrix;
	if (Pn.equals(e, Pn.IDENTITY)) return t;
	const n = t.geometry.attributes;
	Ea(e, n.position), Ea(e, n.prevPosition), Ea(e, n.nextPosition), (N(n.normal) || N(n.tangent) || N(n.bitangent)) && (Pn.inverse(e, Oa), Pn.transpose(Oa, Oa), Pn.getMatrix3(Oa, ba), _a(ba, n.normal), _a(ba, n.tangent), _a(ba, n.bitangent));
	const r = t.geometry.boundingSphere;
	return N(r) && (t.geometry.boundingSphere = Xi.transform(r, e, r)), t.modelMatrix = Pn.clone(Pn.IDENTITY), t;
};
const Ta = new H();
function Aa(t, e) {
	const n = t.length;
	let r, i, o, s;
	const a = t[0].modelMatrix, u = N(t[0][e].indices), c = t[0][e].primitiveType;
	for (i = 1; i < n; ++i) {
		if (!Pn.equals(t[i].modelMatrix, a)) throw new v("All instances must have the same modelMatrix.");
		if (N(t[i][e].indices) !== u) throw new v("All instance geometries must have an indices or not have one.");
		if (t[i][e].primitiveType !== c) throw new v("All instance geometries must have the same primitiveType.");
	}
	const l = function(t, e) {
		const n = t.length, r = {}, i = t[0][e].attributes;
		let o;
		for (o in i) if (i.hasOwnProperty(o) && N(i[o]) && N(i[o].values)) {
			const s = i[o];
			let a = s.values.length, u = !0;
			for (let r = 1; r < n; ++r) {
				const n = t[r][e].attributes[o];
				if (!N(n) || s.componentDatatype !== n.componentDatatype || s.componentsPerAttribute !== n.componentsPerAttribute || s.normalize !== n.normalize) {
					u = !1;
					break;
				}
				a += n.values.length;
			}
			u && (r[o] = new ts({
				componentDatatype: s.componentDatatype,
				componentsPerAttribute: s.componentsPerAttribute,
				normalize: s.normalize,
				values: Co.createTypedArray(s.componentDatatype, a)
			}));
		}
		return r;
	}(t, e);
	let h, f, p, d;
	for (r in l) if (l.hasOwnProperty(r)) for (h = l[r].values, s = 0, i = 0; i < n; ++i) for (f = t[i][e].attributes[r].values, p = f.length, o = 0; o < p; ++o) h[s++] = f[o];
	if (u) {
		let r = 0;
		for (i = 0; i < n; ++i) r += t[i][e].indices.length;
		const o = ko.computeNumberOfVertices(new ko({
			attributes: l,
			primitiveType: Go.POINTS
		})), a = ws.createTypedArray(o, r);
		let u = 0, c = 0;
		for (i = 0; i < n; ++i) {
			const n = t[i][e].indices, r = n.length;
			for (s = 0; s < r; ++s) a[u++] = c + n[s];
			c += ko.computeNumberOfVertices(t[i][e]);
		}
		d = a;
	}
	let m, y = new H(), g = 0;
	for (i = 0; i < n; ++i) {
		if (m = t[i][e].boundingSphere, !N(m)) {
			y = void 0;
			break;
		}
		H.add(m.center, y, y);
	}
	if (N(y)) for (H.divideByScalar(y, n, y), i = 0; i < n; ++i) {
		m = t[i][e].boundingSphere;
		const n = H.magnitude(H.subtract(m.center, y, Ta)) + m.radius;
		n > g && (g = n);
	}
	return new ko({
		attributes: l,
		indices: d,
		primitiveType: c,
		boundingSphere: N(y) ? new Xi(y, g) : void 0
	});
}
ha.combineInstances = function(t) {
	if (!N(t) || t.length < 1) throw new v("instances is required and must have length greater than zero.");
	const e = [], n = [], r = t.length;
	for (let o = 0; o < r; ++o) {
		const r = t[o];
		N(r.geometry) ? e.push(r) : N(r.westHemisphereGeometry) && N(r.eastHemisphereGeometry) && n.push(r);
	}
	const i = [];
	return e.length > 0 && i.push(Aa(e, "geometry")), n.length > 0 && (i.push(Aa(n, "westHemisphereGeometry")), i.push(Aa(n, "eastHemisphereGeometry"))), i;
};
const xa = new H(), Ra = new H(), Sa = new H(), Ia = new H();
ha.computeNormal = function(t) {
	if (!N(t)) throw new v("geometry is required.");
	if (!N(t.attributes.position) || !N(t.attributes.position.values)) throw new v("geometry.attributes.position.values is required.");
	if (!N(t.indices)) throw new v("geometry.indices is required.");
	if (t.indices.length < 2 || t.indices.length % 3 != 0) throw new v("geometry.indices length must be greater than 0 and be a multiple of 3.");
	if (t.primitiveType !== Go.TRIANGLES) throw new v("geometry.primitiveType must be PrimitiveType.TRIANGLES.");
	const e = t.indices, n = t.attributes, r = n.position.values, i = n.position.values.length / 3, o = e.length, s = new Array(i), a = new Array(o / 3), u = new Array(o);
	let c;
	for (c = 0; c < i; c++) s[c] = {
		indexOffset: 0,
		count: 0,
		currentCount: 0
	};
	let l = 0;
	for (c = 0; c < o; c += 3) {
		const t = e[c], n = e[c + 1], i = e[c + 2], o = 3 * t, u = 3 * n, h = 3 * i;
		Ra.x = r[o], Ra.y = r[o + 1], Ra.z = r[o + 2], Sa.x = r[u], Sa.y = r[u + 1], Sa.z = r[u + 2], Ia.x = r[h], Ia.y = r[h + 1], Ia.z = r[h + 2], s[t].count++, s[n].count++, s[i].count++, H.subtract(Sa, Ra, Sa), H.subtract(Ia, Ra, Ia), a[l] = H.cross(Sa, Ia, new H()), l++;
	}
	let h, f = 0;
	for (c = 0; c < i; c++) s[c].indexOffset += f, f += s[c].count;
	for (l = 0, c = 0; c < o; c += 3) {
		h = s[e[c]];
		let t = h.indexOffset + h.currentCount;
		u[t] = l, h.currentCount++, h = s[e[c + 1]], t = h.indexOffset + h.currentCount, u[t] = l, h.currentCount++, h = s[e[c + 2]], t = h.indexOffset + h.currentCount, u[t] = l, h.currentCount++, l++;
	}
	const p = new Float32Array(3 * i);
	for (c = 0; c < i; c++) {
		const t = 3 * c;
		if (h = s[c], H.clone(H.ZERO, xa), h.count > 0) {
			for (l = 0; l < h.count; l++) H.add(xa, a[u[h.indexOffset + l]], xa);
			H.equalsEpsilon(H.ZERO, xa, D.EPSILON10) && H.clone(a[u[h.indexOffset]], xa);
		}
		H.equalsEpsilon(H.ZERO, xa, D.EPSILON10) && (xa.z = 1), H.normalize(xa, xa), p[t] = xa.x, p[t + 1] = xa.y, p[t + 2] = xa.z;
	}
	return t.attributes.normal = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: 3,
		values: p
	}), t;
};
const Na = new H(), va = new H(), Ma = new H();
ha.computeTangentAndBitangent = function(t) {
	if (!N(t)) throw new v("geometry is required.");
	const e = t.attributes, n = t.indices;
	if (!N(e.position) || !N(e.position.values)) throw new v("geometry.attributes.position.values is required.");
	if (!N(e.normal) || !N(e.normal.values)) throw new v("geometry.attributes.normal.values is required.");
	if (!N(e.st) || !N(e.st.values)) throw new v("geometry.attributes.st.values is required.");
	if (!N(n)) throw new v("geometry.indices is required.");
	if (n.length < 2 || n.length % 3 != 0) throw new v("geometry.indices length must be greater than 0 and be a multiple of 3.");
	if (t.primitiveType !== Go.TRIANGLES) throw new v("geometry.primitiveType must be PrimitiveType.TRIANGLES.");
	const r = t.attributes.position.values, i = t.attributes.normal.values, o = t.attributes.st.values, s = t.attributes.position.values.length / 3, a = n.length, u = new Array(3 * s);
	let c, l, h, f;
	for (c = 0; c < u.length; c++) u[c] = 0;
	for (c = 0; c < a; c += 3) {
		const t = n[c], e = n[c + 1], i = n[c + 2];
		l = 3 * t, h = 3 * e, f = 3 * i;
		const s = 2 * t, a = 2 * e, p = 2 * i, d = r[l], m = r[l + 1], y = r[l + 2], g = o[s], w = o[s + 1], E = o[a + 1] - w, _ = o[p + 1] - w, O = 1 / ((o[a] - g) * _ - (o[p] - g) * E), b = (_ * (r[h] - d) - E * (r[f] - d)) * O, T = (_ * (r[h + 1] - m) - E * (r[f + 1] - m)) * O, A = (_ * (r[h + 2] - y) - E * (r[f + 2] - y)) * O;
		u[l] += b, u[l + 1] += T, u[l + 2] += A, u[h] += b, u[h + 1] += T, u[h + 2] += A, u[f] += b, u[f + 1] += T, u[f + 2] += A;
	}
	const p = new Float32Array(3 * s), d = new Float32Array(3 * s);
	for (c = 0; c < s; c++) {
		l = 3 * c, h = l + 1, f = l + 2;
		const t = H.fromArray(i, l, Na), e = H.fromArray(u, l, Ma), n = H.dot(t, e);
		H.multiplyByScalar(t, n, va), H.normalize(H.subtract(e, va, e), e), p[l] = e.x, p[h] = e.y, p[f] = e.z, H.normalize(H.cross(t, e, e), e), d[l] = e.x, d[h] = e.y, d[f] = e.z;
	}
	return t.attributes.tangent = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: 3,
		values: p
	}), t.attributes.bitangent = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: 3,
		values: d
	}), t;
};
const Pa = new F(), Ca = new H(), qa = new H(), Ua = new H();
let La = new F();
function Da(t, e) {
	Math.abs(t.y) < D.EPSILON6 && (t.y = e ? -D.EPSILON6 : D.EPSILON6);
}
ha.compressVertices = function(t) {
	if (!N(t)) throw new v("geometry is required.");
	const e = t.attributes.extrudeDirection;
	let n, r;
	if (N(e)) {
		const i = e.values;
		r = i.length / 3;
		const o = new Float32Array(2 * r);
		let s = 0;
		for (n = 0; n < r; ++n) H.fromArray(i, 3 * n, Ca), H.equals(Ca, H.ZERO) ? s += 2 : (La = ss.octEncodeInRange(Ca, 65535, La), o[s++] = La.x, o[s++] = La.y);
		return t.attributes.compressedAttributes = new ts({
			componentDatatype: Co.FLOAT,
			componentsPerAttribute: 2,
			values: o
		}), delete t.attributes.extrudeDirection, t;
	}
	const i = t.attributes.normal, o = t.attributes.st, s = N(i), a = N(o);
	if (!s && !a) return t;
	const u = t.attributes.tangent, c = t.attributes.bitangent, l = N(u), h = N(c);
	let f, p, d, m;
	s && (f = i.values), a && (p = o.values), l && (d = u.values), h && (m = c.values), r = (s ? f.length : p.length) / (s ? 3 : 2);
	let y = r, g = a && s ? 2 : 1;
	g += l || h ? 1 : 0, y *= g;
	const w = new Float32Array(y);
	let E = 0;
	for (n = 0; n < r; ++n) {
		a && (F.fromArray(p, 2 * n, Pa), w[E++] = ss.compressTextureCoordinates(Pa));
		const t = 3 * n;
		s && N(d) && N(m) ? (H.fromArray(f, t, Ca), H.fromArray(d, t, qa), H.fromArray(m, t, Ua), ss.octPack(Ca, qa, Ua, Pa), w[E++] = Pa.x, w[E++] = Pa.y) : (s && (H.fromArray(f, t, Ca), w[E++] = ss.octEncodeFloat(Ca)), l && (H.fromArray(d, t, Ca), w[E++] = ss.octEncodeFloat(Ca)), h && (H.fromArray(m, t, Ca), w[E++] = ss.octEncodeFloat(Ca)));
	}
	return t.attributes.compressedAttributes = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: g,
		values: w
	}), s && delete t.attributes.normal, a && delete t.attributes.st, h && delete t.attributes.bitangent, l && delete t.attributes.tangent, t;
};
const za = new H();
function ja(t, e, n, r) {
	H.add(t, H.multiplyByScalar(H.subtract(e, t, za), t.y / (t.y - e.y), za), n), H.clone(n, r), Da(n, !0), Da(r, !1);
}
const Fa = new H(), Ba = new H(), Ga = new H(), ka = new H(), Wa = {
	positions: new Array(7),
	indices: new Array(9)
};
function Va(t, e, n) {
	if (t.x >= 0 || e.x >= 0 || n.x >= 0) return;
	(function(t, e, n) {
		if (0 !== t.y && 0 !== e.y && 0 !== n.y) return Da(t, t.y < 0), Da(e, e.y < 0), void Da(n, n.y < 0);
		const r = Math.abs(t.y), i = Math.abs(e.y), o = Math.abs(n.y);
		let s;
		s = r > i ? r > o ? D.sign(t.y) : D.sign(n.y) : i > o ? D.sign(e.y) : D.sign(n.y);
		const a = s < 0;
		Da(t, a), Da(e, a), Da(n, a);
	})(t, e, n);
	const r = t.y < 0, i = e.y < 0, o = n.y < 0;
	let s = 0;
	s += r ? 1 : 0, s += i ? 1 : 0, s += o ? 1 : 0;
	const a = Wa.indices;
	1 === s ? (a[1] = 3, a[2] = 4, a[5] = 6, a[7] = 6, a[8] = 5, r ? (ja(t, e, Fa, Ga), ja(t, n, Ba, ka), a[0] = 0, a[3] = 1, a[4] = 2, a[6] = 1) : i ? (ja(e, n, Fa, Ga), ja(e, t, Ba, ka), a[0] = 1, a[3] = 2, a[4] = 0, a[6] = 2) : o && (ja(n, t, Fa, Ga), ja(n, e, Ba, ka), a[0] = 2, a[3] = 0, a[4] = 1, a[6] = 0)) : 2 === s && (a[2] = 4, a[4] = 4, a[5] = 3, a[7] = 5, a[8] = 6, r ? i ? o || (ja(n, t, Fa, Ga), ja(n, e, Ba, ka), a[0] = 0, a[1] = 1, a[3] = 0, a[6] = 2) : (ja(e, n, Fa, Ga), ja(e, t, Ba, ka), a[0] = 2, a[1] = 0, a[3] = 2, a[6] = 1) : (ja(t, e, Fa, Ga), ja(t, n, Ba, ka), a[0] = 1, a[1] = 2, a[3] = 1, a[6] = 0));
	const u = Wa.positions;
	return u[0] = t, u[1] = e, u[2] = n, u.length = 3, 1 !== s && 2 !== s || (u[3] = Fa, u[4] = Ba, u[5] = Ga, u[6] = ka, u.length = 7), Wa;
}
function Ha(t, e) {
	const n = t.attributes;
	if (0 === n.position.values.length) return;
	for (const i in n) if (n.hasOwnProperty(i) && N(n[i]) && N(n[i].values)) {
		const t = n[i];
		t.values = Co.createTypedArray(t.componentDatatype, t.values);
	}
	const r = ko.computeNumberOfVertices(t);
	return t.indices = ws.createTypedArray(r, t.indices), e && (t.boundingSphere = Xi.fromVertices(n.position.values)), t;
}
function Xa(t) {
	const e = t.attributes, n = {};
	for (const r in e) if (e.hasOwnProperty(r) && N(e[r]) && N(e[r].values)) {
		const t = e[r];
		n[r] = new ts({
			componentDatatype: t.componentDatatype,
			componentsPerAttribute: t.componentsPerAttribute,
			normalize: t.normalize,
			values: []
		});
	}
	return new ko({
		attributes: n,
		indices: [],
		primitiveType: t.primitiveType
	});
}
function Ya(t, e, n) {
	const r = N(t.geometry.boundingSphere);
	e = Ha(e, r), N(n = Ha(n, r)) && !N(e) ? t.geometry = n : !N(n) && N(e) ? t.geometry = e : (t.westHemisphereGeometry = e, t.eastHemisphereGeometry = n, t.geometry = void 0);
}
function $a(t, e) {
	const n = new t(), r = new t(), i = new t();
	return function(o, s, a, u, c, l, h, f) {
		const p = t.fromArray(c, o * e, n), d = t.fromArray(c, s * e, r), m = t.fromArray(c, a * e, i);
		t.multiplyByScalar(p, u.x, p), t.multiplyByScalar(d, u.y, d), t.multiplyByScalar(m, u.z, m);
		const y = t.add(p, d, p);
		t.add(y, m, y), f && t.normalize(y, y), t.pack(y, l, h * e);
	};
}
const Za = $a(_t, 4), Qa = $a(H, 3), Ka = $a(F, 2), Ja = new H(), tu = new H(), eu = new H(), nu = new H();
function ru(t, e, n, r, i, o, s, a, u, c, l, h, f, p, d, m) {
	if (!(N(o) || N(s) || N(a) || N(u) || N(c) || 0 !== p)) return;
	const y = function(t, e, n, r, i) {
		let o, s, a, u, c, l, h, f;
		if (M.defined("point", t), M.defined("p0", e), M.defined("p1", n), M.defined("p2", r), N(i) || (i = new H()), N(e.z)) {
			if (H.equalsEpsilon(t, e, D.EPSILON14)) return H.clone(H.UNIT_X, i);
			if (H.equalsEpsilon(t, n, D.EPSILON14)) return H.clone(H.UNIT_Y, i);
			if (H.equalsEpsilon(t, r, D.EPSILON14)) return H.clone(H.UNIT_Z, i);
			o = H.subtract(n, e, fs), s = H.subtract(r, e, ps), a = H.subtract(t, e, ds), u = H.dot(o, o), c = H.dot(o, s), l = H.dot(o, a), h = H.dot(s, s), f = H.dot(s, a);
		} else {
			if (F.equalsEpsilon(t, e, D.EPSILON14)) return H.clone(H.UNIT_X, i);
			if (F.equalsEpsilon(t, n, D.EPSILON14)) return H.clone(H.UNIT_Y, i);
			if (F.equalsEpsilon(t, r, D.EPSILON14)) return H.clone(H.UNIT_Z, i);
			o = F.subtract(n, e, fs), s = F.subtract(r, e, ps), a = F.subtract(t, e, ds), u = F.dot(o, o), c = F.dot(o, s), l = F.dot(o, a), h = F.dot(s, s), f = F.dot(s, a);
		}
		i.y = h * l - c * f, i.z = u * f - c * l;
		const p = u * h - c * c;
		if (0 !== p) return i.y /= p, i.z /= p, i.x = 1 - i.y - i.z, i;
	}(r, H.fromArray(i, 3 * t, Ja), H.fromArray(i, 3 * e, tu), H.fromArray(i, 3 * n, eu), nu);
	if (N(y)) {
		if (N(o) && Qa(t, e, n, y, o, h.normal.values, m, !0), N(c)) {
			const r = H.fromArray(c, 3 * t, Ja), i = H.fromArray(c, 3 * e, tu), o = H.fromArray(c, 3 * n, eu);
			let s;
			H.multiplyByScalar(r, y.x, r), H.multiplyByScalar(i, y.y, i), H.multiplyByScalar(o, y.z, o), H.equals(r, H.ZERO) && H.equals(i, H.ZERO) && H.equals(o, H.ZERO) ? (s = Ja, s.x = 0, s.y = 0, s.z = 0) : (s = H.add(r, i, r), H.add(s, o, s), H.normalize(s, s)), H.pack(s, h.extrudeDirection.values, 3 * m);
		}
		if (N(l) && function(t, e, n, r, i, o, s) {
			const a = i[t] * r.x, u = i[e] * r.y, c = i[n] * r.z;
			o[s] = a + u + c > D.EPSILON6 ? 1 : 0;
		}(t, e, n, y, l, h.applyOffset.values, m), N(s) && Qa(t, e, n, y, s, h.tangent.values, m, !0), N(a) && Qa(t, e, n, y, a, h.bitangent.values, m, !0), N(u) && Ka(t, e, n, y, u, h.st.values, m), p > 0) for (let r = 0; r < p; r++) {
			const i = f[r];
			iu(t, e, n, y, m, d[i], h[i]);
		}
	}
}
function iu(t, e, n, r, i, o, s) {
	const a = o.componentsPerAttribute, u = o.values, c = s.values;
	switch (a) {
		case 4:
			Za(t, e, n, r, u, c, i, !1);
			break;
		case 3:
			Qa(t, e, n, r, u, c, i, !1);
			break;
		case 2:
			Ka(t, e, n, r, u, c, i, !1);
			break;
		default: c[i] = u[t] * r.x + u[e] * r.y + u[n] * r.z;
	}
}
function ou(t, e, n, r, i, o) {
	const s = t.position.values.length / 3;
	if (-1 !== i) {
		const a = r[i], u = n[a];
		return -1 === u ? (n[a] = s, t.position.values.push(o.x, o.y, o.z), e.push(s), s) : (e.push(u), u);
	}
	return t.position.values.push(o.x, o.y, o.z), e.push(s), s;
}
const su = {
	position: !0,
	normal: !0,
	bitangent: !0,
	tangent: !0,
	st: !0,
	extrudeDirection: !0,
	applyOffset: !0
};
function au(t) {
	const e = t.geometry, n = e.attributes, r = n.position.values, i = N(n.normal) ? n.normal.values : void 0, o = N(n.bitangent) ? n.bitangent.values : void 0, s = N(n.tangent) ? n.tangent.values : void 0, a = N(n.st) ? n.st.values : void 0, u = N(n.extrudeDirection) ? n.extrudeDirection.values : void 0, c = N(n.applyOffset) ? n.applyOffset.values : void 0, l = e.indices, h = [];
	for (const T in n) n.hasOwnProperty(T) && !su[T] && N(n[T]) && h.push(T);
	const f = h.length, p = Xa(e), d = Xa(e);
	let m, y, g, w, E;
	const _ = [];
	_.length = r.length / 3;
	const O = [];
	for (O.length = r.length / 3, E = 0; E < _.length; ++E) _[E] = -1, O[E] = -1;
	const b = l.length;
	for (E = 0; E < b; E += 3) {
		const t = l[E], e = l[E + 1], b = l[E + 2];
		let T = H.fromArray(r, 3 * t), A = H.fromArray(r, 3 * e), x = H.fromArray(r, 3 * b);
		const R = Va(T, A, x);
		if (N(R) && R.positions.length > 3) {
			const T = R.positions, A = R.indices, x = A.length;
			for (let R = 0; R < x; ++R) {
				const x = A[R], S = T[x];
				S.y < 0 ? (m = d.attributes, y = d.indices, g = _) : (m = p.attributes, y = p.indices, g = O), w = ou(m, y, g, l, x < 3 ? E + x : -1, S), ru(t, e, b, S, r, i, s, o, a, u, c, m, h, f, n, w);
			}
		} else N(R) && (T = R.positions[0], A = R.positions[1], x = R.positions[2]), T.y < 0 ? (m = d.attributes, y = d.indices, g = _) : (m = p.attributes, y = p.indices, g = O), w = ou(m, y, g, l, E, T), ru(t, e, b, T, r, i, s, o, a, u, c, m, h, f, n, w), w = ou(m, y, g, l, E + 1, A), ru(t, e, b, A, r, i, s, o, a, u, c, m, h, f, n, w), w = ou(m, y, g, l, E + 2, x), ru(t, e, b, x, r, i, s, o, a, u, c, m, h, f, n, w);
	}
	Ya(t, d, p);
}
const uu = ia.fromPointNormal(H.ZERO, H.UNIT_Y), cu = new H(), lu = new H();
function hu(t, e, n, r, i, o, s) {
	if (!N(s)) return;
	const a = H.fromArray(r, 3 * t, Ja);
	H.equalsEpsilon(a, n, D.EPSILON10) ? o.applyOffset.values[i] = s[t] : o.applyOffset.values[i] = s[e];
}
function fu(t) {
	const e = t.geometry, n = e.attributes, r = n.position.values, i = N(n.applyOffset) ? n.applyOffset.values : void 0, o = e.indices, s = Xa(e), a = Xa(e);
	let u;
	const c = o.length, l = [];
	l.length = r.length / 3;
	const h = [];
	for (h.length = r.length / 3, u = 0; u < l.length; ++u) l[u] = -1, h[u] = -1;
	for (u = 0; u < c; u += 2) {
		const t = o[u], e = o[u + 1], n = H.fromArray(r, 3 * t, Ja), c = H.fromArray(r, 3 * e, tu);
		let f;
		Math.abs(n.y) < D.EPSILON6 && (n.y < 0 ? n.y = -D.EPSILON6 : n.y = D.EPSILON6), Math.abs(c.y) < D.EPSILON6 && (c.y < 0 ? c.y = -D.EPSILON6 : c.y = D.EPSILON6);
		let p = s.attributes, d = s.indices, m = h, y = a.attributes, g = a.indices, w = l;
		const E = xs.lineSegmentPlane(n, c, uu, eu);
		if (N(E)) {
			const _ = H.multiplyByScalar(H.UNIT_Y, 5 * D.EPSILON9, cu);
			n.y < 0 && (H.negate(_, _), p = a.attributes, d = a.indices, m = l, y = s.attributes, g = s.indices, w = h);
			const O = H.add(E, _, lu);
			f = ou(p, d, m, o, u, n), hu(t, e, n, r, f, p, i), f = ou(p, d, m, o, -1, O), hu(t, e, O, r, f, p, i), H.negate(_, _), H.add(E, _, O), f = ou(y, g, w, o, -1, O), hu(t, e, O, r, f, y, i), f = ou(y, g, w, o, u + 1, c), hu(t, e, c, r, f, y, i);
		} else {
			let p, d, m;
			n.y < 0 ? (p = a.attributes, d = a.indices, m = l) : (p = s.attributes, d = s.indices, m = h), f = ou(p, d, m, o, u, n), hu(t, e, n, r, f, p, i), f = ou(p, d, m, o, u + 1, c), hu(t, e, c, r, f, p, i);
		}
	}
	Ya(t, a, s);
}
const pu = new F(), du = new F(), mu = new H(), yu = new H(), gu = new H(), wu = new H(), Eu = new H(), _u = new H(), Ou = new _t();
function bu(t) {
	const e = t.attributes, n = e.position.values, r = e.prevPosition.values, i = e.nextPosition.values, o = n.length;
	for (let s = 0; s < o; s += 3) {
		const t = H.unpack(n, s, mu);
		if (t.x > 0) continue;
		const e = H.unpack(r, s, yu);
		(t.y < 0 && e.y > 0 || t.y > 0 && e.y < 0) && (s - 3 > 0 ? (r[s] = n[s - 3], r[s + 1] = n[s - 2], r[s + 2] = n[s - 1]) : H.pack(t, r, s));
		const a = H.unpack(i, s, gu);
		(t.y < 0 && a.y > 0 || t.y > 0 && a.y < 0) && (s + 3 < o ? (i[s] = n[s + 3], i[s + 1] = n[s + 4], i[s + 2] = n[s + 5]) : H.pack(t, i, s));
	}
}
const Tu = 5 * D.EPSILON9, Au = D.EPSILON6;
function xu(t, e, n) {
	this.minimum = H.clone(t ?? H.ZERO), this.maximum = H.clone(e ?? H.ZERO), n = N(n) ? H.clone(n) : H.midpoint(this.minimum, this.maximum, new H()), this.center = n;
}
ha.splitLongitude = function(t) {
	if (!N(t)) throw new v("instance is required.");
	const e = t.geometry, n = e.boundingSphere;
	if (N(n) && (n.center.x - n.radius > 0 || Xi.intersectPlane(n, ia.ORIGIN_ZX_PLANE) !== Et.INTERSECTING)) return t;
	if (e.geometryType !== qo.NONE) switch (e.geometryType) {
		case qo.POLYLINES:
			(function(t) {
				const e = t.geometry, n = e.attributes, r = n.position.values, i = n.prevPosition.values, o = n.nextPosition.values, s = n.expandAndWidth.values, a = N(n.st) ? n.st.values : void 0, u = N(n.color) ? n.color.values : void 0, c = Xa(e), l = Xa(e);
				let h, f, p, d = !1;
				const m = r.length / 3;
				for (h = 0; h < m; h += 4) {
					const t = h, e = h + 2, n = H.fromArray(r, 3 * t, mu), m = H.fromArray(r, 3 * e, yu);
					if (Math.abs(n.y) < Au) for (n.y = Au * (m.y < 0 ? -1 : 1), r[3 * h + 1] = n.y, r[3 * (h + 1) + 1] = n.y, f = 3 * t; f < 3 * t + 12; f += 3) i[f] = r[3 * h], i[f + 1] = r[3 * h + 1], i[f + 2] = r[3 * h + 2];
					if (Math.abs(m.y) < Au) for (m.y = Au * (n.y < 0 ? -1 : 1), r[3 * (h + 2) + 1] = m.y, r[3 * (h + 3) + 1] = m.y, f = 3 * t; f < 3 * t + 12; f += 3) o[f] = r[3 * (h + 2)], o[f + 1] = r[3 * (h + 2) + 1], o[f + 2] = r[3 * (h + 2) + 2];
					let y = c.attributes, g = c.indices, w = l.attributes, E = l.indices;
					const _ = xs.lineSegmentPlane(n, m, uu, wu);
					if (N(_)) {
						d = !0;
						const r = H.multiplyByScalar(H.UNIT_Y, Tu, Eu);
						n.y < 0 && (H.negate(r, r), y = l.attributes, g = l.indices, w = c.attributes, E = c.indices);
						const O = H.add(_, r, _u);
						y.position.values.push(n.x, n.y, n.z, n.x, n.y, n.z), y.position.values.push(O.x, O.y, O.z), y.position.values.push(O.x, O.y, O.z), y.prevPosition.values.push(i[3 * t], i[3 * t + 1], i[3 * t + 2]), y.prevPosition.values.push(i[3 * t + 3], i[3 * t + 4], i[3 * t + 5]), y.prevPosition.values.push(n.x, n.y, n.z, n.x, n.y, n.z), y.nextPosition.values.push(O.x, O.y, O.z), y.nextPosition.values.push(O.x, O.y, O.z), y.nextPosition.values.push(O.x, O.y, O.z), y.nextPosition.values.push(O.x, O.y, O.z), H.negate(r, r), H.add(_, r, O), w.position.values.push(O.x, O.y, O.z), w.position.values.push(O.x, O.y, O.z), w.position.values.push(m.x, m.y, m.z, m.x, m.y, m.z), w.prevPosition.values.push(O.x, O.y, O.z), w.prevPosition.values.push(O.x, O.y, O.z), w.prevPosition.values.push(O.x, O.y, O.z), w.prevPosition.values.push(O.x, O.y, O.z), w.nextPosition.values.push(m.x, m.y, m.z, m.x, m.y, m.z), w.nextPosition.values.push(o[3 * e], o[3 * e + 1], o[3 * e + 2]), w.nextPosition.values.push(o[3 * e + 3], o[3 * e + 4], o[3 * e + 5]);
						const b = F.fromArray(s, 2 * t, pu), T = Math.abs(b.y);
						y.expandAndWidth.values.push(-1, T, 1, T), y.expandAndWidth.values.push(-1, -T, 1, -T), w.expandAndWidth.values.push(-1, T, 1, T), w.expandAndWidth.values.push(-1, -T, 1, -T);
						let A = H.magnitudeSquared(H.subtract(_, n, gu));
						if (A /= H.magnitudeSquared(H.subtract(m, n, gu)), N(u)) {
							const n = _t.fromArray(u, 4 * t, Ou), r = _t.fromArray(u, 4 * e, Ou), i = D.lerp(n.x, r.x, A), o = D.lerp(n.y, r.y, A), s = D.lerp(n.z, r.z, A), a = D.lerp(n.w, r.w, A);
							for (f = 4 * t; f < 4 * t + 8; ++f) y.color.values.push(u[f]);
							for (y.color.values.push(i, o, s, a), y.color.values.push(i, o, s, a), w.color.values.push(i, o, s, a), w.color.values.push(i, o, s, a), f = 4 * e; f < 4 * e + 8; ++f) w.color.values.push(u[f]);
						}
						if (N(a)) {
							const n = F.fromArray(a, 2 * t, pu), r = F.fromArray(a, 2 * (h + 3), du), i = D.lerp(n.x, r.x, A);
							for (f = 2 * t; f < 2 * t + 4; ++f) y.st.values.push(a[f]);
							for (y.st.values.push(i, n.y), y.st.values.push(i, r.y), w.st.values.push(i, n.y), w.st.values.push(i, r.y), f = 2 * e; f < 2 * e + 4; ++f) w.st.values.push(a[f]);
						}
						p = y.position.values.length / 3 - 4, g.push(p, p + 2, p + 1), g.push(p + 1, p + 2, p + 3), p = w.position.values.length / 3 - 4, E.push(p, p + 2, p + 1), E.push(p + 1, p + 2, p + 3);
					} else {
						let t, e;
						for (n.y < 0 ? (t = l.attributes, e = l.indices) : (t = c.attributes, e = c.indices), t.position.values.push(n.x, n.y, n.z), t.position.values.push(n.x, n.y, n.z), t.position.values.push(m.x, m.y, m.z), t.position.values.push(m.x, m.y, m.z), f = 3 * h; f < 3 * h + 12; ++f) t.prevPosition.values.push(i[f]), t.nextPosition.values.push(o[f]);
						for (f = 2 * h; f < 2 * h + 8; ++f) t.expandAndWidth.values.push(s[f]), N(a) && t.st.values.push(a[f]);
						if (N(u)) for (f = 4 * h; f < 4 * h + 16; ++f) t.color.values.push(u[f]);
						p = t.position.values.length / 3 - 4, e.push(p, p + 2, p + 1), e.push(p + 1, p + 2, p + 3);
					}
				}
				d && (bu(l), bu(c)), Ya(t, l, c);
			})(t);
			break;
		case qo.TRIANGLES:
			au(t);
			break;
		case qo.LINES: fu(t);
	}
	else (function(t) {
		switch (t.primitiveType) {
			case Go.TRIANGLE_FAN: return function(t) {
				const e = ko.computeNumberOfVertices(t);
				if (e < 3) throw new v("The number of vertices must be at least three.");
				const n = ws.createTypedArray(e, 3 * (e - 2));
				n[0] = 1, n[1] = 0, n[2] = 2;
				let r = 3;
				for (let i = 3; i < e; ++i) n[r++] = i - 1, n[r++] = 0, n[r++] = i;
				return t.indices = n, t.primitiveType = Go.TRIANGLES, t;
			}(t);
			case Go.TRIANGLE_STRIP: return function(t) {
				const e = ko.computeNumberOfVertices(t);
				if (e < 3) throw new v("The number of vertices must be at least 3.");
				const n = ws.createTypedArray(e, 3 * (e - 2));
				n[0] = 0, n[1] = 1, n[2] = 2, e > 3 && (n[3] = 0, n[4] = 2, n[5] = 3);
				let r = 6;
				for (let i = 3; i < e - 1; i += 2) n[r++] = i, n[r++] = i - 1, n[r++] = i + 1, i + 2 < e && (n[r++] = i, n[r++] = i + 1, n[r++] = i + 2);
				return t.indices = n, t.primitiveType = Go.TRIANGLES, t;
			}(t);
			case Go.TRIANGLES: return function(t) {
				if (N(t.indices)) return t;
				const e = ko.computeNumberOfVertices(t);
				if (e < 3) throw new v("The number of vertices must be at least three.");
				if (e % 3 != 0) throw new v("The number of vertices must be a multiple of three.");
				const n = ws.createTypedArray(e, e);
				for (let r = 0; r < e; ++r) n[r] = r;
				return t.indices = n, t;
			}(t);
			case Go.LINE_STRIP: return function(t) {
				const e = ko.computeNumberOfVertices(t);
				if (e < 2) throw new v("The number of vertices must be at least two.");
				const n = ws.createTypedArray(e, 2 * (e - 1));
				n[0] = 0, n[1] = 1;
				let r = 2;
				for (let i = 2; i < e; ++i) n[r++] = i - 1, n[r++] = i;
				return t.indices = n, t.primitiveType = Go.LINES, t;
			}(t);
			case Go.LINE_LOOP: return function(t) {
				const e = ko.computeNumberOfVertices(t);
				if (e < 2) throw new v("The number of vertices must be at least two.");
				const n = ws.createTypedArray(e, 2 * e);
				n[0] = 0, n[1] = 1;
				let r = 2;
				for (let i = 2; i < e; ++i) n[r++] = i - 1, n[r++] = i;
				return n[r++] = e - 1, n[r] = 0, t.indices = n, t.primitiveType = Go.LINES, t;
			}(t);
			case Go.LINES: return function(t) {
				if (N(t.indices)) return t;
				const e = ko.computeNumberOfVertices(t);
				if (e < 2) throw new v("The number of vertices must be at least two.");
				if (e % 2 != 0) throw new v("The number of vertices must be a multiple of 2.");
				const n = ws.createTypedArray(e, e);
				for (let r = 0; r < e; ++r) n[r] = r;
				return t.indices = n, t;
			}(t);
		}
	})(e), e.primitiveType === Go.TRIANGLES ? au(t) : e.primitiveType === Go.LINES && fu(t);
	return t;
}, xu.fromCorners = function(t, e, n) {
	return M.defined("minimum", t), M.defined("maximum", e), N(n) || (n = new xu()), n.minimum = H.clone(t, n.minimum), n.maximum = H.clone(e, n.maximum), n.center = H.midpoint(t, e, n.center), n;
}, xu.fromPoints = function(t, e) {
	if (N(e) || (e = new xu()), !N(t) || 0 === t.length) return e.minimum = H.clone(H.ZERO, e.minimum), e.maximum = H.clone(H.ZERO, e.maximum), e.center = H.clone(H.ZERO, e.center), e;
	let n = t[0].x, r = t[0].y, i = t[0].z, o = t[0].x, s = t[0].y, a = t[0].z;
	const u = t.length;
	for (let h = 1; h < u; h++) {
		const e = t[h], u = e.x, c = e.y, l = e.z;
		n = Math.min(u, n), o = Math.max(u, o), r = Math.min(c, r), s = Math.max(c, s), i = Math.min(l, i), a = Math.max(l, a);
	}
	const c = e.minimum;
	c.x = n, c.y = r, c.z = i;
	const l = e.maximum;
	return l.x = o, l.y = s, l.z = a, e.center = H.midpoint(c, l, e.center), e;
}, xu.clone = function(t, e) {
	if (N(t)) return N(e) ? (e.minimum = H.clone(t.minimum, e.minimum), e.maximum = H.clone(t.maximum, e.maximum), e.center = H.clone(t.center, e.center), e) : new xu(t.minimum, t.maximum, t.center);
}, xu.equals = function(t, e) {
	return t === e || N(t) && N(e) && H.equals(t.center, e.center) && H.equals(t.minimum, e.minimum) && H.equals(t.maximum, e.maximum);
};
let Ru = new H();
xu.intersectPlane = function(t, e) {
	M.defined("box", t), M.defined("plane", e), Ru = H.subtract(t.maximum, t.minimum, Ru);
	const n = H.multiplyByScalar(Ru, .5, Ru), r = e.normal, i = n.x * Math.abs(r.x) + n.y * Math.abs(r.y) + n.z * Math.abs(r.z), o = H.dot(t.center, r) + e.distance;
	return o - i > 0 ? Et.INSIDE : o + i < 0 ? Et.OUTSIDE : Et.INTERSECTING;
}, xu.intersectAxisAlignedBoundingBox = function(t, e) {
	return M.defined("box", t), M.defined("other", e), t.minimum.x <= e.maximum.x && t.maximum.x >= e.minimum.x && t.minimum.y <= e.maximum.y && t.maximum.y >= e.minimum.y && t.minimum.z <= e.maximum.z && t.maximum.z >= e.minimum.z;
}, xu.prototype.clone = function(t) {
	return xu.clone(this, t);
}, xu.prototype.intersectPlane = function(t) {
	return xu.intersectPlane(this, t);
}, xu.prototype.intersectAxisAlignedBoundingBox = function(t) {
	return xu.intersectAxisAlignedBoundingBox(this, t);
}, xu.prototype.equals = function(t) {
	return xu.equals(this, t);
};
const Su = new _t();
function Iu(t, e) {
	if (M.defined("origin", t), !N(t = (e = e ?? ut.default).scaleToGeodeticSurface(t))) throw new v("origin must not be at the center of the ellipsoid.");
	const n = $r.eastNorthUpToFixedFrame(t, e);
	this._ellipsoid = e, this._origin = t, this._xAxis = H.fromCartesian4(Pn.getColumn(n, 0, Su)), this._yAxis = H.fromCartesian4(Pn.getColumn(n, 1, Su));
	const r = H.fromCartesian4(Pn.getColumn(n, 2, Su));
	this._plane = ia.fromPointNormal(t, r);
}
Object.defineProperties(Iu.prototype, {
	ellipsoid: { get: function() {
		return this._ellipsoid;
	} },
	origin: { get: function() {
		return this._origin;
	} },
	plane: { get: function() {
		return this._plane;
	} },
	xAxis: { get: function() {
		return this._xAxis;
	} },
	yAxis: { get: function() {
		return this._yAxis;
	} },
	zAxis: { get: function() {
		return this._plane.normal;
	} }
});
const Nu = new xu();
Iu.fromPoints = function(t, e) {
	return M.defined("cartesians", t), new Iu(xu.fromPoints(t, Nu).center, e);
};
const vu = new As(), Mu = new H();
Iu.prototype.projectPointOntoPlane = function(t, e) {
	M.defined("cartesian", t);
	const n = vu;
	n.origin = t, H.normalize(t, n.direction);
	let r = xs.rayPlane(n, this._plane, Mu);
	if (N(r) || (H.negate(n.direction, n.direction), r = xs.rayPlane(n, this._plane, Mu)), N(r)) {
		const t = H.subtract(r, this._origin, r), n = H.dot(this._xAxis, t), i = H.dot(this._yAxis, t);
		return N(e) ? (e.x = n, e.y = i, e) : new F(n, i);
	}
}, Iu.prototype.projectPointsOntoPlane = function(t, e) {
	M.defined("cartesians", t), N(e) || (e = []);
	let n = 0;
	const r = t.length;
	for (let i = 0; i < r; i++) {
		const r = this.projectPointOntoPlane(t[i], e[n]);
		N(r) && (e[n] = r, n++);
	}
	return e.length = n, e;
}, Iu.prototype.projectPointToNearestOnPlane = function(t, e) {
	M.defined("cartesian", t), N(e) || (e = new F());
	const n = vu;
	n.origin = t, H.clone(this._plane.normal, n.direction);
	let r = xs.rayPlane(n, this._plane, Mu);
	N(r) || (H.negate(n.direction, n.direction), r = xs.rayPlane(n, this._plane, Mu));
	const i = H.subtract(r, this._origin, r), o = H.dot(this._xAxis, i), s = H.dot(this._yAxis, i);
	return e.x = o, e.y = s, e;
}, Iu.prototype.projectPointsToNearestOnPlane = function(t, e) {
	M.defined("cartesians", t), N(e) || (e = []);
	const n = t.length;
	e.length = n;
	for (let r = 0; r < n; r++) e[r] = this.projectPointToNearestOnPlane(t[r], e[r]);
	return e;
};
const Pu = new H();
function Cu(t, e) {
	this.center = H.clone(t ?? H.ZERO), this.halfAxes = wn.clone(e ?? wn.ZERO);
}
Iu.prototype.projectPointOntoEllipsoid = function(t, e) {
	M.defined("cartesian", t), N(e) || (e = new H());
	const n = this._ellipsoid, r = this._origin, i = this._xAxis, o = this._yAxis, s = Pu;
	return H.multiplyByScalar(i, t.x, s), e = H.add(r, s, e), H.multiplyByScalar(o, t.y, s), H.add(e, s, e), n.scaleToGeocentricSurface(e, e), e;
}, Iu.prototype.projectPointsOntoEllipsoid = function(t, e) {
	M.defined("cartesians", t);
	const n = t.length;
	N(e) ? e.length = n : e = new Array(n);
	for (let r = 0; r < n; ++r) e[r] = this.projectPointOntoEllipsoid(t[r], e[r]);
	return e;
}, Cu.packedLength = H.packedLength + wn.packedLength, Cu.pack = function(t, e, n) {
	return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, H.pack(t.center, e, n), wn.pack(t.halfAxes, e, n + H.packedLength), e;
}, Cu.unpack = function(t, e, n) {
	return M.defined("array", t), e = e ?? 0, N(n) || (n = new Cu()), H.unpack(t, e, n.center), wn.unpack(t, e + H.packedLength, n.halfAxes), n;
};
const qu = new H(), Uu = new H(), Lu = new H(), Du = new H(), zu = new H(), ju = new H(), Fu = new wn(), Bu = {
	unitary: new wn(),
	diagonal: new wn()
};
Cu.fromPoints = function(t, e) {
	if (N(e) || (e = new Cu()), !N(t) || 0 === t.length) return e.halfAxes = wn.ZERO, e.center = H.ZERO, e;
	let n;
	const r = t.length, i = H.clone(t[0], qu);
	for (n = 1; n < r; n++) H.add(i, t[n], i);
	const o = 1 / r;
	H.multiplyByScalar(i, o, i);
	let s, a = 0, u = 0, c = 0, l = 0, h = 0, f = 0;
	for (n = 0; n < r; n++) s = H.subtract(t[n], i, Uu), a += s.x * s.x, u += s.x * s.y, c += s.x * s.z, l += s.y * s.y, h += s.y * s.z, f += s.z * s.z;
	a *= o, u *= o, c *= o, l *= o, h *= o, f *= o;
	const p = Fu;
	p[0] = a, p[1] = u, p[2] = c, p[3] = u, p[4] = l, p[5] = h, p[6] = c, p[7] = h, p[8] = f;
	const d = wn.computeEigenDecomposition(p, Bu), m = wn.clone(d.unitary, e.halfAxes);
	let y = wn.getColumn(m, 0, Du), g = wn.getColumn(m, 1, zu), w = wn.getColumn(m, 2, ju), E = -Number.MAX_VALUE, _ = -Number.MAX_VALUE, O = -Number.MAX_VALUE, b = Number.MAX_VALUE, T = Number.MAX_VALUE, A = Number.MAX_VALUE;
	for (n = 0; n < r; n++) s = t[n], E = Math.max(H.dot(y, s), E), _ = Math.max(H.dot(g, s), _), O = Math.max(H.dot(w, s), O), b = Math.min(H.dot(y, s), b), T = Math.min(H.dot(g, s), T), A = Math.min(H.dot(w, s), A);
	y = H.multiplyByScalar(y, .5 * (b + E), y), g = H.multiplyByScalar(g, .5 * (T + _), g), w = H.multiplyByScalar(w, .5 * (A + O), w);
	const x = H.add(y, g, e.center);
	H.add(x, w, x);
	const R = Lu;
	return R.x = E - b, R.y = _ - T, R.z = O - A, H.multiplyByScalar(R, .5, R), wn.multiplyByScale(e.halfAxes, R, e.halfAxes), e;
};
const Gu = new H(), ku = new H();
function Wu(t, e, n, r, i, o, s, a, u, c, l) {
	if (!(N(i) && N(o) && N(s) && N(a) && N(u) && N(c))) throw new v("all extents (minimum/maximum X/Y/Z) are required.");
	N(l) || (l = new Cu());
	const h = l.halfAxes;
	wn.setColumn(h, 0, e, h), wn.setColumn(h, 1, n, h), wn.setColumn(h, 2, r, h);
	let f = Gu;
	f.x = (i + o) / 2, f.y = (s + a) / 2, f.z = (u + c) / 2;
	const p = ku;
	p.x = (o - i) / 2, p.y = (a - s) / 2, p.z = (c - u) / 2;
	const d = l.center;
	return f = wn.multiplyByVector(h, f, f), H.add(t, f, d), wn.multiplyByScale(h, p, h), l;
}
const Vu = new rt(), Hu = new H(), Xu = new rt(), Yu = new rt(), $u = new rt(), Zu = new rt(), Qu = new rt(), Ku = new H(), Ju = new H(), tc = new H(), ec = new H(), nc = new H(), rc = new F(), ic = new F(), oc = new F(), sc = new F(), ac = new F(), uc = new H(), cc = new H(), lc = new H(), hc = new H(), fc = new F(), pc = new H(), dc = new H(), mc = new H(), yc = new ia(H.UNIT_X, 0);
Cu.fromRectangle = function(t, e, n, r, i) {
	if (!N(t)) throw new v("rectangle is required");
	if (t.width < 0 || t.width > D.TWO_PI) throw new v("Rectangle width must be between 0 and 2 * pi");
	if (t.height < 0 || t.height > D.PI) throw new v("Rectangle height must be between 0 and pi");
	if (N(r) && !D.equalsEpsilon(r.radii.x, r.radii.y, D.EPSILON15)) throw new v("Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)");
	let o, s, a, u, c, l, h;
	if (e = e ?? 0, n = n ?? 0, r = r ?? ut.default, t.width <= D.PI) {
		const f = qi.center(t, Vu), p = new Iu(r.cartographicToCartesian(f, Hu), r);
		h = p.plane;
		const d = f.longitude, m = t.south < 0 && t.north > 0 ? 0 : f.latitude, y = rt.fromRadians(d, t.north, n, Xu), g = rt.fromRadians(t.west, t.north, n, Yu), w = rt.fromRadians(t.west, m, n, $u), E = rt.fromRadians(t.west, t.south, n, Zu), _ = rt.fromRadians(d, t.south, n, Qu), O = r.cartographicToCartesian(y, Ku);
		let b = r.cartographicToCartesian(g, Ju);
		const T = r.cartographicToCartesian(w, tc);
		let A = r.cartographicToCartesian(E, ec);
		const x = r.cartographicToCartesian(_, nc), R = p.projectPointToNearestOnPlane(O, rc), S = p.projectPointToNearestOnPlane(b, ic), I = p.projectPointToNearestOnPlane(T, oc), N = p.projectPointToNearestOnPlane(A, sc), v = p.projectPointToNearestOnPlane(x, ac);
		return o = Math.min(S.x, I.x, N.x), s = -o, u = Math.max(S.y, R.y), a = Math.min(N.y, v.y), g.height = E.height = e, b = r.cartographicToCartesian(g, Ju), A = r.cartographicToCartesian(E, ec), c = Math.min(ia.getPointDistance(h, b), ia.getPointDistance(h, A)), l = n, Wu(p.origin, p.xAxis, p.yAxis, p.zAxis, o, s, a, u, c, l, i);
	}
	const f = t.south > 0, p = t.north < 0, d = f ? t.south : p ? t.north : 0, m = qi.center(t, Vu).longitude, y = H.fromRadians(m, d, n, r, uc);
	y.z = 0;
	const g = Math.abs(y.x) < D.EPSILON10 && Math.abs(y.y) < D.EPSILON10 ? H.UNIT_X : H.normalize(y, cc), w = H.UNIT_Z, E = H.cross(g, w, lc);
	h = ia.fromPointNormal(y, g, yc);
	const _ = H.fromRadians(m + D.PI_OVER_TWO, d, n, r, hc);
	s = H.dot(ia.projectPointOntoPlane(h, _, fc), E), o = -s, u = H.fromRadians(0, t.north, p ? e : n, r, pc).z, a = H.fromRadians(0, t.south, f ? e : n, r, dc).z;
	const O = H.fromRadians(t.east, d, n, r, mc);
	return c = ia.getPointDistance(h, O), l = 0, Wu(y, E, w, g, o, s, a, u, c, l, i);
}, Cu.fromTransformation = function(t, e) {
	return M.typeOf.object("transformation", t), N(e) || (e = new Cu()), e.center = Pn.getTranslation(t, e.center), e.halfAxes = Pn.getMatrix3(t, e.halfAxes), e.halfAxes = wn.multiplyByScalar(e.halfAxes, .5, e.halfAxes), e;
}, Cu.clone = function(t, e) {
	if (N(t)) return N(e) ? (H.clone(t.center, e.center), wn.clone(t.halfAxes, e.halfAxes), e) : new Cu(t.center, t.halfAxes);
}, Cu.intersectPlane = function(t, e) {
	if (!N(t)) throw new v("box is required.");
	if (!N(e)) throw new v("plane is required.");
	const n = t.center, r = e.normal, i = t.halfAxes, o = r.x, s = r.y, a = r.z, u = Math.abs(o * i[wn.COLUMN0ROW0] + s * i[wn.COLUMN0ROW1] + a * i[wn.COLUMN0ROW2]) + Math.abs(o * i[wn.COLUMN1ROW0] + s * i[wn.COLUMN1ROW1] + a * i[wn.COLUMN1ROW2]) + Math.abs(o * i[wn.COLUMN2ROW0] + s * i[wn.COLUMN2ROW1] + a * i[wn.COLUMN2ROW2]), c = H.dot(r, n) + e.distance;
	return c <= -u ? Et.OUTSIDE : c >= u ? Et.INSIDE : Et.INTERSECTING;
};
const gc = new H(), wc = new H(), Ec = new H(), _c = new H(), Oc = new H(), bc = new H();
Cu.distanceSquaredTo = function(t, e) {
	if (!N(t)) throw new v("box is required.");
	if (!N(e)) throw new v("cartesian is required.");
	const n = H.subtract(e, t.center, Gu), r = t.halfAxes;
	let i = wn.getColumn(r, 0, gc), o = wn.getColumn(r, 1, wc), s = wn.getColumn(r, 2, Ec);
	const a = H.magnitude(i), u = H.magnitude(o), c = H.magnitude(s);
	let l = !0, h = !0, f = !0;
	a > 0 ? H.divideByScalar(i, a, i) : l = !1, u > 0 ? H.divideByScalar(o, u, o) : h = !1, c > 0 ? H.divideByScalar(s, c, s) : f = !1;
	const p = !l + !h + !f;
	let d, m, y;
	if (1 === p) {
		let t = i;
		d = o, m = s, h ? f || (t = s, m = i) : (t = o, d = i), y = H.cross(d, m, Oc), t === i ? i = y : t === o ? o = y : t === s && (s = y);
	} else if (2 === p) {
		d = i, h ? d = o : f && (d = s);
		let t = H.UNIT_Y;
		t.equalsEpsilon(d, D.EPSILON3) && (t = H.UNIT_X), m = H.cross(d, t, _c), H.normalize(m, m), y = H.cross(d, m, Oc), H.normalize(y, y), d === i ? (o = m, s = y) : d === o ? (s = m, i = y) : d === s && (i = m, o = y);
	} else 3 === p && (i = H.UNIT_X, o = H.UNIT_Y, s = H.UNIT_Z);
	const g = bc;
	g.x = H.dot(n, i), g.y = H.dot(n, o), g.z = H.dot(n, s);
	let w, E = 0;
	return g.x < -a ? (w = g.x + a, E += w * w) : g.x > a && (w = g.x - a, E += w * w), g.y < -u ? (w = g.y + u, E += w * w) : g.y > u && (w = g.y - u, E += w * w), g.z < -c ? (w = g.z + c, E += w * w) : g.z > c && (w = g.z - c, E += w * w), E;
};
const Tc = new H(), Ac = new H();
Cu.computePlaneDistances = function(t, e, n, r) {
	if (!N(t)) throw new v("box is required.");
	if (!N(e)) throw new v("position is required.");
	if (!N(n)) throw new v("direction is required.");
	N(r) || (r = new Hi());
	let i = Number.POSITIVE_INFINITY, o = Number.NEGATIVE_INFINITY;
	const s = t.center, a = t.halfAxes, u = wn.getColumn(a, 0, gc), c = wn.getColumn(a, 1, wc), l = wn.getColumn(a, 2, Ec), h = H.add(u, c, Tc);
	H.add(h, l, h), H.add(h, s, h);
	const f = H.subtract(h, e, Ac);
	let p = H.dot(n, f);
	return i = Math.min(p, i), o = Math.max(p, o), H.add(s, u, h), H.add(h, c, h), H.subtract(h, l, h), H.subtract(h, e, f), p = H.dot(n, f), i = Math.min(p, i), o = Math.max(p, o), H.add(s, u, h), H.subtract(h, c, h), H.add(h, l, h), H.subtract(h, e, f), p = H.dot(n, f), i = Math.min(p, i), o = Math.max(p, o), H.add(s, u, h), H.subtract(h, c, h), H.subtract(h, l, h), H.subtract(h, e, f), p = H.dot(n, f), i = Math.min(p, i), o = Math.max(p, o), H.subtract(s, u, h), H.add(h, c, h), H.add(h, l, h), H.subtract(h, e, f), p = H.dot(n, f), i = Math.min(p, i), o = Math.max(p, o), H.subtract(s, u, h), H.add(h, c, h), H.subtract(h, l, h), H.subtract(h, e, f), p = H.dot(n, f), i = Math.min(p, i), o = Math.max(p, o), H.subtract(s, u, h), H.subtract(h, c, h), H.add(h, l, h), H.subtract(h, e, f), p = H.dot(n, f), i = Math.min(p, i), o = Math.max(p, o), H.subtract(s, u, h), H.subtract(h, c, h), H.subtract(h, l, h), H.subtract(h, e, f), p = H.dot(n, f), i = Math.min(p, i), o = Math.max(p, o), r.start = i, r.stop = o, r;
};
const xc = new H(), Rc = new H(), Sc = new H();
Cu.computeCorners = function(t, e) {
	M.typeOf.object("box", t), N(e) || (e = [
		new H(),
		new H(),
		new H(),
		new H(),
		new H(),
		new H(),
		new H(),
		new H()
	]);
	const n = t.center, r = t.halfAxes, i = wn.getColumn(r, 0, xc), o = wn.getColumn(r, 1, Rc), s = wn.getColumn(r, 2, Sc);
	return H.clone(n, e[0]), H.subtract(e[0], i, e[0]), H.subtract(e[0], o, e[0]), H.subtract(e[0], s, e[0]), H.clone(n, e[1]), H.subtract(e[1], i, e[1]), H.subtract(e[1], o, e[1]), H.add(e[1], s, e[1]), H.clone(n, e[2]), H.subtract(e[2], i, e[2]), H.add(e[2], o, e[2]), H.subtract(e[2], s, e[2]), H.clone(n, e[3]), H.subtract(e[3], i, e[3]), H.add(e[3], o, e[3]), H.add(e[3], s, e[3]), H.clone(n, e[4]), H.add(e[4], i, e[4]), H.subtract(e[4], o, e[4]), H.subtract(e[4], s, e[4]), H.clone(n, e[5]), H.add(e[5], i, e[5]), H.subtract(e[5], o, e[5]), H.add(e[5], s, e[5]), H.clone(n, e[6]), H.add(e[6], i, e[6]), H.add(e[6], o, e[6]), H.subtract(e[6], s, e[6]), H.clone(n, e[7]), H.add(e[7], i, e[7]), H.add(e[7], o, e[7]), H.add(e[7], s, e[7]), e;
};
const Ic = new wn();
Cu.computeTransformation = function(t, e) {
	M.typeOf.object("box", t), N(e) || (e = new Pn());
	const n = t.center, r = wn.multiplyByUniformScale(t.halfAxes, 2, Ic);
	return Pn.fromRotationTranslation(r, n, e);
};
const Nc = new Xi();
Cu.isOccluded = function(t, e) {
	if (!N(t)) throw new v("box is required.");
	if (!N(e)) throw new v("occluder is required.");
	const n = Xi.fromOrientedBoundingBox(t, Nc);
	return !e.isBoundingSphereVisible(n);
}, Cu.prototype.intersectPlane = function(t) {
	return Cu.intersectPlane(this, t);
}, Cu.prototype.distanceSquaredTo = function(t) {
	return Cu.distanceSquaredTo(this, t);
}, Cu.prototype.computePlaneDistances = function(t, e, n) {
	return Cu.computePlaneDistances(this, t, e, n);
}, Cu.prototype.computeCorners = function(t) {
	return Cu.computeCorners(this, t);
}, Cu.prototype.computeTransformation = function(t) {
	return Cu.computeTransformation(this, t);
}, Cu.prototype.isOccluded = function(t) {
	return Cu.isOccluded(this, t);
}, Cu.equals = function(t, e) {
	return t === e || N(t) && N(e) && H.equals(t.center, e.center) && wn.equals(t.halfAxes, e.halfAxes);
}, Cu.prototype.clone = function(t) {
	return Cu.clone(this, t);
}, Cu.prototype.equals = function(t) {
	return Cu.equals(this, t);
};
const vc = {
	CLOCKWISE: Po.CW,
	COUNTER_CLOCKWISE: Po.CCW,
	validate: function(t) {
		return t === vc.CLOCKWISE || t === vc.COUNTER_CLOCKWISE;
	}
};
Object.freeze(vc);
var Mc = class t {
	constructor(t) {
		this._ellipsoid = t ?? ut.WGS84, this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
	}
	get ellipsoid() {
		return this._ellipsoid;
	}
	static mercatorAngleToGeodeticLatitude(t) {
		return D.PI_OVER_TWO - 2 * Math.atan(Math.exp(-t));
	}
	static geodeticLatitudeToMercatorAngle(e) {
		e > t.MaximumLatitude ? e = t.MaximumLatitude : e < -t.MaximumLatitude && (e = -t.MaximumLatitude);
		const n = Math.sin(e);
		return .5 * Math.log((1 + n) / (1 - n));
	}
	project(e, n) {
		const r = this._semimajorAxis, i = e.longitude * r, o = t.geodeticLatitudeToMercatorAngle(e.latitude) * r, s = e.height;
		return N(n) ? (n.x = i, n.y = o, n.z = s, n) : new H(i, o, s);
	}
	unproject(e, n) {
		if (!N(e)) throw new v("cartesian is required");
		const r = this._oneOverSemimajorAxis, i = e.x * r, o = t.mercatorAngleToGeodeticLatitude(e.y * r), s = e.z;
		return N(n) ? (n.longitude = i, n.latitude = o, n.height = s, n) : new rt(i, o, s);
	}
};
Mc.MaximumLatitude = Mc.mercatorAngleToGeodeticLatitude(Math.PI);
const Pc = {
	MORPHING: 0,
	COLUMBUS_VIEW: 1,
	SCENE2D: 2,
	SCENE3D: 3,
	getMorphTime: function(t) {
		return t === Pc.SCENE3D ? 1 : t !== Pc.MORPHING ? 0 : void 0;
	}
};
Object.freeze(Pc);
const Cc = {
	NONE: 0,
	GEODESIC: 1,
	RHUMB: 2
};
Object.freeze(Cc);
const qc = D.EPSILON10;
function Uc(t, e, n, r) {
	if (M.defined("equalsEpsilon", e), !N(t)) return;
	n = n ?? !1;
	const i = N(r), o = t.length;
	if (o < 2) return t;
	let s, a, u, c = t[0], l = 0, h = -1;
	for (s = 1; s < o; ++s) a = t[s], e(c, a, qc) ? (N(u) || (u = t.slice(0, s), l = s - 1, h = 0), i && r.push(s)) : (N(u) && (u.push(a), l = s, i && (h = r.length)), c = a);
	return n && e(t[0], t[o - 1], qc) && (i && (N(u) ? r.splice(h, 0, l) : r.push(o - 1)), N(u) ? u.length -= 1 : u = t.slice(0, -1)), N(u) ? u : t;
}
function Lc(t, e, n, r, i, o, s) {
	const a = function(t, e) {
		return t * e * (4 + t * (4 - 3 * e)) / 16;
	}(t, n);
	return (1 - a) * t * e * (r + a * i * (s + a * o * (2 * s * s - 1)));
}
const Dc = new H(), zc = new H();
function jc(t, e, n, r) {
	const i = H.normalize(r.cartographicToCartesian(e, zc), Dc), o = H.normalize(r.cartographicToCartesian(n, zc), zc);
	M.typeOf.number.greaterThanOrEquals("value", Math.abs(Math.abs(H.angleBetween(i, o)) - Math.PI), .0125), function(t, e, n, r, i, o, s) {
		const a = (e - n) / e, u = o - r, c = Math.atan((1 - a) * Math.tan(i)), l = Math.atan((1 - a) * Math.tan(s)), h = Math.cos(c), f = Math.sin(c), p = Math.cos(l), d = Math.sin(l), m = h * p, y = h * d, g = f * d, w = f * p;
		let E, _, O, b, T, A = u, x = D.TWO_PI, R = Math.cos(A), S = Math.sin(A);
		do {
			R = Math.cos(A), S = Math.sin(A);
			const t = y - w * R;
			let e;
			O = Math.sqrt(p * p * S * S + t * t), _ = g + m * R, E = Math.atan2(O, _), 0 === O ? (e = 0, b = 1) : (e = m * S / O, b = 1 - e * e), x = A, T = _ - 2 * g / b, isFinite(T) || (T = 0), A = u + Lc(a, e, b, E, O, _, T);
		} while (Math.abs(A - x) > D.EPSILON12);
		const I = b * (e * e - n * n) / (n * n), N = I * (256 + I * (I * (74 - 47 * I) - 128)) / 1024, v = T * T, M = n * (1 + I * (4096 + I * (I * (320 - 175 * I) - 768)) / 16384) * (E - N * O * (T + N * (_ * (2 * v - 1) - N * T * (4 * O * O - 3) * (4 * v - 3) / 6) / 4)), P = Math.atan2(p * S, y - w * R), C = Math.atan2(h * S, y * R - w);
		t._distance = M, t._startHeading = P, t._endHeading = C, t._uSquared = I;
	}(t, r.maximumRadius, r.minimumRadius, e.longitude, e.latitude, n.longitude, n.latitude), t._start = rt.clone(e, t._start), t._end = rt.clone(n, t._end), t._start.height = 0, t._end.height = 0, function(t) {
		const e = t._uSquared, n = t._ellipsoid.maximumRadius, r = t._ellipsoid.minimumRadius, i = (n - r) / n, o = Math.cos(t._startHeading), s = Math.sin(t._startHeading), a = (1 - i) * Math.tan(t._start.latitude), u = 1 / Math.sqrt(1 + a * a), c = u * a, l = Math.atan2(a, o), h = u * s, f = h * h, p = 1 - f, d = Math.sqrt(p), m = e / 4, y = m * m, g = y * m, w = y * y, E = 1 + m - 3 * y / 4 + 5 * g / 4 - 175 * w / 64, _ = 1 - m + 15 * y / 8 - 35 * g / 8, O = 1 - 3 * m + 35 * y / 4, b = 1 - 5 * m, T = E * l - _ * Math.sin(2 * l) * m / 2 - O * Math.sin(4 * l) * y / 16 - b * Math.sin(6 * l) * g / 48 - 5 * Math.sin(8 * l) * w / 512, A = t._constants;
		A.a = n, A.b = r, A.f = i, A.cosineHeading = o, A.sineHeading = s, A.tanU = a, A.cosineU = u, A.sineU = c, A.sigma = l, A.sineAlpha = h, A.sineSquaredAlpha = f, A.cosineSquaredAlpha = p, A.cosineAlpha = d, A.u2Over4 = m, A.u4Over16 = y, A.u6Over64 = g, A.u8Over256 = w, A.a0 = E, A.a1 = _, A.a2 = O, A.a3 = b, A.distanceRatio = T;
	}(t);
}
function Fc(t, e, n) {
	const r = n ?? ut.default;
	this._ellipsoid = r, this._start = new rt(), this._end = new rt(), this._constants = {}, this._startHeading = void 0, this._endHeading = void 0, this._distance = void 0, this._uSquared = void 0, N(t) && N(e) && jc(this, t, e, r);
}
function Bc(t, e, n) {
	if (0 === t) return e * n;
	const r = t * t, i = r * r, o = i * r, s = o * r, a = s * r, u = a * r, c = n;
	return e * ((1 - r / 4 - 3 * i / 64 - 5 * o / 256 - 175 * s / 16384 - 441 * a / 65536 - 4851 * u / 1048576) * c - (3 * r / 8 + 3 * i / 32 + 45 * o / 1024 + 105 * s / 4096 + 2205 * a / 131072 + 6237 * u / 524288) * Math.sin(2 * c) + (15 * i / 256 + 45 * o / 1024 + 525 * s / 16384 + 1575 * a / 65536 + 155925 * u / 8388608) * Math.sin(4 * c) - (35 * o / 3072 + 175 * s / 12288 + 3675 * a / 262144 + 13475 * u / 1048576) * Math.sin(6 * c) + (315 * s / 131072 + 2205 * a / 524288 + 43659 * u / 8388608) * Math.sin(8 * c) - (693 * a / 1310720 + 6237 * u / 5242880) * Math.sin(10 * c) + 1001 * u / 8388608 * Math.sin(12 * c));
}
function Gc(t, e) {
	if (0 === t) return Math.log(Math.tan(.5 * (D.PI_OVER_TWO + e)));
	const n = t * Math.sin(e);
	return Math.log(Math.tan(.5 * (D.PI_OVER_TWO + e))) - t / 2 * Math.log((1 + n) / (1 - n));
}
Object.defineProperties(Fc.prototype, {
	ellipsoid: { get: function() {
		return this._ellipsoid;
	} },
	surfaceDistance: { get: function() {
		return M.defined("distance", this._distance), this._distance;
	} },
	start: { get: function() {
		return this._start;
	} },
	end: { get: function() {
		return this._end;
	} },
	startHeading: { get: function() {
		return M.defined("distance", this._distance), this._startHeading;
	} },
	endHeading: { get: function() {
		return M.defined("distance", this._distance), this._endHeading;
	} }
}), Fc.prototype.setEndPoints = function(t, e) {
	M.defined("start", t), M.defined("end", e), jc(this, t, e, this._ellipsoid);
}, Fc.prototype.interpolateUsingFraction = function(t, e) {
	return this.interpolateUsingSurfaceDistance(this._distance * t, e);
}, Fc.prototype.interpolateUsingSurfaceDistance = function(t, e) {
	M.defined("distance", this._distance);
	const n = this._constants, r = n.distanceRatio + t / n.b, i = Math.cos(2 * r), o = Math.cos(4 * r), s = Math.cos(6 * r), a = Math.sin(2 * r), u = Math.sin(4 * r), c = Math.sin(6 * r), l = Math.sin(8 * r), h = r * r, f = r * h, p = n.u8Over256, d = n.u2Over4, m = n.u6Over64, y = n.u4Over16;
	let g = 2 * f * p * i / 3 + r * (1 - d + 7 * y / 4 - 15 * m / 4 + 579 * p / 64 - (y - 15 * m / 4 + 187 * p / 16) * i - (5 * m / 4 - 115 * p / 16) * o - 29 * p * s / 16) + (d / 2 - y + 71 * m / 32 - 85 * p / 16) * a + (5 * y / 16 - 5 * m / 4 + 383 * p / 96) * u - h * ((m - 11 * p / 2) * a + 5 * p * u / 2) + (29 * m / 96 - 29 * p / 16) * c + 539 * p * l / 1536;
	const w = Math.asin(Math.sin(g) * n.cosineAlpha), E = Math.atan(n.a / n.b * Math.tan(w));
	g -= n.sigma;
	const _ = Math.cos(2 * n.sigma + g), O = Math.sin(g), b = Math.cos(g), T = n.cosineU * b, A = n.sineU * O, x = Math.atan2(O * n.sineHeading, T - A * n.cosineHeading) - Lc(n.f, n.sineAlpha, n.cosineSquaredAlpha, g, O, b, _);
	return N(e) ? (e.longitude = this._start.longitude + x, e.latitude = E, e.height = 0, e) : new rt(this._start.longitude + x, E, 0);
};
const kc = new H(), Wc = new H();
function Vc(t, e, n, r) {
	const i = H.normalize(r.cartographicToCartesian(e, Wc), kc), o = H.normalize(r.cartographicToCartesian(n, Wc), Wc);
	M.typeOf.number.greaterThanOrEquals("value", Math.abs(Math.abs(H.angleBetween(i, o)) - Math.PI), .0125);
	const s = r.maximumRadius, a = r.minimumRadius, u = s * s;
	t._ellipticitySquared = (u - a * a) / u, t._ellipticity = Math.sqrt(t._ellipticitySquared), t._start = rt.clone(e, t._start), t._start.height = 0, t._end = rt.clone(n, t._end), t._end.height = 0, t._heading = function(t, e, n, r, i) {
		const o = Gc(t._ellipticity, n), s = Gc(t._ellipticity, i);
		return Math.atan2(D.negativePiToPi(r - e), s - o);
	}(t, e.longitude, e.latitude, n.longitude, n.latitude), t._distance = function(t, e, n, r, i, o, s) {
		const a = t._heading, u = o - r;
		let c = 0;
		if (D.equalsEpsilon(Math.abs(a), D.PI_OVER_TWO, D.EPSILON8)) if (e === n) c = e * Math.cos(i) * D.negativePiToPi(u);
		else {
			const n = Math.sin(i);
			c = e * Math.cos(i) * D.negativePiToPi(u) / Math.sqrt(1 - t._ellipticitySquared * n * n);
		}
		else {
			const n = Bc(t._ellipticity, e, i);
			c = (Bc(t._ellipticity, e, s) - n) / Math.cos(a);
		}
		return Math.abs(c);
	}(t, r.maximumRadius, r.minimumRadius, e.longitude, e.latitude, n.longitude, n.latitude);
}
function Hc(t, e, n, r, i, o) {
	if (0 === n) return rt.clone(t, o);
	const s = i * i;
	let a, u, c;
	if (Math.abs(D.PI_OVER_TWO - Math.abs(e)) > D.EPSILON8) if (u = function(t, e, n) {
		const r = t / n;
		if (0 === e) return r;
		const i = r * r, o = i * r, s = o * r, a = e * e, u = a * a, c = u * a, l = c * a, h = l * a, f = h * a, p = Math.sin(2 * r), d = Math.cos(2 * r), m = Math.sin(4 * r), y = Math.cos(4 * r), g = Math.sin(6 * r), w = Math.cos(6 * r), E = Math.sin(8 * r), _ = Math.cos(8 * r), O = Math.sin(10 * r);
		return r + r * a / 4 + 7 * r * u / 64 + 15 * r * c / 256 + 579 * r * l / 16384 + 1515 * r * h / 65536 + 16837 * r * f / 1048576 + (3 * r * u / 16 + 45 * r * c / 256 - r * (32 * i - 561) * l / 4096 - r * (232 * i - 1677) * h / 16384 + r * (399985 - 90560 * i + 512 * s) * f / 5242880) * d + (21 * r * c / 256 + 483 * r * l / 4096 - r * (224 * i - 1969) * h / 16384 - r * (33152 * i - 112599) * f / 1048576) * y + (151 * r * l / 4096 + 4681 * r * h / 65536 + 1479 * r * f / 16384 - 453 * o * f / 32768) * w + (1097 * r * h / 65536 + 42783 * r * f / 1048576) * _ + 8011 * r * f / 1048576 * Math.cos(10 * r) + (3 * a / 8 + 3 * u / 16 + 213 * c / 2048 - 3 * i * c / 64 + 255 * l / 4096 - 33 * i * l / 512 + 20861 * h / 524288 - 33 * i * h / 512 + s * h / 1024 + 28273 * f / 1048576 - 471 * i * f / 8192 + 9 * s * f / 4096) * p + (21 * u / 256 + 21 * c / 256 + 533 * l / 8192 - 21 * i * l / 512 + 197 * h / 4096 - 315 * i * h / 4096 + 584039 * f / 16777216 - 12517 * i * f / 131072 + 7 * s * f / 2048) * m + (151 * c / 6144 + 151 * l / 4096 + 5019 * h / 131072 - 453 * i * h / 16384 + 26965 * f / 786432 - 8607 * i * f / 131072) * g + (1097 * l / 131072 + 1097 * h / 65536 + 225797 * f / 10485760 - 1097 * i * f / 65536) * E + (8011 * h / 2621440 + 8011 * f / 1048576) * O + 293393 * f / 251658240 * Math.sin(12 * r);
	}(Bc(i, r, t.latitude) + n * Math.cos(e), i, r), Math.abs(e) < D.EPSILON10) a = D.negativePiToPi(t.longitude);
	else {
		const n = Gc(i, t.latitude), r = Gc(i, u);
		c = Math.tan(e) * (r - n), a = D.negativePiToPi(t.longitude + c);
	}
	else {
		let o;
		if (u = t.latitude, 0 === i) o = r * Math.cos(t.latitude);
		else {
			const e = Math.sin(t.latitude);
			o = r * Math.cos(t.latitude) / Math.sqrt(1 - s * e * e);
		}
		c = n / o, a = e > 0 ? D.negativePiToPi(t.longitude + c) : D.negativePiToPi(t.longitude - c);
	}
	return N(o) ? (o.longitude = a, o.latitude = u, o.height = 0, o) : new rt(a, u, 0);
}
function Xc(t, e, n) {
	const r = n ?? ut.default;
	this._ellipsoid = r, this._start = new rt(), this._end = new rt(), this._heading = void 0, this._distance = void 0, this._ellipticity = void 0, this._ellipticitySquared = void 0, N(t) && N(e) && Vc(this, t, e, r);
}
function Yc(t, e) {
	this.positions = N(t) ? t : [], this.holes = N(e) ? e : [];
}
function $c(t) {
	this.planes = t ?? [];
}
Object.defineProperties(Xc.prototype, {
	ellipsoid: { get: function() {
		return this._ellipsoid;
	} },
	surfaceDistance: { get: function() {
		return M.defined("distance", this._distance), this._distance;
	} },
	start: { get: function() {
		return this._start;
	} },
	end: { get: function() {
		return this._end;
	} },
	heading: { get: function() {
		return M.defined("distance", this._distance), this._heading;
	} }
}), Xc.fromStartHeadingDistance = function(t, e, n, r, i) {
	M.defined("start", t), M.defined("heading", e), M.defined("distance", n), M.typeOf.number.greaterThan("distance", n, 0);
	const o = r ?? ut.default, s = o.maximumRadius, a = o.minimumRadius, u = s * s, c = a * a, l = Math.sqrt((u - c) / u), h = Hc(t, e = D.negativePiToPi(e), n, o.maximumRadius, l);
	return !N(i) || N(r) && !r.equals(i.ellipsoid) ? new Xc(t, h, o) : (i.setEndPoints(t, h), i);
}, Xc.prototype.setEndPoints = function(t, e) {
	M.defined("start", t), M.defined("end", e), Vc(this, t, e, this._ellipsoid);
}, Xc.prototype.interpolateUsingFraction = function(t, e) {
	return this.interpolateUsingSurfaceDistance(t * this._distance, e);
}, Xc.prototype.interpolateUsingSurfaceDistance = function(t, e) {
	if (M.typeOf.number("distance", t), !N(this._distance) || 0 === this._distance) throw new v("EllipsoidRhumbLine must have distinct start and end set.");
	return Hc(this._start, this._heading, t, this._ellipsoid.maximumRadius, this._ellipticity, e);
}, Xc.prototype.findIntersectionWithLongitude = function(t, e) {
	if (M.typeOf.number("intersectionLongitude", t), !N(this._distance) || 0 === this._distance) throw new v("EllipsoidRhumbLine must have distinct start and end set.");
	const n = this._ellipticity, r = this._heading, i = Math.abs(r), o = this._start;
	if (t = D.negativePiToPi(t), D.equalsEpsilon(Math.abs(t), Math.PI, D.EPSILON14) && (t = D.sign(o.longitude) * Math.PI), N(e) || (e = new rt()), Math.abs(D.PI_OVER_TWO - i) <= D.EPSILON8) return e.longitude = t, e.latitude = o.latitude, e.height = 0, e;
	if (D.equalsEpsilon(Math.abs(D.PI_OVER_TWO - i), D.PI_OVER_TWO, D.EPSILON8)) {
		if (D.equalsEpsilon(t, o.longitude, D.EPSILON12)) return;
		return e.longitude = t, e.latitude = D.PI_OVER_TWO * D.sign(D.PI_OVER_TWO - r), e.height = 0, e;
	}
	const s = o.latitude, a = n * Math.sin(s), u = Math.tan(.5 * (D.PI_OVER_TWO + s)) * Math.exp((t - o.longitude) / Math.tan(r)), c = (1 + a) / (1 - a);
	let l, h = o.latitude;
	do {
		l = h;
		const t = n * Math.sin(l), e = (1 + t) / (1 - t);
		h = 2 * Math.atan(u * Math.pow(e / c, n / 2)) - D.PI_OVER_TWO;
	} while (!D.equalsEpsilon(h, l, D.EPSILON12));
	return e.longitude = t, e.latitude = h, e.height = 0, e;
}, Xc.prototype.findIntersectionWithLatitude = function(t, e) {
	if (M.typeOf.number("intersectionLatitude", t), !N(this._distance) || 0 === this._distance) throw new v("EllipsoidRhumbLine must have distinct start and end set.");
	const n = this._ellipticity, r = this._heading, i = this._start;
	if (D.equalsEpsilon(Math.abs(r), D.PI_OVER_TWO, D.EPSILON8)) return;
	const o = Gc(n, i.latitude), s = Gc(n, t), a = Math.tan(r) * (s - o), u = D.negativePiToPi(i.longitude + a);
	return N(e) ? (e.longitude = u, e.latitude = t, e.height = 0, e) : new rt(u, t, 0);
};
const Zc = [
	new H(),
	new H(),
	new H()
];
H.clone(H.UNIT_X, Zc[0]), H.clone(H.UNIT_Y, Zc[1]), H.clone(H.UNIT_Z, Zc[2]);
const Qc = new H(), Kc = new H(), Jc = new ia(new H(1, 0, 0), 0);
function tl(t) {
	t = t ?? I.EMPTY_OBJECT, this.left = t.left, this._left = void 0, this.right = t.right, this._right = void 0, this.top = t.top, this._top = void 0, this.bottom = t.bottom, this._bottom = void 0, this.near = t.near ?? 1, this._near = this.near, this.far = t.far ?? 5e8, this._far = this.far, this._cullingVolume = new $c(), this._orthographicMatrix = new Pn();
}
function el(t) {
	if (!(N(t.right) && N(t.left) && N(t.top) && N(t.bottom) && N(t.near) && N(t.far))) throw new v("right, left, top, bottom, near, or far parameters are not set.");
	if (t.top !== t._top || t.bottom !== t._bottom || t.left !== t._left || t.right !== t._right || t.near !== t._near || t.far !== t._far) {
		if (t.left > t.right) throw new v("right must be greater than left.");
		if (t.bottom > t.top) throw new v("top must be greater than bottom.");
		if (t.near <= 0 || t.near > t.far) throw new v("near must be greater than zero and less than far.");
		t._left = t.left, t._right = t.right, t._top = t.top, t._bottom = t.bottom, t._near = t.near, t._far = t.far, t._orthographicMatrix = Pn.computeOrthographicOffCenter(t.left, t.right, t.bottom, t.top, t.near, t.far, t._orthographicMatrix);
	}
}
$c.fromBoundingSphere = function(t, e) {
	if (!N(t)) throw new v("boundingSphere is required.");
	N(e) || (e = new $c());
	const n = Zc.length, r = e.planes;
	r.length = 2 * n;
	const i = t.center, o = t.radius;
	let s = 0;
	for (let a = 0; a < n; ++a) {
		const t = Zc[a];
		let e = r[s], n = r[s + 1];
		N(e) || (e = r[s] = new _t()), N(n) || (n = r[s + 1] = new _t()), H.multiplyByScalar(t, -o, Qc), H.add(i, Qc, Qc), e.x = t.x, e.y = t.y, e.z = t.z, e.w = -H.dot(t, Qc), H.multiplyByScalar(t, o, Qc), H.add(i, Qc, Qc), n.x = -t.x, n.y = -t.y, n.z = -t.z, n.w = -H.dot(H.negate(t, Kc), Qc), s += 2;
	}
	return e;
}, $c.prototype.computeVisibility = function(t) {
	if (!N(t)) throw new v("boundingVolume is required.");
	const e = this.planes;
	let n = !1;
	for (let r = 0, i = e.length; r < i; ++r) {
		const i = t.intersectPlane(ia.fromCartesian4(e[r], Jc));
		if (i === Et.OUTSIDE) return Et.OUTSIDE;
		i === Et.INTERSECTING && (n = !0);
	}
	return n ? Et.INTERSECTING : Et.INSIDE;
}, $c.prototype.computeVisibilityWithPlaneMask = function(t, e) {
	if (!N(t)) throw new v("boundingVolume is required.");
	if (!N(e)) throw new v("parentPlaneMask is required.");
	if (e === $c.MASK_OUTSIDE || e === $c.MASK_INSIDE) return e;
	let n = $c.MASK_INSIDE;
	const r = this.planes;
	for (let i = 0, o = r.length; i < o; ++i) {
		const o = i < 31 ? 1 << i : 0;
		if (i < 31 && 0 === (e & o)) continue;
		const s = t.intersectPlane(ia.fromCartesian4(r[i], Jc));
		if (s === Et.OUTSIDE) return $c.MASK_OUTSIDE;
		s === Et.INTERSECTING && (n |= o);
	}
	return n;
}, $c.MASK_OUTSIDE = 4294967295, $c.MASK_INSIDE = 0, $c.MASK_INDETERMINATE = 2147483647, Object.defineProperties(tl.prototype, { projectionMatrix: { get: function() {
	return el(this), this._orthographicMatrix;
} } });
const nl = new H(), rl = new H(), il = new H(), ol = new H();
function sl(t) {
	t = t ?? I.EMPTY_OBJECT, this._offCenterFrustum = new tl(), this.width = t.width, this._width = void 0, this.aspectRatio = t.aspectRatio, this._aspectRatio = void 0, this.near = t.near ?? 1, this._near = this.near, this.far = t.far ?? 5e8, this._far = this.far;
}
function al(t) {
	if (!(N(t.width) && N(t.aspectRatio) && N(t.near) && N(t.far))) throw new v("width, aspectRatio, near, or far parameters are not set.");
	const e = t._offCenterFrustum;
	if (t.width !== t._width || t.aspectRatio !== t._aspectRatio || t.near !== t._near || t.far !== t._far) {
		if (t.aspectRatio < 0) throw new v("aspectRatio must be positive.");
		if (t.near < 0 || t.near > t.far) throw new v("near must be greater than zero and less than far.");
		t._aspectRatio = t.aspectRatio, t._width = t.width, t._near = t.near, t._far = t.far;
		const n = 1 / t.aspectRatio;
		e.right = .5 * t.width, e.left = -e.right, e.top = n * e.right, e.bottom = -e.top, e.near = t.near, e.far = t.far;
	}
}
function ul(t, e, n, r, i) {
	let o;
	if (i === function(t, e, n, r) {
		let i = 0;
		for (let o = e, s = n - r; o < n; o += r) i += (t[s] - t[o]) * (t[o + 1] + t[s + 1]), s = o;
		return i;
	}(t, e, n, r) > 0) for (let s = e; s < n; s += r) o = vl(s / r | 0, t[s], t[s + 1], o);
	else for (let s = n - r; s >= e; s -= r) o = vl(s / r | 0, t[s], t[s + 1], o);
	return o && Al(o, o.next) && (Ml(o), o = o.next), o;
}
function cl(t, e) {
	if (!t) return t;
	e || (e = t);
	let n, r = t;
	do
		if (n = !1, r.steiner || !Al(r, r.next) && 0 !== Tl(r.prev, r, r.next)) r = r.next;
		else {
			if (Ml(r), r = e = r.prev, r === r.next) break;
			n = !0;
		}
	while (n || r !== e);
	return e;
}
function ll(t, e, n, r, i, o, s) {
	if (!t) return;
	!s && o && function(t, e, n, r) {
		let i = t;
		do
			0 === i.z && (i.z = wl(i.x, i.y, e, n, r)), i.prevZ = i.prev, i.nextZ = i.next, i = i.next;
		while (i !== t);
		i.prevZ.nextZ = null, i.prevZ = null, function(t) {
			let e, n = 1;
			do {
				let r, i = t;
				t = null;
				let o = null;
				for (e = 0; i;) {
					e++;
					let s = i, a = 0;
					for (let t = 0; t < n && (a++, s = s.nextZ, s); t++);
					let u = n;
					for (; a > 0 || u > 0 && s;) 0 !== a && (0 === u || !s || i.z <= s.z) ? (r = i, i = i.nextZ, a--) : (r = s, s = s.nextZ, u--), o ? o.nextZ = r : t = r, r.prevZ = o, o = r;
					i = s;
				}
				o.nextZ = null, n *= 2;
			} while (e > 1);
		}(i);
	}(t, r, i, o);
	let a = t;
	for (; t.prev !== t.next;) {
		const u = t.prev, c = t.next;
		if (o ? fl(t, r, i, o) : hl(t)) e.push(u.i, t.i, c.i), Ml(t), t = c.next, a = c.next;
		else if ((t = c) === a) {
			s ? 1 === s ? ll(t = pl(cl(t), e), e, n, r, i, o, 2) : 2 === s && dl(t, e, n, r, i, o) : ll(cl(t), e, n, r, i, o, 1);
			break;
		}
	}
}
function hl(t) {
	const e = t.prev, n = t, r = t.next;
	if (Tl(e, n, r) >= 0) return !1;
	const i = e.x, o = n.x, s = r.x, a = e.y, u = n.y, c = r.y, l = Math.min(i, o, s), h = Math.min(a, u, c), f = Math.max(i, o, s), p = Math.max(a, u, c);
	let d = r.next;
	for (; d !== e;) {
		if (d.x >= l && d.x <= f && d.y >= h && d.y <= p && Ol(i, a, o, u, s, c, d.x, d.y) && Tl(d.prev, d, d.next) >= 0) return !1;
		d = d.next;
	}
	return !0;
}
function fl(t, e, n, r) {
	const i = t.prev, o = t, s = t.next;
	if (Tl(i, o, s) >= 0) return !1;
	const a = i.x, u = o.x, c = s.x, l = i.y, h = o.y, f = s.y, p = Math.min(a, u, c), d = Math.min(l, h, f), m = Math.max(a, u, c), y = Math.max(l, h, f), g = wl(p, d, e, n, r), w = wl(m, y, e, n, r);
	let E = t.prevZ, _ = t.nextZ;
	for (; E && E.z >= g && _ && _.z <= w;) {
		if (E.x >= p && E.x <= m && E.y >= d && E.y <= y && E !== i && E !== s && Ol(a, l, u, h, c, f, E.x, E.y) && Tl(E.prev, E, E.next) >= 0) return !1;
		if (E = E.prevZ, _.x >= p && _.x <= m && _.y >= d && _.y <= y && _ !== i && _ !== s && Ol(a, l, u, h, c, f, _.x, _.y) && Tl(_.prev, _, _.next) >= 0) return !1;
		_ = _.nextZ;
	}
	for (; E && E.z >= g;) {
		if (E.x >= p && E.x <= m && E.y >= d && E.y <= y && E !== i && E !== s && Ol(a, l, u, h, c, f, E.x, E.y) && Tl(E.prev, E, E.next) >= 0) return !1;
		E = E.prevZ;
	}
	for (; _ && _.z <= w;) {
		if (_.x >= p && _.x <= m && _.y >= d && _.y <= y && _ !== i && _ !== s && Ol(a, l, u, h, c, f, _.x, _.y) && Tl(_.prev, _, _.next) >= 0) return !1;
		_ = _.nextZ;
	}
	return !0;
}
function pl(t, e) {
	let n = t;
	do {
		const r = n.prev, i = n.next.next;
		!Al(r, i) && xl(r, n, n.next, i) && Il(r, i) && Il(i, r) && (e.push(r.i, n.i, i.i), Ml(n), Ml(n.next), n = t = i), n = n.next;
	} while (n !== t);
	return cl(n);
}
function dl(t, e, n, r, i, o) {
	let s = t;
	do {
		let t = s.next.next;
		for (; t !== s.prev;) {
			if (s.i !== t.i && bl(s, t)) {
				let a = Nl(s, t);
				s = cl(s, s.next), a = cl(a, a.next), ll(s, e, n, r, i, o, 0), ll(a, e, n, r, i, o, 0);
				return;
			}
			t = t.next;
		}
		s = s.next;
	} while (s !== t);
}
function ml(t, e) {
	let n = t.x - e.x;
	return 0 === n && (n = t.y - e.y, 0 === n && (n = (t.next.y - t.y) / (t.next.x - t.x) - (e.next.y - e.y) / (e.next.x - e.x))), n;
}
function yl(t, e) {
	const n = function(t, e) {
		let n = e;
		const r = t.x, i = t.y;
		let o, s = -Infinity;
		if (Al(t, n)) return n;
		do {
			if (Al(t, n.next)) return n.next;
			if (i <= n.y && i >= n.next.y && n.next.y !== n.y) {
				const t = n.x + (i - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
				if (t <= r && t > s && (s = t, o = n.x < n.next.x ? n : n.next, t === r)) return o;
			}
			n = n.next;
		} while (n !== e);
		if (!o) return null;
		const a = o, u = o.x, c = o.y;
		let l = Infinity;
		n = o;
		do {
			if (r >= n.x && n.x >= u && r !== n.x && _l(i < c ? r : s, i, u, c, i < c ? s : r, i, n.x, n.y)) {
				const e = Math.abs(i - n.y) / (r - n.x);
				Il(n, t) && (e < l || e === l && (n.x > o.x || n.x === o.x && gl(o, n))) && (o = n, l = e);
			}
			n = n.next;
		} while (n !== a);
		return o;
	}(t, e);
	if (!n) return e;
	const r = Nl(n, t);
	return cl(r, r.next), cl(n, n.next);
}
function gl(t, e) {
	return Tl(t.prev, t, e.prev) < 0 && Tl(e.next, t, t.next) < 0;
}
function wl(t, e, n, r, i) {
	return (t = 1431655765 & ((t = 858993459 & ((t = 252645135 & ((t = 16711935 & ((t = (t - n) * i | 0) | t << 8)) | t << 4)) | t << 2)) | t << 1)) | (e = 1431655765 & ((e = 858993459 & ((e = 252645135 & ((e = 16711935 & ((e = (e - r) * i | 0) | e << 8)) | e << 4)) | e << 2)) | e << 1)) << 1;
}
function El(t) {
	let e = t, n = t;
	do
		(e.x < n.x || e.x === n.x && e.y < n.y) && (n = e), e = e.next;
	while (e !== t);
	return n;
}
function _l(t, e, n, r, i, o, s, a) {
	return (i - s) * (e - a) >= (t - s) * (o - a) && (t - s) * (r - a) >= (n - s) * (e - a) && (n - s) * (o - a) >= (i - s) * (r - a);
}
function Ol(t, e, n, r, i, o, s, a) {
	return !(t === s && e === a) && _l(t, e, n, r, i, o, s, a);
}
function bl(t, e) {
	return t.next.i !== e.i && t.prev.i !== e.i && !function(t, e) {
		let n = t;
		do {
			if (n.i !== t.i && n.next.i !== t.i && n.i !== e.i && n.next.i !== e.i && xl(n, n.next, t, e)) return !0;
			n = n.next;
		} while (n !== t);
		return !1;
	}(t, e) && (Il(t, e) && Il(e, t) && function(t, e) {
		let n = t, r = !1;
		const i = (t.x + e.x) / 2, o = (t.y + e.y) / 2;
		do
			n.y > o != n.next.y > o && n.next.y !== n.y && i < (n.next.x - n.x) * (o - n.y) / (n.next.y - n.y) + n.x && (r = !r), n = n.next;
		while (n !== t);
		return r;
	}(t, e) && (Tl(t.prev, t, e.prev) || Tl(t, e.prev, e)) || Al(t, e) && Tl(t.prev, t, t.next) > 0 && Tl(e.prev, e, e.next) > 0);
}
function Tl(t, e, n) {
	return (e.y - t.y) * (n.x - e.x) - (e.x - t.x) * (n.y - e.y);
}
function Al(t, e) {
	return t.x === e.x && t.y === e.y;
}
function xl(t, e, n, r) {
	const i = Sl(Tl(t, e, n)), o = Sl(Tl(t, e, r)), s = Sl(Tl(n, r, t)), a = Sl(Tl(n, r, e));
	return i !== o && s !== a || !(0 !== i || !Rl(t, n, e)) || !(0 !== o || !Rl(t, r, e)) || !(0 !== s || !Rl(n, t, r)) || !(0 !== a || !Rl(n, e, r));
}
function Rl(t, e, n) {
	return e.x <= Math.max(t.x, n.x) && e.x >= Math.min(t.x, n.x) && e.y <= Math.max(t.y, n.y) && e.y >= Math.min(t.y, n.y);
}
function Sl(t) {
	return t > 0 ? 1 : t < 0 ? -1 : 0;
}
function Il(t, e) {
	return Tl(t.prev, t, t.next) < 0 ? Tl(t, e, t.next) >= 0 && Tl(t, t.prev, e) >= 0 : Tl(t, e, t.prev) < 0 || Tl(t, t.next, e) < 0;
}
function Nl(t, e) {
	const n = Pl(t.i, t.x, t.y), r = Pl(e.i, e.x, e.y), i = t.next, o = e.prev;
	return t.next = e, e.prev = t, n.next = i, i.prev = n, r.next = n, n.prev = r, o.next = r, r.prev = o, r;
}
function vl(t, e, n, r) {
	const i = Pl(t, e, n);
	return r ? (i.next = r.next, i.prev = r, r.next.prev = i, r.next = i) : (i.prev = i, i.next = i), i;
}
function Ml(t) {
	t.next.prev = t.prev, t.prev.next = t.next, t.prevZ && (t.prevZ.nextZ = t.nextZ), t.nextZ && (t.nextZ.prevZ = t.prevZ);
}
function Pl(t, e, n) {
	return {
		i: t,
		x: e,
		y: n,
		prev: null,
		next: null,
		z: 0,
		prevZ: null,
		nextZ: null,
		steiner: !1
	};
}
tl.prototype.computeCullingVolume = function(t, e, n) {
	if (!N(t)) throw new v("position is required.");
	if (!N(e)) throw new v("direction is required.");
	if (!N(n)) throw new v("up is required.");
	const r = this._cullingVolume.planes, i = this.top, o = this.bottom, s = this.right, a = this.left, u = this.near, c = this.far, l = H.cross(e, n, nl);
	H.normalize(l, l);
	const h = rl;
	H.multiplyByScalar(e, u, h), H.add(t, h, h);
	const f = il;
	H.multiplyByScalar(l, a, f), H.add(h, f, f);
	let p = r[0];
	return N(p) || (p = r[0] = new _t()), p.x = l.x, p.y = l.y, p.z = l.z, p.w = -H.dot(l, f), H.multiplyByScalar(l, s, f), H.add(h, f, f), p = r[1], N(p) || (p = r[1] = new _t()), p.x = -l.x, p.y = -l.y, p.z = -l.z, p.w = -H.dot(H.negate(l, ol), f), H.multiplyByScalar(n, o, f), H.add(h, f, f), p = r[2], N(p) || (p = r[2] = new _t()), p.x = n.x, p.y = n.y, p.z = n.z, p.w = -H.dot(n, f), H.multiplyByScalar(n, i, f), H.add(h, f, f), p = r[3], N(p) || (p = r[3] = new _t()), p.x = -n.x, p.y = -n.y, p.z = -n.z, p.w = -H.dot(H.negate(n, ol), f), p = r[4], N(p) || (p = r[4] = new _t()), p.x = e.x, p.y = e.y, p.z = e.z, p.w = -H.dot(e, h), H.multiplyByScalar(e, c, f), H.add(t, f, f), p = r[5], N(p) || (p = r[5] = new _t()), p.x = -e.x, p.y = -e.y, p.z = -e.z, p.w = -H.dot(H.negate(e, ol), f), this._cullingVolume;
}, tl.prototype.getPixelDimensions = function(t, e, n, r, i) {
	if (el(this), !N(t) || !N(e)) throw new v("Both drawingBufferWidth and drawingBufferHeight are required.");
	if (t <= 0) throw new v("drawingBufferWidth must be greater than zero.");
	if (e <= 0) throw new v("drawingBufferHeight must be greater than zero.");
	if (!N(n)) throw new v("distance is required.");
	if (!N(r)) throw new v("pixelRatio is required.");
	if (r <= 0) throw new v("pixelRatio must be greater than zero.");
	if (!N(i)) throw new v("A result object is required.");
	const o = r * (this.right - this.left) / t, s = r * (this.top - this.bottom) / e;
	return i.x = o, i.y = s, i;
}, tl.prototype.clone = function(t) {
	return N(t) || (t = new tl()), t.left = this.left, t.right = this.right, t.top = this.top, t.bottom = this.bottom, t.near = this.near, t.far = this.far, t._left = void 0, t._right = void 0, t._top = void 0, t._bottom = void 0, t._near = void 0, t._far = void 0, t;
}, tl.prototype.equals = function(t) {
	return N(t) && t instanceof tl && this.right === t.right && this.left === t.left && this.top === t.top && this.bottom === t.bottom && this.near === t.near && this.far === t.far;
}, tl.prototype.equalsEpsilon = function(t, e, n) {
	return t === this || N(t) && t instanceof tl && D.equalsEpsilon(this.right, t.right, e, n) && D.equalsEpsilon(this.left, t.left, e, n) && D.equalsEpsilon(this.top, t.top, e, n) && D.equalsEpsilon(this.bottom, t.bottom, e, n) && D.equalsEpsilon(this.near, t.near, e, n) && D.equalsEpsilon(this.far, t.far, e, n);
}, sl.packedLength = 4, sl.pack = function(t, e, n) {
	return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, e[n++] = t.width, e[n++] = t.aspectRatio, e[n++] = t.near, e[n] = t.far, e;
}, sl.unpack = function(t, e, n) {
	return M.defined("array", t), e = e ?? 0, N(n) || (n = new sl()), n.width = t[e++], n.aspectRatio = t[e++], n.near = t[e++], n.far = t[e], n;
}, Object.defineProperties(sl.prototype, {
	projectionMatrix: { get: function() {
		return al(this), this._offCenterFrustum.projectionMatrix;
	} },
	offCenterFrustum: { get: function() {
		return al(this), this._offCenterFrustum;
	} }
}), sl.prototype.computeCullingVolume = function(t, e, n) {
	return al(this), this._offCenterFrustum.computeCullingVolume(t, e, n);
}, sl.prototype.getPixelDimensions = function(t, e, n, r, i) {
	return al(this), this._offCenterFrustum.getPixelDimensions(t, e, n, r, i);
}, sl.prototype.clone = function(t) {
	return N(t) || (t = new sl()), t.aspectRatio = this.aspectRatio, t.width = this.width, t.near = this.near, t.far = this.far, t._aspectRatio = void 0, t._width = void 0, t._near = void 0, t._far = void 0, this._offCenterFrustum.clone(t._offCenterFrustum), t;
}, sl.prototype.equals = function(t) {
	return !!(N(t) && t instanceof sl) && (al(this), al(t), this.width === t.width && this.aspectRatio === t.aspectRatio && this._offCenterFrustum.equals(t._offCenterFrustum));
}, sl.prototype.equalsEpsilon = function(t, e, n) {
	return !!(N(t) && t instanceof sl) && (al(this), al(t), D.equalsEpsilon(this.width, t.width, e, n) && D.equalsEpsilon(this.aspectRatio, t.aspectRatio, e, n) && this._offCenterFrustum.equalsEpsilon(t._offCenterFrustum, e, n));
};
const Cl = new H(), ql = new H(), Ul = {
	computeArea2D: function(t) {
		M.defined("positions", t), M.typeOf.number.greaterThanOrEquals("positions.length", t.length, 3);
		const e = t.length;
		let n = 0;
		for (let r = e - 1, i = 0; i < e; r = i++) {
			const e = t[r], o = t[i];
			n += e.x * o.y - o.x * e.y;
		}
		return .5 * n;
	},
	computeWindingOrder2D: function(t) {
		return Ul.computeArea2D(t) > 0 ? vc.COUNTER_CLOCKWISE : vc.CLOCKWISE;
	},
	triangulate: function(t, e) {
		return M.defined("positions", t), function(t, e, n = 2) {
			const r = e && e.length, i = r ? e[0] * n : t.length;
			let o = ul(t, 0, i, n, !0);
			const s = [];
			if (!o || o.next === o.prev) return s;
			let a, u, c;
			if (r && (o = function(t, e, n, r) {
				const i = [];
				for (let o = 0, s = e.length; o < s; o++) {
					const n = ul(t, e[o] * r, o < s - 1 ? e[o + 1] * r : t.length, r, !1);
					n === n.next && (n.steiner = !0), i.push(El(n));
				}
				i.sort(ml);
				for (let o = 0; o < i.length; o++) n = yl(i[o], n);
				return n;
			}(t, e, o, n)), t.length > 80 * n) {
				a = t[0], u = t[1];
				let e = a, r = u;
				for (let o = n; o < i; o += n) {
					const n = t[o], i = t[o + 1];
					n < a && (a = n), i < u && (u = i), n > e && (e = n), i > r && (r = i);
				}
				c = Math.max(e - a, r - u), c = 0 !== c ? 32767 / c : 0;
			}
			return ll(o, s, n, a, u, c, 0), s;
		}(F.packArray(t), e, 2);
	}
}, Ll = new H(), Dl = new H(), zl = new H(), jl = new H(), Fl = new H(), Bl = new H(), Gl = new H(), kl = new F(), Wl = new F(), Vl = new F(), Hl = new F();
Ul.computeSubdivision = function(t, e, n, r, i) {
	i = i ?? D.RADIANS_PER_DEGREE;
	const o = N(r);
	M.typeOf.object("ellipsoid", t), M.defined("positions", e), M.defined("indices", n), M.typeOf.number.greaterThanOrEquals("indices.length", n.length, 3), M.typeOf.number.equals("indices.length % 3", "0", n.length % 3, 0), M.typeOf.number.greaterThan("granularity", i, 0);
	const s = n.slice(0);
	let a;
	const u = e.length, c = new Array(3 * u), l = new Array(2 * u);
	let h = 0, f = 0;
	for (a = 0; a < u; a++) {
		const t = e[a];
		if (c[h++] = t.x, c[h++] = t.y, c[h++] = t.z, o) {
			const t = r[a];
			l[f++] = t.x, l[f++] = t.y;
		}
	}
	const p = [], d = {}, m = t.maximumRadius, y = D.chordLength(i, m), g = y * y;
	for (; s.length > 0;) {
		const t = s.pop(), e = s.pop(), n = s.pop(), r = H.fromArray(c, 3 * n, Ll), i = H.fromArray(c, 3 * e, Dl), u = H.fromArray(c, 3 * t, zl);
		let h, f, y;
		o && (h = F.fromArray(l, 2 * n, kl), f = F.fromArray(l, 2 * e, Wl), y = F.fromArray(l, 2 * t, Vl));
		const w = H.multiplyByScalar(H.normalize(r, jl), m, jl), E = H.multiplyByScalar(H.normalize(i, Fl), m, Fl), _ = H.multiplyByScalar(H.normalize(u, Bl), m, Bl), O = H.magnitudeSquared(H.subtract(w, E, Gl)), b = H.magnitudeSquared(H.subtract(E, _, Gl)), T = H.magnitudeSquared(H.subtract(_, w, Gl)), A = Math.max(O, b, T);
		let x, R, S;
		A > g ? O === A ? (x = `${Math.min(n, e)} ${Math.max(n, e)}`, a = d[x], N(a) || (R = H.add(r, i, Gl), H.multiplyByScalar(R, .5, R), c.push(R.x, R.y, R.z), a = c.length / 3 - 1, d[x] = a, o && (S = F.add(h, f, Hl), F.multiplyByScalar(S, .5, S), l.push(S.x, S.y))), s.push(n, a, t), s.push(a, e, t)) : b === A ? (x = `${Math.min(e, t)} ${Math.max(e, t)}`, a = d[x], N(a) || (R = H.add(i, u, Gl), H.multiplyByScalar(R, .5, R), c.push(R.x, R.y, R.z), a = c.length / 3 - 1, d[x] = a, o && (S = F.add(f, y, Hl), F.multiplyByScalar(S, .5, S), l.push(S.x, S.y))), s.push(e, a, n), s.push(a, t, n)) : T === A && (x = `${Math.min(t, n)} ${Math.max(t, n)}`, a = d[x], N(a) || (R = H.add(u, r, Gl), H.multiplyByScalar(R, .5, R), c.push(R.x, R.y, R.z), a = c.length / 3 - 1, d[x] = a, o && (S = F.add(y, h, Hl), F.multiplyByScalar(S, .5, S), l.push(S.x, S.y))), s.push(t, a, e), s.push(a, n, e)) : (p.push(n), p.push(e), p.push(t));
	}
	const w = {
		attributes: { position: new ts({
			componentDatatype: Co.DOUBLE,
			componentsPerAttribute: 3,
			values: c
		}) },
		indices: p,
		primitiveType: Go.TRIANGLES
	};
	return o && (w.attributes.st = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: 2,
		values: l
	})), new ko(w);
};
const Xl = new rt(), Yl = new rt(), $l = new rt(), Zl = new rt();
function Ql() {
	this._array = [], this._offset = 0, this._length = 0;
}
Ul.computeRhumbLineSubdivision = function(t, e, n, r, i) {
	i = i ?? D.RADIANS_PER_DEGREE;
	const o = N(r);
	M.typeOf.object("ellipsoid", t), M.defined("positions", e), M.defined("indices", n), M.typeOf.number.greaterThanOrEquals("indices.length", n.length, 3), M.typeOf.number.equals("indices.length % 3", "0", n.length % 3, 0), M.typeOf.number.greaterThan("granularity", i, 0);
	const s = n.slice(0);
	let a;
	const u = e.length, c = new Array(3 * u), l = new Array(2 * u);
	let h = 0, f = 0;
	for (a = 0; a < u; a++) {
		const t = e[a];
		if (c[h++] = t.x, c[h++] = t.y, c[h++] = t.z, o) {
			const t = r[a];
			l[f++] = t.x, l[f++] = t.y;
		}
	}
	const p = [], d = {}, m = t.maximumRadius, y = D.chordLength(i, m), g = new Xc(void 0, void 0, t), w = new Xc(void 0, void 0, t), E = new Xc(void 0, void 0, t);
	for (; s.length > 0;) {
		const e = s.pop(), n = s.pop(), r = s.pop(), i = H.fromArray(c, 3 * r, Ll), u = H.fromArray(c, 3 * n, Dl), h = H.fromArray(c, 3 * e, zl);
		let f, m, _;
		o && (f = F.fromArray(l, 2 * r, kl), m = F.fromArray(l, 2 * n, Wl), _ = F.fromArray(l, 2 * e, Vl));
		const O = t.cartesianToCartographic(i, Xl), b = t.cartesianToCartographic(u, Yl), T = t.cartesianToCartographic(h, $l);
		g.setEndPoints(O, b);
		const A = g.surfaceDistance;
		w.setEndPoints(b, T);
		const x = w.surfaceDistance;
		E.setEndPoints(T, O);
		const R = E.surfaceDistance, S = Math.max(A, x, R);
		let I, v, M, P, C;
		S > y ? A === S ? (I = `${Math.min(r, n)} ${Math.max(r, n)}`, a = d[I], N(a) || (v = g.interpolateUsingFraction(.5, Zl), M = .5 * (O.height + b.height), P = H.fromRadians(v.longitude, v.latitude, M, t, Gl), c.push(P.x, P.y, P.z), a = c.length / 3 - 1, d[I] = a, o && (C = F.add(f, m, Hl), F.multiplyByScalar(C, .5, C), l.push(C.x, C.y))), s.push(r, a, e), s.push(a, n, e)) : x === S ? (I = `${Math.min(n, e)} ${Math.max(n, e)}`, a = d[I], N(a) || (v = w.interpolateUsingFraction(.5, Zl), M = .5 * (b.height + T.height), P = H.fromRadians(v.longitude, v.latitude, M, t, Gl), c.push(P.x, P.y, P.z), a = c.length / 3 - 1, d[I] = a, o && (C = F.add(m, _, Hl), F.multiplyByScalar(C, .5, C), l.push(C.x, C.y))), s.push(n, a, r), s.push(a, e, r)) : R === S && (I = `${Math.min(e, r)} ${Math.max(e, r)}`, a = d[I], N(a) || (v = E.interpolateUsingFraction(.5, Zl), M = .5 * (T.height + O.height), P = H.fromRadians(v.longitude, v.latitude, M, t, Gl), c.push(P.x, P.y, P.z), a = c.length / 3 - 1, d[I] = a, o && (C = F.add(_, f, Hl), F.multiplyByScalar(C, .5, C), l.push(C.x, C.y))), s.push(e, a, n), s.push(a, r, n)) : (p.push(r), p.push(n), p.push(e));
	}
	const _ = {
		attributes: { position: new ts({
			componentDatatype: Co.DOUBLE,
			componentsPerAttribute: 3,
			values: c
		}) },
		indices: p,
		primitiveType: Go.TRIANGLES
	};
	return o && (_.attributes.st = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: 2,
		values: l
	})), new ko(_);
}, Ul.scaleToGeodeticHeight = function(t, e, n, r) {
	n = n ?? ut.default;
	let i = Cl, o = ql;
	if (e = e ?? 0, r = r ?? !0, N(t)) {
		const s = t.length;
		for (let a = 0; a < s; a += 3) H.fromArray(t, a, o), r && (o = n.scaleToGeodeticSurface(o, o)), 0 !== e && (i = n.geodeticSurfaceNormal(o, i), H.multiplyByScalar(i, e, i), H.add(o, i, o)), t[a] = o.x, t[a + 1] = o.y, t[a + 2] = o.z;
	}
	return t;
}, Object.defineProperties(Ql.prototype, { length: { get: function() {
	return this._length;
} } }), Ql.prototype.enqueue = function(t) {
	this._array.push(t), this._length++;
}, Ql.prototype.dequeue = function() {
	if (0 === this._length) return;
	const t = this._array;
	let e = this._offset;
	const n = t[e];
	return t[e] = void 0, e++, e > 10 && 2 * e > t.length && (this._array = t.slice(e), e = 0), this._offset = e, this._length--, n;
}, Ql.prototype.peek = function() {
	if (0 !== this._length) return this._array[this._offset];
}, Ql.prototype.contains = function(t) {
	return -1 !== this._array.indexOf(t);
}, Ql.prototype.clear = function() {
	this._array.length = this._offset = this._length = 0;
}, Ql.prototype.sort = function(t) {
	this._offset > 0 && (this._array = this._array.slice(this._offset), this._offset = 0), this._array.sort(t);
};
const Kl = {
	computeHierarchyPackedLength: function(t, e) {
		let n = 0;
		const r = [t];
		for (; r.length > 0;) {
			const t = r.pop();
			if (!N(t)) continue;
			n += 2;
			const i = t.positions, o = t.holes;
			if (N(i) && i.length > 0 && (n += i.length * e.packedLength), N(o)) {
				const t = o.length;
				for (let e = 0; e < t; ++e) r.push(o[e]);
			}
		}
		return n;
	},
	packPolygonHierarchy: function(t, e, n, r) {
		const i = [t];
		for (; i.length > 0;) {
			const t = i.pop();
			if (!N(t)) continue;
			const o = t.positions, s = t.holes;
			if (e[n++] = N(o) ? o.length : 0, e[n++] = N(s) ? s.length : 0, N(o)) {
				const t = o.length;
				for (let i = 0; i < t; ++i, n += r.packedLength) r.pack(o[i], e, n);
			}
			if (N(s)) {
				const t = s.length;
				for (let e = 0; e < t; ++e) i.push(s[e]);
			}
		}
		return n;
	},
	unpackPolygonHierarchy: function(t, e, n) {
		const r = t[e++], i = t[e++], o = new Array(r), s = i > 0 ? new Array(i) : void 0;
		for (let a = 0; a < r; ++a, e += n.packedLength) o[a] = n.unpack(t, e);
		for (let a = 0; a < i; ++a) s[a] = Kl.unpackPolygonHierarchy(t, e, n), e = s[a].startingIndex, delete s[a].startingIndex;
		return {
			positions: o,
			holes: s,
			startingIndex: e
		};
	}
}, Jl = new F();
function th(t, e, n, r) {
	return F.subtract(e, t, Jl), F.multiplyByScalar(Jl, n / r, Jl), F.add(t, Jl, Jl), [Jl.x, Jl.y];
}
const eh = new H();
function nh(t, e, n, r) {
	return H.subtract(e, t, eh), H.multiplyByScalar(eh, n / r, eh), H.add(t, eh, eh), [
		eh.x,
		eh.y,
		eh.z
	];
}
Kl.subdivideLineCount = function(t, e, n) {
	const r = H.distance(t, e) / n, i = Math.max(0, Math.ceil(D.log2(r)));
	return Math.pow(2, i);
};
const rh = new rt(), ih = new rt(), oh = new rt(), sh = new H(), ah = new Xc();
Kl.subdivideRhumbLineCount = function(t, e, n, r) {
	const i = new Xc(t.cartesianToCartographic(e, rh), t.cartesianToCartographic(n, ih), t).surfaceDistance / r, o = Math.max(0, Math.ceil(D.log2(i)));
	return Math.pow(2, o);
}, Kl.subdivideTexcoordLine = function(t, e, n, r, i, o) {
	const s = Kl.subdivideLineCount(n, r, i), a = F.distance(t, e), u = a / s, c = o;
	c.length = 2 * s;
	let l = 0;
	for (let h = 0; h < s; h++) {
		const n = th(t, e, h * u, a);
		c[l++] = n[0], c[l++] = n[1];
	}
	return c;
}, Kl.subdivideLine = function(t, e, n, r) {
	const i = Kl.subdivideLineCount(t, e, n), o = H.distance(t, e), s = o / i;
	N(r) || (r = []);
	const a = r;
	a.length = 3 * i;
	let u = 0;
	for (let c = 0; c < i; c++) {
		const n = nh(t, e, c * s, o);
		a[u++] = n[0], a[u++] = n[1], a[u++] = n[2];
	}
	return a;
}, Kl.subdivideTexcoordRhumbLine = function(t, e, n, r, i, o, s) {
	const a = n.cartesianToCartographic(r, rh), u = n.cartesianToCartographic(i, ih);
	ah.setEndPoints(a, u);
	const c = ah.surfaceDistance / o, l = Math.max(0, Math.ceil(D.log2(c))), h = Math.pow(2, l), f = F.distance(t, e), p = f / h, d = s;
	d.length = 2 * h;
	let m = 0;
	for (let y = 0; y < h; y++) {
		const n = th(t, e, y * p, f);
		d[m++] = n[0], d[m++] = n[1];
	}
	return d;
}, Kl.subdivideRhumbLine = function(t, e, n, r, i) {
	const o = new Xc(t.cartesianToCartographic(e, rh), t.cartesianToCartographic(n, ih), t);
	if (N(i) || (i = []), o.surfaceDistance <= r) return i.length = 3, i[0] = e.x, i[1] = e.y, i[2] = e.z, i;
	const s = o.surfaceDistance / r, a = Math.max(0, Math.ceil(D.log2(s))), u = Math.pow(2, a), c = o.surfaceDistance / u, l = i;
	l.length = 3 * u;
	let h = 0;
	for (let f = 0; f < u; f++) {
		const e = o.interpolateUsingSurfaceDistance(f * c, oh), n = t.cartographicToCartesian(e, sh);
		l[h++] = n.x, l[h++] = n.y, l[h++] = n.z;
	}
	return l;
};
const uh = new H(), ch = new H(), lh = new H(), hh = new H();
Kl.scaleToGeodeticHeightExtruded = function(t, e, n, r, i) {
	r = r ?? ut.default;
	const o = uh;
	let s = ch;
	const a = lh;
	let u = hh;
	if (N(t) && N(t.attributes) && N(t.attributes.position)) {
		const c = t.attributes.position.values, l = c.length / 2;
		for (let t = 0; t < l; t += 3) H.fromArray(c, t, a), r.geodeticSurfaceNormal(a, o), u = r.scaleToGeodeticSurface(a, u), s = H.multiplyByScalar(o, n, s), s = H.add(u, s, s), c[t + l] = s.x, c[t + 1 + l] = s.y, c[t + 2 + l] = s.z, i && (u = H.clone(a, u)), s = H.multiplyByScalar(o, e, s), s = H.add(u, s, s), c[t] = s.x, c[t + 1] = s.y, c[t + 2] = s.z;
	}
	return t;
}, Kl.polygonOutlinesFromHierarchy = function(t, e, n) {
	const r = [], i = new Ql();
	let o, s, a;
	for (i.enqueue(t); 0 !== i.length;) {
		const t = i.dequeue();
		let u = t.positions;
		if (e) for (a = u.length, o = 0; o < a; o++) n.scaleToGeodeticSurface(u[o], u[o]);
		if (u = Uc(u, H.equalsEpsilon, !0), u.length < 3) continue;
		const c = t.holes ? t.holes.length : 0;
		for (o = 0; o < c; o++) {
			const u = t.holes[o];
			let c = u.positions;
			if (e) for (a = c.length, s = 0; s < a; ++s) n.scaleToGeodeticSurface(c[s], c[s]);
			if (c = Uc(c, H.equalsEpsilon, !0), c.length < 3) continue;
			r.push(c);
			let l = 0;
			for (N(u.holes) && (l = u.holes.length), s = 0; s < l; s++) i.enqueue(u.holes[s]);
		}
		r.push(u);
	}
	return r;
};
const fh = new rt();
function ph(t, e, n, r) {
	if (r === Cc.RHUMB) return function(t, e, n) {
		const r = n.cartesianToCartographic(t, rh), i = n.cartesianToCartographic(e, ih);
		if (Math.sign(r.latitude) === Math.sign(i.latitude)) return;
		ah.setEndPoints(r, i);
		const o = ah.findIntersectionWithLatitude(0, fh);
		if (!N(o)) return;
		let s = Math.min(r.longitude, i.longitude), a = Math.max(r.longitude, i.longitude);
		if (Math.abs(a - s) > D.PI) {
			const t = s;
			s = a, a = t;
		}
		return o.longitude < s || o.longitude > a ? void 0 : n.cartographicToCartesian(o);
	}(t, e, n);
	const i = xs.lineSegmentPlane(t, e, ia.ORIGIN_XY_PLANE);
	return N(i) ? n.scaleToGeodeticSurface(i, i) : void 0;
}
const dh = new rt();
function mh(t, e, n) {
	const r = [];
	let i, o, s, a, u, c = 0;
	for (; c < t.length;) {
		i = t[c], o = t[(c + 1) % t.length], s = D.sign(i.z), a = D.sign(o.z);
		const l = (t) => e.cartesianToCartographic(t, dh).longitude;
		if (0 === s) r.push({
			position: c,
			type: s,
			visited: !1,
			next: a,
			theta: l(i)
		});
		else if (0 !== a) {
			if (u = ph(i, o, e, n), ++c, !N(u)) continue;
			t.splice(c, 0, u), r.push({
				position: c,
				type: s,
				visited: !1,
				next: a,
				theta: l(u)
			});
		}
		++c;
	}
	return r;
}
function yh(t, e, n, r, i, o, s) {
	const a = [];
	let u = o;
	const c = (t) => (e) => e.position === t, l = [];
	do {
		const t = n[u];
		a.push(t);
		const e = r.findIndex(c(u)), i = r[e];
		if (!N(i)) {
			++u;
			continue;
		}
		const { visited: h, type: f, next: p } = i;
		if (i.visited = !0, 0 === f) {
			if (0 === p) {
				const t = r[e - (s ? 1 : -1)];
				if (t?.position !== u + 1) {
					++u;
					continue;
				}
				t.visited = !0;
			}
			if (!h && s && p > 0 || o === u && !s && p < 0) {
				++u;
				continue;
			}
		}
		if (!(s ? f >= 0 : f <= 0)) {
			++u;
			continue;
		}
		h || l.push(u);
		const d = r[e + (s ? 1 : -1)];
		N(d) ? u = d.position : ++u;
	} while (u < n.length && u >= 0 && u !== o && a.length < n.length);
	t.splice(e, i, a);
	for (const h of l) e = yh(t, ++e, n, r, 0, h, !s);
	return e;
}
Kl.splitPolygonsOnEquator = function(t, e, n, r) {
	N(r) || (r = []), r.splice(0, 0, ...t), r.length = t.length;
	let i = 0;
	for (; i < r.length;) {
		const t = r[i], o = t.slice();
		if (t.length < 3) {
			r[i] = o, ++i;
			continue;
		}
		const s = mh(o, e, n);
		o.length === t.length || s.length <= 1 ? (r[i] = o, ++i) : (s.sort((t, e) => t.theta - e.theta), i = yh(r, i, o, s, 1, 0, o[0].z >= 0));
	}
	return r;
}, Kl.polygonsFromHierarchy = function(t, e, n, r, i, o) {
	const s = [], a = [], u = new Ql();
	u.enqueue(t);
	let c = N(o);
	for (; 0 !== u.length;) {
		const t = u.dequeue();
		let l = t.positions;
		const h = t.holes;
		let f, p;
		if (r) for (p = l.length, f = 0; f < p; f++) i.scaleToGeodeticSurface(l[f], l[f]);
		if (e || (l = Uc(l, H.equalsEpsilon, !0)), l.length < 3) continue;
		let d = n(l);
		if (!N(d)) continue;
		const m = [];
		let y = Ul.computeWindingOrder2D(d);
		if (y === vc.CLOCKWISE && (d.reverse(), l = l.slice().reverse()), c) {
			c = !1;
			let t = [l];
			if (t = o(t, t), t.length > 1) {
				for (const e of t) u.enqueue(new Yc(e, h));
				continue;
			}
		}
		let g = l.slice();
		const w = N(h) ? h.length : 0, E = [];
		let _;
		for (f = 0; f < w; f++) {
			const t = h[f];
			let o = t.positions;
			if (r) for (p = o.length, _ = 0; _ < p; ++_) i.scaleToGeodeticSurface(o[_], o[_]);
			if (e || (o = Uc(o, H.equalsEpsilon, !0)), o.length < 3) continue;
			const s = n(o);
			if (!N(s)) continue;
			y = Ul.computeWindingOrder2D(s), y === vc.CLOCKWISE && (s.reverse(), o = o.slice().reverse()), E.push(o), m.push(g.length), g = g.concat(o), d = d.concat(s);
			let a = 0;
			for (N(t.holes) && (a = t.holes.length), _ = 0; _ < a; _++) u.enqueue(t.holes[_]);
		}
		s.push({
			outerRing: l,
			holes: E
		}), a.push({
			positions: g,
			positions2D: d,
			holes: m
		});
	}
	return {
		hierarchy: s,
		polygons: a
	};
};
const gh = new F(), wh = new H(), Eh = new br(), _h = new wn();
Kl.computeBoundingRectangle = function(t, e, n, r, i) {
	const o = br.fromAxisAngle(t, r, Eh), s = wn.fromQuaternion(o, _h);
	let a = Number.POSITIVE_INFINITY, u = Number.NEGATIVE_INFINITY, c = Number.POSITIVE_INFINITY, l = Number.NEGATIVE_INFINITY;
	const h = n.length;
	for (let f = 0; f < h; ++f) {
		const t = H.clone(n[f], wh);
		wn.multiplyByVector(s, t, t);
		const r = e(t, gh);
		N(r) && (a = Math.min(a, r.x), u = Math.max(u, r.x), c = Math.min(c, r.y), l = Math.max(l, r.y));
	}
	return i.x = a, i.y = c, i.width = u - a, i.height = l - c, i;
}, Kl.createGeometryFromPositions = function(t, e, n, r, i, o, s) {
	let a = Ul.triangulate(e.positions2D, e.holes);
	a.length < 3 && (a = [
		0,
		1,
		2
	]);
	const u = e.positions, c = N(n), l = c ? n.positions : void 0;
	if (i) {
		const t = u.length, e = new Array(3 * t);
		let n = 0;
		for (let o = 0; o < t; o++) {
			const t = u[o];
			e[n++] = t.x, e[n++] = t.y, e[n++] = t.z;
		}
		const r = {
			attributes: { position: new ts({
				componentDatatype: Co.DOUBLE,
				componentsPerAttribute: 3,
				values: e
			}) },
			indices: a,
			primitiveType: Go.TRIANGLES
		};
		c && (r.attributes.st = new ts({
			componentDatatype: Co.FLOAT,
			componentsPerAttribute: 2,
			values: F.packArray(l)
		}));
		const i = new ko(r);
		return o.normal ? ha.computeNormal(i) : i;
	}
	return s === Cc.GEODESIC ? Ul.computeSubdivision(t, u, a, l, r) : s === Cc.RHUMB ? Ul.computeRhumbLineSubdivision(t, u, a, l, r) : void 0;
};
const Oh = [], bh = [], Th = new H(), Ah = new H();
Kl.computeWallGeometry = function(t, e, n, r, i, o) {
	let s, a, u, c, l, h, f, p, d, m = t.length, y = 0, g = 0;
	const w = N(e), E = w ? e.positions : void 0;
	if (i) for (a = 3 * m * 2, s = new Array(2 * a), w && (d = 2 * m * 2, p = new Array(2 * d)), u = 0; u < m; u++) c = t[u], l = t[(u + 1) % m], s[y] = s[y + a] = c.x, ++y, s[y] = s[y + a] = c.y, ++y, s[y] = s[y + a] = c.z, ++y, s[y] = s[y + a] = l.x, ++y, s[y] = s[y + a] = l.y, ++y, s[y] = s[y + a] = l.z, ++y, w && (h = E[u], f = E[(u + 1) % m], p[g] = p[g + d] = h.x, ++g, p[g] = p[g + d] = h.y, ++g, p[g] = p[g + d] = f.x, ++g, p[g] = p[g + d] = f.y, ++g);
	else {
		const e = D.chordLength(r, n.maximumRadius);
		let i = 0;
		if (o === Cc.GEODESIC) for (u = 0; u < m; u++) i += Kl.subdivideLineCount(t[u], t[(u + 1) % m], e);
		else if (o === Cc.RHUMB) for (u = 0; u < m; u++) i += Kl.subdivideRhumbLineCount(n, t[u], t[(u + 1) % m], e);
		for (a = 3 * (i + m), s = new Array(2 * a), w && (d = 2 * (i + m), p = new Array(2 * d)), u = 0; u < m; u++) {
			let r, i;
			c = t[u], l = t[(u + 1) % m], w && (h = E[u], f = E[(u + 1) % m]), o === Cc.GEODESIC ? (r = Kl.subdivideLine(c, l, e, bh), w && (i = Kl.subdivideTexcoordLine(h, f, c, l, e, Oh))) : o === Cc.RHUMB && (r = Kl.subdivideRhumbLine(n, c, l, e, bh), w && (i = Kl.subdivideTexcoordRhumbLine(h, f, n, c, l, e, Oh)));
			const _ = r.length;
			for (let t = 0; t < _; ++t, ++y) s[y] = r[t], s[y + a] = r[t];
			if (s[y] = l.x, s[y + a] = l.x, ++y, s[y] = l.y, s[y + a] = l.y, ++y, s[y] = l.z, s[y + a] = l.z, ++y, w) {
				const t = i.length;
				for (let e = 0; e < t; ++e, ++g) p[g] = i[e], p[g + d] = i[e];
				p[g] = f.x, p[g + d] = f.x, ++g, p[g] = f.y, p[g + d] = f.y, ++g;
			}
		}
	}
	m = s.length;
	const _ = ws.createTypedArray(m / 3, m - 6 * t.length);
	let O = 0;
	for (m /= 6, u = 0; u < m; u++) {
		const t = u, e = t + 1, n = t + m, r = n + 1;
		c = H.fromArray(s, 3 * t, Th), l = H.fromArray(s, 3 * e, Ah), H.equalsEpsilon(c, l, D.EPSILON10, D.EPSILON10) || (_[O++] = t, _[O++] = n, _[O++] = e, _[O++] = e, _[O++] = n, _[O++] = r);
	}
	const b = {
		attributes: new es({ position: new ts({
			componentDatatype: Co.DOUBLE,
			componentsPerAttribute: 3,
			values: s
		}) }),
		indices: _,
		primitiveType: Go.TRIANGLES
	};
	return w && (b.attributes.st = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: 2,
		values: p
	})), new ko(b);
};
const xh = {}, Rh = new _t(0, 0, 0, 1);
let Sh = new _t();
const Ih = new Gi(), Nh = new F(), vh = new F();
xh.worldToWindowCoordinates = function(t, e, n) {
	return xh.worldWithEyeOffsetToWindowCoordinates(t, e, H.ZERO, n);
};
const Mh = new _t(), Ph = new H();
function Ch(t, e, n, r) {
	const i = n.viewMatrix, o = Pn.multiplyByVector(i, _t.fromElements(t.x, t.y, t.z, 1, Mh), Mh), s = H.multiplyComponents(e, H.normalize(o, Ph), Ph);
	return o.x += e.x + s.x, o.y += e.y + s.y, o.z += s.z, Pn.multiplyByVector(n.frustum.projectionMatrix, o, r);
}
const qh = new rt(Math.PI, D.PI_OVER_TWO), Uh = new H(), Lh = new H();
xh.worldWithEyeOffsetToWindowCoordinates = function(t, e, n, r) {
	if (!N(t)) throw new v("scene is required.");
	if (!N(e)) throw new v("position is required.");
	const i = t.frameState, o = xh.computeActualEllipsoidPosition(i, e, Rh);
	if (!N(o)) return;
	const s = t.canvas, a = Ih;
	a.x = 0, a.y = 0, a.width = s.clientWidth, a.height = s.clientHeight;
	const u = t.camera;
	let c = !1;
	if (i.mode === Pc.SCENE2D) {
		const e = t.mapProjection, i = qh, l = e.project(i, Uh), h = H.clone(u.position, Lh), f = u.frustum.clone(), p = Pn.computeViewportTransformation(a, 0, 1, new Pn()), d = u.frustum.projectionMatrix, m = u.positionWC.y, y = H.fromElements(D.sign(m) * l.x - m, 0, -u.positionWC.x), g = $r.pointToGLWindowCoordinates(d, p, y);
		if (0 === m || g.x <= 0 || g.x >= s.clientWidth) c = !0;
		else {
			if (g.x > .5 * s.clientWidth) {
				a.width = g.x, u.frustum.right = l.x - m, Sh = Ch(o, n, u, Sh), xh.clipToGLWindowCoordinates(a, Sh, Nh), a.x += g.x, u.position.x = -u.position.x;
				const t = u.frustum.right;
				u.frustum.right = -u.frustum.left, u.frustum.left = -t, Sh = Ch(o, n, u, Sh), xh.clipToGLWindowCoordinates(a, Sh, vh);
			} else {
				a.x += g.x, a.width -= g.x, u.frustum.left = -l.x - m, Sh = Ch(o, n, u, Sh), xh.clipToGLWindowCoordinates(a, Sh, Nh), a.x = a.x - a.width, u.position.x = -u.position.x;
				const t = u.frustum.left;
				u.frustum.left = -u.frustum.right, u.frustum.right = -t, Sh = Ch(o, n, u, Sh), xh.clipToGLWindowCoordinates(a, Sh, vh);
			}
			H.clone(h, u.position), u.frustum = f.clone(), ((r = F.clone(Nh, r)).x < 0 || r.x > s.clientWidth) && (r.x = vh.x);
		}
	}
	if (i.mode !== Pc.SCENE2D || c) {
		if (Sh = Ch(o, n, u, Sh), Sh.z < 0 && !(u.frustum instanceof sl) && !(u.frustum instanceof tl)) return;
		r = xh.clipToGLWindowCoordinates(a, Sh, r);
	}
	return r.y = s.clientHeight - r.y, r;
}, xh.worldToDrawingBufferCoordinates = function(t, e, n) {
	if (N(n = xh.worldToWindowCoordinates(t, e, n))) return xh.transformWindowToDrawingBuffer(t, n, n);
};
const Dh = new H(), zh = new rt();
xh.computeActualEllipsoidPosition = function(t, e, n) {
	const r = t.mode;
	if (r === Pc.SCENE3D) return H.clone(e, n);
	const i = t.mapProjection, o = i.ellipsoid.cartesianToCartographic(e, zh);
	if (!N(o)) return;
	if (i.project(o, Dh), r === Pc.COLUMBUS_VIEW) return H.fromElements(Dh.z, Dh.x, Dh.y, n);
	if (r === Pc.SCENE2D) return H.fromElements(0, Dh.x, Dh.y, n);
	const s = t.morphTime;
	return H.fromElements(D.lerp(Dh.z, e.x, s), D.lerp(Dh.x, e.y, s), D.lerp(Dh.y, e.z, s), n);
};
const jh = new H(), Fh = new H(), Bh = new Pn();
xh.clipToGLWindowCoordinates = function(t, e, n) {
	return H.divideByScalar(e, e.w, jh), Pn.computeViewportTransformation(t, 0, 1, Bh), Pn.multiplyByPoint(Bh, jh, Fh), F.fromCartesian3(Fh, n);
}, xh.transformWindowToDrawingBuffer = function(t, e, n) {
	const r = t.canvas, i = t.drawingBufferWidth / r.clientWidth, o = t.drawingBufferHeight / r.clientHeight;
	return F.fromElements(e.x * i, e.y * o, n);
};
const Gh = new _t(), kh = new _t();
xh.drawingBufferToWorldCoordinates = function(t, e, n, r) {
	const i = t.context.uniformState, o = i.currentFrustum, s = o.x, a = o.y;
	if (t.frameState.useLogDepth) {
		const t = n * i.log2FarDepthFromNearPlusOne;
		n = a * (1 - s / (Math.pow(2, t) - 1 + s)) / (a - s);
	}
	const u = t.view.passState.viewport, c = _t.clone(_t.UNIT_W, Gh);
	let l;
	c.x = (e.x - u.x) / u.width * 2 - 1, c.y = (e.y - u.y) / u.height * 2 - 1, c.z = 2 * n - 1, c.w = 1;
	let h = t.camera.frustum;
	if (N(h.fovy)) {
		l = Pn.multiplyByVector(i.inverseViewProjection, c, kh);
		const t = 1 / l.w;
		H.multiplyByScalar(l, t, l);
	} else {
		const t = h.offCenterFrustum;
		N(t) && (h = t), l = kh, l.x = .5 * (c.x * (h.right - h.left) + h.left + h.right), l.y = .5 * (c.y * (h.top - h.bottom) + h.bottom + h.top), l.z = .5 * (c.z * (s - a) - s - a), l.w = 1, l = Pn.multiplyByVector(i.inverseView, l, l);
	}
	return H.fromCartesian4(l, r);
};
const Wh = {}, Vh = new H(), Hh = new H(), Xh = new H(), Yh = new H(), $h = new Cu();
function Zh(t, e, n, r, i) {
	const o = H.subtract(t, e, Vh), s = H.dot(n, o), a = H.dot(r, o);
	return F.fromElements(s, a, i);
}
Wh.validOutline = function(t) {
	M.defined("positions", t);
	const e = Cu.fromPoints(t, $h).halfAxes, n = wn.getColumn(e, 0, Hh), r = wn.getColumn(e, 1, Xh), i = wn.getColumn(e, 2, Yh), o = H.magnitude(n), s = H.magnitude(r), a = H.magnitude(i);
	return !(0 === o && (0 === s || 0 === a) || 0 === s && 0 === a);
}, Wh.computeProjectTo2DArguments = function(t, e, n, r) {
	M.defined("positions", t), M.defined("centerResult", e), M.defined("planeAxis1Result", n), M.defined("planeAxis2Result", r);
	const i = Cu.fromPoints(t, $h), o = i.halfAxes, s = wn.getColumn(o, 0, Hh), a = wn.getColumn(o, 1, Xh), u = wn.getColumn(o, 2, Yh), c = H.magnitude(s), l = H.magnitude(a), h = H.magnitude(u), f = Math.min(c, l, h);
	if (0 === c && (0 === l || 0 === h) || 0 === l && 0 === h) return !1;
	let p, d;
	return f !== l && f !== h || (p = s), f === c ? p = a : f === h && (d = a), f !== c && f !== l || (d = u), H.normalize(p, n), H.normalize(d, r), H.clone(i.center, e), !0;
}, Wh.createProjectPointsTo2DFunction = function(t, e, n) {
	return function(r) {
		const i = new Array(r.length);
		for (let o = 0; o < r.length; o++) i[o] = Zh(r[o], t, e, n);
		return i;
	};
}, Wh.createProjectPointTo2DFunction = function(t, e, n) {
	return function(r, i) {
		return Zh(r, t, e, n, i);
	};
};
const Qh = new H(), Kh = new Gi(), Jh = new F(), tf = new F(), ef = new H(), nf = new H(), rf = new H(), of = new H(), sf = new H(), af = new H(), uf = new br(), cf = new wn(), lf = new wn(), hf = new H();
function ff(t, e, n, r, i, o, s, a, u) {
	const c = t.positions;
	let l = Ul.triangulate(t.positions2D, t.holes);
	l.length < 3 && (l = [
		0,
		1,
		2
	]);
	const h = ws.createTypedArray(c.length, l.length);
	h.set(l);
	let f = cf;
	if (0 !== r) {
		let t = br.fromAxisAngle(s, r, uf);
		if (f = wn.fromQuaternion(t, f), e.tangent || e.bitangent) {
			t = br.fromAxisAngle(s, -r, uf);
			const n = wn.fromQuaternion(t, lf);
			a = H.normalize(wn.multiplyByVector(n, a, a), a), e.bitangent && (u = H.normalize(H.cross(s, a, u), u));
		}
	} else f = wn.clone(wn.IDENTITY, f);
	const p = tf;
	e.st && (p.x = n.x, p.y = n.y);
	const d = c.length, m = 3 * d, y = new Float64Array(m), g = e.normal ? new Float32Array(m) : void 0, w = e.tangent ? new Float32Array(m) : void 0, E = e.bitangent ? new Float32Array(m) : void 0, _ = e.st ? new Float32Array(2 * d) : void 0;
	let O = 0, b = 0, T = 0, A = 0, x = 0;
	for (let S = 0; S < d; S++) {
		const t = c[S];
		if (y[O++] = t.x, y[O++] = t.y, y[O++] = t.z, e.st) if (N(i) && i.positions.length === d) _[x++] = i.positions[S].x, _[x++] = i.positions[S].y;
		else {
			const e = o(wn.multiplyByVector(f, t, Qh), Jh);
			F.subtract(e, p, e);
			const r = D.clamp(e.x / n.width, 0, 1), i = D.clamp(e.y / n.height, 0, 1);
			_[x++] = r, _[x++] = i;
		}
		e.normal && (g[b++] = s.x, g[b++] = s.y, g[b++] = s.z), e.tangent && (w[A++] = a.x, w[A++] = a.y, w[A++] = a.z), e.bitangent && (E[T++] = u.x, E[T++] = u.y, E[T++] = u.z);
	}
	const R = new es();
	return e.position && (R.position = new ts({
		componentDatatype: Co.DOUBLE,
		componentsPerAttribute: 3,
		values: y
	})), e.normal && (R.normal = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: 3,
		values: g
	})), e.tangent && (R.tangent = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: 3,
		values: w
	})), e.bitangent && (R.bitangent = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: 3,
		values: E
	})), e.st && (R.st = new ts({
		componentDatatype: Co.FLOAT,
		componentsPerAttribute: 2,
		values: _
	})), new ko({
		attributes: R,
		indices: h,
		primitiveType: Go.TRIANGLES
	});
}
function pf(t) {
	const e = (t = t ?? I.EMPTY_OBJECT).polygonHierarchy, n = t.textureCoordinates;
	M.defined("options.polygonHierarchy", e);
	const r = t.vertexFormat ?? ns.DEFAULT;
	this._vertexFormat = ns.clone(r), this._polygonHierarchy = e, this._stRotation = t.stRotation ?? 0, this._ellipsoid = ut.clone(t.ellipsoid ?? ut.default), this._workerName = "createCoplanarPolygonGeometry", this._textureCoordinates = n, this.packedLength = Kl.computeHierarchyPackedLength(e, H) + ns.packedLength + ut.packedLength + (N(n) ? Kl.computeHierarchyPackedLength(n, F) : 1) + 2;
}
pf.fromPositions = function(t) {
	return t = t ?? I.EMPTY_OBJECT, M.defined("options.positions", t.positions), new pf({
		polygonHierarchy: { positions: t.positions },
		vertexFormat: t.vertexFormat,
		stRotation: t.stRotation,
		ellipsoid: t.ellipsoid,
		textureCoordinates: t.textureCoordinates
	});
}, pf.pack = function(t, e, n) {
	return M.typeOf.object("value", t), M.defined("array", e), n = n ?? 0, n = Kl.packPolygonHierarchy(t._polygonHierarchy, e, n, H), ut.pack(t._ellipsoid, e, n), n += ut.packedLength, ns.pack(t._vertexFormat, e, n), n += ns.packedLength, e[n++] = t._stRotation, N(t._textureCoordinates) ? n = Kl.packPolygonHierarchy(t._textureCoordinates, e, n, F) : e[n++] = -1, e[n++] = t.packedLength, e;
};
const df = ut.clone(ut.UNIT_SPHERE), mf = new ns(), yf = { polygonHierarchy: {} };
pf.unpack = function(t, e, n) {
	M.defined("array", t), e = e ?? 0;
	const r = Kl.unpackPolygonHierarchy(t, e, H);
	e = r.startingIndex, delete r.startingIndex;
	const i = ut.unpack(t, e, df);
	e += ut.packedLength;
	const o = ns.unpack(t, e, mf);
	e += ns.packedLength;
	const s = t[e++], a = -1 === t[e] ? void 0 : Kl.unpackPolygonHierarchy(t, e, F);
	N(a) ? (e = a.startingIndex, delete a.startingIndex) : e++;
	const u = t[e++];
	return N(n) || (n = new pf(yf)), n._polygonHierarchy = r, n._ellipsoid = ut.clone(i, n._ellipsoid), n._vertexFormat = ns.clone(o, n._vertexFormat), n._stRotation = s, n._textureCoordinates = a, n.packedLength = u, n;
}, pf.createGeometry = function(t) {
	const e = t._vertexFormat, n = t._polygonHierarchy, r = t._stRotation, i = t._textureCoordinates, o = N(i);
	let s = n.positions;
	if (s = Uc(s, H.equalsEpsilon, !0), s.length < 3) return;
	let a = ef, u = nf, c = rf, l = sf;
	const h = af;
	if (!Wh.computeProjectTo2DArguments(s, of, l, h)) return;
	if (a = H.cross(l, h, a), a = H.normalize(a, a), !H.equalsEpsilon(of, H.ZERO, D.EPSILON6)) {
		const e = t._ellipsoid.geodeticSurfaceNormal(of, hf);
		H.dot(a, e) < 0 && (a = H.negate(a, a), l = H.negate(l, l));
	}
	const f = Wh.createProjectPointsTo2DFunction(of, l, h), p = Wh.createProjectPointTo2DFunction(of, l, h);
	e.tangent && (u = H.clone(l, u)), e.bitangent && (c = H.clone(h, c));
	const d = Kl.polygonsFromHierarchy(n, o, f, !1), m = d.hierarchy, y = d.polygons, g = o ? Kl.polygonsFromHierarchy(i, !0, function(t) {
		return t;
	}, !1).polygons : void 0;
	if (0 === m.length) return;
	s = m[0].outerRing;
	const w = Xi.fromPoints(s), E = Kl.computeBoundingRectangle(a, p, s, r, Kh), _ = [];
	for (let T = 0; T < y.length; T++) {
		const t = new rs({ geometry: ff(y[T], e, E, r, o ? g[T] : void 0, p, a, u, c) });
		_.push(t);
	}
	const O = ha.combineInstances(_)[0];
	O.attributes.position.values = new Float64Array(O.attributes.position.values), O.indices = ws.createTypedArray(O.attributes.position.values.length / 3, O.indices);
	const b = O.attributes;
	return e.position || delete b.position, new ko({
		attributes: b,
		indices: O.indices,
		primitiveType: O.primitiveType,
		boundingSphere: w
	});
};
var gf = class t {
	_lng = 0;
	_lat = 0;
	_alt = 0;
	_heading = 0;
	_pitch = 0;
	_roll = 0;
	_zoom = -1;
	constructor(t, e, n, r, i, o, s) {
		this._lng = t || 0, this._lat = e || 0, this._alt = n || 0, this._heading = r || 0, this._pitch = i || 0, this._roll = o || 0, this._zoom = s || -1;
	}
	set lng(t) {
		this._lng = +t;
	}
	get lng() {
		return this._lng;
	}
	set lat(t) {
		this._lat = +t;
	}
	get lat() {
		return this._lat;
	}
	set alt(t) {
		this._alt = +t;
	}
	get alt() {
		return this._alt;
	}
	set heading(t) {
		this._heading = +t;
	}
	get heading() {
		return this._heading;
	}
	set pitch(t) {
		this._pitch = +t;
	}
	get pitch() {
		return this._pitch;
	}
	set roll(t) {
		this._roll = +t;
	}
	get roll() {
		return this._roll;
	}
	set zoom(t) {
		this._zoom = +t;
	}
	get zoom() {
		return this._zoom;
	}
	serialize() {
		let e = new t(this._lng, this._lat, this._alt, this._heading, this._pitch, this._roll, this._zoom);
		return JSON.stringify(e);
	}
	transformWGS84ToCartesian(t) {
		return t ? H.fromDegrees(t.lng, t.lat, t.alt, ut.WGS84) : H.ZERO;
	}
	distance(e) {
		return e && e instanceof t ? H.distance(this.transformWGS84ToCartesian(this), this.transformWGS84ToCartesian(e)) : 0;
	}
	clone() {
		let e = new t();
		return e.lng = this.lng || 0, e.lat = this.lat || 0, e.alt = this.alt || 0, e.heading = this.heading || 0, e.pitch = this.pitch || 0, e.roll = this.roll || 0, e;
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
		const t = this.heading?.toFixed(1), e = this.pitch?.toFixed(1), n = this.roll?.toFixed(1);
		return `${this.getZoomString()}经度:${this.lng.toFixed(3)}° 纬度:${this.lat.toFixed(3)}° 高度:${this.alt.toFixed(2)}米 航向角:${t}° 视角:${e}° 翻转角:${n}°`;
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
	static fromArray(e) {
		let n = new t();
		return Array.isArray(e) && (n.lng = e[0] || 0, n.lat = e[1] || 0, n.alt = e[2] || 0, n.heading = e[3] || 0, n.pitch = e[4] || 0, n.roll = e[5] || 0, n.zoom = e[6] || -1), n;
	}
	static fromString(e) {
		let n = new t();
		if (e) {
			const t = e.split(",").map((t, e, n) => Number(t));
			n = this.fromArray(t);
		}
		return n;
	}
	static fromObject(e) {
		return new t(e.lng, e.lat, e.alt, e.heading, e.pitch, e.roll, e.zoom);
	}
	static fromObject2(e) {
		return new t(e._lng, e._lat, e._alt, e._heading, e._pitch, e._roll, e._zoom);
	}
	static deserialize(e) {
		let n = new t(), r = JSON.parse(e);
		return r && (n.lng = r.lng || 0, n.lat = r.lat || 0, n.alt = r.alt || 0, n.heading = r.heading || 0, n.pitch = r.pitch || 0, n.roll = r.roll || 0, n.zoom = r.zoom || -1), n;
	}
};
const wf = new Mc();
var Ef = class {
	static transformCartesianToCartographic(t) {
		return ut.WGS84.cartesianToCartographic(t);
	}
	static transformCartesianToWGS84(t) {
		if (t) {
			let e = ut.WGS84.cartesianToCartographic(t);
			return new gf(D.toDegrees(e?.longitude || 0), D.toDegrees(e?.latitude || 0), e?.height || 0);
		}
		return new gf(0, 0);
	}
	static transformCartographicToWGS84(t) {
		return t ? new gf(D.toDegrees(t?.longitude || 0), D.toDegrees(t?.latitude || 0), t.height || 0) : new gf(0, 0);
	}
	static transformWGS84ToCartesian(t) {
		return t ? H.fromDegrees(t.lng, t.lat, t.alt, ut.WGS84) : H.ZERO;
	}
	static transformWGS84ToCartographic(t) {
		return t ? rt.fromDegrees(t.lng, t.lat, t.alt) : rt.ZERO;
	}
	static transformCartesianArrayToWGS84Array(t) {
		return t ? t.map((t) => this.transformCartesianToWGS84(t)) : [];
	}
	static transformWGS84ArrayToCartesianArray(t) {
		return t ? t.map((t) => this.transformWGS84ToCartesian(t)) : [];
	}
	static transformWGS84ToMercator(t) {
		let e = wf.project(rt.fromDegrees(t.lng, t.lat, t.alt));
		return new gf(e.x, e.y, e.z);
	}
	static transformMercatorToWGS84(t) {
		let e = wf.unproject(new H(t.lng, t.lat, t.alt));
		return new gf(D.toDegrees(e.longitude), D.toDegrees(e.latitude), e.height);
	}
	static transformWindowToWGS84(t, e) {
		let n, r = e.scene;
		if (r.mode === Pc.SCENE3D) {
			let e = r.camera.getPickRay(t);
			n = r.globe.pick(e, r);
		} else n = r.camera.pickEllipsoid(t, ut.WGS84);
		return this.transformCartesianToWGS84(n);
	}
	static transformWGS84ToWindow(t, e) {
		let n = e.scene;
		return xh.worldToWindowCoordinates(n, this.transformWGS84ToCartesian(t));
	}
};
const _f = function(t) {
	let e = 0;
	if (t && Array.isArray(t)) for (let n = 0; n < t.length - 1; n++) {
		let r = Ef.transformWGS84ToCartographic(t[n]), i = Ef.transformWGS84ToCartographic(t[n + 1]), o = new Fc();
		o.setEndPoints(r, i);
		let s = o.surfaceDistance;
		s = Math.sqrt(Math.pow(s, 2) + Math.pow(i.height - r.height, 2)), e += s;
	}
	return Number(e.toFixed(3));
}, Of = function(t, e, n = 10, r = 1) {
	const i = H.fromDegrees(t.lng, t.lat, t.alt), o = H.fromDegrees(e.lng, e.lat, e.alt), s = [];
	for (let a = 0; a <= n; ++a) {
		const t = a / n, e = Math.pow(t, r), u = H.lerp(i, o, e, new H());
		s.push(u);
	}
	return s;
};
var bf = class {
	static parsePosition(t) {
		let e = new gf();
		if (!t) return e;
		if ("string" == typeof t) e = gf.fromString(t);
		else if (Array.isArray(t)) e = gf.fromArray(t);
		else if (Object(t) instanceof gf) Object(t) instanceof gf ? e = t : Object(t) instanceof H ? e = Ef.transformCartesianToWGS84(t) : Object(t) instanceof rt && (e = Ef.transformCartographicToWGS84(t));
		else {
			const n = Object(t);
			n.hasOwnProperty("lng") && n.hasOwnProperty("lat") ? e = gf.fromObject(t) : n.hasOwnProperty("_lng") && n.hasOwnProperty("_lat") && (e = gf.fromObject2(t));
		}
		return e;
	}
	static parsePositions(t) {
		let e;
		if ("string" == typeof t) {
			if (t.indexOf("#") >= 0) throw new Error("the positions invalid");
			e = t.split(";").filter((t) => !!t);
		} else e = t;
		return e.map((t) => this.parsePosition(t));
	}
	static parsePointCoordToArray(t) {
		return [(t = this.parsePosition(t)).lng, t.lat];
	}
	static parsePolylineCoordToArray(t) {
		let e = [];
		return (t = this.parsePositions(t)).forEach((t) => {
			e.push([t.lng, t.lat]);
		}), e;
	}
	static parsePolygonCoordToArray(t, e = !1) {
		let n = [];
		return (t = this.parsePositions(t)).forEach((t) => {
			n.push([t.lng, t.lat]);
		}), e && n.length > 0 && n.push(n[0]), [n];
	}
}, Tf = class t {
	dayNumber;
	secondsOfDay;
	constructor(t, e) {
		this.dayNumber = t, this.secondsOfDay = e;
	}
	addSeconds(t) {
		this.secondsOfDay += t;
	}
	addSecondsClone(e) {
		const n = this.dayNumber, r = this.secondsOfDay + e;
		return new t(n, r);
	}
};
function Af(t, e, n = 2e3) {
	let r = $r.eastNorthUpToFixedFrame(t), i = wn.fromRotationZ(e || 0), o = Pn.fromRotationTranslation(i);
	return Pn.multiply(r, o, r), Pn.multiplyByPoint(r, new H(0, n, 0), new H());
}
const xf = [], Rf = [];
function Sf(t, e) {
	return new Tf(t.dayNumber, t.secondsOfDay + e);
}
function If(t, e, n, r, i = 20, o = 1) {
	const s = bf.parsePosition(e), a = bf.parsePosition(n), u = _f([s, a]), c = Math.ceil(u / r), l = Of(s, a, i, o), h = t, f = Sf(h, c), p = l.length - 1, d = Ef.transformCartesianToWGS84(l[p]);
	xf.length = 0, Rf.length = 0;
	for (let m = 0; m <= p; ++m) {
		const t = Sf(h, m / p * c), e = l[m];
		xf.push(t), Rf.push(e);
	}
	return {
		startTimeKey: h,
		endTimeKey: f,
		stopPosition: d,
		julianDates: xf,
		julianPositions: Rf
	};
}
function Nf(t, e, n, r = 2, i = 20, o = 1) {
	const s = bf.parsePosition(e), a = bf.parsePosition(n), u = _f([s, a]) / r, c = Of(s, a, i, o), l = t, h = Sf(l, r), f = c.length - 1, p = Ef.transformCartesianToWGS84(c[f]);
	xf.length = 0, Rf.length = 0;
	for (let d = 0; d <= f; ++d) {
		const t = Sf(l, d / f * r), e = c[d];
		xf.push(t), Rf.push(e);
	}
	return {
		currentSpeed: u,
		startTimeKey: l,
		endTimeKey: h,
		stopPosition: p,
		julianDates: xf,
		julianPositions: Rf
	};
}
function vf(t, e, n) {
	const r = t / 396e3;
	return {
		dlng: r * Math.cos(e),
		dlat: r * Math.sin(e),
		dalt: r * Math.sin(n) * 11e4
	};
}
function Mf(t, e) {
	return 11 * t / 360 * Math.sin(e);
}
function Pf(t, e) {
	return Math.abs(Math.cos(t) * Math.cos(e));
}
y(((t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
})({
	getCorrectionByHeadingPitch: () => Pf,
	getDetAltBySpeedPitch: () => Mf,
	getDetFlightAttitude: () => vf,
	getDistancePosition: () => Af,
	updatePathSectionBySpeed: () => If,
	updatePathSectionByTime: () => Nf
}));
