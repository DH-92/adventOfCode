// SOURCE:
// https://github.dev/darrylhodgins/typescript-memoize/blob/master/src/memoize-decorator.ts

interface MemoizeArgs {
  expiring?: number
  hashFunction?: boolean | ((...args: any[]) => any)
  tags?: string[]
}

const isNullish = (value: any): boolean => value === null || value === undefined

export function Memoize(args?: MemoizeArgs | MemoizeArgs['hashFunction']) {
  let hashFunction: MemoizeArgs['hashFunction']
  let duration: MemoizeArgs['expiring']
  let tags: MemoizeArgs['tags']

  if (typeof args === 'object') {
    hashFunction = args.hashFunction
    duration = args.expiring
    tags = args.tags
  } else {
    hashFunction = args
  }

  return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    if (!isNullish(descriptor.value)) {
      descriptor.value = getNewFunction(descriptor.value, hashFunction, duration, tags)
    } else if (descriptor.get) {
      descriptor.get = getNewFunction(descriptor.get, hashFunction, duration, tags)
    } else {
      throw 'Only put a Memoize() decorator on a method or get accessor.'
    }
  }
}

export function MemoizeExpiring(expiring: number, hashFunction?: MemoizeArgs['hashFunction']) {
  return Memoize({
    expiring,
    hashFunction,
  })
}

const clearCacheTagsMap: Map<string, Map<any, any>[]> = new Map()

export function clear(tags: string[]): number {
  const cleared: Set<Map<any, any>> = new Set()
  for (const tag of tags) {
    const maps = clearCacheTagsMap.get(tag)
    if (maps) {
      for (const mp of maps) {
        if (!cleared.has(mp)) {
          mp.clear()
          cleared.add(mp)
        }
      }
    }
  }
  return cleared.size
}

function getNewFunction(
  originalMethod: () => void,
  hashFunction?: MemoizeArgs['hashFunction'],
  duration = 0,
  tags?: MemoizeArgs['tags'],
) {
  const propMapName = Symbol(`__memoized_map__`)

  // The function returned here gets called instead of originalMethod.
  return function (...args: unknown[]) {
    // Get or create map
    if (!Object.hasOwn(this, propMapName)) {
      Object.defineProperty(this, propMapName, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Map<any, any>(),
      })
    }
    const myMap: Map<any, any> = this[propMapName]

    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (clearCacheTagsMap.has(tag)) {
          clearCacheTagsMap.get(tag)!.push(myMap)
        } else {
          clearCacheTagsMap.set(tag, [myMap])
        }
      }
    }

    if (!hashFunction && args.length === 0 && duration <= 0) {
      const hashKey = this
      if (myMap.has(hashKey)) {
        return myMap.get(hashKey)
      }
      const returnedValue = originalMethod.apply(this, args)
      myMap.set(hashKey, returnedValue)
      return returnedValue
    }

    // If true is passed as first parameter, will automatically use every argument, passed to string
    const hashKey = (() => {
      if (hashFunction === true) {
        return JSON.stringify(args)
      }
      if (hashFunction) {
        return hashFunction.apply(this, args)
      }
      return args[0]
    })()

    const timestampKey = `${hashKey}__timestamp`
    let isExpired = false
    if (duration > 0) {
      if (!myMap.has(timestampKey)) {
        // "Expired" since it was never called before
        isExpired = true
      } else {
        const timestamp = myMap.get(timestampKey)
        isExpired = Date.now() - timestamp > duration
      }
    }

    if (myMap.has(hashKey) && !isExpired) {
      return myMap.get(hashKey)
    }

    const returnedValue = originalMethod.apply(this, args)
    myMap.set(hashKey, returnedValue)
    if (duration > 0) {
      myMap.set(timestampKey, Date.now())
    }
    return returnedValue
  }
}
