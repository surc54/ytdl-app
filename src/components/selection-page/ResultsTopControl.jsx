import { Button, IconButton, Icon, Tooltip } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { addAllResultsToJobs, clearResults } from "../../actions";
import "./JobsTopControl.scss";

const ResultsTopControl = props => {
    const {
        resultsLength,
        addAllResultsToJobs,
        clearResults,
        ...others
    } = props;

    return (
        <div className="jobs-top-control" {...others}>
            <Button
                variant="outlined"
                onClick={() => {
                    addAllResultsToJobs();
                }}
                disabled={resultsLength === 0}
            >
                Add all
            </Button>
            <Tooltip title="Clear results">
                <div>
                    <IconButton
                        size="small"
                        disabled={resultsLength === 0}
                        onClick={() => {
                            clearResults();
                        }}
                    >
                        <Icon>delete</Icon>
                    </IconButton>
                </div>
            </Tooltip>
        </div>
    );
};

export default connect(
    null,
    {
        addAllResultsToJobs,
        clearResults,
    }
)(ResultsTopControl);
