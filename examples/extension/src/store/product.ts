import { action, observable, makeObservable } from "mobx";
import { messageStore } from "./message";
import { userStore } from "./user";
import { registerSingleStore } from "mobx-devtools-inspector";

const mockProductList = new Array(3).fill(0).map((index) => ({
  id: index + 1,
  title: `Fjallraven - Foldsack No. ${index + 1} Backpack, Fits 15 Laptops`,
  price: 10000 * Math.random(),
  description:
    "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  rating: {
    rate: 100 * Math.random(),
    count: 1000 * Math.random(),
  },
}));

class ProductStore {
  constructor() {
    makeObservable(this, {
      productCount: observable,
      productList: observable,
      userStore: observable,
      storeList: observable,
      buy: action,
    });

    setTimeout(() => {
      // this.userStore = userStore;
      this.storeList.push(userStore, messageStore);
    }, 10000);
  }
  productCount = 13;

  productList = mockProductList;

  storeList: any[] = [];

  // messageStore = messageStore;

  userStore = {};

  buy = async () => {
    return;
  };
}

export const productStore = new ProductStore();
registerSingleStore("productStore", productStore);
