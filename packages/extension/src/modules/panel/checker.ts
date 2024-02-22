import { panelLogger } from "utils/logger";

export interface CheckerStatus {
  reportStatus: Status;
  stateStatus: Status;
}
type Listener = (params: CheckerStatus) => void;
type Status = "active" | "nagetive";
export let reportStatus: Status = "nagetive";
export let stateStatus: Status = "nagetive";
let isStarted = false;
const listeners: Listener[] = [];
let interval: number;

export const beginCheckMobxInDebug = async () => {
  if (isStarted) {
    return;
  }
  isStarted = true;
  await check();
  panelLogger.debug`checkerStatus inited: reportStatus: ${reportStatus}, stateStatus: ${stateStatus}`;
  // interval = setInterval(() => {
  //   check();
  // }, 1000);
};

const check = async () => {
  const [newReportStatus, newStateStatus] = await Promise.all([
    checkReportStatus(),
    checkStateTreeStatus(),
  ]);
  if (newReportStatus !== reportStatus || newStateStatus !== stateStatus) {
    listeners.forEach((fn) => {
      fn.call(null, {
        reportStatus: newReportStatus,
        stateStatus: newStateStatus,
      });
    });
    panelLogger.debug`checkerStatus updated: reportStatus: ${newReportStatus}, stateStatus: ${newStateStatus}`;
    reportStatus = newReportStatus;
    stateStatus = newStateStatus;
  }
  if (reportStatus === "active" && stateStatus === "active") {
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

const checkStateTreeStatus = () => {
  return new Promise<Status>((res, rej) => {
    chrome.devtools.inspectedWindow.eval(
      "window.__MOBX_DEVTOOL_STORES__ && !!(Object.keys(window.__MOBX_DEVTOOL_STORES__).length)",
      (isStateActive) => {
        res(isStateActive ? "active" : "nagetive");
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
    stateStatus,
  };
};

chrome.devtools.network.onNavigated.addListener(() => {
  panelLogger.debug`on network onNavigated`;
  reportStatus = "nagetive";
  stateStatus = "nagetive";
  check();
});
