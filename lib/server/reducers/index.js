import { combineReducers } from 'redux';

import devices from '../../../react/src/reducers/devices';
import sockets from './sockets';
import user from './user';
import date from './date';
import weather from './weather';

import locals from '../../../locals.json';

export default combineReducers({
  devices: devices(locals.devices.map((device, index) => ({ ...device, id: `${index}` }))),
  sockets,
  user,
  date,
  weather,
});
