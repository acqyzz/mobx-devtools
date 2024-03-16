import * as mobx from "mobx";
import * as libmst from "mobx-state-tree";

enum HOOK_EVENT {
  ADD_STORE = "add-store",
  DELETE_STORE = "delete-store",
  ON_ADD = "on-add",
  ON_DELETE = "on-delete",
  INSTANCES_INJECTED = "instances-injected",
}

const checkEnv = () => {
  if (!window.__MOBX_DEVTOOLS_GLOBAL_HOOK__) {
    console.warn(
      "[state-register] window.__MOBX_DEVTOOLS_GLOBAL_HOOK__ is empty, please make sure mobx devtool installed"
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
  const hook = window.__MOBX_DEVTOOLS_GLOBAL_HOOK__;
  hook.inject({ mobx, mst: libmst });
  for (const mobxId in hook.collections) {
    if (Object.prototype.hasOwnProperty.call(hook.collections, mobxId)) {
      const { mst } = hook.collections[mobxId];
      if (mst && mst.isStateTreeNode(store) && mst.isRoot(store)) {
        hook.emit(HOOK_EVENT.ADD_STORE, {
          name,
          store,
          override,
          mobxId,
        });
        return;
      }
    }
  }

  hook.emit(HOOK_EVENT.ADD_STORE, {
    name,
    store,
    override,
  });
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
  window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.emit(HOOK_EVENT.DELETE_STORE, name);
};

export const unregisterStores = (name: (string | object)[]) => {
  if (!checkEnv()) {
    return;
  }
  name.forEach((item) => {
    unregisterSingleStore(item);
  });
};

export const makeInspectable = (root, name?: string, override = false) => {
  registerSingleStore(name, root, override);
  return root;
};

export default registerStores;
