#!/usr/bin/env zx
import 'zx/globals'
import { InputHandler, input, example, line } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const part1 = path => {
  const lines = inputHandler.toArray(path)
  return lines.reduce((sum, l) => {
    const nums = l.replace(/[^0-9]/g, '').split('')
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

const part2 = path => {
  const numStrings = {
    one: 'one1one',
    two: 'two2two',
    three: 'three3three',
    four: 'four4four',
    five: 'five5five',
    six: 'six6six',
    seven: 'seven7seven',
    eight: 'eight8eight',
    nine: 'nine9nine',
  }
  const lines = inputHandler.toArray(path, line)
  return lines.reduce((sum, l) => {
    Object.entries(numStrings).forEach(([k, v]) => {
      l = l.replaceAll(k, v)
    })
    const nums = l.replace(/[^0-9]/g, '').split('')
    const a = nums.at(0)
    const b = nums.at(-1)
    return Number(`${a}${b}`) + Number(sum)
  }, 0)
}

console.time('p2e')
console.log(`part2 -- example: ${JSON.stringify(part2('example2.txt'))}`)
console.timeEnd('p2e')

//part 2 answer is NOT 54953 OR 54946 OR 54970 OR 54951
console.time('p2')
console.log(`part2 -- input: ${JSON.stringify(part2(input))}`)
console.timeEnd('p2')
