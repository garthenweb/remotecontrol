import 'babel-polyfill';
import fs from 'fs';

import startServer from './lib/server';
import createStore from './lib/server/store';
import { setDateTime } from './lib/server/actions/date';
import { setLocation } from './lib/server/actions/user';

try {
  fs.accessSync('./locals.json', fs.constants.F_OK);
} catch (exc) {
  console.error('`locals.json` is not accessible. The file needs to be created by hand and contains configuration about the devices you want to control. In case it exists in the root folder of this project, please check whether the access rights are granted for the same user you are executing the script with. Please see the documentation for more information.');
  process.exit(1);
}

import locals from './locals.json';

const store = createStore();

(function tick() {
  store.dispatch(setDateTime(Date.now()));
  setTimeout(tick, locals.tickInterval);
}());

startServer(process.env.PORT || 3001);
