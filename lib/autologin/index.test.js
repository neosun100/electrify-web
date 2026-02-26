"use strict";
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
const fs = __importStar(require("fs"));
const index_1 = require("./index");
describe('parseAutoLogin', () => {
    test('parses valid username:password', () => {
        expect((0, index_1.parseAutoLogin)('admin:secret')).toEqual({
            username: 'admin',
            password: 'secret',
        });
    });
    test('handles password containing colons', () => {
        expect((0, index_1.parseAutoLogin)('user:pass:with:colons')).toEqual({
            username: 'user',
            password: 'pass:with:colons',
        });
    });
    test('handles email as password', () => {
        expect((0, index_1.parseAutoLogin)('admin:user@example.com')).toEqual({
            username: 'admin',
            password: 'user@example.com',
        });
    });
    test('handles special characters in password', () => {
        expect((0, index_1.parseAutoLogin)('admin:p@$$w0rd!#%')).toEqual({
            username: 'admin',
            password: 'p@$$w0rd!#%',
        });
    });
    test('returns null for empty string', () => {
        expect((0, index_1.parseAutoLogin)('')).toBeNull();
    });
    test('returns null for missing colon', () => {
        expect((0, index_1.parseAutoLogin)('nocolon')).toBeNull();
    });
    test('returns null for empty username', () => {
        expect((0, index_1.parseAutoLogin)(':password')).toBeNull();
    });
    test('returns null for empty password', () => {
        expect((0, index_1.parseAutoLogin)('username:')).toBeNull();
    });
});
describe('generateAutoLoginScript', () => {
    test('returns a self-executing function', () => {
        const script = (0, index_1.generateAutoLoginScript)('user', 'pass');
        expect(script).toContain('(function()');
        expect(script).toContain('})();');
    });
    test('encodes credentials in base64', () => {
        const script = (0, index_1.generateAutoLoginScript)('admin', 'secret');
        const encodedUser = Buffer.from('admin').toString('base64');
        const encodedPass = Buffer.from('secret').toString('base64');
        expect(script).toContain(encodedUser);
        expect(script).toContain(encodedPass);
        // Should NOT contain plaintext credentials
        expect(script).not.toContain("'admin'");
        expect(script).not.toContain("'secret'");
    });
    test('includes username field selectors', () => {
        const script = (0, index_1.generateAutoLoginScript)('u', 'p');
        expect(script).toContain('input[type="text"]');
        expect(script).toContain('input[type="email"]');
        expect(script).toContain('input[type="password"]');
    });
    test('includes submit button detection', () => {
        const script = (0, index_1.generateAutoLoginScript)('u', 'p');
        expect(script).toContain('button[type="submit"]');
        expect(script).toContain('input[type="submit"]');
        expect(script).toContain('.closest(\'form\')');
    });
    test('includes session guard to prevent duplicate login', () => {
        const script = (0, index_1.generateAutoLoginScript)('u', 'p');
        expect(script).toContain('sessionStorage');
        expect(script).toContain('nativefier_auto_login_done');
    });
});
describe('createAutoLoginInjectFile', () => {
    test('creates a JS file and returns its path', () => {
        const result = (0, index_1.createAutoLoginInjectFile)('admin:secret');
        expect(result).not.toBeNull();
        expect(result).toMatch(/auto-login\.js$/);
        expect(fs.existsSync(result)).toBe(true);
        const content = fs.readFileSync(result, 'utf-8');
        expect(content).toContain(Buffer.from('admin').toString('base64'));
        expect(content).toContain(Buffer.from('secret').toString('base64'));
    });
    test('returns null for invalid input', () => {
        expect((0, index_1.createAutoLoginInjectFile)('')).toBeNull();
        expect((0, index_1.createAutoLoginInjectFile)('nocolon')).toBeNull();
        expect((0, index_1.createAutoLoginInjectFile)(':pass')).toBeNull();
        expect((0, index_1.createAutoLoginInjectFile)('user:')).toBeNull();
    });
});
//# sourceMappingURL=index.test.js.map