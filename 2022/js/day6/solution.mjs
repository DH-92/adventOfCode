#!/usr/bin/env zx
import "zx/globals"
import { fileToArr } from "../helpers/index.mjs"
const day = "day6";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const isDistinct = (array) => (new Set(array)).size === array.length;

const parseInput = (path, target) => {
    const input = fileToArr(path, '')
    const stack = [];
    let pos = 0;
    while (input.length !== 0) {
        pos++;
        stack.push(input.shift())
        if (stack.length === target) {
            if (isDistinct(stack)) return pos;
            stack.shift()
        }
    }
}

echo(`part1 -- example: ${parseInput(example,4)}`)
echo(`part1 -- input: ${parseInput(input,4)}`)

echo(`part2 -- example: ${parseInput(example,14)}`)
echo(`part2 -- input: ${parseInput(input,14)}`)
