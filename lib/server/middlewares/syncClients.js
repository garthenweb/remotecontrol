import { ADD_SOCKET } from '../actions/socket';
import { ACTIVATE_POWER_POINT, DEACTIVATE_POWER_POINT } from '../actions/devicePowerPoint';

const middleware = store => next => (action) => {
  switch (action.type) {
    case ADD_SOCKET:
    case ACTIVATE_POWER_POINT:
    case DEACTIVATE_POWER_POINT: {
      next(action);
      const { sockets, devices } = store.getState();
      sockets.forEach((socket) => {
        socket.emit('device:sync', devices);
      });
      break;
    }

    default:
      next(action);
      break;
  }
};

export default middleware;
