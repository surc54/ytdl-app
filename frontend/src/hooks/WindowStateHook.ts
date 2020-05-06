import React from "react";
import { WindowState } from "../reducers/_winReducer";
import { useSelector } from "react-redux";
import { ReduxState } from "../reducers";

export const useWindowState = (): WindowStateHook => {
    const state = useSelector<ReduxState, WindowState>((s) => s.window);
    const [ret, setRet] = React.useState<WindowStateHook>({
        ...state,

        minimize: () => {
            console.warn("Unimplemented feature used.");
        },

        maximize: () => {
            console.warn("Unimplemented feature used.");
        },

        unmaximize: () => {
            console.warn("Unimplemented feature used.");
        },

        close: () => {
            console.warn("Unimplemented feature used.");
        },
    });

    React.useEffect(() => {
        setRet({ ...ret, ...state });

        // eslint-disable-next-line
    }, [state]);

    return ret;
};

export interface WindowStateHook extends WindowState {
    minimize(): void;
    maximize(): void;
    unmaximize(): void;
    close(): void;
}
