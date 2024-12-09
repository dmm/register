import { Component } from '@angular/core';
import { ItemScanComponent } from '../item-scan/item-scan.component';
import { PaymentComponent } from '../payment/payment.component';
import { ReceiptComponent } from '../receipt/receipt.component';
import { PointOfSaleService } from '../point-of-sale.service';
import { CommonModule } from '@angular/common';
import { Cart } from '../cart';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-point-of-sale',
  imports: [
    CommonModule,
    RouterModule,
    ItemScanComponent,
    PaymentComponent,
    ReceiptComponent,
  ],
  templateUrl: './point-of-sale.component.html',
  styleUrl: './point-of-sale.component.less',
})
export class PointOfSaleComponent {
  mode = toSignal(this.pointOfSaleService.mode$);

  constructor(
    public pointOfSaleService: PointOfSaleService,
    private router: Router,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.pointOfSaleService.reset();
      });
  }

  cartSubmitted(cart: Cart) {
    console.log(`cart submitted! ${cart.getTotal()}`);
    this.pointOfSaleService.submitCart(cart);
  }

  paymentSubmitted(paymentUser: string) {
    console.log(`payment received from ${paymentUser}`);
    this.pointOfSaleService.paymentSubmitted(paymentUser);
  }
}
