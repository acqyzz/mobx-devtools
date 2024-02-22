import { observer } from "mobx-react-lite";
import { changesStore } from "panel/store/changes";
import React from "react";
import styles from "./index.module.less";
import {
  FilterOutlined,
  PauseCircleOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Checkbox, Popover, Tooltip } from "antd";
import { PureSpyEvent } from "mobx/dist/internal";

export const ChangeSetting = observer(() => {
  const {
    clear,
    updateTypeFilter,
    typeFilter,
    isRecording,
    switchIsRecording,
  } = changesStore;
  const typeKeys = Object.keys(typeFilter) as PureSpyEvent["type"][];
  return (
    <div className={styles.changeSetting}>
      <div
        className={`${styles.switchRecordingIcon} ${styles.btnItem} ${
          isRecording ? styles.active : ""
        }`}
        onClick={switchIsRecording}
      >
        <Tooltip title={isRecording ? "Recording" : "Paused"}>
          {isRecording ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        </Tooltip>
      </div>
      <Tooltip title="clear all changes">
        <StopOutlined className={styles.btnItem} onClick={clear} />
      </Tooltip>
      <Popover
        trigger="click"
        className={styles.btnItem}
        content={
          <div className={styles.filter}>
            {typeKeys.map((type) => (
              <div key={type} className={styles.typeFilterItem}>
                <Checkbox
                  title={type}
                  checked={typeFilter[type]}
                  onClick={() => {
                    updateTypeFilter({
                      type,
                      value: !typeFilter[type],
                    });
                  }}
                >
                  {type}
                </Checkbox>
              </div>
            ))}
          </div>
        }
      >
        <FilterOutlined />
      </Popover>
    </div>
  );
});
