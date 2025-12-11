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
  WORD,
  LINE,
  sum,
  combinations,
  numSort,
  permutations,
  combinationsRepeating,
} from '../helpers/index.mjs'
import { Heap } from '../helpers/binary-heap.mjs'
import { Memoize } from '../helpers/Memoize-decorator.js'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string): string | number => {
  interface Node {
    key: string
    outKeys?: string[]
    outputs?: Node[]
    count?: number
  }
  const nodes = new Map<string, Node>()
  nodes.set('out', { key: 'out', count: 0, outputs: [], outKeys: [] })

  inputHandler
    .toArray(path)
    .map(line => line.split(':'))
    .map(([key, outKeys]) => ({
      key,
      outKeys: outKeys.trim().split(/\s/),
    }))
    .map(({ key, outKeys }) => {
      nodes.set(key, { key, outKeys, outputs: [] })
      return nodes.get(key)!
    })
    .forEach(node => (node.outputs = node.outKeys!.map(outKey => nodes.get(outKey)!)))

  const func = (node: Node): number =>
    (node.count ??= node.outputs!.reduce((acc, outNode) => acc + func(outNode), 0))

  nodes.get('out')!.count = 1
  return func(nodes.get('you')!)
}

const part2 = (path: string): string | number => {
  interface Node {
    outKeys: string[]
    outputs: Node[]
    count?: number
  }

  const nodes = new Map<string, Node>([['out', { count: 0, outputs: [], outKeys: [] }]])

  inputHandler
    .toArray(path)
    .map(line => line.split(':'))
    .map(([key, outKeys]) => ({ key, outKeys: outKeys.trim().split(/\s/) }))
    .map(({ key, outKeys }) => nodes.set(key, { outKeys, outputs: [] }).get(key)!)
    .forEach(({ outKeys, outputs }) => outputs.push(...outKeys.map(outKey => nodes.get(outKey)!)))

  const func = (n: Node): number => (n.count ??= n.outputs.map(func).reduce(sum, 0))

  const countPaths = (source: string, drain: string): number => {
    nodes.forEach(node => delete node.count)
    nodes.get(drain)!.count = 1
    return func(nodes.get(source)!)
  }

  return (
    countPaths('svr', 'fft') * countPaths('fft', 'dac') * countPaths('dac', 'out') +
    countPaths('svr', 'dac') * countPaths('dac', 'fft') * countPaths('fft', 'out')
  )
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 5)
bench(logger, 'part 1 input', () => part1(INPUT), 423)
bench(logger, 'part 2 example', () => part2('example2.txt'), 2)
bench(logger, 'part 2 input', () => part2(INPUT), 333657640517376)
