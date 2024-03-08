import { toJS } from "mobx";
import React from "react";
import { messageStore, messageStore2 } from "./store/message";
import { productStore } from "./store/product";
import { userStore } from "./store/user";
import { createRoot } from "react-dom/client";
import { App } from "./App";

console.log(
  toJS({
    messageStore,
    productStore,
    userStore,
    messageStore2,
  })
);

const root = createRoot(document.getElementById("root"));
root.render(<App></App>);
