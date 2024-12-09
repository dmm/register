#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <source_directory>"
    exit 1
fi

source_dir=$1

target_dir="src-tauri/resources/bonus_sounds/"

* Check if source directory exists
if [ ! -d "$source_dir" ]; then
    echo "Error: Source directory does not exist"
    exit 1
fi

* Process each file
for file in "$source_dir"/*; do
    if [ -f "$file" ]; then
        # Find next available number
        number=1
        while [[ -f "$target_dir/$(printf "%04d" $number).mp3" ]]; do
            ((number++))
        done

        # Create target path and copy
        target="$target_dir/$(printf "%04d" $number).mp3"
        mv "$file" "$target"
        echo "Moved $file to $target"
    fi
done
