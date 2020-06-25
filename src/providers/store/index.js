import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './configureStore';
import history from '../routing/app-history';

const store = configureStore({}, history);

const StoreProvider = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default StoreProvider;
