import type * as libmst from "mobx-state-tree";
import { frontendSender } from "../bridge";
import { ASYNC_MESSAGE } from "types/message/message";
import { LogItem, SummaryLogItem } from "types/mst";

const rootDataById: Map<string, Map<number, LogItem>> = new Map();
const patches: libmst.IJsonPatch[] = [];

const disposerMap = new Map<string, AnyFuntion[]>();

let id = 0;

// TODO 1. stop tracking, 2. gc

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
  rootData.set(logItemId, logItem);
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
  key: string
) => {
  if (!disposerMap.has(key)) {
    disposerMap.set(key, []);
  }
  const disposers = [
    mst.onSnapshot(root, (snapshot) => {
      console.log("onSnapshot", snapshot);
      addLogItem(key, { snapshot, patches });
      patches.length = 0;
    }),
    mst.onPatch(root, (patch) => {
      patches.push(patch);
    }),
  ];
  disposerMap.get(key).push(...disposers);
  rootDataById.set(key, new Map());
};

export const getMSTLogItem = (key: string, id: number) => {
  const rootData = rootDataById.get(key);
  if (!rootData) return undefined;
  return rootData.get(id);
};

export const getMSTNames = () => {
  return Array.from(rootDataById.keys());
};

export const unregisterMSTRoot = (key: string) => {
  if (!disposerMap.has(key)) {
    return;
  }
  disposerMap.get(key).forEach((disposer) => disposer());
};
