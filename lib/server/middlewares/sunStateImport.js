import schedule from './schedule';

import weather from '../actions/weather';
import { DAY } from '../utils/date';

export default (store) => {
  // download sunsete for tomorrow and today when immediatley
  // before the middleware is created
  weather.importSunState()(store.dispatch, store.getState);
  weather.importSunState(DAY)(store.dispatch, store.getState);
  return schedule.atTime({
    [[0, 0]]: () => weather.importSunState(DAY),
    [[1, 0]]: () => weather.importSunState(DAY),
  })(store);
};
