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
// extract-zip's bundled yauzl 2.10 silently fails to extract on Node 26+
// (electron-packager's zip extraction exits with no error, leaving an
// incomplete .app template). Replace it with a shell-out to the system
// `unzip`, which extracts reliably. Not applied on win32, where `unzip`
// isn't guaranteed to be on PATH.
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
if (process.platform !== 'win32') {
    const id = require.resolve('extract-zip');
    const patchedExtractZip = async function (zipPath, opts) {
        const dir = path.resolve(opts.dir);
        fs.mkdirSync(dir, { recursive: true });
        (0, child_process_1.execFileSync)('unzip', ['-qq', '-o', zipPath, '-d', dir], {
            stdio: 'inherit',
        });
    };
    require.cache[id] = {
        id,
        path: path.dirname(id),
        filename: id,
        loaded: true,
        exports: patchedExtractZip,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    };
}
//# sourceMappingURL=extractZipNodeCompat.js.map