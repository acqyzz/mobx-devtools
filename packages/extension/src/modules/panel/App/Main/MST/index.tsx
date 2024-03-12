import React from "react";
import { observer } from "mobx-react-lite";
import { mstStore } from "panel/store/mst";
import { Tabs } from "antd";
import { EmptyMST } from "./EmptyMST";
import { MSTPanel } from "./MSTPanel";
import styles from "./index.module.less";

export const MST = observer(() => {
  const { currentStore, currentStoreKey, storeNames } = mstStore;
  if (!currentStore) {
    return <EmptyMST />;
  }
  const items = storeNames.map((name) => ({
    label: name,
    key: name,
    children: <MSTPanel />,
  }));
  return (
    <div className={styles.mst}>
      {/* TODO header */}
      <div className={styles.header}>header</div>
      {/* TODO switch store */}
      <Tabs activeKey={currentStoreKey} size="small" items={items} />
    </div>
  );
});
