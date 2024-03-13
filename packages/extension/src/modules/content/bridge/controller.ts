import { ASYNC_MESSAGE } from "types/message/message";
import { frontendRegister } from ".";
import { registryMsgHandler } from "./msgHandler";
import { getAsLeaf, getWholeStateAsLeaf } from "patch-obj";
import { getMobxStoreNameByKey } from "utils/mobx";
import {
  applySnapshot,
  getMSTLogItem,
  getMSTNames,
  removeLogItems,
  updateMSTRecording,
} from "../mst/mst";

const checkEnv = () => {
  if (!window.__MOBX_DEVTOOLS_GLOBAL_HOOK__) {
    return false;
  }
  return true;
};

frontendRegister(ASYNC_MESSAGE.GET_ALL_STORES_KEYS, () => {
  if (!checkEnv()) {
    return { keys: [], nicknames: [] };
  }
  const keys = Object.keys(
    window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.storeCollections
  );
  return { keys, nicknames: keys.map(getMobxStoreNameByKey) };
});

frontendRegister(ASYNC_MESSAGE.GET_DATA_BY_PATH, (msg) => {
  if (!checkEnv()) {
    return undefined;
  }
  const { storeName, path } = msg.request;
  return {
    nodes: getAsLeaf(
      window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.storeCollections[storeName],
      path
    ),
  };
});

frontendRegister(ASYNC_MESSAGE.GET_TREE_DATA_BY_PATHS, (msg) => {
  if (!checkEnv()) {
    return {
      nodes: [],
    };
  }
  const { paths, storeName } = msg.request;
  return {
    nodes: getWholeStateAsLeaf(
      window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.storeCollections[storeName],
      paths
    ),
  };
});

frontendRegister(ASYNC_MESSAGE.GET_ALL_MST_KEYS, () => {
  if (!checkEnv()) {
    return {
      keys: [],
    };
  }
  return {
    keys: getMSTNames(),
  };
});

frontendRegister(ASYNC_MESSAGE.GET_MST_SNAPSHOT, (msg) => {
  const { logItemId, key } = msg.request;
  if (!checkEnv()) {
    return {
      snapshot: {},
    };
  }
  const logItem = getMSTLogItem(key, logItemId);
  return {
    snapshot: logItem?.snapshot || {},
  };
});

frontendRegister(ASYNC_MESSAGE.PUT_LOG_RECORDING, (msg) => {
  const { isRecording } = msg.request;
  if (!checkEnv()) {
    return;
  }
  updateMSTRecording(isRecording);
});

frontendRegister(ASYNC_MESSAGE.REMOVE_DEPRECATED_LOGS, (msg) => {
  const { key, ids } = msg.request;
  if (!checkEnv()) {
    return;
  }
  removeLogItems(key, ids);
});

frontendRegister(ASYNC_MESSAGE.APPLY_SNAPSHOT, (msg) => {
  const { key, id } = msg.request;
  if (!checkEnv()) {
    return;
  }
  applySnapshot(key, id);
});

registryMsgHandler();
