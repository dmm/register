import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusPicturePickerComponent } from './bonus-picture-picker.component';

describe('BonusPicturePickerComponent', () => {
  let component: BonusPicturePickerComponent;
  let fixture: ComponentFixture<BonusPicturePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusPicturePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusPicturePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
