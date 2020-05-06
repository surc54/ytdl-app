import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import "./global.scss";
import App from "./views/App";
import * as serviceWorker from "./serviceWorker";
import WindowControls from "./components/WindowControls";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import reducers from "./reducers";

const theme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

const store = createStore(reducers, applyMiddleware(reduxThunk));

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <React.StrictMode>
                <WindowControls />
                <App />
            </React.StrictMode>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
