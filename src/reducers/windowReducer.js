import * as types from "../actions/types";

const INITIAL_STATE = {
    maximized: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SET_MAXIMIZED:
            return {
                ...state,
                maximized: action.payload,
            };
        default:
            return state;
    }
};
