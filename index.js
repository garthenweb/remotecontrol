import 'babel-polyfill';
import fs from 'fs';

import startServer from './lib/server';
import createStore from './lib/server/store';
import { setDateTime } from './lib/server/actions/date';
import { setLocation } from './lib/server/actions/user';

try {
  fs.accessSync('./locals.json', fs.constants.F_OK);
} catch (exc) {
  console.error('`locals.json` is not accessible, this is most likely because the file was not created. Please check wether it exists and is accessible!');
  process.exit(1);
}

import locals from './locals.json';

const store = createStore();

(function tick() {
  store.dispatch(setDateTime(Date.now()));
  setTimeout(tick, locals.tickInterval);
}());

startServer(process.env.PORT || 3001);
