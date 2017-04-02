import { ACTIVATE_POWER_POINT, DEACTIVATE_POWER_POINT } from '../actions/devicePowerPoint';

export default function (state = {}, action) {
  switch (action.type) {
    case ACTIVATE_POWER_POINT:
      return {
        ...state,
        [action.payload]: true,
      };

    case DEACTIVATE_POWER_POINT:
      return {
        ...state,
        [action.payload]: false,
      };

    default:
      return state;
  }
}
