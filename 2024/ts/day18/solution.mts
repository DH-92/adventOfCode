#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, bench, Logger, sum, getGrid } from '../helpers/index.mjs'
import { Memoize } from '../helpers/Memoize-decorator.js'
import { Heap } from '../helpers/binary-heap.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

enum Direction {
  'north',
  'east',
  'south',
  'west',
}

const rotate = (direction: Direction, turns: number = 1): Direction => (direction + turns) % 4

class Node {
  x: number
  y: number
  id: string
  neighbours: Partial<Record<Direction, Node>>
  cost: number = Number.MAX_SAFE_INTEGER
  constructor(x: number, y: number, id: string) {
    this.x = x
    this.y = y
    this.id = id
    this.neighbours = {}
  }
  addEdge(node: Node, direction: Direction) {
    if (!node) return
    this.neighbours[direction] = node
    node.neighbours[rotate(direction, 2)] = this
  }
  init() {
    return this
  }
}

class Lattice<T extends Node = Node> {
  data: T[][]
  start: T
  end: T
  _NodeConstructor: new (...args: any[]) => T
  constructor(_NodeConstructor: new (...args: any[]) => T, array: string[][] = [[]]) {
    this.data = []
    this._NodeConstructor = _NodeConstructor
    array.forEach((row, y) => {
      this.data[y] ??= []
      row.forEach((value, x) => {
        if (value === '#') return
        const node = this.add(x, y, value)
        if (y) this.connect(node, this.data[y - 1]?.[x], Direction.north)
        if (x) this.connect(node, this.data[y]?.[x - 1], Direction.west)
        node.init()
      })
    })
    this.start = this.data[0][0]
    this.end = this.data[array.length - 1][array[0].length - 1]
  }
  add = (x: number, y: number, val: string): T =>
    (this.data[y][x] = new this._NodeConstructor(x, y, val))
  connect = (a: T, b: T, direction: Direction) => a.addEdge(b, direction)
}

type QueueElement = { x: number; y: number; cost: number }

class Solver {
  lattice: Lattice
  best: number
  seats: Set<string>
  constructor(lattice: Lattice) {
    this.lattice = lattice
    this.best = 0
    this.seats = new Set()
  }

  bfs(x: number, y: number): number {
    const heap = new Heap<QueueElement>((a: QueueElement, b: QueueElement) => a.cost - b.cost)
    const visited = new Set<string>()
    heap.push({ x, y, cost: 0 })
    while (heap.size) {
      const { x, y, cost } = heap.pop()!
      if (visited.has(`${x},${y}`)) continue
      visited.add(`${x},${y}`)
      // console.log({ x, y, cost })
      const node = this.lattice.data[y]?.[x]
      if (node === this.lattice.end) {
        // console.log('found')
        // console.log({ end: this.lattice.end, node })
        return (this.best = cost)
      }
      Object.values(node.neighbours).forEach(next => {
        const c2 = cost + 1
        if (next.cost < c2) return
        next.cost = c2
        heap.push({ x: next.x, y: next.y, cost: c2 })
      })
    }
    throw new Error('No path found')
  }

  // @Memoize((x: number, y: number, dir: Direction, cost: number) => `${x},${y},${dir},${cost}`)
  // dfs(x: number, y: number, dir: Direction, cost: number): number {
  //   if (cost > this.best) return 0
  //   const node = this.lattice.data[y]?.[x]
  //   if (node.id === 'E') return 1
  //   if (cost > node[`${dir}-distance`]) return 0
  //   return Object.entries(node.neighbours).filter(([k, next]) => {
  //     const d = k as unknown as Direction
  //     if (!this.dfs(next.x, next.y, d, (d === dir ? 1 : 1001) + cost)) return false
  //     this.seats.add(`${x},${y}`)
  //     return true
  //   }).length
  // }
}

const part1 = (path: string, size: number, bytes: number): string | number => {
  const grid = getGrid(() => '.', size, size)
  const corrupts = inputHandler
    .toArray(path)
    .map(line => line.match(/(\d+)/g)!.map(Number))
    .slice(0, bytes)
  corrupts.forEach(([x, y]) => (grid[y][x] = '#'))
  const lattice = new Lattice<Node>(Node, grid)
  const solver = new Solver(lattice)
  return solver.bfs(lattice.start.x, lattice.start.y)
}

const part2 = (path: string, size: number): string | number => {
  const corrupts = inputHandler
  .toArray(path)
  .map(line => line.match(/(\d+)/g)!.map(Number))

  for (let bytes = 0; bytes < corrupts.length; bytes++) {
    const grid = getGrid(() => '.', size, size)
    const input = corrupts.slice(0,bytes)
    input.forEach(([x, y]) => grid[y][x] = '#')
    const lattice = new Lattice<Node>(Node, grid)
    const solver = new Solver(lattice)
    try {
      solver.bfs(lattice.start.x, lattice.start.y)
    } catch {
      console.log({ bytes }, corrupts[bytes], input[bytes], input[input.length - 1])
      return input[input.length - 1].join(',')
    }
  }
}

console.clear()
// logger.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE, 7, 12), 22)
bench(logger, 'part 1 input', () => part1(INPUT, 71, 1024), 382)
bench(logger, 'part 1 example', () => part2(EXAMPLE, 7), '6,1')
bench(logger, 'part 2 input', () => part2(INPUT, 71), '6,36')
