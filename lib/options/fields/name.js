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
exports.name = name;
const log = __importStar(require("loglevel"));
const sanitizeFilename_1 = require("../../utils/sanitizeFilename");
const inferTitle_1 = require("../../infer/inferTitle");
const constants_1 = require("../../constants");
async function tryToInferName(targetUrl) {
    try {
        log.debug('Inferring name for', targetUrl);
        const pageTitle = await (0, inferTitle_1.inferTitle)(targetUrl);
        return pageTitle || constants_1.DEFAULT_APP_NAME;
    }
    catch (err) {
        log.warn(`Unable to automatically determine app name, falling back to '${constants_1.DEFAULT_APP_NAME}'.`, err);
        return constants_1.DEFAULT_APP_NAME;
    }
}
async function name(options) {
    let name = options.packager.name;
    if (!name) {
        name = await tryToInferName(options.packager.targetUrl);
    }
    return (0, sanitizeFilename_1.sanitizeFilename)(options.packager.platform, name);
}
//# sourceMappingURL=name.js.map