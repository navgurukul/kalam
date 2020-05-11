import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';

import rootReducer from './rootReducers';

// Redux DevTools Extension for Chrome and Firefox
const reduxDevTool = () => {
  return typeof window === 'object'
    && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (f) => f;
};

// history is passed here, for this example, we don't use history
export default function configureStore(initialState, history) { // eslint-disable-line no-unused-vars, max-len
  const middleware = [
    thunk,
  ];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger());
  }

  const composedStoreEnhancer = compose(
    applyMiddleware(...middleware),
    reduxDevTool()
  );

  const store = composedStoreEnhancer(createStore)(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('./rootReducers', () => {
      store.replaceReducer(require('./rootReducers'));
    });
  }

  return store;
}
