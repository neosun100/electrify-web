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

## 🎯 Presets

| Preset | Best For | Features |
|--------|----------|----------|
| `social` | WhatsApp, Discord, Telegram | Single instance, tray, notifications |
| `productivity` | Notion, Trello, Slack | Optimized window, tray |
| `media` | YouTube, Netflix, Spotify | Honest user-agent, video-optimized |
| `email` | Gmail, Outlook | Notifications, badge counter |
| `developer` | GitHub, GitLab, Jira | Dev tools enabled |
| `minimal` | Basic apps | Minimal configuration |
| `secure` | Banking, sensitive apps | Strict security |
| `kiosk` | Public displays | Full-screen, locked |

```bash
# List all presets
eweb presets
```

---

## ⚙️ Configuration

### Config File (electrify.config.yaml)

```yaml
app:
  name: "My App"
  url: "https://example.com"
  icon: "./icon.png"  # or URL: "https://..."

window:
  width: 1280
  height: 800

behavior:
  singleInstance: true
  tray: true

# Use a preset as base
preset: "social"

# Inherit from another config
extends: "./base.yaml"
```

### CLI Options

```bash
eweb <url> [options]

Options:
  -n, --name          App name
  -i, --icon          Icon path or URL
  --preset            Use preset (social, productivity, etc.)
  --config            Config file path
  --pwa               Auto-detect PWA manifest
  --auto-update       Enable auto-update (github:owner/repo or URL)
  -p, --platform      Target platform (windows, mac, linux)
  -a, --arch          CPU architecture (x64, arm64)
  --single-instance   Allow only one instance
  --tray              Enable system tray
```

See [API.md](API.md) for full documentation.

---

## 📱 PWA Support

Automatically detect and use PWA manifest settings:

```bash
eweb https://web.whatsapp.com --pwa
```

This will:
- Extract app name from manifest
- Download the best icon
- Apply theme colors
- Configure display mode

---

## 🔄 Auto-Update

Enable automatic updates for your app:

```bash
# GitHub releases
eweb https://example.com --auto-update github:myorg/myrepo

# Custom update server
eweb https://example.com --auto-update https://updates.example.com
```

---

## 🩺 Diagnostics

Check your environment:

```bash
eweb doctor
```

Output:
```
🩺 Electrify Web Doctor - Environment Check

  ✅ Node.js         v20.10.0 ✓
  ✅ npm             10.2.0 ✓
  ✅ Platform        linux (x64)
  ✅ Disk Space      50G available
  ✅ Network         npm registry reachable ✓
  ✅ Electron Cache  3 versions cached

✅ All checks passed! Ready to build.
```

---

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `eweb <url>` | Build app from URL |
| `eweb wizard` | Interactive setup |
| `eweb init` | Generate config template |
| `eweb build` | Build from config file |
| `eweb presets` | List available presets |
| `eweb doctor` | Check environment |
| `eweb --help` | Show all options |

---

## 📁 Project Structure

```
electrify-web/
├── src/                    # CLI source code
│   ├── cli.ts              # Command-line interface
│   ├── build/              # Build logic
│   ├── options/            # Option processing
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

## 🔧 Tech Stack

- **TypeScript** - Type-safe development
- **Electron** - Desktop app framework
- **electron-packager** - App packaging
- **yargs** - CLI argument parsing
- **axios** - HTTP requests

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

```bash
# Clone the repo
git clone https://github.com/neosun100/electrify-web.git
cd electrify-web

# Install dependencies
npm install

# Build
npm run build

# Link for local testing
npm link

# Run tests
npm test
```

---

## 📋 Changelog

### v1.0.7 (2025-12-21)

- 🔧 Fix: Ensure `cli.js` has executable permission for global install

### v1.0.6 (2025-12-21)

- 💬 Improve: Better error messages for icon conversion failures

### v1.0.5 (2025-12-21)

- 🔧 Fix: Correct iconset sizes for macOS `iconutil` (removed invalid 64x64)

### v1.0.4 (2025-12-21)

- ✨ Feat: Enable PWA detection by default (`--pwa` is now true)

### v1.0.3 (2025-12-21)

- 🔧 Fix: Prefer native `sips` over ImageMagick on macOS for icon conversion

### v1.0.2 (2025-12-21)

- 🔧 Fix: Support ImageMagick v7 (`magick` command instead of deprecated `convert`)

### v1.0.0 (2025-12-21)

**🎉 Initial Release - Revival of Nativefier**

- ✅ Interactive wizard (`eweb wizard`)
- ✅ Config file support (YAML/JSON)
- ✅ 8 smart presets
- ✅ Network icon URL support
- ✅ PWA manifest detection (enabled by default)
- ✅ Auto-update system
- ✅ CVE security checking
- ✅ Doctor command
- ✅ Removed 90-day warning
- ✅ Smart URL-based suggestions
- ✅ Short command alias: `eweb`

Based on Nativefier v52.0.0, with 2000+ lines of new code.

---

## 📄 License

[MIT](LICENSE.md) © Electrify Web Contributors

This project is a fork of [Nativefier](https://github.com/nativefier/nativefier), originally created by Goh Jia Hao.

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=neosun100/electrify-web&type=Date)](https://star-history.com/#neosun100/electrify-web)

---

## 📱 Follow Us

<div align="center">

![WeChat](https://img.aws.xin/uPic/扫码_搜索联合传播样式-标准色版.png)

</div>

---

<div align="center">

**If this project helps you, please give it a ⭐!**

Made with ❤️ by the Electrify Web community

</div>
