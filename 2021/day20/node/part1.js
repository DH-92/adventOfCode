const fs = require('fs')

const QUESTION_FILE = "./input.txt"
const QUESTION_ALGO_FILE = "./input_algo.txt"

const EXAMPLE_FILE = "./example.txt"
const EXAMPLE_ALGO_FILE = "./example_algo.txt"

function solveInput(inputFile,inputAlgoFile,loops) {
    const algo =
        fs.readFileSync(inputAlgoFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .map(line => [...line].map(char => parseInt(char)))
    
    let nodes =
        fs.readFileSync(inputFile)
            .toString()     //input is text
            .split('\n')    //split by line
            .filter(line => line.length != 0)  //don't want empty lines
            .map(line => [...line].map(char => parseInt(char)))

    // define a starting board with 10 positions (1 to 10)
    // each position starts in a position on the board - players 1 goes first
    // each player rolls "deterministic dice" (100 sided dice rolling a value equal to the current role count)
    // the game ends when a player has a score over 1000

    let player1Points = 0
    let player2Points = 0

    let rolls = 0
    const topPoints = 1000
    while (player1Points < topPoints && player2Points < topPoints) {
        rolls++
        roll = ((rolls-1)%100)+1
        if ((rolls-1) % 6 < 3) {
            player1 += roll
            player1 = ((player1-1) % 10)+1
            // console.log(`roll: ${rolls}  player1 rolls ${roll} - now position ${player1}`)
        } else {
            player2 += roll
            player2 = ((player2-1) % 10)+1
            // console.log(`roll: ${rolls}  player2 rolls ${roll} - now position ${player2}`)
        }

        if ((rolls-1) % 6 == 2) {
            player1Points += player1
            // console.log(`rolls ${rolls}, position ${player1}, score ${player1Points}`)
        } else if ((rolls-1) % 6 == 5) {
            player2Points += player2
            // console.log(`rolls ${rolls}, position ${player2}, score ${player2Points}`)
        }
        
    }
    return (rolls * Math.min(player1Points,player2Points))
}

console.log(`example output: ${solveInput(EXAMPLE_FILE,EXAMPLE_ALGO_FILE,2)}  -- expect 35`)
console.log(`final   output: ${solveInput(QUESTION_FILE,QUESTION_ALGO_FILE,2)}  -- expect 920079`)
// const finalOutput = solveInput(QUESTION_FILE)
// console.log(`final output is: ${finalOutput}`)
