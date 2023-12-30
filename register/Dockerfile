FROM rust:latest

RUN dpkg --add-architecture arm64
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y gcc-aarch64-linux-gnu g++-aarch64-linux-gnu npm \
    libwebkit2gtk-4.0-dev:arm64 libssl-dev:arm64 libsoup2.4-dev:arm64 \
    libjavascriptcoregtk-4.0-dev:arm64


RUN rustup toolchain install nightly && rustup target add aarch64-unknown-linux-gnu && \
    rustup toolchain install stable-aarch64-unknown-linux-gnu

# install tauri deps
RUN cargo install --locked tauri-cli && \
    rustup target add wasm32-unknown-unknown && \
    cargo install --locked trunk && \
    cargo install --locked wasm-bindgen-cli && \
    npm install --global --save-exact esbuild

ENV CARGO_HOME /cargo
ENV PKG_CONFIG_SYSROOT_DIR=/usr/aarch64-linux-gnu/
ENV PKG_CONFIG_PATH=/usr/lib/aarch64-linux-gnu/pkgconfig
ENV CARGO_TARGET_AARCH64_UNKNOWN_LINUX_GNU_LINKER=/usr/bin/aarch64-linux-gnu-gcc

WORKDIR /app

CMD ["cargo", "tauri", "build", "--target", "aarch64-unknown-linux-gnu"]
