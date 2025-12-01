import React, { useEffect } from "react";
import { StoreApi, StoreState } from "./createStore";
import { provideStore } from "./storeRegistry";

/**
 * HOC padre che fornisce uno store al subtree senza passarlo come prop
 * @param Component componente da wrappare
 * @param token token dello store
 * @param store store da fornire
 */
export function withStoreProvider<
  P extends object,
  TState extends StoreState,
  TActions
>(
  Component: React.ComponentType<P>,
  token: symbol,
  store: StoreApi<TState, TActions>
) {
  const Wrapped: React.FC<P> = (props) => {
    useEffect(() => {
      // registra lo store nel registry per il subtree
      const cleanup = provideStore(token, store);
      return cleanup;
    }, []);

    // renderizza il componente figlio senza modificare i props
    return <Component {...props} />;
  };

  Wrapped.displayName = `withStoreProvider(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapped;
}
