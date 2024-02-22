import { ASYNC_MESSAGE } from "types/message/message";
import { frontendRegister } from ".";
import { registryMsgHandler } from "../msgHandler";
import { getAsLeaf, getWholeStateAsLeaf } from "patch-obj";
import { getMobxStoreNameByKey } from "utils/mobx";

frontendRegister(ASYNC_MESSAGE.GET_ALL_STORES_KEYS, () => {
  if (!window.__MOBX_DEVTOOL_STORES__) {
    return { keys: [], nicknames: [] };
  }
  const keys = Object.keys(window.__MOBX_DEVTOOL_STORES__);
  return { keys, nicknames: keys.map(getMobxStoreNameByKey) };
});

frontendRegister(ASYNC_MESSAGE.GET_DATA_BY_PATH, (msg) => {
  if (!window.__MOBX_DEVTOOL_STORES__) {
    return undefined;
  }
  const { storeName, path } = msg.request;
  return {
    nodes: getAsLeaf(window.__MOBX_DEVTOOL_STORES__[storeName], path),
  };
});

frontendRegister(ASYNC_MESSAGE.GET_TREE_DATA_BY_PATHS, (msg) => {
  if (!window.__MOBX_DEVTOOL_STORES__) {
    return {
      nodes: [],
    };
  }
  const { paths, storeName } = msg.request;
  return {
    nodes: getWholeStateAsLeaf(
      window.__MOBX_DEVTOOL_STORES__[storeName],
      paths
    ),
  };
});

registryMsgHandler();
