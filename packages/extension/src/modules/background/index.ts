import { MESSAGE } from "types/message";
import { LIFE_CYCLE } from "types/message/lifecycle";
import { bgLogger } from "utils/logger";
import { initStorage, syncDataWithPort } from "./storage";

const devtoolConnections: Record<number, chrome.runtime.Port> = {};
const proxyConnections: Record<number, chrome.runtime.Port> = {};

initStorage();

const findTabIdByPort = (port) => {
  const tabs = Object.keys(devtoolConnections);
  for (let i = 0, len = tabs.length; i < len; i++) {
    if (devtoolConnections[tabs[i]] == port) {
      return +tabs[i];
    }
  }
  const proxyTabs = Object.keys(proxyConnections);
  for (let i = 0, len = proxyTabs.length; i < len; i++) {
    if (devtoolConnections[proxyTabs[i]] == port) {
      return +proxyTabs[i];
    }
  }
  return null;
};

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== "proxy") {
    return;
  }
  const { sender } = port;
  const tabId = sender.tab.id;
  proxyConnections[tabId] = port;
  const handler = (msg: MESSAGE) => {
    bgLogger.debug`receiver message ${msg.type} from ${msg.from} to ${msg.to} tabId ${tabId}`;
    if (tabId in devtoolConnections && msg.to === "panel") {
      devtoolConnections[tabId].postMessage(msg);
    }
  };
  port.onMessage.addListener(handler);
  bgLogger.debug`registry proxy ${tabId}`;
  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(handler);
    const tabs = Object.keys(proxyConnections);
    for (let i = 0, len = tabs.length; i < len; i++) {
      if (proxyConnections[tabs[i]] == port) {
        bgLogger.debug`unregistry proxy ${tabs[i]}`;
        delete proxyConnections[tabs[i]];
        break;
      }
    }
  });
  syncDataWithPort(port, "frontend");
});

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== "devtools-page") {
    return;
  }
  bgLogger.debug`service_worker on connect ${port.name}`;
  function handler(message: MESSAGE) {
    bgLogger.debug`receiver message from port ${port.name}, message ${message}`;
    const tabId = findTabIdByPort(port);
    bgLogger.debug`find tabId ${tabId}`;
    if (
      message.to === "proxy" ||
      (message.to === "frontend" && proxyConnections[tabId])
    ) {
      proxyConnections[tabId].postMessage(message);
      bgLogger.debug`proxy message from port ${port.name} to tab ${tabId}, message ${message}`;
      return;
    }
    if (message.type === LIFE_CYCLE.REGISTER_DEVTOOL) {
      bgLogger.debug`registry devtool ${message.request.tabId}`;
      devtoolConnections[message.request.tabId] = port;
      return;
    }
  }
  port.onMessage.addListener(handler);
  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(handler);
    const tabs = Object.keys(devtoolConnections);
    for (let i = 0, len = tabs.length; i < len; i++) {
      if (devtoolConnections[tabs[i]] == port) {
        bgLogger.debug`unregistry devtool ${tabs[i]}`;
        delete devtoolConnections[tabs[i]];
        break;
      }
    }
  });
  syncDataWithPort(port, "panel");
});

bgLogger.debug`service_worker inited`;
