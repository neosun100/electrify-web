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
exports.hasWine = hasWine;
exports.isLinux = isLinux;
exports.isOSX = isOSX;
exports.isWindows = isWindows;
exports.isWindowsAdmin = isWindowsAdmin;
exports.getTempDir = getTempDir;
exports.downloadFile = downloadFile;
exports.getAllowedIconFormats = getAllowedIconFormats;
exports.isArgFormatInvalid = isArgFormatInvalid;
exports.generateRandomSuffix = generateRandomSuffix;
exports.getProcessEnvs = getProcessEnvs;
exports.checkInternet = checkInternet;
exports.camelCased = camelCased;
const child_process_1 = require("child_process");
const crypto = __importStar(require("crypto"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
const dns = __importStar(require("dns"));
const hasbin = __importStar(require("hasbin"));
const log = __importStar(require("loglevel"));
const tmp = __importStar(require("tmp"));
const parseUtils_1 = require("../utils/parseUtils");
tmp.setGracefulCleanup(); // cleanup temp dirs even when an uncaught exception occurs
const now = new Date();
const TMP_TIME = `${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
function hasWine() {
    return hasbin.sync('wine');
}
// I tried to place this (and the other is* functions) in
// a new shared helpers, but alas eslint gets real confused
// about the type signatures and thinks they're all any.
// TODO: Figure out a way to refactor duplicate code from
// src/helpers/helpers.ts and app/src/helpers/helpers.ts
// into the shared module
function isLinux() {
    return os.platform() === 'linux';
}
function isOSX() {
    return os.platform() === 'darwin';
}
function isWindows() {
    return os.platform() === 'win32';
}
function isWindowsAdmin() {
    if (process.platform !== 'win32') {
        return false;
    }
    // https://stackoverflow.com/questions/4051883/batch-script-how-to-check-for-admin-rights
    // https://stackoverflow.com/questions/57009374/check-admin-or-non-admin-users-in-nodejs-or-javascript
    return (0, child_process_1.spawnSync)('fltmc').status === 0;
}
/**
 * Create a temp directory with a debug-friendly name, and return its path.
 * Will be automatically deleted on exit.
 */
function getTempDir(prefix, mode) {
    return tmp.dirSync({
        mode,
        unsafeCleanup: true, // recursively remove tmp dir on exit, even if not empty.
        prefix: `nativefier-${TMP_TIME}-${prefix}-`,
    }).name;
}
function downloadFile(fileUrl) {
    log.debug(`Downloading ${fileUrl}`);
    return axios_1.default
        .get(fileUrl, {
        responseType: 'arraybuffer',
    })
        .then((response) => {
        if (!response.data) {
            return undefined;
        }
        return {
            data: response.data,
            ext: path.extname(fileUrl),
        };
    });
}
function getAllowedIconFormats(platform) {
    const hasIdentify = hasbin.sync('identify') || hasbin.sync('gm');
    const hasConvert = hasbin.sync('convert') || hasbin.sync('gm');
    const hasIconUtil = hasbin.sync('iconutil');
    const pngToIcns = hasConvert && hasIconUtil;
    const pngToIco = hasConvert;
    const icoToIcns = pngToIcns && hasIdentify;
    const icoToPng = hasConvert;
    // Unsupported
    const icnsToPng = false;
    const icnsToIco = false;
    const formats = [];
    // Shell scripting is not supported on windows, temporary override
    if (isWindows()) {
        switch (platform) {
            case 'darwin':
                formats.push('.icns');
                break;
            case 'linux':
                formats.push('.png');
                break;
            case 'win32':
                formats.push('.ico');
                break;
            default:
                throw new Error(`Unknown platform ${platform}`);
        }
        log.debug(`Allowed icon formats when building for ${platform} (limited on Windows):`, formats);
        return formats;
    }
    switch (platform) {
        case 'darwin':
            formats.push('.icns');
            if (pngToIcns) {
                formats.push('.png');
            }
            if (icoToIcns) {
                formats.push('.ico');
            }
            break;
        case 'linux':
            formats.push('.png');
            if (icoToPng) {
                formats.push('.ico');
            }
            if (icnsToPng) {
                formats.push('.icns');
            }
            break;
        case 'win32':
            formats.push('.ico');
            if (pngToIco) {
                formats.push('.png');
            }
            if (icnsToIco) {
                formats.push('.icns');
            }
            break;
        default:
            throw new Error(`Unknown platform ${platform}`);
    }
    log.debug(`Allowed icon formats when building for ${platform}:`, formats);
    return formats;
}
/**
 * Refuse args like '--n' or '-name', we accept either short '-n' or long '--name'
 */
function isArgFormatInvalid(arg) {
    return ((arg.startsWith('---') ||
        /^--[a-z]$/i.exec(arg) !== null ||
        /^-[a-z]{2,}$/i.exec(arg) !== null) &&
        !['--x', '--y'].includes(arg) // exception for long args --{x,y}
    );
}
function generateRandomSuffix(length = 6) {
    const hash = crypto.createHash('md5');
    // Add a random salt to help avoid collisions
    hash.update(crypto.randomBytes(256));
    return hash.digest('hex').substring(0, length);
}
function getProcessEnvs(val) {
    if (!val) {
        return undefined;
    }
    return (0, parseUtils_1.parseJson)(val);
}
function checkInternet() {
    dns.lookup('npmjs.com', (err) => {
        if (err && err.code === 'ENOTFOUND') {
            log.warn('\nNo Internet Connection\nTo offline build, download electron from https://github.com/electron/electron/releases\nand place in ~/AppData/Local/electron/Cache/ on Windows,\n~/.cache/electron on Linux or ~/Library/Caches/electron/ on Mac\nUse --electron-version to specify the version you downloaded.');
        }
    });
}
/**
 * Takes in a snake-cased string and converts to camelCase
 */
function camelCased(str) {
    return str
        .split('-')
        .filter((s) => s.length > 0)
        .map((word, i) => {
        if (i === 0)
            return word;
        return `${word[0].toUpperCase()}${word.substring(1)}`;
    })
        .join('');
}
//# sourceMappingURL=helpers.js.map