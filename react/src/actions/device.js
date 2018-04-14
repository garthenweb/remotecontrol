import { togglePower, POWER_OFF, POWER_ON } from '../domain/Device';

export const POWER_STATE_CHANGE = Symbol('POWER_STATE_CHANGE');

const powerAction = (id, powerState) => ({
  type: POWER_STATE_CHANGE,
  payload: powerState,
  meta: {
    id,
  },
});

export default {
  powerToggle: id => powerAction(id, togglePower),
  powerOff: id => powerAction(id, { power: POWER_OFF }),
  powerOn: id => powerAction(id, { power: POWER_ON }),
};
