import { makeAutoObservable } from "mobx";
// import {
//   // updateState,
//   addArrayItem,
//   removeArrayItem,
// } from "../../../../packages/extension/src/utils/patch";
import { updateState, removeItem, addItem } from "patch-obj";

class StateStore {
  constructor() {
    makeAutoObservable(this);
  }

  currentStateName = "message$";

  get curState() {
    if (
      !window.__MOBX_DEVTOOL_STORES__ ||
      !window.__MOBX_DEVTOOL_STORES__[this.currentStateName]
    ) {
      return null;
    }
    return window.__MOBX_DEVTOOL_STORES__[this.currentStateName];
  }

  get stateNames() {
    if (!window.__MOBX_DEVTOOL_STORES__) {
      return [];
    }
    return Object.keys(window.__MOBX_DEVTOOL_STORES__);
  }

  updateCurrentState = (name: string) => {
    if (name in window.__MOBX_DEVTOOL_STORES__) {
      this.currentStateName = name;
      return;
    }
    console.warn("updateCurrentState, unknown state name", name);
  };

  updateState = (data: { value: any; path: string[] }) => {
    const curState = window.__MOBX_DEVTOOL_STORES__[this.currentStateName];
    updateState(curState, data);
  };
  onRemoveArrayItem = (path: string[]) => {
    const curState = window.__MOBX_DEVTOOL_STORES__[this.currentStateName];
    removeItem(curState, path);
  };
  onAddArrayItem = (data: { value: any; path: string[] }) => {
    addItem(this.curState, data);
  };
}

export const stateStore = new StateStore();
