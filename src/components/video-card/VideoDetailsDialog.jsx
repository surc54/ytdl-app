import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
    Icon,
} from "@material-ui/core";
import _ from "lodash";
import { makeStyles } from "@material-ui/styles";
import "./VideoDetailsDialog.scss";

const useStyles = makeStyles(theme => {
    return {
        dialogPaper: {
            backgroundColor: theme.palette.background.default,
        },
    };
});

const VideoDetailsDialog = props => {
    const { video, onClose, style = {}, ...other } = props;
    const classes = useStyles();

    function handleClose() {
        if (onClose && typeof onClose === "function") onClose();
    }

    function renderPanels(cat, disableArrayExpand = true) {
        if (typeof cat === "object") {
            if (Array.isArray(cat)) {
                return _.map(cat, (c, i) => {
                    return (
                        <ExpansionPanel
                            expanded={disableArrayExpand || null}
                            disabled={disableArrayExpand}
                            TransitionProps={{
                                unmountOnExit: true,
                                timeout: 0,
                            }}
                        >
                            <ExpansionPanelSummary
                                expandIcon={<Icon>expand_more</Icon>}
                            >
                                <Typography
                                    variant="body1"
                                    style={{ fontWeight: "bold" }}
                                >
                                    Array Index: {i}
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails
                                style={{
                                    display: "flex",
                                    flexFlow: "column nowrap",
                                    justifyContent: "flex-start",
                                    alignItems: "stretch",
                                    overflowY: "hidden",
                                }}
                            >
                                {renderPanels(c)}
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                });
            } else {
                return _.map(cat, (val, key) => {
                    const ren = renderPanels(val, _.size(cat[key]) < 3);
                    return (
                        <ExpansionPanel
                            TransitionProps={{
                                unmountOnExit: true,
                                timeout: 0,
                            }}
                        >
                            <ExpansionPanelSummary
                                expandIcon={<Icon>expand_more</Icon>}
                            >
                                <Typography
                                    variant="body1"
                                    style={{ fontWeight: "bold" }}
                                >
                                    {key}
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails
                                style={{
                                    display: "flex",
                                    flexFlow: "column nowrap",
                                    justifyContent: "flex-start",
                                    alignItems: "stretch",
                                    overflowY: "hidden",
                                }}
                            >
                                {ren}
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                });
            }
        } else {
            if (typeof cat === "boolean")
                return cat ? "TRUE / YES" : "FALSE / NO";
            return cat;
        }
    }

    return (
        <Dialog
            onClose={handleClose}
            style={{ ...style }}
            {...other}
            fullWidth
            maxWidth="md"
            classes={{
                paper: classes.dialogPaper,
            }}
        >
            <DialogTitle disableTypography>
                <Typography noWrap variant="h6">
                    Video Details: {video.title}
                </Typography>
            </DialogTitle>
            <DialogContent
                dividers
                classes={{
                    root: "scroll-bar-dark vid-details-dialog-content",
                }}
            >
                {renderPanels(video)}
                {/* <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<Icon>expand_more</Icon>}
                    >
                        <Typography variant="body1">
                            Expansion Panel 1
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Suspendisse malesuada lacus ex, sit amet
                            blandit leo lobortis eget.
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VideoDetailsDialog;
