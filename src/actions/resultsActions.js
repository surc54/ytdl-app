import * as types from "./types";
import history from "../history";
const { ipcRenderer } = window.require("electron");

export const search = query => {
    query = query.trim();

    let regularLink = new RegExp(
        /^(http(s?):\/\/)?(www\.)?(youtube\.com\/watch\?v=)([A-Za-z0-9_-]+)(&.*)?$/i
    );
    let shortLink = new RegExp(
        /^(http(s?):\/\/)?(youtu\.be\/)([A-Za-z0-9_-]+)(&.*)?$/i
    );

    const regular = regularLink.test(query);
    const short = shortLink.test(query);

    if (!regular && !short) {
        console.log(`Could not parse the URL "${query}"`);
        throw new Error("Could not parse URL");
    }

    let videoId;
    if (regular) {
        query = query.split(/.*youtube\.com\/watch\?v=/i)[1];
        videoId = query.split("&")[0];
    } else if (short) {
        query = query.split(/.*youtu.be\//i)[1];
        videoId = query.split("&")[0];
    } else {
        console.log(
            `This should not be possible, but the url is neither regular nor short: "${query}"`
        );
        throw new Error("Could not parse URL");
    }

    return async dispatch => {
        console.log("Sending video id...");
        ipcRenderer.send("video:info", videoId);
        dispatch({
            type: types.SET_RESULTS_LOADING,
        });

        ipcRenderer.on("video:info-received", (event, data) => {
            if (data.status !== "ok") {
                dispatch({
                    type: types.GET_SINGLE_VIDEO_INFO_ERR,
                    payload: data.err,
                });
            } else {
                dispatch({
                    type: types.GET_SINGLE_VIDEO_INFO,
                    payload: data.result,
                });
            }
        });

        history.push("/select");
    };
};
