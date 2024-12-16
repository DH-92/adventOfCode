#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import { InputHandler, INPUT, EXAMPLE, bench, Logger, sum, transpose } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string, height: number, width: number): string | number => {
  const quadrants: [number, number, number, number] = [0, 0, 0, 0]
  const w = (width - 1) / 2
  const h = (height - 1) / 2
  const robots = inputHandler
    .toArray(path)
    .map(line => line.match(/-?\d+/g)!.map(Number))
    .map(([x, y, vx, vy]) => ({ x, y, vx, vy }))
  robots.forEach((robot): unknown => {
    robot.x = (robot.x + (width + robot.vx) * 100) % width
    robot.y = (robot.y + (height + robot.vy) * 100) % height
    if (robot.x === w || robot.y === h) return
    if (robot.x < w) {
      if (robot.y < h) {
        return (quadrants[0] += 1)
      }
      return (quadrants[2] += 1)
    }
    if (robot.y < h) {
      return (quadrants[1] += 1)
    }
    return (quadrants[3] += 1)
  })
  return quadrants.reduce((acc, val) => acc * val, 1)
}
const drawGrid = (robots: any[], height: number, width: number) => {
  const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => 0))
  robots.forEach(({ x: x, y: y }) => (grid[y][x] += 1))
  grid.forEach(row => console.log(row.map(cell => (cell > 0 ? '#' : '.')).join('')))
}

const part2 = (path: string, height: number, width: number): number => {
  const robots = inputHandler
    .toArray(path)
    .map(line => line.match(/-?\d+/g)!.map(Number))
    .map(([x, y, vx, vy]) => ({ x, y, vx, vy }))
  const w = (width - 1) / 2
  const h = (height - 1) / 2
  let minSecFactor = 50_000_000
  for (let t = 1; t < 10_000; t++) {
    const quadrants: [number, number, number, number] = [0, 0, 0, 0]
    robots.forEach(robot => {
      robot.x = (robot.x + robot.vx + width) % width
      robot.y = (robot.y + robot.vy + height) % height
      if (robot.x === w || robot.y === h) return
      if (robot.x < w) {
        return robot.y < h ? (quadrants[0] += 1) : (quadrants[2] += 1)
      }
      return robot.y < h ? (quadrants[1] += 1) : (quadrants[3] += 1)
    })
    const secFactor = quadrants.reduce((acc, val) => acc * val, 1)
    if (secFactor < minSecFactor) {
      minSecFactor = secFactor
      // drawGrid(robots, height, width)
      // console.log(`After ${i} seconds (${secFactor / 1_000_000}):`)
      return t
    }
  }
  throw new Error(`minSecFactor is too low: ${minSecFactor}`)
}

console.clear()
logger.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE, 7, 11), 12)
bench(logger, 'part 1 input', () => part1(INPUT, 103, 101), 231019008)
bench(logger, 'part 2 input', () => part2(INPUT, 103, 101), 8280)
