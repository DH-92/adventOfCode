#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, LINE, bench } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = (path: string): string | number =>
  inputHandler.toArray(path).reduce((sum, l) => {
    const nums = l.match(/\d/g) ?? []
    const a = nums[0]
    const b = nums.at(-1)![0]
    return sum + parseInt(`${a}${b}`)
  }, 0)

const numStrings: Record<string, number> = {
  one: 1,
  '1': 1,
  two: 2,
  '2': 2,
  three: 3,
  '3': 3,
  four: 4,
  '4': 4,
  five: 5,
  '5': 5,
  six: 6,
  '6': 6,
  seven: 7,
  '7': 7,
  eight: 8,
  '8': 8,
  nine: 9,
  '9': 9,
}

const part2 = (path: string): string | number =>
  inputHandler.toArray(path, LINE).reduce((sum, l) => {
    const regExp = /(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g
    const matches = [...l.matchAll(regExp)]
    const [first, last] = [matches.at(0)!, matches.at(-1)!]
    return sum + numStrings[last[1]] + numStrings[first[1]] * 10
  }, 0)

console.clear()
bench('part 1 example', () => part1(EXAMPLE), 142)
bench('part 1 input', () => part1(INPUT), 55172)

bench('part 2 example', () => part2('example2.txt'), 281)
bench('part 2 input', () => part2(INPUT), 54925)
