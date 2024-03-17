import { DataNode } from "patch-obj/dist/types";
import { Change } from "types/change";
import { MESSAGE } from "types/message";
import { SummaryLogItem } from "types/mst";
import { StorageData } from "types/storage";

export enum ASYNC_MESSAGE {
  /** sync an entire mobx instance  */
  SYNC_STATE = "SYNC_STATE",

  /**
   * -------- api provided by frontend --------
   * */
  /** get all stores keys */
  GET_ALL_STORES_KEYS = "GET_ALL_STORES_KEYS",
  /** patch a mobx single value  */
  PATCH_STATE_FROM_FRONTEND = "PATCH_STATE_FROM_FRONTEND",
  /** get data by path */
  GET_DATA_BY_PATH = "GET_DATA_BY_PATH",
  /** get tree data by paths */
  GET_TREE_DATA_BY_PATHS = "GET_TREE_DATA_BY_PATHS",
  /** create an array or set item */
  CREATE_STATE_FROM_FRONTEND = "CREATE_STATE_FROM_FRONTEND",
  /** remove an array or set item */
  REMOVE_STATE_FROM_FRONTEND = "REMOVE_STATE_FROM_FRONTEND",

  /** get all mst store key */
  GET_ALL_MST_KEYS = "GET_ALL_MST_KEYS",
  /** get mst store snapshot by log item id */
  GET_MST_SNAPSHOT = "GET_MST_SNAPSHOT",
  /** update log recording */
  PUT_LOG_RECORDING = "PUT_LOG_RECORDING",
  /** remove deprecated log  */
  REMOVE_DEPRECATED_LOGS = "REMOVE_DEPRECATED_LOGS",
  /** apply snapshot */
  APPLY_SNAPSHOT = "APPLY_SNAPSHOT",

  /**
   * -------- api provided by panel --------
   * */
  /** remove single store  */
  CREATE_STORE = "CREATE_STORE",
  /** remove single store  */
  REMOVE_STORE = "REMOVE_STORE",

  /** patch a mobx single value  */
  PATCH_STATE_FROM_PANEL = "PATCH_STATE_FROM_PANEL",
  /** create an array or set item */
  CREATE_STATE_FROM_PANEL = "CREATE_STATE_FROM_PANEL",
  /** remove an array or set item */
  REMOVE_STATE_FROM_PANEL = "REMOVE_STATE_FROM_PANEL",
  /** stores changed */
  REPORT_STORES_CHANGED = "REPORT_STORES_CHANGED",
  /** report mobx changes */
  REPORT_CHANGES = "REPORT_CHANGES",

  /** create a mst store  */
  CREATE_MST = "CREATE_MST",
  /** remove a mst store */
  REMOVE_MST = "REMOVE_MST",
  /** add mst log item */
  ADD_MST_LOG_ITEM = "ADD_MST_LOG_ITEM",

  /**
   * -------- storage user setting --------
   * */
  /** storage user local data, from panel to background */
  PUT_LOCAL_DATA = "PUT_LOCAL_DATA",
  /** get local data, from panel to background */
  GET_LOCAL_DATA = "GET_LOCAL_DATA",
}

export type ASYNC_MESSAGE_TYPE_DATA = {
  [ASYNC_MESSAGE.SYNC_STATE]: MESSAGE<{
    uid: number;
    state: number[];
    total: number;
    index: number;
    startTime: number;
  }>;

  /**
   * -------- api provided by frontend --------
   * */
  [ASYNC_MESSAGE.GET_ALL_STORES_KEYS]: MESSAGE<
    any,
    {
      keys: string[];
      nicknames: string[];
    }
  >;
  [ASYNC_MESSAGE.PATCH_STATE_FROM_FRONTEND]: MESSAGE<{
    path: string[];
    value: any;
    storeName: string;
  }>;
  [ASYNC_MESSAGE.GET_DATA_BY_PATH]: MESSAGE<
    {
      storeName: string;
      path: string[];
    },
    {
      nodes: DataNode[];
    }
  >;
  [ASYNC_MESSAGE.GET_TREE_DATA_BY_PATHS]: MESSAGE<
    {
      storeName: string;
      paths: string[][];
    },
    {
      nodes: DataNode[];
    }
  >;
  [ASYNC_MESSAGE.CREATE_STATE_FROM_FRONTEND]: MESSAGE<{
    path: string[];
    value: any;
    storeName: string;
  }>;
  [ASYNC_MESSAGE.REMOVE_STATE_FROM_FRONTEND]: MESSAGE<{
    path: string[];
    storeName: string;
  }>;
  [ASYNC_MESSAGE.GET_ALL_MST_KEYS]: MESSAGE<
    any,
    {
      keys: string[];
    }
  >;
  [ASYNC_MESSAGE.GET_MST_SNAPSHOT]: MESSAGE<
    {
      logItemId: number;
      key: string;
    },
    {
      snapshot: any;
    }
  >;
  [ASYNC_MESSAGE.PUT_LOG_RECORDING]: MESSAGE<{
    isRecording: boolean;
  }>;
  [ASYNC_MESSAGE.REMOVE_DEPRECATED_LOGS]: MESSAGE<{
    key: string;
    ids: number[];
  }>;
  [ASYNC_MESSAGE.APPLY_SNAPSHOT]: MESSAGE<{
    key: string;
    id: number;
  }>;

  /**
   * -------- api provided by panel --------
   * */
  [ASYNC_MESSAGE.REPORT_STORES_CHANGED]: MESSAGE<{
    keys: string[];
  }>;
  [ASYNC_MESSAGE.CREATE_STORE]: MESSAGE<{
    key: string | string[];
    nickname: string | string[];
  }>;
  [ASYNC_MESSAGE.REMOVE_STORE]: MESSAGE<{
    key: string;
  }>;

  [ASYNC_MESSAGE.PATCH_STATE_FROM_PANEL]: MESSAGE<{
    path: string[];
    value: any;
    storeName: string;
  }>;
  [ASYNC_MESSAGE.CREATE_STATE_FROM_PANEL]: MESSAGE<{
    path: string[];
    value: any;
    storeName: string;
  }>;
  [ASYNC_MESSAGE.REMOVE_STATE_FROM_PANEL]: MESSAGE<{
    path: string[];
    storeName: string;
  }>;
  [ASYNC_MESSAGE.REPORT_CHANGES]: MESSAGE<Change[]>;

  [ASYNC_MESSAGE.CREATE_MST]: MESSAGE<{
    key: string;
  }>;
  [ASYNC_MESSAGE.REMOVE_MST]: MESSAGE<{
    key: string;
  }>;
  [ASYNC_MESSAGE.ADD_MST_LOG_ITEM]: MESSAGE<{
    key: string;
    logItem: SummaryLogItem;
  }>;

  /**
   * -------- storage user setting --------
   * */
  [ASYNC_MESSAGE.PUT_LOCAL_DATA]: MESSAGE<{
    key: string;
    value: any;
  }>;
  [ASYNC_MESSAGE.GET_LOCAL_DATA]: MESSAGE;
};
