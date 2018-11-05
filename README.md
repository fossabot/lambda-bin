# lambda-bin
[![Build Status](https://travis-ci.org/botbits/lambda-bin.svg?branch=master)](https://travis-ci.org/botbits/lambda-bin)
[![Coverage Status](https://coveralls.io/repos/github/botbits/lambda-bin/badge.svg?branch=master)](https://coveralls.io/github/botbits/lambda-bin?branch=master)
[![NPM Version](https://img.shields.io/npm/v/lambda-bin.svg)](https://www.npmjs.com/package/lambda-bin)

> Add non-standard binaries to serverless compute.

This module reduces the footprint of the run-time only part of the [`bin-minify`](https://github.com/botbits/bin-minify#readme) module and adds a few [AWS Lambda](https://aws.amazon.com/lambda/) specific functions.

Still, this module's core functionality should work well for other serverless providers as well. [Please open an issue](https://github.com/botbits/lambda-bin/issues) if you come across limitations using this module with other serverless providers.


## Install

```
$ npm install --save lambda-bin
```


## Usage

```js
const path = require('path');
const LambdaBin = require('lambda-bin');
const MY_LAMBDA_BIN_PATH = path.join('/', 'tmp', 'my_bin');

var myLambdaBin = new LambdaBin({
  targetPath: path.resolve(__dirname, path.join('bin', 'my_bin')),
  minPack: require('MY_MIN_PACK_FILE'),
});

myLambdaBin.applyMinPack(MY_LAMBDA_BIN_PATH).then((result) => {
  if (result.accepted) {
    // Setup the PATH environment variable
    myLambdaBin.setPath(MY_LAMBDA_BIN_PATH);
    // And maybe some other environment variables
    myLambdaBin.setEnv({
      ENV_VAR1: 'some value',
      ENV_VAR2: 'another value',
    }, true);
    // Or setup the PATH and other environment variables yourself...
  }
  // Binaries are ready to use
}, error => {
  throw new Error(`Binaries could not be correctly setup: ${error}`);
});
```


## API

### constructor (options)
```javascript
Object new LambdaBin( Object )
```

#### options

Type: `Object`

Optional

The following are supported keys in the `options` `json` object. Any other keys are ignored.

##### targetPath

Type: `string`

Default: `./bin/bin-minify`

Location of the actual binaries.

**Note**: Typically the binaries under `targetPath` are source controlled (and should be included in the `npm` module or `Lambda` package).

##### useSymlinks

Type: `boolean`

Any value passed will be replaced with `false`, which is required for `bin-minify` to work on `AWS Lambda`

##### minPack

Type: `Object`

Default: `{}`

Used to ***load*** a previously created `minPack`.

**Note**: A `minPack` is created using [`bin-minify stagingBin.createMinPack()`](https://www.npmjs.com/package/bin-minify#promise-stagingbincreateminpack-) and saved to a source controlled file (which should be included in the `npm` module or `Lambda` package).

### Promise runtimeBin.applyMinPack (fromBase)

#### fromBase

Type: `string`

Required

Base path where the original file structure of the binaries will be recreated.

#### returns Promise

Resolved Promise: `{ loaded: true or false }`. `loaded` will be:
- `true` if the file structure was successfully created.
- `false` if the `fromBase` path already existed.

Rejected Promise: `{ error }`.

### String setPath (pathsToAdd)

Once the original file structure of the binaries is recreated, it is necessary to add them to the `PATH` before the binaries can be invoked. `setPath()` can be used for this purpose.

#### pathsToAdd

Type: `string` or `Array`

The path(s) for the binaries. Typically these paths are children of `fromBase` and/or `fromBase` itself.

**Note**: These paths will be prepended to the system `PATH`.

#### returns String

The resulting `PATH`.

### setEnv (variablesToSet, shouldOverwrite)

Some binaries rely on environment variables to control their behavior (e.g. `NODE_PATH`), or require existing environment variables to be updated (e.g. `LD_LIBRARY_PATH`). `setEnv()` can be used to setup environment variables.

#### variablesToSet

Type: `Object`

Key-values pairs representing the environment variables to add/change, where the `key` is the environment variable name and the `value` its associated value.

#### shouldOverwrite

Type: `boolean`

If `true`, any existing value will be replaced. If `false` the value provided will be appended to any existing value using ':'.

**Tip**: If it necessary to overwrite and append values, call `setEnv()` twice and change the value of `shouldOverwrite` accordingly.


## License

MIT © [BotBits<sup>SM</sup>](https://github.com/botbits)
