import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

class Event {
  event: string = '';
  payload: string = '';
}

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  private barcodeSubject = new Subject<string>();

  constructor() {
    (async () => {
      console.log('STARTING...');
      await listen('barcode', (event: Event) => {
        //      let payload = event.payload as Payload;
        console.log(event);
        //      this.barcodeSubject.next(event.payload as string);
        this.barcodeSubject.next(event.payload);
      });
      console.log('LISTENING...');
    })();
  }

  load() {
    let subject = this.barcodeSubject.asObservable();

    return subject;
  }
}
