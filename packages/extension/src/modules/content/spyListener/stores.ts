import type { PureSpyEvent } from "mobx/dist/internal";
import { frontendLogger } from "utils/logger";
import { judgeStateChange } from "./storeCollection";
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
        frontendSender(ASYNC_MESSAGE.REPORT_STORES_CHANGED, {
          to: "panel",
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
      handleSyncState();
    }
  });
};
