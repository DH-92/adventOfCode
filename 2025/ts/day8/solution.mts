#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  WORD,
  bench,
  Logger,
  sum,
  getPrimes,
  PARAGRAPH,
  LINE,
  transpose,
  product,
  reshape,
} from '../helpers/index.mjs'
import { Memoize } from '../helpers/Memoize-decorator.js'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string, maxConnections: number): string | number => {
  const nodes = inputHandler
    .toArray(path)
    .map(line => line.split(',').map(Number))
    .map(([x, y, z]) => ({ x, y, z }))

  const distances: { a: number; b: number; dist: number }[] = []
  nodes.forEach((nodeA, a) => {
    nodes.forEach((nodeB, b) => {
      if (a >= b) return
      const dist = Math.sqrt(
        Math.pow(Math.abs(nodeA.x - nodeB.x), 2) +
          Math.pow(Math.abs(nodeA.y - nodeB.y), 2) +
          Math.pow(Math.abs(nodeA.z - nodeB.z), 2),
      )
      distances.push({ a, b, dist })
    })
  })
  distances.sort((d1, d2) => d1.dist - d2.dist)

  const circuits: number[][] = []
  let connections = 0
  distances.forEach(dist => {
    connections++
    if (connections > maxConnections) return
    const circuitsWithA = circuits.filter(circuit => circuit.includes(dist.a))
    const circuitsWithB = circuits.filter(circuit => circuit.includes(dist.b))

    if (circuitsWithA.length > 1) {
      throw new Error('Multiple circuits with A')
    }
    if (circuitsWithB.length > 1) {
      throw new Error('Multiple circuits with B')
    }
    const [circuitWithA] = circuitsWithA
    const [circuitWithB] = circuitsWithB

    if (!circuitWithA && !circuitWithB) {
      // New circuit
      circuits.push([dist.a, dist.b])
      return
    }
    if (circuitWithA === circuitWithB) {
      return
    }
    if (circuitWithA && !circuitWithB) {
      // Add B to A's circuit
      circuitWithA.push(dist.b)
      return
    }
    if (!circuitWithA && circuitWithB) {
      // Add A to B's circuit
      circuitWithB.push(dist.a)
      return
    }
    // Merge circuits
    const merged = [...circuitWithA, ...circuitWithB]
    circuits.splice(circuits.indexOf(circuitWithA), 1)
    circuits.splice(circuits.indexOf(circuitWithB), 1)
    circuits.push(merged)
  })

  return circuits
    .sort((a, b) => b.length - a.length)
    .splice(0, 3)
    .map(c => c.length)
    .reduce(product)
}

const part2 = (path: string): string | number => {
  const nodes = inputHandler
    .toArray(path)
    .map(line => line.split(',').map(Number))
    .map(([x, y, z]) => ({ x, y, z }))

  const distances: { a: number; b: number; dist: number }[] = []
  nodes.forEach((nodeA, a) => {
    nodes.forEach((nodeB, b) => {
      if (a >= b) return
      const dist = Math.sqrt(
        Math.pow(Math.abs(nodeA.x - nodeB.x), 2) +
          Math.pow(Math.abs(nodeA.y - nodeB.y), 2) +
          Math.pow(Math.abs(nodeA.z - nodeB.z), 2),
      )
      distances.push({ a, b, dist })
    })
  })
  distances.sort((d1, d2) => d1.dist - d2.dist)

  const circuits: number[][] = [[]]
  let connections = 0
  let ans = 0
  distances.forEach(dist => {
    connections++
    if (circuits[0].length === nodes.length) {
      return
    }
    const circuitsWithA = circuits.filter(circuit => circuit.includes(dist.a))
    const circuitsWithB = circuits.filter(circuit => circuit.includes(dist.b))

    if (circuitsWithA.length > 1) {
      throw new Error('Multiple circuits with A')
    }
    if (circuitsWithB.length > 1) {
      throw new Error('Multiple circuits with B')
    }
    const [circuitWithA] = circuitsWithA
    const [circuitWithB] = circuitsWithB

    if (!circuitWithA && !circuitWithB) {
      // New circuit
      circuits.push([dist.a, dist.b])
      return
    }
    if (circuitWithA === circuitWithB) {
      // Both already in same circuit
      return
    }
    if (!circuitWithA) {
      // Add A to B's circuit
      circuitWithB.push(dist.a)
    } else if (!circuitWithB) {
      // Add B to A's circuit
      circuitWithA.push(dist.b)
    } else {
      // Merge circuits
      const merged = [...circuitWithA, ...circuitWithB]
      circuits.splice(circuits.indexOf(circuitWithA), 1)
      circuits.splice(circuits.indexOf(circuitWithB), 1)
      circuits.push(merged)
    }
    ans = nodes[dist.a].x * nodes[dist.b].x
  })
  return ans
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE, 10), 40)
bench(logger, 'part 1 input', () => part1(INPUT, 1000), 244188)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 25272)
bench(logger, 'part 2 input', () => part2(INPUT), 8361881885)
