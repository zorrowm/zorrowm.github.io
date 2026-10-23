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
*/ const c = Symbol("Comlink.proxy"), l = Symbol("Comlink.endpoint"), f = Symbol("Comlink.releaseProxy"), h = Symbol("Comlink.finalizer"), p = Symbol("Comlink.thrown"), m = (e) => "object" == typeof e && null !== e || "function" == typeof e, d = /* @__PURE__ */ new Map([["proxy", {
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
		}), O(e, t, [], void 0);
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
const b = /* @__PURE__ */ new WeakMap(), T = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
	const t = (b.get(e) || 0) - 1;
	b.set(e, t), 0 === t && E(e);
});
function O(e, t, r = [], n = function() {}) {
	let i = !1;
	const o = new Proxy(n, {
		get(n, a) {
			if (g(i), a === f) return () => {
				(function(e) {
					T && T.unregister(e);
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
			return O(e, t, [...r, a]);
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
			if ("bind" === s) return O(e, t, r.slice(0, -1));
			const [u, c] = w(a);
			return S(e, t, {
				type: "APPLY",
				path: r.map((e) => e.toString()),
				argumentList: u
			}, c).then(R);
		},
		construct(n, o) {
			g(i);
			const [a, s] = w(o);
			return S(e, t, {
				type: "CONSTRUCT",
				path: r.map((e) => e.toString()),
				argumentList: a
			}, s).then(R);
		}
	});
	return function(e, t) {
		const r = (b.get(t) || 0) + 1;
		b.set(t, r), T && T.register(e, t, e);
	}(o, e), o;
}
function w(e) {
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
const C = {};
function N(e) {
	return null != e;
}
function v(e) {
	let t;
	this.name = "DeveloperError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
C.EMPTY_OBJECT = Object.freeze({}), C.EMPTY_ARRAY = Object.freeze([]), N(Object.create) && (v.prototype = Object.create(Error.prototype), v.prototype.constructor = v), v.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return N(this.stack) && (e += `\n${this.stack.toString()}`), e;
}, v.throwInstantiationError = function() {
	throw new v("This function defines an interface and should not be called directly.");
};
const P = {};
function M(e, t, r) {
	return `Expected ${r} to be typeof ${t}, actual typeof was ${e}`;
}
function L() {
	this._listeners = /* @__PURE__ */ new Map(), this._toRemove = /* @__PURE__ */ new Map(), this._toAdd = /* @__PURE__ */ new Map(), this._invokingListeners = !1, this._listenerCount = 0;
}
function F(e, t, r, n) {
	t.has(r) || t.set(r, /* @__PURE__ */ new Set());
	const i = t.get(r);
	return !i.has(n) && (i.add(n), !0);
}
function D(e, t, r, n) {
	const i = t.get(r);
	if (!i || !i.has(n)) return !1;
	if (e._invokingListeners) {
		if (!F(0, e._toRemove, r, n)) return !1;
	} else i.delete(n), 0 === i.size && t.delete(r);
	return !0;
}
P.typeOf = {}, P.defined = function(e, t) {
	if (!N(t)) throw new v(function(e) {
		return `${e} is required, actual value was undefined`;
	}(e));
}, P.typeOf.func = function(e, t) {
	if ("function" != typeof t) throw new v(M(typeof t, "function", e));
}, P.typeOf.string = function(e, t) {
	if ("string" != typeof t) throw new v(M(typeof t, "string", e));
}, P.typeOf.number = function(e, t) {
	if ("number" != typeof t) throw new v(M(typeof t, "number", e));
}, P.typeOf.number.lessThan = function(e, t, r) {
	if (P.typeOf.number(e, t), t >= r) throw new v(`Expected ${e} to be less than ${r}, actual value was ${t}`);
}, P.typeOf.number.lessThanOrEquals = function(e, t, r) {
	if (P.typeOf.number(e, t), t > r) throw new v(`Expected ${e} to be less than or equal to ${r}, actual value was ${t}`);
}, P.typeOf.number.greaterThan = function(e, t, r) {
	if (P.typeOf.number(e, t), t <= r) throw new v(`Expected ${e} to be greater than ${r}, actual value was ${t}`);
}, P.typeOf.number.greaterThanOrEquals = function(e, t, r) {
	if (P.typeOf.number(e, t), t < r) throw new v(`Expected ${e} to be greater than or equal to ${r}, actual value was ${t}`);
}, P.typeOf.object = function(e, t) {
	if ("object" != typeof t) throw new v(M(typeof t, "object", e));
}, P.typeOf.bool = function(e, t) {
	if ("boolean" != typeof t) throw new v(M(typeof t, "boolean", e));
}, P.typeOf.bigint = function(e, t) {
	if ("bigint" != typeof t) throw new v(M(typeof t, "bigint", e));
}, P.typeOf.number.equals = function(e, t, r, n) {
	if (P.typeOf.number(e, r), P.typeOf.number(t, n), r !== n) throw new v(`${e} must be equal to ${t}, the actual values are ${r} and ${n}`);
}, Object.defineProperties(L.prototype, { numberOfListeners: { get: function() {
	return this._listenerCount;
} } }), L.prototype.addEventListener = function(e, t) {
	P.typeOf.func("listener", e);
	const r = this;
	return F(0, r._invokingListeners ? r._toAdd : r._listeners, e, t) && r._listenerCount++, function() {
		r.removeEventListener(e, t);
	};
}, L.prototype.removeEventListener = function(e, t) {
	P.typeOf.func("listener", e);
	const r = D(this, this._listeners, e, t), n = D(this, this._toAdd, e, t), i = r || n;
	return i && this._listenerCount--, i;
}, L.prototype.raiseEvent = function() {
	this._invokingListeners = !0;
	for (const [e, t] of this._listeners.entries()) if (N(e)) for (const r of t) e.apply(r, arguments);
	this._invokingListeners = !1;
	for (const [e, t] of this._toAdd.entries()) for (const r of t) F(0, this._listeners, e, r);
	this._toAdd.clear();
	for (const [e, t] of this._toRemove.entries()) for (const r of t) D(this, this._listeners, e, r);
	this._toRemove.clear();
};
var z = s(a((e, t) => {
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
const B = {
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
B.sign = Math.sign ?? function(e) {
	return 0 === (e = +e) || e != e ? e : e > 0 ? 1 : -1;
}, B.signNotZero = function(e) {
	return e < 0 ? -1 : 1;
}, B.toSNorm = function(e, t) {
	return t = t ?? 255, Math.round((.5 * B.clamp(e, -1, 1) + .5) * t);
}, B.fromSNorm = function(e, t) {
	return t = t ?? 255, B.clamp(e, 0, t) / t * 2 - 1;
}, B.normalize = function(e, t, r) {
	return 0 === (r = Math.max(r - t, 0)) ? 0 : B.clamp((e - t) / r, 0, 1);
}, B.sinh = Math.sinh ?? function(e) {
	return (Math.exp(e) - Math.exp(-e)) / 2;
}, B.cosh = Math.cosh ?? function(e) {
	return (Math.exp(e) + Math.exp(-e)) / 2;
}, B.lerp = function(e, t, r) {
	return (1 - r) * e + r * t;
}, B.PI = Math.PI, B.ONE_OVER_PI = 1 / Math.PI, B.PI_OVER_TWO = Math.PI / 2, B.PI_OVER_THREE = Math.PI / 3, B.PI_OVER_FOUR = Math.PI / 4, B.PI_OVER_SIX = Math.PI / 6, B.THREE_PI_OVER_TWO = 3 * Math.PI / 2, B.TWO_PI = 2 * Math.PI, B.ONE_OVER_TWO_PI = 1 / (2 * Math.PI), B.RADIANS_PER_DEGREE = Math.PI / 180, B.DEGREES_PER_RADIAN = 180 / Math.PI, B.RADIANS_PER_ARCSECOND = B.RADIANS_PER_DEGREE / 3600, B.toRadians = function(e) {
	if (!N(e)) throw new v("degrees is required.");
	return e * B.RADIANS_PER_DEGREE;
}, B.toDegrees = function(e) {
	if (!N(e)) throw new v("radians is required.");
	return e * B.DEGREES_PER_RADIAN;
}, B.convertLongitudeRange = function(e) {
	if (!N(e)) throw new v("angle is required.");
	const t = B.TWO_PI, r = e - Math.floor(e / t) * t;
	return r < -Math.PI ? r + t : r >= Math.PI ? r - t : r;
}, B.clampToLatitudeRange = function(e) {
	if (!N(e)) throw new v("angle is required.");
	return B.clamp(e, -1 * B.PI_OVER_TWO, B.PI_OVER_TWO);
}, B.negativePiToPi = function(e) {
	if (!N(e)) throw new v("angle is required.");
	return e >= -B.PI && e <= B.PI ? e : B.zeroToTwoPi(e + B.PI) - B.PI;
}, B.zeroToTwoPi = function(e) {
	if (!N(e)) throw new v("angle is required.");
	if (e >= 0 && e <= B.TWO_PI) return e;
	const t = B.mod(e, B.TWO_PI);
	return Math.abs(t) < B.EPSILON14 && Math.abs(e) > B.EPSILON14 ? B.TWO_PI : t;
}, B.mod = function(e, t) {
	if (!N(e)) throw new v("m is required.");
	if (!N(t)) throw new v("n is required.");
	if (0 === t) throw new v("divisor cannot be 0.");
	return B.sign(e) === B.sign(t) && Math.abs(e) < Math.abs(t) ? e : (e % t + t) % t;
}, B.equalsEpsilon = function(e, t, r, n) {
	if (!N(e)) throw new v("left is required.");
	if (!N(t)) throw new v("right is required.");
	r = r ?? 0, n = n ?? r;
	const i = Math.abs(e - t);
	return i <= n || i <= r * Math.max(Math.abs(e), Math.abs(t));
}, B.lessThan = function(e, t, r) {
	if (!N(e)) throw new v("first is required.");
	if (!N(t)) throw new v("second is required.");
	if (!N(r)) throw new v("absoluteEpsilon is required.");
	return e - t < -r;
}, B.lessThanOrEquals = function(e, t, r) {
	if (!N(e)) throw new v("first is required.");
	if (!N(t)) throw new v("second is required.");
	if (!N(r)) throw new v("absoluteEpsilon is required.");
	return e - t < r;
}, B.greaterThan = function(e, t, r) {
	if (!N(e)) throw new v("first is required.");
	if (!N(t)) throw new v("second is required.");
	if (!N(r)) throw new v("absoluteEpsilon is required.");
	return e - t > r;
}, B.greaterThanOrEquals = function(e, t, r) {
	if (!N(e)) throw new v("first is required.");
	if (!N(t)) throw new v("second is required.");
	if (!N(r)) throw new v("absoluteEpsilon is required.");
	return e - t > -r;
};
const U = [1];
B.factorial = function(e) {
	if ("number" != typeof e || e < 0) throw new v("A number greater than or equal to 0 is required.");
	const t = U.length;
	if (e >= t) {
		let r = U[t - 1];
		for (let n = t; n <= e; n++) {
			const e = r * n;
			U.push(e), r = e;
		}
	}
	return U[e];
}, B.incrementWrap = function(e, t, r) {
	if (r = r ?? 0, !N(e)) throw new v("n is required.");
	if (t <= r) throw new v("maximumValue must be greater than minimumValue.");
	return ++e > t && (e = r), e;
}, B.isPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new v("A number between 0 and (2^32)-1 is required.");
	return 0 !== e && !(e & e - 1);
}, B.nextPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 2147483648) throw new v("A number between 0 and 2^31 is required.");
	return --e, e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ++e;
}, B.previousPowerOfTwo = function(e) {
	if ("number" != typeof e || e < 0 || e > 4294967295) throw new v("A number between 0 and (2^32)-1 is required.");
	return e |= e >> 1, e |= e >> 2, e |= e >> 4, e |= e >> 8, e |= e >> 16, ((e |= e >> 32) >>> 0) - (e >>> 1);
}, B.clamp = function(e, t, r) {
	return P.typeOf.number("value", e), P.typeOf.number("min", t), P.typeOf.number("max", r), e < t ? t : e > r ? r : e;
};
let j = new z.default();
B.setRandomNumberSeed = function(e) {
	if (!N(e)) throw new v("seed is required.");
	j = new z.default(e);
}, B.nextRandomNumber = function() {
	return j.random();
}, B.randomBetween = function(e, t) {
	return B.nextRandomNumber() * (t - e) + e;
}, B.acosClamped = function(e) {
	if (!N(e)) throw new v("value is required.");
	return Math.acos(B.clamp(e, -1, 1));
}, B.asinClamped = function(e) {
	if (!N(e)) throw new v("value is required.");
	return Math.asin(B.clamp(e, -1, 1));
}, B.chordLength = function(e, t) {
	if (!N(e)) throw new v("angle is required.");
	if (!N(t)) throw new v("radius is required.");
	return 2 * t * Math.sin(.5 * e);
}, B.logBase = function(e, t) {
	if (!N(e)) throw new v("number is required.");
	if (!N(t)) throw new v("base is required.");
	return Math.log(e) / Math.log(t);
}, B.cbrt = Math.cbrt ?? function(e) {
	const t = Math.pow(Math.abs(e), 1 / 3);
	return e < 0 ? -t : t;
}, B.log2 = Math.log2 ?? function(e) {
	return Math.log(e) * Math.LOG2E;
}, B.fog = function(e, t) {
	const r = e * t;
	return 1 - Math.exp(-r * r);
}, B.fastApproximateAtan = function(e) {
	return P.typeOf.number("x", e), e * (-.1784 * Math.abs(e) - .0663 * e * e + 1.0301);
}, B.fastApproximateAtan2 = function(e, t) {
	let r;
	P.typeOf.number("x", e), P.typeOf.number("y", t);
	let n = Math.abs(e);
	r = Math.abs(t);
	const i = Math.max(n, r);
	r = Math.min(n, r);
	const o = r / i;
	if (isNaN(o)) throw new v("either x or y must be nonzero");
	return n = B.fastApproximateAtan(o), n = Math.abs(t) > Math.abs(e) ? B.PI_OVER_TWO - n : n, n = e < 0 ? B.PI - n : n, n = t < 0 ? -n : n, n;
};
var q = class e {
	constructor(e, t) {
		this.x = e ?? 0, this.y = t ?? 0;
	}
	static fromElements(t, r, n) {
		return N(n) ? (n.x = t, n.y = r, n) : new e(t, r);
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r.x = t.x, r.y = t.y, r) : new e(t.x, t.y);
	}
	static pack(e, t, r) {
		return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r] = e.y, t;
	}
	static unpack(t, r, n) {
		return P.defined("array", t), r = r ?? 0, N(n) || (n = new e()), n.x = t[r++], n.y = t[r], n;
	}
	static packArray(t, r) {
		P.defined("array", t);
		const n = t.length, i = 2 * n;
		if (N(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 2 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 2 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (P.defined("array", t), P.typeOf.number.greaterThanOrEquals("array.length", t.length, 2), t.length % 2 != 0) throw new v("array length must be a multiple of 2.");
		const n = t.length;
		N(r) ? r.length = n / 2 : r = new Array(n / 2);
		for (let i = 0; i < n; i += 2) {
			const n = i / 2;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return P.typeOf.object("cartesian", e), Math.max(e.x, e.y);
	}
	static minimumComponent(e) {
		return P.typeOf.object("cartesian", e), Math.min(e.x, e.y);
	}
	static minimumByComponent(e, t, r) {
		return P.typeOf.object("first", e), P.typeOf.object("second", t), P.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r;
	}
	static maximumByComponent(e, t, r) {
		return P.typeOf.object("first", e), P.typeOf.object("second", t), P.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r;
	}
	static clamp(e, t, r, n) {
		P.typeOf.object("value", e), P.typeOf.object("min", t), P.typeOf.object("max", r), P.typeOf.object("result", n);
		const i = B.clamp(e.x, t.x, r.x), o = B.clamp(e.y, t.y, r.y);
		return n.x = i, n.y = o, n;
	}
	static magnitudeSquared(e) {
		return P.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return P.typeOf.object("left", t), P.typeOf.object("right", r), e.subtract(t, r, G), e.magnitude(G);
	}
	static distanceSquared(t, r) {
		return P.typeOf.object("left", t), P.typeOf.object("right", r), e.subtract(t, r, G), e.magnitudeSquared(G);
	}
	static normalize(t, r) {
		P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, isNaN(r.x) || isNaN(r.y)) throw new v("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), e.x * t.x + e.y * t.y;
	}
	static cross(e, t) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), e.x * t.y - e.y * t.x;
	}
	static multiplyComponents(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r;
	}
	static divideComponents(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r;
	}
	static add(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r;
	}
	static subtract(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r;
	}
	static multiplyByScalar(e, t, r) {
		return P.typeOf.object("cartesian", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r;
	}
	static divideByScalar(e, t, r) {
		return P.typeOf.object("cartesian", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r;
	}
	static negate(e, t) {
		return P.typeOf.object("cartesian", e), P.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t;
	}
	static abs(e, t) {
		return P.typeOf.object("cartesian", e), P.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t;
	}
	static lerp(t, r, n, i) {
		return P.typeOf.object("start", t), P.typeOf.object("end", r), P.typeOf.number("t", n), P.typeOf.object("result", i), e.multiplyByScalar(r, n, W), i = e.multiplyByScalar(t, 1 - n, i), e.add(W, i, i);
	}
	static angleBetween(t, r) {
		return P.typeOf.object("left", t), P.typeOf.object("right", r), e.normalize(t, k), e.normalize(r, V), B.acosClamped(e.dot(k, V));
	}
	static mostOrthogonalAxis(t, r) {
		P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = e.normalize(t, H);
		return e.abs(n, n), n.x <= n.y ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Y, r);
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && e.x === t.x && e.y === t.y;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || N(e) && N(t) && B.equalsEpsilon(e.x, t.x, r, n) && B.equalsEpsilon(e.y, t.y, r, n);
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
q.fromCartesian3 = q.clone, q.fromCartesian4 = q.clone, q.packedLength = 2, q.fromArray = q.unpack;
const G = new q(), W = new q(), k = new q(), V = new q(), H = new q();
q.ZERO = Object.freeze(new q(0, 0)), q.ONE = Object.freeze(new q(1, 1)), q.UNIT_X = Object.freeze(new q(1, 0)), q.UNIT_Y = Object.freeze(new q(0, 1));
var Y = class e {
	constructor(e, t, r) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0;
	}
	static fromSpherical(t, r) {
		P.typeOf.object("spherical", t), N(r) || (r = new e());
		const n = t.clock, i = t.cone, o = t.magnitude ?? 1, a = o * Math.sin(i);
		return r.x = a * Math.cos(n), r.y = a * Math.sin(n), r.z = o * Math.cos(i), r;
	}
	static fromElements(t, r, n, i) {
		return N(i) ? (i.x = t, i.y = r, i.z = n, i) : new e(t, r, n);
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r) : new e(t.x, t.y, t.z);
	}
	static pack(e, t, r) {
		return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r] = e.z, t;
	}
	static unpack(t, r, n) {
		return P.defined("array", t), r = r ?? 0, N(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r], n;
	}
	static packArray(t, r) {
		P.defined("array", t);
		const n = t.length, i = 3 * n;
		if (N(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 3 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 3 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (P.defined("array", t), P.typeOf.number.greaterThanOrEquals("array.length", t.length, 3), t.length % 3 != 0) throw new v("array length must be a multiple of 3.");
		const n = t.length;
		N(r) ? r.length = n / 3 : r = new Array(n / 3);
		for (let i = 0; i < n; i += 3) {
			const n = i / 3;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return P.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z);
	}
	static minimumComponent(e) {
		return P.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z);
	}
	static minimumByComponent(e, t, r) {
		return P.typeOf.object("first", e), P.typeOf.object("second", t), P.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r;
	}
	static maximumByComponent(e, t, r) {
		return P.typeOf.object("first", e), P.typeOf.object("second", t), P.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r;
	}
	static clamp(e, t, r, n) {
		P.typeOf.object("value", e), P.typeOf.object("min", t), P.typeOf.object("max", r), P.typeOf.object("result", n);
		const i = B.clamp(e.x, t.x, r.x), o = B.clamp(e.y, t.y, r.y), a = B.clamp(e.z, t.z, r.z);
		return n.x = i, n.y = o, n.z = a, n;
	}
	static magnitudeSquared(e) {
		return P.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return P.typeOf.object("left", t), P.typeOf.object("right", r), e.subtract(t, r, X), e.magnitude(X);
	}
	static distanceSquared(t, r) {
		return P.typeOf.object("left", t), P.typeOf.object("right", r), e.subtract(t, r, X), e.magnitudeSquared(X);
	}
	static normalize(t, r) {
		P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z)) throw new v("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z;
	}
	static multiplyComponents(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r;
	}
	static divideComponents(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r;
	}
	static add(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r;
	}
	static subtract(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r;
	}
	static multiplyByScalar(e, t, r) {
		return P.typeOf.object("cartesian", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r;
	}
	static divideByScalar(e, t, r) {
		return P.typeOf.object("cartesian", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r;
	}
	static negate(e, t) {
		return P.typeOf.object("cartesian", e), P.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t;
	}
	static abs(e, t) {
		return P.typeOf.object("cartesian", e), P.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t;
	}
	static lerp(t, r, n, i) {
		return P.typeOf.object("start", t), P.typeOf.object("end", r), P.typeOf.number("t", n), P.typeOf.object("result", i), e.multiplyByScalar(r, n, $), i = e.multiplyByScalar(t, 1 - n, i), e.add($, i, i);
	}
	static angleBetween(t, r) {
		P.typeOf.object("left", t), P.typeOf.object("right", r), e.normalize(t, K), e.normalize(r, Z);
		const n = e.dot(K, Z), i = e.magnitude(e.cross(K, Z, K));
		return Math.atan2(i, n);
	}
	static mostOrthogonalAxis(t, r) {
		P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = e.normalize(t, Q);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_Z, r) : n.y <= n.z ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_Z, r);
	}
	static projectVector(t, r, n) {
		P.defined("a", t), P.defined("b", r), P.defined("result", n);
		const i = e.dot(t, r) / e.dot(r, r);
		return e.multiplyByScalar(r, i, n);
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && e.x === t.x && e.y === t.y && e.z === t.z;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || N(e) && N(t) && B.equalsEpsilon(e.x, t.x, r, n) && B.equalsEpsilon(e.y, t.y, r, n) && B.equalsEpsilon(e.z, t.z, r, n);
	}
	static cross(e, t, r) {
		P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r);
		const n = e.x, i = e.y, o = e.z, a = t.x, s = t.y, u = t.z, c = i * u - o * s, l = o * a - n * u, f = n * s - i * a;
		return r.x = c, r.y = l, r.z = f, r;
	}
	static midpoint(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = .5 * (e.x + t.x), r.y = .5 * (e.y + t.y), r.z = .5 * (e.z + t.z), r;
	}
	static fromDegrees(t, r, n, i, o) {
		return P.typeOf.number("longitude", t), P.typeOf.number("latitude", r), t = B.toRadians(t), r = B.toRadians(r), e.fromRadians(t, r, n, i, o);
	}
	static fromRadians(t, r, n, i, o) {
		P.typeOf.number("longitude", t), P.typeOf.number("latitude", r), n = n ?? 0;
		const a = N(i) ? i.radiiSquared : e._ellipsoidRadiiSquared, s = Math.cos(r);
		J.x = s * Math.cos(t), J.y = s * Math.sin(t), J.z = Math.sin(r), J = e.normalize(J, J), e.multiplyComponents(a, J, ee);
		const u = Math.sqrt(e.dot(J, ee));
		return ee = e.divideByScalar(ee, u, ee), J = e.multiplyByScalar(J, n, J), N(o) || (o = new e()), e.add(ee, J, o);
	}
	static fromDegreesArray(t, r, n) {
		if (P.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new v("the number of coordinates must be a multiple of 2 and at least 2");
		const i = t.length;
		N(n) ? n.length = i / 2 : n = new Array(i / 2);
		for (let o = 0; o < i; o += 2) {
			const i = t[o], a = t[o + 1], s = o / 2;
			n[s] = e.fromDegrees(i, a, 0, r, n[s]);
		}
		return n;
	}
	static fromRadiansArray(t, r, n) {
		if (P.defined("coordinates", t), t.length < 2 || t.length % 2 != 0) throw new v("the number of coordinates must be a multiple of 2 and at least 2");
		const i = t.length;
		N(n) ? n.length = i / 2 : n = new Array(i / 2);
		for (let o = 0; o < i; o += 2) {
			const i = t[o], a = t[o + 1], s = o / 2;
			n[s] = e.fromRadians(i, a, 0, r, n[s]);
		}
		return n;
	}
	static fromDegreesArrayHeights(t, r, n) {
		if (P.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new v("the number of coordinates must be a multiple of 3 and at least 3");
		const i = t.length;
		N(n) ? n.length = i / 3 : n = new Array(i / 3);
		for (let o = 0; o < i; o += 3) {
			const i = t[o], a = t[o + 1], s = t[o + 2], u = o / 3;
			n[u] = e.fromDegrees(i, a, s, r, n[u]);
		}
		return n;
	}
	static fromRadiansArrayHeights(t, r, n) {
		if (P.defined("coordinates", t), t.length < 3 || t.length % 3 != 0) throw new v("the number of coordinates must be a multiple of 3 and at least 3");
		const i = t.length;
		N(n) ? n.length = i / 3 : n = new Array(i / 3);
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
Y.fromCartesian4 = Y.clone, Y.packedLength = 3, Y.fromArray = Y.unpack;
const X = new Y(), $ = new Y(), K = new Y(), Z = new Y(), Q = new Y();
let J = new Y(), ee = new Y();
Y._ellipsoidRadiiSquared = new Y(40680631590769, 40680631590769, 40408299984661.445), Y.ZERO = Object.freeze(new Y(0, 0, 0)), Y.ONE = Object.freeze(new Y(1, 1, 1)), Y.UNIT_X = Object.freeze(new Y(1, 0, 0)), Y.UNIT_Y = Object.freeze(new Y(0, 1, 0)), Y.UNIT_Z = Object.freeze(new Y(0, 0, 1));
const te = new Y(), re = new Y();
function ne(e, t, r, n, i) {
	if (!N(e)) throw new v("cartesian is required.");
	if (!N(t)) throw new v("oneOverRadii is required.");
	if (!N(r)) throw new v("oneOverRadiiSquared is required.");
	if (!N(n)) throw new v("centerToleranceSquared is required.");
	const o = e.x, a = e.y, s = e.z, u = t.x, c = t.y, l = t.z, f = o * o * u * u, h = a * a * c * c, p = s * s * l * l, m = f + h + p, d = Math.sqrt(1 / m), y = Y.multiplyByScalar(e, d, te);
	if (m < n) return isFinite(d) ? Y.clone(y, i) : void 0;
	const _ = r.x, g = r.y, E = r.z, b = re;
	b.x = y.x * _ * 2, b.y = y.y * g * 2, b.z = y.z * E * 2;
	let T, O, w, A, x, R, S, I, C, P, M, L = (1 - d) * Y.magnitude(e) / (.5 * Y.magnitude(b)), F = 0;
	do
		L -= F, w = 1 / (1 + L * _), A = 1 / (1 + L * g), x = 1 / (1 + L * E), R = w * w, S = A * A, I = x * x, C = R * w, P = S * A, M = I * x, T = f * R + h * S + p * I - 1, O = f * C * _ + h * P * g + p * M * E, F = T / (-2 * O);
	while (Math.abs(T) > B.EPSILON12);
	return N(i) ? (i.x = o * w, i.y = a * A, i.z = s * x, i) : new Y(o * w, a * A, s * x);
}
var ie = class e {
	constructor(e, t, r) {
		this.longitude = e ?? 0, this.latitude = t ?? 0, this.height = r ?? 0;
	}
	static fromRadians(t, r, n, i) {
		return P.typeOf.number("longitude", t), P.typeOf.number("latitude", r), n = n ?? 0, N(i) ? (i.longitude = t, i.latitude = r, i.height = n, i) : new e(t, r, n);
	}
	static fromDegrees(t, r, n, i) {
		return P.typeOf.number("longitude", t), P.typeOf.number("latitude", r), t = B.toRadians(t), r = B.toRadians(r), e.fromRadians(t, r, n, i);
	}
	static fromCartesian(t, r, n) {
		const i = N(r) ? r.oneOverRadii : e._ellipsoidOneOverRadii, o = N(r) ? r.oneOverRadiiSquared : e._ellipsoidOneOverRadiiSquared, a = ne(t, i, o, N(r) ? r._centerToleranceSquared : e._ellipsoidCenterToleranceSquared, ae);
		if (!N(a)) return;
		let s = Y.multiplyComponents(a, o, oe);
		s = Y.normalize(s, s);
		const u = Y.subtract(t, a, se), c = Math.atan2(s.y, s.x), l = Math.asin(s.z), f = B.sign(Y.dot(u, t)) * Y.magnitude(u);
		return N(n) ? (n.longitude = c, n.latitude = l, n.height = f, n) : new e(c, l, f);
	}
	static toCartesian(e, t, r) {
		return P.defined("cartographic", e), Y.fromRadians(e.longitude, e.latitude, e.height, t, r);
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r.longitude = t.longitude, r.latitude = t.latitude, r.height = t.height, r) : new e(t.longitude, t.latitude, t.height);
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && e.longitude === t.longitude && e.latitude === t.latitude && e.height === t.height;
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || N(e) && N(t) && Math.abs(e.longitude - t.longitude) <= r && Math.abs(e.latitude - t.latitude) <= r && Math.abs(e.height - t.height) <= r;
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
	static _ellipsoidOneOverRadii = new Y(1 / 6378137, 1 / 6378137, 1 / 6356752.314245179);
	static _ellipsoidOneOverRadiiSquared = new Y(1 / 40680631590769, 1 / 40680631590769, 1 / 40408299984661.445);
	static _ellipsoidCenterToleranceSquared = B.EPSILON1;
};
ie.ZERO = Object.freeze(new ie(0, 0, 0));
const oe = new Y(), ae = new Y(), se = new Y();
function ue(e, t, r, n) {
	t = t ?? 0, r = r ?? 0, n = n ?? 0, P.typeOf.number.greaterThanOrEquals("x", t, 0), P.typeOf.number.greaterThanOrEquals("y", r, 0), P.typeOf.number.greaterThanOrEquals("z", n, 0), e._radii = new Y(t, r, n), e._radiiSquared = new Y(t * t, r * r, n * n), e._radiiToTheFourth = new Y(t * t * t * t, r * r * r * r, n * n * n * n), e._oneOverRadii = new Y(0 === t ? 0 : 1 / t, 0 === r ? 0 : 1 / r, 0 === n ? 0 : 1 / n), e._oneOverRadiiSquared = new Y(0 === t ? 0 : 1 / (t * t), 0 === r ? 0 : 1 / (r * r), 0 === n ? 0 : 1 / (n * n)), e._minimumRadius = Math.min(t, r, n), e._maximumRadius = Math.max(t, r, n), e._centerToleranceSquared = B.EPSILON1, 0 !== e._radiiSquared.z && (e._squaredXOverSquaredZ = e._radiiSquared.x / e._radiiSquared.z);
}
var ce = class e {
	constructor(e, t, r) {
		this._radii = void 0, this._radiiSquared = void 0, this._radiiToTheFourth = void 0, this._oneOverRadii = void 0, this._oneOverRadiiSquared = void 0, this._minimumRadius = void 0, this._maximumRadius = void 0, this._centerToleranceSquared = void 0, this._squaredXOverSquaredZ = void 0, ue(this, e, t, r);
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
		if (!N(t)) return;
		const n = t._radii;
		return N(r) ? (Y.clone(n, r._radii), Y.clone(t._radiiSquared, r._radiiSquared), Y.clone(t._radiiToTheFourth, r._radiiToTheFourth), Y.clone(t._oneOverRadii, r._oneOverRadii), Y.clone(t._oneOverRadiiSquared, r._oneOverRadiiSquared), r._minimumRadius = t._minimumRadius, r._maximumRadius = t._maximumRadius, r._centerToleranceSquared = t._centerToleranceSquared, r) : new e(n.x, n.y, n.z);
	}
	static fromCartesian3(t, r) {
		return N(r) || (r = new e()), N(t) ? (ue(r, t.x, t.y, t.z), r) : r;
	}
	static get default() {
		return e._default;
	}
	static set default(t) {
		P.typeOf.object("value", t), e._default = t, Y._ellipsoidRadiiSquared = t.radiiSquared, ie._ellipsoidOneOverRadii = t.oneOverRadii, ie._ellipsoidOneOverRadiiSquared = t.oneOverRadiiSquared, ie._ellipsoidCenterToleranceSquared = t._centerToleranceSquared;
	}
	clone(t) {
		return e.clone(this, t);
	}
	static pack(e, t, r) {
		return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, Y.pack(e._radii, t, r), t;
	}
	static unpack(t, r, n) {
		P.defined("array", t), r = r ?? 0;
		const i = Y.unpack(t, r);
		return e.fromCartesian3(i, n);
	}
	geodeticSurfaceNormalCartographic(e, t) {
		P.typeOf.object("cartographic", e);
		const r = e.longitude, n = e.latitude, i = Math.cos(n), o = i * Math.cos(r), a = i * Math.sin(r), s = Math.sin(n);
		return N(t) || (t = new Y()), t.x = o, t.y = a, t.z = s, Y.normalize(t, t);
	}
	geodeticSurfaceNormal(e, t) {
		if (P.typeOf.object("cartesian", e), isNaN(e.x) || isNaN(e.y) || isNaN(e.z)) throw new v("cartesian has a NaN component");
		if (!Y.equalsEpsilon(e, Y.ZERO, B.EPSILON14)) return N(t) || (t = new Y()), t = Y.multiplyComponents(e, this._oneOverRadiiSquared, t), Y.normalize(t, t);
	}
	cartographicToCartesian(e, t) {
		const r = le, n = fe;
		this.geodeticSurfaceNormalCartographic(e, r), Y.multiplyComponents(this._radiiSquared, r, n);
		const i = Math.sqrt(Y.dot(r, n));
		return Y.divideByScalar(n, i, n), Y.multiplyByScalar(r, e.height, r), N(t) || (t = new Y()), Y.add(n, r, t);
	}
	cartographicArrayToCartesianArray(e, t) {
		P.defined("cartographics", e);
		const r = e.length;
		N(t) ? t.length = r : t = new Array(r);
		for (let n = 0; n < r; n++) t[n] = this.cartographicToCartesian(e[n], t[n]);
		return t;
	}
	cartesianToCartographic(e, t) {
		const r = this.scaleToGeodeticSurface(e, pe);
		if (!N(r)) return;
		const n = this.geodeticSurfaceNormal(r, he), i = Y.subtract(e, r, me), o = Math.atan2(n.y, n.x), a = Math.asin(n.z), s = B.sign(Y.dot(i, e)) * Y.magnitude(i);
		return N(t) ? (t.longitude = o, t.latitude = a, t.height = s, t) : new ie(o, a, s);
	}
	cartesianArrayToCartographicArray(e, t) {
		P.defined("cartesians", e);
		const r = e.length;
		N(t) ? t.length = r : t = new Array(r);
		for (let n = 0; n < r; ++n) t[n] = this.cartesianToCartographic(e[n], t[n]);
		return t;
	}
	scaleToGeodeticSurface(e, t) {
		return ne(e, this._oneOverRadii, this._oneOverRadiiSquared, this._centerToleranceSquared, t);
	}
	scaleToGeocentricSurface(e, t) {
		P.typeOf.object("cartesian", e), N(t) || (t = new Y());
		const r = e.x, n = e.y, i = e.z, o = this._oneOverRadiiSquared, a = 1 / Math.sqrt(r * r * o.x + n * n * o.y + i * i * o.z);
		return Y.multiplyByScalar(e, a, t);
	}
	transformPositionToScaledSpace(e, t) {
		return N(t) || (t = new Y()), Y.multiplyComponents(e, this._oneOverRadii, t);
	}
	transformPositionFromScaledSpace(e, t) {
		return N(t) || (t = new Y()), Y.multiplyComponents(e, this._radii, t);
	}
	equals(e) {
		return this === e || N(e) && Y.equals(this._radii, e._radii);
	}
	toString() {
		return this._radii.toString();
	}
	getSurfaceNormalIntersectionWithZAxis(e, t, r) {
		if (P.typeOf.object("position", e), !B.equalsEpsilon(this._radii.x, this._radii.y, B.EPSILON15)) throw new v("Ellipsoid must be an ellipsoid of revolution (radii.x == radii.y)");
		P.typeOf.number.greaterThan("Ellipsoid.radii.z", this._radii.z, 0), t = t ?? 0;
		const n = this._squaredXOverSquaredZ;
		if (N(r) || (r = new Y()), r.x = 0, r.y = 0, r.z = e.z * (1 - n), !(Math.abs(r.z) >= this._radii.z - t)) return r;
	}
	getLocalCurvature(e, t) {
		P.typeOf.object("surfacePosition", e), N(t) || (t = new q());
		const r = this.getSurfaceNormalIntersectionWithZAxis(e, 0, de), n = Y.distance(e, r), i = n * (this.minimumRadius * n / this.maximumRadius ** 2) ** 2;
		return q.fromElements(1 / n, 1 / i, t);
	}
	surfaceArea(e) {
		P.typeOf.object("rectangle", e);
		const t = e.west;
		let r = e.east;
		const n = e.south, i = e.north;
		for (; r < t;) r += B.TWO_PI;
		const o = this._radiiSquared, a = o.x, s = o.y, u = o.z, c = a * s;
		return ge(n, i, function(e) {
			const n = Math.cos(e), i = Math.sin(e);
			return Math.cos(e) * ge(t, r, function(e) {
				const t = Math.cos(e), r = Math.sin(e);
				return Math.sqrt(c * i * i + u * (s * t * t + a * r * r) * n * n);
			});
		});
	}
};
ce.WGS84 = Object.freeze(new ce(6378137, 6378137, 6356752.314245179)), ce.UNIT_SPHERE = Object.freeze(new ce(1, 1, 1)), ce.MOON = Object.freeze(new ce(B.LUNAR_RADIUS, B.LUNAR_RADIUS, B.LUNAR_RADIUS)), ce.MARS = Object.freeze(new ce(3396190, 3396190, 3376200)), ce._default = ce.WGS84, ce.packedLength = Y.packedLength, ce.prototype.geocentricSurfaceNormal = Y.normalize;
const le = new Y(), fe = new Y(), he = new Y(), pe = new Y(), me = new Y(), de = new Y(), ye = [
	.14887433898163,
	.43339539412925,
	.67940956829902,
	.86506336668898,
	.97390652851717,
	0
], _e = [
	.29552422471475,
	.26926671930999,
	.21908636251598,
	.14945134915058,
	.066671344308684,
	0
];
function ge(e, t, r) {
	P.typeOf.number("a", e), P.typeOf.number("b", t), P.typeOf.func("func", r);
	const n = .5 * (t + e), i = .5 * (t - e);
	let o = 0;
	for (let a = 0; a < 5; a++) {
		const e = i * ye[a];
		o += _e[a] * (r(n + e) + r(n - e));
	}
	return o *= i, o;
}
var Ee = class {
	constructor(e) {
		this._ellipsoid = e ?? ce.default, this._semimajorAxis = this._ellipsoid.maximumRadius, this._oneOverSemimajorAxis = 1 / this._semimajorAxis;
	}
	get ellipsoid() {
		return this._ellipsoid;
	}
	project(e, t) {
		const r = this._semimajorAxis, n = e.longitude * r, i = e.latitude * r, o = e.height;
		return N(t) ? (t.x = n, t.y = i, t.z = o, t) : new Y(n, i, o);
	}
	unproject(e, t) {
		if (!N(e)) throw new v("cartesian is required");
		const r = this._oneOverSemimajorAxis, n = e.x * r, i = e.y * r, o = e.z;
		return N(t) ? (t.longitude = n, t.latitude = i, t.height = o, t) : new ie(n, i, o);
	}
};
const be = {
	OUTSIDE: -1,
	INTERSECTING: 0,
	INSIDE: 1
};
Object.freeze(be);
var Te = class e {
	constructor(e, t, r, n) {
		this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0, this.w = n ?? 0;
	}
	static fromElements(t, r, n, i, o) {
		return N(o) ? (o.x = t, o.y = r, o.z = n, o.w = i, o) : new e(t, r, n, i);
	}
	static fromColor(t, r) {
		return P.typeOf.object("color", t), N(r) ? (r.x = t.red, r.y = t.green, r.z = t.blue, r.w = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r.x = t.x, r.y = t.y, r.z = t.z, r.w = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static pack(e, t, r) {
		return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.z, t[r] = e.w, t;
	}
	static unpack(t, r, n) {
		return P.defined("array", t), r = r ?? 0, N(n) || (n = new e()), n.x = t[r++], n.y = t[r++], n.z = t[r++], n.w = t[r], n;
	}
	static packArray(t, r) {
		P.defined("array", t);
		const n = t.length, i = 4 * n;
		if (N(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 4 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 4 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (P.defined("array", t), P.typeOf.number.greaterThanOrEquals("array.length", t.length, 4), t.length % 4 != 0) throw new v("array length must be a multiple of 4.");
		const n = t.length;
		N(r) ? r.length = n / 4 : r = new Array(n / 4);
		for (let i = 0; i < n; i += 4) {
			const n = i / 4;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static maximumComponent(e) {
		return P.typeOf.object("cartesian", e), Math.max(e.x, e.y, e.z, e.w);
	}
	static minimumComponent(e) {
		return P.typeOf.object("cartesian", e), Math.min(e.x, e.y, e.z, e.w);
	}
	static minimumByComponent(e, t, r) {
		return P.typeOf.object("first", e), P.typeOf.object("second", t), P.typeOf.object("result", r), r.x = Math.min(e.x, t.x), r.y = Math.min(e.y, t.y), r.z = Math.min(e.z, t.z), r.w = Math.min(e.w, t.w), r;
	}
	static maximumByComponent(e, t, r) {
		return P.typeOf.object("first", e), P.typeOf.object("second", t), P.typeOf.object("result", r), r.x = Math.max(e.x, t.x), r.y = Math.max(e.y, t.y), r.z = Math.max(e.z, t.z), r.w = Math.max(e.w, t.w), r;
	}
	static clamp(e, t, r, n) {
		P.typeOf.object("value", e), P.typeOf.object("min", t), P.typeOf.object("max", r), P.typeOf.object("result", n);
		const i = B.clamp(e.x, t.x, r.x), o = B.clamp(e.y, t.y, r.y), a = B.clamp(e.z, t.z, r.z), s = B.clamp(e.w, t.w, r.w);
		return n.x = i, n.y = o, n.z = a, n.w = s, n;
	}
	static magnitudeSquared(e) {
		return P.typeOf.object("cartesian", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w;
	}
	static magnitude(t) {
		return Math.sqrt(e.magnitudeSquared(t));
	}
	static distance(t, r) {
		return P.typeOf.object("left", t), P.typeOf.object("right", r), e.subtract(t, r, Oe), e.magnitude(Oe);
	}
	static distanceSquared(t, r) {
		return P.typeOf.object("left", t), P.typeOf.object("right", r), e.subtract(t, r, Oe), e.magnitudeSquared(Oe);
	}
	static normalize(t, r) {
		P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = e.magnitude(t);
		if (r.x = t.x / n, r.y = t.y / n, r.z = t.z / n, r.w = t.w / n, isNaN(r.x) || isNaN(r.y) || isNaN(r.z) || isNaN(r.w)) throw new v("normalized result is not a number");
		return r;
	}
	static dot(e, t) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z + e.w * t.w;
	}
	static multiplyComponents(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x * t.x, r.y = e.y * t.y, r.z = e.z * t.z, r.w = e.w * t.w, r;
	}
	static divideComponents(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x / t.x, r.y = e.y / t.y, r.z = e.z / t.z, r.w = e.w / t.w, r;
	}
	static add(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r.w = e.w + t.w, r;
	}
	static subtract(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r.w = e.w - t.w, r;
	}
	static multiplyByScalar(e, t, r) {
		return P.typeOf.object("cartesian", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r.w = e.w * t, r;
	}
	static divideByScalar(e, t, r) {
		return P.typeOf.object("cartesian", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r.w = e.w / t, r;
	}
	static negate(e, t) {
		return P.typeOf.object("cartesian", e), P.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
	}
	static abs(e, t) {
		return P.typeOf.object("cartesian", e), P.typeOf.object("result", t), t.x = Math.abs(e.x), t.y = Math.abs(e.y), t.z = Math.abs(e.z), t.w = Math.abs(e.w), t;
	}
	static lerp(t, r, n, i) {
		return P.typeOf.object("start", t), P.typeOf.object("end", r), P.typeOf.number("t", n), P.typeOf.object("result", i), e.multiplyByScalar(r, n, we), i = e.multiplyByScalar(t, 1 - n, i), e.add(we, i, i);
	}
	static mostOrthogonalAxis(t, r) {
		P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = e.normalize(t, Ae);
		return e.abs(n, n), n.x <= n.y ? n.x <= n.z ? n.x <= n.w ? e.clone(e.UNIT_X, r) : e.clone(e.UNIT_W, r) : n.z <= n.w ? e.clone(e.UNIT_Z, r) : e.clone(e.UNIT_W, r) : n.y <= n.z ? n.y <= n.w ? e.clone(e.UNIT_Y, r) : e.clone(e.UNIT_W, r) : n.z <= n.w ? e.clone(e.UNIT_Z, r) : e.clone(e.UNIT_W, r);
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
	}
	static equalsArray(e, t, r) {
		return e.x === t[r] && e.y === t[r + 1] && e.z === t[r + 2] && e.w === t[r + 3];
	}
	static equalsEpsilon(e, t, r, n) {
		return e === t || N(e) && N(t) && B.equalsEpsilon(e.x, t.x, r, n) && B.equalsEpsilon(e.y, t.y, r, n) && B.equalsEpsilon(e.z, t.z, r, n) && B.equalsEpsilon(e.w, t.w, r, n);
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
		return P.typeOf.number("value", t), N(r) || (r = new e()), xe[0] = t, Ie ? (r.x = Re[0], r.y = Re[1], r.z = Re[2], r.w = Re[3]) : (r.x = Re[3], r.y = Re[2], r.z = Re[1], r.w = Re[0]), r;
	}
	static unpackFloat(e) {
		return P.typeOf.object("packedFloat", e), Ie ? (Re[0] = e.x, Re[1] = e.y, Re[2] = e.z, Re[3] = e.w) : (Re[0] = e.w, Re[1] = e.z, Re[2] = e.y, Re[3] = e.x), xe[0];
	}
};
Te.packedLength = 4, Te.fromArray = Te.unpack;
const Oe = new Te(), we = new Te(), Ae = new Te();
Te.ZERO = Object.freeze(new Te(0, 0, 0, 0)), Te.ONE = Object.freeze(new Te(1, 1, 1, 1)), Te.UNIT_X = Object.freeze(new Te(1, 0, 0, 0)), Te.UNIT_Y = Object.freeze(new Te(0, 1, 0, 0)), Te.UNIT_Z = Object.freeze(new Te(0, 0, 1, 0)), Te.UNIT_W = Object.freeze(new Te(0, 0, 0, 1));
const xe = /* @__PURE__ */ new Float32Array(1), Re = new Uint8Array(xe.buffer), Se = new Uint32Array([287454020]), Ie = 68 === new Uint8Array(Se.buffer)[0];
function Ce(e, t, r) {
	P.defined("array", e), P.defined("itemToFind", t), P.defined("comparator", r);
	let n, i, o = 0, a = e.length - 1;
	for (; o <= a;) if (n = ~~((o + a) / 2), i = r(e[n], t), i < 0) o = n + 1;
	else {
		if (!(i > 0)) return n;
		a = n - 1;
	}
	return ~(a + 1);
}
function Ne(e, t, r, n, i) {
	this.xPoleWander = e, this.yPoleWander = t, this.xPoleOffset = r, this.yPoleOffset = n, this.ut1MinusUtc = i;
}
function ve(e) {
	if (null === e || isNaN(e)) throw new v("year is required and must be a number.");
	return e % 4 == 0 && e % 100 != 0 || e % 400 == 0;
}
const Pe = [
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
function Me(e, t, r, n, i, o, a, s) {
	e = e ?? 1, t = t ?? 1, r = r ?? 1, n = n ?? 0, i = i ?? 0, o = o ?? 0, a = a ?? 0, s = s ?? !1, P.typeOf.number.greaterThanOrEquals("Year", e, 1), P.typeOf.number.lessThanOrEquals("Year", e, 9999), P.typeOf.number.greaterThanOrEquals("Month", t, 1), P.typeOf.number.lessThanOrEquals("Month", t, 12), P.typeOf.number.greaterThanOrEquals("Day", r, 1), P.typeOf.number.lessThanOrEquals("Day", r, 31), P.typeOf.number.greaterThanOrEquals("Hour", n, 0), P.typeOf.number.lessThanOrEquals("Hour", n, 23), P.typeOf.number.greaterThanOrEquals("Minute", i, 0), P.typeOf.number.lessThanOrEquals("Minute", i, 59), P.typeOf.bool("IsLeapSecond", s), P.typeOf.number.greaterThanOrEquals("Second", o, 0), P.typeOf.number.lessThanOrEquals("Second", o, s ? 60 : 59), P.typeOf.number.greaterThanOrEquals("Millisecond", a, 0), P.typeOf.number.lessThan("Millisecond", a, 1e3), function() {
		const n = 2 === t && ve(e) ? Pe[t - 1] + 1 : Pe[t - 1];
		if (r > n) throw new v("Month and Day represents invalid date");
	}(), this.year = e, this.month = t, this.day = r, this.hour = n, this.minute = i, this.second = o, this.millisecond = a, this.isLeapSecond = s;
}
function Le(e, t) {
	this.julianDate = e, this.offset = t;
}
const Fe = {
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
Object.freeze(Fe);
const De = {
	UTC: 0,
	TAI: 1
};
Object.freeze(De);
const ze = new Me(), Be = [
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
	return tt.compare(e.julianDate, t.julianDate);
}
const je = new Le();
function qe(e) {
	je.julianDate = e;
	const t = tt.leapSeconds;
	let r = Ce(t, je, Ue);
	r < 0 && (r = ~r), r >= t.length && (r = t.length - 1);
	let n = t[r].offset;
	r > 0 && tt.secondsDifference(t[r].julianDate, e) > n && (r--, n = t[r].offset), tt.addSeconds(e, n, e);
}
function Ge(e, t) {
	je.julianDate = e;
	const r = tt.leapSeconds;
	let n = Ce(r, je, Ue);
	if (n < 0 && (n = ~n), 0 === n) return tt.addSeconds(e, -r[0].offset, t);
	if (n >= r.length) return tt.addSeconds(e, -r[n - 1].offset, t);
	const i = tt.secondsDifference(r[n].julianDate, e);
	return 0 === i ? tt.addSeconds(e, -r[n].offset, t) : i <= 1 ? void 0 : tt.addSeconds(e, -r[--n].offset, t);
}
function We(e, t, r) {
	const n = t / Fe.SECONDS_PER_DAY | 0;
	return e += n, (t -= Fe.SECONDS_PER_DAY * n) < 0 && (e--, t += Fe.SECONDS_PER_DAY), r.dayNumber = e, r.secondsOfDay = t, r;
}
function ke(e, t, r, n, i, o, a) {
	const s = (t - 14) / 12 | 0, u = e + 4800 + s;
	let c = (1461 * u / 4 | 0) + (367 * (t - 2 - 12 * s) / 12 | 0) - (3 * ((u + 100) / 100 | 0) / 4 | 0) + r - 32075;
	(n -= 12) < 0 && (n += 24);
	const l = o + (n * Fe.SECONDS_PER_HOUR + i * Fe.SECONDS_PER_MINUTE + a * Fe.SECONDS_PER_MILLISECOND);
	return l >= 43200 && (c -= 1), [c, l];
}
const Ve = /^(\d{4})$/, He = /^(\d{4})-(\d{2})$/, Ye = /^(\d{4})-?(\d{3})$/, Xe = /^(\d{4})-?W(\d{2})-?(\d{1})?$/, $e = /^(\d{4})-?(\d{2})-?(\d{2})$/, Ke = /([Z+\-])?(\d{2})?:?(\d{2})?$/, Ze = /^(\d{2})(\.\d+)?/.source + Ke.source, Qe = /^(\d{2}):?(\d{2})(\.\d+)?/.source + Ke.source, Je = /^(\d{2}):?(\d{2}):?(\d{2})(\.\d+)?/.source + Ke.source, et = "Invalid ISO 8601 date.";
var tt = class e {
	constructor(e, t, r) {
		this.dayNumber = void 0, this.secondsOfDay = void 0, t = t ?? 0, r = r ?? De.UTC;
		const n = 0 | (e = e ?? 0);
		We(n, t += (e - n) * Fe.SECONDS_PER_DAY, this), r === De.UTC && qe(this);
	}
	static fromGregorianDate(t, r) {
		if (!(t instanceof Me)) throw new v("date must be a valid GregorianDate.");
		const n = ke(t.year, t.month, t.day, t.hour, t.minute, t.second, t.millisecond);
		return N(r) ? (We(n[0], n[1], r), qe(r), r) : new e(n[0], n[1], De.UTC);
	}
	static fromDate(t, r) {
		if (!(t instanceof Date) || isNaN(t.getTime())) throw new v("date must be a valid JavaScript Date.");
		const n = ke(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds(), t.getUTCMilliseconds());
		return N(r) ? (We(n[0], n[1], r), qe(r), r) : new e(n[0], n[1], De.UTC);
	}
	static fromIso8601(t, r) {
		if ("string" != typeof t) throw new v(et);
		let n, i = (t = t.replace(",", ".")).split("T"), o = 1, a = 1, s = 0, u = 0, c = 0, l = 0;
		const f = i[0], h = i[1];
		let p, m, d, y;
		if (!N(f)) throw new v(et);
		if (i = f.match($e), null !== i) {
			if (d = f.split("-").length - 1, d > 0 && 2 !== d) throw new v(et);
			n = +i[1], o = +i[2], a = +i[3];
		} else if (i = f.match(He), null !== i) n = +i[1], o = +i[2];
		else if (i = f.match(Ve), null !== i) n = +i[1];
		else {
			let e;
			if (i = f.match(Ye), null !== i) {
				if (n = +i[1], e = +i[2], m = ve(n), e < 1 || m && e > 366 || !m && e > 365) throw new v(et);
			} else {
				if (i = f.match(Xe), null === i) throw new v(et);
				{
					n = +i[1];
					const t = +i[2], r = +i[3] || 0;
					if (d = f.split("-").length - 1, d > 0 && (!N(i[3]) && 1 !== d || N(i[3]) && 2 !== d)) throw new v(et);
					e = 7 * t + r - new Date(Date.UTC(n, 0, 4)).getUTCDay() - 3;
				}
			}
			p = new Date(Date.UTC(n, 0, 1)), p.setUTCDate(e), o = p.getUTCMonth() + 1, a = p.getUTCDate();
		}
		if (m = ve(n), o < 1 || o > 12 || a < 1 || (2 !== o || !m) && a > Be[o - 1] || m && 2 === o && a > 29) throw new v(et);
		if (N(h)) {
			if (i = h.match(Je), null !== i) {
				if (d = h.split(":").length - 1, d > 0 && 2 !== d && 3 !== d) throw new v(et);
				s = +i[1], u = +i[2], c = +i[3], l = 1e3 * +(i[4] || 0), y = 5;
			} else if (i = h.match(Qe), null !== i) {
				if (d = h.split(":").length - 1, d > 2) throw new v(et);
				s = +i[1], u = +i[2], c = 60 * +(i[3] || 0), y = 4;
			} else {
				if (i = h.match(Ze), null === i) throw new v(et);
				s = +i[1], u = 60 * +(i[2] || 0), y = 3;
			}
			if (u >= 60 || c >= 61 || s > 24 || 24 === s && (u > 0 || c > 0 || l > 0)) throw new v(et);
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
		for (p = m && 2 === o ? 29 : Be[o - 1]; a > p;) a -= p, o++, o > 12 && (o -= 12, n++), p = m && 2 === o ? 29 : Be[o - 1];
		for (; u < 0;) u += 60, s--;
		for (; s < 0;) s += 24, a--;
		for (; a < 1;) o--, o < 1 && (o += 12, n--), p = m && 2 === o ? 29 : Be[o - 1], a += p;
		const g = ke(n, o, a, s, u, c, l);
		return N(r) ? (We(g[0], g[1], r), qe(r)) : r = new e(g[0], g[1], De.UTC), _ && e.addSeconds(r, 1, r), r;
	}
	static now(t) {
		return e.fromDate(/* @__PURE__ */ new Date(), t);
	}
	static toGregorianDate(t, r) {
		if (!N(t)) throw new v("julianDate is required.");
		let n = !1, i = Ge(t, rt);
		N(i) || (e.addSeconds(t, -1, rt), i = Ge(rt, rt), n = !0);
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
		let m = a / Fe.SECONDS_PER_HOUR | 0, d = a - m * Fe.SECONDS_PER_HOUR;
		const y = d / Fe.SECONDS_PER_MINUTE | 0;
		d -= y * Fe.SECONDS_PER_MINUTE;
		let _ = 0 | d;
		const g = (d - _) / Fe.SECONDS_PER_MILLISECOND;
		return m += 12, m > 23 && (m -= 24), n && (_ += 1), N(r) ? (r.year = p, r.month = h, r.day = f, r.hour = m, r.minute = y, r.second = _, r.millisecond = g, r.isLeapSecond = n, r) : new Me(p, h, f, m, y, _, g, n);
	}
	static toDate(t) {
		if (!N(t)) throw new v("julianDate is required.");
		const r = e.toGregorianDate(t, ze);
		let n = r.second;
		return r.isLeapSecond && (n -= 1), new Date(Date.UTC(r.year, r.month - 1, r.day, r.hour, r.minute, n, r.millisecond));
	}
	static toIso8601(t, r) {
		if (!N(t)) throw new v("julianDate is required.");
		const n = e.toGregorianDate(t, ze);
		let i = n.year, o = n.month, a = n.day, s = n.hour;
		const u = n.minute, c = n.second, l = n.millisecond;
		let f;
		if (1e4 === i && 1 === o && 1 === a && 0 === s && 0 === u && 0 === c && 0 === l && (i = 9999, o = 12, a = 31, s = 24), !N(r) && 0 !== l) {
			const e = .01 * l;
			return f = e < 1e-6 ? e.toFixed(20).replace(".", "").replace(/0+$/, "") : e.toString().replace(".", ""), `${i.toString().padStart(4, "0")}-${o.toString().padStart(2, "0")}-${a.toString().padStart(2, "0")}T${s.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${f}Z`;
		}
		return N(r) && 0 !== r ? (f = (.01 * l).toFixed(r).replace(".", "").slice(0, r), `${i.toString().padStart(4, "0")}-${o.toString().padStart(2, "0")}-${a.toString().padStart(2, "0")}T${s.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}.${f}Z`) : `${i.toString().padStart(4, "0")}-${o.toString().padStart(2, "0")}-${a.toString().padStart(2, "0")}T${s.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}:${c.toString().padStart(2, "0")}Z`;
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r.dayNumber = t.dayNumber, r.secondsOfDay = t.secondsOfDay, r) : new e(t.dayNumber, t.secondsOfDay, De.TAI);
	}
	static compare(e, t) {
		if (!N(e)) throw new v("left is required.");
		if (!N(t)) throw new v("right is required.");
		const r = e.dayNumber - t.dayNumber;
		return 0 !== r ? r : e.secondsOfDay - t.secondsOfDay;
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && e.dayNumber === t.dayNumber && e.secondsOfDay === t.secondsOfDay;
	}
	static equalsEpsilon(t, r, n) {
		return n = n ?? 0, t === r || N(t) && N(r) && Math.abs(e.secondsDifference(t, r)) <= n;
	}
	static totalDays(e) {
		if (!N(e)) throw new v("julianDate is required.");
		return e.dayNumber + e.secondsOfDay / Fe.SECONDS_PER_DAY;
	}
	static secondsDifference(e, t) {
		if (!N(e)) throw new v("left is required.");
		if (!N(t)) throw new v("right is required.");
		return (e.dayNumber - t.dayNumber) * Fe.SECONDS_PER_DAY + (e.secondsOfDay - t.secondsOfDay);
	}
	static daysDifference(e, t) {
		if (!N(e)) throw new v("left is required.");
		if (!N(t)) throw new v("right is required.");
		return e.dayNumber - t.dayNumber + (e.secondsOfDay - t.secondsOfDay) / Fe.SECONDS_PER_DAY;
	}
	static computeTaiMinusUtc(t) {
		je.julianDate = t;
		const r = e.leapSeconds;
		let n = Ce(r, je, Ue);
		return n < 0 && (n = ~n, --n, n < 0 && (n = 0)), r[n].offset;
	}
	static addSeconds(e, t, r) {
		if (!N(e)) throw new v("julianDate is required.");
		if (!N(t)) throw new v("seconds is required.");
		if (!N(r)) throw new v("result is required.");
		return We(e.dayNumber, e.secondsOfDay + t, r);
	}
	static addMinutes(e, t, r) {
		if (!N(e)) throw new v("julianDate is required.");
		if (!N(t)) throw new v("minutes is required.");
		if (!N(r)) throw new v("result is required.");
		const n = e.secondsOfDay + t * Fe.SECONDS_PER_MINUTE;
		return We(e.dayNumber, n, r);
	}
	static addHours(e, t, r) {
		if (!N(e)) throw new v("julianDate is required.");
		if (!N(t)) throw new v("hours is required.");
		if (!N(r)) throw new v("result is required.");
		const n = e.secondsOfDay + t * Fe.SECONDS_PER_HOUR;
		return We(e.dayNumber, n, r);
	}
	static addDays(e, t, r) {
		if (!N(e)) throw new v("julianDate is required.");
		if (!N(t)) throw new v("days is required.");
		if (!N(r)) throw new v("result is required.");
		return We(e.dayNumber + t, e.secondsOfDay, r);
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
const rt = new tt(0, 0, De.TAI);
tt.leapSeconds = [
	new Le(new tt(2441317, 43210, De.TAI), 10),
	new Le(new tt(2441499, 43211, De.TAI), 11),
	new Le(new tt(2441683, 43212, De.TAI), 12),
	new Le(new tt(2442048, 43213, De.TAI), 13),
	new Le(new tt(2442413, 43214, De.TAI), 14),
	new Le(new tt(2442778, 43215, De.TAI), 15),
	new Le(new tt(2443144, 43216, De.TAI), 16),
	new Le(new tt(2443509, 43217, De.TAI), 17),
	new Le(new tt(2443874, 43218, De.TAI), 18),
	new Le(new tt(2444239, 43219, De.TAI), 19),
	new Le(new tt(2444786, 43220, De.TAI), 20),
	new Le(new tt(2445151, 43221, De.TAI), 21),
	new Le(new tt(2445516, 43222, De.TAI), 22),
	new Le(new tt(2446247, 43223, De.TAI), 23),
	new Le(new tt(2447161, 43224, De.TAI), 24),
	new Le(new tt(2447892, 43225, De.TAI), 25),
	new Le(new tt(2448257, 43226, De.TAI), 26),
	new Le(new tt(2448804, 43227, De.TAI), 27),
	new Le(new tt(2449169, 43228, De.TAI), 28),
	new Le(new tt(2449534, 43229, De.TAI), 29),
	new Le(new tt(2450083, 43230, De.TAI), 30),
	new Le(new tt(2450630, 43231, De.TAI), 31),
	new Le(new tt(2451179, 43232, De.TAI), 32),
	new Le(new tt(2453736, 43233, De.TAI), 33),
	new Le(new tt(2454832, 43234, De.TAI), 34),
	new Le(new tt(2456109, 43235, De.TAI), 35),
	new Le(new tt(2457204, 43236, De.TAI), 36),
	new Le(new tt(2457754, 43237, De.TAI), 37)
];
var nt = a((e, t) => {
	/*! https://mths.be/punycode v1.4.0 by @mathias */
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
		function T(e) {
			return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : c;
		}
		function O(e, t) {
			return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
		}
		function w(e, t, r) {
			var n = 0;
			for (e = r ? m(e / 700) : e >> 1, e += m(e / t); e > 455; n += c) e = m(e / 35);
			return m(n + 36 * e / (e + 38));
		}
		function A(e) {
			var t, r, n, i, o, a, s, l, f, h = [], p = e.length, d = 0, _ = 128, g = 72, E = e.lastIndexOf("-");
			for (E < 0 && (E = 0), r = 0; r < E; ++r) e.charCodeAt(r) >= 128 && y("not-basic"), h.push(e.charCodeAt(r));
			for (n = E > 0 ? E + 1 : 0; n < p;) {
				for (i = d, o = 1, a = c; n >= p && y("invalid-input"), ((s = T(e.charCodeAt(n++))) >= c || s > m((u - d) / o)) && y("overflow"), d += s * o, !(s < (l = a <= g ? 1 : a >= g + 26 ? 26 : a - g)); a += c) o > m(u / (f = c - l)) && y("overflow"), o *= f;
				g = w(d - i, t = h.length + 1, 0 == i), m(d / t) > u - _ && y("overflow"), _ += m(d / t), d %= t, h.splice(d++, 0, _);
			}
			return b(h);
		}
		function x(e) {
			var t, r, n, i, o, a, s, l, f, h, p, _, g, b, T, A = [];
			for (_ = (e = E(e)).length, t = 128, r = 0, o = 72, a = 0; a < _; ++a) (p = e[a]) < 128 && A.push(d(p));
			for (n = i = A.length, i && A.push("-"); n < _;) {
				for (s = u, a = 0; a < _; ++a) (p = e[a]) >= t && p < s && (s = p);
				for (s - t > m((u - r) / (g = n + 1)) && y("overflow"), r += (s - t) * g, t = s, a = 0; a < _; ++a) if ((p = e[a]) < t && ++r > u && y("overflow"), p == t) {
					for (l = r, f = c; !(l < (h = f <= o ? 1 : f >= o + 26 ? 26 : f - o)); f += c) T = l - h, b = c - h, A.push(d(O(h + T % b, 0))), l = m(T / b);
					A.push(d(O(l, 0))), o = w(r, g, n == i), r = 0, ++n;
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
}), it = a((e, t) => {
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
}), ot = a((e, t) => {
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
}), at = a((e, t) => {
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
		function T(e) {
			return function(t, r) {
				return void 0 === t ? this._parts[e] || "" : (this._parts[e] = t || null, this.build(!r), this);
			};
		}
		function O(e, t) {
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
		}, a.protocol = T("protocol"), a.username = T("username"), a.password = T("password"), a.hostname = T("hostname"), a.port = T("port"), a.query = O("query", "?"), a.fragment = O("fragment", "#"), a.search = function(e, t) {
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
		var w = a.protocol, A = a.port, x = a.hostname;
		a.protocol = function(e, t) {
			if (e && !(e = e.replace(/:(\/\/)?$/, "")).match(o.protocol_expression)) throw new TypeError("Protocol \"" + e + "\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");
			return w.call(this, e, t);
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
	"object" == typeof t && t.exports ? t.exports = n(nt(), it(), ot()) : "function" == typeof define && define.amd ? define([
		"./punycode",
		"./IPv6",
		"./SecondLevelDomains"
	], n) : r.URI = n(r.punycode, r.IPv6, r.SecondLevelDomains, r);
});
function st(e, t) {
	if (null === e || "object" != typeof e) return e;
	t = t ?? !1;
	const r = new e.constructor();
	for (const n in e) if (e.hasOwnProperty(n)) {
		let i = e[n];
		t && (i = st(i, t)), r[n] = i;
	}
	return r;
}
function ut(e, t, r) {
	r = r ?? !1;
	const n = {}, i = N(e), o = N(t);
	let a, s, u;
	if (i) for (a in e) e.hasOwnProperty(a) && (s = e[a], o && r && "object" == typeof s && t.hasOwnProperty(a) ? (u = t[a], n[a] = "object" == typeof u ? ut(s, u, r) : s) : n[a] = s);
	if (o) for (a in t) t.hasOwnProperty(a) && !n.hasOwnProperty(a) && (u = t[a], n[a] = u);
	return n;
}
function ct() {
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
var lt = s(at(), 1);
function ft(e, t) {
	let r;
	return "undefined" != typeof document && (r = document), ft._implementation(e, t, r);
}
ft._implementation = function(e, t, r) {
	if (!N(e)) throw new v("relative uri is required.");
	if (!N(t)) {
		if (void 0 === r) return e;
		t = r.baseURI ?? r.location.href;
	}
	const n = new lt.default(e);
	return "" !== n.scheme() ? n.toString() : n.absoluteTo(t).toString();
};
const ht = {};
function pt(e, t, r) {
	N(t) || (t = e.width), N(r) || (r = e.height);
	let n = ht[t];
	N(n) || (n = {}, ht[t] = n);
	let i = n[r];
	if (!N(i)) {
		const e = document.createElement("canvas");
		e.width = t, e.height = r, i = e.getContext("2d", { willReadFrequently: !0 }), i.globalCompositeOperation = "copy", n[r] = i;
	}
	return i.drawImage(e, 0, 0, t, r), i.getImageData(0, 0, t, r).data;
}
const mt = /^blob:/i;
function dt(e) {
	return P.typeOf.string("uri", e), mt.test(e);
}
let yt;
function _t(e) {
	N(yt) || (yt = document.createElement("a")), yt.href = window.location.href;
	const t = yt.host, r = yt.protocol;
	return yt.href = e, yt.href = yt.href, r !== yt.protocol || t !== yt.host;
}
const gt = /^data:/i;
function Et(e) {
	return P.typeOf.string("uri", e), gt.test(e);
}
const bt = {
	UNISSUED: 0,
	ISSUED: 1,
	ACTIVE: 2,
	RECEIVED: 3,
	CANCELLED: 4,
	FAILED: 5
};
Object.freeze(bt);
const Tt = {
	TERRAIN: 0,
	IMAGERY: 1,
	TILES3D: 2,
	OTHER: 3
};
function Ot(e) {
	const t = (e = e ?? C.EMPTY_OBJECT).throttleByServer ?? !1, r = e.throttle ?? !1;
	this.url = e.url, this.requestFunction = e.requestFunction, this.cancelFunction = e.cancelFunction, this.priorityFunction = e.priorityFunction, this.priority = e.priority ?? 0, this.throttle = r, this.throttleByServer = t, this.type = e.type ?? Tt.OTHER, this.serverKey = e.serverKey, this.state = bt.UNISSUED, this.deferred = void 0, this.cancelled = !1;
}
function wt(e, t, r) {
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
function At(e) {
	P.typeOf.object("options", e), P.defined("options.comparator", e.comparator), this._comparator = e.comparator, this._array = [], this._length = 0, this._maximumLength = void 0;
}
function xt(e, t, r) {
	const n = e[t];
	e[t] = e[r], e[r] = n;
}
function Rt(e) {
	let t;
	this.name = "RuntimeError", this.message = e;
	try {
		throw new Error();
	} catch (e) {
		t = e.stack;
	}
	this.stack = t;
}
Object.freeze(Tt), Ot.prototype.cancel = function() {
	this.cancelled = !0;
}, Ot.prototype.clone = function(e) {
	return N(e) ? (e.url = this.url, e.requestFunction = this.requestFunction, e.cancelFunction = this.cancelFunction, e.priorityFunction = this.priorityFunction, e.priority = this.priority, e.throttle = this.throttle, e.throttleByServer = this.throttleByServer, e.type = this.type, e.serverKey = this.serverKey, e.state = bt.UNISSUED, e.deferred = void 0, e.cancelled = !1, e) : new Ot(this);
}, wt.prototype.toString = function() {
	let e = "Request has failed.";
	return N(this.statusCode) && (e += ` Status Code: ${this.statusCode}`), e;
}, Object.defineProperties(At.prototype, {
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
			P.typeOf.number.greaterThanOrEquals("maximumLength", e, 0);
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
}), At.prototype.reserve = function(e) {
	e = e ?? this._length, this._array.length = e;
}, At.prototype.heapify = function(e) {
	e = e ?? 0;
	const t = this._length, r = this._comparator, n = this._array;
	let i = -1, o = !0;
	for (; o;) {
		const a = 2 * (e + 1), s = a - 1;
		i = s < t && r(n[s], n[e]) < 0 ? s : e, a < t && r(n[a], n[i]) < 0 && (i = a), i !== e ? (xt(n, i, e), e = i) : o = !1;
	}
}, At.prototype.resort = function() {
	const e = this._length;
	for (let t = Math.ceil(e / 2); t >= 0; --t) this.heapify(t);
}, At.prototype.insert = function(e) {
	P.defined("element", e);
	const t = this._array, r = this._comparator, n = this._maximumLength;
	let i, o = this._length++;
	for (o < t.length ? t[o] = e : t.push(e); 0 !== o;) {
		const e = Math.floor((o - 1) / 2);
		if (!(r(t[o], t[e]) < 0)) break;
		xt(t, o, e), o = e;
	}
	return N(n) && this._length > n && (i = t[n], this._length = n), i;
}, At.prototype.pop = function(e) {
	if (e = e ?? 0, 0 === this._length) return;
	P.typeOf.number.lessThan("index", e, this._length);
	const t = this._array, r = t[e];
	return xt(t, e, --this._length), this.heapify(e), t[this._length] = void 0, r;
}, N(Object.create) && (Rt.prototype = Object.create(Error.prototype), Rt.prototype.constructor = Rt), Rt.prototype.toString = function() {
	let e = `${this.name}: ${this.message}`;
	return N(this.stack) && (e += `\n${this.stack.toString()}`), e;
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
let It = 20;
const Ct = new At({ comparator: function(e, t) {
	return e.priority - t.priority;
} });
Ct.maximumLength = It, Ct.reserve(It);
const Nt = [];
let vt = {};
const Pt = "undefined" != typeof document ? new lt.default(document.location.href) : new lt.default(), Mt = new L();
function Lt() {}
function Ft(e) {
	N(e.priorityFunction) && (e.priority = e.priorityFunction());
}
function Dt(e) {
	return e.state === bt.UNISSUED && (e.state = bt.ISSUED, e.deferred = ct()), e.deferred.promise;
}
function zt(e) {
	const t = Dt(e);
	return e.state = bt.ACTIVE, Nt.push(e), ++St.numberOfActiveRequests, ++St.numberOfActiveRequestsEver, ++vt[e.serverKey], e.requestFunction().then(function(e) {
		return function(t) {
			if (e.state === bt.CANCELLED) return;
			const r = e.deferred;
			--St.numberOfActiveRequests, --vt[e.serverKey], Mt.raiseEvent(), e.state = bt.RECEIVED, e.deferred = void 0, r.resolve(t);
		};
	}(e)).catch(function(e) {
		return function(t) {
			e.state !== bt.CANCELLED && (++St.numberOfFailedRequests, --St.numberOfActiveRequests, --vt[e.serverKey], Mt.raiseEvent(t), e.state = bt.FAILED, e.deferred.reject(t));
		};
	}(e)), t;
}
function Bt(e) {
	const t = e.state === bt.ACTIVE;
	if (e.state = bt.CANCELLED, ++St.numberOfCancelledRequests, N(e.deferred)) {
		const t = e.deferred;
		t.promise.catch(() => {}), e.deferred = void 0, t.reject(new Rt(`Request cancelled: "${e.url}"`));
	}
	t && (--St.numberOfActiveRequests, --vt[e.serverKey], ++St.numberOfCancelledActiveRequests), N(e.cancelFunction) && e.cancelFunction();
}
Lt.maximumRequests = 50, Lt.maximumRequestsPerServer = 18, Lt.requestsByServer = {}, Lt.throttleRequests = !0, Lt.debugShowStatistics = !1, Lt.requestCompletedEvent = Mt, Object.defineProperties(Lt, {
	statistics: { get: function() {
		return St;
	} },
	priorityHeapLength: {
		get: function() {
			return It;
		},
		set: function(e) {
			if (e < It) for (; Ct.length > e;) Bt(Ct.pop());
			It = e, Ct.maximumLength = e, Ct.reserve(e);
		}
	}
}), Lt.serverHasOpenSlots = function(e, t) {
	t = t ?? 1;
	const r = Lt.requestsByServer[e] ?? Lt.maximumRequestsPerServer;
	return vt[e] + t <= r;
}, Lt.heapHasOpenSlots = function(e) {
	return Ct.length + e <= It;
}, Lt.update = function() {
	let e, t, r = 0;
	const n = Nt.length;
	for (e = 0; e < n; ++e) t = Nt[e], t.cancelled && Bt(t), t.state === bt.ACTIVE ? r > 0 && (Nt[e - r] = t) : ++r;
	Nt.length -= r;
	const i = Ct.internalArray, o = Ct.length;
	for (e = 0; e < o; ++e) Ft(i[e]);
	Ct.resort();
	const a = Math.max(Lt.maximumRequests - Nt.length, 0);
	let s = 0;
	for (; s < a && Ct.length > 0;) t = Ct.pop(), t.cancelled ? Bt(t) : !t.throttleByServer || Lt.serverHasOpenSlots(t.serverKey) ? (zt(t), ++s) : Bt(t);
	Lt.debugShowStatistics && (0 === St.numberOfActiveRequests && St.lastNumberOfActiveRequests > 0 && (St.numberOfAttemptedRequests > 0 && (console.log(`Number of attempted requests: ${St.numberOfAttemptedRequests}`), St.numberOfAttemptedRequests = 0), St.numberOfCancelledRequests > 0 && (console.log(`Number of cancelled requests: ${St.numberOfCancelledRequests}`), St.numberOfCancelledRequests = 0), St.numberOfCancelledActiveRequests > 0 && (console.log(`Number of cancelled active requests: ${St.numberOfCancelledActiveRequests}`), St.numberOfCancelledActiveRequests = 0), St.numberOfFailedRequests > 0 && (console.log(`Number of failed requests: ${St.numberOfFailedRequests}`), St.numberOfFailedRequests = 0)), St.lastNumberOfActiveRequests = St.numberOfActiveRequests);
}, Lt.getServerKey = function(e) {
	P.typeOf.string("url", e);
	let t = new lt.default(e);
	"" === t.scheme() && (t = t.absoluteTo(Pt), t.normalize());
	let r = t.authority();
	return /:/.test(r) || (r = `${r}:${"https" === t.scheme() ? "443" : "80"}`), N(vt[r]) || (vt[r] = 0), r;
}, Lt.request = function(e) {
	if (P.typeOf.object("request", e), P.typeOf.string("request.url", e.url), P.typeOf.func("request.requestFunction", e.requestFunction), Et(e.url) || dt(e.url)) return Mt.raiseEvent(), e.state = bt.RECEIVED, e.requestFunction();
	if (++St.numberOfAttemptedRequests, N(e.serverKey) || (e.serverKey = Lt.getServerKey(e.url)), Lt.throttleRequests && e.throttleByServer && !Lt.serverHasOpenSlots(e.serverKey)) return;
	if (!Lt.throttleRequests || !e.throttle) return zt(e);
	if (Nt.length >= Lt.maximumRequests) return;
	Ft(e);
	const t = Ct.insert(e);
	if (N(t)) {
		if (t === e) return;
		Bt(t);
	}
	return Dt(e);
}, Lt.clearForSpecs = function() {
	for (; Ct.length > 0;) Bt(Ct.pop());
	const e = Nt.length;
	for (let t = 0; t < e; ++t) Bt(Nt[t]);
	Nt.length = 0, vt = {}, St.numberOfAttemptedRequests = 0, St.numberOfActiveRequests = 0, St.numberOfCancelledRequests = 0, St.numberOfCancelledActiveRequests = 0, St.numberOfFailedRequests = 0, St.numberOfActiveRequestsEver = 0, St.lastNumberOfActiveRequests = 0;
}, Lt.numberOfActiveRequestsByServer = function(e) {
	return vt[e];
}, Lt.requestHeap = Ct;
const Ut = {};
let jt = {};
Ut.add = function(e, t) {
	if (!N(e)) throw new v("host is required.");
	if (!N(t) || t <= 0) throw new v("port is required to be greater than 0.");
	const r = `${e.toLowerCase()}:${t}`;
	N(jt[r]) || (jt[r] = !0);
}, Ut.remove = function(e, t) {
	if (!N(e)) throw new v("host is required.");
	if (!N(t) || t <= 0) throw new v("port is required to be greater than 0.");
	const r = `${e.toLowerCase()}:${t}`;
	N(jt[r]) && delete jt[r];
}, Ut.contains = function(e) {
	if (!N(e)) throw new v("url is required.");
	const t = function(e) {
		const t = new lt.default(e);
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
	return !(!N(t) || !N(jt[t]));
}, Ut.clear = function() {
	jt = {};
};
const qt = function() {
	try {
		const e = new XMLHttpRequest();
		return e.open("GET", "#", !0), e.responseType = "blob", "blob" === e.responseType;
	} catch (e) {
		return !1;
	}
}();
function Gt(e) {
	"string" == typeof (e = e ?? C.EMPTY_OBJECT) && (e = { url: e }), P.typeOf.string("options.url", e.url), this._url = void 0, this._templateValues = Wt(e.templateValues, {}), this._queryParameters = Wt(e.queryParameters, {}), this.headers = Wt(e.headers, {}), this.request = e.request ?? new Ot(), this.proxy = e.proxy, this.retryCallback = e.retryCallback, this.retryAttempts = e.retryAttempts ?? 0, this._retryCount = 0, e.parseUrl ?? 1 ? this.parseUrl(e.url, !0, !0) : this._url = e.url, this._credits = e.credits;
}
function Wt(e, t) {
	return N(e) ? st(e) : t;
}
let kt;
function Vt(e, t, r) {
	if (!r) return ut(e, t);
	const n = st(e, !0);
	for (const i in t) if (t.hasOwnProperty(i)) {
		let e = n[i];
		const r = t[i];
		N(e) ? (Array.isArray(e) || (e = n[i] = [e]), n[i] = e.concat(r)) : n[i] = Array.isArray(r) ? r.slice() : r;
	}
	return n;
}
function Ht(e, t, r) {
	const n = {};
	n[t] = r, e.setQueryParameters(n);
	const i = e.request, o = e.url;
	i.url = o, i.requestFunction = function() {
		const e = ct();
		return window[r] = function(t) {
			e.resolve(t);
			try {
				delete window[r];
			} catch (e) {
				window[r] = void 0;
			}
		}, Gt._Implementations.loadAndExecuteScript(o, r, e), e.promise;
	};
	const a = Lt.request(i);
	if (N(a)) return a.catch(function(n) {
		return i.state !== bt.FAILED ? Promise.reject(n) : e.retryOnError(n).then(function(o) {
			return o ? (i.state = bt.UNISSUED, i.deferred = void 0, Ht(e, t, r)) : Promise.reject(n);
		});
	});
}
function Yt(e) {
	if (e.state === bt.ISSUED || e.state === bt.ACTIVE) throw new Rt("The Resource is already being fetched.");
	e.state = bt.UNISSUED, e.deferred = void 0;
}
Gt.createIfNeeded = function(e) {
	return e instanceof Gt ? e.getDerivedResource({ request: e.request }) : "string" != typeof e ? e : new Gt({ url: e });
}, Gt.supportsImageBitmapOptions = function() {
	return N(kt) ? kt : "function" != typeof createImageBitmap ? (kt = Promise.resolve(!1), kt) : (kt = Gt.fetchBlob({ url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAABGdBTUEAAE4g3rEiDgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAADElEQVQI12Ng6GAAAAEUAIngE3ZiAAAAAElFTkSuQmCC" }).then(function(e) {
		return Promise.all([createImageBitmap(e, {
			imageOrientation: "flipY",
			premultiplyAlpha: "none",
			colorSpaceConversion: "none"
		}), createImageBitmap(e)]);
	}).then(function(e) {
		const t = pt(e[0]), r = pt(e[1]);
		return t[1] !== r[1];
	}).catch(function() {
		return !1;
	}), kt);
}, Object.defineProperties(Gt, { isBlobSupported: { get: function() {
	return qt;
} } }), Object.defineProperties(Gt.prototype, {
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
			if (!N(e)) throw new v("uri is required.");
			const t = new lt.default(e);
			t.normalize();
			let r = t.path(), n = r.lastIndexOf("/");
			return -1 !== n && (r = r.substr(n + 1)), n = r.lastIndexOf("."), r = -1 === n ? "" : r.substr(n + 1), r;
		}(this._url);
	} },
	isDataUri: { get: function() {
		return Et(this._url);
	} },
	isBlobUri: { get: function() {
		return dt(this._url);
	} },
	isCrossOriginUrl: { get: function() {
		return _t(this._url);
	} },
	hasHeaders: { get: function() {
		return Object.keys(this.headers).length > 0;
	} },
	credits: { get: function() {
		return this._credits;
	} }
}), Gt.prototype.toString = function() {
	return this.getUrlComponent(!0, !0);
}, Gt.prototype.parseUrl = function(e, t, r, n) {
	let i = new lt.default(e);
	const o = 0 === (a = i.query()).length ? {} : -1 === a.indexOf("=") ? { [a]: void 0 } : function(e) {
		if (!N(e)) throw new v("queryString is required.");
		const t = {};
		if ("" === e) return t;
		const r = e.replace(/\+/g, "%20").split(/[&;]/);
		for (let n = 0, i = r.length; n < i; ++n) {
			const e = r[n].split("="), i = decodeURIComponent(e[0]);
			let o = e[1];
			o = N(o) ? decodeURIComponent(o) : "";
			const a = t[i];
			"string" == typeof a ? t[i] = [a, o] : Array.isArray(a) ? a.push(o) : t[i] = o;
		}
		return t;
	}(a);
	var a;
	this._queryParameters = t ? Vt(o, this.queryParameters, r) : o, i.search(""), i.fragment(""), N(n) && "" === i.scheme() && (i = i.absoluteTo(ft(n))), this._url = i.toString();
}, Gt.prototype.getUrlComponent = function(e, t) {
	if (this.isDataUri) return this._url;
	let r = this._url;
	e && (r = `${r}${function(e) {
		const t = Object.keys(e);
		return 0 === t.length ? "" : 1 !== t.length || N(e[t[0]]) ? `?${function(e) {
			if (!N(e)) throw new v("obj is required.");
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
		return N(r) ? encodeURIComponent(r) : e;
	})), t && N(this.proxy) && (r = this.proxy.getURL(r)), r;
}, Gt.prototype.setQueryParameters = function(e, t) {
	this._queryParameters = t ? Vt(this._queryParameters, e, !1) : Vt(e, this._queryParameters, !1);
}, Gt.prototype.appendQueryParameters = function(e) {
	this._queryParameters = Vt(e, this._queryParameters, !0);
}, Gt.prototype.setTemplateValues = function(e, t) {
	this._templateValues = t ? ut(this._templateValues, e) : ut(e, this._templateValues);
}, Gt.prototype.getDerivedResource = function(e) {
	const t = this.clone();
	if (t._retryCount = 0, N(e.url)) {
		const r = e.preserveQueryParameters ?? !1;
		t.parseUrl(e.url, !0, r, this._url);
	}
	return N(e.queryParameters) && (t._queryParameters = ut(e.queryParameters, t.queryParameters)), N(e.templateValues) && (t._templateValues = ut(e.templateValues, t.templateValues)), N(e.headers) && (t.headers = ut(e.headers, t.headers)), N(e.proxy) && (t.proxy = e.proxy), N(e.request) && (t.request = e.request), N(e.retryCallback) && (t.retryCallback = e.retryCallback), N(e.retryAttempts) && (t.retryAttempts = e.retryAttempts), t;
}, Gt.prototype.retryOnError = function(e) {
	const t = this.retryCallback;
	if ("function" != typeof t || this._retryCount >= this.retryAttempts) return Promise.resolve(!1);
	const r = this;
	return Promise.resolve(t(this, e)).then(function(e) {
		return ++r._retryCount, e;
	});
}, Gt.prototype.clone = function(e) {
	return N(e) ? (e._url = this._url, e._queryParameters = st(this._queryParameters), e._templateValues = st(this._templateValues), e.headers = st(this.headers), e.proxy = this.proxy, e.retryCallback = this.retryCallback, e.retryAttempts = this.retryAttempts, e._retryCount = 0, e.request = this.request.clone(), e) : new Gt({
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
}, Gt.prototype.getBaseUri = function(e) {
	return function(e, t) {
		if (!N(e)) throw new v("uri is required.");
		let r = "";
		const n = e.lastIndexOf("/");
		return -1 !== n && (r = e.substring(0, n + 1)), t ? (0 !== (e = new lt.default(e)).query().length && (r += `?${e.query()}`), 0 !== e.fragment().length && (r += `#${e.fragment()}`), r) : r;
	}(this.getUrlComponent(e), e);
}, Gt.prototype.appendForwardSlash = function() {
	var e;
	this._url = (0 !== (e = this._url).length && "/" === e[e.length - 1] || (e = `${e}/`), e);
}, Gt.prototype.fetchArrayBuffer = function() {
	return this.fetch({ responseType: "arraybuffer" });
}, Gt.fetchArrayBuffer = function(e) {
	return new Gt(e).fetchArrayBuffer();
}, Gt.prototype.fetchBlob = function() {
	return this.fetch({ responseType: "blob" });
}, Gt.fetchBlob = function(e) {
	return new Gt(e).fetchBlob();
}, Gt.prototype.fetchImage = function(e) {
	const t = (e = e ?? C.EMPTY_OBJECT).preferImageBitmap ?? !1, r = e.preferBlob ?? !1, n = e.flipY ?? !1, i = e.skipColorSpaceConversion ?? !1;
	if (Yt(this.request), !qt || this.isDataUri || this.isBlobUri || !this.hasHeaders && !r) return this._fetchImage({
		resource: this,
		flipY: n,
		skipColorSpaceConversion: i,
		preferImageBitmap: t
	});
	const o = this.fetchBlob();
	if (!N(o)) return;
	let a, s, u, c;
	return Gt.supportsImageBitmapOptions().then(function(e) {
		return a = e, s = a && t, o;
	}).then(function(e) {
		if (N(e)) return c = e, s ? Gt.createImageBitmapFromBlob(e, {
			flipY: n,
			premultiplyAlpha: !1,
			skipColorSpaceConversion: i
		}) : (u = new Gt({ url: window.URL.createObjectURL(e) }), u._fetchImage({
			flipY: n,
			skipColorSpaceConversion: i,
			preferImageBitmap: !1
		}));
	}).then(function(e) {
		if (N(e)) return e.blob = c, s || window.URL.revokeObjectURL(u.url), e;
	}).catch(function(e) {
		return N(u) && window.URL.revokeObjectURL(u.url), e.blob = c, Promise.reject(e);
	});
}, Gt.prototype._fetchImage = function(e) {
	const t = this, r = e.flipY, n = e.skipColorSpaceConversion, i = e.preferImageBitmap, o = t.request;
	o.url = t.url, o.requestFunction = function() {
		let e = !1;
		t.isDataUri || t.isBlobUri || (e = t.isCrossOriginUrl);
		const a = ct();
		return Gt._Implementations.createImage(o, e, a, r, n, i), a.promise;
	};
	const a = Lt.request(o);
	if (N(a)) return a.catch(function(e) {
		return o.state !== bt.FAILED ? Promise.reject(e) : t.retryOnError(e).then(function(a) {
			return a ? (o.state = bt.UNISSUED, o.deferred = void 0, t._fetchImage({
				flipY: r,
				skipColorSpaceConversion: n,
				preferImageBitmap: i
			})) : Promise.reject(e);
		});
	});
}, Gt.fetchImage = function(e) {
	return new Gt(e).fetchImage({
		flipY: e.flipY,
		skipColorSpaceConversion: e.skipColorSpaceConversion,
		preferBlob: e.preferBlob,
		preferImageBitmap: e.preferImageBitmap
	});
}, Gt.prototype.fetchText = function() {
	return this.fetch({ responseType: "text" });
}, Gt.fetchText = function(e) {
	return new Gt(e).fetchText();
}, Gt.prototype.fetchJson = function() {
	const e = this.fetch({
		responseType: "text",
		headers: { Accept: "application/json,*/*;q=0.01" }
	});
	if (N(e)) return e.then(function(e) {
		if (N(e)) return JSON.parse(e);
	});
}, Gt.fetchJson = function(e) {
	return new Gt(e).fetchJson();
}, Gt.prototype.fetchXML = function() {
	return this.fetch({
		responseType: "document",
		overrideMimeType: "text/xml"
	});
}, Gt.fetchXML = function(e) {
	return new Gt(e).fetchXML();
}, Gt.prototype.fetchJsonp = function(e) {
	let t;
	e = e ?? "callback", Yt(this.request);
	do
		t = `loadJsonp${B.nextRandomNumber().toString().substring(2, 8)}`;
	while (N(window[t]));
	return Ht(this, e, t);
}, Gt.fetchJsonp = function(e) {
	return new Gt(e).fetchJsonp(e.callbackParameterName);
}, Gt.prototype._makeRequest = function(e) {
	const t = this;
	Yt(t.request);
	const r = t.request, n = t.url;
	r.url = n, r.requestFunction = function() {
		const i = e.responseType, o = ut(e.headers, t.headers), a = e.overrideMimeType, s = e.method, u = e.data, c = ct(), l = Gt._Implementations.loadWithXhr(n, i, s, u, o, c, a);
		return N(l) && N(l.abort) && (r.cancelFunction = function() {
			l.abort();
		}), c.promise;
	};
	const i = Lt.request(r);
	if (N(i)) return i.then(function(e) {
		return r.cancelFunction = void 0, e;
	}).catch(function(n) {
		return r.cancelFunction = void 0, r.state !== bt.FAILED ? Promise.reject(n) : t.retryOnError(n).then(function(i) {
			return i ? (r.state = bt.UNISSUED, r.deferred = void 0, t.fetch(e)) : Promise.reject(n);
		});
	});
};
const Xt = /^data:(.*?)(;base64)?,(.*)$/;
function $t(e, t) {
	const r = decodeURIComponent(t);
	return e ? atob(r) : r;
}
function Kt(e, t) {
	const r = $t(e, t), n = new ArrayBuffer(r.length), i = new Uint8Array(n);
	for (let o = 0; o < r.length; o++) i[o] = r.charCodeAt(o);
	return n;
}
Gt.prototype.fetch = function(e) {
	return (e = Wt(e, {})).method = "GET", this._makeRequest(e);
}, Gt.fetch = function(e) {
	return new Gt(e).fetch({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Gt.prototype.delete = function(e) {
	return (e = Wt(e, {})).method = "DELETE", this._makeRequest(e);
}, Gt.delete = function(e) {
	return new Gt(e).delete({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType,
		data: e.data
	});
}, Gt.prototype.head = function(e) {
	return (e = Wt(e, {})).method = "HEAD", this._makeRequest(e);
}, Gt.head = function(e) {
	return new Gt(e).head({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Gt.prototype.options = function(e) {
	return (e = Wt(e, {})).method = "OPTIONS", this._makeRequest(e);
}, Gt.options = function(e) {
	return new Gt(e).options({
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Gt.prototype.post = function(e, t) {
	return P.defined("data", e), (t = Wt(t, {})).method = "POST", t.data = e, this._makeRequest(t);
}, Gt.post = function(e) {
	return new Gt(e).post(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Gt.prototype.put = function(e, t) {
	return P.defined("data", e), (t = Wt(t, {})).method = "PUT", t.data = e, this._makeRequest(t);
}, Gt.put = function(e) {
	return new Gt(e).put(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Gt.prototype.patch = function(e, t) {
	return P.defined("data", e), (t = Wt(t, {})).method = "PATCH", t.data = e, this._makeRequest(t);
}, Gt.patch = function(e) {
	return new Gt(e).patch(e.data, {
		responseType: e.responseType,
		overrideMimeType: e.overrideMimeType
	});
}, Gt._Implementations = {}, Gt._Implementations.loadImageElement = function(e, t, r) {
	const n = new Image();
	n.onload = function() {
		0 === n.naturalWidth && 0 === n.naturalHeight && 0 === n.width && 0 === n.height && (n.width = 300, n.height = 150), r.resolve(n);
	}, n.onerror = function(e) {
		r.reject(e);
	}, t && (Ut.contains(e) ? n.crossOrigin = "use-credentials" : n.crossOrigin = ""), n.src = e;
}, Gt._Implementations.createImage = function(e, t, r, n, i, o, a) {
	const s = e.url;
	Gt.supportsImageBitmapOptions().then(function(u) {
		if (!u || !o) return void Gt._Implementations.loadImageElement(s, t, r);
		const c = ct(), l = Gt._Implementations.loadWithXhr(s, "blob", "GET", void 0, a, c, void 0, void 0, void 0);
		return N(l) && N(l.abort) && (e.cancelFunction = function() {
			l.abort();
		}), c.promise.then(function(e) {
			if (N(e)) return Gt.createImageBitmapFromBlob(e, {
				flipY: n,
				premultiplyAlpha: !1,
				skipColorSpaceConversion: i
			});
			r.reject(new Rt(`Successfully retrieved ${s} but it contained no content.`));
		}).then(function(e) {
			r.resolve(e);
		});
	}).catch(function(e) {
		r.reject(e);
	});
}, Gt.createImageBitmapFromBlob = function(e, t) {
	return P.defined("options", t), P.typeOf.bool("options.flipY", t.flipY), P.typeOf.bool("options.premultiplyAlpha", t.premultiplyAlpha), P.typeOf.bool("options.skipColorSpaceConversion", t.skipColorSpaceConversion), createImageBitmap(e, {
		imageOrientation: t.flipY ? "flipY" : "none",
		premultiplyAlpha: t.premultiplyAlpha ? "premultiply" : "none",
		colorSpaceConversion: t.skipColorSpaceConversion ? "none" : "default"
	});
};
const Zt = "undefined" == typeof XMLHttpRequest;
function Qt(e) {
	e = e ?? C.EMPTY_OBJECT, this._dates = void 0, this._samples = void 0, this._dateColumn = -1, this._xPoleWanderRadiansColumn = -1, this._yPoleWanderRadiansColumn = -1, this._ut1MinusUtcSecondsColumn = -1, this._xCelestialPoleOffsetRadiansColumn = -1, this._yCelestialPoleOffsetRadiansColumn = -1, this._taiMinusUtcSecondsColumn = -1, this._columnCount = 0, this._lastIndex = -1, this._addNewLeapSeconds = e.addNewLeapSeconds ?? !0, N(e.data) ? er(this, e.data) : er(this, {
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
function Jt(e, t) {
	return tt.compare(e.julianDate, t);
}
function er(e, t) {
	if (!N(t.columnNames)) throw new Rt("Error in loaded EOP data: The columnNames property is required.");
	if (!N(t.samples)) throw new Rt("Error in loaded EOP data: The samples property is required.");
	const r = t.columnNames.indexOf("modifiedJulianDateUtc"), n = t.columnNames.indexOf("xPoleWanderRadians"), i = t.columnNames.indexOf("yPoleWanderRadians"), o = t.columnNames.indexOf("ut1MinusUtcSeconds"), a = t.columnNames.indexOf("xCelestialPoleOffsetRadians"), s = t.columnNames.indexOf("yCelestialPoleOffsetRadians"), u = t.columnNames.indexOf("taiMinusUtcSeconds");
	if (r < 0 || n < 0 || i < 0 || o < 0 || a < 0 || s < 0 || u < 0) throw new Rt("Error in loaded EOP data: The columnNames property must include modifiedJulianDateUtc, xPoleWanderRadians, yPoleWanderRadians, ut1MinusUtcSeconds, xCelestialPoleOffsetRadians, yCelestialPoleOffsetRadians, and taiMinusUtcSeconds columns");
	const c = e._samples = t.samples, l = e._dates = [];
	let f;
	e._dateColumn = r, e._xPoleWanderRadiansColumn = n, e._yPoleWanderRadiansColumn = i, e._ut1MinusUtcSecondsColumn = o, e._xCelestialPoleOffsetRadiansColumn = a, e._yCelestialPoleOffsetRadiansColumn = s, e._taiMinusUtcSecondsColumn = u, e._columnCount = t.columnNames.length, e._lastIndex = void 0;
	const h = e._addNewLeapSeconds;
	for (let p = 0, m = c.length; p < m; p += e._columnCount) {
		const e = c[p + r], t = c[p + u], n = new tt(e + Fe.MODIFIED_JULIAN_DATE_DIFFERENCE, t, De.TAI);
		if (l.push(n), h) {
			if (t !== f && N(f)) {
				const e = tt.leapSeconds, r = Ce(e, n, Jt);
				if (r < 0) {
					const i = new Le(n, t);
					e.splice(~r, 0, i);
				}
			}
			f = t;
		}
	}
}
function tr(e, t, r, n, i) {
	const o = r * n;
	i.xPoleWander = t[o + e._xPoleWanderRadiansColumn], i.yPoleWander = t[o + e._yPoleWanderRadiansColumn], i.xPoleOffset = t[o + e._xCelestialPoleOffsetRadiansColumn], i.yPoleOffset = t[o + e._yCelestialPoleOffsetRadiansColumn], i.ut1MinusUtc = t[o + e._ut1MinusUtcSecondsColumn];
}
function rr(e, t, r) {
	return t + e * (r - t);
}
function nr(e, t, r, n, i, o, a) {
	const s = e._columnCount;
	if (o > t.length - 1) return a.xPoleWander = 0, a.yPoleWander = 0, a.xPoleOffset = 0, a.yPoleOffset = 0, a.ut1MinusUtc = 0, a;
	const u = t[i], c = t[o];
	if (u.equals(c) || n.equals(u)) return tr(e, r, i, s, a), a;
	if (n.equals(c)) return tr(e, r, o, s, a), a;
	const l = tt.secondsDifference(n, u) / tt.secondsDifference(c, u), f = i * s, h = o * s;
	let p = r[f + e._ut1MinusUtcSecondsColumn], m = r[h + e._ut1MinusUtcSecondsColumn];
	const d = m - p;
	if (d > .5 || d < -.5) {
		const t = r[f + e._taiMinusUtcSecondsColumn], i = r[h + e._taiMinusUtcSecondsColumn];
		t !== i && (c.equals(n) ? p = m : m -= i - t);
	}
	return a.xPoleWander = rr(l, r[f + e._xPoleWanderRadiansColumn], r[h + e._xPoleWanderRadiansColumn]), a.yPoleWander = rr(l, r[f + e._yPoleWanderRadiansColumn], r[h + e._yPoleWanderRadiansColumn]), a.xPoleOffset = rr(l, r[f + e._xCelestialPoleOffsetRadiansColumn], r[h + e._xCelestialPoleOffsetRadiansColumn]), a.yPoleOffset = rr(l, r[f + e._yCelestialPoleOffsetRadiansColumn], r[h + e._yCelestialPoleOffsetRadiansColumn]), a.ut1MinusUtc = rr(l, p, m), a;
}
function ir(e, t, r) {
	this.heading = e ?? 0, this.pitch = t ?? 0, this.roll = r ?? 0;
}
Gt._Implementations.loadWithXhr = function(e, t, r, n, i, o, a) {
	const s = Xt.exec(e);
	if (null !== s) return void o.resolve(function(e, t) {
		t = t ?? "";
		const r = e[1], n = !!e[2], i = e[3];
		let o, a;
		switch (t) {
			case "":
			case "text": return $t(n, i);
			case "arraybuffer": return Kt(n, i);
			case "blob": return o = Kt(n, i), new Blob([o], { type: r });
			case "document": return a = new DOMParser(), a.parseFromString($t(n, i), r);
			case "json": return JSON.parse($t(n, i));
			default: throw new v(`Unhandled responseType: ${t}`);
		}
	}(s, t));
	if (Zt) return void function(e, t, r, n, i, o) {
		fetch(e, {
			method: r,
			headers: i
		}).then(async (e) => {
			if (!e.ok) {
				const t = {};
				e.headers.forEach((e, r) => {
					t[r] = e;
				}), o.reject(new wt(e.status, e, t));
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
			o.reject(new wt());
		});
	}(e, t, r, 0, i, o);
	const u = new XMLHttpRequest();
	if (Ut.contains(e) && (u.withCredentials = !0), u.open(r, e, !0), N(a) && N(u.overrideMimeType) && u.overrideMimeType(a), N(i)) for (const l in i) i.hasOwnProperty(l) && u.setRequestHeader(l, i[l]);
	N(t) && (u.responseType = t);
	let c = !1;
	return "string" == typeof e && (c = 0 === e.indexOf("file://") || "undefined" != typeof window && "file://" === window.location.origin), u.onload = function() {
		if ((u.status < 200 || u.status >= 300) && (!c || 0 !== u.status)) return void o.reject(new wt(u.status, u.response, u.getAllResponseHeaders()));
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
		else if (!N(e) || N(t) && n !== t) if ("json" === t && "string" == typeof e) try {
			o.resolve(JSON.parse(e));
		} catch (e) {
			o.reject(e);
		}
		else ("" === n || "document" === n) && N(u.responseXML) && u.responseXML.hasChildNodes() ? o.resolve(u.responseXML) : "" !== n && "text" !== n || !N(u.responseText) ? o.reject(new Rt("Invalid XMLHttpRequest response type.")) : o.resolve(u.responseText);
		else o.resolve(e);
	}, u.onerror = function(e) {
		o.reject(new wt());
	}, u.send(n), u;
}, Gt._Implementations.loadAndExecuteScript = function(e, t, r) {
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
}, Gt._DefaultImplementations = {}, Gt._DefaultImplementations.createImage = Gt._Implementations.createImage, Gt._DefaultImplementations.loadWithXhr = Gt._Implementations.loadWithXhr, Gt._DefaultImplementations.loadAndExecuteScript = Gt._Implementations.loadAndExecuteScript, Gt.DEFAULT = Object.freeze(new Gt({ url: "undefined" == typeof document ? "" : document.location.href.split("?")[0] })), Qt.fromUrl = async function(e, t) {
	P.defined("url", e), t = t ?? C.EMPTY_OBJECT;
	const r = Gt.createIfNeeded(e);
	let n;
	try {
		n = await r.fetchJson();
	} catch (e) {
		throw new Rt(`An error occurred while retrieving the EOP data from the URL ${r.url}.`);
	}
	return new Qt({
		addNewLeapSeconds: t.addNewLeapSeconds,
		data: n
	});
}, Qt.NONE = Object.freeze({ compute: function(e, t) {
	return N(t) ? (t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0) : t = new Ne(0, 0, 0, 0, 0), t;
} }), Qt.prototype.compute = function(e, t) {
	if (!N(this._samples)) return;
	if (N(t) || (t = new Ne(0, 0, 0, 0, 0)), 0 === this._samples.length) return t.xPoleWander = 0, t.yPoleWander = 0, t.xPoleOffset = 0, t.yPoleOffset = 0, t.ut1MinusUtc = 0, t;
	const r = this._dates, n = this._lastIndex;
	let i = 0, o = 0;
	if (N(n)) {
		const a = r[n], s = r[n + 1], u = tt.lessThanOrEquals(a, e), c = !N(s), l = c || tt.greaterThanOrEquals(s, e);
		if (u && l) return i = n, !c && s.equals(e) && ++i, o = i + 1, nr(this, r, this._samples, e, i, o, t), t;
	}
	let a = Ce(r, e, tt.compare, this._dateColumn);
	return a >= 0 ? (a < r.length - 1 && r[a + 1].equals(e) && ++a, i = a, o = a) : (o = ~a, i = o - 1, i < 0 && (i = 0)), this._lastIndex = i, nr(this, r, this._samples, e, i, o, t), t;
}, ir.fromQuaternion = function(e, t) {
	if (!N(e)) throw new v("quaternion is required");
	N(t) || (t = new ir());
	const r = 2 * (e.w * e.y - e.z * e.x), n = 1 - 2 * (e.x * e.x + e.y * e.y), i = 2 * (e.w * e.x + e.y * e.z), o = 1 - 2 * (e.y * e.y + e.z * e.z), a = 2 * (e.w * e.z + e.x * e.y);
	return t.heading = -Math.atan2(a, o), t.roll = Math.atan2(i, n), t.pitch = -B.asinClamped(r), t;
}, ir.fromDegrees = function(e, t, r, n) {
	if (!N(e)) throw new v("heading is required");
	if (!N(t)) throw new v("pitch is required");
	if (!N(r)) throw new v("roll is required");
	return N(n) || (n = new ir()), n.heading = e * B.RADIANS_PER_DEGREE, n.pitch = t * B.RADIANS_PER_DEGREE, n.roll = r * B.RADIANS_PER_DEGREE, n;
}, ir.clone = function(e, t) {
	if (N(e)) return N(t) ? (t.heading = e.heading, t.pitch = e.pitch, t.roll = e.roll, t) : new ir(e.heading, e.pitch, e.roll);
}, ir.equals = function(e, t) {
	return e === t || N(e) && N(t) && e.heading === t.heading && e.pitch === t.pitch && e.roll === t.roll;
}, ir.equalsEpsilon = function(e, t, r, n) {
	return e === t || N(e) && N(t) && B.equalsEpsilon(e.heading, t.heading, r, n) && B.equalsEpsilon(e.pitch, t.pitch, r, n) && B.equalsEpsilon(e.roll, t.roll, r, n);
}, ir.prototype.clone = function(e) {
	return ir.clone(this, e);
}, ir.prototype.equals = function(e) {
	return ir.equals(this, e);
}, ir.prototype.equalsEpsilon = function(e, t, r) {
	return ir.equalsEpsilon(this, e, t, r);
}, ir.prototype.toString = function() {
	return `(${this.heading}, ${this.pitch}, ${this.roll})`;
};
const or = /((?:.*\/)|^)Cesium\.js(?:\?|\#|$)/;
let ar, sr, ur;
function cr(e) {
	return "undefined" == typeof document ? e : (N(ar) || (ar = document.createElement("a")), ar.href = e, ar.href);
}
function lr() {
	if (N(sr)) return sr;
	let e;
	if (e = "undefined" != typeof CESIUM_BASE_URL ? CESIUM_BASE_URL : N(import.meta.url) ? ft(".", import.meta.url) : "object" == typeof define && N(define.amd) && !define.amd.toUrlUndefined && N(u.toUrl) ? ft("..", pr("Core/buildModuleUrl.js")) : function() {
		const e = document.getElementsByTagName("script");
		for (let t = 0, r = e.length; t < r; ++t) {
			const r = e[t].getAttribute("src"), n = or.exec(r);
			if (null !== n) return n[1];
		}
	}(), !N(e)) throw new v("Unable to determine Cesium base URL automatically, try defining a global variable called CESIUM_BASE_URL.");
	return sr = new Gt({ url: cr(e) }), sr.appendForwardSlash(), sr;
}
function fr(e) {
	return cr(u.toUrl(`../${e}`));
}
function hr(e) {
	return lr().getDerivedResource({ url: e }).url;
}
function pr(e) {
	return N(ur) || (ur = "object" == typeof define && N(define.amd) && !define.amd.toUrlUndefined && N(u.toUrl) ? fr : hr), ur(e);
}
function mr(e, t, r) {
	this.x = e, this.y = t, this.s = r;
}
function dr(e) {
	e = e ?? C.EMPTY_OBJECT, this._xysFileUrlTemplate = Gt.createIfNeeded(e.xysFileUrlTemplate), this._interpolationOrder = e.interpolationOrder ?? 9, this._sampleZeroJulianEphemerisDate = e.sampleZeroJulianEphemerisDate ?? 2442396.5, this._sampleZeroDateTT = new tt(this._sampleZeroJulianEphemerisDate, 0, De.TAI), this._stepSizeDays = e.stepSizeDays ?? 1, this._samplesPerXysFile = e.samplesPerXysFile ?? 1e3, this._totalSamples = e.totalSamples ?? 27426, this._samples = new Array(3 * this._totalSamples), this._chunkDownloadsInProgress = [];
	const t = this._interpolationOrder, r = this._denominators = new Array(t + 1), n = this._xTable = new Array(t + 1), i = Math.pow(this._stepSizeDays, t);
	for (let o = 0; o <= t; ++o) {
		r[o] = i, n[o] = o * this._stepSizeDays;
		for (let e = 0; e <= t; ++e) e !== o && (r[o] *= o - e);
		r[o] = 1 / r[o];
	}
	this._work = new Array(t + 1), this._coef = new Array(t + 1);
}
pr._cesiumScriptRegex = or, pr._buildModuleUrlFromBaseUrl = hr, pr._clearBaseResource = function() {
	sr = void 0;
}, pr.setBaseUrl = function(e) {
	sr = Gt.DEFAULT.getDerivedResource({ url: e });
}, pr.getCesiumBaseUrl = lr;
const yr = new tt(0, 0, De.TAI);
function _r(e, t, r) {
	const n = yr;
	return n.dayNumber = t, n.secondsOfDay = r, tt.daysDifference(n, e._sampleZeroDateTT);
}
function gr(e, t) {
	if (N(e._chunkDownloadsInProgress[t])) return e._chunkDownloadsInProgress[t];
	let r;
	const n = e._xysFileUrlTemplate;
	r = N(n) ? n.getDerivedResource({ templateValues: { 0: t } }) : new Gt({ url: pr(`Assets/IAU2006_XYS/IAU2006_XYS_${t}.json`) });
	const i = async function(e, t, r) {
		try {
			const n = await e.fetchJson();
			r._updateChunkData(t, n);
		} catch (e) {}
	}(r, t, e);
	return e._chunkDownloadsInProgress[t] = i, i;
}
dr.prototype.preload = function(e, t, r, n) {
	const i = _r(this, e, t), o = _r(this, r, n);
	let a = i / this._stepSizeDays - this._interpolationOrder / 2 | 0;
	a < 0 && (a = 0);
	let s = o / this._stepSizeDays - this._interpolationOrder / 2 | 0 + this._interpolationOrder;
	s >= this._totalSamples && (s = this._totalSamples - 1);
	const u = a / this._samplesPerXysFile | 0, c = s / this._samplesPerXysFile | 0, l = [];
	for (let f = u; f <= c; ++f) l.push(gr(this, f));
	return Promise.all(l);
}, dr.prototype.computeXysRadians = function(e, t, r) {
	const n = _r(this, e, t);
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
	if (N(c[3 * a]) || (gr(this, a / this._samplesPerXysFile | 0), u = !0), N(c[3 * s]) || (gr(this, s / this._samplesPerXysFile | 0), u = !0), u) return;
	N(r) ? (r.x = 0, r.y = 0, r.s = 0) : r = new mr(0, 0, 0);
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
}, dr.prototype._updateChunkData = function(e, { samples: t }) {
	this._chunkDownloadsInProgress[e] = void 0;
	const r = e * this._samplesPerXysFile * 3;
	for (let n = 0; n < t.length; ++n) this._samples[r + n] = t[n];
};
var Er = class e {
	constructor(e, t, r, n, i, o, a, s, u) {
		this[0] = e ?? 0, this[1] = n ?? 0, this[2] = a ?? 0, this[3] = t ?? 0, this[4] = i ?? 0, this[5] = s ?? 0, this[6] = r ?? 0, this[7] = o ?? 0, this[8] = u ?? 0;
	}
	static pack(e, t, r) {
		return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t;
	}
	static unpack(t, r, n) {
		return P.defined("array", t), r = r ?? 0, N(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n[4] = t[r++], n[5] = t[r++], n[6] = t[r++], n[7] = t[r++], n[8] = t[r++], n;
	}
	static packArray(t, r) {
		P.defined("array", t);
		const n = t.length, i = 9 * n;
		if (N(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 9 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 9 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (P.defined("array", t), P.typeOf.number.greaterThanOrEquals("array.length", t.length, 9), t.length % 9 != 0) throw new v("array length must be a multiple of 9.");
		const n = t.length;
		N(r) ? r.length = n / 9 : r = new Array(n / 9);
		for (let i = 0; i < n; i += 9) {
			const n = i / 9;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r[6] = t[6], r[7] = t[7], r[8] = t[8], r) : new e(t[0], t[3], t[6], t[1], t[4], t[7], t[2], t[5], t[8]);
	}
	static fromColumnMajorArray(t, r) {
		return P.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return P.defined("values", t), N(r) ? (r[0] = t[0], r[1] = t[3], r[2] = t[6], r[3] = t[1], r[4] = t[4], r[5] = t[7], r[6] = t[2], r[7] = t[5], r[8] = t[8], r) : new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
	}
	static fromQuaternion(t, r) {
		P.typeOf.object("quaternion", t);
		const n = t.x * t.x, i = t.x * t.y, o = t.x * t.z, a = t.x * t.w, s = t.y * t.y, u = t.y * t.z, c = t.y * t.w, l = t.z * t.z, f = t.z * t.w, h = t.w * t.w, p = n - s - l + h, m = 2 * (i - f), d = 2 * (o + c), y = 2 * (i + f), _ = -n + s - l + h, g = 2 * (u - a), E = 2 * (o - c), b = 2 * (u + a), T = -n - s + l + h;
		return N(r) ? (r[0] = p, r[1] = y, r[2] = E, r[3] = m, r[4] = _, r[5] = b, r[6] = d, r[7] = g, r[8] = T, r) : new e(p, m, d, y, _, g, E, b, T);
	}
	static fromHeadingPitchRoll(t, r) {
		P.typeOf.object("headingPitchRoll", t);
		const n = Math.cos(-t.pitch), i = Math.cos(-t.heading), o = Math.cos(t.roll), a = Math.sin(-t.pitch), s = Math.sin(-t.heading), u = Math.sin(t.roll), c = n * i, l = -o * s + u * a * i, f = u * s + o * a * i, h = n * s, p = o * i + u * a * s, m = -u * i + o * a * s, d = -a, y = u * n, _ = o * n;
		return N(r) ? (r[0] = c, r[1] = h, r[2] = d, r[3] = l, r[4] = p, r[5] = y, r[6] = f, r[7] = m, r[8] = _, r) : new e(c, l, f, h, p, m, d, y, _);
	}
	static fromScale(t, r) {
		return P.typeOf.object("scale", t), N(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = t.y, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = t.z, r) : new e(t.x, 0, 0, 0, t.y, 0, 0, 0, t.z);
	}
	static fromUniformScale(t, r) {
		return P.typeOf.number("scale", t), N(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = t, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = t, r) : new e(t, 0, 0, 0, t, 0, 0, 0, t);
	}
	static fromCrossProduct(t, r) {
		return P.typeOf.object("vector", t), N(r) ? (r[0] = 0, r[1] = t.z, r[2] = -t.y, r[3] = -t.z, r[4] = 0, r[5] = t.x, r[6] = t.y, r[7] = -t.x, r[8] = 0, r) : new e(0, -t.z, t.y, t.z, 0, -t.x, -t.y, t.x, 0);
	}
	static fromRotationX(t, r) {
		P.typeOf.number("angle", t);
		const n = Math.cos(t), i = Math.sin(t);
		return N(r) ? (r[0] = 1, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = n, r[5] = i, r[6] = 0, r[7] = -i, r[8] = n, r) : new e(1, 0, 0, 0, n, -i, 0, i, n);
	}
	static fromRotationY(t, r) {
		P.typeOf.number("angle", t);
		const n = Math.cos(t), i = Math.sin(t);
		return N(r) ? (r[0] = n, r[1] = 0, r[2] = -i, r[3] = 0, r[4] = 1, r[5] = 0, r[6] = i, r[7] = 0, r[8] = n, r) : new e(n, 0, i, 0, 1, 0, -i, 0, n);
	}
	static fromRotationZ(t, r) {
		P.typeOf.number("angle", t);
		const n = Math.cos(t), i = Math.sin(t);
		return N(r) ? (r[0] = n, r[1] = i, r[2] = 0, r[3] = -i, r[4] = n, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = 1, r) : new e(n, -i, 0, i, n, 0, 0, 0, 1);
	}
	static toArray(e, t) {
		return P.typeOf.object("matrix", e), N(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t) : [
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
		return P.typeOf.number.greaterThanOrEquals("row", t, 0), P.typeOf.number.lessThanOrEquals("row", t, 2), P.typeOf.number.greaterThanOrEquals("column", e, 0), P.typeOf.number.lessThanOrEquals("column", e, 2), 3 * e + t;
	}
	static getColumn(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.number.greaterThanOrEquals("index", t, 0), P.typeOf.number.lessThanOrEquals("index", t, 2), P.typeOf.object("result", r);
		const n = 3 * t, i = e[n], o = e[n + 1], a = e[n + 2];
		return r.x = i, r.y = o, r.z = a, r;
	}
	static setColumn(t, r, n, i) {
		P.typeOf.object("matrix", t), P.typeOf.number.greaterThanOrEquals("index", r, 0), P.typeOf.number.lessThanOrEquals("index", r, 2), P.typeOf.object("cartesian", n), P.typeOf.object("result", i);
		const o = 3 * r;
		return (i = e.clone(t, i))[o] = n.x, i[o + 1] = n.y, i[o + 2] = n.z, i;
	}
	static getRow(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.number.greaterThanOrEquals("index", t, 0), P.typeOf.number.lessThanOrEquals("index", t, 2), P.typeOf.object("result", r);
		const n = e[t], i = e[t + 3], o = e[t + 6];
		return r.x = n, r.y = i, r.z = o, r;
	}
	static setRow(t, r, n, i) {
		return P.typeOf.object("matrix", t), P.typeOf.number.greaterThanOrEquals("index", r, 0), P.typeOf.number.lessThanOrEquals("index", r, 2), P.typeOf.object("cartesian", n), P.typeOf.object("result", i), (i = e.clone(t, i))[r] = n.x, i[r + 3] = n.y, i[r + 6] = n.z, i;
	}
	static setScale(t, r, n) {
		P.typeOf.object("matrix", t), P.typeOf.object("scale", r), P.typeOf.object("result", n);
		const i = e.getScale(t, br), o = r.x / i.x, a = r.y / i.y, s = r.z / i.z;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * o, n[3] = t[3] * a, n[4] = t[4] * a, n[5] = t[5] * a, n[6] = t[6] * s, n[7] = t[7] * s, n[8] = t[8] * s, n;
	}
	static setUniformScale(t, r, n) {
		P.typeOf.object("matrix", t), P.typeOf.number("scale", r), P.typeOf.object("result", n);
		const i = e.getScale(t, Tr), o = r / i.x, a = r / i.y, s = r / i.z;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * o, n[3] = t[3] * a, n[4] = t[4] * a, n[5] = t[5] * a, n[6] = t[6] * s, n[7] = t[7] * s, n[8] = t[8] * s, n;
	}
	static getScale(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t.x = Y.magnitude(Y.fromElements(e[0], e[1], e[2], Or)), t.y = Y.magnitude(Y.fromElements(e[3], e[4], e[5], Or)), t.z = Y.magnitude(Y.fromElements(e[6], e[7], e[8], Or)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, wr), Y.maximumComponent(wr);
	}
	static setRotation(t, r, n) {
		P.typeOf.object("matrix", t), P.typeOf.object("result", n);
		const i = e.getScale(t, Ar);
		return n[0] = r[0] * i.x, n[1] = r[1] * i.x, n[2] = r[2] * i.x, n[3] = r[3] * i.y, n[4] = r[4] * i.y, n[5] = r[5] * i.y, n[6] = r[6] * i.z, n[7] = r[7] * i.z, n[8] = r[8] * i.z, n;
	}
	static getRotation(t, r) {
		P.typeOf.object("matrix", t), P.typeOf.object("result", r);
		const n = e.getScale(t, xr);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.x, r[3] = t[3] / n.y, r[4] = t[4] / n.y, r[5] = t[5] / n.y, r[6] = t[6] / n.z, r[7] = t[7] / n.z, r[8] = t[8] / n.z, r;
	}
	static multiply(e, t, r) {
		P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r);
		const n = e[0] * t[0] + e[3] * t[1] + e[6] * t[2], i = e[1] * t[0] + e[4] * t[1] + e[7] * t[2], o = e[2] * t[0] + e[5] * t[1] + e[8] * t[2], a = e[0] * t[3] + e[3] * t[4] + e[6] * t[5], s = e[1] * t[3] + e[4] * t[4] + e[7] * t[5], u = e[2] * t[3] + e[5] * t[4] + e[8] * t[5], c = e[0] * t[6] + e[3] * t[7] + e[6] * t[8], l = e[1] * t[6] + e[4] * t[7] + e[7] * t[8], f = e[2] * t[6] + e[5] * t[7] + e[8] * t[8];
		return r[0] = n, r[1] = i, r[2] = o, r[3] = a, r[4] = s, r[5] = u, r[6] = c, r[7] = l, r[8] = f, r;
	}
	static add(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r[4] = e[4] + t[4], r[5] = e[5] + t[5], r[6] = e[6] + t[6], r[7] = e[7] + t[7], r[8] = e[8] + t[8], r;
	}
	static subtract(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r[4] = e[4] - t[4], r[5] = e[5] - t[5], r[6] = e[6] - t[6], r[7] = e[7] - t[7], r[8] = e[8] - t[8], r;
	}
	static multiplyByVector(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = t.x, i = t.y, o = t.z, a = e[0] * n + e[3] * i + e[6] * o, s = e[1] * n + e[4] * i + e[7] * o, u = e[2] * n + e[5] * i + e[8] * o;
		return r.x = a, r.y = s, r.z = u, r;
	}
	static multiplyByScalar(e, t, r) {
		return P.typeOf.object("matrix", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r;
	}
	static multiplyByScale(e, t, r) {
		return P.typeOf.object("matrix", e), P.typeOf.object("scale", t), P.typeOf.object("result", r), r[0] = e[0] * t.x, r[1] = e[1] * t.x, r[2] = e[2] * t.x, r[3] = e[3] * t.y, r[4] = e[4] * t.y, r[5] = e[5] * t.y, r[6] = e[6] * t.z, r[7] = e[7] * t.z, r[8] = e[8] * t.z, r;
	}
	static multiplyByUniformScale(e, t, r) {
		return P.typeOf.object("matrix", e), P.typeOf.number("scale", t), P.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r;
	}
	static negate(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t;
	}
	static transpose(e, t) {
		P.typeOf.object("matrix", e), P.typeOf.object("result", t);
		const r = e[0], n = e[3], i = e[6], o = e[1], a = e[4], s = e[7], u = e[2], c = e[5], l = e[8];
		return t[0] = r, t[1] = n, t[2] = i, t[3] = o, t[4] = a, t[5] = s, t[6] = u, t[7] = c, t[8] = l, t;
	}
	static computeEigenDecomposition(t, r) {
		P.typeOf.object("matrix", t);
		const n = B.EPSILON20;
		let i = 0, o = 0;
		N(r) || (r = {});
		const a = r.unitary = e.clone(e.IDENTITY, r.unitary), s = r.diagonal = e.clone(t, r.diagonal), u = n * function(e) {
			let t = 0;
			for (let r = 0; r < 9; ++r) {
				const n = e[r];
				t += n * n;
			}
			return Math.sqrt(t);
		}(s);
		for (; o < 10 && vr(s) > u;) Pr(s, Rr), e.transpose(Rr, Sr), e.multiply(s, Rr, s), e.multiply(Sr, s, s), e.multiply(a, Rr, a), ++i > 2 && (++o, i = 0);
		return r;
	}
	static abs(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t;
	}
	static determinant(e) {
		P.typeOf.object("matrix", e);
		const t = e[0], r = e[3], n = e[6], i = e[1], o = e[4], a = e[7], s = e[2], u = e[5], c = e[8];
		return t * (o * c - u * a) + i * (u * n - r * c) + s * (r * a - o * n);
	}
	static inverse(t, r) {
		P.typeOf.object("matrix", t), P.typeOf.object("result", r);
		const n = t[0], i = t[1], o = t[2], a = t[3], s = t[4], u = t[5], c = t[6], l = t[7], f = t[8], h = e.determinant(t);
		if (Math.abs(h) <= B.EPSILON15) throw new v("matrix is not invertible");
		r[0] = s * f - l * u, r[1] = l * o - i * f, r[2] = i * u - s * o, r[3] = c * u - a * f, r[4] = n * f - c * o, r[5] = a * o - n * u, r[6] = a * l - c * s, r[7] = c * i - n * l, r[8] = n * s - a * i;
		const p = 1 / h;
		return e.multiplyByScalar(r, p, r);
	}
	static inverseTranspose(t, r) {
		return P.typeOf.object("matrix", t), P.typeOf.object("result", r), e.inverse(e.transpose(t, Ir), r);
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[7] === t[7] && e[8] === t[8];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || N(e) && N(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r && Math.abs(e[4] - t[4]) <= r && Math.abs(e[5] - t[5]) <= r && Math.abs(e[6] - t[6]) <= r && Math.abs(e[7] - t[7]) <= r && Math.abs(e[8] - t[8]) <= r;
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
Er.packedLength = 9, Er.fromArray = Er.unpack, Er.IDENTITY = Object.freeze(new Er(1, 0, 0, 0, 1, 0, 0, 0, 1)), Er.ZERO = Object.freeze(new Er(0, 0, 0, 0, 0, 0, 0, 0, 0)), Er.COLUMN0ROW0 = 0, Er.COLUMN0ROW1 = 1, Er.COLUMN0ROW2 = 2, Er.COLUMN1ROW0 = 3, Er.COLUMN1ROW1 = 4, Er.COLUMN1ROW2 = 5, Er.COLUMN2ROW0 = 6, Er.COLUMN2ROW1 = 7, Er.COLUMN2ROW2 = 8;
const br = new Y(), Tr = new Y(), Or = new Y(), wr = new Y(), Ar = new Y(), xr = new Y(), Rr = new Er(), Sr = new Er(), Ir = new Er(), Cr = [
	1,
	0,
	0
], Nr = [
	2,
	2,
	1
];
function vr(e) {
	let t = 0;
	for (let r = 0; r < 3; ++r) {
		const n = e[Er.getElementIndex(Nr[r], Cr[r])];
		t += 2 * n * n;
	}
	return Math.sqrt(t);
}
function Pr(e, t) {
	const r = B.EPSILON15;
	let n = 0, i = 1;
	for (let c = 0; c < 3; ++c) {
		const t = Math.abs(e[Er.getElementIndex(Nr[c], Cr[c])]);
		t > n && (i = c, n = t);
	}
	let o = 1, a = 0;
	const s = Cr[i], u = Nr[i];
	if (Math.abs(e[Er.getElementIndex(u, s)]) > r) {
		const t = (e[Er.getElementIndex(u, u)] - e[Er.getElementIndex(s, s)]) / 2 / e[Er.getElementIndex(u, s)];
		let r;
		r = t < 0 ? -1 / (-t + Math.sqrt(1 + t * t)) : 1 / (t + Math.sqrt(1 + t * t)), o = 1 / Math.sqrt(1 + r * r), a = r * o;
	}
	return (t = Er.clone(Er.IDENTITY, t))[Er.getElementIndex(s, s)] = t[Er.getElementIndex(u, u)] = o, t[Er.getElementIndex(u, s)] = a, t[Er.getElementIndex(s, u)] = -a, t;
}
var Mr = class e {
	constructor(e, t, r, n, i, o, a, s, u, c, l, f, h, p, m, d) {
		this[0] = e ?? 0, this[1] = i ?? 0, this[2] = u ?? 0, this[3] = h ?? 0, this[4] = t ?? 0, this[5] = o ?? 0, this[6] = c ?? 0, this[7] = p ?? 0, this[8] = r ?? 0, this[9] = a ?? 0, this[10] = l ?? 0, this[11] = m ?? 0, this[12] = n ?? 0, this[13] = s ?? 0, this[14] = f ?? 0, this[15] = d ?? 0;
	}
	static pack(e, t, r) {
		return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t[r++] = e[4], t[r++] = e[5], t[r++] = e[6], t[r++] = e[7], t[r++] = e[8], t[r++] = e[9], t[r++] = e[10], t[r++] = e[11], t[r++] = e[12], t[r++] = e[13], t[r++] = e[14], t[r] = e[15], t;
	}
	static unpack(t, r, n) {
		return P.defined("array", t), r = r ?? 0, N(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n[4] = t[r++], n[5] = t[r++], n[6] = t[r++], n[7] = t[r++], n[8] = t[r++], n[9] = t[r++], n[10] = t[r++], n[11] = t[r++], n[12] = t[r++], n[13] = t[r++], n[14] = t[r++], n[15] = t[r], n;
	}
	static packArray(t, r) {
		P.defined("array", t);
		const n = t.length, i = 16 * n;
		if (N(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 16 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 16 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (P.defined("array", t), P.typeOf.number.greaterThanOrEquals("array.length", t.length, 16), t.length % 16 != 0) throw new v("array length must be a multiple of 16.");
		const n = t.length;
		N(r) ? r.length = n / 16 : r = new Array(n / 16);
		for (let i = 0; i < n; i += 16) {
			const n = i / 16;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r[6] = t[6], r[7] = t[7], r[8] = t[8], r[9] = t[9], r[10] = t[10], r[11] = t[11], r[12] = t[12], r[13] = t[13], r[14] = t[14], r[15] = t[15], r) : new e(t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15]);
	}
	static fromColumnMajorArray(t, r) {
		return P.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return P.defined("values", t), N(r) ? (r[0] = t[0], r[1] = t[4], r[2] = t[8], r[3] = t[12], r[4] = t[1], r[5] = t[5], r[6] = t[9], r[7] = t[13], r[8] = t[2], r[9] = t[6], r[10] = t[10], r[11] = t[14], r[12] = t[3], r[13] = t[7], r[14] = t[11], r[15] = t[15], r) : new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]);
	}
	static fromRotationTranslation(t, r, n) {
		return P.typeOf.object("rotation", t), r = r ?? Y.ZERO, N(n) ? (n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = 0, n[4] = t[3], n[5] = t[4], n[6] = t[5], n[7] = 0, n[8] = t[6], n[9] = t[7], n[10] = t[8], n[11] = 0, n[12] = r.x, n[13] = r.y, n[14] = r.z, n[15] = 1, n) : new e(t[0], t[3], t[6], r.x, t[1], t[4], t[7], r.y, t[2], t[5], t[8], r.z, 0, 0, 0, 1);
	}
	static fromTranslationQuaternionRotationScale(t, r, n, i) {
		P.typeOf.object("translation", t), P.typeOf.object("rotation", r), P.typeOf.object("scale", n), N(i) || (i = new e());
		const o = n.x, a = n.y, s = n.z, u = r.x * r.x, c = r.x * r.y, l = r.x * r.z, f = r.x * r.w, h = r.y * r.y, p = r.y * r.z, m = r.y * r.w, d = r.z * r.z, y = r.z * r.w, _ = r.w * r.w, g = u - h - d + _, E = 2 * (c - y), b = 2 * (l + m), T = 2 * (c + y), O = -u + h - d + _, w = 2 * (p - f), A = 2 * (l - m), x = 2 * (p + f), R = -u - h + d + _;
		return i[0] = g * o, i[1] = T * o, i[2] = A * o, i[3] = 0, i[4] = E * a, i[5] = O * a, i[6] = x * a, i[7] = 0, i[8] = b * s, i[9] = w * s, i[10] = R * s, i[11] = 0, i[12] = t.x, i[13] = t.y, i[14] = t.z, i[15] = 1, i;
	}
	static fromTranslationRotationScale(t, r) {
		return P.typeOf.object("translationRotationScale", t), e.fromTranslationQuaternionRotationScale(t.translation, t.rotation, t.scale, r);
	}
	static fromTranslation(t, r) {
		return P.typeOf.object("translation", t), e.fromRotationTranslation(Er.IDENTITY, t, r);
	}
	static fromScale(t, r) {
		return P.typeOf.object("scale", t), N(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = t.y, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = t.z, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r) : new e(t.x, 0, 0, 0, 0, t.y, 0, 0, 0, 0, t.z, 0, 0, 0, 0, 1);
	}
	static fromUniformScale(t, r) {
		return P.typeOf.number("scale", t), N(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = t, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = t, r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r) : new e(t, 0, 0, 0, 0, t, 0, 0, 0, 0, t, 0, 0, 0, 0, 1);
	}
	static fromRotation(t, r) {
		return P.typeOf.object("rotation", t), N(r) || (r = new e()), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 0, r[4] = t[3], r[5] = t[4], r[6] = t[5], r[7] = 0, r[8] = t[6], r[9] = t[7], r[10] = t[8], r[11] = 0, r[12] = 0, r[13] = 0, r[14] = 0, r[15] = 1, r;
	}
	static fromCamera(t, r) {
		P.typeOf.object("camera", t);
		const n = t.position, i = t.direction, o = t.up;
		P.typeOf.object("camera.position", n), P.typeOf.object("camera.direction", i), P.typeOf.object("camera.up", o), Y.normalize(i, Lr), Y.normalize(Y.cross(Lr, o, Fr), Fr), Y.normalize(Y.cross(Fr, Lr, Dr), Dr);
		const a = Fr.x, s = Fr.y, u = Fr.z, c = Lr.x, l = Lr.y, f = Lr.z, h = Dr.x, p = Dr.y, m = Dr.z, d = n.x, y = n.y, _ = n.z, g = a * -d + s * -y + u * -_, E = h * -d + p * -y + m * -_, b = c * d + l * y + f * _;
		return N(r) ? (r[0] = a, r[1] = h, r[2] = -c, r[3] = 0, r[4] = s, r[5] = p, r[6] = -l, r[7] = 0, r[8] = u, r[9] = m, r[10] = -f, r[11] = 0, r[12] = g, r[13] = E, r[14] = b, r[15] = 1, r) : new e(a, s, u, g, h, p, m, E, -c, -l, -f, b, 0, 0, 0, 1);
	}
	static computePerspectiveFieldOfView(e, t, r, n, i) {
		P.typeOf.number.greaterThan("fovY", e, 0), P.typeOf.number.lessThan("fovY", e, Math.PI), P.typeOf.number.greaterThan("near", r, 0), P.typeOf.number.greaterThan("far", n, 0), P.typeOf.object("result", i);
		const o = 1 / Math.tan(.5 * e), a = o / t, s = (n + r) / (r - n), u = 2 * n * r / (r - n);
		return i[0] = a, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = o, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = s, i[11] = -1, i[12] = 0, i[13] = 0, i[14] = u, i[15] = 0, i;
	}
	static computeOrthographicOffCenter(e, t, r, n, i, o, a) {
		P.typeOf.number("left", e), P.typeOf.number("right", t), P.typeOf.number("bottom", r), P.typeOf.number("top", n), P.typeOf.number("near", i), P.typeOf.number("far", o), P.typeOf.object("result", a);
		let s = 1 / (t - e), u = 1 / (n - r), c = 1 / (o - i);
		const l = -(t + e) * s, f = -(n + r) * u, h = -(o + i) * c;
		return s *= 2, u *= 2, c *= -2, a[0] = s, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = u, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = c, a[11] = 0, a[12] = l, a[13] = f, a[14] = h, a[15] = 1, a;
	}
	static computePerspectiveOffCenter(e, t, r, n, i, o, a) {
		P.typeOf.number("left", e), P.typeOf.number("right", t), P.typeOf.number("bottom", r), P.typeOf.number("top", n), P.typeOf.number("near", i), P.typeOf.number("far", o), P.typeOf.object("result", a);
		const s = 2 * i / (t - e), u = 2 * i / (n - r), c = (t + e) / (t - e), l = (n + r) / (n - r), f = -(o + i) / (o - i), h = -2 * o * i / (o - i);
		return a[0] = s, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = u, a[6] = 0, a[7] = 0, a[8] = c, a[9] = l, a[10] = f, a[11] = -1, a[12] = 0, a[13] = 0, a[14] = h, a[15] = 0, a;
	}
	static computeInfinitePerspectiveOffCenter(e, t, r, n, i, o) {
		P.typeOf.number("left", e), P.typeOf.number("right", t), P.typeOf.number("bottom", r), P.typeOf.number("top", n), P.typeOf.number("near", i), P.typeOf.object("result", o);
		const a = 2 * i / (t - e), s = 2 * i / (n - r), u = (t + e) / (t - e), c = (n + r) / (n - r), l = -2 * i;
		return o[0] = a, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = s, o[6] = 0, o[7] = 0, o[8] = u, o[9] = c, o[10] = -1, o[11] = -1, o[12] = 0, o[13] = 0, o[14] = l, o[15] = 0, o;
	}
	static computeViewportTransformation(t, r, n, i) {
		N(i) || (i = new e());
		const o = (t = t ?? C.EMPTY_OBJECT).x ?? 0, a = t.y ?? 0;
		r = r ?? 0;
		const s = .5 * (t.width ?? 0), u = .5 * (t.height ?? 0), c = .5 * ((n = n ?? 1) - r), l = s, f = u, h = c, p = o + s, m = a + u, d = r + c;
		return i[0] = l, i[1] = 0, i[2] = 0, i[3] = 0, i[4] = 0, i[5] = f, i[6] = 0, i[7] = 0, i[8] = 0, i[9] = 0, i[10] = h, i[11] = 0, i[12] = p, i[13] = m, i[14] = d, i[15] = 1, i;
	}
	static computeView(e, t, r, n, i) {
		return P.typeOf.object("position", e), P.typeOf.object("direction", t), P.typeOf.object("up", r), P.typeOf.object("right", n), P.typeOf.object("result", i), i[0] = n.x, i[1] = r.x, i[2] = -t.x, i[3] = 0, i[4] = n.y, i[5] = r.y, i[6] = -t.y, i[7] = 0, i[8] = n.z, i[9] = r.z, i[10] = -t.z, i[11] = 0, i[12] = -Y.dot(n, e), i[13] = -Y.dot(r, e), i[14] = Y.dot(t, e), i[15] = 1, i;
	}
	static toArray(e, t) {
		return P.typeOf.object("matrix", e), N(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t) : [
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
		return P.typeOf.number.greaterThanOrEquals("row", t, 0), P.typeOf.number.lessThanOrEquals("row", t, 3), P.typeOf.number.greaterThanOrEquals("column", e, 0), P.typeOf.number.lessThanOrEquals("column", e, 3), 4 * e + t;
	}
	static getColumn(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.number.greaterThanOrEquals("index", t, 0), P.typeOf.number.lessThanOrEquals("index", t, 3), P.typeOf.object("result", r);
		const n = 4 * t, i = e[n], o = e[n + 1], a = e[n + 2], s = e[n + 3];
		return r.x = i, r.y = o, r.z = a, r.w = s, r;
	}
	static setColumn(t, r, n, i) {
		P.typeOf.object("matrix", t), P.typeOf.number.greaterThanOrEquals("index", r, 0), P.typeOf.number.lessThanOrEquals("index", r, 3), P.typeOf.object("cartesian", n), P.typeOf.object("result", i);
		const o = 4 * r;
		return (i = e.clone(t, i))[o] = n.x, i[o + 1] = n.y, i[o + 2] = n.z, i[o + 3] = n.w, i;
	}
	static getRow(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.number.greaterThanOrEquals("index", t, 0), P.typeOf.number.lessThanOrEquals("index", t, 3), P.typeOf.object("result", r);
		const n = e[t], i = e[t + 4], o = e[t + 8], a = e[t + 12];
		return r.x = n, r.y = i, r.z = o, r.w = a, r;
	}
	static setRow(t, r, n, i) {
		return P.typeOf.object("matrix", t), P.typeOf.number.greaterThanOrEquals("index", r, 0), P.typeOf.number.lessThanOrEquals("index", r, 3), P.typeOf.object("cartesian", n), P.typeOf.object("result", i), (i = e.clone(t, i))[r] = n.x, i[r + 4] = n.y, i[r + 8] = n.z, i[r + 12] = n.w, i;
	}
	static setTranslation(e, t, r) {
		return P.typeOf.object("matrix", e), P.typeOf.object("translation", t), P.typeOf.object("result", r), r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = t.x, r[13] = t.y, r[14] = t.z, r[15] = e[15], r;
	}
	static setScale(t, r, n) {
		P.typeOf.object("matrix", t), P.typeOf.object("scale", r), P.typeOf.object("result", n);
		const i = e.getScale(t, zr), o = r.x / i.x, a = r.y / i.y, s = r.z / i.z;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * o, n[3] = t[3], n[4] = t[4] * a, n[5] = t[5] * a, n[6] = t[6] * a, n[7] = t[7], n[8] = t[8] * s, n[9] = t[9] * s, n[10] = t[10] * s, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static setUniformScale(t, r, n) {
		P.typeOf.object("matrix", t), P.typeOf.number("scale", r), P.typeOf.object("result", n);
		const i = e.getScale(t, Br), o = r / i.x, a = r / i.y, s = r / i.z;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * o, n[3] = t[3], n[4] = t[4] * a, n[5] = t[5] * a, n[6] = t[6] * a, n[7] = t[7], n[8] = t[8] * s, n[9] = t[9] * s, n[10] = t[10] * s, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static getScale(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t.x = Y.magnitude(Y.fromElements(e[0], e[1], e[2], Ur)), t.y = Y.magnitude(Y.fromElements(e[4], e[5], e[6], Ur)), t.z = Y.magnitude(Y.fromElements(e[8], e[9], e[10], Ur)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, jr), Y.maximumComponent(jr);
	}
	static setRotation(t, r, n) {
		P.typeOf.object("matrix", t), P.typeOf.object("result", n);
		const i = e.getScale(t, qr);
		return n[0] = r[0] * i.x, n[1] = r[1] * i.x, n[2] = r[2] * i.x, n[3] = t[3], n[4] = r[3] * i.y, n[5] = r[4] * i.y, n[6] = r[5] * i.y, n[7] = t[7], n[8] = r[6] * i.z, n[9] = r[7] * i.z, n[10] = r[8] * i.z, n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n;
	}
	static getRotation(t, r) {
		P.typeOf.object("matrix", t), P.typeOf.object("result", r);
		const n = e.getScale(t, Gr);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.x, r[3] = t[4] / n.y, r[4] = t[5] / n.y, r[5] = t[6] / n.y, r[6] = t[8] / n.z, r[7] = t[9] / n.z, r[8] = t[10] / n.z, r;
	}
	static multiply(e, t, r) {
		P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r);
		const n = e[0], i = e[1], o = e[2], a = e[3], s = e[4], u = e[5], c = e[6], l = e[7], f = e[8], h = e[9], p = e[10], m = e[11], d = e[12], y = e[13], _ = e[14], g = e[15], E = t[0], b = t[1], T = t[2], O = t[3], w = t[4], A = t[5], x = t[6], R = t[7], S = t[8], I = t[9], C = t[10], N = t[11], v = t[12], M = t[13], L = t[14], F = t[15], D = n * E + s * b + f * T + d * O, z = i * E + u * b + h * T + y * O, B = o * E + c * b + p * T + _ * O, U = a * E + l * b + m * T + g * O, j = n * w + s * A + f * x + d * R, q = i * w + u * A + h * x + y * R, G = o * w + c * A + p * x + _ * R, W = a * w + l * A + m * x + g * R, k = n * S + s * I + f * C + d * N, V = i * S + u * I + h * C + y * N, H = o * S + c * I + p * C + _ * N, Y = a * S + l * I + m * C + g * N, X = n * v + s * M + f * L + d * F, $ = i * v + u * M + h * L + y * F, K = o * v + c * M + p * L + _ * F, Z = a * v + l * M + m * L + g * F;
		return r[0] = D, r[1] = z, r[2] = B, r[3] = U, r[4] = j, r[5] = q, r[6] = G, r[7] = W, r[8] = k, r[9] = V, r[10] = H, r[11] = Y, r[12] = X, r[13] = $, r[14] = K, r[15] = Z, r;
	}
	static add(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r[4] = e[4] + t[4], r[5] = e[5] + t[5], r[6] = e[6] + t[6], r[7] = e[7] + t[7], r[8] = e[8] + t[8], r[9] = e[9] + t[9], r[10] = e[10] + t[10], r[11] = e[11] + t[11], r[12] = e[12] + t[12], r[13] = e[13] + t[13], r[14] = e[14] + t[14], r[15] = e[15] + t[15], r;
	}
	static subtract(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r[4] = e[4] - t[4], r[5] = e[5] - t[5], r[6] = e[6] - t[6], r[7] = e[7] - t[7], r[8] = e[8] - t[8], r[9] = e[9] - t[9], r[10] = e[10] - t[10], r[11] = e[11] - t[11], r[12] = e[12] - t[12], r[13] = e[13] - t[13], r[14] = e[14] - t[14], r[15] = e[15] - t[15], r;
	}
	static multiplyTransformation(e, t, r) {
		P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r);
		const n = e[0], i = e[1], o = e[2], a = e[4], s = e[5], u = e[6], c = e[8], l = e[9], f = e[10], h = e[12], p = e[13], m = e[14], d = t[0], y = t[1], _ = t[2], g = t[4], E = t[5], b = t[6], T = t[8], O = t[9], w = t[10], A = t[12], x = t[13], R = t[14], S = n * d + a * y + c * _, I = i * d + s * y + l * _, C = o * d + u * y + f * _, N = n * g + a * E + c * b, v = i * g + s * E + l * b, M = o * g + u * E + f * b, L = n * T + a * O + c * w, F = i * T + s * O + l * w, D = o * T + u * O + f * w, z = n * A + a * x + c * R + h, B = i * A + s * x + l * R + p, U = o * A + u * x + f * R + m;
		return r[0] = S, r[1] = I, r[2] = C, r[3] = 0, r[4] = N, r[5] = v, r[6] = M, r[7] = 0, r[8] = L, r[9] = F, r[10] = D, r[11] = 0, r[12] = z, r[13] = B, r[14] = U, r[15] = 1, r;
	}
	static multiplyByMatrix3(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.object("rotation", t), P.typeOf.object("result", r);
		const n = e[0], i = e[1], o = e[2], a = e[4], s = e[5], u = e[6], c = e[8], l = e[9], f = e[10], h = t[0], p = t[1], m = t[2], d = t[3], y = t[4], _ = t[5], g = t[6], E = t[7], b = t[8], T = n * h + a * p + c * m, O = i * h + s * p + l * m, w = o * h + u * p + f * m, A = n * d + a * y + c * _, x = i * d + s * y + l * _, R = o * d + u * y + f * _, S = n * g + a * E + c * b, I = i * g + s * E + l * b, C = o * g + u * E + f * b;
		return r[0] = T, r[1] = O, r[2] = w, r[3] = 0, r[4] = A, r[5] = x, r[6] = R, r[7] = 0, r[8] = S, r[9] = I, r[10] = C, r[11] = 0, r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static multiplyByTranslation(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.object("translation", t), P.typeOf.object("result", r);
		const n = t.x, i = t.y, o = t.z, a = n * e[0] + i * e[4] + o * e[8] + e[12], s = n * e[1] + i * e[5] + o * e[9] + e[13], u = n * e[2] + i * e[6] + o * e[10] + e[14];
		return r[0] = e[0], r[1] = e[1], r[2] = e[2], r[3] = e[3], r[4] = e[4], r[5] = e[5], r[6] = e[6], r[7] = e[7], r[8] = e[8], r[9] = e[9], r[10] = e[10], r[11] = e[11], r[12] = a, r[13] = s, r[14] = u, r[15] = e[15], r;
	}
	static multiplyByScale(t, r, n) {
		P.typeOf.object("matrix", t), P.typeOf.object("scale", r), P.typeOf.object("result", n);
		const i = r.x, o = r.y, a = r.z;
		return 1 === i && 1 === o && 1 === a ? e.clone(t, n) : (n[0] = i * t[0], n[1] = i * t[1], n[2] = i * t[2], n[3] = t[3], n[4] = o * t[4], n[5] = o * t[5], n[6] = o * t[6], n[7] = t[7], n[8] = a * t[8], n[9] = a * t[9], n[10] = a * t[10], n[11] = t[11], n[12] = t[12], n[13] = t[13], n[14] = t[14], n[15] = t[15], n);
	}
	static multiplyByUniformScale(e, t, r) {
		return P.typeOf.object("matrix", e), P.typeOf.number("scale", t), P.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3], r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7], r[8] = e[8] * t, r[9] = e[9] * t, r[10] = e[10] * t, r[11] = e[11], r[12] = e[12], r[13] = e[13], r[14] = e[14], r[15] = e[15], r;
	}
	static multiplyByVector(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = t.x, i = t.y, o = t.z, a = t.w, s = e[0] * n + e[4] * i + e[8] * o + e[12] * a, u = e[1] * n + e[5] * i + e[9] * o + e[13] * a, c = e[2] * n + e[6] * i + e[10] * o + e[14] * a, l = e[3] * n + e[7] * i + e[11] * o + e[15] * a;
		return r.x = s, r.y = u, r.z = c, r.w = l, r;
	}
	static multiplyByPointAsVector(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = t.x, i = t.y, o = t.z, a = e[0] * n + e[4] * i + e[8] * o, s = e[1] * n + e[5] * i + e[9] * o, u = e[2] * n + e[6] * i + e[10] * o;
		return r.x = a, r.y = s, r.z = u, r;
	}
	static multiplyByPoint(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = t.x, i = t.y, o = t.z, a = e[0] * n + e[4] * i + e[8] * o + e[12], s = e[1] * n + e[5] * i + e[9] * o + e[13], u = e[2] * n + e[6] * i + e[10] * o + e[14];
		return r.x = a, r.y = s, r.z = u, r;
	}
	static multiplyByScalar(e, t, r) {
		return P.typeOf.object("matrix", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r[4] = e[4] * t, r[5] = e[5] * t, r[6] = e[6] * t, r[7] = e[7] * t, r[8] = e[8] * t, r[9] = e[9] * t, r[10] = e[10] * t, r[11] = e[11] * t, r[12] = e[12] * t, r[13] = e[13] * t, r[14] = e[14] * t, r[15] = e[15] * t, r;
	}
	static negate(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = -e[7], t[8] = -e[8], t[9] = -e[9], t[10] = -e[10], t[11] = -e[11], t[12] = -e[12], t[13] = -e[13], t[14] = -e[14], t[15] = -e[15], t;
	}
	static transpose(e, t) {
		P.typeOf.object("matrix", e), P.typeOf.object("result", t);
		const r = e[1], n = e[2], i = e[3], o = e[6], a = e[7], s = e[11];
		return t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = r, t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = n, t[9] = o, t[10] = e[10], t[11] = e[14], t[12] = i, t[13] = a, t[14] = s, t[15] = e[15], t;
	}
	static abs(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t[4] = Math.abs(e[4]), t[5] = Math.abs(e[5]), t[6] = Math.abs(e[6]), t[7] = Math.abs(e[7]), t[8] = Math.abs(e[8]), t[9] = Math.abs(e[9]), t[10] = Math.abs(e[10]), t[11] = Math.abs(e[11]), t[12] = Math.abs(e[12]), t[13] = Math.abs(e[13]), t[14] = Math.abs(e[14]), t[15] = Math.abs(e[15]), t;
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && e[12] === t[12] && e[13] === t[13] && e[14] === t[14] && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[4] === t[4] && e[5] === t[5] && e[6] === t[6] && e[8] === t[8] && e[9] === t[9] && e[10] === t[10] && e[3] === t[3] && e[7] === t[7] && e[11] === t[11] && e[15] === t[15];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || N(e) && N(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r && Math.abs(e[4] - t[4]) <= r && Math.abs(e[5] - t[5]) <= r && Math.abs(e[6] - t[6]) <= r && Math.abs(e[7] - t[7]) <= r && Math.abs(e[8] - t[8]) <= r && Math.abs(e[9] - t[9]) <= r && Math.abs(e[10] - t[10]) <= r && Math.abs(e[11] - t[11]) <= r && Math.abs(e[12] - t[12]) <= r && Math.abs(e[13] - t[13]) <= r && Math.abs(e[14] - t[14]) <= r && Math.abs(e[15] - t[15]) <= r;
	}
	static getTranslation(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t.x = e[12], t.y = e[13], t.z = e[14], t;
	}
	static getMatrix3(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t;
	}
	static inverse(t, r) {
		P.typeOf.object("matrix", t), P.typeOf.object("result", r);
		const n = t[0], i = t[4], o = t[8], a = t[12], s = t[1], u = t[5], c = t[9], l = t[13], f = t[2], h = t[6], p = t[10], m = t[14], d = t[3], y = t[7], _ = t[11], g = t[15];
		let E = p * g, b = m * _, T = h * g, O = m * y, w = h * _, A = p * y, x = f * g, R = m * d, S = f * _, I = p * d, C = f * y, N = h * d;
		const v = E * u + O * c + w * l - (b * u + T * c + A * l), M = b * s + x * c + I * l - (E * s + R * c + S * l), L = T * s + R * u + C * l - (O * s + x * u + N * l), F = A * s + S * u + N * c - (w * s + I * u + C * c), D = b * i + T * o + A * a - (E * i + O * o + w * a), z = E * n + R * o + S * a - (b * n + x * o + I * a), U = O * n + x * i + N * a - (T * n + R * i + C * a), j = w * n + I * i + C * o - (A * n + S * i + N * o);
		E = o * l, b = a * c, T = i * l, O = a * u, w = i * c, A = o * u, x = n * l, R = a * s, S = n * c, I = o * s, C = n * u, N = i * s;
		const q = E * y + O * _ + w * g - (b * y + T * _ + A * g), G = b * d + x * _ + I * g - (E * d + R * _ + S * g), W = T * d + R * y + C * g - (O * d + x * y + N * g), k = A * d + S * y + N * _ - (w * d + I * y + C * _), V = T * p + A * m + b * h - (w * m + E * h + O * p), H = S * m + E * f + R * p - (x * p + I * m + b * f), Y = x * h + N * m + O * f - (C * m + T * f + R * h), X = C * p + w * f + I * h - (S * h + N * p + A * f);
		let $ = n * v + i * M + o * L + a * F;
		if (Math.abs($) < B.EPSILON21) {
			if (Er.equalsEpsilon(e.getMatrix3(t, Wr), kr, B.EPSILON7) && Te.equals(e.getRow(t, 3, Vr), Hr)) return r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = 0, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = 0, r[11] = 0, r[12] = -t[12], r[13] = -t[13], r[14] = -t[14], r[15] = 1, r;
			throw new Rt("matrix is not invertible because its determinate is zero.");
		}
		return $ = 1 / $, r[0] = v * $, r[1] = M * $, r[2] = L * $, r[3] = F * $, r[4] = D * $, r[5] = z * $, r[6] = U * $, r[7] = j * $, r[8] = q * $, r[9] = G * $, r[10] = W * $, r[11] = k * $, r[12] = V * $, r[13] = H * $, r[14] = Y * $, r[15] = X * $, r;
	}
	static inverseTransformation(e, t) {
		P.typeOf.object("matrix", e), P.typeOf.object("result", t);
		const r = e[0], n = e[1], i = e[2], o = e[4], a = e[5], s = e[6], u = e[8], c = e[9], l = e[10], f = e[12], h = e[13], p = e[14], m = -r * f - n * h - i * p, d = -o * f - a * h - s * p, y = -u * f - c * h - l * p;
		return t[0] = r, t[1] = o, t[2] = u, t[3] = 0, t[4] = n, t[5] = a, t[6] = c, t[7] = 0, t[8] = i, t[9] = s, t[10] = l, t[11] = 0, t[12] = m, t[13] = d, t[14] = y, t[15] = 1, t;
	}
	static inverseTranspose(t, r) {
		return P.typeOf.object("matrix", t), P.typeOf.object("result", r), e.inverse(e.transpose(t, Yr), r);
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
Mr.packedLength = 16, Mr.fromArray = Mr.unpack, Mr.IDENTITY = Object.freeze(new Mr(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)), Mr.ZERO = Object.freeze(new Mr(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)), Mr.COLUMN0ROW0 = 0, Mr.COLUMN0ROW1 = 1, Mr.COLUMN0ROW2 = 2, Mr.COLUMN0ROW3 = 3, Mr.COLUMN1ROW0 = 4, Mr.COLUMN1ROW1 = 5, Mr.COLUMN1ROW2 = 6, Mr.COLUMN1ROW3 = 7, Mr.COLUMN2ROW0 = 8, Mr.COLUMN2ROW1 = 9, Mr.COLUMN2ROW2 = 10, Mr.COLUMN2ROW3 = 11, Mr.COLUMN3ROW0 = 12, Mr.COLUMN3ROW1 = 13, Mr.COLUMN3ROW2 = 14, Mr.COLUMN3ROW3 = 15;
const Lr = new Y(), Fr = new Y(), Dr = new Y(), zr = new Y(), Br = new Y(), Ur = new Y(), jr = new Y(), qr = new Y(), Gr = new Y(), Wr = new Er(), kr = new Er(), Vr = new Te(), Hr = new Te(0, 0, 0, 1), Yr = new Mr();
let Xr;
const $r = {
	requestFullscreen: void 0,
	exitFullscreen: void 0,
	fullscreenEnabled: void 0,
	fullscreenElement: void 0,
	fullscreenchange: void 0,
	fullscreenerror: void 0
}, Kr = {};
let Zr, Qr, Jr, en, tn, rn, nn, on, an, sn, un, cn, ln, fn, hn, pn;
function mn(e) {
	const t = e.split(".");
	for (let r = 0, n = t.length; r < n; ++r) t[r] = parseInt(t[r], 10);
	return t;
}
function dn() {
	if (!N(Qr) && (Qr = !1, !gn())) {
		const e = / Chrome\/([\.0-9]+)/.exec(Zr.userAgent);
		null !== e && (Qr = !0, Jr = mn(e[1]));
	}
	return Qr;
}
function yn() {
	if (!N(en) && (en = !1, !dn() && !gn() && / Safari\/[\.0-9]+/.test(Zr.userAgent))) {
		const e = / Version\/([\.0-9]+)/.exec(Zr.userAgent);
		null !== e && (en = !0, tn = mn(e[1]));
	}
	return en;
}
function _n() {
	if (!N(rn)) {
		rn = !1;
		const e = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(Zr.userAgent);
		null !== e && (rn = !0, nn = mn(e[1]), nn.isNightly = !!e[2]);
	}
	return rn;
}
function gn() {
	if (!N(on)) {
		on = !1;
		const e = / Edg\/([\.0-9]+)/.exec(Zr.userAgent);
		null !== e && (on = !0, an = mn(e[1]));
	}
	return on;
}
function En() {
	if (!N(sn)) {
		sn = !1;
		const e = /Firefox\/([\.0-9]+)/.exec(Zr.userAgent);
		null !== e && (sn = !0, un = mn(e[1]));
	}
	return sn;
}
function bn() {
	if (!N(pn)) {
		const e = document.createElement("canvas");
		e.setAttribute("style", "image-rendering: -moz-crisp-edges;image-rendering: pixelated;");
		const t = e.style.imageRendering;
		pn = N(t) && "" !== t, pn && (hn = t);
	}
	return pn;
}
function Tn() {
	if (!Tn.initialized) throw new v("You must call FeatureDetection.supportsWebP.initialize and wait for the promise to resolve before calling FeatureDetection.supportsWebP");
	return Tn._result;
}
Object.defineProperties(Kr, {
	element: { get: function() {
		if (Kr.supportsFullscreen()) return document[$r.fullscreenElement];
	} },
	changeEventName: { get: function() {
		if (Kr.supportsFullscreen()) return $r.fullscreenchange;
	} },
	errorEventName: { get: function() {
		if (Kr.supportsFullscreen()) return $r.fullscreenerror;
	} },
	enabled: { get: function() {
		if (Kr.supportsFullscreen()) return document[$r.fullscreenEnabled];
	} },
	fullscreen: { get: function() {
		if (Kr.supportsFullscreen()) return null !== Kr.element;
	} }
}), Kr.supportsFullscreen = function() {
	if (N(Xr)) return Xr;
	Xr = !1;
	const e = document.body;
	if ("function" == typeof e.requestFullscreen) return $r.requestFullscreen = "requestFullscreen", $r.exitFullscreen = "exitFullscreen", $r.fullscreenEnabled = "fullscreenEnabled", $r.fullscreenElement = "fullscreenElement", $r.fullscreenchange = "fullscreenchange", $r.fullscreenerror = "fullscreenerror", Xr = !0, Xr;
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
		r = `${i}RequestFullscreen`, "function" == typeof e[r] ? ($r.requestFullscreen = r, Xr = !0) : (r = `${i}RequestFullScreen`, "function" == typeof e[r] && ($r.requestFullscreen = r, Xr = !0)), r = `${i}ExitFullscreen`, "function" == typeof document[r] ? $r.exitFullscreen = r : (r = `${i}CancelFullScreen`, "function" == typeof document[r] && ($r.exitFullscreen = r)), r = `${i}FullscreenEnabled`, void 0 !== document[r] ? $r.fullscreenEnabled = r : (r = `${i}FullScreenEnabled`, void 0 !== document[r] && ($r.fullscreenEnabled = r)), r = `${i}FullscreenElement`, void 0 !== document[r] ? $r.fullscreenElement = r : (r = `${i}FullScreenElement`, void 0 !== document[r] && ($r.fullscreenElement = r)), r = `${i}fullscreenchange`, void 0 !== document[`on${r}`] && ("ms" === i && (r = "MSFullscreenChange"), $r.fullscreenchange = r), r = `${i}fullscreenerror`, void 0 !== document[`on${r}`] && ("ms" === i && (r = "MSFullscreenError"), $r.fullscreenerror = r);
	}
	return Xr;
}, Kr.requestFullscreen = function(e, t) {
	Kr.supportsFullscreen() && e[$r.requestFullscreen]({ vrDisplay: t });
}, Kr.exitFullscreen = function() {
	Kr.supportsFullscreen() && document[$r.exitFullscreen]();
}, Kr._names = $r, Zr = "undefined" != typeof navigator ? navigator : {}, Tn._promise = void 0, Tn._result = void 0, Tn.initialize = function() {
	return N(Tn._promise) || (Tn._promise = new Promise((e) => {
		const t = new Image();
		t.onload = function() {
			Tn._result = t.width > 0 && t.height > 0, e(Tn._result);
		}, t.onerror = function() {
			Tn._result = !1, e(Tn._result);
		}, t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
	})), Tn._promise;
}, Object.defineProperties(Tn, { initialized: { get: function() {
	return N(Tn._result);
} } });
const On = [];
"undefined" != typeof ArrayBuffer && (On.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), "undefined" != typeof Uint8ClampedArray && On.push(Uint8ClampedArray), "undefined" != typeof Uint8ClampedArray && On.push(Uint8ClampedArray), "undefined" != typeof BigInt64Array && On.push(BigInt64Array), "undefined" != typeof BigUint64Array && On.push(BigUint64Array));
const wn = {
	isChrome: dn,
	chromeVersion: function() {
		return dn() && Jr;
	},
	isSafari: yn,
	safariVersion: function() {
		return yn() && tn;
	},
	isWebkit: _n,
	webkitVersion: function() {
		return _n() && nn;
	},
	isEdge: gn,
	edgeVersion: function() {
		return gn() && an;
	},
	isFirefox: En,
	firefoxVersion: function() {
		return En() && un;
	},
	isWindows: function() {
		return N(cn) || (cn = /Windows/i.test(Zr.appVersion)), cn;
	},
	isIPadOrIOS: function() {
		return N(ln) || (ln = "iPhone" === navigator.platform || "iPod" === navigator.platform || "iPad" === navigator.platform), ln;
	},
	hardwareConcurrency: Zr.hardwareConcurrency ?? 3,
	supportsPointerEvents: function() {
		return N(fn) || (fn = !En() && "undefined" != typeof PointerEvent && (!N(Zr.pointerEnabled) || Zr.pointerEnabled)), fn;
	},
	supportsImageRenderingPixelated: bn,
	supportsWebP: Tn,
	imageRenderingValue: function() {
		return bn() ? hn : void 0;
	},
	typedArrayTypes: On
};
function An(e, t, r, n) {
	this.x = e ?? 0, this.y = t ?? 0, this.z = r ?? 0, this.w = n ?? 0;
}
wn.supportsBasis = function(e) {
	return wn.supportsWebAssembly() && e.context.supportsBasis;
}, wn.supportsFullscreen = function() {
	return Kr.supportsFullscreen();
}, wn.supportsTypedArrays = function() {
	return "undefined" != typeof ArrayBuffer;
}, wn.supportsBigInt64Array = function() {
	return "undefined" != typeof BigInt64Array;
}, wn.supportsBigUint64Array = function() {
	return "undefined" != typeof BigUint64Array;
}, wn.supportsBigInt = function() {
	return "undefined" != typeof BigInt;
}, wn.supportsWebWorkers = function() {
	return "undefined" != typeof Worker;
}, wn.supportsWebAssembly = function() {
	return "undefined" != typeof WebAssembly;
}, wn.supportsWebgl2 = function(e) {
	return P.defined("scene", e), e.context.webgl2;
}, wn.supportsEsmWebWorkers = function() {
	return !En() || parseInt(un) >= 114;
};
let xn = new Y();
An.fromAxisAngle = function(e, t, r) {
	P.typeOf.object("axis", e), P.typeOf.number("angle", t);
	const n = t / 2, i = Math.sin(n);
	xn = Y.normalize(e, xn);
	const o = xn.x * i, a = xn.y * i, s = xn.z * i, u = Math.cos(n);
	return N(r) ? (r.x = o, r.y = a, r.z = s, r.w = u, r) : new An(o, a, s, u);
};
const Rn = [
	1,
	2,
	0
], Sn = new Array(3);
An.fromRotationMatrix = function(e, t) {
	let r, n, i, o, a;
	P.typeOf.object("matrix", e);
	const s = e[Er.COLUMN0ROW0], u = e[Er.COLUMN1ROW1], c = e[Er.COLUMN2ROW2], l = s + u + c;
	if (l > 0) r = Math.sqrt(l + 1), a = .5 * r, r = .5 / r, n = (e[Er.COLUMN1ROW2] - e[Er.COLUMN2ROW1]) * r, i = (e[Er.COLUMN2ROW0] - e[Er.COLUMN0ROW2]) * r, o = (e[Er.COLUMN0ROW1] - e[Er.COLUMN1ROW0]) * r;
	else {
		const t = Rn;
		let l = 0;
		u > s && (l = 1), c > s && c > u && (l = 2);
		const f = t[l], h = t[f];
		r = Math.sqrt(e[Er.getElementIndex(l, l)] - e[Er.getElementIndex(f, f)] - e[Er.getElementIndex(h, h)] + 1);
		const p = Sn;
		p[l] = .5 * r, r = .5 / r, a = (e[Er.getElementIndex(h, f)] - e[Er.getElementIndex(f, h)]) * r, p[f] = (e[Er.getElementIndex(f, l)] + e[Er.getElementIndex(l, f)]) * r, p[h] = (e[Er.getElementIndex(h, l)] + e[Er.getElementIndex(l, h)]) * r, n = -p[0], i = -p[1], o = -p[2];
	}
	return N(t) ? (t.x = n, t.y = i, t.z = o, t.w = a, t) : new An(n, i, o, a);
};
const In = new An();
let Cn = new An(), Nn = new An(), vn = new An();
An.fromHeadingPitchRoll = function(e, t) {
	return P.typeOf.object("headingPitchRoll", e), vn = An.fromAxisAngle(Y.UNIT_X, e.roll, In), Nn = An.fromAxisAngle(Y.UNIT_Y, -e.pitch, t), t = An.multiply(Nn, vn, Nn), Cn = An.fromAxisAngle(Y.UNIT_Z, -e.heading, In), An.multiply(Cn, t, t);
};
const Pn = new Y(), Mn = new Y(), Ln = new An(), Fn = new An(), Dn = new An();
An.packedLength = 4, An.pack = function(e, t, r) {
	return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, t[r++] = e.x, t[r++] = e.y, t[r++] = e.z, t[r] = e.w, t;
}, An.unpack = function(e, t, r) {
	return P.defined("array", e), t = t ?? 0, N(r) || (r = new An()), r.x = e[t], r.y = e[t + 1], r.z = e[t + 2], r.w = e[t + 3], r;
}, An.packedInterpolationLength = 3, An.convertPackedArrayForInterpolation = function(e, t, r, n) {
	An.unpack(e, 4 * r, Dn), An.conjugate(Dn, Dn);
	for (let i = 0, o = r - t + 1; i < o; i++) {
		const r = 3 * i;
		An.unpack(e, 4 * (t + i), Ln), An.multiply(Ln, Dn, Ln), Ln.w < 0 && An.negate(Ln, Ln), An.computeAxis(Ln, Pn);
		const o = An.computeAngle(Ln);
		N(n) || (n = []), n[r] = Pn.x * o, n[r + 1] = Pn.y * o, n[r + 2] = Pn.z * o;
	}
}, An.unpackInterpolationResult = function(e, t, r, n, i) {
	N(i) || (i = new An()), Y.fromArray(e, 0, Mn);
	const o = Y.magnitude(Mn);
	return An.unpack(t, 4 * n, Fn), 0 === o ? An.clone(An.IDENTITY, Ln) : An.fromAxisAngle(Mn, o, Ln), An.multiply(Ln, Fn, i);
}, An.clone = function(e, t) {
	if (N(e)) return N(t) ? (t.x = e.x, t.y = e.y, t.z = e.z, t.w = e.w, t) : new An(e.x, e.y, e.z, e.w);
}, An.conjugate = function(e, t) {
	return P.typeOf.object("quaternion", e), P.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = e.w, t;
}, An.magnitudeSquared = function(e) {
	return P.typeOf.object("quaternion", e), e.x * e.x + e.y * e.y + e.z * e.z + e.w * e.w;
}, An.magnitude = function(e) {
	return Math.sqrt(An.magnitudeSquared(e));
}, An.normalize = function(e, t) {
	P.typeOf.object("result", t);
	const r = 1 / An.magnitude(e), n = e.x * r, i = e.y * r, o = e.z * r, a = e.w * r;
	return t.x = n, t.y = i, t.z = o, t.w = a, t;
}, An.inverse = function(e, t) {
	P.typeOf.object("result", t);
	const r = An.magnitudeSquared(e);
	return t = An.conjugate(e, t), An.multiplyByScalar(t, 1 / r, t);
}, An.add = function(e, t, r) {
	return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x + t.x, r.y = e.y + t.y, r.z = e.z + t.z, r.w = e.w + t.w, r;
}, An.subtract = function(e, t, r) {
	return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.x = e.x - t.x, r.y = e.y - t.y, r.z = e.z - t.z, r.w = e.w - t.w, r;
}, An.negate = function(e, t) {
	return P.typeOf.object("quaternion", e), P.typeOf.object("result", t), t.x = -e.x, t.y = -e.y, t.z = -e.z, t.w = -e.w, t;
}, An.dot = function(e, t) {
	return P.typeOf.object("left", e), P.typeOf.object("right", t), e.x * t.x + e.y * t.y + e.z * t.z + e.w * t.w;
}, An.multiply = function(e, t, r) {
	P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r);
	const n = e.x, i = e.y, o = e.z, a = e.w, s = t.x, u = t.y, c = t.z, l = t.w, f = a * s + n * l + i * c - o * u, h = a * u - n * c + i * l + o * s, p = a * c + n * u - i * s + o * l, m = a * l - n * s - i * u - o * c;
	return r.x = f, r.y = h, r.z = p, r.w = m, r;
}, An.multiplyByScalar = function(e, t, r) {
	return P.typeOf.object("quaternion", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r.x = e.x * t, r.y = e.y * t, r.z = e.z * t, r.w = e.w * t, r;
}, An.divideByScalar = function(e, t, r) {
	return P.typeOf.object("quaternion", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r.x = e.x / t, r.y = e.y / t, r.z = e.z / t, r.w = e.w / t, r;
}, An.computeAxis = function(e, t) {
	P.typeOf.object("quaternion", e), P.typeOf.object("result", t);
	const r = e.w;
	if (Math.abs(r - 1) < B.EPSILON6 || Math.abs(r + 1) < B.EPSILON6) return t.x = 1, t.y = t.z = 0, t;
	const n = 1 / Math.sqrt(1 - r * r);
	return t.x = e.x * n, t.y = e.y * n, t.z = e.z * n, t;
}, An.computeAngle = function(e) {
	return P.typeOf.object("quaternion", e), Math.abs(e.w - 1) < B.EPSILON6 ? 0 : 2 * Math.acos(e.w);
};
let zn = new An();
An.lerp = function(e, t, r, n) {
	return P.typeOf.object("start", e), P.typeOf.object("end", t), P.typeOf.number("t", r), P.typeOf.object("result", n), zn = An.multiplyByScalar(t, r, zn), n = An.multiplyByScalar(e, 1 - r, n), An.add(zn, n, n);
};
let Bn = new An(), Un = new An(), jn = new An();
An.slerp = function(e, t, r, n) {
	P.typeOf.object("start", e), P.typeOf.object("end", t), P.typeOf.number("t", r), P.typeOf.object("result", n);
	let i = An.dot(e, t), o = t;
	if (i < 0 && (i = -i, o = Bn = An.negate(t, Bn)), 1 - i < B.EPSILON6) return An.lerp(e, o, r, n);
	const a = Math.acos(i);
	return Un = An.multiplyByScalar(e, Math.sin((1 - r) * a), Un), jn = An.multiplyByScalar(o, Math.sin(r * a), jn), n = An.add(Un, jn, n), An.multiplyByScalar(n, 1 / Math.sin(a), n);
}, An.log = function(e, t) {
	P.typeOf.object("quaternion", e), P.typeOf.object("result", t);
	const r = B.acosClamped(e.w);
	let n = 0;
	return 0 !== r && (n = r / Math.sin(r)), Y.multiplyByScalar(e, n, t);
}, An.exp = function(e, t) {
	P.typeOf.object("cartesian", e), P.typeOf.object("result", t);
	const r = Y.magnitude(e);
	let n = 0;
	return 0 !== r && (n = Math.sin(r) / r), t.x = e.x * n, t.y = e.y * n, t.z = e.z * n, t.w = Math.cos(r), t;
};
const qn = new Y(), Gn = new Y(), Wn = new An(), kn = new An();
An.computeInnerQuadrangle = function(e, t, r, n) {
	P.typeOf.object("q0", e), P.typeOf.object("q1", t), P.typeOf.object("q2", r), P.typeOf.object("result", n);
	const i = An.conjugate(t, Wn);
	An.multiply(i, r, kn);
	const o = An.log(kn, qn);
	An.multiply(i, e, kn);
	const a = An.log(kn, Gn);
	return Y.add(o, a, o), Y.multiplyByScalar(o, .25, o), Y.negate(o, o), An.exp(o, Wn), An.multiply(t, Wn, n);
}, An.squad = function(e, t, r, n, i, o) {
	P.typeOf.object("q0", e), P.typeOf.object("q1", t), P.typeOf.object("s0", r), P.typeOf.object("s1", n), P.typeOf.number("t", i), P.typeOf.object("result", o);
	const a = An.slerp(e, t, i, Wn), s = An.slerp(r, n, i, kn);
	return An.slerp(a, s, 2 * i * (1 - i), o);
};
const Vn = new An(), Hn = 1.9011074535173003, Yn = wn.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Xn = wn.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], $n = wn.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [], Kn = wn.supportsTypedArrays() ? /* @__PURE__ */ new Float32Array(8) : [];
for (let wl = 0; wl < 7; ++wl) {
	const e = wl + 1, t = 2 * e + 1;
	Yn[wl] = 1 / (e * t), Xn[wl] = e / t;
}
Yn[7] = Hn / 136, Xn[7] = 8 * Hn / 17, An.fastSlerp = function(e, t, r, n) {
	P.typeOf.object("start", e), P.typeOf.object("end", t), P.typeOf.number("t", r), P.typeOf.object("result", n);
	let i, o = An.dot(e, t);
	o >= 0 ? i = 1 : (i = -1, o = -o);
	const a = o - 1, s = 1 - r, u = r * r, c = s * s;
	for (let p = 7; p >= 0; --p) $n[p] = (Yn[p] * u - Xn[p]) * a, Kn[p] = (Yn[p] * c - Xn[p]) * a;
	const l = i * r * (1 + $n[0] * (1 + $n[1] * (1 + $n[2] * (1 + $n[3] * (1 + $n[4] * (1 + $n[5] * (1 + $n[6] * (1 + $n[7])))))))), f = s * (1 + Kn[0] * (1 + Kn[1] * (1 + Kn[2] * (1 + Kn[3] * (1 + Kn[4] * (1 + Kn[5] * (1 + Kn[6] * (1 + Kn[7])))))))), h = An.multiplyByScalar(e, f, Vn);
	return An.multiplyByScalar(t, l, n), An.add(h, n, n);
}, An.fastSquad = function(e, t, r, n, i, o) {
	P.typeOf.object("q0", e), P.typeOf.object("q1", t), P.typeOf.object("s0", r), P.typeOf.object("s1", n), P.typeOf.number("t", i), P.typeOf.object("result", o);
	const a = An.fastSlerp(e, t, i, Wn), s = An.fastSlerp(r, n, i, kn);
	return An.fastSlerp(a, s, 2 * i * (1 - i), o);
}, An.equals = function(e, t) {
	return e === t || N(e) && N(t) && e.x === t.x && e.y === t.y && e.z === t.z && e.w === t.w;
}, An.equalsEpsilon = function(e, t, r) {
	return r = r ?? 0, e === t || N(e) && N(t) && Math.abs(e.x - t.x) <= r && Math.abs(e.y - t.y) <= r && Math.abs(e.z - t.z) <= r && Math.abs(e.w - t.w) <= r;
}, An.ZERO = Object.freeze(new An(0, 0, 0, 0)), An.IDENTITY = Object.freeze(new An(0, 0, 0, 1)), An.prototype.clone = function(e) {
	return An.clone(this, e);
}, An.prototype.equals = function(e) {
	return An.equals(this, e);
}, An.prototype.equalsEpsilon = function(e, t) {
	return An.equalsEpsilon(this, e, t);
}, An.prototype.toString = function() {
	return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
};
const Zn = {}, Qn = {
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
}, Jn = {
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
}, ei = {}, ti = {
	east: new Y(),
	north: new Y(),
	up: new Y(),
	west: new Y(),
	south: new Y(),
	down: new Y()
};
let ri = new Y(), ni = new Y(), ii = new Y();
Zn.localFrameToFixedFrameGenerator = function(e, t) {
	if (!Qn.hasOwnProperty(e) || !Qn[e].hasOwnProperty(t)) throw new v("firstAxis and secondAxis must be east, north, up, west, south or down.");
	const r = Qn[e][t];
	let n;
	const i = e + t;
	return N(ei[i]) ? n = ei[i] : (n = function(n, i, o) {
		if (!N(n)) throw new v("origin is required.");
		if (isNaN(n.x) || isNaN(n.y) || isNaN(n.z)) throw new v("origin has a NaN component");
		if (N(o) || (o = new Mr()), Y.equalsEpsilon(n, Y.ZERO, B.EPSILON14)) Y.unpack(Jn[e], 0, ri), Y.unpack(Jn[t], 0, ni), Y.unpack(Jn[r], 0, ii);
		else if (B.equalsEpsilon(n.x, 0, B.EPSILON14) && B.equalsEpsilon(n.y, 0, B.EPSILON14)) {
			const i = B.sign(n.z);
			Y.unpack(Jn[e], 0, ri), "east" !== e && "west" !== e && Y.multiplyByScalar(ri, i, ri), Y.unpack(Jn[t], 0, ni), "east" !== t && "west" !== t && Y.multiplyByScalar(ni, i, ni), Y.unpack(Jn[r], 0, ii), "east" !== r && "west" !== r && Y.multiplyByScalar(ii, i, ii);
		} else {
			(i = i ?? ce.default).geodeticSurfaceNormal(n, ti.up);
			const o = ti.up, a = ti.east;
			a.x = -n.y, a.y = n.x, a.z = 0, Y.normalize(a, ti.east), Y.cross(o, a, ti.north), Y.multiplyByScalar(ti.up, -1, ti.down), Y.multiplyByScalar(ti.east, -1, ti.west), Y.multiplyByScalar(ti.north, -1, ti.south), ri = ti[e], ni = ti[t], ii = ti[r];
		}
		return o[0] = ri.x, o[1] = ri.y, o[2] = ri.z, o[3] = 0, o[4] = ni.x, o[5] = ni.y, o[6] = ni.z, o[7] = 0, o[8] = ii.x, o[9] = ii.y, o[10] = ii.z, o[11] = 0, o[12] = n.x, o[13] = n.y, o[14] = n.z, o[15] = 1, o;
	}, ei[i] = n), n;
}, Zn.eastNorthUpToFixedFrame = Zn.localFrameToFixedFrameGenerator("east", "north"), Zn.northEastDownToFixedFrame = Zn.localFrameToFixedFrameGenerator("north", "east"), Zn.northUpEastToFixedFrame = Zn.localFrameToFixedFrameGenerator("north", "up"), Zn.northWestUpToFixedFrame = Zn.localFrameToFixedFrameGenerator("north", "west");
const oi = new An(), ai = new Y(1, 1, 1), si = new Mr();
Zn.headingPitchRollToFixedFrame = function(e, t, r, n, i) {
	P.typeOf.object("HeadingPitchRoll", t), n = n ?? Zn.eastNorthUpToFixedFrame;
	const o = An.fromHeadingPitchRoll(t, oi), a = Mr.fromTranslationQuaternionRotationScale(Y.ZERO, o, ai, si);
	return i = n(e, r, i), Mr.multiply(i, a, i);
};
const ui = new Mr(), ci = new Er();
Zn.headingPitchRollQuaternion = function(e, t, r, n, i) {
	P.typeOf.object("HeadingPitchRoll", t);
	const o = Zn.headingPitchRollToFixedFrame(e, t, r, n, ui), a = Mr.getMatrix3(o, ci);
	return An.fromRotationMatrix(a, i);
};
const li = new Y(1, 1, 1), fi = new Y(), hi = new Mr(), pi = new Mr(), mi = new Er(), di = new An();
Zn.fixedFrameToHeadingPitchRoll = function(e, t, r, n) {
	P.defined("transform", e), t = t ?? ce.default, r = r ?? Zn.eastNorthUpToFixedFrame, N(n) || (n = new ir());
	const i = Mr.getTranslation(e, fi);
	if (Y.equals(i, Y.ZERO)) return n.heading = 0, n.pitch = 0, n.roll = 0, n;
	let o = Mr.inverseTransformation(r(i, t, hi), hi), a = Mr.setScale(e, li, pi);
	a = Mr.setTranslation(a, Y.ZERO, a), o = Mr.multiply(o, a, o);
	let s = An.fromRotationMatrix(Mr.getMatrix3(o, mi), di);
	return s = An.normalize(s, s), ir.fromQuaternion(s, n);
};
const yi = B.TWO_PI / 86400;
let _i = new tt();
Zn.computeIcrfToCentralBodyFixedMatrix = function(e, t) {
	let r = Zn.computeIcrfToFixedMatrix(e, t);
	return N(r) || (r = Zn.computeTemeToPseudoFixedMatrix(e, t)), r;
}, Zn.computeTemeToPseudoFixedMatrix = function(e, t) {
	if (!N(e)) throw new v("date is required.");
	_i = tt.addSeconds(e, -tt.computeTaiMinusUtc(e), _i);
	const r = _i.dayNumber, n = _i.secondsOfDay;
	let i;
	const o = r - 2451545;
	i = n >= 43200 ? (o + .5) / Fe.DAYS_PER_JULIAN_CENTURY : (o - .5) / Fe.DAYS_PER_JULIAN_CENTURY;
	const a = (24110.54841 + i * (8640184.812866 + i * (.093104 + -62e-7 * i))) * yi % B.TWO_PI + (n + .5 * Fe.SECONDS_PER_DAY) % Fe.SECONDS_PER_DAY * (72921158553e-15 + 11772758384668e-32 * (r - 2451545.5)), s = Math.cos(a), u = Math.sin(a);
	return N(t) ? (t[0] = s, t[1] = -u, t[2] = 0, t[3] = u, t[4] = s, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t) : new Er(s, u, 0, -u, s, 0, 0, 0, 1);
}, Zn.iau2006XysData = new dr(), Zn.earthOrientationParameters = Qt.NONE;
const gi = 32.184;
Zn.preloadIcrfFixed = function(e) {
	const t = e.start.dayNumber, r = e.start.secondsOfDay + gi, n = e.stop.dayNumber, i = e.stop.secondsOfDay + gi;
	return Zn.iau2006XysData.preload(t, r, n, i);
}, Zn.computeIcrfToFixedMatrix = function(e, t) {
	if (!N(e)) throw new v("date is required.");
	N(t) || (t = new Er());
	const r = Zn.computeFixedToIcrfMatrix(e, t);
	if (N(r)) return Er.transpose(r, t);
};
const Ei = new ir(), bi = new Er(), Ti = new tt();
Zn.computeMoonFixedToIcrfMatrix = function(e, t) {
	if (!N(e)) throw new v("date is required.");
	N(t) || (t = new Er());
	const r = tt.addSeconds(e, 32.184, Ti), n = tt.totalDays(r) - 2451545, i = B.toRadians(12.112) - B.toRadians(.052992) * n, o = B.toRadians(24.224) - B.toRadians(.105984) * n, a = B.toRadians(227.645) + B.toRadians(13.012) * n, s = B.toRadians(261.105) + B.toRadians(13.340716) * n, u = B.toRadians(358) + B.toRadians(.9856) * n;
	return Ei.pitch = B.toRadians(180) - B.toRadians(3.878) * Math.sin(i) - B.toRadians(.12) * Math.sin(o) + B.toRadians(.07) * Math.sin(a) - B.toRadians(.017) * Math.sin(s), Ei.roll = B.toRadians(-23.47) + B.toRadians(1.543) * Math.cos(i) + B.toRadians(.24) * Math.cos(o) - B.toRadians(.028) * Math.cos(a) + B.toRadians(.007) * Math.cos(s), Ei.heading = B.toRadians(154.375) + B.toRadians(13.17635831) * n + B.toRadians(3.558) * Math.sin(i) + B.toRadians(.121) * Math.sin(o) - B.toRadians(.064) * Math.sin(a) + B.toRadians(.016) * Math.sin(s) + B.toRadians(.025) * Math.sin(u), Er.fromHeadingPitchRoll(Ei, bi);
}, Zn.computeIcrfToMoonFixedMatrix = function(e, t) {
	if (!N(e)) throw new v("date is required.");
	N(t) || (t = new Er());
	const r = Zn.computeMoonFixedToIcrfMatrix(e, t);
	if (N(r)) return Er.transpose(r, t);
};
const Oi = new mr(0, 0, 0), wi = new Ne(0, 0, 0, 0, 0, 0), Ai = new Er(), xi = new Er();
Zn.computeFixedToIcrfMatrix = function(e, t) {
	if (!N(e)) throw new v("date is required.");
	N(t) || (t = new Er());
	const r = Zn.earthOrientationParameters.compute(e, wi);
	if (!N(r)) return;
	const n = e.dayNumber, i = e.secondsOfDay + gi, o = Zn.iau2006XysData.computeXysRadians(n, i, Oi);
	if (!N(o)) return;
	const a = o.x + r.xPoleOffset, s = o.y + r.yPoleOffset, u = 1 / (1 + Math.sqrt(1 - a * a - s * s)), c = Ai;
	c[0] = 1 - u * a * a, c[3] = -u * a * s, c[6] = a, c[1] = -u * a * s, c[4] = 1 - u * s * s, c[7] = s, c[2] = -a, c[5] = -s, c[8] = 1 - u * (a * a + s * s);
	const l = Er.fromRotationZ(-o.s, xi), f = Er.multiply(c, l, Ai), h = e.dayNumber, p = (e.secondsOfDay - tt.computeTaiMinusUtc(e) + r.ut1MinusUtc) / Fe.SECONDS_PER_DAY;
	let m = .779057273264 + p + .00273781191135448 * (h - 2451545 + p);
	m = m % 1 * B.TWO_PI;
	const d = Er.fromRotationZ(m, xi), y = Er.multiply(f, d, Ai), _ = Math.cos(r.xPoleWander), g = Math.cos(r.yPoleWander), E = Math.sin(r.xPoleWander), b = Math.sin(r.yPoleWander);
	let T = n - 2451545 + i / Fe.SECONDS_PER_DAY;
	T /= 36525;
	const O = -47e-6 * T * B.RADIANS_PER_DEGREE / 3600, w = Math.cos(O), A = Math.sin(O), x = xi;
	return x[0] = _ * w, x[1] = _ * A, x[2] = E, x[3] = -g * A + b * E * w, x[4] = g * w + b * E * A, x[5] = -b * _, x[6] = -b * A - g * E * w, x[7] = b * w - g * E * A, x[8] = g * _, Er.multiply(y, x, t);
};
const Ri = new Te();
Zn.pointToWindowCoordinates = function(e, t, r, n) {
	return (n = Zn.pointToGLWindowCoordinates(e, t, r, n)).y = 2 * t[5] - n.y, n;
}, Zn.pointToGLWindowCoordinates = function(e, t, r, n) {
	if (!N(e)) throw new v("modelViewProjectionMatrix is required.");
	if (!N(t)) throw new v("viewportTransformation is required.");
	if (!N(r)) throw new v("point is required.");
	N(n) || (n = new q());
	const i = Ri;
	return Mr.multiplyByVector(e, Te.fromElements(r.x, r.y, r.z, 1, i), i), Te.multiplyByScalar(i, 1 / i.w, i), Mr.multiplyByVector(t, i, i), q.fromCartesian4(i, n);
};
const Si = new Y(), Ii = new Y(), Ci = new Y();
Zn.rotationMatrixFromPositionVelocity = function(e, t, r, n) {
	if (!N(e)) throw new v("position is required.");
	if (!N(t)) throw new v("velocity is required.");
	const i = (r ?? ce.default).geodeticSurfaceNormal(e, Si);
	let o = Y.cross(t, i, Ii);
	Y.equalsEpsilon(o, Y.ZERO, B.EPSILON6) && (o = Y.clone(Y.UNIT_X, o));
	const a = Y.cross(o, t, Ci);
	return Y.normalize(a, a), Y.cross(t, a, o), Y.negate(o, o), Y.normalize(o, o), N(n) || (n = new Er()), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = o.x, n[4] = o.y, n[5] = o.z, n[6] = a.x, n[7] = a.y, n[8] = a.z, n;
}, Zn.SWIZZLE_3D_TO_2D_MATRIX = Object.freeze(new Mr(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
const Ni = new ie(), vi = new Y(), Pi = new Y(), Mi = new Er(), Li = new Mr(), Fi = new Mr();
Zn.basisTo2D = function(e, t, r) {
	if (!N(e)) throw new v("projection is required.");
	if (!N(t)) throw new v("matrix is required.");
	if (!N(r)) throw new v("result is required.");
	const n = Mr.getTranslation(t, Pi), i = e.ellipsoid;
	let o;
	if (Y.equals(n, Y.ZERO)) o = Y.clone(Y.ZERO, vi);
	else {
		const t = i.cartesianToCartographic(n, Ni);
		o = e.project(t, vi), Y.fromElements(o.z, o.x, o.y, o);
	}
	const a = Zn.eastNorthUpToFixedFrame(n, i, Li), s = Mr.inverseTransformation(a, Fi), u = Mr.getMatrix3(t, Mi), c = Mr.multiplyByMatrix3(s, u, r);
	return Mr.multiply(Zn.SWIZZLE_3D_TO_2D_MATRIX, c, r), Mr.setTranslation(r, o, r), r;
}, Zn.ellipsoidTo2DModelMatrix = function(e, t, r) {
	if (!N(e)) throw new v("projection is required.");
	if (!N(t)) throw new v("center is required.");
	if (!N(r)) throw new v("result is required.");
	const n = e.ellipsoid, i = Zn.eastNorthUpToFixedFrame(t, n, Li), o = Mr.inverseTransformation(i, Fi), a = n.cartesianToCartographic(t, Ni), s = e.project(a, vi);
	Y.fromElements(s.z, s.x, s.y, s);
	const u = Mr.fromTranslation(s, Li);
	return Mr.multiply(Zn.SWIZZLE_3D_TO_2D_MATRIX, o, r), Mr.multiply(u, r, r), r;
};
var Di = class e {
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
		return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, t[r++] = e.west, t[r++] = e.south, t[r++] = e.east, t[r] = e.north, t;
	}
	static unpack(t, r, n) {
		return P.defined("array", t), r = r ?? 0, N(n) || (n = new e()), n.west = t[r++], n.south = t[r++], n.east = t[r++], n.north = t[r], n;
	}
	static computeWidth(e) {
		P.typeOf.object("rectangle", e);
		let t = e.east;
		const r = e.west;
		return t < r && (t += B.TWO_PI), t - r;
	}
	static computeHeight(e) {
		return P.typeOf.object("rectangle", e), e.north - e.south;
	}
	static fromDegrees(t, r, n, i, o) {
		return t = B.toRadians(t ?? 0), r = B.toRadians(r ?? 0), n = B.toRadians(n ?? 0), i = B.toRadians(i ?? 0), N(o) ? (o.west = t, o.south = r, o.east = n, o.north = i, o) : new e(t, r, n, i);
	}
	static fromRadians(t, r, n, i, o) {
		return N(o) ? (o.west = t ?? 0, o.south = r ?? 0, o.east = n ?? 0, o.north = i ?? 0, o) : new e(t, r, n, i);
	}
	static fromCartographicArray(t, r) {
		P.defined("cartographics", t);
		let n = Number.MAX_VALUE, i = -Number.MAX_VALUE, o = Number.MAX_VALUE, a = -Number.MAX_VALUE, s = Number.MAX_VALUE, u = -Number.MAX_VALUE;
		for (let e = 0, c = t.length; e < c; e++) {
			const r = t[e];
			n = Math.min(n, r.longitude), i = Math.max(i, r.longitude), s = Math.min(s, r.latitude), u = Math.max(u, r.latitude);
			const c = r.longitude >= 0 ? r.longitude : r.longitude + B.TWO_PI;
			o = Math.min(o, c), a = Math.max(a, c);
		}
		return i - n > a - o && (n = o, i = a, i > B.PI && (i -= B.TWO_PI), n > B.PI && (n -= B.TWO_PI)), N(r) ? (r.west = n, r.south = s, r.east = i, r.north = u, r) : new e(n, s, i, u);
	}
	static fromCartesianArray(t, r, n) {
		P.defined("cartesians", t), r = r ?? ce.default;
		let i = Number.MAX_VALUE, o = -Number.MAX_VALUE, a = Number.MAX_VALUE, s = -Number.MAX_VALUE, u = Number.MAX_VALUE, c = -Number.MAX_VALUE;
		for (let e = 0, l = t.length; e < l; e++) {
			const n = r.cartesianToCartographic(t[e]);
			i = Math.min(i, n.longitude), o = Math.max(o, n.longitude), u = Math.min(u, n.latitude), c = Math.max(c, n.latitude);
			const l = n.longitude >= 0 ? n.longitude : n.longitude + B.TWO_PI;
			a = Math.min(a, l), s = Math.max(s, l);
		}
		return o - i > s - a && (i = a, o = s, o > B.PI && (o -= B.TWO_PI), i > B.PI && (i -= B.TWO_PI)), N(n) ? (n.west = i, n.south = u, n.east = o, n.north = c, n) : new e(i, u, o, c);
	}
	static fromBoundingSphere(t, r, n) {
		P.typeOf.object("boundingSphere", t);
		const i = t.center, o = t.radius;
		if (N(r) || (r = ce.default), N(n) || (n = new e()), Y.equals(i, Y.ZERO)) return e.clone(e.MAX_VALUE, n), n;
		const a = Zn.eastNorthUpToFixedFrame(i, r, zi), s = Mr.multiplyByPointAsVector(a, Y.UNIT_X, Bi);
		Y.normalize(s, s);
		const u = Mr.multiplyByPointAsVector(a, Y.UNIT_Y, Ui);
		Y.normalize(u, u), Y.multiplyByScalar(u, o, u), Y.multiplyByScalar(s, o, s);
		const c = Y.negate(u, qi), l = Y.negate(s, ji), f = Gi;
		let h = f[0];
		return Y.add(i, u, h), h = f[1], Y.add(i, l, h), h = f[2], Y.add(i, c, h), h = f[3], Y.add(i, s, h), f[4] = i, e.fromCartesianArray(f, r, n);
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r.west = t.west, r.south = t.south, r.east = t.east, r.north = t.north, r) : new e(t.west, t.south, t.east, t.north);
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || N(e) && N(t) && Math.abs(e.west - t.west) <= r && Math.abs(e.south - t.south) <= r && Math.abs(e.east - t.east) <= r && Math.abs(e.north - t.north) <= r;
	}
	clone(t) {
		return e.clone(this, t);
	}
	equals(t) {
		return e.equals(this, t);
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && e.west === t.west && e.south === t.south && e.east === t.east && e.north === t.north;
	}
	equalsEpsilon(t, r) {
		return e.equalsEpsilon(this, t, r);
	}
	static _validate(e) {
		P.typeOf.object("rectangle", e);
		const t = e.north;
		P.typeOf.number.greaterThanOrEquals("north", t, -B.PI_OVER_TWO), P.typeOf.number.lessThanOrEquals("north", t, B.PI_OVER_TWO);
		const r = e.south;
		P.typeOf.number.greaterThanOrEquals("south", r, -B.PI_OVER_TWO), P.typeOf.number.lessThanOrEquals("south", r, B.PI_OVER_TWO);
		const n = e.west;
		P.typeOf.number.greaterThanOrEquals("west", n, -Math.PI), P.typeOf.number.lessThanOrEquals("west", n, Math.PI);
		const i = e.east;
		P.typeOf.number.greaterThanOrEquals("east", i, -Math.PI), P.typeOf.number.lessThanOrEquals("east", i, Math.PI);
	}
	static southwest(e, t) {
		return P.typeOf.object("rectangle", e), N(t) ? (t.longitude = e.west, t.latitude = e.south, t.height = 0, t) : new ie(e.west, e.south);
	}
	static northwest(e, t) {
		return P.typeOf.object("rectangle", e), N(t) ? (t.longitude = e.west, t.latitude = e.north, t.height = 0, t) : new ie(e.west, e.north);
	}
	static northeast(e, t) {
		return P.typeOf.object("rectangle", e), N(t) ? (t.longitude = e.east, t.latitude = e.north, t.height = 0, t) : new ie(e.east, e.north);
	}
	static southeast(e, t) {
		return P.typeOf.object("rectangle", e), N(t) ? (t.longitude = e.east, t.latitude = e.south, t.height = 0, t) : new ie(e.east, e.south);
	}
	static center(e, t) {
		P.typeOf.object("rectangle", e);
		let r = e.east;
		const n = e.west;
		r < n && (r += B.TWO_PI);
		const i = B.negativePiToPi(.5 * (n + r)), o = .5 * (e.south + e.north);
		return N(t) ? (t.longitude = i, t.latitude = o, t.height = 0, t) : new ie(i, o);
	}
	static intersection(t, r, n) {
		P.typeOf.object("rectangle", t), P.typeOf.object("otherRectangle", r);
		let i = t.east, o = t.west, a = r.east, s = r.west;
		i < o && a > 0 ? i += B.TWO_PI : a < s && i > 0 && (a += B.TWO_PI), i < o && s < 0 ? s += B.TWO_PI : a < s && o < 0 && (o += B.TWO_PI);
		const u = B.negativePiToPi(Math.max(o, s)), c = B.negativePiToPi(Math.min(i, a));
		if ((t.west < t.east || r.west < r.east) && c <= u) return;
		const l = Math.max(t.south, r.south), f = Math.min(t.north, r.north);
		return l >= f ? void 0 : N(n) ? (n.west = u, n.south = l, n.east = c, n.north = f, n) : new e(u, l, c, f);
	}
	static simpleIntersection(t, r, n) {
		P.typeOf.object("rectangle", t), P.typeOf.object("otherRectangle", r);
		const i = Math.max(t.west, r.west), o = Math.max(t.south, r.south), a = Math.min(t.east, r.east), s = Math.min(t.north, r.north);
		if (!(o >= s || i >= a)) return N(n) ? (n.west = i, n.south = o, n.east = a, n.north = s, n) : new e(i, o, a, s);
	}
	static union(t, r, n) {
		P.typeOf.object("rectangle", t), P.typeOf.object("otherRectangle", r), N(n) || (n = new e());
		let i = t.east, o = t.west, a = r.east, s = r.west;
		i < o && a > 0 ? i += B.TWO_PI : a < s && i > 0 && (a += B.TWO_PI), i < o && s < 0 ? s += B.TWO_PI : a < s && o < 0 && (o += B.TWO_PI);
		const u = B.negativePiToPi(Math.min(o, s)), c = B.negativePiToPi(Math.max(i, a));
		return n.west = u, n.south = Math.min(t.south, r.south), n.east = c, n.north = Math.max(t.north, r.north), n;
	}
	static expand(t, r, n) {
		return P.typeOf.object("rectangle", t), P.typeOf.object("cartographic", r), N(n) || (n = new e()), n.west = Math.min(t.west, r.longitude), n.south = Math.min(t.south, r.latitude), n.east = Math.max(t.east, r.longitude), n.north = Math.max(t.north, r.latitude), n;
	}
	static contains(e, t) {
		P.typeOf.object("rectangle", e), P.typeOf.object("cartographic", t);
		let r = t.longitude;
		const n = t.latitude, i = e.west;
		let o = e.east;
		return o < i && (o += B.TWO_PI, r < 0 && (r += B.TWO_PI)), (r > i || B.equalsEpsilon(r, i, B.EPSILON14)) && (r < o || B.equalsEpsilon(r, o, B.EPSILON14)) && n >= e.south && n <= e.north;
	}
	static subsample(t, r, n, i) {
		P.typeOf.object("rectangle", t), r = r ?? ce.default, n = n ?? 0, N(i) || (i = []);
		let o = 0;
		const a = t.north, s = t.south, u = t.east, c = t.west, l = Wi;
		l.height = n, l.longitude = c, l.latitude = a, i[o] = r.cartographicToCartesian(l, i[o]), o++, l.longitude = u, i[o] = r.cartographicToCartesian(l, i[o]), o++, l.latitude = s, i[o] = r.cartographicToCartesian(l, i[o]), o++, l.longitude = c, i[o] = r.cartographicToCartesian(l, i[o]), o++, l.latitude = a < 0 ? a : s > 0 ? s : 0;
		for (let f = 1; f < 8; ++f) l.longitude = -Math.PI + f * B.PI_OVER_TWO, e.contains(t, l) && (i[o] = r.cartographicToCartesian(l, i[o]), o++);
		return 0 === l.latitude && (l.longitude = c, i[o] = r.cartographicToCartesian(l, i[o]), o++, l.longitude = u, i[o] = r.cartographicToCartesian(l, i[o]), o++), i.length = o, i;
	}
	static subsection(t, r, n, i, o, a) {
		if (P.typeOf.object("rectangle", t), P.typeOf.number.greaterThanOrEquals("westLerp", r, 0), P.typeOf.number.lessThanOrEquals("westLerp", r, 1), P.typeOf.number.greaterThanOrEquals("southLerp", n, 0), P.typeOf.number.lessThanOrEquals("southLerp", n, 1), P.typeOf.number.greaterThanOrEquals("eastLerp", i, 0), P.typeOf.number.lessThanOrEquals("eastLerp", i, 1), P.typeOf.number.greaterThanOrEquals("northLerp", o, 0), P.typeOf.number.lessThanOrEquals("northLerp", o, 1), P.typeOf.number.lessThanOrEquals("westLerp", r, i), P.typeOf.number.lessThanOrEquals("southLerp", n, o), N(a) || (a = new e()), t.west <= t.east) {
			const e = t.east - t.west;
			a.west = t.west + r * e, a.east = t.west + i * e;
		} else {
			const e = B.TWO_PI + t.east - t.west;
			a.west = B.negativePiToPi(t.west + r * e), a.east = B.negativePiToPi(t.west + i * e);
		}
		const s = t.north - t.south;
		return a.south = t.south + n * s, a.north = t.south + o * s, 1 === r && (a.west = t.east), 1 === i && (a.east = t.east), 1 === n && (a.south = t.north), 1 === o && (a.north = t.north), a;
	}
};
Di.packedLength = 4;
const zi = new Mr(), Bi = new Y(), Ui = new Y(), ji = new Y(), qi = new Y(), Gi = new Array(5);
for (let wl = 0; wl < Gi.length; ++wl) Gi[wl] = new Y();
const Wi = new ie();
function ki(e, t, r) {
	return r < 0 && (r += 1), r > 1 && (r -= 1), 6 * r < 1 ? e + 6 * (t - e) * r : 2 * r < 1 ? t : 3 * r < 2 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
Di.MAX_VALUE = Object.freeze(new Di(-Math.PI, -B.PI_OVER_TWO, Math.PI, B.PI_OVER_TWO));
var Vi = class e {
	constructor(e, t, r, n) {
		this.red = e ?? 1, this.green = t ?? 1, this.blue = r ?? 1, this.alpha = n ?? 1;
	}
	static fromCartesian4(t, r) {
		return P.typeOf.object("cartesian", t), N(r) ? (r.red = t.x, r.green = t.y, r.blue = t.z, r.alpha = t.w, r) : new e(t.x, t.y, t.z, t.w);
	}
	static fromBytes(t, r, n, i, o) {
		return t = e.byteToFloat(t ?? 255), r = e.byteToFloat(r ?? 255), n = e.byteToFloat(n ?? 255), i = e.byteToFloat(i ?? 255), N(o) ? (o.red = t, o.green = r, o.blue = n, o.alpha = i, o) : new e(t, r, n, i);
	}
	static fromAlpha(t, r, n) {
		return P.typeOf.object("color", t), P.typeOf.number("alpha", r), N(n) ? (n.red = t.red, n.green = t.green, n.blue = t.blue, n.alpha = r, n) : new e(t.red, t.green, t.blue, r);
	}
	static fromRgba(t, r) {
		return Yi[0] = t, e.fromBytes(Xi[0], Xi[1], Xi[2], Xi[3], r);
	}
	static fromHsl(t, r, n, i, o) {
		t = (t ?? 0) % 1, i = i ?? 1;
		let a = n = n ?? 0, s = n, u = n;
		if (0 !== (r = r ?? 0)) {
			let e;
			e = n < .5 ? n * (1 + r) : n + r - n * r;
			const i = 2 * n - e;
			a = ki(i, e, t + 1 / 3), s = ki(i, e, t), u = ki(i, e, t - 1 / 3);
		}
		return N(o) ? (o.red = a, o.green = s, o.blue = u, o.alpha = i, o) : new e(a, s, u, i);
	}
	static fromRandom(t, r) {
		let n = (t = t ?? C.EMPTY_OBJECT).red;
		if (!N(n)) {
			const e = t.minimumRed ?? 0, r = t.maximumRed ?? 1;
			P.typeOf.number.lessThanOrEquals("minimumRed", e, r), n = e + B.nextRandomNumber() * (r - e);
		}
		let i = t.green;
		if (!N(i)) {
			const e = t.minimumGreen ?? 0, r = t.maximumGreen ?? 1;
			P.typeOf.number.lessThanOrEquals("minimumGreen", e, r), i = e + B.nextRandomNumber() * (r - e);
		}
		let o = t.blue;
		if (!N(o)) {
			const e = t.minimumBlue ?? 0, r = t.maximumBlue ?? 1;
			P.typeOf.number.lessThanOrEquals("minimumBlue", e, r), o = e + B.nextRandomNumber() * (r - e);
		}
		let a = t.alpha;
		if (!N(a)) {
			const e = t.minimumAlpha ?? 0, r = t.maximumAlpha ?? 1;
			P.typeOf.number.lessThanOrEquals("minimumAlpha", e, r), a = e + B.nextRandomNumber() * (r - e);
		}
		return N(r) ? (r.red = n, r.green = i, r.blue = o, r.alpha = a, r) : new e(n, i, o, a);
	}
	static fromCssColorString(t, r) {
		P.typeOf.string("color", t), N(r) || (r = new e()), t = t.trim();
		const n = e[t.toUpperCase()];
		if (N(n)) return e.clone(n, r), r;
		let i = $i.exec(t);
		return null !== i ? (r.red = parseInt(i[1], 16) / 15, r.green = parseInt(i[2], 16) / 15, r.blue = parseInt(i[3], 16) / 15, r.alpha = parseInt(i[4] ?? "f", 16) / 15, r) : (i = Ki.exec(t), null !== i ? (r.red = parseInt(i[1], 16) / 255, r.green = parseInt(i[2], 16) / 255, r.blue = parseInt(i[3], 16) / 255, r.alpha = parseInt(i[4] ?? "ff", 16) / 255, r) : (i = Zi.exec(t), null !== i ? (r.red = parseFloat(i[1]) / ("%" === i[1].substr(-1) ? 100 : 255), r.green = parseFloat(i[2]) / ("%" === i[2].substr(-1) ? 100 : 255), r.blue = parseFloat(i[3]) / ("%" === i[3].substr(-1) ? 100 : 255), r.alpha = parseFloat(i[4] ?? "1.0"), r) : (i = Qi.exec(t), null !== i ? e.fromHsl(parseFloat(i[1]) / 360, parseFloat(i[2]) / 100, parseFloat(i[3]) / 100, parseFloat(i[4] ?? "1.0"), r) : r = void 0)));
	}
	static pack(e, t, r) {
		return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, t[r++] = e.red, t[r++] = e.green, t[r++] = e.blue, t[r] = e.alpha, t;
	}
	static unpack(t, r, n) {
		return P.defined("array", t), r = r ?? 0, N(n) || (n = new e()), n.red = t[r++], n.green = t[r++], n.blue = t[r++], n.alpha = t[r], n;
	}
	static byteToFloat(e) {
		return e / 255;
	}
	static floatToByte(e) {
		return 1 === e ? 255 : 256 * e | 0;
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r.red = t.red, r.green = t.green, r.blue = t.blue, r.alpha = t.alpha, r) : new e(t.red, t.green, t.blue, t.alpha);
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && e.red === t.red && e.green === t.green && e.blue === t.blue && e.alpha === t.alpha;
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
		return this === e || N(e) && Math.abs(this.red - e.red) <= t && Math.abs(this.green - e.green) <= t && Math.abs(this.blue - e.blue) <= t && Math.abs(this.alpha - e.alpha) <= t;
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
		return N(t) ? (t[0] = r, t[1] = n, t[2] = i, t[3] = o, t) : [
			r,
			n,
			i,
			o
		];
	}
	static bytesToRgba(e, t, r, n) {
		return Xi[0] = e, Xi[1] = t, Xi[2] = r, Xi[3] = n, Yi[0];
	}
	toRgba() {
		return e.bytesToRgba(e.floatToByte(this.red), e.floatToByte(this.green), e.floatToByte(this.blue), e.floatToByte(this.alpha));
	}
	brighten(e, t) {
		return P.typeOf.number("magnitude", e), P.typeOf.number.greaterThanOrEquals("magnitude", e, 0), P.typeOf.object("result", t), e = 1 - e, t.red = 1 - (1 - this.red) * e, t.green = 1 - (1 - this.green) * e, t.blue = 1 - (1 - this.blue) * e, t.alpha = this.alpha, t;
	}
	darken(e, t) {
		return P.typeOf.number("magnitude", e), P.typeOf.number.greaterThanOrEquals("magnitude", e, 0), P.typeOf.object("result", t), e = 1 - e, t.red = this.red * e, t.green = this.green * e, t.blue = this.blue * e, t.alpha = this.alpha, t;
	}
	withAlpha(t, r) {
		return e.fromAlpha(this, t, r);
	}
	static add(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.red = e.red + t.red, r.green = e.green + t.green, r.blue = e.blue + t.blue, r.alpha = e.alpha + t.alpha, r;
	}
	static subtract(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.red = e.red - t.red, r.green = e.green - t.green, r.blue = e.blue - t.blue, r.alpha = e.alpha - t.alpha, r;
	}
	static multiply(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.red = e.red * t.red, r.green = e.green * t.green, r.blue = e.blue * t.blue, r.alpha = e.alpha * t.alpha, r;
	}
	static divide(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.red = e.red / t.red, r.green = e.green / t.green, r.blue = e.blue / t.blue, r.alpha = e.alpha / t.alpha, r;
	}
	static mod(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r.red = e.red % t.red, r.green = e.green % t.green, r.blue = e.blue % t.blue, r.alpha = e.alpha % t.alpha, r;
	}
	static lerp(e, t, r, n) {
		return P.typeOf.object("start", e), P.typeOf.object("end", t), P.typeOf.number("t", r), P.typeOf.object("result", n), n.red = B.lerp(e.red, t.red, r), n.green = B.lerp(e.green, t.green, r), n.blue = B.lerp(e.blue, t.blue, r), n.alpha = B.lerp(e.alpha, t.alpha, r), n;
	}
	static multiplyByScalar(e, t, r) {
		return P.typeOf.object("color", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r.red = e.red * t, r.green = e.green * t, r.blue = e.blue * t, r.alpha = e.alpha * t, r;
	}
	static divideByScalar(e, t, r) {
		return P.typeOf.object("color", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r.red = e.red / t, r.green = e.green / t, r.blue = e.blue / t, r.alpha = e.alpha / t, r;
	}
};
let Hi, Yi, Xi;
wn.supportsTypedArrays() && (Hi = /* @__PURE__ */ new ArrayBuffer(4), Yi = new Uint32Array(Hi), Xi = new Uint8Array(Hi));
const $i = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i, Ki = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i, Zi = /^rgba?\s*\(\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i, Qi = /^hsla?\s*\(\s*([0-9.]+)\s*[,\s]+\s*([0-9.]+%)\s*[,\s]+\s*([0-9.]+%)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
function Ji() {
	return !0;
}
function eo(e, t) {
	function r() {
		throw new v(t);
	}
	t = t ?? "This object was destroyed, i.e., destroy() was called.";
	for (const n in e) "function" == typeof e[n] && (e[n] = r);
	e.isDestroyed = Ji;
}
function to(e, t) {
	e = e ?? 0, this._near = e, t = t ?? Number.MAX_VALUE, this._far = t;
}
Vi.packedLength = 4, Vi.ALICEBLUE = Object.freeze(Vi.fromCssColorString("#F0F8FF")), Vi.ANTIQUEWHITE = Object.freeze(Vi.fromCssColorString("#FAEBD7")), Vi.AQUA = Object.freeze(Vi.fromCssColorString("#00FFFF")), Vi.AQUAMARINE = Object.freeze(Vi.fromCssColorString("#7FFFD4")), Vi.AZURE = Object.freeze(Vi.fromCssColorString("#F0FFFF")), Vi.BEIGE = Object.freeze(Vi.fromCssColorString("#F5F5DC")), Vi.BISQUE = Object.freeze(Vi.fromCssColorString("#FFE4C4")), Vi.BLACK = Object.freeze(Vi.fromCssColorString("#000000")), Vi.BLANCHEDALMOND = Object.freeze(Vi.fromCssColorString("#FFEBCD")), Vi.BLUE = Object.freeze(Vi.fromCssColorString("#0000FF")), Vi.BLUEVIOLET = Object.freeze(Vi.fromCssColorString("#8A2BE2")), Vi.BROWN = Object.freeze(Vi.fromCssColorString("#A52A2A")), Vi.BURLYWOOD = Object.freeze(Vi.fromCssColorString("#DEB887")), Vi.CADETBLUE = Object.freeze(Vi.fromCssColorString("#5F9EA0")), Vi.CHARTREUSE = Object.freeze(Vi.fromCssColorString("#7FFF00")), Vi.CHOCOLATE = Object.freeze(Vi.fromCssColorString("#D2691E")), Vi.CORAL = Object.freeze(Vi.fromCssColorString("#FF7F50")), Vi.CORNFLOWERBLUE = Object.freeze(Vi.fromCssColorString("#6495ED")), Vi.CORNSILK = Object.freeze(Vi.fromCssColorString("#FFF8DC")), Vi.CRIMSON = Object.freeze(Vi.fromCssColorString("#DC143C")), Vi.CYAN = Object.freeze(Vi.fromCssColorString("#00FFFF")), Vi.DARKBLUE = Object.freeze(Vi.fromCssColorString("#00008B")), Vi.DARKCYAN = Object.freeze(Vi.fromCssColorString("#008B8B")), Vi.DARKGOLDENROD = Object.freeze(Vi.fromCssColorString("#B8860B")), Vi.DARKGRAY = Object.freeze(Vi.fromCssColorString("#A9A9A9")), Vi.DARKGREEN = Object.freeze(Vi.fromCssColorString("#006400")), Vi.DARKGREY = Vi.DARKGRAY, Vi.DARKKHAKI = Object.freeze(Vi.fromCssColorString("#BDB76B")), Vi.DARKMAGENTA = Object.freeze(Vi.fromCssColorString("#8B008B")), Vi.DARKOLIVEGREEN = Object.freeze(Vi.fromCssColorString("#556B2F")), Vi.DARKORANGE = Object.freeze(Vi.fromCssColorString("#FF8C00")), Vi.DARKORCHID = Object.freeze(Vi.fromCssColorString("#9932CC")), Vi.DARKRED = Object.freeze(Vi.fromCssColorString("#8B0000")), Vi.DARKSALMON = Object.freeze(Vi.fromCssColorString("#E9967A")), Vi.DARKSEAGREEN = Object.freeze(Vi.fromCssColorString("#8FBC8F")), Vi.DARKSLATEBLUE = Object.freeze(Vi.fromCssColorString("#483D8B")), Vi.DARKSLATEGRAY = Object.freeze(Vi.fromCssColorString("#2F4F4F")), Vi.DARKSLATEGREY = Vi.DARKSLATEGRAY, Vi.DARKTURQUOISE = Object.freeze(Vi.fromCssColorString("#00CED1")), Vi.DARKVIOLET = Object.freeze(Vi.fromCssColorString("#9400D3")), Vi.DEEPPINK = Object.freeze(Vi.fromCssColorString("#FF1493")), Vi.DEEPSKYBLUE = Object.freeze(Vi.fromCssColorString("#00BFFF")), Vi.DIMGRAY = Object.freeze(Vi.fromCssColorString("#696969")), Vi.DIMGREY = Vi.DIMGRAY, Vi.DODGERBLUE = Object.freeze(Vi.fromCssColorString("#1E90FF")), Vi.FIREBRICK = Object.freeze(Vi.fromCssColorString("#B22222")), Vi.FLORALWHITE = Object.freeze(Vi.fromCssColorString("#FFFAF0")), Vi.FORESTGREEN = Object.freeze(Vi.fromCssColorString("#228B22")), Vi.FUCHSIA = Object.freeze(Vi.fromCssColorString("#FF00FF")), Vi.GAINSBORO = Object.freeze(Vi.fromCssColorString("#DCDCDC")), Vi.GHOSTWHITE = Object.freeze(Vi.fromCssColorString("#F8F8FF")), Vi.GOLD = Object.freeze(Vi.fromCssColorString("#FFD700")), Vi.GOLDENROD = Object.freeze(Vi.fromCssColorString("#DAA520")), Vi.GRAY = Object.freeze(Vi.fromCssColorString("#808080")), Vi.GREEN = Object.freeze(Vi.fromCssColorString("#008000")), Vi.GREENYELLOW = Object.freeze(Vi.fromCssColorString("#ADFF2F")), Vi.GREY = Vi.GRAY, Vi.HONEYDEW = Object.freeze(Vi.fromCssColorString("#F0FFF0")), Vi.HOTPINK = Object.freeze(Vi.fromCssColorString("#FF69B4")), Vi.INDIANRED = Object.freeze(Vi.fromCssColorString("#CD5C5C")), Vi.INDIGO = Object.freeze(Vi.fromCssColorString("#4B0082")), Vi.IVORY = Object.freeze(Vi.fromCssColorString("#FFFFF0")), Vi.KHAKI = Object.freeze(Vi.fromCssColorString("#F0E68C")), Vi.LAVENDER = Object.freeze(Vi.fromCssColorString("#E6E6FA")), Vi.LAVENDAR_BLUSH = Object.freeze(Vi.fromCssColorString("#FFF0F5")), Vi.LAWNGREEN = Object.freeze(Vi.fromCssColorString("#7CFC00")), Vi.LEMONCHIFFON = Object.freeze(Vi.fromCssColorString("#FFFACD")), Vi.LIGHTBLUE = Object.freeze(Vi.fromCssColorString("#ADD8E6")), Vi.LIGHTCORAL = Object.freeze(Vi.fromCssColorString("#F08080")), Vi.LIGHTCYAN = Object.freeze(Vi.fromCssColorString("#E0FFFF")), Vi.LIGHTGOLDENRODYELLOW = Object.freeze(Vi.fromCssColorString("#FAFAD2")), Vi.LIGHTGRAY = Object.freeze(Vi.fromCssColorString("#D3D3D3")), Vi.LIGHTGREEN = Object.freeze(Vi.fromCssColorString("#90EE90")), Vi.LIGHTGREY = Vi.LIGHTGRAY, Vi.LIGHTPINK = Object.freeze(Vi.fromCssColorString("#FFB6C1")), Vi.LIGHTSEAGREEN = Object.freeze(Vi.fromCssColorString("#20B2AA")), Vi.LIGHTSKYBLUE = Object.freeze(Vi.fromCssColorString("#87CEFA")), Vi.LIGHTSLATEGRAY = Object.freeze(Vi.fromCssColorString("#778899")), Vi.LIGHTSLATEGREY = Vi.LIGHTSLATEGRAY, Vi.LIGHTSTEELBLUE = Object.freeze(Vi.fromCssColorString("#B0C4DE")), Vi.LIGHTYELLOW = Object.freeze(Vi.fromCssColorString("#FFFFE0")), Vi.LIME = Object.freeze(Vi.fromCssColorString("#00FF00")), Vi.LIMEGREEN = Object.freeze(Vi.fromCssColorString("#32CD32")), Vi.LINEN = Object.freeze(Vi.fromCssColorString("#FAF0E6")), Vi.MAGENTA = Object.freeze(Vi.fromCssColorString("#FF00FF")), Vi.MAROON = Object.freeze(Vi.fromCssColorString("#800000")), Vi.MEDIUMAQUAMARINE = Object.freeze(Vi.fromCssColorString("#66CDAA")), Vi.MEDIUMBLUE = Object.freeze(Vi.fromCssColorString("#0000CD")), Vi.MEDIUMORCHID = Object.freeze(Vi.fromCssColorString("#BA55D3")), Vi.MEDIUMPURPLE = Object.freeze(Vi.fromCssColorString("#9370DB")), Vi.MEDIUMSEAGREEN = Object.freeze(Vi.fromCssColorString("#3CB371")), Vi.MEDIUMSLATEBLUE = Object.freeze(Vi.fromCssColorString("#7B68EE")), Vi.MEDIUMSPRINGGREEN = Object.freeze(Vi.fromCssColorString("#00FA9A")), Vi.MEDIUMTURQUOISE = Object.freeze(Vi.fromCssColorString("#48D1CC")), Vi.MEDIUMVIOLETRED = Object.freeze(Vi.fromCssColorString("#C71585")), Vi.MIDNIGHTBLUE = Object.freeze(Vi.fromCssColorString("#191970")), Vi.MINTCREAM = Object.freeze(Vi.fromCssColorString("#F5FFFA")), Vi.MISTYROSE = Object.freeze(Vi.fromCssColorString("#FFE4E1")), Vi.MOCCASIN = Object.freeze(Vi.fromCssColorString("#FFE4B5")), Vi.NAVAJOWHITE = Object.freeze(Vi.fromCssColorString("#FFDEAD")), Vi.NAVY = Object.freeze(Vi.fromCssColorString("#000080")), Vi.OLDLACE = Object.freeze(Vi.fromCssColorString("#FDF5E6")), Vi.OLIVE = Object.freeze(Vi.fromCssColorString("#808000")), Vi.OLIVEDRAB = Object.freeze(Vi.fromCssColorString("#6B8E23")), Vi.ORANGE = Object.freeze(Vi.fromCssColorString("#FFA500")), Vi.ORANGERED = Object.freeze(Vi.fromCssColorString("#FF4500")), Vi.ORCHID = Object.freeze(Vi.fromCssColorString("#DA70D6")), Vi.PALEGOLDENROD = Object.freeze(Vi.fromCssColorString("#EEE8AA")), Vi.PALEGREEN = Object.freeze(Vi.fromCssColorString("#98FB98")), Vi.PALETURQUOISE = Object.freeze(Vi.fromCssColorString("#AFEEEE")), Vi.PALEVIOLETRED = Object.freeze(Vi.fromCssColorString("#DB7093")), Vi.PAPAYAWHIP = Object.freeze(Vi.fromCssColorString("#FFEFD5")), Vi.PEACHPUFF = Object.freeze(Vi.fromCssColorString("#FFDAB9")), Vi.PERU = Object.freeze(Vi.fromCssColorString("#CD853F")), Vi.PINK = Object.freeze(Vi.fromCssColorString("#FFC0CB")), Vi.PLUM = Object.freeze(Vi.fromCssColorString("#DDA0DD")), Vi.POWDERBLUE = Object.freeze(Vi.fromCssColorString("#B0E0E6")), Vi.PURPLE = Object.freeze(Vi.fromCssColorString("#800080")), Vi.RED = Object.freeze(Vi.fromCssColorString("#FF0000")), Vi.ROSYBROWN = Object.freeze(Vi.fromCssColorString("#BC8F8F")), Vi.ROYALBLUE = Object.freeze(Vi.fromCssColorString("#4169E1")), Vi.SADDLEBROWN = Object.freeze(Vi.fromCssColorString("#8B4513")), Vi.SALMON = Object.freeze(Vi.fromCssColorString("#FA8072")), Vi.SANDYBROWN = Object.freeze(Vi.fromCssColorString("#F4A460")), Vi.SEAGREEN = Object.freeze(Vi.fromCssColorString("#2E8B57")), Vi.SEASHELL = Object.freeze(Vi.fromCssColorString("#FFF5EE")), Vi.SIENNA = Object.freeze(Vi.fromCssColorString("#A0522D")), Vi.SILVER = Object.freeze(Vi.fromCssColorString("#C0C0C0")), Vi.SKYBLUE = Object.freeze(Vi.fromCssColorString("#87CEEB")), Vi.SLATEBLUE = Object.freeze(Vi.fromCssColorString("#6A5ACD")), Vi.SLATEGRAY = Object.freeze(Vi.fromCssColorString("#708090")), Vi.SLATEGREY = Vi.SLATEGRAY, Vi.SNOW = Object.freeze(Vi.fromCssColorString("#FFFAFA")), Vi.SPRINGGREEN = Object.freeze(Vi.fromCssColorString("#00FF7F")), Vi.STEELBLUE = Object.freeze(Vi.fromCssColorString("#4682B4")), Vi.TAN = Object.freeze(Vi.fromCssColorString("#D2B48C")), Vi.TEAL = Object.freeze(Vi.fromCssColorString("#008080")), Vi.THISTLE = Object.freeze(Vi.fromCssColorString("#D8BFD8")), Vi.TOMATO = Object.freeze(Vi.fromCssColorString("#FF6347")), Vi.TURQUOISE = Object.freeze(Vi.fromCssColorString("#40E0D0")), Vi.VIOLET = Object.freeze(Vi.fromCssColorString("#EE82EE")), Vi.WHEAT = Object.freeze(Vi.fromCssColorString("#F5DEB3")), Vi.WHITE = Object.freeze(Vi.fromCssColorString("#FFFFFF")), Vi.WHITESMOKE = Object.freeze(Vi.fromCssColorString("#F5F5F5")), Vi.YELLOW = Object.freeze(Vi.fromCssColorString("#FFFF00")), Vi.YELLOWGREEN = Object.freeze(Vi.fromCssColorString("#9ACD32")), Vi.TRANSPARENT = Object.freeze(new Vi(0, 0, 0, 0)), Object.defineProperties(to.prototype, {
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
}), to.packedLength = 2, to.pack = function(e, t, r) {
	if (!N(e)) throw new v("value is required");
	if (!N(t)) throw new v("array is required");
	return r = r ?? 0, t[r++] = e.near, t[r] = e.far, t;
}, to.unpack = function(e, t, r) {
	if (!N(e)) throw new v("array is required");
	return t = t ?? 0, N(r) || (r = new to()), r.near = e[t++], r.far = e[t], r;
}, to.equals = function(e, t) {
	return e === t || N(e) && N(t) && e.near === t.near && e.far === t.far;
}, to.clone = function(e, t) {
	if (N(e)) return N(t) || (t = new to()), t.near = e.near, t.far = e.far, t;
}, to.prototype.clone = function(e) {
	return to.clone(this, e);
}, to.prototype.equals = function(e) {
	return to.equals(this, e);
};
const ro = {
	NONE: 0,
	CLAMP_TO_GROUND: 1,
	RELATIVE_TO_GROUND: 2,
	CLAMP_TO_TERRAIN: 3,
	RELATIVE_TO_TERRAIN: 4,
	CLAMP_TO_3D_TILE: 5,
	RELATIVE_TO_3D_TILE: 6
};
Object.freeze(ro);
const no = {
	CENTER: 0,
	LEFT: 1,
	RIGHT: -1
};
Object.freeze(no);
const io = {
	CENTER: 0,
	BOTTOM: 1,
	BASELINE: 2,
	TOP: -1
};
function oo(e, t) {
	this.start = e ?? 0, this.stop = t ?? 0;
}
Object.freeze(io);
var ao = class e {
	constructor(e, t) {
		this.center = Y.clone(e ?? Y.ZERO), this.radius = t ?? 0;
	}
	static fromPoints(t, r) {
		if (N(r) || (r = new e()), !N(t) || 0 === t.length) return r.center = Y.clone(Y.ZERO, r.center), r.radius = 0, r;
		const n = Y.clone(t[0], po), i = Y.clone(n, so), o = Y.clone(n, uo), a = Y.clone(n, co), s = Y.clone(n, lo), u = Y.clone(n, fo), c = Y.clone(n, ho), l = t.length;
		let f;
		for (f = 1; f < l; f++) {
			Y.clone(t[f], n);
			const e = n.x, r = n.y, l = n.z;
			e < i.x && Y.clone(n, i), e > s.x && Y.clone(n, s), r < o.y && Y.clone(n, o), r > u.y && Y.clone(n, u), l < a.z && Y.clone(n, a), l > c.z && Y.clone(n, c);
		}
		const h = Y.magnitudeSquared(Y.subtract(s, i, mo)), p = Y.magnitudeSquared(Y.subtract(u, o, mo)), m = Y.magnitudeSquared(Y.subtract(c, a, mo));
		let d = i, y = s, _ = h;
		p > _ && (_ = p, d = o, y = u), m > _ && (_ = m, d = a, y = c);
		const g = yo;
		g.x = .5 * (d.x + y.x), g.y = .5 * (d.y + y.y), g.z = .5 * (d.z + y.z);
		let E = Y.magnitudeSquared(Y.subtract(y, g, mo)), b = Math.sqrt(E);
		const T = _o;
		T.x = i.x, T.y = o.y, T.z = a.z;
		const O = go;
		O.x = s.x, O.y = u.y, O.z = c.z;
		const w = Y.midpoint(T, O, Eo);
		let A = 0;
		for (f = 0; f < l; f++) {
			Y.clone(t[f], n);
			const e = Y.magnitude(Y.subtract(n, w, mo));
			e > A && (A = e);
			const r = Y.magnitudeSquared(Y.subtract(n, g, mo));
			if (r > E) {
				const e = Math.sqrt(r);
				b = .5 * (b + e), E = b * b;
				const t = e - b;
				g.x = (b * g.x + t * n.x) / e, g.y = (b * g.y + t * n.y) / e, g.z = (b * g.z + t * n.z) / e;
			}
		}
		return b < A ? (Y.clone(g, r.center), r.radius = b) : (Y.clone(w, r.center), r.radius = A), r;
	}
	static fromRectangle2D(t, r, n) {
		return e.fromRectangleWithHeights2D(t, r, 0, 0, n);
	}
	static fromRectangleWithHeights2D(t, r, n, i, o) {
		if (N(o) || (o = new e()), !N(t)) return o.center = Y.clone(Y.ZERO, o.center), o.radius = 0, o;
		To._ellipsoid = ce.default, r = r ?? To, Di.southwest(t, Ao), Ao.height = n, Di.northeast(t, xo), xo.height = i;
		const a = r.project(Ao, Oo), s = r.project(xo, wo), u = s.x - a.x, c = s.y - a.y, l = s.z - a.z;
		o.radius = .5 * Math.sqrt(u * u + c * c + l * l);
		const f = o.center;
		return f.x = a.x + .5 * u, f.y = a.y + .5 * c, f.z = a.z + .5 * l, o;
	}
	static fromRectangle3D(t, r, n, i) {
		if (r = r ?? ce.default, n = n ?? 0, N(i) || (i = new e()), !N(t)) return i.center = Y.clone(Y.ZERO, i.center), i.radius = 0, i;
		const o = Di.subsample(t, r, n, Ro);
		return e.fromPoints(o, i);
	}
	static fromVertices(t, r, n, i) {
		if (N(i) || (i = new e()), !N(t) || 0 === t.length) return i.center = Y.clone(Y.ZERO, i.center), i.radius = 0, i;
		r = r ?? Y.ZERO, n = n ?? 3, P.typeOf.number.greaterThanOrEquals("stride", n, 3);
		const o = po;
		o.x = t[0] + r.x, o.y = t[1] + r.y, o.z = t[2] + r.z;
		const a = Y.clone(o, so), s = Y.clone(o, uo), u = Y.clone(o, co), c = Y.clone(o, lo), l = Y.clone(o, fo), f = Y.clone(o, ho), h = t.length;
		let p;
		for (p = 0; p < h; p += n) {
			const e = t[p] + r.x, n = t[p + 1] + r.y, i = t[p + 2] + r.z;
			o.x = e, o.y = n, o.z = i, e < a.x && Y.clone(o, a), e > c.x && Y.clone(o, c), n < s.y && Y.clone(o, s), n > l.y && Y.clone(o, l), i < u.z && Y.clone(o, u), i > f.z && Y.clone(o, f);
		}
		const m = Y.magnitudeSquared(Y.subtract(c, a, mo)), d = Y.magnitudeSquared(Y.subtract(l, s, mo)), y = Y.magnitudeSquared(Y.subtract(f, u, mo));
		let _ = a, g = c, E = m;
		d > E && (E = d, _ = s, g = l), y > E && (E = y, _ = u, g = f);
		const b = yo;
		b.x = .5 * (_.x + g.x), b.y = .5 * (_.y + g.y), b.z = .5 * (_.z + g.z);
		let T = Y.magnitudeSquared(Y.subtract(g, b, mo)), O = Math.sqrt(T);
		const w = _o;
		w.x = a.x, w.y = s.y, w.z = u.z;
		const A = go;
		A.x = c.x, A.y = l.y, A.z = f.z;
		const x = Y.midpoint(w, A, Eo);
		let R = 0;
		for (p = 0; p < h; p += n) {
			o.x = t[p] + r.x, o.y = t[p + 1] + r.y, o.z = t[p + 2] + r.z;
			const e = Y.magnitude(Y.subtract(o, x, mo));
			e > R && (R = e);
			const n = Y.magnitudeSquared(Y.subtract(o, b, mo));
			if (n > T) {
				const e = Math.sqrt(n);
				O = .5 * (O + e), T = O * O;
				const t = e - O;
				b.x = (O * b.x + t * o.x) / e, b.y = (O * b.y + t * o.y) / e, b.z = (O * b.z + t * o.z) / e;
			}
		}
		return O < R ? (Y.clone(b, i.center), i.radius = O) : (Y.clone(x, i.center), i.radius = R), i;
	}
	static fromEncodedCartesianVertices(t, r, n) {
		if (N(n) || (n = new e()), !N(t) || !N(r) || t.length !== r.length || 0 === t.length) return n.center = Y.clone(Y.ZERO, n.center), n.radius = 0, n;
		const i = po;
		i.x = t[0] + r[0], i.y = t[1] + r[1], i.z = t[2] + r[2];
		const o = Y.clone(i, so), a = Y.clone(i, uo), s = Y.clone(i, co), u = Y.clone(i, lo), c = Y.clone(i, fo), l = Y.clone(i, ho), f = t.length;
		let h;
		for (h = 0; h < f; h += 3) {
			const e = t[h] + r[h], n = t[h + 1] + r[h + 1], f = t[h + 2] + r[h + 2];
			i.x = e, i.y = n, i.z = f, e < o.x && Y.clone(i, o), e > u.x && Y.clone(i, u), n < a.y && Y.clone(i, a), n > c.y && Y.clone(i, c), f < s.z && Y.clone(i, s), f > l.z && Y.clone(i, l);
		}
		const p = Y.magnitudeSquared(Y.subtract(u, o, mo)), m = Y.magnitudeSquared(Y.subtract(c, a, mo)), d = Y.magnitudeSquared(Y.subtract(l, s, mo));
		let y = o, _ = u, g = p;
		m > g && (g = m, y = a, _ = c), d > g && (g = d, y = s, _ = l);
		const E = yo;
		E.x = .5 * (y.x + _.x), E.y = .5 * (y.y + _.y), E.z = .5 * (y.z + _.z);
		let b = Y.magnitudeSquared(Y.subtract(_, E, mo)), T = Math.sqrt(b);
		const O = _o;
		O.x = o.x, O.y = a.y, O.z = s.z;
		const w = go;
		w.x = u.x, w.y = c.y, w.z = l.z;
		const A = Y.midpoint(O, w, Eo);
		let x = 0;
		for (h = 0; h < f; h += 3) {
			i.x = t[h] + r[h], i.y = t[h + 1] + r[h + 1], i.z = t[h + 2] + r[h + 2];
			const e = Y.magnitude(Y.subtract(i, A, mo));
			e > x && (x = e);
			const n = Y.magnitudeSquared(Y.subtract(i, E, mo));
			if (n > b) {
				const e = Math.sqrt(n);
				T = .5 * (T + e), b = T * T;
				const t = e - T;
				E.x = (T * E.x + t * i.x) / e, E.y = (T * E.y + t * i.y) / e, E.z = (T * E.z + t * i.z) / e;
			}
		}
		return T < x ? (Y.clone(E, n.center), n.radius = T) : (Y.clone(A, n.center), n.radius = x), n;
	}
	static fromCornerPoints(t, r, n) {
		P.typeOf.object("corner", t), P.typeOf.object("oppositeCorner", r), N(n) || (n = new e());
		const i = Y.midpoint(t, r, n.center);
		return n.radius = Y.distance(i, r), n;
	}
	static fromEllipsoid(t, r) {
		return P.typeOf.object("ellipsoid", t), N(r) || (r = new e()), Y.clone(Y.ZERO, r.center), r.radius = t.maximumRadius, r;
	}
	static fromBoundingSpheres(t, r) {
		if (N(r) || (r = new e()), !N(t) || 0 === t.length) return r.center = Y.clone(Y.ZERO, r.center), r.radius = 0, r;
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
			s = Math.max(s, Y.distance(a, e.center) + e.radius);
		}
		return r.radius = s, r;
	}
	static fromOrientedBoundingBox(t, r) {
		P.defined("orientedBoundingBox", t), N(r) || (r = new e());
		const n = t.halfAxes, i = Er.getColumn(n, 0, So), o = Er.getColumn(n, 1, Io), a = Er.getColumn(n, 2, Co);
		return Y.add(i, o, i), Y.add(i, a, i), r.center = Y.clone(t.center, r.center), r.radius = Y.magnitude(i), r;
	}
	static fromTransformation(t, r) {
		P.typeOf.object("transformation", t), N(r) || (r = new e());
		const n = Mr.getTranslation(t, No), i = Mr.getScale(t, vo), o = .5 * Y.magnitude(i);
		return r.center = Y.clone(n, r.center), r.radius = o, r;
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r.center = Y.clone(t.center, r.center), r.radius = t.radius, r) : new e(t.center, t.radius);
	}
	static pack(e, t, r) {
		P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0;
		const n = e.center;
		return t[r++] = n.x, t[r++] = n.y, t[r++] = n.z, t[r] = e.radius, t;
	}
	static unpack(t, r, n) {
		P.defined("array", t), r = r ?? 0, N(n) || (n = new e());
		const i = n.center;
		return i.x = t[r++], i.y = t[r++], i.z = t[r++], n.radius = t[r], n;
	}
	static union(t, r, n) {
		P.typeOf.object("left", t), P.typeOf.object("right", r), N(n) || (n = new e());
		const i = t.center, o = t.radius, a = r.center, s = r.radius, u = Y.subtract(a, i, Po), c = Y.magnitude(u);
		if (o >= c + s) return t.clone(n), n;
		if (s >= c + o) return r.clone(n), n;
		const l = .5 * (o + c + s), f = Y.multiplyByScalar(u, (-o + l) / c, Mo);
		return Y.add(f, i, f), Y.clone(f, n.center), n.radius = l, n;
	}
	static expand(t, r, n) {
		P.typeOf.object("sphere", t), P.typeOf.object("point", r), n = e.clone(t, n);
		const i = Y.magnitude(Y.subtract(r, n.center, Lo));
		return i > n.radius && (n.radius = i), n;
	}
	static intersectPlane(e, t) {
		P.typeOf.object("sphere", e), P.typeOf.object("plane", t);
		const r = e.center, n = e.radius, i = t.normal, o = Y.dot(i, r) + t.distance;
		return o < -n ? be.OUTSIDE : o < n ? be.INTERSECTING : be.INSIDE;
	}
	static transform(t, r, n) {
		return P.typeOf.object("sphere", t), P.typeOf.object("transform", r), N(n) || (n = new e()), n.center = Mr.multiplyByPoint(r, t.center, n.center), n.radius = Mr.getMaximumScale(r) * t.radius, n;
	}
	static distanceSquaredTo(e, t) {
		P.typeOf.object("sphere", e), P.typeOf.object("cartesian", t);
		const r = Y.subtract(e.center, t, Fo), n = Y.magnitude(r) - e.radius;
		return n <= 0 ? 0 : n * n;
	}
	static transformWithoutScale(t, r, n) {
		return P.typeOf.object("sphere", t), P.typeOf.object("transform", r), N(n) || (n = new e()), n.center = Mr.multiplyByPoint(r, t.center, n.center), n.radius = t.radius, n;
	}
	static computePlaneDistances(e, t, r, n) {
		P.typeOf.object("sphere", e), P.typeOf.object("position", t), P.typeOf.object("direction", r), N(n) || (n = new oo());
		const i = Y.subtract(e.center, t, Do), o = Y.dot(r, i);
		return n.start = o - e.radius, n.stop = o + e.radius, n;
	}
	static projectTo2D(t, r, n) {
		P.typeOf.object("sphere", t), ko._ellipsoid = ce.default;
		const i = (r = r ?? ko).ellipsoid;
		let o = t.center;
		const a = t.radius;
		let s;
		s = Y.equals(o, Y.ZERO) ? Y.clone(Y.UNIT_X, zo) : i.geodeticSurfaceNormal(o, zo);
		const u = Y.cross(Y.UNIT_Z, s, Bo);
		Y.normalize(u, u);
		const c = Y.cross(s, u, Uo);
		Y.normalize(c, c), Y.multiplyByScalar(s, a, s), Y.multiplyByScalar(c, a, c), Y.multiplyByScalar(u, a, u);
		const l = Y.negate(c, qo), f = Y.negate(u, jo), h = Wo;
		let p = h[0];
		Y.add(s, c, p), Y.add(p, u, p), p = h[1], Y.add(s, c, p), Y.add(p, f, p), p = h[2], Y.add(s, l, p), Y.add(p, f, p), p = h[3], Y.add(s, l, p), Y.add(p, u, p), Y.negate(s, s), p = h[4], Y.add(s, c, p), Y.add(p, u, p), p = h[5], Y.add(s, c, p), Y.add(p, f, p), p = h[6], Y.add(s, l, p), Y.add(p, f, p), p = h[7], Y.add(s, l, p), Y.add(p, u, p);
		const m = h.length;
		for (let e = 0; e < m; ++e) {
			const t = h[e];
			Y.add(o, t, t);
			const n = i.cartesianToCartographic(t, Go);
			r.project(n, t);
		}
		o = (n = e.fromPoints(h, n)).center;
		const d = o.x, y = o.y, _ = o.z;
		return o.x = _, o.y = d, o.z = y, n;
	}
	static isOccluded(e, t) {
		return P.typeOf.object("sphere", e), P.typeOf.object("occluder", t), !t.isBoundingSphereVisible(e);
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && Y.equals(e.center, t.center) && e.radius === t.radius;
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
		return bo * e * e * e;
	}
};
ao.packedLength = 4;
const so = new Y(), uo = new Y(), co = new Y(), lo = new Y(), fo = new Y(), ho = new Y(), po = new Y(), mo = new Y(), yo = new Y(), _o = new Y(), go = new Y(), Eo = new Y(), bo = 4 / 3 * B.PI, To = new Ee(), Oo = new Y(), wo = new Y(), Ao = new ie(), xo = new ie(), Ro = [], So = new Y(), Io = new Y(), Co = new Y(), No = new Y(), vo = new Y(), Po = new Y(), Mo = new Y(), Lo = new Y(), Fo = new Y(), Do = new Y(), zo = new Y(), Bo = new Y(), Uo = new Y(), jo = new Y(), qo = new Y(), Go = new ie(), Wo = new Array(8);
for (let wl = 0; wl < 8; ++wl) Wo[wl] = new Y();
const ko = new Ee(), Vo = {
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
Object.freeze(Vo);
const Ho = {
	BYTE: Vo.BYTE,
	UNSIGNED_BYTE: Vo.UNSIGNED_BYTE,
	SHORT: Vo.SHORT,
	UNSIGNED_SHORT: Vo.UNSIGNED_SHORT,
	INT: Vo.INT,
	UNSIGNED_INT: Vo.UNSIGNED_INT,
	FLOAT: Vo.FLOAT,
	DOUBLE: Vo.DOUBLE,
	getSizeInBytes: function(e) {
		if (!N(e)) throw new v("value is required.");
		switch (e) {
			case Ho.BYTE: return Int8Array.BYTES_PER_ELEMENT;
			case Ho.UNSIGNED_BYTE: return Uint8Array.BYTES_PER_ELEMENT;
			case Ho.SHORT: return Int16Array.BYTES_PER_ELEMENT;
			case Ho.UNSIGNED_SHORT: return Uint16Array.BYTES_PER_ELEMENT;
			case Ho.INT: return Int32Array.BYTES_PER_ELEMENT;
			case Ho.UNSIGNED_INT: return Uint32Array.BYTES_PER_ELEMENT;
			case Ho.FLOAT: return Float32Array.BYTES_PER_ELEMENT;
			case Ho.DOUBLE: return Float64Array.BYTES_PER_ELEMENT;
			default: throw new v("componentDatatype is not a valid value.");
		}
	},
	fromTypedArray: function(e) {
		if (e instanceof Int8Array) return Ho.BYTE;
		if (e instanceof Uint8Array) return Ho.UNSIGNED_BYTE;
		if (e instanceof Int16Array) return Ho.SHORT;
		if (e instanceof Uint16Array) return Ho.UNSIGNED_SHORT;
		if (e instanceof Int32Array) return Ho.INT;
		if (e instanceof Uint32Array) return Ho.UNSIGNED_INT;
		if (e instanceof Float32Array) return Ho.FLOAT;
		if (e instanceof Float64Array) return Ho.DOUBLE;
		throw new v("array must be an Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, or Float64Array.");
	},
	validate: function(e) {
		return N(e) && (e === Ho.BYTE || e === Ho.UNSIGNED_BYTE || e === Ho.SHORT || e === Ho.UNSIGNED_SHORT || e === Ho.INT || e === Ho.UNSIGNED_INT || e === Ho.FLOAT || e === Ho.DOUBLE);
	},
	createTypedArray: function(e, t) {
		if (!N(e)) throw new v("componentDatatype is required.");
		if (!N(t)) throw new v("valuesOrLength is required.");
		switch (e) {
			case Ho.BYTE: return new Int8Array(t);
			case Ho.UNSIGNED_BYTE: return new Uint8Array(t);
			case Ho.SHORT: return new Int16Array(t);
			case Ho.UNSIGNED_SHORT: return new Uint16Array(t);
			case Ho.INT: return new Int32Array(t);
			case Ho.UNSIGNED_INT: return new Uint32Array(t);
			case Ho.FLOAT: return new Float32Array(t);
			case Ho.DOUBLE: return new Float64Array(t);
			default: throw new v("componentDatatype is not a valid value.");
		}
	},
	createArrayBufferView: function(e, t, r, n) {
		if (!N(e)) throw new v("componentDatatype is required.");
		if (!N(t)) throw new v("buffer is required.");
		switch (r = r ?? 0, n = n ?? (t.byteLength - r) / Ho.getSizeInBytes(e), e) {
			case Ho.BYTE: return new Int8Array(t, r, n);
			case Ho.UNSIGNED_BYTE: return new Uint8Array(t, r, n);
			case Ho.SHORT: return new Int16Array(t, r, n);
			case Ho.UNSIGNED_SHORT: return new Uint16Array(t, r, n);
			case Ho.INT: return new Int32Array(t, r, n);
			case Ho.UNSIGNED_INT: return new Uint32Array(t, r, n);
			case Ho.FLOAT: return new Float32Array(t, r, n);
			case Ho.DOUBLE: return new Float64Array(t, r, n);
			default: throw new v("componentDatatype is not a valid value.");
		}
	},
	fromName: function(e) {
		switch (e) {
			case "BYTE": return Ho.BYTE;
			case "UNSIGNED_BYTE": return Ho.UNSIGNED_BYTE;
			case "SHORT": return Ho.SHORT;
			case "UNSIGNED_SHORT": return Ho.UNSIGNED_SHORT;
			case "INT": return Ho.INT;
			case "UNSIGNED_INT": return Ho.UNSIGNED_INT;
			case "FLOAT": return Ho.FLOAT;
			case "DOUBLE": return Ho.DOUBLE;
			default: throw new v("name is not a valid value.");
		}
	},
	dequantize: function(e, t) {
		switch (t) {
			case Ho.BYTE: return Math.max(e / 127, -1);
			case Ho.UNSIGNED_BYTE: return e / 255;
			case Ho.SHORT: return Math.max(e / 32767, -1);
			case Ho.UNSIGNED_SHORT: return e / 65535;
			case Ho.INT: return Math.max(e / 2147483647, -1);
			case Ho.UNSIGNED_INT: return e / 4294967295;
			default: throw new v("componentDatatype is not a valid integer type for dequantization.");
		}
	}
};
Object.freeze(Ho);
const Yo = {
	NONE: 0,
	TRIANGLES: 1,
	LINES: 2,
	POLYLINES: 3
};
Object.freeze(Yo);
var Xo = class e {
	constructor(e, t, r, n) {
		this[0] = e ?? 0, this[1] = r ?? 0, this[2] = t ?? 0, this[3] = n ?? 0;
	}
	static pack(e, t, r) {
		return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, t[r++] = e[0], t[r++] = e[1], t[r++] = e[2], t[r++] = e[3], t;
	}
	static unpack(t, r, n) {
		return P.defined("array", t), r = r ?? 0, N(n) || (n = new e()), n[0] = t[r++], n[1] = t[r++], n[2] = t[r++], n[3] = t[r++], n;
	}
	static packArray(t, r) {
		P.defined("array", t);
		const n = t.length, i = 4 * n;
		if (N(r)) {
			if (!Array.isArray(r) && r.length !== i) throw new v("If result is a typed array, it must have exactly array.length * 4 elements");
			r.length !== i && (r.length = i);
		} else r = new Array(i);
		for (let o = 0; o < n; ++o) e.pack(t[o], r, 4 * o);
		return r;
	}
	static unpackArray(t, r) {
		if (P.defined("array", t), P.typeOf.number.greaterThanOrEquals("array.length", t.length, 4), t.length % 4 != 0) throw new v("array length must be a multiple of 4.");
		const n = t.length;
		N(r) ? r.length = n / 4 : r = new Array(n / 4);
		for (let i = 0; i < n; i += 4) {
			const n = i / 4;
			r[n] = e.unpack(t, i, r[n]);
		}
		return r;
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r) : new e(t[0], t[2], t[1], t[3]);
	}
	static fromColumnMajorArray(t, r) {
		return P.defined("values", t), e.clone(t, r);
	}
	static fromRowMajorArray(t, r) {
		return P.defined("values", t), N(r) ? (r[0] = t[0], r[1] = t[2], r[2] = t[1], r[3] = t[3], r) : new e(t[0], t[1], t[2], t[3]);
	}
	static fromScale(t, r) {
		return P.typeOf.object("scale", t), N(r) ? (r[0] = t.x, r[1] = 0, r[2] = 0, r[3] = t.y, r) : new e(t.x, 0, 0, t.y);
	}
	static fromUniformScale(t, r) {
		return P.typeOf.number("scale", t), N(r) ? (r[0] = t, r[1] = 0, r[2] = 0, r[3] = t, r) : new e(t, 0, 0, t);
	}
	static fromRotation(t, r) {
		P.typeOf.number("angle", t);
		const n = Math.cos(t), i = Math.sin(t);
		return N(r) ? (r[0] = n, r[1] = i, r[2] = -i, r[3] = n, r) : new e(n, -i, i, n);
	}
	static toArray(e, t) {
		return P.typeOf.object("matrix", e), N(t) ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t) : [
			e[0],
			e[1],
			e[2],
			e[3]
		];
	}
	static getElementIndex(e, t) {
		return P.typeOf.number.greaterThanOrEquals("row", t, 0), P.typeOf.number.lessThanOrEquals("row", t, 1), P.typeOf.number.greaterThanOrEquals("column", e, 0), P.typeOf.number.lessThanOrEquals("column", e, 1), 2 * e + t;
	}
	static getColumn(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.number.greaterThanOrEquals("index", t, 0), P.typeOf.number.lessThanOrEquals("index", t, 1), P.typeOf.object("result", r);
		const n = 2 * t, i = e[n], o = e[n + 1];
		return r.x = i, r.y = o, r;
	}
	static setColumn(t, r, n, i) {
		P.typeOf.object("matrix", t), P.typeOf.number.greaterThanOrEquals("index", r, 0), P.typeOf.number.lessThanOrEquals("index", r, 1), P.typeOf.object("cartesian", n), P.typeOf.object("result", i);
		const o = 2 * r;
		return (i = e.clone(t, i))[o] = n.x, i[o + 1] = n.y, i;
	}
	static getRow(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.number.greaterThanOrEquals("index", t, 0), P.typeOf.number.lessThanOrEquals("index", t, 1), P.typeOf.object("result", r);
		const n = e[t], i = e[t + 2];
		return r.x = n, r.y = i, r;
	}
	static setRow(t, r, n, i) {
		return P.typeOf.object("matrix", t), P.typeOf.number.greaterThanOrEquals("index", r, 0), P.typeOf.number.lessThanOrEquals("index", r, 1), P.typeOf.object("cartesian", n), P.typeOf.object("result", i), (i = e.clone(t, i))[r] = n.x, i[r + 2] = n.y, i;
	}
	static setScale(t, r, n) {
		P.typeOf.object("matrix", t), P.typeOf.object("scale", r), P.typeOf.object("result", n);
		const i = e.getScale(t, $o), o = r.x / i.x, a = r.y / i.y;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * a, n[3] = t[3] * a, n;
	}
	static setUniformScale(t, r, n) {
		P.typeOf.object("matrix", t), P.typeOf.number("scale", r), P.typeOf.object("result", n);
		const i = e.getScale(t, Ko), o = r / i.x, a = r / i.y;
		return n[0] = t[0] * o, n[1] = t[1] * o, n[2] = t[2] * a, n[3] = t[3] * a, n;
	}
	static getScale(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t.x = q.magnitude(q.fromElements(e[0], e[1], Zo)), t.y = q.magnitude(q.fromElements(e[2], e[3], Zo)), t;
	}
	static getMaximumScale(t) {
		return e.getScale(t, Qo), q.maximumComponent(Qo);
	}
	static setRotation(t, r, n) {
		P.typeOf.object("matrix", t), P.typeOf.object("result", n);
		const i = e.getScale(t, Jo);
		return n[0] = r[0] * i.x, n[1] = r[1] * i.x, n[2] = r[2] * i.y, n[3] = r[3] * i.y, n;
	}
	static getRotation(t, r) {
		P.typeOf.object("matrix", t), P.typeOf.object("result", r);
		const n = e.getScale(t, ea);
		return r[0] = t[0] / n.x, r[1] = t[1] / n.x, r[2] = t[2] / n.y, r[3] = t[3] / n.y, r;
	}
	static multiply(e, t, r) {
		P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r);
		const n = e[0] * t[0] + e[2] * t[1], i = e[0] * t[2] + e[2] * t[3], o = e[1] * t[0] + e[3] * t[1], a = e[1] * t[2] + e[3] * t[3];
		return r[0] = n, r[1] = o, r[2] = i, r[3] = a, r;
	}
	static add(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r[0] = e[0] + t[0], r[1] = e[1] + t[1], r[2] = e[2] + t[2], r[3] = e[3] + t[3], r;
	}
	static subtract(e, t, r) {
		return P.typeOf.object("left", e), P.typeOf.object("right", t), P.typeOf.object("result", r), r[0] = e[0] - t[0], r[1] = e[1] - t[1], r[2] = e[2] - t[2], r[3] = e[3] - t[3], r;
	}
	static multiplyByVector(e, t, r) {
		P.typeOf.object("matrix", e), P.typeOf.object("cartesian", t), P.typeOf.object("result", r);
		const n = e[0] * t.x + e[2] * t.y, i = e[1] * t.x + e[3] * t.y;
		return r.x = n, r.y = i, r;
	}
	static multiplyByScalar(e, t, r) {
		return P.typeOf.object("matrix", e), P.typeOf.number("scalar", t), P.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r;
	}
	static multiplyByScale(e, t, r) {
		return P.typeOf.object("matrix", e), P.typeOf.object("scale", t), P.typeOf.object("result", r), r[0] = e[0] * t.x, r[1] = e[1] * t.x, r[2] = e[2] * t.y, r[3] = e[3] * t.y, r;
	}
	static multiplyByUniformScale(e, t, r) {
		return P.typeOf.object("matrix", e), P.typeOf.number("scale", t), P.typeOf.object("result", r), r[0] = e[0] * t, r[1] = e[1] * t, r[2] = e[2] * t, r[3] = e[3] * t, r;
	}
	static negate(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t;
	}
	static transpose(e, t) {
		P.typeOf.object("matrix", e), P.typeOf.object("result", t);
		const r = e[0], n = e[2], i = e[1], o = e[3];
		return t[0] = r, t[1] = n, t[2] = i, t[3] = o, t;
	}
	static abs(e, t) {
		return P.typeOf.object("matrix", e), P.typeOf.object("result", t), t[0] = Math.abs(e[0]), t[1] = Math.abs(e[1]), t[2] = Math.abs(e[2]), t[3] = Math.abs(e[3]), t;
	}
	static equals(e, t) {
		return e === t || N(e) && N(t) && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3];
	}
	static equalsArray(e, t, r) {
		return e[0] === t[r] && e[1] === t[r + 1] && e[2] === t[r + 2] && e[3] === t[r + 3];
	}
	static equalsEpsilon(e, t, r) {
		return r = r ?? 0, e === t || N(e) && N(t) && Math.abs(e[0] - t[0]) <= r && Math.abs(e[1] - t[1]) <= r && Math.abs(e[2] - t[2]) <= r && Math.abs(e[3] - t[3]) <= r;
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
Xo.packedLength = 4, Xo.fromArray = Xo.unpack, Xo.IDENTITY = Object.freeze(new Xo(1, 0, 0, 1)), Xo.ZERO = Object.freeze(new Xo(0, 0, 0, 0)), Xo.COLUMN0ROW0 = 0, Xo.COLUMN0ROW1 = 1, Xo.COLUMN1ROW0 = 2, Xo.COLUMN1ROW1 = 3;
const $o = new q(), Ko = new q(), Zo = new q(), Qo = new q(), Jo = new q(), ea = new q(), ta = {
	POINTS: Vo.POINTS,
	LINES: Vo.LINES,
	LINE_LOOP: Vo.LINE_LOOP,
	LINE_STRIP: Vo.LINE_STRIP,
	TRIANGLES: Vo.TRIANGLES,
	TRIANGLE_STRIP: Vo.TRIANGLE_STRIP,
	TRIANGLE_FAN: Vo.TRIANGLE_FAN
};
function ra(e) {
	e = e ?? C.EMPTY_OBJECT, P.typeOf.object("options.attributes", e.attributes), this.attributes = e.attributes, this.indices = e.indices, this.primitiveType = e.primitiveType ?? ta.TRIANGLES, this.boundingSphere = e.boundingSphere, this.geometryType = e.geometryType ?? Yo.NONE, this.boundingSphereCV = e.boundingSphereCV, this.offsetAttribute = e.offsetAttribute;
}
ta.isLines = function(e) {
	return e === ta.LINES || e === ta.LINE_LOOP || e === ta.LINE_STRIP;
}, ta.isTriangles = function(e) {
	return e === ta.TRIANGLES || e === ta.TRIANGLE_STRIP || e === ta.TRIANGLE_FAN;
}, ta.validate = function(e) {
	return e === ta.POINTS || e === ta.LINES || e === ta.LINE_LOOP || e === ta.LINE_STRIP || e === ta.TRIANGLES || e === ta.TRIANGLE_STRIP || e === ta.TRIANGLE_FAN;
}, Object.freeze(ta), ra.computeNumberOfVertices = function(e) {
	P.typeOf.object("geometry", e);
	let t = -1;
	for (const r in e.attributes) if (e.attributes.hasOwnProperty(r) && N(e.attributes[r]) && N(e.attributes[r].values)) {
		const n = e.attributes[r], i = n.values.length / n.componentsPerAttribute;
		if (t !== i && -1 !== t) throw new v("All attribute lists must have the same number of attributes.");
		t = i;
	}
	return t;
};
const na = new ie(), ia = new Y(), oa = new Mr(), aa = [
	new ie(),
	new ie(),
	new ie()
], sa = [
	new q(),
	new q(),
	new q()
], ua = [
	new q(),
	new q(),
	new q()
], ca = new Y(), la = new An(), fa = new Mr(), ha = new Xo();
function pa(e) {
	if (!N((e = e ?? C.EMPTY_OBJECT).componentDatatype)) throw new v("options.componentDatatype is required.");
	if (!N(e.componentsPerAttribute)) throw new v("options.componentsPerAttribute is required.");
	if (e.componentsPerAttribute < 1 || e.componentsPerAttribute > 4) throw new v("options.componentsPerAttribute must be between 1 and 4.");
	if (!N(e.values)) throw new v("options.values is required.");
	this.componentDatatype = e.componentDatatype, this.componentsPerAttribute = e.componentsPerAttribute, this.normalize = e.normalize ?? !1, this.values = e.values;
}
function ma(e) {
	e = e ?? C.EMPTY_OBJECT, this.position = e.position, this.normal = e.normal, this.st = e.st, this.bitangent = e.bitangent, this.tangent = e.tangent, this.color = e.color;
}
ra._textureCoordinateRotationPoints = function(e, t, r, n) {
	let i;
	const o = Di.center(n, na), a = ie.toCartesian(o, r, ia), s = Zn.eastNorthUpToFixedFrame(a, r, oa), u = Mr.inverse(s, oa), c = sa, l = aa;
	l[0].longitude = n.west, l[0].latitude = n.south, l[1].longitude = n.west, l[1].latitude = n.north, l[2].longitude = n.east, l[2].latitude = n.south;
	let f = ca;
	for (i = 0; i < 3; i++) ie.toCartesian(l[i], r, f), f = Mr.multiplyByPointAsVector(u, f, f), c[i].x = f.x, c[i].y = f.y;
	const h = An.fromAxisAngle(Y.UNIT_Z, -t, la), p = Er.fromQuaternion(h, fa), m = e.length;
	let d = Number.POSITIVE_INFINITY, y = Number.POSITIVE_INFINITY, _ = Number.NEGATIVE_INFINITY, g = Number.NEGATIVE_INFINITY;
	for (i = 0; i < m; i++) f = Mr.multiplyByPointAsVector(u, e[i], f), f = Er.multiplyByVector(p, f, f), d = Math.min(d, f.x), y = Math.min(y, f.y), _ = Math.max(_, f.x), g = Math.max(g, f.y);
	const E = Xo.fromRotation(t, ha), b = ua;
	b[0].x = d, b[0].y = y, b[1].x = d, b[1].y = g, b[2].x = _, b[2].y = y;
	const T = c[0], O = c[2].x - T.x, w = c[1].y - T.y;
	for (i = 0; i < 3; i++) {
		const e = b[i];
		Xo.multiplyByVector(E, e, e), e.x = (e.x - T.x) / O, e.y = (e.y - T.y) / w;
	}
	const A = b[0], x = b[1], R = b[2], S = new Array(6);
	return q.pack(A, S), q.pack(x, S, 2), q.pack(R, S, 4), S;
};
const da = {
	NONE: 0,
	TOP: 1,
	ALL: 2
};
function ya(e) {
	e = e ?? C.EMPTY_OBJECT, this.position = e.position ?? !1, this.normal = e.normal ?? !1, this.st = e.st ?? !1, this.bitangent = e.bitangent ?? !1, this.tangent = e.tangent ?? !1, this.color = e.color ?? !1;
}
Object.freeze(da), ya.POSITION_ONLY = Object.freeze(new ya({ position: !0 })), ya.POSITION_AND_NORMAL = Object.freeze(new ya({
	position: !0,
	normal: !0
})), ya.POSITION_NORMAL_AND_ST = Object.freeze(new ya({
	position: !0,
	normal: !0,
	st: !0
})), ya.POSITION_AND_ST = Object.freeze(new ya({
	position: !0,
	st: !0
})), ya.POSITION_AND_COLOR = Object.freeze(new ya({
	position: !0,
	color: !0
})), ya.ALL = Object.freeze(new ya({
	position: !0,
	normal: !0,
	st: !0,
	tangent: !0,
	bitangent: !0
})), ya.DEFAULT = ya.POSITION_NORMAL_AND_ST, ya.packedLength = 6, ya.pack = function(e, t, r) {
	if (!N(e)) throw new v("value is required");
	if (!N(t)) throw new v("array is required");
	return r = r ?? 0, t[r++] = e.position ? 1 : 0, t[r++] = e.normal ? 1 : 0, t[r++] = e.st ? 1 : 0, t[r++] = e.tangent ? 1 : 0, t[r++] = e.bitangent ? 1 : 0, t[r] = e.color ? 1 : 0, t;
}, ya.unpack = function(e, t, r) {
	if (!N(e)) throw new v("array is required");
	return t = t ?? 0, N(r) || (r = new ya()), r.position = 1 === e[t++], r.normal = 1 === e[t++], r.st = 1 === e[t++], r.tangent = 1 === e[t++], r.bitangent = 1 === e[t++], r.color = 1 === e[t], r;
}, ya.clone = function(e, t) {
	if (N(e)) return N(t) || (t = new ya()), t.position = e.position, t.normal = e.normal, t.st = e.st, t.tangent = e.tangent, t.bitangent = e.bitangent, t.color = e.color, t;
};
const _a = new Y();
function ga(e) {
	const t = (e = e ?? C.EMPTY_OBJECT).minimum, r = e.maximum;
	if (P.typeOf.object("min", t), P.typeOf.object("max", r), N(e.offsetAttribute) && e.offsetAttribute === da.TOP) throw new v("GeometryOffsetAttribute.TOP is not a supported options.offsetAttribute for this geometry.");
	const n = e.vertexFormat ?? ya.DEFAULT;
	this._minimum = Y.clone(t), this._maximum = Y.clone(r), this._vertexFormat = n, this._offsetAttribute = e.offsetAttribute, this._workerName = "createBoxGeometry";
}
ga.fromDimensions = function(e) {
	const t = (e = e ?? C.EMPTY_OBJECT).dimensions;
	P.typeOf.object("dimensions", t), P.typeOf.number.greaterThanOrEquals("dimensions.x", t.x, 0), P.typeOf.number.greaterThanOrEquals("dimensions.y", t.y, 0), P.typeOf.number.greaterThanOrEquals("dimensions.z", t.z, 0);
	const r = Y.multiplyByScalar(t, .5, new Y());
	return new ga({
		minimum: Y.negate(r, new Y()),
		maximum: r,
		vertexFormat: e.vertexFormat,
		offsetAttribute: e.offsetAttribute
	});
}, ga.fromAxisAlignedBoundingBox = function(e) {
	return P.typeOf.object("boundingBox", e), new ga({
		minimum: e.minimum,
		maximum: e.maximum
	});
}, ga.packedLength = 2 * Y.packedLength + ya.packedLength + 1, ga.pack = function(e, t, r) {
	return P.typeOf.object("value", e), P.defined("array", t), r = r ?? 0, Y.pack(e._minimum, t, r), Y.pack(e._maximum, t, r + Y.packedLength), ya.pack(e._vertexFormat, t, r + 2 * Y.packedLength), t[r + 2 * Y.packedLength + ya.packedLength] = e._offsetAttribute ?? -1, t;
};
const Ea = new Y(), ba = new Y(), Ta = new ya(), Oa = {
	minimum: Ea,
	maximum: ba,
	vertexFormat: Ta,
	offsetAttribute: void 0
};
let wa;
ga.unpack = function(e, t, r) {
	P.defined("array", e), t = t ?? 0;
	const n = Y.unpack(e, t, Ea), i = Y.unpack(e, t + Y.packedLength, ba), o = ya.unpack(e, t + 2 * Y.packedLength, Ta), a = e[t + 2 * Y.packedLength + ya.packedLength];
	return N(r) ? (r._minimum = Y.clone(n, r._minimum), r._maximum = Y.clone(i, r._maximum), r._vertexFormat = ya.clone(o, r._vertexFormat), r._offsetAttribute = -1 === a ? void 0 : a, r) : (Oa.offsetAttribute = -1 === a ? void 0 : a, new ga(Oa));
}, ga.createGeometry = function(e) {
	const t = e._minimum, r = e._maximum, n = e._vertexFormat;
	if (Y.equals(t, r)) return;
	const i = new ma();
	let o, a;
	if (n.position && (n.st || n.normal || n.tangent || n.bitangent)) {
		if (n.position && (a = /* @__PURE__ */ new Float64Array(72), a[0] = t.x, a[1] = t.y, a[2] = r.z, a[3] = r.x, a[4] = t.y, a[5] = r.z, a[6] = r.x, a[7] = r.y, a[8] = r.z, a[9] = t.x, a[10] = r.y, a[11] = r.z, a[12] = t.x, a[13] = t.y, a[14] = t.z, a[15] = r.x, a[16] = t.y, a[17] = t.z, a[18] = r.x, a[19] = r.y, a[20] = t.z, a[21] = t.x, a[22] = r.y, a[23] = t.z, a[24] = r.x, a[25] = t.y, a[26] = t.z, a[27] = r.x, a[28] = r.y, a[29] = t.z, a[30] = r.x, a[31] = r.y, a[32] = r.z, a[33] = r.x, a[34] = t.y, a[35] = r.z, a[36] = t.x, a[37] = t.y, a[38] = t.z, a[39] = t.x, a[40] = r.y, a[41] = t.z, a[42] = t.x, a[43] = r.y, a[44] = r.z, a[45] = t.x, a[46] = t.y, a[47] = r.z, a[48] = t.x, a[49] = r.y, a[50] = t.z, a[51] = r.x, a[52] = r.y, a[53] = t.z, a[54] = r.x, a[55] = r.y, a[56] = r.z, a[57] = t.x, a[58] = r.y, a[59] = r.z, a[60] = t.x, a[61] = t.y, a[62] = t.z, a[63] = r.x, a[64] = t.y, a[65] = t.z, a[66] = r.x, a[67] = t.y, a[68] = r.z, a[69] = t.x, a[70] = t.y, a[71] = r.z, i.position = new pa({
			componentDatatype: Ho.DOUBLE,
			componentsPerAttribute: 3,
			values: a
		})), n.normal) {
			const e = /* @__PURE__ */ new Float32Array(72);
			e[0] = 0, e[1] = 0, e[2] = 1, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 1, e[9] = 0, e[10] = 0, e[11] = 1, e[12] = 0, e[13] = 0, e[14] = -1, e[15] = 0, e[16] = 0, e[17] = -1, e[18] = 0, e[19] = 0, e[20] = -1, e[21] = 0, e[22] = 0, e[23] = -1, e[24] = 1, e[25] = 0, e[26] = 0, e[27] = 1, e[28] = 0, e[29] = 0, e[30] = 1, e[31] = 0, e[32] = 0, e[33] = 1, e[34] = 0, e[35] = 0, e[36] = -1, e[37] = 0, e[38] = 0, e[39] = -1, e[40] = 0, e[41] = 0, e[42] = -1, e[43] = 0, e[44] = 0, e[45] = -1, e[46] = 0, e[47] = 0, e[48] = 0, e[49] = 1, e[50] = 0, e[51] = 0, e[52] = 1, e[53] = 0, e[54] = 0, e[55] = 1, e[56] = 0, e[57] = 0, e[58] = 1, e[59] = 0, e[60] = 0, e[61] = -1, e[62] = 0, e[63] = 0, e[64] = -1, e[65] = 0, e[66] = 0, e[67] = -1, e[68] = 0, e[69] = 0, e[70] = -1, e[71] = 0, i.normal = new pa({
				componentDatatype: Ho.FLOAT,
				componentsPerAttribute: 3,
				values: e
			});
		}
		if (n.st) {
			const e = /* @__PURE__ */ new Float32Array(48);
			e[0] = 0, e[1] = 0, e[2] = 1, e[3] = 0, e[4] = 1, e[5] = 1, e[6] = 0, e[7] = 1, e[8] = 1, e[9] = 0, e[10] = 0, e[11] = 0, e[12] = 0, e[13] = 1, e[14] = 1, e[15] = 1, e[16] = 0, e[17] = 0, e[18] = 1, e[19] = 0, e[20] = 1, e[21] = 1, e[22] = 0, e[23] = 1, e[24] = 1, e[25] = 0, e[26] = 0, e[27] = 0, e[28] = 0, e[29] = 1, e[30] = 1, e[31] = 1, e[32] = 1, e[33] = 0, e[34] = 0, e[35] = 0, e[36] = 0, e[37] = 1, e[38] = 1, e[39] = 1, e[40] = 0, e[41] = 0, e[42] = 1, e[43] = 0, e[44] = 1, e[45] = 1, e[46] = 0, e[47] = 1, i.st = new pa({
				componentDatatype: Ho.FLOAT,
				componentsPerAttribute: 2,
				values: e
			});
		}
		if (n.tangent) {
			const e = /* @__PURE__ */ new Float32Array(72);
			e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e[6] = 1, e[7] = 0, e[8] = 0, e[9] = 1, e[10] = 0, e[11] = 0, e[12] = -1, e[13] = 0, e[14] = 0, e[15] = -1, e[16] = 0, e[17] = 0, e[18] = -1, e[19] = 0, e[20] = 0, e[21] = -1, e[22] = 0, e[23] = 0, e[24] = 0, e[25] = 1, e[26] = 0, e[27] = 0, e[28] = 1, e[29] = 0, e[30] = 0, e[31] = 1, e[32] = 0, e[33] = 0, e[34] = 1, e[35] = 0, e[36] = 0, e[37] = -1, e[38] = 0, e[39] = 0, e[40] = -1, e[41] = 0, e[42] = 0, e[43] = -1, e[44] = 0, e[45] = 0, e[46] = -1, e[47] = 0, e[48] = -1, e[49] = 0, e[50] = 0, e[51] = -1, e[52] = 0, e[53] = 0, e[54] = -1, e[55] = 0, e[56] = 0, e[57] = -1, e[58] = 0, e[59] = 0, e[60] = 1, e[61] = 0, e[62] = 0, e[63] = 1, e[64] = 0, e[65] = 0, e[66] = 1, e[67] = 0, e[68] = 0, e[69] = 1, e[70] = 0, e[71] = 0, i.tangent = new pa({
				componentDatatype: Ho.FLOAT,
				componentsPerAttribute: 3,
				values: e
			});
		}
		if (n.bitangent) {
			const e = /* @__PURE__ */ new Float32Array(72);
			e[0] = 0, e[1] = 1, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, e[7] = 1, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 1, e[14] = 0, e[15] = 0, e[16] = 1, e[17] = 0, e[18] = 0, e[19] = 1, e[20] = 0, e[21] = 0, e[22] = 1, e[23] = 0, e[24] = 0, e[25] = 0, e[26] = 1, e[27] = 0, e[28] = 0, e[29] = 1, e[30] = 0, e[31] = 0, e[32] = 1, e[33] = 0, e[34] = 0, e[35] = 1, e[36] = 0, e[37] = 0, e[38] = 1, e[39] = 0, e[40] = 0, e[41] = 1, e[42] = 0, e[43] = 0, e[44] = 1, e[45] = 0, e[46] = 0, e[47] = 1, e[48] = 0, e[49] = 0, e[50] = 1, e[51] = 0, e[52] = 0, e[53] = 1, e[54] = 0, e[55] = 0, e[56] = 1, e[57] = 0, e[58] = 0, e[59] = 1, e[60] = 0, e[61] = 0, e[62] = 1, e[63] = 0, e[64] = 0, e[65] = 1, e[66] = 0, e[67] = 0, e[68] = 1, e[69] = 0, e[70] = 0, e[71] = 1, i.bitangent = new pa({
				componentDatatype: Ho.FLOAT,
				componentsPerAttribute: 3,
				values: e
			});
		}
		o = /* @__PURE__ */ new Uint16Array(36), o[0] = 0, o[1] = 1, o[2] = 2, o[3] = 0, o[4] = 2, o[5] = 3, o[6] = 6, o[7] = 5, o[8] = 4, o[9] = 7, o[10] = 6, o[11] = 4, o[12] = 8, o[13] = 9, o[14] = 10, o[15] = 8, o[16] = 10, o[17] = 11, o[18] = 14, o[19] = 13, o[20] = 12, o[21] = 15, o[22] = 14, o[23] = 12, o[24] = 18, o[25] = 17, o[26] = 16, o[27] = 19, o[28] = 18, o[29] = 16, o[30] = 20, o[31] = 21, o[32] = 22, o[33] = 20, o[34] = 22, o[35] = 23;
	} else a = /* @__PURE__ */ new Float64Array(24), a[0] = t.x, a[1] = t.y, a[2] = t.z, a[3] = r.x, a[4] = t.y, a[5] = t.z, a[6] = r.x, a[7] = r.y, a[8] = t.z, a[9] = t.x, a[10] = r.y, a[11] = t.z, a[12] = t.x, a[13] = t.y, a[14] = r.z, a[15] = r.x, a[16] = t.y, a[17] = r.z, a[18] = r.x, a[19] = r.y, a[20] = r.z, a[21] = t.x, a[22] = r.y, a[23] = r.z, i.position = new pa({
		componentDatatype: Ho.DOUBLE,
		componentsPerAttribute: 3,
		values: a
	}), o = /* @__PURE__ */ new Uint16Array(36), o[0] = 4, o[1] = 5, o[2] = 6, o[3] = 4, o[4] = 6, o[5] = 7, o[6] = 1, o[7] = 0, o[8] = 3, o[9] = 1, o[10] = 3, o[11] = 2, o[12] = 1, o[13] = 6, o[14] = 5, o[15] = 1, o[16] = 2, o[17] = 6, o[18] = 2, o[19] = 3, o[20] = 7, o[21] = 2, o[22] = 7, o[23] = 6, o[24] = 3, o[25] = 0, o[26] = 4, o[27] = 3, o[28] = 4, o[29] = 7, o[30] = 0, o[31] = 1, o[32] = 5, o[33] = 0, o[34] = 5, o[35] = 4;
	const s = Y.subtract(r, t, _a), u = .5 * Y.magnitude(s);
	if (N(e._offsetAttribute)) {
		const t = a.length, r = e._offsetAttribute === da.NONE ? 0 : 1, n = new Uint8Array(t / 3).fill(r);
		i.applyOffset = new pa({
			componentDatatype: Ho.UNSIGNED_BYTE,
			componentsPerAttribute: 1,
			values: n
		});
	}
	return new ra({
		attributes: i,
		indices: o,
		primitiveType: ta.TRIANGLES,
		boundingSphere: new ao(Y.ZERO, u),
		offsetAttribute: e._offsetAttribute
	});
}, ga.getUnitBox = function() {
	return N(wa) || (wa = ga.createGeometry(ga.fromDimensions({
		dimensions: new Y(1, 1, 1),
		vertexFormat: ya.POSITION_ONLY
	}))), wa;
};
const Aa = {
	ADD: Vo.FUNC_ADD,
	SUBTRACT: Vo.FUNC_SUBTRACT,
	REVERSE_SUBTRACT: Vo.FUNC_REVERSE_SUBTRACT,
	MIN: Vo.MIN,
	MAX: Vo.MAX
};
Object.freeze(Aa);
const xa = {
	ZERO: Vo.ZERO,
	ONE: Vo.ONE,
	SOURCE_COLOR: Vo.SRC_COLOR,
	ONE_MINUS_SOURCE_COLOR: Vo.ONE_MINUS_SRC_COLOR,
	DESTINATION_COLOR: Vo.DST_COLOR,
	ONE_MINUS_DESTINATION_COLOR: Vo.ONE_MINUS_DST_COLOR,
	SOURCE_ALPHA: Vo.SRC_ALPHA,
	ONE_MINUS_SOURCE_ALPHA: Vo.ONE_MINUS_SRC_ALPHA,
	DESTINATION_ALPHA: Vo.DST_ALPHA,
	ONE_MINUS_DESTINATION_ALPHA: Vo.ONE_MINUS_DST_ALPHA,
	CONSTANT_COLOR: Vo.CONSTANT_COLOR,
	ONE_MINUS_CONSTANT_COLOR: Vo.ONE_MINUS_CONSTANT_COLOR,
	CONSTANT_ALPHA: Vo.CONSTANT_ALPHA,
	ONE_MINUS_CONSTANT_ALPHA: Vo.ONE_MINUS_CONSTANT_ALPHA,
	SOURCE_ALPHA_SATURATE: Vo.SRC_ALPHA_SATURATE
};
Object.freeze(xa);
const Ra = {
	DISABLED: Object.freeze({ enabled: !1 }),
	ALPHA_BLEND: Object.freeze({
		enabled: !0,
		equationRgb: Aa.ADD,
		equationAlpha: Aa.ADD,
		functionSourceRgb: xa.SOURCE_ALPHA,
		functionSourceAlpha: xa.ONE,
		functionDestinationRgb: xa.ONE_MINUS_SOURCE_ALPHA,
		functionDestinationAlpha: xa.ONE_MINUS_SOURCE_ALPHA
	}),
	PRE_MULTIPLIED_ALPHA_BLEND: Object.freeze({
		enabled: !0,
		equationRgb: Aa.ADD,
		equationAlpha: Aa.ADD,
		functionSourceRgb: xa.ONE,
		functionSourceAlpha: xa.ONE,
		functionDestinationRgb: xa.ONE_MINUS_SOURCE_ALPHA,
		functionDestinationAlpha: xa.ONE_MINUS_SOURCE_ALPHA
	}),
	ADDITIVE_BLEND: Object.freeze({
		enabled: !0,
		equationRgb: Aa.ADD,
		equationAlpha: Aa.ADD,
		functionSourceRgb: xa.SOURCE_ALPHA,
		functionSourceAlpha: xa.ONE,
		functionDestinationRgb: xa.ONE,
		functionDestinationAlpha: xa.ONE
	})
};
Object.freeze(Ra);
const Sa = {
	FRONT: Vo.FRONT,
	BACK: Vo.BACK,
	FRONT_AND_BACK: Vo.FRONT_AND_BACK
};
function Ia(e) {
	e = e ?? C.EMPTY_OBJECT, this.material = e.material, this.translucent = e.translucent ?? !0, this._vertexShaderSource = e.vertexShaderSource, this._fragmentShaderSource = e.fragmentShaderSource, this._renderState = e.renderState, this._closed = e.closed ?? !1;
}
function Ca() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
		const t = 16 * Math.random() | 0;
		return ("x" === e ? t : 3 & t | 8).toString(16);
	});
}
function Na(e, t, r, n, i) {
	this._format = e, this._datatype = t, this._width = r, this._height = n, this._buffer = i;
}
function va() {
	if (!N(Fa._canTransferArrayBuffer)) {
		const t = La("transferTypedArrayTest");
		t.postMessage = t.webkitPostMessage ?? t.postMessage;
		const r = 99, n = new Int8Array([r]);
		try {
			t.postMessage({ array: n }, [n.buffer]);
		} catch (e) {
			return Fa._canTransferArrayBuffer = !1, Fa._canTransferArrayBuffer;
		}
		Fa._canTransferArrayBuffer = new Promise((e) => {
			t.onmessage = function(n) {
				const i = n.data.array, o = N(i) && i[0] === r;
				e(o), t.terminate(), Fa._canTransferArrayBuffer = o;
			};
		});
	}
	return Fa._canTransferArrayBuffer;
}
Object.freeze(Sa), Object.defineProperties(Ia.prototype, {
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
}), Ia.prototype.getFragmentShaderSource = function() {
	const e = [];
	return this.flat && e.push("#define FLAT"), this.faceForward && e.push("#define FACE_FORWARD"), N(this.material) && e.push(this.material.shaderSource), e.push(this.fragmentShaderSource), e.join("\n");
}, Ia.prototype.isTranslucent = function() {
	return N(this.material) && this.material.isTranslucent() || !N(this.material) && this.translucent;
}, Ia.prototype.getRenderState = function() {
	const e = this.isTranslucent(), t = st(this.renderState, !1);
	return e ? (t.depthMask = !1, t.blending = Ra.ALPHA_BLEND) : t.depthMask = !0, t;
}, Ia.getDefaultRenderState = function(e, t, r) {
	let n = { depthTest: { enabled: !0 } };
	return e && (n.depthMask = !1, n.blending = Ra.ALPHA_BLEND), t && (n.cull = {
		enabled: !0,
		face: Sa.BACK
	}), N(r) && (n = ut(r, n, !0)), n;
}, Object.defineProperties(Na.prototype, {
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
}), Na.clone = function(e) {
	if (N(e)) return new Na(e._format, e._datatype, e._width, e._height, e._buffer);
}, Na.prototype.clone = function() {
	return Na.clone(this);
};
const Pa = new L();
function Ma(e) {
	let t;
	try {
		t = new Blob([e], { type: "application/javascript" });
	} catch (r) {
		const i = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder)();
		i.append(e), t = i.getBlob("application/javascript");
	}
	return (window.URL || window.webkitURL).createObjectURL(t);
}
function La(e) {
	const t = new lt.default(e), r = 0 !== t.scheme().length && 0 === t.fragment().length, n = e.replace(/\.js$/, ""), i = {};
	let o, a;
	if (_t(e)) a = e;
	else if (!r) {
		const e = pr(`${Fa._workerModulePrefix}/${n}.js`);
		_t(e) && (a = e);
	}
	if (a) return o = Ma(`import "${a}";`), i.type = "module", new Worker(o, i);
	if (!r && "undefined" != typeof CESIUM_WORKERS) return o = Ma(`\n      importScripts("${Ma(CESIUM_WORKERS)}");\n      CesiumWorkers["${n}"]();\n    `), new Worker(o, i);
	if (o = e, r || (o = pr(`${Fa._workerModulePrefix + n}.js`)), !wn.supportsEsmWebWorkers()) throw new Rt("This browser is not supported. Please update your browser to continue.");
	return i.type = "module", new Worker(o, i);
}
function Fa(e, t) {
	this._workerPath = e, this._maximumActiveTasks = t ?? Number.POSITIVE_INFINITY, this._activeTasks = 0, this._nextID = 0, this._webAssemblyPromise = void 0;
}
const Da = [];
function za() {}
let Ba;
function Ua(e) {
	let t;
	return P.defined("resourceOrUrlOrBuffer", e), t = e instanceof ArrayBuffer || ArrayBuffer.isView(e) ? Promise.resolve(e) : Gt.createIfNeeded(e).fetchArrayBuffer(), t.then(function(e) {
		return za.transcode(e, Ba);
	});
}
Fa.prototype.scheduleTask = function(e, t) {
	if (N(this._worker) || (this._worker = La(this._workerPath)), !(this._activeTasks >= this._maximumActiveTasks)) return async function(e, t, r) {
		++e._activeTasks;
		try {
			const n = await async function(e, t, r) {
				const n = await Promise.resolve(va());
				N(r) ? n || (r.length = 0) : r = Da;
				const i = e._nextID++, o = new Promise((t, r) => {
					e._worker.addEventListener("message", ((e, t, r, n) => {
						const i = ({ data: o }) => {
							if (o.id === t) {
								if (N(o.error)) {
									let e = o.error;
									"RuntimeError" === e.name ? (e = new Rt(o.error.message), e.stack = o.error.stack) : "DeveloperError" === e.name ? (e = new v(o.error.message), e.stack = o.error.stack) : "Error" === e.name && (e = new Error(o.error.message), e.stack = o.error.stack), Pa.raiseEvent(e), n(e);
								} else Pa.raiseEvent(), r(o.result);
								e.removeEventListener("message", i);
							}
						};
						return i;
					})(e._worker, i, t, r));
				});
				return e._worker.postMessage({
					id: i,
					baseUrl: pr.getCesiumBaseUrl().url,
					parameters: t,
					canTransferArrayBuffer: n
				}, r), o;
			}(e, t, r);
			return --e._activeTasks, n;
		} catch (t) {
			throw --e._activeTasks, t;
		}
	}(this, e, t);
}, Fa.prototype.initWebAssemblyModule = async function(e) {
	return N(this._webAssemblyPromise) || (this._webAssemblyPromise = (async () => {
		const t = this._worker = La(this._workerPath), r = await async function(e, t) {
			const r = {
				modulePath: void 0,
				wasmBinaryFile: void 0,
				wasmBinary: void 0
			};
			if (!wn.supportsWebAssembly()) {
				if (!N(t.fallbackModulePath)) throw new Rt(`This browser does not support Web Assembly, and no backup module was provided for ${e._workerPath}`);
				return r.modulePath = pr(t.fallbackModulePath), r;
			}
			return r.wasmBinaryFile = pr(t.wasmBinaryFile), r.wasmBinary = await Gt.fetchArrayBuffer({ url: r.wasmBinaryFile }), r;
		}(this, e), n = await Promise.resolve(va());
		let i;
		const o = r.wasmBinary;
		N(o) && n && (i = [o]);
		const a = new Promise((e, r) => {
			t.onmessage = function({ data: t }) {
				N(t) ? e(t.result) : r(new Rt("Could not configure wasm module"));
			};
		});
		return t.postMessage({
			canTransferArrayBuffer: n,
			parameters: { webAssemblyConfig: r }
		}, i), a;
	})()), this._webAssemblyPromise;
}, Fa.prototype.isDestroyed = function() {
	return !1;
}, Fa.prototype.destroy = function() {
	return N(this._worker) && this._worker.terminate(), eo(this);
}, Fa.taskCompletedEvent = Pa, Fa._defaultWorkerModulePrefix = "Workers/", Fa._workerModulePrefix = Fa._defaultWorkerModulePrefix, Fa._canTransferArrayBuffer = void 0, za._transcodeTaskProcessor = new Fa("transcodeKTX2", Number.POSITIVE_INFINITY), za._readyPromise = void 0, za.transcode = function(e, t) {
	return P.defined("supportedTargetFormats", t), N(za._readyPromise) || (za._readyPromise = za._transcodeTaskProcessor.initWebAssemblyModule({ wasmBinaryFile: "ThirdParty/basis_transcoder.wasm" }).then(function(e) {
		if (e) return za._transcodeTaskProcessor;
		throw new Rt("KTX2 transcoder could not be initialized.");
	})), za._readyPromise.then(function(r) {
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
				t[r[e]] = new Na(n.internalFormat, n.datatype, n.width, n.height, n.levelBuffer);
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
}, Ua.setKTX2SupportedFormats = function(e, t, r, n, i, o) {
	Ba = {
		s3tc: e,
		pvrtc: t,
		astc: r,
		etc: n,
		etc1: i,
		bc7: o
	};
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
			case ja.VEC2: return q;
			case ja.VEC3: return Y;
			case ja.VEC4: return Te;
			case ja.MAT2: return Xo;
			case ja.MAT3: return Er;
			case ja.MAT4: return Mr;
			default: throw new v("attributeType is not a valid value.");
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
			default: throw new v("attributeType is not a valid value.");
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
			default: throw new v("attributeType is not a valid value.");
		}
	},
	getGlslType: function(e) {
		switch (P.typeOf.string("attributeType", e), e) {
			case ja.SCALAR: return "float";
			case ja.VEC2: return "vec2";
			case ja.VEC3: return "vec3";
			case ja.VEC4: return "vec4";
			case ja.MAT2: return "mat2";
			case ja.MAT3: return "mat3";
			case ja.MAT4: return "mat4";
			default: throw new v("attributeType is not a valid value.");
		}
	}
};
Object.freeze(ja);
const qa = 1 / 256, Ga = {
	octEncodeInRange: function(e, t, r) {
		P.defined("vector", e), P.defined("result", r);
		const n = Y.magnitudeSquared(e);
		if (Math.abs(n - 1) > B.EPSILON6) throw new v("vector must be normalized.");
		if (r.x = e.x / (Math.abs(e.x) + Math.abs(e.y) + Math.abs(e.z)), r.y = e.y / (Math.abs(e.x) + Math.abs(e.y) + Math.abs(e.z)), e.z < 0) {
			const e = r.x, t = r.y;
			r.x = (1 - Math.abs(t)) * B.signNotZero(e), r.y = (1 - Math.abs(e)) * B.signNotZero(t);
		}
		return r.x = B.toSNorm(r.x, t), r.y = B.toSNorm(r.y, t), r;
	},
	octEncode: function(e, t) {
		return Ga.octEncodeInRange(e, 255, t);
	}
}, Wa = new q(), ka = /* @__PURE__ */ new Uint8Array(1);
function Va(e) {
	return ka[0] = e, ka[0];
}
Ga.octEncodeToCartesian4 = function(e, t) {
	return Ga.octEncodeInRange(e, 65535, Wa), t.x = Va(Wa.x * qa), t.y = Va(Wa.x), t.z = Va(Wa.y * qa), t.w = Va(Wa.y), t;
}, Ga.octDecodeInRange = function(e, t, r, n) {
	if (P.defined("result", n), e < 0 || e > r || t < 0 || t > r) throw new v(`x and y must be unsigned normalized integers between 0 and ${r}`);
	if (n.x = B.fromSNorm(e, r), n.y = B.fromSNorm(t, r), n.z = 1 - (Math.abs(n.x) + Math.abs(n.y)), n.z < 0) {
		const e = n.x;
		n.x = (1 - Math.abs(n.y)) * B.signNotZero(e), n.y = (1 - Math.abs(e)) * B.signNotZero(n.y);
	}
	return Y.normalize(n, n);
}, Ga.octDecode = function(e, t, r) {
	return Ga.octDecodeInRange(e, t, 255, r);
}, Ga.octDecodeFromCartesian4 = function(e, t) {
	P.typeOf.object("encoded", e), P.typeOf.object("result", t);
	const r = e.x, n = e.y, i = e.z, o = e.w;
	if (r < 0 || r > 255 || n < 0 || n > 255 || i < 0 || i > 255 || o < 0 || o > 255) throw new v("x, y, z, and w must be unsigned normalized integers between 0 and 255");
	const a = 256 * r + n, s = 256 * i + o;
	return Ga.octDecodeInRange(a, s, 65535, t);
}, Ga.octPackFloat = function(e) {
	return P.defined("encoded", e), 256 * e.x + e.y;
};
const Ha = new q();
function Ya(e) {
	return e >> 1 ^ -(1 & e);
}
Ga.octEncodeFloat = function(e) {
	return Ga.octEncode(e, Ha), Ga.octPackFloat(Ha);
}, Ga.octDecodeFloat = function(e, t) {
	P.defined("value", e);
	const r = e / 256, n = Math.floor(r), i = 256 * (r - n);
	return Ga.octDecode(n, i, t);
}, Ga.octPack = function(e, t, r, n) {
	P.defined("v1", e), P.defined("v2", t), P.defined("v3", r), P.defined("result", n);
	const i = Ga.octEncodeFloat(e), o = Ga.octEncodeFloat(t), a = Ga.octEncode(r, Ha);
	return n.x = 65536 * a.x + i, n.y = 65536 * a.y + o, n;
}, Ga.octUnpack = function(e, t, r, n) {
	P.defined("packed", e), P.defined("v1", t), P.defined("v2", r), P.defined("v3", n);
	let i = e.x / 65536;
	const o = Math.floor(i), a = 65536 * (i - o);
	i = e.y / 65536;
	const s = Math.floor(i), u = 65536 * (i - s);
	Ga.octDecodeFloat(a, t), Ga.octDecodeFloat(u, r), Ga.octDecode(o, s, n);
}, Ga.compressTextureCoordinates = function(e) {
	return P.defined("textureCoordinates", e), 4096 * (4095 * e.x | 0) + (4095 * e.y | 0);
}, Ga.decompressTextureCoordinates = function(e, t) {
	P.defined("compressed", e), P.defined("result", t);
	const r = e / 4096, n = Math.floor(r);
	return t.x = n / 4095, t.y = (e - 4096 * n) / 4095, t;
}, Ga.zigZagDeltaDecode = function(e, t, r) {
	P.defined("uBuffer", e), P.defined("vBuffer", t), P.typeOf.number.equals("uBuffer.length", "vBuffer.length", e.length, t.length), N(r) && P.typeOf.number.equals("uBuffer.length", "heightBuffer.length", e.length, r.length);
	const n = e.length;
	let i = 0, o = 0, a = 0;
	for (let s = 0; s < n; ++s) i += Ya(e[s]), o += Ya(t[s]), e[s] = i, t[s] = o, N(r) && (a += Ya(r[s]), r[s] = a);
}, Ga.dequantize = function(e, t, r, n) {
	P.defined("typedArray", e), P.defined("componentDatatype", t), P.defined("type", r), P.defined("count", n);
	const i = ja.getNumberOfComponents(r);
	let o;
	switch (t) {
		case Ho.BYTE:
			o = 127;
			break;
		case Ho.UNSIGNED_BYTE:
			o = 255;
			break;
		case Ho.SHORT:
			o = 32767;
			break;
		case Ho.UNSIGNED_SHORT:
			o = 65535;
			break;
		case Ho.INT:
			o = 2147483647;
			break;
		case Ho.UNSIGNED_INT:
			o = 4294967295;
			break;
		default: throw new v(`Cannot dequantize component datatype: ${t}`);
	}
	const a = new Float32Array(n * i);
	for (let s = 0; s < n; s++) for (let t = 0; t < i; t++) {
		const r = s * i + t;
		a[r] = Math.max(e[r] / o, -1);
	}
	return a;
}, Ga.encodeRGB8 = function(e) {
	return P.typeOf.object("color", e), 65536 * Math.round(B.clamp(255 * e.red, 0, 255)) + 256 * Math.round(B.clamp(255 * e.green, 0, 255)) + Math.round(B.clamp(255 * e.blue, 0, 255));
}, Ga.decodeRGB8 = function(e, t) {
	return P.typeOf.number("encoded", e), P.typeOf.object("result", t), e = Math.floor(e), t.red = (e >> 16 & 255) / 255, t.green = (e >> 8 & 255) / 255, t.blue = (255 & e) / 255, t;
}, Ga.decodeRGB565 = function(e, t) {
	P.defined("typedArray", e);
	const r = 3 * e.length;
	N(t) && P.typeOf.number.equals("result.length", "typedArray.length * 3", t.length, r);
	const n = e.length;
	N(t) || (t = new Float32Array(3 * n));
	const i = 1 / 31, o = 1 / 63;
	for (let a = 0; a < n; a++) {
		const r = e[a], n = r >> 11, s = r >> 5 & 63, u = 31 & r, c = 3 * a;
		t[c] = n * i, t[c + 1] = s * o, t[c + 2] = u * i;
	}
	return t;
};
const Xa = new Y(), $a = new Y(), Ka = new Y();
function Za() {
	this.high = Y.clone(Y.ZERO), this.low = Y.clone(Y.ZERO);
}
Za.encode = function(e, t) {
	let r;
	return P.typeOf.number("value", e), N(t) || (t = {
		high: 0,
		low: 0
	}), e >= 0 ? (r = 65536 * Math.floor(e / 65536), t.high = r, t.low = e - r) : (r = 65536 * Math.floor(-e / 65536), t.high = -r, t.low = e + r), t;
};
const Qa = {
	high: 0,
	low: 0
};
Za.fromCartesian = function(e, t) {
	P.typeOf.object("cartesian", e), N(t) || (t = new Za());
	const r = t.high, n = t.low;
	return Za.encode(e.x, Qa), r.x = Qa.high, n.x = Qa.low, Za.encode(e.y, Qa), r.y = Qa.high, n.y = Qa.low, Za.encode(e.z, Qa), r.z = Qa.high, n.z = Qa.low, t;
};
const Ja = new Za();
Za.writeElements = function(e, t, r) {
	P.defined("cartesianArray", t), P.typeOf.number("index", r), P.typeOf.number.greaterThanOrEquals("index", r, 0), Za.fromCartesian(e, Ja);
	const n = Ja.high, i = Ja.low;
	t[r] = n.x, t[r + 1] = n.y, t[r + 2] = n.z, t[r + 3] = i.x, t[r + 4] = i.y, t[r + 5] = i.z;
};
const es = {
	UNSIGNED_BYTE: Vo.UNSIGNED_BYTE,
	UNSIGNED_SHORT: Vo.UNSIGNED_SHORT,
	UNSIGNED_INT: Vo.UNSIGNED_INT,
	getSizeInBytes: function(e) {
		switch (e) {
			case es.UNSIGNED_BYTE: return Uint8Array.BYTES_PER_ELEMENT;
			case es.UNSIGNED_SHORT: return Uint16Array.BYTES_PER_ELEMENT;
			case es.UNSIGNED_INT: return Uint32Array.BYTES_PER_ELEMENT;
		}
		throw new v("indexDatatype is required and must be a valid IndexDatatype constant.");
	},
	fromSizeInBytes: function(e) {
		switch (e) {
			case 2: return es.UNSIGNED_SHORT;
			case 4: return es.UNSIGNED_INT;
			case 1: return es.UNSIGNED_BYTE;
			default: throw new v("Size in bytes cannot be mapped to an IndexDatatype");
		}
	},
	validate: function(e) {
		return N(e) && (e === es.UNSIGNED_BYTE || e === es.UNSIGNED_SHORT || e === es.UNSIGNED_INT);
	},
	createTypedArray: function(e, t) {
		if (!N(e)) throw new v("numberOfVertices is required.");
		return e >= B.SIXTY_FOUR_KILOBYTES ? new Uint32Array(t) : new Uint16Array(t);
	},
	createTypedArrayFromArrayBuffer: function(e, t, r, n) {
		if (!N(e)) throw new v("numberOfVertices is required.");
		if (!N(t)) throw new v("sourceArray is required.");
		if (!N(r)) throw new v("byteOffset is required.");
		return e >= B.SIXTY_FOUR_KILOBYTES ? new Uint32Array(t, r, n) : new Uint16Array(t, r, n);
	},
	fromTypedArray: function(e) {
		if (e instanceof Uint8Array) return es.UNSIGNED_BYTE;
		if (e instanceof Uint16Array) return es.UNSIGNED_SHORT;
		if (e instanceof Uint32Array) return es.UNSIGNED_INT;
		throw new v("array must be a Uint8Array, Uint16Array, or Uint32Array.");
	}
};
Object.freeze(es);
const ts = {};
function rs(e, t, r) {
	const n = e + t;
	return B.sign(e) !== B.sign(t) && Math.abs(n / Math.max(Math.abs(e), Math.abs(t))) < r ? 0 : n;
}
ts.computeDiscriminant = function(e, t, r) {
	if ("number" != typeof e) throw new v("a is a required number.");
	if ("number" != typeof t) throw new v("b is a required number.");
	if ("number" != typeof r) throw new v("c is a required number.");
	return t * t - 4 * e * r;
}, ts.computeRealRoots = function(e, t, r) {
	if ("number" != typeof e) throw new v("a is a required number.");
	if ("number" != typeof t) throw new v("b is a required number.");
	if ("number" != typeof r) throw new v("c is a required number.");
	let n;
	if (0 === e) return 0 === t ? [] : [-r / t];
	if (0 === t) {
		if (0 === r) return [0, 0];
		const t = Math.abs(r), i = Math.abs(e);
		if (t < i && t / i < B.EPSILON14) return [0, 0];
		if (t > i && i / t < B.EPSILON14) return [];
		if (n = -r / e, n < 0) return [];
		const o = Math.sqrt(n);
		return [-o, o];
	}
	if (0 === r) return n = -t / e, n < 0 ? [n, 0] : [0, n];
	const i = rs(t * t, -4 * e * r, B.EPSILON14);
	if (i < 0) return [];
	const o = -.5 * rs(t, B.sign(t) * Math.sqrt(i), B.EPSILON14);
	return t > 0 ? [o / e, r / o] : [r / o, o / e];
};
const ns = {};
function is(e, t, r, n) {
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
	const g = h, E = -2 * o * h + i * p, b = m, T = -s * p + 2 * a * m, O = Math.sqrt(d), w = Math.sqrt(3) / 2;
	let A = Math.abs(Math.atan2(i * O, -E) / 3);
	y = 2 * Math.sqrt(-g);
	let x = Math.cos(A);
	_ = y * x;
	let R = y * (-x / 2 - w * Math.sin(A));
	const S = _ + R > 2 * o ? _ - o : R - o, I = i, C = S / I;
	A = Math.abs(Math.atan2(s * O, -T) / 3), y = 2 * Math.sqrt(-b), x = Math.cos(A), _ = y * x, R = y * (-x / 2 - w * Math.sin(A));
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
ns.computeDiscriminant = function(e, t, r, n) {
	if ("number" != typeof e) throw new v("a is a required number.");
	if ("number" != typeof t) throw new v("b is a required number.");
	if ("number" != typeof r) throw new v("c is a required number.");
	if ("number" != typeof n) throw new v("d is a required number.");
	const i = t * t, o = r * r;
	return 18 * e * t * r * n + i * o - e * e * 27 * (n * n) - 4 * (e * o * r + i * t * n);
}, ns.computeRealRoots = function(e, t, r, n) {
	if ("number" != typeof e) throw new v("a is a required number.");
	if ("number" != typeof t) throw new v("b is a required number.");
	if ("number" != typeof r) throw new v("c is a required number.");
	if ("number" != typeof n) throw new v("d is a required number.");
	let i, o;
	if (0 === e) return ts.computeRealRoots(t, r, n);
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
		return 0 === n ? (i = ts.computeRealRoots(e, 0, r), 0 === i.Length ? [0] : [
			i[0],
			0,
			i[1]
		]) : is(e, 0, r, n);
	}
	return 0 === r ? 0 === n ? (o = -t / e, o < 0 ? [
		o,
		0,
		0
	] : [
		0,
		0,
		o
	]) : is(e, t, 0, n) : 0 === n ? (i = ts.computeRealRoots(e, t, r), 0 === i.length ? [0] : i[1] <= 0 ? [
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
	]) : is(e, t, r, n);
};
const os = {};
os.computeDiscriminant = function(e, t, r, n, i) {
	if ("number" != typeof e) throw new v("a is a required number.");
	if ("number" != typeof t) throw new v("b is a required number.");
	if ("number" != typeof r) throw new v("c is a required number.");
	if ("number" != typeof n) throw new v("d is a required number.");
	if ("number" != typeof i) throw new v("e is a required number.");
	const o = e * e, a = t * t, s = a * t, u = r * r, c = u * r, l = n * n, f = l * n, h = i * i;
	return a * u * l - 4 * s * f - 4 * e * c * l + 18 * e * t * r * f - 27 * o * l * l + o * e * 256 * (h * i) + i * (18 * s * r * n - 4 * a * c + 16 * e * u * u - 80 * e * t * u * n - 6 * e * a * l + 144 * o * r * l) + h * (144 * e * a * r - 27 * a * a - 128 * o * u - 192 * o * t * n);
}, os.computeRealRoots = function(e, t, r, n, i) {
	if ("number" != typeof e) throw new v("a is a required number.");
	if ("number" != typeof t) throw new v("b is a required number.");
	if ("number" != typeof r) throw new v("c is a required number.");
	if ("number" != typeof n) throw new v("d is a required number.");
	if ("number" != typeof i) throw new v("e is a required number.");
	if (Math.abs(e) < B.EPSILON15) return ns.computeRealRoots(t, r, n, i);
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
			const i = e * e, o = t - 3 * i / 8, a = r - t * e / 2 + i * e / 8, s = n - r * e / 4 + t * i / 16 - 3 * i * i / 256, u = ns.computeRealRoots(1, 2 * o, o * o - 4 * s, -a * a);
			if (u.length > 0) {
				const t = -e / 4, r = u[u.length - 1];
				if (Math.abs(r) < B.EPSILON14) {
					const e = ts.computeRealRoots(1, o, s);
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
					const e = Math.sqrt(r), n = (o + r - a / e) / 2, i = (o + r + a / e) / 2, s = ts.computeRealRoots(1, e, n), u = ts.computeRealRoots(1, -e, i);
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
			const i = e * e, o = -2 * t, a = r * e + t * t - 4 * n, s = i * n - r * t * e + r * r, u = ns.computeRealRoots(1, o, a, s);
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
				0 === c && 0 === d ? (_ = 0, g = 0) : B.sign(c) === B.sign(d) ? (_ = c + d, g = o / _) : (g = c - d, _ = o / g), 0 === l && 0 === y ? (E = 0, b = 0) : B.sign(l) === B.sign(y) ? (E = l + y, b = n / E) : (b = l - y, E = n / b);
				const T = ts.computeRealRoots(1, _, E), O = ts.computeRealRoots(1, g, b);
				if (0 !== T.length) return 0 !== O.length ? T[1] <= O[0] ? [
					T[0],
					T[1],
					O[0],
					O[1]
				] : O[1] <= T[0] ? [
					O[0],
					O[1],
					T[0],
					T[1]
				] : T[0] >= O[0] && T[1] <= O[1] ? [
					O[0],
					T[0],
					T[1],
					O[1]
				] : O[0] >= T[0] && O[1] <= T[1] ? [
					T[0],
					O[0],
					O[1],
					T[1]
				] : T[0] > O[0] && T[0] < O[1] ? [
					O[0],
					T[0],
					O[1],
					T[1]
				] : [
					T[0],
					O[0],
					T[1],
					O[1]
				] : T;
				if (0 !== O.length) return O;
			}
			return [];
		}(o, a, s, u);
		default: return;
	}
};
var as = class e {
	constructor(e, t) {
		t = Y.clone(t ?? Y.ZERO), Y.equals(t, Y.ZERO) || Y.normalize(t, t), this.origin = Y.clone(e ?? Y.ZERO), this.direction = t;
	}
	static clone(t, r) {
		if (N(t)) return N(r) ? (r.origin = Y.clone(t.origin), r.direction = Y.clone(t.direction), r) : new e(t.origin, t.direction);
	}
	static getPoint(e, t, r) {
		return P.typeOf.object("ray", e), P.typeOf.number("t", t), N(r) || (r = new Y()), r = Y.multiplyByScalar(e.direction, t, r), Y.add(e.origin, r, r);
	}
};
const ss = { rayPlane: function(e, t, r) {
	if (!N(e)) throw new v("ray is required.");
	if (!N(t)) throw new v("plane is required.");
	N(r) || (r = new Y());
	const n = e.origin, i = e.direction, o = t.normal, a = Y.dot(o, i);
	if (Math.abs(a) < B.EPSILON15) return;
	const s = (-t.distance - Y.dot(o, n)) / a;
	return s < 0 ? void 0 : (r = Y.multiplyByScalar(i, s, r), Y.add(n, r, r));
} }, us = new Y(), cs = new Y(), ls = new Y(), fs = new Y(), hs = new Y();
ss.rayTriangleParametric = function(e, t, r, n, i) {
	if (!N(e)) throw new v("ray is required.");
	if (!N(t)) throw new v("p0 is required.");
	if (!N(r)) throw new v("p1 is required.");
	if (!N(n)) throw new v("p2 is required.");
	i = i ?? !1;
	const o = e.origin, a = e.direction, s = Y.subtract(r, t, us), u = Y.subtract(n, t, cs), c = Y.cross(a, u, ls), l = Y.dot(s, c);
	let f, h, p, m, d;
	if (i) {
		if (l < B.EPSILON6) return;
		if (f = Y.subtract(o, t, fs), p = Y.dot(f, c), p < 0 || p > l) return;
		if (h = Y.cross(f, s, hs), m = Y.dot(a, h), m < 0 || p + m > l) return;
		d = Y.dot(u, h) / l;
	} else {
		if (Math.abs(l) < B.EPSILON6) return;
		const e = 1 / l;
		if (f = Y.subtract(o, t, fs), p = Y.dot(f, c) * e, p < 0 || p > 1) return;
		if (h = Y.cross(f, s, hs), m = Y.dot(a, h) * e, m < 0 || p + m > 1) return;
		d = Y.dot(u, h) * e;
	}
	return d;
}, ss.rayTriangle = function(e, t, r, n, i, o) {
	const a = ss.rayTriangleParametric(e, t, r, n, i);
	if (N(a) && !(a < 0)) return N(o) || (o = new Y()), Y.multiplyByScalar(e.direction, a, o), Y.add(e.origin, o, o);
};
const ps = new as();
ss.lineSegmentTriangle = function(e, t, r, n, i, o, a) {
	if (!N(e)) throw new v("v0 is required.");
	if (!N(t)) throw new v("v1 is required.");
	if (!N(r)) throw new v("p0 is required.");
	if (!N(n)) throw new v("p1 is required.");
	if (!N(i)) throw new v("p2 is required.");
	const s = ps;
	Y.clone(e, s.origin), Y.subtract(t, e, s.direction), Y.normalize(s.direction, s.direction);
	const u = ss.rayTriangleParametric(s, r, n, i, o);
	if (!(!N(u) || u < 0 || u > Y.distance(e, t))) return N(a) || (a = new Y()), Y.multiplyByScalar(s.direction, u, a), Y.add(s.origin, a, a);
};
const ms = {
	root0: 0,
	root1: 0
};
function ds(e, t, r) {
	N(r) || (r = new oo());
	const n = e.origin, i = e.direction, o = t.center, a = t.radius * t.radius, s = Y.subtract(n, o, ls), u = function(e, t, r, n) {
		const i = t * t - 4 * e * r;
		if (i < 0) return;
		if (i > 0) {
			const r = 1 / (2 * e), o = Math.sqrt(i), a = (-t + o) * r, s = (-t - o) * r;
			return a < s ? (n.root0 = a, n.root1 = s) : (n.root0 = s, n.root1 = a), n;
		}
		const o = -t / (2 * e);
		return 0 !== o ? (n.root0 = n.root1 = o, n) : void 0;
	}(Y.dot(i, i), 2 * Y.dot(i, s), Y.magnitudeSquared(s) - a, ms);
	if (N(u)) return r.start = u.root0, r.stop = u.root1, r;
}
ss.raySphere = function(e, t, r) {
	if (!N(e)) throw new v("ray is required.");
	if (!N(t)) throw new v("sphere is required.");
	if (N(r = ds(e, t, r)) && !(r.stop < 0)) return r.start = Math.max(r.start, 0), r;
};
const ys = new as();
ss.lineSegmentSphere = function(e, t, r, n) {
	if (!N(e)) throw new v("p0 is required.");
	if (!N(t)) throw new v("p1 is required.");
	if (!N(r)) throw new v("sphere is required.");
	const i = ys;
	Y.clone(e, i.origin);
	const o = Y.subtract(t, e, i.direction), a = Y.magnitude(o);
	if (Y.normalize(o, o), !(!N(n = ds(i, r, n)) || n.stop < 0 || n.start > a)) return n.start = Math.max(n.start, 0), n.stop = Math.min(n.stop, a), n;
};
const _s = new Y(), gs = new Y();
ss.rayEllipsoid = function(e, t) {
	if (!N(e)) throw new v("ray is required.");
	if (!N(t)) throw new v("ellipsoid is required.");
	const r = t.oneOverRadii, n = Y.multiplyComponents(r, e.origin, _s), i = Y.multiplyComponents(r, e.direction, gs), o = Y.magnitudeSquared(n), a = Y.dot(n, i);
	let s, u, c, l, f;
	if (o > 1) {
		if (a >= 0) return;
		const e = a * a;
		if (s = o - 1, u = Y.magnitudeSquared(i), c = u * s, e < c) return;
		if (e > c) {
			l = a * a - c, f = -a + Math.sqrt(l);
			const e = f / u, t = s / f;
			return e < t ? new oo(e, t) : {
				start: t,
				stop: e
			};
		}
		const t = Math.sqrt(s / u);
		return new oo(t, t);
	}
	return o < 1 ? (s = o - 1, u = Y.magnitudeSquared(i), c = u * s, l = a * a - c, f = -a + Math.sqrt(l), new oo(0, f / u)) : a < 0 ? (u = Y.magnitudeSquared(i), new oo(0, -a / u)) : void 0;
};
const Es = new oo(), bs = new oo(), Ts = new oo();
function Os(e, t, r, n, i) {
	if (i.start = (r - e) / t, i.stop = (n - e) / t, i.stop < i.start) {
		const e = i.stop;
		i.stop = i.start, i.start = e;
	}
	return i;
}
function ws(e, t, r) {
	const n = e + t;
	return B.sign(e) !== B.sign(t) && Math.abs(n / Math.max(Math.abs(e), Math.abs(t))) < r ? 0 : n;
}
ss.rayAxisAlignedBoundingBox = function(e, t, r) {
	if (!N(e)) throw new v("ray is required.");
	if (!N(t)) throw new v("box is required.");
	N(r) || (r = new oo());
	const n = Os(e.origin.x, e.direction.x, t.minimum.x, t.maximum.x, Es), i = Os(e.origin.y, e.direction.y, t.minimum.y, t.maximum.y, bs), o = Os(e.origin.z, e.direction.z, t.minimum.z, t.maximum.z, Ts);
	if (r.start = n.start > i.start ? n.start : i.start, r.stop = n.stop < i.stop ? n.stop : i.stop, !(n.start > i.stop || i.start > n.stop || r.start > o.stop || o.start > r.stop)) return o.start > r.start && (r.start = o.start), o.stop < r.stop && (r.stop = o.stop), r;
}, ss.quadraticVectorExpression = function(e, t, r, n, i) {
	const o = n * n, a = i * i, s = (e[Er.COLUMN1ROW1] - e[Er.COLUMN2ROW2]) * a, u = i * (n * ws(e[Er.COLUMN1ROW0], e[Er.COLUMN0ROW1], B.EPSILON15) + t.y), c = e[Er.COLUMN0ROW0] * o + e[Er.COLUMN2ROW2] * a + n * t.x + r, l = a * ws(e[Er.COLUMN2ROW1], e[Er.COLUMN1ROW2], B.EPSILON15), f = i * (n * ws(e[Er.COLUMN2ROW0], e[Er.COLUMN0ROW2]) + t.z);
	let h;
	const p = [];
	if (0 === f && 0 === l) {
		if (h = ts.computeRealRoots(s, u, c), 0 === h.length) return p;
		const e = h[0], t = Math.sqrt(Math.max(1 - e * e, 0));
		if (p.push(new Y(n, i * e, i * -t)), p.push(new Y(n, i * e, i * t)), 2 === h.length) {
			const e = h[1], t = Math.sqrt(Math.max(1 - e * e, 0));
			p.push(new Y(n, i * e, i * -t)), p.push(new Y(n, i * e, i * t));
		}
		return p;
	}
	const m = f * f, d = l * l, y = f * l, _ = s * s + d, g = 2 * (u * s + y), E = 2 * c * s + u * u - d + m, b = 2 * (c * u - y), T = c * c - m;
	if (0 === _ && 0 === g && 0 === E && 0 === b) return p;
	h = os.computeRealRoots(_, g, E, b, T);
	const O = h.length;
	if (0 === O) return p;
	for (let w = 0; w < O; ++w) {
		const e = h[w], t = e * e, r = Math.max(1 - t, 0), o = Math.sqrt(r);
		let a;
		a = B.sign(s) === B.sign(c) ? ws(s * t + c, u * e, B.EPSILON12) : B.sign(c) === B.sign(u * e) ? ws(s * t, u * e + c, B.EPSILON12) : ws(s * t + u * e, c, B.EPSILON12);
		const m = a * ws(l * e, f, B.EPSILON15);
		m < 0 ? p.push(new Y(n, i * e, i * o)) : m > 0 ? p.push(new Y(n, i * e, i * -o)) : 0 !== o ? (p.push(new Y(n, i * e, i * -o)), p.push(new Y(n, i * e, i * o)), ++w) : p.push(new Y(n, i * e, i * o));
	}
	return p;
};
const As = new Y(), xs = new Y(), Rs = new Y(), Ss = new Y(), Is = new Y(), Cs = new Er(), Ns = new Er(), vs = new Er(), Ps = new Er(), Ms = new Er(), Ls = new Er(), Fs = new Er(), Ds = new Y(), zs = new Y(), Bs = new ie();
ss.grazingAltitudeLocation = function(e, t) {
	if (!N(e)) throw new v("ray is required.");
	if (!N(t)) throw new v("ellipsoid is required.");
	const r = e.origin, n = e.direction;
	if (!Y.equals(r, Y.ZERO)) {
		const e = t.geodeticSurfaceNormal(r, As);
		if (Y.dot(n, e) >= 0) return r;
	}
	const i = N(this.rayEllipsoid(e, t)), o = t.transformPositionToScaledSpace(n, As), a = Y.normalize(o, o), s = Y.mostOrthogonalAxis(o, Ss), u = Y.normalize(Y.cross(s, a, xs), xs), c = Y.normalize(Y.cross(a, u, Rs), Rs), l = Cs;
	l[0] = a.x, l[1] = a.y, l[2] = a.z, l[3] = u.x, l[4] = u.y, l[5] = u.z, l[6] = c.x, l[7] = c.y, l[8] = c.z;
	const f = Er.transpose(l, Ns), h = Er.fromScale(t.radii, vs), p = Er.fromScale(t.oneOverRadii, Ps), m = Ms;
	m[0] = 0, m[1] = -n.z, m[2] = n.y, m[3] = n.z, m[4] = 0, m[5] = -n.x, m[6] = -n.y, m[7] = n.x, m[8] = 0;
	const d = Er.multiply(Er.multiply(f, p, Ls), m, Ls), y = Er.multiply(Er.multiply(d, h, Fs), l, Fs), _ = Er.multiplyByVector(d, r, Is), g = ss.quadraticVectorExpression(y, Y.negate(_, As), 0, 0, 1);
	let E, b;
	const T = g.length;
	if (T > 0) {
		let e = Y.clone(Y.ZERO, zs), o = Number.NEGATIVE_INFINITY;
		for (let t = 0; t < T; ++t) {
			E = Er.multiplyByVector(h, Er.multiplyByVector(l, g[t], Ds), Ds);
			const i = Y.normalize(Y.subtract(E, r, Ss), Ss), a = Y.dot(i, n);
			a > o && (o = a, e = Y.clone(E, e));
		}
		const a = t.cartesianToCartographic(e, Bs);
		return o = B.clamp(o, 0, 1), b = Y.magnitude(Y.subtract(e, r, Ss)) * Math.sqrt(1 - o * o), b = i ? -b : b, a.height = b, t.cartographicToCartesian(a, new Y());
	}
};
const Us = new Y();
function js(e, t) {
	if (P.typeOf.object("normal", e), !B.equalsEpsilon(Y.magnitude(e), 1, B.EPSILON6)) throw new v("normal must be normalized.");
	P.typeOf.number("distance", t), this.normal = Y.clone(e), this.distance = t;
}
ss.lineSegmentPlane = function(e, t, r, n) {
	if (!N(e)) throw new v("endPoint0 is required.");
	if (!N(t)) throw new v("endPoint1 is required.");
	if (!N(r)) throw new v("plane is required.");
	N(n) || (n = new Y());
	const i = Y.subtract(t, e, Us), o = r.normal, a = Y.dot(o, i);
	if (Math.abs(a) < B.EPSILON6) return;
	const s = Y.dot(o, e), u = -(r.distance + s) / a;
	return u < 0 || u > 1 ? void 0 : (Y.multiplyByScalar(i, u, n), Y.add(e, n, n), n);
}, ss.trianglePlaneIntersection = function(e, t, r, n) {
	if (!(N(e) && N(t) && N(r) && N(n))) throw new v("p0, p1, p2, and plane are required.");
	const i = n.normal, o = n.distance, a = Y.dot(i, e) + o < 0, s = Y.dot(i, t) + o < 0, u = Y.dot(i, r) + o < 0;
	let c, l, f = 0;
	if (f += a ? 1 : 0, f += s ? 1 : 0, f += u ? 1 : 0, 1 !== f && 2 !== f || (c = new Y(), l = new Y()), 1 === f) {
		if (a) return ss.lineSegmentPlane(e, t, n, c), ss.lineSegmentPlane(e, r, n, l), {
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
		if (s) return ss.lineSegmentPlane(t, r, n, c), ss.lineSegmentPlane(t, e, n, l), {
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
		if (u) return ss.lineSegmentPlane(r, e, n, c), ss.lineSegmentPlane(r, t, n, l), {
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
		if (!a) return ss.lineSegmentPlane(t, e, n, c), ss.lineSegmentPlane(r, e, n, l), {
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
		if (!s) return ss.lineSegmentPlane(r, t, n, c), ss.lineSegmentPlane(e, t, n, l), {
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
		if (!u) return ss.lineSegmentPlane(e, r, n, c), ss.lineSegmentPlane(t, r, n, l), {
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
}, js.fromPointNormal = function(e, t, r) {
	if (P.typeOf.object("point", e), P.typeOf.object("normal", t), !B.equalsEpsilon(Y.magnitude(t), 1, B.EPSILON6)) throw new v("normal must be normalized.");
	const n = -Y.dot(t, e);
	return N(r) ? (Y.clone(t, r.normal), r.distance = n, r) : new js(t, n);
};
const qs = new Y();
js.fromCartesian4 = function(e, t) {
	P.typeOf.object("coefficients", e);
	const r = Y.fromCartesian4(e, qs), n = e.w;
	if (!B.equalsEpsilon(Y.magnitude(r), 1, B.EPSILON6)) throw new v("normal must be normalized.");
	return N(t) ? (Y.clone(r, t.normal), t.distance = n, t) : new js(r, n);
}, js.getPointDistance = function(e, t) {
	return P.typeOf.object("plane", e), P.typeOf.object("point", t), Y.dot(e.normal, t) + e.distance;
};
const Gs = new Y();
js.projectPointOntoPlane = function(e, t, r) {
	P.typeOf.object("plane", e), P.typeOf.object("point", t), N(r) || (r = new Y());
	const n = js.getPointDistance(e, t), i = Y.multiplyByScalar(e.normal, n, Gs);
	return Y.subtract(t, i, r);
};
const Ws = new Mr(), ks = new Te(), Vs = new Y();
js.transform = function(e, t, r) {
	P.typeOf.object("plane", e), P.typeOf.object("transform", t);
	const n = e.normal, i = e.distance, o = Mr.inverseTranspose(t, Ws);
	let a = Te.fromElements(n.x, n.y, n.z, i, ks);
	a = Mr.multiplyByVector(o, a, a);
	const s = Y.fromCartesian4(a, Vs);
	return a = Te.divideByScalar(a, Y.magnitude(s), a), js.fromCartesian4(a, r);
}, js.clone = function(e, t) {
	return P.typeOf.object("plane", e), N(t) ? (Y.clone(e.normal, t.normal), t.distance = e.distance, t) : new js(e.normal, e.distance);
}, js.equals = function(e, t) {
	return P.typeOf.object("left", e), P.typeOf.object("right", t), e.distance === t.distance && Y.equals(e.normal, t.normal);
}, js.ORIGIN_XY_PLANE = Object.freeze(new js(Y.UNIT_Z, 0)), js.ORIGIN_YZ_PLANE = Object.freeze(new js(Y.UNIT_X, 0)), js.ORIGIN_ZX_PLANE = Object.freeze(new js(Y.UNIT_Y, 0));
const Hs = {
	calculateACMR: function(e) {
		const t = (e = e ?? C.EMPTY_OBJECT).indices;
		let r = e.maximumIndex;
		const n = e.cacheSize ?? 24;
		if (!N(t)) throw new v("indices is required.");
		const i = t.length;
		if (i < 3 || i % 3 != 0) throw new v("indices length must be a multiple of three.");
		if (r <= 0) throw new v("maximumIndex must be greater than zero.");
		if (n < 3) throw new v("cacheSize must be greater than two.");
		if (!N(r)) {
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
		const t = (e = e ?? C.EMPTY_OBJECT).indices, r = e.maximumIndex, n = e.cacheSize ?? 24;
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
		if (!N(t)) throw new v("indices is required.");
		const a = t.length;
		if (a < 3 || a % 3 != 0) throw new v("indices length must be a multiple of three.");
		if (r <= 0) throw new v("maximumIndex must be greater than zero.");
		if (n < 3) throw new v("cacheSize must be greater than two.");
		let s = 0, u = 0, c = t[u];
		const l = a;
		if (N(r)) s = r + 1;
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
		const T = [], O = a / 3, w = [];
		for (h = 0; h < O; h++) w[h] = !1;
		let A, x;
		for (; -1 !== m;) {
			y = [], E = f[m], x = E.vertexTriangles.length;
			for (let e = 0; e < x; ++e) if (p = E.vertexTriangles[e], !w[p]) {
				w[p] = !0, u = p + p + p;
				for (let e = 0; e < 3; ++e) A = t[u], y.push(A), _.push(A), T[b] = A, ++b, g = f[A], --g.numLiveTriangles, d - g.timeStamp > n && (g.timeStamp = d, ++d), ++u;
			}
			m = o(0, n, y, f, d, _, s);
		}
		return T;
	}
}, Ys = {};
function Xs(e, t, r, n, i) {
	e[t++] = r, e[t++] = n, e[t++] = n, e[t++] = i, e[t++] = i, e[t] = r;
}
function $s(e) {
	const t = {};
	for (const r in e) if (e.hasOwnProperty(r) && N(e[r]) && N(e[r].values)) {
		const n = e[r];
		t[r] = new pa({
			componentDatatype: n.componentDatatype,
			componentsPerAttribute: n.componentsPerAttribute,
			normalize: n.normalize,
			values: []
		});
	}
	return t;
}
function Ks(e, t, r) {
	for (const n in t) if (t.hasOwnProperty(n) && N(t[n]) && N(t[n].values)) {
		const i = t[n];
		for (let t = 0; t < i.componentsPerAttribute; ++t) e[n].values.push(i.values[r * i.componentsPerAttribute + t]);
	}
}
Ys.toWireframe = function(e) {
	if (!N(e)) throw new v("geometry is required.");
	const t = e.indices;
	if (N(t)) {
		switch (e.primitiveType) {
			case ta.TRIANGLES:
				e.indices = function(e) {
					const t = e.length, r = t / 3 * 6, n = es.createTypedArray(t, r);
					let i = 0;
					for (let o = 0; o < t; o += 3, i += 6) Xs(n, i, e[o], e[o + 1], e[o + 2]);
					return n;
				}(t);
				break;
			case ta.TRIANGLE_STRIP:
				e.indices = function(e) {
					const t = e.length;
					if (t >= 3) {
						const r = 6 * (t - 2), n = es.createTypedArray(t, r);
						Xs(n, 0, e[0], e[1], e[2]);
						let i = 6;
						for (let o = 3; o < t; ++o, i += 6) Xs(n, i, e[o - 1], e[o], e[o - 2]);
						return n;
					}
					return /* @__PURE__ */ new Uint16Array();
				}(t);
				break;
			case ta.TRIANGLE_FAN:
				e.indices = function(e) {
					if (e.length > 0) {
						const t = e.length - 1, r = 6 * (t - 1), n = es.createTypedArray(t, r), i = e[0];
						let o = 0;
						for (let a = 1; a < t; ++a, o += 6) Xs(n, o, i, e[a], e[a + 1]);
						return n;
					}
					return /* @__PURE__ */ new Uint16Array();
				}(t);
				break;
			default: throw new v("geometry.primitiveType must be TRIANGLES, TRIANGLE_STRIP, or TRIANGLE_FAN.");
		}
		e.primitiveType = ta.LINES;
	}
	return e;
}, Ys.createLineSegmentsForVectors = function(e, t, r) {
	if (t = t ?? "normal", !N(e)) throw new v("geometry is required.");
	if (!N(e.attributes.position)) throw new v("geometry.attributes.position is required.");
	if (!N(e.attributes[t])) throw new v(`geometry.attributes must have an attribute with the same name as the attributeName parameter, ${t}.`);
	r = r ?? 1e4;
	const n = e.attributes.position.values, i = e.attributes[t].values, o = n.length, a = new Float64Array(2 * o);
	let s, u = 0;
	for (let l = 0; l < o; l += 3) a[u++] = n[l], a[u++] = n[l + 1], a[u++] = n[l + 2], a[u++] = n[l] + i[l] * r, a[u++] = n[l + 1] + i[l + 1] * r, a[u++] = n[l + 2] + i[l + 2] * r;
	const c = e.boundingSphere;
	return N(c) && (s = new ao(c.center, c.radius + r)), new ra({
		attributes: { position: new pa({
			componentDatatype: Ho.DOUBLE,
			componentsPerAttribute: 3,
			values: a
		}) },
		primitiveType: ta.LINES,
		boundingSphere: s
	});
}, Ys.createAttributeLocations = function(e) {
	if (!N(e)) throw new v("geometry is required.");
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
		N(r[e]) && (n[e] = o++);
	}
	for (const s in r) r.hasOwnProperty(s) && !N(n[s]) && (n[s] = o++);
	return n;
}, Ys.reorderForPreVertexCache = function(e) {
	if (!N(e)) throw new v("geometry is required.");
	const t = ra.computeNumberOfVertices(e), r = e.indices;
	if (N(r)) {
		const n = new Int32Array(t);
		for (let e = 0; e < t; e++) n[e] = -1;
		const i = r, o = i.length, a = es.createTypedArray(t, o);
		let s, u = 0, c = 0, l = 0;
		for (; u < o;) s = n[i[u]], -1 !== s ? a[c] = s : (s = i[u], n[s] = l, a[c] = l, ++l), ++u, ++c;
		e.indices = a;
		const f = e.attributes;
		for (const e in f) if (f.hasOwnProperty(e) && N(f[e]) && N(f[e].values)) {
			const r = f[e], i = r.values;
			let o = 0;
			const a = r.componentsPerAttribute, s = Ho.createTypedArray(r.componentDatatype, l * a);
			for (; o < t;) {
				const e = n[o];
				if (-1 !== e) for (let t = 0; t < a; t++) s[a * e + t] = i[a * o + t];
				++o;
			}
			r.values = s;
		}
	}
	return e;
}, Ys.reorderForPostVertexCache = function(e, t) {
	if (!N(e)) throw new v("geometry is required.");
	const r = e.indices;
	if (e.primitiveType === ta.TRIANGLES && N(r)) {
		const n = r.length;
		let i = 0;
		for (let e = 0; e < n; e++) r[e] > i && (i = r[e]);
		e.indices = Hs.tipsify({
			indices: r,
			maximumIndex: i,
			cacheSize: t
		});
	}
	return e;
}, Ys.fitToUnsignedShortIndices = function(e) {
	if (!N(e)) throw new v("geometry is required.");
	if (N(e.indices) && e.primitiveType !== ta.TRIANGLES && e.primitiveType !== ta.LINES && e.primitiveType !== ta.POINTS) throw new v("geometry.primitiveType must equal to PrimitiveType.TRIANGLES, PrimitiveType.LINES, or PrimitiveType.POINTS.");
	const t = [], r = ra.computeNumberOfVertices(e);
	if (N(e.indices) && r >= B.SIXTY_FOUR_KILOBYTES) {
		let r = [], n = [], i = 0, o = $s(e.attributes);
		const a = e.indices, s = a.length;
		let u;
		e.primitiveType === ta.TRIANGLES ? u = 3 : e.primitiveType === ta.LINES ? u = 2 : e.primitiveType === ta.POINTS && (u = 1);
		for (let c = 0; c < s; c += u) {
			for (let t = 0; t < u; ++t) {
				const s = a[c + t];
				let u = r[s];
				N(u) || (u = i++, r[s] = u, Ks(o, e.attributes, s)), n.push(u);
			}
			i + u >= B.SIXTY_FOUR_KILOBYTES && (t.push(new ra({
				attributes: o,
				indices: n,
				primitiveType: e.primitiveType,
				boundingSphere: e.boundingSphere,
				boundingSphereCV: e.boundingSphereCV
			})), r = [], n = [], i = 0, o = $s(e.attributes));
		}
		0 !== n.length && t.push(new ra({
			attributes: o,
			indices: n,
			primitiveType: e.primitiveType,
			boundingSphere: e.boundingSphere,
			boundingSphereCV: e.boundingSphereCV
		}));
	} else t.push(e);
	return t;
};
const Zs = new Y(), Qs = new ie();
Ys.projectTo2D = function(e, t, r, n, i) {
	if (!N(e)) throw new v("geometry is required.");
	if (!N(t)) throw new v("attributeName is required.");
	if (!N(r)) throw new v("attributeName3D is required.");
	if (!N(n)) throw new v("attributeName2D is required.");
	if (!N(e.attributes[t])) throw new v(`geometry must have attribute matching the attributeName argument: ${t}.`);
	if (e.attributes[t].componentDatatype !== Ho.DOUBLE) throw new v("The attribute componentDatatype must be ComponentDatatype.DOUBLE.");
	const o = e.attributes[t], a = (i = N(i) ? i : new Ee()).ellipsoid, s = o.values, u = new Float64Array(s.length);
	let c = 0;
	for (let l = 0; l < s.length; l += 3) {
		const e = Y.fromArray(s, l, Zs), t = a.cartesianToCartographic(e, Qs);
		if (!N(t)) throw new v(`Could not project point (${e.x}, ${e.y}, ${e.z}) to 2D.`);
		const r = i.project(t, Zs);
		u[c++] = r.x, u[c++] = r.y, u[c++] = r.z;
	}
	return e.attributes[r] = o, e.attributes[n] = new pa({
		componentDatatype: Ho.DOUBLE,
		componentsPerAttribute: 3,
		values: u
	}), delete e.attributes[t], e;
};
const Js = {
	high: 0,
	low: 0
};
Ys.encodeAttribute = function(e, t, r, n) {
	if (!N(e)) throw new v("geometry is required.");
	if (!N(t)) throw new v("attributeName is required.");
	if (!N(r)) throw new v("attributeHighName is required.");
	if (!N(n)) throw new v("attributeLowName is required.");
	if (!N(e.attributes[t])) throw new v(`geometry must have attribute matching the attributeName argument: ${t}.`);
	if (e.attributes[t].componentDatatype !== Ho.DOUBLE) throw new v("The attribute componentDatatype must be ComponentDatatype.DOUBLE.");
	const i = e.attributes[t], o = i.values, a = o.length, s = new Float32Array(a), u = new Float32Array(a);
	for (let l = 0; l < a; ++l) Za.encode(o[l], Js), s[l] = Js.high, u[l] = Js.low;
	const c = i.componentsPerAttribute;
	return e.attributes[r] = new pa({
		componentDatatype: Ho.FLOAT,
		componentsPerAttribute: c,
		values: s
	}), e.attributes[n] = new pa({
		componentDatatype: Ho.FLOAT,
		componentsPerAttribute: c,
		values: u
	}), delete e.attributes[t], e;
};
let eu = new Y();
function tu(e, t) {
	if (N(t)) {
		const r = t.values, n = r.length;
		for (let t = 0; t < n; t += 3) Y.unpack(r, t, eu), Mr.multiplyByPoint(e, eu, eu), Y.pack(eu, r, t);
	}
}
function ru(e, t) {
	if (N(t)) {
		const r = t.values, n = r.length;
		for (let t = 0; t < n; t += 3) Y.unpack(r, t, eu), Er.multiplyByVector(e, eu, eu), eu = Y.normalize(eu, eu), Y.pack(eu, r, t);
	}
}
const nu = new Mr(), iu = new Er();
Ys.transformToWorldCoordinates = function(e) {
	if (!N(e)) throw new v("instance is required.");
	const t = e.modelMatrix;
	if (Mr.equals(t, Mr.IDENTITY)) return e;
	const r = e.geometry.attributes;
	tu(t, r.position), tu(t, r.prevPosition), tu(t, r.nextPosition), (N(r.normal) || N(r.tangent) || N(r.bitangent)) && (Mr.inverse(t, nu), Mr.transpose(nu, nu), Mr.getMatrix3(nu, iu), ru(iu, r.normal), ru(iu, r.tangent), ru(iu, r.bitangent));
	const n = e.geometry.boundingSphere;
	return N(n) && (e.geometry.boundingSphere = ao.transform(n, t, n)), e.modelMatrix = Mr.clone(Mr.IDENTITY), e;
};
const ou = new Y();
function au(e, t) {
	const r = e.length;
	let n, i, o, a;
	const s = e[0].modelMatrix, u = N(e[0][t].indices), c = e[0][t].primitiveType;
	for (i = 1; i < r; ++i) {
		if (!Mr.equals(e[i].modelMatrix, s)) throw new v("All instances must have the same modelMatrix.");
		if (N(e[i][t].indices) !== u) throw new v("All instance geometries must have an indices or not have one.");
		if (e[i][t].primitiveType !== c) throw new v("All instance geometries must have the same primitiveType.");
	}
	const l = function(e, t) {
		const r = e.length, n = {}, i = e[0][t].attributes;
		let o;
		for (o in i) if (i.hasOwnProperty(o) && N(i[o]) && N(i[o].values)) {
			const a = i[o];
			let s = a.values.length, u = !0;
			for (let n = 1; n < r; ++n) {
				const r = e[n][t].attributes[o];
				if (!N(r) || a.componentDatatype !== r.componentDatatype || a.componentsPerAttribute !== r.componentsPerAttribute || a.normalize !== r.normalize) {
					u = !1;
					break;
				}
				s += r.values.length;
			}
			u && (n[o] = new pa({
				componentDatatype: a.componentDatatype,
				componentsPerAttribute: a.componentsPerAttribute,
				normalize: a.normalize,
				values: Ho.createTypedArray(a.componentDatatype, s)
			}));
		}
		return n;
	}(e, t);
	let f, h, p, m;
	for (n in l) if (l.hasOwnProperty(n)) for (f = l[n].values, a = 0, i = 0; i < r; ++i) for (h = e[i][t].attributes[n].values, p = h.length, o = 0; o < p; ++o) f[a++] = h[o];
	if (u) {
		let n = 0;
		for (i = 0; i < r; ++i) n += e[i][t].indices.length;
		const o = ra.computeNumberOfVertices(new ra({
			attributes: l,
			primitiveType: ta.POINTS
		})), s = es.createTypedArray(o, n);
		let u = 0, c = 0;
		for (i = 0; i < r; ++i) {
			const r = e[i][t].indices, n = r.length;
			for (a = 0; a < n; ++a) s[u++] = c + r[a];
			c += ra.computeNumberOfVertices(e[i][t]);
		}
		m = s;
	}
	let d, y = new Y(), _ = 0;
	for (i = 0; i < r; ++i) {
		if (d = e[i][t].boundingSphere, !N(d)) {
			y = void 0;
			break;
		}
		Y.add(d.center, y, y);
	}
	if (N(y)) for (Y.divideByScalar(y, r, y), i = 0; i < r; ++i) {
		d = e[i][t].boundingSphere;
		const r = Y.magnitude(Y.subtract(d.center, y, ou)) + d.radius;
		r > _ && (_ = r);
	}
	return new ra({
		attributes: l,
		indices: m,
		primitiveType: c,
		boundingSphere: N(y) ? new ao(y, _) : void 0
	});
}
Ys.combineInstances = function(e) {
	if (!N(e) || e.length < 1) throw new v("instances is required and must have length greater than zero.");
	const t = [], r = [], n = e.length;
	for (let o = 0; o < n; ++o) {
		const n = e[o];
		N(n.geometry) ? t.push(n) : N(n.westHemisphereGeometry) && N(n.eastHemisphereGeometry) && r.push(n);
	}
	const i = [];
	return t.length > 0 && i.push(au(t, "geometry")), r.length > 0 && (i.push(au(r, "westHemisphereGeometry")), i.push(au(r, "eastHemisphereGeometry"))), i;
};
const su = new Y(), uu = new Y(), cu = new Y(), lu = new Y();
Ys.computeNormal = function(e) {
	if (!N(e)) throw new v("geometry is required.");
	if (!N(e.attributes.position) || !N(e.attributes.position.values)) throw new v("geometry.attributes.position.values is required.");
	if (!N(e.indices)) throw new v("geometry.indices is required.");
	if (e.indices.length < 2 || e.indices.length % 3 != 0) throw new v("geometry.indices length must be greater than 0 and be a multiple of 3.");
	if (e.primitiveType !== ta.TRIANGLES) throw new v("geometry.primitiveType must be PrimitiveType.TRIANGLES.");
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
		uu.x = n[o], uu.y = n[o + 1], uu.z = n[o + 2], cu.x = n[u], cu.y = n[u + 1], cu.z = n[u + 2], lu.x = n[f], lu.y = n[f + 1], lu.z = n[f + 2], a[e].count++, a[r].count++, a[i].count++, Y.subtract(cu, uu, cu), Y.subtract(lu, uu, lu), s[l] = Y.cross(cu, lu, new Y()), l++;
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
		if (f = a[c], Y.clone(Y.ZERO, su), f.count > 0) {
			for (l = 0; l < f.count; l++) Y.add(su, s[u[f.indexOffset + l]], su);
			Y.equalsEpsilon(Y.ZERO, su, B.EPSILON10) && Y.clone(s[u[f.indexOffset]], su);
		}
		Y.equalsEpsilon(Y.ZERO, su, B.EPSILON10) && (su.z = 1), Y.normalize(su, su), p[e] = su.x, p[e + 1] = su.y, p[e + 2] = su.z;
	}
	return e.attributes.normal = new pa({
		componentDatatype: Ho.FLOAT,
		componentsPerAttribute: 3,
		values: p
	}), e;
};
const fu = new Y(), hu = new Y(), pu = new Y();
Ys.computeTangentAndBitangent = function(e) {
	if (!N(e)) throw new v("geometry is required.");
	const t = e.attributes, r = e.indices;
	if (!N(t.position) || !N(t.position.values)) throw new v("geometry.attributes.position.values is required.");
	if (!N(t.normal) || !N(t.normal.values)) throw new v("geometry.attributes.normal.values is required.");
	if (!N(t.st) || !N(t.st.values)) throw new v("geometry.attributes.st.values is required.");
	if (!N(r)) throw new v("geometry.indices is required.");
	if (r.length < 2 || r.length % 3 != 0) throw new v("geometry.indices length must be greater than 0 and be a multiple of 3.");
	if (e.primitiveType !== ta.TRIANGLES) throw new v("geometry.primitiveType must be PrimitiveType.TRIANGLES.");
	const n = e.attributes.position.values, i = e.attributes.normal.values, o = e.attributes.st.values, a = e.attributes.position.values.length / 3, s = r.length, u = new Array(3 * a);
	let c, l, f, h;
	for (c = 0; c < u.length; c++) u[c] = 0;
	for (c = 0; c < s; c += 3) {
		const e = r[c], t = r[c + 1], i = r[c + 2];
		l = 3 * e, f = 3 * t, h = 3 * i;
		const a = 2 * e, s = 2 * t, p = 2 * i, m = n[l], d = n[l + 1], y = n[l + 2], _ = o[a], g = o[a + 1], E = o[s + 1] - g, b = o[p + 1] - g, T = 1 / ((o[s] - _) * b - (o[p] - _) * E), O = (b * (n[f] - m) - E * (n[h] - m)) * T, w = (b * (n[f + 1] - d) - E * (n[h + 1] - d)) * T, A = (b * (n[f + 2] - y) - E * (n[h + 2] - y)) * T;
		u[l] += O, u[l + 1] += w, u[l + 2] += A, u[f] += O, u[f + 1] += w, u[f + 2] += A, u[h] += O, u[h + 1] += w, u[h + 2] += A;
	}
	const p = new Float32Array(3 * a), m = new Float32Array(3 * a);
	for (c = 0; c < a; c++) {
		l = 3 * c, f = l + 1, h = l + 2;
		const e = Y.fromArray(i, l, fu), t = Y.fromArray(u, l, pu), r = Y.dot(e, t);
		Y.multiplyByScalar(e, r, hu), Y.normalize(Y.subtract(t, hu, t), t), p[l] = t.x, p[f] = t.y, p[h] = t.z, Y.normalize(Y.cross(e, t, t), t), m[l] = t.x, m[f] = t.y, m[h] = t.z;
	}
	return e.attributes.tangent = new pa({
		componentDatatype: Ho.FLOAT,
		componentsPerAttribute: 3,
		values: p
	}), e.attributes.bitangent = new pa({
		componentDatatype: Ho.FLOAT,
		componentsPerAttribute: 3,
		values: m
	}), e;
};
const mu = new q(), du = new Y(), yu = new Y(), _u = new Y();
let gu = new q();
function Eu(e, t) {
	Math.abs(e.y) < B.EPSILON6 && (e.y = t ? -B.EPSILON6 : B.EPSILON6);
}
Ys.compressVertices = function(e) {
	if (!N(e)) throw new v("geometry is required.");
	const t = e.attributes.extrudeDirection;
	let r, n;
	if (N(t)) {
		const i = t.values;
		n = i.length / 3;
		const o = new Float32Array(2 * n);
		let a = 0;
		for (r = 0; r < n; ++r) Y.fromArray(i, 3 * r, du), Y.equals(du, Y.ZERO) ? a += 2 : (gu = Ga.octEncodeInRange(du, 65535, gu), o[a++] = gu.x, o[a++] = gu.y);
		return e.attributes.compressedAttributes = new pa({
			componentDatatype: Ho.FLOAT,
			componentsPerAttribute: 2,
			values: o
		}), delete e.attributes.extrudeDirection, e;
	}
	const i = e.attributes.normal, o = e.attributes.st, a = N(i), s = N(o);
	if (!a && !s) return e;
	const u = e.attributes.tangent, c = e.attributes.bitangent, l = N(u), f = N(c);
	let h, p, m, d;
	a && (h = i.values), s && (p = o.values), l && (m = u.values), f && (d = c.values), n = (a ? h.length : p.length) / (a ? 3 : 2);
	let y = n, _ = s && a ? 2 : 1;
	_ += l || f ? 1 : 0, y *= _;
	const g = new Float32Array(y);
	let E = 0;
	for (r = 0; r < n; ++r) {
		s && (q.fromArray(p, 2 * r, mu), g[E++] = Ga.compressTextureCoordinates(mu));
		const e = 3 * r;
		a && N(m) && N(d) ? (Y.fromArray(h, e, du), Y.fromArray(m, e, yu), Y.fromArray(d, e, _u), Ga.octPack(du, yu, _u, mu), g[E++] = mu.x, g[E++] = mu.y) : (a && (Y.fromArray(h, e, du), g[E++] = Ga.octEncodeFloat(du)), l && (Y.fromArray(m, e, du), g[E++] = Ga.octEncodeFloat(du)), f && (Y.fromArray(d, e, du), g[E++] = Ga.octEncodeFloat(du)));
	}
	return e.attributes.compressedAttributes = new pa({
		componentDatatype: Ho.FLOAT,
		componentsPerAttribute: _,
		values: g
	}), a && delete e.attributes.normal, s && delete e.attributes.st, f && delete e.attributes.bitangent, l && delete e.attributes.tangent, e;
};
const bu = new Y();
function Tu(e, t, r, n) {
	Y.add(e, Y.multiplyByScalar(Y.subtract(t, e, bu), e.y / (e.y - t.y), bu), r), Y.clone(r, n), Eu(r, !0), Eu(n, !1);
}
const Ou = new Y(), wu = new Y(), Au = new Y(), xu = new Y(), Ru = {
	positions: new Array(7),
	indices: new Array(9)
};
function Su(e, t, r) {
	if (e.x >= 0 || t.x >= 0 || r.x >= 0) return;
	(function(e, t, r) {
		if (0 !== e.y && 0 !== t.y && 0 !== r.y) return Eu(e, e.y < 0), Eu(t, t.y < 0), void Eu(r, r.y < 0);
		const n = Math.abs(e.y), i = Math.abs(t.y), o = Math.abs(r.y);
		let a;
		a = n > i ? n > o ? B.sign(e.y) : B.sign(r.y) : i > o ? B.sign(t.y) : B.sign(r.y);
		const s = a < 0;
		Eu(e, s), Eu(t, s), Eu(r, s);
	})(e, t, r);
	const n = e.y < 0, i = t.y < 0, o = r.y < 0;
	let a = 0;
	a += n ? 1 : 0, a += i ? 1 : 0, a += o ? 1 : 0;
	const s = Ru.indices;
	1 === a ? (s[1] = 3, s[2] = 4, s[5] = 6, s[7] = 6, s[8] = 5, n ? (Tu(e, t, Ou, Au), Tu(e, r, wu, xu), s[0] = 0, s[3] = 1, s[4] = 2, s[6] = 1) : i ? (Tu(t, r, Ou, Au), Tu(t, e, wu, xu), s[0] = 1, s[3] = 2, s[4] = 0, s[6] = 2) : o && (Tu(r, e, Ou, Au), Tu(r, t, wu, xu), s[0] = 2, s[3] = 0, s[4] = 1, s[6] = 0)) : 2 === a && (s[2] = 4, s[4] = 4, s[5] = 3, s[7] = 5, s[8] = 6, n ? i ? o || (Tu(r, e, Ou, Au), Tu(r, t, wu, xu), s[0] = 0, s[1] = 1, s[3] = 0, s[6] = 2) : (Tu(t, r, Ou, Au), Tu(t, e, wu, xu), s[0] = 2, s[1] = 0, s[3] = 2, s[6] = 1) : (Tu(e, t, Ou, Au), Tu(e, r, wu, xu), s[0] = 1, s[1] = 2, s[3] = 1, s[6] = 0));
	const u = Ru.positions;
	return u[0] = e, u[1] = t, u[2] = r, u.length = 3, 1 !== a && 2 !== a || (u[3] = Ou, u[4] = wu, u[5] = Au, u[6] = xu, u.length = 7), Ru;
}
function Iu(e, t) {
	const r = e.attributes;
	if (0 === r.position.values.length) return;
	for (const i in r) if (r.hasOwnProperty(i) && N(r[i]) && N(r[i].values)) {
		const e = r[i];
		e.values = Ho.createTypedArray(e.componentDatatype, e.values);
	}
	const n = ra.computeNumberOfVertices(e);
	return e.indices = es.createTypedArray(n, e.indices), t && (e.boundingSphere = ao.fromVertices(r.position.values)), e;
}
function Cu(e) {
	const t = e.attributes, r = {};
	for (const n in t) if (t.hasOwnProperty(n) && N(t[n]) && N(t[n].values)) {
		const e = t[n];
		r[n] = new pa({
			componentDatatype: e.componentDatatype,
			componentsPerAttribute: e.componentsPerAttribute,
			normalize: e.normalize,
			values: []
		});
	}
	return new ra({
		attributes: r,
		indices: [],
		primitiveType: e.primitiveType
	});
}
function Nu(e, t, r) {
	const n = N(e.geometry.boundingSphere);
	t = Iu(t, n), N(r = Iu(r, n)) && !N(t) ? e.geometry = r : !N(r) && N(t) ? e.geometry = t : (e.westHemisphereGeometry = t, e.eastHemisphereGeometry = r, e.geometry = void 0);
}
function vu(e, t) {
	const r = new e(), n = new e(), i = new e();
	return function(o, a, s, u, c, l, f, h) {
		const p = e.fromArray(c, o * t, r), m = e.fromArray(c, a * t, n), d = e.fromArray(c, s * t, i);
		e.multiplyByScalar(p, u.x, p), e.multiplyByScalar(m, u.y, m), e.multiplyByScalar(d, u.z, d);
		const y = e.add(p, m, p);
		e.add(y, d, y), h && e.normalize(y, y), e.pack(y, l, f * t);
	};
}
const Pu = vu(Te, 4), Mu = vu(Y, 3), Lu = vu(q, 2), Fu = new Y(), Du = new Y(), zu = new Y(), Bu = new Y();
function Uu(e, t, r, n, i, o, a, s, u, c, l, f, h, p, m, d) {
	if (!(N(o) || N(a) || N(s) || N(u) || N(c) || 0 !== p)) return;
	const y = function(e, t, r, n, i) {
		let o, a, s, u, c, l, f, h;
		if (P.defined("point", e), P.defined("p0", t), P.defined("p1", r), P.defined("p2", n), N(i) || (i = new Y()), N(t.z)) {
			if (Y.equalsEpsilon(e, t, B.EPSILON14)) return Y.clone(Y.UNIT_X, i);
			if (Y.equalsEpsilon(e, r, B.EPSILON14)) return Y.clone(Y.UNIT_Y, i);
			if (Y.equalsEpsilon(e, n, B.EPSILON14)) return Y.clone(Y.UNIT_Z, i);
			o = Y.subtract(r, t, Xa), a = Y.subtract(n, t, $a), s = Y.subtract(e, t, Ka), u = Y.dot(o, o), c = Y.dot(o, a), l = Y.dot(o, s), f = Y.dot(a, a), h = Y.dot(a, s);
		} else {
			if (q.equalsEpsilon(e, t, B.EPSILON14)) return Y.clone(Y.UNIT_X, i);
			if (q.equalsEpsilon(e, r, B.EPSILON14)) return Y.clone(Y.UNIT_Y, i);
			if (q.equalsEpsilon(e, n, B.EPSILON14)) return Y.clone(Y.UNIT_Z, i);
			o = q.subtract(r, t, Xa), a = q.subtract(n, t, $a), s = q.subtract(e, t, Ka), u = q.dot(o, o), c = q.dot(o, a), l = q.dot(o, s), f = q.dot(a, a), h = q.dot(a, s);
		}
		i.y = f * l - c * h, i.z = u * h - c * l;
		const p = u * f - c * c;
		if (0 !== p) return i.y /= p, i.z /= p, i.x = 1 - i.y - i.z, i;
	}(n, Y.fromArray(i, 3 * e, Fu), Y.fromArray(i, 3 * t, Du), Y.fromArray(i, 3 * r, zu), Bu);
	if (N(y)) {
		if (N(o) && Mu(e, t, r, y, o, f.normal.values, d, !0), N(c)) {
			const n = Y.fromArray(c, 3 * e, Fu), i = Y.fromArray(c, 3 * t, Du), o = Y.fromArray(c, 3 * r, zu);
			let a;
			Y.multiplyByScalar(n, y.x, n), Y.multiplyByScalar(i, y.y, i), Y.multiplyByScalar(o, y.z, o), Y.equals(n, Y.ZERO) && Y.equals(i, Y.ZERO) && Y.equals(o, Y.ZERO) ? (a = Fu, a.x = 0, a.y = 0, a.z = 0) : (a = Y.add(n, i, n), Y.add(a, o, a), Y.normalize(a, a)), Y.pack(a, f.extrudeDirection.values, 3 * d);
		}
		if (N(l) && function(e, t, r, n, i, o, a) {
			const s = i[e] * n.x, u = i[t] * n.y, c = i[r] * n.z;
			o[a] = s + u + c > B.EPSILON6 ? 1 : 0;
		}(e, t, r, y, l, f.applyOffset.values, d), N(a) && Mu(e, t, r, y, a, f.tangent.values, d, !0), N(s) && Mu(e, t, r, y, s, f.bitangent.values, d, !0), N(u) && Lu(e, t, r, y, u, f.st.values, d), p > 0) for (let n = 0; n < p; n++) {
			const i = h[n];
			ju(e, t, r, y, d, m[i], f[i]);
		}
	}
}
function ju(e, t, r, n, i, o, a) {
	const s = o.componentsPerAttribute, u = o.values, c = a.values;
	switch (s) {
		case 4:
			Pu(e, t, r, n, u, c, i, !1);
			break;
		case 3:
			Mu(e, t, r, n, u, c, i, !1);
			break;
		case 2:
			Lu(e, t, r, n, u, c, i, !1);
			break;
		default: c[i] = u[e] * n.x + u[t] * n.y + u[r] * n.z;
	}
}
function qu(e, t, r, n, i, o) {
	const a = e.position.values.length / 3;
	if (-1 !== i) {
		const s = n[i], u = r[s];
		return -1 === u ? (r[s] = a, e.position.values.push(o.x, o.y, o.z), t.push(a), a) : (t.push(u), u);
	}
	return e.position.values.push(o.x, o.y, o.z), t.push(a), a;
}
const Gu = {
	position: !0,
	normal: !0,
	bitangent: !0,
	tangent: !0,
	st: !0,
	extrudeDirection: !0,
	applyOffset: !0
};
function Wu(e) {
	const t = e.geometry, r = t.attributes, n = r.position.values, i = N(r.normal) ? r.normal.values : void 0, o = N(r.bitangent) ? r.bitangent.values : void 0, a = N(r.tangent) ? r.tangent.values : void 0, s = N(r.st) ? r.st.values : void 0, u = N(r.extrudeDirection) ? r.extrudeDirection.values : void 0, c = N(r.applyOffset) ? r.applyOffset.values : void 0, l = t.indices, f = [];
	for (const w in r) r.hasOwnProperty(w) && !Gu[w] && N(r[w]) && f.push(w);
	const h = f.length, p = Cu(t), m = Cu(t);
	let d, y, _, g, E;
	const b = [];
	b.length = n.length / 3;
	const T = [];
	for (T.length = n.length / 3, E = 0; E < b.length; ++E) b[E] = -1, T[E] = -1;
	const O = l.length;
	for (E = 0; E < O; E += 3) {
		const e = l[E], t = l[E + 1], O = l[E + 2];
		let w = Y.fromArray(n, 3 * e), A = Y.fromArray(n, 3 * t), x = Y.fromArray(n, 3 * O);
		const R = Su(w, A, x);
		if (N(R) && R.positions.length > 3) {
			const w = R.positions, A = R.indices, x = A.length;
			for (let R = 0; R < x; ++R) {
				const x = A[R], S = w[x];
				S.y < 0 ? (d = m.attributes, y = m.indices, _ = b) : (d = p.attributes, y = p.indices, _ = T), g = qu(d, y, _, l, x < 3 ? E + x : -1, S), Uu(e, t, O, S, n, i, a, o, s, u, c, d, f, h, r, g);
			}
		} else N(R) && (w = R.positions[0], A = R.positions[1], x = R.positions[2]), w.y < 0 ? (d = m.attributes, y = m.indices, _ = b) : (d = p.attributes, y = p.indices, _ = T), g = qu(d, y, _, l, E, w), Uu(e, t, O, w, n, i, a, o, s, u, c, d, f, h, r, g), g = qu(d, y, _, l, E + 1, A), Uu(e, t, O, A, n, i, a, o, s, u, c, d, f, h, r, g), g = qu(d, y, _, l, E + 2, x), Uu(e, t, O, x, n, i, a, o, s, u, c, d, f, h, r, g);
	}
	Nu(e, m, p);
}
const ku = js.fromPointNormal(Y.ZERO, Y.UNIT_Y), Vu = new Y(), Hu = new Y();
function Yu(e, t, r, n, i, o, a) {
	if (!N(a)) return;
	const s = Y.fromArray(n, 3 * e, Fu);
	Y.equalsEpsilon(s, r, B.EPSILON10) ? o.applyOffset.values[i] = a[e] : o.applyOffset.values[i] = a[t];
}
function Xu(e) {
	const t = e.geometry, r = t.attributes, n = r.position.values, i = N(r.applyOffset) ? r.applyOffset.values : void 0, o = t.indices, a = Cu(t), s = Cu(t);
	let u;
	const c = o.length, l = [];
	l.length = n.length / 3;
	const f = [];
	for (f.length = n.length / 3, u = 0; u < l.length; ++u) l[u] = -1, f[u] = -1;
	for (u = 0; u < c; u += 2) {
		const e = o[u], t = o[u + 1], r = Y.fromArray(n, 3 * e, Fu), c = Y.fromArray(n, 3 * t, Du);
		let h;
		Math.abs(r.y) < B.EPSILON6 && (r.y < 0 ? r.y = -B.EPSILON6 : r.y = B.EPSILON6), Math.abs(c.y) < B.EPSILON6 && (c.y < 0 ? c.y = -B.EPSILON6 : c.y = B.EPSILON6);
		let p = a.attributes, m = a.indices, d = f, y = s.attributes, _ = s.indices, g = l;
		const E = ss.lineSegmentPlane(r, c, ku, zu);
		if (N(E)) {
			const b = Y.multiplyByScalar(Y.UNIT_Y, 5 * B.EPSILON9, Vu);
			r.y < 0 && (Y.negate(b, b), p = s.attributes, m = s.indices, d = l, y = a.attributes, _ = a.indices, g = f);
			const T = Y.add(E, b, Hu);
			h = qu(p, m, d, o, u, r), Yu(e, t, r, n, h, p, i), h = qu(p, m, d, o, -1, T), Yu(e, t, T, n, h, p, i), Y.negate(b, b), Y.add(E, b, T), h = qu(y, _, g, o, -1, T), Yu(e, t, T, n, h, y, i), h = qu(y, _, g, o, u + 1, c), Yu(e, t, c, n, h, y, i);
		} else {
			let p, m, d;
			r.y < 0 ? (p = s.attributes, m = s.indices, d = l) : (p = a.attributes, m = a.indices, d = f), h = qu(p, m, d, o, u, r), Yu(e, t, r, n, h, p, i), h = qu(p, m, d, o, u + 1, c), Yu(e, t, c, n, h, p, i);
		}
	}
	Nu(e, s, a);
}
const $u = new q(), Ku = new q(), Zu = new Y(), Qu = new Y(), Ju = new Y(), ec = new Y(), tc = new Y(), rc = new Y(), nc = new Te();
function ic(e) {
	const t = e.attributes, r = t.position.values, n = t.prevPosition.values, i = t.nextPosition.values, o = r.length;
	for (let a = 0; a < o; a += 3) {
		const e = Y.unpack(r, a, Zu);
		if (e.x > 0) continue;
		const t = Y.unpack(n, a, Qu);
		(e.y < 0 && t.y > 0 || e.y > 0 && t.y < 0) && (a - 3 > 0 ? (n[a] = r[a - 3], n[a + 1] = r[a - 2], n[a + 2] = r[a - 1]) : Y.pack(e, n, a));
		const s = Y.unpack(i, a, Ju);
		(e.y < 0 && s.y > 0 || e.y > 0 && s.y < 0) && (a + 3 < o ? (i[a] = r[a + 3], i[a + 1] = r[a + 4], i[a + 2] = r[a + 5]) : Y.pack(e, i, a));
	}
}
const oc = 5 * B.EPSILON9, ac = B.EPSILON6;
Ys.splitLongitude = function(e) {
	if (!N(e)) throw new v("instance is required.");
	const t = e.geometry, r = t.boundingSphere;
	if (N(r) && (r.center.x - r.radius > 0 || ao.intersectPlane(r, js.ORIGIN_ZX_PLANE) !== be.INTERSECTING)) return e;
	if (t.geometryType !== Yo.NONE) switch (t.geometryType) {
		case Yo.POLYLINES:
			(function(e) {
				const t = e.geometry, r = t.attributes, n = r.position.values, i = r.prevPosition.values, o = r.nextPosition.values, a = r.expandAndWidth.values, s = N(r.st) ? r.st.values : void 0, u = N(r.color) ? r.color.values : void 0, c = Cu(t), l = Cu(t);
				let f, h, p, m = !1;
				const d = n.length / 3;
				for (f = 0; f < d; f += 4) {
					const e = f, t = f + 2, r = Y.fromArray(n, 3 * e, Zu), d = Y.fromArray(n, 3 * t, Qu);
					if (Math.abs(r.y) < ac) for (r.y = ac * (d.y < 0 ? -1 : 1), n[3 * f + 1] = r.y, n[3 * (f + 1) + 1] = r.y, h = 3 * e; h < 3 * e + 12; h += 3) i[h] = n[3 * f], i[h + 1] = n[3 * f + 1], i[h + 2] = n[3 * f + 2];
					if (Math.abs(d.y) < ac) for (d.y = ac * (r.y < 0 ? -1 : 1), n[3 * (f + 2) + 1] = d.y, n[3 * (f + 3) + 1] = d.y, h = 3 * e; h < 3 * e + 12; h += 3) o[h] = n[3 * (f + 2)], o[h + 1] = n[3 * (f + 2) + 1], o[h + 2] = n[3 * (f + 2) + 2];
					let y = c.attributes, _ = c.indices, g = l.attributes, E = l.indices;
					const b = ss.lineSegmentPlane(r, d, ku, ec);
					if (N(b)) {
						m = !0;
						const n = Y.multiplyByScalar(Y.UNIT_Y, oc, tc);
						r.y < 0 && (Y.negate(n, n), y = l.attributes, _ = l.indices, g = c.attributes, E = c.indices);
						const T = Y.add(b, n, rc);
						y.position.values.push(r.x, r.y, r.z, r.x, r.y, r.z), y.position.values.push(T.x, T.y, T.z), y.position.values.push(T.x, T.y, T.z), y.prevPosition.values.push(i[3 * e], i[3 * e + 1], i[3 * e + 2]), y.prevPosition.values.push(i[3 * e + 3], i[3 * e + 4], i[3 * e + 5]), y.prevPosition.values.push(r.x, r.y, r.z, r.x, r.y, r.z), y.nextPosition.values.push(T.x, T.y, T.z), y.nextPosition.values.push(T.x, T.y, T.z), y.nextPosition.values.push(T.x, T.y, T.z), y.nextPosition.values.push(T.x, T.y, T.z), Y.negate(n, n), Y.add(b, n, T), g.position.values.push(T.x, T.y, T.z), g.position.values.push(T.x, T.y, T.z), g.position.values.push(d.x, d.y, d.z, d.x, d.y, d.z), g.prevPosition.values.push(T.x, T.y, T.z), g.prevPosition.values.push(T.x, T.y, T.z), g.prevPosition.values.push(T.x, T.y, T.z), g.prevPosition.values.push(T.x, T.y, T.z), g.nextPosition.values.push(d.x, d.y, d.z, d.x, d.y, d.z), g.nextPosition.values.push(o[3 * t], o[3 * t + 1], o[3 * t + 2]), g.nextPosition.values.push(o[3 * t + 3], o[3 * t + 4], o[3 * t + 5]);
						const O = q.fromArray(a, 2 * e, $u), w = Math.abs(O.y);
						y.expandAndWidth.values.push(-1, w, 1, w), y.expandAndWidth.values.push(-1, -w, 1, -w), g.expandAndWidth.values.push(-1, w, 1, w), g.expandAndWidth.values.push(-1, -w, 1, -w);
						let A = Y.magnitudeSquared(Y.subtract(b, r, Ju));
						if (A /= Y.magnitudeSquared(Y.subtract(d, r, Ju)), N(u)) {
							const r = Te.fromArray(u, 4 * e, nc), n = Te.fromArray(u, 4 * t, nc), i = B.lerp(r.x, n.x, A), o = B.lerp(r.y, n.y, A), a = B.lerp(r.z, n.z, A), s = B.lerp(r.w, n.w, A);
							for (h = 4 * e; h < 4 * e + 8; ++h) y.color.values.push(u[h]);
							for (y.color.values.push(i, o, a, s), y.color.values.push(i, o, a, s), g.color.values.push(i, o, a, s), g.color.values.push(i, o, a, s), h = 4 * t; h < 4 * t + 8; ++h) g.color.values.push(u[h]);
						}
						if (N(s)) {
							const r = q.fromArray(s, 2 * e, $u), n = q.fromArray(s, 2 * (f + 3), Ku), i = B.lerp(r.x, n.x, A);
							for (h = 2 * e; h < 2 * e + 4; ++h) y.st.values.push(s[h]);
							for (y.st.values.push(i, r.y), y.st.values.push(i, n.y), g.st.values.push(i, r.y), g.st.values.push(i, n.y), h = 2 * t; h < 2 * t + 4; ++h) g.st.values.push(s[h]);
						}
						p = y.position.values.length / 3 - 4, _.push(p, p + 2, p + 1), _.push(p + 1, p + 2, p + 3), p = g.position.values.length / 3 - 4, E.push(p, p + 2, p + 1), E.push(p + 1, p + 2, p + 3);
					} else {
						let e, t;
						for (r.y < 0 ? (e = l.attributes, t = l.indices) : (e = c.attributes, t = c.indices), e.position.values.push(r.x, r.y, r.z), e.position.values.push(r.x, r.y, r.z), e.position.values.push(d.x, d.y, d.z), e.position.values.push(d.x, d.y, d.z), h = 3 * f; h < 3 * f + 12; ++h) e.prevPosition.values.push(i[h]), e.nextPosition.values.push(o[h]);
						for (h = 2 * f; h < 2 * f + 8; ++h) e.expandAndWidth.values.push(a[h]), N(s) && e.st.values.push(s[h]);
						if (N(u)) for (h = 4 * f; h < 4 * f + 16; ++h) e.color.values.push(u[h]);
						p = e.position.values.length / 3 - 4, t.push(p, p + 2, p + 1), t.push(p + 1, p + 2, p + 3);
					}
				}
				m && (ic(l), ic(c)), Nu(e, l, c);
			})(e);
			break;
		case Yo.TRIANGLES:
			Wu(e);
			break;
		case Yo.LINES: Xu(e);
	}
	else (function(e) {
		switch (e.primitiveType) {
			case ta.TRIANGLE_FAN: return function(e) {
				const t = ra.computeNumberOfVertices(e);
				if (t < 3) throw new v("The number of vertices must be at least three.");
				const r = es.createTypedArray(t, 3 * (t - 2));
				r[0] = 1, r[1] = 0, r[2] = 2;
				let n = 3;
				for (let i = 3; i < t; ++i) r[n++] = i - 1, r[n++] = 0, r[n++] = i;
				return e.indices = r, e.primitiveType = ta.TRIANGLES, e;
			}(e);
			case ta.TRIANGLE_STRIP: return function(e) {
				const t = ra.computeNumberOfVertices(e);
				if (t < 3) throw new v("The number of vertices must be at least 3.");
				const r = es.createTypedArray(t, 3 * (t - 2));
				r[0] = 0, r[1] = 1, r[2] = 2, t > 3 && (r[3] = 0, r[4] = 2, r[5] = 3);
				let n = 6;
				for (let i = 3; i < t - 1; i += 2) r[n++] = i, r[n++] = i - 1, r[n++] = i + 1, i + 2 < t && (r[n++] = i, r[n++] = i + 1, r[n++] = i + 2);
				return e.indices = r, e.primitiveType = ta.TRIANGLES, e;
			}(e);
			case ta.TRIANGLES: return function(e) {
				if (N(e.indices)) return e;
				const t = ra.computeNumberOfVertices(e);
				if (t < 3) throw new v("The number of vertices must be at least three.");
				if (t % 3 != 0) throw new v("The number of vertices must be a multiple of three.");
				const r = es.createTypedArray(t, t);
				for (let n = 0; n < t; ++n) r[n] = n;
				return e.indices = r, e;
			}(e);
			case ta.LINE_STRIP: return function(e) {
				const t = ra.computeNumberOfVertices(e);
				if (t < 2) throw new v("The number of vertices must be at least two.");
				const r = es.createTypedArray(t, 2 * (t - 1));
				r[0] = 0, r[1] = 1;
				let n = 2;
				for (let i = 2; i < t; ++i) r[n++] = i - 1, r[n++] = i;
				return e.indices = r, e.primitiveType = ta.LINES, e;
			}(e);
			case ta.LINE_LOOP: return function(e) {
				const t = ra.computeNumberOfVertices(e);
				if (t < 2) throw new v("The number of vertices must be at least two.");
				const r = es.createTypedArray(t, 2 * t);
				r[0] = 0, r[1] = 1;
				let n = 2;
				for (let i = 2; i < t; ++i) r[n++] = i - 1, r[n++] = i;
				return r[n++] = t - 1, r[n] = 0, e.indices = r, e.primitiveType = ta.LINES, e;
			}(e);
			case ta.LINES: return function(e) {
				if (N(e.indices)) return e;
				const t = ra.computeNumberOfVertices(e);
				if (t < 2) throw new v("The number of vertices must be at least two.");
				if (t % 2 != 0) throw new v("The number of vertices must be a multiple of 2.");
				const r = es.createTypedArray(t, t);
				for (let n = 0; n < t; ++n) r[n] = n;
				return e.indices = r, e;
			}(e);
		}
	})(t), t.primitiveType === ta.TRIANGLES ? Wu(e) : t.primitiveType === ta.LINES && Xu(e);
	return e;
};
const sc = {
	UNSIGNED_BYTE: Vo.UNSIGNED_BYTE,
	UNSIGNED_SHORT: Vo.UNSIGNED_SHORT,
	UNSIGNED_INT: Vo.UNSIGNED_INT,
	FLOAT: Vo.FLOAT,
	HALF_FLOAT: Vo.HALF_FLOAT_OES,
	UNSIGNED_INT_24_8: Vo.UNSIGNED_INT_24_8,
	UNSIGNED_SHORT_4_4_4_4: Vo.UNSIGNED_SHORT_4_4_4_4,
	UNSIGNED_SHORT_5_5_5_1: Vo.UNSIGNED_SHORT_5_5_5_1,
	UNSIGNED_SHORT_5_6_5: Vo.UNSIGNED_SHORT_5_6_5,
	toWebGLConstant: function(e, t) {
		switch (e) {
			case sc.UNSIGNED_BYTE: return Vo.UNSIGNED_BYTE;
			case sc.UNSIGNED_SHORT: return Vo.UNSIGNED_SHORT;
			case sc.UNSIGNED_INT: return Vo.UNSIGNED_INT;
			case sc.FLOAT: return Vo.FLOAT;
			case sc.HALF_FLOAT: return t.webgl2 ? Vo.HALF_FLOAT : Vo.HALF_FLOAT_OES;
			case sc.UNSIGNED_INT_24_8: return Vo.UNSIGNED_INT_24_8;
			case sc.UNSIGNED_SHORT_4_4_4_4: return Vo.UNSIGNED_SHORT_4_4_4_4;
			case sc.UNSIGNED_SHORT_5_5_5_1: return Vo.UNSIGNED_SHORT_5_5_5_1;
			case sc.UNSIGNED_SHORT_5_6_5: return sc.UNSIGNED_SHORT_5_6_5;
		}
	},
	isPacked: function(e) {
		return e === sc.UNSIGNED_INT_24_8 || e === sc.UNSIGNED_SHORT_4_4_4_4 || e === sc.UNSIGNED_SHORT_5_5_5_1 || e === sc.UNSIGNED_SHORT_5_6_5;
	},
	sizeInBytes: function(e) {
		switch (e) {
			case sc.UNSIGNED_BYTE: return 1;
			case sc.UNSIGNED_SHORT:
			case sc.UNSIGNED_SHORT_4_4_4_4:
			case sc.UNSIGNED_SHORT_5_5_5_1:
			case sc.UNSIGNED_SHORT_5_6_5:
			case sc.HALF_FLOAT: return 2;
			case sc.UNSIGNED_INT:
			case sc.FLOAT:
			case sc.UNSIGNED_INT_24_8: return 4;
		}
	},
	validate: function(e) {
		return e === sc.UNSIGNED_BYTE || e === sc.UNSIGNED_SHORT || e === sc.UNSIGNED_INT || e === sc.FLOAT || e === sc.HALF_FLOAT || e === sc.UNSIGNED_INT_24_8 || e === sc.UNSIGNED_SHORT_4_4_4_4 || e === sc.UNSIGNED_SHORT_5_5_5_1 || e === sc.UNSIGNED_SHORT_5_6_5;
	},
	getTypedArrayConstructor: function(e) {
		const t = sc.sizeInBytes(e);
		return t === Uint8Array.BYTES_PER_ELEMENT ? Uint8Array : t === Uint16Array.BYTES_PER_ELEMENT ? Uint16Array : t === Float32Array.BYTES_PER_ELEMENT && e === sc.FLOAT ? Float32Array : Uint32Array;
	}
};
Object.freeze(sc);
const uc = {
	DEPTH_COMPONENT: Vo.DEPTH_COMPONENT,
	DEPTH_STENCIL: Vo.DEPTH_STENCIL,
	ALPHA: Vo.ALPHA,
	RED: Vo.RED,
	RG: Vo.RG,
	RGB: Vo.RGB,
	RGBA: Vo.RGBA,
	RED_INTEGER: Vo.RED_INTEGER,
	RG_INTEGER: Vo.RG_INTEGER,
	RGB_INTEGER: Vo.RGB_INTEGER,
	RGBA_INTEGER: Vo.RGBA_INTEGER,
	LUMINANCE: Vo.LUMINANCE,
	LUMINANCE_ALPHA: Vo.LUMINANCE_ALPHA,
	RGB_DXT1: Vo.COMPRESSED_RGB_S3TC_DXT1_EXT,
	RGBA_DXT1: Vo.COMPRESSED_RGBA_S3TC_DXT1_EXT,
	RGBA_DXT3: Vo.COMPRESSED_RGBA_S3TC_DXT3_EXT,
	RGBA_DXT5: Vo.COMPRESSED_RGBA_S3TC_DXT5_EXT,
	RGB_PVRTC_4BPPV1: Vo.COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
	RGB_PVRTC_2BPPV1: Vo.COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
	RGBA_PVRTC_4BPPV1: Vo.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
	RGBA_PVRTC_2BPPV1: Vo.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG,
	RGBA_ASTC: Vo.COMPRESSED_RGBA_ASTC_4x4_WEBGL,
	RGB_ETC1: Vo.COMPRESSED_RGB_ETC1_WEBGL,
	RGB8_ETC2: Vo.COMPRESSED_RGB8_ETC2,
	RGBA8_ETC2_EAC: Vo.COMPRESSED_RGBA8_ETC2_EAC,
	RGBA_BC7: Vo.COMPRESSED_RGBA_BPTC_UNORM,
	componentsLength: function(e) {
		switch (e) {
			case uc.RGB:
			case uc.RGB_INTEGER: return 3;
			case uc.RGBA:
			case uc.RGBA_INTEGER: return 4;
			case uc.LUMINANCE_ALPHA:
			case uc.RG:
			case uc.RG_INTEGER: return 2;
			case uc.ALPHA:
			case uc.RED:
			case uc.RED_INTEGER:
			case uc.LUMINANCE:
			default: return 1;
		}
	},
	validate: function(e) {
		return e === uc.DEPTH_COMPONENT || e === uc.DEPTH_STENCIL || e === uc.ALPHA || e === uc.RED || e === uc.RG || e === uc.RGB || e === uc.RGBA || e === uc.RED_INTEGER || e === uc.RG_INTEGER || e === uc.RGB_INTEGER || e === uc.RGBA_INTEGER || e === uc.LUMINANCE || e === uc.LUMINANCE_ALPHA || e === uc.RGB_DXT1 || e === uc.RGBA_DXT1 || e === uc.RGBA_DXT3 || e === uc.RGBA_DXT5 || e === uc.RGB_PVRTC_4BPPV1 || e === uc.RGB_PVRTC_2BPPV1 || e === uc.RGBA_PVRTC_4BPPV1 || e === uc.RGBA_PVRTC_2BPPV1 || e === uc.RGBA_ASTC || e === uc.RGB_ETC1 || e === uc.RGB8_ETC2 || e === uc.RGBA8_ETC2_EAC || e === uc.RGBA_BC7;
	},
	isColorFormat: function(e) {
		return e === uc.RED || e === uc.ALPHA || e === uc.RGB || e === uc.RGBA || e === uc.LUMINANCE || e === uc.LUMINANCE_ALPHA;
	},
	isDepthFormat: function(e) {
		return e === uc.DEPTH_COMPONENT || e === uc.DEPTH_STENCIL;
	},
	isCompressedFormat: function(e) {
		return e === uc.RGB_DXT1 || e === uc.RGBA_DXT1 || e === uc.RGBA_DXT3 || e === uc.RGBA_DXT5 || e === uc.RGB_PVRTC_4BPPV1 || e === uc.RGB_PVRTC_2BPPV1 || e === uc.RGBA_PVRTC_4BPPV1 || e === uc.RGBA_PVRTC_2BPPV1 || e === uc.RGBA_ASTC || e === uc.RGB_ETC1 || e === uc.RGB8_ETC2 || e === uc.RGBA8_ETC2_EAC || e === uc.RGBA_BC7;
	},
	isDXTFormat: function(e) {
		return e === uc.RGB_DXT1 || e === uc.RGBA_DXT1 || e === uc.RGBA_DXT3 || e === uc.RGBA_DXT5;
	},
	isPVRTCFormat: function(e) {
		return e === uc.RGB_PVRTC_4BPPV1 || e === uc.RGB_PVRTC_2BPPV1 || e === uc.RGBA_PVRTC_4BPPV1 || e === uc.RGBA_PVRTC_2BPPV1;
	},
	isASTCFormat: function(e) {
		return e === uc.RGBA_ASTC;
	},
	isETC1Format: function(e) {
		return e === uc.RGB_ETC1;
	},
	isETC2Format: function(e) {
		return e === uc.RGB8_ETC2 || e === uc.RGBA8_ETC2_EAC;
	},
	isBC7Format: function(e) {
		return e === uc.RGBA_BC7;
	},
	compressedTextureSizeInBytes: function(e, t, r) {
		switch (e) {
			case uc.RGB_DXT1:
			case uc.RGBA_DXT1:
			case uc.RGB_ETC1:
			case uc.RGB8_ETC2: return Math.floor((t + 3) / 4) * Math.floor((r + 3) / 4) * 8;
			case uc.RGBA_DXT3:
			case uc.RGBA_DXT5:
			case uc.RGBA_ASTC:
			case uc.RGBA8_ETC2_EAC: return Math.floor((t + 3) / 4) * Math.floor((r + 3) / 4) * 16;
			case uc.RGB_PVRTC_4BPPV1:
			case uc.RGBA_PVRTC_4BPPV1: return Math.floor((Math.max(t, 8) * Math.max(r, 8) * 4 + 7) / 8);
			case uc.RGB_PVRTC_2BPPV1:
			case uc.RGBA_PVRTC_2BPPV1: return Math.floor((Math.max(t, 16) * Math.max(r, 8) * 2 + 7) / 8);
			case uc.RGBA_BC7: return Math.ceil(t / 4) * Math.ceil(r / 4) * 16;
			default: return 0;
		}
	},
	textureSizeInBytes: function(e, t, r, n) {
		let i = uc.componentsLength(e);
		return sc.isPacked(t) && (i = 1), i * sc.sizeInBytes(t) * r * n;
	},
	texture3DSizeInBytes: function(e, t, r, n, i) {
		let o = uc.componentsLength(e);
		return sc.isPacked(t) && (o = 1), o * sc.sizeInBytes(t) * r * n * i;
	},
	alignmentInBytes: function(e, t, r) {
		const n = uc.textureSizeInBytes(e, t, r, 1) % 4;
		return 0 === n ? 4 : 2 === n ? 2 : 1;
	},
	createTypedArray: function(e, t, r, n) {
		return new (sc.getTypedArrayConstructor(t))(uc.componentsLength(e) * r * n);
	},
	flipY: function(e, t, r, n, i) {
		if (1 === i) return e;
		const o = uc.createTypedArray(t, r, n, i), a = uc.componentsLength(t), s = n * a;
		for (let u = 0; u < i; ++u) {
			const t = u * n * a, r = (i - u - 1) * n * a;
			for (let n = 0; n < s; ++n) o[r + n] = e[t + n];
		}
		return o;
	},
	toInternalFormat: function(e, t, r) {
		if (!r.webgl2) return e;
		if (e === uc.DEPTH_STENCIL) return Vo.DEPTH24_STENCIL8;
		if (e === uc.DEPTH_COMPONENT) {
			if (t === sc.UNSIGNED_SHORT) return Vo.DEPTH_COMPONENT16;
			if (t === sc.UNSIGNED_INT) return Vo.DEPTH_COMPONENT24;
		}
		if (t === sc.FLOAT) switch (e) {
			case uc.RGBA: return Vo.RGBA32F;
			case uc.RGB: return Vo.RGB32F;
			case uc.RG: return Vo.RG32F;
			case uc.RED: return Vo.R32F;
		}
		if (t === sc.HALF_FLOAT) switch (e) {
			case uc.RGBA: return Vo.RGBA16F;
			case uc.RGB: return Vo.RGB16F;
			case uc.RG: return Vo.RG16F;
			case uc.RED: return Vo.R16F;
		}
		if (t === sc.UNSIGNED_BYTE) switch (e) {
			case uc.RGBA: return Vo.RGBA8;
			case uc.RGB: return Vo.RGB8;
			case uc.RG: return Vo.RG8;
			case uc.RED: return Vo.R8;
		}
		if (t === sc.INT) switch (e) {
			case uc.RGBA_INTEGER: return Vo.RGBA32I;
			case uc.RGB_INTEGER: return Vo.RGB32I;
			case uc.RG_INTEGER: return Vo.RG32I;
			case uc.RED_INTEGER: return Vo.R32I;
		}
		if (t === sc.UNSIGNED_INT) switch (e) {
			case uc.RGBA_INTEGER: return Vo.RGBA32UI;
			case uc.RGB_INTEGER: return Vo.RGB32UI;
			case uc.RG_INTEGER: return Vo.RG32UI;
			case uc.RED_INTEGER: return Vo.R32UI;
		}
		return e;
	}
};
Object.freeze(uc);
const cc = {
	STREAM_DRAW: Vo.STREAM_DRAW,
	STATIC_DRAW: Vo.STATIC_DRAW,
	DYNAMIC_DRAW: Vo.DYNAMIC_DRAW,
	DYNAMIC_READ: Vo.DYNAMIC_READ,
	validate: function(e) {
		return e === cc.STREAM_DRAW || e === cc.STATIC_DRAW || e === cc.DYNAMIC_DRAW || e === cc.DYNAMIC_READ;
	}
};
Object.freeze(cc);
const lc = {
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
function fc(e, t, r, n, i, o, a, s, u, c, l) {
	this._context = e, this._texture = t, this._textureTarget = r, this._targetFace = n, this._pixelDatatype = a, this._internalFormat = i, this._pixelFormat = o, this._size = s, this._preMultiplyAlpha = u, this._flipY = c, this._initialized = l;
}
function hc(e, t, r) {
	const n = e._gl;
	n.framebufferTexture2D(n.FRAMEBUFFER, t, r._target, r._texture, 0);
}
function pc(e, t, r) {
	const n = e._gl;
	n.framebufferRenderbuffer(n.FRAMEBUFFER, t, n.RENDERBUFFER, r._getRenderbuffer());
}
function mc(e) {
	const t = (e = e ?? C.EMPTY_OBJECT).context;
	P.defined("options.context", t);
	const r = t._gl, n = lc.maximumColorAttachments;
	if (this._gl = r, this._framebuffer = r.createFramebuffer(), this._colorTextures = [], this._colorRenderbuffers = [], this._activeColorAttachments = [], this._depthTexture = void 0, this._depthRenderbuffer = void 0, this._stencilRenderbuffer = void 0, this._depthStencilTexture = void 0, this._depthStencilRenderbuffer = void 0, this.destroyAttachments = e.destroyAttachments ?? !0, N(e.colorTextures) && N(e.colorRenderbuffers)) throw new v("Cannot have both color texture and color renderbuffer attachments.");
	if (N(e.depthTexture) && N(e.depthRenderbuffer)) throw new v("Cannot have both a depth texture and depth renderbuffer attachment.");
	if (N(e.depthStencilTexture) && N(e.depthStencilRenderbuffer)) throw new v("Cannot have both a depth-stencil texture and depth-stencil renderbuffer attachment.");
	const i = N(e.depthTexture) || N(e.depthRenderbuffer), o = N(e.depthStencilTexture) || N(e.depthStencilRenderbuffer);
	if (i && o) throw new v("Cannot have both a depth and depth-stencil attachment.");
	if (N(e.stencilRenderbuffer) && o) throw new v("Cannot have both a stencil and depth-stencil attachment.");
	if (i && N(e.stencilRenderbuffer)) throw new v("Cannot have both a depth and stencil attachment.");
	if (this._bind(), N(e.colorTextures)) {
		const r = e.colorTextures, i = this._colorTextures.length = this._activeColorAttachments.length = r.length;
		if (i > n) throw new v("The number of color attachments exceeds the number supported.");
		for (let e = 0; e < i; ++e) {
			const n = r[e];
			if (!uc.isColorFormat(n.pixelFormat)) throw new v("The color-texture pixel-format must be a color format.");
			if (n.pixelDatatype === sc.FLOAT && !t.colorBufferFloat) throw new v("The color texture pixel datatype is FLOAT and the WebGL implementation does not support the EXT_color_buffer_float or WEBGL_color_buffer_float extensions. See Context.colorBufferFloat.");
			if (n.pixelDatatype === sc.HALF_FLOAT && !t.colorBufferHalfFloat) throw new v("The color texture pixel datatype is HALF_FLOAT and the WebGL implementation does not support the EXT_color_buffer_half_float extension. See Context.colorBufferHalfFloat.");
			const i = this._gl.COLOR_ATTACHMENT0 + e;
			hc(this, i, n), this._activeColorAttachments[e] = i, this._colorTextures[e] = n;
		}
	}
	if (N(e.colorRenderbuffers)) {
		const t = e.colorRenderbuffers, r = this._colorRenderbuffers.length = this._activeColorAttachments.length = t.length;
		if (r > n) throw new v("The number of color attachments exceeds the number supported.");
		for (let e = 0; e < r; ++e) {
			const r = t[e], n = this._gl.COLOR_ATTACHMENT0 + e;
			pc(this, n, r), this._activeColorAttachments[e] = n, this._colorRenderbuffers[e] = r;
		}
	}
	if (N(e.depthTexture)) {
		const t = e.depthTexture;
		if (t.pixelFormat !== uc.DEPTH_COMPONENT) throw new v("The depth-texture pixel-format must be DEPTH_COMPONENT.");
		hc(this, this._gl.DEPTH_ATTACHMENT, t), this._depthTexture = t;
	}
	if (N(e.depthRenderbuffer)) {
		const t = e.depthRenderbuffer;
		pc(this, this._gl.DEPTH_ATTACHMENT, t), this._depthRenderbuffer = t;
	}
	if (N(e.stencilRenderbuffer)) {
		const t = e.stencilRenderbuffer;
		pc(this, this._gl.STENCIL_ATTACHMENT, t), this._stencilRenderbuffer = t;
	}
	if (N(e.depthStencilTexture)) {
		const t = e.depthStencilTexture;
		if (t.pixelFormat !== uc.DEPTH_STENCIL) throw new v("The depth-stencil pixel-format must be DEPTH_STENCIL.");
		hc(this, this._gl.DEPTH_STENCIL_ATTACHMENT, t), this._depthStencilTexture = t;
	}
	if (N(e.depthStencilRenderbuffer)) {
		const t = e.depthStencilRenderbuffer;
		pc(this, this._gl.DEPTH_STENCIL_ATTACHMENT, t), this._depthStencilRenderbuffer = t;
	}
	this._unBind();
}
Object.defineProperties(lc, {
	maximumCombinedTextureImageUnits: { get: function() {
		return lc._maximumCombinedTextureImageUnits;
	} },
	maximumCubeMapSize: { get: function() {
		return lc._maximumCubeMapSize;
	} },
	maximumFragmentUniformVectors: { get: function() {
		return lc._maximumFragmentUniformVectors;
	} },
	maximumTextureImageUnits: { get: function() {
		return lc._maximumTextureImageUnits;
	} },
	maximumRenderbufferSize: { get: function() {
		return lc._maximumRenderbufferSize;
	} },
	maximumTextureSize: { get: function() {
		return lc._maximumTextureSize;
	} },
	maximum3DTextureSize: { get: function() {
		return lc._maximum3DTextureSize;
	} },
	maximumVaryingVectors: { get: function() {
		return lc._maximumVaryingVectors;
	} },
	maximumVertexAttributes: { get: function() {
		return lc._maximumVertexAttributes;
	} },
	maximumVertexTextureImageUnits: { get: function() {
		return lc._maximumVertexTextureImageUnits;
	} },
	maximumVertexUniformVectors: { get: function() {
		return lc._maximumVertexUniformVectors;
	} },
	minimumAliasedLineWidth: { get: function() {
		return lc._minimumAliasedLineWidth;
	} },
	maximumAliasedLineWidth: { get: function() {
		return lc._maximumAliasedLineWidth;
	} },
	minimumAliasedPointSize: { get: function() {
		return lc._minimumAliasedPointSize;
	} },
	maximumAliasedPointSize: { get: function() {
		return lc._maximumAliasedPointSize;
	} },
	maximumViewportWidth: { get: function() {
		return lc._maximumViewportWidth;
	} },
	maximumViewportHeight: { get: function() {
		return lc._maximumViewportHeight;
	} },
	maximumTextureFilterAnisotropy: { get: function() {
		return lc._maximumTextureFilterAnisotropy;
	} },
	maximumDrawBuffers: { get: function() {
		return lc._maximumDrawBuffers;
	} },
	maximumColorAttachments: { get: function() {
		return lc._maximumColorAttachments;
	} },
	maximumSamples: { get: function() {
		return lc._maximumSamples;
	} },
	highpFloatSupported: { get: function() {
		return lc._highpFloatSupported;
	} },
	highpIntSupported: { get: function() {
		return lc._highpIntSupported;
	} }
}), Object.defineProperties(fc.prototype, {
	pixelFormat: { get: function() {
		return this._pixelFormat;
	} },
	pixelDatatype: { get: function() {
		return this._pixelDatatype;
	} },
	_target: { get: function() {
		return this._targetFace;
	} }
}), fc.prototype.copyFrom = function(e) {
	P.defined("options", e);
	const { xOffset: t = 0, yOffset: r = 0, source: n, skipColorSpaceConversion: i = !1 } = e;
	if (P.defined("options.source", n), P.typeOf.number.greaterThanOrEquals("xOffset", t, 0), P.typeOf.number.greaterThanOrEquals("yOffset", r, 0), t + n.width > this._size) throw new v("xOffset + options.source.width must be less than or equal to width.");
	if (r + n.height > this._size) throw new v("yOffset + options.source.height must be less than or equal to height.");
	const { width: o, height: a } = n, s = this._context._gl, u = this._textureTarget, c = this._targetFace;
	s.activeTexture(s.TEXTURE0), s.bindTexture(u, this._texture);
	let l = n.arrayBufferView;
	const f = this._size, h = this._pixelFormat, p = this._internalFormat, m = this._pixelDatatype, d = this._preMultiplyAlpha, y = this._flipY;
	let _ = 4;
	N(l) && (_ = uc.alignmentInBytes(h, m, o)), s.pixelStorei(s.UNPACK_ALIGNMENT, _), i ? s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, s.NONE) : s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, s.BROWSER_DEFAULT_WEBGL);
	let g = !1;
	if (!this._initialized) {
		let e;
		0 === t && 0 === r && o === f && a === f ? (N(l) ? (s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), y && (l = uc.flipY(l, h, m, f, f)), e = l) : (s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, d), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, y), e = n), g = !0) : (s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), e = uc.createTypedArray(h, m, f, f)), s.texImage2D(c, 0, p, f, f, 0, h, sc.toWebGLConstant(m, this._context), e), this._initialized = !0;
	}
	g || (N(l) ? (s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), y && (l = uc.flipY(l, h, m, o, a)), s.texSubImage2D(c, 0, t, r, o, a, h, sc.toWebGLConstant(m, this._context), l)) : (s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, d), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, y), s.texSubImage2D(c, 0, t, r, h, sc.toWebGLConstant(m, this._context), n))), s.bindTexture(u, null);
}, fc.prototype.copyFromFramebuffer = function(e, t, r, n, i, o) {
	if (e = e ?? 0, t = t ?? 0, r = r ?? 0, n = n ?? 0, i = i ?? this._size, o = o ?? this._size, P.typeOf.number.greaterThanOrEquals("xOffset", e, 0), P.typeOf.number.greaterThanOrEquals("yOffset", t, 0), P.typeOf.number.greaterThanOrEquals("framebufferXOffset", r, 0), P.typeOf.number.greaterThanOrEquals("framebufferYOffset", n, 0), e + i > this._size) throw new v("xOffset + source.width must be less than or equal to width.");
	if (t + o > this._size) throw new v("yOffset + source.height must be less than or equal to height.");
	if (this._pixelDatatype === sc.FLOAT) throw new v("Cannot call copyFromFramebuffer when the texture pixel data type is FLOAT.");
	if (this._pixelDatatype === sc.HALF_FLOAT) throw new v("Cannot call copyFromFramebuffer when the texture pixel data type is HALF_FLOAT.");
	const a = this._context._gl, s = this._textureTarget;
	a.activeTexture(a.TEXTURE0), a.bindTexture(s, this._texture), a.copyTexSubImage2D(this._targetFace, 0, e, t, r, n, i, o), a.bindTexture(s, null), this._initialized = !0;
}, fc.prototype.copyMipmapFromFramebuffer = function(e, t, r, n, i) {
	if (e = e ?? 0, t = t ?? 0, r = r ?? this._size, n = n ?? this._size, i = i ?? 0, P.typeOf.number.greaterThanOrEquals("xOffset", e, 0), P.typeOf.number.greaterThanOrEquals("yOffset", t, 0), e + r > this._size) throw new v("xOffset + source.width must be less than or equal to width.");
	if (t + n > this._size) throw new v("yOffset + source.height must be less than or equal to height.");
	if (this._pixelDatatype === sc.FLOAT) throw new v("Cannot call copyFromFramebuffer when the texture pixel data type is FLOAT.");
	if (this._pixelDatatype === sc.HALF_FLOAT) throw new v("Cannot call copyFromFramebuffer when the texture pixel data type is HALF_FLOAT.");
	const o = this._context._gl, a = this._textureTarget;
	o.activeTexture(o.TEXTURE0), o.bindTexture(a, this._texture), o.copyTexImage2D(this._targetFace, i, this._internalFormat, e, t, r, n, 0), o.bindTexture(a, null), this._initialized = !0;
}, Object.defineProperties(mc.prototype, {
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
}), mc.prototype._bind = function() {
	const e = this._gl;
	e.bindFramebuffer(e.FRAMEBUFFER, this._framebuffer);
}, mc.prototype._unBind = function() {
	const e = this._gl;
	e.bindFramebuffer(e.FRAMEBUFFER, null);
}, mc.prototype.bindDraw = function() {
	const e = this._gl;
	e.bindFramebuffer(e.DRAW_FRAMEBUFFER, this._framebuffer);
}, mc.prototype.bindRead = function() {
	const e = this._gl;
	e.bindFramebuffer(e.READ_FRAMEBUFFER, this._framebuffer);
}, mc.prototype._getActiveColorAttachments = function() {
	return this._activeColorAttachments;
}, mc.prototype.getColorTexture = function(e) {
	if (!N(e) || e < 0 || e >= this._colorTextures.length) throw new v("index is required, must be greater than or equal to zero and must be less than the number of color attachments.");
	return this._colorTextures[e];
}, mc.prototype.getColorRenderbuffer = function(e) {
	if (!N(e) || e < 0 || e >= this._colorRenderbuffers.length) throw new v("index is required, must be greater than or equal to zero and must be less than the number of color attachments.");
	return this._colorRenderbuffers[e];
}, mc.prototype.isDestroyed = function() {
	return !1;
}, mc.prototype.destroy = function() {
	if (this.destroyAttachments) {
		const e = this._colorTextures;
		for (let r = 0; r < e.length; ++r) {
			const t = e[r];
			N(t) && t.destroy();
		}
		const t = this._colorRenderbuffers;
		for (let r = 0; r < t.length; ++r) {
			const e = t[r];
			N(e) && e.destroy();
		}
		this._depthTexture = this._depthTexture && this._depthTexture.destroy(), this._depthRenderbuffer = this._depthRenderbuffer && this._depthRenderbuffer.destroy(), this._stencilRenderbuffer = this._stencilRenderbuffer && this._stencilRenderbuffer.destroy(), this._depthStencilTexture = this._depthStencilTexture && this._depthStencilTexture.destroy(), this._depthStencilRenderbuffer = this._depthStencilRenderbuffer && this._depthStencilRenderbuffer.destroy();
	}
	return this._gl.deleteFramebuffer(this._framebuffer), eo(this);
};
const dc = {
	DONT_CARE: Vo.DONT_CARE,
	FASTEST: Vo.FASTEST,
	NICEST: Vo.NICEST,
	validate: function(e) {
		return e === dc.DONT_CARE || e === dc.FASTEST || e === dc.NICEST;
	}
};
Object.freeze(dc);
const yc = {
	NEAREST: Vo.NEAREST,
	LINEAR: Vo.LINEAR,
	validate: function(e) {
		return e === yc.NEAREST || e === yc.LINEAR;
	}
};
Object.freeze(yc);
const _c = {
	NEAREST: Vo.NEAREST,
	LINEAR: Vo.LINEAR,
	NEAREST_MIPMAP_NEAREST: Vo.NEAREST_MIPMAP_NEAREST,
	LINEAR_MIPMAP_NEAREST: Vo.LINEAR_MIPMAP_NEAREST,
	NEAREST_MIPMAP_LINEAR: Vo.NEAREST_MIPMAP_LINEAR,
	LINEAR_MIPMAP_LINEAR: Vo.LINEAR_MIPMAP_LINEAR,
	validate: function(e) {
		return e === _c.NEAREST || e === _c.LINEAR || e === _c.NEAREST_MIPMAP_NEAREST || e === _c.LINEAR_MIPMAP_NEAREST || e === _c.NEAREST_MIPMAP_LINEAR || e === _c.LINEAR_MIPMAP_LINEAR;
	}
};
Object.freeze(_c);
const gc = {
	CLAMP_TO_EDGE: Vo.CLAMP_TO_EDGE,
	REPEAT: Vo.REPEAT,
	MIRRORED_REPEAT: Vo.MIRRORED_REPEAT,
	validate: function(e) {
		return e === gc.CLAMP_TO_EDGE || e === gc.REPEAT || e === gc.MIRRORED_REPEAT;
	}
};
function Ec(e) {
	e = e ?? C.EMPTY_OBJECT;
	const { wrapR: t = gc.CLAMP_TO_EDGE, wrapS: r = gc.CLAMP_TO_EDGE, wrapT: n = gc.CLAMP_TO_EDGE, minificationFilter: i = _c.LINEAR, magnificationFilter: o = yc.LINEAR, maximumAnisotropy: a = 1 } = e;
	if (!gc.validate(t)) throw new v("Invalid sampler.wrapR.");
	if (!gc.validate(r)) throw new v("Invalid sampler.wrapS.");
	if (!gc.validate(n)) throw new v("Invalid sampler.wrapT.");
	if (!_c.validate(i)) throw new v("Invalid sampler.minificationFilter.");
	if (!yc.validate(o)) throw new v("Invalid sampler.magnificationFilter.");
	P.typeOf.number.greaterThanOrEquals("maximumAnisotropy", a, 1), this._wrapR = t, this._wrapS = r, this._wrapT = n, this._minificationFilter = i, this._magnificationFilter = o, this._maximumAnisotropy = a;
}
function bc(e) {
	if (e = e ?? C.EMPTY_OBJECT, P.defined("options.context", e.context), !N(e.typedArray) && !N(e.sizeInBytes)) throw new v("Either options.sizeInBytes or options.typedArray is required.");
	if (N(e.typedArray) && N(e.sizeInBytes)) throw new v("Cannot pass in both options.sizeInBytes and options.typedArray.");
	if (N(e.typedArray) && (P.typeOf.object("options.typedArray", e.typedArray), P.typeOf.number("options.typedArray.byteLength", e.typedArray.byteLength)), !cc.validate(e.usage)) throw new v("usage is invalid.");
	const t = e.context._gl, r = e.bufferTarget, n = e.typedArray;
	let i = e.sizeInBytes;
	const o = e.usage, a = N(n);
	a && (i = n.byteLength), P.typeOf.number.greaterThan("sizeInBytes", i, 0);
	const s = t.createBuffer();
	t.bindBuffer(r, s), t.bufferData(r, a ? n : i, o), t.bindBuffer(r, null), this._id = Ca(), this._gl = t, this._webgl2 = e.context._webgl2, this._bufferTarget = r, this._sizeInBytes = i, this._usage = o, this._buffer = s, this.vertexArrayDestroyable = !0;
}
function Tc(e, t) {
	if (!e) throw new v(t);
}
function Oc(e, t, r, n) {
	const i = N(t.vertexBuffer), o = N(t.value), a = t.value ? t.value.length : t.componentsPerAttribute;
	if (!i && !o) throw new v("attribute must have a vertexBuffer or a value.");
	if (i && o) throw new v("attribute cannot have both a vertexBuffer and a value.  It must have either a vertexBuffer property defining per-vertex data or a value property defining data for all vertices.");
	if (1 !== a && 2 !== a && 3 !== a && 4 !== a) {
		if (o) throw new v("attribute.value.length must be in the range [1, 4].");
		throw new v("attribute.componentsPerAttribute must be in the range [1, 4].");
	}
	if (N(t.componentDatatype) && !Ho.validate(t.componentDatatype)) throw new v("attribute must have a valid componentDatatype or not specify it.");
	if (N(t.strideInBytes) && t.strideInBytes > 255) throw new v("attribute must have a strideInBytes less than or equal to 255 or not specify it.");
	if (N(t.instanceDivisor) && t.instanceDivisor > 0 && !n.instancedArrays) throw new v("instanced arrays is not supported");
	if (N(t.instanceDivisor) && t.instanceDivisor < 0) throw new v("attribute must have an instanceDivisor greater than or equal to zero");
	if (N(t.instanceDivisor) && o) throw new v("attribute cannot have have an instanceDivisor if it is not backed by a buffer");
	if (N(t.instanceDivisor) && t.instanceDivisor > 0 && 0 === t.index) throw new v("attribute zero cannot have an instanceDivisor greater than 0");
	const s = {
		index: t.index ?? r,
		enabled: t.enabled ?? !0,
		vertexBuffer: t.vertexBuffer,
		value: o ? t.value.slice(0) : void 0,
		componentsPerAttribute: a,
		componentDatatype: t.componentDatatype ?? Ho.FLOAT,
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
function wc(e, t, r) {
	for (let n = 0; n < t.length; ++n) {
		const r = t[n];
		r.enabled && r.vertexAttrib(e);
	}
	N(r) && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, r._getBuffer());
}
function Ac(e) {
	e = e ?? C.EMPTY_OBJECT, P.defined("options.context", e.context), P.defined("options.attributes", e.attributes);
	const t = e.context, r = t._gl, n = e.attributes, i = e.indexBuffer;
	let o;
	const a = [];
	let s = 1, u = !1, c = !1, l = n.length;
	for (o = 0; o < l; ++o) Oc(a, n[o], o, t);
	for (l = a.length, o = 0; o < l; ++o) {
		const e = a[o];
		if (N(e.vertexBuffer) && 0 === e.instanceDivisor) {
			const t = e.strideInBytes || e.componentsPerAttribute * Ho.getSizeInBytes(e.componentDatatype);
			s = e.vertexBuffer.sizeInBytes / t;
			break;
		}
	}
	for (o = 0; o < l; ++o) a[o].instanceDivisor > 0 && (u = !0), N(a[o].value) && (c = !0);
	const f = {};
	for (o = 0; o < l; ++o) {
		const e = a[o].index;
		if (f[e]) throw new v(`Index ${e} is used by more than one attribute.`);
		f[e] = !0;
	}
	let h;
	t.vertexArrayObject && (h = t.glCreateVertexArray(), t.glBindVertexArray(h), wc(r, a, i), t.glBindVertexArray(null)), this._numberOfVertices = s, this._hasInstancedAttributes = u, this._hasConstantAttributes = c, this._context = t, this._gl = r, this._vao = h, this._attributes = a, this._indexBuffer = i;
}
function xc(e) {
	return e.values.length / e.componentsPerAttribute;
}
function Rc(e) {
	return Ho.getSizeInBytes(e.componentDatatype) * e.componentsPerAttribute;
}
function Sc(e) {
	e = e ?? C.EMPTY_OBJECT, P.defined("options.context", e.context);
	const { context: t, source: r, pixelFormat: n = uc.RGBA, pixelDatatype: i = sc.UNSIGNED_BYTE, flipY: o = !0, skipColorSpaceConversion: a = !1, sampler: s = new Ec() } = e, u = e.preMultiplyAlpha || n === uc.RGB || n === uc.LUMINANCE;
	let { width: c, height: l } = e;
	if (N(r)) {
		if (!Object.values(Sc.FaceName).every((e) => N(r[e]))) throw new v(`options.source requires faces ${Object.values(Sc.FaceName).join(", ")}.`);
		({width: c, height: l} = r.positiveX);
		for (const e of Sc.faceNames()) {
			const t = r[e];
			if (Number(t.width) !== c || Number(t.height) !== l) throw new v("Each face in options.source must have the same width and height.");
		}
	}
	const f = c;
	if (!N(c) || !N(l)) throw new v("options requires a source field to create an initialized cube map or width and height fields to create a blank cube map.");
	if (c !== l) throw new v("Width must equal height.");
	if (f <= 0) throw new v("Width and height must be greater than zero.");
	if (f > lc.maximumCubeMapSize) throw new v(`Width and height must be less than or equal to the maximum cube map size (${lc.maximumCubeMapSize}). Check maximumCubeMapSize.`);
	if (!uc.validate(n)) throw new v("Invalid options.pixelFormat.");
	if (uc.isDepthFormat(n)) throw new v("options.pixelFormat cannot be DEPTH_COMPONENT or DEPTH_STENCIL.");
	if (!sc.validate(i)) throw new v("Invalid options.pixelDatatype.");
	if (i === sc.FLOAT && !t.floatingPointTexture) throw new v("When options.pixelDatatype is FLOAT, this WebGL implementation must support the OES_texture_float extension.");
	if (i === sc.HALF_FLOAT && !t.halfFloatingPointTexture) throw new v("When options.pixelDatatype is HALF_FLOAT, this WebGL implementation must support the OES_texture_half_float extension.");
	const h = 6 * uc.textureSizeInBytes(n, i, f, f), p = uc.toInternalFormat(n, i, t), m = t._gl, d = m.TEXTURE_CUBE_MAP, y = m.createTexture();
	this._context = t, this._textureFilterAnisotropic = t._textureFilterAnisotropic, this._textureTarget = d, this._texture = y, this._pixelFormat = n, this._pixelDatatype = i, this._size = f, this._hasMipmap = !1, this._sizeInBytes = h, this._preMultiplyAlpha = u, this._flipY = o;
	const _ = N(r);
	function g(e) {
		return new fc(t, y, d, e, p, n, i, f, u, o, _);
	}
	this._positiveX = g(m.TEXTURE_CUBE_MAP_POSITIVE_X), this._negativeX = g(m.TEXTURE_CUBE_MAP_NEGATIVE_X), this._positiveY = g(m.TEXTURE_CUBE_MAP_POSITIVE_Y), this._negativeY = g(m.TEXTURE_CUBE_MAP_NEGATIVE_Y), this._positiveZ = g(m.TEXTURE_CUBE_MAP_POSITIVE_Z), this._negativeZ = g(m.TEXTURE_CUBE_MAP_NEGATIVE_Z), this._sampler = s, Cc(this, s), m.activeTexture(m.TEXTURE0), m.bindTexture(d, y), a ? m.pixelStorei(m.UNPACK_COLORSPACE_CONVERSION_WEBGL, m.NONE) : m.pixelStorei(m.UNPACK_COLORSPACE_CONVERSION_WEBGL, m.BROWSER_DEFAULT_WEBGL);
	for (const E of Sc.faceNames()) Ic(this[E], r?.[E], 0);
	m.bindTexture(d, null);
}
function Ic(e, t, r) {
	r = r ?? 0;
	const n = e._targetFace, i = Math.max(Math.floor(e._size / 2 ** r), 1), o = e._pixelFormat, a = e._pixelDatatype, s = e._internalFormat, u = e._flipY, c = e._preMultiplyAlpha, l = e._context, f = l._gl;
	if (!N(t)) return void f.texImage2D(n, r, s, i, i, 0, o, sc.toWebGLConstant(a, l), null);
	let { arrayBufferView: h } = t, p = 4;
	N(h) && (p = uc.alignmentInBytes(o, a, i)), f.pixelStorei(f.UNPACK_ALIGNMENT, p), N(h) ? (f.pixelStorei(f.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), f.pixelStorei(f.UNPACK_FLIP_Y_WEBGL, !1), u && (h = uc.flipY(h, o, a, i, i)), f.texImage2D(n, r, s, i, i, 0, o, sc.toWebGLConstant(a, l), h)) : (f.pixelStorei(f.UNPACK_PREMULTIPLY_ALPHA_WEBGL, c), f.pixelStorei(f.UNPACK_FLIP_Y_WEBGL, u), f.texImage2D(n, r, s, o, sc.toWebGLConstant(a, l), t));
}
function Cc(e, t) {
	let { minificationFilter: r, magnificationFilter: n } = t;
	const i = [
		_c.NEAREST_MIPMAP_NEAREST,
		_c.NEAREST_MIPMAP_LINEAR,
		_c.LINEAR_MIPMAP_NEAREST,
		_c.LINEAR_MIPMAP_LINEAR
	].includes(r), o = e._context, a = e._pixelDatatype;
	(a === sc.FLOAT && !o.textureFloatLinear || a === sc.HALF_FLOAT && !o.textureHalfFloatLinear) && (r = i ? _c.NEAREST_MIPMAP_NEAREST : _c.NEAREST, n = yc.NEAREST);
	const s = o._gl, u = e._textureTarget;
	s.activeTexture(s.TEXTURE0), s.bindTexture(u, e._texture), s.texParameteri(u, s.TEXTURE_MIN_FILTER, r), s.texParameteri(u, s.TEXTURE_MAG_FILTER, n), s.texParameteri(u, s.TEXTURE_WRAP_S, t.wrapS), s.texParameteri(u, s.TEXTURE_WRAP_T, t.wrapT), N(e._textureFilterAnisotropic) && s.texParameteri(u, e._textureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT, t.maximumAnisotropy), s.bindTexture(u, null);
}
function Nc(e) {
	e = e ?? C.EMPTY_OBJECT, P.defined("options.context", e.context);
	const { context: t, source: r, pixelFormat: n = uc.RGBA, pixelDatatype: i = sc.UNSIGNED_BYTE, flipY: o = !0, skipColorSpaceConversion: a = !1, sampler: s = new Ec() } = e;
	let { width: u, height: c } = e;
	N(r) && (N(u) || (u = r.videoWidth ?? r.naturalWidth ?? r.width), N(c) || (c = r.videoHeight ?? r.naturalHeight ?? r.height));
	const l = e.preMultiplyAlpha || n === uc.RGB || n === uc.LUMINANCE, f = uc.toInternalFormat(n, i, t), h = uc.isCompressedFormat(f);
	if (!N(u) || !N(c)) throw new v("options requires a source field to create an initialized texture or width and height fields to create a blank texture.");
	if (P.typeOf.number.greaterThan("width", u, 0), u > lc.maximumTextureSize) throw new v(`Width must be less than or equal to the maximum texture size (${lc.maximumTextureSize}).  Check maximumTextureSize.`);
	if (P.typeOf.number.greaterThan("height", c, 0), c > lc.maximumTextureSize) throw new v(`Height must be less than or equal to the maximum texture size (${lc.maximumTextureSize}).  Check maximumTextureSize.`);
	if (!uc.validate(n)) throw new v("Invalid options.pixelFormat.");
	if (!h && !sc.validate(i)) throw new v("Invalid options.pixelDatatype.");
	if (n === uc.DEPTH_COMPONENT && i !== sc.UNSIGNED_SHORT && i !== sc.UNSIGNED_INT) throw new v("When options.pixelFormat is DEPTH_COMPONENT, options.pixelDatatype must be UNSIGNED_SHORT or UNSIGNED_INT.");
	if (n === uc.DEPTH_STENCIL && i !== sc.UNSIGNED_INT_24_8) throw new v("When options.pixelFormat is DEPTH_STENCIL, options.pixelDatatype must be UNSIGNED_INT_24_8.");
	if (i === sc.FLOAT && !t.floatingPointTexture) throw new v("When options.pixelDatatype is FLOAT, this WebGL implementation must support the OES_texture_float extension.  Check context.floatingPointTexture.");
	if (i === sc.HALF_FLOAT && !t.halfFloatingPointTexture) throw new v("When options.pixelDatatype is HALF_FLOAT, this WebGL implementation must support the OES_texture_half_float extension. Check context.halfFloatingPointTexture.");
	if (uc.isDepthFormat(n)) {
		if (N(r)) throw new v("When options.pixelFormat is DEPTH_COMPONENT or DEPTH_STENCIL, source cannot be provided.");
		if (!t.depthTexture) throw new v("When options.pixelFormat is DEPTH_COMPONENT or DEPTH_STENCIL, this WebGL implementation must support WEBGL_depth_texture.  Check context.depthTexture.");
	}
	if (h) {
		if (!N(r) || !N(r.arrayBufferView)) throw new v("When options.pixelFormat is compressed, options.source.arrayBufferView must be defined.");
		if (uc.isDXTFormat(f) && !t.s3tc) throw new v("When options.pixelFormat is S3TC compressed, this WebGL implementation must support the WEBGL_compressed_texture_s3tc extension. Check context.s3tc.");
		if (uc.isPVRTCFormat(f) && !t.pvrtc) throw new v("When options.pixelFormat is PVRTC compressed, this WebGL implementation must support the WEBGL_compressed_texture_pvrtc extension. Check context.pvrtc.");
		if (uc.isASTCFormat(f) && !t.astc) throw new v("When options.pixelFormat is ASTC compressed, this WebGL implementation must support the WEBGL_compressed_texture_astc extension. Check context.astc.");
		if (uc.isETC2Format(f) && !t.etc) throw new v("When options.pixelFormat is ETC2 compressed, this WebGL implementation must support the WEBGL_compressed_texture_etc extension. Check context.etc.");
		if (uc.isETC1Format(f) && !t.etc1) throw new v("When options.pixelFormat is ETC1 compressed, this WebGL implementation must support the WEBGL_compressed_texture_etc1 extension. Check context.etc1.");
		if (uc.isBC7Format(f) && !t.bc7) throw new v("When options.pixelFormat is BC7 compressed, this WebGL implementation must support the EXT_texture_compression_bptc extension. Check context.bc7.");
		if (uc.compressedTextureSizeInBytes(f, u, c) !== r.arrayBufferView.byteLength) throw new v("The byte length of the array buffer is invalid for the compressed texture with the given width and height.");
	}
	const p = t._gl, m = h ? uc.compressedTextureSizeInBytes(n, u, c) : uc.textureSizeInBytes(n, i, u, c);
	this._id = e.id ?? Ca(), this._context = t, this._textureFilterAnisotropic = t._textureFilterAnisotropic, this._textureTarget = p.TEXTURE_2D, this._texture = p.createTexture(), this._internalFormat = f, this._pixelFormat = n, this._pixelDatatype = i, this._width = u, this._height = c, this._dimensions = new q(u, c), this._hasMipmap = !1, this._sizeInBytes = m, this._preMultiplyAlpha = l, this._flipY = o, this._initialized = !1, this._sampler = void 0, this._sampler = s, Fc(this, s), p.activeTexture(p.TEXTURE0), p.bindTexture(this._textureTarget, this._texture), N(r) ? (a ? p.pixelStorei(p.UNPACK_COLORSPACE_CONVERSION_WEBGL, p.NONE) : p.pixelStorei(p.UNPACK_COLORSPACE_CONVERSION_WEBGL, p.BROWSER_DEFAULT_WEBGL), N(r.arrayBufferView) ? uc.isCompressedFormat(f) ? function(e, t) {
		const r = e._context._gl, n = e._textureTarget, i = e._internalFormat, { width: o, height: a } = e;
		if (r.pixelStorei(r.UNPACK_ALIGNMENT, 4), r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1), r.compressedTexImage2D(n, 0, i, o, a, 0, t.arrayBufferView), N(t.mipLevels)) {
			let e = o, s = a;
			for (let o = 0; o < t.mipLevels.length; ++o) e = Mc(e), s = Mc(s), r.compressedTexImage2D(n, o + 1, i, e, s, 0, t.mipLevels[o]);
		}
	}(this, r) : vc(this, r) : N(r.framebuffer) ? function(e, t) {
		const r = e._context, n = r._gl;
		n.pixelStorei(n.UNPACK_ALIGNMENT, 4), n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, !1), t.framebuffer !== r.defaultFramebuffer && t.framebuffer._bind(), n.copyTexImage2D(e._textureTarget, 0, e._internalFormat, t.xOffset, t.yOffset, e.width, e.height, 0), t.framebuffer !== r.defaultFramebuffer && t.framebuffer._unBind();
	}(this, r) : Pc(this, r), this._initialized = !0) : Lc(this), p.bindTexture(this._textureTarget, null);
}
function vc(e, t) {
	const r = e._context, n = r._gl, i = e._textureTarget, o = e._internalFormat, { width: a, height: s, pixelFormat: u, pixelDatatype: c, flipY: l } = e, f = uc.alignmentInBytes(u, c, a);
	n.pixelStorei(n.UNPACK_ALIGNMENT, f), n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, !1);
	let { arrayBufferView: h } = t;
	if (l && (h = uc.flipY(h, u, c, a, s)), n.texImage2D(i, 0, o, a, s, 0, u, sc.toWebGLConstant(c, r), h), N(t.mipLevels)) {
		let e = a, l = s;
		for (let a = 0; a < t.mipLevels.length; ++a) e = Mc(e), l = Mc(l), n.texImage2D(i, a + 1, o, e, l, 0, u, sc.toWebGLConstant(c, r), t.mipLevels[a]);
	}
}
function Pc(e, t) {
	const r = e._context, n = r._gl;
	n.pixelStorei(n.UNPACK_ALIGNMENT, 4), n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.preMultiplyAlpha), n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, e.flipY), n.texImage2D(e._textureTarget, 0, e._internalFormat, e.pixelFormat, sc.toWebGLConstant(e.pixelDatatype, r), t);
}
function Mc(e) {
	const t = 0 | Math.floor(e / 2);
	return Math.max(t, 1);
}
function Lc(e) {
	const t = e._context;
	t._gl.texImage2D(e._textureTarget, 0, e._internalFormat, e._width, e._height, 0, e._pixelFormat, sc.toWebGLConstant(e._pixelDatatype, t), null);
}
function Fc(e, t) {
	let { minificationFilter: r, magnificationFilter: n } = t;
	const i = [
		_c.NEAREST_MIPMAP_NEAREST,
		_c.NEAREST_MIPMAP_LINEAR,
		_c.LINEAR_MIPMAP_NEAREST,
		_c.LINEAR_MIPMAP_LINEAR
	].includes(r), o = e._context, a = e._pixelFormat, s = e._pixelDatatype;
	(s === sc.FLOAT && !o.textureFloatLinear || s === sc.HALF_FLOAT && !o.textureHalfFloatLinear) && (r = i ? _c.NEAREST_MIPMAP_NEAREST : _c.NEAREST, n = yc.NEAREST), o.webgl2 && uc.isDepthFormat(a) && (r = _c.NEAREST, n = yc.NEAREST);
	const u = o._gl, c = e._textureTarget;
	u.activeTexture(u.TEXTURE0), u.bindTexture(c, e._texture), u.texParameteri(c, u.TEXTURE_MIN_FILTER, r), u.texParameteri(c, u.TEXTURE_MAG_FILTER, n), u.texParameteri(c, u.TEXTURE_WRAP_S, t.wrapS), u.texParameteri(c, u.TEXTURE_WRAP_T, t.wrapT), N(e._textureFilterAnisotropic) && u.texParameteri(c, e._textureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT, t.maximumAnisotropy), u.bindTexture(c, null);
}
function Dc(e) {
	this.type = void 0, this.shaderSource = void 0, this.materials = void 0, this.uniforms = void 0, this._uniforms = void 0, this.translucent = void 0, this._minificationFilter = e.minificationFilter ?? _c.LINEAR, this._magnificationFilter = e.magnificationFilter ?? yc.LINEAR, this._strict = void 0, this._template = void 0, this._count = void 0, this._texturePaths = {}, this._loadedImages = [], this._loadedCubeMaps = [], this._textures = {}, this._updateFunctions = [], this._defaultTexture = void 0, this._initializationPromises = [], this._initializationError = void 0, function(e, t) {
		let r;
		e = e ?? C.EMPTY_OBJECT, t._strict = e.strict ?? !1, t._count = e.count ?? 0, t._template = st(e.fabric ?? C.EMPTY_OBJECT), t.fabric = st(e.fabric ?? C.EMPTY_OBJECT), t._template.uniforms = st(t._template.uniforms ?? C.EMPTY_OBJECT), t._template.materials = st(t._template.materials ?? C.EMPTY_OBJECT), t.type = N(t._template.type) ? t._template.type : Ca(), t.shaderSource = "", t.materials = {}, t.uniforms = {}, t._uniforms = {}, t._translucentFunctions = [];
		const n = Dc._materialCache.getMaterial(t.type);
		if (N(n)) {
			const e = st(n.fabric, !0);
			t._template = ut(t._template, e, !0), r = n.translucent;
		}
		(function(e) {
			const t = e._template, r = t.uniforms, n = t.materials, i = t.components;
			if (N(i) && N(t.source)) throw new v("fabric: cannot have source and components in the same template.");
			Bc(t, qc, Uc, !0), Bc(i, Gc, Uc, !0);
			const o = [];
			for (const a in n) n.hasOwnProperty(a) && o.push(a);
			Bc(r, o, jc, !1);
		})(t), function(e) {
			const t = e._template.components, r = e._template.source;
			if (N(r)) e.shaderSource += `${r}\n`;
			else {
				if (e.shaderSource += "czm_material czm_getMaterial(czm_materialInput materialInput)\n{\n", e.shaderSource += "czm_material material = czm_getDefaultMaterial(materialInput);\n", N(t)) {
					const r = Object.keys(e._template.materials).length > 0;
					for (const n in t) if (t.hasOwnProperty(n)) if ("diffuse" === n || "emission" === n) {
						const i = r && Wc(t[n], e) ? t[n] : `czm_gammaCorrect(${t[n]})`;
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
				e._count = i._count, e._uniforms = ut(e._uniforms, i._uniforms, !0), e.materials[n] = i, e._translucentFunctions = e._translucentFunctions.concat(i._translucentFunctions);
				const o = "czm_getMaterial", a = `${o}_${e._count++}`;
				if ($c(i, o, a), e.shaderSource = i.shaderSource + e.shaderSource, 0 === $c(e, n, `${a}(materialInput)`) && t) throw new v(`strict: shader source does not use material '${n}'.`);
			}
		}(t), N(n) || Dc._materialCache.addMaterial(t.type, t);
		const i = 0 === t._translucentFunctions.length || void 0;
		if (r = r ?? i, r = e.translucent ?? r, N(r)) if ("function" == typeof r) {
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
	}), N(Dc._uniformList[this.type]) || (Dc._uniformList[this.type] = Object.keys(this._uniforms));
}
function zc(e, t) {
	t.push(...e._initializationPromises);
	const r = e.materials;
	for (const n in r) r.hasOwnProperty(n) && zc(r[n], t);
}
function Bc(e, t, r, n) {
	if (N(e)) {
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
	throw new v(r);
}
function jc(e, t) {
	throw new v(`fabric: uniforms and materials cannot share the same property '${e}'`);
}
Object.freeze(gc), Object.defineProperties(Ec.prototype, {
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
}), Ec.equals = function(e, t) {
	return e === t || N(e) && N(t) && e._wrapR === t._wrapR && e._wrapS === t._wrapS && e._wrapT === t._wrapT && e._minificationFilter === t._minificationFilter && e._magnificationFilter === t._magnificationFilter && e._maximumAnisotropy === t._maximumAnisotropy;
}, Ec.NEAREST = Object.freeze(new Ec({
	wrapR: gc.CLAMP_TO_EDGE,
	wrapS: gc.CLAMP_TO_EDGE,
	wrapT: gc.CLAMP_TO_EDGE,
	minificationFilter: _c.NEAREST,
	magnificationFilter: yc.NEAREST
})), bc.createPixelBuffer = function(e) {
	if (P.defined("options.context", e.context), !e.context._webgl2) throw new v("A WebGL 2 context is required to create PixelBuffers.");
	return new bc({
		context: e.context,
		bufferTarget: Vo.PIXEL_PACK_BUFFER,
		typedArray: e.typedArray,
		sizeInBytes: e.sizeInBytes,
		usage: e.usage
	});
}, bc.createVertexBuffer = function(e) {
	return P.defined("options.context", e.context), new bc({
		context: e.context,
		bufferTarget: Vo.ARRAY_BUFFER,
		typedArray: e.typedArray,
		sizeInBytes: e.sizeInBytes,
		usage: e.usage
	});
}, bc.createIndexBuffer = function(e) {
	if (P.defined("options.context", e.context), !es.validate(e.indexDatatype)) throw new v("Invalid indexDatatype.");
	if (e.indexDatatype === es.UNSIGNED_INT && !e.context.elementIndexUint) throw new v("IndexDatatype.UNSIGNED_INT requires OES_element_index_uint, which is not supported on this system.  Check context.elementIndexUint.");
	const t = e.context, r = e.indexDatatype, n = es.getSizeInBytes(r), i = new bc({
		context: t,
		bufferTarget: Vo.ELEMENT_ARRAY_BUFFER,
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
}, Object.defineProperties(bc.prototype, {
	sizeInBytes: { get: function() {
		return this._sizeInBytes;
	} },
	usage: { get: function() {
		return this._usage;
	} }
}), bc.prototype._getBuffer = function() {
	return this._buffer;
}, bc.prototype._bind = function() {
	const e = this._gl, t = this._bufferTarget;
	e.bindBuffer(t, this._buffer);
}, bc.prototype._unBind = function() {
	const e = this._gl, t = this._bufferTarget;
	e.bindBuffer(t, null);
}, bc.prototype.copyFromArrayView = function(e, t) {
	t = t ?? 0, P.defined("arrayView", e), P.typeOf.number.lessThanOrEquals("offsetInBytes + arrayView.byteLength", t + e.byteLength, this._sizeInBytes);
	const r = this._gl, n = this._bufferTarget;
	r.bindBuffer(n, this._buffer), r.bufferSubData(n, t, e), r.bindBuffer(n, null);
}, bc.prototype.copyFromBuffer = function(e, t, r, n) {
	if (!this._webgl2) throw new v("A WebGL 2 context is required.");
	if (!N(e)) throw new v("readBuffer must be defined.");
	if (!N(n) || n <= 0) throw new v("sizeInBytes must be defined and be greater than zero.");
	if (!N(t) || t < 0 || t + n > e._sizeInBytes) throw new v("readOffset must be greater than or equal to zero and readOffset + sizeInBytes must be less than of equal to readBuffer.sizeInBytes.");
	if (!N(r) || r < 0 || r + n > this._sizeInBytes) throw new v("writeOffset must be greater than or equal to zero and writeOffset + sizeInBytes must be less than of equal to this.sizeInBytes.");
	if (this._buffer === e._buffer && (r >= t && r < t + n || t > r && t < r + n)) throw new v("When readBuffer is equal to this, the ranges [readOffset + sizeInBytes) and [writeOffset, writeOffset + sizeInBytes) must not overlap.");
	if (this._bufferTarget === Vo.ELEMENT_ARRAY_BUFFER && e._bufferTarget !== Vo.ELEMENT_ARRAY_BUFFER || this._bufferTarget !== Vo.ELEMENT_ARRAY_BUFFER && e._bufferTarget === Vo.ELEMENT_ARRAY_BUFFER) throw new v("Can not copy an index buffer into another buffer type.");
	const i = Vo.COPY_READ_BUFFER, o = Vo.COPY_WRITE_BUFFER, a = this._gl;
	a.bindBuffer(o, this._buffer), a.bindBuffer(i, e._buffer), a.copyBufferSubData(i, o, t, r, n), a.bindBuffer(o, null), a.bindBuffer(i, null);
}, bc.prototype.getBufferData = function(e, t, r, n) {
	if (t = t ?? 0, r = r ?? 0, !this._webgl2) throw new v("A WebGL 2 context is required.");
	if (!N(e)) throw new v("arrayView is required.");
	let i, o, a = e.byteLength;
	if (N(n) ? (i = n, N(a) ? o = 1 : (a = e.length, o = e.BYTES_PER_ELEMENT)) : N(a) ? (i = a - r, o = 1) : (a = e.length, i = a - r, o = e.BYTES_PER_ELEMENT), r < 0 || r > a) throw new v("destinationOffset must be greater than zero and less than the arrayView length.");
	if (r + i > a) throw new v("destinationOffset + length must be less than or equal to the arrayViewLength.");
	if (t < 0 || t > this._sizeInBytes) throw new v("sourceOffset must be greater than zero and less than the buffers size.");
	if (t + i * o > this._sizeInBytes) throw new v("sourceOffset + length must be less than the buffers size.");
	const s = this._gl, u = Vo.COPY_READ_BUFFER;
	s.bindBuffer(u, this._buffer), s.getBufferSubData(u, t, e, r, n), s.bindBuffer(u, null);
}, bc.prototype.isDestroyed = function() {
	return !1;
}, bc.prototype.destroy = function() {
	return this._gl.deleteBuffer(this._buffer), eo(this);
}, Ac.fromGeometry = function(e) {
	e = e ?? C.EMPTY_OBJECT, P.defined("options.context", e.context);
	const t = e.context, r = e.geometry ?? C.EMPTY_OBJECT, n = e.bufferUsage ?? cc.DYNAMIC_DRAW, i = e.attributeLocations ?? C.EMPTY_OBJECT, o = e.interleave ?? !1, a = e.vertexArrayAttributes;
	let s, u, c;
	const l = N(a) ? a : [], f = r.attributes;
	if (o) {
		const e = function(e) {
			let t, r, n;
			const i = [];
			for (r in e) e.hasOwnProperty(r) && N(e[r]) && N(e[r].values) && (i.push(r), e[r].componentDatatype === Ho.DOUBLE && (e[r].componentDatatype = Ho.FLOAT, e[r].values = Ho.createTypedArray(Ho.FLOAT, e[r].values)));
			let o;
			const a = i.length;
			if (a > 0) for (o = xc(e[i[0]]), t = 1; t < a; ++t) {
				const r = xc(e[i[t]]);
				if (r !== o) throw new Rt(`Each attribute list must have the same number of vertices.  Attribute ${i[t]} has a different number of vertices (${r.toString()}) than attribute ${i[0]} (${o.toString()}).`);
			}
			i.sort(function(t, r) {
				return Ho.getSizeInBytes(e[r].componentDatatype) - Ho.getSizeInBytes(e[t].componentDatatype);
			});
			let s = 0;
			const u = {};
			for (t = 0; t < a; ++t) r = i[t], n = e[r], u[r] = s, s += Rc(n);
			if (s > 0) {
				const c = Ho.getSizeInBytes(e[i[0]].componentDatatype), l = s % c;
				0 !== l && (s += c - l);
				const f = new ArrayBuffer(o * s), h = {};
				for (t = 0; t < a; ++t) {
					r = i[t];
					const n = Ho.getSizeInBytes(e[r].componentDatatype);
					h[r] = {
						pointer: Ho.createTypedArray(e[r].componentDatatype, f),
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
		if (N(e)) {
			c = bc.createVertexBuffer({
				context: t,
				typedArray: e.buffer,
				usage: n
			});
			const r = e.offsetsInBytes, o = e.vertexSizeInBytes;
			for (s in f) f.hasOwnProperty(s) && N(f[s]) && (u = f[s], N(u.values) ? l.push({
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
	} else for (s in f) if (f.hasOwnProperty(s) && N(f[s])) {
		u = f[s];
		let e = u.componentDatatype;
		e === Ho.DOUBLE && (e = Ho.FLOAT);
		let r = {};
		c = void 0, N(u.values) && (c = bc.createVertexBuffer({
			context: t,
			typedArray: Ho.createTypedArray(e, u.values),
			usage: n
		}), r = {
			index: i[s],
			vertexBuffer: c,
			value: u.value,
			componentDatatype: e,
			componentsPerAttribute: u.componentsPerAttribute,
			normalize: u.normalize
		}), N(u.typedArray) && (c = bc.createVertexBuffer({
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
	return N(p) && (h = ra.computeNumberOfVertices(r) >= B.SIXTY_FOUR_KILOBYTES && t.elementIndexUint ? bc.createIndexBuffer({
		context: t,
		typedArray: new Uint32Array(p),
		usage: n,
		indexDatatype: es.UNSIGNED_INT
	}) : bc.createIndexBuffer({
		context: t,
		typedArray: new Uint16Array(p),
		usage: n,
		indexDatatype: es.UNSIGNED_SHORT
	})), new Ac({
		context: t,
		attributes: l,
		indexBuffer: h
	});
}, Object.defineProperties(Ac.prototype, {
	numberOfAttributes: { get: function() {
		return this._attributes.length;
	} },
	numberOfVertices: { get: function() {
		return this._numberOfVertices;
	} },
	indexBuffer: { get: function() {
		return this._indexBuffer;
	} }
}), Ac.prototype.getAttribute = function(e) {
	return P.defined("index", e), this._attributes[e];
}, Ac.prototype.copyAttributeFromRange = function(e, t, r, n) {
	const i = this.getAttribute(e), o = i.vertexBuffer, a = i.componentsPerAttribute;
	Tc(o.sizeInBytes === t.byteLength, "Invalid buffer length");
	const s = t.constructor, u = r * a * s.BYTES_PER_ELEMENT, c = new s(t.buffer, t.byteOffset + u, n * a);
	o.copyFromArrayView(c, u);
}, Ac.prototype.copyIndexFromRange = function(e, t, r) {
	const n = this._indexBuffer;
	Tc(n.sizeInBytes === e.byteLength, "Invalid buffer length");
	const i = e.constructor, o = t * i.BYTES_PER_ELEMENT, a = new i(e.buffer, e.byteOffset + o, r);
	n.copyFromArrayView(a, o);
}, Ac.prototype._bind = function() {
	N(this._vao) ? (this._context.glBindVertexArray(this._vao), this._context.instancedArrays && function(e) {
		const t = e._context, r = e._hasInstancedAttributes;
		if (!r && !t._previousDrawInstanced) return;
		t._previousDrawInstanced = r;
		const n = t._vertexAttribDivisors, i = e._attributes, o = lc.maximumVertexAttributes;
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
			e.enabled && N(e.value) && e.vertexAttrib(t);
		}
	}(this, this._gl)) : wc(this._gl, this._attributes, this._indexBuffer);
}, Ac.prototype._unBind = function() {
	if (N(this._vao)) this._context.glBindVertexArray(null);
	else {
		const e = this._attributes, t = this._gl;
		for (let r = 0; r < e.length; ++r) {
			const n = e[r];
			n.enabled && n.disableVertexAttribArray(t);
		}
		this._indexBuffer && t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null);
	}
}, Ac.prototype.isDestroyed = function() {
	return !1;
}, Ac.prototype.destroy = function() {
	const e = this._attributes;
	for (let r = 0; r < e.length; ++r) {
		const t = e[r].vertexBuffer;
		N(t) && !t.isDestroyed() && t.vertexArrayDestroyable && t.destroy();
	}
	const t = this._indexBuffer;
	return N(t) && !t.isDestroyed() && t.vertexArrayDestroyable && t.destroy(), N(this._vao) && this._context.glDeleteVertexArray(this._vao), eo(this);
}, Sc.prototype.copyFace = function(e, t, r, n) {
	const i = new mc({
		context: e.context,
		colorTextures: [t],
		destroyAttachments: !1
	});
	i._bind(), this[r].copyMipmapFromFramebuffer(0, 0, t.width, t.height, n ?? 0), i._unBind(), i.destroy();
}, Sc.FaceName = Object.freeze({
	POSITIVEX: "positiveX",
	NEGATIVEX: "negativeX",
	POSITIVEY: "positiveY",
	NEGATIVEY: "negativeY",
	POSITIVEZ: "positiveZ",
	NEGATIVEZ: "negativeZ"
}), Sc.faceNames = function() {
	return function* () {
		yield Sc.FaceName.POSITIVEX, yield Sc.FaceName.NEGATIVEX, yield Sc.FaceName.POSITIVEY, yield Sc.FaceName.NEGATIVEY, yield Sc.FaceName.POSITIVEZ, yield Sc.FaceName.NEGATIVEZ;
	}();
}, Sc.loadFace = Ic, Object.defineProperties(Sc.prototype, {
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
			Cc(this, e), this._sampler = e;
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
}), Sc.getDirection = function(e, t) {
	switch (e) {
		case Sc.FaceName.POSITIVEX: return Y.clone(Y.UNIT_X, t);
		case Sc.FaceName.NEGATIVEX: return Y.negate(Y.UNIT_X, t);
		case Sc.FaceName.POSITIVEY: return Y.clone(Y.UNIT_Y, t);
		case Sc.FaceName.NEGATIVEY: return Y.negate(Y.UNIT_Y, t);
		case Sc.FaceName.POSITIVEZ: return Y.clone(Y.UNIT_Z, t);
		case Sc.FaceName.NEGATIVEZ: return Y.negate(Y.UNIT_Z, t);
	}
}, Sc.prototype.loadMipmaps = function(e, t) {
	if (P.defined("source", e), !Array.isArray(e)) throw new v("source must be an array");
	const r = Math.log2(this._size);
	if (e.length !== r) throw new v("all mip levels must be defined");
	t = t ?? !1;
	const n = this._context._gl, i = this._texture, o = this._textureTarget;
	n.activeTexture(n.TEXTURE0), n.bindTexture(o, i), t ? n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL, n.NONE) : n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL, n.BROWSER_DEFAULT_WEBGL);
	for (let a = 0; a < e.length; a++) {
		const t = e[a], r = a + 1;
		for (const e of Sc.faceNames()) Ic(this[e], t[e], r);
	}
	n.bindTexture(o, null), this._hasMipmap = !0;
}, Sc.prototype.generateMipmap = function(e) {
	if (e = e ?? dc.DONT_CARE, this._size > 1 && !B.isPowerOfTwo(this._size)) throw new v("width and height must be a power of two to call generateMipmap().");
	if (!dc.validate(e)) throw new v("hint is invalid.");
	this._hasMipmap = !0;
	const t = this._context._gl, r = this._textureTarget;
	t.hint(t.GENERATE_MIPMAP_HINT, e), t.activeTexture(t.TEXTURE0), t.bindTexture(r, this._texture), t.generateMipmap(r), t.bindTexture(r, null);
}, Sc.createVertexArray = function(e) {
	const t = ga.createGeometry(ga.fromDimensions({
		dimensions: new Y(2, 2, 2),
		vertexFormat: ya.POSITION_ONLY
	})), r = this._attributeLocations = Ys.createAttributeLocations(t);
	return Ac.fromGeometry({
		context: e,
		geometry: t,
		attributeLocations: r,
		bufferUsage: cc.STATIC_DRAW
	});
}, Sc.prototype.isDestroyed = function() {
	return !1;
}, Sc.prototype.destroy = function() {
	return this._context._gl.deleteTexture(this._texture), this._positiveX = eo(this._positiveX), this._negativeX = eo(this._negativeX), this._positiveY = eo(this._positiveY), this._negativeY = eo(this._negativeY), this._positiveZ = eo(this._positiveZ), this._negativeZ = eo(this._negativeZ), eo(this);
}, Nc.create = function(e) {
	return new Nc(e);
}, Nc.fromFramebuffer = function(e) {
	e = e ?? C.EMPTY_OBJECT, P.defined("options.context", e.context);
	const t = e.context, { pixelFormat: r = uc.RGB, framebufferXOffset: n = 0, framebufferYOffset: i = 0, width: o = t.drawingBufferWidth, height: a = t.drawingBufferHeight, framebuffer: s } = e;
	if (!uc.validate(r)) throw new v("Invalid pixelFormat.");
	if (uc.isDepthFormat(r) || uc.isCompressedFormat(r)) throw new v("pixelFormat cannot be DEPTH_COMPONENT, DEPTH_STENCIL or a compressed format.");
	if (P.defined("options.context", t), P.typeOf.number.greaterThanOrEquals("framebufferXOffset", n, 0), P.typeOf.number.greaterThanOrEquals("framebufferYOffset", i, 0), n + o > t.drawingBufferWidth) throw new v("framebufferXOffset + width must be less than or equal to drawingBufferWidth");
	if (i + a > t.drawingBufferHeight) throw new v("framebufferYOffset + height must be less than or equal to drawingBufferHeight.");
	return new Nc({
		context: t,
		width: o,
		height: a,
		pixelFormat: r,
		source: {
			framebuffer: N(s) ? s : t.defaultFramebuffer,
			xOffset: n,
			yOffset: i,
			width: o,
			height: a
		}
	});
}, Object.defineProperties(Nc.prototype, {
	id: { get: function() {
		return this._id;
	} },
	sampler: {
		get: function() {
			return this._sampler;
		},
		set: function(e) {
			Fc(this, e), this._sampler = e;
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
}), Nc.prototype.copyFrom = function(e) {
	P.defined("options", e);
	const { xOffset: t = 0, yOffset: r = 0, source: n, skipColorSpaceConversion: i = !1 } = e;
	if (P.defined("options.source", n), uc.isDepthFormat(this._pixelFormat)) throw new v("Cannot call copyFrom when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL.");
	if (uc.isCompressedFormat(this._pixelFormat)) throw new v("Cannot call copyFrom with a compressed texture pixel format.");
	P.typeOf.number.greaterThanOrEquals("xOffset", t, 0), P.typeOf.number.greaterThanOrEquals("yOffset", r, 0), P.typeOf.number.lessThanOrEquals("xOffset + options.source.width", t + n.width, this._width), P.typeOf.number.lessThanOrEquals("yOffset + options.source.height", r + n.height, this._height);
	const o = this._context._gl, a = this._textureTarget;
	o.activeTexture(o.TEXTURE0), o.bindTexture(a, this._texture);
	let { width: s, height: u } = n;
	N(n.videoWidth) && N(n.videoHeight) ? (s = n.videoWidth, u = n.videoHeight) : N(n.naturalWidth) && N(n.naturalHeight) && (s = n.naturalWidth, u = n.naturalHeight), i ? o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL, o.NONE) : o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL, o.BROWSER_DEFAULT_WEBGL);
	let c = !1;
	this._initialized || (0 === t && 0 === r && s === this._width && u === this._height ? (N(n.arrayBufferView) ? vc(this, n) : Pc(this, n), c = !0) : (o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL, !1), Lc(this)), this._initialized = !0), c || (N(n.arrayBufferView) ? function(e, t, r, n, i, o) {
		const a = e._context, s = a._gl, { pixelFormat: u, pixelDatatype: c } = e, l = uc.alignmentInBytes(u, c, i);
		s.pixelStorei(s.UNPACK_ALIGNMENT, l), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1), e.flipY && (t = uc.flipY(t, u, c, i, o)), s.texSubImage2D(e._textureTarget, 0, r, n, i, o, u, sc.toWebGLConstant(c, a), t);
	}(this, n.arrayBufferView, t, r, s, u) : function(e, t, r, n) {
		const i = e._context, o = i._gl;
		o.pixelStorei(o.UNPACK_ALIGNMENT, 4), o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.preMultiplyAlpha), o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL, e.flipY), o.texSubImage2D(e._textureTarget, 0, r, n, e.pixelFormat, sc.toWebGLConstant(e.pixelDatatype, i), t);
	}(this, n, t, r)), o.bindTexture(a, null);
}, Nc.prototype.copyFromFramebuffer = function(e, t, r, n, i, o) {
	if (e = e ?? 0, t = t ?? 0, r = r ?? 0, n = n ?? 0, i = i ?? this._width, o = o ?? this._height, uc.isDepthFormat(this._pixelFormat)) throw new v("Cannot call copyFromFramebuffer when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL.");
	if (this._pixelDatatype === sc.FLOAT) throw new v("Cannot call copyFromFramebuffer when the texture pixel data type is FLOAT.");
	if (this._pixelDatatype === sc.HALF_FLOAT) throw new v("Cannot call copyFromFramebuffer when the texture pixel data type is HALF_FLOAT.");
	if (uc.isCompressedFormat(this._pixelFormat)) throw new v("Cannot call copyFrom with a compressed texture pixel format.");
	P.typeOf.number.greaterThanOrEquals("xOffset", e, 0), P.typeOf.number.greaterThanOrEquals("yOffset", t, 0), P.typeOf.number.greaterThanOrEquals("framebufferXOffset", r, 0), P.typeOf.number.greaterThanOrEquals("framebufferYOffset", n, 0), P.typeOf.number.lessThanOrEquals("xOffset + width", e + i, this._width), P.typeOf.number.lessThanOrEquals("yOffset + height", t + o, this._height);
	const a = this._context._gl, s = this._textureTarget;
	a.activeTexture(a.TEXTURE0), a.bindTexture(s, this._texture), a.copyTexSubImage2D(s, 0, e, t, r, n, i, o), a.bindTexture(s, null), this._initialized = !0;
}, Nc.prototype.generateMipmap = function(e) {
	if (e = e ?? dc.DONT_CARE, uc.isDepthFormat(this._pixelFormat)) throw new v("Cannot call generateMipmap when the texture pixel format is DEPTH_COMPONENT or DEPTH_STENCIL.");
	if (uc.isCompressedFormat(this._pixelFormat)) throw new v("Cannot call generateMipmap with a compressed pixel format.");
	if (!this._context.webgl2) {
		if (this._width > 1 && !B.isPowerOfTwo(this._width)) throw new v("width must be a power of two to call generateMipmap() in a WebGL1 context.");
		if (this._height > 1 && !B.isPowerOfTwo(this._height)) throw new v("height must be a power of two to call generateMipmap() in a WebGL1 context.");
	}
	if (!dc.validate(e)) throw new v("hint is invalid.");
	this._hasMipmap = !0;
	const t = this._context._gl, r = this._textureTarget;
	t.hint(t.GENERATE_MIPMAP_HINT, e), t.activeTexture(t.TEXTURE0), t.bindTexture(r, this._texture), t.generateMipmap(r), t.bindTexture(r, null);
}, Nc.prototype.isDestroyed = function() {
	return !1;
}, Nc.prototype.destroy = function() {
	return this._context._gl.deleteTexture(this._texture), eo(this);
}, Dc._uniformList = {}, Dc.fromType = function(e, t) {
	if (!N(Dc._materialCache.getMaterial(e))) throw new v(`material with type '${e}' does not exist.`);
	const r = new Dc({ fabric: { type: e } });
	if (N(t)) for (const n in t) t.hasOwnProperty(n) && (r.uniforms[n] = t[n]);
	return r;
}, Dc.fromTypeAsync = async function(e, t) {
	if (!N(Dc._materialCache.getMaterial(e))) throw new v(`material with type '${e}' does not exist.`);
	const r = [], n = new Dc({ fabric: {
		type: e,
		uniforms: t
	} });
	if (zc(n, r), await Promise.all(r), r.length = 0, N(n._initializationError)) throw n._initializationError;
	return n;
}, Dc.prototype.isTranslucent = function() {
	if (N(this.translucent)) return "function" == typeof this.translucent ? this.translucent() : this.translucent;
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
		const s = new Ec({
			minificationFilter: this._minificationFilter,
			magnificationFilter: this._magnificationFilter
		});
		let u;
		u = N(a.internalFormat) ? new Nc({
			context: e,
			pixelFormat: a.internalFormat,
			width: a.width,
			height: a.height,
			source: {
				arrayBufferView: a.bufferView,
				mipLevels: o
			},
			sampler: s
		}) : new Nc({
			context: e,
			source: a,
			sampler: s
		});
		const c = this._textures[r];
		N(c) && c !== this._defaultTexture && c.destroy(), this._textures[r] = u;
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
		const i = n.images, a = new Sc({
			context: e,
			source: {
				positiveX: i[0],
				negativeX: i[1],
				positiveY: i[2],
				negativeY: i[3],
				positiveZ: i[4],
				negativeZ: i[5]
			},
			sampler: new Ec({
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
	return eo(this);
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
function Wc(e, t) {
	const r = t._template.materials;
	for (const n in r) if (r.hasOwnProperty(n) && e.indexOf(n) > -1) return !0;
	return !1;
}
const kc = {
	mat2: Xo,
	mat3: Er,
	mat4: Mr
}, Vc = /\.ktx2$/i;
function Hc(e, t) {
	const r = e.uniforms[t];
	if (r === Dc.DefaultImageId) return Promise.resolve();
	const n = Gt.createIfNeeded(r);
	if (!(n instanceof Gt)) return Promise.resolve();
	const i = Gt.createIfNeeded(e._texturePaths[t]);
	if (N(i) && i.url === n.url) return Promise.resolve();
	let o;
	return o = Vc.test(n.url) ? Ua(n.url) : n.fetchImage(), Promise.resolve(o).then(function(r) {
		e._loadedImages.push({
			id: t,
			image: r
		});
	}).catch(function(r) {
		e._initializationError = r;
		const n = e._textures[t];
		N(n) && n !== e._defaultTexture && n.destroy(), e._textures[t] = e._defaultTexture;
	}), e._texturePaths[t] = r, o;
}
function Yc(e, t) {
	const r = e.uniforms[t];
	if (r === Dc.DefaultCubeMapId) return Promise.resolve();
	const n = r.positiveX + r.negativeX + r.positiveY + r.negativeY + r.positiveZ + r.negativeZ;
	if (n === e._texturePaths[t]) return Promise.resolve();
	const i = [
		Gt.createIfNeeded(r.positiveX).fetchImage(),
		Gt.createIfNeeded(r.negativeX).fetchImage(),
		Gt.createIfNeeded(r.positiveY).fetchImage(),
		Gt.createIfNeeded(r.negativeY).fetchImage(),
		Gt.createIfNeeded(r.positiveZ).fetchImage(),
		Gt.createIfNeeded(r.negativeZ).fetchImage()
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
		if (!N(t)) {
			const r = typeof e;
			if ("number" === r) t = "float";
			else if ("boolean" === r) t = "bool";
			else if ("string" === r || e instanceof Gt || e instanceof HTMLCanvasElement || e instanceof HTMLImageElement || e instanceof ImageBitmap || e instanceof OffscreenCanvas) t = /^([rgba]){1,4}$/i.test(e) ? "channels" : e === Dc.DefaultCubeMapId ? "samplerCube" : "sampler2D";
			else if ("object" === r) if (Array.isArray(e)) 4 !== e.length && 9 !== e.length && 16 !== e.length || (t = `mat${Math.sqrt(e.length)}`);
			else {
				let r = 0;
				for (const t in e) e.hasOwnProperty(t) && (r += 1);
				r >= 2 && r <= 4 ? t = `vec${r}` : 6 === r && (t = "samplerCube");
			}
		}
		return t;
	}(i);
	if (!N(o)) throw new v(`fabric: uniform '${t}' has invalid type.`);
	let a;
	if ("channels" === o) {
		if (a = $c(e, t, i, !1), 0 === a && r) throw new v(`strict: shader source does not use channels '${t}'.`);
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
		if (a = $c(e, t, s), 1 === a && r) throw new v(`strict: shader source does not use uniform '${t}'.`);
		if (e.uniforms[t] = i, "sampler2D" === o) e._uniforms[s] = function() {
			return e._textures[t];
		}, e._updateFunctions.push(function(e) {
			let t;
			return function(r, n) {
				const i = r.uniforms, o = i[e], a = t !== o, s = !N(o) || o === Dc.DefaultImageId;
				t = o;
				let u, c, l = r._textures[e];
				if (o instanceof HTMLVideoElement) if (o.readyState >= 2) {
					if (a && N(l) && (l !== n.defaultTexture && l.destroy(), l = void 0), !N(l) || l === n.defaultTexture) return l = new Nc({
						context: n,
						source: o,
						sampler: new Ec({
							minificationFilter: r._minificationFilter,
							magnificationFilter: r._magnificationFilter
						})
					}), void (r._textures[e] = l);
					l.copyFrom({ source: o });
				} else N(l) || (r._textures[e] = n.defaultTexture);
				else {
					if (o instanceof Nc && o !== l) {
						r._texturePaths[e] = void 0;
						const t = r._textures[e];
						N(t) && t !== r._defaultTexture && t.destroy(), r._textures[e] = o, u = `${e}Dimensions`, i.hasOwnProperty(u) && (c = i[u], c.x = o._width, c.y = o._height);
						return;
					}
					if (a && N(l) && s && (l !== r._defaultTexture && l.destroy(), l = void 0, r._texturePaths[e] = void 0), N(l) || (l = r._textures[e] = r._defaultTexture, u = `${e}Dimensions`, i.hasOwnProperty(u) && (c = i[u], c.x = l._width, c.y = l._height)), !s) return (o instanceof HTMLCanvasElement || o instanceof HTMLImageElement || o instanceof ImageBitmap || o instanceof OffscreenCanvas) && o !== r._texturePaths[e] ? (r._loadedImages.push({
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
				if (n instanceof Sc) {
					const r = t._textures[e];
					r !== t._defaultTexture && r.destroy(), t._texturePaths[e] = void 0, t._textures[e] = n;
					return;
				}
				N(t._textures[e]) || (t._textures[e] = r.defaultCubeMap), Yc(t, e);
			};
		}(t)), e._initializationPromises.push(Yc(e, t));
		else if (-1 !== o.indexOf("mat")) {
			const r = new kc[o]();
			e._uniforms[s] = function() {
				return kc[o].fromColumnMajorArray(e.uniforms[t], r);
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
	const t = (e = e ?? C.EMPTY_OBJECT).translucent ?? !0, r = !1, n = Kc.VERTEX_FORMAT;
	this.material = N(e.material) ? e.material : Dc.fromType(Dc.ColorType), this.translucent = t, this._vertexShaderSource = e.vertexShaderSource ?? "#define CLIP_POLYLINE \nvoid clipLineSegmentToNearPlane(\n    vec3 p0,\n    vec3 p1,\n    out vec4 positionWC,\n    out bool clipped,\n    out bool culledByNearPlane,\n    out vec4 clippedPositionEC)\n{\n    culledByNearPlane = false;\n    clipped = false;\n\n    vec3 p0ToP1 = p1 - p0;\n    float magnitude = length(p0ToP1);\n    vec3 direction = normalize(p0ToP1);\n\n    // Distance that p0 is behind the near plane. Negative means p0 is\n    // in front of the near plane.\n    float endPoint0Distance =  czm_currentFrustum.x + p0.z;\n\n    // Camera looks down -Z.\n    // When moving a point along +Z: LESS VISIBLE\n    //   * Points in front of the camera move closer to the camera.\n    //   * Points behind the camrea move farther away from the camera.\n    // When moving a point along -Z: MORE VISIBLE\n    //   * Points in front of the camera move farther away from the camera.\n    //   * Points behind the camera move closer to the camera.\n\n    // Positive denominator: -Z, becoming more visible\n    // Negative denominator: +Z, becoming less visible\n    // Nearly zero: parallel to near plane\n    float denominator = -direction.z;\n\n    if (endPoint0Distance > 0.0 && abs(denominator) < czm_epsilon7)\n    {\n        // p0 is behind the near plane and the line to p1 is nearly parallel to\n        // the near plane, so cull the segment completely.\n        culledByNearPlane = true;\n    }\n    else if (endPoint0Distance > 0.0)\n    {\n        // p0 is behind the near plane, and the line to p1 is moving distinctly\n        // toward or away from it.\n\n        // t = (-plane distance - dot(plane normal, ray origin)) / dot(plane normal, ray direction)\n        float t = endPoint0Distance / denominator;\n        if (t < 0.0 || t > magnitude)\n        {\n            // Near plane intersection is not between the two points.\n            // We already confirmed p0 is behind the naer plane, so now\n            // we know the entire segment is behind it.\n            culledByNearPlane = true;\n        }\n        else\n        {\n            // Segment crosses the near plane, update p0 to lie exactly on it.\n            p0 = p0 + t * direction;\n\n            // Numerical noise might put us a bit on the wrong side of the near plane.\n            // Don't let that happen.\n            p0.z = min(p0.z, -czm_currentFrustum.x);\n\n            clipped = true;\n        }\n    }\n\n    clippedPositionEC = vec4(p0, 1.0);\n    positionWC = czm_eyeToWindowCoordinates(clippedPositionEC);\n}\n\nvec4 getPolylineWindowCoordinatesEC(vec4 positionEC, vec4 prevEC, vec4 nextEC, float expandDirection, float width, bool usePrevious, out float angle)\n{\n    // expandDirection +1 is to the _left_ when looking from positionEC toward nextEC.\n\n#ifdef POLYLINE_DASH\n    // Compute the window coordinates of the points.\n    vec4 positionWindow = czm_eyeToWindowCoordinates(positionEC);\n    vec4 previousWindow = czm_eyeToWindowCoordinates(prevEC);\n    vec4 nextWindow = czm_eyeToWindowCoordinates(nextEC);\n\n    // Determine the relative screen space direction of the line.\n    vec2 lineDir;\n    if (usePrevious) {\n        lineDir = normalize(positionWindow.xy - previousWindow.xy);\n    }\n    else {\n        lineDir = normalize(nextWindow.xy - positionWindow.xy);\n    }\n    angle = atan(lineDir.x, lineDir.y) - 1.570796327; // precomputed atan(1,0)\n\n    // Quantize the angle so it doesn't change rapidly between segments.\n    angle = floor(angle / czm_piOverFour + 0.5) * czm_piOverFour;\n#endif\n\n    vec4 clippedPrevWC, clippedPrevEC;\n    bool prevSegmentClipped, prevSegmentCulled;\n    clipLineSegmentToNearPlane(prevEC.xyz, positionEC.xyz, clippedPrevWC, prevSegmentClipped, prevSegmentCulled, clippedPrevEC);\n\n    vec4 clippedNextWC, clippedNextEC;\n    bool nextSegmentClipped, nextSegmentCulled;\n    clipLineSegmentToNearPlane(nextEC.xyz, positionEC.xyz, clippedNextWC, nextSegmentClipped, nextSegmentCulled, clippedNextEC);\n\n    bool segmentClipped, segmentCulled;\n    vec4 clippedPositionWC, clippedPositionEC;\n    clipLineSegmentToNearPlane(positionEC.xyz, usePrevious ? prevEC.xyz : nextEC.xyz, clippedPositionWC, segmentClipped, segmentCulled, clippedPositionEC);\n\n    if (segmentCulled)\n    {\n        return vec4(0.0, 0.0, 0.0, 1.0);\n    }\n\n    vec2 directionToPrevWC = normalize(clippedPrevWC.xy - clippedPositionWC.xy);\n    vec2 directionToNextWC = normalize(clippedNextWC.xy - clippedPositionWC.xy);\n\n    // If a segment was culled, we can't use the corresponding direction\n    // computed above. We should never see both of these be true without\n    // `segmentCulled` above also being true.\n    if (prevSegmentCulled)\n    {\n        directionToPrevWC = -directionToNextWC;\n    }\n    else if (nextSegmentCulled)\n    {\n        directionToNextWC = -directionToPrevWC;\n    }\n\n    vec2 thisSegmentForwardWC, otherSegmentForwardWC;\n    if (usePrevious)\n    {\n        thisSegmentForwardWC = -directionToPrevWC;\n        otherSegmentForwardWC = directionToNextWC;\n    }\n    else\n    {\n        thisSegmentForwardWC = directionToNextWC;\n        otherSegmentForwardWC =  -directionToPrevWC;\n    }\n\n    vec2 thisSegmentLeftWC = vec2(-thisSegmentForwardWC.y, thisSegmentForwardWC.x);\n\n    vec2 leftWC = thisSegmentLeftWC;\n    float expandWidth = width * 0.5;\n\n    // When lines are split at the anti-meridian, the position may be at the\n    // same location as the next or previous position, and we need to handle\n    // that to avoid producing NaNs.\n    if (!czm_equalsEpsilon(prevEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1) && !czm_equalsEpsilon(nextEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1))\n    {\n        vec2 otherSegmentLeftWC = vec2(-otherSegmentForwardWC.y, otherSegmentForwardWC.x);\n\n        vec2 leftSumWC = thisSegmentLeftWC + otherSegmentLeftWC;\n        float leftSumLength = length(leftSumWC);\n        leftWC = leftSumLength < czm_epsilon6 ? thisSegmentLeftWC : (leftSumWC / leftSumLength);\n\n        // The sine of the angle between the two vectors is given by the formula\n        //         |a x b| = |a||b|sin(theta)\n        // which is\n        //     float sinAngle = length(cross(vec3(leftWC, 0.0), vec3(-thisSegmentForwardWC, 0.0)));\n        // Because the z components of both vectors are zero, the x and y coordinate will be zero.\n        // Therefore, the sine of the angle is just the z component of the cross product.\n        vec2 u = -thisSegmentForwardWC;\n        vec2 v = leftWC;\n        float sinAngle = abs(u.x * v.y - u.y * v.x);\n        expandWidth = clamp(expandWidth / sinAngle, 0.0, width * 2.0);\n    }\n\n    vec2 offset = leftWC * expandDirection * expandWidth * czm_pixelRatio;\n    return vec4(clippedPositionWC.xy + offset, -clippedPositionWC.z, 1.0) * (czm_projection * clippedPositionEC).w;\n}\n\nvec4 getPolylineWindowCoordinates(vec4 position, vec4 previous, vec4 next, float expandDirection, float width, bool usePrevious, out float angle)\n{\n    vec4 positionEC = czm_modelViewRelativeToEye * position;\n    vec4 prevEC = czm_modelViewRelativeToEye * previous;\n    vec4 nextEC = czm_modelViewRelativeToEye * next;\n    return getPolylineWindowCoordinatesEC(positionEC, prevEC, nextEC, expandDirection, width, usePrevious, angle);\n}\n\nin vec3 position3DHigh;\nin vec3 position3DLow;\nin vec3 prevPosition3DHigh;\nin vec3 prevPosition3DLow;\nin vec3 nextPosition3DHigh;\nin vec3 nextPosition3DLow;\nin vec2 expandAndWidth;\nin vec2 st;\nin float batchId;\n\nout float v_width;\nout vec2 v_st;\nout float v_polylineAngle;\n\nvoid main()\n{\n    float expandDir = expandAndWidth.x;\n    float width = abs(expandAndWidth.y) + 0.5;\n    bool usePrev = expandAndWidth.y < 0.0;\n\n    vec4 p = czm_computePosition();\n    vec4 prev = czm_computePrevPosition();\n    vec4 next = czm_computeNextPosition();\n\n    float angle;\n    vec4 positionWC = getPolylineWindowCoordinates(p, prev, next, expandDir, width, usePrev, angle);\n    gl_Position = czm_viewportOrthographic * positionWC;\n\n    v_width = width;\n    v_st.s = st.s;\n    v_st.t = czm_writeNonPerspective(st.t, gl_Position.w);\n    v_polylineAngle = angle;\n}\n", this._fragmentShaderSource = e.fragmentShaderSource ?? "#ifdef VECTOR_TILE\nuniform vec4 u_highlightColor;\n#endif\n\nin vec2 v_st;\n\nvoid main()\n{\n    czm_materialInput materialInput;\n\n    vec2 st = v_st;\n    st.t = czm_readNonPerspective(st.t, gl_FragCoord.w);\n\n    materialInput.s = st.s;\n    materialInput.st = st;\n    materialInput.str = vec3(st, 0.0);\n\n    czm_material material = czm_getMaterial(materialInput);\n    out_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n#ifdef VECTOR_TILE\n    out_FragColor *= u_highlightColor;\n#endif\n\n    czm_writeLogDepth();\n}\n", this._renderState = Ia.getDefaultRenderState(t, r, e.renderState), this._closed = r, this._vertexFormat = n;
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
		uniforms: { color: new Vi(1, 0, 0, .5) },
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
			repeat: new q(1, 1),
			color: new Vi(1, 1, 1, 1)
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
			repeat: new q(1, 1)
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
			repeat: new q(1, 1)
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
			repeat: new q(1, 1)
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
			repeat: new q(1, 1)
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
			repeat: new q(1, 1)
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
			repeat: new q(1, 1)
		},
		source: "uniform sampler2D image;\nuniform float strength;\nuniform vec2 repeat;\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n    \n    vec4 textureValue = texture(image, fract(repeat * materialInput.st));\n    vec3 normalTangentSpace = textureValue.channels;\n    normalTangentSpace.xy = normalTangentSpace.xy * 2.0 - 1.0;\n    normalTangentSpace.z = clamp(1.0 - strength, 0.1, 1.0);\n    normalTangentSpace = normalize(normalTangentSpace);\n    vec3 normalEC = materialInput.tangentToEyeMatrix * normalTangentSpace;\n    \n    material.normal = normalEC;\n    \n    return material;\n}\n"
	},
	translucent: !1
}), Dc.GridType = "Grid", Dc._materialCache.addMaterial(Dc.GridType, {
	fabric: {
		type: Dc.GridType,
		uniforms: {
			color: new Vi(0, 1, 0, 1),
			cellAlpha: .1,
			lineCount: new q(8, 8),
			lineThickness: new q(1, 1),
			lineOffset: new q(0, 0)
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
			evenColor: new Vi(1, 1, 1, .5),
			oddColor: new Vi(0, 0, 1, .5),
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
			lightColor: new Vi(1, 1, 1, .5),
			darkColor: new Vi(0, 0, 0, .5),
			repeat: new q(5, 5)
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
			lightColor: new Vi(1, 1, 0, .75),
			darkColor: new Vi(0, 1, 1, .75),
			repeat: new q(5, 5)
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
			baseWaterColor: new Vi(.2, .3, .6, 1),
			blendColor: new Vi(0, 1, .699, 1),
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
			color: new Vi(1, 0, 0, .7),
			rimColor: new Vi(1, 1, 1, .4),
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
			fadeInColor: new Vi(1, 0, 0, 1),
			fadeOutColor: new Vi(0, 0, 0, 0),
			maximumDistance: .5,
			repeat: !0,
			fadeDirection: {
				x: !0,
				y: !0
			},
			time: new q(.5, .5)
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
		uniforms: { color: new Vi(1, 1, 1, 1) },
		source: "uniform vec4 color;\n\nfloat getPointOnLine(vec2 p0, vec2 p1, float x)\n{\n    float slope = (p0.y - p1.y) / (p0.x - p1.x);\n    return slope * (x - p0.x) + p0.y;\n}\n\nczm_material czm_getMaterial(czm_materialInput materialInput)\n{\n    czm_material material = czm_getDefaultMaterial(materialInput);\n\n    vec2 st = materialInput.st;\n\n#if (__VERSION__ == 300 || defined(GL_OES_standard_derivatives))\n    float base = 1.0 - abs(fwidth(st.s)) * 10.0 * czm_pixelRatio;\n#else\n     // If no derivatives available (IE 10?), 2.5% of the line will be the arrow head\n    float base = 0.975;\n#endif\n\n    vec2 center = vec2(1.0, 0.5);\n    float ptOnUpperLine = getPointOnLine(vec2(base, 1.0), center, st.s);\n    float ptOnLowerLine = getPointOnLine(vec2(base, 0.0), center, st.s);\n\n    float halfWidth = 0.15;\n    float s = step(0.5 - halfWidth, st.t);\n    s *= 1.0 - step(0.5 + halfWidth, st.t);\n    s *= 1.0 - step(base, st.s);\n\n    float t = step(base, materialInput.st.s);\n    t *= 1.0 - step(ptOnUpperLine, st.t);\n    t *= step(ptOnLowerLine, st.t);\n\n    // Find the distance from the closest separator (region between two colors)\n    float dist;\n    if (st.s < base)\n    {\n        float d1 = abs(st.t - (0.5 - halfWidth));\n        float d2 = abs(st.t - (0.5 + halfWidth));\n        dist = min(d1, d2);\n    }\n    else\n    {\n        float d1 = czm_infinity;\n        if (st.t < 0.5 - halfWidth && st.t > 0.5 + halfWidth)\n        {\n            d1 = abs(st.s - base);\n        }\n        float d2 = abs(st.t - ptOnUpperLine);\n        float d3 = abs(st.t - ptOnLowerLine);\n        dist = min(min(d1, d2), d3);\n    }\n\n    vec4 outsideColor = vec4(0.0);\n    vec4 currentColor = mix(outsideColor, color, clamp(s + t, 0.0, 1.0));\n    vec4 outColor = czm_antialias(outsideColor, color, currentColor, dist);\n\n    outColor = czm_gammaCorrect(outColor);\n    material.diffuse = outColor.rgb;\n    material.alpha = outColor.a;\n    return material;\n}\n"
	},
	translucent: !0
}), Dc.PolylineDashType = "PolylineDash", Dc._materialCache.addMaterial(Dc.PolylineDashType, {
	fabric: {
		type: Dc.PolylineDashType,
		uniforms: {
			color: new Vi(1, 0, 1, 1),
			gapColor: new Vi(0, 0, 0, 0),
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
			color: new Vi(0, .5, 1, 1),
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
			color: new Vi(1, 1, 1, 1),
			outlineColor: new Vi(1, 0, 0, 1),
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
			color: new Vi(1, 0, 0, 1),
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
			waterColor: new Vi(1, 1, 1, 1),
			landColor: new Vi(0, 0, 0, 0)
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
}), Kc.VERTEX_FORMAT = ya.POSITION_AND_ST, Kc.prototype.getFragmentShaderSource = Ia.prototype.getFragmentShaderSource, Kc.prototype.isTranslucent = Ia.prototype.isTranslucent, Kc.prototype.getRenderState = Ia.prototype.getRenderState;
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
			return this._buff = t - 64 < u ? new Uint8Array(s.buffer.slice(t - 64)) : /* @__PURE__ */ new Uint8Array(0), this;
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
			return this._buff = /* @__PURE__ */ new Uint8Array(0), this._length = 0, this._hash = [
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
				for (n = (e = t - 64 < c ? e.subarray(t - 64) : /* @__PURE__ */ new Uint8Array(0)).length, o = [
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
		if (e.fontColor && (t.fillColor = Vi.fromCssColorString(e.fontColor)), el(e.backgroundColor) && (t.showBackground = !0, t.backgroundColor = Vi.fromCssColorString(e.backgroundColor), t.backgroundPadding = new q(e.backgroundPadding, e.backgroundPadding)), e.outlineColor && (t.style = Zc.FILL_AND_OUTLINE, t.outlineColor = Vi.fromCssColorString(e.outlineColor).withAlpha(e.outlineAlpha ?? 1), t.outlineWidth = e.outlineWidth ?? 2), e.imgUrl) {
			t.image = e.imgUrl, t.width = e.imgWidth, t.height = e.imgHeight;
			t.pixelOffset = new q(0, tl(e.offset) ? e.offset : 0);
		} else "" === e.imgUrl && (t.image = void 0);
		return t;
	}
	static fromDefaultOption(e) {
		const t = {
			show: !0,
			style: Zc.FILL,
			pixelOffset: q.ZERO,
			eyeOffset: Y.ZERO,
			horizontalOrigin: no.CENTER,
			verticalOrigin: io.CENTER,
			heightReference: ro.CLAMP_TO_GROUND,
			distanceDisplayCondition: new to(0, 2e7),
			disableDepthTestDistance: 1e8
		};
		if (tl(e.scale) && (t.scale = e.scale), tl(e.minLevel) && (t.minLevel = e.minLevel), tl(e.maxLevel) && (t.maxLevel = e.maxLevel), rl(e.fontSize) || el(e.fontFamily)) {
			const r = e.fontSize ?? 10, n = e.fontFamily ?? "宋体";
			t.font = r + "px " + n;
		}
		if (e.fontColor && (t.fillColor = Vi.fromCssColorString(e.fontColor)), el(e.backgroundColor) && (t.showBackground = !0, t.backgroundColor = Vi.fromCssColorString(e.backgroundColor), t.backgroundPadding = new q(e.backgroundPadding, e.backgroundPadding)), e.outlineColor && (t.style = Zc.FILL_AND_OUTLINE, t.outlineColor = Vi.fromCssColorString(e.outlineColor).withAlpha(e.outlineAlpha ?? 1), t.outlineWidth = e.outlineWidth ?? 2), e.imgUrl) {
			t.image = e.imgUrl, t.width = e.imgWidth, t.height = e.imgHeight;
			t.pixelOffset = new q(0, tl(e.offset) ? e.offset : 0);
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
			fillColor: Vi.fromCssColorString(this.fontColor),
			style: Zc.FILL,
			scale: this.scale,
			pixelOffset: q.ZERO,
			eyeOffset: Y.ZERO,
			horizontalOrigin: no.CENTER,
			verticalOrigin: io.CENTER,
			heightReference: ro.CLAMP_TO_GROUND,
			distanceDisplayCondition: new to(0, 2e7),
			disableDepthTestDistance: 1e8
		};
		tl(this.weight) && (e.eyeOffset = new Y(0, 0, -100 * this.weight)), this.backgroundColor && (e.showBackground = !0, e.backgroundColor = Vi.fromCssColorString(this.backgroundColor), e.backgroundPadding = new q(this.backgroundPadding ?? 7, this.backgroundPadding ?? 5)), this.outlineColor && (e.style = Zc.FILL_AND_OUTLINE, e.outlineColor = Vi.fromCssColorString(this.outlineColor).withAlpha(this.outlineAlpha ?? 1), e.outlineWidth = this.outlineWidth ?? 2);
		let t = 0;
		return tl(this.offset) && (t = this.offset, e.pixelOffset = new q(0, t)), this.imgUrl && (e.image = this.imgUrl, e.width = this.imgWidth, e.height = this.imgHeight), e;
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
		let e = Dc.fromType(Dc.ColorType, { color: Vi.fromCssColorString(this.color).withAlpha(this.colorAlpha ?? 1) });
		if (this.gapColor && (e = Dc.fromType(Dc.PolylineDashType, {
			color: Vi.fromCssColorString(this.color).withAlpha(this.colorAlpha ?? 1),
			gapColor: Vi.fromCssColorString(this.gapColor),
			dashPattern: this.dashPattern,
			dashLength: this.dashLength ?? 20
		})), this.outlineColor && (e = Dc.fromType(Dc.PolylineOutlineType, {
			color: Vi.fromCssColorString(this.color).withAlpha(this.colorAlpha ?? 1),
			outlineColor: Vi.fromCssColorString(this.outlineColor),
			outlineWidth: this.outlineWidth
		})), this.glowPower && this.taperPower && (e = Dc.fromType(Dc.PolylineGlowType, {
			color: Vi.fromCssColorString(this.color).withAlpha(this.colorAlpha ?? 1),
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
		for (this.properties = Object.create(null), this.extent = r, this.type = 0, this.id = void 0, this._pbf = e, this._geometry = -1, this._keys = n, this._values = i; e.pos < t;) {
			const t = e.readVarint();
			if (8 === t) this.id = e.readVarint();
			else if (18 === t) {
				const t = e.readVarint() + e.pos;
				for (; e.pos < t;) {
					const t = n[e.readVarint()], r = i[e.readVarint()];
					this.properties[t] = r;
				}
			} else 24 === t ? this.type = e.readVarint() : 34 === t ? (this._geometry = e.pos, e.skip(t)) : e.skip(t);
		}
	}
	loadGeometry() {
		if (this._geometry < 0) throw new Error("feature has no geometry");
		const e = this._pbf;
		e.pos = this._geometry;
		const t = e.readVarint() + e.pos, r = [];
		let n, i = 1, o = 0, a = 0, s = 0;
		for (; e.pos < t;) {
			if (o <= 0) {
				const t = e.readVarint();
				if (i = 7 & t, o = t >> 3, 0 === o) continue;
			}
			if (o--, 1 === i) a += e.readSVarint(), s += e.readSVarint(), n && r.push(n), n = [new al(a, s)];
			else if (2 === i) a += e.readSVarint(), s += e.readSVarint(), n && n.push(new al(a, s));
			else {
				if (7 !== i) throw new Error(`unknown command ${i}`);
				n && n.push(n[0].clone());
			}
		}
		return n && r.push(n), r;
	}
	bbox() {
		if (this._geometry < 0) throw new Error("feature has no geometry");
		const e = this._pbf;
		e.pos = this._geometry;
		const t = e.readVarint() + e.pos;
		let r = 1, n = 0, i = 0, o = 0, a = Infinity, s = -Infinity, u = Infinity, c = -Infinity;
		for (; e.pos < t;) {
			if (n <= 0) {
				const t = e.readVarint();
				if (r = 7 & t, n = t >> 3, 0 === n) continue;
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
						const t = ul(e[o]);
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
function ul(e) {
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
var cl = class {
	constructor(e, t) {
		for (this.version = 1, this.name = "", this.extent = 4096, this.length = 0, this._pbf = e, this._keys = [], this._values = [], this._features = [], void 0 === t && (t = e.length); e.pos < t;) {
			const t = e.readVarint();
			10 === t ? this.name = e.readString() : 18 === t ? (this._features.push(e.pos), e.skip(t)) : 26 === t ? this._keys.push(e.readString()) : 34 === t ? this._values.push(ll(e)) : 40 === t ? this.extent = e.readVarint() : 120 === t ? this.version = e.readVarint() : e.skip(t);
		}
		this.length = this._features.length;
	}
	feature(e) {
		if (e < 0 || e >= this._features.length) throw new Error("feature index out of bounds");
		this._pbf.pos = this._features[e];
		const t = this._pbf.readVarint() + this._pbf.pos;
		return new sl(this._pbf, t, this.extent, this._keys, this._values);
	}
};
function ll(e) {
	let t = null;
	const r = e.readVarint() + e.pos;
	for (; e.pos < r;) {
		const r = e.readVarint();
		t = 10 === r ? e.readString() : 21 === r ? e.readFloat() : 25 === r ? e.readDouble() : 32 === r ? e.readVarint(!0) : 40 === r ? e.readVarint() : 48 === r ? e.readSVarint() : 56 === r ? e.readBoolean() : (e.skip(r), null);
	}
	if (null == t) throw new Error("unknown feature value");
	return t;
}
var fl = class {
	constructor(e, t = e.length) {
		const r = Object.create(null);
		for (; e.pos < t;) {
			const t = e.readVarint();
			if (26 === t) {
				const t = new cl(e, e.readVarint() + e.pos);
				t.length && (r[t.name] = t);
			} else e.skip(t);
		}
		this.layers = r;
	}
};
const hl = 4294967296, pl = "undefined" == typeof TextDecoder ? null : new TextDecoder("utf-8");
var ml = class {
	constructor(e) {
		this.buf = ArrayBuffer.isView(e) ? e : new Uint8Array(e), this.dataView = new DataView(this.buf.buffer, this.buf.byteOffset, this.buf.byteLength), this.pos = 0, this.type = 0, this._valueStart = -1, this.length = this.buf.length;
	}
	readFields(e, t, r = this.length) {
		let n;
		for (; n = this.nextField(r);) e(n, t, this);
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
		const e = this.dataView.getUint32(this.pos, !0) + this.dataView.getUint32(this.pos + 4, !0) * hl;
		return this.pos += 8, e;
	}
	readSFixed64() {
		const e = this.dataView.getUint32(this.pos, !0) + this.dataView.getInt32(this.pos + 4, !0) * hl;
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
		const t = this.buf, r = t[this.pos++];
		if (r < 128) return r;
		let n, i = 127 & r;
		return n = t[this.pos++], i |= (127 & n) << 7, n < 128 ? i : (n = t[this.pos++], i |= (127 & n) << 14, n < 128 ? i : (n = t[this.pos++], i |= (127 & n) << 21, n < 128 ? i : (n = t[this.pos], i |= (15 & n) << 28, function(e, t, r) {
			const n = r.buf;
			let i, o;
			if (o = n[r.pos++], i = (112 & o) >> 4, o < 128) return dl(e, i, t);
			if (o = n[r.pos++], i |= (127 & o) << 3, o < 128) return dl(e, i, t);
			if (o = n[r.pos++], i |= (127 & o) << 10, o < 128) return dl(e, i, t);
			if (o = n[r.pos++], i |= (127 & o) << 17, o < 128) return dl(e, i, t);
			if (o = n[r.pos++], i |= (127 & o) << 24, o < 128) return dl(e, i, t);
			if (o = n[r.pos++], i |= (1 & o) << 31, o < 128) return dl(e, i, t);
			throw new Error("Expected varint not more than 10 bytes");
		}(i, e, this))));
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
		return this.pos = e, e - t >= 12 && pl ? pl.decode(this.buf.subarray(t, e)) : function(e, t, r) {
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
	nextField(e = this.length) {
		if (this.pos === this._valueStart && this.skip(this.type), this.pos >= e) return 0;
		const t = this.readVarint();
		return this.type = 7 & t, this._valueStart = this.pos, t >>> 3;
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
};
function dl(e, t, r) {
	return r ? 4294967296 * t + (e >>> 0) : 4294967296 * (t >>> 0) + (e >>> 0);
}
async function yl(e) {
	return await fetch(e).catch((t) => {
		console.warn("请求元数据失败", e);
	}).then((e) => {
		if (e) return e.json();
	});
}
function _l(e, t, r, n) {
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
			u.rectangle = Di.fromDegrees(e[0], e[1], e[2], e[3]);
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
function gl(e, t, r, n) {
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
			s.rectangle = Di.fromDegrees(e[0], e[1], e[2], e[3]);
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
function El(e, t, r, n) {
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
async function bl(e) {
	const t = await Gt.fetchArrayBuffer({ url: e })?.catch(() => {
		console.log("解析瓦片错误", e);
	});
	if (t) return new fl(new ml(t));
}
function Tl(e, t, r, n) {
	return Ol(t, r, n, nl({}, e));
}
function Ol(e, t, r, n) {
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
		i = Ol(e, r.filterField ?? t, r, i);
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
	buildTileURLParams: () => El,
	createFromMetadata: () => _l,
	createFromTilejson: () => gl,
	doParseTile: () => bl,
	getFeatureLabelOption: () => Tl,
	loadVTileJson: () => yl
}));
