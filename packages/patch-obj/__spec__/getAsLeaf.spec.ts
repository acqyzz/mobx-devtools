import { createDataNode, getAsLeaf } from "src/index";
import { createMockObj } from "./obj.mock";

const obj = createMockObj();

describe("getAsLeaf", () => {
  it("str", () => {
    expect(getAsLeaf(obj, ["str"])).toEqual([]);
  });

  it("obj", () => {
    expect(getAsLeaf(obj, ["obj"])).toEqual([
      createDataNode(obj, "str", obj.obj.str),
      createDataNode(obj, "num", obj.obj.num),
      createDataNode(obj, "arr", obj.obj.arr),
      createDataNode(obj, "tinyArr", obj.obj.tinyArr),
      createDataNode(obj, "undefinedKey", obj.obj.undefinedKey),
      createDataNode(obj, "NaNKey", obj.obj.NaNKey),
      createDataNode(obj, "nullKey", obj.obj.nullKey),
    ]);
  });
});
