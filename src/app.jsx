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
import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_DSN;
const TRACKING_ID = "G-WG6ZZQHGB8"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

Sentry.init({
  dsn: dsn,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});

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
