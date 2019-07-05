import {
    Badge,
    Button,
    Container,
    Divider,
    Grid,
    Hidden,
    Icon,
    IconButton,
    Paper,
    Tab,
    Tabs,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getVideoInfo, search } from "../../actions";
import SearchBar from "../search-bar/SearchBar";
import JobsList from "./JobsList";
import ResultList from "./ResultList";
import "./SelectionPage.scss";
import JobsTopControl from "./JobsTopControl";

const useStyles = makeStyles(theme => {
    return {
        badgeSpacing: {
            paddingRight: theme.spacing(1.5),
        },
    };
});

/**
 * @param {videoInfo[]} props.results.videos
 * @param {string} props.results.type
 * @param {search()} props.search
 */
const SelectionPage = props => {
    const classes = useStyles();
    const [currentTab, setCurrentTab] = useState("results");

    const onTabChange = (e, val) => {
        console.log(e);
        setCurrentTab(val);
    };

    useEffect(() => {
        // props.search("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }, []);
    return (
        <Container style={{ paddingTop: 20 }}>
            <SearchBar inline style={{ marginBottom: 20 }} />
            <Hidden xsDown>
                <Divider />
                <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Result</Typography>
                        <ResultList />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div className="title-section">
                            <Typography variant="h6">Job List</Typography>
                            <JobsTopControl />
                        </div>
                        <JobsList />
                    </Grid>
                </Grid>
            </Hidden>
            <Hidden smUp>
                <Paper square style={{ margin: "0 -16px 10px -16px" }}>
                    <Tabs
                        value={currentTab}
                        onChange={onTabChange}
                        variant="fullWidth"
                    >
                        <Tab
                            value="results"
                            label={
                                <Badge
                                    badgeContent={props.resultsLength}
                                    color="primary"
                                    className={classes.badgeSpacing}
                                >
                                    Results
                                </Badge>
                            }
                        />
                        <Tab
                            value="jobs"
                            label={
                                <Badge
                                    badgeContent={props.jobsLength}
                                    color="primary"
                                    className={classes.badgeSpacing}
                                >
                                    Jobs
                                </Badge>
                            }
                        />
                    </Tabs>
                </Paper>

                {(currentTab === "results" && <ResultList />) ||
                    (currentTab === "jobs" && (
                        <>
                            <JobsTopControl
                                style={{ marginTop: 10, marginBottom: 10 }}
                            />
                            <JobsList adjustForControls />
                        </>
                    ))}
            </Hidden>
        </Container>
    );
};

const mapStateToProps = state => {
    return {
        resultsLength: state.results.videos.length,
        jobsLength: _.size(state.jobs),
    };
};

export default connect(
    mapStateToProps,
    { getVideoInfo, search }
)(SelectionPage);
