const fs = require('fs')

const LINE_DATA_PATH = "input.txt";
const ROW_LENGTH = 1000;

const markedCoords = new Set;
const multiMarkedCoords = new Set;

function fillVertical(start, finish, col) {
  const smallest = (start < finish) ? start : finish
  const largest = (start > finish) ? start : finish
  for (let ii = smallest; ii <= largest; ii++){
    const coords = col * ROW_LENGTH + ii
    if (markedCoords.has(coords)) {
      multiMarkedCoords.add(coords)
    } else {
      markedCoords.add(coords)
    }
  }
}

function fillHorizontal(start, finish, row) {
  const smallest = (start < finish) ? start : finish
  const largest = (start > finish) ? start : finish
  for (let ii = smallest; ii <= largest; ii++){
    console.log(`   assessing point: ${row},${ii}`)
    const coords = ii * ROW_LENGTH + row
    if (markedCoords.has(coords)) {
      console.log(`     double marking: ${JSON.stringify(coords)}`)
      multiMarkedCoords.add(coords)
    } else {
      console.log(`     marking: ${JSON.stringify(coords)}`)
      markedCoords.add(coords)
    }
  }
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
        ],[
          parseInt(lineString.split(' -> ')[1].split(',')[0]),  //x2
          parseInt(lineString.split(' -> ')[1].split(',')[1])   //y2
        ]]
    })
    .map((lineSegment) => {
      if (lineSegment[0][1] == lineSegment[1][1]) {
        fillVertical(lineSegment[0][0], lineSegment[1][0], lineSegment[0][1])
      } else fillHorizontal(lineSegment[0][1], lineSegment[1][1], lineSegment[0][0])
    })

console.log(JSON.stringify(multiMarkedCoords.size))
process.exit()