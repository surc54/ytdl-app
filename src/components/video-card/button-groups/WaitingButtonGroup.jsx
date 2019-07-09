import React from "react";
import { IconButton, Icon, Button } from "@material-ui/core";
import FormatSelect from "../FormatSelect";

const WaitingButtonGroup = props => {
    return (
        <>
            {props.job && (
                <IconButton size="small" onClick={props.removeVideo}>
                    <Icon>delete</Icon>
                </IconButton>
            )}
            <span className="spacer"></span>
            <FormatSelect
                formats={props.video.formats}
                onChange={props.onFormatChange}
                value={props.format || ""}
            />
            <Button
                variant="outlined"
                disabled={!props.format && !props.generalFormat}
            >
                {(props.job && "Start") || "Add"}
            </Button>
        </>
    );
};

export default WaitingButtonGroup;
