import { SET_LOCATION } from '../actions/user';

const defaultState = {
  location: {
    state: null,
    pending: false,
    lastChecked: null,
  },
};
export default function (state = defaultState, action) {
  switch (action.type) {
    case SET_LOCATION:
      return { ...state, location: action.payload };

    default:
      return state;
  }
}
