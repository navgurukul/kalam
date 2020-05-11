import { nest } from 'recompose';

import Routing from './routing';
import StoreProvider from './store';

export default nest(
  StoreProvider,
  Routing,
);