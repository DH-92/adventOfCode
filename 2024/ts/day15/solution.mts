#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  bench,
  Logger,
  LINE,
  transpose,
  PARAGRAPH,
  sum,
  getGrid,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

enum DIRS {
  UP = 'UP',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
}

const MOVE = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
}

type Grid = Array<Node | undefined>[]
class Node {
  x: number
  y: number
  value: string
  static: boolean = false
  grid: Grid
  constructor({ x, y, value, grid }: { x: number; y: number; value: string; grid: Grid }) {
    this.x = x
    this.y = y
    this.value = value
    this.grid = grid
  }
  canMove(dir: DIRS) {
    if (this.static) return false
    const { dx, dy } = MOVE[dir]
    const x2 = this.x + dx
    const y2 = this.y + dy

    const next = this.grid[y2][x2]
    if (next && next !== this && !next.canMove(dir)) return false
    if (this.value !== '[') return true

    const next2 = this.grid[y2][x2 + 1]
    if (next2 && next2 !== this && !next2.canMove(dir)) return false
    return true
  }
  move(dir: DIRS) {
    if (this.static) return false
    if (!this.canMove(dir)) return false
    const { dx, dy } = MOVE[dir]
    const x1 = this.x
    const y1 = this.y
    const x2 = this.x + dx
    const y2 = this.y + dy

    const next = this.grid[y2][x2]
    if (next && next !== this) next.move(dir)
    this.grid[y1][x1] = undefined
    this.grid[y2][x2] = this
    this.x = x2
    this.y = y2
    if (this.value !== '[') return true
    if (dir !== DIRS.LEFT) this.grid[y2]?.[x2 + 1]?.move(dir)
    this.grid[y1][x1 + 1] = undefined
    this.grid[y2][x2] = this
    this.grid[y2][x2 + 1] = this
    return true
  }
}
class Cursor extends Node {
  move(dir: DIRS) {
    const { dx, dy } = MOVE[dir]
    const x1 = this.x
    const y1 = this.y
    const x2 = this.x + dx
    const y2 = this.y + dy

    const next = this.grid[y2][x2]
    if (next && next.canMove(dir)) next.move(dir)
    this.grid[y1][x1] = undefined
    this.grid[y2][x2] = this
    this.x = x2
    this.y = y2
    return true
  }
}

const buildGrid = (lines: string[]): Node => {
  const grid: Grid = getGrid(() => undefined, lines.length, lines[0].length)
  let cursor: Node
  lines.forEach((row, y) => {
    row.split('').forEach((value, x) => {
      const node = new Node({ x, y, value, grid })
      switch (value) {
        case '#':
          grid[y][x] = node
          node.static = true
          break
        case 'O':
          grid[y][x] = node
          break
        case '[':
          grid[y][x] = node
          grid[y][x + 1] = node
          break
        case '@':
          cursor = node
          grid[y][x] = node
          break
      }
    })
  })
  if (!cursor!) throw new Error('no cursor')
  return cursor
}

const moveMap: Record<string, DIRS> = {
  '<': DIRS.LEFT,
  '>': DIRS.RIGHT,
  '^': DIRS.UP,
  v: DIRS.DOWN,
}

const part1 = (path: string): string | number => {
  const [para1, para2] = inputHandler.toArray(path, PARAGRAPH)
  const cursor = buildGrid(para1.split('\n'))
  para2
    .split(/\n|/g)
    .map(move => moveMap[move])
    .forEach(move => cursor.move(move))
  let score = 0
  cursor.grid.forEach((row, y) => {
    row.forEach((node, x) => {
      if (node?.value === 'O') {
        score += y * 100 + x
      }
    })
  })
  return score
}

const part2 = (path: string): string | number => {
  const [para1, para2] = inputHandler.toArray(path, PARAGRAPH)
  const doubledGrid = para1
    .replace(/\./g, '..')
    .replace(/#/g, '##')
    .replace(/O/g, '[]')
    .replace(/@/g, '@.')
    .split('\n')
  const cursor = buildGrid(doubledGrid)
  const moves = para2.split(/\n|/g).map(m => moveMap[m])
  moves.forEach((move, i) => cursor.move(move))
  let score = 0
  cursor.grid.forEach((row, y) => {
    row.forEach((node, x) => {
      if (node?.value === '[') {
        score += y * 100 + x
        node.value = ']'
      }
    })
  })
  return score
}

const logger = new Logger()

bench(logger, 'part 1 example', () => part1('example2.txt'), 2028)
bench(logger, 'part 1 example', () => part1(EXAMPLE), 10092)
bench(logger, 'part 1 input', () => part1(INPUT), 1441031)
bench(logger, 'part 2 example', () => part2('example3.txt'), 618)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 9021)
bench(logger, 'part 2 input', () => part2(INPUT), 1425169)
