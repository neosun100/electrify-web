/**
 * 交互式向导模式
 * 通过问答方式引导用户配置应用
 */
import { RawOptions } from '../../shared/src/options/model';
/**
 * 运行交互式向导
 */
export declare function runWizard(): Promise<RawOptions>;
/**
 * 快速模式 - 只询问必要问题
 */
export declare function runQuickWizard(url?: string): Promise<RawOptions>;
