#include <ArduinoJson.h>
#include <ArduinoJson.hpp>

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
  Serial.println("NDEF Reader");
  nfc.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  String json = "{\"command\": \"writeTag\", \"value\": \"Linus\"}";
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, json);
  Serial.println("\nScan a NFC tag\n");
  const char* name = doc["value"];
  Serial.println(name);
  
  if (nfc.tagPresent()) {
    NfcTag tag = nfc.read();
    tag.print();
  }

  if (false && nfc.tagPresent()) {
    //bool format_success = nfc.format();
    NdefMessage message = NdefMessage();
    message.addTextRecord("Charlotte");
    bool success = nfc.write(message);
    if (success) {
      Serial.println("Successfully Wrote message!");
    }
  }
  delay(5000);
}
