import { createChangesListener } from "./changes";
import { createStoresListener } from "./stores";

export const registerSpyListener = (mobx) => {
  createChangesListener(mobx);
  createStoresListener(mobx);
};
