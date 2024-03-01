const { app, BrowserWindow, session, webFrame } = require("electron");
const { resolve } = require("path");
const path = require("path");
const { REDUX_DEVTOOLS } = require("electron-devtools-installer");
const install = require("electron-devtools-installer").default;
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // webPreferences: {
    //   plugins: true,
    // },
    // webPreferences: {
    //   contextIsolation: true, // protect against prototype pollution
    //   enableRemoteModule: false, // turn off remote
    //   sandbox: false, // allow preload script to access file system
    //   allowRunningInsecureContent: true,
    //   nodeIntegration: true,
    //   webSecurity: false,
    //   plugins: true,
    // },
  });

  win.loadFile(resolve(__dirname, "./dist/index.html"));
};
const getPath = () => {
  const savePath = app.getPath("userData");
  console.log(path.resolve(`${savePath}/extensions`));
};
getPath();

app.whenReady().then(() => {
  // session.defaultSession.removeExtension();
  // const extensions = session.defaultSession.getAllExtensions();
  // console.log("extensions", extensions);
  // session.defaultSession
  //   .loadExtension(resolve(__dirname, "../../packages/extension/electron"), {
  //     allowFileAccess: true,
  //   })
  //   .then((res) => {
  //     console.log(res);
  //     createWindow();
  //   });
  // install(REDUX_DEVTOOLS).then(() => {
  //   createWindow();
  // });
  session.defaultSession
    .loadExtension(resolve(__dirname, "../../packages/extension/electron"), {
      allowFileAccess: true,
    })
    .then((res) => {
      createWindow();
    });
  // session.defaultSession
  //   .loadExtension(
  //     path.join(
  //       os.homedir(),
  //       "/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/5.0.0_11"
  //     )
  //   )
  //   // .loadExtension(resolve(__dirname, "./chrome"))
  //   .then((res) => {
  //     console.log(res);
  //     createWindow();
  //   });
});
