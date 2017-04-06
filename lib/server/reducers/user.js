import { SET_LOCATION } from '../actions/user';

const defaultState = { location: null };
export default function (state = defaultState, action) {
  switch (action.type) {
    case SET_LOCATION:
      return { ...state, location: action.payload };

    default:
      return state;
  }
}
