export const ACTIVATE_POWER_POINT = Symbol('ACTIVATE_POWER_POINT');
export const DEACTIVATE_POWER_POINT = Symbol('DEACTIVATE_POWER_POINT');

export const activate = unitCode => ({
  type: ACTIVATE_POWER_POINT,
  payload: unitCode,
});

export const deactivate = unitCode => ({
  type: DEACTIVATE_POWER_POINT,
  payload: unitCode,
});
