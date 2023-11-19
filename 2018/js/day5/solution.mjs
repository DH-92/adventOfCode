#!/usr/bin/env zx
import 'zx/globals';
import {fileToString} from '../helpers/index.mjs';

const puzzleDay = path.basename(process.cwd());
const inputDir = `../../input/${puzzleDay}`;
const input = `${inputDir}/input.txt`;
const example = `${inputDir}/example.txt`;

const part1 = path => {
  const line = fileToString(path);
  const lineArr = line.split('');
  while (true) {
    let clean = true;
    let startPos = 1;
    for (let i = startPos; i < lineArr.length; i++) {
      if (
        lineArr[i - 1] !== lineArr[i] &&
        lineArr[i - 1].toLowerCase() === lineArr[i].toLowerCase()
      ) {
        lineArr.splice(i - 1, 2);
        clean = false;
        startPos = i = i > 3 ? i - 2 : 1;
      }
    }
    if (clean) break;
  }
  return lineArr.length;
};

console.time('p1e');
echo(`part1 -- example: ${part1(example)}`);
console.timeEnd('p1e');
console.time('p1');
echo(`part1 -- input: ${part1(input)}`);
console.timeEnd('p1');

const part2 = path => {
  const lineArr = fileToString(path).split('');
  return 'abcdefghijklmnopqrstuvwxyz'.split('').reduce((min, candidate) => {
    const polymer = lineArr.filter(
      x => x !== candidate && x.toLowerCase() !== candidate.toLowerCase()
    );
    while (true) {
      let clean = true;
      let startPos = 1;
      for (let i = startPos; i < polymer.length; i++) {
        if (
          polymer[i - 1] !== polymer[i] &&
          polymer[i - 1].toLowerCase() === polymer[i].toLowerCase()
        ) {
          polymer.splice(i - 1, 2);
          clean = false;
          startPos = i = i > 3 ? i - 2 : 1;
        }
      }
      if (clean) break;
    }
    return polymer.length < min ? polymer.length : min;
  }, Number.MAX_SAFE_INTEGER);
};
console.time('p2e');
echo(`part2 -- example: ${part2(example)}`);
console.timeEnd('p2e');
console.time('p2');
echo(`part2 -- input: ${part2(input)}`);
console.timeEnd('p2');
