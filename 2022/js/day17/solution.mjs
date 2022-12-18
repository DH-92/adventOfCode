#!/usr/bin/env zx
import "zx/globals";
import fs from 'fs';
const day = "day17";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const fileToArr = (path, delim = '\n') => fs.readFileSync(path).toString().split(delim)

const rocks = [
    [
        [0, 0, 1, 1, 1, 1, 0],
    ],
    [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
    ],
    [
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
    ],
    [
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
    ],
]

const emptyRow = [0, 0, 0, 0, 0, 0, 0];

const part1 = (path) => {
    let turn = 0;
    const wind = fileToArr(path, '');
    let rockCount = 0;
    let rock;
    const states = {};
    const spawn = () => {
        rock = JSON.parse(JSON.stringify(rocks[rockCount % 5]));
        rockCount++;
        for (let i = 0; i < rock.length + 3; i++) grid.push(emptyRow)
    }

    const rowEmpty = (row) => row.every(c => c === 0)

    const moveLeft = () => {
        rock.forEach(row => {
            row.push(0)
            row.shift()
        })
    }

    const moveRight = () => {
        rock.forEach(row => {
            row.unshift(0)
            row.pop()
        })
    }

    const blowRock = (dir) => {
        turn++;
        if (dir === "<") {
            if (!rock.every(row => row[0] === 0)) return;
            moveLeft()
            if (!validPos(rock)) moveRight()
        } else {
            if (!rock.every(row => row[row.length-1] === 0)) return;            
            moveRight()
            if (!validPos(rock)) moveLeft()
        }
    }

    const validPos = () => {
        const flatArea = (grid.slice(0)).splice(-1 * rock.length).flat()
        const flatRock = rock.slice(0).flat();
        return flatRock.every((x, i) => !(x && flatArea[i]))
    }

    const canDrop = () => {
        const flatArea = (grid.slice(0)).splice(-1 * (1 + rock.length)).flat()
        const flatRock = rock.slice(0).flat();
        return flatRock.every((x, i) => !(x && flatArea[i]))
    }

    const stopRock = () => {
        const testArea = grid.splice(-1 * (rock.length));
        const newArea =
            testArea.map((row, y) =>
                row.map((cell, x) => (cell || rock[y][x]) ? 1 : 0)
            )
        while(newArea.length) grid.push(newArea.shift())
    }

    const pruneGrid = () => {
        while (rowEmpty(grid[grid.length-1])) grid.pop();
    }

    const cycleFinder = () => {
        const topLineString = grid[grid.length - 1].join('');
        const currState = states[`${topLineString}, ${rockCount % 5}, ${turn % wind.length}`]
        if (currState !== undefined) {
            currState.push([rockCount,grid.length]);
        } else {
            states[`${topLineString}, ${rockCount % 5}, ${turn % wind.length}`] = [[rockCount,grid.length]];
        }
    }
    let grid = [[1, 1, 1, 1, 1, 1, 1]];
    for (let i = 0; i < 2022; i++) {
        // cycleFinder()
        spawn();
        while (true) {
            blowRock(wind[turn % wind.length])
            if (!canDrop()) break
            rock.push(emptyRow);
        }
        stopRock();
        pruneGrid();
    }
    console.log([...Object.entries(states)].filter(x => x[1].length > 1))
    return grid.length-1;
}
console.time()
// console.log(`part1 -- example: ${part1(example)}`)
console.log(`part1 -- input: ${part1(input)}`)
// console.log(`part2 -- example: ${part2(example)}`)
// console.log(`part2 -- input: ${part2(input)}`)
console.timeLog()


// 1735 is rockCount cycle period
// 2781 is grid length cycle period

// tril%1735 = 140
// 140+1735 = 1875
// (tril-1809)/1735 = 576368875
// 2972 is the output with 1875 rocks dropped
// 2972 + (576368875 * 2781) = 1602881844347 = answer


// rcp = rockCountPeriod = 1735
// glp = gridLengthPeriod = 2781
// go = goalOffset = goal%rcp = 140
// go2 = oneCycleAfterGoalOffset = go + rcp = 1875
// lc = loopCount = (goal-go2)/rcp = 576368875
// gls = gridLength after 1875 rocks = 2972
// answer = (lc*glp) + gls

// 1735 is rockCount cycle period
// 2781 is grid length cycle period

// tril%1735 = 140
// 140+1735 = 1875
// (tril-1809)/1735 = 576368875
// 2972 is the output with 1875 rocks dropped
// 2972 + (576368875 * 2781) = 1602881844347 = answer


// rcp = rockCountPeriod = 1735
// glp = gridLengthPeriod = 2781
// go = goalOffset = goal%rcp = 140
// go2 = oneCycleAfterGoalOffset = go + rcp = 1875
// lc = loopCount = (goal-go2)/rcp = 576368875
// gls = gridLength after 1875 rocks = 2972
// answer = (lc*glp) + gls