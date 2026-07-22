const fs = require('fs');
const path = require('path');

const LEVELING_PATH = path.join(__dirname, '..', 'data', 'leveling.json');

function readLeveling() {
  if (!fs.existsSync(LEVELING_PATH)) {
    fs.writeFileSync(LEVELING_PATH, '{}');
  }
  return JSON.parse(fs.readFileSync(LEVELING_PATH, 'utf8'));
}

function writeLeveling(data) {
  fs.writeFileSync(LEVELING_PATH, JSON.stringify(data, null, 2));
}

function getXP(level) {
  return 5 * (level * level) + 50 * level + 100;
}

function getUser(userId) {
  const data = readLeveling();
  if (!data[userId]) {
    data[userId] = { xp: 0, level: 0, messages: 0 };
    writeLeveling(data);
  }
  return data[userId];
}

function addXP(userId, amount = 15) {
  const data = readLeveling();
  if (!data[userId]) {
    data[userId] = { xp: 0, level: 0, messages: 0 };
  }

  data[userId].xp += amount;
  data[userId].messages += 1;

  const currentLevel = data[userId].level;
  const xpNeeded = getXP(currentLevel);

  let leveledUp = false;
  if (data[userId].xp >= xpNeeded) {
    data[userId].level += 1;
    data[userId].xp = 0;
    leveledUp = true;
  }

  writeLeveling(data);
  return { ...data[userId], leveledUp };
}

function getLeaderboard(limit = 10) {
  const data = readLeveling();
  return Object.entries(data)
    .map(([userId, info]) => ({ userId, ...info }))
    .sort((a, b) => {
      const aTotal = a.level * 1000 + a.xp;
      const bTotal = b.level * 1000 + b.xp;
      return bTotal - aTotal;
    })
    .slice(0, limit);
}

module.exports = { getUser, addXP, getLeaderboard, getXP };
