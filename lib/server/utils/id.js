const getWeatherId = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export default { getWeatherId };
