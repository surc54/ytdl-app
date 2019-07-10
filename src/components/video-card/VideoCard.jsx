import { Icon, IconButton, Paper, Typography } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { connect } from "react-redux";
import { removeFromJobList, setJobFormat } from "../../actions";
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
    render() {
        // useEffect(() => {
        //     printFormatTable(props.video.formats)
        const [moreMenuAchorEl, setMoreMenuAchorEl] = useState(null);
        const [videoDetailsOpen, setVideoDetailsOpen] = useState(false);
        const givenStyle = this.props.style || {};

        function handleCloseMoreMenu() {
            setMoreMenuAchorEl(null);
        }

        function openVideoDetails() {
            setVideoDetailsOpen(true);
        }

        function handleCloseVideoDetails() {
            setVideoDetailsOpen(false);
        }

        const removeVideo = () => {
            this.props.removeFromJobList(this.props.video.video_id);
        };

        return (
            <Paper
                elevation={4}
                className="video-card"
                style={{
                    ...givenStyle,
                    backgroundImage: `url("https://img.youtube.com/vi/${this.props.video.video_id}/default.jpg")`,
                    marginBottom: 10,
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
                            <ResultsButtonGroup {...this.props} />
                        ) : (
                            (process => {
                                switch (process) {
                                    case "waiting":
                                        return (
                                            <WaitingButtonGroup
                                                {...this.props}
                                                removeVideo={removeVideo}
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
                                                removeVideo={removeVideo}
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
                                setMoreMenuAchorEl(e.currentTarget);
                            }}
                        >
                            <Icon>more_vert</Icon>
                        </IconButton>
                        <VideoMoreMenu
                            job={this.props.job}
                            anchorEl={moreMenuAchorEl}
                            onOpenVideoDetails={openVideoDetails}
                            onClose={handleCloseMoreMenu}
                            disableStartDownload={
                                !this.props.format && !this.props.generalFormat
                            }
                            resetFormat={() =>
                                this.props.setJobFormat(
                                    this.props.video.video_id,
                                    ""
                                )
                            }
                            removeVideo={removeVideo}
                        />
                        <VideoDetailsDialog
                            open={videoDetailsOpen}
                            onClose={handleCloseVideoDetails}
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
    };
};

export default connect(
    mapStateToProps,
    { removeFromJobList, setJobFormat }
)(VideoCard);
