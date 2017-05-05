import schedule from './schedule';

import weather from '../actions/weather';

export default schedule.atTime({
  [[0, 0]]: weather.importSunState,
  [[2, 0]]: weather.importSunState,
  [[4, 0]]: weather.importSunState,
});
