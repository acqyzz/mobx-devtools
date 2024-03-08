import { action, computed, observable } from "mobx";
import {
  updateState,
  addArrayItem,
  removeArrayItem,
} from "../../../../packages/extension/src/utils/patch";
import { userStore } from "./user";
import { productStore } from "./product";
import { messageStore, messageStore2 } from "./message";

class StateStore {
  @observable
  currentStateName = "message";

  @observable
  allState = {
    user: userStore,
    product: productStore,
    message: messageStore,
    message2: messageStore2,
  };

  @computed
  get curState() {
    if (this.allState[this.currentStateName]) {
      return null;
    }
    return this.allState[this.currentStateName];
  }

  @action
  updateCurrentState = (name: string) => {
    if (name in this.allState) {
      this.currentStateName = name;
      return;
    }
    console.warn("updateCurrentState, unknown state name", name);
  };

  @computed
  get stateNames() {
    return Object.keys(this.allState);
  }

  @action
  updateState = (data: { value: any; path: string[] }) => {
    const curState = this.allState[this.currentStateName];
    updateState(curState, data);
  };
  @action
  onRemoveArrayItem = (path: string[]) => {
    const curState = this.allState[this.currentStateName];
    removeArrayItem(curState, path);
  };
  @action
  onAddArrayItem = (data: { value: any; path: string[] }) => {
    addArrayItem(this.curState, data);
  };
}

export const stateStore = new StateStore();
