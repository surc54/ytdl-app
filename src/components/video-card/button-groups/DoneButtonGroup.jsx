import { Button, Icon, IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import { pure } from "recompose";
const { ipcRenderer } = window.require("electron");

const sendOpenEvent = (path, highlightInFolder = false) => {
    let event = "ytdl:open";
    let args = { path };

    if (highlightInFolder) {
        args.folder = true;
    }

    ipcRenderer.send(event, args);
};

const DoneButtonGroup = props => {
    const { job } = props;

    return (
        <>
            <IconButton size="small" onClick={props.removeVideo}>
                <Icon>delete</Icon>
            </IconButton>
            <span className="spacer"></span>
            <Tooltip title="Open folder">
                <div>
                    <IconButton
                        size="small"
                        disabled={!job.path}
                        onClick={() => sendOpenEvent(job.path, true)}
                    >
                        <Icon>folder</Icon>
                    </IconButton>
                </div>
            </Tooltip>
            <Button
                variant="outlined"
                disabled={!job.path}
                onClick={() => sendOpenEvent(job.path, false)}
            >
                Open
            </Button>
        </>
    );
};

export default pure(DoneButtonGroup);
