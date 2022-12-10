#!/usr/bin/env zx
import "zx/globals"
import { fileToArr } from "../helpers/index.mjs"
const day = "day9";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const init2D = (width) => Array(6).fill(null).map(() => []);

const parseInput = (path) => {
    return fileToArr(path).map(row => row.split(' '))
}
const part1 = (path,size) => {
    const moves = parseInput(path);
    const hPos = {
        x: 0,
        y: 0,
    }
    const tPos = {
        x: 0,
        y: 0,
    }

    const tTouched = new Set();
    const mover = (dir) => {
        const { x, y } = hPos;
        if (dir === "L") hPos.x--;
        if (dir === "R") hPos.x++;
        if (dir === "D") hPos.y--;
        if (dir === "U") hPos.y++;

        if (Math.abs(hPos.x - tPos.x) === 2 && hPos.y === tPos.y) {
            if (hPos.x > tPos.x) {
                tPos.x++
            } else {
                tPos.x--
            }
        } else if (Math.abs(hPos.y - tPos.y) === 2 && hPos.x === tPos.x) {
            if (hPos.y > tPos.y) {
                tPos.y++
            } else {
                tPos.y--
            }
        } else if (Math.abs(hPos.x - tPos.x) > 1 || Math.abs(hPos.y - tPos.y) > 1) {
            if (hPos.x > tPos.x) {
                tPos.x++
            } else {
                tPos.x--
            }
            if (hPos.y > tPos.y) {
                tPos.y++
            } else {
                tPos.y--
            }
        }
        tTouched.add(""+tPos.x+","+tPos.y)
    }
    
    moves.forEach(([dir, dist], index) => {

        for (let i = 0; i < dist; i++) {
            mover(dir,index);
        }
    })
    return tTouched.size;
}

const part2 = (path,size) => {
    const moves = parseInput(path);

    const nodes = [size]
    for (let i = 0; i < size; i++) nodes[i] = { x: 0, y: 0 };
    const tTouched = new Set();
    const moveHead = (dir) => {
        if (dir === "L") nodes[0].x--;
        if (dir === "R") nodes[0].x++;
        if (dir === "D") nodes[0].y--;
        if (dir === "U") nodes[0].y++;
    }
    const moveNode = (hPos, tPos) => {
        if (Math.abs(hPos.x - tPos.x) === 2 && hPos.y === tPos.y) {
            if (hPos.x > tPos.x) {
                tPos.x++
            } else {
                tPos.x--
            }
        } else if (Math.abs(hPos.y - tPos.y) === 2 && hPos.x === tPos.x) {
            if (hPos.y > tPos.y) {
                tPos.y++
            } else {
                tPos.y--
            }
        } else if (Math.abs(hPos.x - tPos.x) > 1 || Math.abs(hPos.y - tPos.y) > 1) {
            if (hPos.x > tPos.x) {
                tPos.x++
            } else {
                tPos.x--
            }
            if (hPos.y > tPos.y) {
                tPos.y++
            } else {
                tPos.y--
            }
        } 
    }
    
    moves.forEach(([dir, dist]) => {
        for (let i = 0; i < dist; i++) {
            moveHead(dir);
            for (let i = 1; i < size; i++) moveNode(nodes[+i - 1], nodes[i])
            tTouched.add(""+nodes[9].x+","+nodes[9].y)
        }
    })
    echo(JSON.stringify(nodes))
    return tTouched.size;
}

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

echo(`part2 -- example: ${part2(example,10)}`)
echo(`part2 -- input: ${part2(input,10)}`)
