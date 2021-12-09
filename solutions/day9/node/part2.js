const fs = require('fs')
class Node {
    constructor(row, col, h) {
        this.row = row
        this.col = col
        this.h = h
        this.next = null
        this.id = `${row},${col}`
    }

    get tail() {
        if (this.h === 9) return "9"
        if (this.next) return this.next.tail
        return this.id
    }
}

function parseLine(line, row) {
    [...line].map(char => { return parseInt(char) })
        .forEach((h, col) => {
            if (!Array.isArray(nodes[row])) nodes[row] = []
            nodes[row][col] = new Node(row, col, h)
            const currNode = nodes[row][col]

            if (row !== 0) {
                const nodeAbove = nodes[row - 1][col]
                if (currNode.h < nodeAbove.h) {
                    nodeAbove.next = currNode
                } else {
                    currNode.next = nodeAbove
                }
            }

            if (col !== 0) {
                const nodeToTheLeft = nodes[row][col - 1]
                if (currNode.h < nodeToTheLeft.h) {
                    nodeToTheLeft.next = currNode
                } else {
                    currNode.next = nodeToTheLeft
                }
            }

        })
}

function generateOutput() {
    const basins = []
    for (node of [].concat(...nodes)) {
        const bottomOfBasin = node.tail
        if (bottomOfBasin === "9") continue;
        if (basins[bottomOfBasin]) {
            basins[bottomOfBasin]++
        } else {
            basins[bottomOfBasin] = 1
        }
    }

    const basinSizes = []
    for (key in basins) {
        const v = basins[key]
        basinSizes.push(v)
    }
    const sortedBasins =
        basinSizes.sort((a, b) => { return b - a })
    return (sortedBasins[0] * sortedBasins[1] * sortedBasins[2])
}

function solveInput(inputFile) {
    fs.readFileSync(inputFile)
        .toString()     //input is text
        .split('\n')    //split by line
        .filter(x => { return x.length != 0 })  //don't want empty lines
        .map(parseLine) //pass the input line by line to "solveLine"
    output = generateOutput()
}

const QUESTION_FILE = "day9.txt" //question (100 x 100 grid)
const EXAMPLE_FILE = "9e.txt" //example  ( 10 x   5 grid)

let output
let nodes
let lowPoints

output = 0
nodes = []
lowPoints = []
solveInput(EXAMPLE_FILE)
console.log(`example output :${output}`)

nodes = []
lowPoints = []
output = 0
solveInput(QUESTION_FILE)
console.log(`final output :${output}`)
