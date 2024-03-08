import { toJS } from "mobx";
import React from "react";
import { messageStore2, messageStore } from "./store/message";
import { productStore } from "./store/product";
import { userStore } from "./store/user";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./mst";

console.log("app running");
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
