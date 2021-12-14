const fs = require('fs')

const QUESTION_FILE = "./input.txt"
const EXAMPLE_FILE = "./example.txt"
const EXAMPLE_2_FILE = "./example2.txt"
const EXAMPLE_3_FILE = "./example3.txt"

function solveInput(inputFile) {
    let nodes =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .map(line => line.split('-'))
            .reduce((map, pair) => {
                if (!map[pair[0]]) map[pair[0]] = []
                map[pair[0]].push(pair[1])
                if (!map[pair[1]]) map[pair[1]] = []
                map[pair[1]].push(pair[0])
                return map
            }, [])
    let validPaths = new Set()
    let currNode = 'start'
    let activePaths = [[currNode]]
    while (activePaths.length > 0) {
        let newPaths = []
        for (path of activePaths) {
            let tail = path[path.length - 1]
            let neighbours = nodes[tail].filter(x => x !== 'start')
            if (neighbours.length === 0) continue
            for (neighbour of neighbours) {
                let newPath = [...path]
                if (neighbour === 'end') {
                    newPath.push('end')
                    validPaths.add(path.toString())
                    continue
                }
                if (neighbour !== neighbour.toLowerCase() || !path.includes(neighbour)) {
                    newPath.push(neighbour)
                    newPaths.push(newPath)
                }
            }
        }
        activePaths = newPaths
    }
    return (validPaths.size)
}

console.log(`example output: ${solveInput(EXAMPLE_FILE)}  -- expect 10`)

console.log(`example 2 output: ${solveInput(EXAMPLE_2_FILE)} -- expect 19`)

console.log(`example 3 output: ${solveInput(EXAMPLE_3_FILE)}  -- expect 226`)

const finalOutput = solveInput(QUESTION_FILE)
console.log(`final output is: ${finalOutput}`)
