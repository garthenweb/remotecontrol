export const ADD_SOCKET = Symbol('ADD_SOCKET');
export const REMOVE_SOCKET = Symbol('REMOVE_SOCKET');

export const add = socket => ({
  type: ADD_SOCKET,
  payload: socket,
});

export const remove = socket => ({
  type: REMOVE_SOCKET,
  payload: socket,
});
