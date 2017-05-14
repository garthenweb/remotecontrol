import util from 'util';

import { TICK } from '../actions/date';

const middleware = () => next => (action) => {
  // do not log tick actions
  if (action.type === TICK) {
    return next(action);
  }
  console.log(`[${new Date().toISOString()}] ${util.inspect(action, { depth: 1 })}`);
  return next(action);
};

export default middleware;
