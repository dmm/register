import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import { LoginService } from '../login.service';
import { BarcodeService } from '../barcode.service';
import { ItemService } from '../item.service';

import { Cart } from '../cart';

import { invoke } from '@tauri-apps/api/tauri';
import { CommonModule, CurrencyPipe, SlicePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-item-scan',
  standalone: true,
  imports: [CommonModule, MatButtonModule, SlicePipe, CurrencyPipe],
  templateUrl: './item-scan.component.html',
  styleUrl: './item-scan.component.less',
})
export class ItemScanComponent {
  @ViewChild('itemList', { static: false }) private itemList: ElementRef =
    {} as ElementRef;

  cart: Cart = new Cart();

  @Output() submitted = new EventEmitter<Cart>();

  constructor(
    private loginService: LoginService,
    private barcodeService: BarcodeService,
    private itemService: ItemService,
    private changeDetection: ChangeDetectorRef,
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

  submit(): void {
    this.submitted.emit(this.cart);
  }

  clearCart() {
    this.cart = new Cart();
    this.changeDetection.detectChanges();
  }
}
