

export class Item {
  barcode: string
  name: string;
  price: number;

  constructor(barcode: string, name: string, price: number) {
    this.barcode = barcode;
    this.name = name;
    this.price = price;
  }
}
