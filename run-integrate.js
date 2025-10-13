const { createRequire } = require('module');
const requireCjs = createRequire(import.meta.url);
requireCjs('./dist/scripts/integrate.js');
