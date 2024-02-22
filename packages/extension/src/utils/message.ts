import { v4 } from "uuid";
import type { Emitter } from "mitt";
import {
  EMIT_MESSAGE_TYPE_DATA,
  MESSAGE,
  MESSAGE_TYPE_DATA,
  MESSAGE_TYPE_DATA_KEYS,
  MOBX_DEVTOOL_MESSAGE_TAG,
  RequestMessage,
  ResponseMessage,
  ReceiverHandler,
} from "types";
import { LoggerClass } from "./logger";
import { parse } from "./serialization";

export const judgeIsMobxDevtoolMessage = (message: MESSAGE) => {
  if (!message) {
    return false;
  }
  return message.tag === MOBX_DEVTOOL_MESSAGE_TAG;
};

type MessageQueueItem<
  T extends MESSAGE_TYPE_DATA_KEYS = MESSAGE_TYPE_DATA_KEYS
> = {
  messageId: string;
  type: T;
  requestMessage: RequestMessage<T>;
  holder: {
    resolve: (...args: any[]) => void;
    reject: (...args: any[]) => void;
  };
};
class MessageCollector {
  queue: MessageQueueItem[] = [];
  push(message: MessageQueueItem) {
    this.queue.push(message);
    // TODO timeout
  }
  resolveTask(messageId: string, event) {
    const task = this.find(messageId);
    if (task) {
      task.holder.resolve(event);
      return true;
    }
    return false;
  }
  find(messageId: string) {
    return this.queue.find((item) => item.messageId === messageId);
  }
}

export const createMessageHandlerWithContext = (
  originSender: Emitter<EMIT_MESSAGE_TYPE_DATA>,
  originReceiver: Emitter<MESSAGE_TYPE_DATA>,
  logger: LoggerClass
) => {
  const messageCollector = new MessageCollector();
  const sender = async <T extends MESSAGE_TYPE_DATA_KEYS>(
    type: T,
    requestMessage: RequestMessage<T>
  ): Promise<ResponseMessage<T>> => {
    const messageId = v4();
    const holder = new Promise<ResponseMessage<T>>((resolve, reject) => {
      messageCollector.push({
        messageId,
        type,
        requestMessage,
        holder: {
          resolve,
          reject,
        },
      });
    });
    originSender.emit(type, { messageId, ...requestMessage });
    return await holder;
  };
  const receiverHandler: {
    [key in MESSAGE_TYPE_DATA_KEYS]?: ReceiverHandler<key>;
  } = {};
  originReceiver.on(
    "*",
    async <T extends MESSAGE_TYPE_DATA_KEYS>(
      type: T,
      event: RequestMessage<T> & ResponseMessage<T>
    ) => {
      const { messageId, response } = event;
      if (receiverHandler[type] && !response) {
        // request from other terminal
        const result = await receiverHandler[type]?.(event);
        originSender.emit(type, {
          ...event,
          from: event.to,
          to: event.from,
          response: result,
          request: undefined,
          contextType: "RESPONSE",
        });
        return;
      }
      if (response && messageId) {
        // response from other terminal
        const success = messageCollector.resolveTask(messageId, {
          ...event,
          response: parse(response),
        });
        if (!success) {
          logger.warn`unfound sendedMessage for ${type}`;
        }
      }
    }
  );

  return {
    register<T extends MESSAGE_TYPE_DATA_KEYS>(
      type: T,
      fn: ReceiverHandler<T>
    ) {
      if (receiverHandler[type]) {
        logger.warn`already register same receiver handler for ${type}`;
        return;
      }
      receiverHandler[type] = fn as ReceiverHandler<MESSAGE_TYPE_DATA_KEYS>;
    },
    sender,
  };
};
