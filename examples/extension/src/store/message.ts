import { action, observable, makeObservable } from "mobx";
import { registerSingleStore } from "mobx-devtool-register";

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

export const message$ = new MessageStore();
registerSingleStore("message$", message$);
export const message2$ = new MessageStore();
registerSingleStore("message2$", message2$);
