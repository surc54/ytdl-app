import * as types from "../actions/types";
import _ from "lodash";

const INITIAL_STATE = {
    generalFormat: "hq-mp4",
    saveDirectory: null,
    videos: {},
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.ADD_TO_JOB_LIST:
            return {
                ...state,
                videos: {
                    ...state.videos,
                    [action.payload.video.video_id]: {
                        position: _.size(state.videos) + 1,
                        video: action.payload.video,
                        format: action.payload.format,
                        process: "waiting",
                        // _.size(state.videos) === 3 ? "done" : "downloading", // TODO: CHANGE BACK
                        percent: 0,
                    },
                },
            };
        case types.ADD_MULTIPLE_TO_JOB_LIST:
            const newVideos = {};
            action.payload.forEach((v, index) => {
                newVideos[v.video.video_id] = {
                    position: _.size(state.videos) + 1 + index,
                    video: v.video,
                    format: v.format,
                    process: "waiting",
                    percent: 0,
                };
            });

            return {
                ...state,
                videos: {
                    ...state.videos,
                    ...newVideos,
                },
            };
        case types.REMOVE_FROM_JOB_LIST:
            // Do checks for if they are in progress?
            return {
                ...state,
                videos: {
                    ..._.omit(state.videos, action.payload),
                },
            };
        case types.SET_GENERAL_JOB_FORMAT:
            return {
                ...state,
                generalFormat: action.payload,
            };
        case types.SET_JOB_FORMAT:
            return {
                ...state,
                videos: {
                    ...state.videos,
                    [action.payload.id]: {
                        ...state.videos[action.payload.id],
                        format: action.payload.format,
                    },
                },
            };
        case types.RESET_ALL_JOBS_FORMAT:
            const newState = { ...state };

            _.forEach(newState.videos, (val, key) => {
                newState.videos[key].format = "";
            });

            return newState;
        case types.CLEAR_JOBS:
            return {
                ...state,
                videos: {},
            };
        case types.CLEAR_COMPLETE_JOBS:
            return {
                ...state,
                videos: _.omitBy(
                    state.videos,
                    (val, key) => val.process === "done"
                ),
            };
        case types.SET_SAVE_DIRECTORY:
            return {
                ...state,
                saveDirectory: action.payload,
            };
        case types.DOWNLOAD_START:
            return {
                ...state,
                videos: {
                    ...state.videos,
                    [action.payload]: {
                        ...state.videos[action.payload],
                        process: "downloading",
                        percent: 0,
                    },
                },
            };
        case types.DOWNLOAD_COMPLETE:
            return {
                ...state,
                videos: {
                    ...state.videos,
                    [action.payload.id]: {
                        ...state.videos[action.payload.id],
                        process: "done",
                        percent: 100,
                        path: action.payload.path,
                    },
                },
            };
        case types.DOWNLOAD_PROGRESS:
            return {
                ...state,
                videos: {
                    ...state.videos,
                    [action.payload.id]: {
                        ...state.videos[action.payload.id],
                        percent: action.payload.progress,
                    },
                },
            };
        default:
            return state;
    }
};
