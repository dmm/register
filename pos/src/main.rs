use std::path::Path;

use escpos::driver::*;
use escpos::printer::Printer;
use escpos::utils::*;
use fltk::app;
use fltk::group;
use fltk::group::Flex;
use fltk::window::Window;

use fltk::button::Button;
use fltk::frame::Frame;
use fltk::group::experimental::Grid;
use fltk::prelude::GroupExt;
use fltk::prelude::WidgetBase;
use fltk::prelude::WidgetExt;

static SCREEN_HEIGHT: i32 = 600;
static SCREEN_WIDTH: i32 = 1024;
static HEADER_HEIGHT: i32 = 200;
static FOOT_HEIGHT: i32 = 200;

static SCANNER_DEVICE: &str = "/dev/ttyACM0";
static NFC_DEVICE: &str = "/dev/ttyACM1";

fn main() -> escpos::errors::Result<()> {
    env_logger::init();

    let app = app::App::default().with_scheme(app::Scheme::Gtk);
    let mut wind = Window::new(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "Hello from rust");
    let mut main_grid = Grid::new(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "");

    let mut header_flex = Flex::new(0, 0, SCREEN_WIDTH, HEADER_HEIGHT, "");
    header_flex.set_type(group::FlexType::Row);
    let mut greeting = Frame::new(0, 0, 400, HEADER_HEIGHT, "Hi Charlotte!");
    header_flex.end();
    let mut main_flex = Flex::new(
        0,
        0,
        SCREEN_WIDTH,
        SCREEN_HEIGHT - HEADER_HEIGHT - FOOT_HEIGHT,
        "",
    );
    main_flex.set_type(group::FlexType::Row);
    main_flex.end();
    let mut footer_flex = Flex::new(0, 0, SCREEN_WIDTH, FOOT_HEIGHT, "");
    footer_flex.set_type(group::FlexType::Row);
    footer_flex.end();
    main_grid.end();

    let mut frame = Frame::new(0, 0, 400, 200, "");
    let mut but = Button::new(160, 210, 80, 40, "Click me!");
    wind.end();
    wind.show();
    wind.maximize();
    but.set_callback(move |_| frame.set_label("Hello World!")); // the closure capture is mutable borrow to our button
    app.run().unwrap();

    //    let driver = NetworkDriver::open("192.168.1.248", 9100)?;
    let driver = FileDriver::open(Path::new("/dev/usb/lp0")).unwrap();

    Printer::new(driver.clone(), Protocol::default())
        .debug_mode(Some(DebugMode::Hex))
        .init()?
        .ean13_option(
            "1234567890265",
            BarcodeOption::new(
                BarcodeWidth::M,
                BarcodeHeight::S,
                BarcodeFont::A,
                BarcodePosition::Below,
            ),
        )?
        .feed()?
        .print_cut()?;

    Printer::new(driver, Protocol::default())
        .debug_mode(Some(DebugMode::Hex))
        .init()?
        .qrcode_option(
            "https://www.google.com",
            QRCodeOption::new(QRCodeModel::Model1, 6, QRCodeCorrectionLevel::M),
        )?
        .feed()?
        .print_cut()?;

    Ok(())
}
