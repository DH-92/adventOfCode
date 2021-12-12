const fs = require('fs')

const QUESTION_FILE = "input.txt" //question (100 x 100 grid)
const EXAMPLE_FILE = "exammple.txt" //example  ( 10 x   5 grid)

class Stack {
    constructor() {
        this.contains = []
    }
}

const openers = ['(', '[', '{', '<']
const closers = [')', ']', '}', '>']
// const pointsLookup = [3,57,1197,25137]
const pointsLookup = [1,2,3,4]
const scores = []
function parseLine(line) {
    const stack = [];
    let valid = true;
    [...line].map(char => {
        if (valid) {
            if (openers.includes(char)) {
                stack.push(char)
                // console.log(`${char} -- ${stack}`)
            } else if (closers.includes(char)) {
                const topOfStack = stack.pop()
                const counterPart = closers[openers.indexOf(topOfStack)]
                if (counterPart !== char) {
                    // stack.push(char)
                    valid = false;
                    // console.log(`${points} + ${pointsLookup[closers.indexOf(char)]}`)
                    // output = output + pointsLookup[closers.indexOf(char)]
                    // console.log(pointsLookup[closers.indexOf(char)])
                } 
            }
        }
    })
    if (valid) {
        var points = 0;
        while (stack.length !== 0) {
            points *= 5
            points = points + pointsLookup[openers.indexOf(stack.pop())]
        }
        console.log(points)
        scores.push(points)
    }
}

function solveInput(inputFile) {
    fs.readFileSync(inputFile)
        .toString()     //input is text
        .split('\n')    //split by line
        .filter(x => x.length != 0)  //don't want empty lines
        .map(parseLine) //pass the input line by line to "solveLine"
    sortedScores = scores.sort((a, b) => a - b)
    const len = Math.floor(sortedScores.length/2)
    console.log(`${sortedScores} -- ${len}`)
    output = sortedScores[len]
}

let output
let nodes
let lowPoints

// output = 0
// nodes = []
// lowPoints = []
// solveInput(EXAMPLE_FILE)
// console.log(`example output: ${output}`)

nodes = []
lowPoints = []
output = 0
points = 0
solveInput(QUESTION_FILE)
console.log(`final output: ${output}`)
