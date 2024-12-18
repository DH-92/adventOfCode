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

const rotate = (direction: string | number, turns: number = 1): Direction => {
  if (!(Number(direction) in Direction)) throw 'bad rotate'
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
      delete this.neighbours[rotate(+dir, 0)]?.neighbours[rotate(+dir, 2)]
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

  aStar(x?: number, y?: number): number | undefined {
    const costs = new Map<T, number>()
    const score = (node: T) =>
      Math.abs(this.end.x - node.x) + Math.abs(this.end.y - node.y) + (costs.get(node) ?? Infinity)
    const start = this.data[y]?.[x] ?? this.start
    costs.set(start, 0)
    const openSet = new Heap<T>((a: T, b: T) => score(a) - score(b))
    openSet.push(start)
    while (openSet.size) {
      const current = openSet.pop()!
      if (current === this.end) return costs.get(current)

      for (const next of Object.values(current.neighbours) as T[]) {
        const tentative_gScore = costs.get(current)! + 1
        if ((costs.get(next) ?? Infinity) <= tentative_gScore) continue
        costs.set(next, tentative_gScore)
        openSet.push(next as T)
      }
    }
    return undefined
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

const binarySearch = (left: number, right: number, predicate: (mid: number) => boolean): number => {
  let l = left
  let r = right
  while (l < r) {
    const mid = Math.floor((l + r) / 2)
    const res = predicate(mid)
    if (res) {
      r = mid
    } else {
      l = mid + 1
    }
  }
  return l
}

const part1 = (path: string, size: number, bytes: number): number => {
  const grid = getGrid(() => '.', size, size)
  const lattice = new Lattice<Node>(Node, grid)
  inputHandler
    .toArray(path)
    .map(line => line.match(/(\d+)/g)!.map(Number))
    .slice(0, bytes)
    .forEach(([x, y]) => lattice.data[y][x].removeAllEdges())
  return lattice.aStar() ?? 0
}

const part2 = (path: string, size: number): string | void => {
  const corrupts = inputHandler.toArray(path).map(line => line.match(/(\d+)/g)!.map(Number))
  const grid = getGrid(() => '.', size, size)

  // binary search for the length of corrupts that breaks the path
  const binarySearchInner = (mid: number): boolean => {
    const lattice = new Lattice<Node>(Node, grid)
    corrupts.slice(0, mid).forEach(([x, y]) => lattice.data[y][x].removeAllEdges())
    return lattice.aStar() === undefined
  }
  const res = binarySearch(0, corrupts.length, binarySearchInner)
  return corrupts[res - 1]?.join(',')
}

console.clear()
// logger.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE, 7, 12), 22)
bench(logger, 'part 1 input', () => part1(INPUT, 71, 1024), 382)
bench(logger, 'part 2 example', () => part2(EXAMPLE, 7), '6,1')
bench(logger, 'part 2 input', () => part2(INPUT, 71), '6,36')
