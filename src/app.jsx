import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
// import AppRouter from "./routers/AppRouter";
import "./styles/styles.css";
import { Typography } from "@mui/material";
import theme from "./theme";
import store from "./store/store";

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={1}>
        {/* <AppRouter /> */}
        <Typography color="primary">abc</Typography>
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("app"));
