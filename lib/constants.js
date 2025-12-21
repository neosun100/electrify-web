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
exports.PLACEHOLDER_APP_DIR = exports.ELECTRON_MAJOR_VERSION = exports.DEFAULT_SAFARI_VERSION = exports.DEFAULT_FIREFOX_VERSION = exports.DEFAULT_CHROME_VERSION = exports.DEFAULT_ELECTRON_VERSION = exports.DEFAULT_APP_NAME = void 0;
const path = __importStar(require("path"));
exports.DEFAULT_APP_NAME = 'APP';
// Upgrade both DEFAULT_ELECTRON_VERSION and DEFAULT_CHROME_VERSION together, and
//   - upgrade app / package.json / "devDependencies" / "electron"
//   - upgrade       package.json / "devDependencies" / "electron"
// Doing a *major* upgrade? Read https://github.com/nativefier/nativefier/blob/master/HACKING.md#deps-major-upgrading-electron
exports.DEFAULT_ELECTRON_VERSION = '25.7.0';
// https://atom.io/download/atom-shell/index.json
// https://www.electronjs.org/releases/stable
exports.DEFAULT_CHROME_VERSION = '114.0.5735.289';
// Update each of these periodically
// https://product-details.mozilla.org/1.0/firefox_versions.json
exports.DEFAULT_FIREFOX_VERSION = '116.0.3';
// https://en.wikipedia.org/wiki/Safari_version_history
exports.DEFAULT_SAFARI_VERSION = {
    majorVersion: 16,
    version: '16.6',
    webkitVersion: '605.1.15',
};
exports.ELECTRON_MAJOR_VERSION = parseInt(exports.DEFAULT_ELECTRON_VERSION.split('.')[0], 10);
exports.PLACEHOLDER_APP_DIR = path.join(__dirname, './../', 'app');
//# sourceMappingURL=constants.js.map