#!/usr/bin/env zx
import 'zx/globals';
import {fileToArr} from '../helpers/index.mjs';

const puzzleDay = path.basename(process.cwd());
const inputDir = `../../input/${puzzleDay}`;
const input = `${inputDir}/input.txt`;
const example = `${inputDir}/example.txt`;

const guard = "Guard"
const falls = "falls"
const wakes = "wakes"

const part1 = path => {
  const lines = fileToArr(path);
  const guards = {}
  let activeGuard;
  let startSleep = null;
  lines.sort().map(event => {
    const [ _date, rawTime, action, rawGuard] = event.split(' ')
    const time = rawTime.split(']')[0].split(':')[1]

    if (action === guard) {
      activeGuard = rawGuard.split('#')[1]
      guards[activeGuard] ??= { id: activeGuard, total: 0, times: new Array(60).fill(0) }
    } else if (action === falls) {
      startSleep = time;
    } else { //action === wakes
      guards[activeGuard].total = guards[activeGuard].total + Number(time-startSleep)
      for (let m=startSleep; m <time; m++) guards[activeGuard].times[m]++
    }   
  })

  const bigG = Object.values(guards).sort((g1,g2) => g2.total - g1.total)[0]
  const bigM = bigG.times.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax);
  return bigG.id * bigM
};

echo(`part1 -- example: ${part1(example)}`);
echo(`part1 -- input: ${part1(input)}`);

const part2 = path => {
  const lines = fileToArr(path);
  const guards = {}
  let activeGuard;
  let startSleep;
  lines.sort().map(event => {
    const [ _date, rawTime, action, rawGuard] = event.split(' ')
    const time = rawTime.split(']')[0].split(':')[1]

    if (action === guard) {
      activeGuard = rawGuard.split('#')[1]
      guards[activeGuard] ??= { id: activeGuard, times: new Array(60).fill(0) }
    } else if (action === falls) {
      startSleep = time
    } else {
      for (let m=startSleep; m <time; m++) guards[activeGuard].times[m]++
    }
  })
  const bigG = Object.values(guards)
    .map(g => { 
      g.maxTime = g.times.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax)
      return g
    })
    .sort((g1,g2) => g2.times[g2.maxTime] - g1.times[g1.maxTime])[0]
  return bigG.id * bigG.maxTime
};

echo(`part2 -- example: ${part2(example)}`);
echo(`part2 -- input: ${part2(input)}`);
