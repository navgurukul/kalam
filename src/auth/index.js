import AuthSlice from './slice';
import * as selectors from './selectors';

export const {
  startAuthRequest,
  authFailure,
  authSuccess,
} = AuthSlice.actions;

export { AuthSlice, selectors };
