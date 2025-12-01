// src/App.tsx
import React from "react";
import { withStoreProvider } from "react-mini-store";
import DelegheList from "./components/DelegheList";
import { delegheAssicurativeStore } from "./stores/deleghe/delegheAssicurativeStore";
import { delegheProfessionaliStore } from "./stores/deleghe/delegheProfessionaliStore";
import { IDelegheStoreToken } from "./stores/tokens/tokens";
function App() {
  return (
    <div>
      <h1>Mini Store Demo</h1>

      <h2>Assicurative</h2>
      <DelegheAssicurativeProvider>
        <DelegheList />
      </DelegheAssicurativeProvider>

      <h2>Professionali</h2>
      <DelegheProfessionaliProvider>
        <DelegheList />
      </DelegheProfessionaliProvider>
    </div>
  );
}

// Creiamo due provider separati usando lo stesso HOC
export const DelegheAssicurativeProvider = withStoreProvider(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  IDelegheStoreToken,
  delegheAssicurativeStore
);

export const DelegheProfessionaliProvider = withStoreProvider(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  IDelegheStoreToken,
  delegheProfessionaliStore
);

export default App;
