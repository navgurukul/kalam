import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import './styles/styles.css';
import { theme } from './theme/theme';
import configureStore from './store/config/configureStore';

const store = configureStore();

store.subscribe(() => {
  // console.log(store.getState());
});

const App = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <AppRouter />
      </SnackbarProvider>
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('app'));