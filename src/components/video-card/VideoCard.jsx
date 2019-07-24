import { Icon, IconButton, Paper, Typography } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import {
    removeFromJobList,
    setJobFormat,
    startOneJob,
    addToJobList,
} from "../../actions";
import DoneButtonGroup from "./button-groups/DoneButtonGroup";
import InProgressButtonGroup from "./button-groups/InProgressButtonGroup";
import ResultsButtonGroup from "./button-groups/ResultsButtonGroup";
import WaitingButtonGroup from "./button-groups/WaitingButtonGroup";
import "./VideoCard.scss";
import VideoDetailsDialog from "./VideoDetailsDialog";
import VideoMoreMenu from "./VideoMoreMenu";

/**
 * @param {videoInfo} props.video
 */
class VideoCard extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        }

        if (nextProps.video !== this.props.video) {
            return true;
        }

        if (nextProps.job !== this.props.job) {
            return true;
        }

        if (nextProps.format !== this.props.format) {
            return true;
        }

        if (nextProps.jobVideo !== this.props.jobVideo) {
            return true;
        }

        if (nextProps.disableBackground !== this.props.disableBackground) {
            return true;
        }

        return false;
    }

    state = {
        moreMenuAnchorEl: null,
        videoDetailsOpen: false,
    };

    setMoreMenuAnchorEl = val => {
        this.setState({
            moreMenuAnchorEl: val,
        });
    };

    setVideoDetailsOpen = val => {
        this.setState({
            videoDetailsOpen: val,
        });
    };

    handleCloseMoreMenu = () => {
        this.setMoreMenuAnchorEl(null);
    };

    openVideoDetails = () => {
        this.setVideoDetailsOpen(true);
    };

    handleCloseVideoDetails = () => {
        this.setVideoDetailsOpen(false);
    };

    startDownload = () => {
        this.props.startOneJob(this.props.video.video_id);
    };

    addToJobList = () => {
        this.props.addToJobList(this.props.video, false, this.props.format);
    };

    removeVideo = () => {
        this.props.removeFromJobList(this.props.video.video_id);
    };

    resetFormat = () => this.props.setJobFormat(this.props.video.video_id, "");

    render() {
        const givenStyle = this.props.style || {};

        let backgroundImageStyle = {};

        if (!this.props.disableBackground) {
            backgroundImageStyle.backgroundImage = `url("https://img.youtube.com/vi/${this.props.video.video_id}/default.jpg")`;
        }

        return (
            <Paper
                elevation={4}
                className="video-card"
                style={{
                    ...backgroundImageStyle,
                    marginBottom: 10,
                    ...givenStyle,
                }}
            >
                <div className="wrapper">
                    <Typography variant="h6" noWrap>
                        {this.props.video.title}
                    </Typography>
                    <Typography
                        variant="button"
                        gutterBottom
                        style={{
                            color: "#aaa",
                        }}
                        noWrap
                    >
                        {this.props.video.author.name}
                    </Typography>
                    <div className="actions">
                        {!this.props.job ? (
                            <ResultsButtonGroup
                                {...this.props}
                                addToJobList={this.addToJobList}
                                added={this.props.jobVideo}
                            />
                        ) : (
                            (process => {
                                switch (process) {
                                    case "waiting":
                                        return (
                                            <WaitingButtonGroup
                                                {...this.props}
                                                removeVideo={this.removeVideo}
                                            />
                                        );

                                    case "downloading":
                                        return (
                                            <InProgressButtonGroup
                                                {...this.props}
                                            />
                                        );

                                    case "done":
                                        return (
                                            <DoneButtonGroup
                                                {...this.props}
                                                removeVideo={this.removeVideo}
                                            />
                                        );

                                    default:
                                        return null;
                                }
                            })(this.props.job.process)
                        )}
                        <IconButton
                            size="small"
                            onClick={e => {
                                this.setMoreMenuAnchorEl(e.currentTarget);
                            }}
                        >
                            <Icon>more_vert</Icon>
                        </IconButton>
                        <VideoMoreMenu
                            job={!!this.props.job}
                            startDownload={this.startDownload}
                            addToJobList={
                                (!this.props.job && this.addToJobList) || null
                            }
                            added={this.props.jobVideo}
                            process={
                                (this.props.job && this.props.job.process) ||
                                null
                            }
                            anchorEl={this.state.moreMenuAnchorEl}
                            onOpenVideoDetails={this.openVideoDetails}
                            onClose={this.handleCloseMoreMenu}
                            disableStartDownload={
                                !this.props.format && !this.props.generalFormat
                            }
                            resetFormat={this.resetFormat}
                            removeVideo={this.removeVideo}
                        />
                        <VideoDetailsDialog
                            open={this.state.videoDetailsOpen}
                            onClose={this.handleCloseVideoDetails}
                            video={this.props.video}
                        />
                    </div>
                </div>
            </Paper>
        );
    }
}

// probably dont need to export but the unused error
// was annoying
export function printFormatTable(formats) {
    console.table(
        formats.map(v =>
            _.omit(
                v,
                "isDashMPD",
                "isHLS",
                "sp",
                "s",
                "live",
                "lmt",
                "projection_type",
                "xtags",
                "url",
                "clen",
                "index",
                "init",
                "eotf",
                "primaries",
                "audio_sample_rate",
                "audio_channels"
            )
        )
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        generalFormat: state.jobs.generalFormat,
        jobVideo: !!state.jobs.videos[ownProps.video.video_id],
    };
};

export default connect(
    mapStateToProps,
    { removeFromJobList, setJobFormat, startOneJob, addToJobList }
)(VideoCard);
