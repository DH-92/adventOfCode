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

const stackToCol = (i) => {return (4 * (i-1))+1}

const part1 = (path) => {
    const [initialString, rules] = fileToArr(path, EMPTY_LINE)
    const initialArr = initialString.split(LINE)
    const stackCount =
        initialArr
            .pop()
            .split(WORD)
            .filter(x => !!x)
            .pop()

    const stacks = initialArr.reverse().reduce((stacks, line) => {
        for (let i = 1; i <= stackCount; i++) {
            console.log(stackCount,stacks.length)
            // stacks[i] ??= [];
            if (line[stackToCol(i)] !== ' ') stacks[i].push(line[stackToCol(i)]);
        }
        return stacks;
    }, Array(+stackCount+1).fill(null).map(()=>['']))

    rules.split(LINE).forEach(rule => {
        const [, count, , from, , to] = rule.split(WORD);
        for (let j = 0; j < count; j++) {
            stacks[to].push(stacks[from].pop())
        }
    })
    return stacks.map(stack => stack.pop()).join('')
}

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

const part2 = (path) => {
    const [initialString, rules] = fileToArr(path, EMPTY_LINE)
    const initialArr = initialString.split(LINE)
    const stackCount = initialArr.pop().split(WORD).filter(x => !!x).pop()
    const stacks = [];

    initialArr.reverse().forEach((line) => {
        stacks[1] ??= []
        if (line[1] !== ' ') stacks[1].push(line[1]);
        for (let i = 1; i < stackCount; i++) {
            stacks[i+1] ??= [];
            const val = line[+1 + (4 * i)];
            if (val !== ' ') stacks[i+1].push(line[+1 + (4 * i)]);
        }
    })
    rules.split(LINE).forEach(rule => {
        const [, count, , from, , to] = rule.split(' ');
        const transit = stacks[from].splice(-count, count);
        stacks[to].push(...transit)
    })
    return stacks.map(stack => stack.pop()).join('')

}

echo(`part2 -- example: ${part2(example)}`)
echo(`part2 -- input: ${part2(input)}`)
