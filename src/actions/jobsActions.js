import * as types from "./types";
import lookup from "../apis/VideoLookup";
import _ from "lodash";
const { ipcRenderer } = window.require("electron");

export const addToJobList = (video, lookupRequired = false) => {
    if (lookupRequired) {
        return (dispatch, getState) => {
            // TODO: Implement video cache idea here
            console.log(`Adding to job list via lookup: ${video}`);
            lookup(video)
                .then(vid => {
                    console.log(`Got video for job list(${video}):`, vid);
                    dispatch(addToJobList(vid));
                })
                .catch(err => {
                    // TODO: ERROR MANAGEMENT??
                    console.error(err);
                    throw new Error(
                        "You didn't catch this error lol (" + err.message + ")"
                    );
                });
        };
    }

    return {
        type: types.ADD_TO_JOB_LIST,
        payload: {
            video,
            format: "", // FIX THAT
        },
    };
};

export const removeFromJobList = videoId => {
    return {
        type: types.REMOVE_FROM_JOB_LIST,
        payload: videoId,
    };
};

export const setGeneralFormat = format => {
    return {
        type: types.SET_GENERAL_JOB_FORMAT,
        payload: format,
    };
};

export const setJobFormat = (id, format) => {
    return {
        type: types.SET_JOB_FORMAT,
        payload: {
            id,
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

export const setSaveDirectory = callback => {
    return dispatch => {
        ipcRenderer.send("ytdl:choose-directory");

        ipcRenderer.once("ytdl:directory", (e, args) => {
            if (!args || !args[0]) {
                console.log(
                    "Directory event was sent and we got something unexpected:"
                );
                console.log("Event:", e);
                console.log("Arguments:", args);

                if (callback) {
                    callback("Directory was not set.");
                }

                throw new Error("Directory was not set.");
            }

            const dir = args[0];
            dispatch({
                type: types.SET_SAVE_DIRECTORY,
                payload: dir,
            });

            if (callback) {
                callback();
            }
        });
    };
};

export const startOneJob = videoId => {
    return async (dispatch, getState) => {
        const state = getState();
        const jobs = state.jobs.videos;
        const job = _.find(jobs, { video_id: videoId });
        if (!job) {
            throw new Error(
                `Could not find video "${videoId}" while attempting to start one job.`
            );
        }
        if (!state.jobs.saveDirectory) {
            dispatch(
                setSaveDirectory(err => {
                    if (err) {
                        throw new Error(
                            `Could not start job ${videoId} because save directory was not set.`
                        );
                    }
                    dispatch(startOneJob(videoId));
                })
            );
            return;
        }

        // SEND IPCRENDERER REQUEST
    };
    /*
        TODO:
          - Confirm video is in state (redux thunk?)
          - Confirm save location is set.
          - Send request using ipcRenderer.
          - Update status in jobs state.
          - Listen for progress/end/stop/error events, and
            update status appropriately.
          - and more!
     */
};

export const startAllJobs = () => {
    /*
        The above, but with every job.
    */
};
