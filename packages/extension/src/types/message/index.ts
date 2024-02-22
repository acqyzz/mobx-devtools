import { LIFE_CYCLE, LIFE_CYCLE_TYPE_DATA } from "./lifecycle";
import { ASYNC_MESSAGE, ASYNC_MESSAGE_TYPE_DATA } from "./message";

export const MESSAGE_TYPE = {
  ...ASYNC_MESSAGE,
  ...LIFE_CYCLE,
} as const;
export const MOBX_DEVTOOL_MESSAGE_TAG = "mobx-devtool-message" as const;

export type MESSAGE_TYPE_DATA = ASYNC_MESSAGE_TYPE_DATA & LIFE_CYCLE_TYPE_DATA;
export type MESSAGE_TYPE_DATA_KEYS = keyof MESSAGE_TYPE_DATA;

export type EMIT_MESSAGE_TYPE_DATA = {
  [x in keyof MESSAGE_TYPE_DATA]: Omit<
    MESSAGE_TYPE_DATA[x],
    "from" | "type" | "tag" | "contextType"
  >;
} & {
  [x in keyof ASYNC_MESSAGE_TYPE_DATA]: Omit<
    ASYNC_MESSAGE_TYPE_DATA[x],
    "from" | "type" | "tag" | "contextType"
  >;
};

export type MESSAGE_TERMINAL = "frontend" | "proxy" | "background" | "panel";

export enum CONTEXT_TYPE {
  REQUEST = "REQUEST",
  RESPONSE = "RESPONSE",
}

export interface MESSAGE<T = any, U = any> {
  messageId?: string;
  tag: typeof MOBX_DEVTOOL_MESSAGE_TAG;
  from: MESSAGE_TERMINAL;
  to: MESSAGE_TERMINAL;
  type: ASYNC_MESSAGE | LIFE_CYCLE;
  contextType?: keyof typeof CONTEXT_TYPE;
  request?: T;
  response?: U;
}

export type WithType<T> = {
  [x in keyof T]: T[x] & { type: x };
};

export type RequestMessage<T extends MESSAGE_TYPE_DATA_KEYS> = Omit<
  EMIT_MESSAGE_TYPE_DATA[T],
  "response"
>;

export type ResponseMessage<T extends MESSAGE_TYPE_DATA_KEYS> = Omit<
  MESSAGE_TYPE_DATA[T],
  "request"
>;

export type ReceiverHandler<T extends MESSAGE_TYPE_DATA_KEYS> = (
  event: RequestMessage<T>
) =>
  | MESSAGE_TYPE_DATA[T]["response"]
  | Promise<MESSAGE_TYPE_DATA[T]["response"]>;
