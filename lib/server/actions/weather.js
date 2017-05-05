import fetch from 'node-fetch';
import idUtil from '../utils/id';

import locals from '../../../locals.json';

export const SET_SUN_STATE = Symbol('SET_SUN_STATE');

const setSunState = payload => ({
  type: SET_SUN_STATE,
  payload,
});

const importSunState = () => async (dispatch, getState) => {
  const { weather = [], date } = getState();
  const { currentTimestamp } = date;
  const id = idUtil.getWeatherId(currentTimestamp);
  if (weather[id]) {
    return;
  }

  // @todo define correct date
  const req = await fetch(`https://api.sunrise-sunset.org/json?lat=${locals.lat}&lng=${locals.lng}&date=today&formatted=0`);
  const { results, status } = await req.json();
  if (status === 'OK') {
    dispatch(setSunState({
      id,
      sunrise: new Date(results.sunrise).getTime(),
      sunset: new Date(results.sunset).getTime(),
    }));
  }
};

export default { importSunState };
