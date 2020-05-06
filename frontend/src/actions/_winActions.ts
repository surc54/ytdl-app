import { TAction, WindowActions } from "./types";

export const minimizeWindow = (): TAction<WindowActions> => (
    dispatch,
    getState
) => {
    console.log("Minimize");
    console.log("Current State: ", getState());

    dispatch({
        type: "WINDOW_MINIMIZE",
    });
};
