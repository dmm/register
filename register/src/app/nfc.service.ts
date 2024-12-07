import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

class Event {
  event: string = '';
  payload: string = '';
}

class Identifier {
  uid: string = '';
}

type Payload = 'NoTag' | 'Error' | Identifier;

let uidMap = new Map([
  ['Y3mv', 'Dad'],
  ['Q9l9', 'Snoop'],
]);

@Injectable({
  providedIn: 'root',
})
export class NfcService {
  sub = new Subject<string>();

  uidToName(uid: string): string {
    let nameCandidate = uidMap.get(uid);
    if (nameCandidate === undefined) {
      return 'Guest';
    } else {
      return nameCandidate;
    }
  }

  unlistener?: UnlistenFn;
  constructor() {
    (async () => {
      await listen;
      this.unlistener = await listen('nfc', (event: Event) => {
        let payload: Payload = JSON.parse(event.payload);
        console.log('NFC service payload: ' + payload);
        if (payload !== 'NoTag' && payload !== 'Error') {
          this.sub.next(this.uidToName(payload.uid));
        }
      });
    })();
  }
}
