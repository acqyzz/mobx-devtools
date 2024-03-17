import { action, observable } from "mobx";
import { registerSingleStore } from "mobx-devtools-inspector";

class MessageStore {
  constructor() {}
  @observable
  msgCount = 0;

  @observable
  msgInfo = {
    name: "",
  };

  @observable
  messageList = [];

  @observable
  isRead = false;

  @action
  markRead = async () => {
    this.isRead = true;
  };
}

export const messageStore = new MessageStore();
registerSingleStore("messageStore", messageStore);
export const messageStore2 = new MessageStore();
registerSingleStore("messageStore2", messageStore2);
