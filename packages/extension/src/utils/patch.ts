export const updateState = (
  curState: object,
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
export const removeArrayItem = (curState: object, path: string[]) => {
  let cur: object | any[] = curState;
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
export const addArrayItem = (
  curState: object,
  data: { value: any; path: string[] }
) => {
  const { path, value } = data;
  let cur: object | any[] = curState;
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
