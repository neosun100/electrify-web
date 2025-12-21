<div align="center">

# ⚡ Electrify Web

**一行命令，将任意网站转换为原生桌面应用**

[English](README.md) | [简体中文](README_CN.md) | [繁體中文](README_TW.md) | [日本語](README_JP.md)

[![npm version](https://img.shields.io/npm/v/electrify-web.svg)](https://www.npmjs.com/package/electrify-web)
[![npm downloads](https://img.shields.io/npm/dm/electrify-web.svg)](https://www.npmjs.com/package/electrify-web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/electrify-web.svg)](https://nodejs.org)

</div>

---

## 🎯 为什么选择 Electrify Web？

**Electrify Web** 是对已停止维护的 [Nativefier](https://github.com/nativefier/nativefier) 项目的现代化复兴。原项目自 2023 年起无人维护，导致数千用户无法获得更新和安全补丁。

### 我们修复和改进了什么

| 问题 | 原 Nativefier | Electrify Web |
|------|---------------|---------------|
| 🔒 安全性 | 烦人的 90 天警告 | 智能 CVE 检测 |
| 🎨 图标 | 仅支持本地文件 | 支持 URL 自动下载 |
| ⚙️ 配置 | 60+ 命令行参数 | YAML/JSON 配置文件 |
| 🧙 体验 | 复杂的命令 | 交互式向导 |
| 📱 PWA | 不支持 | 完整 manifest 检测 |
| 🔄 更新 | 无 | 内置自动更新 |
| 📦 预设 | 无 | 8 种优化预设 |

---

## ✨ 功能特性

- 🚀 **一键构建** - `eweb https://example.com`
- 🧙 **交互式向导** - 新手友好的引导设置
- 📄 **配置文件** - 支持 YAML/JSON，可继承
- 🎯 **智能预设** - 针对社交、办公、媒体应用优化
- 💡 **自动检测** - 根据 URL 推荐最佳设置
- 🌐 **网络图标** - 直接使用图标 URL
- 📱 **PWA 支持** - 自动检测 Web App Manifest
- 🔄 **自动更新** - 内置更新系统
- 🩺 **诊断命令** - 环境检查工具
- 🔐 **CVE 检测** - 警告有漏洞的 Electron 版本
- 🖥️ **跨平台** - Windows、macOS、Linux

---

## 📦 安装

```bash
# 通过 npm 全局安装
npm install -g electrify-web

# 或使用 npx（无需安装）
npx electrify-web https://example.com

# 验证安装
electrify --version

# 简短别名
eweb --version
```

### 系统要求

- Node.js >= 16.16.0
- npm >= 8.11.0
- macOS 10.13+ / Windows 10+ / Linux

---

## 🚀 快速开始

### 方式一：交互式向导（推荐新手）

```bash
eweb wizard
```

### 方式二：一行命令构建

```bash
eweb https://web.whatsapp.com
```

### 方式三：使用预设

```bash
eweb https://web.whatsapp.com --preset social
```

### 方式四：配置文件

```bash
# 生成配置模板
eweb init

# 编辑 electrify.config.yaml，然后构建
eweb build
```

---

## 🎯 预设列表

| 预设 | 适用场景 | 特性 |
|------|----------|------|
| `social` | WhatsApp、Discord、Telegram | 单实例、托盘、通知 |
| `productivity` | Notion、Trello、Slack | 优化窗口、托盘 |
| `media` | YouTube、Netflix、Spotify | 真实 UA、视频优化 |
| `email` | Gmail、Outlook | 通知、徽章计数 |
| `developer` | GitHub、GitLab、Jira | 开发工具启用 |
| `minimal` | 基础应用 | 最小配置 |
| `secure` | 银行、敏感应用 | 严格安全 |
| `kiosk` | 公共展示 | 全屏、锁定 |

```bash
# 列出所有预设
eweb presets
```

---

## ⚙️ 配置说明

### 配置文件 (electrify.config.yaml)

```yaml
app:
  name: "我的应用"
  url: "https://example.com"
  icon: "./icon.png"  # 或 URL: "https://..."

window:
  width: 1280
  height: 800

behavior:
  singleInstance: true
  tray: true

# 使用预设作为基础
preset: "social"

# 继承其他配置
extends: "./base.yaml"
```

### 命令行选项

```bash
eweb <url> [选项]

选项:
  -n, --name          应用名称
  -i, --icon          图标路径或 URL
  --preset            使用预设 (social, productivity 等)
  --config            配置文件路径
  --pwa               自动检测 PWA manifest
  --auto-update       启用自动更新 (github:owner/repo 或 URL)
  -p, --platform      目标平台 (windows, mac, linux)
  -a, --arch          CPU 架构 (x64, arm64)
  --single-instance   只允许单实例
  --tray              启用系统托盘
```

完整文档请参阅 [API.md](API.md)。

---

## 📱 PWA 支持

自动检测并使用 PWA manifest 设置：

```bash
eweb https://web.whatsapp.com --pwa
```

这将会：
- 从 manifest 提取应用名称
- 下载最佳图标
- 应用主题颜色
- 配置显示模式

---

## 🔄 自动更新

为你的应用启用自动更新：

```bash
# GitHub releases
eweb https://example.com --auto-update github:myorg/myrepo

# 自定义更新服务器
eweb https://example.com --auto-update https://updates.example.com
```

---

## 🩺 环境诊断

检查你的环境：

```bash
eweb doctor
```

输出：
```
🩺 Electrify Web Doctor - 环境检查

  ✅ Node.js         v20.10.0 ✓
  ✅ npm             10.2.0 ✓
  ✅ 平台            linux (x64)
  ✅ 磁盘空间        50G 可用
  ✅ 网络            npm 仓库可达 ✓
  ✅ Electron 缓存   已缓存 3 个版本

✅ 所有检查通过！可以开始构建。
```

---

## 🛠️ 命令列表

| 命令 | 描述 |
|------|------|
| `eweb <url>` | 从 URL 构建应用 |
| `eweb wizard` | 交互式设置 |
| `eweb init` | 生成配置模板 |
| `eweb build` | 从配置文件构建 |
| `eweb presets` | 列出可用预设 |
| `eweb doctor` | 检查环境 |
| `eweb --help` | 显示所有选项 |

---

## 📁 项目结构

```
electrify-web/
├── src/                    # CLI 源代码
│   ├── cli.ts              # 命令行接口
│   ├── build/              # 构建逻辑
│   ├── options/            # 选项处理
│   ├── presets/            # 预设配置
│   ├── config/             # 配置文件处理
│   ├── wizard/             # 交互式向导
│   ├── pwa/                # PWA 检测
│   ├── security/           # CVE 检查
│   └── updater/            # 自动更新系统
├── app/                    # Electron 应用模板
│   └── src/
│       ├── main.ts         # 主进程
│       └── preload.ts      # 预加载脚本
├── shared/                 # 共享类型
└── docs/                   # 文档
```

---

## 🔧 技术栈

- **TypeScript** - 类型安全开发
- **Electron** - 桌面应用框架
- **electron-packager** - 应用打包
- **yargs** - CLI 参数解析
- **axios** - HTTP 请求

---

## 🤝 参与贡献

欢迎贡献！请先阅读我们的 [贡献指南](CONTRIBUTING.md)。

```bash
# 克隆仓库
git clone https://github.com/neosun100/electrify-web.git
cd electrify-web

# 安装依赖
npm install

# 构建
npm run build

# 本地链接测试
npm link

# 运行测试
npm test
```

---

## 📋 更新日志

### v1.0.7 (2025-12-21)

- 🔧 修复: 确保 `cli.js` 有执行权限，支持全局安装

### v1.0.6 (2025-12-21)

- 💬 改进: 图标转换失败时提供更友好的错误提示

### v1.0.5 (2025-12-21)

- 🔧 修复: 修正 macOS `iconutil` 所需的图标尺寸（移除无效的 64x64）

### v1.0.4 (2025-12-21)

- ✨ 新功能: 默认启用 PWA 检测（`--pwa` 现在默认为 true）

### v1.0.3 (2025-12-21)

- 🔧 修复: macOS 上优先使用原生 `sips` 而非 ImageMagick 进行图标转换

### v1.0.2 (2025-12-21)

- 🔧 修复: 支持 ImageMagick v7（使用 `magick` 命令替代已弃用的 `convert`）

### v1.0.0 (2025-12-21)

**🎉 首次发布 - Nativefier 复兴版**

- ✅ 交互式向导 (`eweb wizard`)
- ✅ 配置文件支持 (YAML/JSON)
- ✅ 8 种智能预设
- ✅ 网络图标 URL 支持
- ✅ PWA manifest 检测（默认启用）
- ✅ 自动更新系统
- ✅ CVE 安全检测
- ✅ Doctor 诊断命令
- ✅ 移除 90 天警告
- ✅ 智能 URL 推荐
- ✅ 简短命令别名: `eweb`

基于 Nativefier v52.0.0，新增 2000+ 行代码。

---

## 📄 许可证

[MIT](LICENSE.md) © Electrify Web 贡献者

本项目是 [Nativefier](https://github.com/nativefier/nativefier) 的分支，原作者为 Goh Jia Hao。

---

## ⭐ Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=neosun100/electrify-web&type=Date)](https://star-history.com/#neosun100/electrify-web)

---

## 📱 关注我们

<div align="center">

![微信公众号](https://img.aws.xin/uPic/扫码_搜索联合传播样式-标准色版.png)

</div>

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐！**

由 Electrify Web 社区用 ❤️ 制作

</div>
