import React from "react";
import { IconButton, Icon, Button } from "@material-ui/core";
import { connect } from "react-redux";
import { startOneJob } from "../../../actions";
import FormatSelect from "../FormatSelect";

const WaitingButtonGroup = props => {
    const resultButton = <Button variant="outlined">Add</Button>;

    const jobButton = (
        <Button
            variant="outlined"
            onClick={() => {
                props.startOneJob(props.video.video_id);
            }}
            disabled={!props.format && !props.generalFormat}
        >
            Start
        </Button>
    );

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
            {(props.job && jobButton) || resultButton}
        </>
    );
};

export default connect(
    null,
    { startOneJob }
)(WaitingButtonGroup);
