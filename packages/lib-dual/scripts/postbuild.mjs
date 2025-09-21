import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const esmDir = join(here, '..', 'dist', 'esm');

await mkdir(esmDir, { recursive: true });
const pkgPath = join(esmDir, 'package.json');
const pkgJson = JSON.stringify({ type: 'module' }, null, 2) + '\n';
await writeFile(pkgPath, pkgJson);
