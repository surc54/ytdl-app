import { createMuiTheme } from "@material-ui/core";
import { amber } from "@material-ui/core/colors";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import "./App.scss";
import "./global.scss";
import LandingPage from "./LandingPage";
import TitleBar from "./window-controls/TitleBar";
import { connect } from "react-redux";
import { setMaximized } from "../actions";
import { Router, Route } from "react-router";
import history from "../history";
import SelectionPage from "./selection-page/SelectionPage";
const { ipcRenderer, remote } = window.require("electron");

const appThemeDark = createMuiTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 700,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    palette: {
        type: "dark",
        primary: amber,
        secondary: {
            main: "#BED0DF",
        },
    },
});

const appThemeLight = createMuiTheme({
    breakpoints: {
        sm: 700,
    },
    palette: {
        type: "light",
        primary: {
            main: "#E2790C",
        },
        secondary: {
            main: "#324c61",
        },
    },
});

/*  TODO:
    EVERYTHING
 */

class App extends React.Component {
    state = {
        dark: true,
    };

    componentDidMount() {
        const body = document.querySelector("body");

        if (this.state.dark && body) body.className = "dark";

        this.props.setMaximized(remote.getCurrentWindow().isMaximized());

        ipcRenderer.on("window:maximized", () => {
            console.log("Window maximize detected");
            this.props.setMaximized(true);
        });

        ipcRenderer.on("window:unmaximized", () => {
            console.log("Window unmaximize detected");
            this.props.setMaximized(false);
        });
    }

    render() {
        console.log(appThemeDark);
        return (
            <ThemeProvider
                theme={this.state.dark ? appThemeDark : appThemeLight}
            >
                <TitleBar />
                <div className="app-content">
                    <Router history={history}>
                        <Route path="/" exact component={LandingPage} />
                        <Route path="/select" exact component={SelectionPage} />
                    </Router>
                </div>
            </ThemeProvider>
        );
    }
}

export default connect(
    null,
    { setMaximized }
)(App);
