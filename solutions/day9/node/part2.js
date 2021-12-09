const fs = require('fs')

const QUESTION_FILE = "day9.txt" //question (100 x 100 grid)
const EXAMPLE_FILE = "9e.txt" //example  ( 10 x   5 grid)

function parseLine(line, row) {
    const lineArray = [...line]
    lineArray.forEach((h, col) => {
        h = parseInt(h)
        if (!Array.isArray(nodes[row])) nodes[row] = []
        if (!Array.isArray(lowPoints[row])) lowPoints[row] = []
        nodes[row][col] = h
        let lowPoint = true
        if (col !== 0) {
            if (h < nodes[row][col - 1]) {
                lowPoints[row][col - 1] = '>' // '>'
                lowPoints[row][col] = h
            } else lowPoints[row][col] = '<'
        }
        if (row !== 0) {
            if (h < nodes[row - 1][col]) {
                lowPoints[row - 1][col] = 'v' // 'v'
                lowPoints[row][col] = h
            } else lowPoints[row][col] = '^'
        }
    })
}

function generateOutput() {
    const flattenedLowPoints = [].concat(...lowPoints)
    return flattenedLowPoints.reduce((acc, val) => {
        if (Number.isInteger(val)) acc += val + 1
        return acc
    }, 0)
}

function solveInput(inputFile) {
    fs.readFileSync(inputFile)
        .toString()     //input is text
        .split('\n')    //split by line
        .filter(x => { return x.length != 0 })  //don't want empty lines
        .map(parseLine) //pass the input line by line to "solveLine"
    output = generateOutput(lowPoints)
}

let output = 0
let nodes = []
let lowPoints = []
solveInput(EXAMPLE_FILE)
console.log(lowPoints)
console.log(`example output :${output}`)

// nodes = []
// lowPoints = []
// output = 0
// solveInput(QUESTION_FILE)
// console.log(`final output :${output}`)
