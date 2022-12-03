#!/usr/bin/env zx
import "zx/globals"
import {
    fileToArr,
    sum,
} from "../helpers/index.mjs"
const day = "day4";
const input = `../../input/${day}/input.txt`
const example= `../../input/${day}/example.txt`

const part1 = (path) => {
    const sacks = fileToArr(path)

    return sacks.map(stringBisect)
        .map(pair => {
            const [head, tail] = pair;
            return stringFindCommon(head, tail)[0];
        })
        .map(charToScore)
        .reduce(sum)
}

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

const part2 = (path) => {
    const sacks = fileToArr(path)

    return reshape(sacks, 3)
        .map(([a, b, c]) => stringFindCommon(stringFindCommon(a,b),c)[0])
        .map(charToScore)
        .reduce(sum)
}

echo(`part2 -- example: ${part2(example)}`)
echo(`part2 -- input: ${part2(input)}`)
