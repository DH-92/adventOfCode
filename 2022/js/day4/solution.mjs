#!/usr/bin/env zx
import "zx/globals"
import {
    fileToArr,
    sum,
    numSort,
} from "../helpers/index.mjs"
const day = "day4";
const input = `../../input/${day}/input.txt`
const example= `../../input/${day}/example.txt`

const isInside = (target, low, high) =>
    target === low ||
    target === high ||
    target === [target, low, high].sort(numSort)[1]

const isSubSet = (a, b) => {
    const [short, long] = [a, b].sort((a, b) => +a.length - b.length);
    return isInside(short.min, long.min, long.max) &&
        isInside(short.max, long.min, long.max)
}

const isIntersecting = (a, b) => isInside(a.min, b.min, b.max) || isInside(a.max, b.min, b.max)

const toRange = (range) => {
    const [min, max] = range.split('-')
    return { min, max, length: 1 + max - min }
}

const part1 = (path) =>
    fileToArr(path)
        .map(line => line.split(','))
        .map(pair => isSubSet(toRange(pair[0]), toRange(pair[1])))
        .reduce(sum)

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

const part2 = (path) => 
    fileToArr(path)
        .map(line => line.split(','))
        .map(pair => isIntersecting(toRange(pair[0]), toRange(pair[1])))
        .reduce(sum)

echo(`part2 -- example: ${part2(example)}`)
echo(`part2 -- input: ${part2(input)}`)
