#!/usr/bin/env zx
import 'zx/globals';
import { InputHandler } from '../helpers/index.mjs';

const part1 = (gsn, size) => {
  const grid = new Array(size + 1).fill().map(_ => new Array(size + 1).fill().map(_ => 0));
  for (let x = 1; x <= size; x++) {
    for (let y = 1; y <= size; y++) {
      grid[y][x] = calculatePower(gsn, x, y);
    }
  }
  // console.table(grid);
  let maxV = 0;
  for (let s = 1; s <= 50; s++){
    for (let x = 1; x <= size-s; x++) {
      for (let y = 1; y <= size-s; y++) {
        let v = 0;
        for (let xx = 0; xx < s; xx++) {
          for (let yy = 0; yy < s; yy++) {
            v += grid[y+yy][x+xx]
          }
        }
        if (v > maxV) {
          console.log(`${x},${y},${s} => ${v}`);
          maxV = v;
        }
      }
    }
  }
  console.log(`------`)
};

// console.time('p1e');
// echo(`part1 -- example: ${ await part1(example)}`);
// console.timeEnd('p1e');
// console.time('p1');
echo(`part1 -- example: ${part1(18, 300)}`);
echo(`part1 -- example: ${part1(42, 300)}`);
echo(`part1 -- input: ${part1(2568, 300)}`);
// console.timeEnd('p1');

// const part2 = path => {
//   const input = inputHandler.toArray(path, word).map(Number);
//   const node = (childCount = input.shift(), metaCount = input.shift()) => {
//     if (!childCount) {
//       return new Array(metaCount).fill().reduce(sum => sum + input.shift(), 0);
//     }
//     const children = new Array(childCount).fill().map(_ => node());
//     return new Array(metaCount).fill().reduce(sum => sum + (children[input.shift() - 1] ?? 0), 0);

//   };
//   return node();
// };

// console.time('p2e');
// echo(`part2 -- example: ${part2(example)}`);
// console.timeEnd('p2e');
// console.time('p2');
// echo(`part2 -- input: ${part2(input)}`);
// console.timeEnd('p2');
