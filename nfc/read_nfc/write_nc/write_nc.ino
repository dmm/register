#include <NfcAdapter.h>

#include <PN532_HSU.h>

#include <PN532.h>
#include <PN532Interface.h>
#include <PN532_debug.h>
#include <emulatetag.h>
#include <llcp.h>
#include <mac_link.h>
#include <snep.h>

PN532_HSU pn532hsu(Serial1);
NfcAdapter nfc = NfcAdapter(pn532hsu);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  nfc.begin();
}

void loop() {



  if (true && nfc.tagPresent()) {
    // bool format_success = nfc.format();
    // if (!format_success) {
    //   Serial.println("Error formatting!");
    // }
    NdefMessage message = NdefMessage();
    message.addTextRecord("Linus");
    bool success = nfc.write(message);
    if (success) {
      Serial.println("Successfully Wrote message!");
    } else {
      Serial.println("Error writing!");
    }
  } else {
    Serial.println("No tag...");
  }
  delay(3000);
}
