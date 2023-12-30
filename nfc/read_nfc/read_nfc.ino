#include <NfcAdapter.h>

#include <PN532_HSU.h>

#include <PN532.h>
#include <PN532Interface.h>
#include <PN532_debug.h>
#include <emulatetag.h>
#include <llcp.h>
#include <mac_link.h>
#include <snep.h>

#include <avr/wdt.h>

#define BUF_SIZE 128

PN532_HSU pn532hsu(Serial1);
NfcAdapter nfc = NfcAdapter(pn532hsu);

byte payload[BUF_SIZE+1];

void executeCommand(String command) {
  if (!nfc.tagPresent()) {
    //Serial.println("\"NoTag\"");
    return;
  }

  NfcTag tag = nfc.read();

  if (command.equals("read")) {
    NdefMessage msg = tag.getNdefMessage();
    NdefRecord record = msg.getRecord(0);
    int payloadLength = record.getPayloadLength();

    if (payloadLength >= BUF_SIZE) {
      Serial.println("\"Error\"");
      return;
    }

    record.getPayload(payload);
    payload[payloadLength] = NULL;
    Serial.print("{\"Name\":\"");
    Serial.print((char *)(payload + 1 + payload[0]));
    Serial.println("\"}");
    delay(500);

  } else {
    Serial.println("\"Error\"");
  }
}

void setup() {
  // put your setup code here, to run once:
  wdt_enable(WDTO_2S);  //Enable wdt every two seconds
  Serial.begin(9600);
  nfc.begin();
  //Serial.println("RESET");
}

void loop() {

  executeCommand("read");
  wdt_reset();

  delay(10);
}
