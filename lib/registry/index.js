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
    return loadRegistry().apps;
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
function uninstallApp(name, purge = false) {
    const app = findApp(name);
    if (!app) {
        return { success: false, message: `App "${name}" not found in registry` };
    }
    // 删除应用文件夹
    if (fs.existsSync(app.path)) {
        fs.removeSync(app.path);
        loglevel_1.default.info(`🗑️  Removed app folder: ${app.path}`);
    }
    else {
        loglevel_1.default.warn(`⚠️  App folder not found: ${app.path}`);
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