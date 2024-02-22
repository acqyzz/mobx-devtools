export interface DataNode {
  key: string | number;
  value: any;
  isSet: boolean;
  isMap: boolean;
  hasMore: boolean;
  editable: boolean;
  isArrayItem: boolean;
  isSetItem: boolean;
  isArray: boolean;
  children?: DataNode[];
}
