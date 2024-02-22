import { createDataNode } from "./nodeFactory";
import { isMap, isArray, isNaN, isObject, isSet } from "./type";
import { DataNode } from "./types";

export const getByPath = (obj, path: (string | number)[]) => {
  let cur = obj;
  const interrupted = path.some((key) => {
    if (isMap(cur)) {
      if (!(cur as Map<any, any>).has(key)) {
        return true;
      }
      cur = (cur as Map<any, any>).get(key);
      return false;
    } else if (isSet(cur)) {
      if (isNaN(+key)) {
        return true;
      }
      const keys = (cur as Set<any>).keys();
      let num = 0;
      let curValue = keys.next();
      while (!curValue.done) {
        if (num === +key) {
          cur = curValue.value;
          return false;
        }
        curValue = keys.next();
        num++;
      }
      return true;
    }
    if (key in cur) {
      cur = cur[key];
    } else {
      return true;
    }
    return false;
  });
  return { data: interrupted ? undefined : cur, complete: !interrupted };
};

export const getAsLeaf = (obj: object, path: (string | number)[]) => {
  const { data, complete } = getByPath(obj, path);
  if (!complete) {
    return undefined;
  }
  const nodes: DataNode[] = [];
  if (isMap(data)) {
    const iterator = data.keys();
    while (true) {
      const cur = iterator.next();
      if (cur.done) {
        break;
      }
      const value = data.get(cur.value);
      const node = createDataNode(data, cur.value, value);
      nodes.push(node);
    }
  } else if (isSet(data)) {
    const iterator = data.keys();
    let key = 0;
    while (true) {
      const cur = iterator.next();
      if (cur.done) {
        break;
      }
      const value = cur.value;
      const node = createDataNode(data, key, value);
      nodes.push(node);
      key++;
    }
  } else if (isArray(data)) {
    data.forEach((value, index) => {
      const node = createDataNode(data, index, value);
      nodes.push(node);
    });
  } else if (isObject(data)) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (typeof value === "function") {
        return;
      }
      const node = createDataNode(data, key, value);
      nodes.push(node);
    });
  }
  return nodes;
};

export const getWholeStateAsLeaf = (
  obj: object,
  paths: (string | number)[][]
) => {
  if (!paths.length) {
    return [];
  }
  const result = getAsLeaf(obj, []);
  paths.forEach((path) => {
    let cur = result;
    path.some((key, index) => {
      const node = cur.find((item) => item.key === key);
      if (node && node.hasMore) {
        if (node.children) {
          cur = node.children;
        } else {
          cur = node.children = getAsLeaf(obj, path.slice(0, index + 1));
        }
      }
      return !node;
    });
  });
  return result;
};

export const updateState = (
  curState: object,
  data: { value: any; path: string[] }
) => {
  const { data: last, complete } = getByPath(curState, data.path.slice(0, -1));
  if (!complete) {
    console.warn("[updateState] find empty path: ", data.path);
    return;
  }
  if (isSet(last)) {
    // set not allow update value
    return;
  }
  if (isMap(last)) {
    (last as Map<any, any>).set(data.path[data.path.length - 1], data.value);
    return;
  }
  last[data.path[data.path.length - 1]] = data.value;
};
export const removeItem = (curState: object, path: (string | number)[]) => {
  const { data: last, complete } = getByPath(curState, path.slice(0, -1));
  if (!complete) {
    console.warn("[updateState] find empty path: ", path);
    return;
  }
  if (isArray(last)) {
    last.splice(+path[path.length - 1], 1);
  } else if (isSet(last)) {
    const iterator = last.keys();
    let curIndex = 0;
    while (true) {
      const cur = iterator.next();
      if (cur.done) {
        break;
      }
      if (curIndex === +path[path.length - 1]) {
        last.delete(cur.value);
        return;
      }
      curIndex++;
    }
  }
};
export const addItem = (
  curState: object,
  data: { value: any; path: (string | number)[] }
) => {
  const { path, value } = data;
  const { data: last, complete } = getByPath(curState, path.slice(0, -1));
  if (!complete) {
    console.warn("[updateState] find empty path: ", path);
    return;
  }
  if (isArray(last)) {
    last.splice(+path[path.length - 1], 0, value);
  } else if (isSet(last)) {
    last.add(value);
  }
};

export * from "./nodeFactory";
