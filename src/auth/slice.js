import { createSlice } from '@reduxjs/toolkit';

const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('jwtToken'),
    pending: false,
    error: null,
  },
  reducers: {
    startAuthRequest: (state) => {
      state.pending = true;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    authSuccess: (state, action) => {
      const { token } = action.payload;
      localStorage.setItem('jwtToken', token);
      state.token = token;
      state.pending = false;
      state.error = null;
    },
  },
});

export default AuthSlice;
