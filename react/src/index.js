import React from 'react';
import { createRoot } from 'react-dom/client';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import rootReducer from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import sync from './middleware/sync';

const store = createStore(rootReducer, applyMiddleware(thunk, sync));

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
registerServiceWorker();
