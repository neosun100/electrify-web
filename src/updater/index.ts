/**
 * 自动更新系统
 * 为生成的应用添加自动更新能力
 */

import * as fs from 'fs';
import * as path from 'path';
import * as log from 'loglevel';

export interface UpdateConfig {
  // 更新服务器 URL
  provider: 'github' | 'generic' | 's3' | 'spaces';
  // GitHub 仓库 (provider=github 时)
  owner?: string;
  repo?: string;
  // 通用服务器 URL (provider=generic 时)
  url?: string;
  // 更新频道
  channel?: 'latest' | 'beta' | 'alpha';
  // 是否允许降级
  allowDowngrade?: boolean;
  // 是否允许预发布版本
  allowPrerelease?: boolean;
}

/**
 * 生成 electron-updater 配置
 */
export function generateUpdaterConfig(config: UpdateConfig): Record<string, unknown> {
  const baseConfig: Record<string, unknown> = {
    channel: config.channel || 'latest',
    allowDowngrade: config.allowDowngrade || false,
    allowPrerelease: config.allowPrerelease || false,
  };

  switch (config.provider) {
    case 'github':
      return {
        ...baseConfig,
        provider: 'github',
        owner: config.owner,
        repo: config.repo,
      };
    case 'generic':
      return {
        ...baseConfig,
        provider: 'generic',
        url: config.url,
      };
    case 's3':
      return {
        ...baseConfig,
        provider: 's3',
        bucket: config.url,
      };
    default:
      return baseConfig;
  }
}

/**
 * 生成自动更新的主进程代码
 */
export function generateAutoUpdateCode(config: UpdateConfig): string {
  const configJson = JSON.stringify(generateUpdaterConfig(config), null, 2);
  
  return `
// Auto-update functionality
const { autoUpdater } = require('electron-updater');
const { dialog, app } = require('electron');

// 配置更新器
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// 更新配置
const updateConfig = ${configJson};

// 设置更新源
if (updateConfig.provider === 'github') {
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: updateConfig.owner,
    repo: updateConfig.repo,
  });
} else if (updateConfig.provider === 'generic') {
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: updateConfig.url,
  });
}

// 检查更新
function checkForUpdates() {
  autoUpdater.checkForUpdates().catch((err) => {
    console.log('Update check failed:', err.message);
  });
}

// 更新事件处理
autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: \`A new version (\${info.version}) is available. Download now?\`,
    buttons: ['Yes', 'Later'],
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. The app will restart to install.',
    buttons: ['Restart Now', 'Later'],
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', (err) => {
  console.log('Auto-update error:', err.message);
});

// 应用启动后检查更新
app.whenReady().then(() => {
  // 延迟检查，避免影响启动速度
  setTimeout(checkForUpdates, 10000);
  
  // 每小时检查一次
  setInterval(checkForUpdates, 60 * 60 * 1000);
});

module.exports = { checkForUpdates };
`;
}

/**
 * 生成简化版更新检查代码（不依赖 electron-updater）
 */
export function generateSimpleUpdateChecker(updateUrl: string): string {
  return `
// Simple update checker (no electron-updater dependency)
const { net, dialog, shell, app } = require('electron');

const UPDATE_CHECK_URL = '${updateUrl}';
const CURRENT_VERSION = app.getVersion();

async function checkForUpdates() {
  try {
    const request = net.request(UPDATE_CHECK_URL);
    
    request.on('response', (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          const info = JSON.parse(data);
          if (info.version && info.version !== CURRENT_VERSION) {
            showUpdateDialog(info);
          }
        } catch (e) {
          console.log('Failed to parse update info:', e.message);
        }
      });
    });
    
    request.on('error', (err) => {
      console.log('Update check failed:', err.message);
    });
    
    request.end();
  } catch (err) {
    console.log('Update check error:', err.message);
  }
}

function showUpdateDialog(info) {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: \`A new version (\${info.version}) is available.\\n\\n\${info.releaseNotes || ''}\`,
    buttons: ['Download', 'Later'],
  }).then((result) => {
    if (result.response === 0 && info.downloadUrl) {
      shell.openExternal(info.downloadUrl);
    }
  });
}

// 启动后检查更新
setTimeout(checkForUpdates, 10000);

// 每 6 小时检查一次
setInterval(checkForUpdates, 6 * 60 * 60 * 1000);

module.exports = { checkForUpdates };
`;
}

/**
 * 将更新代码注入到应用中
 */
export function injectAutoUpdate(
  appPath: string,
  config: UpdateConfig | string,
): void {
  const updateCode = typeof config === 'string'
    ? generateSimpleUpdateChecker(config)
    : generateAutoUpdateCode(config);

  const updateFilePath = path.join(appPath, 'lib', 'autoUpdate.js');
  fs.writeFileSync(updateFilePath, updateCode);

  // 修改 main.js 引入更新模块
  const mainJsPath = path.join(appPath, 'lib', 'main.js');
  if (fs.existsSync(mainJsPath)) {
    let mainJs = fs.readFileSync(mainJsPath, 'utf-8');
    if (!mainJs.includes('autoUpdate')) {
      mainJs = `require('./autoUpdate');\n${mainJs}`;
      fs.writeFileSync(mainJsPath, mainJs);
      log.debug('Auto-update module injected into main.js');
    }
  }
}

/**
 * 解析更新配置字符串
 * 格式: github:owner/repo 或 https://update-server.com/updates
 */
export function parseUpdateConfig(configStr: string): UpdateConfig | string {
  if (configStr.startsWith('github:')) {
    const [owner, repo] = configStr.slice(7).split('/');
    return {
      provider: 'github',
      owner,
      repo,
    };
  }
  
  if (configStr.startsWith('http://') || configStr.startsWith('https://')) {
    // 简单 URL，使用简化版更新检查
    return configStr;
  }

  // 默认返回原始字符串作为 URL
  return configStr;
}
