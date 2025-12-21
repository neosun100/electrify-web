# Nativefier Enhanced

![Example of Nativefier app in the macOS dock](.github/dock-screenshot.png)

Create desktop apps from any website with a single command.

```bash
nativefier 'web.whatsapp.com'
```

![Walkthrough animation](.github/nativefier-walkthrough.gif)

## ✨ What's New in v53

- 🧙 **Interactive Wizard** - Guided setup with `nativefier wizard`
- 📄 **Config File Support** - YAML/JSON configuration files
- 🎯 **Smart Presets** - Optimized settings for social, productivity, media apps
- 🚀 **Improved CLI** - Better help, examples, and error messages
- 🔒 **Enhanced Security** - Removed annoying 90-day warnings, better defaults

## Quick Start

### Interactive Mode (Recommended for beginners)
```bash
nativefier wizard
```

### Quick Build
```bash
nativefier 'https://example.com'
```

### With Preset
```bash
nativefier 'https://web.whatsapp.com' --preset social
```

### From Config File
```bash
nativefier init          # Generate config template
nativefier build         # Build from config
```

## Installation

```bash
npm install -g nativefier
```

Requirements:
- macOS 10.13+ / Windows / Linux
- [Node.js](https://nodejs.org/) ≥ 16.9 and npm ≥ 7.10

## Available Presets

| Preset | Best For | Features |
|--------|----------|----------|
| `social` | WhatsApp, Telegram, Discord | Single instance, tray, notifications |
| `productivity` | Notion, Trello, Slack | Optimized window size, tray |
| `media` | YouTube, Netflix, Spotify | Honest user-agent, video-optimized |
| `email` | Gmail, Outlook | Notifications, badge counter |
| `developer` | GitHub, GitLab, Jira | Dev tools enabled |
| `minimal` | Basic apps | Minimal configuration |
| `secure` | Sensitive apps | Strict security settings |
| `kiosk` | Public displays | Full-screen, locked down |

```bash
nativefier presets  # List all presets
```

## Configuration File

Create `nativefier.config.yaml`:

```yaml
app:
  name: "My App"
  url: "https://example.com"
  icon: "./icon.png"

window:
  width: 1280
  height: 800

behavior:
  singleInstance: true
  tray: true

security:
  blockExternalUrls: false

# Or use a preset
preset: "social"
```

Then run:
```bash
nativefier build
```

## Commands

| Command | Description |
|---------|-------------|
| `nativefier <url>` | Quick build from URL |
| `nativefier wizard` | Interactive setup wizard |
| `nativefier init` | Generate config file template |
| `nativefier build` | Build from config file |
| `nativefier presets` | List available presets |
| `nativefier --help` | Show all options |

## Common Options

```bash
nativefier <url> [options]

Options:
  --name, -n          App name
  --icon, -i          Path to icon file
  --preset            Use preset configuration
  --config            Path to config file
  --platform, -p      Target platform (windows, mac, linux)
  --arch, -a          CPU architecture (x64, arm64)
  --single-instance   Allow only one instance
  --tray              Enable system tray
  --inject            Inject CSS/JS files
```

See full documentation: [API.md](API.md)

## Examples

### Social Media App
```bash
nativefier 'https://web.whatsapp.com' --preset social --name WhatsApp
```

### Productivity Tool
```bash
nativefier 'https://notion.so' --preset productivity --name Notion
```

### Custom Configuration
```bash
nativefier 'https://example.com' \
  --name "My App" \
  --single-instance \
  --tray \
  --width 1400 \
  --height 900
```

## Troubleshooting

See [CATALOG.md](CATALOG.md) for site-specific workarounds.

## Development

```bash
git clone https://github.com/nativefier/nativefier.git
cd nativefier
npm install
npm run build
npm link
```

## License

[MIT](LICENSE.md)
