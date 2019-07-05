import { Button } from "@material-ui/core";
import React from "react";
import "./WindowButton.scss";
import _ from "lodash";
import { connect } from "react-redux";
import { setMaximized } from "../../actions";

/**
 *
 * @param {React.MouseEventHandler} props.onClick
 * @param {String("maximize"|"minimize"|"close")} props.control
 * @param {Boolean} props.maximized
 * @param {any} props.children?
 */
const WindowButton = props => {
    let maximized = props.maximized;

    let content;

    if (props.children) {
        content = props.children;
    } else {
        switch (props.control.toLowerCase()) {
            case "minimize":
                content = <>&#xE921;</>;
                break;
            case "maximize":
                content = maximized ? <>&#xE923;</> : <>&#xE922;</>;
                break;
            case "close":
                content = <>&#xE8BB;</>;
                break;
            default:
                content = <>&#xE897;</>;
                break;
        }
    }

    return (
        <Button
            className="win-control-button"
            {..._.omit(
                props,
                "children",
                "control",
                "maximized",
                "setMaximized"
            )}
        >
            {content}
        </Button>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        maximized: state.window.maximized,
    };
};

export default connect(
    mapStateToProps,
    { setMaximized }
)(WindowButton);
