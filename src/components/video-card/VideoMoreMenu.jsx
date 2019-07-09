import { Menu, MenuItem } from "@material-ui/core";
import React from "react";

const VideoMoreMenu = props => {
    const {
        anchorEl,
        onClose,
        job,
        onOpenVideoDetails,
        removeVideo,
        disableStartDownload,
        resetFormat,
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
            {job && [
                <MenuItem
                    onClick={handleClose}
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
                    Remove from Job List
                </MenuItem>,
            ]}
            <MenuItem onClick={() => handleClose(resetFormat)}>
                Reset video format
            </MenuItem>
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

export default VideoMoreMenu;
