import { HOOK_EVENT, MobxDevtoolsGlobalHook } from "types/hookEvents";

const getRandomKey = () => {
  return Math.random().toString(36).slice(-3);
};

export const installStoreHook = (hook: MobxDevtoolsGlobalHook) => {
  if (!hook) {
    return;
  }

  Object.defineProperty(hook, "storeCollections", {
    value: {},
    enumerable: false,
  });

  const storeCollections = hook.storeCollections;

  hook.sub(HOOK_EVENT.ADD_STORE, (data) => {
    const { name, store, override } = data;
    if (!name) {
      throw new Error("[registerSingleStore] name is required");
    }
    if (!store) {
      throw new Error("[registerSingleStore] store is required");
    }
    let key = name;
    if (!!storeCollections.name) {
      if (storeCollections.name === store) {
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
    storeCollections[key] = store;
    hook.emit(HOOK_EVENT.ON_ADD, {
      name: key,
      store,
    });
    return key;
  });

  hook.sub(HOOK_EVENT.DELETE_STORE, (name) => {
    if (typeof name === "string") {
      const store = storeCollections[name];
      delete storeCollections[name];
      if (store) {
        hook.emit(HOOK_EVENT.ON_DELETE, {
          name,
          store,
        });
      }
      return;
    } else if (typeof name === "object") {
      const keys = Object.keys(storeCollections);
      keys.forEach((key) => {
        if (storeCollections[key] === name) {
          delete storeCollections[key];
          hook.emit(HOOK_EVENT.ON_DELETE, {
            name: key,
            store: name,
          });
        }
      });
      return;
    }
    console.warn("[unregisterSingleStore] name must be string or object");
  });
};
