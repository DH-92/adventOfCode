#!/usr/bin/env zx
import 'zx/globals'
import { InputHandler, input, example, line } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = path => {
  const lines = inputHandler.toArray(path)
  return lines.reduce((sum, l) => {
    const nums = l.match(/\d/g)
    const [a] = nums
    const [b] = nums.slice(-1)
    return Number(`${a}${b}`) + Number(sum)
  }, 0)
}

console.time('p1e')
console.log(`part1 -- example: ${JSON.stringify(part1(example))}`)
console.timeEnd('p1e')
console.time('p1')
console.log(`part1 -- input: ${JSON.stringify(part1(input))}`)
console.timeEnd('p1')

const numStrings = {
  one: 1,
  eno: 1,
  1: 1,
  two: 2,
  owt: 2,
  2: 2,
  three: 3,
  eerht: 3,
  3: 3,
  four: 4,
  ruof: 4,
  4: 4,
  five: 5,
  evif: 5,
  5: 5,
  six: 6,
  xis: 6,
  6: 6,
  seven: 7,
  neves: 7,
  7: 7,
  eight: 8,
  thgie: 8,
  8: 8,
  nine: 9,
  enin: 9,
  9: 9,
}

const part2 = path => {
  const lines = inputHandler.toArray(path, line)
  return lines.reduce((sum, l) => {
    const [a] = l.match(/\d|one|two|three|four|five|six|seven|eight|nine/)
    const [b] = l
      .split('')
      .reduce((reversed, c) => c + reversed, '')
      .match(/enin|thgie|neves|xis|evif|ruof|eerht|owt|eno|\d/g)
    return sum + numStrings[a] + numStrings[b] * 10
  }, 0)
}

// const part2 = path => {
//   const lines = inputHandler.toArray(path, line)
//   const regExp = /one|two|three|four|five|six|seven|eight|nine|\d/g
//   return lines.reduce((sum, l) => {
//     const first = regExp.exec(l)
//     let last
//     let match
//     while ((match = regExp.exec(l))) {
//       // backtrack lastmatch pointer to catch overlapping words ie twone
//       if (match.index !== regExp.lastIndex - 1) regExp.lastIndex--
//       last = match[0]
//     }
//     const aa = isNaN(first) ? numStrings[first] : Number(first)
//     if (!last) return sum + aa * 11

//     const bb = isNaN(last) ? numStrings[last] : Number(last)
//     return sum + aa * 10 + bb
//   }, 0)
// }

// const part2 = path =>
//   inputHandler.toArray(path, line).reduce((sum, l) => {
//     const regExp = /(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g
//     const matches = [...l.matchAll(regExp)]
//     const [first, last] = [matches.at(0), matches.at(-1)]
//     return sum + numStrings[last[1]] + numStrings[first[1]] * 10
//   }, 0)

console.time('p2e')
console.log(`part2 -- example: ${JSON.stringify(part2('example2.txt'))}`)
console.timeEnd('p2e')

//part 2 answer is NOT 54953 OR 54946 OR 54970 OR 54951
console.time('p2')
console.log(`part2 -- input: ${JSON.stringify(part2(input))}`)
console.timeEnd('p2')
