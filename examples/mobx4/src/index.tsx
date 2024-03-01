import { toJS } from "mobx";
import React from "react";
import { message$, message2$ } from "./store/message";
import { product$ } from "./store/product";
import { user$ } from "./store/user";
import { createRoot } from "react-dom/client";
import { App } from "./App";

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
