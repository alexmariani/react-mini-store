export function loggerMiddleware(label = "store") {
    return (store: any) => {
        const set = store.setState;
        store.setState = (fn: any) => {
            console.groupCollapsed(`[${label}]`);
            console.log("prev:", store.getState());
            set(fn);
            console.log("next:", store.getState());
            console.groupEnd();
        };
        return store;
    };
}
