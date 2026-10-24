import process from 'node:process';
import { getProjectRoot, getUserProfileDirectory } from '@clapp/utils';

/**
 * Meta of the running CLI application collected once at startup.
 */
export interface IAppMeta {
  cwd: string;
  appPath: string;
  appRoot: string;
  userHome: string;
}

let appMeta: IAppMeta;

/**
 * Collects the app meta once: the process entry path, the user profile directory
 * and the root of the project the CLI runs in. The first call computes the values;
 * later calls are a no-op.
 */
export function initAppMeta() {
  if (!appMeta) {
    const appPath = process.argv[1];
    const userHome = getUserProfileDirectory();
    const appRoot = getProjectRoot(appPath, userHome);
    if (!appRoot) {
      throw new Error(`The root folder of the application's cli was not found for some reason.`);
    }
    appMeta = {
      cwd: process.cwd(),
      appRoot,
      appPath,
      userHome,
    };
  }
}

/**
 * Returns a copy of the app meta collected by {@link initAppMeta}.
 * @returns A fresh copy of the app meta of the running application
 */
export function getAppMeta() {
  if (!appMeta) {
    throw new Error(`App Meta not initialized yet.`);
  }
  return { ...appMeta };
}
