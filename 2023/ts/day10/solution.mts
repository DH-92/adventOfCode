#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  bench,
  Logger,
  getGrid,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

class Node {
  x: number
  y: number
  val?: string
  dist: number = Number.MAX_SAFE_INTEGER
  prev?: Node
  next?: Node
}

const buildGrid = lines => {
  const grid: Node[][] = getGrid(() => new Node(), lines.length + 2, lines[0].length + 2)
  let start
  lines.forEach((l, yy) => {
    l.split('').forEach((c, xx) => {
      const y = yy + 1
      const x = xx + 1
      if (c === '.') {
        delete grid[y][x]
        return
      }
      const node = grid[y][x]
      node.y = y
      node.x = x
      node.val = c
      switch (c) {
        case 'S':
          start = node
          break
        case '|':
          node.prev = grid[y - 1][x]
          node.next = grid[y + 1][x]
          break
        case '-':
          node.prev = grid[y][x - 1]
          node.next = grid[y][x + 1]
          break
        case 'F':
          node.prev = grid[y + 1][x]
          node.next = grid[y][x + 1]
          break
        case 'L':
          node.prev = grid[y - 1][x]
          node.next = grid[y][x + 1]
          break
        case '7':
          node.prev = grid[y][x - 1]
          node.next = grid[y + 1][x]
          break
        case 'J':
          node.prev = grid[y - 1][x]
          node.next = grid[y][x - 1]
          break
      }
    })
  })
  buildStart(grid, start)
  return [grid, start]
}

const buildStart = (grid, start) => {
  const x = start.x
  const y = start.y
  const toAdd: Node[] = []
  const up = grid[y - 1][x]
  const down = grid[y + 1][x]
  const left = grid[y][x - 1]
  const right = grid[y][x + 1]
  if (up) {
    if (up.prev === start) {
      toAdd.push(up)
    } else if (up.next === start) {
      toAdd.push(up)
    }
  }
  if (down) {
    if (down.prev === start) {
      toAdd.push(down)
    } else if (down.next === start) {
      toAdd.push(down)
    }
  }
  if (left) {
    if (left.prev === start) {
      toAdd.push(left)
    } else if (left.next === start) {
      toAdd.push(left)
    }
  }
  if (right) {
    if (right.prev === start) {
      toAdd.push(right)
    } else if (right.next === start) {
      toAdd.push(right)
    }
  }

  start.dist = 0
  start.prev = toAdd[0]
  start.next = toAdd[1]
  if (toAdd.includes(up) && toAdd.includes(left)) start.val === 'J'
  if (toAdd.includes(up) && toAdd.includes(down)) start.val === '|'
  if (toAdd.includes(up) && toAdd.includes(right)) start.val === 'L'
  if (toAdd.includes(down) && toAdd.includes(left)) start.val === '7'
  if (toAdd.includes(down) && toAdd.includes(right)) start.val === 'F'
  if (toAdd.includes(right) && toAdd.includes(left)) start.val === '-'
}

const part1 = (path: string): string | number => {
  const [, start] = buildGrid(inputHandler.toArray(path))
  let farthest: number = 0
  let pending: Node[] = [start]
  while (pending.length) {
    const curr = pending.shift()!
    const prev = curr.prev!
    const next = curr.next!
    const dist = curr.dist + 1
    farthest = curr.dist
    if (prev.dist > farthest) {
      prev.dist = dist
      pending.push(prev)
    }
    if (next.dist > farthest) {
      next.dist = dist
      pending.push(next)
    }
  }
  return farthest
}

const part2 = (path: string): string | number => {
  const [grid, start] = buildGrid(inputHandler.toArray(path))

  const grid2: Array<boolean | string>[] = getGrid(() => false, grid.length, grid[0].length)
  let pending: Node = start
  while (true) {
    const x = pending.x
    const y = pending.y
    grid2[y][x] = pending.val!
    const next = pending.next!
    if (next === start) break
    if (next.next === pending) next.next = next.prev
    pending = next
  }

  return grid2.reduce((sum, line) => {
    let inside = false
    let dir = false
    line.forEach(char => {
      if (!char) {
        if (inside) sum++
        return
      }
      switch (char) {
        case '|':
          inside = !inside
          break
        case 'L':
          dir = true
          break
        case 'J':
          inside = dir ? inside : !inside
          break
        case 'F':
          dir = false
          break
        case '7':
          inside = dir ? !inside : inside
          break
      }
    })
    return sum
  }, 0)
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 4)
  bench(logger, 'part 1 input', () => part1(INPUT), 6649)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 1)
  bench(logger, 'part 2 example', () => part2('example2.txt'), 10)
  bench(logger, 'part 2 input', () => part2(INPUT), 601)
} catch (e) {
  console.error(e)
}
