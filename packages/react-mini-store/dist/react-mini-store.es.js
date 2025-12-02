import ie, { createContext as se, useContext as Y, useRef as x, useCallback as ce, useSyncExternalStore as ae, useDebugValue as ue } from "react";
var Z = Symbol.for("immer-nothing"), Q = Symbol.for("immer-draftable"), d = Symbol.for("immer-state"), fe = process.env.NODE_ENV !== "production" ? [
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
function f(e, ...t) {
  if (process.env.NODE_ENV !== "production") {
    const r = fe[e], o = typeof r == "function" ? r.apply(null, t) : r;
    throw new Error(`[Immer] ${o}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var w = Object.getPrototypeOf;
function m(e) {
  return !!e && !!e[d];
}
function h(e) {
  return e ? L(e) || Array.isArray(e) || !!e[Q] || !!e.constructor?.[Q] || b(e) || k(e) : !1;
}
var le = Object.prototype.constructor.toString(), X = /* @__PURE__ */ new WeakMap();
function L(e) {
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
  let o = X.get(r);
  return o === void 0 && (o = Function.toString.call(r), X.set(r, o)), o === le;
}
function E(e, t, r = !0) {
  D(e) === 0 ? (r ? Reflect.ownKeys(e) : Object.keys(e)).forEach((n) => {
    t(n, e[n], e);
  }) : e.forEach((o, n) => t(n, o, e));
}
function D(e) {
  const t = e[d];
  return t ? t.type_ : Array.isArray(e) ? 1 : b(e) ? 2 : k(e) ? 3 : 0;
}
function M(e, t) {
  return D(e) === 2 ? e.has(t) : Object.prototype.hasOwnProperty.call(e, t);
}
function B(e, t, r) {
  const o = D(e);
  o === 2 ? e.set(t, r) : o === 3 ? e.add(r) : e[t] = r;
}
function de(e, t) {
  return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
function b(e) {
  return e instanceof Map;
}
function k(e) {
  return e instanceof Set;
}
function S(e) {
  return e.copy_ || e.base_;
}
function A(e, t) {
  if (b(e))
    return new Map(e);
  if (k(e))
    return new Set(e);
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  const r = L(e);
  if (t === !0 || t === "class_only" && !r) {
    const o = Object.getOwnPropertyDescriptors(e);
    delete o[d];
    let n = Reflect.ownKeys(o);
    for (let i = 0; i < n.length; i++) {
      const s = n[i], c = o[s];
      c.writable === !1 && (c.writable = !0, c.configurable = !0), (c.get || c.set) && (o[s] = {
        configurable: !0,
        writable: !0,
        // could live with !!desc.set as well here...
        enumerable: c.enumerable,
        value: e[s]
      });
    }
    return Object.create(w(e), o);
  } else {
    const o = w(e);
    if (o !== null && r)
      return { ...e };
    const n = Object.create(o);
    return Object.assign(n, e);
  }
}
function W(e, t = !1) {
  return C(e) || m(e) || !h(e) || (D(e) > 1 && Object.defineProperties(e, {
    set: v,
    add: v,
    clear: v,
    delete: v
  }), Object.freeze(e), t && Object.values(e).forEach((r) => W(r, !0))), e;
}
function ye() {
  f(2);
}
var v = {
  value: ye
};
function C(e) {
  return e === null || typeof e != "object" ? !0 : Object.isFrozen(e);
}
var _e = {};
function p(e) {
  const t = _e[e];
  return t || f(0, e), t;
}
var P;
function ee() {
  return P;
}
function Se(e, t) {
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
function G(e, t) {
  t && (p("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t);
}
function T(e) {
  R(e), e.drafts_.forEach(he), e.drafts_ = null;
}
function R(e) {
  e === P && (P = e.parent_);
}
function J(e) {
  return P = Se(P, e);
}
function he(e) {
  const t = e[d];
  t.type_ === 0 || t.type_ === 1 ? t.revoke_() : t.revoked_ = !0;
}
function H(e, t) {
  t.unfinalizedDrafts_ = t.drafts_.length;
  const r = t.drafts_[0];
  return e !== void 0 && e !== r ? (r[d].modified_ && (T(t), f(4)), h(e) && (e = z(t, e), t.parent_ || I(t, e)), t.patches_ && p("Patches").generateReplacementPatches_(
    r[d].base_,
    e,
    t.patches_,
    t.inversePatches_
  )) : e = z(t, r, []), T(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== Z ? e : void 0;
}
function z(e, t, r) {
  if (C(t))
    return t;
  const o = e.immer_.shouldUseStrictIteration(), n = t[d];
  if (!n)
    return E(
      t,
      (i, s) => V(e, n, t, i, s, r),
      o
    ), t;
  if (n.scope_ !== e)
    return t;
  if (!n.modified_)
    return I(e, n.base_, !0), n.base_;
  if (!n.finalized_) {
    n.finalized_ = !0, n.scope_.unfinalizedDrafts_--;
    const i = n.copy_;
    let s = i, c = !1;
    n.type_ === 3 && (s = new Set(i), i.clear(), c = !0), E(
      s,
      (a, u) => V(
        e,
        n,
        i,
        a,
        u,
        r,
        c
      ),
      o
    ), I(e, i, !1), r && e.patches_ && p("Patches").generatePatches_(
      n,
      r,
      e.patches_,
      e.inversePatches_
    );
  }
  return n.copy_;
}
function V(e, t, r, o, n, i, s) {
  if (n == null || typeof n != "object" && !s)
    return;
  const c = C(n);
  if (!(c && !s)) {
    if (process.env.NODE_ENV !== "production" && n === r && f(5), m(n)) {
      const a = i && t && t.type_ !== 3 && // Set objects are atomic since they have no keys.
      !M(t.assigned_, o) ? i.concat(o) : void 0, u = z(e, n, a);
      if (B(r, o, u), m(u))
        e.canAutoFreeze_ = !1;
      else
        return;
    } else s && r.add(n);
    if (h(n) && !c) {
      if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1 || t && t.base_ && t.base_[o] === n && c)
        return;
      z(e, n), (!t || !t.scope_.parent_) && typeof o != "symbol" && (b(r) ? r.has(o) : Object.prototype.propertyIsEnumerable.call(r, o)) && I(e, n);
    }
  }
}
function I(e, t, r = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && W(t, r);
}
function pe(e, t) {
  const r = Array.isArray(e), o = {
    type_: r ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: t ? t.scope_ : ee(),
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
  let n = o, i = K;
  r && (n = [o], i = O);
  const { revoke: s, proxy: c } = Proxy.revocable(n, i);
  return o.draft_ = c, o.revoke_ = s, c;
}
var K = {
  get(e, t) {
    if (t === d)
      return e;
    const r = S(e);
    if (!M(r, t))
      return me(e, r, t);
    const o = r[t];
    return e.finalized_ || !h(o) ? o : o === F(e.base_, t) ? (N(e), e.copy_[t] = j(o, e)) : o;
  },
  has(e, t) {
    return t in S(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(S(e));
  },
  set(e, t, r) {
    const o = te(S(e), t);
    if (o?.set)
      return o.set.call(e.draft_, r), !0;
    if (!e.modified_) {
      const n = F(S(e), t), i = n?.[d];
      if (i && i.base_ === r)
        return e.copy_[t] = r, e.assigned_[t] = !1, !0;
      if (de(r, n) && (r !== void 0 || M(e.base_, t)))
        return !0;
      N(e), $(e);
    }
    return e.copy_[t] === r && // special case: handle new props with value 'undefined'
    (r !== void 0 || t in e.copy_) || // special case: NaN
    Number.isNaN(r) && Number.isNaN(e.copy_[t]) || (e.copy_[t] = r, e.assigned_[t] = !0), !0;
  },
  deleteProperty(e, t) {
    return F(e.base_, t) !== void 0 || t in e.base_ ? (e.assigned_[t] = !1, N(e), $(e)) : delete e.assigned_[t], e.copy_ && delete e.copy_[t], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, t) {
    const r = S(e), o = Reflect.getOwnPropertyDescriptor(r, t);
    return o && {
      writable: !0,
      configurable: e.type_ !== 1 || t !== "length",
      enumerable: o.enumerable,
      value: r[t]
    };
  },
  defineProperty() {
    f(11);
  },
  getPrototypeOf(e) {
    return w(e.base_);
  },
  setPrototypeOf() {
    f(12);
  }
}, O = {};
E(K, (e, t) => {
  O[e] = function() {
    return arguments[0] = arguments[0][0], t.apply(this, arguments);
  };
});
O.deleteProperty = function(e, t) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(t)) && f(13), O.set.call(this, e, t, void 0);
};
O.set = function(e, t, r) {
  return process.env.NODE_ENV !== "production" && t !== "length" && isNaN(parseInt(t)) && f(14), K.set.call(this, e[0], t, r, e[0]);
};
function F(e, t) {
  const r = e[d];
  return (r ? S(r) : e)[t];
}
function me(e, t, r) {
  const o = te(t, r);
  return o ? "value" in o ? o.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    o.get?.call(e.draft_)
  ) : void 0;
}
function te(e, t) {
  if (!(t in e))
    return;
  let r = w(e);
  for (; r; ) {
    const o = Object.getOwnPropertyDescriptor(r, t);
    if (o)
      return o;
    r = w(r);
  }
}
function $(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && $(e.parent_));
}
function N(e) {
  e.copy_ || (e.copy_ = A(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var ge = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !0, this.produce = (t, r, o) => {
      if (typeof t == "function" && typeof r != "function") {
        const i = r;
        r = t;
        const s = this;
        return function(a = i, ...u) {
          return s.produce(a, (_) => r.call(this, _, ...u));
        };
      }
      typeof r != "function" && f(6), o !== void 0 && typeof o != "function" && f(7);
      let n;
      if (h(t)) {
        const i = J(this), s = j(t, void 0);
        let c = !0;
        try {
          n = r(s), c = !1;
        } finally {
          c ? T(i) : R(i);
        }
        return G(i, o), H(n, i);
      } else if (!t || typeof t != "object") {
        if (n = r(t), n === void 0 && (n = t), n === Z && (n = void 0), this.autoFreeze_ && W(n, !0), o) {
          const i = [], s = [];
          p("Patches").generateReplacementPatches_(t, n, i, s), o(i, s);
        }
        return n;
      } else
        f(1, t);
    }, this.produceWithPatches = (t, r) => {
      if (typeof t == "function")
        return (s, ...c) => this.produceWithPatches(s, (a) => t(a, ...c));
      let o, n;
      return [this.produce(t, r, (s, c) => {
        o = s, n = c;
      }), o, n];
    }, typeof e?.autoFreeze == "boolean" && this.setAutoFreeze(e.autoFreeze), typeof e?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(e.useStrictShallowCopy), typeof e?.useStrictIteration == "boolean" && this.setUseStrictIteration(e.useStrictIteration);
  }
  createDraft(e) {
    h(e) || f(8), m(e) && (e = we(e));
    const t = J(this), r = j(e, void 0);
    return r[d].isManual_ = !0, R(t), r;
  }
  finishDraft(e, t) {
    const r = e && e[d];
    (!r || !r.isManual_) && f(9);
    const { scope_: o } = r;
    return G(o, t), H(void 0, o);
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
      const n = t[r];
      if (n.path.length === 0 && n.op === "replace") {
        e = n.value;
        break;
      }
    }
    r > -1 && (t = t.slice(r + 1));
    const o = p("Patches").applyPatches_;
    return m(e) ? o(e, t) : this.produce(
      e,
      (n) => o(n, t)
    );
  }
};
function j(e, t) {
  const r = b(e) ? p("MapSet").proxyMap_(e, t) : k(e) ? p("MapSet").proxySet_(e, t) : pe(e, t);
  return (t ? t.scope_ : ee()).drafts_.push(r), r;
}
function we(e) {
  return m(e) || f(10, e), re(e);
}
function re(e) {
  if (!h(e) || C(e))
    return e;
  const t = e[d];
  let r, o = !0;
  if (t) {
    if (!t.modified_)
      return t.base_;
    t.finalized_ = !0, r = A(e, t.scope_.immer_.useStrictShallowCopy_), o = t.scope_.immer_.shouldUseStrictIteration();
  } else
    r = A(e, !0);
  return E(
    r,
    (n, i) => {
      B(r, n, re(i));
    },
    o
  ), t && (t.finalized_ = !1), r;
}
var Pe = new ge(), Oe = Pe.produce;
function Ee(e) {
  let t = e.state, r = {}, o;
  const n = /* @__PURE__ */ new Set(), i = () => {
    if (e.computed) {
      const l = {};
      for (const g in e.computed)
        l[g] = e.computed[g](t);
      r = l;
    }
    o = { ...t, computed: r };
  };
  i();
  const s = () => o, c = (l, g) => {
    const q = Oe(t, l);
    q !== t && (t = q, i(), n.forEach((oe) => oe()));
  }, a = (l) => (n.add(l), () => n.delete(l)), u = (l, g) => {
    y.setState(l, g);
  }, _ = e.actions ? e.actions(u, s) : {};
  let y = {
    getState: s,
    setState: c,
    subscribe: a,
    actions: _
  };
  if (e.middleware)
    for (const l of e.middleware)
      y = l(y);
  return y;
}
const ze = () => Symbol(), U = se(null), Ie = ({ stores: e, children: t }) => {
  const r = Y(U), o = x(new Map(r || []));
  if (e)
    for (const [n, i] of e)
      o.current.has(n) || o.current.set(n, i);
  return /* @__PURE__ */ ie.createElement(U.Provider, { value: o.current }, t);
}, ne = () => {
  const e = Y(U);
  if (!e)
    throw new Error("StoreContext missing. Wrap with <StoreProvider>");
  return e;
}, be = (e, t) => {
  if (Object.is(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
  const r = Object.keys(e), o = Object.keys(t);
  if (r.length !== o.length) return !1;
  for (let n = 0; n < r.length; n++)
    if (!Object.prototype.hasOwnProperty.call(t, r[n]) || !Object.is(e[r[n]], t[r[n]])) return !1;
  return !0;
};
function De(e, t, r = be) {
  const n = ne().get(e);
  if (!n)
    throw new Error(`Store not found for token ${String(e)}`);
  const i = n.getState, s = x(i()), c = x(t(s.current)), a = ce(() => {
    const _ = i();
    if (Object.is(_, s.current))
      return c.current;
    const y = t(_);
    return r(c.current, y) ? (s.current = _, c.current) : (s.current = _, c.current = y, y);
  }, [i, t, r]), u = ae(n.subscribe, a, a);
  return ue(u), u;
}
function ke(e) {
  const r = ne().get(e);
  if (!r) throw new Error("Store not found");
  return r.actions;
}
function Ce(e, t) {
  if (Object.is(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const r = Object.keys(e), o = Object.keys(t);
  if (r.length !== o.length) return !1;
  for (let n = 0; n < r.length; n++)
    if (!Object.prototype.hasOwnProperty.call(t, r[n]) || !Object.is(e[r[n]], t[r[n]]))
      return !1;
  return !0;
}
const Fe = (e) => {
  const t = e.setState;
  return { ...e, setState: (o, n) => {
    const i = e.getState();
    console.groupCollapsed(
      `%cAction: ${n || "Anonymous Update"}`,
      "font-weight: bold;"
    ), console.log("%c Prev State:", "color: #9E9E9E", i), t(o, n);
    const s = e.getState();
    console.log("%c Next State:", "color: #4CAF50", s), console.groupEnd();
  } };
}, Ne = (e) => (t) => {
  const r = t.setState;
  try {
    const n = localStorage.getItem(e);
    if (n) {
      const i = JSON.parse(n);
      r(() => i, "@@INIT_PERSIST");
    }
  } catch (n) {
    console.warn("Persist Middleware: Failed to load state", n);
  }
  return { ...t, setState: (n, i) => {
    r(n, i);
    try {
      const s = t.getState(), { computed: c, ...a } = s;
      localStorage.setItem(e, JSON.stringify(a));
    } catch (s) {
      console.error("Persist Middleware: Failed to save state", s);
    }
  } };
}, xe = (e) => (t) => {
  const r = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (!r) return t;
  const o = r.connect({ name: e }), n = t.setState;
  return o.init(t.getState()), { ...t, setState: (s, c) => {
    n(s, c);
    const { computed: a, ...u } = t.getState();
    o.send(
      { type: c || "Anonymous Action" },
      u
    );
  } };
}, Me = (e) => (t) => {
  const r = t.setState;
  return { ...t, setState: (n, i) => {
    const s = t.getState();
    r((c) => {
      if (n(c), !e(c, s, i))
        throw console.error(`State validation failed for action: ${i}`), new Error(`Validation Failed: Invalid State produced by ${i}`);
    }, i);
  } };
}, Ae = (e, t) => (r) => {
  const o = r.setState;
  let n = [];
  return setTimeout(() => {
    n = t.watch(r.getState());
  }, 0), { ...r, setState: (s, c) => {
    o(s, c);
    const a = r.getState(), u = t.watch(a);
    u.some((y, l) => y !== n[l]) && (console.log(`[QuerySync] State changed, invalidating: ${t.queryKey}`), e.invalidateQueries({ queryKey: t.queryKey }), n = u);
  } };
};
export {
  Ie as StoreProvider,
  Ne as createPersistMiddleware,
  Ae as createQuerySyncMiddleware,
  Ee as createStore,
  ze as createStoreToken,
  Me as createValidatorMiddleware,
  xe as devtools,
  Fe as loggerMiddleware,
  Ce as shallowEqual,
  De as useStore,
  ke as useStoreActions
};
