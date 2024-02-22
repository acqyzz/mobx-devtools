const getRandomKey = () => {
  return Math.random().toString(36).slice(-3);
};

export const installStoreHook = (window) => {
  if (window.__MOBX_DEVTOOL_STORES__) {
    return;
  }
  const define = (key: string, value: PropertyDescriptor) => {
    return Object.defineProperty(window.__MOBX_DEVTOOL_STORES__, key, {
      value,
      enumerable: false,
    });
  };
  window.__MOBX_DEVTOOL_STORES__ = {};
  const properties = {
    deleteStore: (name: string | object) => {
      if (typeof name === "string") {
        const store = window.__MOBX_DEVTOOL_STORES__[name];
        delete window.__MOBX_DEVTOOL_STORES__[name];
        if (store) {
          // invoke listeners
          window.__MOBX_DEVTOOL_STORES__.deleteListeners.forEach((fn) => {
            fn(name, store);
          });
        }
        return;
      } else if (typeof name === "object") {
        const keys = Object.keys(window.__MOBX_DEVTOOL_STORES__);
        keys.forEach((key) => {
          if (window.__MOBX_DEVTOOL_STORES__[key] === name) {
            delete window.__MOBX_DEVTOOL_STORES__[key];
            // invoke listeners
            window.__MOBX_DEVTOOL_STORES__.deleteListeners.forEach((fn) => {
              fn(key, name);
            });
          }
        });
        return;
      }
      throw new Error("[unregisterSingleStore] name must be string or object");
    },
    addStore: (name: string, store: object, override = false) => {
      if (!name) {
        throw new Error("[registerSingleStore] name is required");
      }
      if (!store) {
        throw new Error("[registerSingleStore] store is required");
      }
      let key = name;
      if (!!window.__MOBX_DEVTOOL_STORES__.name) {
        if (window.__MOBX_DEVTOOL_STORES__.name === store) {
          console.log(`[registerSingleStore] exist same store name [${name}]`);
          return name;
        }
        if (override) {
          console.warn(
            `[registerSingleStore] exist store name [${name}], store will be override`
          );
        } else {
          key = `${name}_${getRandomKey()}`;
        }
      }
      window.__MOBX_DEVTOOL_STORES__[key] = store;
      // invoke listeners
      window.__MOBX_DEVTOOL_STORES__.addListeners.forEach((fn) => {
        fn(key, store);
      });
      return key;
    },
    addListeners: [],
    deleteListeners: [],
    onAdd: (fn: (name: string, store: object) => void) => {
      window.__MOBX_DEVTOOL_STORES__.addListeners.push(fn);
    },
    onDelete: (fn: (name: string, store: object) => void) => {
      window.__MOBX_DEVTOOL_STORES__.deleteListeners.push(fn);
    },
  };

  Object.keys(properties).forEach((key) => {
    define(key, properties[key]);
  });
};
