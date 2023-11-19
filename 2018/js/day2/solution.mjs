#!/usr/bin/env zx
import 'zx/globals';
import {fileToArr} from '../helpers/index.mjs';
const input = '../../input/day2/input.txt';
const example = '../../input/day2/example.txt';
const example2 = '../../input/day2/example2.txt';

const emptyLine = '\n\n';
const line = '\n';

const alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');

const part1 = path => {
  return fileToArr(path, line)
    .reduce(
      (acc, str) => {
        const hits = [];
        alpha.forEach(char => {
          if (str.split(char).length === 3) hits[2] = true;
          if (str.split(char).length === 4) hits[3] = true;
        });
        acc[0] += hits[2] ? 1 : 0;
        acc[1] += hits[3] ? 1 : 0;
        return acc;
      },
      [0, 0]
    )
    .reduce((a, x) => a * x);
};

echo(`part1 -- example: ${part1(example)}`);
echo(`part1 -- input: ${part1(input)}`);

const part2 = path => {
  const inputArr = fileToArr(path, line).sort();
  for (let i = 0; i < inputArr.length; i++) {
    for (let j = i + 1; j < inputArr.length; j++) {
      const diffs = [];
      const a = inputArr[i];
      const b = inputArr[j];
      for (let c = 0; c < a.length; c++) {
        if (a[c] !== b[c]) diffs.push(c);
        if (diffs.length > 1) break;
      }
      if (diffs.length === 1)
        return a.replace(new RegExp(`${a[diffs[0]]}`, 'g'), '');
    }
  }
};

echo(`part2 -- example: ${part2(example2)}`);
echo(`part2 -- input: ${part2(input)}`);
