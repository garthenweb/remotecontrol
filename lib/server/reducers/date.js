import { TICK } from '../actions/date';

const defaultState = {
  currentTimestamp: Date.now(),
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case TICK: {
      return {
        ...state,
        currentTimestamp: action.payload,
      };
    }

    default:
      return state;
  }
}
