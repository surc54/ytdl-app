import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import windowReducer from "./windowReducer";
import resultReducer from "./resultReducer";
import jobReducer from "./jobReducer";
import progressReducer from "./progressReducer";

export default combineReducers({
    window: windowReducer,
    form: formReducer,
    results: resultReducer,
    jobs: jobReducer,
    progress: progressReducer,
});
