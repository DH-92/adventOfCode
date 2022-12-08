#!/usr/bin/env zx
import "zx/globals"
import { fileToArr } from "../helpers/index.mjs"
const day = "day8";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const init2D = (width) => Array(width).fill(null).map(() => []);

const parseInput = (path) => {
    return fileToArr(path).map(row => row.split(''))
}
const part1 = (path,size) => {
    const trees = parseInput(path, size);
    const visible = init2D(size);

    let count = 0;
    trees.forEach((row, rowId) => {
        row.forEach((height, colId) => {
            if (rowId === 0) {
                visible[rowId][colId] = "X";
                count++;
                return;
            }
            if (rowId === size - 1) {
                visible[rowId][colId] = "X";
                count++;
                return;
            }
            if (colId === 0) {
                visible[rowId][colId] = "X";
                count++;
                return;
            }
            if (colId === size - 1) {
                visible[rowId][colId] = "X";
                count++;
                return;
            }
            let visUp = true;
            for (let testRow = rowId-1; testRow >= 0; testRow--) {
                if (trees[testRow][colId] >= height) {
                    visUp = false;
                    break
                }
            }
            if (visUp) {
                visible[rowId][colId] = "U"
                count++;
                return;
            }
            let visDown = true;
            for (let testRow = rowId + 1; testRow <= size-1; testRow++) {
                if (trees[testRow][colId] >= height) {
                    visDown = false;
                    break
                }
            }
            if (visDown) {
                visible[rowId][colId] = "D"
                count++;
                return;
            }
            let visLeft = true;
            for (let testCol = colId-1; testCol >= 0; testCol--) {
                if (trees[rowId][testCol] >= height) {
                    visLeft = false;
                    break
                }
            }
            if (visLeft) {
                visible[rowId][colId] = "L"
                count++;
                return;
            }
            let visRight = true;
            for (let testCol = colId + 1; testCol <= size-1; testCol++) {
                if (trees[rowId][testCol] >= height) {
                    visRight = false;
                    break
                }
            }
            if (visRight) {
                visible[rowId][colId] = "R"
                count++;
                return;
            }
        })
    })

    return count;
}

const part2 = (path,size) => {
    const trees = parseInput(path, size);
    const visible = init2D(size);

    let max = 0;
    trees.forEach((row, rowId) => {
        row.forEach((height, colId) => {
            let visUp = 0;
            let visDown = 0;
            let visLeft = 0;
            let visRight = 0;
            for (let testRow = rowId-1; testRow >= 0; testRow--) {
                visUp++;
                if (trees[testRow][colId] >= height) break;
            }
            if (visUp === 0) return;
            for (let testRow = rowId + 1; testRow <= size-1; testRow++) {
                visDown++;
                if (trees[testRow][colId] >= height) break;
            }
            if (visDown === 0) return;
            for (let testCol = colId-1; testCol >= 0; testCol--) {
                visLeft++;
                if (trees[rowId][testCol] >= height) break;
            }
            if (visLeft === 0) return;
            for (let testCol = colId + 1; testCol <= size-1; testCol++) {
                visRight++;
                if (trees[rowId][testCol] >= height) break;
            }
            if (visRight === 0) return;
            const value = visUp * visDown * visLeft * visRight;
            if (value > max) max = value;
            visible[rowId][colId] = value;
        })
    })

    return max;
}

echo(`part1 -- example: ${part1(example, 5)}`)
echo(`part1 -- input: ${part1(input,99)}`)

echo(`part2 -- example: ${part2(example, 5)}`)
echo(`part2 -- input: ${part2(input, 99)}`)
