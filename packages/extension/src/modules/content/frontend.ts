import { frontendLogger } from "utils/logger";
import { initBridge, frontendSender } from "./bridge";
import "./bridge/controller";
import { LIFE_CYCLE } from "types/message/lifecycle";
import { registerMobxListener, syncMobxStores } from "./mobxContext";

initBridge();
registerMobxListener();

syncMobxStores();

frontendSender(LIFE_CYCLE.FRONTEND_READY, {
  to: "panel",
});

frontendLogger.debug`frontend inited`;
