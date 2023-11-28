#!/usr/bin/env zx
import 'zx/globals';
import {InputHandler, example, input, transpose} from '../helpers/index.mjs';

const inputHandler = new InputHandler(process.cwd());
const LETTER = 0;
const SPACE = '';

const part1 = (gsn, size) => {
  const calculatePower = (x, y) => {
    const rackId = x + 10;
    let powerlevel = rackId * y;
    powerlevel += gsn;
    powerlevel *= rackId;

    return Math.floor((powerlevel % 1000) / 100) - 5;
  };

  for (let x = 1; x <= size; x++) {
    for (let y = 1; y <= size; y++) {}
  }
};

// console.time('p1e');
// echo(`part1 -- example: ${ await part1(example)}`);
// console.timeEnd('p1e');
// console.time('p1');
echo(`part1 -- input: ${part1(8, 5)}`);
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
