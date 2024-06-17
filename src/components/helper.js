export const getRoot = (component) => {
  if (component.root && component.root !== component) {
    return getRoot(component.root);
  } else {
    return component;
  }
};

/**
 * Gets the value at `path` of `object`. If the resolved value is `undefined`, the `defaultValue` is returned in its place.
 *
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 */
export function deepGet(object, path, defaultValue) {
  const castPath = (value) => {
    if (Array.isArray(value)) {
      return value;
    }
    return value.split(".").filter(Boolean);
  };

  const toKey = (value) => {
    if (typeof value === "symbol" || typeof value === "number") {
      return value;
    }
    return String(value);
  };

  const isObject = (value) => {
    return value !== null && typeof value === "object";
  };

  const baseGet = (object, path) => {
    path = castPath(path);
    let index = 0;
    const length = path.length;

    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index === length ? object : undefined;
  };

  const result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}
