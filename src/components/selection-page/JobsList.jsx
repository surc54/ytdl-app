import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { setJobFormat } from "../../actions";
import VideoCard from "../video-card/VideoCard";
import Scrollbars from "react-custom-scrollbars";
import { useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";

const JobsList = props => {
    const onFormatChange = (e, position) => {
        props.setJobFormat(position, e.target.value);
    };

    const theme = useTheme();
    // console.log("THEME: ", theme);
    const isXS = useMediaQuery(theme.breakpoints.only("xs"));

    const heightCutoff = props.adjustForControls ? 250 : 215;

    return (
        <Scrollbars
            style={{
                overflowY: "auto",
                height: `calc(100vh - ${heightCutoff}px)`,
            }}
        >
            {_.map(props.jobs, (job, position) => {
                return (
                    <VideoCard
                        style={{ marginRight: 15, marginLeft: isXS ? 15 : 0 }}
                        job
                        video={job.video}
                        format={job.format || ""}
                        key={position}
                        onFormatChange={e => {
                            onFormatChange(e, position);
                        }}
                    />
                );
            })}
        </Scrollbars>
    );
};

const mapStateToProps = state => {
    return {
        jobs: state.jobs,
    };
};

export default connect(
    mapStateToProps,
    { setJobFormat }
)(JobsList);
