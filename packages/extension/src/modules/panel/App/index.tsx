import React from "react";
// import { WaitingForDebug } from "./WaitingForDebug";
import { NotInDebug } from "./NotInDebug";
import { appStore } from "panel/store/app";
import { Main } from "./Main";
import { observer } from "mobx-react-lite";
import { ConfigProvider } from "antd";

export const App = observer(() => {
  const { isInDebug } = appStore;
  const Component = isInDebug ? <Main /> : <NotInDebug />;
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff6b00",
        },
      }}
    >
      {Component}
    </ConfigProvider>
  );
});
