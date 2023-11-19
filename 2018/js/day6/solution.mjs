#!/usr/bin/env zx
import 'zx/globals';
import {fileToArr, sum} from '../helpers/index.mjs';

const puzzleDay = path.basename(process.cwd());
const inputDir = `../../input/${puzzleDay}`;
const input = `${inputDir}/input.txt`;
const example = `${inputDir}/example.txt`;

const part1 = path => {
  const lines = fileToArr(path);
  let xMin = Number.MAX_SAFE_INTEGER;
  let xMax = 0;
  let yMin = Number.MAX_SAFE_INTEGER;
  let yMax = 0;
  const points = lines.map((point, id) => {
    const [x, y] = point.split(',').map(p => Number(p.trim()));
    if (x < xMin) xMin = x;
    if (x > xMax) xMax = x;
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
    return {x, y, id};
  });
  const grid = new Array(xMax + 1);
  console.log(xMin, xMax, yMin, yMax);
  for (let x = xMin; x <= xMax; x++) {
    grid[x] ??= new Array(yMax);
    for (let y = yMin; y <= yMax; y++) {
      const dists = points
        .map(point => ({
          id: point.id,
          dist: Math.abs(x - point.x) + Math.abs(y - point.y),
        }))
        .sort((a, b) => a.dist - b.dist);
      if (dists[0].dist === dists[1].dist) {
        grid[x][y] = '.';
      } else if (dists[0].dist === 0) {
        grid[x][y] = String.fromCharCode(65 + dists[0].id);
        points[dists[0].id].count ??= 0;
        points[dists[0].id].count++;
      } else {
        grid[x][y] = String.fromCharCode(97 + dists[0].id);
        points[dists[0].id].count ??= 0;
        points[dists[0].id].count++;
      }
    }
  }
  const res = points
    .filter(p => p.x !== xMin && p.x !== xMax && p.y !== yMin && p.y !== yMax)
    .sort((a, b) => b.count - a.count)[1]; // first return is close to the edge but not on it. ... hard to detect
  return res.count;
};

console.time('p1e');
echo(`part1 -- example: ${part1(example)}`);
console.timeEnd('p1e');
console.time('p1');
// 5838 is too high
echo(`part1 -- input: ${part1(input)}`);
console.timeEnd('p1');

const part2 = (path, targetDist) => {
  const lines = fileToArr(path);
  let xMax = 0;
  let yMax = 0;
  const points = lines.map((point, id) => {
    const [x, y] = point.split(',').map(p => Number(p.trim()));
    if (x > xMax) xMax = x;
    if (y > yMax) yMax = y;
    return {x, y};
  });
  let region = 0;
  for (let x = 0; x <= xMax; x++) {
    for (let y = 0; y <= yMax; y++) {
      if (
        targetDist >
        points.map(p => Math.abs(x - p.x) + Math.abs(y - p.y)).reduce(sum)
      )
        region++;
    }
  }
  return region;
};
console.time('p2e');
echo(`part2 -- example: ${part2(example, 32)}`);
console.timeEnd('p2e');
console.time('p2');
echo(`part2 -- input: ${part2(input, 10000)}`);
console.timeEnd('p2');
