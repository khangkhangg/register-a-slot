# Extension Icons

This extension requires icon files in the following sizes:
- icon16.png (16x16)
- icon32.png (32x32)
- icon48.png (48x48)
- icon128.png (128x128)

## Generating Icons

You can use the provided icon-generator.html file to create icons, or use any of these methods:

### Method 1: Use icon-generator.html

1. Open `icon-generator.html` in a browser
2. Right-click each icon size and "Save Image As..."
3. Save as icon16.png, icon32.png, icon48.png, icon128.png

### Method 2: Use online tools

Visit one of these websites:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/
- https://www.icoconverter.com/

Upload a logo and generate all sizes.

### Method 3: Use command-line (ImageMagick)

If you have a logo.png file:

```bash
# Install ImageMagick
sudo apt-get install imagemagick  # Ubuntu/Debian
brew install imagemagick          # macOS

# Generate all sizes
convert logo.png -resize 16x16 icon16.png
convert logo.png -resize 32x32 icon32.png
convert logo.png -resize 48x48 icon48.png
convert logo.png -resize 128x128 icon128.png
```

### Method 4: Use Photoshop/GIMP

1. Create a new image with the desired size
2. Design your icon
3. Export as PNG
4. Repeat for all sizes

## Design Guidelines

For best results:
- Use a simple, recognizable icon
- Make sure it works at small sizes (16x16)
- Use high contrast colors
- Keep the design centered
- Use transparent background
- Suggested theme: Robot, automation, or slot machine

## Temporary Solution

Until you create custom icons, you can use placeholder icons or download free icons from:
- https://icons8.com/
- https://www.flaticon.com/
- https://fontawesome.com/

Search for keywords like "robot", "bot", "automation", or "slot machine".
