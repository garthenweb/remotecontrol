import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import powerPoints from './powerPoints';
import logger from './logger';
import sockets from './sockets';
import locationLookup from './locationLookup';
import powerSchedule from './powerSchedule';
import sunStateImport from './sunStateImport';

export default applyMiddleware(
  thunk,
  logger,
  powerPoints,
  sockets,
  powerSchedule.activateLightOnEnter,
  powerSchedule.deactivatePowerOnLeave,
  ...locationLookup,
  sunStateImport,
);
