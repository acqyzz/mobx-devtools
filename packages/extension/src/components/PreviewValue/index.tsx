import React from "react";
import classNames from "classnames";
import styles from "./index.module.less";
import { symbols } from "utils/serialization";

interface IProps {
  data: any;
}

export const PreviewValue = (props: IProps) => {
  if (
    !props.data ||
    props.data instanceof Date ||
    typeof props.data !== "object"
  ) {
    return <PreviewSimpleValue data={props.data} />;
  }
  return <PreviewComplexValue data={props.data} />;
};

const PreviewSimpleValue = (props) => {
  let { data } = props;

  if (typeof data === "string" && data.length > 200) {
    data = `${data.slice(0, 200)}…`;
  }

  return (
    <div
      className={classNames(
        styles.simple,
        typeof data === "string" && styles.simpleString,
        typeof data === "undefined" && styles.simpleUndefined
      )}
    >
      {valueToText(data)}
    </div>
  );
};

const PreviewComplexValue = (props) => {
  const { data } = props;
  const mobxObject = data[symbols.mobxObject];
  if (Array.isArray(data)) {
    return (
      <span className={styles.previewComplex}>
        {props.displayName || "Array"}[{data.length}]
      </span>
    );
  }
  switch (data[symbols.type]) {
    case "serializationError":
      return <span className={styles.previewError}>SerializerError</span>;

    case "deptreeNode":
      return (
        <span className={styles.previewDeptreeNode}>{data[symbols.name]}</span>
      );

    case "function":
      return (
        <span
          className={(styles.previewComplex, mobxObject && styles.mobxObject)}
        >
          {props.displayName || data[symbols.name] || "fn"}
          ()
        </span>
      );
    case "object":
    case "map":
    case "set":
      return (
        <span
          className={(styles.previewComplex, mobxObject && styles.mobxObject)}
        >
          {`${props.displayName || data[symbols.name]}{…}`}
        </span>
      );
    case "date":
      return (
        <span className={styles.previewComplex}>
          {props.displayName || data[symbols.name]}
        </span>
      );
    case "symbol":
      return (
        <span className={styles.previewComplex}>
          {props.displayName || data[symbols.name]}
        </span>
      );
    case "iterator":
      return (
        <span className={styles.previewComplex}>
          {`${props.displayName || data[symbols.name]}(…)`}
        </span>
      );

    case "array_buffer":
    case "data_view":
    case "array":
    case "typed_array":
      return (
        <span
          className={(styles.previewComplex, mobxObject && styles.mobxObject)}
        >
          {`${props.displayName || data[symbols.name]}[${
            data[symbols.meta].length
          }]`}
        </span>
      );

    case undefined:
    case null:
      return (
        <span className={styles.previewComplex}>
          {props.displayName || "{…}"}
        </span>
      );
    default:
      return null;
  }
};

function valueToText(value) {
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toString();
  }
  return JSON.stringify(value);
}
