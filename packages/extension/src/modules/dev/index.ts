import { devLogger } from "utils/logger";

chrome.devtools.panels.create(
  "Mobx",
  __IS_FIREFOX__ || __IS_EDGE__ ? "../logo.png" : "dist/logo.png",
  __IS_FIREFOX__ ? "../panel/index.html" : "dist/panel/index.html"
);

devLogger.debug`dev inited`;
