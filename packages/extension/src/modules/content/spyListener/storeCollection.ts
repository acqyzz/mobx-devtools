import type { PureSpyEvent } from "mobx/dist/internal";
import { traverseObj } from "utils/common";
import { getAllMobxSymbols } from "utils/mobx";

type SyncWhiteListType =
  | "add"
  | "create"
  | "delete"
  | "remove"
  | "update"
  | "splice";

type TShouldSyncPureSpyEvent<
  T extends {
    type: string;
  }
> = T extends {
  type: infer R;
}
  ? R extends SyncWhiteListType
    ? T
    : never
  : never;

export type ShouldSyncPureSpyEvent = TShouldSyncPureSpyEvent<PureSpyEvent>;

export const getSpyDebugStoreName = (spy: ShouldSyncPureSpyEvent) => {
  if (!judgeStateChange(spy)) {
    return "";
  }
  return spy.debugObjectName.split(".")[0] || "";
};

const whiteList: Record<SyncWhiteListType, boolean> = {
  add: true,
  create: true,
  delete: true,
  remove: true,
  update: true,
  splice: true,
};

export const judgeStateChange = (
  spy: PureSpyEvent
): spy is ShouldSyncPureSpyEvent => {
  return whiteList[spy.type];
};

export const getMobxStoreInfo = (obj: any) => {
  const symbols = getAllMobxSymbols();
  let result;
  symbols.some((symbolKey) => {
    if (
      obj[symbolKey] &&
      obj[symbolKey].constructor.name === "ObservableObjectAdministration" &&
      obj[symbolKey].name_.split(".").length === 1
    ) {
      result = obj[symbolKey];
      return true;
    }
    return false;
  });
  return result;
};

export const subStoreNamesMap = new Map<string, Set<string>>();

export const findSubStoreName = (storeName: string, obj: object) => {
  // find the names of all child stores in a mobx store
  traverseObj(
    obj,
    (property) => {
      const mobxInfo = getMobxStoreInfo(property);
      if (!mobxInfo) {
        return;
      }
      const name = mobxInfo.name_;
      if (!subStoreNamesMap.get(name)) {
        subStoreNamesMap.set(name, new Set([storeName]));
      } else {
        subStoreNamesMap.get(name).add(storeName);
      }
    },
    true,
    // TODO as options
    5
  );
};

export const addSubStoreName = (storeName: string, subStoreName: string) => {
  const store = subStoreNamesMap.get(subStoreName);
  if (!store) {
    subStoreNamesMap.set(subStoreName, new Set([storeName]));
    return;
  }
  store.add(storeName);
};

export const deleteSubStoreName = (storeName: string, subStoreName: string) => {
  const store = subStoreNamesMap.get(subStoreName);
  if (!store) {
    return;
  }
  store.delete(storeName);
  if (store.size === 0) {
    subStoreNamesMap.delete(subStoreName);
  }
};

export const deleteSubStore = (storeName: string) => {
  const iterator = subStoreNamesMap.keys();
  while (true) {
    const cur = iterator.next();
    if (cur.done) {
      break;
    }
    const set = subStoreNamesMap.get(cur.value);
    if (set.has(storeName)) {
      set.delete(storeName);
      if (set.size === 0) {
        subStoreNamesMap.delete(cur.value);
      }
    }
  }
};
