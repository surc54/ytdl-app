import * as types from "./types";
export * from "./resultsActions";
export * from "./jobsActions";
export * from "./progressActions";
const { ipcRenderer } = window.require("electron");

/**
 * Window Control - Set Maximized
 * Controls the maximize button state and the margin of the title drag section.
 */
export const setMaximized = val => {
    return {
        type: types.SET_MAXIMIZED,
        payload: val,
    };
};

/**
 * @deprecated Use search!
 * Get video information
 * @param {String} id
 */
export const getVideoInfo = id => {
    return async dispatch => {
        console.log("Sending video id: ", id);
        ipcRenderer.send("video:info", id);

        ipcRenderer.on("video:info-received", (event, data) => {
            console.log(event);
            console.log(data);
            dispatch({
                type: types.GET_VIDEO_INFO,
                payload: data,
            });
        });
    };
};
