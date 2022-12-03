#!/usr/bin/env zx
import "zx/globals"
import { sum, numSortR, fileToArr } from "../helpers/index.mjs"
const input = "../../input/day1/input.txt"
const example="../../input/day1/example.txt"

const emptyLine = '\n\n'
const line = '\n'

const part1 = (path) => 
    fileToArr(path, emptyLine)
        .map(elf => elf.split(line).reduce(sum, 0))
        .sort(numSortR)[0]

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

const part2 = (path) => 
    fileToArr(path,emptyLine)
        .map(elf => elf.split(line).reduce(sum, 0))
        .sort(numSortR)
        .slice(0, 3)
        .reduce(sum,0)

echo(`part2 -- example: ${part2(example)}`)
echo(`part2 -- input: ${part2(input)}`)
