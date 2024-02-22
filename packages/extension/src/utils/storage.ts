type nativeStorageGetParams =
  | Parameters<typeof chrome.storage.local.get>
  | Parameters<typeof chrome.storage.sync.get>;

export const nativeStorageGet = (...args: nativeStorageGetParams) => {
  if (__IS_ELECTRON__) {
    return chrome.storage.local.get(...args);
  } else {
    return chrome.storage.sync.get(...args);
  }
};

type nativeStorageSetParams =
  | Parameters<typeof chrome.storage.local.set>
  | Parameters<typeof chrome.storage.sync.set>;

export const nativeStorageSet = (...args: nativeStorageSetParams) => {
  if (__IS_ELECTRON__) {
    return chrome.storage.local.set(...args);
  } else {
    return chrome.storage.sync.set(...args);
  }
};
