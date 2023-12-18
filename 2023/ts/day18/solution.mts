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

class Node {
  x: number
  y: number
  val: number
  neighbours: Record<string, Node>
  constructor(y, x, val) {
    this.x = x
    this.y = y
    this.val = val
    this.neighbours = {}
  }
}

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

  const segs = [[], [], [], []]
  let curX = 0
  let curY = 0
  let interestingX = new Set()
  lines.forEach(({ len, dir }) => {
    if (dir === 0) {
      console.log(`moving right x ${len}`)
      //right
      interestingX.add(curX)
      segs[dir].push({ curY, dir, minX: curX, maxX: curX + len })
      curX += len
    } else if (dir === 2) {
      console.log(`moving left x ${len}`)
      //left
      interestingX.add(curX)
      segs[dir].push({ curY, dir, minX: curX - len, maxX: curX })
      curX -= len
    } else if (dir === 3) {
      console.log(`moving up x ${len}`)
      //up
      segs[dir].push({ curX, dir, minY: curY - len, maxY: curY })
      // segs[dir][curX].push({ dir, minY: curY - len, maxY: curY })
      curY -= len
    } else if (dir === 1) {
      console.log(`moving down x ${len}`)
      //down
      segs[dir].push({ curX, dir, minY: curY, maxY: curY + len })
      // segs[dir][curX].push({ dir, minY: curY, maxY: curY + len })
      curY += len
    }
    console.log('node at: ', curX, curY)
  })

  segs[0].sort((a, b) => a.minX - b.minX).forEach(x => console.log(x))
  console.log('--')
  segs[2].sort((a, b) => a.minX - b.minX).forEach(x => console.log(x))
  console.log('--')

  let activeR = []
  let activeL = []
  let total = 0
  const testPoints = [...interestingX].sort(numSortR)
  console.log(testPoints)
  while (testPoints.length) {
    const testX = testPoints.pop()!
    const last = testPoints.length === 0
    console.log(`At testpoint ${testX}`)
    // console.log('activeR', activeR)
    // console.log('activeL', activeL)

    const startR = segs[0].filter(seg => seg.minX === testX) //.sort((a, b) => a.curY - b.curY)
    const endR = segs[0].filter(seg => seg.maxX === testX) //.sort((a, b) => a.curY - b.curY)
    activeR = last ? activeR : activeR.filter(seg => seg.maxX !== testX)
    activeR = activeR.concat(startR).sort((a, b) => b.curY - a.curY)

    const startL = segs[2].filter(seg => seg.minX === testX) //.sort((a, b) => a.curY - b.curY)
    const endL = segs[0].filter(seg => seg.maxX === testX) //.sort((a, b) => a.curY - b.curY)
    activeL = last ? activeL : activeL.filter(seg => seg.maxX !== testX)
    activeL = activeL.concat(startL).sort((a, b) => b.curY - a.curY)

    console.log('startR', startR)
    console.log('startL', startL)
    console.log('endR', endR)
    console.log('endL', endL)
    console.log('activeR', activeR)
    console.log('activeL', activeL)

    const ll = [...activeL]
    const rr = [...activeR]
    if (ll.length !== rr.length) {
      console.log('mismatch')
      console.log('ll: ', ll)
      console.log('rr: ', rr)
      process.exit(0)
    }
    let lineScore = 0
    const ranges = []
    while (ll.length) {
      const r = rr.pop()!
      const l = ll.pop()!
      const score = l.curY - r.curY + 1
      lineScore += score
      ranges.push({ r, l })
      console.log(`range from ${r.curY}\tto ${l.curY}\tscore: ${score}`)
    }
    // if (startR.length && startL.length) {
    const vertSegs = [...segs[1], ...segs[3]].filter(seg => seg.curX === testX)
    console.log(ranges)
    vertSegs.forEach(seg => {
      const upLeft = ranges.find(range => range.l.curY === seg.minY && range.r.curY === seg.maxY)
      if (upLeft) return
      // console.log('unable to find right range for up segment', seg)
      const upRight = ranges.find(range => range.r.curY === seg.minY && range.l.curY === seg.maxY)
      if (upRight) return
      // console.log('unable to find left range for up segment', seg)
      const ula = ranges.find(range => range.r.curY <= seg.minY && range.l.curY >= seg.maxY)
      if (ula) return
      const ura = ranges.find(range => range.l.curY <= seg.minY && range.r.curY >= seg.maxY)
      if (ura) return
      console.log('range', seg.minY, seg.maxY)
      const hasMin = ranges.find(range => range.l.curY === seg.minY || range.r.curY === seg.minY)
        ? 1
        : 0
      const hasMax = ranges.find(range => range.l.curY === seg.maxY || range.r.curY === seg.maxY)
        ? 1
        : 0
      console.log('really unable to find this bad boy', lineScore, seg)
      console.log(hasMin, hasMax)
      total += seg.maxY - seg.minY + 1 - hasMin - hasMax
      console.log(
        `!!! ADDING ${seg.maxY - seg.minY + 1 - hasMin - hasMax} for missing vertical segment`
      )
      // throw ''
    })
    // downSegs.forEach(seg => {
    //   const dl = ranges.find(range => range.l.curY === seg.minY && range.r.curY === seg.maxY)
    //   // segment completely covered by a range going left to right
    //   if (dl) return
    //   // console.log('unable to find left range for down segment', seg)
    //   const dr = ranges.find(range => range.r.curY === seg.minY && range.l.curY === seg.maxY)
    //   // segment completely covered by a range going right to left
    //   if (dr) return
    //   console.log('unable to find right range for down segment', seg)
    //   // const dla = ranges.find(range => range.r.curY <= seg.minY && range.l.curY >= seg.maxY)
    //   // if (dla) return
    //   // const dra = ranges.find(range => range.l.curY <= seg.minY && range.r.curY >= seg.maxY)
    //   // if (dra) return
    //   console.log('really unable to find this bad boy', lineScore, seg)
    //   total += seg.maxY - seg.minY - 1
    //   console.log(`!!! ADDING ${seg.maxY - seg.minY - 1} for missing vertical segment`)
    //   // throw ''
    // })
    // }
    console.log(`testpoint ${testX} score ${lineScore}`)
    const repeat = (testPoints.at(-1) ?? testX + 1) - testX
    console.log(`next point of interest is ${testPoints.at(-1)} which is ${repeat} away`)
    console.log(`adding ${lineScore * repeat} to total: ${total}`)
    total += lineScore * repeat
    console.log('---------')
  }
  // for (let i = 0; i < 1; i++) {
  //   const startR = segs[0].filter(seg => seg.minX === testX).sort((a, b) => a.curY - b.curY)
  //   activeR = activeR.filter(seg => seg.maxX <= testX)
  //   activeR = activeR.concat(startR)

  //   const startL = segs[2].filter(seg => seg.minX === testX).sort((a, b) => a.curY - b.curY)
  //   activeL = activeL.filter(seg => seg.maxX <= testX)
  //   activeL = activeR.concat(startL)
  // }

  return total
  // const FF = [{ x: 0, y: 0 }]
  // while (FF.length) {
  //   const { x, y } = FF.pop()!
  //   if (newGrid[y][x] !== '.') continue
  //   total++
  //   newGrid[y][x] = '@'
  //   if (y > 0) FF.push({ y: y - 1, x })
  //   if (x > 0) FF.push({ y, x: x - 1 })
  //   if (y < newGrid.length - 1) FF.push({ y: y + 1, x })
  //   if (x < newGrid[y].length - 1) FF.push({ y, x: x + 1 })
  // }
  // return newGrid.length * newGrid[0].length - total
}

console.clear()
try {
  // bench(logger, 'part 1 example', () => part1(EXAMPLE), 62)
  // bench(logger, 'part 1 input', () => part1(INPUT), 49578)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 952408144115)
  bench(logger, 'part 2 input', () => part2(INPUT), 49578)
} catch (e) {
  console.error(e)
}
