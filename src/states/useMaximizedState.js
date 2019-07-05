import { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");

export default class MaximizedStateManager {
    static maximized;
    static setMaximized;

    useMaximizedState = () => {
        let [maximized, setMaximized] = useState(false);
        MaximizedStateManager.maximized = maximized;
        MaximizedStateManager.setMaximized = setMaximized;

        useEffect(() => {
            ipcRenderer.on("window:maximized", () => {
                console.log("Window maximize detected");
                setMaximized(true);
            });

            ipcRenderer.on("window:unmaximized", () => {
                console.log("Window unmaximize detected");
                setMaximized(false);
            });
        }, []);

        return maximized;
    };
}
