import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { State } from "./State";
import styles from "./index.module.less";
import { Changes } from "./Changes";
import { ACTIVE_KEY, appStore } from "panel/store/app";
import { observer } from "mobx-react-lite";

export const Main = observer(() => {
  const { isStateTreeDisabled, debugStatus, curActiveKey, updateActiveKey } =
    appStore;

  const items: TabsProps["items"] = [
    {
      label: "State Tree",
      children: <State />,
      key: ACTIVE_KEY.STATE_TREE,
      disabled: isStateTreeDisabled,
    },
    {
      label: "Changes",
      children: <Changes />,
      key: ACTIVE_KEY.CHANGES,
      disabled: !debugStatus.reportStatus,
    },
  ];

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
