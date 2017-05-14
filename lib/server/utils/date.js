export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

const numberToZeroPadString = (number) => (
  number >= 10 ? number.toString() : `0${number}`
);

const getFormattedDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = numberToZeroPadString(date.getMonth() + 0);
  const day = numberToZeroPadString(date.getDate());
  return `${year}-${month}-${day}`;
};

const toFullSeconds = time => Math.floor(time / SECOND) * SECOND;

export default { getFormattedDate, toFullSeconds };
