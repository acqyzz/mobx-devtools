import { MobxDevtoolsGlobalHook } from "types/hookEvents";

declare global {
  declare interface Window {
    __MOBX_DEVTOOLS_GLOBAL_HOOK__?: MobxDevtoolsGlobalHook;
    __mobxGlobals?: any;
  }
  declare const __isDEV__: boolean;
  declare const __IS_FIREFOX__: boolean;
  declare const __IS_CHROME__: boolean;
  declare const __IS_EDGE__: boolean;
  declare const __IS_ELECTRON__: boolean;
}
