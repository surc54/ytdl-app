import React from "react";
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    IconButton,
    Icon,
    Typography,
    Paper,
} from "@material-ui/core";
import { connect } from "react-redux";
import {} from "react-window";
import _ from "lodash";
import FormatSelect from "../video-card/FormatSelect";
import VideoCard from "../video-card/VideoCard";

const ResultList = props => {
    const { results } = props;
    const { type, videos, err } = results;

    if (_.size(videos) === 0) {
        return <div>No videos!</div>;
    }

    return (
        <div>
            <VideoCard video={videos[0].video} />
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        results: state.results,
    };
};

export default connect(mapStateToProps)(ResultList);
