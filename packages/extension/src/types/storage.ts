import { PureSpyEvent } from "mobx/dist/internal";

export interface StorageData {
  changeFilterSetting: Record<PureSpyEvent["type"], boolean>;
}
