import { CircularProgress, Typography } from "@material-ui/core";
import { pure } from "recompose";
import React from "react";

const WaitingButtonGroup = props => {
    const { percent } = props.job;

    const printPercent = () => {
        let invis = "";
        if (percent < 10) {
            invis = "00";
        } else if (percent < 99) {
            invis = "0";
        }
        return (
            <>
                <span style={{ color: "rgba(255, 255, 255, 0.1)" }}>
                    {invis}
                </span>
                {percent}
            </>
        );
    };

    return (
        <>
            {/* <Typography variant="button">{process}</Typography> */}
            <CircularProgress size={20} />
            <Typography variant="button">{printPercent()}%</Typography>
        </>
    );
};

export default pure(WaitingButtonGroup);
