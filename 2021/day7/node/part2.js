const fs = require('fs')

const INITIAL_STATE_FILE = "input.txt"

const initialState =
    fs.readFileSync(INITIAL_STATE_FILE)
        .toString()
        .split(',')
        .map((x) => { return parseInt(x) })
        .sort((a, b) => { return a - b})

// const initialState = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14].sort((a, b) => { return a -b})

const median = initialState[Math.floor(initialState.length / 2)];

function getFuelForGuess(guess) {
    return initialState.reduce((sum, crab) => {
        const distance = Math.abs(guess - crab);
        //formula for triangle numbers (1 + 2 + 3 .. n)
        const fuelUse = (distance * (distance + 1)) / 2; 
        return sum+fuelUse
    }, 0)
}

var guess = median;
var guessOutput = getFuelForGuess(guess);
var direction = 1;
var steps = Math.floor(Math.sqrt(initialState.length)-1);
while (true) {
    const oneForward = getFuelForGuess(guess + (direction*steps))
    if (oneForward < guessOutput) {
        guess+=(direction*steps)
        guessOutput=oneForward
        continue
    }
    const oneBackward = getFuelForGuess(guess - (direction*steps))
    if (oneBackward < guessOutput) {
        direction = direction*-1
        guess+=(direction*steps)
        guessOutput = oneBackward
        continue
    } else {
        if (steps == 1) break
        steps=Math.floor(steps/2)
    }
}

console.log(`final guess ${guess} resulted in ${guessOutput}`);
