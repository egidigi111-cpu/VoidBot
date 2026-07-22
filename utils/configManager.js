const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'data', 'config.json');

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function writeConfig(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

function get(key) {
  const config = readConfig();
  return config[key];
}

function set(key, value) {
  const config = readConfig();
  config[key] = value;
  writeConfig(config);
  return config;
}

function getAll() {
  return readConfig();
}

module.exports = { readConfig, writeConfig, get, set, getAll };
