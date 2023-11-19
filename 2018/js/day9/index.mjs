#!/usr/bin/env zx

class Marble {
  constructor(value, left = this, right = this) {
    this.value = value;
    this.left = left;
    this.right = right;
    left.right = this;
    right.left = this;
  }
}

const solve = (playerCount = 9, turns = 25) => {
  const players = new Array(playerCount + 1).fill(0);
  let current = new Marble(0);
  for (let turn = 1; turn <= turns; turn++) {
    if (turn % 23) {
      current = new Marble(turn, current.right, current.right.right);
      continue;
    }
    for (let i = 0; i < 7; i++) current = current.left;
    players[1 + ((turn - 1) % playerCount)] += current.value + turn;
    current.left.right = current.right;
    current.right.left = current.left;
    current = current.right;
  }
  return players.sort().reverse()[0];
};

console.time('p1e');
console.log(`part1 -- example: ${solve()}`);
console.timeEnd('p1e');
console.time('p1e');
console.log(`part1 -- part 1: ${solve(493, 71863)}`);
console.timeEnd('p1e');
console.time('p1');
console.log(`part2 -- part 2: ${solve(493, 7186300)}`);
console.timeEnd('p1');
