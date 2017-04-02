import { ACTIVATE_POWER_POINT, DEACTIVATE_POWER_POINT } from '../actions/devicePowerPoint';
import sendSignal from '../../sender/power';

const middleware = () => next => (action) => {
  switch (action.type) {
    case ACTIVATE_POWER_POINT:
      sendSignal('on', action.payload);
      break;

    case DEACTIVATE_POWER_POINT:
      sendSignal('off', action.payload);
      break;

    default:
      // null
  }

  return next(action);
};

export default middleware;
