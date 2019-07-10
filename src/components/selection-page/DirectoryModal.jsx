import React, { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    DialogActions,
} from "@material-ui/core";
import { pure } from "recompose";

const { ipcRenderer } = window.require("electron");

const DirectoryModal = props => {
    const openDirectoryChooser = () => {
        ipcRenderer.send("ytdl:choose-directory");
    };

    useEffect(() => {
        if (props.open) setTimeout(openDirectoryChooser, 1000);
    }, [props.open]);

    return (
        <Dialog open={props.open || false}>
            <DialogTitle>Choose a save directory</DialogTitle>
            <DialogContent>
                To start downloads, choose a download directory:
                <br />
            </DialogContent>
            <DialogActions>
                <Button onClick={openDirectoryChooser}>Choose Directory</Button>
            </DialogActions>
        </Dialog>
    );
};

export default pure(DirectoryModal);
