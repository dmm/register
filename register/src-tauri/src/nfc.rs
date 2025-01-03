use std::{
    env,
    io::{self, BufRead, BufReader},
    thread::{self, sleep},
    time::Duration,
};

use base64::{engine::general_purpose::STANDARD, Engine as _};
use log::{debug, error, info};
use nfc1::{target_info::TargetInfo, Target};
use tauri::{AppHandle, Manager};

#[derive(Clone, serde::Serialize)]
pub(crate) struct Scan {
    pub code: String,
}

pub(crate) fn start_nfc(handle: AppHandle) {
    loop {
        if let Err(err) = nfc(&handle) {
            error!("NFC ERROR: {}", err);
        }
        std::thread::sleep(Duration::from_millis(1000));
        info!("Restarting NFC!");
    }
}

fn nfc(handle: &AppHandle) -> nfc1::Result<()> {
    // const nfc_modulation nmModulations[6] = {
    //   { .nmt = NMT_ISO14443A, .nbr = NBR_106 },
    //   { .nmt = NMT_ISO14443B, .nbr = NBR_106 },
    //   { .nmt = NMT_FELICA, .nbr = NBR_212 },
    //   { .nmt = NMT_FELICA, .nbr = NBR_424 },
    //   { .nmt = NMT_JEWEL, .nbr = NBR_106 },
    //   { .nmt = NMT_ISO14443BICLASS, .nbr = NBR_106 },
    // };

    let nfc_tty = match std::env::var("NFC_TTY") {
        Ok(val) => val,
        Err(_) => {
            error!("NFC_TTY NOT SET!");
            String::new()
        }
    };

    let mut context = nfc1::Context::new()?;
    let connstring = format!("pn532_uart:{}", nfc_tty);
    debug!("NFC connecting to: {}", &connstring);
    let mut device = context.open_with_connstring(&connstring)?;
    debug!("NFC reader: {} opened\n\n", device.name());
    device.initiator_init()?;

    // Configure the CRC
    device.set_property_bool(nfc1::Property::HandleCrc, false)?;
    // Use raw send/receive methods
    device.set_property_bool(nfc1::Property::EasyFraming, false)?;
    // Disable 14443-4 autoswitching
    device.set_property_bool(nfc1::Property::AutoIso144434, false)?;

    let mut target_found = false;

    loop {
        match device.initiator_select_passive_target(&nfc1::Modulation {
            modulation_type: nfc1::ModulationType::Iso14443a,
            baud_rate: nfc1::BaudRate::Baud106,
        }) {
            Ok(target) => {
                if let TargetInfo::Iso14443a(info) = &target.target_info {
                    let encoded_uid = STANDARD.encode(&info.uid[0..3]);
                    if !target_found {
                        target_found = true;
                        let msg = format!("{{\"uid\": \"{}\"}}", encoded_uid);
                        debug!("{}", msg);
                        if let Err(err) = handle.emit_all("nfc", msg) {
                            error!("Error emiting NFC event: {}", err);
                        }
                    }
                }
            }
            Err(_) => {
                //
                target_found = false;
            }
        }
        sleep(Duration::from_millis(100));
    }
}
