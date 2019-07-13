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
import { pure } from "recompose";
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
    console.log(`Video Details Dialog ${video.video_id} rendered!`);
    const classes = useStyles();

    function handleClose() {
        if (onClose && typeof onClose === "function") onClose();
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
            <VideoDetailsDialogContent
                video={video}
                handleClose={handleClose}
            />
        </Dialog>
    );
};

const VideoDetailsDialogContent = ({ video, handleClose }) => {
    console.log(`Video Details Dialog Content ${video.video_id} rendered!`);

    return (
        <>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </>
    );
};

let panelRenderKeys = 0;
function renderPanels(cat, disableArrayExpand = true) {
    if (typeof cat === "object") {
        if (Array.isArray(cat)) {
            return _.map(cat, (c, i) => {
                return (
                    <ExpansionPanel
                        key={`${i}_${panelRenderKeys++}`}
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
                        key={`${panelRenderKeys++}_${key}`}
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
        if (typeof cat === "boolean") return cat ? "TRUE / YES" : "FALSE / NO";
        return cat;
    }
}

export default pure(VideoDetailsDialog);
