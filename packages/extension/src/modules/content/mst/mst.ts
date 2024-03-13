import * as libmst from "mobx-state-tree";
import { frontendSender } from "../bridge";
import { ASYNC_MESSAGE } from "types/message/message";
import { LogItem, SummaryLogItem } from "types/mst";

interface RootData {
  logItemsById: Map<number, LogItem>;
  root: object;
  mobxId: string;
  disposeFunc: AnyFuntion[];
  rootId: string;
  name: string;
  mst: typeof libmst;
}

const rootDataById: Map<string, RootData> = new Map();
const patches: libmst.IJsonPatch[] = [];

let id = 0;
let isRecording = true;
let insideUntracked = false;

// TODO remove root data

const summary = (logItem: LogItem): SummaryLogItem => {
  const sum = Object.create(null);
  const { patches } = logItem;
  sum.patches =
    patches &&
    patches.map((patch) => ({
      op: patch.op,
      path: patch.path,
      value: patch.value && typeof patch.value === "object" ? {} : patch.value,
    }));
  sum.id = logItem.id;
  sum.rootId = logItem.rootId;
  sum.timestamp = logItem.timestamp;
  return sum;
};

const addLogItem = (rootId, { snapshot, patches }) => {
  const rootData = rootDataById.get(rootId);
  if (!rootData) return;
  const logItemId = id++;
  const logItem = {
    patches,
    snapshot,
    id: logItemId,
    rootId,
    timestamp: new Date().getTime(),
  };
  rootData.logItemsById.set(logItemId, logItem);
  frontendSender(ASYNC_MESSAGE.ADD_MST_LOG_ITEM, {
    to: "panel",
    request: {
      key: rootId,
      logItem: summary(logItem),
    },
  });
};

export const registerMSTRoot = (
  root: object,
  mst: typeof libmst,
  key: string,
  mobxId: string
) => {
  if (!rootDataById.has(key)) {
    rootDataById.set(key, {
      logItemsById: new Map(),
      root,
      mobxId,
      disposeFunc: [],
      rootId: key,
      name: key,
      mst,
    });
  }
  rootDataById.get(key).disposeFunc = [
    mst.onSnapshot(root, (snapshot) => {
      if (!isRecording && !insideUntracked) {
        return;
      }
      addLogItem(key, { snapshot, patches });
      patches.length = 0;
    }),
    mst.onPatch(root, (patch) => {
      if (!isRecording && !insideUntracked) {
        return;
      }
      patches.push(patch);
    }),
  ];
  mst.addDisposer(root, () => removeRoot(key));
};

const removeRoot = (key: string) => {
  if (rootDataById.has(key)) {
    rootDataById.get(key).disposeFunc.forEach((disposer) => disposer());
    rootDataById.delete(key);
    frontendSender(ASYNC_MESSAGE.REMOVE_MST, {
      to: "panel",
      request: {
        key,
      },
    });
  }
};

export const getMSTLogItem = (key: string, id: number) => {
  const rootData = rootDataById.get(key);
  if (!rootData) return undefined;
  return rootData.logItemsById.get(id);
};

export const getMSTNames = () => {
  return Array.from(rootDataById.keys());
};

export const removeLogItems = (key: string, ids: number[] = []) => {
  const rootData = rootDataById.get(key);
  if (!rootData) return undefined;
  ids.forEach((id) => rootData.logItemsById.delete(id));
};

export const applySnapshot = (key: string, id: number) => {
  const rootData = rootDataById.get(key);
  if (!rootData) return false;
  const logItem = rootData.logItemsById.get(id);
  if (!logItem) {
    return false;
  }
  insideUntracked = true;
  rootData.mst.applySnapshot(rootData.root, logItem.snapshot);
  insideUntracked = false;
  return true;
};

export const updateMSTRecording = (newIsRecording: boolean) => {
  isRecording = newIsRecording;
  if (!isRecording) {
    patches.length = 0;
  }
};

export const unregisterMSTRoot = (key: string) => {
  if (!rootDataById.has(key)) {
    return;
  }
  removeRoot(key);
};
