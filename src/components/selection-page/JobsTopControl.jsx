import {
    Button,
    FormControl,
    Icon,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    OutlinedInput,
    Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import _ from "lodash";
import React, { useState } from "react";
import { connect } from "react-redux";
import {
    clearJobs,
    resetAllJobsFormat,
    setGeneralFormat,
    setSaveDirectory,
    startAllJobs,
} from "../../actions";
import "./JobsTopControl.scss";

const useStyles = makeStyles(theme => {
    return {
        menuIndent: {
            paddingLeft: theme.spacing(4),
        },
        selectMenu: {
            paddingTop: "calc((36px - 19px) / 2)",
            paddingBottom: "calc((36px - 19px) / 2)",
        },
    };
});

const JobsTopControl = props => {
    console.log("JobsTopControl re-rendered!");

    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();

    const renderMoreMenu = () => {
        const handleClose = (callback, ...args) => {
            setAnchorEl(null);
            if (callback && typeof callback === "function") callback(...args);
        };

        return (
            <Menu
                id="jobs-top-control-more-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => handleClose(() => props.setSaveDirectory())}
                >
                    Choose save directory
                </MenuItem>
                <MenuItem onClick={() => handleClose(props.resetAllJobsFormat)}>
                    Reset all job-specific formats
                </MenuItem>
                <MenuItem
                    onClick={() => handleClose(props.clearJobs)}
                    disabled={props.jobListLength === 0}
                >
                    Clear List
                </MenuItem>
            </Menu>
        );
    };

    const openMoreMenu = e => {
        setAnchorEl(e.currentTarget);
    };

    return (
        <div className="jobs-top-control" style={{ ...props.style }}>
            <FormControl
                variant="outlined"
                margin="none"
                style={{ height: 36 }}
            >
                <InputLabel variant="outlined" margin="dense">
                    Format
                </InputLabel>
                <Select
                    value={props.generalFormat}
                    style={{ width: 100, height: 36 }}
                    onChange={e => {
                        props.setGeneralFormat(e.target.value);
                    }}
                    input={<OutlinedInput labelWidth={54} />}
                    classes={{
                        selectMenu: classes.selectMenu,
                    }}
                >
                    <MenuItem value="label_both_only" disabled>
                        Regular Video
                    </MenuItem>
                    <MenuItem value="hq-mp4" className={classes.menuIndent}>
                        .mp4 - High Quality
                    </MenuItem>
                    {/* <MenuItem value="mq-mp4" className={classes.menuIndent}>
                        .mp4 - Medium Quality
                    </MenuItem> */}
                    <MenuItem value="lq-mp4" className={classes.menuIndent}>
                        .mp4 - Low Quality
                    </MenuItem>
                    <MenuItem value="label_audio_only" disabled>
                        Audio Only
                    </MenuItem>
                    <MenuItem value="hq-mp3" className={classes.menuIndent}>
                        .mp3 - High Quality
                    </MenuItem>
                    {/* <MenuItem value="mq-mp3" className={classes.menuIndent}>
                        .mp3 - Medium Quality
                    </MenuItem> */}
                    <MenuItem value="lq-mp3" className={classes.menuIndent}>
                        .mp3 - Low Quality
                    </MenuItem>
                    <MenuItem value="label_video_only" disabled>
                        Video Only (No Sound Track)
                    </MenuItem>
                    <MenuItem
                        value="hq-mp4-no-audio"
                        className={classes.menuIndent}
                    >
                        .mp4 - High Quality
                    </MenuItem>
                    {/* <MenuItem
                        value="mq-mp4-no-audio"
                        className={classes.menuIndent}
                    >
                        .mp4 - Medium Quality
                    </MenuItem> */}
                    <MenuItem
                        value="lq-mp4-no-audio"
                        className={classes.menuIndent}
                    >
                        .mp4 - Low Quality
                    </MenuItem>
                </Select>
            </FormControl>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    props.startAllJobs();
                }}
                disabled={!props.generalFormat || props.jobListLength === 0}
            >
                Start
            </Button>
            <IconButton size="small" onClick={openMoreMenu}>
                <Icon>more_vert</Icon>
            </IconButton>
            {renderMoreMenu()}
        </div>
    );
};

const mapStateToProps = state => {
    return {
        generalFormat: state.jobs.generalFormat,
        jobListLength: _.size(state.jobs.videos),
    };
};

export default connect(
    mapStateToProps,
    {
        clearJobs,
        resetAllJobsFormat,
        setGeneralFormat,
        startAllJobs,
        setSaveDirectory,
    }
)(JobsTopControl);
