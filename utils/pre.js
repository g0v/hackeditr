#!/usr/bin/env node

/* global exec */

require('shelljs/global');

if (!test('-L', 'app/node_modules')) {
  exec('ln -sf ../node_modules app/node_modules');
}
