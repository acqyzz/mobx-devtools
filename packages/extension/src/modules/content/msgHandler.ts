import { frontendRegister } from "./bridge";
import { ASYNC_MESSAGE } from "types/message/message";
import { frontendLogger } from "utils/logger";
import { updateState, addItem, removeItem } from "patch-obj";

const turnOffEnforceActions = () => {
  if (!window.__mobxGlobals) {
    return () => {};
  }
  const originEnforceActions = window.__mobxGlobals.enforceActions;
  const originAllowStateChanges = window.__mobxGlobals.allowStateChanges;
  window.__mobxGlobals.enforceActions = false;
  window.__mobxGlobals.allowStateChanges = true;
  return () => {
    window.__mobxGlobals.enforceActions = originEnforceActions;
    window.__mobxGlobals.originAllowStateChanges = originAllowStateChanges;
  };
};

export const registryMsgHandler = () => {
  frontendRegister(ASYNC_MESSAGE.PATCH_STATE_FROM_FRONTEND, (msg) => {
    const turnOn = turnOffEnforceActions();
    try {
      const { path, value, storeName } = msg.request;
      const curState =
        window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.storeCollections[storeName];
      if (!curState) {
        frontendLogger.warn`patch state error, unknown store name ${storeName}`;
        return;
      }
      updateState(curState, { path, value });
    } finally {
      turnOn();
    }
  });

  frontendRegister(ASYNC_MESSAGE.CREATE_STATE_FROM_FRONTEND, (msg) => {
    const turnOn = turnOffEnforceActions();
    try {
      const { path, value, storeName } = msg.request;
      const curState =
        window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.storeCollections[storeName];
      if (!curState) {
        frontendLogger.warn`patch state error, unknown store name ${storeName}`;
        return;
      }
      addItem(curState, { path, value });
    } finally {
      turnOn();
    }
  });

  frontendRegister(ASYNC_MESSAGE.REMOVE_STATE_FROM_FRONTEND, (msg) => {
    const turnOn = turnOffEnforceActions();
    try {
      const { path, storeName } = msg.request;
      const curState =
        window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.storeCollections[storeName];
      if (!curState) {
        frontendLogger.warn`patch state error, unknown store name ${storeName}`;
        return;
      }
      removeItem(curState, path);
    } finally {
      turnOn();
    }
  });
};
