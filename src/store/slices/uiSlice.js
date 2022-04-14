/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const UISlice = createSlice({
  name: "ui",
  initialState: {
    isFetching: false,
    dialogOpen: false,
    dialogProps: {},
    dialogTitle: null,
    dialogContent: null,
    dialogActions: null,
    snackbars: [],
  },
  reducers: {
    // creating reducers
    changeFetching: (state, action) => {
      state.isFetching = action.payload;
    },
    showDialog: (state, action) => {
      const { title, props, content, actions } = action.payload;
      state.dialogOpen = true;
      state.dialogProps = props;
      state.dialogTitle = title;
      state.dialogContent = content;
      state.dialogActions = actions;
    },
    closeDialog: (state) => {
      state.dialogOpen = false;
      state.dialogProps = [];
      state.dialogTitle = null;
      state.dialogContent = null;
      state.dialogActions = null;
    },
    enqueueSnackbar: (state, action) => {
      const { key, notification } = action.payload;
      state.snackbars = [
        ...state.snackbars,
        { key: key || Date.now() + Math.random(), notification },
      ];
    },
    closeSnackbar: (state, action) => {
      const { dismisAll, key } = action.payload;
      state.snackbars = state.snackbars.map((not) =>
        dismisAll || key === not.key ? { ...not, dismissed: true } : not
      );
    },
    removeSnackbar: (state, action) => {
      state.snackbars = state.snackbars.filter(
        (noti) => noti.key !== action.payload
      );
    },
  },
});

export const {
  changeFetching,
  showDialog,
  closeDialog,
  enqueueSnackbar,
  closeSnackbar,
  removeSnackbar,
} = UISlice.actions; // actions auto generated from above reducers
export default UISlice.reducer; // exporting the reducer
