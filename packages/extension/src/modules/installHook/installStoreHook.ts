import { HOOK_EVENT, MobxDevtoolsGlobalHook } from "types/hookEvents";

const getRandomKey = () => {
  return Math.random().toString(36).slice(-4);
};

let nameId = 0;

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
    const { name: originName, store, override } = data;
    const name = originName || `AnonymousStore@${nameId++}`;
    if (!store) {
      throw new Error("fail to add store: store is required");
    }
    let key = name;
    if (!!storeCollections.name) {
      if (storeCollections.name === store) {
        console.log(`fail to add store: exist same store name [${name}]`);
        return name;
      }
      if (override) {
        console.warn(
          `fail to add store: exist store name [${name}], store will be override`
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
