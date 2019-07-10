import { Button } from "@material-ui/core";
import React from "react";
import { Field } from "redux-form";
import { pure } from "recompose";

/**
 * @param props.textField
 * @param props.pasteFromClipboard
 * @param props.onSearch
 * @param props.clearFields
 * @param [props.submitDisabled]
 * @param [props.clearDisabled]
 */
function FullSearchBar(props) {
    return (
        <div className="search-bar-wrapper">
            <Field name="search" component={props.textField} />
            <div className="form-actions">
                <Button
                    className="search-bar-button"
                    variant="outlined"
                    onClick={props.clearFields}
                    disabled={props.clearDisabled}
                >
                    Clear
                </Button>
                <Button
                    className="search-bar-button"
                    variant="outlined"
                    onClick={props.pasteFromClipboard}
                >
                    Paste from Clipboard
                </Button>
                <Button
                    className="search-bar-button"
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={props.onSearch}
                    disabled={props.submitDisabled}
                >
                    Search
                </Button>
            </div>
        </div>
    );
}

export default pure(FullSearchBar);
