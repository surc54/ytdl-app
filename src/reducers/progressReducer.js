import * as types from "../actions/types";

const INITIAL_STATE = {
    status: "Waiting to start",
    totalProgress: 67,
    statusBar: true,
    progressBar: true,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SET_PROGRESS_STATUS:
            return {
                ...state,
                status: action.payload,
            };
        case types.SET_TOTAL_PROGRESS:
            return {
                ...state,
                totalProgress: Number(action.payload) % 101,
            };
        case types.SHOW_STATUS_BAR:
            return {
                ...state,
                statusBar: action.payload,
            };
        case types.SHOW_PROGRESS_BAR:
            return {
                ...state,
                progressBar: action.payload,
            };
        default:
            return state;
    }
};
