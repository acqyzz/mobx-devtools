import { action, observable } from "mobx";

class ProductStore {
  @observable
  productCount = 13;

  @observable
  productList = [];

  @action
  buy = async () => {
    return;
  };
}

export const productStore = new ProductStore();
