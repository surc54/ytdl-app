const { ipcRenderer } = window.require("electron");

const lookup = videoId => {
    const videoIdTester = new RegExp(/([A-Za-z0-9_-]+)/i);

    if (!videoIdTester.test(videoId)) {
        throw new Error("Video ID did not match pattern (lookup)");
    }

    return new Promise((resolve, reject) => {
        ipcRenderer.send("video:info", videoId);

        ipcRenderer.once(`video:info-received:${videoId}`, (event, data) => {
            if (data.status !== "ok") {
                reject(data.err);
            } else {
                resolve(data.result);
            }
        });
    });
};

export default lookup;
