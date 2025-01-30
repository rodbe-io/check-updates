# @rodbe/check-updates

TypeScript utility library that checks for the latest version of local npm packages against the npm registry. It supports caching results to minimize unnecessary network requests and provides an interactive prompt to update packages.

## Features

- Fetch the latest version of an npm package from the registry.
- Cache results to optimize performance and control update checks using configurable intervals.
- Interactive user prompt to choose whether to update or not.
- Automatically install the latest version if accepted.

## Installation

```sh
npm install @rodbe/check-updates --save
````


## Usage
```ts
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { checkUpdates } from 'check-updates';

const distPath = join(dirname(fileURLToPath(import.meta.url)));

const updateChecker = checkUpdates({
  packageJsonPath: join(distPath, '..', 'package.json'),
  isGlobal: true,
});

await updateChecker.checkNewVersion();
// if the user chooses to update, the package will be updated
```

## Configuration Options
- **askToUpdate** (`boolean`):

  Default: `true`

  Whether to prompt the user to update.

- **isGlobal** (`boolean`):

  Default: `true`

  Determines if the package should be installed globally.

- **debug** (`boolean`):

  Default: `false`

  Runs `npm -v` instead of installing the package. (useful for local testing of packages during development)

- **dontAskCheckInterval** (`number`):

  Default: `24 * 60 * 60 * 1000 // 1 day in milliseconds`

  Cache time-to-live for the "don't ask" option, in milliseconds.

- **packageJsonPath** (`string`): **Required**

  Path to the package.json file of the package you want to check.

- **updateCheckInterval** (`number`):

  Default: `7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds`

  Cache time-to-live for update checks, in milliseconds.

- **updateQuestion** (`string`):

  Default: `'Heey! Before, do you want to get the latest version? 🔥'`

  Message to display during the update prompt.

## API

- **checkNewVersion()**

  Checks for new versions and if a new version is available, it prompts the user to determine whether to update the package.

  This function utilizes caching to avoid repeated prompts and unnecessary network requests.

- **update()**

  Updates the package to the latest version.


## Advanced usage

```ts
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { checkUpdates } from 'check-updates';

const distPath = join(dirname(fileURLToPath(import.meta.url)));

const updateChecker = checkUpdates({
  askToUpdate: true,
  isGlobal: true,
  dontAskCheckInterval: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  packageJsonPath: join(distPath, '..', 'package.json'),
  updateCheckInterval: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
  updateQuestion: 'Do you want to upgrade to the latest version now?',
});

// Check for new versions and possibly update
updateChecker.checkNewVersion().then(() => {
  console.log('Update check complete.');
});

// or update manually
updateChecker.update();
```

## License
MIT