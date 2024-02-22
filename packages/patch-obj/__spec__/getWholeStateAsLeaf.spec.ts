import { createDataNode, getWholeStateAsLeaf } from "src/index";
import { createMockObj } from "./obj.mock";

const obj = createMockObj();

describe("getWholeStateAsLeaf", () => {
  it("no item", () => {
    expect(getWholeStateAsLeaf(obj, [])).toEqual([]);
  });

  it("one empty array", () => {
    expect(getWholeStateAsLeaf(obj, [[]])).toEqual([
      createDataNode(obj, "str", obj.str),
      createDataNode(obj, "arr", obj.arr),
      createDataNode(obj, "tinyArr", obj.tinyArr),
      createDataNode(obj, "sym", obj.sym),
      createDataNode(obj, "obj", obj.obj),
      createDataNode(obj, "map", obj.map),
      createDataNode(obj, "set", obj.set),
    ]);
  });

  it("str", () => {
    expect(getWholeStateAsLeaf(obj, [["str"]])).toEqual([
      createDataNode(obj, "str", obj.str),
      createDataNode(obj, "arr", obj.arr),
      createDataNode(obj, "tinyArr", obj.tinyArr),
      createDataNode(obj, "sym", obj.sym),
      createDataNode(obj, "obj", obj.obj),
      createDataNode(obj, "map", obj.map),
      createDataNode(obj, "set", obj.set),
    ]);
  });

  it("obj", () => {
    expect(getWholeStateAsLeaf(obj, [["obj"]])).toEqual([
      createDataNode(obj, "str", obj.str),
      createDataNode(obj, "arr", obj.arr),
      createDataNode(obj, "tinyArr", obj.tinyArr),
      createDataNode(obj, "sym", obj.sym),
      createDataNode(obj, "obj", obj.obj, [
        createDataNode(obj, "str", obj.obj.str),
        createDataNode(obj, "num", obj.obj.num),
        createDataNode(obj, "arr", obj.obj.arr),
        createDataNode(obj, "tinyArr", obj.obj.tinyArr),
        createDataNode(obj, "undefinedKey", obj.obj.undefinedKey),
        createDataNode(obj, "NaNKey", obj.obj.NaNKey),
        createDataNode(obj, "nullKey", obj.obj.nullKey),
      ]),
      createDataNode(obj, "map", obj.map),
      createDataNode(obj, "set", obj.set),
    ]);
  });

  it("arr", () => {
    expect(getWholeStateAsLeaf(obj, [["arr"]])).toEqual([
      createDataNode(obj, "str", obj.str),
      createDataNode(obj, "arr", obj.arr, [
        createDataNode(obj.arr, 0, obj.arr[0]),
        createDataNode(obj.arr, 1, obj.arr[1]),
        createDataNode(obj.arr, 2, obj.arr[2]),
        createDataNode(obj.arr, 3, obj.arr[3]),
      ]),
      createDataNode(obj, "tinyArr", obj.tinyArr),
      createDataNode(obj, "sym", obj.sym),
      createDataNode(obj, "obj", obj.obj),
      createDataNode(obj, "map", obj.map),
      createDataNode(obj, "set", obj.set),
    ]);
  });

  it("arr > obj", () => {
    expect(getWholeStateAsLeaf(obj, [["arr", 3]])).toEqual([
      createDataNode(obj, "str", obj.str),
      createDataNode(obj, "arr", obj.arr, [
        createDataNode(obj.arr, 0, obj.arr[0]),
        createDataNode(obj.arr, 1, obj.arr[1]),
        createDataNode(obj.arr, 2, obj.arr[2]),
        createDataNode(obj.arr, 3, obj.arr[3], [
          createDataNode(obj, "str", obj.str),
          createDataNode(obj, "arr", obj.arr),
          createDataNode(obj, "tinyArr", obj.tinyArr),
          createDataNode(obj, "sym", obj.sym),
          createDataNode(obj, "obj", obj.obj),
          createDataNode(obj, "map", obj.map),
          createDataNode(obj, "set", obj.set),
        ]),
      ]),
      createDataNode(obj, "tinyArr", obj.tinyArr),
      createDataNode(obj, "sym", obj.sym),
      createDataNode(obj, "obj", obj.obj),
      createDataNode(obj, "map", obj.map),
      createDataNode(obj, "set", obj.set),
    ]);
  });

  it("obj and map", () => {
    expect(getWholeStateAsLeaf(obj, [["obj"], ["map"]])).toEqual([
      createDataNode(obj, "str", obj.str),
      createDataNode(obj, "arr", obj.arr),
      createDataNode(obj, "tinyArr", obj.tinyArr),
      createDataNode(obj, "sym", obj.sym),
      createDataNode(obj, "obj", obj.obj, [
        createDataNode(obj, "str", obj.obj.str),
        createDataNode(obj, "num", obj.obj.num),
        createDataNode(obj, "arr", obj.obj.arr),
        createDataNode(obj, "tinyArr", obj.obj.tinyArr),
        createDataNode(obj, "undefinedKey", obj.obj.undefinedKey),
        createDataNode(obj, "NaNKey", obj.obj.NaNKey),
        createDataNode(obj, "nullKey", obj.obj.nullKey),
      ]),
      createDataNode(obj, "map", obj.map, [
        createDataNode(obj.map, "key1", obj.map.get("key1")),
        createDataNode(obj.map, "obj", obj),
      ]),
      createDataNode(obj, "set", obj.set),
    ]);
  });

  it("set", () => {
    expect(getWholeStateAsLeaf(obj, [["obj"], ["set"]])).toEqual([
      createDataNode(obj, "str", obj.str),
      createDataNode(obj, "arr", obj.arr),
      createDataNode(obj, "tinyArr", obj.tinyArr),
      createDataNode(obj, "sym", obj.sym),
      createDataNode(obj, "obj", obj.obj, [
        createDataNode(obj, "str", obj.obj.str),
        createDataNode(obj, "num", obj.obj.num),
        createDataNode(obj, "arr", obj.obj.arr),
        createDataNode(obj, "tinyArr", obj.obj.tinyArr),
        createDataNode(obj, "undefinedKey", obj.obj.undefinedKey),
        createDataNode(obj, "NaNKey", obj.obj.NaNKey),
        createDataNode(obj, "nullKey", obj.obj.nullKey),
      ]),
      createDataNode(obj, "map", obj.map),
      createDataNode(obj, "set", obj.set, [
        createDataNode(obj.set, 0, "string"),
        createDataNode(obj.set, 1, 10),
        createDataNode(obj.set, 2, false),
        createDataNode(obj.set, 3, obj),
      ]),
    ]);
  });
});
