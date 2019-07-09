import { Button } from "@material-ui/core";
import React from "react";
import FormatSelect from "../FormatSelect";

const ResultsButtonGroup = props => {
    return (
        <>
            <FormatSelect
                formats={props.video.formats}
                onChange={props.onFormatChange}
                value={props.format || ""}
            />
            <Button variant="outlined">Add</Button>
        </>
    );
};

export default ResultsButtonGroup;
