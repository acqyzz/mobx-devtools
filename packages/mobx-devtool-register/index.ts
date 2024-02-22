const checkEnv = () => {
  if (!window.__MOBX_DEVTOOL_STORES__) {
    console.warn(
      "[state-register] window.__MOBX_DEVTOOL_STORES__ is empty, please make sure mobx devtool installed"
    );
    return false;
  }
  return true;
};

export const registerSingleStore = (
  name: string,
  store: object,
  override = false
) => {
  if (!checkEnv()) {
    return;
  }
  window.__MOBX_DEVTOOL_STORES__.addStore(name, store, (override = false));
};

export const registerStores = (
  stores: Record<string, object>,
  override = false
) => {
  if (!checkEnv()) {
    return;
  }
  for (const key in stores) {
    if (Object.prototype.hasOwnProperty.call(stores, key)) {
      registerSingleStore(key, stores[key], override);
    }
  }
};

export const unregisterSingleStore = (name: string | object) => {
  if (!checkEnv()) {
    return;
  }
  window.__MOBX_DEVTOOL_STORES__.deleteStore(name);
};

export const unregisterStores = (name: (string | object)[]) => {
  if (!checkEnv()) {
    return;
  }
  name.forEach((item) => {
    unregisterSingleStore(item);
  });
};

export default registerStores;
