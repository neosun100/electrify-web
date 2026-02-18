<div align="center">

# ⚡ Electrify Web

**Transform any website into a native desktop app with one command**

[English](README.md) | [简体中文](README_CN.md) | [繁體中文](README_TW.md) | [日本語](README_JP.md)

[![npm version](https://img.shields.io/npm/v/electrify-web.svg)](https://www.npmjs.com/package/electrify-web)
[![npm downloads](https://img.shields.io/npm/dm/electrify-web.svg)](https://www.npmjs.com/package/electrify-web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/electrify-web.svg)](https://nodejs.org)

</div>

---

## 🎯 Why Electrify Web?

**Electrify Web** is a modern revival of the abandoned [Nativefier](https://github.com/nativefier/nativefier) project. The original project was unmaintained since 2023, leaving thousands of users without updates or security patches.

### What We Fixed & Improved

| Issue | Original Nativefier | Electrify Web |
|-------|---------------------|---------------|
| 🔒 Security | Annoying 90-day warnings | Smart CVE detection |
| 🎨 Icons | Local files only | URL support with auto-download |
| ⚙️ Config | 60+ CLI flags | YAML/JSON config files |
| 🧙 UX | Complex commands | Interactive wizard |
| 📱 PWA | Not supported | Full manifest detection |
| 🔄 Updates | None | Built-in auto-update |
| 📦 Presets | None | 8 optimized presets |

---

## ✨ Features

- 🚀 **One Command Build** - `eweb https://example.com`
- 🧙 **Interactive Wizard** - Guided setup for beginners
- 📄 **Config Files** - YAML/JSON with inheritance support
- 🎯 **Smart Presets** - Optimized for social, productivity, media apps
- 💡 **Auto Detection** - Suggests best settings based on URL
- 🌐 **Network Icons** - Use icon URLs directly
- 📱 **PWA Support** - Auto-detect web app manifest
- 🔄 **Auto-Update** - Built-in update system
- 🩺 **Doctor Command** - Environment diagnostics
- 🔐 **CVE Checking** - Warns about vulnerable Electron versions
- 🔑 **Auto Login** - Unified login for both form-based and HTTP Basic Auth
- 🖥️ **Cross-Platform** - Windows, macOS, Linux

---

## 📦 Installation

```bash
# Install globally via npm
npm install -g electrify-web

# Or use npx (no install needed)
npx electrify-web https://example.com

# Verify installation
electrify --version

# Short alias
eweb --version
```

### Requirements

- Node.js >= 16.16.0
- npm >= 8.11.0
- macOS 10.13+ / Windows 10+ / Linux

---

## 🚀 Quick Start

### Method 1: Interactive Wizard (Recommended)

```bash
eweb wizard
```

### Method 2: One-Line Build

```bash
eweb https://web.whatsapp.com
```

### Method 3: With Preset

```bash
eweb https://web.whatsapp.com --preset social
```

### Method 4: Config File

```bash
# Generate config template
eweb init

# Edit electrify.config.yaml, then build
eweb build
```

---

## ⚙️ CLI Options

```bash
eweb <url> [options]

Options:
  -n, --name          App name
  -i, --icon          Icon path or URL
  --preset            Use preset (social, productivity, etc.)
  --config            Config file path
  --pwa               Auto-detect PWA manifest
  --auto-update       Enable auto-update (github:owner/repo or URL)
  --auto-login        Auto-login with credentials (format: user:pass)
  -p, --platform      Target platform (windows, mac, linux)
  -a, --arch          CPU architecture (x64, arm64)
  --single-instance   Allow only one instance
  --tray              Enable system tray
```

See [API.md](API.md) for full documentation.

---

## 📁 Project Structure

```
electrify-web/
├── src/                    # CLI source code
│   ├── cli.ts              # Command-line interface
│   ├── build/              # Build logic
│   ├── options/            # Option processing
│   ├── autologin/          # Auto-login (form + HTTP Basic Auth)
│   ├── presets/            # Preset configurations
│   ├── config/             # Config file handling
│   ├── wizard/             # Interactive wizard
│   ├── pwa/                # PWA detection
│   ├── security/           # CVE checking
│   └── updater/            # Auto-update system
├── app/                    # Electron app template
│   └── src/
│       ├── main.ts         # Main process
│       └── preload.ts      # Preload script
├── shared/                 # Shared types
└── docs/                   # Documentation
```

---

## 📋 Changelog

### v1.2.0 (2026-02-18)

- 🔑 Unified `--auto-login`: one flag handles both web form login and HTTP Basic Auth (401)
- ✅ Comprehensive test suite for autologin module (100% coverage)

### v1.1.2 (2025-12-21)

- 🧹 Auto-cleanup stale records when apps are manually deleted
- 📍 Auto-update paths when apps are moved to /Applications

### v1.1.0 (2025-12-21)

- ✨ New command: `eweb list` - List all installed apps
- ✨ New command: `eweb remove <name>` - Uninstall an app

### v1.0.0 (2025-12-21)

**🎉 Initial Release - Revival of Nativefier**

Based on Nativefier v52.0.0, with 2000+ lines of new code.

---

## 📄 License

[MIT](LICENSE.md) © Electrify Web Contributors

This project is a fork of [Nativefier](https://github.com/nativefier/nativefier), originally created by Goh Jia Hao.
