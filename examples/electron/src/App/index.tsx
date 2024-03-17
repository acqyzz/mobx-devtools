import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";
import { Menu } from "antd";
import { stateStore } from "../store/state";
import { StateTree } from "./StateTree";

type Items = React.ComponentProps<typeof Menu>["items"];

export const State = observer(() => {
  const {
    stateNames = [],
    curState,
    updateState,
    onRemoveArrayItem,
    updateCurrentState,
    onAddArrayItem,
  } = stateStore;
  const items: Items = stateNames.map((name) => ({
    key: name,
    label: name,
  }));
  return (
    <div className={styles.state}>
      <div className={styles.left}>
        <Menu
          items={items}
          defaultSelectedKeys={[items[0].key as string]}
          onClick={(cur) => {
            updateCurrentState(cur.key);
          }}
        ></Menu>
      </div>
      <div className={styles.right}>
        <StateTree
          curState={curState}
          editMode
          onEditConfirm={updateState}
          updateState={updateState}
          onRemoveArrayItem={onRemoveArrayItem}
          onAddArrayItem={onAddArrayItem}
        ></StateTree>
      </div>
    </div>
  );
});

export const App = () => {
  return <State></State>;
};
