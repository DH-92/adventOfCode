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
  reshape,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log


enum Direction {
  'north' = 1,
  'east' = 2,
  'south' = 3,
  'west' = 4
}

const rotate = (direction: Direction, turns: number): Direction => (direction + turns) % 4

interface Coord {
  x: number
  y: number
}

interface NodeProps {
  x: number
  y: number
  height: number
}

class Node {
  coord: Coord
  height: number
  neighbours: Partial<Record<Direction, Node>>
  constructor({ x, y, height }: NodeProps) {
    this.coord = { x, y }
    this.height = height
    this.neighbours = {}
  }
  get isSource() {
    return this.height === 0
  }
  get isDrain() {
    return this.height === 9
  }
  addEdge(node: Node, direction: Direction) {
    if (node.height === this.height + 1) {
      this.neighbours[direction] = node
    } else if (node.height === this.height - 1) {
      node.neighbours[rotate(direction,2)] = this
    }
  }
}

class Lattice {
  lattice: Node[][]
  #sources: Set<Node>
  allowDiaganols = false
  constructor(array: number[][]) {
    this.lattice = new Array<Node[]>()
    this.#sources = new Set<Node>()
    array.forEach((row, y) => {
      this.lattice[y] ??= []
      row.forEach((height, x) => {
        const node = (this.lattice[y][x] = new Node({ x, y, height }))
        if (node.isSource) this.#sources.add(node)
        if (y) this.connect(node, this.lattice[y - 1]?.[x], Direction.north)
        if (x) this.connect(node, this.lattice[y]?.[x - 1], Direction.west)
        // if (y && x && this.allowDiaganols) {
        //   this.connect(node, this.lattice[y - 1]?.[x - 1], Diaganols.northWest)
        // }
      })
    })
  }
  get sources() {
    return Array.from(this.#sources)
  }
  get drains() {
    return this.lattice.flat().filter(n => n.isDrain)
  }
  add(props: NodeProps) {
    const node = new Node(props)
    this.lattice[props.y][props.x] = node
    return node
  }
  connect(node: Node, neighbour: Node, direction: Direction) {
    node.addEdge(neighbour, direction)
  }
}

class Trail {
  source: Node
  #reachableDrains?: Set<Node>
  #completePathsCount?: number
  constructor(source: Node) {
    this.source = source
  }
  resolveCompletePaths(): number {
    const reachableDrains = new Set<Node>()
    let completePathsCount = 0
    const queue: Node[] = []
    let next: Node = this.source
    while (next) {
      if (next.isDrain) {
        completePathsCount++
        reachableDrains.add(next)
      }
      queue.push(...Object.values(next.neighbours))
      next = queue.shift()!
    }
    this.#reachableDrains = reachableDrains
    this.#completePathsCount = completePathsCount
    return this.#completePathsCount
  }
  get reachableDrains() {
    if (!this.#reachableDrains?.size) {
      this.resolveCompletePaths()
    }
    return this.#reachableDrains!.size
  }
  get completePathsCount() {
    if (!this.#completePathsCount) {
      this.resolveCompletePaths()
    }
    return this.#completePathsCount!
  }
}

const part1 = (path: string): string | number =>
  new Lattice(inputHandler.toMappedGrid(path, Number)).sources
    .map(source => new Trail(source).reachableDrains)
    .reduce(sum)

const part2 = (path: string): string | number =>
  new Lattice(inputHandler.toMappedGrid(path, Number)).sources
    .map(source => new Trail(source).completePathsCount)
    .reduce(sum)

console.clear()
logger.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 1)
bench(logger, 'part 1 example', () => part1('example2.txt'), 36)
bench(logger, 'part 1 input', () => part1(INPUT), 557)
bench(logger, 'part 2 example', () => part2('example2.txt'), 81)
bench(logger, 'part 2 input', () => part2(INPUT), 1062)
