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
  numSort,
  numSortR,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const lines = inputHandler
    .toArray(path)
    .map(l => l.replace('R', '0').replace('L', '2').replace('U', '3').replace('D', '1').split(' '))
    .map(line => {
      const dir = Number(line[0])
      const len = Number(line[1])
      return { dir, len }
    })
  const size = 1000
  const grid = getGrid(() => '.', size, size)
  let x = size >> 1
  let y = size >> 1
  let maxY = 0
  let minY = Number.MAX_SAFE_INTEGER
  let maxX = 0
  let minX = Number.MAX_SAFE_INTEGER
  lines.forEach((l, li) => {
    const { dir, len } = l
    for (let i = 0; i < len; i++) {
      if (dir === 0) {
        y = y
        x = x + 1
        if (x > maxX) maxX = x
      } else if (dir === 2) {
        y = y
        x = x - 1
        if (x < minX) minX = x
      } else if (dir === 3) {
        x = x
        y = y - 1
        if (y < minY) minY = y
      } else if (dir === 1) {
        x = x
        y = y + 1
        if (y > maxY) maxY = y
      }
      grid[y][x] = `#`
    }
  })
  console.log((minX -= 1), (maxX += 2), (minY -= 1), (maxY += 2))

  let total = 0
  const newGridA = grid.slice(minY, maxY)
  const newGrid = newGridA.map(l => l.slice(minX, maxX))
  const FF = [{ x: 0, y: 0 }]
  while (FF.length) {
    const { x, y } = FF.pop()!
    if (newGrid[y][x] !== '.') continue
    total++
    newGrid[y][x] = '@'
    if (y > 0) FF.push({ y: y - 1, x })
    if (x > 0) FF.push({ y, x: x - 1 })
    if (y < newGrid.length - 1) FF.push({ y: y + 1, x })
    if (x < newGrid[y].length - 1) FF.push({ y, x: x + 1 })
  }
  return newGrid.length * newGrid[0].length - total
}

const part2 = (path: string): string | number => {
  const lines = inputHandler
    .toArray(path)
    .map(l => l.split('#')[1])
    .map(l => {
      const clr = l.match(/[a-f|\d]+/)[0]
      const len = parseInt(clr.substring(0, 5), 16)
      const dir = parseInt(clr.substring(5), 16)
      return { dir, len }
    })

  // const lines = inputHandler
  //   .toArray(path)
  //   .map(l => l.replace('R', '0').replace('L', '2').replace('U', '3').replace('D', '1').split(' '))
  //   .map(line => {
  //     const dir = Number(line[0])
  //     const len = Number(line[1])
  //     return { dir, len }
  //   })

  interface Node {
    curY: number
    minX: number
    maxX: number
  }

  const segs: Node[][] = [[], [], []]
  const segsX = {}
  let curX = 0
  let curY = 0
  let interestingX: Set<number> = new Set()
  lines.forEach(({ len, dir }) => {
    interestingX.add(curX)
    if (dir === 0) {
      //right
      segs[dir].push({ curY, minX: curX, maxX: curX + len })
      curX += len
      return
    }
    if (dir === 2) {
      //left
      segs[dir].push({ curY, minX: curX - len, maxX: curX })
      curX -= len
      return
    }
    segsX[curX] ??= []
    if (dir === 1) {
      //down
      segsX[curX].push({ minY: curY, maxY: curY + len })
      curY += len
      return
    }
    if (dir === 3) {
      //up
      segsX[curX].push({ minY: curY - len, maxY: curY })
      curY -= len
      return
    }
  })
  const testPoints: number[] = [...interestingX].sort(numSortR)

  let activeR: Node[] = []
  let activeL: Node[] = []
  let total = 0
  while (testPoints.length) {
    const testX = testPoints.pop()!
    const last = testPoints.length === 0

    if (!last) {
      activeR = activeR
        .filter(seg => seg.maxX !== testX)
        .concat(segs[0].filter(seg => seg.minX === testX))
        .sort((a, b) => b.curY - a.curY)
      activeL = activeL
        .filter(seg => seg.maxX !== testX)
        .concat(segs[2].filter(seg => seg.minX === testX))
        .sort((a, b) => b.curY - a.curY)
    }

    const ll = [...activeL]
    const rr = [...activeR]

    let lineScore = 0
    const ranges: { lo: number; hi: number }[] = []
    while (ll.length) {
      const l = ll.pop()!
      const r = rr.pop()!
      lineScore += l.curY - r.curY + 1
      ranges.push({ lo: Math.min(l.curY, r.curY), hi: Math.max(l.curY, r.curY) })
    }

    segsX[testX].forEach(({ minY, maxY }) => {
      if (ranges.find(r => r.lo <= minY && r.hi >= maxY)) return
      const hasMin = ranges.find(r => r.lo === minY || r.hi === minY) ? 1 : 0
      const hasMax = ranges.find(r => r.lo === maxY || r.hi === maxY) ? 1 : 0
      total += maxY - minY + 1 - hasMin - hasMax
    })
    const repeat = last ? 1 : testPoints.at(-1)! - testX
    total += lineScore * repeat
  }
  return total
}

console.clear()
try {
  // bench(logger, 'part 1 example', () => part1(EXAMPLE), 62)
  // bench(logger, 'part 1 input', () => part1(INPUT), 49578)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 952408144115)
  bench(logger, 'part 2 input', () => part2(INPUT), 52885384955882)
} catch (e) {
  console.error(e)
}
