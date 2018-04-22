import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import rootReducer from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import sync from './middleware/sync';

const store = createStore(rootReducer, applyMiddleware(thunk, sync));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
