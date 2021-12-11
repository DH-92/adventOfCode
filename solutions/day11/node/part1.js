const fs = require('fs')

const QUESTION_FILE = "input.txt"
const EXAMPLE_FILE = "example.txt"
//energy levels from 0 to 9

var flashes = 0

function flashNode(state, rowIndex, colIndex) {
    state[rowIndex][colIndex] = 0
    for (let ii = -1; ii <= 1; ii++) {
        for (let jj = -1; jj <= 1; jj++) {
            if (state[rowIndex + ii] && state[rowIndex + ii][colIndex + jj]) {
                state[rowIndex + ii][colIndex + jj]++
            }
        }
    }
}

function flashNodes(state) {
    var changed = true
    while (changed) {
        changed = false
        state.forEach((row, rowIndex) => {
            row.forEach((x, colIndex) => {
                if (x > 9) {
                    flashes++
                    changed = true
                    flashNode(state, rowIndex, colIndex)
                }
            })
        })
    }
    return state
}

function solveInput(inputFile) {
    let state =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .map(line => line.split("").map(char => parseInt(char)))
    
    flashes = 0
    const turnCount = 100
    for (let ii = 1; ii <= turnCount; ii++) {
        state = state.map(row => row.map(col => col + 1))
        flashNodes(state)
    }
    return flashes
}

const exampleOutout = solveInput(EXAMPLE_FILE)
console.log(`example output: ${exampleOutout}`)


const finalOutput = solveInput(QUESTION_FILE)
console.log(`final output: ${finalOutput}`)
