const fs = require('fs');

const day = "day9";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`
const fileToArr = (path, delim = '\n') =>
    fs.readFileSync(path).toString().split(delim)

const parseInput = (path) =>
    fileToArr(path).map(row => row.split(' '))

const moveHead = (dir, head) => {
    if (dir === "L") return head.x--;
    if (dir === "R") return head.x++;
    if (dir === "D") return head.y--;
    if (dir === "U") return head.y++;
}

const moveNode = (leader, follower) => {
    const deltaX = Math.abs(leader.x - follower.x)
    const deltaY = Math.abs(leader.y - follower.y)
    const followX = () => follower.x += leader.x > follower.x ? 1 : -1
    const followY = () => follower.y += leader.y > follower.y ? 1 : -1
    const isNeighbour = deltaX <= 1 && deltaY <= 1;
    if (isNeighbour) {
        return
    }
    if (deltaX && deltaY) {
        followX()
        followY()
    } else if (deltaX) {
        followX()
    } else if (deltaY) {
        followY()
    }
}

const calc = (path, size) => {
    const moves = parseInput(path);
    const nodes = new Array(size).fill(null).map(x => ({ x: 0, y: 0 }))
    const head = nodes[0]
    const tail = nodes[nodes.length - 1]
    return moves.reduce((tTouched,[dir, dist]) => {
        for (let frame = 0; frame < dist; frame++) {
            nodes.forEach((node, i) =>
                i === 0 ? moveHead(dir, head) : moveNode(nodes[i - 1], node)
            )
            tTouched.add(`${tail.x},${tail.y}`)
        }
        return tTouched
    }, new Set()).size
}

console.log(`part1 -- example: ${calc(example,2)}`)
console.log(`part1 -- input: ${calc(input, 2)}`)

console.log(`part2 -- example: ${calc(example, 10)}`)
console.log(`part2 -- input: ${calc(input, 10)}`)
