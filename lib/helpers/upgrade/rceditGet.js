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
exports.getVersionString = getVersionString;
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
// A modification of https://github.com/electron/node-rcedit to support the retrieval
// of information.
function getVersionString(executablePath, versionString) {
    var _a;
    let rcedit = path.resolve(__dirname, '..', '..', '..', 'node_modules', 'rcedit', 'bin', process.arch === 'x64' ? 'rcedit-x64.exe' : 'rcedit.exe');
    const args = [executablePath, `--get-version-string`, versionString];
    const spawnOptions = {
        env: { ...process.env },
    };
    // Use Wine on non-Windows platforms except for WSL, which doesn't need it
    if (process.platform !== 'win32' && !os.release().endsWith('Microsoft')) {
        args.unshift(rcedit);
        rcedit = process.arch === 'x64' ? 'wine64' : 'wine';
        // Suppress "fixme:" stderr log messages
        spawnOptions.env.WINEDEBUG = '-all';
    }
    try {
        const child = (0, child_process_1.spawnSync)(rcedit, args, spawnOptions);
        const result = (_a = child.output) === null || _a === void 0 ? void 0 : _a.toString().split(',wine: ')[0];
        return result.startsWith(',') ? result.substr(1) : result;
    }
    catch {
        return undefined;
    }
}
//# sourceMappingURL=rceditGet.js.map