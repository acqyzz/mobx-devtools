import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Input, Tree } from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";
import { set, toJS } from "mobx";

type Node = DataNode & {
  type: "dataNode" | "moreNode";
  data: any;
  label: string;
  path: string[];
  isArrayItem: boolean;
};

const judgeIsLeaf = (state: any) => {
  if (
    ["boolean", "number", "string", "symbol", "undefined"].includes(
      typeof state
    )
  ) {
    return true;
  }
  if (state === null) {
    return true;
  }
  return false;
};

const state2TreeData = (
  originState: object,
  prevKey = "",
  path: string[] = [],
  maxShowLength = 20
): Node[] => {
  if (!originState) {
    return [];
  }
  let state = originState;
  if (state instanceof Set) {
    state = Array.from(state);
  }
  if (state instanceof Map) {
    const obj = {};
    state.forEach((value, key) => {
      obj[key] = value;
    });
    state = obj;
  }
  const isArrayNode = Array.isArray(state);
  let keys = Object.keys(state).filter(key => typeof state[key] !== 'function');
  if (isArrayNode) {
    keys = keys.slice(0, maxShowLength);
  }
  const list: Node[] = keys.map((key) => {
    const isLeaf = judgeIsLeaf(state[key]);
    const nodeKey = `${prevKey}_${key}`;
    const curPath = [...path, key];
    return {
      type: "dataNode",
      title: `${key}${isLeaf ? `: ${state[key]}` : ""}`,
      key: nodeKey,
      children: isLeaf
        ? []
        : state2TreeData(state[key], nodeKey, curPath, maxShowLength),
      isLeaf: judgeIsLeaf(state[key]),
      data: state[key],
      label: key,
      path: curPath,
      isArrayItem: isArrayNode,
    };
  });
  const hasMore = isArrayNode && (state as Array<any>).length > maxShowLength;
  if (hasMore) {
    list.push({
      key: `${prevKey}_more`,
      type: "moreNode",
      data: "",
      label: "",
      path,
      isArrayItem: true,
    });
  }
  return list;
};

interface StateTreeProps {
  curState: object;
  updateState?: (data: { value: any; path: string[] }) => void;
  onEditConfirm?: (data: { value: any; path: string[] }) => void;
  onRemoveArrayItem?: (path: string[]) => void;
  onAddArrayItem?: (data: { value: any; path: string[] }) => void;
  editMode?: boolean;
}

export const NormalStateTree = (props: StateTreeProps) => {
  const { editMode, curState, updateState, onRemoveArrayItem, onAddArrayItem } =
    props;
  const [arrShowLength, setArrShowLength] = useState(20);
  const curStateJS = toJS(curState);
  const treeData = state2TreeData(curStateJS, "", [], arrShowLength);

  const onAddArrayShowLength = useCallback(() => {
    setArrShowLength((prev) => prev + 20);
  }, []);

  useEffect(() => {
    setArrShowLength(20);
  }, [curState]);

  return (
    <div className={styles.stateTree}>
      <Tree
        treeData={treeData}
        titleRender={(node) => (
          <TreeNode
            node={{ ...node, data: node.data }}
            editMode={editMode}
            onEditConfirm={updateState}
            onRemoveArrayItem={onRemoveArrayItem}
            onAddArrayItem={onAddArrayItem}
            onAddArrayShowLength={onAddArrayShowLength}
          ></TreeNode>
        )}
      ></Tree>
    </div>
  );
};

const useClickOutside = (ref: React.RefObject<HTMLElement>, cb: () => void) => {
  const listened = useRef(false);
  const listen = () => {
    if (listened.current) {
      return;
    }
    listened.current = true;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        cb();
      }
      listened.current = false;
      document.removeEventListener("click", handleClick);
    };
    setTimeout(() => {
      document.addEventListener("click", handleClick);
    });
  };
  return {
    listen,
  };
};

const TreeNode = memo(
  (props: {
    node: Node;
    editMode?: boolean;
    onEditConfirm?: (val: any) => void;
    onRemoveArrayItem?: (path: string[]) => void;
    onAddArrayItem?: (data: { path: string[]; value: any }) => void;
    onAddArrayShowLength: () => void;
  }) => {
    const {
      node,
      editMode,
      onEditConfirm,
      onRemoveArrayItem,
      onAddArrayItem,
      onAddArrayShowLength,
    } = props;
    const [isEdit, setIsEdit] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const containerRef = useRef<HTMLDivElement>();
    const isArray = Array.isArray(node.data);
    const parseValue = (val: string) => {
      if (typeof node.data === "number" && !Number.isNaN(+val)) {
        return +val;
      }
      if (val === "undefined") {
        return undefined;
      }
      return JSON.parse(val);
    };
    const onEditEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      setIsEdit(false);
      const val = e.currentTarget.value;
      onEditConfirm?.({
        value: parseValue(val),
        path: node.path,
      });
    };
    const onAddEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      setIsAdd(false);
      const val = e.currentTarget.value;
      onAddArrayItem?.({
        value: parseValue(val),
        path: isArray
          ? [...node.path, "0"]
          : [...node.path.slice(0, -1), `${+node.label + 1}`],
      });
    };
    const { listen } = useClickOutside(containerRef, () => {
      setIsEdit(false);
      setIsAdd(false);
    });
    if (node.type === "moreNode") {
      return <div onClick={onAddArrayShowLength}>more......</div>;
    }

    return (
      <div
        className={styles.node}
        ref={containerRef}
        onDoubleClick={() => {
          if (!editMode) {
            return;
          }
          setIsEdit(true);
          listen();
        }}
      >
        {isEdit ? (
          <div className={styles.editNode}>
            <span className={styles.editNodeLabel}>{node.label}</span>
            <Input
              defaultValue={JSON.stringify(node.data)}
              className={styles.nodeInput}
              onPressEnter={onEditEnter}
            />
          </div>
        ) : (
          <>
            <div className={styles.previewNode}>
              <span className={styles.previewLabel}>
                {node.title as string}
              </span>
              {(node.isArrayItem || isArray) && editMode && (
                <PlusCircleOutlined
                  className={styles.addIcon}
                  onClick={() => {
                    setIsEdit(false);
                    setIsAdd(true);
                    listen();
                  }}
                />
              )}
              {editMode && (
                <EditOutlined
                  className={styles.editIcon}
                  onClick={() => {
                    setIsEdit(true);
                    setIsAdd(false);
                    listen();
                  }}
                />
              )}
              {editMode && node.isArrayItem && (
                <CloseCircleOutlined
                  className={styles.deleteIcon}
                  onClick={() => onRemoveArrayItem?.(node.path)}
                />
              )}
            </div>
            {editMode && isAdd && (
              <div>
                <Input
                  placeholder="please input value of next array item"
                  onPressEnter={onAddEnter}
                ></Input>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);
