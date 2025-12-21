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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptions = getOptions;
exports.normalizePlatform = normalizePlatform;
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const debug = __importStar(require("debug"));
const log = __importStar(require("loglevel"));
// package.json is `require`d to let tsc strip the `src` folder by determining
// baseUrl=src. A static import would prevent that and cause an ugly extra `src` folder in `lib`
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const packageJson = require('../../package.json');
const constants_1 = require("../constants");
const inferOs_1 = require("../infer/inferOs");
const asyncConfig_1 = require("./asyncConfig");
const normalizeUrl_1 = require("./normalizeUrl");
const parseUtils_1 = require("../utils/parseUtils");
const autologin_1 = require("../autologin");
const helpers_1 = require("../helpers/helpers");
const inferDefaults_1 = require("../infer/inferDefaults");
const path = __importStar(require("path"));
/**
 * 如果是网络 URL，下载图标到本地
 */
async function resolveIcon(icon) {
    if (!icon || (!icon.startsWith('http://') && !icon.startsWith('https://'))) {
        return icon;
    }
    log.info(`📥 Downloading icon from ${icon}...`);
    try {
        const result = await (0, helpers_1.downloadFile)(icon);
        if (!(result === null || result === void 0 ? void 0 : result.data))
            return undefined;
        const tmpDir = (0, helpers_1.getTempDir)('icon');
        const ext = result.ext || path.extname(new URL(icon).pathname) || '.png';
        const iconPath = path.join(tmpDir, `icon${ext}`);
        await fs.promises.writeFile(iconPath, result.data);
        log.info(`✅ Icon downloaded to ${iconPath}`);
        return iconPath;
    }
    catch (err) {
        log.warn('Failed to download icon:', err.message);
        return undefined;
    }
}
const SEMVER_VERSION_NUMBER_REGEX = /\d+\.\d+\.\d+[-_\w\d.]*/;
/**
 * Process and validate raw user arguments
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function getOptions(rawOptions) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
    // PWA 自动检测
    if (rawOptions.pwa && rawOptions.targetUrl) {
        log.info('📱 Detecting PWA manifest...');
        const pwaDefaults = await (0, inferDefaults_1.inferFromPWA)(rawOptions.targetUrl);
        if (pwaDefaults.hasPWA) {
            log.info('✅ PWA manifest found!');
            if (pwaDefaults.name && !rawOptions.name) {
                log.info(`   Using name: ${pwaDefaults.name}`);
                rawOptions.name = pwaDefaults.name;
            }
            if (pwaDefaults.icon && !rawOptions.icon) {
                log.info(`   Using icon from manifest`);
                rawOptions.icon = pwaDefaults.icon;
            }
            if (pwaDefaults.backgroundColor && !rawOptions.backgroundColor) {
                rawOptions.backgroundColor = pwaDefaults.backgroundColor;
            }
        }
        else {
            log.info('⚠️ No PWA manifest found, using defaults');
        }
    }
    // 提前处理网络图标
    const resolvedIcon = await resolveIcon(rawOptions.icon);
    const options = {
        packager: {
            appCopyright: rawOptions.appCopyright,
            appVersion: rawOptions.appVersion,
            arch: (_a = rawOptions.arch) !== null && _a !== void 0 ? _a : (0, inferOs_1.inferArch)(),
            asar: (_c = (_b = rawOptions.asar) !== null && _b !== void 0 ? _b : rawOptions.conceal) !== null && _c !== void 0 ? _c : false,
            buildVersion: rawOptions.buildVersion,
            darwinDarkModeSupport: (_d = rawOptions.darwinDarkModeSupport) !== null && _d !== void 0 ? _d : false,
            dir: constants_1.PLACEHOLDER_APP_DIR,
            electronVersion: (_e = rawOptions.electronVersion) !== null && _e !== void 0 ? _e : constants_1.DEFAULT_ELECTRON_VERSION,
            icon: resolvedIcon,
            name: typeof rawOptions.name === 'string' ? rawOptions.name : '',
            out: (_f = rawOptions.out) !== null && _f !== void 0 ? _f : process.cwd(),
            overwrite: rawOptions.overwrite,
            quiet: (_g = rawOptions.quiet) !== null && _g !== void 0 ? _g : false,
            platform: rawOptions.platform,
            portable: (_h = rawOptions.portable) !== null && _h !== void 0 ? _h : false,
            targetUrl: rawOptions.targetUrl === undefined
                ? '' // We'll plug this in later via upgrade
                : (0, normalizeUrl_1.normalizeUrl)(rawOptions.targetUrl),
            tmpdir: false, // workaround for electron-packager#375
            upgrade: rawOptions.upgrade !== undefined ? true : false,
            upgradeFrom: (_j = rawOptions.upgradeFrom) !== null && _j !== void 0 ? _j : (rawOptions.upgrade || undefined),
            win32metadata: (_k = rawOptions.win32metadata) !== null && _k !== void 0 ? _k : {
                ProductName: rawOptions.name,
                InternalName: rawOptions.name,
                FileDescription: rawOptions.name,
            },
        },
        nativefier: {
            accessibilityPrompt: true,
            alwaysOnTop: (_l = rawOptions.alwaysOnTop) !== null && _l !== void 0 ? _l : false,
            backgroundColor: rawOptions.backgroundColor,
            basicAuthPassword: rawOptions.basicAuthPassword,
            basicAuthUsername: rawOptions.basicAuthUsername,
            blockExternalUrls: (_m = rawOptions.blockExternalUrls) !== null && _m !== void 0 ? _m : false,
            bookmarksMenu: rawOptions.bookmarksMenu,
            bounce: (_o = rawOptions.bounce) !== null && _o !== void 0 ? _o : false,
            browserwindowOptions: rawOptions.browserwindowOptions,
            clearCache: (_p = rawOptions.clearCache) !== null && _p !== void 0 ? _p : false,
            counter: (_q = rawOptions.counter) !== null && _q !== void 0 ? _q : false,
            crashReporter: rawOptions.crashReporter,
            disableContextMenu: (_r = rawOptions.disableContextMenu) !== null && _r !== void 0 ? _r : false,
            disableDevTools: (_s = rawOptions.disableDevTools) !== null && _s !== void 0 ? _s : false,
            disableGpu: (_t = rawOptions.disableGpu) !== null && _t !== void 0 ? _t : false,
            diskCacheSize: rawOptions.diskCacheSize,
            enableEs3Apis: (_u = rawOptions.enableEs3Apis) !== null && _u !== void 0 ? _u : false,
            fastQuit: (_v = rawOptions.fastQuit) !== null && _v !== void 0 ? _v : false,
            fileDownloadOptions: rawOptions.fileDownloadOptions,
            flashPluginDir: rawOptions.flashPath,
            fullScreen: (_w = rawOptions.fullScreen) !== null && _w !== void 0 ? _w : false,
            globalShortcuts: undefined,
            hideWindowFrame: (_x = rawOptions.hideWindowFrame) !== null && _x !== void 0 ? _x : false,
            ignoreCertificate: (_y = rawOptions.ignoreCertificate) !== null && _y !== void 0 ? _y : false,
            ignoreGpuBlacklist: (_z = rawOptions.ignoreGpuBlacklist) !== null && _z !== void 0 ? _z : false,
            inject: (_0 = rawOptions.inject) !== null && _0 !== void 0 ? _0 : [],
            insecure: (_1 = rawOptions.insecure) !== null && _1 !== void 0 ? _1 : false,
            internalUrls: rawOptions.internalUrls,
            lang: rawOptions.lang,
            maximize: (_2 = rawOptions.maximize) !== null && _2 !== void 0 ? _2 : false,
            nativefierVersion: packageJson.version,
            quiet: (_3 = rawOptions.quiet) !== null && _3 !== void 0 ? _3 : false,
            processEnvs: rawOptions.processEnvs,
            proxyRules: rawOptions.proxyRules,
            showMenuBar: (_4 = rawOptions.showMenuBar) !== null && _4 !== void 0 ? _4 : false,
            singleInstance: (_5 = rawOptions.singleInstance) !== null && _5 !== void 0 ? _5 : false,
            strictInternalUrls: (_6 = rawOptions.strictInternalUrls) !== null && _6 !== void 0 ? _6 : false,
            titleBarStyle: rawOptions.titleBarStyle,
            tray: (_7 = rawOptions.tray) !== null && _7 !== void 0 ? _7 : 'false',
            userAgent: rawOptions.userAgent,
            userAgentHonest: (_8 = rawOptions.userAgentHonest) !== null && _8 !== void 0 ? _8 : false,
            verbose: (_9 = rawOptions.verbose) !== null && _9 !== void 0 ? _9 : false,
            versionString: rawOptions.versionString,
            width: (_10 = rawOptions.width) !== null && _10 !== void 0 ? _10 : 1280,
            height: (_11 = rawOptions.height) !== null && _11 !== void 0 ? _11 : 800,
            minWidth: rawOptions.minWidth,
            minHeight: rawOptions.minHeight,
            maxWidth: rawOptions.maxWidth,
            maxHeight: rawOptions.maxHeight,
            widevine: (_12 = rawOptions.widevine) !== null && _12 !== void 0 ? _12 : false,
            x: rawOptions.x,
            y: rawOptions.y,
            zoom: (_13 = rawOptions.zoom) !== null && _13 !== void 0 ? _13 : 1.0,
        },
    };
    if (options.nativefier.verbose) {
        log.setLevel('trace');
        try {
            debug.enable('electron-packager');
        }
        catch (err) {
            log.error('Failed to enable electron-packager debug output. This should not happen,', 'and suggests their internals changed. Please report an issue.', err);
        }
        log.debug('Running in verbose mode! This will produce a mountain of logs and', 'is recommended only for troubleshooting or if you like Shakespeare.');
    }
    else if (options.nativefier.quiet) {
        log.setLevel('silent');
    }
    else {
        log.setLevel('info');
    }
    let requestedElectronBefore16 = false;
    if (options.packager.electronVersion) {
        const requestedVersion = options.packager.electronVersion;
        if (!SEMVER_VERSION_NUMBER_REGEX.exec(requestedVersion)) {
            throw `Invalid Electron version number "${requestedVersion}". Aborting.`;
        }
        const requestedMajorVersion = parseInt(requestedVersion.split('.')[0], 10);
        if (requestedMajorVersion < constants_1.ELECTRON_MAJOR_VERSION) {
            log.warn(`\nATTENTION: Using **old** Electron version ${requestedVersion} as requested.`, "\nIt's untested, bugs and horror will happen, you're on your own.", `\nSimply abort & re-run without passing the version flag to default to ${constants_1.DEFAULT_ELECTRON_VERSION}`);
        }
        if (requestedMajorVersion < 16) {
            requestedElectronBefore16 = true;
        }
    }
    if (options.nativefier.widevine) {
        const widevineSuffix = requestedElectronBefore16 ? '-wvvmp' : '+wvcus';
        log.debug(`Using widevine release suffix "${widevineSuffix}"`);
        const widevineElectronVersion = `${options.packager.electronVersion}${widevineSuffix}`;
        try {
            await axios_1.default.get(`https://github.com/castlabs/electron-releases/releases/tag/v${widevineElectronVersion}`);
        }
        catch {
            throw new Error(`\nERROR: castLabs Electron version "${widevineElectronVersion}" does not exist. \nVerify versions at https://github.com/castlabs/electron-releases/releases. \nAborting.`);
        }
        options.packager.electronVersion = widevineElectronVersion;
        process.env.ELECTRON_MIRROR =
            'https://github.com/castlabs/electron-releases/releases/download/';
        log.warn(`\nATTENTION: Using the **unofficial** Electron from castLabs`, "\nIt implements Google's Widevine Content Decryption Module (CDM) for DRM-enabled playback.", `\nSimply abort & re-run without passing the widevine flag to default to ${options.packager.electronVersion !== undefined
            ? options.packager.electronVersion
            : constants_1.DEFAULT_ELECTRON_VERSION}`);
    }
    if (options.nativefier.flashPluginDir) {
        options.nativefier.insecure = true;
    }
    if (options.nativefier.userAgentHonest && options.nativefier.userAgent) {
        options.nativefier.userAgent = undefined;
        log.warn(`\nATTENTION: user-agent AND user-agent-honest/honest were provided. In this case, honesty wins. user-agent will be ignored`);
    }
    options.packager.platform = normalizePlatform(options.packager.platform);
    if (options.nativefier.maxWidth &&
        options.nativefier.width &&
        options.nativefier.width > options.nativefier.maxWidth) {
        options.nativefier.width = options.nativefier.maxWidth;
    }
    if (options.nativefier.maxHeight &&
        options.nativefier.height &&
        options.nativefier.height > options.nativefier.maxHeight) {
        options.nativefier.height = options.nativefier.maxHeight;
    }
    if (options.packager.portable) {
        log.info('Building app as portable.', 'SECURITY WARNING: all data accumulated in the app folder after running it', '(including login information, cache, cookies) will be saved', 'in the app folder. If this app is then shared with others,', 'THEY WILL HAVE THAT ACCUMULATED DATA, POTENTIALLY INCLUDING ACCESS', 'TO ANY ACCOUNTS YOU LOGGED INTO.');
    }
    if (rawOptions.globalShortcuts) {
        if (typeof rawOptions.globalShortcuts === 'string') {
            // This is a file we got over the command line
            log.debug('Using global shortcuts file at', rawOptions.globalShortcuts);
            const globalShortcuts = (0, parseUtils_1.parseJson)(fs.readFileSync(rawOptions.globalShortcuts).toString());
            options.nativefier.globalShortcuts = globalShortcuts;
        }
        else {
            // This is an object we got from an existing config in an upgrade
            log.debug('Using global shortcuts object', rawOptions.globalShortcuts);
            options.nativefier.globalShortcuts = rawOptions.globalShortcuts;
        }
    }
    // 处理自动登录
    if (rawOptions.autoLogin) {
        const autoLoginScript = (0, autologin_1.createAutoLoginInjectFile)(rawOptions.autoLogin);
        if (autoLoginScript) {
            if (!options.nativefier.inject) {
                options.nativefier.inject = [];
            }
            options.nativefier.inject.push(autoLoginScript);
            log.info('🔐 Auto-login script will be injected');
        }
    }
    await (0, asyncConfig_1.asyncConfig)(options);
    return options;
}
function normalizePlatform(platform) {
    if (!platform) {
        return (0, inferOs_1.inferPlatform)();
    }
    if (platform.toLowerCase() === 'windows') {
        return 'win32';
    }
    if (['osx', 'mac', 'macos'].includes(platform.toLowerCase())) {
        return 'darwin';
    }
    return platform.toLowerCase();
}
//# sourceMappingURL=optionsMain.js.map