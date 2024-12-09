import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

class Event {
  event: string = '';
  payload: string = '';
}

interface Product {
  kind: 'Product';
  code: string;
}

interface BonusSound {
  kind: 'BonusSound';
  code: string;
}

export type Code = Product | BonusSound;

function parseCode(codeString: string): Code {
  if (codeString.startsWith('777')) {
    return {
      kind: 'BonusSound',
      code: codeString.substring(3),
    };
  } else {
    return {
      kind: 'Product',
      code: codeString,
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  private barcodeSubject = new Subject<Code>();

  constructor() {
    (async () => {
      console.log('STARTING...');
      await listen('barcode', (event: Event) => {
        //      let payload = event.payload as Payload;
        console.log(event);
        //      this.barcodeSubject.next(event.payload as string);
        this.barcodeSubject.next(parseCode(event.payload));
      });
      console.log('LISTENING...');
    })();
  }

  load() {
    let subject = this.barcodeSubject.asObservable();

    return subject;
  }
}
