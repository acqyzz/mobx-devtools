import { MESSAGE } from "types/message";
import { proxyLogger } from "utils/logger";
import { judgeIsMobxDevtoolMessage } from "utils/message";

proxyLogger.debug`proxy inited`;
let port: chrome.runtime.Port = null;

const initProxy = () => {
  port = chrome.runtime.connect({
    name: "proxy",
  });
  const unregisterBgHandler = proxyBackgroundMsgToFrontend(port);
  const unregisterFeHandler = proxyFrontendMsgToBackground(port);
  port.onDisconnect.addListener(() => {
    proxyLogger.debug`proxy disconnected, reconnect port`;
    unregisterBgHandler();
    unregisterFeHandler();
    port = null;
    initProxy();
  });
};

const proxyBackgroundMsgToFrontend = (port: chrome.runtime.Port) => {
  const msgHandler = (msg: MESSAGE) => {
    if (msg.to === "frontend") {
      proxyLogger.debug`proxy message ${msg.type} from ${msg.from} to ${msg.to}`;
      window.postMessage(msg, "*");
    }
  };
  port.onMessage.addListener(msgHandler);

  return () => {
    port.onMessage.removeListener(msgHandler);
  };
};

const proxyFrontendMsgToBackground = (port: chrome.runtime.Port) => {
  const msgHandler = (event: MessageEvent<MESSAGE>) => {
    if (
      event.source !== window ||
      !event.data ||
      !judgeIsMobxDevtoolMessage(event.data)
    ) {
      return;
    }
    const { data: msg } = event;
    if (msg.to !== "proxy") {
      proxyLogger.debug`proxy message ${msg.type} from ${msg.from} to ${msg.to}`;
      port.postMessage(msg);
    }
  };
  window.addEventListener("message", msgHandler);

  return () => {
    window.removeEventListener("message", msgHandler);
  };
};

initProxy();

proxyLogger.debug`proxy inited`;
