"use strict";
/**
 * 配置文件系统
 * 支持 YAML 和 JSON 格式的配置文件
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfigFile = loadConfigFile;
exports.findConfigFile = findConfigFile;
exports.configToOptions = configToOptions;
exports.generateConfigTemplate = generateConfigTemplate;
exports.exportConfig = exportConfig;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const log = __importStar(require("loglevel"));
const presets_1 = require("../presets");
// 配置文件名优先级
const CONFIG_FILE_NAMES = [
    'electrify.config.yaml',
    'electrify.config.yml',
    'electrify.config.json',
    'nativefier.yaml',
    'nativefier.yml',
    'nativefier.json',
    '.nativefierrc',
    '.nativefierrc.json',
    '.nativefierrc.yaml',
];
/**
 * 简单的 YAML 解析器（支持基本语法）
 */
function parseSimpleYaml(content) {
    const result = {};
    const lines = content.split('\n');
    const stack = [
        { indent: -1, obj: result },
    ];
    for (let line of lines) {
        // 跳过空行和注释
        if (!line.trim() || line.trim().startsWith('#'))
            continue;
        const indent = line.search(/\S/);
        line = line.trim();
        // 处理数组项
        if (line.startsWith('- ')) {
            const value = line.slice(2).trim();
            const parent = stack[stack.length - 1].obj;
            const lastKey = Object.keys(parent).pop();
            if (lastKey && Array.isArray(parent[lastKey])) {
                parent[lastKey].push(parseValue(value));
            }
            continue;
        }
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1)
            continue;
        const key = line.slice(0, colonIndex).trim();
        const rawValue = line.slice(colonIndex + 1).trim();
        // 回退到正确的层级
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }
        const currentObj = stack[stack.length - 1].obj;
        if (rawValue === '' || rawValue === '|' || rawValue === '>') {
            // 嵌套对象或多行字符串
            const newObj = {};
            currentObj[key] = newObj;
            stack.push({ indent, obj: newObj });
        }
        else if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
            // 内联数组
            const items = rawValue
                .slice(1, -1)
                .split(',')
                .map((s) => parseValue(s.trim()));
            currentObj[key] = items;
        }
        else {
            currentObj[key] = parseValue(rawValue);
        }
    }
    return result;
}
function parseValue(value) {
    // 移除引号
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
    }
    // 布尔值
    if (value === 'true')
        return true;
    if (value === 'false')
        return false;
    // null
    if (value === 'null' || value === '~')
        return null;
    // 数字
    const num = Number(value);
    if (!isNaN(num) && value !== '')
        return num;
    // 字符串
    return value;
}
/**
 * 加载配置文件
 */
function loadConfigFile(configPath) {
    if (!fs.existsSync(configPath)) {
        throw new Error(`Config file not found: ${configPath}`);
    }
    const content = fs.readFileSync(configPath, 'utf-8');
    const ext = path.extname(configPath).toLowerCase();
    let config;
    if (ext === '.json' || configPath.endsWith('rc')) {
        config = JSON.parse(content);
    }
    else if (ext === '.yaml' || ext === '.yml') {
        config = parseSimpleYaml(content);
    }
    else {
        // 尝试 JSON，失败则尝试 YAML
        try {
            config = JSON.parse(content);
        }
        catch {
            config = parseSimpleYaml(content);
        }
    }
    // 处理继承
    if (config.extends) {
        const basePath = path.resolve(path.dirname(configPath), config.extends);
        const baseConfig = loadConfigFile(basePath);
        config = deepMerge(baseConfig, config);
        delete config.extends;
    }
    return config;
}
/**
 * 自动发现配置文件
 */
function findConfigFile(dir = process.cwd()) {
    for (const fileName of CONFIG_FILE_NAMES) {
        const filePath = path.join(dir, fileName);
        if (fs.existsSync(filePath)) {
            log.debug(`Found config file: ${filePath}`);
            return filePath;
        }
    }
    return null;
}
/**
 * 将配置文件转换为 RawOptions
 */
function configToOptions(config) {
    let options = {};
    // 基础配置
    if (config.app) {
        if (config.app.url)
            options.targetUrl = config.app.url;
        if (config.app.name)
            options.name = config.app.name;
        if (config.app.icon)
            options.icon = config.app.icon;
        if (config.app.version)
            options.appVersion = config.app.version;
    }
    // 窗口配置
    if (config.window) {
        Object.assign(options, config.window);
    }
    // 行为配置
    if (config.behavior) {
        const { tray, ...rest } = config.behavior;
        Object.assign(options, rest);
        if (tray !== undefined) {
            options.tray = typeof tray === 'boolean' ? (tray ? 'true' : 'false') : tray;
        }
    }
    // 注入配置
    if (config.inject) {
        const injectFiles = [];
        if (config.inject.css)
            injectFiles.push(...config.inject.css);
        if (config.inject.js)
            injectFiles.push(...config.inject.js);
        if (injectFiles.length > 0)
            options.inject = injectFiles;
    }
    // 安全配置
    if (config.security) {
        Object.assign(options, config.security);
    }
    // 网络配置
    if (config.network) {
        Object.assign(options, config.network);
    }
    // 构建配置
    if (config.build) {
        Object.assign(options, config.build);
    }
    // 应用预设
    if (config.preset) {
        options = (0, presets_1.applyPreset)(options, config.preset);
    }
    return options;
}
/**
 * 生成配置文件模板
 */
