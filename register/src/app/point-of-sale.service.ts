import { Injectable } from '@angular/core';
import { Cart } from './cart';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from './login.service';
import { invoke } from '@tauri-apps/api/tauri';

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

  receiptTimer?: ReturnType<typeof setTimeout>;

  constructor(private loginService: LoginService) {}

  reset() {
    this.currentMode.next({ kind: 'ItemScan' });
  }

  submitCart(cart: Cart) {
    this.currentMode.next({
      kind: 'Payment',
      cart: cart,
    });
  }

  paymentSubmitted(paymentUser: string) {
    console.log('service payed!');
    let state = this.currentMode.getValue();
    if (state.kind === 'Payment') {
      let cart = state.cart;

      this.currentMode.next({
        kind: 'Receipt',
        paymentUser: paymentUser,
      });

      let receiptCart = cart.toReceiptCart(
        paymentUser,
        this.loginService.currentUser,
      );

      invoke('print_receipt', receiptCart).then((res) => {
        console.log('Receipt printed!');
      });

      this.receiptTimer = setTimeout(() => {
        this.receiptTimer = undefined;
        this.reset();
      }, 5000);
    } else {
      console.log('Invalid state!');
      this.reset();
    }
  }
}
