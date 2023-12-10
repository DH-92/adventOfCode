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
  return [grid, start]
}

const buildStart = (grid, start) => {
  const x = start.x
  const y = start.y
  const toAdd: Node[] = []
  const u = grid[y - 1][x]
  const d = grid[y + 1][x]
  const l = grid[y][x - 1]
  const r = grid[y][x + 1]
  if (u) {
    if (u.prev === start) {
      toAdd.push(u)
    } else if (u.next === start) {
      toAdd.push(u)
    }
  }
  if (l) {
    if (l.prev === start) {
      toAdd.push(l)
    } else if (l.next === start) {
      toAdd.push(l)
    }
  }
  if (r) {
    if (r.prev === start) {
      toAdd.push(r)
    } else if (r.next === start) {
      toAdd.push(r)
    }
  }
  if (d) {
    if (d.prev === start) {
      toAdd.push(d)
    } else if (d.next === start) {
      toAdd.push(d)
    }
  }
  start.dist = 0
  start.prev = toAdd[0]
  start.next = toAdd[1]
  if (toAdd.includes(u) && toAdd.includes(l)) start.val === 'J'
  if (toAdd.includes(u) && toAdd.includes(d)) start.val === '|'
  if (toAdd.includes(u) && toAdd.includes(r)) start.val === 'L'
  if (toAdd.includes(d) && toAdd.includes(l)) start.val === '7'
  if (toAdd.includes(d) && toAdd.includes(r)) start.val === 'F'
  if (toAdd.includes(r) && toAdd.includes(l)) start.val === '-'
}

const part1 = (path: string): string | number => {
  const [grid, start] = buildGrid(inputHandler.toArray(path))
  buildStart(grid, start)

  let farthest: number = 0
  let pending: Node[] = [start]
  while (pending.length) {
    const curr = pending.shift()!
    const prev = curr.prev!
    const next = curr.next!
    const dist = curr.dist + 1
    farthest = curr.dist
    if (prev.dist > dist) {
      prev.dist = dist
      pending.push(prev)
    }
    if (next.dist > dist) {
      next.dist = dist
      pending.push(next)
    }
  }
  return farthest
}

const part2 = (path: string): string | number => {
  const [grid, start] = buildGrid(inputHandler.toArray(path))
  buildStart(grid, start)

  const grid2 = getGrid(() => false, grid.length, grid[0].length)
  start.dist = 0
  let pending: Node[] = [start]
  while (pending.length) {
    const curr = pending.shift()!
    const x = curr.x
    const y = curr.y
    grid2[y][x] = true
    const prev = curr.prev!
    const next = curr.next!
    const dist = curr.dist + 1
    if (prev.dist > dist) {
      prev.dist = dist
      pending.push(prev)
    }
    if (next.dist > dist) {
      next.dist = dist
      pending.push(next)
    }
  }
  let sum = 0
  grid2.forEach((l, y) => {
    let inside = false
    let dir = false
    l.forEach((c, x) => {
      if (!c) {
        if (inside) sum++
        return
      }
      switch (grid[y][x].val) {
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
  })
  return sum
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
