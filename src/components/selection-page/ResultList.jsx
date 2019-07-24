import {
    CircularProgress,
    Paper,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React from "react";
import { connect } from "react-redux";
import { Virtuoso } from "react-virtuoso";
import { setResultFormat } from "../../actions";
import VideoCard from "../video-card/VideoCard";

const ResultList = props => {
    const { type, videos, err } = props.results;
    const virtualList = React.createRef();

    const onFormatChange = (e, id) => {
        props.setResultFormat(id, e.target.value);
    };

    const theme = useTheme();
    const isXS = useMediaQuery(theme.breakpoints.only("xs"));

    React.useEffect(() => {
        if (virtualList.current) {
            virtualList.current.recomputeRowHeights(0);
        }
        // eslint-disable-next-line
    }, [type, virtualList.current]);

    React.useEffect(() => {
        if (videos && virtualList.current) {
            virtualList.current.measureAllRows();
        }
        // eslint-disable-next-line
    }, [videos, virtualList, virtualList.current]);

    const [isScrolling, setIsScrolling] = React.useState(false);

    // eslint-disable-next-line
    const getItemSize = ({ index }, type) => {
        if (type === "loading" && index === 0) {
            return 100;
        }

        if ((type === "error" || err) && index === 0) {
            return 310;
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

        return videos.length + (type === "error" || err ? 1 : 0);
    };

    const itemCount = getItemCount();

    const renderContent = (
        index,
        {
            style = {},
            /*isScrolling = false,*/ isVisible = false,
            key = null,
        } = {}
    ) => {
        const props = {
            style: {
                ...style,
                width: `calc(100% - 15px)`,
                marginLeft: isXS ? 15 : 0,
                marginBottom: 10,
            },
            // style: {
            //     ...style,
            //     width: `calc(${style.width} - 15px)`,
            //     left: style.left + (isXS ? 15 : 0),
            //     height: style.height - 10,
            // },
        };

        if (type === "loading") {
            if (index === 0) {
                return (
                    <div
                        key={key}
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
            return <ResultsErrorMessage key={key} error={err} {...props} />;
        } else if (type === "" && index === 0) {
            return (
                <Typography variant="subtitle1" key={key} {...props}>
                    Search above to get started
                </Typography>
            );
        }

        const beginIndexOffset = type === "error" || err ? 1 : 0;

        if (videos) {
            const v = videos[index - beginIndexOffset];

            if (v) {
                return (
                    <VideoCard
                        video={v.video}
                        format={v.format}
                        onFormatChange={e =>
                            onFormatChange(e, v.video.video_id)
                        }
                        disableBackground={isScrolling}
                        key={`r_${v.video.video_id}`}
                        {...props}
                        style={{ ...props.style }}
                    />
                );
            }
        }

        return null;
    };

    const heightCutoff = props.adjustForControls ? 250 : 215;

    return (
        <div
            className="result_list_root"
            style={{
                overflowY: "hidden",
                height: `calc(100vh - ${heightCutoff}px)`,
            }}
        >
            {/* <AutoSizer>
                {({ height, width }) => {
                    return (
                        <List
                            ref={virtualList}
                            type={type}
                            className="scroll-bar"
                            height={height}
                            width={width}
                            rowHeight={ind => getItemSize(ind, type)}
                            rowCount={itemCount}
                            rowRenderer={renderContent}
                        ></List>
                    );
                }}
            </AutoSizer> */}

            <Virtuoso
                className="scroll-bar"
                style={{
                    width: "100%",
                    height: "100%",
                    transform: "translateZ(0)",
                    willChange: "transform",
                }}
                totalCount={itemCount}
                item={renderContent}
                scrollingStateChange={isScrolling =>
                    setIsScrolling(isScrolling)
                }
                overscan={5}
            />
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
            // marginBottom: 10,
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
            <Typography variant="body1" component="div">
                The following error(s) occurred while attempting to search:
                <div
                    className="scroll-bar"
                    style={{
                        maxHeight: 200,
                        overflowY: "auto",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography style={styles.pre} component="div">
                        {(() => {
                            if (Array.isArray(props.error)) {
                                return [
                                    <div key="results_error_count">
                                        <b>Error count: {props.error.length}</b>
                                        <br />
                                        <br />
                                    </div>,
                                    ...props.error.map((err, i) => {
                                        let key =
                                            err.split(":")[0] || `ind_${i}`;
                                        return (
                                            <div key={`results_error_${key}`}>
                                                {err}
                                                <br />
                                                <br />
                                            </div>
                                        );
                                    }),
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
