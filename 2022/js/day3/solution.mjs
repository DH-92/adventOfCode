#!/usr/bin/env zx
import "zx/globals"
import {
    fileToArr,
    stringBisect,
    stringFindCommon,
    reshape,
    sum,
} from "../helpers/index.mjs"
const day = "day3";
const input = `../../input/${day}/input.txt`
const example= `../../input/${day}/example.txt`

const lowerCharToScore = (c) => c.charCodeAt(0) - 96;
const charToScore = (c) => lowerCharToScore(c.toLowerCase()) + ((c === c.toLowerCase()) ? 0 : 26);

const part1 = (path) =>
    fileToArr(path)
        .map(stringBisect)
        .map(([head, tail]) => stringFindCommon(head,tail)[0])
        .map(charToScore)
        .reduce(sum)

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

const part2 = (path) => 
    reshape(fileToArr(path), 3)
        .map(([a, b, c]) => stringFindCommon(stringFindCommon(a,b),c)[0])
        .map(charToScore)
        .reduce(sum)

echo(`part2 -- example: ${part2(example)}`)
echo(`part2 -- input: ${part2(input)}`)
