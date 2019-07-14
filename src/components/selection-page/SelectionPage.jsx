import {
    Badge,
    Container,
    Divider,
    Grid,
    Hidden,
    Paper,
    Tab,
    Tabs,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getVideoInfo, search, addToJobList } from "../../actions";
import SearchBar from "../search-bar/SearchBar";
import JobsList from "./JobsList";
import JobsTopControl from "./JobsTopControl";
import ResultList from "./ResultList";
import "./SelectionPage.scss";
import DirectoryModal from "./DirectoryModal";
import ResultsTopControl from "./ResultsTopControl";

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
        setCurrentTab(val);
    };

    useEffect(() => {
        props.search("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        props.addToJobList("tV8P6T5tTYs", true);
        props.addToJobList("Bkttq3e5DcY", true);
        props.addToJobList("JdTBIHX-r0M", true);
        props.addToJobList("g1Gvi6q-OPM", true);
        // props.addToJobList("5zqjusBY8_c", true);
    }, []);
    return (
        <Container style={{ paddingTop: 20 }}>
            <SearchBar inline style={{ marginBottom: 20 }} />
            <Hidden xsDown>
                <Divider />
                <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={12} sm={6}>
                        <div className="title-section">
                            <Typography variant="h6">Results</Typography>
                            <ResultsTopControl
                                resultsLength={props.resultsLength}
                            />
                        </div>
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

            <DirectoryModal />
        </Container>
    );
};

const mapStateToProps = state => {
    return {
        resultsLength: state.results.videos.length,
        jobsLength: _.size(state.jobs.videos),
    };
};

export default connect(
    mapStateToProps,
    { getVideoInfo, search, addToJobList }
)(SelectionPage);
