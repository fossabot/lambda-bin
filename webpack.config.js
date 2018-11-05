/* eslint-env node */
'use strict';

const path = require('path');

module.exports = {
  entry: [
    path.join(__dirname, 'index.js')
  ],
  output: {
    path: path.join(__dirname),
    filename: 'bundle.js',
    libraryTarget: 'umd'
  },
  target: 'node',
};
