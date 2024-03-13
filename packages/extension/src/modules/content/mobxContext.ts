import { frontendLogger } from "utils/logger";
import { registerSpyListener } from "./spyListener";
import { HOOK_EVENT } from "types/hookEvents";
import { frontendSender } from "./bridge";
import { ASYNC_MESSAGE } from "types/message/message";
import { deleteStoreNameCache, getMobxStoreNameByKey } from "utils/mobx";
import { registerMSTRoot, unregisterMSTRoot } from "./mst/mst";

export const registerMobxListener = () => {
  if (!window.__MOBX_DEVTOOLS_GLOBAL_HOOK__) {
    frontendLogger.warn`[registerMobxListener] window.__MOBX_DEVTOOLS_GLOBAL_HOOK__ is empty`;
    return;
  }
  const hook = window.__MOBX_DEVTOOLS_GLOBAL_HOOK__;
  // register known mobx
  const collections = hook.collections;
  Object.keys(collections).map((key) => {
    frontendLogger.debug`[registerMobxListener] register ${key} mobx listener`;
    registerSpyListener(collections[key].mobx);
  });
  // register injected mobx
  hook.on(HOOK_EVENT.INSTANCES_INJECTED, (mobxid) => {
    frontendLogger.debug`[registerMobxListener] register ${mobxid} mobx listener`;
    registerSpyListener(hook.collections[mobxid].mobx);
  });
  hook.sub(HOOK_EVENT.ON_DELETE, ({ name: key }) => {
    frontendSender(ASYNC_MESSAGE.REMOVE_STORE, {
      to: "panel",
      request: {
        key,
      },
    });
    deleteStoreNameCache(key);
    unregisterMSTRoot(key);
  });

  hook.sub(HOOK_EVENT.ON_ADD, ({ name: key, store, mobxId }) => {
    if (!key) {
      return;
    }
    if (mobxId) {
      const { mst } = hook.collections[mobxId];
      if (mst && mst.isStateTreeNode(store) && mst.isRoot(store)) {
        registerMSTRoot(store, mst, key, mobxId);
        frontendSender(ASYNC_MESSAGE.CREATE_MST, {
          to: "panel",
          request: {
            key,
          },
        });
        return;
      }
    }
    frontendSender(ASYNC_MESSAGE.CREATE_STORE, {
      to: "panel",
      request: {
        key,
        nickname: getMobxStoreNameByKey(key),
      },
    });
  });
};

export const syncMobxStores = () => {
  if (window.__MOBX_DEVTOOLS_GLOBAL_HOOK__) {
    const hook = window.__MOBX_DEVTOOLS_GLOBAL_HOOK__;
    const keys = Object.keys(hook.storeCollections);
    if (keys.length !== 0) {
      keys.forEach((key) => {
        const store = hook.storeCollections[key];
        if (hook.mstMap.has(store)) {
          const mobxId = hook.mstMap.get(store);
          const { mst } = hook.collections[mobxId];
          if (mst && mst.isStateTreeNode(store) && mst.isRoot(store)) {
            registerMSTRoot(store, mst, key, mobxId);
            frontendSender(ASYNC_MESSAGE.CREATE_MST, {
              to: "panel",
              request: {
                key,
              },
            });
            return;
          }
        }
        frontendSender(ASYNC_MESSAGE.CREATE_STORE, {
          to: "panel",
          request: {
            key: key,
            nickname: getMobxStoreNameByKey(key),
          },
        });
      });
    }
  }
};
