import { Injectable } from '@angular/core';

import { Item } from './item';

const adjectives = [
  'super',
  'ultra',
  'special',
  'fancy',
  'organic',
  'expert',
  'powerhouse',
  'nonstop',
  'value',
  'blue',
  'green',
  'yellow',
  'regular',
  'heavy-duty',
  'heavy',
  'sticky',
  'adaptable',
  'efficient',
  'modern',
  'high-quality',
  'practical',
  'stylish',
  'versatile',
  'unique',
  'innovative',
  'durable',
  'remarkable'
];

const nouns = [
  'klunkster',
  'shoe',
  'lion',
  'cookie',
  'snacko',
  'bag',
  'treat',
  'drink',
  'cookie',
  'wig',
  'ring',
  'bread',
  'cup',
  'monster',
  'lego',
  'squishy',
  'dog food',
  'book',
  'flashlight',
  'plate',
];

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  async calculateName(barcode: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(barcode);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const view = new Uint8Array(hash);

    const adjIndex = view[14] % adjectives.length;
    const nounIndex = view[16] % nouns.length;

    return adjectives[adjIndex] + ' ' + nouns[nounIndex];
  }

  async calculatePrice(barcode: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(barcode);
    const hash = await crypto.subtle.digest("SHA-256", data);
    const view = new Uint8Array(hash);

    return Math.round((view[10] + view[11] + view[12]) / 2);
  }

  async get(barcode: string) {
    return new Item(barcode, await this.calculateName(barcode), await this.calculatePrice(barcode));
  }
}
