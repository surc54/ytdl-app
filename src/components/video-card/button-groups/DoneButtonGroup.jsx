import React from "react";
import { IconButton, Icon, Button, Tooltip } from "@material-ui/core";
import FormatSelect from "../FormatSelect";

const DoneButtonGroup = props => {
    return (
        <>
            <IconButton size="small" onClick={props.removeVideo}>
                <Icon>delete</Icon>
            </IconButton>
            <span className="spacer"></span>
            <Tooltip title="Open folder">
                <IconButton size="small">
                    <Icon>folder</Icon>
                </IconButton>
            </Tooltip>
            <Button variant="outlined">Open</Button>
        </>
    );
};

export default DoneButtonGroup;
