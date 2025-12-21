/**
 * PWA (Progressive Web App) 支持
 * 解析 Web App Manifest，提取应用信息
 */

import axios from 'axios';
import * as log from 'loglevel';

export interface WebAppManifest {
  name?: string;
  short_name?: string;
  description?: string;
  start_url?: string;
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation?: string;
  theme_color?: string;
  background_color?: string;
  icons?: Array<{
    src: string;
    sizes?: string;
    type?: string;
    purpose?: string;
  }>;
  scope?: string;
  lang?: string;
  categories?: string[];
}

export interface PWAInfo {
  manifest?: WebAppManifest;
  manifestUrl?: string;
  themeColor?: string;
  appleTouchIcon?: string;
  favicon?: string;
  title?: string;
  description?: string;
}

/**
 * 从 HTML 中提取属性值
 */
function extractAttr(html: string, tagPattern: RegExp, attr: string): string | undefined {
  const match = html.match(tagPattern);
  if (match) {
    const attrMatch = match[0].match(new RegExp(`${attr}=["']([^"']+)["']`, 'i'));
    return attrMatch?.[1];
  }
  return undefined;
}

/**
 * 从 HTML 中提取 manifest 链接
 */
function extractManifestUrl(html: string, baseUrl: string): string | undefined {
  const match = html.match(/<link[^>]*rel=["']manifest["'][^>]*>/i);
  if (match) {
    const href = extractAttr(match[0], /.*/, 'href');
    if (href) {
      try {
        return new URL(href, baseUrl).href;
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

/**
 * 从 HTML 中提取 PWA 相关信息
 */
function extractPWAInfoFromHtml(html: string, baseUrl: string): Partial<PWAInfo> {
  const info: Partial<PWAInfo> = {};

  // 主题色
  const themeColorMatch = html.match(/<meta[^>]*name=["']theme-color["'][^>]*>/i);
  if (themeColorMatch) {
    info.themeColor = extractAttr(themeColorMatch[0], /.*/, 'content');
  }

  // Apple Touch Icon
  const appleTouchMatch = html.match(/<link[^>]*rel=["']apple-touch-icon[^"']*["'][^>]*>/i);
  if (appleTouchMatch) {
    const href = extractAttr(appleTouchMatch[0], /.*/, 'href');
    if (href) {
      try {
        info.appleTouchIcon = new URL(href, baseUrl).href;
      } catch { /* ignore */ }
    }
  }

  // Favicon
  const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i);
  if (faviconMatch) {
    const href = extractAttr(faviconMatch[0], /.*/, 'href');
    if (href) {
      try {
        info.favicon = new URL(href, baseUrl).href;
      } catch { /* ignore */ }
    }
  }

  // 标题
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    info.title = titleMatch[1].trim();
  }

  // 描述
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*>/i);
  if (descMatch) {
    info.description = extractAttr(descMatch[0], /.*/, 'content');
  }

  return info;
}

/**
 * 获取网站的 PWA 信息
 */
export async function fetchPWAInfo(url: string): Promise<PWAInfo> {
  const info: PWAInfo = {};

  try {
    // 获取 HTML
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = response.data as string;
    Object.assign(info, extractPWAInfoFromHtml(html, url));

    // 查找并获取 manifest
    const manifestUrl = extractManifestUrl(html, url);
    if (manifestUrl) {
      info.manifestUrl = manifestUrl;
      try {
        const manifestResponse = await axios.get(manifestUrl, { timeout: 5000 });
        info.manifest = manifestResponse.data as WebAppManifest;
        log.debug('Found PWA manifest:', manifestUrl);
      } catch (err) {
        log.debug('Failed to fetch manifest:', err);
      }
    }

  } catch (err) {
    log.debug('Failed to fetch PWA info:', err);
  }

  return info;
}

/**
 * 从 PWA 信息中获取最佳图标 URL
 */
export function getBestIconFromManifest(manifest: WebAppManifest, baseUrl: string): string | undefined {
  if (!manifest.icons || manifest.icons.length === 0) {
    return undefined;
  }

  // 按尺寸排序，优先选择大图标
  const sortedIcons = [...manifest.icons].sort((a, b) => {
    const sizeA = parseInt(a.sizes?.split('x')[0] || '0', 10);
    const sizeB = parseInt(b.sizes?.split('x')[0] || '0', 10);
    return sizeB - sizeA;
  });

  // 优先选择 purpose 为 any 或 maskable 的图标
  const preferredIcon = sortedIcons.find(
    (icon) => !icon.purpose || icon.purpose === 'any' || icon.purpose.includes('any')
  ) || sortedIcons[0];

  try {
    return new URL(preferredIcon.src, baseUrl).href;
  } catch {
    return preferredIcon.src;
  }
}

/**
 * 将 PWA manifest 的 display 模式转换为 Nativefier 选项
 */
export function pwaDisplayToOptions(display?: string): Partial<{
  fullScreen: boolean;
  hideWindowFrame: boolean;
}> {
  switch (display) {
    case 'fullscreen':
      return { fullScreen: true };
    case 'standalone':
      return { hideWindowFrame: false };
    case 'minimal-ui':
      return { hideWindowFrame: false };
    default:
      return {};
  }
}

/**
 * 从 PWA 信息生成 Nativefier 选项建议
 */
export function pwaInfoToOptions(info: PWAInfo, baseUrl: string): Partial<{
  name: string;
  icon: string;
  backgroundColor: string;
  fullScreen: boolean;
  hideWindowFrame: boolean;
}> {
  const options: Partial<{
    name: string;
    icon: string;
    backgroundColor: string;
    fullScreen: boolean;
    hideWindowFrame: boolean;
  }> = {};

  if (info.manifest) {
    // 名称
    if (info.manifest.short_name) {
      options.name = info.manifest.short_name;
    } else if (info.manifest.name) {
      options.name = info.manifest.name;
    }

    // 图标
    const iconUrl = getBestIconFromManifest(info.manifest, baseUrl);
    if (iconUrl) {
      options.icon = iconUrl;
    }

    // 背景色
    if (info.manifest.background_color) {
      options.backgroundColor = info.manifest.background_color;
    } else if (info.manifest.theme_color) {
      options.backgroundColor = info.manifest.theme_color;
    }

    // 显示模式
    Object.assign(options, pwaDisplayToOptions(info.manifest.display));
  }

  // 如果 manifest 没有图标，使用 Apple Touch Icon 或 favicon
  if (!options.icon) {
    if (info.appleTouchIcon) {
      options.icon = info.appleTouchIcon;
    } else if (info.favicon) {
      options.icon = info.favicon;
    }
  }

  // 如果没有名称，使用页面标题
  if (!options.name && info.title) {
    options.name = info.title;
  }

  // 如果没有背景色，使用主题色
  if (!options.backgroundColor && info.themeColor) {
    options.backgroundColor = info.themeColor;
  }

  return options;
}
