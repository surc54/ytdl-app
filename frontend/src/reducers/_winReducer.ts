import { Reducer } from "redux";
import { WindowActions } from "../actions/types";

const INIT: WindowState = {
    maximized: false,
    minimized: false,
    focused: true,
};

const reducer: Reducer<WindowState, WindowActions> = (state = INIT, action) => {
    switch (action.type) {
        case "WINDOW_MINIMIZE": {
            return {
                ...state,
                minimized: true,
            };
        }
        case "WINDOW_UNMINIMIZE": {
            return {
                ...state,
                minimized: false,
            };
        }
        case "WINDOW_MAXIMIZE": {
            return {
                ...state,
                maximized: true,
            };
        }
        case "WINDOW_UNMAXIMIZE": {
            return {
                ...state,
                maximized: false,
            };
        }
        case "WINDOW_FOCUS": {
            return {
                ...state,
                focused: true,
            };
        }
        case "WINDOW_BLUR": {
            return {
                ...state,
                focused: false,
            };
        }
        default:
            return state;
    }
};

export default reducer;

export interface WindowState {
    maximized: boolean;
    minimized: boolean;
    focused: boolean;
}
