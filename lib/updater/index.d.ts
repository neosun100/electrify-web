/**
 * 自动更新系统
 * 为生成的应用添加自动更新能力
 */
export interface UpdateConfig {
    provider: 'github' | 'generic' | 's3' | 'spaces';
    owner?: string;
    repo?: string;
    url?: string;
    channel?: 'latest' | 'beta' | 'alpha';
    allowDowngrade?: boolean;
    allowPrerelease?: boolean;
}
/**
 * 生成 electron-updater 配置
 */
export declare function generateUpdaterConfig(config: UpdateConfig): Record<string, unknown>;
/**
 * 生成自动更新的主进程代码
 */
export declare function generateAutoUpdateCode(config: UpdateConfig): string;
/**
 * 生成简化版更新检查代码（不依赖 electron-updater）
 */
export declare function generateSimpleUpdateChecker(updateUrl: string): string;
/**
 * 将更新代码注入到应用中
 */
export declare function injectAutoUpdate(appPath: string, config: UpdateConfig | string): void;
/**
 * 解析更新配置字符串
 * 格式: github:owner/repo 或 https://update-server.com/updates
 */
export declare function parseUpdateConfig(configStr: string): UpdateConfig | string;
