#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, WORD, bench, Logger, sum } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const input = inputHandler.toString(path)
  const commands = input.match(/mul\(\d\d?\d?\,\d\d?\d?\)/g) ?? []
  return commands
  .map(command =>
    command
      .match(/\d\d?\d?/g)!
      .map(Number)
      .reduce((acc, val) => acc * val),
  )
  .reduce(sum)
}

const part2 = (path: string): string | number => {
  const cmds = inputHandler.toString(path).match(/mul\(\d\d?\d?\,\d\d?\d?\)|do\(\)|don't\(\)/g)
  let doMode = true
  const commands: string[] = []
  cmds?.forEach(cmd => {
    switch (cmd) {
      case 'do()':
        doMode = true
        return
      case "don't()":
        doMode = false
        return
    }
    if (doMode) {
      commands.push(cmd)
    }
  })
  return commands
    .map(command =>
      command
        .match(/\d\d?\d?/g)!
        .map(Number)
        .reduce((acc, val) => acc * val),
    )
    .reduce(sum)
}

console.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 161)
bench(logger, 'part 1 input', () => part1(INPUT), 187825547)
bench(logger, 'part 2 example', () => part2('example2.txt'), 48)
bench(logger, 'part 2 input', () => part2(INPUT), 85508223)
