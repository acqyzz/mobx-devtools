export const parse = (data: Array<number>) => {
  return deserialize(data);
};

export const stringify = (data) => {
  return serialize(data);
};

export const toJSON = (data) => {
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
  meta: "@@meta",
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
