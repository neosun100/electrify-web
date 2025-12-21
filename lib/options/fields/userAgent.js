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
exports.userAgent = userAgent;
const log = __importStar(require("loglevel"));
const constants_1 = require("../../constants");
const inferChromeVersion_1 = require("../../infer/browsers/inferChromeVersion");
const inferFirefoxVersion_1 = require("../../infer/browsers/inferFirefoxVersion");
const inferSafariVersion_1 = require("../../infer/browsers/inferSafariVersion");
const optionsMain_1 = require("../optionsMain");
const USER_AGENT_PLATFORM_MAPS = {
    darwin: 'Macintosh; Intel Mac OS X 10_15_7',
    linux: 'X11; Linux x86_64',
    win32: 'Windows NT 10.0; Win64; x64',
};
const USER_AGENT_SHORT_CODE_MAPS = {
    edge: edgeUserAgent,
    firefox: firefoxUserAgent,
    safari: safariUserAgent,
};
async function userAgent(options) {
    var _a;
    if (!options.nativefier.userAgent) {
        // No user agent got passed. Let's handle it with the app.userAgentFallback
        return undefined;
    }
    if (!Object.keys(USER_AGENT_SHORT_CODE_MAPS).includes(options.nativefier.userAgent.toLowerCase())) {
        // Real user agent got passed. No need to translate it.
        log.debug(`${options.nativefier.userAgent.toLowerCase()} not found in`, Object.keys(USER_AGENT_SHORT_CODE_MAPS));
        return undefined;
    }
    options.packager.platform = (0, optionsMain_1.normalizePlatform)(options.packager.platform);
    const userAgentPlatform = USER_AGENT_PLATFORM_MAPS[options.packager.platform === 'mas' ? 'darwin' : options.packager.platform];
    const mapFunction = USER_AGENT_SHORT_CODE_MAPS[options.nativefier.userAgent];
    return await mapFunction(userAgentPlatform, (_a = options.packager.electronVersion) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_ELECTRON_VERSION);
}
async function edgeUserAgent(platform, electronVersion) {
    const chromeVersion = await (0, inferChromeVersion_1.getChromeVersionForElectronVersion)(electronVersion);
    return `Mozilla/5.0 (${platform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36 Edg/${chromeVersion}`;
}
async function firefoxUserAgent(platform) {
    const firefoxVersion = await (0, inferFirefoxVersion_1.getLatestFirefoxVersion)();
    return `Mozilla/5.0 (${platform}; rv:${firefoxVersion}) Gecko/20100101 Firefox/${firefoxVersion}`.replace('10_15_7', '10.15');
}
async function safariUserAgent(platform) {
    const safariVersion = await (0, inferSafariVersion_1.getLatestSafariVersion)();
    return `Mozilla/5.0 (${platform}) AppleWebKit/${safariVersion.webkitVersion} (KHTML, like Gecko) Version/${safariVersion.version} Safari/${safariVersion.webkitVersion}`;
}
//# sourceMappingURL=userAgent.js.map