#!/usr/bin/env npx tsx --watch

// 2,4, // bst
// 1,5, // bxl
// 7,5, // cdv
// 4,3, // bxc
// 1,6, // bxl
// 0,3, // adv
// 5,5, // out
// 3,0, // jnz

const result = [2, 4, 1, 5, 7, 5, 4, 3, 1, 6, 0, 3, 5, 5, 3, 0]

class Solver {
  solve(a: number) {
    const b = (a & 7) ^ 5
    const c = (a >> b) & 7
    return b ^ 6 ^ c
  }
}

const check = (a: bigint, target: number[], log = false) => {
  let l = 0
  while (a) {
    const res = solver.solve(Number(a) & 1023)
    if (res !== target[l]) {
      if (target[l] === undefined) break
      return false
    }
    l++
    a = a >> 3n
  }
  return true
}

const reverseMap = [] as Array<bigint[]>
const solver = new Solver()
for (let i = 0; i < 1024; i++) {
  const res = solver.solve(i)
  reverseMap[res] ??= []
  reverseMap[res].push(BigInt(i))
}

let options: bigint[] = [0n]
for (let l = 0; l < result.length; l++) {
  const target = result[l]
  const values = reverseMap[target].map(v => v << BigInt(3 * l))
  const valueOptions = values.flatMap(v => options.map(o => v | o))
  const filtered = Array.from(new Set(valueOptions.filter(v => check(v, result.slice(0, l + 1)))))
  options = filtered
}
const answer = options.sort((a, b) => {
  if (a > b) return 1
  if (a < b) return -1
  return 0
})[0]
if (!check(answer, result)) throw new Error('nope')
console.log(answer)

// const solver = new Solver()
// // 281476976904602
// for (let i = 2 ** (3 * 17); i < 2.0000001 ** (3 * 17); i++) {
//   // for (let i = 0; i <= 61156655; i++) {
//   if (i % 1_000_000_000 === 0) console.log(i / 1_000_000_000, ' billion')
//   let regA = i
//   let l = 0
//   while (regA) {
//     const res = solver.solve(regA & 1023)
//     if (res !== result[l]) {
//       if (l > 8) console.log(`break at ${l} from: ${i}`)
//       break
//     }
//     l++
//     regA = regA >> 3
//   }
//   if (l > 10) {
//     console.log('finished?', i)
//     process.exit(0)
//   }
// }

// do {
//   // 2,4 == bst(4)
//   // regB = regA % 8;
//   regB = regA & 7;
//   // 1,5 == bxl(5)
//   regB ^= 5;
//   // 7,5 == cdv(5)
//   let regC = regA >> regB;
//   // 4,3 == bxc(3)
//   regB ^= regC;
//   // 1,6 == bxl(6)
//   regB ^= 6;
//   // 0,3
//   regA = regA >> 3;
//   // 5,5
//   // const res = regB % 8
//   const res = regB & 7
//   output.push(res);
//   if (res !== result[l]) {
//     if (l > 2) console.log(i, i.toString(8), output)
//     break
//   }
//   l++
// } while(regA) // 3,0
// do {
//   let regB = (regA & 7) ^ 5
//   const b1 = regB
//   const regC = regA >> regB
//   const regCx = (regA & 2047) >> regB
//   if (regC !== regCx) {
//     console.log('miss', { i, regA, regB, regC, regCx })
//     process.exit(1)
//   }
//   // console.log('c', {i, regA, regB, regC})
//   regB ^= regC ^ 6
//   const b2 = regB
//   // console.log('d', {regA, b1, regC, b2})

//   // console.log('e', {regA, regB, regC})
//   const res = (b1 ^ regC ^ 6) & 7
//   const resX = (b1 ^ regCx ^ 6) & 7
//   console.log('f', { regA, b1, regC, regCx, b2, res, resX })
//   output.push(res)
//   break
//   if (res !== result[l]) {
//     // console.log(i, i.toString(8), output)
//     break
//   }
//   l++
//   regA = regA >> 3
// } while (regA) // 3,0
// if (output.toString() === result.toString()) {
//   console.log(i)
//   process.exit(0)
// }
