import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { State } from "./State";
import styles from "./index.module.less";
import { Changes } from "./Changes";
import { ACTIVE_KEY, appStore } from "panel/store/app";
import { observer } from "mobx-react-lite";
import { MST } from "./MST";
import { mstStore } from "panel/store/mst";

export const Main = observer(() => {
  const { debugStatus, curActiveKey, updateActiveKey } = appStore;
  const { currentStore } = mstStore;

  const items: TabsProps["items"] = [
    {
      label: "State Tree",
      children: <State />,
      key: ACTIVE_KEY.STATE_TREE,
    },
    currentStore && {
      label: "MST",
      children: <MST />,
      key: ACTIVE_KEY.MST,
    },
    {
      label: "Changes",
      children: <Changes />,
      key: ACTIVE_KEY.CHANGES,
      disabled: !debugStatus.reportStatus,
    },
  ].filter(Boolean);

  return (
    <Tabs
      activeKey={curActiveKey}
      className={styles.tabs}
      items={items}
      onChange={(key: ACTIVE_KEY) => {
        updateActiveKey(key);
      }}
    ></Tabs>
  );
});
