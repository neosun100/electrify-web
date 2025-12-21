/**
 * 配置预设系统
 * 为常见使用场景提供优化的默认配置
 */
import { RawOptions } from '../../shared/src/options/model';
export interface Preset {
    name: string;
    description: string;
    options: Partial<RawOptions>;
}
export declare const presets: Record<string, Preset>;
/**
 * 获取预设配置
 */
export declare function getPreset(name: string): Preset | undefined;
/**
 * 列出所有可用预设
 */
export declare function listPresets(): Preset[];
/**
 * 应用预设到选项
 */
export declare function applyPreset(options: RawOptions, presetName: string): RawOptions;
/**
 * 根据 URL 智能推荐预设
 */
export declare function suggestPreset(url: string): string | undefined;
