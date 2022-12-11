const isDivisble = (x, y) => +x % +y === 0
const divTest = (x,a,b,c) => isDivisble(x,a) ? b : c

export const exampleMonkeys = [
    {
        items: [79, 98],
        operation: (x) => x * 19,
        test: (x) => divTest(x, 23, 2, 3),
        divisor: 23
    }, {
        items: [54, 65, 75, 74],
        operation: (x) => x + 6,
        test: (x) => divTest(x, 19, 2, 0),
        divisor: 19,
    }, {
        items: [79, 60, 97],
        operation: (x) => x * +x,
        test: (x) => divTest(x, 13, 1, 3),
        divisor: 13,
    }, {
        items: [74],
        operation: (x) => x + 3,
        test: (x) => divTest(x, 17, 0, 1),
        divisor: 17,
    }
]

export const realMonkeys = [
    {
        items: [64],
        operation: (x) => x * 7,
        test: (x) => divTest(x, 13, 1, 3),
        divisor: 13,
    }, {
        items: [60, 84, 84, 65],
        operation: (x) => x + 7,
        test: (x) => divTest(x, 19, 2, 7),
        divisor: 19,
    }, {
        items: [52, 67, 74, 88, 51, 61],
        operation: (x) => x * 3,
        test: (x) => divTest(x, 5, 5, 7),
        divisor: 5,
    }, {
        items: [67, 72],
        operation: (x) => x + 3,
        test: (x) => divTest(x, 2, 1, 2),
        divisor: 2,
    }, {
        items: [80, 79, 58, 77, 68, 74, 98, 64],
        operation: (x) => x * +x,
        test: (x) => divTest(x, 17, 6, 0),
        divisor: 17,
    }, {
        items: [62, 53, 61, 89, 86],
        operation: (x) => x + 8,
        test: (x) => divTest(x, 11, 4, 6),
        divisor: 11,
    }, {
        items: [86, 89, 82],
        operation: (x) => x + 2,
        test: (x) => divTest(x, 7, 3, 0),
        divisor: 7,
    }, {
        items: [92, 81, 70, 96, 69, 84, 83],
        operation: (x) => x + 4,
        test: (x) => divTest(x, 3, 4, 5),
        divisor: 3,
    }
]

const part1 = (monkeys) => {
    monkeys.forEach(monkey => monkey.touches = 0);
    const worryDrop = (worry) => Math.floor(worry / 3);
    for (let round = 1; round <= 20; round++) {
        monkeys.forEach((monkey) => {
            const { items, operation, test } = monkey;
            while (items.length > 0) {
                let item = items.shift();
                item = operation(item);
                item = worryDrop(item);
                const target = test(item);
                monkeys[target].items.push(item);
                monkey.touches++;
            }
        })
    }
    return monkeys
        .map(({touches}) => touches)
        .sort((a, b) => a - b)
        .splice(-2)
        .reduce((acc, x) => acc * x)
}

const part2 = (monkeys) => {
    monkeys.forEach(monkey => monkey.touches = 0);
    const drop = monkeys.reduce((acc, monkey) => acc *= monkey.divisor, 1);
    const worryDrop = (x) => x % drop;
    for (let round = 1; round <= 10000; round++) {
        monkeys.forEach((monkey) => {
            const { items, operation, test} = monkey;
            while (items.length) {
                let worryLevel = worryDrop(operation(items.shift()));
                monkeys[test(worryLevel)].items.push(worryLevel);
                monkey.touches++;
            }
        })
    }
    return monkeys
        .map(({touches}) => touches)
        .sort((a, b) => a - b)
        .splice(-2)
        .reduce((acc, x) => acc * x)
}

console.log("part1 -- example: ", part1(exampleMonkeys))
console.log("part1 -- example: ", part1(realMonkeys))

console.log("part2 -- example: ",part2(exampleMonkeys))
console.log("part2 -- input:   ",part2(realMonkeys))
