mod nfc;
mod receipt;
mod scanner;

use std::thread;

use log::{error, info};

use receipt::Cart;
use tauri::Manager;

#[tauri::command]
fn print_receipt(cart: Cart) {
    if let Err(err) = receipt::print_receipt(cart) {
        error!("Error printing receipt! {:?}", err);
    }
}

fn main() {
    env_logger::init();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![print_receipt])
        .setup(|app| {
            let handle = app.handle();
            thread::spawn(move || scanner::start_scanner(handle));
            let handle2 = app.handle();
            thread::spawn(move || nfc::start_nfc(handle2));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
