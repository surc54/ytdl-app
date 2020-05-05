import { BrowserWindow } from "electron";

export const minimize = (window: BrowserWindow) => {
    window.minimize();
};

export const maximize = (window: BrowserWindow) => {
    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
};

export const close = (window: BrowserWindow) => {
    window.close();
};
