export const createMockObj = () => {
  const map = new Map();
  map.set("key1", "value1");
  const set = new Set();
  set.add("string");
  set.add(10);
  set.add(false);

  const obj = {
    str: "str",
    arr: [1, 2, 3] as any[],
    tinyArr: [1, 2] as any[],
    sym: Symbol("sym"),
    obj: {
      str: "str",
      num: 1,
      arr: [1, 2] as any[],
      tinyArr: [1, 2] as any[],
      undefinedKey: undefined,
      NaNKey: NaN,
      nullKey: null,
    },
    map,
    set,
  };

  map.set("obj", obj);
  set.add(obj);
  obj.obj.arr.push(obj);
  obj.arr.push(obj);
  return obj;
};
