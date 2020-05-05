import { BrowserWindow, app } from "electron";
import "./events/WindowControls.event";
import path from "path";

let mainWindow: BrowserWindow | null = null;

app.allowRendererProcessReuse = true;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    const indexPath = path.join(__dirname, "../frontend/index.html");
    mainWindow.loadURL("http://localhost:3000/");

    // urlToId("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    mainWindow.webContents.toggleDevTools();
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q

    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
