import { Button, Icon, IconButton, Paper, Typography } from "@material-ui/core";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import FormatSelect from "./FormatSelect";
import "./VideoCard.scss";
import VideoDetailsDialog from "./VideoDetailsDialog";

/**
 * @param {videoInfo} props.video
 */
const VideoCard = props => {
    // useEffect(() => {
    //     printFormatTable(props.video.formats)
    // }, [props.video.formats]);

    const [videoDetailsOpen, setVideoDetailsOpen] = useState(false);
    const givenStyle = props.style || {};

    function openVideoDetails() {
        setVideoDetailsOpen(true);
    }

    function handleCloseVideoDetails() {
        setVideoDetailsOpen(false);
    }

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
                >
                    {props.video.author.name}
                </Typography>
                <div className="actions">
                    <FormatSelect
                        formats={props.video.formats}
                        onChange={props.onFormatChange}
                        value={props.format || ""}
                    />
                    <Button variant="outlined">Add</Button>
                    <IconButton size="small" onClick={openVideoDetails}>
                        <Icon>more_vert</Icon>
                    </IconButton>
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

function printFormatTable(formats) {
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

export default VideoCard;
