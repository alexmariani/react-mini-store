export type StoreToken<T> = symbol;
export const createStoreToken = <T>(): StoreToken<T> => Symbol();
