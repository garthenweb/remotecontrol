import { ADD_SOCKET, REMOVE_SOCKET } from '../actions/socket';

export default function (state = [], action) {
  switch (action.type) {
    case ADD_SOCKET:
      return [...state, action.payload];

    case REMOVE_SOCKET:
      return state.filter(socket => socket !== action.payload);

    default:
      return state;
  }
}
