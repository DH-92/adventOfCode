#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, bench, Logger, sum } from '../helpers/index.mjs'

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
  constructor(x: number, y: number, id: string) {
    this.x = x
    this.y = y
    this.id = id
    this.neighbours = {}
  }
  get [Direction.north]() {
    return this.neighbours[Direction.north]
  }
  get [Direction.east]() {
    return this.neighbours[Direction.east]
  }
  get [Direction.south]() {
    return this.neighbours[Direction.south]
  }
  get [Direction.west]() {
    return this.neighbours[Direction.west]
  }
  addEdge(node: Node, direction: Direction) {
    this.neighbours[direction] = node
    node.neighbours[rotate(direction, 2)] = this
  }
  init() {
    return this
  }
}

class Lattice<T extends Node = Node> {
  data: T[][]
  _NodeConstructor: new (...args: any[]) => T
  constructor(_NodeConstructor: new (...args: any[]) => T, array: string[][] = [[]]) {
    this.data = []
    this._NodeConstructor = _NodeConstructor
    array.forEach((row, y) => {
      this.data[y] ??= []
      row.forEach((value, x) => {
        const node = this.add(x, y, value)
        if (y) this.connect(node, this.data[y - 1]?.[x], Direction.north)
        if (x) this.connect(node, this.data[y]?.[x - 1], Direction.west)
        node.init()
      })
    })
  }
  add = (x: number, y: number, val: string): T =>
    (this.data[y][x] = new this._NodeConstructor(x, y, val))
  connect = (a: T, b: T, direction: Direction) => a.addEdge(b, direction)
}

class Region extends Set<RegionNode> {
  constructor(values?: readonly RegionNode[] | null) {
    super(values)
  }
  get area(): number {
    return this.size
  }

  get perimeter(): number {
    let sum = 0
    this.forEach(node => (sum += node.edges))
    return sum
  }

  get sides(): number {
    let sum = 0
    this.forEach(node => {
      for (const dir of [Direction.north, Direction.east, Direction.south, Direction.west]) {
        if (node[dir]) continue // not on this edge
        const b = node[rotate(dir)]
        if (!b || b[dir]) sum++ // no neighbour or neighbour is not on this edge
      }
    })
    return sum
  }

  merge = (source: Region) => source.forEach(n => (n.region = this).add(n))
  consume = (source: Region) => {
    this.merge(source)
    source.clear()
  }
}

class RegionNode extends Node {
  region?: Region
  constructor(x: number, y: number, id: string) {
    super(x, y, id)
  }
  addEdge(neighbour: RegionNode, direction: Direction) {
    if (neighbour.id !== this.id) {
      return
    }
    super.addEdge(neighbour, direction)
    if (!neighbour.region) {
      if (!this.region) {
        neighbour.init()
      } else {
        neighbour.region = this.region
      }
      neighbour.region!.add(neighbour)
    }
    const region = neighbour.region!
    if (!this.region) {
      this.region = region
      this.region.add(this)
      return
    }
    if (this.region !== neighbour.region) {
      this.region.merge(region)
    }
  }
  init() {
    if (!this.region) {
      this.region = new Region()
      this.region.add(this)
    }
    return super.init()
  }
  get edges(): number {
    return 4 - Object.keys(this.neighbours).length
  }
}

class RegionLattice extends Lattice<RegionNode> {
  #regions: Set<Region>
  constructor(array: string[][]) {
    super(RegionNode, array)
    this.#regions = new Set<Region>()
    this.data.flat().forEach(node => this.#regions.add(node.region!))
  }
  get regions() {
    return Array.from(this.#regions)
  }
}

const part1 = (path: string): string | number => {
  const lattice = new RegionLattice(inputHandler.toGrid(path))
  return lattice.regions
    .filter(region => !!region.area)
    .map(region => region.area * region.perimeter)
    .reduce(sum)
}

const part2 = (path: string): string | number => {
  const lattice = new RegionLattice(inputHandler.toGrid(path))
  return lattice.regions
    .filter(region => !!region.area)
    .map(region => region.area * region.sides)
    .reduce(sum)
}

console.clear()
logger.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 140)
bench(logger, 'part 1 example 2', () => part1('example2.txt'), 1930)
bench(logger, 'part 1 input', () => part1(INPUT), 1522850)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 80)
bench(logger, 'part 2 example 2', () => part2('example2.txt'), 1206)
bench(logger, 'part 2 input', () => part2(INPUT), 953738)
