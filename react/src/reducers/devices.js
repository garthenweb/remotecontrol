import { POWER_STATE_CHANGE } from '../actions/device';
import createDevice, { POWER_OFF } from '../domain/Device';

const initialState = [
  createDevice({
    id: '1',
    name: 'TV',
    state: {
      power: POWER_OFF,
    },
    props: {
      powerToggle: true,
    },
  }),
  createDevice({
    id: '2',
    name: 'Background Light',
    state: {
      power: POWER_OFF,
    },
    props: {
      powerToggle: true,
    },
  }),
  createDevice({
    id: '3',
    name: 'Window Light',
    state: {
      power: POWER_OFF,
    },
    props: {
      powerToggle: true,
    },
  }),
];

const reduceDevice = (device, action) => {
  const ids = [].concat(action.meta.id);
  if (ids.includes(device.id)) {
    return device.copy(action.payload);
  }
  return device;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POWER_STATE_CHANGE:
      return state.map(device => reduceDevice(device, action));

    default:
      return state;
  }
};
