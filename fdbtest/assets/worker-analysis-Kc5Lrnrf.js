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
*/ const c = Symbol("Comlink.proxy"), l = Symbol("Comlink.endpoint"), f = Symbol("Comlink.releaseProxy"), h = Symbol("Comlink.finalizer"), p = Symbol("Comlink.thrown"), d = (e) => "object" == typeof e && null !== e || "function" == typeof e, m = new Map([["proxy", {
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
function A(e) {
	return null != e;
}
function T(e) {
	let t;
	this.name = "DeveloperError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
A(Object.create) && (T.prototype = Object.create(Error.prototype), T.prototype.constructor = T), T.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return A(this.stack) && (e += `\n${this.stack.toString()}`), e;
}, T.throwInstantiationError = function() {
	throw new T("This function defines an interface and should not be called directly.");
};
const R = {};
function z(e, t, r) {
	return `Expected ${r} to be typeof ${t}, actual typeof was ${e}`;
}
R.typeOf = {}, R.defined = function(e, t) {
	if (!A(t)) throw new T(function(e) {
		return `${e} is required, actual value was undefined`;
	}(e));
}, R.typeOf.func = function(e, t) {
	if ("function" != typeof t) throw new T(z(typeof t, "function", e));
}, R.typeOf.string = function(e, t) {
	if ("string" != typeof t) throw new T(z(typeof t, "string", e));
}, R.typeOf.number = function(e, t) {
	if ("number" != typeof t) throw new T(z(typeof t, "number", e));
}, R.typeOf.number.lessThan = function(e, t, r) {
	if (R.typeOf.number(e, t), t >= r) throw new T(`Expected ${e} to be less than ${r}, actual value was ${t}`);
}, R.typeOf.number.lessThanOrEquals = function(e, t, r) {
	if (R.typeOf.number(e, t), t > r) throw new T(`Expected ${e} to be less than or equal to ${r}, actual value was ${t}`);
}, R.typeOf.number.greaterThan = function(e, t, r) {
	if (R.typeOf.number(e, t), t <= r) throw new T(`Expected ${e} to be greater than ${r}, actual value was ${t}`);
}, R.typeOf.number.greaterThanOrEquals = function(e, t, r) {
	if (R.typeOf.number(e, t), t < r) throw new T(`Expected ${e} to be greater than or equal to ${r}, actual value was ${t}`);
}, R.typeOf.object = function(e, t) {
	if ("object" != typeof t) throw new T(z(typeof t, "object", e));
}, R.typeOf.bool = function(e, t) {
	if ("boolean" != typeof t) throw new T(z(typeof t, "boolean", e));
}, R.typeOf.bigint = function(e, t) {
	if ("bigint" != typeof t) throw new T(z(typeof t, "bigint", e));
}, R.typeOf.number.equals = function(e, t, r, n) {
	if (R.typeOf.number(e, r), R.typeOf.number(t, n), r !== n) throw new T(`${e} must be equal to ${t}, the actual values are ${r} and ${n}`);
};
var I = a(s((e, t) => {
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
const M = {
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
M.sign = Math.sign ?? function(e) {
	return 0 === (e = +e) || e != e ? e : e > 0 ? 1 : -1;
}, M.signNotZero = function(e) {
	return e < 0 ? -1 : 1;
}, M.toSNorm = function(e, t) {
	return t = t ?? 255, Math.round((.5 * M.clamp(e, -1, 1) + .5) * t);
}, M.fromSNorm = function(e, t) {
	return t = t ?? 255, M.clamp(e, 0, t) / t * 2 - 1;
}, M.normalize = function(e, t, r) {
	return 0 === (r = Math.max(r - t, 0)) ? 0 : M.clamp((e - t) / r, 0, 1);
}, M.sinh = Math.sinh ?? function(e) {
	return (Math.exp(e) - Math.exp(-e)) / 2;
}, M.cosh = Math.cosh ?? function(e) {
	return (Math.exp(e) + Math.exp(-e)) / 2;
}, M.lerp = function(e, t, r) {
	return (1 - r) * e + r * t;
}, M.PI = Math.PI, M.ONE_OVER_PI = 1 / Math.PI, M.PI_OVER_TWO = Math.PI / 2, M.PI_OVER_THREE = Math.PI / 3, M.PI_OVER_FOUR = Math.PI / 4, M.PI_OVER_SIX = Math.PI / 6, M.THREE_PI_OVER_TWO = 3 * Math.PI / 2, M.TWO_PI = 2 * Math.PI, M.ONE_OVER_TWO_PI = 1 / (2 * Math.PI), M.RADIANS_PER_DEGREE = Math.PI / 180, M.DEGREES_PER_RADIAN = 180 / Math.PI, M.RADIANS_PER_ARCSECOND = M.RADIANS_PER_DEGREE / 3600, M.toRadians = function(e) {
	if (!A(e)) throw new T("degrees is required.");
	return e * M.RADIANS_PER_DEGREE;
}, M.toDegrees = function(e) {
	if (!A(e)) throw new T("radians is required.");
	return e * M.DEGREES_PER_RADIAN;
}, M.convertLongitudeRange = function(e) {
	if (!A(e)) throw new T("angle is required.");
	const t = M.TWO_PI, r = e - Math.floor(e / t) * t;
	return r < -Math.PI ? r + t : r >= Math.PI ? r - t : r;
}, M.clampToLatitudeRange = function(e) {
	if (!A(e)) throw new T("angle is required.");
	return M.clamp(e, -1 * M.PI_OVER_TWO, M.PI_OVER_TWO);
}, M.negativePiToPi = function(e) {
	if (!A(e)) throw new T("angle is required.");
	return e >= -M.PI && e <= M.PI ? e : M.zeroToTwoPi(e + M.PI) - M.PI;
}, M.zeroToTwoPi = function(e) {
	if (!A(e)) throw new T("angle is required.");
	if (e >= 0 && e <= M.TWO_PI) return e;
	const t = M.mod(e, M.TWO_PI);
	return Math.abs(t) < M.EPSILON14 && Math.abs(e) > M.EPSILON14 ? M.TWO_PI : t;
}, M.mod = function(e, t) {
	if (!A(e)) throw new T("m is required.");
	if (!A(t)) throw new T("n is required.");
	if (0 === t) throw new T("divisor cannot be 0.");
	return M.sign(e) === M.sign(t) && Math.abs(e) < Math.abs(t) ? e : (e % t + t) % t;
}, M.equalsEpsilon = function(e, t, r, n) {
	if (!A(e)) throw new T("left is required.");
	if (!A(t)) throw new T("right is required.");
	r = r ?? 0, n = n ?? r;
	const o = Math.abs(e - t);
	return o <= n || o <= r * Math.max(Math.abs(e), Math.abs(t));
}, M.lessThan = function(e, t, r) {
	if (!A(e)) throw new T("first is required.");
	if (!A(t)) throw new T("second is required.");
	if (!A(r)) throw new T("absoluteEpsilon is required.");
	return e - t < -r;
}, M.lessThanOrEquals = function(e, t, r) {
	if (!A(e)) throw new T("first is required.");
	if (!A(t)) throw new T("second is required.");
	if (!A(r)) throw new T("absoluteEpsilon is required.");
	return e - t < r;
}, M.greaterThan = function(e, t, r) {
	if (!A(e)) throw new T("first is required.");
	if (!A(t)) throw new T("second is required.");
	if (!A(r)) throw new T("absoluteEpsilon is required.");
	return e - t > r;
}, M.greaterThanOrEquals = function(e, t, r) {
	if (!A(e)) throw new T("first is required.");
	if (!A(t)) throw new T("second is required.");
	if (!A(r)) throw new T("absoluteEpsilon is required.");
	return e - t > -r;
};
const q = [1];
M.factorial = function(e) {
	if ("number" != typeof e || e < 0) throw new T("A number greater than or equal to 0 is required.");
	const t = q.length;
	if (e >= t) {
		let r = q[t - 1];
		for (let n = t; n <= e; n++) {
			const e = r * n;
			q.push(e), r = e;
		}
	}
	return q[e];
}, M.incrementWrap = function(e, t, r) {
	if (r = r ?? 0, !A(e)) throw new T("n is required.");
	if (t <= r) throw new T("maximumValue must be greater than minimumValue.");
	return ++e > t && (e = r), e;
}, M.isPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new T("A number between 0 and (2^32)-1 is required.");
	return 0 !== e && !(e & e - 1);
}, M.nextPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 2147483648) throw new T("A number between 0 and 2^31 is required.");
	return --e, e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ++e;
}, M.previousPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new T("A number between 0 and (2^32)-1 is required.");
	return e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ((e |= e >> 32) >>> 0) - (e >>> 1);
}, M.clamp = function(e, t, r) {
	return R.typeOf.number("value", e), R.typeOf.number("min", t), R.typeOf.number("max", r), e < t ? t : e > r ? r : e;
};
let P = new I.default();
M.setRandomNumberSeed = function(e) {
	if (!A(e)) throw new T("seed is required.");
	P = new I.default(e);
}, M.nextRandomNumber = function() {
	return P.random();
}, M.randomBetween = function(e, t) {
	return M.nextRandomNumber() * (t - e) + e;
}, M.acosClamped = function(e) {
	if (!A(e)) throw new T("value is required.");
	return Math.acos(M.clamp(e, -1, 1));
}, M.asinClamped = function(e) {
	if (!A(e)) throw new T("value is required.");
	return Math.asin(M.clamp(e, -1, 1));
}, M.chordLength = function(e, t) {
	if (!A(e)) throw new T("angle is required.");
	if (!A(t)) throw new T("radius is required.");
	return 2 * t * Math.sin(.5 * e);
}, M.logBase = function(e, t) {
	if (!A(e)) throw new T("number is required.");
	if (!A(t)) throw new T("base is required.");
	return Math.log(e) / Math.log(t);
}, M.cbrt = Math.cbrt ?? function(e) {
	const t = Math.pow(Math.abs(e), 1 / 3);
	return e < 0 ? -t : t;
}, M.log2 = Math.log2 ?? function(e) {
	return Math.log(e) * Math.LOG2E;
}, M.fog = function(e, t) {
	const r = e * t;
	return 1 - Math.exp(-r * r);
}, M.fastApproximateAtan = function(e) {
	return R.typeOf.number("x", e), e * (-.1784 * Math.abs(e) - .0663 * e * e + 1.0301);
}, M.fastApproximateAtan2 = function(e, t) {
	let r;
	R.typeOf.number("x", e), R.typeOf.number("y", t);
	let n = Math.abs(e);
	r = Math.abs(t);
	const o = Math.max(n, r);
	r = Math.min(n, r);
	const i = r / o;
	if (isNaN(i)) throw new T("either x or y must be nonzero");
	return n = M.fastApproximateAtan(i), n = Math.abs(t) > Math.abs(e) ? M.PI_OVER_TWO - n : n, n = e < 0 ? M.PI - n : n, n = t < 0 ? -n : n, n;
};
var N = class e {
	constructor(e, t, r) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0;
	}
	static fromSpherical(t, r) {
		R.typeOf.object("spherical", t), A(r) || (r = new e());
		const n = t.clock, o = t.cone, i = t.magnitude ?? 1, s = i * Math.sin(o);
		return r.x = s * Math.cos(n), r.y = s * Math.sin(n), r.z = i * Math.cos(o), r;
	}
	static fromElements(t, r, n, o) {
		return A(o) ? (o.x = t, o.y = r, o.z = n, o) : new e(t, r, n);
	}
	static clone(t, r) {
		if (A(t)) return A(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r) : new e(t.x, t.y, t.z);
	}
	static pack(e, t, r) {
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r] = e.z, t;
	}
	static unpack(t, r, n) {
		return R.defined("array", t), r = r ?? 0, A(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r], n;
	}
	static packArray(t, r) {
		R.defined("array", t);
		const n = t.length, o = 3 * n;
		if (A(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new T("If result is a typed array, it must have exactly array.length * 3 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 3 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (R.defined("array", t), R.typeOf.number.greaterThanOrEquals("array.length", t.length, 3), t.length % 3 != 0) throw new T("array length must be a multiple of 3.");
		const n = t.length;
		A(r) ? r.length = n / 3 : r = new Array(n / 3);
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
		const o = M.clamp(e.x, t.x, r.x), i = M.clamp(e.y, t.y, r.y), s = M.clamp(e.z, t.z, r.z);
		return n.x = o, n.y = i, n.z = s, n;
	}
	static magnitudeSquared(e) {
		return R.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return R.typeOf.object("left", t), R.typeOf.object("right", r), e.subtract(t, r, D), e.magnitude(D);
	}
	static distanceSquared(t, r) {
		return R.typeOf.object("left", t), R.typeOf.object("right", r), e.subtract(t, r, D), e.magnitudeSquared(D);
	}
	static normalize(t, r) {
		R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z)) throw new T("normalized result is not a number");
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
		return R.typeOf.object("start", t), R.typeOf.object("end", r), R.typeOf.number("t", n), R.typeOf.object("result", o), e.multiplyByScalar(r, n, F), o = e.multiplyByScalar(t, 1 - n, o), e.add(F, o, o);
	}
	static angleBetween(t, r) {
		R.typeOf.object("left", t), R.typeOf.object("right", r), e.normalize(t, L), e.normalize(r, U);
		const n = e.dot(L, U), o = e.magnitude(e.cross(L, U, L));
		return Math.atan2(o, n);
	}
	static mostOrthogonalAxis(t, r) {
		R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = e.normalize(t, k);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Z, r) : n.y <= n.z ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_Z, r);
	}
	static projectVector(t, r, n) {
		R.defined("a", t), R.defined("b", r), R.defined("result", n);
		const o = e.dot(t, r) / e.dot(r, r);
		return e.multiplyByScalar(r, o, n);
	}
	static equals(e, t) {
		return e === t || A(e) && A(t) && e.x === t.x && e.y === t.y && e.z === t.z;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || A(e) && A(t) && M.equalsEpsilon(e.x, t.x, r, n) && M.equalsEpsilon(e.y, t.y, r, n) && M.equalsEpsilon(e.z, t.z, r, n);
	}
	static cross(e, t, r) {
		R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r);
		const n = e.x, o = e.y, i = e.z, s = t.x, a = t.y, u = t.z, c = o * u - i * a, l = i * s - n * u, f = n * a - o * s;
		return r.x = c, r.y = l, r.z = f, r;
	}
	static midpoint(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = .5 * (e.x + t.x), r.y = .5 * (e.y + t.y), r.z = .5 * (e.z + t.z), r;
	}
	static fromDegrees(t, r, n, o, i) {
		return R.typeOf.number("longitude", t), R.typeOf.number("latitude", r), t = M.toRadians(t), r = M.toRadians(r), e.fromRadians(t, r, n, o, i);
	}
	static fromRadians(t, r, n, o, i) {
		R.typeOf.number("longitude", t), R.typeOf.number("latitude", r), n = n ?? 0;
		const s = A(o) ? o.radiiSquared : e._ellipsoidRadiiSquared, a = Math.cos(r);
		B.x = a * Math.cos(t), B.y = a * Math.sin(t), B.z = Math.sin(r), B = e.normalize(B, B), e.multiplyComponents(s, B, W);
		const u = Math.sqrt(e.dot(B, W));
		return W = e.divideByScalar(W, u, W), B = e.multiplyByScalar(B, n, B), A(i) || (i = new e()), e.add(W, B, i);
	}
	static fromDegreesArray(t, r, n) {
		if (R.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new T("the number of coordinates must be a multiple of 2 and at least 2");
		const o = t.length;
		A(n) ? n.length = o / 2 : n = new Array(o / 2);
		for (let i = 0; i < o; i += 2) {
			const o = t[i], s = t[i + 1], a = i / 2;
			n[a] = e.fromDegrees(o, s, 0, r, n[a]);
		}
		return n;
	}
	static fromRadiansArray(t, r, n) {
		if (R.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new T("the number of coordinates must be a multiple of 2 and at least 2");
		const o = t.length;
		A(n) ? n.length = o / 2 : n = new Array(o / 2);
		for (let i = 0; i < o; i += 2) {
			const o = t[i], s = t[i + 1], a = i / 2;
			n[a] = e.fromRadians(o, s, 0, r, n[a]);
		}
		return n;
	}
	static fromDegreesArrayHeights(t, r, n) {
		if (R.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new T("the number of coordinates must be a multiple of 3 and at least 3");
		const o = t.length;
		A(n) ? n.length = o / 3 : n = new Array(o / 3);
		for (let i = 0; i < o; i += 3) {
			const o = t[i], s = t[i + 1], a = t[i + 2], u = i / 3;
			n[u] = e.fromDegrees(o, s, a, r, n[u]);
		}
		return n;
	}
	static fromRadiansArrayHeights(t, r, n) {
		if (R.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new T("the number of coordinates must be a multiple of 3 and at least 3");
		const o = t.length;
		A(n) ? n.length = o / 3 : n = new Array(o / 3);
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
N.fromCartesian4 = N.clone, N.packedLength = 3, N.fromArray = N.unpack;
const D = new N(), F = new N(), L = new N(), U = new N(), k = new N();
let B = new N(), W = new N();
N._ellipsoidRadiiSquared = new N(40680631590769, 40680631590769, 40408299984661.445), N.ZERO = Object.freeze(new N(0, 0, 0)), N.ONE = Object.freeze(new N(1, 1, 1)), N.UNIT_X = Object.freeze(new N(1, 0, 0)), N.UNIT_Y = Object.freeze(new N(0, 1, 0)), N.UNIT_Z = Object.freeze(new N(0, 0, 1));
var $ = class e {
	constructor(e, t, r, n) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0, this.w = n ?? 0;
	}
	static fromElements(t, r, n, o, i) {
		return A(i) ? (i.x = t, i.y = r, i.z = n, i.w = o, i) : new e(t, r, n, o);
	}
	static fromColor(t, r) {
		return R.typeOf.object("color", t), A(r) ? (r.x = t.red, r.y = t.green, r.z = t.blue, r.w = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static clone(t, r) {
		if (A(t)) return A(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r.w = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static pack(e, t, r) {
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.z, t[r] = e.w, t;
	}
	static unpack(t, r, n) {
		return R.defined("array", t), r = r ?? 0, A(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r++], n.w = t[r], n;
	}
	static packArray(t, r) {
		R.defined("array", t);
		const n = t.length, o = 4 * n;
		if (A(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new T("If result is a typed array, it must have exactly array.length * 4 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 4 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (R.defined("array", t), R.typeOf.number.greaterThanOrEquals("array.length", t.length, 4), t.length % 4 != 0) throw new T("array length must be a multiple of 4.");
		const n = t.length;
		A(r) ? r.length = n / 4 : r = new Array(n / 4);
		for (let o = 0; o < n; o += 4) {
			const n = o / 4;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return R.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z, e.w);
	}
	static minimumComponent(e) {
		return R.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z, e.w);
	}
	static minimumByComponent(e, t, r) {
		return R.typeOf.object("first", e), R.typeOf.object("second", t), R.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r.w = Math.min(e.w, t.w), r;
	}
	static maximumByComponent(e, t, r) {
		return R.typeOf.object("first", e), R.typeOf.object("second", t), R.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r.w = Math.max(e.w, t.w), r;
	}
	static clamp(e, t, r, n) {
		R.typeOf.object("value", e), R.typeOf.object("min", t), R.typeOf.object("max", r), R.typeOf.object("result", n);
		const o = M.clamp(e.x, t.x, r.x), i = M.clamp(e.y, t.y, r.y), s = M.clamp(e.z, t.z, r.z), a = M.clamp(e.w, t.w, r.w);
		return n.x = o, n.y = i, n.z = s, n.w = a, n;
	}
	static magnitudeSquared(e) {
		return R.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w;
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
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, r.w = t.w / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z) || isNaN(r.w)) throw new T("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z + e.w * t.w;
	}
	static multiplyComponents(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r.w = e.w * t.w, r;
	}
	static divideComponents(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r.w = e.w / t.w, r;
	}
	static add(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r.w = e.w + t.w, r;
	}
	static subtract(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r.w = e.w - t.w, r;
	}
	static multiplyByScalar(e, t, r) {
		return R.typeOf.object("cartesian", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r.w = e.w * t, r;
	}
	static divideByScalar(e, t, r) {
		return R.typeOf.object("cartesian", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r.w = e.w / t, r;
	}
	static negate(e, t) {
		return R.typeOf.object("cartesian", e), R.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
	}
	static abs(e, t) {
		return R.typeOf.object("cartesian", e), R.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t.w = Math.abs(e.w), t;
	}
	static lerp(t, r, n, o) {
		return R.typeOf.object("start", t), R.typeOf.object("end", r), R.typeOf.number("t", n), R.typeOf.object("result", o), e.multiplyByScalar(r, n, H), o = e.multiplyByScalar(t, 1 - n, o), e.add(H, o, o);
	}
	static mostOrthogonalAxis(t, r) {
		R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = e.normalize(t, V);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? n.x <= n.w ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_W, r) : n.z <= n.w ? e.clone(e.UNIT_Z, r) : e.clone(e.UNIT_W, r) : n.y <= n.z ? n.y <= n.w ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_W, r) : n.z <= n.w ? e.clone(e.UNIT_Z, r) : e.clone(e.UNIT_W, r);
	}
	static equals(e, t) {
		return e === t || A(e) && A(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2] && e.w === t[r + 3];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || A(e) && A(t) && M.equalsEpsilon(e.x, t.x, r, n) && M.equalsEpsilon(e.y, t.y, r, n) && M.equalsEpsilon(e.z, t.z, r, n) && M.equalsEpsilon(e.w, t.w, r, n);
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
		return R.typeOf.number("value", t), A(r) || (r = new e()), Y[0] = t, X ? (r.x = Q[0], r.y = Q[1], r.z = Q[2], r.w = Q[3]) : (r.x = Q[3], r.y = Q[2], r.z = Q[1], r.w = Q[0]), r;
	}
	static unpackFloat(e) {
		return R.typeOf.object("packedFloat", e), X ? (Q[0] = e.x, Q[1] = e.y, Q[2] = e.z, Q[3] = e.w) : (Q[0] = e.w, Q[1] = e.z, Q[2] = e.y, Q[3] = e.x), Y[0];
	}
};
$.packedLength = 4, $.fromArray = $.unpack;
const G = new $(), H = new $(), V = new $();
$.ZERO = Object.freeze(new $(0, 0, 0, 0)), $.ONE = Object.freeze(new $(1, 1, 1, 1)), $.UNIT_X = Object.freeze(new $(1, 0, 0, 0)), $.UNIT_Y = Object.freeze(new $(0, 1, 0, 0)), $.UNIT_Z = Object.freeze(new $(0, 0, 1, 0)), $.UNIT_W = Object.freeze(new $(0, 0, 0, 1));
const Y = new Float32Array(1), Q = new Uint8Array(Y.buffer), Z = new Uint32Array([287454020]), X = 68 === new Uint8Array(Z.buffer)[0], K = {};
K.EMPTY_OBJECT = Object.freeze({}), K.EMPTY_ARRAY = Object.freeze([]);
var J = class e {
	constructor(e, t, r, n, o, i, s, a, u) {
		this[0] = e ?? 0, this[1] = n ?? 0, this[2] = s ?? 0, this[3] = t ?? 0, this[4] = o ?? 0, this[5] = a ?? 0, this[6] = r ?? 0, this[7] = i ?? 0, this[8] = u ?? 0;
	}
	static pack(e, t, r) {
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t;
	}
	static unpack(t, r, n) {
		return R.defined("array", t), r = r ?? 0, A(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n[4] = t[r++], n[5] = t[r++], n[6] = t[r++], n[7] = t[r++], n[8] = t[r++], n;
	}
	static packArray(t, r) {
		R.defined("array", t);
		const n = t.length, o = 9 * n;
		if (A(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new T("If result is a typed array, it must have exactly array.length * 9 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 9 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (R.defined("array", t), R.typeOf.number.greaterThanOrEquals("array.length", t.length, 9), t.length % 9 != 0) throw new T("array length must be a multiple of 9.");
		const n = t.length;
		A(r) ? r.length = n / 9 : r = new Array(n / 9);
		for (let o = 0; o < n; o += 9) {
			const n = o / 9;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (A(t)) return A(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r[6] = t[6], r[7] = t[7], r[8] = t[8], r) : new e(t[0], t[3], t[6], t[1], t[4], t[7], t[2], t[5], t[8]);
	}
	static fromColumnMajorArray(t, r) {
		return R.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return R.defined("values", t), A(r) ? (r[0] = t[0], r[1] = t[3], r[2] = t[6], r[3] = t[1], r[4] = t[4], r[5] = t[7], r[6] = t[2], r[7] = t[5], r[8] = t[8], r) : new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
	}
	static fromQuaternion(t, r) {
		R.typeOf.object("quaternion", t);
		const n = t.x * t.x, o = t.x * t.y, i = t.x * t.z, s = t.x * t.w, a = t.y * t.y, u = t.y * t.z, c = t.y * t.w, l = t.z * t.z, f = t.z * t.w, h = t.w * t.w, p = n - a - l + h, d = 2 * (o - f), m = 2 * (i + c), y = 2 * (o + f), g = -n + a - l + h, b = 2 * (u - s), w = 2 * (i - c), O = 2 * (u + s), E = -n - a + l + h;
		return A(r) ? (r[0] = p, r[1] = y, r[2] = w, r[3] = d, r[4] = g, r[5] = O, r[6] = m, r[7] = b, r[8] = E, r) : new e(p, d, m, y, g, b, w, O, E);
	}
	static fromHeadingPitchRoll(t, r) {
		R.typeOf.object("headingPitchRoll", t);
		const n = Math.cos(-t.pitch), o = Math.cos(-t.heading), i = Math.cos(t.roll), s = Math.sin(-t.pitch), a = Math.sin(-t.heading), u = Math.sin(t.roll), c = n * o, l = -i * a + u * s * o, f = u * a + i * s * o, h = n * a, p = i * o + u * s * a, d = -u * o + i * s * a, m = -s, y = u * n, g = i * n;
		return A(r) ? (r[0] = c, r[1] = h, r[2] = m, r[3] = l, r[4] = p, r[5] = y, r[6] = f, r[7] = d, r[8] = g, r) : new e(c, l, f, h, p, d, m, y, g);
	}
	static fromScale(t, r) {
		return R.typeOf.object("scale", t), A(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = t.y, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = t.z, r) : new e(t.x, 0, 0, 0, t.y, 0, 0, 0, t.z);
	}
	static fromUniformScale(t, r) {
		return R.typeOf.number("scale", t), A(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = t, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = t, r) : new e(t, 0, 0, 0, t, 0, 0, 0, t);
	}
	static fromCrossProduct(t, r) {
		return R.typeOf.object("vector", t), A(r) ? (r[0] = 0, r[1] = t.z, r[2] = -t.y, r[3] = -t.z, r[4] = 0, r[5] = t.x, r[6] = t.y, r[7] = -t.x, r[8] = 0, r) : new e(0, -t.z, t.y, t.z, 0, -t.x, -t.y, t.x, 0);
	}
	static fromRotationX(t, r) {
		R.typeOf.number("angle", t);
		const n = Math.cos(t), o = Math.sin(t);
		return A(r) ? (r[0] = 1, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = n, r[5] = o, r[6] = 0, r[7] = -o, r[8] = n, r) : new e(1, 0, 0, 0, n, -o, 0, o, n);
	}
	static fromRotationY(t, r) {
		R.typeOf.number("angle", t);
		const n = Math.cos(t), o = Math.sin(t);
		return A(r) ? (r[0] = n, r[1] = 0, r[2] = -o, r[3] = 0, r[4] = 1, r[5] = 0, r[6] = o, r[7] = 0, r[8] = n, r) : new e(n, 0, o, 0, 1, 0, -o, 0, n);
	}
	static fromRotationZ(t, r) {
		R.typeOf.number("angle", t);
		const n = Math.cos(t), o = Math.sin(t);
		return A(r) ? (r[0] = n, r[1] = o, r[2] = 0, r[3] = -o, r[4] = n, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = 1, r) : new e(n, -o, 0, o, n, 0, 0, 0, 1);
	}
	static toArray(e, t) {
		return R.typeOf.object("matrix", e), A(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t) : [
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
		return R.typeOf.number.greaterThanOrEquals("row", t, 0), R.typeOf.number.lessThanOrEquals("row", t, 2), R.typeOf.number.greaterThanOrEquals("column", e, 0), R.typeOf.number.lessThanOrEquals("column", e, 2), 3 * e + t;
	}
	static getColumn(e, t, r) {
		R.typeOf.object("matrix", e), R.typeOf.number.greaterThanOrEquals("index", t, 0), R.typeOf.number.lessThanOrEquals("index", t, 2), R.typeOf.object("result", r);
		const n = 3 * t, o = e[n], i = e[n + 1], s = e[n + 2];
		return r.x = o, r.y = i, r.z = s, r;
	}
	static setColumn(t, r, n, o) {
		R.typeOf.object("matrix", t), R.typeOf.number.greaterThanOrEquals("index", r, 0), R.typeOf.number.lessThanOrEquals("index", r, 2), R.typeOf.object("cartesian", n), R.typeOf.object("result", o);
		const i = 3 * r;
		return (o = e.clone(t, o))[i] = n.x, o[i + 1] = n.y, o[i + 2] = n.z, o;
	}
	static getRow(e, t, r) {
		R.typeOf.object("matrix", e), R.typeOf.number.greaterThanOrEquals("index", t, 0), R.typeOf.number.lessThanOrEquals("index", t, 2), R.typeOf.object("result", r);
		const n = e[t], o = e[t + 3], i = e[t + 6];
		return r.x = n, r.y = o, r.z = i, r;
	}
	static setRow(t, r, n, o) {
		return R.typeOf.object("matrix", t), R.typeOf.number.greaterThanOrEquals("index", r, 0), R.typeOf.number.lessThanOrEquals("index", r, 2), R.typeOf.object("cartesian", n), R.typeOf.object("result", o), (o = e.clone(t, o))[r] = n.x, o[r + 3] = n.y, o[r + 6] = n.z, o;
	}
	static setScale(t, r, n) {
		R.typeOf.object("matrix", t), R.typeOf.object("scale", r), R.typeOf.object("result", n);
		const o = e.getScale(t, ee), i = r.x / o.x, s = r.y / o.y, a = r.z / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3] * s, n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * a, n[7] = t[7] * a, n[8] = t[8] * a, n;
	}
	static setUniformScale(t, r, n) {
		R.typeOf.object("matrix", t), R.typeOf.number("scale", r), R.typeOf.object("result", n);
		const o = e.getScale(t, te), i = r / o.x, s = r / o.y, a = r / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3] * s, n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * a, n[7] = t[7] * a, n[8] = t[8] * a, n;
	}
	static getScale(e, t) {
		return R.typeOf.object("matrix", e), R.typeOf.object("result", t), t.x = N.magnitude(N.fromElements(e[0], e[1], e[2], re)), t.y = N.magnitude(N.fromElements(e[3], e[4], e[5], re)), t.z = N.magnitude(N.fromElements(e[6], e[7], e[8], re)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, ne), N.maximumComponent(ne);
	}
	static setRotation(t, r, n) {
		R.typeOf.object("matrix", t), R.typeOf.object("result", n);
		const o = e.getScale(t, oe);
		return n[0] = r[0] * o.x, n[1] = r[1] * o.x, n[2] = r[2] * o.x, n[3] = r[3] * o.y, n[4] = r[4] * o.y, n[5] = r[5] * o.y, n[6] = r[6] * o.z, n[7] = r[7] * o.z, n[8] = r[8] * o.z, n;
	}
	static getRotation(t, r) {
		R.typeOf.object("matrix", t), R.typeOf.object("result", r);
		const n = e.getScale(t, ie);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.x, r[3] = t[3] / n.y, r[4] = t[4] / n.y, r[5] = t[5] / n.y, r[6] = t[6] / n.z, r[7] = t[7] / n.z, r[8] = t[8] / n.z, r;
	}
	static multiply(e, t, r) {
		R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r);
		const n = e[0] * t[0] + e[3] * t[1] + e[6] * t[2], o = e[1] * t[0] + e[4] * t[1] + e[7] * t[2], i = e[2] * t[0] + e[5] * t[1] + e[8] * t[2], s = e[0] * t[3] + e[3] * t[4] + e[6] * t[5], a = e[1] * t[3] + e[4] * t[4] + e[7] * t[5], u = e[2] * t[3] + e[5] * t[4] + e[8] * t[5], c = e[0] * t[6] + e[3] * t[7] + e[6] * t[8], l = e[1] * t[6] + e[4] * t[7] + e[7] * t[8], f = e[2] * t[6] + e[5] * t[7] + e[8] * t[8];
		return r[0] = n, r[1] = o, r[2] = i, r[3] = s, r[4] = a, r[5] = u, r[6] = c, r[7] = l, r[8] = f, r;
	}
	static add(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r[4] = e[4] + t[4], r[5] = e[5] + t[5], r[6] = e[6] + t[6], r[7] = e[7] + t[7], r[8] = e[8] + t[8], r;
	}
	static subtract(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r[4] = e[4] - t[4], r[5] = e[5] - t[5], r[6] = e[6] - t[6], r[7] = e[7] - t[7], r[8] = e[8] - t[8], r;
	}
	static multiplyByVector(e, t, r) {
		R.typeOf.object("matrix", e), R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = e[0] * n + e[3] * o + e[6] * i, a = e[1] * n + e[4] * o + e[7] * i, u = e[2] * n + e[5] * o + e[8] * i;
		return r.x = s, r.y = a, r.z = u, r;
	}
	static multiplyByScalar(e, t, r) {
		return R.typeOf.object("matrix", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r;
	}
	static multiplyByScale(e, t, r) {
		return R.typeOf.object("matrix", e), R.typeOf.object("scale", t), R.typeOf.object("result", r), r[0] = e[0] * t.x, r[1] = e[1] * t.x, r[2] = e[2] * t.x, r[3] = e[3] * t.y, r[4] = e[4] * t.y, r[5] = e[5] * t.y, r[6] = e[6] * t.z, r[7] = e[7] * t.z, r[8] = e[8] * t.z, r;
	}
	static multiplyByUniformScale(e, t, r) {
		return R.typeOf.object("matrix", e), R.typeOf.number("scale", t), R.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r;
	}
	static negate(e, t) {
		return R.typeOf.object("matrix", e), R.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t;
	}
	static transpose(e, t) {
		R.typeOf.object("matrix", e), R.typeOf.object("result", t);
		const r = e[0], n = e[3], o = e[6], i = e[1], s = e[4], a = e[7], u = e[2], c = e[5], l = e[8];
		return t[0] = r, t[1] = n, t[2] = o, t[3] = i, t[4] = s, t[5] = a, t[6] = u, t[7] = c, t[8] = l, t;
	}
	static computeEigenDecomposition(t, r) {
		R.typeOf.object("matrix", t);
		const n = M.EPSILON20;
		let o = 0, i = 0;
		A(r) || (r = {});
		const s = r.unitary = e.clone(e.IDENTITY, r.unitary), a = r.diagonal = e.clone(t, r.diagonal), u = n * function(e) {
			let t = 0;
			for (let r = 0; r < 9; ++r) {
				const n = e[r];
				t += n * n;
			}
			return Math.sqrt(t);
		}(a);
		for (; i < 10 && fe(a) > u;) he(a, se), e.transpose(se, ae), e.multiply(a, se, a), e.multiply(ae, a, a), e.multiply(s, se, s), ++o > 2 && (++i, o = 0);
		return r;
	}
	static abs(e, t) {
		return R.typeOf.object("matrix", e), R.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t;
	}
	static determinant(e) {
		R.typeOf.object("matrix", e);
		const t = e[0], r = e[3], n = e[6], o = e[1], i = e[4], s = e[7], a = e[2], u = e[5], c = e[8];
		return t * (i * c - u * s) + o * (u * n - r * c) + a * (r * s - i * n);
	}
	static inverse(t, r) {
		R.typeOf.object("matrix", t), R.typeOf.object("result", r);
		const n = t[0], o = t[1], i = t[2], s = t[3], a = t[4], u = t[5], c = t[6], l = t[7], f = t[8], h = e.determinant(t);
		if (Math.abs(h) <= M.EPSILON15) throw new T("matrix is not invertible");
		r[0] = a * f - l * u, r[1] = l * i - o * f, r[2] = o * u - a * i, r[3] = c * u - s * f, r[4] = n * f - c * i, r[5] = s * i - n * u, r[6] = s * l - c * a, r[7] = c * o - n * l, r[8] = n * a - s * o;
		const p = 1 / h;
		return e.multiplyByScalar(r, p, r);
	}
	static inverseTranspose(t, r) {
		return R.typeOf.object("matrix", t), R.typeOf.object("result", r), e.inverse(e.transpose(t, ue), r);
	}
	static equals(e, t) {
		return e === t || A(e) && A(t) && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7] && e[8] === t[8];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || A(e) && A(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r && Math.abs(e[4] - t[4]) <= r && Math.abs(e[5] - t[5]) <= r && Math.abs(e[6] - t[6]) <= r && Math.abs(e[7] - t[7]) <= r && Math.abs(e[8] - t[8]) <= r;
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
J.packedLength = 9, J.fromArray = J.unpack, J.IDENTITY = Object.freeze(new J(1, 0, 0, 0, 1, 0, 0, 0, 1)), J.ZERO = Object.freeze(new J(0, 0, 0, 0, 0, 0, 0, 0, 0)), J.COLUMN0ROW0 = 0, J.COLUMN0ROW1 = 1, J.COLUMN0ROW2 = 2, J.COLUMN1ROW0 = 3, J.COLUMN1ROW1 = 4, J.COLUMN1ROW2 = 5, J.COLUMN2ROW0 = 6, J.COLUMN2ROW1 = 7, J.COLUMN2ROW2 = 8;
const ee = new N(), te = new N(), re = new N(), ne = new N(), oe = new N(), ie = new N(), se = new J(), ae = new J(), ue = new J(), ce = [
	1,
	0,
	0
], le = [
	2,
	2,
	1
];
function fe(e) {
	let t = 0;
	for (let r = 0; r < 3; ++r) {
		const n = e[J.getElementIndex(le[r], ce[r])];
		t += 2 * n * n;
	}
	return Math.sqrt(t);
}
function he(e, t) {
	const r = M.EPSILON15;
	let n = 0, o = 1;
	for (let c = 0; c < 3; ++c) {
		const t = Math.abs(e[J.getElementIndex(le[c], ce[c])]);
		t > n && (o = c, n = t);
	}
	let i = 1, s = 0;
	const a = ce[o], u = le[o];
	if (Math.abs(e[J.getElementIndex(u, a)]) > r) {
		const t = (e[J.getElementIndex(u, u)] - e[J.getElementIndex(a, a)]) / 2 / e[J.getElementIndex(u, a)];
		let r;
		r = t < 0 ? -1 / (-t + Math.sqrt(1 + t * t)) : 1 / (t + Math.sqrt(1 + t * t)), i = 1 / Math.sqrt(1 + r * r), s = r * i;
	}
	return (t = J.clone(J.IDENTITY, t))[J.getElementIndex(a, a)] = t[J.getElementIndex(u, u)] = i, t[J.getElementIndex(u, a)] = s, t[J.getElementIndex(a, u)] = -s, t;
}
function pe(e) {
	let t;
	this.name = "RuntimeError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
A(Object.create) && (pe.prototype = Object.create(Error.prototype), pe.prototype.constructor = pe), pe.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return A(this.stack) && (e += `\n${this.stack.toString()}`), e;
};
var de = class e {
	constructor(e, t, r, n, o, i, s, a, u, c, l, f, h, p, d, m) {
		this[0] = e ?? 0, this[1] = o ?? 0, this[2] = u ?? 0, this[3] = h ?? 0, this[4] = t ?? 0, this[5] = i ?? 0, this[6] = c ?? 0, this[7] = p ?? 0, this[8] = r ?? 0, this[9] = s ?? 0, this[10] = l ?? 0, this[11] = d ?? 0, this[12] = n ?? 0, this[13] = a ?? 0, this[14] = f ?? 0, this[15] = m ?? 0;
	}
	static pack(e, t, r) {
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t[r++] = e[9], t[r++] = e[10], t[r++] = e[11], t[r++] = e[12], t[r++] = e[13], t[r++] = e[14], t[r] = e[15], t;
	}
	static unpack(t, r, n) {
		return R.defined("array", t), r = r ?? 0, A(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n[4] = t[r++], n[5] = t[r++], n[6] = t[r++], n[7] = t[r++], n[8] = t[r++], n[9] = t[r++], n[10] = t[r++], n[11] = t[r++], n[12] = t[r++], n[13] = t[r++], n[14] = t[r++], n[15] = t[r], n;
	}
	static packArray(t, r) {
		R.defined("array", t);
		const n = t.length, o = 16 * n;
		if (A(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new T("If result is a typed array, it must have exactly array.length * 16 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 16 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (R.defined("array", t), R.typeOf.number.greaterThanOrEquals("array.length", t.length, 16), t.length % 16 != 0) throw new T("array length must be a multiple of 16.");
		const n = t.length;
		A(r) ? r.length = n / 16 : r = new Array(n / 16);
		for (let o = 0; o < n; o += 16) {
			const n = o / 16;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (A(t)) return A(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r[6] = t[6], r[7] = t[7], r[8] = t[8], r[9] = t[9], r[10] = t[10], r[11] = t[11], r[12] = t[12], r[13] = t[13], r[14] = t[14], r[15] = t[15], r) : new e(t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15]);
	}
	static fromColumnMajorArray(t, r) {
		return R.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return R.defined("values", t), A(r) ? (r[0] = t[0], r[1] = t[4], r[2] = t[8], r[3] = t[12], r[4] = t[1], r[5] = t[5], r[6] = t[9], r[7] = t[13], r[8] = t[2], r[9] = t[6], r[10] = t[10], r[11] = t[14], r[12] = t[3], r[13] = t[7], r[14] = t[11], r[15] = t[15], r) : new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]);
	}
	static fromRotationTranslation(t, r, n) {
		return R.typeOf.object("rotation", t), r = r ?? N.ZERO, A(n) ? (n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = 0, n[4] = t[3], n[5] = t[4], n[6] = t[5], n[7] = 0, n[8] = t[6], n[9] = t[7], n[10] = t[8], n[11] = 0, n[12] = r.x, n[13] = r.y, n[14] = r.z, n[15] = 1, n) : new e(t[0], t[3], t[6], r.x, t[1], t[4], t[7], r.y, t[2], t[5], t[8], r.z, 0, 0, 0, 1);
	}
	static fromTranslationQuaternionRotationScale(t, r, n, o) {
		R.typeOf.object("translation", t), R.typeOf.object("rotation", r), R.typeOf.object("scale", n), A(o) || (o = new e());
		const i = n.x, s = n.y, a = n.z, u = r.x * r.x, c = r.x * r.y, l = r.x * r.z, f = r.x * r.w, h = r.y * r.y, p = r.y * r.z, d = r.y * r.w, m = r.z * r.z, y = r.z * r.w, g = r.w * r.w, b = u - h - m + g, w = 2 * (c - y), O = 2 * (l + d), E = 2 * (c + y), x = -u + h - m + g, _ = 2 * (p - f), S = 2 * (l - d), v = 2 * (p + f), C = -u - h + m + g;
		return o[0] = b * i, o[1] = E * i, o[2] = S * i, o[3] = 0, o[4] = w * s, o[5] = x * s, o[6] = v * s, o[7] = 0, o[8] = O * a, o[9] = _ * a, o[10] = C * a, o[11] = 0, o[12] = t.x, o[13] = t.y, o[14] = t.z, o[15] = 1, o;
	}
	static fromTranslationRotationScale(t, r) {
		return R.typeOf.object("translationRotationScale", t), e.fromTranslationQuaternionRotationScale(t.translation, t.rotation, t.scale, r);
	}
	static fromTranslation(t, r) {
		return R.typeOf.object("translation", t), e.fromRotationTranslation(J.IDENTITY, t, r);
	}
	static fromScale(t, r) {
		return R.typeOf.object("scale", t), A(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = t.y, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = t.z, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r) : new e(t.x, 0, 0, 0, 0, t.y, 0, 0, 0, 0, t.z, 0, 0, 0, 0, 1);
	}
	static fromUniformScale(t, r) {
		return R.typeOf.number("scale", t), A(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = t, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = t, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r) : new e(t, 0, 0, 0, 0, t, 0, 0, 0, 0, t, 0, 0, 0, 0, 1);
	}
	static fromRotation(t, r) {
		return R.typeOf.object("rotation", t), A(r) || (r = new e()), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 0, r[4] = t[3], r[5] = t[4], r[6] = t[5], r[7] = 0, r[8] = t[6], r[9] = t[7], r[10] = t[8], r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r;
	}
	static fromCamera(t, r) {
		R.typeOf.object("camera", t);
		const n = t.position, o = t.direction, i = t.up;
		R.typeOf.object("camera.position", n), R.typeOf.object("camera.direction", o), R.typeOf.object("camera.up", i), N.normalize(o, me), N.normalize(N.cross(me, i, ye), ye), N.normalize(N.cross(ye, me, ge), ge);
		const s = ye.x, a = ye.y, u = ye.z, c = me.x, l = me.y, f = me.z, h = ge.x, p = ge.y, d = ge.z, m = n.x, y = n.y, g = n.z, b = s * -m + a * -y + u * -g, w = h * -m + p * -y + d * -g, O = c * m + l * y + f * g;
		return A(r) ? (r[0] = s, r[1] = h, r[2] = -c, r[3] = 0, r[4] = a, r[5] = p, r[6] = -l, r[7] = 0, r[8] = u, r[9] = d, r[10] = -f, r[11] = 0, r[12] = b, r[13] = w, r[14] = O, r[15] = 1, r) : new e(s, a, u, b, h, p, d, w, -c, -l, -f, O, 0, 0, 0, 1);
	}
	static computePerspectiveFieldOfView(e, t, r, n, o) {
		R.typeOf.number.greaterThan("fovY", e, 0), R.typeOf.number.lessThan("fovY", e, Math.PI), R.typeOf.number.greaterThan("near", r, 0), R.typeOf.number.greaterThan("far", n, 0), R.typeOf.object("result", o);
		const i = 1 / Math.tan(.5 * e), s = i / t, a = (n + r) / (r - n), u = 2 * n * r / (r - n);
		return o[0] = s, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = i, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = a, o[11] = -1, o[12] = 0, o[13] = 0, o[14] = u, o[15] = 0, o;
	}
	static computeOrthographicOffCenter(e, t, r, n, o, i, s) {
		R.typeOf.number("left", e), R.typeOf.number("right", t), R.typeOf.number("bottom", r), R.typeOf.number("top", n), R.typeOf.number("near", o), R.typeOf.number("far", i), R.typeOf.object("result", s);
		let a = 1 / (t - e), u = 1 / (n - r), c = 1 / (i - o);
		const l = -(t + e) * a, f = -(n + r) * u, h = -(i + o) * c;
		return a *= 2, u *= 2, c *= -2, s[0] = a, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = u, s[6] = 0, s[7] = 0, s[8] = 0, s[9] = 0, s[10] = c, s[11] = 0, s[12] = l, s[13] = f, s[14] = h, s[15] = 1, s;
	}
	static computePerspectiveOffCenter(e, t, r, n, o, i, s) {
		R.typeOf.number("left", e), R.typeOf.number("right", t), R.typeOf.number("bottom", r), R.typeOf.number("top", n), R.typeOf.number("near", o), R.typeOf.number("far", i), R.typeOf.object("result", s);
		const a = 2 * o / (t - e), u = 2 * o / (n - r), c = (t + e) / (t - e), l = (n + r) / (n - r), f = -(i + o) / (i - o), h = -2 * i * o / (i - o);
		return s[0] = a, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = u, s[6] = 0, s[7] = 0, s[8] = c, s[9] = l, s[10] = f, s[11] = -1, s[12] = 0, s[13] = 0, s[14] = h, s[15] = 0, s;
	}
	static computeInfinitePerspectiveOffCenter(e, t, r, n, o, i) {
		R.typeOf.number("left", e), R.typeOf.number("right", t), R.typeOf.number("bottom", r), R.typeOf.number("top", n), R.typeOf.number("near", o), R.typeOf.object("result", i);
		const s = 2 * o / (t - e), a = 2 * o / (n - r), u = (t + e) / (t - e), c = (n + r) / (n - r), l = -2 * o;
		return i[0] = s, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = a, i[6] = 0, i[7] = 0, i[8] = u, i[9] = c, i[10] = -1, i[11] = -1, i[12] = 0, i[13] = 0, i[14] = l, i[15] = 0, i;
	}
	static computeViewportTransformation(t, r, n, o) {
		A(o) || (o = new e());
		const i = (t = t ?? K.EMPTY_OBJECT).x ?? 0, s = t.y ?? 0;
		r = r ?? 0;
		const a = .5 * (t.width ?? 0), u = .5 * (t.height ?? 0), c = .5 * ((n = n ?? 1) - r), l = a, f = u, h = c, p = i + a, d = s + u, m = r + c;
		return o[0] = l, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = f, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = h, o[11] = 0, o[12] = p, o[13] = d, o[14] = m, o[15] = 1, o;
	}
	static computeView(e, t, r, n, o) {
		return R.typeOf.object("position", e), R.typeOf.object("direction", t), R.typeOf.object("up", r), R.typeOf.object("right", n), R.typeOf.object("result", o), o[0] = n.x, o[1] = r.x, o[2] = -t.x, o[3] = 0, o[4] = n.y, o[5] = r.y, o[6] = -t.y, o[7] = 0, o[8] = n.z, o[9] = r.z, o[10] = -t.z, o[11] = 0, o[12] = -N.dot(n, e), o[13] = -N.dot(r, e), o[14] = N.dot(t, e), o[15] = 1, o;
	}
	static toArray(e, t) {
		return R.typeOf.object("matrix", e), A(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t) : [
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
		return R.typeOf.number.greaterThanOrEquals("row", t, 0), R.typeOf.number.lessThanOrEquals("row", t, 3), R.typeOf.number.greaterThanOrEquals("column", e, 0), R.typeOf.number.lessThanOrEquals("column", e, 3), 4 * e + t;
	}
	static getColumn(e, t, r) {
		R.typeOf.object("matrix", e), R.typeOf.number.greaterThanOrEquals("index", t, 0), R.typeOf.number.lessThanOrEquals("index", t, 3), R.typeOf.object("result", r);
		const n = 4 * t, o = e[n], i = e[n + 1], s = e[n + 2], a = e[n + 3];
		return r.x = o, r.y = i, r.z = s, r.w = a, r;
	}
	static setColumn(t, r, n, o) {
		R.typeOf.object("matrix", t), R.typeOf.number.greaterThanOrEquals("index", r, 0), R.typeOf.number.lessThanOrEquals("index", r, 3), R.typeOf.object("cartesian", n), R.typeOf.object("result", o);
		const i = 4 * r;
		return (o = e.clone(t, o))[i] = n.x, o[i + 1] = n.y, o[i + 2] = n.z, o[i + 3] = n.w, o;
	}
	static getRow(e, t, r) {
		R.typeOf.object("matrix", e), R.typeOf.number.greaterThanOrEquals("index", t, 0), R.typeOf.number.lessThanOrEquals("index", t, 3), R.typeOf.object("result", r);
		const n = e[t], o = e[t + 4], i = e[t + 8], s = e[t + 12];
		return r.x = n, r.y = o, r.z = i, r.w = s, r;
	}
	static setRow(t, r, n, o) {
		return R.typeOf.object("matrix", t), R.typeOf.number.greaterThanOrEquals("index", r, 0), R.typeOf.number.lessThanOrEquals("index", r, 3), R.typeOf.object("cartesian", n), R.typeOf.object("result", o), (o = e.clone(t, o))[r] = n.x, o[r + 4] = n.y, o[r + 8] = n.z, o[r + 12] = n.w, o;
	}
	static setTranslation(e, t, r) {
		return R.typeOf.object("matrix", e), R.typeOf.object("translation", t), R.typeOf.object("result", r), r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = t.x, r[13] = t.y, r[14] = t.z, r[15] = e[15], r;
	}
	static setScale(t, r, n) {
		R.typeOf.object("matrix", t), R.typeOf.object("scale", r), R.typeOf.object("result", n);
		const o = e.getScale(t, be), i = r.x / o.x, s = r.y / o.y, a = r.z / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3], n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * s, n[7] = t[7], n[8] = t[8] * a, n[9] = t[9] * a, n[10] = t[10] * a, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static setUniformScale(t, r, n) {
		R.typeOf.object("matrix", t), R.typeOf.number("scale", r), R.typeOf.object("result", n);
		const o = e.getScale(t, we), i = r / o.x, s = r / o.y, a = r / o.z;
		return n[0] = t[0] * i, n[1] = t[1] * i, n[2] = t[2] * i, n[3] = t[3], n[4] = t[4] * s, n[5] = t[5] * s, n[6] = t[6] * s, n[7] = t[7], n[8] = t[8] * a, n[9] = t[9] * a, n[10] = t[10] * a, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static getScale(e, t) {
		return R.typeOf.object("matrix", e), R.typeOf.object("result", t), t.x = N.magnitude(N.fromElements(e[0], e[1], e[2], Oe)), t.y = N.magnitude(N.fromElements(e[4], e[5], e[6], Oe)), t.z = N.magnitude(N.fromElements(e[8], e[9], e[10], Oe)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, Ee), N.maximumComponent(Ee);
	}
	static setRotation(t, r, n) {
		R.typeOf.object("matrix", t), R.typeOf.object("result", n);
		const o = e.getScale(t, xe);
		return n[0] = r[0] * o.x, n[1] = r[1] * o.x, n[2] = r[2] * o.x, n[3] = t[3], n[4] = r[3] * o.y, n[5] = r[4] * o.y, n[6] = r[5] * o.y, n[7] = t[7], n[8] = r[6] * o.z, n[9] = r[7] * o.z, n[10] = r[8] * o.z, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static getRotation(t, r) {
		R.typeOf.object("matrix", t), R.typeOf.object("result", r);
		const n = e.getScale(t, _e);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.x, r[3] = t[4] / n.y, r[4] = t[5] / n.y, r[5] = t[6] / n.y, r[6] = t[8] / n.z, r[7] = t[9] / n.z, r[8] = t[10] / n.z, r;
	}
	static multiply(e, t, r) {
		R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r);
		const n = e[0], o = e[1], i = e[2], s = e[3], a = e[4], u = e[5], c = e[6], l = e[7], f = e[8], h = e[9], p = e[10], d = e[11], m = e[12], y = e[13], g = e[14], b = e[15], w = t[0], O = t[1], E = t[2], x = t[3], _ = t[4], S = t[5], v = t[6], C = t[7], j = t[8], A = t[9], T = t[10], z = t[11], I = t[12], M = t[13], q = t[14], P = t[15], N = n * w + a * O + f * E + m * x, D = o * w + u * O + h * E + y * x, F = i * w + c * O + p * E + g * x, L = s * w + l * O + d * E + b * x, U = n * _ + a * S + f * v + m * C, k = o * _ + u * S + h * v + y * C, B = i * _ + c * S + p * v + g * C, W = s * _ + l * S + d * v + b * C, $ = n * j + a * A + f * T + m * z, G = o * j + u * A + h * T + y * z, H = i * j + c * A + p * T + g * z, V = s * j + l * A + d * T + b * z, Y = n * I + a * M + f * q + m * P, Q = o * I + u * M + h * q + y * P, Z = i * I + c * M + p * q + g * P, X = s * I + l * M + d * q + b * P;
		return r[0] = N, r[1] = D, r[2] = F, r[3] = L, r[4] = U, r[5] = k, r[6] = B, r[7] = W, r[8] = $, r[9] = G, r[10] = H, r[11] = V, r[12] = Y, r[13] = Q, r[14] = Z, r[15] = X, r;
	}
	static add(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r[4] = e[4] + t[4], r[5] = e[5] + t[5], r[6] = e[6] + t[6], r[7] = e[7] + t[7], r[8] = e[8] + t[8], r[9] = e[9] + t[9], r[10] = e[10] + t[10], r[11] = e[11] + t[11], r[12] = e[12] + t[12], r[13] = e[13] + t[13], r[14] = e[14] + t[14], r[15] = e[15] + t[15], r;
	}
	static subtract(e, t, r) {
		return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r[4] = e[4] - t[4], r[5] = e[5] - t[5], r[6] = e[6] - t[6], r[7] = e[7] - t[7], r[8] = e[8] - t[8], r[9] = e[9] - t[9], r[10] = e[10] - t[10], r[11] = e[11] - t[11], r[12] = e[12] - t[12], r[13] = e[13] - t[13], r[14] = e[14] - t[14], r[15] = e[15] - t[15], r;
	}
	static multiplyTransformation(e, t, r) {
		R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r);
		const n = e[0], o = e[1], i = e[2], s = e[4], a = e[5], u = e[6], c = e[8], l = e[9], f = e[10], h = e[12], p = e[13], d = e[14], m = t[0], y = t[1], g = t[2], b = t[4], w = t[5], O = t[6], E = t[8], x = t[9], _ = t[10], S = t[12], v = t[13], C = t[14], j = n * m + s * y + c * g, A = o * m + a * y + l * g, T = i * m + u * y + f * g, z = n * b + s * w + c * O, I = o * b + a * w + l * O, M = i * b + u * w + f * O, q = n * E + s * x + c * _, P = o * E + a * x + l * _, N = i * E + u * x + f * _, D = n * S + s * v + c * C + h, F = o * S + a * v + l * C + p, L = i * S + u * v + f * C + d;
		return r[0] = j, r[1] = A, r[2] = T, r[3] = 0, r[4] = z, r[5] = I, r[6] = M, r[7] = 0, r[8] = q, r[9] = P, r[10] = N, r[11] = 0, r[12] = D, r[13] = F, r[14] = L, r[15] = 1, r;
	}
	static multiplyByMatrix3(e, t, r) {
		R.typeOf.object("matrix", e), R.typeOf.object("rotation", t), R.typeOf.object("result", r);
		const n = e[0], o = e[1], i = e[2], s = e[4], a = e[5], u = e[6], c = e[8], l = e[9], f = e[10], h = t[0], p = t[1], d = t[2], m = t[3], y = t[4], g = t[5], b = t[6], w = t[7], O = t[8], E = n * h + s * p + c * d, x = o * h + a * p + l * d, _ = i * h + u * p + f * d, S = n * m + s * y + c * g, v = o * m + a * y + l * g, C = i * m + u * y + f * g, j = n * b + s * w + c * O, A = o * b + a * w + l * O, T = i * b + u * w + f * O;
		return r[0] = E, r[1] = x, r[2] = _, r[3] = 0, r[4] = S, r[5] = v, r[6] = C, r[7] = 0, r[8] = j, r[9] = A, r[10] = T, r[11] = 0, r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static multiplyByTranslation(e, t, r) {
		R.typeOf.object("matrix", e), R.typeOf.object("translation", t), R.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = n * e[0] + o * e[4] + i * e[8] + e[12], a = n * e[1] + o * e[5] + i * e[9] + e[13], u = n * e[2] + o * e[6] + i * e[10] + e[14];
		return r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = s, r[13] = a, r[14] = u, r[15] = e[15], r;
	}
	static multiplyByScale(t, r, n) {
		R.typeOf.object("matrix", t), R.typeOf.object("scale", r), R.typeOf.object("result", n);
		const o = r.x, i = r.y, s = r.z;
		return 1 === o && 1 === i && 1 === s ? e.clone(t, n) : (n[0] = o * t[0], n[1] = o * t[1], n[2] = o * t[2], n[3] = t[3], n[4] = i * t[4], n[5] = i * t[5], n[6] = i * t[6], n[7] = t[7], n[8] = s * t[8], n[9] = s * t[9], n[10] = s * t[10], n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n);
	}
	static multiplyByUniformScale(e, t, r) {
		return R.typeOf.object("matrix", e), R.typeOf.number("scale", t), R.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3], r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7], r[8] = e[8] * t, r[9] = e[9] * t, r[10] = e[10] * t, r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static multiplyByVector(e, t, r) {
		R.typeOf.object("matrix", e), R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = t.w, a = e[0] * n + e[4] * o + e[8] * i + e[12] * s, u = e[1] * n + e[5] * o + e[9] * i + e[13] * s, c = e[2] * n + e[6] * o + e[10] * i + e[14] * s, l = e[3] * n + e[7] * o + e[11] * i + e[15] * s;
		return r.x = a, r.y = u, r.z = c, r.w = l, r;
	}
	static multiplyByPointAsVector(e, t, r) {
		R.typeOf.object("matrix", e), R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = e[0] * n + e[4] * o + e[8] * i, a = e[1] * n + e[5] * o + e[9] * i, u = e[2] * n + e[6] * o + e[10] * i;
		return r.x = s, r.y = a, r.z = u, r;
	}
	static multiplyByPoint(e, t, r) {
		R.typeOf.object("matrix", e), R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = t.x, o = t.y, i = t.z, s = e[0] * n + e[4] * o + e[8] * i + e[12], a = e[1] * n + e[5] * o + e[9] * i + e[13], u = e[2] * n + e[6] * o + e[10] * i + e[14];
		return r.x = s, r.y = a, r.z = u, r;
	}
	static multiplyByScalar(e, t, r) {
		return R.typeOf.object("matrix", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r[9] = e[9] * t, r[10] = e[10] * t, r[11] = e[11] * t, r[12] = e[12] * t, r[13] = e[13] * t, r[14] = e[14] * t, r[15] = e[15] * t, r;
	}
	static negate(e, t) {
		return R.typeOf.object("matrix", e), R.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t[9] = -e[9], t[10] = -e[10], t[11] = -e[11], t[12] = -e[12], t[13] = -e[13], t[14] = -e[14], t[15] = -e[15], t;
	}
	static transpose(e, t) {
		R.typeOf.object("matrix", e), R.typeOf.object("result", t);
		const r = e[1], n = e[2], o = e[3], i = e[6], s = e[7], a = e[11];
		return t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = r, t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = n, t[9] = i, t[10] = e[10], t[11] = e[14], t[12] = o, t[13] = s, t[14] = a, t[15] = e[15], t;
	}
	static abs(e, t) {
		return R.typeOf.object("matrix", e), R.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t[9] = Math.abs(e[9]), t[10] = Math.abs(e[10]), t[11] = Math.abs(e[11]), t[12] = Math.abs(e[12]), t[13] = Math.abs(e[13]), t[14] = Math.abs(e[14]), t[15] = Math.abs(e[15]), t;
	}
	static equals(e, t) {
		return e === t || A(e) && A(t) && e[12] === t[12] && e[13] === t[13] && e[14] === t[14] && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[8] === t[8] && e[9] === t[9] && e[10] === t[10] && e[3] === t[3] && e[7] === t[7] && e[11] === t[11] && e[15] === t[15];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || A(e) && A(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r && Math.abs(e[4] - t[4]) <= r && Math.abs(e[5] - t[5]) <= r && Math.abs(e[6] - t[6]) <= r && Math.abs(e[7] - t[7]) <= r && Math.abs(e[8] - t[8]) <= r && Math.abs(e[9] - t[9]) <= r && Math.abs(e[10] - t[10]) <= r && Math.abs(e[11] - t[11]) <= r && Math.abs(e[12] - t[12]) <= r && Math.abs(e[13] - t[13]) <= r && Math.abs(e[14] - t[14]) <= r && Math.abs(e[15] - t[15]) <= r;
	}
	static getTranslation(e, t) {
		return R.typeOf.object("matrix", e), R.typeOf.object("result", t), t.x = e[12], t.y = e[13], t.z = e[14], t;
	}
	static getMatrix3(e, t) {
		return R.typeOf.object("matrix", e), R.typeOf.object("result", t), t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t;
	}
	static inverse(t, r) {
		R.typeOf.object("matrix", t), R.typeOf.object("result", r);
		const n = t[0], o = t[4], i = t[8], s = t[12], a = t[1], u = t[5], c = t[9], l = t[13], f = t[2], h = t[6], p = t[10], d = t[14], m = t[3], y = t[7], g = t[11], b = t[15];
		let w = p * b, O = d * g, E = h * b, x = d * y, _ = h * g, S = p * y, v = f * b, C = d * m, j = f * g, A = p * m, T = f * y, z = h * m;
		const I = w * u + x * c + _ * l - (O * u + E * c + S * l), q = O * a + v * c + A * l - (w * a + C * c + j * l), P = E * a + C * u + T * l - (x * a + v * u + z * l), N = S * a + j * u + z * c - (_ * a + A * u + T * c), D = O * o + E * i + S * s - (w * o + x * i + _ * s), F = w * n + C * i + j * s - (O * n + v * i + A * s), L = x * n + v * o + z * s - (E * n + C * o + T * s), U = _ * n + A * o + T * i - (S * n + j * o + z * i);
		w = i * l, O = s * c, E = o * l, x = s * u, _ = o * c, S = i * u, v = n * l, C = s * a, j = n * c, A = i * a, T = n * u, z = o * a;
		const k = w * y + x * g + _ * b - (O * y + E * g + S * b), B = O * m + v * g + A * b - (w * m + C * g + j * b), W = E * m + C * y + T * b - (x * m + v * y + z * b), G = S * m + j * y + z * g - (_ * m + A * y + T * g), H = E * p + S * d + O * h - (_ * d + w * h + x * p), V = j * d + w * f + C * p - (v * p + A * d + O * f), Y = v * h + z * d + x * f - (T * d + E * f + C * h), Q = T * p + _ * f + A * h - (j * h + z * p + S * f);
		let Z = n * I + o * q + i * P + s * N;
		if (Math.abs(Z) < M.EPSILON21) {
			if (J.equalsEpsilon(e.getMatrix3(t, Se), ve, M.EPSILON7) && $.equals(e.getRow(t, 3, Ce), je)) return r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = 0, r[11] = 0, r[12] = -t[12], r[13] = -t[13], r[14] = -t[14], r[15] = 1, r;
			throw new pe("matrix is not invertible because its determinate is zero.");
		}
		return Z = 1 / Z, r[0] = I * Z, r[1] = q * Z, r[2] = P * Z, r[3] = N * Z, r[4] = D * Z, r[5] = F * Z, r[6] = L * Z, r[7] = U * Z, r[8] = k * Z, r[9] = B * Z, r[10] = W * Z, r[11] = G * Z, r[12] = H * Z, r[13] = V * Z, r[14] = Y * Z, r[15] = Q * Z, r;
	}
	static inverseTransformation(e, t) {
		R.typeOf.object("matrix", e), R.typeOf.object("result", t);
		const r = e[0], n = e[1], o = e[2], i = e[4], s = e[5], a = e[6], u = e[8], c = e[9], l = e[10], f = e[12], h = e[13], p = e[14], d = -r * f - n * h - o * p, m = -i * f - s * h - a * p, y = -u * f - c * h - l * p;
		return t[0] = r, t[1] = i, t[2] = u, t[3] = 0, t[4] = n, t[5] = s, t[6] = c, t[7] = 0, t[8] = o, t[9] = a, t[10] = l, t[11] = 0, t[12] = d, t[13] = m, t[14] = y, t[15] = 1, t;
	}
	static inverseTranspose(t, r) {
		return R.typeOf.object("matrix", t), R.typeOf.object("result", r), e.inverse(e.transpose(t, Ae), r);
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
de.packedLength = 16, de.fromArray = de.unpack, de.IDENTITY = Object.freeze(new de(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)), de.ZERO = Object.freeze(new de(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)), de.COLUMN0ROW0 = 0, de.COLUMN0ROW1 = 1, de.COLUMN0ROW2 = 2, de.COLUMN0ROW3 = 3, de.COLUMN1ROW0 = 4, de.COLUMN1ROW1 = 5, de.COLUMN1ROW2 = 6, de.COLUMN1ROW3 = 7, de.COLUMN2ROW0 = 8, de.COLUMN2ROW1 = 9, de.COLUMN2ROW2 = 10, de.COLUMN2ROW3 = 11, de.COLUMN3ROW0 = 12, de.COLUMN3ROW1 = 13, de.COLUMN3ROW2 = 14, de.COLUMN3ROW3 = 15;
const me = new N(), ye = new N(), ge = new N(), be = new N(), we = new N(), Oe = new N(), Ee = new N(), xe = new N(), _e = new N(), Se = new J(), ve = new J(), Ce = new $(), je = new $(0, 0, 0, 1), Ae = new de();
let Te;
const Re = {
	requestFullscreen: void 0,
	exitFullscreen: void 0,
	fullscreenEnabled: void 0,
	fullscreenElement: void 0,
	fullscreenchange: void 0,
	fullscreenerror: void 0
}, ze = {};
let Ie, Me, qe, Pe, Ne, De, Fe, Le, Ue, ke, Be, We, $e, Ge, He, Ve;
function Ye(e) {
	const t = e.split(".");
	for (let r = 0, n = t.length; r < n; ++r) t[r] = parseInt(t[r], 10);
	return t;
}
function Qe() {
	if (!A(Me) && (Me = !1, !Ke())) {
		const e = / Chrome\/([\.0-9]+)/.exec(Ie.userAgent);
		null !== e && (Me = !0, qe = Ye(e[1]));
	}
	return Me;
}
function Ze() {
	if (!A(Pe) && (Pe = !1, !Qe() && !Ke() && / Safari\/[\.0-9]+/.test(Ie.userAgent))) {
		const e = / Version\/([\.0-9]+)/.exec(Ie.userAgent);
		null !== e && (Pe = !0, Ne = Ye(e[1]));
	}
	return Pe;
}
function Xe() {
	if (!A(De)) {
		De = !1;
		const e = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(Ie.userAgent);
		null !== e && (De = !0, Fe = Ye(e[1]), Fe.isNightly = !!e[2]);
	}
	return De;
}
function Ke() {
	if (!A(Le)) {
		Le = !1;
		const e = / Edg\/([\.0-9]+)/.exec(Ie.userAgent);
		null !== e && (Le = !0, Ue = Ye(e[1]));
	}
	return Le;
}
function Je() {
	if (!A(ke)) {
		ke = !1;
		const e = /Firefox\/([\.0-9]+)/.exec(Ie.userAgent);
		null !== e && (ke = !0, Be = Ye(e[1]));
	}
	return ke;
}
function et() {
	if (!A(Ve)) {
		const e = document.createElement("canvas");
		e.setAttribute("style", "image-rendering: -moz-crisp-edges;image-rendering: pixelated;");
		const t = e.style.imageRendering;
		Ve = A(t) && "" !== t, Ve && (He = t);
	}
	return Ve;
}
function tt() {
	if (!tt.initialized) throw new T("You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP");
	return tt._result;
}
Object.defineProperties(ze, {
	element: { get: function() {
		if (ze.supportsFullscreen()) return document[Re.fullscreenElement];
	} },
	changeEventName: { get: function() {
		if (ze.supportsFullscreen()) return Re.fullscreenchange;
	} },
	errorEventName: { get: function() {
		if (ze.supportsFullscreen()) return Re.fullscreenerror;
	} },
	enabled: { get: function() {
		if (ze.supportsFullscreen()) return document[Re.fullscreenEnabled];
	} },
	fullscreen: { get: function() {
		if (ze.supportsFullscreen()) return null !== ze.element;
	} }
}), ze.supportsFullscreen = function() {
	if (A(Te)) return Te;
	Te = !1;
	const e = document.body;
	if ("function" == typeof e.requestFullscreen) return Re.requestFullscreen = "requestFullscreen", Re.exitFullscreen = "exitFullscreen", Re.fullscreenEnabled = "fullscreenEnabled", Re.fullscreenElement = "fullscreenElement", Re.fullscreenchange = "fullscreenchange", Re.fullscreenerror = "fullscreenerror", Te = !0, Te;
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
		r = `${o}RequestFullscreen`, "function" == typeof e[r] ? (Re.requestFullscreen = r, Te = !0) : (r = `${o}RequestFullScreen`, "function" == typeof e[r] && (Re.requestFullscreen = r, Te = !0)), r = `${o}ExitFullscreen`, "function" == typeof document[r] ? Re.exitFullscreen = r : (r = `${o}CancelFullScreen`, "function" == typeof document[r] && (Re.exitFullscreen = r)), r = `${o}FullscreenEnabled`, void 0 !== document[r] ? Re.fullscreenEnabled = r : (r = `${o}FullScreenEnabled`, void 0 !== document[r] && (Re.fullscreenEnabled = r)), r = `${o}FullscreenElement`, void 0 !== document[r] ? Re.fullscreenElement = r : (r = `${o}FullScreenElement`, void 0 !== document[r] && (Re.fullscreenElement = r)), r = `${o}fullscreenchange`, void 0 !== document[`on${r}`] && ("ms" === o && (r = "MSFullscreenChange"), Re.fullscreenchange = r), r = `${o}fullscreenerror`, void 0 !== document[`on${r}`] && ("ms" === o && (r = "MSFullscreenError"), Re.fullscreenerror = r);
	}
	return Te;
}, ze.requestFullscreen = function(e, t) {
	ze.supportsFullscreen() && e[Re.requestFullscreen]({ vrDisplay: t });
}, ze.exitFullscreen = function() {
	ze.supportsFullscreen() && document[Re.exitFullscreen]();
}, ze._names = Re, Ie = "undefined" != typeof navigator ? navigator : {}, tt._promise = void 0, tt._result = void 0, tt.initialize = function() {
	return A(tt._promise) || (tt._promise = new Promise((e) => {
		const t = new Image();
		t.onload = function() {
			tt._result = t.width > 0 && t.height > 0, e(tt._result);
		}, t.onerror = function() {
			tt._result = !1, e(tt._result);
		}, t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
	})), tt._promise;
}, Object.defineProperties(tt, { initialized: { get: function() {
	return A(tt._result);
} } });
const rt = [];
"undefined" != typeof ArrayBuffer && (rt.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), "undefined" != typeof Uint8ClampedArray && rt.push(Uint8ClampedArray), "undefined" != typeof Uint8ClampedArray && rt.push(Uint8ClampedArray), "undefined" != typeof BigInt64Array && rt.push(BigInt64Array), "undefined" != typeof BigUint64Array && rt.push(BigUint64Array));
const nt = {
	isChrome: Qe,
	chromeVersion: function() {
		return Qe() && qe;
	},
	isSafari: Ze,
	safariVersion: function() {
		return Ze() && Ne;
	},
	isWebkit: Xe,
	webkitVersion: function() {
		return Xe() && Fe;
	},
	isEdge: Ke,
	edgeVersion: function() {
		return Ke() && Ue;
	},
	isFirefox: Je,
	firefoxVersion: function() {
		return Je() && Be;
	},
	isWindows: function() {
		return A(We) || (We = /Windows/i.test(Ie.appVersion)), We;
	},
	isIPadOrIOS: function() {
		return A($e) || ($e = "iPhone" === navigator.platform || "iPod" === navigator.platform || "iPad" === navigator.platform), $e;
	},
	hardwareConcurrency: Ie.hardwareConcurrency ?? 3,
	supportsPointerEvents: function() {
		return A(Ge) || (Ge = !Je() && "undefined" != typeof PointerEvent && (!A(Ie.pointerEnabled) || Ie.pointerEnabled)), Ge;
	},
	supportsImageRenderingPixelated: et,
	supportsWebP: tt,
	imageRenderingValue: function() {
		return et() ? He : void 0;
	},
	typedArrayTypes: rt
};
function ot(e, t, r) {
	return r < 0 && (r += 1), r > 1 && (r -= 1), 6 * r < 1 ? e + 6 * (t - e) * r : 2 * r < 1 ? t : 3 * r < 2 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
nt.supportsBasis = function(e) {
	return nt.supportsWebAssembly() && e.context.supportsBasis;
}, nt.supportsFullscreen = function() {
	return ze.supportsFullscreen();
}, nt.supportsTypedArrays = function() {
	return "undefined" != typeof ArrayBuffer;
}, nt.supportsBigInt64Array = function() {
	return "undefined" != typeof BigInt64Array;
}, nt.supportsBigUint64Array = function() {
	return "undefined" != typeof BigUint64Array;
}, nt.supportsBigInt = function() {
	return "undefined" != typeof BigInt;
}, nt.supportsWebWorkers = function() {
	return "undefined" != typeof Worker;
}, nt.supportsWebAssembly = function() {
	return "undefined" != typeof WebAssembly;
}, nt.supportsWebgl2 = function(e) {
	return R.defined("scene", e), e.context.webgl2;
}, nt.supportsEsmWebWorkers = function() {
	return !Je() || parseInt(Be) >= 114;
};
var it = class e {
	constructor(e, t, r, n) {
		this.red = e ?? 1, this.green = t ?? 1, this.blue = r ?? 1, this.alpha = n ?? 1;
	}
	static fromCartesian4(t, r) {
		return R.typeOf.object("cartesian", t), A(r) ? (r.red = t.x, r.green = t.y, r.blue = t.z, r.alpha = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static fromBytes(t, r, n, o, i) {
		return t = e.byteToFloat(t ?? 255), r = e.byteToFloat(r ?? 255), n = e.byteToFloat(n ?? 255), o = e.byteToFloat(o ?? 255), A(i) ? (i.red = t, i.green = r, i.blue = n, i.alpha = o, i) : new e(t, r, n, o);
	}
	static fromAlpha(t, r, n) {
		return R.typeOf.object("color", t), R.typeOf.number("alpha", r), A(n) ? (n.red = t.red, n.green = t.green, n.blue = t.blue, n.alpha = r, n) : new e(t.red, t.green, t.blue, r);
	}
	static fromRgba(t, r) {
		return at[0] = t, e.fromBytes(ut[0], ut[1], ut[2], ut[3], r);
	}
	static fromHsl(t, r, n, o, i) {
		t = (t ?? 0) % 1, o = o ?? 1;
		let s = n = n ?? 0, a = n, u = n;
		if (0 !== (r = r ?? 0)) {
			let e;
			e = n < .5 ? n * (1 + r) : n + r - n * r;
			const o = 2 * n - e;
			s = ot(o, e, t + 1 / 3), a = ot(o, e, t), u = ot(o, e, t - 1 / 3);
		}
		return A(i) ? (i.red = s, i.green = a, i.blue = u, i.alpha = o, i) : new e(s, a, u, o);
	}
	static fromRandom(t, r) {
		let n = (t = t ?? K.EMPTY_OBJECT).red;
		if (!A(n)) {
			const e = t.minimumRed ?? 0, r = t.maximumRed ?? 1;
			R.typeOf.number.lessThanOrEquals("minimumRed", e, r), n = e + M.nextRandomNumber() * (r - e);
		}
		let o = t.green;
		if (!A(o)) {
			const e = t.minimumGreen ?? 0, r = t.maximumGreen ?? 1;
			R.typeOf.number.lessThanOrEquals("minimumGreen", e, r), o = e + M.nextRandomNumber() * (r - e);
		}
		let i = t.blue;
		if (!A(i)) {
			const e = t.minimumBlue ?? 0, r = t.maximumBlue ?? 1;
			R.typeOf.number.lessThanOrEquals("minimumBlue", e, r), i = e + M.nextRandomNumber() * (r - e);
		}
		let s = t.alpha;
		if (!A(s)) {
			const e = t.minimumAlpha ?? 0, r = t.maximumAlpha ?? 1;
			R.typeOf.number.lessThanOrEquals("minimumAlpha", e, r), s = e + M.nextRandomNumber() * (r - e);
		}
		return A(r) ? (r.red = n, r.green = o, r.blue = i, r.alpha = s, r) : new e(n, o, i, s);
	}
	static fromCssColorString(t, r) {
		R.typeOf.string("color", t), A(r) || (r = new e()), t = t.trim();
		const n = e[t.toUpperCase()];
		if (A(n)) return e.clone(n, r), r;
		let o = ct.exec(t);
		return null !== o ? (r.red = parseInt(o[1], 16) / 15, r.green = parseInt(o[2], 16) / 15, r.blue = parseInt(o[3], 16) / 15, r.alpha = parseInt(o[4] ?? "f", 16) / 15, r) : (o = lt.exec(t), null !== o ? (r.red = parseInt(o[1], 16) / 255, r.green = parseInt(o[2], 16) / 255, r.blue = parseInt(o[3], 16) / 255, r.alpha = parseInt(o[4] ?? "ff", 16) / 255, r) : (o = ft.exec(t), null !== o ? (r.red = parseFloat(o[1]) / ("%" === o[1].substr(-1) ? 100 : 255), r.green = parseFloat(o[2]) / ("%" === o[2].substr(-1) ? 100 : 255), r.blue = parseFloat(o[3]) / ("%" === o[3].substr(-1) ? 100 : 255), r.alpha = parseFloat(o[4] ?? "1.0"), r) : (o = ht.exec(t), null !== o ? e.fromHsl(parseFloat(o[1]) / 360, parseFloat(o[2]) / 100, parseFloat(o[3]) / 100, parseFloat(o[4] ?? "1.0"), r) : r = void 0)));
	}
	static pack(e, t, r) {
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.red, t[r++] = e.green, t[r++] = e.blue, t[r] = e.alpha, t;
	}
	static unpack(t, r, n) {
		return R.defined("array", t), r = r ?? 0, A(n) || (n = new e()), n.red = t[r++], n.green = t[r++], n.blue = t[r++], n.alpha = t[r], n;
	}
	static byteToFloat(e) {
		return e / 255;
	}
	static floatToByte(e) {
		return 1 === e ? 255 : 256 * e | 0;
	}
	static clone(t, r) {
		if (A(t)) return A(r) ? (r.red = t.red, r.green = t.green, r.blue = t.blue, r.alpha = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static equals(e, t) {
		return e === t || A(e) && A(t) && e.red === t.red && e.green === t.green && e.blue === t.blue && e.alpha === t.alpha;
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
		return this === e || A(e) && Math.abs(this.red - e.red) <= t && Math.abs(this.green - e.green) <= t && Math.abs(this.blue - e.blue) <= t && Math.abs(this.alpha - e.alpha) <= t;
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
		return A(t) ? (t[0] = r, t[1] = n, t[2] = o, t[3] = i, t) : [
			r,
			n,
			o,
			i
		];
	}
	static bytesToRgba(e, t, r, n) {
		return ut[0] = e, ut[1] = t, ut[2] = r, ut[3] = n, at[0];
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
		return R.typeOf.object("start", e), R.typeOf.object("end", t), R.typeOf.number("t", r), R.typeOf.object("result", n), n.red = M.lerp(e.red, t.red, r), n.green = M.lerp(e.green, t.green, r), n.blue = M.lerp(e.blue, t.blue, r), n.alpha = M.lerp(e.alpha, t.alpha, r), n;
	}
	static multiplyByScalar(e, t, r) {
		return R.typeOf.object("color", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.red = e.red * t, r.green = e.green * t, r.blue = e.blue * t, r.alpha = e.alpha * t, r;
	}
	static divideByScalar(e, t, r) {
		return R.typeOf.object("color", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.red = e.red / t, r.green = e.green / t, r.blue = e.blue / t, r.alpha = e.alpha / t, r;
	}
};
let st, at, ut;
nt.supportsTypedArrays() && (st = /* @__PURE__ */ new ArrayBuffer(4), at = new Uint32Array(st), ut = new Uint8Array(st));
const ct = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i, lt = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i, ft = /^rgba?\s*\(\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i, ht = /^hsla?\s*\(\s*([0-9.]+)\s*[,\s]+\s*([0-9.]+%)\s*[,\s]+\s*([0-9.]+%)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
it.packedLength = 4, it.ALICEBLUE = Object.freeze(it.fromCssColorString("#F0F8FF")), it.ANTIQUEWHITE = Object.freeze(it.fromCssColorString("#FAEBD7")), it.AQUA = Object.freeze(it.fromCssColorString("#00FFFF")), it.AQUAMARINE = Object.freeze(it.fromCssColorString("#7FFFD4")), it.AZURE = Object.freeze(it.fromCssColorString("#F0FFFF")), it.BEIGE = Object.freeze(it.fromCssColorString("#F5F5DC")), it.BISQUE = Object.freeze(it.fromCssColorString("#FFE4C4")), it.BLACK = Object.freeze(it.fromCssColorString("#000000")), it.BLANCHEDALMOND = Object.freeze(it.fromCssColorString("#FFEBCD")), it.BLUE = Object.freeze(it.fromCssColorString("#0000FF")), it.BLUEVIOLET = Object.freeze(it.fromCssColorString("#8A2BE2")), it.BROWN = Object.freeze(it.fromCssColorString("#A52A2A")), it.BURLYWOOD = Object.freeze(it.fromCssColorString("#DEB887")), it.CADETBLUE = Object.freeze(it.fromCssColorString("#5F9EA0")), it.CHARTREUSE = Object.freeze(it.fromCssColorString("#7FFF00")), it.CHOCOLATE = Object.freeze(it.fromCssColorString("#D2691E")), it.CORAL = Object.freeze(it.fromCssColorString("#FF7F50")), it.CORNFLOWERBLUE = Object.freeze(it.fromCssColorString("#6495ED")), it.CORNSILK = Object.freeze(it.fromCssColorString("#FFF8DC")), it.CRIMSON = Object.freeze(it.fromCssColorString("#DC143C")), it.CYAN = Object.freeze(it.fromCssColorString("#00FFFF")), it.DARKBLUE = Object.freeze(it.fromCssColorString("#00008B")), it.DARKCYAN = Object.freeze(it.fromCssColorString("#008B8B")), it.DARKGOLDENROD = Object.freeze(it.fromCssColorString("#B8860B")), it.DARKGRAY = Object.freeze(it.fromCssColorString("#A9A9A9")), it.DARKGREEN = Object.freeze(it.fromCssColorString("#006400")), it.DARKGREY = it.DARKGRAY, it.DARKKHAKI = Object.freeze(it.fromCssColorString("#BDB76B")), it.DARKMAGENTA = Object.freeze(it.fromCssColorString("#8B008B")), it.DARKOLIVEGREEN = Object.freeze(it.fromCssColorString("#556B2F")), it.DARKORANGE = Object.freeze(it.fromCssColorString("#FF8C00")), it.DARKORCHID = Object.freeze(it.fromCssColorString("#9932CC")), it.DARKRED = Object.freeze(it.fromCssColorString("#8B0000")), it.DARKSALMON = Object.freeze(it.fromCssColorString("#E9967A")), it.DARKSEAGREEN = Object.freeze(it.fromCssColorString("#8FBC8F")), it.DARKSLATEBLUE = Object.freeze(it.fromCssColorString("#483D8B")), it.DARKSLATEGRAY = Object.freeze(it.fromCssColorString("#2F4F4F")), it.DARKSLATEGREY = it.DARKSLATEGRAY, it.DARKTURQUOISE = Object.freeze(it.fromCssColorString("#00CED1")), it.DARKVIOLET = Object.freeze(it.fromCssColorString("#9400D3")), it.DEEPPINK = Object.freeze(it.fromCssColorString("#FF1493")), it.DEEPSKYBLUE = Object.freeze(it.fromCssColorString("#00BFFF")), it.DIMGRAY = Object.freeze(it.fromCssColorString("#696969")), it.DIMGREY = it.DIMGRAY, it.DODGERBLUE = Object.freeze(it.fromCssColorString("#1E90FF")), it.FIREBRICK = Object.freeze(it.fromCssColorString("#B22222")), it.FLORALWHITE = Object.freeze(it.fromCssColorString("#FFFAF0")), it.FORESTGREEN = Object.freeze(it.fromCssColorString("#228B22")), it.FUCHSIA = Object.freeze(it.fromCssColorString("#FF00FF")), it.GAINSBORO = Object.freeze(it.fromCssColorString("#DCDCDC")), it.GHOSTWHITE = Object.freeze(it.fromCssColorString("#F8F8FF")), it.GOLD = Object.freeze(it.fromCssColorString("#FFD700")), it.GOLDENROD = Object.freeze(it.fromCssColorString("#DAA520")), it.GRAY = Object.freeze(it.fromCssColorString("#808080")), it.GREEN = Object.freeze(it.fromCssColorString("#008000")), it.GREENYELLOW = Object.freeze(it.fromCssColorString("#ADFF2F")), it.GREY = it.GRAY, it.HONEYDEW = Object.freeze(it.fromCssColorString("#F0FFF0")), it.HOTPINK = Object.freeze(it.fromCssColorString("#FF69B4")), it.INDIANRED = Object.freeze(it.fromCssColorString("#CD5C5C")), it.INDIGO = Object.freeze(it.fromCssColorString("#4B0082")), it.IVORY = Object.freeze(it.fromCssColorString("#FFFFF0")), it.KHAKI = Object.freeze(it.fromCssColorString("#F0E68C")), it.LAVENDER = Object.freeze(it.fromCssColorString("#E6E6FA")), it.LAVENDAR_BLUSH = Object.freeze(it.fromCssColorString("#FFF0F5")), it.LAWNGREEN = Object.freeze(it.fromCssColorString("#7CFC00")), it.LEMONCHIFFON = Object.freeze(it.fromCssColorString("#FFFACD")), it.LIGHTBLUE = Object.freeze(it.fromCssColorString("#ADD8E6")), it.LIGHTCORAL = Object.freeze(it.fromCssColorString("#F08080")), it.LIGHTCYAN = Object.freeze(it.fromCssColorString("#E0FFFF")), it.LIGHTGOLDENRODYELLOW = Object.freeze(it.fromCssColorString("#FAFAD2")), it.LIGHTGRAY = Object.freeze(it.fromCssColorString("#D3D3D3")), it.LIGHTGREEN = Object.freeze(it.fromCssColorString("#90EE90")), it.LIGHTGREY = it.LIGHTGRAY, it.LIGHTPINK = Object.freeze(it.fromCssColorString("#FFB6C1")), it.LIGHTSEAGREEN = Object.freeze(it.fromCssColorString("#20B2AA")), it.LIGHTSKYBLUE = Object.freeze(it.fromCssColorString("#87CEFA")), it.LIGHTSLATEGRAY = Object.freeze(it.fromCssColorString("#778899")), it.LIGHTSLATEGREY = it.LIGHTSLATEGRAY, it.LIGHTSTEELBLUE = Object.freeze(it.fromCssColorString("#B0C4DE")), it.LIGHTYELLOW = Object.freeze(it.fromCssColorString("#FFFFE0")), it.LIME = Object.freeze(it.fromCssColorString("#00FF00")), it.LIMEGREEN = Object.freeze(it.fromCssColorString("#32CD32")), it.LINEN = Object.freeze(it.fromCssColorString("#FAF0E6")), it.MAGENTA = Object.freeze(it.fromCssColorString("#FF00FF")), it.MAROON = Object.freeze(it.fromCssColorString("#800000")), it.MEDIUMAQUAMARINE = Object.freeze(it.fromCssColorString("#66CDAA")), it.MEDIUMBLUE = Object.freeze(it.fromCssColorString("#0000CD")), it.MEDIUMORCHID = Object.freeze(it.fromCssColorString("#BA55D3")), it.MEDIUMPURPLE = Object.freeze(it.fromCssColorString("#9370DB")), it.MEDIUMSEAGREEN = Object.freeze(it.fromCssColorString("#3CB371")), it.MEDIUMSLATEBLUE = Object.freeze(it.fromCssColorString("#7B68EE")), it.MEDIUMSPRINGGREEN = Object.freeze(it.fromCssColorString("#00FA9A")), it.MEDIUMTURQUOISE = Object.freeze(it.fromCssColorString("#48D1CC")), it.MEDIUMVIOLETRED = Object.freeze(it.fromCssColorString("#C71585")), it.MIDNIGHTBLUE = Object.freeze(it.fromCssColorString("#191970")), it.MINTCREAM = Object.freeze(it.fromCssColorString("#F5FFFA")), it.MISTYROSE = Object.freeze(it.fromCssColorString("#FFE4E1")), it.MOCCASIN = Object.freeze(it.fromCssColorString("#FFE4B5")), it.NAVAJOWHITE = Object.freeze(it.fromCssColorString("#FFDEAD")), it.NAVY = Object.freeze(it.fromCssColorString("#000080")), it.OLDLACE = Object.freeze(it.fromCssColorString("#FDF5E6")), it.OLIVE = Object.freeze(it.fromCssColorString("#808000")), it.OLIVEDRAB = Object.freeze(it.fromCssColorString("#6B8E23")), it.ORANGE = Object.freeze(it.fromCssColorString("#FFA500")), it.ORANGERED = Object.freeze(it.fromCssColorString("#FF4500")), it.ORCHID = Object.freeze(it.fromCssColorString("#DA70D6")), it.PALEGOLDENROD = Object.freeze(it.fromCssColorString("#EEE8AA")), it.PALEGREEN = Object.freeze(it.fromCssColorString("#98FB98")), it.PALETURQUOISE = Object.freeze(it.fromCssColorString("#AFEEEE")), it.PALEVIOLETRED = Object.freeze(it.fromCssColorString("#DB7093")), it.PAPAYAWHIP = Object.freeze(it.fromCssColorString("#FFEFD5")), it.PEACHPUFF = Object.freeze(it.fromCssColorString("#FFDAB9")), it.PERU = Object.freeze(it.fromCssColorString("#CD853F")), it.PINK = Object.freeze(it.fromCssColorString("#FFC0CB")), it.PLUM = Object.freeze(it.fromCssColorString("#DDA0DD")), it.POWDERBLUE = Object.freeze(it.fromCssColorString("#B0E0E6")), it.PURPLE = Object.freeze(it.fromCssColorString("#800080")), it.RED = Object.freeze(it.fromCssColorString("#FF0000")), it.ROSYBROWN = Object.freeze(it.fromCssColorString("#BC8F8F")), it.ROYALBLUE = Object.freeze(it.fromCssColorString("#4169E1")), it.SADDLEBROWN = Object.freeze(it.fromCssColorString("#8B4513")), it.SALMON = Object.freeze(it.fromCssColorString("#FA8072")), it.SANDYBROWN = Object.freeze(it.fromCssColorString("#F4A460")), it.SEAGREEN = Object.freeze(it.fromCssColorString("#2E8B57")), it.SEASHELL = Object.freeze(it.fromCssColorString("#FFF5EE")), it.SIENNA = Object.freeze(it.fromCssColorString("#A0522D")), it.SILVER = Object.freeze(it.fromCssColorString("#C0C0C0")), it.SKYBLUE = Object.freeze(it.fromCssColorString("#87CEEB")), it.SLATEBLUE = Object.freeze(it.fromCssColorString("#6A5ACD")), it.SLATEGRAY = Object.freeze(it.fromCssColorString("#708090")), it.SLATEGREY = it.SLATEGRAY, it.SNOW = Object.freeze(it.fromCssColorString("#FFFAFA")), it.SPRINGGREEN = Object.freeze(it.fromCssColorString("#00FF7F")), it.STEELBLUE = Object.freeze(it.fromCssColorString("#4682B4")), it.TAN = Object.freeze(it.fromCssColorString("#D2B48C")), it.TEAL = Object.freeze(it.fromCssColorString("#008080")), it.THISTLE = Object.freeze(it.fromCssColorString("#D8BFD8")), it.TOMATO = Object.freeze(it.fromCssColorString("#FF6347")), it.TURQUOISE = Object.freeze(it.fromCssColorString("#40E0D0")), it.VIOLET = Object.freeze(it.fromCssColorString("#EE82EE")), it.WHEAT = Object.freeze(it.fromCssColorString("#F5DEB3")), it.WHITE = Object.freeze(it.fromCssColorString("#FFFFFF")), it.WHITESMOKE = Object.freeze(it.fromCssColorString("#F5F5F5")), it.YELLOW = Object.freeze(it.fromCssColorString("#FFFF00")), it.YELLOWGREEN = Object.freeze(it.fromCssColorString("#9ACD32")), it.TRANSPARENT = Object.freeze(new it(0, 0, 0, 0));
var pt = class e {
	constructor(e, t) {
		this.x = e ?? 0, this.y = t ?? 0;
	}
	static fromElements(t, r, n) {
		return A(n) ? (n.x = t, n.y = r, n) : new e(t, r);
	}
	static clone(t, r) {
		if (A(t)) return A(r) ? (r.x = t.x, r.y = t.y, r) : new e(t.x, t.y);
	}
	static pack(e, t, r) {
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r] = e.y, t;
	}
	static unpack(t, r, n) {
		return R.defined("array", t), r = r ?? 0, A(n) || (n = new e()), n.x = t[r++], n.y = t[r], n;
	}
	static packArray(t, r) {
		R.defined("array", t);
		const n = t.length, o = 2 * n;
		if (A(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new T("If result is a typed array, it must have exactly array.length * 2 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 2 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (R.defined("array", t), R.typeOf.number.greaterThanOrEquals("array.length", t.length, 2), t.length % 2 != 0) throw new T("array length must be a multiple of 2.");
		const n = t.length;
		A(r) ? r.length = n / 2 : r = new Array(n / 2);
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
		const o = M.clamp(e.x, t.x, r.x), i = M.clamp(e.y, t.y, r.y);
		return n.x = o, n.y = i, n;
	}
	static magnitudeSquared(e) {
		return R.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return R.typeOf.object("left", t), R.typeOf.object("right", r), e.subtract(t, r, dt), e.magnitude(dt);
	}
	static distanceSquared(t, r) {
		return R.typeOf.object("left", t), R.typeOf.object("right", r), e.subtract(t, r, dt), e.magnitudeSquared(dt);
	}
	static normalize(t, r) {
		R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, isNaN(r.x) || isNaN(r.y)) throw new T("normalized result is not a number");
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
		return R.typeOf.object("start", t), R.typeOf.object("end", r), R.typeOf.number("t", n), R.typeOf.object("result", o), e.multiplyByScalar(r, n, mt), o = e.multiplyByScalar(t, 1 - n, o), e.add(mt, o, o);
	}
	static angleBetween(t, r) {
		return R.typeOf.object("left", t), R.typeOf.object("right", r), e.normalize(t, yt), e.normalize(r, gt), M.acosClamped(e.dot(yt, gt));
	}
	static mostOrthogonalAxis(t, r) {
		R.typeOf.object("cartesian", t), R.typeOf.object("result", r);
		const n = e.normalize(t, bt);
		return e.abs(n, n), n.x <= n.y ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Y, r);
	}
	static equals(e, t) {
		return e === t || A(e) && A(t) && e.x === t.x && e.y === t.y;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || A(e) && A(t) && M.equalsEpsilon(e.x, t.x, r, n) && M.equalsEpsilon(e.y, t.y, r, n);
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
pt.fromCartesian3 = pt.clone, pt.fromCartesian4 = pt.clone, pt.packedLength = 2, pt.fromArray = pt.unpack;
const dt = new pt(), mt = new pt(), yt = new pt(), gt = new pt(), bt = new pt();
pt.ZERO = Object.freeze(new pt(0, 0)), pt.ONE = Object.freeze(new pt(1, 1)), pt.UNIT_X = Object.freeze(new pt(1, 0)), pt.UNIT_Y = Object.freeze(new pt(0, 1));
const wt = new N(), Ot = new N();
function Et(e, t, r, n, o) {
	if (!A(e)) throw new T("cartesian is required.");
	if (!A(t)) throw new T("oneOverRadii is required.");
	if (!A(r)) throw new T("oneOverRadiiSquared is required.");
	if (!A(n)) throw new T("centerToleranceSquared is required.");
	const i = e.x, s = e.y, a = e.z, u = t.x, c = t.y, l = t.z, f = i * i * u * u, h = s * s * c * c, p = a * a * l * l, d = f + h + p, m = Math.sqrt(1 / d), y = N.multiplyByScalar(e, m, wt);
	if (d < n) return isFinite(m) ? N.clone(y, o) : void 0;
	const g = r.x, b = r.y, w = r.z, O = Ot;
	O.x = y.x * g * 2, O.y = y.y * b * 2, O.z = y.z * w * 2;
	let E, x, _, S, v, C, j, R, z, I, q, P = (1 - m) * N.magnitude(e) / (.5 * N.magnitude(O)), D = 0;
	do
		P -= D, _ = 1 / (1 + P * g), S = 1 / (1 + P * b), v = 1 / (1 + P * w), C = _ * _, j = S * S, R = v * v, z = C * _, I = j * S, q = R * v, E = f * C + h * j + p * R - 1, x = f * z * g + h * I * b + p * q * w, D = E / (-2 * x);
	while (Math.abs(E) > M.EPSILON12);
	return A(o) ? (o.x = i * _, o.y = s * S, o.z = a * v, o) : new N(i * _, s * S, a * v);
}
var xt = class e {
	constructor(e, t, r) {
		this.longitude = e ?? 0, this.latitude = t ?? 0, this.height = r ?? 0;
	}
	static fromRadians(t, r, n, o) {
		return R.typeOf.number("longitude", t), R.typeOf.number("latitude", r), n = n ?? 0, A(o) ? (o.longitude = t, o.latitude = r, o.height = n, o) : new e(t, r, n);
	}
	static fromDegrees(t, r, n, o) {
		return R.typeOf.number("longitude", t), R.typeOf.number("latitude", r), t = M.toRadians(t), r = M.toRadians(r), e.fromRadians(t, r, n, o);
	}
	static fromCartesian(t, r, n) {
		const o = A(r) ? r.oneOverRadii : e._ellipsoidOneOverRadii, i = A(r) ? r.oneOverRadiiSquared : e._ellipsoidOneOverRadiiSquared, s = Et(t, o, i, A(r) ? r._centerToleranceSquared : e._ellipsoidCenterToleranceSquared, St);
		if (!A(s)) return;
		let a = N.multiplyComponents(s, i, _t);
		a = N.normalize(a, a);
		const u = N.subtract(t, s, vt), c = Math.atan2(a.y, a.x), l = Math.asin(a.z), f = M.sign(N.dot(u, t)) * N.magnitude(u);
		return A(n) ? (n.longitude = c, n.latitude = l, n.height = f, n) : new e(c, l, f);
	}
	static toCartesian(e, t, r) {
		return R.defined("cartographic", e), N.fromRadians(e.longitude, e.latitude, e.height, t, r);
	}
	static clone(t, r) {
		if (A(t)) return A(r) ? (r.longitude = t.longitude, r.latitude = t.latitude, r.height = t.height, r) : new e(t.longitude, t.latitude, t.height);
	}
	static equals(e, t) {
		return e === t || A(e) && A(t) && e.longitude === t.longitude && e.latitude === t.latitude && e.height === t.height;
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || A(e) && A(t) && Math.abs(e.longitude - t.longitude) <= r && Math.abs(e.latitude - t.latitude) <= r && Math.abs(e.height - t.height) <= r;
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
	static _ellipsoidOneOverRadii = new N(1 / 6378137, 1 / 6378137, 1 / 6356752.314245179);
	static _ellipsoidOneOverRadiiSquared = new N(1 / 40680631590769, 1 / 40680631590769, 1 / 40408299984661.445);
	static _ellipsoidCenterToleranceSquared = M.EPSILON1;
};
xt.ZERO = Object.freeze(new xt(0, 0, 0));
const _t = new N(), St = new N(), vt = new N();
function Ct(e, t, r, n) {
	t = t ?? 0, r = r ?? 0, n = n ?? 0, R.typeOf.number.greaterThanOrEquals("x", t, 0), R.typeOf.number.greaterThanOrEquals("y", r, 0), R.typeOf.number.greaterThanOrEquals("z", n, 0), e._radii = new N(t, r, n), e._radiiSquared = new N(t * t, r * r, n * n), e._radiiToTheFourth = new N(t * t * t * t, r * r * r * r, n * n * n * n), e._oneOverRadii = new N(0 === t ? 0 : 1 / t, 0 === r ? 0 : 1 / r, 0 === n ? 0 : 1 / n), e._oneOverRadiiSquared = new N(0 === t ? 0 : 1 / (t * t), 0 === r ? 0 : 1 / (r * r), 0 === n ? 0 : 1 / (n * n)), e._minimumRadius = Math.min(t, r, n), e._maximumRadius = Math.max(t, r, n), e._centerToleranceSquared = M.EPSILON1, 0 !== e._radiiSquared.z && (e._squaredXOverSquaredZ = e._radiiSquared.x / e._radiiSquared.z);
}
var jt = class e {
	constructor(e, t, r) {
		this._radii = void 0, this._radiiSquared = void 0, this._radiiToTheFourth = void 0, this._oneOverRadii = void 0, this._oneOverRadiiSquared = void 0, this._minimumRadius = void 0, this._maximumRadius = void 0, this._centerToleranceSquared = void 0, this._squaredXOverSquaredZ = void 0, Ct(this, e, t, r);
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
		if (!A(t)) return;
		const n = t._radii;
		return A(r) ? (N.clone(n, r._radii), N.clone(t._radiiSquared, r._radiiSquared), N.clone(t._radiiToTheFourth, r._radiiToTheFourth), N.clone(t._oneOverRadii, r._oneOverRadii), N.clone(t._oneOverRadiiSquared, r._oneOverRadiiSquared), r._minimumRadius = t._minimumRadius, r._maximumRadius = t._maximumRadius, r._centerToleranceSquared = t._centerToleranceSquared, r) : new e(n.x, n.y, n.z);
	}
	static fromCartesian3(t, r) {
		return A(r) || (r = new e()), A(t) ? (Ct(r, t.x, t.y, t.z), r) : r;
	}
	static get default() {
		return e._default;
	}
	static set default(t) {
		R.typeOf.object("value", t), e._default = t, N._ellipsoidRadiiSquared = t.radiiSquared, xt._ellipsoidOneOverRadii = t.oneOverRadii, xt._ellipsoidOneOverRadiiSquared = t.oneOverRadiiSquared, xt._ellipsoidCenterToleranceSquared = t._centerToleranceSquared;
	}
	clone(t) {
		return e.clone(this, t);
	}
	static pack(e, t, r) {
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, N.pack(e._radii, t, r), t;
	}
	static unpack(t, r, n) {
		R.defined("array", t), r = r ?? 0;
		const o = N.unpack(t, r);
		return e.fromCartesian3(o, n);
	}
	geodeticSurfaceNormalCartographic(e, t) {
		R.typeOf.object("cartographic", e);
		const r = e.longitude, n = e.latitude, o = Math.cos(n), i = o * Math.cos(r), s = o * Math.sin(r), a = Math.sin(n);
		return A(t) || (t = new N()), t.x = i, t.y = s, t.z = a, N.normalize(t, t);
	}
	geodeticSurfaceNormal(e, t) {
		if (R.typeOf.object("cartesian", e), isNaN(e.x) || isNaN(e.y) || isNaN(e.z)) throw new T("cartesian has a NaN component");
		if (!N.equalsEpsilon(e, N.ZERO, M.EPSILON14)) return A(t) || (t = new N()), t = N.multiplyComponents(e, this._oneOverRadiiSquared, t), N.normalize(t, t);
	}
	cartographicToCartesian(e, t) {
		const r = At, n = Tt;
		this.geodeticSurfaceNormalCartographic(e, r), N.multiplyComponents(this._radiiSquared, r, n);
		const o = Math.sqrt(N.dot(r, n));
		return N.divideByScalar(n, o, n), N.multiplyByScalar(r, e.height, r), A(t) || (t = new N()), N.add(n, r, t);
	}
	cartographicArrayToCartesianArray(e, t) {
		R.defined("cartographics", e);
		const r = e.length;
		A(t) ? t.length = r : t = new Array(r);
		for (let n = 0; n < r; n++) t[n] = this.cartographicToCartesian(e[n], t[n]);
		return t;
	}
	cartesianToCartographic(e, t) {
		const r = this.scaleToGeodeticSurface(e, zt);
		if (!A(r)) return;
		const n = this.geodeticSurfaceNormal(r, Rt), o = N.subtract(e, r, It), i = Math.atan2(n.y, n.x), s = Math.asin(n.z), a = M.sign(N.dot(o, e)) * N.magnitude(o);
		return A(t) ? (t.longitude = i, t.latitude = s, t.height = a, t) : new xt(i, s, a);
	}
	cartesianArrayToCartographicArray(e, t) {
		R.defined("cartesians", e);
		const r = e.length;
		A(t) ? t.length = r : t = new Array(r);
		for (let n = 0; n < r; ++n) t[n] = this.cartesianToCartographic(e[n], t[n]);
		return t;
	}
	scaleToGeodeticSurface(e, t) {
		return Et(e, this._oneOverRadii, this._oneOverRadiiSquared, this._centerToleranceSquared, t);
	}
	scaleToGeocentricSurface(e, t) {
		R.typeOf.object("cartesian", e), A(t) || (t = new N());
		const r = e.x, n = e.y, o = e.z, i = this._oneOverRadiiSquared, s = 1 / Math.sqrt(r * r * i.x + n * n * i.y + o * o * i.z);
		return N.multiplyByScalar(e, s, t);
	}
	transformPositionToScaledSpace(e, t) {
		return A(t) || (t = new N()), N.multiplyComponents(e, this._oneOverRadii, t);
	}
	transformPositionFromScaledSpace(e, t) {
		return A(t) || (t = new N()), N.multiplyComponents(e, this._radii, t);
	}
	equals(e) {
		return this === e || A(e) && N.equals(this._radii, e._radii);
	}
	toString() {
		return this._radii.toString();
	}
	getSurfaceNormalIntersectionWithZAxis(e, t, r) {
		if (R.typeOf.object("position", e), !M.equalsEpsilon(this._radii.x, this._radii.y, M.EPSILON15)) throw new T("Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)");
		R.typeOf.number.greaterThan("Ellipsoid.radii.z", this._radii.z, 0), t = t ?? 0;
		const n = this._squaredXOverSquaredZ;
		if (A(r) || (r = new N()), r.x = 0, r.y = 0, r.z = e.z * (1 - n), !(Math.abs(r.z) >= this._radii.z - t)) return r;
	}
	getLocalCurvature(e, t) {
		R.typeOf.object("surfacePosition", e), A(t) || (t = new pt());
		const r = this.getSurfaceNormalIntersectionWithZAxis(e, 0, Mt), n = N.distance(e, r), o = n * (this.minimumRadius * n / this.maximumRadius ** 2) ** 2;
		return pt.fromElements(1 / n, 1 / o, t);
	}
	surfaceArea(e) {
		R.typeOf.object("rectangle", e);
		const t = e.west;
		let r = e.east;
		const n = e.south, o = e.north;
		for (; r < t;) r += M.TWO_PI;
		const i = this._radiiSquared, s = i.x, a = i.y, u = i.z, c = s * a;
		return Nt(n, o, function(e) {
			const n = Math.cos(e), o = Math.sin(e);
			return Math.cos(e) * Nt(t, r, function(e) {
				const t = Math.cos(e), r = Math.sin(e);
				return Math.sqrt(c * o * o + u * (a * t * t + s * r * r) * n * n);
			});
		});
	}
};
jt.WGS84 = Object.freeze(new jt(6378137, 6378137, 6356752.314245179)), jt.UNIT_SPHERE = Object.freeze(new jt(1, 1, 1)), jt.MOON = Object.freeze(new jt(M.LUNAR_RADIUS, M.LUNAR_RADIUS, M.LUNAR_RADIUS)), jt.MARS = Object.freeze(new jt(3396190, 3396190, 3376200)), jt._default = jt.WGS84, jt.packedLength = N.packedLength, jt.prototype.geocentricSurfaceNormal = N.normalize;
const At = new N(), Tt = new N(), Rt = new N(), zt = new N(), It = new N(), Mt = new N(), qt = [
	.14887433898163,
	.43339539412925,
	.67940956829902,
	.86506336668898,
	.97390652851717,
	0
], Pt = [
	.29552422471475,
	.26926671930999,
	.21908636251598,
	.14945134915058,
	.066671344308684,
	0
];
function Nt(e, t, r) {
	R.typeOf.number("a", e), R.typeOf.number("b", t), R.typeOf.func("func", r);
	const n = .5 * (t + e), o = .5 * (t - e);
	let i = 0;
	for (let s = 0; s < 5; s++) {
		const e = o * qt[s];
		i += Pt[s] * (r(n + e) + r(n - e));
	}
	return i *= o, i;
}
const Dt = {
	OUTSIDE: -1,
	INTERSECTING: 0,
	INSIDE: 1
};
function Ft(e, t, r) {
	R.defined("array", e), R.defined("itemToFind", t), R.defined("comparator", r);
	let n, o, i = 0, s = e.length - 1;
	for (; i <= s;) if (n = ~~((i + s) / 2), o = r(e[n], t), o < 0) i = n + 1;
	else {
		if (!(o > 0)) return n;
		s = n - 1;
	}
	return ~(s + 1);
}
function Lt(e, t, r, n, o) {
	this.xPoleWander = e, this.yPoleWander = t, this.xPoleOffset = r, this.yPoleOffset = n, this.ut1MinusUtc = o;
}
function Ut(e) {
	if (null === e || isNaN(e)) throw new T("year is required and must be a number.");
	return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}
Object.freeze(Dt);
const kt = [
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
function Bt(e, t, r, n, o, i, s, a) {
	e = e ?? 1, t = t ?? 1, r = r ?? 1, n = n ?? 0, o = o ?? 0, i = i ?? 0, s = s ?? 0, a = a ?? !1, R.typeOf.number.greaterThanOrEquals("Year", e, 1), R.typeOf.number.lessThanOrEquals("Year", e, 9999), R.typeOf.number.greaterThanOrEquals("Month", t, 1), R.typeOf.number.lessThanOrEquals("Month", t, 12), R.typeOf.number.greaterThanOrEquals("Day", r, 1), R.typeOf.number.lessThanOrEquals("Day", r, 31), R.typeOf.number.greaterThanOrEquals("Hour", n, 0), R.typeOf.number.lessThanOrEquals("Hour", n, 23), R.typeOf.number.greaterThanOrEquals("Minute", o, 0), R.typeOf.number.lessThanOrEquals("Minute", o, 59), R.typeOf.bool("IsLeapSecond", a), R.typeOf.number.greaterThanOrEquals("Second", i, 0), R.typeOf.number.lessThanOrEquals("Second", i, a ? 60 : 59), R.typeOf.number.greaterThanOrEquals("Millisecond", s, 0), R.typeOf.number.lessThan("Millisecond", s, 1e3), function() {
		const n = 2 === t && Ut(e) ? kt[t - 1] + 1 : kt[t - 1];
		if (r > n) throw new T("Month and Day represents invalid date");
	}(), this.year = e, this.month = t, this.day = r, this.hour = n, this.minute = o, this.second = i, this.millisecond = s, this.isLeapSecond = a;
}
function Wt(e, t) {
	this.julianDate = e, this.offset = t;
}
const $t = {
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
Object.freeze($t);
const Gt = {
	UTC: 0,
	TAI: 1
};
Object.freeze(Gt);
const Ht = new Bt(), Vt = [
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
function Yt(e, t) {
	return lr.compare(e.julianDate, t.julianDate);
}
const Qt = new Wt();
function Zt(e) {
	Qt.julianDate = e;
	const t = lr.leapSeconds;
	let r = Ft(t, Qt, Yt);
	r < 0 && (r = ~r), r >= t.length && (r = t.length - 1);
	let n = t[r].offset;
	r > 0 && lr.secondsDifference(t[r].julianDate, e) > n && (r--, n = t[r].offset), lr.addSeconds(e, n, e);
}
function Xt(e, t) {
	Qt.julianDate = e;
	const r = lr.leapSeconds;
	let n = Ft(r, Qt, Yt);
	if (n < 0 && (n = ~n), 0 === n) return lr.addSeconds(e, -r[0].offset, t);
	if (n >= r.length) return lr.addSeconds(e, -r[n - 1].offset, t);
	const o = lr.secondsDifference(r[n].julianDate, e);
	return 0 === o ? lr.addSeconds(e, -r[n].offset, t) : o <= 1 ? void 0 : lr.addSeconds(e, -r[--n].offset, t);
}
function Kt(e, t, r) {
	const n = t / $t.SECONDS_PER_DAY | 0;
	return e += n, (t -= $t.SECONDS_PER_DAY * n) < 0 && (e--, t += $t.SECONDS_PER_DAY), r.dayNumber = e, r.secondsOfDay = t, r;
}
function Jt(e, t, r, n, o, i, s) {
	const a = (t - 14) / 12 | 0, u = e + 4800 + a;
	let c = (1461 * u / 4 | 0) + (367 * (t - 2 - 12 * a) / 12 | 0) - (3 * ((u + 100) / 100 | 0) / 4 | 0) + r - 32075;
	(n -= 12) < 0 && (n += 24);
	const l = i + (n * $t.SECONDS_PER_HOUR + o * $t.SECONDS_PER_MINUTE + s * $t.SECONDS_PER_MILLISECOND);
	return l >= 43200 && (c -= 1), [c, l];
}
const er = /^(\d{4})$/, tr = /^(\d{4})-(\d{2})$/, rr = /^(\d{4})-?(\d{3})$/, nr = /^(\d{4})-?W(\d{2})-?(\d{1})?$/, or = /^(\d{4})-?(\d{2})-?(\d{2})$/, ir = /([Z+\-])?(\d{2})?:?(\d{2})?$/, sr = /^(\d{2})(\.\d+)?/.source + ir.source, ar = /^(\d{2}):?(\d{2})(\.\d+)?/.source + ir.source, ur = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + ir.source, cr = "Invalid ISO 8601 date.";
var lr = class e {
	constructor(e, t, r) {
		this.dayNumber = void 0, this.secondsOfDay = void 0, t = t ?? 0, r = r ?? Gt.UTC;
		const n = 0 | (e = e ?? 0);
		Kt(n, t += (e - n) * $t.SECONDS_PER_DAY, this), r === Gt.UTC && Zt(this);
	}
	static fromGregorianDate(t, r) {
		if (!(t instanceof Bt)) throw new T("date must be a valid GregorianDate.");
		const n = Jt(t.year, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
		return A(r) ? (Kt(n[0], n[1], r), Zt(r), r) : new e(n[0], n[1], Gt.UTC);
	}
	static fromDate(t, r) {
		if (!(t instanceof Date) || isNaN(t.getTime())) throw new T("date must be a valid JavaScript Date.");
		const n = Jt(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.getUTCMilliseconds());
		return A(r) ? (Kt(n[0], n[1], r), Zt(r), r) : new e(n[0], n[1], Gt.UTC);
	}
	static fromIso8601(t, r) {
		if ("string" != typeof t) throw new T(cr);
		let n, o = (t = t.replace(",", ".")).split("T"), i = 1, s = 1, a = 0, u = 0, c = 0, l = 0;
		const f = o[0], h = o[1];
		let p, d, m, y;
		if (!A(f)) throw new T(cr);
		if (o = f.match(or), null !== o) {
			if (m = f.split("-").length - 1, m > 0 && 2 !== m) throw new T(cr);
			n = +o[1], i = +o[2], s = +o[3];
		} else if (o = f.match(tr), null !== o) n = +o[1], i = +o[2];
		else if (o = f.match(er), null !== o) n = +o[1];
		else {
			let e;
			if (o = f.match(rr), null !== o) {
				if (n = +o[1], e = +o[2], d = Ut(n), e < 1 || d && e > 366 || !d && e > 365) throw new T(cr);
			} else {
				if (o = f.match(nr), null === o) throw new T(cr);
				{
					n = +o[1];
					const t = +o[2], r = +o[3] || 0;
					if (m = f.split("-").length - 1, m > 0 && (!A(o[3]) && 1 !== m || A(o[3]) && 2 !== m)) throw new T(cr);
					e = 7 * t + r - new Date(Date.UTC(n, 0, 4)).getUTCDay() - 3;
				}
			}
			p = new Date(Date.UTC(n, 0, 1)), p.setUTCDate(e), i = p.getUTCMonth() + 1, s = p.getUTCDate();
		}
		if (d = Ut(n), i < 1 || i > 12 || s < 1 || (2 !== i || !d) && s > Vt[i - 1] || d && 2 === i && s > 29) throw new T(cr);
		if (A(h)) {
			if (o = h.match(ur), null !== o) {
				if (m = h.split(":").length - 1, m > 0 && 2 !== m && 3 !== m) throw new T(cr);
				a = +o[1], u = +o[2], c = +o[3], l = 1e3 * +(o[4] || 0), y = 5;
			} else if (o = h.match(ar), null !== o) {
				if (m = h.split(":").length - 1, m > 2) throw new T(cr);
				a = +o[1], u = +o[2], c = 60 * +(o[3] || 0), y = 4;
			} else {
				if (o = h.match(sr), null === o) throw new T(cr);
				a = +o[1], u = 60 * +(o[2] || 0), y = 3;
			}
			if (u >= 60 || c >= 61 || a > 24 || 24 === a && (u > 0 || c > 0 || l > 0)) throw new T(cr);
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
		for (p = d && 2 === i ? 29 : Vt[i - 1]; s > p;) s -= p, i++, i > 12 && (i -= 12, n++), p = d && 2 === i ? 29 : Vt[i - 1];
		for (; u < 0;) u += 60, a--;
		for (; a < 0;) a += 24, s--;
		for (; s < 1;) i--, i < 1 && (i += 12, n--), p = d && 2 === i ? 29 : Vt[i - 1], s += p;
		const b = Jt(n, i, s, a, u, c, l);
		return A(r) ? (Kt(b[0], b[1], r), Zt(r)) : r = new e(b[0], b[1], Gt.UTC), g && e.addSeconds(r, 1, r), r;
	}
	static now(t) {
		return e.fromDate(/* @__PURE__ */ new Date(), t);
	}
	static toGregorianDate(t, r) {
		if (!A(t)) throw new T("julianDate is required.");
		let n = !1, o = Xt(t, fr);
		A(o) || (e.addSeconds(t, -1, fr), o = Xt(fr, fr), n = !0);
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
		let d = s / $t.SECONDS_PER_HOUR | 0, m = s - d * $t.SECONDS_PER_HOUR;
		const y = m / $t.SECONDS_PER_MINUTE | 0;
		m -= y * $t.SECONDS_PER_MINUTE;
		let g = 0 | m;
		const b = (m - g) / $t.SECONDS_PER_MILLISECOND;
		return d += 12, d > 23 && (d -= 24), n && (g += 1), A(r) ? (r.year = p, r.month = h, r.day = f, r.hour = d, r.minute = y, r.second = g, r.millisecond = b, r.isLeapSecond = n, r) : new Bt(p, h, f, d, y, g, b, n);
	}
	static toDate(t) {
		if (!A(t)) throw new T("julianDate is required.");
		const r = e.toGregorianDate(t, Ht);
		let n = r.second;
		return r.isLeapSecond && (n -= 1), new Date(Date.UTC(r.year, r.month - 1, r.day, r.hour, r.minute, n, r.millisecond));
	}
	static toIso8601(t, r) {
		if (!A(t)) throw new T("julianDate is required.");
		const n = e.toGregorianDate(t, Ht);
		let o = n.year, i = n.month, s = n.day, a = n.hour;
		const u = n.minute, c = n.second, l = n.millisecond;
		let f;
		if (1e4 === o && 1 === i && 1 === s && 0 === a && 0 === u && 0 === c && 0 === l && (o = 9999, i = 12, s = 31, a = 24), !A(r) && 0 !== l) {
			const e = .01 * l;
			return f = e < 1e-6 ? e.toFixed(20).replace(".", "").replace(/0+$/, "") : e.toString().replace(".", ""), `${o.toString().padStart(4, "0")}-${i.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${f}Z`;
		}
		return A(r) && 0 !== r ? (f = (.01 * l).toFixed(r).replace(".", "").slice(0, r), `${o.toString().padStart(4, "0")}-${i.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${f}Z`) : `${o.toString().padStart(4, "0")}-${i.toString().padStart(2, "0")}-${s.toString().padStart(2, "0")}T${a.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}Z`;
	}
	static clone(t, r) {
		if (A(t)) return A(r) ? (r.dayNumber = t.dayNumber, r.secondsOfDay = t.secondsOfDay, r) : new e(t.dayNumber, t.secondsOfDay, Gt.TAI);
	}
	static compare(e, t) {
		if (!A(e)) throw new T("left is required.");
		if (!A(t)) throw new T("right is required.");
		const r = e.dayNumber - t.dayNumber;
		return 0 !== r ? r : e.secondsOfDay - t.secondsOfDay;
	}
	static equals(e, t) {
		return e === t || A(e) && A(t) && e.dayNumber === t.dayNumber && e.secondsOfDay === t.secondsOfDay;
	}
	static equalsEpsilon(t, r, n) {
		return n = n ?? 0, t === r || A(t) && A(r) && Math.abs(e.secondsDifference(t, r)) <= n;
	}
	static totalDays(e) {
		if (!A(e)) throw new T("julianDate is required.");
		return e.dayNumber + e.secondsOfDay / $t.SECONDS_PER_DAY;
	}
	static secondsDifference(e, t) {
		if (!A(e)) throw new T("left is required.");
		if (!A(t)) throw new T("right is required.");
		return (e.dayNumber - t.dayNumber) * $t.SECONDS_PER_DAY + (e.secondsOfDay - t.secondsOfDay);
	}
	static daysDifference(e, t) {
		if (!A(e)) throw new T("left is required.");
		if (!A(t)) throw new T("right is required.");
		return e.dayNumber - t.dayNumber + (e.secondsOfDay - t.secondsOfDay) / $t.SECONDS_PER_DAY;
	}
	static computeTaiMinusUtc(t) {
		Qt.julianDate = t;
		const r = e.leapSeconds;
		let n = Ft(r, Qt, Yt);
		return n < 0 && (n = ~n, --n, n < 0 && (n = 0)), r[n].offset;
	}
	static addSeconds(e, t, r) {
		if (!A(e)) throw new T("julianDate is required.");
		if (!A(t)) throw new T("seconds is required.");
		if (!A(r)) throw new T("result is required.");
		return Kt(e.dayNumber, e.secondsOfDay + t, r);
	}
	static addMinutes(e, t, r) {
		if (!A(e)) throw new T("julianDate is required.");
		if (!A(t)) throw new T("minutes is required.");
		if (!A(r)) throw new T("result is required.");
		const n = e.secondsOfDay + t * $t.SECONDS_PER_MINUTE;
		return Kt(e.dayNumber, n, r);
	}
	static addHours(e, t, r) {
		if (!A(e)) throw new T("julianDate is required.");
		if (!A(t)) throw new T("hours is required.");
		if (!A(r)) throw new T("result is required.");
		const n = e.secondsOfDay + t * $t.SECONDS_PER_HOUR;
		return Kt(e.dayNumber, n, r);
	}
	static addDays(e, t, r) {
		if (!A(e)) throw new T("julianDate is required.");
		if (!A(t)) throw new T("days is required.");
		if (!A(r)) throw new T("result is required.");
		return Kt(e.dayNumber + t, e.secondsOfDay, r);
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
const fr = new lr(0, 0, Gt.TAI);
lr.leapSeconds = [
	new Wt(new lr(2441317, 43210, Gt.TAI), 10),
	new Wt(new lr(2441499, 43211, Gt.TAI), 11),
	new Wt(new lr(2441683, 43212, Gt.TAI), 12),
	new Wt(new lr(2442048, 43213, Gt.TAI), 13),
	new Wt(new lr(2442413, 43214, Gt.TAI), 14),
	new Wt(new lr(2442778, 43215, Gt.TAI), 15),
	new Wt(new lr(2443144, 43216, Gt.TAI), 16),
	new Wt(new lr(2443509, 43217, Gt.TAI), 17),
	new Wt(new lr(2443874, 43218, Gt.TAI), 18),
	new Wt(new lr(2444239, 43219, Gt.TAI), 19),
	new Wt(new lr(2444786, 43220, Gt.TAI), 20),
	new Wt(new lr(2445151, 43221, Gt.TAI), 21),
	new Wt(new lr(2445516, 43222, Gt.TAI), 22),
	new Wt(new lr(2446247, 43223, Gt.TAI), 23),
	new Wt(new lr(2447161, 43224, Gt.TAI), 24),
	new Wt(new lr(2447892, 43225, Gt.TAI), 25),
	new Wt(new lr(2448257, 43226, Gt.TAI), 26),
	new Wt(new lr(2448804, 43227, Gt.TAI), 27),
	new Wt(new lr(2449169, 43228, Gt.TAI), 28),
	new Wt(new lr(2449534, 43229, Gt.TAI), 29),
	new Wt(new lr(2450083, 43230, Gt.TAI), 30),
	new Wt(new lr(2450630, 43231, Gt.TAI), 31),
	new Wt(new lr(2451179, 43232, Gt.TAI), 32),
	new Wt(new lr(2453736, 43233, Gt.TAI), 33),
	new Wt(new lr(2454832, 43234, Gt.TAI), 34),
	new Wt(new lr(2456109, 43235, Gt.TAI), 35),
	new Wt(new lr(2457204, 43236, Gt.TAI), 36),
	new Wt(new lr(2457754, 43237, Gt.TAI), 37)
];
var hr = s((e, t) => {
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
}), pr = s((e, t) => {
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
}), dr = s((e, t) => {
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
}), mr = s((e, t) => {
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
	"object" == typeof t && t.exports ? t.exports = n(hr(), pr(), dr()) : "function" == typeof define && define.amd ? define([
		"./punycode",
		"./IPv6",
		"./SecondLevelDomains"
	], n) : r.URI = n(r.punycode, r.IPv6, r.SecondLevelDomains, r);
});
function yr(e, t) {
	if (null === e || "object" != typeof e) return e;
	t = t ?? !1;
	const r = new e.constructor();
	for (const n in e) if (e.hasOwnProperty(n)) {
		let o = e[n];
		t && (o = yr(o, t)), r[n] = o;
	}
	return r;
}
function gr(e, t, r) {
	r = r ?? !1;
	const n = {}, o = A(e), i = A(t);
	let s, a, u;
	if (o) for (s in e) e.hasOwnProperty(s) && (a = e[s], i && r && "object" == typeof a && t.hasOwnProperty(s) ? (u = t[s], n[s] = "object" == typeof u ? gr(a, u, r) : a) : n[s] = a);
	if (i) for (s in t) t.hasOwnProperty(s) && !n.hasOwnProperty(s) && (u = t[s], n[s] = u);
	return n;
}
function br() {
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
var wr = a(mr(), 1);
function Or(e, t) {
	let r;
	return "undefined" != typeof document && (r = document), Or._implementation(e, t, r);
}
Or._implementation = function(e, t, r) {
	if (!A(e)) throw new T("relative uri is required.");
	if (!A(t)) {
		if (void 0 === r) return e;
		t = r.baseURI ?? r.location.href;
	}
	const n = new wr.default(e);
	return "" !== n.scheme() ? n.toString() : n.absoluteTo(t).toString();
};
const Er = {};
function xr(e, t, r) {
	A(t) || (t = e.width), A(r) || (r = e.height);
	let n = Er[t];
	A(n) || (n = {}, Er[t] = n);
	let o = n[r];
	if (!A(o)) {
		const e = document.createElement("canvas");
		e.width = t, e.height = r, o = e.getContext("2d", { willReadFrequently: !0 }), o.globalCompositeOperation = "copy", n[r] = o;
	}
	return o.drawImage(e, 0, 0, t, r), o.getImageData(0, 0, t, r).data;
}
const _r = /^blob:/i;
function Sr(e) {
	return R.typeOf.string("uri", e), _r.test(e);
}
let vr;
const Cr = /^data:/i;
function jr(e) {
	return R.typeOf.string("uri", e), Cr.test(e);
}
const Ar = {
	UNISSUED: 0,
	ISSUED: 1,
	ACTIVE: 2,
	RECEIVED: 3,
	CANCELLED: 4,
	FAILED: 5
};
Object.freeze(Ar);
const Tr = {
	TERRAIN: 0,
	IMAGERY: 1,
	TILES3D: 2,
	OTHER: 3
};
function Rr(e) {
	const t = (e = e ?? K.EMPTY_OBJECT).throttleByServer ?? !1, r = e.throttle ?? !1;
	this.url = e.url, this.requestFunction = e.requestFunction, this.cancelFunction = e.cancelFunction, this.priorityFunction = e.priorityFunction, this.priority = e.priority ?? 0, this.throttle = r, this.throttleByServer = t, this.type = e.type ?? Tr.OTHER, this.serverKey = e.serverKey, this.state = Ar.UNISSUED, this.deferred = void 0, this.cancelled = !1;
}
function zr(e, t, r) {
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
function Ir() {
	this._listeners = /* @__PURE__ */ new Map(), this._toRemove = /* @__PURE__ */ new Map(), this._toAdd = /* @__PURE__ */ new Map(), this._invokingListeners = !1, this._listenerCount = 0;
}
function Mr(e, t, r, n) {
	t.has(r) || t.set(r, /* @__PURE__ */ new Set());
	const o = t.get(r);
	return !o.has(n) && (o.add(n), !0);
}
function qr(e, t, r, n) {
	const o = t.get(r);
	if (!o || !o.has(n)) return !1;
	if (e._invokingListeners) {
		if (!Mr(0, e._toRemove, r, n)) return !1;
	} else o.delete(n), 0 === o.size && t.delete(r);
	return !0;
}
function Pr(e) {
	R.typeOf.object("options", e), R.defined("options.comparator", e.comparator), this._comparator = e.comparator, this._array = [], this._length = 0, this._maximumLength = void 0;
}
function Nr(e, t, r) {
	const n = e[t];
	e[t] = e[r], e[r] = n;
}
Object.freeze(Tr), Rr.prototype.cancel = function() {
	this.cancelled = !0;
}, Rr.prototype.clone = function(e) {
	return A(e) ? (e.url = this.url, e.requestFunction = this.requestFunction, e.cancelFunction = this.cancelFunction, e.priorityFunction = this.priorityFunction, e.priority = this.priority, e.throttle = this.throttle, e.throttleByServer = this.throttleByServer, e.type = this.type, e.serverKey = this.serverKey, e.state = Ar.UNISSUED, e.deferred = void 0, e.cancelled = !1, e) : new Rr(this);
}, zr.prototype.toString = function() {
	let e = "Request has failed.";
	return A(this.statusCode) && (e += ` Status Code: ${this.statusCode}`), e;
}, Object.defineProperties(Ir.prototype, { numberOfListeners: { get: function() {
	return this._listenerCount;
} } }), Ir.prototype.addEventListener = function(e, t) {
	R.typeOf.func("listener", e);
	const r = this;
	return Mr(0, r._invokingListeners ? r._toAdd : r._listeners, e, t) && r._listenerCount++, function() {
		r.removeEventListener(e, t);
	};
}, Ir.prototype.removeEventListener = function(e, t) {
	R.typeOf.func("listener", e);
	const r = qr(this, this._listeners, e, t), n = qr(this, this._toAdd, e, t), o = r || n;
	return o && this._listenerCount--, o;
}, Ir.prototype.raiseEvent = function() {
	this._invokingListeners = !0;
	for (const [e, t] of this._listeners.entries()) if (A(e)) for (const r of t) e.apply(r, arguments);
	this._invokingListeners = !1;
	for (const [e, t] of this._toAdd.entries()) for (const r of t) Mr(0, this._listeners, e, r);
	this._toAdd.clear();
	for (const [e, t] of this._toRemove.entries()) for (const r of t) qr(this, this._listeners, e, r);
	this._toRemove.clear();
}, Object.defineProperties(Pr.prototype, {
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
			R.typeOf.number.greaterThanOrEquals("maximumLength", e, 0);
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
}), Pr.prototype.reserve = function(e) {
	e = e ?? this._length, this._array.length = e;
}, Pr.prototype.heapify = function(e) {
	e = e ?? 0;
	const t = this._length, r = this._comparator, n = this._array;
	let o = -1, i = !0;
	for (; i;) {
		const s = 2 * (e + 1), a = s - 1;
		o = a < t && r(n[a], n[e]) < 0 ? a : e, s < t && r(n[s], n[o]) < 0 && (o = s), o !== e ? (Nr(n, o, e), e = o) : i = !1;
	}
}, Pr.prototype.resort = function() {
	const e = this._length;
	for (let t = Math.ceil(e / 2); t >= 0; --t) this.heapify(t);
}, Pr.prototype.insert = function(e) {
	R.defined("element", e);
	const t = this._array, r = this._comparator, n = this._maximumLength;
	let o, i = this._length++;
	for (i < t.length ? t[i] = e : t.push(e); 0 !== i;) {
		const e = Math.floor((i - 1) / 2);
		if (!(r(t[i], t[e]) < 0)) break;
		Nr(t, i, e), i = e;
	}
	return A(n) && this._length > n && (o = t[n], this._length = n), o;
}, Pr.prototype.pop = function(e) {
	if (e = e ?? 0, 0 === this._length) return;
	R.typeOf.number.lessThan("index", e, this._length);
	const t = this._array, r = t[e];
	return Nr(t, e, --this._length), this.heapify(e), t[this._length] = void 0, r;
};
const Dr = {
	numberOfAttemptedRequests: 0,
	numberOfActiveRequests: 0,
	numberOfCancelledRequests: 0,
	numberOfCancelledActiveRequests: 0,
	numberOfFailedRequests: 0,
	numberOfActiveRequestsEver: 0,
	lastNumberOfActiveRequests: 0
};
let Fr = 20;
const Lr = new Pr({ comparator: function(e, t) {
	return e.priority - t.priority;
} });
Lr.maximumLength = Fr, Lr.reserve(Fr);
const Ur = [];
let kr = {};
const Br = "undefined" != typeof document ? new wr.default(document.location.href) : new wr.default(), Wr = new Ir();
function $r() {}
function Gr(e) {
	A(e.priorityFunction) && (e.priority = e.priorityFunction());
}
function Hr(e) {
	return e.state === Ar.UNISSUED && (e.state = Ar.ISSUED, e.deferred = br()), e.deferred.promise;
}
function Vr(e) {
	const t = Hr(e);
	return e.state = Ar.ACTIVE, Ur.push(e), ++Dr.numberOfActiveRequests, ++Dr.numberOfActiveRequestsEver, ++kr[e.serverKey], e.requestFunction().then(function(e) {
		return function(t) {
			if (e.state === Ar.CANCELLED) return;
			const r = e.deferred;
			--Dr.numberOfActiveRequests, --kr[e.serverKey], Wr.raiseEvent(), e.state = Ar.RECEIVED, e.deferred = void 0, r.resolve(t);
		};
	}(e)).catch(function(e) {
		return function(t) {
			e.state !== Ar.CANCELLED && (++Dr.numberOfFailedRequests, --Dr.numberOfActiveRequests, --kr[e.serverKey], Wr.raiseEvent(t), e.state = Ar.FAILED, e.deferred.reject(t));
		};
	}(e)), t;
}
function Yr(e) {
	const t = e.state === Ar.ACTIVE;
	if (e.state = Ar.CANCELLED, ++Dr.numberOfCancelledRequests, A(e.deferred)) {
		const t = e.deferred;
		t.promise.catch(() => {}), e.deferred = void 0, t.reject(new pe(`Request cancelled: "${e.url}"`));
	}
	t && (--Dr.numberOfActiveRequests, --kr[e.serverKey], ++Dr.numberOfCancelledActiveRequests), A(e.cancelFunction) && e.cancelFunction();
}
$r.maximumRequests = 50, $r.maximumRequestsPerServer = 18, $r.requestsByServer = {}, $r.throttleRequests = !0, $r.debugShowStatistics = !1, $r.requestCompletedEvent = Wr, Object.defineProperties($r, {
	statistics: { get: function() {
		return Dr;
	} },
	priorityHeapLength: {
		get: function() {
			return Fr;
		},
		set: function(e) {
			if (e < Fr) for (; Lr.length > e;) Yr(Lr.pop());
			Fr = e, Lr.maximumLength = e, Lr.reserve(e);
		}
	}
}), $r.serverHasOpenSlots = function(e, t) {
	t = t ?? 1;
	const r = $r.requestsByServer[e] ?? $r.maximumRequestsPerServer;
	return kr[e] + t <= r;
}, $r.heapHasOpenSlots = function(e) {
	return Lr.length + e <= Fr;
}, $r.update = function() {
	let e, t, r = 0;
	const n = Ur.length;
	for (e = 0; e < n; ++e) t = Ur[e], t.cancelled && Yr(t), t.state === Ar.ACTIVE ? r > 0 && (Ur[e - r] = t) : ++r;
	Ur.length -= r;
	const o = Lr.internalArray, i = Lr.length;
	for (e = 0; e < i; ++e) Gr(o[e]);
	Lr.resort();
	const s = Math.max($r.maximumRequests - Ur.length, 0);
	let a = 0;
	for (; a < s && Lr.length > 0;) t = Lr.pop(), t.cancelled ? Yr(t) : !t.throttleByServer || $r.serverHasOpenSlots(t.serverKey) ? (Vr(t), ++a) : Yr(t);
	$r.debugShowStatistics && (0 === Dr.numberOfActiveRequests && Dr.lastNumberOfActiveRequests > 0 && (Dr.numberOfAttemptedRequests > 0 && (console.log(`Number of attempted requests: ${Dr.numberOfAttemptedRequests}`), Dr.numberOfAttemptedRequests = 0), Dr.numberOfCancelledRequests > 0 && (console.log(`Number of cancelled requests: ${Dr.numberOfCancelledRequests}`), Dr.numberOfCancelledRequests = 0), Dr.numberOfCancelledActiveRequests > 0 && (console.log(`Number of cancelled active requests: ${Dr.numberOfCancelledActiveRequests}`), Dr.numberOfCancelledActiveRequests = 0), Dr.numberOfFailedRequests > 0 && (console.log(`Number of failed requests: ${Dr.numberOfFailedRequests}`), Dr.numberOfFailedRequests = 0)), Dr.lastNumberOfActiveRequests = Dr.numberOfActiveRequests);
}, $r.getServerKey = function(e) {
	R.typeOf.string("url", e);
	let t = new wr.default(e);
	"" === t.scheme() && (t = t.absoluteTo(Br), t.normalize());
	let r = t.authority();
	return /:/.test(r) || (r = `${r}:${"https" === t.scheme() ? "443" : "80"}`), A(kr[r]) || (kr[r] = 0), r;
}, $r.request = function(e) {
	if (R.typeOf.object("request", e), R.typeOf.string("request.url", e.url), R.typeOf.func("request.requestFunction", e.requestFunction), jr(e.url) || Sr(e.url)) return Wr.raiseEvent(), e.state = Ar.RECEIVED, e.requestFunction();
	if (++Dr.numberOfAttemptedRequests, A(e.serverKey) || (e.serverKey = $r.getServerKey(e.url)), $r.throttleRequests && e.throttleByServer && !$r.serverHasOpenSlots(e.serverKey)) return;
	if (!$r.throttleRequests || !e.throttle) return Vr(e);
	if (Ur.length >= $r.maximumRequests) return;
	Gr(e);
	const t = Lr.insert(e);
	if (A(t)) {
		if (t === e) return;
		Yr(t);
	}
	return Hr(e);
}, $r.clearForSpecs = function() {
	for (; Lr.length > 0;) Yr(Lr.pop());
	const e = Ur.length;
	for (let t = 0; t < e; ++t) Yr(Ur[t]);
	Ur.length = 0, kr = {}, Dr.numberOfAttemptedRequests = 0, Dr.numberOfActiveRequests = 0, Dr.numberOfCancelledRequests = 0, Dr.numberOfCancelledActiveRequests = 0, Dr.numberOfFailedRequests = 0, Dr.numberOfActiveRequestsEver = 0, Dr.lastNumberOfActiveRequests = 0;
}, $r.numberOfActiveRequestsByServer = function(e) {
	return kr[e];
}, $r.requestHeap = Lr;
const Qr = {};
let Zr = {};
Qr.add = function(e, t) {
	if (!A(e)) throw new T("host is required.");
	if (!A(t) || t <= 0) throw new T("port is required to be greater than 0.");
	const r = `${e.toLowerCase()}:${t}`;
	A(Zr[r]) || (Zr[r] = !0);
}, Qr.remove = function(e, t) {
	if (!A(e)) throw new T("host is required.");
	if (!A(t) || t <= 0) throw new T("port is required to be greater than 0.");
	const r = `${e.toLowerCase()}:${t}`;
	A(Zr[r]) && delete Zr[r];
}, Qr.contains = function(e) {
	if (!A(e)) throw new T("url is required.");
	const t = function(e) {
		const t = new wr.default(e);
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
	return !(!A(t) || !A(Zr[t]));
}, Qr.clear = function() {
	Zr = {};
};
const Xr = function() {
	try {
		const e = new XMLHttpRequest();
		return e.open("GET", "#", !0), e.responseType = "blob", "blob" === e.responseType;
	} catch (e) {
		return !1;
	}
}();
function Kr(e) {
	"string" == typeof (e = e ?? K.EMPTY_OBJECT) && (e = { url: e }), R.typeOf.string("options.url", e.url), this._url = void 0, this._templateValues = Jr(e.templateValues, {}), this._queryParameters = Jr(e.queryParameters, {}), this.headers = Jr(e.headers, {}), this.request = e.request ?? new Rr(), this.proxy = e.proxy, this.retryCallback = e.retryCallback, this.retryAttempts = e.retryAttempts ?? 0, this._retryCount = 0, e.parseUrl ?? 1 ? this.parseUrl(e.url, !0, !0) : this._url = e.url, this._credits = e.credits;
}
function Jr(e, t) {
	return A(e) ? yr(e) : t;
}
let en;
function tn(e, t, r) {
	if (!r) return gr(e, t);
	const n = yr(e, !0);
	for (const o in t) if (t.hasOwnProperty(o)) {
		let e = n[o];
		const r = t[o];
		A(e) ? (Array.isArray(e) || (e = n[o] = [e]), n[o] = e.concat(r)) : n[o] = Array.isArray(r) ? r.slice() : r;
	}
	return n;
}
function rn(e, t, r) {
	const n = {};
	n[t] = r, e.setQueryParameters(n);
	const o = e.request, i = e.url;
	o.url = i, o.requestFunction = function() {
		const e = br();
		return window[r] = function(t) {
			e.resolve(t);
			try {
				delete window[r];
			} catch (e) {
				window[r] = void 0;
			}
		}, Kr._Implementations.loadAndExecuteScript(i, r, e), e.promise;
	};
	const s = $r.request(o);
	if (A(s)) return s.catch(function(n) {
		return o.state !== Ar.FAILED ? Promise.reject(n) : e.retryOnError(n).then(function(i) {
			return i ? (o.state = Ar.UNISSUED, o.deferred = void 0, rn(e, t, r)) : Promise.reject(n);
		});
	});
}
function nn(e) {
	if (e.state === Ar.ISSUED || e.state === Ar.ACTIVE) throw new pe("The Resource is already being fetched.");
	e.state = Ar.UNISSUED, e.deferred = void 0;
}
Kr.createIfNeeded = function(e) {
	return e instanceof Kr ? e.getDerivedResource({ request: e.request }) : "string" != typeof e ? e : new Kr({ url: e });
}, Kr.supportsImageBitmapOptions = function() {
	return A(en) ? en : "function" != typeof createImageBitmap ? (en = Promise.resolve(!1), en) : (en = Kr.fetchBlob({ url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABGdBTUEAAE4g3rEiDgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAADElEQVQI12Ng6GAAAAEUAIngE3ZiAAAAAElFTkSuQmCC" }).then(function(e) {
		return Promise.all([createImageBitmap(e, {
			imageOrientation: "flipY",
			premultiplyAlpha: "none",
			colorSpaceConversion: "none"
		}), createImageBitmap(e)]);
	}).then(function(e) {
		const t = xr(e[0]), r = xr(e[1]);
		return t[1] !== r[1];
	}).catch(function() {
		return !1;
	}), en);
}, Object.defineProperties(Kr, { isBlobSupported: { get: function() {
	return Xr;
} } }), Object.defineProperties(Kr.prototype, {
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
			if (!A(e)) throw new T("uri is required.");
			const t = new wr.default(e);
			t.normalize();
			let r = t.path(), n = r.lastIndexOf("/");
			return -1 !== n && (r = r.substr(n + 1)), n = r.lastIndexOf("."), r = -1 === n ? "" : r.substr(n + 1), r;
		}(this._url);
	} },
	isDataUri: { get: function() {
		return jr(this._url);
	} },
	isBlobUri: { get: function() {
		return Sr(this._url);
	} },
	isCrossOriginUrl: { get: function() {
		return function(e) {
			A(vr) || (vr = document.createElement("a")), vr.href = window.location.href;
			const t = vr.host, r = vr.protocol;
			return vr.href = e, vr.href = vr.href, r !== vr.protocol || t !== vr.host;
		}(this._url);
	} },
	hasHeaders: { get: function() {
		return Object.keys(this.headers).length > 0;
	} },
	credits: { get: function() {
		return this._credits;
	} }
}), Kr.prototype.toString = function() {
	return this.getUrlComponent(!0, !0);
}, Kr.prototype.parseUrl = function(e, t, r, n) {
	let o = new wr.default(e);
	const i = 0 === (s = o.query()).length ? {} : -1 === s.indexOf("=") ? { [s]: void 0 } : function(e) {
		if (!A(e)) throw new T("queryString is required.");
		const t = {};
		if ("" === e) return t;
		const r = e.replace(/\+/g, "%20").split(/[&;]/);
		for (let n = 0, o = r.length; n < o; ++n) {
			const e = r[n].split("="), o = decodeURIComponent(e[0]);
			let i = e[1];
			i = A(i) ? decodeURIComponent(i) : "";
			const s = t[o];
			"string" == typeof s ? t[o] = [s, i] : Array.isArray(s) ? s.push(i) : t[o] = i;
		}
		return t;
	}(s);
	var s;
	this._queryParameters = t ? tn(i, this.queryParameters, r) : i, o.search(""), o.fragment(""), A(n) && "" === o.scheme() && (o = o.absoluteTo(Or(n))), this._url = o.toString();
}, Kr.prototype.getUrlComponent = function(e, t) {
	if (this.isDataUri) return this._url;
	let r = this._url;
	e && (r = `${r}${function(e) {
		const t = Object.keys(e);
		return 0 === t.length ? "" : 1 !== t.length || A(e[t[0]]) ? `?${function(e) {
			if (!A(e)) throw new T("obj is required.");
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
		return A(r) ? encodeURIComponent(r) : e;
	})), t && A(this.proxy) && (r = this.proxy.getURL(r)), r;
}, Kr.prototype.setQueryParameters = function(e, t) {
	this._queryParameters = t ? tn(this._queryParameters, e, !1) : tn(e, this._queryParameters, !1);
}, Kr.prototype.appendQueryParameters = function(e) {
	this._queryParameters = tn(e, this._queryParameters, !0);
}, Kr.prototype.setTemplateValues = function(e, t) {
	this._templateValues = t ? gr(this._templateValues, e) : gr(e, this._templateValues);
}, Kr.prototype.getDerivedResource = function(e) {
	const t = this.clone();
	if (t._retryCount = 0, A(e.url)) {
		const r = e.preserveQueryParameters ?? !1;
		t.parseUrl(e.url, !0, r, this._url);
	}
	return A(e.queryParameters) && (t._queryParameters = gr(e.queryParameters, t.queryParameters)), A(e.templateValues) && (t._templateValues = gr(e.templateValues, t.templateValues)), A(e.headers) && (t.headers = gr(e.headers, t.headers)), A(e.proxy) && (t.proxy = e.proxy), A(e.request) && (t.request = e.request), A(e.retryCallback) && (t.retryCallback = e.retryCallback), A(e.retryAttempts) && (t.retryAttempts = e.retryAttempts), t;
}, Kr.prototype.retryOnError = function(e) {
	const t = this.retryCallback;
	if ("function" != typeof t || this._retryCount >= this.retryAttempts) return Promise.resolve(!1);
	const r = this;
	return Promise.resolve(t(this, e)).then(function(e) {
		return ++r._retryCount, e;
	});
}, Kr.prototype.clone = function(e) {
	return A(e) ? (e._url = this._url, e._queryParameters = yr(this._queryParameters), e._templateValues = yr(this._templateValues), e.headers = yr(this.headers), e.proxy = this.proxy, e.retryCallback = this.retryCallback, e.retryAttempts = this.retryAttempts, e._retryCount = 0, e.request = this.request.clone(), e) : new Kr({
		url: this._url,
		queryParameters: this.queryParameters,
		templateValues: this.templateValues,
		headers: this.headers,
		proxy: this.proxy,
		retryCallback: this.retryCallback,
		retryAttempts: this.retryAttempts,
		request: this.request.clone(),
		parseUrl: !1,
		credits: A(this.credits) ? this.credits.slice() : void 0
	});
}, Kr.prototype.getBaseUri = function(e) {
	return function(e, t) {
		if (!A(e)) throw new T("uri is required.");
		let r = "";
		const n = e.lastIndexOf("/");
		return -1 !== n && (r = e.substring(0, n + 1)), t ? (0 !== (e = new wr.default(e)).query().length && (r += `?${e.query()}`), 0 !== e.fragment().length && (r += `#${e.fragment()}`), r) : r;
	}(this.getUrlComponent(e), e);
}, Kr.prototype.appendForwardSlash = function() {
	var e;
	this._url = (0 !== (e = this._url).length && "/" === e[e.length - 1] || (e = `${e}/`), e);
}, Kr.prototype.fetchArrayBuffer = function() {
	return this.fetch({ responseType: "arraybuffer" });
}, Kr.fetchArrayBuffer = function(e) {
	return new Kr(e).fetchArrayBuffer();
}, Kr.prototype.fetchBlob = function() {
	return this.fetch({ responseType: "blob" });
}, Kr.fetchBlob = function(e) {
	return new Kr(e).fetchBlob();
}, Kr.prototype.fetchImage = function(e) {
	const t = (e = e ?? K.EMPTY_OBJECT).preferImageBitmap ?? !1, r = e.preferBlob ?? !1, n = e.flipY ?? !1, o = e.skipColorSpaceConversion ?? !1;
	if (nn(this.request), !Xr || this.isDataUri || this.isBlobUri || !this.hasHeaders && !r) return this._fetchImage({
		resource: this,
		flipY: n,
		skipColorSpaceConversion: o,
		preferImageBitmap: t
	});
	const i = this.fetchBlob();
	if (!A(i)) return;
	let s, a, u, c;
	return Kr.supportsImageBitmapOptions().then(function(e) {
		return s = e, a = s && t, i;
	}).then(function(e) {
		if (A(e)) return c = e, a ? Kr.createImageBitmapFromBlob(e, {
			flipY: n,
			premultiplyAlpha: !1,
			skipColorSpaceConversion: o
		}) : (u = new Kr({ url: window.URL.createObjectURL(e) }), u._fetchImage({
			flipY: n,
			skipColorSpaceConversion: o,
			preferImageBitmap: !1
		}));
	}).then(function(e) {
		if (A(e)) return e.blob = c, a || window.URL.revokeObjectURL(u.url), e;
	}).catch(function(e) {
		return A(u) && window.URL.revokeObjectURL(u.url), e.blob = c, Promise.reject(e);
	});
}, Kr.prototype._fetchImage = function(e) {
	const t = this, r = e.flipY, n = e.skipColorSpaceConversion, o = e.preferImageBitmap, i = t.request;
	i.url = t.url, i.requestFunction = function() {
		let e = !1;
		t.isDataUri || t.isBlobUri || (e = t.isCrossOriginUrl);
		const s = br();
		return Kr._Implementations.createImage(i, e, s, r, n, o), s.promise;
	};
	const s = $r.request(i);
	if (A(s)) return s.catch(function(e) {
		return i.state !== Ar.FAILED ? Promise.reject(e) : t.retryOnError(e).then(function(s) {
			return s ? (i.state = Ar.UNISSUED, i.deferred = void 0, t._fetchImage({
				flipY: r,
				skipColorSpaceConversion: n,
				preferImageBitmap: o
			})) : Promise.reject(e);
		});
	});
}, Kr.fetchImage = function(e) {
	return new Kr(e).fetchImage({
		flipY: e.flipY,
		skipColorSpaceConversion: e.skipColorSpaceConversion,
		preferBlob: e.preferBlob,
		preferImageBitmap: e.preferImageBitmap
	});
}, Kr.prototype.fetchText = function() {
	return this.fetch({ responseType: "text" });
}, Kr.fetchText = function(e) {
	return new Kr(e).fetchText();
}, Kr.prototype.fetchJson = function() {
	const e = this.fetch({
		responseType: "text",
		headers: { Accept: "application/json,*/*;q=0.01" }
	});
	if (A(e)) return e.then(function(e) {
		if (A(e)) return JSON.parse(e);
	});
}, Kr.fetchJson = function(e) {
	return new Kr(e).fetchJson();
}, Kr.prototype.fetchXML = function() {
	return this.fetch({
		responseType: "document",
		overrideMimeType: "text/xml"
	});
}, Kr.fetchXML = function(e) {
	return new Kr(e).fetchXML();
}, Kr.prototype.fetchJsonp = function(e) {
	let t;
	e = e ?? "callback", nn(this.request);
	do
		t = `loadJsonp${M.nextRandomNumber().toString().substring(2, 8)}`;
	while (A(window[t]));
	return rn(this, e, t);
}, Kr.fetchJsonp = function(e) {
	return new Kr(e).fetchJsonp(e.callbackParameterName);
}, Kr.prototype._makeRequest = function(e) {
	const t = this;
	nn(t.request);
	const r = t.request, n = t.url;
	r.url = n, r.requestFunction = function() {
		const o = e.responseType, i = gr(e.headers, t.headers), s = e.overrideMimeType, a = e.method, u = e.data, c = br(), l = Kr._Implementations.loadWithXhr(n, o, a, u, i, c, s);
		return A(l) && A(l.abort) && (r.cancelFunction = function() {
			l.abort();
		}), c.promise;
	};
	const o = $r.request(r);
	if (A(o)) return o.then(function(e) {
		return r.cancelFunction = void 0, e;
	}).catch(function(n) {
		return r.cancelFunction = void 0, r.state !== Ar.FAILED ? Promise.reject(n) : t.retryOnError(n).then(function(o) {
			return o ? (r.state = Ar.UNISSUED, r.deferred = void 0, t.fetch(e)) : Promise.reject(n);
		});
	});
};
const on = /^data:(.*?)(;base64)?,(.*)$/;
function sn(e, t) {
	const r = decodeURIComponent(t);
	return e ? atob(r) : r;
}
function an(e, t) {
	const r = sn(e, t), n = new ArrayBuffer(r.length), o = new Uint8Array(n);
	for (let i = 0; i < r.length; i++) o[i] = r.charCodeAt(i);
	return n;
}
Kr.prototype.fetch = function(e) {
	return (e = Jr(e, {})).method = "GET", this._makeRequest(e);
}, Kr.fetch = function(e) {
	return new Kr(e).fetch({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Kr.prototype.delete = function(e) {
	return (e = Jr(e, {})).method = "DELETE", this._makeRequest(e);
}, Kr.delete = function(e) {
	return new Kr(e).delete({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType,
		data: e.data
	});
}, Kr.prototype.head = function(e) {
	return (e = Jr(e, {})).method = "HEAD", this._makeRequest(e);
}, Kr.head = function(e) {
	return new Kr(e).head({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Kr.prototype.options = function(e) {
	return (e = Jr(e, {})).method = "OPTIONS", this._makeRequest(e);
}, Kr.options = function(e) {
	return new Kr(e).options({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Kr.prototype.post = function(e, t) {
	return R.defined("data", e), (t = Jr(t, {})).method = "POST", t.data = e, this._makeRequest(t);
}, Kr.post = function(e) {
	return new Kr(e).post(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Kr.prototype.put = function(e, t) {
	return R.defined("data", e), (t = Jr(t, {})).method = "PUT", t.data = e, this._makeRequest(t);
}, Kr.put = function(e) {
	return new Kr(e).put(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Kr.prototype.patch = function(e, t) {
	return R.defined("data", e), (t = Jr(t, {})).method = "PATCH", t.data = e, this._makeRequest(t);
}, Kr.patch = function(e) {
	return new Kr(e).patch(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Kr._Implementations = {}, Kr._Implementations.loadImageElement = function(e, t, r) {
	const n = new Image();
	n.onload = function() {
		0 === n.naturalWidth && 0 === n.naturalHeight && 0 === n.width && 0 === n.height && (n.width = 300, n.height = 150), r.resolve(n);
	}, n.onerror = function(e) {
		r.reject(e);
	}, t && (Qr.contains(e) ? n.crossOrigin = "use-credentials" : n.crossOrigin = ""), n.src = e;
}, Kr._Implementations.createImage = function(e, t, r, n, o, i, s) {
	const a = e.url;
	Kr.supportsImageBitmapOptions().then(function(u) {
		if (!u || !i) return void Kr._Implementations.loadImageElement(a, t, r);
		const c = br(), l = Kr._Implementations.loadWithXhr(a, "blob", "GET", void 0, s, c, void 0, void 0, void 0);
		return A(l) && A(l.abort) && (e.cancelFunction = function() {
			l.abort();
		}), c.promise.then(function(e) {
			if (A(e)) return Kr.createImageBitmapFromBlob(e, {
				flipY: n,
				premultiplyAlpha: !1,
				skipColorSpaceConversion: o
			});
			r.reject(new pe(`Successfully retrieved ${a} but it contained no content.`));
		}).then(function(e) {
			r.resolve(e);
		});
	}).catch(function(e) {
		r.reject(e);
	});
}, Kr.createImageBitmapFromBlob = function(e, t) {
	return R.defined("options", t), R.typeOf.bool("options.flipY", t.flipY), R.typeOf.bool("options.premultiplyAlpha", t.premultiplyAlpha), R.typeOf.bool("options.skipColorSpaceConversion", t.skipColorSpaceConversion), createImageBitmap(e, {
		imageOrientation: t.flipY ? "flipY" : "none",
		premultiplyAlpha: t.premultiplyAlpha ? "premultiply" : "none",
		colorSpaceConversion: t.skipColorSpaceConversion ? "none" : "default"
	});
};
const un = "undefined" == typeof XMLHttpRequest;
function cn(e) {
	e = e ?? K.EMPTY_OBJECT, this._dates = void 0, this._samples = void 0, this._dateColumn = -1, this._xPoleWanderRadiansColumn = -1, this._yPoleWanderRadiansColumn = -1, this._ut1MinusUtcSecondsColumn = -1, this._xCelestialPoleOffsetRadiansColumn = -1, this._yCelestialPoleOffsetRadiansColumn = -1, this._taiMinusUtcSecondsColumn = -1, this._columnCount = 0, this._lastIndex = -1, this._addNewLeapSeconds = e.addNewLeapSeconds ?? !0, A(e.data) ? fn(this, e.data) : fn(this, {
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
function ln(e, t) {
	return lr.compare(e.julianDate, t);
}
function fn(e, t) {
	if (!A(t.columnNames)) throw new pe("Error in loaded EOP data: The columnNames property is required.");
	if (!A(t.samples)) throw new pe("Error in loaded EOP data: The samples property is required.");
	const r = t.columnNames.indexOf("modifiedJulianDateUtc"), n = t.columnNames.indexOf("xPoleWanderRadians"), o = t.columnNames.indexOf("yPoleWanderRadians"), i = t.columnNames.indexOf("ut1MinusUtcSeconds"), s = t.columnNames.indexOf("xCelestialPoleOffsetRadians"), a = t.columnNames.indexOf("yCelestialPoleOffsetRadians"), u = t.columnNames.indexOf("taiMinusUtcSeconds");
	if (r < 0 || n < 0 || o < 0 || i < 0 || s < 0 || a < 0 || u < 0) throw new pe("Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns");
	const c = e._samples = t.samples, l = e._dates = [];
	let f;
	e._dateColumn = r, e._xPoleWanderRadiansColumn = n, e._yPoleWanderRadiansColumn = o, e._ut1MinusUtcSecondsColumn = i, e._xCelestialPoleOffsetRadiansColumn = s, e._yCelestialPoleOffsetRadiansColumn = a, e._taiMinusUtcSecondsColumn = u, e._columnCount = t.columnNames.length, e._lastIndex = void 0;
	const h = e._addNewLeapSeconds;
	for (let p = 0, d = c.length; p < d; p += e._columnCount) {
		const e = c[p + r], t = c[p + u], n = new lr(e + $t.MODIFIED_JULIAN_DATE_DIFFERENCE, t, Gt.TAI);
		if (l.push(n), h) {
			if (t !== f && A(f)) {
				const e = lr.leapSeconds, r = Ft(e, n, ln);
				if (r < 0) {
					const o = new Wt(n, t);
					e.splice(~r, 0, o);
				}
			}
			f = t;
		}
	}
}
function hn(e, t, r, n, o) {
	const i = r * n;
	o.xPoleWander = t[i + e._xPoleWanderRadiansColumn], o.yPoleWander = t[i + e._yPoleWanderRadiansColumn], o.xPoleOffset = t[i + e._xCelestialPoleOffsetRadiansColumn], o.yPoleOffset = t[i + e._yCelestialPoleOffsetRadiansColumn], o.ut1MinusUtc = t[i + e._ut1MinusUtcSecondsColumn];
}
function pn(e, t, r) {
	return t + e * (r - t);
}
function dn(e, t, r, n, o, i, s) {
	const a = e._columnCount;
	if (i > t.length - 1) return s.xPoleWander = 0, s.yPoleWander = 0, s.xPoleOffset = 0, s.yPoleOffset = 0, s.ut1MinusUtc = 0, s;
	const u = t[o], c = t[i];
	if (u.equals(c) || n.equals(u)) return hn(e, r, o, a, s), s;
	if (n.equals(c)) return hn(e, r, i, a, s), s;
	const l = lr.secondsDifference(n, u) / lr.secondsDifference(c, u), f = o * a, h = i * a;
	let p = r[f + e._ut1MinusUtcSecondsColumn], d = r[h + e._ut1MinusUtcSecondsColumn];
	const m = d - p;
	if (m > .5 || m < -.5) {
		const t = r[f + e._taiMinusUtcSecondsColumn], o = r[h + e._taiMinusUtcSecondsColumn];
		t !== o && (c.equals(n) ? p = d : d -= o - t);
	}
	return s.xPoleWander = pn(l, r[f + e._xPoleWanderRadiansColumn], r[h + e._xPoleWanderRadiansColumn]), s.yPoleWander = pn(l, r[f + e._yPoleWanderRadiansColumn], r[h + e._yPoleWanderRadiansColumn]), s.xPoleOffset = pn(l, r[f + e._xCelestialPoleOffsetRadiansColumn], r[h + e._xCelestialPoleOffsetRadiansColumn]), s.yPoleOffset = pn(l, r[f + e._yCelestialPoleOffsetRadiansColumn], r[h + e._yCelestialPoleOffsetRadiansColumn]), s.ut1MinusUtc = pn(l, p, d), s;
}
function mn(e, t, r) {
	this.heading = e ?? 0, this.pitch = t ?? 0, this.roll = r ?? 0;
}
Kr._Implementations.loadWithXhr = function(e, t, r, n, o, i, s) {
	const a = on.exec(e);
	if (null !== a) return void i.resolve(function(e, t) {
		t = t ?? "";
		const r = e[1], n = !!e[2], o = e[3];
		let i, s;
		switch (t) {
			case "":
			case "text": return sn(n, o);
			case "arraybuffer": return an(n, o);
			case "blob": return i = an(n, o), new Blob([i], { type: r });
			case "document": return s = new DOMParser(), s.parseFromString(sn(n, o), r);
			case "json": return JSON.parse(sn(n, o));
			default: throw new T(`Unhandled responseType: ${t}`);
		}
	}(a, t));
	if (un) return void function(e, t, r, n, o, i) {
		fetch(e, {
			method: r,
			headers: o
		}).then(async (e) => {
			if (!e.ok) {
				const t = {};
				e.headers.forEach((e, r) => {
					t[r] = e;
				}), i.reject(new zr(e.status, e, t));
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
			i.reject(new zr());
		});
	}(e, t, r, 0, o, i);
	const u = new XMLHttpRequest();
	if (Qr.contains(e) && (u.withCredentials = !0), u.open(r, e, !0), A(s) && A(u.overrideMimeType) && u.overrideMimeType(s), A(o)) for (const l in o) o.hasOwnProperty(l) && u.setRequestHeader(l, o[l]);
	A(t) && (u.responseType = t);
	let c = !1;
	return "string" == typeof e && (c = 0 === e.indexOf("file://") || "undefined" != typeof window && "file://" === window.location.origin), u.onload = function() {
		if ((u.status < 200 || u.status >= 300) && (!c || 0 !== u.status)) return void i.reject(new zr(u.status, u.response, u.getAllResponseHeaders()));
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
		else if (!A(e) || A(t) && n !== t) if ("json" === t && "string" == typeof e) try {
			i.resolve(JSON.parse(e));
		} catch (e) {
			i.reject(e);
		}
		else ("" === n || "document" === n) && A(u.responseXML) && u.responseXML.hasChildNodes() ? i.resolve(u.responseXML) : "" !== n && "text" !== n || !A(u.responseText) ? i.reject(new pe("Invalid XMLHttpRequest response type.")) : i.resolve(u.responseText);
		else i.resolve(e);
	}, u.onerror = function(e) {
		i.reject(new zr());
	}, u.send(n), u;
}, Kr._Implementations.loadAndExecuteScript = function(e, t, r) {
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
}, Kr._DefaultImplementations = {}, Kr._DefaultImplementations.createImage = Kr._Implementations.createImage, Kr._DefaultImplementations.loadWithXhr = Kr._Implementations.loadWithXhr, Kr._DefaultImplementations.loadAndExecuteScript = Kr._Implementations.loadAndExecuteScript, Kr.DEFAULT = Object.freeze(new Kr({ url: "undefined" == typeof document ? "" : document.location.href.split("?")[0] })), cn.fromUrl = async function(e, t) {
	R.defined("url", e), t = t ?? K.EMPTY_OBJECT;
	const r = Kr.createIfNeeded(e);
	let n;
	try {
		n = await r.fetchJson();
	} catch (e) {
		throw new pe(`An error occurred while retrieving the EOP data from the URL ${r.url}.`);
	}
	return new cn({
		addNewLeapSeconds: t.addNewLeapSeconds,
		data: n
	});
}, cn.NONE = Object.freeze({ compute: function(e, t) {
	return A(t) ? (t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0) : t = new Lt(0, 0, 0, 0, 0), t;
} }), cn.prototype.compute = function(e, t) {
	if (!A(this._samples)) return;
	if (A(t) || (t = new Lt(0, 0, 0, 0, 0)), 0 === this._samples.length) return t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0, t;
	const r = this._dates, n = this._lastIndex;
	let o = 0, i = 0;
	if (A(n)) {
		const s = r[n], a = r[n + 1], u = lr.lessThanOrEquals(s, e), c = !A(a), l = c || lr.greaterThanOrEquals(a, e);
		if (u && l) return o = n, !c && a.equals(e) && ++o, i = o + 1, dn(this, r, this._samples, e, o, i, t), t;
	}
	let s = Ft(r, e, lr.compare, this._dateColumn);
	return s >= 0 ? (s < r.length - 1 && r[s + 1].equals(e) && ++s, o = s, i = s) : (i = ~s, o = i - 1, o < 0 && (o = 0)), this._lastIndex = o, dn(this, r, this._samples, e, o, i, t), t;
}, mn.fromQuaternion = function(e, t) {
	if (!A(e)) throw new T("quaternion is required");
	A(t) || (t = new mn());
	const r = 2 * (e.w * e.y - e.z * e.x), n = 1 - 2 * (e.x * e.x + e.y * e.y), o = 2 * (e.w * e.x + e.y * e.z), i = 1 - 2 * (e.y * e.y + e.z * e.z), s = 2 * (e.w * e.z + e.x * e.y);
	return t.heading = -Math.atan2(s, i), t.roll = Math.atan2(o, n), t.pitch = -M.asinClamped(r), t;
}, mn.fromDegrees = function(e, t, r, n) {
	if (!A(e)) throw new T("heading is required");
	if (!A(t)) throw new T("pitch is required");
	if (!A(r)) throw new T("roll is required");
	return A(n) || (n = new mn()), n.heading = e * M.RADIANS_PER_DEGREE, n.pitch = t * M.RADIANS_PER_DEGREE, n.roll = r * M.RADIANS_PER_DEGREE, n;
}, mn.clone = function(e, t) {
	if (A(e)) return A(t) ? (t.heading = e.heading, t.pitch = e.pitch, t.roll = e.roll, t) : new mn(e.heading, e.pitch, e.roll);
}, mn.equals = function(e, t) {
	return e === t || A(e) && A(t) && e.heading === t.heading && e.pitch === t.pitch && e.roll === t.roll;
}, mn.equalsEpsilon = function(e, t, r, n) {
	return e === t || A(e) && A(t) && M.equalsEpsilon(e.heading, t.heading, r, n) && M.equalsEpsilon(e.pitch, t.pitch, r, n) && M.equalsEpsilon(e.roll, t.roll, r, n);
}, mn.prototype.clone = function(e) {
	return mn.clone(this, e);
}, mn.prototype.equals = function(e) {
	return mn.equals(this, e);
}, mn.prototype.equalsEpsilon = function(e, t, r) {
	return mn.equalsEpsilon(this, e, t, r);
}, mn.prototype.toString = function() {
	return `(${this.heading}, ${this.pitch}, ${this.roll})`;
};
const yn = /((?:.*\/)|^)Cesium\.js(?:\?|\#|$)/;
let gn, bn, wn;
function On(e) {
	return "undefined" == typeof document ? e : (A(gn) || (gn = document.createElement("a")), gn.href = e, gn.href);
}
function En() {
	if (A(bn)) return bn;
	let e;
	if (e = "undefined" != typeof CESIUM_BASE_URL ? CESIUM_BASE_URL : A(import.meta?.url) ? Or(".", import.meta.url) : "object" == typeof define && A(define.amd) && !define.amd.toUrlUndefined && A(u.toUrl) ? Or("..", Sn("Core/buildModuleUrl.js")) : function() {
		const e = document.getElementsByTagName("script");
		for (let t = 0, r = e.length; t < r; ++t) {
			const r = e[t].getAttribute("src"), n = yn.exec(r);
			if (null !== n) return n[1];
		}
	}(), !A(e)) throw new T("Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.");
	return bn = new Kr({ url: On(e) }), bn.appendForwardSlash(), bn;
}
function xn(e) {
	return On(u.toUrl(`../${e}`));
}
function _n(e) {
	return En().getDerivedResource({ url: e }).url;
}
function Sn(e) {
	return A(wn) || (wn = "object" == typeof define && A(define.amd) && !define.amd.toUrlUndefined && A(u.toUrl) ? xn : _n), wn(e);
}
function vn(e, t, r) {
	this.x = e, this.y = t, this.s = r;
}
function Cn(e) {
	e = e ?? K.EMPTY_OBJECT, this._xysFileUrlTemplate = Kr.createIfNeeded(e.xysFileUrlTemplate), this._interpolationOrder = e.interpolationOrder ?? 9, this._sampleZeroJulianEphemerisDate = e.sampleZeroJulianEphemerisDate ?? 2442396.5, this._sampleZeroDateTT = new lr(this._sampleZeroJulianEphemerisDate, 0, Gt.TAI), this._stepSizeDays = e.stepSizeDays ?? 1, this._samplesPerXysFile = e.samplesPerXysFile ?? 1e3, this._totalSamples = e.totalSamples ?? 27426, this._samples = new Array(3 * this._totalSamples), this._chunkDownloadsInProgress = [];
	const t = this._interpolationOrder, r = this._denominators = new Array(t + 1), n = this._xTable = new Array(t + 1), o = Math.pow(this._stepSizeDays, t);
	for (let i = 0; i <= t; ++i) {
		r[i] = o, n[i] = i * this._stepSizeDays;
		for (let e = 0; e <= t; ++e) e !== i && (r[i] *= i - e);
		r[i] = 1 / r[i];
	}
	this._work = new Array(t + 1), this._coef = new Array(t + 1);
}
Sn._cesiumScriptRegex = yn, Sn._buildModuleUrlFromBaseUrl = _n, Sn._clearBaseResource = function() {
	bn = void 0;
}, Sn.setBaseUrl = function(e) {
	bn = Kr.DEFAULT.getDerivedResource({ url: e });
}, Sn.getCesiumBaseUrl = En;
const jn = new lr(0, 0, Gt.TAI);
function An(e, t, r) {
	const n = jn;
	return n.dayNumber = t, n.secondsOfDay = r, lr.daysDifference(n, e._sampleZeroDateTT);
}
function Tn(e, t) {
	if (A(e._chunkDownloadsInProgress[t])) return e._chunkDownloadsInProgress[t];
	let r;
	const n = e._xysFileUrlTemplate;
	r = A(n) ? n.getDerivedResource({ templateValues: { 0: t } }) : new Kr({ url: Sn(`Assets/IAU2006_XYS/IAU2006_XYS_${t}.json`) });
	const o = async function(e, t, r) {
		try {
			const n = await e.fetchJson();
			r._updateChunkData(t, n);
		} catch (e) {}
	}(r, t, e);
	return e._chunkDownloadsInProgress[t] = o, o;
}
function Rn(e, t, r, n) {
	this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0, this.w = n ?? 0;
}
Cn.prototype.preload = function(e, t, r, n) {
	const o = An(this, e, t), i = An(this, r, n);
	let s = o / this._stepSizeDays - this._interpolationOrder / 2 | 0;
	s < 0 && (s = 0);
	let a = i / this._stepSizeDays - this._interpolationOrder / 2 | 0 + this._interpolationOrder;
	a >= this._totalSamples && (a = this._totalSamples - 1);
	const u = s / this._samplesPerXysFile | 0, c = a / this._samplesPerXysFile | 0, l = [];
	for (let f = u; f <= c; ++f) l.push(Tn(this, f));
	return Promise.all(l);
}, Cn.prototype.computeXysRadians = function(e, t, r) {
	const n = An(this, e, t);
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
	if (A(c[3 * s]) || (Tn(this, s / this._samplesPerXysFile | 0), u = !0), A(c[3 * a]) || (Tn(this, a / this._samplesPerXysFile | 0), u = !0), u) return;
	A(r) ? (r.x = 0, r.y = 0, r.s = 0) : r = new vn(0, 0, 0);
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
}, Cn.prototype._updateChunkData = function(e, { samples: t }) {
	this._chunkDownloadsInProgress[e] = void 0;
	const r = e * this._samplesPerXysFile * 3;
	for (let n = 0; n < t.length; ++n) this._samples[r + n] = t[n];
};
let zn = new N();
Rn.fromAxisAngle = function(e, t, r) {
	R.typeOf.object("axis", e), R.typeOf.number("angle", t);
	const n = t / 2, o = Math.sin(n);
	zn = N.normalize(e, zn);
	const i = zn.x * o, s = zn.y * o, a = zn.z * o, u = Math.cos(n);
	return A(r) ? (r.x = i, r.y = s, r.z = a, r.w = u, r) : new Rn(i, s, a, u);
};
const In = [
	1,
	2,
	0
], Mn = new Array(3);
Rn.fromRotationMatrix = function(e, t) {
	let r, n, o, i, s;
	R.typeOf.object("matrix", e);
	const a = e[J.COLUMN0ROW0], u = e[J.COLUMN1ROW1], c = e[J.COLUMN2ROW2], l = a + u + c;
	if (l > 0) r = Math.sqrt(l + 1), s = .5 * r, r = .5 / r, n = (e[J.COLUMN1ROW2] - e[J.COLUMN2ROW1]) * r, o = (e[J.COLUMN2ROW0] - e[J.COLUMN0ROW2]) * r, i = (e[J.COLUMN0ROW1] - e[J.COLUMN1ROW0]) * r;
	else {
		const t = In;
		let l = 0;
		u > a && (l = 1), c > a && c > u && (l = 2);
		const f = t[l], h = t[f];
		r = Math.sqrt(e[J.getElementIndex(l, l)] - e[J.getElementIndex(f, f)] - e[J.getElementIndex(h, h)] + 1);
		const p = Mn;
		p[l] = .5 * r, r = .5 / r, s = (e[J.getElementIndex(h, f)] - e[J.getElementIndex(f, h)]) * r, p[f] = (e[J.getElementIndex(f, l)] + e[J.getElementIndex(l, f)]) * r, p[h] = (e[J.getElementIndex(h, l)] + e[J.getElementIndex(l, h)]) * r, n = -p[0], o = -p[1], i = -p[2];
	}
	return A(t) ? (t.x = n, t.y = o, t.z = i, t.w = s, t) : new Rn(n, o, i, s);
};
const qn = new Rn();
let Pn = new Rn(), Nn = new Rn(), Dn = new Rn();
Rn.fromHeadingPitchRoll = function(e, t) {
	return R.typeOf.object("headingPitchRoll", e), Dn = Rn.fromAxisAngle(N.UNIT_X, e.roll, qn), Nn = Rn.fromAxisAngle(N.UNIT_Y, -e.pitch, t), t = Rn.multiply(Nn, Dn, Nn), Pn = Rn.fromAxisAngle(N.UNIT_Z, -e.heading, qn), Rn.multiply(Pn, t, t);
};
const Fn = new N(), Ln = new N(), Un = new Rn(), kn = new Rn(), Bn = new Rn();
Rn.packedLength = 4, Rn.pack = function(e, t, r) {
	return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.z, t[r] = e.w, t;
}, Rn.unpack = function(e, t, r) {
	return R.defined("array", e), t = t ?? 0, A(r) || (r = new Rn()), r.x = e[t], r.y = e[t + 1], r.z = e[t + 2], r.w = e[t + 3], r;
}, Rn.packedInterpolationLength = 3, Rn.convertPackedArrayForInterpolation = function(e, t, r, n) {
	Rn.unpack(e, 4 * r, Bn), Rn.conjugate(Bn, Bn);
	for (let o = 0, i = r - t + 1; o < i; o++) {
		const r = 3 * o;
		Rn.unpack(e, 4 * (t + o), Un), Rn.multiply(Un, Bn, Un), Un.w < 0 && Rn.negate(Un, Un), Rn.computeAxis(Un, Fn);
		const i = Rn.computeAngle(Un);
		A(n) || (n = []), n[r] = Fn.x * i, n[r + 1] = Fn.y * i, n[r + 2] = Fn.z * i;
	}
}, Rn.unpackInterpolationResult = function(e, t, r, n, o) {
	A(o) || (o = new Rn()), N.fromArray(e, 0, Ln);
	const i = N.magnitude(Ln);
	return Rn.unpack(t, 4 * n, kn), 0 === i ? Rn.clone(Rn.IDENTITY, Un) : Rn.fromAxisAngle(Ln, i, Un), Rn.multiply(Un, kn, o);
}, Rn.clone = function(e, t) {
	if (A(e)) return A(t) ? (t.x = e.x, t.y = e.y, t.z = e.z, t.w = e.w, t) : new Rn(e.x, e.y, e.z, e.w);
}, Rn.conjugate = function(e, t) {
	return R.typeOf.object("quaternion", e), R.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = e.w, t;
}, Rn.magnitudeSquared = function(e) {
	return R.typeOf.object("quaternion", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w;
}, Rn.magnitude = function(e) {
	return Math.sqrt(Rn.magnitudeSquared(e));
}, Rn.normalize = function(e, t) {
	R.typeOf.object("result", t);
	const r = 1 / Rn.magnitude(e), n = e.x * r, o = e.y * r, i = e.z * r, s = e.w * r;
	return t.x = n, t.y = o, t.z = i, t.w = s, t;
}, Rn.inverse = function(e, t) {
	R.typeOf.object("result", t);
	const r = Rn.magnitudeSquared(e);
	return t = Rn.conjugate(e, t), Rn.multiplyByScalar(t, 1 / r, t);
}, Rn.add = function(e, t, r) {
	return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r.w = e.w + t.w, r;
}, Rn.subtract = function(e, t, r) {
	return R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r.w = e.w - t.w, r;
}, Rn.negate = function(e, t) {
	return R.typeOf.object("quaternion", e), R.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
}, Rn.dot = function(e, t) {
	return R.typeOf.object("left", e), R.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z + e.w * t.w;
}, Rn.multiply = function(e, t, r) {
	R.typeOf.object("left", e), R.typeOf.object("right", t), R.typeOf.object("result", r);
	const n = e.x, o = e.y, i = e.z, s = e.w, a = t.x, u = t.y, c = t.z, l = t.w, f = s * a + n * l + o * c - i * u, h = s * u - n * c + o * l + i * a, p = s * c + n * u - o * a + i * l, d = s * l - n * a - o * u - i * c;
	return r.x = f, r.y = h, r.z = p, r.w = d, r;
}, Rn.multiplyByScalar = function(e, t, r) {
	return R.typeOf.object("quaternion", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r.w = e.w * t, r;
}, Rn.divideByScalar = function(e, t, r) {
	return R.typeOf.object("quaternion", e), R.typeOf.number("scalar", t), R.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r.w = e.w / t, r;
}, Rn.computeAxis = function(e, t) {
	R.typeOf.object("quaternion", e), R.typeOf.object("result", t);
	const r = e.w;
	if (Math.abs(r - 1) < M.EPSILON6 || Math.abs(r + 1) < M.EPSILON6) return t.x = 1, t.y = t.z = 0, t;
	const n = 1 / Math.sqrt(1 - r * r);
	return t.x = e.x * n, t.y = e.y * n, t.z = e.z * n, t;
}, Rn.computeAngle = function(e) {
	return R.typeOf.object("quaternion", e), Math.abs(e.w - 1) < M.EPSILON6 ? 0 : 2 * Math.acos(e.w);
};
let Wn = new Rn();
Rn.lerp = function(e, t, r, n) {
	return R.typeOf.object("start", e), R.typeOf.object("end", t), R.typeOf.number("t", r), R.typeOf.object("result", n), Wn = Rn.multiplyByScalar(t, r, Wn), n = Rn.multiplyByScalar(e, 1 - r, n), Rn.add(Wn, n, n);
};
let $n = new Rn(), Gn = new Rn(), Hn = new Rn();
Rn.slerp = function(e, t, r, n) {
	R.typeOf.object("start", e), R.typeOf.object("end", t), R.typeOf.number("t", r), R.typeOf.object("result", n);
	let o = Rn.dot(e, t), i = t;
	if (o < 0 && (o = -o, i = $n = Rn.negate(t, $n)), 1 - o < M.EPSILON6) return Rn.lerp(e, i, r, n);
	const s = Math.acos(o);
	return Gn = Rn.multiplyByScalar(e, Math.sin((1 - r) * s), Gn), Hn = Rn.multiplyByScalar(i, Math.sin(r * s), Hn), n = Rn.add(Gn, Hn, n), Rn.multiplyByScalar(n, 1 / Math.sin(s), n);
}, Rn.log = function(e, t) {
	R.typeOf.object("quaternion", e), R.typeOf.object("result", t);
	const r = M.acosClamped(e.w);
	let n = 0;
	return 0 !== r && (n = r / Math.sin(r)), N.multiplyByScalar(e, n, t);
}, Rn.exp = function(e, t) {
	R.typeOf.object("cartesian", e), R.typeOf.object("result", t);
	const r = N.magnitude(e);
	let n = 0;
	return 0 !== r && (n = Math.sin(r) / r), t.x = e.x * n, t.y = e.y * n, t.z = e.z * n, t.w = Math.cos(r), t;
};
const Vn = new N(), Yn = new N(), Qn = new Rn(), Zn = new Rn();
Rn.computeInnerQuadrangle = function(e, t, r, n) {
	R.typeOf.object("q0", e), R.typeOf.object("q1", t), R.typeOf.object("q2", r), R.typeOf.object("result", n);
	const o = Rn.conjugate(t, Qn);
	Rn.multiply(o, r, Zn);
	const i = Rn.log(Zn, Vn);
	Rn.multiply(o, e, Zn);
	const s = Rn.log(Zn, Yn);
	return N.add(i, s, i), N.multiplyByScalar(i, .25, i), N.negate(i, i), Rn.exp(i, Qn), Rn.multiply(t, Qn, n);
}, Rn.squad = function(e, t, r, n, o, i) {
	R.typeOf.object("q0", e), R.typeOf.object("q1", t), R.typeOf.object("s0", r), R.typeOf.object("s1", n), R.typeOf.number("t", o), R.typeOf.object("result", i);
	const s = Rn.slerp(e, t, o, Qn), a = Rn.slerp(r, n, o, Zn);
	return Rn.slerp(s, a, 2 * o * (1 - o), i);
};
const Xn = new Rn(), Kn = 1.9011074535173003, Jn = nt.supportsTypedArrays() ? new Float32Array(8) : [], eo = nt.supportsTypedArrays() ? new Float32Array(8) : [], to = nt.supportsTypedArrays() ? new Float32Array(8) : [], ro = nt.supportsTypedArrays() ? new Float32Array(8) : [];
for (let Us = 0; Us < 7; ++Us) {
	const e = Us + 1, t = 2 * e + 1;
	Jn[Us] = 1 / (e * t), eo[Us] = e / t;
}
Jn[7] = Kn / 136, eo[7] = 8 * Kn / 17, Rn.fastSlerp = function(e, t, r, n) {
	R.typeOf.object("start", e), R.typeOf.object("end", t), R.typeOf.number("t", r), R.typeOf.object("result", n);
	let o, i = Rn.dot(e, t);
	i >= 0 ? o = 1 : (o = -1, i = -i);
	const s = i - 1, a = 1 - r, u = r * r, c = a * a;
	for (let p = 7; p >= 0; --p) to[p] = (Jn[p] * u - eo[p]) * s, ro[p] = (Jn[p] * c - eo[p]) * s;
	const l = o * r * (1 + to[0] * (1 + to[1] * (1 + to[2] * (1 + to[3] * (1 + to[4] * (1 + to[5] * (1 + to[6] * (1 + to[7])))))))), f = a * (1 + ro[0] * (1 + ro[1] * (1 + ro[2] * (1 + ro[3] * (1 + ro[4] * (1 + ro[5] * (1 + ro[6] * (1 + ro[7])))))))), h = Rn.multiplyByScalar(e, f, Xn);
	return Rn.multiplyByScalar(t, l, n), Rn.add(h, n, n);
}, Rn.fastSquad = function(e, t, r, n, o, i) {
	R.typeOf.object("q0", e), R.typeOf.object("q1", t), R.typeOf.object("s0", r), R.typeOf.object("s1", n), R.typeOf.number("t", o), R.typeOf.object("result", i);
	const s = Rn.fastSlerp(e, t, o, Qn), a = Rn.fastSlerp(r, n, o, Zn);
	return Rn.fastSlerp(s, a, 2 * o * (1 - o), i);
}, Rn.equals = function(e, t) {
	return e === t || A(e) && A(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
}, Rn.equalsEpsilon = function(e, t, r) {
	return r = r ?? 0, e === t || A(e) && A(t) && Math.abs(e.x - t.x) <= r && Math.abs(e.y - t.y) <= r && Math.abs(e.z - t.z) <= r && Math.abs(e.w - t.w) <= r;
}, Rn.ZERO = Object.freeze(new Rn(0, 0, 0, 0)), Rn.IDENTITY = Object.freeze(new Rn(0, 0, 0, 1)), Rn.prototype.clone = function(e) {
	return Rn.clone(this, e);
}, Rn.prototype.equals = function(e) {
	return Rn.equals(this, e);
}, Rn.prototype.equalsEpsilon = function(e, t) {
	return Rn.equalsEpsilon(this, e, t);
}, Rn.prototype.toString = function() {
	return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
};
const no = {}, oo = {
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
}, io = {
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
}, so = {}, ao = {
	east: new N(),
	north: new N(),
	up: new N(),
	west: new N(),
	south: new N(),
	down: new N()
};
let uo = new N(), co = new N(), lo = new N();
no.localFrameToFixedFrameGenerator = function(e, t) {
	if (!oo.hasOwnProperty(e) || !oo[e].hasOwnProperty(t)) throw new T("firstAxis and secondAxis must be east, north, up, west, south or down.");
	const r = oo[e][t];
	let n;
	const o = e + t;
	return A(so[o]) ? n = so[o] : (n = function(n, o, i) {
		if (!A(n)) throw new T("origin is required.");
		if (isNaN(n.x) || isNaN(n.y) || isNaN(n.z)) throw new T("origin has a NaN component");
		if (A(i) || (i = new de()), N.equalsEpsilon(n, N.ZERO, M.EPSILON14)) N.unpack(io[e], 0, uo), N.unpack(io[t], 0, co), N.unpack(io[r], 0, lo);
		else if (M.equalsEpsilon(n.x, 0, M.EPSILON14) && M.equalsEpsilon(n.y, 0, M.EPSILON14)) {
			const o = M.sign(n.z);
			N.unpack(io[e], 0, uo), "east" !== e && "west" !== e && N.multiplyByScalar(uo, o, uo), N.unpack(io[t], 0, co), "east" !== t && "west" !== t && N.multiplyByScalar(co, o, co), N.unpack(io[r], 0, lo), "east" !== r && "west" !== r && N.multiplyByScalar(lo, o, lo);
		} else {
			(o = o ?? jt.default).geodeticSurfaceNormal(n, ao.up);
			const i = ao.up, s = ao.east;
			s.x = -n.y, s.y = n.x, s.z = 0, N.normalize(s, ao.east), N.cross(i, s, ao.north), N.multiplyByScalar(ao.up, -1, ao.down), N.multiplyByScalar(ao.east, -1, ao.west), N.multiplyByScalar(ao.north, -1, ao.south), uo = ao[e], co = ao[t], lo = ao[r];
		}
		return i[0] = uo.x, i[1] = uo.y, i[2] = uo.z, i[3] = 0, i[4] = co.x, i[5] = co.y, i[6] = co.z, i[7] = 0, i[8] = lo.x, i[9] = lo.y, i[10] = lo.z, i[11] = 0, i[12] = n.x, i[13] = n.y, i[14] = n.z, i[15] = 1, i;
	}, so[o] = n), n;
}, no.eastNorthUpToFixedFrame = no.localFrameToFixedFrameGenerator("east", "north"), no.northEastDownToFixedFrame = no.localFrameToFixedFrameGenerator("north", "east"), no.northUpEastToFixedFrame = no.localFrameToFixedFrameGenerator("north", "up"), no.northWestUpToFixedFrame = no.localFrameToFixedFrameGenerator("north", "west");
const fo = new Rn(), ho = new N(1, 1, 1), po = new de();
no.headingPitchRollToFixedFrame = function(e, t, r, n, o) {
	R.typeOf.object("HeadingPitchRoll", t), n = n ?? no.eastNorthUpToFixedFrame;
	const i = Rn.fromHeadingPitchRoll(t, fo), s = de.fromTranslationQuaternionRotationScale(N.ZERO, i, ho, po);
	return o = n(e, r, o), de.multiply(o, s, o);
};
const mo = new de(), yo = new J();
no.headingPitchRollQuaternion = function(e, t, r, n, o) {
	R.typeOf.object("HeadingPitchRoll", t);
	const i = no.headingPitchRollToFixedFrame(e, t, r, n, mo), s = de.getMatrix3(i, yo);
	return Rn.fromRotationMatrix(s, o);
};
const go = new N(1, 1, 1), bo = new N(), wo = new de(), Oo = new de(), Eo = new J(), xo = new Rn();
no.fixedFrameToHeadingPitchRoll = function(e, t, r, n) {
	R.defined("transform", e), t = t ?? jt.default, r = r ?? no.eastNorthUpToFixedFrame, A(n) || (n = new mn());
	const o = de.getTranslation(e, bo);
	if (N.equals(o, N.ZERO)) return n.heading = 0, n.pitch = 0, n.roll = 0, n;
	let i = de.inverseTransformation(r(o, t, wo), wo), s = de.setScale(e, go, Oo);
	s = de.setTranslation(s, N.ZERO, s), i = de.multiply(i, s, i);
	let a = Rn.fromRotationMatrix(de.getMatrix3(i, Eo), xo);
	return a = Rn.normalize(a, a), mn.fromQuaternion(a, n);
};
const _o = M.TWO_PI / 86400;
let So = new lr();
no.computeIcrfToCentralBodyFixedMatrix = function(e, t) {
	let r = no.computeIcrfToFixedMatrix(e, t);
	return A(r) || (r = no.computeTemeToPseudoFixedMatrix(e, t)), r;
}, no.computeTemeToPseudoFixedMatrix = function(e, t) {
	if (!A(e)) throw new T("date is required.");
	So = lr.addSeconds(e, -lr.computeTaiMinusUtc(e), So);
	const r = So.dayNumber, n = So.secondsOfDay;
	let o;
	const i = r - 2451545;
	o = n >= 43200 ? (i + .5) / $t.DAYS_PER_JULIAN_CENTURY : (i - .5) / $t.DAYS_PER_JULIAN_CENTURY;
	const s = (24110.54841 + o * (8640184.812866 + o * (.093104 + -62e-7 * o))) * _o % M.TWO_PI + (n + .5 * $t.SECONDS_PER_DAY) % $t.SECONDS_PER_DAY * (72921158553e-15 + 11772758384668e-32 * (r - 2451545.5)), a = Math.cos(s), u = Math.sin(s);
	return A(t) ? (t[0] = a, t[1] = -u, t[2] = 0, t[3] = u, t[4] = a, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t) : new J(a, u, 0, -u, a, 0, 0, 0, 1);
}, no.iau2006XysData = new Cn(), no.earthOrientationParameters = cn.NONE;
const vo = 32.184;
no.preloadIcrfFixed = function(e) {
	const t = e.start.dayNumber, r = e.start.secondsOfDay + vo, n = e.stop.dayNumber, o = e.stop.secondsOfDay + vo;
	return no.iau2006XysData.preload(t, r, n, o);
}, no.computeIcrfToFixedMatrix = function(e, t) {
	if (!A(e)) throw new T("date is required.");
	A(t) || (t = new J());
	const r = no.computeFixedToIcrfMatrix(e, t);
	if (A(r)) return J.transpose(r, t);
};
const Co = new mn(), jo = new J(), Ao = new lr();
no.computeMoonFixedToIcrfMatrix = function(e, t) {
	if (!A(e)) throw new T("date is required.");
	A(t) || (t = new J());
	const r = lr.addSeconds(e, 32.184, Ao), n = lr.totalDays(r) - 2451545, o = M.toRadians(12.112) - M.toRadians(.052992) * n, i = M.toRadians(24.224) - M.toRadians(.105984) * n, s = M.toRadians(227.645) + M.toRadians(13.012) * n, a = M.toRadians(261.105) + M.toRadians(13.340716) * n, u = M.toRadians(358) + M.toRadians(.9856) * n;
	return Co.pitch = M.toRadians(180) - M.toRadians(3.878) * Math.sin(o) - M.toRadians(.12) * Math.sin(i) + M.toRadians(.07) * Math.sin(s) - M.toRadians(.017) * Math.sin(a), Co.roll = M.toRadians(-23.47) + M.toRadians(1.543) * Math.cos(o) + M.toRadians(.24) * Math.cos(i) - M.toRadians(.028) * Math.cos(s) + M.toRadians(.007) * Math.cos(a), Co.heading = M.toRadians(154.375) + M.toRadians(13.17635831) * n + M.toRadians(3.558) * Math.sin(o) + M.toRadians(.121) * Math.sin(i) - M.toRadians(.064) * Math.sin(s) + M.toRadians(.016) * Math.sin(a) + M.toRadians(.025) * Math.sin(u), J.fromHeadingPitchRoll(Co, jo);
}, no.computeIcrfToMoonFixedMatrix = function(e, t) {
	if (!A(e)) throw new T("date is required.");
	A(t) || (t = new J());
	const r = no.computeMoonFixedToIcrfMatrix(e, t);
	if (A(r)) return J.transpose(r, t);
};
const To = new vn(0, 0, 0), Ro = new Lt(0, 0, 0, 0, 0, 0), zo = new J(), Io = new J();
no.computeFixedToIcrfMatrix = function(e, t) {
	if (!A(e)) throw new T("date is required.");
	A(t) || (t = new J());
	const r = no.earthOrientationParameters.compute(e, Ro);
	if (!A(r)) return;
	const n = e.dayNumber, o = e.secondsOfDay + vo, i = no.iau2006XysData.computeXysRadians(n, o, To);
	if (!A(i)) return;
	const s = i.x + r.xPoleOffset, a = i.y + r.yPoleOffset, u = 1 / (1 + Math.sqrt(1 - s * s - a * a)), c = zo;
	c[0] = 1 - u * s * s, c[3] = -u * s * a, c[6] = s, c[1] = -u * s * a, c[4] = 1 - u * a * a, c[7] = a, c[2] = -s, c[5] = -a, c[8] = 1 - u * (s * s + a * a);
	const l = J.fromRotationZ(-i.s, Io), f = J.multiply(c, l, zo), h = e.dayNumber, p = (e.secondsOfDay - lr.computeTaiMinusUtc(e) + r.ut1MinusUtc) / $t.SECONDS_PER_DAY;
	let d = .779057273264 + p + .00273781191135448 * (h - 2451545 + p);
	d = d % 1 * M.TWO_PI;
	const m = J.fromRotationZ(d, Io), y = J.multiply(f, m, zo), g = Math.cos(r.xPoleWander), b = Math.cos(r.yPoleWander), w = Math.sin(r.xPoleWander), O = Math.sin(r.yPoleWander);
	let E = n - 2451545 + o / $t.SECONDS_PER_DAY;
	E /= 36525;
	const x = -47e-6 * E * M.RADIANS_PER_DEGREE / 3600, _ = Math.cos(x), S = Math.sin(x), v = Io;
	return v[0] = g * _, v[1] = g * S, v[2] = w, v[3] = -b * S + O * w * _, v[4] = b * _ + O * w * S, v[5] = -O * g, v[6] = -O * S - b * w * _, v[7] = O * _ - b * w * S, v[8] = b * g, J.multiply(y, v, t);
};
const Mo = new $();
no.pointToWindowCoordinates = function(e, t, r, n) {
	return (n = no.pointToGLWindowCoordinates(e, t, r, n)).y = 2 * t[5] - n.y, n;
}, no.pointToGLWindowCoordinates = function(e, t, r, n) {
	if (!A(e)) throw new T("modelViewProjectionMatrix is required.");
	if (!A(t)) throw new T("viewportTransformation is required.");
	if (!A(r)) throw new T("point is required.");
	A(n) || (n = new pt());
	const o = Mo;
	return de.multiplyByVector(e, $.fromElements(r.x, r.y, r.z, 1, o), o), $.multiplyByScalar(o, 1 / o.w, o), de.multiplyByVector(t, o, o), pt.fromCartesian4(o, n);
};
const qo = new N(), Po = new N(), No = new N();
no.rotationMatrixFromPositionVelocity = function(e, t, r, n) {
	if (!A(e)) throw new T("position is required.");
	if (!A(t)) throw new T("velocity is required.");
	const o = (r ?? jt.default).geodeticSurfaceNormal(e, qo);
	let i = N.cross(t, o, Po);
	N.equalsEpsilon(i, N.ZERO, M.EPSILON6) && (i = N.clone(N.UNIT_X, i));
	const s = N.cross(i, t, No);
	return N.normalize(s, s), N.cross(t, s, i), N.negate(i, i), N.normalize(i, i), A(n) || (n = new J()), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = i.x, n[4] = i.y, n[5] = i.z, n[6] = s.x, n[7] = s.y, n[8] = s.z, n;
}, no.SWIZZLE_3D_TO_2D_MATRIX = Object.freeze(new de(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
const Do = new xt(), Fo = new N(), Lo = new N(), Uo = new J(), ko = new de(), Bo = new de();
no.basisTo2D = function(e, t, r) {
	if (!A(e)) throw new T("projection is required.");
	if (!A(t)) throw new T("matrix is required.");
	if (!A(r)) throw new T("result is required.");
	const n = de.getTranslation(t, Lo), o = e.ellipsoid;
	let i;
	if (N.equals(n, N.ZERO)) i = N.clone(N.ZERO, Fo);
	else {
		const t = o.cartesianToCartographic(n, Do);
		i = e.project(t, Fo), N.fromElements(i.z, i.x, i.y, i);
	}
	const s = no.eastNorthUpToFixedFrame(n, o, ko), a = de.inverseTransformation(s, Bo), u = de.getMatrix3(t, Uo), c = de.multiplyByMatrix3(a, u, r);
	return de.multiply(no.SWIZZLE_3D_TO_2D_MATRIX, c, r), de.setTranslation(r, i, r), r;
}, no.ellipsoidTo2DModelMatrix = function(e, t, r) {
	if (!A(e)) throw new T("projection is required.");
	if (!A(t)) throw new T("center is required.");
	if (!A(r)) throw new T("result is required.");
	const n = e.ellipsoid, o = no.eastNorthUpToFixedFrame(t, n, ko), i = de.inverseTransformation(o, Bo), s = n.cartesianToCartographic(t, Do), a = e.project(s, Fo);
	N.fromElements(a.z, a.x, a.y, a);
	const u = de.fromTranslation(a, ko);
	return de.multiply(no.SWIZZLE_3D_TO_2D_MATRIX, i, r), de.multiply(u, r, r), r;
};
var Wo = class e {
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
		return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.west, t[r++] = e.south, t[r++] = e.east, t[r] = e.north, t;
	}
	static unpack(t, r, n) {
		return R.defined("array", t), r = r ?? 0, A(n) || (n = new e()), n.west = t[r++], n.south = t[r++], n.east = t[r++], n.north = t[r], n;
	}
	static computeWidth(e) {
		R.typeOf.object("rectangle", e);
		let t = e.east;
		const r = e.west;
		return t < r && (t += M.TWO_PI), t - r;
	}
	static computeHeight(e) {
		return R.typeOf.object("rectangle", e), e.north - e.south;
	}
	static fromDegrees(t, r, n, o, i) {
		return t = M.toRadians(t ?? 0), r = M.toRadians(r ?? 0), n = M.toRadians(n ?? 0), o = M.toRadians(o ?? 0), A(i) ? (i.west = t, i.south = r, i.east = n, i.north = o, i) : new e(t, r, n, o);
	}
	static fromRadians(t, r, n, o, i) {
		return A(i) ? (i.west = t ?? 0, i.south = r ?? 0, i.east = n ?? 0, i.north = o ?? 0, i) : new e(t, r, n, o);
	}
	static fromCartographicArray(t, r) {
		R.defined("cartographics", t);
		let n = Number.MAX_VALUE, o = -Number.MAX_VALUE, i = Number.MAX_VALUE, s = -Number.MAX_VALUE, a = Number.MAX_VALUE, u = -Number.MAX_VALUE;
		for (let e = 0, c = t.length; e < c; e++) {
			const r = t[e];
			n = Math.min(n, r.longitude), o = Math.max(o, r.longitude), a = Math.min(a, r.latitude), u = Math.max(u, r.latitude);
			const c = r.longitude >= 0 ? r.longitude : r.longitude + M.TWO_PI;
			i = Math.min(i, c), s = Math.max(s, c);
		}
		return o - n > s - i && (n = i, o = s, o > M.PI && (o -= M.TWO_PI), n > M.PI && (n -= M.TWO_PI)), A(r) ? (r.west = n, r.south = a, r.east = o, r.north = u, r) : new e(n, a, o, u);
	}
	static fromCartesianArray(t, r, n) {
		R.defined("cartesians", t), r = r ?? jt.default;
		let o = Number.MAX_VALUE, i = -Number.MAX_VALUE, s = Number.MAX_VALUE, a = -Number.MAX_VALUE, u = Number.MAX_VALUE, c = -Number.MAX_VALUE;
		for (let e = 0, l = t.length; e < l; e++) {
			const n = r.cartesianToCartographic(t[e]);
			o = Math.min(o, n.longitude), i = Math.max(i, n.longitude), u = Math.min(u, n.latitude), c = Math.max(c, n.latitude);
			const l = n.longitude >= 0 ? n.longitude : n.longitude + M.TWO_PI;
			s = Math.min(s, l), a = Math.max(a, l);
		}
		return i - o > a - s && (o = s, i = a, i > M.PI && (i -= M.TWO_PI), o > M.PI && (o -= M.TWO_PI)), A(n) ? (n.west = o, n.south = u, n.east = i, n.north = c, n) : new e(o, u, i, c);
	}
	static fromBoundingSphere(t, r, n) {
		R.typeOf.object("boundingSphere", t);
		const o = t.center, i = t.radius;
		if (A(r) || (r = jt.default), A(n) || (n = new e()), N.equals(o, N.ZERO)) return e.clone(e.MAX_VALUE, n), n;
		const s = no.eastNorthUpToFixedFrame(o, r, $o), a = de.multiplyByPointAsVector(s, N.UNIT_X, Go);
		N.normalize(a, a);
		const u = de.multiplyByPointAsVector(s, N.UNIT_Y, Ho);
		N.normalize(u, u), N.multiplyByScalar(u, i, u), N.multiplyByScalar(a, i, a);
		const c = N.negate(u, Yo), l = N.negate(a, Vo), f = Qo;
		let h = f[0];
		return N.add(o, u, h), h = f[1], N.add(o, l, h), h = f[2], N.add(o, c, h), h = f[3], N.add(o, a, h), f[4] = o, e.fromCartesianArray(f, r, n);
	}
	static clone(t, r) {
		if (A(t)) return A(r) ? (r.west = t.west, r.south = t.south, r.east = t.east, r.north = t.north, r) : new e(t.west, t.south, t.east, t.north);
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || A(e) && A(t) && Math.abs(e.west - t.west) <= r && Math.abs(e.south - t.south) <= r && Math.abs(e.east - t.east) <= r && Math.abs(e.north - t.north) <= r;
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	static equals(e, t) {
		return e === t || A(e) && A(t) && e.west === t.west && e.south === t.south && e.east === t.east && e.north === t.north;
	}
	equalsEpsilon(t, r) {
		return e.equalsEpsilon(this, t, r);
	}
	static _validate(e) {
		R.typeOf.object("rectangle", e);
		const t = e.north;
		R.typeOf.number.greaterThanOrEquals("north", t, -M.PI_OVER_TWO), R.typeOf.number.lessThanOrEquals("north", t, M.PI_OVER_TWO);
		const r = e.south;
		R.typeOf.number.greaterThanOrEquals("south", r, -M.PI_OVER_TWO), R.typeOf.number.lessThanOrEquals("south", r, M.PI_OVER_TWO);
		const n = e.west;
		R.typeOf.number.greaterThanOrEquals("west", n, -Math.PI), R.typeOf.number.lessThanOrEquals("west", n, Math.PI);
		const o = e.east;
		R.typeOf.number.greaterThanOrEquals("east", o, -Math.PI), R.typeOf.number.lessThanOrEquals("east", o, Math.PI);
	}
	static southwest(e, t) {
		return R.typeOf.object("rectangle", e), A(t) ? (t.longitude = e.west, t.latitude = e.south, t.height = 0, t) : new xt(e.west, e.south);
	}
	static northwest(e, t) {
		return R.typeOf.object("rectangle", e), A(t) ? (t.longitude = e.west, t.latitude = e.north, t.height = 0, t) : new xt(e.west, e.north);
	}
	static northeast(e, t) {
		return R.typeOf.object("rectangle", e), A(t) ? (t.longitude = e.east, t.latitude = e.north, t.height = 0, t) : new xt(e.east, e.north);
	}
	static southeast(e, t) {
		return R.typeOf.object("rectangle", e), A(t) ? (t.longitude = e.east, t.latitude = e.south, t.height = 0, t) : new xt(e.east, e.south);
	}
	static center(e, t) {
		R.typeOf.object("rectangle", e);
		let r = e.east;
		const n = e.west;
		r < n && (r += M.TWO_PI);
		const o = M.negativePiToPi(.5 * (n + r)), i = .5 * (e.south + e.north);
		return A(t) ? (t.longitude = o, t.latitude = i, t.height = 0, t) : new xt(o, i);
	}
	static intersection(t, r, n) {
		R.typeOf.object("rectangle", t), R.typeOf.object("otherRectangle", r);
		let o = t.east, i = t.west, s = r.east, a = r.west;
		o < i && s > 0 ? o += M.TWO_PI : s < a && o > 0 && (s += M.TWO_PI), o < i && a < 0 ? a += M.TWO_PI : s < a && i < 0 && (i += M.TWO_PI);
		const u = M.negativePiToPi(Math.max(i, a)), c = M.negativePiToPi(Math.min(o, s));
		if ((t.west < t.east || r.west < r.east) && c <= u) return;
		const l = Math.max(t.south, r.south), f = Math.min(t.north, r.north);
		return l >= f ? void 0 : A(n) ? (n.west = u, n.south = l, n.east = c, n.north = f, n) : new e(u, l, c, f);
	}
	static simpleIntersection(t, r, n) {
		R.typeOf.object("rectangle", t), R.typeOf.object("otherRectangle", r);
		const o = Math.max(t.west, r.west), i = Math.max(t.south, r.south), s = Math.min(t.east, r.east), a = Math.min(t.north, r.north);
		if (!(i >= a || o >= s)) return A(n) ? (n.west = o, n.south = i, n.east = s, n.north = a, n) : new e(o, i, s, a);
	}
	static union(t, r, n) {
		R.typeOf.object("rectangle", t), R.typeOf.object("otherRectangle", r), A(n) || (n = new e());
		let o = t.east, i = t.west, s = r.east, a = r.west;
		o < i && s > 0 ? o += M.TWO_PI : s < a && o > 0 && (s += M.TWO_PI), o < i && a < 0 ? a += M.TWO_PI : s < a && i < 0 && (i += M.TWO_PI);
		const u = M.negativePiToPi(Math.min(i, a)), c = M.negativePiToPi(Math.max(o, s));
		return n.west = u, n.south = Math.min(t.south, r.south), n.east = c, n.north = Math.max(t.north, r.north), n;
	}
	static expand(t, r, n) {
		return R.typeOf.object("rectangle", t), R.typeOf.object("cartographic", r), A(n) || (n = new e()), n.west = Math.min(t.west, r.longitude), n.south = Math.min(t.south, r.latitude), n.east = Math.max(t.east, r.longitude), n.north = Math.max(t.north, r.latitude), n;
	}
	static contains(e, t) {
		R.typeOf.object("rectangle", e), R.typeOf.object("cartographic", t);
		let r = t.longitude;
		const n = t.latitude, o = e.west;
		let i = e.east;
		return i < o && (i += M.TWO_PI, r < 0 && (r += M.TWO_PI)), (r > o || M.equalsEpsilon(r, o, M.EPSILON14)) && (r < i || M.equalsEpsilon(r, i, M.EPSILON14)) && n >= e.south && n <= e.north;
	}
	static subsample(t, r, n, o) {
		R.typeOf.object("rectangle", t), r = r ?? jt.default, n = n ?? 0, A(o) || (o = []);
		let i = 0;
		const s = t.north, a = t.south, u = t.east, c = t.west, l = Zo;
		l.height = n, l.longitude = c, l.latitude = s, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.longitude = u, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.latitude = a, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.longitude = c, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.latitude = s < 0 ? s : a > 0 ? a : 0;
		for (let f = 1; f < 8; ++f) l.longitude = -Math.PI + f * M.PI_OVER_TWO, e.contains(t, l) && (o[i] = r.cartographicToCartesian(l, o[i]), i++);
		return 0 === l.latitude && (l.longitude = c, o[i] = r.cartographicToCartesian(l, o[i]), i++, l.longitude = u, o[i] = r.cartographicToCartesian(l, o[i]), i++), o.length = i, o;
	}
	static subsection(t, r, n, o, i, s) {
		if (R.typeOf.object("rectangle", t), R.typeOf.number.greaterThanOrEquals("westLerp", r, 0), R.typeOf.number.lessThanOrEquals("westLerp", r, 1), R.typeOf.number.greaterThanOrEquals("southLerp", n, 0), R.typeOf.number.lessThanOrEquals("southLerp", n, 1), R.typeOf.number.greaterThanOrEquals("eastLerp", o, 0), R.typeOf.number.lessThanOrEquals("eastLerp", o, 1), R.typeOf.number.greaterThanOrEquals("northLerp", i, 0), R.typeOf.number.lessThanOrEquals("northLerp", i, 1), R.typeOf.number.lessThanOrEquals("westLerp", r, o), R.typeOf.number.lessThanOrEquals("southLerp", n, i), A(s) || (s = new e()), t.west <= t.east) {
			const e = t.east - t.west;
			s.west = t.west + r * e, s.east = t.west + o * e;
		} else {
			const e = M.TWO_PI + t.east - t.west;
			s.west = M.negativePiToPi(t.west + r * e), s.east = M.negativePiToPi(t.west + o * e);
		}
		const a = t.north - t.south;
		return s.south = t.south + n * a, s.north = t.south + i * a, 1 === r && (s.west = t.east), 1 === o && (s.east = t.east), 1 === n && (s.south = t.north), 1 === i && (s.north = t.north), s;
	}
};
Wo.packedLength = 4;
const $o = new de(), Go = new N(), Ho = new N(), Vo = new N(), Yo = new N(), Qo = new Array(5);
for (let Us = 0; Us < Qo.length; ++Us) Qo[Us] = new N();
const Zo = new xt();
function Xo(e, t, r, n) {
	this.x = e ?? 0, this.y = t ?? 0, this.width = r ?? 0, this.height = n ?? 0;
}
Wo.MAX_VALUE = Object.freeze(new Wo(-Math.PI, -M.PI_OVER_TWO, Math.PI, M.PI_OVER_TWO)), Xo.packedLength = 4, Xo.pack = function(e, t, r) {
	return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.width, t[r] = e.height, t;
}, Xo.unpack = function(e, t, r) {
	return R.defined("array", e), t = t ?? 0, A(r) || (r = new Xo()), r.x = e[t++], r.y = e[t++], r.width = e[t++], r.height = e[t], r;
}, Xo.fromPoints = function(e, t) {
	if (A(t) || (t = new Xo()), !A(e) || 0 === e.length) return t.x = 0, t.y = 0, t.width = 0, t.height = 0, t;
	const r = e.length;
	let n = e[0].x, o = e[0].y, i = e[0].x, s = e[0].y;
	for (let a = 1; a < r; a++) {
		const t = e[a], r = t.x, u = t.y;
		n = Math.min(r, n), i = Math.max(r, i), o = Math.min(u, o), s = Math.max(u, s);
	}
	return t.x = n, t.y = o, t.width = i - n, t.height = s - o, t;
};
const Ko = new class {
	constructor(e) {
		this._ellipsoid = e ?? jt.default, this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
	}
	get ellipsoid() {
		return this._ellipsoid;
	}
	project(e, t) {
		const r = this._semimajorAxis, n = e.longitude * r, o = e.latitude * r, i = e.height;
		return A(t) ? (t.x = n, t.y = o, t.z = i, t) : new N(n, o, i);
	}
	unproject(e, t) {
		if (!A(e)) throw new T("cartesian is required");
		const r = this._oneOverSemimajorAxis, n = e.x * r, o = e.y * r, i = e.z;
		return A(t) ? (t.longitude = n, t.latitude = o, t.height = i, t) : new xt(n, o, i);
	}
}(), Jo = new xt(), ei = new xt();
function ti(e, t) {
	if (R.typeOf.object("normal", e), !M.equalsEpsilon(N.magnitude(e), 1, M.EPSILON6)) throw new T("normal must be normalized.");
	R.typeOf.number("distance", t), this.normal = N.clone(e), this.distance = t;
}
Xo.fromRectangle = function(e, t, r) {
	if (A(r) || (r = new Xo()), !A(e)) return r.x = 0, r.y = 0, r.width = 0, r.height = 0, r;
	Ko._ellipsoid = jt.default;
	const n = (t = t ?? Ko).project(Wo.southwest(e, Jo)), o = t.project(Wo.northeast(e, ei));
	return pt.subtract(o, n, o), r.x = n.x, r.y = n.y, r.width = o.x, r.height = o.y, r;
}, Xo.clone = function(e, t) {
	if (A(e)) return A(t) ? (t.x = e.x, t.y = e.y, t.width = e.width, t.height = e.height, t) : new Xo(e.x, e.y, e.width, e.height);
}, Xo.union = function(e, t, r) {
	R.typeOf.object("left", e), R.typeOf.object("right", t), A(r) || (r = new Xo());
	const n = Math.min(e.x, t.x), o = Math.min(e.y, t.y), i = Math.max(e.x + e.width, t.x + t.width), s = Math.max(e.y + e.height, t.y + t.height);
	return r.x = n, r.y = o, r.width = i - n, r.height = s - o, r;
}, Xo.expand = function(e, t, r) {
	R.typeOf.object("rectangle", e), R.typeOf.object("point", t), r = Xo.clone(e, r);
	const n = t.x - r.x, o = t.y - r.y;
	return n > r.width ? r.width = n : n < 0 && (r.width -= n, r.x = t.x), o > r.height ? r.height = o : o < 0 && (r.height -= o, r.y = t.y), r;
}, Xo.intersect = function(e, t) {
	R.typeOf.object("left", e), R.typeOf.object("right", t);
	const r = e.x, n = e.y, o = t.x, i = t.y;
	return r > o + t.width || r + e.width < o || n + e.height < i || n > i + t.height ? Dt.OUTSIDE : Dt.INTERSECTING;
}, Xo.equals = function(e, t) {
	return e === t || A(e) && A(t) && e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}, Xo.prototype.clone = function(e) {
	return Xo.clone(this, e);
}, Xo.prototype.intersect = function(e) {
	return Xo.intersect(this, e);
}, Xo.prototype.equals = function(e) {
	return Xo.equals(this, e);
}, ti.fromPointNormal = function(e, t, r) {
	if (R.typeOf.object("point", e), R.typeOf.object("normal", t), !M.equalsEpsilon(N.magnitude(t), 1, M.EPSILON6)) throw new T("normal must be normalized.");
	const n = -N.dot(t, e);
	return A(r) ? (N.clone(t, r.normal), r.distance = n, r) : new ti(t, n);
};
const ri = new N();
ti.fromCartesian4 = function(e, t) {
	R.typeOf.object("coefficients", e);
	const r = N.fromCartesian4(e, ri), n = e.w;
	if (!M.equalsEpsilon(N.magnitude(r), 1, M.EPSILON6)) throw new T("normal must be normalized.");
	return A(t) ? (N.clone(r, t.normal), t.distance = n, t) : new ti(r, n);
}, ti.getPointDistance = function(e, t) {
	return R.typeOf.object("plane", e), R.typeOf.object("point", t), N.dot(e.normal, t) + e.distance;
};
const ni = new N();
ti.projectPointOntoPlane = function(e, t, r) {
	R.typeOf.object("plane", e), R.typeOf.object("point", t), A(r) || (r = new N());
	const n = ti.getPointDistance(e, t), o = N.multiplyByScalar(e.normal, n, ni);
	return N.subtract(t, o, r);
};
const oi = new de(), ii = new $(), si = new N();
function ai(e) {
	this.planes = e ?? [];
}
ti.transform = function(e, t, r) {
	R.typeOf.object("plane", e), R.typeOf.object("transform", t);
	const n = e.normal, o = e.distance, i = de.inverseTranspose(t, oi);
	let s = $.fromElements(n.x, n.y, n.z, o, ii);
	s = de.multiplyByVector(i, s, s);
	const a = N.fromCartesian4(s, si);
	return s = $.divideByScalar(s, N.magnitude(a), s), ti.fromCartesian4(s, r);
}, ti.clone = function(e, t) {
	return R.typeOf.object("plane", e), A(t) ? (N.clone(e.normal, t.normal), t.distance = e.distance, t) : new ti(e.normal, e.distance);
}, ti.equals = function(e, t) {
	return R.typeOf.object("left", e), R.typeOf.object("right", t), e.distance === t.distance && N.equals(e.normal, t.normal);
}, ti.ORIGIN_XY_PLANE = Object.freeze(new ti(N.UNIT_Z, 0)), ti.ORIGIN_YZ_PLANE = Object.freeze(new ti(N.UNIT_X, 0)), ti.ORIGIN_ZX_PLANE = Object.freeze(new ti(N.UNIT_Y, 0));
const ui = [
	new N(),
	new N(),
	new N()
];
N.clone(N.UNIT_X, ui[0]), N.clone(N.UNIT_Y, ui[1]), N.clone(N.UNIT_Z, ui[2]);
const ci = new N(), li = new N(), fi = new ti(new N(1, 0, 0), 0);
function hi(e) {
	e = e ?? K.EMPTY_OBJECT, this.left = e.left, this._left = void 0, this.right = e.right, this._right = void 0, this.top = e.top, this._top = void 0, this.bottom = e.bottom, this._bottom = void 0, this.near = e.near ?? 1, this._near = this.near, this.far = e.far ?? 5e8, this._far = this.far, this._cullingVolume = new ai(), this._orthographicMatrix = new de();
}
function pi(e) {
	if (!(A(e.right) && A(e.left) && A(e.top) && A(e.bottom) && A(e.near) && A(e.far))) throw new T("right, left, top, bottom, near, or far parameters are not set.");
	if (e.top !== e._top || e.bottom !== e._bottom || e.left !== e._left || e.right !== e._right || e.near !== e._near || e.far !== e._far) {
		if (e.left > e.right) throw new T("right must be greater than left.");
		if (e.bottom > e.top) throw new T("top must be greater than bottom.");
		if (e.near <= 0 || e.near > e.far) throw new T("near must be greater than zero and less than far.");
		e._left = e.left, e._right = e.right, e._top = e.top, e._bottom = e.bottom, e._near = e.near, e._far = e.far, e._orthographicMatrix = de.computeOrthographicOffCenter(e.left, e.right, e.bottom, e.top, e.near, e.far, e._orthographicMatrix);
	}
}
ai.fromBoundingSphere = function(e, t) {
	if (!A(e)) throw new T("boundingSphere is required.");
	A(t) || (t = new ai());
	const r = ui.length, n = t.planes;
	n.length = 2 * r;
	const o = e.center, i = e.radius;
	let s = 0;
	for (let a = 0; a < r; ++a) {
		const e = ui[a];
		let t = n[s], r = n[s + 1];
		A(t) || (t = n[s] = new $()), A(r) || (r = n[s + 1] = new $()), N.multiplyByScalar(e, -i, ci), N.add(o, ci, ci), t.x = e.x, t.y = e.y, t.z = e.z, t.w = -N.dot(e, ci), N.multiplyByScalar(e, i, ci), N.add(o, ci, ci), r.x = -e.x, r.y = -e.y, r.z = -e.z, r.w = -N.dot(N.negate(e, li), ci), s += 2;
	}
	return t;
}, ai.prototype.computeVisibility = function(e) {
	if (!A(e)) throw new T("boundingVolume is required.");
	const t = this.planes;
	let r = !1;
	for (let n = 0, o = t.length; n < o; ++n) {
		const o = e.intersectPlane(ti.fromCartesian4(t[n], fi));
		if (o === Dt.OUTSIDE) return Dt.OUTSIDE;
		o === Dt.INTERSECTING && (r = !0);
	}
	return r ? Dt.INTERSECTING : Dt.INSIDE;
}, ai.prototype.computeVisibilityWithPlaneMask = function(e, t) {
	if (!A(e)) throw new T("boundingVolume is required.");
	if (!A(t)) throw new T("parentPlaneMask is required.");
	if (t === ai.MASK_OUTSIDE || t === ai.MASK_INSIDE) return t;
	let r = ai.MASK_INSIDE;
	const n = this.planes;
	for (let o = 0, i = n.length; o < i; ++o) {
		const i = o < 31 ? 1 << o : 0;
		if (o < 31 && 0 === (t & i)) continue;
		const s = e.intersectPlane(ti.fromCartesian4(n[o], fi));
		if (s === Dt.OUTSIDE) return ai.MASK_OUTSIDE;
		s === Dt.INTERSECTING && (r |= i);
	}
	return r;
}, ai.MASK_OUTSIDE = 4294967295, ai.MASK_INSIDE = 0, ai.MASK_INDETERMINATE = 2147483647, Object.defineProperties(hi.prototype, { projectionMatrix: { get: function() {
	return pi(this), this._orthographicMatrix;
} } });
const di = new N(), mi = new N(), yi = new N(), gi = new N();
function bi(e) {
	e = e ?? K.EMPTY_OBJECT, this._offCenterFrustum = new hi(), this.width = e.width, this._width = void 0, this.aspectRatio = e.aspectRatio, this._aspectRatio = void 0, this.near = e.near ?? 1, this._near = this.near, this.far = e.far ?? 5e8, this._far = this.far;
}
function wi(e) {
	if (!(A(e.width) && A(e.aspectRatio) && A(e.near) && A(e.far))) throw new T("width, aspectRatio, near, or far parameters are not set.");
	const t = e._offCenterFrustum;
	if (e.width !== e._width || e.aspectRatio !== e._aspectRatio || e.near !== e._near || e.far !== e._far) {
		if (e.aspectRatio < 0) throw new T("aspectRatio must be positive.");
		if (e.near < 0 || e.near > e.far) throw new T("near must be greater than zero and less than far.");
		e._aspectRatio = e.aspectRatio, e._width = e.width, e._near = e.near, e._far = e.far;
		const r = 1 / e.aspectRatio;
		t.right = .5 * e.width, t.left = -t.right, t.top = r * t.right, t.bottom = -t.top, t.near = e.near, t.far = e.far;
	}
}
hi.prototype.computeCullingVolume = function(e, t, r) {
	if (!A(e)) throw new T("position is required.");
	if (!A(t)) throw new T("direction is required.");
	if (!A(r)) throw new T("up is required.");
	const n = this._cullingVolume.planes, o = this.top, i = this.bottom, s = this.right, a = this.left, u = this.near, c = this.far, l = N.cross(t, r, di);
	N.normalize(l, l);
	const f = mi;
	N.multiplyByScalar(t, u, f), N.add(e, f, f);
	const h = yi;
	N.multiplyByScalar(l, a, h), N.add(f, h, h);
	let p = n[0];
	return A(p) || (p = n[0] = new $()), p.x = l.x, p.y = l.y, p.z = l.z, p.w = -N.dot(l, h), N.multiplyByScalar(l, s, h), N.add(f, h, h), p = n[1], A(p) || (p = n[1] = new $()), p.x = -l.x, p.y = -l.y, p.z = -l.z, p.w = -N.dot(N.negate(l, gi), h), N.multiplyByScalar(r, i, h), N.add(f, h, h), p = n[2], A(p) || (p = n[2] = new $()), p.x = r.x, p.y = r.y, p.z = r.z, p.w = -N.dot(r, h), N.multiplyByScalar(r, o, h), N.add(f, h, h), p = n[3], A(p) || (p = n[3] = new $()), p.x = -r.x, p.y = -r.y, p.z = -r.z, p.w = -N.dot(N.negate(r, gi), h), p = n[4], A(p) || (p = n[4] = new $()), p.x = t.x, p.y = t.y, p.z = t.z, p.w = -N.dot(t, f), N.multiplyByScalar(t, c, h), N.add(e, h, h), p = n[5], A(p) || (p = n[5] = new $()), p.x = -t.x, p.y = -t.y, p.z = -t.z, p.w = -N.dot(N.negate(t, gi), h), this._cullingVolume;
}, hi.prototype.getPixelDimensions = function(e, t, r, n, o) {
	if (pi(this), !A(e) || !A(t)) throw new T("Both drawingBufferWidth and drawingBufferHeight are required.");
	if (e <= 0) throw new T("drawingBufferWidth must be greater than zero.");
	if (t <= 0) throw new T("drawingBufferHeight must be greater than zero.");
	if (!A(r)) throw new T("distance is required.");
	if (!A(n)) throw new T("pixelRatio is required.");
	if (n <= 0) throw new T("pixelRatio must be greater than zero.");
	if (!A(o)) throw new T("A result object is required.");
	const i = n * (this.right - this.left) / e, s = n * (this.top - this.bottom) / t;
	return o.x = i, o.y = s, o;
}, hi.prototype.clone = function(e) {
	return A(e) || (e = new hi()), e.left = this.left, e.right = this.right, e.top = this.top, e.bottom = this.bottom, e.near = this.near, e.far = this.far, e._left = void 0, e._right = void 0, e._top = void 0, e._bottom = void 0, e._near = void 0, e._far = void 0, e;
}, hi.prototype.equals = function(e) {
	return A(e) && e instanceof hi && this.right === e.right && this.left === e.left && this.top === e.top && this.bottom === e.bottom && this.near === e.near && this.far === e.far;
}, hi.prototype.equalsEpsilon = function(e, t, r) {
	return e === this || A(e) && e instanceof hi && M.equalsEpsilon(this.right, e.right, t, r) && M.equalsEpsilon(this.left, e.left, t, r) && M.equalsEpsilon(this.top, e.top, t, r) && M.equalsEpsilon(this.bottom, e.bottom, t, r) && M.equalsEpsilon(this.near, e.near, t, r) && M.equalsEpsilon(this.far, e.far, t, r);
}, bi.packedLength = 4, bi.pack = function(e, t, r) {
	return R.typeOf.object("value", e), R.defined("array", t), r = r ?? 0, t[r++] = e.width, t[r++] = e.aspectRatio, t[r++] = e.near, t[r] = e.far, t;
}, bi.unpack = function(e, t, r) {
	return R.defined("array", e), t = t ?? 0, A(r) || (r = new bi()), r.width = e[t++], r.aspectRatio = e[t++], r.near = e[t++], r.far = e[t], r;
}, Object.defineProperties(bi.prototype, {
	projectionMatrix: { get: function() {
		return wi(this), this._offCenterFrustum.projectionMatrix;
	} },
	offCenterFrustum: { get: function() {
		return wi(this), this._offCenterFrustum;
	} }
}), bi.prototype.computeCullingVolume = function(e, t, r) {
	return wi(this), this._offCenterFrustum.computeCullingVolume(e, t, r);
}, bi.prototype.getPixelDimensions = function(e, t, r, n, o) {
	return wi(this), this._offCenterFrustum.getPixelDimensions(e, t, r, n, o);
}, bi.prototype.clone = function(e) {
	return A(e) || (e = new bi()), e.aspectRatio = this.aspectRatio, e.width = this.width, e.near = this.near, e.far = this.far, e._aspectRatio = void 0, e._width = void 0, e._near = void 0, e._far = void 0, this._offCenterFrustum.clone(e._offCenterFrustum), e;
}, bi.prototype.equals = function(e) {
	return !!(A(e) && e instanceof bi) && (wi(this), wi(e), this.width === e.width && this.aspectRatio === e.aspectRatio && this._offCenterFrustum.equals(e._offCenterFrustum));
}, bi.prototype.equalsEpsilon = function(e, t, r) {
	return !!(A(e) && e instanceof bi) && (wi(this), wi(e), M.equalsEpsilon(this.width, e.width, t, r) && M.equalsEpsilon(this.aspectRatio, e.aspectRatio, t, r) && this._offCenterFrustum.equalsEpsilon(e._offCenterFrustum, t, r));
};
const Oi = {
	MORPHING: 0,
	COLUMBUS_VIEW: 1,
	SCENE2D: 2,
	SCENE3D: 3,
	getMorphTime: function(e) {
		return e === Oi.SCENE3D ? 1 : e !== Oi.MORPHING ? 0 : void 0;
	}
};
Object.freeze(Oi);
var Ei = class e {
	constructor(e) {
		this._ellipsoid = e ?? jt.WGS84, this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
	}
	get ellipsoid() {
		return this._ellipsoid;
	}
	static mercatorAngleToGeodeticLatitude(e) {
		return M.PI_OVER_TWO - 2 * Math.atan(Math.exp(-e));
	}
	static geodeticLatitudeToMercatorAngle(t) {
		t > e.MaximumLatitude ? t = e.MaximumLatitude : t < -e.MaximumLatitude && (t = -e.MaximumLatitude);
		const r = Math.sin(t);
		return .5 * Math.log((1 + r) / (1 - r));
	}
	project(t, r) {
		const n = this._semimajorAxis, o = t.longitude * n, i = e.geodeticLatitudeToMercatorAngle(t.latitude) * n, s = t.height;
		return A(r) ? (r.x = o, r.y = i, r.z = s, r) : new N(o, i, s);
	}
	unproject(t, r) {
		if (!A(t)) throw new T("cartesian is required");
		const n = this._oneOverSemimajorAxis, o = t.x * n, i = e.mercatorAngleToGeodeticLatitude(t.y * n), s = t.z;
		return A(r) ? (r.longitude = o, r.latitude = i, r.height = s, r) : new xt(o, i, s);
	}
};
Ei.MaximumLatitude = Ei.mercatorAngleToGeodeticLatitude(Math.PI);
const xi = {}, _i = new $(0, 0, 0, 1);
let Si = new $();
const vi = new Xo(), Ci = new pt(), ji = new pt();
xi.worldToWindowCoordinates = function(e, t, r) {
	return xi.worldWithEyeOffsetToWindowCoordinates(e, t, N.ZERO, r);
};
const Ai = new $(), Ti = new N();
function Ri(e, t, r, n) {
	const o = r.viewMatrix, i = de.multiplyByVector(o, $.fromElements(e.x, e.y, e.z, 1, Ai), Ai), s = N.multiplyComponents(t, N.normalize(i, Ti), Ti);
	return i.x += t.x + s.x, i.y += t.y + s.y, i.z += s.z, de.multiplyByVector(r.frustum.projectionMatrix, i, n);
}
const zi = new xt(Math.PI, M.PI_OVER_TWO), Ii = new N(), Mi = new N();
xi.worldWithEyeOffsetToWindowCoordinates = function(e, t, r, n) {
	if (!A(e)) throw new T("scene is required.");
	if (!A(t)) throw new T("position is required.");
	const o = e.frameState, i = xi.computeActualEllipsoidPosition(o, t, _i);
	if (!A(i)) return;
	const s = e.canvas, a = vi;
	a.x = 0, a.y = 0, a.width = s.clientWidth, a.height = s.clientHeight;
	const u = e.camera;
	let c = !1;
	if (o.mode === Oi.SCENE2D) {
		const t = e.mapProjection, o = zi, l = t.project(o, Ii), f = N.clone(u.position, Mi), h = u.frustum.clone(), p = de.computeViewportTransformation(a, 0, 1, new de()), d = u.frustum.projectionMatrix, m = u.positionWC.y, y = N.fromElements(M.sign(m) * l.x - m, 0, -u.positionWC.x), g = no.pointToGLWindowCoordinates(d, p, y);
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
			N.clone(f, u.position), u.frustum = h.clone(), ((n = pt.clone(Ci, n)).x < 0 || n.x > s.clientWidth) && (n.x = ji.x);
		}
	}
	if (o.mode !== Oi.SCENE2D || c) {
		if (Si = Ri(i, r, u, Si), Si.z < 0 && !(u.frustum instanceof bi) && !(u.frustum instanceof hi)) return;
		n = xi.clipToGLWindowCoordinates(a, Si, n);
	}
	return n.y = s.clientHeight - n.y, n;
}, xi.worldToDrawingBufferCoordinates = function(e, t, r) {
	if (A(r = xi.worldToWindowCoordinates(e, t, r))) return xi.transformWindowToDrawingBuffer(e, r, r);
};
const qi = new N(), Pi = new xt();
xi.computeActualEllipsoidPosition = function(e, t, r) {
	const n = e.mode;
	if (n === Oi.SCENE3D) return N.clone(t, r);
	const o = e.mapProjection, i = o.ellipsoid.cartesianToCartographic(t, Pi);
	if (!A(i)) return;
	if (o.project(i, qi), n === Oi.COLUMBUS_VIEW) return N.fromElements(qi.z, qi.x, qi.y, r);
	if (n === Oi.SCENE2D) return N.fromElements(0, qi.x, qi.y, r);
	const s = e.morphTime;
	return N.fromElements(M.lerp(qi.z, t.x, s), M.lerp(qi.x, t.y, s), M.lerp(qi.y, t.z, s), r);
};
const Ni = new N(), Di = new N(), Fi = new de();
xi.clipToGLWindowCoordinates = function(e, t, r) {
	return N.divideByScalar(t, t.w, Ni), de.computeViewportTransformation(e, 0, 1, Fi), de.multiplyByPoint(Fi, Ni, Di), pt.fromCartesian3(Di, r);
}, xi.transformWindowToDrawingBuffer = function(e, t, r) {
	const n = e.canvas, o = e.drawingBufferWidth / n.clientWidth, i = e.drawingBufferHeight / n.clientHeight;
	return pt.fromElements(t.x * o, t.y * i, r);
};
const Li = new $(), Ui = new $();
xi.drawingBufferToWorldCoordinates = function(e, t, r, n) {
	const o = e.context.uniformState, i = o.currentFrustum, s = i.x, a = i.y;
	if (e.frameState.useLogDepth) {
		const e = r * o.log2FarDepthFromNearPlusOne;
		r = a * (1 - s / (Math.pow(2, e) - 1 + s)) / (a - s);
	}
	const u = e.view.passState.viewport, c = $.clone($.UNIT_W, Li);
	let l;
	c.x = (t.x - u.x) / u.width * 2 - 1, c.y = (t.y - u.y) / u.height * 2 - 1, c.z = 2 * r - 1, c.w = 1;
	let f = e.camera.frustum;
	if (A(f.fovy)) {
		l = de.multiplyByVector(o.inverseViewProjection, c, Ui);
		const e = 1 / l.w;
		N.multiplyByScalar(l, e, l);
	} else {
		const e = f.offCenterFrustum;
		A(e) && (f = e), l = Ui, l.x = .5 * (c.x * (f.right - f.left) + f.left + f.right), l.y = .5 * (c.y * (f.top - f.bottom) + f.bottom + f.top), l.z = .5 * (c.z * (s - a) - s - a), l.w = 1, l = de.multiplyByVector(o.inverseView, l, l);
	}
	return N.fromCartesian4(l, n);
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
		return e ? N.fromDegrees(e.lng, e.lat, e.alt, jt.WGS84) : N.ZERO;
	}
	distance(t) {
		return t && t instanceof e ? N.distance(this.transformWGS84ToCartesian(this), this.transformWGS84ToCartesian(t)) : 0;
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
const Bi = new Ei();
var Wi = class {
	static transformCartesianToCartographic(e) {
		return jt.WGS84.cartesianToCartographic(e);
	}
	static transformCartesianToWGS84(e) {
		if (e) {
			let t = jt.WGS84.cartesianToCartographic(e);
			return new ki(M.toDegrees(t?.longitude || 0), M.toDegrees(t?.latitude || 0), t?.height || 0);
		}
		return new ki(0, 0);
	}
	static transformCartographicToWGS84(e) {
		return e ? new ki(M.toDegrees(e?.longitude || 0), M.toDegrees(e?.latitude || 0), e.height || 0) : new ki(0, 0);
	}
	static transformWGS84ToCartesian(e) {
		return e ? N.fromDegrees(e.lng, e.lat, e.alt, jt.WGS84) : N.ZERO;
	}
	static transformWGS84ToCartographic(e) {
		return e ? xt.fromDegrees(e.lng, e.lat, e.alt) : xt.ZERO;
	}
	static transformCartesianArrayToWGS84Array(e) {
		return e ? e.map((e) => this.transformCartesianToWGS84(e)) : [];
	}
	static transformWGS84ArrayToCartesianArray(e) {
		return e ? e.map((e) => this.transformWGS84ToCartesian(e)) : [];
	}
	static transformWGS84ToMercator(e) {
		let t = Bi.project(xt.fromDegrees(e.lng, e.lat, e.alt));
		return new ki(t.x, t.y, t.z);
	}
	static transformMercatorToWGS84(e) {
		let t = Bi.unproject(new N(e.lng, e.lat, e.alt));
		return new ki(M.toDegrees(t.longitude), M.toDegrees(t.latitude), t.height);
	}
	static transformWindowToWGS84(e, t) {
		let r, n = t.scene;
		if (n.mode === Oi.SCENE3D) {
			let t = n.camera.getPickRay(e);
			r = n.globe.pick(t, n);
		} else r = n.camera.pickEllipsoid(e, jt.WGS84);
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
		else if (Object(e) instanceof ki) Object(e) instanceof ki ? t = e : Object(e) instanceof N ? t = Wi.transformCartesianToWGS84(e) : Object(e) instanceof xt && (t = Wi.transformCartographicToWGS84(e));
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
const is = 11102230246251565e-32, ss = 134217729, as = (3 + 8 * is) * is;
function us(e, t, r, n, o) {
	let i, s, a, u, c = t[0], l = n[0], f = 0, h = 0;
	l > c == l > -c ? (i = c, c = t[++f]) : (i = l, l = n[++h]);
	let p = 0;
	if (f < e && h < r) for (l > c == l > -c ? (s = c + i, a = i - (s - c), c = t[++f]) : (s = l + i, a = i - (s - l), l = n[++h]), i = s, 0 !== a && (o[p++] = a); f < e && h < r;) l > c == l > -c ? (s = i + c, u = s - i, a = i - (s - u) + (c - u), c = t[++f]) : (s = i + l, u = s - i, a = i - (s - u) + (l - u), l = n[++h]), i = s, 0 !== a && (o[p++] = a);
	for (; f < e;) s = i + c, u = s - i, a = i - (s - u) + (c - u), c = t[++f], i = s, 0 !== a && (o[p++] = a);
	for (; h < r;) s = i + l, u = s - i, a = i - (s - u) + (l - u), l = n[++h], i = s, 0 !== a && (o[p++] = a);
	return 0 === i && 0 !== p || (o[p++] = i), p;
}
function cs(e) {
	return new Float64Array(e);
}
const ls = cs(4), fs = cs(8), hs = cs(12), ps = cs(16), ds = cs(4);
function ms(e, t, r, n, o, i) {
	const s = (t - i) * (r - o), a = (e - o) * (n - i), u = s - a, c = Math.abs(s + a);
	return Math.abs(u) >= 33306690738754716e-32 * c ? u : -function(e, t, r, n, o, i, s) {
		let a, u, c, l, f, h, p, d, m, y, g, b, w, O, E, x, _, S;
		const v = e - o, C = r - o, j = t - i, A = n - i;
		O = v * A, h = ss * v, p = h - (h - v), d = v - p, h = ss * A, m = h - (h - A), y = A - m, E = d * y - (O - p * m - d * m - p * y), x = j * C, h = ss * j, p = h - (h - j), d = j - p, h = ss * C, m = h - (h - C), y = C - m, _ = d * y - (x - p * m - d * m - p * y), g = E - _, f = E - g, ls[0] = E - (g + f) + (f - _), b = O + g, f = b - O, w = O - (b - f) + (g - f), g = w - x, f = w - g, ls[1] = w - (g + f) + (f - x), S = b + g, f = S - b, ls[2] = b - (S - f) + (g - f), ls[3] = S;
		let T = function(e, t) {
			let r = t[0];
			for (let n = 1; n < 4; n++) r += t[n];
			return r;
		}(0, ls), R = 22204460492503146e-32 * s;
		if (T >= R || -T >= R) return T;
		if (f = e - v, a = e - (v + f) + (f - o), f = r - C, c = r - (C + f) + (f - o), f = t - j, u = t - (j + f) + (f - i), f = n - A, l = n - (A + f) + (f - i), 0 === a && 0 === u && 0 === c && 0 === l) return T;
		if (R = 11093356479670487e-47 * s + as * Math.abs(T), T += v * l + A * a - (j * c + C * u), T >= R || -T >= R) return T;
		O = a * A, h = ss * a, p = h - (h - a), d = a - p, h = ss * A, m = h - (h - A), y = A - m, E = d * y - (O - p * m - d * m - p * y), x = u * C, h = ss * u, p = h - (h - u), d = u - p, h = ss * C, m = h - (h - C), y = C - m, _ = d * y - (x - p * m - d * m - p * y), g = E - _, f = E - g, ds[0] = E - (g + f) + (f - _), b = O + g, f = b - O, w = O - (b - f) + (g - f), g = w - x, f = w - g, ds[1] = w - (g + f) + (f - x), S = b + g, f = S - b, ds[2] = b - (S - f) + (g - f), ds[3] = S;
		const z = us(4, ls, 4, ds, fs);
		O = v * l, h = ss * v, p = h - (h - v), d = v - p, h = ss * l, m = h - (h - l), y = l - m, E = d * y - (O - p * m - d * m - p * y), x = j * c, h = ss * j, p = h - (h - j), d = j - p, h = ss * c, m = h - (h - c), y = c - m, _ = d * y - (x - p * m - d * m - p * y), g = E - _, f = E - g, ds[0] = E - (g + f) + (f - _), b = O + g, f = b - O, w = O - (b - f) + (g - f), g = w - x, f = w - g, ds[1] = w - (g + f) + (f - x), S = b + g, f = S - b, ds[2] = b - (S - f) + (g - f), ds[3] = S;
		const I = us(z, fs, 4, ds, hs);
		return O = a * l, h = ss * a, p = h - (h - a), d = a - p, h = ss * l, m = h - (h - l), y = l - m, E = d * y - (O - p * m - d * m - p * y), x = u * c, h = ss * u, p = h - (h - u), d = u - p, h = ss * c, m = h - (h - c), y = c - m, _ = d * y - (x - p * m - d * m - p * y), g = E - _, f = E - g, ds[0] = E - (g + f) + (f - _), b = O + g, f = b - O, w = O - (b - f) + (g - f), g = w - x, f = w - g, ds[1] = w - (g + f) + (f - x), S = b + g, f = S - b, ds[2] = b - (S - f) + (g - f), ds[3] = S, ps[us(I, hs, 4, ds, ps) - 1];
	}(e, t, r, n, o, i, c);
}
function ys(e, t) {
	var r, n, o, i, s, a, u, c, l, f = 0, h = e[0], p = e[1], d = t.length;
	for (r = 0; r < d; r++) {
		n = 0;
		var m = t[r], y = m.length - 1;
		if ((c = m[0])[0] !== m[y][0] && c[1] !== m[y][1]) throw new Error("First and last coordinates in a ring must be the same");
		for (i = c[0] - h, s = c[1] - p; n < y; n++) {
			if (a = (l = m[n + 1])[0] - h, u = l[1] - p, 0 === s && 0 === u) {
				if (a <= 0 && i >= 0 || i <= 0 && a >= 0) return 0;
			} else if (u >= 0 && s <= 0 || u <= 0 && s >= 0) {
				if (0 === (o = ms(i, a, s, u, 0, 0))) return 0;
				(o > 0 && u > 0 && s <= 0 || o < 0 && u <= 0 && s > 0) && f++;
			}
			c = l, s = u, i = a;
		}
	}
	return f % 2 != 0;
}
function gs(e, t, r = {}) {
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
		const e = ys(n, a[c]);
		if (0 === e) return !r.ignoreBoundary;
		e && (u = !0);
	}
	return u;
}
cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(8), cs(8), cs(8), cs(4), cs(8), cs(8), cs(16), cs(12), cs(192), cs(192), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(8), cs(8), cs(8), cs(8), cs(8), cs(8), cs(8), cs(8), cs(8), cs(4), cs(4), cs(4), cs(8), cs(16), cs(16), cs(16), cs(32), cs(32), cs(48), cs(64), cs(1152), cs(1152), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(4), cs(24), cs(24), cs(24), cs(24), cs(24), cs(24), cs(24), cs(24), cs(24), cs(24), cs(1152), cs(1152), cs(1152), cs(1152), cs(1152), cs(2304), cs(2304), cs(3456), cs(5760), cs(8), cs(8), cs(8), cs(16), cs(24), cs(48), cs(48), cs(96), cs(192), cs(384), cs(384), cs(384), cs(768), cs(96), cs(96), cs(96), cs(1152);
var bs = class {
	constructor(e = [], t = ws) {
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
function ws(e, t) {
	return e < t ? -1 : e > t ? 1 : 0;
}
function Os(e, t) {
	return e.p.x > t.p.x ? 1 : e.p.x < t.p.x ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function Es(e, t) {
	return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
var xs = class {
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
let _s = 0, Ss = 0, vs = 0;
function Cs(e, t) {
	const r = "Feature" === e.type ? e.geometry : e;
	let n = r.coordinates;
	"Polygon" !== r.type && "MultiLineString" !== r.type || (n = [n]), "LineString" === r.type && (n = [[n]]);
	for (let o = 0; o < n.length; o++) for (let e = 0; e < n[o].length; e++) {
		let r = n[o][e][0], i = null;
		Ss += 1;
		for (let s = 0; s < n[o][e].length - 1; s++) {
			i = n[o][e][s + 1];
			const a = new xs(r, _s, Ss, vs), u = new xs(i, _s, Ss, vs + 1);
			a.otherEvent = u, u.otherEvent = a, Os(a, u) > 0 ? (u.isLeftEndpoint = !0, a.isLeftEndpoint = !1) : (a.isLeftEndpoint = !0, u.isLeftEndpoint = !1), t.push(a), t.push(u), r = i, vs += 1;
		}
	}
	_s += 1;
}
var js = class {
	constructor(e) {
		this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
	}
};
function As(e, t) {
	if (null === e || null === t) return !1;
	if (e.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (e.rightSweepEvent.isSamePoint(t.leftSweepEvent) || e.rightSweepEvent.isSamePoint(t.leftSweepEvent) || e.rightSweepEvent.isSamePoint(t.rightSweepEvent) || e.leftSweepEvent.isSamePoint(t.leftSweepEvent) || e.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
	const r = e.leftSweepEvent.p.x, n = e.leftSweepEvent.p.y, o = e.rightSweepEvent.p.x, i = e.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, u = t.rightSweepEvent.p.x, c = t.rightSweepEvent.p.y, l = (c - a) * (o - r) - (u - s) * (i - n);
	if (0 === l) return !1;
	const f = ((u - s) * (n - a) - (c - a) * (r - s)) / l, h = ((o - r) * (n - a) - (i - n) * (r - s)) / l;
	return f >= 0 && f <= 1 && h >= 0 && h <= 1 && [r + f * (o - r), n + f * (i - n)];
}
function Ts(e, t, r = {}) {
	const { removeDuplicates: n = !0, ignoreSelfIntersections: o = !0 } = r;
	let i = [];
	"FeatureCollection" === e.type ? i = i.concat(e.features) : "Feature" === e.type ? i.push(e) : "LineString" !== e.type && "Polygon" !== e.type && "MultiLineString" !== e.type && "MultiPolygon" !== e.type || i.push(Vi(e)), "FeatureCollection" === t.type ? i = i.concat(t.features) : "Feature" === t.type ? i.push(t) : "LineString" !== t.type && "Polygon" !== t.type && "MultiLineString" !== t.type && "MultiPolygon" !== t.type || i.push(Vi(t));
	const s = function(e, t) {
		const r = new bs([], Os);
		return function(e, t) {
			if ("FeatureCollection" === e.type) {
				const r = e.features;
				for (let e = 0; e < r.length; e++) Cs(r[e], t);
			} else Cs(e, t);
		}(e, r), function(e, t) {
			t = t || !1;
			const r = [], n = new bs([], Es);
			for (; e.length;) {
				const o = e.pop();
				if (o.isLeftEndpoint) {
					const e = new js(o);
					for (let i = 0; i < n.data.length; i++) {
						const s = n.data[i];
						if (t && s.leftSweepEvent.featureId === o.featureId) continue;
						const a = As(e, s);
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
function Rs(e, t = {}) {
	const r = ts(e);
	switch (t.properties || "Feature" !== e.type || (t.properties = e.properties), r.type) {
		case "Polygon": return function(e, t = {}) {
			return zs(ts(e).coordinates, t.properties ? t.properties : "Feature" === e.type ? e.properties : {});
		}(r, t);
		case "MultiPolygon": return function(e, t = {}) {
			const r = ts(e).coordinates, n = t.properties ? t.properties : "Feature" === e.type ? e.properties : {}, o = [];
			return r.forEach((e) => {
				o.push(zs(e, n));
			}), Zi(o);
		}(r, t);
		default: throw new Error("invalid poly");
	}
}
function zs(e, t) {
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
function Is(e, t) {
	for (let r = 0; r < e.coordinates.length - 1; r++) if (qs(e.coordinates[r], e.coordinates[r + 1], t.coordinates)) return !0;
	return !1;
}
function Ms(e, t, r) {
	for (const n of t.coordinates) if (gs(n, e)) return !0;
	return Ts(t, Rs(e), { ignoreSelfIntersections: r }).features.length > 0;
}
function qs(e, t, r) {
	const n = r[0] - e[0], o = r[1] - e[1], i = t[0] - e[0], s = t[1] - e[1];
	return n * s - o * i === 0 && (Math.abs(i) >= Math.abs(s) ? i > 0 ? e[0] <= r[0] && r[0] <= t[0] : t[0] <= r[0] && r[0] <= e[0] : s > 0 ? e[1] <= r[1] && r[1] <= t[1] : t[1] <= r[1] && r[1] <= e[1]);
}
function Ps(e, t, { ignoreSelfIntersections: r = !0 } = {}) {
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
										case "LineString": return !Is(t, e);
										case "Polygon": return !gs(e, t);
									}
									break;
								case "LineString":
									switch (t.type) {
										case "Point": return !Is(e, t);
										case "LineString": return !function(e, t, r) {
											return Ts(e, t, { ignoreSelfIntersections: r }).features.length > 0;
										}(e, t, r);
										case "Polygon": return !Ms(t, e, r);
									}
									break;
								case "Polygon": switch (t.type) {
									case "Point": return !gs(t, e);
									case "LineString": return !Ms(e, t, r);
									case "Polygon": return !function(e, t, r) {
										for (const n of e.coordinates[0]) if (gs(n, t)) return !0;
										for (const n of t.coordinates[0]) if (gs(n, e)) return !0;
										return Ts(Rs(e), Rs(t), { ignoreSelfIntersections: r }).features.length > 0;
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
function Ns(e, t = {}) {
	const r = os(e);
	return Yi([(r[0] + r[2]) / 2, (r[1] + r[3]) / 2], t.properties, t);
}
function Ds(e, t = 100) {
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
					n.mask ? Ps(n.mask, t) && o.push(t) : o.push(t), e += h;
				}
				y += l;
			}
			return Zi(o);
		}(e, t, t, r);
	}(os(Qi($i.parsePolygonCoordToArray(e, !0))), t, { units: "meters" }), n = [], o = [], i = [], s = r.features.length;
	if (s > 0) for (let a = 0; a < s; a++) {
		const e = r.features[a], t = Ji(Ns(e));
		i.push(t), o.push(xt.fromDegrees(t[0], t[1]));
		const s = es(e)[0], u = s.length, c = new Array();
		for (let r = 0; r < u - 1; r++) {
			const e = s[r], t = s[r + 1], n = [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2];
			c.push(new ki(e[0], e[1])), i.push(e), o.push(xt.fromDegrees(e[0], e[1])), i.push(n), o.push(xt.fromDegrees(n[0], n[1]));
		}
		const l = s[u - 1];
		c.push(new ki(l[0], l[1])), n.push(c);
	}
	return {
		cartoArray: o,
		PositionsList: n
	};
}
function Fs(e) {
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
function Ls(e) {
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
		const u = i, c = e[a], l = N.distance(xt.toCartesian(u), xt.toCartesian(c)), f = Math.abs(s / l), h = M.toDegrees(Math.atan(f)), p = it.fromHsl(.6 - h / 90 * .6, 1, .5);
		n.push(p);
		const d = c.longitude - u.longitude, m = c.latitude - u.latitude, y = M.toDegrees(Math.atan2(d, m));
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
	slopeAndAspect1_createGrid: () => Ds,
	slopeAndAspect3_GetSquareGroups: () => Fs,
	slopeAndAspect3_calculateSlope: () => Ls
}));
