import { action, observable } from "mobx";

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
export const messageStore2 = new MessageStore();
