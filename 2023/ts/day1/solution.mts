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
  // eno: 1,
  two: 2,
  // owt: 2,
  three: 3,
  // eerht: 3,
  four: 4,
  // ruof: 4,
  five: 5,
  // evif: 5,
  six: 6,
  // xis: 6,
  seven: 7,
  // neves: 7,
  eight: 8,
  // thgie: 8,
  nine: 9,
  // enin: 9,
}

// const part2 = path => {
//   const lines = inputHandler.toArray(path, line)
//   return lines.reduce((sum, l) => {
//     const [a] = l.match(/\d|one|two|three|four|five|six|seven|eight|nine/)
//     const [b] = l
//       .split('')
//       .reverse()
//       .join('')
//       .match(/enin|thgie|neves|xis|evif|ruof|eerht|owt|eno|\d/g)
//     const aa = isNaN(a) ? numStrings[a] : a
//     const bb = isNaN(b) ? numStrings[b] : b
//     console.log(`${l} ${aa}${bb}`)
//     return Number(`${aa}${bb}`) + Number(sum)
//   }, 0)
// }

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const regExp = /one|two|three|four|five|six|seven|eight|nine|\d/g
  return lines.reduce((sum, l) => {
    const first = regExp.exec(l)![0]
    let last: string | undefined
    let match: RegExpExecArray | null
    while ((match = regExp.exec(l))) {
      // backtrack lastmatch pointer to catch overlapping words ie twone
      if (match.index !== regExp.lastIndex - 1) regExp.lastIndex--
      last = match[0]
    }
    const aa = isNaN(parseInt(first)) ? numStrings[first] : parseInt(first)
    if (!last) return sum + aa * 11

    const bb = isNaN(parseInt(last)) ? numStrings[last] : parseInt(last)
    return sum + bb + aa * 10
  }, 0)
}
console.clear()
bench('part 1 example', () => part1(EXAMPLE), 142)
bench('part 1 input', () => part1(INPUT), 55172)

bench('part 2 example', () => part2('example2.txt'), 281)
bench('part 2 input', () => part2(INPUT), 54925)
