#!/usr/bin/env zx
import 'zx/globals';
import {
  InputHandler,
  example,
  input,
  line,
  paragraph,
  word,
} from '../helpers/index.mjs';

const inputHandler = new InputHandler(process.cwd());

const part1 = path => {
  const startTime = Date.now()
  const [stateLine, rulesLines] = inputHandler.toArray(path, paragraph);
  const rules = rulesLines.split(line).reduce((acc, l) => {
    const [a, _, b] = l.split(word);
    acc[a] = b;
    return acc;
  }, {});
  const initState = `...${stateLine.split(word)[2]}`.split('');
  let state = initState
  for (let gen = 0; gen < 20; gen++) {
    const oldState = `..${state.join('')}....`.split('');
    const newState = []
    for (let i = 0; i <= oldState.length; i++) {
      const key = oldState.slice(i, i + 5).join('')
      const val = rules[key] ?? '.'
      newState[i+2] = val
    }
    state = newState.slice(2);
    while (state.slice(-5).join('') === ".....") {
      state.pop()
    }
  }
  return state.reduce((acc, v, i) => {
    if (v === '#') acc += i-3
    return acc
  }, 0)
};

console.time('p1e');
echo(`part1 -- example: ${part1(example)}`);
console.timeEnd('p1e');
console.time('p1');
echo(`part1 -- input: ${part1(input)}`);
console.timeEnd('p1');

// const part2 = (path) => {
//   const startTime = Date.now()
//   const [stateLine, rulesLines] = inputHandler.toArray(path, paragraph);
//   const rules = rulesLines.split(line).reduce((acc, l) => {
//     const [a, _, b] = l.split(word);
//     acc[a] = b;
//     return acc;
//   }, {});
//   const initState = `...${stateLine.split(word)[2]}`.split('');
//   let state = initState
//   for (let gen = 0; gen < 50000000000; gen++) {
//     // const oldState = `..${state.join('')}....`.split('');
//     // const newState = []
//     // for (let i = 0; i <= oldState.length; i++) {
//     //   const key = oldState.slice(i, i + 5).join('')
//     //   const val = rules[key] ?? '.'
//     //   newState[i+2] = val
//     // }
//     // state = newState.slice(2);
//     // while (state.slice(-5).join('') === ".....") {
//     //   state.pop()
//     // }
//   }
//   return state.reduce((acc, v, i) => {
//     if (v === '#') acc += i-3
//     return acc
//   }, 0)
// };
// console.time('p2e');
// echo(`part2 -- example: ${part2(example)}`);
// console.timeEnd('p2e');
// console.time('p2');
// echo(`part2 -- input: ${part2(input)}`);
// console.timeEnd('p2');
