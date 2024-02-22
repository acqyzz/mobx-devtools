import { isMap, isObject, isSet, isArray } from "./type";
import { DataNode } from "./types";

export const createDataNode = (obj, key, value, children?: DataNode[]) => {
  const objIsArray = isArray(obj);
  const objIsSet = isSet(obj);
  return {
    key,
    value: isObject(value) ? {} : value,
    isSet: isSet(value),
    isMap: isMap(value),
    hasMore: isObject(value),
    editable: !objIsSet && !isMap(value) && !isSet(value),
    isArrayItem: objIsArray,
    isSetItem: objIsSet,
    isArray: isArray(value),
    children,
  } as DataNode;
};
