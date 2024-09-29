const { execSync } = require('child_process');

const opts = { stdio: 'inherit' };

console.log('Cleaning common/build...');
execSync('rm -rf common/build', opts);
execSync('mkdir -p common/build', opts);

console.log('Installing dependencies...');
execSync('yarn install', opts);

console.log('Building common package...');
execSync('yarn workspace common build', opts);

console.log('re-installing common package...');
execSync('yarn install --check-files', opts);
