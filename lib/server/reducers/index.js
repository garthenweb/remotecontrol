import { combineReducers } from 'redux';

import devices from './devices';
import sockets from './sockets';
import user from './user';

export default combineReducers({
  devices,
  sockets,
  user,
});
