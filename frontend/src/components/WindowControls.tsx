import React from "react";
import { Button } from "@material-ui/core";
import clsx from "clsx";
import styles from "./WindowControls.module.scss";

const WindowControls: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <Button className={styles.winBtn}>&#xE921;</Button>
            <Button className={styles.winBtn}>&#xE922;</Button>
            <Button className={styles.winBtn}>&#xE923;</Button>
            <Button className={clsx(styles.winBtn, styles.closeBtn)}>
                &#xE8BB;
            </Button>
        </div>
    );
};

export default WindowControls;
