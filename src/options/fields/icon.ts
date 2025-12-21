import * as log from 'loglevel';
import * as path from 'path';
import * as fs from 'fs-extra';

import { inferIcon } from '../../infer/inferIcon';
import { downloadFile, getTempDir } from '../../helpers/helpers';

type IconParams = {
  packager: {
    icon?: string;
    targetUrl: string;
    platform?: string;
  };
};

/**
 * 检查是否为网络 URL
 */
function isUrl(str: string): boolean {
  return str.startsWith('http://') || str.startsWith('https://');
}

/**
 * 下载网络图标到本地
 */
async function downloadIcon(iconUrl: string): Promise<string | undefined> {
  log.info(`📥 Downloading icon from ${iconUrl}...`);
  try {
    const result = await downloadFile(iconUrl);
    if (!result || !result.data) {
      log.warn('Failed to download icon: empty response');
      return undefined;
    }
    
    const tmpDir = getTempDir('icon');
    const ext = result.ext || path.extname(new URL(iconUrl).pathname) || '.png';
    const iconPath = path.join(tmpDir, `icon${ext}`);
    
    await fs.writeFile(iconPath, result.data);
    
    log.info(`✅ Icon downloaded to ${iconPath}`);
    return iconPath;
  } catch (err) {
    log.warn('Failed to download icon:', (err as Error).message);
    return undefined;
  }
}

export async function icon(options: IconParams): Promise<string | undefined> {
  // 如果指定了图标且是网络 URL，先下载
  if (options.packager.icon && isUrl(options.packager.icon)) {
    const downloadedIcon = await downloadIcon(options.packager.icon);
    if (downloadedIcon) {
      // 直接修改 options，返回下载的路径
      return downloadedIcon;
    } else {
      log.warn('Could not download icon, will try to infer from website');
      // 清空图标，让后面的逻辑去推断
      options.packager.icon = undefined;
    }
  }

  // 如果有本地图标，直接使用
  if (options.packager.icon) {
    log.debug('Got local icon from options. Using it, no inferring needed');
    return undefined;
  }

  // 尝试从网站推断图标
  if (!options.packager.platform) {
    log.error('No platform specified. Icon can not be inferred.');
    return undefined;
  }

  try {
    return await inferIcon(
      options.packager.targetUrl,
      options.packager.platform,
    );
  } catch (err: unknown) {
    // eslint-disable-next-line
    const errorUrl: string = (err as any)?.config?.url;
    log.warn(
      'Cannot automatically retrieve the app icon:',
      errorUrl ? `${(err as Error).message} on ${errorUrl}` : err,
    );
    return undefined;
  }
}
