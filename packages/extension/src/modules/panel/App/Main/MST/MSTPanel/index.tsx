import React from "react";
import styles from "./index.module.less";
import { observer } from "mobx-react-lite";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { mstStore } from "panel/store/mst";
import classNames from "classnames";
import { NormalStateTree } from "components/NormalStateTree";
import { formatDayTime } from "utils/format";
import {
  PullRequestOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { PreviewValue } from "components/PreviewValue";

export const MSTPanel = observer(() => {
  const { logItems, activeLogItemId, currentSnapshot, currentPathes } =
    mstStore.currentStore;

  return (
    <div className={styles.mstPanel}>
      <div className={styles.left}>
        {/* TODO no logItems tips */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              itemSize={40}
              height={height}
              itemData={logItems}
              itemCount={logItems.length}
              width={width}
              itemKey={(index) => logItems[index].id}
            >
              {({ index, style, data }) => {
                const isInitial = index === 0;
                const label = isInitial
                  ? " Initial"
                  : `${data[index]?.patches.length} patches`;
                const isActive = activeLogItemId === data[index]?.id;
                return (
                  <div
                    style={style}
                    onClick={() => {
                      mstStore.selectLogItem(data[index]?.id);
                    }}
                    className={classNames(
                      styles.logItem,
                      isActive && styles.active
                    )}
                  >
                    <div className={styles.logWapper}>
                      <span>
                        {formatDayTime(data[index]?.timestamp)} | {label}
                      </span>
                      {
                        <div className={styles.operators}>
                          <Tooltip title="Only keep below logs">
                            <VerticalAlignBottomOutlined
                              className={styles.btnItem}
                              onClick={() => mstStore.keepBelowLogItems(index)}
                            />
                          </Tooltip>
                          <Tooltip title="Only keep upper logs">
                            <VerticalAlignTopOutlined
                              className={styles.btnItem}
                              onClick={() => mstStore.keepUpperLogItems(index)}
                            />
                          </Tooltip>
                          <Tooltip title="Time-travel here">
                            <PullRequestOutlined
                              className={styles.btnItem}
                              onClick={() =>
                                mstStore.timeTravelToLogItem(data[index]?.id)
                              }
                            />
                          </Tooltip>
                        </div>
                      }
                    </div>
                  </div>
                );
              }}
            </List>
          )}
        </AutoSizer>
      </div>
      <div className={styles.right}>
        <div className={styles.tree}>
          <NormalStateTree
            curState={currentSnapshot}
            editMode={false}
          ></NormalStateTree>
        </div>
        <div className={styles.patches}>
          {currentPathes.map((patch, index) => {
            const path = patch.path.replace(/^\//, "").replace(/\//g, ".");
            switch (patch.op) {
              case "remove":
                return (
                  <div key={index}>
                    {path} <span className={styles.removedLabel}>Removed</span>
                  </div>
                );
              default:
                return (
                  <div key={index}>
                    {path} = <PreviewValue data={patch.value} />
                  </div>
                );
            }
          })}
        </div>
      </div>
    </div>
  );
});
