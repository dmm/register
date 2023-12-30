use std::{
    env,
    io::{self, BufRead, BufReader},
    thread,
    time::Duration,
};

use log::{error, info};
use serialport::FlowControl;
use tauri::{AppHandle, Manager};

#[derive(Clone, serde::Serialize)]
pub(crate) struct Scan {
    pub code: String,
}

pub(crate) fn start_nfc(handle: AppHandle) {
    let port_name = env::var("NFC_TTY").unwrap();
    let mut port = serialport::new(port_name, 9600)
        .timeout(Duration::from_millis(100))
        .open()
        .expect("Failed to open NFC port");

    let reader = BufReader::new(port);

    for res in reader.lines() {
        let line = match res {
            Ok(line) => line,
            Err(err) => match err.kind() {
                std::io::ErrorKind::TimedOut => continue,
                _ => panic!("nfc i/o error!"),
            },
        };
        // skip empty lines
        if line.len() < 3 {
            continue;
        }
        info!("Backend: Got NFC {}", line);
        if let Err(err) = handle.emit_all("nfc", line) {
            error!("Error emiting NFC event: {}", err);
        }
    }
}
