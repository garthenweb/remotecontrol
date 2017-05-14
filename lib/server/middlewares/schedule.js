import { TICK } from '../actions/date';
import dateUtils, { DAY, MINUTE, HOUR, SECOND } from '../utils/date';

export const isTimeRangeBetweenDates = (timeKey, prevDate, date) => {
  const [hours = 0, minutes = 0, seconds = 0] = timeKey;
  const prevHours = prevDate.getHours();
  const prevMinutes = prevDate.getMinutes();
  const prevSeconds = prevDate.getSeconds();

  // switch of bases is important for jumps between days
  const usePrevAsBase = (
    prevHours < hours || (
      prevHours === hours &&
      prevMinutes < minutes
    ) || (
      prevHours === hours &&
      prevMinutes === minutes &&
      prevSeconds < seconds
    )
  );

  const timePoint = new Date(usePrevAsBase ? prevDate : date);
  timePoint.setHours(hours);
  timePoint.setMinutes(minutes);
  timePoint.setSeconds(seconds);

  return (
    dateUtils.toFullSeconds(timePoint) > dateUtils.toFullSeconds(prevDate) &&
    dateUtils.toFullSeconds(timePoint) <= dateUtils.toFullSeconds(date)
  );
};

export const milisecondsToTimeKey = milisecond => ([
  Math.floor(milisecond / HOUR),
  Math.floor((milisecond % HOUR) / MINUTE),
  Math.floor((milisecond % HOUR % MINUTE) / SECOND),
]);

/**
 * generates time keys for a given interval for one full day
 */
export const timeKeysFromInterval = (interval) => {
  const entries = [];
  let pointer = 0;
  while (pointer < DAY) {
    entries.push(milisecondsToTimeKey(pointer));
    pointer += interval;
  }
  return entries;
};

const atTime = tickActions => store => next => (action) => {
  if (action.type !== TICK) {
    next(action);
    return;
  }
  const prevState = store.getState();
  const prevDate = new Date(prevState.date.currentTimestamp);
  const date = new Date(action.payload);
  next(action);

  Object.entries(tickActions).forEach(([time, tickAction]) => {
    // ´time´ should normally be an array, but in older node versions it converts to
    // a string. This is probably a bug in the babel polyfill, needs further investment...
    const timeKey = !Array.isArray(time) ?
      time.split(',').map(t => parseInt(t, 10)) :
      time;
    if (isTimeRangeBetweenDates(timeKey, prevDate, date)) {
      store.dispatch(tickAction(prevState));
    }
  });
};

const every = (interval, actionCreator) => {
  const timeKeys = timeKeysFromInterval(interval);
  const entries = {};
  timeKeys.forEach((timeKey) => {
    entries[timeKey] = actionCreator;
  });
  return atTime(entries);
};

const onAction = (...args) => store => next => (action) => {
  const prevState = store.getState();
  next(action);
  const state = store.getState();
  const [actionCreator, ...condititons] = [...args].reverse();
  if (
    !condititons.length ||
    condititons.reverse().every(condition => condition(state, prevState))
  ) {
    actionCreator(store.dispatch, store.getState);
  }
};

export default { atTime, every, onAction };
