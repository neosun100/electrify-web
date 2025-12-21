/**
 * 检查 Electron 版本安全性
 */
export declare function checkElectronSecurity(version: string): {
    safe: boolean;
    vulnerabilities: string[];
    recommendation?: string;
};
/**
 * 获取最新 Electron 版本
 */
export declare function getLatestElectronVersion(): Promise<string | undefined>;
/**
 * 执行安全检查并输出警告
 */
export declare function performSecurityCheck(electronVersion: string): Promise<void>;
/**
 * doctor 命令 - 检查系统环境
 */
export declare function runDoctor(): Promise<{
    passed: boolean;
    checks: Array<{
        name: string;
        status: 'pass' | 'warn' | 'fail';
        message: string;
    }>;
}>;
