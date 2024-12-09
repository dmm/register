import { Injectable } from '@angular/core';
import { Cart } from './cart';
import { BehaviorSubject } from 'rxjs';

interface ItemScanMode {
  kind: 'ItemScan';
}

interface PaymentMode {
  kind: 'Payment';
  cart: Cart;
}

interface ReceiptMode {
  kind: 'Receipt';
  paymentUser: string;
}

type Mode = ItemScanMode | PaymentMode | ReceiptMode;

@Injectable({
  providedIn: 'root',
})
export class PointOfSaleService {
  private currentMode = new BehaviorSubject<Mode>({ kind: 'ItemScan' });
  mode$ = this.currentMode.asObservable();

  public status: Mode = { kind: 'ItemScan' };

  constructor() {}

  reset() {
    this.status = { kind: 'ItemScan' };
  }

  submitCart(cart: Cart) {
    this.status = {
      kind: 'Payment',
      cart: cart,
    };
  }

  paymentSubmitted(paymentUser: string) {
    console.log('service payed!');
    this.status = {
      kind: 'Receipt',
      paymentUser: paymentUser,
    };
  }
}
