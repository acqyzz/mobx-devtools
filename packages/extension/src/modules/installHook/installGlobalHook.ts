/** copy from mobx-devtools */
/**
 * NOTE: This file cannot `require` any other modules. We `.toString()` the
 *       function in some places and inject the source into the page.
 */

export default function installGlobalHook(window) {
  let nameId = 0;

  enum HOOK_EVENT {
    ADD_STORE = "add-store",
    DELETE_STORE = "delete-store",
    ON_ADD = "on-add",
    ON_DELETE = "on-delete",
    INSTANCES_INJECTED = "instances-injected",
  }

  if (
    window.__MOBX_DEVTOOLS_GLOBAL_HOOK__ &&
    window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.collections
  ) {
    return;
  }

  function valid(a, name) {
    if (!a) return false;
    switch (name) {
      case "mobx":
        if (a[name] && !a[name].getDebugName && a[name].extras) {
          // Support MobX < 4 API
          var fixedMobx = {};
          for (let p in a[name])
            if (Object.prototype.hasOwnProperty.call(a[name], p)) {
              fixedMobx[p] = a[name][p];
            }
          for (let p in a[name].extras)
            if (Object.prototype.hasOwnProperty.call(a[name].extras, p)) {
              fixedMobx[p] = a[name].extras[p];
            }
          a[name] = fixedMobx;
        }
        return Boolean(a[name] && a[name].spy);
      case "mobxReact":
        return Boolean(a[name] && a[name].componentByNodeRegistery);
      default:
        return Boolean(a[name]);
    }
  }

  function sameMobxId(a, b) {
    for (let name in b)
      if (Object.prototype.hasOwnProperty.call(b, name)) {
        if (!a || !b) continue;
        const aa = a[name];
        const bb = b[name];
        if (!a[name] || !b[name]) continue;
        for (let key in aa) {
          if (
            Object.prototype.hasOwnProperty.call(aa, key) &&
            Object.prototype.hasOwnProperty.call(bb, key) &&
            aa[key] &&
            aa[key] instanceof Object &&
            aa[key] === bb[key]
          ) {
            return true;
          }
        }
        for (let key in bb) {
          if (
            Object.prototype.hasOwnProperty.call(aa, key) &&
            Object.prototype.hasOwnProperty.call(bb, key) &&
            bb[key] &&
            bb[key] instanceof Object &&
            aa[key] === bb[key]
          ) {
            return true;
          }
        }
      }
    return false;
  }

  Object.defineProperty(window, "__MOBX_DEVTOOLS_GLOBAL_HOOK__", {
    value: {
      hookVersion: 1,
      collections: {},
      mobxSymbols: [],
      inject(collection) {
        let mobxid;
        const injectedProps = [];
        for (let id in this.collections)
          if (this.collections.hasOwnProperty(id)) {
            if (sameMobxId(this.collections[id], collection)) {
              mobxid = id;
              break;
            }
          }
        if (!mobxid) {
          mobxid = Math.random().toString(32).slice(2);
          this.collections[mobxid] = {};
        }
        for (let prop in collection)
          if (Object.prototype.hasOwnProperty.call(collection, prop)) {
            if (!this.collections[mobxid][prop] && valid(collection, prop)) {
              this.collections[mobxid][prop] = collection[prop];
              injectedProps.push(prop);
              if (collection[prop].$mobx) {
                this.mobxSymbols.push(collection[prop].$mobx);
              }
            }
          }
        if (injectedProps.length > 0)
          this.emit(HOOK_EVENT.INSTANCES_INJECTED, mobxid);
      },
      injectMobx(mobx) {
        this.inject({ mobx });
      },
      injectMobxReact(mobxReact, mobx) {
        if (valid({ mobxReact }, "mobxReact")) {
          mobxReact.trackComponents();
          this.inject({ mobxReact, mobx });
        }
      },
      _listeners: {},
      sub(evt, fn) {
        this.on(evt, fn);
        return () => this.off(evt, fn);
      },
      on(evt, fn) {
        if (!this._listeners[evt]) {
          this._listeners[evt] = [];
        }
        this._listeners[evt].push(fn);
      },
      off(evt, fn) {
        if (!this._listeners[evt]) {
          return;
        }
        const ix = this._listeners[evt].indexOf(fn);
        if (ix !== -1) {
          this._listeners[evt].splice(ix, 1);
        }
        if (!this._listeners[evt].length) {
          this._listeners[evt] = null;
        }
      },
      emit(evt, data) {
        if (this._listeners[evt]) {
          this._listeners[evt].map((fn) => fn(data));
        }
      },
    },
  });

  const hook = window.__MOBX_DEVTOOLS_GLOBAL_HOOK__;

  if (!hook) {
    return;
  }

  const getRandomKey = () => {
    return Math.random().toString(36).slice(-4);
  };

  Object.defineProperty(hook, "storeCollections", {
    value: {},
    enumerable: false,
  });

  Object.defineProperty(hook, "mstMap", {
    value: new WeakMap(),
    enumerable: false,
  });

  const storeCollections = hook.storeCollections;

  hook.sub(HOOK_EVENT.ADD_STORE, (data) => {
    const { name: originName, store, override, mobxId } = data;
    const name = originName || `AnonymousStore@${nameId++}`;
    if (!store) {
      console.error("fail to add store: store is required");
      return "";
    }
    let key = name;
    if (!!storeCollections[name]) {
      if (storeCollections[name] === store) {
        console.error(`fail to add store: exist same store name [${name}]`);
        return name;
      }
      if (override) {
        console.warn(
          `fail to add store: exist store name [${name}], store will be override`
        );
      } else {
        key = `${name}_${getRandomKey()}`;
      }
    }
    storeCollections[key] = store;
    if (mobxId) {
      hook.mstMap.set(store, mobxId);
    }
    hook.emit(HOOK_EVENT.ON_ADD, {
      name: key,
      store,
      mobxId,
    });
    return key;
  });

  hook.sub(HOOK_EVENT.DELETE_STORE, (name) => {
    if (typeof name === "string") {
      const store = storeCollections[name];
      delete storeCollections[name];
      if (store) {
        hook.emit(HOOK_EVENT.ON_DELETE, {
          name,
          store,
        });
      }
      return;
    } else if (typeof name === "object") {
      const keys = Object.keys(storeCollections);
      keys.forEach((key) => {
        if (storeCollections[key] === name) {
          delete storeCollections[key];
          hook.emit(HOOK_EVENT.ON_DELETE, {
            name: key,
            store: name,
          });
        }
      });
      return;
    }
    console.warn("[unregisterSingleStore] name must be string or object");
  });
}
