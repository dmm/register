use std::{
    env,
    io::{BufRead, BufReader},
    time::Duration,
};

use log::{error, info};
use tauri::{AppHandle, Manager};

#[derive(Clone, serde::Serialize)]
pub(crate) struct Scan {
    pub code: String,
}

pub(crate) fn start_scanner(handle: AppHandle) {
    let port_name = env::var("SCANNER_TTY").unwrap();
    let port = serialport::new(port_name, 9600)
        .timeout(Duration::from_millis(100))
        .open()
        .expect("Failed to open scanner port");

    let reader = BufReader::new(port);

    for res in reader.lines() {
        let line = match res {
            Ok(line) => line,
            Err(err) => match err.kind() {
                std::io::ErrorKind::TimedOut => continue,
                _ => panic!("scanner i/o error!"),
            },
        };
        // skip empty lines
        if line.len() < 3 {
            continue;
        }
        info!("Backend: Got Code {}", line);
        if let Err(err) = handle.emit_all("barcode", line) {
            error!("Error emiting scan event: {}", err);
        }
    }
}
