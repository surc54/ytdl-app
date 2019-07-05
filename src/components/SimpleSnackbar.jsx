import React from "react";
import { Snackbar } from "@material-ui/core";

const SimpleSnackbar = props => {
    return <Snackbar autoHideDuration={4000} {...props} />;
};

export default SimpleSnackbar;
