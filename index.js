import 'babel-polyfill';
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

locals.bdaddrs.forEach((addr) => {
  setInterval(async () => {
    const inRange = Boolean(await lookup(addr));
    store.dispatch(setLocation(inRange ? 'in_range' : null));
  }, 30000);
});

startServer();
