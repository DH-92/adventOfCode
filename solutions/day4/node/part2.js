const fs = require('fs')

const PATH_BINGO_BOARDS = "bingo-boards.txt";
const PATH_BINGO_STREAM = "bingo-stream.txt";
const ROW_LENGTH = 5;
const COL_LENGTH = 5;
const BOARD_COUNT = 100;
(async () => {
    const bingoBoardsArr =
        fs.readFileSync(PATH_BINGO_BOARDS)
            .toString()
            .split(/\s+/)
            .filter((x) => { return x.length != 0 })
            .map((x) => { return parseInt(x) })

    const hashMapu =
        bingoBoardsArr.reduce((acc, val, index) => {
            if (Array.isArray(acc[val])) {
                acc[val].push(index)
            } else {
                acc[val] = [index]
            }
            return acc;
        }, [])

    const bingoPositionsCalled = new Set;

    const bingoCallData =
        fs.readFileSync(PATH_BINGO_STREAM)
            .toString()
            .split(',')
            .map((x) => { return parseInt(x) })

    var boardCompleted = []
    var completedBoards = 0;
    var callNumber = 0;
    var finalBoard
    for (call of bingoCallData) {
        callNumber++
        calledPositions = hashMapu[call];
        for (position of calledPositions) {
            // console.log(`position ${position}`)
            if (completedBoards == BOARD_COUNT) {
                break
            } 
            
            bingoPositionsCalled.add(position)

            const board = Math.floor(position / ROW_LENGTH / COL_LENGTH)
            if (boardCompleted[board]) continue;

            const row = Math.floor(position / ROW_LENGTH)
            const rowComplete =
                bingoPositionsCalled.has((row * ROW_LENGTH) + 0) &&
                bingoPositionsCalled.has((row * ROW_LENGTH) + 1) &&
                bingoPositionsCalled.has((row * ROW_LENGTH) + 2) &&
                bingoPositionsCalled.has((row * ROW_LENGTH) + 3) &&
                bingoPositionsCalled.has((row * ROW_LENGTH) + 4)
            if (rowComplete) {
                completedBoards++;
                boardCompleted[board] = callNumber
                finalBoard=board
                // console.log(`board ${board} completed on call ${callNumber}`)
                continue
            }

            const col = position % ROW_LENGTH;
            const colComplete =
                bingoPositionsCalled.has((ROW_LENGTH * (board + 0)) + col) &&
                bingoPositionsCalled.has((ROW_LENGTH * (board + 1)) + col) &&
                bingoPositionsCalled.has((ROW_LENGTH * (board + 2)) + col) &&
                bingoPositionsCalled.has((ROW_LENGTH * (board + 3)) + col) &&
                bingoPositionsCalled.has((ROW_LENGTH * (board + 4)) + col)
            if (colComplete) {
                completedBoards++;
                boardCompleted[board] = callNumber
                finalBoard=board
                // console.log(`board ${board} completed on call ${callNumber}`)
                continue
            }
        }        
        if (completedBoards == BOARD_COUNT) {
            console.log(`final call ${callNumber}`)
            break
        } 
    }
    console.log(`final board is ${finalBoard}`)

    // console.log(`Last board completed is ${lastBoard}`)
    var boardUncalledTotal = 0
    for (
        var p = finalBoard * ROW_LENGTH * COL_LENGTH;
        p < (1 + finalBoard) * ROW_LENGTH * COL_LENGTH;
        p++
    ) {
        // bingoBoardsArr[p]
        if (bingoPositionsCalled.has(p)) {
            process.stdout.write(`*${bingoBoardsArr[p].toString().padStart(2)}* `)
        } else {
            boardUncalledTotal += bingoBoardsArr[p]
            process.stdout.write(` ${bingoBoardsArr[p].toString().padStart(2)}  `)
        }
        if (p % 5 == 4) console.log()
    }
    console.log(`sum = ${boardUncalledTotal}`)
    console.log(`last called = ${callNumber}`)
    console.log(`answer = ${callNumber * boardUncalledTotal}`)
})()
