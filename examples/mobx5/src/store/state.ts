import { action, computed, observable } from "mobx";
import {
  updateState,
  addArrayItem,
  removeArrayItem,
} from "../../../../packages/extension/src/utils/patch";

class StateStore {
  @observable
  currentStateName = "message$";

  @computed
  get curState() {
    if (
      !window.__MOBX_DEVTOOL_STORES__ ||
      !window.__MOBX_DEVTOOL_STORES__[this.currentStateName]
    ) {
      return null;
    }
    return window.__MOBX_DEVTOOL_STORES__[this.currentStateName];
  }

  @computed
  get stateNames() {
    if (!window.__MOBX_DEVTOOL_STORES__) {
      return [];
    }
    return Object.keys(window.__MOBX_DEVTOOL_STORES__);
  }

  @action
  updateCurrentState = (name: string) => {
    if (name in window.__MOBX_DEVTOOL_STORES__) {
      this.currentStateName = name;
      return;
    }
    console.warn("updateCurrentState, unknown state name", name);
  };

  @action
  updateState = (data: { value: any; path: string[] }) => {
    const curState = window.__MOBX_DEVTOOL_STORES__[this.currentStateName];
    updateState(curState, data);
  };
  @action
  onRemoveArrayItem = (path: string[]) => {
    const curState = window.__MOBX_DEVTOOL_STORES__[this.currentStateName];
    removeArrayItem(curState, path);
  };
  @action
  onAddArrayItem = (data: { value: any; path: string[] }) => {
    addArrayItem(this.curState, data);
  };
}

export const stateStore = new StateStore();
