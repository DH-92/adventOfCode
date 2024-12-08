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

class Node {
  x: number
  y: number
  constructor({ x, y }: { x: number; y: number }) {
    this.x = x
    this.y = y
  }
}

const buildGrid = (lines: string[]): { grid: Node[][]; towersByFrequency: Node[][] } => {
  const grid: Node[][] = getGrid(() => ({}) as Node, lines.length, lines[0].length)
  const towersByFrequency: Node[][] = []
  lines.forEach((l, y) => {
    l.split('').forEach((c, x) => {
      if (c === '.') return
      const node = (grid[y][x] = new Node({ x, y }))
      const val = c.charCodeAt(0)
      towersByFrequency[val] ??= []
      towersByFrequency[val].push(node)
    })
  })
  return { grid, towersByFrequency }
}

const part1 = (path: string): string | number => {
  const { grid, towersByFrequency } = buildGrid(inputHandler.toArray(path, LINE))
  return towersByFrequency
    .reduce((antiNodes, towers): Boolean[][] => {
      towers.forEach(tower1 => {
        towers.forEach(tower2 => {
          if (tower1 === tower2) return
          const dy = tower2.y - tower1.y
          const y = tower1.y - dy
          const dx = tower2.x - tower1.x
          const x = tower1.x - dx
          if (!(x >= 0 && x < grid[0].length && y >= 0 && y < grid.length)) return
          antiNodes[y] ??= []
          antiNodes[y][x] = true
        })
      })
      return antiNodes
    }, [] as Boolean[][])
    .flat(2).length
}

const part2 = (path: string): string | number => {
  const { grid, towersByFrequency } = buildGrid(inputHandler.toArray(path, LINE))
  return towersByFrequency
    .reduce((antiNodes, towers): Boolean[][] => {
      towers.forEach(tower1 => {
        towers.forEach(tower2 => {
          if (tower1 === tower2) return
          const dx = tower2.x - tower1.x
          const dy = tower2.y - tower1.y
          let { x, y } = tower1
          while (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
            antiNodes[y] ??= []
            antiNodes[y][x] = true
            x += dx
            y += dy
          }
        })
      })
      return antiNodes
    }, [] as Boolean[][])
    .flat(2).length
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example 2', () => part1('example2.txt'), 2)
bench(logger, 'part 1 example', () => part1(EXAMPLE), 14)
bench(logger, 'part 1 input', () => part1(INPUT), 308)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 34)
bench(logger, 'part 2 input', () => part2(INPUT), 1147)
