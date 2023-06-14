const { readFileSync, writeFileSync } = require('fs');

const manifestFilePath = './dist/manifest.json';

const buffer = readFileSync(manifestFilePath);
const manifest = JSON.parse(buffer);

delete manifest['$schema'];

const json = JSON.stringify(manifest, null, 2);

writeFileSync(manifestFilePath, json);
