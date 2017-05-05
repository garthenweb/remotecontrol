import { applyMiddleware } from 'redux';

import powerPoints from './powerPoints';
import sockets from './sockets';
import locationLookup from './locationLookup';
import powerSchedule from './powerSchedule';
import sunStateImport from './sunStateImport';

const thunk = store => next => (action) => {
  if (typeof action === 'function') {
    action(store.dispatch, store.getState);
    return;
  }
  next(action);
};

export default applyMiddleware(
  thunk,
  powerPoints,
  sockets,
  powerSchedule.activateLightOnEnter,
  powerSchedule.deactivatePowerOnLeave,
  ...locationLookup,
  sunStateImport,
);
