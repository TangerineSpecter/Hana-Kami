import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { App } from 'electron';

/** Keep an existing installation's whole Electron profile together: config,
 * encrypted secrets, SQLite and renderer localStorage share this directory. */
export function legacyUserDataPath(currentPath: string, exists = existsSync): string | null {
  if (exists(join(currentPath, 'config.json'))) return null;
  for (const name of ['munder-difflin', 'Munder Difflin']) {
    const oldPath = join(dirname(currentPath), name);
    if (oldPath !== currentPath && exists(join(oldPath, 'config.json'))) return oldPath;
  }
  return null;
}

export function retainExistingUserData(app: App): void {
  const oldPath = legacyUserDataPath(app.getPath('userData'));
  if (oldPath) app.setPath('userData', oldPath);
}
