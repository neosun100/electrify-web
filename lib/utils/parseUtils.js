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
exports.parseBoolean = parseBoolean;
exports.parseBooleanOrString = parseBooleanOrString;
exports.parseJson = parseJson;
const log = __importStar(require("loglevel"));
const helpers_1 = require("../helpers/helpers");
function parseBoolean(val, _default) {
    if (val === undefined) {
        return _default;
    }
    try {
        if (typeof val === 'boolean') {
            return val;
        }
        val = String(val);
        switch (val.toLocaleLowerCase()) {
            case 'true':
            case '1':
            case 'yes':
                return true;
            case 'false':
            case '0':
            case 'no':
                return false;
            default:
                return _default;
        }
    }
    catch {
        return _default;
    }
}
function parseBooleanOrString(val) {
    switch (val) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return val;
    }
}
function parseJson(val) {
    if (!val)
        return undefined;
    try {
        return JSON.parse(val);
    }
    catch (err) {
        const windowsShellHint = (0, helpers_1.isWindows)()
            ? `\n   In particular, Windows cmd doesn't have single quotes, so you have to use only double-quotes plus escaping: "{\\"someKey\\": \\"someValue\\"}"`
            : '';
        log.error(`Unable to parse JSON value: ${val}\n` +
            `JSON should look like {"someString": "someValue", "someBoolean": true, "someArray": [1,2,3]}.\n` +
            ` - Only double quotes are allowed, single quotes are not.\n` +
            ` - Learn how your shell behaves and escapes characters.${windowsShellHint}\n` +
            ` - If unsure, validate your JSON using an online service.`);
        throw err;
    }
}
//# sourceMappingURL=parseUtils.js.map