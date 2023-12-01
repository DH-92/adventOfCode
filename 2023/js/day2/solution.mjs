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
    const chars = inputHandler.toArray(path, '');
    const words = inputHandler.toArray(path, word);
    const lines = inputHandler.toArray(path, line);
    const paragraphs = inputHandler.toArray(path, paragraph);
    return { chars, words, lines, paragraphs };
};

console.time('p1e');
console.log(`part1 -- example: ${JSON.stringify(part1(example))}`);
console.timeEnd('p1e');
console.time('p1');
console.log(`part1 -- input: ${JSON.stringify(part1(input))}`);
console.timeEnd('p1')

const part2 = path => {
    const chars = inputHandler.toArray(path, '');
    const words = inputHandler.toArray(path, word);
    const lines = inputHandler.toArray(path, line);
    const paragraphs = inputHandler.toArray(path, paragraph);
    return { chars, words, lines, paragraphs }
};

console.time('p2e');
console.log(`part2 -- example: ${JSON.stringify(part2(example))}`);
console.timeEnd('p2e');
console.time('p2');
console.log(`part2 -- input: ${JSON.stringify(part2(input))}`);
console.timeEnd('p2');
