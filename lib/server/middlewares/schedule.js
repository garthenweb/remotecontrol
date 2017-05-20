import { TICK } from '../actions/date';
import dateUtils, { DAY, MINUTE, HOUR, SECOND } from '../utils/date';

export const combineDateTime = (timeKey, date) => {
  const timePoint = new Date(date);
  timePoint.setHours(timeKey[0]);
  timePoint.setMinutes(timeKey[1]);
  timePoint.setSeconds(timeKey[2]);
  return timePoint;
};

const isDateBeforeTimeKey = (timeKey, date) => {
  const hours = timeKey[0];
  const minutes = timeKey[1];
  const seconds = timeKey[2];
  const dateHours = date.getHours();
  const dateMinutes = date.getMinutes();
  const dateSeconds = date.getSeconds();
  return (
    dateHours < hours || (
      dateHours === hours &&
      dateMinutes < minutes
    ) || (
      dateHours === hours &&
      dateMinutes === minutes &&
      dateSeconds < seconds
    )
  );
};

export const isTimeRangeBetweenDates = (timeKey, prevDate, date) => {
  // switch of bases is important for jumps between days
  const usePrevAsBase = isDateBeforeTimeKey(timeKey, prevDate);
  const timePoint = combineDateTime(timeKey, usePrevAsBase ? prevDate : date);
  const roundedTimePoint = dateUtils.toFullSeconds(timePoint.getTime());

  return (
    roundedTimePoint > dateUtils.toFullSeconds(prevDate.getTime()) &&
    roundedTimePoint <= dateUtils.toFullSeconds(date.getTime())
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

const atTime = (tickActions) => {
  const tickActionEntries = Object.entries(tickActions).map(([time, tickAction]) => {
      // ´time´ should normally be an array, but in older node versions it converts to
      // a string. This is probably a bug in the babel polyfill, needs further investment...
    const timeKey = !Array.isArray(time) ?
      time.split(',').map(t => parseInt(t, 10)) :
      time;
    while (timeKey.length < 3) {
      timeKey.push(0);
    }
    return [timeKey, tickAction];
  });
  return store => next => (action) => {
    if (action.type !== TICK) {
      next(action);
      return;
    }
    const prevState = store.getState();
    const prevDate = new Date(prevState.date.currentTimestamp);
    const date = new Date(action.payload);
    next(action);

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in tickActionEntries) {
      const tickEntity = tickActionEntries[key];
      if (isTimeRangeBetweenDates(tickEntity[0], prevDate, date)) {
        store.dispatch(tickEntity[1](prevState));
      }
    }
  };
};

const every = (interval, actionCreator) => {
  const timeKeys = timeKeysFromInterval(interval);
  const entries = Object.create(null);
  timeKeys.forEach((timeKey) => {
    entries[timeKey] = actionCreator;
  });
  return atTime(entries);
};

const onAction = (...args) => {
  const [actionCreator, ...conditionsReversed] = [...args].reverse();
  const conditions = conditionsReversed.reverse();
  const hasConditions = Boolean(conditions.length);
  return store => next => (action) => {
    const prevState = store.getState();
    next(action);
    const state = store.getState();
    if (!hasConditions || conditions.every(condition => condition(state, prevState))) {
      actionCreator(store.dispatch, store.getState);
    }
  };
};

export default { atTime, every, onAction };
