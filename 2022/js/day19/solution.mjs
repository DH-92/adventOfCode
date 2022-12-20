#!/usr/bin/env zx
import "zx/globals";
import fs from 'fs';
const day = "day19";
const input = `../../input/${day}/input.txt`
const example = `../../input/${day}/example.txt`

const fileToArr = (path, delim = '\n') => fs.readFileSync(path).toString().split(delim)
let count = 0;
const calc = (path, rounds) => {
    const input = fileToArr(path).map(l => l.split(' ').map(w => w.replace(/[^\d]/g, '')).filter(w => !!w).map(Number));

    const ORE_BOTS = 0;
    const ORE = 1;
    const CLAY_BOTS = 2;
    const CLAY = 3;
    const OBSIDIAN_BOTS = 4;
    const OBSIDIAN = 5;
    const GEODE_BOTS = 6;
    const GEODE = 7;

    const initState = [
        1, //ore bots
        0, //ore count
        0, //clay bots
        0, //clay count
        0, //obsidian bots
        0, //obsidian count
        0, //geode bots
        0, //geode count
    ]

    const farm = (state) => {
        state[ORE] += state[ORE_BOTS];
        state[CLAY] += state[CLAY_BOTS];
        state[OBSIDIAN] += state[OBSIDIAN_BOTS];
        state[GEODE] += state[GEODE_BOTS];
        return state;
    }

    let sum = 0;
    [input[0],input[1]].forEach((l) => {
        const [
            bluePrintId,
            buildOreBotOre,
            buildClayBotOre,
            buildObsidianOre,
            buildObsidianClay,
            buildGeodeOre,
            buildGeodeObsidian,
        ] = l;

        const canBuildOreBot = (state) => 
            state[ORE] >= buildOreBotOre &&
            state[ORE_BOTS] < Math.max(buildOreBotOre, buildClayBotOre, buildObsidianOre, buildGeodeOre)
        

        const canBuildClayBot = (state) => 
            state[ORE] >= buildClayBotOre &&
            state[CLAY_BOTS] < buildObsidianClay
        

        const canBuildObsidianBot = (state) => 
            state[CLAY_BOTS] !== 0 &&
            state[CLAY] >= buildObsidianClay &&
            state[ORE] >= buildObsidianOre &&
            state[OBSIDIAN_BOTS] < buildGeodeObsidian
        

        const canBuildGeodeBot = (state) => 
            state[OBSIDIAN_BOTS] !== 0 &&
            state[ORE] >= buildGeodeOre &&
            state[OBSIDIAN] >= buildGeodeObsidian
        

        const buildOreBot = (state) => {
            state[ORE] -= buildOreBotOre;
            state[ORE_BOTS]++;
            state[ORE]--
            return state;
        }
        const buildClayBot = (state) => {
            state[ORE] -= buildClayBotOre;
            state[CLAY_BOTS]++;
            state[CLAY]--;
            return state;
        }

        const buildObsidianBot = (state) => {
            state[ORE] -= buildObsidianOre;
            state[CLAY] -= buildObsidianClay;
            state[OBSIDIAN_BOTS]++;
            state[OBSIDIAN]--;
            return state;
        }

        const buildGeodeBot = (state) => {
            state[ORE] -= buildGeodeOre;
            state[OBSIDIAN] -= buildGeodeObsidian;
            state[GEODE_BOTS]++;
            state[GEODE]--;
            return state;
        }

        let best = 0;
        const caches = new Array(33).fill(null).map(x => 
            new Array(20).fill(null).map(y =>
                new Array(buildObsidianClay+10).fill(null).map(z => {
                    new Array(buildGeodeObsidian+2).fill(null).map(i => [])}
                )
            )
        )
        // let count = 0;
        const turn = (state, turns) => {
            if (turns === 0) {
                best = Math.max(best, state[GEODE])
                return state[GEODE]
            }
            count++;
            // echo(state[ORE_BOTS])
            // console.log(caches[turns].length)

            // caches[turns][state[ORE_BOTS]] ??= []
            caches[turns][state[ORE_BOTS]][state[CLAY_BOTS]] ??= []
            caches[turns][state[ORE_BOTS]][state[CLAY_BOTS]][state[OBSIDIAN_BOTS]] ??= []
            caches[turns][state[ORE_BOTS]][state[CLAY_BOTS]][state[OBSIDIAN_BOTS]][state[ORE]] ??= []
            caches[turns][state[ORE_BOTS]][state[CLAY_BOTS]][state[OBSIDIAN_BOTS]][state[ORE]][state[CLAY]] ??= []
            caches[turns][state[ORE_BOTS]][state[CLAY_BOTS]][state[OBSIDIAN_BOTS]][state[ORE]][state[CLAY]][state[OBSIDIAN]] ??= []
            caches[turns][state[ORE_BOTS]][state[CLAY_BOTS]][state[OBSIDIAN_BOTS]][state[ORE]][state[CLAY]][state[OBSIDIAN]][state[GEODE_BOTS]] ??= []
            const cache =
            caches[turns][state[ORE_BOTS]][state[CLAY_BOTS]][state[OBSIDIAN_BOTS]][state[ORE]][state[CLAY]][state[OBSIDIAN]][state[GEODE_BOTS]]
            try {
                if (cache[state[GEODE]] !== undefined) return cache[state[GEODE]];
            } catch (err) {
                echo (state);
                process.exit(1)
            }
            // prune this branch if it'd be impossible to beat the current record
            // even if we made a new geode bot every single turn
            if (best > (state[GEODE] + state[GEODE_BOTS] * turns + turns * (turns + 1) / 2)) return 0;
            const states = []
            if (canBuildGeodeBot(state)) {
                states.push(buildGeodeBot([...state]))
            } else {
                states.push(state)
                if (canBuildObsidianBot(state)) states.push(buildObsidianBot([...state]));
                if (canBuildClayBot(state)) states.push(buildClayBot([...state]));
                if (canBuildOreBot(state)) states.push(buildOreBot([...state]));
            }

            return cache[state[GEODE]] = Math.max(...states.map(s => turn(farm(s), turns - 1)))
        }
        // console.table(bests)
        const a = turn(initState.slice(0), rounds);
        echo("finished a plan: ",bluePrintId," got ", a, " after ",count)
        // sum *= (a * bluePrintId)
        sum += (a * bluePrintId)
    })
    return sum;
}

console.time()
// console.log(`part1 -- example: ${calc(example, 24)}`)
// console.log(`part1 -- input: ${calc(input, 24)}`)
console.log(`part1 -- example: ${calc(example,32)}`)
// console.log(`part1 -- input: ${calc(input,32)}`)
console.timeLog()