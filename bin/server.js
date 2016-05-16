#!/usr/bin/env node
'use strict';

require('../server.babel'); // babel registration (runtime transpilation for node)
const path = require('path');
const rootDir = path.resolve(__dirname, '..');
/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

// handles live node reloads
if (__DEVELOPMENT__ && !require('piping')({hook: true, ignore: /(\/\.|~$|\.json|\.scss$)/i})) {
  return;
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
let WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'))
  .development(__DEVELOPMENT__)
  .server(rootDir, function serveApp() {
    require('../app/server');
  });
