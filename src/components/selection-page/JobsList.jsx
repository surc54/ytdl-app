import {
    useMediaQuery,
    ExpansionPanel,
    ExpansionPanelDetails,
    Icon,
    ExpansionPanelSummary,
    Divider,
    Typography,
    ExpansionPanelActions,
    Button,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import _ from "lodash";
import React from "react";
import { pure } from "recompose";
import { connect } from "react-redux";
import { setJobFormat } from "../../actions";
import VideoCard from "../video-card/VideoCard";
import "./JobsList.scss";

const JobsList = props => {
    const onFormatChange = (e, id) => {
        props.setJobFormat(id, e.target.value);
    };

    const theme = useTheme();
    // console.log("THEME: ", theme);
    const isXS = useMediaQuery(theme.breakpoints.only("xs"));

    const heightCutoff = props.adjustForControls ? 250 : 215;

    const inProgress = _.filter(
        props.jobs.videos,
        job => job.process === "downloading"
    );

    const done = _.filter(props.jobs.videos, job => job.process === "done");

    const waiting = _.filter(
        props.jobs.videos,
        job => job.process === "waiting"
    );

    const showExpansionPanel = (
        title,
        jobList,
        expPanelProps = {},
        actions = null
    ) => {
        return (
            <ExpansionPanel
                {...expPanelProps}
                style={{
                    ...(expPanelProps.style || {}),
                    marginRight: 15,
                    marginLeft: isXS ? 15 : 0,
                }}
                TransitionProps={{
                    unmountOnExit: true,
                }}
            >
                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                    {title}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="in-progress-items">
                    {jobList.map(job => (
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
                    ))}
                </ExpansionPanelDetails>
                {actions && (
                    <ExpansionPanelActions>{actions}</ExpansionPanelActions>
                )}
            </ExpansionPanel>
        );
    };

    return (
        <div
            className="scroll-bar"
            style={{
                overflowY: "auto",
                height: `calc(100vh - ${heightCutoff}px)`,
            }}
        >
            {done.length !== 0 &&
                showExpansionPanel(
                    `${done.length} item${
                        done.length !== 1 ? "s" : ""
                    } complete`,
                    done,
                    {},
                    <Button>Clear All</Button>
                )}
            {inProgress.length !== 0 &&
                showExpansionPanel(
                    `${inProgress.length} item${
                        inProgress.length !== 1 ? "s" : ""
                    } in progress`,
                    inProgress,
                    {
                        style: {
                            marginBottom: 10,
                        },
                        defaultExpanded: false,
                    }
                )}
            {(inProgress.length !== 0 || done.length !== 0) &&
                (waiting.length !== 0 && (
                    <>
                        <Divider />
                        <Typography
                            align="center"
                            style={{ marginTop: 10 }}
                            color="textSecondary"
                            variant="subtitle1"
                            gutterBottom
                        >
                            The following items are waiting to start
                        </Typography>
                    </>
                ))}
            {_.map(waiting, job => {
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
            })}
            {props.progress.statusBar && (
                <div style={{ marginBottom: 70 }}></div>
            )}
        </div>
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
        { setJobFormat }
    )(JobsList)
);
