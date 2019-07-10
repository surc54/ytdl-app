import { Container, Typography } from "@material-ui/core";
import React from "react";
import { pure } from "recompose";
import "./LandingPage.scss";
import SearchBar from "./search-bar/SearchBar";

const LandingPage = () => {
    React.useEffect(() => {
        // history.push("/select");
    }, []);

    return (
        <Container className="title-bar-margin landing-page">
            <div className="title-wrapper">
                <img src="/img/logo.svg" className="landing-logo" alt="" />
                <Typography variant="h3" component="h1" className="title">
                    YTDL
                </Typography>
            </div>
            <SearchBar />
        </Container>
    );
};

export default pure(LandingPage);
