import sendSignal from '../../sender/power';
import { Device as YeelightDevice } from 'yeelight.js';
import { POWER_STATE_CHANGE, UPSERT as DEVICE_UPSERT } from '../../../react/src/actions/device';
import createDevice, { POWER_ON } from '../../../react/src/domain/Device';

const sendSignalByType = (settings, signal) => {
  switch (settings.type) {
    case 'elro_power':
      sendSignal(signal, settings);
      break;
    case 'yeelight': {
      const light = new YeelightDevice(settings);
      light.powerOn(signal, 'smooth', 1000).catch(() => light.socket.destroy());
      break;
    }
  }
}

const middleware = (store) => next => (action) => {
  switch (action.type) {
    case POWER_STATE_CHANGE:
    case DEVICE_UPSERT: {
      next(action);
      const device = store.getState().devices[action.meta.id];
      if (device.props.power) {
        sendSignalByType(
          device.settings,
          device.power === POWER_ON ? 'on' : 'off'
        );
      }
      break;
    }

    default:
      next(action);
  }
};

export default middleware;
