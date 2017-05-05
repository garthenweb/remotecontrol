import { combineReducers } from 'redux';

import devices from './devices';
import sockets from './sockets';
import user from './user';
import date from './date';
import weather from './weather';

export default combineReducers({
  devices,
  sockets,
  user,
  date,
  weather,
});
