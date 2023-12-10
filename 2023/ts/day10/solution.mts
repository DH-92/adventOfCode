#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  LINE,
  sum,
  bench,
  Logger,
  range,
  getGrid,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

class Node {
  // x: number
  // y: number
  pos: string
  val: string
  dist: number = Number.MAX_SAFE_INTEGER
  left?: Node
  right?: Node
}

const part1 = (path: string): string | number => {
  const lines = inputHandler.toArray(path)
  const grid = getGrid(() => new Node(), lines.length + 5, lines[0].length + 5)
  let start
  lines.forEach((l, yy) => {
    l.split('').forEach((c, xx) => {
      const y = yy + 1
      const x = xx + 1
      if (c === '.') {
        grid[y][x] = '.'
        return
      }
      const node = grid[y][x]
      node.pos = `${y},${x}`
      node.val = c
      if (c === 'S') {
        start = node
      }
      // console.log(node)
      if (c === '|') {
        node.left = grid[y - 1][x]
        node.right = grid[y + 1][x]
      }
      if (c === '-') {
        node.left = grid[y][x - 1]
        node.right = grid[y][x + 1]
      }
      if (c === 'F') {
        node.left = grid[y + 1][x]
        node.right = grid[y][x + 1]
      }
      if (c === 'L') {
        grid[y][x].left = grid[y - 1][x]
        grid[y][x].right = grid[y][x + 1]
      }
      if (c === '7') {
        node.left = grid[y][x - 1]
        node.right = grid[y + 1][x]
      }
      if (c === 'J') {
        node.left = grid[y - 1][x]
        node.right = grid[y][x - 1]
      }
    })
  })
  const [y, x] = start.pos.split(',').map(Number)
  const toAdd = []
  if (grid[y - 1][x] !== '.') {
    if (grid[y - 1][x].left === start) {
      toAdd.push(grid[y - 1][x])
    }
    if (grid[y - 1][x].right === start) {
      toAdd.push(grid[y - 1][x])
    }
  }
  if (grid[y][x - 1] !== '.') {
    if (grid[y][x - 1].left === start) {
      toAdd.push(grid[y][x - 1])
    }
    if (grid[y][x - 1].right === start) {
      toAdd.push(grid[y][x - 1])
    }
  }
  if (grid[y][x + 1] !== '.') {
    if (grid[y][x + 1].left === start) {
      toAdd.push(grid[y][x + 1])
    }
    if (grid[y][x + 1].right === start) {
      toAdd.push(grid[y][x + 1])
    }
  }
  if (grid[y + 1][x] !== '.') {
    if (grid[y + 1][x].left === start) {
      toAdd.push(grid[y + 1][x])
    }
    if (grid[y + 1][x].right === start) {
      toAdd.push(grid[y + 1][x])
    }
  }
  if (toAdd.length != 2) throw 'TO ADD FOUND TOO MANY'
  start.left = toAdd[0]
  start.right = toAdd[1]
  start.dist = 0
  let curr = start
  let toDo = []
  let farthest
  while (true) {
    const l = curr.left
    const r = curr.right
    const d = curr.dist + 1
    farthest = curr
    if (l.dist > d) {
      l.dist = d
      toDo.push(l)
    }
    if (r.dist > d) {
      r.dist = d
      toDo.push(r)
    }
    if (toDo.length === 0) break
    curr = toDo.shift()
  }
  return farthest.dist
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path)
  const grid = getGrid(() => new Node(), lines.length + 2, lines[0].length + 2)
  const grid2 = getGrid(() => '', lines.length + 2, lines[0].length + 2)
  let start = grid[42][112]
  lines.forEach((l, yy) => {
    l.split('').forEach((c, xx) => {
      const y = yy + 1
      const x = xx + 1
      if (c === '.') {
        grid[y][x] = '.'
        grid2[y][x] = '.'
        return
      }
      const node = grid[y][x]
      node.pos = `${y},${x}`
      node.val = c
      if (c === 'S') {
        start = node
      }
      // console.log(node)
      if (c === '|') {
        node.left = grid[y - 1][x]
        node.right = grid[y + 1][x]
      }
      if (c === '-') {
        node.left = grid[y][x - 1]
        node.right = grid[y][x + 1]
      }
      if (c === 'F') {
        node.left = grid[y + 1][x]
        node.right = grid[y][x + 1]
      }
      if (c === 'L') {
        grid[y][x].left = grid[y - 1][x]
        grid[y][x].right = grid[y][x + 1]
      }
      if (c === '7') {
        node.left = grid[y][x - 1]
        node.right = grid[y + 1][x]
      }
      if (c === 'J') {
        node.left = grid[y - 1][x]
        node.right = grid[y][x - 1]
      }
    })
  })
  const [y, x] = start.pos.split(',').map(Number)
  const toAdd = []
  if (grid[y - 1][x] !== '.') {
    if (grid[y - 1][x].left === start) {
      toAdd.push(grid[y - 1][x])
    }
    if (grid[y - 1][x].right === start) {
      toAdd.push(grid[y - 1][x])
    }
  }
  if (grid[y][x - 1] !== '.') {
    if (grid[y][x - 1].left === start) {
      toAdd.push(grid[y][x - 1])
    }
    if (grid[y][x - 1].right === start) {
      toAdd.push(grid[y][x - 1])
    }
  }
  if (grid[y][x + 1] !== '.') {
    if (grid[y][x + 1].left === start) {
      toAdd.push(grid[y][x + 1])
    }
    if (grid[y][x + 1].right === start) {
      toAdd.push(grid[y][x + 1])
    }
  }
  if (grid[y + 1][x] !== '.') {
    if (grid[y + 1][x].left === start) {
      toAdd.push(grid[y + 1][x])
    }
    if (grid[y + 1][x].right === start) {
      toAdd.push(grid[y + 1][x])
    }
  }
  if (toAdd.length != 2) throw 'TO ADD FOUND TOO MANY'
  start.left = toAdd[0]
  start.right = toAdd[1]
  start.dist = 0
  let curr = start
  let toDo = []
  let farthest
  while (true) {
    const [y, x] = curr.pos.split(',').map(Number)
    grid2[y][x] = '#'
    const l = curr.left
    const r = curr.right
    const d = curr.dist + 1
    farthest = curr
    if (l.dist > d) {
      l.dist = d
      toDo.push(l)
    }
    if (r.dist > d) {
      r.dist = d
      toDo.push(r)
    }
    if (toDo.length === 0) break
    curr = toDo.shift()
  }
  console.table(grid2)
  let inside = 0
  grid2.forEach((l, y) => {
    let state = false
    let dir
    l.forEach((c, x) => {
      if (c === '#') {
        const v = grid[y][x].val
        if (v === '|') state = !state
        if (v === 'L') dir = 'up'
        if (v === 'J') state = dir === 'up' ? state : !state
        if (v === 'F') dir = 'down'
        if (v === '7') state = dir === 'down' ? state : !state
        grid2[y][x] = v
        return
      }
      if (state) {
        grid2[y][x] = 'I'
        inside++
        return
      }
      grid2[y][x] = 'O'
    })
  })
  // console.table(grid2)
  grid2.forEach(l => console.log(l.join('')))
  return inside
}

console.clear()
try {
  // bench(logger, 'part 1 example', () => part1(EXAMPLE), 4)
  // bench(logger, 'part 1 input', () => part1(INPUT), 6649)
  // bench(logger, 'part 2 example', () => part2('example2.txt'), 10)
  bench(logger, 'part 2 input', () => part2(INPUT), 6649)
} catch (e) {
  console.error(e)
}
