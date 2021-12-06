const fs = require('fs')

const LINE_DATA_PATH = "day5.txt";
const ROW_LENGTH = 1000;

const markedCoords = new Set;
const multiMarkedCoords = new Set;

function fillVertical(start, finish, col) {
    const smallest = (start < finish) ? start : finish
    const largest = (start > finish) ? start : finish
    for (let ii = smallest; ii <= largest; ii++) {
        const coords = ii + (col * ROW_LENGTH)
        if (markedCoords.has(coords)) {
            multiMarkedCoords.add(coords)
        } else {
            markedCoords.add(coords)
        }
    }
}
//fillHorizontal(lineSegment[0][1], lineSegment[1][1], lineSegment[0][0])
function fillHorizontal(start, finish, row) {
    const smallest = (start < finish) ? start : finish
    const largest = (start > finish) ? start : finish
    for (let ii = smallest; ii <= largest; ii++) {
        // console.log(`   assessing point: ${row},${ii}`)
        const coords = row + (ii * ROW_LENGTH)
        if (markedCoords.has(coords)) {
            // console.log(`     double marking: ${JSON.stringify(coords)}`)
            multiMarkedCoords.add(coords)
        } else {
            // console.log(`     marking: ${JSON.stringify(coords)}`)
            markedCoords.add(coords)
        }
    }
}

function fillDiagonal(start, finish) {
    const leftMost  = (start[0] < finish[0]) ? start : finish
    const rightMost = (start[0] > finish[0]) ? start : finish
    const direction = (leftMost[1] < rightMost[1]) ? "up" : "down"
    const horizontalDistance = rightMost[0] - leftMost[0];
    // if (direction == "down")  console.log(`line starts at ${leftMost} and is heading ${direction} over distance ${horizontalDistance}`)
    for (let ii = 0; ii <= horizontalDistance; ii++) {
        var coords
        if (direction == "up") {
            // console.log(`   assessing point: ${(leftMost[0]+ii)},${(leftMost[1] + ii)}`)
            coords = (leftMost[0]+ii) + ((leftMost[1] + ii) * ROW_LENGTH)
        } else {
            console.log(`   assessing point: ${(leftMost[0]+ii)},${(leftMost[1] - ii)}`)
            coords = (leftMost[0]+ii) + ((leftMost[1] - ii) * ROW_LENGTH)
        }
        
        if (markedCoords.has(coords)) {
            // console.log(`     double marking: ${JSON.stringify(coords)}`)
            multiMarkedCoords.add(coords)
        } else {
            // console.log(`     marking: ${JSON.stringify(coords)}`)
            markedCoords.add(coords)
        }
    }
    // if (direction == "down") process.exit();
}

const lineSegments =
    fs.readFileSync(LINE_DATA_PATH)
        .toString()
        .split('\n')
        .filter((x) => { return x.length != 0 })
        .map((lineString) => {
            return [[
                parseInt(lineString.split(' -> ')[0].split(',')[0]),    //x1
                parseInt(lineString.split(' -> ')[0].split(',')[1]),    //y1
            ], [
                parseInt(lineString.split(' -> ')[1].split(',')[0]),    //x2
                parseInt(lineString.split(' -> ')[1].split(',')[1])     //y2
            ]]
        })
        .map((lineSegment) => {
            if (lineSegment[0][1] == lineSegment[1][1]) {
                fillVertical(lineSegment[0][0], lineSegment[1][0], lineSegment[0][1])
            } else if (lineSegment[0][0] == lineSegment[1][0]) {
                fillHorizontal(lineSegment[0][1], lineSegment[1][1], lineSegment[0][0])
            } else {
                // console.log(`found diagonal line -- ${lineSegment[0]} -> ${lineSegment[1]}`)
                fillDiagonal(lineSegment[0], lineSegment[1])
            }
        })

console.log(JSON.stringify(multiMarkedCoords.size))
process.exit()