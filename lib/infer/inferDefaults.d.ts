/**
 * 根据 URL 推断最佳预设
 */
export declare function inferPresetFromUrl(url: string): string | undefined;
/**
 * 根据 URL 推断应用名称
 */
export declare function inferNameFromUrl(url: string): string | undefined;
/**
 * 智能推荐配置
 */
export declare function getSmartDefaults(url: string): {
    preset?: string;
    name?: string;
    suggestions: string[];
};
/**
 * 输出智能推荐信息
 */
export declare function logSmartDefaults(url: string, currentPreset?: string): void;
/**
 * 获取 PWA 信息并生成建议选项
 */
export declare function inferFromPWA(url: string): Promise<{
    name?: string;
    icon?: string;
    backgroundColor?: string;
    hasPWA: boolean;
}>;
/**
 * 输出 PWA 检测信息
 */
export declare function logPWAInfo(url: string): Promise<void>;
