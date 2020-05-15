import { combineReducers } from 'redux';

import { AuthSlice } from '../../auth';

export default combineReducers({
  [AuthSlice.name]: AuthSlice.reducer,
});
