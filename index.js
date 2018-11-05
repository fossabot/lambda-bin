/* eslint-env node */
'use strict';

const path = require('path');
const RuntimeBin = require ('bin-minify/lib/RuntimeBin');

class LambdaBin {
  constructor (options) {
    options = undefined !== options ? options : {};
    options.useSymlinks = true;
    options.targetPath = options.targetPath || path.resolve(__dirname, path.join('bin', 'bin-minify'));
    this.targetPath = options.targetPath;
    this.runtimeBin = new RuntimeBin(options);
  }

  applyMinPack (fromBase) {
    return this.runtimeBin.applyMinPack(fromBase);
  }

  setPath (pathsToAdd) {
    // see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html
    if (!Array.isArray(pathsToAdd)) pathsToAdd = [pathsToAdd];
    process.env.PATH = pathsToAdd.concat([
      process.env.PATH,
      process.env.LAMBDA_TASK_ROOT,
    ]).join(':');
    return process.env.PATH;
  }

  setEnv (variablesToSet, shouldOverwrite) {
    for (var envVar in variablesToSet) {
      process.env[envVar] = (!shouldOverwrite && process.env[envVar])
        ? `${process.env[envVar]}:${variablesToSet[envVar]}`
        : variablesToSet[envVar];
    }
  }
}

module.exports = LambdaBin;
