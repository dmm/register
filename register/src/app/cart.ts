import { Item } from './item';

const MAX_BONUS_SOUND = 88;

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

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

  constructor() {}

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

  private generateSoundCode(): string {
    let soundNumber = getRandomInt(MAX_BONUS_SOUND - 1) + 1;
    let paddedNumber = soundNumber.toString().padStart(4, '0');

    return `7777${paddedNumber}`;
  }

  toReceiptCart(customer: string, checker: string) {
    let items = Array.from(this.items.values()).map((i) => {
      return {
        name: i.item.name,
        quantity: i.quantity,
        price: i.item.price,
      };
    });

    return {
      cart: {
        items: items,
        total: this.getTotal(),
        customer: customer,
        checker: checker,
        soundCode: this.generateSoundCode(),
      },
    };
  }
}
