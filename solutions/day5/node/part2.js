const fs = require('fs')

const LINE_DATA_PATH = "input.txt";
const x_LENGTH = 1000;

const warn = new Set;
const danger = new Set;

function fillV(a, b, y) {
    const s = (a < b) ? a : b
    const l = (a > b) ? a : b
    for (let ii = s; ii <= l; ii++) {
        const c = ii + (y * x_LENGTH)
        if (warn.has(c)) {
            danger.add(c)
        } else {
            warn.add(c)
        }
    }
}

function fillH(a, b, x) {
    const s = (a < b) ? a : b
    const l = (a > b) ? a : b
    for (let ii = s; ii <= l; ii++) {
        const c = x + (ii * x_LENGTH)
        if (warn.has(c)) {
            danger.add(c)
        } else {
            warn.add(c)
        }
    }
}

function fillD(a, b) {
    const l  = (a[0] < b[0]) ? a : b
    const r = (a[0] > b[0]) ? a : b
    const d = (l[1] < r[1]) ? 1 : -1
    const u = r[0] - l[0]

    for (let ii = 0; ii <= u; ii++) {
        const c = (l[0]+ii) + ((l[1] + (ii*d)) * x_LENGTH)
        if (warn.has(c)) {
            danger.add(c)
        } else {
            warn.add(c)
        }
    }
}

fs.readFileSync(LINE_DATA_PATH)
    .toString()
    .split('\n')
    .filter((x) => { return x.length != 0 })
    .map((s) => {
        return [[
            parseInt(s.split(' -> ')[0].split(',')[0]),    //x1
            parseInt(s.split(' -> ')[0].split(',')[1]),    //y1
        ], [
            parseInt(s.split(' -> ')[1].split(',')[0]),    //x2
            parseInt(s.split(' -> ')[1].split(',')[1])     //y2
        ]]
    })
    .map((l) => {
        if (l[0][1] == l[1][1]) {
            fillV(l[0][0], l[1][0], l[0][1])
        } else if (l[0][0] == l[1][0]) {
            fillH(l[0][1], l[1][1], l[0][0])
        } else {
            fillD(l[0], l[1])
        }
    })

console.log(JSON.stringify(danger.size))