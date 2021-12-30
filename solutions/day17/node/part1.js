const fs = require('fs')

const QUESTION_FILE = "./input.txt"
const EXAMPLE_FILE = "./example.txt"

function solveInput(inputFile) {
    let nodes =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .map(line => [...line].map(char => parseInt(char)))

    nodes[0][0] = 0
    // let nodeWeights = []
    // for (var i = 0; i < nodes.length; i++) {
    //     for (var j = 0; j < nodes[i].length; j++) {
    //         if (i === 0) {
    //             if (j === 0) {
    //                 nodeWeights[i] = []
    //                 nodeWeights[i][j] = 0
    //             } else {
    //                 nodeWeights[i][j] = nodes[i][j] + nodeWeights[i][j - 1]
    //             }
    //         } else {
    //             if (j === 0) {
    //                 nodeWeights[i] = []
    //                 nodeWeights[i][j] = nodes[i][j] + nodeWeights[i - 1][j]
    //             } else {
    //                 const bestNeighbor = Math.min(nodeWeights[i - 1][j], nodeWeights[i][j - 1])
    //                 const worstNeighbor = Math.max(nodeWeights[i - 1][j], nodeWeights[i][j - 1])
    //                 nodeWeights[i][j] = nodes[i][j] + bestNeighbor
    //             }
    //         }
    //     }
    // }
    let unvisited = []
    let nodeWeights = []
    nodes.forEach((line, y) => {
        nodeWeights[y] = []
        line.forEach((val, x) => {
            unvisited.push([y, x])
            console.log(`${[y, x]} => ${unvisited[unvisited.length - 1]}`)
            console.log(unvisited[unvisited.length-1] == [y, x])
        })
    })
    // console.log(unvisited)
    // while (true) {
    pos = unvisited.shift()
    for (let i = 0; i < 1000; i++) {
        x = pos[1]
        y = pos[0]
        weight = nodes[y][x]
        lowestAdj = Infinity
        nextPos = []
        if (x !== 0) {
            newWeight = weight + nodes[y][x - 1]
            if (newWeight < nodeWeights[y][x - 1]) nodeWeights[y][x - 1] = newWeight
            if (newWeight < lowestAdj && unvisited.includes([y, x - 1])) {
                lowestAdj = newWeight
                nextPos = [y, x - 1]
            }
        }
        if (x !== nodes.length - 1) {
            console.log(`unvisited[0] = ${unvisited[0]} -- isArray = ${Array.isArray(unvisited[0])}`)
            console.log(`[0, 1] = ${[0, 1]} -- isArray = ${Array.isArray([0, 1])}`)
            // console.log([unvisited[0][0],unvisited[0][1]] == [0, 1])
            console.log(`${[unvisited[0][0],unvisited[0][1]]} === ${[0, 1]}`)
            // console.log(unvisited.includes(unvisited[1]))
            console.log(`${y}, ${x+1} -- ${[y, x + 1]}`)
            newWeight = weight + nodes[y][x + 1]
            if (newWeight < nodeWeights[y][x + 1]) nodeWeights[y][x + 1] = newWeight
            if (newWeight < lowestAdj && unvisited.includes([y, x + 1])) {
                
                lowestAdj = newWeight
                nextPos = [y, x + 1]
            }
        }
        if (y !== 0) {
            console.log('c')
            newWeight = weight + nodes[y - 1][x]
            if (newWeight < nodeWeights[y][x + 1]) nodeWeights[y - 1][x] = newWeight
            if (newWeight < lowestAdj && unvisited.includes([y - 1, x])) {
                lowestAdj = newWeight
                nextPos = [y - 1, x]
            }
        }
        if (y !== nodes.length - 1) {
            console.log('d')
            newWeight = weight + nodes[y + 1][x]
            if (newWeight < nodeWeights[y][x + 1]) nodeWeights[y + 1][x] = newWeight
            if (newWeight < lowestAdj && unvisited.includes([y + 1, x])) {
                lowestAdj = newWeight
                nextPos = [y + 1, x]
            }
        }
        console.log(nextPos)
        
        break
    }
    // return (nodeWeights[nodes.length - 1][nodes[nodes.length - 1].length - 1])
}

console.log(`example output: ${solveInput(EXAMPLE_FILE)}  -- expect 40`)

// const finalOutput = solveInput(QUESTION_FILE)
// console.log(`final output is: ${finalOutput}`)
