import { ADD_SOCKET } from '../actions/socket';
import powerActions, { POWER_STATE_CHANGE, UPSERT as DEVICE_UPSERT } from '../../../react/src/actions/device';
import { sockets } from '..';
import { add as addSocket, remove as removeSocket } from '../actions/socket';

const middleware = (store) => {
  sockets.on('connection', (socket) => {
    store.dispatch(addSocket(socket));
    socket.on('device:mutate', (devices) => {
      const state = store.getState();
      if (Array.isArray(devices)) {
        devices.forEach(device => store.dispatch(powerActions.upsert({
          ...device,
          settings: state.devices[device.id].settings,
        })));
      } else {
        store.dispatch(powerActions.upsert({
          ...devices,
          settings: state.devices[device.id].settings,
        }));
      }
    });
    socket.on('disconnect', () => {
      store.dispatch(removeSocket(socket));
    });
  });

  return next => (action) => {
    switch (action.type) {
      case POWER_STATE_CHANGE:
      case DEVICE_UPSERT: {
        next(action);
        const { sockets: stateSockets, devices } = store.getState();
        stateSockets.forEach((socket) => {
          socket.emit('device:sync', devices[action.meta.id].serialize());
        });
        break;
      }

      case ADD_SOCKET: {
        next(action);
        const { sockets: stateSockets, devices } = store.getState();
        stateSockets.forEach((socket) => {
          Object.values(devices).forEach(device => {
            socket.emit('device:sync', device.serialize());
          });
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
