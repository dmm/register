FROM rust:latest

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y gcc-aarch64-linux-gnu


RUN rustup target add aarch64-unknown-linux-gnu
RUN rustup toolchain install stable-aarch64-unknown-linux-gnu

WORKDIR /app

CMD ["cargo", "build", "--target", "aarch64-unknown-linux-gnu"]
