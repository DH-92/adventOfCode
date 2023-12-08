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
  const nodeLines = second.split(/\n/).map(n => [...n.matchAll(/[A-Z]+/g)].map(x => x[0]))
  const nodes = nodeLines.reduce(
    (n, [k, l, r]) => {
      n[k] = new Node(k, l, r)
      return n
    },
    {} as Record<string, Node>
  )
  let step = 0
  let curr = 'AAA'
  while (curr !== 'ZZZ') {
    const instruction = instructions[step % instructions.length]
    const n = nodes[curr]
    step++
    curr = instruction === 'L' ? n.left : n.right
  }
  return step
}

const part2 = (path: string): string | number => {
  const [first, second] = inputHandler.toArray(path, PARAGRAPH)
  const instructions = first.split('')
  const nodes: Record<string, Node> = {}
  const currs: string[] = []
  const nodeLines = second.split(/\n/).map(n => [...n.matchAll(/[\dA-Z]+/g)].map(x => x[0]))
  nodeLines.forEach(([start, left, right]) => {
    nodes[start] = new Node(start, left, right)
    if (start.match(/..A/g)) {
      currs.push(start)
    }
  })

  const matched: string[] = new Array(currs)
  let step = 0
  while (currs.length) {
    const instruction = instructions[step % instructions.length]
    // console.log(step)
    // console.log(instruction)
    if (step % 10000000 === 0) console.log(step)
    currs.forEach((curr, i) => {
      const n = nodes[curr]
      // if (i === 0) console.log(n)
      if (instruction === 'L') {
        currs[i] = n.left
      } else {
        currs[i] = n.right
      }
      if (curr.match(/\w\wZ/g)) {
        // matched[i] = step
        console.log('match!', i)
        // matched.add(i)
        // console.log(step)
        // console.log(currs)
        // currs.splice(i, 1)
        // console.log(currs)
        // process.exit(1)
      }
      // console.log(i, curr)
    })
    // console.log(currs)
    if (matched.length === currs.length) {
      console.log('matched all', matched)
      process.exit(1)
    }
    // if (matches) console.log(step, matches)
    // if (matched.filter(m => m !== 0) === currs.length) break
    step++
  }
  return step
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 2)
  bench(logger, 'part 1 input', () => part1(INPUT), 20513)
  // bench(logger, 'part 2 example', () => part2('example2.txt'), 6)
  // bench(logger, 'part 2 input', () => part2(INPUT), 15995167053923)
} catch (e) {
  console.error(e)
}
