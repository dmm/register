import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-receipt',
    imports: [CommonModule],
    templateUrl: './receipt.component.html',
    styleUrl: './receipt.component.less'
})
export class ReceiptComponent {
  @Input() paymentUser = '';
}