import React from "react";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";
import { Menu } from "antd";
import { stateStore } from "panel/store/state";
import { StateTree } from "./StateTree";
import { FrownOutlined } from "@ant-design/icons";

type Items = React.ComponentProps<typeof Menu>["items"];

export const State = observer(() => {
  const {
    stateItems = [],
    curState,
    currentStateName,
    onCloseLeaf,
    onGetLeaf,
    updateState,
    onRemoveArrayItem,
    updateCurrentState,
    onAddArrayItem,
  } = stateStore;
  return (
    <div className={styles.state}>
      {!!stateItems.length ? (
        <>
          <div className={styles.left}>
            <Menu
              items={stateItems}
              defaultSelectedKeys={[stateItems[0].key as string]}
              onClick={(cur) => {
                updateCurrentState(cur.key);
              }}
            ></Menu>
          </div>
          <div className={styles.right}>
            <StateTree
              curState={curState}
              editMode
              onExpand={(e, info) => {
                if (!currentStateName) {
                  return;
                }
                if (info.expanded) {
                  onGetLeaf(currentStateName, info.node.path);
                } else {
                  onCloseLeaf(currentStateName, info.node.path);
                }
              }}
              onEditConfirm={updateState}
              updateState={updateState}
              onAddArrayItem={onAddArrayItem}
              onRemoveArrayItem={onRemoveArrayItem}
            ></StateTree>
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <FrownOutlined className={styles.emptyIcon} />
          <span>No active store</span>
          <span>Please check if you have registered the store correctly.</span>
          {/* TODO document link */}
        </div>
      )}
    </div>
  );
});
