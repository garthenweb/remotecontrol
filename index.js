import 'babel-polyfill';
// import fetch from 'node-fetch';

import startServer, { sockets } from './lib/server';
import createStore from './lib/server/store';
import { activate, deactivate } from './lib/server/actions/devicePowerPoint';
import { add as addSocket, remove as removeSocket } from './lib/server/actions/socket';
import { setLocation } from './lib/server/actions/user';
import { lookup } from './lib/service/bluethooth';
import locals from './locals.json';

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

(async function locationState() {
  const lookUps = locals.bdaddrs.map(async (addr) => {
    const inRange = Boolean(await lookup(addr));
    store.dispatch(setLocation(inRange ? 'in_range' : null));
  });
  await Promise.all(lookUps);
  setTimeout(locationState, 30000);
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
