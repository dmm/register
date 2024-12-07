import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { LoginService } from '../login.service';
import { BarcodeService } from '../barcode.service';
import { ItemService } from '../item.service';
import { NfcService } from '../nfc.service';

import { Cart } from '../cart';

import { invoke } from '@tauri-apps/api/tauri';

import { Subscription } from 'rxjs';

export interface DialogData {
  paymentUser?: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.less',
})
export class CheckoutComponent {
  @ViewChild('itemList', { static: false }) private itemList: ElementRef =
    {} as ElementRef;

  cart: Cart = new Cart();

  constructor(
    private loginService: LoginService,
    private barcodeService: BarcodeService,
    private itemService: ItemService,
    private changeDetection: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
    barcodeService.load().subscribe(async (barcode) => {
      let item = await this.itemService.get(barcode);
      this.cart.addItem(item);
      this.changeDetection.detectChanges();
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    this.itemList.nativeElement.scrollTop =
      this.itemList.nativeElement.scrollHeight;
  }

  checkout() {
    let receiptCart = this.cart.toReceiptCart(this.loginService.currentUser);
    this.clearCart();
    invoke('print_receipt', receiptCart).then((res) => {
      console.log('Receipt printed!');
    });
  }

  openPaymentDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
  ): void {
    let dialogRef = this.dialog.open(PaymentDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('DIALOG CLOSE VALUE: ' + result.paymentUser);
      if (result.paymentUser !== undefined) {
        this.checkout();
      }
    });
  }

  clearCart() {
    this.cart = new Cart();
    this.changeDetection.detectChanges();
  }
}

@Component({
  selector: 'payment-dialog',
  templateUrl: 'payment-dialog.html',
  styleUrl: 'payment-dialog.less',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
})
export class PaymentDialog {
  paymentUser: string = '';
  cancel: boolean = false;
  sub?: Subscription;

  constructor(
    nfcService: NfcService,
    public dialogRef: MatDialogRef<PaymentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.data = {
      paymentUser: undefined,
    };
    this.sub = nfcService.sub.subscribe((paymentUser) => {
      this.data = {
        paymentUser: paymentUser,
      };
      this.dialogRef.close(this.data);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
