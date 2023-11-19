#!/usr/bin/env zx
import "zx/globals"
import { fileToArr } from "../helpers/index.mjs"
const input = "../../input/day1/input.txt"
const example="../../input/day1/example.txt"

const emptyLine = '\n\n'
const line = '\n'

const part1 = (path) => 
    fileToArr(path, line)
        .reduce((acc, str) => acc+=((str[0] === '-') ? (-1*Number(str.slice(1))) : Number(str.slice(1))), 0)

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

const part2 = (path) => {
    const inputArr = fileToArr(path, line)
    let curr = 0
    let seen = new Set()
    while (true) {
        for (const str of inputArr) {
            if (seen.has(curr)) return curr
            seen.add(curr)
            curr += ((str[0] === '-') ? (-1*Number(str.slice(1))) : Number(str.slice(1)))
        }
    }
}

echo(`part2 -- example: ${part2(example)}`)
echo(`part2 -- input: ${part2(input)}`)
