#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, WORD, bench, Logger, sum } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()

const part1 = (path: string): number =>
  [...inputHandler.toString(path).matchAll(/mul\((?<numA>\d{1,3}),(?<numB>\d{1,3})\)/g)]
    .map(([_, numA, numB]) => Number(numA) * Number(numB))
    .reduce(sum)

const part2 = (path: string): number =>
  Array.from(
    inputHandler.toString(path).matchAll(/mul\((?<numA>\d{1,3}),(?<numB>\d{1,3})\)|do\(\)|don't\(\)/g),
  ).reduce(
    ([doMode, sum], [string, numA, numB]): [boolean, number] => {
      switch (string) {
        case 'do()':
          return [true, sum]
        case "don't()":
          return [false, sum]
        default:
          if (!doMode) {
            return [false, sum]
          }
          return [true, +numA * +numB + sum]
      }
    },
    [true, 0] as [boolean, number],
  )[1]

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 161)
bench(logger, 'part 1 input', () => part1(INPUT), 187825547)
bench(logger, 'part 2 example', () => part2('example2.txt'), 48)
bench(logger, 'part 2 input', () => part2(INPUT), 85508223)
