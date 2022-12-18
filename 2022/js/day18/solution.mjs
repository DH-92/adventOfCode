#!/usr/bin/env zx
import "zx/globals";
import fs from 'fs';
const day = "day18";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const fileToArr = (path, delim = '\n') => fs.readFileSync(path).toString().split(delim)

const ROCK = "█"
const AIR = "▒"
const WATER = " "

const cts = (x, y, z) => `${x},${y},${z}`

const part1 = (path) => {
    const nodes = fileToArr(path)
        .map(l => l.split(','))
        .reduce((nodes, n) => nodes.add(cts(...n)), new Set())
    return [...nodes].reduce((tsa, n) => {
        const [x, y, z] = JSON.parse(`[${n}]`);
        if (nodes.has(cts(x, y, z - 1))) tsa--;
        if (nodes.has(cts(x, y, z + 1))) tsa--;
        if (nodes.has(cts(x, y - 1, z))) tsa--;
        if (nodes.has(cts(x, y + 1, z))) tsa--;
        if (nodes.has(cts(x - 1, y, z))) tsa--;
        if (nodes.has(cts(x + 1, y, z))) tsa--;
        return tsa;
    }, nodes.size*6)
}

const part2 = (path) => {
    const input = fileToArr(path)
    
    const bounds = {
        xMin: 999,
        xMax: 0,
        yMin: 999,
        yMax: 0,
        zMin: 999,
        zMax: 0,
    }

    input.forEach(n => {
        const [x, y, z] = JSON.parse(`[${n}]`).map(Number);
        if (x < bounds.xMin) bounds.xMin = x;
        if (x > bounds.xMax) bounds.xMax = x;
        if (y < bounds.yMin) bounds.yMin = y;
        if (y > bounds.yMax) bounds.yMax = y;
        if (z < bounds.zMin) bounds.zMin = z;
        if (z > bounds.zMax) bounds.zMax = z;
    })

    const grid = new Array(bounds.xMax + 1).fill(null).map(x => {
        return new Array(bounds.yMax + 1).fill(null).map(y => {
            return new Array(bounds.zMax + 1).fill(AIR)
        })
    })

    input.forEach(n => {
        const [x, y, z] = JSON.parse(`[${n}]`).map(Number);
        grid[x][y][z] = ROCK;
    })

    const airBubbles = {};
    let totalSurfaceArea = 0;
    grid.forEach((xArr, x) => {
        xArr.forEach((yArr, y) => {
            yArr.forEach((val, z) => {
                if (val !== ROCK) return;
                let surfaceArea = 6;
                if (grid[x]?.[y]?.[z - 1] === ROCK) { surfaceArea-- } else { airBubbles[`${x},${y},${z - 1}`] = true }
                if (grid[x]?.[y]?.[z + 1] === ROCK) { surfaceArea-- } else { airBubbles[`${x},${y},${z + 1}`] = true }
                if (grid[x]?.[y - 1]?.[z] === ROCK) { surfaceArea-- } else { airBubbles[`${x},${y - 1},${z}`] = true }
                if (grid[x]?.[y + 1]?.[z] === ROCK) { surfaceArea-- } else { airBubbles[`${x},${y + 1},${z}`] = true }
                if (grid[x - 1]?.[y]?.[z] === ROCK) { surfaceArea-- } else { airBubbles[`${x - 1},${y},${z}`] = true }
                if (grid[x + 1]?.[y]?.[z] === ROCK) { surfaceArea-- } else { airBubbles[`${x + 1},${y},${z}`] = true }
                totalSurfaceArea += surfaceArea;
            })
        })
    })

    Object.keys(airBubbles).forEach(n => {
        const [x, y, z] = JSON.parse(`[${n}]`).map(Number);
        if (
            x >= bounds.xMax ||
            x <= bounds.xMin ||
            y >= bounds.yMax ||
            y <= bounds.yMin ||
            z >= bounds.zMax ||
            z <= bounds.zMin
        ) {
            delete airBubbles[n]
        }
    })

    let changed = true;
    while (changed) {
        changed = false;
        grid.forEach((xArr, x) => {
            xArr.forEach((yArr, y) => {
                yArr.forEach((val, z) => {
                    if (val !== AIR) return;
                    if (
                        x >= bounds.xMax ||
                        x <= bounds.xMin ||
                        y >= bounds.yMax ||
                        y <= bounds.yMin ||
                        z >= bounds.zMax ||
                        z <= bounds.zMin ||
                        grid[x][y][z - 1] === WATER ||
                        grid[x][y][z + 1] === WATER ||
                        grid[x][y - 1][z] === WATER ||
                        grid[x][y + 1][z] === WATER ||
                        grid[x - 1][y][z] === WATER ||
                        grid[x + 1][y][z] === WATER
                    ) {
                        if (airBubbles[`${x},${y},${z}`]) delete airBubbles[`${x},${y},${z}`];
                        grid[x][y][z] = WATER;
                        changed = true;
                    }
                })
            })
        })
    }

    Object.keys(airBubbles).forEach(n => {
        const [x, y, z] = JSON.parse(`[${n}]`).map(Number);
        if (grid[x][y][z - 1] === ROCK) totalSurfaceArea--;
        if (grid[x][y][z + 1] === ROCK) totalSurfaceArea--;
        if (grid[x][y - 1][z] === ROCK) totalSurfaceArea--;
        if (grid[x][y + 1][z] === ROCK) totalSurfaceArea--;
        if (grid[x - 1][y][z] === ROCK) totalSurfaceArea--;
        if (grid[x + 1][y][z] === ROCK) totalSurfaceArea--;
    })
    return totalSurfaceArea;
}

console.log(`part1 -- example: ${part1(example)}`)
console.log(`part1 -- input: ${part1(input)}`)
console.log(`part1 -- input: ${part2(example)}`)
console.log(`part1 -- input: ${part2(input)}`)
