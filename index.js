import 'babel-polyfill';
// import fetch from 'node-fetch';

import startServer, { sockets } from './lib/server';
import createStore from './lib/server/store';
import { activate, deactivate } from './lib/server/actions/devicePowerPoint';
import { setDateTime } from './lib/server/actions/date';
import { add as addSocket, remove as removeSocket } from './lib/server/actions/socket';

const store = createStore();

sockets.on('connection', (socket) => {
  store.dispatch(addSocket(socket));
  socket.on('device:mutate', ({ unitCode, state }) => {
    const action = state ? activate : deactivate;
    if (Array.isArray(unitCode)) {
      unitCode.forEach(code => store.dispatch(action(code)));
    } else {
      store.dispatch(action(unitCode));
    }
  });
  socket.on('disconnect', () => {
    store.dispatch(removeSocket(socket));
  });
});

(function tick() {
  store.dispatch(setDateTime(Date.now()));
  setTimeout(tick, 1000);
}());

// (async function sunState() {
//   const req = await fetch(`https://api.sunrise-sunset.org/json?lat=${locals.lat}&lng=${locals.lng}&date=today&formatted=0`);
//   const { results, status } = await req.json();
//   if (status === 'OK') {
//     console.log(results.sunrise, results.sunset);
//   }
//   setTimeout(sunState, 12 * 60 * 60 * 1000);
// }());

startServer();
