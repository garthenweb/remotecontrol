import 'babel-polyfill';

import startServer from './lib/server';
import createStore from './lib/server/store';
import { setDateTime } from './lib/server/actions/date';
import locals from './locals.json';

const store = createStore();

(function tick() {
  store.dispatch(setDateTime(Date.now()));
  setTimeout(tick, locals.tickInterval);
}());

startServer();
