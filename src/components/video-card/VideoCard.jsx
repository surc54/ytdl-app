import { Button, Icon, IconButton, Paper, Typography } from "@material-ui/core";
import _ from "lodash";
import React, { useState } from "react";
import { connect } from "react-redux";
import { removeFromJobList, setJobFormat } from "../../actions";
import FormatSelect from "./FormatSelect";
import "./VideoCard.scss";
import VideoDetailsDialog from "./VideoDetailsDialog";
import VideoMoreMenu from "./VideoMoreMenu";
import WaitingButtonGroup from "./button-groups/WaitingButtonGroup";
import ResultsButtonGroup from "./button-groups/ResultsButtonGroup";
import InProgressButtonGroup from "./button-groups/InProgressButtonGroup";
import DoneButtonGroup from "./button-groups/DoneButtonGroup";

/**
 * @param {videoInfo} props.video
 */
const VideoCard = props => {
    // useEffect(() => {
    //     printFormatTable(props.video.formats)
    // }, [props.video.formats]);

    const [moreMenuAchorEl, setMoreMenuAchorEl] = useState(null);
    const [videoDetailsOpen, setVideoDetailsOpen] = useState(false);
    const givenStyle = props.style || {};

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
        props.removeFromJobList(props.video.video_id);
    };

    return (
        <Paper
            elevation={4}
            className="video-card"
            style={{
                ...givenStyle,
                backgroundImage: `url("https://img.youtube.com/vi/${props.video.video_id}/default.jpg")`,
                marginBottom: 10,
            }}
        >
            <div className="wrapper">
                <Typography variant="h6" noWrap>
                    {props.video.title}
                </Typography>
                <Typography
                    variant="button"
                    gutterBottom
                    style={{ color: "#aaa" }}
                    noWrap
                >
                    {props.video.author.name}
                </Typography>
                <div className="actions">
                    {!props.job ? (
                        <ResultsButtonGroup {...props} />
                    ) : (
                        (process => {
                            switch (process) {
                                case "waiting":
                                    return (
                                        <WaitingButtonGroup
                                            {...props}
                                            removeVideo={removeVideo}
                                        />
                                    );
                                case "downloading":
                                    return <InProgressButtonGroup {...props} />;
                                case "done":
                                    return (
                                        <DoneButtonGroup
                                            {...props}
                                            removeVideo={removeVideo}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })(props.job.process)
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
                        job={props.job}
                        anchorEl={moreMenuAchorEl}
                        onOpenVideoDetails={openVideoDetails}
                        onClose={handleCloseMoreMenu}
                        disableStartDownload={
                            !props.format && !props.generalFormat
                        }
                        resetFormat={() =>
                            props.setJobFormat(props.video.video_id, "")
                        }
                        removeVideo={removeVideo}
                    />
                    <VideoDetailsDialog
                        open={videoDetailsOpen}
                        onClose={handleCloseVideoDetails}
                        video={props.video}
                    />
                </div>
            </div>
        </Paper>
    );
};

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
