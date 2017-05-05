import { SET_SUN_STATE } from '../actions/weather';

const reduceWeatherItem = (state = {}, action) => {
  switch (action.type) {
    case SET_SUN_STATE: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
};

const defaultState = {};
export default function (state = defaultState, action) {
  switch (action.type) {
    case SET_SUN_STATE: {
      return {
        ...state,
        [action.payload.id]: reduceWeatherItem(state[action.payload.id], action),
      };
    }

    default:
      return state;
  }
}
