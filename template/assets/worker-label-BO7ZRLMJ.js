var e = Object.create, t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, o = Object.getPrototypeOf, i = Object.prototype.hasOwnProperty, s = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), a = (s, a, u) => (u = null != s ? e(o(s)) : {}, ((e, o, s, a) => {
	if (o && "object" == typeof o || "function" == typeof o) for (var u, c = n(o), l = 0, h = c.length; l < h; l++) u = c[l], i.call(e, u) || void 0 === u || t(e, u, {
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
*/ const c = Symbol("Comlink.proxy"), l = Symbol("Comlink.endpoint"), h = Symbol("Comlink.releaseProxy"), f = Symbol("Comlink.finalizer"), p = Symbol("Comlink.thrown"), d = (e) => "object" == typeof e && null !== e || "function" == typeof e, m = /* @__PURE__ */ new Map([["proxy", {
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
		const { id: i, type: s, path: a } = Object.assign({ path: [] }, o.data), u = (o.data.argumentList || []).map(j);
		let l;
		try {
			const t = a.slice(0, -1).reduce((e, t) => e[t], e), r = a.reduce((e, t) => e[t], e);
			switch (s) {
				case "GET":
					l = r;
					break;
				case "SET":
					t[a.slice(-1)[0]] = j(o.data.value), l = !0;
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
							return E.set(e, t), e;
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
			const [o, a] = S(r);
			t.postMessage(Object.assign(Object.assign({}, o), { id: i }), a), "RELEASE" === s && (t.removeEventListener("message", n), g(t), f in e && "function" == typeof e[f] && e[f]());
		}).catch((e) => {
			const [r, n] = S({
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
function w(e) {
	if (e) throw new Error("Proxy has been released and is not useable");
}
function b(e) {
	return T(e, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then(() => {
		g(e);
	});
}
const O = /* @__PURE__ */ new WeakMap(), _ = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
	const t = (O.get(e) || 0) - 1;
	O.set(e, t), 0 === t && b(e);
});
function x(e, t, r = [], n = function() {}) {
	let o = !1;
	const i = new Proxy(n, {
		get(n, s) {
			if (w(o), s === h) return () => {
				(function(e) {
					_ && _.unregister(e);
				})(i), b(e), t.clear(), o = !0;
			};
			if ("then" === s) {
				if (0 === r.length) return { then: () => i };
				const n = T(e, t, {
					type: "GET",
					path: r.map((e) => e.toString())
				}).then(j);
				return n.then.bind(n);
			}
			return x(e, t, [...r, s]);
		},
		set(n, i, s) {
			w(o);
			const [a, u] = S(s);
			return T(e, t, {
				type: "SET",
				path: [...r, i].map((e) => e.toString()),
				value: a
			}, u).then(j);
		},
		apply(n, i, s) {
			w(o);
			const a = r[r.length - 1];
			if (a === l) return T(e, t, { type: "ENDPOINT" }).then(j);
			if ("bind" === a) return x(e, t, r.slice(0, -1));
			const [u, c] = v(s);
			return T(e, t, {
				type: "APPLY",
				path: r.map((e) => e.toString()),
				argumentList: u
			}, c).then(j);
		},
		construct(n, i) {
			w(o);
			const [s, a] = v(i);
			return T(e, t, {
				type: "CONSTRUCT",
				path: r.map((e) => e.toString()),
				argumentList: s
			}, a).then(j);
		}
	});
	return function(e, t) {
		const r = (O.get(t) || 0) + 1;
		O.set(t, r), _ && _.register(e, t, e);
	}(i, e), i;
}
function v(e) {
	const t = e.map(S);
	return [t.map((e) => e[0]), (r = t.map((e) => e[1]), Array.prototype.concat.apply([], r))];
	var r;
}
const E = /* @__PURE__ */ new WeakMap();
function S(e) {
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
	}, E.get(e) || []];
}
function j(e) {
	switch (e.type) {
		case "HANDLER": return m.get(e.name).deserialize(e.value);
		case "RAW": return e.value;
	}
}
function T(e, t, r, n) {
	return new Promise((o) => {
		const i = new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
		t.set(i, o), e.start && e.start(), e.postMessage(Object.assign({ id: i }, r), n);
	});
}
const A = {};
function q(e) {
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
A.EMPTY_OBJECT = Object.freeze({}), A.EMPTY_ARRAY = Object.freeze([]), q(Object.create) && (R.prototype = Object.create(Error.prototype), R.prototype.constructor = R), R.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return q(this.stack) && (e += `\n${this.stack.toString()}`), e;
}, R.throwInstantiationError = function() {
	throw new R("This function defines an interface and should not be called directly.");
};
const I = {};
function M(e, t, r) {
	return `Expected ${r} to be typeof ${t}, actual typeof was ${e}`;
}
function z() {
	this._listeners = /* @__PURE__ */ new Map(), this._toRemove = /* @__PURE__ */ new Map(), this._toAdd = /* @__PURE__ */ new Map(), this._invokingListeners = !1, this._listenerCount = 0;
}
function P(e, t, r, n) {
	t.has(r) || t.set(r, /* @__PURE__ */ new Set());
	const o = t.get(r);
	return !o.has(n) && (o.add(n), !0);
}
function C(e, t, r, n) {
	const o = t.get(r);
	if (!o || !o.has(n)) return !1;
	if (e._invokingListeners) {
		if (!P(0, e._toRemove, r, n)) return !1;
	} else o.delete(n), 0 === o.size && t.delete(r);
	return !0;
}
I.typeOf = {}, I.defined = function(e, t) {
	if (!q(t)) throw new R(function(e) {
		return `${e} is required, actual value was undefined`;
	}(e));
}, I.typeOf.func = function(e, t) {
	if ("function" != typeof t) throw new R(M(typeof t, "function", e));
}, I.typeOf.string = function(e, t) {
	if ("string" != typeof t) throw new R(M(typeof t, "string", e));
}, I.typeOf.number = function(e, t) {
	if ("number" != typeof t) throw new R(M(typeof t, "number", e));
}, I.typeOf.number.lessThan = function(e, t, r) {
	if (I.typeOf.number(e, t), t >= r) throw new R(`Expected ${e} to be less than ${r}, actual value was ${t}`);
}, I.typeOf.number.lessThanOrEquals = function(e, t, r) {
	if (I.typeOf.number(e, t), t > r) throw new R(`Expected ${e} to be less than or equal to ${r}, actual value was ${t}`);
}, I.typeOf.number.greaterThan = function(e, t, r) {
	if (I.typeOf.number(e, t), t <= r) throw new R(`Expected ${e} to be greater than ${r}, actual value was ${t}`);
}, I.typeOf.number.greaterThanOrEquals = function(e, t, r) {
	if (I.typeOf.number(e, t), t < r) throw new R(`Expected ${e} to be greater than or equal to ${r}, actual value was ${t}`);
}, I.typeOf.object = function(e, t) {
	if ("object" != typeof t) throw new R(M(typeof t, "object", e));
}, I.typeOf.bool = function(e, t) {
	if ("boolean" != typeof t) throw new R(M(typeof t, "boolean", e));
}, I.typeOf.bigint = function(e, t) {
	if ("bigint" != typeof t) throw new R(M(typeof t, "bigint", e));
}, I.typeOf.number.equals = function(e, t, r, n) {
	if (I.typeOf.number(e, r), I.typeOf.number(t, n), r !== n) throw new R(`${e} must be equal to ${t}, the actual values are ${r} and ${n}`);
}, Object.defineProperties(z.prototype, { numberOfListeners: { get: function() {
	return this._listenerCount;
} } }), z.prototype.addEventListener = function(e, t) {
	I.typeOf.func("listener", e);
	const r = this;
	return P(0, r._invokingListeners ? r._toAdd : r._listeners, e, t) && r._listenerCount++, function() {
		r.removeEventListener(e, t);
	};
}, z.prototype.removeEventListener = function(e, t) {
	I.typeOf.func("listener", e);
	const r = C(this, this._listeners, e, t), n = C(this, this._toAdd, e, t), o = r || n;
	return o && this._listenerCount--, o;
}, z.prototype.raiseEvent = function() {
	this._invokingListeners = !0;
	for (const [e, t] of this._listeners.entries()) if (q(e)) for (const r of t) e.apply(r, arguments);
	this._invokingListeners = !1;
	for (const [e, t] of this._toAdd.entries()) for (const r of t) P(0, this._listeners, e, r);
	this._toAdd.clear();
	for (const [e, t] of this._toRemove.entries()) for (const r of t) C(this, this._listeners, e, r);
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
const U = {
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
U.sign = Math.sign ?? function(e) {
	return 0 === (e = +e) || e != e ? e : e > 0 ? 1 : -1;
}, U.signNotZero = function(e) {
	return e < 0 ? -1 : 1;
}, U.toSNorm = function(e, t) {
	return t = t ?? 255, Math.round((.5 * U.clamp(e, -1, 1) + .5) * t);
}, U.fromSNorm = function(e, t) {
	return t = t ?? 255, U.clamp(e, 0, t) / t * 2 - 1;
}, U.normalize = function(e, t, r) {
	return 0 === (r = Math.max(r - t, 0)) ? 0 : U.clamp((e - t) / r, 0, 1);
}, U.sinh = Math.sinh ?? function(e) {
	return (Math.exp(e) - Math.exp(-e)) / 2;
}, U.cosh = Math.cosh ?? function(e) {
	return (Math.exp(e) + Math.exp(-e)) / 2;
}, U.lerp = function(e, t, r) {
	return (1 - r) * e + r * t;
}, U.PI = Math.PI, U.ONE_OVER_PI = 1 / Math.PI, U.PI_OVER_TWO = Math.PI / 2, U.PI_OVER_THREE = Math.PI / 3, U.PI_OVER_FOUR = Math.PI / 4, U.PI_OVER_SIX = Math.PI / 6, U.THREE_PI_OVER_TWO = 3 * Math.PI / 2, U.TWO_PI = 2 * Math.PI, U.ONE_OVER_TWO_PI = 1 / (2 * Math.PI), U.RADIANS_PER_DEGREE = Math.PI / 180, U.DEGREES_PER_RADIAN = 180 / Math.PI, U.RADIANS_PER_ARCSECOND = U.RADIANS_PER_DEGREE / 3600, U.toRadians = function(e) {
	if (!q(e)) throw new R("degrees is required.");
	return e * U.RADIANS_PER_DEGREE;
}, U.toDegrees = function(e) {
	if (!q(e)) throw new R("radians is required.");
	return e * U.DEGREES_PER_RADIAN;
}, U.convertLongitudeRange = function(e) {
	if (!q(e)) throw new R("angle is required.");
	const t = U.TWO_PI, r = e - Math.floor(e / t) * t;
	return r < -Math.PI ? r + t : r >= Math.PI ? r - t : r;
}, U.clampToLatitudeRange = function(e) {
	if (!q(e)) throw new R("angle is required.");
	return U.clamp(e, -1 * U.PI_OVER_TWO, U.PI_OVER_TWO);
}, U.negativePiToPi = function(e) {
	if (!q(e)) throw new R("angle is required.");
	return e >= -U.PI && e <= U.PI ? e : U.zeroToTwoPi(e + U.PI) - U.PI;
}, U.zeroToTwoPi = function(e) {
	if (!q(e)) throw new R("angle is required.");
	if (e >= 0 && e <= U.TWO_PI) return e;
	const t = U.mod(e, U.TWO_PI);
	return Math.abs(t) < U.EPSILON14 && Math.abs(e) > U.EPSILON14 ? U.TWO_PI : t;
}, U.mod = function(e, t) {
	if (!q(e)) throw new R("m is required.");
	if (!q(t)) throw new R("n is required.");
	if (0 === t) throw new R("divisor cannot be 0.");
	return U.sign(e) === U.sign(t) && Math.abs(e) < Math.abs(t) ? e : (e % t + t) % t;
}, U.equalsEpsilon = function(e, t, r, n) {
	if (!q(e)) throw new R("left is required.");
	if (!q(t)) throw new R("right is required.");
	r = r ?? 0, n = n ?? r;
	const o = Math.abs(e - t);
	return o <= n || o <= r * Math.max(Math.abs(e), Math.abs(t));
}, U.lessThan = function(e, t, r) {
	if (!q(e)) throw new R("first is required.");
	if (!q(t)) throw new R("second is required.");
	if (!q(r)) throw new R("absoluteEpsilon is required.");
	return e - t < -r;
}, U.lessThanOrEquals = function(e, t, r) {
	if (!q(e)) throw new R("first is required.");
	if (!q(t)) throw new R("second is required.");
	if (!q(r)) throw new R("absoluteEpsilon is required.");
	return e - t < r;
}, U.greaterThan = function(e, t, r) {
	if (!q(e)) throw new R("first is required.");
	if (!q(t)) throw new R("second is required.");
	if (!q(r)) throw new R("absoluteEpsilon is required.");
	return e - t > r;
}, U.greaterThanOrEquals = function(e, t, r) {
	if (!q(e)) throw new R("first is required.");
	if (!q(t)) throw new R("second is required.");
	if (!q(r)) throw new R("absoluteEpsilon is required.");
	return e - t > -r;
};
const D = [1];
U.factorial = function(e) {
	if ("number" != typeof e || e < 0) throw new R("A number greater than or equal to 0 is required.");
	const t = D.length;
	if (e >= t) {
		let r = D[t - 1];
		for (let n = t; n <= e; n++) {
			const e = r * n;
			D.push(e), r = e;
		}
	}
	return D[e];
}, U.incrementWrap = function(e, t, r) {
	if (r = r ?? 0, !q(e)) throw new R("n is required.");
	if (t <= r) throw new R("maximumValue must be greater than minimumValue.");
	return ++e > t && (e = r), e;
}, U.isPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new R("A number between 0 and (2^32)-1 is required.");
	return 0 !== e && !(e & e - 1);
}, U.nextPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 2147483648) throw new R("A number between 0 and 2^31 is required.");
	return --e, e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ++e;
}, U.previousPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new R("A number between 0 and (2^32)-1 is required.");
	return e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ((e |= e >> 32) >>> 0) - (e >>> 1);
}, U.clamp = function(e, t, r) {
	return I.typeOf.number("value", e), I.typeOf.number("min", t), I.typeOf.number("max", r), e < t ? t : e > r ? r : e;
};
let k = new N.default();
U.setRandomNumberSeed = function(e) {
	if (!q(e)) throw new R("seed is required.");
	k = new N.default(e);
}, U.nextRandomNumber = function() {
	return k.random();
}, U.randomBetween = function(e, t) {
	return U.nextRandomNumber() * (t - e) + e;
}, U.acosClamped = function(e) {
	if (!q(e)) throw new R("value is required.");
	return Math.acos(U.clamp(e, -1, 1));
}, U.asinClamped = function(e) {
	if (!q(e)) throw new R("value is required.");
	return Math.asin(U.clamp(e, -1, 1));
}, U.chordLength = function(e, t) {
	if (!q(e)) throw new R("angle is required.");
	if (!q(t)) throw new R("radius is required.");
	return 2 * t * Math.sin(.5 * e);
}, U.logBase = function(e, t) {
	if (!q(e)) throw new R("number is required.");
	if (!q(t)) throw new R("base is required.");
	return Math.log(e) / Math.log(t);
}, U.cbrt = Math.cbrt ?? function(e) {
	const t = Math.pow(Math.abs(e), 1 / 3);
	return e < 0 ? -t : t;
}, U.log2 = Math.log2 ?? function(e) {
	return Math.log(e) * Math.LOG2E;
}, U.fog = function(e, t) {
	const r = e * t;
	return 1 - Math.exp(-r * r);
}, U.fastApproximateAtan = function(e) {
	return I.typeOf.number("x", e), e * (-.1784 * Math.abs(e) - .0663 * e * e + 1.0301);
}, U.fastApproximateAtan2 = function(e, t) {
	let r;
	I.typeOf.number("x", e), I.typeOf.number("y", t);
	let n = Math.abs(e);
	r = Math.abs(t);
	const o = Math.max(n, r);
	r = Math.min(n, r);
	const i = r / o;
	if (isNaN(i)) throw new R("either x or y must be nonzero");
	return n = U.fastApproximateAtan(i), n = Math.abs(t) > Math.abs(e) ? U.PI_OVER_TWO - n : n, n = e < 0 ? U.PI - n : n, n = t < 0 ? -n : n, n;
};
var L = class e {
	constructor(e, t) {
		this.x = e ?? 0, this.y = t ?? 0;
	}
	static fromElements(t, r, n) {
		return q(n) ? (n.x = t, n.y = r, n) : new e(t, r);
	}
	static clone(t, r) {
		if (q(t)) return q(r) ? (r.x = t.x, r.y = t.y, r) : new e(t.x, t.y);
	}
	static pack(e, t, r) {
		return I.typeOf.object("value", e), I.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r] = e.y, t;
	}
	static unpack(t, r, n) {
		return I.defined("array", t), r = r ?? 0, q(n) || (n = new e()), n.x = t[r++], n.y = t[r], n;
	}
	static packArray(t, r) {
		I.defined("array", t);
		const n = t.length, o = 2 * n;
		if (q(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new R("If result is a typed array, it must have exactly array.length * 2 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 2 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (I.defined("array", t), I.typeOf.number.greaterThanOrEquals("array.length", t.length, 2), t.length % 2 != 0) throw new R("array length must be a multiple of 2.");
		const n = t.length;
		q(r) ? r.length = n / 2 : r = new Array(n / 2);
		for (let o = 0; o < n; o += 2) {
			const n = o / 2;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return I.typeOf.object("cartesian", e), Math.max(e.x, e.y);
	}
	static minimumComponent(e) {
		return I.typeOf.object("cartesian", e), Math.min(e.x, e.y);
	}
	static minimumByComponent(e, t, r) {
		return I.typeOf.object("first", e), I.typeOf.object("second", t), I.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r;
	}
	static maximumByComponent(e, t, r) {
		return I.typeOf.object("first", e), I.typeOf.object("second", t), I.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r;
	}
	static clamp(e, t, r, n) {
		I.typeOf.object("value", e), I.typeOf.object("min", t), I.typeOf.object("max", r), I.typeOf.object("result", n);
		const o = U.clamp(e.x, t.x, r.x), i = U.clamp(e.y, t.y, r.y);
		return n.x = o, n.y = i, n;
	}
	static magnitudeSquared(e) {
		return I.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return I.typeOf.object("left", t), I.typeOf.object("right", r), e.subtract(t, r, F), e.magnitude(F);
	}
	static distanceSquared(t, r) {
		return I.typeOf.object("left", t), I.typeOf.object("right", r), e.subtract(t, r, F), e.magnitudeSquared(F);
	}
	static normalize(t, r) {
		I.typeOf.object("cartesian", t), I.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, isNaN(r.x) || isNaN(r.y)) throw new R("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), e.x * t.x + e.y * t.y;
	}
	static cross(e, t) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), e.x * t.y - e.y * t.x;
	}
	static multiplyComponents(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r;
	}
	static divideComponents(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r;
	}
	static add(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r;
	}
	static subtract(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r;
	}
	static multiplyByScalar(e, t, r) {
		return I.typeOf.object("cartesian", e), I.typeOf.number("scalar", t), I.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r;
	}
	static divideByScalar(e, t, r) {
		return I.typeOf.object("cartesian", e), I.typeOf.number("scalar", t), I.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r;
	}
	static negate(e, t) {
		return I.typeOf.object("cartesian", e), I.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t;
	}
	static abs(e, t) {
		return I.typeOf.object("cartesian", e), I.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t;
	}
	static lerp(t, r, n, o) {
		return I.typeOf.object("start", t), I.typeOf.object("end", r), I.typeOf.number("t", n), I.typeOf.object("result", o), e.multiplyByScalar(r, n, W), o = e.multiplyByScalar(t, 1 - n, o), e.add(W, o, o);
	}
	static angleBetween(t, r) {
		return I.typeOf.object("left", t), I.typeOf.object("right", r), e.normalize(t, B), e.normalize(r, $), U.acosClamped(e.dot(B, $));
	}
	static mostOrthogonalAxis(t, r) {
		I.typeOf.object("cartesian", t), I.typeOf.object("result", r);
		const n = e.normalize(t, V);
		return e.abs(n, n), n.x <= n.y ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Y, r);
	}
	static equals(e, t) {
		return e === t || q(e) && q(t) && e.x === t.x && e.y === t.y;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || q(e) && q(t) && U.equalsEpsilon(e.x, t.x, r, n) && U.equalsEpsilon(e.y, t.y, r, n);
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
L.fromCartesian3 = L.clone, L.fromCartesian4 = L.clone, L.packedLength = 2, L.fromArray = L.unpack;
const F = new L(), W = new L(), B = new L(), $ = new L(), V = new L();
L.ZERO = Object.freeze(new L(0, 0)), L.ONE = Object.freeze(new L(1, 1)), L.UNIT_X = Object.freeze(new L(1, 0)), L.UNIT_Y = Object.freeze(new L(0, 1));
var Q = class e {
	constructor(e, t, r) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0;
	}
	static fromSpherical(t, r) {
		I.typeOf.object("spherical", t), q(r) || (r = new e());
		const n = t.clock, o = t.cone, i = t.magnitude ?? 1, s = i * Math.sin(o);
		return r.x = s * Math.cos(n), r.y = s * Math.sin(n), r.z = i * Math.cos(o), r;
	}
	static fromElements(t, r, n, o) {
		return q(o) ? (o.x = t, o.y = r, o.z = n, o) : new e(t, r, n);
	}
	static clone(t, r) {
		if (q(t)) return q(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r) : new e(t.x, t.y, t.z);
	}
	static pack(e, t, r) {
		return I.typeOf.object("value", e), I.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r] = e.z, t;
	}
	static unpack(t, r, n) {
		return I.defined("array", t), r = r ?? 0, q(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r], n;
	}
	static packArray(t, r) {
		I.defined("array", t);
		const n = t.length, o = 3 * n;
		if (q(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new R("If result is a typed array, it must have exactly array.length * 3 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 3 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (I.defined("array", t), I.typeOf.number.greaterThanOrEquals("array.length", t.length, 3), t.length % 3 != 0) throw new R("array length must be a multiple of 3.");
		const n = t.length;
		q(r) ? r.length = n / 3 : r = new Array(n / 3);
		for (let o = 0; o < n; o += 3) {
			const n = o / 3;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return I.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z);
	}
	static minimumComponent(e) {
		return I.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z);
	}
	static minimumByComponent(e, t, r) {
		return I.typeOf.object("first", e), I.typeOf.object("second", t), I.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r;
	}
	static maximumByComponent(e, t, r) {
		return I.typeOf.object("first", e), I.typeOf.object("second", t), I.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r;
	}
	static clamp(e, t, r, n) {
		I.typeOf.object("value", e), I.typeOf.object("min", t), I.typeOf.object("max", r), I.typeOf.object("result", n);
		const o = U.clamp(e.x, t.x, r.x), i = U.clamp(e.y, t.y, r.y), s = U.clamp(e.z, t.z, r.z);
		return n.x = o, n.y = i, n.z = s, n;
	}
	static magnitudeSquared(e) {
		return I.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return I.typeOf.object("left", t), I.typeOf.object("right", r), e.subtract(t, r, H), e.magnitude(H);
	}
	static distanceSquared(t, r) {
		return I.typeOf.object("left", t), I.typeOf.object("right", r), e.subtract(t, r, H), e.magnitudeSquared(H);
	}
	static normalize(t, r) {
		I.typeOf.object("cartesian", t), I.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z)) throw new R("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z;
	}
	static multiplyComponents(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r;
	}
	static divideComponents(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r;
	}
	static add(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r;
	}
	static subtract(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r;
	}
	static multiplyByScalar(e, t, r) {
		return I.typeOf.object("cartesian", e), I.typeOf.number("scalar", t), I.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r;
	}
	static divideByScalar(e, t, r) {
		return I.typeOf.object("cartesian", e), I.typeOf.number("scalar", t), I.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r;
	}
	static negate(e, t) {
		return I.typeOf.object("cartesian", e), I.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t;
	}
	static abs(e, t) {
		return I.typeOf.object("cartesian", e), I.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t;
	}
	static lerp(t, r, n, o) {
		return I.typeOf.object("start", t), I.typeOf.object("end", r), I.typeOf.number("t", n), I.typeOf.object("result", o), e.multiplyByScalar(r, n, G), o = e.multiplyByScalar(t, 1 - n, o), e.add(G, o, o);
	}
	static angleBetween(t, r) {
		I.typeOf.object("left", t), I.typeOf.object("right", r), e.normalize(t, Y), e.normalize(r, Z);
		const n = e.dot(Y, Z), o = e.magnitude(e.cross(Y, Z, Y));
		return Math.atan2(o, n);
	}
	static mostOrthogonalAxis(t, r) {
		I.typeOf.object("cartesian", t), I.typeOf.object("result", r);
		const n = e.normalize(t, X);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Z, r) : n.y <= n.z ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_Z, r);
	}
	static projectVector(t, r, n) {
		I.defined("a", t), I.defined("b", r), I.defined("result", n);
		const o = e.dot(t, r) / e.dot(r, r);
		return e.multiplyByScalar(r, o, n);
	}
	static equals(e, t) {
		return e === t || q(e) && q(t) && e.x === t.x && e.y === t.y && e.z === t.z;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || q(e) && q(t) && U.equalsEpsilon(e.x, t.x, r, n) && U.equalsEpsilon(e.y, t.y, r, n) && U.equalsEpsilon(e.z, t.z, r, n);
	}
	static cross(e, t, r) {
		I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r);
		const n = e.x, o = e.y, i = e.z, s = t.x, a = t.y, u = t.z, c = o * u - i * a, l = i * s - n * u, h = n * a - o * s;
		return r.x = c, r.y = l, r.z = h, r;
	}
	static midpoint(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = .5 * (e.x + t.x), r.y = .5 * (e.y + t.y), r.z = .5 * (e.z + t.z), r;
	}
	static fromDegrees(t, r, n, o, i) {
		return I.typeOf.number("longitude", t), I.typeOf.number("latitude", r), t = U.toRadians(t), r = U.toRadians(r), e.fromRadians(t, r, n, o, i);
	}
	static fromRadians(t, r, n, o, i) {
		I.typeOf.number("longitude", t), I.typeOf.number("latitude", r), n = n ?? 0;
		const s = q(o) ? o.radiiSquared : e._ellipsoidRadiiSquared, a = Math.cos(r);
		J.x = a * Math.cos(t), J.y = a * Math.sin(t), J.z = Math.sin(r), J = e.normalize(J, J), e.multiplyComponents(s, J, K);
		const u = Math.sqrt(e.dot(J, K));
		return K = e.divideByScalar(K, u, K), J = e.multiplyByScalar(J, n, J), q(i) || (i = new e()), e.add(K, J, i);
	}
	static fromDegreesArray(t, r, n) {
		if (I.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new R("the number of coordinates must be a multiple of 2 and at least 2");
		const o = t.length;
		q(n) ? n.length = o / 2 : n = new Array(o / 2);
		for (let i = 0; i < o; i += 2) {
			const o = t[i], s = t[i + 1], a = i / 2;
			n[a] = e.fromDegrees(o, s, 0, r, n[a]);
		}
		return n;
	}
	static fromRadiansArray(t, r, n) {
		if (I.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new R("the number of coordinates must be a multiple of 2 and at least 2");
		const o = t.length;
		q(n) ? n.length = o / 2 : n = new Array(o / 2);
		for (let i = 0; i < o; i += 2) {
			const o = t[i], s = t[i + 1], a = i / 2;
			n[a] = e.fromRadians(o, s, 0, r, n[a]);
		}
		return n;
	}
	static fromDegreesArrayHeights(t, r, n) {
		if (I.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new R("the number of coordinates must be a multiple of 3 and at least 3");
		const o = t.length;
		q(n) ? n.length = o / 3 : n = new Array(o / 3);
		for (let i = 0; i < o; i += 3) {
			const o = t[i], s = t[i + 1], a = t[i + 2], u = i / 3;
			n[u] = e.fromDegrees(o, s, a, r, n[u]);
		}
		return n;
	}
	static fromRadiansArrayHeights(t, r, n) {
		if (I.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new R("the number of coordinates must be a multiple of 3 and at least 3");
		const o = t.length;
		q(n) ? n.length = o / 3 : n = new Array(o / 3);
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
Q.fromCartesian4 = Q.clone, Q.packedLength = 3, Q.fromArray = Q.unpack;
const H = new Q(), G = new Q(), Y = new Q(), Z = new Q(), X = new Q();
let J = new Q(), K = new Q();
Q._ellipsoidRadiiSquared = new Q(40680631590769, 40680631590769, 40408299984661.445), Q.ZERO = Object.freeze(new Q(0, 0, 0)), Q.ONE = Object.freeze(new Q(1, 1, 1)), Q.UNIT_X = Object.freeze(new Q(1, 0, 0)), Q.UNIT_Y = Object.freeze(new Q(0, 1, 0)), Q.UNIT_Z = Object.freeze(new Q(0, 0, 1));
const ee = new Q(), te = new Q();
function re(e, t, r, n, o) {
	if (!q(e)) throw new R("cartesian is required.");
	if (!q(t)) throw new R("oneOverRadii is required.");
	if (!q(r)) throw new R("oneOverRadiiSquared is required.");
	if (!q(n)) throw new R("centerToleranceSquared is required.");
	const i = e.x, s = e.y, a = e.z, u = t.x, c = t.y, l = t.z, h = i * i * u * u, f = s * s * c * c, p = a * a * l * l, d = h + f + p, m = Math.sqrt(1 / d), y = Q.multiplyByScalar(e, m, ee);
	if (d < n) return isFinite(m) ? Q.clone(y, o) : void 0;
	const g = r.x, w = r.y, b = r.z, O = te;
	O.x = y.x * g * 2, O.y = y.y * w * 2, O.z = y.z * b * 2;
	let _, x, v, E, S, j, T, A, I, M, z, P = (1 - m) * Q.magnitude(e) / (.5 * Q.magnitude(O)), C = 0;
	do
		P -= C, v = 1 / (1 + P * g), E = 1 / (1 + P * w), S = 1 / (1 + P * b), j = v * v, T = E * E, A = S * S, I = j * v, M = T * E, z = A * S, _ = h * j + f * T + p * A - 1, x = h * I * g + f * M * w + p * z * b, C = _ / (-2 * x);
	while (Math.abs(_) > U.EPSILON12);
	return q(o) ? (o.x = i * v, o.y = s * E, o.z = a * S, o) : new Q(i * v, s * E, a * S);
}
var ne = class e {
	constructor(e, t, r) {
		this.longitude = e ?? 0, this.latitude = t ?? 0, this.height = r ?? 0;
	}
	static fromRadians(t, r, n, o) {
		return I.typeOf.number("longitude", t), I.typeOf.number("latitude", r), n = n ?? 0, q(o) ? (o.longitude = t, o.latitude = r, o.height = n, o) : new e(t, r, n);
	}
	static fromDegrees(t, r, n, o) {
		return I.typeOf.number("longitude", t), I.typeOf.number("latitude", r), t = U.toRadians(t), r = U.toRadians(r), e.fromRadians(t, r, n, o);
	}
	static fromCartesian(t, r, n) {
		const o = q(r) ? r.oneOverRadii : e._ellipsoidOneOverRadii, i = q(r) ? r.oneOverRadiiSquared : e._ellipsoidOneOverRadiiSquared, s = re(t, o, i, q(r) ? r._centerToleranceSquared : e._ellipsoidCenterToleranceSquared, ie);
		if (!q(s)) return;
		let a = Q.multiplyComponents(s, i, oe);
		a = Q.normalize(a, a);
		const u = Q.subtract(t, s, se), c = Math.atan2(a.y, a.x), l = Math.asin(a.z), h = U.sign(Q.dot(u, t)) * Q.magnitude(u);
		return q(n) ? (n.longitude = c, n.latitude = l, n.height = h, n) : new e(c, l, h);
	}
	static toCartesian(e, t, r) {
		return I.defined("cartographic", e), Q.fromRadians(e.longitude, e.latitude, e.height, t, r);
	}
	static clone(t, r) {
		if (q(t)) return q(r) ? (r.longitude = t.longitude, r.latitude = t.latitude, r.height = t.height, r) : new e(t.longitude, t.latitude, t.height);
	}
	static equals(e, t) {
		return e === t || q(e) && q(t) && e.longitude === t.longitude && e.latitude === t.latitude && e.height === t.height;
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || q(e) && q(t) && Math.abs(e.longitude - t.longitude) <= r && Math.abs(e.latitude - t.latitude) <= r && Math.abs(e.height - t.height) <= r;
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
	static _ellipsoidOneOverRadii = new Q(1 / 6378137, 1 / 6378137, 1 / 6356752.314245179);
	static _ellipsoidOneOverRadiiSquared = new Q(1 / 40680631590769, 1 / 40680631590769, 1 / 40408299984661.445);
	static _ellipsoidCenterToleranceSquared = U.EPSILON1;
};
ne.ZERO = Object.freeze(new ne(0, 0, 0));
const oe = new Q(), ie = new Q(), se = new Q();
function ae(e, t, r, n) {
	t = t ?? 0, r = r ?? 0, n = n ?? 0, I.typeOf.number.greaterThanOrEquals("x", t, 0), I.typeOf.number.greaterThanOrEquals("y", r, 0), I.typeOf.number.greaterThanOrEquals("z", n, 0), e._radii = new Q(t, r, n), e._radiiSquared = new Q(t * t, r * r, n * n), e._radiiToTheFourth = new Q(t * t * t * t, r * r * r * r, n * n * n * n), e._oneOverRadii = new Q(0 === t ? 0 : 1 / t, 0 === r ? 0 : 1 / r, 0 === n ? 0 : 1 / n), e._oneOverRadiiSquared = new Q(0 === t ? 0 : 1 / (t * t), 0 === r ? 0 : 1 / (r * r), 0 === n ? 0 : 1 / (n * n)), e._minimumRadius = Math.min(t, r, n), e._maximumRadius = Math.max(t, r, n), e._centerToleranceSquared = U.EPSILON1, 0 !== e._radiiSquared.z && (e._squaredXOverSquaredZ = e._radiiSquared.x / e._radiiSquared.z);
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
		if (!q(t)) return;
		const n = t._radii;
		return q(r) ? (Q.clone(n, r._radii), Q.clone(t._radiiSquared, r._radiiSquared), Q.clone(t._radiiToTheFourth, r._radiiToTheFourth), Q.clone(t._oneOverRadii, r._oneOverRadii), Q.clone(t._oneOverRadiiSquared, r._oneOverRadiiSquared), r._minimumRadius = t._minimumRadius, r._maximumRadius = t._maximumRadius, r._centerToleranceSquared = t._centerToleranceSquared, r) : new e(n.x, n.y, n.z);
	}
	static fromCartesian3(t, r) {
		return q(r) || (r = new e()), q(t) ? (ae(r, t.x, t.y, t.z), r) : r;
	}
	static get default() {
		return e._default;
	}
	static set default(t) {
		I.typeOf.object("value", t), e._default = t, Q._ellipsoidRadiiSquared = t.radiiSquared, ne._ellipsoidOneOverRadii = t.oneOverRadii, ne._ellipsoidOneOverRadiiSquared = t.oneOverRadiiSquared, ne._ellipsoidCenterToleranceSquared = t._centerToleranceSquared;
	}
	clone(t) {
		return e.clone(this, t);
	}
	static pack(e, t, r) {
		return I.typeOf.object("value", e), I.defined("array", t), r = r ?? 0, Q.pack(e._radii, t, r), t;
	}
	static unpack(t, r, n) {
		I.defined("array", t), r = r ?? 0;
		const o = Q.unpack(t, r);
		return e.fromCartesian3(o, n);
	}
	geodeticSurfaceNormalCartographic(e, t) {
		I.typeOf.object("cartographic", e);
		const r = e.longitude, n = e.latitude, o = Math.cos(n), i = o * Math.cos(r), s = o * Math.sin(r), a = Math.sin(n);
		return q(t) || (t = new Q()), t.x = i, t.y = s, t.z = a, Q.normalize(t, t);
	}
	geodeticSurfaceNormal(e, t) {
		if (I.typeOf.object("cartesian", e), isNaN(e.x) || isNaN(e.y) || isNaN(e.z)) throw new R("cartesian has a NaN component");
		if (!Q.equalsEpsilon(e, Q.ZERO, U.EPSILON14)) return q(t) || (t = new Q()), t = Q.multiplyComponents(e, this._oneOverRadiiSquared, t), Q.normalize(t, t);
	}
	cartographicToCartesian(e, t) {
		const r = ce, n = le;
		this.geodeticSurfaceNormalCartographic(e, r), Q.multiplyComponents(this._radiiSquared, r, n);
		const o = Math.sqrt(Q.dot(r, n));
		return Q.divideByScalar(n, o, n), Q.multiplyByScalar(r, e.height, r), q(t) || (t = new Q()), Q.add(n, r, t);
	}
	cartographicArrayToCartesianArray(e, t) {
		I.defined("cartographics", e);
		const r = e.length;
		q(t) ? t.length = r : t = new Array(r);
		for (let n = 0; n < r; n++) t[n] = this.cartographicToCartesian(e[n], t[n]);
		return t;
	}
	cartesianToCartographic(e, t) {
		const r = this.scaleToGeodeticSurface(e, fe);
		if (!q(r)) return;
		const n = this.geodeticSurfaceNormal(r, he), o = Q.subtract(e, r, pe), i = Math.atan2(n.y, n.x), s = Math.asin(n.z), a = U.sign(Q.dot(o, e)) * Q.magnitude(o);
		return q(t) ? (t.longitude = i, t.latitude = s, t.height = a, t) : new ne(i, s, a);
	}
	cartesianArrayToCartographicArray(e, t) {
		I.defined("cartesians", e);
		const r = e.length;
		q(t) ? t.length = r : t = new Array(r);
		for (let n = 0; n < r; ++n) t[n] = this.cartesianToCartographic(e[n], t[n]);
		return t;
	}
	scaleToGeodeticSurface(e, t) {
		return re(e, this._oneOverRadii, this._oneOverRadiiSquared, this._centerToleranceSquared, t);
	}
	scaleToGeocentricSurface(e, t) {
		I.typeOf.object("cartesian", e), q(t) || (t = new Q());
		const r = e.x, n = e.y, o = e.z, i = this._oneOverRadiiSquared, s = 1 / Math.sqrt(r * r * i.x + n * n * i.y + o * o * i.z);
		return Q.multiplyByScalar(e, s, t);
	}
	transformPositionToScaledSpace(e, t) {
		return q(t) || (t = new Q()), Q.multiplyComponents(e, this._oneOverRadii, t);
	}
	transformPositionFromScaledSpace(e, t) {
		return q(t) || (t = new Q()), Q.multiplyComponents(e, this._radii, t);
	}
	equals(e) {
		return this === e || q(e) && Q.equals(this._radii, e._radii);
	}
	toString() {
		return this._radii.toString();
	}
	getSurfaceNormalIntersectionWithZAxis(e, t, r) {
		if (I.typeOf.object("position", e), !U.equalsEpsilon(this._radii.x, this._radii.y, U.EPSILON15)) throw new R("Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)");
		I.typeOf.number.greaterThan("Ellipsoid.radii.z", this._radii.z, 0), t = t ?? 0;
		const n = this._squaredXOverSquaredZ;
		if (q(r) || (r = new Q()), r.x = 0, r.y = 0, r.z = e.z * (1 - n), !(Math.abs(r.z) >= this._radii.z - t)) return r;
	}
	getLocalCurvature(e, t) {
		I.typeOf.object("surfacePosition", e), q(t) || (t = new L());
		const r = this.getSurfaceNormalIntersectionWithZAxis(e, 0, de), n = Q.distance(e, r), o = n * (this.minimumRadius * n / this.maximumRadius ** 2) ** 2;
		return L.fromElements(1 / n, 1 / o, t);
	}
	surfaceArea(e) {
		I.typeOf.object("rectangle", e);
		const t = e.west;
		let r = e.east;
		const n = e.south, o = e.north;
		for (; r < t;) r += U.TWO_PI;
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
ue.WGS84 = Object.freeze(new ue(6378137, 6378137, 6356752.314245179)), ue.UNIT_SPHERE = Object.freeze(new ue(1, 1, 1)), ue.MOON = Object.freeze(new ue(U.LUNAR_RADIUS, U.LUNAR_RADIUS, U.LUNAR_RADIUS)), ue.MARS = Object.freeze(new ue(3396190, 3396190, 3376200)), ue._default = ue.WGS84, ue.packedLength = Q.packedLength, ue.prototype.geocentricSurfaceNormal = Q.normalize;
const ce = new Q(), le = new Q(), he = new Q(), fe = new Q(), pe = new Q(), de = new Q(), me = [
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
	I.typeOf.number("a", e), I.typeOf.number("b", t), I.typeOf.func("func", r);
	const n = .5 * (t + e), o = .5 * (t - e);
	let i = 0;
	for (let s = 0; s < 5; s++) {
		const e = o * me[s];
		i += ye[s] * (r(n + e) + r(n - e));
	}
	return i *= o, i;
}
const we = {
	OUTSIDE: -1,
	INTERSECTING: 0,
	INSIDE: 1
};
Object.freeze(we);
var be = class e {
	constructor(e, t, r, n) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0, this.w = n ?? 0;
	}
	static fromElements(t, r, n, o, i) {
		return q(i) ? (i.x = t, i.y = r, i.z = n, i.w = o, i) : new e(t, r, n, o);
	}
	static fromColor(t, r) {
		return I.typeOf.object("color", t), q(r) ? (r.x = t.red, r.y = t.green, r.z = t.blue, r.w = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static clone(t, r) {
		if (q(t)) return q(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r.w = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static pack(e, t, r) {
		return I.typeOf.object("value", e), I.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.z, t[r] = e.w, t;
	}
	static unpack(t, r, n) {
		return I.defined("array", t), r = r ?? 0, q(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r++], n.w = t[r], n;
	}
	static packArray(t, r) {
		I.defined("array", t);
		const n = t.length, o = 4 * n;
		if (q(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new R("If result is a typed array, it must have exactly array.length * 4 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 4 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (I.defined("array", t), I.typeOf.number.greaterThanOrEquals("array.length", t.length, 4), t.length % 4 != 0) throw new R("array length must be a multiple of 4.");
		const n = t.length;
		q(r) ? r.length = n / 4 : r = new Array(n / 4);
		for (let o = 0; o < n; o += 4) {
			const n = o / 4;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return I.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z, e.w);
	}
	static minimumComponent(e) {
		return I.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z, e.w);
	}
	static minimumByComponent(e, t, r) {
		return I.typeOf.object("first", e), I.typeOf.object("second", t), I.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r.w = Math.min(e.w, t.w), r;
	}
	static maximumByComponent(e, t, r) {
		return I.typeOf.object("first", e), I.typeOf.object("second", t), I.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r.w = Math.max(e.w, t.w), r;
	}
	static clamp(e, t, r, n) {
		I.typeOf.object("value", e), I.typeOf.object("min", t), I.typeOf.object("max", r), I.typeOf.object("result", n);
		const o = U.clamp(e.x, t.x, r.x), i = U.clamp(e.y, t.y, r.y), s = U.clamp(e.z, t.z, r.z), a = U.clamp(e.w, t.w, r.w);
		return n.x = o, n.y = i, n.z = s, n.w = a, n;
	}
	static magnitudeSquared(e) {
		return I.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return I.typeOf.object("left", t), I.typeOf.object("right", r), e.subtract(t, r, Oe), e.magnitude(Oe);
	}
	static distanceSquared(t, r) {
		return I.typeOf.object("left", t), I.typeOf.object("right", r), e.subtract(t, r, Oe), e.magnitudeSquared(Oe);
	}
	static normalize(t, r) {
		I.typeOf.object("cartesian", t), I.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, r.w = t.w / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z) || isNaN(r.w)) throw new R("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z + e.w * t.w;
	}
	static multiplyComponents(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r.w = e.w * t.w, r;
	}
	static divideComponents(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r.w = e.w / t.w, r;
	}
	static add(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r.w = e.w + t.w, r;
	}
	static subtract(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r.w = e.w - t.w, r;
	}
	static multiplyByScalar(e, t, r) {
		return I.typeOf.object("cartesian", e), I.typeOf.number("scalar", t), I.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r.w = e.w * t, r;
	}
	static divideByScalar(e, t, r) {
		return I.typeOf.object("cartesian", e), I.typeOf.number("scalar", t), I.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r.w = e.w / t, r;
	}
	static negate(e, t) {
		return I.typeOf.object("cartesian", e), I.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
	}
	static abs(e, t) {
		return I.typeOf.object("cartesian", e), I.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t.w = Math.abs(e.w), t;
	}
	static lerp(t, r, n, o) {
		return I.typeOf.object("start", t), I.typeOf.object("end", r), I.typeOf.number("t", n), I.typeOf.object("result", o), e.multiplyByScalar(r, n, _e), o = e.multiplyByScalar(t, 1 - n, o), e.add(_e, o, o);
	}
	static mostOrthogonalAxis(t, r) {
		I.typeOf.object("cartesian", t), I.typeOf.object("result", r);
		const n = e.normalize(t, xe);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? n.x <= n.w ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_W, r) : n.z <= n.w ? e.clone(e.UNIT_Z, r) : e.clone(e.UNIT_W, r) : n.y <= n.z ? n.y <= n.w ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_W, r) : n.z <= n.w ? e.clone(e.UNIT_Z, r) : e.clone(e.UNIT_W, r);
	}
	static equals(e, t) {
		return e === t || q(e) && q(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2] && e.w === t[r + 3];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || q(e) && q(t) && U.equalsEpsilon(e.x, t.x, r, n) && U.equalsEpsilon(e.y, t.y, r, n) && U.equalsEpsilon(e.z, t.z, r, n) && U.equalsEpsilon(e.w, t.w, r, n);
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
		return I.typeOf.number("value", t), q(r) || (r = new e()), ve[0] = t, je ? (r.x = Ee[0], r.y = Ee[1], r.z = Ee[2], r.w = Ee[3]) : (r.x = Ee[3], r.y = Ee[2], r.z = Ee[1], r.w = Ee[0]), r;
	}
	static unpackFloat(e) {
		return I.typeOf.object("packedFloat", e), je ? (Ee[0] = e.x, Ee[1] = e.y, Ee[2] = e.z, Ee[3] = e.w) : (Ee[0] = e.w, Ee[1] = e.z, Ee[2] = e.y, Ee[3] = e.x), ve[0];
	}
};
be.packedLength = 4, be.fromArray = be.unpack;
const Oe = new be(), _e = new be(), xe = new be();
be.ZERO = Object.freeze(new be(0, 0, 0, 0)), be.ONE = Object.freeze(new be(1, 1, 1, 1)), be.UNIT_X = Object.freeze(new be(1, 0, 0, 0)), be.UNIT_Y = Object.freeze(new be(0, 1, 0, 0)), be.UNIT_Z = Object.freeze(new be(0, 0, 1, 0)), be.UNIT_W = Object.freeze(new be(0, 0, 0, 1));
const ve = /* @__PURE__ */ new Float32Array(1), Ee = new Uint8Array(ve.buffer), Se = new Uint32Array([287454020]), je = 68 === new Uint8Array(Se.buffer)[0];
function Te(e, t, r) {
	I.defined("array", e), I.defined("itemToFind", t), I.defined("comparator", r);
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
function qe(e) {
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
function Ie(e, t, r, n, o, i, s, a) {
	e = e ?? 1, t = t ?? 1, r = r ?? 1, n = n ?? 0, o = o ?? 0, i = i ?? 0, s = s ?? 0, a = a ?? !1, I.typeOf.number.greaterThanOrEquals("Year", e, 1), I.typeOf.number.lessThanOrEquals("Year", e, 9999), I.typeOf.number.greaterThanOrEquals("Month", t, 1), I.typeOf.number.lessThanOrEquals("Month", t, 12), I.typeOf.number.greaterThanOrEquals("Day", r, 1), I.typeOf.number.lessThanOrEquals("Day", r, 31), I.typeOf.number.greaterThanOrEquals("Hour", n, 0), I.typeOf.number.lessThanOrEquals("Hour", n, 23), I.typeOf.number.greaterThanOrEquals("Minute", o, 0), I.typeOf.number.lessThanOrEquals("Minute", o, 59), I.typeOf.bool("IsLeapSecond", a), I.typeOf.number.greaterThanOrEquals("Second", i, 0), I.typeOf.number.lessThanOrEquals("Second", i, a ? 60 : 59), I.typeOf.number.greaterThanOrEquals("Millisecond", s, 0), I.typeOf.number.lessThan("Millisecond", s, 1e3), function() {
		const n = 2 === t && qe(e) ? Re[t - 1] + 1 : Re[t - 1];
		if (r > n) throw new R("Month and Day represents invalid date");
	}(), this.year = e, this.month = t, this.day = r, this.hour = n, this.minute = o, this.second = i, this.millisecond = s, this.isLeapSecond = a;
}
function Me(e, t) {
	this.julianDate = e, this.offset = t;
}
const ze = {
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
Object.freeze(ze);
const Pe = {
	UTC: 0,
	TAI: 1
};
Object.freeze(Pe);
const Ce = new Ie(), Ne = [
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
function Ue(e, t) {
	return Ke.compare(e.julianDate, t.julianDate);
}
const De = new Me();
function ke(e) {
	De.julianDate = e;
	const t = Ke.leapSeconds;
	let r = Te(t, De, Ue);
	r < 0 && (r = ~r), r >= t.length && (r = t.length - 1);
	let n = t[r].offset;
	r > 0 && Ke.secondsDifference(t[r].julianDate, e) > n && (r--, n = t[r].offset), Ke.addSeconds(e, n, e);
}
function Le(e, t) {
	De.julianDate = e;
	const r = Ke.leapSeconds;
	let n = Te(r, De, Ue);
	if (n < 0 && (n = ~n), 0 === n) return Ke.addSeconds(e, -r[0].offset, t);
	if (n >= r.length) return Ke.addSeconds(e, -r[n - 1].offset, t);
	const o = Ke.secondsDifference(r[n].julianDate, e);
	return 0 === o ? Ke.addSeconds(e, -r[n].offset, t) : o <= 1 ? void 0 : Ke.addSeconds(e, -r[--n].offset, t);
}
function Fe(e, t, r) {
	const n = t / ze.SECONDS_PER_DAY | 0;
	return e += n, (t -= ze.SECONDS_PER_DAY * n) < 0 && (e--, t += ze.SECONDS_PER_DAY), r.dayNumber = e, r.secondsOfDay = t, r;
}
function We(e, t, r, n, o, i, s) {
	const a = (t - 14) / 12 | 0, u = e + 4800 + a;
	let c = (1461 * u / 4 | 0) + (367 * (t - 2 - 12 * a) / 12 | 0) - (3 * ((u + 100) / 100 | 0) / 4 | 0) + r - 32075;
	(n -= 12) < 0 && (n += 24);
	const l = i + (n * ze.SECONDS_PER_HOUR + o * ze.SECONDS_PER_MINUTE + s * ze.SECONDS_PER_MILLISECOND);
	return l >= 43200 && (c -= 1), [c, l];
}
const Be = /^(\d{4})$/, $e = /^(\d{4})-(\d{2})$/, Ve = /^(\d{4})-?(\d{3})$/, Qe = /^(\d{4})-?W(\d{2})-?(\d{1})?$/, He = /^(\d{4})-?(\d{2})-?(\d{2})$/, Ge = /([Z+\-])?(\d{2})?:?(\d{2})?$/, Ye = /^(\d{2})(\.\d+)?/.source + Ge.source, Ze = /^(\d{2}):?(\d{2})(\.\d+)?/.source + Ge.source, Xe = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + Ge.source, Je = "Invalid ISO 8601 date.";
var Ke = class e {
	constructor(e, t, r) {
		this.dayNumber = void 0, this.secondsOfDay = void 0, t = t ?? 0, r = r ?? Pe.UTC;
		const n = 0 | (e = e ?? 0);
		Fe(n, t += (e - n) * ze.SECONDS_PER_DAY, this), r === Pe.UTC && ke(this);
	}
	static fromGregorianDate(t, r) {
		if (!(t instanceof Ie)) throw new R("date must be a valid GregorianDate.");
		const n = We(t.year, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
		return q(r) ? (Fe(n[0], n[1], r), ke(r), r) : new e(n[0], n[1], Pe.UTC);
	}
	static fromDate(t, r) {
		if (!(t instanceof Date) || isNaN(t.getTime())) throw new R("date must be a valid JavaScript Date.");
		const n = We(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.getUTCMilliseconds());
		return q(r) ? (Fe(n[0], n[1], r), ke(r), r) : new e(n[0], n[1], Pe.UTC);
	}
	static fromIso8601(t, r) {
		if ("string" != typeof t) throw new R(Je);
		let n, o = (t = t.replace(",", ".")).split("T"), i = 1, s = 1, a = 0, u = 0, c = 0, l = 0;
		const h = o[0], f = o[1];
		let p, d, m, y;
		if (!q(h)) throw new R(Je);
		if (o = h.match(He), null !== o) {
			if (m = h.split("-").length - 1, m > 0 && 2 !== m) throw new R(Je);
			n = +o[1], i = +o[2], s = +o[3];
		} else if (o = h.match($e), null !== o) n = +o[1], i = +o[2];
		else if (o = h.match(Be), null !== o) n = +o[1];
		else {
			let e;
			if (o = h.match(Ve), null !== o) {
				if (n = +o[1], e = +o[2], d = qe(n), e < 1 || d && e > 366 || !d && e > 365) throw new R(Je);
			} else {
				if (o = h.match(Qe), null === o) throw new R(Je);
				{
					n = +o[1];
					const t = +o[2], r = +o[3] || 0;
					if (m = h.split("-").length - 1, m > 0 && (!q(o[3]) && 1 !== m || q(o[3]) && 2 !== m)) throw new R(Je);
					e = 7 * t + r - new Date(Date.UTC(n, 0, 4)).getUTCDay() - 3;
				}
			}
			p = new Date(Date.UTC(n, 0, 1)), p.setUTCDate(e), i = p.getUTCMonth() + 1, s = p.getUTCDate();
		}
		if (d = qe(n), i < 1 || i > 12 || s < 1 || (2 !== i || !d) && s > Ne[i - 1] || d && 2 === i && s > 29) throw new R(Je);
		if (q(f)) {
			if (o = f.match(Xe), null !== o) {
				if (m = f.split(":").length - 1, m > 0 && 2 !== m && 3 !== m) throw new R(Je);
				a = +o[1], u = +o[2], c = +o[3], l = 1e3 * +(o[4] || 0), y = 5;
			} else if (o = f.match(Ze), null !== o) {
				if (m = f.split(":").length - 1, m > 2) throw new R(Je);
				a = +o[1], u = +o[2], c = 60 * +(o[3] || 0), y = 4;
			} else {
				if (o = f.match(Ye), null === o) throw new R(Je);
				a = +o[1], u = 60 * +(o[2] || 0), y = 3;
			}
			if (u >= 60 || c >= 61 || a > 24 || 24 === a && (u > 0 || c > 0 || l > 0)) throw new R(Je);
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
		const w = We(n, i, s, a, u, c, l);
		return q(r) ? (Fe(w[0], w[1], r), ke(r)) : r = new e(w[0], w[1], Pe.UTC), g && e.addSeconds(r, 1, r), r;
	}
	static now(t) {
		return e.fromDate(/* @__PURE__ */ new Date(), t);
	}
	static toGregorianDate(t, r) {
		if (!q(t)) throw new R("julianDate is required.");
		let n = !1, o = Le(t, et);
		q(o) || (e.addSeconds(t, -1, et), o = Le(et, et), n = !0);
		let i = o.dayNumber;
		const s = o.secondsOfDay;
		s >= 43200 && (i += 1);
		let a = i + 68569 | 0;
		const u = 4 * a / 146097 | 0;
		a = a - ((146097 * u + 3) / 4 | 0) | 0;
		const c = 4e3 * (a + 1) / 1461001 | 0;
		a = a - (1461 * c / 4 | 0) + 31 | 0;
		const l = 80 * a / 2447 | 0, h = a - (2447 * l / 80 | 0) | 0;
		a = l / 11 | 0;
		const f = l + 2 - 12 * a | 0, p = 100 * (u - 49) + c + a | 0;
		let d = s / ze.SECONDS_PER_HOUR | 0, m = s - d * ze.SECONDS_PER_HOUR;
		const y = m / ze.SECONDS_PER_MINUTE | 0;
		m -= y * ze.SECONDS_PER_MINUTE;
		let g = 0 | m;
		const w = (m - g) / ze.SECONDS_PER_MILLISECOND;
		return d += 12, d > 23 && (d -= 24), n && (g += 1), q(r) ? (r.year = p, r.month = f, r.day = h, r.hour = d, r.minute = y, r.second = g, r.millisecond = w, r.isLeapSecond = n, r) : new Ie(p, f, h, d, y, g, w, n);
	}
	static toDate(t) {
		if (!q(t)) throw new R("julianDate is required.");
		const r = e.toGregorianDate(t, Ce);
		let n = r.second;
		return r.isLeapSecond && (n -= 1), new Date(Date.UTC(r.year, r.month - 1, r.day, r.hour, r.minute, n, r.millisecond));
	}
	static toIso8601(t, r) {
		if (!q(t)) throw new R("julianDate is required.");
		const n = e.toGregorianDate(t, Ce);
		let o = n.year, i = n.month, s = n.day, a = n.hour;
		const u = n.minute, c = n.second, l = n.millisecond;
		let h;
		if (1e4 === o && 1 === i && 1 === s && 0 === a && 0 === u && 0 === c && 0 === l && (o = 9999, i = 12, s = 31, a = 24), !q(r) && 0 !== l) {
			const e = .01 * l;
			return h = e < 1e-6 ? e.toFixed(20).replace(".", "").replace(/0+$/, "") : e.toString().replace(".", ""), `${o.toString().padStart(4, "0")}-${i.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${h}Z`;
		}
		return q(r) && 0 !== r ? (h = (.01 * l).toFixed(r).replace(".", "").slice(0, r), `${o.toString().padStart(4, "0")}-${i.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${h}Z`) : `${o.toString().padStart(4, "0")}-${i.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}Z`;
	}
	static clone(t, r) {
		if (q(t)) return q(r) ? (r.dayNumber = t.dayNumber, r.secondsOfDay = t.secondsOfDay, r) : new e(t.dayNumber, t.secondsOfDay, Pe.TAI);
	}
	static compare(e, t) {
		if (!q(e)) throw new R("left is required.");
		if (!q(t)) throw new R("right is required.");
		const r = e.dayNumber - t.dayNumber;
		return 0 !== r ? r : e.secondsOfDay - t.secondsOfDay;
	}
	static equals(e, t) {
		return e === t || q(e) && q(t) && e.dayNumber === t.dayNumber && e.secondsOfDay === t.secondsOfDay;
	}
	static equalsEpsilon(t, r, n) {
		return n = n ?? 0, t === r || q(t) && q(r) && Math.abs(e.secondsDifference(t, r)) <= n;
	}
	static totalDays(e) {
		if (!q(e)) throw new R("julianDate is required.");
		return e.dayNumber + e.secondsOfDay / ze.SECONDS_PER_DAY;
	}
	static secondsDifference(e, t) {
		if (!q(e)) throw new R("left is required.");
		if (!q(t)) throw new R("right is required.");
		return (e.dayNumber - t.dayNumber) * ze.SECONDS_PER_DAY + (e.secondsOfDay - t.secondsOfDay);
	}
	static daysDifference(e, t) {
		if (!q(e)) throw new R("left is required.");
		if (!q(t)) throw new R("right is required.");
		return e.dayNumber - t.dayNumber + (e.secondsOfDay - t.secondsOfDay) / ze.SECONDS_PER_DAY;
	}
	static computeTaiMinusUtc(t) {
		De.julianDate = t;
		const r = e.leapSeconds;
		let n = Te(r, De, Ue);
		return n < 0 && (n = ~n, --n, n < 0 && (n = 0)), r[n].offset;
	}
	static addSeconds(e, t, r) {
		if (!q(e)) throw new R("julianDate is required.");
		if (!q(t)) throw new R("seconds is required.");
		if (!q(r)) throw new R("result is required.");
		return Fe(e.dayNumber, e.secondsOfDay + t, r);
	}
	static addMinutes(e, t, r) {
		if (!q(e)) throw new R("julianDate is required.");
		if (!q(t)) throw new R("minutes is required.");
		if (!q(r)) throw new R("result is required.");
		const n = e.secondsOfDay + t * ze.SECONDS_PER_MINUTE;
		return Fe(e.dayNumber, n, r);
	}
	static addHours(e, t, r) {
		if (!q(e)) throw new R("julianDate is required.");
		if (!q(t)) throw new R("hours is required.");
		if (!q(r)) throw new R("result is required.");
		const n = e.secondsOfDay + t * ze.SECONDS_PER_HOUR;
		return Fe(e.dayNumber, n, r);
	}
	static addDays(e, t, r) {
		if (!q(e)) throw new R("julianDate is required.");
		if (!q(t)) throw new R("days is required.");
		if (!q(r)) throw new R("result is required.");
		return Fe(e.dayNumber + t, e.secondsOfDay, r);
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
const et = new Ke(0, 0, Pe.TAI);
Ke.leapSeconds = [
	new Me(new Ke(2441317, 43210, Pe.TAI), 10),
	new Me(new Ke(2441499, 43211, Pe.TAI), 11),
	new Me(new Ke(2441683, 43212, Pe.TAI), 12),
	new Me(new Ke(2442048, 43213, Pe.TAI), 13),
	new Me(new Ke(2442413, 43214, Pe.TAI), 14),
	new Me(new Ke(2442778, 43215, Pe.TAI), 15),
	new Me(new Ke(2443144, 43216, Pe.TAI), 16),
	new Me(new Ke(2443509, 43217, Pe.TAI), 17),
	new Me(new Ke(2443874, 43218, Pe.TAI), 18),
	new Me(new Ke(2444239, 43219, Pe.TAI), 19),
	new Me(new Ke(2444786, 43220, Pe.TAI), 20),
	new Me(new Ke(2445151, 43221, Pe.TAI), 21),
	new Me(new Ke(2445516, 43222, Pe.TAI), 22),
	new Me(new Ke(2446247, 43223, Pe.TAI), 23),
	new Me(new Ke(2447161, 43224, Pe.TAI), 24),
	new Me(new Ke(2447892, 43225, Pe.TAI), 25),
	new Me(new Ke(2448257, 43226, Pe.TAI), 26),
	new Me(new Ke(2448804, 43227, Pe.TAI), 27),
	new Me(new Ke(2449169, 43228, Pe.TAI), 28),
	new Me(new Ke(2449534, 43229, Pe.TAI), 29),
	new Me(new Ke(2450083, 43230, Pe.TAI), 30),
	new Me(new Ke(2450630, 43231, Pe.TAI), 31),
	new Me(new Ke(2451179, 43232, Pe.TAI), 32),
	new Me(new Ke(2453736, 43233, Pe.TAI), 33),
	new Me(new Ke(2454832, 43234, Pe.TAI), 34),
	new Me(new Ke(2456109, 43235, Pe.TAI), 35),
	new Me(new Ke(2457204, 43236, Pe.TAI), 36),
	new Me(new Ke(2457754, 43237, Pe.TAI), 37)
];
var tt = s((e, t) => {
	/*! https://mths.be/punycode v1.4.0 by @mathias */
	(function(r) {
		var n = "object" == typeof e && e && !e.nodeType && e, o = "object" == typeof t && t && !t.nodeType && t, i = "object" == typeof global && global;
		i.global !== i && i.window !== i && i.self !== i || (r = i);
		var s, a, u = 2147483647, c = 36, l = /^xn--/, h = /[^\x20-\x7E]/, f = /[\x2E\u3002\uFF0E\uFF61]/g, p = {
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
		function w(e, t) {
			var r = e.split("@"), n = "";
			return r.length > 1 && (n = r[0] + "@", e = r[1]), n + g((e = e.replace(f, ".")).split("."), t).join(".");
		}
		function b(e) {
			for (var t, r, n = [], o = 0, i = e.length; o < i;) (t = e.charCodeAt(o++)) >= 55296 && t <= 56319 && o < i ? 56320 == (64512 & (r = e.charCodeAt(o++))) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), o--) : n.push(t);
			return n;
		}
		function O(e) {
			return g(e, function(e) {
				var t = "";
				return e > 65535 && (t += m((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t + m(e);
			}).join("");
		}
		function _(e) {
			return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : c;
		}
		function x(e, t) {
			return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
		}
		function v(e, t, r) {
			var n = 0;
			for (e = r ? d(e / 700) : e >> 1, e += d(e / t); e > 455; n += c) e = d(e / 35);
			return d(n + 36 * e / (e + 38));
		}
		function E(e) {
			var t, r, n, o, i, s, a, l, h, f = [], p = e.length, m = 0, g = 128, w = 72, b = e.lastIndexOf("-");
			for (b < 0 && (b = 0), r = 0; r < b; ++r) e.charCodeAt(r) >= 128 && y("not-basic"), f.push(e.charCodeAt(r));
			for (n = b > 0 ? b + 1 : 0; n < p;) {
				for (o = m, i = 1, s = c; n >= p && y("invalid-input"), ((a = _(e.charCodeAt(n++))) >= c || a > d((u - m) / i)) && y("overflow"), m += a * i, !(a < (l = s <= w ? 1 : s >= w + 26 ? 26 : s - w)); s += c) i > d(u / (h = c - l)) && y("overflow"), i *= h;
				w = v(m - o, t = f.length + 1, 0 == o), d(m / t) > u - g && y("overflow"), g += d(m / t), m %= t, f.splice(m++, 0, g);
			}
			return O(f);
		}
		function S(e) {
			var t, r, n, o, i, s, a, l, h, f, p, g, w, O, _, E = [];
			for (g = (e = b(e)).length, t = 128, r = 0, i = 72, s = 0; s < g; ++s) (p = e[s]) < 128 && E.push(m(p));
			for (n = o = E.length, o && E.push("-"); n < g;) {
				for (a = u, s = 0; s < g; ++s) (p = e[s]) >= t && p < a && (a = p);
				for (a - t > d((u - r) / (w = n + 1)) && y("overflow"), r += (a - t) * w, t = a, s = 0; s < g; ++s) if ((p = e[s]) < t && ++r > u && y("overflow"), p == t) {
					for (l = r, h = c; !(l < (f = h <= i ? 1 : h >= i + 26 ? 26 : h - i)); h += c) _ = l - f, O = c - f, E.push(m(x(f + _ % O, 0))), l = d(_ / O);
					E.push(m(x(l, 0))), i = v(r, w, n == o), r = 0, ++n;
				}
				++r, ++t;
			}
			return E.join("");
		}
		if (s = {
			version: "1.3.2",
			ucs2: {
				decode: b,
				encode: O
			},
			decode: E,
			encode: S,
			toASCII: function(e) {
				return w(e, function(e) {
					return h.test(e) ? "xn--" + S(e) : e;
				});
			},
			toUnicode: function(e) {
				return w(e, function(e) {
					return l.test(e) ? E(e.slice(4).toLowerCase()) : e;
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
				var u = -1, c = 0, l = 0, h = -1, f = !1;
				for (s = 0; s < i; s++) f ? "0" === n[s] ? l += 1 : (f = !1, l > c && (u = h, c = l)) : "0" === n[s] && (f = !0, h = s, l = 1);
				l > c && (u = h, c = l), c > 1 && n.splice(u, c, ""), o = n.length;
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
		function h(e, t) {
			var r, n, o = {};
			if ("RegExp" === c(t)) o = null;
			else if (l(t)) for (r = 0, n = t.length; r < n; r++) o[t[r]] = !0;
			else o[t] = !0;
			for (r = 0, n = e.length; r < n; r++) (o && void 0 !== o[e[r]] || !o && t.test(e[r])) && (e.splice(r, 1), n--, r--);
			return e;
		}
		function f(e, t) {
			var r, n;
			if (l(t)) {
				for (r = 0, n = t.length; r < n; r++) if (!f(e, t[r])) return !1;
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
		var g, w = {
			encode: "encode",
			decode: "decode"
		}, b = function(e, t) {
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
		for (g in w) i[g + "PathSegment"] = b("pathname", w[g]), i[g + "UrnPathSegment"] = b("urnpath", w[g]);
		var O = function(e, t, r) {
			return function(n) {
				var o = r ? function(e) {
					return i[t](i[r](e));
				} : i[t];
				for (var s = (n + "").split(e), a = 0, u = s.length; a < u; a++) s[a] = o(s[a]);
				return s.join(e);
			};
		};
		function _(e) {
			return function(t, r) {
				return void 0 === t ? this._parts[e] || "" : (this._parts[e] = t || null, this.build(!r), this);
			};
		}
		function x(e, t) {
			return function(r, n) {
				return void 0 === r ? this._parts[e] || "" : (null !== r && (r += "").charAt(0) === t && (r = r.substring(1)), this._parts[e] = r, this.build(!n), this);
			};
		}
		i.decodePath = O("/", "decodePathSegment"), i.decodeUrnPath = O(":", "decodeUrnPathSegment"), i.recodePath = O("/", "encodePathSegment", "decode"), i.recodeUrnPath = O(":", "encodeUrnPathSegment", "decode"), i.encodeReserved = b("reserved", "encode"), i.parse = function(e, t) {
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
				void 0 !== r ? "RegExp" === c(r) ? !l(e[t]) && r.test(e[t]) ? e[t] = void 0 : e[t] = h(e[t], r) : e[t] !== String(r) || l(r) && 1 !== r.length ? l(e[t]) && (e[t] = h(e[t], r)) : e[t] = void 0 : e[t] = void 0;
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
				case "Array": return !!l(e[t]) && (n ? f : p)(e[t], r);
				case "RegExp": return l(e[t]) ? !!n && f(e[t], r) : Boolean(e[t] && e[t].match(r));
				case "Number": r = String(r);
				case "String": return l(e[t]) ? !!n && f(e[t], r) : e[t] === r;
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
					var h = e.slice(Math.max(l - 3, 0), l);
					if (h && u.test(h)) continue;
				}
				for (var f = l + e.slice(l).search(o), p = e.slice(l, f), d = -1;;) {
					var m = a.exec(p);
					if (!m) break;
					var y = m.index + m[0].length;
					d = Math.max(d, y);
				}
				if (!((p = d > -1 ? p.slice(0, d) + p.slice(d).replace(s, "") : p.replace(s, "")).length <= c[0].length || r.ignore && r.ignore.test(p))) {
					var g = t(p, l, f = l + p.length, e);
					void 0 !== g ? (g = String(g), e = e.slice(0, l) + g + e.slice(f), n.lastIndex = l + g.length) : n.lastIndex = f;
				}
			}
			return n.lastIndex = 0, e;
		}, i.ensureValidHostname = function(t, r) {
			var n = !!t, o = !1;
			if (r && (o = f(i.hostProtocols, r)), o && !n) throw new TypeError("Hostname cannot be empty, if protocol is " + r);
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
		}, s.protocol = _("protocol"), s.username = _("username"), s.password = _("password"), s.hostname = _("hostname"), s.port = _("port"), s.query = x("query", "?"), s.fragment = x("fragment", "#"), s.search = function(e, t) {
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
		var v = s.protocol, E = s.port, S = s.hostname;
		s.protocol = function(e, t) {
			if (e && !(e = e.replace(/:(\/\/)?$/, "")).match(i.protocol_expression)) throw new TypeError("Protocol \"" + e + "\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");
			return v.call(this, e, t);
		}, s.scheme = s.protocol, s.port = function(e, t) {
			return this._parts.urn ? void 0 === e ? "" : this : (void 0 !== e && (0 === e && (e = null), e && (":" === (e += "").charAt(0) && (e = e.substring(1)), i.ensureValidPort(e))), E.call(this, e, t));
		}, s.hostname = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 !== e) {
				var r = { preventInvalidHostname: this._parts.preventInvalidHostname };
				if ("/" !== i.parseHost(e, r)) throw new TypeError("Hostname \"" + e + "\" contains characters other than [A-Z0-9.-]");
				e = r.hostname, this._parts.preventInvalidHostname && i.ensureValidHostname(e, this._parts.protocol);
			}
			return S.call(this, e, t);
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
		var j = s.query;
		return s.query = function(e, t) {
			if (!0 === e) return i.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			if ("function" == typeof e) {
				var r = i.parseQuery(this._parts.query, this._parts.escapeQuerySpace), n = e.call(this, r);
				return this._parts.query = i.buildQuery(n || r, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), this.build(!t), this;
			}
			return void 0 !== e && "string" != typeof e ? (this._parts.query = i.buildQuery(e, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), this.build(!t), this) : j.call(this, e, t);
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
			var t, r, n, o, s, u = this.clone(), c = new i(e), h = {};
			if (u.normalize(), c.normalize(), u.toString() === c.toString()) return !0;
			if (n = u.query(), o = c.query(), u.query(""), c.query(""), u.toString() !== c.toString()) return !1;
			if (n.length !== o.length) return !1;
			for (s in t = i.parseQuery(n, this._parts.escapeQuerySpace), r = i.parseQuery(o, this._parts.escapeQuerySpace), t) if (a.call(t, s)) {
				if (l(t[s])) {
					if (!p(t[s], r[s])) return !1;
				} else if (t[s] !== r[s]) return !1;
				h[s] = !0;
			}
			for (s in r) if (a.call(r, s) && !h[s]) return !1;
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
	const n = {}, o = q(e), i = q(t);
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
	if (!q(e)) throw new R("relative uri is required.");
	if (!q(t)) {
		if (void 0 === r) return e;
		t = r.baseURI ?? r.location.href;
	}
	const n = new ut.default(e);
	return "" !== n.scheme() ? n.toString() : n.absoluteTo(t).toString();
};
const lt = {};
function ht(e, t, r) {
	q(t) || (t = e.width), q(r) || (r = e.height);
	let n = lt[t];
	q(n) || (n = {}, lt[t] = n);
	let o = n[r];
	if (!q(o)) {
		const e = document.createElement("canvas");
		e.width = t, e.height = r, o = e.getContext("2d", { willReadFrequently: !0 }), o.globalCompositeOperation = "copy", n[r] = o;
	}
	return o.drawImage(e, 0, 0, t, r), o.getImageData(0, 0, t, r).data;
}
const ft = /^blob:/i;
function pt(e) {
	return I.typeOf.string("uri", e), ft.test(e);
}
let dt;
const mt = /^data:/i;
function yt(e) {
	return I.typeOf.string("uri", e), mt.test(e);
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
const wt = {
	TERRAIN: 0,
	IMAGERY: 1,
	TILES3D: 2,
	OTHER: 3
};
function bt(e) {
	const t = (e = e ?? A.EMPTY_OBJECT).throttleByServer ?? !1, r = e.throttle ?? !1;
	this.url = e.url, this.requestFunction = e.requestFunction, this.cancelFunction = e.cancelFunction, this.priorityFunction = e.priorityFunction, this.priority = e.priority ?? 0, this.throttle = r, this.throttleByServer = t, this.type = e.type ?? wt.OTHER, this.serverKey = e.serverKey, this.state = gt.UNISSUED, this.deferred = void 0, this.cancelled = !1;
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
function _t(e) {
	I.typeOf.object("options", e), I.defined("options.comparator", e.comparator), this._comparator = e.comparator, this._array = [], this._length = 0, this._maximumLength = void 0;
}
function xt(e, t, r) {
	const n = e[t];
	e[t] = e[r], e[r] = n;
}
function vt(e) {
	let t;
	this.name = "RuntimeError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
Object.freeze(wt), bt.prototype.cancel = function() {
	this.cancelled = !0;
}, bt.prototype.clone = function(e) {
	return q(e) ? (e.url = this.url, e.requestFunction = this.requestFunction, e.cancelFunction = this.cancelFunction, e.priorityFunction = this.priorityFunction, e.priority = this.priority, e.throttle = this.throttle, e.throttleByServer = this.throttleByServer, e.type = this.type, e.serverKey = this.serverKey, e.state = gt.UNISSUED, e.deferred = void 0, e.cancelled = !1, e) : new bt(this);
}, Ot.prototype.toString = function() {
	let e = "Request has failed.";
	return q(this.statusCode) && (e += ` Status Code: ${this.statusCode}`), e;
}, Object.defineProperties(_t.prototype, {
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
			I.typeOf.number.greaterThanOrEquals("maximumLength", e, 0);
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
}), _t.prototype.reserve = function(e) {
	e = e ?? this._length, this._array.length = e;
}, _t.prototype.heapify = function(e) {
	e = e ?? 0;
	const t = this._length, r = this._comparator, n = this._array;
	let o = -1, i = !0;
	for (; i;) {
		const s = 2 * (e + 1), a = s - 1;
		o = a < t && r(n[a], n[e]) < 0 ? a : e, s < t && r(n[s], n[o]) < 0 && (o = s), o !== e ? (xt(n, o, e), e = o) : i = !1;
	}
}, _t.prototype.resort = function() {
	const e = this._length;
	for (let t = Math.ceil(e / 2); t >= 0; --t) this.heapify(t);
}, _t.prototype.insert = function(e) {
	I.defined("element", e);
	const t = this._array, r = this._comparator, n = this._maximumLength;
	let o, i = this._length++;
	for (i < t.length ? t[i] = e : t.push(e); 0 !== i;) {
		const e = Math.floor((i - 1) / 2);
		if (!(r(t[i], t[e]) < 0)) break;
		xt(t, i, e), i = e;
	}
	return q(n) && this._length > n && (o = t[n], this._length = n), o;
}, _t.prototype.pop = function(e) {
	if (e = e ?? 0, 0 === this._length) return;
	I.typeOf.number.lessThan("index", e, this._length);
	const t = this._array, r = t[e];
	return xt(t, e, --this._length), this.heapify(e), t[this._length] = void 0, r;
}, q(Object.create) && (vt.prototype = Object.create(Error.prototype), vt.prototype.constructor = vt), vt.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return q(this.stack) && (e += `\n${this.stack.toString()}`), e;
};
const Et = {
	numberOfAttemptedRequests: 0,
	numberOfActiveRequests: 0,
	numberOfCancelledRequests: 0,
	numberOfCancelledActiveRequests: 0,
	numberOfFailedRequests: 0,
	numberOfActiveRequestsEver: 0,
	lastNumberOfActiveRequests: 0
};
let St = 20;
const jt = new _t({ comparator: function(e, t) {
	return e.priority - t.priority;
} });
jt.maximumLength = St, jt.reserve(St);
const Tt = [];
let At = {};
const qt = "undefined" != typeof document ? new ut.default(document.location.href) : new ut.default(), Rt = new z();
function It() {}
function Mt(e) {
	q(e.priorityFunction) && (e.priority = e.priorityFunction());
}
function zt(e) {
	return e.state === gt.UNISSUED && (e.state = gt.ISSUED, e.deferred = at()), e.deferred.promise;
}
function Pt(e) {
	const t = zt(e);
	return e.state = gt.ACTIVE, Tt.push(e), ++Et.numberOfActiveRequests, ++Et.numberOfActiveRequestsEver, ++At[e.serverKey], e.requestFunction().then(function(e) {
		return function(t) {
			if (e.state === gt.CANCELLED) return;
			const r = e.deferred;
			--Et.numberOfActiveRequests, --At[e.serverKey], Rt.raiseEvent(), e.state = gt.RECEIVED, e.deferred = void 0, r.resolve(t);
		};
	}(e)).catch(function(e) {
		return function(t) {
			e.state !== gt.CANCELLED && (++Et.numberOfFailedRequests, --Et.numberOfActiveRequests, --At[e.serverKey], Rt.raiseEvent(t), e.state = gt.FAILED, e.deferred.reject(t));
		};
	}(e)), t;
}
function Ct(e) {
	const t = e.state === gt.ACTIVE;
	if (e.state = gt.CANCELLED, ++Et.numberOfCancelledRequests, q(e.deferred)) {
		const t = e.deferred;
		t.promise.catch(() => {}), e.deferred = void 0, t.reject(new vt(`Request cancelled: "${e.url}"`));
	}
	t && (--Et.numberOfActiveRequests, --At[e.serverKey], ++Et.numberOfCancelledActiveRequests), q(e.cancelFunction) && e.cancelFunction();
}
It.maximumRequests = 50, It.maximumRequestsPerServer = 18, It.requestsByServer = {}, It.throttleRequests = !0, It.debugShowStatistics = !1, It.requestCompletedEvent = Rt, Object.defineProperties(It, {
	statistics: { get: function() {
		return Et;
	} },
	priorityHeapLength: {
		get: function() {
			return St;
		},
		set: function(e) {
			if (e < St) for (; jt.length > e;) Ct(jt.pop());
			St = e, jt.maximumLength = e, jt.reserve(e);
		}
	}
}), It.serverHasOpenSlots = function(e, t) {
	t = t ?? 1;
	const r = It.requestsByServer[e] ?? It.maximumRequestsPerServer;
	return At[e] + t <= r;
}, It.heapHasOpenSlots = function(e) {
	return jt.length + e <= St;
}, It.update = function() {
	let e, t, r = 0;
	const n = Tt.length;
	for (e = 0; e < n; ++e) t = Tt[e], t.cancelled && Ct(t), t.state === gt.ACTIVE ? r > 0 && (Tt[e - r] = t) : ++r;
	Tt.length -= r;
	const o = jt.internalArray, i = jt.length;
	for (e = 0; e < i; ++e) Mt(o[e]);
	jt.resort();
	const s = Math.max(It.maximumRequests - Tt.length, 0);
	let a = 0;
	for (; a < s && jt.length > 0;) t = jt.pop(), t.cancelled ? Ct(t) : !t.throttleByServer || It.serverHasOpenSlots(t.serverKey) ? (Pt(t), ++a) : Ct(t);
	It.debugShowStatistics && (0 === Et.numberOfActiveRequests && Et.lastNumberOfActiveRequests > 0 && (Et.numberOfAttemptedRequests > 0 && (console.log(`Number of attempted requests: ${Et.numberOfAttemptedRequests}`), Et.numberOfAttemptedRequests = 0), Et.numberOfCancelledRequests > 0 && (console.log(`Number of cancelled requests: ${Et.numberOfCancelledRequests}`), Et.numberOfCancelledRequests = 0), Et.numberOfCancelledActiveRequests > 0 && (console.log(`Number of cancelled active requests: ${Et.numberOfCancelledActiveRequests}`), Et.numberOfCancelledActiveRequests = 0), Et.numberOfFailedRequests > 0 && (console.log(`Number of failed requests: ${Et.numberOfFailedRequests}`), Et.numberOfFailedRequests = 0)), Et.lastNumberOfActiveRequests = Et.numberOfActiveRequests);
}, It.getServerKey = function(e) {
	I.typeOf.string("url", e);
	let t = new ut.default(e);
	"" === t.scheme() && (t = t.absoluteTo(qt), t.normalize());
	let r = t.authority();
	return /:/.test(r) || (r = `${r}:${"https" === t.scheme() ? "443" : "80"}`), q(At[r]) || (At[r] = 0), r;
}, It.request = function(e) {
	if (I.typeOf.object("request", e), I.typeOf.string("request.url", e.url), I.typeOf.func("request.requestFunction", e.requestFunction), yt(e.url) || pt(e.url)) return Rt.raiseEvent(), e.state = gt.RECEIVED, e.requestFunction();
	if (++Et.numberOfAttemptedRequests, q(e.serverKey) || (e.serverKey = It.getServerKey(e.url)), It.throttleRequests && e.throttleByServer && !It.serverHasOpenSlots(e.serverKey)) return;
	if (!It.throttleRequests || !e.throttle) return Pt(e);
	if (Tt.length >= It.maximumRequests) return;
	Mt(e);
	const t = jt.insert(e);
	if (q(t)) {
		if (t === e) return;
		Ct(t);
	}
	return zt(e);
}, It.clearForSpecs = function() {
	for (; jt.length > 0;) Ct(jt.pop());
	const e = Tt.length;
	for (let t = 0; t < e; ++t) Ct(Tt[t]);
	Tt.length = 0, At = {}, Et.numberOfAttemptedRequests = 0, Et.numberOfActiveRequests = 0, Et.numberOfCancelledRequests = 0, Et.numberOfCancelledActiveRequests = 0, Et.numberOfFailedRequests = 0, Et.numberOfActiveRequestsEver = 0, Et.lastNumberOfActiveRequests = 0;
}, It.numberOfActiveRequestsByServer = function(e) {
	return At[e];
}, It.requestHeap = jt;
const Nt = {};
let Ut = {};
Nt.add = function(e, t) {
	if (!q(e)) throw new R("host is required.");
	if (!q(t) || t <= 0) throw new R("port is required to be greater than 0.");
	const r = `${e.toLowerCase()}:${t}`;
	q(Ut[r]) || (Ut[r] = !0);
}, Nt.remove = function(e, t) {
	if (!q(e)) throw new R("host is required.");
	if (!q(t) || t <= 0) throw new R("port is required to be greater than 0.");
	const r = `${e.toLowerCase()}:${t}`;
	q(Ut[r]) && delete Ut[r];
}, Nt.contains = function(e) {
	if (!q(e)) throw new R("url is required.");
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
	return !(!q(t) || !q(Ut[t]));
}, Nt.clear = function() {
	Ut = {};
};
const Dt = function() {
	try {
		const e = new XMLHttpRequest();
		return e.open("GET", "#", !0), e.responseType = "blob", "blob" === e.responseType;
	} catch (e) {
		return !1;
	}
}();
function kt(e) {
	"string" == typeof (e = e ?? A.EMPTY_OBJECT) && (e = { url: e }), I.typeOf.string("options.url", e.url), this._url = void 0, this._templateValues = Lt(e.templateValues, {}), this._queryParameters = Lt(e.queryParameters, {}), this.headers = Lt(e.headers, {}), this.request = e.request ?? new bt(), this.proxy = e.proxy, this.retryCallback = e.retryCallback, this.retryAttempts = e.retryAttempts ?? 0, this._retryCount = 0, e.parseUrl ?? 1 ? this.parseUrl(e.url, !0, !0) : this._url = e.url, this._credits = e.credits;
}
function Lt(e, t) {
	return q(e) ? it(e) : t;
}
let Ft;
function Wt(e, t, r) {
	if (!r) return st(e, t);
	const n = it(e, !0);
	for (const o in t) if (t.hasOwnProperty(o)) {
		let e = n[o];
		const r = t[o];
		q(e) ? (Array.isArray(e) || (e = n[o] = [e]), n[o] = e.concat(r)) : n[o] = Array.isArray(r) ? r.slice() : r;
	}
	return n;
}
function Bt(e, t, r) {
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
		}, kt._Implementations.loadAndExecuteScript(i, r, e), e.promise;
	};
	const s = It.request(o);
	if (q(s)) return s.catch(function(n) {
		return o.state !== gt.FAILED ? Promise.reject(n) : e.retryOnError(n).then(function(i) {
			return i ? (o.state = gt.UNISSUED, o.deferred = void 0, Bt(e, t, r)) : Promise.reject(n);
		});
	});
}
function $t(e) {
	if (e.state === gt.ISSUED || e.state === gt.ACTIVE) throw new vt("The Resource is already being fetched.");
	e.state = gt.UNISSUED, e.deferred = void 0;
}
kt.createIfNeeded = function(e) {
	return e instanceof kt ? e.getDerivedResource({ request: e.request }) : "string" != typeof e ? e : new kt({ url: e });
}, kt.supportsImageBitmapOptions = function() {
	return q(Ft) ? Ft : "function" != typeof createImageBitmap ? (Ft = Promise.resolve(!1), Ft) : (Ft = kt.fetchBlob({ url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABGdBTUEAAE4g3rEiDgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAADElEQVQI12Ng6GAAAAEUAIngE3ZiAAAAAElFTkSuQmCC" }).then(function(e) {
		return Promise.all([createImageBitmap(e, {
			imageOrientation: "flipY",
			premultiplyAlpha: "none",
			colorSpaceConversion: "none"
		}), createImageBitmap(e)]);
	}).then(function(e) {
		const t = ht(e[0]), r = ht(e[1]);
		return t[1] !== r[1];
	}).catch(function() {
		return !1;
	}), Ft);
}, Object.defineProperties(kt, { isBlobSupported: { get: function() {
	return Dt;
} } }), Object.defineProperties(kt.prototype, {
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
			if (!q(e)) throw new R("uri is required.");
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
			q(dt) || (dt = document.createElement("a")), dt.href = window.location.href;
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
}), kt.prototype.toString = function() {
	return this.getUrlComponent(!0, !0);
}, kt.prototype.parseUrl = function(e, t, r, n) {
	let o = new ut.default(e);
	const i = 0 === (s = o.query()).length ? {} : -1 === s.indexOf("=") ? { [s]: void 0 } : function(e) {
		if (!q(e)) throw new R("queryString is required.");
		const t = {};
		if ("" === e) return t;
		const r = e.replace(/\+/g, "%20").split(/[&;]/);
		for (let n = 0, o = r.length; n < o; ++n) {
			const e = r[n].split("="), o = decodeURIComponent(e[0]);
			let i = e[1];
			i = q(i) ? decodeURIComponent(i) : "";
			const s = t[o];
			"string" == typeof s ? t[o] = [s, i] : Array.isArray(s) ? s.push(i) : t[o] = i;
		}
		return t;
	}(s);
	var s;
	this._queryParameters = t ? Wt(i, this.queryParameters, r) : i, o.search(""), o.fragment(""), q(n) && "" === o.scheme() && (o = o.absoluteTo(ct(n))), this._url = o.toString();
}, kt.prototype.getUrlComponent = function(e, t) {
	if (this.isDataUri) return this._url;
	let r = this._url;
	e && (r = `${r}${function(e) {
		const t = Object.keys(e);
		return 0 === t.length ? "" : 1 !== t.length || q(e[t[0]]) ? `?${function(e) {
			if (!q(e)) throw new R("obj is required.");
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
		return q(r) ? encodeURIComponent(r) : e;
	})), t && q(this.proxy) && (r = this.proxy.getURL(r)), r;
}, kt.prototype.setQueryParameters = function(e, t) {
	this._queryParameters = t ? Wt(this._queryParameters, e, !1) : Wt(e, this._queryParameters, !1);
}, kt.prototype.appendQueryParameters = function(e) {
	this._queryParameters = Wt(e, this._queryParameters, !0);
}, kt.prototype.setTemplateValues = function(e, t) {
	this._templateValues = t ? st(this._templateValues, e) : st(e, this._templateValues);
}, kt.prototype.getDerivedResource = function(e) {
	const t = this.clone();
	if (t._retryCount = 0, q(e.url)) {
		const r = e.preserveQueryParameters ?? !1;
		t.parseUrl(e.url, !0, r, this._url);
	}
	return q(e.queryParameters) && (t._queryParameters = st(e.queryParameters, t.queryParameters)), q(e.templateValues) && (t._templateValues = st(e.templateValues, t.templateValues)), q(e.headers) && (t.headers = st(e.headers, t.headers)), q(e.proxy) && (t.proxy = e.proxy), q(e.request) && (t.request = e.request), q(e.retryCallback) && (t.retryCallback = e.retryCallback), q(e.retryAttempts) && (t.retryAttempts = e.retryAttempts), t;
}, kt.prototype.retryOnError = function(e) {
	const t = this.retryCallback;
	if ("function" != typeof t || this._retryCount >= this.retryAttempts) return Promise.resolve(!1);
	const r = this;
	return Promise.resolve(t(this, e)).then(function(e) {
		return ++r._retryCount, e;
	});
}, kt.prototype.clone = function(e) {
	return q(e) ? (e._url = this._url, e._queryParameters = it(this._queryParameters), e._templateValues = it(this._templateValues), e.headers = it(this.headers), e.proxy = this.proxy, e.retryCallback = this.retryCallback, e.retryAttempts = this.retryAttempts, e._retryCount = 0, e.request = this.request.clone(), e) : new kt({
		url: this._url,
		queryParameters: this.queryParameters,
		templateValues: this.templateValues,
		headers: this.headers,
		proxy: this.proxy,
		retryCallback: this.retryCallback,
		retryAttempts: this.retryAttempts,
		request: this.request.clone(),
		parseUrl: !1,
		credits: q(this.credits) ? this.credits.slice() : void 0
	});
}, kt.prototype.getBaseUri = function(e) {
	return function(e, t) {
		if (!q(e)) throw new R("uri is required.");
		let r = "";
		const n = e.lastIndexOf("/");
		return -1 !== n && (r = e.substring(0, n + 1)), t ? (0 !== (e = new ut.default(e)).query().length && (r += `?${e.query()}`), 0 !== e.fragment().length && (r += `#${e.fragment()}`), r) : r;
	}(this.getUrlComponent(e), e);
}, kt.prototype.appendForwardSlash = function() {
	var e;
	this._url = (0 !== (e = this._url).length && "/" === e[e.length - 1] || (e = `${e}/`), e);
}, kt.prototype.fetchArrayBuffer = function() {
	return this.fetch({ responseType: "arraybuffer" });
}, kt.fetchArrayBuffer = function(e) {
	return new kt(e).fetchArrayBuffer();
}, kt.prototype.fetchBlob = function() {
	return this.fetch({ responseType: "blob" });
}, kt.fetchBlob = function(e) {
	return new kt(e).fetchBlob();
}, kt.prototype.fetchImage = function(e) {
	const t = (e = e ?? A.EMPTY_OBJECT).preferImageBitmap ?? !1, r = e.preferBlob ?? !1, n = e.flipY ?? !1, o = e.skipColorSpaceConversion ?? !1;
	if ($t(this.request), !Dt || this.isDataUri || this.isBlobUri || !this.hasHeaders && !r) return this._fetchImage({
		resource: this,
		flipY: n,
		skipColorSpaceConversion: o,
		preferImageBitmap: t
	});
	const i = this.fetchBlob();
	if (!q(i)) return;
	let s, a, u, c;
	return kt.supportsImageBitmapOptions().then(function(e) {
		return s = e, a = s && t, i;
	}).then(function(e) {
		if (q(e)) return c = e, a ? kt.createImageBitmapFromBlob(e, {
			flipY: n,
			premultiplyAlpha: !1,
			skipColorSpaceConversion: o
		}) : (u = new kt({ url: window.URL.createObjectURL(e) }), u._fetchImage({
			flipY: n,
			skipColorSpaceConversion: o,
			preferImageBitmap: !1
		}));
	}).then(function(e) {
		if (q(e)) return e.blob = c, a || window.URL.revokeObjectURL(u.url), e;
	}).catch(function(e) {
		return q(u) && window.URL.revokeObjectURL(u.url), e.blob = c, Promise.reject(e);
	});
}, kt.prototype._fetchImage = function(e) {
	const t = this, r = e.flipY, n = e.skipColorSpaceConversion, o = e.preferImageBitmap, i = t.request;
	i.url = t.url, i.requestFunction = function() {
		let e = !1;
		t.isDataUri || t.isBlobUri || (e = t.isCrossOriginUrl);
		const s = at();
		return kt._Implementations.createImage(i, e, s, r, n, o), s.promise;
	};
	const s = It.request(i);
	if (q(s)) return s.catch(function(e) {
		return i.state !== gt.FAILED ? Promise.reject(e) : t.retryOnError(e).then(function(s) {
			return s ? (i.state = gt.UNISSUED, i.deferred = void 0, t._fetchImage({
				flipY: r,
				skipColorSpaceConversion: n,
				preferImageBitmap: o
			})) : Promise.reject(e);
		});
	});
}, kt.fetchImage = function(e) {
	return new kt(e).fetchImage({
		flipY: e.flipY,
		skipColorSpaceConversion: e.skipColorSpaceConversion,
		preferBlob: e.preferBlob,
		preferImageBitmap: e.preferImageBitmap
	});
}, kt.prototype.fetchText = function() {
	return this.fetch({ responseType: "text" });
}, kt.fetchText = function(e) {
	return new kt(e).fetchText();
}, kt.prototype.fetchJson = function() {
	const e = this.fetch({
		responseType: "text",
		headers: { Accept: "application/json,*/*;q=0.01" }
	});
	if (q(e)) return e.then(function(e) {
		if (q(e)) return JSON.parse(e);
	});
}, kt.fetchJson = function(e) {
	return new kt(e).fetchJson();
}, kt.prototype.fetchXML = function() {
	return this.fetch({
		responseType: "document",
		overrideMimeType: "text/xml"
	});
}, kt.fetchXML = function(e) {
	return new kt(e).fetchXML();
}, kt.prototype.fetchJsonp = function(e) {
	let t;
	e = e ?? "callback", $t(this.request);
	do
		t = `loadJsonp${U.nextRandomNumber().toString().substring(2, 8)}`;
	while (q(window[t]));
	return Bt(this, e, t);
}, kt.fetchJsonp = function(e) {
	return new kt(e).fetchJsonp(e.callbackParameterName);
}, kt.prototype._makeRequest = function(e) {
	const t = this;
	$t(t.request);
	const r = t.request, n = t.url;
	r.url = n, r.requestFunction = function() {
		const o = e.responseType, i = st(e.headers, t.headers), s = e.overrideMimeType, a = e.method, u = e.data, c = at(), l = kt._Implementations.loadWithXhr(n, o, a, u, i, c, s);
		return q(l) && q(l.abort) && (r.cancelFunction = function() {
			l.abort();
		}), c.promise;
	};
	const o = It.request(r);
	if (q(o)) return o.then(function(e) {
		return r.cancelFunction = void 0, e;
	}).catch(function(n) {
		return r.cancelFunction = void 0, r.state !== gt.FAILED ? Promise.reject(n) : t.retryOnError(n).then(function(o) {
			return o ? (r.state = gt.UNISSUED, r.deferred = void 0, t.fetch(e)) : Promise.reject(n);
		});
	});
};
const Vt = /^data:(.*?)(;base64)?,(.*)$/;
function Qt(e, t) {
	const r = decodeURIComponent(t);
	return e ? atob(r) : r;
}
function Ht(e, t) {
	const r = Qt(e, t), n = new ArrayBuffer(r.length), o = new Uint8Array(n);
	for (let i = 0; i < r.length; i++) o[i] = r.charCodeAt(i);
	return n;
}
kt.prototype.fetch = function(e) {
	return (e = Lt(e, {})).method = "GET", this._makeRequest(e);
}, kt.fetch = function(e) {
	return new kt(e).fetch({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, kt.prototype.delete = function(e) {
	return (e = Lt(e, {})).method = "DELETE", this._makeRequest(e);
}, kt.delete = function(e) {
	return new kt(e).delete({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType,
		data: e.data
	});
}, kt.prototype.head = function(e) {
	return (e = Lt(e, {})).method = "HEAD", this._makeRequest(e);
}, kt.head = function(e) {
	return new kt(e).head({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, kt.prototype.options = function(e) {
	return (e = Lt(e, {})).method = "OPTIONS", this._makeRequest(e);
}, kt.options = function(e) {
	return new kt(e).options({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, kt.prototype.post = function(e, t) {
	return I.defined("data", e), (t = Lt(t, {})).method = "POST", t.data = e, this._makeRequest(t);
}, kt.post = function(e) {
	return new kt(e).post(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, kt.prototype.put = function(e, t) {
	return I.defined("data", e), (t = Lt(t, {})).method = "PUT", t.data = e, this._makeRequest(t);
}, kt.put = function(e) {
	return new kt(e).put(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, kt.prototype.patch = function(e, t) {
	return I.defined("data", e), (t = Lt(t, {})).method = "PATCH", t.data = e, this._makeRequest(t);
}, kt.patch = function(e) {
	return new kt(e).patch(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, kt._Implementations = {}, kt._Implementations.loadImageElement = function(e, t, r) {
	const n = new Image();
	n.onload = function() {
		0 === n.naturalWidth && 0 === n.naturalHeight && 0 === n.width && 0 === n.height && (n.width = 300, n.height = 150), r.resolve(n);
	}, n.onerror = function(e) {
		r.reject(e);
	}, t && (Nt.contains(e) ? n.crossOrigin = "use-credentials" : n.crossOrigin = ""), n.src = e;
}, kt._Implementations.createImage = function(e, t, r, n, o, i, s) {
	const a = e.url;
	kt.supportsImageBitmapOptions().then(function(u) {
		if (!u || !i) return void kt._Implementations.loadImageElement(a, t, r);
		const c = at(), l = kt._Implementations.loadWithXhr(a, "blob", "GET", void 0, s, c, void 0, void 0, void 0);
		return q(l) && q(l.abort) && (e.cancelFunction = function() {
			l.abort();
		}), c.promise.then(function(e) {
			if (q(e)) return kt.createImageBitmapFromBlob(e, {
				flipY: n,
				premultiplyAlpha: !1,
				skipColorSpaceConversion: o
			});
			r.reject(new vt(`Successfully retrieved ${a} but it contained no content.`));
		}).then(function(e) {
			r.resolve(e);
		});
	}).catch(function(e) {
		r.reject(e);
	});
}, kt.createImageBitmapFromBlob = function(e, t) {
	return I.defined("options", t), I.typeOf.bool("options.flipY", t.flipY), I.typeOf.bool("options.premultiplyAlpha", t.premultiplyAlpha), I.typeOf.bool("options.skipColorSpaceConversion", t.skipColorSpaceConversion), createImageBitmap(e, {
		imageOrientation: t.flipY ? "flipY" : "none",
		premultiplyAlpha: t.premultiplyAlpha ? "premultiply" : "none",
		colorSpaceConversion: t.skipColorSpaceConversion ? "none" : "default"
	});
};
const Gt = "undefined" == typeof XMLHttpRequest;
function Yt(e) {
	e = e ?? A.EMPTY_OBJECT, this._dates = void 0, this._samples = void 0, this._dateColumn = -1, this._xPoleWanderRadiansColumn = -1, this._yPoleWanderRadiansColumn = -1, this._ut1MinusUtcSecondsColumn = -1, this._xCelestialPoleOffsetRadiansColumn = -1, this._yCelestialPoleOffsetRadiansColumn = -1, this._taiMinusUtcSecondsColumn = -1, this._columnCount = 0, this._lastIndex = -1, this._addNewLeapSeconds = e.addNewLeapSeconds ?? !0, q(e.data) ? Xt(this, e.data) : Xt(this, {
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
	return Ke.compare(e.julianDate, t);
}
function Xt(e, t) {
	if (!q(t.columnNames)) throw new vt("Error in loaded EOP data: The columnNames property is required.");
	if (!q(t.samples)) throw new vt("Error in loaded EOP data: The samples property is required.");
	const r = t.columnNames.indexOf("modifiedJulianDateUtc"), n = t.columnNames.indexOf("xPoleWanderRadians"), o = t.columnNames.indexOf("yPoleWanderRadians"), i = t.columnNames.indexOf("ut1MinusUtcSeconds"), s = t.columnNames.indexOf("xCelestialPoleOffsetRadians"), a = t.columnNames.indexOf("yCelestialPoleOffsetRadians"), u = t.columnNames.indexOf("taiMinusUtcSeconds");
	if (r < 0 || n < 0 || o < 0 || i < 0 || s < 0 || a < 0 || u < 0) throw new vt("Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns");
	const c = e._samples = t.samples, l = e._dates = [];
	let h;
	e._dateColumn = r, e._xPoleWanderRadiansColumn = n, e._yPoleWanderRadiansColumn = o, e._ut1MinusUtcSecondsColumn = i, e._xCelestialPoleOffsetRadiansColumn = s, e._yCelestialPoleOffsetRadiansColumn = a, e._taiMinusUtcSecondsColumn = u, e._columnCount = t.columnNames.length, e._lastIndex = void 0;
	const f = e._addNewLeapSeconds;
	for (let p = 0, d = c.length; p < d; p += e._columnCount) {
		const e = c[p + r], t = c[p + u], n = new Ke(e + ze.MODIFIED_JULIAN_DATE_DIFFERENCE, t, Pe.TAI);
		if (l.push(n), f) {
			if (t !== h && q(h)) {
				const e = Ke.leapSeconds, r = Te(e, n, Zt);
				if (r < 0) {
					const o = new Me(n, t);
					e.splice(~r, 0, o);
				}
			}
			h = t;
		}
	}
}
function Jt(e, t, r, n, o) {
	const i = r * n;
	o.xPoleWander = t[i + e._xPoleWanderRadiansColumn], o.yPoleWander = t[i + e._yPoleWanderRadiansColumn], o.xPoleOffset = t[i + e._xCelestialPoleOffsetRadiansColumn], o.yPoleOffset = t[i + e._yCelestialPoleOffsetRadiansColumn], o.ut1MinusUtc = t[i + e._ut1MinusUtcSecondsColumn];
}
function Kt(e, t, r) {
	return t + e * (r - t);
}
function er(e, t, r, n, o, i, s) {
	const a = e._columnCount;
	if (i > t.length - 1) return s.xPoleWander = 0, s.yPoleWander = 0, s.xPoleOffset = 0, s.yPoleOffset = 0, s.ut1MinusUtc = 0, s;
	const u = t[o], c = t[i];
	if (u.equals(c) || n.equals(u)) return Jt(e, r, o, a, s), s;
	if (n.equals(c)) return Jt(e, r, i, a, s), s;
	const l = Ke.secondsDifference(n, u) / Ke.secondsDifference(c, u), h = o * a, f = i * a;
	let p = r[h + e._ut1MinusUtcSecondsColumn], d = r[f + e._ut1MinusUtcSecondsColumn];
	const m = d - p;
	if (m > .5 || m < -.5) {
		const t = r[h + e._taiMinusUtcSecondsColumn], o = r[f + e._taiMinusUtcSecondsColumn];
		t !== o && (c.equals(n) ? p = d : d -= o - t);
	}
	return s.xPoleWander = Kt(l, r[h + e._xPoleWanderRadiansColumn], r[f + e._xPoleWanderRadiansColumn]), s.yPoleWander = Kt(l, r[h + e._yPoleWanderRadiansColumn], r[f + e._yPoleWanderRadiansColumn]), s.xPoleOffset = Kt(l, r[h + e._xCelestialPoleOffsetRadiansColumn], r[f + e._xCelestialPoleOffsetRadiansColumn]), s.yPoleOffset = Kt(l, r[h + e._yCelestialPoleOffsetRadiansColumn], r[f + e._yCelestialPoleOffsetRadiansColumn]), s.ut1MinusUtc = Kt(l, p, d), s;
}
function tr(e, t, r) {
	this.heading = e ?? 0, this.pitch = t ?? 0, this.roll = r ?? 0;
}
kt._Implementations.loadWithXhr = function(e, t, r, n, o, i, s) {
	const a = Vt.exec(e);
	if (null !== a) return void i.resolve(function(e, t) {
		t = t ?? "";
		const r = e[1], n = !!e[2], o = e[3];
		let i, s;
		switch (t) {
			case "":
			case "text": return Qt(n, o);
			case "arraybuffer": return Ht(n, o);
			case "blob": return i = Ht(n, o), new Blob([i], { type: r });
			case "document": return s = new DOMParser(), s.parseFromString(Qt(n, o), r);
			case "json": return JSON.parse(Qt(n, o));
			default: throw new R(`Unhandled responseType: ${t}`);
		}
	}(a, t));
	if (Gt) return void function(e, t, r, n, o, i) {
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
	if (Nt.contains(e) && (u.withCredentials = !0), u.open(r, e, !0), q(s) && q(u.overrideMimeType) && u.overrideMimeType(s), q(o)) for (const l in o) o.hasOwnProperty(l) && u.setRequestHeader(l, o[l]);
	q(t) && (u.responseType = t);
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
		else if (!q(e) || q(t) && n !== t) if ("json" === t && "string" == typeof e) try {
			i.resolve(JSON.parse(e));
		} catch (e) {
			i.reject(e);
		}
		else ("" === n || "document" === n) && q(u.responseXML) && u.responseXML.hasChildNodes() ? i.resolve(u.responseXML) : "" !== n && "text" !== n || !q(u.responseText) ? i.reject(new vt("Invalid XMLHttpRequest response type.")) : i.resolve(u.responseText);
		else i.resolve(e);
	}, u.onerror = function(e) {
		i.reject(new Ot());
	}, u.send(n), u;
}, kt._Implementations.loadAndExecuteScript = function(e, t, r) {
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
}, kt._DefaultImplementations = {}, kt._DefaultImplementations.createImage = kt._Implementations.createImage, kt._DefaultImplementations.loadWithXhr = kt._Implementations.loadWithXhr, kt._DefaultImplementations.loadAndExecuteScript = kt._Implementations.loadAndExecuteScript, kt.DEFAULT = Object.freeze(new kt({ url: "undefined" == typeof document ? "" : document.location.href.split("?")[0] })), Yt.fromUrl = async function(e, t) {
	I.defined("url", e), t = t ?? A.EMPTY_OBJECT;
	const r = kt.createIfNeeded(e);
	let n;
	try {
		n = await r.fetchJson();
	} catch (e) {
		throw new vt(`An error occurred while retrieving the EOP data from the URL ${r.url}.`);
	}
	return new Yt({
		addNewLeapSeconds: t.addNewLeapSeconds,
		data: n
	});
}, Yt.NONE = Object.freeze({ compute: function(e, t) {
	return q(t) ? (t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0) : t = new Ae(0, 0, 0, 0, 0), t;
} }), Yt.prototype.compute = function(e, t) {
	if (!q(this._samples)) return;
	if (q(t) || (t = new Ae(0, 0, 0, 0, 0)), 0 === this._samples.length) return t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0, t;
	const r = this._dates, n = this._lastIndex;
	let o = 0, i = 0;
	if (q(n)) {
		const s = r[n], a = r[n + 1], u = Ke.lessThanOrEquals(s, e), c = !q(a), l = c || Ke.greaterThanOrEquals(a, e);
		if (u && l) return o = n, !c && a.equals(e) && ++o, i = o + 1, er(this, r, this._samples, e, o, i, t), t;
	}
	let s = Te(r, e, Ke.compare, this._dateColumn);
	return s >= 0 ? (s < r.length - 1 && r[s + 1].equals(e) && ++s, o = s, i = s) : (i = ~s, o = i - 1, o < 0 && (o = 0)), this._lastIndex = o, er(this, r, this._samples, e, o, i, t), t;
}, tr.fromQuaternion = function(e, t) {
	if (!q(e)) throw new R("quaternion is required");
	q(t) || (t = new tr());
	const r = 2 * (e.w * e.y - e.z * e.x), n = 1 - 2 * (e.x * e.x + e.y * e.y), o = 2 * (e.w * e.x + e.y * e.z), i = 1 - 2 * (e.y * e.y + e.z * e.z), s = 2 * (e.w * e.z + e.x * e.y);
	return t.heading = -Math.atan2(s, i), t.roll = Math.atan2(o, n), t.pitch = -U.asinClamped(r), t;
}, tr.fromDegrees = function(e, t, r, n) {
	if (!q(e)) throw new R("heading is required");
	if (!q(t)) throw new R("pitch is required");
	if (!q(r)) throw new R("roll is required");
	return q(n) || (n = new tr()), n.heading = e * U.RADIANS_PER_DEGREE, n.pitch = t * U.RADIANS_PER_DEGREE, n.roll = r * U.RADIANS_PER_DEGREE, n;
}, tr.clone = function(e, t) {
	if (q(e)) return q(t) ? (t.heading = e.heading, t.pitch = e.pitch, t.roll = e.roll, t) : new tr(e.heading, e.pitch, e.roll);
}, tr.equals = function(e, t) {
	return e === t || q(e) && q(t) && e.heading === t.heading && e.pitch === t.pitch && e.roll === t.roll;
}, tr.equalsEpsilon = function(e, t, r, n) {
	return e === t || q(e) && q(t) && U.equalsEpsilon(e.heading, t.heading, r, n) && U.equalsEpsilon(e.pitch, t.pitch, r, n) && U.equalsEpsilon(e.roll, t.roll, r, n);
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
	return "undefined" == typeof document ? e : (q(nr) || (nr = document.createElement("a")), nr.href = e, nr.href);
}
function ar() {
	if (q(or)) return or;
	let e;
	if (e = "undefined" != typeof CESIUM_BASE_URL ? CESIUM_BASE_URL : q(import.meta.url) ? ct(".", import.meta.url) : "object" == typeof define && q(define.amd) && !define.amd.toUrlUndefined && q(u.toUrl) ? ct("..", lr("Core/buildModuleUrl.js")) : function() {
		const e = document.getElementsByTagName("script");
		for (let t = 0, r = e.length; t < r; ++t) {
			const r = e[t].getAttribute("src"), n = rr.exec(r);
			if (null !== n) return n[1];
		}
	}(), !q(e)) throw new R("Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.");
	return or = new kt({ url: sr(e) }), or.appendForwardSlash(), or;
}
function ur(e) {
	return sr(u.toUrl(`../${e}`));
}
function cr(e) {
	return ar().getDerivedResource({ url: e }).url;
}
function lr(e) {
	return q(ir) || (ir = "object" == typeof define && q(define.amd) && !define.amd.toUrlUndefined && q(u.toUrl) ? ur : cr), ir(e);
}
function hr(e, t, r) {
	this.x = e, this.y = t, this.s = r;
}
function fr(e) {
	e = e ?? A.EMPTY_OBJECT, this._xysFileUrlTemplate = kt.createIfNeeded(e.xysFileUrlTemplate), this._interpolationOrder = e.interpolationOrder ?? 9, this._sampleZeroJulianEphemerisDate = e.sampleZeroJulianEphemerisDate ?? 2442396.5, this._sampleZeroDateTT = new Ke(this._sampleZeroJulianEphemerisDate, 0, Pe.TAI), this._stepSizeDays = e.stepSizeDays ?? 1, this._samplesPerXysFile = e.samplesPerXysFile ?? 1e3, this._totalSamples = e.totalSamples ?? 27426, this._samples = new Array(3 * this._totalSamples), this._chunkDownloadsInProgress = [];
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
	or = kt.DEFAULT.getDerivedResource({ url: e });
}, lr.getCesiumBaseUrl = ar;
const pr = new Ke(0, 0, Pe.TAI);
function dr(e, t, r) {
	const n = pr;
	return n.dayNumber = t, n.secondsOfDay = r, Ke.daysDifference(n, e._sampleZeroDateTT);
}
function mr(e, t) {
	if (q(e._chunkDownloadsInProgress[t])) return e._chunkDownloadsInProgress[t];
	let r;
	const n = e._xysFileUrlTemplate;
	r = q(n) ? n.getDerivedResource({ templateValues: { 0: t } }) : new kt({ url: lr(`Assets/IAU2006_XYS/IAU2006_XYS_${t}.json`) });
	const o = async function(e, t, r) {
		try {
			const n = await e.fetchJson();
			r._updateChunkData(t, n);
		} catch (e) {}
	}(r, t, e);
	return e._chunkDownloadsInProgress[t] = o, o;
}
fr.prototype.preload = function(e, t, r, n) {
	const o = dr(this, e, t), i = dr(this, r, n);
	let s = o / this._stepSizeDays - this._interpolationOrder / 2 | 0;
	s < 0 && (s = 0);
	let a = i / this._stepSizeDays - this._interpolationOrder / 2 | 0 + this._interpolationOrder;
	a >= this._totalSamples && (a = this._totalSamples - 1);
	const u = s / this._samplesPerXysFile | 0, c = a / this._samplesPerXysFile | 0, l = [];
	for (let h = u; h <= c; ++h) l.push(mr(this, h));
	return Promise.all(l);
}, fr.prototype.computeXysRadians = function(e, t, r) {
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
	if (q(c[3 * s]) || (mr(this, s / this._samplesPerXysFile | 0), u = !0), q(c[3 * a]) || (mr(this, a / this._samplesPerXysFile | 0), u = !0), u) return;
	q(r) ? (r.x = 0, r.y = 0, r.s = 0) : r = new hr(0, 0, 0);
	const l = n - s * this._stepSizeDays, h = this._work, f = this._denominators, p = this._coef, d = this._xTable;
	let m, y;
	for (m = 0; m <= i; ++m) h[m] = l - d[m];
	for (m = 0; m <= i; ++m) {
		for (p[m] = 1, y = 0; y <= i; ++y) y !== m && (p[m] *= h[y]);
		p[m] *= f[m];
		let e = 3 * (s + m);
		r.x += p[m] * c[e++], r.y += p[m] * c[e++], r.s += p[m] * c[e];
	}
	return r;
}, fr.prototype._updateChunkData = function(e, { samples: t }) {
	this._chunkDownloadsInProgress[e] = void 0;
	const r = e * this._samplesPerXysFile * 3;
	for (let n = 0; n < t.length; ++n) this._samples[r + n] = t[n];
};
var yr = class e {
	constructor(e, t, r, n, o, i, s, a, u) {
		this[0] = e ?? 0, this[1] = n ?? 0, this[2] = s ?? 0, this[3] = t ?? 0, this[4] = o ?? 0, this[5] = a ?? 0, this[6] = r ?? 0, this[7] = i ?? 0, this[8] = u ?? 0;
	}
	static pack(e, t, r) {
		return I.typeOf.object("value", e), I.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t;
	}
	static unpack(t, r, n) {
		return I.defined("array", t), r = r ?? 0, q(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n[4] = t[r++], n[5] = t[r++], n[6] = t[r++], n[7] = t[r++], n[8] = t[r++], n;
	}
	static packArray(t, r) {
		I.defined("array", t);
		const n = t.length, o = 9 * n;
		if (q(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new R("If result is a typed array, it must have exactly array.length * 9 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 9 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (I.defined("array", t), I.typeOf.number.greaterThanOrEquals("array.length", t.length, 9), t.length % 9 != 0) throw new R("array length must be a multiple of 9.");
		const n = t.length;
		q(r) ? r.length = n / 9 : r = new Array(n / 9);
		for (let o = 0; o < n; o += 9) {
			const n = o / 9;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (q(t)) return q(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r[6] = t[6], r[7] = t[7], r[8] = t[8], r) : new e(t[0], t[3], t[6], t[1], t[4], t[7], t[2], t[5], t[8]);
	}
	static fromColumnMajorArray(t, r) {
		return I.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return I.defined("values", t), q(r) ? (r[0] = t[0], r[1] = t[3], r[2] = t[6], r[3] = t[1], r[4] = t[4], r[5] = t[7], r[6] = t[2], r[7] = t[5], r[8] = t[8], r) : new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
	}
	static fromQuaternion(t, r) {
		I.typeOf.object("quaternion", t);
		const n = t.x * t.x, o = t.x * t.y, i = t.x * t.z, s = t.x * t.w, a = t.y * t.y, u = t.y * t.z, c = t.y * t.w, l = t.z * t.z, h = t.z * t.w, f = t.w * t.w, p = n - a - l + f, d = 2 * (o - h), m = 2 * (i + c), y = 2 * (o + h), g = -n + a - l + f, w = 2 * (u - s), b = 2 * (i - c), O = 2 * (u + s), _ = -n - a + l + f;
		return q(r) ? (r[0] = p, r[1] = y, r[2] = b, r[3] = d, r[4] = g, r[5] = O, r[6] = m, r[7] = w, r[8] = _, r) : new e(p, d, m, y, g, w, b, O, _);
	}
	static fromHeadingPitchRoll(t, r) {
		I.typeOf.object("headingPitchRoll", t);
		const n = Math.cos(-t.pitch), o = Math.cos(-t.heading), i = Math.cos(t.roll), s = Math.sin(-t.pitch), a = Math.sin(-t.heading), u = Math.sin(t.roll), c = n * o, l = -i * a + u * s * o, h = u * a + i * s * o, f = n * a, p = i * o + u * s * a, d = -u * o + i * s * a, m = -s, y = u * n, g = i * n;
		return q(r) ? (r[0] = c, r[1] = f, r[2] = m, r[3] = l, r[4] = p, r[5] = y, r[6] = h, r[7] = d, r[8] = g, r) : new e(c, l, h, f, p, d, m, y, g);
	}
	static fromScale(t, r) {
		return I.typeOf.object("scale", t), q(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = t.y, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = t.z, r) : new e(t.x, 0, 0, 0, t.y, 0, 0, 0, t.z);
	}
	static fromUniformScale(t, r) {
		return I.typeOf.number("scale", t), q(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = t, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = t, r) : new e(t, 0, 0, 0, t, 0, 0, 0, t);
	}
	static fromCrossProduct(t, r) {
		return I.typeOf.object("vector", t), q(r) ? (r[0] = 0, r[1] = t.z, r[2] = -t.y, r[3] = -t.z, r[4] = 0, r[5] = t.x, r[6] = t.y, r[7] = -t.x, r[8] = 0, r) : new e(0, -t.z, t.y, t.z, 0, -t.x, -t.y, t.x, 0);
	}
	static fromRotationX(t, r) {
		I.typeOf.number("angle", t);
		const n = Math.cos(t), o = Math.sin(t);
		return q(r) ? (r[0] = 1, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = n, r[5] = o, r[6] = 0, r[7] = -o, r[8] = n, r) : new e(1, 0, 0, 0, n, -o, 0, o, n);
	}
	static fromRotationY(t, r) {
		I.typeOf.number("angle", t);
		const n = Math.cos(t), o = Math.sin(t);
		return q(r) ? (r[0] = n, r[1] = 0, r[2] = -o, r[3] = 0, r[4] = 1, r[5] = 0, r[6] = o, r[7] = 0, r[8] = n, r) : new e(n, 0, o, 0, 1, 0, -o, 0, n);
	}
	static fromRotationZ(t, r) {
		I.typeOf.number("angle", t);
		const n = Math.cos(t), o = Math.sin(t);
		return q(r) ? (r[0] = n, r[1] = o, r[2] = 0, r[3] = -o, r[4] = n, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = 1, r) : new e(n, -o, 0, o, n, 0, 0, 0, 1);
	}
	static toArray(e, t) {
		return I.typeOf.object("matrix", e), q(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t) : [
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
		return I.typeOf.number.greaterThanOrEquals("row", t, 0), I.typeOf.number.lessThanOrEquals("row", t, 2), I.typeOf.number.greaterThanOrEquals("column", e, 0), I.typeOf.number.lessThanOrEquals("column", e, 2), 3 * e + t;
	}
	static getColumn(e, t, r) {
		I.typeOf.object("matrix", e), I.typeOf.number.greaterThanOrEquals("index", t, 0), I.typeOf.number.lessThanOrEquals("index", t, 2), I.typeOf.object("result", r);
		const n = 3 * t, o = e[n], i = e[n + 1], s = e[n + 2];
		return r.x = o, r.y = i, r.z = s, r;
	}
	static setColumn(t, r, n, o) {
		I.typeOf.object("matrix", t), I.typeOf.number.greaterThanOrEquals("index", r, 0), I.typeOf.number.lessThanOrEquals("index", r, 2), I.typeOf.object("cartesian", n), I.typeOf.object("result", o);
		const i = 3 * r;
		return (o = e.clone(t, o))[i] = n.x, o[i + 1] = n.y, o[i + 2] = n.z, o;
	}
	static getRow(e, t, r) {
		I.typeOf.object("matrix", e), I.typeOf.number.greaterThanOrEquals("index", t, 0), I.typeOf.number.lessThanOrEquals("index", t, 2), I.typeOf.object("result", r);
		const n = e[t], o = e[t + 3], i = e[t + 6];
		return r.x = n, r.y = o, r.z = i, r;
	}
	static setRow(t, r, n, o) {
		return I.typeOf.object("matrix", t), I.typeOf.number.greaterThanOrEquals("index", r, 0), I.typeOf.number.lessThanOrEquals("index", r, 2), I.typeOf.object("cartesian", n), I.typeOf.object("result", o), (o = e.clone(t, o))[r] = n.x, o[r + 3] = n.y, o[r + 6] = n.z, o;
	}
	static setScale(t, r, n) {
		I.typeOf.object("matrix", t), I.typeOf.object("scale", r), I.typeOf.object("result", n);
		const o = e.getScale(t, gr), i = r.x / o.x, s = r.y / o.y, a = r.z / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3] * s, n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * a, n[7] = t[7] * a, n[8] = t[8] * a, n;
	}
	static setUniformScale(t, r, n) {
		I.typeOf.object("matrix", t), I.typeOf.number("scale", r), I.typeOf.object("result", n);
		const o = e.getScale(t, wr), i = r / o.x, s = r / o.y, a = r / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3] * s, n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * a, n[7] = t[7] * a, n[8] = t[8] * a, n;
	}
	static getScale(e, t) {
		return I.typeOf.object("matrix", e), I.typeOf.object("result", t), t.x = Q.magnitude(Q.fromElements(e[0], e[1], e[2], br)), t.y = Q.magnitude(Q.fromElements(e[3], e[4], e[5], br)), t.z = Q.magnitude(Q.fromElements(e[6], e[7], e[8], br)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, Or), Q.maximumComponent(Or);
	}
	static setRotation(t, r, n) {
		I.typeOf.object("matrix", t), I.typeOf.object("result", n);
		const o = e.getScale(t, _r);
		return n[0] = r[0] * o.x, n[1] = r[1] * o.x, n[2] = r[2] * o.x, n[3] = r[3] * o.y, n[4] = r[4] * o.y, n[5] = r[5] * o.y, n[6] = r[6] * o.z, n[7] = r[7] * o.z, n[8] = r[8] * o.z, n;
	}
	static getRotation(t, r) {
		I.typeOf.object("matrix", t), I.typeOf.object("result", r);
		const n = e.getScale(t, xr);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.x, r[3] = t[3] / n.y, r[4] = t[4] / n.y, r[5] = t[5] / n.y, r[6] = t[6] / n.z, r[7] = t[7] / n.z, r[8] = t[8] / n.z, r;
	}
	static multiply(e, t, r) {
		I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r);
		const n = e[0] * t[0] + e[3] * t[1] + e[6] * t[2], o = e[1] * t[0] + e[4] * t[1] + e[7] * t[2], i = e[2] * t[0] + e[5] * t[1] + e[8] * t[2], s = e[0] * t[3] + e[3] * t[4] + e[6] * t[5], a = e[1] * t[3] + e[4] * t[4] + e[7] * t[5], u = e[2] * t[3] + e[5] * t[4] + e[8] * t[5], c = e[0] * t[6] + e[3] * t[7] + e[6] * t[8], l = e[1] * t[6] + e[4] * t[7] + e[7] * t[8], h = e[2] * t[6] + e[5] * t[7] + e[8] * t[8];
		return r[0] = n, r[1] = o, r[2] = i, r[3] = s, r[4] = a, r[5] = u, r[6] = c, r[7] = l, r[8] = h, r;
	}
	static add(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r[4] = e[4] + t[4], r[5] = e[5] + t[5], r[6] = e[6] + t[6], r[7] = e[7] + t[7], r[8] = e[8] + t[8], r;
	}
	static subtract(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r[4] = e[4] - t[4], r[5] = e[5] - t[5], r[6] = e[6] - t[6], r[7] = e[7] - t[7], r[8] = e[8] - t[8], r;
	}
	static multiplyByVector(e, t, r) {
		I.typeOf.object("matrix", e), I.typeOf.object("cartesian", t), I.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = e[0] * n + e[3] * o + e[6] * i, a = e[1] * n + e[4] * o + e[7] * i, u = e[2] * n + e[5] * o + e[8] * i;
		return r.x = s, r.y = a, r.z = u, r;
	}
	static multiplyByScalar(e, t, r) {
		return I.typeOf.object("matrix", e), I.typeOf.number("scalar", t), I.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r;
	}
	static multiplyByScale(e, t, r) {
		return I.typeOf.object("matrix", e), I.typeOf.object("scale", t), I.typeOf.object("result", r), r[0] = e[0] * t.x, r[1] = e[1] * t.x, r[2] = e[2] * t.x, r[3] = e[3] * t.y, r[4] = e[4] * t.y, r[5] = e[5] * t.y, r[6] = e[6] * t.z, r[7] = e[7] * t.z, r[8] = e[8] * t.z, r;
	}
	static multiplyByUniformScale(e, t, r) {
		return I.typeOf.object("matrix", e), I.typeOf.number("scale", t), I.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r;
	}
	static negate(e, t) {
		return I.typeOf.object("matrix", e), I.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t;
	}
	static transpose(e, t) {
		I.typeOf.object("matrix", e), I.typeOf.object("result", t);
		const r = e[0], n = e[3], o = e[6], i = e[1], s = e[4], a = e[7], u = e[2], c = e[5], l = e[8];
		return t[0] = r, t[1] = n, t[2] = o, t[3] = i, t[4] = s, t[5] = a, t[6] = u, t[7] = c, t[8] = l, t;
	}
	static computeEigenDecomposition(t, r) {
		I.typeOf.object("matrix", t);
		const n = U.EPSILON20;
		let o = 0, i = 0;
		q(r) || (r = {});
		const s = r.unitary = e.clone(e.IDENTITY, r.unitary), a = r.diagonal = e.clone(t, r.diagonal), u = n * function(e) {
			let t = 0;
			for (let r = 0; r < 9; ++r) {
				const n = e[r];
				t += n * n;
			}
			return Math.sqrt(t);
		}(a);
		for (; i < 10 && Ar(a) > u;) qr(a, vr), e.transpose(vr, Er), e.multiply(a, vr, a), e.multiply(Er, a, a), e.multiply(s, vr, s), ++o > 2 && (++i, o = 0);
		return r;
	}
	static abs(e, t) {
		return I.typeOf.object("matrix", e), I.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t;
	}
	static determinant(e) {
		I.typeOf.object("matrix", e);
		const t = e[0], r = e[3], n = e[6], o = e[1], i = e[4], s = e[7], a = e[2], u = e[5], c = e[8];
		return t * (i * c - u * s) + o * (u * n - r * c) + a * (r * s - i * n);
	}
	static inverse(t, r) {
		I.typeOf.object("matrix", t), I.typeOf.object("result", r);
		const n = t[0], o = t[1], i = t[2], s = t[3], a = t[4], u = t[5], c = t[6], l = t[7], h = t[8], f = e.determinant(t);
		if (Math.abs(f) <= U.EPSILON15) throw new R("matrix is not invertible");
		r[0] = a * h - l * u, r[1] = l * i - o * h, r[2] = o * u - a * i, r[3] = c * u - s * h, r[4] = n * h - c * i, r[5] = s * i - n * u, r[6] = s * l - c * a, r[7] = c * o - n * l, r[8] = n * a - s * o;
		const p = 1 / f;
		return e.multiplyByScalar(r, p, r);
	}
	static inverseTranspose(t, r) {
		return I.typeOf.object("matrix", t), I.typeOf.object("result", r), e.inverse(e.transpose(t, Sr), r);
	}
	static equals(e, t) {
		return e === t || q(e) && q(t) && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7] && e[8] === t[8];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || q(e) && q(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r && Math.abs(e[4] - t[4]) <= r && Math.abs(e[5] - t[5]) <= r && Math.abs(e[6] - t[6]) <= r && Math.abs(e[7] - t[7]) <= r && Math.abs(e[8] - t[8]) <= r;
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
const gr = new Q(), wr = new Q(), br = new Q(), Or = new Q(), _r = new Q(), xr = new Q(), vr = new yr(), Er = new yr(), Sr = new yr(), jr = [
	1,
	0,
	0
], Tr = [
	2,
	2,
	1
];
function Ar(e) {
	let t = 0;
	for (let r = 0; r < 3; ++r) {
		const n = e[yr.getElementIndex(Tr[r], jr[r])];
		t += 2 * n * n;
	}
	return Math.sqrt(t);
}
function qr(e, t) {
	const r = U.EPSILON15;
	let n = 0, o = 1;
	for (let c = 0; c < 3; ++c) {
		const t = Math.abs(e[yr.getElementIndex(Tr[c], jr[c])]);
		t > n && (o = c, n = t);
	}
	let i = 1, s = 0;
	const a = jr[o], u = Tr[o];
	if (Math.abs(e[yr.getElementIndex(u, a)]) > r) {
		const t = (e[yr.getElementIndex(u, u)] - e[yr.getElementIndex(a, a)]) / 2 / e[yr.getElementIndex(u, a)];
		let r;
		r = t < 0 ? -1 / (-t + Math.sqrt(1 + t * t)) : 1 / (t + Math.sqrt(1 + t * t)), i = 1 / Math.sqrt(1 + r * r), s = r * i;
	}
	return (t = yr.clone(yr.IDENTITY, t))[yr.getElementIndex(a, a)] = t[yr.getElementIndex(u, u)] = i, t[yr.getElementIndex(u, a)] = s, t[yr.getElementIndex(a, u)] = -s, t;
}
var Rr = class e {
	constructor(e, t, r, n, o, i, s, a, u, c, l, h, f, p, d, m) {
		this[0] = e ?? 0, this[1] = o ?? 0, this[2] = u ?? 0, this[3] = f ?? 0, this[4] = t ?? 0, this[5] = i ?? 0, this[6] = c ?? 0, this[7] = p ?? 0, this[8] = r ?? 0, this[9] = s ?? 0, this[10] = l ?? 0, this[11] = d ?? 0, this[12] = n ?? 0, this[13] = a ?? 0, this[14] = h ?? 0, this[15] = m ?? 0;
	}
	static pack(e, t, r) {
		return I.typeOf.object("value", e), I.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t[r++] = e[9], t[r++] = e[10], t[r++] = e[11], t[r++] = e[12], t[r++] = e[13], t[r++] = e[14], t[r] = e[15], t;
	}
	static unpack(t, r, n) {
		return I.defined("array", t), r = r ?? 0, q(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n[4] = t[r++], n[5] = t[r++], n[6] = t[r++], n[7] = t[r++], n[8] = t[r++], n[9] = t[r++], n[10] = t[r++], n[11] = t[r++], n[12] = t[r++], n[13] = t[r++], n[14] = t[r++], n[15] = t[r], n;
	}
	static packArray(t, r) {
		I.defined("array", t);
		const n = t.length, o = 16 * n;
		if (q(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new R("If result is a typed array, it must have exactly array.length * 16 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 16 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (I.defined("array", t), I.typeOf.number.greaterThanOrEquals("array.length", t.length, 16), t.length % 16 != 0) throw new R("array length must be a multiple of 16.");
		const n = t.length;
		q(r) ? r.length = n / 16 : r = new Array(n / 16);
		for (let o = 0; o < n; o += 16) {
			const n = o / 16;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (q(t)) return q(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r[6] = t[6], r[7] = t[7], r[8] = t[8], r[9] = t[9], r[10] = t[10], r[11] = t[11], r[12] = t[12], r[13] = t[13], r[14] = t[14], r[15] = t[15], r) : new e(t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15]);
	}
	static fromColumnMajorArray(t, r) {
		return I.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return I.defined("values", t), q(r) ? (r[0] = t[0], r[1] = t[4], r[2] = t[8], r[3] = t[12], r[4] = t[1], r[5] = t[5], r[6] = t[9], r[7] = t[13], r[8] = t[2], r[9] = t[6], r[10] = t[10], r[11] = t[14], r[12] = t[3], r[13] = t[7], r[14] = t[11], r[15] = t[15], r) : new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]);
	}
	static fromRotationTranslation(t, r, n) {
		return I.typeOf.object("rotation", t), r = r ?? Q.ZERO, q(n) ? (n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = 0, n[4] = t[3], n[5] = t[4], n[6] = t[5], n[7] = 0, n[8] = t[6], n[9] = t[7], n[10] = t[8], n[11] = 0, n[12] = r.x, n[13] = r.y, n[14] = r.z, n[15] = 1, n) : new e(t[0], t[3], t[6], r.x, t[1], t[4], t[7], r.y, t[2], t[5], t[8], r.z, 0, 0, 0, 1);
	}
	static fromTranslationQuaternionRotationScale(t, r, n, o) {
		I.typeOf.object("translation", t), I.typeOf.object("rotation", r), I.typeOf.object("scale", n), q(o) || (o = new e());
		const i = n.x, s = n.y, a = n.z, u = r.x * r.x, c = r.x * r.y, l = r.x * r.z, h = r.x * r.w, f = r.y * r.y, p = r.y * r.z, d = r.y * r.w, m = r.z * r.z, y = r.z * r.w, g = r.w * r.w, w = u - f - m + g, b = 2 * (c - y), O = 2 * (l + d), _ = 2 * (c + y), x = -u + f - m + g, v = 2 * (p - h), E = 2 * (l - d), S = 2 * (p + h), j = -u - f + m + g;
		return o[0] = w * i, o[1] = _ * i, o[2] = E * i, o[3] = 0, o[4] = b * s, o[5] = x * s, o[6] = S * s, o[7] = 0, o[8] = O * a, o[9] = v * a, o[10] = j * a, o[11] = 0, o[12] = t.x, o[13] = t.y, o[14] = t.z, o[15] = 1, o;
	}
	static fromTranslationRotationScale(t, r) {
		return I.typeOf.object("translationRotationScale", t), e.fromTranslationQuaternionRotationScale(t.translation, t.rotation, t.scale, r);
	}
	static fromTranslation(t, r) {
		return I.typeOf.object("translation", t), e.fromRotationTranslation(yr.IDENTITY, t, r);
	}
	static fromScale(t, r) {
		return I.typeOf.object("scale", t), q(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = t.y, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = t.z, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r) : new e(t.x, 0, 0, 0, 0, t.y, 0, 0, 0, 0, t.z, 0, 0, 0, 0, 1);
	}
	static fromUniformScale(t, r) {
		return I.typeOf.number("scale", t), q(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = t, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = t, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r) : new e(t, 0, 0, 0, 0, t, 0, 0, 0, 0, t, 0, 0, 0, 0, 1);
	}
	static fromRotation(t, r) {
		return I.typeOf.object("rotation", t), q(r) || (r = new e()), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 0, r[4] = t[3], r[5] = t[4], r[6] = t[5], r[7] = 0, r[8] = t[6], r[9] = t[7], r[10] = t[8], r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r;
	}
	static fromCamera(t, r) {
		I.typeOf.object("camera", t);
		const n = t.position, o = t.direction, i = t.up;
		I.typeOf.object("camera.position", n), I.typeOf.object("camera.direction", o), I.typeOf.object("camera.up", i), Q.normalize(o, Ir), Q.normalize(Q.cross(Ir, i, Mr), Mr), Q.normalize(Q.cross(Mr, Ir, zr), zr);
		const s = Mr.x, a = Mr.y, u = Mr.z, c = Ir.x, l = Ir.y, h = Ir.z, f = zr.x, p = zr.y, d = zr.z, m = n.x, y = n.y, g = n.z, w = s * -m + a * -y + u * -g, b = f * -m + p * -y + d * -g, O = c * m + l * y + h * g;
		return q(r) ? (r[0] = s, r[1] = f, r[2] = -c, r[3] = 0, r[4] = a, r[5] = p, r[6] = -l, r[7] = 0, r[8] = u, r[9] = d, r[10] = -h, r[11] = 0, r[12] = w, r[13] = b, r[14] = O, r[15] = 1, r) : new e(s, a, u, w, f, p, d, b, -c, -l, -h, O, 0, 0, 0, 1);
	}
	static computePerspectiveFieldOfView(e, t, r, n, o) {
		I.typeOf.number.greaterThan("fovY", e, 0), I.typeOf.number.lessThan("fovY", e, Math.PI), I.typeOf.number.greaterThan("near", r, 0), I.typeOf.number.greaterThan("far", n, 0), I.typeOf.object("result", o);
		const i = 1 / Math.tan(.5 * e), s = i / t, a = (n + r) / (r - n), u = 2 * n * r / (r - n);
		return o[0] = s, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = i, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = a, o[11] = -1, o[12] = 0, o[13] = 0, o[14] = u, o[15] = 0, o;
	}
	static computeOrthographicOffCenter(e, t, r, n, o, i, s) {
		I.typeOf.number("left", e), I.typeOf.number("right", t), I.typeOf.number("bottom", r), I.typeOf.number("top", n), I.typeOf.number("near", o), I.typeOf.number("far", i), I.typeOf.object("result", s);
		let a = 1 / (t - e), u = 1 / (n - r), c = 1 / (i - o);
		const l = -(t + e) * a, h = -(n + r) * u, f = -(i + o) * c;
		return a *= 2, u *= 2, c *= -2, s[0] = a, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = u, s[6] = 0, s[7] = 0, s[8] = 0, s[9] = 0, s[10] = c, s[11] = 0, s[12] = l, s[13] = h, s[14] = f, s[15] = 1, s;
	}
	static computePerspectiveOffCenter(e, t, r, n, o, i, s) {
		I.typeOf.number("left", e), I.typeOf.number("right", t), I.typeOf.number("bottom", r), I.typeOf.number("top", n), I.typeOf.number("near", o), I.typeOf.number("far", i), I.typeOf.object("result", s);
		const a = 2 * o / (t - e), u = 2 * o / (n - r), c = (t + e) / (t - e), l = (n + r) / (n - r), h = -(i + o) / (i - o), f = -2 * i * o / (i - o);
		return s[0] = a, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = u, s[6] = 0, s[7] = 0, s[8] = c, s[9] = l, s[10] = h, s[11] = -1, s[12] = 0, s[13] = 0, s[14] = f, s[15] = 0, s;
	}
	static computeInfinitePerspectiveOffCenter(e, t, r, n, o, i) {
		I.typeOf.number("left", e), I.typeOf.number("right", t), I.typeOf.number("bottom", r), I.typeOf.number("top", n), I.typeOf.number("near", o), I.typeOf.object("result", i);
		const s = 2 * o / (t - e), a = 2 * o / (n - r), u = (t + e) / (t - e), c = (n + r) / (n - r), l = -2 * o;
		return i[0] = s, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = a, i[6] = 0, i[7] = 0, i[8] = u, i[9] = c, i[10] = -1, i[11] = -1, i[12] = 0, i[13] = 0, i[14] = l, i[15] = 0, i;
	}
	static computeViewportTransformation(t, r, n, o) {
		q(o) || (o = new e());
		const i = (t = t ?? A.EMPTY_OBJECT).x ?? 0, s = t.y ?? 0;
		r = r ?? 0;
		const a = .5 * (t.width ?? 0), u = .5 * (t.height ?? 0), c = .5 * ((n = n ?? 1) - r), l = a, h = u, f = c, p = i + a, d = s + u, m = r + c;
		return o[0] = l, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = h, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = f, o[11] = 0, o[12] = p, o[13] = d, o[14] = m, o[15] = 1, o;
	}
	static computeView(e, t, r, n, o) {
		return I.typeOf.object("position", e), I.typeOf.object("direction", t), I.typeOf.object("up", r), I.typeOf.object("right", n), I.typeOf.object("result", o), o[0] = n.x, o[1] = r.x, o[2] = -t.x, o[3] = 0, o[4] = n.y, o[5] = r.y, o[6] = -t.y, o[7] = 0, o[8] = n.z, o[9] = r.z, o[10] = -t.z, o[11] = 0, o[12] = -Q.dot(n, e), o[13] = -Q.dot(r, e), o[14] = Q.dot(t, e), o[15] = 1, o;
	}
	static toArray(e, t) {
		return I.typeOf.object("matrix", e), q(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t) : [
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
		return I.typeOf.number.greaterThanOrEquals("row", t, 0), I.typeOf.number.lessThanOrEquals("row", t, 3), I.typeOf.number.greaterThanOrEquals("column", e, 0), I.typeOf.number.lessThanOrEquals("column", e, 3), 4 * e + t;
	}
	static getColumn(e, t, r) {
		I.typeOf.object("matrix", e), I.typeOf.number.greaterThanOrEquals("index", t, 0), I.typeOf.number.lessThanOrEquals("index", t, 3), I.typeOf.object("result", r);
		const n = 4 * t, o = e[n], i = e[n + 1], s = e[n + 2], a = e[n + 3];
		return r.x = o, r.y = i, r.z = s, r.w = a, r;
	}
	static setColumn(t, r, n, o) {
		I.typeOf.object("matrix", t), I.typeOf.number.greaterThanOrEquals("index", r, 0), I.typeOf.number.lessThanOrEquals("index", r, 3), I.typeOf.object("cartesian", n), I.typeOf.object("result", o);
		const i = 4 * r;
		return (o = e.clone(t, o))[i] = n.x, o[i + 1] = n.y, o[i + 2] = n.z, o[i + 3] = n.w, o;
	}
	static getRow(e, t, r) {
		I.typeOf.object("matrix", e), I.typeOf.number.greaterThanOrEquals("index", t, 0), I.typeOf.number.lessThanOrEquals("index", t, 3), I.typeOf.object("result", r);
		const n = e[t], o = e[t + 4], i = e[t + 8], s = e[t + 12];
		return r.x = n, r.y = o, r.z = i, r.w = s, r;
	}
	static setRow(t, r, n, o) {
		return I.typeOf.object("matrix", t), I.typeOf.number.greaterThanOrEquals("index", r, 0), I.typeOf.number.lessThanOrEquals("index", r, 3), I.typeOf.object("cartesian", n), I.typeOf.object("result", o), (o = e.clone(t, o))[r] = n.x, o[r + 4] = n.y, o[r + 8] = n.z, o[r + 12] = n.w, o;
	}
	static setTranslation(e, t, r) {
		return I.typeOf.object("matrix", e), I.typeOf.object("translation", t), I.typeOf.object("result", r), r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = t.x, r[13] = t.y, r[14] = t.z, r[15] = e[15], r;
	}
	static setScale(t, r, n) {
		I.typeOf.object("matrix", t), I.typeOf.object("scale", r), I.typeOf.object("result", n);
		const o = e.getScale(t, Pr), i = r.x / o.x, s = r.y / o.y, a = r.z / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3], n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * s, n[7] = t[7], n[8] = t[8] * a, n[9] = t[9] * a, n[10] = t[10] * a, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static setUniformScale(t, r, n) {
		I.typeOf.object("matrix", t), I.typeOf.number("scale", r), I.typeOf.object("result", n);
		const o = e.getScale(t, Cr), i = r / o.x, s = r / o.y, a = r / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3], n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * s, n[7] = t[7], n[8] = t[8] * a, n[9] = t[9] * a, n[10] = t[10] * a, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static getScale(e, t) {
		return I.typeOf.object("matrix", e), I.typeOf.object("result", t), t.x = Q.magnitude(Q.fromElements(e[0], e[1], e[2], Nr)), t.y = Q.magnitude(Q.fromElements(e[4], e[5], e[6], Nr)), t.z = Q.magnitude(Q.fromElements(e[8], e[9], e[10], Nr)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, Ur), Q.maximumComponent(Ur);
	}
	static setRotation(t, r, n) {
		I.typeOf.object("matrix", t), I.typeOf.object("result", n);
		const o = e.getScale(t, Dr);
		return n[0] = r[0] * o.x, n[1] = r[1] * o.x, n[2] = r[2] * o.x, n[3] = t[3], n[4] = r[3] * o.y, n[5] = r[4] * o.y, n[6] = r[5] * o.y, n[7] = t[7], n[8] = r[6] * o.z, n[9] = r[7] * o.z, n[10] = r[8] * o.z, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static getRotation(t, r) {
		I.typeOf.object("matrix", t), I.typeOf.object("result", r);
		const n = e.getScale(t, kr);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.x, r[3] = t[4] / n.y, r[4] = t[5] / n.y, r[5] = t[6] / n.y, r[6] = t[8] / n.z, r[7] = t[9] / n.z, r[8] = t[10] / n.z, r;
	}
	static multiply(e, t, r) {
		I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r);
		const n = e[0], o = e[1], i = e[2], s = e[3], a = e[4], u = e[5], c = e[6], l = e[7], h = e[8], f = e[9], p = e[10], d = e[11], m = e[12], y = e[13], g = e[14], w = e[15], b = t[0], O = t[1], _ = t[2], x = t[3], v = t[4], E = t[5], S = t[6], j = t[7], T = t[8], A = t[9], q = t[10], R = t[11], M = t[12], z = t[13], P = t[14], C = t[15], N = n * b + a * O + h * _ + m * x, U = o * b + u * O + f * _ + y * x, D = i * b + c * O + p * _ + g * x, k = s * b + l * O + d * _ + w * x, L = n * v + a * E + h * S + m * j, F = o * v + u * E + f * S + y * j, W = i * v + c * E + p * S + g * j, B = s * v + l * E + d * S + w * j, $ = n * T + a * A + h * q + m * R, V = o * T + u * A + f * q + y * R, Q = i * T + c * A + p * q + g * R, H = s * T + l * A + d * q + w * R, G = n * M + a * z + h * P + m * C, Y = o * M + u * z + f * P + y * C, Z = i * M + c * z + p * P + g * C, X = s * M + l * z + d * P + w * C;
		return r[0] = N, r[1] = U, r[2] = D, r[3] = k, r[4] = L, r[5] = F, r[6] = W, r[7] = B, r[8] = $, r[9] = V, r[10] = Q, r[11] = H, r[12] = G, r[13] = Y, r[14] = Z, r[15] = X, r;
	}
	static add(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r[4] = e[4] + t[4], r[5] = e[5] + t[5], r[6] = e[6] + t[6], r[7] = e[7] + t[7], r[8] = e[8] + t[8], r[9] = e[9] + t[9], r[10] = e[10] + t[10], r[11] = e[11] + t[11], r[12] = e[12] + t[12], r[13] = e[13] + t[13], r[14] = e[14] + t[14], r[15] = e[15] + t[15], r;
	}
	static subtract(e, t, r) {
		return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r[4] = e[4] - t[4], r[5] = e[5] - t[5], r[6] = e[6] - t[6], r[7] = e[7] - t[7], r[8] = e[8] - t[8], r[9] = e[9] - t[9], r[10] = e[10] - t[10], r[11] = e[11] - t[11], r[12] = e[12] - t[12], r[13] = e[13] - t[13], r[14] = e[14] - t[14], r[15] = e[15] - t[15], r;
	}
	static multiplyTransformation(e, t, r) {
		I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r);
		const n = e[0], o = e[1], i = e[2], s = e[4], a = e[5], u = e[6], c = e[8], l = e[9], h = e[10], f = e[12], p = e[13], d = e[14], m = t[0], y = t[1], g = t[2], w = t[4], b = t[5], O = t[6], _ = t[8], x = t[9], v = t[10], E = t[12], S = t[13], j = t[14], T = n * m + s * y + c * g, A = o * m + a * y + l * g, q = i * m + u * y + h * g, R = n * w + s * b + c * O, M = o * w + a * b + l * O, z = i * w + u * b + h * O, P = n * _ + s * x + c * v, C = o * _ + a * x + l * v, N = i * _ + u * x + h * v, U = n * E + s * S + c * j + f, D = o * E + a * S + l * j + p, k = i * E + u * S + h * j + d;
		return r[0] = T, r[1] = A, r[2] = q, r[3] = 0, r[4] = R, r[5] = M, r[6] = z, r[7] = 0, r[8] = P, r[9] = C, r[10] = N, r[11] = 0, r[12] = U, r[13] = D, r[14] = k, r[15] = 1, r;
	}
	static multiplyByMatrix3(e, t, r) {
		I.typeOf.object("matrix", e), I.typeOf.object("rotation", t), I.typeOf.object("result", r);
		const n = e[0], o = e[1], i = e[2], s = e[4], a = e[5], u = e[6], c = e[8], l = e[9], h = e[10], f = t[0], p = t[1], d = t[2], m = t[3], y = t[4], g = t[5], w = t[6], b = t[7], O = t[8], _ = n * f + s * p + c * d, x = o * f + a * p + l * d, v = i * f + u * p + h * d, E = n * m + s * y + c * g, S = o * m + a * y + l * g, j = i * m + u * y + h * g, T = n * w + s * b + c * O, A = o * w + a * b + l * O, q = i * w + u * b + h * O;
		return r[0] = _, r[1] = x, r[2] = v, r[3] = 0, r[4] = E, r[5] = S, r[6] = j, r[7] = 0, r[8] = T, r[9] = A, r[10] = q, r[11] = 0, r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static multiplyByTranslation(e, t, r) {
		I.typeOf.object("matrix", e), I.typeOf.object("translation", t), I.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = n * e[0] + o * e[4] + i * e[8] + e[12], a = n * e[1] + o * e[5] + i * e[9] + e[13], u = n * e[2] + o * e[6] + i * e[10] + e[14];
		return r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = s, r[13] = a, r[14] = u, r[15] = e[15], r;
	}
	static multiplyByScale(t, r, n) {
		I.typeOf.object("matrix", t), I.typeOf.object("scale", r), I.typeOf.object("result", n);
		const o = r.x, i = r.y, s = r.z;
		return 1 === o && 1 === i && 1 === s ? e.clone(t, n) : (n[0] = o * t[0], n[1] = o * t[1], n[2] = o * t[2], n[3] = t[3], n[4] = i * t[4], n[5] = i * t[5], n[6] = i * t[6], n[7] = t[7], n[8] = s * t[8], n[9] = s * t[9], n[10] = s * t[10], n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n);
	}
	static multiplyByUniformScale(e, t, r) {
		return I.typeOf.object("matrix", e), I.typeOf.number("scale", t), I.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3], r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7], r[8] = e[8] * t, r[9] = e[9] * t, r[10] = e[10] * t, r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static multiplyByVector(e, t, r) {
		I.typeOf.object("matrix", e), I.typeOf.object("cartesian", t), I.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = t.w, a = e[0] * n + e[4] * o + e[8] * i + e[12] * s, u = e[1] * n + e[5] * o + e[9] * i + e[13] * s, c = e[2] * n + e[6] * o + e[10] * i + e[14] * s, l = e[3] * n + e[7] * o + e[11] * i + e[15] * s;
		return r.x = a, r.y = u, r.z = c, r.w = l, r;
	}
	static multiplyByPointAsVector(e, t, r) {
		I.typeOf.object("matrix", e), I.typeOf.object("cartesian", t), I.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = e[0] * n + e[4] * o + e[8] * i, a = e[1] * n + e[5] * o + e[9] * i, u = e[2] * n + e[6] * o + e[10] * i;
		return r.x = s, r.y = a, r.z = u, r;
	}
	static multiplyByPoint(e, t, r) {
		I.typeOf.object("matrix", e), I.typeOf.object("cartesian", t), I.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = e[0] * n + e[4] * o + e[8] * i + e[12], a = e[1] * n + e[5] * o + e[9] * i + e[13], u = e[2] * n + e[6] * o + e[10] * i + e[14];
		return r.x = s, r.y = a, r.z = u, r;
	}
	static multiplyByScalar(e, t, r) {
		return I.typeOf.object("matrix", e), I.typeOf.number("scalar", t), I.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r[9] = e[9] * t, r[10] = e[10] * t, r[11] = e[11] * t, r[12] = e[12] * t, r[13] = e[13] * t, r[14] = e[14] * t, r[15] = e[15] * t, r;
	}
	static negate(e, t) {
		return I.typeOf.object("matrix", e), I.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t[9] = -e[9], t[10] = -e[10], t[11] = -e[11], t[12] = -e[12], t[13] = -e[13], t[14] = -e[14], t[15] = -e[15], t;
	}
	static transpose(e, t) {
		I.typeOf.object("matrix", e), I.typeOf.object("result", t);
		const r = e[1], n = e[2], o = e[3], i = e[6], s = e[7], a = e[11];
		return t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = r, t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = n, t[9] = i, t[10] = e[10], t[11] = e[14], t[12] = o, t[13] = s, t[14] = a, t[15] = e[15], t;
	}
	static abs(e, t) {
		return I.typeOf.object("matrix", e), I.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t[9] = Math.abs(e[9]), t[10] = Math.abs(e[10]), t[11] = Math.abs(e[11]), t[12] = Math.abs(e[12]), t[13] = Math.abs(e[13]), t[14] = Math.abs(e[14]), t[15] = Math.abs(e[15]), t;
	}
	static equals(e, t) {
		return e === t || q(e) && q(t) && e[12] === t[12] && e[13] === t[13] && e[14] === t[14] && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[8] === t[8] && e[9] === t[9] && e[10] === t[10] && e[3] === t[3] && e[7] === t[7] && e[11] === t[11] && e[15] === t[15];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || q(e) && q(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r && Math.abs(e[4] - t[4]) <= r && Math.abs(e[5] - t[5]) <= r && Math.abs(e[6] - t[6]) <= r && Math.abs(e[7] - t[7]) <= r && Math.abs(e[8] - t[8]) <= r && Math.abs(e[9] - t[9]) <= r && Math.abs(e[10] - t[10]) <= r && Math.abs(e[11] - t[11]) <= r && Math.abs(e[12] - t[12]) <= r && Math.abs(e[13] - t[13]) <= r && Math.abs(e[14] - t[14]) <= r && Math.abs(e[15] - t[15]) <= r;
	}
	static getTranslation(e, t) {
		return I.typeOf.object("matrix", e), I.typeOf.object("result", t), t.x = e[12], t.y = e[13], t.z = e[14], t;
	}
	static getMatrix3(e, t) {
		return I.typeOf.object("matrix", e), I.typeOf.object("result", t), t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t;
	}
	static inverse(t, r) {
		I.typeOf.object("matrix", t), I.typeOf.object("result", r);
		const n = t[0], o = t[4], i = t[8], s = t[12], a = t[1], u = t[5], c = t[9], l = t[13], h = t[2], f = t[6], p = t[10], d = t[14], m = t[3], y = t[7], g = t[11], w = t[15];
		let b = p * w, O = d * g, _ = f * w, x = d * y, v = f * g, E = p * y, S = h * w, j = d * m, T = h * g, A = p * m, q = h * y, R = f * m;
		const M = b * u + x * c + v * l - (O * u + _ * c + E * l), z = O * a + S * c + A * l - (b * a + j * c + T * l), P = _ * a + j * u + q * l - (x * a + S * u + R * l), C = E * a + T * u + R * c - (v * a + A * u + q * c), N = O * o + _ * i + E * s - (b * o + x * i + v * s), D = b * n + j * i + T * s - (O * n + S * i + A * s), k = x * n + S * o + R * s - (_ * n + j * o + q * s), L = v * n + A * o + q * i - (E * n + T * o + R * i);
		b = i * l, O = s * c, _ = o * l, x = s * u, v = o * c, E = i * u, S = n * l, j = s * a, T = n * c, A = i * a, q = n * u, R = o * a;
		const F = b * y + x * g + v * w - (O * y + _ * g + E * w), W = O * m + S * g + A * w - (b * m + j * g + T * w), B = _ * m + j * y + q * w - (x * m + S * y + R * w), $ = E * m + T * y + R * g - (v * m + A * y + q * g), V = _ * p + E * d + O * f - (v * d + b * f + x * p), Q = T * d + b * h + j * p - (S * p + A * d + O * h), H = S * f + R * d + x * h - (q * d + _ * h + j * f), G = q * p + v * h + A * f - (T * f + R * p + E * h);
		let Y = n * M + o * z + i * P + s * C;
		if (Math.abs(Y) < U.EPSILON21) {
			if (yr.equalsEpsilon(e.getMatrix3(t, Lr), Fr, U.EPSILON7) && be.equals(e.getRow(t, 3, Wr), Br)) return r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = 0, r[11] = 0, r[12] = -t[12], r[13] = -t[13], r[14] = -t[14], r[15] = 1, r;
			throw new vt("matrix is not invertible because its determinate is zero.");
		}
		return Y = 1 / Y, r[0] = M * Y, r[1] = z * Y, r[2] = P * Y, r[3] = C * Y, r[4] = N * Y, r[5] = D * Y, r[6] = k * Y, r[7] = L * Y, r[8] = F * Y, r[9] = W * Y, r[10] = B * Y, r[11] = $ * Y, r[12] = V * Y, r[13] = Q * Y, r[14] = H * Y, r[15] = G * Y, r;
	}
	static inverseTransformation(e, t) {
		I.typeOf.object("matrix", e), I.typeOf.object("result", t);
		const r = e[0], n = e[1], o = e[2], i = e[4], s = e[5], a = e[6], u = e[8], c = e[9], l = e[10], h = e[12], f = e[13], p = e[14], d = -r * h - n * f - o * p, m = -i * h - s * f - a * p, y = -u * h - c * f - l * p;
		return t[0] = r, t[1] = i, t[2] = u, t[3] = 0, t[4] = n, t[5] = s, t[6] = c, t[7] = 0, t[8] = o, t[9] = a, t[10] = l, t[11] = 0, t[12] = d, t[13] = m, t[14] = y, t[15] = 1, t;
	}
	static inverseTranspose(t, r) {
		return I.typeOf.object("matrix", t), I.typeOf.object("result", r), e.inverse(e.transpose(t, $r), r);
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
const Ir = new Q(), Mr = new Q(), zr = new Q(), Pr = new Q(), Cr = new Q(), Nr = new Q(), Ur = new Q(), Dr = new Q(), kr = new Q(), Lr = new yr(), Fr = new yr(), Wr = new be(), Br = new be(0, 0, 0, 1), $r = new Rr();
let Vr;
const Qr = {
	requestFullscreen: void 0,
	exitFullscreen: void 0,
	fullscreenEnabled: void 0,
	fullscreenElement: void 0,
	fullscreenchange: void 0,
	fullscreenerror: void 0
}, Hr = {};
let Gr, Yr, Zr, Xr, Jr, Kr, en, tn, rn, nn, on, sn, an, un, cn, ln;
function hn(e) {
	const t = e.split(".");
	for (let r = 0, n = t.length; r < n; ++r) t[r] = parseInt(t[r], 10);
	return t;
}
function fn() {
	if (!q(Yr) && (Yr = !1, !mn())) {
		const e = / Chrome\/([\.0-9]+)/.exec(Gr.userAgent);
		null !== e && (Yr = !0, Zr = hn(e[1]));
	}
	return Yr;
}
function pn() {
	if (!q(Xr) && (Xr = !1, !fn() && !mn() && / Safari\/[\.0-9]+/.test(Gr.userAgent))) {
		const e = / Version\/([\.0-9]+)/.exec(Gr.userAgent);
		null !== e && (Xr = !0, Jr = hn(e[1]));
	}
	return Xr;
}
function dn() {
	if (!q(Kr)) {
		Kr = !1;
		const e = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(Gr.userAgent);
		null !== e && (Kr = !0, en = hn(e[1]), en.isNightly = !!e[2]);
	}
	return Kr;
}
function mn() {
	if (!q(tn)) {
		tn = !1;
		const e = / Edg\/([\.0-9]+)/.exec(Gr.userAgent);
		null !== e && (tn = !0, rn = hn(e[1]));
	}
	return tn;
}
function yn() {
	if (!q(nn)) {
		nn = !1;
		const e = /Firefox\/([\.0-9]+)/.exec(Gr.userAgent);
		null !== e && (nn = !0, on = hn(e[1]));
	}
	return nn;
}
function gn() {
	if (!q(ln)) {
		const e = document.createElement("canvas");
		e.setAttribute("style", "image-rendering: -moz-crisp-edges;image-rendering: pixelated;");
		const t = e.style.imageRendering;
		ln = q(t) && "" !== t, ln && (cn = t);
	}
	return ln;
}
function wn() {
	if (!wn.initialized) throw new R("You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP");
	return wn._result;
}
Object.defineProperties(Hr, {
	element: { get: function() {
		if (Hr.supportsFullscreen()) return document[Qr.fullscreenElement];
	} },
	changeEventName: { get: function() {
		if (Hr.supportsFullscreen()) return Qr.fullscreenchange;
	} },
	errorEventName: { get: function() {
		if (Hr.supportsFullscreen()) return Qr.fullscreenerror;
	} },
	enabled: { get: function() {
		if (Hr.supportsFullscreen()) return document[Qr.fullscreenEnabled];
	} },
	fullscreen: { get: function() {
		if (Hr.supportsFullscreen()) return null !== Hr.element;
	} }
}), Hr.supportsFullscreen = function() {
	if (q(Vr)) return Vr;
	Vr = !1;
	const e = document.body;
	if ("function" == typeof e.requestFullscreen) return Qr.requestFullscreen = "requestFullscreen", Qr.exitFullscreen = "exitFullscreen", Qr.fullscreenEnabled = "fullscreenEnabled", Qr.fullscreenElement = "fullscreenElement", Qr.fullscreenchange = "fullscreenchange", Qr.fullscreenerror = "fullscreenerror", Vr = !0, Vr;
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
		r = `${o}RequestFullscreen`, "function" == typeof e[r] ? (Qr.requestFullscreen = r, Vr = !0) : (r = `${o}RequestFullScreen`, "function" == typeof e[r] && (Qr.requestFullscreen = r, Vr = !0)), r = `${o}ExitFullscreen`, "function" == typeof document[r] ? Qr.exitFullscreen = r : (r = `${o}CancelFullScreen`, "function" == typeof document[r] && (Qr.exitFullscreen = r)), r = `${o}FullscreenEnabled`, void 0 !== document[r] ? Qr.fullscreenEnabled = r : (r = `${o}FullScreenEnabled`, void 0 !== document[r] && (Qr.fullscreenEnabled = r)), r = `${o}FullscreenElement`, void 0 !== document[r] ? Qr.fullscreenElement = r : (r = `${o}FullScreenElement`, void 0 !== document[r] && (Qr.fullscreenElement = r)), r = `${o}fullscreenchange`, void 0 !== document[`on${r}`] && ("ms" === o && (r = "MSFullscreenChange"), Qr.fullscreenchange = r), r = `${o}fullscreenerror`, void 0 !== document[`on${r}`] && ("ms" === o && (r = "MSFullscreenError"), Qr.fullscreenerror = r);
	}
	return Vr;
}, Hr.requestFullscreen = function(e, t) {
	Hr.supportsFullscreen() && e[Qr.requestFullscreen]({ vrDisplay: t });
}, Hr.exitFullscreen = function() {
	Hr.supportsFullscreen() && document[Qr.exitFullscreen]();
}, Hr._names = Qr, Gr = "undefined" != typeof navigator ? navigator : {}, wn._promise = void 0, wn._result = void 0, wn.initialize = function() {
	return q(wn._promise) || (wn._promise = new Promise((e) => {
		const t = new Image();
		t.onload = function() {
			wn._result = t.width > 0 && t.height > 0, e(wn._result);
		}, t.onerror = function() {
			wn._result = !1, e(wn._result);
		}, t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
	})), wn._promise;
}, Object.defineProperties(wn, { initialized: { get: function() {
	return q(wn._result);
} } });
const bn = [];
"undefined" != typeof ArrayBuffer && (bn.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), "undefined" != typeof Uint8ClampedArray && bn.push(Uint8ClampedArray), "undefined" != typeof Uint8ClampedArray && bn.push(Uint8ClampedArray), "undefined" != typeof BigInt64Array && bn.push(BigInt64Array), "undefined" != typeof BigUint64Array && bn.push(BigUint64Array));
const On = {
	isChrome: fn,
	chromeVersion: function() {
		return fn() && Zr;
	},
	isSafari: pn,
	safariVersion: function() {
		return pn() && Jr;
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
		return q(sn) || (sn = /Windows/i.test(Gr.appVersion)), sn;
	},
	isIPadOrIOS: function() {
		return q(an) || (an = "iPhone" === navigator.platform || "iPod" === navigator.platform || "iPad" === navigator.platform), an;
	},
	hardwareConcurrency: Gr.hardwareConcurrency ?? 3,
	supportsPointerEvents: function() {
		return q(un) || (un = !yn() && "undefined" != typeof PointerEvent && (!q(Gr.pointerEnabled) || Gr.pointerEnabled)), un;
	},
	supportsImageRenderingPixelated: gn,
	supportsWebP: wn,
	imageRenderingValue: function() {
		return gn() ? cn : void 0;
	},
	typedArrayTypes: bn
};
function _n(e, t, r, n) {
	this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0, this.w = n ?? 0;
}
On.supportsBasis = function(e) {
	return On.supportsWebAssembly() && e.context.supportsBasis;
}, On.supportsFullscreen = function() {
	return Hr.supportsFullscreen();
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
	return I.defined("scene", e), e.context.webgl2;
}, On.supportsEsmWebWorkers = function() {
	return !yn() || parseInt(on) >= 114;
};
let xn = new Q();
_n.fromAxisAngle = function(e, t, r) {
	I.typeOf.object("axis", e), I.typeOf.number("angle", t);
	const n = t / 2, o = Math.sin(n);
	xn = Q.normalize(e, xn);
	const i = xn.x * o, s = xn.y * o, a = xn.z * o, u = Math.cos(n);
	return q(r) ? (r.x = i, r.y = s, r.z = a, r.w = u, r) : new _n(i, s, a, u);
};
const vn = [
	1,
	2,
	0
], En = new Array(3);
_n.fromRotationMatrix = function(e, t) {
	let r, n, o, i, s;
	I.typeOf.object("matrix", e);
	const a = e[yr.COLUMN0ROW0], u = e[yr.COLUMN1ROW1], c = e[yr.COLUMN2ROW2], l = a + u + c;
	if (l > 0) r = Math.sqrt(l + 1), s = .5 * r, r = .5 / r, n = (e[yr.COLUMN1ROW2] - e[yr.COLUMN2ROW1]) * r, o = (e[yr.COLUMN2ROW0] - e[yr.COLUMN0ROW2]) * r, i = (e[yr.COLUMN0ROW1] - e[yr.COLUMN1ROW0]) * r;
	else {
		const t = vn;
		let l = 0;
		u > a && (l = 1), c > a && c > u && (l = 2);
		const h = t[l], f = t[h];
		r = Math.sqrt(e[yr.getElementIndex(l, l)] - e[yr.getElementIndex(h, h)] - e[yr.getElementIndex(f, f)] + 1);
		const p = En;
		p[l] = .5 * r, r = .5 / r, s = (e[yr.getElementIndex(f, h)] - e[yr.getElementIndex(h, f)]) * r, p[h] = (e[yr.getElementIndex(h, l)] + e[yr.getElementIndex(l, h)]) * r, p[f] = (e[yr.getElementIndex(f, l)] + e[yr.getElementIndex(l, f)]) * r, n = -p[0], o = -p[1], i = -p[2];
	}
	return q(t) ? (t.x = n, t.y = o, t.z = i, t.w = s, t) : new _n(n, o, i, s);
};
const Sn = new _n();
let jn = new _n(), Tn = new _n(), An = new _n();
_n.fromHeadingPitchRoll = function(e, t) {
	return I.typeOf.object("headingPitchRoll", e), An = _n.fromAxisAngle(Q.UNIT_X, e.roll, Sn), Tn = _n.fromAxisAngle(Q.UNIT_Y, -e.pitch, t), t = _n.multiply(Tn, An, Tn), jn = _n.fromAxisAngle(Q.UNIT_Z, -e.heading, Sn), _n.multiply(jn, t, t);
};
const qn = new Q(), Rn = new Q(), In = new _n(), Mn = new _n(), zn = new _n();
_n.packedLength = 4, _n.pack = function(e, t, r) {
	return I.typeOf.object("value", e), I.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.z, t[r] = e.w, t;
}, _n.unpack = function(e, t, r) {
	return I.defined("array", e), t = t ?? 0, q(r) || (r = new _n()), r.x = e[t], r.y = e[t + 1], r.z = e[t + 2], r.w = e[t + 3], r;
}, _n.packedInterpolationLength = 3, _n.convertPackedArrayForInterpolation = function(e, t, r, n) {
	_n.unpack(e, 4 * r, zn), _n.conjugate(zn, zn);
	for (let o = 0, i = r - t + 1; o < i; o++) {
		const r = 3 * o;
		_n.unpack(e, 4 * (t + o), In), _n.multiply(In, zn, In), In.w < 0 && _n.negate(In, In), _n.computeAxis(In, qn);
		const i = _n.computeAngle(In);
		q(n) || (n = []), n[r] = qn.x * i, n[r + 1] = qn.y * i, n[r + 2] = qn.z * i;
	}
}, _n.unpackInterpolationResult = function(e, t, r, n, o) {
	q(o) || (o = new _n()), Q.fromArray(e, 0, Rn);
	const i = Q.magnitude(Rn);
	return _n.unpack(t, 4 * n, Mn), 0 === i ? _n.clone(_n.IDENTITY, In) : _n.fromAxisAngle(Rn, i, In), _n.multiply(In, Mn, o);
}, _n.clone = function(e, t) {
	if (q(e)) return q(t) ? (t.x = e.x, t.y = e.y, t.z = e.z, t.w = e.w, t) : new _n(e.x, e.y, e.z, e.w);
}, _n.conjugate = function(e, t) {
	return I.typeOf.object("quaternion", e), I.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = e.w, t;
}, _n.magnitudeSquared = function(e) {
	return I.typeOf.object("quaternion", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w;
}, _n.magnitude = function(e) {
	return Math.sqrt(_n.magnitudeSquared(e));
}, _n.normalize = function(e, t) {
	I.typeOf.object("result", t);
	const r = 1 / _n.magnitude(e), n = e.x * r, o = e.y * r, i = e.z * r, s = e.w * r;
	return t.x = n, t.y = o, t.z = i, t.w = s, t;
}, _n.inverse = function(e, t) {
	I.typeOf.object("result", t);
	const r = _n.magnitudeSquared(e);
	return t = _n.conjugate(e, t), _n.multiplyByScalar(t, 1 / r, t);
}, _n.add = function(e, t, r) {
	return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r.w = e.w + t.w, r;
}, _n.subtract = function(e, t, r) {
	return I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r.w = e.w - t.w, r;
}, _n.negate = function(e, t) {
	return I.typeOf.object("quaternion", e), I.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
}, _n.dot = function(e, t) {
	return I.typeOf.object("left", e), I.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z + e.w * t.w;
}, _n.multiply = function(e, t, r) {
	I.typeOf.object("left", e), I.typeOf.object("right", t), I.typeOf.object("result", r);
	const n = e.x, o = e.y, i = e.z, s = e.w, a = t.x, u = t.y, c = t.z, l = t.w, h = s * a + n * l + o * c - i * u, f = s * u - n * c + o * l + i * a, p = s * c + n * u - o * a + i * l, d = s * l - n * a - o * u - i * c;
	return r.x = h, r.y = f, r.z = p, r.w = d, r;
}, _n.multiplyByScalar = function(e, t, r) {
	return I.typeOf.object("quaternion", e), I.typeOf.number("scalar", t), I.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r.w = e.w * t, r;
}, _n.divideByScalar = function(e, t, r) {
	return I.typeOf.object("quaternion", e), I.typeOf.number("scalar", t), I.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r.w = e.w / t, r;
}, _n.computeAxis = function(e, t) {
	I.typeOf.object("quaternion", e), I.typeOf.object("result", t);
	const r = e.w;
	if (Math.abs(r - 1) < U.EPSILON6 || Math.abs(r + 1) < U.EPSILON6) return t.x = 1, t.y = t.z = 0, t;
	const n = 1 / Math.sqrt(1 - r * r);
	return t.x = e.x * n, t.y = e.y * n, t.z = e.z * n, t;
}, _n.computeAngle = function(e) {
	return I.typeOf.object("quaternion", e), Math.abs(e.w - 1) < U.EPSILON6 ? 0 : 2 * Math.acos(e.w);
};
let Pn = new _n();
_n.lerp = function(e, t, r, n) {
	return I.typeOf.object("start", e), I.typeOf.object("end", t), I.typeOf.number("t", r), I.typeOf.object("result", n), Pn = _n.multiplyByScalar(t, r, Pn), n = _n.multiplyByScalar(e, 1 - r, n), _n.add(Pn, n, n);
};
let Cn = new _n(), Nn = new _n(), Un = new _n();
_n.slerp = function(e, t, r, n) {
	I.typeOf.object("start", e), I.typeOf.object("end", t), I.typeOf.number("t", r), I.typeOf.object("result", n);
	let o = _n.dot(e, t), i = t;
	if (o < 0 && (o = -o, i = Cn = _n.negate(t, Cn)), 1 - o < U.EPSILON6) return _n.lerp(e, i, r, n);
	const s = Math.acos(o);
	return Nn = _n.multiplyByScalar(e, Math.sin((1 - r) * s), Nn), Un = _n.multiplyByScalar(i, Math.sin(r * s), Un), n = _n.add(Nn, Un, n), _n.multiplyByScalar(n, 1 / Math.sin(s), n);
}, _n.log = function(e, t) {
	I.typeOf.object("quaternion", e), I.typeOf.object("result", t);
	const r = U.acosClamped(e.w);
	let n = 0;
	return 0 !== r && (n = r / Math.sin(r)), Q.multiplyByScalar(e, n, t);
}, _n.exp = function(e, t) {
	I.typeOf.object("cartesian", e), I.typeOf.object("result", t);
	const r = Q.magnitude(e);
	let n = 0;
	return 0 !== r && (n = Math.sin(r) / r), t.x = e.x * n, t.y = e.y * n, t.z = e.z * n, t.w = Math.cos(r), t;
};
const Dn = new Q(), kn = new Q(), Ln = new _n(), Fn = new _n();
_n.computeInnerQuadrangle = function(e, t, r, n) {
	I.typeOf.object("q0", e), I.typeOf.object("q1", t), I.typeOf.object("q2", r), I.typeOf.object("result", n);
	const o = _n.conjugate(t, Ln);
	_n.multiply(o, r, Fn);
	const i = _n.log(Fn, Dn);
	_n.multiply(o, e, Fn);
	const s = _n.log(Fn, kn);
	return Q.add(i, s, i), Q.multiplyByScalar(i, .25, i), Q.negate(i, i), _n.exp(i, Ln), _n.multiply(t, Ln, n);
}, _n.squad = function(e, t, r, n, o, i) {
	I.typeOf.object("q0", e), I.typeOf.object("q1", t), I.typeOf.object("s0", r), I.typeOf.object("s1", n), I.typeOf.number("t", o), I.typeOf.object("result", i);
	const s = _n.slerp(e, t, o, Ln), a = _n.slerp(r, n, o, Fn);
	return _n.slerp(s, a, 2 * o * (1 - o), i);
};
const Wn = new _n(), Bn = 1.9011074535173003, $n = On.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Vn = On.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Qn = On.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Hn = On.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [];
for (let Bi = 0; Bi < 7; ++Bi) {
	const e = Bi + 1, t = 2 * e + 1;
	$n[Bi] = 1 / (e * t), Vn[Bi] = e / t;
}
$n[7] = Bn / 136, Vn[7] = 8 * Bn / 17, _n.fastSlerp = function(e, t, r, n) {
	I.typeOf.object("start", e), I.typeOf.object("end", t), I.typeOf.number("t", r), I.typeOf.object("result", n);
	let o, i = _n.dot(e, t);
	i >= 0 ? o = 1 : (o = -1, i = -i);
	const s = i - 1, a = 1 - r, u = r * r, c = a * a;
	for (let p = 7; p >= 0; --p) Qn[p] = ($n[p] * u - Vn[p]) * s, Hn[p] = ($n[p] * c - Vn[p]) * s;
	const l = o * r * (1 + Qn[0] * (1 + Qn[1] * (1 + Qn[2] * (1 + Qn[3] * (1 + Qn[4] * (1 + Qn[5] * (1 + Qn[6] * (1 + Qn[7])))))))), h = a * (1 + Hn[0] * (1 + Hn[1] * (1 + Hn[2] * (1 + Hn[3] * (1 + Hn[4] * (1 + Hn[5] * (1 + Hn[6] * (1 + Hn[7])))))))), f = _n.multiplyByScalar(e, h, Wn);
	return _n.multiplyByScalar(t, l, n), _n.add(f, n, n);
}, _n.fastSquad = function(e, t, r, n, o, i) {
	I.typeOf.object("q0", e), I.typeOf.object("q1", t), I.typeOf.object("s0", r), I.typeOf.object("s1", n), I.typeOf.number("t", o), I.typeOf.object("result", i);
	const s = _n.fastSlerp(e, t, o, Ln), a = _n.fastSlerp(r, n, o, Fn);
	return _n.fastSlerp(s, a, 2 * o * (1 - o), i);
}, _n.equals = function(e, t) {
	return e === t || q(e) && q(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
}, _n.equalsEpsilon = function(e, t, r) {
	return r = r ?? 0, e === t || q(e) && q(t) && Math.abs(e.x - t.x) <= r && Math.abs(e.y - t.y) <= r && Math.abs(e.z - t.z) <= r && Math.abs(e.w - t.w) <= r;
}, _n.ZERO = Object.freeze(new _n(0, 0, 0, 0)), _n.IDENTITY = Object.freeze(new _n(0, 0, 0, 1)), _n.prototype.clone = function(e) {
	return _n.clone(this, e);
}, _n.prototype.equals = function(e) {
	return _n.equals(this, e);
}, _n.prototype.equalsEpsilon = function(e, t) {
	return _n.equalsEpsilon(this, e, t);
}, _n.prototype.toString = function() {
	return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
};
const Gn = {}, Yn = {
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
}, Xn = {}, Jn = {
	east: new Q(),
	north: new Q(),
	up: new Q(),
	west: new Q(),
	south: new Q(),
	down: new Q()
};
let Kn = new Q(), eo = new Q(), to = new Q();
Gn.localFrameToFixedFrameGenerator = function(e, t) {
	if (!Yn.hasOwnProperty(e) || !Yn[e].hasOwnProperty(t)) throw new R("firstAxis and secondAxis must be east, north, up, west, south or down.");
	const r = Yn[e][t];
	let n;
	const o = e + t;
	return q(Xn[o]) ? n = Xn[o] : (n = function(n, o, i) {
		if (!q(n)) throw new R("origin is required.");
		if (isNaN(n.x) || isNaN(n.y) || isNaN(n.z)) throw new R("origin has a NaN component");
		if (q(i) || (i = new Rr()), Q.equalsEpsilon(n, Q.ZERO, U.EPSILON14)) Q.unpack(Zn[e], 0, Kn), Q.unpack(Zn[t], 0, eo), Q.unpack(Zn[r], 0, to);
		else if (U.equalsEpsilon(n.x, 0, U.EPSILON14) && U.equalsEpsilon(n.y, 0, U.EPSILON14)) {
			const o = U.sign(n.z);
			Q.unpack(Zn[e], 0, Kn), "east" !== e && "west" !== e && Q.multiplyByScalar(Kn, o, Kn), Q.unpack(Zn[t], 0, eo), "east" !== t && "west" !== t && Q.multiplyByScalar(eo, o, eo), Q.unpack(Zn[r], 0, to), "east" !== r && "west" !== r && Q.multiplyByScalar(to, o, to);
		} else {
			(o = o ?? ue.default).geodeticSurfaceNormal(n, Jn.up);
			const i = Jn.up, s = Jn.east;
			s.x = -n.y, s.y = n.x, s.z = 0, Q.normalize(s, Jn.east), Q.cross(i, s, Jn.north), Q.multiplyByScalar(Jn.up, -1, Jn.down), Q.multiplyByScalar(Jn.east, -1, Jn.west), Q.multiplyByScalar(Jn.north, -1, Jn.south), Kn = Jn[e], eo = Jn[t], to = Jn[r];
		}
		return i[0] = Kn.x, i[1] = Kn.y, i[2] = Kn.z, i[3] = 0, i[4] = eo.x, i[5] = eo.y, i[6] = eo.z, i[7] = 0, i[8] = to.x, i[9] = to.y, i[10] = to.z, i[11] = 0, i[12] = n.x, i[13] = n.y, i[14] = n.z, i[15] = 1, i;
	}, Xn[o] = n), n;
}, Gn.eastNorthUpToFixedFrame = Gn.localFrameToFixedFrameGenerator("east", "north"), Gn.northEastDownToFixedFrame = Gn.localFrameToFixedFrameGenerator("north", "east"), Gn.northUpEastToFixedFrame = Gn.localFrameToFixedFrameGenerator("north", "up"), Gn.northWestUpToFixedFrame = Gn.localFrameToFixedFrameGenerator("north", "west");
const ro = new _n(), no = new Q(1, 1, 1), oo = new Rr();
Gn.headingPitchRollToFixedFrame = function(e, t, r, n, o) {
	I.typeOf.object("HeadingPitchRoll", t), n = n ?? Gn.eastNorthUpToFixedFrame;
	const i = _n.fromHeadingPitchRoll(t, ro), s = Rr.fromTranslationQuaternionRotationScale(Q.ZERO, i, no, oo);
	return o = n(e, r, o), Rr.multiply(o, s, o);
};
const io = new Rr(), so = new yr();
Gn.headingPitchRollQuaternion = function(e, t, r, n, o) {
	I.typeOf.object("HeadingPitchRoll", t);
	const i = Gn.headingPitchRollToFixedFrame(e, t, r, n, io), s = Rr.getMatrix3(i, so);
	return _n.fromRotationMatrix(s, o);
};
const ao = new Q(1, 1, 1), uo = new Q(), co = new Rr(), lo = new Rr(), ho = new yr(), fo = new _n();
Gn.fixedFrameToHeadingPitchRoll = function(e, t, r, n) {
	I.defined("transform", e), t = t ?? ue.default, r = r ?? Gn.eastNorthUpToFixedFrame, q(n) || (n = new tr());
	const o = Rr.getTranslation(e, uo);
	if (Q.equals(o, Q.ZERO)) return n.heading = 0, n.pitch = 0, n.roll = 0, n;
	let i = Rr.inverseTransformation(r(o, t, co), co), s = Rr.setScale(e, ao, lo);
	s = Rr.setTranslation(s, Q.ZERO, s), i = Rr.multiply(i, s, i);
	let a = _n.fromRotationMatrix(Rr.getMatrix3(i, ho), fo);
	return a = _n.normalize(a, a), tr.fromQuaternion(a, n);
};
const po = U.TWO_PI / 86400;
let mo = new Ke();
Gn.computeIcrfToCentralBodyFixedMatrix = function(e, t) {
	let r = Gn.computeIcrfToFixedMatrix(e, t);
	return q(r) || (r = Gn.computeTemeToPseudoFixedMatrix(e, t)), r;
}, Gn.computeTemeToPseudoFixedMatrix = function(e, t) {
	if (!q(e)) throw new R("date is required.");
	mo = Ke.addSeconds(e, -Ke.computeTaiMinusUtc(e), mo);
	const r = mo.dayNumber, n = mo.secondsOfDay;
	let o;
	const i = r - 2451545;
	o = n >= 43200 ? (i + .5) / ze.DAYS_PER_JULIAN_CENTURY : (i - .5) / ze.DAYS_PER_JULIAN_CENTURY;
	const s = (24110.54841 + o * (8640184.812866 + o * (.093104 + -62e-7 * o))) * po % U.TWO_PI + (n + .5 * ze.SECONDS_PER_DAY) % ze.SECONDS_PER_DAY * (72921158553e-15 + 11772758384668e-32 * (r - 2451545.5)), a = Math.cos(s), u = Math.sin(s);
	return q(t) ? (t[0] = a, t[1] = -u, t[2] = 0, t[3] = u, t[4] = a, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t) : new yr(a, u, 0, -u, a, 0, 0, 0, 1);
}, Gn.iau2006XysData = new fr(), Gn.earthOrientationParameters = Yt.NONE;
const yo = 32.184;
Gn.preloadIcrfFixed = function(e) {
	const t = e.start.dayNumber, r = e.start.secondsOfDay + yo, n = e.stop.dayNumber, o = e.stop.secondsOfDay + yo;
	return Gn.iau2006XysData.preload(t, r, n, o);
}, Gn.computeIcrfToFixedMatrix = function(e, t) {
	if (!q(e)) throw new R("date is required.");
	q(t) || (t = new yr());
	const r = Gn.computeFixedToIcrfMatrix(e, t);
	if (q(r)) return yr.transpose(r, t);
};
const go = new tr(), wo = new yr(), bo = new Ke();
Gn.computeMoonFixedToIcrfMatrix = function(e, t) {
	if (!q(e)) throw new R("date is required.");
	q(t) || (t = new yr());
	const r = Ke.addSeconds(e, 32.184, bo), n = Ke.totalDays(r) - 2451545, o = U.toRadians(12.112) - U.toRadians(.052992) * n, i = U.toRadians(24.224) - U.toRadians(.105984) * n, s = U.toRadians(227.645) + U.toRadians(13.012) * n, a = U.toRadians(261.105) + U.toRadians(13.340716) * n, u = U.toRadians(358) + U.toRadians(.9856) * n;
	return go.pitch = U.toRadians(180) - U.toRadians(3.878) * Math.sin(o) - U.toRadians(.12) * Math.sin(i) + U.toRadians(.07) * Math.sin(s) - U.toRadians(.017) * Math.sin(a), go.roll = U.toRadians(-23.47) + U.toRadians(1.543) * Math.cos(o) + U.toRadians(.24) * Math.cos(i) - U.toRadians(.028) * Math.cos(s) + U.toRadians(.007) * Math.cos(a), go.heading = U.toRadians(154.375) + U.toRadians(13.17635831) * n + U.toRadians(3.558) * Math.sin(o) + U.toRadians(.121) * Math.sin(i) - U.toRadians(.064) * Math.sin(s) + U.toRadians(.016) * Math.sin(a) + U.toRadians(.025) * Math.sin(u), yr.fromHeadingPitchRoll(go, wo);
}, Gn.computeIcrfToMoonFixedMatrix = function(e, t) {
	if (!q(e)) throw new R("date is required.");
	q(t) || (t = new yr());
	const r = Gn.computeMoonFixedToIcrfMatrix(e, t);
	if (q(r)) return yr.transpose(r, t);
};
const Oo = new hr(0, 0, 0), _o = new Ae(0, 0, 0, 0, 0, 0), xo = new yr(), vo = new yr();
Gn.computeFixedToIcrfMatrix = function(e, t) {
	if (!q(e)) throw new R("date is required.");
	q(t) || (t = new yr());
	const r = Gn.earthOrientationParameters.compute(e, _o);
	if (!q(r)) return;
	const n = e.dayNumber, o = e.secondsOfDay + yo, i = Gn.iau2006XysData.computeXysRadians(n, o, Oo);
	if (!q(i)) return;
	const s = i.x + r.xPoleOffset, a = i.y + r.yPoleOffset, u = 1 / (1 + Math.sqrt(1 - s * s - a * a)), c = xo;
	c[0] = 1 - u * s * s, c[3] = -u * s * a, c[6] = s, c[1] = -u * s * a, c[4] = 1 - u * a * a, c[7] = a, c[2] = -s, c[5] = -a, c[8] = 1 - u * (s * s + a * a);
	const l = yr.fromRotationZ(-i.s, vo), h = yr.multiply(c, l, xo), f = e.dayNumber, p = (e.secondsOfDay - Ke.computeTaiMinusUtc(e) + r.ut1MinusUtc) / ze.SECONDS_PER_DAY;
	let d = .779057273264 + p + .00273781191135448 * (f - 2451545 + p);
	d = d % 1 * U.TWO_PI;
	const m = yr.fromRotationZ(d, vo), y = yr.multiply(h, m, xo), g = Math.cos(r.xPoleWander), w = Math.cos(r.yPoleWander), b = Math.sin(r.xPoleWander), O = Math.sin(r.yPoleWander);
	let _ = n - 2451545 + o / ze.SECONDS_PER_DAY;
	_ /= 36525;
	const x = -47e-6 * _ * U.RADIANS_PER_DEGREE / 3600, v = Math.cos(x), E = Math.sin(x), S = vo;
	return S[0] = g * v, S[1] = g * E, S[2] = b, S[3] = -w * E + O * b * v, S[4] = w * v + O * b * E, S[5] = -O * g, S[6] = -O * E - w * b * v, S[7] = O * v - w * b * E, S[8] = w * g, yr.multiply(y, S, t);
};
const Eo = new be();
Gn.pointToWindowCoordinates = function(e, t, r, n) {
	return (n = Gn.pointToGLWindowCoordinates(e, t, r, n)).y = 2 * t[5] - n.y, n;
}, Gn.pointToGLWindowCoordinates = function(e, t, r, n) {
	if (!q(e)) throw new R("modelViewProjectionMatrix is required.");
	if (!q(t)) throw new R("viewportTransformation is required.");
	if (!q(r)) throw new R("point is required.");
	q(n) || (n = new L());
	const o = Eo;
	return Rr.multiplyByVector(e, be.fromElements(r.x, r.y, r.z, 1, o), o), be.multiplyByScalar(o, 1 / o.w, o), Rr.multiplyByVector(t, o, o), L.fromCartesian4(o, n);
};
const So = new Q(), jo = new Q(), To = new Q();
Gn.rotationMatrixFromPositionVelocity = function(e, t, r, n) {
	if (!q(e)) throw new R("position is required.");
	if (!q(t)) throw new R("velocity is required.");
	const o = (r ?? ue.default).geodeticSurfaceNormal(e, So);
	let i = Q.cross(t, o, jo);
	Q.equalsEpsilon(i, Q.ZERO, U.EPSILON6) && (i = Q.clone(Q.UNIT_X, i));
	const s = Q.cross(i, t, To);
	return Q.normalize(s, s), Q.cross(t, s, i), Q.negate(i, i), Q.normalize(i, i), q(n) || (n = new yr()), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = i.x, n[4] = i.y, n[5] = i.z, n[6] = s.x, n[7] = s.y, n[8] = s.z, n;
}, Gn.SWIZZLE_3D_TO_2D_MATRIX = Object.freeze(new Rr(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
const Ao = new ne(), qo = new Q(), Ro = new Q(), Io = new yr(), Mo = new Rr(), zo = new Rr();
Gn.basisTo2D = function(e, t, r) {
	if (!q(e)) throw new R("projection is required.");
	if (!q(t)) throw new R("matrix is required.");
	if (!q(r)) throw new R("result is required.");
	const n = Rr.getTranslation(t, Ro), o = e.ellipsoid;
	let i;
	if (Q.equals(n, Q.ZERO)) i = Q.clone(Q.ZERO, qo);
	else {
		const t = o.cartesianToCartographic(n, Ao);
		i = e.project(t, qo), Q.fromElements(i.z, i.x, i.y, i);
	}
	const s = Gn.eastNorthUpToFixedFrame(n, o, Mo), a = Rr.inverseTransformation(s, zo), u = Rr.getMatrix3(t, Io), c = Rr.multiplyByMatrix3(a, u, r);
	return Rr.multiply(Gn.SWIZZLE_3D_TO_2D_MATRIX, c, r), Rr.setTranslation(r, i, r), r;
}, Gn.ellipsoidTo2DModelMatrix = function(e, t, r) {
	if (!q(e)) throw new R("projection is required.");
	if (!q(t)) throw new R("center is required.");
	if (!q(r)) throw new R("result is required.");
	const n = e.ellipsoid, o = Gn.eastNorthUpToFixedFrame(t, n, Mo), i = Rr.inverseTransformation(o, zo), s = n.cartesianToCartographic(t, Ao), a = e.project(s, qo);
	Q.fromElements(a.z, a.x, a.y, a);
	const u = Rr.fromTranslation(a, Mo);
	return Rr.multiply(Gn.SWIZZLE_3D_TO_2D_MATRIX, i, r), Rr.multiply(u, r, r), r;
};
var Po = class e {
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
		return I.typeOf.object("value", e), I.defined("array", t), r = r ?? 0, t[r++] = e.west, t[r++] = e.south, t[r++] = e.east, t[r] = e.north, t;
	}
	static unpack(t, r, n) {
		return I.defined("array", t), r = r ?? 0, q(n) || (n = new e()), n.west = t[r++], n.south = t[r++], n.east = t[r++], n.north = t[r], n;
	}
	static computeWidth(e) {
		I.typeOf.object("rectangle", e);
		let t = e.east;
		const r = e.west;
		return t < r && (t += U.TWO_PI), t - r;
	}
	static computeHeight(e) {
		return I.typeOf.object("rectangle", e), e.north - e.south;
	}
	static fromDegrees(t, r, n, o, i) {
		return t = U.toRadians(t ?? 0), r = U.toRadians(r ?? 0), n = U.toRadians(n ?? 0), o = U.toRadians(o ?? 0), q(i) ? (i.west = t, i.south = r, i.east = n, i.north = o, i) : new e(t, r, n, o);
	}
	static fromRadians(t, r, n, o, i) {
		return q(i) ? (i.west = t ?? 0, i.south = r ?? 0, i.east = n ?? 0, i.north = o ?? 0, i) : new e(t, r, n, o);
	}
	static fromCartographicArray(t, r) {
		I.defined("cartographics", t);
		let n = Number.MAX_VALUE, o = -Number.MAX_VALUE, i = Number.MAX_VALUE, s = -Number.MAX_VALUE, a = Number.MAX_VALUE, u = -Number.MAX_VALUE;
		for (let e = 0, c = t.length; e < c; e++) {
			const r = t[e];
			n = Math.min(n, r.longitude), o = Math.max(o, r.longitude), a = Math.min(a, r.latitude), u = Math.max(u, r.latitude);
			const c = r.longitude >= 0 ? r.longitude : r.longitude + U.TWO_PI;
			i = Math.min(i, c), s = Math.max(s, c);
		}
		return o - n > s - i && (n = i, o = s, o > U.PI && (o -= U.TWO_PI), n > U.PI && (n -= U.TWO_PI)), q(r) ? (r.west = n, r.south = a, r.east = o, r.north = u, r) : new e(n, a, o, u);
	}
	static fromCartesianArray(t, r, n) {
		I.defined("cartesians", t), r = r ?? ue.default;
		let o = Number.MAX_VALUE, i = -Number.MAX_VALUE, s = Number.MAX_VALUE, a = -Number.MAX_VALUE, u = Number.MAX_VALUE, c = -Number.MAX_VALUE;
		for (let e = 0, l = t.length; e < l; e++) {
			const n = r.cartesianToCartographic(t[e]);
			o = Math.min(o, n.longitude), i = Math.max(i, n.longitude), u = Math.min(u, n.latitude), c = Math.max(c, n.latitude);
			const l = n.longitude >= 0 ? n.longitude : n.longitude + U.TWO_PI;
			s = Math.min(s, l), a = Math.max(a, l);
		}
		return i - o > a - s && (o = s, i = a, i > U.PI && (i -= U.TWO_PI), o > U.PI && (o -= U.TWO_PI)), q(n) ? (n.west = o, n.south = u, n.east = i, n.north = c, n) : new e(o, u, i, c);
	}
	static fromBoundingSphere(t, r, n) {
		I.typeOf.object("boundingSphere", t);
		const o = t.center, i = t.radius;
		if (q(r) || (r = ue.default), q(n) || (n = new e()), Q.equals(o, Q.ZERO)) return e.clone(e.MAX_VALUE, n), n;
		const s = Gn.eastNorthUpToFixedFrame(o, r, Co), a = Rr.multiplyByPointAsVector(s, Q.UNIT_X, No);
		Q.normalize(a, a);
		const u = Rr.multiplyByPointAsVector(s, Q.UNIT_Y, Uo);
		Q.normalize(u, u), Q.multiplyByScalar(u, i, u), Q.multiplyByScalar(a, i, a);
		const c = Q.negate(u, ko), l = Q.negate(a, Do), h = Lo;
		let f = h[0];
		return Q.add(o, u, f), f = h[1], Q.add(o, l, f), f = h[2], Q.add(o, c, f), f = h[3], Q.add(o, a, f), h[4] = o, e.fromCartesianArray(h, r, n);
	}
	static clone(t, r) {
		if (q(t)) return q(r) ? (r.west = t.west, r.south = t.south, r.east = t.east, r.north = t.north, r) : new e(t.west, t.south, t.east, t.north);
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || q(e) && q(t) && Math.abs(e.west - t.west) <= r && Math.abs(e.south - t.south) <= r && Math.abs(e.east - t.east) <= r && Math.abs(e.north - t.north) <= r;
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	static equals(e, t) {
		return e === t || q(e) && q(t) && e.west === t.west && e.south === t.south && e.east === t.east && e.north === t.north;
	}
	equalsEpsilon(t, r) {
		return e.equalsEpsilon(this, t, r);
	}
	static _validate(e) {
		I.typeOf.object("rectangle", e);
		const t = e.north;
		I.typeOf.number.greaterThanOrEquals("north", t, -U.PI_OVER_TWO), I.typeOf.number.lessThanOrEquals("north", t, U.PI_OVER_TWO);
		const r = e.south;
		I.typeOf.number.greaterThanOrEquals("south", r, -U.PI_OVER_TWO), I.typeOf.number.lessThanOrEquals("south", r, U.PI_OVER_TWO);
		const n = e.west;
		I.typeOf.number.greaterThanOrEquals("west", n, -Math.PI), I.typeOf.number.lessThanOrEquals("west", n, Math.PI);
		const o = e.east;
		I.typeOf.number.greaterThanOrEquals("east", o, -Math.PI), I.typeOf.number.lessThanOrEquals("east", o, Math.PI);
	}
	static southwest(e, t) {
		return I.typeOf.object("rectangle", e), q(t) ? (t.longitude = e.west, t.latitude = e.south, t.height = 0, t) : new ne(e.west, e.south);
	}
	static northwest(e, t) {
		return I.typeOf.object("rectangle", e), q(t) ? (t.longitude = e.west, t.latitude = e.north, t.height = 0, t) : new ne(e.west, e.north);
	}
	static northeast(e, t) {
		return I.typeOf.object("rectangle", e), q(t) ? (t.longitude = e.east, t.latitude = e.north, t.height = 0, t) : new ne(e.east, e.north);
	}
	static southeast(e, t) {
		return I.typeOf.object("rectangle", e), q(t) ? (t.longitude = e.east, t.latitude = e.south, t.height = 0, t) : new ne(e.east, e.south);
	}
	static center(e, t) {
		I.typeOf.object("rectangle", e);
		let r = e.east;
		const n = e.west;
		r < n && (r += U.TWO_PI);
		const o = U.negativePiToPi(.5 * (n + r)), i = .5 * (e.south + e.north);
		return q(t) ? (t.longitude = o, t.latitude = i, t.height = 0, t) : new ne(o, i);
	}
	static intersection(t, r, n) {
		I.typeOf.object("rectangle", t), I.typeOf.object("otherRectangle", r);
		let o = t.east, i = t.west, s = r.east, a = r.west;
		o < i && s > 0 ? o += U.TWO_PI : s < a && o > 0 && (s += U.TWO_PI), o < i && a < 0 ? a += U.TWO_PI : s < a && i < 0 && (i += U.TWO_PI);
		const u = U.negativePiToPi(Math.max(i, a)), c = U.negativePiToPi(Math.min(o, s));
		if ((t.west < t.east || r.west < r.east) && c <= u) return;
		const l = Math.max(t.south, r.south), h = Math.min(t.north, r.north);
		return l >= h ? void 0 : q(n) ? (n.west = u, n.south = l, n.east = c, n.north = h, n) : new e(u, l, c, h);
	}
	static simpleIntersection(t, r, n) {
		I.typeOf.object("rectangle", t), I.typeOf.object("otherRectangle", r);
		const o = Math.max(t.west, r.west), i = Math.max(t.south, r.south), s = Math.min(t.east, r.east), a = Math.min(t.north, r.north);
		if (!(i >= a || o >= s)) return q(n) ? (n.west = o, n.south = i, n.east = s, n.north = a, n) : new e(o, i, s, a);
	}
	static union(t, r, n) {
		I.typeOf.object("rectangle", t), I.typeOf.object("otherRectangle", r), q(n) || (n = new e());
		let o = t.east, i = t.west, s = r.east, a = r.west;
		o < i && s > 0 ? o += U.TWO_PI : s < a && o > 0 && (s += U.TWO_PI), o < i && a < 0 ? a += U.TWO_PI : s < a && i < 0 && (i += U.TWO_PI);
		const u = U.negativePiToPi(Math.min(i, a)), c = U.negativePiToPi(Math.max(o, s));
		return n.west = u, n.south = Math.min(t.south, r.south), n.east = c, n.north = Math.max(t.north, r.north), n;
	}
	static expand(t, r, n) {
		return I.typeOf.object("rectangle", t), I.typeOf.object("cartographic", r), q(n) || (n = new e()), n.west = Math.min(t.west, r.longitude), n.south = Math.min(t.south, r.latitude), n.east = Math.max(t.east, r.longitude), n.north = Math.max(t.north, r.latitude), n;
	}
	static contains(e, t) {
		I.typeOf.object("rectangle", e), I.typeOf.object("cartographic", t);
		let r = t.longitude;
		const n = t.latitude, o = e.west;
		let i = e.east;
		return i < o && (i += U.TWO_PI, r < 0 && (r += U.TWO_PI)), (r > o || U.equalsEpsilon(r, o, U.EPSILON14)) && (r < i || U.equalsEpsilon(r, i, U.EPSILON14)) && n >= e.south && n <= e.north;
	}
	static subsample(t, r, n, o) {
		I.typeOf.object("rectangle", t), r = r ?? ue.default, n = n ?? 0, q(o) || (o = []);
		let i = 0;
		const s = t.north, a = t.south, u = t.east, c = t.west, l = Fo;
		l.height = n, l.longitude = c, l.latitude = s, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.longitude = u, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.latitude = a, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.longitude = c, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.latitude = s < 0 ? s : a > 0 ? a : 0;
		for (let h = 1; h < 8; ++h) l.longitude = -Math.PI + h * U.PI_OVER_TWO, e.contains(t, l) && (o[i] = r.cartographicToCartesian(l, o[i]), i++);
		return 0 === l.latitude && (l.longitude = c, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.longitude = u, o[i] = r.cartographicToCartesian(l, o[i]), i++), o.length = i, o;
	}
	static subsection(t, r, n, o, i, s) {
		if (I.typeOf.object("rectangle", t), I.typeOf.number.greaterThanOrEquals("westLerp", r, 0), I.typeOf.number.lessThanOrEquals("westLerp", r, 1), I.typeOf.number.greaterThanOrEquals("southLerp", n, 0), I.typeOf.number.lessThanOrEquals("southLerp", n, 1), I.typeOf.number.greaterThanOrEquals("eastLerp", o, 0), I.typeOf.number.lessThanOrEquals("eastLerp", o, 1), I.typeOf.number.greaterThanOrEquals("northLerp", i, 0), I.typeOf.number.lessThanOrEquals("northLerp", i, 1), I.typeOf.number.lessThanOrEquals("westLerp", r, o), I.typeOf.number.lessThanOrEquals("southLerp", n, i), q(s) || (s = new e()), t.west <= t.east) {
			const e = t.east - t.west;
			s.west = t.west + r * e, s.east = t.west + o * e;
		} else {
			const e = U.TWO_PI + t.east - t.west;
			s.west = U.negativePiToPi(t.west + r * e), s.east = U.negativePiToPi(t.west + o * e);
		}
		const a = t.north - t.south;
		return s.south = t.south + n * a, s.north = t.south + i * a, 1 === r && (s.west = t.east), 1 === o && (s.east = t.east), 1 === n && (s.south = t.north), 1 === i && (s.north = t.north), s;
	}
};
Po.packedLength = 4;
const Co = new Rr(), No = new Q(), Uo = new Q(), Do = new Q(), ko = new Q(), Lo = new Array(5);
for (let Bi = 0; Bi < Lo.length; ++Bi) Lo[Bi] = new Q();
const Fo = new ne();
function Wo(e, t, r, n) {
	this.x = e ?? 0, this.y = t ?? 0, this.width = r ?? 0, this.height = n ?? 0;
}
Po.MAX_VALUE = Object.freeze(new Po(-Math.PI, -U.PI_OVER_TWO, Math.PI, U.PI_OVER_TWO)), Wo.packedLength = 4, Wo.pack = function(e, t, r) {
	return I.typeOf.object("value", e), I.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.width, t[r] = e.height, t;
}, Wo.unpack = function(e, t, r) {
	return I.defined("array", e), t = t ?? 0, q(r) || (r = new Wo()), r.x = e[t++], r.y = e[t++], r.width = e[t++], r.height = e[t], r;
}, Wo.fromPoints = function(e, t) {
	if (q(t) || (t = new Wo()), !q(e) || 0 === e.length) return t.x = 0, t.y = 0, t.width = 0, t.height = 0, t;
	const r = e.length;
	let n = e[0].x, o = e[0].y, i = e[0].x, s = e[0].y;
	for (let a = 1; a < r; a++) {
		const t = e[a], r = t.x, u = t.y;
		n = Math.min(r, n), i = Math.max(r, i), o = Math.min(u, o), s = Math.max(u, s);
	}
	return t.x = n, t.y = o, t.width = i - n, t.height = s - o, t;
};
const Bo = new class {
	constructor(e) {
		this._ellipsoid = e ?? ue.default, this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
	}
	get ellipsoid() {
		return this._ellipsoid;
	}
	project(e, t) {
		const r = this._semimajorAxis, n = e.longitude * r, o = e.latitude * r, i = e.height;
		return q(t) ? (t.x = n, t.y = o, t.z = i, t) : new Q(n, o, i);
	}
	unproject(e, t) {
		if (!q(e)) throw new R("cartesian is required");
		const r = this._oneOverSemimajorAxis, n = e.x * r, o = e.y * r, i = e.z;
		return q(t) ? (t.longitude = n, t.latitude = o, t.height = i, t) : new ne(n, o, i);
	}
}(), $o = new ne(), Vo = new ne();
function Qo(e, t) {
	if (I.typeOf.object("normal", e), !U.equalsEpsilon(Q.magnitude(e), 1, U.EPSILON6)) throw new R("normal must be normalized.");
	I.typeOf.number("distance", t), this.normal = Q.clone(e), this.distance = t;
}
Wo.fromRectangle = function(e, t, r) {
	if (q(r) || (r = new Wo()), !q(e)) return r.x = 0, r.y = 0, r.width = 0, r.height = 0, r;
	Bo._ellipsoid = ue.default;
	const n = (t = t ?? Bo).project(Po.southwest(e, $o)), o = t.project(Po.northeast(e, Vo));
	return L.subtract(o, n, o), r.x = n.x, r.y = n.y, r.width = o.x, r.height = o.y, r;
}, Wo.clone = function(e, t) {
	if (q(e)) return q(t) ? (t.x = e.x, t.y = e.y, t.width = e.width, t.height = e.height, t) : new Wo(e.x, e.y, e.width, e.height);
}, Wo.union = function(e, t, r) {
	I.typeOf.object("left", e), I.typeOf.object("right", t), q(r) || (r = new Wo());
	const n = Math.min(e.x, t.x), o = Math.min(e.y, t.y), i = Math.max(e.x + e.width, t.x + t.width), s = Math.max(e.y + e.height, t.y + t.height);
	return r.x = n, r.y = o, r.width = i - n, r.height = s - o, r;
}, Wo.expand = function(e, t, r) {
	I.typeOf.object("rectangle", e), I.typeOf.object("point", t), r = Wo.clone(e, r);
	const n = t.x - r.x, o = t.y - r.y;
	return n > r.width ? r.width = n : n < 0 && (r.width -= n, r.x = t.x), o > r.height ? r.height = o : o < 0 && (r.height -= o, r.y = t.y), r;
}, Wo.intersect = function(e, t) {
	I.typeOf.object("left", e), I.typeOf.object("right", t);
	const r = e.x, n = e.y, o = t.x, i = t.y;
	return r > o + t.width || r + e.width < o || n + e.height < i || n > i + t.height ? we.OUTSIDE : we.INTERSECTING;
}, Wo.equals = function(e, t) {
	return e === t || q(e) && q(t) && e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}, Wo.prototype.clone = function(e) {
	return Wo.clone(this, e);
}, Wo.prototype.intersect = function(e) {
	return Wo.intersect(this, e);
}, Wo.prototype.equals = function(e) {
	return Wo.equals(this, e);
}, Qo.fromPointNormal = function(e, t, r) {
	if (I.typeOf.object("point", e), I.typeOf.object("normal", t), !U.equalsEpsilon(Q.magnitude(t), 1, U.EPSILON6)) throw new R("normal must be normalized.");
	const n = -Q.dot(t, e);
	return q(r) ? (Q.clone(t, r.normal), r.distance = n, r) : new Qo(t, n);
};
const Ho = new Q();
Qo.fromCartesian4 = function(e, t) {
	I.typeOf.object("coefficients", e);
	const r = Q.fromCartesian4(e, Ho), n = e.w;
	if (!U.equalsEpsilon(Q.magnitude(r), 1, U.EPSILON6)) throw new R("normal must be normalized.");
	return q(t) ? (Q.clone(r, t.normal), t.distance = n, t) : new Qo(r, n);
}, Qo.getPointDistance = function(e, t) {
	return I.typeOf.object("plane", e), I.typeOf.object("point", t), Q.dot(e.normal, t) + e.distance;
};
const Go = new Q();
Qo.projectPointOntoPlane = function(e, t, r) {
	I.typeOf.object("plane", e), I.typeOf.object("point", t), q(r) || (r = new Q());
	const n = Qo.getPointDistance(e, t), o = Q.multiplyByScalar(e.normal, n, Go);
	return Q.subtract(t, o, r);
};
const Yo = new Rr(), Zo = new be(), Xo = new Q();
Qo.transform = function(e, t, r) {
	I.typeOf.object("plane", e), I.typeOf.object("transform", t);
	const n = e.normal, o = e.distance, i = Rr.inverseTranspose(t, Yo);
	let s = be.fromElements(n.x, n.y, n.z, o, Zo);
	s = Rr.multiplyByVector(i, s, s);
	const a = Q.fromCartesian4(s, Xo);
	return s = be.divideByScalar(s, Q.magnitude(a), s), Qo.fromCartesian4(s, r);
}, Qo.clone = function(e, t) {
	return I.typeOf.object("plane", e), q(t) ? (Q.clone(e.normal, t.normal), t.distance = e.distance, t) : new Qo(e.normal, e.distance);
}, Qo.equals = function(e, t) {
	return I.typeOf.object("left", e), I.typeOf.object("right", t), e.distance === t.distance && Q.equals(e.normal, t.normal);
}, Qo.ORIGIN_XY_PLANE = Object.freeze(new Qo(Q.UNIT_Z, 0)), Qo.ORIGIN_YZ_PLANE = Object.freeze(new Qo(Q.UNIT_X, 0)), Qo.ORIGIN_ZX_PLANE = Object.freeze(new Qo(Q.UNIT_Y, 0));
var Jo = class e {
	constructor(e) {
		this._ellipsoid = e ?? ue.WGS84, this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
	}
	get ellipsoid() {
		return this._ellipsoid;
	}
	static mercatorAngleToGeodeticLatitude(e) {
		return U.PI_OVER_TWO - 2 * Math.atan(Math.exp(-e));
	}
	static geodeticLatitudeToMercatorAngle(t) {
		t > e.MaximumLatitude ? t = e.MaximumLatitude : t < -e.MaximumLatitude && (t = -e.MaximumLatitude);
		const r = Math.sin(t);
		return .5 * Math.log((1 + r) / (1 - r));
	}
	project(t, r) {
		const n = this._semimajorAxis, o = t.longitude * n, i = e.geodeticLatitudeToMercatorAngle(t.latitude) * n, s = t.height;
		return q(r) ? (r.x = o, r.y = i, r.z = s, r) : new Q(o, i, s);
	}
	unproject(t, r) {
		if (!q(t)) throw new R("cartesian is required");
		const n = this._oneOverSemimajorAxis, o = t.x * n, i = e.mercatorAngleToGeodeticLatitude(t.y * n), s = t.z;
		return q(r) ? (r.longitude = o, r.latitude = i, r.height = s, r) : new ne(o, i, s);
	}
};
Jo.MaximumLatitude = Jo.mercatorAngleToGeodeticLatitude(Math.PI);
const Ko = {
	MORPHING: 0,
	COLUMBUS_VIEW: 1,
	SCENE2D: 2,
	SCENE3D: 3
};
function ei(e) {
	this.planes = e ?? [];
}
Ko.getMorphTime = function(e) {
	return e === Ko.SCENE3D ? 1 : e !== Ko.MORPHING ? 0 : void 0;
}, Object.freeze(Ko);
const ti = [
	new Q(),
	new Q(),
	new Q()
];
Q.clone(Q.UNIT_X, ti[0]), Q.clone(Q.UNIT_Y, ti[1]), Q.clone(Q.UNIT_Z, ti[2]);
const ri = new Q(), ni = new Q(), oi = new Qo(new Q(1, 0, 0), 0);
function ii(e) {
	e = e ?? A.EMPTY_OBJECT, this.left = e.left, this._left = void 0, this.right = e.right, this._right = void 0, this.top = e.top, this._top = void 0, this.bottom = e.bottom, this._bottom = void 0, this.near = e.near ?? 1, this._near = this.near, this.far = e.far ?? 5e8, this._far = this.far, this._cullingVolume = new ei(), this._orthographicMatrix = new Rr();
}
function si(e) {
	if (!(q(e.right) && q(e.left) && q(e.top) && q(e.bottom) && q(e.near) && q(e.far))) throw new R("right, left, top, bottom, near, or far parameters are not set.");
	if (e.top !== e._top || e.bottom !== e._bottom || e.left !== e._left || e.right !== e._right || e.near !== e._near || e.far !== e._far) {
		if (e.left > e.right) throw new R("right must be greater than left.");
		if (e.bottom > e.top) throw new R("top must be greater than bottom.");
		if (e.near <= 0 || e.near > e.far) throw new R("near must be greater than zero and less than far.");
		e._left = e.left, e._right = e.right, e._top = e.top, e._bottom = e.bottom, e._near = e.near, e._far = e.far, e._orthographicMatrix = Rr.computeOrthographicOffCenter(e.left, e.right, e.bottom, e.top, e.near, e.far, e._orthographicMatrix);
	}
}
ei.fromBoundingSphere = function(e, t) {
	if (!q(e)) throw new R("boundingSphere is required.");
	q(t) || (t = new ei());
	const r = ti.length, n = t.planes;
	n.length = 2 * r;
	const o = e.center, i = e.radius;
	let s = 0;
	for (let a = 0; a < r; ++a) {
		const e = ti[a];
		let t = n[s], r = n[s + 1];
		q(t) || (t = n[s] = new be()), q(r) || (r = n[s + 1] = new be()), Q.multiplyByScalar(e, -i, ri), Q.add(o, ri, ri), t.x = e.x, t.y = e.y, t.z = e.z, t.w = -Q.dot(e, ri), Q.multiplyByScalar(e, i, ri), Q.add(o, ri, ri), r.x = -e.x, r.y = -e.y, r.z = -e.z, r.w = -Q.dot(Q.negate(e, ni), ri), s += 2;
	}
	return t;
}, ei.prototype.computeVisibility = function(e) {
	if (!q(e)) throw new R("boundingVolume is required.");
	const t = this.planes;
	let r = !1;
	for (let n = 0, o = t.length; n < o; ++n) {
		const o = e.intersectPlane(Qo.fromCartesian4(t[n], oi));
		if (o === we.OUTSIDE) return we.OUTSIDE;
		o === we.INTERSECTING && (r = !0);
	}
	return r ? we.INTERSECTING : we.INSIDE;
}, ei.prototype.computeVisibilityWithPlaneMask = function(e, t) {
	if (!q(e)) throw new R("boundingVolume is required.");
	if (!q(t)) throw new R("parentPlaneMask is required.");
	if (t === ei.MASK_OUTSIDE || t === ei.MASK_INSIDE) return t;
	let r = ei.MASK_INSIDE;
	const n = this.planes;
	for (let o = 0, i = n.length; o < i; ++o) {
		const i = o < 31 ? 1 << o : 0;
		if (o < 31 && 0 === (t & i)) continue;
		const s = e.intersectPlane(Qo.fromCartesian4(n[o], oi));
		if (s === we.OUTSIDE) return ei.MASK_OUTSIDE;
		s === we.INTERSECTING && (r |= i);
	}
	return r;
}, ei.MASK_OUTSIDE = 4294967295, ei.MASK_INSIDE = 0, ei.MASK_INDETERMINATE = 2147483647, Object.defineProperties(ii.prototype, { projectionMatrix: { get: function() {
	return si(this), this._orthographicMatrix;
} } });
const ai = new Q(), ui = new Q(), ci = new Q(), li = new Q();
function hi(e) {
	e = e ?? A.EMPTY_OBJECT, this._offCenterFrustum = new ii(), this.width = e.width, this._width = void 0, this.aspectRatio = e.aspectRatio, this._aspectRatio = void 0, this.near = e.near ?? 1, this._near = this.near, this.far = e.far ?? 5e8, this._far = this.far;
}
function fi(e) {
	if (!(q(e.width) && q(e.aspectRatio) && q(e.near) && q(e.far))) throw new R("width, aspectRatio, near, or far parameters are not set.");
	const t = e._offCenterFrustum;
	if (e.width !== e._width || e.aspectRatio !== e._aspectRatio || e.near !== e._near || e.far !== e._far) {
		if (e.aspectRatio < 0) throw new R("aspectRatio must be positive.");
		if (e.near < 0 || e.near > e.far) throw new R("near must be greater than zero and less than far.");
		e._aspectRatio = e.aspectRatio, e._width = e.width, e._near = e.near, e._far = e.far;
		const r = 1 / e.aspectRatio;
		t.right = .5 * e.width, t.left = -t.right, t.top = r * t.right, t.bottom = -t.top, t.near = e.near, t.far = e.far;
	}
}
ii.prototype.computeCullingVolume = function(e, t, r) {
	if (!q(e)) throw new R("position is required.");
	if (!q(t)) throw new R("direction is required.");
	if (!q(r)) throw new R("up is required.");
	const n = this._cullingVolume.planes, o = this.top, i = this.bottom, s = this.right, a = this.left, u = this.near, c = this.far, l = Q.cross(t, r, ai);
	Q.normalize(l, l);
	const h = ui;
	Q.multiplyByScalar(t, u, h), Q.add(e, h, h);
	const f = ci;
	Q.multiplyByScalar(l, a, f), Q.add(h, f, f);
	let p = n[0];
	return q(p) || (p = n[0] = new be()), p.x = l.x, p.y = l.y, p.z = l.z, p.w = -Q.dot(l, f), Q.multiplyByScalar(l, s, f), Q.add(h, f, f), p = n[1], q(p) || (p = n[1] = new be()), p.x = -l.x, p.y = -l.y, p.z = -l.z, p.w = -Q.dot(Q.negate(l, li), f), Q.multiplyByScalar(r, i, f), Q.add(h, f, f), p = n[2], q(p) || (p = n[2] = new be()), p.x = r.x, p.y = r.y, p.z = r.z, p.w = -Q.dot(r, f), Q.multiplyByScalar(r, o, f), Q.add(h, f, f), p = n[3], q(p) || (p = n[3] = new be()), p.x = -r.x, p.y = -r.y, p.z = -r.z, p.w = -Q.dot(Q.negate(r, li), f), p = n[4], q(p) || (p = n[4] = new be()), p.x = t.x, p.y = t.y, p.z = t.z, p.w = -Q.dot(t, h), Q.multiplyByScalar(t, c, f), Q.add(e, f, f), p = n[5], q(p) || (p = n[5] = new be()), p.x = -t.x, p.y = -t.y, p.z = -t.z, p.w = -Q.dot(Q.negate(t, li), f), this._cullingVolume;
}, ii.prototype.getPixelDimensions = function(e, t, r, n, o) {
	if (si(this), !q(e) || !q(t)) throw new R("Both drawingBufferWidth and drawingBufferHeight are required.");
	if (e <= 0) throw new R("drawingBufferWidth must be greater than zero.");
	if (t <= 0) throw new R("drawingBufferHeight must be greater than zero.");
	if (!q(r)) throw new R("distance is required.");
	if (!q(n)) throw new R("pixelRatio is required.");
	if (n <= 0) throw new R("pixelRatio must be greater than zero.");
	if (!q(o)) throw new R("A result object is required.");
	const i = n * (this.right - this.left) / e, s = n * (this.top - this.bottom) / t;
	return o.x = i, o.y = s, o;
}, ii.prototype.clone = function(e) {
	return q(e) || (e = new ii()), e.left = this.left, e.right = this.right, e.top = this.top, e.bottom = this.bottom, e.near = this.near, e.far = this.far, e._left = void 0, e._right = void 0, e._top = void 0, e._bottom = void 0, e._near = void 0, e._far = void 0, e;
}, ii.prototype.equals = function(e) {
	return q(e) && e instanceof ii && this.right === e.right && this.left === e.left && this.top === e.top && this.bottom === e.bottom && this.near === e.near && this.far === e.far;
}, ii.prototype.equalsEpsilon = function(e, t, r) {
	return e === this || q(e) && e instanceof ii && U.equalsEpsilon(this.right, e.right, t, r) && U.equalsEpsilon(this.left, e.left, t, r) && U.equalsEpsilon(this.top, e.top, t, r) && U.equalsEpsilon(this.bottom, e.bottom, t, r) && U.equalsEpsilon(this.near, e.near, t, r) && U.equalsEpsilon(this.far, e.far, t, r);
}, hi.packedLength = 4, hi.pack = function(e, t, r) {
	return I.typeOf.object("value", e), I.defined("array", t), r = r ?? 0, t[r++] = e.width, t[r++] = e.aspectRatio, t[r++] = e.near, t[r] = e.far, t;
}, hi.unpack = function(e, t, r) {
	return I.defined("array", e), t = t ?? 0, q(r) || (r = new hi()), r.width = e[t++], r.aspectRatio = e[t++], r.near = e[t++], r.far = e[t], r;
}, Object.defineProperties(hi.prototype, {
	projectionMatrix: { get: function() {
		return fi(this), this._offCenterFrustum.projectionMatrix;
	} },
	offCenterFrustum: { get: function() {
		return fi(this), this._offCenterFrustum;
	} }
}), hi.prototype.computeCullingVolume = function(e, t, r) {
	return fi(this), this._offCenterFrustum.computeCullingVolume(e, t, r);
}, hi.prototype.getPixelDimensions = function(e, t, r, n, o) {
	return fi(this), this._offCenterFrustum.getPixelDimensions(e, t, r, n, o);
}, hi.prototype.clone = function(e) {
	return q(e) || (e = new hi()), e.aspectRatio = this.aspectRatio, e.width = this.width, e.near = this.near, e.far = this.far, e._aspectRatio = void 0, e._width = void 0, e._near = void 0, e._far = void 0, this._offCenterFrustum.clone(e._offCenterFrustum), e;
}, hi.prototype.equals = function(e) {
	return !!(q(e) && e instanceof hi) && (fi(this), fi(e), this.width === e.width && this.aspectRatio === e.aspectRatio && this._offCenterFrustum.equals(e._offCenterFrustum));
}, hi.prototype.equalsEpsilon = function(e, t, r) {
	return !!(q(e) && e instanceof hi) && (fi(this), fi(e), U.equalsEpsilon(this.width, e.width, t, r) && U.equalsEpsilon(this.aspectRatio, e.aspectRatio, t, r) && this._offCenterFrustum.equalsEpsilon(e._offCenterFrustum, t, r));
};
const pi = {}, di = new be(0, 0, 0, 1);
let mi = new be();
const yi = new Wo(), gi = new L(), wi = new L();
pi.worldToWindowCoordinates = function(e, t, r) {
	return pi.worldWithEyeOffsetToWindowCoordinates(e, t, Q.ZERO, r);
};
const bi = new be(), Oi = new Q();
function _i(e, t, r, n) {
	const o = r.viewMatrix, i = Rr.multiplyByVector(o, be.fromElements(e.x, e.y, e.z, 1, bi), bi), s = Q.multiplyComponents(t, Q.normalize(i, Oi), Oi);
	return i.x += t.x + s.x, i.y += t.y + s.y, i.z += s.z, Rr.multiplyByVector(r.frustum.projectionMatrix, i, n);
}
const xi = new ne(Math.PI, U.PI_OVER_TWO), vi = new Q(), Ei = new Q();
pi.worldWithEyeOffsetToWindowCoordinates = function(e, t, r, n) {
	if (!q(e)) throw new R("scene is required.");
	if (!q(t)) throw new R("position is required.");
	const o = e.frameState, i = pi.computeActualEllipsoidPosition(o, t, di);
	if (!q(i)) return;
	const s = e.canvas, a = yi;
	a.x = 0, a.y = 0, a.width = s.clientWidth, a.height = s.clientHeight;
	const u = e.camera;
	let c = !1;
	if (o.mode === Ko.SCENE2D) {
		const t = e.mapProjection, o = xi, l = t.project(o, vi), h = Q.clone(u.position, Ei), f = u.frustum.clone(), p = Rr.computeViewportTransformation(a, 0, 1, new Rr()), d = u.frustum.projectionMatrix, m = u.positionWC.y, y = Q.fromElements(U.sign(m) * l.x - m, 0, -u.positionWC.x), g = Gn.pointToGLWindowCoordinates(d, p, y);
		if (0 === m || g.x <= 0 || g.x >= s.clientWidth) c = !0;
		else {
			if (g.x > .5 * s.clientWidth) {
				a.width = g.x, u.frustum.right = l.x - m, mi = _i(i, r, u, mi), pi.clipToGLWindowCoordinates(a, mi, gi), a.x += g.x, u.position.x = -u.position.x;
				const e = u.frustum.right;
				u.frustum.right = -u.frustum.left, u.frustum.left = -e, mi = _i(i, r, u, mi), pi.clipToGLWindowCoordinates(a, mi, wi);
			} else {
				a.x += g.x, a.width -= g.x, u.frustum.left = -l.x - m, mi = _i(i, r, u, mi), pi.clipToGLWindowCoordinates(a, mi, gi), a.x = a.x - a.width, u.position.x = -u.position.x;
				const e = u.frustum.left;
				u.frustum.left = -u.frustum.right, u.frustum.right = -e, mi = _i(i, r, u, mi), pi.clipToGLWindowCoordinates(a, mi, wi);
			}
			Q.clone(h, u.position), u.frustum = f.clone(), ((n = L.clone(gi, n)).x < 0 || n.x > s.clientWidth) && (n.x = wi.x);
		}
	}
	if (o.mode !== Ko.SCENE2D || c) {
		if (mi = _i(i, r, u, mi), mi.z < 0 && !(u.frustum instanceof hi) && !(u.frustum instanceof ii)) return;
		n = pi.clipToGLWindowCoordinates(a, mi, n);
	}
	return n.y = s.clientHeight - n.y, n;
}, pi.worldToDrawingBufferCoordinates = function(e, t, r) {
	if (q(r = pi.worldToWindowCoordinates(e, t, r))) return pi.transformWindowToDrawingBuffer(e, r, r);
};
const Si = new Q(), ji = new ne();
pi.computeActualEllipsoidPosition = function(e, t, r) {
	const n = e.mode;
	if (n === Ko.SCENE3D) return Q.clone(t, r);
	const o = e.mapProjection, i = o.ellipsoid.cartesianToCartographic(t, ji);
	if (!q(i)) return;
	if (o.project(i, Si), n === Ko.COLUMBUS_VIEW) return Q.fromElements(Si.z, Si.x, Si.y, r);
	if (n === Ko.SCENE2D) return Q.fromElements(0, Si.x, Si.y, r);
	const s = e.morphTime;
	return Q.fromElements(U.lerp(Si.z, t.x, s), U.lerp(Si.x, t.y, s), U.lerp(Si.y, t.z, s), r);
};
const Ti = new Q(), Ai = new Q(), qi = new Rr();
pi.clipToGLWindowCoordinates = function(e, t, r) {
	return Q.divideByScalar(t, t.w, Ti), Rr.computeViewportTransformation(e, 0, 1, qi), Rr.multiplyByPoint(qi, Ti, Ai), L.fromCartesian3(Ai, r);
}, pi.transformWindowToDrawingBuffer = function(e, t, r) {
	const n = e.canvas, o = e.drawingBufferWidth / n.clientWidth, i = e.drawingBufferHeight / n.clientHeight;
	return L.fromElements(t.x * o, t.y * i, r);
};
const Ri = new be(), Ii = new be();
pi.drawingBufferToWorldCoordinates = function(e, t, r, n) {
	const o = e.context.uniformState, i = o.currentFrustum, s = i.x, a = i.y;
	if (e.frameState.useLogDepth) {
		const e = r * o.log2FarDepthFromNearPlusOne;
		r = a * (1 - s / (Math.pow(2, e) - 1 + s)) / (a - s);
	}
	const u = e.view.passState.viewport, c = be.clone(be.UNIT_W, Ri);
	let l;
	c.x = (t.x - u.x) / u.width * 2 - 1, c.y = (t.y - u.y) / u.height * 2 - 1, c.z = 2 * r - 1, c.w = 1;
	let h = e.camera.frustum;
	if (q(h.fovy)) {
		l = Rr.multiplyByVector(o.inverseViewProjection, c, Ii);
		const e = 1 / l.w;
		Q.multiplyByScalar(l, e, l);
	} else {
		const e = h.offCenterFrustum;
		q(e) && (h = e), l = Ii, l.x = .5 * (c.x * (h.right - h.left) + h.left + h.right), l.y = .5 * (c.y * (h.top - h.bottom) + h.bottom + h.top), l.z = .5 * (c.z * (s - a) - s - a), l.w = 1, l = Rr.multiplyByVector(o.inverseView, l, l);
	}
	return Q.fromCartesian4(l, n);
};
var Mi = class e {
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
		return e ? Q.fromDegrees(e.lng, e.lat, e.alt, ue.WGS84) : Q.ZERO;
	}
	distance(t) {
		return t && t instanceof e ? Q.distance(this.transformWGS84ToCartesian(this), this.transformWGS84ToCartesian(t)) : 0;
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
const zi = new Jo();
var Pi = class {
	static transformCartesianToCartographic(e) {
		return ue.WGS84.cartesianToCartographic(e);
	}
	static transformCartesianToWGS84(e) {
		if (e) {
			let t = ue.WGS84.cartesianToCartographic(e);
			return new Mi(U.toDegrees(t?.longitude || 0), U.toDegrees(t?.latitude || 0), t?.height || 0);
		}
		return new Mi(0, 0);
	}
	static transformCartographicToWGS84(e) {
		return e ? new Mi(U.toDegrees(e?.longitude || 0), U.toDegrees(e?.latitude || 0), e.height || 0) : new Mi(0, 0);
	}
	static transformWGS84ToCartesian(e) {
		return e ? Q.fromDegrees(e.lng, e.lat, e.alt, ue.WGS84) : Q.ZERO;
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
		let t = zi.project(ne.fromDegrees(e.lng, e.lat, e.alt));
		return new Mi(t.x, t.y, t.z);
	}
	static transformMercatorToWGS84(e) {
		let t = zi.unproject(new Q(e.lng, e.lat, e.alt));
		return new Mi(U.toDegrees(t.longitude), U.toDegrees(t.latitude), t.height);
	}
	static transformWindowToWGS84(e, t) {
		let r, n = t.scene;
		if (n.mode === Ko.SCENE3D) {
			let t = n.camera.getPickRay(e);
			r = n.globe.pick(t, n);
		} else r = n.camera.pickEllipsoid(e, ue.WGS84);
		return this.transformCartesianToWGS84(r);
	}
	static transformWGS84ToWindow(e, t) {
		let r = t.scene;
		return pi.worldToWindowCoordinates(r, this.transformWGS84ToCartesian(e));
	}
};
function Ci(e, t, r) {
	let n;
	try {
		n = function(e, t) {
			if (!e.text) return;
			const r = Q.fromDegrees(e.x, e.y), n = pi.worldToWindowCoordinates(t.scene, r), o = Math.ceil(e.size * e.text.length / 2 + 1), i = e.size + 2, s = n?.x - o, a = n?.x + o, u = n?.y, c = n?.y + i, l = Pi.transformWindowToWGS84(new L(s, u), t), h = Pi.transformWindowToWGS84(new L(a, c), t);
			return new Po(U.toRadians(l.lng), U.toRadians(l.lat), U.toRadians(h.lng), U.toRadians(h.lat));
		}(t, r);
	} catch (e) {
		console.log("computeLabelRectangle计算错误！");
	}
	if (n) {
		let t = !0;
		if (0 === e.length && (t = !0), e.length > 0) for (let r = 0; r < e.length; r++) {
			const o = e[r];
			if (Po.intersection(o, n)) {
				t = !1;
				break;
			}
		}
		return t && e.push(n), t;
	}
	return !0;
}
function Ni(e, t = !1) {
	e && e.ItemsList.forEach((e) => {
		(function(e, t = !1) {
			e.label && (e.label.show = t), e.billboard && (e.billboard.show = t);
		})(e, t);
	});
}
function Ui(e, t, r) {
	const n = [], o = /* @__PURE__ */ new Map();
	return e && e.ItemsList?.forEach((e) => {
		if (Po.intersection(t, e.rectangle)) {
			const t = Ci(n, e, r);
			o.set(e, t);
		} else o.set(e, !1);
	}), o;
}
function Di(e, t) {
	let r = !0;
	for (let n = 0; n < e.length; n++) {
		const o = e[n];
		if (Po.intersection(o, t)) {
			r = !1;
			break;
		}
	}
	return r;
}
function ki(e, t) {
	return Po.intersection(e, t);
}
function Li(e) {
	const t = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		let r;
		t.has(e.level) ? r = t.get(e.level) : (r = new Array(), t.set(e.level, r)), r && r.push(e.rectangle);
	}), t;
}
function Fi(e, t) {
	const r = e.length;
	let n = !1;
	for (let o = 0; o < r; o++) {
		const r = e[o];
		if (n = !!Po.intersection(r, t), n) break;
	}
	return n;
}
function Wi(e) {
	let t = new Po(), r = 0;
	return e.forEach((e, t) => {
		r = Math.max(t, r);
	}), e.get(r)?.forEach((e) => {
		Po.union(e, t, t);
	}), {
		maxLevel: r,
		renderFullRectangle: t
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
	changeAllVisible: () => Ni,
	checkRectangleCollision: () => Ci,
	doAllRectangleCheck: () => Ui,
	getLevelRectMap: () => Li,
	getRenderFullRectangle: () => Wi,
	isInViewRectangle: () => ki,
	isInsection: () => Fi,
	isRectangleInsection: () => Di
}));
