const fs = require('fs')

const QUESTION_FILE = "./input.txt"
const EXAMPLE_FILE = "./example.txt"
const EXAMPLE_B_FILE = "./exampleb.txt"

function solveInput(inputFile,rounds) {
    const nodes =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .map(line => [...line])
    
    const rows = nodes.length
    const cols = nodes[0].length
    // console.log(nodes)

    let loops = 0
    for (let i = 1; i <= rounds; i++) {
        const eastPositions = []
        const southPositions = []
        let movingEast = []
        let movingSouth = []

        nodes.forEach((row, rowIndex) => {
            row.forEach((node, colIndex) => {
                if (node === ">") {         //heading east
                    eastPositions.push({ rowIndex, colIndex })
                } else if (node === "v") {  //heading south
                    southPositions.push({ rowIndex, colIndex })
                }
            })
        })
        
        eastPositions.forEach(node => {
            const row = node.rowIndex
            const col = (node.colIndex + 1 < cols) ? node.colIndex + 1 : 0
            const next = nodes[row][col]
            if (next === ".") movingEast.push(node)
        })
        
        movingEast.forEach(node => {
            nodes[node.rowIndex][node.colIndex] = "."
            const row = node.rowIndex
            const col = (node.colIndex + 1 < cols) ? node.colIndex + 1 : 0
            nodes[row][col] = ">"
        })
        
        southPositions.forEach(node => {
            const row = (node.rowIndex + 1 < rows) ? node.rowIndex + 1 : 0
            const col = node.colIndex
            const next = nodes[row][col]
            if (next === ".") movingSouth.push(node)
        })

        movingSouth.forEach(node => {
            nodes[node.rowIndex][node.colIndex] = "."
            const row = (node.rowIndex + 1 < rows) ? node.rowIndex + 1 : 0
            const col = node.colIndex
            nodes[row][col] = "v"
        })

        const moves = movingSouth.length + movingEast.length
        if (moves === 0) {
            loops=i
            break
        }
    }
    return loops
    // console.log(eastPositions)
    // console.log(southPositions)
}
console.log(`example output: ${solveInput(EXAMPLE_FILE,60)}  -- expect 58`)
console.log(`final output: ${solveInput(QUESTION_FILE,500)}  -- expect 360`)
