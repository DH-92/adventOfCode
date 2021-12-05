const fs = require('fs')

const PATH_BINGO_BOARDS = "bingo-boards.txt";
const PATH_BINGO_CALLS = "bingo-stream.txt";
const ROW_LENGTH = 5;
const COL_LENGTH = 5;


const bingoBoardsArr =
  fs.readFileSync(PATH_BINGO_BOARDS)
    .toString()
    .split(/\s+/)
    .filter((x) => { return x.length != 0 })
    .map((x) => { return parseInt(x) })

// https://www.youtube.com/watch?v=pKO9UjSeLew&t=55s
const hashMapUh =
  bingoBoardsArr.reduce((hashmap, value, position) => {
    if (Array.isArray(hashmap[value])) {
      hashmap[value].push(position)
    } else {
      hashmap[value] = [position]
    }
    return hashmap;
  }, [])

const bingoPositionsCalled = new Set;

var boardCompleted
var lastCalled
const bingoCalls =
  fs.readFileSync(PATH_BINGO_CALLS)
    .toString()
    .split(',')
    .map((x) => { return parseInt(x) })

for (call of bingoCalls) {
  lastCalled = call
  calledPositions = hashMapUh[call];
  for (position of calledPositions) {
    bingoPositionsCalled.add(position)
    const row = Math.floor(position / ROW_LENGTH)
    const rowComplete =
      bingoPositionsCalled.has((row * ROW_LENGTH) + 0) &&
      bingoPositionsCalled.has((row * ROW_LENGTH) + 1) &&
      bingoPositionsCalled.has((row * ROW_LENGTH) + 2) &&
      bingoPositionsCalled.has((row * ROW_LENGTH) + 3) &&
      bingoPositionsCalled.has((row * ROW_LENGTH) + 4)
    if (rowComplete) {
      const board = Math.floor(row / COL_LENGTH);
      boardCompleted = board
      break
    }

    const col = position % ROW_LENGTH;
    const board = Math.floor(row / COL_LENGTH);
    const colComplete =
      bingoPositionsCalled.has((ROW_LENGTH * (board + 0)) + col) &&
      bingoPositionsCalled.has((ROW_LENGTH * (board + 1)) + col) &&
      bingoPositionsCalled.has((ROW_LENGTH * (board + 2)) + col) &&
      bingoPositionsCalled.has((ROW_LENGTH * (board + 3)) + col) &&
      bingoPositionsCalled.has((ROW_LENGTH * (board + 4)) + col)
    if (colComplete) {
      boardCompleted = board
      break
    }
  }
  if (boardCompleted) break
}

var boardUncalledTotal = 0
const startingPosition =  boardCompleted * ROW_LENGTH * COL_LENGTH;
const endingPosition = (1 + boardCompleted) * ROW_LENGTH * COL_LENGTH;
for (var pp = startingPosition; pp < endingPosition; pp++) {
  if (bingoPositionsCalled.has(pp)) {
    // process.stdout.write(`*${bingoBoardsArr[pp].toString().padStart(2)}* `)
  } else {
    boardUncalledTotal += bingoBoardsArr[pp]
    // process.stdout.write(` ${bingoBoardsArr[pp].toString().padStart(2)}  `)
  }
  // if (pp % 5 == 4) console.log()
}
// console.log()
// console.log(`uncalled sum = ${boardUncalledTotal}`)
// console.log(`last called = ${lastCalled}`)
// console.log(`answer = ${lastCalled * boardUncalledTotal}`)
console.log(lastCalled * boardUncalledTotal)
