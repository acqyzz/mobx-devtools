import LodashisObject from "lodash/isObject";
import LodashisNaN from "lodash/isNaN";
import LodashisMap from "lodash/isMap";
import LodashisSet from "lodash/isSet";
import LodashisArray from "lodash/isArray";

export const isMap = (obj: any): obj is Map<any, any> => {
  if (!obj) {
    return false;
  }
  const tag = obj[Symbol.toStringTag];
  return tag === "Map" || LodashisMap(obj);
};

export const isSet = (obj: any): obj is Set<any> => {
  if (!obj) {
    return false;
  }
  const tag = obj[Symbol.toStringTag];
  return tag === "Set" || LodashisSet(obj);
};

export const isArray = LodashisArray;
export const isNaN = LodashisNaN;
export const isObject = LodashisObject;
