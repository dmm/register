import { Injectable } from '@angular/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { NfcService } from './nfc.service';

class Event {
  event: string = '';
  payload: string = '';
}

class Identifier {
  Name: string = '';
}

type Payload = 'NoTag' | 'Error' | Identifier;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  currentUser: string = '';
  unlistener?: UnlistenFn;

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );

  constructor(private nfcService: NfcService) {
    let loginPromise = this.nfcService.sub.subscribe((name) => {
      console.log('Login Successful! ' + name);
      if (this.currentUser === '') {
        this.currentUser = name;
        this.loggedIn.next(this.currentUser !== '');
      }
    });
  }

  // async tryLogin() {
  //   this.unlistener = await listen('nfc', (event: Event) => {
  //     let payload: Payload = JSON.parse(event.payload);
  //     if (payload !== 'NoTag' && payload !== 'Error') {
  //       console.log('Login Successful! ' + payload.Name);
  //       this.currentUser = payload.Name;
  //     }
  //   });
  //   await new Promise((r) => setTimeout(r, 500));
  //   this.unlistener();

  //   this.loggedIn.next(this.currentUser !== '');
  // }

  logout() {
    this.currentUser = '';
    this.loggedIn.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}
