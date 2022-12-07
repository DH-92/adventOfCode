#!/usr/bin/env zx
import "zx/globals"
import { fileToArr } from "../helpers/index.mjs"
const day = "day5";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const WORD = ' ';
const EMPTY_LINE = '\n\n';
const LINE = '\n';

const countStacks = (arr) => +arr.pop().split(WORD).filter(x => !!x).pop()

const stackToCol = (i) => (4 * (i - 1)) + 1

const buildStacks = (stacks, line) => {
    stacks.forEach((stack, index) => {
        if (line[stackToCol(index)]?.trim()) {
            stack.push(line[stackToCol(index)])
        }
    })
    return stacks;
}

const parseRules = (rule) => {
    //move ${count} from ${from} to ${to}
    const [, count, , from, , to] = rule.split(WORD);
    return { count, from, to }
}

const init2D = (width) => Array(width).fill(null).map(() => [])

const parseInput = (path) => {
    const [initialState, rules] =
    fileToArr(path, EMPTY_LINE)
        .map(x => x.split(LINE))

    const stackCount = +countStacks(initialState)

    const stacks =
        initialState
            .reverse()
            .reduce(buildStacks, init2D(stackCount + 1))

    const parsedRules = rules.map(parseRules)

    return [stacks,parsedRules]
}

const part1 = (path) => {
    const applyRule = ({ count, from, to }) => {
        for (let i = 0; i < count; i++) {
            stacks[to].push(stacks[from].pop())
        }
    }

    const [stacks,rules] = parseInput(path)
    rules.forEach(applyRule)
    return stacks.map(stack => stack.pop()).join('')
}

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

const part2 = (path) => {
    const applyRule = ({ count, from, to }) => stacks[to].push(...stacks[from].splice(-count, count))
    const [stacks,rules] = parseInput(path)
    rules.forEach(applyRule)
    return stacks.map(stack => stack.pop()).join('')
}

echo(`part2 -- example: ${part2(example)}`)
echo(`part2 -- input: ${part2(input)}`)
