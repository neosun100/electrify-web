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
exports.supportedPlatforms = exports.supportedArchs = void 0;
exports.inferPlatform = inferPlatform;
exports.inferArch = inferArch;
const os = __importStar(require("os"));
const log = __importStar(require("loglevel"));
// Ideally we'd get this list directly from electron-packager, but it's not
// possible to convert a literal type to an array of strings in current TypeScript
exports.supportedArchs = ['x64', 'armv7l', 'arm64', 'universal'];
exports.supportedPlatforms = [
    'darwin',
    'linux',
    'mac',
    'mas',
    'osx',
    'win32',
    'windows',
];
function inferPlatform() {
    const platform = os.platform();
    if (['darwin', 'linux', 'win32'].includes(platform)) {
        log.debug('Inferred platform', platform);
        return platform;
    }
    throw new Error(`Untested platform ${platform} detected`);
}
function inferArch() {
    const arch = os.arch();
    if (!exports.supportedArchs.includes(arch)) {
        throw new Error(`Incompatible architecture ${arch} detected`);
    }
    log.debug('Inferred arch', arch);
    return arch;
}
//# sourceMappingURL=inferOs.js.map