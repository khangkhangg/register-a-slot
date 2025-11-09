# 🦊 Firefox Installation Guide

Firefox requires a different manifest format (Manifest V2) because it doesn't fully support Manifest V3's service workers yet.

## Quick Setup

**Unix/Linux/Mac:**
```bash
./setup-firefox.sh
```

**Windows:**
```cmd
setup-firefox.bat
```

## What the Setup Script Does

1. **Backs up Chrome manifest:**
   - Copies `manifest.json` → `manifest-chrome.json` (if not already backed up)

2. **Installs Firefox manifest:**
   - Copies `manifest-firefox.json` → `manifest.json`

3. **Ready to load:**
   - Now you can load the extension in Firefox

## Manual Setup (Alternative)

If you prefer to do it manually:

```bash
# Backup Chrome manifest (if needed)
cp manifest.json manifest-chrome.json

# Use Firefox manifest
cp manifest-firefox.json manifest.json
```

## Loading in Firefox

1. Open Firefox
2. Go to: `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file in this folder
5. Done!

**Note:** Firefox temporary add-ons are removed when you close Firefox. You'll need to reload it each time.

## Switching Back to Chrome

To use the extension in Chrome/Edge again:

```bash
# Unix/Linux/Mac
cp manifest-chrome.json manifest.json

# Windows
copy manifest-chrome.json manifest.json
```

## Differences Between Manifests

### manifest.json (Manifest V3 - Chrome/Edge/Brave)
- Uses `manifest_version: 3`
- Uses `background.service_worker`
- Uses `action` API
- Uses `host_permissions`

### manifest-firefox.json (Manifest V2 - Firefox)
- Uses `manifest_version: 2`
- Uses `background.scripts`
- Uses `browser_action` API
- Includes host permissions in `permissions` array

## Troubleshooting

### Error: "background.service_worker is currently disabled"

This means you're trying to load the Chrome manifest in Firefox. Run the setup script:

```bash
./setup-firefox.sh   # Unix/Mac
setup-firefox.bat    # Windows
```

### Extension works in Chrome but not Firefox

Make sure you ran the Firefox setup script. The two browsers need different manifest files.

### Extension works in Firefox but not Chrome

You might have the Firefox manifest loaded. Switch back:

```bash
cp manifest-chrome.json manifest.json
```

## Need Help?

See the main [README.md](README.md) for complete documentation.
