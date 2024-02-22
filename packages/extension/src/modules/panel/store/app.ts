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
        // this.updateValidActiveKey();
      })
    );
    panelLogger.info`AppStore init by debugStatus: ${this.debugStatus}`;
  }
  waitingForDebug = false;
  debugStatus: CheckerStatus = {
    reportStatus: "nagetive",
    stateStatus: "nagetive",
  };
  get isStateTreeDisabled() {
    const { stateItems } = stateStore;
    return !this.debugStatus.stateStatus || !stateItems.length;
  }
  get isInDebug() {
    return (
      this.debugStatus.reportStatus === "active" ||
      this.debugStatus.stateStatus === "active"
    );
  }
  curActiveKey = ACTIVE_KEY.STATE_TREE;
  // updateValidActiveKey = () => {
  //   if (this.isStateTreeDisabled) {
  //     if (this.debugStatus.reportStatus === "active") {
  //       this.updateActiveKey(ACTIVE_KEY.CHANGES);
  //     } else {
  //       // both disabled
  //       this.updateActiveKey(null);
  //     }
  //   } else {
  //     this.updateActiveKey(ACTIVE_KEY.STATE_TREE);
  //   }
  // };
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
