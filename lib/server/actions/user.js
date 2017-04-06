export const SET_LOCATION = Symbol('SET_LOCATION');

export const setLocation = location => ({
  type: SET_LOCATION,
  payload: location,
});
