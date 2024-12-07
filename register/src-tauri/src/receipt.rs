use std::path::Path;

use escpos::{
    driver::{ConsoleDriver, Driver, FileDriver},
    errors::PrinterError,
    printer::Printer,
    utils::{BitImageOption, BitImageSize, JustifyMode, PageCode, Protocol},
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
        format!("{}.{:02}", dollars, cents)
    }
}

#[derive(Deserialize)]
pub(crate) struct Cart {
    pub items: Vec<Item>,
    pub total: u32,
    pub checker: String,
}

impl Cart {
    pub fn get_total(&self) -> String {
        return format!("${}.{:02}", self.total / 100, self.total % 100);
    }
}

pub(crate) fn print_receipt(cart: Cart) -> Result<(), PrinterError> {
    let driver = FileDriver::open(Path::new("/dev/usb/lp0"))?;
    //    let driver = ConsoleDriver::open(true);

    let mut printer = Printer::new(driver.clone(), Protocol::default(), None);
    printer.debug_mode(Some(escpos::utils::DebugMode::Dec));
    printer.init()?.justify(JustifyMode::CENTER)?;

    printer.bit_image_option(
        "/home/dmm//rust-logo-small.png",
        BitImageOption::new(Some(256), None, BitImageSize::Normal)?,
    )?;

    printer.feeds(2)?;

    // Name + address
    let date = chrono::Local::now();
    printer
        .smoothing(false)?
        .bold(true)?
        .size(2, 2)?
        .writeln("Mattli Shop")?
        .reset_size()?
        .writeln("123 Mattli Dr")?
        .writeln("65109 Jefferson City")?
        .feed()?
        .justify(JustifyMode::LEFT)?
        .writeln(&date.format("%Y-%m-%d %H:%M:%S").to_string())?
        .writeln("-".repeat(CHARS_BY_LINE).as_str())?;

    for item in &cart.items {
        let mut characters_length = item.name.len() + item.get_price().len() + 3;

        if item.quantity > 1 {
            characters_length += 2;
        }

        // number of spaces between name and price
        let spaces = " ".repeat(CHARS_BY_LINE - characters_length);

        // print item
        if item.quantity > 1 {
            printer.write(&format!("{} ", item.quantity))?;
        }
        printer.write(&format!("{}{}{}", &item.name, spaces, item.get_price()))?;
        printer.feed()?;
    }

    // total
    printer.writeln("-".repeat(CHARS_BY_LINE).as_str())?;
    printer.code39("12345678")?;
    printer.writeln("-".repeat(CHARS_BY_LINE).as_str())?;
    let total_title_str = "Total:";

    printer.write(&total_title_str)?;
    printer.write(&" ".repeat(CHARS_BY_LINE - total_title_str.len() - cart.get_total().len()))?;
    printer.writeln(&cart.get_total())?;

    printer.feeds(5)?;
    printer.print()?;

    Ok(())
}
