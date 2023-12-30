#!/bin/bash

podman run --rm -it -v /home/dmm/.crosscargo:/cargo:z -v $(pwd):/app:z rust_cross_compile:latest
