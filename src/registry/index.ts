import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import log from 'loglevel';

export interface AppRecord {
  name: string;
  url: string;
  path: string;
  platform: string;
  arch: string;
  createdAt: string;
  version: string;
}

interface Registry {
  apps: AppRecord[];
}

function getRegistryPath(): string {
  const configDir = path.join(os.homedir(), '.electrify-web');
  fs.ensureDirSync(configDir);
  return path.join(configDir, 'registry.json');
}

function loadRegistry(): Registry {
  const registryPath = getRegistryPath();
  if (fs.existsSync(registryPath)) {
    try {
      return fs.readJsonSync(registryPath);
    } catch {
      return { apps: [] };
    }
  }
  return { apps: [] };
}

function saveRegistry(registry: Registry): void {
  fs.writeJsonSync(getRegistryPath(), registry, { spaces: 2 });
}

export function registerApp(app: AppRecord): void {
  const registry = loadRegistry();
  // 移除同名旧记录
  registry.apps = registry.apps.filter(a => a.name !== app.name || a.path !== app.path);
  registry.apps.push(app);
  saveRegistry(registry);
  log.info(`📝 App registered: ${app.name}`);
}

export function listApps(): AppRecord[] {
  return loadRegistry().apps;
}

export function findApp(name: string): AppRecord | undefined {
  const registry = loadRegistry();
  return registry.apps.find(a => a.name.toLowerCase() === name.toLowerCase());
}

export function removeAppFromRegistry(name: string): AppRecord | undefined {
  const registry = loadRegistry();
  const app = registry.apps.find(a => a.name.toLowerCase() === name.toLowerCase());
  if (app) {
    registry.apps = registry.apps.filter(a => a.name.toLowerCase() !== name.toLowerCase());
    saveRegistry(registry);
  }
  return app;
}

export function getAppDataPath(appName: string): string {
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
function findAppPath(app: AppRecord): string | null {
  // 原路径存在，直接返回
  if (fs.existsSync(app.path)) {
    return app.path;
  }

  // 根据平台在常见位置查找
  const possiblePaths: string[] = [];
  
  if (process.platform === 'darwin') {
    // macOS: 用户可能把 .app 拖到 Applications
    possiblePaths.push(
      path.join('/Applications', `${app.name}.app`),
      path.join(os.homedir(), 'Applications', `${app.name}.app`),
      // 也可能是文件夹形式
      path.join('/Applications', `${app.name}-darwin-arm64`),
      path.join('/Applications', `${app.name}-darwin-x64`),
    );
  } else if (process.platform === 'linux') {
    possiblePaths.push(
      path.join(os.homedir(), '.local', 'share', 'applications', app.name),
      path.join('/opt', app.name),
    );
  }
  // Windows: 用户通常不移动，不额外查找

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      log.info(`📍 Found app at new location: ${p}`);
      return p;
    }
  }

  return null;
}

export function uninstallApp(name: string, purge: boolean = false): { success: boolean; message: string } {
  const app = findApp(name);
  if (!app) {
    return { success: false, message: `App "${name}" not found in registry. Only apps created by eweb can be managed.` };
  }

  // 查找应用实际路径
  const actualPath = findAppPath(app);
  
  if (actualPath) {
    fs.removeSync(actualPath);
    log.info(`🗑️  Removed app: ${actualPath}`);
  } else {
    log.warn(`⚠️  App folder not found at original or common locations.`);
    log.warn(`   Original path: ${app.path}`);
    log.warn(`   You may need to delete it manually.`);
  }

  // 清除用户数据
  if (purge) {
    const dataPath = getAppDataPath(app.name);
    if (fs.existsSync(dataPath)) {
      fs.removeSync(dataPath);
      log.info(`🗑️  Removed user data: ${dataPath}`);
    }
  }

  // 从注册表移除
  removeAppFromRegistry(name);
  
  return { success: true, message: `App "${name}" uninstalled successfully` };
}
