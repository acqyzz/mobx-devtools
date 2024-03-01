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

export const message$ = new MessageStore();
export const message2$ = new MessageStore();
