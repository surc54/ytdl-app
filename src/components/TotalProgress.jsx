import { Container, Grid, LinearProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { connect } from "react-redux";
import "./TotalProgress.scss";

const useStyle = makeStyles(theme => ({
    contentWrapper: {
        backgroundColor: theme.palette.background.paper,
    },
    progressRoot: {
        backgroundColor: theme.palette.background.paper,
    },
}));

const TotalProgress = props => {
    const classes = useStyle();

    return (
        <div className="total-progress">
            {props.progress.statusBar && (
                <Container
                    className={`inner-content ${classes.contentWrapper}`}
                >
                    <Grid container>
                        <Grid item xs={10} style={{ overflowX: "hidden" }}>
                            <Typography variant="button" noWrap>
                                Status: {props.progress.status}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} style={{ textAlign: "right" }}>
                            <Typography>
                                {props.progress.totalProgress}%
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            )}
            {props.progress.progressBar && (
                <LinearProgress
                    variant={
                        props.progress.totalProgress === 0
                            ? "indeterminate"
                            : "determinate"
                    }
                    color="primary"
                    value={props.progress.totalProgress}
                    className="progress-bar"
                    style={{ flex: "1 auto" }}
                    classes={{
                        root: classes.progressRoot,
                    }}
                />
            )}
        </div>
    );
};

const mapStateToProps = state => {
    return {
        progress: state.progress,
    };
};

export default connect(mapStateToProps)(TotalProgress);
