import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/styles";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
// import AppRouter from "./routers/AppRouter";
import "./styles/styles.css";
import theme from "./theme";
import configureStore from "./store/config/configureStore";

const store = configureStore();

store.subscribe(() => {
  // console.log(store.getState());
});

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={1}>
        {/* <AppRouter /> */}
        <div>abc</div>
      </SnackbarProvider>
    </ThemeProvider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById("app"));
