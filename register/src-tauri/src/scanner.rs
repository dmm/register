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
    loop {
        scan(&handle);
        std::thread::sleep(Duration::from_millis(1000));
        info!("Restarting scanner!");
    }
}
fn scan(handle: &AppHandle) {
    let port_name = env::var("SCANNER_TTY").unwrap();
    let port = match serialport::new(port_name, 9600)
        .flow_control(serialport::FlowControl::None)
        .timeout(Duration::from_millis(100))
        .open()
    {
        Ok(port) => port,
        Err(_) => return,
    };

    let reader = BufReader::new(port);

    for res in reader.lines() {
        let line = match res {
            Ok(line) => line,
            Err(err) => match err.kind() {
                std::io::ErrorKind::TimedOut => continue,
                _ => return,
            },
        };
        // skip empty lines
        if line.len() < 3 {
            continue;
        }
        info!("Backend: Got Code {}", line);
        if let Err(err) = handle.emit_all("barcode", line) {
            error!("Error emiting scan event: {}", err);
            return;
        }
    }
}
