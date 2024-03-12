import { ASYNC_MESSAGE } from "types/message/message";
import { panelRegister, panelSender } from ".";
import { LIFE_CYCLE } from "types/message/lifecycle";
import { beginCheckMobxInDebug } from "panel/checker";
import { panelLogger } from "utils/logger";
import { createApp } from "..";
import { changesStore } from "panel/store/changes";
import { stateStore } from "panel/store/state";
import {
  addStoreArrayItem,
  removeStoreArrayItem,
  updateStoreState,
} from "panel/utils/patch";
import { mstStore } from "panel/store/mst";

panelRegister(LIFE_CYCLE.FRONTEND_READY, async () => {
  await beginCheckMobxInDebug();
  panelLogger.debug`createApp`;
  createApp();
});

panelRegister(ASYNC_MESSAGE.CREATE_STORE, stateStore.onCreateStore);

panelRegister(ASYNC_MESSAGE.REMOVE_STORE, stateStore.onRemoveStore);

panelRegister(ASYNC_MESSAGE.REPORT_STORES_CHANGED, async (msg) => {
  stateStore.updateWholeState();
});

panelRegister(ASYNC_MESSAGE.PATCH_STATE_FROM_PANEL, (msg) => {
  const { storeName, value, path } = msg.request;
  updateStoreState(stateStore.curState, {
    path: [storeName, ...path],
    value,
  });
});

panelRegister(ASYNC_MESSAGE.CREATE_STATE_FROM_PANEL, (msg) => {
  const { storeName, value, path } = msg.request;
  addStoreArrayItem(stateStore.curState, {
    path: [storeName, ...path],
    value,
  });
});

panelRegister(ASYNC_MESSAGE.REMOVE_STATE_FROM_PANEL, (msg) => {
  const { storeName, path } = msg.request;
  removeStoreArrayItem(stateStore.curState, [storeName, ...path]);
});

panelRegister(ASYNC_MESSAGE.REPORT_CHANGES, changesStore.onReportChanges);

panelRegister(ASYNC_MESSAGE.CREATE_MST, (msg) => {
  const { key } = msg.request;
  mstStore.createStore(key);
});

panelRegister(ASYNC_MESSAGE.ADD_MST_LOG_ITEM, (msg) => {
  const request = msg.request;
  const { logItem, key } = request;
  mstStore.addLogItem(key, logItem);
});
