import { action, observable } from "mobx";
import { registerSingleStore } from "mobx-devtools-inspector";

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

registerSingleStore("productStore", productStore);
