#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  bench,
  EXAMPLE,
  INPUT,
  LINE,
  Logger,
  range,
  sum,
  product,
  getGrid,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const line = lines[0]
  console.log(line)
  return line
}

const part2 = (path: string): string | number => {
  return 0
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 0)
  bench(logger, 'part 1 input', () => part1(INPUT), 0)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 0)
  bench(logger, 'part 2 input', () => part2(INPUT), 0)
} catch (e) {
  console.log(e)
}
