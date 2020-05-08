import { combineReducers } from 'redux';
// import example from './modules/example';

import { ExampleSlice } from '../views/example/store';

export default combineReducers({
  [ExampleSlice.name]: ExampleSlice.reducer,
});
