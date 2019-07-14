import {
    Badge,
    Icon,
    Paper,
    Tab,
    Tabs,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { pure } from "recompose";
import { clearCompleteJobs, setJobFormat } from "../../actions";
import VideoCard from "../video-card/VideoCard";
import "./JobsList.scss";

const useStyles = makeStyles(theme => {
    return {
        badgeSpacing: {
            paddingRight: theme.spacing(1.5),
        },
    };
});

const JobsList = props => {
    const [currentTab, setCurrentTab] = React.useState("waiting");
    const classes = useStyles();

    const onFormatChange = (e, id) => {
        props.setJobFormat(id, e.target.value);
    };

    const theme = useTheme();

    const isXS = useMediaQuery(theme.breakpoints.only("xs"));

    const heightCutoff = props.adjustForControls ? 295 : 260;

    const inProgress = _.filter(
        props.jobs.videos,
        job => job.process === "downloading"
    );

    const done = _.filter(props.jobs.videos, job => job.process === "done");

    const waiting = _.filter(
        props.jobs.videos,
        job => job.process === "waiting"
    );

    const mapVideoCards = source => {
        if (_.size(source) === 0) {
            return (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <Icon fontSize="large">layers_clear</Icon>
                    <Typography align="center" variant="subtitle1">
                        There's nothing here.
                    </Typography>
                </div>
            );
        }
        return _.map(source, job => {
            return (
                <VideoCard
                    style={{
                        marginRight: 15,
                        marginLeft: isXS ? 15 : 0,
                    }}
                    job={job}
                    video={job.video}
                    format={job.format || ""}
                    key={job.video.video_id}
                    onFormatChange={e => {
                        onFormatChange(e, job.video.video_id);
                    }}
                />
            );
        });
    };

    return [
        <Tabs
            value={currentTab}
            onChange={(e, val) => setCurrentTab(val)}
            variant="fullWidth"
        >
            <Tab
                label={
                    <Badge
                        badgeContent={_.size(waiting)}
                        color="secondary"
                        className={classes.badgeSpacing}
                    >
                        Pending
                    </Badge>
                }
                value={"waiting"}
            />
            <Tab
                label={
                    <Badge
                        badgeContent={_.size(inProgress)}
                        color="secondary"
                        className={classes.badgeSpacing}
                    >
                        In Progress
                    </Badge>
                }
                wrapped
                value={"in-progress"}
            />
            <Tab
                label={
                    <Badge
                        badgeContent={_.size(done)}
                        color="secondary"
                        className={classes.badgeSpacing}
                    >
                        Complete
                    </Badge>
                }
                value={"done"}
            />
        </Tabs>,
        <div
            className="scroll-bar"
            style={{
                overflowY: "auto",
                height: `calc(100vh - ${heightCutoff}px)`,
            }}
        >
            {currentTab === "waiting" && <FormatSelectorInfo isXS={isXS} />}
            {currentTab === "waiting" && mapVideoCards(waiting)}
            {currentTab === "in-progress" && mapVideoCards(inProgress)}
            {currentTab === "done" && mapVideoCards(done)}

            {props.progress.statusBar && (
                <div style={{ marginBottom: 70 }}></div>
            )}
        </div>,
    ];
};

const FormatSelectorInfo = ({ isXS }) => {
    return (
        <Paper
            style={{
                marginTop: 10,
                marginBottom: 10,
                marginRight: 15,
                marginLeft: isXS ? 15 : 0,
                padding: "10px 20px",
            }}
        >
            <Typography
                // align="center"
                style={{ fontSize: 16 }}
                color="textSecondary"
                variant="subtitle1"
            >
                Use the format selector above to choose the default download
                format
            </Typography>
        </Paper>
    );
};

const mapStateToProps = state => {
    return {
        jobs: state.jobs,
        progress: state.progress,
    };
};

export default pure(
    connect(
        mapStateToProps,
        { setJobFormat, clearCompleteJobs }
    )(JobsList)
);
