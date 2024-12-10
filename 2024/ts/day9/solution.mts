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
  reshape,
} from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

const logger = new Logger()
const log = logger.log

const BLANK = -1

const part1 = (path: string): string | number => {
  const input = inputHandler.toString(path)
  const blocks = reshape(input.split('').map(Number), 2)
  const disk: number[] = []
  blocks.forEach((block, id) => {
    const [a, b = 0] = block
    for (let i = 0; i < a; i++) {
      disk.push(id)
    }
    for (let i = 0; i < b; i++) {
      disk.push(-1)
    }
  })
  const disk2: number[] = []
  let moves = 1
  const usedDisk = blocks.reduce((acc, block) => acc + block[0], 0)
  disk.forEach((char, i) => {
    if (i > usedDisk - 1) {
      disk2.push(BLANK)
      return
    }
    if (char !== BLANK) {
      disk2.push(char)
      return
    }
    let next = disk[disk.length - moves]
    while (next === BLANK) {
      moves++
      next = disk[disk.length - moves]
    }
    disk2.push(next)
    moves++
  })
  let score = 0
  disk2.forEach((char, i) => {
    if (char === BLANK) return
    score += Number(char) * i
  })
  return score
}

const part2 = (path: string): string | number => {
  const input = inputHandler.toString(path)
  const disk1: number[] = []
  const blocks = reshape(input.split('').map(Number), 2).map(([fill, space = 0], id) => ({
    fill,
    space,
    id,
    addedFill: 0,
    offset: 0,
  }))
  let initOffset = 0
  blocks.forEach(block => {
    const { fill, space, id } = block
    block.offset = initOffset
    for (let i = 0; i < fill; i++) {
      disk1.push(id)
    }
    for (let i = 0; i < space; i++) {
      disk1.push(-1)
    }
    initOffset += fill + space
  })

  const disk2: number[] = [...disk1]
  blocks.toReversed().forEach(rBlock => {
    const { offset, fill, id} = rBlock
    for (const lBlock of blocks) {

      if (id === lBlock.id) break

      // does rBlock fit in lBlock's free space?
      if (fill > lBlock.space) continue

      // write contents of rBlock to first available space in lBlock
      const lOffset = lBlock.offset + lBlock.fill + lBlock.addedFill
      for (let i = 0; i < fill; i++) {
        disk2[lOffset + i] = id
      }

      // update lBlock with new size
      lBlock.addedFill += fill
      lBlock.space -= fill

      // zero out original rBlock
      for (let i = 0; i < fill; i++) {
        disk2[offset + i] = BLANK
      }
      break
    }
  })

  let score = 0
  disk2.forEach((char, i) => {
    score += (char === BLANK) ? 0 : Number(char) * i
  })
  return score
}

console.clear()
logger.clear()
bench(logger, 'part 1 example', () => part1(EXAMPLE), 1928)
bench(logger, 'part 1 input', () => part1(INPUT), 6366665108136)
bench(logger, 'part 2 example', () => part2(EXAMPLE), 2858)
bench(logger, 'part 2 input', () => part2(INPUT), 6398065450842)
bench(logger, 'part 2 input', () => part2('evil-input.txt'), 5799706413896802)
