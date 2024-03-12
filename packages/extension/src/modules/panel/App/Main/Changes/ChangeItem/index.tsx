import React, { memo } from "react";
import styles from "./index.module.less";
import { formatTime } from "utils/format";
import { Change } from "types/change";
import { Tag, Tooltip } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { NormalStateTree } from "components/NormalStateTree";

interface ChangeItemProps {
  change: Change;
  style?: React.CSSProperties;
}

export const ChangeItem = memo((props: ChangeItemProps) => {
  const { change, style } = props;
  return (
    <div className={styles.changeItem} style={{ ...style }}>
      {/* TODO op format time */}
      <span className={styles.timestamp}>{formatTime(change.timestamp)}</span>
      <Tag className={styles.labelTag} color="blue">
        {change.type}
      </Tag>
      {!!change.debugObjectName && (
        <Tag className={styles.name} color="green">
          {change.debugObjectName}
        </Tag>
      )}
      {!!change.name && (
        <Tag className={styles.name} color="#ff6b00">
          {change.name}
        </Tag>
      )}
      <Tooltip
        color="#fff"
        trigger="click"
        placement="right"
        overlayClassName={styles.tooltip}
        getPopupContainer={() => document.body}
        title={<NormalStateTree curState={change}></NormalStateTree>}
      >
        <span className={styles.detail}>
          detail
          <CaretRightOutlined />
        </span>
      </Tooltip>
    </div>
  );
});
