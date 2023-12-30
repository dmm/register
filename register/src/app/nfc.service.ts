import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { listen, UnlistenFn } from '@tauri-apps/api/event'

class Event {
    event: string = "";
    payload: string = "";
}

class Identifier {
    Name: string = "";
}

type Payload = "NoTag" | "Error" | Identifier;

@Injectable({
    providedIn: 'root'
})
export class NfcService {

    sub = new Subject<string>();

    unlistener?: UnlistenFn;
    constructor() {
        (async () => {
            await listen;
            this.unlistener = await listen("nfc", (event: Event) => {
                let payload: Payload = JSON.parse(event.payload)
                console.log("NFC service payload: " + payload);
                if (payload !== "NoTag" && payload !== "Error") {
                    this.sub.next(payload.Name);

                }
            });
        })();
    }
}
