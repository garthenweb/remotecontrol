export const ACTIVATE_POWER_POINT = Symbol('ACTIVATE_POWER_POINT');
export const DEACTIVATE_POWER_POINT = Symbol('DEACTIVATE_POWER_POINT');

export const activate = unit => ({
  type: ACTIVATE_POWER_POINT,
  payload: unit,
});

export const deactivate = unit => ({
  type: DEACTIVATE_POWER_POINT,
  payload: unit,
});
