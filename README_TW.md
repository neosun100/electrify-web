<div align="center">

# ⚡ Electrify Web

**一行指令，將任意網站轉換為原生桌面應用程式**

[English](README.md) | [简体中文](README_CN.md) | [繁體中文](README_TW.md) | [日本語](README_JP.md)

[![npm version](https://img.shields.io/npm/v/electrify-web.svg)](https://www.npmjs.com/package/electrify-web)
[![npm downloads](https://img.shields.io/npm/dm/electrify-web.svg)](https://www.npmjs.com/package/electrify-web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/electrify-web.svg)](https://nodejs.org)

</div>

---

## 🎯 為什麼選擇 Electrify Web？

**Electrify Web** 是對已停止維護的 [Nativefier](https://github.com/nativefier/nativefier) 專案的現代化復興。原專案自 2023 年起無人維護，導致數千使用者無法獲得更新和安全修補程式。

### 我們修復和改進了什麼

| 問題 | 原 Nativefier | Electrify Web |
|------|---------------|---------------|
| 🔒 安全性 | 惱人的 90 天警告 | 智慧 CVE 檢測 |
| 🎨 圖示 | 僅支援本機檔案 | 支援 URL 自動下載 |
| ⚙️ 設定 | 60+ 命令列參數 | YAML/JSON 設定檔 |
| 🧙 體驗 | 複雜的指令 | 互動式精靈 |
| 📱 PWA | 不支援 | 完整 manifest 檢測 |
| 🔄 更新 | 無 | 內建自動更新 |
| 📦 預設 | 無 | 8 種最佳化預設 |

---

## ✨ 功能特色

- 🚀 **一鍵建置** - `electrify https://example.com`
- 🧙 **互動式精靈** - 新手友善的引導設定
- 📄 **設定檔** - 支援 YAML/JSON，可繼承
- 🎯 **智慧預設** - 針對社群、辦公、媒體應用最佳化
- 💡 **自動偵測** - 根據 URL 推薦最佳設定
- 🌐 **網路圖示** - 直接使用圖示 URL
- 📱 **PWA 支援** - 自動偵測 Web App Manifest
- 🔄 **自動更新** - 內建更新系統
- 🩺 **診斷指令** - 環境檢查工具
- 🔐 **CVE 檢測** - 警告有漏洞的 Electron 版本
- 🖥️ **跨平台** - Windows、macOS、Linux

---

## 📦 安裝

```bash
# 透過 npm 全域安裝
npm install -g electrify-web

# 或使用 npx（無需安裝）
npx electrify-web https://example.com

# 驗證安裝
electrify --version
```

### 系統需求

- Node.js >= 16.16.0
- npm >= 8.11.0
- macOS 10.13+ / Windows 10+ / Linux

---

## 🚀 快速開始

### 方式一：互動式精靈（推薦新手）

```bash
electrify wizard
```

### 方式二：一行指令建置

```bash
electrify https://web.whatsapp.com
```

### 方式三：使用預設

```bash
electrify https://web.whatsapp.com --preset social
```

### 方式四：設定檔

```bash
# 產生設定範本
electrify init

# 編輯 electrify.config.yaml，然後建置
electrify build
```

---

## 🎯 預設列表

| 預設 | 適用場景 | 特性 |
|------|----------|------|
| `social` | WhatsApp、Discord、Telegram | 單一執行個體、系統匣、通知 |
| `productivity` | Notion、Trello、Slack | 最佳化視窗、系統匣 |
| `media` | YouTube、Netflix、Spotify | 真實 UA、影片最佳化 |
| `email` | Gmail、Outlook | 通知、徽章計數 |
| `developer` | GitHub、GitLab、Jira | 開發工具啟用 |
| `minimal` | 基礎應用 | 最小設定 |
| `secure` | 銀行、敏感應用 | 嚴格安全 |
| `kiosk` | 公共展示 | 全螢幕、鎖定 |

```bash
# 列出所有預設
electrify presets
```

---

## ⚙️ 設定說明

### 設定檔 (electrify.config.yaml)

```yaml
app:
  name: "我的應用程式"
  url: "https://example.com"
  icon: "./icon.png"  # 或 URL: "https://..."

window:
  width: 1280
  height: 800

behavior:
  singleInstance: true
  tray: true

# 使用預設作為基礎
preset: "social"

# 繼承其他設定
extends: "./base.yaml"
```

### 命令列選項

```bash
electrify <url> [選項]

選項:
  -n, --name          應用程式名稱
  -i, --icon          圖示路徑或 URL
  --preset            使用預設 (social, productivity 等)
  --config            設定檔路徑
  --pwa               自動偵測 PWA manifest
  --auto-update       啟用自動更新 (github:owner/repo 或 URL)
  -p, --platform      目標平台 (windows, mac, linux)
  -a, --arch          CPU 架構 (x64, arm64)
  --single-instance   只允許單一執行個體
  --tray              啟用系統匣
```

完整文件請參閱 [API.md](API.md)。

---

## 🛠️ 指令列表

| 指令 | 描述 |
|------|------|
| `electrify <url>` | 從 URL 建置應用程式 |
| `electrify wizard` | 互動式設定 |
| `electrify init` | 產生設定範本 |
| `electrify build` | 從設定檔建置 |
| `electrify presets` | 列出可用預設 |
| `electrify doctor` | 檢查環境 |
| `electrify --help` | 顯示所有選項 |

---

## 📋 更新日誌

### v1.0.0 (2025-12)

**🎉 首次發布 - Nativefier 復興版**

- ✅ 互動式精靈 (`electrify wizard`)
- ✅ 設定檔支援 (YAML/JSON)
- ✅ 8 種智慧預設
- ✅ 網路圖示 URL 支援
- ✅ PWA manifest 偵測
- ✅ 自動更新系統
- ✅ CVE 安全檢測
- ✅ Doctor 診斷指令
- ✅ 移除 90 天警告
- ✅ 智慧 URL 推薦

基於 Nativefier v52.0.0，新增 2000+ 行程式碼。

---

## 📄 授權條款

[MIT](LICENSE.md) © Electrify Web 貢獻者

本專案是 [Nativefier](https://github.com/nativefier/nativefier) 的分支，原作者為 Goh Jia Hao。

---

## ⭐ Star 歷史

[![Star History Chart](https://api.star-history.com/svg?repos=neosun100/electrify-web&type=Date)](https://star-history.com/#neosun100/electrify-web)

---

## 📱 關注我們

<div align="center">

![微信公眾號](https://img.aws.xin/uPic/扫码_搜索联合传播样式-标准色版.png)

</div>

---

<div align="center">

**如果這個專案對你有幫助，請給它一個 ⭐！**

由 Electrify Web 社群用 ❤️ 製作

</div>
