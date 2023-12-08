#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  LINE,
  sum,
  bench,
  Logger,
  range,
  PARAGRAPH,
  numSortR,
  numSort,
  reshape,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

class Node {
  start: string
  left: string
  right: string
  constructor(start: string, left: string, right: string) {
    this.start = start
    this.left = left
    this.right = right
  }
}

const part1 = (path: string): string | number => {
  const [first, second] = inputHandler.toArray(path, PARAGRAPH)
  const instructions = first.split('')
  //   console.log(instructions)
  const nodes = {}
  const nodeLines = second.split(/\n/).map(n => [...n.matchAll(/[A-Z]+/g)].map(x => x[0]))
  nodeLines.forEach(([start, left, right]) => {
    nodes[start] = new Node(start, left, right)
  })
  let step = 0
  let curr = 'AAA'
  while (curr !== 'ZZZ') {
    const instruction = instructions[step % instructions.length]
    const n = nodes[curr]
    step++
    console.log(n)
    console.log(instruction)
    if (instruction === 'L') {
      curr = n.left
    } else {
      curr = n.right
    }
    console.log(curr)
    // process.exit(0)
  }
  return step
}

const part2 = (path: string): string | number => {
  const [first, second] = inputHandler.toArray(path, PARAGRAPH)
  const instructions = first.split('')
  //   console.log(instructions)
  const nodes = {}
  const nodeLines = second.split(/\n/).map(n => [...n.matchAll(/[A-Z]+/g)].map(x => x[0]))
  nodeLines.forEach(([start, left, right]) => {
    nodes[start] = new Node(start, left, right)
  })
  let step = 0
  let curr = 'AAA'
  while (curr !== 'ZZZ') {
    const instruction = instructions[step % instructions.length]
    const n = nodes[curr]
    step++
    console.log(n)
    console.log(instruction)
    if (instruction === 'L') {
      curr = n.left
    } else {
      curr = n.right
    }
    console.log(curr)
    // process.exit(0)
  }
  return step
}

console.clear()
try {
  //   bench(logger, 'part 1 example', () => part1(EXAMPLE), 6)
  bench(logger, 'part 1 input', () => part1(INPUT), 0)
  //   bench(logger, 'part 2 example', () => part2(EXAMPLE), 0)
  //   bench(logger, 'part 2 input', () => part2(INPUT), 0)
} catch (e) {
  console.error(e)
}
