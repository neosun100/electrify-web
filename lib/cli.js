#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initArgs = initArgs;
exports.parseArgs = parseArgs;
require("source-map-support/register");
const fs = __importStar(require("fs"));
const log = __importStar(require("loglevel"));
const yargs_1 = __importDefault(require("yargs"));
const constants_1 = require("./constants");
const helpers_1 = require("./helpers/helpers");
const inferOs_1 = require("./infer/inferOs");
const main_1 = require("./main");
const parseUtils_1 = require("./utils/parseUtils");
const presets_1 = require("./presets");
const config_1 = require("./config");
const wizard_1 = require("./wizard");
const security_1 = require("./security");
function initArgs(argv) {
    const sanitizedArgs = sanitizeArgs(argv);
    const args = (0, yargs_1.default)(sanitizedArgs)
        .scriptName('electrify')
        .usage('$0 <targetUrl> [outputDirectory] [options]\n\n' +
        'Commands:\n' +
        '  $0 wizard              Interactive setup wizard\n' +
        '  $0 init                Generate config file template\n' +
        '  $0 build               Build from config file\n' +
        '  $0 presets             List available presets\n' +
        '  $0 doctor              Check system environment\n' +
        '  $0 <url>               Quick build from URL')
        .example('$0 wizard', 'Start interactive wizard for guided setup')
        .example('$0 https://example.com', 'Quick build with auto-detected settings')
        .example('$0 https://example.com --preset social', 'Build with social media preset')
        .example('$0 build', 'Build from electrify.config.yaml in current directory')
        .example('$0 --config ./my-config.yaml', 'Build from specified config file')
        .positional('targetUrl', {
        description: 'the URL that you wish to to turn into a native app; required if not using --upgrade',
        type: 'string',
    })
        .positional('outputDirectory', {
        defaultDescription: 'defaults to the current directory, or env. var. NATIVEFIER_APPS_DIR if set',
        description: 'the directory to generate the app in',
        normalize: true,
        type: 'string',
    })
        // New Options
        .option('config', {
        description: 'path to config file (YAML or JSON)',
        normalize: true,
        type: 'string',
    })
        .option('preset', {
        description: 'use a preset configuration (social, productivity, media, email, developer, minimal, secure, kiosk)',
        type: 'string',
    })
        .option('pwa', {
        description: 'auto-detect PWA manifest and use its settings (name, icon, colors)',
        type: 'boolean',
        default: true,
    })
        .option('auto-update', {
        description: 'enable auto-update (github:owner/repo or update server URL)',
        type: 'string',
    })
        .group(['config', 'preset', 'pwa', 'auto-update'], decorateYargOptionGroup('Quick Start Options'))
        // App Creation Options
        .option('a', {
        alias: 'arch',
        choices: inferOs_1.supportedArchs,
        defaultDescription: "current Node's arch",
        description: 'the CPU architecture to build for',
        type: 'string',
    })
        .option('c', {
        alias: 'conceal',
        default: false,
        description: 'package the app source code into an asar archive',
        type: 'boolean',
    })
        .option('e', {
        alias: 'electron-version',
        defaultDescription: constants_1.DEFAULT_ELECTRON_VERSION,
        description: "specify the electron version to use (without the 'v'); see https://github.com/electron/electron/releases",
    })
        .option('global-shortcuts', {
        description: 'define global keyboard shortcuts via a JSON file; See https://github.com/nativefier/nativefier/blob/master/API.md#global-shortcuts',
        normalize: true,
        type: 'string',
    })
        .option('i', {
        alias: 'icon',
        description: 'the icon file to use as the icon for the app (.ico on Windows, .icns/.png on macOS, .png on Linux). Supports local paths or URLs.',
        type: 'string',
    })
        .option('n', {
        alias: 'name',
        defaultDescription: 'the title of the page passed via targetUrl',
        description: 'specify the name of the app',
        type: 'string',
    })
        .option('no-overwrite', {
        default: false,
        description: 'do not overwrite output directory if it already exists',
        type: 'boolean',
    })
        .option('overwrite', {
        // This is needed to have the `no-overwrite` flag to work correctly
        default: true,
        hidden: true,
        type: 'boolean',
    })
        .option('p', {
        alias: 'platform',
        choices: inferOs_1.supportedPlatforms,
        defaultDescription: 'current operating system',
        description: 'the operating system platform to build for',
        type: 'string',
    })
        .option('portable', {
        default: false,
        description: 'make the app store its user data in the app folder; WARNING: see https://github.com/nativefier/nativefier/blob/master/API.md#portable for security risks',
        type: 'boolean',
    })
        .option('upgrade', {
        description: 'upgrade an app built by an older version of Nativefier\nYou must pass the full path to the existing app executable (app will be overwritten with upgraded version by default)',
        normalize: true,
        type: 'string',
    })
        .option('widevine', {
        default: false,
        description: "use a Widevine-enabled version of Electron for DRM playback (use at your own risk, it's unofficial, provided by CastLabs)",
        type: 'boolean',
    })
        .group([
        'arch',
        'conceal',
        'electron-version',
        'global-shortcuts',
        'icon',
        'name',
        'no-overwrite',
        'platform',
        'portable',
        'upgrade',
        'widevine',
    ], decorateYargOptionGroup('App Creation Options'))
        // App Window Options
        .option('always-on-top', {
        default: false,
        description: 'enable always on top window',
        type: 'boolean',
    })
        .option('background-color', {
        description: "set the app background color, for better integration while the app is loading. Example value: '#2e2c29'",
        type: 'string',
    })
        .option('bookmarks-menu', {
        description: 'create a bookmarks menu (via JSON file); See https://github.com/nativefier/nativefier/blob/master/API.md#bookmarks-menu',
        normalize: true,
        type: 'string',
    })
        .option('browserwindow-options', {
        coerce: parseUtils_1.parseJson,
        description: 'override Electron BrowserWindow options (via JSON string); see https://github.com/nativefier/nativefier/blob/master/API.md#browserwindow-options',
    })
        .option('disable-context-menu', {
        default: false,
        description: 'disable the context menu (right click)',
        type: 'boolean',
    })
        .option('disable-dev-tools', {
        default: false,
        description: 'disable developer tools (Ctrl+Shift+I / F12)',
        type: 'boolean',
    })
        .option('full-screen', {
        default: false,
        description: 'always start the app full screen',
        type: 'boolean',
    })
        .option('height', {
        defaultDescription: '800',
        description: 'set window default height in pixels',
        type: 'number',
    })
        .option('hide-window-frame', {
        default: false,
        description: 'disable window frame and controls',
        type: 'boolean',
    })
        .option('m', {
        alias: 'show-menu-bar',
        default: false,
        description: 'set menu bar visible',
        type: 'boolean',
    })
        .option('max-height', {
        defaultDescription: 'unlimited',
        description: 'set window maximum height in pixels',
        type: 'number',
    })
        .option('max-width', {
        defaultDescription: 'unlimited',
        description: 'set window maximum width in pixels',
        type: 'number',
    })
        .option('maximize', {
        default: false,
        description: 'always start the app maximized',
        type: 'boolean',
    })
        .option('min-height', {
        defaultDescription: '0',
        description: 'set window minimum height in pixels',
        type: 'number',
    })
        .option('min-width', {
        defaultDescription: '0',
        description: 'set window minimum width in pixels',
        type: 'number',
    })
        .option('process-envs', {
        coerce: helpers_1.getProcessEnvs,
        description: 'a JSON string of key/value pairs to be set as environment variables before any browser windows are opened',
    })
        .option('single-instance', {
        default: false,
        description: 'allow only a single instance of the app',
        type: 'boolean',
    })
        .option('tray', {
        default: 'false',
        description: "allow app to stay in system tray. If 'start-in-tray' is set as argument, don't show main window on first start",
        choices: ['true', 'false', 'start-in-tray'],
    })
        .option('width', {
        defaultDescription: '1280',
        description: 'app window default width in pixels',
        type: 'number',
    })
        .option('x', {
        description: 'set window x location in pixels from left',
        type: 'number',
    })
        .option('y', {
        description: 'set window y location in pixels from top',
        type: 'number',
    })
        .option('zoom', {
        default: 1.0,
        description: 'set the default zoom factor for the app',
        type: 'number',
    })
        .group([
        'always-on-top',
        'background-color',
        'bookmarks-menu',
        'browserwindow-options',
        'disable-context-menu',
        'disable-dev-tools',
        'full-screen',
        'height',
        'hide-window-frame',
        'm',
        'max-width',
        'max-height',
        'maximize',
        'min-height',
        'min-width',
        'process-envs',
        'single-instance',
        'tray',
        'width',
        'x',
        'y',
        'zoom',
    ], decorateYargOptionGroup('App Window Options'))
        // Internal Browser Options
        .option('file-download-options', {
        coerce: parseUtils_1.parseJson,
        description: 'a JSON string defining file download options; see https://github.com/sindresorhus/electron-dl',
    })
        .option('inject', {
        description: 'path to a CSS/JS file to be injected; pass multiple times to inject multiple files',
        string: true,
        type: 'array',
    })
        .option('auto-login', {
        description: 'auto-fill login form with credentials (format: username:password). Credentials are Base64 encoded in the app.',
        type: 'string',
    })
        .option('lang', {
        defaultDescription: 'os language at runtime of the app',
        description: 'set the language or locale to render the web site as (e.g., "fr", "en-US", "es", etc.)',
        type: 'string',
    })
        .option('u', {
        alias: 'user-agent',
        description: "set the app's user agent string; may also use 'edge', 'firefox', or 'safari' to have one auto-generated",
        type: 'string',
    })
        .option('user-agent-honest', {
        alias: 'honest',
        default: false,
        description: 'prevent the normal changing of the user agent string to appear as a regular Chrome browser',
        type: 'boolean',
    })
        .group([
        'file-download-options',
        'inject',
        'auto-login',
        'lang',
        'user-agent',
        'user-agent-honest',
    ], decorateYargOptionGroup('Internal Browser Options'))
        // Internal Browser Cache Options
        .option('clear-cache', {
        default: false,
        description: 'prevent the app from preserving cache between launches',
        type: 'boolean',
    })
        .option('disk-cache-size', {
        defaultDescription: 'chromium default',
        description: 'set the maximum disk space (in bytes) to be used by the disk cache',
        type: 'number',
    })
        .group(['clear-cache', 'disk-cache-size'], decorateYargOptionGroup('Internal Browser Cache Options'))
        // URL Handling Options
        .option('block-external-urls', {
        default: false,
        description: `forbid navigation to URLs not considered "internal" (see '--internal-urls').  Instead of opening in an external browser, attempts to navigate to external URLs will be blocked`,
        type: 'boolean',
    })
        .option('internal-urls', {
        defaultDescription: 'URLs sharing the same base domain',
        description: `regex of URLs to consider "internal"; by default matches based on domain (see '--strict-internal-urls'); all other URLs will be opened in an external browser`,
        type: 'string',
    })
        .option('strict-internal-urls', {
        default: false,
        description: 'disable domain-based matching on internal URLs',
        type: 'boolean',
    })
        .option('proxy-rules', {
        description: 'proxy rules; see https://www.electronjs.org/docs/api/session#sessetproxyconfig',
        type: 'string',
    })
        .group([
        'block-external-urls',
        'internal-urls',
        'strict-internal-urls',
        'proxy-rules',
    ], decorateYargOptionGroup('URL Handling Options'))
        // Auth Options
        .option('basic-auth-password', {
        description: 'basic http(s) auth password',
        type: 'string',
    })
        .option('basic-auth-username', {
        description: 'basic http(s) auth username',
        type: 'string',
    })
        .group(['basic-auth-password', 'basic-auth-username'], decorateYargOptionGroup('Auth Options'))
        // Graphics Options
        .option('disable-gpu', {
        default: false,
        description: 'disable hardware acceleration',
        type: 'boolean',
    })
        .option('enable-es3-apis', {
        default: false,
        description: 'force activation of WebGL 2.0',
        type: 'boolean',
    })
        .option('ignore-gpu-blacklist', {
        default: false,
        description: 'force WebGL apps to work on unsupported GPUs',
        type: 'boolean',
    })
        .group(['disable-gpu', 'enable-es3-apis', 'ignore-gpu-blacklist'], decorateYargOptionGroup('Graphics Options'))
        // Security Options
        .option('ignore-certificate', {
        default: false,
        description: 'ignore certificate-related errors',
        type: 'boolean',
    })
        .option('insecure', {
        default: false,
        description: 'enable loading of insecure content',
        type: 'boolean',
    })
        .group([
        'ignore-certificate',
        'insecure',
    ], decorateYargOptionGroup('Security Options'))
        // Flash Options (DEPRECATED)
        .option('flash', {
        default: false,
        deprecated: true,
        description: 'enable Adobe Flash',
        hidden: true,
        type: 'boolean',
    })
        .option('flash-path', {
        deprecated: true,
        description: 'path to Chrome flash plugin; find it in `chrome://plugins`',
        hidden: true,
        normalize: true,
        type: 'string',
    })
        // Platform Specific Options
        .option('app-copyright', {
        description: '(macOS, windows only) set a human-readable copyright line for the app; maps to `LegalCopyright` metadata property on Windows, and `NSHumanReadableCopyright` on macOS',
        type: 'string',
    })
        .option('app-version', {
        description: '(macOS, windows only) set the version of the app; maps to the `ProductVersion` metadata property on Windows, and `CFBundleShortVersionString` on macOS',
        type: 'string',
    })
        .option('bounce', {
        default: false,
        description: '(macOS only) make the dock icon bounce when the counter increases',
        type: 'boolean',
    })
        .option('build-version', {
        description: '(macOS, windows only) set the build version of the app; maps to `FileVersion` metadata property on Windows, and `CFBundleVersion` on macOS',
        type: 'string',
    })
        .option('counter', {
        default: false,
        description: '(macOS only) set a dock count badge, determined by looking for a number in the window title',
        type: 'boolean',
    })
        .option('darwin-dark-mode-support', {
        default: false,
        description: '(macOS only) enable Dark Mode support on macOS 10.14+',
        type: 'boolean',
    })
        .option('f', {
        alias: 'fast-quit',
        default: false,
        description: '(macOS only) quit app on window close',
        type: 'boolean',
    })
        .option('title-bar-style', {
        choices: ['hidden', 'hiddenInset'],
        description: '(macOS only) set title bar style; consider injecting custom CSS (via --inject) for better integration',
        type: 'string',
    })
        .option('win32metadata', {
        coerce: (value) => (0, parseUtils_1.parseJson)(value),
        description: '(windows only) a JSON string of key/value pairs (ProductName, InternalName, FileDescription) to embed as executable metadata',
    })
        .group([
        'app-copyright',
        'app-version',
        'bounce',
        'build-version',
        'counter',
        'darwin-dark-mode-support',
        'fast-quit',
        'title-bar-style',
        'win32metadata',
    ], decorateYargOptionGroup('Platform-Specific Options'))
        // Debug Options
        .option('crash-reporter', {
        description: 'remote server URL to send crash reports',
        type: 'string',
    })
        .option('verbose', {
        default: false,
        description: 'enable verbose/debug/troubleshooting logs',
        type: 'boolean',
    })
        .option('quiet', {
        default: false,
        description: 'suppress all logging',
        type: 'boolean',
    })
        .group(['crash-reporter', 'verbose', 'quiet'], decorateYargOptionGroup('Debug Options'))
        .version()
        .help()
        .group(['version', 'help'], 'Other Options')
        .wrap(yargs_1.default.terminalWidth());
    // We must access argv in order to get yargs to actually process args
    // Do this now to go ahead and get any errors out of the way
    args.argv;
    return args;
}
function decorateYargOptionGroup(value) {
    return `====== ${value} ======`;
}
function parseArgs(args) {
    const parsed = { ...args.argv };
    // In yargs, the _ property of the parsed args is an array of the positional args
    // https://github.com/yargs/yargs/blob/master/docs/examples.md#and-non-hyphenated-options-too-just-use-argv_
    // So try to extract the targetUrl and outputDirectory from these
    parsed.targetUrl = parsed._.length > 0 ? parsed._[0].toString() : undefined;
    parsed.out = parsed._.length > 1 ? parsed._[1] : undefined;
    if (parsed.upgrade && parsed.targetUrl) {
        let targetAndUpgrade = false;
        if (!parsed.out) {
            // If we're upgrading, the first positional args might be the outputDirectory, so swap these if we can
            try {
                // If this succeeds, we have a problem
                new URL(parsed.targetUrl);
                targetAndUpgrade = true;
            }
            catch {
                // Cool, it's not a URL
                parsed.out = parsed.targetUrl;
                parsed.targetUrl = undefined;
            }
        }
        else {
            // Someone supplied a targetUrl, an outputDirectory, and --upgrade. That's not cool.
            targetAndUpgrade = true;
        }
        if (targetAndUpgrade) {
            throw new Error('ERROR: Nativefier must be called with either a targetUrl or the --upgrade option, not both.\n');
        }
    }
    // 允许使用配置文件时不需要 targetUrl
    if (!parsed.targetUrl && !parsed.upgrade && !parsed.config) {
        // 检查是否有自动发现的配置文件
        const autoConfig = (0, config_1.findConfigFile)();
        if (!autoConfig) {
            throw new Error('ERROR: Nativefier must be called with a targetUrl, --upgrade, or --config option.\n' +
                'Or create a electrify.config.yaml file in the current directory.\n' +
                'Run "electrify init" to generate a config template.\n');
        }
    }
    parsed.noOverwrite = parsed['no-overwrite'] = !parsed.overwrite;
    // Since coerce in yargs seems to have broken since
    // https://github.com/yargs/yargs/pull/1978
    for (const arg of [
        'win32metadata',
        'browserwindow-options',
        'file-download-options',
    ]) {
        if (parsed[arg] && typeof parsed[arg] === 'string') {
            parsed[arg] = (0, parseUtils_1.parseJson)(parsed[arg]);
            // sets fileDownloadOptions and browserWindowOptions
            // as parsed object as they were still strings in `nativefier.json`
            // because only their snake-cased variants were being parsed above
            parsed[(0, helpers_1.camelCased)(arg)] = parsed[arg];
        }
    }
    if (parsed['process-envs'] && typeof parsed['process-envs'] === 'string') {
        parsed['process-envs'] = (0, helpers_1.getProcessEnvs)(parsed['process-envs']);
    }
    return parsed;
}
function sanitizeArgs(argv) {
    const sanitizedArgs = [];
    argv.forEach((arg) => {
        if ((0, helpers_1.isArgFormatInvalid)(arg)) {
            throw new Error(`Invalid argument passed: ${arg} .\nNativefier supports short options (like "-n") and long options (like "--name"), all lowercase. Run "electrify --help" for help.\nAborting`);
        }
        const isLastArg = sanitizedArgs.length + 1 === argv.length;
        if (sanitizedArgs.length > 0) {
            const previousArg = sanitizedArgs[sanitizedArgs.length - 1];
            log.debug({ arg, previousArg, isLastArg });
            // Work around commander.js not supporting default argument for options
            if (previousArg === '--tray' &&
                !['true', 'false', 'start-in-tray'].includes(arg)) {
                sanitizedArgs.push('true');
            }
        }
        sanitizedArgs.push(arg);
        if (arg === '--tray' && isLastArg) {
            // Add a true if --tray is last so it gets enabled
            sanitizedArgs.push('true');
        }
    });
    return sanitizedArgs;
}
if (require.main === module) {
    // 处理特殊命令
    const firstArg = process.argv[2];
    // wizard 命令 - 交互式向导
    if (firstArg === 'wizard') {
        log.setLevel('info');
        (0, wizard_1.runWizard)()
            .then((options) => (0, main_1.buildNativefierApp)(options))
            .catch((error) => {
            log.error('Error:', error);
            process.exit(1);
        });
    }
    // init 命令 - 生成配置文件模板
    else if (firstArg === 'init') {
        const format = process.argv[3] === '--json' ? 'json' : 'yaml';
        const fileName = format === 'json' ? 'electrify.config.json' : 'electrify.config.yaml';
        const template = (0, config_1.generateConfigTemplate)(format);
        fs.writeFileSync(fileName, template);
        console.log(`✅ Created ${fileName}`);
        console.log(`\nEdit the file and run: electrify build`);
    }
    // build 命令 - 从配置文件构建
    else if (firstArg === 'build') {
        log.setLevel('info');
        const configPath = process.argv[3] || (0, config_1.findConfigFile)();
        if (!configPath) {
            log.error('No config file found. Run "electrify init" to create one.');
            process.exit(1);
        }
        try {
            const config = (0, config_1.loadConfigFile)(configPath);
            const options = (0, config_1.configToOptions)(config);
            log.info(`📄 Using config: ${configPath}`);
            (0, main_1.buildNativefierApp)(options).catch((error) => {
                log.error('Error during build:', error);
                process.exit(1);
            });
        }
        catch (err) {
            log.error('Failed to load config:', err);
            process.exit(1);
        }
    }
    // presets 命令 - 列出预设
    else if (firstArg === 'presets') {
        console.log('\n📋 Available Presets:\n');
        (0, presets_1.listPresets)().forEach((preset) => {
            console.log(`  ${preset.name.padEnd(15)} - ${preset.description}`);
        });
        console.log('\nUsage: electrify <url> --preset <name>\n');
    }
    // doctor 命令 - 诊断环境
    else if (firstArg === 'doctor') {
        console.log('\n🩺 Electrify Web Doctor - Environment Check\n');
        (0, security_1.runDoctor)()
            .then(({ passed, checks }) => {
            checks.forEach((check) => {
                const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
                console.log(`  ${icon} ${check.name.padEnd(15)} ${check.message}`);
            });
            console.log('');
            if (passed) {
                console.log('✅ All checks passed! Ready to build.\n');
            }
            else {
                console.log('❌ Some checks failed. Please fix the issues above.\n');
                process.exit(1);
            }
        })
            .catch((err) => {
            console.error('Doctor check failed:', err);
            process.exit(1);
        });
    }
    // 常规构建流程
    else {
        let args = undefined;
        let parsedArgs;
        try {
            args = initArgs(process.argv.slice(2));
            parsedArgs = parseArgs(args);
        }
        catch (err) {
            if (args) {
                log.error(err);
                args.showHelp();
            }
            else {
                log.error('Failed to parse command-line arguments. Aborting.', err);
            }
            process.exit(1);
        }
        let options = {
            ...parsedArgs,
        };
        // 处理配置文件
        if (options.config) {
            try {
                const config = (0, config_1.loadConfigFile)(options.config);
                const configOptions = (0, config_1.configToOptions)(config);
                options = { ...configOptions, ...options };
                delete options.config;
            }
            catch (err) {
                log.error('Failed to load config file:', err);
                process.exit(1);
            }
        }
        else {
            // 自动发现配置文件
            const autoConfig = (0, config_1.findConfigFile)();
            if (autoConfig && !options.targetUrl) {
                try {
                    const config = (0, config_1.loadConfigFile)(autoConfig);
                    const configOptions = (0, config_1.configToOptions)(config);
                    options = { ...configOptions, ...options };
                    log.info(`📄 Auto-loaded config: ${autoConfig}`);
                }
                catch (err) {
                    log.debug('Failed to auto-load config:', err);
                }
            }
        }
        // 处理预设
        if (options.preset) {
            try {
                options = (0, presets_1.applyPreset)(options, options.preset);
                log.info(`🎯 Applied preset: ${options.preset}`);
                delete options.preset;
            }
            catch (err) {
                log.error(err.message);
                process.exit(1);
            }
        }
        else if (options.targetUrl) {
            // 智能推荐预设
            const suggested = (0, presets_1.suggestPreset)(options.targetUrl);
            if (suggested) {
                log.info(`💡 Tip: Use --preset ${suggested} for optimized settings`);
            }
        }
        if (options.verbose) {
            log.setLevel('trace');
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                require('debug').enable('electron-packager');
            }
            catch (err) {
                log.debug('Failed to enable electron-packager debug output. This should not happen,', 'and suggests their internals changed. Please report an issue.');
            }
            log.debug('Running in verbose mode! This will produce a mountain of logs and', 'is recommended only for troubleshooting or if you like Shakespeare.');
        }
        else if (options.quiet) {
            log.setLevel('silent');
        }
        else {
            log.setLevel('info');
        }
        (0, helpers_1.checkInternet)();
        if (!options.out && process.env.NATIVEFIER_APPS_DIR) {
            options.out = process.env.NATIVEFIER_APPS_DIR;
        }
        (0, main_1.buildNativefierApp)(options).catch((error) => {
            log.error('Error during build. Run with --verbose for details.', error);
        });
    }
}
//# sourceMappingURL=cli.js.map