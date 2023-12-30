FROM rust:latest

RUN dpkg --add-architecture arm64
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y gcc-aarch64-linux-gnu g++-aarch64-linux-gnu


RUN rustup target add aarch64-unknown-linux-gnu
RUN rustup toolchain install stable-aarch64-unknown-linux-gnu

# Install fltk dependencies
RUN apt-get install -y libx11-dev:arm64 libxft-dev:arm64 libx11-dev:arm64 libfltk1.3-dev:arm64 libxext-dev:arm64 libxinerama-dev:arm64 libxcursor-dev:arm64 libxfixes-dev:arm64 libpango1.0-dev:arm64 libglib2.0-dev:arm64


ENV CARGO_HOME /cargo

WORKDIR /app

CMD ["cargo", "build", "--target", "aarch64-unknown-linux-gnu"]
