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
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
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

    const getItemSize = (index, type) => {
        if (index === 0) {
            return 300;
        } else {
            return 136;
        }

        if (type === "loading" && index === 0) {
            return 100;
        }

        if ((type === "error" || err) && index === 0) {
            return 300;
        } else if (type === "" && index === 0) {
            return 20;
        } else {
            return 136;
        }
    };

    const getItemCount = () => {
        if (type === "loading") {
            return 1;
        }

        if (type === "") {
            return 1;
        }

        return videos.length + 1;
    };

    const itemCount = getItemCount();

    const renderContent = ({ index, style }) => {
        const props = {
            style: {
                ...style,
                width: `calc(${style.width} - 15px)`,
                left: style.left + (isXS ? 15 : 0),
                height: style.height - 10,
            },
        };

        if (type === "loading") {
            if (index === 0) {
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
            } else {
                return null;
            }
        }

        if ((type === "error" || err) && index === 0) {
            return <ResultsErrorMessage error={err} {...props} />;
        } else if (type === "" && index === 0) {
            return (
                <Typography variant="subtitle1" {...props}>
                    Search above to get started
                </Typography>
            );
        }

        const beginIndexOffset = 1;

        if (videos) {
            if (index === 0) {
                console.log("%cYEET", "font-size: 20px");
                return <div style={{ ...props.style, height: 0 }}></div>;
            }

            // if (renderList.length !== 0) {
            //     renderList.push(
            //         <Divider
            //             style={{
            //                 ...style,
            //                 marginRight: 15,
            //                 marginLeft: isXS ? 15 : 0,
            //                 marginTop: 10,
            //                 marginBottom: 10,
            //             }}
            //         />
            //     );
            // }

            const v = videos[index - beginIndexOffset];

            if (v) {
                return (
                    <VideoCard
                        video={v.video}
                        format={v.format}
                        onFormatChange={e =>
                            onFormatChange(e, v.video.video_id)
                        }
                        key={v.video_id}
                        {...props}
                        style={{ ...props.style, marginBottom: 0 }}
                    />
                );
            }
        }

        return null;
    };

    const heightCutoff = props.adjustForControls ? 250 : 215;

    return (
        <div
            style={{
                overflowY: "hidden",
                height: `calc(100vh - ${heightCutoff}px)`,
            }}
        >
            <AutoSizer>
                {({ height, width }) => {
                    return (
                        <List
                            className="scroll-bar"
                            height={height}
                            width={width}
                            itemSize={ind => getItemSize(ind, type)}
                            itemCount={itemCount}
                        >
                            {renderContent}
                        </List>
                    );
                }}
            </AutoSizer>

            {props.progressStatusBar && (
                <div style={{ marginBottom: 70 }}></div>
            )}
        </div>
    );
};

const ResultsErrorMessage = props => {
    const theme = useTheme();

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
