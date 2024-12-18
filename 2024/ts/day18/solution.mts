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

const rotate = (direction: Direction, turns: number = 1): Direction => {
  if (!(direction in Direction)) throw 'bad rotate'
  return (Number(direction) + turns) % 4
}

class Node {
  x: number
  y: number
  id: string
  neighbours: Partial<Record<Direction, Node>>
  cost: number = Infinity
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
  removeEdge(direction: Direction) {
    const node = this.neighbours[direction]
    if (!node) return
    delete node.neighbours[rotate(direction, 2)]
  }
  removeAllEdges() {
    Object.keys(this.neighbours).forEach(dir => {
      delete this.neighbours[Number(dir) as Direction]?.neighbours[rotate(Number(dir), 2)]
    })
    this.neighbours = {}
  }
  init() {
    return this
  }
  toString() {
    return `${this.x},${this.y}`
  }
}

type QueueElement = { x: number; y: number; cost: number }

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

  all = () => this.data.flat().filter(Boolean)

  bfs(x: number, y: number): number {
    const heap = new Heap<T>((a: T, b: T) => a.cost - b.cost)
    const visited = new Set<T>()
    heap.push(this.data[y]?.[x] ?? this.start)
    while (heap.size) {
      const node = heap.pop()!
      if (visited.has(node)) continue
      visited.add(node)
      const nextCost = node.cost + 1
      for (const next of Object.values(node.neighbours)) {
        if (visited.has(next as T)) continue
        if (next === this.end) return nextCost
        next.cost = nextCost
        heap.push(next as T)
      }
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
  return lattice.bfs(lattice.start.x, lattice.start.y)
}

const part2 = (path: string, size: number): string | number => {
  const corrupts = inputHandler
    .toArray(path)
    .map(line => line.match(/(\d+)/g)!.map(Number))
    .reverse()

  const grid = getGrid(() => '.', size, size)
  const lattice = new Lattice<Node>(Node, grid)
  while (true) {
    const [x, y] = corrupts.pop()!
    lattice.data[y][x].removeAllEdges()
    lattice.all().forEach(node => (node.cost = Infinity))

    try {
      lattice.bfs(lattice.start.x, lattice.start.y)
    } catch (e) {
      // console.log(e)
      return `${x},${y}`
    }
  }
  return 'No solution found'
}

console.clear()
// logger.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE, 7, 12), 22)
bench(logger, 'part 1 input', () => part1(INPUT, 71, 1024), 382)
bench(logger, 'part 2 example', () => part2(EXAMPLE, 7), '6,1')
bench(logger, 'part 2 input', () => part2(INPUT, 71), '6,36')
