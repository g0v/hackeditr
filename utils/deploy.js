#!/usr/bin/env node

require('shelljs/global');
require('shelljs/make');

mkdir('-p', 'dist');
mkdir('-p', 'dist/node_modules/bootstrap/dist/fonts');

exec('npm run build', function(code, output) {
  if (code !== 0) {
    console.log('fail');
  } else {
    if(test('-f', 'app/bundle.js')) {
      cp('-f', 'app/bundle.js', 'dist/bundle.js');
    }
  }
});

cp('-f', 'app/index.html', 'dist/index.html');
cp('-f', 'app/dialog.html', 'dist/dialog.html');
cp('-Rf', 'node_modules/bootstrap/dist/fonts/*', 'dist/node_modules/bootstrap/dist/fonts');

rm('-rf', 'out');
exec('git clone "https://' + env.GH_TOKEN + '@' + env.GH_REF + '" --depth 1 -b gh-pages out');
cd('out');
exec('git config user.name "Travis CI"');
exec('git config user.email "chialin.shr@gmail.com"');
cp('-Rf', '../dist/*', '.');
exec('git add .');
exec('git commit --allow-empty -m "Automatic commit: ' + Date() + '"');
exec('git push "https://' + env.GH_TOKEN + '@' + env.GH_REF + '" gh-pages', {silent:true});

exit(0);
