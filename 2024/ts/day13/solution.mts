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
  intDiv,
} from '../helpers/index.mjs'
import { Memoize } from '../helpers/Memoize-decorator.js'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

interface Coord {
  x: number
  y: number
}

interface Machine {
  a: Coord
  b: Coord
  p: Coord
}

class Solver {
  a: Coord
  b: Coord
  p: Coord
  limit: number
  constructor(machine: Machine, limit: number = 0) {
    this.a = machine.a
    this.b = machine.b
    this.p = machine.p
    this.limit = limit
  }

  @Memoize((aPresses: number, bPresses: number) => `${aPresses},${bPresses}`)
  solve(aPresses: number, bPresses: number): number | void {
    const x = aPresses * this.a.x + bPresses * this.b.x
    const y = aPresses * this.a.y + bPresses * this.b.y
    if (x === this.p.x && y === this.p.y) {
      return 3 * aPresses + bPresses
    }
    if (x >= this.p.x || y >= this.p.y) {
      return
    }
    if (this.limit && (aPresses > this.limit || bPresses > this.limit)) {
      return
    }
    const pressA = this.solve(aPresses + 1, bPresses)
    const pressB = this.solve(aPresses, bPresses + 1)
    if (pressA && pressB) return Math.min(pressA, pressB)
    return pressA ?? pressB
  }
}

const part1 = (path: string): string | number => {
  const machines = inputHandler.toArray(path, PARAGRAPH).map((machine): Machine => {
    const [a, b, p] = machine.split('\n').map(line => line.match(/(\d+)/g).map(Number))
    return {
      a: { x: a[0], y: a[1] },
      b: { x: b[0], y: b[1] },
      p: { x: p[0], y: p[1] },
    }
  })
  return machines.map(machine => new Solver(machine, 100).solve(0, 0) ?? 0).reduce(sum)
}

const part2 = (path: string): string | number => {
  const offset = 10_000_000_000_000
  const machines = inputHandler.toArray(path, PARAGRAPH).map(machine => {
    const [a, b, p] = machine.split('\n').map(line => line.match(/(\d+)/g).map(Number))
    return {
      a: { x: a[0], y: a[1] },
      b: { x: b[0], y: b[1] },
      p: { x: p[0] + offset, y: p[1] + offset },
    }
  })
  return machines
    .map(({a, b, p}) => {
      const abBalancer = (a.x * b.y - a.y * b.x)
      const [aRes, aRemainder] = intDiv((p.x * b.y - p.y * b.x),abBalancer)
      if (aRemainder) return 0 //only integer solutions are valid
      const [bRes, bRemainder] = intDiv((p.y * a.x - p.x * a.y),abBalancer)
      if (bRemainder) return 0 //only integer solutions are valid
      return aRes * 3 + bRes
    })
    .reduce(sum)
}

console.clear()
logger.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 480)
bench(logger, 'part 1 input', () => part1(INPUT), 40069)
bench(logger, 'part 1 example', () => part2(EXAMPLE), 875318608908)
bench(logger, 'part 2 input', () => part2(INPUT), 71493195288102)
