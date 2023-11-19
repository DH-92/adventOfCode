#!/usr/bin/env zx
import 'zx/globals';
import {InputHandler, example, input, sum, word} from '../helpers/index.mjs';

const inputHandler = new InputHandler(process.cwd());

const part1 = path => {
  const input = inputHandler.toArray(path, word).map(Number);
  let res = 0;
  const node = (childCount = input.shift(), metaCount = input.shift()) => {
    for (let child = 0; child < childCount; child++) node();
    for (let meta = 0; meta < metaCount; meta++) res += input.shift();
  };
  node();
  return res;
};

console.time('p1e');
echo(`part1 -- example: ${part1(example)}`);
console.timeEnd('p1e');
console.time('p1');
echo(`part1 -- input: ${part1(input)}`);
console.timeEnd('p1');

const part2 = path => {
  const input = inputHandler.toArray(path, word).map(Number);
  const node = (childCount = input.shift(), metaCount = input.shift()) => {
    if (!childCount) {
      return new Array(metaCount).fill().reduce(sum => sum + input.shift(), 0);
    }   
    const children = new Array(childCount).fill().map(_ => node());
    return new Array(metaCount).fill().reduce(sum => sum + (children[input.shift() - 1] ?? 0), 0);

  };
  return node();
};

console.time('p2e');
echo(`part2 -- example: ${part2(example)}`);
console.timeEnd('p2e');
console.time('p2');
echo(`part2 -- input: ${part2(input)}`);
console.timeEnd('p2');
