import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import { connect } from "react-redux";
import { search, clearEmbeddedPlaylistDetails } from "../../actions";
import React from "react";

const PlaylistAvailableDialog = props => {
    const {
        // Redux Connections
        details,
        // Redux Actions
        search,
        clearEmbeddedPlaylistDetails,
        ...other
    } = props;

    const searchPlaylist = () => {
        handleClose();
        search(`https://www.youtube.com/playlist?list=${details.playlist}`);
    };

    const searchVideo = () => {
        handleClose();
        search(`https://www.youtube.com/watch?v=${details.video}`);
    };

    function handleClose() {
        clearEmbeddedPlaylistDetails();
    }

    return (
        <Dialog
            {...other}
            open={!!details}
            disableBackdropClick
            disableEscapeKeyDown
        >
            <DialogTitle>
                Do you want to search the entire playlist?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    The link you entered contained a playlist along with a
                    video. You have the option to search either the video by
                    itself, or the entirety of the playlist.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={searchPlaylist} color="primary">
                    Playlist
                </Button>
                <Button onClick={searchVideo} color="primary" autoFocus>
                    Video
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const mapStateToProps = state => {
    return {
        details: state.results.embeddedPlaylistDetails,
    };
};

export default connect(
    mapStateToProps,
    { search, clearEmbeddedPlaylistDetails }
)(PlaylistAvailableDialog);
