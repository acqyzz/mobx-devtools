import { action, observable, makeObservable } from "mobx";
import { registerSingleStore } from "mobx-devtools-inspector";

export class MessageStore {
  constructor() {
    makeObservable(this, {
      msgCount: observable,
      isRead: observable,
      messageList: observable,
      msgInfo: observable,
      markRead: action,
    });
  }
  msgCount = 0;

  msgInfo = {
    name: "",
  };

  messageList = [];

  isRead = false;

  markRead = async () => {
    this.isRead = true;
  };
}

export const messageStore = new MessageStore();
registerSingleStore("messageStore", messageStore);
export const messageStore2 = new MessageStore();
registerSingleStore("messageStore2", messageStore2);
