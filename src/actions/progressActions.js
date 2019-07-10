import * as types from "./types";
import _ from "lodash";

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

export const updateProgress = () => {
    return (dispatch, getState) => {
        const state = getState();
        const jobs = state.jobs.videos;

        let total = 0;
        let percentDone = 0;
        _.forEach(jobs, ({ process, percent }, key) => {
            if (!process) return;
            if (process === "waiting") return;
            total += 100;
            percentDone += percent;
        });
        if (total === 0) {
            dispatch(setTotalProgress(0));
        } else {
            dispatch(setTotalProgress(Math.floor((100 * percentDone) / total)));
        }
    };
};
