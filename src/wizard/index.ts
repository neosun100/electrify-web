/**
 * 交互式向导模式
 * 通过问答方式引导用户配置应用
 */

import * as readline from 'readline';
import * as log from 'loglevel';
import { RawOptions } from '../../shared/src/options/model';
import { listPresets, suggestPreset, applyPreset } from '../presets';

interface Question {
  key: keyof RawOptions | 'preset' | 'confirm';
  message: string;
  type: 'input' | 'confirm' | 'select';
  default?: string | boolean;
  choices?: string[];
  when?: (answers: Partial<RawOptions>) => boolean;
  transform?: (value: string) => unknown;
}

const questions: Question[] = [
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
    transform: (value: string) => (value === 'true' ? 'true' : 'false'),
  },
  {
    key: 'confirm',
    message: '✅ Ready to build. Proceed?',
    type: 'confirm',
    default: true,
  },
];

class InteractiveWizard {
  private rl: readline.Interface;
  private answers: Partial<RawOptions> & { preset?: string } = {};

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private async askQuestion(question: Question): Promise<string> {
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
        const result = answer.trim() || String(question.default ?? '');
        resolve(result);
      });
    });
  }

  private printBanner(): void {
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

  private printPresets(): void {
    console.log('\n📋 Available Presets:\n');
    const presets = listPresets();
    presets.forEach((preset) => {
      console.log(`  • ${preset.name.padEnd(15)} - ${preset.description}`);
    });
    console.log('');
  }

  async run(): Promise<RawOptions> {
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
          const suggested = suggestPreset(this.answers.targetUrl);
          if (suggested) {
            console.log(`  💡 Auto-detected preset: ${suggested}`);
            this.answers.preset = suggested;
          }
        } else if (answer !== 'none') {
          this.answers.preset = answer;
        }
        continue;
      }

      // 处理平台选择
      if (question.key === 'platform') {
        if (answer !== 'current') {
          const platformMap: Record<string, string> = {
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
      let value: unknown = answer;
      if (question.transform) {
        value = question.transform(answer);
      } else if (question.type === 'confirm') {
        value = answer.toLowerCase() === 'true' || answer.toLowerCase() === 'y' || answer === '';
      }

      if (value !== '' && value !== undefined) {
        (this.answers as Record<string, unknown>)[question.key] = value;
      }
    }

    this.rl.close();

    // 应用预设
    let finalOptions = { ...this.answers } as RawOptions;
    if (this.answers.preset) {
      finalOptions = applyPreset(finalOptions, this.answers.preset);
      delete (finalOptions as Record<string, unknown>).preset;
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
export async function runWizard(): Promise<RawOptions> {
  const wizard = new InteractiveWizard();
  return wizard.run();
}

/**
 * 快速模式 - 只询问必要问题
 */
export async function runQuickWizard(url?: string): Promise<RawOptions> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (question: string, defaultValue = ''): Promise<string> => {
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
  const suggestedPreset = suggestPreset(targetUrl);
  let usePreset = 'none';
  if (suggestedPreset) {
    const useSuggested = await ask(
      `💡 Detected as ${suggestedPreset} app. Use optimized settings? (y/n)`,
      'y',
    );
    if (useSuggested.toLowerCase() === 'y') {
      usePreset = suggestedPreset;
    }
  }

  rl.close();

  let options: RawOptions = { targetUrl };
  if (name) options.name = name;
  if (usePreset !== 'none') {
    options = applyPreset(options, usePreset);
  }

  console.log('\n🏗️  Building your app...\n');
  return options;
}
