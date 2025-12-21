/**
 * 配置文件系统
 * 支持 YAML 和 JSON 格式的配置文件
 */
import { RawOptions } from '../../shared/src/options/model';
export interface ConfigFile {
    app?: {
        name?: string;
        url?: string;
        icon?: string;
        version?: string;
    };
    window?: {
        width?: number;
        height?: number;
        minWidth?: number;
        minHeight?: number;
        maxWidth?: number;
        maxHeight?: number;
        x?: number;
        y?: number;
        fullScreen?: boolean;
        maximize?: boolean;
        hideWindowFrame?: boolean;
        alwaysOnTop?: boolean;
        titleBarStyle?: string;
        backgroundColor?: string;
    };
    behavior?: {
        singleInstance?: boolean;
        tray?: string | boolean;
        counter?: boolean;
        bounce?: boolean;
        fastQuit?: boolean;
        clearCache?: boolean;
        showMenuBar?: boolean;
        disableContextMenu?: boolean;
        disableDevTools?: boolean;
    };
    inject?: {
        css?: string[];
        js?: string[];
    };
    security?: {
        internalUrls?: string;
        blockExternalUrls?: boolean;
        strictInternalUrls?: boolean;
        ignoreCertificate?: boolean;
        insecure?: boolean;
    };
    network?: {
        proxyRules?: string;
        userAgent?: string;
        userAgentHonest?: boolean;
    };
    build?: {
        platform?: string;
        arch?: string;
        electronVersion?: string;
        out?: string;
        overwrite?: boolean;
        conceal?: boolean;
        portable?: boolean;
    };
    preset?: string;
    extends?: string;
}
/**
 * 加载配置文件
 */
export declare function loadConfigFile(configPath: string): ConfigFile;
/**
 * 自动发现配置文件
 */
export declare function findConfigFile(dir?: string): string | null;
/**
 * 将配置文件转换为 RawOptions
 */
export declare function configToOptions(config: ConfigFile): RawOptions;
/**
 * 生成配置文件模板
 */
export declare function generateConfigTemplate(format?: 'yaml' | 'json'): string;
/**
 * 从现有应用导出配置
 */
export declare function exportConfig(options: RawOptions, format?: 'yaml' | 'json'): string;
