import {
  encode as originEncode,
  decode,
  ExtensionCodec,
} from "@msgpack/msgpack";
// import { judgeIsMobxObservableObject } from "./format";

// const extensionCodec = new ExtensionCodec();

// const encode = (obj: unknown) =>
//   originEncode(obj, { extensionCodec, maxDepth: 10 });

// export const FUNCTION_PLACEHOLDER = "[Function]";

// // Set<T>
// const SET_EXT_TYPE = 0; // Any in 0-127
// extensionCodec.register({
//   type: SET_EXT_TYPE,
//   encode: (object: unknown): Uint8Array | null => {
//     if (object instanceof Set) {
//       return encode([...object]);
//     } else {
//       return null;
//     }
//   },
//   decode: (data: Uint8Array) => {
//     const array = decode(data, { extensionCodec }) as Array<unknown>;
//     return new Set(array);
//   },
// });

// // Map<T>
// const MAP_EXT_TYPE = 1; // Any in 0-127
// extensionCodec.register({
//   type: MAP_EXT_TYPE,
//   encode: (object: unknown): Uint8Array => {
//     if (object instanceof Map) {
//       return encode([...object]);
//     } else {
//       return null;
//     }
//   },
//   decode: (data: Uint8Array) => {
//     const array = decode(data, { extensionCodec }) as Array<[unknown, unknown]>;
//     return new Map(array);
//   },
// });

// // Function<T>
// const FUNCTION_EXT_TYPE = 2; // Any in 0-127
// extensionCodec.register({
//   type: FUNCTION_EXT_TYPE,
//   encode: (object: unknown): Uint8Array | null => {
//     if (typeof object === "function") {
//       return new Uint8Array();
//     } else {
//       return null;
//     }
//   },
//   decode: (data: Uint8Array) => {
//     return FUNCTION_PLACEHOLDER;
//   },
// });

// // ObserableSet<T>
// const OBSERABLE_SET_EXT_TYPE = 3; // Any in 0-127
// extensionCodec.register({
//   type: OBSERABLE_SET_EXT_TYPE,
//   encode: (object: unknown): Uint8Array | null => {
//     if (
//       (object[Symbol.toStringTag] === "Set") ===
//       judgeIsMobxObservableObject(object)
//     ) {
//       if (
//         object[Symbol.toStringTag] === "Map" ||
//         object[Symbol.toStringTag] === "Set"
//       ) {
//         // console.log("encode judgeIsMobxObservableObject", object);
//         // @ts-ignore
//         return encode([...object.data_], { extensionCodec });
//       }
//       return null;
//     } else {
//       return null;
//     }
//   },
//   decode: (data: Uint8Array) => {
//     const array = decode(data, { extensionCodec }) as Array<[unknown, unknown]>;
//     return new Map(array);
//   },
// });

// // ObserableObject<T>
// const OBSERABLE_OBJECT_EXT_TYPE = 4; // Any in 0-127
// extensionCodec.register({
//   type: OBSERABLE_OBJECT_EXT_TYPE,
//   encode: (object: unknown): Uint8Array | null => {
//     if (judgeIsMobxObservableObject(object)) {
//       if (
//         object[Symbol.toStringTag] === "Map" ||
//         object[Symbol.toStringTag] === "Set"
//       ) {
//         // console.log("encode judgeIsMobxObservableObject", object);
//         // @ts-ignore
//         return encode([...object.data_], { extensionCodec });
//       }
//       return null;
//     } else {
//       return null;
//     }
//   },
//   decode: (data: Uint8Array) => {
//     const array = decode(data, { extensionCodec }) as Array<[unknown, unknown]>;
//     return new Map(array);
//   },
// });

// // Symbol<T>
// const SYMBOL_EXT_TYPE = 5; // Any in 0-127
// extensionCodec.register({
//   type: SYMBOL_EXT_TYPE,
//   encode: (object: unknown): Uint8Array | null => {
//     if (typeof object === "symbol") {
//       return new Uint8Array();
//     } else {
//       return null;
//     }
//   },
//   decode: (data: Uint8Array) => {
//     // TODO use symbol string
//     return "[Symbol]";
//   },
// });

