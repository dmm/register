import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import { BarcodeService } from '../barcode.service';
import { ItemService } from '../item.service';

import { Cart } from '../cart';

import { CommonModule, CurrencyPipe, SlicePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-item-scan',
  imports: [CommonModule, MatButtonModule, SlicePipe, CurrencyPipe],
  templateUrl: './item-scan.component.html',
  styleUrl: './item-scan.component.scss',
  standalone: true,
})
export class ItemScanComponent {
  @ViewChild('itemList', { static: false }) private itemList: ElementRef =
    {} as ElementRef;

  cart: Cart = new Cart();

  @Output() submitted = new EventEmitter<Cart>();

  constructor(
    barcodeService: BarcodeService,
    private itemService: ItemService,
    private changeDetection: ChangeDetectorRef,
  ) {
    barcodeService.load().subscribe(async (barcode) => {
      if (barcode.kind === 'Product') {
        let item = await this.itemService.get(barcode.code);
        this.cart.addItem(item);
        this.changeDetection.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  scrollToBottom() {
    this.itemList.nativeElement.scrollTop =
      this.itemList.nativeElement.scrollHeight;
  }

  submit(): void {
    this.submitted.emit(this.cart);
  }

  clearCart() {
    this.cart = new Cart();
    this.changeDetection.detectChanges();
  }
}
