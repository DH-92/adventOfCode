#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  bench,
  Logger,
  product,
  pairs,
} from '../helpers/index.mjs'
import { Heap } from '../helpers/binary-heap.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string, maxConnections: number): string | number => {
  interface Node {
    x: number
    y: number
    z: number
  }

  const nodes = inputHandler
    .toArray(path)
    .map(line => line.split(',').map(Number))
    .map(([x, y, z]) => ({ x, y, z }))

  const nodeDist = (a: Node, b: Node): number =>
    Math.sqrt(
      Math.pow(Math.abs(a.x - b.x), 2) +
        Math.pow(Math.abs(a.y - b.y), 2) +
        Math.pow(Math.abs(a.z - b.z), 2),
    )

  const distances = new Heap<{ a: Node; b: Node; dist: number }>(
    (a: { dist: number }, b: { dist: number }) => a.dist - b.dist,
  )
  nodes.forEach((nodeA, a) => {
    nodes.forEach((nodeB, b) => {
      if (a >= b) return
      const dist = nodeDist(nodeA, nodeB)
      distances.push({ a: nodeA, b: nodeB, dist })
    })
  })

  const circuits: Set<Set<Node>> = new Set()
  const circuitsByNode: Map<Node, Set<Node>> = new Map()

  const distanceArr = []
  for (let i = 0; i < maxConnections; i++) {
    distanceArr.push(distances.pop())
  }

  distanceArr.forEach(({ a, b }) => {
    const circuitWithA = circuitsByNode.get(a)
    const circuitWithB = circuitsByNode.get(b)

    if (!circuitWithA && !circuitWithB) {
      // New circuit
      const newCircuit = new Set([a, b])
      circuits.add(newCircuit)
      circuitsByNode.set(a, newCircuit).set(b, newCircuit)
      return
    }

    if (circuitWithA === circuitWithB) {
      // Both already in same circuit
      return
    }

    if (circuitWithA && circuitWithB) {
      // Merge circuits
      circuitWithB.forEach(node => circuitsByNode.set(node, circuitWithA.add(node)))
      circuits.delete(circuitWithB)
    } else if (circuitWithA) {
      circuitsByNode.set(b, circuitWithA.add(b))
    } else if (circuitWithB) {
      circuitsByNode.set(a, circuitWithB.add(a))
    }
  })

  return [...circuits]
    .map(c => c.size)
    .sort((a, b) => b - a)
    .splice(0, 3)
    .reduce(product)
}

const part2 = (path: string): string | number => {
  interface Node {
    x: number
    y: number
    z: number
  }

  interface Connection {
    a: Node
    b: Node
  }

  const nodeDist = ({ a, b }: Connection): number =>
    Math.sqrt(
      Math.pow(Math.abs(a.x - b.x), 2) +
        Math.pow(Math.abs(a.y - b.y), 2) +
        Math.pow(Math.abs(a.z - b.z), 2),
    )

  const nodes = inputHandler
    .toArray(path)
    .map(line => line.split(',').map(Number))
    .map(([x, y, z]) => ({ x, y, z }))

  // all possible connection combinations between nodes, sorted by distance
  const connections = new Heap<Connection>((a, b) => nodeDist(a) - nodeDist(b))
  connections.fromArray(pairs(nodes))

  // a circuit is a set of junction box nodes that are all connected
  const circuits: Set<Set<Node>> = new Set()

  // a map to index which circuit a node is in
  const circuitsByNode: Map<Node, Set<Node>> = new Map()

  while (true) {
    const { a, b } = connections.pop()!

    const circuitWithA = circuitsByNode.get(a)
    const circuitWithB = circuitsByNode.get(b)

    if (!circuitWithA && !circuitWithB) {
      // New circuit
      const newCircuit = new Set([a, b])
      circuits.add(newCircuit)
      circuitsByNode.set(a, newCircuit).set(b, newCircuit)
      continue
    }

    if (circuitWithA === circuitWithB) {
      // Both already in same circuit
      continue
    }

    if (circuitWithA && circuitWithB) {
      // Merge circuits
      circuitWithB.forEach(node => circuitsByNode.set(node, circuitWithA.add(node)))
      circuits.delete(circuitWithB)
    } else if (circuitWithA) {
      circuitsByNode.set(b, circuitWithA.add(b))
    } else if (circuitWithB) {
      circuitsByNode.set(a, circuitWithB.add(a))
    }

    if (circuits.size === 1 && [...circuits][0]?.size === nodes.length) {
      return a.x * b.x
    }
  }
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE, 10), 40)
bench(logger, 'part 1 input', () => part1(INPUT, 1000), 244188)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 25272)
bench(logger, 'part 2 input', () => part2(INPUT), 8361881885)
