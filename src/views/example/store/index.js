import ExampleSlice from './slice';
import * as selectors from './selectors';

export const {
  updateValueX,
  updateValueY,
  incrementValueZ,
} = ExampleSlice.actions;

export { ExampleSlice, selectors };
