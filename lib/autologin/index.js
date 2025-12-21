"use strict";
/**
 * 自动登录脚本生成器
 * 生成用于自动填充登录表单的 JS 脚本
 *
 * 安全说明：
 * - 凭据使用 Base64 编码（非加密）
 * - 脚本仅在构建时生成，凭据不会保存到源代码
 * - 建议仅用于内部/私有应用
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAutoLoginScript = generateAutoLoginScript;
exports.parseAutoLogin = parseAutoLogin;
exports.createAutoLoginInjectFile = createAutoLoginInjectFile;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const log = __importStar(require("loglevel"));
const helpers_1 = require("../helpers/helpers");
/**
 * 生成自动登录脚本
 */
function generateAutoLoginScript(username, password) {
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
function parseAutoLogin(autoLoginStr) {
    if (!autoLoginStr)
        return null;
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
function createAutoLoginInjectFile(autoLoginStr) {
    const credentials = parseAutoLogin(autoLoginStr);
    if (!credentials)
        return null;
    const script = generateAutoLoginScript(credentials.username, credentials.password);
    const tmpDir = (0, helpers_1.getTempDir)('autologin');
    const scriptPath = path.join(tmpDir, 'auto-login.js');
    fs.writeFileSync(scriptPath, script);
    log.debug('Auto-login script created at:', scriptPath);
    return scriptPath;
}
//# sourceMappingURL=index.js.map