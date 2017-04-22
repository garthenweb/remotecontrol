import { TICK } from '../actions/date';

const MINUTE = 1000 * 60;
const toFullMinutes = time => Math.floor(time / MINUTE) * MINUTE;

export const isTimeRangeBetweenDates = (time, prevDate, date) => {
  const [hours, minutes] = time;
  const prevHours = prevDate.getHours();
  const prevMinutes = prevDate.getMinutes();

  // switch of bases is important for jumps between days
  const usePrevAsBase = (
    prevHours < hours || (
      prevHours === hours &&
      prevMinutes < minutes
    )
  );

  const timePoint = new Date(usePrevAsBase ? prevDate : date);
  timePoint.setHours(hours);
  timePoint.setMinutes(minutes);

  return (
    toFullMinutes(timePoint) > toFullMinutes(prevDate) &&
    toFullMinutes(timePoint) <= toFullMinutes(date)
  );
};

const atTime = tickActions => store => next => (action) => {
  if (action.type !== TICK) {
    return;
  }
  const prevState = store.getState();
  const prevDate = new Date(prevState.date.currentTimestamp);
  const date = new Date(action.payload);
  const state = next(action);

  Object.entries(tickActions).forEach(([time, tickAction]) => {
    // ´time´ should normally be an array, but in older node versions it converts to
    // a string. This is probably a bug in the babel polyfill, needs further investment...
    const timeArr = !Array.isArray(time) ?
      time.split(',').map(t => parseInt(t, 10)) :
      time;
    if (isTimeRangeBetweenDates(timeArr, prevDate, date)) {
      store.dispatch(tickAction(state, prevState));
    }
  });
};

export default { atTime };
