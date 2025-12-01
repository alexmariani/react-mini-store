import te, { useEffect as re } from "react";
var Q = Symbol.for("immer-nothing"), B = Symbol.for("immer-draftable"), a = Symbol.for("immer-state"), ne = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(e) {
    return `The plugin for '${e}' has not been loaded into Immer. To enable the plugin, import and call \`enable${e}()\` when initializing your application.`;
  },
  function(e) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${e}'`;
  },
  "This object has been frozen and should not be mutated",
  function(e) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + e;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(e) {
    return `'current' expects a draft, got: ${e}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(e) {
    return `'original' expects a draft, got: ${e}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function u(e, ...t) {
  if (process.env.NODE_ENV !== "production") {
    const r = ne[e], n = typeof r == "function" ? r.apply(null, t) : r;
    throw new Error(`[Immer] ${n}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var S = Object.getPrototypeOf;
function w(e) {
  return !!e && !!e[a];
}
function p(e) {
  return e ? Y(e) || Array.isArray(e) || !!e[B] || !!e.constructor?.[B] || O(e) || N(e) : !1;
}
var oe = Object.prototype.constructor.toString(), G = /* @__PURE__ */ new WeakMap();
function Y(e) {
  if (!e || typeof e != "object")
    return !1;
  const t = Object.getPrototypeOf(e);
  if (t === null || t === Object.prototype)
    return !0;
  const r = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  if (r === Object)
    return !0;
  if (typeof r != "function")
    return !1;
  let n = G.get(r);
  return n === void 0 && (n = Function.toString.call(r), G.set(r, n)), n === oe;
}
function E(e, t, r = !0) {
  F(e) === 0 ? (r ? Reflect.ownKeys(e) : Object.keys(e)).forEach((o) => {
    t(o, e[o], e);
  }) : e.forEach((n, o) => t(o, n, e));
}
function F(e) {
  const t = e[a];
  return t ? t.type_ : Array.isArray(e) ? 1 : O(e) ? 2 : N(e) ? 3 : 0;
}
function x(e, t) {
  return F(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function Z(e, t, r) {
  const n = F(e);
  n === 2 ? e.set(t, r) : n === 3 ? e.add(r) : e[t] = r;
}
function ie(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function O(e) {
  return e instanceof Map;
}
function N(e) {
  return e instanceof Set;
}
function y(e) {
  return e.copy_ || e.base_;
}
function T(e, t) {
  if (O(e))
    return new Map(e);
  if (N(e))
    return new Set(e);
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  const r = Y(e);
  if (t === !0 || t === "class_only" && !r) {
    const n = Object.getOwnPropertyDescriptors(e);
    delete n[a];
    let o = Reflect.ownKeys(n);
    for (let i = 0; i < o.length; i++) {
      const s = o[i], c = n[s];
      c.writable === !1 && (c.writable = !0, c.configurable = !0), (c.get || c.set) && (n[s] = {
        configurable: !0,
        writable: !0,
        // could live with !!desc.set as well here...
        enumerable: c.enumerable,
        value: e[s]
      });
    }
    return Object.create(S(e), n);
  } else {
    const n = S(e);
    if (n !== null && r)
      return { ...e };
    const o = Object.create(n);
    return Object.assign(o, e);
  }
}
function W(e, t = !1) {
  return A(e) || w(e) || !p(e) || (F(e) > 1 && Object.defineProperties(e, {
    set: v,
    add: v,
    clear: v,
    delete: v
  }), Object.freeze(e), t && Object.values(e).forEach((r) => W(r, !0))), e;
}
function se() {
  u(2);
}
var v = {
  value: se
};
function A(e) {
  return e === null || typeof e != "object" ? !0 : Object.isFrozen(e);
}
var ce = {};
function m(e) {
  const t = ce[e];
  return t || u(0, e), t;
}
var g;
function L() {
  return g;
}
function ue(e, t) {
  return {
    drafts_: [],
    parent_: e,
    immer_: t,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: !0,
    unfinalizedDrafts_: 0
  };
}
function H(e, t) {
  t && (m("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function j(e) {
  R(e), e.drafts_.forEach(fe), e.drafts_ = null;
}
function R(e) {
  e === g && (g = e.parent_);
}
function X(e) {
  return g = ue(g, e);
}
function fe(e) {
  const t = e[a];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function q(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const r = t.drafts_[0];
  return e !== void 0 && e !== r ? (r[a].modified_ && (j(t), u(4)), p(e) && (e = D(t, e), t.parent_ || I(t, e)), t.patches_ && m("Patches").generateReplacementPatches_(
    r[a].base_,
    e,
    t.patches_,
    t.inversePatches_
  )) : e = D(t, r, []), j(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== Q ? e : void 0;
}
function D(e, t, r) {
  if (A(t))
    return t;
  const n = e.immer_.shouldUseStrictIteration(), o = t[a];
  if (!o)
    return E(
      t,
      (i, s) => J(e, o, t, i, s, r),
      n
    ), t;
  if (o.scope_ !== e)
    return t;
  if (!o.modified_)
    return I(e, o.base_, !0), o.base_;
  if (!o.finalized_) {
    o.finalized_ = !0, o.scope_.unfinalizedDrafts_--;
    const i = o.copy_;
    let s = i, c = !1;
    o.type_ === 3 && (s = new Set(i), i.clear(), c = !0), E(
      s,
      (l, d) => J(
        e,
        o,
        i,
        l,
        d,
        r,
        c
      ),
      n
    ), I(e, i, !1), r && e.patches_ && m("Patches").generatePatches_(
      o,
      r,
      e.patches_,
      e.inversePatches_
    );
  }
  return o.copy_;
}
function J(e, t, r, n, o, i, s) {
  if (o == null || typeof o != "object" && !s)
    return;
  const c = A(o);
  if (!(c && !s)) {
    if (process.env.NODE_ENV !== "production" && o === r && u(5), w(o)) {
      const l = i && t && t.type_ !== 3 && // Set objects are atomic since they have no keys.
      !x(t.assigned_, n) ? i.concat(n) : void 0, d = D(e, o, l);
      if (Z(r, n, d), w(d))
        e.canAutoFreeze_ = !1;
      else
        return;
    } else s && r.add(o);
    if (p(o) && !c) {
      if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1 || t && t.base_ && t.base_[n] === o && c)
        return;
      D(e, o), (!t || !t.scope_.parent_) && typeof n != "symbol" && (O(r) ? r.has(n) : Object.prototype.propertyIsEnumerable.call(r, n)) && I(e, o);
    }
  }
}
function I(e, t, r = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && W(t, r);
}
function ae(e, t) {
  const r = Array.isArray(e), n = {
    type_: r ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : L(),
    // True for both shallow and deep changes.
    modified_: !1,
    // Used during finalization.
    finalized_: !1,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: t,
    // The base state.
    base_: e,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: !1
  };
  let o = n, i = K;
  r && (o = [n], i = b);
  const { revoke: s, proxy: c } = Proxy.revocable(o, i);
  return n.draft_ = c, n.revoke_ = s, c;
}
var K = {
  get(e, t) {
    if (t === a)
      return e;
    const r = y(e);
    if (!x(r, t))
      return le(e, r, t);
    const n = r[t];
    return e.finalized_ || !p(n) ? n : n === k(e.base_, t) ? (C(e), e.copy_[t] = U(n, e)) : n;
  },
  has(e, t) {
    return t in y(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(y(e));
  },
  set(e, t, r) {
    const n = V(y(e), t);
    if (n?.set)
      return n.set.call(e.draft_, r), !0;
    if (!e.modified_) {
      const o = k(y(e), t), i = o?.[a];
      if (i && i.base_ === r)
        return e.copy_[t] = r, e.assigned_[t] = !1, !0;
      if (ie(r, o) && (r !== void 0 || x(e.base_, t)))
        return !0;
      C(e), $(e);
    }
    return e.copy_[t] === r && // special case: handle new props with value 'undefined'
    (r !== void 0 || t in e.copy_) || // special case: NaN
    Number.isNaN(r) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = r, e.assigned_[t] = !0), !0;
  },
  deleteProperty(e, t) {
    return k(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, C(e), $(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const r = y(e), n = Reflect.getOwnPropertyDescriptor(r, t);
    return n && {
      writable: !0,
      configurable: e.type_ !== 1 || t !== "length",
      enumerable: n.enumerable,
      value: r[t]
    };
  },
  defineProperty() {
    u(11);
  },
  getPrototypeOf(e) {
    return S(e.base_);
  },
  setPrototypeOf() {
    u(12);
  }
}, b = {};
E(K, (e, t) => {
  b[e] = function() {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
});
b.deleteProperty = function(e, t) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && u(13), b.set.call(this, e, t, void 0);
};
b.set = function(e, t, r) {
  return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && u(14), K.set.call(this, e[0], t, r, e[0]);
};
function k(e, t) {
  const r = e[a];
  return (r ? y(r) : e)[t];
}
function le(e, t, r) {
  const n = V(t, r);
  return n ? "value" in n ? n.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    n.get?.call(e.draft_)
  ) : void 0;
}
function V(e, t) {
  if (!(t in e))
    return;
  let r = S(e);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, t);
    if (n)
      return n;
    r = S(r);
  }
}
function $(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && $(e.parent_));
}
function C(e) {
  e.copy_ || (e.copy_ = T(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var de = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !0, this.produce = (t, r, n) => {
      if (typeof t == "function" && typeof r != "function") {
        const i = r;
        r = t;
        const s = this;
        return function(l = i, ...d) {
          return s.produce(l, (_) => r.call(this, _, ...d));
        };
      }
      typeof r != "function" && u(6), n !== void 0 && typeof n != "function" && u(7);
      let o;
      if (p(t)) {
        const i = X(this), s = U(t, void 0);
        let c = !0;
        try {
          o = r(s), c = !1;
        } finally {
          c ? j(i) : R(i);
        }
        return H(i, n), q(o, i);
      } else if (!t || typeof t != "object") {
        if (o = r(t), o === void 0 && (o = t), o === Q && (o = void 0), this.autoFreeze_ && W(o, !0), n) {
          const i = [], s = [];
          m("Patches").generateReplacementPatches_(t, o, i, s), n(i, s);
        }
        return o;
      } else
        u(1, t);
    }, this.produceWithPatches = (t, r) => {
      if (typeof t == "function")
        return (s, ...c) => this.produceWithPatches(s, (l) => t(l, ...c));
      let n, o;
      return [this.produce(t, r, (s, c) => {
        n = s, o = c;
      }), n, o];
    }, typeof e?.autoFreeze == "boolean" && this.setAutoFreeze(e.autoFreeze), typeof e?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(e.useStrictShallowCopy), typeof e?.useStrictIteration == "boolean" && this.setUseStrictIteration(e.useStrictIteration);
  }
  createDraft(e) {
    p(e) || u(8), w(e) && (e = _e(e));
    const t = X(this), r = U(e, void 0);
    return r[a].isManual_ = !0, R(t), r;
  }
  finishDraft(e, t) {
    const r = e && e[a];
    (!r || !r.isManual_) && u(9);
    const { scope_: n } = r;
    return H(n, t), q(void 0, n);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(e) {
    this.autoFreeze_ = e;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(e) {
    this.useStrictShallowCopy_ = e;
  }
  /**
   * Pass false to use faster iteration that skips non-enumerable properties
   * but still handles symbols for compatibility.
   *
   * By default, strict iteration is enabled (includes all own properties).
   */
  setUseStrictIteration(e) {
    this.useStrictIteration_ = e;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(e, t) {
    let r;
    for (r = t.length - 1; r >= 0; r--) {
      const o = t[r];
      if (o.path.length === 0 && o.op === "replace") {
        e = o.value;
        break;
      }
    }
    r > -1 && (t = t.slice(r + 1));
    const n = m("Patches").applyPatches_;
    return w(e) ? n(e, t) : this.produce(
      e,
      (o) => n(o, t)
    );
  }
};
function U(e, t) {
  const r = O(e) ? m("MapSet").proxyMap_(e, t) : N(e) ? m("MapSet").proxySet_(e, t) : ae(e, t);
  return (t ? t.scope_ : L()).drafts_.push(r), r;
}
function _e(e) {
  return w(e) || u(10, e), ee(e);
}
function ee(e) {
  if (!p(e) || A(e))
    return e;
  const t = e[a];
  let r, n = !0;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, r = T(e, t.scope_.immer_.useStrictShallowCopy_), n = t.scope_.immer_.shouldUseStrictIteration();
  } else
    r = T(e, !0);
  return E(
    r,
    (o, i) => {
      Z(r, o, ee(i));
    },
    n
  ), t && (t.finalized_ = !1), r;
}
var ye = new de(), pe = ye.produce;
const M = /* @__PURE__ */ new WeakMap();
function we(e) {
  let t = e.state;
  const r = /* @__PURE__ */ new Set(), n = () => t, o = (f) => {
    if (!e.computed) return {};
    if (M.has(f)) return M.get(f);
    const h = {};
    for (const z in e.computed)
      h[z] = e.computed[z](f);
    return M.set(f, h), h;
  }, i = (f) => {
    const h = pe(t, f);
    h !== t && (t = h, _.computed = o(t), r.forEach((z) => z()));
  }, s = () => {
    t = e.state, _.computed = o(t), r.forEach((f) => f());
  }, c = (f) => (r.add(f), () => r.delete(f)), l = e.actions ? e.actions(i, n) : {}, d = o(t);
  let _ = { getState: n, setState: i, resetState: s, subscribe: c, actions: l, computed: d };
  if (e.middleware)
    for (const f of e.middleware)
      _ = f(_);
  return _;
}
function Pe(e = "store") {
  return (t) => {
    const r = t.setState;
    return t.setState = (n) => {
      console.groupCollapsed(`[${e}]`), console.log("prev:", t.getState()), r(n), console.log("next:", t.getState()), console.groupEnd();
    }, t;
  };
}
const P = [];
function me(e, t) {
  const r = /* @__PURE__ */ new Map();
  return r.set(e, t), P.push(r), () => {
    const n = P.indexOf(r);
    n >= 0 && P.splice(n, 1);
  };
}
function Se(e) {
  for (let t = P.length - 1; t >= 0; t--) {
    const r = P[t];
    if (r.has(e))
      return r.get(e);
  }
  throw new Error(`No store provided for token ${e.toString()} in component tree`);
}
const ge = () => Symbol();
function be(e, t, r) {
  const n = (o) => (re(() => me(t, r), []), /* @__PURE__ */ te.createElement(e, { ...o }));
  return n.displayName = `withStoreProvider(${e.displayName || e.name || "Component"})`, n;
}
export {
  we as createStore,
  ge as createStoreToken,
  Pe as loggerMiddleware,
  me as provideStore,
  Se as useStore,
  be as withStoreProvider
};
