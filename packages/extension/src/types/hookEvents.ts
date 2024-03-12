export enum HOOK_EVENT {
  ADD_STORE = "add-store",
  DELETE_STORE = "delete-store",
  ON_ADD = "on-add",
  ON_DELETE = "on-delete",
  INSTANCES_INJECTED = "instances-injected",
}

type HookEventData = {
  [HOOK_EVENT.INSTANCES_INJECTED]: string;
  [HOOK_EVENT.ADD_STORE]: {
    name: string;
    store: object;
    override?: boolean;
    mobxId?: string;
  };
  [HOOK_EVENT.DELETE_STORE]: string | object;
  [HOOK_EVENT.ON_ADD]: {
    name: string;
    store: object;
    mobxId?: string;
  };
  [HOOK_EVENT.ON_DELETE]: {
    name: string;
    store: object;
  };
};

export interface MobxDevtoolsGlobalHook {
  hookVersion: boolean;
  collections: Record<string, Record<string, any>>;
  storeCollections: Record<string, object>;
  mstMap: WeakMap<object, string>;
  mobxSymbols: any[];
  inject(collection: Record<string, any>): void;
  injectMobx(mobx: any): void;
  injectMobxReact(mobxReact: any, mobx: any): void;
  _listeners: Record<string, Function[]>;
  sub<T extends HOOK_EVENT>(
    evt: T,
    fn: (data: HookEventData[T]) => any
  ): () => void;
  on<T extends HOOK_EVENT>(evt: T, fn: (data: HookEventData[T]) => any): void;
  off<T extends HOOK_EVENT>(evt: T, fn: (data: HookEventData[T]) => any): void;
  emit<T extends HOOK_EVENT>(evt: HOOK_EVENT, data: HookEventData[T]): void;
}
