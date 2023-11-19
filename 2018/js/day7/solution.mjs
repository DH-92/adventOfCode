#!/usr/bin/env zx
import 'zx/globals';
import {fileToArr, sum} from '../helpers/index.mjs';

const puzzleDay = path.basename(process.cwd());
const inputDir = `../../input/${puzzleDay}`;
const input = `${inputDir}/input.txt`;
const example = `${inputDir}/example.txt`;

const part1 = path => {
  const steps = {};
  const reqs = fileToArr(path).map(x => {
    const [, a, , , , , , b] = x.split(' ');
    steps[a] ??= [];
    steps[b] ??= [];
    steps[b].push(a);
  });
  let res = [];
  while (Object.keys(steps).length) {
    const next = Object.entries(steps)
      .filter(a => a[1].length === 0)
      .sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0))[0][0];
    res.push(next);
    delete steps[next];
    Object.keys(steps).forEach(step => {
      steps[step] = steps[step].filter(r => r !== next);
    });
  }
  return res.join('');
};

console.time('p1e');
echo(`part1 -- example: ${part1(example)}`);
console.timeEnd('p1e');
console.time('p1');
echo(`part1 -- input: ${part1(input)}`);
console.timeEnd('p1');

const part2 = (path, workerCount, stepTime) => {
  const steps = {};
  const reqs = fileToArr(path).map(x => {
    const [, a, , , , , , b] = x.split(' ');
    steps[a] ??= [];
    steps[b] ??= [];
    steps[b].push(a);
  });
  const workers = new Array(workerCount)
    .fill(0)
    .map((w, i) => ({remaining: 0, job: null, id: i + 1}));
  let t = 0;
  while (Object.keys(steps).length || workers.filter(w => w.job).length) {
    workers
      .sort((a, b) => b.remaining - a.remaining)
      .forEach(worker => {
        if (worker.remaining > 1) {
          worker.remaining--;
          return;
        }
        if (worker.job) {
          Object.keys(steps).forEach(step => {
            steps[step] = steps[step].filter(r => r !== worker.job);
          });
          worker.job = null;
        }
        const avail = Object.entries(steps)
          .filter(a => a[1].length === 0)
          .sort((a, b) => a[0].charCodeAt(0) - b[0].charCodeAt(0));
        if (avail.length) {
          const next = avail[0][0];
          worker.remaining = stepTime + next.charCodeAt(0) - 64;
          worker.job = next;
          delete steps[next];
        }
      });
    t++;
  }
  return t-1;
};
console.time('p2e');
echo(`part2 -- example: ${part2(example, 2, 0)}`);
console.timeEnd('p2e');
console.time('p2');
echo(`part2 -- input: ${part2(input, 5, 60)}`);
console.timeEnd('p2');
