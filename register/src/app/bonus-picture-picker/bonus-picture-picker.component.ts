import { Component, output } from '@angular/core';

@Component({
  selector: 'app-bonus-picture-picker',
  imports: [],
  templateUrl: './bonus-picture-picker.component.html',
  styleUrl: './bonus-picture-picker.component.scss',
})
export class BonusPicturePickerComponent {
  imageSelected = output<string>();

  bonusPictures: readonly string[] = ['thumbs_up', 'thumbs_down', 'crab'];

  selectImage(imageName: string) {
    this.imageSelected.emit(imageName);
  }
}
