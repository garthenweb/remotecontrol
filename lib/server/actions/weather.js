import fetch from 'node-fetch';

import locals from '../../../locals.json';

export const SET_SUN_STATE = Symbol('SET_SUN_STATE');

const createWeatherId = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const setSunState = payload => ({
  type: SET_SUN_STATE,
  payload,
});

const importSunState = () => async (dispatch, getState) => {
  const { weather = [], date } = getState();
  const { currentTimestamp } = date;
  const id = createWeatherId(currentTimestamp);
  if (weather[id]) {
    return;
  }

  // @todo define correct date
  const req = await fetch(`https://api.sunrise-sunset.org/json?lat=${locals.lat}&lng=${locals.lng}&date=today&formatted=0`);
  const { results, status } = await req.json();
  if (status === 'OK') {
    dispatch(setSunState({
      id,
      sunrise: results.sunrise,
      sunset: results.sunset,
    }));
  }
};

export default { importSunState };
