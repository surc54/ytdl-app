import { CircularProgress, Typography } from "@material-ui/core";
import React from "react";

class InProgressButtonGroup extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.job.percent !== nextProps.job.percent;
    }

    render() {
        const { percent } = this.props.job;

        return (
            <>
                {/* <Typography variant="button">{process}</Typography> */}
                <CircularProgress size={20} />
                <Typography variant="button">
                    {printPercent(percent)}%
                </Typography>
            </>
        );
    }
}

const printPercent = percent => {
    let invis = "";

    if (percent < 10) {
        invis = "00";
    } else if (percent < 99) {
        invis = "0";
    }

    return (
        <>
            <span
                style={{
                    color: "rgba(255, 255, 255, 0.1)",
                }}
            >
                {invis}
            </span>
            {percent}
        </>
    );
};

export default InProgressButtonGroup;
