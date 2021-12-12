const fs = require('fs')

const QUESTION_FILE = "input.txt" //question
const EXAMPLE_FILE = "example.txt" //example

function wordsByLength(line) {
    return line
        .split('|')[0]
        .split(' ')
        .filter(x => { return x.length != 0 })
        .map(word => { return [...word].sort().join('') })
        .reduce((wordsByLength, word) => {
            const l = word.length
            if (!Array.isArray(wordsByLength)) wordsByLength = []
            if (!Array.isArray(wordsByLength[l])) {
                wordsByLength[l] = [word]
            } else wordsByLength[l].push(word)
            return wordsByLength
        }, [])
}

function segmentsByValue(wordsByLength) {
    const number = []
    number[1] = wordsByLength[2][0]
    number[7] = wordsByLength[3][0]
    number[4] = wordsByLength[4][0]
    number[8] = wordsByLength[7][0]

    const inFourButNotFive = [...number[4]].filter(c => { return ![...number[1]].includes(c) })

    for (word of wordsByLength[5]) {
        //array.every returns true if all elements pass a filter
        const isThree = [...number[1]].every(c => word.includes(c))
        const isFive = inFourButNotFive.every(c => word.includes(c))
        if (isThree) {
            number[3] = word
        } else if (isFive) {
            number[5] = word
        } else { //isTwo
            number[2] = word
        }
    }

    for (word of wordsByLength[6]) {
        const isSix = ![...number[1]].every(c => word.includes(c))
        const isZero = !inFourButNotFive.every(c => word.includes(c))
        if (isZero) {
            number[0] = word
        } else if (isSix) {
            number[6] = word
        } else {
            number[9] = word
        }
    }
    return number
}

function solveLine(line) {

    const wordsLookup = wordsByLength(line)
        
    const segmentsLookup = segmentsByValue(wordsLookup)

    const lineOutput =
        line.split('|')[1]
            .split(' ')
            .filter(x => { return x.length != 0 })
            .map(word => { return [...word].sort().join('') })
            .reduce((num,word) => {
                segmentsLookup.filter((segments,value) => {
                    if (segments == word) num += value
                })
                return num
            },"")
    sum += parseInt(lineOutput)
}

function solveInput(inputFile) {
    fs.readFileSync(inputFile)
        .toString()
        .split('\n')
        .filter(x => { return x.length != 0 })
        .map(solveLine)
}

let sum = 0
solveInput(EXAMPLE_FILE)
console.log(sum)

sum = 0
solveInput(QUESTION_FILE)
console.log(sum)
