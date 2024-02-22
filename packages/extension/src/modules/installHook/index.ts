import { installHookLogger } from "utils/logger";
import installGlobalHook from "./installGlobalHook";
import { installStoreHook } from "./installStoreHook";

if (__IS_FIREFOX__ || __IS_ELECTRON__) {
  const script = document.createElement("script");
  script.textContent = `;(${installGlobalHook.toString()}(window))`;
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);

  const storeScript = document.createElement("script");
  storeScript.textContent = `;(${installGlobalHook.toString()}(window))`;
  document.documentElement.appendChild(storeScript);
  storeScript.parentNode.removeChild(storeScript);
} else {
  installGlobalHook(window);
  installStoreHook(window);
}

installHookLogger.debug`installGlobalHook inited`;
