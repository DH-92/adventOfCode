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
                const juicyBit = fold.split(' ')[2]
                const pair = juicyBit.split('=')
                if (ans[0] || ans[1]) return ans
                if (!ans[0] && pair[0] === 'x') ans[0] = pair[1]
                if (!ans[1] && pair[0] === 'y') ans[1] = pair[1]
                return ans
            }, [])
    const X_FOLD = (folds[0]) ? folds[0] : 0
    const Y_FOLD = (folds[1]) ? folds[1] : 0
    const touchedNodes = new Set()
    const nodes =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .filter(line => !line.includes(' '))
            .map(line => line.split(','))
            .forEach(pair => {
                const x = Math.abs(X_FOLD - pair[0])
                const y = Math.abs(Y_FOLD - pair[1])
                touchedNodes.add(`${x},${y}`)
            })
    console.log(touchedNodes)
    return (touchedNodes.size)
}

console.log(`example output: ${solveInput(EXAMPLE_FILE)}  -- expect 17`)

// const finalOutput = solveInput(QUESTION_FILE)
// console.log(`final output is: ${finalOutput}`)
