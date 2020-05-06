import { ThunkAction } from "redux-thunk";
import { ReduxState } from "../reducers";
import { Action } from "redux";

export type TAction<A extends Action<any>> = ThunkAction<
    void,
    ReduxState,
    undefined,
    A
>;

export type WindowActions =
    | {
          type: "WINDOW_MINIMIZE";
      }
    | {
          type: "WINDOW_UNMINIMIZE";
      }
    | {
          type: "WINDOW_MAXIMIZE";
      }
    | {
          type: "WINDOW_UNMAXIMIZE";
      }
    | {
          type: "WINDOW_FOCUS";
      }
    | {
          type: "WINDOW_BLUR";
      }
    | {
          type: "WINDOW_CLOSE";
      };
