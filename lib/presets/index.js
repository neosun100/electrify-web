"use strict";
/**
 * 配置预设系统
 * 为常见使用场景提供优化的默认配置
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.presets = void 0;
exports.getPreset = getPreset;
exports.listPresets = listPresets;
exports.applyPreset = applyPreset;
exports.suggestPreset = suggestPreset;
exports.presets = {
    // 社交媒体应用预设
    social: {
        name: 'Social Media',
        description: 'Optimized for social media apps (WhatsApp, Telegram, Discord)',
        options: {
            singleInstance: true,
            tray: 'true',
            counter: true,
            bounce: true,
            clearCache: false,
            fullScreen: false,
        },
    },
    // 生产力工具预设
    productivity: {
        name: 'Productivity',
        description: 'Optimized for productivity apps (Notion, Trello, Slack)',
        options: {
            singleInstance: true,
            tray: 'true',
            maximize: false,
            width: 1400,
            height: 900,
            clearCache: false,
        },
    },
    // 媒体播放预设
    media: {
        name: 'Media',
        description: 'Optimized for media streaming (YouTube, Netflix, Spotify)',
        options: {
            singleInstance: true,
            widevine: false, // 用户需要手动启用 DRM
            fullScreen: false,
            width: 1280,
            height: 720,
            userAgentHonest: true,
        },
    },
    // 邮件客户端预设
    email: {
        name: 'Email',
        description: 'Optimized for email clients (Gmail, Outlook)',
        options: {
            singleInstance: true,
            tray: 'true',
            counter: true,
            bounce: true,
            width: 1200,
            height: 800,
        },
    },
    // 开发工具预设
    developer: {
        name: 'Developer Tools',
        description: 'Optimized for developer tools (GitHub, GitLab, Jira)',
        options: {
            singleInstance: false,
            disableDevTools: false,
            width: 1400,
            height: 900,
        },
    },
    // 最小化预设
    minimal: {
        name: 'Minimal',
        description: 'Minimal configuration with basic defaults',
        options: {
            singleInstance: false,
            tray: 'false',
            showMenuBar: false,
            disableContextMenu: false,
        },
    },
    // 安全优先预设
    secure: {
        name: 'Secure',
        description: 'Security-focused configuration',
        options: {
            singleInstance: true,
            clearCache: true,
            disableDevTools: true,
            disableContextMenu: true,
            blockExternalUrls: true,
        },
    },
    // Kiosk 模式预设
    kiosk: {
        name: 'Kiosk',
        description: 'Full-screen kiosk mode for public displays',
        options: {
            fullScreen: true,
            singleInstance: true,
            disableDevTools: true,
            disableContextMenu: true,
            hideWindowFrame: true,
            alwaysOnTop: true,
        },
    },
};
/**
 * 获取预设配置
 */
function getPreset(name) {
    return exports.presets[name.toLowerCase()];
}
/**
 * 列出所有可用预设
 */
function listPresets() {
    return Object.values(exports.presets);
}
/**
 * 应用预设到选项
 */
function applyPreset(options, presetName) {
    const preset = getPreset(presetName);
    if (!preset) {
        throw new Error(`Unknown preset: ${presetName}. Available: ${Object.keys(exports.presets).join(', ')}`);
    }
    return { ...preset.options, ...options };
}
/**
 * 根据 URL 智能推荐预设
 */
function suggestPreset(url) {
    const urlLower = url.toLowerCase();
    // 社交媒体
    if (/whatsapp|telegram|discord|messenger|slack|teams/.test(urlLower)) {
        return 'social';
    }
    // 邮件
    if (/gmail|outlook|mail|proton/.test(urlLower)) {
        return 'email';
    }
    // 媒体
    if (/youtube|netflix|spotify|twitch|bilibili/.test(urlLower)) {
        return 'media';
    }
    // 生产力
    if (/notion|trello|asana|monday|clickup|todoist/.test(urlLower)) {
        return 'productivity';
    }
    // 开发工具
    if (/github|gitlab|bitbucket|jira|confluence/.test(urlLower)) {
        return 'developer';
    }
    return undefined;
}
//# sourceMappingURL=index.js.map