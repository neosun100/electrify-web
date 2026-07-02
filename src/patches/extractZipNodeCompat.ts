// extract-zip's bundled yauzl 2.10 silently fails to extract on Node 26+
// (electron-packager's zip extraction exits with no error, leaving an
// incomplete .app template). Replace it with a shell-out to the system
// `unzip`, which extracts reliably. Not applied on win32, where `unzip`
// isn't guaranteed to be on PATH.
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

if (process.platform !== 'win32') {
  const id = require.resolve('extract-zip');
  const patchedExtractZip = async function (
    zipPath: string,
    opts: { dir: string },
  ): Promise<void> {
    const dir = path.resolve(opts.dir);
    fs.mkdirSync(dir, { recursive: true });
    execFileSync('unzip', ['-qq', '-o', zipPath, '-d', dir], {
      stdio: 'inherit',
    });
  };
  require.cache[id] = {
    id,
    path: path.dirname(id),
    filename: id,
    loaded: true,
    exports: patchedExtractZip,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}
