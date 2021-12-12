const fs = require('fs')

const INITIAL_STATE_FILE = "input.txt" //question
// const INITIAL_STATE_FILE = "example.txt" //example

const wordsByLength = new Array(10).fill(0)

const initialState =
    fs.readFileSync(INITIAL_STATE_FILE)
        .toString()
        .split('\n')
        .filter((x) => { return x.length != 0 })
        .map((line) => {
            const splitPipe = line.split('|')
            // const inputWords =
            //     splitPipe[0].split(' ')
            //         .filter((x) => { return x.length != 0 })
            const outputWords =
                splitPipe[1].split(' ')
                    .filter((x) => { return x.length != 0 })
            for (word of outputWords) {
                wordsByLength[word.length]++
            }
        })
const sum = wordsByLength[2] + wordsByLength[3] + wordsByLength[4] + wordsByLength[7]
console.log(sum)
process.exit()
