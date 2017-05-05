import { applyMiddleware } from 'redux';

import powerPoints from './powerPoints';
import syncClients from './syncClients';
import automatisms from './automatisms';
import schedule from './schedule';

import { setLocation } from '../../../lib/server/actions/user';
import { lookup } from '../../../lib/service/bluethooth';
import locals from '../../../locals.json';
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
  ...locals.bdaddrs.map(addr => schedule.every(30000, dispatch => async () => {
    const inRange = Boolean(await lookup(addr));
    return dispatch(setLocation(inRange ? 'in_range' : null));
  })),
  // powerSchedule,
  // sunStateImport,
);
