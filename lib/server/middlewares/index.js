import { applyMiddleware } from 'redux';

import powerPoints from './powerPoints';
import syncClients from './syncClients';

export default applyMiddleware(powerPoints, syncClients);
