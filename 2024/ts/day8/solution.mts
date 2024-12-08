#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  InputHandler,
  INPUT,
  EXAMPLE,
  bench,
  Logger,
  LINE,
  transpose,
  PARAGRAPH,
  sum,
  getGrid,
} from '../helpers/index.mjs'
import { ExecOptionsWithStringEncoding } from 'child_process'

const inputHandler = new InputHandler(process.cwd())

const getPairs = <T extends any>(arr: T[]): [T, T][] =>
  arr.flatMap((v1): [T, T][] => arr.map((v2): [T, T] => [v1, v2]))

const part1 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const height = lines.length
  const width = lines[0].length
  const towers = lines
    .map(line => line.split(''))
    .flatMap((line, y) => line.map((char, x) => ({ x, y, z: char.charCodeAt(0) })))
    .filter(({ z }) => z !== 46) // '.`.charCodeAt(0) === 46

  return Object.values(Object.groupBy(towers, tower => tower.z))
    .filter(x => !!x)
    .flatMap(towers => getPairs(towers).filter(([tower1, tower2]) => tower1 !== tower2))
    .map(function towerPairsToAntiNodes([tower1, tower2]) {
      const dx = tower2.x - tower1.x
      const dy = tower2.y - tower1.y
      const x = tower1.x - dx
      const y = tower1.y - dy
      return { x, y }
    })
    .filter(({ x, y }) => y >= 0 && y < height && x >= 0 && x < width)
    .map(x => JSON.stringify(x))
    .reduce((set, x) => set.add(x), new Set()).size
}

const part2 = (path: string): string | number => {
  const lines = inputHandler.toArray(path, LINE)
  const height = lines.length
  const width = lines[0].length
  const towersByFrequency = lines
    .map(line => line.split(''))
    .reduce((towersByFrequency, line, y) => {
      line.forEach((char, x) => {
        if (char === '.') return
        const tower = { x, y }
        const frequency = char.charCodeAt(0)
        towersByFrequency[frequency] ??= []
        towersByFrequency[frequency].push(tower)
      })
      return towersByFrequency
    }, [] as {x: number, y: number}[][])
  return towersByFrequency
    .reduce((antiNodes, towers): Boolean[][] => {
      towers.forEach(tower1 => {
        towers.forEach(tower2 => {
          if (tower1 === tower2) return
          const dx = tower2.x - tower1.x
          const dy = tower2.y - tower1.y
          let { x, y } = tower1
          while (x >= 0 && x < height && y >= 0 && y < width) {
            antiNodes[y] ??= []
            antiNodes[y][x] = true
            x += dx
            y += dy
          }
        })
      })
      return antiNodes
    }, [] as Boolean[][])
    .flat(2).length
}

const logger = new Logger()

console.clear()
bench(logger, 'part 1 example 2', () => part1('example2.txt'), 2)
bench(logger, 'part 1 example', () => part1(EXAMPLE), 14)
bench(logger, 'part 1 input', () => part1(INPUT), 308)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 34)
bench(logger, 'part 2 input', () => part2(INPUT), 1147)
