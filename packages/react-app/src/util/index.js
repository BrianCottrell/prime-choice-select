export const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const displayValue = v => {
  if (Array.isArray(v)) {
    return v.join(", ");
  } else if (v._isBigNumber) {
    return v.toString();
  }
  return JSON.stringify(v);
};
