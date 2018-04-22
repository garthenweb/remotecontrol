import sendSignal from '../../sender/power';
import { POWER_STATE_CHANGE, UPSERT as DEVICE_UPSERT } from '../../../react/src/actions/device';
import createDevice, { POWER_ON } from '../../../react/src/domain/Device';

const middleware = () => next => (action) => {
  switch (action.type) {
    case POWER_STATE_CHANGE:
    case DEVICE_UPSERT: {
      if (action.payload.settings.type === 'elro_power') {
        const signal = createDevice(action.payload).power === POWER_ON ? 'on' : 'off';
        sendSignal(signal, action.payload.settings);
      }
      break;
    }

    default:
      // null
  }

  return next(action);
};

export default middleware;
