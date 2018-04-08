import { POWER_STATE_CHANGE } from '../actions/device';

const POWER_OFF = 0;
const POWER_ON = 1;

const initialState = [
  {
    type: 'power',
    id: '1',
    name: 'TV',
    powerState: POWER_OFF,
  },
  {
    type: 'power',
    id: '2',
    name: 'Background Light',
    powerState: POWER_OFF,
  },
  {
    type: 'power',
    id: '3',
    name: 'Window Light',
    powerState: POWER_ON,
  },
];

const reduceDevice = (state, action) => {
  const ids = [].concat(action.meta.id);
  if (ids.includes(state.id)) {
    return { ...state, ...action.payload };
  }
  return state;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POWER_STATE_CHANGE:
      return state.map(device => reduceDevice(device, action));

    default:
      return state;
  }
};
