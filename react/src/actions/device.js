export const POWER_STATE_CHANGE = Symbol('POWER_STATE_CHANGE');

const powerAction = (id, powerState) => ({
  type: POWER_STATE_CHANGE,
  payload: { powerState },
  meta: {
    id,
  },
});

export default {
  powerToggle: id => (dispatch, getState) => {
    const device = getState().devices.find(d => d.id === id);
    const nextState = device.powerState === 1 ? 0 : 1;
    dispatch(powerAction(id, nextState));
  },
  powerOff: id => powerAction(id, 0),
  powerOn: id => powerAction(id, 1),
};
