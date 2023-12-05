#!/usr/bin/env npx tsx --watch
import 'zx/globals'
import {
  //force multiline
  InputHandler,
  EXAMPLE,
  INPUT,
  LINE,
  sum,
  bench,
  Logger,
  range,
  PARAGRAPH,
  numSortR,
  numSort,
  reshape,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const processMap = (m: string) =>
    m
      .split(LINE)
      .filter(l => l.indexOf('-') == -1)
      .map(l => l.split(/\s/g).map(Number) as [number, number, number])
      .map(l => [l[1], l[1] + l[2] - 1, l[0] - l[1]]) // Convert the range to a more useful [sourceStart, SourceEnd, OutputDelta]
      .sort((a, b) => a[1] - b[1]) // Sort each range by the sourceStart

  const get = (level: number, seed: number) => {
    for (const range of maps[level]) {
      if (seed < range[0]) return seed
      if (seed <= range[1]) return seed + range[2]
    }
    return seed
  }

  const [seedLine, ...mapLines] = inputHandler.toArray(path, PARAGRAPH)
  const seeds = seedLine.match(/\d+/g)!.map(Number)
  const maps = mapLines.map(processMap)

  return seeds.reduce(
    (min, seed) => Math.min(min, get(6, get(5, get(4, get(3, get(2, get(1, get(0, seed)))))))),
    Number.MAX_SAFE_INTEGER
  )
}

const part2 = (path: string): string | number => {
  // This function is the core of of the main loop and is performant critical
  // As such we pre-process the maps to minimise repeating arithmetic
  // A major optimisation here is returning a "next" value
  // This is used in the main loop to skip to the end of the range with the least remaining values
  const get = (level: number, seed: number) => {
    for (const range of maps[level]) {
      if (seed < range[0]) return { result: seed, next: range[0] - seed }
      if (seed <= range[1]) return { result: seed + range[2], next: range[1] - seed }
    }
    return { result: seed, next: Number.MAX_SAFE_INTEGER }
  }
  type MapRange = [number, number, number] // [sourceStart, SourceEnd, OutputDelta]
  const processMap = (m: string) =>
    m
      .split(LINE)
      .filter((l: string): boolean => l.indexOf('-') == -1)
      .map((l: string) => l.split(/\s/g).map(Number) as MapRange)
      .map((l: MapRange): MapRange => [l[1], l[1] + l[2] - 1, l[0] - l[1]]) // Convert the range to MapRange
      .sort((a, b) => a[1] - b[1]) // Sort each range by the sourceStart

  const [seedLine, ...mapLines] = inputHandler.toArray(path, PARAGRAPH)
  const seeds = seedLine.match(/\d+/g)!.map(Number)
  const maps = mapLines.map(processMap)

  return reshape(seeds, 2).reduce((min, [start, count]) => {
    for (let seed = start; seed < start + count; seed++) {
      let key = seed
      let skip = Number.MAX_SAFE_INTEGER
      for (let level = 0; level <= 6; level++) {
        const { result, next } = get(level, key)
        key = result
        skip = Math.min(skip, next)
      }
      min = Math.min(min, key)
      seed += skip
      // Jump the main loop to the end of the shortest range in our path
      // This line reduces runtime by ~1,000,000x from 272610ms to 0.10ms
    }
    return min
  }, Number.MAX_SAFE_INTEGER)
}

console.clear()
try {
  bench(logger, 'part 1 example', () => part1(EXAMPLE), 35)
  bench(logger, 'part 1 input', () => part1(INPUT), 389056265)
  bench(logger, 'part 2 example', () => part2(EXAMPLE), 46)
  bench(logger, 'part 2 input', () => part2(INPUT), 137516820)
} catch (e) {
  console.error(e)
}
