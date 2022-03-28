/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const UISlice = createSlice({
  name: "ui",
  initialState: {
    dialogOpen: false,
    dialogProps: {},
    dialogTitle: null,
    dialogContent: null,
    dialogActions: null,
  },
  reducers: {
    // creating reducers
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
  },
});

export const { showDialog, closeDialog } = UISlice.actions; // actions auto generated from above reducers
export default UISlice.reducer; // exporting the reducer
