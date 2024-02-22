import React from "react";
import { configure } from "mobx";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/index.less";
import "@styles/index.less";
import "./bridge/controller";
import { panelLogger } from "utils/logger";

export const createApp = (() => {
  const rootDom = document.getElementById("root");
  let root;
  return () => {
    if (root) {
      root.unmount();
    }
    root = createRoot(rootDom);
    root.render(<App></App>);
  };
})();

configure({
  enforceActions: "never",
});

const injectFrontend = () => {
  panelLogger.debug`injectFrontend begin`;
  const code = `
      (function() {
        var inject = function() {
          // the prototype stuff is in case document.createElement has been modified
          var script = document.constructor.prototype.createElement.call(document, 'script');
          script.src = "${chrome.runtime.getURL("dist/frontend/index.js")}";
          document.documentElement.appendChild(script);
          script.parentNode.removeChild(script);
        }
        if (!document.documentElement) {
          document.addEventListener('DOMContentLoaded', inject);
        } else {
          inject();
        }
      }());
    `;
  chrome.devtools.inspectedWindow.eval(code, async (res, err) => {
    if (err) {
      panelLogger.error`injectFrontend error: ${err}`;
      return;
    }
    panelLogger.debug`injectFrontend success`;
  });
};

injectFrontend();

chrome.devtools.network.onNavigated.addListener(() => {
  panelLogger.debug`on network onNavigated`;
  injectFrontend();
});
