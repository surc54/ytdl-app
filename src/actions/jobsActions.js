import * as types from "./types";

export const setJobFormat = (position, format) => {
    return {
        type: types.SET_JOB_FORMAT,
        payload: {
            position,
            format,
        },
    };
};

export const resetAllJobsFormat = () => {
    return {
        type: types.RESET_ALL_JOBS_FORMAT,
    };
};

export const clearJobs = () => {
    return {
        type: types.CLEAR_JOBS,
    };
};

export const startOneJob = videoId => {
    /*
        TODO:
          - Confirm video is in state (redux thunk?)
          - Confirm save location is set.
          - Send request using ipcRenderer.
          - Update status in jobs state.
          - Listen for progress/end/stop/error events, and
            update status appropriately.
          - 
     */
};
