import sendSignal from '../../sender/power';
import { Device as YeelightDevice } from 'yeelight.js';
import { POWER_STATE_CHANGE, UPSERT as DEVICE_UPSERT } from '../../../react/src/actions/device';
import createDevice, { POWER_ON } from '../../../react/src/domain/Device';

const middleware = () => next => (action) => {
  switch (action.type) {
    case POWER_STATE_CHANGE:
    case DEVICE_UPSERT: {
      const device = createDevice(action.payload);
      const turnOn = device.props.power === POWER_ON;
      if (!device.props.power) {
        break;
      }

      switch (action.payload.settings.type) {
        case 'elro_power':
          sendSignal(turnOn ? 'on' : 'off', action.payload.settings);
          break;
        case 'yeelight': {
          const light = new YeelightDevice(action.payload.settings);
          light.toggle().catch(() => light.socket.destroy());
        }
      }
      break;
    }

    default:
      // null
  }

  return next(action);
};

export default middleware;
