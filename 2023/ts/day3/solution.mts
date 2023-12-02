#!/usr/bin/env npx tsx
import 'zx/globals'
import { InputHandler, bench, EXAMPLE, INPUT, WORD, LINE, PARAGRAPH } from '../helpers/index.mjs'

const inputHandler = new InputHandler(process.cwd())

class Logger {
  private messages: string[]
  constructor() {
    this.messages = []
  }
  log = (...messages: unknown[]): void => {
    this.messages.push(messages.map((m: unknown): string => JSON.stringify(m)).join(''))
  }
  dump = (): void => this.messages.forEach(message => console.debug(message))
  clear = (): void => {
    this.messages.splice(0, this.messages.length)
  }
  '' = (...messages: unknown[]): void => {
    this.messages.push(messages.map((m: unknown): string => JSON.stringify(m)).join(''))
  }
}

const logger = new Logger()
const log = logger.log

const part1 = (path: string): string | number => {
  const chars = inputHandler.toArray(path, '')
  chars.forEach(c => {
    log(c)
  })
  const words = inputHandler.toArray(path, /\s/)
  words.forEach(w => {
    log(w)
  })
  const lines = inputHandler.toArray(path, LINE)
  lines.forEach(l => {
    log(l)
  })
  const paragraphs = inputHandler.toArray(path, PARAGRAPH)
  paragraphs.forEach(p => {
    p.split(LINE).map(log)
  })
  return 'oh no'
}

const part2 = (path: string): string | number => {
  const chars = inputHandler.toArray(path, '')
  chars.forEach(c => {
    log(c)
  })
  const words = inputHandler.toArray(path, WORD)
  words.forEach(w => {
    log(w)
  })
  const lines = inputHandler.toArray(path, LINE)
  lines.forEach(l => {
    log(l)
  })
  const paragraphs = inputHandler.toArray(path, PARAGRAPH)
  paragraphs.forEach(p => {
    log(p)
  })
  return ''
}
try {
  bench('part 1 example', () => part1(EXAMPLE), 0)
  logger.clear()
  bench('part 1 input', () => part1(INPUT), 0)
  logger.clear()
  bench('part 2 example', () => part2(EXAMPLE), 0)
  logger.clear()
  bench('part 2 input', () => part2(INPUT), 0)
  logger.clear()
} catch (e) {
  console.clear()
  logger.dump()
  console.log('\n\n----------\n', e)
}
