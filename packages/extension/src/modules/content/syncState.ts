import { frontendSender } from "./bridge";
import { ASYNC_MESSAGE } from "types/message/message";
import { delay } from "utils/common";
import { frontendLogger } from "utils/logger";
import { stringify } from "utils/serialization";

const SYNC_MESSAGE_LENGTH = 25000;
const DELAY_DURATION = 10;

const queue: {
  state: number[];
  uid: number;
}[] = [];
let uid = 1;
let syncRunning = false;

const BeginSync = async () => {
  if (syncRunning) {
    return;
  }
  syncRunning = true;
  while (queue.length) {
    const first = queue.shift();
    const { uid, state } = first;
    const totalFragment = Math.ceil(state.length / SYNC_MESSAGE_LENGTH);
    const startTime = +new Date();
    frontendLogger.debug`[BeginSync] sync state ${uid}, state length ${state.length}, total fragment ${totalFragment}`;
    for (let i = 0; i < state.length; i += SYNC_MESSAGE_LENGTH) {
      frontendSender(ASYNC_MESSAGE.SYNC_STATE, {
        to: "panel",
        request: {
          uid,
          state: state.slice(i, i + SYNC_MESSAGE_LENGTH),
          total: totalFragment,
          index: i / SYNC_MESSAGE_LENGTH,
          startTime,
        },
      });
      // TODO requestIdleCallback
      await delay(DELAY_DURATION);
    }
  }
  syncRunning = false;
};

export const handleSyncState = (state: AnyObject) => {
  frontendLogger.debug`[handleSyncState] sync state`;
  queue.push({
    state: stringify(state),
    uid,
  });
  uid++;
  BeginSync();
};
