import { installHookLogger } from "utils/logger";
import installGlobalHook from "./installGlobalHook";

if (__IS_FIREFOX__ || __IS_ELECTRON__) {
  const script = document.createElement("script");
  script.textContent = `;(${installGlobalHook.toString()}(window))`;
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
} else {
  installGlobalHook(window);
}

installHookLogger.debug`installGlobalHook inited`;
