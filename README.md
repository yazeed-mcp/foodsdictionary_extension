# FoodsDictionary JSON Exporter

A Chrome extension that converts FoodsDictionary diary pages to JSON format.

## Features

- Exports FoodsDictionary diary data to JSON format
- Preserves meal headers and food items
- Includes metadata (date, title, client info)
- Easy one-click export
- Works with both auto-save content and HTML structure

## Installation

1. Clone this repository or download it as a ZIP file
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to a FoodsDictionary diary page (e.g., https://www.foodsdictionary.co.il/profiles/diary-print.php)
2. Click the extension icon in your Chrome toolbar
3. Click the "Export to JSON" button
4. The JSON file will be automatically downloaded

## Output Format

The exported JSON will have the following structure:

```json
{
  "metadata": {
    "date": "27.03.2025",
    "title": "Example Title",
    "clientInfo": "Client Information"
  },
  "meals": {
    "Breakfast": [
      "2% Lactose-free milk * 1 cup",
      "Whole wheat bread * 2 slices"
    ],
    "Lunch": [
      "Grilled chicken breast * 200g",
      "White rice * 1 cup"
    ]
  }
}
```

## Development

The extension uses:
- Manifest V3
- Chrome Extension APIs (tabs, scripting)
- Pure JavaScript (no dependencies)

## License

MIT License