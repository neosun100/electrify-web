"use strict";
/**
 * 交互式向导模式
 * 通过问答方式引导用户配置应用
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
exports.runWizard = runWizard;
exports.runQuickWizard = runQuickWizard;
const readline = __importStar(require("readline"));
const presets_1 = require("../presets");
const questions = [
    {
        key: 'targetUrl',
        message: '🌐 Enter the URL of the website:',
        type: 'input',
    },
    {
        key: 'name',
        message: '📛 Enter the app name (leave empty to auto-detect):',
        type: 'input',
        default: '',
    },
    {
        key: 'preset',
        message: '🎯 Choose a preset configuration:',
        type: 'select',
        choices: ['auto', 'none', ...Object.keys(require('../presets').presets)],
        default: 'auto',
    },
    {
        key: 'icon',
        message: '🖼️  Path to custom icon (leave empty to auto-detect):',
        type: 'input',
        default: '',
    },
    {
        key: 'platform',
        message: '💻 Target platform:',
        type: 'select',
        choices: ['current', 'windows', 'mac', 'linux', 'all'],
        default: 'current',
    },
    {
        key: 'singleInstance',
        message: '🔒 Allow only single instance?',
        type: 'confirm',
        default: true,
    },
    {
        key: 'tray',
        message: '📌 Enable system tray icon?',
        type: 'confirm',
        default: false,
        transform: (value) => (value === 'true' ? 'true' : 'false'),
    },
    {
        key: 'confirm',
        message: '✅ Ready to build. Proceed?',
        type: 'confirm',
        default: true,
    },
];
class InteractiveWizard {
    constructor() {
        this.answers = {};
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
    async askQuestion(question) {
        return new Promise((resolve) => {
            let prompt = question.message;
            if (question.type === 'select' && question.choices) {
                prompt += `\n  Options: ${question.choices.join(', ')}`;
            }
            if (question.default !== undefined && question.default !== '') {
                prompt += ` [${question.default}]`;
            }
            prompt += ' ';
            this.rl.question(prompt, (answer) => {
                var _a;
                const result = answer.trim() || String((_a = question.default) !== null && _a !== void 0 ? _a : '');
                resolve(result);
            });
        });
    }
    printBanner() {
        console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Nativefier Interactive Wizard                        ║
║                                                           ║
║   Create desktop apps from any website                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);
    }
    printPresets() {
        console.log('\n📋 Available Presets:\n');
        const presets = (0, presets_1.listPresets)();
        presets.forEach((preset) => {
            console.log(`  • ${preset.name.padEnd(15)} - ${preset.description}`);
        });
        console.log('');
    }
    async run() {
        this.printBanner();
        for (const question of questions) {
            // 检查条件
            if (question.when && !question.when(this.answers)) {
                continue;
            }
            const answer = await this.askQuestion(question);
            if (question.key === 'confirm') {
                if (answer.toLowerCase() !== 'true' && answer.toLowerCase() !== 'y' && answer !== '') {
                    console.log('\n❌ Build cancelled.\n');
                    process.exit(0);
                }
                continue;
            }
            if (question.key === 'preset') {
                if (answer === 'auto' && this.answers.targetUrl) {
                    const suggested = (0, presets_1.suggestPreset)(this.answers.targetUrl);
                    if (suggested) {
                        console.log(`  💡 Auto-detected preset: ${suggested}`);
                        this.answers.preset = suggested;
                    }
                }
                else if (answer !== 'none') {
                    this.answers.preset = answer;
                }
                continue;
            }
            // 处理平台选择
            if (question.key === 'platform') {
                if (answer !== 'current') {
                    const platformMap = {
                        windows: 'win32',
                        mac: 'darwin',
                        linux: 'linux',
                    };
                    if (answer !== 'all') {
                        this.answers.platform = platformMap[answer] || answer;
                    }
                }
                continue;
            }
            // 转换值
            let value = answer;
            if (question.transform) {
                value = question.transform(answer);
            }
            else if (question.type === 'confirm') {
                value = answer.toLowerCase() === 'true' || answer.toLowerCase() === 'y' || answer === '';
            }
            if (value !== '' && value !== undefined) {
                this.answers[question.key] = value;
            }
        }
        this.rl.close();
        // 应用预设
        let finalOptions = { ...this.answers };
        if (this.answers.preset) {
            finalOptions = (0, presets_1.applyPreset)(finalOptions, this.answers.preset);
            delete finalOptions.preset;
        }
        console.log('\n🔧 Final configuration:');
        console.log(JSON.stringify(finalOptions, null, 2));
        console.log('\n🏗️  Building your app...\n');
        return finalOptions;
    }
}
/**
 * 运行交互式向导
 */
async function runWizard() {
    const wizard = new InteractiveWizard();
    return wizard.run();
}
/**
 * 快速模式 - 只询问必要问题
 */
async function runQuickWizard(url) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const ask = (question, defaultValue = '') => {
        return new Promise((resolve) => {
            const prompt = defaultValue ? `${question} [${defaultValue}] ` : `${question} `;
            rl.question(prompt, (answer) => {
                resolve(answer.trim() || defaultValue);
            });
        });
    };
    console.log('\n🚀 Nativefier Quick Setup\n');
    const targetUrl = url || (await ask('🌐 Website URL:'));
    const name = await ask('📛 App name (optional):');
    // 智能推荐预设
    const suggestedPreset = (0, presets_1.suggestPreset)(targetUrl);
    let usePreset = 'none';
    if (suggestedPreset) {
        const useSuggested = await ask(`💡 Detected as ${suggestedPreset} app. Use optimized settings? (y/n)`, 'y');
        if (useSuggested.toLowerCase() === 'y') {
            usePreset = suggestedPreset;
        }
    }
    rl.close();
    let options = { targetUrl };
    if (name)
        options.name = name;
    if (usePreset !== 'none') {
        options = (0, presets_1.applyPreset)(options, usePreset);
    }
    console.log('\n🏗️  Building your app...\n');
    return options;
}
//# sourceMappingURL=index.js.map