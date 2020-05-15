import { createSelector } from 'reselect';
import get from 'lodash/get';

import AuthSlice from './slice';

export const selectAuthToken = (state) => get(state, `${AuthSlice.name}.token`);
export const selectAuthPending = (state) => get(state, `${AuthSlice.name}.pending`);
export const selectAuthError = (state) => get(state, `${AuthSlice.name}.error`);

export const selectIsAuthorized = createSelector(
  selectAuthToken,
  (authToken) => (authToken !== null)
);
