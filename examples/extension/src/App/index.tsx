import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";
import { Menu } from "antd";
import { stateStore } from "../store/state";
import { StateTree } from "./StateTree";
import { rootStore } from "src/mst";

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
  const todos = [];
  rootStore.todos.forEach((value, key) => {
    todos.push(<div key={key}>{value.name + " " + value.done}</div>);
  });
  return (
    <>
      <div className={styles.state}>
        <div className={styles.left}>
          <Menu
            items={items}
            defaultSelectedKeys={[items[0]?.key as string]}
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
            onAddArrayItem={onAddArrayItem}
            onRemoveArrayItem={onRemoveArrayItem}
          ></StateTree>
        </div>
      </div>
      <div className={styles.mst}>{todos}</div>
    </>
  );
});

export const App = () => {
  return <State></State>;
};
