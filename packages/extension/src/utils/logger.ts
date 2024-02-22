import { formatTime } from "./format";

const logEnabled = true;

const addTag = (str: string) => {
  return `[${str}]`;
};
const parseString = (param: unknown) => {
  if (
    typeof param === "string" ||
    typeof param === "number" ||
    typeof param === "boolean" ||
    typeof param === "undefined"
  ) {
    return addTag(`${param}`);
  }
  if (typeof param === "symbol") {
    return addTag(param.toString());
  }
  if (typeof param === "function") {
    return addTag(`Function ${param.name}`);
  }
  if (Array.isArray(param)) {
    if (param.length > 20) {
      return addTag(`Array(${param.length})`);
    } else {
      try {
        const str = JSON.stringify(param);
        return addTag(str);
      } catch (error) {
        return addTag(`Array(${param.length})`);
      }
    }
  }
  if (typeof param === "object") {
    try {
      return addTag(JSON.stringify(param));
    } catch (error) {
      return addTag("object Object");
    }
  }
  return param;
};

class Logger {
  _name: string;
  constructor(_name: string) {
    this._name = _name;
  }
  private generateLog(strs: TemplateStringsArray, params: unknown[]) {
    const str = strs.reduce((prev, cur, index) => {
      return (
        prev + cur + (index >= params.length ? "" : parseString(params[index]))
      );
    }, "");
    return str;
  }
  debug(strs: TemplateStringsArray, ...params: unknown[]) {
    if (!logEnabled) {
      return;
    }
    if (__isDEV__) {
      console.log(
        `${formatTime(+new Date())} [${this._name}] ${this.generateLog(
          strs,
          params
        )}`
      );
    }
  }
  info(strs: TemplateStringsArray, ...params: unknown[]) {
    if (!logEnabled) {
      return;
    }
    console.info(
      `${formatTime(+new Date())} [${this._name}] ${this.generateLog(
        strs,
        params
      )}`
    );
  }
  warn(strs: TemplateStringsArray, ...params: unknown[]) {
    if (!logEnabled) {
      return;
    }
    console.warn(
      `${formatTime(+new Date())} [${this._name}] ${this.generateLog(
        strs,
        params
      )}`
    );
  }
  error(strs: TemplateStringsArray, ...params: unknown[]) {
    if (!logEnabled) {
      return;
    }
    console.error(
      `${formatTime(+new Date())} [${this._name}] ${this.generateLog(
        strs,
        params
      )}`
    );
  }
}

export type LoggerClass = Logger;

export const bgLogger = new Logger("background");
export const panelLogger = new Logger("panel");
export const frontendLogger = new Logger("frontend");
export const proxyLogger = new Logger("proxy");
export const installHookLogger = new Logger("installHook");
export const devLogger = new Logger("dev");
