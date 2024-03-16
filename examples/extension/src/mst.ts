import { types } from "mobx-state-tree";
import {
  makeInspectable,
  unregisterSingleStore,
} from "mobx-devtools-inspector";

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
export const rootStore = RootStore.create();
makeInspectable(rootStore);

const Product = types
  .model({
    name: types.optional(types.string, ""),
    price: types.optional(types.number, 0),
  })
  .actions((self) => ({
    setName(newName) {
      self.name = newName;
    },

    setPrice(newPrice) {
      self.price = newPrice;
    },
  }));

const Message = types.model({
  name: types.optional(types.string, ""),
});

const RootStore_2 = types
  .model({
    product: types.map(Product),
    message: types.map(Message),
  })
  .actions((self) => ({
    addProduct(id, name, price) {
      self.product.set(id, Product.create({ price, name }));
    },
  }));
export const rootStore_2 = RootStore_2.create();
makeInspectable(rootStore_2);

setTimeout(() => {
  unregisterSingleStore(rootStore);
}, 10000);

// setTimeout(() => {
//   unregisterSingleStore(rootStore_2);
// }, 15000);

setInterval(() => {
  rootStore.addTodo((Math.random() + "").slice(-6), "Get coffee");
}, 3000);

setInterval(() => {
  rootStore_2.addProduct(
    (Math.random() + "").slice(-6),
    "Get coffee",
    Math.floor(Math.random() * 1000)
  );
}, 3000);
