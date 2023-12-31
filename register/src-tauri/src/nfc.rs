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
    loop {
        nfc(&handle);
        std::thread::sleep(Duration::from_millis(1000));
        info!("Restarting NFC!");
    }
}

fn nfc(handle: &AppHandle) {
    let port_name = env::var("NFC_TTY").unwrap();
    let mut port = match serialport::new(port_name, 9600)
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
        info!("Backend: Got NFC {}", line);
        if let Err(err) = handle.emit_all("nfc", line) {
            error!("Error emiting NFC event: {}", err);
            return;
        }
    }
}
