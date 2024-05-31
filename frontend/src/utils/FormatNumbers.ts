export const formatNumber = (value: number): string => {
  if (value < 1000) {
    return value.toString();
  } else if (value < 1000000) {
    value = value / 1000;
    return value.toFixed(1) + "k";
  } else if (value < 1000000000) {
    value = value / 1000000;
    return value.toFixed(1) + "m";
  } else {
    value = value / 1000000000;
    return value.toFixed(1) + "b";
  }
};
