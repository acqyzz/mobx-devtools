import { frontendLogger } from "utils/logger";
import { initBridge, frontendSender } from "./bridge";
import "./bridge/controller";
import { ASYNC_MESSAGE } from "types/message/message";
import { registerSpyListener } from "./spyListener";
import { LIFE_CYCLE } from "types/message/lifecycle";
import { deleteStoreNameCache, getMobxStoreNameByKey } from "utils/mobx";
// import { findSubStoreName } from "./spyListener/storeCollection";

const registerMobxListener = () => {
  if (!window.__MOBX_DEVTOOLS_GLOBAL_HOOK__) {
    frontendLogger.warn`[registerMobxListener] window.__MOBX_DEVTOOLS_GLOBAL_HOOK__ is empty`;
    return;
  }
  // register knownn mobx
  const collections = window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.collections;
  Object.keys(collections).map((key) => {
    frontendLogger.debug`[registerMobxListener] register ${key} mobx listener`;
    registerSpyListener(collections[key].mobx);
  });
  // register injected mobx
  window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.on("instances-injected", (mobxid) => {
    frontendLogger.debug`[registerMobxListener] register ${mobxid} mobx listener`;
    registerSpyListener(
      window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.collections[mobxid].mobx
    );
  });
  if (window.__MOBX_DEVTOOL_STORES__.onDelete) {
    window.__MOBX_DEVTOOL_STORES__.onDelete((key) => {
      frontendSender(ASYNC_MESSAGE.REMOVE_STORE, {
        to: "panel",
        request: {
          key,
        },
      });
      deleteStoreNameCache(key);
    });
  }

  if (window.__MOBX_DEVTOOL_STORES__.onAdd) {
    window.__MOBX_DEVTOOL_STORES__.onAdd((key, store) => {
      frontendSender(ASYNC_MESSAGE.CREATE_STORE, {
        to: "panel",
        request: {
          key,
          nickname: getMobxStoreNameByKey(key),
        },
      });
      // findSubStoreName(key, store);
    });
  }
};

(async () => {
  initBridge();
  registerMobxListener();

  if (window.__MOBX_DEVTOOL_STORES__) {
    const keys = Object.keys(window.__MOBX_DEVTOOL_STORES__);
    frontendSender(ASYNC_MESSAGE.CREATE_STORE, {
      to: "panel",
      request: {
        key: keys,
        nickname: keys.map(getMobxStoreNameByKey),
      },
    });
    // keys.forEach((key) => {
    //   findSubStoreName(key, window.__MOBX_DEVTOOL_STORES__[key]);
    // });
  }

  frontendSender(LIFE_CYCLE.FRONTEND_READY, {
    to: "panel",
  });
})();

frontendLogger.debug`frontend inited`;
