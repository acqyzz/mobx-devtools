import { PureSpyEvent } from "mobx/dist/internal";

export type Change = PureSpyEvent & {
  debugObjectName?: string;
  id: number;
  name?: string;
  timestamp: number;
  children: Change[];
  spyReportStart?: boolean;
  spyReportEnd?: boolean;
  time?: number;
  targetName?: string;
  objectName?: string;
  object?: unknown;
  target?: unknown;
  type: PureSpyEvent["type"] | "compute";
};
