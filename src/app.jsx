import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import "./styles/styles.css";
import ReactGA from "react-ga";
import theme from "./theme";
import store from "./store/store";
import AppRouter from "./routers/AppRouter";
import AlertDialog from "./components/ui/AlertDialog";
// const TrackingId = process.env.REACT_APP_GA_TRACKING_ID;
const TrackingId = "G-CZYKER401E";
ReactGA.initialize(TrackingId);

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <AlertDialog />
      <SnackbarProvider maxSnack={2}>
        <AppRouter />
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("app"));
