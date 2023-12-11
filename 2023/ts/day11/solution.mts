#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  bench,
  Logger,
  getGrid,
  transpose,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

class Node {
  x: number
  y: number
  val?: string
  dist: number = Number.MAX_SAFE_INTEGER
  prev?: Node
  next?: Node
}

const buildGrid = lines => {
  const grid: string[][] = getGrid(() => '', lines.length + 1, lines[0].length + 1)
  lines.forEach((l, yy) => {
    l.split('').forEach((c, xx) => {
      const y = yy + 1
      const x = xx + 1
    })
  })
  return grid
}

const part1 = (path: string): string | number => {
  const grid = inputHandler.toArray(path).map(l => l.split(''))
  const grid2 = []
  for (let y = 0; y < grid.length; y++) {
    if (grid[y].every(c => c === '.')) grid2.push(grid[y])
    grid2.push(grid[y])
  }

  const grid3 = transpose(grid2)
  const grid4 = []
  for (let y = 0; y < grid3.length; y++) {
    if (grid3[y].every(c => c === '.')) grid4.push(grid3[y])
    grid4.push(grid3[y])
  }
  const grid5 = transpose(grid4)
  console.table(grid5)
  grid5.forEach(r => console.log(r.join('')))

  const nodes = []
  grid5.forEach((r, y) => {
    r.forEach((c, x) => {
      if (c === '#') {
        nodes.push({ x, y })
      }
    })
  })
  let sum = 0
  for (let n = 0; n < nodes.length; n++) {
    for (let nn = n; nn < nodes.length; nn++) {
      if (nn === n) continue
      console.log('finding distance from: ', n, ' to: ', nn)
      const a = nodes[n]
      const b = nodes[nn]
      const dist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
      console.log(dist)
      sum += dist
    }
  }
  return sum
}

// const part2 = (path: string): string | number => {
//   const [grid, start] = buildGrid(inputHandler.toArray(path))

//   const grid2: Array<boolean | string>[] = getGrid(() => false, grid.length, grid[0].length)
//   let pending: Node = start
//   while (true) {
//     const x = pending.x
//     const y = pending.y
//     grid2[y][x] = pending.val!
//     const next = pending.next!
//     if (next === start) break
//     if (next.next === pending) next.next = next.prev
//     pending = next
//   }

//   return grid2.reduce((sum, line) => {
//     let inside = false
//     let dir = false
//     line.forEach(char => {
//       if (!char) {
//         if (inside) sum++
//         return
//       }
//       switch (char) {
//         case '|':
//           inside = !inside
//           break
//         case 'L':
//           dir = true
//           break
//         case 'J':
//           inside = dir ? inside : !inside
//           break
//         case 'F':
//           dir = false
//           break
//         case '7':
//           inside = dir ? !inside : inside
//           break
//       }
//     })
//     return sum
//   }, 0)
// }

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 374)
  bench(logger, 'part 1 input', () => part1(INPUT), 6649)
  // bench(logger, 'part 2 example', () => part2(EXAMPLE), 1)
  // bench(logger, 'part 2 example', () => part2('example2.txt'), 10)
  // bench(logger, 'part 2 input', () => part2(INPUT), 601)
} catch (e) {
  console.error(e)
}
