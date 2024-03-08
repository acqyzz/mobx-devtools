import { autorun, makeAutoObservable } from "mobx";
import { panelSender } from "panel/bridge";
import { ASYNC_MESSAGE } from "types/message/message";
import { panelLogger } from "utils/logger";
import "./syncState";
import { RequestMessage } from "types/message";
import { StateNode } from "panel/types";
import { createDataNode } from "patch-obj";
import { getStoreByPath } from "panel/utils/patch";

const createStateNode = (
  ...args: Parameters<typeof createDataNode>
): StateNode => {
  const dataNode = createDataNode(...args);
  return {
    ...dataNode,
    children: [],
  };
};
class StateStore {
  constructor() {
    makeAutoObservable(this);
    chrome.devtools.network.onNavigated.addListener(() => {
      this.init();
    });
    autorun(() => {
      if (!this.curState) {
        return;
      }
      if (this.curState.children?.length === 0) {
        this.onGetLeaf(this.currentStateName, []);
      }
    });
  }

  stateVisitedPath = new Map<string, string[][]>();

  nicknameMap = new Map<string, string>();

  originState: Record<string, StateNode> = {};

  currentStateName = "";
  
  init = async () => {
    this.originState = {};
    this.currentStateName = '';
    this.nicknameMap.clear();
    this.stateVisitedPath.clear();
    const result = await panelSender(ASYNC_MESSAGE.GET_ALL_STORES_KEYS, {
      to: "frontend",
    });
    const { keys, nicknames } = result.response || {};
    keys?.forEach((key, index) => {
      this.originState[key] =
        this.originState[key] || createStateNode(this.originState, key, {});
      this.nicknameMap.set(key, nicknames[index]);
    });
    this.ensureCurrentStateName();
  };


  get curState() {
    if (!this.originState || !this.originState[this.currentStateName]) {
      return null;
    }
    return this.originState[this.currentStateName];
  }

  get stateItems() {
    if (!this.originState) {
      return [];
    }
    return Object.keys(this.originState).map((key) => {
      if (this.nicknameMap.get(key)) {
        return { label: `${key} (${this.nicknameMap.get(key)})`, key };
      }
      return { key, label: key };
    });
  }

  mergeVisitedPath = (storeName: string, path: string[]) => {
    const visitedPath = this.stateVisitedPath.get(storeName) || [];
    // if find last visited path, replace it
    const existIndex = visitedPath.findIndex(
      (item) =>
        item.length < path.length &&
        item.every((subItem, index) => subItem === path[index])
    );
    if (existIndex > -1) {
      visitedPath.splice(existIndex, 1, path);
    } else {
      visitedPath.push(path);
    }
    this.stateVisitedPath.set(storeName, visitedPath);
  };

  onGetLeaf = async (storeName: string, path: string[]) => {
    if (!this.originState[storeName] || !storeName) {
      panelLogger.warn`receive empty get leaf storeName ${storeName}`;
      return;
    }
    const msg = await panelSender(ASYNC_MESSAGE.GET_DATA_BY_PATH, {
      to: "frontend",
      request: {
        storeName,
        path,
      },
    });
    this.mergeVisitedPath(storeName, path);
    const { nodes } = msg.response;
    const stateNode: StateNode = getStoreByPath(
      this.originState[storeName],
      path
    );
    stateNode.children = nodes;
  };

  onCloseLeaf = (storeName: string, path: string[]) => {
    const storeVisitedPath = this.stateVisitedPath.get(storeName);
    if (!storeVisitedPath) {
      return;
    }
    const newStoreVisitedPath = storeVisitedPath.filter((paths) => {
      if (!paths.length) {
        return true;
      }
      if (
        storeVisitedPath.length !== paths.length &&
        storeVisitedPath.every((item, index) => item[index] === paths[index])
      ) {
        return true;
      }
      return false;
    });
    this.stateVisitedPath.set(storeName, newStoreVisitedPath);
  };

  onCreateStore = (message: RequestMessage<ASYNC_MESSAGE.CREATE_STORE>) => {
    const { key, nickname } = message.request || {};
    if (!key) {
      panelLogger.warn`receive empty create store key`;
      return;
    }
    if (typeof key === "string") {
      this.originState[key] =
        this.originState[key] || createStateNode(this.originState, key, {});
      this.nicknameMap.set(key, nickname as string);
      // this.stateVisitedPath.set(key, []);
    } else if (Array.isArray(key)) {
      key.forEach((item, index) => {
        this.originState[item] =
          this.originState[item] || createStateNode(this.originState, key, {});
        this.nicknameMap.set(item, nickname[index]);
      });
    }
    this.ensureCurrentStateName();
    panelLogger.debug`create store ${key}`;
  };
  onRemoveStore = (message: RequestMessage<ASYNC_MESSAGE.REMOVE_STORE>) => {
    const key = message.request?.key;
    if (!key) {
      panelLogger.warn`receive empty remove store key`;
      return;
    }
    panelLogger.debug`remove store ${key}`;
    delete this.originState[key];
    this.stateVisitedPath.delete(key);
    this.nicknameMap.delete(key);
  };
  setOriginState = (originState) => {
    // do not replace origin whole state
    this.originState = { ...(this.originState || {}), ...(originState || {}) };
  };

  ensureCurrentStateName = () => {
    if (!this.currentStateName) {
      this.currentStateName = this.originState
        ? Object.keys(this.originState)[0] || ""
        : "";
      if (this.currentStateName) {
        this.onGetLeaf(this.currentStateName, []);
      }
    }
  };

  updateWholeState = async () => {
    const { curState, currentStateName, stateVisitedPath } = this;
    if (!curState) {
      return;
    }
    // update whole single mobx store
    const result = await panelSender(ASYNC_MESSAGE.GET_TREE_DATA_BY_PATHS, {
      to: "frontend",
      request: {
        storeName: currentStateName,
        paths: stateVisitedPath.get(currentStateName) || [],
      },
    });
    this.setOriginState({
      ...stateStore.originState,
      [currentStateName]: {
        ...stateStore.originState[currentStateName],
        children: result.response.nodes,
      },
    });
  };

  updateCurrentState = (name: string) => {
    if (name in this.originState) {
      this.currentStateName = name;
      this.updateWholeState();
      return;
    }
    panelLogger.warn`updateCurrentState, unknown state name ${name}`;
  };

  updateState = (data: { value: any; path: string[] }) => {
    // updateStoreState(this.curState, data);
    panelSender(ASYNC_MESSAGE.PATCH_STATE_FROM_FRONTEND, {
      to: "frontend",
      request: {
        path: data.path,
        value: data.value,
        storeName: this.currentStateName,
      },
    });
  };
  onRemoveArrayItem = (path: string[]) => {
    // removeStoreArrayItem(this.curState, path);
    panelSender(ASYNC_MESSAGE.REMOVE_STATE_FROM_FRONTEND, {
      to: "frontend",
      request: {
        path,
        storeName: this.currentStateName,
      },
    });
  };
  onAddArrayItem = (data: { value: any; path: string[] }) => {
    // addStoreArrayItem(this.curState, data);
    const { path, value } = data;
    panelSender(ASYNC_MESSAGE.CREATE_STATE_FROM_FRONTEND, {
      to: "frontend",
      request: {
        path,
        value,
        storeName: this.currentStateName,
      },
    });
  };
}

export const stateStore = new StateStore();
