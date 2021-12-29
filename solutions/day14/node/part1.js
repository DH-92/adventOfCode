const fs = require('fs')

const QUESTION_FILE = "./input.txt"
const EXAMPLE_FILE = "./example.txt"

function solveInput(inputFile) {
    const rules =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .filter(line => line.includes(' -> '))  //don't want empty lines
            .map(x => {
                const match = x.split(' -> ')[0].split("")
                const out = x.split(' -> ')[1]
                return [match[0], match[1], out]
            })

    const initialState =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .filter(line => !line.includes(' -> '))  //don't want empty lines
            .map(line => line.split(""))[0]

    let x = initialState
    for (let i = 0; i < 10; i++) {
        let y = []
        x.reduce((last, curr) => {
            match = rules.filter(rule => rule[0] === last && rule[1] === curr)
            y.push(last)
            y.push(match[0][2])
            return curr
        })
        y.push(x[x.length - 1])
        x = y
    }
    console.log(x.length)
    outputByVal =
        x.reduce((output, val) => {
            if (!output[val]) {
                output[val] = 1
            } else {
                output[val]++
            }
            return output
        }, {})

    outputByVal = Object.entries(outputByVal).sort((a, b) => a[1] - b[1])
    return(outputByVal[outputByVal.length - 1][1] - outputByVal[0][1])
}

console.log(`example output: ${solveInput(EXAMPLE_FILE)}  -- expect 1588`)

// const finalOutput = solveInput(QUESTION_FILE)
// console.log(`final output is: ${finalOutput}`)
