mod nfc;
mod receipt;
mod scanner;

use std::{io::BufReader, thread};

use log::{error, info};

use receipt::Cart;
use rodio::{Decoder, OutputStream};
use tauri::{async_runtime::spawn_blocking, AppHandle, Manager};

#[tauri::command]
async fn print_receipt(cart: Cart) {
    if let Err(err) = spawn_blocking(move || receipt::print_receipt(cart)).await {
        error!("Error printing receipt! {:?}", err);
    }
}

#[tauri::command]
async fn play_bonus_sound(app_handle: AppHandle, number: i32) {
    let resource_path = app_handle
        .path_resolver()
        .resolve_resource(&format!("resources/bonus_sounds/{:04}.mp3", number))
        .unwrap();

    if let Err(err) = spawn_blocking(move || -> anyhow::Result<()> {
        let (_stream, stream_handle) = OutputStream::try_default()?;

        let file = BufReader::new(std::fs::File::open(&resource_path)?);

        let source = Decoder::new(file)?;

        let sink = rodio::Sink::try_new(&stream_handle)?;

        sink.append(source);

        sink.sleep_until_end();
        Ok(())
    })
    .await
    {
        error!("Error playing bonus sound! {:?}", err);
    }
}

fn main() {
    env_logger::init();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![print_receipt, play_bonus_sound])
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
