#!/usr/bin/env zx
import "zx/globals";
import fs from 'fs';
const day = "day15";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const fileToArr = (path, delim = '\n') => fs.readFileSync(path).toString().split(delim)

const manDist = (sx, sy, bx, by) => Math.abs(sx - bx) + Math.abs(sy - by);

const part1 = (path, ty) => {
    return fileToArr(path)
        .map(line =>
            line.split(' ')
                .map(word => word.replace(/[^0-9-]/g, ''))
                .filter(word => word !== "")
                .map(Number)
        )
        .map(([sx, sy, bx, by]) => {
            const r = manDist(sx, sy, bx, by);
            return [sx, sy, r]
        })
        .reduce((set, [sx, sy, md]) => {
            const w = md - Math.abs(sy - ty);
            for (let i = sx - w; i < sx + w; i++) set.add(i)
            return set;
        }, new Set()).size
}

const part2 = (path, maxXY) => {

    const lineRanges = [] //new Array(maxXY).fill(null).map(x => []);

    fileToArr(path)
        .map(line =>
            line.split(' ')
                .map(word => word.replace(/[^0-9-]/g, ''))
                .filter(word => word !== "")
                .map(Number)
        )
        .map(([sx, sy, bx, by]) => {
            const r = manDist(sx, sy, bx, by);
            return [sx, sy, r]
        })
        .forEach(([sx, sy, r]) => {
            for (let ty = Math.max(0, sy - r); ty <= Math.min(sy + r, maxXY); ty++) {
                const w = r - Math.abs(sy - ty);
                const range = [Math.max(0, sx - w), Math.min(sx + w, maxXY)]
                lineRanges[ty]
                    ? lineRanges[ty].push(range)
                    : lineRanges[ty] = [range];
            }
        })

    let row = maxXY;
    while (lineRanges.length) {
        const ranges = lineRanges.pop().sort((a, b) => a[0] - b[0]);
        let mergedRange = 0;
        ranges.every(([low, high]) => {
            if (high > mergedRange && low - 1 <= mergedRange) mergedRange = high
            return (mergedRange === maxXY) ? false : true;
        })
        if (mergedRange !== maxXY) return 4000000 * (mergedRange + 1) + row;
        row--;
    }
}
console.time()
console.log(`part1 -- example: ${part1(example, 10)}`)
console.timeLog()
console.log(`part1 -- input: ${part1(input, 2000000)}`)
console.timeLog()
console.log(`part1 -- example: ${part2(example, 20)}`)
console.timeLog()
console.log(`part1 -- input: ${part2(input, 4000000)}`)
console.timeLog()