import { frontendLogger } from "utils/logger";
import { initBridge, frontendSender } from "./bridge";
import "./bridge/controller";
import { ASYNC_MESSAGE } from "types/message/message";
import { registerSpyListener } from "./spyListener";
import { LIFE_CYCLE } from "types/message/lifecycle";
import { deleteStoreNameCache, getMobxStoreNameByKey } from "utils/mobx";
import { HOOK_EVENT } from "types/hookEvents";
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
  window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.on(
    HOOK_EVENT.INSTANCES_INJECTED,
    (mobxid) => {
      frontendLogger.debug`[registerMobxListener] register ${mobxid} mobx listener`;
      registerSpyListener(
        window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.collections[mobxid].mobx
      );
    }
  );
  window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.sub(
    HOOK_EVENT.ON_DELETE,
    ({ name: key }) => {
      frontendSender(ASYNC_MESSAGE.REMOVE_STORE, {
        to: "panel",
        request: {
          key,
        },
      });
      deleteStoreNameCache(key);
    }
  );

  window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.sub(
    HOOK_EVENT.ON_ADD,
    ({ name: key }) => {
      if (!key) {
        return;
      }
      frontendSender(ASYNC_MESSAGE.CREATE_STORE, {
        to: "panel",
        request: {
          key,
          nickname: getMobxStoreNameByKey(key),
        },
      });
    }
  );
};

(async () => {
  initBridge();
  registerMobxListener();

  if (window.__MOBX_DEVTOOLS_GLOBAL_HOOK__) {
    const keys = Object.keys(
      window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.storeCollections
    );
    if (keys.length !== 0) {
      frontendSender(ASYNC_MESSAGE.CREATE_STORE, {
        to: "panel",
        request: {
          key: keys,
          nickname: keys.map(getMobxStoreNameByKey),
        },
      });
    }
  }

  frontendSender(LIFE_CYCLE.FRONTEND_READY, {
    to: "panel",
  });
})();

frontendLogger.debug`frontend inited`;
