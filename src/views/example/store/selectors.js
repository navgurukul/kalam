import get from 'lodash/get';

import ExampleSlice from './slice';

export const selectValueX = (state) => get(state, `${ExampleSlice.name}.valueX`);
export const selectValueY = (state) => get(state, `${ExampleSlice.name}.valueY`);
export const selectValueZ = (state) => get(state, `${ExampleSlice.name}.valueZ`);
