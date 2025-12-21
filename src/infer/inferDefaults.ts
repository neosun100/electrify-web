import * as log from 'loglevel';
import { fetchPWAInfo, pwaInfoToOptions, PWAInfo } from '../pwa';

/**
 * URL 到预设的映射规则
 */
const URL_PRESET_RULES: Array<{
  patterns: RegExp[];
  preset: string;
  name?: string;
}> = [
  // 社交媒体
  {
    patterns: [
      /whatsapp\.com/i,
      /telegram\.org/i,
      /discord\.com/i,
      /slack\.com/i,
      /messenger\.com/i,
      /signal\.org/i,
      /wechat\.com/i,
      /weixin\.qq\.com/i,
    ],
    preset: 'social',
  },
  // 邮件
  {
    patterns: [
      /mail\.google\.com/i,
      /outlook\.(live|office)\.com/i,
      /mail\.yahoo\.com/i,
      /proton\.me/i,
      /protonmail\.com/i,
      /fastmail\.com/i,
      /mail\.\w+\.\w+/i,
    ],
    preset: 'email',
  },
  // 生产力工具
  {
    patterns: [
      /notion\.so/i,
      /trello\.com/i,
      /asana\.com/i,
      /monday\.com/i,
      /clickup\.com/i,
      /airtable\.com/i,
      /coda\.io/i,
      /basecamp\.com/i,
      /todoist\.com/i,
      /evernote\.com/i,
      /onenote\.com/i,
      /docs\.google\.com/i,
      /sheets\.google\.com/i,
      /drive\.google\.com/i,
      /dropbox\.com/i,
      /figma\.com/i,
      /miro\.com/i,
      /canva\.com/i,
    ],
    preset: 'productivity',
  },
  // 媒体/流媒体
  {
    patterns: [
      /youtube\.com/i,
      /netflix\.com/i,
      /spotify\.com/i,
      /music\.apple\.com/i,
      /soundcloud\.com/i,
      /twitch\.tv/i,
      /bilibili\.com/i,
      /youku\.com/i,
      /iqiyi\.com/i,
      /disneyplus\.com/i,
      /hulu\.com/i,
      /primevideo\.com/i,
      /hbomax\.com/i,
      /pandora\.com/i,
      /deezer\.com/i,
      /tidal\.com/i,
    ],
    preset: 'media',
  },
  // 开发者工具
  {
    patterns: [
      /github\.com/i,
      /gitlab\.com/i,
      /bitbucket\.org/i,
      /jira\./i,
      /atlassian\./i,
      /stackoverflow\.com/i,
      /codepen\.io/i,
      /codesandbox\.io/i,
      /replit\.com/i,
      /vercel\.com/i,
      /netlify\.com/i,
      /heroku\.com/i,
      /aws\.amazon\.com/i,
      /console\.cloud\.google\.com/i,
      /portal\.azure\.com/i,
      /docker\./i,
      /kubernetes\./i,
    ],
    preset: 'developer',
  },
];

/**
 * 根据 URL 推断最佳预设
 */
export function inferPresetFromUrl(url: string): string | undefined {
  for (const rule of URL_PRESET_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(url)) {
        return rule.preset;
      }
    }
  }
  return undefined;
}

/**
 * 根据 URL 推断应用名称
 */
export function inferNameFromUrl(url: string): string | undefined {
  const knownNames: Record<string, string> = {
    'web.whatsapp.com': 'WhatsApp',
    'whatsapp.com': 'WhatsApp',
    'telegram.org': 'Telegram',
    'web.telegram.org': 'Telegram',
    'discord.com': 'Discord',
    'slack.com': 'Slack',
    'mail.google.com': 'Gmail',
    'outlook.live.com': 'Outlook',
    'outlook.office.com': 'Outlook',
    'notion.so': 'Notion',
    'trello.com': 'Trello',
    'github.com': 'GitHub',
    'gitlab.com': 'GitLab',
    'youtube.com': 'YouTube',
    'netflix.com': 'Netflix',
    'spotify.com': 'Spotify',
    'twitter.com': 'Twitter',
    'x.com': 'X',
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'linkedin.com': 'LinkedIn',
    'reddit.com': 'Reddit',
    'twitch.tv': 'Twitch',
    'bilibili.com': 'Bilibili',
    'figma.com': 'Figma',
    'canva.com': 'Canva',
  };

  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return knownNames[hostname];
  } catch {
    return undefined;
  }
}

/**
 * 智能推荐配置
 */
export function getSmartDefaults(url: string): {
  preset?: string;
  name?: string;
  suggestions: string[];
} {
  const preset = inferPresetFromUrl(url);
  const name = inferNameFromUrl(url);
  const suggestions: string[] = [];

  if (preset) {
    suggestions.push(`Detected app type: using "${preset}" preset`);
  }
  if (name) {
    suggestions.push(`Suggested name: "${name}"`);
  }

  return { preset, name, suggestions };
}

/**
 * 输出智能推荐信息
 */
export function logSmartDefaults(url: string, currentPreset?: string): void {
  if (currentPreset) return; // 用户已指定预设，不再推荐

  const defaults = getSmartDefaults(url);
  
  if (defaults.suggestions.length > 0) {
    log.info('💡 Smart suggestions:');
    defaults.suggestions.forEach((s) => log.info(`   ${s}`));
    if (defaults.preset) {
      log.info(`   Tip: Use --preset ${defaults.preset} for optimized settings\n`);
    }
  }
}


/**
 * 获取 PWA 信息并生成建议选项
 */
export async function inferFromPWA(url: string): Promise<{
  name?: string;
  icon?: string;
  backgroundColor?: string;
  hasPWA: boolean;
}> {
  try {
    const pwaInfo = await fetchPWAInfo(url);
    const options = pwaInfoToOptions(pwaInfo, url);
    
    return {
      name: options.name,
      icon: options.icon,
      backgroundColor: options.backgroundColor,
      hasPWA: !!pwaInfo.manifest,
    };
  } catch (err) {
    log.debug('Failed to fetch PWA info:', err);
    return { hasPWA: false };
  }
}

/**
 * 输出 PWA 检测信息
 */
export async function logPWAInfo(url: string): Promise<void> {
  try {
    const pwaInfo = await fetchPWAInfo(url);
    
    if (pwaInfo.manifest) {
      log.info('📱 PWA detected:');
      if (pwaInfo.manifest.name) {
        log.info(`   Name: ${pwaInfo.manifest.name}`);
      }
      if (pwaInfo.manifest.display) {
        log.info(`   Display: ${pwaInfo.manifest.display}`);
      }
      if (pwaInfo.manifest.icons?.length) {
        log.info(`   Icons: ${pwaInfo.manifest.icons.length} available`);
      }
      log.info('');
    }
  } catch {
    // 静默失败
  }
}
