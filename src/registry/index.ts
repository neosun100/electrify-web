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

export function uninstallApp(name: string, purge: boolean = false): { success: boolean; message: string } {
  const app = findApp(name);
  if (!app) {
    return { success: false, message: `App "${name}" not found in registry` };
  }

  // 删除应用文件夹
  if (fs.existsSync(app.path)) {
    fs.removeSync(app.path);
    log.info(`🗑️  Removed app folder: ${app.path}`);
  } else {
    log.warn(`⚠️  App folder not found: ${app.path}`);
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
