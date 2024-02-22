import { getByPath } from "src/index";
import { createMockObj } from "./obj.mock";

const obj = createMockObj();

describe("getByPath", () => {
  it("str", () => {
    expect(getByPath(obj, ["str"])).toEqual({ data: "str", complete: true });
  });

  it("obj", () => {
    expect(getByPath(obj, ["obj"])).toEqual({ data: obj.obj, complete: true });
  });

  it("obj > str", () => {
    expect(getByPath(obj, ["obj", "str"])).toEqual({
      data: obj.obj.str,
      complete: true,
    });
  });

  it("obj > arr > 0", () => {
    expect(getByPath(obj, ["obj", "arr", "0"])).toEqual({
      data: obj.obj.arr[0],
      complete: true,
    });
  });

  it("obj > arr > 2 > obj", () => {
    expect(getByPath(obj, ["obj", "arr", "2", "str"])).toEqual({
      data: obj.obj.arr[2].str,
      complete: true,
    });
  });

  it("obj > map > key1", () => {
    expect(getByPath(obj, ["map", "key1"])).toEqual({
      data: obj.map.get("key1"),
      complete: true,
    });
  });

  it("obj > map > key2", () => {
    expect(getByPath(obj, ["map", "key2"])).toEqual({
      data: undefined,
      complete: false,
    });
  });

  it("obj > map > obj > str", () => {
    expect(getByPath(obj, ["map", "obj", "str"])).toEqual({
      data: obj.str,
      complete: true,
    });
  });

  it("obj > set > 2", () => {
    expect(getByPath(obj, ["set", "2"])).toEqual({
      data: false,
      complete: true,
    });
  });

  it("obj > set > 2", () => {
    expect(getByPath(obj, ["set", "3"])).toEqual({ data: obj, complete: true });
  });

  it("obj > set > 2 > set", () => {
    expect(getByPath(obj, ["set", "3", "set"])).toEqual({
      data: obj.set,
      complete: true,
    });
  });
});
