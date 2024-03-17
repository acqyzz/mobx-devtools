import { action, computed, observable } from "mobx";
import { updateState, removeItem, addItem } from "patch-obj";
import { userStore } from "./user";
import { productStore } from "./product";
import { messageStore, messageStore2 } from "./message";

class StateStore {
  @observable
  currentStateName = "user";

  @observable
  allState = {
    user: userStore,
    product: productStore,
    message: messageStore,
    message2: messageStore2,
  };

  @computed
  get curState() {
    if (!this.allState[this.currentStateName]) {
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
    removeItem(curState, path);
  };
  @action
  onAddArrayItem = (data: { value: any; path: string[] }) => {
    addItem(this.curState, data);
  };
}

export const stateStore = new StateStore();
