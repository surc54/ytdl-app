import { BrowserWindow, ipcMain } from "electron";
import * as WindowController from "../controllers/WindowController";

const handleWindowPassthrough = (
    func: Function
): ((event: Electron.IpcMainEvent, ...args: any[]) => void) => (
    event,
    args
) => {
    const win = BrowserWindow.fromWebContents(event.sender);

    if (!win) {
        console.error("Window event came from WebContents without a window.");
        return;
    }

    func(win);
};

ipcMain.on(
    "window:minimize",
    handleWindowPassthrough(WindowController.minimize)
);

ipcMain.on(
    "window:maximize",
    handleWindowPassthrough(WindowController.maximize)
);

ipcMain.on("window:close", handleWindowPassthrough(WindowController.close));
