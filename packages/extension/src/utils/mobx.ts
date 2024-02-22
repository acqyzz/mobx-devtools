export const storeNameCache: Map<string, string> = new Map();
export const mobxStoreNameCache: Map<string, string> = new Map();

export const deleteStoreNameCache = (key: string) => {
  storeNameCache.delete(key);
  mobxStoreNameCache.delete(key);
};

export const getMobxStoreNameByKey = (key: string) => {
  // such as UserStore@1
  if (
    !window.__MOBX_DEVTOOLS_GLOBAL_HOOK__?.collections ||
    !window.__MOBX_DEVTOOL_STORES__
  ) {
    return "";
  }
  if (storeNameCache.get(key)) {
    return storeNameCache.get(key);
  }
  const symbols = getAllMobxSymbols();
  const store = window.__MOBX_DEVTOOL_STORES__[key];
  const storeSymbolKey = symbols.find((symbolKey) => store[symbolKey]);
  if (storeSymbolKey) {
    return store[storeSymbolKey].name_;
  }
  return "";
};

export const getKeyByMobxStoreName = (storeName: string) => {
  // such as userStore
  if (!window.__MOBX_DEVTOOL_STORES__) {
    return "";
  }
  if (mobxStoreNameCache.get(storeName)) {
    return mobxStoreNameCache.get(storeName);
  }
  const keys = Object.keys(window.__MOBX_DEVTOOL_STORES__);
  const storeKey = keys.find((key) => {
    return getMobxStoreNameByKey(key) === storeName;
  });
  mobxStoreNameCache.set(storeName, storeKey);
  return storeKey || "";
};

export const getAllMobxSymbols = () => {
  return window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.mobxSymbols;
};

// export const judgeIsMobxObservableObject = (data: any) => {
//   if (typeof window === "undefined") {
//     return false;
//   }
//   const collections = window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.collections;
//   const symbols = Object.keys(collections).map(
//     (mobxId) => collections[mobxId].mobx.$mobx
//   );
//   return data && symbols.some((symbolKey) => data[symbolKey]);
// };
