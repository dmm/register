import { Component, Inject, inject } from '@angular/core';
import { ItemScanComponent } from '../item-scan/item-scan.component';
import { PaymentComponent } from '../payment/payment.component';
import { ReceiptComponent } from '../receipt/receipt.component';
import { PointOfSaleService } from '../point-of-sale.service';
import { CommonModule } from '@angular/common';
import { Cart } from '../cart';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { BarcodeService, BonusSound, Code } from '../barcode.service';

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
  styleUrl: './point-of-sale.component.scss',
})
export class PointOfSaleComponent {
  mode = toSignal(this.pointOfSaleService.mode$, {
    requireSync: true,
  });
  barcodes$;
  readonly dialog = inject(MatDialog);

  constructor(
    barcodeService: BarcodeService,
    public pointOfSaleService: PointOfSaleService,
    private router: Router,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.pointOfSaleService.reset();
      });
    this.barcodes$ = barcodeService
      .load()
      .subscribe((code) => this.handleBarcode(code));
  }

  ngOnDestroy() {
    this.barcodes$.unsubscribe();
  }

  handleBarcode(code: Code) {
    if (code.kind === 'BonusSound') {
      console.log(`GOT BONUS SOUND! ${code.code}`);
      this.dialog.open(BonusSoundDialogComponent, {
        data: code,
        width: '250px',
      });
    }
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

@Component({
  selector: 'app-bonus-sound-dialog',
  imports: [MatDialogModule],
  templateUrl: './bonus-sound-dialog.component.html',
  styleUrl: './bonus-sound-dialog.component.scss',
  standalone: true,
})
export class BonusSoundDialogComponent {
  readonly dialogRef = inject(MatDialogRef<BonusSoundDialogComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BonusSound,
    public pointOfSaleService: PointOfSaleService,
  ) {}

  ngOnInit() {
    async () => {
      //      const path = await resolveResource('resources/bonus_sounds/0001.mp3');
      // const bonusSoundArray = await readBinaryFile(path);
      // const bonusBlob = new Blob([bonusSoundArray], { type: 'audio/mp3' });
      // const url = URL.createObjectURL(bonusBlob);
      // this.audio = new Audio(url);
    };
  }

  playSound() {
    console.log('Dialog playing sound!');
    this.pointOfSaleService.playBonusSound(this.data.code);
  }

  close() {
    this.dialogRef.close();
  }
}
