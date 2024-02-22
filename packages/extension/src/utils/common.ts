import isObject from "lodash/isObject";
import isMap from "lodash/isMap";
import isSet from "lodash/isSet";
import isArray from "lodash/isArray";

export const delay = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout);
  });
};

export const traverseObj = (
  data: any,
  cb: (property: any) => void,
  objectOnly: boolean = true,
  maxDepth = 5
) => {
  if (!data || maxDepth <= 0 || data instanceof Element) {
    return;
  }
  if ((objectOnly && !isObject(data)) || typeof data === "function") {
    return;
  }
  if (isMap(data)) {
    const iterator = data.keys();
    while (true) {
      const cur = iterator.next();
      if (cur.done) {
        break;
      }
      const val = data.get(cur.value);
      cb(val);
      traverseObj(val, cb, objectOnly, maxDepth - 1);
    }
  } else if (isSet(data)) {
    const iterator = data.keys();
    while (true) {
      const cur = iterator.next();
      if (cur.done) {
        break;
      }
      cb(cur.value);
      traverseObj(cur.value, cb, objectOnly, maxDepth - 1);
    }
  } else {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        cb(data[key]);
        traverseObj(data[key], cb, objectOnly, maxDepth - 1);
      }
    }
  }
};
