import { makeAutoObservable } from "mobx";
import { panelRegister } from "panel/bridge";
import { ASYNC_MESSAGE, ASYNC_MESSAGE_TYPE_DATA } from "types/message/message";
import { panelLogger } from "utils/logger";
import { parse } from "utils/serialization";
import { stateStore } from "./state";

type ReceiveData = ASYNC_MESSAGE_TYPE_DATA["SYNC_STATE"]["response"];

const EXPIRED_TIME = 10000;

class SyncStateStore {
  constructor() {
    makeAutoObservable(this);
    chrome.devtools.network.onNavigated.addListener(() => {
      this.clear();
    });
  }
  receivingState: ReceiveData[] = [];
  clear = () => {
    this.receivingState = [];
  };

  checkCompletedState = () => {
    const stateMap: Record<string, ReceiveData[]> = {};
    this.receivingState.some((item) => {
      if (!stateMap[item.uid]) {
        stateMap[item.uid] = [];
      }
      const toCheckArr = stateMap[item.uid];
      toCheckArr.push(item);
      const total = toCheckArr[0].total;
      const checkedArr = new Array(total).fill(false);
      toCheckArr.forEach((item) => {
        checkedArr[item.index] = true;
      });
      if (checkedArr.every((item) => item)) {
        panelLogger.debug`receive completed state ${item.uid}`;
        // find completed state, sync to originState
        const wholeState = toCheckArr.reduce((sum, item) => {
          return [...sum, ...item.state];
        }, []);
        const state = parse(wholeState);
        stateStore.setOriginState(state);
        // clean expired receiving state
        const now = +new Date();
        this.receivingState = this.receivingState.filter((fragment) => {
          if (
            fragment.uid === item.uid ||
            (fragment.uid < item.uid && fragment.startTime < now - EXPIRED_TIME)
          ) {
            return false;
          }
          return true;
        });
        return true;
      }
      return false;
    });
    stateStore.ensureCurrentStateName();
  };
}

export const syncStateStore = new SyncStateStore();
