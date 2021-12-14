const fs = require('fs')

const QUESTION_FILE = "./input.txt"
const EXAMPLE_FILE = "./example.txt"

function solveInput(inputFile) {
    let folds =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .filter(line => line.includes(' '))
            .reduce((ans, fold) => {
                const pair = fold.split(' ')[2].split('=')
                if (pair[0] === 'x') {
                    ans['x'].push(parseInt(pair[1]))
                } else if (pair[0] === 'y') {
                    ans['y'].push(parseInt(pair[1]))
                }
                return ans
            }, { 'x': [], 'y': [] })
    const MIN_X = folds['x'][folds['x'].length -1]
    const MIN_Y = folds['y'][folds['y'].length -1]
    const touchedNodes = Array.from(Array(MIN_Y), () => new Array(MIN_X).fill(''))
    const nodes =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .filter(line => !line.includes(' '))
            .map(line => line.split(','))
            .map(pair => {
                let x = pair[0]
                let y = pair[1]
                for (yFold of folds['y']) {
                    y = Math.abs(yFold - (Math.abs(yFold - y)))
                }
                for (xFold of folds['x']) {
                    x = Math.abs(xFold - (Math.abs(xFold - x)))
                }
                touchedNodes[y][x] = 8
            })
    return (touchedNodes)
}

console.log(`example output:`)
console.table(solveInput(EXAMPLE_FILE))

console.log(`final output:`)
console.table(solveInput(QUESTION_FILE))