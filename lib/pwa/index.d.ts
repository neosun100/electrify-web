/**
 * PWA (Progressive Web App) 支持
 * 解析 Web App Manifest，提取应用信息
 */
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
 * 获取网站的 PWA 信息
 */
export declare function fetchPWAInfo(url: string): Promise<PWAInfo>;
/**
 * 从 PWA 信息中获取最佳图标 URL
 */
export declare function getBestIconFromManifest(manifest: WebAppManifest, baseUrl: string): string | undefined;
/**
 * 将 PWA manifest 的 display 模式转换为 Nativefier 选项
 */
export declare function pwaDisplayToOptions(display?: string): Partial<{
    fullScreen: boolean;
    hideWindowFrame: boolean;
}>;
/**
 * 从 PWA 信息生成 Nativefier 选项建议
 */
export declare function pwaInfoToOptions(info: PWAInfo, baseUrl: string): Partial<{
    name: string;
    icon: string;
    backgroundColor: string;
    fullScreen: boolean;
    hideWindowFrame: boolean;
}>;
