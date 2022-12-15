#!/usr/bin/env zx
import "zx/globals";
import fs from 'fs';
const day = "day14";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const fileToArr = (path, delim = '\n') => fs.readFileSync(path).toString().split(delim)

const sandDown = ([x, y]) => [x, y + 1];
const sandLeft = ([x, y]) => [x - 1, y];
const sandRight = ([x, y]) => [x + 1, y];

const part1 = (path) => {
    const lineGroups = fileToArr(path, '\n');
    const grid = new Array(1000).fill(null).map(x => [])
    let height = 0;
    lineGroups.forEach(group => group
        .split(' -> ')
        .map(line => line.split(',').map(Number))
        .reduce(([x2, y2], [x, y]) => {
            if (height < y) height = y;
            if (x === x2) {
                const [low, high] = [y2, y].sort((a, b) => a - b)
                for (let i = low; i <= high; i++) grid[i][x] = "#";
            } else {
                const [low, high] = [x2, x].sort((a, b) => a - b)
                for (let i = low; i <= high; i++) grid[y][i] = "#";
            }
            return [x, y]
        })
    )
    let final = 0;
    let count = 0;
    while (true) {
        if (final) break;
        let sandPos = [500, 0];
        while (true) {
            if (final) break;
            const [x, y] = sandPos;
            sandPos = sandDown(sandPos);
            if (y + 1 >= height + 2) {
                grid[y][x] = "O";
                break;
            }
            const down = grid[y + 1][x]
            if (!down) continue;
            const downLeft = grid[+y + 1][+x - 1]
            const downRight = grid[+y + 1][+x + 1]
            if (downLeft && downRight) {
                if (y === 0) final = ++count;
                grid[y][x] = "O";
                break;
            }
            sandPos = (downLeft)
                ? sandRight(sandPos)
                : sandLeft(sandPos);
        }
        count++;
    }
    return final;
}
console.profile()
console.log(`part1 -- example: ${part1(example)}`)
// console.log(`user output should be greater than 359`)
console.log(`part1 -- input: ${part1(input)}`)
console.profileEnd()
// console.log(`part2 -- example: ${part2(example)}`)
// console.log(`part2 -- input: ${part2(input)}`)