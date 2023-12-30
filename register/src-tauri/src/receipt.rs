use std::path::Path;

use escpos::{
    driver::{ConsoleDriver, Driver, FileDriver},
    errors::PrinterError,
    printer::Printer,
    utils::{JustifyMode, PageCode, Protocol},
};
use log::{error, info};
use serde::Deserialize;

const CHARS_BY_LINE: usize = 32;

#[derive(Deserialize)]
pub(crate) struct Item {
    pub name: String,
    pub quantity: u32,
    pub price: u32,
}

impl Item {
    pub fn get_price(&self) -> String {
        info!("PRICE: {}", self.price);
        let cents = self.price % 100;
        let dollars = self.price / 100;
        format!("{}.{}", dollars, cents)
    }
}

#[derive(Deserialize)]
pub(crate) struct Cart {
    pub items: Vec<Item>,
    pub total: u32,
    pub checker: String,
}

pub(crate) fn print_receipt(cart: Cart) -> Result<(), PrinterError> {
    let driver = FileDriver::open(Path::new("/dev/usb/lp0"))?;
    //let driver = ConsoleDriver::open(true);

    let mut printer = Printer::new(driver.clone(), Protocol::default());
    printer.debug_mode(Some(escpos::utils::DebugMode::Dec));
    printer.init()?.justify(JustifyMode::CENTER)?;

    printer.bit_image("/home/dmm//rust-logo-small.png")?;

    // Name + address
    let date = chrono::Local::now();
    printer
        .bold(true)?
        .size(2, 2)?
        .writeln("Mattli Shop")?
        .reset_size()?
        .bold(false)?
        .writeln("123 Mattli Dr")?
        .writeln("65109 Jefferson City")?
        .feed()?
        .justify(JustifyMode::LEFT)?
        .writeln(&date.format("%Y-%m-%d %H:%M:%S").to_string())?
        .writeln("-".repeat(CHARS_BY_LINE).as_str())?;

    for item in cart.items {
        let mut characters_length = item.name.len() + item.get_price().len() + 3;

        if item.quantity > 1 {
            characters_length += 2;
        }

        // number of spaces between name and price
        let spaces = "".repeat(CHARS_BY_LINE - characters_length);

        // print item
        if item.quantity > 1 {
            printer.write(&format!("{} ", item.quantity))?;
        }
        printer.write(&format!("{}{}{}", &item.name, spaces, item.get_price()))?;
        printer.feed()?;
    }

    // total
    printer.writeln("-".repeat(CHARS_BY_LINE).as_str())?;

    printer.feed()?;
    printer.print_cut()?;

    Ok(())
}