function generateConfigTemplate(format = 'yaml') {
    if (format === 'json') {
        return JSON.stringify({
            app: {
                name: 'My App',
                url: 'https://example.com',
                icon: './icon.png',
            },
            window: {
                width: 1280,
                height: 800,
            },
            behavior: {
                singleInstance: true,
                tray: false,
            },
            security: {
                blockExternalUrls: false,
            },
            build: {
                platform: 'current',
                overwrite: true,
            },
        }, null, 2);
    }
    return `# Nativefier Configuration File
# Documentation: https://github.com/nativefier/nativefier/blob/master/API.md

# App Settings
app:
  name: "My App"
  url: "https://example.com"
  icon: "./icon.png"
  # version: "1.0.0"

# Window Settings
window:
  width: 1280
  height: 800
  # minWidth: 800
  # minHeight: 600
  # maxWidth: 1920
  # maxHeight: 1080
  # fullScreen: false
  # maximize: false
  # hideWindowFrame: false
  # alwaysOnTop: false
  # titleBarStyle: "default"  # hidden, hiddenInset
  # backgroundColor: "#ffffff"

# Behavior Settings
behavior:
  singleInstance: true
  tray: false  # true, false, or "start-in-tray"
  # counter: false
  # bounce: false
  # fastQuit: false
  # clearCache: false
  # showMenuBar: false
  # disableContextMenu: false
  # disableDevTools: false

# Inject Custom CSS/JS
# inject:
#   css:
#     - "./custom.css"
#   js:
#     - "./custom.js"

# Security Settings
security:
  blockExternalUrls: false
  # internalUrls: ".*\\\\.example\\\\.com"
  # strictInternalUrls: false
  # ignoreCertificate: false
  # insecure: false

# Network Settings
# network:
#   proxyRules: "http://proxy:8080"
#   userAgent: "custom-user-agent"
#   userAgentHonest: false

# Build Settings
build:
  # platform: "current"  # windows, mac, linux, all
  # arch: "x64"  # x64, arm64, armv7l
  # out: "./dist"
  overwrite: true
  # conceal: false
  # portable: false

# Use a preset (overrides individual settings above)
# preset: "social"  # social, productivity, media, email, developer, minimal, secure, kiosk

# Extend another config file
# extends: "./base-config.yaml"
`;
}
/**
 * 深度合并对象
 */
function deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        const sourceValue = source[key];
        const targetValue = result[key];
        if (sourceValue &&
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue) &&
            targetValue &&
            typeof targetValue === 'object' &&
            !Array.isArray(targetValue)) {
            result[key] = deepMerge(targetValue, sourceValue);
        }
        else if (sourceValue !== undefined) {
            result[key] = sourceValue;
        }
    }
    return result;
}
/**
 * 从现有应用导出配置
 */
function exportConfig(options, format = 'yaml') {
    const config = {
        app: {
            name: options.name,
            url: options.targetUrl,
            icon: options.icon,
        },
        window: {
            width: options.width,
            height: options.height,
            minWidth: options.minWidth,
            minHeight: options.minHeight,
            maxWidth: options.maxWidth,
            maxHeight: options.maxHeight,
            fullScreen: options.fullScreen,
            maximize: options.maximize,
            hideWindowFrame: options.hideWindowFrame,
            alwaysOnTop: options.alwaysOnTop,
            backgroundColor: options.backgroundColor,
        },
        behavior: {
            singleInstance: options.singleInstance,
            tray: options.tray,
            counter: options.counter,
            bounce: options.bounce,
            fastQuit: options.fastQuit,
            clearCache: options.clearCache,
            showMenuBar: options.showMenuBar,
            disableContextMenu: options.disableContextMenu,
            disableDevTools: options.disableDevTools,
        },
        security: {
            internalUrls: options.internalUrls,
            blockExternalUrls: options.blockExternalUrls,
            strictInternalUrls: options.strictInternalUrls,
        },
        build: {
            platform: options.platform,
            arch: options.arch,
            out: options.out,
            overwrite: options.overwrite,
        },
    };
    // 清理 undefined 值
    const cleanConfig = JSON.parse(JSON.stringify(config));
    if (format === 'json') {
        return JSON.stringify(cleanConfig, null, 2);
    }
    // 简单的 YAML 序列化
    return objectToYaml(cleanConfig);
}
function objectToYaml(obj, indent = 0) {
    const spaces = '  '.repeat(indent);
    let result = '';
    if (Array.isArray(obj)) {
        for (const item of obj) {
            if (typeof item === 'object' && item !== null) {
                result += `${spaces}-\n${objectToYaml(item, indent + 1)}`;
            }
            else {
                result += `${spaces}- ${formatYamlValue(item)}\n`;
            }
        }
    }
    else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
            if (value === undefined || value === null)
                continue;
            if (typeof value === 'object' && !Array.isArray(value)) {
                const nested = objectToYaml(value, indent + 1);
                if (nested.trim()) {
                    result += `${spaces}${key}:\n${nested}`;
                }
            }
            else if (Array.isArray(value) && value.length > 0) {
                result += `${spaces}${key}:\n${objectToYaml(value, indent + 1)}`;
            }
            else if (!Array.isArray(value)) {
                result += `${spaces}${key}: ${formatYamlValue(value)}\n`;
            }
        }
    }
    return result;
}
function formatYamlValue(value) {
    if (typeof value === 'string') {
        if (value.includes(':') || value.includes('#') || value.includes("'")) {
            return `"${value.replace(/"/g, '\\"')}"`;
        }
        return value;
    }
    return String(value);
}
//# sourceMappingURL=index.js.map