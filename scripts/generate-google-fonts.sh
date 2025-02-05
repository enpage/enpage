#!/bin/bash
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

# Check if API key is set
if [ -z "$GOOGLE_FONTS_API_KEY" ]; then
  echo "Error: GOOGLE_FONTS_API_KEY environment variable is not set"
  exit 1
fi

DEFAULT_OUTPUT_PATH="$SCRIPT_DIR/../packages/components/src/editor/utils/fonts.json"

# Set default output path or use provided argument
OUTPUT_PATH="${1:-$DEFAULT_OUTPUT_PATH}"

# API endpoint
API_URL="https://www.googleapis.com/webfonts/v1/webfonts?key=$GOOGLE_FONTS_API_KEY"

echo "Fetching Google Fonts list from $API_URL"

# Make API request and process with jq to extract only the font family names
# Then save to specified output path
curl -s "$API_URL" |
  jq '[.items[].family]' >"$OUTPUT_PATH"

# Check if the request was successful
if [ $? -eq 0 ]; then
  echo "Successfully fetched font names and saved to $OUTPUT_PATH"
  echo "Total fonts found: $(jq '. | length' "$OUTPUT_PATH")"
else
  echo "Error: Failed to fetch fonts or process the response"
  exit 1
fi
