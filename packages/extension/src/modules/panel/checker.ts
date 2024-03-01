import { panelLogger } from "utils/logger";

export interface CheckerStatus {
  reportStatus: Status;
}
type Listener = (params: CheckerStatus) => void;
type Status = "active" | "nagetive";
export let reportStatus: Status = "nagetive";
let isStarted = false;
const listeners: Listener[] = [];
let interval: number;

export const beginCheckMobxInDebug = async () => {
  if (isStarted) {
    return;
  }
  isStarted = true;
  await check();
  panelLogger.debug`checkerStatus inited: reportStatus: ${reportStatus}`;
};

const check = async () => {
  const [newReportStatus] = await Promise.all([checkReportStatus()]);
  if (newReportStatus !== reportStatus) {
    listeners.forEach((fn) => {
      fn.call(null, {
        reportStatus: newReportStatus,
      });
    });
    panelLogger.debug`checkerStatus updated: reportStatus: ${newReportStatus}`;
    reportStatus = newReportStatus;
  }
  if (reportStatus === "active") {
    clearInterval(interval);
  }
};

const checkReportStatus = () => {
  return new Promise<Status>((res) => {
    chrome.devtools.inspectedWindow.eval(
      "window.__MOBX_DEVTOOLS_GLOBAL_HOOK__ && window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.collections && !!(Object.keys(window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.collections).length)",
      (isReportActive) => {
        res(isReportActive ? "active" : "nagetive");
      }
    );
  });
};

export const onDebugStatusChange = (fn: Listener) => {
  listeners.push(fn);
};

export const getCheckerStatus = () => {
  return {
    reportStatus,
  };
};

chrome.devtools.network.onNavigated.addListener(() => {
  panelLogger.debug`on network onNavigated`;
  reportStatus = "nagetive";
  check();
});
