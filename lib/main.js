import startServer from './server';
import createStore from './server/store';
import { setDateTime } from './server/actions/date';
import { setLocation } from './server/actions/user';
import locals from '../locals.json';

const store = createStore();

(function tick() {
  store.dispatch(setDateTime(Date.now()));
  setTimeout(tick, locals.tickInterval);
}());

startServer(process.env.PORT || 3001);
