const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const keys = new Set();
const re = /data-i18n(?:-html|-placeholder|-aria-label)?="([^"]+)"/g;
let m;
while ((m = re.exec(html))) keys.add(m[1]);

const en = require('../static/i18n/en.json');
function get(o, p) {
  return p.split('.').reduce((a, c) => (a == null ? undefined : a[c]), o);
}

const missing = [...keys].filter((k) => get(en, k) == null);
console.log('html keys', keys.size);
console.log('missing in en', missing);
if (missing.length) process.exit(1);
console.log('ok');
