import CssBaseline from '@material-ui/core/CssBaseline';
import { nest } from 'recompose';

import Routing from './routing';
import StoreProvider from './store';

export default nest(
  CssBaseline,
  StoreProvider,
  Routing,
);
