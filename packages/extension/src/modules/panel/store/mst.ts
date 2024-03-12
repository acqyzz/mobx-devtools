import { makeAutoObservable } from "mobx";
import { panelSender } from "panel/bridge";
import { ASYNC_MESSAGE } from "types/message/message";
import { SummaryLogItem } from "types/mst";

interface StoreRecord {
  logItems: SummaryLogItem[];
  currentSnapshot?: object;
  activeLogItemId: number;
}

const createStore = (): StoreRecord => {
  return {
    logItems: [],
    currentSnapshot: undefined,
    activeLogItemId: -1,
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

  createStore = (key: string) => {
    this.stores = { [key]: createStore(), ...this.stores };
    this.ensureCurrentStateName();
  };

  addLogItem = (key: string, logItem: any) => {
    const store = this.stores[key];
    if (!store) return;
    store.logItems = [...store.logItems, logItem];
  };

  ensureCurrentStateName = () => {
    if (!this.currentStoreKey) {
      this.currentStoreKey = Object.keys(this.stores)[0] || "";
    }
  };

  activateLogItem = async (logItemId: number) => {
    const store = this.stores[this.currentStoreKey];
    if (!store) return;
    store.activeLogItemId = logItemId;
    const result = await panelSender(ASYNC_MESSAGE.GET_MST_SNAPSHOT, {
      to: "frontend",
      request: {
        key: this.currentStoreKey,
        logItemId: logItemId,
      },
    });
    const { snapshot = {} } = result.response || {};
    store.currentSnapshot = snapshot;
  };
}

export const mstStore = new MSTStore();
