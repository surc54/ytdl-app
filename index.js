// import { app, BrowserWindow } from "electron";
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const ytdl = require("ytdl-core");
const ytlist = require("youtube-playlist");
const fs = require("fs");
const filenamify = require("filenamify");

// require("electron-reload")(__dirname, {
//     electron: path.join(__dirname, "node_modules", "electron"),
// });

/**
 * @type {BrowserWindow}
 */
let mainWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        minHeight: 400,
        minWidth: 400,
        webPreferences: {
            backgroundThrottling: false,
            nodeIntegration: true,
        },
        frame: false,
        // show: false,
        icon: path.join(__dirname, "public", "logo.ico"),
        backgroundColor: "#292929",
    });

    BrowserWindow.addDevToolsExtension(
        "C:/Users/adith/AppData/Local/Microsoft/Edge Dev/User Data/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0"
    );
    BrowserWindow.addDevToolsExtension(
        "C:/Users/adith/AppData/Local/Microsoft/Edge Dev/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.6.0_0"
    );

    // mainWindow.webContents.toggleDevTools();

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.loadURL("http://localhost:3000/select");

    mainWindow.on("maximize", () => {
        mainWindow.webContents.send("window:maximized");
    });

    mainWindow.on("unmaximize", () => {
        mainWindow.webContents.send("window:unmaximized");
    });
});

ipcMain.on("video:download", async (event, arg) => {
    const videoId = "dQw4w9WgXcQ";
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const stream = ytdl(url, {
        filter: "audioonly",
    });
    stream.pipe(fs.createWriteStream("audioonly.mp4"));
    stream.on("end", () => console.log("STREAM: END"));
    stream.on("close", () => console.log("STREAM: CLOSE"));
    stream.on("progress", (chunkLength, downloaded, total) =>
        console.log(
            "STREAM: PROGRESS ",
            chunkLength,
            ">>",
            downloaded + "/" + total,
            `${Math.round((downloaded * 100) / total)}%`
        )
    );
});

ipcMain.on("ytdl:open", (e, args) => {
    if (args.folder) {
        shell.showItemInFolder(args.path);
    } else {
        shell.openItem(args.path);
    }
});

ipcMain.on("ytdl:download", (event, arg) => {
    console.log(arg);
    arg.videos.forEach((video, index) => {
        const url = `https://www.youtube.com/watch?v=${video.id}`;

        let itag = null;
        let container = null;
        let quality = null;
        if (video.format.startsWith("itag:")) {
            const split = video.format.split(":");
            itag = split[1];
            container = split[2];
            if (container === "unknown") {
                container = "flv";
            }
        } else {
            switch (video.format) {
                case "hq-mp4":
                    quality = "highest";
                    container = "mp4";
                    break;
                case "lq-mp4":
                    quality = "lowest";
                    container = "mp4";
                    break;
                case "hq-mp3":
                    quality = "highestaudio";
                    container = "mp3";
                    break;
                case "lq-mp3":
                    quality = "lowestaudio";
                    container = "mp3";
                    break;
                case "hq-mp4-no-audio":
                    quality = "highestvideo";
                    container = "mp4";
                    break;
                case "lq-mp4-no-audio":
                    quality = "lowestvideo";
                    container = "mp4";
                    break;
                default:
                    quality = "highest";
                    container = "mp4";
                    break;
            }
        }

        const stream = ytdl(url, {
            quality: itag ? itag : quality,
            filter: !itag
                ? (() => {
                      if (quality.indexOf("audio") !== -1) {
                          return "audioonly";
                      } else if (quality.indexOf("video") !== -1) {
                          return "videoonly";
                      } else {
                          return "audioandvideo";
                      }
                  })()
                : null,
        });

        const filePath = path.join(
            arg.saveDirectory,
            filenamify(video.title, {
                replacement: "_",
            }) + `.${container}`
        );

        stream.pipe(fs.createWriteStream(filePath));

        stream.on("end", () => {
            console.log(`${video.id}: Stream Ended`);
            event.reply(`ytdl:download-complete:${video.id}`, {
                id: video.id,
                path: filePath,
            });
        });

        stream.on("close", () => console.log(`${video.id}: Stream Closed`));

        let lastProgress = new Date().getTime();
        stream.on("progress", (chunkLength, downloaded, total) => {
            if (new Date().getTime() - lastProgress > 1000) {
                const percent = Math.round((downloaded * 100) / total);
                event.reply(`ytdl:download-progress:${video.id}`, {
                    id: video.id,
                    progress: percent,
                });

                lastProgress = new Date().getTime();
            }
        });
    });
});

ipcMain.on("ytdl:choose-directory", (event, arg) => {
    const resp = dialog.showOpenDialog(mainWindow, {
        title: "Choose save location",
        buttonLabel: "Choose Directory",
        properties: ["openDirectory", "promptToCreate"],
        message: "Choose where to save your downloads",
    });

    event.reply("ytdl:directory", resp);
});

ipcMain.on("video:info", async (event, arg) => {
    console.log(`Video Info Request: ${arg}`);
    let err = null;
    let response;
    try {
        response = await ytdl.getInfo(`https://www.youtube.com/watch?v=${arg}`);
    } catch (e) {
        err = e;
    }
    event.reply(`video:info-received`, {
        status: err ? "fail" : "ok",
        err: err ? err.message : null,
        result: response,
    });
    event.reply(`video:info-received:${arg}`, {
        status: err ? "fail" : "ok",
        err: err ? err.message : null,
        result: response,
    });
});

ipcMain.on("playlist:info", async (event, arg) => {
    console.log(`Playlist Info Request: ${arg}`);

    ytlist(`https://www.youtube.com/playlist?list=${arg}`, "id")
        .then(res => {
            const videoIds = res.data.playlist;
            const promises = [];

            if (videoIds.length === 0) {
                throw new Error("No videos found in playlist");
            }

            videoIds.forEach(id => {
                promises.push(
                    ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`).then(
                        vid => ({ status: "ok", id, video: vid }),
                        err => {
                            return { status: "fail", id, error: err.message };
                        }
                    )
                );
            });

            Promise.all(promises)
                .then(responses => {
                    event.reply(`playlist:info-received:${arg}`, {
                        status: "ok",
                        result: responses,
                    });
                })
                .catch(err => {
                    throw new Error(`An error occurred: ${err.message}`);
                });
        })
        .catch(err => {
            event.reply(`playlist:info-received:${arg}`, {
                status: "fail",
                err: err.message,
            });
        });
});

ipcMain.on("window:dev-tools", (event, arg) => {
    mainWindow.webContents.toggleDevTools();
});

ipcMain.on("window:maximize", (event, arg) => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on("window:minimize", e => {
    mainWindow.minimize();
});

ipcMain.on("window:close", e => {
    mainWindow.close();
    app.quit();
});
