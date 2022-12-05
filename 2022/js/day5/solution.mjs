#!/usr/bin/env zx
import "zx/globals"
import {
    fileToArr,
    sum,
    numSort,
} from "../helpers/index.mjs"
const day = "day5";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const WORD = ' ';
const EMPTY_LINE = '\n\n';
const LINE = '\n';

const countStacks = (arr) => +arr.pop().split(WORD).filter(x => !!x).pop()

const stackToCol = (i) => { return (4 * (i - 1)) + 1 }

const buildStacks = (stacks, line) => {
    stacks.forEach((stack, index) => {
        if (line[stackToCol(index)] &&
            line[stackToCol(index)].trim()
        ) stack.push(line[stackToCol(index)]);
    })
    return stacks;
}

const init2D = (width) => Array(width).fill(null).map(() => [])

const part1 = (path) => {
    const applyRule = (rule) => {
        const [, count, , from, , to] = rule.split(WORD);
        for (let i = 0; i < count; i++) {
            stacks[to].push(stacks[from].pop())
        }
    }

    const [initialState, rules] =
        fileToArr(path, EMPTY_LINE)
            .map(x => x.split(LINE))

    const stackCount = +countStacks(initialState)

    const stacks =
        initialState
            .reverse()
            .reduce(buildStacks, init2D(stackCount+1))

    rules.forEach(applyRule)
    return stacks.map(stack => stack.pop()).join('')
}

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

const part2 = (path) => {
    const applyRule = (rule) => {
        const [, count, , from, , to] = rule.split(WORD);
        stacks[to].push(...stacks[from].splice(-count, count))
    }

    const [initialState, rules] =
        fileToArr(path, EMPTY_LINE)
            .map(x => x.split(LINE))

    const stackCount = +countStacks(initialState)
    
    const stacks =
        initialState
            .reverse()
            .reduce(buildStacks, init2D(stackCount + 1))
   
    rules.forEach(applyRule)
    return stacks.map(stack => stack.pop()).join('')
}

echo(`part2 -- example: ${part2(example)}`)
echo(`part2 -- input: ${part2(input)}`)
