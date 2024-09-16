#!/bin/bash

# Set the output file name
OUTPUT_FILE="../_book.md"

# Remove the output file if it already exists
rm -f $OUTPUT_FILE

# Find all .md files in the input directory and its subdirectories
# Sort them alphabetically
# Exclude README.md and index.md
find . -name "*.md" | sort | while read filename; do
  echo "Processing $filename"

  # Add a newline before each file content for separation
  echo "" >>$OUTPUT_FILE

  # Append the content of the file
  cat "$filename" >>$OUTPUT_FILE
done

echo "All markdown files have been combined into $OUTPUT_FILE"
