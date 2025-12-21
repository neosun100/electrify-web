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
exports.checkElectronSecurity = checkElectronSecurity;
exports.getLatestElectronVersion = getLatestElectronVersion;
exports.performSecurityCheck = performSecurityCheck;
exports.runDoctor = runDoctor;
const log = __importStar(require("loglevel"));
const axios_1 = __importDefault(require("axios"));
// 已知有严重漏洞的 Electron 版本 (CVE 数据)
const KNOWN_VULNERABLE_VERSIONS = {
    // 格式: 'major.minor': ['CVE-xxxx-xxxx', ...]
    '22.0': ['CVE-2023-4863'], // libwebp 漏洞
    '22.1': ['CVE-2023-4863'],
    '22.2': ['CVE-2023-4863'],
    '22.3': ['CVE-2023-4863'],
    '23.0': ['CVE-2023-4863'],
    '23.1': ['CVE-2023-4863'],
    '23.2': ['CVE-2023-4863'],
    '24.0': ['CVE-2023-4863'],
    '24.1': ['CVE-2023-4863'],
    '24.2': ['CVE-2023-4863'],
    '24.3': ['CVE-2023-4863'],
    '24.4': ['CVE-2023-4863'],
    '25.0': ['CVE-2023-4863'],
    '25.1': ['CVE-2023-4863'],
    '25.2': ['CVE-2023-4863'],
    '25.3': ['CVE-2023-4863'],
    '25.4': ['CVE-2023-4863'],
    '25.5': ['CVE-2023-4863'],
    '25.6': ['CVE-2023-4863'],
    // 25.7.0+ 已修复
};
// 推荐的安全版本
const RECOMMENDED_VERSIONS = {
    25: '25.9.8',
    26: '26.6.10',
    27: '27.3.11',
    28: '28.3.3',
    29: '29.4.6',
    30: '30.5.1',
    31: '31.7.7',
    32: '32.2.7',
    33: '33.4.0',
};
/**
 * 检查 Electron 版本安全性
 */
function checkElectronSecurity(version) {
    var _a;
    const parts = version.split('.');
    const major = parseInt(parts[0], 10);
    const minor = parseInt(parts[1], 10);
    const patch = parseInt(((_a = parts[2]) === null || _a === void 0 ? void 0 : _a.split('-')[0]) || '0', 10);
    const majorMinor = `${major}.${minor}`;
    const vulnerabilities = KNOWN_VULNERABLE_VERSIONS[majorMinor] || [];
    const safe = vulnerabilities.length === 0;
    let recommendation;
    if (!safe && RECOMMENDED_VERSIONS[major]) {
        recommendation = RECOMMENDED_VERSIONS[major];
    }
    return { safe, vulnerabilities, recommendation };
}
/**
 * 获取最新 Electron 版本
 */
async function getLatestElectronVersion() {
    try {
        const response = await axios_1.default.get('https://releases.electronjs.org/releases.json', { timeout: 5000 });
        const stable = response.data.find((r) => !r.version.includes('-'));
        return stable === null || stable === void 0 ? void 0 : stable.version;
    }
    catch {
        return undefined;
    }
}
/**
 * 执行安全检查并输出警告
 */
async function performSecurityCheck(electronVersion) {
    const result = checkElectronSecurity(electronVersion);
    if (!result.safe) {
        log.warn('\n' + '⚠️'.repeat(20));
        log.warn('🔴 SECURITY WARNING: Electron version has known vulnerabilities!');
        log.warn(`   Version: ${electronVersion}`);
        log.warn(`   CVEs: ${result.vulnerabilities.join(', ')}`);
        if (result.recommendation) {
            log.warn(`   Recommended: ${result.recommendation}`);
            log.warn(`   Use: --electron-version ${result.recommendation}`);
        }
        log.warn('⚠️'.repeat(20) + '\n');
    }
    else {
        log.debug(`✅ Electron ${electronVersion} has no known critical vulnerabilities`);
    }
}
/**
 * doctor 命令 - 检查系统环境
 */
async function runDoctor() {
    const checks = [];
    // 1. Node.js 版本检查
    const nodeVersion = process.version;
    const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0], 10);
    if (nodeMajor >= 18) {
        checks.push({ name: 'Node.js', status: 'pass', message: `${nodeVersion} ✓` });
    }
    else if (nodeMajor >= 16) {
        checks.push({ name: 'Node.js', status: 'warn', message: `${nodeVersion} (recommend 18+)` });
    }
    else {
        checks.push({ name: 'Node.js', status: 'fail', message: `${nodeVersion} (requires 16+)` });
    }
    // 2. npm 版本检查
    try {
        const { execSync } = await Promise.resolve().then(() => __importStar(require('child_process')));
        const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        const npmMajor = parseInt(npmVersion.split('.')[0], 10);
        if (npmMajor >= 7) {
            checks.push({ name: 'npm', status: 'pass', message: `${npmVersion} ✓` });
        }
        else {
            checks.push({ name: 'npm', status: 'warn', message: `${npmVersion} (recommend 7+)` });
        }
    }
    catch {
        checks.push({ name: 'npm', status: 'fail', message: 'not found' });
    }
    // 3. 平台检查
    const platform = process.platform;
    checks.push({ name: 'Platform', status: 'pass', message: `${platform} (${process.arch})` });
    // 4. 磁盘空间检查 (简单检查)
    try {
        const { execSync } = await Promise.resolve().then(() => __importStar(require('child_process')));
        if (platform !== 'win32') {
            const df = execSync('df -h . | tail -1', { encoding: 'utf8' });
            const available = df.split(/\s+/)[3];
            checks.push({ name: 'Disk Space', status: 'pass', message: `${available} available` });
        }
    }
    catch {
        checks.push({ name: 'Disk Space', status: 'warn', message: 'unable to check' });
    }
    // 5. 网络连接检查
    try {
        await axios_1.default.get('https://registry.npmjs.org', { timeout: 5000 });
        checks.push({ name: 'Network', status: 'pass', message: 'npm registry reachable ✓' });
    }
    catch {
        checks.push({ name: 'Network', status: 'warn', message: 'npm registry unreachable' });
    }
    // 6. Electron 缓存检查
    const os = await Promise.resolve().then(() => __importStar(require('os')));
    const path = await Promise.resolve().then(() => __importStar(require('path')));
    const fs = await Promise.resolve().then(() => __importStar(require('fs')));
    const electronCache = path.join(os.homedir(), '.electron');
    if (fs.existsSync(electronCache)) {
        const files = fs.readdirSync(electronCache);
        checks.push({ name: 'Electron Cache', status: 'pass', message: `${files.length} versions cached` });
    }
    else {
        checks.push({ name: 'Electron Cache', status: 'warn', message: 'no cache (first build will be slower)' });
    }
    const passed = checks.every((c) => c.status !== 'fail');
    return { passed, checks };
}
//# sourceMappingURL=index.js.map