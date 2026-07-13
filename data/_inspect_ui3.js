const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');
const i = h.indexOf('RANK_TABLE =');
console.log(h.slice(i - 200, i + 100));
console.log('window.statsForRank', h.includes('window.statsForRank'));
console.log('window.RANK_TABLE', h.includes('window.RANK_TABLE'));
// is horses in IIFE?
const j = h.lastIndexOf('[horses', i);
const k = h.indexOf('(function', i - 500);
console.log('context', h.slice(i - 400, i - 50));
// find IIFE wrapping horses
const horseStart = h.indexOf('// horse system') >= 0 ? h.indexOf('// horse system') : h.indexOf('ensureHorseState');
console.log(h.slice(horseStart, horseStart + 150));
const iife = h.lastIndexOf('(function()', i);
console.log('last IIFE before RANK', iife, h.slice(iife, iife + 80));
