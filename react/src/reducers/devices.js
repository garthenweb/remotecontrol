import { POWER_STATE_CHANGE, UPSERT } from '../actions/device';
import createDevice from '../domain/Device';

const deviceListToInitialState = devices =>
  devices.reduce((map, device) => {
    // eslint-disable-next-line no-param-reassign
    map[device.id] = createDevice(device);
    return map;
  }, {});

const reduceDevice = (device, action) => {
  const ids = [].concat(action.meta.id);
  if (ids.includes(device.id)) {
    return device.copy(action.payload);
  }
  return device;
};

export default (initialDevices = []) => (
  state = deviceListToInitialState(initialDevices),
  action,
) => {
  switch (action.type) {
    case POWER_STATE_CHANGE:
      return Object.entries(state).reduce((map, [id, device]) => {
        // eslint-disable-next-line no-param-reassign
        map[id] = reduceDevice(device, action);
        return map;
      }, {});

    case UPSERT: {
      const maybeDevice = state[action.meta.id];
      const device = maybeDevice
        ? maybeDevice.copy(action.payload.state, action.payload.settings)
        : createDevice(action.payload);
      return {
        ...state,
        [action.meta.id]: device,
      };
    }

    default:
      return state;
  }
};
