const fs = require('fs')

function solveInput(inputFile) {
    fs.readFileSync(inputFile)
        .toString()
        .split('\n')
        .filter((x) => { return x.length != 0 })
        .map(solveLine)
}

function solveLine(line) {
    const cipher = {}
    const splitPipe = line.split('|')
    // console.log(line)

    var inputWords =
        splitPipe[0].split(' ')
            .filter((x) => { return x.length != 0 })
            .sort((x, y) => { return x.length - y.length })
    // console.log(inputWords)

    var inputWordsByLength = []
    for (word of inputWords) {
        sortedWord = [...word].sort().join('')
        // console.log (`${word} --> ${sortedWord}`)
        if (Array.isArray(inputWordsByLength[word.length])) {
            inputWordsByLength[word.length].push(sortedWord)
        } else {
            inputWordsByLength[word.length] = [sortedWord]
        }
    }

    var number = [];

    const outputWords =
        splitPipe[1].split(' ')
            .filter((x) => { return x.length != 0 })

    /* Formula
    find word with length 2 -- this is #1 -- the letter not in above are C and F
    find word with length 3 -- this is #7 -- the letter not in above is A
    find word with length 4 -- this is #4 -- the letters not in above are B and D
    find letters not in words with length 2,3   -- this letter is D, B is defined
    find letters not in words with length 2,3,4 -- the letters are E and G
    find word with length 5 with A,C,D,F in it -- the remaining letter is G, E is defined
    */

    //A is in cases 3,7     !!   4,5,6      (numbers 0,  2,3,  5,6,7,8,9    !! 1,4)
    //B is in cases 4,7     !!   2,3,5,6    (numbers 0,      4,5,6,  8,9    !! 1,2,3,7)
    //C is in cases 2,3,4,7 !!   5,6        (numbers 0,1,2,3,4,    7,8,9    !! 5,6)
    //D is in cases 4,5,6,7 !!   2,3        (numbers     2,3,4,5,6,  8,9    !! 0,1,7)
    //E is in cases 5,6,7   !!   2,3,4      (numbers 0,  2,      6,  8,9    !! 1,3,4,5,7,9)
    //F is in cases 2,3,4,7 !!   5,6        (numbers 0,1,  3,4,5,6,7,8,9    !! 2)
    //G is in cases 5,6,7   !!   2,3,4      (numbers 0,  2,3,5,  6,  8,9    !! 1,4,7)

    // const chars = [...word]

    // case 2
    // number 1 contains C and F
    number[1] = inputWordsByLength[2][0];
    cipher["c"] = [...number[1]]
    cipher["f"] = cipher["c"]

    // case 3
    // number 7 contains C, F and A (resolve A)
    number[7] = inputWordsByLength[3][0];
    cipher["a"] =
        [...number[7]].filter((c) => {
            return !cipher["c"].includes(c) && !cipher["f"].includes(c)
        })

    // case 4
    // number 4 contains C, F, B and D
    number[4] = inputWordsByLength[4][0]
    cipher["b"] =
        [...number[4]].filter((c) => {
            return !cipher["c"].includes(c) && !cipher["f"].includes(c)
        })
    cipher["d"] = cipher["b"]

    // case 5
    // number 2 contains a,   c,d,e,   g --- if it's 2 --    1 c candidates && 1 d candidate - this resolves C and D (others are E and G)
    // number 3 contains a,   c,d,  f, g --- if it's 3 --    2 c candidates && 1 d candidate - this resolves D (other are F and G)
    // number 5 contains a, b,  d,  f, g --- if it's 5 --    it will include both d candidates

    for (word of inputWordsByLength[5]) {
        if (cipher["c"].every(c => word.includes(c))) {
            number[3] = word
        } else if (cipher["d"].every(c => word.includes(c))) {
            number[5] = word
        } else {
            number[2] = word
        }
    }

    cipher["c"] =
        cipher["c"].filter(c => {
            return number[2].includes(c)
        })
    
    // cipher["f"] =
    //     cipher["f"].filter(c => {
    //         return !cipher["c"].includes(c)
    //     })
    cipher["d"] =
        cipher["d"].filter(c => {
            return number[2].includes(c)
        })
    
    // cipher["b"] =
    //     cipher["b"].filter(c => {
    //         return !cipher["d"].includes(c)
    //     })
    // cipher["g"] =
    //     [...number[2]].filter(c => {
    //         return number[3].includes(c) &&
    //             number[5].includes(c) &&
    //             !cipher["a"].includes(c) &&
    //             !cipher["d"].includes(c)
    //     })
    cipher["e"] =
        [...number[2]].filter(c => {
            return !cipher["b"].includes(c) &&
                !number[3].includes(c) &&
                !number[5].includes(c)
        })
 
    // case 6
    // number 0 contains all but d
    // number 6 contains all but c
    // number 9 contains all but e
    for (word of inputWordsByLength[6]) {
        if (!cipher["c"].every(c => word.includes(c))) {
            number[6] = word
        } else if (!cipher["d"].every(c => word.includes(c))) {
            number[0] = word
        } else {
            number[9] = word
        }
    }

    // case 7
    number[8] = inputWordsByLength[7]

    // console.log(`0=${number[0]}`)
    // console.log(`1=${number[1]}`)
    // console.log(`2=${number[2]}`)
    // console.log(`3=${number[3]}`)
    // console.log(`4=${number[4]}`)
    // console.log(`5=${number[5]}`)
    // console.log(`6=${number[6]}`)
    // console.log(`7=${number[7]}`)
    // console.log(`8=${number[8]}`)
    // console.log(`9=${number[9]}`)
    // console.log(cipher)
    var num = "";
    for (word of outputWords) {
        sortedWord = [...word].sort().join('')
        // console.log(${sortedWord})
        for (var i = 0; i < 10; i++){
            if (sortedWord == number[i]) {num+=i}
        }
    }
    sum+= parseInt(num)
    console.log(num)
    console.log("----")
    // process.exit()
}

const QUESTION_FILE = "day8.txt" //question
const EXAMPLE_FILE = "day8e.txt" //example

let output = 0;
let sum = 0;

// solveInput(EXAMPLE_FILE)
solveInput(QUESTION_FILE)
console.log(sum)