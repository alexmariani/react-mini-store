import React, { useEffect } from "react";
import { useStore } from "react-mini-store";
import type {
    IDelegheStoreActions,
    IDelegheStoreState,
} from "../stores/deleghe/intefaces/delegheStoreInterface";
import { IDelegheStoreToken } from "../stores/tokens/tokens";

const DelegheList: React.FC = () => {
  const store = useStore<IDelegheStoreState, IDelegheStoreActions>(
    IDelegheStoreToken
  );

  const { items } = store.getState();
  const { addItem, fetchItems, resetItems } = store.actions;
  const { total } = store.computed;

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div>
      <p>Total items: {total} </p>
      <ul>
        {items.map((i) => (
          <li key={i}> {i} </li>
        ))}
      </ul>
      <button onClick={() => addItem(items.length + 1)}> Add Item </button>
      <button onClick={resetItems}> Reset Items </button>
    </div>
  );
};

export default DelegheList;
