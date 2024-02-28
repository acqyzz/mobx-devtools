import React, { memo } from "react";
import { changesStore } from "panel/store/changes";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";
import { ChangeSetting } from "./ChangeSetting";
import { ChangeItem } from "./ChangeItem";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const RenderItem = memo(({ index, style, data }: any) => {
  return <ChangeItem style={style} change={data[index]}></ChangeItem>;
});

export const Changes = observer(() => {
  const { filteredChange } = changesStore;
  return (
    <div className={styles.changes}>
      <ChangeSetting />
      <div className={styles.changeList}>
        {!!filteredChange.length ? (
          <AutoSizer>
            {({ height, width }) => (
              <List
                itemSize={56}
                height={height}
                itemData={filteredChange}
                itemCount={filteredChange.length}
                width={width}
                itemKey={(index) => filteredChange[index].id}
              >
                {RenderItem}
              </List>
            )}
          </AutoSizer>
        ) : (
          <div className={styles.empty}>
            <ExclamationCircleOutlined className={styles.emptyIcon} />
            <span>No changes here</span>
          </div>
        )}
      </div>
    </div>
  );
});
