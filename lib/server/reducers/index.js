import { combineReducers } from 'redux';

import devices from './devices';
import sockets from './sockets';
import user from './user';
import date from './date';

export default combineReducers({
  devices,
  sockets,
  user,
  date,
});
