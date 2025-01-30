import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { existsSync, readFileSync } from 'node:fs';

import { fsCache } from '@rodbe/lru-cache-fs';
import { to } from '@rodbe/fn-utils';
import select from '@inquirer/select';

import { DAY_IN_MS, STATUS, WEEK_IN_MS } from '@/constants';
import type { AvailabilityProps, LocalNpmPackage, RemoteNpmPackage } from './types';

const getRemotePackageJson = async (packageName: string) => {
  const [err, response] = await to<RemoteNpmPackage>(
    fetch(`https://registry.npmjs.org/${packageName}`).then(async res => res.json() as Promise<RemoteNpmPackage>)
  );

  if (err) {
    return null;
  }

  const version = response['dist-tags'].latest;

  return { version };
};

const pkgNameFormatter = (packageName: string) => {
  return packageName
    .trim()
    .toLowerCase()
    .replace(/[<>:."/\\|?*]/g, '_')
    .replace(/[!@]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[. ]+$/, '');
};

export const checkUpdates = ({
  askToUpdate = true,
  dontAskCheckInterval = DAY_IN_MS,
  isGlobal = true,
  packageJsonPath,
  updateCheckInterval = WEEK_IN_MS,
  updateQuestion = 'Heey! Before, do you want to get the latest version? 🔥',
}: AvailabilityProps) => {
  const configFolder = join(homedir(), '.config');

  if (!existsSync(packageJsonPath)) {
    console.log(`Error: ups, package.json not found at packageJsonPath`);

    return {};
  }

  const { name: packageName, version: localVersion } = JSON.parse(
    readFileSync(packageJsonPath, 'utf8')
  ) as LocalNpmPackage;

  const commandToInstall = isGlobal ? `npm i -g ${packageName}` : `npm i ${packageName}`;

  const updateOptions = {
    choices: [
      {
        name: 'Yes',
        value: true,
      },
      {
        name: 'No',
        value: false,
      },
    ],
    default: true,
    message: updateQuestion,
  };

  const updateCache = fsCache<string, (typeof STATUS)[keyof typeof STATUS]>({
    cacheName: `.update-${pkgNameFormatter(packageName)}`,
    cachePath: configFolder,
    max: 10,
    ttl: updateCheckInterval,
  });

  const dontAskCache = fsCache<string, boolean>({
    cacheName: `.dont-ask-update-${pkgNameFormatter(packageName)}`,
    cachePath: configFolder,
    max: 10,
    ttl: dontAskCheckInterval,
  });

  const update = () => {
    execSync(commandToInstall, {
      cwd: process.cwd(),
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    console.log('✅ Latest version installed');
    updateCache.syncFs.setItem('status', STATUS.UPDATED);
  };

  const checkNewVersion = async () => {
    if (dontAskCache.get('dontAsk')) {
      return;
    }

    if (updateCache.get('status') === STATUS.UPDATED) {
      return;
    }

    const remotePkgJson = await getRemotePackageJson(packageName);

    if (!remotePkgJson) {
      return;
    }

    if (remotePkgJson.version === localVersion) {
      updateCache.syncFs.setItem('status', STATUS.UPDATED);

      return;
    }

    if (!askToUpdate) {
      console.log('🔥 Installing latest version');
      update();

      return;
    }

    const updateAnswer = await select(updateOptions);

    if (updateAnswer) {
      update();
    } else {
      dontAskCache.syncFs.setItem('dontAsk', true);
    }
  };

  return {
    checkNewVersion,
    update,
  };
};
