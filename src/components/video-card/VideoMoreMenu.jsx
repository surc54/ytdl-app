import { Menu, MenuItem } from "@material-ui/core";
import React from "react";

const VideoMoreMenu = props => {
    const {
        anchorEl,
        onClose,
        job,
        added,
        onOpenVideoDetails,
        startDownload,
        addToJobList,
        removeVideo,
        disableStartDownload,
        resetFormat,
        process,
        ...others
    } = props;

    const handleClose = callback => {
        if (callback && typeof callback === "function") {
            callback();
        }
        if (onClose && typeof onClose === "function") {
            onClose();
        }
    };

    return (
        <Menu
            {...others}
            anchorEl={anchorEl}
            keepMounted
            open={!!anchorEl}
            onClose={handleClose}
        >
            {job &&
                process === "waiting" && [
                    <MenuItem
                        onClick={() => handleClose(startDownload)}
                        disabled={disableStartDownload}
                        key="job_sp_start_download"
                    >
                        Start download
                    </MenuItem>,
                    <MenuItem
                        onClick={() => {
                            handleClose(removeVideo);
                        }}
                        key="job_sp_remove_job"
                    >
                        Remove from job list
                    </MenuItem>,
                ]}
            {!job && (
                <MenuItem
                    onClick={() => handleClose(addToJobList)}
                    disabled={added}
                >
                    Add to job list
                </MenuItem>
            )}
            {(!job || (job && process === "waiting")) && (
                <MenuItem
                    onClick={() => handleClose(resetFormat)}
                    disabled={!job && added}
                >
                    Reset video format
                </MenuItem>
            )}
            <MenuItem
                onClick={() => {
                    handleClose(onOpenVideoDetails);
                }}
            >
                View video details
            </MenuItem>
        </Menu>
    );
};

export default React.memo(VideoMoreMenu);
