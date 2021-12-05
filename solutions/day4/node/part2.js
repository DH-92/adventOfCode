const fs = require('fs')

const PATH_BINGO_BOARDS = "bingo-boards.txt";
const PATH_BINGO_STREAM = "bingo-stream.txt";
const ROW_LENGTH = 5;
const COL_LENGTH = 5;
const BOARD_COUNT = 100;

const bingoBoardsArr =
    fs.readFileSync(PATH_BINGO_BOARDS)
        .toString()
        .split(/\s+/)
        .filter((x) => { return x.length != 0 })
        .map((x) => { return parseInt(x) })

const bingoCallData =
    fs.readFileSync(PATH_BINGO_STREAM)
        .toString()
        .split(',')
        .map((x) => { return parseInt(x) })

function rowComplete(row) {
    return (
        bingoPositionsCalled.has((row * ROW_LENGTH) + 0) &&
        bingoPositionsCalled.has((row * ROW_LENGTH) + 1) &&
        bingoPositionsCalled.has((row * ROW_LENGTH) + 2) &&
        bingoPositionsCalled.has((row * ROW_LENGTH) + 3) &&
        bingoPositionsCalled.has((row * ROW_LENGTH) + 4)
    )
}

function colComplete(board, col) {
    return (
        bingoPositionsCalled.has(((board * COL_LENGTH + 0) * ROW_LENGTH) + col) &&
        bingoPositionsCalled.has(((board * COL_LENGTH + 1) * ROW_LENGTH) + col) &&
        bingoPositionsCalled.has(((board * COL_LENGTH + 2) * ROW_LENGTH) + col) &&
        bingoPositionsCalled.has(((board * COL_LENGTH + 3) * ROW_LENGTH) + col) &&
        bingoPositionsCalled.has(((board * COL_LENGTH + 4) * ROW_LENGTH) + col)
    )
}

const hashMapu = bingoBoardsArr.reduce((acc, val, index) => {
    if (Array.isArray(acc[val])) {
        acc[val].push(index)
    } else {
        acc[val] = [index]
    }
    return acc;
}, [])

const bingoPositionsCalled = new Set;

var boardsCompleted = []
var finalBoard
var finalCall
var callIndex = 0;
for (call of bingoCallData) {
    if (Object.keys(boardsCompleted).length >= BOARD_COUNT) break
    callIndex++
    calledPositions = hashMapu[call];
    for (position of calledPositions) {
        if (Object.keys(boardsCompleted).length >= BOARD_COUNT) break
        bingoPositionsCalled.add(position)
        const board = Math.floor(position / ROW_LENGTH / COL_LENGTH)
        if (boardsCompleted[board]) continue;
        const row = Math.floor(position / ROW_LENGTH)
        const col = position % ROW_LENGTH
        if (rowComplete(row) || colComplete(board, col)) {
            boardsCompleted[board] = callIndex
            finalBoard = board
            finalCall = call
            continue
        }
    }
}
var unmarkedSum = 0
const startingPosition = finalBoard * ROW_LENGTH * COL_LENGTH;
const endingPosition = (1 + finalBoard) * ROW_LENGTH * COL_LENGTH;
for (var p = startingPosition; p < endingPosition; p++) {
    if (bingoPositionsCalled.has(p)) {
        process.stdout.write(`*${bingoBoardsArr[p].toString().padStart(2)}* `)
    } else {
        unmarkedSum += bingoBoardsArr[p]
        process.stdout.write(` ${bingoBoardsArr[p].toString().padStart(2)}  `)
    }
    if (p % 5 == 4) console.log()
}
console.log(`sum = ${unmarkedSum}`)
console.log(`last called = ${finalCall} on call ${callIndex}`)
console.log(`answer = ${finalCall * unmarkedSum}`)
