declare module "*.png";
declare module "*.less";

declare interface Window {
  __MOBX_DEVTOOL_STORES__?: {
    [key: string]: any;
  };
  __MOBX_DEVTOOLS_GLOBAL_HOOK__?: any;
  __mobxGlobals?: any;
}

declare const __isDEV__: boolean;
declare const __IS_FIREFOX__: boolean;
declare const __IS_CHROME__: boolean;
declare const __IS_EDGE__: boolean;
declare const __IS_ELECTRON__: boolean;
