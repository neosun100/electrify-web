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
exports.registerApp = registerApp;
exports.listApps = listApps;
exports.findApp = findApp;
exports.removeAppFromRegistry = removeAppFromRegistry;
exports.getAppDataPath = getAppDataPath;
exports.uninstallApp = uninstallApp;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const loglevel_1 = __importDefault(require("loglevel"));
function getRegistryPath() {
    const configDir = path.join(os.homedir(), '.electrify-web');
    fs.ensureDirSync(configDir);
    return path.join(configDir, 'registry.json');
}
function loadRegistry() {
    const registryPath = getRegistryPath();
    if (fs.existsSync(registryPath)) {
        try {
            return fs.readJsonSync(registryPath);
        }
        catch {
            return { apps: [] };
        }
    }
    return { apps: [] };
}
function saveRegistry(registry) {
    fs.writeJsonSync(getRegistryPath(), registry, { spaces: 2 });
}
function registerApp(app) {
    const registry = loadRegistry();
    // 移除同名旧记录
    registry.apps = registry.apps.filter(a => a.name !== app.name || a.path !== app.path);
    registry.apps.push(app);
    saveRegistry(registry);
    loglevel_1.default.info(`📝 App registered: ${app.name}`);
}
function listApps() {
    const registry = loadRegistry();
    // 自动清理无效记录（应用已被手动删除）
    const validApps = [];
    const invalidApps = [];
    for (const app of registry.apps) {
        const actualPath = findAppPath(app);
        if (actualPath) {
            // 更新路径（如果应用被移动了）
            if (actualPath !== app.path) {
                app.path = actualPath;
            }
            validApps.push(app);
        }
        else {
            invalidApps.push(app);
        }
    }
    // 如果有无效记录，清理并保存
    if (invalidApps.length > 0) {
        registry.apps = validApps;
        saveRegistry(registry);
        invalidApps.forEach(app => {
            loglevel_1.default.info(`🧹 Cleaned up stale record: ${app.name} (app was manually deleted)`);
        });
    }
    return validApps;
}
function findApp(name) {
    const registry = loadRegistry();
    return registry.apps.find(a => a.name.toLowerCase() === name.toLowerCase());
}
function removeAppFromRegistry(name) {
    const registry = loadRegistry();
    const app = registry.apps.find(a => a.name.toLowerCase() === name.toLowerCase());
    if (app) {
        registry.apps = registry.apps.filter(a => a.name.toLowerCase() !== name.toLowerCase());
        saveRegistry(registry);
    }
    return app;
}
function getAppDataPath(appName) {
    switch (process.platform) {
        case 'darwin':
            return path.join(os.homedir(), 'Library', 'Application Support', appName);
        case 'win32':
            return path.join(process.env.APPDATA || '', appName);
        default:
            return path.join(os.homedir(), '.config', appName);
    }
}
/**
 * 查找应用的实际路径（处理用户移动应用的情况）
 * 只在注册表中已记录的应用才会查找
 */
function findAppPath(app) {
    // 原路径存在，直接返回
    if (fs.existsSync(app.path)) {
        return app.path;
    }
    // 根据平台在常见位置查找
    const possiblePaths = [];
    if (process.platform === 'darwin') {
        // macOS: 用户可能把 .app 拖到 Applications
        possiblePaths.push(path.join('/Applications', `${app.name}.app`), path.join(os.homedir(), 'Applications', `${app.name}.app`), 
        // 也可能是文件夹形式
        path.join('/Applications', `${app.name}-darwin-arm64`), path.join('/Applications', `${app.name}-darwin-x64`));
    }
    else if (process.platform === 'linux') {
        possiblePaths.push(path.join(os.homedir(), '.local', 'share', 'applications', app.name), path.join('/opt', app.name));
    }
    // Windows: 用户通常不移动，不额外查找
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            loglevel_1.default.info(`📍 Found app at new location: ${p}`);
            return p;
        }
    }
    return null;
}
function uninstallApp(name, purge = false) {
    const app = findApp(name);
    if (!app) {
        return { success: false, message: `App "${name}" not found in registry. Only apps created by eweb can be managed.` };
    }
    // 查找应用实际路径
    const actualPath = findAppPath(app);
    if (actualPath) {
        fs.removeSync(actualPath);
        loglevel_1.default.info(`🗑️  Removed app: ${actualPath}`);
    }
    else {
        loglevel_1.default.warn(`⚠️  App folder not found at original or common locations.`);
        loglevel_1.default.warn(`   Original path: ${app.path}`);
        loglevel_1.default.warn(`   You may need to delete it manually.`);
    }
    // 清除用户数据
    if (purge) {
        const dataPath = getAppDataPath(app.name);
        if (fs.existsSync(dataPath)) {
            fs.removeSync(dataPath);
            loglevel_1.default.info(`🗑️  Removed user data: ${dataPath}`);
        }
    }
    // 从注册表移除
    removeAppFromRegistry(name);
    return { success: true, message: `App "${name}" uninstalled successfully` };
}
//# sourceMappingURL=index.js.map