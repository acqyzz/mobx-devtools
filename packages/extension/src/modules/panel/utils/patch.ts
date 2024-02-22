import { StateNode } from "panel/types";

export const getStoreByPath = (node: StateNode, path: string[]) => {
  let cur = node;
  path.forEach((key) => {
    const child = cur.children.find((item) => item.key === key);
    if (child) {
      cur = child;
    }
  });
  return cur;
};

export const updateStoreState = (
  curState: StateNode,
  data: { value: any; path: string[] }
) => {
  let cur = curState;
  data.path.forEach((key, index) => {
    if (index === data.path.length - 1) {
      return;
    }
    cur = cur[key];
  });
  cur[data.path[data.path.length - 1]] = data.value;
};

export const removeStoreArrayItem = (curState: StateNode, path: string[]) => {
  let cur = curState;
  path.forEach((key, index) => {
    if (index === path.length - 1) {
      return;
    }
    cur = cur[key];
  });
  if (Array.isArray(cur)) {
    cur.splice(+path[path.length - 1], 1);
  }
};

export const addStoreArrayItem = (
  curState: StateNode,
  data: { value: any; path: string[] }
) => {
  const { path, value } = data;
  let cur = curState;
  path.forEach((key, index) => {
    if (index === path.length - 1) {
      return;
    }
    cur = cur[key];
  });
  if (Array.isArray(cur)) {
    cur.splice(+path[path.length - 1], 0, value);
  }
};
