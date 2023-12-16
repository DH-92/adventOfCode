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
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

enum DIRS {
  right = 0,
  up = 1,
  left = 2,
  down = 3,
  leftS = 'left',
  upS = 'up',
  rightS = 'right',
  downS = 'down',
}

class Beam {
  x: number
  y: number
  dir: number
  constructor(x = -1, y = 0, dir = 0) {
    this.x = x
    this.y = y
    this.dir = dir
  }
}

enum Obj {
  'fwd' = 47,
  'hor' = 45,
  'vert' = 124,
  'back' = 92,
}

const interact = (beam: Beam, obj: string | number, beams: Beam[]) => {
  if (!obj) return beams.push(beam)
  const isHorizontal = beam.dir % 2 === 0
  switch (obj) {
    case Obj.hor:
    case Obj.vert:
      if (isHorizontal === (obj === Obj.hor)) return beams.push(beam)
      beams.push(new Beam(beam.x, beam.y, (beam.dir + 1) % 4))
      beams.push(new Beam(beam.x, beam.y, (beam.dir + 3) % 4))
      break
    default:
      beam.dir = isHorizontal === (obj === Obj.fwd) ? (beam.dir + 1) % 4 : (beam.dir + 3) % 4
      return beams.push(beam)
  }
}

const part1 = (path: string): string | number => {
  const grid = inputHandler
    .toArray(path)
    .map(l => l.split('').map(x => (x === '.' ? 0 : x.charCodeAt(0))))

  const xMin = 0
  const yMin = 0
  const xMax = grid[0].length - 1
  const yMax = grid.length - 1

  const move = (beam: Beam) => {
    switch (beam.dir) {
      case DIRS.left:
        beam.x -= 1
        if (beam.x < xMin) return false
        break
      case DIRS.right:
        beam.x += 1
        if (beam.x > xMax) return false
        break
      case DIRS.up:
        beam.y -= 1
        if (beam.y < yMin) return false
        break
      case DIRS.down:
        beam.y += 1
        if (beam.y > yMax) return false
        break
    }
    return true
  }

  const DPArr = getGrid(() => [] as boolean[], grid.length, grid.length)

  const beams = [new Beam()]

  let lit = 0
  while (beams.length) {
    const beam = beams.pop()!
    if (!move(beam)) continue
    if (DPArr[beam.y][beam.x].length === 0) lit++
    if (DPArr[beam.y][beam.x][beam.dir] === true) continue
    DPArr[beam.y][beam.x][beam.dir] = true
    interact(beam, grid[beam.y][beam.x], beams)
  }
  return lit
}

const part2 = (path: string): string | number => {
  const grid = inputHandler
    .toArray(path)
    .map(l => l.split('').map(x => (x === '.' ? 0 : x.charCodeAt(0))))

  const move = (beam: Beam) => {
    switch (beam.dir) {
      case DIRS.left:
        beam.x -= 1
        break
      case DIRS.right:
        beam.x += 1
        break
      case DIRS.up:
        beam.y -= 1
        break
      case DIRS.down:
        beam.y += 1
        break
    }
  }

  let max = 0
  for (let sDir = 0; sDir < 4; sDir++) {
    for (let sPos = 0; sPos < grid.length; sPos++) {
      const beams = sDir % 2 ? [new Beam(sPos, -1, sDir)] : [new Beam(-1, sPos, sDir)]

      const loopDetection = getGrid(() => [] as boolean[], grid.length, grid.length)

      let lit = 0
      while (beams.length) {
        const beam = beams.pop()!
        move(beam)
        if (loopDetection[beam.y]?.[beam.x] === undefined) continue
        if (loopDetection[beam.y][beam.x][beam.dir] === true) continue
        if (loopDetection[beam.y][beam.x].length === 0) lit++
        loopDetection[beam.y][beam.x][beam.dir] = true
        interact(beam, grid[beam.y][beam.x], beams)
      }
      if (lit > max) max = lit
    }
  }
  return max
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 46)
  bench(logger, 'part 1 input', () => part1(INPUT), 7608)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 51)
  bench(logger, 'part 2 input', () => part2(INPUT), 8221)
} catch (e) {
  console.error(e)
}
