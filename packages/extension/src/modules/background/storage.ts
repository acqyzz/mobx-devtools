import { MESSAGE, MESSAGE_TERMINAL, MOBX_DEVTOOL_MESSAGE_TAG } from "types";
import { ASYNC_MESSAGE, ASYNC_MESSAGE_TYPE_DATA } from "types/message/message";
import { bgLogger } from "utils/logger";
import { stringify } from "utils/serialization";
import { nativeStorageGet, nativeStorageSet } from "utils/storage";

const STORAGE_KEY = "_MOBX_DEVTOOL_STORAGE_KEY";

const initLocalData = {
  changeFilterSetting: {
    action: true,
    add: true,
    splice: true,
    "scheduled-reaction": true,
    reaction: true,
    error: true,
    update: true,
    remove: true,
    delete: true,
    create: true,
    "report-end": true,
  },
};

export const storageSet = (items: { [key: string]: any }) => {
  return new Promise((resolve) => {
    nativeStorageGet(STORAGE_KEY, (data) => {
      if (!data) {
        bgLogger.warn`[storageSet] no STORAGE data`;
        return;
      }
      nativeStorageSet(
        {
          [STORAGE_KEY]: {
            ...(data[STORAGE_KEY] || {}),
            ...items,
          },
        },
        () => {
          resolve(true);
        }
      );
    });
  });
};

export const storageGet = (key?: string) => {
  return new Promise((resolve) => {
    nativeStorageGet(STORAGE_KEY, (data) => {
      if (!data) {
        resolve(null);
      }
      resolve(key ? data[STORAGE_KEY][key] : data[STORAGE_KEY]);
    });
  });
};

export const initStorage = () => {
  return new Promise((resolve) => {
    nativeStorageGet(STORAGE_KEY, (data) => {
      if (!data) {
        nativeStorageSet(
          {
            [STORAGE_KEY]: initLocalData,
          },
          () => {
            resolve(initLocalData);
            bgLogger.info`no local data, init initStorage ${initLocalData}`;
          }
        );
      } else {
        resolve(data);
        bgLogger.info`initStorage complete with local data ${data}`;
      }
    });
  });
};

export const syncDataWithPort = async (
  port: chrome.runtime.Port,
  type: MESSAGE_TERMINAL
) => {
  const handler = async (msg: MESSAGE) => {
    if (msg.to !== "background") {
      return;
    }
    switch (msg.type) {
      case ASYNC_MESSAGE.PUT_LOCAL_DATA:
        bgLogger.debug`store local data ${msg.request}`;
        const { request: dataToSet } =
          msg as ASYNC_MESSAGE_TYPE_DATA[ASYNC_MESSAGE.PUT_LOCAL_DATA];
        storageSet({
          [dataToSet.key]: dataToSet.value,
        });
        return;
      case ASYNC_MESSAGE.GET_LOCAL_DATA:
        const localData = await storageGet();
        port.postMessage({
          messageId: msg.messageId,
          type: ASYNC_MESSAGE.GET_LOCAL_DATA,
          response: stringify(localData),
          to: type,
          from: "background",
          contextType: "RESPONSE",
          tag: MOBX_DEVTOOL_MESSAGE_TAG,
        });
        return;
      default:
        return;
    }
  };
  port.onMessage.addListener(handler);
  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(handler);
  });
};
