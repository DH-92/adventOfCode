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

const inputHandler = new InputHandler(process.cwd())

type State = {
  registers: bigint[]
  output: number[]
}

const part1 = (path: string): string | number => {
  const [para1, para2] = inputHandler.toArray(path, PARAGRAPH)
  const registers = para1.split(LINE).flatMap(line => line.match(/(\d+)/g)!.map(Number))
  const commands = para2.split(LINE).flatMap(line => line.match(/(\d+)/g)!.map(Number))
  registers[3] = 0
  const output = [] as number[]
  const ops = [
    // adv
    (operand: number) => (registers[0] >>= operand < 4 ? operand : registers[operand - 4]),
    // bxl
    (operand: number) => (registers[1] ^= operand),
    // bst
    (operand: number) => (registers[1] = operand < 4 ? operand : registers[operand - 4] & 7),
    // jnz
    (operand: number) => registers[0] ^ 0 && (registers[3] = operand - 2),
    // bxc
    (operand: number) => (registers[1] ^= registers[2]),
    // out
    (operand: number) => output.push(operand < 4 ? operand : registers[operand - 4] & 7),
    // bdv
    (operand: number) =>
      (registers[1] = registers[0] >> (operand < 4 ? operand : registers[operand - 4])),
    // cdv
    (operand: number) =>
      (registers[2] = registers[0] >> (operand < 4 ? operand : registers[operand - 4])),
  ]
  while (true) {
    if (registers[3] >= commands.length - 1) break
    const a = commands[registers[3]]
    const b = commands[registers[3] + 1]
    ops[a](b)
    registers[3] += 2
  }
  return output.join(',')
}

const part2 = (path: string): bigint => {
  const [, para2] = inputHandler.toArray(path, PARAGRAPH)
  const commands = para2.split(LINE).flatMap(line => line.match(/(\d+)/g)!.map(BigInt))

  // this is a specific solver for my specific input
  // 2,4, // bst
  // 1,5, // bxl
  // 7,5, // cdv
  // 4,3, // bxc
  // 1,6, // bxl
  // 0,3, // adv
  // 5,5, // out
  // 3,0, // jnz

  // do {
  //   // 2,4
  //   regB = regA & 7;
  //   // 1,5
  //   regB ^= 5;
  //   // 7,5
  //   regC = regB >> regA;
  //   // 4,3
  //   regB ^= regC;
  //   // 1,6
  //   regB ^= regC;
  //   // 0,3
  //   regA = regA >> 3;
  //   // 5,5
  //   output.push(regB & 7);
  // } while(regA) // 3,0

  // this function is the inside of the do while loop
  // at most the last 10 bits of the input are used
  // this allows to build a lookup table of all possible 10 bit inputs that will result in the correct output
  function solve(a: bigint): bigint {
    const b = (a & 7n) ^ 5n
    return b ^ (a >> b) & 7n ^ 6n
  }

  const check = (a: bigint, i: number): boolean => {
    // because only the last 10 digits are used
    // we can mask the input to only the last 10 digits
    // const usedDigits = Number(a) & 2**10 - 1
    for (let l = 0; l < i; l++) {
      if (solve(a & 1023n) !== commands[l]) return false
      a >>= 3n
    }
    return true
  }

  const reverseMap = new Map<bigint, bigint[]>()
  for (let i = 0n; i < 8n; i++) {
    reverseMap.set(i, [])
  }
  for (let i = 0n; i < 1024n; i++) {
    reverseMap.get(solve(i))!.push(i)
  }
  const values = commands.map((c, i) => reverseMap.get(c)!.map(v => v << (BigInt(i) * 3n)))

  let options: bigint[] = [0n]
  for (let l = 0; l < commands.length; l++) {
    const filtered = values[l].flatMap(v => options.map(o => v | o))
    options = Array.from(new Set(filtered)).filter(v => check(v, l+1))
  }
  return options.sort((a, b) => {
    if (a > b) return 1
    if (a < b) return -1
    return 0
  })[0]
}
const logger = new Logger()

bench(logger, 'part 1 example', () => part1(EXAMPLE), '4,6,3,5,6,3,5,2,1,0')
bench(logger, 'part 1 input', () => part1(INPUT), '7,3,5,7,5,7,4,3,0')
// bench(logger, 'part 2 example', () => part2('example2.txt'), 117440)
bench(logger, 'part 2 input', () => part2(INPUT), 105734774294938n)
