import { combineReducers } from 'redux';

import devices from './devices';
import sockets from './sockets';

export default combineReducers({
  devices,
  sockets,
});
