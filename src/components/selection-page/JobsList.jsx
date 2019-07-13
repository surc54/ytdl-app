import {
    useMediaQuery,
    ExpansionPanel,
    ExpansionPanelDetails,
    Icon,
    ExpansionPanelSummary,
    Divider,
    Typography,
    ExpansionPanelActions,
    Paper,
    Button,
    Tabs,
    Tab,
    Badge,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import _ from "lodash";
import React from "react";
import { pure } from "recompose";
import { connect } from "react-redux";
import { setJobFormat, clearCompleteJobs } from "../../actions";
import VideoCard from "../video-card/VideoCard";
import "./JobsList.scss";

const JobsList = props => {
    const [currentTab, setCurrentTab] = React.useState("pending");

    const onFormatChange = (e, id) => {
        props.setJobFormat(id, e.target.value);
    };

    const theme = useTheme();
    // console.log("THEME: ", theme);
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

    return [
        <Tabs
            value={currentTab}
            onChange={(e, val) => setCurrentTab(val)}
            variant="fullWidth"
        >
            <Tab
                label={
                    <Badge badgeContent={10} color="secondary">
                        Pending
                    </Badge>
                }
                value={"waiting"}
            />
            <Tab label="In Progress" value={"in-progress"} />
            <Tab label="Complete" value={"done"} />
        </Tabs>,
        <div
            className="scroll-bar"
            style={{
                overflowY: "auto",
                height: `calc(100vh - ${heightCutoff}px)`,
            }}
        >
            {currentTab === "waiting" && <FormatSelectorInfo isXS={isXS} />}
            {done.length !== 0 &&
                showExpansionPanel(
                    `${done.length} item${
                        done.length !== 1 ? "s" : ""
                    } complete`,
                    done,
                    {},
                    <Button onClick={() => props.clearCompleteJobs()}>
                        Clear All
                    </Button>
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
                        <Divider
                            style={{
                                marginTop: 10,
                                marginRight: 15,
                                marginLeft: isXS ? 15 : 0,
                            }}
                        />
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
