import React from "react";
import styles from "./index.module.less";
import { observer } from "mobx-react-lite";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { mstStore } from "panel/store/mst";
import classNames from "classnames";
import { NormalStateTree } from "components/NormalStateTree";

export const MSTPanel = observer(() => {
  const { logItems, activeLogItemId, currentSnapshot } = mstStore.currentStore;

  return (
    <div className={styles.mstPanel}>
      <div className={styles.left}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              itemSize={36}
              height={height}
              itemData={logItems}
              itemCount={logItems.length}
              width={width}
              itemKey={(index) => logItems[index].id}
            >
              {({ index, style, data }) => {
                const label =
                  index === 0
                    ? "Initial"
                    : `${data[index]?.patches.length} patches`;
                const isActive = activeLogItemId === data[index]?.id;
                return (
                  <div
                    style={style}
                    onClick={() => {
                      mstStore.activateLogItem(data[index]?.id);
                    }}
                    className={classNames(
                      styles.logItem,
                      isActive && styles.active
                    )}
                  >
                    <div className={styles.logTitle}>{label}</div>
                  </div>
                );
              }}
            </List>
          )}
        </AutoSizer>
      </div>
      <div className={styles.right}>
        <NormalStateTree
          curState={currentSnapshot}
          editMode={false}
        ></NormalStateTree>
      </div>
    </div>
  );
});
