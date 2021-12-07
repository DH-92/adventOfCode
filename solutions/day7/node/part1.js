const fs = require('fs')

const INITIAL_STATE_FILE = "day7.txt"

const initialState =
    fs.readFileSync(INITIAL_STATE_FILE)
        .toString()
        .split(',')
        .map((x) => { return parseInt(x) })
        .sort((a, b) => { return a -b})

// const initialState = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14].sort((a, b) => { return a -b})

const median = initialState[Math.floor(initialState.length / 2)];

const fuelUsage =
    initialState.reduce((sum, crab) => {
        const fuelUse = Math.abs(median - crab);
        return sum+fuelUse
    }, 0)

console.log(fuelUsage);
