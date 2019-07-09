import {
    CircularProgress,
    Divider,
    Paper,
    Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React from "react";
import { connect } from "react-redux";
import VideoCard from "../video-card/VideoCard";

const ResultList = props => {
    const { type, videos, err } = props.results;

    const renderContent = () => {
        const renderList = [];

        if (type === "loading") {
            return (
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 20,
                    }}
                >
                    <CircularProgress />
                </div>
            );
        }

        if (type === "error") {
            renderList.push(<ResultsErrorMessage error={err} />);
        } else if (type === "") {
            return (
                <Typography variant="subtitle1">
                    Search above to get started
                </Typography>
            );
        }

        if (videos) {
            if (renderList.length !== 0) {
                renderList.push(<Divider style={{ marginBottom: 10 }} />);
            }

            renderList.push(
                videos.map(v => {
                    return <VideoCard video={v} key={v.video_id} />;
                })
            );
        }

        return renderList;
    };

    return <div>{renderContent()}</div>;
};

const ResultsErrorMessage = props => {
    const theme = useTheme();

    console.log(theme);

    const styles = {
        paper: {
            padding: "10px",
            background: theme.palette.error.dark,
            color: theme.palette.error.contrastText,
            marginBottom: 10,
        },
        pre: {},
    };

    return (
        <Paper style={styles.paper}>
            <Typography variant="h6">An error occurred</Typography>
            <Typography variant="body1">
                The following error occurred while attempting to search:
                <pre style={styles.pre}>{props.error || "Unknown error"}</pre>
            </Typography>
        </Paper>
    );
};

const mapStateToProps = state => {
    return {
        results: state.results,
    };
};

export default connect(mapStateToProps)(ResultList);
