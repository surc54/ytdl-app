import * as types from "./types";
import history from "../history";
import lookup from "../apis/VideoLookup";
import _ from "lodash";

const regularLink = new RegExp(
    /^(http(s?):\/\/)?(www\.)?(youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})(&.*)?$/i
);
const shortLink = new RegExp(
    /^(http(s?):\/\/)?(youtu\.be\/)([A-Za-z0-9_-]{11})(&.*)?$/i
);
// https://www.youtube.com/playlist?list=PL39u5ZEfYDEPrTRBxGC13BpO4X_Qx-mki
const playlistLink = new RegExp(
    /^(http(s?):\/\/)?(www\.)?(youtube\.com\/playlist\?list=)([A-Za-z0-9_-]+)(&.*)?$/i
);

export const search = query => {
    query = query.trim();

    const regular = regularLink.test(query);
    const short = shortLink.test(query);
    const playlist = playlistLink.test(query);

    if (!regular && !short && !playlist) {
        console.log(`Could not parse the URL "${query}"`);
        throw new Error("Could not parse URL");
    }

    let videoId;
    if (regular) {
        let playlistId = getPlaylistId(query);
        if (playlistId) {
            throw new Error(
                `Not really an error, but just letting you know we found a playlist id: ${playlistId}`
            );
        }
        query = query.split(/.*youtube\.com\/watch\?v=/i)[1];
        videoId = query.split("&")[0];
    } else if (short) {
        query = query.split(/.*youtu.be\//i)[1];
        videoId = query.split("&")[0];
    } else if (playlist) {
        query = query.split(/.*youtube\.com\/playlist\?list=/i)[1];
        videoId = query.split("&")[0];
    } else {
        console.log(
            `This should not be possible, but the url is neither regular nor short: "${query}"`
        );
        throw new Error("Could not parse URL");
    }

    if (!playlist) {
        return async dispatch => {
            console.log(`Looking up video id: ${videoId}`);

            dispatch({
                type: types.SET_RESULTS_LOADING,
            });

            lookup(videoId)
                .then(result => {
                    dispatch({
                        type: types.GET_SINGLE_VIDEO_INFO,
                        payload: result,
                    });
                })
                .catch(err => {
                    dispatch({
                        type: types.GET_SINGLE_VIDEO_INFO_ERR,
                        payload: err,
                    });
                });

            history.push("/select");
        };
    } else {
        return async dispatch => {
            console.log(`Looking up playlist id: ${videoId}`);

            dispatch({
                type: types.SET_RESULTS_LOADING,
            });

            lookup(videoId, true)
                .then(result => {
                    dispatch({
                        type: types.GET_PLAYLIST_INFO,
                        payload: result,
                    });
                })
                .catch(err => {
                    dispatch({
                        type: types.GET_PLAYLIST_INFO_ERR,
                        payload: err,
                    });
                });

            history.push("/select");
        };
    }
};

const getPlaylistId = url => {
    if (!regularLink.test(url)) {
        throw new Error(
            "Url did not match regular link when trying to find playlist id"
        );
    }

    let query = url.split(/.*youtube\.com\/watch\?v=/i)[1];
    query = query.split("&");

    for (let i = 0; i < query.length; i++) {
        if (query[i].toLowerCase().startsWith("list=")) {
            return query[i].split("list=")[1];
        }
    }

    return null;
};

export const setResultsError = err => {
    return {
        type: types.GET_SINGLE_VIDEO_INFO_ERR,
        payload: err,
    };
};

export const setResultFormat = (id, format) => {
    return {
        type: types.SET_RESULT_FORMAT,
        payload: {
            id,
            format,
        },
    };
};

export const addAllResultsToJobs = () => {
    return (dispatch, getState) => {
        const state = getState();
        dispatch({
            type: types.ADD_MULTIPLE_TO_JOB_LIST,
            payload: _.reject(
                state.results.videos,
                val => !!state.jobs.videos[val.video_id]
            ),
        });
    };
};

export const clearResults = () => {
    return {
        type: types.CLEAR_RESULTS,
    };
};
