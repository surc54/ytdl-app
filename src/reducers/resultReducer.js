import * as types from "../actions/types";
import _ from "lodash";

const INITIAL_STATE = {
    type: "",
    videos: [],
    err: null,
    sameErrCounter: 0,
    embeddedPlaylistDetails: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.GET_VIDEO_INFO:
            return { ...state };
        case types.SET_RESULTS_LOADING:
            return {
                ...state,
                type: "loading",
            };
        case types.CLEAR_RESULTS:
            return INITIAL_STATE;
        case types.GET_SINGLE_VIDEO_INFO:
            return {
                ...state,
                type: "videos",
                videos: [
                    {
                        format: "",
                        video: action.payload,
                    },
                ],
                err: null,
            };
        case types.GET_PLAYLIST_INFO: {
            const videos = [];
            const err = [];
            action.payload.forEach(v => {
                if (v.status !== "ok") {
                    err.push(`${v.id}: ${v.error}`);
                } else {
                    videos.push({
                        format: "",
                        video: v.video,
                    });
                }
            });
            return {
                ...state,
                type: "videos",
                videos: videos,
                err: err.length === 0 ? null : err,
            };
        }
        case types.GET_SINGLE_VIDEO_INFO_ERR:
            let sameErrCounter = 0;
            if (action.payload === state.err) {
                sameErrCounter = state.sameErrCounter + 1;
            }
            return {
                ...state,
                type: "error",
                err: action.payload,
                sameErrCounter,
            };
        case types.SET_RESULT_FORMAT:
            const index = _.findIndex(
                state.videos,
                v => v.video.video_id === action.payload.id
            );
            if (index === -1) {
                return state;
            }

            const videos = [...state.videos];
            videos[index] = {
                ...videos[index],
                format: action.payload.format,
            };

            return {
                ...state,
                videos,
            };
        case types.SET_EMBEDDED_PLAYLIST_DETAILS:
            return {
                ...state,
                embeddedPlaylistDetails: action.payload,
            };

        case types.CLEAR_EMBEDDED_PLAYLIST_DETAILS:
            return {
                ...state,
                embeddedPlaylistDetails: null,
            };

        default:
            return state;
    }
};
