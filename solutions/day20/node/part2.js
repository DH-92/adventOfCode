const fs = require('fs')

const QUESTION_FILE = "./input.txt"
const EXAMPLE_FILE = "./example.txt"

function solveInput(inputFile) {
    const rules =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .map(line => [...line].map(char => parseInt(char)))
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

    let str = initialState.join('')
    // console.log(str)
    const size = 5000
    for (let i = 0; i < 40; i++) {
        const numChunks = Math.ceil(str.length / size)
        y = ""
        tail = ""
        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
            let x = str.substr(o, size).split("")
            x.reduce((last, curr) => {
                if (last === "") return curr
                match = rules.filter(rule => rule[0] === last && rule[1] === curr)
                y += last
                y += match[0][2]
                return curr
            }, tail)
            tail = x[x.length - 1]
        }
        y += tail
        str = y
        console.log(`${i}: ${str.length}`)
    }
    // console.log(str.length)

    outputByVal =
        str.split("").reduce((output, val) => {
            if (!output[val]) {
                output[val] = 1
            } else {
                output[val]++
            }
            return output
        }, {})

    outputByVal = Object.entries(outputByVal).sort((a, b) => a[1] - b[1])
    return (outputByVal[outputByVal.length - 1][1] - outputByVal[0][1])
}

console.log(`example output: ${solveInput(EXAMPLE_FILE)}  -- expect 1588`)

const finalOutput = solveInput(QUESTION_FILE)
console.log(`final output is: ${finalOutput}`)
