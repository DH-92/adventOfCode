export const EXAMPLE = 'example.txt'
export const INPUT = 'input.txt'

export const WORD = /\s/g
export const LINE = '\n'
export const PARAGRAPH = '\n\n'

export class InputHandler {
  private puzzleDay: string
  private inputDir: string
  constructor(cwd: string) {
    this.puzzleDay = path.basename(cwd)
    this.inputDir = path.join(cwd, `../../input/${this.puzzleDay}`)
  }
  toString = (file: string): string => fs.readFileSync(`${this.inputDir}/${file}`).toString()
  toArray = (file: string, delim: string | RegExp = LINE): string[] =>
    this.toString(file).split(delim)
}

export class Logger {
  private events: unknown[]
  constructor() {
    this.events = []
  }
  log = (...messages: unknown[]): void => {
    this.events.push(messages)
  }
  dump = (): void => this.events.forEach(event => console.debug(event))
  clear = (): void => {
    this.events.splice(0, this.events.length)
  }
}

export function bench<T>(logger: Logger, name: string, func: () => T, expected?: T) {
  const start = performance.now()
  const result = func()
  const end = performance.now()

  let duration = end - start

  const assert =
    typeof expected !== 'undefined' && result !== expected ? ` !!! EXPECTED ${expected} !!!` : ''

  if (typeof result === 'string' && /\n/.test(result)) {
    console.log('%s: [%s]%c%s', name, duration.toFixed(2) + 'ms', 'color: red', assert)
    console.log(result)
    return
  }

  if (assert === '') {
    logger.clear()
    console.log('%s: %o [%s]%c%s', name, result, duration.toFixed(2) + 'ms', 'color: red')
    return
  }
  logger.dump()
  console.log('%s: %o %c%s', name, result, 'color: red', assert)
  throw ''
}

export const sum = (acc: number, cal: number): number => acc + cal
export const product = (acc: number, cal: number): number => acc * cal
export const numSort = (a: number, b: number): number => a - b
export const numSortR = (a: number, b: number): number => b - a

export const stringBisect = (str: string): [string, string] => [
  str.slice(0, str.length / 2),
  str.slice(str.length / 2),
]
export const stringFindCommon = (a: string, b: string): string[] =>
  [...a].filter(a => b.includes(a))

export const intDiv = (numerator: number, divisor: number): [number, number] => [
  Math.floor(numerator / divisor),
  numerator % divisor,
]
export const reshape = <T,>(flat: T[], width: number): T[][] =>
  flat.reduce(
    (rect, cell, index) => {
      const col = Math.floor(index / width)
      const row = index % width
      rect[col] ??= []
      rect[col][row] = cell
      return rect
    },
    [[]] as T[][]
  )

export const transpose = <T,>(matrix: T[][]): T[][] =>
  matrix.reduce((prev, next) => next.map((_, i) => (prev[i] ?? []).concat(next[i])), [[]] as T[][])

export const range = (
  start: number,
  finish: number,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): number[] => {
  const response: number[] = []
  for (let i = Math.max(start, min); i <= Math.min(finish, max); i++) response.push(i)
  return response
}

export const getGrid = <T,>(filling: () => T, x: number, y?: number): T[][] =>
  new Array(x).fill(undefined).map(_ => new Array(y ?? x).fill(undefined).map(_ => filling()))
