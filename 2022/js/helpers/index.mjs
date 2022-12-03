export const fileToString = (path) => fs.readFileSync(path).toString()
export const fileToArr = (path,delim = '\n') => fs.readFileSync(path).toString().split(delim)
export const sum = (acc, cal) => Number(acc) + Number(cal)
export const numSort = (a, b) => a - b;
export const numSortR = (a, b) => b - a;



export const stringBisect = (str) => [str.slice(0,str.length/2),str.slice(str.length/2)]
export const stringFindCommon = (a, b) => [...a].filter(a => b.includes(a))
export const reshape = (flat, width) => flat.reduce((rect,cell,index) => {
    const col = Math.floor(index / width);
    const row = index % width;
    rect[col] ??= [];
    rect[col][row] = cell;
    return rect;
},[])