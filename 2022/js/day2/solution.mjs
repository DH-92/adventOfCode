#!/usr/bin/env zx
import "zx/globals"
import { sum, fileToArr } from "../helpers/index.mjs"
const day = "day2";
const input = `../../input/${day}/input.txt`
const example= `../../input/${day}/example.txt`

const loss = 0
const draw = 3
const win = 6

const rock = 1
const paper = 2
const scissors = 3

const word = ' ';

const part1 = (path) => {
    const moveScore = (game) => {
        if (game[1] === 'X') return rock
        if (game[1] === 'Y') return paper
        if (game[1] === 'Z') return scissors
    }
    const winScore = (game) => {
        if (game[0] === 'A' && game[1] === 'X') return draw
        if (game[0] === 'A' && game[1] === 'Y') return win
        if (game[0] === 'A' && game[1] === 'Z') return loss

        if (game[0] === 'B' && game[1] === 'X') return loss
        if (game[0] === 'B' && game[1] === 'Y') return draw
        if (game[0] === 'B' && game[1] === 'Z') return win

        if (game[0] === 'C' && game[1] === 'X') return win
        if (game[0] === 'C' && game[1] === 'Y') return loss
        if (game[0] === 'C' && game[1] === 'Z') return draw
    }
    return fileToArr(path)
        .map(game => game.split(word))
        .map(game => moveScore(game) + winScore(game))
        .reduce(sum)
}

echo(`part1 -- example: ${part1(example)}`)
echo(`part1 -- input: ${part1(input)}`)

const part2 = (path) => {
    const winScore = (game) => {
        if (game[1] === 'X') return loss
        if (game[1] === 'Y') return draw
        if (game[1] === 'Z') return win
    }
    const moveScore = (game) => {
        if (game[0] === 'A' && game[1] === 'X') return scissors
        if (game[0] === 'A' && game[1] === 'Y') return rock
        if (game[0] === 'A' && game[1] === 'Z') return paper

        if (game[0] === 'B' && game[1] === 'X') return rock
        if (game[0] === 'B' && game[1] === 'Y') return paper
        if (game[0] === 'B' && game[1] === 'Z') return scissors

        if (game[0] === 'C' && game[1] === 'X') return paper
        if (game[0] === 'C' && game[1] === 'Y') return scissors
        if (game[0] === 'C' && game[1] === 'Z') return rock
    }

    return fileToArr(path)
        .map(game => game.split(word))
        .map(game => moveScore(game) + winScore(game))
        .reduce(sum)
}

echo(`part2 -- example: ${part2(example)}`)
echo(`part2 -- input: ${part2(input)}`)
