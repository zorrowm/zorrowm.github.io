var e = Object.create, t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, i = Object.getPrototypeOf, o = Object.prototype.hasOwnProperty, a = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (a, s, u) => (u = null != a ? e(i(a)) : {}, ((e, i, a, s) => {
	if (i && "object" == typeof i || "function" == typeof i) for (var u, c = n(i), l = 0, f = c.length; l < f; l++) u = c[l], o.call(e, u) || void 0 === u || t(e, u, {
		get: ((e) => i[e]).bind(null, u),
		enumerable: !(s = r(i, u)) || s.enumerable
	});
	return e;
})(!s && a && a.__esModule ? u : t(u, "default", {
	value: a,
	enumerable: !0
}), a)), u = ((e) => "undefined" != typeof require ? require : "undefined" != typeof Proxy ? new Proxy(e, { get: (e, t) => ("undefined" != typeof require ? require : e)[t] }) : e)(function(e) {
	if ("undefined" != typeof require) return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/ const c = Symbol("Comlink.proxy"), l = Symbol("Comlink.endpoint"), f = Symbol("Comlink.releaseProxy"), h = Symbol("Comlink.finalizer"), p = Symbol("Comlink.thrown"), m = (e) => "object" == typeof e && null !== e || "function" == typeof e, d = new Map([["proxy", {
	canHandle: (e) => m(e) && e[c],
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
		}), T(e, t, [], void 0);
	}(e))
}], ["throw", {
	canHandle: (e) => m(e) && p in e,
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
	t.addEventListener("message", function n(i) {
		if (!i || !i.data) return;
		if (!function(e, t) {
			for (const r of e) {
				if (t === r || "*" === r) return !0;
				if (r instanceof RegExp && r.test(t)) return !0;
			}
			return !1;
		}(r, i.origin)) return void console.warn(`Invalid origin '${i.origin}' for comlink proxy`);
		const { id: o, type: a, path: s } = Object.assign({ path: [] }, i.data), u = (i.data.argumentList || []).map(R);
		let l;
		try {
			const t = s.slice(0, -1).reduce((e, t) => e[t], e), r = s.reduce((e, t) => e[t], e);
			switch (a) {
				case "GET":
					l = r;
					break;
				case "SET":
					t[s.slice(-1)[0]] = R(i.data.value), l = !0;
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
							return A.set(e, t), e;
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
			const [i, s] = x(r);
			t.postMessage(Object.assign(Object.assign({}, i), { id: o }), s), "RELEASE" === a && (t.removeEventListener("message", n), _(t), h in e && "function" == typeof e[h] && e[h]());
		}).catch((e) => {
			const [r, n] = x({
				value: /* @__PURE__ */ new TypeError("Unserializable return value"),
				[p]: 0
			});
			t.postMessage(Object.assign(Object.assign({}, r), { id: o }), n);
		});
	}), t.start && t.start();
}
function _(e) {
	(function(e) {
		return "MessagePort" === e.constructor.name;
	})(e) && e.close();
}
function g(e) {
	if (e) throw new Error("Proxy has been released and is not useable");
}
function E(e) {
	return S(e, /* @__PURE__ */ new Map(), { type: "RELEASE" }).then(() => {
		_(e);
	});
}
const b = /* @__PURE__ */ new WeakMap(), w = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
	const t = (b.get(e) || 0) - 1;
	b.set(e, t), 0 === t && E(e);
});
function T(e, t, r = [], n = function() {}) {
	let i = !1;
	const o = new Proxy(n, {
		get(n, a) {
			if (g(i), a === f) return () => {
				(function(e) {
					w && w.unregister(e);
				})(o), E(e), t.clear(), i = !0;
			};
			if ("then" === a) {
				if (0 === r.length) return { then: () => o };
				const n = S(e, t, {
					type: "GET",
					path: r.map((e) => e.toString())
				}).then(R);
				return n.then.bind(n);
			}
			return T(e, t, [...r, a]);
		},
		set(n, o, a) {
			g(i);
			const [s, u] = x(a);
			return S(e, t, {
				type: "SET",
				path: [...r, o].map((e) => e.toString()),
				value: s
			}, u).then(R);
		},
		apply(n, o, a) {
			g(i);
			const s = r[r.length - 1];
			if (s === l) return S(e, t, { type: "ENDPOINT" }).then(R);
			if ("bind" === s) return T(e, t, r.slice(0, -1));
			const [u, c] = O(a);
			return S(e, t, {
				type: "APPLY",
				path: r.map((e) => e.toString()),
				argumentList: u
			}, c).then(R);
		},
		construct(n, o) {
			g(i);
			const [a, s] = O(o);
			return S(e, t, {
				type: "CONSTRUCT",
				path: r.map((e) => e.toString()),
				argumentList: a
			}, s).then(R);
		}
	});
	return function(e, t) {
		const r = (b.get(t) || 0) + 1;
		b.set(t, r), w && w.register(e, t, e);
	}(o, e), o;
}
function O(e) {
	const t = e.map(x);
	return [t.map((e) => e[0]), (r = t.map((e) => e[1]), Array.prototype.concat.apply([], r))];
	var r;
}
const A = /* @__PURE__ */ new WeakMap();
function x(e) {
	for (const [t, r] of d) if (r.canHandle(e)) {
		const [n, i] = r.serialize(e);
		return [{
			type: "HANDLER",
			name: t,
			value: n
		}, i];
	}
	return [{
		type: "RAW",
		value: e
	}, A.get(e) || []];
}
function R(e) {
	switch (e.type) {
		case "HANDLER": return d.get(e.name).deserialize(e.value);
		case "RAW": return e.value;
	}
}
function S(e, t, r, n) {
	return new Promise((i) => {
		const o = new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
		t.set(o, i), e.start && e.start(), e.postMessage(Object.assign({ id: o }, r), n);
	});
}
var I = class {
	name;
	ItemsList;
	constructor(e) {
		this.name = e, this.ItemsList = new Array();
	}
	allowCrossLevel = !1;
	_currentLevel = -1;
	set CurrentLevel(e) {
		this._currentLevel >= 0 && this._currentLevel !== e && (this._currentLevel = e, this.allowCrossLevel || this.removeAll()), this._currentLevel = e;
	}
	fields = { name: "String" };
	alpha = 0;
	annoFieldName = "name";
	geoType = 1;
	isVisible = !0;
	maxLevel = 22;
	minLevel = 0;
	style;
	billboardCollection = void 0;
	primitiveCollection = void 0;
	orderFunc = void 0;
	styleFunc = void 0;
	removeAll(e) {
		this.billboardCollection && (this.billboardCollection.removeAll(), e && e.scene.primitives.remove(this.billboardCollection)), this.primitiveCollection && (this.primitiveCollection.removeAll(), e && e.scene.primitives.remove(this.primitiveCollection));
	}
	show(e) {
		this.billboardCollection && (this.billboardCollection.show = e), this.primitiveCollection && (this.primitiveCollection.show = e);
	}
};
function C(e) {
	return null != e;
}
function N(e) {
	let t;
	this.name = "DeveloperError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
C(Object.create) && (N.prototype = Object.create(Error.prototype), N.prototype.constructor = N), N.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return C(this.stack) && (e += `\n${this.stack.toString()}`), e;
}, N.throwInstantiationError = function() {
	throw new N("This function defines an interface and should not be called directly.");
};
const v = {};
function P(e, t, r) {
	return `Expected ${r} to be typeof ${t}, actual typeof was ${e}`;
}
v.typeOf = {}, v.defined = function(e, t) {
	if (!C(t)) throw new N(function(e) {
		return `${e} is required, actual value was undefined`;
	}(e));
}, v.typeOf.func = function(e, t) {
	if ("function" != typeof t) throw new N(P(typeof t, "function", e));
}, v.typeOf.string = function(e, t) {
	if ("string" != typeof t) throw new N(P(typeof t, "string", e));
}, v.typeOf.number = function(e, t) {
	if ("number" != typeof t) throw new N(P(typeof t, "number", e));
}, v.typeOf.number.lessThan = function(e, t, r) {
	if (v.typeOf.number(e, t), t >= r) throw new N(`Expected ${e} to be less than ${r}, actual value was ${t}`);
}, v.typeOf.number.lessThanOrEquals = function(e, t, r) {
	if (v.typeOf.number(e, t), t > r) throw new N(`Expected ${e} to be less than or equal to ${r}, actual value was ${t}`);
}, v.typeOf.number.greaterThan = function(e, t, r) {
	if (v.typeOf.number(e, t), t <= r) throw new N(`Expected ${e} to be greater than ${r}, actual value was ${t}`);
}, v.typeOf.number.greaterThanOrEquals = function(e, t, r) {
	if (v.typeOf.number(e, t), t < r) throw new N(`Expected ${e} to be greater than or equal to ${r}, actual value was ${t}`);
}, v.typeOf.object = function(e, t) {
	if ("object" != typeof t) throw new N(P(typeof t, "object", e));
}, v.typeOf.bool = function(e, t) {
	if ("boolean" != typeof t) throw new N(P(typeof t, "boolean", e));
}, v.typeOf.bigint = function(e, t) {
	if ("bigint" != typeof t) throw new N(P(typeof t, "bigint", e));
}, v.typeOf.number.equals = function(e, t, r, n) {
	if (v.typeOf.number(e, r), v.typeOf.number(t, n), r !== n) throw new N(`${e} must be equal to ${t}, the actual values are ${r} and ${n}`);
};
var M = s(a((e, t) => {
	var r = function(e) {
		null == e && (e = (/* @__PURE__ */ new Date()).getTime()), this.N = 624, this.M = 397, this.MATRIX_A = 2567483615, this.UPPER_MASK = 2147483648, this.LOWER_MASK = 2147483647, this.mt = new Array(this.N), this.mti = this.N + 1, e.constructor == Array ? this.init_by_array(e, e.length) : this.init_seed(e);
	};
	r.prototype.init_seed = function(e) {
		for (this.mt[0] = e >>> 0, this.mti = 1; this.mti < this.N; this.mti++) e = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30, this.mt[this.mti] = (1812433253 * ((4294901760 & e) >>> 16) << 16) + 1812433253 * (65535 & e) + this.mti, this.mt[this.mti] >>>= 0;
	}, r.prototype.init_by_array = function(e, t) {
		var r, n, i;
		for (this.init_seed(19650218), r = 1, n = 0, i = this.N > t ? this.N : t; i; i--) {
			var o = this.mt[r - 1] ^ this.mt[r - 1] >>> 30;
			this.mt[r] = (this.mt[r] ^ (1664525 * ((4294901760 & o) >>> 16) << 16) + 1664525 * (65535 & o)) + e[n] + n, this.mt[r] >>>= 0, n++, ++r >= this.N && (this.mt[0] = this.mt[this.N - 1], r = 1), n >= t && (n = 0);
		}
		for (i = this.N - 1; i; i--) o = this.mt[r - 1] ^ this.mt[r - 1] >>> 30, this.mt[r] = (this.mt[r] ^ (1566083941 * ((4294901760 & o) >>> 16) << 16) + 1566083941 * (65535 & o)) - r, this.mt[r] >>>= 0, ++r >= this.N && (this.mt[0] = this.mt[this.N - 1], r = 1);
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
	if (!C(e)) throw new N("degrees is required.");
	return e * L.RADIANS_PER_DEGREE;
}, L.toDegrees = function(e) {
	if (!C(e)) throw new N("radians is required.");
	return e * L.DEGREES_PER_RADIAN;
}, L.convertLongitudeRange = function(e) {
	if (!C(e)) throw new N("angle is required.");
	const t = L.TWO_PI, r = e - Math.floor(e / t) * t;
	return r < -Math.PI ? r + t : r >= Math.PI ? r - t : r;
}, L.clampToLatitudeRange = function(e) {
	if (!C(e)) throw new N("angle is required.");
	return L.clamp(e, -1 * L.PI_OVER_TWO, L.PI_OVER_TWO);
}, L.negativePiToPi = function(e) {
	if (!C(e)) throw new N("angle is required.");
	return e >= -L.PI && e <= L.PI ? e : L.zeroToTwoPi(e + L.PI) - L.PI;
}, L.zeroToTwoPi = function(e) {
	if (!C(e)) throw new N("angle is required.");
	if (e >= 0 && e <= L.TWO_PI) return e;
	const t = L.mod(e, L.TWO_PI);
	return Math.abs(t) < L.EPSILON14 && Math.abs(e) > L.EPSILON14 ? L.TWO_PI : t;
}, L.mod = function(e, t) {
	if (!C(e)) throw new N("m is required.");
	if (!C(t)) throw new N("n is required.");
	if (0 === t) throw new N("divisor cannot be 0.");
	return L.sign(e) === L.sign(t) && Math.abs(e) < Math.abs(t) ? e : (e % t + t) % t;
}, L.equalsEpsilon = function(e, t, r, n) {
	if (!C(e)) throw new N("left is required.");
	if (!C(t)) throw new N("right is required.");
	r = r ?? 0, n = n ?? r;
	const i = Math.abs(e - t);
	return i <= n || i <= r * Math.max(Math.abs(e), Math.abs(t));
}, L.lessThan = function(e, t, r) {
	if (!C(e)) throw new N("first is required.");
	if (!C(t)) throw new N("second is required.");
	if (!C(r)) throw new N("absoluteEpsilon is required.");
	return e - t < -r;
}, L.lessThanOrEquals = function(e, t, r) {
	if (!C(e)) throw new N("first is required.");
	if (!C(t)) throw new N("second is required.");
	if (!C(r)) throw new N("absoluteEpsilon is required.");
	return e - t < r;
}, L.greaterThan = function(e, t, r) {
	if (!C(e)) throw new N("first is required.");
	if (!C(t)) throw new N("second is required.");
	if (!C(r)) throw new N("absoluteEpsilon is required.");
	return e - t > r;
}, L.greaterThanOrEquals = function(e, t, r) {
	if (!C(e)) throw new N("first is required.");
	if (!C(t)) throw new N("second is required.");
	if (!C(r)) throw new N("absoluteEpsilon is required.");
	return e - t > -r;
};
const F = [1];
L.factorial = function(e) {
	if ("number" != typeof e || e < 0) throw new N("A number greater than or equal to 0 is required.");
	const t = F.length;
	if (e >= t) {
		let r = F[t - 1];
		for (let n = t; n <= e; n++) {
			const e = r * n;
			F.push(e), r = e;
		}
	}
	return F[e];
}, L.incrementWrap = function(e, t, r) {
	if (r = r ?? 0, !C(e)) throw new N("n is required.");
	if (t <= r) throw new N("maximumValue must be greater than minimumValue.");
	return ++e > t && (e = r), e;
}, L.isPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new N("A number between 0 and (2^32)-1 is required.");
	return 0 !== e && !(e & e - 1);
}, L.nextPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 2147483648) throw new N("A number between 0 and 2^31 is required.");
	return --e, e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ++e;
}, L.previousPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new N("A number between 0 and (2^32)-1 is required.");
	return e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ((e |= e >> 32) >>> 0) - (e >>> 1);
}, L.clamp = function(e, t, r) {
	return v.typeOf.number("value", e), v.typeOf.number("min", t), v.typeOf.number("max", r), e < t ? t : e > r ? r : e;
};
let D = new M.default();
L.setRandomNumberSeed = function(e) {
	if (!C(e)) throw new N("seed is required.");
	D = new M.default(e);
}, L.nextRandomNumber = function() {
	return D.random();
}, L.randomBetween = function(e, t) {
	return L.nextRandomNumber() * (t - e) + e;
}, L.acosClamped = function(e) {
	if (!C(e)) throw new N("value is required.");
	return Math.acos(L.clamp(e, -1, 1));
}, L.asinClamped = function(e) {
	if (!C(e)) throw new N("value is required.");
	return Math.asin(L.clamp(e, -1, 1));
}, L.chordLength = function(e, t) {
	if (!C(e)) throw new N("angle is required.");
	if (!C(t)) throw new N("radius is required.");
	return 2 * t * Math.sin(.5 * e);
}, L.logBase = function(e, t) {
	if (!C(e)) throw new N("number is required.");
	if (!C(t)) throw new N("base is required.");
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
	return v.typeOf.number("x", e), e * (-.1784 * Math.abs(e) - .0663 * e * e + 1.0301);
}, L.fastApproximateAtan2 = function(e, t) {
	let r;
	v.typeOf.number("x", e), v.typeOf.number("y", t);
	let n = Math.abs(e);
	r = Math.abs(t);
	const i = Math.max(n, r);
	r = Math.min(n, r);
	const o = r / i;
	if (isNaN(o)) throw new N("either x or y must be nonzero");
	return n = L.fastApproximateAtan(o), n = Math.abs(t) > Math.abs(e) ? L.PI_OVER_TWO - n : n, n = e < 0 ? L.PI - n : n, n = t < 0 ? -n : n, n;
};
var z = class e {
	constructor(e, t, r) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0;
	}
	static fromSpherical(t, r) {
		v.typeOf.object("spherical", t), C(r) || (r = new e());
		const n = t.clock, i = t.cone, o = t.magnitude ?? 1, a = o * Math.sin(i);
		return r.x = a * Math.cos(n), r.y = a * Math.sin(n), r.z = o * Math.cos(i), r;
	}
	static fromElements(t, r, n, i) {
		return C(i) ? (i.x = t, i.y = r, i.z = n, i) : new e(t, r, n);
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r) : new e(t.x, t.y, t.z);
	}
	static pack(e, t, r) {
		return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r] = e.z, t;
	}
	static unpack(t, r, n) {
		return v.defined("array", t), r = r ?? 0, C(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r], n;
	}
	static packArray(t, r) {
		v.defined("array", t);
		const n = t.length, i = 3 * n;
		if (C(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new N("If result is a typed array, it must have exactly array.length * 3 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 3 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (v.defined("array", t), v.typeOf.number.greaterThanOrEquals("array.length", t.length, 3), t.length % 3 != 0) throw new N("array length must be a multiple of 3.");
		const n = t.length;
		C(r) ? r.length = n / 3 : r = new Array(n / 3);
		for (let i = 0; i < n; i += 3) {
			const n = i / 3;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return v.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z);
	}
	static minimumComponent(e) {
		return v.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z);
	}
	static minimumByComponent(e, t, r) {
		return v.typeOf.object("first", e), v.typeOf.object("second", t), v.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r;
	}
	static maximumByComponent(e, t, r) {
		return v.typeOf.object("first", e), v.typeOf.object("second", t), v.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r;
	}
	static clamp(e, t, r, n) {
		v.typeOf.object("value", e), v.typeOf.object("min", t), v.typeOf.object("max", r), v.typeOf.object("result", n);
		const i = L.clamp(e.x, t.x, r.x), o = L.clamp(e.y, t.y, r.y), a = L.clamp(e.z, t.z, r.z);
		return n.x = i, n.y = o, n.z = a, n;
	}
	static magnitudeSquared(e) {
		return v.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return v.typeOf.object("left", t), v.typeOf.object("right", r), e.subtract(t, r, B), e.magnitude(B);
	}
	static distanceSquared(t, r) {
		return v.typeOf.object("left", t), v.typeOf.object("right", r), e.subtract(t, r, B), e.magnitudeSquared(B);
	}
	static normalize(t, r) {
		v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z)) throw new N("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z;
	}
	static multiplyComponents(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r;
	}
	static divideComponents(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r;
	}
	static add(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r;
	}
	static subtract(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r;
	}
	static multiplyByScalar(e, t, r) {
		return v.typeOf.object("cartesian", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r;
	}
	static divideByScalar(e, t, r) {
		return v.typeOf.object("cartesian", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r;
	}
	static negate(e, t) {
		return v.typeOf.object("cartesian", e), v.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t;
	}
	static abs(e, t) {
		return v.typeOf.object("cartesian", e), v.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t;
	}
	static lerp(t, r, n, i) {
		return v.typeOf.object("start", t), v.typeOf.object("end", r), v.typeOf.number("t", n), v.typeOf.object("result", i), e.multiplyByScalar(r, n, U), i = e.multiplyByScalar(t, 1 - n, i), e.add(U, i, i);
	}
	static angleBetween(t, r) {
		v.typeOf.object("left", t), v.typeOf.object("right", r), e.normalize(t, j), e.normalize(r, q);
		const n = e.dot(j, q), i = e.magnitude(e.cross(j, q, j));
		return Math.atan2(i, n);
	}
	static mostOrthogonalAxis(t, r) {
		v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = e.normalize(t, G);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Z, r) : n.y <= n.z ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_Z, r);
	}
	static projectVector(t, r, n) {
		v.defined("a", t), v.defined("b", r), v.defined("result", n);
		const i = e.dot(t, r) / e.dot(r, r);
		return e.multiplyByScalar(r, i, n);
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && e.x === t.x && e.y === t.y && e.z === t.z;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || C(e) && C(t) && L.equalsEpsilon(e.x, t.x, r, n) && L.equalsEpsilon(e.y, t.y, r, n) && L.equalsEpsilon(e.z, t.z, r, n);
	}
	static cross(e, t, r) {
		v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r);
		const n = e.x, i = e.y, o = e.z, a = t.x, s = t.y, u = t.z, c = i * u - o * s, l = o * a - n * u, f = n * s - i * a;
		return r.x = c, r.y = l, r.z = f, r;
	}
	static midpoint(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = .5 * (e.x + t.x), r.y = .5 * (e.y + t.y), r.z = .5 * (e.z + t.z), r;
	}
	static fromDegrees(t, r, n, i, o) {
		return v.typeOf.number("longitude", t), v.typeOf.number("latitude", r), t = L.toRadians(t), r = L.toRadians(r), e.fromRadians(t, r, n, i, o);
	}
	static fromRadians(t, r, n, i, o) {
		v.typeOf.number("longitude", t), v.typeOf.number("latitude", r), n = n ?? 0;
		const a = C(i) ? i.radiiSquared : e._ellipsoidRadiiSquared, s = Math.cos(r);
		k.x = s * Math.cos(t), k.y = s * Math.sin(t), k.z = Math.sin(r), k = e.normalize(k, k), e.multiplyComponents(a, k, W);
		const u = Math.sqrt(e.dot(k, W));
		return W = e.divideByScalar(W, u, W), k = e.multiplyByScalar(k, n, k), C(o) || (o = new e()), e.add(W, k, o);
	}
	static fromDegreesArray(t, r, n) {
		if (v.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new N("the number of coordinates must be a multiple of 2 and at least 2");
		const i = t.length;
		C(n) ? n.length = i / 2 : n = new Array(i / 2);
		for (let o = 0; o < i; o += 2) {
			const i = t[o], a = t[o + 1], s = o / 2;
			n[s] = e.fromDegrees(i, a, 0, r, n[s]);
		}
		return n;
	}
	static fromRadiansArray(t, r, n) {
		if (v.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new N("the number of coordinates must be a multiple of 2 and at least 2");
		const i = t.length;
		C(n) ? n.length = i / 2 : n = new Array(i / 2);
		for (let o = 0; o < i; o += 2) {
			const i = t[o], a = t[o + 1], s = o / 2;
			n[s] = e.fromRadians(i, a, 0, r, n[s]);
		}
		return n;
	}
	static fromDegreesArrayHeights(t, r, n) {
		if (v.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new N("the number of coordinates must be a multiple of 3 and at least 3");
		const i = t.length;
		C(n) ? n.length = i / 3 : n = new Array(i / 3);
		for (let o = 0; o < i; o += 3) {
			const i = t[o], a = t[o + 1], s = t[o + 2], u = o / 3;
			n[u] = e.fromDegrees(i, a, s, r, n[u]);
		}
		return n;
	}
	static fromRadiansArrayHeights(t, r, n) {
		if (v.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new N("the number of coordinates must be a multiple of 3 and at least 3");
		const i = t.length;
		C(n) ? n.length = i / 3 : n = new Array(i / 3);
		for (let o = 0; o < i; o += 3) {
			const i = t[o], a = t[o + 1], s = t[o + 2], u = o / 3;
			n[u] = e.fromRadians(i, a, s, r, n[u]);
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
z.fromCartesian4 = z.clone, z.packedLength = 3, z.fromArray = z.unpack;
const B = new z(), U = new z(), j = new z(), q = new z(), G = new z();
let k = new z(), W = new z();
z._ellipsoidRadiiSquared = new z(40680631590769, 40680631590769, 40408299984661.445), z.ZERO = Object.freeze(new z(0, 0, 0)), z.ONE = Object.freeze(new z(1, 1, 1)), z.UNIT_X = Object.freeze(new z(1, 0, 0)), z.UNIT_Y = Object.freeze(new z(0, 1, 0)), z.UNIT_Z = Object.freeze(new z(0, 0, 1));
var V = class e {
	constructor(e, t, r, n) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0, this.w = n ?? 0;
	}
	static fromElements(t, r, n, i, o) {
		return C(o) ? (o.x = t, o.y = r, o.z = n, o.w = i, o) : new e(t, r, n, i);
	}
	static fromColor(t, r) {
		return v.typeOf.object("color", t), C(r) ? (r.x = t.red, r.y = t.green, r.z = t.blue, r.w = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r.w = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static pack(e, t, r) {
		return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.z, t[r] = e.w, t;
	}
	static unpack(t, r, n) {
		return v.defined("array", t), r = r ?? 0, C(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r++], n.w = t[r], n;
	}
	static packArray(t, r) {
		v.defined("array", t);
		const n = t.length, i = 4 * n;
		if (C(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new N("If result is a typed array, it must have exactly array.length * 4 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 4 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (v.defined("array", t), v.typeOf.number.greaterThanOrEquals("array.length", t.length, 4), t.length % 4 != 0) throw new N("array length must be a multiple of 4.");
		const n = t.length;
		C(r) ? r.length = n / 4 : r = new Array(n / 4);
		for (let i = 0; i < n; i += 4) {
			const n = i / 4;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return v.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z, e.w);
	}
	static minimumComponent(e) {
		return v.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z, e.w);
	}
	static minimumByComponent(e, t, r) {
		return v.typeOf.object("first", e), v.typeOf.object("second", t), v.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r.w = Math.min(e.w, t.w), r;
	}
	static maximumByComponent(e, t, r) {
		return v.typeOf.object("first", e), v.typeOf.object("second", t), v.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r.w = Math.max(e.w, t.w), r;
	}
	static clamp(e, t, r, n) {
		v.typeOf.object("value", e), v.typeOf.object("min", t), v.typeOf.object("max", r), v.typeOf.object("result", n);
		const i = L.clamp(e.x, t.x, r.x), o = L.clamp(e.y, t.y, r.y), a = L.clamp(e.z, t.z, r.z), s = L.clamp(e.w, t.w, r.w);
		return n.x = i, n.y = o, n.z = a, n.w = s, n;
	}
	static magnitudeSquared(e) {
		return v.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return v.typeOf.object("left", t), v.typeOf.object("right", r), e.subtract(t, r, H), e.magnitude(H);
	}
	static distanceSquared(t, r) {
		return v.typeOf.object("left", t), v.typeOf.object("right", r), e.subtract(t, r, H), e.magnitudeSquared(H);
	}
	static normalize(t, r) {
		v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, r.w = t.w / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z) || isNaN(r.w)) throw new N("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z + e.w * t.w;
	}
	static multiplyComponents(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r.w = e.w * t.w, r;
	}
	static divideComponents(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r.w = e.w / t.w, r;
	}
	static add(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r.w = e.w + t.w, r;
	}
	static subtract(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r.w = e.w - t.w, r;
	}
	static multiplyByScalar(e, t, r) {
		return v.typeOf.object("cartesian", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r.w = e.w * t, r;
	}
	static divideByScalar(e, t, r) {
		return v.typeOf.object("cartesian", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r.w = e.w / t, r;
	}
	static negate(e, t) {
		return v.typeOf.object("cartesian", e), v.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
	}
	static abs(e, t) {
		return v.typeOf.object("cartesian", e), v.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t.w = Math.abs(e.w), t;
	}
	static lerp(t, r, n, i) {
		return v.typeOf.object("start", t), v.typeOf.object("end", r), v.typeOf.number("t", n), v.typeOf.object("result", i), e.multiplyByScalar(r, n, Y), i = e.multiplyByScalar(t, 1 - n, i), e.add(Y, i, i);
	}
	static mostOrthogonalAxis(t, r) {
		v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = e.normalize(t, X);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? n.x <= n.w ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_W, r) : n.z <= n.w ? e.clone(e.UNIT_Z, r) : e.clone(e.UNIT_W, r) : n.y <= n.z ? n.y <= n.w ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_W, r) : n.z <= n.w ? e.clone(e.UNIT_Z, r) : e.clone(e.UNIT_W, r);
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2] && e.w === t[r + 3];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || C(e) && C(t) && L.equalsEpsilon(e.x, t.x, r, n) && L.equalsEpsilon(e.y, t.y, r, n) && L.equalsEpsilon(e.z, t.z, r, n) && L.equalsEpsilon(e.w, t.w, r, n);
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
		return v.typeOf.number("value", t), C(r) || (r = new e()), $[0] = t, Q ? (r.x = K[0], r.y = K[1], r.z = K[2], r.w = K[3]) : (r.x = K[3], r.y = K[2], r.z = K[1], r.w = K[0]), r;
	}
	static unpackFloat(e) {
		return v.typeOf.object("packedFloat", e), Q ? (K[0] = e.x, K[1] = e.y, K[2] = e.z, K[3] = e.w) : (K[0] = e.w, K[1] = e.z, K[2] = e.y, K[3] = e.x), $[0];
	}
};
V.packedLength = 4, V.fromArray = V.unpack;
const H = new V(), Y = new V(), X = new V();
V.ZERO = Object.freeze(new V(0, 0, 0, 0)), V.ONE = Object.freeze(new V(1, 1, 1, 1)), V.UNIT_X = Object.freeze(new V(1, 0, 0, 0)), V.UNIT_Y = Object.freeze(new V(0, 1, 0, 0)), V.UNIT_Z = Object.freeze(new V(0, 0, 1, 0)), V.UNIT_W = Object.freeze(new V(0, 0, 0, 1));
const $ = new Float32Array(1), K = new Uint8Array($.buffer), Z = new Uint32Array([287454020]), Q = 68 === new Uint8Array(Z.buffer)[0], J = {};
J.EMPTY_OBJECT = Object.freeze({}), J.EMPTY_ARRAY = Object.freeze([]);
var ee = class e {
	constructor(e, t, r, n, i, o, a, s, u) {
		this[0] = e ?? 0, this[1] = n ?? 0, this[2] = a ?? 0, this[3] = t ?? 0, this[4] = i ?? 0, this[5] = s ?? 0, this[6] = r ?? 0, this[7] = o ?? 0, this[8] = u ?? 0;
	}
	static pack(e, t, r) {
		return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t;
	}
	static unpack(t, r, n) {
		return v.defined("array", t), r = r ?? 0, C(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n[4] = t[r++], n[5] = t[r++], n[6] = t[r++], n[7] = t[r++], n[8] = t[r++], n;
	}
	static packArray(t, r) {
		v.defined("array", t);
		const n = t.length, i = 9 * n;
		if (C(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new N("If result is a typed array, it must have exactly array.length * 9 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 9 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (v.defined("array", t), v.typeOf.number.greaterThanOrEquals("array.length", t.length, 9), t.length % 9 != 0) throw new N("array length must be a multiple of 9.");
		const n = t.length;
		C(r) ? r.length = n / 9 : r = new Array(n / 9);
		for (let i = 0; i < n; i += 9) {
			const n = i / 9;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r[6] = t[6], r[7] = t[7], r[8] = t[8], r) : new e(t[0], t[3], t[6], t[1], t[4], t[7], t[2], t[5], t[8]);
	}
	static fromColumnMajorArray(t, r) {
		return v.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return v.defined("values", t), C(r) ? (r[0] = t[0], r[1] = t[3], r[2] = t[6], r[3] = t[1], r[4] = t[4], r[5] = t[7], r[6] = t[2], r[7] = t[5], r[8] = t[8], r) : new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
	}
	static fromQuaternion(t, r) {
		v.typeOf.object("quaternion", t);
		const n = t.x * t.x, i = t.x * t.y, o = t.x * t.z, a = t.x * t.w, s = t.y * t.y, u = t.y * t.z, c = t.y * t.w, l = t.z * t.z, f = t.z * t.w, h = t.w * t.w, p = n - s - l + h, m = 2 * (i - f), d = 2 * (o + c), y = 2 * (i + f), _ = -n + s - l + h, g = 2 * (u - a), E = 2 * (o - c), b = 2 * (u + a), w = -n - s + l + h;
		return C(r) ? (r[0] = p, r[1] = y, r[2] = E, r[3] = m, r[4] = _, r[5] = b, r[6] = d, r[7] = g, r[8] = w, r) : new e(p, m, d, y, _, g, E, b, w);
	}
	static fromHeadingPitchRoll(t, r) {
		v.typeOf.object("headingPitchRoll", t);
		const n = Math.cos(-t.pitch), i = Math.cos(-t.heading), o = Math.cos(t.roll), a = Math.sin(-t.pitch), s = Math.sin(-t.heading), u = Math.sin(t.roll), c = n * i, l = -o * s + u * a * i, f = u * s + o * a * i, h = n * s, p = o * i + u * a * s, m = -u * i + o * a * s, d = -a, y = u * n, _ = o * n;
		return C(r) ? (r[0] = c, r[1] = h, r[2] = d, r[3] = l, r[4] = p, r[5] = y, r[6] = f, r[7] = m, r[8] = _, r) : new e(c, l, f, h, p, m, d, y, _);
	}
	static fromScale(t, r) {
		return v.typeOf.object("scale", t), C(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = t.y, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = t.z, r) : new e(t.x, 0, 0, 0, t.y, 0, 0, 0, t.z);
	}
	static fromUniformScale(t, r) {
		return v.typeOf.number("scale", t), C(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = t, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = t, r) : new e(t, 0, 0, 0, t, 0, 0, 0, t);
	}
	static fromCrossProduct(t, r) {
		return v.typeOf.object("vector", t), C(r) ? (r[0] = 0, r[1] = t.z, r[2] = -t.y, r[3] = -t.z, r[4] = 0, r[5] = t.x, r[6] = t.y, r[7] = -t.x, r[8] = 0, r) : new e(0, -t.z, t.y, t.z, 0, -t.x, -t.y, t.x, 0);
	}
	static fromRotationX(t, r) {
		v.typeOf.number("angle", t);
		const n = Math.cos(t), i = Math.sin(t);
		return C(r) ? (r[0] = 1, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = n, r[5] = i, r[6] = 0, r[7] = -i, r[8] = n, r) : new e(1, 0, 0, 0, n, -i, 0, i, n);
	}
	static fromRotationY(t, r) {
		v.typeOf.number("angle", t);
		const n = Math.cos(t), i = Math.sin(t);
		return C(r) ? (r[0] = n, r[1] = 0, r[2] = -i, r[3] = 0, r[4] = 1, r[5] = 0, r[6] = i, r[7] = 0, r[8] = n, r) : new e(n, 0, i, 0, 1, 0, -i, 0, n);
	}
	static fromRotationZ(t, r) {
		v.typeOf.number("angle", t);
		const n = Math.cos(t), i = Math.sin(t);
		return C(r) ? (r[0] = n, r[1] = i, r[2] = 0, r[3] = -i, r[4] = n, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = 1, r) : new e(n, -i, 0, i, n, 0, 0, 0, 1);
	}
	static toArray(e, t) {
		return v.typeOf.object("matrix", e), C(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t) : [
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
		return v.typeOf.number.greaterThanOrEquals("row", t, 0), v.typeOf.number.lessThanOrEquals("row", t, 2), v.typeOf.number.greaterThanOrEquals("column", e, 0), v.typeOf.number.lessThanOrEquals("column", e, 2), 3 * e + t;
	}
	static getColumn(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.number.greaterThanOrEquals("index", t, 0), v.typeOf.number.lessThanOrEquals("index", t, 2), v.typeOf.object("result", r);
		const n = 3 * t, i = e[n], o = e[n + 1], a = e[n + 2];
		return r.x = i, r.y = o, r.z = a, r;
	}
	static setColumn(t, r, n, i) {
		v.typeOf.object("matrix", t), v.typeOf.number.greaterThanOrEquals("index", r, 0), v.typeOf.number.lessThanOrEquals("index", r, 2), v.typeOf.object("cartesian", n), v.typeOf.object("result", i);
		const o = 3 * r;
		return (i = e.clone(t, i))[o] = n.x, i[o + 1] = n.y, i[o + 2] = n.z, i;
	}
	static getRow(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.number.greaterThanOrEquals("index", t, 0), v.typeOf.number.lessThanOrEquals("index", t, 2), v.typeOf.object("result", r);
		const n = e[t], i = e[t + 3], o = e[t + 6];
		return r.x = n, r.y = i, r.z = o, r;
	}
	static setRow(t, r, n, i) {
		return v.typeOf.object("matrix", t), v.typeOf.number.greaterThanOrEquals("index", r, 0), v.typeOf.number.lessThanOrEquals("index", r, 2), v.typeOf.object("cartesian", n), v.typeOf.object("result", i), (i = e.clone(t, i))[r] = n.x, i[r + 3] = n.y, i[r + 6] = n.z, i;
	}
	static setScale(t, r, n) {
		v.typeOf.object("matrix", t), v.typeOf.object("scale", r), v.typeOf.object("result", n);
		const i = e.getScale(t, te), o = r.x / i.x, a = r.y / i.y, s = r.z / i.z;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * o, n[3] = t[3] * a, n[4] = t[4] * a, n[5] = t[5] * a, n[6] = t[6] * s, n[7] = t[7] * s, n[8] = t[8] * s, n;
	}
	static setUniformScale(t, r, n) {
		v.typeOf.object("matrix", t), v.typeOf.number("scale", r), v.typeOf.object("result", n);
		const i = e.getScale(t, re), o = r / i.x, a = r / i.y, s = r / i.z;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * o, n[3] = t[3] * a, n[4] = t[4] * a, n[5] = t[5] * a, n[6] = t[6] * s, n[7] = t[7] * s, n[8] = t[8] * s, n;
	}
	static getScale(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t.x = z.magnitude(z.fromElements(e[0], e[1], e[2], ne)), t.y = z.magnitude(z.fromElements(e[3], e[4], e[5], ne)), t.z = z.magnitude(z.fromElements(e[6], e[7], e[8], ne)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, ie), z.maximumComponent(ie);
	}
	static setRotation(t, r, n) {
		v.typeOf.object("matrix", t), v.typeOf.object("result", n);
		const i = e.getScale(t, oe);
		return n[0] = r[0] * i.x, n[1] = r[1] * i.x, n[2] = r[2] * i.x, n[3] = r[3] * i.y, n[4] = r[4] * i.y, n[5] = r[5] * i.y, n[6] = r[6] * i.z, n[7] = r[7] * i.z, n[8] = r[8] * i.z, n;
	}
	static getRotation(t, r) {
		v.typeOf.object("matrix", t), v.typeOf.object("result", r);
		const n = e.getScale(t, ae);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.x, r[3] = t[3] / n.y, r[4] = t[4] / n.y, r[5] = t[5] / n.y, r[6] = t[6] / n.z, r[7] = t[7] / n.z, r[8] = t[8] / n.z, r;
	}
	static multiply(e, t, r) {
		v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r);
		const n = e[0] * t[0] + e[3] * t[1] + e[6] * t[2], i = e[1] * t[0] + e[4] * t[1] + e[7] * t[2], o = e[2] * t[0] + e[5] * t[1] + e[8] * t[2], a = e[0] * t[3] + e[3] * t[4] + e[6] * t[5], s = e[1] * t[3] + e[4] * t[4] + e[7] * t[5], u = e[2] * t[3] + e[5] * t[4] + e[8] * t[5], c = e[0] * t[6] + e[3] * t[7] + e[6] * t[8], l = e[1] * t[6] + e[4] * t[7] + e[7] * t[8], f = e[2] * t[6] + e[5] * t[7] + e[8] * t[8];
		return r[0] = n, r[1] = i, r[2] = o, r[3] = a, r[4] = s, r[5] = u, r[6] = c, r[7] = l, r[8] = f, r;
	}
	static add(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r[4] = e[4] + t[4], r[5] = e[5] + t[5], r[6] = e[6] + t[6], r[7] = e[7] + t[7], r[8] = e[8] + t[8], r;
	}
	static subtract(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r[4] = e[4] - t[4], r[5] = e[5] - t[5], r[6] = e[6] - t[6], r[7] = e[7] - t[7], r[8] = e[8] - t[8], r;
	}
	static multiplyByVector(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = t.x, i = t.y, o = t.z, a = e[0] * n + e[3] * i + e[6] * o, s = e[1] * n + e[4] * i + e[7] * o, u = e[2] * n + e[5] * i + e[8] * o;
		return r.x = a, r.y = s, r.z = u, r;
	}
	static multiplyByScalar(e, t, r) {
		return v.typeOf.object("matrix", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r;
	}
	static multiplyByScale(e, t, r) {
		return v.typeOf.object("matrix", e), v.typeOf.object("scale", t), v.typeOf.object("result", r), r[0] = e[0] * t.x, r[1] = e[1] * t.x, r[2] = e[2] * t.x, r[3] = e[3] * t.y, r[4] = e[4] * t.y, r[5] = e[5] * t.y, r[6] = e[6] * t.z, r[7] = e[7] * t.z, r[8] = e[8] * t.z, r;
	}
	static multiplyByUniformScale(e, t, r) {
		return v.typeOf.object("matrix", e), v.typeOf.number("scale", t), v.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r;
	}
	static negate(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t;
	}
	static transpose(e, t) {
		v.typeOf.object("matrix", e), v.typeOf.object("result", t);
		const r = e[0], n = e[3], i = e[6], o = e[1], a = e[4], s = e[7], u = e[2], c = e[5], l = e[8];
		return t[0] = r, t[1] = n, t[2] = i, t[3] = o, t[4] = a, t[5] = s, t[6] = u, t[7] = c, t[8] = l, t;
	}
	static computeEigenDecomposition(t, r) {
		v.typeOf.object("matrix", t);
		const n = L.EPSILON20;
		let i = 0, o = 0;
		C(r) || (r = {});
		const a = r.unitary = e.clone(e.IDENTITY, r.unitary), s = r.diagonal = e.clone(t, r.diagonal), u = n * function(e) {
			let t = 0;
			for (let r = 0; r < 9; ++r) {
				const n = e[r];
				t += n * n;
			}
			return Math.sqrt(t);
		}(s);
		for (; o < 10 && he(s) > u;) pe(s, se), e.transpose(se, ue), e.multiply(s, se, s), e.multiply(ue, s, s), e.multiply(a, se, a), ++i > 2 && (++o, i = 0);
		return r;
	}
	static abs(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t;
	}
	static determinant(e) {
		v.typeOf.object("matrix", e);
		const t = e[0], r = e[3], n = e[6], i = e[1], o = e[4], a = e[7], s = e[2], u = e[5], c = e[8];
		return t * (o * c - u * a) + i * (u * n - r * c) + s * (r * a - o * n);
	}
	static inverse(t, r) {
		v.typeOf.object("matrix", t), v.typeOf.object("result", r);
		const n = t[0], i = t[1], o = t[2], a = t[3], s = t[4], u = t[5], c = t[6], l = t[7], f = t[8], h = e.determinant(t);
		if (Math.abs(h) <= L.EPSILON15) throw new N("matrix is not invertible");
		r[0] = s * f - l * u, r[1] = l * o - i * f, r[2] = i * u - s * o, r[3] = c * u - a * f, r[4] = n * f - c * o, r[5] = a * o - n * u, r[6] = a * l - c * s, r[7] = c * i - n * l, r[8] = n * s - a * i;
		const p = 1 / h;
		return e.multiplyByScalar(r, p, r);
	}
	static inverseTranspose(t, r) {
		return v.typeOf.object("matrix", t), v.typeOf.object("result", r), e.inverse(e.transpose(t, ce), r);
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7] && e[8] === t[8];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || C(e) && C(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r && Math.abs(e[4] - t[4]) <= r && Math.abs(e[5] - t[5]) <= r && Math.abs(e[6] - t[6]) <= r && Math.abs(e[7] - t[7]) <= r && Math.abs(e[8] - t[8]) <= r;
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
ee.packedLength = 9, ee.fromArray = ee.unpack, ee.IDENTITY = Object.freeze(new ee(1, 0, 0, 0, 1, 0, 0, 0, 1)), ee.ZERO = Object.freeze(new ee(0, 0, 0, 0, 0, 0, 0, 0, 0)), ee.COLUMN0ROW0 = 0, ee.COLUMN0ROW1 = 1, ee.COLUMN0ROW2 = 2, ee.COLUMN1ROW0 = 3, ee.COLUMN1ROW1 = 4, ee.COLUMN1ROW2 = 5, ee.COLUMN2ROW0 = 6, ee.COLUMN2ROW1 = 7, ee.COLUMN2ROW2 = 8;
const te = new z(), re = new z(), ne = new z(), ie = new z(), oe = new z(), ae = new z(), se = new ee(), ue = new ee(), ce = new ee(), le = [
	1,
	0,
	0
], fe = [
	2,
	2,
	1
];
function he(e) {
	let t = 0;
	for (let r = 0; r < 3; ++r) {
		const n = e[ee.getElementIndex(fe[r], le[r])];
		t += 2 * n * n;
	}
	return Math.sqrt(t);
}
function pe(e, t) {
	const r = L.EPSILON15;
	let n = 0, i = 1;
	for (let c = 0; c < 3; ++c) {
		const t = Math.abs(e[ee.getElementIndex(fe[c], le[c])]);
		t > n && (i = c, n = t);
	}
	let o = 1, a = 0;
	const s = le[i], u = fe[i];
	if (Math.abs(e[ee.getElementIndex(u, s)]) > r) {
		const t = (e[ee.getElementIndex(u, u)] - e[ee.getElementIndex(s, s)]) / 2 / e[ee.getElementIndex(u, s)];
		let r;
		r = t < 0 ? -1 / (-t + Math.sqrt(1 + t * t)) : 1 / (t + Math.sqrt(1 + t * t)), o = 1 / Math.sqrt(1 + r * r), a = r * o;
	}
	return (t = ee.clone(ee.IDENTITY, t))[ee.getElementIndex(s, s)] = t[ee.getElementIndex(u, u)] = o, t[ee.getElementIndex(u, s)] = a, t[ee.getElementIndex(s, u)] = -a, t;
}
function me(e) {
	let t;
	this.name = "RuntimeError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
C(Object.create) && (me.prototype = Object.create(Error.prototype), me.prototype.constructor = me), me.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return C(this.stack) && (e += `\n${this.stack.toString()}`), e;
};
var de = class e {
	constructor(e, t, r, n, i, o, a, s, u, c, l, f, h, p, m, d) {
		this[0] = e ?? 0, this[1] = i ?? 0, this[2] = u ?? 0, this[3] = h ?? 0, this[4] = t ?? 0, this[5] = o ?? 0, this[6] = c ?? 0, this[7] = p ?? 0, this[8] = r ?? 0, this[9] = a ?? 0, this[10] = l ?? 0, this[11] = m ?? 0, this[12] = n ?? 0, this[13] = s ?? 0, this[14] = f ?? 0, this[15] = d ?? 0;
	}
	static pack(e, t, r) {
		return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t[r++] = e[9], t[r++] = e[10], t[r++] = e[11], t[r++] = e[12], t[r++] = e[13], t[r++] = e[14], t[r] = e[15], t;
	}
	static unpack(t, r, n) {
		return v.defined("array", t), r = r ?? 0, C(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n[4] = t[r++], n[5] = t[r++], n[6] = t[r++], n[7] = t[r++], n[8] = t[r++], n[9] = t[r++], n[10] = t[r++], n[11] = t[r++], n[12] = t[r++], n[13] = t[r++], n[14] = t[r++], n[15] = t[r], n;
	}
	static packArray(t, r) {
		v.defined("array", t);
		const n = t.length, i = 16 * n;
		if (C(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new N("If result is a typed array, it must have exactly array.length * 16 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 16 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (v.defined("array", t), v.typeOf.number.greaterThanOrEquals("array.length", t.length, 16), t.length % 16 != 0) throw new N("array length must be a multiple of 16.");
		const n = t.length;
		C(r) ? r.length = n / 16 : r = new Array(n / 16);
		for (let i = 0; i < n; i += 16) {
			const n = i / 16;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r[6] = t[6], r[7] = t[7], r[8] = t[8], r[9] = t[9], r[10] = t[10], r[11] = t[11], r[12] = t[12], r[13] = t[13], r[14] = t[14], r[15] = t[15], r) : new e(t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15]);
	}
	static fromColumnMajorArray(t, r) {
		return v.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return v.defined("values", t), C(r) ? (r[0] = t[0], r[1] = t[4], r[2] = t[8], r[3] = t[12], r[4] = t[1], r[5] = t[5], r[6] = t[9], r[7] = t[13], r[8] = t[2], r[9] = t[6], r[10] = t[10], r[11] = t[14], r[12] = t[3], r[13] = t[7], r[14] = t[11], r[15] = t[15], r) : new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]);
	}
	static fromRotationTranslation(t, r, n) {
		return v.typeOf.object("rotation", t), r = r ?? z.ZERO, C(n) ? (n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = 0, n[4] = t[3], n[5] = t[4], n[6] = t[5], n[7] = 0, n[8] = t[6], n[9] = t[7], n[10] = t[8], n[11] = 0, n[12] = r.x, n[13] = r.y, n[14] = r.z, n[15] = 1, n) : new e(t[0], t[3], t[6], r.x, t[1], t[4], t[7], r.y, t[2], t[5], t[8], r.z, 0, 0, 0, 1);
	}
	static fromTranslationQuaternionRotationScale(t, r, n, i) {
		v.typeOf.object("translation", t), v.typeOf.object("rotation", r), v.typeOf.object("scale", n), C(i) || (i = new e());
		const o = n.x, a = n.y, s = n.z, u = r.x * r.x, c = r.x * r.y, l = r.x * r.z, f = r.x * r.w, h = r.y * r.y, p = r.y * r.z, m = r.y * r.w, d = r.z * r.z, y = r.z * r.w, _ = r.w * r.w, g = u - h - d + _, E = 2 * (c - y), b = 2 * (l + m), w = 2 * (c + y), T = -u + h - d + _, O = 2 * (p - f), A = 2 * (l - m), x = 2 * (p + f), R = -u - h + d + _;
		return i[0] = g * o, i[1] = w * o, i[2] = A * o, i[3] = 0, i[4] = E * a, i[5] = T * a, i[6] = x * a, i[7] = 0, i[8] = b * s, i[9] = O * s, i[10] = R * s, i[11] = 0, i[12] = t.x, i[13] = t.y, i[14] = t.z, i[15] = 1, i;
	}
	static fromTranslationRotationScale(t, r) {
		return v.typeOf.object("translationRotationScale", t), e.fromTranslationQuaternionRotationScale(t.translation, t.rotation, t.scale, r);
	}
	static fromTranslation(t, r) {
		return v.typeOf.object("translation", t), e.fromRotationTranslation(ee.IDENTITY, t, r);
	}
	static fromScale(t, r) {
		return v.typeOf.object("scale", t), C(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = t.y, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = t.z, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r) : new e(t.x, 0, 0, 0, 0, t.y, 0, 0, 0, 0, t.z, 0, 0, 0, 0, 1);
	}
	static fromUniformScale(t, r) {
		return v.typeOf.number("scale", t), C(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = t, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = t, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r) : new e(t, 0, 0, 0, 0, t, 0, 0, 0, 0, t, 0, 0, 0, 0, 1);
	}
	static fromRotation(t, r) {
		return v.typeOf.object("rotation", t), C(r) || (r = new e()), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 0, r[4] = t[3], r[5] = t[4], r[6] = t[5], r[7] = 0, r[8] = t[6], r[9] = t[7], r[10] = t[8], r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r;
	}
	static fromCamera(t, r) {
		v.typeOf.object("camera", t);
		const n = t.position, i = t.direction, o = t.up;
		v.typeOf.object("camera.position", n), v.typeOf.object("camera.direction", i), v.typeOf.object("camera.up", o), z.normalize(i, ye), z.normalize(z.cross(ye, o, _e), _e), z.normalize(z.cross(_e, ye, ge), ge);
		const a = _e.x, s = _e.y, u = _e.z, c = ye.x, l = ye.y, f = ye.z, h = ge.x, p = ge.y, m = ge.z, d = n.x, y = n.y, _ = n.z, g = a * -d + s * -y + u * -_, E = h * -d + p * -y + m * -_, b = c * d + l * y + f * _;
		return C(r) ? (r[0] = a, r[1] = h, r[2] = -c, r[3] = 0, r[4] = s, r[5] = p, r[6] = -l, r[7] = 0, r[8] = u, r[9] = m, r[10] = -f, r[11] = 0, r[12] = g, r[13] = E, r[14] = b, r[15] = 1, r) : new e(a, s, u, g, h, p, m, E, -c, -l, -f, b, 0, 0, 0, 1);
	}
	static computePerspectiveFieldOfView(e, t, r, n, i) {
		v.typeOf.number.greaterThan("fovY", e, 0), v.typeOf.number.lessThan("fovY", e, Math.PI), v.typeOf.number.greaterThan("near", r, 0), v.typeOf.number.greaterThan("far", n, 0), v.typeOf.object("result", i);
		const o = 1 / Math.tan(.5 * e), a = o / t, s = (n + r) / (r - n), u = 2 * n * r / (r - n);
		return i[0] = a, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = o, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = s, i[11] = -1, i[12] = 0, i[13] = 0, i[14] = u, i[15] = 0, i;
	}
	static computeOrthographicOffCenter(e, t, r, n, i, o, a) {
		v.typeOf.number("left", e), v.typeOf.number("right", t), v.typeOf.number("bottom", r), v.typeOf.number("top", n), v.typeOf.number("near", i), v.typeOf.number("far", o), v.typeOf.object("result", a);
		let s = 1 / (t - e), u = 1 / (n - r), c = 1 / (o - i);
		const l = -(t + e) * s, f = -(n + r) * u, h = -(o + i) * c;
		return s *= 2, u *= 2, c *= -2, a[0] = s, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = u, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = c, a[11] = 0, a[12] = l, a[13] = f, a[14] = h, a[15] = 1, a;
	}
	static computePerspectiveOffCenter(e, t, r, n, i, o, a) {
		v.typeOf.number("left", e), v.typeOf.number("right", t), v.typeOf.number("bottom", r), v.typeOf.number("top", n), v.typeOf.number("near", i), v.typeOf.number("far", o), v.typeOf.object("result", a);
		const s = 2 * i / (t - e), u = 2 * i / (n - r), c = (t + e) / (t - e), l = (n + r) / (n - r), f = -(o + i) / (o - i), h = -2 * o * i / (o - i);
		return a[0] = s, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = u, a[6] = 0, a[7] = 0, a[8] = c, a[9] = l, a[10] = f, a[11] = -1, a[12] = 0, a[13] = 0, a[14] = h, a[15] = 0, a;
	}
	static computeInfinitePerspectiveOffCenter(e, t, r, n, i, o) {
		v.typeOf.number("left", e), v.typeOf.number("right", t), v.typeOf.number("bottom", r), v.typeOf.number("top", n), v.typeOf.number("near", i), v.typeOf.object("result", o);
		const a = 2 * i / (t - e), s = 2 * i / (n - r), u = (t + e) / (t - e), c = (n + r) / (n - r), l = -2 * i;
		return o[0] = a, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = s, o[6] = 0, o[7] = 0, o[8] = u, o[9] = c, o[10] = -1, o[11] = -1, o[12] = 0, o[13] = 0, o[14] = l, o[15] = 0, o;
	}
	static computeViewportTransformation(t, r, n, i) {
		C(i) || (i = new e());
		const o = (t = t ?? J.EMPTY_OBJECT).x ?? 0, a = t.y ?? 0;
		r = r ?? 0;
		const s = .5 * (t.width ?? 0), u = .5 * (t.height ?? 0), c = .5 * ((n = n ?? 1) - r), l = s, f = u, h = c, p = o + s, m = a + u, d = r + c;
		return i[0] = l, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = f, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = h, i[11] = 0, i[12] = p, i[13] = m, i[14] = d, i[15] = 1, i;
	}
	static computeView(e, t, r, n, i) {
		return v.typeOf.object("position", e), v.typeOf.object("direction", t), v.typeOf.object("up", r), v.typeOf.object("right", n), v.typeOf.object("result", i), i[0] = n.x, i[1] = r.x, i[2] = -t.x, i[3] = 0, i[4] = n.y, i[5] = r.y, i[6] = -t.y, i[7] = 0, i[8] = n.z, i[9] = r.z, i[10] = -t.z, i[11] = 0, i[12] = -z.dot(n, e), i[13] = -z.dot(r, e), i[14] = z.dot(t, e), i[15] = 1, i;
	}
	static toArray(e, t) {
		return v.typeOf.object("matrix", e), C(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t) : [
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
		return v.typeOf.number.greaterThanOrEquals("row", t, 0), v.typeOf.number.lessThanOrEquals("row", t, 3), v.typeOf.number.greaterThanOrEquals("column", e, 0), v.typeOf.number.lessThanOrEquals("column", e, 3), 4 * e + t;
	}
	static getColumn(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.number.greaterThanOrEquals("index", t, 0), v.typeOf.number.lessThanOrEquals("index", t, 3), v.typeOf.object("result", r);
		const n = 4 * t, i = e[n], o = e[n + 1], a = e[n + 2], s = e[n + 3];
		return r.x = i, r.y = o, r.z = a, r.w = s, r;
	}
	static setColumn(t, r, n, i) {
		v.typeOf.object("matrix", t), v.typeOf.number.greaterThanOrEquals("index", r, 0), v.typeOf.number.lessThanOrEquals("index", r, 3), v.typeOf.object("cartesian", n), v.typeOf.object("result", i);
		const o = 4 * r;
		return (i = e.clone(t, i))[o] = n.x, i[o + 1] = n.y, i[o + 2] = n.z, i[o + 3] = n.w, i;
	}
	static getRow(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.number.greaterThanOrEquals("index", t, 0), v.typeOf.number.lessThanOrEquals("index", t, 3), v.typeOf.object("result", r);
		const n = e[t], i = e[t + 4], o = e[t + 8], a = e[t + 12];
		return r.x = n, r.y = i, r.z = o, r.w = a, r;
	}
	static setRow(t, r, n, i) {
		return v.typeOf.object("matrix", t), v.typeOf.number.greaterThanOrEquals("index", r, 0), v.typeOf.number.lessThanOrEquals("index", r, 3), v.typeOf.object("cartesian", n), v.typeOf.object("result", i), (i = e.clone(t, i))[r] = n.x, i[r + 4] = n.y, i[r + 8] = n.z, i[r + 12] = n.w, i;
	}
	static setTranslation(e, t, r) {
		return v.typeOf.object("matrix", e), v.typeOf.object("translation", t), v.typeOf.object("result", r), r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = t.x, r[13] = t.y, r[14] = t.z, r[15] = e[15], r;
	}
	static setScale(t, r, n) {
		v.typeOf.object("matrix", t), v.typeOf.object("scale", r), v.typeOf.object("result", n);
		const i = e.getScale(t, Ee), o = r.x / i.x, a = r.y / i.y, s = r.z / i.z;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * o, n[3] = t[3], n[4] = t[4] * a, n[5] = t[5] * a, n[6] = t[6] * a, n[7] = t[7], n[8] = t[8] * s, n[9] = t[9] * s, n[10] = t[10] * s, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static setUniformScale(t, r, n) {
		v.typeOf.object("matrix", t), v.typeOf.number("scale", r), v.typeOf.object("result", n);
		const i = e.getScale(t, be), o = r / i.x, a = r / i.y, s = r / i.z;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * o, n[3] = t[3], n[4] = t[4] * a, n[5] = t[5] * a, n[6] = t[6] * a, n[7] = t[7], n[8] = t[8] * s, n[9] = t[9] * s, n[10] = t[10] * s, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static getScale(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t.x = z.magnitude(z.fromElements(e[0], e[1], e[2], we)), t.y = z.magnitude(z.fromElements(e[4], e[5], e[6], we)), t.z = z.magnitude(z.fromElements(e[8], e[9], e[10], we)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, Te), z.maximumComponent(Te);
	}
	static setRotation(t, r, n) {
		v.typeOf.object("matrix", t), v.typeOf.object("result", n);
		const i = e.getScale(t, Oe);
		return n[0] = r[0] * i.x, n[1] = r[1] * i.x, n[2] = r[2] * i.x, n[3] = t[3], n[4] = r[3] * i.y, n[5] = r[4] * i.y, n[6] = r[5] * i.y, n[7] = t[7], n[8] = r[6] * i.z, n[9] = r[7] * i.z, n[10] = r[8] * i.z, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static getRotation(t, r) {
		v.typeOf.object("matrix", t), v.typeOf.object("result", r);
		const n = e.getScale(t, Ae);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.x, r[3] = t[4] / n.y, r[4] = t[5] / n.y, r[5] = t[6] / n.y, r[6] = t[8] / n.z, r[7] = t[9] / n.z, r[8] = t[10] / n.z, r;
	}
	static multiply(e, t, r) {
		v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r);
		const n = e[0], i = e[1], o = e[2], a = e[3], s = e[4], u = e[5], c = e[6], l = e[7], f = e[8], h = e[9], p = e[10], m = e[11], d = e[12], y = e[13], _ = e[14], g = e[15], E = t[0], b = t[1], w = t[2], T = t[3], O = t[4], A = t[5], x = t[6], R = t[7], S = t[8], I = t[9], C = t[10], N = t[11], P = t[12], M = t[13], L = t[14], F = t[15], D = n * E + s * b + f * w + d * T, z = i * E + u * b + h * w + y * T, B = o * E + c * b + p * w + _ * T, U = a * E + l * b + m * w + g * T, j = n * O + s * A + f * x + d * R, q = i * O + u * A + h * x + y * R, G = o * O + c * A + p * x + _ * R, k = a * O + l * A + m * x + g * R, W = n * S + s * I + f * C + d * N, V = i * S + u * I + h * C + y * N, H = o * S + c * I + p * C + _ * N, Y = a * S + l * I + m * C + g * N, X = n * P + s * M + f * L + d * F, $ = i * P + u * M + h * L + y * F, K = o * P + c * M + p * L + _ * F, Z = a * P + l * M + m * L + g * F;
		return r[0] = D, r[1] = z, r[2] = B, r[3] = U, r[4] = j, r[5] = q, r[6] = G, r[7] = k, r[8] = W, r[9] = V, r[10] = H, r[11] = Y, r[12] = X, r[13] = $, r[14] = K, r[15] = Z, r;
	}
	static add(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r[4] = e[4] + t[4], r[5] = e[5] + t[5], r[6] = e[6] + t[6], r[7] = e[7] + t[7], r[8] = e[8] + t[8], r[9] = e[9] + t[9], r[10] = e[10] + t[10], r[11] = e[11] + t[11], r[12] = e[12] + t[12], r[13] = e[13] + t[13], r[14] = e[14] + t[14], r[15] = e[15] + t[15], r;
	}
	static subtract(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r[4] = e[4] - t[4], r[5] = e[5] - t[5], r[6] = e[6] - t[6], r[7] = e[7] - t[7], r[8] = e[8] - t[8], r[9] = e[9] - t[9], r[10] = e[10] - t[10], r[11] = e[11] - t[11], r[12] = e[12] - t[12], r[13] = e[13] - t[13], r[14] = e[14] - t[14], r[15] = e[15] - t[15], r;
	}
	static multiplyTransformation(e, t, r) {
		v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r);
		const n = e[0], i = e[1], o = e[2], a = e[4], s = e[5], u = e[6], c = e[8], l = e[9], f = e[10], h = e[12], p = e[13], m = e[14], d = t[0], y = t[1], _ = t[2], g = t[4], E = t[5], b = t[6], w = t[8], T = t[9], O = t[10], A = t[12], x = t[13], R = t[14], S = n * d + a * y + c * _, I = i * d + s * y + l * _, C = o * d + u * y + f * _, N = n * g + a * E + c * b, P = i * g + s * E + l * b, M = o * g + u * E + f * b, L = n * w + a * T + c * O, F = i * w + s * T + l * O, D = o * w + u * T + f * O, z = n * A + a * x + c * R + h, B = i * A + s * x + l * R + p, U = o * A + u * x + f * R + m;
		return r[0] = S, r[1] = I, r[2] = C, r[3] = 0, r[4] = N, r[5] = P, r[6] = M, r[7] = 0, r[8] = L, r[9] = F, r[10] = D, r[11] = 0, r[12] = z, r[13] = B, r[14] = U, r[15] = 1, r;
	}
	static multiplyByMatrix3(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.object("rotation", t), v.typeOf.object("result", r);
		const n = e[0], i = e[1], o = e[2], a = e[4], s = e[5], u = e[6], c = e[8], l = e[9], f = e[10], h = t[0], p = t[1], m = t[2], d = t[3], y = t[4], _ = t[5], g = t[6], E = t[7], b = t[8], w = n * h + a * p + c * m, T = i * h + s * p + l * m, O = o * h + u * p + f * m, A = n * d + a * y + c * _, x = i * d + s * y + l * _, R = o * d + u * y + f * _, S = n * g + a * E + c * b, I = i * g + s * E + l * b, C = o * g + u * E + f * b;
		return r[0] = w, r[1] = T, r[2] = O, r[3] = 0, r[4] = A, r[5] = x, r[6] = R, r[7] = 0, r[8] = S, r[9] = I, r[10] = C, r[11] = 0, r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static multiplyByTranslation(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.object("translation", t), v.typeOf.object("result", r);
		const n = t.x, i = t.y, o = t.z, a = n * e[0] + i * e[4] + o * e[8] + e[12], s = n * e[1] + i * e[5] + o * e[9] + e[13], u = n * e[2] + i * e[6] + o * e[10] + e[14];
		return r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = a, r[13] = s, r[14] = u, r[15] = e[15], r;
	}
	static multiplyByScale(t, r, n) {
		v.typeOf.object("matrix", t), v.typeOf.object("scale", r), v.typeOf.object("result", n);
		const i = r.x, o = r.y, a = r.z;
		return 1 === i && 1 === o && 1 === a ? e.clone(t, n) : (n[0] = i * t[0], n[1] = i * t[1], n[2] = i * t[2], n[3] = t[3], n[4] = o * t[4], n[5] = o * t[5], n[6] = o * t[6], n[7] = t[7], n[8] = a * t[8], n[9] = a * t[9], n[10] = a * t[10], n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n);
	}
	static multiplyByUniformScale(e, t, r) {
		return v.typeOf.object("matrix", e), v.typeOf.number("scale", t), v.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3], r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7], r[8] = e[8] * t, r[9] = e[9] * t, r[10] = e[10] * t, r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static multiplyByVector(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = t.x, i = t.y, o = t.z, a = t.w, s = e[0] * n + e[4] * i + e[8] * o + e[12] * a, u = e[1] * n + e[5] * i + e[9] * o + e[13] * a, c = e[2] * n + e[6] * i + e[10] * o + e[14] * a, l = e[3] * n + e[7] * i + e[11] * o + e[15] * a;
		return r.x = s, r.y = u, r.z = c, r.w = l, r;
	}
	static multiplyByPointAsVector(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = t.x, i = t.y, o = t.z, a = e[0] * n + e[4] * i + e[8] * o, s = e[1] * n + e[5] * i + e[9] * o, u = e[2] * n + e[6] * i + e[10] * o;
		return r.x = a, r.y = s, r.z = u, r;
	}
	static multiplyByPoint(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = t.x, i = t.y, o = t.z, a = e[0] * n + e[4] * i + e[8] * o + e[12], s = e[1] * n + e[5] * i + e[9] * o + e[13], u = e[2] * n + e[6] * i + e[10] * o + e[14];
		return r.x = a, r.y = s, r.z = u, r;
	}
	static multiplyByScalar(e, t, r) {
		return v.typeOf.object("matrix", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r[9] = e[9] * t, r[10] = e[10] * t, r[11] = e[11] * t, r[12] = e[12] * t, r[13] = e[13] * t, r[14] = e[14] * t, r[15] = e[15] * t, r;
	}
	static negate(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t[9] = -e[9], t[10] = -e[10], t[11] = -e[11], t[12] = -e[12], t[13] = -e[13], t[14] = -e[14], t[15] = -e[15], t;
	}
	static transpose(e, t) {
		v.typeOf.object("matrix", e), v.typeOf.object("result", t);
		const r = e[1], n = e[2], i = e[3], o = e[6], a = e[7], s = e[11];
		return t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = r, t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = n, t[9] = o, t[10] = e[10], t[11] = e[14], t[12] = i, t[13] = a, t[14] = s, t[15] = e[15], t;
	}
	static abs(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t[9] = Math.abs(e[9]), t[10] = Math.abs(e[10]), t[11] = Math.abs(e[11]), t[12] = Math.abs(e[12]), t[13] = Math.abs(e[13]), t[14] = Math.abs(e[14]), t[15] = Math.abs(e[15]), t;
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && e[12] === t[12] && e[13] === t[13] && e[14] === t[14] && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[8] === t[8] && e[9] === t[9] && e[10] === t[10] && e[3] === t[3] && e[7] === t[7] && e[11] === t[11] && e[15] === t[15];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || C(e) && C(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r && Math.abs(e[4] - t[4]) <= r && Math.abs(e[5] - t[5]) <= r && Math.abs(e[6] - t[6]) <= r && Math.abs(e[7] - t[7]) <= r && Math.abs(e[8] - t[8]) <= r && Math.abs(e[9] - t[9]) <= r && Math.abs(e[10] - t[10]) <= r && Math.abs(e[11] - t[11]) <= r && Math.abs(e[12] - t[12]) <= r && Math.abs(e[13] - t[13]) <= r && Math.abs(e[14] - t[14]) <= r && Math.abs(e[15] - t[15]) <= r;
	}
	static getTranslation(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t.x = e[12], t.y = e[13], t.z = e[14], t;
	}
	static getMatrix3(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t;
	}
	static inverse(t, r) {
		v.typeOf.object("matrix", t), v.typeOf.object("result", r);
		const n = t[0], i = t[4], o = t[8], a = t[12], s = t[1], u = t[5], c = t[9], l = t[13], f = t[2], h = t[6], p = t[10], m = t[14], d = t[3], y = t[7], _ = t[11], g = t[15];
		let E = p * g, b = m * _, w = h * g, T = m * y, O = h * _, A = p * y, x = f * g, R = m * d, S = f * _, I = p * d, C = f * y, N = h * d;
		const P = E * u + T * c + O * l - (b * u + w * c + A * l), M = b * s + x * c + I * l - (E * s + R * c + S * l), F = w * s + R * u + C * l - (T * s + x * u + N * l), D = A * s + S * u + N * c - (O * s + I * u + C * c), z = b * i + w * o + A * a - (E * i + T * o + O * a), B = E * n + R * o + S * a - (b * n + x * o + I * a), U = T * n + x * i + N * a - (w * n + R * i + C * a), j = O * n + I * i + C * o - (A * n + S * i + N * o);
		E = o * l, b = a * c, w = i * l, T = a * u, O = i * c, A = o * u, x = n * l, R = a * s, S = n * c, I = o * s, C = n * u, N = i * s;
		const q = E * y + T * _ + O * g - (b * y + w * _ + A * g), G = b * d + x * _ + I * g - (E * d + R * _ + S * g), k = w * d + R * y + C * g - (T * d + x * y + N * g), W = A * d + S * y + N * _ - (O * d + I * y + C * _), H = w * p + A * m + b * h - (O * m + E * h + T * p), Y = S * m + E * f + R * p - (x * p + I * m + b * f), X = x * h + N * m + T * f - (C * m + w * f + R * h), $ = C * p + O * f + I * h - (S * h + N * p + A * f);
		let K = n * P + i * M + o * F + a * D;
		if (Math.abs(K) < L.EPSILON21) {
			if (ee.equalsEpsilon(e.getMatrix3(t, xe), Re, L.EPSILON7) && V.equals(e.getRow(t, 3, Se), Ie)) return r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = 0, r[11] = 0, r[12] = -t[12], r[13] = -t[13], r[14] = -t[14], r[15] = 1, r;
			throw new me("matrix is not invertible because its determinate is zero.");
		}
		return K = 1 / K, r[0] = P * K, r[1] = M * K, r[2] = F * K, r[3] = D * K, r[4] = z * K, r[5] = B * K, r[6] = U * K, r[7] = j * K, r[8] = q * K, r[9] = G * K, r[10] = k * K, r[11] = W * K, r[12] = H * K, r[13] = Y * K, r[14] = X * K, r[15] = $ * K, r;
	}
	static inverseTransformation(e, t) {
		v.typeOf.object("matrix", e), v.typeOf.object("result", t);
		const r = e[0], n = e[1], i = e[2], o = e[4], a = e[5], s = e[6], u = e[8], c = e[9], l = e[10], f = e[12], h = e[13], p = e[14], m = -r * f - n * h - i * p, d = -o * f - a * h - s * p, y = -u * f - c * h - l * p;
		return t[0] = r, t[1] = o, t[2] = u, t[3] = 0, t[4] = n, t[5] = a, t[6] = c, t[7] = 0, t[8] = i, t[9] = s, t[10] = l, t[11] = 0, t[12] = m, t[13] = d, t[14] = y, t[15] = 1, t;
	}
	static inverseTranspose(t, r) {
		return v.typeOf.object("matrix", t), v.typeOf.object("result", r), e.inverse(e.transpose(t, Ce), r);
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
const ye = new z(), _e = new z(), ge = new z(), Ee = new z(), be = new z(), we = new z(), Te = new z(), Oe = new z(), Ae = new z(), xe = new ee(), Re = new ee(), Se = new V(), Ie = new V(0, 0, 0, 1), Ce = new de(), Ne = {
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
function ve() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
		const t = 16 * Math.random() | 0;
		return ("x" === e ? t : 3 & t | 8).toString(16);
	});
}
function Pe() {
	return !0;
}
function Me(e, t) {
	function r() {
		throw new N(t);
	}
	t = t ?? "This object was destroyed, i.e., destroy() was called.";
	for (const n in e) "function" == typeof e[n] && (e[n] = r);
	e.isDestroyed = Pe;
}
Object.freeze(Ne);
const Le = {
	UNSIGNED_BYTE: Ne.UNSIGNED_BYTE,
	UNSIGNED_SHORT: Ne.UNSIGNED_SHORT,
	UNSIGNED_INT: Ne.UNSIGNED_INT,
	getSizeInBytes: function(e) {
		switch (e) {
			case Le.UNSIGNED_BYTE: return Uint8Array.BYTES_PER_ELEMENT;
			case Le.UNSIGNED_SHORT: return Uint16Array.BYTES_PER_ELEMENT;
			case Le.UNSIGNED_INT: return Uint32Array.BYTES_PER_ELEMENT;
		}
		throw new N("indexDatatype is required and must be a valid IndexDatatype constant.");
	},
	fromSizeInBytes: function(e) {
		switch (e) {
			case 2: return Le.UNSIGNED_SHORT;
			case 4: return Le.UNSIGNED_INT;
			case 1: return Le.UNSIGNED_BYTE;
			default: throw new N("Size in bytes cannot be mapped to an IndexDatatype");
		}
	},
	validate: function(e) {
		return C(e) && (e === Le.UNSIGNED_BYTE || e === Le.UNSIGNED_SHORT || e === Le.UNSIGNED_INT);
	},
	createTypedArray: function(e, t) {
		if (!C(e)) throw new N("numberOfVertices is required.");
		return e >= L.SIXTY_FOUR_KILOBYTES ? new Uint32Array(t) : new Uint16Array(t);
	},
	createTypedArrayFromArrayBuffer: function(e, t, r, n) {
		if (!C(e)) throw new N("numberOfVertices is required.");
		if (!C(t)) throw new N("sourceArray is required.");
		if (!C(r)) throw new N("byteOffset is required.");
		return e >= L.SIXTY_FOUR_KILOBYTES ? new Uint32Array(t, r, n) : new Uint16Array(t, r, n);
	},
	fromTypedArray: function(e) {
		if (e instanceof Uint8Array) return Le.UNSIGNED_BYTE;
		if (e instanceof Uint16Array) return Le.UNSIGNED_SHORT;
		if (e instanceof Uint32Array) return Le.UNSIGNED_INT;
		throw new N("array must be a Uint8Array, Uint16Array, or Uint32Array.");
	}
};
Object.freeze(Le);
const Fe = {
	STREAM_DRAW: Ne.STREAM_DRAW,
	STATIC_DRAW: Ne.STATIC_DRAW,
	DYNAMIC_DRAW: Ne.DYNAMIC_DRAW,
	DYNAMIC_READ: Ne.DYNAMIC_READ
};
function De(e) {
	if (e = e ?? J.EMPTY_OBJECT, v.defined("options.context", e.context), !C(e.typedArray) && !C(e.sizeInBytes)) throw new N("Either options.sizeInBytes or options.typedArray is required.");
	if (C(e.typedArray) && C(e.sizeInBytes)) throw new N("Cannot pass in both options.sizeInBytes and options.typedArray.");
	if (C(e.typedArray) && (v.typeOf.object("options.typedArray", e.typedArray), v.typeOf.number("options.typedArray.byteLength", e.typedArray.byteLength)), !Fe.validate(e.usage)) throw new N("usage is invalid.");
	const t = e.context._gl, r = e.bufferTarget, n = e.typedArray;
	let i = e.sizeInBytes;
	const o = e.usage, a = C(n);
	a && (i = n.byteLength), v.typeOf.number.greaterThan("sizeInBytes", i, 0);
	const s = t.createBuffer();
	t.bindBuffer(r, s), t.bufferData(r, a ? n : i, o), t.bindBuffer(r, null), this._id = ve(), this._gl = t, this._webgl2 = e.context._webgl2, this._bufferTarget = r, this._sizeInBytes = i, this._usage = o, this._buffer = s, this.vertexArrayDestroyable = !0;
}
let ze;
Fe.validate = function(e) {
	return e === Fe.STREAM_DRAW || e === Fe.STATIC_DRAW || e === Fe.DYNAMIC_DRAW || e === Fe.DYNAMIC_READ;
}, Object.freeze(Fe), De.createPixelBuffer = function(e) {
	if (v.defined("options.context", e.context), !e.context._webgl2) throw new N("A WebGL 2 context is required to create PixelBuffers.");
	return new De({
		context: e.context,
		bufferTarget: Ne.PIXEL_PACK_BUFFER,
		typedArray: e.typedArray,
		sizeInBytes: e.sizeInBytes,
		usage: e.usage
	});
}, De.createVertexBuffer = function(e) {
	return v.defined("options.context", e.context), new De({
		context: e.context,
		bufferTarget: Ne.ARRAY_BUFFER,
		typedArray: e.typedArray,
		sizeInBytes: e.sizeInBytes,
		usage: e.usage
	});
}, De.createIndexBuffer = function(e) {
	if (v.defined("options.context", e.context), !Le.validate(e.indexDatatype)) throw new N("Invalid indexDatatype.");
	if (e.indexDatatype === Le.UNSIGNED_INT && !e.context.elementIndexUint) throw new N("IndexDatatype.UNSIGNED_INT requires OES_element_index_uint, which is not supported on this system.  Check context.elementIndexUint.");
	const t = e.context, r = e.indexDatatype, n = Le.getSizeInBytes(r), i = new De({
		context: t,
		bufferTarget: Ne.ELEMENT_ARRAY_BUFFER,
		typedArray: e.typedArray,
		sizeInBytes: e.sizeInBytes,
		usage: e.usage
	}), o = i.sizeInBytes / n;
	return Object.defineProperties(i, {
		indexDatatype: { get: function() {
			return r;
		} },
		bytesPerIndex: { get: function() {
			return n;
		} },
		numberOfIndices: { get: function() {
			return o;
		} }
	}), i;
}, Object.defineProperties(De.prototype, {
	sizeInBytes: { get: function() {
		return this._sizeInBytes;
	} },
	usage: { get: function() {
		return this._usage;
	} }
}), De.prototype._getBuffer = function() {
	return this._buffer;
}, De.prototype._bind = function() {
	const e = this._gl, t = this._bufferTarget;
	e.bindBuffer(t, this._buffer);
}, De.prototype._unBind = function() {
	const e = this._gl, t = this._bufferTarget;
	e.bindBuffer(t, null);
}, De.prototype.copyFromArrayView = function(e, t) {
	t = t ?? 0, v.defined("arrayView", e), v.typeOf.number.lessThanOrEquals("offsetInBytes + arrayView.byteLength", t + e.byteLength, this._sizeInBytes);
	const r = this._gl, n = this._bufferTarget;
	r.bindBuffer(n, this._buffer), r.bufferSubData(n, t, e), r.bindBuffer(n, null);
}, De.prototype.copyFromBuffer = function(e, t, r, n) {
	if (!this._webgl2) throw new N("A WebGL 2 context is required.");
	if (!C(e)) throw new N("readBuffer must be defined.");
	if (!C(n) || n <= 0) throw new N("sizeInBytes must be defined and be greater than zero.");
	if (!C(t) || t < 0 || t + n > e._sizeInBytes) throw new N("readOffset must be greater than or equal to zero and readOffset + sizeInBytes must be less than of equal to readBuffer.sizeInBytes.");
	if (!C(r) || r < 0 || r + n > this._sizeInBytes) throw new N("writeOffset must be greater than or equal to zero and writeOffset + sizeInBytes must be less than of equal to this.sizeInBytes.");
	if (this._buffer === e._buffer && (r >= t && r < t + n || t > r && t < r + n)) throw new N("When readBuffer is equal to this, the ranges [readOffset + sizeInBytes) and [writeOffset, writeOffset + sizeInBytes) must not overlap.");
	if (this._bufferTarget === Ne.ELEMENT_ARRAY_BUFFER && e._bufferTarget !== Ne.ELEMENT_ARRAY_BUFFER || this._bufferTarget !== Ne.ELEMENT_ARRAY_BUFFER && e._bufferTarget === Ne.ELEMENT_ARRAY_BUFFER) throw new N("Can not copy an index buffer into another buffer type.");
	const i = Ne.COPY_READ_BUFFER, o = Ne.COPY_WRITE_BUFFER, a = this._gl;
	a.bindBuffer(o, this._buffer), a.bindBuffer(i, e._buffer), a.copyBufferSubData(i, o, t, r, n), a.bindBuffer(o, null), a.bindBuffer(i, null);
}, De.prototype.getBufferData = function(e, t, r, n) {
	if (t = t ?? 0, r = r ?? 0, !this._webgl2) throw new N("A WebGL 2 context is required.");
	if (!C(e)) throw new N("arrayView is required.");
	let i, o, a = e.byteLength;
	if (C(n) ? (i = n, C(a) ? o = 1 : (a = e.length, o = e.BYTES_PER_ELEMENT)) : C(a) ? (i = a - r, o = 1) : (a = e.length, i = a - r, o = e.BYTES_PER_ELEMENT), r < 0 || r > a) throw new N("destinationOffset must be greater than zero and less than the arrayView length.");
	if (r + i > a) throw new N("destinationOffset + length must be less than or equal to the arrayViewLength.");
	if (t < 0 || t > this._sizeInBytes) throw new N("sourceOffset must be greater than zero and less than the buffers size.");
	if (t + i * o > this._sizeInBytes) throw new N("sourceOffset + length must be less than the buffers size.");
	const s = this._gl, u = Ne.COPY_READ_BUFFER;
	s.bindBuffer(u, this._buffer), s.getBufferSubData(u, t, e, r, n), s.bindBuffer(u, null);
}, De.prototype.isDestroyed = function() {
	return !1;
}, De.prototype.destroy = function() {
	return this._gl.deleteBuffer(this._buffer), Me(this);
};
const Be = {
	requestFullscreen: void 0,
	exitFullscreen: void 0,
	fullscreenEnabled: void 0,
	fullscreenElement: void 0,
	fullscreenchange: void 0,
	fullscreenerror: void 0
}, Ue = {};
let je, qe, Ge, ke, We, Ve, He, Ye, Xe, $e, Ke, Ze, Qe, Je, et, tt;
function rt(e) {
	const t = e.split(".");
	for (let r = 0, n = t.length; r < n; ++r) t[r] = parseInt(t[r], 10);
	return t;
}
function nt() {
	if (!C(qe) && (qe = !1, !at())) {
		const e = / Chrome\/([\.0-9]+)/.exec(je.userAgent);
		null !== e && (qe = !0, Ge = rt(e[1]));
	}
	return qe;
}
function it() {
	if (!C(ke) && (ke = !1, !nt() && !at() && / Safari\/[\.0-9]+/.test(je.userAgent))) {
		const e = / Version\/([\.0-9]+)/.exec(je.userAgent);
		null !== e && (ke = !0, We = rt(e[1]));
	}
	return ke;
}
function ot() {
	if (!C(Ve)) {
		Ve = !1;
		const e = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(je.userAgent);
		null !== e && (Ve = !0, He = rt(e[1]), He.isNightly = !!e[2]);
	}
	return Ve;
}
function at() {
	if (!C(Ye)) {
		Ye = !1;
		const e = / Edg\/([\.0-9]+)/.exec(je.userAgent);
		null !== e && (Ye = !0, Xe = rt(e[1]));
	}
	return Ye;
}
function st() {
	if (!C($e)) {
		$e = !1;
		const e = /Firefox\/([\.0-9]+)/.exec(je.userAgent);
		null !== e && ($e = !0, Ke = rt(e[1]));
	}
	return $e;
}
function ut() {
	if (!C(tt)) {
		const e = document.createElement("canvas");
		e.setAttribute("style", "image-rendering: -moz-crisp-edges;image-rendering: pixelated;");
		const t = e.style.imageRendering;
		tt = C(t) && "" !== t, tt && (et = t);
	}
	return tt;
}
function ct() {
	if (!ct.initialized) throw new N("You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP");
	return ct._result;
}
Object.defineProperties(Ue, {
	element: { get: function() {
		if (Ue.supportsFullscreen()) return document[Be.fullscreenElement];
	} },
	changeEventName: { get: function() {
		if (Ue.supportsFullscreen()) return Be.fullscreenchange;
	} },
	errorEventName: { get: function() {
		if (Ue.supportsFullscreen()) return Be.fullscreenerror;
	} },
	enabled: { get: function() {
		if (Ue.supportsFullscreen()) return document[Be.fullscreenEnabled];
	} },
	fullscreen: { get: function() {
		if (Ue.supportsFullscreen()) return null !== Ue.element;
	} }
}), Ue.supportsFullscreen = function() {
	if (C(ze)) return ze;
	ze = !1;
	const e = document.body;
	if ("function" == typeof e.requestFullscreen) return Be.requestFullscreen = "requestFullscreen", Be.exitFullscreen = "exitFullscreen", Be.fullscreenEnabled = "fullscreenEnabled", Be.fullscreenElement = "fullscreenElement", Be.fullscreenchange = "fullscreenchange", Be.fullscreenerror = "fullscreenerror", ze = !0, ze;
	const t = [
		"webkit",
		"moz",
		"o",
		"ms",
		"khtml"
	];
	let r;
	for (let n = 0, i = t.length; n < i; ++n) {
		const i = t[n];
		r = `${i}RequestFullscreen`, "function" == typeof e[r] ? (Be.requestFullscreen = r, ze = !0) : (r = `${i}RequestFullScreen`, "function" == typeof e[r] && (Be.requestFullscreen = r, ze = !0)), r = `${i}ExitFullscreen`, "function" == typeof document[r] ? Be.exitFullscreen = r : (r = `${i}CancelFullScreen`, "function" == typeof document[r] && (Be.exitFullscreen = r)), r = `${i}FullscreenEnabled`, void 0 !== document[r] ? Be.fullscreenEnabled = r : (r = `${i}FullScreenEnabled`, void 0 !== document[r] && (Be.fullscreenEnabled = r)), r = `${i}FullscreenElement`, void 0 !== document[r] ? Be.fullscreenElement = r : (r = `${i}FullScreenElement`, void 0 !== document[r] && (Be.fullscreenElement = r)), r = `${i}fullscreenchange`, void 0 !== document[`on${r}`] && ("ms" === i && (r = "MSFullscreenChange"), Be.fullscreenchange = r), r = `${i}fullscreenerror`, void 0 !== document[`on${r}`] && ("ms" === i && (r = "MSFullscreenError"), Be.fullscreenerror = r);
	}
	return ze;
}, Ue.requestFullscreen = function(e, t) {
	Ue.supportsFullscreen() && e[Be.requestFullscreen]({ vrDisplay: t });
}, Ue.exitFullscreen = function() {
	Ue.supportsFullscreen() && document[Be.exitFullscreen]();
}, Ue._names = Be, je = "undefined" != typeof navigator ? navigator : {}, ct._promise = void 0, ct._result = void 0, ct.initialize = function() {
	return C(ct._promise) || (ct._promise = new Promise((e) => {
		const t = new Image();
		t.onload = function() {
			ct._result = t.width > 0 && t.height > 0, e(ct._result);
		}, t.onerror = function() {
			ct._result = !1, e(ct._result);
		}, t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
	})), ct._promise;
}, Object.defineProperties(ct, { initialized: { get: function() {
	return C(ct._result);
} } });
const lt = [];
"undefined" != typeof ArrayBuffer && (lt.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), "undefined" != typeof Uint8ClampedArray && lt.push(Uint8ClampedArray), "undefined" != typeof Uint8ClampedArray && lt.push(Uint8ClampedArray), "undefined" != typeof BigInt64Array && lt.push(BigInt64Array), "undefined" != typeof BigUint64Array && lt.push(BigUint64Array));
const ft = {
	isChrome: nt,
	chromeVersion: function() {
		return nt() && Ge;
	},
	isSafari: it,
	safariVersion: function() {
		return it() && We;
	},
	isWebkit: ot,
	webkitVersion: function() {
		return ot() && He;
	},
	isEdge: at,
	edgeVersion: function() {
		return at() && Xe;
	},
	isFirefox: st,
	firefoxVersion: function() {
		return st() && Ke;
	},
	isWindows: function() {
		return C(Ze) || (Ze = /Windows/i.test(je.appVersion)), Ze;
	},
	isIPadOrIOS: function() {
		return C(Qe) || (Qe = "iPhone" === navigator.platform || "iPod" === navigator.platform || "iPad" === navigator.platform), Qe;
	},
	hardwareConcurrency: je.hardwareConcurrency ?? 3,
	supportsPointerEvents: function() {
		return C(Je) || (Je = !st() && "undefined" != typeof PointerEvent && (!C(je.pointerEnabled) || je.pointerEnabled)), Je;
	},
	supportsImageRenderingPixelated: ut,
	supportsWebP: ct,
	imageRenderingValue: function() {
		return ut() ? et : void 0;
	},
	typedArrayTypes: lt
};
function ht(e, t, r) {
	return r < 0 && (r += 1), r > 1 && (r -= 1), 6 * r < 1 ? e + 6 * (t - e) * r : 2 * r < 1 ? t : 3 * r < 2 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
ft.supportsBasis = function(e) {
	return ft.supportsWebAssembly() && e.context.supportsBasis;
}, ft.supportsFullscreen = function() {
	return Ue.supportsFullscreen();
}, ft.supportsTypedArrays = function() {
	return "undefined" != typeof ArrayBuffer;
}, ft.supportsBigInt64Array = function() {
	return "undefined" != typeof BigInt64Array;
}, ft.supportsBigUint64Array = function() {
	return "undefined" != typeof BigUint64Array;
}, ft.supportsBigInt = function() {
	return "undefined" != typeof BigInt;
}, ft.supportsWebWorkers = function() {
	return "undefined" != typeof Worker;
}, ft.supportsWebAssembly = function() {
	return "undefined" != typeof WebAssembly;
}, ft.supportsWebgl2 = function(e) {
	return v.defined("scene", e), e.context.webgl2;
}, ft.supportsEsmWebWorkers = function() {
	return !st() || parseInt(Ke) >= 114;
};
var pt = class e {
	constructor(e, t, r, n) {
		this.red = e ?? 1, this.green = t ?? 1, this.blue = r ?? 1, this.alpha = n ?? 1;
	}
	static fromCartesian4(t, r) {
		return v.typeOf.object("cartesian", t), C(r) ? (r.red = t.x, r.green = t.y, r.blue = t.z, r.alpha = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static fromBytes(t, r, n, i, o) {
		return t = e.byteToFloat(t ?? 255), r = e.byteToFloat(r ?? 255), n = e.byteToFloat(n ?? 255), i = e.byteToFloat(i ?? 255), C(o) ? (o.red = t, o.green = r, o.blue = n, o.alpha = i, o) : new e(t, r, n, i);
	}
	static fromAlpha(t, r, n) {
		return v.typeOf.object("color", t), v.typeOf.number("alpha", r), C(n) ? (n.red = t.red, n.green = t.green, n.blue = t.blue, n.alpha = r, n) : new e(t.red, t.green, t.blue, r);
	}
	static fromRgba(t, r) {
		return dt[0] = t, e.fromBytes(yt[0], yt[1], yt[2], yt[3], r);
	}
	static fromHsl(t, r, n, i, o) {
		t = (t ?? 0) % 1, i = i ?? 1;
		let a = n = n ?? 0, s = n, u = n;
		if (0 !== (r = r ?? 0)) {
			let e;
			e = n < .5 ? n * (1 + r) : n + r - n * r;
			const i = 2 * n - e;
			a = ht(i, e, t + 1 / 3), s = ht(i, e, t), u = ht(i, e, t - 1 / 3);
		}
		return C(o) ? (o.red = a, o.green = s, o.blue = u, o.alpha = i, o) : new e(a, s, u, i);
	}
	static fromRandom(t, r) {
		let n = (t = t ?? J.EMPTY_OBJECT).red;
		if (!C(n)) {
			const e = t.minimumRed ?? 0, r = t.maximumRed ?? 1;
			v.typeOf.number.lessThanOrEquals("minimumRed", e, r), n = e + L.nextRandomNumber() * (r - e);
		}
		let i = t.green;
		if (!C(i)) {
			const e = t.minimumGreen ?? 0, r = t.maximumGreen ?? 1;
			v.typeOf.number.lessThanOrEquals("minimumGreen", e, r), i = e + L.nextRandomNumber() * (r - e);
		}
		let o = t.blue;
		if (!C(o)) {
			const e = t.minimumBlue ?? 0, r = t.maximumBlue ?? 1;
			v.typeOf.number.lessThanOrEquals("minimumBlue", e, r), o = e + L.nextRandomNumber() * (r - e);
		}
		let a = t.alpha;
		if (!C(a)) {
			const e = t.minimumAlpha ?? 0, r = t.maximumAlpha ?? 1;
			v.typeOf.number.lessThanOrEquals("minimumAlpha", e, r), a = e + L.nextRandomNumber() * (r - e);
		}
		return C(r) ? (r.red = n, r.green = i, r.blue = o, r.alpha = a, r) : new e(n, i, o, a);
	}
	static fromCssColorString(t, r) {
		v.typeOf.string("color", t), C(r) || (r = new e()), t = t.trim();
		const n = e[t.toUpperCase()];
		if (C(n)) return e.clone(n, r), r;
		let i = _t.exec(t);
		return null !== i ? (r.red = parseInt(i[1], 16) / 15, r.green = parseInt(i[2], 16) / 15, r.blue = parseInt(i[3], 16) / 15, r.alpha = parseInt(i[4] ?? "f", 16) / 15, r) : (i = gt.exec(t), null !== i ? (r.red = parseInt(i[1], 16) / 255, r.green = parseInt(i[2], 16) / 255, r.blue = parseInt(i[3], 16) / 255, r.alpha = parseInt(i[4] ?? "ff", 16) / 255, r) : (i = Et.exec(t), null !== i ? (r.red = parseFloat(i[1]) / ("%" === i[1].substr(-1) ? 100 : 255), r.green = parseFloat(i[2]) / ("%" === i[2].substr(-1) ? 100 : 255), r.blue = parseFloat(i[3]) / ("%" === i[3].substr(-1) ? 100 : 255), r.alpha = parseFloat(i[4] ?? "1.0"), r) : (i = bt.exec(t), null !== i ? e.fromHsl(parseFloat(i[1]) / 360, parseFloat(i[2]) / 100, parseFloat(i[3]) / 100, parseFloat(i[4] ?? "1.0"), r) : r = void 0)));
	}
	static pack(e, t, r) {
		return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, t[r++] = e.red, t[r++] = e.green, t[r++] = e.blue, t[r] = e.alpha, t;
	}
	static unpack(t, r, n) {
		return v.defined("array", t), r = r ?? 0, C(n) || (n = new e()), n.red = t[r++], n.green = t[r++], n.blue = t[r++], n.alpha = t[r], n;
	}
	static byteToFloat(e) {
		return e / 255;
	}
	static floatToByte(e) {
		return 1 === e ? 255 : 256 * e | 0;
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r.red = t.red, r.green = t.green, r.blue = t.blue, r.alpha = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && e.red === t.red && e.green === t.green && e.blue === t.blue && e.alpha === t.alpha;
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
		return this === e || C(e) && Math.abs(this.red - e.red) <= t && Math.abs(this.green - e.green) <= t && Math.abs(this.blue - e.blue) <= t && Math.abs(this.alpha - e.alpha) <= t;
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
			let i = e.floatToByte(this.alpha).toString(16);
			return i.length < 2 && (i = `0${i}`), `#${t}${r}${n}${i}`;
		}
		return `#${t}${r}${n}`;
	}
	toBytes(t) {
		const r = e.floatToByte(this.red), n = e.floatToByte(this.green), i = e.floatToByte(this.blue), o = e.floatToByte(this.alpha);
		return C(t) ? (t[0] = r, t[1] = n, t[2] = i, t[3] = o, t) : [
			r,
			n,
			i,
			o
		];
	}
	static bytesToRgba(e, t, r, n) {
		return yt[0] = e, yt[1] = t, yt[2] = r, yt[3] = n, dt[0];
	}
	toRgba() {
		return e.bytesToRgba(e.floatToByte(this.red), e.floatToByte(this.green), e.floatToByte(this.blue), e.floatToByte(this.alpha));
	}
	brighten(e, t) {
		return v.typeOf.number("magnitude", e), v.typeOf.number.greaterThanOrEquals("magnitude", e, 0), v.typeOf.object("result", t), e = 1 - e, t.red = 1 - (1 - this.red) * e, t.green = 1 - (1 - this.green) * e, t.blue = 1 - (1 - this.blue) * e, t.alpha = this.alpha, t;
	}
	darken(e, t) {
		return v.typeOf.number("magnitude", e), v.typeOf.number.greaterThanOrEquals("magnitude", e, 0), v.typeOf.object("result", t), e = 1 - e, t.red = this.red * e, t.green = this.green * e, t.blue = this.blue * e, t.alpha = this.alpha, t;
	}
	withAlpha(t, r) {
		return e.fromAlpha(this, t, r);
	}
	static add(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.red = e.red + t.red, r.green = e.green + t.green, r.blue = e.blue + t.blue, r.alpha = e.alpha + t.alpha, r;
	}
	static subtract(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.red = e.red - t.red, r.green = e.green - t.green, r.blue = e.blue - t.blue, r.alpha = e.alpha - t.alpha, r;
	}
	static multiply(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.red = e.red * t.red, r.green = e.green * t.green, r.blue = e.blue * t.blue, r.alpha = e.alpha * t.alpha, r;
	}
	static divide(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.red = e.red / t.red, r.green = e.green / t.green, r.blue = e.blue / t.blue, r.alpha = e.alpha / t.alpha, r;
	}
	static mod(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.red = e.red % t.red, r.green = e.green % t.green, r.blue = e.blue % t.blue, r.alpha = e.alpha % t.alpha, r;
	}
	static lerp(e, t, r, n) {
		return v.typeOf.object("start", e), v.typeOf.object("end", t), v.typeOf.number("t", r), v.typeOf.object("result", n), n.red = L.lerp(e.red, t.red, r), n.green = L.lerp(e.green, t.green, r), n.blue = L.lerp(e.blue, t.blue, r), n.alpha = L.lerp(e.alpha, t.alpha, r), n;
	}
	static multiplyByScalar(e, t, r) {
		return v.typeOf.object("color", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r.red = e.red * t, r.green = e.green * t, r.blue = e.blue * t, r.alpha = e.alpha * t, r;
	}
	static divideByScalar(e, t, r) {
		return v.typeOf.object("color", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r.red = e.red / t, r.green = e.green / t, r.blue = e.blue / t, r.alpha = e.alpha / t, r;
	}
};
let mt, dt, yt;
ft.supportsTypedArrays() && (mt = /* @__PURE__ */ new ArrayBuffer(4), dt = new Uint32Array(mt), yt = new Uint8Array(mt));
const _t = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i, gt = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i, Et = /^rgba?\s*\(\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i, bt = /^hsla?\s*\(\s*([0-9.]+)\s*[,\s]+\s*([0-9.]+%)\s*[,\s]+\s*([0-9.]+%)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
pt.packedLength = 4, pt.ALICEBLUE = Object.freeze(pt.fromCssColorString("#F0F8FF")), pt.ANTIQUEWHITE = Object.freeze(pt.fromCssColorString("#FAEBD7")), pt.AQUA = Object.freeze(pt.fromCssColorString("#00FFFF")), pt.AQUAMARINE = Object.freeze(pt.fromCssColorString("#7FFFD4")), pt.AZURE = Object.freeze(pt.fromCssColorString("#F0FFFF")), pt.BEIGE = Object.freeze(pt.fromCssColorString("#F5F5DC")), pt.BISQUE = Object.freeze(pt.fromCssColorString("#FFE4C4")), pt.BLACK = Object.freeze(pt.fromCssColorString("#000000")), pt.BLANCHEDALMOND = Object.freeze(pt.fromCssColorString("#FFEBCD")), pt.BLUE = Object.freeze(pt.fromCssColorString("#0000FF")), pt.BLUEVIOLET = Object.freeze(pt.fromCssColorString("#8A2BE2")), pt.BROWN = Object.freeze(pt.fromCssColorString("#A52A2A")), pt.BURLYWOOD = Object.freeze(pt.fromCssColorString("#DEB887")), pt.CADETBLUE = Object.freeze(pt.fromCssColorString("#5F9EA0")), pt.CHARTREUSE = Object.freeze(pt.fromCssColorString("#7FFF00")), pt.CHOCOLATE = Object.freeze(pt.fromCssColorString("#D2691E")), pt.CORAL = Object.freeze(pt.fromCssColorString("#FF7F50")), pt.CORNFLOWERBLUE = Object.freeze(pt.fromCssColorString("#6495ED")), pt.CORNSILK = Object.freeze(pt.fromCssColorString("#FFF8DC")), pt.CRIMSON = Object.freeze(pt.fromCssColorString("#DC143C")), pt.CYAN = Object.freeze(pt.fromCssColorString("#00FFFF")), pt.DARKBLUE = Object.freeze(pt.fromCssColorString("#00008B")), pt.DARKCYAN = Object.freeze(pt.fromCssColorString("#008B8B")), pt.DARKGOLDENROD = Object.freeze(pt.fromCssColorString("#B8860B")), pt.DARKGRAY = Object.freeze(pt.fromCssColorString("#A9A9A9")), pt.DARKGREEN = Object.freeze(pt.fromCssColorString("#006400")), pt.DARKGREY = pt.DARKGRAY, pt.DARKKHAKI = Object.freeze(pt.fromCssColorString("#BDB76B")), pt.DARKMAGENTA = Object.freeze(pt.fromCssColorString("#8B008B")), pt.DARKOLIVEGREEN = Object.freeze(pt.fromCssColorString("#556B2F")), pt.DARKORANGE = Object.freeze(pt.fromCssColorString("#FF8C00")), pt.DARKORCHID = Object.freeze(pt.fromCssColorString("#9932CC")), pt.DARKRED = Object.freeze(pt.fromCssColorString("#8B0000")), pt.DARKSALMON = Object.freeze(pt.fromCssColorString("#E9967A")), pt.DARKSEAGREEN = Object.freeze(pt.fromCssColorString("#8FBC8F")), pt.DARKSLATEBLUE = Object.freeze(pt.fromCssColorString("#483D8B")), pt.DARKSLATEGRAY = Object.freeze(pt.fromCssColorString("#2F4F4F")), pt.DARKSLATEGREY = pt.DARKSLATEGRAY, pt.DARKTURQUOISE = Object.freeze(pt.fromCssColorString("#00CED1")), pt.DARKVIOLET = Object.freeze(pt.fromCssColorString("#9400D3")), pt.DEEPPINK = Object.freeze(pt.fromCssColorString("#FF1493")), pt.DEEPSKYBLUE = Object.freeze(pt.fromCssColorString("#00BFFF")), pt.DIMGRAY = Object.freeze(pt.fromCssColorString("#696969")), pt.DIMGREY = pt.DIMGRAY, pt.DODGERBLUE = Object.freeze(pt.fromCssColorString("#1E90FF")), pt.FIREBRICK = Object.freeze(pt.fromCssColorString("#B22222")), pt.FLORALWHITE = Object.freeze(pt.fromCssColorString("#FFFAF0")), pt.FORESTGREEN = Object.freeze(pt.fromCssColorString("#228B22")), pt.FUCHSIA = Object.freeze(pt.fromCssColorString("#FF00FF")), pt.GAINSBORO = Object.freeze(pt.fromCssColorString("#DCDCDC")), pt.GHOSTWHITE = Object.freeze(pt.fromCssColorString("#F8F8FF")), pt.GOLD = Object.freeze(pt.fromCssColorString("#FFD700")), pt.GOLDENROD = Object.freeze(pt.fromCssColorString("#DAA520")), pt.GRAY = Object.freeze(pt.fromCssColorString("#808080")), pt.GREEN = Object.freeze(pt.fromCssColorString("#008000")), pt.GREENYELLOW = Object.freeze(pt.fromCssColorString("#ADFF2F")), pt.GREY = pt.GRAY, pt.HONEYDEW = Object.freeze(pt.fromCssColorString("#F0FFF0")), pt.HOTPINK = Object.freeze(pt.fromCssColorString("#FF69B4")), pt.INDIANRED = Object.freeze(pt.fromCssColorString("#CD5C5C")), pt.INDIGO = Object.freeze(pt.fromCssColorString("#4B0082")), pt.IVORY = Object.freeze(pt.fromCssColorString("#FFFFF0")), pt.KHAKI = Object.freeze(pt.fromCssColorString("#F0E68C")), pt.LAVENDER = Object.freeze(pt.fromCssColorString("#E6E6FA")), pt.LAVENDAR_BLUSH = Object.freeze(pt.fromCssColorString("#FFF0F5")), pt.LAWNGREEN = Object.freeze(pt.fromCssColorString("#7CFC00")), pt.LEMONCHIFFON = Object.freeze(pt.fromCssColorString("#FFFACD")), pt.LIGHTBLUE = Object.freeze(pt.fromCssColorString("#ADD8E6")), pt.LIGHTCORAL = Object.freeze(pt.fromCssColorString("#F08080")), pt.LIGHTCYAN = Object.freeze(pt.fromCssColorString("#E0FFFF")), pt.LIGHTGOLDENRODYELLOW = Object.freeze(pt.fromCssColorString("#FAFAD2")), pt.LIGHTGRAY = Object.freeze(pt.fromCssColorString("#D3D3D3")), pt.LIGHTGREEN = Object.freeze(pt.fromCssColorString("#90EE90")), pt.LIGHTGREY = pt.LIGHTGRAY, pt.LIGHTPINK = Object.freeze(pt.fromCssColorString("#FFB6C1")), pt.LIGHTSEAGREEN = Object.freeze(pt.fromCssColorString("#20B2AA")), pt.LIGHTSKYBLUE = Object.freeze(pt.fromCssColorString("#87CEFA")), pt.LIGHTSLATEGRAY = Object.freeze(pt.fromCssColorString("#778899")), pt.LIGHTSLATEGREY = pt.LIGHTSLATEGRAY, pt.LIGHTSTEELBLUE = Object.freeze(pt.fromCssColorString("#B0C4DE")), pt.LIGHTYELLOW = Object.freeze(pt.fromCssColorString("#FFFFE0")), pt.LIME = Object.freeze(pt.fromCssColorString("#00FF00")), pt.LIMEGREEN = Object.freeze(pt.fromCssColorString("#32CD32")), pt.LINEN = Object.freeze(pt.fromCssColorString("#FAF0E6")), pt.MAGENTA = Object.freeze(pt.fromCssColorString("#FF00FF")), pt.MAROON = Object.freeze(pt.fromCssColorString("#800000")), pt.MEDIUMAQUAMARINE = Object.freeze(pt.fromCssColorString("#66CDAA")), pt.MEDIUMBLUE = Object.freeze(pt.fromCssColorString("#0000CD")), pt.MEDIUMORCHID = Object.freeze(pt.fromCssColorString("#BA55D3")), pt.MEDIUMPURPLE = Object.freeze(pt.fromCssColorString("#9370DB")), pt.MEDIUMSEAGREEN = Object.freeze(pt.fromCssColorString("#3CB371")), pt.MEDIUMSLATEBLUE = Object.freeze(pt.fromCssColorString("#7B68EE")), pt.MEDIUMSPRINGGREEN = Object.freeze(pt.fromCssColorString("#00FA9A")), pt.MEDIUMTURQUOISE = Object.freeze(pt.fromCssColorString("#48D1CC")), pt.MEDIUMVIOLETRED = Object.freeze(pt.fromCssColorString("#C71585")), pt.MIDNIGHTBLUE = Object.freeze(pt.fromCssColorString("#191970")), pt.MINTCREAM = Object.freeze(pt.fromCssColorString("#F5FFFA")), pt.MISTYROSE = Object.freeze(pt.fromCssColorString("#FFE4E1")), pt.MOCCASIN = Object.freeze(pt.fromCssColorString("#FFE4B5")), pt.NAVAJOWHITE = Object.freeze(pt.fromCssColorString("#FFDEAD")), pt.NAVY = Object.freeze(pt.fromCssColorString("#000080")), pt.OLDLACE = Object.freeze(pt.fromCssColorString("#FDF5E6")), pt.OLIVE = Object.freeze(pt.fromCssColorString("#808000")), pt.OLIVEDRAB = Object.freeze(pt.fromCssColorString("#6B8E23")), pt.ORANGE = Object.freeze(pt.fromCssColorString("#FFA500")), pt.ORANGERED = Object.freeze(pt.fromCssColorString("#FF4500")), pt.ORCHID = Object.freeze(pt.fromCssColorString("#DA70D6")), pt.PALEGOLDENROD = Object.freeze(pt.fromCssColorString("#EEE8AA")), pt.PALEGREEN = Object.freeze(pt.fromCssColorString("#98FB98")), pt.PALETURQUOISE = Object.freeze(pt.fromCssColorString("#AFEEEE")), pt.PALEVIOLETRED = Object.freeze(pt.fromCssColorString("#DB7093")), pt.PAPAYAWHIP = Object.freeze(pt.fromCssColorString("#FFEFD5")), pt.PEACHPUFF = Object.freeze(pt.fromCssColorString("#FFDAB9")), pt.PERU = Object.freeze(pt.fromCssColorString("#CD853F")), pt.PINK = Object.freeze(pt.fromCssColorString("#FFC0CB")), pt.PLUM = Object.freeze(pt.fromCssColorString("#DDA0DD")), pt.POWDERBLUE = Object.freeze(pt.fromCssColorString("#B0E0E6")), pt.PURPLE = Object.freeze(pt.fromCssColorString("#800080")), pt.RED = Object.freeze(pt.fromCssColorString("#FF0000")), pt.ROSYBROWN = Object.freeze(pt.fromCssColorString("#BC8F8F")), pt.ROYALBLUE = Object.freeze(pt.fromCssColorString("#4169E1")), pt.SADDLEBROWN = Object.freeze(pt.fromCssColorString("#8B4513")), pt.SALMON = Object.freeze(pt.fromCssColorString("#FA8072")), pt.SANDYBROWN = Object.freeze(pt.fromCssColorString("#F4A460")), pt.SEAGREEN = Object.freeze(pt.fromCssColorString("#2E8B57")), pt.SEASHELL = Object.freeze(pt.fromCssColorString("#FFF5EE")), pt.SIENNA = Object.freeze(pt.fromCssColorString("#A0522D")), pt.SILVER = Object.freeze(pt.fromCssColorString("#C0C0C0")), pt.SKYBLUE = Object.freeze(pt.fromCssColorString("#87CEEB")), pt.SLATEBLUE = Object.freeze(pt.fromCssColorString("#6A5ACD")), pt.SLATEGRAY = Object.freeze(pt.fromCssColorString("#708090")), pt.SLATEGREY = pt.SLATEGRAY, pt.SNOW = Object.freeze(pt.fromCssColorString("#FFFAFA")), pt.SPRINGGREEN = Object.freeze(pt.fromCssColorString("#00FF7F")), pt.STEELBLUE = Object.freeze(pt.fromCssColorString("#4682B4")), pt.TAN = Object.freeze(pt.fromCssColorString("#D2B48C")), pt.TEAL = Object.freeze(pt.fromCssColorString("#008080")), pt.THISTLE = Object.freeze(pt.fromCssColorString("#D8BFD8")), pt.TOMATO = Object.freeze(pt.fromCssColorString("#FF6347")), pt.TURQUOISE = Object.freeze(pt.fromCssColorString("#40E0D0")), pt.VIOLET = Object.freeze(pt.fromCssColorString("#EE82EE")), pt.WHEAT = Object.freeze(pt.fromCssColorString("#F5DEB3")), pt.WHITE = Object.freeze(pt.fromCssColorString("#FFFFFF")), pt.WHITESMOKE = Object.freeze(pt.fromCssColorString("#F5F5F5")), pt.YELLOW = Object.freeze(pt.fromCssColorString("#FFFF00")), pt.YELLOWGREEN = Object.freeze(pt.fromCssColorString("#9ACD32")), pt.TRANSPARENT = Object.freeze(new pt(0, 0, 0, 0));
var wt = class e {
	constructor(e, t) {
		this.x = e ?? 0, this.y = t ?? 0;
	}
	static fromElements(t, r, n) {
		return C(n) ? (n.x = t, n.y = r, n) : new e(t, r);
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r.x = t.x, r.y = t.y, r) : new e(t.x, t.y);
	}
	static pack(e, t, r) {
		return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r] = e.y, t;
	}
	static unpack(t, r, n) {
		return v.defined("array", t), r = r ?? 0, C(n) || (n = new e()), n.x = t[r++], n.y = t[r], n;
	}
	static packArray(t, r) {
		v.defined("array", t);
		const n = t.length, i = 2 * n;
		if (C(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new N("If result is a typed array, it must have exactly array.length * 2 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 2 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (v.defined("array", t), v.typeOf.number.greaterThanOrEquals("array.length", t.length, 2), t.length % 2 != 0) throw new N("array length must be a multiple of 2.");
		const n = t.length;
		C(r) ? r.length = n / 2 : r = new Array(n / 2);
		for (let i = 0; i < n; i += 2) {
			const n = i / 2;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return v.typeOf.object("cartesian", e), Math.max(e.x, e.y);
	}
	static minimumComponent(e) {
		return v.typeOf.object("cartesian", e), Math.min(e.x, e.y);
	}
	static minimumByComponent(e, t, r) {
		return v.typeOf.object("first", e), v.typeOf.object("second", t), v.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r;
	}
	static maximumByComponent(e, t, r) {
		return v.typeOf.object("first", e), v.typeOf.object("second", t), v.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r;
	}
	static clamp(e, t, r, n) {
		v.typeOf.object("value", e), v.typeOf.object("min", t), v.typeOf.object("max", r), v.typeOf.object("result", n);
		const i = L.clamp(e.x, t.x, r.x), o = L.clamp(e.y, t.y, r.y);
		return n.x = i, n.y = o, n;
	}
	static magnitudeSquared(e) {
		return v.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return v.typeOf.object("left", t), v.typeOf.object("right", r), e.subtract(t, r, Tt), e.magnitude(Tt);
	}
	static distanceSquared(t, r) {
		return v.typeOf.object("left", t), v.typeOf.object("right", r), e.subtract(t, r, Tt), e.magnitudeSquared(Tt);
	}
	static normalize(t, r) {
		v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, isNaN(r.x) || isNaN(r.y)) throw new N("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), e.x * t.x + e.y * t.y;
	}
	static cross(e, t) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), e.x * t.y - e.y * t.x;
	}
	static multiplyComponents(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r;
	}
	static divideComponents(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r;
	}
	static add(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r;
	}
	static subtract(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r;
	}
	static multiplyByScalar(e, t, r) {
		return v.typeOf.object("cartesian", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r;
	}
	static divideByScalar(e, t, r) {
		return v.typeOf.object("cartesian", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r;
	}
	static negate(e, t) {
		return v.typeOf.object("cartesian", e), v.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t;
	}
	static abs(e, t) {
		return v.typeOf.object("cartesian", e), v.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t;
	}
	static lerp(t, r, n, i) {
		return v.typeOf.object("start", t), v.typeOf.object("end", r), v.typeOf.number("t", n), v.typeOf.object("result", i), e.multiplyByScalar(r, n, Ot), i = e.multiplyByScalar(t, 1 - n, i), e.add(Ot, i, i);
	}
	static angleBetween(t, r) {
		return v.typeOf.object("left", t), v.typeOf.object("right", r), e.normalize(t, At), e.normalize(r, xt), L.acosClamped(e.dot(At, xt));
	}
	static mostOrthogonalAxis(t, r) {
		v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = e.normalize(t, Rt);
		return e.abs(n, n), n.x <= n.y ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Y, r);
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && e.x === t.x && e.y === t.y;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || C(e) && C(t) && L.equalsEpsilon(e.x, t.x, r, n) && L.equalsEpsilon(e.y, t.y, r, n);
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
wt.fromCartesian3 = wt.clone, wt.fromCartesian4 = wt.clone, wt.packedLength = 2, wt.fromArray = wt.unpack;
const Tt = new wt(), Ot = new wt(), At = new wt(), xt = new wt(), Rt = new wt();
wt.ZERO = Object.freeze(new wt(0, 0)), wt.ONE = Object.freeze(new wt(1, 1)), wt.UNIT_X = Object.freeze(new wt(1, 0)), wt.UNIT_Y = Object.freeze(new wt(0, 1));
const St = new z(), It = new z();
function Ct(e, t, r, n, i) {
	if (!C(e)) throw new N("cartesian is required.");
	if (!C(t)) throw new N("oneOverRadii is required.");
	if (!C(r)) throw new N("oneOverRadiiSquared is required.");
	if (!C(n)) throw new N("centerToleranceSquared is required.");
	const o = e.x, a = e.y, s = e.z, u = t.x, c = t.y, l = t.z, f = o * o * u * u, h = a * a * c * c, p = s * s * l * l, m = f + h + p, d = Math.sqrt(1 / m), y = z.multiplyByScalar(e, d, St);
	if (m < n) return isFinite(d) ? z.clone(y, i) : void 0;
	const _ = r.x, g = r.y, E = r.z, b = It;
	b.x = y.x * _ * 2, b.y = y.y * g * 2, b.z = y.z * E * 2;
	let w, T, O, A, x, R, S, I, v, P, M, F = (1 - d) * z.magnitude(e) / (.5 * z.magnitude(b)), D = 0;
	do
		F -= D, O = 1 / (1 + F * _), A = 1 / (1 + F * g), x = 1 / (1 + F * E), R = O * O, S = A * A, I = x * x, v = R * O, P = S * A, M = I * x, w = f * R + h * S + p * I - 1, T = f * v * _ + h * P * g + p * M * E, D = w / (-2 * T);
	while (Math.abs(w) > L.EPSILON12);
	return C(i) ? (i.x = o * O, i.y = a * A, i.z = s * x, i) : new z(o * O, a * A, s * x);
}
var Nt = class e {
	constructor(e, t, r) {
		this.longitude = e ?? 0, this.latitude = t ?? 0, this.height = r ?? 0;
	}
	static fromRadians(t, r, n, i) {
		return v.typeOf.number("longitude", t), v.typeOf.number("latitude", r), n = n ?? 0, C(i) ? (i.longitude = t, i.latitude = r, i.height = n, i) : new e(t, r, n);
	}
	static fromDegrees(t, r, n, i) {
		return v.typeOf.number("longitude", t), v.typeOf.number("latitude", r), t = L.toRadians(t), r = L.toRadians(r), e.fromRadians(t, r, n, i);
	}
	static fromCartesian(t, r, n) {
		const i = C(r) ? r.oneOverRadii : e._ellipsoidOneOverRadii, o = C(r) ? r.oneOverRadiiSquared : e._ellipsoidOneOverRadiiSquared, a = Ct(t, i, o, C(r) ? r._centerToleranceSquared : e._ellipsoidCenterToleranceSquared, Pt);
		if (!C(a)) return;
		let s = z.multiplyComponents(a, o, vt);
		s = z.normalize(s, s);
		const u = z.subtract(t, a, Mt), c = Math.atan2(s.y, s.x), l = Math.asin(s.z), f = L.sign(z.dot(u, t)) * z.magnitude(u);
		return C(n) ? (n.longitude = c, n.latitude = l, n.height = f, n) : new e(c, l, f);
	}
	static toCartesian(e, t, r) {
		return v.defined("cartographic", e), z.fromRadians(e.longitude, e.latitude, e.height, t, r);
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r.longitude = t.longitude, r.latitude = t.latitude, r.height = t.height, r) : new e(t.longitude, t.latitude, t.height);
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && e.longitude === t.longitude && e.latitude === t.latitude && e.height === t.height;
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || C(e) && C(t) && Math.abs(e.longitude - t.longitude) <= r && Math.abs(e.latitude - t.latitude) <= r && Math.abs(e.height - t.height) <= r;
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
	static _ellipsoidOneOverRadii = new z(1 / 6378137, 1 / 6378137, 1 / 6356752.314245179);
	static _ellipsoidOneOverRadiiSquared = new z(1 / 40680631590769, 1 / 40680631590769, 1 / 40408299984661.445);
	static _ellipsoidCenterToleranceSquared = L.EPSILON1;
};
Nt.ZERO = Object.freeze(new Nt(0, 0, 0));
const vt = new z(), Pt = new z(), Mt = new z();
function Lt(e, t, r, n) {
	t = t ?? 0, r = r ?? 0, n = n ?? 0, v.typeOf.number.greaterThanOrEquals("x", t, 0), v.typeOf.number.greaterThanOrEquals("y", r, 0), v.typeOf.number.greaterThanOrEquals("z", n, 0), e._radii = new z(t, r, n), e._radiiSquared = new z(t * t, r * r, n * n), e._radiiToTheFourth = new z(t * t * t * t, r * r * r * r, n * n * n * n), e._oneOverRadii = new z(0 === t ? 0 : 1 / t, 0 === r ? 0 : 1 / r, 0 === n ? 0 : 1 / n), e._oneOverRadiiSquared = new z(0 === t ? 0 : 1 / (t * t), 0 === r ? 0 : 1 / (r * r), 0 === n ? 0 : 1 / (n * n)), e._minimumRadius = Math.min(t, r, n), e._maximumRadius = Math.max(t, r, n), e._centerToleranceSquared = L.EPSILON1, 0 !== e._radiiSquared.z && (e._squaredXOverSquaredZ = e._radiiSquared.x / e._radiiSquared.z);
}
var Ft = class e {
	constructor(e, t, r) {
		this._radii = void 0, this._radiiSquared = void 0, this._radiiToTheFourth = void 0, this._oneOverRadii = void 0, this._oneOverRadiiSquared = void 0, this._minimumRadius = void 0, this._maximumRadius = void 0, this._centerToleranceSquared = void 0, this._squaredXOverSquaredZ = void 0, Lt(this, e, t, r);
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
		if (!C(t)) return;
		const n = t._radii;
		return C(r) ? (z.clone(n, r._radii), z.clone(t._radiiSquared, r._radiiSquared), z.clone(t._radiiToTheFourth, r._radiiToTheFourth), z.clone(t._oneOverRadii, r._oneOverRadii), z.clone(t._oneOverRadiiSquared, r._oneOverRadiiSquared), r._minimumRadius = t._minimumRadius, r._maximumRadius = t._maximumRadius, r._centerToleranceSquared = t._centerToleranceSquared, r) : new e(n.x, n.y, n.z);
	}
	static fromCartesian3(t, r) {
		return C(r) || (r = new e()), C(t) ? (Lt(r, t.x, t.y, t.z), r) : r;
	}
	static get default() {
		return e._default;
	}
	static set default(t) {
		v.typeOf.object("value", t), e._default = t, z._ellipsoidRadiiSquared = t.radiiSquared, Nt._ellipsoidOneOverRadii = t.oneOverRadii, Nt._ellipsoidOneOverRadiiSquared = t.oneOverRadiiSquared, Nt._ellipsoidCenterToleranceSquared = t._centerToleranceSquared;
	}
	clone(t) {
		return e.clone(this, t);
	}
	static pack(e, t, r) {
		return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, z.pack(e._radii, t, r), t;
	}
	static unpack(t, r, n) {
		v.defined("array", t), r = r ?? 0;
		const i = z.unpack(t, r);
		return e.fromCartesian3(i, n);
	}
	geodeticSurfaceNormalCartographic(e, t) {
		v.typeOf.object("cartographic", e);
		const r = e.longitude, n = e.latitude, i = Math.cos(n), o = i * Math.cos(r), a = i * Math.sin(r), s = Math.sin(n);
		return C(t) || (t = new z()), t.x = o, t.y = a, t.z = s, z.normalize(t, t);
	}
	geodeticSurfaceNormal(e, t) {
		if (v.typeOf.object("cartesian", e), isNaN(e.x) || isNaN(e.y) || isNaN(e.z)) throw new N("cartesian has a NaN component");
		if (!z.equalsEpsilon(e, z.ZERO, L.EPSILON14)) return C(t) || (t = new z()), t = z.multiplyComponents(e, this._oneOverRadiiSquared, t), z.normalize(t, t);
	}
	cartographicToCartesian(e, t) {
		const r = Dt, n = zt;
		this.geodeticSurfaceNormalCartographic(e, r), z.multiplyComponents(this._radiiSquared, r, n);
		const i = Math.sqrt(z.dot(r, n));
		return z.divideByScalar(n, i, n), z.multiplyByScalar(r, e.height, r), C(t) || (t = new z()), z.add(n, r, t);
	}
	cartographicArrayToCartesianArray(e, t) {
		v.defined("cartographics", e);
		const r = e.length;
		C(t) ? t.length = r : t = new Array(r);
		for (let n = 0; n < r; n++) t[n] = this.cartographicToCartesian(e[n], t[n]);
		return t;
	}
	cartesianToCartographic(e, t) {
		const r = this.scaleToGeodeticSurface(e, Ut);
		if (!C(r)) return;
		const n = this.geodeticSurfaceNormal(r, Bt), i = z.subtract(e, r, jt), o = Math.atan2(n.y, n.x), a = Math.asin(n.z), s = L.sign(z.dot(i, e)) * z.magnitude(i);
		return C(t) ? (t.longitude = o, t.latitude = a, t.height = s, t) : new Nt(o, a, s);
	}
	cartesianArrayToCartographicArray(e, t) {
		v.defined("cartesians", e);
		const r = e.length;
		C(t) ? t.length = r : t = new Array(r);
		for (let n = 0; n < r; ++n) t[n] = this.cartesianToCartographic(e[n], t[n]);
		return t;
	}
	scaleToGeodeticSurface(e, t) {
		return Ct(e, this._oneOverRadii, this._oneOverRadiiSquared, this._centerToleranceSquared, t);
	}
	scaleToGeocentricSurface(e, t) {
		v.typeOf.object("cartesian", e), C(t) || (t = new z());
		const r = e.x, n = e.y, i = e.z, o = this._oneOverRadiiSquared, a = 1 / Math.sqrt(r * r * o.x + n * n * o.y + i * i * o.z);
		return z.multiplyByScalar(e, a, t);
	}
	transformPositionToScaledSpace(e, t) {
		return C(t) || (t = new z()), z.multiplyComponents(e, this._oneOverRadii, t);
	}
	transformPositionFromScaledSpace(e, t) {
		return C(t) || (t = new z()), z.multiplyComponents(e, this._radii, t);
	}
	equals(e) {
		return this === e || C(e) && z.equals(this._radii, e._radii);
	}
	toString() {
		return this._radii.toString();
	}
	getSurfaceNormalIntersectionWithZAxis(e, t, r) {
		if (v.typeOf.object("position", e), !L.equalsEpsilon(this._radii.x, this._radii.y, L.EPSILON15)) throw new N("Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)");
		v.typeOf.number.greaterThan("Ellipsoid.radii.z", this._radii.z, 0), t = t ?? 0;
		const n = this._squaredXOverSquaredZ;
		if (C(r) || (r = new z()), r.x = 0, r.y = 0, r.z = e.z * (1 - n), !(Math.abs(r.z) >= this._radii.z - t)) return r;
	}
	getLocalCurvature(e, t) {
		v.typeOf.object("surfacePosition", e), C(t) || (t = new wt());
		const r = this.getSurfaceNormalIntersectionWithZAxis(e, 0, qt), n = z.distance(e, r), i = n * (this.minimumRadius * n / this.maximumRadius ** 2) ** 2;
		return wt.fromElements(1 / n, 1 / i, t);
	}
	surfaceArea(e) {
		v.typeOf.object("rectangle", e);
		const t = e.west;
		let r = e.east;
		const n = e.south, i = e.north;
		for (; r < t;) r += L.TWO_PI;
		const o = this._radiiSquared, a = o.x, s = o.y, u = o.z, c = a * s;
		return Wt(n, i, function(e) {
			const n = Math.cos(e), i = Math.sin(e);
			return Math.cos(e) * Wt(t, r, function(e) {
				const t = Math.cos(e), r = Math.sin(e);
				return Math.sqrt(c * i * i + u * (s * t * t + a * r * r) * n * n);
			});
		});
	}
};
Ft.WGS84 = Object.freeze(new Ft(6378137, 6378137, 6356752.314245179)), Ft.UNIT_SPHERE = Object.freeze(new Ft(1, 1, 1)), Ft.MOON = Object.freeze(new Ft(L.LUNAR_RADIUS, L.LUNAR_RADIUS, L.LUNAR_RADIUS)), Ft.MARS = Object.freeze(new Ft(3396190, 3396190, 3376200)), Ft._default = Ft.WGS84, Ft.packedLength = z.packedLength, Ft.prototype.geocentricSurfaceNormal = z.normalize;
const Dt = new z(), zt = new z(), Bt = new z(), Ut = new z(), jt = new z(), qt = new z(), Gt = [
	.14887433898163,
	.43339539412925,
	.67940956829902,
	.86506336668898,
	.97390652851717,
	0
], kt = [
	.29552422471475,
	.26926671930999,
	.21908636251598,
	.14945134915058,
	.066671344308684,
	0
];
function Wt(e, t, r) {
	v.typeOf.number("a", e), v.typeOf.number("b", t), v.typeOf.func("func", r);
	const n = .5 * (t + e), i = .5 * (t - e);
	let o = 0;
	for (let a = 0; a < 5; a++) {
		const e = i * Gt[a];
		o += kt[a] * (r(n + e) + r(n - e));
	}
	return o *= i, o;
}
var Vt = class {
	constructor(e) {
		this._ellipsoid = e ?? Ft.default, this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
	}
	get ellipsoid() {
		return this._ellipsoid;
	}
	project(e, t) {
		const r = this._semimajorAxis, n = e.longitude * r, i = e.latitude * r, o = e.height;
		return C(t) ? (t.x = n, t.y = i, t.z = o, t) : new z(n, i, o);
	}
	unproject(e, t) {
		if (!C(e)) throw new N("cartesian is required");
		const r = this._oneOverSemimajorAxis, n = e.x * r, i = e.y * r, o = e.z;
		return C(t) ? (t.longitude = n, t.latitude = i, t.height = o, t) : new Nt(n, i, o);
	}
};
const Ht = {
	OUTSIDE: -1,
	INTERSECTING: 0,
	INSIDE: 1
};
function Yt(e, t, r) {
	v.defined("array", e), v.defined("itemToFind", t), v.defined("comparator", r);
	let n, i, o = 0, a = e.length - 1;
	for (; o <= a;) if (n = ~~((o + a) / 2), i = r(e[n], t), i < 0) o = n + 1;
	else {
		if (!(i > 0)) return n;
		a = n - 1;
	}
	return ~(a + 1);
}
function Xt(e, t, r, n, i) {
	this.xPoleWander = e, this.yPoleWander = t, this.xPoleOffset = r, this.yPoleOffset = n, this.ut1MinusUtc = i;
}
function $t(e) {
	if (null === e || isNaN(e)) throw new N("year is required and must be a number.");
	return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}
Object.freeze(Ht);
const Kt = [
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
function Zt(e, t, r, n, i, o, a, s) {
	e = e ?? 1, t = t ?? 1, r = r ?? 1, n = n ?? 0, i = i ?? 0, o = o ?? 0, a = a ?? 0, s = s ?? !1, v.typeOf.number.greaterThanOrEquals("Year", e, 1), v.typeOf.number.lessThanOrEquals("Year", e, 9999), v.typeOf.number.greaterThanOrEquals("Month", t, 1), v.typeOf.number.lessThanOrEquals("Month", t, 12), v.typeOf.number.greaterThanOrEquals("Day", r, 1), v.typeOf.number.lessThanOrEquals("Day", r, 31), v.typeOf.number.greaterThanOrEquals("Hour", n, 0), v.typeOf.number.lessThanOrEquals("Hour", n, 23), v.typeOf.number.greaterThanOrEquals("Minute", i, 0), v.typeOf.number.lessThanOrEquals("Minute", i, 59), v.typeOf.bool("IsLeapSecond", s), v.typeOf.number.greaterThanOrEquals("Second", o, 0), v.typeOf.number.lessThanOrEquals("Second", o, s ? 60 : 59), v.typeOf.number.greaterThanOrEquals("Millisecond", a, 0), v.typeOf.number.lessThan("Millisecond", a, 1e3), function() {
		const n = 2 === t && $t(e) ? Kt[t - 1] + 1 : Kt[t - 1];
		if (r > n) throw new N("Month and Day represents invalid date");
	}(), this.year = e, this.month = t, this.day = r, this.hour = n, this.minute = i, this.second = o, this.millisecond = a, this.isLeapSecond = s;
}
function Qt(e, t) {
	this.julianDate = e, this.offset = t;
}
const Jt = {
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
Object.freeze(Jt);
const er = {
	UTC: 0,
	TAI: 1
};
Object.freeze(er);
const tr = new Zt(), rr = [
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
function nr(e, t) {
	return Er.compare(e.julianDate, t.julianDate);
}
const ir = new Qt();
function or(e) {
	ir.julianDate = e;
	const t = Er.leapSeconds;
	let r = Yt(t, ir, nr);
	r < 0 && (r = ~r), r >= t.length && (r = t.length - 1);
	let n = t[r].offset;
	r > 0 && Er.secondsDifference(t[r].julianDate, e) > n && (r--, n = t[r].offset), Er.addSeconds(e, n, e);
}
function ar(e, t) {
	ir.julianDate = e;
	const r = Er.leapSeconds;
	let n = Yt(r, ir, nr);
	if (n < 0 && (n = ~n), 0 === n) return Er.addSeconds(e, -r[0].offset, t);
	if (n >= r.length) return Er.addSeconds(e, -r[n - 1].offset, t);
	const i = Er.secondsDifference(r[n].julianDate, e);
	return 0 === i ? Er.addSeconds(e, -r[n].offset, t) : i <= 1 ? void 0 : Er.addSeconds(e, -r[--n].offset, t);
}
function sr(e, t, r) {
	const n = t / Jt.SECONDS_PER_DAY | 0;
	return e += n, (t -= Jt.SECONDS_PER_DAY * n) < 0 && (e--, t += Jt.SECONDS_PER_DAY), r.dayNumber = e, r.secondsOfDay = t, r;
}
function ur(e, t, r, n, i, o, a) {
	const s = (t - 14) / 12 | 0, u = e + 4800 + s;
	let c = (1461 * u / 4 | 0) + (367 * (t - 2 - 12 * s) / 12 | 0) - (3 * ((u + 100) / 100 | 0) / 4 | 0) + r - 32075;
	(n -= 12) < 0 && (n += 24);
	const l = o + (n * Jt.SECONDS_PER_HOUR + i * Jt.SECONDS_PER_MINUTE + a * Jt.SECONDS_PER_MILLISECOND);
	return l >= 43200 && (c -= 1), [c, l];
}
const cr = /^(\d{4})$/, lr = /^(\d{4})-(\d{2})$/, fr = /^(\d{4})-?(\d{3})$/, hr = /^(\d{4})-?W(\d{2})-?(\d{1})?$/, pr = /^(\d{4})-?(\d{2})-?(\d{2})$/, mr = /([Z+\-])?(\d{2})?:?(\d{2})?$/, dr = /^(\d{2})(\.\d+)?/.source + mr.source, yr = /^(\d{2}):?(\d{2})(\.\d+)?/.source + mr.source, _r = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + mr.source, gr = "Invalid ISO 8601 date.";
var Er = class e {
	constructor(e, t, r) {
		this.dayNumber = void 0, this.secondsOfDay = void 0, t = t ?? 0, r = r ?? er.UTC;
		const n = 0 | (e = e ?? 0);
		sr(n, t += (e - n) * Jt.SECONDS_PER_DAY, this), r === er.UTC && or(this);
	}
	static fromGregorianDate(t, r) {
		if (!(t instanceof Zt)) throw new N("date must be a valid GregorianDate.");
		const n = ur(t.year, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
		return C(r) ? (sr(n[0], n[1], r), or(r), r) : new e(n[0], n[1], er.UTC);
	}
	static fromDate(t, r) {
		if (!(t instanceof Date) || isNaN(t.getTime())) throw new N("date must be a valid JavaScript Date.");
		const n = ur(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.getUTCMilliseconds());
		return C(r) ? (sr(n[0], n[1], r), or(r), r) : new e(n[0], n[1], er.UTC);
	}
	static fromIso8601(t, r) {
		if ("string" != typeof t) throw new N(gr);
		let n, i = (t = t.replace(",", ".")).split("T"), o = 1, a = 1, s = 0, u = 0, c = 0, l = 0;
		const f = i[0], h = i[1];
		let p, m, d, y;
		if (!C(f)) throw new N(gr);
		if (i = f.match(pr), null !== i) {
			if (d = f.split("-").length - 1, d > 0 && 2 !== d) throw new N(gr);
			n = +i[1], o = +i[2], a = +i[3];
		} else if (i = f.match(lr), null !== i) n = +i[1], o = +i[2];
		else if (i = f.match(cr), null !== i) n = +i[1];
		else {
			let e;
			if (i = f.match(fr), null !== i) {
				if (n = +i[1], e = +i[2], m = $t(n), e < 1 || m && e > 366 || !m && e > 365) throw new N(gr);
			} else {
				if (i = f.match(hr), null === i) throw new N(gr);
				{
					n = +i[1];
					const t = +i[2], r = +i[3] || 0;
					if (d = f.split("-").length - 1, d > 0 && (!C(i[3]) && 1 !== d || C(i[3]) && 2 !== d)) throw new N(gr);
					e = 7 * t + r - new Date(Date.UTC(n, 0, 4)).getUTCDay() - 3;
				}
			}
			p = new Date(Date.UTC(n, 0, 1)), p.setUTCDate(e), o = p.getUTCMonth() + 1, a = p.getUTCDate();
		}
		if (m = $t(n), o < 1 || o > 12 || a < 1 || (2 !== o || !m) && a > rr[o - 1] || m && 2 === o && a > 29) throw new N(gr);
		if (C(h)) {
			if (i = h.match(_r), null !== i) {
				if (d = h.split(":").length - 1, d > 0 && 2 !== d && 3 !== d) throw new N(gr);
				s = +i[1], u = +i[2], c = +i[3], l = 1e3 * +(i[4] || 0), y = 5;
			} else if (i = h.match(yr), null !== i) {
				if (d = h.split(":").length - 1, d > 2) throw new N(gr);
				s = +i[1], u = +i[2], c = 60 * +(i[3] || 0), y = 4;
			} else {
				if (i = h.match(dr), null === i) throw new N(gr);
				s = +i[1], u = 60 * +(i[2] || 0), y = 3;
			}
			if (u >= 60 || c >= 61 || s > 24 || 24 === s && (u > 0 || c > 0 || l > 0)) throw new N(gr);
			const e = i[y], t = +i[y + 1], r = +(i[y + 2] || 0);
			switch (e) {
				case "+":
					s -= t, u -= r;
					break;
				case "-":
					s += t, u += r;
					break;
				case "Z": break;
				default: u += new Date(Date.UTC(n, o - 1, a, s, u)).getTimezoneOffset();
			}
		}
		const _ = 60 === c;
		for (_ && c--; u >= 60;) u -= 60, s++;
		for (; s >= 24;) s -= 24, a++;
		for (p = m && 2 === o ? 29 : rr[o - 1]; a > p;) a -= p, o++, o > 12 && (o -= 12, n++), p = m && 2 === o ? 29 : rr[o - 1];
		for (; u < 0;) u += 60, s--;
		for (; s < 0;) s += 24, a--;
		for (; a < 1;) o--, o < 1 && (o += 12, n--), p = m && 2 === o ? 29 : rr[o - 1], a += p;
		const g = ur(n, o, a, s, u, c, l);
		return C(r) ? (sr(g[0], g[1], r), or(r)) : r = new e(g[0], g[1], er.UTC), _ && e.addSeconds(r, 1, r), r;
	}
	static now(t) {
		return e.fromDate(/* @__PURE__ */ new Date(), t);
	}
	static toGregorianDate(t, r) {
		if (!C(t)) throw new N("julianDate is required.");
		let n = !1, i = ar(t, br);
		C(i) || (e.addSeconds(t, -1, br), i = ar(br, br), n = !0);
		let o = i.dayNumber;
		const a = i.secondsOfDay;
		a >= 43200 && (o += 1);
		let s = o + 68569 | 0;
		const u = 4 * s / 146097 | 0;
		s = s - ((146097 * u + 3) / 4 | 0) | 0;
		const c = 4e3 * (s + 1) / 1461001 | 0;
		s = s - (1461 * c / 4 | 0) + 31 | 0;
		const l = 80 * s / 2447 | 0, f = s - (2447 * l / 80 | 0) | 0;
		s = l / 11 | 0;
		const h = l + 2 - 12 * s | 0, p = 100 * (u - 49) + c + s | 0;
		let m = a / Jt.SECONDS_PER_HOUR | 0, d = a - m * Jt.SECONDS_PER_HOUR;
		const y = d / Jt.SECONDS_PER_MINUTE | 0;
		d -= y * Jt.SECONDS_PER_MINUTE;
		let _ = 0 | d;
		const g = (d - _) / Jt.SECONDS_PER_MILLISECOND;
		return m += 12, m > 23 && (m -= 24), n && (_ += 1), C(r) ? (r.year = p, r.month = h, r.day = f, r.hour = m, r.minute = y, r.second = _, r.millisecond = g, r.isLeapSecond = n, r) : new Zt(p, h, f, m, y, _, g, n);
	}
	static toDate(t) {
		if (!C(t)) throw new N("julianDate is required.");
		const r = e.toGregorianDate(t, tr);
		let n = r.second;
		return r.isLeapSecond && (n -= 1), new Date(Date.UTC(r.year, r.month - 1, r.day, r.hour, r.minute, n, r.millisecond));
	}
	static toIso8601(t, r) {
		if (!C(t)) throw new N("julianDate is required.");
		const n = e.toGregorianDate(t, tr);
		let i = n.year, o = n.month, a = n.day, s = n.hour;
		const u = n.minute, c = n.second, l = n.millisecond;
		let f;
		if (1e4 === i && 1 === o && 1 === a && 0 === s && 0 === u && 0 === c && 0 === l && (i = 9999, o = 12, a = 31, s = 24), !C(r) && 0 !== l) {
			const e = .01 * l;
			return f = e < 1e-6 ? e.toFixed(20).replace(".", "").replace(/0+$/, "") : e.toString().replace(".", ""), `${i.toString().padStart(4, "0")}-${o.toString().padStart(2, "0")}-${a.toString().padStart(2, "0")}T${s.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${f}Z`;
		}
		return C(r) && 0 !== r ? (f = (.01 * l).toFixed(r).replace(".", "").slice(0, r), `${i.toString().padStart(4, "0")}-${o.toString().padStart(2, "0")}-${a.toString().padStart(2, "0")}T${s.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${f}Z`) : `${i.toString().padStart(4, "0")}-${o.toString().padStart(2, "0")}-${a.toString().padStart(2, "0")}T${s.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}Z`;
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r.dayNumber = t.dayNumber, r.secondsOfDay = t.secondsOfDay, r) : new e(t.dayNumber, t.secondsOfDay, er.TAI);
	}
	static compare(e, t) {
		if (!C(e)) throw new N("left is required.");
		if (!C(t)) throw new N("right is required.");
		const r = e.dayNumber - t.dayNumber;
		return 0 !== r ? r : e.secondsOfDay - t.secondsOfDay;
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && e.dayNumber === t.dayNumber && e.secondsOfDay === t.secondsOfDay;
	}
	static equalsEpsilon(t, r, n) {
		return n = n ?? 0, t === r || C(t) && C(r) && Math.abs(e.secondsDifference(t, r)) <= n;
	}
	static totalDays(e) {
		if (!C(e)) throw new N("julianDate is required.");
		return e.dayNumber + e.secondsOfDay / Jt.SECONDS_PER_DAY;
	}
	static secondsDifference(e, t) {
		if (!C(e)) throw new N("left is required.");
		if (!C(t)) throw new N("right is required.");
		return (e.dayNumber - t.dayNumber) * Jt.SECONDS_PER_DAY + (e.secondsOfDay - t.secondsOfDay);
	}
	static daysDifference(e, t) {
		if (!C(e)) throw new N("left is required.");
		if (!C(t)) throw new N("right is required.");
		return e.dayNumber - t.dayNumber + (e.secondsOfDay - t.secondsOfDay) / Jt.SECONDS_PER_DAY;
	}
	static computeTaiMinusUtc(t) {
		ir.julianDate = t;
		const r = e.leapSeconds;
		let n = Yt(r, ir, nr);
		return n < 0 && (n = ~n, --n, n < 0 && (n = 0)), r[n].offset;
	}
	static addSeconds(e, t, r) {
		if (!C(e)) throw new N("julianDate is required.");
		if (!C(t)) throw new N("seconds is required.");
		if (!C(r)) throw new N("result is required.");
		return sr(e.dayNumber, e.secondsOfDay + t, r);
	}
	static addMinutes(e, t, r) {
		if (!C(e)) throw new N("julianDate is required.");
		if (!C(t)) throw new N("minutes is required.");
		if (!C(r)) throw new N("result is required.");
		const n = e.secondsOfDay + t * Jt.SECONDS_PER_MINUTE;
		return sr(e.dayNumber, n, r);
	}
	static addHours(e, t, r) {
		if (!C(e)) throw new N("julianDate is required.");
		if (!C(t)) throw new N("hours is required.");
		if (!C(r)) throw new N("result is required.");
		const n = e.secondsOfDay + t * Jt.SECONDS_PER_HOUR;
		return sr(e.dayNumber, n, r);
	}
	static addDays(e, t, r) {
		if (!C(e)) throw new N("julianDate is required.");
		if (!C(t)) throw new N("days is required.");
		if (!C(r)) throw new N("result is required.");
		return sr(e.dayNumber + t, e.secondsOfDay, r);
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
const br = new Er(0, 0, er.TAI);
Er.leapSeconds = [
	new Qt(new Er(2441317, 43210, er.TAI), 10),
	new Qt(new Er(2441499, 43211, er.TAI), 11),
	new Qt(new Er(2441683, 43212, er.TAI), 12),
	new Qt(new Er(2442048, 43213, er.TAI), 13),
	new Qt(new Er(2442413, 43214, er.TAI), 14),
	new Qt(new Er(2442778, 43215, er.TAI), 15),
	new Qt(new Er(2443144, 43216, er.TAI), 16),
	new Qt(new Er(2443509, 43217, er.TAI), 17),
	new Qt(new Er(2443874, 43218, er.TAI), 18),
	new Qt(new Er(2444239, 43219, er.TAI), 19),
	new Qt(new Er(2444786, 43220, er.TAI), 20),
	new Qt(new Er(2445151, 43221, er.TAI), 21),
	new Qt(new Er(2445516, 43222, er.TAI), 22),
	new Qt(new Er(2446247, 43223, er.TAI), 23),
	new Qt(new Er(2447161, 43224, er.TAI), 24),
	new Qt(new Er(2447892, 43225, er.TAI), 25),
	new Qt(new Er(2448257, 43226, er.TAI), 26),
	new Qt(new Er(2448804, 43227, er.TAI), 27),
	new Qt(new Er(2449169, 43228, er.TAI), 28),
	new Qt(new Er(2449534, 43229, er.TAI), 29),
	new Qt(new Er(2450083, 43230, er.TAI), 30),
	new Qt(new Er(2450630, 43231, er.TAI), 31),
	new Qt(new Er(2451179, 43232, er.TAI), 32),
	new Qt(new Er(2453736, 43233, er.TAI), 33),
	new Qt(new Er(2454832, 43234, er.TAI), 34),
	new Qt(new Er(2456109, 43235, er.TAI), 35),
	new Qt(new Er(2457204, 43236, er.TAI), 36),
	new Qt(new Er(2457754, 43237, er.TAI), 37)
];
var wr = a((e, t) => {
	(function(r) {
		var n = "object" == typeof e && e && !e.nodeType && e, i = "object" == typeof t && t && !t.nodeType && t, o = "object" == typeof global && global;
		o.global !== o && o.window !== o && o.self !== o || (r = o);
		var a, s, u = 2147483647, c = 36, l = /^xn--/, f = /[^\x20-\x7E]/, h = /[\x2E\u3002\uFF0E\uFF61]/g, p = {
			overflow: "Overflow: input needs wider integers to process",
			"not-basic": "Illegal input >= 0x80 (not a basic code point)",
			"invalid-input": "Invalid input"
		}, m = Math.floor, d = String.fromCharCode;
		function y(e) {
			throw new RangeError(p[e]);
		}
		function _(e, t) {
			for (var r = e.length, n = []; r--;) n[r] = t(e[r]);
			return n;
		}
		function g(e, t) {
			var r = e.split("@"), n = "";
			return r.length > 1 && (n = r[0] + "@", e = r[1]), n + _((e = e.replace(h, ".")).split("."), t).join(".");
		}
		function E(e) {
			for (var t, r, n = [], i = 0, o = e.length; i < o;) (t = e.charCodeAt(i++)) >= 55296 && t <= 56319 && i < o ? 56320 == (64512 & (r = e.charCodeAt(i++))) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), i--) : n.push(t);
			return n;
		}
		function b(e) {
			return _(e, function(e) {
				var t = "";
				return e > 65535 && (t += d((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t + d(e);
			}).join("");
		}
		function w(e) {
			return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : c;
		}
		function T(e, t) {
			return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
		}
		function O(e, t, r) {
			var n = 0;
			for (e = r ? m(e / 700) : e >> 1, e += m(e / t); e > 455; n += c) e = m(e / 35);
			return m(n + 36 * e / (e + 38));
		}
		function A(e) {
			var t, r, n, i, o, a, s, l, f, h = [], p = e.length, d = 0, _ = 128, g = 72, E = e.lastIndexOf("-");
			for (E < 0 && (E = 0), r = 0; r < E; ++r) e.charCodeAt(r) >= 128 && y("not-basic"), h.push(e.charCodeAt(r));
			for (n = E > 0 ? E + 1 : 0; n < p;) {
				for (i = d, o = 1, a = c; n >= p && y("invalid-input"), ((s = w(e.charCodeAt(n++))) >= c || s > m((u - d) / o)) && y("overflow"), d += s * o, !(s < (l = a <= g ? 1 : a >= g + 26 ? 26 : a - g)); a += c) o > m(u / (f = c - l)) && y("overflow"), o *= f;
				g = O(d - i, t = h.length + 1, 0 == i), m(d / t) > u - _ && y("overflow"), _ += m(d / t), d %= t, h.splice(d++, 0, _);
			}
			return b(h);
		}
		function x(e) {
			var t, r, n, i, o, a, s, l, f, h, p, _, g, b, w, A = [];
			for (_ = (e = E(e)).length, t = 128, r = 0, o = 72, a = 0; a < _; ++a) (p = e[a]) < 128 && A.push(d(p));
			for (n = i = A.length, i && A.push("-"); n < _;) {
				for (s = u, a = 0; a < _; ++a) (p = e[a]) >= t && p < s && (s = p);
				for (s - t > m((u - r) / (g = n + 1)) && y("overflow"), r += (s - t) * g, t = s, a = 0; a < _; ++a) if ((p = e[a]) < t && ++r > u && y("overflow"), p == t) {
					for (l = r, f = c; !(l < (h = f <= o ? 1 : f >= o + 26 ? 26 : f - o)); f += c) w = l - h, b = c - h, A.push(d(T(h + w % b, 0))), l = m(w / b);
					A.push(d(T(l, 0))), o = O(r, g, n == i), r = 0, ++n;
				}
				++r, ++t;
			}
			return A.join("");
		}
		if (a = {
			version: "1.3.2",
			ucs2: {
				decode: E,
				encode: b
			},
			decode: A,
			encode: x,
			toASCII: function(e) {
				return g(e, function(e) {
					return f.test(e) ? "xn--" + x(e) : e;
				});
			},
			toUnicode: function(e) {
				return g(e, function(e) {
					return l.test(e) ? A(e.slice(4).toLowerCase()) : e;
				});
			}
		}, "function" == typeof define && "object" == typeof define.amd && define.amd) define("punycode", function() {
			return a;
		});
		else if (n && i) if (t.exports == n) i.exports = a;
		else for (s in a) a.hasOwnProperty(s) && (n[s] = a[s]);
		else r.punycode = a;
	})(e);
}), Tr = a((e, t) => {
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
				var t, r, n = e.toLowerCase().split(":"), i = n.length, o = 8;
				for ("" === n[0] && "" === n[1] && "" === n[2] ? (n.shift(), n.shift()) : "" === n[0] && "" === n[1] ? n.shift() : "" === n[i - 1] && "" === n[i - 2] && n.pop(), -1 !== n[(i = n.length) - 1].indexOf(".") && (o = 7), t = 0; t < i && "" !== n[t]; t++);
				if (t < o) for (n.splice(t, 1, "0000"); n.length < o;) n.splice(t, 0, "0000");
				for (var a = 0; a < o; a++) {
					r = n[a].split("");
					for (var s = 0; s < 3 && "0" === r[0] && r.length > 1; s++) r.splice(0, 1);
					n[a] = r.join("");
				}
				var u = -1, c = 0, l = 0, f = -1, h = !1;
				for (a = 0; a < o; a++) h ? "0" === n[a] ? l += 1 : (h = !1, l > c && (u = f, c = l)) : "0" === n[a] && (h = !0, f = a, l = 1);
				l > c && (u = f, c = l), c > 1 && n.splice(u, c, ""), i = n.length;
				var p = "";
				for ("" === n[0] && (p = ":"), a = 0; a < i && (p += n[a], a !== i - 1); a++) p += ":";
				return "" === n[i - 1] && (p += ":"), p;
			},
			noConflict: function() {
				return e.IPv6 === this && (e.IPv6 = t), this;
			}
		};
	};
	"object" == typeof t && t.exports ? t.exports = n() : "function" == typeof define && define.amd ? define(n) : r.IPv6 = n(r);
}), Or = a((e, t) => {
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
				var i = r.list[e.slice(t + 1)];
				return !!i && i.indexOf(" " + e.slice(n + 1, t) + " ") >= 0;
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
				var i = r.list[e.slice(t + 1)];
				return i ? i.indexOf(" " + e.slice(n + 1, t) + " ") < 0 ? null : e.slice(n + 1) : null;
			},
			noConflict: function() {
				return e.SecondLevelDomains === this && (e.SecondLevelDomains = t), this;
			}
		};
		return r;
	};
	"object" == typeof t && t.exports ? t.exports = n() : "function" == typeof define && define.amd ? define(n) : r.SecondLevelDomains = n(r);
}), Ar = a((e, t) => {
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
		var i = n && n.URI;
		function o(e, t) {
			var r = arguments.length >= 1;
			if (!(this instanceof o)) return r ? arguments.length >= 2 ? new o(e, t) : new o(e) : new o();
			if (void 0 === e) {
				if (r) throw new TypeError("undefined is not a valid argument for URI");
				e = "undefined" != typeof location ? location.href + "" : "";
			}
			if (null === e && r) throw new TypeError("null is not a valid argument for URI");
			return this.href(e), void 0 !== t ? this.absoluteTo(t) : this;
		}
		o.version = "1.19.11";
		var a = o.prototype, s = Object.prototype.hasOwnProperty;
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
			var r, n, i = {};
			if ("RegExp" === c(t)) i = null;
			else if (l(t)) for (r = 0, n = t.length; r < n; r++) i[t[r]] = !0;
			else i[t] = !0;
			for (r = 0, n = e.length; r < n; r++) (i && void 0 !== i[e[r]] || !i && t.test(e[r])) && (e.splice(r, 1), n--, r--);
			return e;
		}
		function h(e, t) {
			var r, n;
			if (l(t)) {
				for (r = 0, n = t.length; r < n; r++) if (!h(e, t[r])) return !1;
				return !0;
			}
			var i = c(t);
			for (r = 0, n = e.length; r < n; r++) if ("RegExp" === i) {
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
		function m(e) {
			return e.replace(/^\/+|\/+$/g, "");
		}
		function d(e) {
			return escape(e);
		}
		function y(e) {
			return encodeURIComponent(e).replace(/[!'()*]/g, d).replace(/\*/g, "%2A");
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
		}, o.getDomAttribute = function(e) {
			if (e && e.nodeName) {
				var t = e.nodeName.toLowerCase();
				if ("input" !== t || "image" === e.type) return o.domAttributes[t];
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
		}, o.encodeQuery = function(e, t) {
			var r = o.encode(e + "");
			return void 0 === t && (t = o.escapeQuerySpace), t ? r.replace(/%20/g, "+") : r;
		}, o.decodeQuery = function(e, t) {
			e += "", void 0 === t && (t = o.escapeQuerySpace);
			try {
				return o.decode(t ? e.replace(/\+/g, "%20") : e);
			} catch (t) {
				return e;
			}
		};
		var _, g = {
			encode: "encode",
			decode: "decode"
		}, E = function(e, t) {
			return function(r) {
				try {
					return o[t](r + "").replace(o.characters[e][t].expression, function(r) {
						return o.characters[e][t].map[r];
					});
				} catch (e) {
					return r;
				}
			};
		};
		for (_ in g) o[_ + "PathSegment"] = E("pathname", g[_]), o[_ + "UrnPathSegment"] = E("urnpath", g[_]);
		var b = function(e, t, r) {
			return function(n) {
				var i = r ? function(e) {
					return o[t](o[r](e));
				} : o[t];
				for (var a = (n + "").split(e), s = 0, u = a.length; s < u; s++) a[s] = i(a[s]);
				return a.join(e);
			};
		};
		function w(e) {
			return function(t, r) {
				return void 0 === t ? this._parts[e] || "" : (this._parts[e] = t || null, this.build(!r), this);
			};
		}
		function T(e, t) {
			return function(r, n) {
				return void 0 === r ? this._parts[e] || "" : (null !== r && (r += "").charAt(0) === t && (r = r.substring(1)), this._parts[e] = r, this.build(!n), this);
			};
		}
		o.decodePath = b("/", "decodePathSegment"), o.decodeUrnPath = b(":", "decodeUrnPathSegment"), o.recodePath = b("/", "encodePathSegment", "decode"), o.recodeUrnPath = b(":", "encodeUrnPathSegment", "decode"), o.encodeReserved = E("reserved", "encode"), o.parse = function(e, t) {
			var r;
			return t || (t = { preventInvalidHostname: o.preventInvalidHostname }), (r = (e = (e = e.replace(o.leading_whitespace_expression, "")).replace(o.ascii_tab_whitespace, "")).indexOf("#")) > -1 && (t.fragment = e.substring(r + 1) || null, e = e.substring(0, r)), (r = e.indexOf("?")) > -1 && (t.query = e.substring(r + 1) || null, e = e.substring(0, r)), "//" === (e = (e = e.replace(/^(https?|ftp|wss?)?:+[/\\]*/i, "$1://")).replace(/^[/\\]{2,}/i, "//")).substring(0, 2) ? (t.protocol = null, e = e.substring(2), e = o.parseAuthority(e, t)) : (r = e.indexOf(":")) > -1 && (t.protocol = e.substring(0, r) || null, t.protocol && !t.protocol.match(o.protocol_expression) ? t.protocol = void 0 : "//" === e.substring(r + 1, r + 3).replace(/\\/g, "/") ? (e = e.substring(r + 3), e = o.parseAuthority(e, t)) : (e = e.substring(r + 1), t.urn = !0)), t.path = e, t;
		}, o.parseHost = function(e, t) {
			e || (e = "");
			var r, n, i = (e = e.replace(/\\/g, "/")).indexOf("/");
			if (-1 === i && (i = e.length), "[" === e.charAt(0)) r = e.indexOf("]"), t.hostname = e.substring(1, r) || null, t.port = e.substring(r + 2, i) || null, "/" === t.port && (t.port = null);
			else {
				var a = e.indexOf(":"), s = e.indexOf("/"), u = e.indexOf(":", a + 1);
				-1 !== u && (-1 === s || u < s) ? (t.hostname = e.substring(0, i) || null, t.port = null) : (n = e.substring(0, i).split(":"), t.hostname = n[0] || null, t.port = n[1] || null);
			}
			return t.hostname && "/" !== e.substring(i).charAt(0) && (i++, e = "/" + e), t.preventInvalidHostname && o.ensureValidHostname(t.hostname, t.protocol), t.port && o.ensureValidPort(t.port), e.substring(i) || "/";
		}, o.parseAuthority = function(e, t) {
			return e = o.parseUserinfo(e, t), o.parseHost(e, t);
		}, o.parseUserinfo = function(e, t) {
			var r = e;
			-1 !== e.indexOf("\\") && (e = e.replace(/\\/g, "/"));
			var n, i = e.indexOf("/"), a = e.lastIndexOf("@", i > -1 ? i : e.length - 1);
			return a > -1 && (-1 === i || a < i) ? (n = e.substring(0, a).split(":"), t.username = n[0] ? o.decode(n[0]) : null, n.shift(), t.password = n[0] ? o.decode(n.join(":")) : null, e = r.substring(a + 1)) : (t.username = null, t.password = null), e;
		}, o.parseQuery = function(e, t) {
			if (!e) return {};
			if (!(e = e.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, ""))) return {};
			for (var r, n, i, a = {}, u = e.split("&"), c = u.length, l = 0; l < c; l++) r = u[l].split("="), n = o.decodeQuery(r.shift(), t), i = r.length ? o.decodeQuery(r.join("="), t) : null, "__proto__" !== n && (s.call(a, n) ? ("string" != typeof a[n] && null !== a[n] || (a[n] = [a[n]]), a[n].push(i)) : a[n] = i);
			return a;
		}, o.build = function(e) {
			var t = "", r = !1;
			return e.protocol && (t += e.protocol + ":"), e.urn || !t && !e.hostname || (t += "//", r = !0), t += o.buildAuthority(e) || "", "string" == typeof e.path && ("/" !== e.path.charAt(0) && r && (t += "/"), t += e.path), "string" == typeof e.query && e.query && (t += "?" + e.query), "string" == typeof e.fragment && e.fragment && (t += "#" + e.fragment), t;
		}, o.buildHost = function(e) {
			var t = "";
			return e.hostname ? (o.ip6_expression.test(e.hostname) ? t += "[" + e.hostname + "]" : t += e.hostname, e.port && (t += ":" + e.port), t) : "";
		}, o.buildAuthority = function(e) {
			return o.buildUserinfo(e) + o.buildHost(e);
		}, o.buildUserinfo = function(e) {
			var t = "";
			return e.username && (t += o.encode(e.username)), e.password && (t += ":" + o.encode(e.password)), t && (t += "@"), t;
		}, o.buildQuery = function(e, t, r) {
			var n, i, a, u, c = "";
			for (i in e) if ("__proto__" !== i && s.call(e, i)) if (l(e[i])) for (n = {}, a = 0, u = e[i].length; a < u; a++) void 0 !== e[i][a] && void 0 === n[e[i][a] + ""] && (c += "&" + o.buildQueryParameter(i, e[i][a], r), !0 !== t && (n[e[i][a] + ""] = !0));
			else void 0 !== e[i] && (c += "&" + o.buildQueryParameter(i, e[i], r));
			return c.substring(1);
		}, o.buildQueryParameter = function(e, t, r) {
			return o.encodeQuery(e, r) + (null !== t ? "=" + o.encodeQuery(t, r) : "");
		}, o.addQuery = function(e, t, r) {
			if ("object" == typeof t) for (var n in t) s.call(t, n) && o.addQuery(e, n, t[n]);
			else {
				if ("string" != typeof t) throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
				if (void 0 === e[t]) return void (e[t] = r);
				"string" == typeof e[t] && (e[t] = [e[t]]), l(r) || (r = [r]), e[t] = (e[t] || []).concat(r);
			}
		}, o.setQuery = function(e, t, r) {
			if ("object" == typeof t) for (var n in t) s.call(t, n) && o.setQuery(e, n, t[n]);
			else {
				if ("string" != typeof t) throw new TypeError("URI.setQuery() accepts an object, string as the name parameter");
				e[t] = void 0 === r ? null : r;
			}
		}, o.removeQuery = function(e, t, r) {
			var n, i, a;
			if (l(t)) for (n = 0, i = t.length; n < i; n++) e[t[n]] = void 0;
			else if ("RegExp" === c(t)) for (a in e) t.test(a) && (e[a] = void 0);
			else if ("object" == typeof t) for (a in t) s.call(t, a) && o.removeQuery(e, a, t[a]);
			else {
				if ("string" != typeof t) throw new TypeError("URI.removeQuery() accepts an object, string, RegExp as the first parameter");
				void 0 !== r ? "RegExp" === c(r) ? !l(e[t]) && r.test(e[t]) ? e[t] = void 0 : e[t] = f(e[t], r) : e[t] !== String(r) || l(r) && 1 !== r.length ? l(e[t]) && (e[t] = f(e[t], r)) : e[t] = void 0 : e[t] = void 0;
			}
		}, o.hasQuery = function(e, t, r, n) {
			switch (c(t)) {
				case "String": break;
				case "RegExp":
					for (var i in e) if (s.call(e, i) && t.test(i) && (void 0 === r || o.hasQuery(e, i, r))) return !0;
					return !1;
				case "Object":
					for (var a in t) if (s.call(t, a) && !o.hasQuery(e, a, t[a])) return !1;
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
		}, o.joinPaths = function() {
			for (var e = [], t = [], r = 0, n = 0; n < arguments.length; n++) {
				var i = new o(arguments[n]);
				e.push(i);
				for (var a = i.segment(), s = 0; s < a.length; s++) "string" == typeof a[s] && t.push(a[s]), a[s] && r++;
			}
			if (!t.length || !r) return new o("");
			var u = new o("").segment(t);
			return "" !== e[0].path() && "/" !== e[0].path().slice(0, 1) || u.path("/" + u.path()), u.normalize();
		}, o.commonPath = function(e, t) {
			var r, n = Math.min(e.length, t.length);
			for (r = 0; r < n; r++) if (e.charAt(r) !== t.charAt(r)) {
				r--;
				break;
			}
			return r < 1 ? e.charAt(0) === t.charAt(0) && "/" === e.charAt(0) ? "/" : "" : ("/" === e.charAt(r) && "/" === t.charAt(r) || (r = e.substring(0, r).lastIndexOf("/")), e.substring(0, r + 1));
		}, o.withinString = function(e, t, r) {
			r || (r = {});
			var n = r.start || o.findUri.start, i = r.end || o.findUri.end, a = r.trim || o.findUri.trim, s = r.parens || o.findUri.parens, u = /[a-z0-9-]=["']?$/i;
			for (n.lastIndex = 0;;) {
				var c = n.exec(e);
				if (!c) break;
				var l = c.index;
				if (r.ignoreHtml) {
					var f = e.slice(Math.max(l - 3, 0), l);
					if (f && u.test(f)) continue;
				}
				for (var h = l + e.slice(l).search(i), p = e.slice(l, h), m = -1;;) {
					var d = s.exec(p);
					if (!d) break;
					var y = d.index + d[0].length;
					m = Math.max(m, y);
				}
				if (!((p = m > -1 ? p.slice(0, m) + p.slice(m).replace(a, "") : p.replace(a, "")).length <= c[0].length || r.ignore && r.ignore.test(p))) {
					var _ = t(p, l, h = l + p.length, e);
					void 0 !== _ ? (_ = String(_), e = e.slice(0, l) + _ + e.slice(h), n.lastIndex = l + _.length) : n.lastIndex = h;
				}
			}
			return n.lastIndex = 0, e;
		}, o.ensureValidHostname = function(t, r) {
			var n = !!t, i = !1;
			if (r && (i = h(o.hostProtocols, r)), i && !n) throw new TypeError("Hostname cannot be empty, if protocol is " + r);
			if (t && t.match(o.invalid_hostname_characters)) {
				if (!e) throw new TypeError("Hostname \"" + t + "\" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available");
				if (e.toASCII(t).match(o.invalid_hostname_characters)) throw new TypeError("Hostname \"" + t + "\" contains characters other than [A-Z0-9.-:_]");
			}
		}, o.ensureValidPort = function(e) {
			if (e) {
				var t = Number(e);
				if (!(/^[0-9]+$/.test(t) && t > 0 && t < 65536)) throw new TypeError("Port \"" + e + "\" is not a valid port");
			}
		}, o.noConflict = function(e) {
			if (e) {
				var t = { URI: this.noConflict() };
				return n.URITemplate && "function" == typeof n.URITemplate.noConflict && (t.URITemplate = n.URITemplate.noConflict()), n.IPv6 && "function" == typeof n.IPv6.noConflict && (t.IPv6 = n.IPv6.noConflict()), n.SecondLevelDomains && "function" == typeof n.SecondLevelDomains.noConflict && (t.SecondLevelDomains = n.SecondLevelDomains.noConflict()), t;
			}
			return n.URI === this && (n.URI = i), this;
		}, a.build = function(e) {
			return !0 === e ? this._deferred_build = !0 : (void 0 === e || this._deferred_build) && (this._string = o.build(this._parts), this._deferred_build = !1), this;
		}, a.clone = function() {
			return new o(this);
		}, a.valueOf = a.toString = function() {
			return this.build(!1)._string;
		}, a.protocol = w("protocol"), a.username = w("username"), a.password = w("password"), a.hostname = w("hostname"), a.port = w("port"), a.query = T("query", "?"), a.fragment = T("fragment", "#"), a.search = function(e, t) {
			var r = this.query(e, t);
			return "string" == typeof r && r.length ? "?" + r : r;
		}, a.hash = function(e, t) {
			var r = this.fragment(e, t);
			return "string" == typeof r && r.length ? "#" + r : r;
		}, a.pathname = function(e, t) {
			if (void 0 === e || !0 === e) {
				var r = this._parts.path || (this._parts.hostname ? "/" : "");
				return e ? (this._parts.urn ? o.decodeUrnPath : o.decodePath)(r) : r;
			}
			return this._parts.urn ? this._parts.path = e ? o.recodeUrnPath(e) : "" : this._parts.path = e ? o.recodePath(e) : "/", this.build(!t), this;
		}, a.path = a.pathname, a.href = function(e, t) {
			var r;
			if (void 0 === e) return this.toString();
			this._string = "", this._parts = o._parts();
			var n = e instanceof o, i = "object" == typeof e && (e.hostname || e.path || e.pathname);
			if (e.nodeName && (e = e[o.getDomAttribute(e)] || "", i = !1), !n && i && void 0 !== e.pathname && (e = e.toString()), "string" == typeof e || e instanceof String) this._parts = o.parse(String(e), this._parts);
			else {
				if (!n && !i) throw new TypeError("invalid input");
				var a = n ? e._parts : e;
				for (r in a) "query" !== r && s.call(this._parts, r) && (this._parts[r] = a[r]);
				a.query && this.query(a.query, !1);
			}
			return this.build(!t), this;
		}, a.is = function(e) {
			var t = !1, n = !1, i = !1, a = !1, s = !1, u = !1, c = !1, l = !this._parts.urn;
			switch (this._parts.hostname && (l = !1, n = o.ip4_expression.test(this._parts.hostname), i = o.ip6_expression.test(this._parts.hostname), s = (a = !(t = n || i)) && r && r.has(this._parts.hostname), u = a && o.idn_expression.test(this._parts.hostname), c = a && o.punycode_expression.test(this._parts.hostname)), e.toLowerCase()) {
				case "relative": return l;
				case "absolute": return !l;
				case "domain":
				case "name": return a;
				case "sld": return s;
				case "ip": return t;
				case "ip4":
				case "ipv4":
				case "inet4": return n;
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
		var O = a.protocol, A = a.port, x = a.hostname;
		a.protocol = function(e, t) {
			if (e && !(e = e.replace(/:(\/\/)?$/, "")).match(o.protocol_expression)) throw new TypeError("Protocol \"" + e + "\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");
			return O.call(this, e, t);
		}, a.scheme = a.protocol, a.port = function(e, t) {
			return this._parts.urn ? void 0 === e ? "" : this : (void 0 !== e && (0 === e && (e = null), e && (":" === (e += "").charAt(0) && (e = e.substring(1)), o.ensureValidPort(e))), A.call(this, e, t));
		}, a.hostname = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 !== e) {
				var r = { preventInvalidHostname: this._parts.preventInvalidHostname };
				if ("/" !== o.parseHost(e, r)) throw new TypeError("Hostname \"" + e + "\" contains characters other than [A-Z0-9.-]");
				e = r.hostname, this._parts.preventInvalidHostname && o.ensureValidHostname(e, this._parts.protocol);
			}
			return x.call(this, e, t);
		}, a.origin = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e) {
				var r = this.protocol();
				return this.authority() ? (r ? r + "://" : "") + this.authority() : "";
			}
			var n = o(e);
			return this.protocol(n.protocol()).authority(n.authority()).build(!t), this;
		}, a.host = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e) return this._parts.hostname ? o.buildHost(this._parts) : "";
			if ("/" !== o.parseHost(e, this._parts)) throw new TypeError("Hostname \"" + e + "\" contains characters other than [A-Z0-9.-]");
			return this.build(!t), this;
		}, a.authority = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e) return this._parts.hostname ? o.buildAuthority(this._parts) : "";
			if ("/" !== o.parseAuthority(e, this._parts)) throw new TypeError("Hostname \"" + e + "\" contains characters other than [A-Z0-9.-]");
			return this.build(!t), this;
		}, a.userinfo = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e) {
				var r = o.buildUserinfo(this._parts);
				return r ? r.substring(0, r.length - 1) : r;
			}
			return "@" !== e[e.length - 1] && (e += "@"), o.parseUserinfo(e, this._parts), this.build(!t), this;
		}, a.resource = function(e, t) {
			var r;
			return void 0 === e ? this.path() + this.search() + this.hash() : (r = o.parse(e), this._parts.path = r.path, this._parts.query = r.query, this._parts.fragment = r.fragment, this.build(!t), this);
		}, a.subdomain = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e) {
				if (!this._parts.hostname || this.is("IP")) return "";
				var r = this._parts.hostname.length - this.domain().length - 1;
				return this._parts.hostname.substring(0, r) || "";
			}
			var n = this._parts.hostname.length - this.domain().length, i = this._parts.hostname.substring(0, n), a = new RegExp("^" + u(i));
			if (e && "." !== e.charAt(e.length - 1) && (e += "."), -1 !== e.indexOf(":")) throw new TypeError("Domains cannot contain colons");
			return e && o.ensureValidHostname(e, this._parts.protocol), this._parts.hostname = this._parts.hostname.replace(a, e), this.build(!t), this;
		}, a.domain = function(e, t) {
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
			if (o.ensureValidHostname(e, this._parts.protocol), !this._parts.hostname || this.is("IP")) this._parts.hostname = e;
			else {
				var i = new RegExp(u(this.domain()) + "$");
				this._parts.hostname = this._parts.hostname.replace(i, e);
			}
			return this.build(!t), this;
		}, a.tld = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if ("boolean" == typeof e && (t = e, e = void 0), void 0 === e) {
				if (!this._parts.hostname || this.is("IP")) return "";
				var n = this._parts.hostname.lastIndexOf("."), i = this._parts.hostname.substring(n + 1);
				return !0 !== t && r && r.list[i.toLowerCase()] && r.get(this._parts.hostname) || i;
			}
			var o;
			if (!e) throw new TypeError("cannot set TLD empty");
			if (e.match(/[^a-zA-Z0-9-]/)) {
				if (!r || !r.is(e)) throw new TypeError("TLD \"" + e + "\" contains characters other than [A-Z0-9]");
				o = new RegExp(u(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(o, e);
			} else {
				if (!this._parts.hostname || this.is("IP")) throw new ReferenceError("cannot set TLD on non-domain host");
				o = new RegExp(u(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(o, e);
			}
			return this.build(!t), this;
		}, a.directory = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e || !0 === e) {
				if (!this._parts.path && !this._parts.hostname) return "";
				if ("/" === this._parts.path) return "/";
				var r = this._parts.path.length - this.filename().length - 1, n = this._parts.path.substring(0, r) || (this._parts.hostname ? "/" : "");
				return e ? o.decodePath(n) : n;
			}
			var i = this._parts.path.length - this.filename().length, a = this._parts.path.substring(0, i), s = new RegExp("^" + u(a));
			return this.is("relative") || (e || (e = "/"), "/" !== e.charAt(0) && (e = "/" + e)), e && "/" !== e.charAt(e.length - 1) && (e += "/"), e = o.recodePath(e), this._parts.path = this._parts.path.replace(s, e), this.build(!t), this;
		}, a.filename = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if ("string" != typeof e) {
				if (!this._parts.path || "/" === this._parts.path) return "";
				var r = this._parts.path.lastIndexOf("/"), n = this._parts.path.substring(r + 1);
				return e ? o.decodePathSegment(n) : n;
			}
			var i = !1;
			"/" === e.charAt(0) && (e = e.substring(1)), e.match(/\.?\//) && (i = !0);
			var a = new RegExp(u(this.filename()) + "$");
			return e = o.recodePath(e), this._parts.path = this._parts.path.replace(a, e), i ? this.normalizePath(t) : this.build(!t), this;
		}, a.suffix = function(e, t) {
			if (this._parts.urn) return void 0 === e ? "" : this;
			if (void 0 === e || !0 === e) {
				if (!this._parts.path || "/" === this._parts.path) return "";
				var r, n, i = this.filename(), a = i.lastIndexOf(".");
				return -1 === a ? "" : (r = i.substring(a + 1), n = /^[a-z0-9%]+$/i.test(r) ? r : "", e ? o.decodePathSegment(n) : n);
			}
			"." === e.charAt(0) && (e = e.substring(1));
			var s, c = this.suffix();
			if (c) s = e ? new RegExp(u(c) + "$") : new RegExp(u("." + c) + "$");
			else {
				if (!e) return this;
				this._parts.path += "." + o.recodePath(e);
			}
			return s && (e = o.recodePath(e), this._parts.path = this._parts.path.replace(s, e)), this.build(!t), this;
		}, a.segment = function(e, t, r) {
			var n = this._parts.urn ? ":" : "/", i = this.path(), o = "/" === i.substring(0, 1), a = i.split(n);
			if (void 0 !== e && "number" != typeof e && (r = t, t = e, e = void 0), void 0 !== e && "number" != typeof e) throw new Error("Bad segment \"" + e + "\", must be 0-based integer");
			if (o && a.shift(), e < 0 && (e = Math.max(a.length + e, 0)), void 0 === t) return void 0 === e ? a : a[e];
			if (null === e || void 0 === a[e]) if (l(t)) {
				a = [];
				for (var s = 0, u = t.length; s < u; s++) (t[s].length || a.length && a[a.length - 1].length) && (a.length && !a[a.length - 1].length && a.pop(), a.push(m(t[s])));
			} else (t || "string" == typeof t) && (t = m(t), "" === a[a.length - 1] ? a[a.length - 1] = t : a.push(t));
			else t ? a[e] = m(t) : a.splice(e, 1);
			return o && a.unshift(""), this.path(a.join(n), r);
		}, a.segmentCoded = function(e, t, r) {
			var n, i, a;
			if ("number" != typeof e && (r = t, t = e, e = void 0), void 0 === t) {
				if (l(n = this.segment(e, t, r))) for (i = 0, a = n.length; i < a; i++) n[i] = o.decode(n[i]);
				else n = void 0 !== n ? o.decode(n) : void 0;
				return n;
			}
			if (l(t)) for (i = 0, a = t.length; i < a; i++) t[i] = o.encode(t[i]);
			else t = "string" == typeof t || t instanceof String ? o.encode(t) : t;
			return this.segment(e, t, r);
		};
		var R = a.query;
		return a.query = function(e, t) {
			if (!0 === e) return o.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			if ("function" == typeof e) {
				var r = o.parseQuery(this._parts.query, this._parts.escapeQuerySpace), n = e.call(this, r);
				return this._parts.query = o.buildQuery(n || r, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), this.build(!t), this;
			}
			return void 0 !== e && "string" != typeof e ? (this._parts.query = o.buildQuery(e, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), this.build(!t), this) : R.call(this, e, t);
		}, a.setQuery = function(e, t, r) {
			var n = o.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			if ("string" == typeof e || e instanceof String) n[e] = void 0 !== t ? t : null;
			else {
				if ("object" != typeof e) throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
				for (var i in e) s.call(e, i) && (n[i] = e[i]);
			}
			return this._parts.query = o.buildQuery(n, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), "string" != typeof e && (r = t), this.build(!r), this;
		}, a.addQuery = function(e, t, r) {
			var n = o.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			return o.addQuery(n, e, void 0 === t ? null : t), this._parts.query = o.buildQuery(n, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), "string" != typeof e && (r = t), this.build(!r), this;
		}, a.removeQuery = function(e, t, r) {
			var n = o.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			return o.removeQuery(n, e, t), this._parts.query = o.buildQuery(n, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), "string" != typeof e && (r = t), this.build(!r), this;
		}, a.hasQuery = function(e, t, r) {
			var n = o.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
			return o.hasQuery(n, e, t, r);
		}, a.setSearch = a.setQuery, a.addSearch = a.addQuery, a.removeSearch = a.removeQuery, a.hasSearch = a.hasQuery, a.normalize = function() {
			return this._parts.urn ? this.normalizeProtocol(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build() : this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build();
		}, a.normalizeProtocol = function(e) {
			return "string" == typeof this._parts.protocol && (this._parts.protocol = this._parts.protocol.toLowerCase(), this.build(!e)), this;
		}, a.normalizeHostname = function(r) {
			return this._parts.hostname && (this.is("IDN") && e ? this._parts.hostname = e.toASCII(this._parts.hostname) : this.is("IPv6") && t && (this._parts.hostname = t.best(this._parts.hostname)), this._parts.hostname = this._parts.hostname.toLowerCase(), this.build(!r)), this;
		}, a.normalizePort = function(e) {
			return "string" == typeof this._parts.protocol && this._parts.port === o.defaultPorts[this._parts.protocol] && (this._parts.port = null, this.build(!e)), this;
		}, a.normalizePath = function(e) {
			var t, r = this._parts.path;
			if (!r) return this;
			if (this._parts.urn) return this._parts.path = o.recodeUrnPath(this._parts.path), this.build(!e), this;
			if ("/" === this._parts.path) return this;
			var n, i, a = "";
			for ("/" !== (r = o.recodePath(r)).charAt(0) && (t = !0, r = "/" + r), "/.." !== r.slice(-3) && "/." !== r.slice(-2) || (r += "/"), r = r.replace(/(\/(\.\/)+)|(\/\.$)/g, "/").replace(/\/{2,}/g, "/"), t && (a = r.substring(1).match(/^(\.\.\/)+/) || "") && (a = a[0]); -1 !== (n = r.search(/\/\.\.(\/|$)/));) 0 !== n ? (-1 === (i = r.substring(0, n).lastIndexOf("/")) && (i = n), r = r.substring(0, i) + r.substring(n + 3)) : r = r.substring(3);
			return t && this.is("relative") && (r = a + r.substring(1)), this._parts.path = r, this.build(!e), this;
		}, a.normalizePathname = a.normalizePath, a.normalizeQuery = function(e) {
			return "string" == typeof this._parts.query && (this._parts.query.length ? this.query(o.parseQuery(this._parts.query, this._parts.escapeQuerySpace)) : this._parts.query = null, this.build(!e)), this;
		}, a.normalizeFragment = function(e) {
			return this._parts.fragment || (this._parts.fragment = null, this.build(!e)), this;
		}, a.normalizeSearch = a.normalizeQuery, a.normalizeHash = a.normalizeFragment, a.iso8859 = function() {
			var e = o.encode, t = o.decode;
			o.encode = escape, o.decode = decodeURIComponent;
			try {
				this.normalize();
			} finally {
				o.encode = e, o.decode = t;
			}
			return this;
		}, a.unicode = function() {
			var e = o.encode, t = o.decode;
			o.encode = y, o.decode = unescape;
			try {
				this.normalize();
			} finally {
				o.encode = e, o.decode = t;
			}
			return this;
		}, a.readable = function() {
			var t = this.clone();
			t.username("").password("").normalize();
			var r = "";
			if (t._parts.protocol && (r += t._parts.protocol + "://"), t._parts.hostname && (t.is("punycode") && e ? (r += e.toUnicode(t._parts.hostname), t._parts.port && (r += ":" + t._parts.port)) : r += t.host()), t._parts.hostname && t._parts.path && "/" !== t._parts.path.charAt(0) && (r += "/"), r += t.path(!0), t._parts.query) {
				for (var n = "", i = 0, a = t._parts.query.split("&"), s = a.length; i < s; i++) {
					var u = (a[i] || "").split("=");
					n += "&" + o.decodeQuery(u[0], this._parts.escapeQuerySpace).replace(/&/g, "%26"), void 0 !== u[1] && (n += "=" + o.decodeQuery(u[1], this._parts.escapeQuerySpace).replace(/&/g, "%26"));
				}
				r += "?" + n.substring(1);
			}
			return r + o.decodeQuery(t.hash(), !0);
		}, a.absoluteTo = function(e) {
			var t, r, n, i = this.clone(), a = [
				"protocol",
				"username",
				"password",
				"hostname",
				"port"
			];
			if (this._parts.urn) throw new Error("URNs do not have any generally defined hierarchical components");
			if (e instanceof o || (e = new o(e)), i._parts.protocol) return i;
			if (i._parts.protocol = e._parts.protocol, this._parts.hostname) return i;
			for (r = 0; n = a[r]; r++) i._parts[n] = e._parts[n];
			return i._parts.path ? (".." === i._parts.path.substring(-2) && (i._parts.path += "/"), "/" !== i.path().charAt(0) && (t = (t = e.directory()) || (0 === e.path().indexOf("/") ? "/" : ""), i._parts.path = (t ? t + "/" : "") + i._parts.path, i.normalizePath())) : (i._parts.path = e._parts.path, i._parts.query || (i._parts.query = e._parts.query)), i.build(), i;
		}, a.relativeTo = function(e) {
			var t, r, n, i, a, s = this.clone().normalize();
			if (s._parts.urn) throw new Error("URNs do not have any generally defined hierarchical components");
			if (e = new o(e).normalize(), t = s._parts, r = e._parts, i = s.path(), a = e.path(), "/" !== i.charAt(0)) throw new Error("URI is already relative");
			if ("/" !== a.charAt(0)) throw new Error("Cannot calculate a URI relative to another relative URI");
			if (t.protocol === r.protocol && (t.protocol = null), t.username !== r.username || t.password !== r.password) return s.build();
			if (null !== t.protocol || null !== t.username || null !== t.password) return s.build();
			if (t.hostname !== r.hostname || t.port !== r.port) return s.build();
			if (t.hostname = null, t.port = null, i === a) return t.path = "", s.build();
			if (!(n = o.commonPath(i, a))) return s.build();
			var u = r.path.substring(n.length).replace(/[^\/]*$/, "").replace(/.*?\//g, "../");
			return t.path = u + t.path.substring(n.length) || "./", s.build();
		}, a.equals = function(e) {
			var t, r, n, i, a, u = this.clone(), c = new o(e), f = {};
			if (u.normalize(), c.normalize(), u.toString() === c.toString()) return !0;
			if (n = u.query(), i = c.query(), u.query(""), c.query(""), u.toString() !== c.toString()) return !1;
			if (n.length !== i.length) return !1;
			for (a in t = o.parseQuery(n, this._parts.escapeQuerySpace), r = o.parseQuery(i, this._parts.escapeQuerySpace), t) if (s.call(t, a)) {
				if (l(t[a])) {
					if (!p(t[a], r[a])) return !1;
				} else if (t[a] !== r[a]) return !1;
				f[a] = !0;
			}
			for (a in r) if (s.call(r, a) && !f[a]) return !1;
			return !0;
		}, a.preventInvalidHostname = function(e) {
			return this._parts.preventInvalidHostname = !!e, this;
		}, a.duplicateQueryParameters = function(e) {
			return this._parts.duplicateQueryParameters = !!e, this;
		}, a.escapeQuerySpace = function(e) {
			return this._parts.escapeQuerySpace = !!e, this;
		}, o;
	};
	"object" == typeof t && t.exports ? t.exports = n(wr(), Tr(), Or()) : "function" == typeof define && define.amd ? define([
		"./punycode",
		"./IPv6",
		"./SecondLevelDomains"
	], n) : r.URI = n(r.punycode, r.IPv6, r.SecondLevelDomains, r);
});
function xr(e, t) {
	if (null === e || "object" != typeof e) return e;
	t = t ?? !1;
	const r = new e.constructor();
	for (const n in e) if (e.hasOwnProperty(n)) {
		let i = e[n];
		t && (i = xr(i, t)), r[n] = i;
	}
	return r;
}
function Rr(e, t, r) {
	r = r ?? !1;
	const n = {}, i = C(e), o = C(t);
	let a, s, u;
	if (i) for (a in e) e.hasOwnProperty(a) && (s = e[a], o && r && "object" == typeof s && t.hasOwnProperty(a) ? (u = t[a], n[a] = "object" == typeof u ? Rr(s, u, r) : s) : n[a] = s);
	if (o) for (a in t) t.hasOwnProperty(a) && !n.hasOwnProperty(a) && (u = t[a], n[a] = u);
	return n;
}
function Sr() {
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
var Ir = s(Ar(), 1);
function Cr(e, t) {
	let r;
	return "undefined" != typeof document && (r = document), Cr._implementation(e, t, r);
}
Cr._implementation = function(e, t, r) {
	if (!C(e)) throw new N("relative uri is required.");
	if (!C(t)) {
		if (void 0 === r) return e;
		t = r.baseURI ?? r.location.href;
	}
	const n = new Ir.default(e);
	return "" !== n.scheme() ? n.toString() : n.absoluteTo(t).toString();
};
const Nr = {};
function vr(e, t, r) {
	C(t) || (t = e.width), C(r) || (r = e.height);
	let n = Nr[t];
	C(n) || (n = {}, Nr[t] = n);
	let i = n[r];
	if (!C(i)) {
		const e = document.createElement("canvas");
		e.width = t, e.height = r, i = e.getContext("2d", { willReadFrequently: !0 }), i.globalCompositeOperation = "copy", n[r] = i;
	}
	return i.drawImage(e, 0, 0, t, r), i.getImageData(0, 0, t, r).data;
}
const Pr = /^blob:/i;
function Mr(e) {
	return v.typeOf.string("uri", e), Pr.test(e);
}
let Lr;
function Fr(e) {
	C(Lr) || (Lr = document.createElement("a")), Lr.href = window.location.href;
	const t = Lr.host, r = Lr.protocol;
	return Lr.href = e, Lr.href = Lr.href, r !== Lr.protocol || t !== Lr.host;
}
const Dr = /^data:/i;
function zr(e) {
	return v.typeOf.string("uri", e), Dr.test(e);
}
const Br = {
	UNISSUED: 0,
	ISSUED: 1,
	ACTIVE: 2,
	RECEIVED: 3,
	CANCELLED: 4,
	FAILED: 5
};
Object.freeze(Br);
const Ur = {
	TERRAIN: 0,
	IMAGERY: 1,
	TILES3D: 2,
	OTHER: 3
};
function jr(e) {
	const t = (e = e ?? J.EMPTY_OBJECT).throttleByServer ?? !1, r = e.throttle ?? !1;
	this.url = e.url, this.requestFunction = e.requestFunction, this.cancelFunction = e.cancelFunction, this.priorityFunction = e.priorityFunction, this.priority = e.priority ?? 0, this.throttle = r, this.throttleByServer = t, this.type = e.type ?? Ur.OTHER, this.serverKey = e.serverKey, this.state = Br.UNISSUED, this.deferred = void 0, this.cancelled = !1;
}
function qr(e, t, r) {
	this.statusCode = e, this.response = t, this.responseHeaders = r, "string" == typeof this.responseHeaders && (this.responseHeaders = function(e) {
		const t = {};
		if (!e) return t;
		const r = e.split("\r\n");
		for (let n = 0; n < r.length; ++n) {
			const e = r[n], i = e.indexOf(": ");
			i > 0 && (t[e.substring(0, i)] = e.substring(i + 2));
		}
		return t;
	}(this.responseHeaders));
}
function Gr() {
	this._listeners = /* @__PURE__ */ new Map(), this._toRemove = /* @__PURE__ */ new Map(), this._toAdd = /* @__PURE__ */ new Map(), this._invokingListeners = !1, this._listenerCount = 0;
}
function kr(e, t, r, n) {
	t.has(r) || t.set(r, /* @__PURE__ */ new Set());
	const i = t.get(r);
	return !i.has(n) && (i.add(n), !0);
}
function Wr(e, t, r, n) {
	const i = t.get(r);
	if (!i || !i.has(n)) return !1;
	if (e._invokingListeners) {
		if (!kr(0, e._toRemove, r, n)) return !1;
	} else i.delete(n), 0 === i.size && t.delete(r);
	return !0;
}
function Vr(e) {
	v.typeOf.object("options", e), v.defined("options.comparator", e.comparator), this._comparator = e.comparator, this._array = [], this._length = 0, this._maximumLength = void 0;
}
function Hr(e, t, r) {
	const n = e[t];
	e[t] = e[r], e[r] = n;
}
Object.freeze(Ur), jr.prototype.cancel = function() {
	this.cancelled = !0;
}, jr.prototype.clone = function(e) {
	return C(e) ? (e.url = this.url, e.requestFunction = this.requestFunction, e.cancelFunction = this.cancelFunction, e.priorityFunction = this.priorityFunction, e.priority = this.priority, e.throttle = this.throttle, e.throttleByServer = this.throttleByServer, e.type = this.type, e.serverKey = this.serverKey, e.state = Br.UNISSUED, e.deferred = void 0, e.cancelled = !1, e) : new jr(this);
}, qr.prototype.toString = function() {
	let e = "Request has failed.";
	return C(this.statusCode) && (e += ` Status Code: ${this.statusCode}`), e;
}, Object.defineProperties(Gr.prototype, { numberOfListeners: { get: function() {
	return this._listenerCount;
} } }), Gr.prototype.addEventListener = function(e, t) {
	v.typeOf.func("listener", e);
	const r = this;
	return kr(0, r._invokingListeners ? r._toAdd : r._listeners, e, t) && r._listenerCount++, function() {
		r.removeEventListener(e, t);
	};
}, Gr.prototype.removeEventListener = function(e, t) {
	v.typeOf.func("listener", e);
	const r = Wr(this, this._listeners, e, t), n = Wr(this, this._toAdd, e, t), i = r || n;
	return i && this._listenerCount--, i;
}, Gr.prototype.raiseEvent = function() {
	this._invokingListeners = !0;
	for (const [e, t] of this._listeners.entries()) if (C(e)) for (const r of t) e.apply(r, arguments);
	this._invokingListeners = !1;
	for (const [e, t] of this._toAdd.entries()) for (const r of t) kr(0, this._listeners, e, r);
	this._toAdd.clear();
	for (const [e, t] of this._toRemove.entries()) for (const r of t) Wr(this, this._listeners, e, r);
	this._toRemove.clear();
}, Object.defineProperties(Vr.prototype, {
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
			v.typeOf.number.greaterThanOrEquals("maximumLength", e, 0);
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
}), Vr.prototype.reserve = function(e) {
	e = e ?? this._length, this._array.length = e;
}, Vr.prototype.heapify = function(e) {
	e = e ?? 0;
	const t = this._length, r = this._comparator, n = this._array;
	let i = -1, o = !0;
	for (; o;) {
		const a = 2 * (e + 1), s = a - 1;
		i = s < t && r(n[s], n[e]) < 0 ? s : e, a < t && r(n[a], n[i]) < 0 && (i = a), i !== e ? (Hr(n, i, e), e = i) : o = !1;
	}
}, Vr.prototype.resort = function() {
	const e = this._length;
	for (let t = Math.ceil(e / 2); t >= 0; --t) this.heapify(t);
}, Vr.prototype.insert = function(e) {
	v.defined("element", e);
	const t = this._array, r = this._comparator, n = this._maximumLength;
	let i, o = this._length++;
	for (o < t.length ? t[o] = e : t.push(e); 0 !== o;) {
		const e = Math.floor((o - 1) / 2);
		if (!(r(t[o], t[e]) < 0)) break;
		Hr(t, o, e), o = e;
	}
	return C(n) && this._length > n && (i = t[n], this._length = n), i;
}, Vr.prototype.pop = function(e) {
	if (e = e ?? 0, 0 === this._length) return;
	v.typeOf.number.lessThan("index", e, this._length);
	const t = this._array, r = t[e];
	return Hr(t, e, --this._length), this.heapify(e), t[this._length] = void 0, r;
};
const Yr = {
	numberOfAttemptedRequests: 0,
	numberOfActiveRequests: 0,
	numberOfCancelledRequests: 0,
	numberOfCancelledActiveRequests: 0,
	numberOfFailedRequests: 0,
	numberOfActiveRequestsEver: 0,
	lastNumberOfActiveRequests: 0
};
let Xr = 20;
const $r = new Vr({ comparator: function(e, t) {
	return e.priority - t.priority;
} });
$r.maximumLength = Xr, $r.reserve(Xr);
const Kr = [];
let Zr = {};
const Qr = "undefined" != typeof document ? new Ir.default(document.location.href) : new Ir.default(), Jr = new Gr();
function en() {}
function tn(e) {
	C(e.priorityFunction) && (e.priority = e.priorityFunction());
}
function rn(e) {
	return e.state === Br.UNISSUED && (e.state = Br.ISSUED, e.deferred = Sr()), e.deferred.promise;
}
function nn(e) {
	const t = rn(e);
	return e.state = Br.ACTIVE, Kr.push(e), ++Yr.numberOfActiveRequests, ++Yr.numberOfActiveRequestsEver, ++Zr[e.serverKey], e.requestFunction().then(function(e) {
		return function(t) {
			if (e.state === Br.CANCELLED) return;
			const r = e.deferred;
			--Yr.numberOfActiveRequests, --Zr[e.serverKey], Jr.raiseEvent(), e.state = Br.RECEIVED, e.deferred = void 0, r.resolve(t);
		};
	}(e)).catch(function(e) {
		return function(t) {
			e.state !== Br.CANCELLED && (++Yr.numberOfFailedRequests, --Yr.numberOfActiveRequests, --Zr[e.serverKey], Jr.raiseEvent(t), e.state = Br.FAILED, e.deferred.reject(t));
		};
	}(e)), t;
}
function on(e) {
	const t = e.state === Br.ACTIVE;
	if (e.state = Br.CANCELLED, ++Yr.numberOfCancelledRequests, C(e.deferred)) {
		const t = e.deferred;
		t.promise.catch(() => {}), e.deferred = void 0, t.reject(new me(`Request cancelled: "${e.url}"`));
	}
	t && (--Yr.numberOfActiveRequests, --Zr[e.serverKey], ++Yr.numberOfCancelledActiveRequests), C(e.cancelFunction) && e.cancelFunction();
}
en.maximumRequests = 50, en.maximumRequestsPerServer = 18, en.requestsByServer = {}, en.throttleRequests = !0, en.debugShowStatistics = !1, en.requestCompletedEvent = Jr, Object.defineProperties(en, {
	statistics: { get: function() {
		return Yr;
	} },
	priorityHeapLength: {
		get: function() {
			return Xr;
		},
		set: function(e) {
			if (e < Xr) for (; $r.length > e;) on($r.pop());
			Xr = e, $r.maximumLength = e, $r.reserve(e);
		}
	}
}), en.serverHasOpenSlots = function(e, t) {
	t = t ?? 1;
	const r = en.requestsByServer[e] ?? en.maximumRequestsPerServer;
	return Zr[e] + t <= r;
}, en.heapHasOpenSlots = function(e) {
	return $r.length + e <= Xr;
}, en.update = function() {
	let e, t, r = 0;
	const n = Kr.length;
	for (e = 0; e < n; ++e) t = Kr[e], t.cancelled && on(t), t.state === Br.ACTIVE ? r > 0 && (Kr[e - r] = t) : ++r;
	Kr.length -= r;
	const i = $r.internalArray, o = $r.length;
	for (e = 0; e < o; ++e) tn(i[e]);
	$r.resort();
	const a = Math.max(en.maximumRequests - Kr.length, 0);
	let s = 0;
	for (; s < a && $r.length > 0;) t = $r.pop(), t.cancelled ? on(t) : !t.throttleByServer || en.serverHasOpenSlots(t.serverKey) ? (nn(t), ++s) : on(t);
	en.debugShowStatistics && (0 === Yr.numberOfActiveRequests && Yr.lastNumberOfActiveRequests > 0 && (Yr.numberOfAttemptedRequests > 0 && (console.log(`Number of attempted requests: ${Yr.numberOfAttemptedRequests}`), Yr.numberOfAttemptedRequests = 0), Yr.numberOfCancelledRequests > 0 && (console.log(`Number of cancelled requests: ${Yr.numberOfCancelledRequests}`), Yr.numberOfCancelledRequests = 0), Yr.numberOfCancelledActiveRequests > 0 && (console.log(`Number of cancelled active requests: ${Yr.numberOfCancelledActiveRequests}`), Yr.numberOfCancelledActiveRequests = 0), Yr.numberOfFailedRequests > 0 && (console.log(`Number of failed requests: ${Yr.numberOfFailedRequests}`), Yr.numberOfFailedRequests = 0)), Yr.lastNumberOfActiveRequests = Yr.numberOfActiveRequests);
}, en.getServerKey = function(e) {
	v.typeOf.string("url", e);
	let t = new Ir.default(e);
	"" === t.scheme() && (t = t.absoluteTo(Qr), t.normalize());
	let r = t.authority();
	return /:/.test(r) || (r = `${r}:${"https" === t.scheme() ? "443" : "80"}`), C(Zr[r]) || (Zr[r] = 0), r;
}, en.request = function(e) {
	if (v.typeOf.object("request", e), v.typeOf.string("request.url", e.url), v.typeOf.func("request.requestFunction", e.requestFunction), zr(e.url) || Mr(e.url)) return Jr.raiseEvent(), e.state = Br.RECEIVED, e.requestFunction();
	if (++Yr.numberOfAttemptedRequests, C(e.serverKey) || (e.serverKey = en.getServerKey(e.url)), en.throttleRequests && e.throttleByServer && !en.serverHasOpenSlots(e.serverKey)) return;
	if (!en.throttleRequests || !e.throttle) return nn(e);
	if (Kr.length >= en.maximumRequests) return;
	tn(e);
	const t = $r.insert(e);
	if (C(t)) {
		if (t === e) return;
		on(t);
	}
	return rn(e);
}, en.clearForSpecs = function() {
	for (; $r.length > 0;) on($r.pop());
	const e = Kr.length;
	for (let t = 0; t < e; ++t) on(Kr[t]);
	Kr.length = 0, Zr = {}, Yr.numberOfAttemptedRequests = 0, Yr.numberOfActiveRequests = 0, Yr.numberOfCancelledRequests = 0, Yr.numberOfCancelledActiveRequests = 0, Yr.numberOfFailedRequests = 0, Yr.numberOfActiveRequestsEver = 0, Yr.lastNumberOfActiveRequests = 0;
}, en.numberOfActiveRequestsByServer = function(e) {
	return Zr[e];
}, en.requestHeap = $r;
const an = {};
let sn = {};
an.add = function(e, t) {
	if (!C(e)) throw new N("host is required.");
	if (!C(t) || t <= 0) throw new N("port is required to be greater than 0.");
	const r = `${e.toLowerCase()}:${t}`;
	C(sn[r]) || (sn[r] = !0);
}, an.remove = function(e, t) {
	if (!C(e)) throw new N("host is required.");
	if (!C(t) || t <= 0) throw new N("port is required to be greater than 0.");
	const r = `${e.toLowerCase()}:${t}`;
	C(sn[r]) && delete sn[r];
}, an.contains = function(e) {
	if (!C(e)) throw new N("url is required.");
	const t = function(e) {
		const t = new Ir.default(e);
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
	return !(!C(t) || !C(sn[t]));
}, an.clear = function() {
	sn = {};
};
const un = function() {
	try {
		const e = new XMLHttpRequest();
		return e.open("GET", "#", !0), e.responseType = "blob", "blob" === e.responseType;
	} catch (e) {
		return !1;
	}
}();
function cn(e) {
	"string" == typeof (e = e ?? J.EMPTY_OBJECT) && (e = { url: e }), v.typeOf.string("options.url", e.url), this._url = void 0, this._templateValues = ln(e.templateValues, {}), this._queryParameters = ln(e.queryParameters, {}), this.headers = ln(e.headers, {}), this.request = e.request ?? new jr(), this.proxy = e.proxy, this.retryCallback = e.retryCallback, this.retryAttempts = e.retryAttempts ?? 0, this._retryCount = 0, e.parseUrl ?? 1 ? this.parseUrl(e.url, !0, !0) : this._url = e.url, this._credits = e.credits;
}
function ln(e, t) {
	return C(e) ? xr(e) : t;
}
let fn;
function hn(e, t, r) {
	if (!r) return Rr(e, t);
	const n = xr(e, !0);
	for (const i in t) if (t.hasOwnProperty(i)) {
		let e = n[i];
		const r = t[i];
		C(e) ? (Array.isArray(e) || (e = n[i] = [e]), n[i] = e.concat(r)) : n[i] = Array.isArray(r) ? r.slice() : r;
	}
	return n;
}
function pn(e, t, r) {
	const n = {};
	n[t] = r, e.setQueryParameters(n);
	const i = e.request, o = e.url;
	i.url = o, i.requestFunction = function() {
		const e = Sr();
		return window[r] = function(t) {
			e.resolve(t);
			try {
				delete window[r];
			} catch (e) {
				window[r] = void 0;
			}
		}, cn._Implementations.loadAndExecuteScript(o, r, e), e.promise;
	};
	const a = en.request(i);
	if (C(a)) return a.catch(function(n) {
		return i.state !== Br.FAILED ? Promise.reject(n) : e.retryOnError(n).then(function(o) {
			return o ? (i.state = Br.UNISSUED, i.deferred = void 0, pn(e, t, r)) : Promise.reject(n);
		});
	});
}
function mn(e) {
	if (e.state === Br.ISSUED || e.state === Br.ACTIVE) throw new me("The Resource is already being fetched.");
	e.state = Br.UNISSUED, e.deferred = void 0;
}
cn.createIfNeeded = function(e) {
	return e instanceof cn ? e.getDerivedResource({ request: e.request }) : "string" != typeof e ? e : new cn({ url: e });
}, cn.supportsImageBitmapOptions = function() {
	return C(fn) ? fn : "function" != typeof createImageBitmap ? (fn = Promise.resolve(!1), fn) : (fn = cn.fetchBlob({ url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABGdBTUEAAE4g3rEiDgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAADElEQVQI12Ng6GAAAAEUAIngE3ZiAAAAAElFTkSuQmCC" }).then(function(e) {
		return Promise.all([createImageBitmap(e, {
			imageOrientation: "flipY",
			premultiplyAlpha: "none",
			colorSpaceConversion: "none"
		}), createImageBitmap(e)]);
	}).then(function(e) {
		const t = vr(e[0]), r = vr(e[1]);
		return t[1] !== r[1];
	}).catch(function() {
		return !1;
	}), fn);
}, Object.defineProperties(cn, { isBlobSupported: { get: function() {
	return un;
} } }), Object.defineProperties(cn.prototype, {
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
			if (!C(e)) throw new N("uri is required.");
			const t = new Ir.default(e);
			t.normalize();
			let r = t.path(), n = r.lastIndexOf("/");
			return -1 !== n && (r = r.substr(n + 1)), n = r.lastIndexOf("."), r = -1 === n ? "" : r.substr(n + 1), r;
		}(this._url);
	} },
	isDataUri: { get: function() {
		return zr(this._url);
	} },
	isBlobUri: { get: function() {
		return Mr(this._url);
	} },
	isCrossOriginUrl: { get: function() {
		return Fr(this._url);
	} },
	hasHeaders: { get: function() {
		return Object.keys(this.headers).length > 0;
	} },
	credits: { get: function() {
		return this._credits;
	} }
}), cn.prototype.toString = function() {
	return this.getUrlComponent(!0, !0);
}, cn.prototype.parseUrl = function(e, t, r, n) {
	let i = new Ir.default(e);
	const o = 0 === (a = i.query()).length ? {} : -1 === a.indexOf("=") ? { [a]: void 0 } : function(e) {
		if (!C(e)) throw new N("queryString is required.");
		const t = {};
		if ("" === e) return t;
		const r = e.replace(/\+/g, "%20").split(/[&;]/);
		for (let n = 0, i = r.length; n < i; ++n) {
			const e = r[n].split("="), i = decodeURIComponent(e[0]);
			let o = e[1];
			o = C(o) ? decodeURIComponent(o) : "";
			const a = t[i];
			"string" == typeof a ? t[i] = [a, o] : Array.isArray(a) ? a.push(o) : t[i] = o;
		}
		return t;
	}(a);
	var a;
	this._queryParameters = t ? hn(o, this.queryParameters, r) : o, i.search(""), i.fragment(""), C(n) && "" === i.scheme() && (i = i.absoluteTo(Cr(n))), this._url = i.toString();
}, cn.prototype.getUrlComponent = function(e, t) {
	if (this.isDataUri) return this._url;
	let r = this._url;
	e && (r = `${r}${function(e) {
		const t = Object.keys(e);
		return 0 === t.length ? "" : 1 !== t.length || C(e[t[0]]) ? `?${function(e) {
			if (!C(e)) throw new N("obj is required.");
			let t = "";
			for (const r in e) if (e.hasOwnProperty(r)) {
				const n = e[r], i = `${encodeURIComponent(r)}=`;
				if (Array.isArray(n)) for (let e = 0, r = n.length; e < r; ++e) t += `${i + encodeURIComponent(n[e])}&`;
				else t += `${i + encodeURIComponent(n)}&`;
			}
			return t = t.slice(0, -1), t;
		}(e)}` : `?${t[0]}`;
	}(this.queryParameters)}`), r = r.replace(/%7B/g, "{").replace(/%7D/g, "}");
	const n = this._templateValues;
	return Object.keys(n).length > 0 && (r = r.replace(/{(.*?)}/g, function(e, t) {
		const r = n[t];
		return C(r) ? encodeURIComponent(r) : e;
	})), t && C(this.proxy) && (r = this.proxy.getURL(r)), r;
}, cn.prototype.setQueryParameters = function(e, t) {
	this._queryParameters = t ? hn(this._queryParameters, e, !1) : hn(e, this._queryParameters, !1);
}, cn.prototype.appendQueryParameters = function(e) {
	this._queryParameters = hn(e, this._queryParameters, !0);
}, cn.prototype.setTemplateValues = function(e, t) {
	this._templateValues = t ? Rr(this._templateValues, e) : Rr(e, this._templateValues);
}, cn.prototype.getDerivedResource = function(e) {
	const t = this.clone();
	if (t._retryCount = 0, C(e.url)) {
		const r = e.preserveQueryParameters ?? !1;
		t.parseUrl(e.url, !0, r, this._url);
	}
	return C(e.queryParameters) && (t._queryParameters = Rr(e.queryParameters, t.queryParameters)), C(e.templateValues) && (t._templateValues = Rr(e.templateValues, t.templateValues)), C(e.headers) && (t.headers = Rr(e.headers, t.headers)), C(e.proxy) && (t.proxy = e.proxy), C(e.request) && (t.request = e.request), C(e.retryCallback) && (t.retryCallback = e.retryCallback), C(e.retryAttempts) && (t.retryAttempts = e.retryAttempts), t;
}, cn.prototype.retryOnError = function(e) {
	const t = this.retryCallback;
	if ("function" != typeof t || this._retryCount >= this.retryAttempts) return Promise.resolve(!1);
	const r = this;
	return Promise.resolve(t(this, e)).then(function(e) {
		return ++r._retryCount, e;
	});
}, cn.prototype.clone = function(e) {
	return C(e) ? (e._url = this._url, e._queryParameters = xr(this._queryParameters), e._templateValues = xr(this._templateValues), e.headers = xr(this.headers), e.proxy = this.proxy, e.retryCallback = this.retryCallback, e.retryAttempts = this.retryAttempts, e._retryCount = 0, e.request = this.request.clone(), e) : new cn({
		url: this._url,
		queryParameters: this.queryParameters,
		templateValues: this.templateValues,
		headers: this.headers,
		proxy: this.proxy,
		retryCallback: this.retryCallback,
		retryAttempts: this.retryAttempts,
		request: this.request.clone(),
		parseUrl: !1,
		credits: C(this.credits) ? this.credits.slice() : void 0
	});
}, cn.prototype.getBaseUri = function(e) {
	return function(e, t) {
		if (!C(e)) throw new N("uri is required.");
		let r = "";
		const n = e.lastIndexOf("/");
		return -1 !== n && (r = e.substring(0, n + 1)), t ? (0 !== (e = new Ir.default(e)).query().length && (r += `?${e.query()}`), 0 !== e.fragment().length && (r += `#${e.fragment()}`), r) : r;
	}(this.getUrlComponent(e), e);
}, cn.prototype.appendForwardSlash = function() {
	var e;
	this._url = (0 !== (e = this._url).length && "/" === e[e.length - 1] || (e = `${e}/`), e);
}, cn.prototype.fetchArrayBuffer = function() {
	return this.fetch({ responseType: "arraybuffer" });
}, cn.fetchArrayBuffer = function(e) {
	return new cn(e).fetchArrayBuffer();
}, cn.prototype.fetchBlob = function() {
	return this.fetch({ responseType: "blob" });
}, cn.fetchBlob = function(e) {
	return new cn(e).fetchBlob();
}, cn.prototype.fetchImage = function(e) {
	const t = (e = e ?? J.EMPTY_OBJECT).preferImageBitmap ?? !1, r = e.preferBlob ?? !1, n = e.flipY ?? !1, i = e.skipColorSpaceConversion ?? !1;
	if (mn(this.request), !un || this.isDataUri || this.isBlobUri || !this.hasHeaders && !r) return this._fetchImage({
		resource: this,
		flipY: n,
		skipColorSpaceConversion: i,
		preferImageBitmap: t
	});
	const o = this.fetchBlob();
	if (!C(o)) return;
	let a, s, u, c;
	return cn.supportsImageBitmapOptions().then(function(e) {
		return a = e, s = a && t, o;
	}).then(function(e) {
		if (C(e)) return c = e, s ? cn.createImageBitmapFromBlob(e, {
			flipY: n,
			premultiplyAlpha: !1,
			skipColorSpaceConversion: i
		}) : (u = new cn({ url: window.URL.createObjectURL(e) }), u._fetchImage({
			flipY: n,
			skipColorSpaceConversion: i,
			preferImageBitmap: !1
		}));
	}).then(function(e) {
		if (C(e)) return e.blob = c, s || window.URL.revokeObjectURL(u.url), e;
	}).catch(function(e) {
		return C(u) && window.URL.revokeObjectURL(u.url), e.blob = c, Promise.reject(e);
	});
}, cn.prototype._fetchImage = function(e) {
	const t = this, r = e.flipY, n = e.skipColorSpaceConversion, i = e.preferImageBitmap, o = t.request;
	o.url = t.url, o.requestFunction = function() {
		let e = !1;
		t.isDataUri || t.isBlobUri || (e = t.isCrossOriginUrl);
		const a = Sr();
		return cn._Implementations.createImage(o, e, a, r, n, i), a.promise;
	};
	const a = en.request(o);
	if (C(a)) return a.catch(function(e) {
		return o.state !== Br.FAILED ? Promise.reject(e) : t.retryOnError(e).then(function(a) {
			return a ? (o.state = Br.UNISSUED, o.deferred = void 0, t._fetchImage({
				flipY: r,
				skipColorSpaceConversion: n,
				preferImageBitmap: i
			})) : Promise.reject(e);
		});
	});
}, cn.fetchImage = function(e) {
	return new cn(e).fetchImage({
		flipY: e.flipY,
		skipColorSpaceConversion: e.skipColorSpaceConversion,
		preferBlob: e.preferBlob,
		preferImageBitmap: e.preferImageBitmap
	});
}, cn.prototype.fetchText = function() {
	return this.fetch({ responseType: "text" });
}, cn.fetchText = function(e) {
	return new cn(e).fetchText();
}, cn.prototype.fetchJson = function() {
	const e = this.fetch({
		responseType: "text",
		headers: { Accept: "application/json,*/*;q=0.01" }
	});
	if (C(e)) return e.then(function(e) {
		if (C(e)) return JSON.parse(e);
	});
}, cn.fetchJson = function(e) {
	return new cn(e).fetchJson();
}, cn.prototype.fetchXML = function() {
	return this.fetch({
		responseType: "document",
		overrideMimeType: "text/xml"
	});
}, cn.fetchXML = function(e) {
	return new cn(e).fetchXML();
}, cn.prototype.fetchJsonp = function(e) {
	let t;
	e = e ?? "callback", mn(this.request);
	do
		t = `loadJsonp${L.nextRandomNumber().toString().substring(2, 8)}`;
	while (C(window[t]));
	return pn(this, e, t);
}, cn.fetchJsonp = function(e) {
	return new cn(e).fetchJsonp(e.callbackParameterName);
}, cn.prototype._makeRequest = function(e) {
	const t = this;
	mn(t.request);
	const r = t.request, n = t.url;
	r.url = n, r.requestFunction = function() {
		const i = e.responseType, o = Rr(e.headers, t.headers), a = e.overrideMimeType, s = e.method, u = e.data, c = Sr(), l = cn._Implementations.loadWithXhr(n, i, s, u, o, c, a);
		return C(l) && C(l.abort) && (r.cancelFunction = function() {
			l.abort();
		}), c.promise;
	};
	const i = en.request(r);
	if (C(i)) return i.then(function(e) {
		return r.cancelFunction = void 0, e;
	}).catch(function(n) {
		return r.cancelFunction = void 0, r.state !== Br.FAILED ? Promise.reject(n) : t.retryOnError(n).then(function(i) {
			return i ? (r.state = Br.UNISSUED, r.deferred = void 0, t.fetch(e)) : Promise.reject(n);
		});
	});
};
const dn = /^data:(.*?)(;base64)?,(.*)$/;
function yn(e, t) {
	const r = decodeURIComponent(t);
	return e ? atob(r) : r;
}
function _n(e, t) {
	const r = yn(e, t), n = new ArrayBuffer(r.length), i = new Uint8Array(n);
	for (let o = 0; o < r.length; o++) i[o] = r.charCodeAt(o);
	return n;
}
cn.prototype.fetch = function(e) {
	return (e = ln(e, {})).method = "GET", this._makeRequest(e);
}, cn.fetch = function(e) {
	return new cn(e).fetch({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, cn.prototype.delete = function(e) {
	return (e = ln(e, {})).method = "DELETE", this._makeRequest(e);
}, cn.delete = function(e) {
	return new cn(e).delete({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType,
		data: e.data
	});
}, cn.prototype.head = function(e) {
	return (e = ln(e, {})).method = "HEAD", this._makeRequest(e);
}, cn.head = function(e) {
	return new cn(e).head({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, cn.prototype.options = function(e) {
	return (e = ln(e, {})).method = "OPTIONS", this._makeRequest(e);
}, cn.options = function(e) {
	return new cn(e).options({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, cn.prototype.post = function(e, t) {
	return v.defined("data", e), (t = ln(t, {})).method = "POST", t.data = e, this._makeRequest(t);
}, cn.post = function(e) {
	return new cn(e).post(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, cn.prototype.put = function(e, t) {
	return v.defined("data", e), (t = ln(t, {})).method = "PUT", t.data = e, this._makeRequest(t);
}, cn.put = function(e) {
	return new cn(e).put(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, cn.prototype.patch = function(e, t) {
	return v.defined("data", e), (t = ln(t, {})).method = "PATCH", t.data = e, this._makeRequest(t);
}, cn.patch = function(e) {
	return new cn(e).patch(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, cn._Implementations = {}, cn._Implementations.loadImageElement = function(e, t, r) {
	const n = new Image();
	n.onload = function() {
		0 === n.naturalWidth && 0 === n.naturalHeight && 0 === n.width && 0 === n.height && (n.width = 300, n.height = 150), r.resolve(n);
	}, n.onerror = function(e) {
		r.reject(e);
	}, t && (an.contains(e) ? n.crossOrigin = "use-credentials" : n.crossOrigin = ""), n.src = e;
}, cn._Implementations.createImage = function(e, t, r, n, i, o, a) {
	const s = e.url;
	cn.supportsImageBitmapOptions().then(function(u) {
		if (!u || !o) return void cn._Implementations.loadImageElement(s, t, r);
		const c = Sr(), l = cn._Implementations.loadWithXhr(s, "blob", "GET", void 0, a, c, void 0, void 0, void 0);
		return C(l) && C(l.abort) && (e.cancelFunction = function() {
			l.abort();
		}), c.promise.then(function(e) {
			if (C(e)) return cn.createImageBitmapFromBlob(e, {
				flipY: n,
				premultiplyAlpha: !1,
				skipColorSpaceConversion: i
			});
			r.reject(new me(`Successfully retrieved ${s} but it contained no content.`));
		}).then(function(e) {
			r.resolve(e);
		});
	}).catch(function(e) {
		r.reject(e);
	});
}, cn.createImageBitmapFromBlob = function(e, t) {
	return v.defined("options", t), v.typeOf.bool("options.flipY", t.flipY), v.typeOf.bool("options.premultiplyAlpha", t.premultiplyAlpha), v.typeOf.bool("options.skipColorSpaceConversion", t.skipColorSpaceConversion), createImageBitmap(e, {
		imageOrientation: t.flipY ? "flipY" : "none",
		premultiplyAlpha: t.premultiplyAlpha ? "premultiply" : "none",
		colorSpaceConversion: t.skipColorSpaceConversion ? "none" : "default"
	});
};
const gn = "undefined" == typeof XMLHttpRequest;
function En(e) {
	e = e ?? J.EMPTY_OBJECT, this._dates = void 0, this._samples = void 0, this._dateColumn = -1, this._xPoleWanderRadiansColumn = -1, this._yPoleWanderRadiansColumn = -1, this._ut1MinusUtcSecondsColumn = -1, this._xCelestialPoleOffsetRadiansColumn = -1, this._yCelestialPoleOffsetRadiansColumn = -1, this._taiMinusUtcSecondsColumn = -1, this._columnCount = 0, this._lastIndex = -1, this._addNewLeapSeconds = e.addNewLeapSeconds ?? !0, C(e.data) ? wn(this, e.data) : wn(this, {
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
function bn(e, t) {
	return Er.compare(e.julianDate, t);
}
function wn(e, t) {
	if (!C(t.columnNames)) throw new me("Error in loaded EOP data: The columnNames property is required.");
	if (!C(t.samples)) throw new me("Error in loaded EOP data: The samples property is required.");
	const r = t.columnNames.indexOf("modifiedJulianDateUtc"), n = t.columnNames.indexOf("xPoleWanderRadians"), i = t.columnNames.indexOf("yPoleWanderRadians"), o = t.columnNames.indexOf("ut1MinusUtcSeconds"), a = t.columnNames.indexOf("xCelestialPoleOffsetRadians"), s = t.columnNames.indexOf("yCelestialPoleOffsetRadians"), u = t.columnNames.indexOf("taiMinusUtcSeconds");
	if (r < 0 || n < 0 || i < 0 || o < 0 || a < 0 || s < 0 || u < 0) throw new me("Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns");
	const c = e._samples = t.samples, l = e._dates = [];
	let f;
	e._dateColumn = r, e._xPoleWanderRadiansColumn = n, e._yPoleWanderRadiansColumn = i, e._ut1MinusUtcSecondsColumn = o, e._xCelestialPoleOffsetRadiansColumn = a, e._yCelestialPoleOffsetRadiansColumn = s, e._taiMinusUtcSecondsColumn = u, e._columnCount = t.columnNames.length, e._lastIndex = void 0;
	const h = e._addNewLeapSeconds;
	for (let p = 0, m = c.length; p < m; p += e._columnCount) {
		const e = c[p + r], t = c[p + u], n = new Er(e + Jt.MODIFIED_JULIAN_DATE_DIFFERENCE, t, er.TAI);
		if (l.push(n), h) {
			if (t !== f && C(f)) {
				const e = Er.leapSeconds, r = Yt(e, n, bn);
				if (r < 0) {
					const i = new Qt(n, t);
					e.splice(~r, 0, i);
				}
			}
			f = t;
		}
	}
}
function Tn(e, t, r, n, i) {
	const o = r * n;
	i.xPoleWander = t[o + e._xPoleWanderRadiansColumn], i.yPoleWander = t[o + e._yPoleWanderRadiansColumn], i.xPoleOffset = t[o + e._xCelestialPoleOffsetRadiansColumn], i.yPoleOffset = t[o + e._yCelestialPoleOffsetRadiansColumn], i.ut1MinusUtc = t[o + e._ut1MinusUtcSecondsColumn];
}
function On(e, t, r) {
	return t + e * (r - t);
}
function An(e, t, r, n, i, o, a) {
	const s = e._columnCount;
	if (o > t.length - 1) return a.xPoleWander = 0, a.yPoleWander = 0, a.xPoleOffset = 0, a.yPoleOffset = 0, a.ut1MinusUtc = 0, a;
	const u = t[i], c = t[o];
	if (u.equals(c) || n.equals(u)) return Tn(e, r, i, s, a), a;
	if (n.equals(c)) return Tn(e, r, o, s, a), a;
	const l = Er.secondsDifference(n, u) / Er.secondsDifference(c, u), f = i * s, h = o * s;
	let p = r[f + e._ut1MinusUtcSecondsColumn], m = r[h + e._ut1MinusUtcSecondsColumn];
	const d = m - p;
	if (d > .5 || d < -.5) {
		const t = r[f + e._taiMinusUtcSecondsColumn], i = r[h + e._taiMinusUtcSecondsColumn];
		t !== i && (c.equals(n) ? p = m : m -= i - t);
	}
	return a.xPoleWander = On(l, r[f + e._xPoleWanderRadiansColumn], r[h + e._xPoleWanderRadiansColumn]), a.yPoleWander = On(l, r[f + e._yPoleWanderRadiansColumn], r[h + e._yPoleWanderRadiansColumn]), a.xPoleOffset = On(l, r[f + e._xCelestialPoleOffsetRadiansColumn], r[h + e._xCelestialPoleOffsetRadiansColumn]), a.yPoleOffset = On(l, r[f + e._yCelestialPoleOffsetRadiansColumn], r[h + e._yCelestialPoleOffsetRadiansColumn]), a.ut1MinusUtc = On(l, p, m), a;
}
function xn(e, t, r) {
	this.heading = e ?? 0, this.pitch = t ?? 0, this.roll = r ?? 0;
}
cn._Implementations.loadWithXhr = function(e, t, r, n, i, o, a) {
	const s = dn.exec(e);
	if (null !== s) return void o.resolve(function(e, t) {
		t = t ?? "";
		const r = e[1], n = !!e[2], i = e[3];
		let o, a;
		switch (t) {
			case "":
			case "text": return yn(n, i);
			case "arraybuffer": return _n(n, i);
			case "blob": return o = _n(n, i), new Blob([o], { type: r });
			case "document": return a = new DOMParser(), a.parseFromString(yn(n, i), r);
			case "json": return JSON.parse(yn(n, i));
			default: throw new N(`Unhandled responseType: ${t}`);
		}
	}(s, t));
	if (gn) return void function(e, t, r, n, i, o) {
		fetch(e, {
			method: r,
			headers: i
		}).then(async (e) => {
			if (!e.ok) {
				const t = {};
				e.headers.forEach((e, r) => {
					t[r] = e;
				}), o.reject(new qr(e.status, e, t));
				return;
			}
			switch (t) {
				case "text":
					o.resolve(e.text());
					break;
				case "json":
					o.resolve(e.json());
					break;
				default: o.resolve(new Uint8Array(await e.arrayBuffer()).buffer);
			}
		}).catch(() => {
			o.reject(new qr());
		});
	}(e, t, r, 0, i, o);
	const u = new XMLHttpRequest();
	if (an.contains(e) && (u.withCredentials = !0), u.open(r, e, !0), C(a) && C(u.overrideMimeType) && u.overrideMimeType(a), C(i)) for (const l in i) i.hasOwnProperty(l) && u.setRequestHeader(l, i[l]);
	C(t) && (u.responseType = t);
	let c = !1;
	return "string" == typeof e && (c = 0 === e.indexOf("file://") || "undefined" != typeof window && "file://" === window.location.origin), u.onload = function() {
		if ((u.status < 200 || u.status >= 300) && (!c || 0 !== u.status)) return void o.reject(new qr(u.status, u.response, u.getAllResponseHeaders()));
		const e = u.response, n = u.responseType;
		if ("HEAD" === r || "OPTIONS" === r) {
			const e = u.getAllResponseHeaders().trim().split(/[\r\n]+/), t = {};
			e.forEach(function(e) {
				const r = e.split(": "), n = r.shift();
				t[n] = r.join(": ");
			}), o.resolve(t);
			return;
		}
		if (204 === u.status) o.resolve(void 0);
		else if (!C(e) || C(t) && n !== t) if ("json" === t && "string" == typeof e) try {
			o.resolve(JSON.parse(e));
		} catch (e) {
			o.reject(e);
		}
		else ("" === n || "document" === n) && C(u.responseXML) && u.responseXML.hasChildNodes() ? o.resolve(u.responseXML) : "" !== n && "text" !== n || !C(u.responseText) ? o.reject(new me("Invalid XMLHttpRequest response type.")) : o.resolve(u.responseText);
		else o.resolve(e);
	}, u.onerror = function(e) {
		o.reject(new qr());
	}, u.send(n), u;
}, cn._Implementations.loadAndExecuteScript = function(e, t, r) {
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
}, cn._DefaultImplementations = {}, cn._DefaultImplementations.createImage = cn._Implementations.createImage, cn._DefaultImplementations.loadWithXhr = cn._Implementations.loadWithXhr, cn._DefaultImplementations.loadAndExecuteScript = cn._Implementations.loadAndExecuteScript, cn.DEFAULT = Object.freeze(new cn({ url: "undefined" == typeof document ? "" : document.location.href.split("?")[0] })), En.fromUrl = async function(e, t) {
	v.defined("url", e), t = t ?? J.EMPTY_OBJECT;
	const r = cn.createIfNeeded(e);
	let n;
	try {
		n = await r.fetchJson();
	} catch (e) {
		throw new me(`An error occurred while retrieving the EOP data from the URL ${r.url}.`);
	}
	return new En({
		addNewLeapSeconds: t.addNewLeapSeconds,
		data: n
	});
}, En.NONE = Object.freeze({ compute: function(e, t) {
	return C(t) ? (t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0) : t = new Xt(0, 0, 0, 0, 0), t;
} }), En.prototype.compute = function(e, t) {
	if (!C(this._samples)) return;
	if (C(t) || (t = new Xt(0, 0, 0, 0, 0)), 0 === this._samples.length) return t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0, t;
	const r = this._dates, n = this._lastIndex;
	let i = 0, o = 0;
	if (C(n)) {
		const a = r[n], s = r[n + 1], u = Er.lessThanOrEquals(a, e), c = !C(s), l = c || Er.greaterThanOrEquals(s, e);
		if (u && l) return i = n, !c && s.equals(e) && ++i, o = i + 1, An(this, r, this._samples, e, i, o, t), t;
	}
	let a = Yt(r, e, Er.compare, this._dateColumn);
	return a >= 0 ? (a < r.length - 1 && r[a + 1].equals(e) && ++a, i = a, o = a) : (o = ~a, i = o - 1, i < 0 && (i = 0)), this._lastIndex = i, An(this, r, this._samples, e, i, o, t), t;
}, xn.fromQuaternion = function(e, t) {
	if (!C(e)) throw new N("quaternion is required");
	C(t) || (t = new xn());
	const r = 2 * (e.w * e.y - e.z * e.x), n = 1 - 2 * (e.x * e.x + e.y * e.y), i = 2 * (e.w * e.x + e.y * e.z), o = 1 - 2 * (e.y * e.y + e.z * e.z), a = 2 * (e.w * e.z + e.x * e.y);
	return t.heading = -Math.atan2(a, o), t.roll = Math.atan2(i, n), t.pitch = -L.asinClamped(r), t;
}, xn.fromDegrees = function(e, t, r, n) {
	if (!C(e)) throw new N("heading is required");
	if (!C(t)) throw new N("pitch is required");
	if (!C(r)) throw new N("roll is required");
	return C(n) || (n = new xn()), n.heading = e * L.RADIANS_PER_DEGREE, n.pitch = t * L.RADIANS_PER_DEGREE, n.roll = r * L.RADIANS_PER_DEGREE, n;
}, xn.clone = function(e, t) {
	if (C(e)) return C(t) ? (t.heading = e.heading, t.pitch = e.pitch, t.roll = e.roll, t) : new xn(e.heading, e.pitch, e.roll);
}, xn.equals = function(e, t) {
	return e === t || C(e) && C(t) && e.heading === t.heading && e.pitch === t.pitch && e.roll === t.roll;
}, xn.equalsEpsilon = function(e, t, r, n) {
	return e === t || C(e) && C(t) && L.equalsEpsilon(e.heading, t.heading, r, n) && L.equalsEpsilon(e.pitch, t.pitch, r, n) && L.equalsEpsilon(e.roll, t.roll, r, n);
}, xn.prototype.clone = function(e) {
	return xn.clone(this, e);
}, xn.prototype.equals = function(e) {
	return xn.equals(this, e);
}, xn.prototype.equalsEpsilon = function(e, t, r) {
	return xn.equalsEpsilon(this, e, t, r);
}, xn.prototype.toString = function() {
	return `(${this.heading}, ${this.pitch}, ${this.roll})`;
};
const Rn = /((?:.*\/)|^)Cesium\.js(?:\?|\#|$)/;
let Sn, In, Cn;
function Nn(e) {
	return "undefined" == typeof document ? e : (C(Sn) || (Sn = document.createElement("a")), Sn.href = e, Sn.href);
}
function vn() {
	if (C(In)) return In;
	let e;
	if (e = "undefined" != typeof CESIUM_BASE_URL ? CESIUM_BASE_URL : C(import.meta?.url) ? Cr(".", import.meta.url) : "object" == typeof define && C(define.amd) && !define.amd.toUrlUndefined && C(u.toUrl) ? Cr("..", Ln("Core/buildModuleUrl.js")) : function() {
		const e = document.getElementsByTagName("script");
		for (let t = 0, r = e.length; t < r; ++t) {
			const r = e[t].getAttribute("src"), n = Rn.exec(r);
			if (null !== n) return n[1];
		}
	}(), !C(e)) throw new N("Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.");
	return In = new cn({ url: Nn(e) }), In.appendForwardSlash(), In;
}
function Pn(e) {
	return Nn(u.toUrl(`../${e}`));
}
function Mn(e) {
	return vn().getDerivedResource({ url: e }).url;
}
function Ln(e) {
	return C(Cn) || (Cn = "object" == typeof define && C(define.amd) && !define.amd.toUrlUndefined && C(u.toUrl) ? Pn : Mn), Cn(e);
}
function Fn(e, t, r) {
	this.x = e, this.y = t, this.s = r;
}
function Dn(e) {
	e = e ?? J.EMPTY_OBJECT, this._xysFileUrlTemplate = cn.createIfNeeded(e.xysFileUrlTemplate), this._interpolationOrder = e.interpolationOrder ?? 9, this._sampleZeroJulianEphemerisDate = e.sampleZeroJulianEphemerisDate ?? 2442396.5, this._sampleZeroDateTT = new Er(this._sampleZeroJulianEphemerisDate, 0, er.TAI), this._stepSizeDays = e.stepSizeDays ?? 1, this._samplesPerXysFile = e.samplesPerXysFile ?? 1e3, this._totalSamples = e.totalSamples ?? 27426, this._samples = new Array(3 * this._totalSamples), this._chunkDownloadsInProgress = [];
	const t = this._interpolationOrder, r = this._denominators = new Array(t + 1), n = this._xTable = new Array(t + 1), i = Math.pow(this._stepSizeDays, t);
	for (let o = 0; o <= t; ++o) {
		r[o] = i, n[o] = o * this._stepSizeDays;
		for (let e = 0; e <= t; ++e) e !== o && (r[o] *= o - e);
		r[o] = 1 / r[o];
	}
	this._work = new Array(t + 1), this._coef = new Array(t + 1);
}
Ln._cesiumScriptRegex = Rn, Ln._buildModuleUrlFromBaseUrl = Mn, Ln._clearBaseResource = function() {
	In = void 0;
}, Ln.setBaseUrl = function(e) {
	In = cn.DEFAULT.getDerivedResource({ url: e });
}, Ln.getCesiumBaseUrl = vn;
const zn = new Er(0, 0, er.TAI);
function Bn(e, t, r) {
	const n = zn;
	return n.dayNumber = t, n.secondsOfDay = r, Er.daysDifference(n, e._sampleZeroDateTT);
}
function Un(e, t) {
	if (C(e._chunkDownloadsInProgress[t])) return e._chunkDownloadsInProgress[t];
	let r;
	const n = e._xysFileUrlTemplate;
	r = C(n) ? n.getDerivedResource({ templateValues: { 0: t } }) : new cn({ url: Ln(`Assets/IAU2006_XYS/IAU2006_XYS_${t}.json`) });
	const i = async function(e, t, r) {
		try {
			const n = await e.fetchJson();
			r._updateChunkData(t, n);
		} catch (e) {}
	}(r, t, e);
	return e._chunkDownloadsInProgress[t] = i, i;
}
function jn(e, t, r, n) {
	this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0, this.w = n ?? 0;
}
Dn.prototype.preload = function(e, t, r, n) {
	const i = Bn(this, e, t), o = Bn(this, r, n);
	let a = i / this._stepSizeDays - this._interpolationOrder / 2 | 0;
	a < 0 && (a = 0);
	let s = o / this._stepSizeDays - this._interpolationOrder / 2 | 0 + this._interpolationOrder;
	s >= this._totalSamples && (s = this._totalSamples - 1);
	const u = a / this._samplesPerXysFile | 0, c = s / this._samplesPerXysFile | 0, l = [];
	for (let f = u; f <= c; ++f) l.push(Un(this, f));
	return Promise.all(l);
}, Dn.prototype.computeXysRadians = function(e, t, r) {
	const n = Bn(this, e, t);
	if (n < 0) return;
	const i = n / this._stepSizeDays | 0;
	if (i >= this._totalSamples) return;
	const o = this._interpolationOrder;
	let a = i - (o / 2 | 0);
	a < 0 && (a = 0);
	let s = a + o;
	s >= this._totalSamples && (s = this._totalSamples - 1, a = s - o, a < 0 && (a = 0));
	let u = !1;
	const c = this._samples;
	if (C(c[3 * a]) || (Un(this, a / this._samplesPerXysFile | 0), u = !0), C(c[3 * s]) || (Un(this, s / this._samplesPerXysFile | 0), u = !0), u) return;
	C(r) ? (r.x = 0, r.y = 0, r.s = 0) : r = new Fn(0, 0, 0);
	const l = n - a * this._stepSizeDays, f = this._work, h = this._denominators, p = this._coef, m = this._xTable;
	let d, y;
	for (d = 0; d <= o; ++d) f[d] = l - m[d];
	for (d = 0; d <= o; ++d) {
		for (p[d] = 1, y = 0; y <= o; ++y) y !== d && (p[d] *= f[y]);
		p[d] *= h[d];
		let e = 3 * (a + d);
		r.x += p[d] * c[e++], r.y += p[d] * c[e++], r.s += p[d] * c[e];
	}
	return r;
}, Dn.prototype._updateChunkData = function(e, { samples: t }) {
	this._chunkDownloadsInProgress[e] = void 0;
	const r = e * this._samplesPerXysFile * 3;
	for (let n = 0; n < t.length; ++n) this._samples[r + n] = t[n];
};
let qn = new z();
jn.fromAxisAngle = function(e, t, r) {
	v.typeOf.object("axis", e), v.typeOf.number("angle", t);
	const n = t / 2, i = Math.sin(n);
	qn = z.normalize(e, qn);
	const o = qn.x * i, a = qn.y * i, s = qn.z * i, u = Math.cos(n);
	return C(r) ? (r.x = o, r.y = a, r.z = s, r.w = u, r) : new jn(o, a, s, u);
};
const Gn = [
	1,
	2,
	0
], kn = new Array(3);
jn.fromRotationMatrix = function(e, t) {
	let r, n, i, o, a;
	v.typeOf.object("matrix", e);
	const s = e[ee.COLUMN0ROW0], u = e[ee.COLUMN1ROW1], c = e[ee.COLUMN2ROW2], l = s + u + c;
	if (l > 0) r = Math.sqrt(l + 1), a = .5 * r, r = .5 / r, n = (e[ee.COLUMN1ROW2] - e[ee.COLUMN2ROW1]) * r, i = (e[ee.COLUMN2ROW0] - e[ee.COLUMN0ROW2]) * r, o = (e[ee.COLUMN0ROW1] - e[ee.COLUMN1ROW0]) * r;
	else {
		const t = Gn;
		let l = 0;
		u > s && (l = 1), c > s && c > u && (l = 2);
		const f = t[l], h = t[f];
		r = Math.sqrt(e[ee.getElementIndex(l, l)] - e[ee.getElementIndex(f, f)] - e[ee.getElementIndex(h, h)] + 1);
		const p = kn;
		p[l] = .5 * r, r = .5 / r, a = (e[ee.getElementIndex(h, f)] - e[ee.getElementIndex(f, h)]) * r, p[f] = (e[ee.getElementIndex(f, l)] + e[ee.getElementIndex(l, f)]) * r, p[h] = (e[ee.getElementIndex(h, l)] + e[ee.getElementIndex(l, h)]) * r, n = -p[0], i = -p[1], o = -p[2];
	}
	return C(t) ? (t.x = n, t.y = i, t.z = o, t.w = a, t) : new jn(n, i, o, a);
};
const Wn = new jn();
let Vn = new jn(), Hn = new jn(), Yn = new jn();
jn.fromHeadingPitchRoll = function(e, t) {
	return v.typeOf.object("headingPitchRoll", e), Yn = jn.fromAxisAngle(z.UNIT_X, e.roll, Wn), Hn = jn.fromAxisAngle(z.UNIT_Y, -e.pitch, t), t = jn.multiply(Hn, Yn, Hn), Vn = jn.fromAxisAngle(z.UNIT_Z, -e.heading, Wn), jn.multiply(Vn, t, t);
};
const Xn = new z(), $n = new z(), Kn = new jn(), Zn = new jn(), Qn = new jn();
jn.packedLength = 4, jn.pack = function(e, t, r) {
	return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.z, t[r] = e.w, t;
}, jn.unpack = function(e, t, r) {
	return v.defined("array", e), t = t ?? 0, C(r) || (r = new jn()), r.x = e[t], r.y = e[t + 1], r.z = e[t + 2], r.w = e[t + 3], r;
}, jn.packedInterpolationLength = 3, jn.convertPackedArrayForInterpolation = function(e, t, r, n) {
	jn.unpack(e, 4 * r, Qn), jn.conjugate(Qn, Qn);
	for (let i = 0, o = r - t + 1; i < o; i++) {
		const r = 3 * i;
		jn.unpack(e, 4 * (t + i), Kn), jn.multiply(Kn, Qn, Kn), Kn.w < 0 && jn.negate(Kn, Kn), jn.computeAxis(Kn, Xn);
		const o = jn.computeAngle(Kn);
		C(n) || (n = []), n[r] = Xn.x * o, n[r + 1] = Xn.y * o, n[r + 2] = Xn.z * o;
	}
}, jn.unpackInterpolationResult = function(e, t, r, n, i) {
	C(i) || (i = new jn()), z.fromArray(e, 0, $n);
	const o = z.magnitude($n);
	return jn.unpack(t, 4 * n, Zn), 0 === o ? jn.clone(jn.IDENTITY, Kn) : jn.fromAxisAngle($n, o, Kn), jn.multiply(Kn, Zn, i);
}, jn.clone = function(e, t) {
	if (C(e)) return C(t) ? (t.x = e.x, t.y = e.y, t.z = e.z, t.w = e.w, t) : new jn(e.x, e.y, e.z, e.w);
}, jn.conjugate = function(e, t) {
	return v.typeOf.object("quaternion", e), v.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = e.w, t;
}, jn.magnitudeSquared = function(e) {
	return v.typeOf.object("quaternion", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w;
}, jn.magnitude = function(e) {
	return Math.sqrt(jn.magnitudeSquared(e));
}, jn.normalize = function(e, t) {
	v.typeOf.object("result", t);
	const r = 1 / jn.magnitude(e), n = e.x * r, i = e.y * r, o = e.z * r, a = e.w * r;
	return t.x = n, t.y = i, t.z = o, t.w = a, t;
}, jn.inverse = function(e, t) {
	v.typeOf.object("result", t);
	const r = jn.magnitudeSquared(e);
	return t = jn.conjugate(e, t), jn.multiplyByScalar(t, 1 / r, t);
}, jn.add = function(e, t, r) {
	return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r.w = e.w + t.w, r;
}, jn.subtract = function(e, t, r) {
	return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r.w = e.w - t.w, r;
}, jn.negate = function(e, t) {
	return v.typeOf.object("quaternion", e), v.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
}, jn.dot = function(e, t) {
	return v.typeOf.object("left", e), v.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z + e.w * t.w;
}, jn.multiply = function(e, t, r) {
	v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r);
	const n = e.x, i = e.y, o = e.z, a = e.w, s = t.x, u = t.y, c = t.z, l = t.w, f = a * s + n * l + i * c - o * u, h = a * u - n * c + i * l + o * s, p = a * c + n * u - i * s + o * l, m = a * l - n * s - i * u - o * c;
	return r.x = f, r.y = h, r.z = p, r.w = m, r;
}, jn.multiplyByScalar = function(e, t, r) {
	return v.typeOf.object("quaternion", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r.w = e.w * t, r;
}, jn.divideByScalar = function(e, t, r) {
	return v.typeOf.object("quaternion", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r.w = e.w / t, r;
}, jn.computeAxis = function(e, t) {
	v.typeOf.object("quaternion", e), v.typeOf.object("result", t);
	const r = e.w;
	if (Math.abs(r - 1) < L.EPSILON6 || Math.abs(r + 1) < L.EPSILON6) return t.x = 1, t.y = t.z = 0, t;
	const n = 1 / Math.sqrt(1 - r * r);
	return t.x = e.x * n, t.y = e.y * n, t.z = e.z * n, t;
}, jn.computeAngle = function(e) {
	return v.typeOf.object("quaternion", e), Math.abs(e.w - 1) < L.EPSILON6 ? 0 : 2 * Math.acos(e.w);
};
let Jn = new jn();
jn.lerp = function(e, t, r, n) {
	return v.typeOf.object("start", e), v.typeOf.object("end", t), v.typeOf.number("t", r), v.typeOf.object("result", n), Jn = jn.multiplyByScalar(t, r, Jn), n = jn.multiplyByScalar(e, 1 - r, n), jn.add(Jn, n, n);
};
let ei = new jn(), ti = new jn(), ri = new jn();
jn.slerp = function(e, t, r, n) {
	v.typeOf.object("start", e), v.typeOf.object("end", t), v.typeOf.number("t", r), v.typeOf.object("result", n);
	let i = jn.dot(e, t), o = t;
	if (i < 0 && (i = -i, o = ei = jn.negate(t, ei)), 1 - i < L.EPSILON6) return jn.lerp(e, o, r, n);
	const a = Math.acos(i);
	return ti = jn.multiplyByScalar(e, Math.sin((1 - r) * a), ti), ri = jn.multiplyByScalar(o, Math.sin(r * a), ri), n = jn.add(ti, ri, n), jn.multiplyByScalar(n, 1 / Math.sin(a), n);
}, jn.log = function(e, t) {
	v.typeOf.object("quaternion", e), v.typeOf.object("result", t);
	const r = L.acosClamped(e.w);
	let n = 0;
	return 0 !== r && (n = r / Math.sin(r)), z.multiplyByScalar(e, n, t);
}, jn.exp = function(e, t) {
	v.typeOf.object("cartesian", e), v.typeOf.object("result", t);
	const r = z.magnitude(e);
	let n = 0;
	return 0 !== r && (n = Math.sin(r) / r), t.x = e.x * n, t.y = e.y * n, t.z = e.z * n, t.w = Math.cos(r), t;
};
const ni = new z(), ii = new z(), oi = new jn(), ai = new jn();
jn.computeInnerQuadrangle = function(e, t, r, n) {
	v.typeOf.object("q0", e), v.typeOf.object("q1", t), v.typeOf.object("q2", r), v.typeOf.object("result", n);
	const i = jn.conjugate(t, oi);
	jn.multiply(i, r, ai);
	const o = jn.log(ai, ni);
	jn.multiply(i, e, ai);
	const a = jn.log(ai, ii);
	return z.add(o, a, o), z.multiplyByScalar(o, .25, o), z.negate(o, o), jn.exp(o, oi), jn.multiply(t, oi, n);
}, jn.squad = function(e, t, r, n, i, o) {
	v.typeOf.object("q0", e), v.typeOf.object("q1", t), v.typeOf.object("s0", r), v.typeOf.object("s1", n), v.typeOf.number("t", i), v.typeOf.object("result", o);
	const a = jn.slerp(e, t, i, oi), s = jn.slerp(r, n, i, ai);
	return jn.slerp(a, s, 2 * i * (1 - i), o);
};
const si = new jn(), ui = 1.9011074535173003, ci = ft.supportsTypedArrays() ? new Float32Array(8) : [], li = ft.supportsTypedArrays() ? new Float32Array(8) : [], fi = ft.supportsTypedArrays() ? new Float32Array(8) : [], hi = ft.supportsTypedArrays() ? new Float32Array(8) : [];
for (let Dl = 0; Dl < 7; ++Dl) {
	const e = Dl + 1, t = 2 * e + 1;
	ci[Dl] = 1 / (e * t), li[Dl] = e / t;
}
ci[7] = ui / 136, li[7] = 8 * ui / 17, jn.fastSlerp = function(e, t, r, n) {
	v.typeOf.object("start", e), v.typeOf.object("end", t), v.typeOf.number("t", r), v.typeOf.object("result", n);
	let i, o = jn.dot(e, t);
	o >= 0 ? i = 1 : (i = -1, o = -o);
	const a = o - 1, s = 1 - r, u = r * r, c = s * s;
	for (let p = 7; p >= 0; --p) fi[p] = (ci[p] * u - li[p]) * a, hi[p] = (ci[p] * c - li[p]) * a;
	const l = i * r * (1 + fi[0] * (1 + fi[1] * (1 + fi[2] * (1 + fi[3] * (1 + fi[4] * (1 + fi[5] * (1 + fi[6] * (1 + fi[7])))))))), f = s * (1 + hi[0] * (1 + hi[1] * (1 + hi[2] * (1 + hi[3] * (1 + hi[4] * (1 + hi[5] * (1 + hi[6] * (1 + hi[7])))))))), h = jn.multiplyByScalar(e, f, si);
	return jn.multiplyByScalar(t, l, n), jn.add(h, n, n);
}, jn.fastSquad = function(e, t, r, n, i, o) {
	v.typeOf.object("q0", e), v.typeOf.object("q1", t), v.typeOf.object("s0", r), v.typeOf.object("s1", n), v.typeOf.number("t", i), v.typeOf.object("result", o);
	const a = jn.fastSlerp(e, t, i, oi), s = jn.fastSlerp(r, n, i, ai);
	return jn.fastSlerp(a, s, 2 * i * (1 - i), o);
}, jn.equals = function(e, t) {
	return e === t || C(e) && C(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
}, jn.equalsEpsilon = function(e, t, r) {
	return r = r ?? 0, e === t || C(e) && C(t) && Math.abs(e.x - t.x) <= r && Math.abs(e.y - t.y) <= r && Math.abs(e.z - t.z) <= r && Math.abs(e.w - t.w) <= r;
}, jn.ZERO = Object.freeze(new jn(0, 0, 0, 0)), jn.IDENTITY = Object.freeze(new jn(0, 0, 0, 1)), jn.prototype.clone = function(e) {
	return jn.clone(this, e);
}, jn.prototype.equals = function(e) {
	return jn.equals(this, e);
}, jn.prototype.equalsEpsilon = function(e, t) {
	return jn.equalsEpsilon(this, e, t);
}, jn.prototype.toString = function() {
	return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
};
const pi = {}, mi = {
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
}, di = {
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
}, yi = {}, _i = {
	east: new z(),
	north: new z(),
	up: new z(),
	west: new z(),
	south: new z(),
	down: new z()
};
let gi = new z(), Ei = new z(), bi = new z();
pi.localFrameToFixedFrameGenerator = function(e, t) {
	if (!mi.hasOwnProperty(e) || !mi[e].hasOwnProperty(t)) throw new N("firstAxis and secondAxis must be east, north, up, west, south or down.");
	const r = mi[e][t];
	let n;
	const i = e + t;
	return C(yi[i]) ? n = yi[i] : (n = function(n, i, o) {
		if (!C(n)) throw new N("origin is required.");
		if (isNaN(n.x) || isNaN(n.y) || isNaN(n.z)) throw new N("origin has a NaN component");
		if (C(o) || (o = new de()), z.equalsEpsilon(n, z.ZERO, L.EPSILON14)) z.unpack(di[e], 0, gi), z.unpack(di[t], 0, Ei), z.unpack(di[r], 0, bi);
		else if (L.equalsEpsilon(n.x, 0, L.EPSILON14) && L.equalsEpsilon(n.y, 0, L.EPSILON14)) {
			const i = L.sign(n.z);
			z.unpack(di[e], 0, gi), "east" !== e && "west" !== e && z.multiplyByScalar(gi, i, gi), z.unpack(di[t], 0, Ei), "east" !== t && "west" !== t && z.multiplyByScalar(Ei, i, Ei), z.unpack(di[r], 0, bi), "east" !== r && "west" !== r && z.multiplyByScalar(bi, i, bi);
		} else {
			(i = i ?? Ft.default).geodeticSurfaceNormal(n, _i.up);
			const o = _i.up, a = _i.east;
			a.x = -n.y, a.y = n.x, a.z = 0, z.normalize(a, _i.east), z.cross(o, a, _i.north), z.multiplyByScalar(_i.up, -1, _i.down), z.multiplyByScalar(_i.east, -1, _i.west), z.multiplyByScalar(_i.north, -1, _i.south), gi = _i[e], Ei = _i[t], bi = _i[r];
		}
		return o[0] = gi.x, o[1] = gi.y, o[2] = gi.z, o[3] = 0, o[4] = Ei.x, o[5] = Ei.y, o[6] = Ei.z, o[7] = 0, o[8] = bi.x, o[9] = bi.y, o[10] = bi.z, o[11] = 0, o[12] = n.x, o[13] = n.y, o[14] = n.z, o[15] = 1, o;
	}, yi[i] = n), n;
}, pi.eastNorthUpToFixedFrame = pi.localFrameToFixedFrameGenerator("east", "north"), pi.northEastDownToFixedFrame = pi.localFrameToFixedFrameGenerator("north", "east"), pi.northUpEastToFixedFrame = pi.localFrameToFixedFrameGenerator("north", "up"), pi.northWestUpToFixedFrame = pi.localFrameToFixedFrameGenerator("north", "west");
const wi = new jn(), Ti = new z(1, 1, 1), Oi = new de();
pi.headingPitchRollToFixedFrame = function(e, t, r, n, i) {
	v.typeOf.object("HeadingPitchRoll", t), n = n ?? pi.eastNorthUpToFixedFrame;
	const o = jn.fromHeadingPitchRoll(t, wi), a = de.fromTranslationQuaternionRotationScale(z.ZERO, o, Ti, Oi);
	return i = n(e, r, i), de.multiply(i, a, i);
};
const Ai = new de(), xi = new ee();
pi.headingPitchRollQuaternion = function(e, t, r, n, i) {
	v.typeOf.object("HeadingPitchRoll", t);
	const o = pi.headingPitchRollToFixedFrame(e, t, r, n, Ai), a = de.getMatrix3(o, xi);
	return jn.fromRotationMatrix(a, i);
};
const Ri = new z(1, 1, 1), Si = new z(), Ii = new de(), Ci = new de(), Ni = new ee(), vi = new jn();
pi.fixedFrameToHeadingPitchRoll = function(e, t, r, n) {
	v.defined("transform", e), t = t ?? Ft.default, r = r ?? pi.eastNorthUpToFixedFrame, C(n) || (n = new xn());
	const i = de.getTranslation(e, Si);
	if (z.equals(i, z.ZERO)) return n.heading = 0, n.pitch = 0, n.roll = 0, n;
	let o = de.inverseTransformation(r(i, t, Ii), Ii), a = de.setScale(e, Ri, Ci);
	a = de.setTranslation(a, z.ZERO, a), o = de.multiply(o, a, o);
	let s = jn.fromRotationMatrix(de.getMatrix3(o, Ni), vi);
	return s = jn.normalize(s, s), xn.fromQuaternion(s, n);
};
const Pi = L.TWO_PI / 86400;
let Mi = new Er();
pi.computeIcrfToCentralBodyFixedMatrix = function(e, t) {
	let r = pi.computeIcrfToFixedMatrix(e, t);
	return C(r) || (r = pi.computeTemeToPseudoFixedMatrix(e, t)), r;
}, pi.computeTemeToPseudoFixedMatrix = function(e, t) {
	if (!C(e)) throw new N("date is required.");
	Mi = Er.addSeconds(e, -Er.computeTaiMinusUtc(e), Mi);
	const r = Mi.dayNumber, n = Mi.secondsOfDay;
	let i;
	const o = r - 2451545;
	i = n >= 43200 ? (o + .5) / Jt.DAYS_PER_JULIAN_CENTURY : (o - .5) / Jt.DAYS_PER_JULIAN_CENTURY;
	const a = (24110.54841 + i * (8640184.812866 + i * (.093104 + -62e-7 * i))) * Pi % L.TWO_PI + (n + .5 * Jt.SECONDS_PER_DAY) % Jt.SECONDS_PER_DAY * (72921158553e-15 + 11772758384668e-32 * (r - 2451545.5)), s = Math.cos(a), u = Math.sin(a);
	return C(t) ? (t[0] = s, t[1] = -u, t[2] = 0, t[3] = u, t[4] = s, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t) : new ee(s, u, 0, -u, s, 0, 0, 0, 1);
}, pi.iau2006XysData = new Dn(), pi.earthOrientationParameters = En.NONE;
const Li = 32.184;
pi.preloadIcrfFixed = function(e) {
	const t = e.start.dayNumber, r = e.start.secondsOfDay + Li, n = e.stop.dayNumber, i = e.stop.secondsOfDay + Li;
	return pi.iau2006XysData.preload(t, r, n, i);
}, pi.computeIcrfToFixedMatrix = function(e, t) {
	if (!C(e)) throw new N("date is required.");
	C(t) || (t = new ee());
	const r = pi.computeFixedToIcrfMatrix(e, t);
	if (C(r)) return ee.transpose(r, t);
};
const Fi = new xn(), Di = new ee(), zi = new Er();
pi.computeMoonFixedToIcrfMatrix = function(e, t) {
	if (!C(e)) throw new N("date is required.");
	C(t) || (t = new ee());
	const r = Er.addSeconds(e, 32.184, zi), n = Er.totalDays(r) - 2451545, i = L.toRadians(12.112) - L.toRadians(.052992) * n, o = L.toRadians(24.224) - L.toRadians(.105984) * n, a = L.toRadians(227.645) + L.toRadians(13.012) * n, s = L.toRadians(261.105) + L.toRadians(13.340716) * n, u = L.toRadians(358) + L.toRadians(.9856) * n;
	return Fi.pitch = L.toRadians(180) - L.toRadians(3.878) * Math.sin(i) - L.toRadians(.12) * Math.sin(o) + L.toRadians(.07) * Math.sin(a) - L.toRadians(.017) * Math.sin(s), Fi.roll = L.toRadians(-23.47) + L.toRadians(1.543) * Math.cos(i) + L.toRadians(.24) * Math.cos(o) - L.toRadians(.028) * Math.cos(a) + L.toRadians(.007) * Math.cos(s), Fi.heading = L.toRadians(154.375) + L.toRadians(13.17635831) * n + L.toRadians(3.558) * Math.sin(i) + L.toRadians(.121) * Math.sin(o) - L.toRadians(.064) * Math.sin(a) + L.toRadians(.016) * Math.sin(s) + L.toRadians(.025) * Math.sin(u), ee.fromHeadingPitchRoll(Fi, Di);
}, pi.computeIcrfToMoonFixedMatrix = function(e, t) {
	if (!C(e)) throw new N("date is required.");
	C(t) || (t = new ee());
	const r = pi.computeMoonFixedToIcrfMatrix(e, t);
	if (C(r)) return ee.transpose(r, t);
};
const Bi = new Fn(0, 0, 0), Ui = new Xt(0, 0, 0, 0, 0, 0), ji = new ee(), qi = new ee();
pi.computeFixedToIcrfMatrix = function(e, t) {
	if (!C(e)) throw new N("date is required.");
	C(t) || (t = new ee());
	const r = pi.earthOrientationParameters.compute(e, Ui);
	if (!C(r)) return;
	const n = e.dayNumber, i = e.secondsOfDay + Li, o = pi.iau2006XysData.computeXysRadians(n, i, Bi);
	if (!C(o)) return;
	const a = o.x + r.xPoleOffset, s = o.y + r.yPoleOffset, u = 1 / (1 + Math.sqrt(1 - a * a - s * s)), c = ji;
	c[0] = 1 - u * a * a, c[3] = -u * a * s, c[6] = a, c[1] = -u * a * s, c[4] = 1 - u * s * s, c[7] = s, c[2] = -a, c[5] = -s, c[8] = 1 - u * (a * a + s * s);
	const l = ee.fromRotationZ(-o.s, qi), f = ee.multiply(c, l, ji), h = e.dayNumber, p = (e.secondsOfDay - Er.computeTaiMinusUtc(e) + r.ut1MinusUtc) / Jt.SECONDS_PER_DAY;
	let m = .779057273264 + p + .00273781191135448 * (h - 2451545 + p);
	m = m % 1 * L.TWO_PI;
	const d = ee.fromRotationZ(m, qi), y = ee.multiply(f, d, ji), _ = Math.cos(r.xPoleWander), g = Math.cos(r.yPoleWander), E = Math.sin(r.xPoleWander), b = Math.sin(r.yPoleWander);
	let w = n - 2451545 + i / Jt.SECONDS_PER_DAY;
	w /= 36525;
	const T = -47e-6 * w * L.RADIANS_PER_DEGREE / 3600, O = Math.cos(T), A = Math.sin(T), x = qi;
	return x[0] = _ * O, x[1] = _ * A, x[2] = E, x[3] = -g * A + b * E * O, x[4] = g * O + b * E * A, x[5] = -b * _, x[6] = -b * A - g * E * O, x[7] = b * O - g * E * A, x[8] = g * _, ee.multiply(y, x, t);
};
const Gi = new V();
pi.pointToWindowCoordinates = function(e, t, r, n) {
	return (n = pi.pointToGLWindowCoordinates(e, t, r, n)).y = 2 * t[5] - n.y, n;
}, pi.pointToGLWindowCoordinates = function(e, t, r, n) {
	if (!C(e)) throw new N("modelViewProjectionMatrix is required.");
	if (!C(t)) throw new N("viewportTransformation is required.");
	if (!C(r)) throw new N("point is required.");
	C(n) || (n = new wt());
	const i = Gi;
	return de.multiplyByVector(e, V.fromElements(r.x, r.y, r.z, 1, i), i), V.multiplyByScalar(i, 1 / i.w, i), de.multiplyByVector(t, i, i), wt.fromCartesian4(i, n);
};
const ki = new z(), Wi = new z(), Vi = new z();
pi.rotationMatrixFromPositionVelocity = function(e, t, r, n) {
	if (!C(e)) throw new N("position is required.");
	if (!C(t)) throw new N("velocity is required.");
	const i = (r ?? Ft.default).geodeticSurfaceNormal(e, ki);
	let o = z.cross(t, i, Wi);
	z.equalsEpsilon(o, z.ZERO, L.EPSILON6) && (o = z.clone(z.UNIT_X, o));
	const a = z.cross(o, t, Vi);
	return z.normalize(a, a), z.cross(t, a, o), z.negate(o, o), z.normalize(o, o), C(n) || (n = new ee()), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = o.x, n[4] = o.y, n[5] = o.z, n[6] = a.x, n[7] = a.y, n[8] = a.z, n;
}, pi.SWIZZLE_3D_TO_2D_MATRIX = Object.freeze(new de(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
const Hi = new Nt(), Yi = new z(), Xi = new z(), $i = new ee(), Ki = new de(), Zi = new de();
pi.basisTo2D = function(e, t, r) {
	if (!C(e)) throw new N("projection is required.");
	if (!C(t)) throw new N("matrix is required.");
	if (!C(r)) throw new N("result is required.");
	const n = de.getTranslation(t, Xi), i = e.ellipsoid;
	let o;
	if (z.equals(n, z.ZERO)) o = z.clone(z.ZERO, Yi);
	else {
		const t = i.cartesianToCartographic(n, Hi);
		o = e.project(t, Yi), z.fromElements(o.z, o.x, o.y, o);
	}
	const a = pi.eastNorthUpToFixedFrame(n, i, Ki), s = de.inverseTransformation(a, Zi), u = de.getMatrix3(t, $i), c = de.multiplyByMatrix3(s, u, r);
	return de.multiply(pi.SWIZZLE_3D_TO_2D_MATRIX, c, r), de.setTranslation(r, o, r), r;
}, pi.ellipsoidTo2DModelMatrix = function(e, t, r) {
	if (!C(e)) throw new N("projection is required.");
	if (!C(t)) throw new N("center is required.");
	if (!C(r)) throw new N("result is required.");
	const n = e.ellipsoid, i = pi.eastNorthUpToFixedFrame(t, n, Ki), o = de.inverseTransformation(i, Zi), a = n.cartesianToCartographic(t, Hi), s = e.project(a, Yi);
	z.fromElements(s.z, s.x, s.y, s);
	const u = de.fromTranslation(s, Ki);
	return de.multiply(pi.SWIZZLE_3D_TO_2D_MATRIX, o, r), de.multiply(u, r, r), r;
};
var Qi = class e {
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
		return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, t[r++] = e.west, t[r++] = e.south, t[r++] = e.east, t[r] = e.north, t;
	}
	static unpack(t, r, n) {
		return v.defined("array", t), r = r ?? 0, C(n) || (n = new e()), n.west = t[r++], n.south = t[r++], n.east = t[r++], n.north = t[r], n;
	}
	static computeWidth(e) {
		v.typeOf.object("rectangle", e);
		let t = e.east;
		const r = e.west;
		return t < r && (t += L.TWO_PI), t - r;
	}
	static computeHeight(e) {
		return v.typeOf.object("rectangle", e), e.north - e.south;
	}
	static fromDegrees(t, r, n, i, o) {
		return t = L.toRadians(t ?? 0), r = L.toRadians(r ?? 0), n = L.toRadians(n ?? 0), i = L.toRadians(i ?? 0), C(o) ? (o.west = t, o.south = r, o.east = n, o.north = i, o) : new e(t, r, n, i);
	}
	static fromRadians(t, r, n, i, o) {
		return C(o) ? (o.west = t ?? 0, o.south = r ?? 0, o.east = n ?? 0, o.north = i ?? 0, o) : new e(t, r, n, i);
	}
	static fromCartographicArray(t, r) {
		v.defined("cartographics", t);
		let n = Number.MAX_VALUE, i = -Number.MAX_VALUE, o = Number.MAX_VALUE, a = -Number.MAX_VALUE, s = Number.MAX_VALUE, u = -Number.MAX_VALUE;
		for (let e = 0, c = t.length; e < c; e++) {
			const r = t[e];
			n = Math.min(n, r.longitude), i = Math.max(i, r.longitude), s = Math.min(s, r.latitude), u = Math.max(u, r.latitude);
			const c = r.longitude >= 0 ? r.longitude : r.longitude + L.TWO_PI;
			o = Math.min(o, c), a = Math.max(a, c);
		}
		return i - n > a - o && (n = o, i = a, i > L.PI && (i -= L.TWO_PI), n > L.PI && (n -= L.TWO_PI)), C(r) ? (r.west = n, r.south = s, r.east = i, r.north = u, r) : new e(n, s, i, u);
	}
	static fromCartesianArray(t, r, n) {
		v.defined("cartesians", t), r = r ?? Ft.default;
		let i = Number.MAX_VALUE, o = -Number.MAX_VALUE, a = Number.MAX_VALUE, s = -Number.MAX_VALUE, u = Number.MAX_VALUE, c = -Number.MAX_VALUE;
		for (let e = 0, l = t.length; e < l; e++) {
			const n = r.cartesianToCartographic(t[e]);
			i = Math.min(i, n.longitude), o = Math.max(o, n.longitude), u = Math.min(u, n.latitude), c = Math.max(c, n.latitude);
			const l = n.longitude >= 0 ? n.longitude : n.longitude + L.TWO_PI;
			a = Math.min(a, l), s = Math.max(s, l);
		}
		return o - i > s - a && (i = a, o = s, o > L.PI && (o -= L.TWO_PI), i > L.PI && (i -= L.TWO_PI)), C(n) ? (n.west = i, n.south = u, n.east = o, n.north = c, n) : new e(i, u, o, c);
	}
	static fromBoundingSphere(t, r, n) {
		v.typeOf.object("boundingSphere", t);
		const i = t.center, o = t.radius;
		if (C(r) || (r = Ft.default), C(n) || (n = new e()), z.equals(i, z.ZERO)) return e.clone(e.MAX_VALUE, n), n;
		const a = pi.eastNorthUpToFixedFrame(i, r, Ji), s = de.multiplyByPointAsVector(a, z.UNIT_X, eo);
		z.normalize(s, s);
		const u = de.multiplyByPointAsVector(a, z.UNIT_Y, to);
		z.normalize(u, u), z.multiplyByScalar(u, o, u), z.multiplyByScalar(s, o, s);
		const c = z.negate(u, no), l = z.negate(s, ro), f = io;
		let h = f[0];
		return z.add(i, u, h), h = f[1], z.add(i, l, h), h = f[2], z.add(i, c, h), h = f[3], z.add(i, s, h), f[4] = i, e.fromCartesianArray(f, r, n);
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r.west = t.west, r.south = t.south, r.east = t.east, r.north = t.north, r) : new e(t.west, t.south, t.east, t.north);
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || C(e) && C(t) && Math.abs(e.west - t.west) <= r && Math.abs(e.south - t.south) <= r && Math.abs(e.east - t.east) <= r && Math.abs(e.north - t.north) <= r;
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && e.west === t.west && e.south === t.south && e.east === t.east && e.north === t.north;
	}
	equalsEpsilon(t, r) {
		return e.equalsEpsilon(this, t, r);
	}
	static _validate(e) {
		v.typeOf.object("rectangle", e);
		const t = e.north;
		v.typeOf.number.greaterThanOrEquals("north", t, -L.PI_OVER_TWO), v.typeOf.number.lessThanOrEquals("north", t, L.PI_OVER_TWO);
		const r = e.south;
		v.typeOf.number.greaterThanOrEquals("south", r, -L.PI_OVER_TWO), v.typeOf.number.lessThanOrEquals("south", r, L.PI_OVER_TWO);
		const n = e.west;
		v.typeOf.number.greaterThanOrEquals("west", n, -Math.PI), v.typeOf.number.lessThanOrEquals("west", n, Math.PI);
		const i = e.east;
		v.typeOf.number.greaterThanOrEquals("east", i, -Math.PI), v.typeOf.number.lessThanOrEquals("east", i, Math.PI);
	}
	static southwest(e, t) {
		return v.typeOf.object("rectangle", e), C(t) ? (t.longitude = e.west, t.latitude = e.south, t.height = 0, t) : new Nt(e.west, e.south);
	}
	static northwest(e, t) {
		return v.typeOf.object("rectangle", e), C(t) ? (t.longitude = e.west, t.latitude = e.north, t.height = 0, t) : new Nt(e.west, e.north);
	}
	static northeast(e, t) {
		return v.typeOf.object("rectangle", e), C(t) ? (t.longitude = e.east, t.latitude = e.north, t.height = 0, t) : new Nt(e.east, e.north);
	}
	static southeast(e, t) {
		return v.typeOf.object("rectangle", e), C(t) ? (t.longitude = e.east, t.latitude = e.south, t.height = 0, t) : new Nt(e.east, e.south);
	}
	static center(e, t) {
		v.typeOf.object("rectangle", e);
		let r = e.east;
		const n = e.west;
		r < n && (r += L.TWO_PI);
		const i = L.negativePiToPi(.5 * (n + r)), o = .5 * (e.south + e.north);
		return C(t) ? (t.longitude = i, t.latitude = o, t.height = 0, t) : new Nt(i, o);
	}
	static intersection(t, r, n) {
		v.typeOf.object("rectangle", t), v.typeOf.object("otherRectangle", r);
		let i = t.east, o = t.west, a = r.east, s = r.west;
		i < o && a > 0 ? i += L.TWO_PI : a < s && i > 0 && (a += L.TWO_PI), i < o && s < 0 ? s += L.TWO_PI : a < s && o < 0 && (o += L.TWO_PI);
		const u = L.negativePiToPi(Math.max(o, s)), c = L.negativePiToPi(Math.min(i, a));
		if ((t.west < t.east || r.west < r.east) && c <= u) return;
		const l = Math.max(t.south, r.south), f = Math.min(t.north, r.north);
		return l >= f ? void 0 : C(n) ? (n.west = u, n.south = l, n.east = c, n.north = f, n) : new e(u, l, c, f);
	}
	static simpleIntersection(t, r, n) {
		v.typeOf.object("rectangle", t), v.typeOf.object("otherRectangle", r);
		const i = Math.max(t.west, r.west), o = Math.max(t.south, r.south), a = Math.min(t.east, r.east), s = Math.min(t.north, r.north);
		if (!(o >= s || i >= a)) return C(n) ? (n.west = i, n.south = o, n.east = a, n.north = s, n) : new e(i, o, a, s);
	}
	static union(t, r, n) {
		v.typeOf.object("rectangle", t), v.typeOf.object("otherRectangle", r), C(n) || (n = new e());
		let i = t.east, o = t.west, a = r.east, s = r.west;
		i < o && a > 0 ? i += L.TWO_PI : a < s && i > 0 && (a += L.TWO_PI), i < o && s < 0 ? s += L.TWO_PI : a < s && o < 0 && (o += L.TWO_PI);
		const u = L.negativePiToPi(Math.min(o, s)), c = L.negativePiToPi(Math.max(i, a));
		return n.west = u, n.south = Math.min(t.south, r.south), n.east = c, n.north = Math.max(t.north, r.north), n;
	}
	static expand(t, r, n) {
		return v.typeOf.object("rectangle", t), v.typeOf.object("cartographic", r), C(n) || (n = new e()), n.west = Math.min(t.west, r.longitude), n.south = Math.min(t.south, r.latitude), n.east = Math.max(t.east, r.longitude), n.north = Math.max(t.north, r.latitude), n;
	}
	static contains(e, t) {
		v.typeOf.object("rectangle", e), v.typeOf.object("cartographic", t);
		let r = t.longitude;
		const n = t.latitude, i = e.west;
		let o = e.east;
		return o < i && (o += L.TWO_PI, r < 0 && (r += L.TWO_PI)), (r > i || L.equalsEpsilon(r, i, L.EPSILON14)) && (r < o || L.equalsEpsilon(r, o, L.EPSILON14)) && n >= e.south && n <= e.north;
	}
	static subsample(t, r, n, i) {
		v.typeOf.object("rectangle", t), r = r ?? Ft.default, n = n ?? 0, C(i) || (i = []);
		let o = 0;
		const a = t.north, s = t.south, u = t.east, c = t.west, l = oo;
		l.height = n, l.longitude = c, l.latitude = a, i[o] = r.cartographicToCartesian(l, i[o]), o++, l.longitude = u, i[o] = r.cartographicToCartesian(l, i[o]), o++, l.latitude = s, i[o] = r.cartographicToCartesian(l, i[o]), o++, l.longitude = c, i[o] = r.cartographicToCartesian(l, i[o]), o++, l.latitude = a < 0 ? a : s > 0 ? s : 0;
		for (let f = 1; f < 8; ++f) l.longitude = -Math.PI + f * L.PI_OVER_TWO, e.contains(t, l) && (i[o] = r.cartographicToCartesian(l, i[o]), o++);
		return 0 === l.latitude && (l.longitude = c, i[o] = r.cartographicToCartesian(l, i[o]), o++, l.longitude = u, i[o] = r.cartographicToCartesian(l, i[o]), o++), i.length = o, i;
	}
	static subsection(t, r, n, i, o, a) {
		if (v.typeOf.object("rectangle", t), v.typeOf.number.greaterThanOrEquals("westLerp", r, 0), v.typeOf.number.lessThanOrEquals("westLerp", r, 1), v.typeOf.number.greaterThanOrEquals("southLerp", n, 0), v.typeOf.number.lessThanOrEquals("southLerp", n, 1), v.typeOf.number.greaterThanOrEquals("eastLerp", i, 0), v.typeOf.number.lessThanOrEquals("eastLerp", i, 1), v.typeOf.number.greaterThanOrEquals("northLerp", o, 0), v.typeOf.number.lessThanOrEquals("northLerp", o, 1), v.typeOf.number.lessThanOrEquals("westLerp", r, i), v.typeOf.number.lessThanOrEquals("southLerp", n, o), C(a) || (a = new e()), t.west <= t.east) {
			const e = t.east - t.west;
			a.west = t.west + r * e, a.east = t.west + i * e;
		} else {
			const e = L.TWO_PI + t.east - t.west;
			a.west = L.negativePiToPi(t.west + r * e), a.east = L.negativePiToPi(t.west + i * e);
		}
		const s = t.north - t.south;
		return a.south = t.south + n * s, a.north = t.south + o * s, 1 === r && (a.west = t.east), 1 === i && (a.east = t.east), 1 === n && (a.south = t.north), 1 === o && (a.north = t.north), a;
	}
};
Qi.packedLength = 4;
const Ji = new de(), eo = new z(), to = new z(), ro = new z(), no = new z(), io = new Array(5);
for (let Dl = 0; Dl < io.length; ++Dl) io[Dl] = new z();
const oo = new Nt();
Qi.MAX_VALUE = Object.freeze(new Qi(-Math.PI, -L.PI_OVER_TWO, Math.PI, L.PI_OVER_TWO));
const ao = {
	POINTS: Ne.POINTS,
	LINES: Ne.LINES,
	LINE_LOOP: Ne.LINE_LOOP,
	LINE_STRIP: Ne.LINE_STRIP,
	TRIANGLES: Ne.TRIANGLES,
	TRIANGLE_STRIP: Ne.TRIANGLE_STRIP,
	TRIANGLE_FAN: Ne.TRIANGLE_FAN,
	isLines: function(e) {
		return e === ao.LINES || e === ao.LINE_LOOP || e === ao.LINE_STRIP;
	},
	isTriangles: function(e) {
		return e === ao.TRIANGLES || e === ao.TRIANGLE_STRIP || e === ao.TRIANGLE_FAN;
	},
	validate: function(e) {
		return e === ao.POINTS || e === ao.LINES || e === ao.LINE_LOOP || e === ao.LINE_STRIP || e === ao.TRIANGLES || e === ao.TRIANGLE_STRIP || e === ao.TRIANGLE_FAN;
	}
};
Object.freeze(ao);
const so = {
	UNSIGNED_BYTE: Ne.UNSIGNED_BYTE,
	UNSIGNED_SHORT: Ne.UNSIGNED_SHORT,
	UNSIGNED_INT: Ne.UNSIGNED_INT,
	FLOAT: Ne.FLOAT,
	HALF_FLOAT: Ne.HALF_FLOAT_OES,
	UNSIGNED_INT_24_8: Ne.UNSIGNED_INT_24_8,
	UNSIGNED_SHORT_4_4_4_4: Ne.UNSIGNED_SHORT_4_4_4_4,
	UNSIGNED_SHORT_5_5_5_1: Ne.UNSIGNED_SHORT_5_5_5_1,
	UNSIGNED_SHORT_5_6_5: Ne.UNSIGNED_SHORT_5_6_5,
	toWebGLConstant: function(e, t) {
		switch (e) {
			case so.UNSIGNED_BYTE: return Ne.UNSIGNED_BYTE;
			case so.UNSIGNED_SHORT: return Ne.UNSIGNED_SHORT;
			case so.UNSIGNED_INT: return Ne.UNSIGNED_INT;
			case so.FLOAT: return Ne.FLOAT;
			case so.HALF_FLOAT: return t.webgl2 ? Ne.HALF_FLOAT : Ne.HALF_FLOAT_OES;
			case so.UNSIGNED_INT_24_8: return Ne.UNSIGNED_INT_24_8;
			case so.UNSIGNED_SHORT_4_4_4_4: return Ne.UNSIGNED_SHORT_4_4_4_4;
			case so.UNSIGNED_SHORT_5_5_5_1: return Ne.UNSIGNED_SHORT_5_5_5_1;
			case so.UNSIGNED_SHORT_5_6_5: return so.UNSIGNED_SHORT_5_6_5;
		}
	},
	isPacked: function(e) {
		return e === so.UNSIGNED_INT_24_8 || e === so.UNSIGNED_SHORT_4_4_4_4 || e === so.UNSIGNED_SHORT_5_5_5_1 || e === so.UNSIGNED_SHORT_5_6_5;
	},
	sizeInBytes: function(e) {
		switch (e) {
			case so.UNSIGNED_BYTE: return 1;
			case so.UNSIGNED_SHORT:
			case so.UNSIGNED_SHORT_4_4_4_4:
			case so.UNSIGNED_SHORT_5_5_5_1:
			case so.UNSIGNED_SHORT_5_6_5:
			case so.HALF_FLOAT: return 2;
			case so.UNSIGNED_INT:
			case so.FLOAT:
			case so.UNSIGNED_INT_24_8: return 4;
		}
	},
	validate: function(e) {
		return e === so.UNSIGNED_BYTE || e === so.UNSIGNED_SHORT || e === so.UNSIGNED_INT || e === so.FLOAT || e === so.HALF_FLOAT || e === so.UNSIGNED_INT_24_8 || e === so.UNSIGNED_SHORT_4_4_4_4 || e === so.UNSIGNED_SHORT_5_5_5_1 || e === so.UNSIGNED_SHORT_5_6_5;
	},
	getTypedArrayConstructor: function(e) {
		const t = so.sizeInBytes(e);
		return t === Uint8Array.BYTES_PER_ELEMENT ? Uint8Array : t === Uint16Array.BYTES_PER_ELEMENT ? Uint16Array : t === Float32Array.BYTES_PER_ELEMENT && e === so.FLOAT ? Float32Array : Uint32Array;
	}
};
Object.freeze(so);
const uo = {
	DEPTH_COMPONENT: Ne.DEPTH_COMPONENT,
	DEPTH_STENCIL: Ne.DEPTH_STENCIL,
	ALPHA: Ne.ALPHA,
	RED: Ne.RED,
	RG: Ne.RG,
	RGB: Ne.RGB,
	RGBA: Ne.RGBA,
	RED_INTEGER: Ne.RED_INTEGER,
	RG_INTEGER: Ne.RG_INTEGER,
	RGB_INTEGER: Ne.RGB_INTEGER,
	RGBA_INTEGER: Ne.RGBA_INTEGER,
	LUMINANCE: Ne.LUMINANCE,
	LUMINANCE_ALPHA: Ne.LUMINANCE_ALPHA,
	RGB_DXT1: Ne.COMPRESSED_RGB_S3TC_DXT1_EXT,
	RGBA_DXT1: Ne.COMPRESSED_RGBA_S3TC_DXT1_EXT,
	RGBA_DXT3: Ne.COMPRESSED_RGBA_S3TC_DXT3_EXT,
	RGBA_DXT5: Ne.COMPRESSED_RGBA_S3TC_DXT5_EXT,
	RGB_PVRTC_4BPPV1: Ne.COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
	RGB_PVRTC_2BPPV1: Ne.COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
	RGBA_PVRTC_4BPPV1: Ne.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
	RGBA_PVRTC_2BPPV1: Ne.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG,
	RGBA_ASTC: Ne.COMPRESSED_RGBA_ASTC_4x4_WEBGL,
	RGB_ETC1: Ne.COMPRESSED_RGB_ETC1_WEBGL,
	RGB8_ETC2: Ne.COMPRESSED_RGB8_ETC2,
	RGBA8_ETC2_EAC: Ne.COMPRESSED_RGBA8_ETC2_EAC,
	RGBA_BC7: Ne.COMPRESSED_RGBA_BPTC_UNORM,
	componentsLength: function(e) {
		switch (e) {
			case uo.RGB:
			case uo.RGB_INTEGER: return 3;
			case uo.RGBA:
			case uo.RGBA_INTEGER: return 4;
			case uo.LUMINANCE_ALPHA:
			case uo.RG:
			case uo.RG_INTEGER: return 2;
			case uo.ALPHA:
			case uo.RED:
			case uo.RED_INTEGER:
			case uo.LUMINANCE:
			default: return 1;
		}
	},
	validate: function(e) {
		return e === uo.DEPTH_COMPONENT || e === uo.DEPTH_STENCIL || e === uo.ALPHA || e === uo.RED || e === uo.RG || e === uo.RGB || e === uo.RGBA || e === uo.RED_INTEGER || e === uo.RG_INTEGER || e === uo.RGB_INTEGER || e === uo.RGBA_INTEGER || e === uo.LUMINANCE || e === uo.LUMINANCE_ALPHA || e === uo.RGB_DXT1 || e === uo.RGBA_DXT1 || e === uo.RGBA_DXT3 || e === uo.RGBA_DXT5 || e === uo.RGB_PVRTC_4BPPV1 || e === uo.RGB_PVRTC_2BPPV1 || e === uo.RGBA_PVRTC_4BPPV1 || e === uo.RGBA_PVRTC_2BPPV1 || e === uo.RGBA_ASTC || e === uo.RGB_ETC1 || e === uo.RGB8_ETC2 || e === uo.RGBA8_ETC2_EAC || e === uo.RGBA_BC7;
	},
	isColorFormat: function(e) {
		return e === uo.RED || e === uo.ALPHA || e === uo.RGB || e === uo.RGBA || e === uo.LUMINANCE || e === uo.LUMINANCE_ALPHA;
	},
	isDepthFormat: function(e) {
		return e === uo.DEPTH_COMPONENT || e === uo.DEPTH_STENCIL;
	},
	isCompressedFormat: function(e) {
		return e === uo.RGB_DXT1 || e === uo.RGBA_DXT1 || e === uo.RGBA_DXT3 || e === uo.RGBA_DXT5 || e === uo.RGB_PVRTC_4BPPV1 || e === uo.RGB_PVRTC_2BPPV1 || e === uo.RGBA_PVRTC_4BPPV1 || e === uo.RGBA_PVRTC_2BPPV1 || e === uo.RGBA_ASTC || e === uo.RGB_ETC1 || e === uo.RGB8_ETC2 || e === uo.RGBA8_ETC2_EAC || e === uo.RGBA_BC7;
	},
	isDXTFormat: function(e) {
		return e === uo.RGB_DXT1 || e === uo.RGBA_DXT1 || e === uo.RGBA_DXT3 || e === uo.RGBA_DXT5;
	},
	isPVRTCFormat: function(e) {
		return e === uo.RGB_PVRTC_4BPPV1 || e === uo.RGB_PVRTC_2BPPV1 || e === uo.RGBA_PVRTC_4BPPV1 || e === uo.RGBA_PVRTC_2BPPV1;
	},
	isASTCFormat: function(e) {
		return e === uo.RGBA_ASTC;
	},
	isETC1Format: function(e) {
		return e === uo.RGB_ETC1;
	},
	isETC2Format: function(e) {
		return e === uo.RGB8_ETC2 || e === uo.RGBA8_ETC2_EAC;
	},
	isBC7Format: function(e) {
		return e === uo.RGBA_BC7;
	},
	compressedTextureSizeInBytes: function(e, t, r) {
		switch (e) {
			case uo.RGB_DXT1:
			case uo.RGBA_DXT1:
			case uo.RGB_ETC1:
			case uo.RGB8_ETC2: return Math.floor((t + 3) / 4) * Math.floor((r + 3) / 4) * 8;
			case uo.RGBA_DXT3:
			case uo.RGBA_DXT5:
			case uo.RGBA_ASTC:
			case uo.RGBA8_ETC2_EAC: return Math.floor((t + 3) / 4) * Math.floor((r + 3) / 4) * 16;
			case uo.RGB_PVRTC_4BPPV1:
			case uo.RGBA_PVRTC_4BPPV1: return Math.floor((Math.max(t, 8) * Math.max(r, 8) * 4 + 7) / 8);
			case uo.RGB_PVRTC_2BPPV1:
			case uo.RGBA_PVRTC_2BPPV1: return Math.floor((Math.max(t, 16) * Math.max(r, 8) * 2 + 7) / 8);
			case uo.RGBA_BC7: return Math.ceil(t / 4) * Math.ceil(r / 4) * 16;
			default: return 0;
		}
	},
	textureSizeInBytes: function(e, t, r, n) {
		let i = uo.componentsLength(e);
		return so.isPacked(t) && (i = 1), i * so.sizeInBytes(t) * r * n;
	},
	texture3DSizeInBytes: function(e, t, r, n, i) {
		let o = uo.componentsLength(e);
		return so.isPacked(t) && (o = 1), o * so.sizeInBytes(t) * r * n * i;
	},
	alignmentInBytes: function(e, t, r) {
		const n = uo.textureSizeInBytes(e, t, r, 1) % 4;
		return 0 === n ? 4 : 2 === n ? 2 : 1;
	},
	createTypedArray: function(e, t, r, n) {
		return new (so.getTypedArrayConstructor(t))(uo.componentsLength(e) * r * n);
	},
	flipY: function(e, t, r, n, i) {
		if (1 === i) return e;
		const o = uo.createTypedArray(t, r, n, i), a = uo.componentsLength(t), s = n * a;
		for (let u = 0; u < i; ++u) {
			const t = u * n * a, r = (i - u - 1) * n * a;
			for (let n = 0; n < s; ++n) o[r + n] = e[t + n];
		}
		return o;
	},
	toInternalFormat: function(e, t, r) {
		if (!r.webgl2) return e;
		if (e === uo.DEPTH_STENCIL) return Ne.DEPTH24_STENCIL8;
		if (e === uo.DEPTH_COMPONENT) {
			if (t === so.UNSIGNED_SHORT) return Ne.DEPTH_COMPONENT16;
			if (t === so.UNSIGNED_INT) return Ne.DEPTH_COMPONENT24;
		}
		if (t === so.FLOAT) switch (e) {
			case uo.RGBA: return Ne.RGBA32F;
			case uo.RGB: return Ne.RGB32F;
			case uo.RG: return Ne.RG32F;
			case uo.RED: return Ne.R32F;
		}
		if (t === so.HALF_FLOAT) switch (e) {
			case uo.RGBA: return Ne.RGBA16F;
			case uo.RGB: return Ne.RGB16F;
			case uo.RG: return Ne.RG16F;
			case uo.RED: return Ne.R16F;
		}
		if (t === so.UNSIGNED_BYTE) switch (e) {
			case uo.RGBA: return Ne.RGBA8;
			case uo.RGB: return Ne.RGB8;
			case uo.RG: return Ne.RG8;
			case uo.RED: return Ne.R8;
		}
		if (t === so.INT) switch (e) {
			case uo.RGBA_INTEGER: return Ne.RGBA32I;
			case uo.RGB_INTEGER: return Ne.RGB32I;
			case uo.RG_INTEGER: return Ne.RG32I;
			case uo.RED_INTEGER: return Ne.R32I;
		}
		if (t === so.UNSIGNED_INT) switch (e) {
			case uo.RGBA_INTEGER: return Ne.RGBA32UI;
			case uo.RGB_INTEGER: return Ne.RGB32UI;
			case uo.RG_INTEGER: return Ne.RG32UI;
			case uo.RED_INTEGER: return Ne.R32UI;
		}
		return e;
	}
};
Object.freeze(uo);
const co = {
	_maximumCombinedTextureImageUnits: 0,
	_maximumCubeMapSize: 0,
	_maximumFragmentUniformVectors: 0,
	_maximumTextureImageUnits: 0,
	_maximumRenderbufferSize: 0,
	_maximumTextureSize: 0,
	_maximum3DTextureSize: 0,
	_maximumVaryingVectors: 0,
	_maximumVertexAttributes: 0,
	_maximumVertexTextureImageUnits: 0,
	_maximumVertexUniformVectors: 0,
	_minimumAliasedLineWidth: 0,
	_maximumAliasedLineWidth: 0,
	_minimumAliasedPointSize: 0,
	_maximumAliasedPointSize: 0,
	_maximumViewportWidth: 0,
	_maximumViewportHeight: 0,
	_maximumTextureFilterAnisotropy: 0,
	_maximumDrawBuffers: 0,
	_maximumColorAttachments: 0,
	_maximumSamples: 0,
	_highpFloatSupported: !1,
	_highpIntSupported: !1
};
function lo(e, t, r) {
	const n = e._gl;
	n.framebufferTexture2D(n.FRAMEBUFFER, t, r._target, r._texture, 0);
}
function fo(e, t, r) {
	const n = e._gl;
	n.framebufferRenderbuffer(n.FRAMEBUFFER, t, n.RENDERBUFFER, r._getRenderbuffer());
}
function ho(e) {
	const t = (e = e ?? J.EMPTY_OBJECT).context;
	v.defined("options.context", t);
	const r = t._gl, n = co.maximumColorAttachments;
	if (this._gl = r, this._framebuffer = r.createFramebuffer(), this._colorTextures = [], this._colorRenderbuffers = [], this._activeColorAttachments = [], this._depthTexture = void 0, this._depthRenderbuffer = void 0, this._stencilRenderbuffer = void 0, this._depthStencilTexture = void 0, this._depthStencilRenderbuffer = void 0, this.destroyAttachments = e.destroyAttachments ?? !0, C(e.colorTextures) && C(e.colorRenderbuffers)) throw new N("Cannot have both color texture and color renderbuffer attachments.");
	if (C(e.depthTexture) && C(e.depthRenderbuffer)) throw new N("Cannot have both a depth texture and depth renderbuffer attachment.");
	if (C(e.depthStencilTexture) && C(e.depthStencilRenderbuffer)) throw new N("Cannot have both a depth-stencil texture and depth-stencil renderbuffer attachment.");
	const i = C(e.depthTexture) || C(e.depthRenderbuffer), o = C(e.depthStencilTexture) || C(e.depthStencilRenderbuffer);
	if (i && o) throw new N("Cannot have both a depth and depth-stencil attachment.");
	if (C(e.stencilRenderbuffer) && o) throw new N("Cannot have both a stencil and depth-stencil attachment.");
	if (i && C(e.stencilRenderbuffer)) throw new N("Cannot have both a depth and stencil attachment.");
	if (this._bind(), C(e.colorTextures)) {
		const r = e.colorTextures, i = this._colorTextures.length = this._activeColorAttachments.length = r.length;
		if (i > n) throw new N("The number of color attachments exceeds the number supported.");
		for (let e = 0; e < i; ++e) {
			const n = r[e];
			if (!uo.isColorFormat(n.pixelFormat)) throw new N("The color-texture pixel-format must be a color format.");
			if (n.pixelDatatype === so.FLOAT && !t.colorBufferFloat) throw new N("The color texture pixel datatype is FLOAT and the WebGL implementation does not support the EXT_color_buffer_float or WEBGL_color_buffer_float extensions. See Context.colorBufferFloat.");
			if (n.pixelDatatype === so.HALF_FLOAT && !t.colorBufferHalfFloat) throw new N("The color texture pixel datatype is HALF_FLOAT and the WebGL implementation does not support the EXT_color_buffer_half_float extension. See Context.colorBufferHalfFloat.");
			const i = this._gl.COLOR_ATTACHMENT0 + e;
			lo(this, i, n), this._activeColorAttachments[e] = i, this._colorTextures[e] = n;
		}
	}
	if (C(e.colorRenderbuffers)) {
		const t = e.colorRenderbuffers, r = this._colorRenderbuffers.length = this._activeColorAttachments.length = t.length;
		if (r > n) throw new N("The number of color attachments exceeds the number supported.");
		for (let e = 0; e < r; ++e) {
			const r = t[e], n = this._gl.COLOR_ATTACHMENT0 + e;
			fo(this, n, r), this._activeColorAttachments[e] = n, this._colorRenderbuffers[e] = r;
		}
	}
	if (C(e.depthTexture)) {
		const t = e.depthTexture;
		if (t.pixelFormat !== uo.DEPTH_COMPONENT) throw new N("The depth-texture pixel-format must be DEPTH_COMPONENT.");
		lo(this, this._gl.DEPTH_ATTACHMENT, t), this._depthTexture = t;
	}
	if (C(e.depthRenderbuffer)) {
		const t = e.depthRenderbuffer;
		fo(this, this._gl.DEPTH_ATTACHMENT, t), this._depthRenderbuffer = t;
	}
	if (C(e.stencilRenderbuffer)) {
		const t = e.stencilRenderbuffer;
		fo(this, this._gl.STENCIL_ATTACHMENT, t), this._stencilRenderbuffer = t;
	}
	if (C(e.depthStencilTexture)) {
		const t = e.depthStencilTexture;
		if (t.pixelFormat !== uo.DEPTH_STENCIL) throw new N("The depth-stencil pixel-format must be DEPTH_STENCIL.");
		lo(this, this._gl.DEPTH_STENCIL_ATTACHMENT, t), this._depthStencilTexture = t;
	}
	if (C(e.depthStencilRenderbuffer)) {
		const t = e.depthStencilRenderbuffer;
		fo(this, this._gl.DEPTH_STENCIL_ATTACHMENT, t), this._depthStencilRenderbuffer = t;
	}
	this._unBind();
}
Object.defineProperties(co, {
	maximumCombinedTextureImageUnits: { get: function() {
		return co._maximumCombinedTextureImageUnits;
	} },
	maximumCubeMapSize: { get: function() {
		return co._maximumCubeMapSize;
	} },
	maximumFragmentUniformVectors: { get: function() {
		return co._maximumFragmentUniformVectors;
	} },
	maximumTextureImageUnits: { get: function() {
		return co._maximumTextureImageUnits;
	} },
	maximumRenderbufferSize: { get: function() {
		return co._maximumRenderbufferSize;
	} },
	maximumTextureSize: { get: function() {
		return co._maximumTextureSize;
	} },
	maximum3DTextureSize: { get: function() {
		return co._maximum3DTextureSize;
	} },
	maximumVaryingVectors: { get: function() {
		return co._maximumVaryingVectors;
	} },
	maximumVertexAttributes: { get: function() {
		return co._maximumVertexAttributes;
	} },
	maximumVertexTextureImageUnits: { get: function() {
		return co._maximumVertexTextureImageUnits;
	} },
	maximumVertexUniformVectors: { get: function() {
		return co._maximumVertexUniformVectors;
	} },
	minimumAliasedLineWidth: { get: function() {
		return co._minimumAliasedLineWidth;
	} },
	maximumAliasedLineWidth: { get: function() {
		return co._maximumAliasedLineWidth;
	} },
	minimumAliasedPointSize: { get: function() {
		return co._minimumAliasedPointSize;
	} },
	maximumAliasedPointSize: { get: function() {
		return co._maximumAliasedPointSize;
	} },
	maximumViewportWidth: { get: function() {
		return co._maximumViewportWidth;
	} },
	maximumViewportHeight: { get: function() {
		return co._maximumViewportHeight;
	} },
	maximumTextureFilterAnisotropy: { get: function() {
		return co._maximumTextureFilterAnisotropy;
	} },
	maximumDrawBuffers: { get: function() {
		return co._maximumDrawBuffers;
	} },
	maximumColorAttachments: { get: function() {
		return co._maximumColorAttachments;
	} },
	maximumSamples: { get: function() {
		return co._maximumSamples;
	} },
	highpFloatSupported: { get: function() {
		return co._highpFloatSupported;
	} },
	highpIntSupported: { get: function() {
		return co._highpIntSupported;
	} }
}), Object.defineProperties(ho.prototype, {
	status: { get: function() {
		this._bind();
		const e = this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER);
		return this._unBind(), e;
	} },
	numberOfColorAttachments: { get: function() {
		return this._activeColorAttachments.length;
	} },
	depthTexture: { get: function() {
		return this._depthTexture;
	} },
	depthRenderbuffer: { get: function() {
		return this._depthRenderbuffer;
	} },
	stencilRenderbuffer: { get: function() {
		return this._stencilRenderbuffer;
	} },
	depthStencilTexture: { get: function() {
		return this._depthStencilTexture;
	} },
	depthStencilRenderbuffer: { get: function() {
		return this._depthStencilRenderbuffer;
	} },
	hasDepthAttachment: { get: function() {
		return !!(this.depthTexture || this.depthRenderbuffer || this.depthStencilTexture || this.depthStencilRenderbuffer);
	} }
}), ho.prototype._bind = function() {
	const e = this._gl;
	e.bindFramebuffer(e.FRAMEBUFFER, this._framebuffer);
}, ho.prototype._unBind = function() {
	const e = this._gl;
	e.bindFramebuffer(e.FRAMEBUFFER, null);
}, ho.prototype.bindDraw = function() {
	const e = this._gl;
	e.bindFramebuffer(e.DRAW_FRAMEBUFFER, this._framebuffer);
}, ho.prototype.bindRead = function() {
	const e = this._gl;
	e.bindFramebuffer(e.READ_FRAMEBUFFER, this._framebuffer);
}, ho.prototype._getActiveColorAttachments = function() {
	return this._activeColorAttachments;
}, ho.prototype.getColorTexture = function(e) {
	if (!C(e) || e < 0 || e >= this._colorTextures.length) throw new N("index is required, must be greater than or equal to zero and must be less than the number of color attachments.");
	return this._colorTextures[e];
}, ho.prototype.getColorRenderbuffer = function(e) {
	if (!C(e) || e < 0 || e >= this._colorRenderbuffers.length) throw new N("index is required, must be greater than or equal to zero and must be less than the number of color attachments.");
	return this._colorRenderbuffers[e];
}, ho.prototype.isDestroyed = function() {
	return !1;
}, ho.prototype.destroy = function() {
	if (this.destroyAttachments) {
		const e = this._colorTextures;
		for (let r = 0; r < e.length; ++r) {
			const t = e[r];
			C(t) && t.destroy();
		}
		const t = this._colorRenderbuffers;
		for (let r = 0; r < t.length; ++r) {
			const e = t[r];
			C(e) && e.destroy();
		}
		this._depthTexture = this._depthTexture && this._depthTexture.destroy(), this._depthRenderbuffer = this._depthRenderbuffer && this._depthRenderbuffer.destroy(), this._stencilRenderbuffer = this._stencilRenderbuffer && this._stencilRenderbuffer.destroy(), this._depthStencilTexture = this._depthStencilTexture && this._depthStencilTexture.destroy(), this._depthStencilRenderbuffer = this._depthStencilRenderbuffer && this._depthStencilRenderbuffer.destroy();
	}
	return this._gl.deleteFramebuffer(this._framebuffer), Me(this);
};
var po = class e {
	constructor(e, t, r, n) {
		this[0] = e ?? 0, this[1] = r ?? 0, this[2] = t ?? 0, this[3] = n ?? 0;
	}
	static pack(e, t, r) {
		return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t;
	}
	static unpack(t, r, n) {
		return v.defined("array", t), r = r ?? 0, C(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n;
	}
	static packArray(t, r) {
		v.defined("array", t);
		const n = t.length, i = 4 * n;
		if (C(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new N("If result is a typed array, it must have exactly array.length * 4 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 4 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (v.defined("array", t), v.typeOf.number.greaterThanOrEquals("array.length", t.length, 4), t.length % 4 != 0) throw new N("array length must be a multiple of 4.");
		const n = t.length;
		C(r) ? r.length = n / 4 : r = new Array(n / 4);
		for (let i = 0; i < n; i += 4) {
			const n = i / 4;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r) : new e(t[0], t[2], t[1], t[3]);
	}
	static fromColumnMajorArray(t, r) {
		return v.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return v.defined("values", t), C(r) ? (r[0] = t[0], r[1] = t[2], r[2] = t[1], r[3] = t[3], r) : new e(t[0], t[1], t[2], t[3]);
	}
	static fromScale(t, r) {
		return v.typeOf.object("scale", t), C(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = t.y, r) : new e(t.x, 0, 0, t.y);
	}
	static fromUniformScale(t, r) {
		return v.typeOf.number("scale", t), C(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = t, r) : new e(t, 0, 0, t);
	}
	static fromRotation(t, r) {
		v.typeOf.number("angle", t);
		const n = Math.cos(t), i = Math.sin(t);
		return C(r) ? (r[0] = n, r[1] = i, r[2] = -i, r[3] = n, r) : new e(n, -i, i, n);
	}
	static toArray(e, t) {
		return v.typeOf.object("matrix", e), C(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t) : [
			e[0],
			e[1],
			e[2],
			e[3]
		];
	}
	static getElementIndex(e, t) {
		return v.typeOf.number.greaterThanOrEquals("row", t, 0), v.typeOf.number.lessThanOrEquals("row", t, 1), v.typeOf.number.greaterThanOrEquals("column", e, 0), v.typeOf.number.lessThanOrEquals("column", e, 1), 2 * e + t;
	}
	static getColumn(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.number.greaterThanOrEquals("index", t, 0), v.typeOf.number.lessThanOrEquals("index", t, 1), v.typeOf.object("result", r);
		const n = 2 * t, i = e[n], o = e[n + 1];
		return r.x = i, r.y = o, r;
	}
	static setColumn(t, r, n, i) {
		v.typeOf.object("matrix", t), v.typeOf.number.greaterThanOrEquals("index", r, 0), v.typeOf.number.lessThanOrEquals("index", r, 1), v.typeOf.object("cartesian", n), v.typeOf.object("result", i);
		const o = 2 * r;
		return (i = e.clone(t, i))[o] = n.x, i[o + 1] = n.y, i;
	}
	static getRow(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.number.greaterThanOrEquals("index", t, 0), v.typeOf.number.lessThanOrEquals("index", t, 1), v.typeOf.object("result", r);
		const n = e[t], i = e[t + 2];
		return r.x = n, r.y = i, r;
	}
	static setRow(t, r, n, i) {
		return v.typeOf.object("matrix", t), v.typeOf.number.greaterThanOrEquals("index", r, 0), v.typeOf.number.lessThanOrEquals("index", r, 1), v.typeOf.object("cartesian", n), v.typeOf.object("result", i), (i = e.clone(t, i))[r] = n.x, i[r + 2] = n.y, i;
	}
	static setScale(t, r, n) {
		v.typeOf.object("matrix", t), v.typeOf.object("scale", r), v.typeOf.object("result", n);
		const i = e.getScale(t, mo), o = r.x / i.x, a = r.y / i.y;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * a, n[3] = t[3] * a, n;
	}
	static setUniformScale(t, r, n) {
		v.typeOf.object("matrix", t), v.typeOf.number("scale", r), v.typeOf.object("result", n);
		const i = e.getScale(t, yo), o = r / i.x, a = r / i.y;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * a, n[3] = t[3] * a, n;
	}
	static getScale(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t.x = wt.magnitude(wt.fromElements(e[0], e[1], _o)), t.y = wt.magnitude(wt.fromElements(e[2], e[3], _o)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, go), wt.maximumComponent(go);
	}
	static setRotation(t, r, n) {
		v.typeOf.object("matrix", t), v.typeOf.object("result", n);
		const i = e.getScale(t, Eo);
		return n[0] = r[0] * i.x, n[1] = r[1] * i.x, n[2] = r[2] * i.y, n[3] = r[3] * i.y, n;
	}
	static getRotation(t, r) {
		v.typeOf.object("matrix", t), v.typeOf.object("result", r);
		const n = e.getScale(t, bo);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.y, r[3] = t[3] / n.y, r;
	}
	static multiply(e, t, r) {
		v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r);
		const n = e[0] * t[0] + e[2] * t[1], i = e[0] * t[2] + e[2] * t[3], o = e[1] * t[0] + e[3] * t[1], a = e[1] * t[2] + e[3] * t[3];
		return r[0] = n, r[1] = o, r[2] = i, r[3] = a, r;
	}
	static add(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r;
	}
	static subtract(e, t, r) {
		return v.typeOf.object("left", e), v.typeOf.object("right", t), v.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r;
	}
	static multiplyByVector(e, t, r) {
		v.typeOf.object("matrix", e), v.typeOf.object("cartesian", t), v.typeOf.object("result", r);
		const n = e[0] * t.x + e[2] * t.y, i = e[1] * t.x + e[3] * t.y;
		return r.x = n, r.y = i, r;
	}
	static multiplyByScalar(e, t, r) {
		return v.typeOf.object("matrix", e), v.typeOf.number("scalar", t), v.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r;
	}
	static multiplyByScale(e, t, r) {
		return v.typeOf.object("matrix", e), v.typeOf.object("scale", t), v.typeOf.object("result", r), r[0] = e[0] * t.x, r[1] = e[1] * t.x, r[2] = e[2] * t.y, r[3] = e[3] * t.y, r;
	}
	static multiplyByUniformScale(e, t, r) {
		return v.typeOf.object("matrix", e), v.typeOf.number("scale", t), v.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r;
	}
	static negate(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t;
	}
	static transpose(e, t) {
		v.typeOf.object("matrix", e), v.typeOf.object("result", t);
		const r = e[0], n = e[2], i = e[1], o = e[3];
		return t[0] = r, t[1] = n, t[2] = i, t[3] = o, t;
	}
	static abs(e, t) {
		return v.typeOf.object("matrix", e), v.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t;
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3];
	}
	static equalsArray(e, t, r) {
		return e[0] === t[r] && e[1] === t[r + 1] && e[2] === t[r + 2] && e[3] === t[r + 3];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || C(e) && C(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r;
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
	equalsEpsilon(t, r) {
		return e.equalsEpsilon(this, t, r);
	}
	toString() {
		return `(${this[0]}, ${this[2]})\n(${this[1]}, ${this[3]})`;
	}
};
po.packedLength = 4, po.fromArray = po.unpack, po.IDENTITY = Object.freeze(new po(1, 0, 0, 1)), po.ZERO = Object.freeze(new po(0, 0, 0, 0)), po.COLUMN0ROW0 = 0, po.COLUMN0ROW1 = 1, po.COLUMN1ROW0 = 2, po.COLUMN1ROW1 = 3;
const mo = new wt(), yo = new wt(), _o = new wt(), go = new wt(), Eo = new wt(), bo = new wt(), wo = {
	BYTE: Ne.BYTE,
	UNSIGNED_BYTE: Ne.UNSIGNED_BYTE,
	SHORT: Ne.SHORT,
	UNSIGNED_SHORT: Ne.UNSIGNED_SHORT,
	INT: Ne.INT,
	UNSIGNED_INT: Ne.UNSIGNED_INT,
	FLOAT: Ne.FLOAT,
	DOUBLE: Ne.DOUBLE,
	getSizeInBytes: function(e) {
		if (!C(e)) throw new N("value is required.");
		switch (e) {
			case wo.BYTE: return Int8Array.BYTES_PER_ELEMENT;
			case wo.UNSIGNED_BYTE: return Uint8Array.BYTES_PER_ELEMENT;
			case wo.SHORT: return Int16Array.BYTES_PER_ELEMENT;
			case wo.UNSIGNED_SHORT: return Uint16Array.BYTES_PER_ELEMENT;
			case wo.INT: return Int32Array.BYTES_PER_ELEMENT;
			case wo.UNSIGNED_INT: return Uint32Array.BYTES_PER_ELEMENT;
			case wo.FLOAT: return Float32Array.BYTES_PER_ELEMENT;
			case wo.DOUBLE: return Float64Array.BYTES_PER_ELEMENT;
			default: throw new N("componentDatatype is not a valid value.");
		}
	},
	fromTypedArray: function(e) {
		if (e instanceof Int8Array) return wo.BYTE;
		if (e instanceof Uint8Array) return wo.UNSIGNED_BYTE;
		if (e instanceof Int16Array) return wo.SHORT;
		if (e instanceof Uint16Array) return wo.UNSIGNED_SHORT;
		if (e instanceof Int32Array) return wo.INT;
		if (e instanceof Uint32Array) return wo.UNSIGNED_INT;
		if (e instanceof Float32Array) return wo.FLOAT;
		if (e instanceof Float64Array) return wo.DOUBLE;
		throw new N("array must be an Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, or Float64Array.");
	},
	validate: function(e) {
		return C(e) && (e === wo.BYTE || e === wo.UNSIGNED_BYTE || e === wo.SHORT || e === wo.UNSIGNED_SHORT || e === wo.INT || e === wo.UNSIGNED_INT || e === wo.FLOAT || e === wo.DOUBLE);
	},
	createTypedArray: function(e, t) {
		if (!C(e)) throw new N("componentDatatype is required.");
		if (!C(t)) throw new N("valuesOrLength is required.");
		switch (e) {
			case wo.BYTE: return new Int8Array(t);
			case wo.UNSIGNED_BYTE: return new Uint8Array(t);
			case wo.SHORT: return new Int16Array(t);
			case wo.UNSIGNED_SHORT: return new Uint16Array(t);
			case wo.INT: return new Int32Array(t);
			case wo.UNSIGNED_INT: return new Uint32Array(t);
			case wo.FLOAT: return new Float32Array(t);
			case wo.DOUBLE: return new Float64Array(t);
			default: throw new N("componentDatatype is not a valid value.");
		}
	},
	createArrayBufferView: function(e, t, r, n) {
		if (!C(e)) throw new N("componentDatatype is required.");
		if (!C(t)) throw new N("buffer is required.");
		switch (r = r ?? 0, n = n ?? (t.byteLength - r) / wo.getSizeInBytes(e), e) {
			case wo.BYTE: return new Int8Array(t, r, n);
			case wo.UNSIGNED_BYTE: return new Uint8Array(t, r, n);
			case wo.SHORT: return new Int16Array(t, r, n);
			case wo.UNSIGNED_SHORT: return new Uint16Array(t, r, n);
			case wo.INT: return new Int32Array(t, r, n);
			case wo.UNSIGNED_INT: return new Uint32Array(t, r, n);
			case wo.FLOAT: return new Float32Array(t, r, n);
			case wo.DOUBLE: return new Float64Array(t, r, n);
			default: throw new N("componentDatatype is not a valid value.");
		}
	},
	fromName: function(e) {
		switch (e) {
			case "BYTE": return wo.BYTE;
			case "UNSIGNED_BYTE": return wo.UNSIGNED_BYTE;
			case "SHORT": return wo.SHORT;
			case "UNSIGNED_SHORT": return wo.UNSIGNED_SHORT;
			case "INT": return wo.INT;
			case "UNSIGNED_INT": return wo.UNSIGNED_INT;
			case "FLOAT": return wo.FLOAT;
			case "DOUBLE": return wo.DOUBLE;
			default: throw new N("name is not a valid value.");
		}
	}
};
Object.freeze(wo);
const To = {
	NONE: 0,
	TRIANGLES: 1,
	LINES: 2,
	POLYLINES: 3
};
function Oo(e) {
	e = e ?? J.EMPTY_OBJECT, v.typeOf.object("options.attributes", e.attributes), this.attributes = e.attributes, this.indices = e.indices, this.primitiveType = e.primitiveType ?? ao.TRIANGLES, this.boundingSphere = e.boundingSphere, this.geometryType = e.geometryType ?? To.NONE, this.boundingSphereCV = e.boundingSphereCV, this.offsetAttribute = e.offsetAttribute;
}
Object.freeze(To), Oo.computeNumberOfVertices = function(e) {
	v.typeOf.object("geometry", e);
	let t = -1;
	for (const r in e.attributes) if (e.attributes.hasOwnProperty(r) && C(e.attributes[r]) && C(e.attributes[r].values)) {
		const n = e.attributes[r], i = n.values.length / n.componentsPerAttribute;
		if (t !== i && -1 !== t) throw new N("All attribute lists must have the same number of attributes.");
		t = i;
	}
	return t;
};
const Ao = new Nt(), xo = new z(), Ro = new de(), So = [
	new Nt(),
	new Nt(),
	new Nt()
], Io = [
	new wt(),
	new wt(),
	new wt()
], Co = [
	new wt(),
	new wt(),
	new wt()
], No = new z(), vo = new jn(), Po = new de(), Mo = new po();
function Lo(e) {
	if (!C((e = e ?? J.EMPTY_OBJECT).componentDatatype)) throw new N("options.componentDatatype is required.");
	if (!C(e.componentsPerAttribute)) throw new N("options.componentsPerAttribute is required.");
	if (e.componentsPerAttribute < 1 || e.componentsPerAttribute > 4) throw new N("options.componentsPerAttribute must be between 1 and 4.");
	if (!C(e.values)) throw new N("options.values is required.");
	this.componentDatatype = e.componentDatatype, this.componentsPerAttribute = e.componentsPerAttribute, this.normalize = e.normalize ?? !1, this.values = e.values;
}
function Fo(e, t, r, n, i) {
	this._format = e, this._datatype = t, this._width = r, this._height = n, this._buffer = i;
}
function Do() {
	if (!C(jo._canTransferArrayBuffer)) {
		const t = Uo("transferTypedArrayTest");
		t.postMessage = t.webkitPostMessage ?? t.postMessage;
		const r = 99, n = new Int8Array([r]);
		try {
			t.postMessage({ array: n }, [n.buffer]);
		} catch (e) {
			return jo._canTransferArrayBuffer = !1, jo._canTransferArrayBuffer;
		}
		jo._canTransferArrayBuffer = new Promise((e) => {
			t.onmessage = function(n) {
				const i = n.data.array, o = C(i) && i[0] === r;
				e(o), t.terminate(), jo._canTransferArrayBuffer = o;
			};
		});
	}
	return jo._canTransferArrayBuffer;
}
Oo._textureCoordinateRotationPoints = function(e, t, r, n) {
	let i;
	const o = Qi.center(n, Ao), a = Nt.toCartesian(o, r, xo), s = pi.eastNorthUpToFixedFrame(a, r, Ro), u = de.inverse(s, Ro), c = Io, l = So;
	l[0].longitude = n.west, l[0].latitude = n.south, l[1].longitude = n.west, l[1].latitude = n.north, l[2].longitude = n.east, l[2].latitude = n.south;
	let f = No;
	for (i = 0; i < 3; i++) Nt.toCartesian(l[i], r, f), f = de.multiplyByPointAsVector(u, f, f), c[i].x = f.x, c[i].y = f.y;
	const h = jn.fromAxisAngle(z.UNIT_Z, -t, vo), p = ee.fromQuaternion(h, Po), m = e.length;
	let d = Number.POSITIVE_INFINITY, y = Number.POSITIVE_INFINITY, _ = Number.NEGATIVE_INFINITY, g = Number.NEGATIVE_INFINITY;
	for (i = 0; i < m; i++) f = de.multiplyByPointAsVector(u, e[i], f), f = ee.multiplyByVector(p, f, f), d = Math.min(d, f.x), y = Math.min(y, f.y), _ = Math.max(_, f.x), g = Math.max(g, f.y);
	const E = po.fromRotation(t, Mo), b = Co;
	b[0].x = d, b[0].y = y, b[1].x = d, b[1].y = g, b[2].x = _, b[2].y = y;
	const w = c[0], T = c[2].x - w.x, O = c[1].y - w.y;
	for (i = 0; i < 3; i++) {
		const e = b[i];
		po.multiplyByVector(E, e, e), e.x = (e.x - w.x) / T, e.y = (e.y - w.y) / O;
	}
	const A = b[0], x = b[1], R = b[2], S = new Array(6);
	return wt.pack(A, S), wt.pack(x, S, 2), wt.pack(R, S, 4), S;
}, Object.defineProperties(Fo.prototype, {
	internalFormat: { get: function() {
		return this._format;
	} },
	pixelDatatype: { get: function() {
		return this._datatype;
	} },
	width: { get: function() {
		return this._width;
	} },
	height: { get: function() {
		return this._height;
	} },
	bufferView: { get: function() {
		return this._buffer;
	} },
	arrayBufferView: { get: function() {
		return this._buffer;
	} }
}), Fo.clone = function(e) {
	if (C(e)) return new Fo(e._format, e._datatype, e._width, e._height, e._buffer);
}, Fo.prototype.clone = function() {
	return Fo.clone(this);
};
const zo = new Gr();
function Bo(e) {
	let t;
	try {
		t = new Blob([e], { type: "application/javascript" });
	} catch (r) {
		const i = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder)();
		i.append(e), t = i.getBlob("application/javascript");
	}
	return (window.URL || window.webkitURL).createObjectURL(t);
}
function Uo(e) {
	const t = new Ir.default(e), r = 0 !== t.scheme().length && 0 === t.fragment().length, n = e.replace(/\.js$/, ""), i = {};
	let o, a;
	if (Fr(e)) a = e;
	else if (!r) {
		const e = Ln(`${jo._workerModulePrefix}/${n}.js`);
		Fr(e) && (a = e);
	}
	if (a) return o = Bo(`import "${a}";`), i.type = "module", new Worker(o, i);
	if (!r && "undefined" != typeof CESIUM_WORKERS) return o = Bo(`\n      importScripts("${Bo(CESIUM_WORKERS)}");\n      CesiumWorkers["${n}"]();\n    `), new Worker(o, i);
	if (o = e, r || (o = Ln(`${jo._workerModulePrefix + n}.js`)), !ft.supportsEsmWebWorkers()) throw new me("This browser is not supported. Please update your browser to continue.");
	return i.type = "module", new Worker(o, i);
}
function jo(e, t) {
	this._workerPath = e, this._maximumActiveTasks = t ?? Number.POSITIVE_INFINITY, this._activeTasks = 0, this._nextID = 0, this._webAssemblyPromise = void 0;
}
const qo = [];
function Go() {}
let ko;
function Wo(e) {
	let t;
	return v.defined("resourceOrUrlOrBuffer", e), t = e instanceof ArrayBuffer || ArrayBuffer.isView(e) ? Promise.resolve(e) : cn.createIfNeeded(e).fetchArrayBuffer(), t.then(function(e) {
		return Go.transcode(e, ko);
	});
}
function Vo(e, t) {
	this.start = e ?? 0, this.stop = t ?? 0;
}
jo.prototype.scheduleTask = function(e, t) {
	if (C(this._worker) || (this._worker = Uo(this._workerPath)), !(this._activeTasks >= this._maximumActiveTasks)) return async function(e, t, r) {
		++e._activeTasks;
		try {
			const n = await async function(e, t, r) {
				const n = await Promise.resolve(Do());
				C(r) ? n || (r.length = 0) : r = qo;
				const i = e._nextID++, o = new Promise((t, r) => {
					e._worker.addEventListener("message", ((e, t, r, n) => {
						const i = ({ data: o }) => {
							if (o.id === t) {
								if (C(o.error)) {
									let e = o.error;
									"RuntimeError" === e.name ? (e = new me(o.error.message), e.stack = o.error.stack) : "DeveloperError" === e.name ? (e = new N(o.error.message), e.stack = o.error.stack) : "Error" === e.name && (e = new Error(o.error.message), e.stack = o.error.stack), zo.raiseEvent(e), n(e);
								} else zo.raiseEvent(), r(o.result);
								e.removeEventListener("message", i);
							}
						};
						return i;
					})(e._worker, i, t, r));
				});
				return e._worker.postMessage({
					id: i,
					baseUrl: Ln.getCesiumBaseUrl().url,
					parameters: t,
					canTransferArrayBuffer: n
				}, r), o;
			}(e, t, r);
			return --e._activeTasks, n;
		} catch (t) {
			throw --e._activeTasks, t;
		}
	}(this, e, t);
}, jo.prototype.initWebAssemblyModule = async function(e) {
	return C(this._webAssemblyPromise) || (this._webAssemblyPromise = (async () => {
		const t = this._worker = Uo(this._workerPath), r = await async function(e, t) {
			const r = {
				modulePath: void 0,
				wasmBinaryFile: void 0,
				wasmBinary: void 0
			};
			if (!ft.supportsWebAssembly()) {
				if (!C(t.fallbackModulePath)) throw new me(`This browser does not support Web Assembly, and no backup module was provided for ${e._workerPath}`);
				return r.modulePath = Ln(t.fallbackModulePath), r;
			}
			return r.wasmBinaryFile = Ln(t.wasmBinaryFile), r.wasmBinary = await cn.fetchArrayBuffer({ url: r.wasmBinaryFile }), r;
		}(this, e), n = await Promise.resolve(Do());
		let i;
		const o = r.wasmBinary;
		C(o) && n && (i = [o]);
		const a = new Promise((e, r) => {
			t.onmessage = function({ data: t }) {
				C(t) ? e(t.result) : r(new me("Could not configure wasm module"));
			};
		});
		return t.postMessage({
			canTransferArrayBuffer: n,
			parameters: { webAssemblyConfig: r }
		}, i), a;
	})()), this._webAssemblyPromise;
}, jo.prototype.isDestroyed = function() {
	return !1;
}, jo.prototype.destroy = function() {
	return C(this._worker) && this._worker.terminate(), Me(this);
}, jo.taskCompletedEvent = zo, jo._defaultWorkerModulePrefix = "Workers/", jo._workerModulePrefix = jo._defaultWorkerModulePrefix, jo._canTransferArrayBuffer = void 0, Go._transcodeTaskProcessor = new jo("transcodeKTX2", Number.POSITIVE_INFINITY), Go._readyPromise = void 0, Go.transcode = function(e, t) {
	return v.defined("supportedTargetFormats", t), C(Go._readyPromise) || (Go._readyPromise = Go._transcodeTaskProcessor.initWebAssemblyModule({ wasmBinaryFile: "ThirdParty/basis_transcoder.wasm" }).then(function(e) {
		if (e) return Go._transcodeTaskProcessor;
		throw new me("KTX2 transcoder could not be initialized.");
	})), Go._readyPromise.then(function(r) {
		let n = e;
		e instanceof ArrayBuffer && (n = new Uint8Array(e));
		const i = {
			supportedTargetFormats: t,
			ktx2Buffer: n
		};
		return r.scheduleTask(i, [n.buffer]);
	}).then(function(e) {
		const t = e.length, r = Object.keys(e[0]);
		for (let n = 0; n < t; n++) {
			const t = e[n];
			for (let e = 0; e < r.length; e++) {
				const n = t[r[e]];
				t[r[e]] = new Fo(n.internalFormat, n.datatype, n.width, n.height, n.levelBuffer);
			}
		}
		if (1 === r.length) {
			for (let n = 0; n < t; ++n) e[n] = e[n][r[0]];
			1 === t && (e = e[0]);
		}
		return e;
	}).catch(function(e) {
		throw e;
	});
}, Wo.setKTX2SupportedFormats = function(e, t, r, n, i, o) {
	ko = {
		s3tc: e,
		pvrtc: t,
		astc: r,
		etc: n,
		etc1: i,
		bc7: o
	};
};
var Ho = class e {
	constructor(e, t) {
		this.center = z.clone(e ?? z.ZERO), this.radius = t ?? 0;
	}
	static fromPoints(t, r) {
		if (C(r) || (r = new e()), !C(t) || 0 === t.length) return r.center = z.clone(z.ZERO, r.center), r.radius = 0, r;
		const n = z.clone(t[0], Jo), i = z.clone(n, Yo), o = z.clone(n, Xo), a = z.clone(n, $o), s = z.clone(n, Ko), u = z.clone(n, Zo), c = z.clone(n, Qo), l = t.length;
		let f;
		for (f = 1; f < l; f++) {
			z.clone(t[f], n);
			const e = n.x, r = n.y, l = n.z;
			e < i.x && z.clone(n, i), e > s.x && z.clone(n, s), r < o.y && z.clone(n, o), r > u.y && z.clone(n, u), l < a.z && z.clone(n, a), l > c.z && z.clone(n, c);
		}
		const h = z.magnitudeSquared(z.subtract(s, i, ea)), p = z.magnitudeSquared(z.subtract(u, o, ea)), m = z.magnitudeSquared(z.subtract(c, a, ea));
		let d = i, y = s, _ = h;
		p > _ && (_ = p, d = o, y = u), m > _ && (_ = m, d = a, y = c);
		const g = ta;
		g.x = .5 * (d.x + y.x), g.y = .5 * (d.y + y.y), g.z = .5 * (d.z + y.z);
		let E = z.magnitudeSquared(z.subtract(y, g, ea)), b = Math.sqrt(E);
		const w = ra;
		w.x = i.x, w.y = o.y, w.z = a.z;
		const T = na;
		T.x = s.x, T.y = u.y, T.z = c.z;
		const O = z.midpoint(w, T, ia);
		let A = 0;
		for (f = 0; f < l; f++) {
			z.clone(t[f], n);
			const e = z.magnitude(z.subtract(n, O, ea));
			e > A && (A = e);
			const r = z.magnitudeSquared(z.subtract(n, g, ea));
			if (r > E) {
				const e = Math.sqrt(r);
				b = .5 * (b + e), E = b * b;
				const t = e - b;
				g.x = (b * g.x + t * n.x) / e, g.y = (b * g.y + t * n.y) / e, g.z = (b * g.z + t * n.z) / e;
			}
		}
		return b < A ? (z.clone(g, r.center), r.radius = b) : (z.clone(O, r.center), r.radius = A), r;
	}
	static fromRectangle2D(t, r, n) {
		return e.fromRectangleWithHeights2D(t, r, 0, 0, n);
	}
	static fromRectangleWithHeights2D(t, r, n, i, o) {
		if (C(o) || (o = new e()), !C(t)) return o.center = z.clone(z.ZERO, o.center), o.radius = 0, o;
		aa._ellipsoid = Ft.default, r = r ?? aa, Qi.southwest(t, ca), ca.height = n, Qi.northeast(t, la), la.height = i;
		const a = r.project(ca, sa), s = r.project(la, ua), u = s.x - a.x, c = s.y - a.y, l = s.z - a.z;
		o.radius = .5 * Math.sqrt(u * u + c * c + l * l);
		const f = o.center;
		return f.x = a.x + .5 * u, f.y = a.y + .5 * c, f.z = a.z + .5 * l, o;
	}
	static fromRectangle3D(t, r, n, i) {
		if (r = r ?? Ft.default, n = n ?? 0, C(i) || (i = new e()), !C(t)) return i.center = z.clone(z.ZERO, i.center), i.radius = 0, i;
		const o = Qi.subsample(t, r, n, fa);
		return e.fromPoints(o, i);
	}
	static fromVertices(t, r, n, i) {
		if (C(i) || (i = new e()), !C(t) || 0 === t.length) return i.center = z.clone(z.ZERO, i.center), i.radius = 0, i;
		r = r ?? z.ZERO, n = n ?? 3, v.typeOf.number.greaterThanOrEquals("stride", n, 3);
		const o = Jo;
		o.x = t[0] + r.x, o.y = t[1] + r.y, o.z = t[2] + r.z;
		const a = z.clone(o, Yo), s = z.clone(o, Xo), u = z.clone(o, $o), c = z.clone(o, Ko), l = z.clone(o, Zo), f = z.clone(o, Qo), h = t.length;
		let p;
		for (p = 0; p < h; p += n) {
			const e = t[p] + r.x, n = t[p + 1] + r.y, i = t[p + 2] + r.z;
			o.x = e, o.y = n, o.z = i, e < a.x && z.clone(o, a), e > c.x && z.clone(o, c), n < s.y && z.clone(o, s), n > l.y && z.clone(o, l), i < u.z && z.clone(o, u), i > f.z && z.clone(o, f);
		}
		const m = z.magnitudeSquared(z.subtract(c, a, ea)), d = z.magnitudeSquared(z.subtract(l, s, ea)), y = z.magnitudeSquared(z.subtract(f, u, ea));
		let _ = a, g = c, E = m;
		d > E && (E = d, _ = s, g = l), y > E && (E = y, _ = u, g = f);
		const b = ta;
		b.x = .5 * (_.x + g.x), b.y = .5 * (_.y + g.y), b.z = .5 * (_.z + g.z);
		let w = z.magnitudeSquared(z.subtract(g, b, ea)), T = Math.sqrt(w);
		const O = ra;
		O.x = a.x, O.y = s.y, O.z = u.z;
		const A = na;
		A.x = c.x, A.y = l.y, A.z = f.z;
		const x = z.midpoint(O, A, ia);
		let R = 0;
		for (p = 0; p < h; p += n) {
			o.x = t[p] + r.x, o.y = t[p + 1] + r.y, o.z = t[p + 2] + r.z;
			const e = z.magnitude(z.subtract(o, x, ea));
			e > R && (R = e);
			const n = z.magnitudeSquared(z.subtract(o, b, ea));
			if (n > w) {
				const e = Math.sqrt(n);
				T = .5 * (T + e), w = T * T;
				const t = e - T;
				b.x = (T * b.x + t * o.x) / e, b.y = (T * b.y + t * o.y) / e, b.z = (T * b.z + t * o.z) / e;
			}
		}
		return T < R ? (z.clone(b, i.center), i.radius = T) : (z.clone(x, i.center), i.radius = R), i;
	}
	static fromEncodedCartesianVertices(t, r, n) {
		if (C(n) || (n = new e()), !C(t) || !C(r) || t.length !== r.length || 0 === t.length) return n.center = z.clone(z.ZERO, n.center), n.radius = 0, n;
		const i = Jo;
		i.x = t[0] + r[0], i.y = t[1] + r[1], i.z = t[2] + r[2];
		const o = z.clone(i, Yo), a = z.clone(i, Xo), s = z.clone(i, $o), u = z.clone(i, Ko), c = z.clone(i, Zo), l = z.clone(i, Qo), f = t.length;
		let h;
		for (h = 0; h < f; h += 3) {
			const e = t[h] + r[h], n = t[h + 1] + r[h + 1], f = t[h + 2] + r[h + 2];
			i.x = e, i.y = n, i.z = f, e < o.x && z.clone(i, o), e > u.x && z.clone(i, u), n < a.y && z.clone(i, a), n > c.y && z.clone(i, c), f < s.z && z.clone(i, s), f > l.z && z.clone(i, l);
		}
		const p = z.magnitudeSquared(z.subtract(u, o, ea)), m = z.magnitudeSquared(z.subtract(c, a, ea)), d = z.magnitudeSquared(z.subtract(l, s, ea));
		let y = o, _ = u, g = p;
		m > g && (g = m, y = a, _ = c), d > g && (g = d, y = s, _ = l);
		const E = ta;
		E.x = .5 * (y.x + _.x), E.y = .5 * (y.y + _.y), E.z = .5 * (y.z + _.z);
		let b = z.magnitudeSquared(z.subtract(_, E, ea)), w = Math.sqrt(b);
		const T = ra;
		T.x = o.x, T.y = a.y, T.z = s.z;
		const O = na;
		O.x = u.x, O.y = c.y, O.z = l.z;
		const A = z.midpoint(T, O, ia);
		let x = 0;
		for (h = 0; h < f; h += 3) {
			i.x = t[h] + r[h], i.y = t[h + 1] + r[h + 1], i.z = t[h + 2] + r[h + 2];
			const e = z.magnitude(z.subtract(i, A, ea));
			e > x && (x = e);
			const n = z.magnitudeSquared(z.subtract(i, E, ea));
			if (n > b) {
				const e = Math.sqrt(n);
				w = .5 * (w + e), b = w * w;
				const t = e - w;
				E.x = (w * E.x + t * i.x) / e, E.y = (w * E.y + t * i.y) / e, E.z = (w * E.z + t * i.z) / e;
			}
		}
		return w < x ? (z.clone(E, n.center), n.radius = w) : (z.clone(A, n.center), n.radius = x), n;
	}
	static fromCornerPoints(t, r, n) {
		v.typeOf.object("corner", t), v.typeOf.object("oppositeCorner", r), C(n) || (n = new e());
		const i = z.midpoint(t, r, n.center);
		return n.radius = z.distance(i, r), n;
	}
	static fromEllipsoid(t, r) {
		return v.typeOf.object("ellipsoid", t), C(r) || (r = new e()), z.clone(z.ZERO, r.center), r.radius = t.maximumRadius, r;
	}
	static fromBoundingSpheres(t, r) {
		if (C(r) || (r = new e()), !C(t) || 0 === t.length) return r.center = z.clone(z.ZERO, r.center), r.radius = 0, r;
		const n = t.length;
		if (1 === n) return e.clone(t[0], r);
		if (2 === n) return e.union(t[0], t[1], r);
		const i = [];
		let o;
		for (o = 0; o < n; o++) i.push(t[o].center);
		const a = (r = e.fromPoints(i, r)).center;
		let s = r.radius;
		for (o = 0; o < n; o++) {
			const e = t[o];
			s = Math.max(s, z.distance(a, e.center) + e.radius);
		}
		return r.radius = s, r;
	}
	static fromOrientedBoundingBox(t, r) {
		v.defined("orientedBoundingBox", t), C(r) || (r = new e());
		const n = t.halfAxes, i = ee.getColumn(n, 0, ha), o = ee.getColumn(n, 1, pa), a = ee.getColumn(n, 2, ma);
		return z.add(i, o, i), z.add(i, a, i), r.center = z.clone(t.center, r.center), r.radius = z.magnitude(i), r;
	}
	static fromTransformation(t, r) {
		v.typeOf.object("transformation", t), C(r) || (r = new e());
		const n = de.getTranslation(t, da), i = de.getScale(t, ya), o = .5 * z.magnitude(i);
		return r.center = z.clone(n, r.center), r.radius = o, r;
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r.center = z.clone(t.center, r.center), r.radius = t.radius, r) : new e(t.center, t.radius);
	}
	static pack(e, t, r) {
		v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0;
		const n = e.center;
		return t[r++] = n.x, t[r++] = n.y, t[r++] = n.z, t[r] = e.radius, t;
	}
	static unpack(t, r, n) {
		v.defined("array", t), r = r ?? 0, C(n) || (n = new e());
		const i = n.center;
		return i.x = t[r++], i.y = t[r++], i.z = t[r++], n.radius = t[r], n;
	}
	static union(t, r, n) {
		v.typeOf.object("left", t), v.typeOf.object("right", r), C(n) || (n = new e());
		const i = t.center, o = t.radius, a = r.center, s = r.radius, u = z.subtract(a, i, _a), c = z.magnitude(u);
		if (o >= c + s) return t.clone(n), n;
		if (s >= c + o) return r.clone(n), n;
		const l = .5 * (o + c + s), f = z.multiplyByScalar(u, (-o + l) / c, ga);
		return z.add(f, i, f), z.clone(f, n.center), n.radius = l, n;
	}
	static expand(t, r, n) {
		v.typeOf.object("sphere", t), v.typeOf.object("point", r), n = e.clone(t, n);
		const i = z.magnitude(z.subtract(r, n.center, Ea));
		return i > n.radius && (n.radius = i), n;
	}
	static intersectPlane(e, t) {
		v.typeOf.object("sphere", e), v.typeOf.object("plane", t);
		const r = e.center, n = e.radius, i = t.normal, o = z.dot(i, r) + t.distance;
		return o < -n ? Ht.OUTSIDE : o < n ? Ht.INTERSECTING : Ht.INSIDE;
	}
	static transform(t, r, n) {
		return v.typeOf.object("sphere", t), v.typeOf.object("transform", r), C(n) || (n = new e()), n.center = de.multiplyByPoint(r, t.center, n.center), n.radius = de.getMaximumScale(r) * t.radius, n;
	}
	static distanceSquaredTo(e, t) {
		v.typeOf.object("sphere", e), v.typeOf.object("cartesian", t);
		const r = z.subtract(e.center, t, ba), n = z.magnitude(r) - e.radius;
		return n <= 0 ? 0 : n * n;
	}
	static transformWithoutScale(t, r, n) {
		return v.typeOf.object("sphere", t), v.typeOf.object("transform", r), C(n) || (n = new e()), n.center = de.multiplyByPoint(r, t.center, n.center), n.radius = t.radius, n;
	}
	static computePlaneDistances(e, t, r, n) {
		v.typeOf.object("sphere", e), v.typeOf.object("position", t), v.typeOf.object("direction", r), C(n) || (n = new Vo());
		const i = z.subtract(e.center, t, wa), o = z.dot(r, i);
		return n.start = o - e.radius, n.stop = o + e.radius, n;
	}
	static projectTo2D(t, r, n) {
		v.typeOf.object("sphere", t), Ca._ellipsoid = Ft.default;
		const i = (r = r ?? Ca).ellipsoid;
		let o = t.center;
		const a = t.radius;
		let s;
		s = z.equals(o, z.ZERO) ? z.clone(z.UNIT_X, Ta) : i.geodeticSurfaceNormal(o, Ta);
		const u = z.cross(z.UNIT_Z, s, Oa);
		z.normalize(u, u);
		const c = z.cross(s, u, Aa);
		z.normalize(c, c), z.multiplyByScalar(s, a, s), z.multiplyByScalar(c, a, c), z.multiplyByScalar(u, a, u);
		const l = z.negate(c, Ra), f = z.negate(u, xa), h = Ia;
		let p = h[0];
		z.add(s, c, p), z.add(p, u, p), p = h[1], z.add(s, c, p), z.add(p, f, p), p = h[2], z.add(s, l, p), z.add(p, f, p), p = h[3], z.add(s, l, p), z.add(p, u, p), z.negate(s, s), p = h[4], z.add(s, c, p), z.add(p, u, p), p = h[5], z.add(s, c, p), z.add(p, f, p), p = h[6], z.add(s, l, p), z.add(p, f, p), p = h[7], z.add(s, l, p), z.add(p, u, p);
		const m = h.length;
		for (let e = 0; e < m; ++e) {
			const t = h[e];
			z.add(o, t, t);
			const n = i.cartesianToCartographic(t, Sa);
			r.project(n, t);
		}
		o = (n = e.fromPoints(h, n)).center;
		const d = o.x, y = o.y, _ = o.z;
		return o.x = _, o.y = d, o.z = y, n;
	}
	static isOccluded(e, t) {
		return v.typeOf.object("sphere", e), v.typeOf.object("occluder", t), !t.isBoundingSphereVisible(e);
	}
	static equals(e, t) {
		return e === t || C(e) && C(t) && z.equals(e.center, t.center) && e.radius === t.radius;
	}
	intersectPlane(t) {
		return e.intersectPlane(this, t);
	}
	distanceSquaredTo(t) {
		return e.distanceSquaredTo(this, t);
	}
	computePlaneDistances(t, r, n) {
		return e.computePlaneDistances(this, t, r, n);
	}
	isOccluded(t) {
		return e.isOccluded(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	clone(t) {
		return e.clone(this, t);
	}
	volume() {
		const e = this.radius;
		return oa * e * e * e;
	}
};
Ho.packedLength = 4;
const Yo = new z(), Xo = new z(), $o = new z(), Ko = new z(), Zo = new z(), Qo = new z(), Jo = new z(), ea = new z(), ta = new z(), ra = new z(), na = new z(), ia = new z(), oa = 4 / 3 * L.PI, aa = new Vt(), sa = new z(), ua = new z(), ca = new Nt(), la = new Nt(), fa = [], ha = new z(), pa = new z(), ma = new z(), da = new z(), ya = new z(), _a = new z(), ga = new z(), Ea = new z(), ba = new z(), wa = new z(), Ta = new z(), Oa = new z(), Aa = new z(), xa = new z(), Ra = new z(), Sa = new Nt(), Ia = new Array(8);
for (let Dl = 0; Dl < 8; ++Dl) Ia[Dl] = new z();
const Ca = new Vt();
function Na(e) {
	e = e ?? J.EMPTY_OBJECT, this.position = e.position, this.normal = e.normal, this.st = e.st, this.bitangent = e.bitangent, this.tangent = e.tangent, this.color = e.color;
}
const va = {
	NONE: 0,
	TOP: 1,
	ALL: 2
};
function Pa(e) {
	e = e ?? J.EMPTY_OBJECT, this.position = e.position ?? !1, this.normal = e.normal ?? !1, this.st = e.st ?? !1, this.bitangent = e.bitangent ?? !1, this.tangent = e.tangent ?? !1, this.color = e.color ?? !1;
}
Object.freeze(va), Pa.POSITION_ONLY = Object.freeze(new Pa({ position: !0 })), Pa.POSITION_AND_NORMAL = Object.freeze(new Pa({
	position: !0,
	normal: !0
})), Pa.POSITION_NORMAL_AND_ST = Object.freeze(new Pa({
	position: !0,
	normal: !0,
	st: !0
})), Pa.POSITION_AND_ST = Object.freeze(new Pa({
	position: !0,
	st: !0
})), Pa.POSITION_AND_COLOR = Object.freeze(new Pa({
	position: !0,
	color: !0
})), Pa.ALL = Object.freeze(new Pa({
	position: !0,
	normal: !0,
	st: !0,
	tangent: !0,
	bitangent: !0
})), Pa.DEFAULT = Pa.POSITION_NORMAL_AND_ST, Pa.packedLength = 6, Pa.pack = function(e, t, r) {
	if (!C(e)) throw new N("value is required");
	if (!C(t)) throw new N("array is required");
	return r = r ?? 0, t[r++] = e.position ? 1 : 0, t[r++] = e.normal ? 1 : 0, t[r++] = e.st ? 1 : 0, t[r++] = e.tangent ? 1 : 0, t[r++] = e.bitangent ? 1 : 0, t[r] = e.color ? 1 : 0, t;
}, Pa.unpack = function(e, t, r) {
	if (!C(e)) throw new N("array is required");
	return t = t ?? 0, C(r) || (r = new Pa()), r.position = 1 === e[t++], r.normal = 1 === e[t++], r.st = 1 === e[t++], r.tangent = 1 === e[t++], r.bitangent = 1 === e[t++], r.color = 1 === e[t], r;
}, Pa.clone = function(e, t) {
	if (C(e)) return C(t) || (t = new Pa()), t.position = e.position, t.normal = e.normal, t.st = e.st, t.tangent = e.tangent, t.bitangent = e.bitangent, t.color = e.color, t;
};
const Ma = new z();
function La(e) {
	const t = (e = e ?? J.EMPTY_OBJECT).minimum, r = e.maximum;
	if (v.typeOf.object("min", t), v.typeOf.object("max", r), C(e.offsetAttribute) && e.offsetAttribute === va.TOP) throw new N("GeometryOffsetAttribute.TOP is not a supported options.offsetAttribute for this geometry.");
	const n = e.vertexFormat ?? Pa.DEFAULT;
	this._minimum = z.clone(t), this._maximum = z.clone(r), this._vertexFormat = n, this._offsetAttribute = e.offsetAttribute, this._workerName = "createBoxGeometry";
}
La.fromDimensions = function(e) {
	const t = (e = e ?? J.EMPTY_OBJECT).dimensions;
	v.typeOf.object("dimensions", t), v.typeOf.number.greaterThanOrEquals("dimensions.x", t.x, 0), v.typeOf.number.greaterThanOrEquals("dimensions.y", t.y, 0), v.typeOf.number.greaterThanOrEquals("dimensions.z", t.z, 0);
	const r = z.multiplyByScalar(t, .5, new z());
	return new La({
		minimum: z.negate(r, new z()),
		maximum: r,
		vertexFormat: e.vertexFormat,
		offsetAttribute: e.offsetAttribute
	});
}, La.fromAxisAlignedBoundingBox = function(e) {
	return v.typeOf.object("boundingBox", e), new La({
		minimum: e.minimum,
		maximum: e.maximum
	});
}, La.packedLength = 2 * z.packedLength + Pa.packedLength + 1, La.pack = function(e, t, r) {
	return v.typeOf.object("value", e), v.defined("array", t), r = r ?? 0, z.pack(e._minimum, t, r), z.pack(e._maximum, t, r + z.packedLength), Pa.pack(e._vertexFormat, t, r + 2 * z.packedLength), t[r + 2 * z.packedLength + Pa.packedLength] = e._offsetAttribute ?? -1, t;
};
const Fa = new z(), Da = new z(), za = new Pa(), Ba = {
	minimum: Fa,
	maximum: Da,
	vertexFormat: za,
	offsetAttribute: void 0
};
let Ua;
La.unpack = function(e, t, r) {
	v.defined("array", e), t = t ?? 0;
	const n = z.unpack(e, t, Fa), i = z.unpack(e, t + z.packedLength, Da), o = Pa.unpack(e, t + 2 * z.packedLength, za), a = e[t + 2 * z.packedLength + Pa.packedLength];
	return C(r) ? (r._minimum = z.clone(n, r._minimum), r._maximum = z.clone(i, r._maximum), r._vertexFormat = Pa.clone(o, r._vertexFormat), r._offsetAttribute = -1 === a ? void 0 : a, r) : (Ba.offsetAttribute = -1 === a ? void 0 : a, new La(Ba));
}, La.createGeometry = function(e) {
	const t = e._minimum, r = e._maximum, n = e._vertexFormat;
	if (z.equals(t, r)) return;
	const i = new Na();
	let o, a;
	if (n.position && (n.st || n.normal || n.tangent || n.bitangent)) {
		if (n.position && (a = new Float64Array(72), a[0] = t.x, a[1] = t.y, a[2] = r.z, a[3] = r.x, a[4] = t.y, a[5] = r.z, a[6] = r.x, a[7] = r.y, a[8] = r.z, a[9] = t.x, a[10] = r.y, a[11] = r.z, a[12] = t.x, a[13] = t.y, a[14] = t.z, a[15] = r.x, a[16] = t.y, a[17] = t.z, a[18] = r.x, a[19] = r.y, a[20] = t.z, a[21] = t.x, a[22] = r.y, a[23] = t.z, a[24] = r.x, a[25] = t.y, a[26] = t.z, a[27] = r.x, a[28] = r.y, a[29] = t.z, a[30] = r.x, a[31] = r.y, a[32] = r.z, a[33] = r.x, a[34] = t.y, a[35] = r.z, a[36] = t.x, a[37] = t.y, a[38] = t.z, a[39] = t.x, a[40] = r.y, a[41] = t.z, a[42] = t.x, a[43] = r.y, a[44] = r.z, a[45] = t.x, a[46] = t.y, a[47] = r.z, a[48] = t.x, a[49] = r.y, a[50] = t.z, a[51] = r.x, a[52] = r.y, a[53] = t.z, a[54] = r.x, a[55] = r.y, a[56] = r.z, a[57] = t.x, a[58] = r.y, a[59] = r.z, a[60] = t.x, a[61] = t.y, a[62] = t.z, a[63] = r.x, a[64] = t.y, a[65] = t.z, a[66] = r.x, a[67] = t.y, a[68] = r.z, a[69] = t.x, a[70] = t.y, a[71] = r.z, i.position = new Lo({
			componentDatatype: wo.DOUBLE,
			componentsPerAttribute: 3,
			values: a
		})), n.normal) {
			const e = new Float32Array(72);
			e[0] = 0, e[1] = 0, e[2] = 1, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 1, e[9] = 0, e[10] = 0, e[11] = 1, e[12] = 0, e[13] = 0, e[14] = -1, e[15] = 0, e[16] = 0, e[17] = -1, e[18] = 0, e[19] = 0, e[20] = -1, e[21] = 0, e[22] = 0, e[23] = -1, e[24] = 1, e[25] = 0, e[26] = 0, e[27] = 1, e[28] = 0, e[29] = 0, e[30] = 1, e[31] = 0, e[32] = 0, e[33] = 1, e[34] = 0, e[35] = 0, e[36] = -1, e[37] = 0, e[38] = 0, e[39] = -1, e[40] = 0, e[41] = 0, e[42] = -1, e[43] = 0, e[44] = 0, e[45] = -1, e[46] = 0, e[47] = 0, e[48] = 0, e[49] = 1, e[50] = 0, e[51] = 0, e[52] = 1, e[53] = 0, e[54] = 0, e[55] = 1, e[56] = 0, e[57] = 0, e[58] = 1, e[59] = 0, e[60] = 0, e[61] = -1, e[62] = 0, e[63] = 0, e[64] = -1, e[65] = 0, e[66] = 0, e[67] = -1, e[68] = 0, e[69] = 0, e[70] = -1, e[71] = 0, i.normal = new Lo({
				componentDatatype: wo.FLOAT,
				componentsPerAttribute: 3,
				values: e
			});
		}
		if (n.st) {
			const e = new Float32Array(48);
			e[0] = 0, e[1] = 0, e[2] = 1, e[3] = 0, e[4] = 1, e[5] = 1, e[6] = 0, e[7] = 1, e[8] = 1, e[9] = 0, e[10] = 0, e[11] = 0, e[12] = 0, e[13] = 1, e[14] = 1, e[15] = 1, e[16] = 0, e[17] = 0, e[18] = 1, e[19] = 0, e[20] = 1, e[21] = 1, e[22] = 0, e[23] = 1, e[24] = 1, e[25] = 0, e[26] = 0, e[27] = 0, e[28] = 0, e[29] = 1, e[30] = 1, e[31] = 1, e[32] = 1, e[33] = 0, e[34] = 0, e[35] = 0, e[36] = 0, e[37] = 1, e[38] = 1, e[39] = 1, e[40] = 0, e[41] = 0, e[42] = 1, e[43] = 0, e[44] = 1, e[45] = 1, e[46] = 0, e[47] = 1, i.st = new Lo({
				componentDatatype: wo.FLOAT,
				componentsPerAttribute: 2,
				values: e
			});
		}
		if (n.tangent) {
			const e = new Float32Array(72);
			e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e[6] = 1, e[7] = 0, e[8] = 0, e[9] = 1, e[10] = 0, e[11] = 0, e[12] = -1, e[13] = 0, e[14] = 0, e[15] = -1, e[16] = 0, e[17] = 0, e[18] = -1, e[19] = 0, e[20] = 0, e[21] = -1, e[22] = 0, e[23] = 0, e[24] = 0, e[25] = 1, e[26] = 0, e[27] = 0, e[28] = 1, e[29] = 0, e[30] = 0, e[31] = 1, e[32] = 0, e[33] = 0, e[34] = 1, e[35] = 0, e[36] = 0, e[37] = -1, e[38] = 0, e[39] = 0, e[40] = -1, e[41] = 0, e[42] = 0, e[43] = -1, e[44] = 0, e[45] = 0, e[46] = -1, e[47] = 0, e[48] = -1, e[49] = 0, e[50] = 0, e[51] = -1, e[52] = 0, e[53] = 0, e[54] = -1, e[55] = 0, e[56] = 0, e[57] = -1, e[58] = 0, e[59] = 0, e[60] = 1, e[61] = 0, e[62] = 0, e[63] = 1, e[64] = 0, e[65] = 0, e[66] = 1, e[67] = 0, e[68] = 0, e[69] = 1, e[70] = 0, e[71] = 0, i.tangent = new Lo({
				componentDatatype: wo.FLOAT,
				componentsPerAttribute: 3,
				values: e
			});
		}
		if (n.bitangent) {
			const e = new Float32Array(72);
			e[0] = 0, e[1] = 1, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, e[7] = 1, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 1, e[14] = 0, e[15] = 0, e[16] = 1, e[17] = 0, e[18] = 0, e[19] = 1, e[20] = 0, e[21] = 0, e[22] = 1, e[23] = 0, e[24] = 0, e[25] = 0, e[26] = 1, e[27] = 0, e[28] = 0, e[29] = 1, e[30] = 0, e[31] = 0, e[32] = 1, e[33] = 0, e[34] = 0, e[35] = 1, e[36] = 0, e[37] = 0, e[38] = 1, e[39] = 0, e[40] = 0, e[41] = 1, e[42] = 0, e[43] = 0, e[44] = 1, e[45] = 0, e[46] = 0, e[47] = 1, e[48] = 0, e[49] = 0, e[50] = 1, e[51] = 0, e[52] = 0, e[53] = 1, e[54] = 0, e[55] = 0, e[56] = 1, e[57] = 0, e[58] = 0, e[59] = 1, e[60] = 0, e[61] = 0, e[62] = 1, e[63] = 0, e[64] = 0, e[65] = 1, e[66] = 0, e[67] = 0, e[68] = 1, e[69] = 0, e[70] = 0, e[71] = 1, i.bitangent = new Lo({
				componentDatatype: wo.FLOAT,
				componentsPerAttribute: 3,
				values: e
			});
		}
		o = new Uint16Array(36), o[0] = 0, o[1] = 1, o[2] = 2, o[3] = 0, o[4] = 2, o[5] = 3, o[6] = 6, o[7] = 5, o[8] = 4, o[9] = 7, o[10] = 6, o[11] = 4, o[12] = 8, o[13] = 9, o[14] = 10, o[15] = 8, o[16] = 10, o[17] = 11, o[18] = 14, o[19] = 13, o[20] = 12, o[21] = 15, o[22] = 14, o[23] = 12, o[24] = 18, o[25] = 17, o[26] = 16, o[27] = 19, o[28] = 18, o[29] = 16, o[30] = 20, o[31] = 21, o[32] = 22, o[33] = 20, o[34] = 22, o[35] = 23;
	} else a = new Float64Array(24), a[0] = t.x, a[1] = t.y, a[2] = t.z, a[3] = r.x, a[4] = t.y, a[5] = t.z, a[6] = r.x, a[7] = r.y, a[8] = t.z, a[9] = t.x, a[10] = r.y, a[11] = t.z, a[12] = t.x, a[13] = t.y, a[14] = r.z, a[15] = r.x, a[16] = t.y, a[17] = r.z, a[18] = r.x, a[19] = r.y, a[20] = r.z, a[21] = t.x, a[22] = r.y, a[23] = r.z, i.position = new Lo({
		componentDatatype: wo.DOUBLE,
		componentsPerAttribute: 3,
		values: a
	}), o = new Uint16Array(36), o[0] = 4, o[1] = 5, o[2] = 6, o[3] = 4, o[4] = 6, o[5] = 7, o[6] = 1, o[7] = 0, o[8] = 3, o[9] = 1, o[10] = 3, o[11] = 2, o[12] = 1, o[13] = 6, o[14] = 5, o[15] = 1, o[16] = 2, o[17] = 6, o[18] = 2, o[19] = 3, o[20] = 7, o[21] = 2, o[22] = 7, o[23] = 6, o[24] = 3, o[25] = 0, o[26] = 4, o[27] = 3, o[28] = 4, o[29] = 7, o[30] = 0, o[31] = 1, o[32] = 5, o[33] = 0, o[34] = 5, o[35] = 4;
	const s = z.subtract(r, t, Ma), u = .5 * z.magnitude(s);
	if (C(e._offsetAttribute)) {
		const t = a.length, r = e._offsetAttribute === va.NONE ? 0 : 1, n = new Uint8Array(t / 3).fill(r);
		i.applyOffset = new Lo({
			componentDatatype: wo.UNSIGNED_BYTE,
			componentsPerAttribute: 1,
			values: n
		});
	}
	return new Oo({
		attributes: i,
		indices: o,
		primitiveType: ao.TRIANGLES,
		boundingSphere: new Ho(z.ZERO, u),
		offsetAttribute: e._offsetAttribute
	});
}, La.getUnitBox = function() {
	return C(Ua) || (Ua = La.createGeometry(La.fromDimensions({
		dimensions: new z(1, 1, 1),
		vertexFormat: Pa.POSITION_ONLY
	}))), Ua;
};
const ja = {
	SCALAR: "SCALAR",
	VEC2: "VEC2",
	VEC3: "VEC3",
	VEC4: "VEC4",
	MAT2: "MAT2",
	MAT3: "MAT3",
	MAT4: "MAT4",
	getMathType: function(e) {
		switch (e) {
			case ja.SCALAR: return Number;
			case ja.VEC2: return wt;
			case ja.VEC3: return z;
			case ja.VEC4: return V;
			case ja.MAT2: return po;
			case ja.MAT3: return ee;
			case ja.MAT4: return de;
			default: throw new N("attributeType is not a valid value.");
		}
	},
	getNumberOfComponents: function(e) {
		switch (e) {
			case ja.SCALAR: return 1;
			case ja.VEC2: return 2;
			case ja.VEC3: return 3;
			case ja.VEC4:
			case ja.MAT2: return 4;
			case ja.MAT3: return 9;
			case ja.MAT4: return 16;
			default: throw new N("attributeType is not a valid value.");
		}
	},
	getAttributeLocationCount: function(e) {
		switch (e) {
			case ja.SCALAR:
			case ja.VEC2:
			case ja.VEC3:
			case ja.VEC4: return 1;
			case ja.MAT2: return 2;
			case ja.MAT3: return 3;
			case ja.MAT4: return 4;
			default: throw new N("attributeType is not a valid value.");
		}
	},
	getGlslType: function(e) {
		switch (v.typeOf.string("attributeType", e), e) {
			case ja.SCALAR: return "float";
			case ja.VEC2: return "vec2";
			case ja.VEC3: return "vec3";
			case ja.VEC4: return "vec4";
			case ja.MAT2: return "mat2";
			case ja.MAT3: return "mat3";
			case ja.MAT4: return "mat4";
			default: throw new N("attributeType is not a valid value.");
		}
	}
};
Object.freeze(ja);
const qa = 1 / 256, Ga = {
	octEncodeInRange: function(e, t, r) {
		v.defined("vector", e), v.defined("result", r);
		const n = z.magnitudeSquared(e);
		if (Math.abs(n - 1) > L.EPSILON6) throw new N("vector must be normalized.");
		if (r.x = e.x / (Math.abs(e.x) + Math.abs(e.y) + Math.abs(e.z)), r.y = e.y / (Math.abs(e.x) + Math.abs(e.y) + Math.abs(e.z)), e.z < 0) {
			const e = r.x, t = r.y;
			r.x = (1 - Math.abs(t)) * L.signNotZero(e), r.y = (1 - Math.abs(e)) * L.signNotZero(t);
		}
		return r.x = L.toSNorm(r.x, t), r.y = L.toSNorm(r.y, t), r;
	},
	octEncode: function(e, t) {
		return Ga.octEncodeInRange(e, 255, t);
	}
}, ka = new wt(), Wa = new Uint8Array(1);
function Va(e) {
	return Wa[0] = e, Wa[0];
}
Ga.octEncodeToCartesian4 = function(e, t) {
	return Ga.octEncodeInRange(e, 65535, ka), t.x = Va(ka.x * qa), t.y = Va(ka.x), t.z = Va(ka.y * qa), t.w = Va(ka.y), t;
}, Ga.octDecodeInRange = function(e, t, r, n) {
	if (v.defined("result", n), e < 0 || e > r || t < 0 || t > r) throw new N(`x and y must be unsigned normalized integers between 0 and ${r}`);
	if (n.x = L.fromSNorm(e, r), n.y = L.fromSNorm(t, r), n.z = 1 - (Math.abs(n.x) + Math.abs(n.y)), n.z < 0) {
		const e = n.x;
		n.x = (1 - Math.abs(n.y)) * L.signNotZero(e), n.y = (1 - Math.abs(e)) * L.signNotZero(n.y);
	}
	return z.normalize(n, n);
}, Ga.octDecode = function(e, t, r) {
	return Ga.octDecodeInRange(e, t, 255, r);
}, Ga.octDecodeFromCartesian4 = function(e, t) {
	v.typeOf.object("encoded", e), v.typeOf.object("result", t);
	const r = e.x, n = e.y, i = e.z, o = e.w;
	if (r < 0 || r > 255 || n < 0 || n > 255 || i < 0 || i > 255 || o < 0 || o > 255) throw new N("x, y, z, and w must be unsigned normalized integers between 0 and 255");
	const a = 256 * r + n, s = 256 * i + o;
	return Ga.octDecodeInRange(a, s, 65535, t);
}, Ga.octPackFloat = function(e) {
	return v.defined("encoded", e), 256 * e.x + e.y;
};
const Ha = new wt();
function Ya(e) {
	return e >> 1 ^ -(1 & e);
}
Ga.octEncodeFloat = function(e) {
	return Ga.octEncode(e, Ha), Ga.octPackFloat(Ha);
}, Ga.octDecodeFloat = function(e, t) {
	v.defined("value", e);
	const r = e / 256, n = Math.floor(r), i = 256 * (r - n);
	return Ga.octDecode(n, i, t);
}, Ga.octPack = function(e, t, r, n) {
	v.defined("v1", e), v.defined("v2", t), v.defined("v3", r), v.defined("result", n);
	const i = Ga.octEncodeFloat(e), o = Ga.octEncodeFloat(t), a = Ga.octEncode(r, Ha);
	return n.x = 65536 * a.x + i, n.y = 65536 * a.y + o, n;
}, Ga.octUnpack = function(e, t, r, n) {
	v.defined("packed", e), v.defined("v1", t), v.defined("v2", r), v.defined("v3", n);
	let i = e.x / 65536;
	const o = Math.floor(i), a = 65536 * (i - o);
	i = e.y / 65536;
	const s = Math.floor(i), u = 65536 * (i - s);
	Ga.octDecodeFloat(a, t), Ga.octDecodeFloat(u, r), Ga.octDecode(o, s, n);
}, Ga.compressTextureCoordinates = function(e) {
	return v.defined("textureCoordinates", e), 4096 * (4095 * e.x | 0) + (4095 * e.y | 0);
}, Ga.decompressTextureCoordinates = function(e, t) {
	v.defined("compressed", e), v.defined("result", t);
	const r = e / 4096, n = Math.floor(r);
	return t.x = n / 4095, t.y = (e - 4096 * n) / 4095, t;
}, Ga.zigZagDeltaDecode = function(e, t, r) {
	v.defined("uBuffer", e), v.defined("vBuffer", t), v.typeOf.number.equals("uBuffer.length", "vBuffer.length", e.length, t.length), C(r) && v.typeOf.number.equals("uBuffer.length", "heightBuffer.length", e.length, r.length);
	const n = e.length;
	let i = 0, o = 0, a = 0;
	for (let s = 0; s < n; ++s) i += Ya(e[s]), o += Ya(t[s]), e[s] = i, t[s] = o, C(r) && (a += Ya(r[s]), r[s] = a);
}, Ga.dequantize = function(e, t, r, n) {
	v.defined("typedArray", e), v.defined("componentDatatype", t), v.defined("type", r), v.defined("count", n);
	const i = ja.getNumberOfComponents(r);
	let o;
	switch (t) {
		case wo.BYTE:
			o = 127;
			break;
		case wo.UNSIGNED_BYTE:
			o = 255;
			break;
		case wo.SHORT:
			o = 32767;
			break;
		case wo.UNSIGNED_SHORT:
			o = 65535;
			break;
		case wo.INT:
			o = 2147483647;
			break;
		case wo.UNSIGNED_INT:
			o = 4294967295;
			break;
		default: throw new N(`Cannot dequantize component datatype: ${t}`);
	}
	const a = new Float32Array(n * i);
	for (let s = 0; s < n; s++) for (let t = 0; t < i; t++) {
		const r = s * i + t;
		a[r] = Math.max(e[r] / o, -1);
	}
	return a;
}, Ga.encodeRGB8 = function(e) {
	return v.typeOf.object("color", e), 65536 * Math.round(L.clamp(255 * e.red, 0, 255)) + 256 * Math.round(L.clamp(255 * e.green, 0, 255)) + Math.round(L.clamp(255 * e.blue, 0, 255));
}, Ga.decodeRGB8 = function(e, t) {
	return v.typeOf.number("encoded", e), v.typeOf.object("result", t), e = Math.floor(e), t.red = (e >> 16 & 255) / 255, t.green = (e >> 8 & 255) / 255, t.blue = (255 & e) / 255, t;
}, Ga.decodeRGB565 = function(e, t) {
	v.defined("typedArray", e);
	const r = 3 * e.length;
	C(t) && v.typeOf.number.equals("result.length", "typedArray.length * 3", t.length, r);
	const n = e.length;
	C(t) || (t = new Float32Array(3 * n));
	const i = 1 / 31, o = 1 / 63;
	for (let a = 0; a < n; a++) {
		const r = e[a], n = r >> 11, s = r >> 5 & 63, u = 31 & r, c = 3 * a;
		t[c] = n * i, t[c + 1] = s * o, t[c + 2] = u * i;
	}
	return t;
};
const Xa = new z(), $a = new z(), Ka = new z();
function Za() {
	this.high = z.clone(z.ZERO), this.low = z.clone(z.ZERO);
}
Za.encode = function(e, t) {
	let r;
	return v.typeOf.number("value", e), C(t) || (t = {
		high: 0,
		low: 0
	}), e >= 0 ? (r = 65536 * Math.floor(e / 65536), t.high = r, t.low = e - r) : (r = 65536 * Math.floor(-e / 65536), t.high = -r, t.low = e + r), t;
};
const Qa = {
	high: 0,
	low: 0
};
Za.fromCartesian = function(e, t) {
	v.typeOf.object("cartesian", e), C(t) || (t = new Za());
	const r = t.high, n = t.low;
	return Za.encode(e.x, Qa), r.x = Qa.high, n.x = Qa.low, Za.encode(e.y, Qa), r.y = Qa.high, n.y = Qa.low, Za.encode(e.z, Qa), r.z = Qa.high, n.z = Qa.low, t;
};
const Ja = new Za();
Za.writeElements = function(e, t, r) {
	v.defined("cartesianArray", t), v.typeOf.number("index", r), v.typeOf.number.greaterThanOrEquals("index", r, 0), Za.fromCartesian(e, Ja);
	const n = Ja.high, i = Ja.low;
	t[r] = n.x, t[r + 1] = n.y, t[r + 2] = n.z, t[r + 3] = i.x, t[r + 4] = i.y, t[r + 5] = i.z;
};
const es = {};
function ts(e, t, r) {
	const n = e + t;
	return L.sign(e) !== L.sign(t) && Math.abs(n / Math.max(Math.abs(e), Math.abs(t))) < r ? 0 : n;
}
es.computeDiscriminant = function(e, t, r) {
	if ("number" != typeof e) throw new N("a is a required number.");
	if ("number" != typeof t) throw new N("b is a required number.");
	if ("number" != typeof r) throw new N("c is a required number.");
	return t * t - 4 * e * r;
}, es.computeRealRoots = function(e, t, r) {
	if ("number" != typeof e) throw new N("a is a required number.");
	if ("number" != typeof t) throw new N("b is a required number.");
	if ("number" != typeof r) throw new N("c is a required number.");
	let n;
	if (0 === e) return 0 === t ? [] : [-r / t];
	if (0 === t) {
		if (0 === r) return [0, 0];
		const t = Math.abs(r), i = Math.abs(e);
		if (t < i && t / i < L.EPSILON14) return [0, 0];
		if (t > i && i / t < L.EPSILON14) return [];
		if (n = -r / e, n < 0) return [];
		const o = Math.sqrt(n);
		return [-o, o];
	}
	if (0 === r) return n = -t / e, n < 0 ? [n, 0] : [0, n];
	const i = ts(t * t, -4 * e * r, L.EPSILON14);
	if (i < 0) return [];
	const o = -.5 * ts(t, L.sign(t) * Math.sqrt(i), L.EPSILON14);
	return t > 0 ? [o / e, r / o] : [r / o, o / e];
};
const rs = {};
function ns(e, t, r, n) {
	const i = e, o = t / 3, a = r / 3, s = n, u = i * a, c = o * s, l = o * o, f = a * a, h = i * a - l, p = i * s - o * a, m = o * s - f, d = 4 * h * m - p * p;
	let y, _;
	if (d < 0) {
		let e, t, r;
		l * c >= u * f ? (e = i, t = h, r = -2 * o * h + i * p) : (e = s, t = m, r = -s * p + 2 * a * m);
		const n = -(r < 0 ? -1 : 1) * Math.abs(e) * Math.sqrt(-d);
		_ = -r + n;
		const g = _ / 2, E = g < 0 ? -Math.pow(-g, 1 / 3) : Math.pow(g, 1 / 3), b = _ === n ? -E : -t / E;
		return y = t <= 0 ? E + b : -r / (E * E + b * b + t), l * c >= u * f ? [(y - o) / i] : [-s / (y + a)];
	}
	const g = h, E = -2 * o * h + i * p, b = m, w = -s * p + 2 * a * m, T = Math.sqrt(d), O = Math.sqrt(3) / 2;
	let A = Math.abs(Math.atan2(i * T, -E) / 3);
	y = 2 * Math.sqrt(-g);
	let x = Math.cos(A);
	_ = y * x;
	let R = y * (-x / 2 - O * Math.sin(A));
	const S = _ + R > 2 * o ? _ - o : R - o, I = i, C = S / I;
	A = Math.abs(Math.atan2(s * T, -w) / 3), y = 2 * Math.sqrt(-b), x = Math.cos(A), _ = y * x, R = y * (-x / 2 - O * Math.sin(A));
	const N = -s, v = _ + R < 2 * a ? _ + a : R + a, P = N / v, M = -S * v - I * N, L = (a * M - o * (S * N)) / (-o * M + a * (I * v));
	return C <= L ? C <= P ? L <= P ? [
		C,
		L,
		P
	] : [
		C,
		P,
		L
	] : [
		P,
		C,
		L
	] : C <= P ? [
		L,
		C,
		P
	] : L <= P ? [
		L,
		P,
		C
	] : [
		P,
		L,
		C
	];
}
rs.computeDiscriminant = function(e, t, r, n) {
	if ("number" != typeof e) throw new N("a is a required number.");
	if ("number" != typeof t) throw new N("b is a required number.");
	if ("number" != typeof r) throw new N("c is a required number.");
	if ("number" != typeof n) throw new N("d is a required number.");
	const i = t * t, o = r * r;
	return 18 * e * t * r * n + i * o - e * e * 27 * (n * n) - 4 * (e * o * r + i * t * n);
}, rs.computeRealRoots = function(e, t, r, n) {
	if ("number" != typeof e) throw new N("a is a required number.");
	if ("number" != typeof t) throw new N("b is a required number.");
	if ("number" != typeof r) throw new N("c is a required number.");
	if ("number" != typeof n) throw new N("d is a required number.");
	let i, o;
	if (0 === e) return es.computeRealRoots(t, r, n);
	if (0 === t) {
		if (0 === r) {
			if (0 === n) return [
				0,
				0,
				0
			];
			o = -n / e;
			const t = o < 0 ? -Math.pow(-o, 1 / 3) : Math.pow(o, 1 / 3);
			return [
				t,
				t,
				t
			];
		}
		return 0 === n ? (i = es.computeRealRoots(e, 0, r), 0 === i.Length ? [0] : [
			i[0],
			0,
			i[1]
		]) : ns(e, 0, r, n);
	}
	return 0 === r ? 0 === n ? (o = -t / e, o < 0 ? [
		o,
		0,
		0
	] : [
		0,
		0,
		o
	]) : ns(e, t, 0, n) : 0 === n ? (i = es.computeRealRoots(e, t, r), 0 === i.length ? [0] : i[1] <= 0 ? [
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
	]) : ns(e, t, r, n);
};
const is = {};
is.computeDiscriminant = function(e, t, r, n, i) {
	if ("number" != typeof e) throw new N("a is a required number.");
	if ("number" != typeof t) throw new N("b is a required number.");
	if ("number" != typeof r) throw new N("c is a required number.");
	if ("number" != typeof n) throw new N("d is a required number.");
	if ("number" != typeof i) throw new N("e is a required number.");
	const o = e * e, a = t * t, s = a * t, u = r * r, c = u * r, l = n * n, f = l * n, h = i * i;
	return a * u * l - 4 * s * f - 4 * e * c * l + 18 * e * t * r * f - 27 * o * l * l + o * e * 256 * (h * i) + i * (18 * s * r * n - 4 * a * c + 16 * e * u * u - 80 * e * t * u * n - 6 * e * a * l + 144 * o * r * l) + h * (144 * e * a * r - 27 * a * a - 128 * o * u - 192 * o * t * n);
}, is.computeRealRoots = function(e, t, r, n, i) {
	if ("number" != typeof e) throw new N("a is a required number.");
	if ("number" != typeof t) throw new N("b is a required number.");
	if ("number" != typeof r) throw new N("c is a required number.");
	if ("number" != typeof n) throw new N("d is a required number.");
	if ("number" != typeof i) throw new N("e is a required number.");
	if (Math.abs(e) < L.EPSILON15) return rs.computeRealRoots(t, r, n, i);
	const o = t / e, a = r / e, s = n / e, u = i / e;
	let c = o < 0 ? 1 : 0;
	switch (c += a < 0 ? c + 1 : c, c += s < 0 ? c + 1 : c, c += u < 0 ? c + 1 : c, c) {
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
		case 15: return function(e, t, r, n) {
			const i = e * e, o = t - 3 * i / 8, a = r - t * e / 2 + i * e / 8, s = n - r * e / 4 + t * i / 16 - 3 * i * i / 256, u = rs.computeRealRoots(1, 2 * o, o * o - 4 * s, -a * a);
			if (u.length > 0) {
				const t = -e / 4, r = u[u.length - 1];
				if (Math.abs(r) < L.EPSILON14) {
					const e = es.computeRealRoots(1, o, s);
					if (2 === e.length) {
						const r = e[0], n = e[1];
						let i;
						if (r >= 0 && n >= 0) {
							const e = Math.sqrt(r), i = Math.sqrt(n);
							return [
								t - i,
								t - e,
								t + e,
								t + i
							];
						}
						if (r >= 0 && n < 0) return i = Math.sqrt(r), [t - i, t + i];
						if (r < 0 && n >= 0) return i = Math.sqrt(n), [t - i, t + i];
					}
					return [];
				}
				if (r > 0) {
					const e = Math.sqrt(r), n = (o + r - a / e) / 2, i = (o + r + a / e) / 2, s = es.computeRealRoots(1, e, n), u = es.computeRealRoots(1, -e, i);
					return 0 !== s.length ? (s[0] += t, s[1] += t, 0 !== u.length ? (u[0] += t, u[1] += t, s[1] <= u[0] ? [
						s[0],
						s[1],
						u[0],
						u[1]
					] : u[1] <= s[0] ? [
						u[0],
						u[1],
						s[0],
						s[1]
					] : s[0] >= u[0] && s[1] <= u[1] ? [
						u[0],
						s[0],
						s[1],
						u[1]
					] : u[0] >= s[0] && u[1] <= s[1] ? [
						s[0],
						u[0],
						u[1],
						s[1]
					] : s[0] > u[0] && s[0] < u[1] ? [
						u[0],
						s[0],
						u[1],
						s[1]
					] : [
						s[0],
						u[0],
						s[1],
						u[1]
					]) : s) : 0 !== u.length ? (u[0] += t, u[1] += t, u) : [];
				}
			}
			return [];
		}(o, a, s, u);
		case 1:
		case 2:
		case 5:
		case 8:
		case 11: return function(e, t, r, n) {
			const i = e * e, o = -2 * t, a = r * e + t * t - 4 * n, s = i * n - r * t * e + r * r, u = rs.computeRealRoots(1, o, a, s);
			if (u.length > 0) {
				const o = u[0], a = t - o, s = a * a, c = e / 2, l = a / 2, f = s - 4 * n, h = s + 4 * Math.abs(n), p = i - 4 * o, m = i + 4 * Math.abs(o);
				let d, y, _, g, E, b;
				if (o < 0 || f * m < p * h) {
					const t = Math.sqrt(p);
					d = t / 2, y = 0 === t ? 0 : (e * l - r) / t;
				} else {
					const t = Math.sqrt(f);
					d = 0 === t ? 0 : (e * l - r) / t, y = t / 2;
				}
				0 === c && 0 === d ? (_ = 0, g = 0) : L.sign(c) === L.sign(d) ? (_ = c + d, g = o / _) : (g = c - d, _ = o / g), 0 === l && 0 === y ? (E = 0, b = 0) : L.sign(l) === L.sign(y) ? (E = l + y, b = n / E) : (b = l - y, E = n / b);
				const w = es.computeRealRoots(1, _, E), T = es.computeRealRoots(1, g, b);
				if (0 !== w.length) return 0 !== T.length ? w[1] <= T[0] ? [
					w[0],
					w[1],
					T[0],
					T[1]
				] : T[1] <= w[0] ? [
					T[0],
					T[1],
					w[0],
					w[1]
				] : w[0] >= T[0] && w[1] <= T[1] ? [
					T[0],
					w[0],
					w[1],
					T[1]
				] : T[0] >= w[0] && T[1] <= w[1] ? [
					w[0],
					T[0],
					T[1],
					w[1]
				] : w[0] > T[0] && w[0] < T[1] ? [
					T[0],
					w[0],
					T[1],
					w[1]
				] : [
					w[0],
					T[0],
					w[1],
					T[1]
				] : w;
				if (0 !== T.length) return T;
			}
			return [];
		}(o, a, s, u);
		default: return;
	}
};
var os = class e {
	constructor(e, t) {
		t = z.clone(t ?? z.ZERO), z.equals(t, z.ZERO) || z.normalize(t, t), this.origin = z.clone(e ?? z.ZERO), this.direction = t;
	}
	static clone(t, r) {
		if (C(t)) return C(r) ? (r.origin = z.clone(t.origin), r.direction = z.clone(t.direction), r) : new e(t.origin, t.direction);
	}
	static getPoint(e, t, r) {
		return v.typeOf.object("ray", e), v.typeOf.number("t", t), C(r) || (r = new z()), r = z.multiplyByScalar(e.direction, t, r), z.add(e.origin, r, r);
	}
};
const as = { rayPlane: function(e, t, r) {
	if (!C(e)) throw new N("ray is required.");
	if (!C(t)) throw new N("plane is required.");
	C(r) || (r = new z());
	const n = e.origin, i = e.direction, o = t.normal, a = z.dot(o, i);
	if (Math.abs(a) < L.EPSILON15) return;
	const s = (-t.distance - z.dot(o, n)) / a;
	return s < 0 ? void 0 : (r = z.multiplyByScalar(i, s, r), z.add(n, r, r));
} }, ss = new z(), us = new z(), cs = new z(), ls = new z(), fs = new z();
as.rayTriangleParametric = function(e, t, r, n, i) {
	if (!C(e)) throw new N("ray is required.");
	if (!C(t)) throw new N("p0 is required.");
	if (!C(r)) throw new N("p1 is required.");
	if (!C(n)) throw new N("p2 is required.");
	i = i ?? !1;
	const o = e.origin, a = e.direction, s = z.subtract(r, t, ss), u = z.subtract(n, t, us), c = z.cross(a, u, cs), l = z.dot(s, c);
	let f, h, p, m, d;
	if (i) {
		if (l < L.EPSILON6) return;
		if (f = z.subtract(o, t, ls), p = z.dot(f, c), p < 0 || p > l) return;
		if (h = z.cross(f, s, fs), m = z.dot(a, h), m < 0 || p + m > l) return;
		d = z.dot(u, h) / l;
	} else {
		if (Math.abs(l) < L.EPSILON6) return;
		const e = 1 / l;
		if (f = z.subtract(o, t, ls), p = z.dot(f, c) * e, p < 0 || p > 1) return;
		if (h = z.cross(f, s, fs), m = z.dot(a, h) * e, m < 0 || p + m > 1) return;
		d = z.dot(u, h) * e;
	}
	return d;
}, as.rayTriangle = function(e, t, r, n, i, o) {
	const a = as.rayTriangleParametric(e, t, r, n, i);
	if (C(a) && !(a < 0)) return C(o) || (o = new z()), z.multiplyByScalar(e.direction, a, o), z.add(e.origin, o, o);
};
const hs = new os();
as.lineSegmentTriangle = function(e, t, r, n, i, o, a) {
	if (!C(e)) throw new N("v0 is required.");
	if (!C(t)) throw new N("v1 is required.");
	if (!C(r)) throw new N("p0 is required.");
	if (!C(n)) throw new N("p1 is required.");
	if (!C(i)) throw new N("p2 is required.");
	const s = hs;
	z.clone(e, s.origin), z.subtract(t, e, s.direction), z.normalize(s.direction, s.direction);
	const u = as.rayTriangleParametric(s, r, n, i, o);
	if (!(!C(u) || u < 0 || u > z.distance(e, t))) return C(a) || (a = new z()), z.multiplyByScalar(s.direction, u, a), z.add(s.origin, a, a);
};
const ps = {
	root0: 0,
	root1: 0
};
function ms(e, t, r) {
	C(r) || (r = new Vo());
	const n = e.origin, i = e.direction, o = t.center, a = t.radius * t.radius, s = z.subtract(n, o, cs), u = function(e, t, r, n) {
		const i = t * t - 4 * e * r;
		if (i < 0) return;
		if (i > 0) {
			const r = 1 / (2 * e), o = Math.sqrt(i), a = (-t + o) * r, s = (-t - o) * r;
			return a < s ? (n.root0 = a, n.root1 = s) : (n.root0 = s, n.root1 = a), n;
		}
		const o = -t / (2 * e);
		return 0 !== o ? (n.root0 = n.root1 = o, n) : void 0;
	}(z.dot(i, i), 2 * z.dot(i, s), z.magnitudeSquared(s) - a, ps);
	if (C(u)) return r.start = u.root0, r.stop = u.root1, r;
}
as.raySphere = function(e, t, r) {
	if (!C(e)) throw new N("ray is required.");
	if (!C(t)) throw new N("sphere is required.");
	if (C(r = ms(e, t, r)) && !(r.stop < 0)) return r.start = Math.max(r.start, 0), r;
};
const ds = new os();
as.lineSegmentSphere = function(e, t, r, n) {
	if (!C(e)) throw new N("p0 is required.");
	if (!C(t)) throw new N("p1 is required.");
	if (!C(r)) throw new N("sphere is required.");
	const i = ds;
	z.clone(e, i.origin);
	const o = z.subtract(t, e, i.direction), a = z.magnitude(o);
	if (z.normalize(o, o), !(!C(n = ms(i, r, n)) || n.stop < 0 || n.start > a)) return n.start = Math.max(n.start, 0), n.stop = Math.min(n.stop, a), n;
};
const ys = new z(), _s = new z();
as.rayEllipsoid = function(e, t) {
	if (!C(e)) throw new N("ray is required.");
	if (!C(t)) throw new N("ellipsoid is required.");
	const r = t.oneOverRadii, n = z.multiplyComponents(r, e.origin, ys), i = z.multiplyComponents(r, e.direction, _s), o = z.magnitudeSquared(n), a = z.dot(n, i);
	let s, u, c, l, f;
	if (o > 1) {
		if (a >= 0) return;
		const e = a * a;
		if (s = o - 1, u = z.magnitudeSquared(i), c = u * s, e < c) return;
		if (e > c) {
			l = a * a - c, f = -a + Math.sqrt(l);
			const e = f / u, t = s / f;
			return e < t ? new Vo(e, t) : {
				start: t,
				stop: e
			};
		}
		const t = Math.sqrt(s / u);
		return new Vo(t, t);
	}
	return o < 1 ? (s = o - 1, u = z.magnitudeSquared(i), c = u * s, l = a * a - c, f = -a + Math.sqrt(l), new Vo(0, f / u)) : a < 0 ? (u = z.magnitudeSquared(i), new Vo(0, -a / u)) : void 0;
};
const gs = new Vo(), Es = new Vo(), bs = new Vo();
function ws(e, t, r, n, i) {
	if (i.start = (r - e) / t, i.stop = (n - e) / t, i.stop < i.start) {
		const e = i.stop;
		i.stop = i.start, i.start = e;
	}
	return i;
}
function Ts(e, t, r) {
	const n = e + t;
	return L.sign(e) !== L.sign(t) && Math.abs(n / Math.max(Math.abs(e), Math.abs(t))) < r ? 0 : n;
}
as.rayAxisAlignedBoundingBox = function(e, t, r) {
	if (!C(e)) throw new N("ray is required.");
	if (!C(t)) throw new N("box is required.");
	C(r) || (r = new Vo());
	const n = ws(e.origin.x, e.direction.x, t.minimum.x, t.maximum.x, gs), i = ws(e.origin.y, e.direction.y, t.minimum.y, t.maximum.y, Es), o = ws(e.origin.z, e.direction.z, t.minimum.z, t.maximum.z, bs);
	if (r.start = n.start > i.start ? n.start : i.start, r.stop = n.stop < i.stop ? n.stop : i.stop, !(n.start > i.stop || i.start > n.stop || r.start > o.stop || o.start > r.stop)) return o.start > r.start && (r.start = o.start), o.stop < r.stop && (r.stop = o.stop), r;
}, as.quadraticVectorExpression = function(e, t, r, n, i) {
	const o = n * n, a = i * i, s = (e[ee.COLUMN1ROW1] - e[ee.COLUMN2ROW2]) * a, u = i * (n * Ts(e[ee.COLUMN1ROW0], e[ee.COLUMN0ROW1], L.EPSILON15) + t.y), c = e[ee.COLUMN0ROW0] * o + e[ee.COLUMN2ROW2] * a + n * t.x + r, l = a * Ts(e[ee.COLUMN2ROW1], e[ee.COLUMN1ROW2], L.EPSILON15), f = i * (n * Ts(e[ee.COLUMN2ROW0], e[ee.COLUMN0ROW2]) + t.z);
	let h;
	const p = [];
	if (0 === f && 0 === l) {
		if (h = es.computeRealRoots(s, u, c), 0 === h.length) return p;
		const e = h[0], t = Math.sqrt(Math.max(1 - e * e, 0));
		if (p.push(new z(n, i * e, i * -t)), p.push(new z(n, i * e, i * t)), 2 === h.length) {
			const e = h[1], t = Math.sqrt(Math.max(1 - e * e, 0));
			p.push(new z(n, i * e, i * -t)), p.push(new z(n, i * e, i * t));
		}
		return p;
	}
	const m = f * f, d = l * l, y = f * l, _ = s * s + d, g = 2 * (u * s + y), E = 2 * c * s + u * u - d + m, b = 2 * (c * u - y), w = c * c - m;
	if (0 === _ && 0 === g && 0 === E && 0 === b) return p;
	h = is.computeRealRoots(_, g, E, b, w);
	const T = h.length;
	if (0 === T) return p;
	for (let O = 0; O < T; ++O) {
		const e = h[O], t = e * e, r = Math.max(1 - t, 0), o = Math.sqrt(r);
		let a;
		a = L.sign(s) === L.sign(c) ? Ts(s * t + c, u * e, L.EPSILON12) : L.sign(c) === L.sign(u * e) ? Ts(s * t, u * e + c, L.EPSILON12) : Ts(s * t + u * e, c, L.EPSILON12);
		const m = a * Ts(l * e, f, L.EPSILON15);
		m < 0 ? p.push(new z(n, i * e, i * o)) : m > 0 ? p.push(new z(n, i * e, i * -o)) : 0 !== o ? (p.push(new z(n, i * e, i * -o)), p.push(new z(n, i * e, i * o)), ++O) : p.push(new z(n, i * e, i * o));
	}
	return p;
};
const Os = new z(), As = new z(), xs = new z(), Rs = new z(), Ss = new z(), Is = new ee(), Cs = new ee(), Ns = new ee(), vs = new ee(), Ps = new ee(), Ms = new ee(), Ls = new ee(), Fs = new z(), Ds = new z(), zs = new Nt();
as.grazingAltitudeLocation = function(e, t) {
	if (!C(e)) throw new N("ray is required.");
	if (!C(t)) throw new N("ellipsoid is required.");
	const r = e.origin, n = e.direction;
	if (!z.equals(r, z.ZERO)) {
		const e = t.geodeticSurfaceNormal(r, Os);
		if (z.dot(n, e) >= 0) return r;
	}
	const i = C(this.rayEllipsoid(e, t)), o = t.transformPositionToScaledSpace(n, Os), a = z.normalize(o, o), s = z.mostOrthogonalAxis(o, Rs), u = z.normalize(z.cross(s, a, As), As), c = z.normalize(z.cross(a, u, xs), xs), l = Is;
	l[0] = a.x, l[1] = a.y, l[2] = a.z, l[3] = u.x, l[4] = u.y, l[5] = u.z, l[6] = c.x, l[7] = c.y, l[8] = c.z;
	const f = ee.transpose(l, Cs), h = ee.fromScale(t.radii, Ns), p = ee.fromScale(t.oneOverRadii, vs), m = Ps;
	m[0] = 0, m[1] = -n.z, m[2] = n.y, m[3] = n.z, m[4] = 0, m[5] = -n.x, m[6] = -n.y, m[7] = n.x, m[8] = 0;
	const d = ee.multiply(ee.multiply(f, p, Ms), m, Ms), y = ee.multiply(ee.multiply(d, h, Ls), l, Ls), _ = ee.multiplyByVector(d, r, Ss), g = as.quadraticVectorExpression(y, z.negate(_, Os), 0, 0, 1);
	let E, b;
	const w = g.length;
	if (w > 0) {
		let e = z.clone(z.ZERO, Ds), o = Number.NEGATIVE_INFINITY;
		for (let t = 0; t < w; ++t) {
			E = ee.multiplyByVector(h, ee.multiplyByVector(l, g[t], Fs), Fs);
			const i = z.normalize(z.subtract(E, r, Rs), Rs), a = z.dot(i, n);
			a > o && (o = a, e = z.clone(E, e));
		}
		const a = t.cartesianToCartographic(e, zs);
		return o = L.clamp(o, 0, 1), b = z.magnitude(z.subtract(e, r, Rs)) * Math.sqrt(1 - o * o), b = i ? -b : b, a.height = b, t.cartographicToCartesian(a, new z());
	}
};
const Bs = new z();
function Us(e, t) {
	if (v.typeOf.object("normal", e), !L.equalsEpsilon(z.magnitude(e), 1, L.EPSILON6)) throw new N("normal must be normalized.");
	v.typeOf.number("distance", t), this.normal = z.clone(e), this.distance = t;
}
as.lineSegmentPlane = function(e, t, r, n) {
	if (!C(e)) throw new N("endPoint0 is required.");
	if (!C(t)) throw new N("endPoint1 is required.");
	if (!C(r)) throw new N("plane is required.");
	C(n) || (n = new z());
	const i = z.subtract(t, e, Bs), o = r.normal, a = z.dot(o, i);
	if (Math.abs(a) < L.EPSILON6) return;
	const s = z.dot(o, e), u = -(r.distance + s) / a;
	return u < 0 || u > 1 ? void 0 : (z.multiplyByScalar(i, u, n), z.add(e, n, n), n);
}, as.trianglePlaneIntersection = function(e, t, r, n) {
	if (!(C(e) && C(t) && C(r) && C(n))) throw new N("p0, p1, p2, and plane are required.");
	const i = n.normal, o = n.distance, a = z.dot(i, e) + o < 0, s = z.dot(i, t) + o < 0, u = z.dot(i, r) + o < 0;
	let c, l, f = 0;
	if (f += a ? 1 : 0, f += s ? 1 : 0, f += u ? 1 : 0, 1 !== f && 2 !== f || (c = new z(), l = new z()), 1 === f) {
		if (a) return as.lineSegmentPlane(e, t, n, c), as.lineSegmentPlane(e, r, n, l), {
			positions: [
				e,
				t,
				r,
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
		if (s) return as.lineSegmentPlane(t, r, n, c), as.lineSegmentPlane(t, e, n, l), {
			positions: [
				e,
				t,
				r,
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
		if (u) return as.lineSegmentPlane(r, e, n, c), as.lineSegmentPlane(r, t, n, l), {
			positions: [
				e,
				t,
				r,
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
	} else if (2 === f) {
		if (!a) return as.lineSegmentPlane(t, e, n, c), as.lineSegmentPlane(r, e, n, l), {
			positions: [
				e,
				t,
				r,
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
		if (!s) return as.lineSegmentPlane(r, t, n, c), as.lineSegmentPlane(e, t, n, l), {
			positions: [
				e,
				t,
				r,
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
		if (!u) return as.lineSegmentPlane(e, r, n, c), as.lineSegmentPlane(t, r, n, l), {
			positions: [
				e,
				t,
				r,
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
}, Us.fromPointNormal = function(e, t, r) {
	if (v.typeOf.object("point", e), v.typeOf.object("normal", t), !L.equalsEpsilon(z.magnitude(t), 1, L.EPSILON6)) throw new N("normal must be normalized.");
	const n = -z.dot(t, e);
	return C(r) ? (z.clone(t, r.normal), r.distance = n, r) : new Us(t, n);
};
const js = new z();
Us.fromCartesian4 = function(e, t) {
	v.typeOf.object("coefficients", e);
	const r = z.fromCartesian4(e, js), n = e.w;
	if (!L.equalsEpsilon(z.magnitude(r), 1, L.EPSILON6)) throw new N("normal must be normalized.");
	return C(t) ? (z.clone(r, t.normal), t.distance = n, t) : new Us(r, n);
}, Us.getPointDistance = function(e, t) {
	return v.typeOf.object("plane", e), v.typeOf.object("point", t), z.dot(e.normal, t) + e.distance;
};
const qs = new z();
Us.projectPointOntoPlane = function(e, t, r) {
	v.typeOf.object("plane", e), v.typeOf.object("point", t), C(r) || (r = new z());
	const n = Us.getPointDistance(e, t), i = z.multiplyByScalar(e.normal, n, qs);
	return z.subtract(t, i, r);
};
const Gs = new de(), ks = new V(), Ws = new z();
Us.transform = function(e, t, r) {
	v.typeOf.object("plane", e), v.typeOf.object("transform", t);
	const n = e.normal, i = e.distance, o = de.inverseTranspose(t, Gs);
	let a = V.fromElements(n.x, n.y, n.z, i, ks);
	a = de.multiplyByVector(o, a, a);
	const s = z.fromCartesian4(a, Ws);
	return a = V.divideByScalar(a, z.magnitude(s), a), Us.fromCartesian4(a, r);
}, Us.clone = function(e, t) {
	return v.typeOf.object("plane", e), C(t) ? (z.clone(e.normal, t.normal), t.distance = e.distance, t) : new Us(e.normal, e.distance);
}, Us.equals = function(e, t) {
	return v.typeOf.object("left", e), v.typeOf.object("right", t), e.distance === t.distance && z.equals(e.normal, t.normal);
}, Us.ORIGIN_XY_PLANE = Object.freeze(new Us(z.UNIT_Z, 0)), Us.ORIGIN_YZ_PLANE = Object.freeze(new Us(z.UNIT_X, 0)), Us.ORIGIN_ZX_PLANE = Object.freeze(new Us(z.UNIT_Y, 0));
const Vs = {
	calculateACMR: function(e) {
		const t = (e = e ?? J.EMPTY_OBJECT).indices;
		let r = e.maximumIndex;
		const n = e.cacheSize ?? 24;
		if (!C(t)) throw new N("indices is required.");
		const i = t.length;
		if (i < 3 || i % 3 != 0) throw new N("indices length must be a multiple of three.");
		if (r <= 0) throw new N("maximumIndex must be greater than zero.");
		if (n < 3) throw new N("cacheSize must be greater than two.");
		if (!C(r)) {
			r = 0;
			let e = 0, n = t[e];
			for (; e < i;) n > r && (r = n), ++e, n = t[e];
		}
		const o = [];
		for (let s = 0; s < r + 1; s++) o[s] = 0;
		let a = n + 1;
		for (let s = 0; s < i; ++s) a - o[t[s]] > n && (o[t[s]] = a, ++a);
		return (a - n + 1) / (i / 3);
	},
	tipsify: function(e) {
		const t = (e = e ?? J.EMPTY_OBJECT).indices, r = e.maximumIndex, n = e.cacheSize ?? 24;
		let i;
		function o(e, t, r, n, o, a, s) {
			let u, c = -1, l = -1, f = 0;
			for (; f < r.length;) {
				const e = r[f];
				n[e].numLiveTriangles && (u = 0, o - n[e].timeStamp + 2 * n[e].numLiveTriangles <= t && (u = o - n[e].timeStamp), (u > l || -1 === l) && (l = u, c = e)), ++f;
			}
			return -1 === c ? function(e, t, r, n) {
				for (; t.length >= 1;) {
					const r = t[t.length - 1];
					if (t.splice(t.length - 1, 1), e[r].numLiveTriangles > 0) return r;
				}
				for (; i < n;) {
					if (e[i].numLiveTriangles > 0) return ++i, i - 1;
					++i;
				}
				return -1;
			}(n, a, 0, s) : c;
		}
		if (!C(t)) throw new N("indices is required.");
		const a = t.length;
		if (a < 3 || a % 3 != 0) throw new N("indices length must be a multiple of three.");
		if (r <= 0) throw new N("maximumIndex must be greater than zero.");
		if (n < 3) throw new N("cacheSize must be greater than two.");
		let s = 0, u = 0, c = t[u];
		const l = a;
		if (C(r)) s = r + 1;
		else {
			for (; u < l;) c > s && (s = c), ++u, c = t[u];
			if (-1 === s) return 0;
			++s;
		}
		const f = [];
		let h;
		for (h = 0; h < s; h++) f[h] = {
			numLiveTriangles: 0,
			timeStamp: 0,
			vertexTriangles: []
		};
		u = 0;
		let p = 0;
		for (; u < l;) f[t[u]].vertexTriangles.push(p), ++f[t[u]].numLiveTriangles, f[t[u + 1]].vertexTriangles.push(p), ++f[t[u + 1]].numLiveTriangles, f[t[u + 2]].vertexTriangles.push(p), ++f[t[u + 2]].numLiveTriangles, ++p, u += 3;
		let m = 0, d = n + 1;
		i = 1;
		let y = [];
		const _ = [];
		let g, E, b = 0;
		const w = [], T = a / 3, O = [];
		for (h = 0; h < T; h++) O[h] = !1;
		let A, x;
		for (; -1 !== m;) {
			y = [], E = f[m], x = E.vertexTriangles.length;
			for (let e = 0; e < x; ++e) if (p = E.vertexTriangles[e], !O[p]) {
				O[p] = !0, u = p + p + p;
				for (let e = 0; e < 3; ++e) A = t[u], y.push(A), _.push(A), w[b] = A, ++b, g = f[A], --g.numLiveTriangles, d - g.timeStamp > n && (g.timeStamp = d, ++d), ++u;
			}
			m = o(0, n, y, f, d, _, s);
		}
		return w;
	}
}, Hs = {};
function Ys(e, t, r, n, i) {
	e[t++] = r, e[t++] = n, e[t++] = n, e[t++] = i, e[t++] = i, e[t] = r;
}
function Xs(e) {
	const t = {};
	for (const r in e) if (e.hasOwnProperty(r) && C(e[r]) && C(e[r].values)) {
		const n = e[r];
		t[r] = new Lo({
			componentDatatype: n.componentDatatype,
			componentsPerAttribute: n.componentsPerAttribute,
			normalize: n.normalize,
			values: []
		});
	}
	return t;
}
function $s(e, t, r) {
	for (const n in t) if (t.hasOwnProperty(n) && C(t[n]) && C(t[n].values)) {
		const i = t[n];
		for (let t = 0; t < i.componentsPerAttribute; ++t) e[n].values.push(i.values[r * i.componentsPerAttribute + t]);
	}
}
Hs.toWireframe = function(e) {
	if (!C(e)) throw new N("geometry is required.");
	const t = e.indices;
	if (C(t)) {
		switch (e.primitiveType) {
			case ao.TRIANGLES:
				e.indices = function(e) {
					const t = e.length, r = t / 3 * 6, n = Le.createTypedArray(t, r);
					let i = 0;
					for (let o = 0; o < t; o += 3, i += 6) Ys(n, i, e[o], e[o + 1], e[o + 2]);
					return n;
				}(t);
				break;
			case ao.TRIANGLE_STRIP:
				e.indices = function(e) {
					const t = e.length;
					if (t >= 3) {
						const r = 6 * (t - 2), n = Le.createTypedArray(t, r);
						Ys(n, 0, e[0], e[1], e[2]);
						let i = 6;
						for (let o = 3; o < t; ++o, i += 6) Ys(n, i, e[o - 1], e[o], e[o - 2]);
						return n;
					}
					return new Uint16Array();
				}(t);
				break;
			case ao.TRIANGLE_FAN:
				e.indices = function(e) {
					if (e.length > 0) {
						const t = e.length - 1, r = 6 * (t - 1), n = Le.createTypedArray(t, r), i = e[0];
						let o = 0;
						for (let a = 1; a < t; ++a, o += 6) Ys(n, o, i, e[a], e[a + 1]);
						return n;
					}
					return new Uint16Array();
				}(t);
				break;
			default: throw new N("geometry.primitiveType must be TRIANGLES, TRIANGLE_STRIP, or TRIANGLE_FAN.");
		}
		e.primitiveType = ao.LINES;
	}
	return e;
}, Hs.createLineSegmentsForVectors = function(e, t, r) {
	if (t = t ?? "normal", !C(e)) throw new N("geometry is required.");
	if (!C(e.attributes.position)) throw new N("geometry.attributes.position is required.");
	if (!C(e.attributes[t])) throw new N(`geometry.attributes must have an attribute with the same name as the attributeName parameter, ${t}.`);
	r = r ?? 1e4;
	const n = e.attributes.position.values, i = e.attributes[t].values, o = n.length, a = new Float64Array(2 * o);
	let s, u = 0;
	for (let l = 0; l < o; l += 3) a[u++] = n[l], a[u++] = n[l + 1], a[u++] = n[l + 2], a[u++] = n[l] + i[l] * r, a[u++] = n[l + 1] + i[l + 1] * r, a[u++] = n[l + 2] + i[l + 2] * r;
	const c = e.boundingSphere;
	return C(c) && (s = new Ho(c.center, c.radius + r)), new Oo({
		attributes: { position: new Lo({
			componentDatatype: wo.DOUBLE,
			componentsPerAttribute: 3,
			values: a
		}) },
		primitiveType: ao.LINES,
		boundingSphere: s
	});
}, Hs.createAttributeLocations = function(e) {
	if (!C(e)) throw new N("geometry is required.");
	const t = [
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
	], r = e.attributes, n = {};
	let i, o = 0;
	const a = t.length;
	for (i = 0; i < a; ++i) {
		const e = t[i];
		C(r[e]) && (n[e] = o++);
	}
	for (const s in r) r.hasOwnProperty(s) && !C(n[s]) && (n[s] = o++);
	return n;
}, Hs.reorderForPreVertexCache = function(e) {
	if (!C(e)) throw new N("geometry is required.");
	const t = Oo.computeNumberOfVertices(e), r = e.indices;
	if (C(r)) {
		const n = new Int32Array(t);
		for (let e = 0; e < t; e++) n[e] = -1;
		const i = r, o = i.length, a = Le.createTypedArray(t, o);
		let s, u = 0, c = 0, l = 0;
		for (; u < o;) s = n[i[u]], -1 !== s ? a[c] = s : (s = i[u], n[s] = l, a[c] = l, ++l), ++u, ++c;
		e.indices = a;
		const f = e.attributes;
		for (const e in f) if (f.hasOwnProperty(e) && C(f[e]) && C(f[e].values)) {
			const r = f[e], i = r.values;
			let o = 0;
			const a = r.componentsPerAttribute, s = wo.createTypedArray(r.componentDatatype, l * a);
			for (; o < t;) {
				const e = n[o];
				if (-1 !== e) for (let t = 0; t < a; t++) s[a * e + t] = i[a * o + t];
				++o;
			}
			r.values = s;
		}
	}
	return e;
}, Hs.reorderForPostVertexCache = function(e, t) {
	if (!C(e)) throw new N("geometry is required.");
	const r = e.indices;
	if (e.primitiveType === ao.TRIANGLES && C(r)) {
		const n = r.length;
		let i = 0;
		for (let e = 0; e < n; e++) r[e] > i && (i = r[e]);
		e.indices = Vs.tipsify({
			indices: r,
			maximumIndex: i,
			cacheSize: t
		});
	}
	return e;
}, Hs.fitToUnsignedShortIndices = function(e) {
	if (!C(e)) throw new N("geometry is required.");
	if (C(e.indices) && e.primitiveType !== ao.TRIANGLES && e.primitiveType !== ao.LINES && e.primitiveType !== ao.POINTS) throw new N("geometry.primitiveType must equal to PrimitiveType.TRIANGLES, PrimitiveType.LINES, or PrimitiveType.POINTS.");
	const t = [], r = Oo.computeNumberOfVertices(e);
	if (C(e.indices) && r >= L.SIXTY_FOUR_KILOBYTES) {
		let r = [], n = [], i = 0, o = Xs(e.attributes);
		const a = e.indices, s = a.length;
		let u;
		e.primitiveType === ao.TRIANGLES ? u = 3 : e.primitiveType === ao.LINES ? u = 2 : e.primitiveType === ao.POINTS && (u = 1);
		for (let c = 0; c < s; c += u) {
			for (let t = 0; t < u; ++t) {
				const s = a[c + t];
				let u = r[s];
				C(u) || (u = i++, r[s] = u, $s(o, e.attributes, s)), n.push(u);
			}
			i + u >= L.SIXTY_FOUR_KILOBYTES && (t.push(new Oo({
				attributes: o,
				indices: n,
				primitiveType: e.primitiveType,
				boundingSphere: e.boundingSphere,
				boundingSphereCV: e.boundingSphereCV
			})), r = [], n = [], i = 0, o = Xs(e.attributes));
		}
		0 !== n.length && t.push(new Oo({
			attributes: o,
			indices: n,
			primitiveType: e.primitiveType,
			boundingSphere: e.boundingSphere,
			boundingSphereCV: e.boundingSphereCV
		}));
	} else t.push(e);
	return t;
};
const Ks = new z(), Zs = new Nt();
Hs.projectTo2D = function(e, t, r, n, i) {
	if (!C(e)) throw new N("geometry is required.");
	if (!C(t)) throw new N("attributeName is required.");
	if (!C(r)) throw new N("attributeName3D is required.");
	if (!C(n)) throw new N("attributeName2D is required.");
	if (!C(e.attributes[t])) throw new N(`geometry must have attribute matching the attributeName argument: ${t}.`);
	if (e.attributes[t].componentDatatype !== wo.DOUBLE) throw new N("The attribute componentDatatype must be ComponentDatatype.DOUBLE.");
	const o = e.attributes[t], a = (i = C(i) ? i : new Vt()).ellipsoid, s = o.values, u = new Float64Array(s.length);
	let c = 0;
	for (let l = 0; l < s.length; l += 3) {
		const e = z.fromArray(s, l, Ks), t = a.cartesianToCartographic(e, Zs);
		if (!C(t)) throw new N(`Could not project point (${e.x}, ${e.y}, ${e.z}) to 2D.`);
		const r = i.project(t, Ks);
		u[c++] = r.x, u[c++] = r.y, u[c++] = r.z;
	}
	return e.attributes[r] = o, e.attributes[n] = new Lo({
		componentDatatype: wo.DOUBLE,
		componentsPerAttribute: 3,
		values: u
	}), delete e.attributes[t], e;
};
const Qs = {
	high: 0,
	low: 0
};
Hs.encodeAttribute = function(e, t, r, n) {
	if (!C(e)) throw new N("geometry is required.");
	if (!C(t)) throw new N("attributeName is required.");
	if (!C(r)) throw new N("attributeHighName is required.");
	if (!C(n)) throw new N("attributeLowName is required.");
	if (!C(e.attributes[t])) throw new N(`geometry must have attribute matching the attributeName argument: ${t}.`);
	if (e.attributes[t].componentDatatype !== wo.DOUBLE) throw new N("The attribute componentDatatype must be ComponentDatatype.DOUBLE.");
	const i = e.attributes[t], o = i.values, a = o.length, s = new Float32Array(a), u = new Float32Array(a);
	for (let l = 0; l < a; ++l) Za.encode(o[l], Qs), s[l] = Qs.high, u[l] = Qs.low;
	const c = i.componentsPerAttribute;
	return e.attributes[r] = new Lo({
		componentDatatype: wo.FLOAT,
		componentsPerAttribute: c,
		values: s
	}), e.attributes[n] = new Lo({
		componentDatatype: wo.FLOAT,
		componentsPerAttribute: c,
		values: u
	}), delete e.attributes[t], e;
};
let Js = new z();
function eu(e, t) {
	if (C(t)) {
		const r = t.values, n = r.length;
		for (let t = 0; t < n; t += 3) z.unpack(r, t, Js), de.multiplyByPoint(e, Js, Js), z.pack(Js, r, t);
	}
}
function tu(e, t) {
	if (C(t)) {
		const r = t.values, n = r.length;
		for (let t = 0; t < n; t += 3) z.unpack(r, t, Js), ee.multiplyByVector(e, Js, Js), Js = z.normalize(Js, Js), z.pack(Js, r, t);
	}
}
const ru = new de(), nu = new ee();
Hs.transformToWorldCoordinates = function(e) {
	if (!C(e)) throw new N("instance is required.");
	const t = e.modelMatrix;
	if (de.equals(t, de.IDENTITY)) return e;
	const r = e.geometry.attributes;
	eu(t, r.position), eu(t, r.prevPosition), eu(t, r.nextPosition), (C(r.normal) || C(r.tangent) || C(r.bitangent)) && (de.inverse(t, ru), de.transpose(ru, ru), de.getMatrix3(ru, nu), tu(nu, r.normal), tu(nu, r.tangent), tu(nu, r.bitangent));
	const n = e.geometry.boundingSphere;
	return C(n) && (e.geometry.boundingSphere = Ho.transform(n, t, n)), e.modelMatrix = de.clone(de.IDENTITY), e;
};
const iu = new z();
function ou(e, t) {
	const r = e.length;
	let n, i, o, a;
	const s = e[0].modelMatrix, u = C(e[0][t].indices), c = e[0][t].primitiveType;
	for (i = 1; i < r; ++i) {
		if (!de.equals(e[i].modelMatrix, s)) throw new N("All instances must have the same modelMatrix.");
		if (C(e[i][t].indices) !== u) throw new N("All instance geometries must have an indices or not have one.");
		if (e[i][t].primitiveType !== c) throw new N("All instance geometries must have the same primitiveType.");
	}
	const l = function(e, t) {
		const r = e.length, n = {}, i = e[0][t].attributes;
		let o;
		for (o in i) if (i.hasOwnProperty(o) && C(i[o]) && C(i[o].values)) {
			const a = i[o];
			let s = a.values.length, u = !0;
			for (let n = 1; n < r; ++n) {
				const r = e[n][t].attributes[o];
				if (!C(r) || a.componentDatatype !== r.componentDatatype || a.componentsPerAttribute !== r.componentsPerAttribute || a.normalize !== r.normalize) {
					u = !1;
					break;
				}
				s += r.values.length;
			}
			u && (n[o] = new Lo({
				componentDatatype: a.componentDatatype,
				componentsPerAttribute: a.componentsPerAttribute,
				normalize: a.normalize,
				values: wo.createTypedArray(a.componentDatatype, s)
			}));
		}
		return n;
	}(e, t);
	let f, h, p, m;
	for (n in l) if (l.hasOwnProperty(n)) for (f = l[n].values, a = 0, i = 0; i < r; ++i) for (h = e[i][t].attributes[n].values, p = h.length, o = 0; o < p; ++o) f[a++] = h[o];
	if (u) {
		let n = 0;
		for (i = 0; i < r; ++i) n += e[i][t].indices.length;
		const o = Oo.computeNumberOfVertices(new Oo({
			attributes: l,
			primitiveType: ao.POINTS
		})), s = Le.createTypedArray(o, n);
		let u = 0, c = 0;
		for (i = 0; i < r; ++i) {
			const r = e[i][t].indices, n = r.length;
			for (a = 0; a < n; ++a) s[u++] = c + r[a];
			c += Oo.computeNumberOfVertices(e[i][t]);
		}
		m = s;
	}
	let d, y = new z(), _ = 0;
	for (i = 0; i < r; ++i) {
		if (d = e[i][t].boundingSphere, !C(d)) {
			y = void 0;
			break;
		}
		z.add(d.center, y, y);
	}
	if (C(y)) for (z.divideByScalar(y, r, y), i = 0; i < r; ++i) {
		d = e[i][t].boundingSphere;
		const r = z.magnitude(z.subtract(d.center, y, iu)) + d.radius;
		r > _ && (_ = r);
	}
	return new Oo({
		attributes: l,
		indices: m,
		primitiveType: c,
		boundingSphere: C(y) ? new Ho(y, _) : void 0
	});
}
Hs.combineInstances = function(e) {
	if (!C(e) || e.length < 1) throw new N("instances is required and must have length greater than zero.");
	const t = [], r = [], n = e.length;
	for (let o = 0; o < n; ++o) {
		const n = e[o];
		C(n.geometry) ? t.push(n) : C(n.westHemisphereGeometry) && C(n.eastHemisphereGeometry) && r.push(n);
	}
	const i = [];
	return t.length > 0 && i.push(ou(t, "geometry")), r.length > 0 && (i.push(ou(r, "westHemisphereGeometry")), i.push(ou(r, "eastHemisphereGeometry"))), i;
};
const au = new z(), su = new z(), uu = new z(), cu = new z();
Hs.computeNormal = function(e) {
	if (!C(e)) throw new N("geometry is required.");
	if (!C(e.attributes.position) || !C(e.attributes.position.values)) throw new N("geometry.attributes.position.values is required.");
	if (!C(e.indices)) throw new N("geometry.indices is required.");
	if (e.indices.length < 2 || e.indices.length % 3 != 0) throw new N("geometry.indices length must be greater than 0 and be a multiple of 3.");
	if (e.primitiveType !== ao.TRIANGLES) throw new N("geometry.primitiveType must be PrimitiveType.TRIANGLES.");
	const t = e.indices, r = e.attributes, n = r.position.values, i = r.position.values.length / 3, o = t.length, a = new Array(i), s = new Array(o / 3), u = new Array(o);
	let c;
	for (c = 0; c < i; c++) a[c] = {
		indexOffset: 0,
		count: 0,
		currentCount: 0
	};
	let l = 0;
	for (c = 0; c < o; c += 3) {
		const e = t[c], r = t[c + 1], i = t[c + 2], o = 3 * e, u = 3 * r, f = 3 * i;
		su.x = n[o], su.y = n[o + 1], su.z = n[o + 2], uu.x = n[u], uu.y = n[u + 1], uu.z = n[u + 2], cu.x = n[f], cu.y = n[f + 1], cu.z = n[f + 2], a[e].count++, a[r].count++, a[i].count++, z.subtract(uu, su, uu), z.subtract(cu, su, cu), s[l] = z.cross(uu, cu, new z()), l++;
	}
	let f, h = 0;
	for (c = 0; c < i; c++) a[c].indexOffset += h, h += a[c].count;
	for (l = 0, c = 0; c < o; c += 3) {
		f = a[t[c]];
		let e = f.indexOffset + f.currentCount;
		u[e] = l, f.currentCount++, f = a[t[c + 1]], e = f.indexOffset + f.currentCount, u[e] = l, f.currentCount++, f = a[t[c + 2]], e = f.indexOffset + f.currentCount, u[e] = l, f.currentCount++, l++;
	}
	const p = new Float32Array(3 * i);
	for (c = 0; c < i; c++) {
		const e = 3 * c;
		if (f = a[c], z.clone(z.ZERO, au), f.count > 0) {
			for (l = 0; l < f.count; l++) z.add(au, s[u[f.indexOffset + l]], au);
			z.equalsEpsilon(z.ZERO, au, L.EPSILON10) && z.clone(s[u[f.indexOffset]], au);
		}
		z.equalsEpsilon(z.ZERO, au, L.EPSILON10) && (au.z = 1), z.normalize(au, au), p[e] = au.x, p[e + 1] = au.y, p[e + 2] = au.z;
	}
	return e.attributes.normal = new Lo({
		componentDatatype: wo.FLOAT,
		componentsPerAttribute: 3,
		values: p
	}), e;
};
const lu = new z(), fu = new z(), hu = new z();
Hs.computeTangentAndBitangent = function(e) {
	if (!C(e)) throw new N("geometry is required.");
	const t = e.attributes, r = e.indices;
	if (!C(t.position) || !C(t.position.values)) throw new N("geometry.attributes.position.values is required.");
	if (!C(t.normal) || !C(t.normal.values)) throw new N("geometry.attributes.normal.values is required.");
	if (!C(t.st) || !C(t.st.values)) throw new N("geometry.attributes.st.values is required.");
	if (!C(r)) throw new N("geometry.indices is required.");
	if (r.length < 2 || r.length % 3 != 0) throw new N("geometry.indices length must be greater than 0 and be a multiple of 3.");
	if (e.primitiveType !== ao.TRIANGLES) throw new N("geometry.primitiveType must be PrimitiveType.TRIANGLES.");
	const n = e.attributes.position.values, i = e.attributes.normal.values, o = e.attributes.st.values, a = e.attributes.position.values.length / 3, s = r.length, u = new Array(3 * a);
	let c, l, f, h;
	for (c = 0; c < u.length; c++) u[c] = 0;
	for (c = 0; c < s; c += 3) {
		const e = r[c], t = r[c + 1], i = r[c + 2];
		l = 3 * e, f = 3 * t, h = 3 * i;
		const a = 2 * e, s = 2 * t, p = 2 * i, m = n[l], d = n[l + 1], y = n[l + 2], _ = o[a], g = o[a + 1], E = o[s + 1] - g, b = o[p + 1] - g, w = 1 / ((o[s] - _) * b - (o[p] - _) * E), T = (b * (n[f] - m) - E * (n[h] - m)) * w, O = (b * (n[f + 1] - d) - E * (n[h + 1] - d)) * w, A = (b * (n[f + 2] - y) - E * (n[h + 2] - y)) * w;
		u[l] += T, u[l + 1] += O, u[l + 2] += A, u[f] += T, u[f + 1] += O, u[f + 2] += A, u[h] += T, u[h + 1] += O, u[h + 2] += A;
	}
	const p = new Float32Array(3 * a), m = new Float32Array(3 * a);
	for (c = 0; c < a; c++) {
		l = 3 * c, f = l + 1, h = l + 2;
		const e = z.fromArray(i, l, lu), t = z.fromArray(u, l, hu), r = z.dot(e, t);
		z.multiplyByScalar(e, r, fu), z.normalize(z.subtract(t, fu, t), t), p[l] = t.x, p[f] = t.y, p[h] = t.z, z.normalize(z.cross(e, t, t), t), m[l] = t.x, m[f] = t.y, m[h] = t.z;
	}
	return e.attributes.tangent = new Lo({
		componentDatatype: wo.FLOAT,
		componentsPerAttribute: 3,
		values: p
	}), e.attributes.bitangent = new Lo({
		componentDatatype: wo.FLOAT,
		componentsPerAttribute: 3,
		values: m
	}), e;
};
const pu = new wt(), mu = new z(), du = new z(), yu = new z();
let _u = new wt();
function gu(e, t) {
	Math.abs(e.y) < L.EPSILON6 && (e.y = t ? -L.EPSILON6 : L.EPSILON6);
}
Hs.compressVertices = function(e) {
	if (!C(e)) throw new N("geometry is required.");
	const t = e.attributes.extrudeDirection;
	let r, n;
	if (C(t)) {
		const i = t.values;
		n = i.length / 3;
		const o = new Float32Array(2 * n);
		let a = 0;
		for (r = 0; r < n; ++r) z.fromArray(i, 3 * r, mu), z.equals(mu, z.ZERO) ? a += 2 : (_u = Ga.octEncodeInRange(mu, 65535, _u), o[a++] = _u.x, o[a++] = _u.y);
		return e.attributes.compressedAttributes = new Lo({
			componentDatatype: wo.FLOAT,
			componentsPerAttribute: 2,
			values: o
		}), delete e.attributes.extrudeDirection, e;
	}
	const i = e.attributes.normal, o = e.attributes.st, a = C(i), s = C(o);
	if (!a && !s) return e;
	const u = e.attributes.tangent, c = e.attributes.bitangent, l = C(u), f = C(c);
	let h, p, m, d;
	a && (h = i.values), s && (p = o.values), l && (m = u.values), f && (d = c.values), n = (a ? h.length : p.length) / (a ? 3 : 2);
	let y = n, _ = s && a ? 2 : 1;
	_ += l || f ? 1 : 0, y *= _;
	const g = new Float32Array(y);
	let E = 0;
	for (r = 0; r < n; ++r) {
		s && (wt.fromArray(p, 2 * r, pu), g[E++] = Ga.compressTextureCoordinates(pu));
		const e = 3 * r;
		a && C(m) && C(d) ? (z.fromArray(h, e, mu), z.fromArray(m, e, du), z.fromArray(d, e, yu), Ga.octPack(mu, du, yu, pu), g[E++] = pu.x, g[E++] = pu.y) : (a && (z.fromArray(h, e, mu), g[E++] = Ga.octEncodeFloat(mu)), l && (z.fromArray(m, e, mu), g[E++] = Ga.octEncodeFloat(mu)), f && (z.fromArray(d, e, mu), g[E++] = Ga.octEncodeFloat(mu)));
	}
	return e.attributes.compressedAttributes = new Lo({
		componentDatatype: wo.FLOAT,
		componentsPerAttribute: _,
		values: g
	}), a && delete e.attributes.normal, s && delete e.attributes.st, f && delete e.attributes.bitangent, l && delete e.attributes.tangent, e;
};
const Eu = new z();
function bu(e, t, r, n) {
	z.add(e, z.multiplyByScalar(z.subtract(t, e, Eu), e.y / (e.y - t.y), Eu), r), z.clone(r, n), gu(r, !0), gu(n, !1);
}
const wu = new z(), Tu = new z(), Ou = new z(), Au = new z(), xu = {
	positions: new Array(7),
	indices: new Array(9)
};
function Ru(e, t, r) {
	if (e.x >= 0 || t.x >= 0 || r.x >= 0) return;
	(function(e, t, r) {
		if (0 !== e.y && 0 !== t.y && 0 !== r.y) return gu(e, e.y < 0), gu(t, t.y < 0), void gu(r, r.y < 0);
		const n = Math.abs(e.y), i = Math.abs(t.y), o = Math.abs(r.y);
		let a;
		a = n > i ? n > o ? L.sign(e.y) : L.sign(r.y) : i > o ? L.sign(t.y) : L.sign(r.y);
		const s = a < 0;
		gu(e, s), gu(t, s), gu(r, s);
	})(e, t, r);
	const n = e.y < 0, i = t.y < 0, o = r.y < 0;
	let a = 0;
	a += n ? 1 : 0, a += i ? 1 : 0, a += o ? 1 : 0;
	const s = xu.indices;
	1 === a ? (s[1] = 3, s[2] = 4, s[5] = 6, s[7] = 6, s[8] = 5, n ? (bu(e, t, wu, Ou), bu(e, r, Tu, Au), s[0] = 0, s[3] = 1, s[4] = 2, s[6] = 1) : i ? (bu(t, r, wu, Ou), bu(t, e, Tu, Au), s[0] = 1, s[3] = 2, s[4] = 0, s[6] = 2) : o && (bu(r, e, wu, Ou), bu(r, t, Tu, Au), s[0] = 2, s[3] = 0, s[4] = 1, s[6] = 0)) : 2 === a && (s[2] = 4, s[4] = 4, s[5] = 3, s[7] = 5, s[8] = 6, n ? i ? o || (bu(r, e, wu, Ou), bu(r, t, Tu, Au), s[0] = 0, s[1] = 1, s[3] = 0, s[6] = 2) : (bu(t, r, wu, Ou), bu(t, e, Tu, Au), s[0] = 2, s[1] = 0, s[3] = 2, s[6] = 1) : (bu(e, t, wu, Ou), bu(e, r, Tu, Au), s[0] = 1, s[1] = 2, s[3] = 1, s[6] = 0));
	const u = xu.positions;
	return u[0] = e, u[1] = t, u[2] = r, u.length = 3, 1 !== a && 2 !== a || (u[3] = wu, u[4] = Tu, u[5] = Ou, u[6] = Au, u.length = 7), xu;
}
function Su(e, t) {
	const r = e.attributes;
	if (0 === r.position.values.length) return;
	for (const i in r) if (r.hasOwnProperty(i) && C(r[i]) && C(r[i].values)) {
		const e = r[i];
		e.values = wo.createTypedArray(e.componentDatatype, e.values);
	}
	const n = Oo.computeNumberOfVertices(e);
	return e.indices = Le.createTypedArray(n, e.indices), t && (e.boundingSphere = Ho.fromVertices(r.position.values)), e;
}
function Iu(e) {
	const t = e.attributes, r = {};
	for (const n in t) if (t.hasOwnProperty(n) && C(t[n]) && C(t[n].values)) {
		const e = t[n];
		r[n] = new Lo({
			componentDatatype: e.componentDatatype,
			componentsPerAttribute: e.componentsPerAttribute,
			normalize: e.normalize,
			values: []
		});
	}
	return new Oo({
		attributes: r,
		indices: [],
		primitiveType: e.primitiveType
	});
}
function Cu(e, t, r) {
	const n = C(e.geometry.boundingSphere);
	t = Su(t, n), C(r = Su(r, n)) && !C(t) ? e.geometry = r : !C(r) && C(t) ? e.geometry = t : (e.westHemisphereGeometry = t, e.eastHemisphereGeometry = r, e.geometry = void 0);
}
function Nu(e, t) {
	const r = new e(), n = new e(), i = new e();
	return function(o, a, s, u, c, l, f, h) {
		const p = e.fromArray(c, o * t, r), m = e.fromArray(c, a * t, n), d = e.fromArray(c, s * t, i);
		e.multiplyByScalar(p, u.x, p), e.multiplyByScalar(m, u.y, m), e.multiplyByScalar(d, u.z, d);
		const y = e.add(p, m, p);
		e.add(y, d, y), h && e.normalize(y, y), e.pack(y, l, f * t);
	};
}
const vu = Nu(V, 4), Pu = Nu(z, 3), Mu = Nu(wt, 2), Lu = new z(), Fu = new z(), Du = new z(), zu = new z();
function Bu(e, t, r, n, i, o, a, s, u, c, l, f, h, p, m, d) {
	if (!(C(o) || C(a) || C(s) || C(u) || C(c) || 0 !== p)) return;
	const y = function(e, t, r, n, i) {
		let o, a, s, u, c, l, f, h;
		if (v.defined("point", e), v.defined("p0", t), v.defined("p1", r), v.defined("p2", n), C(i) || (i = new z()), C(t.z)) {
			if (z.equalsEpsilon(e, t, L.EPSILON14)) return z.clone(z.UNIT_X, i);
			if (z.equalsEpsilon(e, r, L.EPSILON14)) return z.clone(z.UNIT_Y, i);
			if (z.equalsEpsilon(e, n, L.EPSILON14)) return z.clone(z.UNIT_Z, i);
			o = z.subtract(r, t, Xa), a = z.subtract(n, t, $a), s = z.subtract(e, t, Ka), u = z.dot(o, o), c = z.dot(o, a), l = z.dot(o, s), f = z.dot(a, a), h = z.dot(a, s);
		} else {
			if (wt.equalsEpsilon(e, t, L.EPSILON14)) return z.clone(z.UNIT_X, i);
			if (wt.equalsEpsilon(e, r, L.EPSILON14)) return z.clone(z.UNIT_Y, i);
			if (wt.equalsEpsilon(e, n, L.EPSILON14)) return z.clone(z.UNIT_Z, i);
			o = wt.subtract(r, t, Xa), a = wt.subtract(n, t, $a), s = wt.subtract(e, t, Ka), u = wt.dot(o, o), c = wt.dot(o, a), l = wt.dot(o, s), f = wt.dot(a, a), h = wt.dot(a, s);
		}
		i.y = f * l - c * h, i.z = u * h - c * l;
		const p = u * f - c * c;
		if (0 !== p) return i.y /= p, i.z /= p, i.x = 1 - i.y - i.z, i;
	}(n, z.fromArray(i, 3 * e, Lu), z.fromArray(i, 3 * t, Fu), z.fromArray(i, 3 * r, Du), zu);
	if (C(y)) {
		if (C(o) && Pu(e, t, r, y, o, f.normal.values, d, !0), C(c)) {
			const n = z.fromArray(c, 3 * e, Lu), i = z.fromArray(c, 3 * t, Fu), o = z.fromArray(c, 3 * r, Du);
			let a;
			z.multiplyByScalar(n, y.x, n), z.multiplyByScalar(i, y.y, i), z.multiplyByScalar(o, y.z, o), z.equals(n, z.ZERO) && z.equals(i, z.ZERO) && z.equals(o, z.ZERO) ? (a = Lu, a.x = 0, a.y = 0, a.z = 0) : (a = z.add(n, i, n), z.add(a, o, a), z.normalize(a, a)), z.pack(a, f.extrudeDirection.values, 3 * d);
		}
		if (C(l) && function(e, t, r, n, i, o, a) {
			const s = i[e] * n.x, u = i[t] * n.y, c = i[r] * n.z;
			o[a] = s + u + c > L.EPSILON6 ? 1 : 0;
		}(e, t, r, y, l, f.applyOffset.values, d), C(a) && Pu(e, t, r, y, a, f.tangent.values, d, !0), C(s) && Pu(e, t, r, y, s, f.bitangent.values, d, !0), C(u) && Mu(e, t, r, y, u, f.st.values, d), p > 0) for (let n = 0; n < p; n++) {
			const i = h[n];
			Uu(e, t, r, y, d, m[i], f[i]);
		}
	}
}
function Uu(e, t, r, n, i, o, a) {
	const s = o.componentsPerAttribute, u = o.values, c = a.values;
	switch (s) {
		case 4:
			vu(e, t, r, n, u, c, i, !1);
			break;
		case 3:
			Pu(e, t, r, n, u, c, i, !1);
			break;
		case 2:
			Mu(e, t, r, n, u, c, i, !1);
			break;
		default: c[i] = u[e] * n.x + u[t] * n.y + u[r] * n.z;
	}
}
function ju(e, t, r, n, i, o) {
	const a = e.position.values.length / 3;
	if (-1 !== i) {
		const s = n[i], u = r[s];
		return -1 === u ? (r[s] = a, e.position.values.push(o.x, o.y, o.z), t.push(a), a) : (t.push(u), u);
	}
	return e.position.values.push(o.x, o.y, o.z), t.push(a), a;
}
const qu = {
	position: !0,
	normal: !0,
	bitangent: !0,
	tangent: !0,
	st: !0,
	extrudeDirection: !0,
	applyOffset: !0
};
function Gu(e) {
	const t = e.geometry, r = t.attributes, n = r.position.values, i = C(r.normal) ? r.normal.values : void 0, o = C(r.bitangent) ? r.bitangent.values : void 0, a = C(r.tangent) ? r.tangent.values : void 0, s = C(r.st) ? r.st.values : void 0, u = C(r.extrudeDirection) ? r.extrudeDirection.values : void 0, c = C(r.applyOffset) ? r.applyOffset.values : void 0, l = t.indices, f = [];
	for (const O in r) r.hasOwnProperty(O) && !qu[O] && C(r[O]) && f.push(O);
	const h = f.length, p = Iu(t), m = Iu(t);
	let d, y, _, g, E;
	const b = [];
	b.length = n.length / 3;
	const w = [];
	for (w.length = n.length / 3, E = 0; E < b.length; ++E) b[E] = -1, w[E] = -1;
	const T = l.length;
	for (E = 0; E < T; E += 3) {
		const e = l[E], t = l[E + 1], T = l[E + 2];
		let O = z.fromArray(n, 3 * e), A = z.fromArray(n, 3 * t), x = z.fromArray(n, 3 * T);
		const R = Ru(O, A, x);
		if (C(R) && R.positions.length > 3) {
			const O = R.positions, A = R.indices, x = A.length;
			for (let R = 0; R < x; ++R) {
				const x = A[R], S = O[x];
				S.y < 0 ? (d = m.attributes, y = m.indices, _ = b) : (d = p.attributes, y = p.indices, _ = w), g = ju(d, y, _, l, x < 3 ? E + x : -1, S), Bu(e, t, T, S, n, i, a, o, s, u, c, d, f, h, r, g);
			}
		} else C(R) && (O = R.positions[0], A = R.positions[1], x = R.positions[2]), O.y < 0 ? (d = m.attributes, y = m.indices, _ = b) : (d = p.attributes, y = p.indices, _ = w), g = ju(d, y, _, l, E, O), Bu(e, t, T, O, n, i, a, o, s, u, c, d, f, h, r, g), g = ju(d, y, _, l, E + 1, A), Bu(e, t, T, A, n, i, a, o, s, u, c, d, f, h, r, g), g = ju(d, y, _, l, E + 2, x), Bu(e, t, T, x, n, i, a, o, s, u, c, d, f, h, r, g);
	}
	Cu(e, m, p);
}
const ku = Us.fromPointNormal(z.ZERO, z.UNIT_Y), Wu = new z(), Vu = new z();
function Hu(e, t, r, n, i, o, a) {
	if (!C(a)) return;
	const s = z.fromArray(n, 3 * e, Lu);
	z.equalsEpsilon(s, r, L.EPSILON10) ? o.applyOffset.values[i] = a[e] : o.applyOffset.values[i] = a[t];
}
function Yu(e) {
	const t = e.geometry, r = t.attributes, n = r.position.values, i = C(r.applyOffset) ? r.applyOffset.values : void 0, o = t.indices, a = Iu(t), s = Iu(t);
	let u;
	const c = o.length, l = [];
	l.length = n.length / 3;
	const f = [];
	for (f.length = n.length / 3, u = 0; u < l.length; ++u) l[u] = -1, f[u] = -1;
	for (u = 0; u < c; u += 2) {
		const e = o[u], t = o[u + 1], r = z.fromArray(n, 3 * e, Lu), c = z.fromArray(n, 3 * t, Fu);
		let h;
		Math.abs(r.y) < L.EPSILON6 && (r.y < 0 ? r.y = -L.EPSILON6 : r.y = L.EPSILON6), Math.abs(c.y) < L.EPSILON6 && (c.y < 0 ? c.y = -L.EPSILON6 : c.y = L.EPSILON6);
		let p = a.attributes, m = a.indices, d = f, y = s.attributes, _ = s.indices, g = l;
		const E = as.lineSegmentPlane(r, c, ku, Du);
		if (C(E)) {
			const b = z.multiplyByScalar(z.UNIT_Y, 5 * L.EPSILON9, Wu);
			r.y < 0 && (z.negate(b, b), p = s.attributes, m = s.indices, d = l, y = a.attributes, _ = a.indices, g = f);
			const w = z.add(E, b, Vu);
			h = ju(p, m, d, o, u, r), Hu(e, t, r, n, h, p, i), h = ju(p, m, d, o, -1, w), Hu(e, t, w, n, h, p, i), z.negate(b, b), z.add(E, b, w), h = ju(y, _, g, o, -1, w), Hu(e, t, w, n, h, y, i), h = ju(y, _, g, o, u + 1, c), Hu(e, t, c, n, h, y, i);
		} else {
			let p, m, d;
			r.y < 0 ? (p = s.attributes, m = s.indices, d = l) : (p = a.attributes, m = a.indices, d = f), h = ju(p, m, d, o, u, r), Hu(e, t, r, n, h, p, i), h = ju(p, m, d, o, u + 1, c), Hu(e, t, c, n, h, p, i);
		}
	}
	Cu(e, s, a);
}
const Xu = new wt(), $u = new wt(), Ku = new z(), Zu = new z(), Qu = new z(), Ju = new z(), ec = new z(), tc = new z(), rc = new V();
function nc(e) {
	const t = e.attributes, r = t.position.values, n = t.prevPosition.values, i = t.nextPosition.values, o = r.length;
	for (let a = 0; a < o; a += 3) {
		const e = z.unpack(r, a, Ku);
		if (e.x > 0) continue;
		const t = z.unpack(n, a, Zu);
		(e.y < 0 && t.y > 0 || e.y > 0 && t.y < 0) && (a - 3 > 0 ? (n[a] = r[a - 3], n[a + 1] = r[a - 2], n[a + 2] = r[a - 1]) : z.pack(e, n, a));
		const s = z.unpack(i, a, Qu);
		(e.y < 0 && s.y > 0 || e.y > 0 && s.y < 0) && (a + 3 < o ? (i[a] = r[a + 3], i[a + 1] = r[a + 4], i[a + 2] = r[a + 5]) : z.pack(e, i, a));
	}
}
const ic = 5 * L.EPSILON9, oc = L.EPSILON6;
function ac(e, t, r, n, i, o, a, s, u, c, l) {
	this._context = e, this._texture = t, this._textureTarget = r, this._targetFace = n, this._pixelDatatype = a, this._internalFormat = i, this._pixelFormat = o, this._size = s, this._preMultiplyAlpha = u, this._flipY = c, this._initialized = l;
}
Hs.splitLongitude = function(e) {
	if (!C(e)) throw new N("instance is required.");
	const t = e.geometry, r = t.boundingSphere;
	if (C(r) && (r.center.x - r.radius > 0 || Ho.intersectPlane(r, Us.ORIGIN_ZX_PLANE) !== Ht.INTERSECTING)) return e;
	if (t.geometryType !== To.NONE) switch (t.geometryType) {
		case To.POLYLINES:
			(function(e) {
				const t = e.geometry, r = t.attributes, n = r.position.values, i = r.prevPosition.values, o = r.nextPosition.values, a = r.expandAndWidth.values, s = C(r.st) ? r.st.values : void 0, u = C(r.color) ? r.color.values : void 0, c = Iu(t), l = Iu(t);
				let f, h, p, m = !1;
				const d = n.length / 3;
				for (f = 0; f < d; f += 4) {
					const e = f, t = f + 2, r = z.fromArray(n, 3 * e, Ku), d = z.fromArray(n, 3 * t, Zu);
					if (Math.abs(r.y) < oc) for (r.y = oc * (d.y < 0 ? -1 : 1), n[3 * f + 1] = r.y, n[3 * (f + 1) + 1] = r.y, h = 3 * e; h < 3 * e + 12; h += 3) i[h] = n[3 * f], i[h + 1] = n[3 * f + 1], i[h + 2] = n[3 * f + 2];
					if (Math.abs(d.y) < oc) for (d.y = oc * (r.y < 0 ? -1 : 1), n[3 * (f + 2) + 1] = d.y, n[3 * (f + 3) + 1] = d.y, h = 3 * e; h < 3 * e + 12; h += 3) o[h] = n[3 * (f + 2)], o[h + 1] = n[3 * (f + 2) + 1], o[h + 2] = n[3 * (f + 2) + 2];
					let y = c.attributes, _ = c.indices, g = l.attributes, E = l.indices;
					const b = as.lineSegmentPlane(r, d, ku, Ju);
					if (C(b)) {
						m = !0;
						const n = z.multiplyByScalar(z.UNIT_Y, ic, ec);
						r.y < 0 && (z.negate(n, n), y = l.attributes, _ = l.indices, g = c.attributes, E = c.indices);
						const w = z.add(b, n, tc);
						y.position.values.push(r.x, r.y, r.z, r.x, r.y, r.z), y.position.values.push(w.x, w.y, w.z), y.position.values.push(w.x, w.y, w.z), y.prevPosition.values.push(i[3 * e], i[3 * e + 1], i[3 * e + 2]), y.prevPosition.values.push(i[3 * e + 3], i[3 * e + 4], i[3 * e + 5]), y.prevPosition.values.push(r.x, r.y, r.z, r.x, r.y, r.z), y.nextPosition.values.push(w.x, w.y, w.z), y.nextPosition.values.push(w.x, w.y, w.z), y.nextPosition.values.push(w.x, w.y, w.z), y.nextPosition.values.push(w.x, w.y, w.z), z.negate(n, n), z.add(b, n, w), g.position.values.push(w.x, w.y, w.z), g.position.values.push(w.x, w.y, w.z), g.position.values.push(d.x, d.y, d.z, d.x, d.y, d.z), g.prevPosition.values.push(w.x, w.y, w.z), g.prevPosition.values.push(w.x, w.y, w.z), g.prevPosition.values.push(w.x, w.y, w.z), g.prevPosition.values.push(w.x, w.y, w.z), g.nextPosition.values.push(d.x, d.y, d.z, d.x, d.y, d.z), g.nextPosition.values.push(o[3 * t], o[3 * t + 1], o[3 * t + 2]), g.nextPosition.values.push(o[3 * t + 3], o[3 * t + 4], o[3 * t + 5]);
						const T = wt.fromArray(a, 2 * e, Xu), O = Math.abs(T.y);
						y.expandAndWidth.values.push(-1, O, 1, O), y.expandAndWidth.values.push(-1, -O, 1, -O), g.expandAndWidth.values.push(-1, O, 1, O), g.expandAndWidth.values.push(-1, -O, 1, -O);
						let A = z.magnitudeSquared(z.subtract(b, r, Qu));
						if (A /= z.magnitudeSquared(z.subtract(d, r, Qu)), C(u)) {
							const r = V.fromArray(u, 4 * e, rc), n = V.fromArray(u, 4 * t, rc), i = L.lerp(r.x, n.x, A), o = L.lerp(r.y, n.y, A), a = L.lerp(r.z, n.z, A), s = L.lerp(r.w, n.w, A);
							for (h = 4 * e; h < 4 * e + 8; ++h) y.color.values.push(u[h]);
							for (y.color.values.push(i, o, a, s), y.color.values.push(i, o, a, s), g.color.values.push(i, o, a, s), g.color.values.push(i, o, a, s), h = 4 * t; h < 4 * t + 8; ++h) g.color.values.push(u[h]);
						}
						if (C(s)) {
							const r = wt.fromArray(s, 2 * e, Xu), n = wt.fromArray(s, 2 * (f + 3), $u), i = L.lerp(r.x, n.x, A);
							for (h = 2 * e; h < 2 * e + 4; ++h) y.st.values.push(s[h]);
							for (y.st.values.push(i, r.y), y.st.values.push(i, n.y), g.st.values.push(i, r.y), g.st.values.push(i, n.y), h = 2 * t; h < 2 * t + 4; ++h) g.st.values.push(s[h]);
						}
						p = y.position.values.length / 3 - 4, _.push(p, p + 2, p + 1), _.push(p + 1, p + 2, p + 3), p = g.position.values.length / 3 - 4, E.push(p, p + 2, p + 1), E.push(p + 1, p + 2, p + 3);
					} else {
						let e, t;
						for (r.y < 0 ? (e = l.attributes, t = l.indices) : (e = c.attributes, t = c.indices), e.position.values.push(r.x, r.y, r.z), e.position.values.push(r.x, r.y, r.z), e.position.values.push(d.x, d.y, d.z), e.position.values.push(d.x, d.y, d.z), h = 3 * f; h < 3 * f + 12; ++h) e.prevPosition.values.push(i[h]), e.nextPosition.values.push(o[h]);
						for (h = 2 * f; h < 2 * f + 8; ++h) e.expandAndWidth.values.push(a[h]), C(s) && e.st.values.push(s[h]);
						if (C(u)) for (h = 4 * f; h < 4 * f + 16; ++h) e.color.values.push(u[h]);
						p = e.position.values.length / 3 - 4, t.push(p, p + 2, p + 1), t.push(p + 1, p + 2, p + 3);
					}
				}
				m && (nc(l), nc(c)), Cu(e, l, c);
			})(e);
			break;
		case To.TRIANGLES:
			Gu(e);
			break;
		case To.LINES: Yu(e);
	}
	else (function(e) {
		switch (e.primitiveType) {
			case ao.TRIANGLE_FAN: return function(e) {
				const t = Oo.computeNumberOfVertices(e);
				if (t < 3) throw new N("The number of vertices must be at least three.");
				const r = Le.createTypedArray(t, 3 * (t - 2));
				r[0] = 1, r[1] = 0, r[2] = 2;
				let n = 3;
				for (let i = 3; i < t; ++i) r[n++] = i - 1, r[n++] = 0, r[n++] = i;
				return e.indices = r, e.primitiveType = ao.TRIANGLES, e;
			}(e);
			case ao.TRIANGLE_STRIP: return function(e) {
				const t = Oo.computeNumberOfVertices(e);
				if (t < 3) throw new N("The number of vertices must be at least 3.");
				const r = Le.createTypedArray(t, 3 * (t - 2));
				r[0] = 0, r[1] = 1, r[2] = 2, t > 3 && (r[3] = 0, r[4] = 2, r[5] = 3);
				let n = 6;
				for (let i = 3; i < t - 1; i += 2) r[n++] = i, r[n++] = i - 1, r[n++] = i + 1, i + 2 < t && (r[n++] = i, r[n++] = i + 1, r[n++] = i + 2);
				return e.indices = r, e.primitiveType = ao.TRIANGLES, e;
			}(e);
			case ao.TRIANGLES: return function(e) {
				if (C(e.indices)) return e;
				const t = Oo.computeNumberOfVertices(e);
				if (t < 3) throw new N("The number of vertices must be at least three.");
				if (t % 3 != 0) throw new N("The number of vertices must be a multiple of three.");
				const r = Le.createTypedArray(t, t);
				for (let n = 0; n < t; ++n) r[n] = n;
				return e.indices = r, e;
			}(e);
			case ao.LINE_STRIP: return function(e) {
				const t = Oo.computeNumberOfVertices(e);
				if (t < 2) throw new N("The number of vertices must be at least two.");
				const r = Le.createTypedArray(t, 2 * (t - 1));
				r[0] = 0, r[1] = 1;
				let n = 2;
				for (let i = 2; i < t; ++i) r[n++] = i - 1, r[n++] = i;
				return e.indices = r, e.primitiveType = ao.LINES, e;
			}(e);
			case ao.LINE_LOOP: return function(e) {
				const t = Oo.computeNumberOfVertices(e);
				if (t < 2) throw new N("The number of vertices must be at least two.");
				const r = Le.createTypedArray(t, 2 * t);
				r[0] = 0, r[1] = 1;
				let n = 2;
				for (let i = 2; i < t; ++i) r[n++] = i - 1, r[n++] = i;
				return r[n++] = t - 1, r[n] = 0, e.indices = r, e.primitiveType = ao.LINES, e;
			}(e);
			case ao.LINES: return function(e) {
				if (C(e.indices)) return e;
				const t = Oo.computeNumberOfVertices(e);
				if (t < 2) throw new N("The number of vertices must be at least two.");
				if (t % 2 != 0) throw new N("The number of vertices must be a multiple of 2.");
				const r = Le.createTypedArray(t, t);
				for (let n = 0; n < t; ++n) r[n] = n;
				return e.indices = r, e;
			}(e);
		}
	})(t), t.primitiveType === ao.TRIANGLES ? Gu(e) : t.primitiveType === ao.LINES && Yu(e);
	return e;
}, Object.defineProperties(ac.prototype, {
	pixelFormat: { get: function() {
		return this._pixelFormat;
	} },
	pixelDatatype: { get: function() {
		return this._pixelDatatype;
	} },
	_target: { get: function() {
		return this._targetFace;
	} }
}), ac.prototype.copyFrom = function(e) {
	v.defined("options", e);
	const { xOffset: t = 0, yOffset: r = 0, source: n, skipColorSpaceConversion: i = !1 } = e;
	if (v.defined("options.source", n), v.typeOf.number.greaterThanOrEquals("xOffset", t, 0), v.typeOf.number.greaterThanOrEquals("yOffset", r, 0), t + n.width > this._size) throw new N("xOffset + options.source.width must be less than or equal to width.");
	if (r + n.height > this._size) throw new N("yOffset + options.source.height must be less than or equal to height.");
	const { width: o, height: a } = n, s = this._context._gl, u = this._textureTarget, c = this._targetFace;
	s.activeTexture(s.TEXTURE0), s.bindTexture(u, this._texture);
	let l = n.arrayBufferView;
	const f = this._size, h = this._pixelFormat, p = this._internalFormat, m = this._pixelDatatype, d = this._preMultiplyAlpha, y = this._flipY;
	let _ = 4;
	C(l) && (_ = uo.alignmentInBytes(h, m, o)), s.pixelStorei(s.UNPACK_ALIGNMENT, _), i ? s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, s.NONE) : s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, s.BROWSER_DEFAULT_WEBGL);
	let g = !1;
	if (!this._initialized) {
		let e;
		0 === t && 0 === r && o === f && a === f ? (C(l) ? (s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), y && (l = uo.flipY(l, h, m, f, f)), e = l) : (s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, d), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, y), e = n), g = !0) : (s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), e = uo.createTypedArray(h, m, f, f)), s.texImage2D(c, 0, p, f, f, 0, h, so.toWebGLConstant(m, this._context), e), this._initialized = !0;
	}
	g || (C(l) ? (s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), y && (l = uo.flipY(l, h, m, o, a)), s.texSubImage2D(c, 0, t, r, o, a, h, so.toWebGLConstant(m, this._context), l)) : (s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, d), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, y), s.texSubImage2D(c, 0, t, r, h, so.toWebGLConstant(m, this._context), n))), s.bindTexture(u, null);
}, ac.prototype.copyFromFramebuffer = function(e, t, r, n, i, o) {
	if (e = e ?? 0, t = t ?? 0, r = r ?? 0, n = n ?? 0, i = i ?? this._size, o = o ?? this._size, v.typeOf.number.greaterThanOrEquals("xOffset", e, 0), v.typeOf.number.greaterThanOrEquals("yOffset", t, 0), v.typeOf.number.greaterThanOrEquals("framebufferXOffset", r, 0), v.typeOf.number.greaterThanOrEquals("framebufferYOffset", n, 0), e + i > this._size) throw new N("xOffset + source.width must be less than or equal to width.");
	if (t + o > this._size) throw new N("yOffset + source.height must be less than or equal to height.");
	if (this._pixelDatatype === so.FLOAT) throw new N("Cannot call copyFromFramebuffer when the texture pixel data type is FLOAT.");
	if (this._pixelDatatype === so.HALF_FLOAT) throw new N("Cannot call copyFromFramebuffer when the texture pixel data type is HALF_FLOAT.");
	const a = this._context._gl, s = this._textureTarget;
	a.activeTexture(a.TEXTURE0), a.bindTexture(s, this._texture), a.copyTexSubImage2D(this._targetFace, 0, e, t, r, n, i, o), a.bindTexture(s, null), this._initialized = !0;
}, ac.prototype.copyMipmapFromFramebuffer = function(e, t, r, n, i) {
	if (e = e ?? 0, t = t ?? 0, r = r ?? this._size, n = n ?? this._size, i = i ?? 0, v.typeOf.number.greaterThanOrEquals("xOffset", e, 0), v.typeOf.number.greaterThanOrEquals("yOffset", t, 0), e + r > this._size) throw new N("xOffset + source.width must be less than or equal to width.");
	if (t + n > this._size) throw new N("yOffset + source.height must be less than or equal to height.");
	if (this._pixelDatatype === so.FLOAT) throw new N("Cannot call copyFromFramebuffer when the texture pixel data type is FLOAT.");
	if (this._pixelDatatype === so.HALF_FLOAT) throw new N("Cannot call copyFromFramebuffer when the texture pixel data type is HALF_FLOAT.");
	const o = this._context._gl, a = this._textureTarget;
	o.activeTexture(o.TEXTURE0), o.bindTexture(a, this._texture), o.copyTexImage2D(this._targetFace, i, this._internalFormat, e, t, r, n, 0), o.bindTexture(a, null), this._initialized = !0;
};
const sc = {
	DONT_CARE: Ne.DONT_CARE,
	FASTEST: Ne.FASTEST,
	NICEST: Ne.NICEST,
	validate: function(e) {
		return e === sc.DONT_CARE || e === sc.FASTEST || e === sc.NICEST;
	}
};
Object.freeze(sc);
const uc = {
	NEAREST: Ne.NEAREST,
	LINEAR: Ne.LINEAR,
	validate: function(e) {
		return e === uc.NEAREST || e === uc.LINEAR;
	}
};
Object.freeze(uc);
const cc = {
	NEAREST: Ne.NEAREST,
	LINEAR: Ne.LINEAR,
	NEAREST_MIPMAP_NEAREST: Ne.NEAREST_MIPMAP_NEAREST,
	LINEAR_MIPMAP_NEAREST: Ne.LINEAR_MIPMAP_NEAREST,
	NEAREST_MIPMAP_LINEAR: Ne.NEAREST_MIPMAP_LINEAR,
	LINEAR_MIPMAP_LINEAR: Ne.LINEAR_MIPMAP_LINEAR,
	validate: function(e) {
		return e === cc.NEAREST || e === cc.LINEAR || e === cc.NEAREST_MIPMAP_NEAREST || e === cc.LINEAR_MIPMAP_NEAREST || e === cc.NEAREST_MIPMAP_LINEAR || e === cc.LINEAR_MIPMAP_LINEAR;
	}
};
Object.freeze(cc);
const lc = {
	CLAMP_TO_EDGE: Ne.CLAMP_TO_EDGE,
	REPEAT: Ne.REPEAT,
	MIRRORED_REPEAT: Ne.MIRRORED_REPEAT,
	validate: function(e) {
		return e === lc.CLAMP_TO_EDGE || e === lc.REPEAT || e === lc.MIRRORED_REPEAT;
	}
};
function fc(e) {
	e = e ?? J.EMPTY_OBJECT;
	const { wrapR: t = lc.CLAMP_TO_EDGE, wrapS: r = lc.CLAMP_TO_EDGE, wrapT: n = lc.CLAMP_TO_EDGE, minificationFilter: i = cc.LINEAR, magnificationFilter: o = uc.LINEAR, maximumAnisotropy: a = 1 } = e;
	if (!lc.validate(t)) throw new N("Invalid sampler.wrapR.");
	if (!lc.validate(r)) throw new N("Invalid sampler.wrapS.");
	if (!lc.validate(n)) throw new N("Invalid sampler.wrapT.");
	if (!cc.validate(i)) throw new N("Invalid sampler.minificationFilter.");
	if (!uc.validate(o)) throw new N("Invalid sampler.magnificationFilter.");
	v.typeOf.number.greaterThanOrEquals("maximumAnisotropy", a, 1), this._wrapR = t, this._wrapS = r, this._wrapT = n, this._minificationFilter = i, this._magnificationFilter = o, this._maximumAnisotropy = a;
}
function hc(e, t) {
	if (!e) throw new N(t);
}
function pc(e, t, r, n) {
	const i = C(t.vertexBuffer), o = C(t.value), a = t.value ? t.value.length : t.componentsPerAttribute;
	if (!i && !o) throw new N("attribute must have a vertexBuffer or a value.");
	if (i && o) throw new N("attribute cannot have both a vertexBuffer and a value.  It must have either a vertexBuffer property defining per-vertex data or a value property defining data for all vertices.");
	if (1 !== a && 2 !== a && 3 !== a && 4 !== a) {
		if (o) throw new N("attribute.value.length must be in the range [1, 4].");
		throw new N("attribute.componentsPerAttribute must be in the range [1, 4].");
	}
	if (C(t.componentDatatype) && !wo.validate(t.componentDatatype)) throw new N("attribute must have a valid componentDatatype or not specify it.");
	if (C(t.strideInBytes) && t.strideInBytes > 255) throw new N("attribute must have a strideInBytes less than or equal to 255 or not specify it.");
	if (C(t.instanceDivisor) && t.instanceDivisor > 0 && !n.instancedArrays) throw new N("instanced arrays is not supported");
	if (C(t.instanceDivisor) && t.instanceDivisor < 0) throw new N("attribute must have an instanceDivisor greater than or equal to zero");
	if (C(t.instanceDivisor) && o) throw new N("attribute cannot have have an instanceDivisor if it is not backed by a buffer");
	if (C(t.instanceDivisor) && t.instanceDivisor > 0 && 0 === t.index) throw new N("attribute zero cannot have an instanceDivisor greater than 0");
	const s = {
		index: t.index ?? r,
		enabled: t.enabled ?? !0,
		vertexBuffer: t.vertexBuffer,
		value: o ? t.value.slice(0) : void 0,
		componentsPerAttribute: a,
		componentDatatype: t.componentDatatype ?? wo.FLOAT,
		normalize: t.normalize ?? !1,
		offsetInBytes: t.offsetInBytes ?? 0,
		strideInBytes: t.strideInBytes ?? 0,
		instanceDivisor: t.instanceDivisor ?? 0
	};
	if (i) s.vertexAttrib = function(e) {
		const t = this.index;
		e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer._getBuffer()), e.vertexAttribPointer(t, this.componentsPerAttribute, this.componentDatatype, this.normalize, this.strideInBytes, this.offsetInBytes), e.enableVertexAttribArray(t), this.instanceDivisor > 0 && (n.glVertexAttribDivisor(t, this.instanceDivisor), n._vertexAttribDivisors[t] = this.instanceDivisor, n._previousDrawInstanced = !0);
	}, s.disableVertexAttribArray = function(e) {
		e.disableVertexAttribArray(this.index), this.instanceDivisor > 0 && n.glVertexAttribDivisor(r, 0);
	};
	else {
		switch (s.componentsPerAttribute) {
			case 1:
				s.vertexAttrib = function(e) {
					e.vertexAttrib1fv(this.index, this.value);
				};
				break;
			case 2:
				s.vertexAttrib = function(e) {
					e.vertexAttrib2fv(this.index, this.value);
				};
				break;
			case 3:
				s.vertexAttrib = function(e) {
					e.vertexAttrib3fv(this.index, this.value);
				};
				break;
			case 4: s.vertexAttrib = function(e) {
				e.vertexAttrib4fv(this.index, this.value);
			};
		}
		s.disableVertexAttribArray = function(e) {};
	}
	e.push(s);
}
function mc(e, t, r) {
	for (let n = 0; n < t.length; ++n) {
		const r = t[n];
		r.enabled && r.vertexAttrib(e);
	}
	C(r) && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, r._getBuffer());
}
function dc(e) {
	e = e ?? J.EMPTY_OBJECT, v.defined("options.context", e.context), v.defined("options.attributes", e.attributes);
	const t = e.context, r = t._gl, n = e.attributes, i = e.indexBuffer;
	let o;
	const a = [];
	let s = 1, u = !1, c = !1, l = n.length;
	for (o = 0; o < l; ++o) pc(a, n[o], o, t);
	for (l = a.length, o = 0; o < l; ++o) {
		const e = a[o];
		if (C(e.vertexBuffer) && 0 === e.instanceDivisor) {
			const t = e.strideInBytes || e.componentsPerAttribute * wo.getSizeInBytes(e.componentDatatype);
			s = e.vertexBuffer.sizeInBytes / t;
			break;
		}
	}
	for (o = 0; o < l; ++o) a[o].instanceDivisor > 0 && (u = !0), C(a[o].value) && (c = !0);
	const f = {};
	for (o = 0; o < l; ++o) {
		const e = a[o].index;
		if (f[e]) throw new N(`Index ${e} is used by more than one attribute.`);
		f[e] = !0;
	}
	let h;
	t.vertexArrayObject && (h = t.glCreateVertexArray(), t.glBindVertexArray(h), mc(r, a, i), t.glBindVertexArray(null)), this._numberOfVertices = s, this._hasInstancedAttributes = u, this._hasConstantAttributes = c, this._context = t, this._gl = r, this._vao = h, this._attributes = a, this._indexBuffer = i;
}
function yc(e) {
	return e.values.length / e.componentsPerAttribute;
}
function _c(e) {
	return wo.getSizeInBytes(e.componentDatatype) * e.componentsPerAttribute;
}
function gc(e) {
	e = e ?? J.EMPTY_OBJECT, v.defined("options.context", e.context);
	const { context: t, source: r, pixelFormat: n = uo.RGBA, pixelDatatype: i = so.UNSIGNED_BYTE, flipY: o = !0, skipColorSpaceConversion: a = !1, sampler: s = new fc() } = e, u = e.preMultiplyAlpha || n === uo.RGB || n === uo.LUMINANCE;
	let { width: c, height: l } = e;
	if (C(r)) {
		if (!Object.values(gc.FaceName).every((e) => C(r[e]))) throw new N(`options.source requires faces ${Object.values(gc.FaceName).join(", ")}.`);
		({width: c, height: l} = r.positiveX);
		for (const e of gc.faceNames()) {
			const t = r[e];
			if (Number(t.width) !== c || Number(t.height) !== l) throw new N("Each face in options.source must have the same width and height.");
		}
	}
	const f = c;
	if (!C(c) || !C(l)) throw new N("options requires a source field to create an initialized cube map or width and height fields to create a blank cube map.");
	if (c !== l) throw new N("Width must equal height.");
	if (f <= 0) throw new N("Width and height must be greater than zero.");
	if (f > co.maximumCubeMapSize) throw new N(`Width and height must be less than or equal to the maximum cube map size (${co.maximumCubeMapSize}). Check maximumCubeMapSize.`);
	if (!uo.validate(n)) throw new N("Invalid options.pixelFormat.");
	if (uo.isDepthFormat(n)) throw new N("options.pixelFormat cannot be DEPTH_COMPONENT or DEPTH_STENCIL.");
	if (!so.validate(i)) throw new N("Invalid options.pixelDatatype.");
	if (i === so.FLOAT && !t.floatingPointTexture) throw new N("When options.pixelDatatype is FLOAT, this WebGL implementation must support the OES_texture_float extension.");
	if (i === so.HALF_FLOAT && !t.halfFloatingPointTexture) throw new N("When options.pixelDatatype is HALF_FLOAT, this WebGL implementation must support the OES_texture_half_float extension.");
	const h = 6 * uo.textureSizeInBytes(n, i, f, f), p = uo.toInternalFormat(n, i, t), m = t._gl, d = m.TEXTURE_CUBE_MAP, y = m.createTexture();
	this._context = t, this._textureFilterAnisotropic = t._textureFilterAnisotropic, this._textureTarget = d, this._texture = y, this._pixelFormat = n, this._pixelDatatype = i, this._size = f, this._hasMipmap = !1, this._sizeInBytes = h, this._preMultiplyAlpha = u, this._flipY = o;
	const _ = C(r);
	function g(e) {
		return new ac(t, y, d, e, p, n, i, f, u, o, _);
	}
	this._positiveX = g(m.TEXTURE_CUBE_MAP_POSITIVE_X), this._negativeX = g(m.TEXTURE_CUBE_MAP_NEGATIVE_X), this._positiveY = g(m.TEXTURE_CUBE_MAP_POSITIVE_Y), this._negativeY = g(m.TEXTURE_CUBE_MAP_NEGATIVE_Y), this._positiveZ = g(m.TEXTURE_CUBE_MAP_POSITIVE_Z), this._negativeZ = g(m.TEXTURE_CUBE_MAP_NEGATIVE_Z), this._sampler = s, bc(this, s), m.activeTexture(m.TEXTURE0), m.bindTexture(d, y), a ? m.pixelStorei(m.UNPACK_COLORSPACE_CONVERSION_WEBGL, m.NONE) : m.pixelStorei(m.UNPACK_COLORSPACE_CONVERSION_WEBGL, m.BROWSER_DEFAULT_WEBGL);
	for (const E of gc.faceNames()) Ec(this[E], r?.[E], 0);
	m.bindTexture(d, null);
}
function Ec(e, t, r) {
	r = r ?? 0;
	const n = e._targetFace, i = Math.max(Math.floor(e._size / 2 ** r), 1), o = e._pixelFormat, a = e._pixelDatatype, s = e._internalFormat, u = e._flipY, c = e._preMultiplyAlpha, l = e._context, f = l._gl;
	if (!C(t)) return void f.texImage2D(n, r, s, i, i, 0, o, so.toWebGLConstant(a, l), null);
	let { arrayBufferView: h } = t, p = 4;
	C(h) && (p = uo.alignmentInBytes(o, a, i)), f.pixelStorei(f.UNPACK_ALIGNMENT, p), C(h) ? (f.pixelStorei(f.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), f.pixelStorei(f.UNPACK_FLIP_Y_WEBGL, !1), u && (h = uo.flipY(h, o, a, i, i)), f.texImage2D(n, r, s, i, i, 0, o, so.toWebGLConstant(a, l), h)) : (f.pixelStorei(f.UNPACK_PREMULTIPLY_ALPHA_WEBGL, c), f.pixelStorei(f.UNPACK_FLIP_Y_WEBGL, u), f.texImage2D(n, r, s, o, so.toWebGLConstant(a, l), t));
}
function bc(e, t) {
	let { minificationFilter: r, magnificationFilter: n } = t;
	const i = [
		cc.NEAREST_MIPMAP_NEAREST,
		cc.NEAREST_MIPMAP_LINEAR,
		cc.LINEAR_MIPMAP_NEAREST,
		cc.LINEAR_MIPMAP_LINEAR
	].includes(r), o = e._context, a = e._pixelDatatype;
	(a === so.FLOAT && !o.textureFloatLinear || a === so.HALF_FLOAT && !o.textureHalfFloatLinear) && (r = i ? cc.NEAREST_MIPMAP_NEAREST : cc.NEAREST, n = uc.NEAREST);
	const s = o._gl, u = e._textureTarget;
	s.activeTexture(s.TEXTURE0), s.bindTexture(u, e._texture), s.texParameteri(u, s.TEXTURE_MIN_FILTER, r), s.texParameteri(u, s.TEXTURE_MAG_FILTER, n), s.texParameteri(u, s.TEXTURE_WRAP_S, t.wrapS), s.texParameteri(u, s.TEXTURE_WRAP_T, t.wrapT), C(e._textureFilterAnisotropic) && s.texParameteri(u, e._textureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT, t.maximumAnisotropy), s.bindTexture(u, null);
}
function wc(e) {
	e = e ?? J.EMPTY_OBJECT, v.defined("options.context", e.context);
	const { context: t, source: r, pixelFormat: n = uo.RGBA, pixelDatatype: i = so.UNSIGNED_BYTE, flipY: o = !0, skipColorSpaceConversion: a = !1, sampler: s = new fc() } = e;
	let { width: u, height: c } = e;
	C(r) && (C(u) || (u = r.videoWidth ?? r.naturalWidth ?? r.width), C(c) || (c = r.videoHeight ?? r.naturalHeight ?? r.height));
	const l = e.preMultiplyAlpha || n === uo.RGB || n === uo.LUMINANCE, f = uo.toInternalFormat(n, i, t), h = uo.isCompressedFormat(f);
	if (!C(u) || !C(c)) throw new N("options requires a source field to create an initialized texture or width and height fields to create a blank texture.");
	if (v.typeOf.number.greaterThan("width", u, 0), u > co.maximumTextureSize) throw new N(`Width must be less than or equal to the maximum texture size (${co.maximumTextureSize}).  Check maximumTextureSize.`);
	if (v.typeOf.number.greaterThan("height", c, 0), c > co.maximumTextureSize) throw new N(`Height must be less than or equal to the maximum texture size (${co.maximumTextureSize}).  Check maximumTextureSize.`);
	if (!uo.validate(n)) throw new N("Invalid options.pixelFormat.");
	if (!h && !so.validate(i)) throw new N("Invalid options.pixelDatatype.");
	if (n === uo.DEPTH_COMPONENT && i !== so.UNSIGNED_SHORT && i !== so.UNSIGNED_INT) throw new N("When options.pixelFormat is DEPTH_COMPONENT, options.pixelDatatype must be UNSIGNED_SHORT or UNSIGNED_INT.");
	if (n === uo.DEPTH_STENCIL && i !== so.UNSIGNED_INT_24_8) throw new N("When options.pixelFormat is DEPTH_STENCIL, options.pixelDatatype must be UNSIGNED_INT_24_8.");
	if (i === so.FLOAT && !t.floatingPointTexture) throw new N("When options.pixelDatatype is FLOAT, this WebGL implementation must support the OES_texture_float extension.  Check context.floatingPointTexture.");
	if (i === so.HALF_FLOAT && !t.halfFloatingPointTexture) throw new N("When options.pixelDatatype is HALF_FLOAT, this WebGL implementation must support the OES_texture_half_float extension. Check context.halfFloatingPointTexture.");
	if (uo.isDepthFormat(n)) {
		if (C(r)) throw new N("When options.pixelFormat is DEPTH_COMPONENT or DEPTH_STENCIL, source cannot be provided.");
		if (!t.depthTexture) throw new N("When options.pixelFormat is DEPTH_COMPONENT or DEPTH_STENCIL, this WebGL implementation must support WEBGL_depth_texture.  Check context.depthTexture.");
	}
	if (h) {
		if (!C(r) || !C(r.arrayBufferView)) throw new N("When options.pixelFormat is compressed, options.source.arrayBufferView must be defined.");
		if (uo.isDXTFormat(f) && !t.s3tc) throw new N("When options.pixelFormat is S3TC compressed, this WebGL implementation must support the WEBGL_compressed_texture_s3tc extension. Check context.s3tc.");
		if (uo.isPVRTCFormat(f) && !t.pvrtc) throw new N("When options.pixelFormat is PVRTC compressed, this WebGL implementation must support the WEBGL_compressed_texture_pvrtc extension. Check context.pvrtc.");
		if (uo.isASTCFormat(f) && !t.astc) throw new N("When options.pixelFormat is ASTC compressed, this WebGL implementation must support the WEBGL_compressed_texture_astc extension. Check context.astc.");
		if (uo.isETC2Format(f) && !t.etc) throw new N("When options.pixelFormat is ETC2 compressed, this WebGL implementation must support the WEBGL_compressed_texture_etc extension. Check context.etc.");
		if (uo.isETC1Format(f) && !t.etc1) throw new N("When options.pixelFormat is ETC1 compressed, this WebGL implementation must support the WEBGL_compressed_texture_etc1 extension. Check context.etc1.");
		if (uo.isBC7Format(f) && !t.bc7) throw new N("When options.pixelFormat is BC7 compressed, this WebGL implementation must support the EXT_texture_compression_bptc extension. Check context.bc7.");
		if (uo.compressedTextureSizeInBytes(f, u, c) !== r.arrayBufferView.byteLength) throw new N("The byte length of the array buffer is invalid for the compressed texture with the given width and height.");
	}
	const p = t._gl, m = h ? uo.compressedTextureSizeInBytes(n, u, c) : uo.textureSizeInBytes(n, i, u, c);
	this._id = e.id ?? ve(), this._context = t, this._textureFilterAnisotropic = t._textureFilterAnisotropic, this._textureTarget = p.TEXTURE_2D, this._texture = p.createTexture(), this._internalFormat = f, this._pixelFormat = n, this._pixelDatatype = i, this._width = u, this._height = c, this._dimensions = new wt(u, c), this._hasMipmap = !1, this._sizeInBytes = m, this._preMultiplyAlpha = l, this._flipY = o, this._initialized = !1, this._sampler = void 0, this._sampler = s, Rc(this, s), p.activeTexture(p.TEXTURE0), p.bindTexture(this._textureTarget, this._texture), C(r) ? (a ? p.pixelStorei(p.UNPACK_COLORSPACE_CONVERSION_WEBGL, p.NONE) : p.pixelStorei(p.UNPACK_COLORSPACE_CONVERSION_WEBGL, p.BROWSER_DEFAULT_WEBGL), C(r.arrayBufferView) ? uo.isCompressedFormat(f) ? function(e, t) {
		const r = e._context._gl, n = e._textureTarget, i = e._internalFormat, { width: o, height: a } = e;
		if (r.pixelStorei(r.UNPACK_ALIGNMENT, 4), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1), r.compressedTexImage2D(n, 0, i, o, a, 0, t.arrayBufferView), C(t.mipLevels)) {
			let e = o, s = a;
			for (let o = 0; o < t.mipLevels.length; ++o) e = Ac(e), s = Ac(s), r.compressedTexImage2D(n, o + 1, i, e, s, 0, t.mipLevels[o]);
		}
	}(this, r) : Tc(this, r) : C(r.framebuffer) ? function(e, t) {
		const r = e._context, n = r._gl;
		n.pixelStorei(n.UNPACK_ALIGNMENT, 4), n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, !1), t.framebuffer !== r.defaultFramebuffer && t.framebuffer._bind(), n.copyTexImage2D(e._textureTarget, 0, e._internalFormat, t.xOffset, t.yOffset, e.width, e.height, 0), t.framebuffer !== r.defaultFramebuffer && t.framebuffer._unBind();
	}(this, r) : Oc(this, r), this._initialized = !0) : xc(this), p.bindTexture(this._textureTarget, null);
}
function Tc(e, t) {
	const r = e._context, n = r._gl, i = e._textureTarget, o = e._internalFormat, { width: a, height: s, pixelFormat: u, pixelDatatype: c, flipY: l } = e, f = uo.alignmentInBytes(u, c, a);
	n.pixelStorei(n.UNPACK_ALIGNMENT, f), n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, !1);
	let { arrayBufferView: h } = t;
	if (l && (h = uo.flipY(h, u, c, a, s)), n.texImage2D(i, 0, o, a, s, 0, u, so.toWebGLConstant(c, r), h), C(t.mipLevels)) {
		let e = a, l = s;
		for (let a = 0; a < t.mipLevels.length; ++a) e = Ac(e), l = Ac(l), n.texImage2D(i, a + 1, o, e, l, 0, u, so.toWebGLConstant(c, r), t.mipLevels[a]);
	}
}
function Oc(e, t) {
	const r = e._context, n = r._gl;
	n.pixelStorei(n.UNPACK_ALIGNMENT, 4), n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.preMultiplyAlpha), n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, e.flipY), n.texImage2D(e._textureTarget, 0, e._internalFormat, e.pixelFormat, so.toWebGLConstant(e.pixelDatatype, r), t);
}
function Ac(e) {
	const t = 0 | Math.floor(e / 2);
	return Math.max(t, 1);
}
function xc(e) {
	const t = e._context;
	t._gl.texImage2D(e._textureTarget, 0, e._internalFormat, e._width, e._height, 0, e._pixelFormat, so.toWebGLConstant(e._pixelDatatype, t), null);
}
function Rc(e, t) {
	let { minificationFilter: r, magnificationFilter: n } = t;
	const i = [
		cc.NEAREST_MIPMAP_NEAREST,
		cc.NEAREST_MIPMAP_LINEAR,
		cc.LINEAR_MIPMAP_NEAREST,
		cc.LINEAR_MIPMAP_LINEAR
	].includes(r), o = e._context, a = e._pixelFormat, s = e._pixelDatatype;
	(s === so.FLOAT && !o.textureFloatLinear || s === so.HALF_FLOAT && !o.textureHalfFloatLinear) && (r = i ? cc.NEAREST_MIPMAP_NEAREST : cc.NEAREST, n = uc.NEAREST), o.webgl2 && uo.isDepthFormat(a) && (r = cc.NEAREST, n = uc.NEAREST);
	const u = o._gl, c = e._textureTarget;
	u.activeTexture(u.TEXTURE0), u.bindTexture(c, e._texture), u.texParameteri(c, u.TEXTURE_MIN_FILTER, r), u.texParameteri(c, u.TEXTURE_MAG_FILTER, n), u.texParameteri(c, u.TEXTURE_WRAP_S, t.wrapS), u.texParameteri(c, u.TEXTURE_WRAP_T, t.wrapT), C(e._textureFilterAnisotropic) && u.texParameteri(c, e._textureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT, t.maximumAnisotropy), u.bindTexture(c, null);
}
function Sc(e, t) {
	e = e ?? 0, this._near = e, t = t ?? Number.MAX_VALUE, this._far = t;
}
Object.freeze(lc), Object.defineProperties(fc.prototype, {
	wrapR: { get: function() {
		return this._wrapR;
	} },
	wrapS: { get: function() {
		return this._wrapS;
	} },
	wrapT: { get: function() {
		return this._wrapT;
	} },
	minificationFilter: { get: function() {
		return this._minificationFilter;
	} },
	magnificationFilter: { get: function() {
		return this._magnificationFilter;
	} },
	maximumAnisotropy: { get: function() {
		return this._maximumAnisotropy;
	} }
}), fc.equals = function(e, t) {
	return e === t || C(e) && C(t) && e._wrapR === t._wrapR && e._wrapS === t._wrapS && e._wrapT === t._wrapT && e._minificationFilter === t._minificationFilter && e._magnificationFilter === t._magnificationFilter && e._maximumAnisotropy === t._maximumAnisotropy;
}, fc.NEAREST = Object.freeze(new fc({
	wrapR: lc.CLAMP_TO_EDGE,
	wrapS: lc.CLAMP_TO_EDGE,
	wrapT: lc.CLAMP_TO_EDGE,
	minificationFilter: cc.NEAREST,
	magnificationFilter: uc.NEAREST
})), dc.fromGeometry = function(e) {
	e = e ?? J.EMPTY_OBJECT, v.defined("options.context", e.context);
	const t = e.context, r = e.geometry ?? J.EMPTY_OBJECT, n = e.bufferUsage ?? Fe.DYNAMIC_DRAW, i = e.attributeLocations ?? J.EMPTY_OBJECT, o = e.interleave ?? !1, a = e.vertexArrayAttributes;
	let s, u, c;
	const l = C(a) ? a : [], f = r.attributes;
	if (o) {
		const e = function(e) {
			let t, r, n;
			const i = [];
			for (r in e) e.hasOwnProperty(r) && C(e[r]) && C(e[r].values) && (i.push(r), e[r].componentDatatype === wo.DOUBLE && (e[r].componentDatatype = wo.FLOAT, e[r].values = wo.createTypedArray(wo.FLOAT, e[r].values)));
			let o;
			const a = i.length;
			if (a > 0) for (o = yc(e[i[0]]), t = 1; t < a; ++t) {
				const r = yc(e[i[t]]);
				if (r !== o) throw new me(`Each attribute list must have the same number of vertices.  Attribute ${i[t]} has a different number of vertices (${r.toString()}) than attribute ${i[0]} (${o.toString()}).`);
			}
			i.sort(function(t, r) {
				return wo.getSizeInBytes(e[r].componentDatatype) - wo.getSizeInBytes(e[t].componentDatatype);
			});
			let s = 0;
			const u = {};
			for (t = 0; t < a; ++t) r = i[t], n = e[r], u[r] = s, s += _c(n);
			if (s > 0) {
				const c = wo.getSizeInBytes(e[i[0]].componentDatatype), l = s % c;
				0 !== l && (s += c - l);
				const f = new ArrayBuffer(o * s), h = {};
				for (t = 0; t < a; ++t) {
					r = i[t];
					const n = wo.getSizeInBytes(e[r].componentDatatype);
					h[r] = {
						pointer: wo.createTypedArray(e[r].componentDatatype, f),
						index: u[r] / n,
						strideInComponentType: s / n
					};
				}
				for (t = 0; t < o; ++t) for (let o = 0; o < a; ++o) {
					r = i[o], n = e[r];
					const a = n.values, s = h[r], u = s.pointer, c = n.componentsPerAttribute;
					for (let e = 0; e < c; ++e) u[s.index + e] = a[t * c + e];
					s.index += s.strideInComponentType;
				}
				return {
					buffer: f,
					offsetsInBytes: u,
					vertexSizeInBytes: s
				};
			}
		}(f);
		if (C(e)) {
			c = De.createVertexBuffer({
				context: t,
				typedArray: e.buffer,
				usage: n
			});
			const r = e.offsetsInBytes, o = e.vertexSizeInBytes;
			for (s in f) f.hasOwnProperty(s) && C(f[s]) && (u = f[s], C(u.values) ? l.push({
				index: i[s],
				vertexBuffer: c,
				componentDatatype: u.componentDatatype,
				componentsPerAttribute: u.componentsPerAttribute,
				normalize: u.normalize,
				offsetInBytes: r[s],
				strideInBytes: o
			}) : l.push({
				index: i[s],
				value: u.value,
				componentDatatype: u.componentDatatype,
				normalize: u.normalize
			}));
		}
	} else for (s in f) if (f.hasOwnProperty(s) && C(f[s])) {
		u = f[s];
		let e = u.componentDatatype;
		e === wo.DOUBLE && (e = wo.FLOAT);
		let r = {};
		c = void 0, C(u.values) && (c = De.createVertexBuffer({
			context: t,
			typedArray: wo.createTypedArray(e, u.values),
			usage: n
		}), r = {
			index: i[s],
			vertexBuffer: c,
			value: u.value,
			componentDatatype: e,
			componentsPerAttribute: u.componentsPerAttribute,
			normalize: u.normalize
		}), C(u.typedArray) && (c = De.createVertexBuffer({
			context: t,
			typedArray: u.typedArray,
			usage: n
		}), r = {
			index: i[s],
			vertexBuffer: c,
			value: void 0,
			componentDatatype: e,
			componentsPerAttribute: ja.getNumberOfComponents(u.type),
			normalize: u.normalized,
			instanceDivisor: u.instanceDivisor
		}), l.push(r);
	}
	let h;
	const p = r.indices;
	return C(p) && (h = Oo.computeNumberOfVertices(r) >= L.SIXTY_FOUR_KILOBYTES && t.elementIndexUint ? De.createIndexBuffer({
		context: t,
		typedArray: new Uint32Array(p),
		usage: n,
		indexDatatype: Le.UNSIGNED_INT
	}) : De.createIndexBuffer({
		context: t,
		typedArray: new Uint16Array(p),
		usage: n,
		indexDatatype: Le.UNSIGNED_SHORT
	})), new dc({
		context: t,
		attributes: l,
		indexBuffer: h
	});
}, Object.defineProperties(dc.prototype, {
	numberOfAttributes: { get: function() {
		return this._attributes.length;
	} },
	numberOfVertices: { get: function() {
		return this._numberOfVertices;
	} },
	indexBuffer: { get: function() {
		return this._indexBuffer;
	} }
}), dc.prototype.getAttribute = function(e) {
	return v.defined("index", e), this._attributes[e];
}, dc.prototype.copyAttributeFromRange = function(e, t, r, n) {
	const i = this.getAttribute(e), o = i.vertexBuffer, a = i.componentsPerAttribute;
	hc(o.sizeInBytes === t.byteLength, "Invalid buffer length");
	const s = t.constructor, u = r * a * s.BYTES_PER_ELEMENT, c = new s(t.buffer, t.byteOffset + u, n * a);
	o.copyFromArrayView(c, u);
}, dc.prototype.copyIndexFromRange = function(e, t, r) {
	const n = this._indexBuffer;
	hc(n.sizeInBytes === e.byteLength, "Invalid buffer length");
	const i = e.constructor, o = t * i.BYTES_PER_ELEMENT, a = new i(e.buffer, e.byteOffset + o, r);
	n.copyFromArrayView(a, o);
}, dc.prototype._bind = function() {
	C(this._vao) ? (this._context.glBindVertexArray(this._vao), this._context.instancedArrays && function(e) {
		const t = e._context, r = e._hasInstancedAttributes;
		if (!r && !t._previousDrawInstanced) return;
		t._previousDrawInstanced = r;
		const n = t._vertexAttribDivisors, i = e._attributes, o = co.maximumVertexAttributes;
		let a;
		if (r) {
			const e = i.length;
			for (a = 0; a < e; ++a) {
				const e = i[a];
				if (e.enabled) {
					const r = e.instanceDivisor, i = e.index;
					r !== n[i] && (t.glVertexAttribDivisor(i, r), n[i] = r);
				}
			}
		} else for (a = 0; a < o; ++a) n[a] > 0 && (t.glVertexAttribDivisor(a, 0), n[a] = 0);
	}(this), this._hasConstantAttributes && function(e, t) {
		const r = e._attributes, n = r.length;
		for (let i = 0; i < n; ++i) {
			const e = r[i];
			e.enabled && C(e.value) && e.vertexAttrib(t);
		}
	}(this, this._gl)) : mc(this._gl, this._attributes, this._indexBuffer);
}, dc.prototype._unBind = function() {
	if (C(this._vao)) this._context.glBindVertexArray(null);
	else {
		const e = this._attributes, t = this._gl;
		for (let r = 0; r < e.length; ++r) {
			const n = e[r];
			n.enabled && n.disableVertexAttribArray(t);
		}
		this._indexBuffer && t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null);
	}
}, dc.prototype.isDestroyed = function() {
	return !1;
}, dc.prototype.destroy = function() {
	const e = this._attributes;
	for (let r = 0; r < e.length; ++r) {
		const t = e[r].vertexBuffer;
		C(t) && !t.isDestroyed() && t.vertexArrayDestroyable && t.destroy();
	}
	const t = this._indexBuffer;
	return C(t) && !t.isDestroyed() && t.vertexArrayDestroyable && t.destroy(), C(this._vao) && this._context.glDeleteVertexArray(this._vao), Me(this);
}, gc.prototype.copyFace = function(e, t, r, n) {
	const i = new ho({
		context: e.context,
		colorTextures: [t],
		destroyAttachments: !1
	});
	i._bind(), this[r].copyMipmapFromFramebuffer(0, 0, t.width, t.height, n ?? 0), i._unBind(), i.destroy();
}, gc.FaceName = Object.freeze({
	POSITIVEX: "positiveX",
	NEGATIVEX: "negativeX",
	POSITIVEY: "positiveY",
	NEGATIVEY: "negativeY",
	POSITIVEZ: "positiveZ",
	NEGATIVEZ: "negativeZ"
}), gc.faceNames = function() {
	return function* () {
		yield gc.FaceName.POSITIVEX, yield gc.FaceName.NEGATIVEX, yield gc.FaceName.POSITIVEY, yield gc.FaceName.NEGATIVEY, yield gc.FaceName.POSITIVEZ, yield gc.FaceName.NEGATIVEZ;
	}();
}, gc.loadFace = Ec, Object.defineProperties(gc.prototype, {
	positiveX: { get: function() {
		return this._positiveX;
	} },
	negativeX: { get: function() {
		return this._negativeX;
	} },
	positiveY: { get: function() {
		return this._positiveY;
	} },
	negativeY: { get: function() {
		return this._negativeY;
	} },
	positiveZ: { get: function() {
		return this._positiveZ;
	} },
	negativeZ: { get: function() {
		return this._negativeZ;
	} },
	sampler: {
		get: function() {
			return this._sampler;
		},
		set: function(e) {
			bc(this, e), this._sampler = e;
		}
	},
	pixelFormat: { get: function() {
		return this._pixelFormat;
	} },
	pixelDatatype: { get: function() {
		return this._pixelDatatype;
	} },
	width: { get: function() {
		return this._size;
	} },
	height: { get: function() {
		return this._size;
	} },
	sizeInBytes: { get: function() {
		return this._hasMipmap ? Math.floor(4 * this._sizeInBytes / 3) : this._sizeInBytes;
	} },
	preMultiplyAlpha: { get: function() {
		return this._preMultiplyAlpha;
	} },
	flipY: { get: function() {
		return this._flipY;
	} },
	_target: { get: function() {
		return this._textureTarget;
	} }
}), gc.getDirection = function(e, t) {
	switch (e) {
		case gc.FaceName.POSITIVEX: return z.clone(z.UNIT_X, t);
		case gc.FaceName.NEGATIVEX: return z.negate(z.UNIT_X, t);
		case gc.FaceName.POSITIVEY: return z.clone(z.UNIT_Y, t);
		case gc.FaceName.NEGATIVEY: return z.negate(z.UNIT_Y, t);
		case gc.FaceName.POSITIVEZ: return z.clone(z.UNIT_Z, t);
		case gc.FaceName.NEGATIVEZ: return z.negate(z.UNIT_Z, t);
	}
}, gc.prototype.loadMipmaps = function(e, t) {
	if (v.defined("source", e), !Array.isArray(e)) throw new N("source must be an array");
	const r = Math.log2(this._size);
	if (e.length !== r) throw new N("all mip levels must be defined");
	t = t ?? !1;
	const n = this._context._gl, i = this._texture, o = this._textureTarget;
	n.activeTexture(n.TEXTURE0), n.bindTexture(o, i), t ? n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL, n.NONE) : n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL, n.BROWSER_DEFAULT_WEBGL);
	for (let a = 0; a < e.length; a++) {
		const t = e[a], r = a + 1;
		for (const e of gc.faceNames()) Ec(this[e], t[e], r);
	}
	n.bindTexture(o, null), this._hasMipmap = !0;
}, gc.prototype.generateMipmap = function(e) {
	if (e = e ?? sc.DONT_CARE, this._size > 1 && !L.isPowerOfTwo(this._size)) throw new N("width and height must be a power of two to call generateMipmap().");
	if (!sc.validate(e)) throw new N("hint is invalid.");
	this._hasMipmap = !0;
	const t = this._context._gl, r = this._textureTarget;
	t.hint(t.GENERATE_MIPMAP_HINT, e), t.activeTexture(t.TEXTURE0), t.bindTexture(r, this._texture), t.generateMipmap(r), t.bindTexture(r, null);
}, gc.createVertexArray = function(e) {
	const t = La.createGeometry(La.fromDimensions({
		dimensions: new z(2, 2, 2),
		vertexFormat: Pa.POSITION_ONLY
	})), r = this._attributeLocations = Hs.createAttributeLocations(t);
	return dc.fromGeometry({
		context: e,
		geometry: t,
		attributeLocations: r,
		bufferUsage: Fe.STATIC_DRAW
	});
}, gc.prototype.isDestroyed = function() {
	return !1;
}, gc.prototype.destroy = function() {
	return this._context._gl.deleteTexture(this._texture), this._positiveX = Me(this._positiveX), this._negativeX = Me(this._negativeX), this._positiveY = Me(this._positiveY), this._negativeY = Me(this._negativeY), this._positiveZ = Me(this._positiveZ), this._negativeZ = Me(this._negativeZ), Me(this);
}, wc.create = function(e) {
	return new wc(e);
}, wc.fromFramebuffer = function(e) {
	e = e ?? J.EMPTY_OBJECT, v.defined("options.context", e.context);
	const t = e.context, { pixelFormat: r = uo.RGB, framebufferXOffset: n = 0, framebufferYOffset: i = 0, width: o = t.drawingBufferWidth, height: a = t.drawingBufferHeight, framebuffer: s } = e;
	if (!uo.validate(r)) throw new N("Invalid pixelFormat.");
	if (uo.isDepthFormat(r) || uo.isCompressedFormat(r)) throw new N("pixelFormat cannot be DEPTH_COMPONENT, DEPTH_STENCIL or a compressed format.");
	if (v.defined("options.context", t), v.typeOf.number.greaterThanOrEquals("framebufferXOffset", n, 0), v.typeOf.number.greaterThanOrEquals("framebufferYOffset", i, 0), n + o > t.drawingBufferWidth) throw new N("framebufferXOffset + width must be less than or equal to drawingBufferWidth");
	if (i + a > t.drawingBufferHeight) throw new N("framebufferYOffset + height must be less than or equal to drawingBufferHeight.");
	return new wc({
		context: t,
		width: o,
		height: a,
		pixelFormat: r,
		source: {
			framebuffer: C(s) ? s : t.defaultFramebuffer,
			xOffset: n,
			yOffset: i,
			width: o,
			height: a
		}
	});
}, Object.defineProperties(wc.prototype, {
	id: { get: function() {
		return this._id;
	} },
	sampler: {
		get: function() {
			return this._sampler;
		},
		set: function(e) {
			Rc(this, e), this._sampler = e;
		}
	},
	pixelFormat: { get: function() {
		return this._pixelFormat;
	} },
	pixelDatatype: { get: function() {
		return this._pixelDatatype;
	} },
	dimensions: { get: function() {
		return this._dimensions;
	} },
	preMultiplyAlpha: { get: function() {
		return this._preMultiplyAlpha;
	} },
	flipY: { get: function() {
		return this._flipY;
	} },
	width: { get: function() {
		return this._width;
	} },
	height: { get: function() {
		return this._height;
	} },
	sizeInBytes: { get: function() {
		return this._hasMipmap ? Math.floor(4 * this._sizeInBytes / 3) : this._sizeInBytes;
	} },
	_target: { get: function() {
		return this._textureTarget;
	} }
}), wc.prototype.copyFrom = function(e) {
	v.defined("options", e);
	const { xOffset: t = 0, yOffset: r = 0, source: n, skipColorSpaceConversion: i = !1 } = e;
	if (v.defined("options.source", n), uo.isDepthFormat(this._pixelFormat)) throw new N("Cannot call copyFrom when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL.");
	if (uo.isCompressedFormat(this._pixelFormat)) throw new N("Cannot call copyFrom with a compressed texture pixel format.");
	v.typeOf.number.greaterThanOrEquals("xOffset", t, 0), v.typeOf.number.greaterThanOrEquals("yOffset", r, 0), v.typeOf.number.lessThanOrEquals("xOffset + options.source.width", t + n.width, this._width), v.typeOf.number.lessThanOrEquals("yOffset + options.source.height", r + n.height, this._height);
	const o = this._context._gl, a = this._textureTarget;
	o.activeTexture(o.TEXTURE0), o.bindTexture(a, this._texture);
	let { width: s, height: u } = n;
	C(n.videoWidth) && C(n.videoHeight) ? (s = n.videoWidth, u = n.videoHeight) : C(n.naturalWidth) && C(n.naturalHeight) && (s = n.naturalWidth, u = n.naturalHeight), i ? o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL, o.NONE) : o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL, o.BROWSER_DEFAULT_WEBGL);
	let c = !1;
	this._initialized || (0 === t && 0 === r && s === this._width && u === this._height ? (C(n.arrayBufferView) ? Tc(this, n) : Oc(this, n), c = !0) : (o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL, !1), xc(this)), this._initialized = !0), c || (C(n.arrayBufferView) ? function(e, t, r, n, i, o) {
		const a = e._context, s = a._gl, { pixelFormat: u, pixelDatatype: c } = e, l = uo.alignmentInBytes(u, c, i);
		s.pixelStorei(s.UNPACK_ALIGNMENT, l), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), e.flipY && (t = uo.flipY(t, u, c, i, o)), s.texSubImage2D(e._textureTarget, 0, r, n, i, o, u, so.toWebGLConstant(c, a), t);
	}(this, n.arrayBufferView, t, r, s, u) : function(e, t, r, n) {
		const i = e._context, o = i._gl;
		o.pixelStorei(o.UNPACK_ALIGNMENT, 4), o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.preMultiplyAlpha), o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL, e.flipY), o.texSubImage2D(e._textureTarget, 0, r, n, e.pixelFormat, so.toWebGLConstant(e.pixelDatatype, i), t);
	}(this, n, t, r)), o.bindTexture(a, null);
}, wc.prototype.copyFromFramebuffer = function(e, t, r, n, i, o) {
	if (e = e ?? 0, t = t ?? 0, r = r ?? 0, n = n ?? 0, i = i ?? this._width, o = o ?? this._height, uo.isDepthFormat(this._pixelFormat)) throw new N("Cannot call copyFromFramebuffer when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL.");
	if (this._pixelDatatype === so.FLOAT) throw new N("Cannot call copyFromFramebuffer when the texture pixel data type is FLOAT.");
	if (this._pixelDatatype === so.HALF_FLOAT) throw new N("Cannot call copyFromFramebuffer when the texture pixel data type is HALF_FLOAT.");
	if (uo.isCompressedFormat(this._pixelFormat)) throw new N("Cannot call copyFrom with a compressed texture pixel format.");
	v.typeOf.number.greaterThanOrEquals("xOffset", e, 0), v.typeOf.number.greaterThanOrEquals("yOffset", t, 0), v.typeOf.number.greaterThanOrEquals("framebufferXOffset", r, 0), v.typeOf.number.greaterThanOrEquals("framebufferYOffset", n, 0), v.typeOf.number.lessThanOrEquals("xOffset + width", e + i, this._width), v.typeOf.number.lessThanOrEquals("yOffset + height", t + o, this._height);
	const a = this._context._gl, s = this._textureTarget;
	a.activeTexture(a.TEXTURE0), a.bindTexture(s, this._texture), a.copyTexSubImage2D(s, 0, e, t, r, n, i, o), a.bindTexture(s, null), this._initialized = !0;
}, wc.prototype.generateMipmap = function(e) {
	if (e = e ?? sc.DONT_CARE, uo.isDepthFormat(this._pixelFormat)) throw new N("Cannot call generateMipmap when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL.");
	if (uo.isCompressedFormat(this._pixelFormat)) throw new N("Cannot call generateMipmap with a compressed pixel format.");
	if (!this._context.webgl2) {
		if (this._width > 1 && !L.isPowerOfTwo(this._width)) throw new N("width must be a power of two to call generateMipmap() in a WebGL1 context.");
		if (this._height > 1 && !L.isPowerOfTwo(this._height)) throw new N("height must be a power of two to call generateMipmap() in a WebGL1 context.");
	}
	if (!sc.validate(e)) throw new N("hint is invalid.");
	this._hasMipmap = !0;
	const t = this._context._gl, r = this._textureTarget;
	t.hint(t.GENERATE_MIPMAP_HINT, e), t.activeTexture(t.TEXTURE0), t.bindTexture(r, this._texture), t.generateMipmap(r), t.bindTexture(r, null);
}, wc.prototype.isDestroyed = function() {
	return !1;
}, wc.prototype.destroy = function() {
	return this._context._gl.deleteTexture(this._texture), Me(this);
}, Object.defineProperties(Sc.prototype, {
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
}), Sc.packedLength = 2, Sc.pack = function(e, t, r) {
	if (!C(e)) throw new N("value is required");
	if (!C(t)) throw new N("array is required");
	return r = r ?? 0, t[r++] = e.near, t[r] = e.far, t;
}, Sc.unpack = function(e, t, r) {
	if (!C(e)) throw new N("array is required");
	return t = t ?? 0, C(r) || (r = new Sc()), r.near = e[t++], r.far = e[t], r;
}, Sc.equals = function(e, t) {
	return e === t || C(e) && C(t) && e.near === t.near && e.far === t.far;
}, Sc.clone = function(e, t) {
	if (C(e)) return C(t) || (t = new Sc()), t.near = e.near, t.far = e.far, t;
}, Sc.prototype.clone = function(e) {
	return Sc.clone(this, e);
}, Sc.prototype.equals = function(e) {
	return Sc.equals(this, e);
};
const Ic = {
	NONE: 0,
	CLAMP_TO_GROUND: 1,
	RELATIVE_TO_GROUND: 2,
	CLAMP_TO_TERRAIN: 3,
	RELATIVE_TO_TERRAIN: 4,
	CLAMP_TO_3D_TILE: 5,
	RELATIVE_TO_3D_TILE: 6
};
Object.freeze(Ic);
const Cc = {
	CENTER: 0,
	LEFT: 1,
	RIGHT: -1
};
Object.freeze(Cc);
const Nc = {
	CENTER: 0,
	BOTTOM: 1,
	BASELINE: 2,
	TOP: -1
};
Object.freeze(Nc);
const vc = {
	ADD: Ne.FUNC_ADD,
	SUBTRACT: Ne.FUNC_SUBTRACT,
	REVERSE_SUBTRACT: Ne.FUNC_REVERSE_SUBTRACT,
	MIN: Ne.MIN,
	MAX: Ne.MAX
};
Object.freeze(vc);
const Pc = {
	ZERO: Ne.ZERO,
	ONE: Ne.ONE,
	SOURCE_COLOR: Ne.SRC_COLOR,
	ONE_MINUS_SOURCE_COLOR: Ne.ONE_MINUS_SRC_COLOR,
	DESTINATION_COLOR: Ne.DST_COLOR,
	ONE_MINUS_DESTINATION_COLOR: Ne.ONE_MINUS_DST_COLOR,
	SOURCE_ALPHA: Ne.SRC_ALPHA,
	ONE_MINUS_SOURCE_ALPHA: Ne.ONE_MINUS_SRC_ALPHA,
	DESTINATION_ALPHA: Ne.DST_ALPHA,
	ONE_MINUS_DESTINATION_ALPHA: Ne.ONE_MINUS_DST_ALPHA,
	CONSTANT_COLOR: Ne.CONSTANT_COLOR,
	ONE_MINUS_CONSTANT_COLOR: Ne.ONE_MINUS_CONSTANT_COLOR,
	CONSTANT_ALPHA: Ne.CONSTANT_ALPHA,
	ONE_MINUS_CONSTANT_ALPHA: Ne.ONE_MINUS_CONSTANT_ALPHA,
	SOURCE_ALPHA_SATURATE: Ne.SRC_ALPHA_SATURATE
};
Object.freeze(Pc);
const Mc = {
	DISABLED: Object.freeze({ enabled: !1 }),
	ALPHA_BLEND: Object.freeze({
		enabled: !0,
		equationRgb: vc.ADD,
		equationAlpha: vc.ADD,
		functionSourceRgb: Pc.SOURCE_ALPHA,
		functionSourceAlpha: Pc.ONE,
		functionDestinationRgb: Pc.ONE_MINUS_SOURCE_ALPHA,
		functionDestinationAlpha: Pc.ONE_MINUS_SOURCE_ALPHA
	}),
	PRE_MULTIPLIED_ALPHA_BLEND: Object.freeze({
		enabled: !0,
		equationRgb: vc.ADD,
		equationAlpha: vc.ADD,
		functionSourceRgb: Pc.ONE,
		functionSourceAlpha: Pc.ONE,
		functionDestinationRgb: Pc.ONE_MINUS_SOURCE_ALPHA,
		functionDestinationAlpha: Pc.ONE_MINUS_SOURCE_ALPHA
	}),
	ADDITIVE_BLEND: Object.freeze({
		enabled: !0,
		equationRgb: vc.ADD,
		equationAlpha: vc.ADD,
		functionSourceRgb: Pc.SOURCE_ALPHA,
		functionSourceAlpha: Pc.ONE,
		functionDestinationRgb: Pc.ONE,
		functionDestinationAlpha: Pc.ONE
	})
};
Object.freeze(Mc);
const Lc = {
	FRONT: Ne.FRONT,
	BACK: Ne.BACK,
	FRONT_AND_BACK: Ne.FRONT_AND_BACK
};
function Fc(e) {
	e = e ?? J.EMPTY_OBJECT, this.material = e.material, this.translucent = e.translucent ?? !0, this._vertexShaderSource = e.vertexShaderSource, this._fragmentShaderSource = e.fragmentShaderSource, this._renderState = e.renderState, this._closed = e.closed ?? !1;
}
function Dc(e) {
	this.type = void 0, this.shaderSource = void 0, this.materials = void 0, this.uniforms = void 0, this._uniforms = void 0, this.translucent = void 0, this._minificationFilter = e.minificationFilter ?? cc.LINEAR, this._magnificationFilter = e.magnificationFilter ?? uc.LINEAR, this._strict = void 0, this._template = void 0, this._count = void 0, this._texturePaths = {}, this._loadedImages = [], this._loadedCubeMaps = [], this._textures = {}, this._updateFunctions = [], this._defaultTexture = void 0, this._initializationPromises = [], this._initializationError = void 0, function(e, t) {
		let r;
		e = e ?? J.EMPTY_OBJECT, t._strict = e.strict ?? !1, t._count = e.count ?? 0, t._template = xr(e.fabric ?? J.EMPTY_OBJECT), t.fabric = xr(e.fabric ?? J.EMPTY_OBJECT), t._template.uniforms = xr(t._template.uniforms ?? J.EMPTY_OBJECT), t._template.materials = xr(t._template.materials ?? J.EMPTY_OBJECT), t.type = C(t._template.type) ? t._template.type : ve(), t.shaderSource = "", t.materials = {}, t.uniforms = {}, t._uniforms = {}, t._translucentFunctions = [];
		const n = Dc._materialCache.getMaterial(t.type);
		if (C(n)) {
			const e = xr(n.fabric, !0);
			t._template = Rr(t._template, e, !0), r = n.translucent;
		}
		(function(e) {
			const t = e._template, r = t.uniforms, n = t.materials, i = t.components;
			if (C(i) && C(t.source)) throw new N("fabric: cannot have source and components in the same template.");
			Bc(t, qc, Uc, !0), Bc(i, Gc, Uc, !0);
			const o = [];
			for (const a in n) n.hasOwnProperty(a) && o.push(a);
			Bc(r, o, jc, !1);
		})(t), function(e) {
			const t = e._template.components, r = e._template.source;
			if (C(r)) e.shaderSource += `${r}\n`;
			else {
				if (e.shaderSource += "czm_material czm_getMaterial(czm_materialInput materialInput)\n{\n", e.shaderSource += "czm_material material = czm_getDefaultMaterial(materialInput);\n", C(t)) {
					const r = Object.keys(e._template.materials).length > 0;
					for (const n in t) if (t.hasOwnProperty(n)) if ("diffuse" === n || "emission" === n) {
						const i = r && kc(t[n], e) ? t[n] : `czm_gammaCorrect(${t[n]})`;
						e.shaderSource += `material.${n} = ${i}; \n`;
					} else e.shaderSource += "alpha" === n ? `material.alpha = ${t.alpha}; \n` : `material.${n} = ${t[n]};\n`;
				}
				e.shaderSource += "return material;\n}\n";
			}
		}(t), function(e) {
			const t = e._template.uniforms;
			for (const r in t) t.hasOwnProperty(r) && Xc(e, r);
		}(t), function(e) {
			const t = e._strict, r = e._template.materials;
			for (const n in r) if (r.hasOwnProperty(n)) {
				const i = new Dc({
					strict: t,
					fabric: r[n],
					count: e._count
				});
				e._count = i._count, e._uniforms = Rr(e._uniforms, i._uniforms, !0), e.materials[n] = i, e._translucentFunctions = e._translucentFunctions.concat(i._translucentFunctions);
				const o = "czm_getMaterial", a = `${o}_${e._count++}`;
				if ($c(i, o, a), e.shaderSource = i.shaderSource + e.shaderSource, 0 === $c(e, n, `${a}(materialInput)`) && t) throw new N(`strict: shader source does not use material '${n}'.`);
			}
		}(t), C(n) || Dc._materialCache.addMaterial(t.type, t);
		const i = 0 === t._translucentFunctions.length || void 0;
		if (r = r ?? i, r = e.translucent ?? r, C(r)) if ("function" == typeof r) {
			const e = function() {
				return r(t);
			};
			t._translucentFunctions.push(e);
		} else t._translucentFunctions.push(r);
	}(e, this), Object.defineProperties(this, {
		type: {
			value: this.type,
			writable: !1
		},
		minificationFilter: {
			get: function() {
				return this._minificationFilter;
			},
			set: function(e) {
				this._minificationFilter = e;
			}
		},
		magnificationFilter: {
			get: function() {
				return this._magnificationFilter;
			},
			set: function(e) {
				this._magnificationFilter = e;
			}
		}
	}), C(Dc._uniformList[this.type]) || (Dc._uniformList[this.type] = Object.keys(this._uniforms));
}
function zc(e, t) {
	t.push(...e._initializationPromises);
	const r = e.materials;
	for (const n in r) r.hasOwnProperty(n) && zc(r[n], t);
}
function Bc(e, t, r, n) {
	if (C(e)) {
		for (const i in e) if (e.hasOwnProperty(i)) {
			const e = -1 !== t.indexOf(i);
			(n && !e || !n && e) && r(i, t);
		}
	}
}
function Uc(e, t) {
	let r = `fabric: property name '${e}' is not valid. It should be `;
	for (let n = 0; n < t.length; n++) {
		const e = `'${t[n]}'`;
		r += n === t.length - 1 ? `or ${e}.` : `${e}, `;
	}
	throw new N(r);
}
function jc(e, t) {
	throw new N(`fabric: uniforms and materials cannot share the same property '${e}'`);
}
Object.freeze(Lc), Object.defineProperties(Fc.prototype, {
	vertexShaderSource: { get: function() {
		return this._vertexShaderSource;
	} },
	fragmentShaderSource: { get: function() {
		return this._fragmentShaderSource;
	} },
	renderState: { get: function() {
		return this._renderState;
	} },
	closed: { get: function() {
		return this._closed;
	} }
}), Fc.prototype.getFragmentShaderSource = function() {
	const e = [];
	return this.flat && e.push("#define FLAT"), this.faceForward && e.push("#define FACE_FORWARD"), C(this.material) && e.push(this.material.shaderSource), e.push(this.fragmentShaderSource), e.join("\n");
}, Fc.prototype.isTranslucent = function() {
	return C(this.material) && this.material.isTranslucent() || !C(this.material) && this.translucent;
}, Fc.prototype.getRenderState = function() {
	const e = this.isTranslucent(), t = xr(this.renderState, !1);
	return e ? (t.depthMask = !1, t.blending = Mc.ALPHA_BLEND) : t.depthMask = !0, t;
}, Fc.getDefaultRenderState = function(e, t, r) {
	let n = { depthTest: { enabled: !0 } };
	return e && (n.depthMask = !1, n.blending = Mc.ALPHA_BLEND), t && (n.cull = {
		enabled: !0,
		face: Lc.BACK
	}), C(r) && (n = Rr(r, n, !0)), n;
}, Dc._uniformList = {}, Dc.fromType = function(e, t) {
	if (!C(Dc._materialCache.getMaterial(e))) throw new N(`material with type '${e}' does not exist.`);
	const r = new Dc({ fabric: { type: e } });
	if (C(t)) for (const n in t) t.hasOwnProperty(n) && (r.uniforms[n] = t[n]);
	return r;
}, Dc.fromTypeAsync = async function(e, t) {
	if (!C(Dc._materialCache.getMaterial(e))) throw new N(`material with type '${e}' does not exist.`);
	const r = [], n = new Dc({ fabric: {
		type: e,
		uniforms: t
	} });
	if (zc(n, r), await Promise.all(r), r.length = 0, C(n._initializationError)) throw n._initializationError;
	return n;
}, Dc.prototype.isTranslucent = function() {
	if (C(this.translucent)) return "function" == typeof this.translucent ? this.translucent() : this.translucent;
	let e = !0;
	const t = this._translucentFunctions, r = t.length;
	for (let n = 0; n < r; ++n) {
		const r = t[n];
		if (e = "function" == typeof r ? e && r() : e && r, !e) break;
	}
	return e;
}, Dc.prototype.update = function(e) {
	let t, r;
	this._defaultTexture = e.defaultTexture;
	const n = this._loadedImages;
	let i = n.length;
	for (t = 0; t < i; ++t) {
		const i = n[t];
		r = i.id;
		let o, a = i.image;
		Array.isArray(a) && (o = a.slice(1, a.length).map(function(e) {
			return e.bufferView;
		}), a = a[0]);
		const s = new fc({
			minificationFilter: this._minificationFilter,
			magnificationFilter: this._magnificationFilter
		});
		let u;
		u = C(a.internalFormat) ? new wc({
			context: e,
			pixelFormat: a.internalFormat,
			width: a.width,
			height: a.height,
			source: {
				arrayBufferView: a.bufferView,
				mipLevels: o
			},
			sampler: s
		}) : new wc({
			context: e,
			source: a,
			sampler: s
		});
		const c = this._textures[r];
		C(c) && c !== this._defaultTexture && c.destroy(), this._textures[r] = u;
		const l = `${r}Dimensions`;
		if (this.uniforms.hasOwnProperty(l)) {
			const e = this.uniforms[l];
			e.x = u._width, e.y = u._height;
		}
	}
	n.length = 0;
	const o = this._loadedCubeMaps;
	for (i = o.length, t = 0; t < i; ++t) {
		const n = o[t];
		r = n.id;
		const i = n.images, a = new gc({
			context: e,
			source: {
				positiveX: i[0],
				negativeX: i[1],
				positiveY: i[2],
				negativeY: i[3],
				positiveZ: i[4],
				negativeZ: i[5]
			},
			sampler: new fc({
				minificationFilter: this._minificationFilter,
				magnificationFilter: this._magnificationFilter
			})
		});
		this._textures[r] = a;
	}
	o.length = 0;
	const a = this._updateFunctions;
	for (i = a.length, t = 0; t < i; ++t) a[t](this, e);
	const s = this.materials;
	for (const u in s) s.hasOwnProperty(u) && s[u].update(e);
}, Dc.prototype.isDestroyed = function() {
	return !1;
}, Dc.prototype.destroy = function() {
	const e = this._textures;
	for (const r in e) if (e.hasOwnProperty(r)) {
		const t = e[r];
		t !== this._defaultTexture && t.destroy();
	}
	const t = this.materials;
	for (const r in t) t.hasOwnProperty(r) && t[r].destroy();
	return Me(this);
};
const qc = [
	"type",
	"materials",
	"uniforms",
	"components",
	"source"
], Gc = [
	"diffuse",
	"specular",
	"shininess",
	"normal",
	"emission",
	"alpha"
];
function kc(e, t) {
	const r = t._template.materials;
	for (const n in r) if (r.hasOwnProperty(n) && e.indexOf(n) > -1) return !0;
	return !1;
}
const Wc = {
	mat2: po,
	mat3: ee,
	mat4: de
}, Vc = /\.ktx2$/i;
function Hc(e, t) {
	const r = e.uniforms[t];
	if (r === Dc.DefaultImageId) return Promise.resolve();
	const n = cn.createIfNeeded(r);
	if (!(n instanceof cn)) return Promise.resolve();
	const i = cn.createIfNeeded(e._texturePaths[t]);
	if (C(i) && i.url === n.url) return Promise.resolve();
	let o;
	return o = Vc.test(n.url) ? Wo(n.url) : n.fetchImage(), Promise.resolve(o).then(function(r) {
		e._loadedImages.push({
			id: t,
			image: r
		});
	}).catch(function(r) {
		e._initializationError = r;
		const n = e._textures[t];
		C(n) && n !== e._defaultTexture && n.destroy(), e._textures[t] = e._defaultTexture;
	}), e._texturePaths[t] = r, o;
}
function Yc(e, t) {
	const r = e.uniforms[t];
	if (r === Dc.DefaultCubeMapId) return Promise.resolve();
	const n = r.positiveX + r.negativeX + r.positiveY + r.negativeY + r.positiveZ + r.negativeZ;
	if (n === e._texturePaths[t]) return Promise.resolve();
	const i = [
		cn.createIfNeeded(r.positiveX).fetchImage(),
		cn.createIfNeeded(r.negativeX).fetchImage(),
		cn.createIfNeeded(r.positiveY).fetchImage(),
		cn.createIfNeeded(r.negativeY).fetchImage(),
		cn.createIfNeeded(r.positiveZ).fetchImage(),
		cn.createIfNeeded(r.negativeZ).fetchImage()
	], o = Promise.all(i);
	return o.then(function(r) {
		e._loadedCubeMaps.push({
			id: t,
			images: r
		});
	}).catch(function(t) {
		e._initializationError = t;
	}), e._texturePaths[t] = n, o;
}
function Xc(e, t) {
	const r = e._strict, n = e._template.uniforms, i = n[t], o = function(e) {
		let t = e.type;
		if (!C(t)) {
			const r = typeof e;
			if ("number" === r) t = "float";
			else if ("boolean" === r) t = "bool";
			else if ("string" === r || e instanceof cn || e instanceof HTMLCanvasElement || e instanceof HTMLImageElement || e instanceof ImageBitmap || e instanceof OffscreenCanvas) t = /^([rgba]){1,4}$/i.test(e) ? "channels" : e === Dc.DefaultCubeMapId ? "samplerCube" : "sampler2D";
			else if ("object" === r) if (Array.isArray(e)) 4 !== e.length && 9 !== e.length && 16 !== e.length || (t = `mat${Math.sqrt(e.length)}`);
			else {
				let r = 0;
				for (const t in e) e.hasOwnProperty(t) && (r += 1);
				r >= 2 && r <= 4 ? t = `vec${r}` : 6 === r && (t = "samplerCube");
			}
		}
		return t;
	}(i);
	if (!C(o)) throw new N(`fabric: uniform '${t}' has invalid type.`);
	let a;
	if ("channels" === o) {
		if (a = $c(e, t, i, !1), 0 === a && r) throw new N(`strict: shader source does not use channels '${t}'.`);
	} else {
		if ("sampler2D" === o) {
			const r = `${t}Dimensions`;
			(function(e, t) {
				return $c(e, t, t, void 0);
			})(e, r) > 0 && (n[r] = {
				type: "ivec3",
				x: 1,
				y: 1
			}, Xc(e, r));
		}
		new RegExp(`uniform\\s+${o}\\s+${t}\\s*;`).test(e.shaderSource) || (e.shaderSource = `uniform ${o} ${t};` + e.shaderSource);
		const s = `${t}_${e._count++}`;
		if (a = $c(e, t, s), 1 === a && r) throw new N(`strict: shader source does not use uniform '${t}'.`);
		if (e.uniforms[t] = i, "sampler2D" === o) e._uniforms[s] = function() {
			return e._textures[t];
		}, e._updateFunctions.push(function(e) {
			let t;
			return function(r, n) {
				const i = r.uniforms, o = i[e], a = t !== o, s = !C(o) || o === Dc.DefaultImageId;
				t = o;
				let u, c, l = r._textures[e];
				if (o instanceof HTMLVideoElement) if (o.readyState >= 2) {
					if (a && C(l) && (l !== n.defaultTexture && l.destroy(), l = void 0), !C(l) || l === n.defaultTexture) return l = new wc({
						context: n,
						source: o,
						sampler: new fc({
							minificationFilter: r._minificationFilter,
							magnificationFilter: r._magnificationFilter
						})
					}), void (r._textures[e] = l);
					l.copyFrom({ source: o });
				} else C(l) || (r._textures[e] = n.defaultTexture);
				else {
					if (o instanceof wc && o !== l) {
						r._texturePaths[e] = void 0;
						const t = r._textures[e];
						C(t) && t !== r._defaultTexture && t.destroy(), r._textures[e] = o, u = `${e}Dimensions`, i.hasOwnProperty(u) && (c = i[u], c.x = o._width, c.y = o._height);
						return;
					}
					if (a && C(l) && s && (l !== r._defaultTexture && l.destroy(), l = void 0, r._texturePaths[e] = void 0), C(l) || (l = r._textures[e] = r._defaultTexture, u = `${e}Dimensions`, i.hasOwnProperty(u) && (c = i[u], c.x = l._width, c.y = l._height)), !s) return (o instanceof HTMLCanvasElement || o instanceof HTMLImageElement || o instanceof ImageBitmap || o instanceof OffscreenCanvas) && o !== r._texturePaths[e] ? (r._loadedImages.push({
						id: e,
						image: o
					}), void (r._texturePaths[e] = o)) : void Hc(r, e);
				}
			};
		}(t)), e._initializationPromises.push(Hc(e, t));
		else if ("samplerCube" === o) e._uniforms[s] = function() {
			return e._textures[t];
		}, e._updateFunctions.push(function(e) {
			return function(t, r) {
				const n = t.uniforms[e];
				if (n instanceof gc) {
					const r = t._textures[e];
					r !== t._defaultTexture && r.destroy(), t._texturePaths[e] = void 0, t._textures[e] = n;
					return;
				}
				C(t._textures[e]) || (t._textures[e] = r.defaultCubeMap), Yc(t, e);
			};
		}(t)), e._initializationPromises.push(Yc(e, t));
		else if (-1 !== o.indexOf("mat")) {
			const r = new Wc[o]();
			e._uniforms[s] = function() {
				return Wc[o].fromColumnMajorArray(e.uniforms[t], r);
			};
		} else e._uniforms[s] = function() {
			return e.uniforms[t];
		};
	}
}
function $c(e, t, r, n) {
	n = n ?? !0;
	let i = 0;
	const o = new RegExp(`([\\w${n ? "." : ""}])?` + t + "([\\w])?", "g");
	return e.shaderSource = e.shaderSource.replace(o, function(e, t, n) {
		return t || n ? e : (i += 1, r);
	}), i;
}
function Kc(e) {
	const t = (e = e ?? J.EMPTY_OBJECT).translucent ?? !0, r = !1, n = Kc.VERTEX_FORMAT;
	this.material = C(e.material) ? e.material : Dc.fromType(Dc.ColorType), this.translucent = t, this._vertexShaderSource = e.vertexShaderSource ?? "#define CLIP_POLYLINE \nvoid clipLineSegmentToNearPlane(\n    vec3 p0,\n    vec3 p1,\n    out vec4 positionWC,\n    out bool clipped,\n    out bool culledByNearPlane,\n    out vec4 clippedPositionEC)\n{\n    culledByNearPlane = false;\n    clipped = false;\n\n    vec3 p0ToP1 = p1 - p0;\n    float magnitude = length(p0ToP1);\n    vec3 direction = normalize(p0ToP1);\n\n    // Distance that p0 is behind the near plane. Negative means p0 is\n    // in front of the near plane.\n    float endPoint0Distance =  czm_currentFrustum.x + p0.z;\n\n    // Camera looks down -Z.\n    // When moving a point along +Z: LESS VISIBLE\n    //   * Points in front of the camera move closer to the camera.\n    //   * Points behind the camrea move farther away from the camera.\n    // When moving a point along -Z: MORE VISIBLE\n    //   * Points in front of the camera move farther away from the camera.\n    //   * Points behind the camera move closer to the camera.\n\n    // Positive denominator: -Z, becoming more visible\n    // Negative denominator: +Z, becoming less visible\n    // Nearly zero: parallel to near plane\n    float denominator = -direction.z;\n\n    if (endPoint0Distance > 0.0 && abs(denominator) < czm_epsilon7)\n    {\n        // p0 is behind the near plane and the line to p1 is nearly parallel to\n        // the near plane, so cull the segment completely.\n        culledByNearPlane = true;\n    }\n    else if (endPoint0Distance > 0.0)\n    {\n        // p0 is behind the near plane, and the line to p1 is moving distinctly\n        // toward or away from it.\n\n        // t = (-plane distance - dot(plane normal, ray origin)) / dot(plane normal, ray direction)\n        float t = endPoint0Distance / denominator;\n        if (t < 0.0 || t > magnitude)\n        {\n            // Near plane intersection is not between the two points.\n            // We already confirmed p0 is behind the naer plane, so now\n            // we know the entire segment is behind it.\n            culledByNearPlane = true;\n        }\n        else\n        {\n            // Segment crosses the near plane, update p0 to lie exactly on it.\n            p0 = p0 + t * direction;\n\n            // Numerical noise might put us a bit on the wrong side of the near plane.\n            // Don't let that happen.\n            p0.z = min(p0.z, -czm_currentFrustum.x);\n\n            clipped = true;\n        }\n    }\n\n    clippedPositionEC = vec4(p0, 1.0);\n    positionWC = czm_eyeToWindowCoordinates(clippedPositionEC);\n}\n\nvec4 getPolylineWindowCoordinatesEC(vec4 positionEC, vec4 prevEC, vec4 nextEC, float expandDirection, float width, bool usePrevious, out float angle)\n{\n    // expandDirection +1 is to the _left_ when looking from positionEC toward nextEC.\n\n#ifdef POLYLINE_DASH\n    // Compute the window coordinates of the points.\n    vec4 positionWindow = czm_eyeToWindowCoordinates(positionEC);\n    vec4 previousWindow = czm_eyeToWindowCoordinates(prevEC);\n    vec4 nextWindow = czm_eyeToWindowCoordinates(nextEC);\n\n    // Determine the relative screen space direction of the line.\n    vec2 lineDir;\n    if (usePrevious) {\n        lineDir = normalize(positionWindow.xy - previousWindow.xy);\n    }\n    else {\n        lineDir = normalize(nextWindow.xy - positionWindow.xy);\n    }\n    angle = atan(lineDir.x, lineDir.y) - 1.570796327; // precomputed atan(1,0)\n\n    // Quantize the angle so it doesn't change rapidly between segments.\n    angle = floor(angle / czm_piOverFour + 0.5) * czm_piOverFour;\n#endif\n\n    vec4 clippedPrevWC, clippedPrevEC;\n    bool prevSegmentClipped, prevSegmentCulled;\n    clipLineSegmentToNearPlane(prevEC.xyz, positionEC.xyz, clippedPrevWC, prevSegmentClipped, prevSegmentCulled, clippedPrevEC);\n\n    vec4 clippedNextWC, clippedNextEC;\n    bool nextSegmentClipped, nextSegmentCulled;\n    clipLineSegmentToNearPlane(nextEC.xyz, positionEC.xyz, clippedNextWC, nextSegmentClipped, nextSegmentCulled, clippedNextEC);\n\n    bool segmentClipped, segmentCulled;\n    vec4 clippedPositionWC, clippedPositionEC;\n    clipLineSegmentToNearPlane(positionEC.xyz, usePrevious ? prevEC.xyz : nextEC.xyz, clippedPositionWC, segmentClipped, segmentCulled, clippedPositionEC);\n\n    if (segmentCulled)\n    {\n        return vec4(0.0, 0.0, 0.0, 1.0);\n    }\n\n    vec2 directionToPrevWC = normalize(clippedPrevWC.xy - clippedPositionWC.xy);\n    vec2 directionToNextWC = normalize(clippedNextWC.xy - clippedPositionWC.xy);\n\n    // If a segment was culled, we can't use the corresponding direction\n    // computed above. We should never see both of these be true without\n    // `segmentCulled` above also being true.\n    if (prevSegmentCulled)\n    {\n        directionToPrevWC = -directionToNextWC;\n    }\n    else if (nextSegmentCulled)\n    {\n        directionToNextWC = -directionToPrevWC;\n    }\n\n    vec2 thisSegmentForwardWC, otherSegmentForwardWC;\n    if (usePrevious)\n    {\n        thisSegmentForwardWC = -directionToPrevWC;\n        otherSegmentForwardWC = directionToNextWC;\n    }\n    else\n    {\n        thisSegmentForwardWC = directionToNextWC;\n        otherSegmentForwardWC =  -directionToPrevWC;\n    }\n\n    vec2 thisSegmentLeftWC = vec2(-thisSegmentForwardWC.y, thisSegmentForwardWC.x);\n\n    vec2 leftWC = thisSegmentLeftWC;\n    float expandWidth = width * 0.5;\n\n    // When lines are split at the anti-meridian, the position may be at the\n    // same location as the next or previous position, and we need to handle\n    // that to avoid producing NaNs.\n    if (!czm_equalsEpsilon(prevEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1) && !czm_equalsEpsilon(nextEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1))\n    {\n        vec2 otherSegmentLeftWC = vec2(-otherSegmentForwardWC.y, otherSegmentForwardWC.x);\n\n        vec2 leftSumWC = thisSegmentLeftWC + otherSegmentLeftWC;\n        float leftSumLength = length(leftSumWC);\n        leftWC = leftSumLength < czm_epsilon6 ? thisSegmentLeftWC : (leftSumWC / leftSumLength);\n\n        // The sine of the angle between the two vectors is given by the formula\n        //         |a x b| = |a||b|sin(theta)\n        // which is\n        //     float sinAngle = length(cross(vec3(leftWC, 0.0), vec3(-thisSegmentForwardWC, 0.0)));\n        // Because the z components of both vectors are zero, the x and y coordinate will be zero.\n        // Therefore, the sine of the angle is just the z component of the cross product.\n        vec2 u = -thisSegmentForwardWC;\n        vec2 v = leftWC;\n        float sinAngle = abs(u.x * v.y - u.y * v.x);\n        expandWidth = clamp(expandWidth / sinAngle, 0.0, width * 2.0);\n    }\n\n    vec2 offset = leftWC * expandDirection * expandWidth * czm_pixelRatio;\n    return vec4(clippedPositionWC.xy + offset, -clippedPositionWC.z, 1.0) * (czm_projection * clippedPositionEC).w;\n}\n\nvec4 getPolylineWindowCoordinates(vec4 position, vec4 previous, vec4 next, float expandDirection, float width, bool usePrevious, out float angle)\n{\n    vec4 positionEC = czm_modelViewRelativeToEye * position;\n    vec4 prevEC = czm_modelViewRelativeToEye * previous;\n    vec4 nextEC = czm_modelViewRelativeToEye * next;\n    return getPolylineWindowCoordinatesEC(positionEC, prevEC, nextEC, expandDirection, width, usePrevious, angle);\n}\n\nin vec3 position3DHigh;\nin vec3 position3DLow;\nin vec3 prevPosition3DHigh;\nin vec3 prevPosition3DLow;\nin vec3 nextPosition3DHigh;\nin vec3 nextPosition3DLow;\nin vec2 expandAndWidth;\nin vec2 st;\nin float batchId;\n\nout float v_width;\nout vec2 v_st;\nout float v_polylineAngle;\n\nvoid main()\n{\n    float expandDir = expandAndWidth.x;\n    float width = abs(expandAndWidth.y) + 0.5;\n    bool usePrev = expandAndWidth.y < 0.0;\n\n    vec4 p = czm_computePosition();\n    vec4 prev = czm_computePrevPosition();\n    vec4 next = czm_computeNextPosition();\n\n    float angle;\n    vec4 positionWC = getPolylineWindowCoordinates(p, prev, next, expandDir, width, usePrev, angle);\n    gl_Position = czm_viewportOrthographic * positionWC;\n\n    v_width = width;\n    v_st.s = st.s;\n    v_st.t = czm_writeNonPerspective(st.t, gl_Position.w);\n    v_polylineAngle = angle;\n}\n", this._fragmentShaderSource = e.fragmentShaderSource ?? "#ifdef VECTOR_TILE\nuniform vec4 u_highlightColor;\n#endif\n\nin vec2 v_st;\n\nvoid main()\n{\n    czm_materialInput materialInput;\n\n    vec2 st = v_st;\n    st.t = czm_readNonPerspective(st.t, gl_FragCoord.w);\n\n    materialInput.s = st.s;\n    materialInput.st = st;\n    materialInput.str = vec3(st, 0.0);\n\n    czm_material material = czm_getMaterial(materialInput);\n    out_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n#ifdef VECTOR_TILE\n    out_FragColor *= u_highlightColor;\n#endif\n\n    czm_writeLogDepth();\n}\n", this._renderState = Fc.getDefaultRenderState(t, r, e.renderState), this._closed = r, this._vertexFormat = n;
}
Dc._materialCache = {
	_materials: {},
	addMaterial: function(e, t) {
		this._materials[e] = t;
	},
	getMaterial: function(e) {
		return this._materials[e];
	}
}, Dc.DefaultImageId = "czm_defaultImage", Dc.DefaultCubeMapId = "czm_defaultCubeMap", Dc.ColorType = "Color", Dc._materialCache.addMaterial(Dc.ColorType, {
	fabric: {
		type: Dc.ColorType,
		uniforms: { color: new pt(1, 0, 0, .5) },
		components: {
			diffuse: "color.rgb",
			alpha: "color.a"
		}
	},
	translucent: function(e) {
		return e.uniforms.color.alpha < 1;
	}
}), Dc.ImageType = "Image", Dc._materialCache.addMaterial(Dc.ImageType, {
	fabric: {
		type: Dc.ImageType,
		uniforms: {
			image: Dc.DefaultImageId,
			repeat: new wt(1, 1),
			color: new pt(1, 1, 1, 1)
		},
		components: {
			diffuse: "texture(image, fract(repeat * materialInput.st)).rgb * color.rgb",
			alpha: "texture(image, fract(repeat * materialInput.st)).a * color.a"
		}
	},
	translucent: function(e) {
		return e.uniforms.color.alpha < 1;
	}
}), Dc.DiffuseMapType = "DiffuseMap", Dc._materialCache.addMaterial(Dc.DiffuseMapType, {
	fabric: {
		type: Dc.DiffuseMapType,
		uniforms: {
			image: Dc.DefaultImageId,
			channels: "rgb",
			repeat: new wt(1, 1)
		},
		components: { diffuse: "texture(image, fract(repeat * materialInput.st)).channels" }
	},
	translucent: !1
}), Dc.AlphaMapType = "AlphaMap", Dc._materialCache.addMaterial(Dc.AlphaMapType, {
	fabric: {
		type: Dc.AlphaMapType,
		uniforms: {
			image: Dc.DefaultImageId,
			channel: "a",
			repeat: new wt(1, 1)
		},
		components: { alpha: "texture(image, fract(repeat * materialInput.st)).channel" }
	},
	translucent: !0
}), Dc.SpecularMapType = "SpecularMap", Dc._materialCache.addMaterial(Dc.SpecularMapType, {
	fabric: {
		type: Dc.SpecularMapType,
		uniforms: {
			image: Dc.DefaultImageId,
			channel: "r",
			repeat: new wt(1, 1)
		},
		components: { specular: "texture(image, fract(repeat * materialInput.st)).channel" }
	},
	translucent: !1
}), Dc.EmissionMapType = "EmissionMap", Dc._materialCache.addMaterial(Dc.EmissionMapType, {
	fabric: {
		type: Dc.EmissionMapType,
		uniforms: {
			image: Dc.DefaultImageId,
			channels: "rgb",
			repeat: new wt(1, 1)
		},
		components: { emission: "texture(image, fract(repeat * materialInput.st)).channels" }
	},
	translucent: !1
}), Dc.BumpMapType = "BumpMap", Dc._materialCache.addMaterial(Dc.BumpMapType, {
	fabric: {
		type: Dc.BumpMapType,
		uniforms: {
			image: Dc.DefaultImageId,
			channel: "r",
			strength: .8,
			repeat: new wt(1, 1)
		},
		source: "uniform sampler2D image;\nuniform float strength;\nuniform vec2 repeat;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    vec2 st = materialInput.st;\n\n    vec2 centerPixel = fract(repeat * st);\n    float centerBump = texture(image, centerPixel).channel;\n\n    float imageWidth = float(imageDimensions.x);\n    vec2 rightPixel = fract(repeat * (st + vec2(1.0 / imageWidth, 0.0)));\n    float rightBump = texture(image, rightPixel).channel;\n\n    float imageHeight = float(imageDimensions.y);\n    vec2 leftPixel = fract(repeat * (st + vec2(0.0, 1.0 / imageHeight)));\n    float topBump = texture(image, leftPixel).channel;\n\n    vec3 normalTangentSpace = normalize(vec3(centerBump - rightBump, centerBump - topBump, clamp(1.0 - strength, 0.1, 1.0)));\n    vec3 normalEC = materialInput.tangentToEyeMatrix * normalTangentSpace;\n\n    material.normal = normalEC;\n    material.diffuse = vec3(0.01);\n\n    return material;\n}\n"
	},
	translucent: !1
}), Dc.NormalMapType = "NormalMap", Dc._materialCache.addMaterial(Dc.NormalMapType, {
	fabric: {
		type: Dc.NormalMapType,
		uniforms: {
			image: Dc.DefaultImageId,
			channels: "rgb",
			strength: .8,
			repeat: new wt(1, 1)
		},
		source: "uniform sampler2D image;\nuniform float strength;\nuniform vec2 repeat;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    \n    vec4 textureValue = texture(image, fract(repeat * materialInput.st));\n    vec3 normalTangentSpace = textureValue.channels;\n    normalTangentSpace.xy = normalTangentSpace.xy * 2.0 - 1.0;\n    normalTangentSpace.z = clamp(1.0 - strength, 0.1, 1.0);\n    normalTangentSpace = normalize(normalTangentSpace);\n    vec3 normalEC = materialInput.tangentToEyeMatrix * normalTangentSpace;\n    \n    material.normal = normalEC;\n    \n    return material;\n}\n"
	},
	translucent: !1
}), Dc.GridType = "Grid", Dc._materialCache.addMaterial(Dc.GridType, {
	fabric: {
		type: Dc.GridType,
		uniforms: {
			color: new pt(0, 1, 0, 1),
			cellAlpha: .1,
			lineCount: new wt(8, 8),
			lineThickness: new wt(1, 1),
			lineOffset: new wt(0, 0)
		},
		source: "uniform vec4 color;\nuniform float cellAlpha;\nuniform vec2 lineCount;\nuniform vec2 lineThickness;\nuniform vec2 lineOffset;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    vec2 st = materialInput.st;\n\n    float scaledWidth = fract(lineCount.s * st.s - lineOffset.s);\n    scaledWidth = abs(scaledWidth - floor(scaledWidth + 0.5));\n    float scaledHeight = fract(lineCount.t * st.t - lineOffset.t);\n    scaledHeight = abs(scaledHeight - floor(scaledHeight + 0.5));\n\n    float value;\n\n    // Fuzz Factor - Controls blurriness of lines\n#if (__VERSION__ == 300 || defined(GL_OES_standard_derivatives))\n    const float fuzz = 1.2;\n    vec2 thickness = (lineThickness * czm_pixelRatio) - 1.0;\n\n    // From \"3D Engine Design for Virtual Globes\" by Cozzi and Ring, Listing 4.13.\n    vec2 dx = abs(dFdx(st));\n    vec2 dy = abs(dFdy(st));\n    vec2 dF = vec2(max(dx.s, dy.s), max(dx.t, dy.t)) * lineCount;\n    value = min(\n        smoothstep(dF.s * thickness.s, dF.s * (fuzz + thickness.s), scaledWidth),\n        smoothstep(dF.t * thickness.t, dF.t * (fuzz + thickness.t), scaledHeight));\n#else\n    // If no derivatives available (IE 10?), revert to view-dependent fuzz\n    const float fuzz = 0.05;\n\n    vec2 range = 0.5 - (lineThickness * 0.05);\n    value = min(\n        1.0 - smoothstep(range.s, range.s + fuzz, scaledWidth),\n        1.0 - smoothstep(range.t, range.t + fuzz, scaledHeight));\n#endif\n\n    // Edges taken from RimLightingMaterial.glsl\n    // See http://www.fundza.com/rman_shaders/surface/fake_rim/fake_rim1.html\n    float dRim = 1.0 - abs(dot(materialInput.normalEC, normalize(materialInput.positionToEyeEC)));\n    float sRim = smoothstep(0.8, 1.0, dRim);\n    value *= (1.0 - sRim);\n\n    vec4 halfColor;\n    halfColor.rgb = color.rgb * 0.5;\n    halfColor.a = color.a * (1.0 - ((1.0 - cellAlpha) * value));\n    halfColor = czm_gammaCorrect(halfColor);\n    material.diffuse = halfColor.rgb;\n    material.emission = halfColor.rgb;\n    material.alpha = halfColor.a;\n\n    return material;\n}\n"
	},
	translucent: function(e) {
		const t = e.uniforms;
		return t.color.alpha < 1 || t.cellAlpha < 1;
	}
}), Dc.StripeType = "Stripe", Dc._materialCache.addMaterial(Dc.StripeType, {
	fabric: {
		type: Dc.StripeType,
		uniforms: {
			horizontal: !0,
			evenColor: new pt(1, 1, 1, .5),
			oddColor: new pt(0, 0, 1, .5),
			offset: 0,
			repeat: 5
		},
		source: "uniform vec4 evenColor;\nuniform vec4 oddColor;\nuniform float offset;\nuniform float repeat;\nuniform bool horizontal;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    // Based on the Stripes Fragment Shader in the Orange Book (11.1.2)\n    float coord = mix(materialInput.st.s, materialInput.st.t, float(horizontal));\n    float value = fract((coord - offset) * (repeat * 0.5));\n    float dist = min(value, min(abs(value - 0.5), 1.0 - value));\n\n    vec4 currentColor = mix(evenColor, oddColor, step(0.5, value));\n    vec4 color = czm_antialias(evenColor, oddColor, currentColor, dist);\n    color = czm_gammaCorrect(color);\n\n    material.diffuse = color.rgb;\n    material.alpha = color.a;\n\n    return material;\n}\n"
	},
	translucent: function(e) {
		const t = e.uniforms;
		return t.evenColor.alpha < 1 || t.oddColor.alpha < 1;
	}
}), Dc.CheckerboardType = "Checkerboard", Dc._materialCache.addMaterial(Dc.CheckerboardType, {
	fabric: {
		type: Dc.CheckerboardType,
		uniforms: {
			lightColor: new pt(1, 1, 1, .5),
			darkColor: new pt(0, 0, 0, .5),
			repeat: new wt(5, 5)
		},
		source: "uniform vec4 lightColor;\nuniform vec4 darkColor;\nuniform vec2 repeat;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    vec2 st = materialInput.st;\n\n    // From Stefan Gustavson's Procedural Textures in GLSL in OpenGL Insights\n    float b = mod(floor(repeat.s * st.s) + floor(repeat.t * st.t), 2.0);  // 0.0 or 1.0\n\n    // Find the distance from the closest separator (region between two colors)\n    float scaledWidth = fract(repeat.s * st.s);\n    scaledWidth = abs(scaledWidth - floor(scaledWidth + 0.5));\n    float scaledHeight = fract(repeat.t * st.t);\n    scaledHeight = abs(scaledHeight - floor(scaledHeight + 0.5));\n    float value = min(scaledWidth, scaledHeight);\n\n    vec4 currentColor = mix(lightColor, darkColor, b);\n    vec4 color = czm_antialias(lightColor, darkColor, currentColor, value, 0.03);\n\n    color = czm_gammaCorrect(color);\n    material.diffuse = color.rgb;\n    material.alpha = color.a;\n\n    return material;\n}\n"
	},
	translucent: function(e) {
		const t = e.uniforms;
		return t.lightColor.alpha < 1 || t.darkColor.alpha < 1;
	}
}), Dc.DotType = "Dot", Dc._materialCache.addMaterial(Dc.DotType, {
	fabric: {
		type: Dc.DotType,
		uniforms: {
			lightColor: new pt(1, 1, 0, .75),
			darkColor: new pt(0, 1, 1, .75),
			repeat: new wt(5, 5)
		},
		source: "uniform vec4 lightColor;\nuniform vec4 darkColor;\nuniform vec2 repeat;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    // From Stefan Gustavson's Procedural Textures in GLSL in OpenGL Insights\n    float b = smoothstep(0.3, 0.32, length(fract(repeat * materialInput.st) - 0.5));  // 0.0 or 1.0\n\n    vec4 color = mix(lightColor, darkColor, b);\n    color = czm_gammaCorrect(color);\n    material.diffuse = color.rgb;\n    material.alpha = color.a;\n\n    return material;\n}\n"
	},
	translucent: function(e) {
		const t = e.uniforms;
		return t.lightColor.alpha < 1 || t.darkColor.alpha < 1;
	}
}), Dc.WaterType = "Water", Dc._materialCache.addMaterial(Dc.WaterType, {
	fabric: {
		type: Dc.WaterType,
		uniforms: {
			baseWaterColor: new pt(.2, .3, .6, 1),
			blendColor: new pt(0, 1, .699, 1),
			specularMap: Dc.DefaultImageId,
			normalMap: Dc.DefaultImageId,
			frequency: 10,
			animationSpeed: .01,
			amplitude: 1,
			specularIntensity: .5,
			fadeFactor: 1
		},
		source: "// Thanks for the contribution Jonas\n// http://29a.ch/2012/7/19/webgl-terrain-rendering-water-fog\n\nuniform sampler2D specularMap;\nuniform sampler2D normalMap;\nuniform vec4 baseWaterColor;\nuniform vec4 blendColor;\nuniform float frequency;\nuniform float animationSpeed;\nuniform float amplitude;\nuniform float specularIntensity;\nuniform float fadeFactor;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    float time = czm_frameNumber * animationSpeed;\n\n    // fade is a function of the distance from the fragment and the frequency of the waves\n    float fade = max(1.0, (length(materialInput.positionToEyeEC) / 10000000000.0) * frequency * fadeFactor);\n\n    float specularMapValue = texture(specularMap, materialInput.st).r;\n\n    // note: not using directional motion at this time, just set the angle to 0.0;\n    vec4 noise = czm_getWaterNoise(normalMap, materialInput.st * frequency, time, 0.0);\n    vec3 normalTangentSpace = noise.xyz * vec3(1.0, 1.0, (1.0 / amplitude));\n\n    // fade out the normal perturbation as we move further from the water surface\n    normalTangentSpace.xy /= fade;\n\n    // attempt to fade out the normal perturbation as we approach non water areas (low specular map value)\n    normalTangentSpace = mix(vec3(0.0, 0.0, 50.0), normalTangentSpace, specularMapValue);\n\n    normalTangentSpace = normalize(normalTangentSpace);\n\n    // get ratios for alignment of the new normal vector with a vector perpendicular to the tangent plane\n    float tsPerturbationRatio = clamp(dot(normalTangentSpace, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);\n\n    // fade out water effect as specular map value decreases\n    material.alpha = mix(blendColor.a, baseWaterColor.a, specularMapValue) * specularMapValue;\n\n    // base color is a blend of the water and non-water color based on the value from the specular map\n    // may need a uniform blend factor to better control this\n    material.diffuse = mix(blendColor.rgb, baseWaterColor.rgb, specularMapValue);\n\n    // diffuse highlights are based on how perturbed the normal is\n    material.diffuse += (0.1 * tsPerturbationRatio);\n\n    material.diffuse = material.diffuse;\n\n    material.normal = normalize(materialInput.tangentToEyeMatrix * normalTangentSpace);\n\n    material.specular = specularIntensity;\n    material.shininess = 10.0;\n\n    return material;\n}\n"
	},
	translucent: function(e) {
		const t = e.uniforms;
		return t.baseWaterColor.alpha < 1 || t.blendColor.alpha < 1;
	}
}), Dc.RimLightingType = "RimLighting", Dc._materialCache.addMaterial(Dc.RimLightingType, {
	fabric: {
		type: Dc.RimLightingType,
		uniforms: {
			color: new pt(1, 0, 0, .7),
			rimColor: new pt(1, 1, 1, .4),
			width: .3
		},
		source: "uniform vec4 color;\nuniform vec4 rimColor;\nuniform float width;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    // See http://www.fundza.com/rman_shaders/surface/fake_rim/fake_rim1.html\n    float d = 1.0 - dot(materialInput.normalEC, normalize(materialInput.positionToEyeEC));\n    float s = smoothstep(1.0 - width, 1.0, d);\n\n    vec4 outColor = czm_gammaCorrect(color);\n    vec4 outRimColor = czm_gammaCorrect(rimColor);\n\n    material.diffuse = outColor.rgb;\n    material.emission = outRimColor.rgb * s;\n    material.alpha = mix(outColor.a, outRimColor.a, s);\n\n    return material;\n}\n"
	},
	translucent: function(e) {
		const t = e.uniforms;
		return t.color.alpha < 1 || t.rimColor.alpha < 1;
	}
}), Dc.FadeType = "Fade", Dc._materialCache.addMaterial(Dc.FadeType, {
	fabric: {
		type: Dc.FadeType,
		uniforms: {
			fadeInColor: new pt(1, 0, 0, 1),
			fadeOutColor: new pt(0, 0, 0, 0),
			maximumDistance: .5,
			repeat: !0,
			fadeDirection: {
				x: !0,
				y: !0
			},
			time: new wt(.5, .5)
		},
		source: "uniform vec4 fadeInColor;\nuniform vec4 fadeOutColor;\nuniform float maximumDistance;\nuniform bool repeat;\nuniform vec2 fadeDirection;\nuniform vec2 time;\n\nfloat getTime(float t, float coord)\n{\n    float scalar = 1.0 / maximumDistance;\n    float q  = distance(t, coord) * scalar;\n    if (repeat)\n    {\n        float r = distance(t, coord + 1.0) * scalar;\n        float s = distance(t, coord - 1.0) * scalar;\n        q = min(min(r, s), q);\n    }\n    return clamp(q, 0.0, 1.0);\n}\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    vec2 st = materialInput.st;\n    float s = getTime(time.x, st.s) * fadeDirection.s;\n    float t = getTime(time.y, st.t) * fadeDirection.t;\n\n    float u = length(vec2(s, t));\n    vec4 color = mix(fadeInColor, fadeOutColor, u);\n\n    color = czm_gammaCorrect(color);\n    material.emission = color.rgb;\n    material.alpha = color.a;\n\n    return material;\n}\n"
	},
	translucent: function(e) {
		const t = e.uniforms;
		return t.fadeInColor.alpha < 1 || t.fadeOutColor.alpha < 1;
	}
}), Dc.PolylineArrowType = "PolylineArrow", Dc._materialCache.addMaterial(Dc.PolylineArrowType, {
	fabric: {
		type: Dc.PolylineArrowType,
		uniforms: { color: new pt(1, 1, 1, 1) },
		source: "uniform vec4 color;\n\nfloat getPointOnLine(vec2 p0, vec2 p1, float x)\n{\n    float slope = (p0.y - p1.y) / (p0.x - p1.x);\n    return slope * (x - p0.x) + p0.y;\n}\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    vec2 st = materialInput.st;\n\n#if (__VERSION__ == 300 || defined(GL_OES_standard_derivatives))\n    float base = 1.0 - abs(fwidth(st.s)) * 10.0 * czm_pixelRatio;\n#else\n     // If no derivatives available (IE 10?), 2.5% of the line will be the arrow head\n    float base = 0.975;\n#endif\n\n    vec2 center = vec2(1.0, 0.5);\n    float ptOnUpperLine = getPointOnLine(vec2(base, 1.0), center, st.s);\n    float ptOnLowerLine = getPointOnLine(vec2(base, 0.0), center, st.s);\n\n    float halfWidth = 0.15;\n    float s = step(0.5 - halfWidth, st.t);\n    s *= 1.0 - step(0.5 + halfWidth, st.t);\n    s *= 1.0 - step(base, st.s);\n\n    float t = step(base, materialInput.st.s);\n    t *= 1.0 - step(ptOnUpperLine, st.t);\n    t *= step(ptOnLowerLine, st.t);\n\n    // Find the distance from the closest separator (region between two colors)\n    float dist;\n    if (st.s < base)\n    {\n        float d1 = abs(st.t - (0.5 - halfWidth));\n        float d2 = abs(st.t - (0.5 + halfWidth));\n        dist = min(d1, d2);\n    }\n    else\n    {\n        float d1 = czm_infinity;\n        if (st.t < 0.5 - halfWidth && st.t > 0.5 + halfWidth)\n        {\n            d1 = abs(st.s - base);\n        }\n        float d2 = abs(st.t - ptOnUpperLine);\n        float d3 = abs(st.t - ptOnLowerLine);\n        dist = min(min(d1, d2), d3);\n    }\n\n    vec4 outsideColor = vec4(0.0);\n    vec4 currentColor = mix(outsideColor, color, clamp(s + t, 0.0, 1.0));\n    vec4 outColor = czm_antialias(outsideColor, color, currentColor, dist);\n\n    outColor = czm_gammaCorrect(outColor);\n    material.diffuse = outColor.rgb;\n    material.alpha = outColor.a;\n    return material;\n}\n"
	},
	translucent: !0
}), Dc.PolylineDashType = "PolylineDash", Dc._materialCache.addMaterial(Dc.PolylineDashType, {
	fabric: {
		type: Dc.PolylineDashType,
		uniforms: {
			color: new pt(1, 0, 1, 1),
			gapColor: new pt(0, 0, 0, 0),
			dashLength: 16,
			dashPattern: 255
		},
		source: "uniform vec4 color;\nuniform vec4 gapColor;\nuniform float dashLength;\nuniform float dashPattern;\nin float v_polylineAngle;\n\nconst float maskLength = 16.0;\n\nmat2 rotate(float rad) {\n    float c = cos(rad);\n    float s = sin(rad);\n    return mat2(\n        c, s,\n        -s, c\n    );\n}\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;\n\n    // Get the relative position within the dash from 0 to 1\n    float dashPosition = fract(pos.x / (dashLength * czm_pixelRatio));\n    // Figure out the mask index.\n    float maskIndex = floor(dashPosition * maskLength);\n    // Test the bit mask.\n    float maskTest = floor(dashPattern / pow(2.0, maskIndex));\n    vec4 fragColor = (mod(maskTest, 2.0) < 1.0) ? gapColor : color;\n    if (fragColor.a < 0.005) {   // matches 0/255 and 1/255\n        discard;\n    }\n\n    fragColor = czm_gammaCorrect(fragColor);\n    material.emission = fragColor.rgb;\n    material.alpha = fragColor.a;\n    return material;\n}\n"
	},
	translucent: !0
}), Dc.PolylineGlowType = "PolylineGlow", Dc._materialCache.addMaterial(Dc.PolylineGlowType, {
	fabric: {
		type: Dc.PolylineGlowType,
		uniforms: {
			color: new pt(0, .5, 1, 1),
			glowPower: .25,
			taperPower: 1
		},
		source: "uniform vec4 color;\nuniform float glowPower;\nuniform float taperPower;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    vec2 st = materialInput.st;\n    float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);\n\n    if (taperPower <= 0.99999) {\n        glow *= min(1.0, taperPower / (0.5 - st.s * 0.5) - (taperPower / 0.5));\n    }\n\n    vec4 fragColor;\n    fragColor.rgb = max(vec3(glow - 1.0 + color.rgb), color.rgb);\n    fragColor.a = clamp(0.0, 1.0, glow) * color.a;\n    fragColor = czm_gammaCorrect(fragColor);\n\n    material.emission = fragColor.rgb;\n    material.alpha = fragColor.a;\n\n    return material;\n}\n"
	},
	translucent: !0
}), Dc.PolylineOutlineType = "PolylineOutline", Dc._materialCache.addMaterial(Dc.PolylineOutlineType, {
	fabric: {
		type: Dc.PolylineOutlineType,
		uniforms: {
			color: new pt(1, 1, 1, 1),
			outlineColor: new pt(1, 0, 0, 1),
			outlineWidth: 1
		},
		source: "uniform vec4 color;\nuniform vec4 outlineColor;\nuniform float outlineWidth;\n\nin float v_width;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    vec2 st = materialInput.st;\n    float halfInteriorWidth =  0.5 * (v_width - outlineWidth) / v_width;\n    float b = step(0.5 - halfInteriorWidth, st.t);\n    b *= 1.0 - step(0.5 + halfInteriorWidth, st.t);\n\n    // Find the distance from the closest separator (region between two colors)\n    float d1 = abs(st.t - (0.5 - halfInteriorWidth));\n    float d2 = abs(st.t - (0.5 + halfInteriorWidth));\n    float dist = min(d1, d2);\n\n    vec4 currentColor = mix(outlineColor, color, b);\n    vec4 outColor = czm_antialias(outlineColor, color, currentColor, dist);\n    outColor = czm_gammaCorrect(outColor);\n\n    material.diffuse = outColor.rgb;\n    material.alpha = outColor.a;\n\n    return material;\n}\n"
	},
	translucent: function(e) {
		const t = e.uniforms;
		return t.color.alpha < 1 || t.outlineColor.alpha < 1;
	}
}), Dc.ElevationContourType = "ElevationContour", Dc._materialCache.addMaterial(Dc.ElevationContourType, {
	fabric: {
		type: Dc.ElevationContourType,
		uniforms: {
			spacing: 100,
			color: new pt(1, 0, 0, 1),
			width: 1
		},
		source: "uniform vec4 color;\nuniform float spacing;\nuniform float width;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    float distanceToContour = mod(materialInput.height, spacing);\n\n#if (__VERSION__ == 300 || defined(GL_OES_standard_derivatives))\n    float dxc = abs(dFdx(materialInput.height));\n    float dyc = abs(dFdy(materialInput.height));\n    float dF = max(dxc, dyc) * czm_pixelRatio * width;\n    float alpha = (distanceToContour < dF) ? 1.0 : 0.0;\n#else\n    // If no derivatives available (IE 10?), use pixel ratio\n    float alpha = (distanceToContour < (czm_pixelRatio * width)) ? 1.0 : 0.0;\n#endif\n\n    vec4 outColor = czm_gammaCorrect(vec4(color.rgb, alpha * color.a));\n    material.diffuse = outColor.rgb;\n    material.alpha = outColor.a;\n\n    return material;\n}\n"
	},
	translucent: !1
}), Dc.ElevationRampType = "ElevationRamp", Dc._materialCache.addMaterial(Dc.ElevationRampType, {
	fabric: {
		type: Dc.ElevationRampType,
		uniforms: {
			image: Dc.DefaultImageId,
			minimumHeight: 0,
			maximumHeight: 1e4
		},
		source: "uniform sampler2D image;\nuniform float minimumHeight;\nuniform float maximumHeight;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    float scaledHeight = clamp((materialInput.height - minimumHeight) / (maximumHeight - minimumHeight), 0.0, 1.0);\n    vec4 rampColor = texture(image, vec2(scaledHeight, 0.5));\n    rampColor = czm_gammaCorrect(rampColor);\n    material.diffuse = rampColor.rgb;\n    material.alpha = rampColor.a;\n    return material;\n}\n"
	},
	translucent: !1
}), Dc.SlopeRampMaterialType = "SlopeRamp", Dc._materialCache.addMaterial(Dc.SlopeRampMaterialType, {
	fabric: {
		type: Dc.SlopeRampMaterialType,
		uniforms: { image: Dc.DefaultImageId },
		source: "uniform sampler2D image;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    vec4 rampColor = texture(image, vec2(materialInput.slope / (czm_pi / 2.0), 0.5));\n    rampColor = czm_gammaCorrect(rampColor);\n    material.diffuse = rampColor.rgb;\n    material.alpha = rampColor.a;\n    return material;\n}\n"
	},
	translucent: !1
}), Dc.AspectRampMaterialType = "AspectRamp", Dc._materialCache.addMaterial(Dc.AspectRampMaterialType, {
	fabric: {
		type: Dc.AspectRampMaterialType,
		uniforms: { image: Dc.DefaultImageId },
		source: "uniform sampler2D image;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    vec4 rampColor = texture(image, vec2(materialInput.aspect / (2.0 * czm_pi), 0.5));\n    rampColor = czm_gammaCorrect(rampColor);\n    material.diffuse = rampColor.rgb;\n    material.alpha = rampColor.a;\n    return material;\n}\n"
	},
	translucent: !1
}), Dc.ElevationBandType = "ElevationBand", Dc._materialCache.addMaterial(Dc.ElevationBandType, {
	fabric: {
		type: Dc.ElevationBandType,
		uniforms: {
			heights: Dc.DefaultImageId,
			colors: Dc.DefaultImageId
		},
		source: "uniform sampler2D heights;\nuniform sampler2D colors;\n\n// This material expects heights to be sorted from lowest to highest.\n\nfloat getHeight(int idx, float invTexSize)\n{\n    vec2 uv = vec2((float(idx) + 0.5) * invTexSize, 0.5);\n#ifdef OES_texture_float\n    return texture(heights, uv).x;\n#else\n    return czm_unpackFloat(texture(heights, uv));\n#endif\n}\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    float height = materialInput.height;\n    float invTexSize = 1.0 / float(heightsDimensions.x);\n\n    float minHeight = getHeight(0, invTexSize);\n    float maxHeight = getHeight(heightsDimensions.x - 1, invTexSize);\n\n    // early-out when outside the height range\n    if (height < minHeight || height > maxHeight) {\n        material.diffuse = vec3(0.0);\n        material.alpha = 0.0;\n        return material;\n    }\n\n    // Binary search to find heights above and below.\n    int idxBelow = 0;\n    int idxAbove = heightsDimensions.x;\n    float heightBelow = minHeight;\n    float heightAbove = maxHeight;\n\n    // while loop not allowed, so use for loop with max iterations.\n    // maxIterations of 16 supports a texture size up to 65536 (2^16).\n    const int maxIterations = 16;\n    for (int i = 0; i < maxIterations; i++) {\n        if (idxBelow >= idxAbove - 1) {\n            break;\n        }\n\n        int idxMid = (idxBelow + idxAbove) / 2;\n        float heightTex = getHeight(idxMid, invTexSize);\n\n        if (height > heightTex) {\n            idxBelow = idxMid;\n            heightBelow = heightTex;\n        } else {\n            idxAbove = idxMid;\n            heightAbove = heightTex;\n        }\n    }\n\n    float lerper = heightBelow == heightAbove ? 1.0 : (height - heightBelow) / (heightAbove - heightBelow);\n    vec2 colorUv = vec2(invTexSize * (float(idxBelow) + 0.5 + lerper), 0.5);\n    vec4 color = texture(colors, colorUv);\n\n    // undo preumultiplied alpha\n    if (color.a > 0.0) \n    {\n        color.rgb /= color.a;\n    }\n    \n    color.rgb = czm_gammaCorrect(color.rgb);\n\n    material.diffuse = color.rgb;\n    material.alpha = color.a;\n    return material;\n}\n"
	},
	translucent: !0
}), Dc.WaterMaskType = "WaterMask", Dc._materialCache.addMaterial(Dc.WaterMaskType, {
	fabric: {
		type: Dc.WaterMaskType,
		source: "uniform vec4 waterColor;\nuniform vec4 landColor;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    vec4 outColor = mix(landColor, waterColor, materialInput.waterMask);\n    outColor = czm_gammaCorrect(outColor);\n\n    material.diffuse = outColor.rgb;\n    material.alpha = outColor.a;\n\n    return material;\n}\n",
		uniforms: {
			waterColor: new pt(1, 1, 1, 1),
			landColor: new pt(0, 0, 0, 0)
		}
	},
	translucent: !1
}), Object.defineProperties(Kc.prototype, {
	vertexShaderSource: { get: function() {
		let e = this._vertexShaderSource;
		return -1 !== this.material.shaderSource.search(/in\s+float\s+v_polylineAngle;/g) && (e = `#define POLYLINE_DASH\n${e}`), e;
	} },
	fragmentShaderSource: { get: function() {
		return this._fragmentShaderSource;
	} },
	renderState: { get: function() {
		return this._renderState;
	} },
	closed: { get: function() {
		return this._closed;
	} },
	vertexFormat: { get: function() {
		return this._vertexFormat;
	} }
}), Kc.VERTEX_FORMAT = Pa.POSITION_AND_ST, Kc.prototype.getFragmentShaderSource = Fc.prototype.getFragmentShaderSource, Kc.prototype.isTranslucent = Fc.prototype.isTranslucent, Kc.prototype.getRenderState = Fc.prototype.getRenderState;
const Zc = {
	FILL: 0,
	OUTLINE: 1,
	FILL_AND_OUTLINE: 2
};
Object.freeze(Zc);
var Qc = a((e, t) => {
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
			var r = e[0], n = e[1], i = e[2], o = e[3];
			n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n & i | ~n & o) + t[0] - 680876936 | 0) << 7 | r >>> 25) + n | 0) & n | ~r & i) + t[1] - 389564586 | 0) << 12 | o >>> 20) + r | 0) & r | ~o & n) + t[2] + 606105819 | 0) << 17 | i >>> 15) + o | 0) & o | ~i & r) + t[3] - 1044525330 | 0) << 22 | n >>> 10) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n & i | ~n & o) + t[4] - 176418897 | 0) << 7 | r >>> 25) + n | 0) & n | ~r & i) + t[5] + 1200080426 | 0) << 12 | o >>> 20) + r | 0) & r | ~o & n) + t[6] - 1473231341 | 0) << 17 | i >>> 15) + o | 0) & o | ~i & r) + t[7] - 45705983 | 0) << 22 | n >>> 10) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n & i | ~n & o) + t[8] + 1770035416 | 0) << 7 | r >>> 25) + n | 0) & n | ~r & i) + t[9] - 1958414417 | 0) << 12 | o >>> 20) + r | 0) & r | ~o & n) + t[10] - 42063 | 0) << 17 | i >>> 15) + o | 0) & o | ~i & r) + t[11] - 1990404162 | 0) << 22 | n >>> 10) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n & i | ~n & o) + t[12] + 1804603682 | 0) << 7 | r >>> 25) + n | 0) & n | ~r & i) + t[13] - 40341101 | 0) << 12 | o >>> 20) + r | 0) & r | ~o & n) + t[14] - 1502002290 | 0) << 17 | i >>> 15) + o | 0) & o | ~i & r) + t[15] + 1236535329 | 0) << 22 | n >>> 10) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n & o | i & ~o) + t[1] - 165796510 | 0) << 5 | r >>> 27) + n | 0) & i | n & ~i) + t[6] - 1069501632 | 0) << 9 | o >>> 23) + r | 0) & n | r & ~n) + t[11] + 643717713 | 0) << 14 | i >>> 18) + o | 0) & r | o & ~r) + t[0] - 373897302 | 0) << 20 | n >>> 12) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n & o | i & ~o) + t[5] - 701558691 | 0) << 5 | r >>> 27) + n | 0) & i | n & ~i) + t[10] + 38016083 | 0) << 9 | o >>> 23) + r | 0) & n | r & ~n) + t[15] - 660478335 | 0) << 14 | i >>> 18) + o | 0) & r | o & ~r) + t[4] - 405537848 | 0) << 20 | n >>> 12) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n & o | i & ~o) + t[9] + 568446438 | 0) << 5 | r >>> 27) + n | 0) & i | n & ~i) + t[14] - 1019803690 | 0) << 9 | o >>> 23) + r | 0) & n | r & ~n) + t[3] - 187363961 | 0) << 14 | i >>> 18) + o | 0) & r | o & ~r) + t[8] + 1163531501 | 0) << 20 | n >>> 12) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n & o | i & ~o) + t[13] - 1444681467 | 0) << 5 | r >>> 27) + n | 0) & i | n & ~i) + t[2] - 51403784 | 0) << 9 | o >>> 23) + r | 0) & n | r & ~n) + t[7] + 1735328473 | 0) << 14 | i >>> 18) + o | 0) & r | o & ~r) + t[12] - 1926607734 | 0) << 20 | n >>> 12) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n ^ i ^ o) + t[5] - 378558 | 0) << 4 | r >>> 28) + n | 0) ^ n ^ i) + t[8] - 2022574463 | 0) << 11 | o >>> 21) + r | 0) ^ r ^ n) + t[11] + 1839030562 | 0) << 16 | i >>> 16) + o | 0) ^ o ^ r) + t[14] - 35309556 | 0) << 23 | n >>> 9) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n ^ i ^ o) + t[1] - 1530992060 | 0) << 4 | r >>> 28) + n | 0) ^ n ^ i) + t[4] + 1272893353 | 0) << 11 | o >>> 21) + r | 0) ^ r ^ n) + t[7] - 155497632 | 0) << 16 | i >>> 16) + o | 0) ^ o ^ r) + t[10] - 1094730640 | 0) << 23 | n >>> 9) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n ^ i ^ o) + t[13] + 681279174 | 0) << 4 | r >>> 28) + n | 0) ^ n ^ i) + t[0] - 358537222 | 0) << 11 | o >>> 21) + r | 0) ^ r ^ n) + t[3] - 722521979 | 0) << 16 | i >>> 16) + o | 0) ^ o ^ r) + t[6] + 76029189 | 0) << 23 | n >>> 9) + i | 0, n = ((n += ((i = ((i += ((o = ((o += ((r = ((r += (n ^ i ^ o) + t[9] - 640364487 | 0) << 4 | r >>> 28) + n | 0) ^ n ^ i) + t[12] - 421815835 | 0) << 11 | o >>> 21) + r | 0) ^ r ^ n) + t[15] + 530742520 | 0) << 16 | i >>> 16) + o | 0) ^ o ^ r) + t[2] - 995338651 | 0) << 23 | n >>> 9) + i | 0, n = ((n += ((o = ((o += (n ^ ((r = ((r += (i ^ (n | ~o)) + t[0] - 198630844 | 0) << 6 | r >>> 26) + n | 0) | ~i)) + t[7] + 1126891415 | 0) << 10 | o >>> 22) + r | 0) ^ ((i = ((i += (r ^ (o | ~n)) + t[14] - 1416354905 | 0) << 15 | i >>> 17) + o | 0) | ~r)) + t[5] - 57434055 | 0) << 21 | n >>> 11) + i | 0, n = ((n += ((o = ((o += (n ^ ((r = ((r += (i ^ (n | ~o)) + t[12] + 1700485571 | 0) << 6 | r >>> 26) + n | 0) | ~i)) + t[3] - 1894986606 | 0) << 10 | o >>> 22) + r | 0) ^ ((i = ((i += (r ^ (o | ~n)) + t[10] - 1051523 | 0) << 15 | i >>> 17) + o | 0) | ~r)) + t[1] - 2054922799 | 0) << 21 | n >>> 11) + i | 0, n = ((n += ((o = ((o += (n ^ ((r = ((r += (i ^ (n | ~o)) + t[8] + 1873313359 | 0) << 6 | r >>> 26) + n | 0) | ~i)) + t[15] - 30611744 | 0) << 10 | o >>> 22) + r | 0) ^ ((i = ((i += (r ^ (o | ~n)) + t[6] - 1560198380 | 0) << 15 | i >>> 17) + o | 0) | ~r)) + t[13] + 1309151649 | 0) << 21 | n >>> 11) + i | 0, n = ((n += ((o = ((o += (n ^ ((r = ((r += (i ^ (n | ~o)) + t[4] - 145523070 | 0) << 6 | r >>> 26) + n | 0) | ~i)) + t[11] - 1120210379 | 0) << 10 | o >>> 22) + r | 0) ^ ((i = ((i += (r ^ (o | ~n)) + t[2] + 718787259 | 0) << 15 | i >>> 17) + o | 0) | ~r)) + t[9] - 343485551 | 0) << 21 | n >>> 11) + i | 0, e[0] = r + e[0] | 0, e[1] = n + e[1] | 0, e[2] = i + e[2] | 0, e[3] = o + e[3] | 0;
		}
		function n(e) {
			var t, r = [];
			for (t = 0; t < 64; t += 4) r[t >> 2] = e.charCodeAt(t) + (e.charCodeAt(t + 1) << 8) + (e.charCodeAt(t + 2) << 16) + (e.charCodeAt(t + 3) << 24);
			return r;
		}
		function i(e) {
			var t, r = [];
			for (t = 0; t < 64; t += 4) r[t >> 2] = e[t] + (e[t + 1] << 8) + (e[t + 2] << 16) + (e[t + 3] << 24);
			return r;
		}
		function o(e) {
			var t, i, o, a, s, u, c = e.length, l = [
				1732584193,
				-271733879,
				-1732584194,
				271733878
			];
			for (t = 64; t <= c; t += 64) r(l, n(e.substring(t - 64, t)));
			for (i = (e = e.substring(t - 64)).length, o = [
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
			], t = 0; t < i; t += 1) o[t >> 2] |= e.charCodeAt(t) << (t % 4 << 3);
			if (o[t >> 2] |= 128 << (t % 4 << 3), t > 55) for (r(l, o), t = 0; t < 16; t += 1) o[t] = 0;
			return a = (a = 8 * c).toString(16).match(/(.*?)(.{0,8})$/), s = parseInt(a[2], 16), u = parseInt(a[1], 16) || 0, o[14] = s, o[15] = u, r(l, o), l;
		}
		function a(e) {
			var r, n = "";
			for (r = 0; r < 4; r += 1) n += t[e >> 8 * r + 4 & 15] + t[e >> 8 * r & 15];
			return n;
		}
		function s(e) {
			var t;
			for (t = 0; t < e.length; t += 1) e[t] = a(e[t]);
			return e.join("");
		}
		function u(e) {
			return /[\u0080-\uFFFF]/.test(e) && (e = unescape(encodeURIComponent(e))), e;
		}
		function c(e) {
			var t, r = [], n = e.length;
			for (t = 0; t < n - 1; t += 2) r.push(parseInt(e.substr(t, 2), 16));
			return String.fromCharCode.apply(String, r);
		}
		function l() {
			this.reset();
		}
		return s(o("hello")), "undefined" == typeof ArrayBuffer || ArrayBuffer.prototype.slice || function() {
			function t(e, t) {
				return (e = 0 | e || 0) < 0 ? Math.max(e + t, 0) : Math.min(e, t);
			}
			ArrayBuffer.prototype.slice = function(r, n) {
				var i, o, a, s, u = this.byteLength, c = t(r, u), l = u;
				return n !== e && (l = t(n, u)), c > l ? /* @__PURE__ */ new ArrayBuffer(0) : (i = l - c, o = new ArrayBuffer(i), a = new Uint8Array(o), s = new Uint8Array(this, c, i), a.set(s), o);
			};
		}(), l.prototype.append = function(e) {
			return this.appendBinary(u(e)), this;
		}, l.prototype.appendBinary = function(e) {
			this._buff += e, this._length += e.length;
			var t, i = this._buff.length;
			for (t = 64; t <= i; t += 64) r(this._hash, n(this._buff.substring(t - 64, t)));
			return this._buff = this._buff.substring(t - 64), this;
		}, l.prototype.end = function(e) {
			var t, r, n = this._buff, i = n.length, o = [
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
			for (t = 0; t < i; t += 1) o[t >> 2] |= n.charCodeAt(t) << (t % 4 << 3);
			return this._finish(o, i), r = s(this._hash), e && (r = c(r)), this.reset(), r;
		}, l.prototype.reset = function() {
			return this._buff = "", this._length = 0, this._hash = [
				1732584193,
				-271733879,
				-1732584194,
				271733878
			], this;
		}, l.prototype.getState = function() {
			return {
				buff: this._buff,
				length: this._length,
				hash: this._hash.slice()
			};
		}, l.prototype.setState = function(e) {
			return this._buff = e.buff, this._length = e.length, this._hash = e.hash, this;
		}, l.prototype.destroy = function() {
			delete this._hash, delete this._buff, delete this._length;
		}, l.prototype._finish = function(e, t) {
			var n, i, o, a = t;
			if (e[a >> 2] |= 128 << (a % 4 << 3), a > 55) for (r(this._hash, e), a = 0; a < 16; a += 1) e[a] = 0;
			n = (n = 8 * this._length).toString(16).match(/(.*?)(.{0,8})$/), i = parseInt(n[2], 16), o = parseInt(n[1], 16) || 0, e[14] = i, e[15] = o, r(this._hash, e);
		}, l.hash = function(e, t) {
			return l.hashBinary(u(e), t);
		}, l.hashBinary = function(e, t) {
			var r = s(o(e));
			return t ? c(r) : r;
		}, l.ArrayBuffer = function() {
			this.reset();
		}, l.ArrayBuffer.prototype.append = function(e) {
			var t, n, o, a, s = (n = this._buff.buffer, o = e, (a = new Uint8Array(n.byteLength + o.byteLength)).set(new Uint8Array(n)), a.set(new Uint8Array(o), n.byteLength), a), u = s.length;
			for (this._length += e.byteLength, t = 64; t <= u; t += 64) r(this._hash, i(s.subarray(t - 64, t)));
			return this._buff = t - 64 < u ? new Uint8Array(s.buffer.slice(t - 64)) : new Uint8Array(0), this;
		}, l.ArrayBuffer.prototype.end = function(e) {
			var t, r, n = this._buff, i = n.length, o = [
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
			for (t = 0; t < i; t += 1) o[t >> 2] |= n[t] << (t % 4 << 3);
			return this._finish(o, i), r = s(this._hash), e && (r = c(r)), this.reset(), r;
		}, l.ArrayBuffer.prototype.reset = function() {
			return this._buff = new Uint8Array(0), this._length = 0, this._hash = [
				1732584193,
				-271733879,
				-1732584194,
				271733878
			], this;
		}, l.ArrayBuffer.prototype.getState = function() {
			var e, t = l.prototype.getState.call(this);
			return t.buff = (e = t.buff, String.fromCharCode.apply(null, new Uint8Array(e))), t;
		}, l.ArrayBuffer.prototype.setState = function(e) {
			return e.buff = function(e) {
				var t, r = e.length, n = new ArrayBuffer(r), i = new Uint8Array(n);
				for (t = 0; t < r; t += 1) i[t] = e.charCodeAt(t);
				return i;
			}(e.buff), l.prototype.setState.call(this, e);
		}, l.ArrayBuffer.prototype.destroy = l.prototype.destroy, l.ArrayBuffer.prototype._finish = l.prototype._finish, l.ArrayBuffer.hash = function(e, t) {
			var n = s(function(e) {
				var t, n, o, a, s, u, c = e.length, l = [
					1732584193,
					-271733879,
					-1732584194,
					271733878
				];
				for (t = 64; t <= c; t += 64) r(l, i(e.subarray(t - 64, t)));
				for (n = (e = t - 64 < c ? e.subarray(t - 64) : new Uint8Array(0)).length, o = [
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
				], t = 0; t < n; t += 1) o[t >> 2] |= e[t] << (t % 4 << 3);
				if (o[t >> 2] |= 128 << (t % 4 << 3), t > 55) for (r(l, o), t = 0; t < 16; t += 1) o[t] = 0;
				return a = (a = 8 * c).toString(16).match(/(.*?)(.{0,8})$/), s = parseInt(a[2], 16), u = parseInt(a[1], 16) || 0, o[14] = s, o[15] = u, r(l, o), l;
			}(new Uint8Array(e)));
			return t ? c(n) : n;
		}, l;
	});
});
function Jc(e, t) {
	return toString.call(e) === `[object ${t}]`;
}
function el(e) {
	return Jc(e, "String");
}
function tl(e) {
	return Jc(e, "Number");
}
function rl(e) {
	return void 0 !== e;
}
function nl(e = {}, t = {}) {
	let r;
	for (r in t) e[r] = t[r];
	return e;
}
Qc();
var il = class e {
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
		if (tl(e.scale) && (t.scale = e.scale), tl(e.minLevel) && (t.minLevel = e.minLevel), tl(e.maxLevel) && (t.maxLevel = e.maxLevel), tl(e.near) && (t.near = e.near), tl(e.far) && (t.far = e.far), rl(e.fontSize) || el(e.fontFamily)) {
			const r = e.fontSize ?? 10, n = e.fontFamily ?? "宋体";
			t.font = r + "px " + n;
		}
		if (e.fontColor && (t.fillColor = pt.fromCssColorString(e.fontColor)), el(e.backgroundColor) && (t.showBackground = !0, t.backgroundColor = pt.fromCssColorString(e.backgroundColor), t.backgroundPadding = new wt(e.backgroundPadding, e.backgroundPadding)), e.outlineColor && (t.style = Zc.FILL_AND_OUTLINE, t.outlineColor = pt.fromCssColorString(e.outlineColor).withAlpha(e.outlineAlpha ?? 1), t.outlineWidth = e.outlineWidth ?? 2), e.imgUrl) {
			t.image = e.imgUrl, t.width = e.imgWidth, t.height = e.imgHeight;
			t.pixelOffset = new wt(0, tl(e.offset) ? e.offset : 0);
		} else "" === e.imgUrl && (t.image = void 0);
		return t;
	}
	static fromDefaultOption(e) {
		const t = {
			show: !0,
			style: Zc.FILL,
			pixelOffset: wt.ZERO,
			eyeOffset: z.ZERO,
			horizontalOrigin: Cc.CENTER,
			verticalOrigin: Nc.CENTER,
			heightReference: Ic.CLAMP_TO_GROUND,
			distanceDisplayCondition: new Sc(0, 2e7),
			disableDepthTestDistance: 1e8
		};
		if (tl(e.scale) && (t.scale = e.scale), tl(e.minLevel) && (t.minLevel = e.minLevel), tl(e.maxLevel) && (t.maxLevel = e.maxLevel), rl(e.fontSize) || el(e.fontFamily)) {
			const r = e.fontSize ?? 10, n = e.fontFamily ?? "宋体";
			t.font = r + "px " + n;
		}
		if (e.fontColor && (t.fillColor = pt.fromCssColorString(e.fontColor)), el(e.backgroundColor) && (t.showBackground = !0, t.backgroundColor = pt.fromCssColorString(e.backgroundColor), t.backgroundPadding = new wt(e.backgroundPadding, e.backgroundPadding)), e.outlineColor && (t.style = Zc.FILL_AND_OUTLINE, t.outlineColor = pt.fromCssColorString(e.outlineColor).withAlpha(e.outlineAlpha ?? 1), t.outlineWidth = e.outlineWidth ?? 2), e.imgUrl) {
			t.image = e.imgUrl, t.width = e.imgWidth, t.height = e.imgHeight;
			t.pixelOffset = new wt(0, tl(e.offset) ? e.offset : 0);
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
			fillColor: pt.fromCssColorString(this.fontColor),
			style: Zc.FILL,
			scale: this.scale,
			pixelOffset: wt.ZERO,
			eyeOffset: z.ZERO,
			horizontalOrigin: Cc.CENTER,
			verticalOrigin: Nc.CENTER,
			heightReference: Ic.CLAMP_TO_GROUND,
			distanceDisplayCondition: new Sc(0, 2e7),
			disableDepthTestDistance: 1e8
		};
		tl(this.weight) && (e.eyeOffset = new z(0, 0, -100 * this.weight)), this.backgroundColor && (e.showBackground = !0, e.backgroundColor = pt.fromCssColorString(this.backgroundColor), e.backgroundPadding = new wt(this.backgroundPadding ?? 7, this.backgroundPadding ?? 5)), this.outlineColor && (e.style = Zc.FILL_AND_OUTLINE, e.outlineColor = pt.fromCssColorString(this.outlineColor).withAlpha(this.outlineAlpha ?? 1), e.outlineWidth = this.outlineWidth ?? 2);
		let t = 0;
		return tl(this.offset) && (t = this.offset, e.pixelOffset = new wt(0, t)), this.imgUrl && (e.image = this.imgUrl, e.width = this.imgWidth, e.height = this.imgHeight), e;
	}
	getBillboardOption() {
		return this.imgUrl ? {
			image: this.imgUrl,
			width: this.imgWidth,
			height: this.imgHeight
		} : {};
	}
}, ol = class e {
	show = !0;
	maxLevel = 22;
	minLevel = 0;
	color = "#000";
	colorAlpha = 1;
	gapColor;
	dashLength;
	dashPattern;
	outlineColor;
	outlineWidth;
	glowPower;
	taperPower;
	width = 1;
	constructor(e) {
		e && this.copyFrom(e);
	}
	texture = "";
	getValue() {
		let e = Dc.fromType(Dc.ColorType, { color: pt.fromCssColorString(this.color).withAlpha(this.colorAlpha ?? 1) });
		if (this.gapColor && (e = Dc.fromType(Dc.PolylineDashType, {
			color: pt.fromCssColorString(this.color).withAlpha(this.colorAlpha ?? 1),
			gapColor: pt.fromCssColorString(this.gapColor),
			dashPattern: this.dashPattern,
			dashLength: this.dashLength ?? 20
		})), this.outlineColor && (e = Dc.fromType(Dc.PolylineOutlineType, {
			color: pt.fromCssColorString(this.color).withAlpha(this.colorAlpha ?? 1),
			outlineColor: pt.fromCssColorString(this.outlineColor),
			outlineWidth: this.outlineWidth
		})), this.glowPower && this.taperPower && (e = Dc.fromType(Dc.PolylineGlowType, {
			color: pt.fromCssColorString(this.color).withAlpha(this.colorAlpha ?? 1),
			glowPower: this.glowPower,
			taperPower: this.taperPower
		})), e) return new Kc({ material: e });
	}
	copyFrom(e) {
		e && (this.show = e.show, this.maxLevel = e.maxLevel, this.minLevel = e.minLevel, this.color = e.color, tl(e.colorAlpha) && (this.colorAlpha = e.colorAlpha), el(e.gapColor) && (this.gapColor = e.gapColor), this.dashPattern = e.dashPattern, el(e.outlineColor) && (this.outlineColor = e.outlineColor), tl(e.outlineWidth) && (this.outlineWidth = e.outlineWidth), this.glowPower = e.glowPower, this.taperPower = e.taperPower, this.width = e.width);
	}
	clone() {
		const t = new e();
		return t.show = this.show, t.maxLevel = this.maxLevel, t.minLevel = this.minLevel, t.color = this.color, t.gapColor = this.gapColor, t.dashPattern = this.dashPattern, t.outlineColor = this.outlineColor, t.outlineWidth = this.outlineWidth, t.glowPower = this.glowPower, t.taperPower = this.taperPower, t.width = this.width, t;
	}
};
function al(e, t) {
	this.x = e, this.y = t;
}
al.prototype = {
	clone() {
		return new al(this.x, this.y);
	},
	add(e) {
		return this.clone()._add(e);
	},
	sub(e) {
		return this.clone()._sub(e);
	},
	multByPoint(e) {
		return this.clone()._multByPoint(e);
	},
	divByPoint(e) {
		return this.clone()._divByPoint(e);
	},
	mult(e) {
		return this.clone()._mult(e);
	},
	div(e) {
		return this.clone()._div(e);
	},
	rotate(e) {
		return this.clone()._rotate(e);
	},
	rotateAround(e, t) {
		return this.clone()._rotateAround(e, t);
	},
	matMult(e) {
		return this.clone()._matMult(e);
	},
	unit() {
		return this.clone()._unit();
	},
	perp() {
		return this.clone()._perp();
	},
	round() {
		return this.clone()._round();
	},
	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
	equals(e) {
		return this.x === e.x && this.y === e.y;
	},
	dist(e) {
		return Math.sqrt(this.distSqr(e));
	},
	distSqr(e) {
		const t = e.x - this.x, r = e.y - this.y;
		return t * t + r * r;
	},
	angle() {
		return Math.atan2(this.y, this.x);
	},
	angleTo(e) {
		return Math.atan2(this.y - e.y, this.x - e.x);
	},
	angleWith(e) {
		return this.angleWithSep(e.x, e.y);
	},
	angleWithSep(e, t) {
		return Math.atan2(this.x * t - this.y * e, this.x * e + this.y * t);
	},
	_matMult(e) {
		const t = e[0] * this.x + e[1] * this.y, r = e[2] * this.x + e[3] * this.y;
		return this.x = t, this.y = r, this;
	},
	_add(e) {
		return this.x += e.x, this.y += e.y, this;
	},
	_sub(e) {
		return this.x -= e.x, this.y -= e.y, this;
	},
	_mult(e) {
		return this.x *= e, this.y *= e, this;
	},
	_div(e) {
		return this.x /= e, this.y /= e, this;
	},
	_multByPoint(e) {
		return this.x *= e.x, this.y *= e.y, this;
	},
	_divByPoint(e) {
		return this.x /= e.x, this.y /= e.y, this;
	},
	_unit() {
		return this._div(this.mag()), this;
	},
	_perp() {
		const e = this.y;
		return this.y = this.x, this.x = -e, this;
	},
	_rotate(e) {
		const t = Math.cos(e), r = Math.sin(e), n = t * this.x - r * this.y, i = r * this.x + t * this.y;
		return this.x = n, this.y = i, this;
	},
	_rotateAround(e, t) {
		const r = Math.cos(e), n = Math.sin(e), i = t.x + r * (this.x - t.x) - n * (this.y - t.y), o = t.y + n * (this.x - t.x) + r * (this.y - t.y);
		return this.x = i, this.y = o, this;
	},
	_round() {
		return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
	},
	constructor: al
}, al.convert = function(e) {
	if (e instanceof al) return e;
	if (Array.isArray(e)) return new al(+e[0], +e[1]);
	if (void 0 !== e.x && void 0 !== e.y) return new al(+e.x, +e.y);
	throw new Error("Expected [x, y] or {x, y} point format");
};
var sl = class {
	constructor(e, t, r, n, i) {
		this.properties = {}, this.extent = r, this.type = 0, this.id = void 0, this._pbf = e, this._geometry = -1, this._keys = n, this._values = i, e.readFields(ul, this, t);
	}
	loadGeometry() {
		const e = this._pbf;
		e.pos = this._geometry;
		const t = e.readVarint() + e.pos, r = [];
		let n, i = 1, o = 0, a = 0, s = 0;
		for (; e.pos < t;) {
			if (o <= 0) {
				const t = e.readVarint();
				i = 7 & t, o = t >> 3;
			}
			if (o--, 1 === i || 2 === i) a += e.readSVarint(), s += e.readSVarint(), 1 === i && (n && r.push(n), n = []), n && n.push(new al(a, s));
			else {
				if (7 !== i) throw new Error(`unknown command ${i}`);
				n && n.push(n[0].clone());
			}
		}
		return n && r.push(n), r;
	}
	bbox() {
		const e = this._pbf;
		e.pos = this._geometry;
		const t = e.readVarint() + e.pos;
		let r = 1, n = 0, i = 0, o = 0, a = Infinity, s = -Infinity, u = Infinity, c = -Infinity;
		for (; e.pos < t;) {
			if (n <= 0) {
				const t = e.readVarint();
				r = 7 & t, n = t >> 3;
			}
			if (n--, 1 === r || 2 === r) i += e.readSVarint(), o += e.readSVarint(), i < a && (a = i), i > s && (s = i), o < u && (u = o), o > c && (c = o);
			else if (7 !== r) throw new Error(`unknown command ${r}`);
		}
		return [
			a,
			u,
			s,
			c
		];
	}
	toGeoJSON(e, t, r) {
		const n = this.extent * Math.pow(2, r), i = this.extent * e, o = this.extent * t, a = this.loadGeometry();
		function s(e) {
			return [360 * (e.x + i) / n - 180, 360 / Math.PI * Math.atan(Math.exp((1 - 2 * (e.y + o) / n) * Math.PI)) - 90];
		}
		function u(e) {
			return e.map(s);
		}
		let c;
		if (1 === this.type) {
			const e = [];
			for (const r of a) e.push(r[0]);
			const t = u(e);
			c = 1 === e.length ? {
				type: "Point",
				coordinates: t[0]
			} : {
				type: "MultiPoint",
				coordinates: t
			};
		} else if (2 === this.type) {
			const e = a.map(u);
			c = 1 === e.length ? {
				type: "LineString",
				coordinates: e[0]
			} : {
				type: "MultiLineString",
				coordinates: e
			};
		} else {
			if (3 !== this.type) throw new Error("unknown feature type");
			{
				const e = function(e) {
					const t = e.length;
					if (t <= 1) return [e];
					const r = [];
					let n, i;
					for (let o = 0; o < t; o++) {
						const t = cl(e[o]);
						0 !== t && (void 0 === i && (i = t < 0), i === t < 0 ? (n && r.push(n), n = [e[o]]) : n && n.push(e[o]));
					}
					return n && r.push(n), r;
				}(a), t = [];
				for (const r of e) t.push(r.map(u));
				c = 1 === t.length ? {
					type: "Polygon",
					coordinates: t[0]
				} : {
					type: "MultiPolygon",
					coordinates: t
				};
			}
		}
		const l = {
			type: "Feature",
			geometry: c,
			properties: this.properties
		};
		return null != this.id && (l.id = this.id), l;
	}
};
function ul(e, t, r) {
	1 === e ? t.id = r.readVarint() : 2 === e ? function(e, t) {
		const r = e.readVarint() + e.pos;
		for (; e.pos < r;) {
			const r = t._keys[e.readVarint()], n = t._values[e.readVarint()];
			t.properties[r] = n;
		}
	}(r, t) : 3 === e ? t.type = r.readVarint() : 4 === e && (t._geometry = r.pos);
}
function cl(e) {
	let t = 0;
	for (let r, n, i = 0, o = e.length, a = o - 1; i < o; a = i++) r = e[i], n = e[a], t += (n.x - r.x) * (r.y + n.y);
	return t;
}
sl.types = [
	"Unknown",
	"Point",
	"LineString",
	"Polygon"
];
var ll = class {
	constructor(e, t) {
		this.version = 1, this.name = "", this.extent = 4096, this.length = 0, this._pbf = e, this._keys = [], this._values = [], this._features = [], e.readFields(fl, this, t), this.length = this._features.length;
	}
	feature(e) {
		if (e < 0 || e >= this._features.length) throw new Error("feature index out of bounds");
		this._pbf.pos = this._features[e];
		const t = this._pbf.readVarint() + this._pbf.pos;
		return new sl(this._pbf, t, this.extent, this._keys, this._values);
	}
};
function fl(e, t, r) {
	15 === e ? t.version = r.readVarint() : 1 === e ? t.name = r.readString() : 5 === e ? t.extent = r.readVarint() : 2 === e ? t._features.push(r.pos) : 3 === e ? t._keys.push(r.readString()) : 4 === e && t._values.push(function(e) {
		let t = null;
		const r = e.readVarint() + e.pos;
		for (; e.pos < r;) {
			const r = e.readVarint() >> 3;
			t = 1 === r ? e.readString() : 2 === r ? e.readFloat() : 3 === r ? e.readDouble() : 4 === r ? e.readVarint64() : 5 === r ? e.readVarint() : 6 === r ? e.readSVarint() : 7 === r ? e.readBoolean() : null;
		}
		if (null == t) throw new Error("unknown feature value");
		return t;
	}(r));
}
var hl = class {
	constructor(e, t) {
		this.layers = e.readFields(pl, {}, t);
	}
};
function pl(e, t, r) {
	if (3 === e) {
		const e = new ll(r, r.readVarint() + r.pos);
		e.length && (t[e.name] = e);
	}
}
const ml = 4294967296, dl = 1 / ml, yl = "undefined" == typeof TextDecoder ? null : new TextDecoder("utf-8");
var _l = class {
	constructor(e = new Uint8Array(16)) {
		this.buf = ArrayBuffer.isView(e) ? e : new Uint8Array(e), this.dataView = new DataView(this.buf.buffer), this.pos = 0, this.type = 0, this.length = this.buf.length;
	}
	readFields(e, t, r = this.length) {
		for (; this.pos < r;) {
			const r = this.readVarint(), n = r >> 3, i = this.pos;
			this.type = 7 & r, e(n, t, this), this.pos === i && this.skip(r);
		}
		return t;
	}
	readMessage(e, t) {
		return this.readFields(e, t, this.readVarint() + this.pos);
	}
	readFixed32() {
		const e = this.dataView.getUint32(this.pos, !0);
		return this.pos += 4, e;
	}
	readSFixed32() {
		const e = this.dataView.getInt32(this.pos, !0);
		return this.pos += 4, e;
	}
	readFixed64() {
		const e = this.dataView.getUint32(this.pos, !0) + this.dataView.getUint32(this.pos + 4, !0) * ml;
		return this.pos += 8, e;
	}
	readSFixed64() {
		const e = this.dataView.getUint32(this.pos, !0) + this.dataView.getInt32(this.pos + 4, !0) * ml;
		return this.pos += 8, e;
	}
	readFloat() {
		const e = this.dataView.getFloat32(this.pos, !0);
		return this.pos += 4, e;
	}
	readDouble() {
		const e = this.dataView.getFloat64(this.pos, !0);
		return this.pos += 8, e;
	}
	readVarint(e) {
		const t = this.buf;
		let r, n;
		return n = t[this.pos++], r = 127 & n, n < 128 ? r : (n = t[this.pos++], r |= (127 & n) << 7, n < 128 ? r : (n = t[this.pos++], r |= (127 & n) << 14, n < 128 ? r : (n = t[this.pos++], r |= (127 & n) << 21, n < 128 ? r : (n = t[this.pos], r |= (15 & n) << 28, function(e, t, r) {
			const n = r.buf;
			let i, o;
			if (o = n[r.pos++], i = (112 & o) >> 4, o < 128) return gl(e, i, t);
			if (o = n[r.pos++], i |= (127 & o) << 3, o < 128) return gl(e, i, t);
			if (o = n[r.pos++], i |= (127 & o) << 10, o < 128) return gl(e, i, t);
			if (o = n[r.pos++], i |= (127 & o) << 17, o < 128) return gl(e, i, t);
			if (o = n[r.pos++], i |= (127 & o) << 24, o < 128) return gl(e, i, t);
			if (o = n[r.pos++], i |= (1 & o) << 31, o < 128) return gl(e, i, t);
			throw new Error("Expected varint not more than 10 bytes");
		}(r, e, this)))));
	}
	readVarint64() {
		return this.readVarint(!0);
	}
	readSVarint() {
		const e = this.readVarint();
		return e % 2 == 1 ? (e + 1) / -2 : e / 2;
	}
	readBoolean() {
		return Boolean(this.readVarint());
	}
	readString() {
		const e = this.readVarint() + this.pos, t = this.pos;
		return this.pos = e, e - t >= 12 && yl ? yl.decode(this.buf.subarray(t, e)) : function(e, t, r) {
			let n = "", i = t;
			for (; i < r;) {
				const t = e[i];
				let o, a, s, u = null, c = t > 239 ? 4 : t > 223 ? 3 : t > 191 ? 2 : 1;
				if (i + c > r) break;
				1 === c ? t < 128 && (u = t) : 2 === c ? (o = e[i + 1], 128 == (192 & o) && (u = (31 & t) << 6 | 63 & o, u <= 127 && (u = null))) : 3 === c ? (o = e[i + 1], a = e[i + 2], 128 == (192 & o) && 128 == (192 & a) && (u = (15 & t) << 12 | (63 & o) << 6 | 63 & a, (u <= 2047 || u >= 55296 && u <= 57343) && (u = null))) : 4 === c && (o = e[i + 1], a = e[i + 2], s = e[i + 3], 128 == (192 & o) && 128 == (192 & a) && 128 == (192 & s) && (u = (15 & t) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s, (u <= 65535 || u >= 1114112) && (u = null))), null === u ? (u = 65533, c = 1) : u > 65535 && (u -= 65536, n += String.fromCharCode(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), n += String.fromCharCode(u), i += c;
			}
			return n;
		}(this.buf, t, e);
	}
	readBytes() {
		const e = this.readVarint() + this.pos, t = this.buf.subarray(this.pos, e);
		return this.pos = e, t;
	}
	readPackedVarint(e = [], t) {
		const r = this.readPackedEnd();
		for (; this.pos < r;) e.push(this.readVarint(t));
		return e;
	}
	readPackedSVarint(e = []) {
		const t = this.readPackedEnd();
		for (; this.pos < t;) e.push(this.readSVarint());
		return e;
	}
	readPackedBoolean(e = []) {
		const t = this.readPackedEnd();
		for (; this.pos < t;) e.push(this.readBoolean());
		return e;
	}
	readPackedFloat(e = []) {
		const t = this.readPackedEnd();
		for (; this.pos < t;) e.push(this.readFloat());
		return e;
	}
	readPackedDouble(e = []) {
		const t = this.readPackedEnd();
		for (; this.pos < t;) e.push(this.readDouble());
		return e;
	}
	readPackedFixed32(e = []) {
		const t = this.readPackedEnd();
		for (; this.pos < t;) e.push(this.readFixed32());
		return e;
	}
	readPackedSFixed32(e = []) {
		const t = this.readPackedEnd();
		for (; this.pos < t;) e.push(this.readSFixed32());
		return e;
	}
	readPackedFixed64(e = []) {
		const t = this.readPackedEnd();
		for (; this.pos < t;) e.push(this.readFixed64());
		return e;
	}
	readPackedSFixed64(e = []) {
		const t = this.readPackedEnd();
		for (; this.pos < t;) e.push(this.readSFixed64());
		return e;
	}
	readPackedEnd() {
		return 2 === this.type ? this.readVarint() + this.pos : this.pos + 1;
	}
	skip(e) {
		const t = 7 & e;
		if (0 === t) for (; this.buf[this.pos++] > 127;);
		else if (2 === t) this.pos = this.readVarint() + this.pos;
		else if (5 === t) this.pos += 4;
		else {
			if (1 !== t) throw new Error(`Unimplemented type: ${t}`);
			this.pos += 8;
		}
	}
	writeTag(e, t) {
		this.writeVarint(e << 3 | t);
	}
	realloc(e) {
		let t = this.length || 16;
		for (; t < this.pos + e;) t *= 2;
		if (t !== this.length) {
			const e = new Uint8Array(t);
			e.set(this.buf), this.buf = e, this.dataView = new DataView(e.buffer), this.length = t;
		}
	}
	finish() {
		return this.length = this.pos, this.pos = 0, this.buf.subarray(0, this.length);
	}
	writeFixed32(e) {
		this.realloc(4), this.dataView.setInt32(this.pos, e, !0), this.pos += 4;
	}
	writeSFixed32(e) {
		this.realloc(4), this.dataView.setInt32(this.pos, e, !0), this.pos += 4;
	}
	writeFixed64(e) {
		this.realloc(8), this.dataView.setInt32(this.pos, -1 & e, !0), this.dataView.setInt32(this.pos + 4, Math.floor(e * dl), !0), this.pos += 8;
	}
	writeSFixed64(e) {
		this.realloc(8), this.dataView.setInt32(this.pos, -1 & e, !0), this.dataView.setInt32(this.pos + 4, Math.floor(e * dl), !0), this.pos += 8;
	}
	writeVarint(e) {
		(e = +e || 0) > 268435455 || e < 0 ? function(e, t) {
			let r, n;
			if (e >= 0 ? (r = e % 4294967296 | 0, n = e / 4294967296 | 0) : (r = ~(-e % 4294967296), n = ~(-e / 4294967296), 4294967295 ^ r ? r = r + 1 | 0 : (r = 0, n = n + 1 | 0)), e >= 0x10000000000000000 || e < -0x10000000000000000) throw new Error("Given varint doesn't fit into 10 bytes");
			t.realloc(10), function(e, t, r) {
				r.buf[r.pos++] = 127 & e | 128, e >>>= 7, r.buf[r.pos++] = 127 & e | 128, e >>>= 7, r.buf[r.pos++] = 127 & e | 128, e >>>= 7, r.buf[r.pos++] = 127 & e | 128, e >>>= 7, r.buf[r.pos] = 127 & e;
			}(r, 0, t), function(e, t) {
				const r = (7 & e) << 4;
				t.buf[t.pos++] |= r | ((e >>>= 3) ? 128 : 0), e && (t.buf[t.pos++] = 127 & e | ((e >>>= 7) ? 128 : 0), e && (t.buf[t.pos++] = 127 & e | ((e >>>= 7) ? 128 : 0), e && (t.buf[t.pos++] = 127 & e | ((e >>>= 7) ? 128 : 0), e && (t.buf[t.pos++] = 127 & e | ((e >>>= 7) ? 128 : 0), e && (t.buf[t.pos++] = 127 & e)))));
			}(n, t);
		}(e, this) : (this.realloc(4), this.buf[this.pos++] = 127 & e | (e > 127 ? 128 : 0), e <= 127 || (this.buf[this.pos++] = 127 & (e >>>= 7) | (e > 127 ? 128 : 0), e <= 127 || (this.buf[this.pos++] = 127 & (e >>>= 7) | (e > 127 ? 128 : 0), e <= 127 || (this.buf[this.pos++] = e >>> 7 & 127))));
	}
	writeSVarint(e) {
		this.writeVarint(e < 0 ? 2 * -e - 1 : 2 * e);
	}
	writeBoolean(e) {
		this.writeVarint(+e);
	}
	writeString(e) {
		e = String(e), this.realloc(4 * e.length), this.pos++;
		const t = this.pos;
		this.pos = function(e, t, r) {
			for (let n, i, o = 0; o < t.length; o++) {
				if (n = t.charCodeAt(o), n > 55295 && n < 57344) {
					if (!i) {
						n > 56319 || o + 1 === t.length ? (e[r++] = 239, e[r++] = 191, e[r++] = 189) : i = n;
						continue;
					}
					if (n < 56320) {
						e[r++] = 239, e[r++] = 191, e[r++] = 189, i = n;
						continue;
					}
					n = i - 55296 << 10 | n - 56320 | 65536, i = null;
				} else i && (e[r++] = 239, e[r++] = 191, e[r++] = 189, i = null);
				n < 128 ? e[r++] = n : (n < 2048 ? e[r++] = n >> 6 | 192 : (n < 65536 ? e[r++] = n >> 12 | 224 : (e[r++] = n >> 18 | 240, e[r++] = n >> 12 & 63 | 128), e[r++] = n >> 6 & 63 | 128), e[r++] = 63 & n | 128);
			}
			return r;
		}(this.buf, e, this.pos);
		const r = this.pos - t;
		r >= 128 && El(t, r, this), this.pos = t - 1, this.writeVarint(r), this.pos += r;
	}
	writeFloat(e) {
		this.realloc(4), this.dataView.setFloat32(this.pos, e, !0), this.pos += 4;
	}
	writeDouble(e) {
		this.realloc(8), this.dataView.setFloat64(this.pos, e, !0), this.pos += 8;
	}
	writeBytes(e) {
		const t = e.length;
		this.writeVarint(t), this.realloc(t);
		for (let r = 0; r < t; r++) this.buf[this.pos++] = e[r];
	}
	writeRawMessage(e, t) {
		this.pos++;
		const r = this.pos;
		e(t, this);
		const n = this.pos - r;
		n >= 128 && El(r, n, this), this.pos = r - 1, this.writeVarint(n), this.pos += n;
	}
	writeMessage(e, t, r) {
		this.writeTag(e, 2), this.writeRawMessage(t, r);
	}
	writePackedVarint(e, t) {
		t.length && this.writeMessage(e, bl, t);
	}
	writePackedSVarint(e, t) {
		t.length && this.writeMessage(e, wl, t);
	}
	writePackedBoolean(e, t) {
		t.length && this.writeMessage(e, Al, t);
	}
	writePackedFloat(e, t) {
		t.length && this.writeMessage(e, Tl, t);
	}
	writePackedDouble(e, t) {
		t.length && this.writeMessage(e, Ol, t);
	}
	writePackedFixed32(e, t) {
		t.length && this.writeMessage(e, xl, t);
	}
	writePackedSFixed32(e, t) {
		t.length && this.writeMessage(e, Rl, t);
	}
	writePackedFixed64(e, t) {
		t.length && this.writeMessage(e, Sl, t);
	}
	writePackedSFixed64(e, t) {
		t.length && this.writeMessage(e, Il, t);
	}
	writeBytesField(e, t) {
		this.writeTag(e, 2), this.writeBytes(t);
	}
	writeFixed32Field(e, t) {
		this.writeTag(e, 5), this.writeFixed32(t);
	}
	writeSFixed32Field(e, t) {
		this.writeTag(e, 5), this.writeSFixed32(t);
	}
	writeFixed64Field(e, t) {
		this.writeTag(e, 1), this.writeFixed64(t);
	}
	writeSFixed64Field(e, t) {
		this.writeTag(e, 1), this.writeSFixed64(t);
	}
	writeVarintField(e, t) {
		this.writeTag(e, 0), this.writeVarint(t);
	}
	writeSVarintField(e, t) {
		this.writeTag(e, 0), this.writeSVarint(t);
	}
	writeStringField(e, t) {
		this.writeTag(e, 2), this.writeString(t);
	}
	writeFloatField(e, t) {
		this.writeTag(e, 5), this.writeFloat(t);
	}
	writeDoubleField(e, t) {
		this.writeTag(e, 1), this.writeDouble(t);
	}
	writeBooleanField(e, t) {
		this.writeVarintField(e, +t);
	}
};
function gl(e, t, r) {
	return r ? 4294967296 * t + (e >>> 0) : 4294967296 * (t >>> 0) + (e >>> 0);
}
function El(e, t, r) {
	const n = t <= 16383 ? 1 : t <= 2097151 ? 2 : t <= 268435455 ? 3 : Math.floor(Math.log(t) / (7 * Math.LN2));
	r.realloc(n);
	for (let i = r.pos - 1; i >= e; i--) r.buf[i + n] = r.buf[i];
}
function bl(e, t) {
	for (let r = 0; r < e.length; r++) t.writeVarint(e[r]);
}
function wl(e, t) {
	for (let r = 0; r < e.length; r++) t.writeSVarint(e[r]);
}
function Tl(e, t) {
	for (let r = 0; r < e.length; r++) t.writeFloat(e[r]);
}
function Ol(e, t) {
	for (let r = 0; r < e.length; r++) t.writeDouble(e[r]);
}
function Al(e, t) {
	for (let r = 0; r < e.length; r++) t.writeBoolean(e[r]);
}
function xl(e, t) {
	for (let r = 0; r < e.length; r++) t.writeFixed32(e[r]);
}
function Rl(e, t) {
	for (let r = 0; r < e.length; r++) t.writeSFixed32(e[r]);
}
function Sl(e, t) {
	for (let r = 0; r < e.length; r++) t.writeFixed64(e[r]);
}
function Il(e, t) {
	for (let r = 0; r < e.length; r++) t.writeSFixed64(e[r]);
}
async function Cl(e) {
	return await fetch(e).catch((t) => {
		console.warn("请求元数据失败", e);
	}).then((e) => {
		if (e) return e.json();
	});
}
function Nl(e, t, r, n) {
	const i = e, o = "{z}/{x}/{y}." + i.format;
	let a = r;
	r || (a = i.name);
	const s = /* @__PURE__ */ new Map(), u = {
		urlTemplate: t.replace("metadata.json", o),
		layerName: a,
		vtlayers: s
	};
	if (u) {
		if (i.minzoom && (u.minimumLevel = Number(i.minzoom)), i.maxzoom && (u.maximumLevel = Number(i.maxzoom)), i.bounds) {
			const e = i.bounds.split(",").map((e) => Number(e));
			u.rectangle = Qi.fromDegrees(e[0], e[1], e[2], e[3]);
		}
		if (i.json) {
			const e = JSON.parse(i.json);
			if (e) {
				const t = e.vector_layers, r = e.tilestats.layers;
				t.forEach((e) => {
					const t = n[e.id];
					if (!t) return;
					const i = new I(e.id);
					i.minLevel = e.minzoom ?? 0, e.maxzoom && e.maxzoom > i.minLevel && (i.maxLevel = e.maxzoom);
					const o = r.find((t) => t.layer === e.id);
					if (o) {
						switch (o.geometry) {
							case "Point":
								i.geoType = 1, i.style = new il(t);
								break;
							case "LineString":
								i.geoType = 2, i.style = new ol(t);
								break;
							case "Polygon": i.geoType = 3;
						}
						e.fields && (i.fields = e.fields), s.set(e.id, i);
					}
				});
			}
		}
	}
	return u;
}
function vl(e, t, r, n) {
	const i = e;
	let o = t;
	t || (o = i.name);
	const a = /* @__PURE__ */ new Map(), s = {
		urlTemplate: n.replace("tile.json", "{z}/{x}/{y}.mvt"),
		layerName: o,
		vtlayers: a
	};
	if (s) {
		if (s.minimumLevel = i.minzoom, s.maximumLevel = i.maxzoom, i.bounds) {
			const e = i.bounds;
			s.rectangle = Qi.fromDegrees(e[0], e[1], e[2], e[3]);
		}
		i.vector_layers.forEach((e) => {
			const t = r[e.id];
			if (!t) return;
			const n = new I(e.id);
			switch (n.minLevel = e.minzoom ?? 0, e.maxzoom && e.maxzoom > n.minLevel && (n.maxLevel = e.maxzoom), n.style = new il(t), e.geometry_type) {
				case "multipoint":
				case "point":
					n.geoType = 1;
					break;
				case "line":
					n.geoType = 2;
					break;
				case "polygon": n.geoType = 3;
			}
			e.fields && (n.fields = e.fields), a.set(e.id, n);
		});
	}
	return s;
}
function Pl(e, t, r, n) {
	return {
		tileURL: decodeURIComponent(e).replace("{z}", String(n)).replace("{x}", String(t)).replace("{y}", String(r)),
		tileKey: t + "_" + r + "_" + n,
		requestedTile: {
			x: t,
			y: r,
			level: n
		}
	};
}
async function Ml(e) {
	const t = await cn.fetchArrayBuffer({ url: e })?.catch(() => {
		console.log("解析瓦片错误", e);
	});
	if (t) return new hl(new _l(t));
}
function Ll(e, t, r, n) {
	return Fl(t, r, n, nl({}, e));
}
function Fl(e, t, r, n) {
	let i = n;
	const o = e[t];
	let a = !1;
	el(r.excludeValue) ? a = r.excludeValue.split(",").findIndex((e) => e === o) >= 0 : r.excludeValue && o === r.excludeValue && (a = !0);
	let s = !0;
	if (r.includeValue) if (tl(r.includeValue)) o !== r.includeValue && (s = !1);
	else {
		const e = r.includeValue.split(",");
		e && (s = e.indexOf(o) >= 0);
	}
	if (s && !a) {
		const e = il.fromOption(r);
		return i = nl(i, e), i;
	}
	return !s || a ? r.children ? (r.children.forEach((r) => {
		i = Fl(e, r.filterField ?? t, r, i);
	}), i) : void 0 : i;
}
y(((e, r) => {
	let n = {};
	for (var i in e) t(n, i, {
		get: e[i],
		enumerable: !0
	});
	return r || t(n, Symbol.toStringTag, { value: "Module" }), n;
})({
	buildTileURLParams: () => Pl,
	createFromMetadata: () => Nl,
	createFromTilejson: () => vl,
	doParseTile: () => Ml,
	getFeatureLabelOption: () => Ll,
	loadVTileJson: () => Cl
}));
