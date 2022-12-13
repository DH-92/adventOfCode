#!/usr/bin/env zx
import fs from 'fs';
const day = "day13";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const fileToArr = (path, delim = '\n') => fs.readFileSync(path).toString().split(delim)

const compare = (left, right) => {
    const isLeftArr = Array.isArray(left)
    const isRightArr = Array.isArray(right)
    if (!isLeftArr && !isRightArr) return (left === right) ? 0 : (left < right) ? -1 : 1;
    if (isLeftArr && isRightArr) {
        for (let i = 0; i < right.length; i++) {
            if (left[i] === undefined) return -1;
            const cc = compare(left[i], right[i]);
            if (cc) return cc;
        }
        return (left.length === right.length) ? 0 : 1;
    }
    return compare([].concat(left), [].concat(right))
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
    const recode = fileToArr(path)
        .filter(packet => packet !== "")
        .concat('[[2]]', '[[6]]')
        .map(JSON.parse)
        .sort(compare)
        .map(JSON.stringify)
    return (recode.indexOf('[[2]]') + 1) * (recode.indexOf('[[6]]') + 1)
}

console.log(`part1 -- example: ${part1(example)}`)
console.log(`part1 -- input: ${part1(input)}`)

console.log(`part2 -- example: ${part2(example)}`)
console.log(`part2 -- input: ${part2(input)}`)