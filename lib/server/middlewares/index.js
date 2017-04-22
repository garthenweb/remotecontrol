import { applyMiddleware } from 'redux';

import powerPoints from './powerPoints';
import syncClients from './syncClients';
import automatisms from './automatisms';
import schedule from './schedule';
// import powerSchedule from './powerSchedule';
// import sunStateImport from './sunStateImport';

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
  syncClients,
  automatisms,
  schedule.atTime({
    [[23, 7]]: () => ({ type: 'log' }),
  }),
  // powerSchedule,
  // sunStateImport,
);
