#!/usr/bin/env zx
import "zx/globals"
import { fileToArr, } from "../helpers/index.mjs"

const day = "day10";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const parseInput = (path) => fileToArr(path).map(row => row.split(' '))

const on = "█";
const off = " ";

const diff = (a, b) => Math.abs(a - b);

const part1 = (path) => {
    const process = (state,add) => {
        state.cycle++;
        if (state.cycle % 40 === 20) state.sum += +state.x * state.cycle;
        if (add) state.x += +add;
        return state
    }

    return parseInput(path)
        .reduce((state, [op, val]) => {
            if (op === "addx") process(state,val);
            return process(state);
        }, process({ x: 1, cycle: 0, sum: 0 })
        ).sum
}

const part2 = (path) => {
    let x = 1;
    let cycle = 0;
    let output = "\n";

    const process = () => {
        output += diff(x, cycle%40) <= 1 ? on : off;
        cycle++;
        if (cycle % 40 === 0) output += "\n"
    }
    process();
    const input = parseInput(path).forEach(([op, val]) => {
        if (op === "addx") {
            process();
            x += +val;
        }
        process();
    })
    return output;
}
console.log("part1 -- example: ", part1(example))
console.log("part1 -- input:   ",part1(input))

console.log("part2 -- example: ",part2(example))
console.log("part2 -- input:   ",part2(input))
