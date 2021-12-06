const fs = require('fs')

const INITIAL_STATE_FILE = "day6.txt"

const TURN_COUNT = 80
const BREED_PERIOD = 7
const JUVI_PERIOD = 2

// const initial_state = [3, 4, 3, 1, 2];   //given test state

const breedersByTurnClass = new Array(BREED_PERIOD).fill(0)
const juvisByTurn = [0, 0]

const initial_state =
    fs.readFileSync(INITIAL_STATE_FILE)
        .toString()
        .split(',')
        .map((x) => { return parseInt(x) })

for (fish of initial_state) {
    const breedTurn = fish + 1;
    breedersByTurnClass[breedTurn]++;
}

for (let turn = 1; turn <= TURN_COUNT; turn++) {
    const turnClass = turn % BREED_PERIOD;
    const breedersThisTurn = breedersByTurnClass[turnClass]
    breedersByTurnClass[turnClass] += juvisByTurn[0]
    juvisByTurn[0] = juvisByTurn[1]
    juvisByTurn[1] = breedersThisTurn
}

const breederCount = breedersByTurnClass.reduce((a, b) => a + b, 0)
const juvisCount = juvisByTurn.reduce((a, b) => a + b, 0)

console.log(`total = ${breederCount + juvisCount}`)