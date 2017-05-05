import 'babel-polyfill';

import startServer from './lib/server';
import createStore from './lib/server/store';
import { setDateTime } from './lib/server/actions/date';

const store = createStore();

(function tick() {
  store.dispatch(setDateTime(Date.now()));
  setTimeout(tick, 1000);
}());

startServer();
