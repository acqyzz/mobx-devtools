import { makeAutoObservable } from "mobx";
import { updateState, removeItem, addItem } from "patch-obj";
import { userStore } from "./user";
import { productStore } from "./product";
import { messageStore, messageStore2 } from "./message";

class StateStore {
  constructor() {
    makeAutoObservable(this);
  }

  allState = {
    user: userStore,
    product: productStore,
    message: messageStore,
    message2: messageStore2,
  };

  currentStateName = "user";

  get curState() {
    return this.allState[this.currentStateName];
  }

  get stateNames() {
    return Object.keys(this.allState);
  }

  updateCurrentState = (name: string) => {
    if (name in this.allState) {
      this.currentStateName = name;
      return;
    }
    console.warn("updateCurrentState, unknown state name", name);
  };

  updateState = (data: { value: any; path: string[] }) => {
    const curState = this.allState[this.currentStateName];
    updateState(curState, data);
  };
  onRemoveArrayItem = (path: string[]) => {
    const curState = this.allState[this.currentStateName];
    removeItem(curState, path);
  };
  onAddArrayItem = (data: { value: any; path: string[] }) => {
    addItem(this.curState, data);
  };
}

export const stateStore = new StateStore();
