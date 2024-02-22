import { updateState } from "src/index";
import { createMockObj } from "./obj.mock";

let obj = createMockObj();

describe("updateState", () => {
  beforeEach(() => {
    obj = createMockObj();
  });
  it("str", () => {
    updateState(obj, { path: ["str"], value: "newValue" });
    expect(obj.str).toEqual("newValue");
  });

  it("obj", () => {
    updateState(obj, { path: ["obj"], value: "newValue" });
    expect(obj.obj).toEqual("newValue");
  });

  it("obj > str", () => {
    updateState(obj, { path: ["obj", "str"], value: "newValue" });
    expect(obj.obj.str).toEqual("newValue");
  });

  it("obj > arr > 0", () => {
    updateState(obj, { path: ["obj", "arr", "0"], value: "newValue" });
    expect(obj.obj.arr[0]).toEqual("newValue");
  });

  it("obj > arr > 2 > obj", () => {
    updateState(obj, { path: ["obj", "arr", "2", "str"], value: "newValue" });
    expect(obj.obj.arr[2].str).toEqual("newValue");
  });

  it("obj > map > key1", () => {
    updateState(obj, { path: ["map", "key1"], value: "newValue" });
    expect(obj.map.get("key1")).toEqual("newValue");
  });

  it("obj > map > key2", () => {
    updateState(obj, { path: ["map", "key2"], value: "newValue" });
    expect(obj.map.get("key2")).toEqual("newValue");
  });

  it("obj > map > obj > str", () => {
    updateState(obj, { path: ["map", "obj", "str"], value: "newValue" });
    expect(obj.map.get("obj").str).toEqual("newValue");
  });

  it("obj > set > 2", () => {
    // set not allow to update
    updateState(obj, { path: ["set", "2"], value: "newValue" });
    const entries = obj.set.entries();
    entries.next();
    entries.next();
    const val = entries.next().value;
    expect(val[1]).toEqual(false);
  });
});
