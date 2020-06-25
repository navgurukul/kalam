import { createSlice } from '@reduxjs/toolkit';

const ExampleSlice = createSlice({
  name: 'example2',
  initialState: {
    valueX: 1,
    valueY: 2,
    valueZ: 3,
  },
  reducers: {
    updateValueX: (state, action) => {
      state.valueX = action.payload;
    },
    updateValueY: (state, action) => {
      state.valueY = action.payload;
    },
    incrementValueZ: (state) => {
      state.valueZ += 1;
    },
  },
});

export default ExampleSlice;
