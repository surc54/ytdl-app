import * as types from "../actions/types";

const INITIAL_STATE = {
    type: "",
    videos: [],
    err: null,
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
        case types.GET_SINGLE_VIDEO_INFO:
            return {
                ...state,
                type: "videos",
                videos: [action.payload],
            };
        case types.GET_SINGLE_VIDEO_INFO_ERR:
            return {
                ...state,
                type: "error",
                err: action.payload,
            };
        default:
            return state;
    }
};
