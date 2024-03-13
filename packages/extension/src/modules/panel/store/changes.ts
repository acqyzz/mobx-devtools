import { makeAutoObservable, toJS } from "mobx";
import type { PureSpyEvent } from "mobx/dist/internal";
import { panelSender } from "panel/bridge";
import { MAX_CHANGES_LENGTH } from "src/options";
import { Change } from "types/change";
import { RequestMessage } from "types/message";
import { ASYNC_MESSAGE } from "types/message/message";
import { panelLogger } from "utils/logger";

class ChangesStore {
  constructor() {
    makeAutoObservable(this);
    chrome.devtools.network.onNavigated.addListener(() => {
      this.clear();
    });
    this.initTypeFilter();
  }

  isRecording = true;

  get filteredChange() {
    return this.changes.filter((change) => this.typeFilter[change.type]);
  }

  typeFilter = {
    action: true,
    add: true,
    splice: true,
    "scheduled-reaction": true,
    reaction: true,
    error: true,
    update: true,
    remove: true,
    delete: true,
    create: true,
    "report-end": true,
  } as Record<PureSpyEvent["type"], boolean>;
  changes: Change[] = [];

  onReportChanges = (msg: RequestMessage<ASYNC_MESSAGE.REPORT_CHANGES>) => {
    if (!this.isRecording) {
      return;
    }
    const data = msg.request;
    this.addChange(data);
  };
  initTypeFilter = async () => {
    const msg = await panelSender(ASYNC_MESSAGE.GET_LOCAL_DATA, {
      to: "background",
    });
    const data = msg.response;
    if (!data) {
      panelLogger.warn`get empty local data`;
      return;
    }
    this.typeFilter = data.changeFilterSetting;
  };
  addChange = (changes: Change[]) => {
    const newChanges = changes;
    const result = [...this.changes, ...newChanges];
    if (result.length > MAX_CHANGES_LENGTH) {
      result.splice(0, Math.ceil(MAX_CHANGES_LENGTH / 2));
    }
    this.changes = result;
  };
  switchIsRecording = () => {
    this.isRecording = !this.isRecording;
  };
  clear = () => {
    this.changes = [];
  };
  updateTypeFilter = (data: { type: PureSpyEvent["type"]; value: boolean }) => {
    this.typeFilter[data.type] = data.value;
    panelSender(ASYNC_MESSAGE.PUT_LOCAL_DATA, {
      to: "background",
      request: {
        key: "changeFilterSetting",
        value: toJS(this.typeFilter),
      },
    });
  };
}

export const changesStore = new ChangesStore();
