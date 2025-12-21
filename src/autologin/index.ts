/**
 * 自动登录脚本生成器
 * 生成用于自动填充登录表单的 JS 脚本
 * 
 * 安全说明：
 * - 凭据使用 Base64 编码（非加密）
 * - 脚本仅在构建时生成，凭据不会保存到源代码
 * - 建议仅用于内部/私有应用
 */

import * as fs from 'fs';
import * as path from 'path';
import * as log from 'loglevel';
import { getTempDir } from '../helpers/helpers';

/**
 * 生成自动登录脚本
 */
export function generateAutoLoginScript(username: string, password: string): string {
  const encodedUsername = Buffer.from(username).toString('base64');
  const encodedPassword = Buffer.from(password).toString('base64');

  return `
(function() {
  'use strict';
  
  var AUTO_LOGIN_KEY = 'nativefier_auto_login_done';
  
  function decode(str) {
    return atob(str);
  }
  
  function simulateInput(element, value) {
    element.focus();
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
  
  function autoLogin() {
    if (sessionStorage.getItem(AUTO_LOGIN_KEY)) {
      console.log('[Nativefier] Auto-login already performed');
      return;
    }
    
    console.log('[Nativefier] Attempting auto-login...');
    
    setTimeout(function() {
      try {
        var usernameSelectors = [
          'input[type="text"]',
          'input[type="email"]',
          'input[name="username"]',
          'input[name="email"]',
          'input[id="username"]',
          'input[id="email"]',
          'input[name="user"]',
          'input[autocomplete="username"]'
        ];
        
        var usernameInput = null;
        for (var i = 0; i < usernameSelectors.length; i++) {
          usernameInput = document.querySelector(usernameSelectors[i]);
          if (usernameInput) break;
        }
        
        if (!usernameInput) {
          console.log('[Nativefier] Username field not found, may already be logged in');
          return;
        }
        
        var passwordInput = document.querySelector('input[type="password"]');
        if (!passwordInput) {
          console.log('[Nativefier] Password field not found');
          return;
        }
        
        simulateInput(usernameInput, decode('${encodedUsername}'));
        
        setTimeout(function() {
          simulateInput(passwordInput, decode('${encodedPassword}'));
          
          setTimeout(function() {
            var submitBtn = document.querySelector('button[type="submit"]') ||
                           document.querySelector('input[type="submit"]') ||
                           document.querySelector('button.login') ||
                           document.querySelector('button.btn-primary') ||
                           document.querySelector('form button');
            
            if (submitBtn) {
              console.log('[Nativefier] Clicking submit button...');
              submitBtn.click();
            } else {
              var form = usernameInput.closest('form');
              if (form) {
                console.log('[Nativefier] Submitting form...');
                form.submit();
              }
            }
            
            sessionStorage.setItem(AUTO_LOGIN_KEY, 'true');
            console.log('[Nativefier] Auto-login completed');
          }, 300);
        }, 300);
        
      } catch (err) {
        console.error('[Nativefier] Auto-login failed:', err);
      }
    }, 1500);
  }
  
  if (document.readyState === 'complete') {
    autoLogin();
  } else {
    window.addEventListener('load', autoLogin);
  }
})();
`;
}

/**
 * 解析自动登录凭据
 * 格式: username:password
 */
export function parseAutoLogin(autoLoginStr: string): { username: string; password: string } | null {
  if (!autoLoginStr) return null;
  
  const colonIndex = autoLoginStr.indexOf(':');
  if (colonIndex === -1) {
    log.error('Invalid auto-login format. Use: username:password');
    return null;
  }
  
  const username = autoLoginStr.substring(0, colonIndex);
  const password = autoLoginStr.substring(colonIndex + 1);
  
  if (!username || !password) {
    log.error('Invalid auto-login credentials');
    return null;
  }
  
  return { username, password };
}

/**
 * 创建自动登录注入脚本文件
 */
export function createAutoLoginInjectFile(autoLoginStr: string): string | null {
  const credentials = parseAutoLogin(autoLoginStr);
  if (!credentials) return null;
  
  const script = generateAutoLoginScript(credentials.username, credentials.password);
  const tmpDir = getTempDir('autologin');
  const scriptPath = path.join(tmpDir, 'auto-login.js');
  
  fs.writeFileSync(scriptPath, script);
  log.debug('Auto-login script created at:', scriptPath);
  
  return scriptPath;
}
