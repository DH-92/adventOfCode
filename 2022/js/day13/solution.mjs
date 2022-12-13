#!/usr/bin/env zx
// import "zx/globals"
import fs from 'fs';
import { isArray } from 'util';
const day = "day13";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const fileToArr = (path, delim = '\n') => fs.readFileSync(path).toString().split(delim)

const echo = (...args) => console.log(...args);

const compare = (left, right, depth = 0) => {
    const isLeftArr = Array.isArray(left)
    const isRightArr = Array.isArray(right)
    // const pad = "  ".repeat(depth);
    // echo(pad, "- Compare ", left, " vs ", right)
    if (!isLeftArr && !isRightArr) {
        if (left === right) return 0;
        if (left < right) {
            // echo(pad, `  - Left side is smaller, so inputs are in the right order`, left, right)
            return -1;
        } else {
            // echo(pad, `  - Right side is smaller, so inputs are not in the right order`, left, right)
            return 1;
        }
    }
    if (isLeftArr && isRightArr) {
        for (let i = 0; i < right.length; i++) {
            if (left[i] === undefined) {
                // echo(pad, `- Left side ran out of items, so inputs are in the right order`, left, right)
                return -1;
            }
            const cc = compare(left[i], right[i], depth + 1);
            if (cc) return cc;
        }
        if (left.length === right.length) return 0;
        // echo(`- Right side ran out of items, so inputs are not in the right order`, left, right)
        return 1
    }
    return compare([].concat(left), [].concat(right), depth + 1)
}

const part1 = (path) => 
    fileToArr(path, '\n\n')
        .map(pair => pair.split('\n'))
        .reduce((sum, pair, index) => {
        const left = JSON.parse(pair[0])
        const right = JSON.parse(pair[1])
        return (compare(left, right) === 1) ? sum += index + 1 : sum
    },0)


const part2 = (path) => {
    const packets = fileToArr(path)
        .filter(packet => packet !== "")
        .map(JSON.parse)
        .concat('[[2]]', '[[6]]')
        .sort(compare)
    const recode = packets.map(JSON.stringify)
    return (recode.indexOf('[[2]]') + 1) * (recode.indexOf('[[6]]') + 1)
}

console.log(`part1 -- example: ${part1(example)}`)
console.log(`part1 -- input: ${part1(input)}`)

console.log(`part2 -- example: ${part2(example)}`)
console.log(`part2 -- input: ${part2(input)}`)
