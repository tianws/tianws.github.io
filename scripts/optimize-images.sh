#!/bin/bash
# This script finds all images in _source_images and optimizes them into the img directory,
# preserving structure. It also creates WebP versions.

# Ensure the output directory exists
mkdir -p img/

find _source_images -type f \( -name '*.jpg' -o -name '*.jpeg' -o -name '*.png' -o -name '*.gif' \) -print0 | while IFS= read -r -d $'\0' f; do
  REL_PATH="${f#_source_images/}"
  DEST_FILE="img/$REL_PATH"
  DEST_DIR="img/$(dirname "$REL_PATH")"

  mkdir -p "$DEST_DIR"

  # --- Task 1: Optimize original image ---
  echo "Optimizing $f -> $DEST_FILE"
  imagemin "$f" > "$DEST_FILE"

  # --- Task 2: Create WebP version (for JPG and PNG) ---
  case "$f" in
    *.jpg|*.jpeg|*.png)
      DEST_FILE_WEBP="${DEST_FILE%.*}.webp"
      echo "Creating WebP version -> $DEST_FILE_WEBP"
      imagemin "$f" --plugin=webp > "$DEST_FILE_WEBP"
      ;;
  esac
done

echo "Image optimization complete."