import { Container, Typography } from "@material-ui/core";
import React from "react";
import "./LandingPage.scss";
import { connect } from "react-redux";
import SearchBar from "./search-bar/SearchBar";
import { withSnackbar } from "notistack";

const LANDING_PAGE_ERROR_SNACKBAR_KEY = "landing-page-error";

const LandingPage = ({
    resultError,
    sameErrCounter,
    enqueueSnackbar,
    closeSnackbar,
}) => {
    // React.useEffect(() => {
    //     history.push("/select");
    // }, []);

    const [snackbarKey, setSnackbarKey] = React.useState(0);

    React.useEffect(() => {
        if (resultError) {
            const msg = Array.isArray(resultError)
                ? "Multiple errors occurred."
                : resultError;

            setSnackbarKey(snackbarKey + 1);

            closeSnackbar(LANDING_PAGE_ERROR_SNACKBAR_KEY + (snackbarKey - 1));
            enqueueSnackbar(msg, {
                key: LANDING_PAGE_ERROR_SNACKBAR_KEY + snackbarKey,
                variant: "error",
            });
        }
        // eslint-disable-next-line
    }, [resultError, sameErrCounter]);

    return (
        <Container className="title-bar-margin landing-page">
            <div className="title-wrapper">
                <img src="img/logo.svg" className="landing-logo" alt="" />
                <Typography variant="h3" component="h1" className="title">
                    YTDL
                </Typography>
            </div>
            <SearchBar />
        </Container>
    );
};

const mapStateToProps = state => {
    return {
        resultError: state.results.err,
        sameErrCounter: state.results.sameErrCounter,
    };
};

export default withSnackbar(connect(mapStateToProps)(LandingPage));
