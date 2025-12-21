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
exports.icon = icon;
const log = __importStar(require("loglevel"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const inferIcon_1 = require("../../infer/inferIcon");
const helpers_1 = require("../../helpers/helpers");
/**
 * 检查是否为网络 URL
 */
function isUrl(str) {
    return str.startsWith('http://') || str.startsWith('https://');
}
/**
 * 下载网络图标到本地
 */
async function downloadIcon(iconUrl) {
    log.info(`📥 Downloading icon from ${iconUrl}...`);
    try {
        const result = await (0, helpers_1.downloadFile)(iconUrl);
        if (!result || !result.data) {
            log.warn('Failed to download icon: empty response');
            return undefined;
        }
        const tmpDir = (0, helpers_1.getTempDir)('icon');
        const ext = result.ext || path.extname(new URL(iconUrl).pathname) || '.png';
        const iconPath = path.join(tmpDir, `icon${ext}`);
        await fs.writeFile(iconPath, result.data);
        log.info(`✅ Icon downloaded to ${iconPath}`);
        return iconPath;
    }
    catch (err) {
        log.warn('Failed to download icon:', err.message);
        return undefined;
    }
}
async function icon(options) {
    var _a;
    // 如果指定了图标且是网络 URL，先下载
    if (options.packager.icon && isUrl(options.packager.icon)) {
        const downloadedIcon = await downloadIcon(options.packager.icon);
        if (downloadedIcon) {
            // 直接修改 options，返回下载的路径
            return downloadedIcon;
        }
        else {
            log.warn('Could not download icon, will try to infer from website');
            // 清空图标，让后面的逻辑去推断
            options.packager.icon = undefined;
        }
    }
    // 如果有本地图标，直接使用
    if (options.packager.icon) {
        log.debug('Got local icon from options. Using it, no inferring needed');
        return undefined;
    }
    // 尝试从网站推断图标
    if (!options.packager.platform) {
        log.error('No platform specified. Icon can not be inferred.');
        return undefined;
    }
    try {
        return await (0, inferIcon_1.inferIcon)(options.packager.targetUrl, options.packager.platform);
    }
    catch (err) {
        // eslint-disable-next-line
        const errorUrl = (_a = err === null || err === void 0 ? void 0 : err.config) === null || _a === void 0 ? void 0 : _a.url;
        log.warn('Cannot automatically retrieve the app icon:', errorUrl ? `${err.message} on ${errorUrl}` : err);
        return undefined;
    }
}
//# sourceMappingURL=icon.js.map