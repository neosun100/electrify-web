import * as fs from 'fs';
import * as path from 'path';

import {
  parseAutoLogin,
  generateAutoLoginScript,
  createAutoLoginInjectFile,
} from './index';

describe('parseAutoLogin', () => {
  test('parses valid username:password', () => {
    expect(parseAutoLogin('admin:secret')).toEqual({
      username: 'admin',
      password: 'secret',
    });
  });

  test('handles password containing colons', () => {
    expect(parseAutoLogin('user:pass:with:colons')).toEqual({
      username: 'user',
      password: 'pass:with:colons',
    });
  });

  test('handles email as password', () => {
    expect(parseAutoLogin('admin:user@example.com')).toEqual({
      username: 'admin',
      password: 'user@example.com',
    });
  });

  test('handles special characters in password', () => {
    expect(parseAutoLogin('admin:p@$$w0rd!#%')).toEqual({
      username: 'admin',
      password: 'p@$$w0rd!#%',
    });
  });

  test('returns null for empty string', () => {
    expect(parseAutoLogin('')).toBeNull();
  });

  test('returns null for missing colon', () => {
    expect(parseAutoLogin('nocolon')).toBeNull();
  });

  test('returns null for empty username', () => {
    expect(parseAutoLogin(':password')).toBeNull();
  });

  test('returns null for empty password', () => {
    expect(parseAutoLogin('username:')).toBeNull();
  });
});

describe('generateAutoLoginScript', () => {
  test('returns a self-executing function', () => {
    const script = generateAutoLoginScript('user', 'pass');
    expect(script).toContain('(function()');
    expect(script).toContain('})();');
  });

  test('encodes credentials in base64', () => {
    const script = generateAutoLoginScript('admin', 'secret');
    const encodedUser = Buffer.from('admin').toString('base64');
    const encodedPass = Buffer.from('secret').toString('base64');
    expect(script).toContain(encodedUser);
    expect(script).toContain(encodedPass);
    // Should NOT contain plaintext credentials
    expect(script).not.toContain("'admin'");
    expect(script).not.toContain("'secret'");
  });

  test('includes username field selectors', () => {
    const script = generateAutoLoginScript('u', 'p');
    expect(script).toContain('input[type="text"]');
    expect(script).toContain('input[type="email"]');
    expect(script).toContain('input[type="password"]');
  });

  test('includes submit button detection', () => {
    const script = generateAutoLoginScript('u', 'p');
    expect(script).toContain('button[type="submit"]');
    expect(script).toContain('input[type="submit"]');
    expect(script).toContain('.closest(\'form\')');
  });

  test('includes session guard to prevent duplicate login', () => {
    const script = generateAutoLoginScript('u', 'p');
    expect(script).toContain('sessionStorage');
    expect(script).toContain('nativefier_auto_login_done');
  });
});

describe('createAutoLoginInjectFile', () => {
  test('creates a JS file and returns its path', () => {
    const result = createAutoLoginInjectFile('admin:secret');
    expect(result).not.toBeNull();
    expect(result!).toMatch(/auto-login\.js$/);
    expect(fs.existsSync(result!)).toBe(true);

    const content = fs.readFileSync(result!, 'utf-8');
    expect(content).toContain(Buffer.from('admin').toString('base64'));
    expect(content).toContain(Buffer.from('secret').toString('base64'));
  });

  test('returns null for invalid input', () => {
    expect(createAutoLoginInjectFile('')).toBeNull();
    expect(createAutoLoginInjectFile('nocolon')).toBeNull();
    expect(createAutoLoginInjectFile(':pass')).toBeNull();
    expect(createAutoLoginInjectFile('user:')).toBeNull();
  });
});
