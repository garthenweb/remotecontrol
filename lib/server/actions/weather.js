import fetch from 'node-fetch';
import dateUtil from '../utils/date';

import locals from '../../../locals.json';

export const SET_SUN_STATE = Symbol('SET_SUN_STATE');

const setSunState = payload => ({
  type: SET_SUN_STATE,
  payload,
});

/**
 * downloads the sun state from a third party service and dispaches it
 * @param diff {number} time in milliseconds to be added to the current timestamp
 *                      to import a date in the future or the past relative to the current
 *                      time
*/
const importSunState = (diff = 0) => async (dispatch, getState) => {
  const { weather = [], date } = getState();
  const { currentTimestamp } = date;
  const tomorrow = currentTimestamp + diff;
  const formattedDate = dateUtil.getFormattedDate(tomorrow);
  if (weather[formattedDate]) {
    return;
  }

  const req = await fetch(`https://api.sunrise-sunset.org/json?lat=${locals.lat}&lng=${locals.lng}&date=${formattedDate}&formatted=0`);
  const { results, status } = await req.json();
  if (status === 'OK') {
    dispatch(setSunState({
      id: formattedDate,
      sunrise: new Date(results.sunrise).getTime(),
      sunset: new Date(results.sunset).getTime(),
    }));
  }
};

export default { importSunState };
