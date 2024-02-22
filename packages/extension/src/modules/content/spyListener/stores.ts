import type { PureSpyEvent } from "mobx/dist/internal";
import { frontendLogger } from "utils/logger";
import {
  ShouldSyncPureSpyEvent,
  addSubStoreName,
  deleteSubStoreName,
  getMobxStoreInfo,
  judgeStateChange,
  subStoreNamesMap,
} from "./storeCollection";
import { getKeyByMobxStoreName, getMobxStoreNameByKey } from "utils/mobx";
import { frontendSender } from "../bridge";
import { ASYNC_MESSAGE } from "types/message/message";

const changedStores = new Set<string>();

let scheduled = false;

const handleSyncState = () => {
  if (scheduled) {
    return;
  }
  scheduled = true;
  requestIdleCallback(
    () => {
      try {
        // const changedStoresWithSubStore = Array.from(changedStores).reduce(
        //   (sum, item) => {
        //     sum.add(item);
        //     const subStoreName = getMobxStoreNameByKey(item);
        //     if (subStoreNamesMap.get(subStoreName)) {
        //       Array.from(subStoreNamesMap.get(subStoreName)).forEach(
        //         (storeName) => {
        //           sum.add(storeName);
        //         }
        //       );
        //     }
        //     return sum;
        //   },
        //   new Set<string>()
        // );
        frontendSender(ASYNC_MESSAGE.REPORT_STORES_CHANGED, {
          to: "panel",
          // request: { keys: Array.from(changedStoresWithSubStore) },
          request: { keys: [] },
        });
        changedStores.clear();
      } catch (error) {
        frontendLogger.warn`sync state error ${error}`;
      }
      scheduled = false;
    },
    {
      timeout: 1000,
    }
  );
};

export const createStoresListener = (mobx) => {
  mobx.spy((report: PureSpyEvent) => {
    const shouldSyncDevtool = judgeStateChange(report);
    if (shouldSyncDevtool) {
      // sync mobx state to devtool panel
      // const key = getKeyByMobxStoreName(report.debugObjectName.split(".")[0]);
      // updateSubStoreNamesMap(report, key);
      // if (key) {
      //   changedStores.add(key);
      // }
      handleSyncState();
    }
  });
};

// const updateSubStoreNamesMap = (
//   report: ShouldSyncPureSpyEvent,
//   parentStoreName: string
// ) => {
//   if (!parentStoreName) {
//     return;
//   }
//   const type = report.type;
//   switch (type) {
//     case "add":
//     case "create":
//     case "update":
//       const newValue = report.newValue;
//       const mobxStoreInfo = getMobxStoreInfo(newValue);
//       if (mobxStoreInfo) {
//         addSubStoreName(parentStoreName, mobxStoreInfo.name_);
//       }
//       break;
//     case "splice":
//       report.added.forEach((item) => {
//         const mobxStoreInfo = getMobxStoreInfo(item);
//         if (mobxStoreInfo) {
//           addSubStoreName(parentStoreName, mobxStoreInfo.name_);
//         }
//       });
//   }
//   switch (type) {
//     case "update":
//     case "remove":
//     case "delete":
//       const oldValue = report.oldValue;
//       const mobxStoreInfo = getMobxStoreInfo(oldValue);
//       if (mobxStoreInfo) {
//         deleteSubStoreName(parentStoreName, mobxStoreInfo.name_);
//       }
//       break;
//     case "splice":
//       report.removed.forEach((item) => {
//         const mobxStoreInfo = getMobxStoreInfo(item);
//         if (mobxStoreInfo) {
//           deleteSubStoreName(parentStoreName, mobxStoreInfo.name_);
//         }
//       });
//   }
// };
