import { applyMiddleware } from 'redux';

import powerPoints from './powerPoints';
import syncClients from './syncClients';
import automatisms from './automatisms';

export default applyMiddleware(powerPoints, syncClients, automatisms);
