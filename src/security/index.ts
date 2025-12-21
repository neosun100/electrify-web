import * as log from 'loglevel';
import axios from 'axios';

interface ElectronRelease {
  version: string;
  chrome: string;
  node: string;
}

// 已知有严重漏洞的 Electron 版本 (CVE 数据)
const KNOWN_VULNERABLE_VERSIONS: Record<string, string[]> = {
  // 格式: 'major.minor': ['CVE-xxxx-xxxx', ...]
  '22.0': ['CVE-2023-4863'], // libwebp 漏洞
  '22.1': ['CVE-2023-4863'],
  '22.2': ['CVE-2023-4863'],
  '22.3': ['CVE-2023-4863'],
  '23.0': ['CVE-2023-4863'],
  '23.1': ['CVE-2023-4863'],
  '23.2': ['CVE-2023-4863'],
  '24.0': ['CVE-2023-4863'],
  '24.1': ['CVE-2023-4863'],
  '24.2': ['CVE-2023-4863'],
  '24.3': ['CVE-2023-4863'],
  '24.4': ['CVE-2023-4863'],
  '25.0': ['CVE-2023-4863'],
  '25.1': ['CVE-2023-4863'],
  '25.2': ['CVE-2023-4863'],
  '25.3': ['CVE-2023-4863'],
  '25.4': ['CVE-2023-4863'],
  '25.5': ['CVE-2023-4863'],
  '25.6': ['CVE-2023-4863'],
  // 25.7.0+ 已修复
};

// 推荐的安全版本
const RECOMMENDED_VERSIONS: Record<number, string> = {
  25: '25.9.8',
  26: '26.6.10',
  27: '27.3.11',
  28: '28.3.3',
  29: '29.4.6',
  30: '30.5.1',
  31: '31.7.7',
  32: '32.2.7',
  33: '33.4.0',
};

/**
 * 检查 Electron 版本安全性
 */
export function checkElectronSecurity(version: string): {
  safe: boolean;
  vulnerabilities: string[];
  recommendation?: string;
} {
  const parts = version.split('.');
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);
  const patch = parseInt(parts[2]?.split('-')[0] || '0', 10);
  const majorMinor = `${major}.${minor}`;

  const vulnerabilities = KNOWN_VULNERABLE_VERSIONS[majorMinor] || [];
  const safe = vulnerabilities.length === 0;

  let recommendation: string | undefined;
  if (!safe && RECOMMENDED_VERSIONS[major]) {
    recommendation = RECOMMENDED_VERSIONS[major];
  }

  return { safe, vulnerabilities, recommendation };
}

/**
 * 获取最新 Electron 版本
 */
export async function getLatestElectronVersion(): Promise<string | undefined> {
  try {
    const response = await axios.get<ElectronRelease[]>(
      'https://releases.electronjs.org/releases.json',
      { timeout: 5000 },
    );
    const stable = response.data.find((r) => !r.version.includes('-'));
    return stable?.version;
  } catch {
    return undefined;
  }
}

/**
 * 执行安全检查并输出警告
 */
export async function performSecurityCheck(
  electronVersion: string,
): Promise<void> {
  const result = checkElectronSecurity(electronVersion);

  if (!result.safe) {
    log.warn('\n' + '⚠️'.repeat(20));
    log.warn('🔴 SECURITY WARNING: Electron version has known vulnerabilities!');
    log.warn(`   Version: ${electronVersion}`);
    log.warn(`   CVEs: ${result.vulnerabilities.join(', ')}`);
    if (result.recommendation) {
      log.warn(`   Recommended: ${result.recommendation}`);
      log.warn(`   Use: --electron-version ${result.recommendation}`);
    }
    log.warn('⚠️'.repeat(20) + '\n');
  } else {
    log.debug(`✅ Electron ${electronVersion} has no known critical vulnerabilities`);
  }
}

/**
 * doctor 命令 - 检查系统环境
 */
export async function runDoctor(): Promise<{
  passed: boolean;
  checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; message: string }>;
}> {
  const checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; message: string }> = [];

  // 1. Node.js 版本检查
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  if (nodeMajor >= 18) {
    checks.push({ name: 'Node.js', status: 'pass', message: `${nodeVersion} ✓` });
  } else if (nodeMajor >= 16) {
    checks.push({ name: 'Node.js', status: 'warn', message: `${nodeVersion} (recommend 18+)` });
  } else {
    checks.push({ name: 'Node.js', status: 'fail', message: `${nodeVersion} (requires 16+)` });
  }

  // 2. npm 版本检查
  try {
    const { execSync } = await import('child_process');
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const npmMajor = parseInt(npmVersion.split('.')[0], 10);
    if (npmMajor >= 7) {
      checks.push({ name: 'npm', status: 'pass', message: `${npmVersion} ✓` });
    } else {
      checks.push({ name: 'npm', status: 'warn', message: `${npmVersion} (recommend 7+)` });
    }
  } catch {
    checks.push({ name: 'npm', status: 'fail', message: 'not found' });
  }

  // 3. 平台检查
  const platform = process.platform;
  checks.push({ name: 'Platform', status: 'pass', message: `${platform} (${process.arch})` });

  // 4. 磁盘空间检查 (简单检查)
  try {
    const { execSync } = await import('child_process');
    if (platform !== 'win32') {
      const df = execSync('df -h . | tail -1', { encoding: 'utf8' });
      const available = df.split(/\s+/)[3];
      checks.push({ name: 'Disk Space', status: 'pass', message: `${available} available` });
    }
  } catch {
    checks.push({ name: 'Disk Space', status: 'warn', message: 'unable to check' });
  }

  // 5. 网络连接检查
  try {
    await axios.get('https://registry.npmjs.org', { timeout: 5000 });
    checks.push({ name: 'Network', status: 'pass', message: 'npm registry reachable ✓' });
  } catch {
    checks.push({ name: 'Network', status: 'warn', message: 'npm registry unreachable' });
  }

  // 6. Electron 缓存检查
  const os = await import('os');
  const path = await import('path');
  const fs = await import('fs');
  const electronCache = path.join(os.homedir(), '.electron');
  if (fs.existsSync(electronCache)) {
    const files = fs.readdirSync(electronCache);
    checks.push({ name: 'Electron Cache', status: 'pass', message: `${files.length} versions cached` });
  } else {
    checks.push({ name: 'Electron Cache', status: 'warn', message: 'no cache (first build will be slower)' });
  }

  const passed = checks.every((c) => c.status !== 'fail');
  return { passed, checks };
}
