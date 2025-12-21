<div align="center">

# ⚡ Electrify Web

**1つのコマンドで任意のウェブサイトをネイティブデスクトップアプリに変換**

[English](README.md) | [简体中文](README_CN.md) | [繁體中文](README_TW.md) | [日本語](README_JP.md)

[![npm version](https://img.shields.io/npm/v/electrify-web.svg)](https://www.npmjs.com/package/electrify-web)
[![npm downloads](https://img.shields.io/npm/dm/electrify-web.svg)](https://www.npmjs.com/package/electrify-web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/electrify-web.svg)](https://nodejs.org)

</div>

---

## 🎯 なぜ Electrify Web を選ぶのか？

**Electrify Web** は、メンテナンスが停止した [Nativefier](https://github.com/nativefier/nativefier) プロジェクトの現代的な復活版です。元のプロジェクトは2023年以降メンテナンスされておらず、数千人のユーザーがアップデートやセキュリティパッチを受けられない状態でした。

### 修正・改善点

| 問題 | 旧 Nativefier | Electrify Web |
|------|---------------|---------------|
| 🔒 セキュリティ | 煩わしい90日警告 | スマートCVE検出 |
| 🎨 アイコン | ローカルファイルのみ | URL自動ダウンロード対応 |
| ⚙️ 設定 | 60以上のCLIフラグ | YAML/JSON設定ファイル |
| 🧙 UX | 複雑なコマンド | インタラクティブウィザード |
| 📱 PWA | 非対応 | 完全なmanifest検出 |
| 🔄 更新 | なし | 内蔵自動更新 |
| 📦 プリセット | なし | 8種類の最適化プリセット |

---

## ✨ 機能

- 🚀 **ワンコマンドビルド** - `electrify https://example.com`
- 🧙 **インタラクティブウィザード** - 初心者向けガイド付きセットアップ
- 📄 **設定ファイル** - 継承をサポートするYAML/JSON
- 🎯 **スマートプリセット** - SNS、生産性、メディアアプリ向けに最適化
- 💡 **自動検出** - URLに基づいて最適な設定を提案
- 🌐 **ネットワークアイコン** - アイコンURLを直接使用
- 📱 **PWAサポート** - Web App Manifestを自動検出
- 🔄 **自動更新** - 内蔵更新システム
- 🩺 **診断コマンド** - 環境診断ツール
- 🔐 **CVEチェック** - 脆弱なElectronバージョンを警告
- 🖥️ **クロスプラットフォーム** - Windows、macOS、Linux

---

## 📦 インストール

```bash
# npmでグローバルインストール
npm install -g electrify-web

# またはnpxを使用（インストール不要）
npx electrify-web https://example.com

# インストール確認
electrify --version

# 短縮エイリアス
eweb --version
```

### 必要条件

- Node.js >= 16.16.0
- npm >= 8.11.0
- macOS 10.13+ / Windows 10+ / Linux

---

## 🚀 クイックスタート

### 方法1：インタラクティブウィザード（初心者推奨）

```bash
electrify wizard
```

### 方法2：ワンラインビルド

```bash
electrify https://web.whatsapp.com
```

### 方法3：プリセット使用

```bash
electrify https://web.whatsapp.com --preset social
```

### 方法4：設定ファイル

```bash
# 設定テンプレートを生成
electrify init

# electrify.config.yamlを編集してビルド
electrify build
```

---

## 🎯 プリセット

| プリセット | 用途 | 機能 |
|------------|------|------|
| `social` | WhatsApp、Discord、Telegram | シングルインスタンス、トレイ、通知 |
| `productivity` | Notion、Trello、Slack | 最適化ウィンドウ、トレイ |
| `media` | YouTube、Netflix、Spotify | 正直なUA、動画最適化 |
| `email` | Gmail、Outlook | 通知、バッジカウンター |
| `developer` | GitHub、GitLab、Jira | 開発ツール有効 |
| `minimal` | 基本アプリ | 最小設定 |
| `secure` | 銀行、機密アプリ | 厳格なセキュリティ |
| `kiosk` | 公共ディスプレイ | フルスクリーン、ロック |

```bash
# すべてのプリセットを表示
electrify presets
```

---

## ⚙️ 設定

### 設定ファイル (electrify.config.yaml)

```yaml
app:
  name: "マイアプリ"
  url: "https://example.com"
  icon: "./icon.png"  # またはURL: "https://..."

window:
  width: 1280
  height: 800

behavior:
  singleInstance: true
  tray: true

# プリセットをベースとして使用
preset: "social"

# 他の設定を継承
extends: "./base.yaml"
```

### CLIオプション

```bash
electrify <url> [オプション]

オプション:
  -n, --name          アプリ名
  -i, --icon          アイコンパスまたはURL
  --preset            プリセット使用 (social, productivity など)
  --config            設定ファイルパス
  --pwa               PWA manifestを自動検出
  --auto-update       自動更新を有効化 (github:owner/repo または URL)
  -p, --platform      ターゲットプラットフォーム (windows, mac, linux)
  -a, --arch          CPUアーキテクチャ (x64, arm64)
  --single-instance   シングルインスタンスのみ許可
  --tray              システムトレイを有効化
```

完全なドキュメントは [API.md](API.md) を参照してください。

---

## 🛠️ コマンド

| コマンド | 説明 |
|----------|------|
| `electrify <url>` | URLからアプリをビルド |
| `electrify wizard` | インタラクティブセットアップ |
| `electrify init` | 設定テンプレートを生成 |
| `electrify build` | 設定ファイルからビルド |
| `electrify presets` | 利用可能なプリセットを表示 |
| `electrify doctor` | 環境をチェック |
| `electrify --help` | すべてのオプションを表示 |

---

## 📋 変更履歴

### v1.0.0 (2025-12)

**🎉 初回リリース - Nativefier復活版**

- ✅ インタラクティブウィザード (`electrify wizard`)
- ✅ 設定ファイルサポート (YAML/JSON)
- ✅ 8種類のスマートプリセット
- ✅ ネットワークアイコンURL対応
- ✅ PWA manifest検出
- ✅ 自動更新システム
- ✅ CVEセキュリティチェック
- ✅ Doctor診断コマンド
- ✅ 90日警告を削除
- ✅ スマートURL推奨

Nativefier v52.0.0をベースに、2000行以上の新コードを追加。

---

## 📄 ライセンス

[MIT](LICENSE.md) © Electrify Web Contributors

このプロジェクトは [Nativefier](https://github.com/nativefier/nativefier) のフォークです。オリジナルの作者は Goh Jia Hao です。

---

## ⭐ Star履歴

[![Star History Chart](https://api.star-history.com/svg?repos=neosun100/electrify-web&type=Date)](https://star-history.com/#neosun100/electrify-web)

---

## 📱 フォローする

<div align="center">

![WeChat](https://img.aws.xin/uPic/扫码_搜索联合传播样式-标准色版.png)

</div>

---

<div align="center">

**このプロジェクトが役に立ったら、⭐をお願いします！**

Electrify Web コミュニティが ❤️ を込めて作成

</div>
