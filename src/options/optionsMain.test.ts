import { getOptions, normalizePlatform } from './optionsMain';
import * as asyncConfig from './asyncConfig';
import { inferPlatform } from '../infer/inferOs';
import { AppOptions, RawOptions } from '../../shared/src/options/model';

let asyncConfigMock: jest.SpyInstance;
const mockedAsyncConfig: AppOptions = {
  nativefier: {
    accessibilityPrompt: false,
    alwaysOnTop: false,
    backgroundColor: undefined,
    basicAuthPassword: undefined,
    basicAuthUsername: undefined,
    blockExternalUrls: false,
    bookmarksMenu: undefined,
    bounce: false,
    browserwindowOptions: undefined,
    clearCache: false,
    counter: false,
    crashReporter: undefined,
    disableContextMenu: false,
    disableDevTools: false,
    disableGpu: false,
    diskCacheSize: undefined,
    enableEs3Apis: false,
    fastQuit: true,
    fileDownloadOptions: undefined,
    flashPluginDir: undefined,
    fullScreen: false,
    globalShortcuts: undefined,
    height: undefined,
    hideWindowFrame: false,
    ignoreCertificate: false,
    ignoreGpuBlacklist: false,
    inject: [],
    insecure: false,
    internalUrls: undefined,
    maximize: false,
    maxHeight: undefined,
    minWidth: undefined,
    minHeight: undefined,
    maxWidth: undefined,
    nativefierVersion: '1.0.0',
    processEnvs: undefined,
    proxyRules: undefined,
    showMenuBar: false,
    singleInstance: false,
    strictInternalUrls: false,
    titleBarStyle: undefined,
    tray: 'false',
    userAgent: undefined,
    userAgentHonest: false,
    verbose: false,
    versionString: '1.0.0',
    width: undefined,
    widevine: false,
    x: undefined,
    y: undefined,
    zoom: 1,
  },
  packager: {
    arch: process.arch,
    dir: '',
    platform: process.platform,
    portable: false,
    targetUrl: '',
    upgrade: false,
  },
};

beforeAll(() => {
  asyncConfigMock = jest
    .spyOn(asyncConfig, 'asyncConfig')
    .mockResolvedValue(mockedAsyncConfig);
});

test('it should call the async config', async () => {
  const params: RawOptions = {
    targetUrl: 'https://example.com/',
    tray: 'false',
  };
  const result = await getOptions(params);
  expect(asyncConfigMock).toHaveBeenCalledWith(
    expect.objectContaining({
      packager: expect.anything() as AppOptions['packager'],
      nativefier: expect.anything() as AppOptions['nativefier'],
    }),
  );
  expect(result.packager.targetUrl).toEqual(params.targetUrl);
});

test('it should set the accessibility prompt option to true by default', async () => {
  const params: RawOptions = {
    targetUrl: 'https://example.com/',
    tray: 'false',
  };
  const result = await getOptions(params);
  expect(asyncConfigMock).toHaveBeenCalledWith(
    expect.objectContaining({
      nativefier: expect.objectContaining({
        accessibilityPrompt: true,
      }) as AppOptions['nativefier'],
    }),
  );
  expect(result.nativefier.accessibilityPrompt).toEqual(true);
});

test('auto-login sets both inject script and basic auth credentials', async () => {
  const params: RawOptions = {
    targetUrl: 'https://example.com/',
    tray: 'false',
    autoLogin: 'admin:secret',
  };
  const result = await getOptions(params);
  // Should inject auto-login script
  expect(result.nativefier.inject).toBeDefined();
  expect(result.nativefier.inject!.length).toBeGreaterThanOrEqual(1);
  expect(result.nativefier.inject!.some((p) => p.includes('auto-login.js'))).toBe(true);
  // Should set basic auth
  expect(result.nativefier.basicAuthUsername).toBe('admin');
  expect(result.nativefier.basicAuthPassword).toBe('secret');
});

test('auto-login does not override explicit basic auth', async () => {
  const params: RawOptions = {
    targetUrl: 'https://example.com/',
    tray: 'false',
    autoLogin: 'autouser:autopass',
    basicAuthUsername: 'explicit',
    basicAuthPassword: 'explicit-pass',
  };
  const result = await getOptions(params);
  // Explicit basic auth should take precedence
  expect(result.nativefier.basicAuthUsername).toBe('explicit');
  expect(result.nativefier.basicAuthPassword).toBe('explicit-pass');
});

test('auto-login with invalid format does not set anything', async () => {
  const params: RawOptions = {
    targetUrl: 'https://example.com/',
    tray: 'false',
    autoLogin: 'nocolon',
  };
  const result = await getOptions(params);
  expect(result.nativefier.basicAuthUsername).toBeUndefined();
  expect(result.nativefier.basicAuthPassword).toBeUndefined();
});

test.each([
  { platform: 'darwin', expectedPlatform: 'darwin' },
  { platform: 'mAc', expectedPlatform: 'darwin' },
  { platform: 'osx', expectedPlatform: 'darwin' },
  { platform: 'liNux', expectedPlatform: 'linux' },
  { platform: 'mas', expectedPlatform: 'mas' },
  { platform: 'WIN32', expectedPlatform: 'win32' },
  { platform: 'windows', expectedPlatform: 'win32' },
  {},
])('it should be able to normalize the platform %s', (platformOptions) => {
  if (!platformOptions.expectedPlatform) {
    platformOptions.expectedPlatform = inferPlatform();
  }
  expect(normalizePlatform(platformOptions.platform)).toBe(
    platformOptions.expectedPlatform,
  );
});
