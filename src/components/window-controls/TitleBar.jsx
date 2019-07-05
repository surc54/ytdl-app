import { Icon } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import "./TitleBar.scss";
import WindowButton from "./WindowButton";
const { ipcRenderer } = window.require("electron");

class TitleBar extends React.Component {
    onDevToolsClick = () => {
        ipcRenderer.send("window:dev-tools");
    };

    onMinimizeClick = () => {
        ipcRenderer.send("window:minimize");
    };

    onMaximizeClick = () => {
        ipcRenderer.send("window:maximize");
    };

    onCloseClick = () => {
        ipcRenderer.send("window:close");
    };

    render() {
        return (
            <div className="title-bar">
                <DraggableArea>
                    <div className="title">YTDL</div>
                </DraggableArea>
                <div className="buttons">
                    {/* &#xEC7A; */}
                    <WindowButton onClick={this.onDevToolsClick}>
                        <Icon>developer_board</Icon>
                    </WindowButton>
                    <WindowButton
                        control="minimize"
                        onClick={this.onMinimizeClick}
                    />
                    <WindowButton
                        control="maximize"
                        onClick={this.onMaximizeClick}
                    />
                    <WindowButton
                        control="close"
                        onClick={this.onCloseClick}
                    />
                </div>
            </div>
        );
    }
}

const DraggableAreaRaw = props => {
    return (
        <div className={`draggable ${props.maximized ? "maximized" : ""}`}>
            {props.children}
        </div>
    );
};

const draggableArea_mapStateToProps = state => {
    return {
        maximized: state.window.maximized,
    };
};

const DraggableArea = connect(draggableArea_mapStateToProps)(DraggableAreaRaw);

export default TitleBar;
