import React from "react";
import { observer } from "mobx-react-lite";
import { mstStore } from "panel/store/mst";
import { Tabs, Tooltip } from "antd";
import { EmptyMST } from "./EmptyMST";
import { MSTPanel } from "./MSTPanel";
import styles from "./index.module.less";
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

export const MST = observer(() => {
  const {
    currentStore,
    currentStoreKey,
    storeNames,
    isRecording,
    switchIsRecording,
    clearCurrentLogItem,
  } = mstStore;
  if (!currentStore || !currentStoreKey) {
    return <EmptyMST />;
  }
  const items = storeNames.map((name) => ({
    label: name,
    key: name,
    children: <MSTPanel />,
  }));
  return (
    <div className={styles.mst}>
      <div className={styles.header}>
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
          <StopOutlined
            className={styles.btnItem}
            onClick={clearCurrentLogItem}
          />
        </Tooltip>
      </div>
      <Tabs
        activeKey={currentStoreKey}
        size="small"
        items={items}
        onChange={(key) => {
          mstStore.changeStoreKey(key);
        }}
      />
    </div>
  );
});
