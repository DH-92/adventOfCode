#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  bench,
  Logger,
  product,
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

  const circuits: Array<Set<Node>> = []

  const distanceArr = []
  for (let i = 0; i < maxConnections; i++) {
    distanceArr.push(distances.pop())
  }

  distanceArr.forEach(({ a, b }) => {
    const circuitWithA = circuits.find(circuit => circuit.has(a))
    const circuitWithB = circuits.find(circuit => circuit.has(b))

    if (!circuitWithA && !circuitWithB) {
      // New circuit
      circuits.push(new Set([a, b]))
      return
    }
    if (circuitWithA === circuitWithB) {
      // Both already in same circuit
      return
    }
    if (circuitWithA && circuitWithB) {
      // Merge circuits
      ;[...circuitWithB!].forEach(node => circuitWithA.add(node))
      circuits.splice(circuits.indexOf(circuitWithB), 1)
      return
    }
    if (circuitWithA) {
      circuitWithA.add(b)
      return
    }
    if (circuitWithB) {
      circuitWithB.add(a)
      return
    }
  })


  return circuits
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
    dist: number
  }

  const nodeDist = (a: Node, b: Node): number =>
    Math.sqrt(
      Math.pow(Math.abs(a.x - b.x), 2) +
        Math.pow(Math.abs(a.y - b.y), 2) +
        Math.pow(Math.abs(a.z - b.z), 2),
    )

  const nodes = inputHandler
    .toArray(path)
    .map(line => line.split(',').map(Number))
    .map(([x, y, z]) => ({ x, y, z }))

  const connections = new Heap<Connection>(
    (a: Connection, b: Connection) => a.dist - b.dist,
  )

  nodes.forEach((nodeA, a) => {
    nodes.forEach((nodeB, b) => {
      if (a >= b) return
      const dist = nodeDist(nodeA, nodeB)
      connections.push({ a: nodeA, b: nodeB, dist })
    })
  })

  const circuits: Array<Set<Node>> = []

  while (true) {
    const {a, b} = connections.pop()!

    const circuitWithA = circuits.find(circuit => circuit.has(a))
    const circuitWithB = circuits.find(circuit => circuit.has(b))

    if (!circuitWithA && !circuitWithB) {
      // New circuit
      circuits.push(new Set([a, b]))
      continue
    }

    if (circuitWithA === circuitWithB) {
      // Both already in same circuit
      continue
    }

    if (circuitWithA && circuitWithB) {
      // Merge circuits
      ;[...circuitWithB].forEach(node => circuitWithA.add(node))
      circuits.splice(circuits.indexOf(circuitWithB), 1)
    } else if (circuitWithA) {
      circuitWithA.add(b)
    } else if (circuitWithB) {
      circuitWithB.add(a)
    }

    if (circuits[0]?.size === nodes.length) {
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
