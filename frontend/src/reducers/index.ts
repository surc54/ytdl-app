import { combineReducers } from "redux";
import WindowReducer, { WindowState } from "./_winReducer";

export default combineReducers<ReduxState>({
    window: WindowReducer,
});

export interface ReduxState {
    window: WindowState;
}
