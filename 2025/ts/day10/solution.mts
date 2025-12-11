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
  const lines = inputHandler.toMappedGrid(
    path,
    cell => [...cell.replaceAll(/[^.#\d]/g, '')],
    LINE,
    WORD,
  )

  interface Machine {
    initState: number
    buttons: number[]
  }

  const machines: Machine[] = lines.map(line => {
    // used for part 2
    line.pop()

    const initState = line
      .shift()!
      .reduce((acc: number, c: string, i: number): number => acc + (c === '#' ? 2 ** i : 0), 0)
    const buttons = line.map(button => button.map((bit: string) => 2 ** Number(bit)).reduce(sum))
    return { initState, buttons }
  })

  const machineMinPresses = (machine: Machine): number => {
    for (let i = 1; i <= machine.buttons.length; i++) {
      const found = combinations(machine.buttons, i)
        .map(option => option.reduce((acc, curr) => acc ^ curr))
        .map(state => machine.initState ^ state)
        .find(state => state === 0)
      if (found !== undefined) {
        return i
      }
    }
    throw new Error('no solution found')
  }
  return machines.map(machineMinPresses).reduce(sum)
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toMappedGrid(
    path,
    cell => [...cell.replaceAll(/[^,\d]/g, '')],
    LINE,
    WORD,
  )

  interface Machine {
    initState: number[]
    buttons: number[][]
  }

  const machines: Machine[] = lines.map(line => {
    // used for Part 1
    line.shift()

    const initState = line.pop()!.join('').split(',').map(Number)
    const buttons = line.map(button => button.map(Number).filter(n => !isNaN(n)))
    return { initState, buttons }
  })

  const machineMinPresses = (machine: Machine): number => {
    console.log('next machine', machine)
    // bfs approach
    type QueueElement = { count: number; values: number[]; total: number }
    const bfs = () => {
      const heap = new Heap<QueueElement>((a: QueueElement, b: QueueElement) => b.total - a.total)
      heap.push({ count: 0, total: 0, values: new Array(machine.initState.length).fill(0) })
      while (heap.size) {
        const { count, total, values } = heap.pop()!
        if (values.every((v, i) => v === machine.initState[i])) {
          return count
        }
        machine.buttons.forEach(button => {
          const next = button.reduce(
            (acc, idx) => {
              acc[idx] = (acc[idx] ?? 0) + 1
              return acc
            },
            [...values],
          )
          if (next.some((v, i) => v > machine.initState[i])) return
          heap.push({ count: count + 1, total: total + button.length, values: next })
        })
      }
      throw new Error('No path found')
    }
    return bfs()

    // type QueueElement = { count: number; values: number[]; total: number }
    // const dfs = ({ count, values }: QueueElement): number => {
    //   // console.log('dfs', { count, values })
    //   const partialBuckets = values.map((v, i) => machine.initState[i] / v)

    //   if (partialBuckets.every(v => v === 1)) {
    //     return count
    //   }

    //   const validButtons = machine.buttons
    //     .filter(button => button.every(idx => partialBuckets[idx] !== 1))
    //     .sort((a, b) => {
    //       const aScore = a.reduce((acc, idx) => acc + partialBuckets[idx], 0)
    //       const bScore = b.reduce((acc, idx) => acc + partialBuckets[idx], 0)
    //       return bScore - aScore
    //     })
    //   for (const button of validButtons) {
    //     const next = button.reduce(
    //       (acc, idx) => {
    //         acc[idx] = (acc[idx] ?? 0) + 1
    //         return acc
    //       },
    //       [...values],
    //     )
    //     const res = dfs({ count: count + 1, values: next })
    //     if (res) {
    //       return res
    //     }
    //   }
    //   // throw new Error('No path found')
    // }
    // return dfs({ count: 0, values: new Array(machine.initState.length).fill(0) })
  }
  return machines.map(machineMinPresses).reduce(sum)
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 7)
bench(logger, 'part 1 input', () => part1(INPUT), 578)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 33)
// bench(logger, 'part 2 input', () => part2(INPUT), 1554370486)
