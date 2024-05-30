import SplitType from "split-type";
// attribute value checker
export const attr = function (defaultVal, attrVal) {
  //get the type of the default
  const defaultValType = typeof defaultVal;
  if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
  if (attrVal === "true" && defaultValType === "boolean") return true;
  if (attrVal === "false" && defaultValType === "boolean") return false;
  if (isNaN(attrVal) && defaultValType === "string") return attrVal;
  if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
  return defaultVal;
};

//split text utility
export const runSplit = function (text, types = "lines, words") {
  if (!text) return;
  typeSplit = new SplitType(text, {
    types: types,
  });
  return typeSplit;
};
