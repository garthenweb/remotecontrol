export const TICK = Symbol('TICK');

export const setDateTime = timestamp => ({
  type: TICK,
  payload: timestamp,
});
