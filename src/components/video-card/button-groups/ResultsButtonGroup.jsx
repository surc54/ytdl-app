import { Button } from "@material-ui/core";
import React from "react";
import FormatSelect from "../FormatSelect";
import { pure } from "recompose";

const ResultsButtonGroup = props => {
    const { addToJobList, added } = props;
    return (
        <>
            {!added && (
                <FormatSelect
                    formats={props.video.formats}
                    onChange={props.onFormatChange}
                    value={props.format || ""}
                />
            )}
            <Button variant="outlined" onClick={addToJobList} disabled={added}>
                Add{added && "ed"}
            </Button>
        </>
    );
};

export default pure(ResultsButtonGroup);
