var e = Object.create, t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, o = Object.getPrototypeOf, i = Object.prototype.hasOwnProperty, s = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports);
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/ const a = Symbol("Comlink.proxy"), l = Symbol("Comlink.endpoint"), f = Symbol("Comlink.releaseProxy"), u = Symbol("Comlink.finalizer"), c = Symbol("Comlink.thrown"), h = (e) => "object" == typeof e && null !== e || "function" == typeof e, p = new Map([["proxy", {
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
		const { id: i, type: s, path: l } = Object.assign({ path: [] }, o.data), f = (o.data.argumentList || []).map(w);
		let h;
		try {
			const t = l.slice(0, -1).reduce((e, t) => e[t], e), r = l.reduce((e, t) => e[t], e);
			switch (s) {
				case "GET":
					h = r;
					break;
				case "SET":
					t[l.slice(-1)[0]] = w(o.data.value), h = !0;
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
			const [o, a] = S(r);
			t.postMessage(Object.assign(Object.assign({}, o), { id: i }), a), "RELEASE" === s && (t.removeEventListener("message", n), d(t), u in e && "function" == typeof e[u] && e[u]());
		}).catch((e) => {
			const [r, n] = S({
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
				}).then(w);
				return n.then.bind(n);
			}
			return C(e, t, [...r, s]);
		},
		set(n, i, s) {
			y(o);
			const [a, l] = S(s);
			return j(e, t, {
				type: "SET",
				path: [...r, i].map((e) => e.toString()),
				value: a
			}, l).then(w);
		},
		apply(n, i, s) {
			y(o);
			const a = r[r.length - 1];
			if (a === l) return j(e, t, { type: "ENDPOINT" }).then(w);
			if ("bind" === a) return C(e, t, r.slice(0, -1));
			const [f, u] = E(s);
			return j(e, t, {
				type: "APPLY",
				path: r.map((e) => e.toString()),
				argumentList: f
			}, u).then(w);
		},
		construct(n, i) {
			y(o);
			const [s, a] = E(i);
			return j(e, t, {
				type: "CONSTRUCT",
				path: r.map((e) => e.toString()),
				argumentList: s
			}, a).then(w);
		}
	});
	return function(e, t) {
		const r = (b.get(t) || 0) + 1;
		b.set(t, r), O && O.register(e, t, e);
	}(i, e), i;
}
function E(e) {
	const t = e.map(S);
	return [t.map((e) => e[0]), (r = t.map((e) => e[1]), Array.prototype.concat.apply([], r))];
	var r;
}
const A = /* @__PURE__ */ new WeakMap();
function S(e) {
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
function w(e) {
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
function F(e) {
	return null != e;
}
function z(e) {
	let t;
	this.name = "DeveloperError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
F(Object.create) && (z.prototype = Object.create(Error.prototype), z.prototype.constructor = z), z.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return F(this.stack) && (e += `\n${this.stack.toString()}`), e;
}, z.throwInstantiationError = function() {
	throw new z("This function defines an interface and should not be called directly.");
};
const x = {};
function R(e, t, r) {
	return `Expected ${r} to be typeof ${t}, actual typeof was ${e}`;
}
x.typeOf = {}, x.defined = function(e, t) {
	if (!F(t)) throw new z(function(e) {
		return `${e} is required, actual value was undefined`;
	}(e));
}, x.typeOf.func = function(e, t) {
	if ("function" != typeof t) throw new z(R(typeof t, "function", e));
}, x.typeOf.string = function(e, t) {
	if ("string" != typeof t) throw new z(R(typeof t, "string", e));
}, x.typeOf.number = function(e, t) {
	if ("number" != typeof t) throw new z(R(typeof t, "number", e));
}, x.typeOf.number.lessThan = function(e, t, r) {
	if (x.typeOf.number(e, t), t >= r) throw new z(`Expected ${e} to be less than ${r}, actual value was ${t}`);
}, x.typeOf.number.lessThanOrEquals = function(e, t, r) {
	if (x.typeOf.number(e, t), t > r) throw new z(`Expected ${e} to be less than or equal to ${r}, actual value was ${t}`);
}, x.typeOf.number.greaterThan = function(e, t, r) {
	if (x.typeOf.number(e, t), t <= r) throw new z(`Expected ${e} to be greater than ${r}, actual value was ${t}`);
}, x.typeOf.number.greaterThanOrEquals = function(e, t, r) {
	if (x.typeOf.number(e, t), t < r) throw new z(`Expected ${e} to be greater than or equal to ${r}, actual value was ${t}`);
}, x.typeOf.object = function(e, t) {
	if ("object" != typeof t) throw new z(R(typeof t, "object", e));
}, x.typeOf.bool = function(e, t) {
	if ("boolean" != typeof t) throw new z(R(typeof t, "boolean", e));
}, x.typeOf.bigint = function(e, t) {
	if ("bigint" != typeof t) throw new z(R(typeof t, "bigint", e));
}, x.typeOf.number.equals = function(e, t, r, n) {
	if (x.typeOf.number(e, r), x.typeOf.number(t, n), r !== n) throw new z(`${e} must be equal to ${t}, the actual values are ${r} and ${n}`);
};
var I = ((s, a, l) => (l = null != s ? e(o(s)) : {}, ((e, o, s, a) => {
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
const L = {
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
L.sign = Math.sign ?? function(e) {
	return 0 === (e = +e) || e != e ? e : e > 0 ? 1 : -1;
}, L.signNotZero = function(e) {
	return e < 0 ? -1 : 1;
}, L.toSNorm = function(e, t) {
	return t = t ?? 255, Math.round((.5 * L.clamp(e, -1, 1) + .5) * t);
}, L.fromSNorm = function(e, t) {
	return t = t ?? 255, L.clamp(e, 0, t) / t * 2 - 1;
}, L.normalize = function(e, t, r) {
	return 0 === (r = Math.max(r - t, 0)) ? 0 : L.clamp((e - t) / r, 0, 1);
}, L.sinh = Math.sinh ?? function(e) {
	return (Math.exp(e) - Math.exp(-e)) / 2;
}, L.cosh = Math.cosh ?? function(e) {
	return (Math.exp(e) + Math.exp(-e)) / 2;
}, L.lerp = function(e, t, r) {
	return (1 - r) * e + r * t;
}, L.PI = Math.PI, L.ONE_OVER_PI = 1 / Math.PI, L.PI_OVER_TWO = Math.PI / 2, L.PI_OVER_THREE = Math.PI / 3, L.PI_OVER_FOUR = Math.PI / 4, L.PI_OVER_SIX = Math.PI / 6, L.THREE_PI_OVER_TWO = 3 * Math.PI / 2, L.TWO_PI = 2 * Math.PI, L.ONE_OVER_TWO_PI = 1 / (2 * Math.PI), L.RADIANS_PER_DEGREE = Math.PI / 180, L.DEGREES_PER_RADIAN = 180 / Math.PI, L.RADIANS_PER_ARCSECOND = L.RADIANS_PER_DEGREE / 3600, L.toRadians = function(e) {
	if (!F(e)) throw new z("degrees is required.");
	return e * L.RADIANS_PER_DEGREE;
}, L.toDegrees = function(e) {
	if (!F(e)) throw new z("radians is required.");
	return e * L.DEGREES_PER_RADIAN;
}, L.convertLongitudeRange = function(e) {
	if (!F(e)) throw new z("angle is required.");
	const t = L.TWO_PI, r = e - Math.floor(e / t) * t;
	return r < -Math.PI ? r + t : r >= Math.PI ? r - t : r;
}, L.clampToLatitudeRange = function(e) {
	if (!F(e)) throw new z("angle is required.");
	return L.clamp(e, -1 * L.PI_OVER_TWO, L.PI_OVER_TWO);
}, L.negativePiToPi = function(e) {
	if (!F(e)) throw new z("angle is required.");
	return e >= -L.PI && e <= L.PI ? e : L.zeroToTwoPi(e + L.PI) - L.PI;
}, L.zeroToTwoPi = function(e) {
	if (!F(e)) throw new z("angle is required.");
	if (e >= 0 && e <= L.TWO_PI) return e;
	const t = L.mod(e, L.TWO_PI);
	return Math.abs(t) < L.EPSILON14 && Math.abs(e) > L.EPSILON14 ? L.TWO_PI : t;
}, L.mod = function(e, t) {
	if (!F(e)) throw new z("m is required.");
	if (!F(t)) throw new z("n is required.");
	if (0 === t) throw new z("divisor cannot be 0.");
	return L.sign(e) === L.sign(t) && Math.abs(e) < Math.abs(t) ? e : (e % t + t) % t;
}, L.equalsEpsilon = function(e, t, r, n) {
	if (!F(e)) throw new z("left is required.");
	if (!F(t)) throw new z("right is required.");
	r = r ?? 0, n = n ?? r;
	const o = Math.abs(e - t);
	return o <= n || o <= r * Math.max(Math.abs(e), Math.abs(t));
}, L.lessThan = function(e, t, r) {
	if (!F(e)) throw new z("first is required.");
	if (!F(t)) throw new z("second is required.");
	if (!F(r)) throw new z("absoluteEpsilon is required.");
	return e - t < -r;
}, L.lessThanOrEquals = function(e, t, r) {
	if (!F(e)) throw new z("first is required.");
	if (!F(t)) throw new z("second is required.");
	if (!F(r)) throw new z("absoluteEpsilon is required.");
	return e - t < r;
}, L.greaterThan = function(e, t, r) {
	if (!F(e)) throw new z("first is required.");
	if (!F(t)) throw new z("second is required.");
	if (!F(r)) throw new z("absoluteEpsilon is required.");
	return e - t > r;
}, L.greaterThanOrEquals = function(e, t, r) {
	if (!F(e)) throw new z("first is required.");
	if (!F(t)) throw new z("second is required.");
	if (!F(r)) throw new z("absoluteEpsilon is required.");
	return e - t > -r;
};
const T = [1];
L.factorial = function(e) {
	if ("number" != typeof e || e < 0) throw new z("A number greater than or equal to 0 is required.");
	const t = T.length;
	if (e >= t) {
		let r = T[t - 1];
		for (let n = t; n <= e; n++) {
			const e = r * n;
			T.push(e), r = e;
		}
	}
	return T[e];
}, L.incrementWrap = function(e, t, r) {
	if (r = r ?? 0, !F(e)) throw new z("n is required.");
	if (t <= r) throw new z("maximumValue must be greater than minimumValue.");
	return ++e > t && (e = r), e;
}, L.isPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new z("A number between 0 and (2^32)-1 is required.");
	return 0 !== e && !(e & e - 1);
}, L.nextPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 2147483648) throw new z("A number between 0 and 2^31 is required.");
	return --e, e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ++e;
}, L.previousPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new z("A number between 0 and (2^32)-1 is required.");
	return e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ((e |= e >> 32) >>> 0) - (e >>> 1);
}, L.clamp = function(e, t, r) {
	return x.typeOf.number("value", e), x.typeOf.number("min", t), x.typeOf.number("max", r), e < t ? t : e > r ? r : e;
};
let N = new I.default();
L.setRandomNumberSeed = function(e) {
	if (!F(e)) throw new z("seed is required.");
	N = new I.default(e);
}, L.nextRandomNumber = function() {
	return N.random();
}, L.randomBetween = function(e, t) {
	return L.nextRandomNumber() * (t - e) + e;
}, L.acosClamped = function(e) {
	if (!F(e)) throw new z("value is required.");
	return Math.acos(L.clamp(e, -1, 1));
}, L.asinClamped = function(e) {
	if (!F(e)) throw new z("value is required.");
	return Math.asin(L.clamp(e, -1, 1));
}, L.chordLength = function(e, t) {
	if (!F(e)) throw new z("angle is required.");
	if (!F(t)) throw new z("radius is required.");
	return 2 * t * Math.sin(.5 * e);
}, L.logBase = function(e, t) {
	if (!F(e)) throw new z("number is required.");
	if (!F(t)) throw new z("base is required.");
	return Math.log(e) / Math.log(t);
}, L.cbrt = Math.cbrt ?? function(e) {
	const t = Math.pow(Math.abs(e), 1 / 3);
	return e < 0 ? -t : t;
}, L.log2 = Math.log2 ?? function(e) {
	return Math.log(e) * Math.LOG2E;
}, L.fog = function(e, t) {
	const r = e * t;
	return 1 - Math.exp(-r * r);
}, L.fastApproximateAtan = function(e) {
	return x.typeOf.number("x", e), e * (-.1784 * Math.abs(e) - .0663 * e * e + 1.0301);
}, L.fastApproximateAtan2 = function(e, t) {
	let r;
	x.typeOf.number("x", e), x.typeOf.number("y", t);
	let n = Math.abs(e);
	r = Math.abs(t);
	const o = Math.max(n, r);
	r = Math.min(n, r);
	const i = r / o;
	if (isNaN(i)) throw new z("either x or y must be nonzero");
	return n = L.fastApproximateAtan(i), n = Math.abs(t) > Math.abs(e) ? L.PI_OVER_TWO - n : n, n = e < 0 ? L.PI - n : n, n = t < 0 ? -n : n, n;
};
var _ = class e {
	constructor(e, t, r) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0;
	}
	static fromSpherical(t, r) {
		x.typeOf.object("spherical", t), F(r) || (r = new e());
		const n = t.clock, o = t.cone, i = t.magnitude ?? 1, s = i * Math.sin(o);
		return r.x = s * Math.cos(n), r.y = s * Math.sin(n), r.z = i * Math.cos(o), r;
	}
	static fromElements(t, r, n, o) {
		return F(o) ? (o.x = t, o.y = r, o.z = n, o) : new e(t, r, n);
	}
	static clone(t, r) {
		if (F(t)) return F(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r) : new e(t.x, t.y, t.z);
	}
	static pack(e, t, r) {
		return x.typeOf.object("value", e), x.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r] = e.z, t;
	}
	static unpack(t, r, n) {
		return x.defined("array", t), r = r ?? 0, F(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r], n;
	}
	static packArray(t, r) {
		x.defined("array", t);
		const n = t.length, o = 3 * n;
		if (F(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new z("If result is a typed array, it must have exactly array.length * 3 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 3 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (x.defined("array", t), x.typeOf.number.greaterThanOrEquals("array.length", t.length, 3), t.length % 3 != 0) throw new z("array length must be a multiple of 3.");
		const n = t.length;
		F(r) ? r.length = n / 3 : r = new Array(n / 3);
		for (let o = 0; o < n; o += 3) {
			const n = o / 3;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return x.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z);
	}
	static minimumComponent(e) {
		return x.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z);
	}
	static minimumByComponent(e, t, r) {
		return x.typeOf.object("first", e), x.typeOf.object("second", t), x.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r;
	}
	static maximumByComponent(e, t, r) {
		return x.typeOf.object("first", e), x.typeOf.object("second", t), x.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r;
	}
	static clamp(e, t, r, n) {
		x.typeOf.object("value", e), x.typeOf.object("min", t), x.typeOf.object("max", r), x.typeOf.object("result", n);
		const o = L.clamp(e.x, t.x, r.x), i = L.clamp(e.y, t.y, r.y), s = L.clamp(e.z, t.z, r.z);
		return n.x = o, n.y = i, n.z = s, n;
	}
	static magnitudeSquared(e) {
		return x.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return x.typeOf.object("left", t), x.typeOf.object("right", r), e.subtract(t, r, D), e.magnitude(D);
	}
	static distanceSquared(t, r) {
		return x.typeOf.object("left", t), x.typeOf.object("right", r), e.subtract(t, r, D), e.magnitudeSquared(D);
	}
	static normalize(t, r) {
		x.typeOf.object("cartesian", t), x.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z)) throw new z("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z;
	}
	static multiplyComponents(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r;
	}
	static divideComponents(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r;
	}
	static add(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r;
	}
	static subtract(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r;
	}
	static multiplyByScalar(e, t, r) {
		return x.typeOf.object("cartesian", e), x.typeOf.number("scalar", t), x.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r;
	}
	static divideByScalar(e, t, r) {
		return x.typeOf.object("cartesian", e), x.typeOf.number("scalar", t), x.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r;
	}
	static negate(e, t) {
		return x.typeOf.object("cartesian", e), x.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t;
	}
	static abs(e, t) {
		return x.typeOf.object("cartesian", e), x.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t;
	}
	static lerp(t, r, n, o) {
		return x.typeOf.object("start", t), x.typeOf.object("end", r), x.typeOf.number("t", n), x.typeOf.object("result", o), e.multiplyByScalar(r, n, M), o = e.multiplyByScalar(t, 1 - n, o), e.add(M, o, o);
	}
	static angleBetween(t, r) {
		x.typeOf.object("left", t), x.typeOf.object("right", r), e.normalize(t, B), e.normalize(r, P);
		const n = e.dot(B, P), o = e.magnitude(e.cross(B, P, B));
		return Math.atan2(o, n);
	}
	static mostOrthogonalAxis(t, r) {
		x.typeOf.object("cartesian", t), x.typeOf.object("result", r);
		const n = e.normalize(t, v);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Z, r) : n.y <= n.z ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_Z, r);
	}
	static projectVector(t, r, n) {
		x.defined("a", t), x.defined("b", r), x.defined("result", n);
		const o = e.dot(t, r) / e.dot(r, r);
		return e.multiplyByScalar(r, o, n);
	}
	static equals(e, t) {
		return e === t || F(e) && F(t) && e.x === t.x && e.y === t.y && e.z === t.z;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || F(e) && F(t) && L.equalsEpsilon(e.x, t.x, r, n) && L.equalsEpsilon(e.y, t.y, r, n) && L.equalsEpsilon(e.z, t.z, r, n);
	}
	static cross(e, t, r) {
		x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r);
		const n = e.x, o = e.y, i = e.z, s = t.x, a = t.y, l = t.z, f = o * l - i * a, u = i * s - n * l, c = n * a - o * s;
		return r.x = f, r.y = u, r.z = c, r;
	}
	static midpoint(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.x = .5 * (e.x + t.x), r.y = .5 * (e.y + t.y), r.z = .5 * (e.z + t.z), r;
	}
	static fromDegrees(t, r, n, o, i) {
		return x.typeOf.number("longitude", t), x.typeOf.number("latitude", r), t = L.toRadians(t), r = L.toRadians(r), e.fromRadians(t, r, n, o, i);
	}
	static fromRadians(t, r, n, o, i) {
		x.typeOf.number("longitude", t), x.typeOf.number("latitude", r), n = n ?? 0;
		const s = F(o) ? o.radiiSquared : e._ellipsoidRadiiSquared, a = Math.cos(r);
		U.x = a * Math.cos(t), U.y = a * Math.sin(t), U.z = Math.sin(r), U = e.normalize(U, U), e.multiplyComponents(s, U, q);
		const l = Math.sqrt(e.dot(U, q));
		return q = e.divideByScalar(q, l, q), U = e.multiplyByScalar(U, n, U), F(i) || (i = new e()), e.add(q, U, i);
	}
	static fromDegreesArray(t, r, n) {
		if (x.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new z("the number of coordinates must be a multiple of 2 and at least 2");
		const o = t.length;
		F(n) ? n.length = o / 2 : n = new Array(o / 2);
		for (let i = 0; i < o; i += 2) {
			const o = t[i], s = t[i + 1], a = i / 2;
			n[a] = e.fromDegrees(o, s, 0, r, n[a]);
		}
		return n;
	}
	static fromRadiansArray(t, r, n) {
		if (x.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new z("the number of coordinates must be a multiple of 2 and at least 2");
		const o = t.length;
		F(n) ? n.length = o / 2 : n = new Array(o / 2);
		for (let i = 0; i < o; i += 2) {
			const o = t[i], s = t[i + 1], a = i / 2;
			n[a] = e.fromRadians(o, s, 0, r, n[a]);
		}
		return n;
	}
	static fromDegreesArrayHeights(t, r, n) {
		if (x.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new z("the number of coordinates must be a multiple of 3 and at least 3");
		const o = t.length;
		F(n) ? n.length = o / 3 : n = new Array(o / 3);
		for (let i = 0; i < o; i += 3) {
			const o = t[i], s = t[i + 1], a = t[i + 2], l = i / 3;
			n[l] = e.fromDegrees(o, s, a, r, n[l]);
		}
		return n;
	}
	static fromRadiansArrayHeights(t, r, n) {
		if (x.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new z("the number of coordinates must be a multiple of 3 and at least 3");
		const o = t.length;
		F(n) ? n.length = o / 3 : n = new Array(o / 3);
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
_.fromCartesian4 = _.clone, _.packedLength = 3, _.fromArray = _.unpack;
const D = new _(), M = new _(), B = new _(), P = new _(), v = new _();
let U = new _(), q = new _();
_._ellipsoidRadiiSquared = new _(40680631590769, 40680631590769, 40408299984661.445), _.ZERO = Object.freeze(new _(0, 0, 0)), _.ONE = Object.freeze(new _(1, 1, 1)), _.UNIT_X = Object.freeze(new _(1, 0, 0)), _.UNIT_Y = Object.freeze(new _(0, 1, 0)), _.UNIT_Z = Object.freeze(new _(0, 0, 1));
const G = {};
let k;
G.EMPTY_OBJECT = Object.freeze({}), G.EMPTY_ARRAY = Object.freeze([]);
const W = {
	requestFullscreen: void 0,
	exitFullscreen: void 0,
	fullscreenEnabled: void 0,
	fullscreenElement: void 0,
	fullscreenchange: void 0,
	fullscreenerror: void 0
}, $ = {};
let H, Y, V, K, Z, Q, X, J, ee, te, re, ne, oe, ie, se, ae;
function le(e) {
	const t = e.split(".");
	for (let r = 0, n = t.length; r < n; ++r) t[r] = parseInt(t[r], 10);
	return t;
}
function fe() {
	if (!F(Y) && (Y = !1, !he())) {
		const e = / Chrome\/([\.0-9]+)/.exec(H.userAgent);
		null !== e && (Y = !0, V = le(e[1]));
	}
	return Y;
}
function ue() {
	if (!F(K) && (K = !1, !fe() && !he() && / Safari\/[\.0-9]+/.test(H.userAgent))) {
		const e = / Version\/([\.0-9]+)/.exec(H.userAgent);
		null !== e && (K = !0, Z = le(e[1]));
	}
	return K;
}
function ce() {
	if (!F(Q)) {
		Q = !1;
		const e = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(H.userAgent);
		null !== e && (Q = !0, X = le(e[1]), X.isNightly = !!e[2]);
	}
	return Q;
}
function he() {
	if (!F(J)) {
		J = !1;
		const e = / Edg\/([\.0-9]+)/.exec(H.userAgent);
		null !== e && (J = !0, ee = le(e[1]));
	}
	return J;
}
function pe() {
	if (!F(te)) {
		te = !1;
		const e = /Firefox\/([\.0-9]+)/.exec(H.userAgent);
		null !== e && (te = !0, re = le(e[1]));
	}
	return te;
}
function me() {
	if (!F(ae)) {
		const e = document.createElement("canvas");
		e.setAttribute("style", "image-rendering: -moz-crisp-edges;image-rendering: pixelated;");
		const t = e.style.imageRendering;
		ae = F(t) && "" !== t, ae && (se = t);
	}
	return ae;
}
function de() {
	if (!de.initialized) throw new z("You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP");
	return de._result;
}
Object.defineProperties($, {
	element: { get: function() {
		if ($.supportsFullscreen()) return document[W.fullscreenElement];
	} },
	changeEventName: { get: function() {
		if ($.supportsFullscreen()) return W.fullscreenchange;
	} },
	errorEventName: { get: function() {
		if ($.supportsFullscreen()) return W.fullscreenerror;
	} },
	enabled: { get: function() {
		if ($.supportsFullscreen()) return document[W.fullscreenEnabled];
	} },
	fullscreen: { get: function() {
		if ($.supportsFullscreen()) return null !== $.element;
	} }
}), $.supportsFullscreen = function() {
	if (F(k)) return k;
	k = !1;
	const e = document.body;
	if ("function" == typeof e.requestFullscreen) return W.requestFullscreen = "requestFullscreen", W.exitFullscreen = "exitFullscreen", W.fullscreenEnabled = "fullscreenEnabled", W.fullscreenElement = "fullscreenElement", W.fullscreenchange = "fullscreenchange", W.fullscreenerror = "fullscreenerror", k = !0, k;
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
		r = `${o}RequestFullscreen`, "function" == typeof e[r] ? (W.requestFullscreen = r, k = !0) : (r = `${o}RequestFullScreen`, "function" == typeof e[r] && (W.requestFullscreen = r, k = !0)), r = `${o}ExitFullscreen`, "function" == typeof document[r] ? W.exitFullscreen = r : (r = `${o}CancelFullScreen`, "function" == typeof document[r] && (W.exitFullscreen = r)), r = `${o}FullscreenEnabled`, void 0 !== document[r] ? W.fullscreenEnabled = r : (r = `${o}FullScreenEnabled`, void 0 !== document[r] && (W.fullscreenEnabled = r)), r = `${o}FullscreenElement`, void 0 !== document[r] ? W.fullscreenElement = r : (r = `${o}FullScreenElement`, void 0 !== document[r] && (W.fullscreenElement = r)), r = `${o}fullscreenchange`, void 0 !== document[`on${r}`] && ("ms" === o && (r = "MSFullscreenChange"), W.fullscreenchange = r), r = `${o}fullscreenerror`, void 0 !== document[`on${r}`] && ("ms" === o && (r = "MSFullscreenError"), W.fullscreenerror = r);
	}
	return k;
}, $.requestFullscreen = function(e, t) {
	$.supportsFullscreen() && e[W.requestFullscreen]({ vrDisplay: t });
}, $.exitFullscreen = function() {
	$.supportsFullscreen() && document[W.exitFullscreen]();
}, $._names = W, H = "undefined" != typeof navigator ? navigator : {}, de._promise = void 0, de._result = void 0, de.initialize = function() {
	return F(de._promise) || (de._promise = new Promise((e) => {
		const t = new Image();
		t.onload = function() {
			de._result = t.width > 0 && t.height > 0, e(de._result);
		}, t.onerror = function() {
			de._result = !1, e(de._result);
		}, t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
	})), de._promise;
}, Object.defineProperties(de, { initialized: { get: function() {
	return F(de._result);
} } });
const ye = [];
"undefined" != typeof ArrayBuffer && (ye.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), "undefined" != typeof Uint8ClampedArray && ye.push(Uint8ClampedArray), "undefined" != typeof Uint8ClampedArray && ye.push(Uint8ClampedArray), "undefined" != typeof BigInt64Array && ye.push(BigInt64Array), "undefined" != typeof BigUint64Array && ye.push(BigUint64Array));
const ge = {
	isChrome: fe,
	chromeVersion: function() {
		return fe() && V;
	},
	isSafari: ue,
	safariVersion: function() {
		return ue() && Z;
	},
	isWebkit: ce,
	webkitVersion: function() {
		return ce() && X;
	},
	isEdge: he,
	edgeVersion: function() {
		return he() && ee;
	},
	isFirefox: pe,
	firefoxVersion: function() {
		return pe() && re;
	},
	isWindows: function() {
		return F(ne) || (ne = /Windows/i.test(H.appVersion)), ne;
	},
	isIPadOrIOS: function() {
		return F(oe) || (oe = "iPhone" === navigator.platform || "iPod" === navigator.platform || "iPad" === navigator.platform), oe;
	},
	hardwareConcurrency: H.hardwareConcurrency ?? 3,
	supportsPointerEvents: function() {
		return F(ie) || (ie = !pe() && "undefined" != typeof PointerEvent && (!F(H.pointerEnabled) || H.pointerEnabled)), ie;
	},
	supportsImageRenderingPixelated: me,
	supportsWebP: de,
	imageRenderingValue: function() {
		return me() ? se : void 0;
	},
	typedArrayTypes: ye
};
function be(e, t, r) {
	return r < 0 && (r += 1), r > 1 && (r -= 1), 6 * r < 1 ? e + 6 * (t - e) * r : 2 * r < 1 ? t : 3 * r < 2 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
ge.supportsBasis = function(e) {
	return ge.supportsWebAssembly() && e.context.supportsBasis;
}, ge.supportsFullscreen = function() {
	return $.supportsFullscreen();
}, ge.supportsTypedArrays = function() {
	return "undefined" != typeof ArrayBuffer;
}, ge.supportsBigInt64Array = function() {
	return "undefined" != typeof BigInt64Array;
}, ge.supportsBigUint64Array = function() {
	return "undefined" != typeof BigUint64Array;
}, ge.supportsBigInt = function() {
	return "undefined" != typeof BigInt;
}, ge.supportsWebWorkers = function() {
	return "undefined" != typeof Worker;
}, ge.supportsWebAssembly = function() {
	return "undefined" != typeof WebAssembly;
}, ge.supportsWebgl2 = function(e) {
	return x.defined("scene", e), e.context.webgl2;
}, ge.supportsEsmWebWorkers = function() {
	return !pe() || parseInt(re) >= 114;
};
var Oe = class e {
	constructor(e, t, r, n) {
		this.red = e ?? 1, this.green = t ?? 1, this.blue = r ?? 1, this.alpha = n ?? 1;
	}
	static fromCartesian4(t, r) {
		return x.typeOf.object("cartesian", t), F(r) ? (r.red = t.x, r.green = t.y, r.blue = t.z, r.alpha = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static fromBytes(t, r, n, o, i) {
		return t = e.byteToFloat(t ?? 255), r = e.byteToFloat(r ?? 255), n = e.byteToFloat(n ?? 255), o = e.byteToFloat(o ?? 255), F(i) ? (i.red = t, i.green = r, i.blue = n, i.alpha = o, i) : new e(t, r, n, o);
	}
	static fromAlpha(t, r, n) {
		return x.typeOf.object("color", t), x.typeOf.number("alpha", r), F(n) ? (n.red = t.red, n.green = t.green, n.blue = t.blue, n.alpha = r, n) : new e(t.red, t.green, t.blue, r);
	}
	static fromRgba(t, r) {
		return Ee[0] = t, e.fromBytes(Ae[0], Ae[1], Ae[2], Ae[3], r);
	}
	static fromHsl(t, r, n, o, i) {
		t = (t ?? 0) % 1, o = o ?? 1;
		let s = n = n ?? 0, a = n, l = n;
		if (0 !== (r = r ?? 0)) {
			let e;
			e = n < .5 ? n * (1 + r) : n + r - n * r;
			const o = 2 * n - e;
			s = be(o, e, t + 1 / 3), a = be(o, e, t), l = be(o, e, t - 1 / 3);
		}
		return F(i) ? (i.red = s, i.green = a, i.blue = l, i.alpha = o, i) : new e(s, a, l, o);
	}
	static fromRandom(t, r) {
		let n = (t = t ?? G.EMPTY_OBJECT).red;
		if (!F(n)) {
			const e = t.minimumRed ?? 0, r = t.maximumRed ?? 1;
			x.typeOf.number.lessThanOrEquals("minimumRed", e, r), n = e + L.nextRandomNumber() * (r - e);
		}
		let o = t.green;
		if (!F(o)) {
			const e = t.minimumGreen ?? 0, r = t.maximumGreen ?? 1;
			x.typeOf.number.lessThanOrEquals("minimumGreen", e, r), o = e + L.nextRandomNumber() * (r - e);
		}
		let i = t.blue;
		if (!F(i)) {
			const e = t.minimumBlue ?? 0, r = t.maximumBlue ?? 1;
			x.typeOf.number.lessThanOrEquals("minimumBlue", e, r), i = e + L.nextRandomNumber() * (r - e);
		}
		let s = t.alpha;
		if (!F(s)) {
			const e = t.minimumAlpha ?? 0, r = t.maximumAlpha ?? 1;
			x.typeOf.number.lessThanOrEquals("minimumAlpha", e, r), s = e + L.nextRandomNumber() * (r - e);
		}
		return F(r) ? (r.red = n, r.green = o, r.blue = i, r.alpha = s, r) : new e(n, o, i, s);
	}
	static fromCssColorString(t, r) {
		x.typeOf.string("color", t), F(r) || (r = new e()), t = t.trim();
		const n = e[t.toUpperCase()];
		if (F(n)) return e.clone(n, r), r;
		let o = Se.exec(t);
		return null !== o ? (r.red = parseInt(o[1], 16) / 15, r.green = parseInt(o[2], 16) / 15, r.blue = parseInt(o[3], 16) / 15, r.alpha = parseInt(o[4] ?? "f", 16) / 15, r) : (o = we.exec(t), null !== o ? (r.red = parseInt(o[1], 16) / 255, r.green = parseInt(o[2], 16) / 255, r.blue = parseInt(o[3], 16) / 255, r.alpha = parseInt(o[4] ?? "ff", 16) / 255, r) : (o = je.exec(t), null !== o ? (r.red = parseFloat(o[1]) / ("%" === o[1].substr(-1) ? 100 : 255), r.green = parseFloat(o[2]) / ("%" === o[2].substr(-1) ? 100 : 255), r.blue = parseFloat(o[3]) / ("%" === o[3].substr(-1) ? 100 : 255), r.alpha = parseFloat(o[4] ?? "1.0"), r) : (o = Fe.exec(t), null !== o ? e.fromHsl(parseFloat(o[1]) / 360, parseFloat(o[2]) / 100, parseFloat(o[3]) / 100, parseFloat(o[4] ?? "1.0"), r) : r = void 0)));
	}
	static pack(e, t, r) {
		return x.typeOf.object("value", e), x.defined("array", t), r = r ?? 0, t[r++] = e.red, t[r++] = e.green, t[r++] = e.blue, t[r] = e.alpha, t;
	}
	static unpack(t, r, n) {
		return x.defined("array", t), r = r ?? 0, F(n) || (n = new e()), n.red = t[r++], n.green = t[r++], n.blue = t[r++], n.alpha = t[r], n;
	}
	static byteToFloat(e) {
		return e / 255;
	}
	static floatToByte(e) {
		return 1 === e ? 255 : 256 * e | 0;
	}
	static clone(t, r) {
		if (F(t)) return F(r) ? (r.red = t.red, r.green = t.green, r.blue = t.blue, r.alpha = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static equals(e, t) {
		return e === t || F(e) && F(t) && e.red === t.red && e.green === t.green && e.blue === t.blue && e.alpha === t.alpha;
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
		return this === e || F(e) && Math.abs(this.red - e.red) <= t && Math.abs(this.green - e.green) <= t && Math.abs(this.blue - e.blue) <= t && Math.abs(this.alpha - e.alpha) <= t;
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
		return F(t) ? (t[0] = r, t[1] = n, t[2] = o, t[3] = i, t) : [
			r,
			n,
			o,
			i
		];
	}
	static bytesToRgba(e, t, r, n) {
		return Ae[0] = e, Ae[1] = t, Ae[2] = r, Ae[3] = n, Ee[0];
	}
	toRgba() {
		return e.bytesToRgba(e.floatToByte(this.red), e.floatToByte(this.green), e.floatToByte(this.blue), e.floatToByte(this.alpha));
	}
	brighten(e, t) {
		return x.typeOf.number("magnitude", e), x.typeOf.number.greaterThanOrEquals("magnitude", e, 0), x.typeOf.object("result", t), e = 1 - e, t.red = 1 - (1 - this.red) * e, t.green = 1 - (1 - this.green) * e, t.blue = 1 - (1 - this.blue) * e, t.alpha = this.alpha, t;
	}
	darken(e, t) {
		return x.typeOf.number("magnitude", e), x.typeOf.number.greaterThanOrEquals("magnitude", e, 0), x.typeOf.object("result", t), e = 1 - e, t.red = this.red * e, t.green = this.green * e, t.blue = this.blue * e, t.alpha = this.alpha, t;
	}
	withAlpha(t, r) {
		return e.fromAlpha(this, t, r);
	}
	static add(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.red = e.red + t.red, r.green = e.green + t.green, r.blue = e.blue + t.blue, r.alpha = e.alpha + t.alpha, r;
	}
	static subtract(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.red = e.red - t.red, r.green = e.green - t.green, r.blue = e.blue - t.blue, r.alpha = e.alpha - t.alpha, r;
	}
	static multiply(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.red = e.red * t.red, r.green = e.green * t.green, r.blue = e.blue * t.blue, r.alpha = e.alpha * t.alpha, r;
	}
	static divide(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.red = e.red / t.red, r.green = e.green / t.green, r.blue = e.blue / t.blue, r.alpha = e.alpha / t.alpha, r;
	}
	static mod(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.red = e.red % t.red, r.green = e.green % t.green, r.blue = e.blue % t.blue, r.alpha = e.alpha % t.alpha, r;
	}
	static lerp(e, t, r, n) {
		return x.typeOf.object("start", e), x.typeOf.object("end", t), x.typeOf.number("t", r), x.typeOf.object("result", n), n.red = L.lerp(e.red, t.red, r), n.green = L.lerp(e.green, t.green, r), n.blue = L.lerp(e.blue, t.blue, r), n.alpha = L.lerp(e.alpha, t.alpha, r), n;
	}
	static multiplyByScalar(e, t, r) {
		return x.typeOf.object("color", e), x.typeOf.number("scalar", t), x.typeOf.object("result", r), r.red = e.red * t, r.green = e.green * t, r.blue = e.blue * t, r.alpha = e.alpha * t, r;
	}
	static divideByScalar(e, t, r) {
		return x.typeOf.object("color", e), x.typeOf.number("scalar", t), x.typeOf.object("result", r), r.red = e.red / t, r.green = e.green / t, r.blue = e.blue / t, r.alpha = e.alpha / t, r;
	}
};
let Ce, Ee, Ae;
ge.supportsTypedArrays() && (Ce = /* @__PURE__ */ new ArrayBuffer(4), Ee = new Uint32Array(Ce), Ae = new Uint8Array(Ce));
const Se = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i, we = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i, je = /^rgba?\s*\(\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i, Fe = /^hsla?\s*\(\s*([0-9.]+)\s*[,\s]+\s*([0-9.]+%)\s*[,\s]+\s*([0-9.]+%)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
Oe.packedLength = 4, Oe.ALICEBLUE = Object.freeze(Oe.fromCssColorString("#F0F8FF")), Oe.ANTIQUEWHITE = Object.freeze(Oe.fromCssColorString("#FAEBD7")), Oe.AQUA = Object.freeze(Oe.fromCssColorString("#00FFFF")), Oe.AQUAMARINE = Object.freeze(Oe.fromCssColorString("#7FFFD4")), Oe.AZURE = Object.freeze(Oe.fromCssColorString("#F0FFFF")), Oe.BEIGE = Object.freeze(Oe.fromCssColorString("#F5F5DC")), Oe.BISQUE = Object.freeze(Oe.fromCssColorString("#FFE4C4")), Oe.BLACK = Object.freeze(Oe.fromCssColorString("#000000")), Oe.BLANCHEDALMOND = Object.freeze(Oe.fromCssColorString("#FFEBCD")), Oe.BLUE = Object.freeze(Oe.fromCssColorString("#0000FF")), Oe.BLUEVIOLET = Object.freeze(Oe.fromCssColorString("#8A2BE2")), Oe.BROWN = Object.freeze(Oe.fromCssColorString("#A52A2A")), Oe.BURLYWOOD = Object.freeze(Oe.fromCssColorString("#DEB887")), Oe.CADETBLUE = Object.freeze(Oe.fromCssColorString("#5F9EA0")), Oe.CHARTREUSE = Object.freeze(Oe.fromCssColorString("#7FFF00")), Oe.CHOCOLATE = Object.freeze(Oe.fromCssColorString("#D2691E")), Oe.CORAL = Object.freeze(Oe.fromCssColorString("#FF7F50")), Oe.CORNFLOWERBLUE = Object.freeze(Oe.fromCssColorString("#6495ED")), Oe.CORNSILK = Object.freeze(Oe.fromCssColorString("#FFF8DC")), Oe.CRIMSON = Object.freeze(Oe.fromCssColorString("#DC143C")), Oe.CYAN = Object.freeze(Oe.fromCssColorString("#00FFFF")), Oe.DARKBLUE = Object.freeze(Oe.fromCssColorString("#00008B")), Oe.DARKCYAN = Object.freeze(Oe.fromCssColorString("#008B8B")), Oe.DARKGOLDENROD = Object.freeze(Oe.fromCssColorString("#B8860B")), Oe.DARKGRAY = Object.freeze(Oe.fromCssColorString("#A9A9A9")), Oe.DARKGREEN = Object.freeze(Oe.fromCssColorString("#006400")), Oe.DARKGREY = Oe.DARKGRAY, Oe.DARKKHAKI = Object.freeze(Oe.fromCssColorString("#BDB76B")), Oe.DARKMAGENTA = Object.freeze(Oe.fromCssColorString("#8B008B")), Oe.DARKOLIVEGREEN = Object.freeze(Oe.fromCssColorString("#556B2F")), Oe.DARKORANGE = Object.freeze(Oe.fromCssColorString("#FF8C00")), Oe.DARKORCHID = Object.freeze(Oe.fromCssColorString("#9932CC")), Oe.DARKRED = Object.freeze(Oe.fromCssColorString("#8B0000")), Oe.DARKSALMON = Object.freeze(Oe.fromCssColorString("#E9967A")), Oe.DARKSEAGREEN = Object.freeze(Oe.fromCssColorString("#8FBC8F")), Oe.DARKSLATEBLUE = Object.freeze(Oe.fromCssColorString("#483D8B")), Oe.DARKSLATEGRAY = Object.freeze(Oe.fromCssColorString("#2F4F4F")), Oe.DARKSLATEGREY = Oe.DARKSLATEGRAY, Oe.DARKTURQUOISE = Object.freeze(Oe.fromCssColorString("#00CED1")), Oe.DARKVIOLET = Object.freeze(Oe.fromCssColorString("#9400D3")), Oe.DEEPPINK = Object.freeze(Oe.fromCssColorString("#FF1493")), Oe.DEEPSKYBLUE = Object.freeze(Oe.fromCssColorString("#00BFFF")), Oe.DIMGRAY = Object.freeze(Oe.fromCssColorString("#696969")), Oe.DIMGREY = Oe.DIMGRAY, Oe.DODGERBLUE = Object.freeze(Oe.fromCssColorString("#1E90FF")), Oe.FIREBRICK = Object.freeze(Oe.fromCssColorString("#B22222")), Oe.FLORALWHITE = Object.freeze(Oe.fromCssColorString("#FFFAF0")), Oe.FORESTGREEN = Object.freeze(Oe.fromCssColorString("#228B22")), Oe.FUCHSIA = Object.freeze(Oe.fromCssColorString("#FF00FF")), Oe.GAINSBORO = Object.freeze(Oe.fromCssColorString("#DCDCDC")), Oe.GHOSTWHITE = Object.freeze(Oe.fromCssColorString("#F8F8FF")), Oe.GOLD = Object.freeze(Oe.fromCssColorString("#FFD700")), Oe.GOLDENROD = Object.freeze(Oe.fromCssColorString("#DAA520")), Oe.GRAY = Object.freeze(Oe.fromCssColorString("#808080")), Oe.GREEN = Object.freeze(Oe.fromCssColorString("#008000")), Oe.GREENYELLOW = Object.freeze(Oe.fromCssColorString("#ADFF2F")), Oe.GREY = Oe.GRAY, Oe.HONEYDEW = Object.freeze(Oe.fromCssColorString("#F0FFF0")), Oe.HOTPINK = Object.freeze(Oe.fromCssColorString("#FF69B4")), Oe.INDIANRED = Object.freeze(Oe.fromCssColorString("#CD5C5C")), Oe.INDIGO = Object.freeze(Oe.fromCssColorString("#4B0082")), Oe.IVORY = Object.freeze(Oe.fromCssColorString("#FFFFF0")), Oe.KHAKI = Object.freeze(Oe.fromCssColorString("#F0E68C")), Oe.LAVENDER = Object.freeze(Oe.fromCssColorString("#E6E6FA")), Oe.LAVENDAR_BLUSH = Object.freeze(Oe.fromCssColorString("#FFF0F5")), Oe.LAWNGREEN = Object.freeze(Oe.fromCssColorString("#7CFC00")), Oe.LEMONCHIFFON = Object.freeze(Oe.fromCssColorString("#FFFACD")), Oe.LIGHTBLUE = Object.freeze(Oe.fromCssColorString("#ADD8E6")), Oe.LIGHTCORAL = Object.freeze(Oe.fromCssColorString("#F08080")), Oe.LIGHTCYAN = Object.freeze(Oe.fromCssColorString("#E0FFFF")), Oe.LIGHTGOLDENRODYELLOW = Object.freeze(Oe.fromCssColorString("#FAFAD2")), Oe.LIGHTGRAY = Object.freeze(Oe.fromCssColorString("#D3D3D3")), Oe.LIGHTGREEN = Object.freeze(Oe.fromCssColorString("#90EE90")), Oe.LIGHTGREY = Oe.LIGHTGRAY, Oe.LIGHTPINK = Object.freeze(Oe.fromCssColorString("#FFB6C1")), Oe.LIGHTSEAGREEN = Object.freeze(Oe.fromCssColorString("#20B2AA")), Oe.LIGHTSKYBLUE = Object.freeze(Oe.fromCssColorString("#87CEFA")), Oe.LIGHTSLATEGRAY = Object.freeze(Oe.fromCssColorString("#778899")), Oe.LIGHTSLATEGREY = Oe.LIGHTSLATEGRAY, Oe.LIGHTSTEELBLUE = Object.freeze(Oe.fromCssColorString("#B0C4DE")), Oe.LIGHTYELLOW = Object.freeze(Oe.fromCssColorString("#FFFFE0")), Oe.LIME = Object.freeze(Oe.fromCssColorString("#00FF00")), Oe.LIMEGREEN = Object.freeze(Oe.fromCssColorString("#32CD32")), Oe.LINEN = Object.freeze(Oe.fromCssColorString("#FAF0E6")), Oe.MAGENTA = Object.freeze(Oe.fromCssColorString("#FF00FF")), Oe.MAROON = Object.freeze(Oe.fromCssColorString("#800000")), Oe.MEDIUMAQUAMARINE = Object.freeze(Oe.fromCssColorString("#66CDAA")), Oe.MEDIUMBLUE = Object.freeze(Oe.fromCssColorString("#0000CD")), Oe.MEDIUMORCHID = Object.freeze(Oe.fromCssColorString("#BA55D3")), Oe.MEDIUMPURPLE = Object.freeze(Oe.fromCssColorString("#9370DB")), Oe.MEDIUMSEAGREEN = Object.freeze(Oe.fromCssColorString("#3CB371")), Oe.MEDIUMSLATEBLUE = Object.freeze(Oe.fromCssColorString("#7B68EE")), Oe.MEDIUMSPRINGGREEN = Object.freeze(Oe.fromCssColorString("#00FA9A")), Oe.MEDIUMTURQUOISE = Object.freeze(Oe.fromCssColorString("#48D1CC")), Oe.MEDIUMVIOLETRED = Object.freeze(Oe.fromCssColorString("#C71585")), Oe.MIDNIGHTBLUE = Object.freeze(Oe.fromCssColorString("#191970")), Oe.MINTCREAM = Object.freeze(Oe.fromCssColorString("#F5FFFA")), Oe.MISTYROSE = Object.freeze(Oe.fromCssColorString("#FFE4E1")), Oe.MOCCASIN = Object.freeze(Oe.fromCssColorString("#FFE4B5")), Oe.NAVAJOWHITE = Object.freeze(Oe.fromCssColorString("#FFDEAD")), Oe.NAVY = Object.freeze(Oe.fromCssColorString("#000080")), Oe.OLDLACE = Object.freeze(Oe.fromCssColorString("#FDF5E6")), Oe.OLIVE = Object.freeze(Oe.fromCssColorString("#808000")), Oe.OLIVEDRAB = Object.freeze(Oe.fromCssColorString("#6B8E23")), Oe.ORANGE = Object.freeze(Oe.fromCssColorString("#FFA500")), Oe.ORANGERED = Object.freeze(Oe.fromCssColorString("#FF4500")), Oe.ORCHID = Object.freeze(Oe.fromCssColorString("#DA70D6")), Oe.PALEGOLDENROD = Object.freeze(Oe.fromCssColorString("#EEE8AA")), Oe.PALEGREEN = Object.freeze(Oe.fromCssColorString("#98FB98")), Oe.PALETURQUOISE = Object.freeze(Oe.fromCssColorString("#AFEEEE")), Oe.PALEVIOLETRED = Object.freeze(Oe.fromCssColorString("#DB7093")), Oe.PAPAYAWHIP = Object.freeze(Oe.fromCssColorString("#FFEFD5")), Oe.PEACHPUFF = Object.freeze(Oe.fromCssColorString("#FFDAB9")), Oe.PERU = Object.freeze(Oe.fromCssColorString("#CD853F")), Oe.PINK = Object.freeze(Oe.fromCssColorString("#FFC0CB")), Oe.PLUM = Object.freeze(Oe.fromCssColorString("#DDA0DD")), Oe.POWDERBLUE = Object.freeze(Oe.fromCssColorString("#B0E0E6")), Oe.PURPLE = Object.freeze(Oe.fromCssColorString("#800080")), Oe.RED = Object.freeze(Oe.fromCssColorString("#FF0000")), Oe.ROSYBROWN = Object.freeze(Oe.fromCssColorString("#BC8F8F")), Oe.ROYALBLUE = Object.freeze(Oe.fromCssColorString("#4169E1")), Oe.SADDLEBROWN = Object.freeze(Oe.fromCssColorString("#8B4513")), Oe.SALMON = Object.freeze(Oe.fromCssColorString("#FA8072")), Oe.SANDYBROWN = Object.freeze(Oe.fromCssColorString("#F4A460")), Oe.SEAGREEN = Object.freeze(Oe.fromCssColorString("#2E8B57")), Oe.SEASHELL = Object.freeze(Oe.fromCssColorString("#FFF5EE")), Oe.SIENNA = Object.freeze(Oe.fromCssColorString("#A0522D")), Oe.SILVER = Object.freeze(Oe.fromCssColorString("#C0C0C0")), Oe.SKYBLUE = Object.freeze(Oe.fromCssColorString("#87CEEB")), Oe.SLATEBLUE = Object.freeze(Oe.fromCssColorString("#6A5ACD")), Oe.SLATEGRAY = Object.freeze(Oe.fromCssColorString("#708090")), Oe.SLATEGREY = Oe.SLATEGRAY, Oe.SNOW = Object.freeze(Oe.fromCssColorString("#FFFAFA")), Oe.SPRINGGREEN = Object.freeze(Oe.fromCssColorString("#00FF7F")), Oe.STEELBLUE = Object.freeze(Oe.fromCssColorString("#4682B4")), Oe.TAN = Object.freeze(Oe.fromCssColorString("#D2B48C")), Oe.TEAL = Object.freeze(Oe.fromCssColorString("#008080")), Oe.THISTLE = Object.freeze(Oe.fromCssColorString("#D8BFD8")), Oe.TOMATO = Object.freeze(Oe.fromCssColorString("#FF6347")), Oe.TURQUOISE = Object.freeze(Oe.fromCssColorString("#40E0D0")), Oe.VIOLET = Object.freeze(Oe.fromCssColorString("#EE82EE")), Oe.WHEAT = Object.freeze(Oe.fromCssColorString("#F5DEB3")), Oe.WHITE = Object.freeze(Oe.fromCssColorString("#FFFFFF")), Oe.WHITESMOKE = Object.freeze(Oe.fromCssColorString("#F5F5F5")), Oe.YELLOW = Object.freeze(Oe.fromCssColorString("#FFFF00")), Oe.YELLOWGREEN = Object.freeze(Oe.fromCssColorString("#9ACD32")), Oe.TRANSPARENT = Object.freeze(new Oe(0, 0, 0, 0));
var ze = class e {
	constructor(e, t) {
		this.x = e ?? 0, this.y = t ?? 0;
	}
	static fromElements(t, r, n) {
		return F(n) ? (n.x = t, n.y = r, n) : new e(t, r);
	}
	static clone(t, r) {
		if (F(t)) return F(r) ? (r.x = t.x, r.y = t.y, r) : new e(t.x, t.y);
	}
	static pack(e, t, r) {
		return x.typeOf.object("value", e), x.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r] = e.y, t;
	}
	static unpack(t, r, n) {
		return x.defined("array", t), r = r ?? 0, F(n) || (n = new e()), n.x = t[r++], n.y = t[r], n;
	}
	static packArray(t, r) {
		x.defined("array", t);
		const n = t.length, o = 2 * n;
		if (F(r)) {
			if (!Array.isArray(r) && r.length !== o) throw new z("If result is a typed array, it must have exactly array.length * 2 elements");
			r.length !== o && (r.length = o);
		} else r = new Array(o);
		for (let i = 0; i < n; ++i) e.pack(t[i], r, 2 * i);
		return r;
	}
	static unpackArray(t, r) {
		if (x.defined("array", t), x.typeOf.number.greaterThanOrEquals("array.length", t.length, 2), t.length % 2 != 0) throw new z("array length must be a multiple of 2.");
		const n = t.length;
		F(r) ? r.length = n / 2 : r = new Array(n / 2);
		for (let o = 0; o < n; o += 2) {
			const n = o / 2;
			r[n] = e.unpack(t, o, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return x.typeOf.object("cartesian", e), Math.max(e.x, e.y);
	}
	static minimumComponent(e) {
		return x.typeOf.object("cartesian", e), Math.min(e.x, e.y);
	}
	static minimumByComponent(e, t, r) {
		return x.typeOf.object("first", e), x.typeOf.object("second", t), x.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r;
	}
	static maximumByComponent(e, t, r) {
		return x.typeOf.object("first", e), x.typeOf.object("second", t), x.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r;
	}
	static clamp(e, t, r, n) {
		x.typeOf.object("value", e), x.typeOf.object("min", t), x.typeOf.object("max", r), x.typeOf.object("result", n);
		const o = L.clamp(e.x, t.x, r.x), i = L.clamp(e.y, t.y, r.y);
		return n.x = o, n.y = i, n;
	}
	static magnitudeSquared(e) {
		return x.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return x.typeOf.object("left", t), x.typeOf.object("right", r), e.subtract(t, r, xe), e.magnitude(xe);
	}
	static distanceSquared(t, r) {
		return x.typeOf.object("left", t), x.typeOf.object("right", r), e.subtract(t, r, xe), e.magnitudeSquared(xe);
	}
	static normalize(t, r) {
		x.typeOf.object("cartesian", t), x.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, isNaN(r.x) || isNaN(r.y)) throw new z("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), e.x * t.x + e.y * t.y;
	}
	static cross(e, t) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), e.x * t.y - e.y * t.x;
	}
	static multiplyComponents(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r;
	}
	static divideComponents(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r;
	}
	static add(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r;
	}
	static subtract(e, t, r) {
		return x.typeOf.object("left", e), x.typeOf.object("right", t), x.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r;
	}
	static multiplyByScalar(e, t, r) {
		return x.typeOf.object("cartesian", e), x.typeOf.number("scalar", t), x.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r;
	}
	static divideByScalar(e, t, r) {
		return x.typeOf.object("cartesian", e), x.typeOf.number("scalar", t), x.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r;
	}
	static negate(e, t) {
		return x.typeOf.object("cartesian", e), x.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t;
	}
	static abs(e, t) {
		return x.typeOf.object("cartesian", e), x.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t;
	}
	static lerp(t, r, n, o) {
		return x.typeOf.object("start", t), x.typeOf.object("end", r), x.typeOf.number("t", n), x.typeOf.object("result", o), e.multiplyByScalar(r, n, Re), o = e.multiplyByScalar(t, 1 - n, o), e.add(Re, o, o);
	}
	static angleBetween(t, r) {
		return x.typeOf.object("left", t), x.typeOf.object("right", r), e.normalize(t, Ie), e.normalize(r, Le), L.acosClamped(e.dot(Ie, Le));
	}
	static mostOrthogonalAxis(t, r) {
		x.typeOf.object("cartesian", t), x.typeOf.object("result", r);
		const n = e.normalize(t, Te);
		return e.abs(n, n), n.x <= n.y ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Y, r);
	}
	static equals(e, t) {
		return e === t || F(e) && F(t) && e.x === t.x && e.y === t.y;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || F(e) && F(t) && L.equalsEpsilon(e.x, t.x, r, n) && L.equalsEpsilon(e.y, t.y, r, n);
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
ze.fromCartesian3 = ze.clone, ze.fromCartesian4 = ze.clone, ze.packedLength = 2, ze.fromArray = ze.unpack;
const xe = new ze(), Re = new ze(), Ie = new ze(), Le = new ze(), Te = new ze();
function Ne(e, t) {
	e = e ?? 0, this._near = e, t = t ?? Number.MAX_VALUE, this._far = t;
}
ze.ZERO = Object.freeze(new ze(0, 0)), ze.ONE = Object.freeze(new ze(1, 1)), ze.UNIT_X = Object.freeze(new ze(1, 0)), ze.UNIT_Y = Object.freeze(new ze(0, 1)), Object.defineProperties(Ne.prototype, {
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
	if (!F(e)) throw new z("value is required");
	if (!F(t)) throw new z("array is required");
	return r = r ?? 0, t[r++] = e.near, t[r] = e.far, t;
}, Ne.unpack = function(e, t, r) {
	if (!F(e)) throw new z("array is required");
	return t = t ?? 0, F(r) || (r = new Ne()), r.near = e[t++], r.far = e[t], r;
}, Ne.equals = function(e, t) {
	return e === t || F(e) && F(t) && e.near === t.near && e.far === t.far;
}, Ne.clone = function(e, t) {
	if (F(e)) return F(t) || (t = new Ne()), t.near = e.near, t.far = e.far, t;
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
];
var ve = class e {
	static from(t) {
		if (!(t instanceof ArrayBuffer)) throw new Error("Data must be an instance of ArrayBuffer.");
		const [r, n] = new Uint8Array(t, 0, 2);
		if (219 !== r) throw new Error("Data does not appear to be in a KDBush format.");
		const o = n >> 4;
		if (1 !== o) throw new Error(`Got v${o} data when expected v1.`);
		const i = Pe[15 & n];
		if (!i) throw new Error("Unrecognized array type.");
		const [s] = new Uint16Array(t, 2, 1), [a] = new Uint32Array(t, 4, 1);
		return new e(a, s, i, t);
	}
	constructor(e, t = 64, r = Float64Array, n) {
		if (isNaN(e) || e < 0) throw new Error(`Unpexpected numItems value: ${e}.`);
		this.numItems = +e, this.nodeSize = Math.min(Math.max(+t, 2), 65535), this.ArrayType = r, this.IndexArrayType = e < 65536 ? Uint16Array : Uint32Array;
		const o = Pe.indexOf(this.ArrayType), i = 2 * e * this.ArrayType.BYTES_PER_ELEMENT, s = e * this.IndexArrayType.BYTES_PER_ELEMENT, a = (8 - s % 8) % 8;
		if (o < 0) throw new Error(`Unexpected typed array class: ${r}.`);
		n && n instanceof ArrayBuffer ? (this.data = n, this.ids = new this.IndexArrayType(this.data, 8, e), this.coords = new this.ArrayType(this.data, 8 + s + a, 2 * e), this._pos = 2 * e, this._finished = !0) : (this.data = new ArrayBuffer(8 + i + s + a), this.ids = new this.IndexArrayType(this.data, 8, e), this.coords = new this.ArrayType(this.data, 8 + s + a, 2 * e), this._pos = 0, this._finished = !1, new Uint8Array(this.data, 0, 2).set([219, 16 + o]), new Uint16Array(this.data, 2, 1)[0] = t, new Uint32Array(this.data, 4, 1)[0] = e);
	}
	add(e, t) {
		const r = this._pos >> 1;
		return this.ids[r] = r, this.coords[this._pos++] = e, this.coords[this._pos++] = t, r;
	}
	finish() {
		const e = this._pos >> 1;
		if (e !== this.numItems) throw new Error(`Added ${e} items when expected ${this.numItems}.`);
		return Ue(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0), this._finished = !0, this;
	}
	range(e, t, r, n) {
		if (!this._finished) throw new Error("Data not yet indexed - call index.finish().");
		const { ids: o, coords: i, nodeSize: s } = this, a = [
			0,
			o.length - 1,
			0
		], l = [];
		for (; a.length;) {
			const f = a.pop() || 0, u = a.pop() || 0, c = a.pop() || 0;
			if (u - c <= s) {
				for (let s = c; s <= u; s++) {
					const a = i[2 * s], f = i[2 * s + 1];
					a >= e && a <= r && f >= t && f <= n && l.push(o[s]);
				}
				continue;
			}
			const h = c + u >> 1, p = i[2 * h], m = i[2 * h + 1];
			p >= e && p <= r && m >= t && m <= n && l.push(o[h]), (0 === f ? e <= p : t <= m) && (a.push(c), a.push(h - 1), a.push(1 - f)), (0 === f ? r >= p : n >= m) && (a.push(h + 1), a.push(u), a.push(1 - f));
		}
		return l;
	}
	within(e, t, r) {
		if (!this._finished) throw new Error("Data not yet indexed - call index.finish().");
		const { ids: n, coords: o, nodeSize: i } = this, s = [
			0,
			n.length - 1,
			0
		], a = [], l = r * r;
		for (; s.length;) {
			const f = s.pop() || 0, u = s.pop() || 0, c = s.pop() || 0;
			if (u - c <= i) {
				for (let r = c; r <= u; r++) We(o[2 * r], o[2 * r + 1], e, t) <= l && a.push(n[r]);
				continue;
			}
			const h = c + u >> 1, p = o[2 * h], m = o[2 * h + 1];
			We(p, m, e, t) <= l && a.push(n[h]), (0 === f ? e - r <= p : t - r <= m) && (s.push(c), s.push(h - 1), s.push(1 - f)), (0 === f ? e + r >= p : t + r >= m) && (s.push(h + 1), s.push(u), s.push(1 - f));
		}
		return a;
	}
};
function Ue(e, t, r, n, o, i) {
	if (o - n <= r) return;
	const s = n + o >> 1;
	qe(e, t, s, n, o, i), Ue(e, t, r, n, s - 1, 1 - i), Ue(e, t, r, s + 1, o, 1 - i);
}
function qe(e, t, r, n, o, i) {
	for (; o > n;) {
		if (o - n > 600) {
			const s = o - n + 1, a = r - n + 1, l = Math.log(s), f = .5 * Math.exp(2 * l / 3), u = .5 * Math.sqrt(l * f * (s - f) / s) * (a - s / 2 < 0 ? -1 : 1);
			qe(e, t, r, Math.max(n, Math.floor(r - a * f / s + u)), Math.min(o, Math.floor(r + (s - a) * f / s + u)), i);
		}
		const s = t[2 * r + i];
		let a = n, l = o;
		for (Ge(e, t, n, r), t[2 * o + i] > s && Ge(e, t, n, o); a < l;) {
			for (Ge(e, t, a, l), a++, l--; t[2 * a + i] < s;) a++;
			for (; t[2 * l + i] > s;) l--;
		}
		t[2 * n + i] === s ? Ge(e, t, n, l) : (l++, Ge(e, t, l, o)), l <= r && (n = l + 1), r <= l && (o = l - 1);
	}
}
function Ge(e, t, r, n) {
	ke(e, r, n), ke(t, 2 * r, 2 * n), ke(t, 2 * r + 1, 2 * n + 1);
}
function ke(e, t, r) {
	const n = e[t];
	e[t] = e[r], e[r] = n;
}
function We(e, t, r, n) {
	const o = e - r, i = t - n;
	return o * o + i * i;
}
function $e(e, t) {
	return toString.call(e) === `[object ${t}]`;
}
function He(e) {
	return $e(e, "String");
}
function Ye(e) {
	return $e(e, "Number");
}
function Ve(e) {
	return void 0 !== e;
}
function Ke(e = {}, t = {}) {
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
			return this._buff = t - 64 < l ? new Uint8Array(a.buffer.slice(t - 64)) : new Uint8Array(0), this;
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
			return this._buff = new Uint8Array(0), this._length = 0, this._hash = [
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
				for (n = (e = t - 64 < f ? e.subarray(t - 64) : new Uint8Array(0)).length, i = [
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
var Ze = class e {
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
		if (Ye(e.scale) && (t.scale = e.scale), Ye(e.minLevel) && (t.minLevel = e.minLevel), Ye(e.maxLevel) && (t.maxLevel = e.maxLevel), Ye(e.near) && (t.near = e.near), Ye(e.far) && (t.far = e.far), Ve(e.fontSize) || He(e.fontFamily)) {
			const r = e.fontSize ?? 10, n = e.fontFamily ?? "宋体";
			t.font = r + "px " + n;
		}
		if (e.fontColor && (t.fillColor = Oe.fromCssColorString(e.fontColor)), He(e.backgroundColor) && (t.showBackground = !0, t.backgroundColor = Oe.fromCssColorString(e.backgroundColor), t.backgroundPadding = new ze(e.backgroundPadding, e.backgroundPadding)), e.outlineColor && (t.style = Be.FILL_AND_OUTLINE, t.outlineColor = Oe.fromCssColorString(e.outlineColor).withAlpha(e.outlineAlpha ?? 1), t.outlineWidth = e.outlineWidth ?? 2), e.imgUrl) {
			t.image = e.imgUrl, t.width = e.imgWidth, t.height = e.imgHeight;
			t.pixelOffset = new ze(0, Ye(e.offset) ? e.offset : 0);
		} else "" === e.imgUrl && (t.image = void 0);
		return t;
	}
	static fromDefaultOption(e) {
		const t = {
			show: !0,
			style: Be.FILL,
			pixelOffset: ze.ZERO,
			eyeOffset: _.ZERO,
			horizontalOrigin: De.CENTER,
			verticalOrigin: Me.CENTER,
			heightReference: _e.CLAMP_TO_GROUND,
			distanceDisplayCondition: new Ne(0, 2e7),
			disableDepthTestDistance: 1e8
		};
		if (Ye(e.scale) && (t.scale = e.scale), Ye(e.minLevel) && (t.minLevel = e.minLevel), Ye(e.maxLevel) && (t.maxLevel = e.maxLevel), Ve(e.fontSize) || He(e.fontFamily)) {
			const r = e.fontSize ?? 10, n = e.fontFamily ?? "宋体";
			t.font = r + "px " + n;
		}
		if (e.fontColor && (t.fillColor = Oe.fromCssColorString(e.fontColor)), He(e.backgroundColor) && (t.showBackground = !0, t.backgroundColor = Oe.fromCssColorString(e.backgroundColor), t.backgroundPadding = new ze(e.backgroundPadding, e.backgroundPadding)), e.outlineColor && (t.style = Be.FILL_AND_OUTLINE, t.outlineColor = Oe.fromCssColorString(e.outlineColor).withAlpha(e.outlineAlpha ?? 1), t.outlineWidth = e.outlineWidth ?? 2), e.imgUrl) {
			t.image = e.imgUrl, t.width = e.imgWidth, t.height = e.imgHeight;
			t.pixelOffset = new ze(0, Ye(e.offset) ? e.offset : 0);
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
			fillColor: Oe.fromCssColorString(this.fontColor),
			style: Be.FILL,
			scale: this.scale,
			pixelOffset: ze.ZERO,
			eyeOffset: _.ZERO,
			horizontalOrigin: De.CENTER,
			verticalOrigin: Me.CENTER,
			heightReference: _e.CLAMP_TO_GROUND,
			distanceDisplayCondition: new Ne(0, 2e7),
			disableDepthTestDistance: 1e8
		};
		Ye(this.weight) && (e.eyeOffset = new _(0, 0, -100 * this.weight)), this.backgroundColor && (e.showBackground = !0, e.backgroundColor = Oe.fromCssColorString(this.backgroundColor), e.backgroundPadding = new ze(this.backgroundPadding ?? 7, this.backgroundPadding ?? 5)), this.outlineColor && (e.style = Be.FILL_AND_OUTLINE, e.outlineColor = Oe.fromCssColorString(this.outlineColor).withAlpha(this.outlineAlpha ?? 1), e.outlineWidth = this.outlineWidth ?? 2);
		let t = 0;
		return Ye(this.offset) && (t = this.offset, e.pixelOffset = new ze(0, t)), this.imgUrl && (e.image = this.imgUrl, e.width = this.imgWidth, e.height = this.imgHeight), e;
	}
	getBillboardOption() {
		return this.imgUrl ? {
			image: this.imgUrl,
			width: this.imgWidth,
			height: this.imgHeight
		} : {};
	}
}, Qe = ((e, r) => {
	let n = {};
	for (var o in e) t(n, o, {
		get: e[o],
		enumerable: !0
	});
	return r || t(n, Symbol.toStringTag, { value: "Module" }), n;
})({
	cancelPromise: () => rt,
	checkRectangleNoIntersect: () => lt,
	clear: () => ct,
	deleteLabelRectangle: () => ft,
	filterByBounds: () => nt,
	getFilterPointsList: () => ot,
	getLabelEntities: () => it,
	getLabelPointList: () => at,
	isOverlapping: () => ut,
	isPointOnFrontOfGlobe: () => st,
	loadLabelPoints: () => tt
});
let Xe = /* @__PURE__ */ new Map(), Je = /* @__PURE__ */ new Map();
function et(e, t) {
	if (t && t.length > 0) {
		let r, n;
		const o = t.length;
		for (let i = 0; i < o; i++) {
			const o = t[i];
			if (o && o.includeValue === e) {
				n = o.fontSize, r = r ? Ke(r, Ze.fromOption(o)) : Ze.fromOption(o);
				break;
			}
		}
		return {
			childOptions: r,
			childFontSize: n
		};
	}
}
async function tt(e, t, r) {
	if (!e || Xe.has(e)) return;
	let n = await (await fetch(t)).json();
	if (!n) return;
	const o = n.features;
	let i = r.minLevel ?? 1, s = r.maxLevel ?? 18;
	const a = r.labelField, l = r.filterField ?? a, f = function(e) {
		const t = Ze.fromDefaultOption(e);
		let r;
		return He(e.excludeValue) && (r = e.excludeValue.split(",")), {
			baseLabelOptions: t,
			exclude: r
		};
	}(r), u = f.exclude, c = 1.2 * (r.fontSize ?? 12), h = r.children;
	if (o) {
		const t = o.length, r = new ve(t), p = new Array();
		for (let e = 0; e < t; e++) {
			const t = o[e], n = t.properties;
			if (n) {
				const o = n[a], f = n[l], m = n.minl, d = n.maxl, y = t.geometry.coordinates;
				let g, b = c;
				if (u && u.indexOf(f) >= 0) {
					const e = et(o, h);
					e && (e.childFontSize && (b = 1.2 * e.childFontSize), e.childOptions && (g = e.childOptions));
				}
				const O = {
					id: e,
					name: o,
					minZoom: m,
					maxZoom: d,
					position: _.fromDegrees(y[0], y[1]),
					textWidth: b * o.length,
					textHeight: b,
					childOptions: g
				};
				r.add(y[0], y[1]), p.push(O), Ye(m) && m < i && (i = m), Ye(d) && d > s && (s = d);
			}
		}
		return r.finish(), Xe.set(e, {
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
function rt(e) {
	Je.set(e, !0);
}
function nt(e, t, r) {
	if (!t || !Xe.has(e)) return;
	const n = Xe.get(e);
	if (!n) return;
	Je.set(e, !1);
	const o = L.toDegrees(t.west), i = L.toDegrees(t.east), s = L.toDegrees(t.north), a = L.toDegrees(t.south), l = n.indexKDB.range(o, a, i, s);
	if (Je.get(e)) throw l.length = 0, /* @__PURE__ */ new Error("0");
	if (null != r) {
		const t = l.length, o = [];
		for (let i = 0; i < t; i++) {
			if (Je.get(e)) throw o.length = 0, l.length = 0, /* @__PURE__ */ new Error("0");
			const t = l[i], s = n.ptList[t];
			null != s.minZoom && s.maxZoom ? r >= s.minZoom && r <= s.maxZoom && o.push(t) : o.push(t);
		}
		return l.length = 0, o;
	}
	return l;
}
function ot(e, t) {
	if (!Xe.has(e)) return;
	const r = Xe.get(e);
	if (!r) return;
	const n = [], o = t.length;
	for (let i = 0; i < o; i++) {
		const e = t[i], o = r.ptList[e];
		n.push(o);
	}
	return n;
}
function it(e, t) {
	if (!Xe.has(e)) return;
	const r = Xe.get(e);
	if (!r) return;
	const n = r.baseLabelOptions, o = [], i = t.length;
	for (let s = 0; s < i; s++) {
		const e = t[s], i = r.ptList[e];
		let a = n;
		i.childOptions && (a = Ke({ ...n }, i.childOptions));
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
function st(e, t) {
	return !(_.distance(e, t) > 6371e3);
}
function at(e, t) {
	if (!Xe.has(e)) return;
	const r = Xe.get(e);
	return r ? t.map((e) => r.ptList[e]) : void 0;
}
function lt(e, t, r) {
	const n = Xe.get(e);
	if (!n) return !1;
	const o = n.idRectMap;
	let i = !1;
	for (let [s, a] of o) if (a && (i = ut(a, t), i)) break;
	return i || o.set(r, t), i;
}
function ft(e, t) {
	const r = Xe.get(e);
	if (!r) return !1;
	const n = r.idRectMap;
	return !!n && n.delete(t);
}
function ut(e, t) {
	return !(e.x > t.x + t.width || t.x > e.x + e.width || e.y > t.y + t.height || t.y > e.y + e.height);
}
function ct(e) {
	if (Xe.has(e)) {
		const t = Xe.get(e);
		t && (t.ptList.length = 0, t.indexKDB.data = null, t.idRectMap.clear(), t.baseLabelOptions = void 0, Xe.delete(e));
	}
}
m(Qe);
