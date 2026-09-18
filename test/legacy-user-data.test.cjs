'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { join } = require('node:path');
const loadTs = require('./load-ts.cjs');

const { legacyUserDataPath } = loadTs('src/main/legacyUserData.ts');
const parent = join('/profiles', 'app-data');
const current = join(parent, 'hanakami');

test('an existing profile wins over legacy data', () => {
  const existing = new Set([join(current, 'config.json'), join(parent, 'munder-difflin', 'config.json')]);
  assert.equal(legacyUserDataPath(current, (path) => existing.has(path)), null);
});

test('an existing installation keeps its complete profile directory', () => {
  const legacy = join(parent, 'munder-difflin');
  assert.equal(legacyUserDataPath(current, (path) => path === join(legacy, 'config.json')), legacy);
});

test('a fresh installation uses the new profile directory', () => {
  assert.equal(legacyUserDataPath(current, () => false), null);
});
