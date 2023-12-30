#!/bin/bash

SSH_AUTH_SOCK= rsync -avz --progress -e "ssh -i ~/.ssh/id_ed25519" target/aarch64-unknown-linux-gnu/debug/pos registerpi.lan:pos/
