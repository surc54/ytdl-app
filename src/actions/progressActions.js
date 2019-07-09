import * as types from "./types";

export const setProgressStatus = status => {
    return {
        type: types.SET_PROGRESS_STATUS,
        payload: status,
    };
};

export const setTotalProgress = percent => {
    return {
        type: types.SET_TOTAL_PROGRESS,
        payload: percent,
    };
};

export const showStatusBar = (show = true) => {
    return {
        type: types.SHOW_STATUS_BAR,
        payload: show,
    };
};

export const showProgressBar = (show = true) => {
    return {
        type: types.SHOW_PROGRESS_BAR,
        payload: show,
    };
};
