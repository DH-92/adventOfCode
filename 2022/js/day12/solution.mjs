#!/usr/bin/env zx
// import "zx/globals"
import fs from 'fs';
const day = "day12";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const fileToArr = (path, delim = '\n') => fs.readFileSync(path).toString().split(delim)

class Node {
    dist = Number.MAX_SAFE_INTEGER;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const part1 = (path) => {
    let current;
    const nodes = fileToArr(path).map((row, y) =>
        row.split('')
            .map((char, x) => {
                if (char === 'S') return current = new Node(x, y, 1)
                if (char === 'E') return new Node(x, y, 27)
                return new Node(x, y, char.charCodeAt(0) - 96)
            })
    )
    const remaining = nodes.flat()
    current.dist = 0;
    while (true) {
        if (!current) break;
        if (current.z === 27) return current.dist;
        [
            nodes[current.y]?.[current.x - 1],
            nodes[current.y]?.[current.x + 1],
            nodes[current.y - 1]?.[current.x],
            nodes[current.y + 1]?.[current.x],
        ].forEach(neighbour => {
            if (neighbour?.z - 1 <= current.z
                && remaining.includes(neighbour)
                && neighbour?.dist >= current.dist
            ) neighbour.dist = current.dist+1;
        })
        current = remaining.sort((a, b) => a.dist - b.dist).shift();
    }
}

const part2 = (path) => {
    let current;
    const nodes =
        fileToArr(path).map((row, y) =>
            row.split('')
                .map((char, x) => {
                    if (char === 'E') return current = new Node(x, y, 27)
                    if (char === 'S') return new Node(x, y, 1);
                    return new Node(x, y, char.charCodeAt(0) - 96)
                }))
    const remaining = nodes.flat()
    current.dist = 0;
    while (true) {
        if (!current) break;
        [
            nodes[current.y]?.[current.x - 1],
            nodes[current.y]?.[current.x + 1],
            nodes[current.y - 1]?.[current.x],
            nodes[current.y + 1]?.[current.x],
        ].forEach(neighbour => {
            if (neighbour?.z + 1 >= current.z
                && remaining.includes(neighbour)
                && neighbour?.dist >= current.dist
            ) neighbour.dist = current.dist+1;
        })
        current = remaining.sort((a, b) => a.dist - b.dist).shift();
    }
    return nodes.flat().filter(n => n.z === 1).sort((a, b) => a.dist - b.dist).shift().dist;
}
// const start = Date.now()
console.log(`part1 -- example: ${part1(example)}`)
console.log(`part1 -- input: ${part1(input)}`)

console.log(`part2 -- example: ${part2(example)}`)
console.log(`part2 -- input: ${part2(input)}`)
// console.log(`took ${Date.now()-start}`)