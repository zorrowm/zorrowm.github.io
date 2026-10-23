var e = Object.create, t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, o = Object.getPrototypeOf, i = Object.prototype.hasOwnProperty, s = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports);
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/ const a = Symbol("Comlink.proxy"), l = Symbol("Comlink.endpoint"), f = Symbol("Comlink.releaseProxy"), u = Symbol("Comlink.finalizer"), c = Symbol("Comlink.thrown"), h = (e) => "object" == typeof e && null !== e || "function" == typeof e, p = /* @__PURE__ */ new Map([["proxy", {
	canHandle: (e) => h(e) && e[a],
	serialize(e) {
		const { port1: t, port2: r } = new MessageChannel();
		return m(e, t), [r, [r]];
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
		}), C(e, t, [], void 0);
	}(e))
}], ["throw", {
	canHandle: (e) => h(e) && c in e,
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
function m(e, t = globalThis, r = ["*"]) {
	t.addEventListener("message", function n(o) {
		if (!o || !o.data) return;
		if (!function(e, t) {
			for (const r of e) {
				if (t === r || "*" === r) return !0;
				if (r instanceof RegExp && r.test(t)) return !0;
			}
			return !1;
		}(r, o.origin)) return void console.warn(`Invalid origin '${o.origin}' for comlink proxy`);
		const { id: i, type: s, path: l } = Object.assign({ path: [] }, o.data), f = (o.data.argumentList || []).map(S);
		let h;
		try {
			const t = l.slice(0, -1).reduce((e, t) => e[t], e), r = l.reduce((e, t) => e[t], e);
			switch (s) {
				case "GET":
					h = r;
					break;
				case "SET":
					t[l.slice(-1)[0]] = S(o.data.value), h = !0;
					break;
				case "APPLY":
					h = r.apply(t, f);
					break;
				case "CONSTRUCT":
					h = function(e) {
						return Object.assign(e, { [a]: !0 });
					}(new r(...f));
					break;
				case "ENDPOINT":
					{
						const { port1: t, port2: r } = new MessageChannel();
						m(e, r), h = function(e, t) {
							return A.set(e, t), e;
						}(t, [t]);
					}
					break;
				case "RELEASE":
					h = void 0;
					break;
				default: return;
			}
		} catch (e) {
			h = {
				value: e,
				[c]: 0
			};
		}
		Promise.resolve(h).catch((e) => ({
			value: e,
			[c]: 0
		})).then((r) => {
			const [o, a] = w(r);
			t.postMessage(Object.assign(Object.assign({}, o), { id: i }), a), "RELEASE" === s && (t.removeEventListener("message", n), d(t), u in e && "function" == typeof e[u] && e[u]());
		}).catch((e) => {
			const [r, n] = w({
				value: /* @__PURE__ */ new TypeError("Unserializable return value"),
				[c]: 0
			});
			t.postMessage(Object.assign(Object.assign({}, r), { id: i }), n);
		});
	}), t.start && t.start();
}
function d(e) {
	(function(e) {
		return "MessagePort" === e.constructor.name;
	})(e) && e.close();
}
function y(e) {
	if (e) throw new Error("Proxy has been released and is not useable");
}
function g(e) {
	return j(e, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then(() => {
		d(e);
	});
}
const b = /* @__PURE__ */ new WeakMap(), O = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
	const t = (b.get(e) || 0) - 1;
	b.set(e, t), 0 === t && g(e);
});
function C(e, t, r = [], n = function() {}) {
	let o = !1;
	const i = new Proxy(n, {
		get(n, s) {
			if (y(o), s === f) return () => {
				(function(e) {
					O && O.unregister(e);
				})(i), g(e), t.clear(), o = !0;
			};
			if ("then" === s) {
				if (0 === r.length) return { then: () => i };
				const n = j(e, t, {
					type: "GET",
					path: r.map((e) => e.toString())
				}).then(S);
				return n.then.bind(n);
			}
			return C(e, t, [...r, s]);
		},
		set(n, i, s) {
			y(o);
			const [a, l] = w(s);
			return j(e, t, {
				type: "SET",
				path: [...r, i].map((e) => e.toString()),
				value: a
			}, l).then(S);
		},
		apply(n, i, s) {
			y(o);
			const a = r[r.length - 1];
			if (a === l) return j(e, t, { type: "ENDPOINT" }).then(S);
			if ("bind" === a) return C(e, t, r.slice(0, -1));
			const [f, u] = E(s);
			return j(e, t, {
				type: "APPLY",
				path: r.map((e) => e.toString()),
				argumentList: f
			}, u).then(S);
		},
		construct(n, i) {
			y(o);
			const [s, a] = E(i);
			return j(e, t, {
				type: "CONSTRUCT",
				path: r.map((e) => e.toString()),
				argumentList: s
			}, a).then(S);
		}
	});
	return function(e, t) {
		const r = (b.get(t) || 0) + 1;
		b.set(t, r), O && O.register(e, t, e);
	}(i, e), i;
}
function E(e) {
	const t = e.map(w);
	return [t.map((e) => e[0]), (r = t.map((e) => e[1]), Array.prototype.concat.apply([], r))];
	var r;
}
const A = /* @__PURE__ */ new WeakMap();
function w(e) {
	for (const [t, r] of p) if (r.canHandle(e)) {
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
	}, A.get(e) || []];
}
function S(e) {
	switch (e.type) {
		case "HANDLER": return p.get(e.name).deserialize(e.value);
		case "RAW": return e.value;
	}
}
function j(e, t, r, n) {
	return new Promise((o) => {
		const i = new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
		t.set(i, o), e.start && e.start(), e.postMessage(Object.assign({ id: i }, r), n);
	});
}
const F = {};
function z(e) {
	return null != e;
}
function x(e) {
	let t;
	this.name = "DeveloperError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
F.EMPTY_OBJECT = Object.freeze({}), F.EMPTY_ARRAY = Object.freeze([]), z(Object.create) && (x.prototype = Object.create(Error.prototype), x.prototype.constructor = x), x.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return z(this.stack) && (e += `\n${this.stack.toString()}`), e;
}, x.throwInstantiationError = function() {
	throw new x("This function defines an interface and should not be called directly.");
};
const R = {};
function I(e, t, r) {
	return `Expected ${r} to be typeof ${t}, actual typeof was ${e}`;
}
R.typeOf = {}, R.defined = function(e, t) {
	if (!z(t)) throw new x(function(e) {
		return `${e} is required, actual value was undefined`;
	}(e));
}, R.typeOf.func = function(e, t) {
	if ("function" != typeof t) throw new x(I(typeof t, "function", e));
}, R.typeOf.string = function(e, t) {
	if ("string" != typeof t) throw new x(I(typeof t, "string", e));
}, R.typeOf.number = function(e, t) {
	if ("number" != typeof t) throw new x(I(typeof t, "number", e));
}, R.typeOf.number.lessThan = function(e, t, r) {
	if (R.typeOf.number(e, t), t >= r) throw new x(`Expected ${e} to be less than ${r}, actual value was ${t}`);
}, R.typeOf.number.lessThanOrEquals = function(e, t, r) {
	if (R.typeOf.number(e, t), t > r) throw new x(`Expected ${e} to be less than or equal to ${r}, actual value was ${t}`);
}, R.typeOf.number.greaterThan = function(e, t, r) {
	if (R.typeOf.number(e, t), t <= r) throw new x(`Expected ${e} to be greater than ${r}, actual value was ${t}`);
}, R.typeOf.number.greaterThanOrEquals = function(e, t, r) {
	if (R.typeOf.number(e, t), t < r) throw new x(`Expected ${e} to be greater than or equal to ${r}, actual value was ${t}`);
}, R.typeOf.object = function(e, t) {
	if ("object" != typeof t) throw new x(I(typeof t, "object", e));
}, R.typeOf.bool = function(e, t) {
	if ("boolean" != typeof t) throw new x(I(typeof t, "boolean", e));
}, R.typeOf.bigint = function(e, t) {
	if ("bigint" != typeof t) throw new x(I(typeof t, "bigint", e));
}, R.typeOf.number.equals = function(e, t, r, n) {
	if (R.typeOf.number(e, r), R.typeOf.number(t, n), r !== n) throw new x(`${e} must be equal to ${t}, the actual values are ${r} and ${n}`);
};
var L = ((s, a, l) => (l = null != s ? e(o(s)) : {}, ((e, o, s, a) => {
	if (o && "object" == typeof o || "function" == typeof o) for (var l, f = n(o), u = 0, c = f.length; u < c; u++) l = f[u], i.call(e, l) || void 0 === l || t(e, l, {
		get: ((e) => o[e]).bind(null, l),
		enumerable: !(a = r(o, l)) || a.enumerable
	});
	return e;
})(!a && s && s.__esModule ? l : t(l, "default", {
	value: s,
	enumerable: !0
}), s)))(s((e, t) => {
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
const T = {
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
T.sign = Math.sign ?? function(e) {
	return 0 === (e = +e) || e != e ? e : e > 0 ? 1 : -1;
}, T.signNotZero = function(e) {
	return e < 0 ? -1 : 1;
}, T.toSNorm = function(e, t) {
	return t = t ?? 255, Math.round((.5 * T.clamp(e, -1, 1) + .5) * t);
}, T.fromSNorm = function(e, t) {
	return t = t ?? 255, T.clamp(e, 0, t) / t * 2 - 1;
}, T.normalize = function(e, t, r) {
	return 0 === (r = Math.max(r - t, 0)) ? 0 : T.clamp((e - t) / r, 0, 1);
}, T.sinh = Math.sinh ?? function(e) {
	return (Math.exp(e) - Math.exp(-e)) / 2;
}, T.cosh = Math.cosh ?? function(e) {
	return (Math.exp(e) + Math.exp(-e)) / 2;
}, T.lerp = function(e, t, r) {
	return (1 - r) * e + r * t;
}, T.PI = Math.PI, T.ONE_OVER_PI = 1 / Math.PI, T.PI_OVER_TWO = Math.PI / 2, T.PI_OVER_THREE = Math.PI / 3, T.PI_OVER_FOUR = Math.PI / 4, T.PI_OVER_SIX = Math.PI / 6, T.THREE_PI_OVER_TWO = 3 * Math.PI / 2, T.TWO_PI = 2 * Math.PI, T.ONE_OVER_TWO_PI = 1 / (2 * Math.PI), T.RADIANS_PER_DEGREE = Math.PI / 180, T.DEGREES_PER_RADIAN = 180 / Math.PI, T.RADIANS_PER_ARCSECOND = T.RADIANS_PER_DEGREE / 3600, T.toRadians = function(e) {
	if (!z(e)) throw new x("degrees is required.");
	return e * T.RADIANS_PER_DEGREE;
}, T.toDegrees = function(e) {
	if (!z(e)) throw new x("radians is required.");
	return e * T.DEGREES_PER_RADIAN;
}, T.convertLongitudeRange = function(e) {
	if (!z(e)) throw new x("angle is required.");
	const t = T.TWO_PI, r = e - Math.floor(e / t) * t;
	return r < -Math.PI ? r + t : r >= Math.PI ? r - t : r;
}, T.clampToLatitudeRange = function(e) {
	if (!z(e)) throw new x("angle is required.");
	return T.clamp(e, -1 * T.PI_OVER_TWO, T.PI_OVER_TWO);
}, T.negativePiToPi = function(e) {
	if (!z(e)) throw new x("angle is required.");
	return e >= -T.PI && e <= T.PI ? e : T.zeroToTwoPi(e + T.PI) - T.PI;
}, T.zeroToTwoPi = function(e) {
	if (!z(e)) throw new x("angle is required.");
	if (e >= 0 && e <= T.TWO_PI) return e;
	const t = T.mod(e, T.TWO_PI);
	return Math.abs(t) < T.EPSILON14 && Math.abs(e) > T.EPSILON14 ? T.TWO_PI : t;
}, T.mod = function(e, t) {
	if (!z(e)) throw new x("m is required.");
	if (!z(t)) throw new x("n is required.");
	if (0 === t) throw new x("divisor cannot be 0.");
	return T.sign(e) === T.sign(t) && Math.abs(e) < Math.abs(t) ? e : (e % t + t) % t;
}, T.equalsEpsilon = function(e, t, r, n) {
	if (!z(e)) throw new x("left is required.");
	if (!z(t)) throw new x("right is required.");
	r = r ?? 0, n = n ?? r;
	const o = Math.abs(e - t);
	return o <= n || o <= r * Math.max(Math.abs(e), Math.abs(t));
}, T.lessThan = function(e, t, r) {
	if (!z(e)) throw new x("first is required.");
	if (!z(t)) throw new x("second is required.");
	if (!z(r)) throw new x("absoluteEpsilon is required.");
	return e - t < -r;
}, T.lessThanOrEquals = function(e, t, r) {
	if (!z(e)) throw new x("first is required.");
	if (!z(t)) throw new x("second is required.");
	if (!z(r)) throw new x("absoluteEpsilon is required.");
	return e - t < r;
}, T.greaterThan = function(e, t, r) {
	if (!z(e)) throw new x("first is required.");
	if (!z(t)) throw new x("second is required.");
	if (!z(r)) throw new x("absoluteEpsilon is required.");
	return e - t > r;
}, T.greaterThanOrEquals = function(e, t, r) {
	if (!z(e)) throw new x("first is required.");
	if (!z(t)) throw new x("second is required.");
	if (!z(r)) throw new x("absoluteEpsilon is required.");
	return e - t > -r;
};
const N = [1];
T.factorial = function(e) {
	if ("number" != typeof e || e < 0) throw new x("A number greater than or equal to 0 is required.");
	const t = N.length;
	if (e >= t) {
		let r = N[t - 1];
		for (let n = t; n <= e; n++) {
			const e = r * n;
			N.push(e), r = e;
		}
	}
	return N[e];
}, T.incrementWrap = function(e, t, r) {
	if (r = r ?? 0, !z(e)) throw new x("n is required.");
	if (t <= r) throw new x("maximumValue must be greater than minimumValue.");
	return ++e > t && (e = r), e;
}, T.isPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new x("A number between 0 and (2^32)-1 is required.");
	return 0 !== e && !(e & e - 1);
}, T.nextPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 2147483648) throw new x("A number between 0 and 2^31 is required.");
	return --e, e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ++e;
}, T.previousPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new x("A number between 0 and (2^32)-1 is required.");
	return e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ((e |= e >> 32) >>> 0) - (e >>> 1);
}, T.clamp = function(e, t, r) {
	return R.typeOf.number("value", e), R.typeOf.number("min", t), R.typeOf.number("max", r), e < t ? t : e > r ? r : e;
};
let _ = new L.default();
T.setRandomNumberSeed = function(e) {
	if (!z(e)) throw new x("seed is required.");
	_ = new L.default(e);
}, T.nextRandomNumber = function() {
	return _.random();
}, T.randomBetween = function(e, t) {
	return T.nextRandomNumber() * (t - e) + e;
}, T.acosClamped = function(e) {
	if (!z(e)) throw new x("value is required.");
	return Math.acos(T.clamp(e, -1, 1));
}, T.asinClamped = function(e) {
	if (!z(e)) throw new x("value is required.");
	return Math.asin(T.clamp(e, -1, 1));
}, T.chordLength = function(e, t) {
	if (!z(e)) throw new x("angle is required.");
	if (!z(t)) throw new x("radius is required.");
	return 2 * t * Math.sin(.5 * e);
}, T.logBase = function(e, t) {
	if (!z(e)) throw new x("number is required.");
	if (!z(t)) throw new x("base is required.");
	return Math.log(e) / Math.log(t);
}, T.cbrt = Math.cbrt ?? function(e) {
	const t = Math.pow(Math.abs(e), 1 / 3);
	return e < 0 ? -t : t;
}, T.log2 = Math.log2 ?? function(e) {
	return Math.log(e) * Math.LOG2E;
}, T.fog = function(e, t) {
	const r = e * t;
	return 1 - Math.exp(-r * r);
}, T.fastApproximateAtan = function(e) {
	return R.typeOf.number("x", e), e * (-.1784 * Math.abs(e) - .0663 * e * e + 1.0301);
}, T.fastApproximateAtan2 = function(e, t) {
	let r;
	R.typeOf.number("x", e), R.typeOf.number("y", t);
	let n = Math.abs(e);
	r = Math.abs(t);
	const o = Math.max(n, r);
	r = Math.min(n, r);
	const i = r / o;
	if (isNaN(i)) throw new x("either x or y must be nonzero");
	return n = T.fastApproximateAtan(i), n = Math.abs(t) > Math.abs(e) ? T.PI_OVER_TWO - n : n, n = e < 0 ? T.PI - n : n, n = t < 0 ? -n : n, n;
};
var D = class e {
	constructor(e, t) {
		this.x = e ?? 0, this.y = t ?? 0;
	}
	static fromElements(t, r, n) {
		return z(n) ? (n.x = t, n.y = r, n) : new e(t, r);
	}
	static clone(t, r) {
		if (z(t)) return z(r) ? (r.x = t.x, r.y = t.y, r) : new e(t.x, t.y);
	}
	static pack(e, t, r) {
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r] = e.y, t;
	}
	static unpack(t, r, n) {
		return R.defined("array", t), r = r ?? 0, z(n) || (n = new e()), n.x = t[r++], n.y = t[r], n;
	}
	static packArray(t, r) {
		R.defined("array", t);
		const n = t.length, o = 2 * n;
		if (z(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new x("If result is a typed array, it must have exactly array.length * 2 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 2 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (R.defined("array", t), R.typeOf.number.greaterThanOrEquals("array.length", t.length, 2), t.length % 2 != 0) throw new x("array length must be a multiple of 2.");
		const n = t.length;
		z(r) ? r.length = n / 2 : r = new Array(n / 2);
		for (let o = 0; o < n; o += 2) {
			const n = o / 2;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return R.typeOf.object("cartesian", e), Math.max(e.x, e.y);
	}
	static minimumComponent(e) {
		return R.typeOf.object("cartesian", e), Math.min(e.x, e.y);
	}
	static minimumByComponent(e, t, r) {
		return R.typeOf.object("first", e), R.typeOf.object("second", t), R.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r;
	}
	static maximumByComponent(e, t, r) {
		return R.typeOf.object("first", e), R.typeOf.object("second", t), R.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r;
	}
	static clamp(e, t, r, n) {
		R.typeOf.object("value", e), R.typeOf.object("min", t), R.typeOf.object("max", r), R.typeOf.object("result", n);
		const o = T.clamp(e.x, t.x, r.x), i = T.clamp(e.y, t.y, r.y);
		return n.x = o, n.y = i, n;
	}
	static magnitudeSquared(e) {
		return R.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return R.typeOf.object("left", t), R.typeOf.object("right", r), e.subtract(t, r, M), e.magnitude(M);
	}
	static distanceSquared(t, r) {
		return R.typeOf.object("left", t), R.typeOf.object("right", r), e.subtract(t, r, M), e.magnitudeSquared(M);
	}
	static normalize(t, r) {
		R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, isNaN(r.x) || isNaN(r.y)) throw new x("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), e.x * t.x + e.y * t.y;
	}
	static cross(e, t) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), e.x * t.y - e.y * t.x;
	}
	static multiplyComponents(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r;
	}
	static divideComponents(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r;
	}
	static add(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r;
	}
	static subtract(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r;
	}
	static multiplyByScalar(e, t, r) {
		return R.typeOf.object("cartesian", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r;
	}
	static divideByScalar(e, t, r) {
		return R.typeOf.object("cartesian", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r;
	}
	static negate(e, t) {
		return R.typeOf.object("cartesian", e), R.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t;
	}
	static abs(e, t) {
		return R.typeOf.object("cartesian", e), R.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t;
	}
	static lerp(t, r, n, o) {
		return R.typeOf.object("start", t), R.typeOf.object("end", r), R.typeOf.number("t", n), R.typeOf.object("result", o), e.multiplyByScalar(r, n, B), o = e.multiplyByScalar(t, 1 - n, o), e.add(B, o, o);
	}
	static angleBetween(t, r) {
		return R.typeOf.object("left", t), R.typeOf.object("right", r), e.normalize(t, P), e.normalize(r, v), T.acosClamped(e.dot(P, v));
	}
	static mostOrthogonalAxis(t, r) {
		R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = e.normalize(t, U);
		return e.abs(n, n), n.x <= n.y ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Y, r);
	}
	static equals(e, t) {
		return e === t || z(e) && z(t) && e.x === t.x && e.y === t.y;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || z(e) && z(t) && T.equalsEpsilon(e.x, t.x, r, n) && T.equalsEpsilon(e.y, t.y, r, n);
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
D.fromCartesian3 = D.clone, D.fromCartesian4 = D.clone, D.packedLength = 2, D.fromArray = D.unpack;
const M = new D(), B = new D(), P = new D(), v = new D(), U = new D();
D.ZERO = Object.freeze(new D(0, 0)), D.ONE = Object.freeze(new D(1, 1)), D.UNIT_X = Object.freeze(new D(1, 0)), D.UNIT_Y = Object.freeze(new D(0, 1));
var q = class e {
	constructor(e, t, r) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0;
	}
	static fromSpherical(t, r) {
		R.typeOf.object("spherical", t), z(r) || (r = new e());
		const n = t.clock, o = t.cone, i = t.magnitude ?? 1, s = i * Math.sin(o);
		return r.x = s * Math.cos(n), r.y = s * Math.sin(n), r.z = i * Math.cos(o), r;
	}
	static fromElements(t, r, n, o) {
		return z(o) ? (o.x = t, o.y = r, o.z = n, o) : new e(t, r, n);
	}
	static clone(t, r) {
		if (z(t)) return z(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r) : new e(t.x, t.y, t.z);
	}
	static pack(e, t, r) {
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r] = e.z, t;
	}
	static unpack(t, r, n) {
		return R.defined("array", t), r = r ?? 0, z(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r], n;
	}
	static packArray(t, r) {
		R.defined("array", t);
		const n = t.length, o = 3 * n;
		if (z(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new x("If result is a typed array, it must have exactly array.length * 3 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 3 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (R.defined("array", t), R.typeOf.number.greaterThanOrEquals("array.length", t.length, 3), t.length % 3 != 0) throw new x("array length must be a multiple of 3.");
		const n = t.length;
		z(r) ? r.length = n / 3 : r = new Array(n / 3);
		for (let o = 0; o < n; o += 3) {
			const n = o / 3;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return R.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z);
	}
	static minimumComponent(e) {
		return R.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z);
	}
	static minimumByComponent(e, t, r) {
		return R.typeOf.object("first", e), R.typeOf.object("second", t), R.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r;
	}
	static maximumByComponent(e, t, r) {
		return R.typeOf.object("first", e), R.typeOf.object("second", t), R.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r;
	}
	static clamp(e, t, r, n) {
		R.typeOf.object("value", e), R.typeOf.object("min", t), R.typeOf.object("max", r), R.typeOf.object("result", n);
		const o = T.clamp(e.x, t.x, r.x), i = T.clamp(e.y, t.y, r.y), s = T.clamp(e.z, t.z, r.z);
		return n.x = o, n.y = i, n.z = s, n;
	}
	static magnitudeSquared(e) {
		return R.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return R.typeOf.object("left", t), R.typeOf.object("right", r), e.subtract(t, r, G), e.magnitude(G);
	}
	static distanceSquared(t, r) {
		return R.typeOf.object("left", t), R.typeOf.object("right", r), e.subtract(t, r, G), e.magnitudeSquared(G);
	}
	static normalize(t, r) {
		R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z)) throw new x("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z;
	}
	static multiplyComponents(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r;
	}
	static divideComponents(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r;
	}
	static add(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r;
	}
	static subtract(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r;
	}
	static multiplyByScalar(e, t, r) {
		return R.typeOf.object("cartesian", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r;
	}
	static divideByScalar(e, t, r) {
		return R.typeOf.object("cartesian", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r;
	}
	static negate(e, t) {
		return R.typeOf.object("cartesian", e), R.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t;
	}
	static abs(e, t) {
		return R.typeOf.object("cartesian", e), R.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t;
	}
	static lerp(t, r, n, o) {
		return R.typeOf.object("start", t), R.typeOf.object("end", r), R.typeOf.number("t", n), R.typeOf.object("result", o), e.multiplyByScalar(r, n, k), o = e.multiplyByScalar(t, 1 - n, o), e.add(k, o, o);
	}
	static angleBetween(t, r) {
		R.typeOf.object("left", t), R.typeOf.object("right", r), e.normalize(t, W), e.normalize(r, $);
		const n = e.dot(W, $), o = e.magnitude(e.cross(W, $, W));
		return Math.atan2(o, n);
	}
	static mostOrthogonalAxis(t, r) {
		R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = e.normalize(t, H);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Z, r) : n.y <= n.z ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_Z, r);
	}
	static projectVector(t, r, n) {
		R.defined("a", t), R.defined("b", r), R.defined("result", n);
		const o = e.dot(t, r) / e.dot(r, r);
		return e.multiplyByScalar(r, o, n);
	}
	static equals(e, t) {
		return e === t || z(e) && z(t) && e.x === t.x && e.y === t.y && e.z === t.z;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || z(e) && z(t) && T.equalsEpsilon(e.x, t.x, r, n) && T.equalsEpsilon(e.y, t.y, r, n) && T.equalsEpsilon(e.z, t.z, r, n);
	}
	static cross(e, t, r) {
		R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r);
		const n = e.x, o = e.y, i = e.z, s = t.x, a = t.y, l = t.z, f = o * l - i * a, u = i * s - n * l, c = n * a - o * s;
		return r.x = f, r.y = u, r.z = c, r;
	}
	static midpoint(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = .5 * (e.x + t.x), r.y = .5 * (e.y + t.y), r.z = .5 * (e.z + t.z), r;
	}
	static fromDegrees(t, r, n, o, i) {
		return R.typeOf.number("longitude", t), R.typeOf.number("latitude", r), t = T.toRadians(t), r = T.toRadians(r), e.fromRadians(t, r, n, o, i);
	}
	static fromRadians(t, r, n, o, i) {
		R.typeOf.number("longitude", t), R.typeOf.number("latitude", r), n = n ?? 0;
		const s = z(o) ? o.radiiSquared : e._ellipsoidRadiiSquared, a = Math.cos(r);
		V.x = a * Math.cos(t), V.y = a * Math.sin(t), V.z = Math.sin(r), V = e.normalize(V, V), e.multiplyComponents(s, V, K);
		const l = Math.sqrt(e.dot(V, K));
		return K = e.divideByScalar(K, l, K), V = e.multiplyByScalar(V, n, V), z(i) || (i = new e()), e.add(K, V, i);
	}
	static fromDegreesArray(t, r, n) {
		if (R.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new x("the number of coordinates must be a multiple of 2 and at least 2");
		const o = t.length;
		z(n) ? n.length = o / 2 : n = new Array(o / 2);
		for (let i = 0; i < o; i += 2) {
			const o = t[i], s = t[i + 1], a = i / 2;
			n[a] = e.fromDegrees(o, s, 0, r, n[a]);
		}
		return n;
	}
	static fromRadiansArray(t, r, n) {
		if (R.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new x("the number of coordinates must be a multiple of 2 and at least 2");
		const o = t.length;
		z(n) ? n.length = o / 2 : n = new Array(o / 2);
		for (let i = 0; i < o; i += 2) {
			const o = t[i], s = t[i + 1], a = i / 2;
			n[a] = e.fromRadians(o, s, 0, r, n[a]);
		}
		return n;
	}
	static fromDegreesArrayHeights(t, r, n) {
		if (R.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new x("the number of coordinates must be a multiple of 3 and at least 3");
		const o = t.length;
		z(n) ? n.length = o / 3 : n = new Array(o / 3);
		for (let i = 0; i < o; i += 3) {
			const o = t[i], s = t[i + 1], a = t[i + 2], l = i / 3;
			n[l] = e.fromDegrees(o, s, a, r, n[l]);
		}
		return n;
	}
	static fromRadiansArrayHeights(t, r, n) {
		if (R.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new x("the number of coordinates must be a multiple of 3 and at least 3");
		const o = t.length;
		z(n) ? n.length = o / 3 : n = new Array(o / 3);
		for (let i = 0; i < o; i += 3) {
			const o = t[i], s = t[i + 1], a = t[i + 2], l = i / 3;
			n[l] = e.fromRadians(o, s, a, r, n[l]);
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
q.fromCartesian4 = q.clone, q.packedLength = 3, q.fromArray = q.unpack;
const G = new q(), k = new q(), W = new q(), $ = new q(), H = new q();
let Y, V = new q(), K = new q();
q._ellipsoidRadiiSquared = new q(40680631590769, 40680631590769, 40408299984661.445), q.ZERO = Object.freeze(new q(0, 0, 0)), q.ONE = Object.freeze(new q(1, 1, 1)), q.UNIT_X = Object.freeze(new q(1, 0, 0)), q.UNIT_Y = Object.freeze(new q(0, 1, 0)), q.UNIT_Z = Object.freeze(new q(0, 0, 1));
const Z = {
	requestFullscreen: void 0,
	exitFullscreen: void 0,
	fullscreenEnabled: void 0,
	fullscreenElement: void 0,
	fullscreenchange: void 0,
	fullscreenerror: void 0
}, Q = {};
let X, J, ee, te, re, ne, oe, ie, se, ae, le, fe, ue, ce, he, pe;
function me(e) {
	const t = e.split(".");
	for (let r = 0, n = t.length; r < n; ++r) t[r] = parseInt(t[r], 10);
	return t;
}
function de() {
	if (!z(J) && (J = !1, !be())) {
		const e = / Chrome\/([\.0-9]+)/.exec(X.userAgent);
		null !== e && (J = !0, ee = me(e[1]));
	}
	return J;
}
function ye() {
	if (!z(te) && (te = !1, !de() && !be() && / Safari\/[\.0-9]+/.test(X.userAgent))) {
		const e = / Version\/([\.0-9]+)/.exec(X.userAgent);
		null !== e && (te = !0, re = me(e[1]));
	}
	return te;
}
function ge() {
	if (!z(ne)) {
		ne = !1;
		const e = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(X.userAgent);
		null !== e && (ne = !0, oe = me(e[1]), oe.isNightly = !!e[2]);
	}
	return ne;
}
function be() {
	if (!z(ie)) {
		ie = !1;
		const e = / Edg\/([\.0-9]+)/.exec(X.userAgent);
		null !== e && (ie = !0, se = me(e[1]));
	}
	return ie;
}
function Oe() {
	if (!z(ae)) {
		ae = !1;
		const e = /Firefox\/([\.0-9]+)/.exec(X.userAgent);
		null !== e && (ae = !0, le = me(e[1]));
	}
	return ae;
}
function Ce() {
	if (!z(pe)) {
		const e = document.createElement("canvas");
		e.setAttribute("style", "image-rendering: -moz-crisp-edges;image-rendering: pixelated;");
		const t = e.style.imageRendering;
		pe = z(t) && "" !== t, pe && (he = t);
	}
	return pe;
}
function Ee() {
	if (!Ee.initialized) throw new x("You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP");
	return Ee._result;
}
Object.defineProperties(Q, {
	element: { get: function() {
		if (Q.supportsFullscreen()) return document[Z.fullscreenElement];
	} },
	changeEventName: { get: function() {
		if (Q.supportsFullscreen()) return Z.fullscreenchange;
	} },
	errorEventName: { get: function() {
		if (Q.supportsFullscreen()) return Z.fullscreenerror;
	} },
	enabled: { get: function() {
		if (Q.supportsFullscreen()) return document[Z.fullscreenEnabled];
	} },
	fullscreen: { get: function() {
		if (Q.supportsFullscreen()) return null !== Q.element;
	} }
}), Q.supportsFullscreen = function() {
	if (z(Y)) return Y;
	Y = !1;
	const e = document.body;
	if ("function" == typeof e.requestFullscreen) return Z.requestFullscreen = "requestFullscreen", Z.exitFullscreen = "exitFullscreen", Z.fullscreenEnabled = "fullscreenEnabled", Z.fullscreenElement = "fullscreenElement", Z.fullscreenchange = "fullscreenchange", Z.fullscreenerror = "fullscreenerror", Y = !0, Y;
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
		r = `${o}RequestFullscreen`, "function" == typeof e[r] ? (Z.requestFullscreen = r, Y = !0) : (r = `${o}RequestFullScreen`, "function" == typeof e[r] && (Z.requestFullscreen = r, Y = !0)), r = `${o}ExitFullscreen`, "function" == typeof document[r] ? Z.exitFullscreen = r : (r = `${o}CancelFullScreen`, "function" == typeof document[r] && (Z.exitFullscreen = r)), r = `${o}FullscreenEnabled`, void 0 !== document[r] ? Z.fullscreenEnabled = r : (r = `${o}FullScreenEnabled`, void 0 !== document[r] && (Z.fullscreenEnabled = r)), r = `${o}FullscreenElement`, void 0 !== document[r] ? Z.fullscreenElement = r : (r = `${o}FullScreenElement`, void 0 !== document[r] && (Z.fullscreenElement = r)), r = `${o}fullscreenchange`, void 0 !== document[`on${r}`] && ("ms" === o && (r = "MSFullscreenChange"), Z.fullscreenchange = r), r = `${o}fullscreenerror`, void 0 !== document[`on${r}`] && ("ms" === o && (r = "MSFullscreenError"), Z.fullscreenerror = r);
	}
	return Y;
}, Q.requestFullscreen = function(e, t) {
	Q.supportsFullscreen() && e[Z.requestFullscreen]({ vrDisplay: t });
}, Q.exitFullscreen = function() {
	Q.supportsFullscreen() && document[Z.exitFullscreen]();
}, Q._names = Z, X = "undefined" != typeof navigator ? navigator : {}, Ee._promise = void 0, Ee._result = void 0, Ee.initialize = function() {
	return z(Ee._promise) || (Ee._promise = new Promise((e) => {
		const t = new Image();
		t.onload = function() {
			Ee._result = t.width > 0 && t.height > 0, e(Ee._result);
		}, t.onerror = function() {
			Ee._result = !1, e(Ee._result);
		}, t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
	})), Ee._promise;
}, Object.defineProperties(Ee, { initialized: { get: function() {
	return z(Ee._result);
} } });
const Ae = [];
"undefined" != typeof ArrayBuffer && (Ae.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), "undefined" != typeof Uint8ClampedArray && Ae.push(Uint8ClampedArray), "undefined" != typeof Uint8ClampedArray && Ae.push(Uint8ClampedArray), "undefined" != typeof BigInt64Array && Ae.push(BigInt64Array), "undefined" != typeof BigUint64Array && Ae.push(BigUint64Array));
const we = {
	isChrome: de,
	chromeVersion: function() {
		return de() && ee;
	},
	isSafari: ye,
	safariVersion: function() {
		return ye() && re;
	},
	isWebkit: ge,
	webkitVersion: function() {
		return ge() && oe;
	},
	isEdge: be,
	edgeVersion: function() {
		return be() && se;
	},
	isFirefox: Oe,
	firefoxVersion: function() {
		return Oe() && le;
	},
	isWindows: function() {
		return z(fe) || (fe = /Windows/i.test(X.appVersion)), fe;
	},
	isIPadOrIOS: function() {
		return z(ue) || (ue = "iPhone" === navigator.platform || "iPod" === navigator.platform || "iPad" === navigator.platform), ue;
	},
	hardwareConcurrency: X.hardwareConcurrency ?? 3,
	supportsPointerEvents: function() {
		return z(ce) || (ce = !Oe() && "undefined" != typeof PointerEvent && (!z(X.pointerEnabled) || X.pointerEnabled)), ce;
	},
	supportsImageRenderingPixelated: Ce,
	supportsWebP: Ee,
	imageRenderingValue: function() {
		return Ce() ? he : void 0;
	},
	typedArrayTypes: Ae
};
function Se(e, t, r) {
	return r < 0 && (r += 1), r > 1 && (r -= 1), 6 * r < 1 ? e + 6 * (t - e) * r : 2 * r < 1 ? t : 3 * r < 2 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
we.supportsBasis = function(e) {
	return we.supportsWebAssembly() && e.context.supportsBasis;
}, we.supportsFullscreen = function() {
	return Q.supportsFullscreen();
}, we.supportsTypedArrays = function() {
	return "undefined" != typeof ArrayBuffer;
}, we.supportsBigInt64Array = function() {
	return "undefined" != typeof BigInt64Array;
}, we.supportsBigUint64Array = function() {
	return "undefined" != typeof BigUint64Array;
}, we.supportsBigInt = function() {
	return "undefined" != typeof BigInt;
}, we.supportsWebWorkers = function() {
	return "undefined" != typeof Worker;
}, we.supportsWebAssembly = function() {
	return "undefined" != typeof WebAssembly;
}, we.supportsWebgl2 = function(e) {
	return R.defined("scene", e), e.context.webgl2;
}, we.supportsEsmWebWorkers = function() {
	return !Oe() || parseInt(le) >= 114;
};
var je = class e {
	constructor(e, t, r, n) {
		this.red = e ?? 1, this.green = t ?? 1, this.blue = r ?? 1, this.alpha = n ?? 1;
	}
	static fromCartesian4(t, r) {
		return R.typeOf.object("cartesian", t), z(r) ? (r.red = t.x, r.green = t.y, r.blue = t.z, r.alpha = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static fromBytes(t, r, n, o, i) {
		return t = e.byteToFloat(t ?? 255), r = e.byteToFloat(r ?? 255), n = e.byteToFloat(n ?? 255), o = e.byteToFloat(o ?? 255), z(i) ? (i.red = t, i.green = r, i.blue = n, i.alpha = o, i) : new e(t, r, n, o);
	}
	static fromAlpha(t, r, n) {
		return R.typeOf.object("color", t), R.typeOf.number("alpha", r), z(n) ? (n.red = t.red, n.green = t.green, n.blue = t.blue, n.alpha = r, n) : new e(t.red, t.green, t.blue, r);
	}
	static fromRgba(t, r) {
		return ze[0] = t, e.fromBytes(xe[0], xe[1], xe[2], xe[3], r);
	}
	static fromHsl(t, r, n, o, i) {
		t = (t ?? 0) % 1, o = o ?? 1;
		let s = n = n ?? 0, a = n, l = n;
		if (0 !== (r = r ?? 0)) {
			let e;
			e = n < .5 ? n * (1 + r) : n + r - n * r;
			const o = 2 * n - e;
			s = Se(o, e, t + 1 / 3), a = Se(o, e, t), l = Se(o, e, t - 1 / 3);
		}
		return z(i) ? (i.red = s, i.green = a, i.blue = l, i.alpha = o, i) : new e(s, a, l, o);
	}
	static fromRandom(t, r) {
		let n = (t = t ?? F.EMPTY_OBJECT).red;
		if (!z(n)) {
			const e = t.minimumRed ?? 0, r = t.maximumRed ?? 1;
			R.typeOf.number.lessThanOrEquals("minimumRed", e, r), n = e + T.nextRandomNumber() * (r - e);
		}
		let o = t.green;
		if (!z(o)) {
			const e = t.minimumGreen ?? 0, r = t.maximumGreen ?? 1;
			R.typeOf.number.lessThanOrEquals("minimumGreen", e, r), o = e + T.nextRandomNumber() * (r - e);
		}
		let i = t.blue;
		if (!z(i)) {
			const e = t.minimumBlue ?? 0, r = t.maximumBlue ?? 1;
			R.typeOf.number.lessThanOrEquals("minimumBlue", e, r), i = e + T.nextRandomNumber() * (r - e);
		}
		let s = t.alpha;
		if (!z(s)) {
			const e = t.minimumAlpha ?? 0, r = t.maximumAlpha ?? 1;
			R.typeOf.number.lessThanOrEquals("minimumAlpha", e, r), s = e + T.nextRandomNumber() * (r - e);
		}
		return z(r) ? (r.red = n, r.green = o, r.blue = i, r.alpha = s, r) : new e(n, o, i, s);
	}
	static fromCssColorString(t, r) {
		R.typeOf.string("color", t), z(r) || (r = new e()), t = t.trim();
		const n = e[t.toUpperCase()];
		if (z(n)) return e.clone(n, r), r;
		let o = Re.exec(t);
		return null !== o ? (r.red = parseInt(o[1], 16) / 15, r.green = parseInt(o[2], 16) / 15, r.blue = parseInt(o[3], 16) / 15, r.alpha = parseInt(o[4] ?? "f", 16) / 15, r) : (o = Ie.exec(t), null !== o ? (r.red = parseInt(o[1], 16) / 255, r.green = parseInt(o[2], 16) / 255, r.blue = parseInt(o[3], 16) / 255, r.alpha = parseInt(o[4] ?? "ff", 16) / 255, r) : (o = Le.exec(t), null !== o ? (r.red = parseFloat(o[1]) / ("%" === o[1].substr(-1) ? 100 : 255), r.green = parseFloat(o[2]) / ("%" === o[2].substr(-1) ? 100 : 255), r.blue = parseFloat(o[3]) / ("%" === o[3].substr(-1) ? 100 : 255), r.alpha = parseFloat(o[4] ?? "1.0"), r) : (o = Te.exec(t), null !== o ? e.fromHsl(parseFloat(o[1]) / 360, parseFloat(o[2]) / 100, parseFloat(o[3]) / 100, parseFloat(o[4] ?? "1.0"), r) : r = void 0)));
	}
	static pack(e, t, r) {
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.red, t[r++] = e.green, t[r++] = e.blue, t[r] = e.alpha, t;
	}
	static unpack(t, r, n) {
		return R.defined("array", t), r = r ?? 0, z(n) || (n = new e()), n.red = t[r++], n.green = t[r++], n.blue = t[r++], n.alpha = t[r], n;
	}
	static byteToFloat(e) {
		return e / 255;
	}
	static floatToByte(e) {
		return 1 === e ? 255 : 256 * e | 0;
	}
	static clone(t, r) {
		if (z(t)) return z(r) ? (r.red = t.red, r.green = t.green, r.blue = t.blue, r.alpha = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static equals(e, t) {
		return e === t || z(e) && z(t) && e.red === t.red && e.green === t.green && e.blue === t.blue && e.alpha === t.alpha;
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
		return this === e || z(e) && Math.abs(this.red - e.red) <= t && Math.abs(this.green - e.green) <= t && Math.abs(this.blue - e.blue) <= t && Math.abs(this.alpha - e.alpha) <= t;
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
		return z(t) ? (t[0] = r, t[1] = n, t[2] = o, t[3] = i, t) : [
			r,
			n,
			o,
			i
		];
	}
	static bytesToRgba(e, t, r, n) {
		return xe[0] = e, xe[1] = t, xe[2] = r, xe[3] = n, ze[0];
	}
	toRgba() {
		return e.bytesToRgba(e.floatToByte(this.red), e.floatToByte(this.green), e.floatToByte(this.blue), e.floatToByte(this.alpha));
	}
	brighten(e, t) {
		return R.typeOf.number("magnitude", e), R.typeOf.number.greaterThanOrEquals("magnitude", e, 0), R.typeOf.object("result", t), e = 1 - e, t.red = 1 - (1 - this.red) * e, t.green = 1 - (1 - this.green) * e, t.blue = 1 - (1 - this.blue) * e, t.alpha = this.alpha, t;
	}
	darken(e, t) {
		return R.typeOf.number("magnitude", e), R.typeOf.number.greaterThanOrEquals("magnitude", e, 0), R.typeOf.object("result", t), e = 1 - e, t.red = this.red * e, t.green = this.green * e, t.blue = this.blue * e, t.alpha = this.alpha, t;
	}
	withAlpha(t, r) {
		return e.fromAlpha(this, t, r);
	}
	static add(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.red = e.red + t.red, r.green = e.green + t.green, r.blue = e.blue + t.blue, r.alpha = e.alpha + t.alpha, r;
	}
	static subtract(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.red = e.red - t.red, r.green = e.green - t.green, r.blue = e.blue - t.blue, r.alpha = e.alpha - t.alpha, r;
	}
	static multiply(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.red = e.red * t.red, r.green = e.green * t.green, r.blue = e.blue * t.blue, r.alpha = e.alpha * t.alpha, r;
	}
	static divide(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.red = e.red / t.red, r.green = e.green / t.green, r.blue = e.blue / t.blue, r.alpha = e.alpha / t.alpha, r;
	}
	static mod(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.red = e.red % t.red, r.green = e.green % t.green, r.blue = e.blue % t.blue, r.alpha = e.alpha % t.alpha, r;
	}
	static lerp(e, t, r, n) {
		return R.typeOf.object("start", e), R.typeOf.object("end", t), R.typeOf.number("t", r), R.typeOf.object("result", n), n.red = T.lerp(e.red, t.red, r), n.green = T.lerp(e.green, t.green, r), n.blue = T.lerp(e.blue, t.blue, r), n.alpha = T.lerp(e.alpha, t.alpha, r), n;
	}
	static multiplyByScalar(e, t, r) {
		return R.typeOf.object("color", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.red = e.red * t, r.green = e.green * t, r.blue = e.blue * t, r.alpha = e.alpha * t, r;
	}
	static divideByScalar(e, t, r) {
		return R.typeOf.object("color", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.red = e.red / t, r.green = e.green / t, r.blue = e.blue / t, r.alpha = e.alpha / t, r;
	}
};
let Fe, ze, xe;
we.supportsTypedArrays() && (Fe = /* @__PURE__ */ new ArrayBuffer(4), ze = new Uint32Array(Fe), xe = new Uint8Array(Fe));
const Re = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i, Ie = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i, Le = /^rgba?\s*\(\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i, Te = /^hsla?\s*\(\s*([0-9.]+)\s*[,\s]+\s*([0-9.]+%)\s*[,\s]+\s*([0-9.]+%)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
function Ne(e, t) {
	e = e ?? 0, this._near = e, t = t ?? Number.MAX_VALUE, this._far = t;
}
je.packedLength = 4, je.ALICEBLUE = Object.freeze(je.fromCssColorString("#F0F8FF")), je.ANTIQUEWHITE = Object.freeze(je.fromCssColorString("#FAEBD7")), je.AQUA = Object.freeze(je.fromCssColorString("#00FFFF")), je.AQUAMARINE = Object.freeze(je.fromCssColorString("#7FFFD4")), je.AZURE = Object.freeze(je.fromCssColorString("#F0FFFF")), je.BEIGE = Object.freeze(je.fromCssColorString("#F5F5DC")), je.BISQUE = Object.freeze(je.fromCssColorString("#FFE4C4")), je.BLACK = Object.freeze(je.fromCssColorString("#000000")), je.BLANCHEDALMOND = Object.freeze(je.fromCssColorString("#FFEBCD")), je.BLUE = Object.freeze(je.fromCssColorString("#0000FF")), je.BLUEVIOLET = Object.freeze(je.fromCssColorString("#8A2BE2")), je.BROWN = Object.freeze(je.fromCssColorString("#A52A2A")), je.BURLYWOOD = Object.freeze(je.fromCssColorString("#DEB887")), je.CADETBLUE = Object.freeze(je.fromCssColorString("#5F9EA0")), je.CHARTREUSE = Object.freeze(je.fromCssColorString("#7FFF00")), je.CHOCOLATE = Object.freeze(je.fromCssColorString("#D2691E")), je.CORAL = Object.freeze(je.fromCssColorString("#FF7F50")), je.CORNFLOWERBLUE = Object.freeze(je.fromCssColorString("#6495ED")), je.CORNSILK = Object.freeze(je.fromCssColorString("#FFF8DC")), je.CRIMSON = Object.freeze(je.fromCssColorString("#DC143C")), je.CYAN = Object.freeze(je.fromCssColorString("#00FFFF")), je.DARKBLUE = Object.freeze(je.fromCssColorString("#00008B")), je.DARKCYAN = Object.freeze(je.fromCssColorString("#008B8B")), je.DARKGOLDENROD = Object.freeze(je.fromCssColorString("#B8860B")), je.DARKGRAY = Object.freeze(je.fromCssColorString("#A9A9A9")), je.DARKGREEN = Object.freeze(je.fromCssColorString("#006400")), je.DARKGREY = je.DARKGRAY, je.DARKKHAKI = Object.freeze(je.fromCssColorString("#BDB76B")), je.DARKMAGENTA = Object.freeze(je.fromCssColorString("#8B008B")), je.DARKOLIVEGREEN = Object.freeze(je.fromCssColorString("#556B2F")), je.DARKORANGE = Object.freeze(je.fromCssColorString("#FF8C00")), je.DARKORCHID = Object.freeze(je.fromCssColorString("#9932CC")), je.DARKRED = Object.freeze(je.fromCssColorString("#8B0000")), je.DARKSALMON = Object.freeze(je.fromCssColorString("#E9967A")), je.DARKSEAGREEN = Object.freeze(je.fromCssColorString("#8FBC8F")), je.DARKSLATEBLUE = Object.freeze(je.fromCssColorString("#483D8B")), je.DARKSLATEGRAY = Object.freeze(je.fromCssColorString("#2F4F4F")), je.DARKSLATEGREY = je.DARKSLATEGRAY, je.DARKTURQUOISE = Object.freeze(je.fromCssColorString("#00CED1")), je.DARKVIOLET = Object.freeze(je.fromCssColorString("#9400D3")), je.DEEPPINK = Object.freeze(je.fromCssColorString("#FF1493")), je.DEEPSKYBLUE = Object.freeze(je.fromCssColorString("#00BFFF")), je.DIMGRAY = Object.freeze(je.fromCssColorString("#696969")), je.DIMGREY = je.DIMGRAY, je.DODGERBLUE = Object.freeze(je.fromCssColorString("#1E90FF")), je.FIREBRICK = Object.freeze(je.fromCssColorString("#B22222")), je.FLORALWHITE = Object.freeze(je.fromCssColorString("#FFFAF0")), je.FORESTGREEN = Object.freeze(je.fromCssColorString("#228B22")), je.FUCHSIA = Object.freeze(je.fromCssColorString("#FF00FF")), je.GAINSBORO = Object.freeze(je.fromCssColorString("#DCDCDC")), je.GHOSTWHITE = Object.freeze(je.fromCssColorString("#F8F8FF")), je.GOLD = Object.freeze(je.fromCssColorString("#FFD700")), je.GOLDENROD = Object.freeze(je.fromCssColorString("#DAA520")), je.GRAY = Object.freeze(je.fromCssColorString("#808080")), je.GREEN = Object.freeze(je.fromCssColorString("#008000")), je.GREENYELLOW = Object.freeze(je.fromCssColorString("#ADFF2F")), je.GREY = je.GRAY, je.HONEYDEW = Object.freeze(je.fromCssColorString("#F0FFF0")), je.HOTPINK = Object.freeze(je.fromCssColorString("#FF69B4")), je.INDIANRED = Object.freeze(je.fromCssColorString("#CD5C5C")), je.INDIGO = Object.freeze(je.fromCssColorString("#4B0082")), je.IVORY = Object.freeze(je.fromCssColorString("#FFFFF0")), je.KHAKI = Object.freeze(je.fromCssColorString("#F0E68C")), je.LAVENDER = Object.freeze(je.fromCssColorString("#E6E6FA")), je.LAVENDAR_BLUSH = Object.freeze(je.fromCssColorString("#FFF0F5")), je.LAWNGREEN = Object.freeze(je.fromCssColorString("#7CFC00")), je.LEMONCHIFFON = Object.freeze(je.fromCssColorString("#FFFACD")), je.LIGHTBLUE = Object.freeze(je.fromCssColorString("#ADD8E6")), je.LIGHTCORAL = Object.freeze(je.fromCssColorString("#F08080")), je.LIGHTCYAN = Object.freeze(je.fromCssColorString("#E0FFFF")), je.LIGHTGOLDENRODYELLOW = Object.freeze(je.fromCssColorString("#FAFAD2")), je.LIGHTGRAY = Object.freeze(je.fromCssColorString("#D3D3D3")), je.LIGHTGREEN = Object.freeze(je.fromCssColorString("#90EE90")), je.LIGHTGREY = je.LIGHTGRAY, je.LIGHTPINK = Object.freeze(je.fromCssColorString("#FFB6C1")), je.LIGHTSEAGREEN = Object.freeze(je.fromCssColorString("#20B2AA")), je.LIGHTSKYBLUE = Object.freeze(je.fromCssColorString("#87CEFA")), je.LIGHTSLATEGRAY = Object.freeze(je.fromCssColorString("#778899")), je.LIGHTSLATEGREY = je.LIGHTSLATEGRAY, je.LIGHTSTEELBLUE = Object.freeze(je.fromCssColorString("#B0C4DE")), je.LIGHTYELLOW = Object.freeze(je.fromCssColorString("#FFFFE0")), je.LIME = Object.freeze(je.fromCssColorString("#00FF00")), je.LIMEGREEN = Object.freeze(je.fromCssColorString("#32CD32")), je.LINEN = Object.freeze(je.fromCssColorString("#FAF0E6")), je.MAGENTA = Object.freeze(je.fromCssColorString("#FF00FF")), je.MAROON = Object.freeze(je.fromCssColorString("#800000")), je.MEDIUMAQUAMARINE = Object.freeze(je.fromCssColorString("#66CDAA")), je.MEDIUMBLUE = Object.freeze(je.fromCssColorString("#0000CD")), je.MEDIUMORCHID = Object.freeze(je.fromCssColorString("#BA55D3")), je.MEDIUMPURPLE = Object.freeze(je.fromCssColorString("#9370DB")), je.MEDIUMSEAGREEN = Object.freeze(je.fromCssColorString("#3CB371")), je.MEDIUMSLATEBLUE = Object.freeze(je.fromCssColorString("#7B68EE")), je.MEDIUMSPRINGGREEN = Object.freeze(je.fromCssColorString("#00FA9A")), je.MEDIUMTURQUOISE = Object.freeze(je.fromCssColorString("#48D1CC")), je.MEDIUMVIOLETRED = Object.freeze(je.fromCssColorString("#C71585")), je.MIDNIGHTBLUE = Object.freeze(je.fromCssColorString("#191970")), je.MINTCREAM = Object.freeze(je.fromCssColorString("#F5FFFA")), je.MISTYROSE = Object.freeze(je.fromCssColorString("#FFE4E1")), je.MOCCASIN = Object.freeze(je.fromCssColorString("#FFE4B5")), je.NAVAJOWHITE = Object.freeze(je.fromCssColorString("#FFDEAD")), je.NAVY = Object.freeze(je.fromCssColorString("#000080")), je.OLDLACE = Object.freeze(je.fromCssColorString("#FDF5E6")), je.OLIVE = Object.freeze(je.fromCssColorString("#808000")), je.OLIVEDRAB = Object.freeze(je.fromCssColorString("#6B8E23")), je.ORANGE = Object.freeze(je.fromCssColorString("#FFA500")), je.ORANGERED = Object.freeze(je.fromCssColorString("#FF4500")), je.ORCHID = Object.freeze(je.fromCssColorString("#DA70D6")), je.PALEGOLDENROD = Object.freeze(je.fromCssColorString("#EEE8AA")), je.PALEGREEN = Object.freeze(je.fromCssColorString("#98FB98")), je.PALETURQUOISE = Object.freeze(je.fromCssColorString("#AFEEEE")), je.PALEVIOLETRED = Object.freeze(je.fromCssColorString("#DB7093")), je.PAPAYAWHIP = Object.freeze(je.fromCssColorString("#FFEFD5")), je.PEACHPUFF = Object.freeze(je.fromCssColorString("#FFDAB9")), je.PERU = Object.freeze(je.fromCssColorString("#CD853F")), je.PINK = Object.freeze(je.fromCssColorString("#FFC0CB")), je.PLUM = Object.freeze(je.fromCssColorString("#DDA0DD")), je.POWDERBLUE = Object.freeze(je.fromCssColorString("#B0E0E6")), je.PURPLE = Object.freeze(je.fromCssColorString("#800080")), je.RED = Object.freeze(je.fromCssColorString("#FF0000")), je.ROSYBROWN = Object.freeze(je.fromCssColorString("#BC8F8F")), je.ROYALBLUE = Object.freeze(je.fromCssColorString("#4169E1")), je.SADDLEBROWN = Object.freeze(je.fromCssColorString("#8B4513")), je.SALMON = Object.freeze(je.fromCssColorString("#FA8072")), je.SANDYBROWN = Object.freeze(je.fromCssColorString("#F4A460")), je.SEAGREEN = Object.freeze(je.fromCssColorString("#2E8B57")), je.SEASHELL = Object.freeze(je.fromCssColorString("#FFF5EE")), je.SIENNA = Object.freeze(je.fromCssColorString("#A0522D")), je.SILVER = Object.freeze(je.fromCssColorString("#C0C0C0")), je.SKYBLUE = Object.freeze(je.fromCssColorString("#87CEEB")), je.SLATEBLUE = Object.freeze(je.fromCssColorString("#6A5ACD")), je.SLATEGRAY = Object.freeze(je.fromCssColorString("#708090")), je.SLATEGREY = je.SLATEGRAY, je.SNOW = Object.freeze(je.fromCssColorString("#FFFAFA")), je.SPRINGGREEN = Object.freeze(je.fromCssColorString("#00FF7F")), je.STEELBLUE = Object.freeze(je.fromCssColorString("#4682B4")), je.TAN = Object.freeze(je.fromCssColorString("#D2B48C")), je.TEAL = Object.freeze(je.fromCssColorString("#008080")), je.THISTLE = Object.freeze(je.fromCssColorString("#D8BFD8")), je.TOMATO = Object.freeze(je.fromCssColorString("#FF6347")), je.TURQUOISE = Object.freeze(je.fromCssColorString("#40E0D0")), je.VIOLET = Object.freeze(je.fromCssColorString("#EE82EE")), je.WHEAT = Object.freeze(je.fromCssColorString("#F5DEB3")), je.WHITE = Object.freeze(je.fromCssColorString("#FFFFFF")), je.WHITESMOKE = Object.freeze(je.fromCssColorString("#F5F5F5")), je.YELLOW = Object.freeze(je.fromCssColorString("#FFFF00")), je.YELLOWGREEN = Object.freeze(je.fromCssColorString("#9ACD32")), je.TRANSPARENT = Object.freeze(new je(0, 0, 0, 0)), Object.defineProperties(Ne.prototype, {
	near: {
		get: function() {
			return this._near;
		},
		set: function(e) {
			this._near = e;
		}
	},
	far: {
		get: function() {
			return this._far;
		},
		set: function(e) {
			this._far = e;
		}
	}
}), Ne.packedLength = 2, Ne.pack = function(e, t, r) {
	if (!z(e)) throw new x("value is required");
	if (!z(t)) throw new x("array is required");
	return r = r ?? 0, t[r++] = e.near, t[r] = e.far, t;
}, Ne.unpack = function(e, t, r) {
	if (!z(e)) throw new x("array is required");
	return t = t ?? 0, z(r) || (r = new Ne()), r.near = e[t++], r.far = e[t], r;
}, Ne.equals = function(e, t) {
	return e === t || z(e) && z(t) && e.near === t.near && e.far === t.far;
}, Ne.clone = function(e, t) {
	if (z(e)) return z(t) || (t = new Ne()), t.near = e.near, t.far = e.far, t;
}, Ne.prototype.clone = function(e) {
	return Ne.clone(this, e);
}, Ne.prototype.equals = function(e) {
	return Ne.equals(this, e);
};
const _e = {
	NONE: 0,
	CLAMP_TO_GROUND: 1,
	RELATIVE_TO_GROUND: 2,
	CLAMP_TO_TERRAIN: 3,
	RELATIVE_TO_TERRAIN: 4,
	CLAMP_TO_3D_TILE: 5,
	RELATIVE_TO_3D_TILE: 6
};
Object.freeze(_e);
const De = {
	CENTER: 0,
	LEFT: 1,
	RIGHT: -1
};
Object.freeze(De);
const Me = {
	CENTER: 0,
	BOTTOM: 1,
	BASELINE: 2,
	TOP: -1
};
Object.freeze(Me);
const Be = {
	FILL: 0,
	OUTLINE: 1,
	FILL_AND_OUTLINE: 2
};
Object.freeze(Be);
const Pe = [
	Int8Array,
	Uint8Array,
	Uint8ClampedArray,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array
], ve = /* @__PURE__ */ new Uint32Array(96);
var Ue = class e {
	static from(t) {
		if (!t || void 0 === t.byteLength || t.buffer) throw new Error("Data must be an instance of ArrayBuffer or SharedArrayBuffer.");
		const [r, n] = new Uint8Array(t, 0, 2);
		if (219 !== r) throw new Error("Data does not appear to be in a KDBush format.");
		const o = n >> 4;
		if (1 !== o) throw new Error(`Got v${o} data when expected v1.`);
		const i = Pe[15 & n];
		if (!i) throw new Error("Unrecognized array type.");
		const [s] = new Uint16Array(t, 2, 1), [a] = new Uint32Array(t, 4, 1);
		return new e(a, s, i, void 0, t);
	}
	constructor(e, t = 64, r = Float64Array, n = ArrayBuffer, o) {
		if (isNaN(e) || e < 0) throw new Error(`Unexpected numItems value: ${e}.`);
		this.numItems = +e, this.nodeSize = Math.min(Math.max(+t, 2), 65535), this.ArrayType = r, this.IndexArrayType = e < 65536 ? Uint16Array : Uint32Array;
		const i = Pe.indexOf(this.ArrayType), s = 2 * e * this.ArrayType.BYTES_PER_ELEMENT, a = e * this.IndexArrayType.BYTES_PER_ELEMENT, l = (8 - a % 8) % 8;
		if (i < 0) throw new Error(`Unexpected typed array class: ${r}.`);
		if (o) this.data = o, this.ids = new this.IndexArrayType(o, 8, e), this.coords = new r(o, 8 + a + l, 2 * e), this._pos = 2 * e, this._finished = !0;
		else {
			const o = this.data = new n(8 + s + a + l);
			this.ids = new this.IndexArrayType(o, 8, e), this.coords = new r(o, 8 + a + l, 2 * e), this._pos = 0, this._finished = !1, new Uint8Array(o, 0, 2).set([219, 16 + i]), new Uint16Array(o, 2, 1)[0] = t, new Uint32Array(o, 4, 1)[0] = e;
		}
	}
	add(e, t) {
		const r = this._pos >> 1;
		return this.ids[r] = r, this.coords[this._pos++] = e, this.coords[this._pos++] = t, r;
	}
	finish() {
		const e = this._pos >> 1;
		if (e !== this.numItems) throw new Error(`Added ${e} items when expected ${this.numItems}.`);
		return qe(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0), this._finished = !0, this;
	}
	range(e, t, r, n) {
		if (!this._finished) throw new Error("Data not yet indexed - call index.finish().");
		const { ids: o, coords: i, nodeSize: s } = this;
		ve[0] = 0, ve[1] = o.length - 1, ve[2] = 0;
		let a = 3;
		const l = [];
		for (; a > 0;) {
			const f = ve[--a], u = ve[--a], c = ve[--a];
			if (u - c <= s) {
				for (let s = c; s <= u; s++) {
					const a = i[2 * s], f = i[2 * s + 1];
					a >= e && a <= r && f >= t && f <= n && l.push(o[s]);
				}
				continue;
			}
			const h = c + u >> 1, p = i[2 * h], m = i[2 * h + 1];
			p >= e && p <= r && m >= t && m <= n && l.push(o[h]), (0 === f ? e <= p : t <= m) && (ve[a++] = c, ve[a++] = h - 1, ve[a++] = 1 - f), (0 === f ? r >= p : n >= m) && (ve[a++] = h + 1, ve[a++] = u, ve[a++] = 1 - f);
		}
		return l;
	}
	within(e, t, r) {
		const n = [];
		return this.withinInto(e, t, r, n), n;
	}
	withinInto(e, t, r, n) {
		if (!this._finished) throw new Error("Data not yet indexed - call index.finish().");
		const { ids: o, coords: i, nodeSize: s } = this;
		ve[0] = 0, ve[1] = o.length - 1, ve[2] = 0;
		let a = 3, l = 0;
		const f = r * r;
		for (; a > 0;) {
			const u = ve[--a], c = ve[--a], h = ve[--a];
			if (c - h <= s) {
				for (let r = h; r <= c; r++) $e(i[2 * r], i[2 * r + 1], e, t) <= f && (n[l++] = o[r]);
				continue;
			}
			const p = h + c >> 1, m = i[2 * p], d = i[2 * p + 1];
			$e(m, d, e, t) <= f && (n[l++] = o[p]), (0 === u ? e - r <= m : t - r <= d) && (ve[a++] = h, ve[a++] = p - 1, ve[a++] = 1 - u), (0 === u ? e + r >= m : t + r >= d) && (ve[a++] = p + 1, ve[a++] = c, ve[a++] = 1 - u);
		}
		return l;
	}
};
function qe(e, t, r, n, o, i) {
	if (o - n <= r) return;
	const s = n + o >> 1;
	Ge(e, t, s, n, o, i), qe(e, t, r, n, s - 1, 1 - i), qe(e, t, r, s + 1, o, 1 - i);
}
function Ge(e, t, r, n, o, i) {
	for (; o > n;) {
		if (o - n > 600) {
			const s = o - n + 1, a = r - n + 1, l = Math.log(s), f = .5 * Math.exp(2 * l / 3), u = .5 * Math.sqrt(l * f * (s - f) / s) * (a - s / 2 < 0 ? -1 : 1);
			Ge(e, t, r, Math.max(n, Math.floor(r - a * f / s + u)), Math.min(o, Math.floor(r + (s - a) * f / s + u)), i);
		}
		const s = t[2 * r + i];
		let a = n, l = o;
		for (ke(e, t, n, r), t[2 * o + i] > s && ke(e, t, n, o); a < l;) {
			for (ke(e, t, a, l), a++, l--; t[2 * a + i] < s;) a++;
			for (; t[2 * l + i] > s;) l--;
		}
		t[2 * n + i] === s ? ke(e, t, n, l) : (l++, ke(e, t, l, o)), l <= r && (n = l + 1), r <= l && (o = l - 1);
	}
}
function ke(e, t, r, n) {
	We(e, r, n), We(t, 2 * r, 2 * n), We(t, 2 * r + 1, 2 * n + 1);
}
function We(e, t, r) {
	const n = e[t];
	e[t] = e[r], e[r] = n;
}
function $e(e, t, r, n) {
	const o = e - r, i = t - n;
	return o * o + i * i;
}
function He(e, t) {
	return toString.call(e) === `[object ${t}]`;
}
function Ye(e) {
	return He(e, "String");
}
function Ve(e) {
	return He(e, "Number");
}
function Ke(e) {
	return void 0 !== e;
}
function Ze(e = {}, t = {}) {
	let r;
	for (r in t) e[r] = t[r];
	return e;
}
s((e, t) => {
	(function(r) {
		if ("object" == typeof e) t.exports = r();
		else if ("function" == typeof define && define.amd) define(r);
		else {
			var n;
			try {
				n = window;
			} catch (e) {
				n = self;
			}
			n.SparkMD5 = r();
		}
	})(function(e) {
		var t = [
			"0",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"a",
			"b",
			"c",
			"d",
			"e",
			"f"
		];
		function r(e, t) {
			var r = e[0], n = e[1], o = e[2], i = e[3];
			n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n & o | ~n & i) + t[0] - 680876936 | 0) << 7 | r >>> 25) + n | 0) & n | ~r & o) + t[1] - 389564586 | 0) << 12 | i >>> 20) + r | 0) & r | ~i & n) + t[2] + 606105819 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & r) + t[3] - 1044525330 | 0) << 22 | n >>> 10) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n & o | ~n & i) + t[4] - 176418897 | 0) << 7 | r >>> 25) + n | 0) & n | ~r & o) + t[5] + 1200080426 | 0) << 12 | i >>> 20) + r | 0) & r | ~i & n) + t[6] - 1473231341 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & r) + t[7] - 45705983 | 0) << 22 | n >>> 10) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n & o | ~n & i) + t[8] + 1770035416 | 0) << 7 | r >>> 25) + n | 0) & n | ~r & o) + t[9] - 1958414417 | 0) << 12 | i >>> 20) + r | 0) & r | ~i & n) + t[10] - 42063 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & r) + t[11] - 1990404162 | 0) << 22 | n >>> 10) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n & o | ~n & i) + t[12] + 1804603682 | 0) << 7 | r >>> 25) + n | 0) & n | ~r & o) + t[13] - 40341101 | 0) << 12 | i >>> 20) + r | 0) & r | ~i & n) + t[14] - 1502002290 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & r) + t[15] + 1236535329 | 0) << 22 | n >>> 10) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n & i | o & ~i) + t[1] - 165796510 | 0) << 5 | r >>> 27) + n | 0) & o | n & ~o) + t[6] - 1069501632 | 0) << 9 | i >>> 23) + r | 0) & n | r & ~n) + t[11] + 643717713 | 0) << 14 | o >>> 18) + i | 0) & r | i & ~r) + t[0] - 373897302 | 0) << 20 | n >>> 12) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n & i | o & ~i) + t[5] - 701558691 | 0) << 5 | r >>> 27) + n | 0) & o | n & ~o) + t[10] + 38016083 | 0) << 9 | i >>> 23) + r | 0) & n | r & ~n) + t[15] - 660478335 | 0) << 14 | o >>> 18) + i | 0) & r | i & ~r) + t[4] - 405537848 | 0) << 20 | n >>> 12) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n & i | o & ~i) + t[9] + 568446438 | 0) << 5 | r >>> 27) + n | 0) & o | n & ~o) + t[14] - 1019803690 | 0) << 9 | i >>> 23) + r | 0) & n | r & ~n) + t[3] - 187363961 | 0) << 14 | o >>> 18) + i | 0) & r | i & ~r) + t[8] + 1163531501 | 0) << 20 | n >>> 12) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n & i | o & ~i) + t[13] - 1444681467 | 0) << 5 | r >>> 27) + n | 0) & o | n & ~o) + t[2] - 51403784 | 0) << 9 | i >>> 23) + r | 0) & n | r & ~n) + t[7] + 1735328473 | 0) << 14 | o >>> 18) + i | 0) & r | i & ~r) + t[12] - 1926607734 | 0) << 20 | n >>> 12) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n ^ o ^ i) + t[5] - 378558 | 0) << 4 | r >>> 28) + n | 0) ^ n ^ o) + t[8] - 2022574463 | 0) << 11 | i >>> 21) + r | 0) ^ r ^ n) + t[11] + 1839030562 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ r) + t[14] - 35309556 | 0) << 23 | n >>> 9) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n ^ o ^ i) + t[1] - 1530992060 | 0) << 4 | r >>> 28) + n | 0) ^ n ^ o) + t[4] + 1272893353 | 0) << 11 | i >>> 21) + r | 0) ^ r ^ n) + t[7] - 155497632 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ r) + t[10] - 1094730640 | 0) << 23 | n >>> 9) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n ^ o ^ i) + t[13] + 681279174 | 0) << 4 | r >>> 28) + n | 0) ^ n ^ o) + t[0] - 358537222 | 0) << 11 | i >>> 21) + r | 0) ^ r ^ n) + t[3] - 722521979 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ r) + t[6] + 76029189 | 0) << 23 | n >>> 9) + o | 0, n = ((n += ((o = ((o += ((i = ((i += ((r = ((r += (n ^ o ^ i) + t[9] - 640364487 | 0) << 4 | r >>> 28) + n | 0) ^ n ^ o) + t[12] - 421815835 | 0) << 11 | i >>> 21) + r | 0) ^ r ^ n) + t[15] + 530742520 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ r) + t[2] - 995338651 | 0) << 23 | n >>> 9) + o | 0, n = ((n += ((i = ((i += (n ^ ((r = ((r += (o ^ (n | ~i)) + t[0] - 198630844 | 0) << 6 | r >>> 26) + n | 0) | ~o)) + t[7] + 1126891415 | 0) << 10 | i >>> 22) + r | 0) ^ ((o = ((o += (r ^ (i | ~n)) + t[14] - 1416354905 | 0) << 15 | o >>> 17) + i | 0) | ~r)) + t[5] - 57434055 | 0) << 21 | n >>> 11) + o | 0, n = ((n += ((i = ((i += (n ^ ((r = ((r += (o ^ (n | ~i)) + t[12] + 1700485571 | 0) << 6 | r >>> 26) + n | 0) | ~o)) + t[3] - 1894986606 | 0) << 10 | i >>> 22) + r | 0) ^ ((o = ((o += (r ^ (i | ~n)) + t[10] - 1051523 | 0) << 15 | o >>> 17) + i | 0) | ~r)) + t[1] - 2054922799 | 0) << 21 | n >>> 11) + o | 0, n = ((n += ((i = ((i += (n ^ ((r = ((r += (o ^ (n | ~i)) + t[8] + 1873313359 | 0) << 6 | r >>> 26) + n | 0) | ~o)) + t[15] - 30611744 | 0) << 10 | i >>> 22) + r | 0) ^ ((o = ((o += (r ^ (i | ~n)) + t[6] - 1560198380 | 0) << 15 | o >>> 17) + i | 0) | ~r)) + t[13] + 1309151649 | 0) << 21 | n >>> 11) + o | 0, n = ((n += ((i = ((i += (n ^ ((r = ((r += (o ^ (n | ~i)) + t[4] - 145523070 | 0) << 6 | r >>> 26) + n | 0) | ~o)) + t[11] - 1120210379 | 0) << 10 | i >>> 22) + r | 0) ^ ((o = ((o += (r ^ (i | ~n)) + t[2] + 718787259 | 0) << 15 | o >>> 17) + i | 0) | ~r)) + t[9] - 343485551 | 0) << 21 | n >>> 11) + o | 0, e[0] = r + e[0] | 0, e[1] = n + e[1] | 0, e[2] = o + e[2] | 0, e[3] = i + e[3] | 0;
		}
		function n(e) {
			var t, r = [];
			for (t = 0; t < 64; t += 4) r[t >> 2] = e.charCodeAt(t) + (e.charCodeAt(t + 1) << 8) + (e.charCodeAt(t + 2) << 16) + (e.charCodeAt(t + 3) << 24);
			return r;
		}
		function o(e) {
			var t, r = [];
			for (t = 0; t < 64; t += 4) r[t >> 2] = e[t] + (e[t + 1] << 8) + (e[t + 2] << 16) + (e[t + 3] << 24);
			return r;
		}
		function i(e) {
			var t, o, i, s, a, l, f = e.length, u = [
				1732584193,
				-271733879,
				-1732584194,
				271733878
			];
			for (t = 64; t <= f; t += 64) r(u, n(e.substring(t - 64, t)));
			for (o = (e = e.substring(t - 64)).length, i = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			], t = 0; t < o; t += 1) i[t >> 2] |= e.charCodeAt(t) << (t % 4 << 3);
			if (i[t >> 2] |= 128 << (t % 4 << 3), t > 55) for (r(u, i), t = 0; t < 16; t += 1) i[t] = 0;
			return s = (s = 8 * f).toString(16).match(/(.*?)(.{0,8})$/), a = parseInt(s[2], 16), l = parseInt(s[1], 16) || 0, i[14] = a, i[15] = l, r(u, i), u;
		}
		function s(e) {
			var r, n = "";
			for (r = 0; r < 4; r += 1) n += t[e >> 8 * r + 4 & 15] + t[e >> 8 * r & 15];
			return n;
		}
		function a(e) {
			var t;
			for (t = 0; t < e.length; t += 1) e[t] = s(e[t]);
			return e.join("");
		}
		function l(e) {
			return /[\u0080-\uFFFF]/.test(e) && (e = unescape(encodeURIComponent(e))), e;
		}
		function f(e) {
			var t, r = [], n = e.length;
			for (t = 0; t < n - 1; t += 2) r.push(parseInt(e.substr(t, 2), 16));
			return String.fromCharCode.apply(String, r);
		}
		function u() {
			this.reset();
		}
		return a(i("hello")), "undefined" == typeof ArrayBuffer || ArrayBuffer.prototype.slice || function() {
			function t(e, t) {
				return (e = 0 | e || 0) < 0 ? Math.max(e + t, 0) : Math.min(e, t);
			}
			ArrayBuffer.prototype.slice = function(r, n) {
				var o, i, s, a, l = this.byteLength, f = t(r, l), u = l;
				return n !== e && (u = t(n, l)), f > u ? /* @__PURE__ */ new ArrayBuffer(0) : (o = u - f, i = new ArrayBuffer(o), s = new Uint8Array(i), a = new Uint8Array(this, f, o), s.set(a), i);
			};
		}(), u.prototype.append = function(e) {
			return this.appendBinary(l(e)), this;
		}, u.prototype.appendBinary = function(e) {
			this._buff += e, this._length += e.length;
			var t, o = this._buff.length;
			for (t = 64; t <= o; t += 64) r(this._hash, n(this._buff.substring(t - 64, t)));
			return this._buff = this._buff.substring(t - 64), this;
		}, u.prototype.end = function(e) {
			var t, r, n = this._buff, o = n.length, i = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
			for (t = 0; t < o; t += 1) i[t >> 2] |= n.charCodeAt(t) << (t % 4 << 3);
			return this._finish(i, o), r = a(this._hash), e && (r = f(r)), this.reset(), r;
		}, u.prototype.reset = function() {
			return this._buff = "", this._length = 0, this._hash = [
				1732584193,
				-271733879,
				-1732584194,
				271733878
			], this;
		}, u.prototype.getState = function() {
			return {
				buff: this._buff,
				length: this._length,
				hash: this._hash.slice()
			};
		}, u.prototype.setState = function(e) {
			return this._buff = e.buff, this._length = e.length, this._hash = e.hash, this;
		}, u.prototype.destroy = function() {
			delete this._hash, delete this._buff, delete this._length;
		}, u.prototype._finish = function(e, t) {
			var n, o, i, s = t;
			if (e[s >> 2] |= 128 << (s % 4 << 3), s > 55) for (r(this._hash, e), s = 0; s < 16; s += 1) e[s] = 0;
			n = (n = 8 * this._length).toString(16).match(/(.*?)(.{0,8})$/), o = parseInt(n[2], 16), i = parseInt(n[1], 16) || 0, e[14] = o, e[15] = i, r(this._hash, e);
		}, u.hash = function(e, t) {
			return u.hashBinary(l(e), t);
		}, u.hashBinary = function(e, t) {
			var r = a(i(e));
			return t ? f(r) : r;
		}, u.ArrayBuffer = function() {
			this.reset();
		}, u.ArrayBuffer.prototype.append = function(e) {
			var t, n, i, s, a = (n = this._buff.buffer, i = e, (s = new Uint8Array(n.byteLength + i.byteLength)).set(new Uint8Array(n)), s.set(new Uint8Array(i), n.byteLength), s), l = a.length;
			for (this._length += e.byteLength, t = 64; t <= l; t += 64) r(this._hash, o(a.subarray(t - 64, t)));
			return this._buff = t - 64 < l ? new Uint8Array(a.buffer.slice(t - 64)) : /* @__PURE__ */ new Uint8Array(0), this;
		}, u.ArrayBuffer.prototype.end = function(e) {
			var t, r, n = this._buff, o = n.length, i = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
			for (t = 0; t < o; t += 1) i[t >> 2] |= n[t] << (t % 4 << 3);
			return this._finish(i, o), r = a(this._hash), e && (r = f(r)), this.reset(), r;
		}, u.ArrayBuffer.prototype.reset = function() {
			return this._buff = /* @__PURE__ */ new Uint8Array(0), this._length = 0, this._hash = [
				1732584193,
				-271733879,
				-1732584194,
				271733878
			], this;
		}, u.ArrayBuffer.prototype.getState = function() {
			var e, t = u.prototype.getState.call(this);
			return t.buff = (e = t.buff, String.fromCharCode.apply(null, new Uint8Array(e))), t;
		}, u.ArrayBuffer.prototype.setState = function(e) {
			return e.buff = function(e) {
				var t, r = e.length, n = new ArrayBuffer(r), o = new Uint8Array(n);
				for (t = 0; t < r; t += 1) o[t] = e.charCodeAt(t);
				return o;
			}(e.buff), u.prototype.setState.call(this, e);
		}, u.ArrayBuffer.prototype.destroy = u.prototype.destroy, u.ArrayBuffer.prototype._finish = u.prototype._finish, u.ArrayBuffer.hash = function(e, t) {
			var n = a(function(e) {
				var t, n, i, s, a, l, f = e.length, u = [
					1732584193,
					-271733879,
					-1732584194,
					271733878
				];
				for (t = 64; t <= f; t += 64) r(u, o(e.subarray(t - 64, t)));
				for (n = (e = t - 64 < f ? e.subarray(t - 64) : /* @__PURE__ */ new Uint8Array(0)).length, i = [
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				], t = 0; t < n; t += 1) i[t >> 2] |= e[t] << (t % 4 << 3);
				if (i[t >> 2] |= 128 << (t % 4 << 3), t > 55) for (r(u, i), t = 0; t < 16; t += 1) i[t] = 0;
				return s = (s = 8 * f).toString(16).match(/(.*?)(.{0,8})$/), a = parseInt(s[2], 16), l = parseInt(s[1], 16) || 0, i[14] = a, i[15] = l, r(u, i), u;
			}(new Uint8Array(e)));
			return t ? f(n) : n;
		}, u;
	});
})();
var Qe = class e {
	show = !0;
	minLevel;
	maxLevel;
	weight;
	scale = 1;
	offset;
	fontColor = "#000";
	fontFamily = "宋体";
	fontSize = 10;
	backgroundColor;
	backgroundPadding;
	outlineColor;
	outlineAlpha;
	outlineWidth;
	imgUrl;
	imgWidth;
	imgHeight;
	labelField = "name";
	filterField;
	includeValue;
	excludeValue;
	near;
	far;
	children;
	get font() {
		return this.fontSize + "px " + this.fontFamily;
	}
	constructor(e) {
		e && this.copyFrom(e);
	}
	static fromOption(e) {
		const t = {};
		if (Ve(e.scale) && (t.scale = e.scale), Ve(e.minLevel) && (t.minLevel = e.minLevel), Ve(e.maxLevel) && (t.maxLevel = e.maxLevel), Ve(e.near) && (t.near = e.near), Ve(e.far) && (t.far = e.far), Ke(e.fontSize) || Ye(e.fontFamily)) {
			const r = e.fontSize ?? 10, n = e.fontFamily ?? "宋体";
			t.font = r + "px " + n;
		}
		if (e.fontColor && (t.fillColor = je.fromCssColorString(e.fontColor)), Ye(e.backgroundColor) && (t.showBackground = !0, t.backgroundColor = je.fromCssColorString(e.backgroundColor), t.backgroundPadding = new D(e.backgroundPadding, e.backgroundPadding)), e.outlineColor && (t.style = Be.FILL_AND_OUTLINE, t.outlineColor = je.fromCssColorString(e.outlineColor).withAlpha(e.outlineAlpha ?? 1), t.outlineWidth = e.outlineWidth ?? 2), e.imgUrl) {
			t.image = e.imgUrl, t.width = e.imgWidth, t.height = e.imgHeight;
			t.pixelOffset = new D(0, Ve(e.offset) ? e.offset : 0);
		} else "" === e.imgUrl && (t.image = void 0);
		return t;
	}
	static fromDefaultOption(e) {
		const t = {
			show: !0,
			style: Be.FILL,
			pixelOffset: D.ZERO,
			eyeOffset: q.ZERO,
			horizontalOrigin: De.CENTER,
			verticalOrigin: Me.CENTER,
			heightReference: _e.CLAMP_TO_GROUND,
			distanceDisplayCondition: new Ne(0, 2e7),
			disableDepthTestDistance: 1e8
		};
		if (Ve(e.scale) && (t.scale = e.scale), Ve(e.minLevel) && (t.minLevel = e.minLevel), Ve(e.maxLevel) && (t.maxLevel = e.maxLevel), Ke(e.fontSize) || Ye(e.fontFamily)) {
			const r = e.fontSize ?? 10, n = e.fontFamily ?? "宋体";
			t.font = r + "px " + n;
		}
		if (e.fontColor && (t.fillColor = je.fromCssColorString(e.fontColor)), Ye(e.backgroundColor) && (t.showBackground = !0, t.backgroundColor = je.fromCssColorString(e.backgroundColor), t.backgroundPadding = new D(e.backgroundPadding, e.backgroundPadding)), e.outlineColor && (t.style = Be.FILL_AND_OUTLINE, t.outlineColor = je.fromCssColorString(e.outlineColor).withAlpha(e.outlineAlpha ?? 1), t.outlineWidth = e.outlineWidth ?? 2), e.imgUrl) {
			t.image = e.imgUrl, t.width = e.imgWidth, t.height = e.imgHeight;
			t.pixelOffset = new D(0, Ve(e.offset) ? e.offset : 0);
		} else "" === e.imgUrl && (t.image = void 0);
		return t;
	}
	clone() {
		const t = new e();
		return t.show = this.show, t.minLevel = this.minLevel, t.maxLevel = this.maxLevel, t.near = this.near, t.far = this.far, t.weight = this.weight, t.offset = this.offset, this.fontColor && (t.fontColor = this.fontColor), this.fontSize && (t.fontSize = this.fontSize), this.fontFamily && (t.fontFamily = this.fontFamily), t.backgroundColor = this.backgroundColor, t.backgroundPadding = this.backgroundPadding, t.outlineColor = this.outlineColor, t.outlineAlpha = this.outlineAlpha, t.outlineWidth = this.outlineWidth, t.imgUrl = this.imgUrl, t.imgWidth = this.imgWidth, t.imgHeight = this.imgHeight, t.labelField = this.labelField, t.filterField = this.filterField, t.includeValue = this.includeValue, t.excludeValue = this.excludeValue, t.children = this.children ? [...this.children] : void 0, t;
	}
	copyFrom(e) {
		this.show = e.show, this.minLevel = e.minLevel, this.maxLevel = e.maxLevel, this.near = e.near, this.far = e.far, this.weight = e.weight, this.offset = e.offset, e.fontColor && (this.fontColor = e.fontColor), e.fontSize && (this.fontSize = e.fontSize), e.fontFamily && (this.fontFamily = e.fontFamily), this.backgroundColor = e.backgroundColor, this.backgroundPadding = e.backgroundPadding, this.outlineColor = e.outlineColor, this.outlineAlpha = e.outlineAlpha, this.outlineWidth = e.outlineWidth, this.imgUrl = e.imgUrl, this.imgWidth = e.imgWidth, this.imgHeight = e.imgHeight, e.labelField && (this.labelField = e.labelField), this.filterField = e.filterField, this.includeValue = e.includeValue, this.excludeValue = e.excludeValue, this.children = e.children ? [...e.children] : void 0;
	}
	getLabelOption() {
		const e = {
			show: !0,
			font: this.font,
			fillColor: je.fromCssColorString(this.fontColor),
			style: Be.FILL,
			scale: this.scale,
			pixelOffset: D.ZERO,
			eyeOffset: q.ZERO,
			horizontalOrigin: De.CENTER,
			verticalOrigin: Me.CENTER,
			heightReference: _e.CLAMP_TO_GROUND,
			distanceDisplayCondition: new Ne(0, 2e7),
			disableDepthTestDistance: 1e8
		};
		Ve(this.weight) && (e.eyeOffset = new q(0, 0, -100 * this.weight)), this.backgroundColor && (e.showBackground = !0, e.backgroundColor = je.fromCssColorString(this.backgroundColor), e.backgroundPadding = new D(this.backgroundPadding ?? 7, this.backgroundPadding ?? 5)), this.outlineColor && (e.style = Be.FILL_AND_OUTLINE, e.outlineColor = je.fromCssColorString(this.outlineColor).withAlpha(this.outlineAlpha ?? 1), e.outlineWidth = this.outlineWidth ?? 2);
		let t = 0;
		return Ve(this.offset) && (t = this.offset, e.pixelOffset = new D(0, t)), this.imgUrl && (e.image = this.imgUrl, e.width = this.imgWidth, e.height = this.imgHeight), e;
	}
	getBillboardOption() {
		return this.imgUrl ? {
			image: this.imgUrl,
			width: this.imgWidth,
			height: this.imgHeight
		} : {};
	}
}, Xe = ((e, r) => {
	let n = {};
	for (var o in e) t(n, o, {
		get: e[o],
		enumerable: !0
	});
	return r || t(n, Symbol.toStringTag, { value: "Module" }), n;
})({
	cancelPromise: () => nt,
	checkRectangleNoIntersect: () => ft,
	clear: () => ht,
	deleteLabelRectangle: () => ut,
	filterByBounds: () => ot,
	getFilterPointsList: () => it,
	getLabelEntities: () => st,
	getLabelPointList: () => lt,
	isOverlapping: () => ct,
	isPointOnFrontOfGlobe: () => at,
	loadLabelPoints: () => rt
});
let Je = /* @__PURE__ */ new Map(), et = /* @__PURE__ */ new Map();
function tt(e, t) {
	if (t && t.length > 0) {
		let r, n;
		const o = t.length;
		for (let i = 0; i < o; i++) {
			const o = t[i];
			if (o && o.includeValue === e) {
				n = o.fontSize, r = r ? Ze(r, Qe.fromOption(o)) : Qe.fromOption(o);
				break;
			}
		}
		return {
			childOptions: r,
			childFontSize: n
		};
	}
}
async function rt(e, t, r) {
	if (!e || Je.has(e)) return;
	let n = await (await fetch(t)).json();
	if (!n) return;
	const o = n.features;
	let i = r.minLevel ?? 1, s = r.maxLevel ?? 18;
	const a = r.labelField, l = r.filterField ?? a, f = function(e) {
		const t = Qe.fromDefaultOption(e);
		let r;
		return Ye(e.excludeValue) && (r = e.excludeValue.split(",")), {
			baseLabelOptions: t,
			exclude: r
		};
	}(r), u = f.exclude, c = 1.2 * (r.fontSize ?? 12), h = r.children;
	if (o) {
		const t = o.length, r = new Ue(t), p = new Array();
		for (let e = 0; e < t; e++) {
			const t = o[e], n = t.properties;
			if (n) {
				const o = n[a], f = n[l], m = n.minl, d = n.maxl, y = t.geometry.coordinates;
				let g, b = c;
				if (u && u.indexOf(f) >= 0) {
					const e = tt(o, h);
					e && (e.childFontSize && (b = 1.2 * e.childFontSize), e.childOptions && (g = e.childOptions));
				}
				const O = {
					id: e,
					name: o,
					minZoom: m,
					maxZoom: d,
					position: q.fromDegrees(y[0], y[1]),
					textWidth: b * o.length,
					textHeight: b,
					childOptions: g
				};
				r.add(y[0], y[1]), p.push(O), Ve(m) && m < i && (i = m), Ve(d) && d > s && (s = d);
			}
		}
		return r.finish(), Je.set(e, {
			indexKDB: r,
			ptList: p,
			baseLabelOptions: f.baseLabelOptions,
			exclude: f.exclude,
			idRectMap: /* @__PURE__ */ new Map()
		}), o.length = 0, n = void 0, {
			min: i,
			max: s
		};
	}
}
function nt(e) {
	et.set(e, !0);
}
function ot(e, t, r) {
	if (!t || !Je.has(e)) return;
	const n = Je.get(e);
	if (!n) return;
	et.set(e, !1);
	const o = T.toDegrees(t.west), i = T.toDegrees(t.east), s = T.toDegrees(t.north), a = T.toDegrees(t.south), l = n.indexKDB.range(o, a, i, s);
	if (et.get(e)) throw l.length = 0, /* @__PURE__ */ new Error("0");
	if (null != r) {
		const t = l.length, o = [];
		for (let i = 0; i < t; i++) {
			if (et.get(e)) throw o.length = 0, l.length = 0, /* @__PURE__ */ new Error("0");
			const t = l[i], s = n.ptList[t];
			null != s.minZoom && s.maxZoom ? r >= s.minZoom && r <= s.maxZoom && o.push(t) : o.push(t);
		}
		return l.length = 0, o;
	}
	return l;
}
function it(e, t) {
	if (!Je.has(e)) return;
	const r = Je.get(e);
	if (!r) return;
	const n = [], o = t.length;
	for (let i = 0; i < o; i++) {
		const e = t[i], o = r.ptList[e];
		n.push(o);
	}
	return n;
}
function st(e, t) {
	if (!Je.has(e)) return;
	const r = Je.get(e);
	if (!r) return;
	const n = r.baseLabelOptions, o = [], i = t.length;
	for (let s = 0; s < i; s++) {
		const e = t[s], i = r.ptList[e];
		let a = n;
		i.childOptions && (a = Ze({ ...n }, i.childOptions));
		const l = i.position, f = {
			labelOption: void 0,
			billboardOption: void 0
		};
		a.image && (f.billboardOption = {
			id: e,
			show: !0,
			position: l,
			disableDepthTestDistance: Number.POSITIVE_INFINITY,
			image: a.image,
			width: a.width,
			height: a.height
		}, delete a.image, delete a.width, delete a.height), f.labelOption = {
			position: l,
			text: i.name,
			id: e,
			...a
		}, o.push(f);
	}
	return o;
}
function at(e, t) {
	return !(q.distance(e, t) > 6371e3);
}
function lt(e, t) {
	if (!Je.has(e)) return;
	const r = Je.get(e);
	return r ? t.map((e) => r.ptList[e]) : void 0;
}
function ft(e, t, r) {
	const n = Je.get(e);
	if (!n) return !1;
	const o = n.idRectMap;
	let i = !1;
	for (let [s, a] of o) if (a && (i = ct(a, t), i)) break;
	return i || o.set(r, t), i;
}
function ut(e, t) {
	const r = Je.get(e);
	if (!r) return !1;
	const n = r.idRectMap;
	return !!n && n.delete(t);
}
function ct(e, t) {
	return !(e.x > t.x + t.width || t.x > e.x + e.width || e.y > t.y + t.height || t.y > e.y + e.height);
}
function ht(e) {
	if (Je.has(e)) {
		const t = Je.get(e);
		t && (t.ptList.length = 0, t.indexKDB.data = null, t.idRectMap.clear(), t.baseLabelOptions = void 0, Je.delete(e));
	}
}
m(Xe);
