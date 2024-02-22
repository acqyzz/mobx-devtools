import { DataNode } from "patch-obj/dist/types";
import { Change } from "types/change";
import { MESSAGE, WithType } from "types/message";
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

  /** report mobx changes */
  REPORT_CHANGES = "REPORT_CHANGES",

  /** stores changed */
  REPORT_STORES_CHANGED = "REPORT_STORES_CHANGED",

  /**
   * -------- storage user setting --------
   * */
  /** storage user local data, from panel to background */
  PUT_LOCAL_DATA = "PUT_LOCAL_DATA",
  /** get local data, from panel to background */
  GET_LOCAL_DATA = "GET_LOCAL_DATA",
}

export type ASYNC_MESSAGE_TYPE_DATA = WithType<{
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

  /**
   * -------- storage user setting --------
   * */
  [ASYNC_MESSAGE.PUT_LOCAL_DATA]: MESSAGE<{
    key: string;
    value: any;
  }>;
  [ASYNC_MESSAGE.GET_LOCAL_DATA]: MESSAGE;
}>;
