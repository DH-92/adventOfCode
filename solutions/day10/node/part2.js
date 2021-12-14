const fs = require('fs')
class Node {
    constructor(h) {
        this.h = h
    }

    get tail() {
        let output
        if (this.id) {
            output = this.id
        } else if (this.h === 9) {
            output = "9"
        } else if (this.next) {
            output = this.next.tail
        } else {
            this.id = Math.random().toString().slice(2, 16)
            output = this.id
        }
        return output
    }
}

function parseLine(line, row) {
    [...line].map(char => parseInt(char))
        .forEach((h, col) => {
            if (!Array.isArray(nodes[row])) nodes[row] = []
            nodes[row][col] = new Node(h)
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
    const basins =
        nodes.flat()
            .reduce((basins, node) => {
                const bottomOfBasin = node.tail
                if (bottomOfBasin !== "9") {
                    basins[bottomOfBasin] = (basins[bottomOfBasin])
                        ? basins[bottomOfBasin] += 1
                        : 1
                }
                return basins
            }, [])

    const basinSizes = []
    for (key in basins) {
        const v = basins[key]
        basinSizes.push(v)
    }

    return basinSizes
        .sort((a, b) => { return b - a })
        .slice(0, 3)
        .reduce((acc, x) => acc * x)
}

function solveInput(inputFile) {
    output = 0
    nodes = []
    lowPoints = []
    fs.readFileSync(inputFile)
        .toString()     //input is text
        .split('\n')    //split by line
        .filter(x => x.length != 0)  //don't want empty lines
        .map(parseLine) //pass the input line by line to "solveLine"
    output = generateOutput()
}

const QUESTION_FILE = "input.txt" //question (100 x 100 grid)
const EXAMPLE_FILE = "example.txt" //example  ( 10 x   5 grid)

let output
let nodes
let lowPoints

solveInput(EXAMPLE_FILE)
console.log(`example output :${output}`)

solveInput(QUESTION_FILE)
console.log(`final output :${output}`)
