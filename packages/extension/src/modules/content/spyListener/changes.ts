import { Change } from "types/change";
import { createChangeProcessor } from "./changesProcessor";
import { ASYNC_MESSAGE } from "types/message/message";
import { frontendSender } from "../bridge";
import { toJSON } from "utils/format";
import { MAX_CHANGES_LENGTH } from "src/options";

const changes: Change[] = [];

// const summary = (change) => {
//   const sum = Object.create(null);
//   sum.summary = true;
//   sum.id = change.id;
//   sum.type = change.type;
//   sum.name = change.name;
//   sum.objectName = change.objectName;
//   sum.oldValue = change.oldValue;
//   sum.newValue = change.newValue;
//   sum.hasChildren = change.children.length > 0;
//   sum.timestamp = change.timestamp;
//   sum.addedCount = change.addedCount;
//   sum.removedCount = change.removedCount;
//   sum.object = change.object;
//   return sum;
// };

let isScheduled = false;

const handleSyncChanges = () => {
  if (isScheduled) {
    return;
  }
  isScheduled = true;
  requestIdleCallback(
    () => {
      try {
        frontendSender(ASYNC_MESSAGE.REPORT_CHANGES, {
          to: "panel",
          request: changes.slice(-MAX_CHANGES_LENGTH).map((change) => {
            return toJSON(change) as Change;
          }),
        });
        changes.length = 0;
      } finally {
        isScheduled = false;
      }
    },
    {
      timeout: 1000,
    }
  );
};

const changesProcessor = createChangeProcessor((change) => {
  handleSyncChanges();
  // changes.push(summary(change));
  changes.push(change);
});

export const createChangesListener = (mobx) => {
  mobx.spy((change) => {
    changesProcessor.push(change, mobx);
  });
};
