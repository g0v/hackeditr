#!/usr/bin/env node

'use strict';

/* global exec, mkdir, cp, rm, cd, env, exit */

require('shelljs/global');

mkdir('-p', 'dist');
mkdir('-p', 'dist/node_modules/bootstrap/dist/fonts');

var ret = exec('npm run build');
if (ret.code !== 0) {
  console.error('npm run build does not generate bundle.js');
  return exit(1);
} else {
  if(test('-f', 'app/bundle.js')) {
    cp('-f', 'app/bundle.js', 'dist/bundle.js');
  }
}

cp('-f', 'app/*.html', 'dist');
cp('-Rf', 'node_modules/bootstrap/dist/fonts/*', 'dist/node_modules/bootstrap/dist/fonts');

rm('-rf', 'out');
exec('git clone "https://' + env.GH_TOKEN + '@' + env.GH_REF + '" --depth 1 -b gh-pages out');
cd('out');
exec('git config user.name "Travis CI"');
exec('git config user.email "chialin.shr@gmail.com"');
cp('-Rf', '../dist/*', '.');
exec('git add .');
exec('git commit --allow-empty -m "Automatic commit: ' + Date() + '"');
exec('git push "https://' + env.GH_TOKEN + '@' + env.GH_REF + '" gh-pages', {silent: true});

return exit(0);
