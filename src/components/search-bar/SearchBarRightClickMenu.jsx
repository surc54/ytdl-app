import { Menu, MenuItem } from "@material-ui/core";
import _ from "lodash";
import React from "react";

/**
 *
 * @param props.setAnchor
 * @param props.anchorEl
 * @param [props.open]
 */
const SearchBarRightClickMenu = props => {
    const handleClose = () => {
        props.setAnchor(null);
    };

    return (
        <Menu
            id="search-bar-right-click-menu"
            anchorEl={props.anchorEl}
            keepMounted
            open={Boolean(props.anchorEl)}
            onClose={handleClose}
            {..._.omit(props, "setAnchor")}
        >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
    );
};

export default SearchBarRightClickMenu;
