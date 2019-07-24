import * as types from "./types";
import lookup from "../apis/VideoLookup";
import _ from "lodash";
import {
    showProgressBar,
    showStatusBar,
    updateProgress,
    setProgressStatus,
} from "./progressActions";
const { ipcRenderer } = window.require("electron");

export const addToJobList = (video, lookupRequired = false, format = "") => {
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
                    dispatch({
                        type: types.ADD_JOB_WITH_LOOKUP_ERROR,
                        payload: err,
                    });
                    // console.error(err);
                    // throw new Error(
                    //     "You didn't catch this error lol (" + err.message + ")"
                    // );
                });
        };
    }

    return {
        type: types.ADD_TO_JOB_LIST,
        payload: {
            video,
            format,
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

export const clearCompleteJobs = () => {
    return {
        type: types.CLEAR_COMPLETE_JOBS,
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
        const job = jobs[videoId];

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

        if (!job.format && !state.jobs.generalFormat) {
            throw new Error("No selected format.");
        }

        listenForCompletion(videoId, dispatch, getState);
        listenForProgress(videoId, dispatch, getState);

        ipcRenderer.send("ytdl:download", {
            requestType: "single",
            saveDirectory: state.jobs.saveDirectory,
            videos: [
                {
                    id: videoId,
                    format: job.format || state.jobs.generalFormat,
                    title: job.video.title,
                },
            ],
        });

        dispatch(setProgressStatus("Downloading"));

        dispatch(showProgressBar(true));

        dispatch(showStatusBar(true));

        dispatch({
            type: types.DOWNLOAD_START,
            payload: [videoId],
        });

        dispatch(updateProgress());

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
    return async (dispatch, getState) => {
        const state = getState();
        const jobs = state.jobs.videos;
        const videos = [];
        const ids = [];

        if (!state.jobs.saveDirectory) {
            dispatch(
                setSaveDirectory(err => {
                    if (err) {
                        throw new Error(
                            `Could not start all jobs because save directory was not set.`
                        );
                    }
                    dispatch(startAllJobs());
                })
            );
            return;
        }

        _.forEach(jobs, (job, id) => {
            if (!job.format && !state.jobs.generalFormat) {
                throw new Error(`No selected format (${id}).`);
            }

            if (job.process !== "waiting") return;

            videos.push({
                id: id,
                format: job.format || state.jobs.generalFormat,
                title: job.video.title,
            });

            ids.push(id);

            listenForCompletion(id, dispatch, getState);
            listenForProgress(id, dispatch, getState);
        });

        dispatch({
            type: types.DOWNLOAD_START,
            payload: ids,
        });

        ipcRenderer.send("ytdl:download", {
            requestType: "multiple",
            saveDirectory: state.jobs.saveDirectory,
            videos,
        });

        dispatch(setProgressStatus("Downloading"));

        dispatch(showProgressBar(true));

        dispatch(showStatusBar(true));

        dispatch(updateProgress());

        // SEND IPCRENDERER REQUEST
    };
};

export const setDownloadError = (videoId, error) => {
    return {
        type: types.DOWNLOAD_ERROR,
        payload: {
            id: videoId,
            err: error,
        },
    };
};

const listenForCompletion = (videoId, dispatch, getState) => {
    ipcRenderer.once(`ytdl:download-complete:${videoId}`, (e, args) => {
        dispatch({
            type: types.DOWNLOAD_COMPLETE,
            payload: args,
        });

        ipcRenderer.removeAllListeners(`ytdl:download-progress:${videoId}`);

        dispatch(updateProgress());

        const state = getState();

        const inProgress = _.filter(
            state.jobs.videos,
            job => job.process !== "waiting" && job.process !== "done"
        );

        if (inProgress.length === 0) {
            // dispatch(showProgressBar(false));
            dispatch(showStatusBar(false));
            dispatch(setProgressStatus("Complete"));
        }
    });
};

let progressListener = null;

const listenForProgress = (videoId, dispatch, getState) => {
    if (!progressListener) {
        progressListener =
            ipcRenderer.on(`ytdl:bulk-download-progress`, (e, args) => {
                dispatch({
                    type: types.DOWNLOAD_BULK_PROGRESS,
                    payload: args,
                });

                dispatch(updateProgress());
            }) || true;
    }

    // ipcRenderer.on(`ytdl:download-progress:${videoId}`, (e, args) => {
    //     dispatch({
    //         type: types.DOWNLOAD_PROGRESS,
    //         payload: args,
    //     });

    //     dispatch(updateProgress());
    // });
};
