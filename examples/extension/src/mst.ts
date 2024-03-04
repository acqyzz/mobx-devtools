import { types } from "mobx-state-tree";
// import makeInspectable from "mobx-devtools-mst";
import { makeInspectable } from "mobx-devtool-register";

const Todo = types
  .model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setName(newName) {
      self.name = newName;
    },

    toggle() {
      self.done = !self.done;
    },
  }));

const User = types.model({
  name: types.optional(types.string, ""),
});

const RootStore = types
  .model({
    users: types.map(User),
    todos: types.map(Todo),
  })
  .actions((self) => ({
    addTodo(id, name) {
      self.todos.set(id, Todo.create({ name }));
    },
  }));
const rootStore = RootStore.create();
makeInspectable(rootStore);

//@ts-ignore
window.__mstRootStore = rootStore;

setInterval(() => {
  rootStore.addTodo(Math.random(), "Get coffee");
}, 10000);
