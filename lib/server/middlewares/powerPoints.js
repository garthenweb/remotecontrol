import sendSignal from '../../sender/power';
import { Device as YeelightDevice } from 'yeelight.js';
import { POWER_STATE_CHANGE, UPSERT as DEVICE_UPSERT } from '../../../react/src/actions/device';
import createDevice, { POWER_ON } from '../../../react/src/domain/Device';

const sendSignalByType = (settings, turnOn) => {
  switch (settings.type) {
    case 'elro_power':
      sendSignal(turnOn ? 'on' : 'off', settings);
      break;
    case 'yeelight': {
      const light = new YeelightDevice(settings);
      light.powerOn(turnOn ? 'on' : 'off', 'smooth', 1000).catch(() => light.socket.destroy());
      break;
    }
  }
}

const middleware = () => next => (action) => {
  switch (action.type) {
    case POWER_STATE_CHANGE:
    case DEVICE_UPSERT: {
      const device = createDevice(action.payload);
      if (device.props.power) {
        sendSignalByType(action.payload.settings, device.power === POWER_ON);
      }
    }

    default:
      // null
  }

  return next(action);
};

export default middleware;
