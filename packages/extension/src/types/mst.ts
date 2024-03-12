import { IJsonPatch } from "mobx-state-tree";

export interface LogItem {
  patches: IJsonPatch[];
  snapshot: any;
  id: number;
  rootId: string;
  timestamp: number;
}

export type SummaryLogItem = Omit<LogItem, "snapshot">;
