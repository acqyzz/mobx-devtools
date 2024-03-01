declare module "*.png";
declare module "*.less";

declare interface Window {
  __MOBX_DEVTOOL_STORES__?: {
    [key: string]: object;
  };
  __MOBX_DEVTOOLS_GLOBAL_HOOK__?: any;
}
