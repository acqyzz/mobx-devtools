import { addItem } from "src/index";
import { createMockObj } from "./obj.mock";

let obj = createMockObj();

describe("addItem", () => {
  beforeEach(() => {
    obj = createMockObj();
  });
  it("add string in plain array", () => {
    addItem(obj, {
      value: "test",
      path: ["tinyArr", 2],
    });
    const expected = createMockObj();
    expected.tinyArr.push("test");
    expect(obj.tinyArr).toEqual(expected.tinyArr);
  });

  it("add string in deep array", () => {
    addItem(obj, {
      value: "test",
      path: ["obj", "tinyArr", 2],
    });
    const expected = createMockObj();
    expected.obj.tinyArr.push("test");
    expect(obj.obj.tinyArr).toEqual(expected.obj.tinyArr);
  });

  it("add string in deep array index 0", () => {
    addItem(obj, {
      value: "test",
      path: ["obj", "tinyArr", 0],
    });
    const expected = createMockObj();
    expected.obj.tinyArr.splice(0, 0, "test");
    expect(obj.obj.tinyArr).toEqual(expected.obj.tinyArr);
  });

  it("add string set index 0", () => {
    const testVal = "__test__";
    addItem(obj, {
      value: testVal,
      path: ["set", 0],
    });
    const expected = createMockObj();
    expected.set.add(testVal);
    expect(obj.set.has(testVal)).toEqual(expected.set.has(testVal));
  });
});
