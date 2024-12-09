import { Component, EventEmitter, Output } from '@angular/core';
import { NfcService } from '../nfc.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.less',
})
export class PaymentComponent {
  sub?: Subscription;

  @Output() payed = new EventEmitter<string>();

  constructor(public nfcService: NfcService) {
    this.sub = nfcService.sub.subscribe((paymentUser) => {
      this.payed.emit(paymentUser);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
