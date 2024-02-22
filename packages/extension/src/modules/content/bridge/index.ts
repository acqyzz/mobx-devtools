import mitt from "mitt";
import {
  EMIT_MESSAGE_TYPE_DATA,
  MESSAGE,
  MESSAGE_TYPE,
  MESSAGE_TYPE_DATA,
  MOBX_DEVTOOL_MESSAGE_TAG,
} from "types/message";
import { stringify } from "utils/serialization";
import { ASYNC_MESSAGE } from "types/message/message";
import { frontendLogger } from "utils/logger";
import {
  createMessageHandlerWithContext,
  judgeIsMobxDevtoolMessage,
} from "utils/message";

export const receiver = mitt<MESSAGE_TYPE_DATA>();
export const sender = mitt<EMIT_MESSAGE_TYPE_DATA>();

export const initBridge = () => {
  const msgHandler = (event: MessageEvent<MESSAGE>) => {
    if (
      event.data.from === "frontend" ||
      !judgeIsMobxDevtoolMessage(event.data)
    ) {
      return;
    }
    if (event.source !== window || !event.data) {
      frontendLogger.warn`invalid message ${event}`;
      return;
    }
    frontendLogger.debug`receive message ${event.data.type} from ${event.data.from} response ${event.data.response}  request ${event.data.request}`;
    const { data: msg } = event;
    receiver.emit(msg.type, msg);
  };
  window.addEventListener("message", msgHandler);

  for (const key in MESSAGE_TYPE) {
    sender.on(MESSAGE_TYPE[key], (message: Omit<MESSAGE, "from" | "type">) => {
      if (MESSAGE_TYPE[key] !== ASYNC_MESSAGE.REPORT_CHANGES) {
        frontendLogger.debug`send message ${MESSAGE_TYPE[key]} to ${message?.to} data ${message?.request}`;
      }
      window.postMessage(
        {
          type: MESSAGE_TYPE[key],
          from: "frontend",
          tag: MOBX_DEVTOOL_MESSAGE_TAG,
          ...message,
          request: message?.request
            ? stringify(message?.request)
            : message?.request,
        },
        "*"
      );
    });
  }

  return () => {
    window.removeEventListener("message", msgHandler);
  };
};

export const { register: frontendRegister, sender: frontendSender } =
  createMessageHandlerWithContext(sender, receiver, frontendLogger);