export const parse = (data: Array<number>) => {
  // const unitArr = new Uint8Array(data);
  // console.log("parse", data);
  // return decode(unitArr, { extensionCodec });
  return deserialize(data);
};

export const stringify = (data) => {
  // return Array.from(encode(data));
  return serialize(data);
};

export const toJSON = (data) => {
  // return parse(stringify(data));
  return deserialize(serialize(data));
};

export const symbols = {
  type: "@@type",
  name: "@@name",
  entries: "@@entries",
  reference: "@@reference",
  proto: "@@proto",
  inspected: "@@inspected",
  editable: "@@editable",
  mobxObject: "@@mobxObject",
  serializationException: "@@serializationException",
};

export const allowedComplexObjects = new Set();

function serialize(
  data: any,
  path = [],
  seen = new Map(),
  propToExtract?: string
) {
  try {
    if (propToExtract !== undefined) {
      data = data[propToExtract]; // eslint-disable-line no-param-reassign
    }
    if (!data || typeof data !== "object") {
      if (typeof data === "string" && data.length > 500) {
        return `${data.slice(0, 500)}...`;
      }
      if (typeof data === "symbol") {
        return {
          [symbols.type]: "symbol",
          [symbols.name]: data.toString(),
        };
      }
      if (typeof data === "function") {
        return {
          [symbols.type]: "function",
          [symbols.name]: data.name,
        };
      }
      return data;
    }

    if (data instanceof RegExp || data instanceof Date) {
      return data;
    }

    const seenPath = seen.get(data);
    if (seenPath) {
      return {
        [symbols.reference]: seenPath,
      };
    }

    seen.set(data, path);

    if (data instanceof Array) {
      return data.map((o, i) => serialize(o, path.concat(i), seen));
    }

    const clone = {};

    const prototype = Object.getPrototypeOf(data);
    const inspecting = allowedComplexObjects.has(data);

    if (data instanceof Map || (prototype && prototype.isMobXObservableMap)) {
      const result = {
        [symbols.type]: "map",
        [symbols.name]: data.constructor && data.constructor.name,
        [symbols.inspected]: inspecting,
        [symbols.editable]: false,
        [symbols.mobxObject]: "$mobx" in data,
      };
      if (inspecting) {
        result[symbols.entries] = [...data.entries()];
      }
      return result;
    }

    if (data instanceof Set || (prototype && prototype.isMobXObservableSet)) {
      const result = {
        [symbols.type]: "set",
        [symbols.name]: data.constructor && data.constructor.name,
        [symbols.inspected]: inspecting,
        [symbols.editable]: false,
        [symbols.mobxObject]: "$mobx" in data,
      };
      if (inspecting) {
        result[symbols.entries] = [...data.entries()];
      }
      return result;
    }

    if (prototype && prototype !== Object.prototype) {
      // This is complex object (dom node or mobx.something)
      // only short signature will be sent to prevent performance loss
      const result = {
        [symbols.type]: "object",
        [symbols.name]: data.constructor && data.constructor.name,
        [symbols.inspected]: inspecting,
        [symbols.editable]: true,
        [symbols.mobxObject]: "$mobx" in data,
        [symbols.proto]: {
          [symbols.type]: "object",
          [symbols.name]: prototype.constructor && prototype.constructor.name,
          [symbols.inspected]: false,
          [symbols.editable]: false,
        },
      };
      if (inspecting) {
        for (const p in data) {
          if (Object.prototype.hasOwnProperty.call(data, p)) {
            result[p] = serialize(data, path.concat(p), seen, p);
          }
        }
      }
      return result;
    }

    for (const prop in data) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        clone[prop] = serialize(data, path.concat(prop), seen, prop);
      }
    }

    return clone;
  } catch (error) {
    return {
      [symbols.type]: "serializationError",
      message: error && error.message,
    };
  }
}

const deserialize = (data: any, root?: any) => {
  if (!data || typeof data !== "object") return data;
  if (data instanceof Array) {
    return data.map((o) => deserialize(o, root || data));
  }
  if (data[symbols.reference]) {
    return data[symbols.reference].reduce(
      (acc, next) => acc[next],
      root || data
    );
  }
  for (const prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      data[prop] = deserialize(data[prop], root || data);
    }
  }
  return data;
};
