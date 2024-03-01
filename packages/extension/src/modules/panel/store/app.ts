import { action, makeAutoObservable } from "mobx";
import { CheckerStatus, onDebugStatusChange } from "panel/checker";
import { panelLogger } from "utils/logger";
import { stateStore } from "./state";

export enum ACTIVE_KEY {
  STATE_TREE = "STATE_TREE",
  CHANGES = "CHANGES",
}

class AppStore {
  constructor() {
    makeAutoObservable(this);
    onDebugStatusChange(
      action((status: CheckerStatus) => {
        this.debugStatus = status;
      })
    );
    panelLogger.info`AppStore init by debugStatus: ${this.debugStatus}`;
  }
  waitingForDebug = false;
  debugStatus: CheckerStatus = {
    reportStatus: "nagetive",
  };
  get isInDebug() {
    return this.debugStatus.reportStatus === "active";
  }
  curActiveKey = ACTIVE_KEY.STATE_TREE;
  updateActiveKey = (key: ACTIVE_KEY) => {
    this.curActiveKey = key;
  };
  updateDebugStatus = (status: CheckerStatus) => {
    this.debugStatus = status;
  };
  updateWaitingForDebug = (waiting: boolean) => {
    this.waitingForDebug = waiting;
  };
}

export const appStore = new AppStore();
