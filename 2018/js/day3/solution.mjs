#!/usr/bin/env zx
import 'zx/globals';
import {fileToArr} from '../helpers/index.mjs';

const puzzleDay = path.basename(process.cwd());
const inputDir = `../../input/${puzzleDay}`;
const input = `${inputDir}/input.txt`;
const example = `${inputDir}/example.txt`;

const part1 = path => {
  const lines = fileToArr(path);
  const touched = new Set();
  const reallyTouched = new Set();
  for (const l of lines) {
    const line = l.split(' ');
    const pos = line[2].split(':')[0].split(',').map(Number);
    const size = line[3].split('x').map(Number);
    const area = {
      y1: 1 + pos[0],
      y2: pos[0] + size[0],
      x1: 1 + pos[1],
      x2: pos[1] + size[1],
    };
    for (let x = area.x1; x <= area.x2; x++)
      for (let y = area.y1; y <= area.y2; y++) {
        const key = `${y},${x}`;
        touched.has(key) ? reallyTouched.add(key) : touched.add(key);
      }
  }
  return reallyTouched.size;
};

echo(`part1 -- example: ${part1(example)}`);
echo(`part1 -- input: ${part1(input)}`);

const part2 = path => {
  const touched = new Set();
  const reallyTouched = new Set();
  const lines = fileToArr(path);
  lines.forEach((l, id) => {
    const line = l.split(' ');
    const pos = line[2].split(':')[0].split(',').map(Number);
    const size = line[3].split('x').map(Number);
    const area = {
      y1: 1 + pos[0],
      y2: pos[0] + size[0],
      x1: 1 + pos[1],
      x2: pos[1] + size[1],
    };
    for (let x = area.x1; x <= area.x2; x++) {
      for (let y = area.y1; y <= area.y2; y++) {
        const key = `${y},${x}`;
        if (touched.has(key)) {
          reallyTouched.add(key);
        } else {
          touched.add(key);
        }
      }
    }
  });
  let nonToucherId = 0;
  lines.forEach((l, id) => {
    const line = l.split(' ');
    const pos = line[2].split(':')[0].split(',').map(Number);
    const size = line[3].split('x').map(Number);
    const area = {
      y1: 1 + pos[0],
      y2: pos[0] + size[0],
      x1: 1 + pos[1],
      x2: pos[1] + size[1],
    };
    let isToucher = false;
    for (let x = area.x1; x <= area.x2; x++)
      for (let y = area.y1; y <= area.y2; y++) {
        const key = `${y},${x}`;
        if (reallyTouched.has(key)) isToucher = true;
      }
    if (!isToucher) nonToucherId = id + 1;
  });
  return nonToucherId;
};

echo(`part2 -- example: ${part2(example)}`);
echo(`part2 -- input: ${part2(input)}`);
