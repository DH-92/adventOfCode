#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, bench, Logger, sum } from '../helpers/index.mjs'
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
  '0-distance': number = 1_000_000
  '1-distance': number = 1_000_000
  '2-distance': number = 1_000_000
  '3-distance': number = 1_000_000
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
        if (value === 'S') this.start = node
        if (value === 'E') this.end = node
        if (y) this.connect(node, this.data[y - 1]?.[x], Direction.north)
        if (x) this.connect(node, this.data[y]?.[x - 1], Direction.west)
        node.init()
      })
    })
    if (!this.start || !this.end) throw new Error('Start and end nodes are required')
  }
  add = (x: number, y: number, val: string): T =>
    (this.data[y][x] = new this._NodeConstructor(x, y, val))
  connect = (a: T, b: T, direction: Direction) => a.addEdge(b, direction)
}

type QueueElement = { x: number; y: number; dir: Direction; cost: number }

class Solver {
  lattice: Lattice
  best: number
  seats: Set<string>
  constructor(lattice: Lattice) {
    this.lattice = lattice
    this.best = 0
    this.seats = new Set()
  }

  bfs (x: number, y: number, dir: Direction): number {
    const heap = new Heap<QueueElement>((a: QueueElement, b: QueueElement) => a.cost - b.cost)
    heap.push({ x, y, dir, cost: 0 })
    while (heap.size) {
      const { x, y, dir, cost } = heap.pop()!
      const node = this.lattice.data[y]?.[x]
      if (node === this.lattice.end) {
        return this.best = cost
      }
      Object.entries(node.neighbours).forEach(([k, next]) => {
        const d = k as unknown as Direction
        const c2 = (d === dir ? 1 : 1001) + cost
        if (next[`${d}-distance`] < c2) return
        next[`${d}-distance`] = c2
        heap.push({ x: next.x, y: next.y, dir: d, cost: c2 })
      })
    }
    throw new Error('No path found')
  }

  @Memoize((x: number, y: number, dir: Direction, cost: number) => `${x},${y},${dir},${cost}`)
  dfs(x: number, y: number, dir: Direction, cost: number): number {
    if (cost > this.best) return 0
    const node = this.lattice.data[y]?.[x]
    if (node.id === 'E') return 1
    if (cost > node[`${dir}-distance`]) return 0
    return Object.entries(node.neighbours).filter(([k, next]) => {
      const d = k as unknown as Direction
      if (!this.dfs(next.x, next.y, d, (d === dir ? 1 : 1001) + cost)) return false
      this.seats.add(`${x},${y}`)
      return true
    }).length
  }
}

const part1 = (path: string): string | number => {
  const lattice = new Lattice<Node>(Node, inputHandler.toGrid(path))
  const solver = new Solver(lattice)
  return solver.bfs(lattice.start.x, lattice.start.y, Direction.east)
}

const part2 = (path: string): string | number => {
  const lattice = new Lattice<Node>(Node, inputHandler.toGrid(path))
  const solver = new Solver(lattice)
  solver.bfs(lattice.start.x, lattice.start.y, Direction.east)
  solver.dfs(lattice.start.x, lattice.start.y, Direction.east, 0)
  return solver.seats.size + 1
}

console.clear()
// logger.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 7036)
bench(logger, 'part 1 example', () => part1('example2.txt'), 11048)
bench(logger, 'part 1 input', () => part1(INPUT), 133584)
bench(logger, 'part 1 example', () => part2(EXAMPLE), 45)
bench(logger, 'part 2 example', () => part2('example2.txt'), 64)
bench(logger, 'part 2 input', () => part2(INPUT), 622)
