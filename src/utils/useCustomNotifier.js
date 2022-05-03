import { useSnackbar } from "notistack";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeSnackbar } from "../store/slices/uiSlice";

let displayed = [];

const useCustomNotifier = () => {
  const dispatch = useDispatch();
  const snackbars = useSelector((state) => state.ui.snackbars || []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  React.useEffect(() => {
    snackbars.forEach(({ key, message, options = {}, dismissed = false }) => {
      if (dismissed) {
        closeSnackbar(key);
        return;
      }

      if (displayed.includes(key)) return;

      enqueueSnackbar(message, {
        key,
        ...options,
        onClose: (ev, reason, mKey) => {
          if (options.onClose) options.onClose(ev, reason, mKey);
        },
        onExited: (ev, mKey) => {
          dispatch(removeSnackbar(mKey));
          removeDisplayed(mKey);
        },
      });

      storeDisplayed(key);
    });
  }, [snackbars, closeSnackbar, enqueueSnackbar, dispatch]);
};

export default useCustomNotifier;
