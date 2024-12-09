import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemScanComponent } from './item-scan.component';

describe('ItemScanComponent', () => {
  let component: ItemScanComponent;
  let fixture: ComponentFixture<ItemScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemScanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
