import 'babel-polyfill';
import startServer, { sockets } from './lib/server';
import createStore from './lib/server/store';
import { activate, deactivate } from './lib/server/actions/devicePowerPoint';
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

startServer();
