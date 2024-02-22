import { removeItem } from "src/index";
import { createMockObj } from "./obj.mock";

let obj = createMockObj();

describe("removeItem", () => {
  beforeEach(() => {
    obj = createMockObj();
  });
  it("remove number in plain array", () => {
    removeItem(obj, ["tinyArr", 1]);
    const expected = createMockObj();
    expected.tinyArr.pop();
    expect(obj.tinyArr).toEqual(expected.tinyArr);
  });

  it("remove number in deep array", () => {
    removeItem(obj, ["obj", "tinyArr", 1]);
    const expected = createMockObj();
    expected.obj.tinyArr.pop();
    expect(obj.obj.tinyArr).toEqual(expected.obj.tinyArr);
  });

  it("remove number in deep array index 1", () => {
    removeItem(obj, ["obj", "tinyArr", 0]);
    const expected = createMockObj();
    expected.obj.tinyArr.splice(0, 1);
    expect(obj.obj.tinyArr).toEqual(expected.obj.tinyArr);
  });

  it("remove number in set index 1", () => {
    removeItem(obj, ["set", 1]);
    expect(obj.set.has(10)).toEqual(false);
  });
});
