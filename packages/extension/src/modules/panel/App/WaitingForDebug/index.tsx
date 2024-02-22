import React from "react";
import styles from "./index.module.less";
import { LoadingOutlined } from "@ant-design/icons";

export const WaitingForDebug = () => {
  return (
    <div className={styles.waitingForDebug}>
      <LoadingOutlined className={styles.loading} />
      Waiting for debug...
    </div>
  );
};
