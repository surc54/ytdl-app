import { Button, Icon, IconButton, Tooltip } from "@material-ui/core";
import React from "react";
import { pure } from "recompose";

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

export default pure(DoneButtonGroup);
