#!/usr/bin/env zx
import "zx/globals"
import {
    fileToArr,
} from "../helpers/index.mjs"
const day = "day14";
const input = `../../input/${day}/input.txt`
const example= `../../input/${day}/example.txt`

const calc = (path,passes) => {
    const [polymer, ruleLines] = fileToArr(path, '\n\n');
    const rules =
        ruleLines.split('\n')
            .map(line => line.split(' -> '))
            .reduce((out,rule) => {
                const [a, b] = rule[0].split("");
                const c = rule[1];
                out["" + a + b] = ["" + a + c, "" + c + b];
                return out;
            }, {})
    
    let pairs = {};
    polymer.split("").reduce((last, curr) => {
        pairs["" + last + curr] ??= 0;
        pairs["" + last + curr]++;
        return curr;
    })

    for (let i = 0; i < passes; i++) {
        const newPairs = {};
        Object.entries(pairs).forEach(([key,val]) => {
            const [a, b] = rules[key];
            newPairs[a] = newPairs[a] ? val + newPairs[a] : val;
            newPairs[b] = newPairs[b] ? val + newPairs[b] : val;
        })
        pairs = newPairs;
    }

    const elements = {};
    Object.entries(pairs).forEach(([key, val]) => {
        const [a, b] = key.split('');
        elements[a] = elements[a] ? val + elements[a] : val;
        elements[b] = elements[b] ? val + elements[b] : val;
    })

    let min = Number.MAX_SAFE_INTEGER;
    let max = 0;
    Object.entries(elements).forEach(([key, val]) => {
        elements[key] = Math.ceil(elements[key] / 2)
        if (min > elements[key]) min = elements[key]
        if (max < elements[key]) max = elements[key]
    })
    return +max-min
}

echo(`part1 -- example: ${calc(example,10)}`)
echo(`part1 -- input: ${calc(input,10)}`)

echo(`part2 -- example: ${calc(example,40)}`)
echo(`part2 -- input: ${calc(input,40)}`)
