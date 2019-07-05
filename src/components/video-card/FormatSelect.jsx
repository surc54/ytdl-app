import {
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import React from "react";
import _ from "lodash";

const useStyles = makeStyles(theme =>
    createStyles({
        formControl: {
            margin: 0,
            minWidth: 120,
        },
    })
);

/**
 *
 * @param {videoFormat[]} props.formats
 * @returns {React.FunctionComponent}
 */
const FormatSelect = props => {
    const classes = useStyles();

    let audioFormats = [];
    let videoFormats = [];
    let otherFormats = [];

    props.formats.forEach(format => {
        if (format.type && format.container) {
            if (format.type.startsWith("video/")) {
                videoFormats.push(format);
            } else if (format.type.startsWith("audio/")) {
                audioFormats.push(format);
            } else {
                otherFormats.push(format);
            }
        } else {
            otherFormats.push(format);
        }
    });

    videoFormats = _.sortBy(videoFormats, [
        "container",
        f => Number(f.resolution.split("p")[0]),
    ]);
    audioFormats = _.sortBy(audioFormats, "audioBitrate", "container");
    otherFormats = _.sortBy(otherFormats, [
        f => Number(f.quality_label.split("p")[0]),
    ]);

    // console.log("Format List:");
    // console.log("\tVideo Format: ", videoFormats);
    // console.log("\tAudio Format: ", audioFormats);
    // console.log("\tOther Format: ", otherFormats);

    const renderMenuItems = (formats, type) => {
        return formats.map(f => (
            <MenuItem
                key={f.itag}
                value={JSON.stringify({ itag: f.itag })}
                style={{
                    paddingLeft: 35,
                }}
            >
                <Typography variant="inherit" noWrap>
                    .{f.container || "unknown"}{" "}
                    {f.encoding && `(${f.encoding})`}{" "}
                    {f.resolution || f.quality_label}{" "}
                    {type === "audio" &&
                        `(${f.audioEncoding}, ${f.audioBitrate} bits)`}
                </Typography>
            </MenuItem>
        ));
    };

    const renderMenuLabel = label => {
        return (
            <MenuItem value={`label_${label}`} disabled key={`label_${label}`}>
                {label}
            </MenuItem>
        );
    };

    return (
        <FormControl
            variant="outlined"
            margin="dense"
            className={classes.formControl}
        >
            <InputLabel htmlFor="outlined-age-simple">Format</InputLabel>
            <Select
                value={props.value || ""}
                input={
                    <OutlinedInput
                        labelWidth={54}
                        name="age"
                        id="outlined-age-simple"
                    />
                }
                onChange={props.onChange}
            >
                <MenuItem value="" key="auto-select">
                    Auto-select based on general settings
                </MenuItem>
                {audioFormats.length !== 0 && [
                    <Divider key="div_1" />,
                    renderMenuLabel("Audio Formats"),
                ]}
                {renderMenuItems(audioFormats, "audio")}
                {videoFormats.length !== 0 && [
                    <Divider key="div_2" />,
                    renderMenuLabel("Video Formats"),
                ]}
                {renderMenuItems(videoFormats)}
                {otherFormats.length !== 0 && [
                    <Divider key="div_3" />,
                    renderMenuLabel("Other Formats"),
                ]}
                {renderMenuItems(otherFormats)}
            </Select>
        </FormControl>
    );
};

export default FormatSelect;
