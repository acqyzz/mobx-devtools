import React from "react";
import styles from "./index.module.less";
import { FrownOutlined } from "@ant-design/icons";

export const EmptyMST = () => {
  // TODO empty panel style
  return (
    <div className={styles.emptyMST}>
      <FrownOutlined className={styles.emptyIcon} />
      <span>
        no mst here, please make sure your mst have registered already
      </span>
      {/* TODO document link */}
      <a></a>
    </div>
  );
};
