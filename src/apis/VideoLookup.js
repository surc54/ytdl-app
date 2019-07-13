const { ipcRenderer } = window.require("electron");

const lookup = (videoId, playlist = false) => {
    const videoIdTester = new RegExp(/([A-Za-z0-9_-]+)/i);

    if (!videoIdTester.test(videoId)) {
        throw new Error(
            `${
                playlist ? "Playlist" : "Video"
            } ID did not match pattern (lookup)`
        );
    }

    return new Promise((resolve, reject) => {
        ipcRenderer.send(`${playlist ? "playlist" : "video"}:info`, videoId);

        ipcRenderer.once(
            `${playlist ? "playlist" : "video"}:info-received:${videoId}`,
            (event, data) => {
                if (data.status !== "ok") {
                    reject(data.err);
                } else {
                    resolve(data.result);
                }
            }
        );
    });
};

export default lookup;
