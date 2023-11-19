export const word = ' ';
export const line = '\n';
export const emptyLine = '\n\n';
export const example = 'example.txt';
export const input = 'input.txt';

export class InputHandler {
  constructor(cwd) {
    this.puzzleDay = path.basename(cwd);
    this.inputDir = path.join(cwd, `../../input/${this.puzzleDay}`);
  }
  toString = (file) => fs.readFileSync(`${this.inputDir}/${file}`).toString();
  toArray = (file, delim = line) => this.toString(file).split(delim);
}

export const fileToString = path => fs.readFileSync(path).toString();
export const fileToArr = (path, delim = line) =>
  fs.readFileSync(path).toString().split(delim);
export const sum = (acc, cal) => Number(acc) + Number(cal);
export const numSort = (a, b) => +a - b;
export const numSortR = (a, b) => b - a;

export const stringBisect = str => [
  str.slice(0, str.length / 2),
  str.slice(str.length / 2),
];
export const stringFindCommon = (a, b) => [...a].filter(a => b.includes(a));

export const intDiv = (numerator, divisor) => [
  Math.floor(numerator / divisor),
  numerator % divisor,
];
export const reshape = (flat, width) =>
  flat.reduce((rect, cell, index) => {
    const col = Math.floor(index / width);
    const row = index % width;
    rect[col] ??= [];
    rect[col][row] = cell;
    return rect;
  }, []);

export const transpose = matrix => matrix.reduce((prev, next) =>
  next.map((_, i) => (prev[i] ?? []).concat(next[i])), []
);
