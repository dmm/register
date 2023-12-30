
import { Item } from './item';

export class CartItem {
  item: Item;
  quantity: number = 1;
  total: number;

  constructor(item: Item) {
    this.item = item;
    this.total = this.quantity * this.item.price;
  }
}

export class Cart {
  items: Map<string, CartItem> = new Map();

  constructor() { }

  addItem(item: Item) {
    let res = this.items.get(item.barcode);
    if (res === undefined) {
      this.items.set(item.barcode, new CartItem(item));
    } else {
      this.items.delete(item.barcode);
      res.quantity++;
      res.total = res.quantity * res.item.price;
      this.items.set(item.barcode, res);
    }
  }

  getTotal() {
    let total = 0;
    for (const cartItem of this.items.values()) {
      total += cartItem.total;
    }

    return total;
  }

  *[Symbol.iterator]() {
    for (const cartItem of this.items.values()) {
      yield cartItem;
    }
  }

  toReceiptCart(checker: string) {
    let items = Array.from(this.items.values()).map((i) => {
      return {
        name: i.item.name,
        quantity: i.quantity,
        price: i.item.price
      };
    });

    return {
      cart: {
      items: items,
      total: this.getTotal(),
      checker: checker
    }
    };
  }
}
