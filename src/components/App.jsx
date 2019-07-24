import { Button, createMuiTheme } from "@material-ui/core";
import { amber } from "@material-ui/core/colors";
import { ThemeProvider, withTheme } from "@material-ui/styles";
import _ from "lodash";
import { SnackbarProvider, withSnackbar } from "notistack";
import React from "react";
import { connect } from "react-redux";
import { Route, Router } from "react-router";
import {
    setDownloadError,
    setMaximized,
    updateProgress,
    showStatusBar,
} from "../actions";
import history from "../history";
import "./App.scss";
import "./global.scss";
import LandingPage from "./LandingPage";
import SelectionPage from "./selection-page/SelectionPage";
import TotalProgress from "./TotalProgress";
import TitleBar from "./window-controls/TitleBar";
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
        return (
            <ThemeProvider
                theme={this.state.dark ? appThemeDark : appThemeLight}
            >
                <SnackbarProvider
                    maxSnack={3}
                    hideIconVariant
                    ContentProps={{
                        style: {
                            color: "white",
                        },
                    }}
                >
                    <TitleBar />
                    <AppLevelErrorSnacks />
                    <div className="app-content">
                        <Router history={history}>
                            <Route path="/" exact component={LandingPage} />
                            <Route
                                path="/select"
                                exact
                                component={SelectionPage}
                            />
                        </Router>
                    </div>
                    <TotalProgress />
                </SnackbarProvider>
            </ThemeProvider>
        );
    }
}

class __RawAppLevelErrorSnacks extends React.Component {
    closeAction = (
        key // This used to be wrapped in fragments. I do not know why
    ) => (
        <Button
            onClick={() => {
                this.props.closeSnackbar(key);
            }}
        >
            Okay
        </Button>
    );

    componentDidMount() {
        ipcRenderer.on("ytdl:download-error", (event, { err, id }) => {
            console.error(`An error occurred while downloading ${id}`, err);
            this.props.setDownloadError(id, err);
            this.props.updateProgress();
            this.props.enqueueSnackbar(
                `An error occurred while downloading ${id}.`,
                {
                    key: `download_error_${id}`,
                    persist: true,
                    action: this.closeAction,
                    variant: "error",
                }
            );
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps === this.props) return;

        if (this.props.percent === 100 && this.props.statusBar) {
            this.props.showStatusBar(false);
        }

        const newErrors = _.difference(this.props.errors, prevProps.errors);
        if (newErrors.length !== 0) {
            newErrors.forEach(err => {
                console.error("An error occurred:", err);
                this.props.enqueueSnackbar(err, {
                    persist: true,
                    action: this.closeAction,
                    variant: "error",
                });
            });
        }
    }

    render() {
        console.log("Snacker Theme: ", this.props.theme);
        return <></>;
    }
}

const __UnconnectedAppLevelErrorSnacks = withTheme(
    withSnackbar(__RawAppLevelErrorSnacks)
);

const mapStateToPropsForAppLevelErrorSnacks = state => {
    return {
        errors: state.jobs.errors,
        percent: state.progress.totalProgress,
        statusBar: state.progress.statusBar,
    };
};

const AppLevelErrorSnacks = connect(
    mapStateToPropsForAppLevelErrorSnacks,
    { setDownloadError, updateProgress, showStatusBar }
)(__UnconnectedAppLevelErrorSnacks);

export default connect(
    null,
    { setMaximized }
)(App);
