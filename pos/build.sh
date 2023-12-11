#!/bin/bash

podman run --rm -it -v cargocache:/root/.cargo -v $(pwd):/app:z rust_cross_compile:latest
