#!/usr/bin/env zx
import 'zx/globals'
import { InputHandler, example, input, line, paragraph, word } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const log = console.log

const part1 = path => {
  const lines = inputHandler.toArray(path, line)
  let sum = 0
  lines.forEach(l => {
    echo`${l}`
    const [g, s] = l.split(':')
    const game = g.split(' ')[1]
    const rounds = s.split(';')
    let valid = 1
    rounds.forEach(r => {
      // let red = +0
      // let green = +0
      // let blue = +0

      r.trim()
        .split(',')
        .map(x => x.trim().split(' '))
        .forEach(p => {
          // console.log(p)
          if (p[1] === 'red') {
            // red += +p[0]
            if (p[0] > 12) {
              // sum += +game
              valid = 0
              log(l)
            }
          } else if (p[1] === 'green') {
            // green += +p[0]
            if (p[0] > 13) {
              // sum += +game
              valid = 0
              log(l)
            }
          } else {
            // blue += +p[0]
            if (p[0] > 14) {
              // sum += +game
              valid = 0
              log(l)
            }
          }
        })
    })
    log(l, valid)
    if (valid) sum += +game

    // log(rounds)
    // echo`${game}`
    // process.exit(0)
  })
  return sum
}

console.time('p1e')
console.log(`part1 -- example: ${JSON.stringify(part1(example))}`)
console.timeEnd('p1e')
console.time('p1')
console.log(`part1 -- input: ${JSON.stringify(part1(input))}`)
console.timeEnd('p1')

const part2 = path => {
  const lines = inputHandler.toArray(path, line)
  let sum = 0
  lines.forEach(l => {
    echo`${l}`
    const [g, s] = l.split(':')
    const game = g.split(' ')[1]
    const rounds = s.split(';')
    let red = +0
    let green = +0
    let blue = +0
    rounds.forEach(r => {
      r.trim()
        .split(',')
        .map(x => x.trim().split(' '))
        .forEach(p => {
          // console.log(p)
          if (p[1] === 'red') {
            if (red < +p[0]) red = +p[0]
          } else if (p[1] === 'green') {
            if (green < +p[0]) green = +p[0]
          } else {
            if (blue < +p[0]) blue = +p[0]
          }
        })
    })
    log({ red, green, blue, power: red * green * blue })
    // process.exit(0)
    sum += red * green * blue
  })
  return sum
}

console.time('p2e')
console.log(`part2 -- example: ${JSON.stringify(part2(example))}`)
console.timeEnd('p2e')
console.time('p2')
console.log(`part2 -- input: ${JSON.stringify(part2(input))}`)
console.timeEnd('p2')
