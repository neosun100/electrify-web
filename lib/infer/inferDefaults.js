"use strict";
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
exports.inferPresetFromUrl = inferPresetFromUrl;
exports.inferNameFromUrl = inferNameFromUrl;
exports.getSmartDefaults = getSmartDefaults;
exports.logSmartDefaults = logSmartDefaults;
exports.inferFromPWA = inferFromPWA;
exports.logPWAInfo = logPWAInfo;
const log = __importStar(require("loglevel"));
const pwa_1 = require("../pwa");
/**
 * URL 到预设的映射规则
 */
const URL_PRESET_RULES = [
    // 社交媒体
    {
        patterns: [
            /whatsapp\.com/i,
            /telegram\.org/i,
            /discord\.com/i,
            /slack\.com/i,
            /messenger\.com/i,
            /signal\.org/i,
            /wechat\.com/i,
            /weixin\.qq\.com/i,
        ],
        preset: 'social',
    },
    // 邮件
    {
        patterns: [
            /mail\.google\.com/i,
            /outlook\.(live|office)\.com/i,
            /mail\.yahoo\.com/i,
            /proton\.me/i,
            /protonmail\.com/i,
            /fastmail\.com/i,
            /mail\.\w+\.\w+/i,
        ],
        preset: 'email',
    },
    // 生产力工具
    {
        patterns: [
            /notion\.so/i,
            /trello\.com/i,
            /asana\.com/i,
            /monday\.com/i,
            /clickup\.com/i,
            /airtable\.com/i,
            /coda\.io/i,
            /basecamp\.com/i,
            /todoist\.com/i,
            /evernote\.com/i,
            /onenote\.com/i,
            /docs\.google\.com/i,
            /sheets\.google\.com/i,
            /drive\.google\.com/i,
            /dropbox\.com/i,
            /figma\.com/i,
            /miro\.com/i,
            /canva\.com/i,
        ],
        preset: 'productivity',
    },
    // 媒体/流媒体
    {
        patterns: [
            /youtube\.com/i,
            /netflix\.com/i,
            /spotify\.com/i,
            /music\.apple\.com/i,
            /soundcloud\.com/i,
            /twitch\.tv/i,
            /bilibili\.com/i,
            /youku\.com/i,
            /iqiyi\.com/i,
            /disneyplus\.com/i,
            /hulu\.com/i,
            /primevideo\.com/i,
            /hbomax\.com/i,
            /pandora\.com/i,
            /deezer\.com/i,
            /tidal\.com/i,
        ],
        preset: 'media',
    },
    // 开发者工具
    {
        patterns: [
            /github\.com/i,
            /gitlab\.com/i,
            /bitbucket\.org/i,
            /jira\./i,
            /atlassian\./i,
            /stackoverflow\.com/i,
            /codepen\.io/i,
            /codesandbox\.io/i,
            /replit\.com/i,
            /vercel\.com/i,
            /netlify\.com/i,
            /heroku\.com/i,
            /aws\.amazon\.com/i,
            /console\.cloud\.google\.com/i,
            /portal\.azure\.com/i,
            /docker\./i,
            /kubernetes\./i,
        ],
        preset: 'developer',
    },
];
/**
 * 根据 URL 推断最佳预设
 */
function inferPresetFromUrl(url) {
    for (const rule of URL_PRESET_RULES) {
        for (const pattern of rule.patterns) {
            if (pattern.test(url)) {
                return rule.preset;
            }
        }
    }
    return undefined;
}
/**
 * 根据 URL 推断应用名称
 */
function inferNameFromUrl(url) {
    const knownNames = {
        'web.whatsapp.com': 'WhatsApp',
        'whatsapp.com': 'WhatsApp',
        'telegram.org': 'Telegram',
        'web.telegram.org': 'Telegram',
        'discord.com': 'Discord',
        'slack.com': 'Slack',
        'mail.google.com': 'Gmail',
        'outlook.live.com': 'Outlook',
        'outlook.office.com': 'Outlook',
        'notion.so': 'Notion',
        'trello.com': 'Trello',
        'github.com': 'GitHub',
        'gitlab.com': 'GitLab',
        'youtube.com': 'YouTube',
        'netflix.com': 'Netflix',
        'spotify.com': 'Spotify',
        'twitter.com': 'Twitter',
        'x.com': 'X',
        'facebook.com': 'Facebook',
        'instagram.com': 'Instagram',
        'linkedin.com': 'LinkedIn',
        'reddit.com': 'Reddit',
        'twitch.tv': 'Twitch',
        'bilibili.com': 'Bilibili',
        'figma.com': 'Figma',
        'canva.com': 'Canva',
    };
    try {
        const hostname = new URL(url).hostname.replace(/^www\./, '');
        return knownNames[hostname];
    }
    catch {
        return undefined;
    }
}
/**
 * 智能推荐配置
 */
function getSmartDefaults(url) {
    const preset = inferPresetFromUrl(url);
    const name = inferNameFromUrl(url);
    const suggestions = [];
    if (preset) {
        suggestions.push(`Detected app type: using "${preset}" preset`);
    }
    if (name) {
        suggestions.push(`Suggested name: "${name}"`);
    }
    return { preset, name, suggestions };
}
/**
 * 输出智能推荐信息
 */
function logSmartDefaults(url, currentPreset) {
    if (currentPreset)
        return; // 用户已指定预设，不再推荐
    const defaults = getSmartDefaults(url);
    if (defaults.suggestions.length > 0) {
        log.info('💡 Smart suggestions:');
        defaults.suggestions.forEach((s) => log.info(`   ${s}`));
        if (defaults.preset) {
            log.info(`   Tip: Use --preset ${defaults.preset} for optimized settings\n`);
        }
    }
}
/**
 * 获取 PWA 信息并生成建议选项
 */
async function inferFromPWA(url) {
    try {
        const pwaInfo = await (0, pwa_1.fetchPWAInfo)(url);
        const options = (0, pwa_1.pwaInfoToOptions)(pwaInfo, url);
        return {
            name: options.name,
            icon: options.icon,
            backgroundColor: options.backgroundColor,
            hasPWA: !!pwaInfo.manifest,
        };
    }
    catch (err) {
        log.debug('Failed to fetch PWA info:', err);
        return { hasPWA: false };
    }
}
/**
 * 输出 PWA 检测信息
 */
async function logPWAInfo(url) {
    var _a;
    try {
        const pwaInfo = await (0, pwa_1.fetchPWAInfo)(url);
        if (pwaInfo.manifest) {
            log.info('📱 PWA detected:');
            if (pwaInfo.manifest.name) {
                log.info(`   Name: ${pwaInfo.manifest.name}`);
            }
            if (pwaInfo.manifest.display) {
                log.info(`   Display: ${pwaInfo.manifest.display}`);
            }
            if ((_a = pwaInfo.manifest.icons) === null || _a === void 0 ? void 0 : _a.length) {
                log.info(`   Icons: ${pwaInfo.manifest.icons.length} available`);
            }
            log.info('');
        }
    }
    catch {
        // 静默失败
    }
}
//# sourceMappingURL=inferDefaults.js.map