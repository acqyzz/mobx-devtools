import {
  MESSAGE_TYPE,
  MESSAGE,
  MESSAGE_TYPE_DATA,
  EMIT_MESSAGE_TYPE_DATA,
  MOBX_DEVTOOL_MESSAGE_TAG,
  CONTEXT_TYPE,
} from "types/message";
import mitt from "mitt";
import { parse } from "utils/serialization";
import { panelLogger } from "utils/logger";
import { LIFE_CYCLE } from "types/message/lifecycle";
import { ASYNC_MESSAGE } from "types/message/message";
import { createMessageHandlerWithContext } from "utils/message";

const receiver = mitt<MESSAGE_TYPE_DATA>();
const sender = mitt<EMIT_MESSAGE_TYPE_DATA>();

let backgroundPageConnection: chrome.runtime.Port;

const bindSenderEvent = () => {
  const handlerMap = {};
  for (const key in MESSAGE_TYPE) {
    const handler = (message: Omit<MESSAGE, "from" | "type" | "tag">) => {
      panelLogger.debug`send message ${MESSAGE_TYPE[key]} to ${message.to}`;
      backgroundPageConnection.postMessage({
        type: MESSAGE_TYPE[key],
        from: "panel",
        contextType: CONTEXT_TYPE.REQUEST,
        ...message,
        tag: MOBX_DEVTOOL_MESSAGE_TAG,
      });
    };
    sender.on(MESSAGE_TYPE[key], handler);
    handlerMap[MESSAGE_TYPE[key]] = handler;
  }
  return function unbindSenderEvent() {
    for (const key in MESSAGE_TYPE) {
      sender.off(MESSAGE_TYPE[key], handlerMap[MESSAGE_TYPE[key]]);
    }
  };
};

export const initBridge = () => {
  panelLogger.debug`create devtools page connect`;
  backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page",
  });

  backgroundPageConnection.postMessage({
    type: LIFE_CYCLE.REGISTER_DEVTOOL,
    from: "panel",
    tag: MOBX_DEVTOOL_MESSAGE_TAG,
    request: {
      tabId: chrome.devtools.inspectedWindow.tabId,
    },
  });

  const msgHandler = (message: MESSAGE) => {
    if (message.type !== ASYNC_MESSAGE.REPORT_CHANGES) {
      panelLogger.debug`receiver message ${message.type} from ${message?.from} response ${message?.response} request ${message?.request}`;
    }
    const { type, response } = message;
    receiver.emit(type, {
      ...message,
      contextType: "RESPONSE",
      response: response ? parse(response) : response,
    });
  };
  const unbind = bindSenderEvent();

  backgroundPageConnection.onMessage.addListener(msgHandler);

  backgroundPageConnection.onDisconnect.addListener(() => {
    backgroundPageConnection.onMessage.removeListener(msgHandler);
    unbind();
    backgroundPageConnection = null;
    initBridge();
  });
};

initBridge();
export const { register: panelRegister, sender: panelSender } =
  createMessageHandlerWithContext(sender, receiver, panelLogger);
