import { ACTIVATE_POWER_POINT, DEACTIVATE_POWER_POINT } from '../actions/devicePowerPoint';

const reduceDevice = (state, action) => {
  switch (action.type) {
    case ACTIVATE_POWER_POINT:
      return true;
    case DEACTIVATE_POWER_POINT:
      return false;

    default:
      return state;
  }
};

export default function (state = {}, action) {
  switch (action.type) {
    case ACTIVATE_POWER_POINT:
    case DEACTIVATE_POWER_POINT: {
      const id = JSON.stringify(action.payload);
      return {
        ...state,
        [id]: reduceDevice(state[id], action),
      };
    }

    default:
      return state;
  }
}
