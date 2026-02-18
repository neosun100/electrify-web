<div align="center">

# ⚡ Electrify Web

**一行命令，将任意网站转换为原生桌面应用**

[English](README.md) | [简体中文](README_CN.md) | [繁體中文](README_TW.md) | [日本語](README_JP.md)

</div>

---

## ✨ 功能特性

- 🚀 **一键构建** - `eweb https://example.com`
- 🧙 **交互式向导** - 新手友好的引导设置
- 📄 **配置文件** - 支持 YAML/JSON，可继承
- 🎯 **智能预设** - 针对社交、办公、媒体应用优化
- 🌐 **网络图标** - 直接使用图标 URL
- 📱 **PWA 支持** - 自动检测 Web App Manifest
- 🔄 **自动更新** - 内置更新系统
- 🔐 **CVE 检测** - 警告有漏洞的 Electron 版本
- 🔑 **自动登录** - 统一处理表单登录和 HTTP Basic Auth
- 🖥️ **跨平台** - Windows、macOS、Linux

---

## 📦 安装

```bash
npm install -g electrify-web

# 或使用 npx
npx electrify-web https://example.com
```

---

## ⚙️ 命令行选项

```bash
eweb <url> [选项]

选项:
  -n, --name          应用名称
  -i, --icon          图标路径或 URL
  --preset            使用预设 (social, productivity 等)
  --auto-login        自动登录（格式：用户名:密码）
  -p, --platform      目标平台 (windows, mac, linux)
  --single-instance   只允许单实例
  --tray              启用系统托盘
```

完整文档请参阅 [API.md](API.md)。

---

## 📁 项目结构

```
electrify-web/
├── src/
│   ├── cli.ts              # 命令行接口
│   ├── build/              # 构建逻辑
│   ├── options/            # 选项处理
│   ├── autologin/          # 自动登录（表单 + HTTP Basic Auth）
│   ├── presets/            # 预设配置
│   ├── config/             # 配置文件处理
│   ├── wizard/             # 交互式向导
│   ├── pwa/                # PWA 检测
│   ├── security/           # CVE 检查
│   └── updater/            # 自动更新系统
├── app/                    # Electron 应用模板
├── shared/                 # 共享类型
└── docs/                   # 文档
```

---

## 📋 更新日志

### v1.2.0 (2026-02-18)

- 🔑 统一 `--auto-login`：一个参数同时处理网页表单登录和 HTTP Basic Auth (401)
- ✅ autologin 模块完整测试套件（100% 覆盖率）

### v1.1.2 (2025-12-21)

- 🧹 自动清理无效记录（应用被手动删除时）
- 📍 自动更新路径（应用被移动到 /Applications 时）

### v1.1.0 (2025-12-21)

- ✨ 新命令: `eweb list` - 列出所有已安装的应用
- ✨ 新命令: `eweb remove <name>` - 卸载应用

### v1.0.0 (2025-12-21)

**🎉 首次发布 - Nativefier 复兴版**

基于 Nativefier v52.0.0，新增 2000+ 行代码。

---

## 📄 许可证

[MIT](LICENSE.md) © Electrify Web 贡献者
