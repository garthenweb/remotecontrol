import { ADD_SOCKET } from '../actions/socket';
import { ACTIVATE_POWER_POINT, DEACTIVATE_POWER_POINT } from '../actions/devicePowerPoint';
import { sockets } from '..';
import { activate, deactivate } from '../actions/devicePowerPoint';
import { add as addSocket, remove as removeSocket } from '../actions/socket';

const middleware = (store) => {
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

  return next => (action) => {
    switch (action.type) {
      case ADD_SOCKET:
      case ACTIVATE_POWER_POINT:
      case DEACTIVATE_POWER_POINT: {
        next(action);
        const { sockets: stateSockets, devices } = store.getState();
        stateSockets.forEach((socket) => {
          socket.emit('device:sync', devices);
        });
        break;
      }

      default:
        next(action);
        break;
    }
  };
};

export default middleware;
