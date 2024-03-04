import { toJS } from "mobx";
import React from "react";
import { message2$, message$ } from "./store/message";
import { product$ } from "./store/product";
import { user$ } from "./store/user";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./mst";

console.log("app running");
console.log(
  toJS({
    message$,
    product$,
    user$,
    message2$,
  })
);

const root = createRoot(document.getElementById("root"));
root.render(<App></App>);
