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
exports.getLatestFirefoxVersion = getLatestFirefoxVersion;
const axios_1 = __importDefault(require("axios"));
const log = __importStar(require("loglevel"));
const constants_1 = require("../../constants");
const FIREFOX_VERSIONS_URL = 'https://product-details.mozilla.org/1.0/firefox_versions.json';
async function getLatestFirefoxVersion(url = FIREFOX_VERSIONS_URL) {
    try {
        log.debug('Grabbing Firefox version data from', url);
        const response = await axios_1.default.get(url, { timeout: 5000 });
        if (response.status !== 200) {
            throw new Error(`Bad request: Status code ${response.status}`);
        }
        const firefoxVersions = response.data;
        log.debug(`Got latest Firefox version ${firefoxVersions.LATEST_FIREFOX_VERSION}`);
        return firefoxVersions.LATEST_FIREFOX_VERSION;
    }
    catch (err) {
        log.error('getLatestFirefoxVersion ERROR', err);
        log.debug('Falling back to default Firefox version', constants_1.DEFAULT_FIREFOX_VERSION);
        return constants_1.DEFAULT_FIREFOX_VERSION;
    }
}
//# sourceMappingURL=inferFirefoxVersion.js.map