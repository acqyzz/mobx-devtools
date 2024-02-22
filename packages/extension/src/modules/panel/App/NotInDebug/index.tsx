import React from "react";
import styles from "./index.module.less";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export const NotInDebug = () => {
  return (
    <div className={styles.notInDebug}>
      <ExclamationCircleOutlined className={styles.icon} />
      Not in Debug, please check
      <br />
      - mobx running in development mode.
      <br />- install mobx-devtool and it's debug tools
    </div>
  );
};
