import { makeAutoObservable } from "mobx";
import { panelSender } from "panel/bridge";
import { MAX_MST_LOG_LENGTH } from "src/options";
import { ASYNC_MESSAGE } from "types/message/message";
import { SummaryLogItem } from "types/mst";
import { ACTIVE_KEY, appStore } from "./app";

interface StoreRecord {
  logItems: SummaryLogItem[];
  currentSnapshot?: object;
  activeLogItemId: number;
  currentPathes: SummaryLogItem["patches"];
}

const createStore = (): StoreRecord => {
  return {
    logItems: [],
    currentSnapshot: undefined,
    activeLogItemId: -1,
    currentPathes: [],
  };
};

class MSTStore {
  constructor() {
    makeAutoObservable(this);
    chrome.devtools.network.onNavigated.addListener(() => {
      this.init();
    });
  }
  stores: Record<string, StoreRecord> = {};

  currentStoreKey = "";

  isRecording = true;

  get storeNames() {
    return Object.keys(this.stores);
  }

  get currentStore() {
    return this.stores[this.currentStoreKey];
  }

  init = async () => {
    this.stores = {};
    this.currentStoreKey = "";
    const result = await panelSender(ASYNC_MESSAGE.GET_ALL_MST_KEYS, {
      to: "frontend",
    });
    const { keys } = result.response || {};
    keys?.forEach((key) => {
      this.createStore(key);
    });
    this.ensureCurrentStateName();
  };

  changeStoreKey = (key: string) => {
    this.currentStoreKey = key;
  };

  createStore = (key: string) => {
    this.stores = { [key]: createStore(), ...this.stores };
    this.ensureCurrentStateName();
  };

  removeStore = (key: string) => {
    if (key === this.currentStoreKey) {
      const lastKey = Object.keys(this.stores).find((k) => k !== key);
      if (lastKey) {
        this.currentStoreKey = lastKey;
      }
    }
    delete this.stores[key];
    if (
      !Object.keys(this.stores).length &&
      appStore.curActiveKey === ACTIVE_KEY.MST
    ) {
      appStore.updateActiveKey(ACTIVE_KEY.STATE_TREE);
    }
  };

  addLogItem = (key: string, logItem: any) => {
    const store = this.stores[key];
    if (!store) return;
    store.logItems = [...store.logItems, logItem];
    if (store.logItems.length > MAX_MST_LOG_LENGTH) {
      this.spliceLogItems(
        key,
        0,
        store.logItems.length - Math.ceil(MAX_MST_LOG_LENGTH / 2)
      );
    }
    if (key === this.currentStoreKey) {
      setTimeout(() => {
        this.selectLogItem(logItem.id);
      });
    }
  };

  ensureCurrentStateName = () => {
    if (!this.currentStoreKey) {
      this.currentStoreKey = Object.keys(this.stores)[0] || "";
    }
  };

  selectLogItem = async (logItemId?: number) => {
    const store = this.stores[this.currentStoreKey];
    if (!store) return;
    store.activeLogItemId = logItemId;
    if (logItemId !== undefined) {
      const result = await panelSender(ASYNC_MESSAGE.GET_MST_SNAPSHOT, {
        to: "frontend",
        request: {
          key: this.currentStoreKey,
          logItemId: logItemId,
        },
      });
      const { snapshot = {} } = result.response || {};
      store.currentSnapshot = snapshot;
      store.currentPathes =
        store.logItems.find((item) => item.id === logItemId)?.patches || [];
    }
  };

  clearCurrentLogItem = () => {
    const store = this.stores[this.currentStoreKey];
    if (!store) return;
    if (!!store.logItems.length) {
      this.spliceLogItems(this.currentStoreKey, 1, Infinity);
      this.selectLogItem(store.logItems[0]?.id);
    }
  };

  spliceLogItems = (key: string, begin: number, end: number) => {
    const store = this.stores[key];
    if (!store) return [];
    const deprecatedIds = store.logItems
      .splice(begin, end)
      .map((item) => item.id);
    panelSender(ASYNC_MESSAGE.REMOVE_DEPRECATED_LOGS, {
      to: "frontend",
      request: {
        key: key,
        ids: deprecatedIds,
      },
    });
    return deprecatedIds;
  };

  keepBelowLogItems = (index: number) => {
    const store = this.stores[this.currentStoreKey];
    if (!store) return;
    this.spliceLogItems(this.currentStoreKey, index + 1, Infinity);
    this.selectLogItem(store.logItems[index]?.id);
  };

  keepUpperLogItems = (index: number) => {
    const store = this.stores[this.currentStoreKey];
    if (!store) return;
    this.spliceLogItems(this.currentStoreKey, 0, index);
    this.selectLogItem(store.logItems[index]?.id);
  };

  timeTravelToLogItem = (id: number) => {
    if (id === undefined) {
      return;
    }
    const store = this.stores[this.currentStoreKey];
    if (!store) return;
    panelSender(ASYNC_MESSAGE.APPLY_SNAPSHOT, {
      to: "frontend",
      request: {
        key: this.currentStoreKey,
        id,
      },
    });
    this.selectLogItem(id);
  };

  switchIsRecording = async () => {
    this.isRecording = !this.isRecording;
    await panelSender(ASYNC_MESSAGE.PUT_LOG_RECORDING, {
      to: "frontend",
      request: {
        isRecording: this.isRecording,
      },
    });
  };
}

export const mstStore = new MSTStore();
