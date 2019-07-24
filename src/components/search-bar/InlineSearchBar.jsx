import React from "react";
import { Field } from "redux-form";
import { Tooltip, IconButton, Icon } from "@material-ui/core";
import { pure } from "recompose";
import "./InlineSearchBar.scss";

/**
 * @param props.textField
 * @param props.pasteFromClipboard
 * @param props.onSearch
 * @param props.submitDisabled
 */
const InlineSearchBar = props => {
    return (
        <div className="search-bar-wrapper inline">
            <Field name="search" component={props.textField} />
            <Tooltip title="Paste from clipboard">
                <IconButton
                    className="inline-search-button"
                    onClick={props.pasteFromClipboard}
                >
                    <Icon>content_copy</Icon>
                </IconButton>
            </Tooltip>
            <Tooltip title="Search">
                <div className="inline-search-button">
                    <IconButton
                        color="primary"
                        onClick={props.onSearch}
                        type="submit"
                        disabled={props.submitDisabled}
                    >
                        <Icon>search</Icon>
                    </IconButton>
                </div>
            </Tooltip>
        </div>
    );
};

export default pure(InlineSearchBar);
