// import { app, BrowserWindow } from "electron";
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ytdl = require("ytdl-core");
const fs = require("fs");

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

    mainWindow.webContents.toggleDevTools();

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

ipcMain.on("video:info", async (event, arg) => {
    console.log(`Video Info Request: ${arg}`);
    let err = null;
    let response;
    try {
        response = await ytdl.getInfo(`https://www.youtube.com/watch?v=${arg}`);
    } catch (e) {
        err = e;
    }
    event.sender.send("video:info-received", {
        status: err ? "fail" : "ok",
        err: err ? err.message : null,
        result: response,
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
