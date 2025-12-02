import React, { createContext, useContext, useRef } from "react";
import { StoreApi } from "./createStore";

// Token univoco
export type StoreToken<TState, TActions> = symbol;
export const createStoreToken = <S, A = any>(): StoreToken<S, A> => Symbol();

// Mappa modificabile (Mutable Registry)
type StoreMap = Map<symbol, StoreApi<any, any>>;

// Il Context ora contiene la mappa STABILE.
const StoreContext = createContext<StoreMap | null>(null);

export interface StoreProviderProps {
  // Tuple [Token, StoreInstance]
  stores: [StoreToken<any, any>, StoreApi<any, any>][];
  children: React.ReactNode;
}

export const StoreProvider = ({ stores, children }: StoreProviderProps) => {
  const parentMap = useContext(StoreContext);

  // 🚀 OTTIMIZZAZIONE 1: useRef invece di useMemo
  // Creiamo la mappa una volta sola all'inizio.
  // Questa istanza 'registryRef.current' non cambierà MAI durante la vita di questo componente.
  // Risultato: <StoreContext.Provider> non causerà MAI re-render dei figli,
  // nemmeno se il componente padre di StoreProvider si aggiorna!
  const registryRef = useRef<StoreMap>(new Map(parentMap || []));

  // Sincronizziamo gli store passati via props con la mappa mutabile.
  // Questo avviene in modo sincrono durante il render per renderli disponibili subito,
  // ma senza cambiare il riferimento dell'oggetto Map.
  if (stores) {
    for (const [token, store] of stores) {
      if (!registryRef.current.has(token)) {
        registryRef.current.set(token, store);
      }
    }
  }

  // Nota: Poiché 'registryRef.current' è sempre lo stesso oggetto,
  // React ignora qualsiasi aggiornamento qui sotto. È un "Static Provider".
  return (
    <StoreContext.Provider value={registryRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreRegistry = () => {
  const map = useContext(StoreContext);
  if (!map) {
    throw new Error("StoreContext missing. Wrap with <StoreProvider>");
  }
  return map;
};
