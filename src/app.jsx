import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import "./styles/styles.css";
import theme from "./theme";
import store from "./store/store";
import AppRouter from "./routers/AppRouter";
import AlertDialog from "./components/ui/AlertDialog";

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <AlertDialog />
      <SnackbarProvider maxSnack={1}>
        <AppRouter />
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("app"));
