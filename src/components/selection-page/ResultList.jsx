import {
    useMediaQuery,
    CircularProgress,
    Divider,
    Paper,
    Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React from "react";
import { connect } from "react-redux";
import { setResultFormat } from "../../actions";
import VideoCard from "../video-card/VideoCard";
import {} from "react-window";

const ResultList = props => {
    const { type, videos, err } = props.results;

    const onFormatChange = (e, id) => {
        props.setResultFormat(id, e.target.value);
    };

    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.only("xs"));

    const renderContent = props => {
        const renderList = [];

        if (type === "loading") {
            return (
                <div
                    {...props}
                    style={{
                        ...props.style,
                        textAlign: "center",
                        marginTop: 20,
                    }}
                >
                    <CircularProgress />
                </div>
            );
        }

        if (type === "error" || err) {
            renderList.push(<ResultsErrorMessage error={err} {...props} />);
        } else if (type === "") {
            return (
                <Typography variant="subtitle1" {...props}>
                    Search above to get started
                </Typography>
            );
        }

        if (videos) {
            if (renderList.length !== 0) {
                renderList.push(
                    <Divider
                        style={{
                            marginRight: 15,
                            marginLeft: isXS ? 15 : 0,
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                    />
                );
            }

            renderList.push(
                videos.map(v => {
                    return (
                        <VideoCard
                            video={v.video}
                            format={v.format}
                            onFormatChange={e =>
                                onFormatChange(e, v.video.video_id)
                            }
                            key={v.video_id}
                            {...props}
                        />
                    );
                })
            );
        }

        return renderList;
    };

    const heightCutoff = props.adjustForControls ? 250 : 215;

    return (
        <div
            className="scroll-bar"
            style={{
                overflowY: "auto",
                height: `calc(100vh - ${heightCutoff}px)`,
            }}
        >
            {renderContent({
                style: {
                    marginRight: 15,
                    marginLeft: isXS ? 15 : 0,
                },
            })}

            {props.progressStatusBar && (
                <div style={{ marginBottom: 70 }}></div>
            )}
        </div>
    );
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
        pre: {
            marginTop: 10,
            fontFamily: "monospace",
            fontSize: 12,
            padding: 10,
            borderRadius: 10,
        },
    };

    return (
        <Paper style={{ ...styles.paper, ...props.style }}>
            <Typography variant="h6">An error occurred</Typography>
            <Typography variant="body1">
                The following error(s) occurred while attempting to search:
                <div
                    className="scroll-bar"
                    style={{
                        maxHeight: 200,
                        overflowY: "auto",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography style={styles.pre}>
                        {(() => {
                            if (Array.isArray(props.error)) {
                                return [
                                    <>
                                        <b>Error count: {props.error.length}</b>
                                        <br />
                                        <br />
                                    </>,
                                    ...props.error.map(err => (
                                        <>
                                            {err}
                                            <br />
                                            <br />
                                        </>
                                    )),
                                ];
                            } else {
                                return props.error || "Unknown error";
                            }
                        })()}
                    </Typography>
                </div>
            </Typography>
        </Paper>
    );
};

const mapStateToProps = state => {
    return {
        results: state.results,
        progressStatusBar: state.progress.statusBar,
    };
};

export default connect(
    mapStateToProps,
    { setResultFormat }
)(ResultList);
