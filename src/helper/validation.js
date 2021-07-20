export function convertKeyName(key) {
  return key
    .split("")
    .map((v, i) => (i !== 0 ? v.toLowerCase() : v.toUpperCase()))
    .join("");
}

export function convertKeyHaveTwoChars(key) {
  return key.length > 2
    ? key
        .split("")
        .map((v, i) => (i !== 0 ? v.toLowerCase() : v.toUpperCase()))
        .join("")
    : key.toString().toUpperCase();
}

export function convertKeyHaveSpace(key) {
  return key
    .split("_")
    .map((element) =>
      element
        .split("")
        .map((v, i) => (i !== 0 ? v.toLowerCase() : v.toUpperCase()))
        .join("")
    )
    .join(" ");
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
