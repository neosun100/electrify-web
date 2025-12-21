/**
 * 自动登录脚本生成器
 * 生成用于自动填充登录表单的 JS 脚本
 *
 * 安全说明：
 * - 凭据使用 Base64 编码（非加密）
 * - 脚本仅在构建时生成，凭据不会保存到源代码
 * - 建议仅用于内部/私有应用
 */
/**
 * 生成自动登录脚本
 */
export declare function generateAutoLoginScript(username: string, password: string): string;
/**
 * 解析自动登录凭据
 * 格式: username:password
 */
export declare function parseAutoLogin(autoLoginStr: string): {
    username: string;
    password: string;
} | null;
/**
 * 创建自动登录注入脚本文件
 */
export declare function createAutoLoginInjectFile(autoLoginStr: string): string | null;
