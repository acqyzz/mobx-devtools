import { parse, stringify } from "utils/serialization";

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dayOfMonth = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();
  return `${year}-${fillZero(month)}-${fillZero(dayOfMonth)} ${fillZero(
    hour
  )}:${fillZero(minute)}:${fillZero(second)}.${fillZero(millisecond, 3)}`;
};

const fillZero = (num: number, bit = 2) => {
  const len = `${num}`.length;
  if (len < bit) {
    return `${"0".repeat(bit - len)}${num}`;
  }
  return num;
};

export const toJSON = (data: any) => {
  return parse(stringify(data));
};
